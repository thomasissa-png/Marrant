/**
 * Règles de révision des cartes de la rafale (s24, lot D5 ; architecture v20 2.2, règle unique
 * valable pour toutes les cartes). Fonctions pures, sans base : testées en table de vérité.
 *
 * - « Oui » : la carte ne revient pas à cause de cette réponse (compte pour le seuil P3) ;
 * - « À moitié » : revient UNE fois, à J+7 [HYPOTHÈSE de l'architecture, calée à E5] ;
 * - « Rien » : revient UNE seule fois, à J+2 (sur une carte de révision, ces deux réponses ne
 *   reprogramment rien : « Oui » n'est jamais un moyen de passer plus vite, et rien ne tourne en boucle) ;
 * - choix raté sur une carte « Quel registre ? » (objectif) : J+2, puis J+7, puis J+21, quelle que
 *   soit la réponse déclarée ensuite ; la suite est suivie par `etapeRate` (0 = aucune, 1 à 3).
 * Deux règles qui tombent ensemble : la date la plus proche gagne.
 * La part des cartes réussies qui revient à J+30 ([HYPOTHÈSE] de 2.2) n'est pas appliquée : non calée.
 */
export const REPONSES_CARTE = ["OUI", "MOITIE", "RIEN"] as const;
export type ReponseCarte = (typeof REPONSES_CARTE)[number];

/** Retour unique après « Rien » et « À moitié » (2.2). */
export const DELAI_RIEN = 2;
export const DELAI_MOITIE = 7;
/** Suite d'une carte « Quel registre ? » ratée (2.2). */
export const DELAIS_RATE = [2, 7, 21] as const;

export interface Echeance {
  /** Jours avant le retour ; null = la carte ne revient pas. */
  jours: number | null;
  etapeRate: number;
}

const plusProche = (a: number | null, b: number | null): number | null => (a === null ? b : b === null ? a : Math.min(a, b));

/**
 * Échéance après « Tu avais une réponse ? ». `estRevision` : la carte avait déjà été vue.
 * `etapeRate` : position dans la suite ratée AVANT cette réponse.
 */
export function echeanceApresReponse(reponse: ReponseCarte, estRevision: boolean, etapeRate: number): Echeance {
  let jours: number | null = null;
  if (!estRevision) jours = reponse === "RIEN" ? DELAI_RIEN : reponse === "MOITIE" ? DELAI_MOITIE : null;
  let etape = etapeRate;
  // Suite ratée en cours : la carte est revenue, elle repart pour l'échéance suivante.
  if (estRevision && etape >= 1 && etape < DELAIS_RATE.length) {
    jours = plusProche(jours, DELAIS_RATE[etape]);
    etape += 1;
  }
  return { jours, etapeRate: etape };
}

/**
 * Échéance après le choix d'une carte « Quel registre ? ». `joursActuels` : échéance posée par la
 * réponse (en jours depuis maintenant). Un choix raté démarre la suite (J+2) si elle n'a pas commencé ;
 * un choix juste ne change rien.
 */
export function echeanceApresChoix(choixJuste: boolean, joursActuels: number | null, etapeRate: number): Echeance {
  if (choixJuste || etapeRate >= 1) return { jours: joursActuels, etapeRate };
  return { jours: plusProche(joursActuels, DELAIS_RATE[0]), etapeRate: 1 };
}

/** Date de retour : `maintenant` + n jours (le jour de Paris décide ensuite si elle est due). */
export function dateDansJours(maintenant: Date, jours: number | null): Date | null {
  return jours === null ? null : new Date(maintenant.getTime() + jours * 86_400_000);
}
