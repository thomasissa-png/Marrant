/**
 * Types du contenu de la cloche (s24, lot D8), sans dépendance serveur : importables par le composant du
 * navigateur (`components/espace/cloche.tsx`) et par `lib/espace/cloche.ts`.
 */
import type { TypeQuestion } from "@/lib/espace/questions-types";

export type GenreNouveaute = "carnet" | "situations" | "bibliotheque";

export interface LigneReponse {
  id: string;
  type: TypeQuestion;
  reponduLe: string;
  href: string;
}
export interface LigneNouveaute {
  genre: GenreNouveaute;
  /** Jour de Paris (AAAA-MM-JJ). */
  le: string;
  href: string;
}
export interface LigneLettre {
  numero: string;
  titre: string;
  href: string;
}
export interface ContenuCloche {
  nonLues: number;
  reponses: LigneReponse[];
  nouveautes: LigneNouveaute[];
  lettre: LigneLettre | null;
}
