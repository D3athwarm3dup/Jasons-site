"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Settings {
  sp_hero_bg_image?: string;
  sp_hero_label?: string;
  sp_hero_heading?: string;
  pp_hero_bg_image?: string;
  pp_hero_label?: string;
  pp_hero_heading?: string;
  pp_hero_subtext?: string;
  ap_hero_bg_image?: string;
  ap_hero_label?: string;
  ap_hero_heading?: string;
  cp_hero_bg_image?: string;
  cp_hero_label?: string;
  cp_hero_heading?: string;
  cp_hero_subtext?: string;
}

const DEFAULTS: Required<Settings> = {
  sp_hero_bg_image: "",
  sp_hero_label: "What We Build",
  sp_hero_heading: "Services That Transform Your Property",
  pp_hero_bg_image: "",
  pp_hero_label: "Our Work",
  pp_hero_heading: "Completed Projects",
  pp_hero_subtext: "Every project is a source of pride. Browse our completed work across Adelaide and surrounds.",
  ap_hero_bg_image: "",
  ap_hero_label: "Our Story",
  ap_hero_heading: "About Norris Decking & Sheds",
  cp_hero_bg_image: "",
  cp_hero_label: "Let's Talk",
  cp_hero_heading: "Get In Touch",
  cp_hero_subtext: "Ready to start your project? Or just want to ask a few questions? Jason is happy to chat - no pressure.",
};

const PAGES_KEYS = Object.keys(DEFAULTS) as (keyof Settings)[];

type UploadTarget = "services" | "projects" | "about" | "contact";

