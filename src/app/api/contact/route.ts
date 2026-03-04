import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEnquiryNotification } from "@/lib/notify";

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

    // Send email notification to Jason — fire-and-forget, won't break the form if it fails
    sendEnquiryNotification({ name, email, phone, service, message }).catch((err) =>
      console.error("Enquiry notification failed:", err)
    );

    // Auto-upsert into marketing contacts (deduped by email if provided)
    if (email) {
      await prisma.contact.upsert({
        where: { email },
        update: {
          // Update phone if we now have one and didn't before
          ...(phone ? { phone } : {}),
          updatedAt: new Date(),
        },
        create: {
          name,
          email,
          phone: phone || null,
          source: "enquiry",
          optedIn: true,
        },
      });
    } else if (phone) {
      // No email — only add if phone not already in the list
      const existing = await prisma.contact.findFirst({ where: { phone } });
      if (!existing) {
        await prisma.contact.create({
          data: { name, phone, source: "enquiry", optedIn: true },
        });
      }
    }

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save enquiry" }, { status: 500 });
  }
}
