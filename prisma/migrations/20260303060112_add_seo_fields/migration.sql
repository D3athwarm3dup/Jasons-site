-- AlterTable
ALTER TABLE "Project" ADD COLUMN "metaDescription" TEXT;
ALTER TABLE "Project" ADD COLUMN "metaKeywords" TEXT;
ALTER TABLE "Project" ADD COLUMN "metaTitle" TEXT;

-- CreateTable
CREATE TABLE "SiteSettings" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
