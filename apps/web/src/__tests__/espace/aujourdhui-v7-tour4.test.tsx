/**
 * « Aujourd'hui » s25 v7, tour 4 : les fautes dures des relectures du tour 3 (design 8/10, UX 8/10) et les pistes.
 * 1. Hero de l'aperçu dès 1024 : colonne de texte équilibrée avec la carte d'offre (H1 `lg:text-6xl`, promesse
 *    `lg:text-2xl`, pastilles `lg:mt-8`), `lg:mt-20` de l'extrait gardé.
 * 2. Tuile « Vidéo du jour » de 768 à 1023 : ligne de média (vignette 17rem à gauche, titre de la carte et titre de la
 *    vidéo en face, centrés en hauteur).
 * Pistes : hero 3/5 et 2/5 de 768 à 1023 ; titre « Contenu du jour » de l'extrait aligné sur ses voisines dès 1024.
 * Les mesures en pixels (pastilles à 24 px au plus sous la promesse, vides de la tuile vidéo, bouton de fin sous
 * 900 px) sont dans
 * `playwright/tests/local/espace-aujourdhui-refonte-s25.spec.ts`.
 */
import { act, render } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }),
  usePathname: () => "/mon-espace",
}));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/espace/garde", () => ({ garderEspace: jest.fn(async () => ({ userId: "u1" })) }));

import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import { ApercuAujourdhui } from "@/components/espace/apercu/tableau-verrouille";
import { ContenuDuJour } from "@/components/espace/aujourdhui/contenu-du-jour";
import { frEspaceProfond } from "@/lib/fr-typo";

const T = frEspaceProfond(TEXTES_AUJOURDHUI);
const classes = (e: Element | null | undefined) => (e?.className ?? "").split(/\s+/);

// Échelle s25 (`docs/design/typo-harmonie-espace-s25.md` §2.6, retour de Thomas du 16/11) : l'équilibre du hero ne
// vient plus de la taille du texte (H1 60 px, promesse 24 px) ; échelle à 4 tailles. v7 tour 6 (placement) : les
// pastilles suivent la promesse à 24 px (`mt-6`) à toutes les largeurs, plus calées sur le bas de l'offre (vide au
// milieu lu comme cassé) ; le surplus de hauteur passe sous elles, en bas de colonne.
describe("faute 1 : hero de l'aperçu équilibré dès 1024, sans grossir le texte", () => {
  it("H1 `TITRE_PAGE` (24 puis 30), promesse `TEXTE`, pastilles 24 px sous la promesse ; 48 px avant l'extrait, 64 dès 1024", () => {
    render(<ApercuAujourdhui visiteur />);
    const hero = document.querySelector("[data-apercu-hero]") as HTMLElement;
    expect(classes(hero.querySelector("h1"))).toEqual(expect.arrayContaining(["text-2xl", "lg:text-3xl", "font-semibold"]));
    expect(classes(hero.querySelector("h1"))).not.toEqual(expect.arrayContaining(["lg:text-6xl"]));
    const promesse = hero.querySelector("[data-apercu-pastilles]")?.previousElementSibling;
    expect(classes(promesse)).toEqual(expect.arrayContaining(["text-base", "max-w-xl"]));
    expect(classes(promesse).some((c) => /text-(lg|xl|2xl)$/.test(c))).toBe(false);
    // v7 tour 8 (point 4) : 24 px dès 768 ; 16 px en dessous, pour la première tuile au premier écran à 375.
    const pastilles = classes(hero.querySelector("[data-apercu-pastilles]"));
    expect(pastilles).toContain("md:mt-6");
    // s26 liste et détail (spec design §5.3) : la preuve quitte le hero, la colonne de texte s'étoffe par le rythme
    // seulement, pastilles à 32 px dès 1024 (`lg:mt-8`, +8) ; sous 1024 inchangé.
    // s26 liste et détail, tour 1 (mesures §5 : 32 px, hors de la règle des 24 px du tour 6) : pastilles revenues à 24 px
    // dès 768, les 8 px passent au-dessus de la promesse (`lg:mt-8`).
    expect(pastilles.filter((c) => /(^|:)(mt|pt)-/.test(c))).toEqual(["mt-4", "md:mt-6"]);
    expect(classes(document.querySelector("[data-apercu-tete] ~ p:not(.sr-only)"))).toEqual(expect.arrayContaining(["mt-4", "lg:mt-8"]));
    expect(classes(hero.children[0])).toEqual(expect.arrayContaining(["flex", "flex-col"]));
    // v7 tour 10 : 24 px sous 768 (la légende monte au-dessus de l'extrait) ; v7 tour 11 : 48 dès 768, plus de 64 dès 1024.
    expect(classes(document.querySelector("[data-apercu-extrait]"))).toEqual(expect.arrayContaining(["mt-6", "md:mt-12"]));
  });
});

