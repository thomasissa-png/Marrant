/**
 * « Aujourd'hui » s25 v7, tour 3 : les fautes dures des relectures du tour 2 (design 7/10, UX 8/10) et les pistes.
 * 1. Rangée 2 de l'extrait lisible : coupe plus haute, fondu qui ne commence qu'à 7 rem (étiquette, titre, barre et
 *    « Étape n sur N » en clair), mission avec son accroche (texte existant) coupée entre deux lignes.
 * 2. Un seul bouton d'offre plein visible : 80 px au-dessus de l'extrait dès 1024 px (fin d'extrait sous 900 px).
 * 3. Éléments figés sans double atténuation (0,75 x 0,60 = 2,9:1) : seule celle de `TuileFermee` reste.
 * Les mesures en pixels (premier écran, contraste, lignes coupées) sont dans
 * `playwright/tests/local/espace-aujourdhui-refonte-s25.spec.ts`.
 */
import { render, within } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }),
  usePathname: () => "/mon-espace",
}));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/espace/garde", () => ({ garderEspace: jest.fn(async () => ({ userId: "u1" })) }));

import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import { TEXTES_ESPACE_NAVIGATION } from "@/config/textes/espace-navigation";
import { ApercuAujourdhui } from "@/components/espace/apercu/tableau-verrouille";
import { TuileFermee } from "@/components/espace/apercu/tuile-fermee";
import { ActionDuJour } from "@/components/espace/aujourdhui/action-du-jour";
import { CartesDuJour } from "@/components/espace/aujourdhui/cartes-du-jour";
import { ParcoursTuile } from "@/components/espace/aujourdhui/etape-en-cours";
import { MissionLien } from "@/components/espace/aujourdhui/mission-lien";
import { QuestionAise } from "@/components/espace/aujourdhui/question-aise";
import { BarreProgression } from "@/components/espace/aujourdhui/tableau";
import { accrocheMission } from "@/lib/espace/enonce-mission";
import { missionOuverte, missionsServiesValidees } from "@/lib/espace/missions";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";

const T = frEspaceProfond(TEXTES_AUJOURDHUI);
const ETAPE_1 = { slug: "repartie", titreParcours: "Répartie", ordre: 1, total: 4, titreEtape: "Tes premières répliques", enCours: false, href: "/parcours/repartie#etape-1" };

/** Toutes les classes d'opacité d'un élément et de ses ancêtres jusqu'à `haut` (exclu). */
function opacites(el: Element, haut: Element): string[] {
  const out: string[] = [];
  for (let e: Element | null = el; e && e !== haut; e = e.parentElement) out.push(...Array.from(e.classList).filter((c) => /^opacity-\d+$/.test(c)));
  return out;
}

describe("faute 1 : rangée 2 de l'extrait lisible avant le fondu", () => {
  it("coupe de 13,5 rem (échelle s25), opaque sur ses 9 premiers rem (v7 tour 11), transparente sur ses 48 derniers px", () => {
    render(<ApercuAujourdhui visiteur />);
    const suite = document.querySelector("[data-apercu-suite]") as HTMLElement;
    expect(suite.className).toMatch(/(^|\s)h-\[13\.5rem\](\s|$)/);
    expect(suite.className).toContain("[mask-image:linear-gradient(to_bottom,black_9rem,transparent_calc(100%_-_3rem))]");
  });

  it("la tuile Mission de l'extrait porte l'accroche de la mission d'un nouvel abonné (texte existant), coupée en 3 lignes", () => {
    render(<ApercuAujourdhui visiteur />);
    const suite = document.querySelector("[data-apercu-suite]") as HTMLElement;
    const mission = missionOuverte(missionsServiesValidees(), []);
    expect(mission?.marche).toBe(1);
    const accroche = suite.querySelector("[data-mission-accroche]") as HTMLElement;
    expect(accroche.textContent).toBe(frEspace(accrocheMission(mission?.enonce ?? [])));
    // Coupée entre deux lignes (échelle s25 : 3 x 1,5 rem en `TEXTE`), sans points de suspension (`line-clamp`
    // couperait un mot).
    expect(accroche.className).toContain("max-h-[4.5rem]");
    expect(accroche.className).toContain("overflow-hidden");
    expect(accroche.className).not.toMatch(/line-clamp/);
  });

  it("hors extrait, l'accroche de la mission n'est jamais coupée", () => {
    const { container } = render(<MissionLien marche={2} accroche="Une phrase." />);
    expect(container.querySelector("[data-mission-accroche]")?.className).not.toMatch(/max-h-|overflow-hidden/);
  });
});

