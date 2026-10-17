/**
 * @jest-environment node
 *
 * Lettre s21 : textes VALIDÉS à l'aveugle le 17/10, mot pour mot (un test par
 * bloc = numéro du duel des packs `docs/copy/lettre-mensuelle-s21/`), version
 * du consentement (réserve @legal R1) et jour d'envoi non fixé.
 */
jest.mock("@/lib/prisma", () => ({ prisma: {} }));

import { CONSENTEMENTS_LETTRE_ARCHIVES, EMAILS_LETTRE, TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import {
  LETTRE_CONFIDENTIALITE_HREF,
  LETTRE_CONSENT_VERSION,
  LETTRE_DEJA_INSCRIT_HEURES,
  LETTRE_DRAPEAU_JOURS,
  LETTRE_PENDING_JOURS,
} from "@/config/lettre";
import { LETTRE_CONSENT_TEXT } from "@/lib/lettre/inscription";
import { envoiPrevuFixe } from "@/lib/lettre/numeros";
import numerosJson from "@/data/lettre/numeros.json";

const BASE = "https://deviens-marrant.fr";
const PIED = ["--", "Éditeur : deviens-marrant SAS. Contact : contact@deviens-marrant.fr.", `Confidentialité : ${BASE}/confidentialite`];
const T = TEXTES_LETTRE;

describe("Textes validés à l'aveugle (mot pour mot)", () => {
  it("bloc 1 : en-tête du formulaire (tour 2, A)", () => {
    expect([T.titre, T.phrase]).toEqual(["Une vanne décryptée, chaque mois", "Tu la reçois par e-mail, avec un exercice pour t'entraîner."]);
  });

  it("bloc 2 : champ, bouton et réassurance (tour 2, B)", () => {
    const f = T.formulaire;
    expect([f.label, f.placeholder, f.bouton, f.reassurance]).toEqual([
      "Ton adresse e-mail",
      "toi@exemple.fr",
      "Envoie-moi la lettre",
      "Gratuit, sans compte.",
    ]);
  });

  it("bloc 3 : case de consentement et mention sous le bouton (tour 1, B)", () => {
    expect(T.formulaire.case).toBe(
      "Oui, je veux recevoir la lettre de Deviens Marrant une fois par mois. Elle contient une vanne décryptée et parfois une mention de Premium. Je peux me désinscrire en un clic, à tout moment.",
    );
    expect(T.formulaire.mention).toBe(
      "Ton adresse ne sert qu'à t'envoyer la lettre. deviens-marrant SAS, l'éditeur du site, en est responsable. Détails et droits :",
    );
    expect(T.formulaire.lienConfidentialite).toBe("Confidentialité");
    expect(LETTRE_CONFIDENTIALITE_HREF).toBe("/confidentialite#lettre");
  });

  it("bloc 4 : messages d'erreur (tour 1, A)", () => {
    expect(T.erreurs).toEqual({
      email: "Cette adresse n'a pas l'air complète. Un exemple : toi@exemple.fr",
      case: "Coche la case, sans ça on ne peut pas t'envoyer la lettre.",
      reseau: "L'envoi n'a pas abouti, et c'est de notre côté. Ce que tu as saisi reste dans le champ : réessaie dans un instant.",
      limite: "Il y a eu beaucoup d'essais d'un coup. Attends une minute et réessaie.",
    });
  });

  it("bloc 5 : envoi en cours, succès, renvoi, drapeau (tour 1, B)", () => {
    expect([T.formulaire.boutonEnvoi, T.formulaire.attenteLongue]).toEqual(["Envoi de l'e-mail", "Ça traîne un peu, patiente quelques secondes."]);
    expect(T.succes).toEqual({
      titre: "Regarde ta boîte mail.",
      texte: "On t'a envoyé un e-mail. Ouvre le lien qu'il contient et touche le bouton « Confirmer mon adresse » : sans ça, tu ne reçois rien.",
      aide: "Rien au bout de quelques minutes ? Jette un œil aux spams et aux promotions.",
      renvoyer: "Renvoyer l'e-mail",
      renvoyerDans: "Renvoyer l'e-mail dans {s} s",
      changer: "Mauvaise adresse ? La corriger",
    });
    expect(T.drapeau).toEqual({ texte: "Il reste à confirmer ton adresse : regarde ta boîte mail.", renvoyer: "Renvoyer l'e-mail" });
    // Le bouton cité dans le texte de succès est bien celui de la page de confirmation.
    expect(T.succes.texte).toContain(`« ${T.page.confirmer.bouton} »`);
  });

  it("bloc 6 : titre de l'onglet, description, intitulé de l'aperçu (tour 2, B)", () => {
    expect([T.page.metaTitre, T.page.metaDescription, T.page.dernierNumero]).toEqual([
      "La lettre : une vanne décryptée, chaque mois",
      "Une vanne, ce qui la fait marcher et un exercice pour t'entraîner, dans ta boîte mail. Gratuit, sans compte.",
      "À quoi ça ressemble : le dernier numéro",
    ]);
    expect(T.page.metaTitre).toBe(`La lettre : ${T.titre.charAt(0).toLowerCase()}${T.titre.slice(1)}`);
  });

  it("bloc 7 : confirmation de l'adresse (tour 1, A)", () => {
    expect(T.page.confirmer).toEqual({
      titre: "Dernière étape.",
      texte: "Un tap pour confirmer que tu veux recevoir la lettre.",
      bouton: "Confirmer mon adresse",
    });
    const c = T.statuts.confirmee;
    expect([c.titre, c.texte, c.prochain, c.lien]).toEqual([
      "C'est bon, tu es inscrit.",
      "Une lettre par mois, avec une vanne décryptée.",
      "Le prochain numéro arrive le {date}.",
      "Voir la vanne du jour et son décryptage",
    ]);
  });

  it("bloc 8 : désinscription (tour 2, A)", () => {
    expect(T.page.desinscrire).toEqual({
      titre: "Arrêter la lettre ?",
      texte:
        "Tu ne recevras plus la lettre du mois. Si tu as un compte ou un abonnement Premium, leurs e-mails (facture, sécurité, rappel avant un renouvellement annuel) continuent : ils sont obligatoires.",
      bouton: "Me désinscrire",
    });
    expect(T.statuts.desinscrit).toEqual({ titre: "C'est fait, tu ne recevras plus la lettre.", lien: "Mauvais bouton ? Te réinscrire" });
  });

  it("bloc 9 : lien invalide et erreur technique (tour 2, B)", () => {
    expect(`${T.statuts.invalide.titre} ${T.statuts.invalide.texte}`).toBe(
      "Ce lien ne marche plus : il a peut-être expiré ou déjà servi. Pour t'inscrire, utilise le formulaire de cette page. Pour te désinscrire, écris-nous à contact@deviens-marrant.fr.",
    );
    expect(T.statuts.erreur.titre).toBe(
      "Un souci de notre côté. Réessaie ce lien dans quelques minutes, et écris-nous à contact@deviens-marrant.fr si ça persiste.",
    );
  });

  it("bloc 10 : e-mail de confirmation (tour 1, B)", () => {
    expect(EMAILS_LETTRE.confirmation.sujet).toBe("Une dernière étape pour recevoir la lettre");
    expect(EMAILS_LETTRE.confirmation.corps("LIEN", BASE).split("\n")).toEqual([
      "Salut,",
      "",
      "Quelqu'un (sûrement toi) a demandé à recevoir la lettre de Deviens Marrant avec cette adresse : une vanne décryptée, une fois par mois.",
      "",
      "Pour confirmer, ouvre ce lien et touche le bouton « Confirmer mon adresse ». Il est valable 7 jours.",
      "LIEN",
      "",
      "Ce n'était pas toi ? Ignore ce message : tu ne recevras rien, et l'adresse sera effacée au bout de 7 jours.",
      "",
      "L'Équipe Deviens Marrant",
      "",
      ...PIED,
    ]);
  });

  it("bloc 11 : e-mail « déjà dans la liste » (tour 2, B)", () => {
    expect(EMAILS_LETTRE.dejaInscrit.sujet).toBe("Tu reçois déjà la lettre");
    expect(EMAILS_LETTRE.dejaInscrit.corps("DESINSCRIRE", BASE).split("\n")).toEqual([
      "Salut,",
      "",
      "Une demande d'inscription vient d'être faite avec cette adresse, mais elle reçoit déjà la lettre : rien à faire de ton côté. Un numéro arrive une fois par mois.",
      "",
      "Si tu veux arrêter, le lien de désinscription est en bas de ce message.",
      "",
      "L'Équipe Deviens Marrant",
      "",
      ...PIED,
      "Se désinscrire : DESINSCRIRE",
    ]);
  });

  it("bloc 12 : e-mail de reconfirmation (tour 1, B)", () => {
    expect(EMAILS_LETTRE.reconfirmation.sujet).toBe("Tu veux toujours recevoir la lettre ?");
    expect(EMAILS_LETTRE.reconfirmation.corps("OUI", "NON", BASE).split("\n")).toEqual([
      "Salut,",
      "",
      "Tu reçois la lettre de Deviens Marrant depuis 2 ans. On vérifie que tu veux la garder.",
      "",
      "Pour continuer, ouvre ce lien puis touche le bouton :",
      "OUI",
      "",
      "Sans clic de ta part dans les 30 jours, on te désinscrit. Rien d'autre à faire.",
      "",
      "L'Équipe Deviens Marrant",
      "",
      ...PIED,
      "Se désinscrire maintenant : NON",
    ]);
  });

  it("bloc 13 : pied de chaque numéro (tour 1, A, inchangé)", () => {
    const { LETTRE_MENTION_EDITEUR_NUMERO } = jest.requireActual("@/config/lettre");
    expect(EMAILS_LETTRE.piedNumero("DESINSCRIRE", BASE).split("\n")).toEqual([
      "",
      "--",
      "Tu reçois cette lettre parce que tu t'es inscrit sur deviens-marrant.fr.",
      `Éditeur : ${LETTRE_MENTION_EDITEUR_NUMERO}. Contact : contact@deviens-marrant.fr.`,
      "Se désinscrire : DESINSCRIRE",
      `Confidentialité : ${BASE}/confidentialite`,
    ]);
  });
});

describe("Version du consentement (réserve @legal R1)", () => {
  it("nouvelle étiquette, texte stocké = texte affiché de la case, mot pour mot", () => {
    expect(LETTRE_CONSENT_VERSION).toBe("lettre-mensuelle-v2");
    expect(LETTRE_CONSENT_TEXT).toBe(`lettre-mensuelle-v2 : ${TEXTES_LETTRE.formulaire.case}`);
  });

  it("l'ancien texte reste archivé sous son étiquette, jamais sous la nouvelle", () => {
    expect(Object.keys(CONSENTEMENTS_LETTRE_ARCHIVES)).not.toContain(LETTRE_CONSENT_VERSION);
    expect(CONSENTEMENTS_LETTRE_ARCHIVES["lettre-mensuelle-v1"].case).toBe(
      "Oui, je veux recevoir la lettre de Deviens Marrant une fois par mois : une vanne décryptée, parfois avec une mention de Premium. Je peux me désinscrire en un clic, à tout moment.",
    );
    expect(CONSENTEMENTS_LETTRE_ARCHIVES["lettre-mensuelle-v1"].case).not.toBe(TEXTES_LETTRE.formulaire.case);
  });
});

describe("Durées lues dans la config", () => {
  it("le drapeau « vérifie ta boîte » dure autant que le lien de confirmation (7 jours)", () => {
    expect(LETTRE_DRAPEAU_JOURS).toBe(LETTRE_PENDING_JOURS);
    expect(LETTRE_PENDING_JOURS).toBe(7);
  });

  it("un « déjà dans la liste » au plus par adresse et par 24 h", () => {
    expect(LETTRE_DEJA_INSCRIT_HEURES).toBe(24);
  });
});

describe("Ligne « Le prochain numéro arrive le… » (envoiPrevu)", () => {
  const numero = (envoiPrevu: string | null) => ({
    periode: "2026-11",
    objet: "Objet du numéro",
    corps: "x".repeat(60),
    envoiPrevu,
    datePlancher: null,
    statut: "VALIDE",
  });

  it("masquée tant que le jour d'envoi n'est pas fixé", () => {
    expect(envoiPrevuFixe("2026-11", [numero(null)])).toBe(false);
    expect(envoiPrevuFixe("2026-12", [numero("2026-11-05T08:00:00+01:00")])).toBe(false);
    for (const n of numerosJson) expect(envoiPrevuFixe(n.periode)).toBe(false);
  });

  it("affichable une fois le jour fixé", () => {
    expect(envoiPrevuFixe("2026-11", [numero("2026-11-05T08:00:00+01:00")])).toBe(true);
  });
});
