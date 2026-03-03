"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/NavbarServer";
import Footer from "@/components/Footer";

export default function FeedbackPage() {
  const params = useParams();
  const token = params.token as string;

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "used" | "invalid">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;
    setStatus("loading");

    try {
      const res = await fetch(`/api/feedback/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment, clientName: name }),
      });

      if (res.status === 404) {
        setStatus("invalid");
      } else if (res.status === 409) {
        setStatus("used");
      } else if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAF5EE] py-16">
        <div className="max-w-xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#8B5E3C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#8B5E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-[#2C2C2C] font-[var(--font-heading)]">
              Leave Your Feedback
            </h1>
            <p className="text-[#8C8277] mt-2">
              We&apos;d love to hear what you thought of your project with Norris Decking & Sheds.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#E8DDD0] p-8">
            {status === "success" && (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2 font-[var(--font-heading)]">
                  Thank You!
                </h2>
                <p className="text-[#8C8277]">
                  Your feedback has been submitted and will be shared on our website once reviewed.
                  We really appreciate you taking the time!
                </p>
              </div>
            )}

            {status === "used" && (
              <div className="text-center py-8">
                <p className="text-[#8C8277] text-lg">
                  Feedback for this project has already been submitted. Thank you!
                </p>
              </div>
            )}

            {status === "invalid" && (
              <div className="text-center py-8">
                <p className="text-[#8C8277] text-lg">
                  This feedback link is invalid or has expired. Please contact Jason directly.
                </p>
              </div>
            )}

            {(status === "idle" || status === "loading" || status === "error") && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Star rating */}
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-3">
                    Overall Rating <span className="text-[#8B5E3C]">*</span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <svg
                          className={`w-10 h-10 transition-colors ${
                            star <= (hoverRating || rating)
                              ? "text-[#C4936A]"
                              : "text-[#E8DDD0]"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-[#8C8277] mt-2">
                      {["", "Poor", "Fair", "Good", "Great", "Outstanding!"][rating]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">
                    Your Name <span className="text-[#8B5E3C]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                    placeholder="John & Jane Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">
                    Your Review <span className="text-[#8B5E3C]">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] resize-none"
                    placeholder="Tell us about your experience - the process, the result, anything you'd like to share..."
                  />
                </div>

                {status === "error" && (
                  <p className="text-red-500 text-sm">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading" || rating === 0}
                  className="w-full bg-[#8B5E3C] hover:bg-[#6B4226] disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  {status === "loading" ? "Submitting..." : "Submit Feedback"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
