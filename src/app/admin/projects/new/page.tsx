import Link from "next/link";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/projects" className="text-[#8C8277] hover:text-[#2C2C2C] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-[#2C2C2C] font-[var(--font-heading)]">Add New Project</h1>
      </div>
      <ProjectForm />
    </div>
  );
}
