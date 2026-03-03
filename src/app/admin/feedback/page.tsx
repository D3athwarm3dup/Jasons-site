import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import FeedbackActions from "@/components/admin/FeedbackActions";

async function getFeedback() {
  try {
    return await prisma.feedback.findMany({
      orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
      include: { project: { select: { title: true, slug: true } } },
    });
  } catch {
    return [];
  }
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-4 h-4 ${s <= rating ? "text-[#C4936A]" : "text-[#E8DDD0]"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default async function AdminFeedbackPage() {
  const feedback = await getFeedback();
  const pending = feedback.filter((f) => !f.approved);
  const approved = feedback.filter((f) => f.approved);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2C2C2C] font-[var(--font-heading)]">Client Feedback</h1>
        <p className="text-[#8C8277] mt-1">
          {pending.length} pending approval &middot; {approved.length} published
        </p>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base font-bold text-[#2C2C2C] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#C4936A] rounded-full" />
            Pending Approval ({pending.length})
          </h2>
          <div className="space-y-4">
            {pending.map((f) => (
              <div key={f.id} className="bg-white rounded-xl border border-[#C4936A]/30 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <StarDisplay rating={f.rating} />
                      <span className="text-xs text-[#8C8277] bg-[#FAF5EE] px-2 py-0.5 rounded">
                        {f.project.title}
                      </span>
                    </div>
                    <blockquote className="text-[#2C2C2C] text-sm leading-relaxed mb-2">
                      &ldquo;{f.comment}&rdquo;
                    </blockquote>
                    <p className="text-xs text-[#8C8277]">
                      — {f.clientName} &middot; {formatDate(f.createdAt)}
                    </p>
                  </div>
                  <FeedbackActions feedbackId={f.id} approved={false} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved */}
      <div>
        <h2 className="text-base font-bold text-[#2C2C2C] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#3D5A3E] rounded-full" />
          Published Reviews ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E8DDD0] p-10 text-center text-[#8C8277] text-sm">
            No approved reviews yet.
          </div>
        ) : (
          <div className="space-y-3">
            {approved.map((f) => (
              <div key={f.id} className="bg-white rounded-xl border border-[#E8DDD0] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <StarDisplay rating={f.rating} />
                      <span className="text-xs text-[#8C8277] bg-[#FAF5EE] px-2 py-0.5 rounded">
                        {f.project.title}
                      </span>
                    </div>
                    <blockquote className="text-[#2C2C2C] text-sm leading-relaxed mb-1">
                      &ldquo;{f.comment}&rdquo;
                    </blockquote>
                    <p className="text-xs text-[#8C8277]">— {f.clientName} &middot; {formatDate(f.createdAt)}</p>
                  </div>
                  <FeedbackActions feedbackId={f.id} approved={true} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
