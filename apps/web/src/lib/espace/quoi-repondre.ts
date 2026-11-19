/**
 * « Quoi répondre » (s24, lot D6 ; architecture v20 3.3, 3.8, 6.2) : les situations et les fiches « Quand
 * ça tombe à plat » (rangées sous « Rattraper un faux pas »), filtrées par « Où et avec qui ? » et « Pour
 * quoi faire ? ». Filtres lus dans l'adresse (`?ou=`, `?pour=`), validés contre les listes fermées du
 * schéma : une valeur inconnue est ignorée (aucun filtre), jamais une erreur.
 */
import { POUR_QUOI_FAIRE, UNIVERS } from "@/lib/espace/fiches-schema";
import type { FicheDeType } from "@/lib/espace/fiches";
import type { LigneQuoiRepondre } from "@/lib/espace/quoi-repondre-liste";

export type Univers = (typeof UNIVERS)[number];
export type PourQuoiFaire = (typeof POUR_QUOI_FAIRE)[number];
export type FicheQuoiRepondre = FicheDeType<"situation"> | FicheDeType<"a-plat">;

export interface FiltresSituations {
  ou: Univers | null;
  pour: PourQuoiFaire | null;
}

const premier = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/**
 * s26 (vue abonné, `docs/ux/rubriques-premium-s26.md` §1.2) : la prochaine action, première fiche sans « Fait » dans
 * l'ordre donné (celui de la liste affichée) ; null quand tout est fait (la tuile d'action disparaît).
 */
export function premiereSansFait<F extends { id: string }>(fiches: readonly F[], faits: ReadonlySet<string>): F | null {
  return fiches.find((f) => !faits.has(f.id)) ?? null;
}

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

/**
 * s26 liste et détail : fiches dans l'ordre d'affichage de la liste (lieux dans l'ordre des filtres, puis « sans lieu »,
 * rangé sous « Rattraper un faux pas »), le même ordre pour la liste, la fiche d'office et « Situation suivante ».
 */
export function ordreParLieu<F extends FicheQuoiRepondre>(fiches: readonly F[]): F[] {
  return [...UNIVERS.flatMap((u) => fiches.filter((f) => f.univers === u)), ...fiches.filter((f) => !f.univers)];
}

/**
 * Lignes légères de la colonne de liste (titre, durée, lieu, buts, « Fait »), dans l'ordre d'affichage. Seuls les types
 * de la rubrique (situation, « à plat ») passent : une fiche du coin « Humour noir » n'y figure jamais, cookie d'entrée
 * ou non (elle reste dans la Bibliothèque, derrière son écran d'entrée).
 */
export function lignesQuoiRepondre(fiches: readonly { type: string }[], faits: ReadonlySet<string>): LigneQuoiRepondre[] {
  const rubrique = fiches.filter((f): f is FicheQuoiRepondre => f.type === "situation" || f.type === "a-plat");
  return ordreParLieu(rubrique).map((f) => ({
    id: f.id,
    titre: f.titre,
    minutes: f.dureeMinutes,
    lieu: f.univers ?? "sans-lieu",
    univers: f.univers ?? null,
    buts: butsDeFiche(f),
    fait: faits.has(f.id),
  }));
}
