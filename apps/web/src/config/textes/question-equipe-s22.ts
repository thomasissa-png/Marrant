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

/** Texte avec un lien en ligne (`mailto:` ou page du site). */
export type TexteAvecLien = { avant: string; lien: string; href: string; apres: string };

/** Adresse générale de l'équipe, proposée quand l'encadré ne peut pas envoyer. */
const CONTACT = "contact@deviens-marrant.fr";
const ECRIS_NOUS = (avant: string, apres: string): TexteAvecLien => ({ avant, lien: CONTACT, href: `mailto:${CONTACT}`, apres });

/**
 * Encadré, textes v2 de @copywriter (tour 2, s22, après la relecture à l'aveugle NO-GO 8/10) :
 * accroche neutre en genre (O1), bouton « Envoyer à l'équipe » (O2), mention alignée sur
 * l'exemple et les CGU (B2), succès variante A (C1), erreurs sans « renvoie » quand rien
 * n'est parti (C2, C3), « trop d'envois » vrai quelle que soit la durée (B3), état 403
 * « plus Premium » (B5), adresse en lien `mailto:` (O3).
 */
export const QUESTION_EQUIPE_UI = {
  titre: "Ta question à l'équipe",
  accroche: "Une vanne qui t'a cloué le bec, un silence gênant, un message que tu n'arrives pas à écrire ? Raconte, l'équipe te répond.",
  delai: QUESTION_EQUIPE_DELAI,
  libelle: "Ta situation",
  aide: "Par exemple : un collègue te chambre devant tout le monde et tu n'as rien trouvé à répondre.",
  compteur: (n: string, max: string) => `${n} / ${max} caractères`,
  bouton: "Envoyer à l'équipe",
  envoiEnCours: "Envoi en cours",
  /** « Confidentialité » est le lien vers la section 9. */
  mention: {
    avantLien: "Ton message est lu par l'équipe pour te répondre. Évite les noms et les infos sur ta santé. Détails et droits : ",
    lien: "Confidentialité",
    apresLien: ".",
  },
  /** Variante A (le composant ne connaît pas l'adresse du compte). */
  succes: "Bien reçu. On te répond à l'adresse e-mail de ton compte, en général sous 1 à 2 jours ouvrés.",
  erreurs: {
    vide: "Le champ est vide. Décris ta situation en quelques lignes, puis envoie.",
    /** `max` = `QUESTION_EQUIPE_MAX` formaté (« 1 000 »). */
    tropLong: (max: string) => `Ton message dépasse ${max} caractères. Garde l'essentiel, puis envoie.`,
    /** Relecture finale B1 : vrai même si Resend a fini par envoyer (délai de 5 s, réponse perdue). */
    envoi: ECRIS_NOUS("On n'a pas pu confirmer l'envoi. Réessaie dans un instant, ou écris-nous à ", "."),
    /** Défaut, vrai pour la limite de 10 minutes comme pour celle de 24 heures. */
    trop: ECRIS_NOUS("Trop d'envois pour le moment. Réessaie plus tard, ou écris-nous à ", ". Ton texte reste dans le champ."),
    /** Seulement si `Retry-After` ≤ 15 minutes. */
    tropCourt: "Trop d'envois pour le moment. Réessaie dans quelques minutes. Ton texte reste dans le champ.",
    /** La reconnexion quitte la page et le champ n'est pas conservé (variante prévue par @copywriter). */
    session: {
      avant: "Ta session a expiré. ",
      lien: "Reconnecte-toi",
      href: "/login?callbackUrl=/profil",
      apres: ", puis envoie ton message. Copie ton texte avant, il ne sera pas conservé.",
    } satisfies TexteAvecLien,
    /** 403 `non-premium` : Premium arrêté entre l'affichage et l'envoi. Aucun « réessaie ». */
    nonPremium: {
      avant: "Cette fonction est réservée aux abonnés Premium, et ton abonnement n'est plus actif. Ton texte reste dans le champ. ",
      lien: "Voir mon abonnement",
      href: "/abonnement",
      apres: "",
    } satisfies TexteAvecLien,
  },
} as const;

/** Seuil de `tropCourt` : au-delà, `trop` (« Réessaie plus tard »). */
export const QUESTION_EQUIPE_TROP_COURT_MAX_S = 15 * 60;

/**
 * E-mail reçu par l'équipe. Objet sans aucune donnée de l'abonné, horodaté (jour et heure de
 * Paris, « 25/10 14:32 ») pour que le webmail ne range pas toutes les questions dans un seul
 * fil. Corps (gabarit @copywriter v2) : la question telle quelle, puis la ligne d'envoi, et
 * RIEN d'autre (l'abonné revoit ce corps cité dans la réponse) ; les rappels internes sont
 * dans `docs/marrant/playbook.md`. `le` = « 25/10/2026 », `a` = « 14:32 » (Paris).
 */
export const QUESTION_EQUIPE_EMAIL = {
  objet: (quand: string) => `Ta question à l'équipe · ${quand} (Paris)`,
  corps: (question: string, le: string, a: string) => [question, "", `Question envoyée depuis ton profil Premium le ${le} à ${a}.`].join("\n"),
} as const;

