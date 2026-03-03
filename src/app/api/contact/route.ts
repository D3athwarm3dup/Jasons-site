import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/contact - Save a contact form submission
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, service, message } = body;

    if (!name || !message) {
      return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        phone: phone || null,
        email: email || null,
        service: service || null,
        message,
        read: false,
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save enquiry" }, { status: 500 });
  }
}
