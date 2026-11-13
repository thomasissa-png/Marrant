/**
 * Lecture des lots Markdown de `docs/copy/espace/` (s24, import du contenu de l'espace).
 * Aucune réécriture : on découpe, on retire les balises d'écran et les notes internes, rien d'autre.
 */
import { readFileSync } from "fs";
import { join } from "path";

export const RACINE = join(__dirname, "..", "..", "..", "..");
export const DOSSIER_LOTS = join(RACINE, "docs", "copy", "espace");

export interface Section {
  label: string;
  /** Étiquette telle qu'écrite (ponctuation finale comprise). */
  brut: string;
  lignes: string[];
}
export interface Bloc {
  titre: string;
  /** Titre de la section `## ` qui contient le bloc (univers des situations). */
  partie: string;
  sections: Section[];
  /** Lignes avant la première étiquette en gras (paragraphes libres). */
  avant: string[];
  /**
   * Import 2 : lignes « [note interne] … », jamais affichées ; seul usage, l'emploi attesté du vocabulaire
   * (champ interne `emploiAtteste`, sources données par fiche).
   */
  notes: string[];
}

/** Erreur d'import d'une fiche : la fiche est écartée et signalée, jamais corrigée. */
export class Ecart extends Error {}

export const lireLot = (nom: string): string => readFileSync(join(DOSSIER_LOTS, nom), "utf8");

/** Ligne de bouton d'écran (`[Retour : …]`) ou note interne : jamais importée. */
function horsTexte(ligne: string): boolean {
  const l = ligne.trim();
  return /^\[note interne/i.test(l) || l.replace(/`\[[^`]*\]`/g, "").trim() === "";
}

/** Retire les fragments de note interne en fin de ligne et le gras/italique Markdown. */
export function nettoyer(ligne: string): string {
  return ligne
    .replace(/\s*`\[[^`]*\]`/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*([^*\s][^*]*?)\*/g, "$1")
    .trim();
}

/**
 * Découpe un lot en blocs : chaque titre qui répond à `debut` ouvre un bloc ; un titre de même niveau
 * ou plus haut le ferme (les annexes et tours ne sont donc jamais lus comme une fiche).
 */
export function decouper(md: string, niveau: 2 | 3, debut: RegExp): Bloc[] {
  const blocs: Bloc[] = [];
  let courant: { titre: string; partie: string; lignes: string[] } | null = null;
  let partie = "";
  const fermer = () => {
    if (courant) blocs.push(sectionner(courant.titre, courant.partie, courant.lignes));
    courant = null;
  };
  for (const ligne of md.split("\n")) {
    const titre = /^(#{1,6})\s+(.*)$/.exec(ligne);
    if (titre) {
      const n = titre[1].length;
      if (n <= niveau) fermer();
      if (n === 2) partie = titre[2].trim();
      if (n === niveau && debut.test(titre[2])) courant = { titre: titre[2].trim(), partie, lignes: [] };
      continue;
    }
    if (courant && ligne.trim() === "---") {
      fermer();
      continue;
    }
    courant?.lignes.push(ligne);
  }
  fermer();
  return blocs;
}

const ETIQUETTE = /^\*\*(.+?)\*\*\s*(.*)$/;

function sectionner(titre: string, partie: string, lignes: string[]): Bloc {
  const sections: Section[] = [];
  const avant: string[] = [];
  const notes: string[] = [];
  for (const brute of lignes) {
    if (/^\[note interne\]/i.test(brute.trim())) notes.push(brute.trim().replace(/^\[note interne\]\s*/i, ""));
    if (!brute.trim() || horsTexte(brute)) continue;
    const m = ETIQUETTE.exec(brute.trim());
    if (m) {
      const label = m[1].trim().replace(/[.:]$/, "").trim();
      const reste = nettoyer(m[2].replace(/^[:.]\s*/, ""));
      sections.push({ label, brut: m[1].trim(), lignes: reste && !horsTexte(m[2]) ? [reste] : [] });
      continue;
    }
    const l = nettoyer(brute);
    if (!l) continue;
    (sections.length ? sections[sections.length - 1].lignes : avant).push(l);
  }
  return { titre, partie, sections, avant, notes };
}

export function section(bloc: Bloc, label: string | RegExp, obligatoire = true): string[] {
  const s = bloc.sections.find((x) => (typeof label === "string" ? x.label === label : label.test(x.label)));
  if (!s && obligatoire) throw new Ecart(`section « ${String(label)} » absente`);
  if (s && obligatoire && s.lignes.length === 0) throw new Ecart(`section « ${String(label)} » vide`);
  return s?.lignes ?? [];
}

/** Retire les guillemets extérieurs « » d'un texte cité entier (l'écran les pose). */
export function sansGuillemets(t: string): string {
  const m = /^«\s*([\s\S]*?)\s*»$/.exec(t.trim());
  return m ? m[1] : t.trim();
}
/** Une seule citation « … » sur toute la ligne (les guillemets intérieurs sont “ ”). */
export const estCitation = (t: string) => /^«[^«»]*»$/.test(t.trim());

/** Identifiant stable tiré d'un titre : minuscules, sans accents ni ponctuation. */
export function slug(t: string): string {
  return t
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .toLowerCase()
    .replace(/['’]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/**
 * Titre affiché : la parenthèse finale reste si elle décrit la scène (« (premier verre) », « (règle de
 * trois) ») ; elle part si c'est une note de travail (« (E1.1, profil Taquin) », « (situation reprise : …) »).
 */
export function titreAffiche(t: string): string {
  const p = /\(([^()]*)\)\s*$/.exec(t)?.[1] ?? "";
  return /\bE\d|profil|étalon|reprise|vanne du site|neuve|angle :|palier|semaine/i.test(p) ? sansParenthese(t) : t.trim();
}

/** Titre sans sa parenthèse finale (identifiants stables, familles de jeux). */
export const sansParenthese = (t: string) => t.replace(/\s*\([^()]*(?:\([^()]*\)[^()]*)*\)\s*$/, "").trim();
