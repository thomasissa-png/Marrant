/**
 * @jest-environment node
 *
 * s26 liste et détail : interrupteur ouvert (SIMULÉ), l'ancienne adresse d'une fiche de Quoi répondre
 * (`/mon-espace/fiche/{situation|a-plat}/[id]`) répond 308 vers `/mon-espace/quoi-repondre/[id]`, query gardée, un seul
 * saut (couvre les liens des e-mails déjà envoyés). Les autres types de fiche gardent leur adresse. Fermé : la
 * réécriture vers la 404 d'aujourd'hui, ancienne adresse comprise, inchangée.
 */
import { NextRequest } from "next/server";

jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __ESPACE_OUVERT__?: boolean }).__ESPACE_OUVERT__ === true;
  },
}));

import middleware from "@/middleware";

const drapeau = globalThis as { __ESPACE_OUVERT__?: boolean };
const requete = (chemin: string) => new NextRequest(new URL(chemin, "https://deviens-marrant.fr"), { headers: { host: "deviens-marrant.fr" } });

afterAll(() => {
  drapeau.__ESPACE_OUVERT__ = false;
});

describe("ancienne adresse de fiche de Quoi répondre (s26 liste et détail)", () => {
  it.each(["situation", "a-plat"])("ouvert, %s : 308 vers la rubrique, query `?ou=&pour=` gardée", async (type) => {
    drapeau.__ESPACE_OUVERT__ = true;
    const res = await middleware(requete(`/mon-espace/fiche/${type}/coloc-la-poele?ou=coloc&pour=desamorcer`));
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("https://deviens-marrant.fr/mon-espace/quoi-repondre/coloc-la-poele?ou=coloc&pour=desamorcer");
  });

  it("ouvert : la nouvelle adresse n'est pas redirigée (un seul saut) ; les autres types gardent la leur", async () => {
    drapeau.__ESPACE_OUVERT__ = true;
    // s26 bibliothèque liste et détail : une technique (construction…) répond désormais 308 (test dédié) ; la nouvelle
    // adresse de la Bibliothèque n'est pas redirigée, le coin et les bilans gardent la leur.
    for (const chemin of ["/mon-espace/quoi-repondre/coloc-la-poele", "/mon-espace/bibliotheque/x", "/mon-espace/fiche/humour-noir/x", "/mon-espace/fiche/bilan/bilan-repartie"]) {
      expect([chemin, (await middleware(requete(chemin))).headers.get("location")]).toEqual([chemin, null]);
    }
  });

  it("fermé : ancienne et nouvelle adresses réécrites vers la 404 d'aujourd'hui, aucune redirection", async () => {
    drapeau.__ESPACE_OUVERT__ = false;
    for (const chemin of ["/mon-espace/fiche/situation/coloc-la-poele?ou=coloc", "/mon-espace/quoi-repondre/coloc-la-poele"]) {
      const res = await middleware(requete(chemin));
      expect(res.headers.get("location")).toBeNull();
      expect(res.headers.get("x-middleware-rewrite")).toContain("/_espace-ferme");
    }
  });
});
