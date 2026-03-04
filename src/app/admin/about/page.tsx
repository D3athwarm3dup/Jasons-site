"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
};

interface Settings {
  ab_main_image?: string;
  ab_main_label?: string;
  ab_main_heading?: string;
  ab_main_bio?: string;
  ab_team_members?: string;
  ab_val1_icon?: string;
  ab_val1_title?: string;
  ab_val1_desc?: string;
  ab_val2_icon?: string;
  ab_val2_title?: string;
  ab_val2_desc?: string;
  ab_val3_icon?: string;
  ab_val3_title?: string;
  ab_val3_desc?: string;
}

const DEFAULTS: Required<Settings> = {
  ab_main_image: "",
  ab_main_label: "Meet Jason",
  ab_main_heading: "Built on Hard Work and Honest Service",
  ab_main_bio:
    "Hi, I'm Jason Norris - owner and builder at Norris Decking & Sheds. I've been building custom decks and sheds across Adelaide and surrounds for over a decade, and I'm proud to say that the vast majority of my work comes through word of mouth.\n\nI started out as a carpenter and quickly found that outdoor structures were my passion. There's something deeply satisfying about transforming someone's backyard into a space they absolutely love. I approach every job - big or small - with the same attention to detail and commitment to quality.\n\nWhen you hire Norris Decking & Sheds, you deal directly with me. No call centres, no layers of middlemen. Just honest advice, fair pricing, and a result you'll be proud of for years to come.",
  ab_team_members: "[]",
  ab_val1_icon: "🔨",
  ab_val1_title: "Quality First",
  ab_val1_desc: "We only use premium materials and proven techniques. Every deck and shed is built to last Adelaide's climate.",
  ab_val2_icon: "✅",
  ab_val2_title: "Honest Pricing",
  ab_val2_desc: "No hidden costs, no nasty surprises. Your quote is detailed and transparent from day one.",
  ab_val3_icon: "🤝",
  ab_val3_title: "Personal Service",
  ab_val3_desc: "You deal with Jason directly throughout the entire project, from first call to final handover.",
};

const ABOUT_KEYS: (keyof Settings)[] = [
  "ab_main_image",
  "ab_main_label",
  "ab_main_heading",
  "ab_main_bio",
  "ab_team_members",
  "ab_val1_icon", "ab_val1_title", "ab_val1_desc",
  "ab_val2_icon", "ab_val2_title", "ab_val2_desc",
  "ab_val3_icon", "ab_val3_title", "ab_val3_desc",
];

function newMember(): TeamMember {
  return { id: crypto.randomUUID(), name: "", role: "", bio: "", image: "" };
}

