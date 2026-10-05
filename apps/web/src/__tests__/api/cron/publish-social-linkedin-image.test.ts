/**
 * @jest-environment node
 *
 * Tests — publish-social, test alterné LinkedIn texte / image (s15, v5 §4 et §8) :
 *   - `[variante:image]` éligible : createBufferImagePost, 1 image (slide 0), texte = amorce seule, alt amorce + chute ;
 *   - carte non rendue ou post non éligible : texte seul (createBufferPost, texte complet), cause consignée
 *     dans directorNote, bras passé à `[variante:texte]`, post PUBLISHED (jamais FAILED) ;
 *   - `[variante:texte]` et LinkedIn sans marqueur : inchangés (texte seul).
 */

const mockFindMany = jest.fn();
const mockUpdate = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    socialPost: {
      findMany: (...a: unknown[]) => mockFindMany(...a),
      findUnique: jest.fn(),
      update: (...a: unknown[]) => mockUpdate(...a),
      updateMany: async () => ({ count: 0 }),
    },
    socialPlatformSetting: {
      findMany: async () => ["TWITTER", "INSTAGRAM", "LINKEDIN"].map((platform) => ({ platform, paused: false })),
      upsert: jest.fn(),
      updateMany: jest.fn(),
    },
  },
}));
jest.mock("@/lib/db-retry", () => ({ withDbRetry: (fn: () => unknown) => fn() }));

const mockRenderSlides = jest.fn();
jest.mock("@/lib/social/image-generator", () => ({
  renderSlides: (...a: unknown[]) => mockRenderSlides(...a),
  generateLaVanne: jest.fn(),
  generateTechniqueDuJour: jest.fn(),
  generateLeDefi: jest.fn(),
}));

const mockCreateImagePost = jest.fn();
const mockCreatePost = jest.fn();
jest.mock("@/lib/social/buffer-client", () => {
  class BufferQueueFullError extends Error {}
  class BufferContentTooLongError extends Error {}
  return {
    createBufferPost: (...a: unknown[]) => mockCreatePost(...a),
    createBufferImagePost: (...a: unknown[]) => mockCreateImagePost(...a),
    isBufferConfigured: () => true,
    isChannelConfigured: () => true,
    getBufferChannels: async () => [{ id: "ch-li", isDisconnected: false, isLocked: false }],
    getConfiguredChannelIds: () => ({ LINKEDIN: "ch-li" }),
    BufferQueueFullError,
    BufferContentTooLongError,
  };
});
jest.mock("@/lib/job-lock", () => ({ ...jest.requireActual("@/lib/job-lock"), tryAcquireLock: async () => true, isLockHeld: async () => false }));
jest.mock("@/lib/email", () => ({ sendAdminAlert: jest.fn(async () => true) }));
jest.mock("@/lib/blog-article-page", () => ({ findBlogArticle: jest.fn(async () => ({})) }));

import { GET } from "@/app/api/cron/publish-social/route";

const NB = " ";
const AMORCE = "Mon collègue revient de 4 jours à Rome et me raconte tout en détail.";
const CHUTE = "Ça fait 2h. On vient de récupérer les valises.";
const PNG = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47]), Buffer.alloc(4000)]);

const liPost = (note: string, extra: Record<string, unknown> = {}) => ({
  id: "cli1", platform: "LINKEDIN", format: "POTE_AU_TAF",
  content: `«${NB}${AMORCE}${NB}»\n«${NB}${CHUTE}${NB}»`,
  hook: AMORCE.slice(0, 80), targetPersona: "SOPHIE", hashtags: [], threadParts: [AMORCE, CHUTE],
  imageUrls: ["https://deviens-marrant.fr/api/social/image?postId=cli1&slide=0"],
  sourceType: "JOKE", cta: null, imageUrl: null, scheduledAt: new Date("2026-10-13T06:15:00Z"), directorNote: note, ...extra,
});

function publier(post: unknown) {
  mockFindMany.mockReset();
  mockFindMany.mockResolvedValueOnce([]).mockResolvedValueOnce([post]);
  return GET(new Request("https://example.com/api/cron/publish-social?secret=s"));
}

const noteFinale = () => mockUpdate.mock.calls.map((c) => c[0].data.directorNote).find((n) => typeof n === "string");
const statutFinal = () => mockUpdate.mock.calls.map((c) => c[0].data.status).filter(Boolean).pop();

