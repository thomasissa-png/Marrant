/**
 * @jest-environment node
 *
 * Phase 5.D — Groupe 6 P2 admin : POST /api/admin/ceo/approve
 *
 * Couvre :
 *  - 401 sans Bearer / mauvais password
 *  - 400 body invalide
 *  - 404 message introuvable
 *  - 200 succès : update status APPROVED + audit log
 */

jest.mock("@/lib/prisma", () => ({
  prisma: jest.requireActual("@/__tests__/helpers/ceo-prisma-mock").createCeoPrismaMock(),
}));

import { getCeoPrismaMock, resetCeoPrismaMock } from "@/__tests__/helpers/ceo-prisma-mock";

const mockPrisma = getCeoPrismaMock();

function makeReq(body: unknown, auth?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) headers.authorization = auth;
  return new Request("https://example.com/api/admin/ceo/approve", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

describe("POST /api/admin/ceo/approve", () => {
  const ORIGINAL_PASS = process.env.ADMIN_PASSWORD;
  let POST: (req: Request) => Promise<Response>;

  beforeAll(async () => {
    process.env.ADMIN_PASSWORD = "test-admin-pass";
    const mod = await import("@/app/api/admin/ceo/approve/route");
    POST = mod.POST as unknown as typeof POST;
  });

  afterAll(() => {
    if (ORIGINAL_PASS === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = ORIGINAL_PASS;
  });

  beforeEach(() => {
    resetCeoPrismaMock(mockPrisma);
  });

  it("401 sans header Authorization", async () => {
    const res = await POST(makeReq({ messageId: "msg-1" }));
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toMatch(/autorisé/i);
  });

  it("401 avec mauvais password", async () => {
    const res = await POST(makeReq({ messageId: "msg-1" }, "Bearer wrong"));
    expect(res.status).toBe(401);
  });

  it("400 si body sans messageId", async () => {
    const res = await POST(makeReq({}, "Bearer test-admin-pass"));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/invalide/i);
  });

  it("400 si messageId vide", async () => {
    const res = await POST(makeReq({ messageId: "" }, "Bearer test-admin-pass"));
    expect(res.status).toBe(400);
  });

  it("404 si message introuvable", async () => {
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce(null);
    const res = await POST(makeReq({ messageId: "nope" }, "Bearer test-admin-pass"));
    expect(res.status).toBe(404);
  });

  it("200 avec update + audit log au succès", async () => {
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce({
      id: "msg-1",
      recipient: "lead@x.fr",
      channel: "EMAIL",
      playbook: "P1",
    });
    mockPrisma.ceoOutboundMessage.update.mockResolvedValueOnce({
      id: "msg-1",
      status: "APPROVED",
      requiresHumanReview: false,
    });
    mockPrisma.ceoAuditLog.create.mockResolvedValueOnce({ id: "log-1" });

    const res = await POST(makeReq({ messageId: "msg-1" }, "Bearer test-admin-pass"));
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.message).toEqual({
      id: "msg-1",
      status: "APPROVED",
      requiresHumanReview: false,
    });

    expect(mockPrisma.ceoOutboundMessage.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "msg-1" },
        data: { status: "APPROVED", requiresHumanReview: false },
      })
    );

    expect(mockPrisma.ceoAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "message_approved",
          targetType: "outbound_message",
          channel: "EMAIL",
          outcome: "sent",
        }),
      })
    );
  });

  it("hashe le recipient dans l'audit (PII pseudonymisée)", async () => {
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce({
      id: "msg-2",
      recipient: "user@example.com",
      channel: "EMAIL",
      playbook: null,
    });
    mockPrisma.ceoOutboundMessage.update.mockResolvedValueOnce({
      id: "msg-2",
      status: "APPROVED",
      requiresHumanReview: false,
    });
    mockPrisma.ceoAuditLog.create.mockResolvedValueOnce({ id: "log-2" });

    await POST(makeReq({ messageId: "msg-2" }, "Bearer test-admin-pass"));

    const auditCall = mockPrisma.ceoAuditLog.create.mock.calls[0][0];
    expect(auditCall.data.targetIdHashed).toMatch(/^[a-f0-9]{64}$/);
    expect(auditCall.data.targetIdHashed).not.toContain("user@example.com");
  });
});
