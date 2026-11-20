/**
 * « Aujourd'hui » s25 v7, tour 2 : les cinq fautes dures des relectures du tour 1 (design et UX, 6/10) et les pistes.
 * 1. Z1 et Z2 sans vide en bas : plus de hauteur minimale sur la carte d'action (la rangée se cale sur le contenu).
 * 2. « Étape conseillée » pleine : barre à zéro et « Étape 1 sur N » (données réelles), feuille de route plus serrée,
 *    les deux tuiles en pleine largeur à 768.
 * 3. Contenu du jour sans creux : vidéo à droite sur deux rangées dès 1024, pieds de carte en `mt-auto`.
 * 4. Extrait de l'aperçu : la rangée 1 (premier pas, « Ton cap ») entière, seule la suite passe sous le fondu.
 * 5. « Tes 4 premières semaines » : « Semaine n : » visible, aucune ligne qui commence en minuscule.
 * Les mesures en pixels (vides, coupe du fondu) sont dans `playwright/tests/local/espace-aujourdhui-refonte-s25.spec.ts`.
 */
import { act, render } from "@testing-library/react";
import { readFileSync } from "fs";
import { join } from "path";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }),
  usePathname: () => "/mon-espace",
}));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/espace/garde", () => ({ garderEspace: jest.fn(async () => ({ userId: "u1" })) }));

import { TEXTES_PARCOURS_ESPACE } from "@/config/textes/espace-caps";
import { TEXTES_APERCU } from "@/config/textes/espace-apercu";
import { ApercuAujourdhui } from "@/components/espace/apercu/tableau-verrouille";
import { ActionDuJour } from "@/components/espace/aujourdhui/action-du-jour";
import { CARTE_ACTION } from "@/components/espace/aujourdhui/tableau";
import { ParcoursTuile } from "@/components/espace/aujourdhui/etape-en-cours";
import { SemainesTuile } from "@/components/espace/aujourdhui/semaines-tuile";
import { MissionLien } from "@/components/espace/aujourdhui/mission-lien";
import { ContenuDuJour } from "@/components/espace/aujourdhui/contenu-du-jour";
import { accrocheMission } from "@/lib/espace/enonce-mission";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";

const SRC = join(__dirname, "../..");
const lire = (f: string) => readFileSync(join(SRC, f), "utf8");
const P = frEspaceProfond(TEXTES_PARCOURS_ESPACE);
const ETAPE_1 = { slug: "repartie", titreParcours: "Répartie", ordre: 1, total: 4, titreEtape: "Tes premières répliques", enCours: false, href: "/parcours/repartie#etape-1" };

describe("faute 1 : Z1 et Z2 à la hauteur de leur contenu", () => {
  it("la carte d'action n'a plus de hauteur minimale, ni dans la page ni dans l'extrait", () => {
    expect(CARTE_ACTION).not.toMatch(/min-h-/);
    const { container } = render(<ActionDuJour idTitre="t" etiquette="É" titre="Titre" action={{ href: "/x", libelle: "Go" }} />);
    expect(container.querySelector("[data-action-du-jour]")?.className).not.toMatch(/min-h-/);
  });

  it("v7 tour 7 : contenu calé en haut, en colonne (étiquette, titre 8 px dessous, bouton 16 px dessous, à gauche), le surplus en bas de carte", () => {
    const { container } = render(<ActionDuJour idTitre="t" etiquette="É" titre="Titre" action={{ href: "/x", libelle: "Go" }} />);
    const carte = container.querySelector("[data-action-du-jour]") as HTMLElement;
    const [entete, titre, bouton] = Array.from(carte.children) as HTMLElement[];
    expect(titre.tagName).toBe("H2");
    expect(titre.className.split(/\s+/)).toContain("mt-2");
    expect(bouton.textContent).toBe("Go");
    expect(bouton.className.split(/\s+/)).toEqual(expect.arrayContaining(["mt-4", "self-start", "md:w-auto"]));
    // Rien n'étire ni ne pousse le contenu vers le bas : le surplus de hauteur reste sous le dernier élément.
    for (const el of [entete, titre, bouton]) {
      expect(el.className.split(/\s+/).filter((x) => /^(?:[a-z0-9]+:)*(flex-1|content-(between|around|evenly|end|center)|mt-auto|h-full)$/.test(x))).toEqual([]);
    }
    expect(carte.className).not.toMatch(/justify-(between|around|evenly|end|center)/);
  });
});

