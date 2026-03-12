warn The configuration property `package.json#prisma` is deprecated and will be removed in Prisma 7. Please migrate to a Prisma config file (e.g., `prisma.config.ts`).
For more information, see: https://pris.ly/prisma-config

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PREMIUM');

-- CreateEnum
CREATE TYPE "UserLevel" AS ENUM ('NOVICE', 'APPRENTI', 'FARCEUR', 'COMIQUE', 'LEGENDE');

-- CreateEnum
CREATE TYPE "JokeCategory" AS ENUM ('AUTODERISION', 'SITUATION', 'ABSURDE', 'OBSERVATIONNEL', 'JEUX_DE_MOTS', 'CULTUREL', 'COUPLE', 'BOULOT', 'ECOLE', 'GAMING', 'RESEAUX_SOCIAUX', 'DATING', 'SOIREES', 'PARENTS');

-- CreateEnum
CREATE TYPE "JokeType" AS ENUM ('SUBTIL', 'CLASSIQUE', 'ABSURDE', 'ONE_LINER', 'STORY', 'DIALOGUE', 'QA');

-- CreateEnum
CREATE TYPE "TipCategory" AS ENUM ('TIMING', 'AUTODERISION', 'OBSERVATION', 'REPARTIE', 'STORYTELLING', 'ABSURDE', 'JEUX_DE_MOTS');

-- CreateEnum
CREATE TYPE "TipDifficulty" AS ENUM ('DEBUTANT', 'INTERMEDIAIRE', 'EXPERT');

-- CreateEnum
CREATE TYPE "ContentAgentType" AS ENUM ('JOKE', 'TIP', 'VIDEO');

