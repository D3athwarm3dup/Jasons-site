"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Settings {
  sp_decking_title?: string;
  sp_decking_tagline?: string;
  sp_decking_description?: string;
  sp_decking_features?: string;
  sp_decking_image?: string;
  sp_sheds_title?: string;
  sp_sheds_tagline?: string;
  sp_sheds_description?: string;
  sp_sheds_features?: string;
  sp_sheds_image?: string;
}

const DEFAULTS: Required<Settings> = {
  sp_decking_title: "Decking",
  sp_decking_tagline: "Create the outdoor entertaining space you've always wanted",
  sp_decking_description:
    "From simple ground-level decks to multi-level masterpieces, we design and build timber and composite decks to suit your home, block, and budget.",
  sp_decking_features:
    "Hardwood & softwood timber options,Composite & Trex decking,Ground-level & elevated decks,Wraparound & multi-level designs,Built-in seating & planters,Deck lighting integration,Council approval managed,10-year structural warranty",
  sp_decking_image: "",
  sp_sheds_title: "Sheds",
  sp_sheds_tagline: "The extra space you need, built to last",
  sp_sheds_description:
    "Whether you need a garden shed, workshop, man cave, or large rural storage shed - we build to your exact specifications using quality materials.",
  sp_sheds_features:
    "Custom sizing & layout,Colorbond steel options,Timber frame construction,Concrete slab & footings,Roller doors & personnel doors,Windows & skylights,Internal fit-out options,Council approval managed",
  sp_sheds_image: "",
};

const SERVICES_KEYS = Object.keys(DEFAULTS) as (keyof Settings)[];

type UploadTarget = "decking" | "sheds";

