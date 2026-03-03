"use client";

import { useState, useEffect } from "react";

interface Settings {
  business_logo?: string;
  business_name?: string;
  business_tagline?: string;
  business_abn?: string;
  business_licence?: string;
  business_phone?: string;
  business_email?: string;
  business_address?: string;
  business_suburb?: string;
  business_state?: string;
  business_postcode?: string;
  business_service_area?: string;
  facebook_url?: string;
  instagram_url?: string;
}

type FieldDef = {
  key: keyof Settings;
  label: string;
  placeholder: string;
  hint?: string;
  textarea?: boolean;
};

const SECTIONS: { title: string; description: string; keys: (keyof Settings)[] }[] = [
  {
    title: "Registration & Licensing",
    description: "Legal identifiers for your business. Displayed in quotes and on the website footer.",
    keys: ["business_name", "business_tagline", "business_abn", "business_licence"],
  },
  {
    title: "Contact Details",
    description: "How customers can reach you.",
    keys: ["business_phone", "business_email"],
  },
  {
    title: "Address & Service Area",
    description: "Your business address and the regions you work in. Used in Google structured data.",
    keys: ["business_address", "business_suburb", "business_state", "business_postcode", "business_service_area"],
  },
  {
    title: "Social Media",
    description: "Your social media profiles. Linked in the site footer and used for Open Graph sharing.",
    keys: ["facebook_url", "instagram_url"],
  },
];

const ALL_FIELDS: FieldDef[] = [
  {
    key: "business_name",
    label: "Business Name",
    placeholder: "Norris Decking and Sheds",
    hint: "Your registered trading name.",
  },
  {
    key: "business_tagline",
    label: "Footer Tagline",
    placeholder: "Quality custom decks and sheds built to last. Proudly servicing Adelaide and surrounding areas with craftsmanship you can trust.",
    hint: "Short description shown in the footer beneath the logo.",
    textarea: true,
  },
  {
    key: "business_abn",
    label: "ABN",
    placeholder: "12 345 678 901",
    hint: "Your 11-digit Australian Business Number.",
  },
  {
    key: "business_licence",
    label: "Builders Licence Number",
    placeholder: "BLD XXXXXX",
    hint: "Your SA builders licence number. Displayed on quotes and invoices.",
  },
  {
    key: "business_phone",
    label: "Phone",
    placeholder: "0412 345 678",
    hint: "Shown in the header, footer, and contact page.",
  },
  {
    key: "business_email",
    label: "Email",
    placeholder: "jason@norrisdeckingandheds.com.au",
  },
  {
    key: "business_address",
    label: "Street Address",
    placeholder: "123 Example Street",
    hint: "Used in Google structured data (JSON-LD).",
  },
  {
    key: "business_suburb",
    label: "Suburb",
    placeholder: "Adelaide",
  },
  {
    key: "business_state",
    label: "State",
    placeholder: "SA",
  },
  {
    key: "business_postcode",
    label: "Postcode",
    placeholder: "5000",
  },
  {
    key: "business_service_area",
    label: "Service Area",
    placeholder: "Adelaide, Adelaide Hills, Barossa Valley, Fleurieu Peninsula",
    hint: "Comma-separated list of suburbs or regions you service. Shown on the contact page.",
    textarea: true,
  },
  {
    key: "facebook_url",
    label: "Facebook Page URL",
    placeholder: "https://facebook.com/norrisdeckingandheds",
  },
  {
    key: "instagram_url",
    label: "Instagram Profile URL",
    placeholder: "https://instagram.com/norrisdecking",
  },
];

const fieldMap = Object.fromEntries(ALL_FIELDS.map((f) => [f.key, f])) as Record<keyof Settings, FieldDef>;

// All keys that belong to this page — only these are sent on save
const BUSINESS_KEYS: (keyof Settings)[] = [
  "business_logo",
  "business_name",
  "business_tagline",
  "business_abn",
  "business_licence",
  "business_phone",
  "business_email",
  "business_address",
  "business_suburb",
  "business_state",
  "business_postcode",
  "business_service_area",
  "facebook_url",
  "instagram_url",
];

