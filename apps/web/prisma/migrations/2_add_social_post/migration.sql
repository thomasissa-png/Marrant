-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('TWITTER', 'THREADS', 'LINKEDIN', 'INSTAGRAM');

-- CreateEnum
CREATE TYPE "SocialFormat" AS ENUM ('TWEET', 'THREAD', 'CAROUSEL', 'POST', 'QUOTE_ANALYSIS', 'TECHNIQUE_DU_JOUR');

-- CreateEnum
CREATE TYPE "SocialPostStatus" AS ENUM ('PENDING', 'APPROVED', 'PUBLISHED', 'REJECTED', 'FAILED');

-- CreateTable
CREATE TABLE "SocialPost" (
    "id" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "format" "SocialFormat" NOT NULL,
    "content" TEXT NOT NULL,
    "hook" TEXT NOT NULL,
    "cta" TEXT,
    "hashtags" TEXT[],
    "targetPersona" TEXT NOT NULL,
    "sourceType" TEXT,
    "sourceId" TEXT,
    "threadParts" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "SocialPostStatus" NOT NULL DEFAULT 'PENDING',
    "directorScore" INTEGER,
    "directorNote" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "externalId" TEXT,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "retweets" INTEGER NOT NULL DEFAULT 0,
    "replies" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SocialPost_status_idx" ON "SocialPost"("status");

-- CreateIndex
CREATE INDEX "SocialPost_platform_idx" ON "SocialPost"("platform");

-- CreateIndex
CREATE INDEX "SocialPost_scheduledAt_idx" ON "SocialPost"("scheduledAt");

-- CreateIndex
CREATE INDEX "SocialPost_publishedAt_idx" ON "SocialPost"("publishedAt");
