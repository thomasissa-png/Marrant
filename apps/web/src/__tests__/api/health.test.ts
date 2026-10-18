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
 *   - s21 : génération coupée (mode stock) → statut sur le DailyContent du
 *     jour, le stock jamais servi (≥ 14 j) et le dernier article ; fraîcheurs
 *     joke/tip/video/llmSuccess informatives. Les tests historiques tournent
 *     génération ACTIVÉE (comportement inchangé).
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
      count: jest.fn().mockResolvedValue(0),
    },
    tip: {
      findFirst: jest.fn().mockResolvedValue({ createdAt: new Date() }),
      count: jest.fn().mockResolvedValue(0),
    },
    video: {
      findFirst: jest.fn().mockResolvedValue({ createdAt: new Date() }),
      count: jest.fn().mockResolvedValue(0),
    },
    dailyContent: {
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
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
import { NEVER_USED_ACTIVE_WHERE, NEVER_USED_JOKE_WHERE } from "@/lib/scheduler/prepared-content";
const p = prisma as unknown as {
  $queryRaw: jest.Mock;
  joke: { findFirst: jest.Mock; count: jest.Mock };
  tip: { findFirst: jest.Mock; count: jest.Mock };
  video: { findFirst: jest.Mock; count: jest.Mock };
  dailyContent: { findMany: jest.Mock; count: jest.Mock };
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
  p.joke.count.mockReset().mockResolvedValue(30);
  p.tip.count.mockReset().mockResolvedValue(30);
  p.video.count.mockReset().mockResolvedValue(5);
  p.dailyContent.findMany.mockReset().mockResolvedValue([]);
  p.dailyContent.count.mockReset().mockResolvedValue(0);
  // Tests historiques : génération IA activée (comportement d'avant s21).
  process.env.CONTENT_GENERATION_ENABLED = "true";
  (console.warn as jest.Mock).mockClear();
  // s16 : éléments critiques configurés (formats attendus, valeurs factices de test)
  Object.assign(process.env, CRITICAL_ENV);
});

const CRITICAL_ENV = {
  STRIPE_SECRET_KEY: "sk_live_testvaleur0123456789",
  STRIPE_WEBHOOK_SECRET: "whsec_testvaleur0123456789",
  STRIPE_PREMIUM_PRICE_ID: "price_testvaleur0123456789",
  STRIPE_PREMIUM_ANNUAL_PRICE_ID: "price_testannuel0123456789",
  RESEND_API_KEY: "re_testvaleur0123456789",
};

