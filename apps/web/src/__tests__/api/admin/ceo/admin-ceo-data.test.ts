/**
 * @jest-environment node
 *
 * Phase 5.D — Groupe 6 P2 admin : GET /api/admin/ceo/data
 *
 * Couvre l'agrégat dashboard : config, KPIs, tasks, drafts, funnel, backlinks, audit.
 * Le test cible la transformation DTO + masking PII + safeRate division par zéro.
 */

jest.mock("@/lib/prisma", () => ({
  prisma: jest.requireActual("@/__tests__/helpers/ceo-prisma-mock").createCeoPrismaMock(),
}));

import { getCeoPrismaMock, resetCeoPrismaMock } from "@/__tests__/helpers/ceo-prisma-mock";

const mockPrisma = getCeoPrismaMock();

function makeReq(auth?: string) {
  const headers: Record<string, string> = {};
  if (auth) headers.authorization = auth;
  return new Request("https://example.com/api/admin/ceo/data", {
    method: "GET",
    headers,
  });
}

// Setup minimal pour que Promise.all ne crash pas (10 calls).
function setupAllMocks(opts: {
  config?: unknown;
  lastSnapshot?: unknown;
  kpiHistory?: unknown[];
  tasks?: unknown[];
  drafts?: unknown[];
  funnelAgg?: { _count: { _all: number }; _sum: { opens: number | null; replies: number | null; clicks: number | null } };
  conversionsCount?: number;
  siteVisits?: number;
  backlinks?: unknown[];
  auditLog?: unknown[];
} = {}) {
  mockPrisma.ceoConfig.findFirst.mockResolvedValueOnce(opts.config ?? null);
  // findFirst sur ceoKpiSnapshot n'existe pas en helper — ajout dynamique en beforeAll.
  (mockPrisma.ceoKpiSnapshot as unknown as { findFirst: jest.Mock }).findFirst.mockResolvedValueOnce(
    opts.lastSnapshot ?? null,
  );
  mockPrisma.ceoKpiSnapshot.findMany.mockResolvedValueOnce(opts.kpiHistory ?? []);
  mockPrisma.ceoTask.findMany.mockResolvedValueOnce(opts.tasks ?? []);
  mockPrisma.ceoOutboundMessage.findMany.mockResolvedValueOnce(opts.drafts ?? []);
  mockPrisma.ceoOutboundMessage.aggregate.mockResolvedValueOnce(
    opts.funnelAgg ?? {
      _count: { _all: 0 },
      _sum: { opens: 0, replies: 0, clicks: 0 },
    },
  );
  mockPrisma.ceoOutboundMessage.count.mockResolvedValueOnce(opts.conversionsCount ?? 0);
  // ceoLead.count est ajouté dynamiquement (pas dans le helper de base)
  (mockPrisma.ceoLead as unknown as { count: jest.Mock }).count.mockResolvedValueOnce(
    opts.siteVisits ?? 0,
  );
  mockPrisma.ceoBacklink.findMany.mockResolvedValueOnce(opts.backlinks ?? []);
  mockPrisma.ceoAuditLog.findMany.mockResolvedValueOnce(opts.auditLog ?? []);
}

beforeAll(() => {
  // Extensions dynamiques (non présentes dans le helper de base) :
  // - ceoKpiSnapshot.findFirst (la route data l'utilise)
  // - ceoLead.count (la route data l'utilise pour siteVisits 48h)
  (mockPrisma.ceoKpiSnapshot as unknown as { findFirst: jest.Mock }).findFirst = jest.fn();
  (mockPrisma.ceoLead as unknown as { count: jest.Mock }).count = jest.fn();
});

