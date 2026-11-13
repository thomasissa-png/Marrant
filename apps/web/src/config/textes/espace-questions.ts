/**
 * Textes de « Mes questions » (s24, lot D7). Sources, mot pour mot : `docs/copy/libelles-espace-e5-s24.md`
 * (lignes 20 à 24 et v6), maquette `docs/espace-client/etalons/e5/mes-questions.html` (états), architecture
 * v20 2.6 (descriptions des trois types, « Évite les noms : décris la scène. », délai, retard, retiré).
 * Erreurs : celles, déjà en ligne et validées, de « Ta question à l'équipe » (`question-equipe-s22.ts`),
 * reprises sans retouche ; seule l'adresse de reconnexion change (retour sur « Mes questions »).
 * Le marqueur [PISTE] de l'exemple « Une question » vit dans la maquette, pas à l'écran.
 */
import { QUESTION_EQUIPE_UI } from "@/config/textes/question-equipe-s22";
import type { TypeQuestion } from "@/lib/espace/questions-types";

const CONTACT = "contact@deviens-marrant.fr";

export const TEXTES_QUESTIONS = {
  titre: "Mes questions",
  ecrire: {
    titre: "Écrire à l'équipe",
    legende: "C'est à propos de quoi ?",
    champ: "Ton message",
    aide: "Évite les noms : décris la scène.",
    delai: "L'équipe répond en général sous 1 à 2 jours ouvrés",
    bouton: "Envoyer à l'équipe",
    envoiEnCours: "Envoi en cours",
    envoye: "Envoyé, l'équipe répond en général sous 1 à 2 jours ouvrés",
  },
  types: {
    PROBLEME: {
      nom: "Un problème",
      description: "Quelque chose ne marche pas ou ne se passe pas comme prévu sur le site (accès, paiement, affichage).",
      exemple: "Mon paiement est passé, mais je n'ai pas accès aux parcours.",
    },
    SITUATION: {
      nom: "Une situation à gérer",
      description: "Une scène que tu vas vivre ou que tu viens de vivre, et pour laquelle tu veux des idées de réponse.",
      exemple: "Un collègue me chambre devant tout le monde, je n'ai rien trouvé à répondre.",
    },
    QUESTION: {
      nom: "Une question",
      description: "Tout le reste : comprendre une technique d'humour, un contenu, l'offre.",
      exemple: "Est-ce que cette blague est lourde ? Voici la scène…",
    },
  } satisfies Record<TypeQuestion, { nom: string; description: string; exemple: string }>,
  envois: {
    titre: "Mes envois",
    exempleIntro: "Par exemple, pour « Une question » :",
    envoyeLe: (date: string) => `Envoyé le ${date}`,
    reponduLe: (date: string) => `Répondu le ${date}`,
    enAttente: "Envoyé, l'équipe répond en général sous 1 à 2 jours ouvrés",
    enRetard: "L'équipe n'a pas encore répondu, ta demande est bien là",
    tonMessage: "Ton message",
    reponseLe: (date: string) => `Réponse de l'équipe, le ${date}`,
    signature: "L'Équipe Deviens Marrant",
    continuer: "Continuer",
    retirer: "Retirer de mon historique",
    /** Statut après l'effacement (`docs/copy/confirmation-retirer-s24.md`, clôture du 13/11 : un seul texte). */
    retire: "Question retirée de ton historique.",
  },
  /**
   * Confirmation avant « Retirer de mon historique » (décision de Thomas du 13/11 ; reco A de
   * `docs/copy/confirmation-retirer-s24.md`, GO à 10 chez elon et le reviewer).
   */
  confirmationRetrait: {
    question: "Retirer cette question de ton historique ? Les réponses de l'équipe partent avec, c'est définitif.",
    retirer: "Retirer",
    annuler: "Annuler",
  },
  lectureSeule: {
    profil: "Mon profil",
    adresse: { avant: "Un problème de paiement ou d'accès ? Écris à ", lien: CONTACT, apres: "." },
  },
  erreurs: {
    vide: QUESTION_EQUIPE_UI.erreurs.vide,
    tropLong: QUESTION_EQUIPE_UI.erreurs.tropLong,
    envoi: QUESTION_EQUIPE_UI.erreurs.envoi,
    trop: QUESTION_EQUIPE_UI.erreurs.trop,
    tropCourt: QUESTION_EQUIPE_UI.erreurs.tropCourt,
    session: { ...QUESTION_EQUIPE_UI.erreurs.session, href: "/login?callbackUrl=/mon-espace/questions" },
    nonPremium: QUESTION_EQUIPE_UI.erreurs.nonPremium,
  },
} as const;

/**
 * E-mail de réponse de l'équipe (architecture 2.6 : « l'e-mail de réponse habituel », signé « L'Équipe
 * Deviens Marrant »). Texte VALIDÉ par Thomas le 13/11 (`docs/founder-preferences.md`, ligne D7) : objet
 * « L'équipe t'a répondu », réponse telle qu'écrite, signature, ligne « Ta question et cette réponse sont
 * aussi dans ton espace : {lien} ». Il ne part qu'à l'ouverture de l'espace : `repondre`
 * (`lib/espace/questions-equipe.ts`) exige AUSSI `ESPACE_CLIENT_PUBLIE`, et l'outil de l'équipe répond 404
 * tant que l'interrupteur est fermé (test `cloche-s24.test.ts`).
 */
export const EMAIL_REPONSE_VALIDE: boolean = true;

export const EMAIL_REPONSE_BROUILLON = {
  statut: "VALIDÉ PAR THOMAS (13/11)",
  /** Objet : libellé validé de la cloche (ligne 11), repris tel quel. */
  objet: "L'équipe t'a répondu",
  corps: (reponse: string, lien: string) =>
    [reponse, "", "L'Équipe Deviens Marrant", "", `Ta question et cette réponse sont aussi dans ton espace : ${lien}`].join("\n"),
} as const;

/** Notification INTERNE à l'équipe (boîte alex@, jamais lue par l'abonné) : objet sans donnée de l'abonné. */
export const NOTIFICATION_EQUIPE = {
  objet: (type: string, quand: string) => `Mes questions · ${type} · ${quand} (Paris)`,
  corps: (message: string, outil: string) =>
    [message, "", `Message déposé dans « Mes questions ». Réponds depuis l'outil : ${outil}`, "Une réponse faite par e-mail doit y être recopiée, avec la question."].join("\n"),
} as const;
