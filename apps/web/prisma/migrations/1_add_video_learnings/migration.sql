-- AlterTable
ALTER TABLE "Video" ADD COLUMN "learnings" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Video" ADD COLUMN "exercise" TEXT;