-- CreateEnum
CREATE TYPE "PlanEntryStatus" AS ENUM ('PLANNED', 'PUBLISHED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('JOKE', 'TIP', 'VIDEO');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PAST_DUE', 'CANCELED', 'TRIALING');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "passwordHash" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "level" "UserLevel" NOT NULL DEFAULT 'NOVICE',
    "xp" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "lastActiveAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Joke" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "punchline" TEXT NOT NULL,
    "category" "JokeCategory" NOT NULL,
    "maturityLevel" INTEGER NOT NULL DEFAULT 1,
    "type" "JokeType" NOT NULL DEFAULT 'CLASSIQUE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "generatedByAI" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Joke_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JokeLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jokeId" TEXT NOT NULL,
    "isLike" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JokeLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tip" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "TipCategory" NOT NULL,
    "difficulty" "TipDifficulty" NOT NULL,
    "example" TEXT NOT NULL,
    "exercise" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "generatedByAI" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPath" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "difficulty" "TipDifficulty" NOT NULL,
    "icon" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPathStep" (
    "id" TEXT NOT NULL,
    "learningPathId" TEXT NOT NULL,
    "tipId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "dayNumber" INTEGER NOT NULL,

    CONSTRAINT "LearningPathStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPathProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "learningPathId" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "completedSteps" INTEGER[],
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "UserPathProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "youtubeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "category" "TipCategory" NOT NULL,
    "difficulty" "TipDifficulty" NOT NULL,
    "description" TEXT NOT NULL,
    "technique" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "generatedByAI" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyContent" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "jokeId" TEXT NOT NULL,
    "tipId" TEXT NOT NULL,
    "videoId" TEXT,

    CONSTRAINT "DailyContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentPlan" (
    "id" TEXT NOT NULL,
    "agentType" "ContentAgentType" NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentPlanEntry" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "dayOfMonth" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "targetPersona" TEXT NOT NULL,
    "status" "PlanEntryStatus" NOT NULL DEFAULT 'PLANNED',
    "contentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentPlanEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentType" "ContentType" NOT NULL,
    "jokeId" TEXT,
    "tipId" TEXT,
    "videoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'INACTIVE',
    "currentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Joke_category_idx" ON "Joke"("category");

-- CreateIndex
CREATE INDEX "Joke_isActive_idx" ON "Joke"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "JokeLike_userId_jokeId_key" ON "JokeLike"("userId", "jokeId");

-- CreateIndex
CREATE INDEX "Tip_category_idx" ON "Tip"("category");

-- CreateIndex
CREATE INDEX "Tip_difficulty_idx" ON "Tip"("difficulty");

-- CreateIndex
CREATE INDEX "Tip_isActive_idx" ON "Tip"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "LearningPath_slug_key" ON "LearningPath"("slug");

-- CreateIndex
CREATE INDEX "LearningPath_isActive_idx" ON "LearningPath"("isActive");

-- CreateIndex
CREATE INDEX "LearningPathStep_learningPathId_idx" ON "LearningPathStep"("learningPathId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningPathStep_learningPathId_order_key" ON "LearningPathStep"("learningPathId", "order");

-- CreateIndex
CREATE INDEX "UserPathProgress_userId_idx" ON "UserPathProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPathProgress_userId_learningPathId_key" ON "UserPathProgress"("userId", "learningPathId");

-- CreateIndex
CREATE UNIQUE INDEX "Video_youtubeId_key" ON "Video"("youtubeId");

-- CreateIndex
CREATE INDEX "Video_category_idx" ON "Video"("category");

-- CreateIndex
CREATE INDEX "Video_difficulty_idx" ON "Video"("difficulty");

-- CreateIndex
CREATE INDEX "Video_isActive_idx" ON "Video"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "DailyContent_date_key" ON "DailyContent"("date");

-- CreateIndex
CREATE INDEX "DailyContent_date_idx" ON "DailyContent"("date");

-- CreateIndex
CREATE UNIQUE INDEX "ContentPlan_agentType_month_year_key" ON "ContentPlan"("agentType", "month", "year");

-- CreateIndex
CREATE INDEX "ContentPlanEntry_planId_idx" ON "ContentPlanEntry"("planId");

-- CreateIndex
CREATE INDEX "ContentPlanEntry_status_idx" ON "ContentPlanEntry"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ContentPlanEntry_planId_dayOfMonth_key" ON "ContentPlanEntry"("planId", "dayOfMonth");

-- CreateIndex
CREATE INDEX "UserFavorite_userId_idx" ON "UserFavorite"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavorite_userId_contentType_jokeId_key" ON "UserFavorite"("userId", "contentType", "jokeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavorite_userId_contentType_tipId_key" ON "UserFavorite"("userId", "contentType", "tipId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavorite_userId_contentType_videoId_key" ON "UserFavorite"("userId", "contentType", "videoId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeCustomerId_key" ON "Subscription"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JokeLike" ADD CONSTRAINT "JokeLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JokeLike" ADD CONSTRAINT "JokeLike_jokeId_fkey" FOREIGN KEY ("jokeId") REFERENCES "Joke"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPathStep" ADD CONSTRAINT "LearningPathStep_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPathStep" ADD CONSTRAINT "LearningPathStep_tipId_fkey" FOREIGN KEY ("tipId") REFERENCES "Tip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPathProgress" ADD CONSTRAINT "UserPathProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPathProgress" ADD CONSTRAINT "UserPathProgress_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyContent" ADD CONSTRAINT "DailyContent_jokeId_fkey" FOREIGN KEY ("jokeId") REFERENCES "Joke"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyContent" ADD CONSTRAINT "DailyContent_tipId_fkey" FOREIGN KEY ("tipId") REFERENCES "Tip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyContent" ADD CONSTRAINT "DailyContent_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPlanEntry" ADD CONSTRAINT "ContentPlanEntry_planId_fkey" FOREIGN KEY ("planId") REFERENCES "ContentPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavorite" ADD CONSTRAINT "UserFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavorite" ADD CONSTRAINT "UserFavorite_jokeId_fkey" FOREIGN KEY ("jokeId") REFERENCES "Joke"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavorite" ADD CONSTRAINT "UserFavorite_tipId_fkey" FOREIGN KEY ("tipId") REFERENCES "Tip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavorite" ADD CONSTRAINT "UserFavorite_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

