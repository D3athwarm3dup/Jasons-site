import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import EnquiryActions from "@/components/admin/EnquiryActions";

async function getEnquiries() {
  try {
    return await prisma.contactSubmission.findMany({
      orderBy: [{ read: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    return [];
  }
}

export default async function AdminEnquiriesPage() {
  const enquiries = await getEnquiries();
  const unread = enquiries.filter((e) => !e.read).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2C2C2C] font-[var(--font-heading)]">Enquiries</h1>
        <p className="text-[#8C8277] mt-1">
          {unread} unread &middot; {enquiries.length} total
        </p>
      </div>

      {enquiries.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E8DDD0] p-16 text-center text-[#8C8277]">
          No enquiries yet.
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((e) => (
            <div
              key={e.id}
              className={`bg-white rounded-xl border p-6 ${
                !e.read ? "border-[#8B5E3C]/30" : "border-[#E8DDD0]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {!e.read && (
                      <span className="w-2 h-2 bg-[#8B5E3C] rounded-full shrink-0" />
                    )}
                    <h3 className="font-bold text-[#2C2C2C]">{e.name}</h3>
                    {e.service && (
                      <span className="text-xs bg-[#FAF5EE] text-[#8B5E3C] border border-[#E8DDD0] px-2 py-0.5 rounded capitalize">
                        {e.service}
                      </span>
                    )}
                    <span className="text-xs text-[#8C8277] ml-auto">{formatDate(e.createdAt)}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-[#8C8277] mb-3">
                    <a href={`mailto:${e.email}`} className="hover:text-[#8B5E3C] transition-colors">
                      📧 {e.email}
                    </a>
                    {e.phone && (
                      <a href={`tel:${e.phone}`} className="hover:text-[#8B5E3C] transition-colors">
                        📞 {e.phone}
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-[#2C2C2C] leading-relaxed bg-[#FAF5EE] rounded-lg p-4">
                    {e.message}
                  </p>
                </div>
                <EnquiryActions enquiryId={e.id} read={e.read} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
