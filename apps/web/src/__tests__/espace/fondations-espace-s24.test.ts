/**
 * @jest-environment node
 *
 * Lot D0 de l'espace client (s24, `docs/espace-client/plan-developpement-s24.md` §3) :
 * interrupteur fermé = adresse inexistante (pages et API), garde en 5 cas (plan relu en
 * base même si le jeton dit PREMIUM), arrivées inchangées fermé, robots et sitemap.
 */
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";

jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __ESPACE_OUVERT__?: boolean }).__ESPACE_OUVERT__ === true;
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
const findUnique = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: (...a: unknown[]) => findUnique(...a) },
    dailyContent: { findFirst: async () => null },
    blogArticle: { findMany: async () => [] },
  },
}));
jest.mock("@/lib/sitemap-parcours", () => ({
  getParcoursSitemapDates: async () => ({ hub: new Date("2026-10-11"), bySlug: {} }),
}));
jest.mock("@/lib/sitemap-catalogue", () => ({ getCatalogueSitemapEntries: async () => [] }));

import { NextResponse } from "next/server";
import { garderApiEspace, garderEspace, lireAccesEspace } from "@/lib/espace/garde";
import { arriveeApresConnexion, arriveeApresPaiement } from "@/lib/espace/arrivee";
import { getPostPaymentDestination } from "@/lib/premium-return";
import * as layout from "@/app/(dashboard)/mon-espace/layout";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

const drapeau = globalThis as { __ESPACE_OUVERT__?: boolean };
const SRC = join(__dirname, "../..");

/** Comptes en base : FREE jamais abonné, ancien abonné (abonnement Stripe créé), abonné actif. */
const GRATUIT = { plan: "FREE", subscription: null };
const ANCIEN = { plan: "FREE", subscription: { stripeSubscriptionId: "sub_fini" } };
const ACTIF = { plan: "PREMIUM", subscription: { stripeSubscriptionId: "sub_actif" } };

/** Session connectée ; le jeton dit PREMIUM, la base décide. */
const connecte = () => getServerSession.mockResolvedValue({ user: { id: "u1", plan: "PREMIUM" } });

function fichiers(dossier: string, nom: RegExp): string[] {
  let trouves: string[] = [];
  try {
    for (const entree of readdirSync(dossier)) {
      const chemin = join(dossier, entree);
      if (statSync(chemin).isDirectory()) trouves = trouves.concat(fichiers(chemin, nom));
      else if (nom.test(entree)) trouves.push(chemin);
    }
  } catch {
    return [];
  }
  return trouves;
}

beforeEach(() => {
  drapeau.__ESPACE_OUVERT__ = false;
  getServerSession.mockReset();
  findUnique.mockReset();
});

