/**
 * Textes client du lot B « Compte et sécurité » (audit parcours s16).
 * Tous les textes de ce fichier sont PROVISOIRES : à calibrer avec Thomas
 * (règle des étalons, charte copy) avant d'être considérés comme validés.
 * Tutoiement, zéro tiret cadratin, vocabulaire « Premium ».
 */

// PROVISOIRE s16, étalon à valider (sauf `erreurServeur`, étalon 4 b, et `tropDeTentatives`, étalon 4 b adapté)
export const TEXTES_API = {
  erreurServeur: "Quelque chose a coincé de notre côté. Réessaie dans un instant.",
  donneesInvalides: "Certaines informations ne sont pas valides. Vérifie le formulaire puis réessaie.",
  emailRequis: "Indique ton adresse email.",
  /** Étalon 4 « trop d'essais » b, sans la seconde sortie (inscription, mot de passe oublié : pas de réinitialisation à proposer). */
  tropDeTentatives: "Trop d'essais pour l'instant, c'est une sécurité. Attends un peu.",
  nonConnecte: "Ta session a expiré. Reconnecte-toi puis réessaie.",
} as const;

/** Codes d'erreur renvoyés par `authorize` (NextAuth) puis lus par /login. */
export const LOGIN_ERROR_CODES = {
  tropDEssais: "TropDEssais",
  serveur: "ErreurServeurConnexion",
  identifiants: "CredentialsSignin",
} as const;

export type LoginErrorCode = (typeof LOGIN_ERROR_CODES)[keyof typeof LOGIN_ERROR_CODES];

// VALIDÉ s16 (étalon 4, recos c/b/b/b/b), sauf `lienConnexionMobile` (PROVISOIRE, hors étalons).
export const TEXTES_CONNEXION = {
  /** Étalon 4, identifiants incorrects, variante c. */
  identifiants: "E-mail ou mot de passe incorrect. Réessaie, ou réinitialise ton mot de passe.",
  /** Étalon 4, trop d'essais, variante b (aucune durée écrite tant qu'elle n'est pas confirmée). */
  tropDEssais: "Trop d'essais pour l'instant, c'est une sécurité. Attends un peu, ou réinitialise ton mot de passe.",
  /**
   * Étalon 4, compte créé avec Google, variante b : aide affichée sous l'erreur
   * générique (`identifiants`), pour TOUT échec d'identifiants. L'écran est donc
   * identique qu'un compte Google existe ou non (aucune fuite d'information).
   */
  aideCompteGoogle: "Si tu as créé ton compte avec Google, clique sur « Continuer avec Google ».",
  /** Étalon 4, erreur serveur, variante b. */
  serveur: "Quelque chose a coincé de notre côté. Réessaie dans un instant.",
  /** Étalon 4, adresse déjà liée à un compte avec mot de passe (inscription Google), variante b. */
  oauthCompteExistant:
    "Cette adresse a déjà un compte avec mot de passe : connecte-toi avec, ou demande-en un nouveau si tu l'as oublié.",
  // PROVISOIRE s16, hors étalons
  lienConnexionMobile: "Connexion",
} as const;

// PROVISOIRE s16, étalon à valider
export const TEXTES_RESET = {
  afficherMotDePasse: "Afficher le mot de passe",
  masquerMotDePasse: "Masquer le mot de passe",
} as const;

// ---------------------------------------------------------------------------
// Profil : abonnement (reco 11)
// ---------------------------------------------------------------------------

/** « 12 novembre 2026 » (fuseau Paris). */
export function dateLongue(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(
    new Date(iso),
  );
}

