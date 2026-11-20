import { useSyncExternalStore } from "react";

/**
 * s26 parcours, tour 7 (relecture design v4, point 14 : « Reprendre » en tête et « Continuer ce parcours » sur la même
 * carte plus bas) : slug du parcours que la carte « En cours » de /parcours fait reprendre (`/api/espace/caps`, étape en
 * cours), partagé avec la liste des cartes (`parcours-content.tsx`), qui retire le bouton de cette carte. Deux composants
 * frères de la page, sans contexte commun : petit magasin de module, `null` tant que rien n'est lu (bouton gardé).
 */
let slugEnCours: string | null = null;
const abonnes = new Set<() => void>();

export function noterParcoursEnCours(slug: string | null): void {
  if (slug === slugEnCours) return;
  slugEnCours = slug;
  for (const f of abonnes) f();
}

function abonner(f: () => void): () => void {
  abonnes.add(f);
  return () => {
    abonnes.delete(f);
  };
}

const lire = () => slugEnCours;
const lireServeur = () => null;

/** Slug du parcours repris par la carte « En cours », ou `null`. */
export function useParcoursEnCours(): string | null {
  return useSyncExternalStore(abonner, lire, lireServeur);
}
