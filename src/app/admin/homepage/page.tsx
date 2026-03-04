"use client";

import { useState, useEffect } from "react";

interface Settings {
  hero_bg_image?: string;
  hero_label?: string;
  hero_heading_line1?: string;
  hero_heading_highlight?: string;
  hero_heading_line2?: string;
  hero_body?: string;
  hero_stat1_value?: string;
  hero_stat1_label?: string;
  hero_stat2_value?: string;
  hero_stat2_label?: string;
  hero_stat3_value?: string;
  hero_stat3_label?: string;
  services_label?: string;
  services_heading?: string;
  services_description?: string;
  services_decking_title?: string;
  services_decking_description?: string;
  services_decking_features?: string;
  services_sheds_title?: string;
  services_sheds_description?: string;
  services_sheds_features?: string;
  process_label?: string;
  process_heading?: string;
  process_description?: string;
  process_step1_enabled?: string;
  process_step1_title?: string;
  process_step1_description?: string;
  process_step2_enabled?: string;
  process_step2_title?: string;
  process_step2_description?: string;
  process_step3_enabled?: string;
  process_step3_title?: string;
  process_step3_description?: string;
  process_step4_enabled?: string;
  process_step4_title?: string;
  process_step4_description?: string;
  process_step5_enabled?: string;
  process_step5_title?: string;
  process_step5_description?: string;
  testimonials_label?: string;
  testimonials_heading?: string;
  testimonials_description?: string;
}

const DEFAULTS: Required<Settings> = {
  hero_bg_image: "/homeBG.jpg",
  hero_label: "Adelaide & Surrounds",
  hero_heading_line1: "Custom Decks",
  hero_heading_highlight: "& Sheds",
  hero_heading_line2: "Built Right.",
  hero_body:
    "Premium craftsmanship, honest pricing, and lasting results. Jason Norris builds decks and sheds you'll be proud of for years to come.",
  hero_stat1_value: "200+",
  hero_stat1_label: "Projects Completed",
  hero_stat2_value: "10+",
  hero_stat2_label: "Years Experience",
  hero_stat3_value: "5★",
  hero_stat3_label: "Average Rating",
  services_label: "What We Do",
  services_heading: "Built for Adelaide's Climate & Lifestyle",
  services_description:
    "Every project is designed around how you actually live - outdoor entertaining, extra storage, a workshop, or all of the above.",
  services_decking_title: "Decking",
  services_decking_description:
    "Custom timber and composite decks designed and built to suit your home and lifestyle. From simple entertaining areas to multi-level statements.",
  services_decking_features: "Timber & composite options,Full design service,Council approved,Ongoing maintenance",
  services_sheds_title: "Sheds",
  services_sheds_description:
    "Sturdy, weatherproof sheds built to your exact requirements. Whether it's for storage, a workshop, or a hobby space, we build it to last.",
  services_sheds_features: "Custom sizing,Various materials,Concrete slab options,Secure & weatherproof",
  process_label: "How It Works",
  process_heading: "Simple. Straightforward. Stress-Free.",
  process_description:
    "We\u2019ve refined our process to make your experience as smooth as possible from your first call to final handover.",
  process_step1_enabled: "true",
  process_step1_title: "Free Consultation",
  process_step1_description:
    "Get in touch and we\u2019ll arrange a free in-person or phone consultation to discuss your ideas, site, budget, and timeline.",
  process_step2_enabled: "true",
  process_step2_title: "Design & Quote",
  process_step2_description:
    "We\u2019ll prepare a detailed quote with a full breakdown of materials, labour, and timelines. No surprises.",
  process_step3_enabled: "true",
  process_step3_title: "Council & Permits",
  process_step3_description:
    "We handle any required council approvals and permits, taking that hassle completely off your hands.",
  process_step4_enabled: "true",
  process_step4_title: "We Build It",
  process_step4_description:
    "Our team arrives on schedule and builds to the highest standard. You\u2019ll be kept in the loop throughout.",
  process_step5_enabled: "true",
  process_step5_title: "Handover & Enjoy",
  process_step5_description:
    "We do a full walkthrough, answer any questions, and hand over a project you\u2019ll be proud of for years to come.",
  testimonials_label: "Testimonials",
  testimonials_heading: "What Our Clients Say",
  testimonials_description:
    "We let the work speak for itself \u2014 and our clients are happy to do the same.",
};

