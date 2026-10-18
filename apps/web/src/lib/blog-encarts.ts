/**
 * Placement des encarts au fil du texte (audit conversion s20, lot 1).
 *
 * Le corps est découpé en sections (lib : `renderMarkdownSections`) : [intro, H2 n°1,
 * H2 n°2, …]. Un encart se place APRÈS la fin d'une section H2, jamais après la
 * dernière (ce serait le bloc de fin) ni dans l'intro.
 *
 * - Article à encart imposé (ENCARTS_IMPOSES) : après la première section nommée
 *   trouvée (intitulé comparé par ancre, insensible au rendu typographique).
 * - s21 : UN seul encart par article (`DemoVanne`, position milieu-1) ; milieu-2
 *   n'est plus posé (spec cta-forme-place §2.5). Le type garde « milieu-2 » pour
 *   lire les anciennes mesures.
 *   Aucune section trouvée (article modifié en base) : repli sur l'encart automatique.
 * - Sinon : un encart, si l'article a au moins 3 H2, après la section dont la fin
 *   tombe au plus près de 40 % du texte (fenêtre visée 35 à 45 %).
 */
import {
  ENCARTS_IMPOSES,
  ENCART_AUTO_CIBLE,
  ENCART_AUTO_MIN_H2,
  type EncartImpose,
} from "@/config/blog-encarts";
import { headingId } from "@/components/ui/markdown-renderer";
import { resolveArticleParcours } from "@/lib/blog-parcours";
import type { ParcoursSlug } from "@/lib/entrees-parcours";

export type BlogCtaPosition = "milieu-1" | "milieu-2" | "fin";

/** Section du corps : intitulé Markdown du H2 (null pour l'intro) et poids (texte visible). */
export interface BlogSection {
  heading: string | null;
  weight: number;
}

export interface EncartPlacement {
  /** Index de la section (dans le tableau complet, intro = 0) APRÈS laquelle placer l'encart. */
  apresIndex: number;
  position: Exclude<BlogCtaPosition, "fin">;
  parcours: ParcoursSlug;
  texte?: EncartImpose["texte"];
}

/** s21 : une seule position d'encart au fil du texte. */
const POSITIONS = ["milieu-1"] as const;

function placementsImposes(sections: readonly BlogSection[], imposes: readonly EncartImpose[]) {
  const lastH2 = sections.length - 1;
  const found: Omit<EncartPlacement, "position">[] = [];
  for (const encart of imposes) {
    const id = headingId(encart.apresSection);
    const index = sections.findIndex((s) => s.heading !== null && headingId(s.heading) === id);
    // Section introuvable ou dernière section : pas d'encart (le bloc de fin suit déjà).
    if (index <= 0 || index >= lastH2) continue;
    if (found.some((f) => f.apresIndex === index)) continue;
    found.push({ apresIndex: index, parcours: encart.parcours, texte: encart.texte });
  }
  return found.sort((a, b) => a.apresIndex - b.apresIndex).slice(0, POSITIONS.length);
}

function placementAuto(sections: readonly BlogSection[]): number | null {
  const h2Count = sections.filter((s) => s.heading !== null).length;
  if (h2Count < ENCART_AUTO_MIN_H2) return null;
  const total = sections.reduce((sum, s) => sum + Math.max(0, s.weight), 0);
  if (total <= 0) return null;
  let cumul = 0;
  let best: { index: number; gap: number } | null = null;
  // Candidats : fin de chaque section H2 sauf la dernière.
  for (let i = 0; i < sections.length - 1; i++) {
    cumul += Math.max(0, sections[i].weight);
    if (sections[i].heading === null) continue;
    const gap = Math.abs(cumul / total - ENCART_AUTO_CIBLE);
    if (!best || gap < best.gap) best = { index: i, gap };
  }
  return best?.index ?? null;
}

export function computeEncartPlacements(
  articleSlug: string,
  articleCategory: string | undefined,
  sections: readonly BlogSection[],
): EncartPlacement[] {
  const imposes = ENCARTS_IMPOSES[articleSlug];
  if (imposes && imposes.length > 0) {
    const found = placementsImposes(sections, imposes);
    if (found.length > 0) return found.map((f, i) => ({ ...f, position: POSITIONS[i] }));
  }
  const index = placementAuto(sections);
  if (index === null) return [];
  return [{ apresIndex: index, position: "milieu-1", parcours: resolveArticleParcours(articleSlug, articleCategory) }];
}

/** Texte visible d'un fragment HTML (poids d'une section). */
export function visibleTextLength(html: string): number {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().length;
}
