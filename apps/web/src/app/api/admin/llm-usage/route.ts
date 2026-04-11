/**
 * Agrégation des coûts API Anthropic sur 7 jours.
 *
 * Endpoint admin permettant de lire le tableau `LlmUsageLog` et de produire
 * une vue synthétique pour piloter les optimisations coûts : par agent+fn,
 * nombre d'appels, coût total, moyennes de tokens in/out.
 *
 * Règles :
 * - Auth via `Authorization: Bearer {ADMIN_PASSWORD}` — mêmes règles que
 *   `/api/admin/stats`.
 * - Fenêtre fixe : 7 derniers jours (rolling). Pas de query param pour
 *   éviter les abus / lectures massives.
 * - Aucune UI pour l'instant — cet endpoint est consommé via curl pour
 *   piloter les décisions d'optim (cache, migration Haiku, etc.).
 * - Retourne `{ total, byAgent: [...] }` pour une consommation simple.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: "ADMIN_PASSWORD non configuré" }, { status: 500 });
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Agrégation SQL-side : un seul GROUP BY pour minimiser la charge.
    // On groupe par (agent, fn) — c'est le niveau d'action qui nous intéresse.
    const groupedRaw = await prisma.llmUsageLog.groupBy({
      by: ["agent", "fn"],
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
      _count: { _all: true },
      _sum: {
        costUsd: true,
        inputTokens: true,
        outputTokens: true,
        cacheReadTokens: true,
        cacheCreationTokens: true,
      },
      _avg: {
        inputTokens: true,
        outputTokens: true,
        durationMs: true,
      },
    });

    const byAgent = groupedRaw
      .map((g) => ({
        agent: g.agent,
        fn: g.fn,
        calls: g._count._all,
        totalCost: Number(((g._sum.costUsd ?? 0) as number).toFixed(4)),
        totalInputTokens: g._sum.inputTokens ?? 0,
        totalOutputTokens: g._sum.outputTokens ?? 0,
        totalCacheReadTokens: g._sum.cacheReadTokens ?? 0,
        totalCacheCreationTokens: g._sum.cacheCreationTokens ?? 0,
        avgInputTokens: Math.round(g._avg.inputTokens ?? 0),
        avgOutputTokens: Math.round(g._avg.outputTokens ?? 0),
        avgDurationMs: Math.round(g._avg.durationMs ?? 0),
      }))
      .sort((a, b) => b.totalCost - a.totalCost);

    const total = {
      calls: byAgent.reduce((sum, row) => sum + row.calls, 0),
      costUsd: Number(byAgent.reduce((sum, row) => sum + row.totalCost, 0).toFixed(4)),
      inputTokens: byAgent.reduce((sum, row) => sum + row.totalInputTokens, 0),
      outputTokens: byAgent.reduce((sum, row) => sum + row.totalOutputTokens, 0),
      cacheReadTokens: byAgent.reduce((sum, row) => sum + row.totalCacheReadTokens, 0),
      cacheCreationTokens: byAgent.reduce((sum, row) => sum + row.totalCacheCreationTokens, 0),
    };

    // Success/failure breakdown : utile pour tracker les retries coûteux.
    // Un `findMany` avec where `success: false` suffit (volume faible).
    const failures = await prisma.llmUsageLog.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
        success: false,
      },
    });

    return NextResponse.json({
      window: "7d",
      since: sevenDaysAgo.toISOString(),
      total: {
        ...total,
        failures,
      },
      byAgent,
    });
  } catch (err) {
    // Si la table n'existe pas encore (migration pas appliquée), on renvoie
    // un payload vide plutôt qu'une 500 — l'outil doit rester utilisable
    // même avant la première migration.
    const code = (err as { code?: string })?.code;
    if (code === "P2021") {
      return NextResponse.json({
        window: "7d",
        since: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        total: { calls: 0, costUsd: 0, inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheCreationTokens: 0, failures: 0 },
        byAgent: [],
        warning: "Table LlmUsageLog non trouvée — appliquer la migration `4_add_llm_usage_log`",
      });
    }

    console.error("[admin/llm-usage] Erreur :", err);
    return NextResponse.json(
      { error: "Erreur lors de l'agrégation des coûts LLM" },
      { status: 500 }
    );
  }
}
