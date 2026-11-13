/**
 * Bloc d'en-tête de « Parcours » (s24, lot D4 ; architecture v20 4.1, 4.4, 5.4 ; maquette
 * `etalons/e5/parcours.html`) : « Tes 4 premières semaines » (quatre lignes fixes, un ordre conseillé,
 * jamais un verrou : `config/textes/espace-caps.ts`) et l'étape à reprendre, action de la page.
 *
 * Étape à reprendre : le parcours touché le plus récemment et pas terminé, sa première étape non
 * validée (« Étape en cours ») ; sinon un autre parcours commencé et pas terminé ; sinon l'étape 1
 * du parcours par défaut (4.2 : aucun signal ; « Étape conseillée », « Commencer l'étape 1 »).
 * Jamais « choisis un parcours ». Titres lus dans le seed publié (aucun texte neuf).
 */
import { PREMIUM_PARCOURS } from "@/config/premium";
import { PARCOURS_PAR_DEFAUT } from "@/lib/espace/premier-pas";

export interface ParcoursSeedLeger {
  slug: string;
  steps: ReadonlyArray<{ week: number; moduleTitle?: string | null; tipTitle?: string | null }>;
}

export interface ProgressionLue {
  slug: string;
  completedSteps: readonly number[];
  termine: boolean;
  /** Dernière validation d'étape de ce parcours (null : aucune). */
  derniere: Date | null;
  startedAt: Date;
}

export interface EtapeAReprendre {
  slug: string;
  titreParcours: string;
  ordre: number;
  total: number;
  titreEtape: string;
  /** true : parcours commencé (« Étape en cours », « Reprendre ») ; false : « Étape conseillée ». */
  enCours: boolean;
  href: string;
}

const nomCourt = (slug: string) => PREMIUM_PARCOURS.find((p) => p.slug === slug)?.name ?? null;

function etapeDe(seed: ParcoursSeedLeger, completed: readonly number[], enCours: boolean): EtapeAReprendre | null {
  const titreParcours = nomCourt(seed.slug);
  const ordres = seed.steps.map((s) => s.week).sort((a, b) => a - b);
  const ordre = ordres.find((o) => !completed.includes(o));
  if (!titreParcours || ordre === undefined) return null;
  const step = seed.steps.find((s) => s.week === ordre);
  return {
    slug: seed.slug,
    titreParcours,
    ordre,
    total: ordres.length,
    titreEtape: step?.moduleTitle ?? step?.tipTitle ?? "",
    enCours,
    href: `/parcours/${seed.slug}#etape-${ordre}`,
  };
}

const date = (p: ProgressionLue) => (p.derniere ?? p.startedAt).getTime();

/** Étape à reprendre (règle ci-dessus). `seeds` = parcours publiés. */
export function etapeAReprendre(progressions: readonly ProgressionLue[], seeds: readonly ParcoursSeedLeger[]): EtapeAReprendre | null {
  const ouverts = progressions
    .filter((p) => !p.termine && p.completedSteps.length > 0)
    .sort((a, b) => date(b) - date(a));
  for (const p of ouverts) {
    const seed = seeds.find((s) => s.slug === p.slug);
    const etape = seed ? etapeDe(seed, p.completedSteps, true) : null;
    if (etape) return etape;
  }
  const parDefaut = seeds.find((s) => s.slug === PARCOURS_PAR_DEFAUT);
  const dejaFaites = progressions.find((p) => p.slug === PARCOURS_PAR_DEFAUT)?.completedSteps ?? [];
  if (parDefaut && !progressions.some((p) => p.slug === PARCOURS_PAR_DEFAUT && p.termine)) return etapeDe(parDefaut, dejaFaites, false);
  // Parcours par défaut terminé : le premier parcours publié pas terminé, à sa première étape non validée.
  for (const seed of seeds) {
    const p = progressions.find((x) => x.slug === seed.slug);
    if (p?.termine) continue;
    const etape = etapeDe(seed, p?.completedSteps ?? [], false);
    if (etape) return etape;
  }
  return null;
}
