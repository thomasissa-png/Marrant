/**
 * Types et listes fermées de « Mes questions » (s24, lot D7), sans dépendance serveur : importables par
 * les composants du navigateur et par l'outil de l'équipe.
 */
import { POUR_QUOI_FAIRE, UNIVERS } from "@/lib/espace/fiches-schema";

export const TYPES_QUESTION = ["PROBLEME", "SITUATION", "QUESTION"] as const;
export type TypeQuestion = (typeof TYPES_QUESTION)[number];

/** Étiquette de scène (2.6) : listes fermées de 3.3, ou « autre » (toujours « autre » pour un problème). */
export const SCENES_OU = [...UNIVERS, "autre"] as const;
export const SCENES_BUT = [...POUR_QUOI_FAIRE, "autre"] as const;

export interface MessageListe {
  auteur: "ABONNE" | "EQUIPE";
  corps: string;
  creeLe: string;
}

export interface FilListe {
  id: string;
  type: TypeQuestion;
  statut: "EN_ATTENTE" | "REPONDU";
  creeLe: string;
  dernierMessageLe: string;
  enRetard: boolean;
  nonLu: boolean;
  messages: MessageListe[];
}

