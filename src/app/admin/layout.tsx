import { auth } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Login page gets a bare layout (no nav)
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex">
      <AdminNav />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

