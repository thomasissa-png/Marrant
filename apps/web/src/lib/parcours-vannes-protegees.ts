/**
 * Vannes liées à une étape de parcours (s19, constat de fin de `import-boulot.md`).
 *
 * Une étape désigne ses 5 vannes par leur texte exact (`jokeContents`, contrat D4) :
 * si la relecture IA (`copy-review-runner.ts`) réécrivait ou retirait l'une d'elles,
 * l'étape perdrait sa vanne. Deux vannes liées au Parcours Boulot sont marquées
 * `generatedByAI = true` (provenance réelle, jamais changée) et seraient donc relues
 * dès que `CONTENT_GENERATION_ENABLED = "true"`. Cette liste les met hors de portée,
 * avec toutes les vannes des autres parcours, publiés ou non (le contenu existe en base
 * avant la publication).
 *
 * SERVEUR UNIQUEMENT (lit les fichiers de contenu complets).
 */
import parcoursSeed from "../../../../docs/content/parcours-seed.json";
import storytellingS18 from "../../../../docs/content/parcours-storytelling-s18.json";
import boulotS19 from "../../../../docs/content/parcours-boulot-s19.json";

type AvecEtapes = { steps: Array<{ jokeContents?: string[] }> };

const PARCOURS: AvecEtapes[] = [...parcoursSeed, storytellingS18.parcours, boulotS19.parcours];

/** Textes exacts (`Joke.content`) des vannes de toutes les étapes de parcours, sans doublon. */
export const VANNES_LIEES_AUX_PARCOURS: readonly string[] = Array.from(
  new Set(PARCOURS.flatMap((p) => p.steps.flatMap((s) => s.jokeContents ?? []))),
);
