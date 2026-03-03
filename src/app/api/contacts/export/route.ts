import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const contacts = await prisma.contact.findMany({
    where: { optedIn: true },
    orderBy: { createdAt: "asc" },
  });

  const header = "Name,Email,Phone,Source,Notes,Date Added";
  const rows = contacts.map((c) => {
    const name = `"${c.name.replace(/"/g, '""')}"`;
    const email = c.email ? `"${c.email}"` : "";
    const phone = c.phone ? `"${c.phone}"` : "";
    const source = c.source;
    const notes = `"${c.notes.replace(/"/g, '""')}"`;
    const date = new Date(c.createdAt).toLocaleDateString("en-AU");
    return [name, email, phone, source, notes, date].join(",");
  });

  const csv = [header, ...rows].join("\n");
  const filename = `contacts-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
