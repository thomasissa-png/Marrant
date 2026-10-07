/**
 * Lot de relance v5 (s15) : X 5, Instagram 5, LinkedIn 2 par semaine, du J0 au
 * 03/01/2027. Logique pure (aucune base, aucune IA), déterministe pour une graine.
 * Règles : `docs/social/strategie-relance-v5.md` (§1 grille, stock, anti-répétition
 * 90 jours tous réseaux, « pain » 30 jours, Noël ; §2 UTM ; §3 calendrier ; §8 cartes ;
 * §10 R1 à R6). Données figées : social-lot-v5-config.ts et social-lot-v5-fixes.ts.
 */
import { createHash } from "node:crypto";
import { checkPost, nombreDePhrases, premierePersonne, type PreparedPlatform } from "./social-controls";
import { extraireLignes, normaliser, nombreDuTitre, type LigneArticle } from "./social-article-lines";
import { addDays, estAngleBureau, lienUtmV5, mondayOf, parisToUtc, seededRandom, shuffle, vanneR6, weekday, type CatalogueJoke } from "./social-month-plan";
import * as C from "./social-lot-v5-config";
import { CARROUSELS_CITATION, FIXES, REFONTE_17_12, RELAIS_FORCES, RESERVEES_CARROUSEL, type Fixe, type TypePost } from "./social-lot-v5-fixes";
import { LEGENDES_IG, ecartsLegende, tournure } from "./social-lot-v5-legendes";
import { VARIANTE_IMAGE, vanneLinkedInImage } from "../../src/lib/social/carte-linkedin";
import { heureDuCreneau, type BrasHeure } from "../../src/lib/social/heure-test";

export interface ArticleLot {
  slug: string; title: string; category: string; date: string; content: string;
  /** Article en base pas encore visible (programmé) : ses relais reçoivent un repli en réserve (garde articleSlug). */
  aGarder?: boolean;
}
export interface LotInput {
  pool: CatalogueJoke[];
  articles: ArticleLot[];
  /**
   * Vannes postées ou programmées avant le lot (anti-répétition 90 jours) ; `platform`
   * sert à la règle « retour à 90 jours sur un autre réseau que la 1re diffusion » (plan v3 §2).
   */
  recents: PostEnBase[];
  /** Note à l'aveugle par vanne (moyenne des 2 relecteurs) : paires du test LinkedIn texte / image. */
  notes?: Record<string, number>;
  siteUrl?: string;
  seed?: string;
  /** Identifiant du lot (défaut « relance-s15 ») : graine par défaut et identifiants des posts. */
  lot?: string;
  /** Bornes du lot, dates de Paris incluses (défaut : 12/10/2026 au 03/01/2027). */
  debut?: string;
  fin?: string;
  /**
   * `--pool` : vannes autorisées pour les tirages, relais et décryptages (id catalogue ou
   * `slug#rang`), ordonnées des meilleures aux moins bonnes. Les posts fixes restent imposés.
   */
  autorisees?: string[];
  /** Légendes Instagram par vanne (« À envoyer à... ») ; défaut : `LEGENDES_IG` (social-lot-v5-legendes.ts). */
  legendes?: Record<string, string>;
}
/** Post déjà en base avant le lot. `texte` (contenu + cartes) : contrôle « pain » sur la base. */
export interface PostEnBase { date: string; sourceId: string; platform?: string; texte?: string }
export type Origine = "CATALOGUE" | "ARTICLE" | "VALIDE" | "FORMULE_V5" | "NEUF";
export type Variante = "image" | "texte";
/** Test LinkedIn texte / image : bras par post et paires formées. */
export interface CompteVariantes { eligibles: number; image: number; texte: number; paires: number; pairesMemeNote: number }
export interface Segment { texte: string; origine: Origine }
export interface LotPost {
  id: string;
  cle: string | null;
  date: string;
  heure: string;
  scheduledAt: string;
  platform: PreparedPlatform;
  type: TypePost;
  content: string;
  cartes: string[];
  imageUrls: string[];
  lien: string | null;
  sourceType: "JOKE" | "BLOG" | "ORIGINAL";
  sourceId: string;
  /** Clés anti-répétition (id catalogue ou `slug#rang`). */
  vannes: string[];
  persona: "YANIS" | "SOPHIE" | "MARC";
  /** Slug de l'article relayé (RELAIS, PIVOT) : garde de publication `articleSlug`. */
  article: string | null;
  /** Relais : id du repli en réserve (vanne du même thème, sans lien). */
  repli: string | null;
  /** Repli : id du relais qu'il remplace si l'article n'est pas publié à l'heure. */
  repliDe: string | null;
  /** Post daté (pivot, saison) : jamais rattrapé à la reprise. */
  datee: boolean;
  origine: "VALIDE" | "V5" | "TIRAGE";
  segments: Segment[];
  note: string | null;
  /** Lignes de la vanne (amorce, chute) : éligibilité à la carte LinkedIn. */
  lignes?: string[];
  /** Test LinkedIn texte / image (dès LI_TEST_IMAGE_DES) : bras du post ; absent si non éligible. */
  variante?: Variante;
  /** Test d'heure alterné par jour (mesure §7 c) : bras du créneau ; absent hors test. */
  bras?: BrasHeure;
}
export interface LotResult { posts: LotPost[]; replis: LotPost[]; warnings: string[]; errors: string[]; stockEligible: number; variantes: CompteVariantes }

interface Vanne {
  cle: string;
  lignes: string[];
  cartes: [string, string] | null;
  categorie: string | null;
  origine: "CATALOGUE" | "ARTICLE";
  jokeId?: string;
  article?: LigneArticle;
}

const PLATEFORMES: PreparedPlatform[] = ["TWITTER", "INSTAGRAM", "LINKEDIN"];
const FEMININ = new Set(["vannes", "réponses", "idées", "blagues", "accroches", "pistes", "règles"]);
const mots = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;
const texteDe = (v: Vanne) => v.lignes.join(" ");
const jours = (a: string, b: string) => Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86_400_000);

