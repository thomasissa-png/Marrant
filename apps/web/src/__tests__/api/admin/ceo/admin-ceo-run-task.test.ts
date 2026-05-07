/**
 * @jest-environment node
 *
 * Phase 5.D — Groupe 6 P2 admin : POST /api/admin/ceo/run-task
 */

jest.mock("@/lib/prisma", () => ({
  prisma: jest.requireActual("@/__tests__/helpers/ceo-prisma-mock").createCeoPrismaMock(),
}));

import { getCeoPrismaMock, resetCeoPrismaMock } from "@/__tests__/helpers/ceo-prisma-mock";

const mockPrisma = getCeoPrismaMock();

function makeReq(body: unknown, auth?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) headers.authorization = auth;
  return new Request("https://example.com/api/admin/ceo/run-task", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

describe("POST /api/admin/ceo/run-task", () => {
  const ORIGINAL_PASS = process.env.ADMIN_PASSWORD;
  let POST: (req: Request) => Promise<Response>;

  beforeAll(async () => {
    process.env.ADMIN_PASSWORD = "test-admin-pass";
    const mod = await import("@/app/api/admin/ceo/run-task/route");
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
    const res = await POST(makeReq({ taskId: "t-1" }));
    expect(res.status).toBe(401);
  });

  it("401 mauvais password", async () => {
    const res = await POST(makeReq({ taskId: "t-1" }, "Bearer wrong"));
    expect(res.status).toBe(401);
  });

  it("400 sans taskId", async () => {
    const res = await POST(makeReq({}, "Bearer test-admin-pass"));
    expect(res.status).toBe(400);
  });

  it("400 taskId vide", async () => {
    const res = await POST(makeReq({ taskId: "" }, "Bearer test-admin-pass"));
    expect(res.status).toBe(400);
  });

  it("404 si tâche introuvable", async () => {
    mockPrisma.ceoTask.findUnique.mockResolvedValueOnce(null);
    const res = await POST(makeReq({ taskId: "nope" }, "Bearer test-admin-pass"));
    expect(res.status).toBe(404);
  });

  it("200 PENDING : reset scheduledFor=now() + status PENDING + attempts conservés", async () => {
    mockPrisma.ceoTask.findUnique.mockResolvedValueOnce({
      id: "t-1",
      type: "send_email",
      status: "PENDING",
      attempts: 1,
    });

    const updatedDate = new Date();
    mockPrisma.ceoTask.update.mockResolvedValueOnce({
      id: "t-1",
      type: "send_email",
      status: "PENDING",
      attempts: 1,
      scheduledFor: updatedDate,
    });
    mockPrisma.ceoAuditLog.create.mockResolvedValueOnce({ id: "log-1" });

    const res = await POST(makeReq({ taskId: "t-1" }, "Bearer test-admin-pass"));
    expect(res.status).toBe(200);

    const updateCall = mockPrisma.ceoTask.update.mock.calls[0][0];
    expect(updateCall.where).toEqual({ id: "t-1" });
    expect(updateCall.data.status).toBe("PENDING");
    expect(updateCall.data.scheduledFor).toBeInstanceOf(Date);
    expect(updateCall.data.attempts).toBe(1); // conservés (PENDING != FAILED)
    expect(updateCall.data.errorMessage).toBeNull();
  });

  it("200 FAILED : reset attempts à 0 pour relance", async () => {
    mockPrisma.ceoTask.findUnique.mockResolvedValueOnce({
      id: "t-2",
      type: "process_lead",
      status: "FAILED",
      attempts: 3,
    });
    mockPrisma.ceoTask.update.mockResolvedValueOnce({
      id: "t-2",
      type: "process_lead",
      status: "PENDING",
      attempts: 0,
      scheduledFor: new Date(),
    });
    mockPrisma.ceoAuditLog.create.mockResolvedValueOnce({ id: "log-2" });

    await POST(makeReq({ taskId: "t-2" }, "Bearer test-admin-pass"));

    const updateCall = mockPrisma.ceoTask.update.mock.calls[0][0];
    expect(updateCall.data.attempts).toBe(0);
  });

  it("audit log : action task_force_run + targetType task + raison contient le type", async () => {
    mockPrisma.ceoTask.findUnique.mockResolvedValueOnce({
      id: "t-3",
      type: "send_dm",
      status: "PENDING",
      attempts: 0,
    });
    mockPrisma.ceoTask.update.mockResolvedValueOnce({
      id: "t-3",
      type: "send_dm",
      status: "PENDING",
      attempts: 0,
      scheduledFor: new Date(),
    });
    mockPrisma.ceoAuditLog.create.mockResolvedValueOnce({ id: "log-3" });

    await POST(makeReq({ taskId: "t-3" }, "Bearer test-admin-pass"));

    const auditCall = mockPrisma.ceoAuditLog.create.mock.calls[0][0];
    expect(auditCall.data.action).toBe("task_force_run");
    expect(auditCall.data.targetType).toBe("task");
    expect(auditCall.data.channel).toBe("admin");
    expect(auditCall.data.reasoning).toContain("send_dm");
    expect(auditCall.data.targetIdHashed).toMatch(/^[a-f0-9]{64}$/);
  });

  it("response sérialise scheduledFor en ISO string", async () => {
    const date = new Date("2026-05-07T12:00:00.000Z");
    mockPrisma.ceoTask.findUnique.mockResolvedValueOnce({
      id: "t-4",
      type: "noop",
      status: "PENDING",
      attempts: 0,
    });
    mockPrisma.ceoTask.update.mockResolvedValueOnce({
      id: "t-4",
      type: "noop",
      status: "PENDING",
      attempts: 0,
      scheduledFor: date,
    });
    mockPrisma.ceoAuditLog.create.mockResolvedValueOnce({});

    const res = await POST(makeReq({ taskId: "t-4" }, "Bearer test-admin-pass"));
    const json = await res.json();
    expect(json.task.scheduledFor).toBe(date.toISOString());
  });
});