async function callHealth(): Promise<{
  status: number;
  body: {
    status: string;
    contentStatus: string;
    critical: { status: string; failures: string[]; stripe: { mode: string | null } };
    checks: {
      database: { status: string; latencyMs: number | null; error?: string };
      content: (Record<string, { status: string; lastSeenAt?: string | null }> & {
        mode?: string;
        countedInStatus?: string[];
        dailyToday?: { date: string; foundDate: string | null; status: string };
        stock?: Record<string, number | string | null>;
      }) | null;
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

  it("une vidéo de 10 jours reste 'ok' (ajout mensuel, pas quotidien — relecture s11)", async () => {
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    p.video.findFirst.mockResolvedValueOnce({ createdAt: tenDaysAgo });

    const { body } = await callHealth();
    expect(body.checks.content?.video.status).toBe("ok");
    expect(body.status).toBe("ok");
  });

  it("une vidéo de 40 jours est 'stale'", async () => {
    const fortyDaysAgo = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000);
    p.video.findFirst.mockResolvedValueOnce({ createdAt: fortyDaysAgo });

    const { body } = await callHealth();
    expect(body.checks.content?.video.status).toBe("stale");
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

  describe("s16 : critique séparé du contenu", () => {
    afterEach(() => Object.assign(process.env, CRITICAL_ENV));

    it("contenu périmé seul : status 'degraded' en 200, critique 'ok'", async () => {
      p.joke.findFirst.mockResolvedValue({ createdAt: new Date(Date.now() - 10 * 86_400_000) });
      const { status, body } = await callHealth();
      expect(status).toBe(200);
      expect(body.status).toBe("degraded");
      expect(body.contentStatus).toBe("degraded");
      expect(body.critical.status).toBe("ok");
      expect(body.critical.stripe.mode).toBe("live");
    });

    it.each(["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "STRIPE_PREMIUM_PRICE_ID", "RESEND_API_KEY"])(
      "%s absent : panne critique, 503 'down', même si le contenu est périmé",
      async (name) => {
        delete process.env[name];
        p.joke.findFirst.mockResolvedValue({ createdAt: new Date(Date.now() - 10 * 86_400_000) });
        const { status, body } = await callHealth();
        expect(status).toBe(503);
        expect(body.status).toBe("down");
        expect(body.critical.failures).toEqual([name]);
        expect(body.contentStatus).toBe("degraded");
      },
    );

    it("valeur factice (placeholder) : considérée comme absente", async () => {
      process.env.RESEND_API_KEY = "re_xxxxxxxxxxxxxxxx";
      const { status, body } = await callHealth();
      expect(status).toBe(503);
      expect(body.critical.failures).toEqual(["RESEND_API_KEY"]);
    });

    it("annuel non configuré : non bloquant", async () => {
      delete process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID;
      const { status, body } = await callHealth();
      expect(status).toBe(200);
      expect(body.critical.status).toBe("ok");
    });

    it("aucune valeur de secret dans la réponse", async () => {
      const { body } = await callHealth();
      const json = JSON.stringify(body);
      for (const v of Object.values(CRITICAL_ENV)) expect(json).not.toContain(v);
    });
  });

  describe("s21 : génération coupée, contenu servi depuis le stock", () => {
    const utc = (iso: string) => new Date(`${iso}Z`);
    const day = (d: string) => ({ date: new Date(`${d}T00:00:00.000Z`) });

    // Relevé de production du 18/10 : tout marche, mais rien n'est « récent ».
    const setProdLike = () => {
      p.joke.findFirst.mockResolvedValue({ createdAt: utc("2026-10-14T05:00:00") });
      p.tip.findFirst.mockResolvedValue({ createdAt: utc("2026-10-11T05:00:00") });
      p.video.findFirst.mockResolvedValue({ createdAt: utc("2026-03-15T05:00:00") });
      p.llmUsageLog.findFirst.mockResolvedValue({ createdAt: utc("2026-10-01T05:00:00") });
      p.blogArticle.findFirst.mockResolvedValue({ publishedAt: utc("2026-10-15T05:00:00") });
    };

    beforeEach(() => {
      delete process.env.CONTENT_GENERATION_ENABLED;
      jest.useFakeTimers({
        now: utc("2026-10-18T10:00:00"),
        doNotFake: ["setTimeout", "clearTimeout", "setImmediate", "nextTick", "queueMicrotask"],
      });
      setProdLike();
    });
    afterEach(() => jest.useRealTimers());

    it("contenu du jour présent + stock suffisant : 'ok', vieilles dates et LLM seulement informatifs", async () => {
      p.dailyContent.findMany.mockResolvedValue([day("2026-10-17"), day("2026-10-18")]);
      const { status, body } = await callHealth();
      expect(status).toBe(200);
      expect(body.status).toBe("ok");
      expect(body.contentStatus).toBe("ok");
      expect(body.checks.content?.mode).toBe("stock");
      expect(body.checks.content?.countedInStatus).toEqual(["dailyToday", "stock", "blogArticle"]);
      expect(body.checks.content?.dailyToday).toEqual({ date: "2026-10-18", foundDate: "2026-10-18", status: "ok" });
      expect(body.checks.content?.stock?.status).toBe("ok");
      // Toujours affichés, toujours « stale », mais ne comptent plus.
      expect(body.checks.content?.llmSuccess.status).toBe("stale");
      expect(body.checks.content?.joke.status).toBe("stale");
      expect(body.checks.content?.video.status).toBe("stale");
    });

    it("contenu du jour absent après 7 h UTC : 'degraded'", async () => {
      p.dailyContent.findMany.mockResolvedValue([day("2026-10-17")]);
      const { status, body } = await callHealth();
      expect(status).toBe(200);
      expect(body.status).toBe("degraded");
      expect(body.checks.content?.dailyToday).toEqual({ date: "2026-10-18", foundDate: null, status: "stale" });
    });

    it("avant 7 h UTC : la veille suffit ; sans veille non plus, 'degraded'", async () => {
      jest.setSystemTime(utc("2026-10-18T06:30:00"));
      p.dailyContent.findMany.mockResolvedValue([day("2026-10-17")]);
      let { body } = await callHealth();
      expect(body.status).toBe("ok");
      expect(body.checks.content?.dailyToday?.foundDate).toBe("2026-10-17");

      p.dailyContent.findMany.mockResolvedValue([]);
      ({ body } = await callHealth());
      expect(body.status).toBe("degraded");
      expect(body.checks.content?.dailyToday?.status).toBe("stale");
    });

    it("compte le stock avec les filtres exacts du cron (pickJoke(true), pickActive(..., true))", async () => {
      p.dailyContent.findMany.mockResolvedValue([day("2026-10-18")]);
      await callHealth();
      expect(p.joke.count).toHaveBeenCalledWith({ where: NEVER_USED_JOKE_WHERE });
      expect(p.tip.count).toHaveBeenCalledWith({ where: NEVER_USED_ACTIVE_WHERE });
      expect(p.video.count).toHaveBeenCalledWith({ where: NEVER_USED_ACTIVE_WHERE });
      expect(p.dailyContent.count).toHaveBeenCalledWith({ where: { date: { gt: utc("2026-10-18T00:00:00") } } });
    });

    it.each([
      ["vannes", "joke"],
      ["conseils", "tip"],
    ] as const)("moins de 14 jours de %s jamais servis : 'degraded' (à 0 le site se répète)", async (_l, model) => {
      p.dailyContent.findMany.mockResolvedValue([day("2026-10-18")]);
      p[model].count.mockResolvedValue(13);
      const { status, body } = await callHealth();
      expect(status).toBe(200);
      expect(body.status).toBe("degraded");
      expect(body.checks.content?.stock?.status).toBe("stale");
      expect(body.checks.content?.stock?.note).toMatch(/recycle/);
    });

    it("jours déjà planifiés comptés dans la couverture ; vidéos à 0 sans effet", async () => {
      p.dailyContent.findMany.mockResolvedValue([day("2026-10-18")]);
      p.joke.count.mockResolvedValue(4);
      p.dailyContent.count.mockResolvedValue(10);
      p.video.count.mockResolvedValue(0);
      const { body } = await callHealth();
      expect(body.status).toBe("ok");
      expect(body.checks.content?.stock).toMatchObject({ jokesNeverUsed: 4, plannedDaysAhead: 10, jokeDaysLeft: 14, videosNeverUsed: 0 });
    });

    it("article : seuls les articles publiés ET échus comptent ; plus de 7 jours sans article = 'degraded'", async () => {
      p.dailyContent.findMany.mockResolvedValue([day("2026-10-18")]);
      p.blogArticle.findFirst.mockResolvedValue({ publishedAt: utc("2026-10-08T05:00:00") });
      const { body } = await callHealth();
      expect(p.blogArticle.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isPublished: true, publishedAt: { lte: utc("2026-10-18T10:00:00") } } }),
      );
      expect(body.status).toBe("degraded");
      expect(body.checks.content?.blogArticle.status).toBe("stale");
    });

    it("génération activée : comportement d'avant (dates de création et LLM comptent, pas de contrôle stock)", async () => {
      process.env.CONTENT_GENERATION_ENABLED = "true";
      const { body } = await callHealth();
      expect(body.status).toBe("degraded");
      expect(body.checks.content?.mode).toBe("generation");
      expect(body.checks.content?.llmSuccess.status).toBe("stale");
      expect(body.checks.content?.dailyToday).toBeUndefined();
      expect(body.checks.content?.stock).toBeUndefined();
      expect(p.dailyContent.findMany).not.toHaveBeenCalled();
      expect(p.joke.count).not.toHaveBeenCalled();
    });
  });
});
