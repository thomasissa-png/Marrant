/**
 * Tests — Admin LLM Usage API (/api/admin/llm-usage)
 *
 * Couvre :
 * - Intégrité source (auth Bearer, groupBy agent+fn, silent-fail P2021)
 * - Logique d'agrégation (tri par coût, totaux, shape)
 *
 * Note : les tests évitent d'importer directement la route pour contourner
 * le polyfill Request/NextRequest manquant en environnement Jest-JSDOM.
 * On teste la logique d'agrégation en reproduisant la boucle SUM/SORT du
 * handler, plus une vérification source pour garantir la présence des règles
 * critiques (auth, silent-fail, filtre 7 jours).
 */

import * as fs from "fs";
import * as path from "path";

const routeSource = fs.readFileSync(
  path.resolve(__dirname, "../../app/api/admin/llm-usage/route.ts"),
  "utf-8",
);

describe("Admin LLM Usage API — intégrité source", () => {
  it("vérifie l'auth Bearer via ADMIN_PASSWORD", () => {
    expect(routeSource).toContain("ADMIN_PASSWORD");
    expect(routeSource).toContain("Bearer");
    expect(routeSource).toContain("401");
  });

  it("renvoie 500 si ADMIN_PASSWORD non configuré", () => {
    expect(routeSource).toContain("ADMIN_PASSWORD non configuré");
  });

  it("groupe par agent+fn avec sums et avgs", () => {
    expect(routeSource).toContain('by: ["agent", "fn"]');
    expect(routeSource).toContain("_sum");
    expect(routeSource).toContain("_avg");
    expect(routeSource).toContain("costUsd");
    expect(routeSource).toContain("inputTokens");
    expect(routeSource).toContain("outputTokens");
  });

  it("filtre sur les 7 derniers jours", () => {
    expect(routeSource).toContain("7 * 24 * 60 * 60 * 1000");
    expect(routeSource).toContain("sevenDaysAgo");
    expect(routeSource).toContain("createdAt");
  });

  it("silent-fail sur P2021 (table absente)", () => {
    expect(routeSource).toContain("P2021");
    expect(routeSource).toContain("LlmUsageLog");
    expect(routeSource).toContain("warning");
  });

  it("compte séparément les failures (success: false)", () => {
    expect(routeSource).toContain("success: false");
    expect(routeSource).toContain("count");
  });

  it("trie byAgent par coût décroissant", () => {
    expect(routeSource).toContain(".sort(");
    expect(routeSource).toContain("totalCost");
  });

  it("expose un shape stable { total, byAgent, window }", () => {
    expect(routeSource).toContain('window: "7d"');
    expect(routeSource).toContain("byAgent");
    expect(routeSource).toContain("total");
  });
});

// ─── Tests logique d'agrégation (reproduction de la boucle du handler) ──

// Le handler transforme les rows Prisma groupBy en shape d'API consommable.
// On reproduit cette transformation inline pour la tester sans importer la route.
interface GroupByRow {
  agent: string;
  fn: string;
  _count: { _all: number };
  _sum: {
    costUsd: number | null;
    inputTokens: number | null;
    outputTokens: number | null;
    cacheReadTokens: number | null;
    cacheCreationTokens: number | null;
  };
  _avg: {
    inputTokens: number | null;
    outputTokens: number | null;
    durationMs: number | null;
  };
}

function transformGroupedResults(groupedRaw: GroupByRow[], failures: number) {
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
    failures,
  };

  return { byAgent, total };
}

describe("Admin LLM Usage API — logique d'agrégation", () => {
  it("agrège les rows par agent+fn et trie par coût décroissant", () => {
    const groupedRaw: GroupByRow[] = [
      {
        agent: "joke-agent",
        fn: "generateDailyJoke",
        _count: { _all: 7 },
        _sum: {
          costUsd: 0.15,
          inputTokens: 5000,
          outputTokens: 2000,
          cacheReadTokens: 1000,
          cacheCreationTokens: 500,
        },
        _avg: {
          inputTokens: 700,
          outputTokens: 280,
          durationMs: 1200,
        },
      },
      {
        agent: "seo-blog-agent",
        fn: "generateArticle",
        _count: { _all: 3 },
        _sum: {
          costUsd: 0.8,
          inputTokens: 8000,
          outputTokens: 12000,
          cacheReadTokens: 0,
          cacheCreationTokens: 0,
        },
        _avg: {
          inputTokens: 2666,
          outputTokens: 4000,
          durationMs: 15000,
        },
      },
    ];

    const { byAgent, total } = transformGroupedResults(groupedRaw, 1);

    expect(byAgent).toHaveLength(2);
    // seo-blog-agent en premier (coût plus élevé)
    expect(byAgent[0].agent).toBe("seo-blog-agent");
    expect(byAgent[0].totalCost).toBe(0.8);
    expect(byAgent[0].calls).toBe(3);
    expect(byAgent[1].agent).toBe("joke-agent");

    // Totaux
    expect(total.calls).toBe(10);
    expect(total.costUsd).toBeCloseTo(0.95, 4);
    expect(total.inputTokens).toBe(13000);
    expect(total.outputTokens).toBe(14000);
    expect(total.failures).toBe(1);
  });

  it("retourne total à zéro quand aucun appel", () => {
    const { byAgent, total } = transformGroupedResults([], 0);

    expect(byAgent).toEqual([]);
    expect(total.calls).toBe(0);
    expect(total.costUsd).toBe(0);
    expect(total.failures).toBe(0);
  });

  it("gère les champs _sum null (coûts non encore logués)", () => {
    const groupedRaw: GroupByRow[] = [
      {
        agent: "tip-agent",
        fn: "generateDailyTip",
        _count: { _all: 2 },
        _sum: {
          costUsd: null,
          inputTokens: null,
          outputTokens: null,
          cacheReadTokens: null,
          cacheCreationTokens: null,
        },
        _avg: {
          inputTokens: null,
          outputTokens: null,
          durationMs: null,
        },
      },
    ];

    const { byAgent, total } = transformGroupedResults(groupedRaw, 0);

    expect(byAgent[0].totalCost).toBe(0);
    expect(byAgent[0].totalInputTokens).toBe(0);
    expect(byAgent[0].avgInputTokens).toBe(0);
    expect(total.costUsd).toBe(0);
  });

  it("arrondit les coûts à 4 décimales (stabilité JSON)", () => {
    const groupedRaw: GroupByRow[] = [
      {
        agent: "marketing-agent",
        fn: "generateSocialPost",
        _count: { _all: 1 },
        _sum: {
          costUsd: 0.123456789,
          inputTokens: 100,
          outputTokens: 50,
          cacheReadTokens: 0,
          cacheCreationTokens: 0,
        },
        _avg: { inputTokens: 100, outputTokens: 50, durationMs: 500 },
      },
    ];

    const { byAgent } = transformGroupedResults(groupedRaw, 0);
    expect(byAgent[0].totalCost).toBe(0.1235);
  });
});
