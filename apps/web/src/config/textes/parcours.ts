/**
 * Textes visibles des parcours d'apprentissage (audit s17, lot B).
 * Tutoiement, sans tiret cadratin. Textes finalisés en s17 d'après les étalons
 * validés par Thomas : ne rien y écrire de pédagogique (D5), seulement l'interface.
 */
import { OFFRE_NOM } from "@/config/textes/offre";

// VALIDÉ s17 (étalon 3.1 a)
/** Badge d'une étape 2+ vue par un non-abonné (D1 : aperçu ouvrable, pas d'ordre imposé). */
export const ETAPE_APERCU_LIBELLE = `Fait partie de ${OFFRE_NOM}`;

// VALIDÉ s17 (étalon 3.1 b, « mixte »)
/** Intro au-dessus de la liste des étapes, pour un non-abonné. */
export const APERCU_INTRO = "La première étape est gratuite. Pour les suivantes, tu vois ici ce qu'elles contiennent.";

// VALIDÉ s17 (étalon 3.1 c, A ; bouton 3.1 d = VALIDATION_ETAPE.bouton, validé s16)
/** Bas de l'aperçu d'une étape 2+, au-dessus du bouton. */
export const APERCU_BAS = `Le conseil, les vannes, les vidéos et le quiz de cette étape font partie de ${OFFRE_NOM}.`;

// s17, aligné sur les étalons
/** En-tête d'une étape encore verrouillée pour un abonné (ordre conseillé). */
export function etapeOrdreTexte(etapePrecedente: number): string {
  return `Termine l'étape ${etapePrecedente} pour débloquer`;
}

// s17, aligné sur les étalons (« offerte » : formule validée s15/s16 dans le paywall et /abonnement)
/** Barre de progression remplacée pour un non-abonné (QA-13). */
export function progressionVisiteurTexte(totalEtapes: number): string {
  return totalEtapes > 2
    ? `Étape 1 offerte, étapes 2 à ${totalEtapes} avec ${OFFRE_NOM}`
    : `Étape 1 offerte, étape 2 avec ${OFFRE_NOM}`;
}

// s17, aligné sur les étalons (« Durée estimée » sonnait fiche de cours ; le rythme « 15 à 20 min/semaine » ne change pas)
/**
 * Durée d'une étape, tirée du rythme du parcours (« 15 min/semaine »). Elle vaut
 * hors vidéos (facultatives, lot D s17) : précisé quand l'étape en contient.
 */
export function dureeEtapeTexte(tempsParSemaine: string, avecVideos = false): string {
  const duree = `Environ ${tempsParSemaine.replace(/\s*\/\s*semaine$/, "")}`;
  // PROVISOIRE s17, étalon à valider (lot D)
  return avecVideos ? `${duree}, hors vidéos` : duree;
}

/** Numéro d'étape affiché (liste du programme, llms-full) : « Étape N », jamais « Semaine N » (COP-10 b). */
export function etapeLibelle(numero: number): string {
  return `Étape ${numero}`;
}

// PROVISOIRE s17, étalon à valider (lot D)
/** Bloc vidéos d'une étape : facultatif, la promesse « 15 à 20 min/semaine » vaut sans les vidéos. */
export const VIDEOS_ETAPE = {
  titre: "Pour aller plus loin, facultatif",
} as const;

// VALIDÉ s17 (étalon 3.2 B)
/**
 * Ligne de résultat du quiz pour un non-abonné (plus de « Tu peux valider
 * l'étape », D1, QA-03). La ligne suivante reste « Valider l'étape fait partie
 * de Premium. » (bloc existant, juste en dessous).
 */
export function quizFinVisiteur(score: number, total: number): string {
  return score === total ? "Sans faute." : `${score} sur ${total}. Les explications sont là pour ça.`;
}

// s17, validé (étalon 2, règles du format : « Pas tout à fait » plutôt que « Faux », jamais de reproche)
/** Correction du quiz, en texte et pas seulement en couleur (F17, WCAG 1.4.1). */
export const QUIZ_CORRECTION = {
  juste: "Bonne réponse",
  faux: "Pas tout à fait",
  bonneReponse: (reponse: string) => `La bonne réponse : ${reponse}`,
} as const;

// s17 lot E (réserve B2) : les explications validées citent les réponses par lettre (« La A : … »)
/** Lettre affichée devant la réponse n° index (0 → A). */
export const quizLettre = (index: number): string => String.fromCharCode(65 + index);
/** Lecture vocale de la lettre, avant le texte de la réponse. */
export const QUIZ_LETTRE_VOCALE = (lettre: string) => `Réponse ${lettre} : `;

// s17, aligné sur les étalons (XP et bonus intouchables)
/** Gain d'XP (A2) : « Parcours terminé ! » seulement quand le serveur le dit. */
export const XP_GAIN = {
  etape: (xp: number) => `+${xp} XP gagnés !`,
  fin: (xp: number, bonus: number) =>
    `+${xp} XP gagnés, dont ${bonus} de bonus de fin. Parcours terminé !`,
} as const;

// s17, aligné sur les étalons
/** Total affiché sous la barre : étapes + bonus de fin (QA-07). */
export function totalXpTexte(total: number, bonus: number): string {
  return `${total} XP au total, dont ${bonus} de bonus à la dernière étape`;
}