export default function AdminBusinessPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState("");

  useEffect(() => {
    fetch("/api/site-settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load settings.");
        setLoading(false);
      });
  }, []);

  function set(key: keyof Settings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    setLogoUploading(true);
    setLogoUploadError("");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setLogoUploading(false);
    if (res.ok) {
      const data = await res.json();
      const logoUrl: string = data.url;
      // Update local state
      setSettings((prev) => ({ ...prev, business_logo: logoUrl }));
      // Immediately persist the logo URL to the database
      await fetch("/api/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_logo: logoUrl }),
      });
    } else {
      setLogoUploadError("Logo upload failed. Please try again.");
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    // Only send keys that belong to this page
    const payload: Partial<Record<string, string>> = {};
    for (const key of BUSINESS_KEYS) {
      const val = settings[key];
      if (val !== undefined) payload[key] = val;
    }

    const res = await fetch("/api/site-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError("Failed to save. Please try again.");
    }
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2C2C2C]" style={{ fontFamily: "var(--font-playfair)" }}>
          Business Information
        </h1>
        <p className="text-[#8C8277] mt-1 text-sm">
          Your business details - used across the website, in quotes, and in Google search results.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Logo Upload */}
        <section className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#FAF5EE]">
            <h2 className="font-semibold text-[#2C2C2C]">Business Logo</h2>
            <p className="text-xs text-[#8C8277] mt-0.5">Displayed in the site header and footer. Use a PNG or SVG with a transparent background for best results.</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-6">
              {/* Preview */}
              <div className="w-24 h-24 rounded-lg border border-[#E8DDD0] bg-[#FAF5EE] flex items-center justify-center overflow-hidden shrink-0">
                {settings.business_logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settings.business_logo} alt="Logo preview" className="w-full h-full object-contain p-1" />
                ) : (
                  <div className="w-12 h-12 bg-[#8B5E3C] rounded-sm flex items-center justify-center">
                    <span className="text-white font-bold text-xl">N</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="cursor-pointer bg-[#FAF5EE] border border-[#E8DDD0] hover:border-[#8B5E3C] text-[#2C2C2C] text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 w-fit">
                  <svg className="w-4 h-4 text-[#8B5E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {logoUploading ? "Uploading…" : "Upload logo"}
                  <input type="file" accept="image/png,image/svg+xml,image/webp,image/jpeg" className="hidden" onChange={handleLogoUpload} disabled={logoUploading} />
                </label>
                <p className="text-xs text-[#8C8277]">PNG, SVG or WebP · transparent background recommended</p>
                {settings.business_logo && (
                  <button type="button" onClick={async () => {
                    setSettings((p) => ({ ...p, business_logo: "" }));
                    await fetch("/api/site-settings", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ business_logo: "" }),
                    });
                  }} className="text-xs text-red-500 hover:text-red-700 underline">
                    Remove logo (use initials fallback)
                  </button>
                )}
              </div>
            </div>
            {logoUploadError && <p className="text-red-600 text-xs">{logoUploadError}</p>}
          </div>
        </section>

        {SECTIONS.map((section) => (
          <section key={section.title} className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#FAF5EE]">
              <h2 className="font-semibold text-[#2C2C2C]">{section.title}</h2>
              <p className="text-xs text-[#8C8277] mt-0.5">{section.description}</p>
            </div>
            <div className="p-6 space-y-5">
              {section.keys.map((key) => {
                const field = fieldMap[key];
                if (!field) return null;
                const value = settings[key] ?? "";
                return (
                  <div key={key} className="space-y-1">
                    <label className="block text-sm font-medium text-[#2C2C2C]">{field.label}</label>
                    {field.textarea ? (
                      <textarea
                        rows={3}
                        value={value}
                        onChange={(e) => set(key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => set(key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent"
                      />
                    )}
                    {field.hint && <p className="text-xs text-[#8C8277]">{field.hint}</p>}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#8B5E3C] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#7a5234] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : "Save Details"}
          </button>
          {saved && (
            <span className="text-[#3D5A3E] text-sm font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Details saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
