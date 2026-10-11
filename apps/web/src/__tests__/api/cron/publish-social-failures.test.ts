/**
 * @jest-environment node
 *
 * Tests — Cron publish-social.
 *   s14 : message d'erreur exact de Buffer sur le post FAILED ; circuit breaker 429 en `startsWith`.
 *   s15 cycle 3 (K7) :
 *     D1  verrou d'alerte posé APRÈS l'envoi réussi (Resend en échec = alerte retentée) ;
 *     interrupteur Pause / Reprise en base (ligne absente ou base illisible = pause) ;
 *     pause automatique d'un canal déconnecté chez Buffer + alerte ;
 *     fils X interdits ; carrousel Instagram (1 URL par slide + texte alternatif) ;
 *     LinkedIn : lien en premier commentaire.
 *   s15 plan v2 (§6, §7, R3) : garde `articleSlug` (relais envoyé seulement si
 *     l'article est visible, sinon REJECTED et son repli en réserve part sur le même
 *     créneau ; sans repli, créneau vide) ; alerte par réseau et par type (C8).
 */

const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();
const mockUpdate = jest.fn();
const mockUpdateMany = jest.fn();
let settings: Array<Record<string, unknown>> = [];
let settingsBroken = false;
const mockUpsert = jest.fn(async (args: { where: { platform: string }; create: Record<string, unknown>; update: Record<string, unknown> }) => {
  const row = settings.find((r) => r.platform === args.where.platform);
  if (row) Object.assign(row, args.update);
  else settings.push({ ...args.create });
  return settings.find((r) => r.platform === args.where.platform);
});
const mockSettingsUpdateMany = jest.fn(async (args: { where: { platform: string }; data: Record<string, unknown> }) => {
  const row = settings.find((r) => r.platform === args.where.platform);
  if (row) Object.assign(row, args.data);
  return { count: row ? 1 : 0 };
});

jest.mock("@/lib/prisma", () => ({
  prisma: {
    socialPost: {
      findMany: (...a: unknown[]) => mockFindMany(...a),
      findUnique: (...a: unknown[]) => mockFindUnique(...a),
      update: (...a: unknown[]) => mockUpdate(...a),
      updateMany: (...a: unknown[]) => mockUpdateMany(...a),
    },
    socialPlatformSetting: {
      findMany: async () => {
        if (settingsBroken) throw new Error("db down");
        return settings.map((r) => ({ ...r }));
      },
      upsert: (a: never) => mockUpsert(a),
      updateMany: (a: never) => mockSettingsUpdateMany(a),
    },
  },
}));

jest.mock("@/lib/db-retry", () => ({ withDbRetry: (fn: () => unknown) => fn() }));
jest.mock("@/lib/social/image-generator", () => ({
  renderSlides: jest.fn(),
  generateLaVanne: jest.fn(),
  generateTechniqueDuJour: jest.fn(),
  generateLeDefi: jest.fn(),
}));

const mockCreateImagePost = jest.fn();
const mockCreatePost = jest.fn();
let channels: Array<Record<string, unknown>> = [];
jest.mock("@/lib/social/buffer-client", () => {
  class BufferQueueFullError extends Error {}
  class BufferContentTooLongError extends Error {}
  return {
    createBufferPost: (...a: unknown[]) => mockCreatePost(...a),
    createBufferImagePost: (...a: unknown[]) => mockCreateImagePost(...a),
    isBufferConfigured: () => true,
    isChannelConfigured: () => true,
    getBufferChannels: async () => channels,
    getConfiguredChannelIds: () => ({ TWITTER: "ch-x", INSTAGRAM: "ch-ig", LINKEDIN: "ch-li" }),
    BufferQueueFullError,
    BufferContentTooLongError,
  };
});

const locks = new Set<string>();
const mockTryAcquireLock = jest.fn(async (key: string) => {
  if (locks.has(key)) return false;
  locks.add(key);
  return true;
});
jest.mock("@/lib/job-lock", () => ({
  ...jest.requireActual("@/lib/job-lock"),
  tryAcquireLock: (key: string) => mockTryAcquireLock(key),
  isLockHeld: async (key: string) => locks.has(key),
}));

