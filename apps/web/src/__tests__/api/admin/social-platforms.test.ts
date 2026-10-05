/**
 * @jest-environment node
 *
 * Admin social (s15 cycle 3) : interrupteur Pause / Reprise par réseau et
 * rapport « prévu contre publié ». Auth Bearer ADMIN_PASSWORD, zod, reprise
 * refusée tant que le canal Buffer est en panne.
 */
const settings: Array<Record<string, unknown>> = [];
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
      findMany: async () => [],
      update: async () => ({}),
    },
  },
}));
let channels: Array<Record<string, unknown>> = [];
jest.mock("@/lib/social/buffer-client", () => ({
  isBufferConfigured: () => true,
  getBufferChannels: async () => channels,
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
