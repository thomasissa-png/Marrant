/**
 * @jest-environment node
 *
 * Phase 5.D — Groupe 6 P2 admin : POST /api/admin/ceo/contest
 *
 * Particularité : utilise prisma.$transaction([...]).
 * On l'inline dans le mock factory.
 */

jest.mock("@/lib/prisma", () => {
  const baseMock = jest
    .requireActual("@/__tests__/helpers/ceo-prisma-mock")
    .createCeoPrismaMock();
  // Ajout updateMany manquant + $transaction
  return {
    prisma: {
      ...baseMock,
      ceoTask: { ...baseMock.ceoTask, updateMany: jest.fn() },
      $transaction: jest.fn(),
    },
  };
});

const { prisma: mockPrisma } = jest.requireMock("@/lib/prisma") as {
  prisma: ReturnType<
    typeof import("@/__tests__/helpers/ceo-prisma-mock").createCeoPrismaMock
  > & {
    ceoTask: { updateMany: jest.Mock } & ReturnType<
      typeof import("@/__tests__/helpers/ceo-prisma-mock").createCeoPrismaMock
    >["ceoTask"];
    $transaction: jest.Mock;
  };
};

function makeReq(body: unknown, auth?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) headers.authorization = auth;
  return new Request("https://example.com/api/admin/ceo/contest", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

describe("POST /api/admin/ceo/contest", () => {
  const ORIGINAL_PASS = process.env.ADMIN_PASSWORD;
  let POST: (req: Request) => Promise<Response>;

  beforeAll(async () => {
    process.env.ADMIN_PASSWORD = "test-admin-pass";
    const mod = await import("@/app/api/admin/ceo/contest/route");
    POST = mod.POST as unknown as typeof POST;
  });

  afterAll(() => {
    if (ORIGINAL_PASS === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = ORIGINAL_PASS;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("401 sans Bearer", async () => {
    const res = await POST(makeReq({ messageId: "m-1" }));
    expect(res.status).toBe(401);
  });

  it("401 mauvais password", async () => {
    const res = await POST(makeReq({ messageId: "m-1" }, "Bearer wrong"));
    expect(res.status).toBe(401);
  });

  it("400 body invalide (pas de messageId)", async () => {
    const res = await POST(makeReq({}, "Bearer test-admin-pass"));
    expect(res.status).toBe(400);
  });

  it("404 si message introuvable", async () => {
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce(null);
    const res = await POST(makeReq({ messageId: "nope" }, "Bearer test-admin-pass"));
    expect(res.status).toBe(404);
  });

  it("200 succès : transaction REJECTED + audit task_contested + updateMany task source", async () => {
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce({
      id: "msg-1",
      recipient: "lead@x.fr",
      channel: "EMAIL",
    });

    // $transaction reçoit un array de 3 promesses Prisma — on retourne un array
    // de réponses dans le même ordre.
    mockPrisma.$transaction.mockResolvedValueOnce([
      { id: "msg-1", status: "REJECTED" },
      { id: "log-1" },
      { count: 1 },
    ]);

    const res = await POST(makeReq({ messageId: "msg-1" }, "Bearer test-admin-pass"));
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.message).toEqual({ id: "msg-1", status: "REJECTED" });

    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
    // L'array passé à $transaction doit avoir 3 éléments (update, audit.create, task.updateMany)
    const txCall = mockPrisma.$transaction.mock.calls[0][0];
    expect(Array.isArray(txCall)).toBe(true);
    expect(txCall).toHaveLength(3);
  });

  it("audit log mentionne RGPD art. 22 dans la raison", async () => {
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce({
      id: "msg-2",
      recipient: "lead@x.fr",
      channel: "EMAIL",
    });

    // On capture les arguments individuels passés aux mocks Prisma via les calls.
    // Comme la route appelle update/create/updateMany INSIDE le transaction array,
    // ils sont enregistrés dans leurs mocks respectifs.
    mockPrisma.ceoOutboundMessage.update.mockReturnValue({});
    mockPrisma.ceoAuditLog.create.mockReturnValue({});
    mockPrisma.ceoTask.updateMany.mockReturnValue({});
    mockPrisma.$transaction.mockResolvedValueOnce([
      { id: "msg-2", status: "REJECTED" },
      { id: "log-2" },
      { count: 0 },
    ]);

    await POST(makeReq({ messageId: "msg-2" }, "Bearer test-admin-pass"));

    const auditCall = mockPrisma.ceoAuditLog.create.mock.calls[0][0];
    expect(auditCall.data.action).toBe("task_contested");
    expect(auditCall.data.outcome).toBe("rejected");
    expect(auditCall.data.reasoning).toMatch(/art\. 22 RGPD/i);
    expect(auditCall.data.contestedAt).toBeInstanceOf(Date);
  });

  it("update outbound : status REJECTED + directorNote avec timestamp ISO", async () => {
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce({
      id: "msg-3",
      recipient: "lead@x.fr",
      channel: "DM",
    });
    mockPrisma.ceoOutboundMessage.update.mockReturnValue({});
    mockPrisma.ceoAuditLog.create.mockReturnValue({});
    mockPrisma.ceoTask.updateMany.mockReturnValue({});
    mockPrisma.$transaction.mockResolvedValueOnce([
      { id: "msg-3", status: "REJECTED" },
      {},
      {},
    ]);

    await POST(makeReq({ messageId: "msg-3" }, "Bearer test-admin-pass"));

    const updateCall = mockPrisma.ceoOutboundMessage.update.mock.calls[0][0];
    expect(updateCall.data.status).toBe("REJECTED");
    expect(updateCall.data.directorNote).toMatch(/Contestation admin/i);
    expect(updateCall.data.directorNote).toMatch(/\d{4}-\d{2}-\d{2}T/);
  });

  it("updateMany ceoTask filtre par result.path messageId", async () => {
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce({
      id: "msg-4",
      recipient: "lead@x.fr",
      channel: "EMAIL",
    });
    mockPrisma.ceoOutboundMessage.update.mockReturnValue({});
    mockPrisma.ceoAuditLog.create.mockReturnValue({});
    mockPrisma.ceoTask.updateMany.mockReturnValue({});
    mockPrisma.$transaction.mockResolvedValueOnce([{ id: "msg-4", status: "REJECTED" }, {}, {}]);

    await POST(makeReq({ messageId: "msg-4" }, "Bearer test-admin-pass"));

    const updateManyCall = mockPrisma.ceoTask.updateMany.mock.calls[0][0];
    expect(updateManyCall.where.result).toEqual({
      path: ["messageId"],
      equals: "msg-4",
    });
    expect(updateManyCall.data.contestedAt).toBeInstanceOf(Date);
  });
});
