import { prisma } from "@/lib/prisma";
import TestimonialsCarousel, { type Testimonial } from "./TestimonialsCarousel";

const DEFAULTS = {
  testimonials_label: "Testimonials",
  testimonials_heading: "What Our Clients Say",
  testimonials_description:
    "We let the work speak for itself \u2014 and our clients are happy to do the same.",
};

const fallbackTestimonials: Testimonial[] = [
  {
    clientName: "Sarah & Mike T.",
    rating: 5,
    comment:
      "Jason built us an absolutely stunning wraparound deck. From the first consultation to handover, the whole process was smooth, professional, and the quality is outstanding. Couldn\u2019t be happier!",
    location: "Burnside, SA",
    category: "Deck",
    source: "site",
  },
  {
    clientName: "Dave R.",
    rating: 5,
    comment:
      "Needed a big shed for my workshop and Jason delivered beyond expectations. Solid as a rock, finished on time, and the price was exactly what was quoted. Highly recommend.",
    location: "Gawler, SA",
    category: "Shed",
    source: "site",
  },
  {
    clientName: "The Nguyen Family",
    rating: 5,
    comment:
      "We now have the best backyard on the street! Jason took our vague ideas and turned them into a beautiful deck that perfectly suits our home. Fair price, great communication, brilliant result.",
    location: "Prospect, SA",
    category: "Deck",
    source: "site",
  },
];

async function fetchGoogleReviews(
  placeId: string,
  apiKey: string
): Promise<Testimonial[]> {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=reviews&key=${apiKey}&language=en`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    const reviews = data?.result?.reviews ?? [];
    return reviews
      .filter((r: { text?: string; rating?: number }) => r.text && r.rating)
      .map((r: { author_name: string; rating: number; text: string; relative_time_description?: string }) => ({
        clientName: r.author_name,
        rating: r.rating,
        comment: r.text,
        location: r.relative_time_description,
        source: "google" as const,
      }));
  } catch {
    return [];
  }
}

interface TestimonialProps {
  testimonials?: Testimonial[];
}

export default async function TestimonialsSection({ testimonials }: TestimonialProps) {
  const rows = await prisma.siteSettings.findMany();
  const s = Object.fromEntries(rows.map((r: { key: string; value: string }) => [r.key, r.value]));
  const t = { ...DEFAULTS, ...s };

  // Fetch Google reviews if credentials are configured
  let googleReviews: Testimonial[] = [];
  if (s.google_place_id && s.google_places_api_key) {
    googleReviews = await fetchGoogleReviews(s.google_place_id, s.google_places_api_key);
  }

  // Use real DB testimonials if any, otherwise show fallback defaults
  const siteReviews: Testimonial[] = (testimonials && testimonials.length > 0
    ? testimonials.map((t) => ({ ...t, source: "site" as const }))
    : fallbackTestimonials);

  // Interleave: site review, google review, site review, google review...
  const combined: Testimonial[] = [];
  const maxLen = Math.max(siteReviews.length, googleReviews.length);
  for (let i = 0; i < maxLen; i++) {
    if (siteReviews[i]) combined.push(siteReviews[i]);
    if (googleReviews[i]) combined.push(googleReviews[i]);
  }

  return (
    <TestimonialsCarousel
      testimonials={combined}
      label={t.testimonials_label}
      heading={t.testimonials_heading}
      description={t.testimonials_description}
    />
  );
}