describe("piste : hero 60/40 dès 768", () => {
  it("texte 3/5 et offre 2/5 de 768 à 1023, 8/4 dès 1024 ; pastilles rangées pour tomber en 3 + 3", () => {
    render(<ApercuAujourdhui visiteur />);
    const hero = document.querySelector("[data-apercu-hero]") as HTMLElement;
    // s26 tour 2 des encarts (E2, relecture design du tour 1 : carte de 268 px, 122 px vides à 768) : de 768 à 1023,
    // plus de 3/5 et 2/5 : une colonne, la carte d'offre sous le texte, contenu en ligne ; 8/4 dès 1024 inchangé.
    expect(classes(hero)).toEqual(expect.arrayContaining(["lg:grid-cols-12"]));
    expect(classes(hero)).not.toContain("md:grid-cols-5");
    const [texte, offre] = Array.from(hero.children);
    expect(classes(texte)).toEqual(expect.arrayContaining(["lg:col-span-8"]));
    expect(classes(offre)).toEqual(expect.arrayContaining(["lg:col-span-4"]));
    // s26 contrôle d'ensemble, aperçus : le bandeau de l'accueil est un enfant de plus de la carte d'offre.
    const ligne = classes(offre.querySelector("[data-apercu-offre] > div:not([data-halo-premium]):not([data-bandeau-da])"));
    // s26 tour 3 (point 6) : de 768 à 1023, les deux groupes alignés en haut, texte à gauche.
    expect(ligne).toEqual(expect.arrayContaining(["md:max-lg:flex-row", "md:max-lg:items-start", "md:max-lg:text-left"]));
    expect(offre.querySelector("[data-apercu-offre]")).not.toBeNull();
    // v7 tour 8 (point 3, décision de l'orchestrateur) : retour à la ligne libre à écart constant (8 px) à toutes les
    // largeurs, plus aucune grille (les colonnes laissaient des trous inégaux au milieu d'une ligne à 768).
    const pastilles = classes(hero.querySelector("[data-apercu-pastilles]"));
    expect(pastilles).toEqual(expect.arrayContaining(["flex", "flex-wrap", "gap-2"]));
    expect(pastilles.some((c) => /grid/.test(c))).toBe(false);
  });
});

