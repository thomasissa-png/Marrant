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
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));
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

describe("v2 des revues (UX O1, design O3/O4)", () => {
  const { renderToStaticMarkup } = require("react-dom/server") as typeof import("react-dom/server");
  beforeEach(() => {
    drapeau.__RESILIATION_OUVERTE__ = true;
    getServerSession.mockResolvedValue({ user: { id: "u1", email: "y@x.fr" } });
  });

  it("page finale : ni « Merci d’avoir répondu. » ni ligne d'aide (aucune main tendue), respiration mt-2", async () => {
    lire.mockResolvedValue({ etat: "deja_resilie", ...donnees });
    const html = renderToStaticMarkup(await ConfirmeePage());
    expect(html).toContain("C’est noté.");
    expect(html).not.toContain("Merci d’avoir répondu.");
    expect(html).not.toMatch(/chaque parcours|Comment devenir drôle|quiz-humour|blague-du-jour/);
    expect(html).toMatch(/class="mt-2 text-sm text-text-secondary">Ensuite/);
  });

  it("boutons secondaires avec bordure visible border-border-input (sans border-border)", async () => {
    lire.mockResolvedValue({ etat: "deja_resilie", ...donnees });
    for (const page of [await ConfirmeePage(), await ResiliationPage()]) {
      const html = renderToStaticMarkup(page);
      const classes = html.match(/<a [^>]*class="([^"]*)"[^>]*>(Retour à l’accueil|Réactiver mon abonnement)/)?.[1] ?? "";
      expect(classes).toContain("border-border-input");
      expect(classes.split(" ")).not.toContain("border-border");
    }
  });

  it("accès sans abonnement Stripe : récapitulatif « à la fin de ton accès Premium », sans prélèvement", async () => {
    lire.mockResolvedValue({ etat: "a_resilier", ...donnees, dateFin: null, formule: null, sansAbonnementStripe: true, sansClientStripe: true });
    const page = await ResiliationPage();
    const html = renderToStaticMarkup(page);
    expect(html).toContain("à la fin de ton accès Premium");
    // Ni client ni abonnement Stripe : le formulaire reçoit l'indice App Store (détection dans l'appli).
    expect(JSON.stringify(page, (k, v) => (k === "_owner" ? undefined : v))).toContain('"appStorePossible":true');
    expect(html).not.toContain("Aucun nouveau prélèvement après.");
  });
});

describe("pas de loading.tsx sous /resiliation (UX O6 refusé sur preuve, piège s17)", () => {
  it("aucun loading.tsx : avec lui, build interrupteur fermé, /resiliation répondait 200 (squelette servi) au lieu de 404", () => {
    const fs = require("fs") as typeof import("fs");
    const path = require("path") as typeof import("path");
    const dossier = path.join(__dirname, "../../app/(dashboard)/resiliation");
    expect(fs.existsSync(path.join(dossier, "loading.tsx"))).toBe(false);
    expect(fs.existsSync(path.join(dossier, "confirmee/loading.tsx"))).toBe(false);
    expect(fs.existsSync(path.join(dossier, "../loading.tsx"))).toBe(false);
  });
});
