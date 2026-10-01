/**
 * Planification mensuelle des posts sociaux (logique pure, sans base ni réseau).
 * Utilisé par scripts/content/prepare-social-month.ts. Décisions Thomas du 01/10/2026 :
 *  - X : 5 posts/semaine (lun article, mar-ven vanne du jour en priorité) ;
 *  - Instagram : 4 posts/semaine (lun article, mar/mer/ven carte « amorce // chute ») ;
 *  - LinkedIn en pause, aucune génération IA, texte = la vanne mot pour mot ;
 *  - jamais deux fois la même vanne sur une plateforme dans le mois ;
 *  - sur Instagram, jamais une vanne qui est vanne du jour (ou postée sur X) la même semaine.
 */
import { checkPost, type PreparedPlatform } from "./social-controls";

export interface CatalogueJoke {
  id: string;
  setup: string;
  punchline: string;
  isActive: boolean;
  verdict: string | null;
}
export interface MondayArticle { slug: string; title: string; date: string }
export interface PlanInput {
  month: string; // AAAA-MM
  from: string; // AAAA-MM-JJ
  daily: Map<string, CatalogueJoke>; // vanne du jour par date (semaines complètes)
  pool: CatalogueJoke[]; // vannes isActive + copyVerdict GARDER
  articles: MondayArticle[];
  alreadyUsed: Array<{ platform: PreparedPlatform; sourceId: string }>;
  seed?: string;
  siteUrl?: string;
}
export type PostKind = "VANNE_DU_JOUR" | "VANNE" | "ARTICLE";
export interface PlannedPost {
  date: string;
  scheduledAt: string; // ISO UTC
  parisTime: string; // HH:MM
  platform: PreparedPlatform;
  kind: PostKind;
  text: string;
  card: { setup: string; punchline: string } | null;
  sourceType: "JOKE" | "BLOG";
  sourceId: string;
  link: string | null; // lien UTM (dans le texte sur X ; sur Instagram, la bio pointe une fois pour toutes vers /liens)
  note: string | null;
}
export interface PlanResult { posts: PlannedPost[]; warnings: string[]; errors: string[] }

/** Créneaux fixes (heure de Paris) : jamais deux posts à moins de 3 h. */
export const SLOTS_PARIS: Record<PreparedPlatform, { h: number; m: number }> = {
  TWITTER: { h: 12, m: 30 },
  INSTAGRAM: { h: 18, m: 30 },
};
/** Jours de publication (0 = dimanche … 6 = samedi). Lundi = article. */
export const WEEK_PATTERN: Record<PreparedPlatform, number[]> = {
  TWITTER: [1, 2, 3, 4, 5],
  INSTAGRAM: [1, 2, 3, 5],
};
export const IG_BRAND_LINE = "deviens-marrant.fr";
export const IG_ARTICLE_LINE = "Lien en bio.";
export const UTM_SOURCE: Record<PreparedPlatform, string> = { TWITTER: "x", INSTAGRAM: "instagram" };

