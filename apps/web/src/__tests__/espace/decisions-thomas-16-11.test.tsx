/**
 * Décisions de Thomas du 16/11 (s25, « je suis tes recos »), côté rendu :
 *  1. Bilan de parcours : la carte « À toi » (geste) n'est rendue qu'après la réponse au « dans l'ordre ».
 *  2. /lettre, fermé aussi : corps du dernier numéro en `min-w-0 [overflow-wrap:anywhere]` (375 px).
 *  3. /lettre, ouvert : `utm_*` retirés des adresses affichées et des `href` ; les autres paramètres restent.
 *  7. /vannes « Toutes » chez l'abonné : alternance entre les groupes de la rangée (`alternerParGroupe`) ; la route
 *     est testée dans `__tests__/api/decisions-thomas-16-11.test.ts` (environnement node).
 *  9. Carnet de l'abonné : « Retour au sommaire » après chaque fiche, vers `#carnet-sommaire`, cible de 44 px.
 * Points 4, 5, 6 et 8 : aucun code (founder-preferences seulement, ou enquête).
 */
import { TextEncoder } from "util";
import { readFileSync } from "fs";
import { join } from "path";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactElement } from "react";

const etat = globalThis as { __D1611_OUVERT__?: boolean };
jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __D1611_OUVERT__?: boolean }).__D1611_OUVERT__ === true;
  },
}));
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), refresh: jest.fn(), prefetch: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: () => {
    throw new Error("notFound");
  },
}));
const mockCorps =
  "Lire l'article : https://deviens-marrant.fr/blog/rester-muet-en-groupe?utm_source=lettre&utm_medium=email&utm_content=n1-article\n" +
  "Voir ce que Premium ouvre : https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n1-premium.";
jest.mock("@/lib/lettre/apercu", () => ({ lireApercuLettre: async () => ({ dernier: { subject: "Objet", bodyText: mockCorps } }) }));
jest.mock("@/config/lettre", () => ({ ...jest.requireActual("@/config/lettre"), LETTRE_INSCRIPTIONS_OUVERTES: true }));
jest.mock("@/components/lettre/lettre-page-inscription", () => ({ LettrePageInscription: () => null }));
jest.mock("@/lib/espace/garde", () => ({ lireAccesEspace: async () => ({ acces: "ferme" }) }));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));

Object.assign(globalThis, { TextEncoder });
const { renderToStaticMarkup } = jest.requireActual<typeof import("react-dom/server")>("react-dom/server");

import { FicheVue } from "@/components/espace/fiche";
import { PRENDS_TON_TEMPS_MS } from "@/components/espace/carte/boutons-reponse";
import { TEXTES_CARTES as C } from "@/config/textes/espace-cartes";
import { validerFichier } from "@/lib/espace/fiches-schema";
import bilans from "@/data/espace/bilans.json";
import LettrePage from "@/app/(dashboard)/lettre/page";
import { LettreCorpsApercu, lienSansParametres } from "@/components/lettre/lettre-corps-apercu";
import { alternerParGroupe, groupeDeCategorie } from "@/config/vannes-categories";
import { CarnetPage } from "@/components/carnet/carnet-page";
import { carnetViewForPlan, parseCarnets } from "@/lib/carnet";
import { CARNET_RETOUR_SOMMAIRE } from "@/config/textes/cta-pages";

const ouvrir = (ouvert: boolean) => {
  etat.__D1611_OUVERT__ = ouvert;
};
beforeEach(() => ouvrir(false));
afterAll(() => {
  delete etat.__D1611_OUVERT__;
});
const serveur = async (el: Promise<ReactElement>) => renderToStaticMarkup(await el);

