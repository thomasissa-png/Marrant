/**
 * Découpage des 25 étapes en fiches « Voir / Fait » (s24, lot D4 ; architecture v20 5.1 à 5.3).
 *
 * `data/espace/parcours-fiches.json` ne contient AUCUN texte : pour chaque étape, la liste ordonnée
 * des fiches, chacune une RÉFÉRENCE à un bloc existant du seed (conseil et défi, vannes, chaque vidéo,
 * quiz) avec son empreinte (sha256 tronqué du bloc au moment du découpage), plus les fiches neuves
 * rattachées (ids des lots de contenu C, vides tant qu'ils ne sont pas livrés). Fiche 0 : introduction
 * du parcours assemblée depuis le seed (description, durée, rythme, accroche), aucun texte neuf.
 * Ancres : `#etape-N` conservées (les lettres y pointent), `#fiche-N-M` ajoutées.
 * Diff mesuré (P0 s11) : un test recalcule l'empreinte de chaque bloc référencé sur le seed publié ;
 * un mot changé dans un bloc fait échouer le test.
 */
import decoupage from "@/data/espace/parcours-fiches.json";

export type BlocReference =
  | { bloc: "conseil" }
  | { bloc: "vannes" }
  | { bloc: "video"; youtubeId: string }
  | { bloc: "quiz" };

export interface FicheReferencee {
  numero: string;
  ancre: string;
  ref: BlocReference;
  empreinte: string;
}

export interface EtapeDecoupee {
  ordre: number;
  ancre: string;
  fiches: FicheReferencee[];
  /** Ids des fiches neuves rattachées à l'étape (situation, construction ou jeu ; lots C). */
  fichesNeuves: string[];
}

export interface ParcoursDecoupe {
  slug: string;
  fiche0: { ancre: string; champs: string[]; empreinte: string };
  etapes: EtapeDecoupee[];
}

/** Champs du seed d'une étape qui forment la fiche « conseil et défi » (le texte du conseil vit en base). */
export const CHAMPS_CONSEIL = ["tipTitle", "why", "moduleTitle", "moduleDetail"] as const;

export const DECOUPAGE: readonly ParcoursDecoupe[] = (decoupage as { parcours: ParcoursDecoupe[] }).parcours;

/** Étape découpée, ou null (parcours ou étape inconnus). */
export function etapeDecoupee(slug: string, ordre: number): EtapeDecoupee | null {
  return DECOUPAGE.find((p) => p.slug === slug)?.etapes.find((e) => e.ordre === ordre) ?? null;
}

/** Étape du seed, telle que lue par le découpage (forme minimale). */
export interface EtapeSeed {
  week: number;
  jokeContents?: unknown[];
  videos?: Array<{ youtubeId: string } & Record<string, unknown>>;
  quiz?: unknown[];
  [champ: string]: unknown;
}

/** Valeur du bloc référencé, telle qu'elle est hachée (null : bloc introuvable dans le seed). */
export function blocReference(etape: EtapeSeed, ref: BlocReference): unknown {
  switch (ref.bloc) {
    case "conseil":
      return CHAMPS_CONSEIL.map((c) => etape[c] ?? null);
    case "vannes":
      return etape.jokeContents ?? [];
    case "video":
      return etape.videos?.find((v) => v.youtubeId === ref.youtubeId) ?? null;
    case "quiz":
      return etape.quiz ?? [];
  }
}