// s15 (06/10) : plus d'e-mail direct, les alertes sont enregistrées (lib/admin-alerts).
// Le mock reçoit (sujet, html, clé).
const mockSendAdminAlert = jest.fn();
jest.mock("@/lib/admin-alerts", () => ({
  recordAdminAlert: (i: { cle: string; sujet: string; html: string }) => mockSendAdminAlert(i.sujet, i.html, i.cle),
}));
const cles = () => mockSendAdminAlert.mock.calls.map((c) => c[2]);

const mockFindBlogArticle = jest.fn();
jest.mock("@/lib/blog-article-page", () => ({ findBlogArticle: (...a: unknown[]) => mockFindBlogArticle(...a) }));

import { GET } from "@/app/api/cron/publish-social/route";
import { buildPublishErrorNote } from "@/lib/social/publish-failure";

const BUFFER_400 =
  'Buffer API error 400: Field "images" is not defined by type "AssetInput". Did you mean "image"?';

const igPost = {
  id: "p1",
  platform: "INSTAGRAM",
  format: "IMAGE_QUI_CLAQUE",
  content: "Amorce\nChute",
  hashtags: [],
  threadParts: [],
  imageUrls: [],
  sourceType: "JOKE",
  cta: null,
  imageUrl: "https://deviens-marrant.fr/api/social/stored-image?key=x.png",
  scheduledAt: new Date("2026-10-02T17:00:00Z"),
  directorNote: null,
};

const actifs = (...pfs: string[]) =>
  ["TWITTER", "INSTAGRAM", "LINKEDIN"].map((platform) => ({
    platform, paused: !pfs.includes(platform), reason: null, changedBy: "admin", pausedAt: null, alertSentAt: null,
  }));

function req() {
  return new Request("https://example.com/api/cron/publish-social?secret=s", { method: "GET" });
}

/** 1er findMany = circuit breaker 429, 2e = posts à publier. */
function postsAPublier(...posts: unknown[]) {
  mockFindMany.mockReset();
  mockFindMany.mockResolvedValueOnce([]).mockResolvedValueOnce(posts);
}

beforeEach(() => {
  jest.clearAllMocks();
  locks.clear();
  settings = actifs("TWITTER", "INSTAGRAM", "LINKEDIN");
  settingsBroken = false;
  channels = [
    { id: "ch-x", isDisconnected: false, isLocked: false },
    { id: "ch-ig", isDisconnected: false, isLocked: false },
    { id: "ch-li", isDisconnected: false, isLocked: false },
  ];
  process.env.CRON_SECRET = "s";
  mockUpdateMany.mockResolvedValue({ count: 0 });
  mockUpdate.mockResolvedValue({});
  postsAPublier(igPost);
  mockCreateImagePost.mockRejectedValue(new Error(BUFFER_400));
  mockFindBlogArticle.mockResolvedValue({ article: { slug: "x" }, isVisible: true });
  mockCreatePost.mockResolvedValue("buf-1");
  mockSendAdminAlert.mockResolvedValue(true);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
  jest.spyOn(console, "log").mockImplementation(() => undefined);
});

describe("publish-social : traçabilité des échecs (s14)", () => {
  it("enregistre le message exact de Buffer sur le post FAILED", async () => {
    await GET(req());
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "p1" },
      data: { status: "FAILED", directorNote: buildPublishErrorNote(BUFFER_400) },
    });
  });

  it("lit le circuit breaker en startsWith", async () => {
    await GET(req());
    expect(mockFindMany.mock.calls[0][0].where.directorNote).toEqual({ startsWith: "429" });
  });
});