export function idDuPost(platform: PreparedPlatform, date: string, lot: string = C.LOT_ID): string {
  return `c${createHash("sha256").update(`${lot}|${platform}|${date}`).digest("hex").slice(0, 24)}`;
}

/** Coupe une ligne unique en deux cartes : tout sauf la dernière phrase, puis la dernière. */
export function deuxCartes(lignes: string[]): [string, string] | null {
  if (lignes.length === 2) return [lignes[0], lignes[1]];
  if (lignes.length !== 1) return null;
  const phrases = lignes[0].match(/[^.!?…]+[.!?…]+[»”"]?\s*|[^.!?…]+$/gu)?.map((p) => p.trim()).filter(Boolean) ?? [];
  // La chute commence à la dernière phrase de plus de 3 mots (« Le mien sera long. Joyeux anniversaire. »).
  let k = phrases.length - 1;
  while (k > 0 && mots(phrases[k]) <= 3) k--;
  if (k < 1) return null;
  return [phrases.slice(0, k).join(" "), phrases.slice(k).join(" ")];
}

/** Nombre d'images Instagram : vanne 2, décryptage 4 (5 parties en base). */
export function nombreDeCartes(parties: string[]): number {
  return parties.length === 5 ? 4 : parties.length;
}

function deJoke(j: CatalogueJoke): Vanne {
  return { cle: j.id, lignes: [j.setup.trim(), j.punchline.trim()], cartes: [j.setup.trim(), j.punchline.trim()],
    categorie: j.category ?? null, origine: "CATALOGUE", jokeId: j.id };
}

export function buildLotV5(input: LotInput): LotResult {
  const siteUrl = (input.siteUrl ?? "https://deviens-marrant.fr").replace(/\/$/, "");
  const lotId = input.lot ?? C.LOT_ID;
  const graine = input.seed ?? lotId;
  const debut = input.debut ?? C.LOT_DEBUT;
  const fin = input.fin ?? C.LOT_FIN;
  const rnd = seededRandom(graine);
  /** Rang dans le pool (0 = meilleure) ; null = pas de --pool. */
  const rang = input.autorisees ? new Map(input.autorisees.map((id, i) => [id, i])) : null;
  const parRang = <T extends { cle: string }>(vs: T[]): T[] => (rang ? [...vs].sort((a, b) => (rang.get(a.cle) ?? Infinity) - (rang.get(b.cle) ?? Infinity)) : vs);
  const warnings: string[] = [];
  const errors: string[] = [];
  const posts: LotPost[] = [];
  const replis: LotPost[] = [];
  const poolById = new Map(input.pool.map((j) => [j.id, j]));
  const legendes = input.legendes ?? LEGENDES_IG;
  /** Légende Instagram de la vanne (jamais le pied « deviens-marrant.fr », [CHOIX UTILISATEUR] 06/10). Relais : + renvoi. */
  const legendeDe = (v: Vanne | null, renvoiIg?: string): string | undefined => {
    const l = v ? legendes[v.cle] : undefined;
    if (renvoiIg === undefined) return l;
    return l ? `${l} ${renvoiIg}` : renvoiIg;
  };
  const articleParDate = new Map(input.articles.map((a) => [a.date, a]));
  const articleParSlug = new Map(input.articles.map((a) => [a.slug, a]));
  const lignesParSlug = new Map(input.articles.map((a) => [a.slug, extraireLignes(a.slug, a.content, input.pool)]));
  for (const [slug, ls] of lignesParSlug) for (const l of ls) if (l.coupee) warnings.push(`Article ${slug}, vanne n°${l.rang} : texte collé à la suite dans le contenu en base (coupé ici, à corriger dans l'article).`);

  // ── Registre anti-répétition (clé et texte normalisé) ──
  const utilise = new Map<string, string>(); // clé -> date
  const textes = new Set<string>();
  for (const r of input.recents) if (!utilise.has(r.sourceId) || r.date > utilise.get(r.sourceId)!) utilise.set(r.sourceId, r.date);
  /** Réseau de 1re diffusion de chaque vanne (retour à 90 jours sur un autre réseau, sauf pénurie). */
  const premier = new Map<string, { date: string; pf: string }>();
  for (const r of input.recents) {
    const p = premier.get(r.sourceId);
    if (r.platform && (!p || r.date < p.date)) premier.set(r.sourceId, { date: r.date, pf: r.platform });
  }
  const fixesVannes = new Set<string>();

  const vanneDeLigne = (l: LigneArticle): Vanne => {
    const j = l.catalogueId ? poolById.get(l.catalogueId) : undefined;
    if (j) return { ...deJoke(j), origine: "CATALOGUE", article: l };
    return { cle: `${l.slug}#${l.rang}`, lignes: l.lignes, cartes: deuxCartes(l.lignes), categorie: null, origine: "ARTICLE", article: l };
  };
  // Fixes hors des bornes du lot : leurs vannes restent réservées, sans erreur bloquante.
  const vanneDuFixe = (f: Fixe, signaler = true): Vanne | null => {
    const v = f.vanne;
    if (!v) return null;
    const err = (m: string) => { if (signaler) errors.push(m); };
    if (v.jokeId) {
      const j = poolById.get(v.jokeId);
      if (!j) { err(`${f.date} ${f.cle} : vanne ${v.jokeId} absente du catalogue validé (isActive + GARDER).`); return null; }
      return deJoke(j);
    }
    const slug = v.article?.slug ?? v.articleTexte?.slug ?? "";
    const ls = lignesParSlug.get(slug) ?? [];
    const l = v.article ? ls.find((x) => x.rang === v.article!.rang)
      : ls.find((x) => normaliser(x.lignes.join(" ")) === normaliser(v.articleTexte!.texte));
    if (l) return vanneDeLigne(l);
    const contenu = articleParSlug.get(slug)?.content ?? "";
    if (v.articleTexte && contenu.includes(v.articleTexte.texte)) {
      return { cle: `${slug}#${normaliser(v.articleTexte.texte).slice(0, 24)}`, lignes: [v.articleTexte.texte],
        cartes: deuxCartes([v.articleTexte.texte]), categorie: null, origine: "ARTICLE" };
    }
    err(`${f.date} ${f.cle} : ligne introuvable mot pour mot dans l'article ${slug}.`);
    return null;
  };
  for (const f of FIXES) { const v = vanneDuFixe(f, f.date >= debut && f.date <= fin); if (v) fixesVannes.add(v.cle); }
  if (rang) {
    const connues = new Set([...input.pool.map((j) => j.id), ...[...lignesParSlug.values()].flat().map((l) => vanneDeLigne(l).cle)]);
    const inconnues = input.autorisees!.filter((id) => !connues.has(id));
    if (inconnues.length) warnings.push(`--pool : ${inconnues.length} identifiant(s) absent(s) du catalogue validé et des articles (${inconnues.slice(0, 5).join(", ")}${inconnues.length > 5 ? "…" : ""}).`);
  }

  const saisonBloque = (texte: string, date: string) => C.SAISONS.some((s) => s.re.test(texte) && (date < s.de || date > s.a));
  const estPain = (v: Vanne) => (v.jokeId ? C.PAIN_IDS.includes(v.jokeId) : false) || C.PAIN_RE.test(texteDe(v));
  /** Vanne utilisable par un tirage ou un relais à cette date (les fixes passent à part). */
  // `relais` : la ligne vient de l'article relayé ce jour-là, sa saison est celle de l'article.
  // `pf` : réseau visé ; une vanne ne revient pas sur le réseau de sa 1re diffusion.
  const libre = (v: Vanne, date: string, relais = false, pf?: PreparedPlatform): boolean => {
    if (rang && !rang.has(v.cle)) return false;
    if (pf && premier.get(v.cle)?.pf === pf) return false;
    if (v.jokeId && (C.SOUS_HUIT.includes(v.jokeId) || C.RESERVEES_NOEL.includes(v.jokeId))) return false;
    // Réservées à un carrousel de décryptage (fiche écrite) : jamais tirées (cycle 8, V028 et V060).
    if (v.jokeId && RESERVEES_CARROUSEL.some((r) => r.jokeId === v.jokeId)) return false;
    if (estPain(v) || (!relais && saisonBloque(texteDe(v), date)) || fixesVannes.has(v.cle)) return false;
    const d = utilise.get(v.cle);
    if (d && Math.abs(jours(d, date)) < C.ANTI_REPETITION_JOURS) return false;
    return !textes.has(normaliser(texteDe(v)));
  };
  const reserver = (v: Vanne, date: string, pf: PreparedPlatform) => {
    utilise.set(v.cle, date);
    textes.add(normaliser(texteDe(v)));
    if (!premier.has(v.cle)) premier.set(v.cle, { date, pf });
  };
  /** Pénurie : la règle « autre réseau » est levée, avec avertissement (plan v3 §2 « sauf pénurie »). */
  const penurie = (v: Vanne | null, pf: PreparedPlatform, date: string): Vanne | null => {
    if (v) warnings.push(`${date} ${pf} : pénurie, vanne ${v.cle} reprise sur son réseau de 1re diffusion (${premier.get(v.cle)?.date}).`);
    return v;
  };

  const stock = input.pool.filter((j) => libre(deJoke(j), debut)).length;
  if (stock < 7) errors.push(`Stock éligible ${stock} sous 7 : lot bloqué (v5 §1).`);

  // Avec --pool : ordre du fichier (les meilleures d'abord), sans mélange.
  const ordonner = (js: CatalogueJoke[]) => (rang ? parRang(js.map((j) => ({ j, cle: j.id }))).map((x) => x.j) : shuffle(js, rnd));
  const melange: Record<PreparedPlatform, CatalogueJoke[]> = {
    TWITTER: ordonner(input.pool), INSTAGRAM: ordonner(input.pool), LINKEDIN: [],
  };
  melange.LINKEDIN = [...ordonner(input.pool.filter((j) => j.category === "BOULOT")), ...ordonner(input.pool.filter((j) => j.category !== "BOULOT"))];

  // ── Construction d'un post ──
  // Heure A (grille v5) ou B (test d'heure alterné par jour, src/lib/social/heure-test.ts).
  const creneau = (pf: PreparedPlatform, date: string) => heureDuCreneau(pf, date);
  const textePost = (pf: PreparedPlatform, v: Vanne | null, marque: string | null, renvoi: string | null, lien: string | null): string => {
    const corps = v ? vanneR6(v.lignes, premierePersonne(texteDe(v))) : (marque ?? "");
    if (!renvoi && !lien) return corps;
    if (pf === "LINKEDIN") return [corps.includes(renvoi ?? "") ? corps : `${corps}${renvoi ? `\n${renvoi}` : ""}`, lien].filter(Boolean).join("\n");
    return `${corps}\n\n${[renvoi, lien].filter(Boolean).join(" ")}`;
  };
  const controler = (p: LotPost) => {
    const errs = checkPost({ platform: p.platform, text: p.content, quoted: "", r6: true, cardText: p.cartes.join("\n") || undefined,
      maxLength: p.platform === "INSTAGRAM" ? 80 : undefined });
    if (p.platform === "INSTAGRAM") {
      p.cartes.slice(0, 2).forEach((c, i) => { if (mots(c) > 25) errs.push(`carte ${i + 1} : ${mots(c)} mots (max 25)`); });
      if (p.cartes.length === 5) {
        if (mots(p.cartes[2]) > 30) errs.push(`carte 3 : ${mots(p.cartes[2])} mots (max 30)`);
        if (mots(`${p.cartes[3]} ${p.cartes[4]}`) > 35) errs.push("carte 4 : plus de 35 mots");
        if (nombreDePhrases(p.cartes[2]) > 1) errs.push("carte 3 : plus d'une phrase (R2)");
      }
    }
    if (p.platform === "LINKEDIN" && p.content.split("\n")[0].length > 140) {
      const msg = "amorce LinkedIn de plus de 140 caractères (coupée par « voir plus » sur mobile)";
      if (p.origine === "VALIDE") warnings.push(`${p.date} LINKEDIN ${p.cle} : ${msg}, texte validé par Thomas conservé.`);
      else errs.push(msg);
    }
    return errs;
  };
  const poster = (date: string, pf: PreparedPlatform, type: TypePost, o: {
    v: Vanne | null; marque?: string; renvoi?: string | null; renvoiOrigine?: Origine; lien?: string | null; legende?: string; legendeOrigine?: Origine;
    cartes?: string[]; cartesOrigine?: Origine; origine: LotPost["origine"]; cle?: string; slug?: string; note?: string | null; valide?: boolean;
    repliDe?: string;
  }): LotPost => {
    const g = creneau(pf, date);
    const id = idDuPost(pf, date, o.repliDe ? `${lotId}-repli` : lotId);
    const lien = o.lien ?? null;
    const content = pf === "INSTAGRAM" ? (o.legende ?? legendeDe(o.v) ?? "") : textePost(pf, o.v, o.marque ?? null, o.renvoi ?? null, lien);
    const cartes = pf === "INSTAGRAM" ? (o.cartes ?? (o.v?.cartes ? [...o.v.cartes] : [])) : [];
    const segV: Origine = o.valide ? "VALIDE" : (o.v?.origine ?? "NEUF");
    const segments: Segment[] = [];
    if (o.v) o.v.lignes.forEach((l) => segments.push({ texte: l, origine: segV }));
    if (o.marque) segments.push({ texte: o.marque, origine: o.valide ? "VALIDE" : "NEUF" });
    if (o.renvoi) segments.push({ texte: o.renvoi, origine: o.valide ? "VALIDE" : (o.renvoiOrigine ?? "FORMULE_V5") });
    if (pf === "INSTAGRAM" && content) segments.push({ texte: content, origine: o.valide ? "VALIDE" : (o.legendeOrigine ?? "FORMULE_V5") });
    if (cartes.length === 5) cartes.slice(2).forEach((c) => segments.push({ texte: c, origine: o.valide ? "VALIDE" : (o.cartesOrigine ?? "ARTICLE") }));
    const persona = pf === "LINKEDIN" ? "SOPHIE" : o.slug && C.ARTICLES_MARC.has(o.slug) ? "MARC" : "YANIS";
    const sourceType = o.v?.jokeId ? "JOKE" : o.v || o.slug ? "BLOG" : "ORIGINAL";
    const sourceId = o.v?.jokeId ?? o.v?.cle ?? o.slug ?? o.cle ?? id;
    const p: LotPost = {
      id, cle: o.cle ?? null, date, heure: `${String(g.h).padStart(2, "0")}:${String(g.m).padStart(2, "0")}`,
      scheduledAt: parisToUtc(date, g.h, g.m).toISOString(), platform: pf, type, content, cartes,
      // Décryptage : 5 parties (amorce, chute, mécanisme, consigne, renvoi) = 4 cartes (carte 4 = consigne + renvoi).
      imageUrls: Array.from({ length: nombreDeCartes(cartes) }, (_, i) => `${siteUrl}/api/social/image?postId=${id}&slide=${i}`),
      lien, sourceType, sourceId, vannes: o.v ? [o.v.cle] : [], persona, origine: o.origine, segments, note: o.note ?? null,
      lignes: o.v ? [...o.v.lignes] : undefined,
      ...(g.bras ? { bras: g.bras } : {}),
      article: (type === "RELAIS" || type === "PIVOT") && o.slug ? o.slug : null,
      repli: null, repliDe: o.repliDe ?? null,
      datee: type === "PIVOT" || C.SAISONS.some((x) => x.re.test(`${content} ${cartes.join(" ")}`)),
    };
    const errs = controler(p);
    // Relais Instagram (sans lien) : seul `[article:<slug>]` déclenche la garde de publication.
    if (pf === "INSTAGRAM" && type === "RELAIS" && !p.article) errs.push("relais Instagram sans article (marqueur [article:] requis par la garde)");
    if (errs.length) errors.push(`${date} ${pf} ${o.cle ?? type}${o.repliDe ? " (repli)" : ""} : ${errs.join(", ")}`);
    (o.repliDe ? replis : posts).push(p);
    return p;
  };

  // ── Renvoi d'un relais (v5 §1) ──
  const renvoi = (a: ArticleLot, pf: PreparedPlatform, depuisArticle: boolean): { texte: string; origine: Origine } => {
    // Nombre du titre, sinon numéro le plus haut des lignes `**N.**` (« Vœux drôles : messages prêts à envoyer »).
    const numeros = [...a.content.matchAll(/^\*\*(\d+)\.\*\* /gm)].map((m) => Number(m[1]));
    const n = nombreDuTitre(a.title) ?? (numeros.length ? Math.max(...numeros) : null);
    const nom = nombreDuTitre(a.title) ? (a.title.match(/\d+\s+([\p{L}]+)/u)?.[1] ?? "") : /messages/i.test(a.title) ? "messages" : "";
    if (a.category === "CATALOGUE" && n && nom) {
      const accord = FEMININ.has(nom) ? "prêtes" : "prêts";
      if (pf === "INSTAGRAM") return { texte: depuisArticle ? `Les ${n - 1} autres ${nom} : lien en bio.` : `Les ${n} ${nom} : lien en bio.`, origine: "FORMULE_V5" };
      return { texte: depuisArticle ? `Les ${n - 1} autres sont ${accord} à copier :` : `Les ${n} ${nom} de l'article sont ${accord} à copier :`, origine: "FORMULE_V5" };
    }
    if (pf === "INSTAGRAM") return { texte: "Les autres exemples : lien en bio.", origine: "NEUF" };
    return { texte: "Les autres exemples, et comment trouver le tien :", origine: "NEUF" };
  };

  /** Ligne d'article reprise : catalogue, ou vanne citée à la 1re personne, sans question, d'un article CATALOGUE ou décryptée. */
  function eligibleRelais(a: ArticleLot, l: LigneArticle): boolean {
    const t = l.lignes.join(" ");
    if (l.catalogueId) return true;
    return l.citee && premierePersonne(t) && !t.includes("?") && (a.category === "CATALOGUE" || !!l.pourquoi);
  }
  /** Ligne d'article pour un relais : catalogue, article CATALOGUE, ou vanne décryptée citée. */
  const ligneRelais = (a: ArticleLot, date: string, pf: PreparedPlatform, filtre: (v: Vanne) => boolean): Vanne | null => {
    const ls = shuffle(lignesParSlug.get(a.slug) ?? [], seededRandom(`${graine}-${a.slug}-${date}`));
    const candidats = parRang(ls.filter((l) => eligibleRelais(a, l)).map(vanneDeLigne).sort((x, y) => Number(!x.jokeId) - Number(!y.jokeId)));
    return candidats.find((v) => libre(v, date, true, pf) && filtre(v))
      ?? penurie(candidats.find((v) => libre(v, date, true) && filtre(v)) ?? null, pf, date);
  };
  /** Lignes d'articles déjà publiés à cette date (v5 : « vannes = catalogue ou lignes des articles du site »). */
  const lignesPubliees = (date: string): Vanne[] => input.articles.filter((a) => a.date < date && !C.ARTICLES_MESSAGES.test(a.slug))
    .flatMap((a) => (lignesParSlug.get(a.slug) ?? []).filter((l) => !l.catalogueId && eligibleRelais(a, l)))
    .map(vanneDeLigne);
  const tirer = (pf: PreparedPlatform, date: string, filtre: (v: Vanne) => boolean, prefere?: (v: Vanne) => boolean): Vanne | null => {
    const ordre = parRang([...melange[pf].map(deJoke), ...shuffle(lignesPubliees(date), seededRandom(`${graine}-${pf}-${date}`))]);
    const choisir = (ok: (v: Vanne) => boolean) => (prefere ? ordre.find((v) => prefere(v) && ok(v)) : undefined) ?? ordre.find(ok) ?? null;
    return choisir((v) => libre(v, date, false, pf) && filtre(v)) ?? penurie(choisir((v) => libre(v, date) && filtre(v)), pf, date);
  };
  const filtreReseau = (pf: PreparedPlatform, suffixe = ""): ((v: Vanne) => boolean) => (v) => {
    if (pf === "INSTAGRAM") return !!v.cartes && v.cartes.every((c) => mots(c) <= 25);
    const t = textePost(pf, v, null, suffixe || null, null);
    return checkPost({ platform: pf, text: t, quoted: "", r6: true }).length === 0 && (pf !== "LINKEDIN" || t.split("\n")[0].length <= 140);
  };
  construire();
  construireReplis();
  const variantes = alternerVariantes(posts, input.notes);
  // Bras image : threadParts = [amorce, chute], 1 carte servie par /api/social/image (slide 0).
  for (const p of posts) if (p.variante === "image") {
    p.cartes = [...p.lignes!];
    p.imageUrls = [`${siteUrl}/api/social/image?postId=${p.id}&slide=0`];
  }
  return { posts, replis, warnings, errors, stockEligible: stock, variantes };

  /**
   * Repli de chaque relais d'un article pas encore visible (plan v2 §6, R3) : vanne du même
   * thème, sans lien, sur le même créneau. Tirée APRÈS tout le lot parmi les vannes libres
   * (aucune vanne du lot à moins de 90 jours), jamais deux fois : aucun stock du lot consommé.
   */
  function construireReplis(): void {
    for (const r of [...posts]) {
      const a = r.article ? articleParSlug.get(r.article) : undefined;
      if (!a?.aGarder) continue;
      const themes = C.THEME_ARTICLE[a.slug] ?? [];
      const memeTheme = (x: Vanne) => themes.length === 0 || themes.includes(x.categorie ?? "");
      const v = tirer(r.platform, r.date, (x) => memeTheme(x) && filtreReseau(r.platform)(x));
      if (!v) { warnings.push(`${r.date} ${r.platform} : aucun repli libre pour le relais de ${a.slug} (créneau vide si l'article n'est pas publié à l'heure).`); continue; }
      reserver(v, r.date, r.platform);
      const p = poster(r.date, r.platform, "VANNE", { v, origine: "TIRAGE", repliDe: r.id,
        note: `Repli du relais de ${a.slug} : envoyé seulement si l'article n'est pas publié à l'heure.` });
      r.repli = p.id;
    }
  }

  function construire(): void {
    const parCase = new Map(FIXES.map((f) => [`${f.date}|${f.platform}`, f]));
    const forces = new Map(RELAIS_FORCES.map((r) => [`${r.date}|${r.platform}`, r]));
    const relaisLiParSemaine = new Map<string, number>();
    for (let date = debut; date <= fin; date = addDays(date, 1)) {
      for (const pf of PLATEFORMES) {
        const jourGrille = Object.entries(C.LI_DEPLACE).find(([, vers]) => vers === date && pf === "LINKEDIN")?.[0];
        const dateGrille = jourGrille ?? date;
        if (pf === "LINKEDIN" && C.LI_DEPLACE[date]) continue;
        const typeCase = C.GRILLE_V5[pf].jours[weekday(dateGrille)];
        if (!typeCase || date < C.J0[pf]) continue;
        if (C.SILENCES.has(date)) { warnings.push(`${date} ${pf} : silence (calendrier v5).`); continue; }
        const f = parCase.get(`${date}|${pf}`);
        if (f) { construireFixe(f); continue; }
        const r = forces.get(`${date}|${pf}`);
        if (r) { construireRelais(date, pf, articleParSlug.get(r.slug), r.utmContent, "PIVOT", r.note); continue; }
        construireCase(date, pf, typeCase, relaisLiParSemaine);
      }
    }
  }

  function construireFixe(f: Fixe) {
    const v = vanneDuFixe(f);
    if (f.vanne && !v) return;
    if (v) reserver(v, f.date, f.platform);
    const valide = f.origine === "VALIDE";
    const slug = f.vanne?.article?.slug ?? f.vanne?.articleTexte?.slug ?? (f.lien?.chemin.startsWith("/blog/") ? f.lien.chemin.slice(6) : undefined)
      ?? f.article;
    const a = slug ? articleParSlug.get(slug) : undefined;
    let r = f.renvoi ?? null;
    let lien = f.lien ? lienUtmV5(siteUrl, f.lien.chemin, f.platform, f.date, f.lien.content) : null;
    let rOrig: Origine = "FORMULE_V5";
    let legende = f.legende;
    let legOrig: Origine = "FORMULE_V5";
    if (f.type === "RELAIS" && a && !r && !legende && !f.texteMarque) {
      const rv = renvoi(a, f.platform, v?.origine === "ARTICLE" || !!v?.article);
      if (f.platform === "INSTAGRAM") { legende = legendeDe(v, rv.texte); legOrig = rv.origine; } else { r = rv.texte; rOrig = rv.origine; }
      if (f.platform !== "INSTAGRAM" && !lien) lien = lienUtmV5(siteUrl, `/blog/${a.slug}`, f.platform, f.date, weekday(f.date) === 1 ? "lundi" : "jeudi");
    }
    poster(f.date, f.platform, f.type, { v, marque: f.texteMarque, renvoi: r, renvoiOrigine: rOrig, lien, legende, legendeOrigine: legOrig,
      cartes: f.cartes, origine: f.origine, cle: f.cle, slug, note: f.note ?? (valide ? "Post validé par Thomas (s15)." : null), valide });
  }

  function construireRelais(date: string, pf: PreparedPlatform, a: ArticleLot | undefined, utm: string, type: TypePost, note: string | null) {
    if (!a) { errors.push(`${date} ${pf} : article du relais absent.`); return false; }
    const filtreLi = (v: Vanne) => pf !== "LINKEDIN" || nombreDePhrases(texteDe(v)) <= 2;
    let v = ligneRelais(a, date, pf, (x) => filtreLi(x) && filtreReseau(pf, "x".repeat(80))(x));
    let n = note;
    if (!v) {
      const themes = C.THEME_ARTICLE[a.slug] ?? [];
      v = tirer(pf, date, (x) => filtreLi(x) && filtreReseau(pf, "x".repeat(80))(x), (x) => themes.includes(x.categorie ?? ""));
      n = `${note ? `${note} ` : ""}Aucune ligne de l'article disponible : vanne du catalogue du même thème (v5 §1, relais (2)).`;
    }
    if (!v) { errors.push(`${date} ${pf} : aucune ligne ni vanne pour le relais de ${a.slug}.`); return false; }
    reserver(v, date, pf);
    const rv = renvoi(a, pf, !!v.article);
    const lien = pf === "INSTAGRAM" ? null : lienUtmV5(siteUrl, `/blog/${a.slug}`, pf, date, utm);
    poster(date, pf, type, { v, renvoi: pf === "INSTAGRAM" ? null : rv.texte, renvoiOrigine: rv.origine, lien,
      legende: pf === "INSTAGRAM" ? legendeDe(v, rv.texte) : undefined, legendeOrigine: rv.origine, origine: "TIRAGE", slug: a.slug, note: n });
    return true;
  }

  function construireVanne(date: string, pf: PreparedPlatform, type: TypePost, note: string | null, saisonniere = false) {
    const quiz = type === "VANNE_QUIZ";
    const lienQuiz = quiz ? lienUtmV5(siteUrl, "/quiz-humour", pf, date, "quiz") : null;
    const suffixe = quiz ? `${C.FORMULES.quizCourt} ${"x".repeat(23)}` : "";
    const prefere = saisonniere ? (v: Vanne) => C.SAISONS.some((s) => s.re.test(texteDe(v)) && date >= s.de && date <= s.a) : undefined;
    const v = tirer(pf, date, filtreReseau(pf, suffixe), prefere);
    if (!v) { errors.push(`${date} ${pf} : aucune vanne du catalogue ne passe les contrôles.`); return; }
    reserver(v, date, pf);
    poster(date, pf, type, { v, renvoi: quiz ? C.FORMULES.quizCourt : null, lien: lienQuiz, origine: "TIRAGE", note });
  }

  function construireDecryptage(date: string) {
    const avec = CARROUSELS_CITATION.includes(date) ? "Carrousel avec citation d'humoriste prévu (v5 §1) : citation non fournie, repli sans citation. " : "";
    const candidats = input.articles.filter((a) => a.date <= date).flatMap((a) => lignesParSlug.get(a.slug) ?? [])
      .filter((l) => l.pourquoi && l.jouer).map(vanneDeLigne);
    for (const v of parRang(shuffle(candidats, seededRandom(`${graine}-decryptage-${date}`)))) {
      const l = v.article!;
      const cartes = v.cartes ? [...v.cartes, `${C.FORMULES.carte3} ${l.pourquoi}`, `${C.FORMULES.carte4} ${l.jouer}`, C.FORMULES.renvoiQuizBio] : null;
      if (!cartes || !libre(v, date, false, "INSTAGRAM") || cartes.slice(0, 2).some((c) => mots(c) > 25) || mots(cartes[2]) > 30 || mots(`${cartes[3]} ${cartes[4]}`) > 35) continue;
      reserver(v, date, "INSTAGRAM");
      poster(date, "INSTAGRAM", "DECRYPTAGE", { v, cartes, cartesOrigine: "ARTICLE", origine: "TIRAGE", slug: l.slug,
        note: `${avec}Cartes 3 et 4 : 1re phrase du décryptage de l'article (« Pourquoi ça marche », « À toi de jouer »).`.trim() });
      return;
    }
    warnings.push(`${date} INSTAGRAM : aucune fiche de décryptage disponible (article ni @copywriter) : carte vanne à la place du carrousel.`);
    construireVanne(date, "INSTAGRAM", "VANNE", `${avec}Décryptage 4 cartes à fournir par @copywriter : carte vanne en attendant.`);
  }

  function construireCase(date: string, pf: PreparedPlatform, t: C.TypeCase, relaisLi: Map<string, number>) {
    if (t === "DECRYPTAGE") return construireDecryptage(date);
    if (t === "VANNE" || t === "VANNE_QUIZ") {
      const note = date === REFONTE_17_12 && pf === "TWITTER" ? "17/12 : vanne simple ; passer au lien `saison` de meilleures-blagues-droles-2026 si la refonte 2027 est en ligne le 16/12." : null;
      return construireVanne(date, pf, t === "VANNE_QUIZ" && pf === "TWITTER" ? "VANNE_QUIZ" : "VANNE", note);
    }
    if (t === "RELAIS_LUNDI" || t === "RELAIS_JEUDI") {
      const a = articleParDate.get(date);
      if (a && construireRelais(date, pf, a, t === "RELAIS_LUNDI" ? "lundi" : "jeudi", "RELAIS", null)) return;
      const note = date === REFONTE_17_12 ? "17/12 : vanne simple sans lien (refonte 2027 non confirmée)." : `Aucun article le ${date} : vanne.`;
      return construireVanne(date, pf, "VANNE", note, t === "RELAIS_JEUDI");
    }
    // LinkedIn : relais d'article à angle bureau (lundi pour le mardi, jeudi pour le jeudi), 1 par semaine au plus.
    const semaine = mondayOf(date);
    const a = articleParDate.get(t === "LI_MARDI" ? addDays(date, -1) : date);
    if (a && estAngleBureau(a) && !relaisLi.get(semaine) && construireRelais(date, pf, a, "relais", "RELAIS", null)) {
      relaisLi.set(semaine, 1);
      return;
    }
    construireVanne(date, pf, "VANNE", null);
  }
}

/**
 * Carte LinkedIn possible (v5 §8) : vanne de 2 lignes sans lien, à partir de `des`, que le
 * Worker acceptera telle quelle (même contrôle que `vanneLinkedInImage` : amorce ≤ 140, mot pour mot).
 */
export function eligibleCarteLinkedIn(p: LotPost, des: string = C.LI_TEST_IMAGE_DES): boolean {
  if (p.platform !== "LINKEDIN" || p.date < des || p.lien || p.repliDe || p.vannes.length !== 1 || p.lignes?.length !== 2) return false;
  return vanneLinkedInImage({ platform: p.platform, content: p.content, threadParts: p.lignes, directorNote: VARIANTE_IMAGE }) !== null;
}

/**
 * Test LinkedIn texte / image (mesure §7) : les posts éligibles, dans l'ordre, forment des paires
 * (même note dans les FENETRE_PAIRE_VARIANTE posts suivants si possible, sinon le suivant) ; le
 * 1er de la paire est image une paire sur deux (ordre inversé d'une paire à l'autre). Post seul
 * en fin de lot : bras le moins servi. Pose `variante` sur les posts, renvoie les compteurs.
 */
export function alternerVariantes(posts: LotPost[], notes: Record<string, number> = {}, des: string = C.LI_TEST_IMAGE_DES): CompteVariantes {
  const libres = posts.filter((p) => eligibleCarteLinkedIn(p, des)).sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
  const c: CompteVariantes = { eligibles: libres.length, image: 0, texte: 0, paires: 0, pairesMemeNote: 0 };
  const poser = (p: LotPost, v: Variante) => { p.variante = v; c[v]++; };
  const note = (p: LotPost): number | undefined => notes[p.vannes[0]];
  while (libres.length) {
    const a = libres.shift()!;
    if (!libres.length) { poser(a, c.image <= c.texte ? "image" : "texte"); break; }
    const n = note(a);
    const k = n === undefined ? -1 : libres.slice(0, C.FENETRE_PAIRE_VARIANTE).findIndex((b) => note(b) === n);
    const [b] = libres.splice(Math.max(k, 0), 1);
    const premier: Variante = c.paires % 2 === 0 ? "image" : "texte";
    poser(a, premier);
    poser(b, premier === "image" ? "texte" : "image");
    c.paires++;
    if (k >= 0) c.pairesMemeNote++;
  }
  return c;
}

/** Contrôles du lot complet (v5 §1 à §3) : anti-répétition, pain (lot et base), Noël, liens, cadence. */
export function controlerLot(posts: LotPost[], base: PostEnBase[] = []): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const parCle = new Map<string, string[]>();
  for (const p of posts) for (const k of p.vannes) parCle.set(k, [...(parCle.get(k) ?? []), p.date]);
  for (const [k, ds] of parCle) if (ds.length > 1) errors.push(`Vanne ${k} postée ${ds.length} fois (${ds.join(", ")}) : anti-répétition 90 jours.`);
  // « pain » : 1 par fenêtre de 30 jours tous réseaux, posts déjà en base compris (seule une paire base/base est ignorée).
  const estPain = (ids: string[], texte: string) => ids.some((k) => C.PAIN_IDS.includes(k)) || C.PAIN_RE.test(texte);
  const premierJour = posts.map((p) => p.date).sort()[0];
  const pains = [
    ...posts.filter((p) => estPain(p.vannes, `${p.cartes.join(" ")} ${p.content}`)).map((p) => ({ date: p.date, quoi: p.date, enBase: false })),
    ...(premierJour ? base : []).filter((r) => r.date >= addDays(premierJour, -C.FENETRE_PAIN_JOURS) && estPain([r.sourceId], r.texte ?? ""))
      .map((r) => ({ date: r.date, quoi: `${r.date} en base ${r.platform ?? ""} ${r.sourceId}`.replace(/\s+/g, " "), enBase: true })),
  ].sort((a, b) => a.date.localeCompare(b.date));
  for (let i = 1; i < pains.length; i++) {
    const [a, b] = [pains[i - 1], pains[i]];
    if (a.enBase && b.enBase) continue;
    if (jours(a.date, b.date) < C.FENETRE_PAIN_JOURS) errors.push(`Motif « pain » deux fois en moins de 30 jours (${a.quoi}, ${b.quoi}).`);
  }
  // « copain / copine » : au plus 2 par semaine (lundi-dimanche), AVERTISSEMENT seulement ([HYPOTHÈSE] du seuil, C7).
  const copains = new Map<string, string[]>();
  for (const p of posts) {
    if (!C.COPAIN_RE.test(`${p.cartes.join(" ")} ${p.content}`)) continue;
    const lundi = mondayOf(p.date);
    copains.set(lundi, [...(copains.get(lundi) ?? []), `${p.date} ${p.platform}`]);
  }
  for (const [lundi, qui] of copains) if (qui.length > C.PLAFOND_COPAIN_PAR_SEMAINE) warnings.push(`Semaine du ${lundi} : « copain / copine » ${qui.length} fois (${qui.join(", ")}), plafond ${C.PLAFOND_COPAIN_PAR_SEMAINE} [HYPOTHÈSE] (corrections-cycle8-copy.md §3 point 4).`);
  for (const p of posts) {
    if (p.vannes.some((k) => C.RESERVEES_NOEL.includes(k)) && p.date < C.NOEL_DES) errors.push(`${p.date} : vanne réservée à Noël avant le 24/12.`);
    const carrousel = RESERVEES_CARROUSEL.find((r) => p.vannes.includes(r.jokeId));
    if (carrousel && p.origine === "TIRAGE") errors.push(`${p.date} ${p.platform} : vanne ${carrousel.jokeId} réservée au carrousel du ${carrousel.date} (${carrousel.source}), tirée.`);
    if (weekday(p.date) === 0) errors.push(`${p.date} : post un dimanche.`);
    for (const url of `${p.content} ${p.lien ?? ""}`.match(/https?:\/\/\S+/g) ?? []) {
      if (!/utm_source=(x|instagram|linkedin)&utm_medium=social&utm_campaign=\d{4}-\d{2}/.test(url)) errors.push(`${p.date} ${p.platform} : lien sans UTM v5 (${url}).`);
      if (/\/register|\/abonnement/.test(url)) errors.push(`${p.date} ${p.platform} : lien interdit (${url}).`);
    }
  }
  const semaines = new Map<string, LotPost[]>();
  for (const p of posts) semaines.set(mondayOf(p.date), [...(semaines.get(mondayOf(p.date)) ?? []), p]);
  for (const [s, ps] of semaines) {
    const xLiens = ps.filter((p) => p.platform === "TWITTER" && p.lien).length;
    const max = s === "2026-10-26" || s === "2026-12-28" ? 4 : 3;
    if (xLiens > max) warnings.push(`Semaine du ${s} : ${xLiens} posts X avec lien (plafond v5 : ${max}).`);
    if (ps.filter((p) => p.platform === "LINKEDIN" && p.lien).length > 1) errors.push(`Semaine du ${s} : 2 relais LinkedIn.`);
  }
  return { errors, warnings };
}

/**
 * Légendes Instagram (notation cycle 8, @social S7 et S8) : chaque post et chaque repli Instagram porte une
 * légende « À envoyer à... » de 80 caractères au plus, sans lien ni « deviens-marrant » (erreur sinon).
 * Avertissements : même tournure sur 2 posts Instagram consécutifs ; carrousel qui renvoie au quiz
 * « dans le lien de la bio » (à retirer si les liens de bio ne sont pas posés la veille, founder-preferences l.67).
 */
export function controlerLegendesInstagram(posts: LotPost[], replis: LotPost[] = []): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  for (const p of [...posts, ...replis].filter((x) => x.platform === "INSTAGRAM")) {
    const quoi = `${p.date} INSTAGRAM ${p.cle ?? p.type}${p.repliDe ? " (repli)" : ""}`;
    if (!p.content) errors.push(`${quoi} : légende manquante pour la vanne ${p.vannes[0] ?? p.sourceId} (« À envoyer à... » à fournir par @copywriter, social-lot-v5-legendes.ts).`);
    else for (const e of ecartsLegende(p.content)) errors.push(`${quoi} : ${e}.`);
    if (p.cartes.includes(C.FORMULES.renvoiQuizBio)) warnings.push(`${quoi} : « ${C.FORMULES.renvoiQuizBio} » ne part que si les liens de bio sont posés le ${addDays(p.date, -1)} (sinon retirer la 5e partie avant l'envoi).`);
    // Garde S8 étendue aux relais (corrections-cycle8-copy.md §3 point 3) : contrôle manuel, aucune lecture de mesure.md.
    else if (/lien en bio\.?$/.test(p.content)) warnings.push(`${quoi} : légende « … lien en bio » : ne part telle quelle que si les liens de bio sont posés le ${addDays(p.date, -1)} (sinon la tronquer à sa 1re phrase).`);
  }
  const ig = posts.filter((p) => p.platform === "INSTAGRAM" && p.content).sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
  for (let i = 1; i < ig.length; i++) {
    const t = tournure(ig[i].content);
    if (t !== "autre" && t === tournure(ig[i - 1].content)) warnings.push(`${ig[i - 1].date} et ${ig[i].date} INSTAGRAM : même tournure « ${t} » deux fois de suite (corrections-cycle7-copy.md §3).`);
  }
  return { errors, warnings };
}
