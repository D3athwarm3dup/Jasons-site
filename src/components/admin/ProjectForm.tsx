"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface ProjectImage {
  id?: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
  role: string; // "before" | "after" | "gallery"
  file?: File;
}

interface ProjectFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    location: string;
    category: string;
    completedAt: string;
    published: boolean;
    featured: boolean;
    images: ProjectImage[];
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  };
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    location: initialData?.location ?? "",
    category: initialData?.category ?? "deck",
    completedAt: initialData?.completedAt ?? new Date().toISOString().split("T")[0],
    published: initialData?.published ?? false,
    featured: initialData?.featured ?? false,
  });

  const [seo, setSeo] = useState({
    metaTitle: initialData?.metaTitle ?? "",
    metaDescription: initialData?.metaDescription ?? "",
    metaKeywords: initialData?.metaKeywords ?? "",
  });

  const [images, setImages] = useState<ProjectImage[]>(initialData?.images ?? []);
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackName, setFeedbackName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [feedbackLinkStatus, setFeedbackLinkStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [feedbackLink, setFeedbackLink] = useState("");

  async function handleImageUpload(files: FileList) {
    const newImages: ProjectImage[] = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          newImages.push({
            url: data.url,
            alt: "",
            isPrimary: images.length === 0 && newImages.length === 0,
            order: images.length + newImages.length,
            role: "gallery",
          });
        }
      } catch {
        console.error("Upload failed for", file.name);
      }
    }
    setImages((prev) => [...prev, ...newImages]);
  }

  function setRole(index: number, role: string) {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, role } : img))
    );
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const url = initialData ? `/api/projects/${initialData.id}` : "/api/projects";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...seo, images }),
      });

      if (res.ok) {
        setStatus("success");
        router.push("/admin/projects");
        router.refresh();
      } else {
        const data = await res.json();
        setErrorMsg(data.error ?? "Failed to save project.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  async function sendFeedbackLink() {
    if (!initialData?.id || !feedbackEmail || !feedbackName) return;
    setFeedbackLinkStatus("loading");

    try {
      const res = await fetch("/api/feedback-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: initialData.id,
          clientEmail: feedbackEmail,
          clientName: feedbackName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setFeedbackLink(`${window.location.origin}/feedback/${data.token}`);
        setFeedbackLinkStatus("sent");
      }
    } catch {
      setFeedbackLinkStatus("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic details */}
      <div className="bg-white rounded-xl border border-[#E8DDD0] p-6">
        <h2 className="text-lg font-bold text-[#2C2C2C] font-[var(--font-heading)] mb-5">Project Details</h2>
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">
                Project Title <span className="text-[#8B5E3C]">*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5E3C]"
                placeholder="e.g. Burnside Hardwood Entertainment Deck"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5E3C]"
                placeholder="e.g. Burnside, SA"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] bg-white"
              >
                <option value="deck">Deck</option>
                <option value="shed">Shed</option>
                <option value="pergola">Pergola</option>
                <option value="carport">Carport</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Date Completed</label>
              <input
                type="date"
                value={form.completedAt}
                onChange={(e) => setForm({ ...form, completedAt: e.target.value })}
                className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5E3C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">
              Project Description <span className="text-[#8B5E3C]">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] resize-none"
              placeholder="Describe the project - what was built, materials used, any special features or challenges..."
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="w-4 h-4 accent-[#8B5E3C]"
              />
              <span className="text-sm text-[#2C2C2C]">Published (visible on website)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 accent-[#8B5E3C]"
              />
              <span className="text-sm text-[#2C2C2C]">Featured (shown first)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border border-[#E8DDD0] p-6">
        <h2 className="text-lg font-bold text-[#2C2C2C] font-[var(--font-heading)] mb-2">Project Photos</h2>
        <p className="text-sm text-[#8C8277] mb-5">
          Upload photos. Tag each as <strong>Before</strong>, <strong>After</strong>, or <strong>Gallery</strong> - if you have a Before and After image, a drag-reveal slider will appear on the project page.
        </p>

        {/* Upload area */}
        <div
          className="border-2 border-dashed border-[#E8DDD0] rounded-xl p-8 text-center cursor-pointer hover:border-[#C4936A] transition-colors mb-5"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files.length > 0) handleImageUpload(e.dataTransfer.files);
          }}
        >
          <svg className="w-10 h-10 text-[#C4936A] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-[#2C2C2C] font-medium">Click to upload or drag and drop</p>
          <p className="text-xs text-[#8C8277] mt-1">JPEG, PNG, WEBP up to 10MB each</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
          />
        </div>

        {/* Image grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative group space-y-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt}
                  className={`w-full aspect-square object-cover rounded-lg border-2 ${
                    img.role === "before"
                      ? "border-blue-400"
                      : img.role === "after"
                      ? "border-[#8B5E3C]"
                      : "border-[#E8DDD0]"
                  }`}
                />
                {/* Role badge */}
                <div className="absolute top-1 left-1">
                  {img.role === "before" && (
                    <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded font-semibold">Before</span>
                  )}
                  {img.role === "after" && (
                    <span className="bg-[#8B5E3C] text-white text-xs px-1.5 py-0.5 rounded font-semibold">After</span>
                  )}
                </div>
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full hidden group-hover:flex items-center justify-center text-xs"
                >
                  ×
                </button>
                {/* Role selector */}
                <select
                  value={img.role}
                  onChange={(e) => setRole(index, e.target.value)}
                  className="w-full text-xs border border-[#E8DDD0] rounded px-2 py-1 bg-white focus:outline-none focus:border-[#8B5E3C] text-[#2C2C2C]"
                >
                  <option value="gallery">Gallery</option>
                  <option value="before">Before (slider)</option>
                  <option value="after">After (slider)</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback link (only for existing projects) */}
      {initialData && (
        <div className="bg-white rounded-xl border border-[#E8DDD0] p-6">
          <h2 className="text-lg font-bold text-[#2C2C2C] font-[var(--font-heading)] mb-2">
            Request Client Feedback
          </h2>
          <p className="text-sm text-[#8C8277] mb-5">
            Enter the client&apos;s details to generate a unique feedback link you can send them.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Client Name"
              value={feedbackName}
              onChange={(e) => setFeedbackName(e.target.value)}
              className="border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5E3C]"
            />
            <input
              type="email"
              placeholder="Client Email"
              value={feedbackEmail}
              onChange={(e) => setFeedbackEmail(e.target.value)}
              className="border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5E3C]"
            />
          </div>
          {feedbackLink ? (
            <div className="bg-[#FAF5EE] rounded-lg p-4 border border-[#E8DDD0]">
              <p className="text-sm font-medium text-[#2C2C2C] mb-2">Feedback Link Generated:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={feedbackLink}
                  className="flex-1 bg-white border border-[#E8DDD0] rounded px-3 py-2 text-sm text-[#8C8277]"
                />
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(feedbackLink)}
                  className="bg-[#8B5E3C] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#6B4226]"
                >
                  Copy
                </button>
              </div>
              <p className="text-xs text-[#8C8277] mt-2">
                Share this link with your client so they can leave their review.
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={sendFeedbackLink}
              disabled={feedbackLinkStatus === "loading" || !feedbackEmail || !feedbackName}
              className="bg-[#3D5A3E] hover:bg-[#2A3F2B] disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              {feedbackLinkStatus === "loading" ? "Generating..." : "Generate Feedback Link"}
            </button>
          )}
        </div>
      )}

      {/* SEO & Discoverability */}
      <div className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
        <button
          type="button"
          onClick={() => document.getElementById('seo-section')?.classList.toggle('hidden')}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#FAF5EE] transition-colors"
        >
          <div>
            <h2 className="text-lg font-bold text-[#2C2C2C] font-[var(--font-heading)]">SEO &amp; Discoverability</h2>
            <p className="text-xs text-[#8C8277] mt-0.5">Optional - override how this project appears in Google search results.</p>
          </div>
          <svg className="w-5 h-5 text-[#8C8277] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div id="seo-section" className="hidden border-t border-[#E8DDD0] p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Meta Title</label>
            <input
              type="text"
              value={seo.metaTitle}
              onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
              placeholder={form.title || "Defaults to project title"}
              className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5E3C]"
            />
            <p className="text-xs text-[#8C8277] mt-1">Appears in the browser tab and Google search result title. Leave blank to use the project title.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Meta Description</label>
            <textarea
              rows={3}
              value={seo.metaDescription}
              onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
              placeholder="Leave blank to use the project description (first 160 characters)."
              className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] resize-none"
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-[#8C8277]">Shown beneath the title in Google results. Aim for 120–160 characters.</p>
              <p className={`text-xs shrink-0 ml-2 ${seo.metaDescription.length > 160 ? 'text-red-500' : 'text-[#8C8277]'}`}>
                {seo.metaDescription.length}/160
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Keywords</label>
            <input
              type="text"
              value={seo.metaKeywords}
              onChange={(e) => setSeo({ ...seo, metaKeywords: e.target.value })}
              placeholder="hardwood deck Adelaide, entertainer deck, decking builder SA"
              className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5E3C]"
            />
            <p className="text-xs text-[#8C8277] mt-1">Comma-separated keywords related to this project.</p>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-[#8B5E3C] hover:bg-[#6B4226] disabled:opacity-60 text-white font-bold px-8 py-3 rounded-lg transition-colors"
        >
          {status === "loading" ? "Saving..." : initialData ? "Update Project" : "Create Project"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="text-[#8C8277] hover:text-[#2C2C2C] text-sm font-medium"
        >
          Cancel
        </button>
        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
      </div>
    </form>
  );
}