describe("alertes d'échec enregistrées, plus d'e-mail (s15 06/10)", () => {
  it("enregistre 1 alerte sous la clé du réseau, sans verrou e-mail", async () => {
    await GET(req());
    expect(mockSendAdminAlert).toHaveBeenCalledTimes(1);
    // s15 plan v2 §8 (QA C8) : clé d'alerte par réseau.
    expect(cles()).toEqual(["social-echec-instagram"]);
    expect(mockTryAcquireLock).not.toHaveBeenCalledWith(expect.stringMatching(/^social-echec-/));
  });

  it("échecs sur 2 réseaux le même jour : 2 alertes séparées (QA C8)", async () => {
    mockSendAdminAlert.mockResolvedValue(true);
    mockCreatePost.mockRejectedValue(new Error("Buffer API error 400: invalid text"));
    postsAPublier(igPost, { ...igPost, id: "x9", platform: "TWITTER", format: "TWEET", content: "Court." });
    await GET(req());
    expect(mockSendAdminAlert).toHaveBeenCalledTimes(2);
    expect(mockSendAdminAlert.mock.calls.map((c) => c[0])).toEqual(["Publication INSTAGRAM : échec Buffer", "Publication TWITTER : échec Buffer"]);
  });

  it("2e passage le même jour : même clé (un seul enregistrement du jour en base, compté)", async () => {
    await GET(req());
    postsAPublier(igPost);
    await GET(req());
    expect(cles()).toEqual(["social-echec-instagram", "social-echec-instagram"]);
  });

  it("base illisible (alerte non enregistrée) : le passage continue", async () => {
    mockSendAdminAlert.mockResolvedValueOnce(false);
    const res = await GET(req());
    expect(res.status).toBe(200);
  });
});

describe("R4 (s15 cycle 6) : 429 Buffer = réseau bloqué 24 h, avec alerte", () => {
  const BUFFER_429 = "Buffer API error 429: Too Many Requests";

  it("envoie 1 alerte du réseau (clé social-429-<réseau>), en plus du FAILED", async () => {
    mockCreateImagePost.mockRejectedValue(new Error(BUFFER_429));
    await GET(req());
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "p1" },
      data: { status: "FAILED", directorNote: "429 rate limit INSTAGRAM — circuit breaker 24h activé" },
    });
    expect(mockSendAdminAlert).toHaveBeenCalledTimes(1);
    expect(mockSendAdminAlert.mock.calls[0][0]).toContain("INSTAGRAM");
    expect(mockSendAdminAlert.mock.calls[0][0]).toContain("429");
    expect(cles()).toEqual(["social-429-instagram"]);
  });

  it("une clé par réseau : un autre réseau a la sienne", async () => {
    mockCreateImagePost.mockRejectedValue(new Error(BUFFER_429));
    await GET(req());
    mockCreatePost.mockRejectedValue(new Error(BUFFER_429));
    postsAPublier({ ...igPost, id: "x1", platform: "TWITTER", format: "TWEET", content: "Court." });
    await GET(req());
    expect(cles()).toEqual(["social-429-instagram", "social-429-twitter"]);
  });

  it("alerte en échec : le passage continue (réponse 200, réseau bloqué)", async () => {
    mockCreateImagePost.mockRejectedValue(new Error(BUFFER_429));
    mockSendAdminAlert.mockRejectedValueOnce(new Error("Resend down"));
    const res = await GET(req());
    expect(res.status).toBe(200);
    expect(mockTryAcquireLock).not.toHaveBeenCalled();
  });
});

describe("interrupteur Pause / Reprise en base", () => {
  it("réseaux en pause exclus de la requête de publication (THREADS toujours exclu)", async () => {
    settings = actifs("LINKEDIN");
    await GET(req());
    const notIn = mockFindMany.mock.calls[1][0].where.platform.notIn;
    expect(notIn).toEqual(expect.arrayContaining(["TWITTER", "INSTAGRAM", "THREADS"]));
    expect(notIn).not.toContain("LINKEDIN");
  });

  it("aucune ligne en base : les 3 réseaux en pause", async () => {
    settings = [];
    await GET(req());
    expect(mockFindMany.mock.calls[1][0].where.platform.notIn).toEqual(
      expect.arrayContaining(["TWITTER", "INSTAGRAM", "LINKEDIN"]),
    );
  });

  it("base des interrupteurs illisible : les 3 réseaux en pause", async () => {
    settingsBroken = true;
    await GET(req());
    expect(mockFindMany.mock.calls[1][0].where.platform.notIn).toEqual(
      expect.arrayContaining(["TWITTER", "INSTAGRAM", "LINKEDIN"]),
    );
  });

  it("canal Instagram déconnecté chez Buffer : pause automatique + 1 alerte, alertSentAt posé après envoi", async () => {
    channels[1].isDisconnected = true;
    postsAPublier();
    await GET(req());
    const ig = settings.find((r) => r.platform === "INSTAGRAM")!;
    expect(ig).toMatchObject({ paused: true, changedBy: "auto" });
    expect(ig.alertSentAt).toBeInstanceOf(Date);
    expect(mockSendAdminAlert).toHaveBeenCalledWith(expect.stringContaining("Instagram mis en pause"), expect.any(String), "social-auto-pause-canal-instagram");
    // Passage suivant : même panne, pas de nouvelle alerte (alertSentAt posé).
    postsAPublier();
    await GET(req());
    expect(mockSendAdminAlert).toHaveBeenCalledTimes(1);
  });

  it("erreur d'autorisation à la remise : réseau mis en pause", async () => {
    mockCreateImagePost.mockRejectedValue(new Error("Buffer createImagePost error: Buffer has lost authorization (invalid credentials)"));
    await GET(req());
    expect(settings.find((r) => r.platform === "INSTAGRAM")).toMatchObject({ paused: true, changedBy: "auto" });
  });
});

