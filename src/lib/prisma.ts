import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

// In production (Docker) DATABASE_URL=file:/app/data/prod.db, strip the "file:" prefix.
// In development it falls back to dev.db in the project root.
const dbUrl = process.env.DATABASE_URL
  ? process.env.DATABASE_URL.replace(/^file:/, "")
  : path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbUrl });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

