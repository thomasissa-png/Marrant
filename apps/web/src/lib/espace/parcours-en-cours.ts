import { useSyncExternalStore } from "react";

/**
 * s26 parcours, tour 7 (relecture design v4, point 14 : « Reprendre » en tête et « Continuer ce parcours » sur la même
 * carte plus bas) : slug du parcours que la carte « En cours » de /parcours fait reprendre (`/api/espace/caps`, étape en
 * cours), partagé avec la liste des cartes (`parcours-content.tsx`), qui retire le bouton de cette carte. Deux composants
 * frères de la page, sans contexte commun : petit magasin de module, `null` tant que rien n'est lu (bouton gardé).
 */
let slugEnCours: string | null = null;
/**
 * s26 parcours, tour 8 (relecture design v5, liste 1 ; UX v5 D2) : lien du « Reprendre » de la carte « En cours », repris
 * en contour dans la carte du parcours (sa case à droite de « Programme » restait vide).
 */
let lienEnCours: string | null = null;
const abonnes = new Set<() => void>();

export function noterParcoursEnCours(slug: string | null, href: string | null = null): void {
  const lien = slug ? href : null;
  if (slug === slugEnCours && lien === lienEnCours) return;
  slugEnCours = slug;
  lienEnCours = lien;
  for (const f of abonnes) f();
}

function abonner(f: () => void): () => void {
  abonnes.add(f);
  return () => {
    abonnes.delete(f);
  };
}

const lire = () => slugEnCours;
const lireLien = () => lienEnCours;
const lireServeur = () => null;

/** Slug du parcours repris par la carte « En cours », ou `null`. */
export function useParcoursEnCours(): string | null {
  return useSyncExternalStore(abonner, lire, lireServeur);
}

/** s26 parcours, tour 8 : lien du « Reprendre » de la carte « En cours » (`null` tant que rien n'est lu). */
export function useLienParcoursEnCours(): string | null {
  return useSyncExternalStore(abonner, lireLien, lireServeur);
}
