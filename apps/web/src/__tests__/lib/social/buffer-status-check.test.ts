/**
 * @jest-environment node
 *
 * Relecture du statut réel des posts Buffer (s15, cycle 3) :
 * sent → confirmé ; error → FAILED (note gardée) ; supprimé chez Buffer →
 * FAILED introuvable ; bloqué 6 h → non confirmé ; autorisation perdue →
 * pause automatique ; alertes jamais perdues (D1) ; Buffer injoignable →
 * aucun changement de statut.
 */
const locks = new Set<string>();
jest.mock("@/lib/job-lock", () => ({
  buildJobLockKey: (name: string, d: Date) => `${name}-${d.toISOString().slice(0, 10)}`,
  nextUtcDay: (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1)),
  isLockHeld: async (key: string) => locks.has(key),
  tryAcquireLock: async (key: string) => {
    if (locks.has(key)) return false;
    locks.add(key);
    return true;
  },
}));
const sendAdminAlert = jest.fn();
jest.mock("@/lib/email", () => ({ sendAdminAlert: (...a: unknown[]) => sendAdminAlert(...a) }));

import type { SocialPlatform } from "@prisma/client";
import type { BufferPostStatus } from "@/lib/social/buffer-client";
import {
  BUFFER_CONFIRMED_PREFIX,
  MAX_RELECTURES_PAR_PASSE,
  reconcileBufferPostStatuses,
  STATUTS_A_SIGNALER,
  type StatusCheckDeps,
  type StatusStore,
} from "@/lib/social/buffer-status-check";
import { sendDailyPublishFailureAlert } from "@/lib/social/publish-failure";

interface Row {
  id: string;
  platform: SocialPlatform;
  status: string;
  externalId: string | null;
  scheduledAt: Date;
  publishedAt: Date | null;
  directorNote: string | null;
  bufferStatus: string | null;
  alertedAt: Date | null;
  hook: string;
}

const NOW = new Date("2026-10-05T12:00:00Z");
const H = 60 * 60 * 1000;

/** Base en mémoire qui reproduit les filtres de prismaStatusStore. */
function fakeStore(rows: Row[]): StatusStore {
  return {
    candidats: async (since) =>
      rows.filter(
        (r) => r.status === "PUBLISHED" && r.externalId && r.publishedAt && r.publishedAt >= since &&
          r.bufferStatus !== "sent" && !(r.directorNote ?? "").includes(BUFFER_CONFIRMED_PREFIX),
      ),
    maj: async (id, data) => {
      const r = rows.find((x) => x.id === id && x.status === "PUBLISHED");
      if (!r) return 0;
      Object.assign(r, data);
      return 1;
    },
    aSignaler: async () =>
      rows.filter((r) => (STATUTS_A_SIGNALER as readonly string[]).includes(r.bufferStatus ?? "") && r.alertedAt === null),
    marquerAlertes: async (ids, now) => {
      for (const r of rows) if (ids.includes(r.id)) r.alertedAt = now;
    },
  };
}

function row(id: string, extra: Partial<Row> = {}): Row {
  return {
    id, platform: "INSTAGRAM", status: "PUBLISHED", externalId: `buf-${id}`, scheduledAt: new Date(NOW.getTime() - 24 * H),
    publishedAt: new Date(NOW.getTime() - 24 * H), directorNote: null, bufferStatus: null, alertedAt: null, hook: `Hook ${id}`, ...extra,
  };
}

const remote = (id: string, status: string, extra: Partial<BufferPostStatus> = {}): BufferPostStatus => ({
  id, status, sentAt: null, externalLink: null, channelService: "instagram", error: null, ...extra,
});

function deps(rows: Row[], finished: BufferPostStatus[], one: Record<string, BufferPostStatus | null> = {}): StatusCheckDeps & {
  autoPause: jest.Mock; fetchOne: jest.Mock;
} {
  return {
    store: fakeStore(rows),
    fetchFinished: async () => finished,
    fetchOne: jest.fn(async (id: string) => (id in one ? one[id] : null)),
    sendAlert: sendDailyPublishFailureAlert,
    autoPause: jest.fn(async () => true),
  };
}