describe("formats", () => {
  it("X : post de plus de 270 caractères refusé, jamais découpé en fil", async () => {
    postsAPublier({ ...igPost, id: "x1", platform: "TWITTER", format: "TWEET", content: "x".repeat(300) });
    await GET(req());
    expect(mockCreatePost).not.toHaveBeenCalled();
    expect(mockUpdate.mock.calls[0][0].data.status).toBe("FAILED");
    expect(mockUpdate.mock.calls[0][0].data.directorNote).toContain("fil X interdit");
  });

  it("Instagram : carrousel v3, une URL par slide et texte alternatif amorce + chute", async () => {
    mockCreateImagePost.mockResolvedValue("buf-ig");
    postsAPublier({ ...igPost, threadParts: ["L'amorce.", "La chute."] });
    await GET(req());
    const [platform, , urls, , , alt] = mockCreateImagePost.mock.calls[0];
    expect(platform).toBe("INSTAGRAM");
    expect(urls).toEqual([
      expect.stringMatching(/\/api\/social\/image\?postId=p1&slide=0$/),
      expect.stringMatching(/\/api\/social\/image\?postId=p1&slide=1$/),
    ]);
    expect(alt).toBe("L'amorce. La chute.");
  });

  it("Instagram : URL de slides en base prioritaires", async () => {
    mockCreateImagePost.mockResolvedValue("buf-ig");
    postsAPublier({ ...igPost, imageUrls: ["https://r2/a.png", "https://r2/b.png", "https://r2/c.png"] });
    await GET(req());
    expect(mockCreateImagePost.mock.calls[0][2]).toEqual(["https://r2/a.png", "https://r2/b.png", "https://r2/c.png"]);
  });

  it("LinkedIn : lien UTM en premier commentaire", async () => {
    const lien = "https://deviens-marrant.fr/blog/x?utm_source=linkedin&utm_content=commentaire";
    postsAPublier({ ...igPost, id: "li1", platform: "LINKEDIN", format: "POTE_AU_TAF", content: "Titre\nLien en commentaire.", cta: lien });
    await GET(req());
    expect(mockCreatePost).toHaveBeenCalledWith("LINKEDIN", "Titre\nLien en commentaire.", expect.any(Date), false, { firstComment: lien });
  });
});

