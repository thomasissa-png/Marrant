/**
 * @jest-environment node
 *
 * Admin social (s15 cycle 3) : interrupteur Pause / Reprise par réseau et
 * rapport « prévu contre publié ». Auth Bearer ADMIN_PASSWORD, zod, reprise
 * refusée tant que le canal Buffer est en panne ou si Buffer est injoignable
 * (QA cycle 1 C3) ; commande « sauter les posts avant J0 ».
 */
const settings: Array<Record<string, unknown>> = [];
const posts: Array<{ id: string; platform: string; status: string; scheduledAt: Date; directorNote?: string | null }> = [];
jest.mock("@/lib/prisma", () => ({
  prisma: {
    socialPlatformSetting: {
      findMany: async () => settings.map((s) => ({ ...s })),
      upsert: async (a: { where: { platform: string }; create: Record<string, unknown>; update: Record<string, unknown> }) => {
        const r = settings.find((s) => s.platform === a.where.platform);
        if (r) Object.assign(r, a.update);
        else settings.push({ ...a.create });
        return {};
      },
      updateMany: async () => ({ count: 0 }),
    },
    socialPost: {
      findMany: async (a: { where: { platform: string; scheduledAt: { lt: Date } } }) =>
        posts.filter((p) => p.platform === a.where.platform && p.status === "APPROVED" && p.scheduledAt < a.where.scheduledAt.lt),
      update: async (a: { where: { id: string }; data: Record<string, unknown> }) => Object.assign(posts.find((p) => p.id === a.where.id)!, a.data),
    },
  },
}));
let channels: Array<Record<string, unknown>> = [];
let bufferDown = false;
jest.mock("@/lib/social/buffer-client", () => ({
  isBufferConfigured: () => true,
  getBufferChannels: async () => {
    if (bufferDown) throw new Error("Buffer timeout");
    return channels;
  },
  getConfiguredChannelIds: () => ({ TWITTER: "x", INSTAGRAM: "ig", LINKEDIN: "li" }),
}));

import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/admin/social/platforms/route";
import { GET as REPORT } from "@/app/api/admin/social/report/route";

const auth = { authorization: "Bearer pw" };
const post = (body: unknown, headers: Record<string, string> = auth) =>
  POST(new NextRequest("https://x/api/admin/social/platforms", { method: "POST", headers, body: JSON.stringify(body) }));

beforeEach(() => {
  process.env.ADMIN_PASSWORD = "pw";
  settings.length = 0;
  posts.length = 0;
  bufferDown = false;
  for (const platform of ["TWITTER", "INSTAGRAM", "LINKEDIN"]) {
    settings.push({ platform, paused: true, reason: "Relance s15", changedBy: "migration", pausedAt: null, alertSentAt: null });
  }
  channels = [
    { id: "x", isDisconnected: false, isLocked: false },
    { id: "ig", isDisconnected: true, isLocked: false },
    { id: "li", isDisconnected: false, isLocked: false },
  ];
});

describe("/api/admin/social/platforms", () => {
  it("401 sans mot de passe admin", async () => {
    expect((await GET(new NextRequest("https://x/api/admin/social/platforms"))).status).toBe(401);
    expect((await post({ platform: "LINKEDIN", action: "reprise" }, {})).status).toBe(401);
  });

  it("GET : 3 réseaux, état et santé du canal", async () => {
    const res = await GET(new NextRequest("https://x/api/admin/social/platforms", { headers: auth }));
    const { platforms } = await res.json();
    expect(platforms.map((p: { platform: string; paused: boolean }) => [p.platform, p.paused])).toEqual([
      ["TWITTER", true], ["INSTAGRAM", true], ["LINKEDIN", true],
    ]);
    expect(platforms[1].canal).toContain("autorisation");
    expect(platforms[2].canal).toBe("ok");
  });

  it("400 si la requête est invalide", async () => {
    expect((await post({ platform: "THREADS", action: "reprise" })).status).toBe(400);
    expect((await post({ platform: "LINKEDIN", action: "go" })).status).toBe(400);
  });

  it("reprise LinkedIn puis pause, sans redéploiement", async () => {
    const r = await post({ platform: "LINKEDIN", action: "reprise" });
    expect(r.status).toBe(200);
    expect(settings.find((s) => s.platform === "LINKEDIN")).toMatchObject({ paused: false });
    await post({ platform: "LINKEDIN", action: "pause", raison: "Test" });
    expect(settings.find((s) => s.platform === "LINKEDIN")).toMatchObject({ paused: true, reason: "Test", changedBy: "admin" });
  });

  it("reprise Instagram refusée tant que le canal Buffer est déconnecté (409)", async () => {
    const r = await post({ platform: "INSTAGRAM", action: "reprise" });
    expect(r.status).toBe(409);
    expect((await r.json()).error).toContain("Reconnecter le canal");
    expect(settings.find((s) => s.platform === "INSTAGRAM")).toMatchObject({ paused: true });
  });

  it("reprise refusée si Buffer est injoignable (503), réseau toujours en pause", async () => {
    bufferDown = true;
    const r = await post({ platform: "LINKEDIN", action: "reprise" });
    expect(r.status).toBe(503);
    expect((await r.json()).error).toContain("Buffer injoignable");
    expect(settings.find((s) => s.platform === "LINKEDIN")).toMatchObject({ paused: true });
  });

  it("sauter les posts avant J0 : j0 obligatoire, puis REJECTED des posts antérieurs", async () => {
    posts.push(
      { id: "a", platform: "TWITTER", status: "APPROVED", scheduledAt: new Date("2026-10-12T10:30:00Z") },
      { id: "b", platform: "TWITTER", status: "APPROVED", scheduledAt: new Date("2026-10-19T10:30:00Z") },
    );
    expect((await post({ platform: "TWITTER", action: "sauter-avant-j0" })).status).toBe(400);
    expect((await post({ platform: "TWITTER", action: "sauter-avant-j0", j0: "19/10" })).status).toBe(400);
    const r = await post({ platform: "TWITTER", action: "sauter-avant-j0", j0: "2026-10-19" });
    expect(r.status).toBe(200);
    expect((await r.json()).message).toContain("1 post(s)");
    expect(posts.map((p) => p.status)).toEqual(["REJECTED", "APPROVED"]);
  });
});

describe("/api/admin/social/report", () => {
  it("401 sans auth, puis rapport vide sur 7 jours", async () => {
    expect((await REPORT(new NextRequest("https://x/api/admin/social/report"))).status).toBe(401);
    const res = await REPORT(new NextRequest("https://x/api/admin/social/report?jours=7", { headers: auth }));
    const body = await res.json();
    expect(body).toMatchObject({ lignes: [], ecartTotal: 0 });
    expect(body.du < body.au).toBe(true);
  });
});
