/**
 * Textes de la lettre mensuelle gratuite (s21).
 *
 * Sources : `docs/ux/lettre-inscription-s21.md` (§2, §3, §5, libellé V1 recommandé)
 * et `docs/legal/lettre-et-questions-s21.md` (L1 case v2 et mention sous le
 * bouton, L3 pied des e-mails, L6 périmètre de la désinscription).
 * À RELIRE À L'AVEUGLE avant ouverture (règle d'or s18) : tant que
 * `LETTRE_OUVERTE` est fermé, aucun de ces textes n'est visible ni envoyé.
 * Vocabulaire : « la lettre », « recevoir », « te désinscrire » ; jamais
 * « newsletter » ni « abonnement » à l'écran (réservés à Premium).
 * Zéro tiret cadratin (test `lettre-s21.test.ts`).
 */

export const LETTRE_CONTACT = "contact@deviens-marrant.fr";

export const TEXTES_LETTRE = {
  titre: "Une vanne décryptée par mois",
  phrase: "Par e-mail, une fois par mois : la vanne et pourquoi elle marche.",
  formulaire: {
    label: "Ton e-mail",
    placeholder: "toi@exemple.fr",
    /** Texte EXACT de la case (@legal L1). Le modifier = changer LETTRE_CONSENT_VERSION. */
    case: "Oui, je veux recevoir la lettre de Deviens Marrant une fois par mois : une vanne décryptée, parfois avec une mention de Premium. Je peux me désinscrire en un clic, à tout moment.",
    bouton: "Recevoir la lettre",
    boutonEnvoi: "Envoi en cours",
    attenteLongue: "C'est un peu long, on ne t'a pas oublié.",
    reassurance: "Gratuit, sans compte. Pas plus d'un e-mail par mois.",
    /** Mention sous le bouton (@legal L1) ; `lienConfidentialite` est le lien final. */
    mention: "Ton e-mail sert à t'envoyer la lettre, rien d'autre. deviens-marrant SAS en est responsable. Détails et droits :",
    lienConfidentialite: "Confidentialité",
  },
  erreurs: {
    email: "Il manque un morceau à cette adresse. Exemple : toi@exemple.fr",
    case: "Coche la case pour qu'on puisse t'écrire.",
    reseau: "Ça n'a pas marché de notre côté. Ton adresse est gardée : réessaie dans un instant.",
    limite: "Trop d'essais d'un coup. Réessaie dans une minute.",
  },
  succes: {
    titre: "Vérifie ta boîte.",
    texte: "On t'a envoyé un e-mail pour confirmer ton adresse. Tant que tu n'as pas cliqué dessus, tu ne reçois rien.",
    aide: "Rien reçu au bout de quelques minutes ? Regarde dans les spams ou les promotions.",
    renvoyer: "Renvoyer l'e-mail",
    /** `{s}` = secondes restantes. */
    renvoyerDans: "Renvoyer l'e-mail (possible dans {s} s)",
    changer: "Changer d'adresse",
  },
  /** Drapeau d'appareil (14 jours) : ligne courte à la place du formulaire. */
  drapeau: {
    texte: "Lettre : vérifie ta boîte pour confirmer.",
    renvoyer: "Renvoyer l'e-mail",
  },
  piedDePage: "La lettre du mois",
  page: {
    metaTitre: "La lettre : une vanne décryptée par mois",
    metaDescription: "Par e-mail, une fois par mois : la vanne et pourquoi elle marche. Gratuit, sans compte.",
    dernierNumero: "Le dernier numéro",
    confirmer: {
      titre: "Encore un clic.",
      texte: "Confirme ton adresse pour recevoir la lettre.",
      bouton: "Confirmer mon adresse",
    },
    desinscrire: {
      titre: "Te désinscrire de la lettre ?",
      /** @legal L6 : périmètre de la désinscription. */
      texte: "Tu ne recevras plus la lettre du mois, rien d'autre ne change. Les e-mails de ton compte et de ton abonnement (facture, sécurité, rappel avant renouvellement) continuent : ils sont obligatoires.",
      bouton: "Me désinscrire",
    },
  },
  statuts: {
    confirmee: {
      titre: "C'est confirmé.",
      texte: "La lettre arrive une fois par mois.",
      /** `{date}` = date du prochain numéro VALIDÉ programmé (sinon la ligne est omise). */
      prochain: "Prochain numéro : {date}.",
      lien: "Lire une vanne décryptée maintenant",
      lienHref: "/blague-du-jour",
    },
    desinscrit: {
      titre: "C'est fait, tu ne recevras plus la lettre.",
      lien: "Mauvais bouton ? Te réinscrire",
    },
    invalide: { titre: "Ce lien ne fonctionne plus." },
    erreur: {
      titre: "Quelque chose a coincé de notre côté. Réessaie ce lien dans un moment.",
    },
  },
} as const;