describe("interrupteur fermé : l'espace n'existe pas", () => {
  it("garde de page : 404 avant toute lecture de session ou de base", async () => {
    connecte();
    findUnique.mockResolvedValue(ACTIF);
    await expect(garderEspace("/mon-espace")).rejects.toThrow("NEXT_NOT_FOUND");
    expect(getServerSession).not.toHaveBeenCalled();
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("layout /mon-espace : 404, aucune métadonnée propre, rendu dynamique", async () => {
    connecte();
    findUnique.mockResolvedValue(ACTIF);
    await expect(layout.default({ children: null })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(await layout.generateMetadata()).toEqual({});
    expect(layout.dynamic).toBe("force-dynamic");
    expect(layout.revalidate).toBe(0);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("garde d'API : 404 JSON non mis en cache, sans lecture", async () => {
    connecte();
    const reponse = await garderApiEspace();
    expect(reponse).toBeInstanceOf(NextResponse);
    const r = reponse as NextResponse;
    expect(r.status).toBe(404);
    expect(r.headers.get("Cache-Control")).toBe("private, no-store");
    expect(await r.json()).toEqual({ error: "Introuvable" });
    expect(getServerSession).not.toHaveBeenCalled();
  });

  it("chaque route api/espace/** répond 404 à chaque méthode (aucune écriture)", async () => {
    connecte();
    findUnique.mockResolvedValue(ACTIF);
    const routes = fichiers(join(SRC, "app/api/espace"), /^route\.ts$/);
    for (const route of routes) {
      const gestionnaires = (await import(route)) as Record<string, unknown>;
      for (const methode of ["GET", "POST", "PUT", "PATCH", "DELETE"]) {
        const gestionnaire = gestionnaires[methode];
        if (typeof gestionnaire !== "function") continue;
        const reponse = (await gestionnaire(new Request("http://localhost/api/espace", { method: methode }))) as Response;
        expect([relative(SRC, route), methode, reponse.status]).toEqual([relative(SRC, route), methode, 404]);
      }
    }
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("chaque page sous /mon-espace appelle la garde en premier (rendu partiel de Next)", () => {
    for (const page of fichiers(join(SRC, "app/(dashboard)/mon-espace"), /^page\.tsx$/)) {
      expect([relative(SRC, page), /garderEspace\(/.test(readFileSync(page, "utf8"))]).toEqual([relative(SRC, page), true]);
    }
  });

  it("arrivées inchangées : paiement = intention d'origine, connexion = origine sinon /vannes", () => {
    for (const retour of [null, "/parcours/repartie#etape-2", "https://evil.example", "/abonnement"]) {
      expect(arriveeApresPaiement(retour)).toBe(getPostPaymentDestination(retour));
    }
    for (const compte of ["abonne", "ancien-abonne", "gratuit"] as const) {
      expect(arriveeApresConnexion(null, compte)).toBe("/vannes");
      expect(arriveeApresConnexion("/conseils/x", compte)).toBe("/conseils/x");
      expect(arriveeApresConnexion("//evil.example", compte)).toBe("/vannes");
    }
  });
});

describe("garde, interrupteur ouvert : les 5 cas (plan relu en base)", () => {
  beforeEach(() => {
    drapeau.__ESPACE_OUVERT__ = true;
  });

  it("1. visiteur : connexion avec retour sur la page demandée", async () => {
    getServerSession.mockResolvedValue(null);
    await expect(garderEspace("/mon-espace/questions")).rejects.toThrow(
      "NEXT_REDIRECT /login?callbackUrl=%2Fmon-espace%2Fquestions",
    );
    await expect(garderEspace("https://evil.example")).rejects.toThrow("NEXT_REDIRECT /login?callbackUrl=%2Fmon-espace");
    expect(findUnique).not.toHaveBeenCalled();
    expect(((await garderApiEspace()) as NextResponse).status).toBe(401);
  });

  it("2. compte FREE jamais abonné : /abonnement", async () => {
    connecte();
    findUnique.mockResolvedValue(GRATUIT);
    await expect(garderEspace("/mon-espace")).rejects.toThrow("NEXT_REDIRECT /abonnement");
    expect(await lireAccesEspace()).toEqual({ acces: "abonnement", userId: "u1", ancienAbonne: false });
    expect(((await garderApiEspace()) as NextResponse).status).toBe(403);
  });

  it("3. ancien abonné : /abonnement, distingué pour sa ligne", async () => {
    connecte();
    findUnique.mockResolvedValue(ANCIEN);
    await expect(garderEspace("/mon-espace")).rejects.toThrow("NEXT_REDIRECT /abonnement");
    expect(await lireAccesEspace()).toEqual({ acces: "abonnement", userId: "u1", ancienAbonne: true });
  });

  it("4. abonné actif : passe", async () => {
    connecte();
    findUnique.mockResolvedValue(ACTIF);
    await expect(garderEspace("/mon-espace")).resolves.toEqual({ userId: "u1" });
    await expect(garderApiEspace()).resolves.toEqual({ userId: "u1" });
    await expect(layout.default({ children: null })).resolves.toBeTruthy();
    expect(await layout.generateMetadata()).toMatchObject({ robots: { index: false, follow: false } });
  });

  it("5. jeton PREMIUM mais base FREE (ou compte supprimé) : le plan en base l'emporte", async () => {
    connecte();
    findUnique.mockResolvedValue(GRATUIT);
    await expect(garderEspace("/mon-espace")).rejects.toThrow("NEXT_REDIRECT /abonnement");
    expect(findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "u1" } }));
    findUnique.mockResolvedValue(null);
    await expect(garderEspace("/mon-espace")).rejects.toThrow("NEXT_REDIRECT /login?callbackUrl=%2Fmon-espace");
  });

  it("base indisponible : jamais d'accès (erreur pour la page, 503 pour l'API)", async () => {
    connecte();
    findUnique.mockRejectedValue(new Error("base"));
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    await expect(garderEspace("/mon-espace")).rejects.toThrow("base");
    expect(((await garderApiEspace()) as NextResponse).status).toBe(503);
  });

  it("arrivées : paiement = Aujourd'hui ; connexion selon le compte", () => {
    expect(arriveeApresPaiement("/parcours/repartie#etape-2")).toBe("/mon-espace");
    expect(arriveeApresConnexion(null, "abonne")).toBe("/mon-espace");
    expect(arriveeApresConnexion("/conseils/x", "abonne")).toBe("/conseils/x");
    expect(arriveeApresConnexion("/abonnement?plan=annual", "abonne")).toBe("/mon-espace");
    expect(arriveeApresConnexion("/conseils/x", "ancien-abonne")).toBe("/abonnement");
    expect(arriveeApresConnexion(null, "gratuit")).toBe("/vannes");
  });
});

describe("robots et sitemap", () => {
  it("/mon-espace interdit dans chaque groupe User-agent", () => {
    const { rules } = robots();
    for (const groupe of Array.isArray(rules) ? rules : [rules]) {
      expect(groupe.disallow).toContain("/mon-espace");
    }
  });

  it("aucune adresse /mon-espace dans le sitemap", async () => {
    drapeau.__ESPACE_OUVERT__ = true;
    expect((await sitemap()).filter((e) => e.url.includes("/mon-espace"))).toEqual([]);
  });
});
