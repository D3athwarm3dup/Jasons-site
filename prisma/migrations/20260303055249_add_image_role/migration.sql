-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "role" TEXT NOT NULL DEFAULT 'gallery',
    CONSTRAINT "ProjectImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProjectImage" ("alt", "id", "isPrimary", "order", "projectId", "url") SELECT "alt", "id", "isPrimary", "order", "projectId", "url" FROM "ProjectImage";
DROP TABLE "ProjectImage";
ALTER TABLE "new_ProjectImage" RENAME TO "ProjectImage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