export function utmLink(siteUrl: string, slug: string, platform: PreparedPlatform, month: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/blog/${slug}?utm_source=${UTM_SOURCE[platform]}&utm_medium=social&utm_campaign=${month}`;
}

/** Convertit une heure de Paris en instant UTC (gère l'heure d'été). */
export function parisToUtc(date: string, h: number, m: number): Date {
  const [y, mo, d] = date.split("-").map(Number);
  const guess = Date.UTC(y, mo - 1, d, h, m);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date(guess));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const wall = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  return new Date(guess - (wall - guess));
}

export function addDays(date: string, n: number): string {
  const t = new Date(`${date}T12:00:00Z`);
  t.setUTCDate(t.getUTCDate() + n);
  return t.toISOString().slice(0, 10);
}
export function weekday(date: string): number {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}
export function mondayOf(date: string): string {
  return addDays(date, -((weekday(date) + 6) % 7));
}
export function monthEnd(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0, 12)).toISOString().slice(0, 10);
}

/** PRNG déterministe (même mois + même graine = même plan). */
export function seededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function shuffle<T>(items: T[], rnd: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Texte de la vanne mot pour mot : amorce, saut de ligne, chute. */
export function vanneText(j: CatalogueJoke): string {
  return `${j.setup.trim()}\n${j.punchline.trim()}`;
}

function isValidated(j: CatalogueJoke | undefined): j is CatalogueJoke {
  return !!j && j.isActive && j.verdict === "GARDER";
}

function jokePost(platform: PreparedPlatform, j: CatalogueJoke): { text: string; errors: string[] } {
  const quoted = vanneText(j);
  const text = platform === "INSTAGRAM" ? `${quoted}\n${IG_BRAND_LINE}` : quoted;
  const errors = checkPost({ platform, text, quoted, cardText: platform === "INSTAGRAM" ? quoted : undefined });
  return { text, errors };
}

/** Construit le plan du mois. Aucune écriture : le résultat est relu (dry-run) avant `--write`. */
export function buildPlan(input: PlanInput): PlanResult {
  const siteUrl = input.siteUrl ?? "https://deviens-marrant.fr";
  const rnd = seededRandom(input.seed ?? input.month);
  const posts: PlannedPost[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];
  const used: Record<PreparedPlatform, Set<string>> = { TWITTER: new Set(), INSTAGRAM: new Set() };
  for (const u of input.alreadyUsed) used[u.platform].add(u.sourceId);
  const poolById = new Map(input.pool.map((j) => [j.id, j]));
  const shuffled: Record<PreparedPlatform, CatalogueJoke[]> = {
    TWITTER: shuffle(input.pool, rnd),
    INSTAGRAM: shuffle(input.pool, rnd),
  };
  const xByWeek = new Map<string, Set<string>>();
  const articleByMonday = new Map(input.articles.filter((a) => weekday(a.date) === 1).map((a) => [a.date, a]));

  const days: string[] = [];
  for (let d = input.from; d <= monthEnd(input.month); d = addDays(d, 1)) days.push(d);

  const weekDailyIds = (date: string): Set<string> => {
    const monday = mondayOf(date);
    const ids = new Set<string>();
    for (let i = 0; i < 7; i++) {
      const j = input.daily.get(addDays(monday, i));
      if (j) ids.add(j.id);
    }
    return ids;
  };

  const pickFromPool = (platform: PreparedPlatform, exclude: Set<string>): { j: CatalogueJoke; text: string } | null => {
    for (const j of shuffled[platform]) {
      if (used[platform].has(j.id) || exclude.has(j.id)) continue;
      const { text, errors: errs } = jokePost(platform, j);
      if (errs.length === 0) return { j, text };
    }
    return null;
  };

  // Passe 1 : X (vanne du jour en priorité), passe 2 : Instagram (exclut la semaine).
  for (const platform of ["TWITTER", "INSTAGRAM"] as PreparedPlatform[]) {
    for (const date of days) {
      if (!WEEK_PATTERN[platform].includes(weekday(date))) continue;
      const slot = SLOTS_PARIS[platform];
      const base = {
        date,
        scheduledAt: parisToUtc(date, slot.h, slot.m).toISOString(),
        parisTime: `${String(slot.h).padStart(2, "0")}:${String(slot.m).padStart(2, "0")}`,
        platform,
      };
      const article = weekday(date) === 1 ? articleByMonday.get(date) : undefined;
      if (weekday(date) === 1 && !article) warnings.push(`${date} ${platform} : aucun article programmé ce lundi, vanne à la place.`);
      if (article) {
        const link = utmLink(siteUrl, article.slug, platform, input.month);
        const title = article.title.trim();
        const text = platform === "TWITTER" ? `${title}\n${link}` : `${title}\n${IG_ARTICLE_LINE}`;
        const errs = checkPost({ platform, text, quoted: title, cardText: platform === "INSTAGRAM" ? title : undefined });
        if (errs.length > 0) errors.push(`${date} ${platform} article « ${article.slug} » refusé : ${errs.join(", ")}`);
        posts.push({ ...base, kind: "ARTICLE", text, card: platform === "INSTAGRAM" ? { setup: "", punchline: title } : null,
          sourceType: "BLOG", sourceId: article.slug, link, note: null });
        continue;
      }
      let note: string | null = null;
      let chosen: { j: CatalogueJoke; text: string } | null = null;
      let kind: PostKind = "VANNE";
      const week = mondayOf(date);
      if (platform === "TWITTER") {
        const daily = input.daily.get(date);
        if (daily) {
          const validated = isValidated(daily) ? poolById.get(daily.id) ?? daily : undefined;
          const res = validated ? jokePost(platform, validated) : null;
          if (validated && res && res.errors.length === 0 && !used.TWITTER.has(validated.id)) {
            chosen = { j: validated, text: res.text };
            kind = "VANNE_DU_JOUR";
          } else {
            const why = !validated ? "non validée (isActive/GARDER)" : used.TWITTER.has(daily.id) ? "déjà postée sur X ce mois" : res!.errors.join(", ");
            note = `Vanne du jour ${daily.id} écartée : ${why}.`;
          }
        } else {
          note = "Pas de vanne du jour programmée : vanne du catalogue.";
        }
        if (!chosen) chosen = pickFromPool(platform, weekDailyIds(date));
        if (chosen) {
          const set = xByWeek.get(week) ?? new Set<string>();
          set.add(chosen.j.id);
          xByWeek.set(week, set);
        }
      } else {
        const exclude = new Set([...weekDailyIds(date), ...(xByWeek.get(week) ?? [])]);
        chosen = pickFromPool(platform, exclude);
      }
      if (!chosen) {
        errors.push(`${date} ${platform} : aucune vanne validée ne passe les contrôles.`);
        continue;
      }
      used[platform].add(chosen.j.id);
      posts.push({ ...base, kind, text: chosen.text,
        card: platform === "INSTAGRAM" ? { setup: chosen.j.setup.trim(), punchline: chosen.j.punchline.trim() } : null,
        sourceType: "JOKE", sourceId: chosen.j.id, link: null, note });
    }
  }
  posts.sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
  return { posts, warnings, errors };
}

/** Tirage déterministe de n posts pour la validation de Thomas. */
export function drawSample(posts: PlannedPost[], n: number, seed: string): PlannedPost[] {
  return shuffle(posts, seededRandom(`${seed}-echantillon`)).slice(0, n)
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
}