describe("faute 2 : « Étape conseillée » pleine", () => {
  it("barre à zéro et « Étape 1 sur N » quand l'étape n'est pas commencée", () => {
    const { container } = render(<ParcoursTuile etape={ETAPE_1} />);
    const barre = container.querySelector("[data-barre-etapes]") as HTMLElement;
    expect(barre).not.toBeNull();
    expect((barre.firstElementChild as HTMLElement).style.width).toBe("0%");
    expect(barre.className).toContain("bg-border");
    expect(container.textContent).toContain(P.etapeSurTotal(1, 4));
  });

  it("nouvel abonné : les deux tuiles de la rangée 2 en pleine largeur à 768, 5 + 7 dès 1024", () => {
    const page = lire("app/(dashboard)/mon-espace/page.tsx");
    expect(page).toContain('span: "md:col-span-2 lg:col-span-5"');
    expect(page).toContain('span: etape ? "md:col-span-2 lg:col-span-7" : undefined');
  });
});

describe("faute 3 : Contenu du jour sans creux", () => {
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

  it("avec vignette : vidéo à droite sur deux rangées dès 1024, cartes en colonne, pieds en `mt-auto`", async () => {
    const c = await rendre("abc123");
    const grille = c.querySelector("[data-jour-grille]") as HTMLElement;
    expect(grille.className).toContain("items-stretch");
    expect(grille.className).not.toContain("lg:grid-cols-3");
    const video = c.querySelector("#jour-video")?.closest("article") as HTMLElement;
    expect(video.className).toMatch(/lg:col-start-2/);
    expect(video.className).toMatch(/lg:row-span-2/);
    for (const id of ["jour-vanne", "jour-conseil", "jour-video"]) expect(c.querySelector(`#${id}`)?.closest("article")?.className).toContain("flex-col");
    expect(c.querySelector("[data-vanne-pied]")?.className).toContain("mt-auto");
    expect(c.querySelector('a[href^="/conseils/"]')?.className).toContain("mt-auto");
  });

  it("sans vignette : trois cartes côte à côte dès 1024, comme avant", async () => {
    const c = await rendre(null);
    expect(c.querySelector("[data-jour-grille]")?.className).toContain("lg:grid-cols-3");
    expect(c.querySelector("#jour-video")?.closest("article")?.className).not.toMatch(/row-span/);
  });
});

