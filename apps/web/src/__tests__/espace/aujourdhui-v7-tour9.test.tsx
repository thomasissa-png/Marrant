/**
 * « Aujourd'hui » s25 v7, tour 9 : corrections des fautes dures des relectures du tour 8 (design 7/10, UX 8/10).
 * 1. Carte « Ton premier pas » de l'extrait fermé (visiteur, gratuit) : cadre neutre des tuiles (`TUILE`), ni bord ni
 *    teinte violette ; l'abonné garde `CARTE_ACTION` (au navigateur : `espace-aujourdhui-typo-s25.spec.ts`).
 * 2. Hero de l'aperçu dès 1024 px : la preuve sous les pastilles (`mt-6`, mêmes classes de l'échelle) ; sous 1024, dans
 *    la carte d'offre. Une seule affichée à chaque largeur (l'autre en `display: none`). « Connexion » reste dans la carte.
 * 3. Cibles : « Une autre » et les puces de la question C9 à 44 px au moins (`min-h-11`, déjà en place).
 */
import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }),
  usePathname: () => "/mon-espace",
}));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/espace/garde", () => ({ garderEspace: jest.fn(async () => ({ userId: "u1" })) }));

import { ApercuAujourdhui } from "@/components/espace/apercu/tableau-verrouille";
import { HeroApercu } from "@/components/espace/apercu/hero-apercu";
import { OffreApercu } from "@/components/espace/apercu/offre-apercu";
import { ActionDuJour } from "@/components/espace/aujourdhui/action-du-jour";
import { CARTE_ACTION, TUILE } from "@/components/espace/aujourdhui/tableau";
import { puce } from "@/components/espace/carte/styles";

const classes = (e: Element | null | undefined) => (e?.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
const tri = (c: string) => c.split(/\s+/).filter(Boolean).sort();
const lire = (f: string) => readFileSync(join(process.cwd(), "src/components/espace", f), "utf8");

describe("point 1 : Z1 figée au cadre neutre", () => {
  it("extrait de l'aperçu : la carte « Ton premier pas » a exactement les classes de `TUILE`, sans violet", () => {
    render(<ApercuAujourdhui visiteur />);
    const z1 = document.querySelector("[data-action-du-jour]");
    expect(z1).not.toBeNull();
    expect(classes(z1).filter((c) => c !== "max-e300:p-3").sort()).toEqual(tri(TUILE));
    expect(classes(z1).some((c) => /accent-|gradient/.test(c))).toBe(false);
  });

  it("abonné : Z1 garde `CARTE_ACTION` (teinte et bord violets) autour de son bouton plein", () => {
    const { container } = render(
      <ActionDuJour idTitre="t" etiquette="É" titre="Titre" action={{ href: "/x", libelle: "Commencer" }} data-x="1" />,
    );
    const z1 = container.querySelector("[data-action-du-jour]");
    expect(classes(z1).filter((c) => c !== "max-e300:p-3").sort()).toEqual(tri(CARTE_ACTION));
    expect(classes(z1)).toEqual(expect.arrayContaining(["border-accent-primary/40", "from-accent-primary/10"]));
  });
});

describe("point 2 : preuve sous les pastilles dès 1024", () => {
  const offre = { href: "/abonnement", adresse: "/mon-espace", visiteur: true };

  it("hero : preuve de la colonne de texte affichée dès 1024 seulement, à 24 px sous les pastilles", () => {
    const { container } = render(<HeroApercu titre="Aujourd'hui" promesse="P" pastilles={["a", "b"]} offre={offre} />);
    const hero = container.querySelector("[data-preuve='hero']");
    expect(hero?.previousElementSibling?.hasAttribute("data-apercu-pastilles")).toBe(true);
    expect(classes(hero)).toEqual(expect.arrayContaining(["mt-6", "hidden", "lg:block", "text-sm"]));
    expect(hero?.querySelector("span")?.className).toContain("text-xl");
  });

  it("hero : preuve de la carte masquée dès 1024 (une seule affichée à chaque largeur), « Connexion » gardée", () => {
    const { container } = render(<HeroApercu titre="Aujourd'hui" promesse="P" pastilles={["a"]} offre={offre} />);
    const carte = container.querySelector("[data-apercu-offre] [data-preuve='carte']");
    expect(classes(carte)).toEqual(expect.arrayContaining(["lg:hidden", "mt-4", "pt-4", "md:mt-6", "md:pt-6"]));
    expect(container.querySelectorAll("[data-preuve]")).toHaveLength(2);
    expect(container.querySelector("[data-apercu-offre] a[href*='login'], [data-apercu-offre] a[href*='connexion']")).not.toBeNull();
  });

  it("carte d'offre seule (sans `preuveHors`) : preuve affichée à toutes les largeurs", () => {
    const { container } = render(<OffreApercu {...offre} />);
    expect(classes(container.querySelector("[data-preuve]"))).not.toContain("lg:hidden");
  });
});

describe("point 3 : cibles de 44 px", () => {
  it("« Une autre » et les puces de la vanne en `min-h-11` ; puces de la question C9 (`puce`) en `min-h-11`", () => {
    const vanne = lire("aujourdhui/vanne-toucher.tsx");
    const bouton = /onClick=\{\(\) => void uneAutre\(\)\}[\s\S]*?className="([^"]+)"/.exec(vanne);
    expect(bouton?.[1]).toContain("min-h-11");
    expect(puce(false)).toContain("min-h-11");
    expect(puce(true)).toContain("min-h-11");
    expect(lire("aujourdhui/question-aise.tsx")).toMatch(/className=\{cn\(puce\(false\)/);
  });
});
