"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export interface Testimonial {
  clientName: string;
  rating: number;
  comment: string;
  location?: string;
  category?: string;
  source?: "google" | "site";
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? "text-[#C4936A]" : "text-[#E8DDD0]"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function GoogleBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-[#8C8277] border border-[#E8DDD0] rounded px-1.5 py-0.5 ml-auto shrink-0">
      {/* Google G */}
      <svg viewBox="0 0 24 24" className="w-3 h-3" aria-hidden="true">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      Google Review
    </span>
  );
}

export default function TestimonialsCarousel({
  testimonials,
  label,
  heading,
  description,
}: {
  testimonials: Testimonial[];
  label: string;
  heading: string;
  description: string;
}) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const count = testimonials.length;
  const perPage = Math.min(3, count);

  const getSlice = useCallback(
    (start: number): Testimonial[] => {
      if (count === 0) return [];
      if (count <= 3) return testimonials;
      return Array.from({ length: 3 }, (_, i) => testimonials[(start + i) % count]);
    },
    [testimonials, count]
  );

  const goTo = useCallback(
    (next: number) => {
      if (next === index || count <= 3) return;
      setFading(true);
      setTimeout(() => {
        setIndex(next % count);
        setFading(false);
      }, 350);
    },
    [index, count]
  );

  useEffect(() => {
    if (count <= perPage) return;
    const id = setInterval(() => goTo((index + 1) % count), 40_000);
    return () => clearInterval(id);
  }, [index, count, perPage, goTo]);

  const displayed = getSlice(index);

  return (
    <section className="py-16 sm:py-24 bg-[#FAF5EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <p className="text-[#8B5E3C] text-sm font-semibold tracking-[0.3em] uppercase mb-3">
            {label}
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#2C2C2C] mb-4 font-[var(--font-heading)]">
            {heading}
          </h2>
          <p className="text-[#8C8277] text-lg max-w-xl mx-auto">{description}</p>
        </div>

        {/* Cards */}
        <div
          className={`grid md:grid-cols-3 gap-6 transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
        >
          {displayed.map((t, i) => (
            <div
              key={`${index}-${i}`}
              className="bg-white rounded-xl p-5 sm:p-7 shadow-sm border border-[#E8DDD0] hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-center gap-2">
                <StarRating rating={t.rating} />
                {t.source === "google" && <GoogleBadge />}
              </div>
              <blockquote className="mt-4 text-[#2C2C2C] leading-relaxed text-sm flex-1">
                &ldquo;{t.comment}&rdquo;
              </blockquote>
              <div className="mt-5 pt-5 border-t border-[#E8DDD0]">
                <p className="font-semibold text-[#2C2C2C] text-sm">{t.clientName}</p>
                {t.location && (
                  <p className="text-xs text-[#8C8277] mt-0.5">{t.location}</p>
                )}
                {t.category && (
                  <span className="inline-block mt-2 text-xs bg-[#FAF5EE] text-[#8B5E3C] border border-[#E8DDD0] px-2 py-0.5 rounded">
                    {t.category}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation dots — only shown when there are more than 3 */}
        {count > 3 && (
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  [0, 1, 2].map((o) => (index + o) % count).includes(i)
                    ? "w-5 h-2 bg-[#8B5E3C]"
                    : "w-2 h-2 bg-[#E8DDD0] hover:bg-[#C4936A]"
                }`}
              />
            ))}
          </div>
        )}

        {/* Progress bar */}
        {count > 3 && (
          <div className="flex justify-center mt-3">
            <div className="text-xs text-[#8C8277]">
              Showing {index + 1}–{Math.min(index + 3, count) <= count ? ((index + 2) % count) + 1 : count} of {count} reviews
              &nbsp;&middot;&nbsp;auto-advances every 40 s
            </div>
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[#8B5E3C] hover:text-[#6B4226] font-semibold text-sm transition-colors"
          >
            See our completed projects
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
