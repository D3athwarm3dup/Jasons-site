"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EnquiryActions({ enquiryId, read }: { enquiryId: string; read: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function markRead() {
    setLoading(true);
    await fetch(`/api/contact/${enquiryId}/read`, { method: "POST" });
    router.refresh();
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this enquiry?")) return;
    setLoading(true);
    await fetch(`/api/contact/${enquiryId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-2 shrink-0">
      {!read && (
        <button
          onClick={markRead}
          disabled={loading}
          className="bg-[#8B5E3C]/10 hover:bg-[#8B5E3C]/20 text-[#8B5E3C] text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          Mark Read
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-red-400 hover:text-red-600 text-xs font-medium disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