export default function AdminHomepagePage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const doLoad = () =>
    fetch("/api/site-settings")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: Settings) => { setSettings(data); setLoading(false); })
      .catch(() => { setLoading(false); setError("Could not load saved settings - showing defaults. Your changes will still save correctly."); });

  useEffect(() => {
    doLoad();
  }, []);

  function loadSettings() {
    setLoading(true);
    setError("");
    doLoad();
  }

  function set(key: keyof Settings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function val(key: keyof Settings) {
    return settings[key] ?? "";
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setUploading(false);
    if (res.ok) {
      const data = await res.json();
      setSettings((prev) => ({ ...prev, hero_bg_image: data.url }));
    } else {
      setUploadError("Image upload failed. Please try again.");
    }
    e.target.value = "";
  }

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
        <h1 className="text-2xl font-bold text-[#2C2C2C] font-[var(--font-playfair)]">
          Homepage Content
        </h1>
        <p className="text-[#8C8277] mt-1 text-sm">
          Edit the text shown on the homepage hero. Changes go live as soon as you save.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">

        {/* Background image */}
        <section className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#FAF5EE]">
            <h2 className="font-semibold text-[#2C2C2C]">Hero Background Image</h2>
            <p className="text-xs text-[#8C8277] mt-0.5">The full-width photo behind the homepage banner.</p>
          </div>
          <div className="p-6 space-y-4">
            {/* Current image preview */}
            <div className="relative w-full h-40 rounded-lg overflow-hidden bg-[#2C2C2C]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.hero_bg_image || DEFAULTS.hero_bg_image}
                alt="Current hero background"
                className="w-full h-full object-cover object-center opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2C2C2C]/80 via-[#2C2C2C]/40 to-transparent" />
              <span className="absolute bottom-2 left-3 text-white text-xs font-semibold tracking-wide opacity-80">Current image</span>
            </div>

            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-[#FAF5EE] border border-[#E8DDD0] hover:border-[#8B5E3C] text-[#2C2C2C] text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                <svg className="w-4 h-4 text-[#8B5E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {uploading ? "Uploading…" : "Choose new image"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
              <span className="text-xs text-[#8C8277]">
                {settings.hero_bg_image && settings.hero_bg_image !== DEFAULTS.hero_bg_image
                  ? `New image selected - click Save Changes to apply`
                  : "JPG, PNG or WebP · 1920×1080 recommended"}
              </span>
            </div>
            {uploadError && (
              <p className="text-red-600 text-xs">{uploadError}</p>
            )}
          </div>
        </section>

        {/* Hero text */}
        <section className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#FAF5EE]">
            <h2 className="font-semibold text-[#2C2C2C]">Hero Banner</h2>
            <p className="text-xs text-[#8C8277] mt-0.5">The large banner at the top of the homepage.</p>
          </div>
          <div className="p-6 space-y-5">

            <Field
              label="Location Label"
              hint={`Small text above the heading. Default: "${DEFAULTS.hero_label}"`}
              value={val("hero_label")}
              placeholder={DEFAULTS.hero_label}
              onChange={(v) => set("hero_label", v)}
            />

            <div className="border border-[#E8DDD0] rounded-lg p-4 space-y-4 bg-[#FAFAF8]">
              <p className="text-xs font-medium text-[#8C8277] uppercase tracking-wide">Heading - 3 lines</p>
              <Field
                label="Line 1 (white)"
                value={val("hero_heading_line1")}
                placeholder={DEFAULTS.hero_heading_line1}
                onChange={(v) => set("hero_heading_line1", v)}
              />
              <Field
                label="Line 2 (timber colour highlight)"
                value={val("hero_heading_highlight")}
                placeholder={DEFAULTS.hero_heading_highlight}
                onChange={(v) => set("hero_heading_highlight", v)}
              />
              <Field
                label="Line 3 (white)"
                value={val("hero_heading_line2")}
                placeholder={DEFAULTS.hero_heading_line2}
                onChange={(v) => set("hero_heading_line2", v)}
              />

              {/* Live preview */}
              <div className="mt-2 bg-[#2C2C2C] rounded-lg px-5 py-4">
                <p className="text-xs text-[#8C8277] mb-2 uppercase tracking-widest">Preview</p>
                <p className="text-[#C4936A] text-xs font-semibold tracking-[0.25em] uppercase mb-1">
                  {val("hero_label") || DEFAULTS.hero_label}
                </p>
                <p className="text-white font-bold text-2xl leading-snug font-[var(--font-heading)]">
                  {val("hero_heading_line1") || DEFAULTS.hero_heading_line1}
                  <br />
                  <span className="text-[#C4936A]">{val("hero_heading_highlight") || DEFAULTS.hero_heading_highlight}</span>
                  <br />
                  {val("hero_heading_line2") || DEFAULTS.hero_heading_line2}
                </p>
              </div>
            </div>

            <Field
              label="Body Text"
              hint="The paragraph under the heading."
              value={val("hero_body")}
              placeholder={DEFAULTS.hero_body}
              onChange={(v) => set("hero_body", v)}
              textarea
            />

          </div>
        </section>

        {/* Stats */}
        <section className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#FAF5EE]">
            <h2 className="font-semibold text-[#2C2C2C]">Trust Stats</h2>
            <p className="text-xs text-[#8C8277] mt-0.5">The three figures shown below the buttons.</p>
          </div>
          <div className="p-6 space-y-6">

            {([
              { v: "hero_stat1_value", l: "hero_stat1_label", title: "Stat 1" },
              { v: "hero_stat2_value", l: "hero_stat2_label", title: "Stat 2" },
              { v: "hero_stat3_value", l: "hero_stat3_label", title: "Stat 3" },
            ] as const).map(({ v, l, title }) => (
              <div key={v} className="grid sm:grid-cols-2 gap-4 pb-6 border-b border-[#E8DDD0] last:border-0 last:pb-0">
                <Field
                  label={`${title} - Number / Value`}
                  value={val(v)}
                  placeholder={DEFAULTS[v]}
                  onChange={(val) => set(v, val)}
                />
                <Field
                  label={`${title} - Label`}
                  value={val(l)}
                  placeholder={DEFAULTS[l]}
                  onChange={(val) => set(l, val)}
                />
              </div>
            ))}

            {/* Stats preview */}
            <div className="flex flex-wrap gap-8 pt-2 border-t border-[#E8DDD0] mt-2">
              {(["1","2","3"] as const).map((n) => {
                const vKey = `hero_stat${n}_value` as keyof Settings;
                const lKey = `hero_stat${n}_label` as keyof Settings;
                return (
                  <div key={n}>
                    <div className="text-2xl font-bold text-[#C4936A] font-[var(--font-heading)]">
                      {val(vKey) || DEFAULTS[vKey]}
                    </div>
                    <div className="text-xs text-[#8C8277] mt-0.5">
                      {val(lKey) || DEFAULTS[lKey]}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* Services section */}
        <section className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#FAF5EE]">
            <h2 className="font-semibold text-[#2C2C2C]">Services Section</h2>
            <p className="text-xs text-[#8C8277] mt-0.5">The &ldquo;What We Do&rdquo; block below the hero with the Decking and Sheds cards.</p>
          </div>
          <div className="p-6 space-y-5">

            <Field
              label="Section Label"
              hint={`Small uppercase text above the heading. Default: "${DEFAULTS.services_label}"`}
              value={val("services_label")}
              placeholder={DEFAULTS.services_label}
              onChange={(v) => set("services_label", v)}
            />
            <Field
              label="Heading"
              value={val("services_heading")}
              placeholder={DEFAULTS.services_heading}
              onChange={(v) => set("services_heading", v)}
            />
            <Field
              label="Description"
              value={val("services_description")}
              placeholder={DEFAULTS.services_description}
              onChange={(v) => set("services_description", v)}
              textarea
            />

            {/* Decking card */}
            <div className="border border-[#E8DDD0] rounded-lg p-4 space-y-4 bg-[#FAFAF8]">
              <p className="text-xs font-medium text-[#8C8277] uppercase tracking-wide">Decking Card</p>
              <Field
                label="Title"
                value={val("services_decking_title")}
                placeholder={DEFAULTS.services_decking_title}
                onChange={(v) => set("services_decking_title", v)}
              />
              <Field
                label="Description"
                value={val("services_decking_description")}
                placeholder={DEFAULTS.services_decking_description}
                onChange={(v) => set("services_decking_description", v)}
                textarea
              />
              <Field
                label="Bullet Points"
                hint="Comma-separated list. Each item becomes a bullet point."
                value={val("services_decking_features")}
                placeholder={DEFAULTS.services_decking_features}
                onChange={(v) => set("services_decking_features", v)}
              />
              {(val("services_decking_features") || DEFAULTS.services_decking_features).split(",").filter(Boolean).length > 0 && (
                <ul className="text-xs text-[#8C8277] space-y-0.5 pl-2">
                  {(val("services_decking_features") || DEFAULTS.services_decking_features).split(",").map((f) => f.trim()).filter(Boolean).map((f) => (
                    <li key={f} className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#8B5E3C] shrink-0" />{f}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Sheds card */}
            <div className="border border-[#E8DDD0] rounded-lg p-4 space-y-4 bg-[#FAFAF8]">
              <p className="text-xs font-medium text-[#8C8277] uppercase tracking-wide">Sheds Card</p>
              <Field
                label="Title"
                value={val("services_sheds_title")}
                placeholder={DEFAULTS.services_sheds_title}
                onChange={(v) => set("services_sheds_title", v)}
              />
              <Field
                label="Description"
                value={val("services_sheds_description")}
                placeholder={DEFAULTS.services_sheds_description}
                onChange={(v) => set("services_sheds_description", v)}
                textarea
              />
              <Field
                label="Bullet Points"
                hint="Comma-separated list. Each item becomes a bullet point."
                value={val("services_sheds_features")}
                placeholder={DEFAULTS.services_sheds_features}
                onChange={(v) => set("services_sheds_features", v)}
              />
              {(val("services_sheds_features") || DEFAULTS.services_sheds_features).split(",").filter(Boolean).length > 0 && (
                <ul className="text-xs text-[#8C8277] space-y-0.5 pl-2">
                  {(val("services_sheds_features") || DEFAULTS.services_sheds_features).split(",").map((f) => f.trim()).filter(Boolean).map((f) => (
                    <li key={f} className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#8B5E3C] shrink-0" />{f}</li>
                  ))}
                </ul>
              )}
            </div>

          </div>
        </section>

        {/* Process section */}
        <section className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#FAF5EE]">
            <h2 className="font-semibold text-[#2C2C2C]">How It Works Section</h2>
            <p className="text-xs text-[#8C8277] mt-0.5">The dark green section with the 5 numbered process steps.</p>
          </div>
          <div className="p-6 space-y-5">
            <Field
              label="Section Label"
              hint={`Small uppercase text above the heading. Default: "${DEFAULTS.process_label}"`}
              value={val("process_label")}
              placeholder={DEFAULTS.process_label}
              onChange={(v) => set("process_label", v)}
            />
            <Field
              label="Heading"
              value={val("process_heading")}
              placeholder={DEFAULTS.process_heading}
              onChange={(v) => set("process_heading", v)}
            />
            <Field
              label="Description"
              value={val("process_description")}
              placeholder={DEFAULTS.process_description}
              onChange={(v) => set("process_description", v)}
              textarea
            />

            <div className="space-y-4 pt-2">
              <p className="text-xs font-medium text-[#8C8277] uppercase tracking-wide">Steps</p>
              {(["1","2","3","4","5"] as const).map((n) => {
                const ek = `process_step${n}_enabled` as keyof Settings;
                const tk = `process_step${n}_title` as keyof Settings;
                const dk = `process_step${n}_description` as keyof Settings;
                const enabled = (settings[ek] ?? DEFAULTS[ek]) !== "false";
                return (
                  <div key={n} className={`border rounded-lg p-4 space-y-3 transition-colors ${
                    enabled ? "border-[#E8DDD0] bg-[#FAFAF8]" : "border-[#E8DDD0] bg-[#F0EDE8] opacity-60"
                  }`}>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-[#C4936A] uppercase tracking-wide">Step {n}</p>
                      <button
                        type="button"
                        onClick={() => set(ek, enabled ? "false" : "true")}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                          enabled ? "bg-[#3D5A3E]" : "bg-[#C8BEB5]"
                        }`}
                        title={enabled ? "Click to disable this step" : "Click to enable this step"}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                          enabled ? "translate-x-4" : "translate-x-1"
                        }`} />
                      </button>
                    </div>
                    {enabled && (
                      <>
                        <Field
                          label="Title"
                          value={val(tk)}
                          placeholder={DEFAULTS[tk] ?? ""}
                          onChange={(v) => set(tk, v)}
                        />
                        <Field
                          label="Description"
                          value={val(dk)}
                          placeholder={DEFAULTS[dk] ?? ""}
                          onChange={(v) => set(dk, v)}
                          textarea
                        />
                      </>
                    )}
                    {!enabled && (
                      <p className="text-xs text-[#8C8277] italic">This step is hidden on the website</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials section */}
        <section className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#FAF5EE]">
            <h2 className="font-semibold text-[#2C2C2C]">Testimonials Section</h2>
            <p className="text-xs text-[#8C8277] mt-0.5">
              Header text for the reviews section. Individual testimonial cards come from the Feedback manager. Google Reviews are configured in the SEO admin page.
            </p>
          </div>
          <div className="p-6 space-y-5">
            <Field
              label="Section Label"
              hint={`Small uppercase text above the heading. Default: "${DEFAULTS.testimonials_label}"`}
              value={val("testimonials_label")}
              placeholder={DEFAULTS.testimonials_label}
              onChange={(v) => set("testimonials_label", v)}
            />
            <Field
              label="Heading"
              value={val("testimonials_heading")}
              placeholder={DEFAULTS.testimonials_heading}
              onChange={(v) => set("testimonials_heading", v)}
            />
            <Field
              label="Description"
              value={val("testimonials_description")}
              placeholder={DEFAULTS.testimonials_description}
              onChange={(v) => set("testimonials_description", v)}
              textarea
            />
          </div>
        </section>

        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3 text-sm flex items-center justify-between gap-4">
            <span>{error}</span>
            <button type="button" onClick={loadSettings} className="shrink-0 text-xs font-medium underline hover:no-underline">
              Retry
            </button>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#8B5E3C] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#7a5234] transition-colors disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          {saved && (
            <span className="text-[#3D5A3E] text-sm font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved - homepage updated
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label, value, placeholder, hint, textarea, onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  hint?: string;
  textarea?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-[#2C2C2C]">{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent"
        />
      )}
      {hint && <p className="text-xs text-[#8C8277]">{hint}</p>}
    </div>
  );
}
