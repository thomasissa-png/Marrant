/**
 * @jest-environment node
 *
 * s21 concision (choix de Thomas du 18/10) : PATCH /api/user enregistre le prénom
 * renseigné après coup dans /profil (session, même site, zod). Colonne déjà nullable.
 */
const mockDb = { user: { update: jest.fn() } };
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return mockDb;
  },
}));
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));

import { PATCH } from "@/app/api/user/route";
import { salutation } from "@/lib/emails/annual-renewal-reminder";
import { renderPasswordResetEmail } from "@/lib/email";
import { emailConfirmationAbonnement } from "@/config/textes/paiement";

function patch(body: unknown, origin = "https://deviens-marrant.fr") {
  return new Request("https://deviens-marrant.fr/api/user", {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json", origin },
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  process.env.NEXTAUTH_URL = "https://deviens-marrant.fr";
  getServerSession.mockResolvedValue({ user: { id: "u1" } });
  mockDb.user.update.mockImplementation(async ({ data }: { data: { name: string | null } }) => ({ name: data.name }));
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

describe("PATCH /api/user (prénom)", () => {
  it("enregistre le prénom nettoyé du compte connecté", async () => {
    const res = await PATCH(patch({ name: "  Marie   Hélène " }));
    expect(res.status).toBe(200);
    expect(mockDb.user.update).toHaveBeenCalledWith({ where: { id: "u1" }, data: { name: "Marie Hélène" }, select: { name: true } });
    expect(await res.json()).toEqual({ name: "Marie Hélène" });
  });

  it("vide : le prénom est effacé (null en base)", async () => {
    const res = await PATCH(patch({ name: "   " }));
    expect(res.status).toBe(200);
    expect(mockDb.user.update.mock.calls[0][0].data).toEqual({ name: null });
  });

  it("un seul caractère ou trop long : 400, rien en base", async () => {
    expect((await PATCH(patch({ name: "A" }))).status).toBe(400);
    expect((await PATCH(patch({ name: "x".repeat(41) }))).status).toBe(400);
    expect((await PATCH(patch({}))).status).toBe(400);
    expect(mockDb.user.update).not.toHaveBeenCalled();
  });

  it("sans session : 401 ; autre site : 403", async () => {
    getServerSession.mockResolvedValueOnce(null);
    expect((await PATCH(patch({ name: "Jean" }))).status).toBe(401);
    expect((await PATCH(patch({ name: "Jean" }, "https://evil.example"))).status).toBe(403);
    expect(mockDb.user.update).not.toHaveBeenCalled();
  });
});

describe("Repli sans prénom des e-mails", () => {
  it("« Salut, » quand le compte n'a pas de prénom", () => {
    expect(salutation(null)).toBe("Salut,");
    expect(renderPasswordResetEmail("https://deviens-marrant.fr/reset", null).html).toContain("Salut,");
    const confirmation = emailConfirmationAbonnement({
      prenom: null,
      interval: "month",
      montantCents: 299,
      dateSouscription: new Date("2026-10-18T10:00:00Z"),
      prochainRenouvellement: null,
    });
    expect(confirmation.text.startsWith("Salut,")).toBe(true);
  });
});
