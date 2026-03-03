"use client";

import { useState, useEffect } from "react";

interface Settings {
  site_meta_title?: string;
  site_meta_description?: string;
  google_analytics_id?: string;
  google_site_verification?: string;
}

const FIELDS: { key: keyof Settings; label: string; placeholder: string; hint?: string; textarea?: boolean }[] = [
  {
    key: "site_meta_title",
    label: "Default Page Title",
    placeholder: "Norris Decking and Sheds | Adelaide & Surrounds",
    hint: "Shown in browser tabs and search results when a page has no custom title.",
  },
  {
    key: "site_meta_description",
    label: "Default Meta Description",
    placeholder: "Quality custom decks, pergolas and garden sheds built across Adelaide by Jason Norris.",
    hint: "Shown in Google search snippets. Aim for 120–160 characters.",
    textarea: true,
  },
  {
    key: "google_analytics_id",
    label: "Google Analytics ID",
    placeholder: "G-XXXXXXXXXX",
    hint: "Your GA4 measurement ID. Find it in Google Analytics → Admin → Data Streams.",
  },
  {
    key: "google_site_verification",
    label: "Google Search Console Verification",
    placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    hint: 'The content value from the <meta name="google-site-verification"> tag. Paste only the value, not the whole tag.',
  },
];

export default function AdminSEOPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/site-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError("Failed to save. Please try again.");
    }
  }

  function set(key: keyof Settings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
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
          SEO &amp; Discoverability
        </h1>
        <p className="text-[#8C8277] mt-1 text-sm">
          Control how your website appears in Google search results and across the web.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Search engine basics */}
        <section className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#FAF5EE]">
            <h2 className="font-semibold text-[#2C2C2C]">Search Engine Basics</h2>
            <p className="text-xs text-[#8C8277] mt-0.5">Default title and description used when a page has no custom values set.</p>
          </div>
          <div className="p-6 space-y-5">
            {FIELDS.filter((f) => ["site_meta_title", "site_meta_description"].includes(f.key)).map((field) => (
              <FormField key={field.key} field={field} value={settings[field.key] ?? ""} onChange={(v) => set(field.key, v)} />
            ))}
          </div>
        </section>

        {/* Google tools */}
        <section className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#FAF5EE]">
            <h2 className="font-semibold text-[#2C2C2C]">Google Tools</h2>
            <p className="text-xs text-[#8C8277] mt-0.5">Connect Google Analytics for visitor tracking and Search Console to verify ownership.</p>
          </div>
          <div className="p-6 space-y-5">
            {FIELDS.filter((f) => ["google_analytics_id", "google_site_verification"].includes(f.key)).map((field) => (
              <FormField key={field.key} field={field} value={settings[field.key] ?? ""} onChange={(v) => set(field.key, v)} />
            ))}
          </div>
        </section>

        {/* Errors / save */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#8B5E3C] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#7a5234] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : "Save Settings"}
          </button>
          {saved && (
            <span className="text-[#3D5A3E] text-sm font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Settings saved
            </span>
          )}
        </div>
      </form>

      {/* Info card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800 space-y-2">
        <p className="font-semibold">How this works</p>
        <ul className="list-disc list-inside space-y-1 text-blue-700">
          <li>Individual project SEO fields can be set when editing each project.</li>
          <li>The sitemap at <code className="bg-blue-100 px-1 rounded">/sitemap.xml</code> is updated automatically as you publish projects.</li>
          <li>After saving your Google Analytics ID, the tracking code will be active on your next deployment.</li>
          <li>Submit your sitemap URL to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="underline">Google Search Console</a> to speed up indexing.</li>
        </ul>
      </div>
    </div>
  );
}

function FormField({
  field,
  value,
  onChange,
}: {
  field: { key: string; label: string; placeholder: string; hint?: string; textarea?: boolean };
  value: string;
  onChange: (v: string) => void;
}) {
  const charCount = value.length;
  const isDesc = field.key === "site_meta_description";

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-[#2C2C2C]">{field.label}</label>
      {field.textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent"
        />
      )}
      <div className="flex items-start justify-between gap-4">
        {field.hint && <p className="text-xs text-[#8C8277]">{field.hint}</p>}
        {isDesc && (
          <p className={`text-xs shrink-0 ml-auto ${charCount > 160 ? "text-red-500" : "text-[#8C8277]"}`}>
            {charCount}/160
          </p>
        )}
      </div>
    </div>
  );
}
