/**
 * « Quoi répondre » (s24, lot D6 ; architecture v20 3.3, 3.8, 6.2) : les situations et les fiches « Quand
 * ça tombe à plat » (rangées sous « Rattraper un faux pas »), filtrées par « Où et avec qui ? » et « Pour
 * quoi faire ? ». Filtres lus dans l'adresse (`?ou=`, `?pour=`), validés contre les listes fermées du
 * schéma : une valeur inconnue est ignorée (aucun filtre), jamais une erreur.
 */
import { POUR_QUOI_FAIRE, UNIVERS } from "@/lib/espace/fiches-schema";
import type { FicheDeType } from "@/lib/espace/fiches";

export type Univers = (typeof UNIVERS)[number];
export type PourQuoiFaire = (typeof POUR_QUOI_FAIRE)[number];
export type FicheQuoiRepondre = FicheDeType<"situation"> | FicheDeType<"a-plat">;

export interface FiltresSituations {
  ou: Univers | null;
  pour: PourQuoiFaire | null;
}

const premier = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export function lireFiltres(params: Record<string, string | string[] | undefined>): FiltresSituations {
  const ou = premier(params.ou);
  const pour = premier(params.pour);
  return {
    ou: (UNIVERS as readonly string[]).includes(ou ?? "") ? (ou as Univers) : null,
    pour: (POUR_QUOI_FAIRE as readonly string[]).includes(pour ?? "") ? (pour as PourQuoiFaire) : null,
  };
}

/** « Pour quoi faire ? » d'une fiche : une fiche « Quand ça tombe à plat » sert toujours à rattraper un faux pas (6.2). */
export function butsDeFiche(f: FicheQuoiRepondre): readonly PourQuoiFaire[] {
  if (f.type === "a-plat") return ["rattraper-faux-pas"];
  return f.pourQuoiFaire ?? [];
}

export function filtrerSituations(fiches: readonly FicheQuoiRepondre[], filtres: FiltresSituations): FicheQuoiRepondre[] {
  return fiches.filter((f) => (!filtres.ou || f.univers === filtres.ou) && (!filtres.pour || butsDeFiche(f).includes(filtres.pour)));
}

/** Adresse d'un filtre : un clic sur le filtre choisi le retire (bascule), l'autre filtre est gardé. */
export function hrefFiltre(base: string, filtres: FiltresSituations, cle: keyof FiltresSituations, valeur: string): string {
  const suivant = { ...filtres, [cle]: filtres[cle] === valeur ? null : valeur };
  const q = new URLSearchParams();
  if (suivant.ou) q.set("ou", suivant.ou);
  if (suivant.pour) q.set("pour", suivant.pour);
  const s = q.toString();
  return s ? `${base}?${s}` : base;
}
