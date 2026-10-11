/** @jest-environment node */
/**
 * Tests — mesure des glyphes (TTF réel) et mise en lignes équilibrée
 * des cartes sociales v3 (notation @design cycle 2, point 2).
 */
import { readFileSync } from "fs";
import { join } from "path";
import { enregistrerPolice, largeurTexte, lireMetriques, policeEnregistree } from "@/lib/social/mesure-texte";
import { mettreEnLignes, affichage, PLANCHER_CORPS } from "@/lib/social/mise-en-lignes";
import { typo } from "@/lib/social/typo";

const FAMILLE = "Plus Jakarta Sans";
const police = { famille: FAMILLE, poids: 800 };

function ttf(nom: string): ArrayBuffer {
  const b = readFileSync(join(process.cwd(), "public", "fonts", nom));
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
}

beforeAll(() => {
  enregistrerPolice(FAMILLE, 800, ttf("PlusJakartaSans-ExtraBold.ttf"));
});

const nbMots = (l: string) => l.split(/[  ]+/).filter((m) => m && !/^[:;?!»«.,]+$/.test(m)).length;

describe("mesure-texte", () => {
  it("lit les avances du TTF (unitsPerEm 1000, espace 180, point 408)", () => {
    const m = lireMetriques(ttf("PlusJakartaSans-ExtraBold.ttf"));
    expect(m.unitsPerEm).toBe(1000);
    expect(m.avance(32)).toBe(180);
    expect(m.avance(46)).toBe(408);
    expect(m.avance(0x202f)).toBeNull(); // absente : on affiche U+2009
  });

  it("mesure en pixels au corps demandé (somme des avances, chiffres compris)", () => {
    expect(policeEnregistree(FAMILLE, 800)).toBe(true);
    expect(largeurTexte(" ", FAMILLE, 800, 100)).toBeCloseTo(18, 5);
    const quatre = largeurTexte("4", FAMILLE, 800, 100);
    const cinq = largeurTexte("5", FAMILLE, 800, 100);
    expect(largeurTexte("45", FAMILLE, 800, 100)).toBeCloseTo(quatre + cinq, 5);
    expect(largeurTexte("1", FAMILLE, 800, 100)).toBeGreaterThan(0);
  });

  it("police inconnue ou TTF illisible : repli prudent, sans exception", () => {
    expect(() => enregistrerPolice("X", 400, new ArrayBuffer(100))).not.toThrow();
    expect(largeurTexte("abc", "Inconnue", 400, 100)).toBeCloseTo(186, 0);
  });
});

describe("mettreEnLignes", () => {
  const cas = [
    "L'audioguide du musée s'est éteint dans la première salle.",
    "J'ai hoché la tête pendant deux heures.",
    "Dans le TGV, la seule prise qui marche est sous le siège d'un inconnu.",
    "Blagues d'Halloween : 8 vannes pour ta soirée déguisée",
    "Le serveur commençait à croire qu'on t'avait inventé.",
    "Il en a plein. Moi, je tiens la laisse.",
  ];

  it.each(cas)("aucun mot seul, aucune ligne trop large : %s", (t) => {
    const { lignes, corps } = mettreEnLignes(typo(t), police, 100, 888);
    for (const l of lignes) {
      expect(nbMots(l)).toBeGreaterThanOrEqual(2);
      expect(largeurTexte(l, FAMILLE, 800, corps)).toBeLessThanOrEqual(888);
    }
    const largeurs = lignes.map((l) => largeurTexte(l, FAMILLE, 800, corps));
    expect(largeurs[largeurs.length - 1]).toBeGreaterThanOrEqual(0.4 * Math.max(...largeurs));
    expect(corps).toBeGreaterThanOrEqual(70);
  });

  it("affiche des espaces simples (aucune insécable, donc aucun trou)", () => {
    const { lignes } = mettreEnLignes(typo("Dans le TGV, la seule prise qui marche."), police, 80, 888);
    expect(lignes.join(" ")).not.toMatch(/[  ]/);
    expect(affichage(`quoi ?`)).toBe("quoi ?");
  });

  it("garde « : » collé au mot et coupe de préférence après", () => {
    const { lignes } = mettreEnLignes(typo("Blagues d'Halloween : 8 vannes pour ta soirée déguisée"), police, 76, 1376);
    expect(lignes[0]).toBe("Blagues d’Halloween :");
  });

  it("ne laisse pas un début de phrase seul en fin de ligne", () => {
    const { lignes } = mettreEnLignes(typo("Il en a plein. Moi, je tiens la laisse."), police, 100, 888);
    expect(lignes[0]).toBe("Il en a plein.");
  });

  it("tient sur une ligne quand c'est possible", () => {
    expect(mettreEnLignes(typo("Pile à l'heure."), police, 100, 888).lignes).toHaveLength(1);
  });

  it("réduit le corps si un bloc ne tient pas, jamais sous le plancher", () => {
    expect(mettreEnLignes("anticonstitutionnellement", police, 100, 888).corps).toBeLessThan(100);
    const r = mettreEnLignes("x".repeat(200), police, 100, 888);
    expect(r.corps).toBe(PLANCHER_CORPS);
  });

  it("lignes imposées par « \\n » : une partie = une ligne, corps réduit pour tenir", () => {
    const r = mettreEnLignes(typo("J'ai découvert que\nmes potes avaient\nun groupe sans moi.\nJ'ai boudé trois jours."), police, 88, 840);
    expect(r.lignes).toHaveLength(4);
    expect(r.lignes[3]).toBe("J’ai boudé trois jours.");
    expect(r.corps).toBeLessThan(88);
    expect(r.corps).toBeGreaterThanOrEqual(Math.round(88 * 0.7));
  });
});
