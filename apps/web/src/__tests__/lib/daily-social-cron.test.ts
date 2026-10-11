/**
 * @jest-environment node
 *
 * Tests — Arrêt définitif de la génération IA des posts sociaux (s14, 01/10/2026).
 *
 * L'ancien fichier testait le pipeline de génération (quotas, dédup, directeur) :
 * ce pipeline est supprimé de la route. On vérifie désormais que :
 *   - la route /api/cron/daily-social répond sans rien générer ni écrire ;
 *   - le job du scheduler n'appelle plus la route.
 */

const mockPrismaAny = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: new Proxy({}, { get: () => new Proxy({}, { get: () => mockPrismaAny }) }),
}));

const mockGenerate = jest.fn();
jest.mock("@/lib/ai/agents/social-media-agent", () => ({
  generateDailySocialPosts: (...a: unknown[]) => mockGenerate(...a),
}));

import { GET } from "@/app/api/cron/daily-social/route";
import { createSchedulerJobs } from "@/lib/scheduler/jobs";

beforeEach(() => {
  jest.clearAllMocks();
  process.env.CRON_SECRET = "s";
});

describe("daily-social : génération arrêtée", () => {
  it("refuse sans secret", async () => {
    const res = await GET(new Request("https://example.com/api/cron/daily-social"));
    expect(res.status).toBe(401);
  });

  it("répond disabled sans appel LLM ni écriture en base", async () => {
    const res = await GET(new Request("https://example.com/api/cron/daily-social?secret=s&force=true"));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { disabled: boolean; generated: number };
    expect(body).toMatchObject({ disabled: true, generated: 0 });
    expect(mockGenerate).not.toHaveBeenCalled();
    expect(mockPrismaAny).not.toHaveBeenCalled();
  });

  it("le job du scheduler n'appelle plus la route daily-social", async () => {
    const caller = jest.fn().mockResolvedValue({ ok: true, status: 200, text: async () => "{}" });
    const { runDailySocialJob } = createSchedulerJobs(caller);
    await runDailySocialJob();
    expect(caller).not.toHaveBeenCalled();
    expect(mockGenerate).not.toHaveBeenCalled();
  });
});
