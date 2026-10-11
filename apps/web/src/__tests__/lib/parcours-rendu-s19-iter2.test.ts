/**
 * s19 (rendu itération 2) : aides d'affichage du défi, de l'exemple et de l'accroche.
 * Règle : affichage seul, le texte validé est restitué caractère pour caractère.
 */
import boulot from "../../../../../docs/content/parcours-boulot-s19.json";
import storytelling from "../../../../../docs/content/parcours-storytelling-s18.json";
import { decouperDefi, lignesExemple } from "@/components/parcours/parcours-step-card";
import { frTypo, frTypoTexte } from "@/lib/fr-typo";
import { tipProse } from "@/lib/tip-prose";

const CONSEILS = [...boulot._meta.conseils, ...storytelling._meta.conseilsReactives];
const prose = (t: string) => frTypo(tipProse(t));
const NBSP = String.fromCharCode(0xa0);

describe("défi : libellé « DÉFI X » mis en évidence (N2 @design)", () => {
  it.each(CONSEILS.map((c) => [c.title, c.exercise]))("%s : libellé trouvé, texte intact", (_t, exercise) => {
    const texte = prose(exercise);
    const parts = decouperDefi(texte);
    expect(parts).not.toBeNull();
    expect(parts![0]).toMatch(/^DÉFI [A-ZÉÈÀ ]+$/);
    expect(parts!.join("")).toBe(texte);
  });

  it("sans libellé : rien découpé", () => {
    expect(decouperDefi("Écris une phrase : rien de plus.")).toBeNull();
  });
});

describe("exemple : une ligne = un paragraphe (N3 @design)", () => {
  it.each(CONSEILS.map((c) => [c.title, c.example]))("%s : lignes dans l'ordre, aucune perdue", (_t, example) => {
    const lignes = lignesExemple(prose(example));
    expect(lignes.join("\n")).toBe(prose(example).split("\n").filter((l) => l.trim() !== "").join("\n"));
    expect(lignes.length).toBe(example.split("\n").filter((l) => l.trim() !== "").length);
  });
});

describe("accroche : typographie française (N1 @design)", () => {
  it("« à » isolé lié au mot suivant, le reste comme frTypo", () => {
    expect(frTypoTexte("À midi, passée à autre chose")).toBe(`À${NBSP}midi, passée à${NBSP}autre chose`);
    expect(frTypoTexte("En 6 semaines : « Redis-moi »")).toBe(frTypo("En 6 semaines : « Redis-moi »"));
    expect(frTypoTexte("déjà là")).toBe("déjà là");
  });

  it("aucun mot ajouté ni retiré : seules des espaces deviennent insécables", () => {
    const textes = [boulot.parcours.description, boulot.parcours.personaTagline, boulot.parcours.testimonial];
    for (const t of textes) expect(frTypoTexte(t).replaceAll(NBSP, " ")).toBe(t);
  });
});
