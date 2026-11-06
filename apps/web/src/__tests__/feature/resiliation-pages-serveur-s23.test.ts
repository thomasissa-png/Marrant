/**
 * @jest-environment node
 *
 * Pages serveur /resiliation et /resiliation/confirmee (s23) : 404 interrupteur fermé, connexion
 * puis retour sur la page, page finale ouverte sans résiliation en cours = retour à /resiliation.
 */
jest.mock("@/config/resiliation", () => ({
  ...jest.requireActual("@/config/resiliation"),
  get RESILIATION_PAGE_OUVERTE() {
    return (globalThis as { __RESILIATION_OUVERTE__?: boolean }).__RESILIATION_OUVERTE__ === true;
  },
}));
jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  redirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT ${url}`);
  },
}));
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
const lire = jest.fn();
jest.mock("@/lib/resiliation", () => ({ lireResiliation: (...a: unknown[]) => lire(...a) }));

import ResiliationPage from "@/app/(dashboard)/resiliation/page";
import ConfirmeePage from "@/app/(dashboard)/resiliation/confirmee/page";

const drapeau = globalThis as { __RESILIATION_OUVERTE__?: boolean };
const donnees = { email: "y@x.fr", prenom: "Yanis", formule: "monthly", priceCents: 199, dateFin: "2026-12-01T10:00:00.000Z" };

beforeEach(() => {
  drapeau.__RESILIATION_OUVERTE__ = false;
  getServerSession.mockReset();
  lire.mockReset();
});

describe("interrupteur fermé : pages introuvables (parcours actuel inchangé)", () => {
  it("/resiliation et /resiliation/confirmee : 404, aucune lecture", async () => {
    getServerSession.mockResolvedValue({ user: { id: "u1" } });
    await expect(ResiliationPage()).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(ConfirmeePage()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(lire).not.toHaveBeenCalled();
  });
});

describe("interrupteur ouvert", () => {
  beforeEach(() => {
    drapeau.__RESILIATION_OUVERTE__ = true;
  });
  it("sans session : connexion puis retour sur /resiliation", async () => {
    getServerSession.mockResolvedValue(null);
    await expect(ResiliationPage()).rejects.toThrow("NEXT_REDIRECT /login?callbackUrl=%2Fresiliation");
  });
  it("page finale sans résiliation en cours : retour à /resiliation", async () => {
    getServerSession.mockResolvedValue({ user: { id: "u1" } });
    lire.mockResolvedValue({ etat: "a_resilier", ...donnees });
    await expect(ConfirmeePage()).rejects.toThrow("NEXT_REDIRECT /resiliation");
  });
  it("rendu : à résilier, déjà résilié, sans abonnement, lecture en échec", async () => {
    getServerSession.mockResolvedValue({ user: { id: "u1", email: "y@x.fr" } });
    for (const etat of ["a_resilier", "deja_resilie", "aucun"]) {
      lire.mockResolvedValue({ etat, ...donnees });
      await expect(ResiliationPage()).resolves.toBeTruthy();
    }
    lire.mockRejectedValue(new Error("base"));
    jest.spyOn(console, "warn").mockImplementation(() => {});
    await expect(ResiliationPage()).resolves.toBeTruthy();
    lire.mockResolvedValue({ etat: "deja_resilie", ...donnees });
    await expect(ConfirmeePage()).resolves.toBeTruthy();
  });
});
