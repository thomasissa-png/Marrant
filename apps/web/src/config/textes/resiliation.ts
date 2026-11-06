/**
 * Textes de /resiliation, /resiliation/confirmee et des e-mails d'accusé (s23, PROVISOIRES).
 * Source unique : `docs/copy/page-resiliation-s23-textes.md` (v1, recos A pour le titre et la
 * question). À valider avec Thomas (P0 s8) puis relecture à l'aveugle (P0 s18).
 * Zéro tiret cadratin, tutoiement, aucune culpabilisation, aucune offre.
 */
import { TEXTES_ABONNEMENT } from "@/config/textes/compte";
import { RESILIATION_CONSERVATION_MOIS, RESILIATION_DELAI_EQUIPE } from "@/config/resiliation";

export const TEXTES_RESILIATION = {
  metaTitre: "Résilier ton contrat",
  /** Libellé légal unique (A1/B6) : identique au pied de page, au profil et aux e-mails. */
  titre: TEXTES_ABONNEMENT.resilier,

  recapTitre: "Ton contrat",
  recapCompte: "Compte",
  recapFormule: "Formule",
  recapFinLibelle: "Fin du contrat",
  /** Échec de lecture seulement (UX O7). */
  recapFinInconnue: "à la fin de la période déjà payée",
  /** Accès Premium sans abonnement Stripe (offert, manuel) : ni « période payée » ni prélèvement (UX O7). */
  recapFinInconnueOffert: "à la fin de ton accès Premium",
  formuleMensuelle: "Premium mensuel",
  formuleAnnuelle: "Premium annuel",
  formuleInconnue: "Premium",
  garderJusquau: (date: string) => `Jusqu’au ${date}, tu gardes tout ton Premium.`,
  garderSansDate: "Jusqu’à cette date, tu gardes tout ton Premium.",
  aucunPrelevement: "Aucun nouveau prélèvement après.",
  renouvellementAnnuel: (prix: string) => `Le renouvellement de ${prix} n’aura pas lieu.`,

  question: "Qu’est-ce qui n’a pas collé ?",
  facultatif: "Facultatif",
  questionAide: "Tu peux résilier sans répondre.",
  champLibre: "Un mot de plus ?",
  champLibreFacultatif: "(facultatif)",
  champLibrePlaceholder: "Ce que tu veux nous dire, en quelques mots",
  compteur: (n: number, max: number) => `${n}/${max}`,
  /** Mention d'information sous le champ libre (@legal O1) : `mention` + lien `mentionLien` + « . ». */
  mention: `Ta réponse est facultative. Elle est rattachée à ton compte, lue par l’équipe pour améliorer le site, et effacée après ${RESILIATION_CONSERVATION_MOIS} mois. N’y mets pas d’information sensible. Détails et droits : `,
  mentionLien: "politique de confidentialité",

  confirmer: "Confirmer la résiliation",
  reessayer: "Réessayer",
  garder: "Garder mon abonnement",

  envoi: "On résilie…",
  lent: "Toujours en cours, ne ferme pas la page.",
  /** Aucune réponse du serveur (catch) seulement (UX O4). */
  horsLigne: "Pas de connexion. Rien n’est perdu, réessaie.",
  /** Refus du serveur (429, 403, 500…) : rien n'est parti (UX O4). */
  refus: "Ça n’a pas pu partir. Rien n’est perdu, réessaie dans un instant.",
  /** UX O8 + @legal O5 réunis (délai provisoire, `RESILIATION_DELAI_EQUIPE`). */
  erreurStripe: `Ça n’a pas marché de notre côté. Ta demande est bien enregistrée : on résilie pour toi ${RESILIATION_DELAI_EQUIPE} et on te le confirme par e-mail. Tu n’as rien à refaire.`,

  dejaResilie: (date: string | null) =>
    date
      ? `Ta résiliation est déjà enregistrée. Tu gardes Premium jusqu’au ${date}.`
      : "Ta résiliation est déjà enregistrée. Tu gardes Premium jusqu’à la fin de la période déjà payée.",
  badgeEnregistree: "Enregistrée",
  reactiver: "Réactiver mon abonnement",
  rienAResilier: "Rien à résilier ici.",
  retourAccueil: "Retour à l’accueil",
  appStore: "Ton abonnement passe par Apple. La résiliation se fait dans les réglages de ton compte Apple.",
  connexion: "Connecte-toi pour résilier ton contrat. Tu reviens ici juste après.",
} as const;