describe("faute 4 : extrait de l'aperçu, « Ton cap » avant le fondu", () => {
  it("rangée 1 entière hors fondu ; la suite seule coupée, transparente sur ses 48 derniers px", () => {
    render(<ApercuAujourdhui visiteur />);
    const extrait = document.querySelector("[data-apercu-extrait] > [aria-hidden]") as HTMLElement;
    expect(extrait.className).not.toMatch(/\bh-\d|h-\[|mask-image/);
    const r1 = extrait.querySelector('[data-apercu-rangee="1"]') as HTMLElement;
    expect(r1.querySelector("[data-action-du-jour]")).not.toBeNull();
    expect(r1.querySelector("[data-cap-du-jour]")).not.toBeNull();
    expect(r1.closest("[data-apercu-suite]")).toBeNull();
    const suite = extrait.querySelector("[data-apercu-suite]") as HTMLElement;
    // v7 tour 3 (faute 1) : la coupe est plus haute (12,5 rem au lieu de 10 ; 13,5 depuis l'échelle s25, tuiles en
    // 24 px de marge ; 14,25 depuis s26 contrôle d'ensemble, aperçus : rangée « émoji + pastille », +12 px) ; elle reste
    // fixe, transparente au bout.
    expect(suite.className).toMatch(/(^|\s)h-\[14\.25rem\](\s|$)/);
    expect(suite.className).toContain("transparent_calc(100%_-_3rem)");
    expect(suite.querySelectorAll("[data-tuile-fermee]")).toHaveLength(3);
  });
});

describe("faute 5 : « Tes 4 premières semaines », préfixe visible", () => {
  it.each([true, false])("chaque ligne commence par « Semaine n » visible (écouter publié : %s)", (ecouterPublie) => {
    const { container } = render(<SemainesTuile ecouterPublie={ecouterPublie} />);
    const lignes = Array.from(container.querySelectorAll("li"));
    expect(lignes).toHaveLength(4);
    lignes.forEach((li, i) => {
      expect(li.querySelector(".sr-only")).toBeNull();
      const prefixe = li.querySelector("[data-semaine-prefixe]") as HTMLElement;
      expect(prefixe.textContent?.replace(/\s/g, " ")).toMatch(new RegExp(`^Semaine ${i + 1}\\s?:$`));
      const t = (li.textContent ?? "").trim();
      expect(t.charAt(0)).toBe(t.charAt(0).toLocaleUpperCase("fr-FR"));
      expect(t.startsWith(`Semaine ${i + 1}`)).toBe(true);
    });
    // Libellés repris mot pour mot (le texte suit le préfixe, rien n'est réécrit).
    expect(container.textContent).toContain("le faux secret");
  });
});

describe("pistes", () => {
  it("hero 8/4 : les 6 pastilles ont la place sur une ligne dès 1024 (plus d'orpheline à 1280)", () => {
    const hero = lire("components/espace/apercu/hero-apercu.tsx");
    // v7 tour 4 (piste 768) : 3/5 et 2/5 de 768 à 1023, 8/4 dès 1024 inchangé.
    // Échelle s25 : la colonne de texte devient une colonne flex.
    // s26 tour 2 des encarts (E2) : plus de 3/5 et 2/5 de 768 à 1023 (carte d'offre sous le texte, en ligne).
    expect(hero).toContain('<div className="flex min-w-0 flex-col lg:col-span-8">');
    // v7 tour 3 (piste hero) : l'offre s'aligne en haut sur la pastille. Échelle s25 : la colonne de texte (24/30 px)
    // a la hauteur de l'offre (grille étirée). v7 tour 6 : pastilles sous la promesse, plus calées en bas
    // (`md:mt-auto` creusait un vide au milieu) ; le surplus passe en bas de colonne.
    expect(hero).toContain('<div className="min-w-0 lg:col-span-4">');
    expect(hero).not.toContain("mt-auto");
    // v7 tour 8 : la tête (pastille et H1) porte son propre `md:items-start` (pastille calée à gauche, au-dessus du
    // H1) ; la règle vise la grille du hero et ses deux colonnes, jamais calées en haut ni au centre.
    const grille = /<div className="(grid [^"]*)" data-apercu-hero>/.exec(hero)?.[1] ?? "";
    expect(grille).not.toContain("md:grid-cols-5");
    expect(grille).toContain("lg:grid-cols-12");
    // s26 liste et détail (spec design §5.1) : sans la preuve, la carte d'offre n'est plus étirée et la grille du hero
    // passe en `lg:items-start` (carte à sa hauteur propre, dès 1024 seulement) ; jamais calée au centre, rien sous 1024.
    expect(grille).not.toMatch(/(^|\s)(md:)?items-(start|center)/);
    expect(grille).not.toMatch(/items-center/);
    expect(grille).toContain("lg:items-start");
    expect(hero.replace(/<div className="[^"]*" data-apercu-tete>/, "")).not.toMatch(/md:items-(start|center)/);
    expect(hero).not.toContain("md:max-w-2xl");
  });

  it("« Connexion » à 44 px de haut, en gris ; réassurance sous la phrase d'objet (échelle s25 : `META`, 14 px, gris secondaire)", () => {
    render(<ApercuAujourdhui visiteur />);
    const offre = document.querySelector("[data-apercu-offre]") as HTMLElement;
    const connexion = Array.from(offre.querySelectorAll("a")).find((a) => a.textContent === TEXTES_APERCU.connexion) as HTMLElement;
    for (const c of ["inline-flex", "min-h-11", "items-center", "min-w-11"]) expect(connexion.className.split(/\s+/)).toContain(c);
    const reassurance = offre.querySelector("[data-reassurance]") as HTMLElement;
    expect(connexion.className.split(/\s+/)).toContain("text-text-secondary");
    expect(connexion.className).not.toMatch(/text-accent-link/);
    expect(reassurance.className.split(/\s+/)).toEqual(expect.arrayContaining(["text-sm", "text-text-secondary"]));
    expect(reassurance.className).not.toMatch(/text-xs|text-text-muted|text-text-primary|leading-/);
  });

  it("Mission : l'accroche (phrases entières de l'énoncé, préfixe DÉFI retiré) sous le titre", () => {
    const enonce = [
      "DÉFI FAIT DIVERS : pense à un petit ridicule récent (un oubli). Écris-le d'abord en verdict (« je suis nul en... »), puis en fait raconté. Envoie la seconde version à un ami aujourd'hui, avec un détail précis et concret en plus.",
    ];
    expect(accrocheMission(enonce)).toBe(accrocheMission(enonce, 240));
    expect(accrocheMission(enonce, 130)).toBe("Pense à un petit ridicule récent (un oubli). Écris-le d'abord en verdict (« je suis nul en... »), puis en fait raconté.");
    expect(accrocheMission(enonce, 50)).toBe("Pense à un petit ridicule récent (un oubli).");
    expect(accrocheMission(["Une seule phrase sans point final"])).toBe("Une seule phrase sans point final");
    const { container } = render(<MissionLien marche={2} accroche="Pense à un petit ridicule récent." />);
    expect(container.querySelector("[data-mission-accroche]")?.textContent).toBe(frEspace("Pense à un petit ridicule récent."));
    const { container: sans } = render(<MissionLien marche={1} fige />);
    expect(sans.querySelector("[data-mission-accroche]")).toBeNull();
  });
});
