import Link from "next/link";
import Image from "next/image";
import { getCategoryLabel, formatDate } from "@/lib/utils";

interface ProjectCardProps {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  category: string;
  completedAt: Date | string;
  primaryImage?: string;
  feedbackCount?: number;
  avgRating?: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-[#C4936A]" : "text-[#E8DDD0]"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProjectCard({
  title,
  slug,
  description,
  location,
  category,
  completedAt,
  primaryImage,
  feedbackCount = 0,
  avgRating,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className="block group">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#E8DDD0] hover:shadow-md transition-all">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-[#E8DDD0] overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#E8DDD0] to-[#C4936A]/20">
              <svg className="w-16 h-16 text-[#8C8277]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="bg-[#8B5E3C] text-white text-xs font-semibold px-2.5 py-1 rounded">
              {getCategoryLabel(category)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-[#2C2C2C] mb-1 font-[var(--font-heading)] group-hover:text-[#8B5E3C] transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-xs text-[#8C8277] mb-3">
            {location} &middot; {formatDate(completedAt)}
          </p>
          <p className="text-sm text-[#8C8277] leading-relaxed line-clamp-2 mb-4">
            {description}
          </p>

          {feedbackCount > 0 && avgRating !== undefined && (
            <div className="flex items-center gap-2 pt-3 border-t border-[#E8DDD0]">
              <StarRating rating={avgRating} />
              <span className="text-xs text-[#8C8277]">
                {feedbackCount} review{feedbackCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
