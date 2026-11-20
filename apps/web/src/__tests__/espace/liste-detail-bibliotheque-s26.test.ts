/**
 * @jest-environment node
 *
 * s26 bibliothèque liste et détail (modèle : le pilote de Quoi répondre) : interrupteur ouvert (SIMULÉ), l'ancienne
 * adresse d'une technique (`/mon-espace/fiche/{construction|vocabulaire|formule|ecouter}/[id]`) répond 308 vers
 * `/mon-espace/bibliotheque/[id]`, un seul saut ; le coin « Humour noir », les jeux et les bilans gardent la leur.
 * Fermé : la réécriture vers la 404 d'aujourd'hui, ancienne et nouvelle adresses comprises. Adresses, parent et
 * rubrique allumée d'une technique.
 */
import { NextRequest } from "next/server";

jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __ESPACE_OUVERT__?: boolean }).__ESPACE_OUVERT__ === true;
  },
}));

import middleware from "@/middleware";
import { hrefFiche } from "@/lib/espace/premier-pas";
import { estFicheBibliotheque, idDeCheminBibliotheque } from "@/lib/espace/bibliotheque-liste";
import { parentEspace, rubriqueAllumee } from "@/components/espace/rubriques";

const drapeau = globalThis as { __ESPACE_OUVERT__?: boolean };
const requete = (chemin: string) => new NextRequest(new URL(chemin, "https://deviens-marrant.fr"), { headers: { host: "deviens-marrant.fr" } });

afterAll(() => {
  drapeau.__ESPACE_OUVERT__ = false;
});

describe("ancienne adresse d'une technique (s26 bibliothèque liste et détail)", () => {
  it.each(["construction", "vocabulaire", "formule", "ecouter"])("ouvert, %s : 308 vers la Bibliothèque, un seul saut", async (type) => {
    drapeau.__ESPACE_OUVERT__ = true;
    const res = await middleware(requete(`/mon-espace/fiche/${type}/le-faux-secret`));
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("https://deviens-marrant.fr/mon-espace/bibliotheque/le-faux-secret");
    const nouvelle = await middleware(requete("/mon-espace/bibliotheque/le-faux-secret"));
    expect(nouvelle.headers.get("location")).toBeNull();
  });

  it("ouvert : le coin, les jeux et les bilans gardent leur adresse", async () => {
    drapeau.__ESPACE_OUVERT__ = true;
    for (const chemin of ["/mon-espace/fiche/humour-noir/x", "/mon-espace/fiche/jeu/x", "/mon-espace/fiche/bilan/bilan-repartie", "/mon-espace/bonus/x"]) {
      expect([chemin, (await middleware(requete(chemin))).headers.get("location")]).toEqual([chemin, null]);
    }
  });

  it("fermé : ancienne et nouvelle adresses réécrites vers la 404 d'aujourd'hui, aucune redirection", async () => {
    drapeau.__ESPACE_OUVERT__ = false;
    for (const chemin of ["/mon-espace/fiche/construction/le-faux-secret", "/mon-espace/bibliotheque/le-faux-secret"]) {
      const res = await middleware(requete(chemin));
      expect(res.headers.get("location")).toBeNull();
      expect(res.headers.get("x-middleware-rewrite")).toContain("/_espace-ferme");
    }
  });
});

describe("adresses d'une technique (s26 bibliothèque liste et détail)", () => {
  it("`hrefFiche` : les techniques sous la Bibliothèque, le coin et les autres types inchangés", () => {
    for (const type of ["construction", "vocabulaire", "formule", "ecouter"]) expect(hrefFiche(type, "z")).toBe("/mon-espace/bibliotheque/z");
    expect(hrefFiche("humour-noir", "h")).toBe("/mon-espace/fiche/humour-noir/h");
    expect(hrefFiche("jeu", "j")).toBe("/mon-espace/fiche/jeu/j");
    expect(hrefFiche("situation", "s")).toBe("/mon-espace/quoi-repondre/s");
  });

  it("adresse de fiche reconnue, id décodé ; la liste n'est pas une fiche", () => {
    expect(estFicheBibliotheque("/mon-espace/bibliotheque/le-faux-secret?x=1")).toBe(true);
    expect(estFicheBibliotheque("/mon-espace/bibliotheque")).toBe(false);
    expect(estFicheBibliotheque("/mon-espace/bibliotheque/a/b")).toBe(false);
    expect(idDeCheminBibliotheque("/mon-espace/bibliotheque/l%C3%A9a/")).toBe("léa");
  });

  it("`parentEspace` et `rubriqueAllumee` : une technique ramène à la Bibliothèque et l'allume", () => {
    expect(parentEspace("/mon-espace/bibliotheque/le-faux-secret")).toEqual({ href: "/mon-espace/bibliotheque", label: expect.any(String) });
    expect(rubriqueAllumee("/mon-espace/bibliotheque/le-faux-secret")).toBe("bibliotheque");
  });
});