/** Pied légal commun (@legal L3) : identité, contact, confidentialité. */
function piedLegal(baseUrl: string): string[] {
  return [`Éditeur : deviens-marrant SAS. Contact : ${LETTRE_CONTACT}.`, `Confidentialité : ${baseUrl.replace(/\/$/, "")}/confidentialite`];
}

/**
 * E-mails automatiques : BROUILLONS (spec §3 et §7.2 point 3). À faire écrire
 * par @copywriter, relire à l'aveugle et valider par Thomas avant ouverture.
 * Texte seul : aucun pixel ni lien suivi (@legal L4, B4).
 * Partent de `EMAIL_FROM` (noreply@), `Reply-To` contact@, signés « L'Équipe Deviens Marrant ».
 */
export const EMAILS_LETTRE = {
  confirmation: {
    sujet: "Confirme ton adresse pour recevoir la lettre",
    corps: (lienConfirmer: string, baseUrl: string) =>
      [
        "Salut,",
        "",
        "Tu as demandé à recevoir la lettre de Deviens Marrant : une vanne décryptée, une fois par mois.",
        "",
        "Pour confirmer ton adresse, ouvre ce lien puis touche le bouton (lien valable 7 jours) :",
        lienConfirmer,
        "",
        "Si ce n'est pas toi, ignore cet e-mail : sans confirmation, tu ne reçois rien et ton adresse est effacée.",
        "",
        "L'Équipe Deviens Marrant",
        "",
        "--",
        ...piedLegal(baseUrl),
      ].join("\n"),
  },
  dejaInscrit: {
    sujet: "Tu es déjà dans la liste",
    corps: (lienDesinscrire: string, baseUrl: string) =>
      [
        "Salut,",
        "",
        "Tu es déjà dans la liste de la lettre, rien à faire : elle arrive une fois par mois.",
        "",
        "L'Équipe Deviens Marrant",
        "",
        "--",
        ...piedLegal(baseUrl),
        `Se désinscrire : ${lienDesinscrire}`,
      ].join("\n"),
  },
  reconfirmation: {
    sujet: "Tu veux toujours recevoir la lettre ?",
    corps: (lienConfirmer: string, lienDesinscrire: string, baseUrl: string) =>
      [
        "Salut,",
        "",
        "Tu reçois la lettre de Deviens Marrant depuis 2 ans. On vérifie que tu veux la garder.",
        "",
        "Pour continuer, ouvre ce lien puis touche le bouton :",
        lienConfirmer,
        "",
        "Sans clic de ta part dans les 30 jours, on te désinscrit. Rien d'autre à faire.",
        "",
        "L'Équipe Deviens Marrant",
        "",
        "--",
        ...piedLegal(baseUrl),
        `Se désinscrire maintenant : ${lienDesinscrire}`,
      ].join("\n"),
  },
  /** Pied ajouté à chaque numéro mensuel (le corps vient de `NewsletterIssue.bodyText`). */
  piedNumero: (lienDesinscrire: string, baseUrl: string) =>
    [
      "",
      "--",
      "Tu reçois cette lettre parce que tu t'es inscrit sur deviens-marrant.fr.",
      ...piedLegal(baseUrl).slice(0, 1),
      `Se désinscrire : ${lienDesinscrire}`,
      ...piedLegal(baseUrl).slice(1),
    ].join("\n"),
} as const;
