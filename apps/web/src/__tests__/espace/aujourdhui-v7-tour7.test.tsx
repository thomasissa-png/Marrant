/**
 * « Aujourd'hui » s25 v7, tour 7 : décisions de Thomas du 16/11 après les relectures du tour 6 (design 6/10, UX 7/10).
 * 1. Plus de filet violet sur « Aujourd'hui » (`CADRE_CARTE_NEUTRE`) : Z1, cartes du « Contenu du jour », tuiles de
 *    l'extrait ; les autres rubriques gardent `CADRE_CARTE`. Segments du cap et barre d'étapes en gris clair.
 * 2. Z1 en colonne et sur un fond un cran plus clair (`background-elevated`), titre en `TITRE_CARTE`.
 * 3. Rythme de 8 px : pastilles du hero en `px-3`, lien de carte en `-mb-2`.
 * 4. « Tes 4 premières semaines » : mêmes couleurs sur toutes les lignes.
 * La mesure au navigateur (un seul accent violet au premier écran, 4 comptes, 375 et 1280) est dans
 * `playwright/tests/local/espace-aujourdhui-typo-s25.spec.ts`.
 */
import { render } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }),
  usePathname: () => "/mon-espace",
}));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/espace/garde", () => ({ garderEspace: jest.fn(async () => ({ userId: "u1" })) }));

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CADRE_CARTE, CADRE_CARTE_NEUTRE, FILET_CARTE } from "@/components/espace/carte/styles";
import { ApercuAujourdhui } from "@/components/espace/apercu/tableau-verrouille";
import { BarreProgression, CARTE_ACTION, SegmentsCap, TUILE } from "@/components/espace/aujourdhui/tableau";
import { CapDuJour } from "@/components/espace/aujourdhui/cap-du-jour";
import { SemainesTuile } from "@/components/espace/aujourdhui/semaines-tuile";

const classes = (e: Element | null | undefined) => (e?.getAttribute("class") ?? "").split(/\s+/);
const lire = (f: string) => readFileSync(join(__dirname, "../../components/espace", f), "utf8");

describe("décision 1 : un seul accent violet, le bouton plein", () => {
  it("`CADRE_CARTE_NEUTRE` est le cadre de `CADRE_CARTE` sans le filet ; `CADRE_CARTE` garde le filet", () => {
    for (const c of FILET_CARTE.split(" ")) {
      expect(CADRE_CARTE_NEUTRE.split(" ")).not.toContain(c);
      expect(CADRE_CARTE.split(" ")).toContain(c);
    }
    expect(CADRE_CARTE).toBe(`${CADRE_CARTE_NEUTRE} ${FILET_CARTE}`);
  });

  it("Z1, tuiles et cap sans filet ; cartes du « Contenu du jour » sur le cadre neutre", () => {
    for (const c of [CARTE_ACTION, TUILE]) {
      expect(c.split(" ").some((x) => x.startsWith("before:"))).toBe(false);
    }
    const cap = render(<CapDuJour cap={1} xp={0} serie={0} />).container.querySelector("[data-cap-du-jour]");
    expect(classes(cap).some((x) => x.startsWith("before:"))).toBe(false);
    const jour = lire("aujourdhui/contenu-du-jour.tsx");
    expect(jour).toContain("const CARTE = `${CADRE_CARTE_NEUTRE} p-6`;");
    expect(jour).not.toMatch(/\bCADRE_CARTE\b(?!_NEUTRE)/);
  });

  it("extrait de l'aperçu : aucune classe de filet ni de violet dans les tuiles fermées, Z1 comprise (v7 tour 9)", () => {
    render(<ApercuAujourdhui visiteur />);
    for (const t of Array.from(document.querySelectorAll("[data-tuile-fermee]"))) {
      for (const e of [t, ...Array.from(t.querySelectorAll("*"))]) {
        // Anneaux de focus exclus (jamais visibles dans l'extrait inerte, et pas un accent dessiné). v7 tour 8 (décision
        // de l'orchestrateur) : la carte Z1 portait la teinte ; v7 tour 9 : figée, elle est neutre comme les tuiles.
        const violets = classes(e).filter((c) => c.startsWith("before:") || (/accent-/.test(c) && !/(^|:)ring-/.test(c)));
        expect(violets).toEqual([]);
      }
    }
  });

  it("segments du cap et barre d'étapes remplis en gris clair (texte secondaire), jamais en blanc vif", () => {
    const seg = render(<SegmentsCap cap={2} />).container.querySelectorAll("[data-segments-cap] > span");
    expect(Array.from(seg).map((s) => classes(s).find((c) => c.startsWith("bg-")))).toEqual([
      "bg-text-secondary",
      "bg-text-secondary",
      "bg-border-hover",
      "bg-border-hover",
      "bg-border-hover",
    ]);
    const barre = render(<BarreProgression faites={1} total={3} />).container.querySelector("[data-barre-etapes] > span");
    expect(classes(barre)).toContain("bg-text-secondary");
    expect(classes(barre)).not.toContain("bg-text-primary");
  });
});