beforeEach(() => {
  jest.clearAllMocks();
  process.env.CRON_SECRET = "s";
  mockUpdate.mockResolvedValue({});
  mockCreatePost.mockResolvedValue("buf-texte");
  mockCreateImagePost.mockResolvedValue("buf-image");
  mockRenderSlides.mockResolvedValue([PNG]);
  for (const k of ["error", "warn", "log"] as const) jest.spyOn(console, k).mockImplementation(() => undefined);
});

describe("publish-social : LinkedIn [variante:image]", () => {
  it("envoie l'amorce seule avec 1 carte (slide 0) et l'alt amorce + chute", async () => {
    await publier(liPost("[variante:image] Lot relance-s15 (VANNE, TIRAGE)"));
    expect(mockCreatePost).not.toHaveBeenCalled();
    expect(mockCreateImagePost).toHaveBeenCalledTimes(1);
    const [pf, texte, url, , hashtags, alt] = mockCreateImagePost.mock.calls[0];
    expect(pf).toBe("LINKEDIN");
    expect(texte).toBe(`«${NB}${AMORCE}${NB}»`);
    expect(texte).not.toContain("valises");
    expect(url).toBe("https://deviens-marrant.fr/api/social/image?postId=cli1&slide=0");
    expect(hashtags).toBeUndefined();
    expect(alt).toContain(AMORCE.slice(0, 20));
    expect(alt).toContain("valises");
    // Carte rendue dans le Worker : 1 slide 4:5.
    expect(mockRenderSlides.mock.calls[0][0]).toHaveLength(1);
    expect([mockRenderSlides.mock.calls[0][0][0].width, mockRenderSlides.mock.calls[0][0][0].height]).toEqual([1080, 1350]);
    expect(statutFinal()).toBe("PUBLISHED");
  });

  it("URL construite si imageUrls est vide", async () => {
    await publier(liPost("[variante:image]", { imageUrls: [] }));
    expect(mockCreateImagePost.mock.calls[0][2]).toMatch(/\/api\/social\/image\?postId=cli1&slide=0$/);
  });

  it("rendu en échec : texte seul complet, note consignée, bras texte, post PUBLISHED", async () => {
    mockRenderSlides.mockRejectedValue(new Error("satori: police absente"));
    await publier(liPost("[variante:image] Lot relance-s15 (VANNE, TIRAGE)"));
    expect(mockCreateImagePost).not.toHaveBeenCalled();
    expect(mockCreatePost).toHaveBeenCalledWith("LINKEDIN", liPost("").content, expect.any(Date), false, { firstComment: undefined });
    const note = noteFinale() as string;
    expect(note).toContain("[variante:texte]");
    expect(note).not.toContain("[variante:image]");
    expect(note).toMatch(/Repli texte seul.*satori: police absente/);
    expect(statutFinal()).toBe("PUBLISHED");
  });

  it("rendu vide ou non PNG : même repli", async () => {
    mockRenderSlides.mockResolvedValue([Buffer.from("<html>")]);
    await publier(liPost("[variante:image]"));
    expect(mockCreateImagePost).not.toHaveBeenCalled();
    expect(mockCreatePost).toHaveBeenCalledTimes(1);
    expect(noteFinale()).toMatch(/rendu invalide/);
  });

  it("amorce > 140 caractères : non éligible, texte seul et cause consignée", async () => {
    const longue = `${"Mon collègue ".repeat(12)}revient.`;
    await publier(liPost("[variante:image]", { content: `${longue}\n${CHUTE}`, threadParts: [longue, CHUTE] }));
    expect(mockRenderSlides).not.toHaveBeenCalled();
    expect(mockCreatePost).toHaveBeenCalledTimes(1);
    expect(noteFinale()).toMatch(/non éligible/);
  });

  it("[variante:texte] et LinkedIn sans marqueur : texte seul, aucune note modifiée", async () => {
    await publier(liPost("[variante:texte] Lot relance-s15"));
    await publier(liPost("Lot semaine0"));
    expect(mockCreateImagePost).not.toHaveBeenCalled();
    expect(mockRenderSlides).not.toHaveBeenCalled();
    expect(mockCreatePost).toHaveBeenCalledTimes(2);
    expect(noteFinale()).toBeUndefined();
  });
});