export default function AdminPagesPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<UploadTarget | null>(null);
  const [uploadError, setUploadError] = useState("");

  const spRef = useRef<HTMLInputElement>(null);
  const ppRef = useRef<HTMLInputElement>(null);
  const apRef = useRef<HTMLInputElement>(null);
  const cpRef = useRef<HTMLInputElement>(null);

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
        services: "sp_hero_bg_image",
        projects: "pp_hero_bg_image",
        about: "ap_hero_bg_image",
        contact: "cp_hero_bg_image",
      };
      const imageKey = keyMap[target];
      const newVal = data.url as string;
      setSettings((prev) => ({ ...prev, [imageKey]: newVal }));
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
      PAGES_KEYS.map((k) => [k, settings[k] ?? ""])
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
        <h1 className="text-2xl font-bold text-[#2C2C2C]" style={{ fontFamily: "var(--font-playfair)" }}>
          Page Heroes
        </h1>
        <p className="text-[#8C8277] mt-1 text-sm">
          Edit the hero banner for all pages. Upload a background image and customise the text.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">

        {/* Services Hero */}
        <section className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#FAF5EE]">
            <h2 className="font-semibold text-[#2C2C2C]">Services Page Hero</h2>
            <p className="text-xs text-[#8C8277] mt-0.5">The dark banner at the top of /services.</p>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Background Image</label>
              {val("sp_hero_bg_image") ? (
                <div className="relative h-40 rounded-lg overflow-hidden mb-3">
                  <Image src={val("sp_hero_bg_image")} alt="Services hero" fill className="object-cover" />
                  <button
                    type="button"
                    title="Remove image"
                    onClick={() => { set("sp_hero_bg_image", ""); fetch("/api/site-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sp_hero_bg_image: "" }) }); }}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => spRef.current?.click()}
                  className="h-40 border-2 border-dashed border-[#E8DDD0] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#8B5E3C] transition-colors mb-3"
                >
                  {uploading === "services" ? (
                    <div className="w-6 h-6 border-2 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-[#C4936A] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-[#8C8277]">Click to upload background image</span>
                    </>
                  )}
                </div>
              )}
              <input ref={spRef} type="file" accept="image/*" aria-label="Upload services hero background image" className="hidden" onChange={(e) => handleUpload(e, "services")} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Label (small text above heading)</label>
                <input
                  type="text"
                  value={val("sp_hero_label")}
                  onChange={(e) => set("sp_hero_label", e.target.value)}
                  className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                  placeholder={DEFAULTS.sp_hero_label}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Heading</label>
                <input
                  type="text"
                  value={val("sp_hero_heading")}
                  onChange={(e) => set("sp_hero_heading", e.target.value)}
                  className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                  placeholder={DEFAULTS.sp_hero_heading}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Projects Hero */}
        <section className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#FAF5EE]">
            <h2 className="font-semibold text-[#2C2C2C]">Projects Page Hero</h2>
            <p className="text-xs text-[#8C8277] mt-0.5">The dark banner at the top of /projects.</p>
          </div>
          <div className="p-6 space-y-5">
            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Background Image</label>
              {val("pp_hero_bg_image") ? (
                <div className="relative h-40 rounded-lg overflow-hidden mb-3">
                  <Image src={val("pp_hero_bg_image")} alt="Projects hero" fill className="object-cover" />
                  <button
                    type="button"
                    title="Remove image"
                    onClick={() => { set("pp_hero_bg_image", ""); fetch("/api/site-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pp_hero_bg_image: "" }) }); }}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => ppRef.current?.click()}
                  className="h-40 border-2 border-dashed border-[#E8DDD0] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#8B5E3C] transition-colors mb-3"
                >
                  {uploading === "projects" ? (
                    <div className="w-6 h-6 border-2 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-[#C4936A] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-[#8C8277]">Click to upload background image</span>
                    </>
                  )}
                </div>
              )}
              <input ref={ppRef} type="file" accept="image/*" aria-label="Upload projects hero background image" className="hidden" onChange={(e) => handleUpload(e, "projects")} />
              {uploadError && uploading === null && <p className="text-red-500 text-xs mt-1">{uploadError}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Label (small text above heading)</label>
                <input
                  type="text"
                  value={val("pp_hero_label")}
                  onChange={(e) => set("pp_hero_label", e.target.value)}
                  className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                  placeholder={DEFAULTS.pp_hero_label}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Heading</label>
                <input
                  type="text"
                  value={val("pp_hero_heading")}
                  onChange={(e) => set("pp_hero_heading", e.target.value)}
                  className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                  placeholder={DEFAULTS.pp_hero_heading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Subtext</label>
              <textarea
                rows={2}
                value={val("pp_hero_subtext")}
                onChange={(e) => set("pp_hero_subtext", e.target.value)}
                className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] resize-none"
                placeholder={DEFAULTS.pp_hero_subtext}
              />
            </div>
          </div>
        </section>

        {/* About Hero */}
        <section className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#FAF5EE]">
            <h2 className="font-semibold text-[#2C2C2C]">About Page Hero</h2>
            <p className="text-xs text-[#8C8277] mt-0.5">The dark banner at the top of /about.</p>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Background Image</label>
              {val("ap_hero_bg_image") ? (
                <div className="relative h-40 rounded-lg overflow-hidden mb-3">
                  <Image src={val("ap_hero_bg_image")} alt="About hero" fill className="object-cover" />
                  <button
                    type="button"
                    title="Remove image"
                    onClick={() => { set("ap_hero_bg_image", ""); fetch("/api/site-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ap_hero_bg_image: "" }) }); }}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => apRef.current?.click()}
                  className="h-40 border-2 border-dashed border-[#E8DDD0] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#8B5E3C] transition-colors mb-3"
                >
                  {uploading === "about" ? (
                    <div className="w-6 h-6 border-2 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-[#C4936A] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-[#8C8277]">Click to upload background image</span>
                    </>
                  )}
                </div>
              )}
              <input ref={apRef} type="file" accept="image/*" aria-label="Upload about hero background image" className="hidden" onChange={(e) => handleUpload(e, "about")} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Label (small text above heading)</label>
                <input
                  type="text"
                  value={val("ap_hero_label")}
                  onChange={(e) => set("ap_hero_label", e.target.value)}
                  className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                  placeholder={DEFAULTS.ap_hero_label}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Heading</label>
                <input
                  type="text"
                  value={val("ap_hero_heading")}
                  onChange={(e) => set("ap_hero_heading", e.target.value)}
                  className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                  placeholder={DEFAULTS.ap_hero_heading}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Hero */}
        <section className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#FAF5EE]">
            <h2 className="font-semibold text-[#2C2C2C]">Contact Page Hero</h2>
            <p className="text-xs text-[#8C8277] mt-0.5">The dark banner at the top of /contact.</p>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Background Image</label>
              {val("cp_hero_bg_image") ? (
                <div className="relative h-40 rounded-lg overflow-hidden mb-3">
                  <Image src={val("cp_hero_bg_image")} alt="Contact hero" fill className="object-cover" />
                  <button
                    type="button"
                    title="Remove image"
                    onClick={() => { set("cp_hero_bg_image", ""); fetch("/api/site-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cp_hero_bg_image: "" }) }); }}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => cpRef.current?.click()}
                  className="h-40 border-2 border-dashed border-[#E8DDD0] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#8B5E3C] transition-colors mb-3"
                >
                  {uploading === "contact" ? (
                    <div className="w-6 h-6 border-2 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-[#C4936A] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-[#8C8277]">Click to upload background image</span>
                    </>
                  )}
                </div>
              )}
              <input ref={cpRef} type="file" accept="image/*" aria-label="Upload contact hero background image" className="hidden" onChange={(e) => handleUpload(e, "contact")} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Label (small text above heading)</label>
                <input
                  type="text"
                  value={val("cp_hero_label")}
                  onChange={(e) => set("cp_hero_label", e.target.value)}
                  className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                  placeholder={DEFAULTS.cp_hero_label}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Heading</label>
                <input
                  type="text"
                  value={val("cp_hero_heading")}
                  onChange={(e) => set("cp_hero_heading", e.target.value)}
                  className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                  placeholder={DEFAULTS.cp_hero_heading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Subtext</label>
              <textarea
                rows={2}
                value={val("cp_hero_subtext")}
                onChange={(e) => set("cp_hero_subtext", e.target.value)}
                className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] resize-none"
                placeholder={DEFAULTS.cp_hero_subtext}
              />
            </div>
          </div>
        </section>

        {/* Save bar */}
        <div className="flex items-center justify-between bg-white border border-[#E8DDD0] rounded-xl px-6 py-4">
          <div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {saved && <p className="text-green-600 text-sm font-medium">Changes saved!</p>}
            {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-[#8B5E3C] hover:bg-[#6B4226] disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>

      </form>
    </div>
  );
}