describe("garde articleSlug (relais d'article) et repli", () => {
  const relaisX = {
    ...igPost, id: "x1", platform: "TWITTER", format: "TWEET",
    content: "Une vanne.\n\nLes 9 autres : https://deviens-marrant.fr/blog/article-a?utm_source=x",
    scheduledAt: new Date("2026-10-12T10:30:00Z"), directorNote: "[article:article-a] [repli:r1] Lot relance-s15 (RELAIS, TIRAGE)",
  };
  const repliX = {
    ...relaisX, id: "r1", content: "« Une autre vanne du même thème. »", status: "REJECTED",
    directorNote: "[repli-de:x1] Lot relance-s15 (VANNE, TIRAGE) : Repli du relais de article-a",
  };
  const relaisIg = { ...igPost, id: "i1", content: "Les 9 autres : lien en bio.", directorNote: "[article:article-b] Lot relance-s15 (RELAIS, TIRAGE)" };
  const majDe = (id: string) => mockUpdate.mock.calls.find((c) => c[0].where.id === id)?.[0].data;

  beforeEach(() => {
    mockFindUnique.mockResolvedValue(repliX);
    mockUpdate.mockImplementation(async (a: { where: { id: string }; data: Record<string, unknown> }) => (a.where.id === "r1" ? { ...repliX, ...a.data } : {}));
    mockSendAdminAlert.mockResolvedValue(true);
  });

  it("article visible : le relais part, aucun repli", async () => {
    mockCreatePost.mockResolvedValue("buf-x");
    postsAPublier(relaisX);
    await GET(req());
    expect(mockFindBlogArticle).toHaveBeenCalledWith("article-a");
    expect(mockCreatePost).toHaveBeenCalledWith("TWITTER", relaisX.content, expect.any(Date), false, expect.anything());
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it("article non publié : relais REJECTED, repli APPROVED envoyé sur le même créneau, alerte du réseau", async () => {
    mockFindBlogArticle.mockResolvedValue(null);
    mockCreatePost.mockResolvedValue("buf-r1");
    postsAPublier(relaisX);
    await GET(req());
    expect(majDe("x1")).toMatchObject({ status: "REJECTED" });
    expect(majDe("x1").directorNote).toMatch(/^Relais rejeté : article « article-a » non publié à l'heure de l'envoi \(repli r1 envoyé sur le même créneau\)/);
    expect(majDe("r1")).toEqual({ status: "APPROVED", scheduledAt: relaisX.scheduledAt });
    expect(mockCreatePost).toHaveBeenCalledWith("TWITTER", repliX.content, relaisX.scheduledAt, false, expect.anything());
    expect(mockUpdate.mock.calls.some((c) => c[0].where.id === "r1" && c[0].data.status === "PUBLISHED")).toBe(true);
    expect(cles()).toContain("social-relais-twitter");
  });

  it("repli absent ou déjà utilisé : relais REJECTED, créneau vide, rien chez Buffer", async () => {
    mockFindBlogArticle.mockResolvedValue(null);
    mockFindUnique.mockResolvedValue({ ...repliX, status: "PUBLISHED" });
    postsAPublier(relaisX);
    await GET(req());
    expect(majDe("x1").directorNote).toMatch(/aucun repli en réserve, créneau vide/);
    expect(mockCreatePost).not.toHaveBeenCalled();
    expect(mockSendAdminAlert).toHaveBeenCalledWith(expect.stringContaining("créneau vide"), expect.any(String), "social-relais-twitter");
  });

  it("relais Instagram (marqueur seul, sans lien ni repli) : REJECTED, aucun carrousel envoyé", async () => {
    mockFindBlogArticle.mockResolvedValue(null);
    postsAPublier(relaisIg);
    await GET(req());
    expect(mockFindBlogArticle).toHaveBeenCalledWith("article-b");
    expect(majDe("i1")).toMatchObject({ status: "REJECTED" });
    expect(mockCreateImagePost).not.toHaveBeenCalled();
  });

  it("visibilité illisible : post retenu sans changement", async () => {
    mockFindBlogArticle.mockRejectedValue(new Error("db down"));
    postsAPublier(relaisX);
    await GET(req());
    expect(mockCreatePost).not.toHaveBeenCalled();
    expect(majDe("x1")).toBeUndefined();
  });

  it("échec temporaire : les marqueurs survivent à la note de relance", async () => {
    mockCreatePost.mockRejectedValue(new Error("network timeout"));
    postsAPublier(relaisX);
    await GET(req());
    expect(majDe("x1").directorNote).toBe("[article:article-a] [repli:r1] Échec publication Buffer : network timeout [retry:1]");
  });
});

describe("buildPublishErrorNote", () => {
  it("tronque à 900 caractères et ajoute le compteur de relances", () => {
    const note = buildPublishErrorNote("x".repeat(2000), 2);
    expect(note.length).toBeLessThan(960);
    expect(note).toMatch(/\[retry:2\]$/);
  });
});
