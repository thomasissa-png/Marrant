import { frTypo, NBSP } from "@/lib/fr-typo";
import { lie } from "../helpers/texte-normalise";

/**
 * Revue visuelle s21, décision 4 du verdict @design : `frTypo` est un filtre d'affichage.
 * Apostrophes typographiques, guillemets français, tiret cadratin remplacé par une virgule
 * (règle 12 du projet), insécables. Aucun mot n'est ajouté, retiré ni modifié ; idempotent.
 */
const mots = (s: string) => s.match(/[\p{L}\p{N}]+/gu) ?? [];

describe("frTypo, filtre d'affichage (revue visuelle s21)", () => {
  it("l'abonnement : apostrophe typographique entre deux lettres", () => {
    expect(frTypo("l'abonnement")).toBe("l’abonnement");
    expect(frTypo("C'est quoi, aujourd'hui ?")).toBe(`C’est quoi, aujourd’hui${NBSP}?`);
  });

  it("guillemets droits appariés : guillemets français avec insécables", () => {
    expect(frTypo('On a tous les deux regretté, "elle le partage" ensuite.')).toBe(
      `On a tous les deux regretté, «${NBSP}elle le partage${NBSP}» ensuite.`,
    );
  });

  it("tiret cadratin entre espaces : une virgule, filet de sécurité de la règle 12", () => {
    expect(frTypo("Cette dernière phrase ne dit rien — elle le partage")).toBe("Cette dernière phrase ne dit rien, elle le partage");
    expect(frTypo("rien — elle")).not.toContain("—");
  });

  it("texte déjà typographié : ressort identique (idempotent)", () => {
    const deja = lie(`C’est l’heure${NBSP}: «${NBSP}vas-y${NBSP}», dit-il, 7${NBSP}techniques.`);
    expect(frTypo(deja)).toBe(deja);
    const brut = `Ma banque m'a écrit : "Merci" — même ma banque, 4 812 fois.`;
    expect(frTypo(frTypo(brut))).toBe(frTypo(brut));
  });

  it("aucun mot changé", () => {
    const brut = `L'humoriste a dit "Bonsoir" — puis il s'est tu : c'est tout ? Oui ! 23 h 40.`;
    expect(mots(frTypo(brut))).toEqual(mots(brut));
  });

  it("apostrophe hors mot (citation entre apostrophes) : laissée telle quelle", () => {
    expect(frTypo("'On a tous les deux regretté.'")).toBe("'On a tous les deux regretté.'");
  });

  // Revue visuelle s21, tour 4 (T3-02) : mot composé court jamais coupé après son trait d'union.
  it("mots composés courts liés par un gluon, longs, adresses, liens et slugs intacts", () => {
    const WJ = String.fromCharCode(0x2060);
    expect(frTypo("de stand-up pour briller")).toBe(`de stand-${WJ}up pour briller`);
    expect(frTypo("en mode start-up")).toBe(`en mode start-${WJ}up`);
    expect(frTypo("L’auto-dérision sociale")).toBe(`L’auto-${WJ}dérision sociale`);
    expect(frTypo("par e-mail")).toBe(`par e-${WJ}mail`);
    expect(frTypo("un porte-monnaie")).toBe("un porte-monnaie");
    for (const intact of ["contact@deviens-marrant.fr", "deviens-marrant.fr", "/blog/comment-devenir-drole", "/vannes?q=stand-up", "#stand-up"]) {
      expect(frTypo(intact)).toBe(intact);
    }
    const lie = frTypo("Vidéos stand-up analysées");
    expect(frTypo(lie)).toBe(lie);
    expect(lie.replace(new RegExp(WJ, "g"), "")).toBe("Vidéos stand-up analysées");
  });
});
