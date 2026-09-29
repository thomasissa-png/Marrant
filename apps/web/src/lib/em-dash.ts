/**
 * Retrait déterministe des tirets cadratins (« — ») dans du Markdown.
 *
 * Règle projet n°12 : le tiret cadratin est une signature d'écriture IA.
 * PONCTUATION SEULEMENT : aucun mot n'est ajouté, supprimé ni modifié.
 *
 * Règles (dans l'ordre) :
 *  - lignes de titre (`#`), blocs de code (```), code inline, liens `[..](..)`
 *    et URL nues : jamais touchés ;
 *  - tiret de dialogue en début de ligne (« — Salut ») : tiret supprimé ;
 *  - incise « X — Y — Z » dans une même phrase : « X, Y, Z », ou
 *    « X (Y) Z » si l'incise contient déjà une virgule, finit par « ? »/« ! »
 *    ou si la phrase est déjà entre parenthèses (alors virgules) ; après une
 *    parenthèse ouverte par « Avec/Quand/Si… » ou suivie de « c'est », virgule
 *    de détachement (« Avec X (a, b), la suite ») ;
 *  - puce « - **Libellé** — texte » ou réplique entre guillemets
 *    (« "…" — texte ») : toujours « : » ;
 *  - tiret précédé d'une ponctuation forte (« ? — », « . — ») : tiret retiré
 *    (nouvelle phrase) ;
 *  - « X — et/mais/pas/sans/ce qui… Y » ou « Que tu X — Y » : virgule ;
 *  - « X — Y » quand la phrase contient déjà un deux-points : virgule, ou
 *    point si Y commence par une majuscule (« Étape 1. Installer ») ;
 *  - sinon « X : Y ».
 *
 * Fonction pure, idempotente (un texte sans « — » ressort identique).
 */

export type EmDashReplacement = "comma" | "colon" | "parens" | "period" | "dialogue";

export interface EmDashStats {
  comma: number;
  colon: number;
  parens: number;
  period: number;
  dialogue: number;
}

export interface EmDashResult {
  text: string;
  stats: EmDashStats;
}

const EM_DASH = "—";

/** Mots qui, juste après le tiret, appellent une virgule plutôt qu'un deux-points. */
const COMMA_CONNECTORS = new Set([
  "et", "mais", "ou", "donc", "puis", "pas", "sans", "voire", "sinon", "même",
  "surtout", "car", "parce", "ni", "alors", "quitte", "histoire", "jamais",
  "plutôt", "sauf", "ensuite", "enfin", "or", "non", "tant", "quand", "avant",
  "après", "comme", "tout", "juste", "idéalement", "souvent", "parfois",
]);

const HEADING_RE = /^\s{0,3}(>\s*)*#{1,6}\s/;
const FENCE_RE = /^\s*(```|~~~)/;
// Code inline, liens/images Markdown, URL nues : remplacés par des jetons.
const PROTECTED_RE = /`[^`]*`|!?\[[^\]]*\]\([^)]*\)|https?:\/\/\S+/g;

function emptyStats(): EmDashStats {
  return { comma: 0, colon: 0, parens: 0, period: 0, dialogue: 0 };
}

/** Puce ou numéro suivi d'un seul libellé en gras : « - **Libellé** ». */
const LIST_LABEL_RE = /^\s*(?:>\s*)*(?:[-*+]|\d+\.)\s+\*\*[^*]+\*\*$/;

/** Début de phrase circonstanciel : « Avec 5 minutes par jour (…), la suite ». */
const INTRO_RE = /^(avec|quand|si|pour|dans|en|après|avant|pendant|comme|lorsque|dès)\b/i;

