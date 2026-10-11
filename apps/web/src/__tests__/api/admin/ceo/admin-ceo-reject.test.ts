/**
 * @jest-environment node
 *
 * Phase 5.D — Groupe 6 P2 admin : POST /api/admin/ceo/reject
 */

jest.mock("@/lib/prisma", () => ({
  prisma: jest.requireActual("@/__tests__/helpers/ceo-prisma-mock").createCeoPrismaMock(),
}));

import { getCeoPrismaMock, resetCeoPrismaMock } from "@/__tests__/helpers/ceo-prisma-mock";

const mockPrisma = getCeoPrismaMock();

function makeReq(body: unknown, auth?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) headers.authorization = auth;
  return new Request("https://example.com/api/admin/ceo/reject", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

describe("POST /api/admin/ceo/reject", () => {
  const ORIGINAL_PASS = process.env.ADMIN_PASSWORD;
  let POST: (req: Request) => Promise<Response>;

  beforeAll(async () => {
    process.env.ADMIN_PASSWORD = "test-admin-pass";
    const mod = await import("@/app/api/admin/ceo/reject/route");
    POST = mod.POST as unknown as typeof POST;
  });

  afterAll(() => {
    if (ORIGINAL_PASS === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = ORIGINAL_PASS;
  });

  beforeEach(() => {
    resetCeoPrismaMock(mockPrisma);
  });

  it("401 sans Bearer", async () => {
    const res = await POST(makeReq({ messageId: "m-1", reason: "bof" }));
    expect(res.status).toBe(401);
  });

  it("401 mauvais password", async () => {
    const res = await POST(makeReq({ messageId: "m-1", reason: "bof" }, "Bearer wrong"));
    expect(res.status).toBe(401);
  });

  it("400 si raison manquante (obligatoire pour amélioration prompts)", async () => {
    const res = await POST(makeReq({ messageId: "m-1" }, "Bearer test-admin-pass"));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/raison/i);
  });

  it("400 si raison vide", async () => {
    const res = await POST(makeReq({ messageId: "m-1", reason: "" }, "Bearer test-admin-pass"));
    expect(res.status).toBe(400);
  });

  it("400 si raison > 500 chars", async () => {
    const res = await POST(
      makeReq({ messageId: "m-1", reason: "x".repeat(501) }, "Bearer test-admin-pass"),
    );
    expect(res.status).toBe(400);
  });

  it("404 si message introuvable", async () => {
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce(null);
    const res = await POST(
      makeReq({ messageId: "nope", reason: "Tonalité forcée" }, "Bearer test-admin-pass"),
    );
    expect(res.status).toBe(404);
  });

  it("200 succès : update REJECTED + raison concaténée à directorNote", async () => {
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce({
      id: "m-1",
      recipient: "lead@x.fr",
      channel: "EMAIL",
      directorNote: "Score 7/10",
    });
    mockPrisma.ceoOutboundMessage.update.mockResolvedValueOnce({
      id: "m-1",
      status: "REJECTED",
    });
    mockPrisma.ceoAuditLog.create.mockResolvedValueOnce({ id: "log-1" });

    const res = await POST(
      makeReq({ messageId: "m-1", reason: "Tonalité trop forcée" }, "Bearer test-admin-pass"),
    );
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.message.status).toBe("REJECTED");

    const updateCall = mockPrisma.ceoOutboundMessage.update.mock.calls[0][0];
    expect(updateCall.data.status).toBe("REJECTED");
    expect(updateCall.data.directorNote).toContain("Score 7/10");
    expect(updateCall.data.directorNote).toContain("Tonalité trop forcée");
  });

  it("200 succès : directorNote initial vide → raison seule", async () => {
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce({
      id: "m-2",
      recipient: "lead@x.fr",
      channel: "DM",
      directorNote: null,
    });
    mockPrisma.ceoOutboundMessage.update.mockResolvedValueOnce({
      id: "m-2",
      status: "REJECTED",
    });
    mockPrisma.ceoAuditLog.create.mockResolvedValueOnce({ id: "log-2" });

    await POST(
      makeReq({ messageId: "m-2", reason: "Mauvais ciblage" }, "Bearer test-admin-pass"),
    );

    const updateCall = mockPrisma.ceoOutboundMessage.update.mock.calls[0][0];
    expect(updateCall.data.directorNote).toMatch(/^Rejet admin : Mauvais ciblage$/);
  });

  it("audit log : action message_rejected, outcome rejected, raison tronquée 200 chars", async () => {
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce({
      id: "m-3",
      recipient: "x@y.fr",
      channel: "EMAIL",
      directorNote: null,
    });
    mockPrisma.ceoOutboundMessage.update.mockResolvedValueOnce({ id: "m-3", status: "REJECTED" });
    mockPrisma.ceoAuditLog.create.mockResolvedValueOnce({ id: "log-3" });

    const longReason = "y".repeat(300);
    await POST(
      makeReq({ messageId: "m-3", reason: longReason }, "Bearer test-admin-pass"),
    );

    const auditCall = mockPrisma.ceoAuditLog.create.mock.calls[0][0];
    expect(auditCall.data.action).toBe("message_rejected");
    expect(auditCall.data.outcome).toBe("rejected");
    expect(auditCall.data.reasoning.length).toBe(200);
  });
});