/** Confidentialité, section 9 (avis @legal point 2 ; boîte alex@ chez IONOS depuis le 25/10). */
export const CONFIDENTIALITE_QUESTION_EQUIPE = {
  titre: "9. Ta question à l'équipe (abonnés Premium)",
  puces: [
    "Ce qu'on reçoit : le texte de ta question (1 000 caractères au plus) et l'adresse e-mail de ton compte, pour te répondre. Le site ne les garde pas dans sa base de données : ton message est envoyé par e-mail à l'équipe.",
    "Pourquoi : lire ta question et y répondre, un service compris dans ton abonnement Premium. Base : exécution du contrat.",
    "Qui y accède : l'équipe, dans sa boîte alex@deviens-marrant.fr, hébergée chez IONOS et transférée vers sa messagerie Gmail (Google). Ton message passe par Resend (envoi), et l'équipe peut se servir d'outils de rédaction pour préparer sa réponse (voir la partie 4). Rien n'est publié sans ton accord.",
    "Combien de temps : ta question et notre réponse restent dans les boîtes e-mail de l'équipe au plus 6 mois après notre dernier échange, même si tu supprimes ton compte avant, puis sont effacées. Tu peux demander leur effacement plus tôt.",
    "Tes droits : pour une copie de tes échanges ou pour les faire effacer, écris à contact@deviens-marrant.fr (voir la partie 7).",
  ],
} as const;

/**
 * Confidentialité, partie 4 (avis @legal point 2 ; condition C3). Les questions arrivent dans
 * la boîte alex@ (décision de Thomas du 25/10), hébergée chez IONOS et, comme contact@,
 * transférée vers la messagerie Gmail de l'équipe : IONOS ET Google sont déclarés.
 */
export const PRESTATAIRES_QUESTION_EQUIPE = {
  resendRole: "envoi des e-mails liés à ton compte et à ton abonnement, des lettres et de tes messages à l'équipe",
  googleRole:
    "connexion avec ton compte Google, si tu la choisis, lecture des vidéos YouTube, et messagerie Gmail de l'équipe, qui reçoit les messages envoyés à contact@deviens-marrant.fr et à alex@deviens-marrant.fr, dont tes messages à l'équipe",
  ajouts: [
    { nom: "IONOS", role: "hébergement de la boîte e-mail de l'équipe (alex@deviens-marrant.fr), qui transfère tes messages à l'équipe vers sa messagerie Gmail (Google)" },
    { nom: "Outils de rédaction", role: "l'équipe s'en sert pour préparer ses réponses. Ils reçoivent le texte de ta question, pas les informations de ton compte." },
  ],
} as const;

/** CGU, article 10 (avis @legal point 3, délai adapté : au plus tard 3 jours ouvrés). */
export const CGU_QUESTION_EQUIPE = {
  titre: "10. La lettre et ta question à l'équipe",
  /** Relecture finale P3-1 : titre en ligne, rendu en gras. */
  amorce: "Ta question à l'équipe.",
  /** P3-2 : tutoiement d'un bout à l'autre ; P2-2 : « rien n'est publié » (plus de « ni repris ailleurs », lu contre les outils de rédaction). */
  texte:
    "Avec un abonnement Premium, tu peux écrire à l'équipe depuis ton profil pour décrire une situation où la répartie t'a manqué. L'équipe répond par e-mail, en général sous 1 à 2 jours ouvrés, et au plus tard sous 3 jours ouvrés ; en cas de retard, on te prévient. La réponse est un conseil d'humour et de répartie : elle ne remplace ni un avis médical, ni un avis psychologique, ni un avis juridique, et ne garantit aucun résultat. Ne mets dans ta question ni information sensible sur toi, ni nom de personne. L'équipe peut écarter une question contraire à l'article 4 : dans ce cas, on te le dit. Tu restes titulaire de ce que tu écris, et rien n'est publié sans ton accord. Ce service est réservé aux abonnés Premium : il s'arrête avec ton abonnement, et les e-mails déjà reçus restent dans ta boîte.",
} as const;

/**
 * Conservation cohérente (avis @legal du 25/10, §4.3, bloquant B1 de la relecture) : phrases
 * publiées seulement interrupteur ouvert, comme le reste du service. La phrase sur la copie
 * technique de Resend (§4.3) n'est pas reprise (décision du 25/10 : pas de nouvelle mention).
 */
export const CONSERVATION_QUESTION_EQUIPE = {
  /** CGU article 7, fin du premier paragraphe. */
  cgu: "Tes échanges par e-mail avec l'équipe (Ta question à l'équipe) suivent leur propre durée : ils restent au plus 6 mois après notre dernier échange, même si tu supprimes ton compte, puis sont effacés. Tu peux demander leur effacement plus tôt (voir la politique de confidentialité).",
  /** Confidentialité partie 6, dernier paragraphe. */
  confidentialite:
    "Tes questions à l'équipe et nos réponses suivent leur propre durée (voir la partie 9) : elles restent dans les boîtes e-mail de l'équipe au plus 6 mois après notre dernier échange, même si tu supprimes ton compte avant, puis sont effacées. Tu peux demander leur effacement plus tôt à contact@deviens-marrant.fr.",
} as const;
