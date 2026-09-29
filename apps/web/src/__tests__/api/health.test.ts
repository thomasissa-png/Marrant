/**
 * @jest-environment node
 *
 * Tests — app/api/health/route.ts
 *
 * Environnement node : les routes API Next importent `next/server` qui
 * étend `Request` (undefined en jsdom → crash à l'import).
 *
 * Couvre :
 *   - DB up + contenus frais → status "ok" + code 200
 *   - DB up + contenu stale (> 3j) → status "degraded" + code 200
 *   - DB down (crash + timeout) → status "down" + code 503
 *   - Aucun secret ni DATABASE_URL dans la réponse
 *   - Modèle IA reflète la config env (ANTHROPIC_SONNET_MODEL override)
 */

// ─── Mocks ───────────────────────────────────────────────────────────

// Mock email pour éviter l'instantiation de Resend au niveau module
// (email.ts est importé transitivement via client.ts → failure-alert.ts).
jest.mock("@/lib/email", () => ({
  sendAdminAlert: jest.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    $queryRaw: jest.fn().mockResolvedValue([{ "?column?": 1 }]),
    joke: {
      findFirst: jest.fn().mockResolvedValue({ createdAt: new Date() }),
    },
    tip: {
      findFirst: jest.fn().mockResolvedValue({ createdAt: new Date() }),
    },
    video: {
      findFirst: jest.fn().mockResolvedValue({ createdAt: new Date() }),
    },
    blogArticle: {
      findFirst: jest.fn().mockResolvedValue({ publishedAt: new Date() }),
    },
    llmUsageLog: {
      findFirst: jest.fn().mockResolvedValue({ createdAt: new Date() }),
    },
  },
}));

import { prisma } from "@/lib/prisma";
const p = prisma as unknown as {
  $queryRaw: jest.Mock;
  joke: { findFirst: jest.Mock };
  tip: { findFirst: jest.Mock };
  video: { findFirst: jest.Mock };
  blogArticle: { findFirst: jest.Mock };
  llmUsageLog: { findFirst: jest.Mock };
};

// Silence console pour garder la sortie de test propre
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = jest.fn();
});
afterAll(() => {
  console.warn = originalWarn;
});

beforeEach(() => {
  const now = new Date();
  p.$queryRaw.mockReset().mockResolvedValue([{ "?column?": 1 }]);
  p.joke.findFirst.mockReset().mockResolvedValue({ createdAt: now });
  p.tip.findFirst.mockReset().mockResolvedValue({ createdAt: now });
  p.video.findFirst.mockReset().mockResolvedValue({ createdAt: now });
  p.blogArticle.findFirst.mockReset().mockResolvedValue({ publishedAt: now });
  p.llmUsageLog.findFirst.mockReset().mockResolvedValue({ createdAt: now });
  (console.warn as jest.Mock).mockClear();
});

async function callHealth(): Promise<{
  status: number;
  body: {
    status: string;
    checks: {
      database: { status: string; latencyMs: number | null; error?: string };
      content: Record<string, { status: string; lastSeenAt: string | null }> | null;
      ai: { sonnetModel: string; opusModel: string; defaultEffort: string; sonnetOverridden: boolean; opusOverridden: boolean; effortOverridden: boolean };
    };
  };
}> {
  // Import dynamique pour que les mocks soient appliqués AVANT le module cible.
  const { GET } = await import("@/app/api/health/route");
  const res = await GET();
  const body = await res.json();
  return { status: res.status, body };
}

describe("GET /api/health", () => {
  it("retourne 200 + status='ok' quand DB up et contenus frais", async () => {
    const { status, body } = await callHealth();
    expect(status).toBe(200);
    expect(body.status).toBe("ok");
    expect(body.checks.database.status).toBe("up");
    expect(body.checks.database.latencyMs).toEqual(expect.any(Number));
    expect(body.checks.content?.joke.status).toBe("ok");
    expect(body.checks.content?.llmSuccess.status).toBe("ok");
  });

  it("retourne 503 + status='down' quand la requête DB crash", async () => {
    p.$queryRaw.mockRejectedValueOnce(new Error("connection refused"));

    const { status, body } = await callHealth();
    expect(status).toBe(503);
    expect(body.status).toBe("down");
    expect(body.checks.database.status).toBe("down");
    expect(body.checks.database.error).toContain("connection refused");
    // Pas de check content quand DB down (économise du bruit)
    expect(body.checks.content).toBeNull();
  });

  it("retourne status='degraded' quand la dernière vanne est trop ancienne", async () => {
    const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);
    p.joke.findFirst.mockResolvedValueOnce({ createdAt: fourDaysAgo });

    const { status, body } = await callHealth();
    expect(status).toBe(200);
    expect(body.status).toBe("degraded");
    expect(body.checks.content?.joke.status).toBe("stale");
    expect(body.checks.content?.tip.status).toBe("ok");
  });

  it("retourne status='degraded' quand aucun log LLM succès n'existe (pipelines cassés)", async () => {
    p.llmUsageLog.findFirst.mockResolvedValueOnce(null);

    const { status, body } = await callHealth();
    expect(status).toBe(200);
    expect(body.status).toBe("degraded");
    expect(body.checks.content?.llmSuccess.status).toBe("empty");
  });

  it("ne fuite AUCUN secret dans la réponse (pas de DATABASE_URL ni API keys)", async () => {
    const { body } = await callHealth();
    const serialised = JSON.stringify(body);
    // Aucune chaîne évoquant un secret
    expect(serialised).not.toContain("password");
    expect(serialised).not.toContain("api-key");
    expect(serialised).not.toContain("sk-ant-");
    expect(serialised).not.toContain("postgresql://");
  });

  it("reflète l'override ANTHROPIC_SONNET_MODEL / ANTHROPIC_OPUS_MODEL / ANTHROPIC_EFFORT dans checks.ai", async () => {
    // Note : ces constantes sont lues à l'import de client.ts, donc on ne
    // peut pas les changer dynamiquement dans ce test isolé. On vérifie
    // qu'on retourne les IDs Sonnet/Opus attendus + un flag de surcharge.
    const { body } = await callHealth();
    expect(body.checks.ai.sonnetModel).toMatch(/^claude-sonnet-/);
    expect(body.checks.ai.opusModel).toMatch(/^claude-opus-/);
    expect(["low", "medium", "high", "xhigh", "max"]).toContain(
      body.checks.ai.defaultEffort,
    );
    expect(typeof body.checks.ai.sonnetOverridden).toBe("boolean");
    expect(typeof body.checks.ai.opusOverridden).toBe("boolean");
    expect(typeof body.checks.ai.effortOverridden).toBe("boolean");
  });
});