// VALIDÉ s17 (étalon 3.3 A)
/** Rythme doux (D2) : rien n'est bloqué. `date` : « jeudi 15 octobre ». */
export function prochaineEtapeTexte(date: string): string {
  return `Prochaine étape conseillée le ${date}. Tu peux y aller dès maintenant si tu veux.`;
}

// VALIDÉ s17 (étalon 3.3 A, date passée ou aujourd'hui)
export const PROCHAINE_ETAPE_DISPONIBLE = "La prochaine étape t'attend.";

// s17, aligné sur les étalons (3.7 A : rappel sur demande, jour choisi par la personne)
/** Rappel e-mail sur demande (D7) : réglé au profil (lot C, avis @legal), ici un lien discret. */
export const RAPPEL_LIEN = {
  texte: "Envie d'un rappel par e-mail le jour de ton choix ?",
  lien: "Règle-le dans ton profil",
} as const;

// VALIDÉ s17 (étalon 3.5 A)
/** Retour sur l'exercice (PM-06), événement `etape-retour`. Facultatif. */
export const RETOUR_EXERCICE = {
  question: "Alors, ce défi ?",
  options: [
    { resultat: "pas-essaye", label: "Pas encore essayé", reponse: "Pas de souci, le défi t'attend quand tu veux." },
    {
      resultat: "essaye-bof",
      label: "Essayé, bof",
      reponse: "Ça arrive, et c'est utile à savoir. Relis l'exemple et retente sur une autre situation.",
    },
    {
      resultat: "essaye-ca-a-marche",
      label: "Essayé, ça a marché",
      reponse: "Bien joué. Garde cette phrase, tu viens de te fabriquer un réflexe.",
    },
  ],
} as const;

// s17, aligné sur les étalons
/** Contenu abonné qui ne se charge pas (FS-09, UX-11). */
export const CHARGEMENT_ETAPE = {
  enCours: "Chargement du contenu de l'étape…",
  echec: "Le contenu de l'étape n'a pas voulu se charger.",
  reessayer: "Réessayer",
} as const;

// s17, aligné sur les étalons (ligne de format « 5 vannes » : étalon 1)
/** Vannes de l'étape (D4) et liens vers les fiches (SEO-05). */
export const VANNES_ETAPE = {
  titre: "Vannes à pratiquer",
  voirFiche: "Voir la fiche",
  apercuVisiteur: (n: number) => `${n} vannes choisies pour cette étape t'attendent avec ${OFFRE_NOM}.`,
} as const;

// s17, aligné sur les étalons
export const LIENS_FICHES = {
  conseil: "Lire la fiche du conseil",
  video: "Voir la fiche de la vidéo",
} as const;

// s17, aligné sur les étalons (H2 de la page : ne pas changer, SEO)
/** Sous-titres H2 de la page d'un parcours (SEO-05). */
export const TITRES_SECTIONS = {
  pourQui: "Pour qui ?",
  programme: "Le programme",
} as const;

// VALIDÉ s17 (étalon 3.6 A, phrase maison en sous-titre) ; s17, validé (étalon 3.6 : bouton de suite, phrase du carnet)
/** Bilan de fin (A2, UX-06) : affiché quand le serveur confirme la fin. */
export const FIN_PARCOURS = {
  titre: (titreParcours: string) => `${titreParcours} terminé`,
  sousTitre: "Le plus dur, maintenant, c'est de ne pas le raconter à tout le monde.",
  xp: (etapes: number, xp: number) => `Tu as fait les ${etapes} étapes et gagné ${xp} XP, bonus de fin compris.`,
  acquis: "Ce que tu sais faire maintenant :",
  exercices: (essayes: number, reussis: number) =>
    `${essayes} ${essayes > 1 ? "défis essayés" : "défi essayé"}, dont ${reussis} qui ${reussis > 1 ? "ont" : "a"} marché.`,
  suite: (nom: string) => `Passer au parcours ${nom}`,
  carnetAvant: "Pour continuer à t'entraîner, le carnet du mois te donne de nouvelles fiches : ",
  carnet: "ouvrir le carnet",
} as const;

// « termine » et « revoir » : s17, aligné sur les étalons (3.4 : jamais « Reprendre » sur un parcours fini) ; reprise : VALIDÉ s17 (étalon 3.4 A)
/** Liste /parcours (UX-11) : état terminé et reprise pour l'abonné. */
export const LISTE_PARCOURS = {
  termine: "Terminé",
  revoir: "Revoir ce parcours",
  reprendre: "Reprendre ton parcours",
  repriseLigne: (titre: string, etape: number, total: number, titreEtape: string | null) =>
    `${titre}, étape ${etape} sur ${total}${titreEtape ? ` : ${titreEtape}` : ""}`,
} as const;

// s17, aligné sur les étalons
/** Pages d'état des parcours (FS-13, QA-11). */
export const PAGES_ETAT = {
  chargement: "Chargement du parcours…",
  introuvableTitre: "Ce parcours n'existe pas, ou plus.",
  introuvableTexte: "Les parcours disponibles t'attendent juste ici.",
  voirParcours: "Voir les parcours",
  erreurListeTitre: "Les parcours ont raté leur entrée en scène",
  erreurTexte: "Le souci vient de chez nous, pas de toi. Réessaie dans un instant.",
} as const;