// v7 tour 8 (décision de l'orchestrateur, qui remplace « Z1 sans couleur » : la page était devenue plate) : Z1 est la
// seule zone d'accent, teinte très légère sur le fond des tuiles et bord violet doux ; jamais un aplat.
describe("décision 2 (tour 8) : Z1, seul point focal violet, léger", () => {
  it("fond des tuiles + dégradé `accent-primary/10` vers transparent, bord `accent-primary/40`, 24 px de marge", () => {
    const c = CARTE_ACTION.split(" ");
    expect(c).toEqual(
      expect.arrayContaining(["bg-background-card", "bg-gradient-to-br", "from-accent-primary/10", "to-transparent", "border-accent-primary/40", "p-6", "flex-col"]),
    );
    expect(c).not.toContain("bg-background-elevated");
    expect(c.some((x) => /^bg-accent-/.test(x))).toBe(false);
  });
});

describe("décisions 3 et 4 : rythme de 8 px, couleurs des semaines", () => {
  it("pastilles du hero en `px-3` (tour 12 : `px-2` retiré, liste en `sr-only` sous 768), lien de carte en `-mb-2` : plus de `2.5` ni de `mt-7`", () => {
    render(<ApercuAujourdhui visiteur />);
    const lis = Array.from(document.querySelectorAll("[data-apercu-pastilles] li"));
    expect(lis).toHaveLength(6);
    for (const li of lis) {
      expect(classes(li)).toEqual(expect.arrayContaining(["px-3", "py-1"]));
      expect(classes(li).some((c) => /2\.5/.test(c))).toBe(false);
    }
    expect(lire("aujourdhui/contenu-du-jour.tsx")).toContain("const lienCarte = `-mb-2 mt-auto ");
    for (const e of Array.from(document.querySelectorAll("[data-apercu-verrouille] *"))) {
      expect(classes(e).filter((c) => /(^|:)-?m[tbxy]?-(2\.5|7)$/.test(c))).toEqual([]);
    }
  });

  it("« Semaine n : » en 14/600 secondaire comme le titre (v7 tour 12), le reste en secondaire, aucune ligne de couleur à part", () => {
    const { container } = render(<SemainesTuile ecouterPublie />);
    const lignes = Array.from(container.querySelectorAll("li[data-semaine]"));
    expect(lignes).toHaveLength(4);
    for (const li of lignes) {
      expect(classes(li)).toContain("text-text-secondary");
      expect(classes(li)).not.toContain("text-text-primary");
      expect(classes(li.querySelector("[data-semaine-prefixe]"))).toEqual(expect.arrayContaining(["font-semibold", "text-text-secondary"]));
      expect(classes(li.querySelector("[data-semaine-prefixe]"))).not.toContain("text-text-primary");
    }
  });
});
