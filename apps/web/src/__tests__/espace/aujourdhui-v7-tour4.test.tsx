/**
 * « Aujourd'hui » s25 v7, tour 4 : les fautes dures des relectures du tour 3 (design 8/10, UX 8/10) et les pistes.
 * 1. Hero de l'aperçu dès 1024 : colonne de texte équilibrée avec la carte d'offre (H1 `lg:text-6xl`, promesse
 *    `lg:text-2xl`, pastilles `lg:mt-8`), `lg:mt-20` de l'extrait gardé.
 * 2. Tuile « Vidéo du jour » de 768 à 1023 : ligne de média (vignette 17rem à gauche, titre de la carte et titre de la
 *    vidéo en face, centrés en hauteur).
 * Pistes : hero 3/5 et 2/5 de 768 à 1023 ; titre « Contenu du jour » de l'extrait aligné sur ses voisines dès 1024.
 * Les mesures en pixels (bas alignés à 24 px, vides de la tuile vidéo, bouton de fin sous 900 px) sont dans
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

describe("faute 1 : hero de l'aperçu équilibré dès 1024", () => {
  it("H1 6xl, promesse 2xl, pastilles à 32 px ; marge de 80 px de l'extrait gardée", () => {
    render(<ApercuAujourdhui visiteur />);
    const hero = document.querySelector("[data-apercu-hero]") as HTMLElement;
    expect(classes(hero.querySelector("h1"))).toEqual(expect.arrayContaining(["md:text-5xl", "lg:text-6xl"]));
    expect(classes(hero.querySelector("p.text-lg"))).toEqual(expect.arrayContaining(["md:text-xl", "lg:text-2xl"]));
    expect(classes(hero.querySelector("[data-apercu-pastilles]"))).toEqual(expect.arrayContaining(["mt-6", "lg:mt-8"]));
    expect(classes(document.querySelector("[data-apercu-extrait]"))).toContain("lg:mt-20");
  });
});

describe("piste : hero 60/40 dès 768", () => {
  it("texte 3/5 et offre 2/5 de 768 à 1023, 8/4 dès 1024 ; pastilles plafonnées pour tomber en 3 + 3", () => {
    render(<ApercuAujourdhui visiteur />);
    const hero = document.querySelector("[data-apercu-hero]") as HTMLElement;
    expect(classes(hero)).toEqual(expect.arrayContaining(["md:grid-cols-5", "md:items-start", "lg:grid-cols-12"]));
    const [texte, offre] = Array.from(hero.children);
    expect(classes(texte)).toEqual(expect.arrayContaining(["md:col-span-3", "lg:col-span-8"]));
    expect(classes(offre)).toEqual(expect.arrayContaining(["md:col-span-2", "lg:col-span-4"]));
    expect(offre.querySelector("[data-apercu-offre]")).not.toBeNull();
    expect(classes(hero.querySelector("[data-apercu-pastilles]"))).toContain("md:max-lg:max-w-md");
  });
});

describe("piste : titre « Contenu du jour » de l'extrait aligné", () => {
  it("dès 1024, 24 px au-dessus du titre (étiquette des voisines) et liste resserrée", () => {
    render(<ApercuAujourdhui visiteur />);
    const tuiles = Array.from(document.querySelectorAll("[data-apercu-suite] [data-tuile-fermee]"));
    const jour = tuiles[tuiles.length - 1];
    const titre = jour.querySelector("p.font-display");
    expect(titre?.textContent).toBe(T.jour.titre);
    expect(classes(titre)).toContain("lg:mt-6");
    expect(classes(jour.querySelector("ul"))).toEqual(expect.arrayContaining(["mt-3", "lg:mt-2"]));
    for (const li of Array.from(jour.querySelectorAll("li"))) expect(classes(li)).toEqual(expect.arrayContaining(["py-2", "lg:py-1"]));
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
