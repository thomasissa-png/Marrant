/**
 * Anti-séries des vannes générées (lot V7, audit s14).
 *
 * Constat s14 : sur 638 vannes actives, ~160 sont des variantes d'un même
 * setup (« choisis le resto » ×18-20, « bus sous la pluie » ×13-17,
 * festival ×36). Le générateur ne voyait que les 14 dernières vannes.
 *
 * Ce module, 100 % programmatique (zéro appel LLM, zéro dépendance) :
 *   1. construit une liste compacte des amorces déjà saturées, injectée dans
 *      le prompt de génération (budget plafonné, voir AVOID_LIST_*) ;
 *   2. rejette après génération toute vanne dont le setup est quasi identique
 *      à un setup existant (actif OU inactif) ;
 *   3. plafonne à MAX_ACTIVE_PER_AMORCE vannes actives par amorce ;
 *   4. rejette les tics d'écriture relevés par l'audit s14.
 *
 * Similarité : Jaccard sur des « mots pleins » (normalisés, sans accents,
 * sans mots-outils, tronqués à 5 lettres pour absorber les flexions :
 * choisis / choisir / choisi → « chois »). Seuils calibrés sur l'export
 * prod du 30/09/2026 (docs/copy/audit-vannes-s14/export-vannes-actives.txt).
 */

/** Setup quasi identique : Jaccard des mots pleins du setup complet. */
export const NEAR_DUPLICATE_THRESHOLD = 0.6;
/** Même amorce (même série) : Jaccard des mots pleins des 12 premiers mots. */
export const SERIES_THRESHOLD = 0.5;
/** Au plus 3 vannes actives par amorce : une 4e est rejetée. */
export const MAX_ACTIVE_PER_AMORCE = 3;
/** Nombre de mots de l'amorce (aligné sur extractSetupAmorce du joke-agent). */
export const AMORCE_WORDS = 12;
/** Budget de la liste à éviter : entrées et caractères (~4 car./token FR). */
export const AVOID_LIST_MAX_ENTRIES = 40;
export const AVOID_LIST_MAX_CHARS = 2800;
/** Une amorce entre dans la liste dès qu'elle a au moins 2 occurrences. */
export const AVOID_LIST_MIN_CLUSTER = 2;
/** En dessous de ce nombre de mots pleins, une amorce est trop pauvre pour comparer. */
const MIN_CONTENT_WORDS = 2;
const STEM_LENGTH = 5;

const STOPWORDS = new Set(
  (
    "a ai as au aux avec c ca ce ces cet cette d de des du elle elles en est et etait " +
    "eu il ils j je l la le les leur lui m ma mais me mes moi mon n ne ni nos notre nous " +
    "on ont ou par pas plus pour qu que qui s sa se ses si son sont suis sur t ta te tes " +
    "toi ton tu un une vos votre vous y deja tres tout toute tous fait dit comme quand " +
    "alors apres avant bien encore juste meme puis rien sans trop vraiment"
  ).split(" "),
);

