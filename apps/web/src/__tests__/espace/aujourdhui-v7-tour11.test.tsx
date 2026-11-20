/**
 * « Aujourd'hui » s25 v7, tour 11 : relectures du tour 10 (design 8/10, UX 7/10, sans faute dure).
 * 1. Extrait plus parlant : Z1 « Ton premier pas » à pleine netteté (verrou et bouton éteint gardés), les autres tuiles
 *    atténuées ; nom de l'étape en `TEXTE` ; fondu à 9 rem.
 * 2. Prospect à 375 : pastilles du hero en `sr-only` sous 768, preuve hors de la carte sous 768 (sous la promesse).
 * 4. Abonné : cap calé en haut à 768, chiffres XP et série chacun dans sa case, flamme d'une série en cours en blanc.
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
import { CapDuJour } from "@/components/espace/aujourdhui/cap-du-jour";
import { TEXTE } from "@/components/espace/typo";

const classes = (e: Element | null | undefined) => (e?.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
const tri = (c: string) => c.split(/\s+/).filter(Boolean).sort();

describe("point 1 : extrait plus parlant", () => {
  it("Z1 nette (sans atténuation), verrou gardé, répliques fermées à la place du bouton éteint (v7 tour 13) ; les autres tuiles atténuées", () => {
    render(<ApercuAujourdhui visiteur />);
    const tuiles = Array.from(document.querySelectorAll("[data-tuile-fermee]"));
    expect(tuiles).toHaveLength(5);
    const [z1, ...autres] = tuiles;
    expect(z1.getAttribute("data-tuile-fermee")).toBe("nette");
    expect(z1.className).not.toContain("opacity-75");
    expect(z1.querySelector(":scope > [data-verrou-ferme]")).not.toBeNull();
    expect(z1.querySelector("[aria-disabled='true']")).toBeNull();
    expect(z1.querySelectorAll("[data-replique-fermee]")).toHaveLength(3);
    for (const t of autres) {
      expect(t.className).toContain("[&>*:not([data-verrou-ferme])>*]:opacity-75");
      expect(t.querySelector(":scope > [data-verrou-ferme]")).not.toBeNull();
    }
  });

  it("nom de l'étape conseillée en `TEXTE` ; fondu à 9 rem, même point transparent", () => {
    render(<ApercuAujourdhui visiteur />);
    const parcours = document.querySelector("[data-testid='parcours-tuile']") as HTMLElement;
    const nom = parcours.querySelector("h2 ~ p ~ p");
    expect(classes(nom)).toEqual(expect.arrayContaining(tri(TEXTE)));
    // s26 contrôle d'ensemble, aperçus : rangée « émoji + pastille » (+12 px), coupe et fondu décalés d'autant.
    expect(document.querySelector("[data-apercu-suite]")?.className).toContain("black_9.75rem,transparent_calc(100%_-_3rem)");
  });
});

describe("point 2 : prospect à 375", () => {
  it("pastilles lues mais hors du rendu visuel sous 768 ; une preuve hors carte sous 768 et dès 1024", () => {
    render(<ApercuAujourdhui visiteur />);
    expect(classes(document.querySelector("[data-apercu-pastilles]"))).toContain("max-md:sr-only");
    expect(document.querySelectorAll("[data-apercu-pastilles] li").length).toBe(6);
    // s26 liste et détail (spec design §5, critère UX 11) : « 1 500+ » retiré des aperçus de l'espace, du hero comme de
    // la carte d'offre ; l'ancienne attente (preuve du hero lue à toutes les largeurs) n'a plus cours.
    expect(document.querySelector("[data-apercu-hero] [data-preuve]")).toBeNull();
    expect(document.body.textContent).not.toContain("1 500+");
  });
});

describe("point 4 : abonné moins monotone", () => {
  it("bandeau calé en haut à 768 ; XP et série chacun dans sa case ; flamme blanche", () => {
    const { container } = render(<CapDuJour cap={2} xp={250} serie={3} />);
    const section = container.querySelector("[data-cap-du-jour]");
    expect(classes(section)).toEqual(expect.arrayContaining(["md:items-start", "md:flex-wrap"]));
    expect(classes(section)).not.toContain("md:items-center");
    const chiffres = container.querySelector("[data-cap-chiffres]");
    expect(classes(chiffres)).toEqual(expect.arrayContaining(["[&>*]:rounded-xl", "[&>*]:bg-background-elevated", "[&>*]:p-4"]));
    expect(chiffres?.children).toHaveLength(2);
    expect(chiffres?.querySelector("svg")?.getAttribute("class")).toContain("text-text-primary");
  });

  it("sans chiffres (nouvel abonné) : la phrase de série seule, sans case", () => {
    const { container } = render(<CapDuJour cap={1} xp={0} serie={0} />);
    expect(container.querySelector("[data-cap-chiffres]")).toBeNull();
  });
});
