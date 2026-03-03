import Link from "next/link";

interface Testimonial {
  clientName: string;
  rating: number;
  comment: string;
  location?: string;
  category?: string;
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    clientName: "Sarah & Mike T.",
    rating: 5,
    comment:
      "Jason built us an absolutely stunning wraparound deck. From the first consultation to handover, the whole process was smooth, professional, and the quality is outstanding. Couldn't be happier!",
    location: "Burnside, SA",
    category: "Deck",
  },
  {
    clientName: "Dave R.",
    rating: 5,
    comment:
      "Needed a big shed for my workshop and Jason delivered beyond expectations. Solid as a rock, finished on time, and the price was exactly what was quoted. Highly recommend.",
    location: "Gawler, SA",
    category: "Shed",
  },
  {
    clientName: "The Nguyen Family",
    rating: 5,
    comment:
      "We now have the best backyard on the street! Jason took our vague ideas and turned them into a beautiful deck that perfectly suits our home. Fair price, great communication, brilliant result.",
    location: "Prospect, SA",
    category: "Deck",
  },
];

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

export default function TestimonialsSection({
  testimonials = defaultTestimonials,
}: TestimonialsSectionProps) {
  return (
    <section className="py-24 bg-[#FAF5EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#8B5E3C] text-sm font-semibold tracking-[0.3em] uppercase mb-3">
            Testimonials
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#2C2C2C] mb-4 font-[var(--font-heading)]">
            What Our Clients Say
          </h2>
          <p className="text-[#8C8277] text-lg max-w-xl mx-auto">
            We let the work speak for itself — and our clients are happy to do
            the same.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-7 shadow-sm border border-[#E8DDD0] hover:shadow-md transition-shadow"
            >
              <StarRating rating={t.rating} />
              <blockquote className="mt-4 text-[#2C2C2C] leading-relaxed text-sm">
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
