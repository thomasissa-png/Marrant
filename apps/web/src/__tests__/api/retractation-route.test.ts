/**
 * @jest-environment node
 *
 * s16 (07/10/2026, reco 4) : POST /api/retractation. Validation, limitation
 * partagée (429 + Retry-After), enregistrement en base AVANT les e-mails,
 * e-mail à l'admin + accusé de réception au client, e-mail raté sans perte
 * de la demande. Base, limiteur et e-mails simulés.
 */
const prisma = {
  user: { findFirst: jest.fn() },
  retractationRequest: { create: jest.fn(), update: jest.fn() },
};
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return prisma;
  },
}));
const sharedRateLimit = jest.fn();
jest.mock("@/lib/rate-limit", () => ({
  sharedRateLimit: (...a: unknown[]) => sharedRateLimit(...a),
  getClientIp: () => "203.0.113.7",
  hashRateLimitKey: (k: string) => `hash(${k})`,
  retryAfterSeconds: () => 42,
}));
const trySend = jest.fn();
jest.mock("@/lib/email", () => ({
  ADMIN_EMAIL: "admin@deviens-marrant.fr",
  trySendTransactionalTextEmail: (...a: unknown[]) => trySend(...a),
}));

import { POST } from "@/app/api/retractation/route";
import { TEXTES_RETRACTATION_FORM } from "@/config/textes/paiement";

const CREATED = new Date("2026-10-07T12:00:00Z");

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/retractation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
  sharedRateLimit.mockResolvedValue({ allowed: true, remaining: 4, resetAt: 0 });
  prisma.user.findFirst.mockResolvedValue({ id: "user-1" });
  prisma.retractationRequest.create.mockResolvedValue({ id: "ckabcdefgh12345678", createdAt: CREATED });
  prisma.retractationRequest.update.mockResolvedValue({});
  trySend.mockResolvedValue(true);
});
afterEach(() => jest.restoreAllMocks());