export default function AdminServicesPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<UploadTarget | null>(null);
  const [uploadError, setUploadError] = useState("");

  const deckingRef = useRef<HTMLInputElement>(null);
  const shedsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/site-settings")
      .then((r) => r.json())
      .then((data: Settings) => { setSettings(data); setLoading(false); })
      .catch(() => { setLoading(false); setError("Could not load saved settings."); });
  }, []);

  function set(key: keyof Settings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function val(key: keyof Settings): string {
    return settings[key] || DEFAULTS[key] || "";
  }

  // Features stored comma-separated, shown newline-separated for editing
  function featuresDisplay(key: keyof Settings): string {
    const v = settings[key] ?? DEFAULTS[key] ?? "";
    return v.split(",").map((f) => f.trim()).filter(Boolean).join("\n");
  }

  function featuresFromDisplay(text: string): string {
    return text.split("\n").map((f) => f.trim()).filter(Boolean).join(",");
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, target: UploadTarget) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(target);
    setUploadError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setUploading(null);
    if (res.ok) {
      const data = await res.json();
      const keyMap: Record<UploadTarget, keyof Settings> = {
        decking: "sp_decking_image",
        sheds: "sp_sheds_image",
      };
      const imageKey = keyMap[target];
      const newVal = data.url as string;
      setSettings((prev) => ({ ...prev, [imageKey]: newVal }));
      // Auto-save image to DB immediately
      await fetch("/api/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [imageKey]: newVal }),
      });
    } else {
      setUploadError("Upload failed. Please try again.");
    }
    e.target.value = "";
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    const payload = Object.fromEntries(
      SERVICES_KEYS.map((k) => [k, settings[k] ?? ""])
    );
    const res = await fetch("/api/site-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    else setError("Failed to save. Please try again.");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#2C2C2C] font-[var(--font-heading)]">
          Services Page
        </h1>
        <p className="text-[#8C8277] mt-1 text-sm">
          Edit the service cards and features on the /services page. To edit the hero banner, go to Page Heroes.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">

        {/* Decking Service */}
        <ServiceCard
          title="Decking Service Card"
          subtitle="The decking section on the services page."
          imageValue={val("sp_decking_image")}
          imageRef={deckingRef}
          uploading={uploading === "decking"}
          onUpload={(e) => handleUpload(e, "decking")}
          onRemoveImage={() => { set("sp_decking_image", ""); fetch("/api/site-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sp_decking_image: "" }) }); }}
          fields={[
            { label: "Title", value: val("sp_decking_title"), placeholder: DEFAULTS.sp_decking_title, onChange: (v) => set("sp_decking_title", v) },
            { label: "Tagline", value: val("sp_decking_tagline"), placeholder: DEFAULTS.sp_decking_tagline, onChange: (v) => set("sp_decking_tagline", v) },
            { label: "Description", value: val("sp_decking_description"), placeholder: DEFAULTS.sp_decking_description, onChange: (v) => set("sp_decking_description", v), textarea: true },
          ]}
          featuresValue={featuresDisplay("sp_decking_features")}
          onFeaturesChange={(v) => set("sp_decking_features", featuresFromDisplay(v))}
          featuresPlaceholder={featuresDisplay("sp_decking_features") || DEFAULTS.sp_decking_features.split(",").join("\n")}
        />

        {/* Sheds Service */}
        <ServiceCard
          title="Sheds Service Card"
          subtitle="The sheds section on the services page."
          imageValue={val("sp_sheds_image")}
          imageRef={shedsRef}
          uploading={uploading === "sheds"}
          onUpload={(e) => handleUpload(e, "sheds")}
          onRemoveImage={() => { set("sp_sheds_image", ""); fetch("/api/site-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sp_sheds_image: "" }) }); }}
          fields={[
            { label: "Title", value: val("sp_sheds_title"), placeholder: DEFAULTS.sp_sheds_title, onChange: (v) => set("sp_sheds_title", v) },
            { label: "Tagline", value: val("sp_sheds_tagline"), placeholder: DEFAULTS.sp_sheds_tagline, onChange: (v) => set("sp_sheds_tagline", v) },
            { label: "Description", value: val("sp_sheds_description"), placeholder: DEFAULTS.sp_sheds_description, onChange: (v) => set("sp_sheds_description", v), textarea: true },
          ]}
          featuresValue={featuresDisplay("sp_sheds_features")}
          onFeaturesChange={(v) => set("sp_sheds_features", featuresFromDisplay(v))}
          featuresPlaceholder={featuresDisplay("sp_sheds_features") || DEFAULTS.sp_sheds_features.split(",").join("\n")}
        />

        {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex items-center gap-4 pb-8">
          <button type="submit" disabled={saving}
            className="px-8 py-3 bg-[#8B5E3C] text-white font-semibold rounded-lg hover:bg-[#7A4F30] transition-colors disabled:opacity-50 text-sm">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {saved && <span className="text-[#3D5A3E] text-sm font-medium">Saved successfully!</span>}
        </div>
      </form>
    </div>
  );
}

/* ---- Reusable sub-components ---- */

function Field({
  label, value, placeholder, onChange, textarea, hint,
}: {
  label: string; value: string; placeholder: string; onChange: (v: string) => void; textarea?: boolean; hint?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-[#2C2C2C]">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3}
          className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent resize-none" />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent" />
      )}
      {hint && <p className="text-xs text-[#8C8277]">{hint}</p>}
    </div>
  );
}

function ServiceCard({
  title, subtitle, imageValue, imageRef, uploading, onUpload, onRemoveImage,
  fields, featuresValue, onFeaturesChange, featuresPlaceholder,
}: {
  title: string; subtitle: string;
  imageValue: string;
  imageRef: React.RefObject<HTMLInputElement | null>;
  uploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  fields: { label: string; value: string; placeholder: string; onChange: (v: string) => void; textarea?: boolean }[];
  featuresValue: string;
  onFeaturesChange: (v: string) => void;
  featuresPlaceholder: string;
}) {
  return (
    <section className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#FAF5EE]">
        <h2 className="font-semibold text-[#2C2C2C]">{title}</h2>
        <p className="text-xs text-[#8C8277] mt-0.5">{subtitle}</p>
      </div>
      <div className="p-6 space-y-5">
        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Card Image</label>
          <div className="flex items-start gap-4">
            <div
              className="w-40 h-24 rounded-lg border-2 border-dashed border-[#E8DDD0] overflow-hidden flex items-center justify-center bg-[#F5F0EB] shrink-0 cursor-pointer"
              onClick={() => imageRef.current?.click()}
            >
              {imageValue ? (
                <Image src={imageValue} alt="Service" width={160} height={96} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-[#8C8277] text-center px-2">Click to upload</span>
              )}
            </div>
            <div className="space-y-2">
              <input ref={imageRef} type="file" accept="image/*" aria-label="Upload service image" className="hidden" onChange={onUpload} />
              <button type="button" onClick={() => imageRef.current?.click()}
                className="px-4 py-2 bg-[#8B5E3C] text-white rounded text-sm font-medium hover:bg-[#7A4F30] transition-colors disabled:opacity-50"
                disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Image"}
              </button>
              {imageValue && (
                <button type="button" onClick={onRemoveImage}
                  className="block px-4 py-2 border border-[#E8DDD0] text-[#8C8277] rounded text-sm hover:border-red-300 hover:text-red-500 transition-colors">
                  Remove Image
                </button>
              )}
              <p className="text-xs text-[#8C8277]">Shown alongside the service description.</p>
            </div>
          </div>
        </div>

        {fields.map((f) => (
          <Field key={f.label} {...f} />
        ))}

        {/* Features */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-[#2C2C2C]">Features</label>
          <textarea
            value={featuresValue}
            onChange={(e) => onFeaturesChange(e.target.value)}
            placeholder={featuresPlaceholder}
            rows={8}
            className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent resize-none font-mono"
          />
          <p className="text-xs text-[#8C8277]">One feature per line. Each line becomes a bullet point on the page.</p>
        </div>
      </div>
    </section>
  );
}
