/**
 * Fondus et placement de la bande des rubriques (navigation v6, `docs/ux/navigation-v6-menu-rubriques.md` §3,
 * maquette D, relecture design s25 variante D tour 4 et consigne du coordinateur du 15/11). Calcul pur, sans DOM :
 * les boîtes des rubriques sont mesurées par la bande, relatives au début du contenu défilant.
 *
 * Fondus : 16 px au moins à gauche si la bande est défilée, 32 px au moins à droite s'il reste du contenu ; chacun
 * s'allonge jusqu'au libellé coupé par le bord (48 et 64 px au plus) : la partie visible d'un libellé coupé est
 * toujours sous le fondu, jamais « à moitié lisible » en clair.
 * Placement d'arrivée, règles dures : (1) la rubrique active est entière et hors des fondus ; (2) aucun libellé coupé
 * au-delà de ce que couvre un fondu ; (3) indice de suite : tant qu'il reste du contenu à droite, un libellé entamé
 * (6 px de lettres au moins) sous le fondu droit, jamais un vide après « La lettre » avec Favoris et Carnet cachés.
 * Aux bornes (rubrique active en tête ou en fin de bande), la règle 2 peut être impossible avec les largeurs réelles :
 * la rubrique active reste entière, le fondu le plus long couvre ce qu'il peut (cas de la maquette D, « Quoi répondr »).
 * Préférences : pas de défilement si la rubrique active tient au début (Aujourd'hui collé au bord gauche) ; sinon la
 * rubrique active au plus près du centre ; un libellé entamé sous le fondu gauche quand la bande est défilée.
 */
export const FONDU_GAUCHE = 16;
export const FONDU_DROIT = 32;
export const FONDU_GAUCHE_MAX = 48;
export const FONDU_DROIT_MAX = 64;
/** Marge interne d'une rubrique (`px-3`) : le libellé commence 12 px après le bord de sa boîte. */
export const MARGE_LIBELLE = 12;
/** Tolérance : quelques pixels de lettre au bord d'un fondu ne font pas un libellé coupé. */
const TOLERANCE = 4;
/** Lettres visibles minimales d'un libellé entamé (indice de suite). */
const ENTAME_MIN = 6;

export interface Boite {
  gauche: number;
  largeur: number;
}

export interface Mesure {
  boites: readonly Boite[];
  /** Index de la rubrique active dans `boites`, ou -1. */
  actif: number;
  largeurVue: number;
  largeurTotale: number;
}

interface Etat {
  gauche: number;
  droit: number;
  /** Libellé coupé par le bord droit, au-delà du fondu le plus long (faute) ; idem à gauche. */
  coupeDroite: boolean;
  coupeGauche: boolean;
  /** Libellé entamé sous le fondu (indice de suite). */
  entameDroite: boolean;
  entameGauche: boolean;
}

/** Fondus à la position `t` et état des bords. */
export function fondus(boites: readonly Boite[], t: number, vue: number, total: number): Etat {
  const max = Math.max(0, total - vue);
  const e: Etat = { gauche: 0, droit: 0, coupeDroite: false, coupeGauche: false, entameDroite: true, entameGauche: true };
  if (t > 0.5) {
    e.gauche = FONDU_GAUCHE;
    e.entameGauche = false;
    const c = boites.find((b) => b.gauche - t < 0 && b.gauche + b.largeur - t > 0);
    if (c) {
      const fin = c.gauche + c.largeur - t - MARGE_LIBELLE;
      e.gauche = Math.min(FONDU_GAUCHE_MAX, Math.max(FONDU_GAUCHE, fin));
      e.coupeGauche = fin > FONDU_GAUCHE_MAX + TOLERANCE;
      e.entameGauche = fin >= ENTAME_MIN;
    }
  }
  if (t < max - 0.5) {
    e.droit = FONDU_DROIT;
    e.entameDroite = false;
    const c = boites.find((b) => b.gauche - t < vue && b.gauche + b.largeur - t > vue);
    if (c) {
      const debut = c.gauche - t + MARGE_LIBELLE;
      e.droit = Math.min(FONDU_DROIT_MAX, Math.max(FONDU_DROIT, vue - debut));
      e.coupeDroite = vue - debut > FONDU_DROIT_MAX + TOLERANCE;
      e.entameDroite = debut <= vue - ENTAME_MIN;
    }
  }
  return e;
}

/** Fautes dures d'une position `t` (0 : aucune) et absence d'indice à gauche (préférence). */
export function fautes({ boites, actif, largeurVue: vue, largeurTotale }: Mesure, t: number): { dures: number; actifEntier: boolean; sansIndiceGauche: boolean; allongement: number } {
  const e = fondus(boites, t, vue, largeurTotale);
  const a = boites[actif];
  let actifEntier = true;
  if (a) {
    const l = a.gauche - t;
    const r = l + a.largeur;
    actifEntier = !(l < -0.5 || l + MARGE_LIBELLE < e.gauche - 0.5 || r > vue + 0.5 || r - MARGE_LIBELLE > vue - e.droit + 0.5);
  }
  const dures = Number(e.coupeDroite) + Number(e.coupeGauche) + Number(!e.entameDroite) + Number(!actifEntier);
  // Allongement des fondus au-delà de 16 et 32 px : un bord net (libellé coupé court) est préféré.
  const allongement = Math.max(0, e.gauche - FONDU_GAUCHE) + Math.max(0, e.droit - FONDU_DROIT);
  return { dures, actifEntier, sansIndiceGauche: !e.entameGauche, allongement };
}

/** Défilement d'arrivée (px) : 0 si tout tient ou si l'actif tient au début, sinon la meilleure position. */
export function placementBande(m: Mesure): number {
  const max = Math.max(0, m.largeurTotale - m.largeurVue);
  if (max < 1 || m.actif < 0 || fautes(m, 0).dures === 0) return 0;
  const a = m.boites[m.actif];
  const centre = a.gauche + a.largeur / 2;
  let meilleur = 0;
  let note = Infinity;
  for (let i = 0; i <= Math.ceil(max); i++) {
    const t = Math.min(i, max);
    const f = fautes(m, t);
    const n = f.dures * 10000 + (f.sansIndiceGauche ? 50 : 0) + 3 * f.allongement + Math.abs(centre - t - m.largeurVue / 2);
    if (n < note) {
      note = n;
      meilleur = t;
    }
  }
  return meilleur;
}
