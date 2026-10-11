/**
 * Lignes d'article notées à l'aveugle (`docs/social/preparation/lignes-articles-notes.json`).
 * Seules les lignes `auNiveau: true` (« = » chez les 2 relecteurs, au niveau de l'étalon) entrent au tirage,
 * et seulement sur les relais de LEUR article (plan-execution-s15.md §2 et mix-formats-s15.md §2 :
 * « relais, ligne notée »). Clé anti-répétition : `slug#rang`, ou texte mot pour mot quand `rang` est nul.
 */
import { z } from "zod";

const ligneSchema = z.object({
  slug: z.string().min(1),
  rang: z.number().int().positive().nullable(),
  texte: z.string().min(1),
  note1: z.string(),
  note2: z.string(),
  auNiveau: z.boolean(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  cand: z.string().optional(),
  emplacement: z.string().optional(),
}).passthrough();

/** Ligne au niveau, prête pour le relais de son article. */
export interface LigneNotee {
  slug: string;
  /** Rang `**N.**` dans l'article ; null : ligne hors liste (introduction, FAQ), retrouvée par son texte. */
  rang: number | null;
  texte: string;
  /** Traçabilité (candidat, vague, numéro). */
  cand?: string;
}

/**
 * Lit le fichier et garde les lignes au niveau. `auNiveau` doit valoir « = » chez les 2 relecteurs :
 * une incohérence est une erreur (la ligne n'entre pas), jamais une correction silencieuse.
 */
export function lireLignesNotees(contenu: string, chemin: string): { lignes: LigneNotee[]; erreurs: string[] } {
  let brut: unknown;
  try { brut = JSON.parse(contenu); } catch (e) { return { lignes: [], erreurs: [`${chemin} : JSON illisible (${(e as Error).message}).`] }; }
  if (!Array.isArray(brut)) return { lignes: [], erreurs: [`${chemin} : tableau JSON attendu.`] };
  const lignes: LigneNotee[] = [];
  const erreurs: string[] = [];
  const vues = new Set<string>();
  brut.forEach((x, i) => {
    const r = ligneSchema.safeParse(x);
    if (!r.success) { erreurs.push(`${chemin}, entrée ${i + 1} : ${r.error.issues.map((q) => `${q.path.join(".") || "entrée"} ${q.message}`).join(" ; ")}.`); return; }
    const l = r.data;
    const egal = l.note1 === "=" && l.note2 === "=";
    if (l.auNiveau !== egal) { erreurs.push(`${chemin}, entrée ${i + 1} (${l.slug}) : auNiveau ${l.auNiveau} incohérent avec les notes ${l.note1} / ${l.note2}.`); return; }
    if (!l.auNiveau) return;
    const cle = `${l.slug}#${l.rang ?? l.texte}`;
    if (vues.has(cle)) { erreurs.push(`${chemin}, entrée ${i + 1} : ligne ${cle} en double.`); return; }
    vues.add(cle);
    lignes.push({ slug: l.slug, rang: l.rang, texte: l.texte, ...(l.cand ? { cand: l.cand } : {}) });
  });
  return { lignes, erreurs };
}