/** Minuscules, sans accents, apostrophes et ponctuation remplacées par des espaces. */
export function normalizeSetup(text: string): string {
  return (text ?? "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Mots pleins tronqués (ensemble) d'un texte déjà normalisé ou brut. */
export function contentWords(text: string, maxWords?: number): Set<string> {
  let tokens = normalizeSetup(text).split(" ").filter(Boolean);
  if (maxWords !== undefined) tokens = tokens.slice(0, maxWords);
  const out = new Set<string>();
  for (const t of tokens) {
    if (STOPWORDS.has(t) || t.length < 2) continue;
    out.add(t.slice(0, STEM_LENGTH));
  }
  return out;
}

/** Mots pleins de l'amorce : les AMORCE_WORDS premiers mots du setup. */
export function amorceWords(setup: string): Set<string> {
  return contentWords(setup, AMORCE_WORDS);
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const w of a) if (b.has(w)) inter++;
  return inter / (a.size + b.size - inter);
}

// ─── Tics d'écriture du générateur (audit s14 §4) ───────────────

/** Tics relevés par l'audit s14, rejetés après génération. */
export const GENERATOR_TICS: ReadonlyArray<{ label: string; pattern: RegExp }> = [
  { label: "« depuis 2019 »", pattern: /depuis\s+2019/i },
  { label: "« j'ai enfin compris pourquoi on dit que »", pattern: /enfin compris pourquoi on dit/i },
  { label: "« j'ai pris ma retraite pendant »", pattern: /pris ma retraite pendant/i },
  { label: "points de suspension", pattern: /\.\.\.|…/ },
];

export function detectTics(text: string): string[] {
  return GENERATOR_TICS.filter((t) => t.pattern.test(text ?? "")).map((t) => t.label);
}

// ─── Garde anti-séries ──────────────────────────────────────────

export interface ExistingJokeSetup {
  content: string;
  isActive: boolean;
}

interface IndexedSetup {
  raw: string;
  isActive: boolean;
  full: Set<string>;
  amorce: Set<string>;
}

export interface SeriesCluster {
  /** Amorce représentative (texte brut, 12 premiers mots). */
  label: string;
  total: number;
  active: number;
}

export type SeriesCheck =
  | { ok: true }
  | { ok: false; reason: "near-duplicate" | "series-cap" | "tic"; detail: string };

export interface JokeSeriesGuard {
  /** Nombre de setups existants indexés (actifs + inactifs). */
  size: number;
  clusters: SeriesCluster[];
  /** Bloc prompt compact (vide si aucune série). */
  avoidListPrompt: string;
  check(candidate: { content: string; punchline?: string }): SeriesCheck;
}

function rawAmorce(setup: string): string {
  return setup.trim().split(/\s+/).slice(0, AMORCE_WORDS).join(" ");
}

/**
 * Regroupe les setups par amorce (glouton : chaque setup rejoint le premier
 * groupe dont le représentant est à ≥ SERIES_THRESHOLD). O(n × groupes),
 * ~1 000 setups → quelques ms.
 */
export function clusterSetups(setups: readonly ExistingJokeSetup[]): SeriesCluster[] {
  const groups: Array<{ rep: Set<string>; label: string; total: number; active: number }> = [];
  for (const s of setups) {
    const a = amorceWords(s.content);
    if (a.size < MIN_CONTENT_WORDS) continue;
    const g = groups.find((x) => jaccard(x.rep, a) >= SERIES_THRESHOLD);
    if (g) {
      g.total++;
      if (s.isActive) g.active++;
    } else {
      groups.push({ rep: a, label: rawAmorce(s.content), total: 1, active: s.isActive ? 1 : 0 });
    }
  }
  return groups
    .filter((g) => g.total >= AVOID_LIST_MIN_CLUSTER)
    .sort((x, y) => y.total - x.total || y.active - x.active || x.label.localeCompare(y.label))
    .map(({ label, total, active }) => ({ label, total, active }));
}

/** Liste compacte « amorces à éviter », plafonnée en entrées et en caractères. */
export function buildAvoidListPrompt(clusters: readonly SeriesCluster[]): string {
  if (clusters.length === 0) return "";
  const lines: string[] = [];
  let chars = 0;
  for (const c of clusters.slice(0, AVOID_LIST_MAX_ENTRIES)) {
    const line = `- ${c.label.replace(/["«»]/g, "")} (x${c.total})`;
    if (chars + line.length > AVOID_LIST_MAX_CHARS) break;
    lines.push(line);
    chars += line.length + 1;
  }
  return `AMORCES DÉJÀ EXPLOITÉES DANS LE CATALOGUE (séries, de la plus à la moins répétée) :
${lines.join("\n")}
Ta vanne ne reprend ni ces situations ni ces ouvertures, même reformulées : changer le personnage, le lieu ou l'objet ne suffit pas. Choisis une situation absente de cette liste.`;
}

export function buildJokeSeriesGuard(existing: readonly ExistingJokeSetup[]): JokeSeriesGuard {
  const index: IndexedSetup[] = existing
    .filter((e) => e.content?.trim())
    .map((e) => ({
      raw: e.content,
      isActive: e.isActive,
      full: contentWords(e.content),
      amorce: amorceWords(e.content),
    }));
  const clusters = clusterSetups(existing);

  return {
    size: index.length,
    clusters,
    avoidListPrompt: buildAvoidListPrompt(clusters),
    check(candidate) {
      const tics = detectTics(`${candidate.content} ${candidate.punchline ?? ""}`);
      if (tics.length > 0) {
        return { ok: false, reason: "tic", detail: `Tic d'écriture : ${tics.join(", ")}` };
      }

      const full = contentWords(candidate.content);
      if (full.size >= MIN_CONTENT_WORDS) {
        for (const s of index) {
          const score = jaccard(full, s.full);
          if (score >= NEAR_DUPLICATE_THRESHOLD) {
            return {
              ok: false,
              reason: "near-duplicate",
              detail: `Setup quasi identique à une vanne existante (Jaccard ${score.toFixed(2)}) : « ${rawAmorce(s.raw)} »`,
            };
          }
        }
      }

      const amorce = amorceWords(candidate.content);
      if (amorce.size >= MIN_CONTENT_WORDS) {
        const sameSeries = index.filter((s) => s.isActive && jaccard(amorce, s.amorce) >= SERIES_THRESHOLD);
        if (sameSeries.length >= MAX_ACTIVE_PER_AMORCE) {
          return {
            ok: false,
            reason: "series-cap",
            detail: `Amorce déjà utilisée par ${sameSeries.length} vannes actives (max ${MAX_ACTIVE_PER_AMORCE}) : « ${rawAmorce(sameSeries[0].raw)} »`,
          };
        }
      }

      return { ok: true };
    },
  };
}
