"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          {deleting ? "Deleting…" : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-[#8C8277] hover:text-[#2C2C2C]"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`Delete "${title}"`}
      className="text-sm text-[#8C8277] hover:text-red-600 transition-colors"
    >
      Delete
    </button>
  );
}