describe("faute 2 : jamais deux boutons d'offre pleins au premier écran", () => {
  it("48 px au-dessus de l'extrait dès 768, 64 dès 1024 (v7 tour 12), fin à 16 px dans le transparent dès 1024, suite de 13,5 rem (échelle s25 ; fin contrôlée en vrai navigateur à 900 px)", () => {
    render(<ApercuAujourdhui visiteur />);
    expect(document.querySelector("[data-apercu-extrait]")?.className).toContain("md:mt-12");
    expect(document.querySelector("[data-apercu-extrait]")?.className).toContain("lg:mt-16");
    expect(document.querySelector("[data-apercu-fin]")?.className).toContain("lg:-mt-4");
    expect(document.querySelector("[data-apercu-suite]")?.className).toContain("h-[13.5rem]");
  });
});

describe("faute 3 : éléments figés à une seule atténuation", () => {
  it("bouton « Commencer » et pied de tuile figés : aucune opacité propre, seulement celle de `TuileFermee` (0,75)", () => {
    render(<ApercuAujourdhui visiteur />);
    const figes = Array.from(document.querySelectorAll("[data-apercu-extrait] span[aria-disabled='true']"));
    expect(figes.length).toBeGreaterThanOrEqual(2);
    for (const f of figes) {
      expect(f.className).not.toMatch(/(^|\s)opacity-\d+/);
      expect(f.className).toContain("pointer-events-none");
    }
  });

  it("les composants figés seuls n'ajoutent aucune opacité ; la tuile fermée garde la sienne", () => {
    const { container } = render(
      <TuileFermee>
        <ParcoursTuile etape={ETAPE_1} fige />
      </TuileFermee>,
    );
    const tuile = container.querySelector("[data-tuile-fermee]") as HTMLElement;
    expect(tuile.className).toContain("opacity-75");
    const pied = container.querySelector("span[aria-disabled='true']") as HTMLElement;
    expect(opacites(pied, tuile)).toEqual([]);
    const action = render(<ActionDuJour idTitre="t" fige etiquette="É" titre="Titre" action={{ href: "/x", libelle: "Commencer" }} />).container;
    expect(opacites(action.querySelector("span[aria-disabled='true']") as HTMLElement, action)).toEqual([]);
  });
});

describe("pistes du tour 2", () => {
  it("Z1 « Si tu as 5 minutes » : étiquette (libellé existant de la rubrique, casse normale depuis l'échelle s25), titre collé au bouton, accroche dessous", () => {
    const { container } = render(<CartesDuJour cartes={[{ titre: "La poêle", href: "/c", nouvelle: true }]} href="/mon-espace/s-entrainer" fini={false} />);
    const carte = container.querySelector("[data-action-du-jour]") as HTMLElement;
    const etiquette = carte.querySelector("p") as HTMLElement;
    expect(etiquette.className).not.toMatch(/uppercase/);
    expect(etiquette.textContent).toBe(TEXTES_ESPACE_NAVIGATION.index.sEntrainer);
    const titre = within(carte).getByRole("heading", { level: 2 });
    expect(titre.textContent).toBe(T.rafale.titre);
    // Le bouton suit immédiatement le titre (condition du libellé 7) ; v7 tour 7 : dans la même colonne, juste dessous.
    expect(titre.nextElementSibling?.textContent).toBe(T.rafale.bouton);
    const accroche = carte.querySelector("[data-rafale-accroche]") as HTMLElement;
    expect(accroche.textContent).toBe(T.rafale.accroche);
    expect(accroche.className).toContain("text-text-secondary");
    expect(titre.compareDocumentPosition(accroche) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("question C9 : les quatre puces réparties sur toute leur colonne dès 768 px", () => {
    const { container } = render(<QuestionAise />);
    const groupe = container.querySelector("[role='group']") as HTMLElement;
    expect(groupe.className).toContain("md:grid-cols-4");
    expect(groupe.querySelectorAll("button")).toHaveLength(4);
  });

  it("rail de la barre d'étapes visible à zéro (piste, pas un trait éteint)", () => {
    const { container } = render(<BarreProgression faites={0} total={4} />);
    expect(container.querySelector("[data-barre-etapes]")?.className).toContain("bg-border-hover");
  });
});
