/**
 * s26 bibliothèque liste et détail (modèle : `docs/ux/liste-detail-quoi-repondre-s26.md`, pilote de Quoi répondre) :
 * la liste légère de la Bibliothèque, partagée par le layout (serveur) et la colonne de liste (navigateur). Module sans
 * dépendance (ni schéma zod, ni base) : importable côté client. Pas de filtre : les techniques sont rangées par famille.
 */

/** Familles de techniques, dans l'ordre de la liste (libellés : `TEXTES_BIBLIOTHEQUE.prefixes`). */
export const FAMILLES_BIBLIOTHEQUE = ["construction", "vocabulaire", "formule", "ecouter"] as const;
export type FamilleBibliotheque = (typeof FAMILLES_BIBLIOTHEQUE)[number];

/** Types de fiche servis à `/mon-espace/bibliotheque/[id]` (le coin « Humour noir » garde son adresse et son seuil). */
export const TYPES_BIBLIOTHEQUE: readonly string[] = FAMILLES_BIBLIOTHEQUE;

export const ADRESSE_LISTE_BIBLIOTHEQUE = "/mon-espace/bibliotheque";

/** Adresse d'une technique dans la rubrique. */
export const hrefFicheBibliotheque = (id: string) => `${ADRESSE_LISTE_BIBLIOTHEQUE}/${id}`;

/** Une ligne de la liste : technique (ouverte dans le panneau) ou bonus de cap (sa propre porte, `/mon-espace/bonus/[id]`). */
export interface LigneBibliotheque {
  id: string;
  titre: string;
  href: string;
  minutes: number;
  famille: FamilleBibliotheque;
  fait: boolean;
  /** « Bonus du cap N · {nom} » (bonus ouverts seulement). */
  marque?: string;
}

/** Vrai pour l'adresse d'une technique (`/mon-espace/bibliotheque/<id>`, sans query ni barre finale). */
export function estFicheBibliotheque(chemin: string | null | undefined): boolean {
  if (!chemin) return false;
  return /^\/mon-espace\/bibliotheque\/[^/]+\/?$/.test(chemin.split(/[?#]/)[0]);
}

/** Identifiant d'une adresse `/mon-espace/bibliotheque/<id>` (décodé). */
export function idDeCheminBibliotheque(chemin: string | null): string {
  const segment = (chemin ?? "").split(/[?#]/)[0].replace(/\/$/, "").split("/").pop() ?? "";
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/** Clés `sessionStorage` : défilement de la colonne (dès 1024) et de la page liste (< 1024), retour mobile. */
export const CLES_BIBLIOTHEQUE = {
  liste: "bib:liste",
  page: "bib:page",
  depuisListe: "bib:depuis-liste",
  ficheQuittee: "bib:fiche-quittee",
} as const;
