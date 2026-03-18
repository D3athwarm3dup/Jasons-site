import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

// PATCH /api/users/[id] — update name, email, role, and/or password
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;
  const { name, email, password, role } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }
  if (password && password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }
  // Only superadmin can change roles
  if (role && session?.user?.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const data: { name: string; email: string; passwordHash?: string; role?: string } = { name, email };
    if (password) data.passwordHash = await bcrypt.hash(password, 12);
    if (role && session?.user?.role === "superadmin") data.role = role;
    const user = await prisma.adminUser.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Email already in use or user not found" }, { status: 400 });
  }
}

// DELETE /api/users/[id] — delete an admin user (superadmin only, cannot delete superadmins)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  // Prevent deleting superadmin accounts
  const target = await prisma.adminUser.findUnique({ where: { id }, select: { role: true } });
  if (target?.role === "superadmin") {
    return NextResponse.json({ error: "Cannot delete a superadmin account" }, { status: 400 });
  }
  try {
    await prisma.adminUser.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}