beforeEach(() => {
  locks.clear();
  sendAdminAlert.mockReset().mockResolvedValue(true);
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("reconcileBufferPostStatuses", () => {
  it("sent : confirmé, publishedAt = sentAt, lien réel ajouté à la note", async () => {
    const rows = [row("a", { directorNote: "Préparation mensuelle." })];
    const res = await reconcileBufferPostStatuses(
      deps(rows, [remote("buf-a", "sent", { sentAt: "2026-10-04T16:30:00Z", externalLink: "https://instagram.com/p/x" })]), NOW);
    expect(res.confirmed).toBe(1);
    expect(rows[0].bufferStatus).toBe("sent");
    expect(rows[0].publishedAt).toEqual(new Date("2026-10-04T16:30:00Z"));
    expect(rows[0].directorNote).toBe(`Préparation mensuelle.\n${BUFFER_CONFIRMED_PREFIX} le 2026-10-04T16:30:00.000Z : https://instagram.com/p/x`);
  });

  it("sentAt illisible : date du passage, le lot continue (D6)", async () => {
    const rows = [row("a"), row("b")];
    const res = await reconcileBufferPostStatuses(deps(rows, [remote("buf-a", "sent", { sentAt: "pas une date" }), remote("buf-b", "sent")]), NOW);
    expect(res.confirmed).toBe(2);
    expect(rows[0].publishedAt).toEqual(NOW);
  });

  it("error : FAILED, note précédente gardée (D5), 1 alerte puis alertedAt posé", async () => {
    const rows = [row("a", { directorNote: "Note du directeur." })];
    const res = await reconcileBufferPostStatuses(
      deps(rows, [remote("buf-a", "error", { error: { message: "Media too small", rawError: null, supportUrl: null } })]), NOW);
    expect(res.failed).toBe(1);
    expect(rows[0]).toMatchObject({ status: "FAILED", bufferStatus: "error" });
    expect(rows[0].directorNote).toMatch(/^Note du directeur\.\nÉchec publication Buffer : Media too small$/);
    expect(sendAdminAlert).toHaveBeenCalledTimes(1);
    expect(sendAdminAlert.mock.calls[0][1]).toContain("Hook a");
    expect(rows[0].alertedAt).toEqual(NOW);
    expect(res.alerted).toEqual(["INSTAGRAM"]);
  });

  it("autorisation perdue : pause automatique du réseau", async () => {
    const rows = [row("a")];
    const d = deps(rows, [remote("buf-a", "error", { error: { message: "Buffer has lost authorization to post", rawError: null, supportUrl: null } })]);
    const res = await reconcileBufferPostStatuses(d, NOW);
    expect(d.autoPause).toHaveBeenCalledWith("INSTAGRAM", expect.stringContaining("lost authorization"), NOW);
    expect(res.paused).toEqual(["INSTAGRAM"]);
  });

  it("absent des pages puis introuvable chez Buffer (supprimé) : FAILED introuvable + alerte", async () => {
    const rows = [row("a")];
    const d = deps(rows, [], { "buf-a": null });
    const res = await reconcileBufferPostStatuses(d, NOW);
    expect(d.fetchOne).toHaveBeenCalledWith("buf-a");
    expect(res.missing).toBe(1);
    expect(rows[0]).toMatchObject({ status: "FAILED", bufferStatus: "introuvable" });
    expect(sendAdminAlert.mock.calls[0][1]).toContain("introuvable chez Buffer");
  });

  it("bloqué en sending 6 h après l'heure prévue : non confirmé (reste PUBLISHED) + alerte unique", async () => {
    const rows = [row("a", { scheduledAt: new Date(NOW.getTime() - 7 * H), publishedAt: new Date(NOW.getTime() - 7 * H) })];
    const one = { "buf-a": remote("buf-a", "sending", { dueAt: new Date(NOW.getTime() - 7 * H).toISOString() }) };
    const res = await reconcileBufferPostStatuses(deps(rows, [], one), NOW);
    expect(res.unconfirmed).toBe(1);
    expect(rows[0]).toMatchObject({ status: "PUBLISHED", bufferStatus: "non_confirme" });
    expect(sendAdminAlert).toHaveBeenCalledTimes(1);
    // Passage suivant (lendemain) : toujours bloqué, aucune nouvelle alerte.
    await reconcileBufferPostStatuses(deps(rows, [], one), new Date(NOW.getTime() + 24 * H));
    expect(sendAdminAlert).toHaveBeenCalledTimes(1);
    // Puis envoyé : confirmé.
    const ok = await reconcileBufferPostStatuses(deps(rows, [remote("buf-a", "sent")]), new Date(NOW.getTime() + 25 * H));
    expect(ok.confirmed).toBe(1);
  });

  it("programmé récemment : inchangé, aucune alerte", async () => {
    const rows = [row("a", { scheduledAt: new Date(NOW.getTime() - H), publishedAt: new Date(NOW.getTime() - H) })];
    const res = await reconcileBufferPostStatuses(deps(rows, [], { "buf-a": remote("buf-a", "scheduled") }), NOW);
    expect(res.unchanged).toBe(1);
    expect(rows[0].bufferStatus).toBe("scheduled");
    expect(sendAdminAlert).not.toHaveBeenCalled();
  });

  it(`au plus ${MAX_RELECTURES_PAR_PASSE} relectures par identifiant par passage`, async () => {
    const rows = Array.from({ length: MAX_RELECTURES_PAR_PASSE + 5 }, (_, i) => row(`p${i}`, {
      scheduledAt: new Date(NOW.getTime() - H), publishedAt: new Date(NOW.getTime() - H),
    }));
    const one = Object.fromEntries(rows.map((r) => [r.externalId!, remote(r.externalId!, "scheduled")]));
    const d = deps(rows, [], one);
    const res = await reconcileBufferPostStatuses(d, NOW);
    expect(d.fetchOne).toHaveBeenCalledTimes(MAX_RELECTURES_PAR_PASSE);
    expect(res.unchanged).toBe(rows.length);
  });

  it("Buffer injoignable : aucun changement de statut, mais les alertes en attente partent", async () => {
    const rows = [row("a"), row("b", { status: "FAILED", bufferStatus: "error" })];
    const d = deps(rows, []);
    d.fetchFinished = async () => {
      throw new Error("timeout");
    };
    const res = await reconcileBufferPostStatuses(d, NOW);
    expect(res.error).toBe("timeout");
    expect(rows[0].status).toBe("PUBLISHED");
    expect(sendAdminAlert).toHaveBeenCalledTimes(1);
    expect(rows[1].alertedAt).toEqual(NOW);
  });

  it("D1 : Resend en échec = alerte gardée en attente et renvoyée au passage suivant", async () => {
    const rows = [row("a")];
    sendAdminAlert.mockResolvedValueOnce(false);
    await reconcileBufferPostStatuses(deps(rows, [remote("buf-a", "error")]), NOW);
    expect(rows[0].alertedAt).toBeNull();
    const res = await reconcileBufferPostStatuses(deps(rows, []), new Date(NOW.getTime() + H));
    expect(sendAdminAlert).toHaveBeenCalledTimes(2);
    expect(res.alerted).toEqual(["INSTAGRAM"]);
    expect(rows[0].alertedAt).not.toBeNull();
  });

  it("alerte du jour déjà partie : la nouvelle anomalie attend le lendemain, jamais perdue", async () => {
    const rows = [row("a"), row("b")];
    await reconcileBufferPostStatuses(deps(rows, [remote("buf-a", "error"), remote("buf-b", "sent")]), NOW);
    rows.push(row("c"));
    await reconcileBufferPostStatuses(deps(rows, [remote("buf-c", "error")]), new Date(NOW.getTime() + H));
    expect(sendAdminAlert).toHaveBeenCalledTimes(1);
    expect(rows[2].alertedAt).toBeNull();
    await reconcileBufferPostStatuses(deps(rows, []), new Date(NOW.getTime() + 24 * H));
    expect(sendAdminAlert).toHaveBeenCalledTimes(2);
    expect(rows[2].alertedAt).not.toBeNull();
  });

  it("idempotent : un post confirmé n'est plus relu", async () => {
    const rows = [row("a")];
    await reconcileBufferPostStatuses(deps(rows, [remote("buf-a", "sent")]), NOW);
    const res = await reconcileBufferPostStatuses(deps(rows, [remote("buf-a", "sent")]), NOW);
    expect(res.candidates).toBe(0);
  });
});
