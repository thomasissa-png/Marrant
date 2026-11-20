/**
 * « Aujourd'hui » s25 v7, tour 12 : relectures du tour 11 (design 7/10, UX 6/10).
 * 1. Extrait : la première vanne gratuite du catalogue (lue par la page, même source que l'aperçu de Favoris) dans la
 *    tuile du contenu du jour ; sans vanne, les trois libellés d'avant.
 * 2. « Ton cap » sans chiffres à 768 : cap et barre sur toute la largeur, phrase de série dessous sous un filet.
 * 3. Z1 du premier pas : la scène réelle de la fiche à gauche du bouton dès 768 (masquée dessous).
 * 4. Bouton éteint de l'extrait : texte en gris secondaire, même 16/600.
 * Positions mesurées en vrai navigateur : `espace-aujourdhui-refonte-s25.spec.ts`.
 */
import { render } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }),
  usePathname: () => "/mon-espace",
}));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/espace/garde", () => ({ garderEspace: jest.fn(async () => ({ userId: "u1" })) }));

import { ApercuAujourdhui } from "@/components/espace/apercu/tableau-verrouille";
import { ActionDuJour } from "@/components/espace/aujourdhui/action-du-jour";
import { CapDuJour } from "@/components/espace/aujourdhui/cap-du-jour";
import { ficheApercu } from "@/components/espace/apercu/exemples";
import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import { choisirPremierPas, sceneDeSituation, sceneDuPremierPas, ENTREES_QUIZ, ENTREE_PAR_DEFAUT } from "@/lib/espace/premier-pas";
import { frEspace } from "@/lib/fr-typo";

