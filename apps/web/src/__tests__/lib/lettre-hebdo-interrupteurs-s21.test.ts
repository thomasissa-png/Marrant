/**
 * @jest-environment node
 *
 * Lettre de la semaine (s21) : interrupteurs fermés par défaut, invariant « la promesse
 * n'avance jamais sur la réalité » (spec H8-2), calendrier ISO du jeudi 8 h Paris
 * (changements d'heure, semaine 53, passage d'année), textes de l'avis @legal mot pour mot.
 */
import { readFileSync } from "fs";
import { join } from "path";
import * as config from "@/config/lettre";
import * as textes from "@/config/textes/lettre-hebdo-s21";
import { envoiSemaine, finSemaine, moisDeSemaine, semaineIsoParis, semaineValide } from "@/lib/lettre/calendrier";

const racine = join(__dirname, "..", "..", "..");
const avisLegal = readFileSync(join(racine, "..", "..", "docs", "legal", "lettre-hebdo-premium-s21.md"), "utf8");

describe("Interrupteurs de la lettre de la semaine", () => {
  it("les trois sont FERMÉS au déploiement", () => {
    expect(config.LETTRE_HEBDO_INSCRIPTIONS_OUVERTES).toBe(false);
    expect(config.LETTRE_HEBDO_ENVOIS_OUVERTS).toBe(false);
    expect(config.LETTRE_HEBDO_PROMESSE).toBe(false);
    expect(config.promesseLettreHebdoVisible()).toBe(false);
  });

  it("H8-2 : la promesse ne s'affiche JAMAIS si les envois (ou les inscriptions) sont fermés", () => {
    for (const promesse of [true, false]) {
      for (const inscriptions of [true, false]) {
        for (const envois of [true, false]) {
          const visible = config.promesseLettreHebdoVisible({ promesse, inscriptions, envois });
          if (!envois || !inscriptions || !promesse) expect(visible).toBe(false);
          else expect(visible).toBe(true);
        }
      }
    }
  });

  it("invariant sur les valeurs réelles : promesse ouverte ⇒ envois et inscriptions ouverts ; inscriptions ouvertes ⇒ date des textes posée", () => {
    if (config.LETTRE_HEBDO_PROMESSE) {
      expect(config.LETTRE_HEBDO_ENVOIS_OUVERTS).toBe(true);
      expect(config.LETTRE_HEBDO_INSCRIPTIONS_OUVERTES).toBe(true);
    }
    if (config.LETTRE_HEBDO_INSCRIPTIONS_OUVERTES) expect(config.LETTRE_HEBDO_DATE_TEXTES).toMatch(/^\d{1,2} \p{L}+ \d{4}$/u);
  });

  it("version du consentement et constantes de stock de la spec §6.1", () => {
    expect(config.LETTRE_HEBDO_CONSENT_VERSION).toBe("lettre-hebdo-premium-v1");
    expect(config.LETTRE_HEBDO_STOCK_ALERTE).toBe(4);
    expect(config.LETTRE_HEBDO_STOCK_CIBLE).toBe(8);
    expect(config.LETTRE_HEBDO_JOURNAL_MOIS).toBe(12);
  });
});

