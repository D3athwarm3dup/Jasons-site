import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// POST /api/seed - Create the initial admin user from environment variables
// Only works if no admin users exist yet (safe to call multiple times)
export async function POST(req: NextRequest) {
  // Require a simple guard token to prevent accidental/malicious seeding
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (key !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const existing = await prisma.adminUser.count();
    if (existing > 0) {
      return NextResponse.json({ message: "Admin user already exists" });
    }

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME must be set in .env" },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = await prisma.adminUser.create({
      data: { email, passwordHash: hashedPassword, name },
    });

    return NextResponse.json({ message: "Admin user created", email: admin.email }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
