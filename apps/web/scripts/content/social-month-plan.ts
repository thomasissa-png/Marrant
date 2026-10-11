/**
 * Planification mensuelle des posts sociaux (logique pure, sans base ni réseau).
 * Utilisé par scripts/content/prepare-social-month.ts.
 *
 * s15 : le lot de relance v5 (grille X 5 / Instagram 5 / LinkedIn 2, R1 à R6, UTM v5)
 * est construit par `social-lot-v5.ts`, qui réutilise les outils de ce fichier
 * (heures de Paris, PRNG, `lienUtmV5`, `citerLigne`). `buildPlan` (v2) reste inchangé.
 *
 * Cadence PARAMÉTRABLE (`PlanInput.cadence`) ; défaut = stratégie v2
 * (docs/social/strategie-relance-v2.md §1, choix fondateur du 05/10 : relance des
 * 3 réseaux, consignes du 01/10 annulées). Une v3 n'a qu'à fournir sa cadence.
 *  - X 12:30 : lun. relais article, mar. vanne, mer. vanne + quiz, jeu. relais, ven. vanne ;
 *  - Instagram 18:30 : lun. relais, mar. vanne, mer. carrousel décryptage (préparé à
 *    part, non automatisé), jeu. relais, ven. vanne ;
 *  - LinkedIn 08:15 : mar. et jeu. relais d'article à angle bureau, sinon vanne de
 *    bureau ; jamais 2 relais la même semaine ; lien en premier commentaire.
 * Toujours : aucune génération IA, texte = la vanne mot pour mot, jamais deux fois
 * la même vanne sur un réseau dans le mois, pas de vanne déjà vue la même semaine
 * (vanne du jour ou autre réseau) sur Instagram et LinkedIn.
 */
import { checkPost, type PreparedPlatform } from "./social-controls";

export interface CatalogueJoke {
  id: string;
  setup: string;
  punchline: string;
  isActive: boolean;
  verdict: string | null;
  /** Catégorie Joke (BOULOT = vanne de bureau pour LinkedIn). */
  category?: string | null;
}
/** Article publié à cette date (lundi ou jeudi : relayé). */
export interface MondayArticle { slug: string; title: string; date: string }
export type RegleJour = "RELAIS_OU_VANNE" | "VANNE" | "VANNE_QUIZ" | "RELAIS_BUREAU_OU_VANNE" | "MANUEL";
export interface CadenceReseau { h: number; m: number; jours: Partial<Record<number, RegleJour>> }
export type Cadence = Partial<Record<PreparedPlatform, CadenceReseau>>;

/** Cadence de la stratégie v2 (12 posts / semaine). Jours : 0 = dimanche … 6 = samedi. */
export const CADENCE_V2: Cadence = {
  TWITTER: { h: 12, m: 30, jours: { 1: "RELAIS_OU_VANNE", 2: "VANNE", 3: "VANNE_QUIZ", 4: "RELAIS_OU_VANNE", 5: "VANNE" } },
  INSTAGRAM: { h: 18, m: 30, jours: { 1: "RELAIS_OU_VANNE", 2: "VANNE", 3: "MANUEL", 4: "RELAIS_OU_VANNE", 5: "VANNE" } },
  LINKEDIN: { h: 8, m: 15, jours: { 2: "RELAIS_BUREAU_OU_VANNE", 4: "RELAIS_BUREAU_OU_VANNE" } },
};

export interface PlanInput {
  month: string; // AAAA-MM
  from: string; // AAAA-MM-JJ
  daily: Map<string, CatalogueJoke>; // vanne du jour par date (semaines complètes)
  pool: CatalogueJoke[]; // vannes isActive + copyVerdict GARDER
  articles: MondayArticle[];
  alreadyUsed: Array<{ platform: PreparedPlatform; sourceId: string }>;
  seed?: string;
  siteUrl?: string;
  cadence?: Cadence;
}
export type PostKind = "VANNE_DU_JOUR" | "VANNE" | "VANNE_QUIZ" | "ARTICLE";
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
  link: string | null; // lien UTM (X : dans le texte ; Instagram : bio /liens ; LinkedIn : 1er commentaire)
  /** LinkedIn : lien publié en premier commentaire (jamais dans le corps). */
  firstComment: string | null;
  note: string | null;
}
export interface PlanResult { posts: PlannedPost[]; warnings: string[]; errors: string[] }