describe("piste : tuile « Contenu du jour » de l'extrait (échelle s25)", () => {
  it("« Contenu du jour » en étiquette sur la ligne des étiquettes voisines, sans ligne vide ; lignes sans cadre séparées d'un filet, en `TEXTE`", () => {
    render(<ApercuAujourdhui visiteur />);
    const tuiles = Array.from(document.querySelectorAll("[data-apercu-suite] [data-tuile-fermee]"));
    const jour = tuiles[tuiles.length - 1];
    // v7 tour 8 (piste, 35 px vides au-dessus du titre) : « Contenu du jour » en `ETIQUETTE` (14/600, comme « Ton cap »),
    // premier enfant de la tuile ; la première ligne à 8 px dessous, sur la ligne des titres voisins. Plus de cale.
    const tuile = jour.querySelector("[data-tuile-fermee] > div:not([data-verrou-ferme])") as HTMLElement;
    const etiquette = tuile.firstElementChild;
    // s26 contrôle d'ensemble, aperçus (DA de l'accueil) : l'étiquette passe en pastille violette (même texte, 14/600).
    expect(etiquette?.textContent).toBe(T.jour.titre);
    expect(etiquette?.hasAttribute("data-pastilles-da")).toBe(true);
    expect(classes(etiquette?.querySelector("span") ?? null)).toEqual(expect.arrayContaining(["text-sm", "font-semibold"]));
    expect(tuile.querySelector("[aria-hidden='true'].h-5")).toBeNull();
    expect(etiquette?.nextElementSibling?.tagName).toBe("UL");
    expect(classes(jour.querySelector("ul"))).toEqual(expect.arrayContaining(["mt-2", "divide-y", "divide-border"]));
    for (const li of Array.from(jour.querySelectorAll("li"))) {
      expect(classes(li)).toEqual(expect.arrayContaining(["py-2", "text-base"]));
      expect(classes(li).some((c) => /^(border|rounded)/.test(c))).toBe(false);
    }
  });
});

describe("faute 2 : tuile « Vidéo du jour » sans quart vide à 768", () => {
  const reponse = (youtubeId: string | null) => ({
    joke: { id: "j1", content: "Le micro de la salle capte les stylos.", punchline: "Pas moi." },
    tip: { id: "t1", title: "Un conseil", content: "Une phrase. Une autre phrase." },
    video: { id: "v1", title: "Une vidéo", youtubeId },
  });
  async function rendre(youtubeId: string | null) {
    (globalThis as { fetch?: unknown }).fetch = jest.fn(async () => ({ ok: true, json: async () => reponse(youtubeId) }));
    const r = render(<ContenuDuJour categories={[]} />);
    await act(async () => undefined);
    return r.container;
  }

  it("avec vignette : ligne de média de 768 à 1023 (vignette 17rem à gauche, titres en face, centrés en hauteur)", async () => {
    const c = await rendre("abc123");
    const titre = c.querySelector("#jour-video") as HTMLElement;
    const carte = titre.closest("article") as HTMLElement;
    expect(classes(carte)).toEqual(
      expect.arrayContaining(["md:max-lg:grid", "md:max-lg:grid-cols-[17rem_1fr]", "md:max-lg:grid-rows-[1fr_auto_auto_1fr]", "lg:row-span-2"]),
    );
    expect(classes(titre)).toEqual(expect.arrayContaining(["md:max-lg:col-start-2", "md:max-lg:row-start-2"]));
    // Les deux enveloppes du corps s'effacent de 768 à 1023 : vignette et lien sont placés par la grille de la carte.
    const vignette = carte.querySelector(".aspect-video") as HTMLElement;
    expect(classes(vignette)).toEqual(expect.arrayContaining(["md:max-lg:col-start-1", "md:max-lg:row-span-4", "md:max-lg:mb-0"]));
    for (let e = vignette.parentElement; e && e !== carte; e = e.parentElement) expect(classes(e)).toContain("md:max-lg:contents");
    const lien = carte.querySelector('a[href^="/videos/"]') as HTMLElement;
    expect(classes(lien)).toEqual(expect.arrayContaining(["md:max-lg:col-start-2", "md:max-lg:row-start-3", "md:max-lg:text-xl"]));
    // Ordre du DOM inchangé : titre de la carte, vignette, lien.
    expect(titre.compareDocumentPosition(vignette) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(vignette.compareDocumentPosition(lien) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("sans vignette : carte ordinaire, aucune grille de média", async () => {
    const c = await rendre(null);
    const carte = c.querySelector("#jour-video")?.closest("article") as HTMLElement;
    expect(carte.className).not.toMatch(/md:max-lg:grid/);
    expect(carte.innerHTML).not.toMatch(/md:max-lg:contents/);
  });
});
