"use client";

import { useState, useEffect } from "react";

interface LeaveAReviewProps {
  projectSlug: string;
}

type Step = "closed" | "pin" | "form" | "success";

export default function LeaveAReview({ projectSlug }: LeaveAReviewProps) {
  const [step, setStep] = useState<Step>("closed");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "error">("idle");

  // Lock body scroll when modal is open
  useEffect(() => {
    if (step !== "closed") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [step]);

  function closeModal() {
    setStep("closed");
    setPin("");
    setPinError("");
    setRating(0);
    setHoverRating(0);
    setName("");
    setComment("");
    setSubmitStatus("idle");
  }

  async function handleVerifyPin(e: React.FormEvent) {
    e.preventDefault();
    if (!pin.trim()) return;
    setPinLoading(true);
    setPinError("");

    try {
      const res = await fetch(`/api/projects/${projectSlug}/verify-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pin.trim() }),
      });
      const data = await res.json();
      if (data.valid) {
        setStep("form");
      } else {
        setPinError("Incorrect PIN. Please check with Jason and try again.");
      }
    } catch {
      setPinError("Something went wrong. Please try again.");
    } finally {
      setPinLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0 || !name.trim() || !comment.trim()) return;
    setSubmitStatus("loading");

    try {
      const res = await fetch(`/api/projects/${projectSlug}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          clientName: name.trim(),
          comment: comment.trim(),
          pin: pin.trim(),
        }),
      });

      if (res.ok) {
        setStep("success");
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    }
  }

  return (
    <>
      {/* ── Prominent banner ── */}
      <div className="mt-16 rounded-2xl overflow-hidden bg-gradient-to-r from-[#3D5A3E] to-[#2A3F2B] px-8 py-10 flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
          <svg className="w-7 h-7 text-[#C4936A]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-white font-[var(--font-heading)] mb-1">
            Was this your project?
          </h3>
          <p className="text-[#B8D4B9] text-sm leading-relaxed">
            We&apos;d love to hear about your experience. Leave a review and help others see what Jason can build — Jason will have given you a PIN to get started.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStep("pin")}
          className="flex-shrink-0 bg-[#C4936A] hover:bg-[#A97A56] text-white font-bold px-7 py-3 rounded-xl text-sm transition-colors whitespace-nowrap shadow-lg"
        >
          Leave a Review
        </button>
      </div>

      {/* ── Modal overlay ── */}
      {step !== "closed" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DDD0]">
              <div className="flex items-center gap-2">
                {/* Step indicator */}
                <span className={`w-2 h-2 rounded-full ${step === "pin" ? "bg-[#C4936A]" : "bg-[#E8DDD0]"}`} />
                <span className={`w-2 h-2 rounded-full ${step === "form" ? "bg-[#C4936A]" : "bg-[#E8DDD0]"}`} />
                <span className={`w-2 h-2 rounded-full ${step === "success" ? "bg-[#3D5A3E]" : "bg-[#E8DDD0]"}`} />
              </div>
              <h2 className="text-base font-bold text-[#2C2C2C] font-[var(--font-heading)]">
                {step === "pin" && "Enter your PIN"}
                {step === "form" && "Leave your review"}
                {step === "success" && "Thank you!"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#FAF5EE] text-[#8C8277] hover:text-[#2C2C2C] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Step 1 — PIN */}
            {step === "pin" && (
              <form onSubmit={handleVerifyPin} className="p-6 space-y-5">
                <p className="text-sm text-[#8C8277] leading-relaxed">
                  Jason gave you a unique PIN when your project was completed. Enter it below to unlock the review form.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-[#2C2C2C] uppercase tracking-wider mb-2">
                    Project PIN
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={8}
                    autoFocus
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value.replace(/\D/g, ""));
                      setPinError("");
                    }}
                    placeholder="e.g. 4821"
                    className="w-full border-2 border-[#E8DDD0] rounded-xl px-4 py-3 text-xl font-mono tracking-[0.4em] text-center focus:outline-none focus:border-[#8B5E3C] bg-[#FAF5EE]"
                  />
                  {pinError && (
                    <p className="text-sm text-red-600 mt-2 text-center">{pinError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={pinLoading || pin.length === 0}
                  className="w-full bg-[#8B5E3C] hover:bg-[#6B4226] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-colors"
                >
                  {pinLoading ? "Checking…" : "Continue →"}
                </button>
              </form>
            )}

            {/* Step 2 — Review form */}
            {step === "form" && (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Stars */}
                <div>
                  <label className="block text-xs font-semibold text-[#2C2C2C] uppercase tracking-wider mb-3">
                    Your Rating
                  </label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                        aria-label={`${star} star${star !== 1 ? "s" : ""}`}
                      >
                        <svg
                          className={`w-10 h-10 transition-colors ${
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
                  {rating === 0 && (
                    <p className="text-xs text-[#8C8277] text-center mt-1">Tap a star to rate</p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#2C2C2C] uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah M."
                    className="w-full border border-[#E8DDD0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] bg-[#FAF5EE]"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-semibold text-[#2C2C2C] uppercase tracking-wider mb-1.5">
                    Your Review
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell others about your experience — the build quality, communication, the finished result…"
                    className="w-full border border-[#E8DDD0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] resize-none bg-[#FAF5EE]"
                  />
                </div>

                {submitStatus === "error" && (
                  <p className="text-sm text-red-600 text-center">Something went wrong. Please try again.</p>
                )}

                <button
                  type="submit"
                  disabled={submitStatus === "loading" || rating === 0 || !name.trim() || !comment.trim()}
                  className="w-full bg-[#3D5A3E] hover:bg-[#2A3F2B] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-colors"
                >
                  {submitStatus === "loading" ? "Submitting…" : "Submit Review"}
                </button>
              </form>
            )}

            {/* Step 3 — Success */}
            {step === "success" && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#3D5A3E]/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#3D5A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#2C2C2C] font-[var(--font-heading)] mb-2">
                  Review submitted!
                </h3>
                <p className="text-[#8C8277] text-sm leading-relaxed mb-6">
                  Thank you — your review has been sent to Jason for approval and will appear on the site shortly. We really appreciate you taking the time.
                </p>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-[#8B5E3C] hover:bg-[#6B4226] text-white font-semibold px-8 py-2.5 rounded-xl text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

          {submitStatus === "error" && (
            <p className="text-xs text-red-600">
              Something went wrong. Please try again.
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitStatus === "loading" || rating === 0}
              className="flex-1 bg-[#8B5E3C] hover:bg-[#6B4226] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
            >
              {submitStatus === "loading" ? "Submitting…" : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => { setStep("pin"); setSubmitStatus("idle"); }}
              className="px-4 py-2.5 text-sm text-[#8C8277] hover:text-[#2C2C2C] transition-colors"
            >
              Back
            </button>
          </div>

          <p className="text-xs text-[#8C8277] text-center">
            Reviews are approved by Jason before being published.
          </p>
        </form>
      )}
    </div>
  );
}
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