/** Créneaux de la cadence par défaut (compatibilité). */
export const SLOTS_PARIS: Record<PreparedPlatform, { h: number; m: number }> = {
  TWITTER: { h: 12, m: 30 },
  INSTAGRAM: { h: 18, m: 30 },
  LINKEDIN: { h: 8, m: 15 },
};
export const IG_BRAND_LINE = "deviens-marrant.fr";
export const IG_ARTICLE_LINE = "Lien en bio.";
export const LI_ARTICLE_LINE = "Lien en commentaire.";
/** Ligne quiz du mercredi sur X (stratégie v2 §2, mot pour mot). */
export const QUIZ_LINE = "Le quiz « quel type d'humour es-tu ? » prend environ 2 minutes, sans inscription :";
/** Amorce LinkedIn visible avant « voir plus ». */
export const LINKEDIN_AMORCE_MAX = 140;
export const UTM_SOURCE: Record<PreparedPlatform, string> = { TWITTER: "x", INSTAGRAM: "instagram", LINKEDIN: "linkedin" };
const JOUR_UTM = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

/** Angle bureau d'un article (LinkedIn) : mots du slug ou du titre. */
const BUREAU = /bureau|boulot|travail|coll[eè]gue|r[eé]union|t[eé]l[eé]travail|visio|entretien|pot-de-depart|pot de départ|manager|open.?space/i;
export function estAngleBureau(a: MondayArticle): boolean {
  return BUREAU.test(a.slug) || BUREAU.test(a.title);
}

export function utmLink(siteUrl: string, slug: string, platform: PreparedPlatform, month: string, content?: string): string {
  const base = siteUrl.replace(/\/$/, "");
  const c = content ? `&utm_content=${content}` : "";
  return `${base}/blog/${slug}?utm_source=${UTM_SOURCE[platform]}&utm_medium=social&utm_campaign=${month}${c}`;
}

/**
 * Lien UTM v5 (§2) : `utm_source=x|instagram|linkedin&utm_medium=social&utm_campaign=AAAA-MM`
 * (mois du post) et `utm_content` selon le type (lundi, jeudi, quiz, saison, relais).
 */
export function lienUtmV5(siteUrl: string, chemin: string, platform: PreparedPlatform, date: string, content?: string): string {
  const base = `${siteUrl.replace(/\/$/, "")}${chemin}`;
  const c = content ? `&utm_content=${content}` : "";
  return `${base}?utm_source=${UTM_SOURCE[platform]}&utm_medium=social&utm_campaign=${date.slice(0, 7)}${c}`;
}

/** Espace insécable des guillemets français dans le texte des posts (poids 1 sur X). */
export const NBSP = " ";

/**
 * R6 (v5 §10) : une ligne de vanne citée entre « », une paire par ligne ; les « »
 * intérieurs deviennent “ ” (comme `citer` des cartes, qui utilise l'espace fine).
 */
export function citerLigne(ligne: string): string {
  const t = ligne.replace(/\s*\n\s*/g, " ").trim().replace(/«\s*/g, "“").replace(/\s*»/g, "”");
  return `«${NBSP}${t}${NBSP}»`;
}

/** Vanne publiée : chaque ligne citée si elle est à la 1re personne (R6), une ligne par ligne du catalogue. */
export function vanneR6(lignes: string[], premierePersonne: boolean): string {
  return lignes.map((l) => (premierePersonne ? citerLigne(l) : l.replace(/\s*\n\s*/g, " ").trim())).join("\n");
}