describe("POST /api/retractation", () => {
  it("demande valide : enregistrée, e-mail admin + accusé client, référence renvoyée", async () => {
    const res = await post({ email: " Client@Exemple.FR ", dateAchat: "2026-10-01", motif: "Pas pour moi" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, reference: "R-12345678", ackSent: true });

    expect(prisma.retractationRequest.create).toHaveBeenCalledWith({
      data: {
        email: "client@exemple.fr",
        userId: "user-1",
        purchaseDate: new Date("2026-10-01T12:00:00Z"),
        motif: "Pas pour moi",
        ipHash: "hash(203.0.113.7)",
      },
      select: { id: true, createdAt: true },
    });
    const [admin, client] = trySend.mock.calls;
    expect(admin[0]).toBe("admin@deviens-marrant.fr");
    expect(admin[3]).toBe("retractation-admin");
    expect(admin[2]).toContain("compte trouvé");
    expect(client[0]).toBe("client@exemple.fr");
    expect(client[3]).toBe("retractation-accuse");
    expect(client[2]).toContain("R-12345678");
    expect(client[2]).toContain("L'Équipe Deviens Marrant");
    expect(client[2]).not.toMatch(/—/);
    // Enregistrement AVANT les envois
    expect(prisma.retractationRequest.create.mock.invocationCallOrder[0]).toBeLessThan(trySend.mock.invocationCallOrder[0]);
    expect(prisma.retractationRequest.update).toHaveBeenCalledWith({
      where: { id: "ckabcdefgh12345678" },
      data: { adminEmailedAt: expect.any(Date), ackEmailedAt: expect.any(Date) },
    });
  });

  it.each([
    [{ email: "pas-un-email", dateAchat: "2026-10-01" }],
    [{ email: "a@b.fr", dateAchat: "01/10/2026" }],
    [{ email: "a@b.fr", motif: "x".repeat(2001) }],
    ["pas du json"],
  ])("entrée invalide (%j) : 400, rien en base", async (body) => {
    const res = await post(body);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe(TEXTES_RETRACTATION_FORM.erreurValidation);
    expect(prisma.retractationRequest.create).not.toHaveBeenCalled();
  });

  it("date d'achat absente : acceptée (le droit ne dépend pas du formulaire)", async () => {
    const res = await post({ email: "a@b.fr" });
    expect(res.status).toBe(200);
    expect(prisma.retractationRequest.create.mock.calls[0][0].data.purchaseDate).toBeNull();
  });

  it("limite par IP atteinte : 429 + Retry-After, rien en base", async () => {
    sharedRateLimit.mockResolvedValueOnce({ allowed: false, remaining: 0, resetAt: 0 });
    const res = await post({ email: "a@b.fr", dateAchat: "2026-10-01" });
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("42");
    expect(sharedRateLimit).toHaveBeenCalledWith("retractation-ip", "203.0.113.7", { maxRequests: 5, windowMs: 3_600_000 });
    expect(prisma.retractationRequest.create).not.toHaveBeenCalled();
  });

  it("limite par e-mail atteinte (3 par jour) : 429", async () => {
    sharedRateLimit
      .mockResolvedValueOnce({ allowed: true, remaining: 4, resetAt: 0 })
      .mockResolvedValueOnce({ allowed: false, remaining: 0, resetAt: 0 });
    const res = await post({ email: "a@b.fr" });
    expect(res.status).toBe(429);
    expect(sharedRateLimit).toHaveBeenLastCalledWith("retractation-email", "a@b.fr", { maxRequests: 3, windowMs: 86_400_000 });
  });

  it("base indisponible : 500 avec le contact, aucun e-mail", async () => {
    prisma.retractationRequest.create.mockRejectedValue(new Error("db down"));
    const res = await post({ email: "a@b.fr" });
    expect(res.status).toBe(500);
    expect((await res.json()).error).toContain("contact@deviens-marrant.fr");
    expect(trySend).not.toHaveBeenCalled();
  });

  it("accusé client non parti : demande conservée, 200 avec ackSent=false", async () => {
    trySend.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
    const res = await post({ email: "a@b.fr" });
    expect(res.status).toBe(200);
    expect((await res.json()).ackSent).toBe(false);
    expect(prisma.retractationRequest.update).toHaveBeenCalledWith({
      where: { id: "ckabcdefgh12345678" },
      data: { adminEmailedAt: expect.any(Date) },
    });
  });

  it("aucun compte pour cet e-mail : demande quand même enregistrée, signalée à l'admin", async () => {
    prisma.user.findFirst.mockResolvedValue(null);
    const res = await post({ email: "inconnu@b.fr" });
    expect(res.status).toBe(200);
    expect(prisma.retractationRequest.create.mock.calls[0][0].data.userId).toBeNull();
    expect(trySend.mock.calls[0][2]).toContain("AUCUN compte");
  });

  it("lot G : délai calculé depuis la première souscription du compte (accusé conditionnel si dépassé)", async () => {
    prisma.user.findFirst.mockResolvedValue({ id: "user-1", name: "Camille", subscription: { createdAt: new Date("2026-01-05T10:00:00Z") } });
    await post({ email: "client@exemple.fr", dateAchat: "2026-10-01" });
    expect(prisma.user.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ select: { id: true, name: true, subscription: { select: { createdAt: true } } } }),
    );
    const [admin, client] = trySend.mock.calls;
    expect(admin[2]).toContain("Date limite de remboursement : 21 octobre 2026");
    expect(admin[2]).toContain("DÉPASSÉ d'après la première souscription (le 5 janvier 2026)");
    expect(client[2]).toContain("Si ta demande est faite dans les 14 jours qui suivent ta souscription");
    expect(client[2]).not.toMatch(/^On te rembourse/m);
  });

  it("lot G : souscription récente → remboursement promis", async () => {
    prisma.user.findFirst.mockResolvedValue({ id: "user-1", name: null, subscription: { createdAt: new Date("2026-10-01T10:00:00Z") } });
    await post({ email: "client@exemple.fr" });
    expect(trySend.mock.calls[1][2]).toMatch(/^On te rembourse sous 14 jours maximum/m);
  });
});
