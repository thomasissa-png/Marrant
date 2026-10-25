/**
 * Textes de « Ta question à l'équipe » (V1, s22). Rendu avec `frTypo` (insécables,
 * apostrophes, « e-mail » lié), texte stocké intact.
 *
 * Sources (font foi) :
 *  - encadré : recos @copywriter du 25/10 (1A, 2A, champ, 4A, 5B, erreurs), délai remplacé
 *    partout par la formule de Thomas et de @legal : « En général, réponse par e-mail sous
 *    1 à 2 jours ouvrés. » ; mention sous le bouton : avis @legal du 25/10, point 1 ;
 *  - confidentialité (section 9, partie 4) : avis @legal du 25/10, point 2, mot pour mot ;
 *  - CGU (article 10) : avis @legal du 25/10, point 3, délai adapté à la décision de Thomas
 *    (au plus tard 3 jours ouvrés, on prévient en cas de retard ; jamais 7 jours).
 * Relecture à l'aveugle obligatoire avant ouverture (règle d'or P0 s18).
 */

/** Délai affiché (décision de Thomas du 25/10, formulation @legal point 5). */
export const QUESTION_EQUIPE_DELAI = "En général, réponse par e-mail sous 1 à 2 jours ouvrés.";

export const QUESTION_EQUIPE_UI = {
  titre: "Ta question à l'équipe",
  accroche: "On t'a chambré, tu es resté sans voix, un message te bloque ? Raconte, l'équipe te répond.",
  delai: QUESTION_EQUIPE_DELAI,
  libelle: "Ta situation",
  aide: "Par exemple : un collègue te chambre devant tout le monde et tu n'as rien trouvé à répondre.",
  compteur: (n: string, max: string) => `${n} / ${max} caractères`,
  bouton: "Envoyer ma question",
  envoiEnCours: "Envoi en cours",
  /** Mention @legal (point 1) : « Confidentialité » est le lien vers la section 9. */
  mention: {
    avantLien: "Ton message est lu par l'équipe pour te répondre. Évite les infos sur ta santé ou sur des tiers. Détails et droits : ",
    lien: "Confidentialité",
    apresLien: ".",
  },
  succes: `Bien reçu. On regarde ta situation. ${QUESTION_EQUIPE_DELAI}`,
  erreurs: {
    vide: "Ton champ est vide. Décris ta situation en quelques lignes, puis envoie.",
    tropLong: "Ta situation dépasse 1 000 caractères. Raccourcis-la pour garder l'essentiel, puis renvoie.",
    envoi: "Ton message n'est pas parti. Réessaie dans un instant, ou écris-nous à contact@deviens-marrant.fr.",
    trop: "Trop d'envois en peu de temps. Patiente quelques minutes, puis renvoie.",
    session: { avant: "Ta session a expiré. ", lien: "Reconnecte-toi", apres: ", puis renvoie ton message." },
  },
} as const;

/** E-mail reçu par l'équipe (interne). Objet FIXE, sans aucune donnée de l'abonné. */
export const QUESTION_EQUIPE_EMAIL = {
  objet: "Ta question à l'équipe : nouvelle question d'un abonné Premium",
  corps: (question: string) =>
    [
      "Nouvelle question d'un abonné Premium (encadré « Ta question à l'équipe » du profil).",
      "Répondre à cet e-mail : la réponse part à l'adresse du compte (Reply-To, lue dans la session).",
      "",
      "----- Question -----",
      question,
      "----- Fin de la question -----",
      "",
      "Rappels (avis @legal du 25/10) : relire et envoyer chaque réponse, jamais d'envoi automatique ; dans un outil de rédaction, coller seulement le texte de la question, jamais l'adresse ni le prénom ; situation sensible : réponse sérieuse et personnelle, sans humour, orienter vers l'aide officielle (3114 en cas de détresse) ; signature « L'Équipe Deviens Marrant » ; réponse en général sous 1 à 2 jours ouvrés, au plus tard 3 jours ouvrés, sinon prévenir ; effacement 6 mois après le dernier échange.",
    ].join("\n"),
} as const;

/** Confidentialité, section 9 (avis @legal point 2, mot pour mot). */
export const CONFIDENTIALITE_QUESTION_EQUIPE = {
  titre: "9. Ta question à l'équipe (abonnés Premium)",
  puces: [
    "Ce qu'on reçoit : le texte de ta question (1 000 caractères au plus) et l'adresse e-mail de ton compte, pour te répondre. Le site ne les garde pas dans sa base de données : ton message est envoyé par e-mail à l'équipe.",
    "Pourquoi : lire ta question et y répondre, un service compris dans ton abonnement Premium. Base : exécution du contrat.",
    "Qui y accède : l'équipe, dans la boîte contact@deviens-marrant.fr. Ton message passe par Resend (envoi), et l'équipe peut se servir d'outils de rédaction pour préparer sa réponse (voir la partie 4). Rien n'est publié ni repris ailleurs sans ton accord.",
    "Combien de temps : ta question et notre réponse restent dans la boîte e-mail de l'équipe 6 mois après votre dernier échange, puis sont effacées. Tu peux demander leur effacement plus tôt.",
    "Tes droits : pour une copie de tes échanges ou pour les faire effacer, écris à contact@deviens-marrant.fr (voir la partie 7).",
  ],
} as const;

/** Confidentialité, partie 4 (avis @legal point 2 ; IONOS : décision de Thomas du 25/10, condition C3). */
export const PRESTATAIRES_QUESTION_EQUIPE = {
  resendRole: "envoi des e-mails liés à ton compte et à ton abonnement, des lettres et de tes messages à l'équipe",
  ajouts: [
    { nom: "IONOS", role: "hébergement de la boîte e-mail de l'équipe (contact@deviens-marrant.fr), où arrivent tes messages à l'équipe" },
    { nom: "Outils de rédaction", role: "l'équipe s'en sert pour préparer ses réponses. Ils reçoivent le texte de ta question, pas les informations de ton compte." },
  ],
} as const;

/** CGU, article 10 (avis @legal point 3, délai adapté : au plus tard 3 jours ouvrés). */
export const CGU_QUESTION_EQUIPE = {
  titre: "10. La lettre et ta question à l'équipe",
  texte:
    "Ta question à l'équipe. Les abonnés Premium peuvent écrire à l'équipe depuis leur profil pour décrire une situation où la répartie leur a manqué. L'équipe répond par e-mail, en général sous 1 à 2 jours ouvrés, et au plus tard sous 3 jours ouvrés ; en cas de retard, on te prévient. La réponse est un conseil d'humour et de répartie : elle ne remplace ni un avis médical, ni un avis psychologique, ni un avis juridique, et ne garantit aucun résultat. Ne mets dans ta question ni information sensible sur toi, ni nom de personne. L'équipe peut écarter une question contraire à l'article 4 : dans ce cas, on te le dit. Tu restes titulaire de ce que tu écris, et rien n'est publié ni repris ailleurs sans ton accord. Ce service est réservé aux abonnés Premium : il s'arrête avec ton abonnement, et les e-mails déjà reçus restent dans ta boîte.",
} as const;