describe("GET /api/admin/ceo/data", () => {
  const ORIGINAL_PASS = process.env.ADMIN_PASSWORD;
  let GET: (req: Request) => Promise<Response>;

  beforeAll(async () => {
    process.env.ADMIN_PASSWORD = "test-admin-pass";
    const mod = await import("@/app/api/admin/ceo/data/route");
    GET = mod.GET as unknown as typeof GET;
  });

  afterAll(() => {
    if (ORIGINAL_PASS === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = ORIGINAL_PASS;
  });

  beforeEach(() => {
    resetCeoPrismaMock(mockPrisma);
    (mockPrisma.ceoKpiSnapshot as unknown as { findFirst: jest.Mock }).findFirst.mockReset();
    (mockPrisma.ceoLead as unknown as { count: jest.Mock }).count.mockReset();
  });

  it("401 sans Bearer", async () => {
    const res = await GET(makeReq());
    expect(res.status).toBe(401);
  });

  it("401 mauvais password", async () => {
    const res = await GET(makeReq("Bearer wrong"));
    expect(res.status).toBe(401);
  });

  it("200 état initial vide : tous tableaux vides + funnel à zéro", async () => {
    setupAllMocks();
    const res = await GET(makeReq("Bearer test-admin-pass"));
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.config).toBeNull();
    expect(json.lastSnapshot).toBeNull();
    expect(json.kpiHistory).toEqual([]);
    expect(json.tasks).toEqual([]);
    expect(json.drafts).toEqual([]);
    expect(json.backlinks).toEqual([]);
    expect(json.auditLog).toEqual([]);
    expect(json.funnel).toEqual({
      sent: 0,
      opens: 0,
      replies: 0,
      clicks: 0,
      siteVisits: 0,
      conversions: 0,
      openRate: 0,
      replyRate: 0,
      clickRate: 0,
      visitRate: 0,
      conversionRate: 0,
    });
    expect(json.budgetSpentToday).toBe(0);
    expect(json.lastTickAt).toBeNull();
    expect(json.nextTickAt).toBeNull();
  });

  it("calcule funnel rates correctement (sent=100, opens=40 → openRate=0.4)", async () => {
    setupAllMocks({
      funnelAgg: {
        _count: { _all: 100 },
        _sum: { opens: 40, replies: 5, clicks: 12 },
      },
      conversionsCount: 3,
      siteVisits: 25,
    });

    const res = await GET(makeReq("Bearer test-admin-pass"));
    const json = await res.json();

    expect(json.funnel.sent).toBe(100);
    expect(json.funnel.opens).toBe(40);
    expect(json.funnel.openRate).toBe(0.4);
    expect(json.funnel.replyRate).toBe(0.05);
    expect(json.funnel.clickRate).toBe(0.12);
    expect(json.funnel.visitRate).toBe(0.25);
    expect(json.funnel.conversionRate).toBe(0.03);
    expect(json.funnel.siteVisits).toBe(25);
    expect(json.funnel.conversions).toBe(3);
  });

  it("safeRate retourne 0 si sent=0 (pas de NaN)", async () => {
    setupAllMocks({
      funnelAgg: {
        _count: { _all: 0 },
        _sum: { opens: null, replies: null, clicks: null },
      },
    });
    const res = await GET(makeReq("Bearer test-admin-pass"));
    const json = await res.json();
    expect(json.funnel.openRate).toBe(0);
    expect(json.funnel.conversionRate).toBe(0);
  });

  it("masque le recipient des drafts (PII)", async () => {
    setupAllMocks({
      drafts: [
        {
          id: "msg-1",
          channel: "EMAIL",
          recipient: "yanis.bargach@example.com",
          subject: null,
          content: "x",
          status: "PENDING",
          directorScore: 8,
          directorValidated: true,
          directorNote: null,
          requiresHumanReview: false,
          playbook: null,
          createdAt: new Date(),
        },
        {
          id: "msg-2",
          channel: "DM",
          recipient: "yanis_handle",
          subject: null,
          content: "x",
          status: "PENDING",
          directorScore: 7,
          directorValidated: true,
          directorNote: null,
          requiresHumanReview: false,
          playbook: null,
          createdAt: new Date(),
        },
      ],
    });

    const res = await GET(makeReq("Bearer test-admin-pass"));
    const json = await res.json();

    expect(json.drafts).toHaveLength(2);
    expect(json.drafts[0].recipient).toBe("ya***@example.com");
    expect(json.drafts[0].recipient).not.toContain("yanis.bargach");
    expect(json.drafts[1].recipient).toBe("yan***");
  });

  it("transforme tasks avec payloadSummary lisible (priorise leadId)", async () => {
    setupAllMocks({
      tasks: [
        {
          id: "t-1",
          type: "send_email",
          status: "PENDING",
          scheduledFor: new Date(),
          attempts: 0,
          errorMessage: null,
          createdAt: new Date(),
          startedAt: null,
          completedAt: null,
          payload: { leadId: "lead-abc-123", extra: "ignored" },
        },
        {
          id: "t-2",
          type: "noop",
          status: "DONE",
          scheduledFor: new Date(),
          attempts: 1,
          errorMessage: null,
          createdAt: new Date(),
          startedAt: new Date(),
          completedAt: new Date(),
          payload: null,
        },
      ],
    });

    const res = await GET(makeReq("Bearer test-admin-pass"));
    const json = await res.json();

    expect(json.tasks[0].payloadSummary).toBe("leadId: lead-abc-123");
    expect(json.tasks[1].payloadSummary).toBe("—");
  });

  it("calcule daysSincePitched pour les backlinks", async () => {
    const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
    setupAllMocks({
      backlinks: [
        {
          id: "bl-1",
          source: "search",
          domain: "example.com",
          url: "https://example.com/post",
          pageTitle: "Test",
          da: 50,
          status: "PITCHED",
          pitchedAt: eightDaysAgo,
          repliedAt: null,
          acquiredAt: null,
        },
      ],
    });

    const res = await GET(makeReq("Bearer test-admin-pass"));
    const json = await res.json();

    expect(json.backlinks[0].daysSincePitched).toBeGreaterThanOrEqual(7);
    expect(json.backlinks[0].daysSincePitched).toBeLessThanOrEqual(8);
  });

  it("nextTickAt = lastTickAt + 4h", async () => {
    const baseDate = new Date("2026-05-07T08:00:00.000Z");
    setupAllMocks({
      lastSnapshot: {
        id: "kpi-1",
        date: baseDate,
        northStarEngagement30d: 0.4,
        emailReplyRate: 0.1,
        siteReturn48h: 0.25,
        emailOpenRate: 0.5,
        killSwitchTriggers24h: 0,
        directorFailRate: 0.05,
        draftsAutoSendRatio: {},
        costPerAcquiredSubscriber: null,
        ceoAttributedConversions: 0,
        backlinksDaSum: 0,
        createdAt: baseDate,
      },
    });

    const res = await GET(makeReq("Bearer test-admin-pass"));
    const json = await res.json();

    expect(json.lastTickAt).toBe(baseDate.toISOString());
    const nextTickAt = new Date(json.nextTickAt);
    const lastTickAt = new Date(json.lastTickAt);
    expect(nextTickAt.getTime() - lastTickAt.getTime()).toBe(4 * 60 * 60 * 1000);
  });

  it("transforme auditLog en DTO sérialisable (timestamp ISO)", async () => {
    const now = new Date();
    setupAllMocks({
      auditLog: [
        {
          id: "log-1",
          timestamp: now,
          action: "message_approved",
          targetType: "outbound_message",
          channel: "EMAIL",
          outcome: "sent",
          reasoning: "Test reasoning",
          aiDecisionScore: 8,
          aiModel: "claude-sonnet-4-5",
        },
      ],
    });

    const res = await GET(makeReq("Bearer test-admin-pass"));
    const json = await res.json();

    expect(json.auditLog[0]).toEqual({
      id: "log-1",
      timestamp: now.toISOString(),
      action: "message_approved",
      targetType: "outbound_message",
      channel: "EMAIL",
      outcome: "sent",
      reasoning: "Test reasoning",
      aiDecisionScore: 8,
      aiModel: "claude-sonnet-4-5",
    });
  });
});
