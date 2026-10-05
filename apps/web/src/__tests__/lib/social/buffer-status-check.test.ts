/**
 * @jest-environment node
 *
 * Relecture du statut réel des posts Buffer (s15, 05/10/2026) :
 * sent → confirmé, error → FAILED + note, alerte 1/jour/plateforme,
 * idempotence, Buffer injoignable → aucun changement.
 */
const locks = new Set<string>();
jest.mock("@/lib/job-lock", () => ({
  buildJobLockKey: (name: string, d: Date) => `${name}-${d.toISOString().slice(0, 10)}`,
  nextUtcDay: (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1)),
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
  reconcileBufferPostStatuses,
  type StatusCheckDb,
  type StatusCheckDeps,
} from "@/lib/social/buffer-status-check";
import { sendDailyPublishFailureAlert } from "@/lib/social/publish-failure";

interface Row {
  id: string;
  platform: SocialPlatform;
  status: string;
  externalId: string | null;
  publishedAt: Date | null;
  directorNote: string | null;
}

/** Base en mémoire qui applique les filtres utilisés par le module. */
function fakeDb(rows: Row[]): StatusCheckDb & { updates: number } {
  const db = {
    updates: 0,
    socialPost: {
      findMany: async (args: unknown) => {
        const gte = (args as { where: { publishedAt: { gte: Date } } }).where.publishedAt.gte;
        return rows.filter(
          (r) =>
            r.status === "PUBLISHED" &&
            r.externalId !== null &&
            r.publishedAt !== null &&
            r.publishedAt >= gte &&
            !(r.directorNote ?? "").includes(BUFFER_CONFIRMED_PREFIX),
        );
      },
      updateMany: async (args: unknown) => {
        const { where, data } = args as { where: { id: string; status: string }; data: Partial<Row> };
        const row = rows.find((r) => r.id === where.id && r.status === where.status);
        if (!row) return { count: 0 };
        Object.assign(row, data);
        db.updates += 1;
        return { count: 1 };
      },
    },
  };
  return db;
}

const NOW = new Date("2026-10-05T10:00:00Z");
const igError: BufferPostStatus = {
  id: "buf-ig",
  status: "error",
  sentAt: null,
  externalLink: null,
  channelService: "instagram",
  error: {
    message: "Buffer has lost authorization to post on your behalf",
    rawError: "Invalid Credentials",
    supportUrl: "https://support.buffer.com/reconnect",
  },
};
const xSent: BufferPostStatus = {
  id: "buf-x",
  status: "sent",
  sentAt: "2026-10-03T08:01:00.000Z",
  externalLink: "https://x.com/deviensmarrant/status/123",
  channelService: "twitter",
  error: null,
};

function rowsFixture(): Row[] {
  return [
    { id: "p-ig", platform: "INSTAGRAM", status: "PUBLISHED", externalId: "buf-ig", publishedAt: new Date("2026-10-02T07:00:00Z"), directorNote: null },
    { id: "p-x", platform: "TWITTER", status: "PUBLISHED", externalId: "buf-x", publishedAt: new Date("2026-10-03T07:50:00Z"), directorNote: "Lot octobre" },
    { id: "p-wait", platform: "TWITTER", status: "PUBLISHED", externalId: "buf-later", publishedAt: new Date("2026-10-05T09:00:00Z"), directorNote: null },
    { id: "p-old", platform: "INSTAGRAM", status: "PUBLISHED", externalId: "buf-old", publishedAt: new Date("2026-09-20T07:00:00Z"), directorNote: null },
  ];
}

function deps(db: StatusCheckDb, statuses: BufferPostStatus[] | Error): StatusCheckDeps {
  return {
    db,
    fetchStatuses: jest.fn(async () => {
      if (statuses instanceof Error) throw statuses;
      return statuses;
    }),
    sendAlert: sendDailyPublishFailureAlert,
  };
}

beforeEach(() => {
  locks.clear();
  sendAdminAlert.mockReset().mockResolvedValue(undefined);
});

describe("reconcileBufferPostStatuses", () => {
  it("sent → publication confirmée, publishedAt = sentAt, lien réel dans la note", async () => {
    const rows = rowsFixture();
    const res = await reconcileBufferPostStatuses(deps(fakeDb(rows), [xSent]), NOW);
    const x = rows.find((r) => r.id === "p-x")!;
    expect(res.confirmed).toBe(1);
    expect(x.status).toBe("PUBLISHED");
    expect(x.publishedAt?.toISOString()).toBe("2026-10-03T08:01:00.000Z");
    expect(x.directorNote).toBe(
      `Lot octobre\n${BUFFER_CONFIRMED_PREFIX} le 2026-10-03T08:01:00.000Z : https://x.com/deviensmarrant/status/123`,
    );
  });

  it("error → FAILED + note « Échec publication Buffer : … » + alerte admin", async () => {
    const rows = rowsFixture();
    const res = await reconcileBufferPostStatuses(deps(fakeDb(rows), [igError, xSent]), NOW);
    const ig = rows.find((r) => r.id === "p-ig")!;
    expect(ig.status).toBe("FAILED");
    expect(ig.directorNote).toBe(
      "Échec publication Buffer : Buffer has lost authorization to post on your behalf (détail : Invalid Credentials)",
    );
    expect(res).toMatchObject({ candidates: 3, confirmed: 1, failed: 1, unchanged: 1, alerted: ["INSTAGRAM"] });
    expect(sendAdminAlert).toHaveBeenCalledTimes(1);
    const [subject, html] = sendAdminAlert.mock.calls[0] as [string, string];
    expect(subject).toContain("Instagram");
    expect(html).toContain("Buffer has lost authorization");
    expect(html).toContain("reconnecter le canal Instagram dans Buffer");
    // Hors fenêtre de 7 jours : jamais relu.
    expect(rows.find((r) => r.id === "p-old")!.status).toBe("PUBLISHED");
  });

  it("alerte limitée à 1 par jour et par plateforme", async () => {
    const rows = [
      ...rowsFixture(),
      { id: "p-ig2", platform: "INSTAGRAM" as SocialPlatform, status: "PUBLISHED", externalId: "buf-ig2", publishedAt: new Date("2026-10-04T07:00:00Z"), directorNote: null },
    ];
    const db = fakeDb(rows);
    await reconcileBufferPostStatuses(deps(db, [igError]), NOW);
    // Nouvel échec Instagram le même jour : FAILED, mais pas de 2e e-mail.
    const res = await reconcileBufferPostStatuses(deps(db, [{ ...igError, id: "buf-ig2" }]), NOW);
    expect(res.failed).toBe(1);
    expect(res.alerted).toEqual([]);
    expect(sendAdminAlert).toHaveBeenCalledTimes(1);
    // Autre plateforme le même jour : e-mail distinct.
    rows.push({ id: "p-x2", platform: "TWITTER", status: "PUBLISHED", externalId: "buf-x2", publishedAt: NOW, directorNote: null });
    await reconcileBufferPostStatuses(deps(db, [{ ...igError, id: "buf-x2", channelService: "twitter" }]), NOW);
    expect(sendAdminAlert).toHaveBeenCalledTimes(2);
    // Lendemain : une nouvelle alerte Instagram est possible.
    rows.push({ id: "p-ig3", platform: "INSTAGRAM", status: "PUBLISHED", externalId: "buf-ig3", publishedAt: NOW, directorNote: null });
    await reconcileBufferPostStatuses(deps(db, [{ ...igError, id: "buf-ig3" }]), new Date("2026-10-06T10:00:00Z"));
    expect(sendAdminAlert).toHaveBeenCalledTimes(3);
  });

  it("idempotent : un 2e passage ne modifie rien et n'alerte pas", async () => {
    const rows = rowsFixture();
    const db = fakeDb(rows);
    await reconcileBufferPostStatuses(deps(db, [igError, xSent]), NOW);
    const snapshot = JSON.stringify(rows);
    const updatesAfterFirst = db.updates;
    const res = await reconcileBufferPostStatuses(deps(db, [igError, xSent]), NOW);
    expect(JSON.stringify(rows)).toBe(snapshot);
    expect(db.updates).toBe(updatesAfterFirst);
    expect(res).toMatchObject({ candidates: 1, confirmed: 0, failed: 0, unchanged: 1 });
    expect(sendAdminAlert).toHaveBeenCalledTimes(1);
  });

  it("Buffer injoignable → aucun changement, aucune alerte", async () => {
    const rows = rowsFixture();
    const snapshot = JSON.stringify(rows);
    const db = fakeDb(rows);
    const res = await reconcileBufferPostStatuses(deps(db, new Error("The operation was aborted due to timeout")), NOW);
    expect(res.error).toContain("timeout");
    expect(res.unchanged).toBe(3);
    expect(JSON.stringify(rows)).toBe(snapshot);
    expect(db.updates).toBe(0);
    expect(sendAdminAlert).not.toHaveBeenCalled();
  });

  it("aucun candidat → aucun appel Buffer", async () => {
    const d = deps(fakeDb([]), [igError]);
    const res = await reconcileBufferPostStatuses(d, NOW);
    expect(res.candidates).toBe(0);
    expect(d.fetchStatuses).not.toHaveBeenCalled();
  });
});