describe("Calendrier : semaine ISO, jeudi 8 h Paris", () => {
  it.each([
    ["2026-11-12T07:00:00Z", "2026-W46"],
    ["2026-12-31T07:00:00Z", "2026-W53"],
    ["2027-01-01T10:00:00Z", "2026-W53"], // vendredi 1er janvier : semaine du jeudi 31/12
    ["2027-01-07T07:00:00Z", "2027-W01"],
    ["2026-11-15T22:30:00Z", "2026-W46"], // dimanche 23 h 30 à Paris
    ["2026-11-15T23:10:00Z", "2026-W47"], // lundi 0 h 10 à Paris (dimanche 23 h 10 UTC)
  ])("%s → %s", (instant, cle) => {
    expect(semaineIsoParis(new Date(instant))).toBe(cle);
  });

  it("semaine 53 seulement les années qui l'ont ; format refusé sinon", () => {
    expect(semaineValide("2026-W53")).toBe(true);
    expect(semaineValide("2027-W53")).toBe(false);
    expect(semaineValide("2026-W54")).toBe(false);
    expect(semaineValide("2026-W00")).toBe(false);
    expect(semaineValide("2026-46")).toBe(false);
    expect(envoiSemaine("2027-W53")).toBeNull();
  });

  it("jeudi 8 h heure de Paris, en heure d'hiver comme d'été, aux deux changements d'heure", () => {
    expect(envoiSemaine("2026-W46")?.toISOString()).toBe("2026-11-12T07:00:00.000Z"); // hiver
    expect(envoiSemaine("2026-W53")?.toISOString()).toBe("2026-12-31T07:00:00.000Z");
    expect(envoiSemaine("2027-W12")?.toISOString()).toBe("2027-03-25T07:00:00.000Z"); // avant le 28/03
    expect(envoiSemaine("2027-W13")?.toISOString()).toBe("2027-04-01T06:00:00.000Z"); // été
    expect(envoiSemaine("2026-W44")?.toISOString()).toBe("2026-10-29T07:00:00.000Z"); // après le 25/10
    expect(envoiSemaine("2026-W43")?.toISOString()).toBe("2026-10-22T06:00:00.000Z"); // été
  });

  it("fin de semaine = lundi 0 h Paris ; mois du jeudi", () => {
    expect(finSemaine("2026-W46")?.toISOString()).toBe("2026-11-15T23:00:00.000Z");
    expect(moisDeSemaine("2026-W53")).toBe("2026-12");
    expect(moisDeSemaine("2027-W01")).toBe("2027-01");
  });
});

describe("Textes de l'avis @legal, mot pour mot", () => {
  const dansAvis = (texte: string) => expect(avisLegal).toContain(texte);

  it("case, page d'arrêt, CGU, confidentialité, fin de Premium, suppression", () => {
    dansAvis(textes.LETTRE_HEBDO_CASE);
    for (const t of Object.values(textes.LETTRE_HEBDO_ARRET)) if (t !== textes.LETTRE_HEBDO_ARRET.metaTitre) dansAvis(t);
    for (const t of textes.CGU_LETTRE_HEBDO) dansAvis(t);
    for (const t of Object.values(textes.CONFIDENTIALITE_LETTRE_HEBDO)) dansAvis(t);
    dansAvis(textes.LETTRE_HEBDO_FIN_PREMIUM);
    dansAvis(textes.LETTRE_HEBDO_SUPPRESSION);
    dansAvis(textes.LETTRE_HEBDO_UI.finPrevue("{date}"));
  });

  it("ligne sous la case (O : lien Confidentialité) et pied du numéro (O : motif, éditeur, contact, arrêt)", () => {
    const L = textes.LETTRE_HEBDO_LIGNE_SOUS_CASE;
    dansAvis(`${L.avantLien("{e-mail du compte}")}${L.lien}${L.apresLien}`);
    const pied = textes.piedNumeroHebdo("{lien d'arrêt propre au destinataire}", "https://deviens-marrant.fr");
    const attendu = pied.replace(config.LETTRE_MENTION_EDITEUR_NUMERO, "{LETTRE_MENTION_EDITEUR_NUMERO}").trimStart();
    dansAvis(attendu);
  });

  it("proposition aux abonnés existants : brouillon de l'avis, mot pour mot", () => {
    const corps = textes.PROPOSITION_LETTRE_HEBDO.corps("https://deviens-marrant.fr").replace(config.LETTRE_MENTION_EDITEUR_NUMERO, "{LETTRE_MENTION_EDITEUR_NUMERO}");
    dansAvis(`Objet : ${textes.PROPOSITION_LETTRE_HEBDO.sujet}\n\n${corps}`);
  });

  it("zéro tiret cadratin, zéro « newsletter », zéro prix dans tous les textes", () => {
    const tout = JSON.stringify(textes) + textes.piedNumeroHebdo("x", "https://deviens-marrant.fr") + textes.PROPOSITION_LETTRE_HEBDO.corps("https://deviens-marrant.fr");
    expect(tout).not.toContain("—");
    expect(tout.toLowerCase()).not.toContain("newsletter");
    expect(tout).not.toContain("€");
  });
});
