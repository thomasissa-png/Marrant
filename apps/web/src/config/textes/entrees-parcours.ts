/**
 * Textes des entrées vers les parcours (audit parcours d'apprentissage s17, lot C).
 *
 * Règle P0 du projet : tout texte client se calibre avec Thomas (étalons).
 * Textes finalisés en s17 d'après les étalons validés
 * (docs/copy/etalons-parcours-apprentissage-s17.md) : tutoiement, sans tiret
 * cadratin, « première étape gratuite » jamais « cours gratuit ».
 */
import type { ParcoursSlug } from "@/lib/entrees-parcours";
import { PARCOURS_NOMS } from "@/lib/entrees-parcours";
import { LISTE_PARCOURS } from "@/config/textes/parcours";
import { STORYTELLING_PUBLIE } from "@/config/parcours-publication";

// Concision v5 : le libellé de l'étape 1 gratuite est `GRATUIT_P` (`libelleGratuitParcours`,
// cta-articles-accueil.ts), l'ancien libellé « Lire la première étape… » a disparu.

// s17, validé (étalon 3.4 A : titre « Reprendre ton parcours », ligne « {parcours}, étape N sur M : {titre de l'étape} ») ; bouton : aligné sur les étalons
/** Bloc « Reprendre ton parcours » (accueil abonné, profil). Ligne : même format que la liste /parcours. */
export const REPRENDRE = {
  titre: "Reprendre ton parcours",
  ligne: LISTE_PARCOURS.repriseLigne,
  bouton: (etape: number) => `Reprendre l’étape ${etape}`,
} as const;

// s17, validé (étalon 3.9 A, lien de fin de fiche) ; phrases par fiche : aligné sur les étalons
/** Fiches vannes, conseils, vidéos : le parcours qui les utilise (SEO-06). */
export const FICHE_PARCOURS = {
  titre: "Dans un parcours",
  vanne: (etape: number, slug: ParcoursSlug) =>
    `Cette vanne fait partie de l’étape ${etape} du parcours ${PARCOURS_NOMS[slug]}.`,
  conseil: (etape: number, slug: ParcoursSlug) =>
    `Ce conseil est l’étape ${etape} du parcours ${PARCOURS_NOMS[slug]}.`,
  video: (etape: number, slug: ParcoursSlug) =>
    `Cette vidéo est travaillée dans l’étape ${etape} du parcours ${PARCOURS_NOMS[slug]}.`,
} as const;

// s17, aligné sur les étalons (raisons de profil) ; bouton : validé (étalon 3.9 A)
/** Quiz « Quel type d'humour es-tu ? » : parcours conseillé selon le profil (QA-13). */
export const QUIZ_HUMOUR_PARCOURS = {
  intro: "Ton point de départ :",
  titre: (slug: ParcoursSlug) => `Parcours ${PARCOURS_NOMS[slug]}`,
  // Concision v5 (textes-v5-b §4), mot pour mot. STORYTELLER : version selon la publication de /parcours/storytelling.
  raison: {
    OBSERVATEUR: "Tu vois ce que les autres ne remarquent pas : ce parcours part de là.",
    STORYTELLER: STORYTELLING_PUBLIE
      ? "Tu tiens une table avec tes histoires : ce parcours t’apprend à couper ce qui traîne."
      : "Tu tiens une table avec une histoire : ce parcours t’apprend à la raconter jusqu’au bout.",
    ABSURDE: "Tes idées surprennent : ici, tu apprends à les placer au bon moment.",
    PUNCHLINEUR: "Tu vises le mot juste : ce parcours travaille le rythme et les silences.",
    TAQUIN: "Tu renvoies chaque balle : ce parcours t’apprend à viser sans blesser.",
  },
} as const;

// s17, validé (étalon 3.8 A : règle de la série, chiffres de la FAQ intacts)
/**
 * FAQ (PM-12, UX-04) : la série et l'XP telles qu'elles fonctionnent depuis
 * s17 (série = jours où tu pratiques ; rythme conseillé : une étape par semaine).
 * Les chiffres de la FAQ (« 8 semaines », « 50 XP par semaine ») restent intacts.
 */
export const FAQ_SERIE_XP =
  "Avec Premium, tes XP montent à chaque étape validée et ta série compte les jours où tu pratiques (une étape validée, un quiz d’étape terminé). Le rythme conseillé : une étape par semaine, de quoi tenir sur la durée.";

// s17, aligné sur les étalons
/** FAQ « Combien de temps » : dernière phrase, deux rythmes dits clairement (UX-04). */
export const FAQ_REGULARITE =
  "L’important, c’est la régularité : dans un parcours, une étape par semaine ; à côté, le contenu du jour te prend 5 minutes.";

// Texte juridique du rappel (legal C1) et version : source unique côté lot A,
// `config/textes/parcours-emails.ts` (RAPPEL_PARCOURS_CONSENTEMENT).

// s17, validé (étalon 3.7 A : « Jour du rappel », « C'est noté ») ; titre et erreur : aligné sur les étalons
export const RAPPEL_PARCOURS_UI = {
  titre: "Rappel de parcours",
  jourLabel: "Jour du rappel",
  enregistre: "C’est noté.",
  erreur: "On n’a pas pu enregistrer ton choix. Réessaie dans un instant.",
  // PROVISOIRE s17 lot E, étalon à valider (étalon 3.7 : aucun jour présélectionné)
  jourVide: "Choisis un jour",
  choisirJour: "Choisis d’abord le jour du rappel, il s’activera aussitôt.",
} as const;
