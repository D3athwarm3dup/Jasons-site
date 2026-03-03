import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/contacts - list all contacts
export async function GET() {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(contacts);
}

// POST /api/contacts - manually add a contact
export async function POST(req: NextRequest) {
  const { name, email, phone, notes, optedIn } = await req.json();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  try {
    const contact = await prisma.contact.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        notes: notes || "",
        source: "manual",
        optedIn: optedIn ?? true,
      },
    });
    return NextResponse.json(contact, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not create contact (email may already exist)" }, { status: 400 });
  }
}
