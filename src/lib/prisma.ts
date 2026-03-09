import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

// In production (Docker) DATABASE_URL=file:/app/data/prod.db
// In development it falls back to dev.db in the project root.
const dbUrl = process.env.DATABASE_URL ?? ("file:" + path.join(process.cwd(), "dev.db"));
const adapterFactory = new PrismaLibSql({ url: dbUrl });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: adapterFactory,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
