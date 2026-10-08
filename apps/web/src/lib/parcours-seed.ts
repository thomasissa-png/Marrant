/**
 * Liste unique des parcours PUBLIÉS côté seed (s18) : `parcours-seed.json` (3 parcours
 * en ligne) + Storytelling (`parcours-storytelling-s18.json`) seulement si
 * `STORYTELLING_PUBLIE`. Tout lecteur du seed (page, hub, llms.txt, fiches, XP,
 * rappels) passe par ici : un parcours non publié n'apparaît nulle part.
 *
 * SERVEUR UNIQUEMENT (contenu complet, réponses du quiz comprises).
 * `prisma db seed` lit `parcours-seed.json` seul : il ne crée jamais Storytelling.
 */
import parcoursSeed from "../../../../docs/content/parcours-seed.json";
import storytellingS18 from "../../../../docs/content/parcours-storytelling-s18.json";
import { STORYTELLING_PUBLIE } from "@/config/parcours-publication";

type SeedJson = (typeof parcoursSeed)[number];

/** Entrée Storytelling (même forme que `parcours-seed.json`, champs s18 en plus). */
export const STORYTELLING_SEED = storytellingS18.parcours;

/** Métadonnées d'import (conseils réactivés, retouches de défi, vannes neuves de l'étape 5). */
export const STORYTELLING_IMPORT = storytellingS18._meta;

/** Parcours seed publiés, dans l'ordre du fichier puis Storytelling. */
export function publishedSeedJson(publie: boolean = STORYTELLING_PUBLIE): SeedJson[] {
  return publie ? [...parcoursSeed, STORYTELLING_SEED as unknown as SeedJson] : [...parcoursSeed];
}

export const PARCOURS_SEED_JSON: SeedJson[] = publishedSeedJson();
