/**
 * @jest-environment node
 *
 * Lot Q3 (s14) : gates de publication dans generateDailySocialPosts.
 * Client LLM, Director et Prisma mockés (aucun appel LLM).
 */
const mockExtractJson = jest.fn();
const mockValidateSocialPost = jest.fn();

jest.mock("@/lib/ai/client", () => ({
  SONNET_MODEL: "sonnet-mock",
  callWithRetry: jest.fn().mockResolvedValue({ content: [] }),
  getResponseText: jest.fn().mockReturnValue("{}"),
  extractJson: (...a: unknown[]) => mockExtractJson(...a),
  buildCachedSystemBlock: (text: string) => ({ type: "text", text }),
}));
jest.mock("@/lib/ai/agents/marketing-agent", () => ({
  TONALITY_BRIEF: { voice: "complice", principles: ["Complice"], doNot: ["Pas de vouvoiement"] },
}));
jest.mock("@/lib/ai/agents/standup-director-agent", () => ({
  validateSocialPost: (...a: unknown[]) => mockValidateSocialPost(...a),
  directorRewriteSocialPost: jest.fn(),
}));
jest.mock("@/lib/prisma", () => ({
  prisma: { socialPost: { findMany: jest.fn().mockResolvedValue([]) } },
}));

import { generateDailySocialPosts } from "@/lib/ai/agents/social-media-agent";

const CLEAN = {
  platform: "TWITTER",
  format: "MINI_STANDUP",
  hook: "Le frigo partagé",
  content: "Quand ta coloc étiquette le yaourt nature « yaourt nature ». Au cas où tu doutes encore.",
  cta: "",
  hashtags: [],
  targetPersona: "YANIS",
};
const VOUS = { ...CLEAN, content: "Vous avez déjà vu une coloc étiqueter le yaourt nature ?" };

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
  mockValidateSocialPost.mockResolvedValue({ verdict: "APPROVED", score: 9, strengths: [], issues: [], directorNote: "" });
});

describe("generateDailySocialPosts — gates Q3", () => {
  it("post rejeté deux fois → écarté (pas de publication), une seule régénération", async () => {
    mockExtractJson.mockImplementation(() => ({ ...CLEAN }));
    const baseline = await generateDailySocialPosts(1);
    const n = baseline.length;
    expect(n).toBeGreaterThan(0);
    const callsPerCleanRun = mockExtractJson.mock.calls.length;

    mockExtractJson.mockReset();
    mockExtractJson
      .mockImplementationOnce(() => ({ ...VOUS }))
      .mockImplementationOnce(() => ({ ...VOUS }))
      .mockImplementation(() => ({ ...CLEAN }));
    const posts = await generateDailySocialPosts(1);
    expect(posts.length).toBe(n - 1);
    expect(mockExtractJson.mock.calls.length).toBe(callsPerCleanRun + 1);
    expect(posts.some((p) => /vous avez/i.test(p.content))).toBe(false);
  });

  it("tirets cadratins corrigés sans régénération", async () => {
    mockExtractJson.mockImplementation(() => ({ ...CLEAN, content: "Le yaourt nature — étiqueté — au cas où." }));
    const posts = await generateDailySocialPosts(1);
    expect(posts.length).toBeGreaterThan(0);
    for (const p of posts) expect(p.content).not.toContain("—");
  });
});
