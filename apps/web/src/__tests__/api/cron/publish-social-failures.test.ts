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
 */

const mockFindMany = jest.fn();
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

const mockSendAdminAlert = jest.fn();
jest.mock("@/lib/email", () => ({ sendAdminAlert: (...a: unknown[]) => mockSendAdminAlert(...a) }));

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

describe("D1 : verrou d'alerte posé après l'envoi réussi", () => {
  it("envoie l'e-mail puis pose le verrou du jour", async () => {
    await GET(req());
    expect(mockSendAdminAlert).toHaveBeenCalledTimes(1);
    expect(mockTryAcquireLock).toHaveBeenCalledWith(expect.stringMatching(/^publish-social-failure-alert-\d{4}-\d{2}-\d{2}$/));
    expect(mockSendAdminAlert.mock.invocationCallOrder[0]).toBeLessThan(mockTryAcquireLock.mock.invocationCallOrder[0]);
  });

  it("n'envoie pas de 2e e-mail le même jour", async () => {
    await GET(req());
    postsAPublier(igPost);
    await GET(req());
    expect(mockSendAdminAlert).toHaveBeenCalledTimes(1);
  });

  it("Resend en échec : aucun verrou, l'alerte repart au passage suivant", async () => {
    mockSendAdminAlert.mockResolvedValueOnce(false);
    await GET(req());
    expect(mockTryAcquireLock).not.toHaveBeenCalled();
    postsAPublier(igPost);
    await GET(req());
    expect(mockSendAdminAlert).toHaveBeenCalledTimes(2);
    expect(mockTryAcquireLock).toHaveBeenCalledTimes(1);
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
    expect(mockSendAdminAlert).toHaveBeenCalledWith(expect.stringContaining("Instagram mis en pause"), expect.any(String));
    // Passage suivant : même panne, pas de nouvel e-mail.
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

describe("buildPublishErrorNote", () => {
  it("tronque à 900 caractères et ajoute le compteur de relances", () => {
    const note = buildPublishErrorNote("x".repeat(2000), 2);
    expect(note.length).toBeLessThan(960);
    expect(note).toMatch(/\[retry:2\]$/);
  });
});