describe("point 1 : bilan, « À toi » après la réponse au « dans l'ordre »", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());
  const liste = validerFichier("bilan", bilans);

  it.each(liste.map((b) => [b.id, b]))("%s : geste absent du DOM avant, présent après ; texte inchangé", (_id, b) => {
    const consigne = b.geste?.consigne ?? "";
    expect(consigne.length).toBeGreaterThan(0);
    const { container } = render(<FicheVue fiche={b} retour={null} replique={null} lettre={null} />);
    expect(screen.queryByTestId("geste-fiche")).toBeNull();
    expect(container.textContent).not.toContain(consigne);
    const ordre = container.querySelector('[data-bilan="ordre"]') as HTMLElement;
    act(() => jest.advanceTimersByTime(PRENDS_TON_TEMPS_MS));
    // Répondre à une « Laquelle ressortir ici ? » ne suffit pas.
    const laquelle = container.querySelector('[data-bilan="laquelle"]') as HTMLElement;
    fireEvent.click(within(laquelle).getByRole("button", { name: C.reponses.OUI }));
    expect(screen.queryByTestId("geste-fiche")).toBeNull();
    fireEvent.click(within(ordre).getByRole("button", { name: C.reponses.RIEN }));
    const geste = screen.getByTestId("geste-fiche");
    expect(geste).toHaveTextContent(consigne.replace(/\s+/g, " ").trim().slice(0, 20));
    // Une seule fois, après la carte « ordre ».
    expect(container.textContent?.split(consigne).length).toBe(2);
    expect(ordre.compareDocumentPosition(geste) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});

describe("point 2 : /lettre, fermé, coupure partout", () => {
  it("le corps d'avant reçoit `min-w-0 [overflow-wrap:anywhere]`, texte et adresses inchangés", async () => {
    const html = await serveur(LettrePage({ searchParams: {} }));
    expect(html).toContain('<div class="mt-2 min-w-0 whitespace-pre-line text-text-secondary [overflow-wrap:anywhere]">');
    expect(html).not.toContain("data-lettre-corps");
  });
});

describe("point 3 : /lettre, liens sans `utm_*`", () => {
  it("`utm_*` retirés de l'adresse affichée et du `href` ; autre paramètre et ancre gardés", () => {
    expect(lienSansParametres("https://deviens-marrant.fr/parcours/repartie?utm_source=lettre&utm_medium=email#etape-3")).toEqual({
      href: "/parcours/repartie#etape-3",
      texte: "deviens-marrant.fr/parcours/repartie",
    });
    expect(lienSansParametres("https://exemple.org/page?utm_source=lettre&id=4&UTM_Campaign=x")).toEqual({
      href: "https://exemple.org/page?id=4",
      texte: "exemple.org/page?id=4",
    });
  });

  it("composant et page ouverte : aucun `utm_` dans le texte ni dans un `href`", async () => {
    const { container } = render(<LettreCorpsApercu texte={mockCorps} />);
    for (const a of Array.from(container.querySelectorAll("a"))) expect(a.getAttribute("href")).not.toContain("utm_");
    expect(container.textContent).not.toContain("utm_");
    expect(container.textContent).toContain("Lire l'article");
    ouvrir(true);
    expect(await serveur(LettrePage({ searchParams: {} }))).not.toContain("utm_");
  });
});

describe("point 7 : alternance des catégories (« Toutes », abonné)", () => {
  it("round-robin entre groupes, ensemble inchangé", () => {
    const cats = ["BOULOT", "BOULOT", "BOULOT", "BOULOT", "COUPLE", "DATING", "ABSURDE", "SITUATION", "CULTUREL"];
    const entree = cats.map((category, i) => ({ id: `j${i}`, category }));
    const sortie = alternerParGroupe(entree);
    expect(sortie.map((v) => v.id)).toEqual(["j0", "j4", "j6", "j7", "j1", "j5", "j8", "j2", "j3"]);
    expect([...sortie].sort((a, b) => a.id.localeCompare(b.id))).toEqual([...entree].sort((a, b) => a.id.localeCompare(b.id)));
    // Les 4 premières : 4 groupes différents.
    expect(new Set(sortie.slice(0, 4).map((v) => groupeDeCategorie(v.category))).size).toBe(4);
    expect(alternerParGroupe([])).toEqual([]);
  });
});

describe("point 9 : carnet de l'abonné, « Retour au sommaire »", () => {
  const lire = (f: string): unknown => JSON.parse(readFileSync(join(__dirname, "..", "..", "data", "carnet", f), "utf8"));
  const [precedent, courant] = parseCarnets([lire("2026-10.json"), lire("2026-11.json")]);
  const page = (plan: string | null) => (
    <CarnetPage view={carnetViewForPlan(courant, plan)} months={[courant.mois, precedent.mois]} returnTo="/carnet" src="carnet" />
  );

  // s26 carnet liste et détail (`docs/ux/carnet-audit-s26.md` §3) : le sommaire est la liste du layout ; la page ne rend
  // plus que le panneau (une fiche). « Retour au sommaire » reste après la fiche sous 1024 (dès 1024 la liste est à
  // gauche), vers la liste du mois, 44 px.
  it("ouvert, abonné : un lien après la fiche du panneau, vers la liste, masqué dès 1024, 44 px", () => {
    ouvrir(true);
    const { container } = render(page("PREMIUM"));
    const fiches = Array.from(container.querySelectorAll('[id^="fiche-"]'));
    const retours = screen.getAllByRole("link", { name: CARNET_RETOUR_SOMMAIRE });
    expect(CARNET_RETOUR_SOMMAIRE).toBe("Retour au sommaire");
    expect(fiches).toHaveLength(1);
    expect(retours).toHaveLength(1);
    expect(retours[0]).toHaveAttribute("href", "/carnet");
    expect(retours[0].className.split(" ")).toEqual(expect.arrayContaining(["min-h-11", "lg:hidden"]));
    expect(fiches[0].compareDocumentPosition(retours[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it.each([["fermé, abonné", false, "PREMIUM"], ["ouvert, visiteur", true, null]] as const)("%s : aucun lien de retour", (_n, ouvert, plan) => {
    ouvrir(ouvert);
    render(page(plan));
    expect(screen.queryByRole("link", { name: CARNET_RETOUR_SOMMAIRE })).toBeNull();
  });
});
