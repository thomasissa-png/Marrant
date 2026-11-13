/**
 * Les trois retours fermés d'un geste ou d'une mission (architecture v20 2.4 : les valeurs déjà utilisées
 * pour les exercices). Module sans dépendance : importable côté navigateur.
 */
export const RETOURS_GESTE = ["pas-essaye", "essaye-bof", "essaye-ca-a-marche"] as const;
export type RetourGeste = (typeof RETOURS_GESTE)[number];
