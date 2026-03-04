import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

function generateTempPassword() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
  let pw = "";
  for (let i = 0; i < 10; i++) {
    pw += chars[Math.floor(Math.random() * chars.length)];
  }
  return pw;
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await prisma.adminUser.findUnique({ where: { email } });
    // Always return 200 to avoid email enumeration
    if (!user) return NextResponse.json({ ok: true });

    const tempPw = generateTempPassword();
    const hash = await bcrypt.hash(tempPw, 12);
    await prisma.adminUser.update({
      where: { email },
      data: { passwordHash: hash },
    });

    return NextResponse.json({ ok: true, tempPassword: tempPw });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
