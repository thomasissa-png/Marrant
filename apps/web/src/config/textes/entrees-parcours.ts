/**
 * Textes des entrées vers les parcours (audit parcours d'apprentissage s17, lot C).
 *
 * Règle P0 du projet : tout nouveau texte client se calibre avec Thomas
 * (étalons). Sauf mention « VALIDÉ » ou « TEXTE JURIDIQUE », ces versions sont
 * provisoires, simples, tutoyées, sans tiret cadratin.
 */
import type { ParcoursSlug } from "@/lib/entrees-parcours";
import { PARCOURS_NOMS } from "@/lib/entrees-parcours";

// PROVISOIRE s17, étalon à valider
/** Accueil visiteur : lien secondaire sous le bouton principal (UX-08). */
export const ACCUEIL_LIEN_ETAPE_1 = "Lire gratuitement l'étape 1";

// PROVISOIRE s17, étalon à valider
/** Bloc « Reprendre ton parcours » (accueil abonné, profil). */
export const REPRENDRE = {
  titre: "Reprendre ton parcours",
  ligne: (parcoursTitre: string, etape: number, total: number) =>
    `${parcoursTitre} : étape ${etape} sur ${total}.`,
  bouton: (etape: number) => `Reprendre l'étape ${etape}`,
} as const;

// PROVISOIRE s17, étalon à valider
/** Fiches vannes, conseils, vidéos : le parcours qui les utilise (SEO-06). */
export const FICHE_PARCOURS = {
  titre: "Dans un parcours",
  vanne: (etape: number, slug: ParcoursSlug) =>
    `Cette vanne fait partie de l'étape ${etape} du parcours ${PARCOURS_NOMS[slug]}.`,
  conseil: (etape: number, slug: ParcoursSlug) =>
    `Ce conseil est l'étape ${etape} du parcours ${PARCOURS_NOMS[slug]}.`,
  video: (etape: number, slug: ParcoursSlug) =>
    `Cette vidéo est travaillée dans l'étape ${etape} du parcours ${PARCOURS_NOMS[slug]}.`,
  lien: (slug: ParcoursSlug) => `Lire gratuitement l'étape 1 du parcours ${PARCOURS_NOMS[slug]}`,
} as const;

// PROVISOIRE s17, étalon à valider
/** Quiz « Quel type d'humour es-tu ? » : parcours conseillé selon le profil (QA-13). */
export const QUIZ_HUMOUR_PARCOURS = {
  intro: "Ton point de départ :",
  titre: (slug: ParcoursSlug) => `Parcours ${PARCOURS_NOMS[slug]}`,
  raison: {
    OBSERVATEUR: "Tu vois ce que les autres ne remarquent pas : ce parcours commence justement par regarder ton quotidien avec un œil comique.",
    STORYTELLER: "Tu sais tenir une table avec une histoire : ce parcours t'apprend à la raconter au bon moment et jusqu'au bout.",
    ABSURDE: "Tes idées surprennent : ce parcours t'aide à les placer au bon moment, en quelques mots.",
    PUNCHLINEUR: "Tu vises le mot juste : ce parcours travaille le rythme, les silences et la réplique qui tombe pile.",
    TAQUIN: "Tu renvoies chaque balle : ce parcours t'apprend à retourner une pique avec le sourire.",
  },
  bouton: "Lire gratuitement l'étape 1",
} as const;

// PROVISOIRE s17, étalon à valider
/** /abonnement : voir ce qu'on achète avant de payer (QA-13). */
export const ABONNEMENT_ETAPE_1 = {
  titre: "Pas encore sûr ? Lis d'abord une étape",
  texte: "La première étape de chaque parcours est en lecture libre, sans compte.",
  lien: (slug: ParcoursSlug) => `Étape 1 du parcours ${PARCOURS_NOMS[slug]}`,
} as const;

// PROVISOIRE s17, étalon à valider
/**
 * FAQ (PM-12, UX-04) : la série et l'XP telles qu'elles fonctionnent depuis
 * s17 (série = jours où tu pratiques ; rythme conseillé : une étape par semaine).
 * Les chiffres de la FAQ (« 8 semaines », « 50 XP par semaine ») restent intacts.
 */
export const FAQ_SERIE_XP =
  "Avec Premium, tes XP montent à chaque étape validée et ta série compte les jours où tu pratiques (une étape validée, un quiz d'étape terminé). Le rythme conseillé : une étape par semaine, de quoi tenir sur la durée.";

// PROVISOIRE s17, étalon à valider
/** FAQ « Combien de temps » : dernière phrase, deux rythmes dits clairement (UX-04). */
export const FAQ_REGULARITE =
  "L'important, c'est la régularité : dans un parcours, une étape par semaine ; à côté, le contenu du jour te prend 5 minutes.";

// Texte juridique du rappel (legal C1) et version : source unique côté lot A,
// `config/textes/parcours-emails.ts` (RAPPEL_PARCOURS_CONSENTEMENT).

// PROVISOIRE s17, étalon à valider
export const RAPPEL_PARCOURS_UI = {
  titre: "Rappel de parcours",
  jourLabel: "Jour du rappel",
  enregistre: "C'est noté.",
  erreur: "On n'a pas pu enregistrer ton choix. Réessaie dans un instant.",
} as const;
