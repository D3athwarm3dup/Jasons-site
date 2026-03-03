"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface FeedbackActionsProps {
  feedbackId: string;
  approved: boolean;
}

export default function FeedbackActions({ feedbackId, approved }: FeedbackActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleApprove() {
    setLoading(true);
    await fetch(`/api/feedback/${feedbackId}/approve`, { method: "POST" });
    router.refresh();
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setLoading(true);
    await fetch(`/api/feedback/${feedbackId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      {!approved && (
        <button
          onClick={handleApprove}
          disabled={loading}
          className="bg-[#3D5A3E] hover:bg-[#2A3F2B] disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          Approve
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-red-400 hover:text-red-600 text-xs font-medium disabled:opacity-50 transition-colors"
      >
        Delete
      </button>
    </div>
  );
}