async function autoSave(patch: Record<string, string>) {
  await fetch("/api/site-settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
}

export default function AdminAboutPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploadingKey, setUploadingKey] = useState<string | null>(null); // "main" | member.id

  const mainImageRef = useRef<HTMLInputElement>(null);
  const memberImageRef = useRef<HTMLInputElement>(null);
  const pendingMemberUploadId = useRef<string | null>(null);

  useEffect(() => {
    fetch("/api/site-settings")
      .then((r) => r.json())
      .then((data: Settings) => {
        setSettings(data);
        try {
          const parsed: TeamMember[] = JSON.parse(data.ab_team_members || "[]");
          setTeam(Array.isArray(parsed) ? parsed : []);
        } catch {
          setTeam([]);
        }
        setLoading(false);
      })
      .catch(() => { setLoading(false); setError("Could not load saved settings."); });
  }, []);

  function val(key: keyof Settings): string {
    return settings[key] || DEFAULTS[key] || "";
  }

  function set(key: keyof Settings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  // --- Main image upload ---
  async function handleMainImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingKey("main");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setUploadingKey(null);
    if (res.ok) {
      const { url } = await res.json();
      setSettings((prev) => ({ ...prev, ab_main_image: url }));
      await autoSave({ ab_main_image: url });
    }
    e.target.value = "";
  }

  // --- Member image upload ---
  async function handleMemberImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const memberId = pendingMemberUploadId.current;
    if (!file || !memberId) return;
    setUploadingKey(memberId);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setUploadingKey(null);
    if (res.ok) {
      const { url } = await res.json();
      setTeam((prev) => {
        const updated = prev.map((m) => m.id === memberId ? { ...m, image: url } : m);
        autoSave({ ab_team_members: JSON.stringify(updated) });
        return updated;
      });
    }
    e.target.value = "";
    pendingMemberUploadId.current = null;
  }

  function triggerMemberUpload(id: string) {
    pendingMemberUploadId.current = id;
    memberImageRef.current?.click();
  }

  // --- Team management ---
  function addMember() {
    setTeam((prev) => [...prev, newMember()]);
  }

  function removeMember(id: string) {
    setTeam((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      autoSave({ ab_team_members: JSON.stringify(updated) });
      return updated;
    });
  }

  function updateMember(id: string, field: keyof TeamMember, value: string) {
    setTeam((prev) => prev.map((m) => m.id === id ? { ...m, [field]: value } : m));
  }

  // --- Save ---
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    const payload: Record<string, string> = {};
    for (const k of ABOUT_KEYS) {
      payload[k] = settings[k] ?? "";
    }
    payload.ab_team_members = JSON.stringify(team);
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
        <h1 className="text-2xl font-bold text-[#2C2C2C] font-[var(--font-playfair)]">
          About Page
        </h1>
        <p className="text-[#8C8277] mt-1 text-sm">
          Edit the team profiles and bio content on the /about page.
        </p>
      </div>

      {/* Hidden file inputs */}
      <input ref={mainImageRef} type="file" accept="image/*" aria-label="Upload main profile photo" className="hidden" onChange={handleMainImageUpload} />
      <input ref={memberImageRef} type="file" accept="image/*" aria-label="Upload staff member photo" className="hidden" onChange={handleMemberImageUpload} />

      <form onSubmit={handleSave} className="space-y-8">

        {/* Main person */}
        <section className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#FAF5EE]">
            <h2 className="font-semibold text-[#2C2C2C]">Main Profile</h2>
            <p className="text-xs text-[#8C8277] mt-0.5">The primary person featured at the top of the About page.</p>
          </div>
          <div className="p-6 space-y-5">

            {/* Photo */}
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Profile Photo</label>
              {val("ab_main_image") ? (
                <div className="relative w-48 rounded-xl overflow-hidden mb-3">
                  <Image src={val("ab_main_image")} alt="Main profile" width={192} height={240} className="w-full object-cover rounded-xl" style={{ aspectRatio: "4/5" }} />
                  <button
                    type="button"
                    title="Remove photo"
                    onClick={() => { set("ab_main_image", ""); autoSave({ ab_main_image: "" }); }}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => mainImageRef.current?.click()}
                  className="w-48 aspect-[4/5] border-2 border-dashed border-[#E8DDD0] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#8B5E3C] transition-colors mb-3 py-10"
                >
                  {uploadingKey === "main" ? (
                    <div className="w-6 h-6 border-2 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-[#C4936A] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-xs text-[#8C8277]">Click to upload</span>
                    </>
                  )}
                </div>
              )}
              <p className="text-xs text-[#8C8277]">Displayed in a 4:5 portrait frame alongside the bio.</p>
            </div>

            {/* Label + Heading */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Label <span className="text-[#8C8277] font-normal">(small uppercase)</span></label>
                <input
                  type="text"
                  value={val("ab_main_label")}
                  onChange={(e) => set("ab_main_label", e.target.value)}
                  className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                  placeholder={DEFAULTS.ab_main_label}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Heading</label>
                <input
                  type="text"
                  value={val("ab_main_heading")}
                  onChange={(e) => set("ab_main_heading", e.target.value)}
                  className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                  placeholder={DEFAULTS.ab_main_heading}
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Bio</label>
              <textarea
                rows={8}
                value={val("ab_main_bio")}
                onChange={(e) => set("ab_main_bio", e.target.value)}
                className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] resize-none"
                placeholder={DEFAULTS.ab_main_bio}
              />
              <p className="text-xs text-[#8C8277] mt-1">Separate paragraphs with a blank line.</p>
            </div>
          </div>
        </section>

        {/* Team members */}
        {team.map((member, i) => {
          const isReversed = i % 2 === 0; // alternates from main (image-left)
          return (
            <section key={member.id} className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#FAF5EE] flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-[#2C2C2C]">
                    {member.name || `Staff Member ${i + 2}`}
                  </h2>
                  <p className="text-xs text-[#8C8277] mt-0.5">
                    Layout: {isReversed ? "photo right, text left" : "photo left, text right"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeMember(member.id)}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              </div>
              <div className="p-6 space-y-5">

                {/* Photo */}
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Profile Photo</label>
                  {member.image ? (
                    <div className="relative w-40 rounded-xl overflow-hidden mb-3">
                      <Image src={member.image} alt={member.name || "Staff"} width={160} height={200} className="w-full object-cover rounded-xl" style={{ aspectRatio: "4/5" }} />
                      <button
                        type="button"
                        title="Remove photo"
                        onClick={() => updateMember(member.id, "image", "")}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => triggerMemberUpload(member.id)}
                      className="w-40 aspect-[4/5] border-2 border-dashed border-[#E8DDD0] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#8B5E3C] transition-colors mb-3 py-8"
                    >
                      {uploadingKey === member.id ? (
                        <div className="w-6 h-6 border-2 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <svg className="w-7 h-7 text-[#C4936A] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-xs text-[#8C8277]">Click to upload</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Name</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateMember(member.id, "name", e.target.value)}
                      className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Role / Title</label>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => updateMember(member.id, "role", e.target.value)}
                      className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                      placeholder="Shed Specialist"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Bio</label>
                  <textarea
                    rows={5}
                    value={member.bio}
                    onChange={(e) => updateMember(member.id, "bio", e.target.value)}
                    className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] resize-none"
                    placeholder="A short bio about this team member..."
                  />
                  <p className="text-xs text-[#8C8277] mt-1">Separate paragraphs with a blank line.</p>
                </div>
              </div>
            </section>
          );
        })}

        {/* Add staff member */}
        <button
          type="button"
          onClick={addMember}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#E8DDD0] rounded-xl py-4 text-sm text-[#8C8277] hover:border-[#8B5E3C] hover:text-[#8B5E3C] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Staff Member
        </button>

        {/* Values cards */}
        <section className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8DDD0] bg-[#FAF5EE]">
            <h2 className="font-semibold text-[#2C2C2C]">Values Cards</h2>
            <p className="text-xs text-[#8C8277] mt-0.5">The three highlight cards shown below the team profiles.</p>
          </div>
          <div className="p-6 space-y-6">
            {([1, 2, 3] as const).map((n) => {
              const iconKey = `ab_val${n}_icon` as keyof Settings;
              const titleKey = `ab_val${n}_title` as keyof Settings;
              const descKey = `ab_val${n}_desc` as keyof Settings;
              return (
                <div key={n} className="border border-[#E8DDD0] rounded-lg p-4 space-y-3">
                  <p className="text-xs font-semibold text-[#8C8277] uppercase tracking-wide">Card {n}</p>
                  <div className="grid sm:grid-cols-[80px_1fr] gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Icon</label>
                      <input
                        type="text"
                        value={val(iconKey)}
                        onChange={(e) => set(iconKey, e.target.value)}
                        className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                        placeholder="🔨"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Title</label>
                      <input
                        type="text"
                        value={val(titleKey)}
                        onChange={(e) => set(titleKey, e.target.value)}
                        className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                        placeholder={DEFAULTS[titleKey]}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Description</label>
                    <textarea
                      rows={2}
                      value={val(descKey)}
                      onChange={(e) => set(descKey, e.target.value)}
                      className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] resize-none"
                      placeholder={DEFAULTS[descKey]}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Save bar */}
        <div className="flex items-center justify-between bg-white border border-[#E8DDD0] rounded-xl px-6 py-4">
          <div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {saved && <p className="text-green-600 text-sm font-medium">Changes saved!</p>}
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
