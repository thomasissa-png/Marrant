/**
 * Textes de « Ta question à l'équipe » (s21).
 *
 * >>> À RELIRE À L'AVEUGLE AVANT OUVERTURE (règle d'or P0 s18) <<<
 * Rien de ce fichier n'est visible tant que `QUESTIONS_OUVERTES` est fermé.
 *
 * Sources : spec `docs/product/ta-question-a-l-equipe-s21.md` §2.2, §2.3, §2.4 ;
 * consigne avant le champ et case de réutilisation : textes @legal
 * (`docs/legal/lettre-et-questions-s21.md` Q1 et Q4). Écarts de la session 21 :
 * délai de 48 h, aucune limite affichée, accord par extrait (« Publier »).
 * Les textes marqués [PROVISOIRE] n'existent pas dans la spec : écrits pour
 * que l'écran fonctionne, à valider avec le reste.
 *
 * Voix du site : tutoiement, « on », zéro tiret cadratin, zéro émoji, aucune
 * mention d'outil, signature « L'Équipe Deviens Marrant » (test automatique).
 */
import { LIMITES, SIGNATURE_EQUIPE } from "@/config/equipe-questions";

export const TEXTES_EQUIPE_PAGE = {
  titre: "Ta question à l'équipe",
  /** [PROVISOIRE] */
  intro: "Raconte la situation où la répartie t'a manqué. L'équipe te répond par e-mail, en privé.",
  consigne:
    "Ta question reste privée : seule l'équipe la lit, avec des outils de rédaction qui ne reçoivent ni ton nom ni ton e-mail. Ne mets ni nom de personne, ni information sur ta santé, ta vie intime ou tes opinions : on n'en a pas besoin. Détails et droits : ",
  lienConfidentialite: "Confidentialité",
  labelSituation: "La situation",
  /** [PROVISOIRE] */
  aideSituation: "Qui t'a dit quoi, où, devant qui. Pas besoin de nom.",
  labelRetour: "Ce que j'ai répondu, ou pas",
  facultatif: "(facultatif)",
  labelReutilisation:
    "Oui, l'équipe peut reprendre une version retouchée de ma question dans la lettre Premium, après que j'aie approuvé le texte exact.",
  bouton: "Envoyer ma question",
  boutonEnvoi: "Envoi en cours",
  compteur: (n: number, max: number) => `${n} / ${max}`,
  historiqueTitre: "Mes questions",
  historiqueVide:
    "Tu n'as pas encore posé de question. Une situation où tu as manqué de répartie fait une très bonne première question.",
  voirDetail: "Voir",
  /** Entrée E1 du profil (spec §2.1) ; la phrase reprend l'intro [PROVISOIRE]. */
  boutonProfil: "Poser ma question",
} as const;

export const TEXTES_EQUIPE_ETATS = {
  succes: (dateLimite: string, email: string) =>
    `Question reçue. Tu reçois la réponse de l'équipe au plus tard le ${dateLimite}. On t'écrit à ${email}.`,
  voirQuestions: "Voir mes questions",
  situationCourte: `Décris un peu plus la situation (${LIMITES.situationMin} caractères minimum).`,
  situationLongue: (enTrop: number) =>
    `${LIMITES.situationMax.toLocaleString("fr-FR")} caractères maximum, il en reste ${enTrop} à enlever.`,
  retourLong: (enTrop: number) => `${LIMITES.retourMax} caractères maximum, il en reste ${enTrop} à enlever.`,
  gardeFou:
    "On te répond d'abord sur tes questions précédentes. Tu pourras en poser une nouvelle dès qu'on y aura répondu.",
  erreurServeur:
    "Ça n'a pas marché de notre côté. Ta question est gardée dans ce formulaire : réessaie dans un instant.",
  nonPremium: "Ta question à l'équipe fait partie de Premium.",
  lienAbonnement: "Voir Premium",
  introuvable: "Cette question n'existe plus.",
} as const;

/** Libellés vus par l'abonné (3 seulement, spec §3.1). */
export const LIBELLES_STATUT_ABONNE = {
  RECUE: "Reçue",
  BROUILLON: "En préparation",
  RELUE: "En préparation",
  ENVOYEE: "Réponse envoyée",
  ECARTEE: "Réponse envoyée",
} as const;

export const TEXTES_EQUIPE_DETAIL = {
  retour: "Ta question",
  tonRetour: "Ce que tu as répondu",
  reponse: "La réponse de l'équipe",
  enAttente: (dateLimite: string) => `L'équipe te répond au plus tard le ${dateLimite}.`,
  supprimer: "Supprimer cette question",
  supprimerConfirmer: "Supprimer définitivement cette question et sa réponse ?",
  /** [PROVISOIRE] */
  extraitTitre: "Reprise dans la lettre Premium",
  extraitIntro:
    "L'équipe aimerait reprendre une version retouchée de ta question dans la lettre Premium. Voici le texte exact :",
  extraitSilence: "Sans réponse de ta part, rien n'est publié.",
  publier: "Publier",
  refuser: "Je préfère que non",
  extraitAccepte: "Merci : ce texte pourra paraître dans la lettre Premium.",
  extraitRefuse: "C'est noté : ce texte ne sera pas publié.",
  retourListe: "Toutes mes questions",
} as const;

/** E-mails à l'abonné. [PROVISOIRE] sauf mention : brouillons à valider par Thomas. */
export const EMAILS_EQUIPE = {
  accuse: {
    sujet: "Ta question est bien arrivée",
    corps: (salut: string, dateLimite: string) =>
      `${salut}\n\nOn a bien reçu ta question. Tu reçois la réponse de l'équipe au plus tard le ${dateLimite}, par e-mail, et dans ton espace.\n\n${SIGNATURE_EQUIPE}`,
  },
  reponse: {
    sujet: (debut: string) => `Ta question : « ${debut} »`,
    corps: (salut: string, reponse: string, lien: string) =>
      `${salut}\n\n${reponse}\n\nTu retrouves cette réponse dans ton espace : ${lien}`,
  },
  ecartee: {
    sujet: "À propos de ta question",
    corps: (salut: string, lien: string) =>
      `${salut}\n\nOn ne peut pas répondre à cette question-là : elle sort de ce qu'on sait faire. Tu peux en poser une autre quand tu veux : ${lien}\n\n${SIGNATURE_EQUIPE}`,
  },
  extrait: {
    sujet: "On aimerait reprendre ta question dans la lettre",
    corps: (salut: string, extrait: string, lien: string) =>
      `${salut}\n\nL'équipe aimerait reprendre une version retouchée de ta question dans la lettre Premium. Voici le texte exact :\n\n${extrait}\n\nPour accepter ou refuser, c'est ici : ${lien}\nSans réponse de ta part, rien n'est publié.\n\n${SIGNATURE_EQUIPE}`,
  },
} as const;

/** E-mails internes (adresse d'administration configurée). */
export const EMAILS_ADMIN_EQUIPE = {
  arrivee: (n: number) => (n > 1 ? `${n} nouvelles questions à l'équipe` : "Nouvelle question à l'équipe"),
  echeance: (n: number) => `Échéance proche : ${n} question${n > 1 ? "s" : ""} sans réponse envoyée`,
} as const;

/** Repli de l'objet de la réponse : premiers mots de la situation. */
export const DEBUT_SUJET_MOTS = 8;
