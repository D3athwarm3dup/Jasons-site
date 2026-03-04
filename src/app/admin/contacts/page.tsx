"use client";

import { useState, useEffect } from "react";

type Contact = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  source: string;
  notes: string;
  optedIn: boolean;
  createdAt: string;
};

function newContact(): Omit<Contact, "id" | "createdAt"> {
  return { name: "", email: "", phone: "", source: "manual", notes: "", optedIn: true };
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(newContact());
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/contacts");
      const data = await res.json();
      setContacts(data);
    } catch {
      setError("Could not load contacts.");
    }
    setLoading(false);
  }

  useEffect(() => {
    (async () => { await load(); })();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setAdding(false);
      setForm(newContact());
      load();
    }
  }

  async function toggleOptIn(id: string, current: boolean) {
    await fetch(`/api/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optedIn: !current }),
    });
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, optedIn: !current } : c))
    );
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this contact?")) return;
    await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    );
  });

  const optedInCount = contacts.filter((c) => c.optedIn).length;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2C2C2C] font-[var(--font-heading)]">
            Contacts
          </h1>
          <p className="text-[#8C8277] mt-1 text-sm">
            {contacts.length} total &middot; {optedInCount} opted in for marketing
          </p>
        </div>
        <div className="flex gap-2">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/contacts/export"
            className="flex items-center gap-2 text-sm border border-[#E8DDD0] text-[#2C2C2C] hover:border-[#8B5E3C] hover:text-[#8B5E3C] px-4 py-2 rounded-lg transition-colors bg-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </a>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 text-sm bg-[#8B5E3C] hover:bg-[#6B4226] text-white px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Contact
          </button>
        </div>
      </div>

      {/* Add contact form */}
      {adding && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-xl border border-[#8B5E3C]/30 p-6 mb-6 space-y-4"
        >
          <h2 className="font-semibold text-[#2C2C2C]">Add Manual Contact</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">
                Name <span className="text-[#8B5E3C]">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Email</label>
              <input
                type="email"
                value={form.email ?? ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Phone</label>
              <input
                type="tel"
                value={form.phone ?? ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                placeholder="04xx xxx xxx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Notes</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                placeholder="How you know them, job type, etc."
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-[#2C2C2C]">
              <input
                type="checkbox"
                checked={form.optedIn}
                onChange={(e) => setForm({ ...form, optedIn: e.target.checked })}
                className="w-4 h-4 accent-[#8B5E3C]"
              />
              Opted in for marketing
            </label>
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#8B5E3C] hover:bg-[#6B4226] disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              {saving ? "Saving..." : "Add Contact"}
            </button>
            <button
              type="button"
              onClick={() => { setAdding(false); setForm(newContact()); }}
              className="text-sm text-[#8C8277] hover:text-[#2C2C2C] px-4 py-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8277]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or phone..."
          className="w-full pl-9 pr-4 py-2.5 border border-[#E8DDD0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
        />
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E8DDD0] p-16 text-center text-[#8C8277]">
          {search ? "No contacts match your search." : "No contacts yet — they'll appear automatically when enquiry forms are submitted."}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-[#E8DDD0] bg-[#FAF5EE] text-xs font-semibold text-[#8C8277] uppercase tracking-wide">
            <span>Name / Contact</span>
            <span>Notes</span>
            <span>Source</span>
            <span>Opt-in</span>
            <span></span>
          </div>

          {filtered.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-4 border-b border-[#E8DDD0] last:border-0 items-center hover:bg-[#FDFAF7] transition-colors"
            >
              {/* Name + contact details */}
              <div>
                <p className="font-medium text-[#2C2C2C] text-sm">{c.name}</p>
                <div className="flex flex-col gap-0.5 mt-0.5">
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="text-xs text-[#8C8277] hover:text-[#8B5E3C] transition-colors">
                      {c.email}
                    </a>
                  )}
                  {c.phone && (
                    <a href={`tel:${c.phone}`} className="text-xs text-[#8C8277] hover:text-[#8B5E3C] transition-colors">
                      {c.phone}
                    </a>
                  )}
                </div>
                <p className="text-[10px] text-[#B0A89E] mt-1">
                  Added {new Date(c.createdAt).toLocaleDateString("en-AU")}
                </p>
              </div>

              {/* Notes */}
              <p className="text-xs text-[#8C8277] truncate">{c.notes || <span className="text-[#C4B8AE]">—</span>}</p>

              {/* Source badge */}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                c.source === "enquiry"
                  ? "bg-[#EBF5EC] text-[#3D6B3E]"
                  : "bg-[#EEF0FB] text-[#4A5AB0]"
              }`}>
                {c.source}
              </span>

              {/* Opt-in toggle */}
              <button
                onClick={() => toggleOptIn(c.id, c.optedIn)}
                title={c.optedIn ? "Click to opt out" : "Click to opt in"}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  c.optedIn ? "bg-[#8B5E3C]" : "bg-[#D9D0C8]"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                    c.optedIn ? "left-[calc(100%-18px)]" : "left-0.5"
                  }`}
                />
              </button>

              {/* Delete */}
              <button
                onClick={() => handleDelete(c.id)}
                className="text-[#C4B8AE] hover:text-red-500 transition-colors"
                title="Remove contact"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
