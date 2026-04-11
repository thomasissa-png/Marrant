-- CreateTable
CREATE TABLE "LlmUsageLog" (
    "id" TEXT NOT NULL,
    "agent" TEXT NOT NULL,
    "fn" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "inputTokens" INTEGER NOT NULL,
    "outputTokens" INTEGER NOT NULL,
    "cacheReadTokens" INTEGER NOT NULL DEFAULT 0,
    "cacheCreationTokens" INTEGER NOT NULL DEFAULT 0,
    "costUsd" DOUBLE PRECISION NOT NULL,
    "durationMs" INTEGER,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LlmUsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LlmUsageLog_createdAt_idx" ON "LlmUsageLog"("createdAt");

-- CreateIndex
CREATE INDEX "LlmUsageLog_agent_fn_idx" ON "LlmUsageLog"("agent", "fn");

-- CreateIndex
CREATE INDEX "LlmUsageLog_createdAt_agent_idx" ON "LlmUsageLog"("createdAt", "agent");
