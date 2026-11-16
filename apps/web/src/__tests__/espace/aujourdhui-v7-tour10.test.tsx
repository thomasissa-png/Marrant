/**
 * « Aujourd'hui » s25 v7, tour 10 : relecture design du tour 9 (7/10, une faute) et pistes.
 * 1. Légende de l'aperçu (« Voici un exemple… ») en tête de l'extrait, une seule fois ; air de 64 px dès 1024
 *    (128 avant) ; positions mesurées en vrai navigateur (`espace-aujourdhui-refonte-s25.spec.ts`).
 * 2. « Tes 4 premières semaines » en étiquette : sur la ligne de « Étape conseillée », la première semaine sur celle de
 *    « Répartie » (au navigateur : `espace-aujourdhui-refonte-s25.spec.ts`).
 * 3. Verrou des tuiles fermées centré sur leur première ligne (boîte de 20 px).
 */
import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }),
  usePathname: () => "/mon-espace",
}));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/espace/garde", () => ({ garderEspace: jest.fn(async () => ({ userId: "u1" })) }));

import { ApercuAujourdhui } from "@/components/espace/apercu/tableau-verrouille";
import { SemainesTuile } from "@/components/espace/aujourdhui/semaines-tuile";
import { TITRE_TUILE } from "@/components/espace/aujourdhui/tableau";
import { ETIQUETTE, META, TITRE_CARTE } from "@/components/espace/typo";
import { TEXTES_APERCU } from "@/config/textes/espace-apercu";
import { frEspace } from "@/lib/fr-typo";

const classes = (e: Element | null | undefined) => (e?.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
const tri = (c: string) => c.split(/\s+/).filter(Boolean).sort();

describe("point 1 : la légende en tête de l'extrait", () => {
  it("une seule légende, premier enfant de l'extrait, avant les tuiles inertes, en `META`", () => {
    render(<ApercuAujourdhui visiteur />);
    const legendes = screen.getAllByText(frEspace(TEXTES_APERCU.sousTitre));
    expect(legendes).toHaveLength(1);
    const extrait = document.querySelector("[data-apercu-extrait]") as HTMLElement;
    expect(extrait.firstElementChild).toBe(legendes[0]);
    expect(legendes[0].hasAttribute("data-apercu-legende")).toBe(true);
    expect(legendes[0].nextElementSibling?.getAttribute("aria-hidden")).toBe("true");
    expect(classes(legendes[0])).toEqual(expect.arrayContaining(tri(META)));
    expect(classes(legendes[0])).not.toContain("text-center");
    // Rien sous la fin d'extrait : la page finit sur le bouton.
    expect(document.querySelector("[data-apercu-fin]")?.nextElementSibling).toBeNull();
  });

  it("air : 24 px sous 768, 48 dès 768, 64 dès 1024 (v7 tour 12) ; légende à 8, 16 puis 24 px des tuiles", () => {
    render(<ApercuAujourdhui visiteur />);
    const air = classes(document.querySelector("[data-apercu-extrait]")).filter((c) => /(^|:)mt-/.test(c));
    expect(air).toEqual(["mt-6", "md:mt-12", "lg:mt-16"]);
    expect(classes(document.querySelector("[data-apercu-legende]")).filter((c) => /(^|:)mb-/.test(c))).toEqual(["mb-2", "md:mb-4", "lg:mb-6"]);
  });
});

describe("point 2 : « Tes 4 premières semaines » aligné sur sa voisine", () => {
  it("titre de la tuile en `ETIQUETTE` (toujours le `h2`), sans ligne vide ni marge au-dessus, liste à 8 px dessous", () => {
    const { container } = render(<SemainesTuile ecouterPublie />);
    const tuile = container.querySelector("[data-semaines]") as HTMLElement;
    const h2 = tuile.firstElementChild as HTMLElement;
    expect(h2.tagName).toBe("H2");
    expect(classes(h2).sort()).toEqual(tri(ETIQUETTE));
    expect(classes(h2).some((c) => /font-display|text-xl/.test(c))).toBe(false);
    // Même pas que la voisine : étiquette, 8 px (`TITRE_TUILE`), puis la ligne suivante.
    expect(TITRE_TUILE).toBe(`mt-2 ${TITRE_CARTE}`);
    expect(classes(h2.nextElementSibling)).toContain("mt-2");
  });
});

describe("point 3 : verrou des tuiles fermées", () => {
  it("boîte de 20 px, icône centrée, toujours en haut à droite (24 px)", () => {
    render(<ApercuAujourdhui visiteur />);
    const verrous = Array.from(document.querySelectorAll("[data-tuile-fermee] > [data-verrou-ferme]"));
    expect(verrous.length).toBeGreaterThan(0);
    for (const v of verrous) expect(classes(v)).toEqual(expect.arrayContaining(["absolute", "right-6", "top-6", "flex", "h-5", "items-center"]));
  });
});
