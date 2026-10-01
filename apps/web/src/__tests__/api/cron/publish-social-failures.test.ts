/**
 * @jest-environment node
 *
 * Tests — Cron publish-social, correctifs s14 (01/10/2026).
 *   (a) Le message d'erreur exact de Buffer est enregistré sur le post FAILED (directorNote).
 *   (b) Les e-mails d'échec sont limités à 1 par jour (verrou JobLock).
 *   (c) LinkedIn en pause : exclu de la requête de publication.
 *   (d) Circuit breaker 429 basé sur `startsWith`, pas `contains`.
 */

const mockFindMany = jest.fn();
const mockUpdate = jest.fn();
const mockUpdateMany = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    socialPost: {
      findMany: (...a: unknown[]) => mockFindMany(...a),
      update: (...a: unknown[]) => mockUpdate(...a),
      updateMany: (...a: unknown[]) => mockUpdateMany(...a),
    },
  },
}));

jest.mock("@/lib/db-retry", () => ({ withDbRetry: (fn: () => unknown) => fn() }));

const mockCreateImagePost = jest.fn();
jest.mock("@/lib/social/buffer-client", () => {
  class BufferQueueFullError extends Error {}
  class BufferContentTooLongError extends Error {}
  return {
    createBufferPost: jest.fn(),
    createBufferThread: jest.fn(),
    createBufferImagePost: (...a: unknown[]) => mockCreateImagePost(...a),
    isBufferConfigured: () => true,
    isChannelConfigured: () => true,
    getBufferChannels: async () => [],
    BufferQueueFullError,
    BufferContentTooLongError,
  };
});

const mockTryAcquireLock = jest.fn();
jest.mock("@/lib/job-lock", () => ({
  ...jest.requireActual("@/lib/job-lock"),
  tryAcquireLock: (...a: unknown[]) => mockTryAcquireLock(...a),
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
  imageUrl: "https://deviens-marrant.fr/api/social/stored-image?key=x.png",
  scheduledAt: new Date("2026-10-02T17:00:00Z"),
  directorNote: null,
};

function req() {
  return new Request("https://example.com/api/cron/publish-social?secret=s", { method: "GET" });
}

beforeEach(() => {
  jest.clearAllMocks();
  process.env.CRON_SECRET = "s";
  mockUpdateMany.mockResolvedValue({ count: 0 });
  mockUpdate.mockResolvedValue({});
  mockFindMany.mockResolvedValueOnce([]).mockResolvedValueOnce([igPost]);
  mockCreateImagePost.mockRejectedValue(new Error(BUFFER_400));
  jest.spyOn(console, "error").mockImplementation(() => undefined);
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
  jest.spyOn(console, "log").mockImplementation(() => undefined);
});

describe("publish-social : traçabilité des échecs (s14)", () => {
  it("enregistre le message exact de Buffer sur le post FAILED", async () => {
    mockTryAcquireLock.mockResolvedValue(true);
    await GET(req());
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "p1" },
      data: { status: "FAILED", directorNote: buildPublishErrorNote(BUFFER_400) },
    });
    expect(buildPublishErrorNote(BUFFER_400)).toContain('Did you mean "image"?');
  });

  it("envoie l'e-mail d'échec si le verrou du jour est libre", async () => {
    mockTryAcquireLock.mockResolvedValue(true);
    await GET(req());
    expect(mockTryAcquireLock).toHaveBeenCalledWith(
      expect.stringMatching(/^publish-social-failure-alert-\d{4}-\d{2}-\d{2}$/),
      expect.any(Number),
    );
    expect(mockSendAdminAlert).toHaveBeenCalledTimes(1);
  });

  it("n'envoie pas de 2e e-mail le même jour", async () => {
    mockTryAcquireLock.mockResolvedValue(false);
    await GET(req());
    expect(mockSendAdminAlert).not.toHaveBeenCalled();
  });

  it("exclut LinkedIn de la publication et lit le circuit breaker en startsWith", async () => {
    mockTryAcquireLock.mockResolvedValue(true);
    await GET(req());
    const breakerWhere = mockFindMany.mock.calls[0][0].where;
    expect(breakerWhere.directorNote).toEqual({ startsWith: "429" });
    const publishWhere = mockFindMany.mock.calls[1][0].where;
    expect(publishWhere.platform.notIn).toContain("LINKEDIN");
  });
});

describe("buildPublishErrorNote", () => {
  it("tronque à 900 caractères et ajoute le compteur de relances", () => {
    const note = buildPublishErrorNote("x".repeat(2000), 2);
    expect(note.length).toBeLessThan(960);
    expect(note).toMatch(/\[retry:2\]$/);
  });
});
