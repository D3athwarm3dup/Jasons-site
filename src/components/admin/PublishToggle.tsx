"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PublishToggle({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(published);

  async function toggle() {
    setLoading(true);
    const res = await fetch(`/api/projects/${id}/publish`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !current }),
    });
    if (res.ok) {
      setCurrent((p) => !p);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={current ? "Click to unpublish" : "Click to publish"}
      className={`text-xs px-2.5 py-1 rounded font-medium transition-colors disabled:opacity-60 ${
        current
          ? "bg-[#3D5A3E]/10 text-[#3D5A3E] hover:bg-red-50 hover:text-red-600"
          : "bg-[#E8DDD0] text-[#8C8277] hover:bg-[#3D5A3E]/10 hover:text-[#3D5A3E]"
      }`}
    >
      {loading ? "…" : current ? "Published" : "Draft"}
    </button>
  );
}