// PROVISOIRE s16, étalon à valider
export const TEXTES_ABONNEMENT = {
  titre: "Abonnement",
  badgePremium: "Premium",
  badgeAucun: "Aucun abonnement",
  badgeImpaye: "Paiement refusé",
  badgeResilie: "Premium jusqu'au terme",
  formuleMensuelle: "Formule mensuelle",
  formuleAnnuelle: "Formule annuelle",
  prochainPrelevement: (date: string) => `Prochain prélèvement le ${date}.`,
  premiumJusquau: (date: string) => `Premium jusqu'au ${date}.`,
  resilieDetail: "Tu as résilié : aucun nouveau prélèvement. Tu peux changer d'avis depuis « Gérer mon abonnement ».",
  impaye:
    "Ton dernier paiement a été refusé. Mets à jour ta carte pour garder Premium : on réessaie automatiquement dans les prochains jours.",
  majCarte: "Mettre à jour ma carte",
  gerer: "Gérer mon abonnement",
  changerFormule: "Changer de formule",
  versAnnuel: (avantage: string) => `Passe à l'annuel : ${avantage}.`,
  versMensuel: "Tu peux repasser au mensuel à tout moment, le changement se fait à la fin de ta période.",
  /** Libellé unique de résiliation (D6 + formule analogue au décret 2023-417), repris par les e-mails et la CGU. */
  resilier: "Résilier ton contrat",
  resilierDetail: (date: string) => `Si tu résilies, tu gardes Premium jusqu'au ${date}, sans nouveau prélèvement.`,
  resilierDetailSansDate: "Si tu résilies, tu gardes Premium jusqu'à la fin de la période déjà payée.",
  chargement: "On redirige…",
  portailIndisponible: "La gestion de ton abonnement ne répond pas. Réessaie dans un instant.",
  // PROVISOIRE lot G : bouton de résiliation affiché sans client Stripe connu (portail en 404).
  aucunAbonnementCarte:
    "On ne trouve pas d'abonnement par carte sur ton compte. Écris-nous à contact@deviens-marrant.fr si tu penses que c'est une erreur.",
  connexionPerdue: "Connexion perdue, réessaie.",
} as const;

// ---------------------------------------------------------------------------
// Profil : suppression du compte (reco 5)
// ---------------------------------------------------------------------------

/** Mot à retaper pour confirmer (comparé sans tenir compte de la casse ni des espaces). */
export const MOT_CONFIRMATION_SUPPRESSION = "SUPPRIMER";

// PROVISOIRE s16, étalon à valider
export const TEXTES_SUPPRESSION = {
  titre: "Supprimer mon compte",
  intro:
    "Tu peux supprimer ton compte quand tu veux. On efface ton profil, tes favoris, ta progression et ton inscription à la newsletter. C'est définitif.",
  /**
   * Avertissement avant suppression d'un compte abonné (lot G, relecture @legal
   * point 8). Avec date : texte exact @legal. Sans date (résumé illisible) :
   * PROVISOIRE lot G, même texte sans la date.
   */
  avecAbonnement: (fin: string | null) =>
    fin
      ? `Ton abonnement Premium sera résilié tout de suite et tu perdras l'accès immédiatement, même si tu as payé jusqu'au ${fin}. La période déjà payée n'est pas remboursée. Pour garder Premium jusqu'au ${fin}, résilie d'abord ton abonnement, puis supprime ton compte après cette date.`
      : "Ton abonnement Premium sera résilié tout de suite et tu perdras l'accès immédiatement, même si ta période payée n'est pas terminée. La période déjà payée n'est pas remboursée. Pour garder Premium jusqu'à la fin de cette période, résilie d'abord ton abonnement, puis supprime ton compte après cette date.",
  /** PROVISOIRE lot G : abonnement déjà résilié (fin de période programmée). */
  avecAbonnementResilie: (fin: string) =>
    `Tu as déjà résilié ton abonnement. Si tu supprimes ton compte maintenant, tu perds tout de suite l'accès Premium payé jusqu'au ${fin}, et la période déjà payée n'est pas remboursée. Pour en profiter jusqu'au bout, supprime ton compte après cette date.`,
  /** Texte exact @legal (point 8), coupé autour du lien vers /retractation. */
  retractationAvant: "Tu as souscrit il y a moins de 14 jours ? Demande ton remboursement avec le ",
  retractationLien: "formulaire de rétractation",
  retractationApres: " avant de supprimer ton compte.",
  ouvrir: "Supprimer mon compte",
  consigne: `Pour confirmer, tape ${MOT_CONFIRMATION_SUPPRESSION} ci-dessous.`,
  confirmer: "Supprimer définitivement",
  annuler: "Annuler",
  enCours: "Suppression…",
  motIncorrect: `Tape exactement ${MOT_CONFIRMATION_SUPPRESSION} pour confirmer.`,
  echecStripe:
    "On n'a pas réussi à résilier ton abonnement, donc rien n'a été supprimé. Réessaie dans un instant ou écris-nous.",
  echec: "La suppression n'a pas abouti, rien n'a été effacé. Réessaie dans un instant.",
  succes: "Ton compte est supprimé. Merci d'être passé par ici.",
} as const;
