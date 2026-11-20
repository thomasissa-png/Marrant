/**
 * s26 carnet liste et détail (`docs/ux/carnet-audit-s26.md` §3) : données légères de la liste et adresses, sans
 * dépendance serveur (lu par la colonne de liste, composant client). N'importe JAMAIS `lib/carnet` (serveur seul).
 * Liste : `/carnet` (mois courant) et `/carnet/<mois>` ; fiche : `/carnet/<mois>/<n>` (n = numéro, rang dans le
 * fichier du mois). Filtre : `?contexte=<valeur>` (champ `contexte` des fiches), reporté sur chaque lien.
 */

/** Une ligne de la liste : numéro, titre et contexte (jamais le contenu de la fiche). */
export interface LigneCarnet {
  id: string;
  numero: number;
  titre: string;
  contexte: string;
}

/** Un carnet publié, réduit à ce que la liste et l'en-tête montrent. */
export interface CarnetListe {
  mois: string;
  /** « novembre 2026 » (`formatCarnetMonth`). */
  libelle: string;
  titre: string;
  intro: string;
  lignes: LigneCarnet[];
}

/** Valeurs de `contexte` dans l'ordre de première apparition, avec leur effectif. */
export function contextesDe(lignes: readonly LigneCarnet[]): { cle: string; nombre: number }[] {
  const comptes = new Map<string, number>();
  for (const l of lignes) comptes.set(l.contexte, (comptes.get(l.contexte) ?? 0) + 1);
  return Array.from(comptes, ([cle, nombre]) => ({ cle, nombre }));
}

/** Filtre lu dans la query : gardé seulement s'il désigne un contexte du carnet. */
export function contexteValide(brut: string | string[] | null | undefined, lignes: readonly LigneCarnet[]): string | null {
  const v = Array.isArray(brut) ? brut[0] : brut;
  return v && lignes.some((l) => l.contexte === v) ? v : null;
}

export function filtrerLignes(lignes: readonly LigneCarnet[], contexte: string | null): LigneCarnet[] {
  return contexte ? lignes.filter((l) => l.contexte === contexte) : [...lignes];
}

const query = (contexte: string | null) => (contexte ? `?contexte=${encodeURIComponent(contexte)}` : "");

/** Adresse de la liste d'un mois : `/carnet` pour le mois courant (adresse d'aujourd'hui), sinon `/carnet/<mois>`. */
export function hrefListeCarnet(mois: string, courant: boolean, contexte: string | null = null): string {
  return `${courant ? "/carnet" : `/carnet/${mois}`}${query(contexte)}`;
}

export function hrefFicheCarnet(mois: string, numero: number, contexte: string | null = null): string {
  return `/carnet/${mois}/${numero}${query(contexte)}`;
}

/** Numéro d'une adresse de fiche (`[n]`) : entier de 1 à `total`, sinon `null` (404). */
export function numeroDe(brut: string, total: number): number | null {
  if (!/^[1-9]\d{0,2}$/.test(brut)) return null;
  const n = Number(brut);
  return n <= total ? n : null;
}

/** Identifiant du titre de la fiche ouverte (focus à l'ouverture depuis la liste ou « Situation suivante »). */
export const ID_TITRE_FICHE_CARNET = "carnet-fiche-titre";

/** Ligne suivante dans l'ordre de la liste filtrée, sans reprise au début (`null` après la dernière). */
export function suivanteDe(ordre: readonly LigneCarnet[], numero: number): LigneCarnet | null {
  const i = ordre.findIndex((l) => l.numero === numero);
  return i >= 0 ? (ordre[i + 1] ?? null) : null;
}
