"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  category: string;
  order: number;
}

export default function GalleryManager({ images: initialImages }: { images: GalleryImage[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("all");

  const categories = [
    { value: "all", label: "All" },
    { value: "general", label: "General" },
    { value: "deck", label: "Decks" },
    { value: "shed", label: "Sheds" },
    { value: "hero", label: "Hero / Banner" },
  ];

  async function handleUpload(files: FileList) {
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", filter === "all" ? "general" : filter);
      try {
        const res = await fetch("/api/gallery", { method: "POST", body: formData });
        if (res.ok) {
          const newImg = await res.json();
          setImages((prev) => [newImg, ...prev]);
        }
      } catch {
        console.error("Upload failed");
      }
    }
    setUploading(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  const filtered = filter === "all" ? images : images.filter((img) => img.category === filter);

  return (
    <div>
      {/* Upload area */}
      <div
        className="bg-white rounded-xl border-2 border-dashed border-[#E8DDD0] p-10 text-center cursor-pointer hover:border-[#C4936A] transition-colors mb-6"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files.length > 0) handleUpload(e.dataTransfer.files);
        }}
      >
        {uploading ? (
          <p className="text-[#8C8277]">Uploading...</p>
        ) : (
          <>
            <svg className="w-10 h-10 text-[#C4936A] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="text-[#2C2C2C] font-medium">Click to upload or drag & drop images</p>
            <p className="text-sm text-[#8C8277] mt-1">JPEG, PNG, WEBP — multiple files OK</p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === cat.value
                ? "bg-[#8B5E3C] text-white"
                : "bg-white border border-[#E8DDD0] text-[#8C8277] hover:text-[#8B5E3C]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Image grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E8DDD0] p-10 text-center text-[#8C8277]">
          No images in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {filtered.map((img) => (
            <div key={img.id} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt || "Gallery image"}
                className="w-full aspect-square object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <button
                  onClick={() => handleDelete(img.id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded font-medium"
                >
                  Delete
                </button>
              </div>
              <span className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">
                {img.category}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