export function quizLink(siteUrl: string, month: string): string {
  return `${siteUrl.replace(/\/$/, "")}/quiz-humour?utm_source=x&utm_medium=social&utm_campaign=${month}&utm_content=quiz`;
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

function jokePost(platform: PreparedPlatform, j: CatalogueJoke, suffix = ""): { text: string; errors: string[] } {
  const quoted = vanneText(j);
  const text = platform === "INSTAGRAM" ? `${quoted}\n${IG_BRAND_LINE}` : `${quoted}${suffix}`;
  const errors = checkPost({ platform, text, quoted, cardText: platform === "INSTAGRAM" ? quoted : undefined });
  if (platform === "LINKEDIN" && j.setup.trim().length > LINKEDIN_AMORCE_MAX) {
    errors.push(`amorce trop longue pour LinkedIn (${j.setup.trim().length} > ${LINKEDIN_AMORCE_MAX}, coupée par « voir plus »)`);
  }
  return { text, errors };
}

/** Construit le plan du mois. Aucune écriture : le résultat est relu (dry-run) avant `--write`. */
export function buildPlan(input: PlanInput): PlanResult {
  const siteUrl = input.siteUrl ?? "https://deviens-marrant.fr";
  const cadence = input.cadence ?? CADENCE_V2;
  const rnd = seededRandom(input.seed ?? input.month);
  const posts: PlannedPost[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];
  const used: Record<PreparedPlatform, Set<string>> = { TWITTER: new Set(), INSTAGRAM: new Set(), LINKEDIN: new Set() };
  for (const u of input.alreadyUsed) used[u.platform]?.add(u.sourceId);
  const poolById = new Map(input.pool.map((j) => [j.id, j]));
  // Ordre de mélange fixe (X, puis Instagram, puis LinkedIn) : ajouter LinkedIn
  // ne change pas les tirages X et Instagram d'une même graine.
  const shuffled: Record<PreparedPlatform, CatalogueJoke[]> = {
    TWITTER: shuffle(input.pool, rnd),
    INSTAGRAM: shuffle(input.pool, rnd),
    LINKEDIN: [],
  };
  const bureau = input.pool.filter((j) => j.category === "BOULOT");
  shuffled.LINKEDIN = [...shuffle(bureau, rnd), ...shuffle(input.pool.filter((j) => j.category !== "BOULOT"), rnd)];
  const seenByWeek = new Map<string, Set<string>>(); // vannes déjà postées cette semaine (tous réseaux)
  const liRelaysByWeek = new Map<string, number>();
  const articleByDate = new Map(input.articles.map((a) => [a.date, a]));

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
  const markSeen = (date: string, id: string) => {
    const set = seenByWeek.get(mondayOf(date)) ?? new Set<string>();
    set.add(id);
    seenByWeek.set(mondayOf(date), set);
  };

  const pickFromPool = (platform: PreparedPlatform, exclude: Set<string>, suffix = ""): { j: CatalogueJoke; text: string } | null => {
    for (const j of shuffled[platform]) {
      if (used[platform].has(j.id) || exclude.has(j.id)) continue;
      const { text, errors: errs } = jokePost(platform, j, suffix);
      if (errs.length === 0) return { j, text };
    }
    return null;
  };

  // Passe 1 : X (vanne du jour en priorité), puis Instagram, puis LinkedIn
  // (excluent les vannes déjà vues dans la semaine).
  for (const platform of ["TWITTER", "INSTAGRAM", "LINKEDIN"] as PreparedPlatform[]) {
    const reseau = cadence[platform];
    if (!reseau) continue;
    for (const date of days) {
      const regle = reseau.jours[weekday(date)];
      if (!regle) continue;
      if (regle === "MANUEL") {
        warnings.push(`${date} ${platform} : carrousel décryptage à préparer à part (non automatisé).`);
        continue;
      }
      const base = {
        date,
        scheduledAt: parisToUtc(date, reseau.h, reseau.m).toISOString(),
        parisTime: `${String(reseau.h).padStart(2, "0")}:${String(reseau.m).padStart(2, "0")}`,
        platform,
        firstComment: null as string | null,
      };
      const week = mondayOf(date);

      // ── Relais d'article ──
      let article: MondayArticle | undefined;
      if (regle === "RELAIS_OU_VANNE") {
        article = articleByDate.get(date);
        if (!article && weekday(date) === 1) warnings.push(`${date} ${platform} : aucun article programmé ce lundi, vanne à la place.`);
      } else if (regle === "RELAIS_BUREAU_OU_VANNE") {
        // Mardi : article du lundi ; jeudi : article du jour. Angle bureau, 1 relais / semaine max.
        const candidat = articleByDate.get(weekday(date) === 2 ? addDays(date, -1) : date);
        if (candidat && estAngleBureau(candidat) && (liRelaysByWeek.get(week) ?? 0) === 0) article = candidat;
      }
      if (article) {
        const title = article.title.trim();
        const content = platform === "LINKEDIN" ? "commentaire" : JOUR_UTM[weekday(date)];
        const link = utmLink(siteUrl, article.slug, platform, input.month, content);
        const text = platform === "TWITTER" ? `${title}\n${link}` : platform === "INSTAGRAM" ? `${title}\n${IG_ARTICLE_LINE}` : `${title}\n${LI_ARTICLE_LINE}`;
        const errs = checkPost({ platform, text, quoted: title, cardText: platform === "INSTAGRAM" ? title : undefined });
        if (errs.length > 0) errors.push(`${date} ${platform} article « ${article.slug} » refusé : ${errs.join(", ")}`);
        if (platform === "LINKEDIN") liRelaysByWeek.set(week, (liRelaysByWeek.get(week) ?? 0) + 1);
        posts.push({ ...base, kind: "ARTICLE", text, card: platform === "INSTAGRAM" ? { setup: "", punchline: title } : null,
          sourceType: "BLOG", sourceId: article.slug, link, firstComment: platform === "LINKEDIN" ? link : null, note: null });
        continue;
      }

      // ── Vanne ──
      let note: string | null = null;
      let chosen: { j: CatalogueJoke; text: string } | null = null;
      let kind: PostKind = regle === "VANNE_QUIZ" ? "VANNE_QUIZ" : "VANNE";
      const suffix = regle === "VANNE_QUIZ" ? `\n\n${QUIZ_LINE} ${quizLink(siteUrl, input.month)}` : "";
      if (platform === "TWITTER") {
        const daily = input.daily.get(date);
        if (daily) {
          const validated = isValidated(daily) ? poolById.get(daily.id) ?? daily : undefined;
          const res = validated ? jokePost(platform, validated, suffix) : null;
          if (validated && res && res.errors.length === 0 && !used.TWITTER.has(validated.id)) {
            chosen = { j: validated, text: res.text };
            if (kind === "VANNE") kind = "VANNE_DU_JOUR";
          } else {
            const why = !validated ? "non validée (isActive/GARDER)" : used.TWITTER.has(daily.id) ? "déjà postée sur X ce mois" : res!.errors.join(", ");
            note = `Vanne du jour ${daily.id} écartée : ${why}.`;
          }
        } else {
          note = "Pas de vanne du jour programmée : vanne du catalogue.";
        }
        if (!chosen) chosen = pickFromPool(platform, weekDailyIds(date), suffix);
      } else {
        const exclude = new Set([...weekDailyIds(date), ...(seenByWeek.get(week) ?? [])]);
        chosen = pickFromPool(platform, exclude);
        if (chosen && platform === "LINKEDIN" && chosen.j.category !== "BOULOT") {
          note = "Plus de vanne de bureau disponible : vanne du catalogue.";
        }
      }
      if (!chosen) {
        errors.push(`${date} ${platform} : aucune vanne validée ne passe les contrôles.`);
        continue;
      }
      used[platform].add(chosen.j.id);
      markSeen(date, chosen.j.id);
      posts.push({ ...base, kind, text: chosen.text,
        card: platform === "INSTAGRAM" ? { setup: chosen.j.setup.trim(), punchline: chosen.j.punchline.trim() } : null,
        sourceType: "JOKE", sourceId: chosen.j.id, link: regle === "VANNE_QUIZ" ? quizLink(siteUrl, input.month) : null, note });
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
