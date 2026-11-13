/**
 * Renvoi d'une question « Laquelle ressortir ici ? » du bilan (s24, import 2 ; architecture v20 3.10 :
 * « Une erreur renvoie vers la fiche à revoir : celle-là mérite un deuxième tour » ; libellés E5 §5).
 *
 * Jamais stocké : l'écran le calcule à partir de l'étape du quiz dont vient la question (`etape`, posé
 * par l'import d'après « quiz S l.57 » du lot C6b). La fiche à revoir est la fiche « conseil et défi »
 * de l'étape : son titre est celui du conseil (`tipTitle` du seed), son adresse l'ancre de l'étape.
 * Parcours non publié ou étape inconnue : pas de renvoi (jamais un lien mort).
 *
 * SERVEUR UNIQUEMENT (lit le seed des parcours publiés, `lib/parcours-seed.ts`).
 */
import { PARCOURS_SEED_JSON } from "@/lib/parcours-seed";

export interface RenvoiBilan {
  titre: string;
  href: string;
}

interface SeedLeger {
  slug: string;
  steps: ReadonlyArray<{ week: number; tipTitle?: string | null }>;
}

export function renvoiDeBilan(parcoursSlug: string, etape: number | undefined, seeds: readonly SeedLeger[] = PARCOURS_SEED_JSON): RenvoiBilan | null {
  if (etape === undefined) return null;
  const step = seeds.find((p) => p.slug === parcoursSlug)?.steps.find((s) => s.week === etape);
  if (!step?.tipTitle) return null;
  return { titre: step.tipTitle, href: `/parcours/${parcoursSlug}#etape-${etape}` };
}