function stripLead(s: string): string {
  return s.replace(/^[\s*_"«'(>]+/, "");
}

/** « ce qui », « ce que », « y compris » ou connecteur : virgule. */
function isCommaLead(next: string): boolean {
  const t = next.replace(/^[\s*_"«'(]+/, "").toLowerCase();
  return /^(ce qu|y compris)/.test(t) || COMMA_CONNECTORS.has(firstWord(next));
}

function firstWord(s: string): string {
  // Un guillemet ouvrant = nouvelle réplique : ce n'est pas un connecteur.
  const m = s.replace(/^[\s*_(]+/, "").match(/^[\p{L}]+/u);
  return m ? m[0].toLowerCase() : "";
}

/** Découpe une ligne en phrases en conservant les séparateurs. */
function splitSentences(line: string): string[] {
  return line.split(/(?<=[.!?…]["»')*_]*)(?=\s+[^\s—])/u);
}

function replaceInSentence(sentence: string, stats: EmDashStats): string {
  let parts = sentence.split(/\s+—\s+|\s+—$|^—\s+/);
  if (parts.length === 1) return sentence;

  // Incise : exactement 2 tirets dans la phrase, texte de part et d'autre.
  if (parts.length === 3 && parts[0].trim() && parts[2].trim()) {
    const [x, y, z] = parts;
    const inParens = /\([^)]*$/.test(x);
    const useParens = !inParens && (/,/.test(y) || /[?!]["»*]*$/.test(y.trim()));
    if (useParens) {
      stats.parens += 2;
      // « Avec X (a, b) la suite » → « Avec X (a, b), la suite » (virgule de
      // détachement, pas un tiret : non comptée).
      const detach = INTRO_RE.test(stripLead(x)) || /^(c'est|ça|ce)\b/i.test(stripLead(z));
      return `${x} (${y})${detach ? "," : ""} ${z}`;
    }
    stats.comma += 2;
    return `${x}, ${y}, ${z}`;
  }

  // Tirets isolés, traités de gauche à droite.
  let out = parts[0];
  parts = parts.slice(1);
  for (const next of parts) {
    const before = out.trimEnd();
    const colonTaken = /:/.test(out) || /:/.test(next);
    // Élément de liste « - **Libellé** — explication » : toujours deux-points,
    // pour rester homogène avec les autres puces de la liste.
    const listLabel = LIST_LABEL_RE.test(before);
    if (listLabel) {
      stats.colon++;
      out = `${before} : ${next}`;
    } else if (/[.!?…][*_]*$/.test(before)) {
      // Ponctuation forte déjà là : le tiret disparaît, nouvelle phrase.
      stats.period++;
      out = `${before} ${next}`;
    } else if (isCommaLead(next) || /^(ou )?que tu\b/i.test(stripLead(out))) {
      stats.comma++;
      out = `${before}, ${next}`;
    } else if (/["»'][*_]*$/.test(before)) {
      // Après une réplique entre guillemets : « "…" : explication ».
      stats.colon++;
      out = `${before} : ${next}`;
    } else if (colonTaken && /^[*_"«]*\p{Lu}/u.test(next)) {
      // Deux-points déjà pris et majuscule derrière : point (« Étape 1. Installer »).
      stats.period++;
      out = `${before}. ${next}`;
    } else if (colonTaken) {
      stats.comma++;
      out = `${before}, ${next}`;
    } else {
      stats.colon++;
      out = `${before} : ${next}`;
    }
  }
  return out;
}

function processLine(line: string, stats: EmDashStats): string {
  if (!line.includes(EM_DASH) || HEADING_RE.test(line)) return line;

  const tokens: string[] = [];
  let work = line.replace(PROTECTED_RE, (m) => {
    tokens.push(m);
    return `${tokens.length - 1}`;
  });

  // Tiret de dialogue en début de ligne (après un éventuel marqueur de citation).
  work = work.replace(/^(\s*(?:>\s*)*)—\s+/, (_m, prefix: string) => {
    stats.dialogue++;
    return prefix;
  });

  if (work.includes(EM_DASH)) {
    work = splitSentences(work)
      .map((s) => (s.includes(EM_DASH) ? replaceInSentence(s, stats) : s))
      .join("");
  }

  return work.replace(/(\d+)/g, (_m, i: string) => tokens[Number(i)]);
}

/** Remplace les tirets cadratins du Markdown et renvoie les compteurs par type. */
export function stripEmDashesWithStats(markdown: string): EmDashResult {
  const stats = emptyStats();
  let inFence = false;
  const lines = markdown.split("\n").map((line) => {
    if (FENCE_RE.test(line)) {
      inFence = !inFence;
      return line;
    }
    return inFence ? line : processLine(line, stats);
  });
  return { text: lines.join("\n"), stats };
}

/** Remplace les tirets cadratins du Markdown (ponctuation seulement). */
export function stripEmDashes(markdown: string): string {
  return stripEmDashesWithStats(markdown).text;
}