const classes = (e: Element | null | undefined) => (e?.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
const VANNE = { content: "Énoncé réel de test.", punchline: "Chute réelle de test." };
const SCENE = TEXTES_AUJOURDHUI.premierPas.sceneParDefaut;

describe("point 1 : une vraie vanne dans l'extrait", () => {
  it("avec la vanne : étiquette « Vanne du jour », énoncé puis chute, 4 lignes au plus, fondu en longueurs fixes", () => {
    render(<ApercuAujourdhui visiteur vanne={VANNE} />);
    const bloc = document.querySelector("[data-apercu-vanne]") as HTMLElement;
    expect(bloc).not.toBeNull();
    const tuile = bloc.closest("[data-tuile-fermee]") as HTMLElement;
    // s26 contrôle d'ensemble, aperçus (DA de l'accueil) : « Vanne du jour » en pastille violette, avec l'émoji de l'accueil.
    expect(tuile.querySelector("[data-pastilles-da]")?.textContent).toBe(`😂${frEspace(TEXTES_AUJOURDHUI.jour.vanne)}`);
    const [enonce, chute] = Array.from(bloc.querySelectorAll("p"));
    expect(enonce.textContent).toBe(VANNE.content);
    expect(chute.textContent).toBe(VANNE.punchline);
    expect(classes(enonce)).toEqual(expect.arrayContaining(["text-base", "text-text-primary"]));
    expect(classes(chute)).toEqual(expect.arrayContaining(["text-base", "font-semibold"]));
    expect(classes(bloc)).toEqual(expect.arrayContaining(["mt-2", "max-h-24", "overflow-hidden"]));
    expect(bloc.className).toContain("black_4.5rem,transparent_6rem");
    // Plus de liste de libellés dans cette tuile.
    expect(tuile.querySelector("li")).toBeNull();
  });

  it("sans vanne (base indisponible) : les trois libellés d'avant, aucune vanne inventée", () => {
    render(<ApercuAujourdhui visiteur />);
    expect(document.querySelector("[data-apercu-vanne]")).toBeNull();
    const lis = Array.from(document.querySelectorAll("[data-apercu-suite] li")).map((l) => l.textContent);
    expect(lis).toEqual(expect.arrayContaining([TEXTES_AUJOURDHUI.jour.vanne, TEXTES_AUJOURDHUI.jour.conseil].map(frEspace)));
  });
});

describe("point 2 : « Ton cap » sans chiffres, plus de bandeau à 768", () => {
  it("sans chiffres : cap et phrase de série chacun sur toute la largeur (`md:basis-full`), filet entre eux", () => {
    const { container } = render(<CapDuJour cap={1} xp={0} serie={0} fige />);
    const [cap, serie] = Array.from(container.querySelectorAll("[data-cap-du-jour] > div"));
    expect(classes(cap)).toEqual(expect.arrayContaining(["md:basis-full", "lg:basis-auto"]));
    expect(classes(serie)).toEqual(expect.arrayContaining(["md:basis-full", "lg:basis-auto", "border-t", "md:mt-2", "lg:mt-6"]));
    expect(classes(serie)).not.toContain("md:contents");
  });

  it("avec chiffres : le bandeau d'avant (cases à droite, `md:contents`)", () => {
    const { container } = render(<CapDuJour cap={2} xp={250} serie={1} />);
    const [cap, chiffres] = Array.from(container.querySelectorAll("[data-cap-du-jour] > div"));
    expect(classes(cap)).not.toContain("md:basis-full");
    expect(classes(chiffres)).toContain("md:contents");
  });
});

describe("points 3 et 4 : Z1 du premier pas, scène réelle et bouton éteint (revus au v7 tour 13)", () => {
  it("v7 tour 13 : l'aperçu ne montre plus la scène (situation une seule fois) ; l'abonné la lit entre titre et bouton, dès 768", () => {
    render(<ApercuAujourdhui visiteur />);
    expect(document.querySelector("[data-apercu-extrait] [data-premier-pas-scene]")).toBeNull();
    const texteScene = frEspace(sceneDeSituation(ficheApercu("aujourdhui")) ?? "∅");
    expect(document.body.textContent).not.toContain(texteScene);
    const { container } = render(
      <ActionDuJour idTitre="t" etiquette="É" titre="Titre" action={{ href: "/x", libelle: "Commencer" }} scene={texteScene} />,
    );
    const scene = container.querySelector("[data-premier-pas-scene]") as HTMLElement;
    expect(scene.tagName).toBe("P");
    expect(scene.textContent).toBe(texteScene);
    expect(classes(scene)).toEqual(expect.arrayContaining(["mt-2", "hidden", "md:block", "text-base"]));
    expect(scene.previousElementSibling?.tagName).toBe("H2");
    const lien = scene.nextElementSibling as HTMLElement;
    expect(lien.tagName).toBe("A");
    expect(classes(lien)).toEqual(expect.arrayContaining(["mt-4", "self-start"]));
    expect(classes(lien)).not.toEqual(expect.arrayContaining(["md:self-end"]));
  });

  it("bouton éteint (composant figé) : texte gris secondaire, même 16/600, bord fin gardé", () => {
    const { container } = render(<ActionDuJour idTitre="t" fige etiquette="É" titre="Titre" action={{ href: "/x", libelle: "Commencer" }} />);
    const bouton = container.querySelector("[data-action-du-jour] span[aria-disabled='true']");
    expect(classes(bouton)).toEqual(expect.arrayContaining(["text-base", "font-semibold", "text-text-secondary", "border-border-input"]));
    expect(classes(bouton)).not.toContain("text-text-primary");
  });

  it("`sceneDuPremierPas` : scène du quiz ou du défaut, rien pour un lien de retour", () => {
    const entrees = Object.values(ENTREES_QUIZ).map((id) => ({ id, titre: `Titre ${id}`, minutes: 5, scene: `Scène ${id}` }));
    expect(sceneDuPremierPas(choisirPremierPas(null, null, entrees, SCENE), entrees)).toBe(`Scène ${ENTREE_PAR_DEFAUT}`);
    expect(sceneDuPremierPas(choisirPremierPas(null, "TAQUIN", entrees, SCENE), entrees)).toBe(`Scène ${ENTREES_QUIZ.TAQUIN}`);
    const fiche = { genre: "fiche" as const, titre: "Une vanne", href: "/vannes/x" };
    expect(sceneDuPremierPas(choisirPremierPas(fiche, null, entrees, SCENE), entrees)).toBeNull();
    expect(sceneDuPremierPas(choisirPremierPas(null, null, [], SCENE), [])).toBeNull();
  });
});
