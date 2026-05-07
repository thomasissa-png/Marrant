/**
 * @jest-environment node
 *
 * Phase 5.D — Groupe 6 P2 admin : POST /api/admin/ceo/kill-switch
 */

jest.mock("@/lib/prisma", () => ({
  prisma: jest.requireActual("@/__tests__/helpers/ceo-prisma-mock").createCeoPrismaMock(),
}));

import { getCeoPrismaMock, resetCeoPrismaMock } from "@/__tests__/helpers/ceo-prisma-mock";

const mockPrisma = getCeoPrismaMock();

function makeReq(body: unknown, auth?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) headers.authorization = auth;
  return new Request("https://example.com/api/admin/ceo/kill-switch", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

// Le helper de base n'a pas ceoConfig.create — on l'ajoute inline si nécessaire.
beforeAll(() => {
  // @ts-expect-error — extension dynamique pour ce test
  mockPrisma.ceoConfig.create = jest.fn();
});

describe("POST /api/admin/ceo/kill-switch", () => {
  const ORIGINAL_PASS = process.env.ADMIN_PASSWORD;
  let POST: (req: Request) => Promise<Response>;

  beforeAll(async () => {
    process.env.ADMIN_PASSWORD = "test-admin-pass";
    const mod = await import("@/app/api/admin/ceo/kill-switch/route");
    POST = mod.POST as unknown as typeof POST;
  });

  afterAll(() => {
    if (ORIGINAL_PASS === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = ORIGINAL_PASS;
  });

  beforeEach(() => {
    resetCeoPrismaMock(mockPrisma);
    // @ts-expect-error — extension dynamique
    mockPrisma.ceoConfig.create.mockReset();
  });

  it("401 sans Bearer", async () => {
    const res = await POST(makeReq({ enabled: false, reason: "Test" }));
    expect(res.status).toBe(401);
  });

  it("401 mauvais password", async () => {
    const res = await POST(makeReq({ enabled: false, reason: "Test" }, "Bearer wrong"));
    expect(res.status).toBe(401);
  });

  it("400 body sans enabled", async () => {
    const res = await POST(makeReq({}, "Bearer test-admin-pass"));
    expect(res.status).toBe(400);
  });

  it("400 désactivation sans raison (raison obligatoire)", async () => {
    const res = await POST(makeReq({ enabled: false }, "Bearer test-admin-pass"));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/raison.*obligatoire/i);
  });

  it("200 réactivation sans raison (raison non requise pour enabled=true)", async () => {
    mockPrisma.ceoConfig.findFirst.mockResolvedValueOnce({ id: "cfg-1" });
    mockPrisma.ceoConfig.update.mockResolvedValueOnce({
      id: "cfg-1",
      enabled: true,
      killSwitchReason: null,
      updatedAt: new Date(),
    });
    mockPrisma.ceoAuditLog.create.mockResolvedValueOnce({ id: "log-1" });

    const res = await POST(makeReq({ enabled: true }, "Bearer test-admin-pass"));
    expect(res.status).toBe(200);

    const updateCall = mockPrisma.ceoConfig.update.mock.calls[0][0];
    expect(updateCall.data).toEqual({
      enabled: true,
      killSwitchReason: null,
    });
  });

  it("200 désactivation avec raison : update existing config + audit kill_switch_triggered", async () => {
    mockPrisma.ceoConfig.findFirst.mockResolvedValueOnce({ id: "cfg-1" });
    mockPrisma.ceoConfig.update.mockResolvedValueOnce({
      id: "cfg-1",
      enabled: false,
      killSwitchReason: "Budget dépassé",
      updatedAt: new Date(),
    });
    mockPrisma.ceoAuditLog.create.mockResolvedValueOnce({ id: "log-2" });

    const res = await POST(
      makeReq({ enabled: false, reason: "Budget dépassé" }, "Bearer test-admin-pass"),
    );
    expect(res.status).toBe(200);

    const auditCall = mockPrisma.ceoAuditLog.create.mock.calls[0][0];
    expect(auditCall.data.action).toBe("kill_switch_triggered");
    expect(auditCall.data.targetType).toBe("config");
    expect(auditCall.data.reasoning).toBe("Budget dépassé");
  });

  it("200 réactivation avec config existante : audit kill_switch_disabled", async () => {
    mockPrisma.ceoConfig.findFirst.mockResolvedValueOnce({ id: "cfg-1" });
    mockPrisma.ceoConfig.update.mockResolvedValueOnce({
      id: "cfg-1",
      enabled: true,
      killSwitchReason: null,
      updatedAt: new Date(),
    });
    mockPrisma.ceoAuditLog.create.mockResolvedValueOnce({ id: "log-3" });

    const res = await POST(makeReq({ enabled: true }, "Bearer test-admin-pass"));
    expect(res.status).toBe(200);

    const auditCall = mockPrisma.ceoAuditLog.create.mock.calls[0][0];
    expect(auditCall.data.action).toBe("kill_switch_disabled");
  });

  it("200 sans config existante : create nouvelle config", async () => {
    mockPrisma.ceoConfig.findFirst.mockResolvedValueOnce(null);
    // @ts-expect-error — extension
    mockPrisma.ceoConfig.create.mockResolvedValueOnce({
      id: "cfg-new",
      enabled: false,
      killSwitchReason: "Init kill",
      updatedAt: new Date(),
    });
    mockPrisma.ceoAuditLog.create.mockResolvedValueOnce({ id: "log-4" });

    const res = await POST(
      makeReq({ enabled: false, reason: "Init kill" }, "Bearer test-admin-pass"),
    );
    expect(res.status).toBe(200);

    // @ts-expect-error
    expect(mockPrisma.ceoConfig.create).toHaveBeenCalledWith({
      data: { enabled: false, killSwitchReason: "Init kill" },
    });
    expect(mockPrisma.ceoConfig.update).not.toHaveBeenCalled();
  });

  it("400 raison > 500 chars", async () => {
    const res = await POST(
      makeReq({ enabled: false, reason: "x".repeat(501) }, "Bearer test-admin-pass"),
    );
    expect(res.status).toBe(400);
  });
});