export const TEXTES_RESILIATION_CONFIRMEE = {
  titre: "C’est noté.",
  garde: (date: string | null) =>
    date
      ? `Tu gardes Premium jusqu’au ${date}. Aucun nouveau prélèvement.`
      : "Tu gardes Premium jusqu’à la fin de la période déjà payée. Aucun nouveau prélèvement.",
  effets: "Ensuite, ton compte continue avec l’accès gratuit. Tes favoris et ta progression restent enregistrés.",
  email: (adresse: string) => `On t’envoie une confirmation à ${adresse}.`,
  merci: "Merci d’avoir répondu.",
  changerDAvis: "Changer d’avis ? Réactiver mon abonnement",
  retourAccueil: "Retour à l’accueil",
} as const;

/**
 * NON AFFICHÉ (UX O1, spec §2 « aucune main tendue » sur la page finale) : composant
 * `AideApresResiliation` et ligne `merci` retirés de /resiliation/confirmee. À rebrancher seulement
 * sur [CHOIX UTILISATEUR] écrit de Thomas. Chiffres non sourcés retirés (UX O1).
 * Une seule ligne d'aide après la résiliation, selon la PREMIÈRE raison cochée dans l'ordre de la
 * liste (textes §2). Aucune raison, « autre » seul ou mot seul : aucune ligne. Phrase simple, lien
 * intégré : `avant` + lien + `apres`. Jamais de bouton ni d'offre.
 */
export const AIDES_APRES_RESILIATION: Record<
  "essai" | "introuvable" | "depart" | "temps" | "prix" | "inadapte",
  { avant: string; lien: string; href: string; apres: string }
> = {
  essai: { avant: "Merci d’avoir essayé. ", lien: "La vanne du jour", href: "/blague-du-jour", apres: " reste en accès libre si tu repasses." },
  introuvable: {
    avant: "Dis-nous ce que tu cherchais, on lit les messages envoyés à ",
    lien: "contact@deviens-marrant.fr",
    href: "mailto:contact@deviens-marrant.fr",
    apres: ".",
  },
  depart: {
    avant: "Le guide ",
    lien: "« Comment devenir drôle »",
    href: "/blog/comment-devenir-drole",
    apres: " tient en un article.",
  },
  temps: { avant: "", lien: "Les parcours", href: "/parcours", apres: ", à ton rythme : rien ne se bloque." },
  prix: {
    // `{dateFin}` remplacé au rendu (repli sans date : « Après la fin du contrat »).
    avant: "Après le {dateFin}, la vanne du jour et la première étape de ",
    lien: "chaque parcours",
    href: "/parcours",
    apres: " restent libres.",
  },
  inadapte: {
    avant: "Le ",
    lien: "quiz « quel type d’humour es-tu ? »",
    href: "/quiz-humour",
    apres: " est en accès libre, sans inscription.",
  },
};

/**
 * Politique de confidentialité (@legal O2 et O3, mot pour mot ; durée provisoire
 * `RESILIATION_CONSERVATION_MOIS`). Publiée seulement interrupteur `RESILIATION_PAGE_OUVERTE` ouvert.
 */
export const CONFIDENTIALITE_RESILIATION = {
  donnees:
    "Résiliation, si tu réponds à la question facultative : les raisons cochées, ton mot libre, ta formule (mensuelle ou annuelle), l’ancienneté de ton abonnement en jours et la date. Ni ton adresse e-mail ni ton adresse IP ne sont ajoutées.",
  base: "Comprendre pourquoi des abonnés résilient, pour améliorer le site : intérêt légitime. Ta réponse est facultative et tu peux t’y opposer (voir la partie 7).",
  duree: `Ta réponse à la question de la résiliation est gardée ${RESILIATION_CONSERVATION_MOIS} mois, puis effacée. Si tu supprimes ton compte, ton mot libre est effacé et tes raisons cochées sont détachées de ton compte.`,
  droits: "Tu peux demander l’accès ou l’effacement de ta réponse à la résiliation en écrivant à contact@deviens-marrant.fr.",
} as const;
