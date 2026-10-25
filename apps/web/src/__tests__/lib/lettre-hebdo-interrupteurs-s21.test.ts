/**
 * @jest-environment node
 *
 * Lettre de la semaine (s21) : interrupteurs (ouverts en s22, promesse fermée), invariant « la promesse
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
  it("s22 (25/10, décision de Thomas) : inscriptions et envois OUVERTS, promesse publique FERMÉE", () => {
    expect(config.LETTRE_HEBDO_INSCRIPTIONS_OUVERTES).toBe(true);
    expect(config.LETTRE_HEBDO_ENVOIS_OUVERTS).toBe(true);
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

  it("constantes de stock de la spec §6.1 ; s22 : plus de version de consentement (ancienne case supprimée)", () => {
    expect(config).not.toHaveProperty("LETTRE_HEBDO_CONSENT_VERSION");
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

  it("page d'arrêt, CGU, confidentialité, fin de Premium, suppression (s22 : plus de case)", () => {
    expect(textes).not.toHaveProperty("LETTRE_HEBDO_CASE");
    for (const t of Object.values(textes.LETTRE_HEBDO_ARRET)) if (t !== textes.LETTRE_HEBDO_ARRET.metaTitre) dansAvis(t);
    for (const t of textes.CGU_LETTRE_HEBDO) dansAvis(t);
    for (const t of Object.values(textes.CONFIDENTIALITE_LETTRE_HEBDO)) dansAvis(t);
    dansAvis(textes.LETTRE_HEBDO_FIN_PREMIUM);
    dansAvis(textes.LETTRE_HEBDO_SUPPRESSION);
    dansAvis(textes.LETTRE_HEBDO_UI.finPrevue("{date}"));
  });

  it("ligne sous le réglage (O : lien Confidentialité) et pied du numéro (O : motif, éditeur, contact, arrêt)", () => {
    const L = textes.LETTRE_HEBDO_LIGNE_REGLAGE;
    dansAvis(`${L.avantLien("{e-mail du compte}")}${L.lien}${L.apresLien}`);
    const pied = textes.piedNumeroHebdo("{lien d'arrêt propre au destinataire}", "https://deviens-marrant.fr");
    const attendu = pied.replace(config.LETTRE_MENTION_EDITEUR_NUMERO, "{LETTRE_MENTION_EDITEUR_NUMERO}").trimStart();
    dansAvis(attendu);
  });

  it("s22 inscription d'office + relecture à l'aveugle (B1 à B5, M2 à M5, M7) : textes publics exacts, plus de case ni de choix", () => {
    const T = textes;
    expect(T.CGU_LETTRE_HEBDO[0]).toBe(
      "La lettre de la semaine est incluse dans l'abonnement Premium : tu la reçois sans rien faire, sauf si tu nous as demandé de ne plus recevoir nos e-mails, et tu peux l'arrêter en un clic, dans chaque lettre ou depuis ton profil, sans résilier. Elle est envoyée chaque semaine, le jeudi, à l'adresse e-mail de ton compte, tant que ton accès Premium est actif. Elle reprend des contenus de Premium (une scène du carnet, la réplique et l'exercice) et ne contient aucune offre commerciale. Elle s'arrête quand ton accès Premium prend fin : les numéros déjà reçus restent dans ta boîte. Si tu te réabonnes, elle reprend, sauf si tu l'avais arrêtée : ton arrêt reste valable, et tu peux la reprendre depuis ton profil.",
    );
    expect(T.CONFIDENTIALITE_LETTRE_HEBDO).toEqual({
      donnees:
        "Lettre de la semaine (abonnés Premium, incluse dans l'abonnement) : la date du premier envoi, puis, si tu l'arrêtes ou la reprends, la date et la façon dont tu l'as fait (lien dans l'e-mail, profil, ou demande à contact@deviens-marrant.fr). On garde aussi un code personnel qui sert au lien d'arrêt, et un journal des envois (quel numéro, à quelle adresse). La lettre est envoyée à l'adresse e-mail de ton compte. Aucune adresse IP n'est gardée pour cette lettre.",
      finalite:
        "T'envoyer la lettre de la semaine : exécution du contrat, car elle est incluse dans ton abonnement Premium. Tu peux l'arrêter en un clic à tout moment : plus aucun numéro ne t'est envoyé.",
      destinataires:
        "Lettre de la semaine : l'envoi passe par notre prestataire Resend (voir la partie 4). L'équipe voit, dans son espace d'administration, si ta lettre est active ou arrêtée, et depuis quand.",
      duree:
        "Lettre de la semaine : ton choix est gardé tant que ton compte existe. Si tu l'arrêtes, on garde la date et la façon dont tu l'as fait, pour respecter ton arrêt, même si tu te réabonnes plus tard. Si ton abonnement prend fin, on garde la date de fin : si tu te réabonnes, la lettre reprend. Le journal des envois est gardé 12 mois. Quand tu supprimes ton compte, ton choix, sa trace et le journal des envois à ton adresse sont effacés tout de suite.",
      droits:
        "Tu peux arrêter la lettre de la semaine à tout moment, avec le lien en bas de chaque numéro ou depuis ton profil, sans toucher à ton abonnement. Les numéros déjà reçus restent dans ta boîte.",
    });
    expect(T.LETTRE_HEBDO_INFO_PAIEMENT).toEqual({
      recoit: "Chaque jeudi, la lettre de la semaine arrive dans ta boîte : elle est incluse dans ton abonnement. Tu peux l'arrêter en un clic, depuis chaque lettre ou ton profil.",
      arretee: "Ta lettre de la semaine reste arrêtée. Tu peux la reprendre depuis ton profil.",
      opposition:
        "La lettre de la semaine ne t'est pas envoyée : tu nous as demandé de ne plus recevoir nos e-mails, ou ils n'arrivaient plus à ton adresse. Pour la recevoir, écris-nous à contact@deviens-marrant.fr.",
    });
    expect(T.LETTRE_HEBDO_UI.opposition).toBe(T.LETTRE_HEBDO_INFO_PAIEMENT.opposition);
    expect(`${T.LETTRE_HEBDO_LIGNE_REGLAGE.avantLien("y@x.fr")}${T.LETTRE_HEBDO_LIGNE_REGLAGE.lien}${T.LETTRE_HEBDO_LIGNE_REGLAGE.apresLien}`).toBe(
      "Incluse dans ton abonnement, elle part chaque jeudi à y@x.fr tant que ce réglage est activé. Si tu es inscrit à la lettre du mois, elle est en pause pendant ce temps, puis reprend quand tu arrêtes celle-ci ou quand ton abonnement prend fin. L'éditeur du site, deviens-marrant SAS, est responsable de l'usage de ton adresse pour cette lettre. Détails et droits : Confidentialité.",
    );
    expect(T.LETTRE_HEBDO_UI.succesActivation("y@x.fr")).toBe("C'est noté. Tu la recevras chaque jeudi, à y@x.fr. Tu peux l'arrêter ici ou depuis chaque lettre, en un clic.");
    expect(T.LETTRE_HEBDO_UI.succesArret).toBe("C'est arrêté. Ton abonnement continue.");
    expect(T.LETTRE_HEBDO_REGLAGE).toBe("Je reçois la lettre de la semaine");
    expect(T.LETTRE_HEBDO_ARRET.titre).toBe("Arrêter la lettre de la semaine ?");
    expect(T.LETTRE_HEBDO_ARRET.titreArretee).toBe("Lettre de la semaine arrêtée");
    expect(T).not.toHaveProperty("PROPOSITION_LETTRE_HEBDO");
    expect(T.LETTRE_HEBDO_UI).not.toHaveProperty("adresseNonVerifiee");
    const pied = T.piedNumeroHebdo("x", "https://deviens-marrant.fr");
    expect(pied).toContain("Tu reçois cette lettre parce qu'elle est incluse dans ton abonnement Premium.");
    // Grep « case » des textes publics de la lettre de la semaine : il n'en reste aucune.
    const publics = [JSON.stringify(T), pied];
    for (const t of publics) expect(t).not.toMatch(/\bcase\b|coche|choisi de la recevoir|tu l'actives toi-même|ancienne case|de nouveau, écris/);
    expect(config.LETTRE_HEBDO_DATE_TEXTES).toBe("25 octobre 2026");
  });

  it("zéro tiret cadratin, zéro « newsletter », zéro prix dans tous les textes", () => {
    const tout = JSON.stringify(textes) + textes.piedNumeroHebdo("x", "https://deviens-marrant.fr") + textes.LETTRE_HEBDO_LIGNE_REGLAGE.avantLien("y@x.fr");
    expect(tout).not.toContain("–");
    expect(tout).not.toContain("—");
    expect(tout.toLowerCase()).not.toContain("newsletter");
    expect(tout).not.toContain("€");
  });
});
