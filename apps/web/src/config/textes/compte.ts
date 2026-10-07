/**
 * Textes client du lot B « Compte et sécurité » (audit parcours s16).
 * Tous les textes de ce fichier sont PROVISOIRES : à calibrer avec Thomas
 * (règle des étalons, charte copy) avant d'être considérés comme validés.
 * Tutoiement, zéro tiret cadratin, vocabulaire « Premium ».
 */

// PROVISOIRE s16, étalon à valider
export const TEXTES_API = {
  erreurServeur: "Quelque chose a coincé de notre côté. Réessaie dans un instant.",
  donneesInvalides: "Certaines informations ne sont pas valides. Vérifie le formulaire puis réessaie.",
  emailRequis: "Indique ton adresse email.",
  tropDeTentatives: "Trop d'essais d'affilée. Attends quelques minutes puis réessaie.",
  nonConnecte: "Ta session a expiré. Reconnecte-toi puis réessaie.",
} as const;

/** Codes d'erreur renvoyés par `authorize` (NextAuth) puis lus par /login. */
export const LOGIN_ERROR_CODES = {
  tropDEssais: "TropDEssais",
  compteGoogle: "CompteGoogleSansMotDePasse",
  serveur: "ErreurServeurConnexion",
  identifiants: "CredentialsSignin",
} as const;

export type LoginErrorCode = (typeof LOGIN_ERROR_CODES)[keyof typeof LOGIN_ERROR_CODES];

// PROVISOIRE s16, étalon à valider (sauf `identifiants` et `serveur`, textes déjà en ligne)
export const TEXTES_CONNEXION = {
  identifiants: "Email ou mot de passe incorrect.",
  tropDEssais:
    "Trop d'essais d'affilée sur ce compte. Attends un quart d'heure, ou réinitialise ton mot de passe.",
  compteGoogle:
    "Ce compte a été créé avec Google : il n'a pas de mot de passe. Clique sur « Continuer avec Google ».",
  serveur: "Quelque chose a coincé de notre côté. Réessaie.",
  oauthCompteExistant:
    "Cette adresse a déjà un compte avec mot de passe : connecte-toi avec lui (tu peux le réinitialiser si tu l'as oublié).",
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
  resilier: "Résilier mon abonnement",
  resilierDetail: (date: string) => `Si tu résilies, tu gardes Premium jusqu'au ${date}, sans nouveau prélèvement.`,
  resilierDetailSansDate: "Si tu résilies, tu gardes Premium jusqu'à la fin de la période déjà payée.",
  chargement: "On redirige…",
  portailIndisponible: "La gestion de ton abonnement ne répond pas. Réessaie dans un instant.",
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
  avecAbonnement:
    "Ton abonnement Premium sera résilié tout de suite, sans nouveau prélèvement, et tu perdras l'accès immédiatement.",
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
