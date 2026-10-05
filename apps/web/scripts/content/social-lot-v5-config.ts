/**
 * Données figées du lot de relance v5 (s15) : `docs/social/strategie-relance-v5.md`
 * (§1 grille et stock, §2 liens, §3 calendrier, §8 cartes, §10 règles), gagnants de
 * `duels-resultat-cycle5.md` (priment sur la v5) et 9 posts validés par Thomas
 * (`validation-thomas-s15.md`). Aucun texte ici n'est inventé : chaque texte est
 * recopié de ces documents, du catalogue ou d'un article.
 */
import type { PreparedPlatform } from "./social-controls";
import { HEURE_PARIS, LI_DEPLACE as LI_DEPLACE_SOCIAL, NOEL_DES as NOEL, PAIN_IDS as PAIN, RESERVEES_NOEL as NOEL_IDS, SILENCES_SOCIAL, SOUS_HUIT as SOUS_8 } from "../../src/config/social-calendrier";

export const LOT_ID = "relance-s15";
export const APPROVED_BY_LOT = "thomas-s15";
/** Identifiant de lot libre (`--lot`) : minuscules, chiffres, tirets. */
export const LOT_ID_RE = /^[a-z0-9][a-z0-9-]{1,39}$/;
/** approvedBy d'un lot : « thomas-s15 » pour le lot historique, sinon « lot-<id> » (sert au --rollback). */
export function approvedByDuLot(lot: string): string {
  return lot === LOT_ID ? APPROVED_BY_LOT : `lot-${lot}`;
}
export const LOT_DEBUT = "2026-10-12";
export const LOT_FIN = "2027-01-03";
/**
 * J0 par réseau (v5 §1) : un post daté avant le J0 de son réseau est sauté.
 * Avancé au mar. 06/10 (Thomas, 05/10 : plan validé, on démarre sans attendre le 12/10).
 * Les jalons de mesure restent comptés depuis J0_SOCIAL (12/10, src/config/social-calendrier.ts).
 */
export const J0: Record<PreparedPlatform, string> = { TWITTER: "2026-10-06", INSTAGRAM: "2026-10-06", LINKEDIN: "2026-10-06" };

export type TypeCase = "RELAIS_LUNDI" | "RELAIS_JEUDI" | "VANNE" | "VANNE_QUIZ" | "DECRYPTAGE" | "LI_MARDI" | "LI_JEUDI";
/**
 * Grille hebdomadaire v5 (heures de Paris). Jours : 1 = lundi … 5 = vendredi.
 * Instagram à 19:30 depuis la mise à jour du 05/10 (`docs/social/horaires-sources-s15.md`).
 */
export const GRILLE_V5: Record<PreparedPlatform, { h: number; m: number; jours: Partial<Record<number, TypeCase>> }> = {
  TWITTER: { ...HEURE_PARIS.TWITTER, jours: { 1: "RELAIS_LUNDI", 2: "VANNE", 3: "VANNE_QUIZ", 4: "RELAIS_JEUDI", 5: "VANNE" } },
  INSTAGRAM: { ...HEURE_PARIS.INSTAGRAM, jours: { 1: "RELAIS_LUNDI", 2: "VANNE", 3: "DECRYPTAGE", 4: "RELAIS_JEUDI", 5: "VANNE" } },
  LINKEDIN: { ...HEURE_PARIS.LINKEDIN, jours: { 2: "LI_MARDI", 4: "LI_JEUDI" } },
};

/** Silences du calendrier (v5 §3) : 11/11 et Black Friday 27/11 (source unique : src/config/social-calendrier.ts). */
export const SILENCES = SILENCES_SOCIAL;
/** LinkedIn du jeudi 24/12 déplacé au mercredi 23/12 (v5 §3, S11). */
export const LI_DEPLACE: Record<string, string> = LI_DEPLACE_SOCIAL;

/** Réservées à Noël, connues sous 8 (source unique : src/config/social-calendrier.ts, v5 §1 et duels du cycle 5). */
export const RESERVEES_NOEL = NOEL_IDS;
export const NOEL_DES = NOEL;
export const SOUS_HUIT = SOUS_8;
/** Motif « pain » : au plus un par fenêtre de 30 jours, tous réseaux (v5 §1). */
export const PAIN_IDS = PAIN;
export const PAIN_RE = /(^|[^\p{L}])pain(?=[^\p{L}]|$)/iu;
export const FENETRE_PAIN_JOURS = 30;
export const ANTI_REPETITION_JOURS = 90;

/** Saisonnalité : une vanne de saison n'est tirée que dans sa fenêtre. */
export const SAISONS: Array<{ nom: string; re: RegExp; de: string; a: string }> = [
  { nom: "Halloween", re: /halloween|citrouille|d[ée]guis/i, de: "2026-10-19", a: "2026-10-31" },
  { nom: "Noël", re: /no[ëe]l|sapin|r[ée]veillon|b[ûu]che/i, de: "2026-12-01", a: "2026-12-31" },
  { nom: "Nouvel An", re: /nouvel an|bonne ann[ée]e|r[ée]solution|meilleurs v[œo]eux/i, de: "2026-12-26", a: "2027-01-10" },
];

/** Thème de repli d'un article (v5 §1, relais (2) : vanne du catalogue du même thème). */
export const THEME_ARTICLE: Record<string, string[]> = {
  "humour-en-colocation-desamorcer-tensions": ["OBSERVATIONNEL", "SITUATION", "SOIREES"],
  "humour-en-visio-reunion-en-ligne": ["BOULOT"],
  "chambrer-sans-blesser-entre-potes": ["SOIREES", "AUTODERISION"],
  "soiree-de-noel-entreprise-humour": ["BOULOT"],
  "repas-de-famille-questions-genantes-humour": ["PARENTS", "COUPLE"],
  "toast-drole-discours-qui-fait-rire": ["PARENTS"],
  "faire-rire-un-enfant-repas-de-fete": ["PARENTS"],
  "jeux-de-repartie-soiree-nouvel-an": ["SOIREES"],
  "etre-drole-sans-alcool-soiree": ["SOIREES"],
  "resolution-nouvelle-annee-etre-plus-drole": ["AUTODERISION"],
};
/**
 * Articles de messages à envoyer (anniversaire, vœux, refus, départ, premier message) :
 * leurs lignes se lisent dans leur contexte, jamais tirées seules hors relais.
 */
export const ARTICLES_MESSAGES = /message|voeux|refuser|mot-de-depart/;
/** Relais à destination de Marc (v5 §1) : persona MARC. */
export const ARTICLES_MARC = new Set(["premier-message-drole-appli-de-rencontre", "blagues-de-couple-drole"]);

/** Formules reprises mot pour mot de la v5 et des posts validés. */
export const FORMULES = {
  pied: "deviens-marrant.fr",
  renvoiPratique4: "Les 4 autres exemples, et comment trouver le tien :",
  quizCourt: "Et toi, tu es lequel des 5 profils ? Environ 2 minutes, sans inscription :",
  carte3: "Pourquoi ça fait rire :",
  carte4: "À toi de jouer :",
  renvoiQuizBio: "Le quiz est dans le lien de la bio.",
} as const;
