"use client";

import { useState } from "react";

interface LeaveAReviewProps {
  projectSlug: string;
}

export default function LeaveAReview({ projectSlug }: LeaveAReviewProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0 || !name.trim() || !comment.trim()) return;
    setStatus("loading");

    try {
      const res = await fetch(`/api/projects/${projectSlug}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, clientName: name.trim(), comment: comment.trim() }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-[#3D5A3E] rounded-xl p-6 text-white">
        <div className="text-3xl mb-3 text-center">🙏</div>
        <h3 className="text-lg font-bold text-center mb-1 font-[var(--font-heading)]">
          Thank you!
        </h3>
        <p className="text-[#E8DDD0] text-sm text-center">
          Your review has been submitted and will appear once approved. We really appreciate it!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF5EE] rounded-xl border border-[#E8DDD0] overflow-hidden">
      {/* Header / collapsed state */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#F0E8DF] transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-[#8B5E3C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <div>
            <p className="font-semibold text-[#2C2C2C] text-sm">Was this your project?</p>
            <p className="text-xs text-[#8C8277]">Leave a review for Jason</p>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-[#8C8277] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded form */}
      {open && (
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4 border-t border-[#E8DDD0]">
          <div className="pt-4">
            {/* Star picker */}
            <label className="block text-xs font-medium text-[#8C8277] uppercase tracking-wider mb-2">
              Your Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                  aria-label={`${star} star${star !== 1 ? "s" : ""}`}
                >
                  <svg
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating) ? "text-[#C4936A]" : "text-[#E8DDD0]"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
            {rating === 0 && status === "error" && (
              <p className="text-xs text-red-500 mt-1">Please select a star rating.</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-[#8C8277] uppercase tracking-wider mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah M."
              className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent bg-white"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-medium text-[#8C8277] uppercase tracking-wider mb-1">
              Your Review
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience with Jason and the finished result…"
              className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent resize-none bg-white"
            />
          </div>

          {status === "error" && (
            <p className="text-xs text-red-600">
              Something went wrong. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading" || rating === 0}
            className="w-full bg-[#8B5E3C] hover:bg-[#6B4226] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
          >
            {status === "loading" ? "Submitting…" : "Submit Review"}
          </button>

          <p className="text-xs text-[#8C8277] text-center">
            Reviews are approved by Jason before being published.
          </p>
        </form>
      )}
    </div>
  );
}
