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
import type { LigneNotee } from "./social-lignes-notees";
import { addDays, estAngleBureau, lienUtmV5, mondayOf, parisToUtc, seededRandom, shuffle, vanneR6, weekday, type CatalogueJoke } from "./social-month-plan";
import * as C from "./social-lot-v5-config";
import { CARROUSELS_CITATION, CASES_VANNE, FIXES, REFONTE_17_12, RELAIS_FORCES, RESERVEES_CARROUSEL, type Fixe, type TypePost } from "./social-lot-v5-fixes";
import { LEGENDES_IG, ecartsLegende, tournure } from "./social-lot-v5-legendes";
import { VARIANTE_IMAGE, vanneLinkedInImage } from "../../src/lib/social/carte-linkedin";
import { heureDuCreneau, type BrasHeure } from "../../src/lib/social/heure-test";
import { LIBELLE_FORMAT, PLAFONDS_MIX, partiesConseilIg, caseConseilNominale, conseilServira, erreurSansTexte, jjmm, ordreRepli, prioriteRepli, type FormatMix, type TexteFormat } from "./social-lot-v5-mix";

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
  /**
   * Textes validés du repli du mix (`docs/social/preparation/textes-formats-valides.json`, lus par
   * `lireTextesFormats`) : seule source des cases sans vanne au niveau ; vide = erreur par créneau et par format.
   */
  textesFormats?: TexteFormat[];
  /**
   * Lignes d'article notées au niveau (`lignes-articles-notes.json`, lues par `lireLignesNotees`) : admises au
   * tirage du relais de LEUR article seulement, même hors `--pool` (plan §2, mix §2 : « relais, ligne notée »).
   */
  lignesNotees?: LigneNotee[];
}
/** Post déjà en base avant le lot. `texte` (contenu + cartes) : contrôle « pain » sur la base. */
export interface PostEnBase { date: string; sourceId: string; platform?: string; texte?: string }
export type Origine = "CATALOGUE" | "ARTICLE" | "VALIDE" | "FORMULE_V5" | "NEUF" | "TEXTE_MIX";
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
  origine: "VALIDE" | "V5" | "TIRAGE" | "MIX";
  /** Repli du mix : format et id du texte validé (textes-formats-valides.json). */
  mix?: { format: FormatMix; texte: string };
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
  // Décryptage : 5 parties = 4 cartes ; conseil Instagram : [surtitre, carte 1, carte 2] = 2 cartes.
  return parties.length === 5 ? 4 : parties.length === 3 ? 2 : parties.length;
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
  /** 1re diffusion EN BASE seulement (R9 : vanne déjà publiée, jamais une diffusion du lot en cours). */
  const premierEnBase = new Map(premier);
  const fixesVannes = new Set<string>();
  /** Toutes les diffusions de chaque clé (R9 : une seule réutilisation, après la seule 1re diffusion). */
  const usages = new Map<string, string[]>();
  const noterUsage = (k: string, d: string) => usages.set(k, [...(usages.get(k) ?? []), d]);
  for (const r of input.recents) noterUsage(r.sourceId, r.date);
  // ── Textes du mix : chacun une seule fois (lot et posts en base, par id), lignes d'article aussi par clé 90 jours ──
  const textesFormats = input.textesFormats ?? [];
  const cleLigne = (t: TexteFormat) => `${t.article}#${t.rang ?? normaliser(t.texte ?? (t.cartes ?? []).join(" ")).slice(0, 24)}`;
  const formatsUtilises = new Set<string>();
  /** Textes à créneau rendus au repli (case tenue par une vanne au niveau) : servent la case libre suivante. */
  const rendus = new Set<string>();
  for (const t of textesFormats) for (const d of usages.get(t.id) ?? []) {
    formatsUtilises.add(t.id);
    if (t.format === "ligne" && (!utilise.has(cleLigne(t)) || d > utilise.get(cleLigne(t))!)) utilise.set(cleLigne(t), d);
  }

  const vanneDeLigne = (l: LigneArticle): Vanne => {
    const j = l.catalogueId ? poolById.get(l.catalogueId) : undefined;
    if (j) return { ...deJoke(j), origine: "CATALOGUE", article: l };
    return { cle: `${l.slug}#${l.rang}`, lignes: l.lignes, cartes: deuxCartes(l.lignes), categorie: null, origine: "ARTICLE", article: l };
  };
  /**
   * Lignes notées au niveau, par article (ordre du fichier), mot pour mot depuis l'article en base : ligne reconnue au
   * texte identique, sinon texte présent tel quel dans le contenu (clé `slug#rang`, ou `slug#<texte normalisé>` comme
   * les fixes quand le rang est nul ou désigne une autre ligne).
   */
  const noteesParSlug = new Map<string, Vanne[]>();
  const clesNotees = new Set<string>();
  for (const n of input.lignesNotees ?? []) {
    const a = articleParSlug.get(n.slug);
    if (!a) continue;
    const quoi = `Ligne notée ${n.slug}#${n.rang ?? `« ${n.texte.slice(0, 40)}… »`}`;
    // Ligne reconnue dans l'article (même texte) : sa clé et ses lignes d'origine (`slug#rang` de l'article, ou id catalogue).
    const ls = lignesParSlug.get(n.slug) ?? [];
    const l = ls.find((x) => normaliser(x.lignes.join(" ")) === normaliser(n.texte));
    let v: Vanne | null = l ? vanneDeLigne(l) : null;
    if (!v && a.content.includes(n.texte)) {
      // Hors lignes reconnues (FAQ, intro, section `**N. titre**`) : texte tel quel. `slug#rang` s'il ne désigne
      // aucune autre ligne de l'article, sinon clé du texte (pas de faux doublon au registre des 90 jours).
      const rangLibre = n.rang !== null && !ls.some((x) => x.rang === n.rang);
      v = { cle: `${n.slug}#${rangLibre ? n.rang : normaliser(n.texte).slice(0, 24)}`, lignes: [n.texte], cartes: deuxCartes([n.texte]), categorie: null, origine: "ARTICLE" };
    }
    if (!v) { warnings.push(`${quoi} : introuvable mot pour mot dans l'article en base, non utilisée.`); continue; }
    if (clesNotees.has(v.cle)) continue;
    clesNotees.add(v.cle);
    noteesParSlug.set(n.slug, [...(noteesParSlug.get(n.slug) ?? []), v]);
  }
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
  // `admises` : lignes notées admises hors pool, celles du relais servi seulement (ligneRelais).
  const libre = (v: Vanne, date: string, relais = false, pf?: PreparedPlatform, admises?: Set<string>): boolean => {
    if (rang && !rang.has(v.cle) && !admises?.has(v.cle)) return false;
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
    noterUsage(v.cle, date);
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
    // Cartes conseil : 2 cartes 4:5 (mix §4), pas le plafond de 25 mots des cartes vanne.
    if (p.platform === "INSTAGRAM" && p.type !== "CONSEIL") {
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
    repliDe?: string; mix?: LotPost["mix"]; sourceId?: string; persona?: LotPost["persona"];
  }): LotPost => {
    const g = creneau(pf, date);
    const id = idDuPost(pf, date, o.repliDe ? `${lotId}-repli` : lotId);
    const lien = o.lien ?? null;
    const content = pf === "INSTAGRAM" ? (o.legende ?? legendeDe(o.v) ?? "") : textePost(pf, o.v, o.marque ?? null, o.renvoi ?? null, lien);
    const cartes = pf === "INSTAGRAM" ? (o.cartes ?? (o.v?.cartes ? [...o.v.cartes] : [])) : [];
    // Texte validé du mix : tous ses segments sont déjà notés à l'aveugle (jamais « NEUF »), formules v5 exceptées.
    const fige: Origine | null = o.valide ? "VALIDE" : o.mix ? "TEXTE_MIX" : null;
    const segV: Origine = fige ?? (o.v?.origine ?? "NEUF");
    const segments: Segment[] = [];
    if (o.v) o.v.lignes.forEach((l) => segments.push({ texte: l, origine: segV }));
    if (o.marque) segments.push({ texte: o.marque, origine: fige ?? "NEUF" });
    if (o.renvoi) segments.push({ texte: o.renvoi, origine: o.valide ? "VALIDE" : (o.renvoiOrigine ?? "FORMULE_V5") });
    if (pf === "INSTAGRAM" && content) segments.push({ texte: content, origine: fige ?? (o.legendeOrigine ?? "FORMULE_V5") });
    if (cartes.length === 5) cartes.slice(2).forEach((c) => segments.push({ texte: c, origine: fige ?? (o.cartesOrigine ?? "ARTICLE") }));
    if (o.mix && !o.v && (cartes.length === 2 || cartes.length === 3)) cartes.forEach((c) => segments.push({ texte: c, origine: "TEXTE_MIX" }));
    const persona = o.persona ?? (pf === "LINKEDIN" ? "SOPHIE" : o.slug && C.ARTICLES_MARC.has(o.slug) ? "MARC" : "YANIS");
    const sourceType = o.v?.jokeId ? "JOKE" : o.v || o.slug ? "BLOG" : "ORIGINAL";
    const sourceId = o.sourceId ?? o.v?.jokeId ?? o.v?.cle ?? o.slug ?? o.cle ?? id;
    const p: LotPost = {
      id, cle: o.cle ?? null, date, heure: `${String(g.h).padStart(2, "0")}:${String(g.m).padStart(2, "0")}`,
      scheduledAt: parisToUtc(date, g.h, g.m).toISOString(), platform: pf, type, content, cartes,
      // Décryptage : 5 parties (amorce, chute, mécanisme, consigne, renvoi) = 4 cartes (carte 4 = consigne + renvoi).
      imageUrls: Array.from({ length: nombreDeCartes(cartes) }, (_, i) => `${siteUrl}/api/social/image?postId=${id}&slide=${i}`),
      lien, sourceType, sourceId, vannes: o.v ? [o.v.cle] : [], persona, origine: o.origine, ...(o.mix ? { mix: o.mix } : {}), segments, note: o.note ?? null,
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
  /**
   * Ligne d'article pour un relais : catalogue, puis lignes notées au niveau (Instagram : seulement avec leur légende
   * « À envoyer à... » validée, sans quoi le post serait refusé), puis article CATALOGUE ou vanne décryptée citée.
   */
  const ligneRelais = (a: ArticleLot, date: string, pf: PreparedPlatform, filtre: (v: Vanne) => boolean): Vanne | null => {
    const ls = shuffle(lignesParSlug.get(a.slug) ?? [], seededRandom(`${graine}-${a.slug}-${date}`));
    const extraites = parRang(ls.filter((l) => eligibleRelais(a, l)).map(vanneDeLigne).sort((x, y) => Number(!x.jokeId) - Number(!y.jokeId)));
    const notees = (noteesParSlug.get(a.slug) ?? []).filter((v) => pf !== "INSTAGRAM" || !!legendes[v.cle]);
    const cles = new Set(notees.map((v) => v.cle));
    const candidats = notees.length === 0 ? extraites : [...extraites.filter((v) => v.jokeId && !cles.has(v.cle)), ...notees,
      ...extraites.filter((v) => !v.jokeId && !cles.has(v.cle))];
    return candidats.find((v) => libre(v, date, true, pf, cles) && filtre(v))
      ?? penurie(candidats.find((v) => libre(v, date, true, undefined, cles) && filtre(v)) ?? null, pf, date);
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
  /** Cases de relais devenues vanne simple (CASES_VANNE) : tirées après le lot, avant les replis, rang d'origine gardé. */
  const differees: Array<{ date: string; pf: PreparedPlatform; note: string; rang: number }> = [];
  /** Cases sans vanne au niveau : servies après le lot par le repli du mix (mix-formats-s15.md §2), jamais omises. */
  const aReplier: Array<{ date: string; pf: PreparedPlatform }> = [];
  construire();
  construireDifferees();
  construireReplisMix();
  construireReplis();
  const variantes = alternerVariantes(posts, input.notes);
  // Bras image : threadParts = [amorce, chute], 1 carte servie par /api/social/image (slide 0).
  for (const p of posts) if (p.variante === "image") {
    p.cartes = [...p.lignes!];
    p.imageUrls = [`${siteUrl}/api/social/image?postId=${p.id}&slide=0`];
  }
  return { posts, replis, warnings, errors, stockEligible: stock, variantes };

  /**
   * Repli du mix (mix-formats-s15.md §2, §3, §6) : chaque case sans vanne au niveau reçoit, dans l'ordre de
   * `ordreRepli` et sous `PLAFONDS_MIX`, le 1er texte libre de `textesFormats`. Mardis et vendredis servis d'abord.
   * Sans texte : erreur par créneau et par format ; le format attendu compte dans les plafonds (commande cohérente).
   */
  function construireReplisMix(): void {
    const prevus: Array<{ date: string; pf: PreparedPlatform; f: FormatMix }> = [];
    const erreurs: Array<{ date: string; pf: PreparedPlatform; m: string }> = [];
    const cases = [...aReplier].sort((a, b) => prioriteRepli(weekday(a.date)) - prioriteRepli(weekday(b.date))
      || a.date.localeCompare(b.date) || PLATEFORMES.indexOf(a.pf) - PLATEFORMES.indexOf(b.pf));
    // Texte à créneau dont la case est tenue par une vanne au niveau (mix §2) ou déjà passée : rendu au repli.
    for (const t of textesFormats) {
      if (!t.creneau || t.creneau > fin || formatsUtilises.has(t.id)) continue;
      if (t.creneau >= debut && aReplier.some((c) => c.date === t.creneau && c.pf === t.reseau)) continue;
      rendus.add(t.id);
      const tient = posts.find((p) => p.date === t.creneau && p.platform === t.reseau);
      warnings.push(`Texte ${t.id} (${LIBELLE_FORMAT[t.format]}, ${jjmm(t.creneau)} ${t.reseau}) : ${tient ? `case tenue par ${tient.type} ${tient.vannes[0] ?? tient.sourceId ?? ""} (${t.format === "relaisLinkedIn" ? "plan §2 : une vanne de thème bureau passe avant le relais" : "mix §2 : une vanne au niveau passe avant le conseil"})` :"créneau hors du lot ou déjà passé"}, texte rendu au repli (case libre suivante du même réseau).`);
    }
    for (const { date, pf } of cases) {
      const jour = Object.entries(C.LI_DEPLACE).find(([, vers]) => vers === date && pf === "LINKEDIN")?.[0] ?? date;
      const ordre = ordreRepli(pf, C.GRILLE_V5[pf].jours[weekday(jour)] ?? "VANNE", date);
      // Un texte qui a CE créneau sert sa case d'abord (ex. conseil de repli S1 un jeudi, avant une ligne libre).
      const aCreneau = new Set(textesFormats.filter((t) => t.creneau === date && t.reseau === pf && !rendus.has(t.id) && !formatsUtilises.has(t.id)).map((t) => t.format));
      const ouverts = ordre.filter((f) => sousPlafond(f, date, pf, prevus)).sort((a, b) => Number(aCreneau.has(b)) - Number(aCreneau.has(a)));
      if (ouverts.some((f) => posterFormat(f, date, pf))) continue;
      if (ouverts.length) prevus.push({ date, pf, f: ouverts[0] });
      const detail = ouverts[0] === "relaisLinkedIn" ? articlesTravail(date) : undefined;
      erreurs.push({ date, pf, m: ouverts.length ? erreurSansTexte(date, pf, ouverts[0], ouverts.slice(1), detail)
        : `${date} ${pf} : créneau du ${jjmm(date)} : repli du mix impossible, plafonds atteints (${ordre.map((f) => LIBELLE_FORMAT[f]).join(", ")}).` });
    }
    erreurs.sort((a, b) => a.date.localeCompare(b.date) || PLATEFORMES.indexOf(a.pf) - PLATEFORMES.indexOf(b.pf)).forEach((e) => errors.push(e.m));
  }

  /** Relais LinkedIn possible : article publié depuis 7 jours au plus (mix §4), de thème bureau ou angle travail porté par le texte. */
  function articleTravail(slug: string | undefined, date: string, angleTexte = false): ArticleLot | null {
    const a = slug ? articleParSlug.get(slug) : undefined;
    return a && a.date <= date && jours(a.date, date) <= 7 && (angleTexte || estAngleBureau(a)) ? a : null;
  }
  function articlesTravail(date: string): string {
    const ok = input.articles.filter((a) => articleTravail(a.slug, date, true))
      .map((a) => `${a.slug} (${jjmm(a.date)}${estAngleBureau(a) ? ", thème bureau" : ", angle travail à porter par le texte"})`);
    return ok.length ? `articles de 7 jours au plus : ${ok.join(", ")}` : "aucun article de 7 jours au plus : relais impossible, décision à prendre";
  }

  function sousPlafond(f: FormatMix, date: string, pf: PreparedPlatform, prevus: Array<{ date: string; pf: PreparedPlatform; f: FormatMix }>): boolean {
    const semaine = mondayOf(date);
    const n = (ok: (p: LotPost) => boolean) => posts.filter((p) => mondayOf(p.date) === semaine && ok(p)).length
      + prevus.filter((x) => x.f === f && mondayOf(x.date) === semaine).length;
    if (f === "conseil") return pf !== "LINKEDIN" && n((p) => p.type === "CONSEIL") < PLAFONDS_MIX.conseilsParSemaine;
    if (f === "carrousel") return pf === "INSTAGRAM" && n((p) => p.platform === "INSTAGRAM" && p.type === "DECRYPTAGE") < PLAFONDS_MIX.carrouselsParSemaine;
    if (f === "relaisLinkedIn") return pf === "LINKEDIN" && n((p) => p.platform === "LINKEDIN" && !!p.lien) < PLAFONDS_MIX.relaisLinkedInParSemaine;
    if (f === "quiz") {
      const quiz = [...posts.filter((p) => p.type === "QUIZ").map((p) => p.date), ...prevus.filter((x) => x.f === "quiz").map((x) => x.date),
        ...textesFormats.filter((t) => t.format === "quiz").flatMap((t) => usages.get(t.id) ?? [])];
      const fenetre = date >= PLAFONDS_MIX.fenetre.de && date <= PLAFONDS_MIX.fenetre.a
        ? quiz.filter((d) => d >= PLAFONDS_MIX.fenetre.de && d <= PLAFONDS_MIX.fenetre.a).length < PLAFONDS_MIX.quizSeulMax : true;
      // 1 mercredi sur 2 : aucun quiz seul à 7 jours ou moins.
      return pf === "TWITTER" && fenetre && !quiz.some((d) => Math.abs(jours(d, date)) <= 7);
    }
    return pf !== "LINKEDIN";
  }

  /**
   * Pose sur la case le texte du format qui a ce créneau, sinon le 1er texte libre (sans créneau ou rendu, ordre du
   * fichier) ; false si aucun. Chaque texte sert une fois ; un texte à créneau ne sert jamais une autre case.
   */
  function posterFormat(f: FormatMix, date: string, pf: PreparedPlatform, nominal?: string): boolean {
    const libreIci = (t: TexteFormat) => !t.creneau || rendus.has(t.id);
    for (const t of [...textesFormats.filter((x) => x.creneau === date && !rendus.has(x.id)), ...textesFormats.filter(libreIci)]) {
      if (t.format !== f || t.reseau !== pf || formatsUtilises.has(t.id)) continue;
      // Conseil : repli S1 tout jour ouvré, nominal (même rendu) ni lundi ni jeudi ; jamais les jours d'exception.
      if (f === "conseil" && !conseilServira(t, date)) continue;
      const quoi = nominal ?? `Repli du mix (${LIBELLE_FORMAT[f]})`;
      const base = { origine: "MIX" as const, mix: { format: f, texte: t.id }, persona: t.persona, legende: t.legende,
        cartes: t.cartes ? partiesConseilIg(t.cartes, t.surtitre) : undefined,
        note: `${quoi} : texte ${t.id}, notes ${t.notes.join(" / ")} (${t.source}).${t.surtitre ? ` Surtitre « ${t.surtitre} » de la carte 1 (rendu à part, threadParts à 3 parties).` : ""}` };
      let p: LotPost;
      if (f === "conseil") p = poster(date, pf, "CONSEIL", { ...base, v: null, marque: t.texte, sourceId: t.id });
      else if (f === "quiz") {
        const avant = [...posts].reverse().find((x) => x.type === "QUIZ" && x.date < date)?.mix?.texte;
        const profils = textesFormats.find((x) => x.id === avant)?.profils ?? [];
        if (t.profils?.some((x) => profils.includes(x))) continue;
        p = poster(date, pf, "QUIZ", { ...base, v: null, marque: t.texte, renvoi: C.FORMULES.quizCourt, sourceId: t.id,
          lien: lienUtmV5(siteUrl, "/quiz-humour", pf, date, "quiz") });
      } else if (f === "relaisLinkedIn") {
        const a = articleTravail(t.article, date, t.angleTravail);
        if (!a) continue;
        p = poster(date, pf, "RELAIS", { ...base, v: null, marque: t.texte, slug: a.slug, sourceId: t.id,
          lien: lienUtmV5(siteUrl, `/blog/${a.slug}`, pf, date, "relais") });
      } else {
        const v = f === "ligne" ? vanneDeLigneNotee(t, date) : vanneR9(t, date);
        if (!v) continue;
        reserver(v, date, pf);
        p = poster(date, pf, f === "ligne" ? "VANNE" : "DECRYPTAGE", { ...base, v, ...(f === "ligne" ? { sourceId: t.id } : {}) });
      }
      formatsUtilises.add(t.id);
      placer(p);
      return true;
    }
    return false;
  }

  /** Case de conseil nominale servie par le conseil qui y a son créneau (false : la case suit le tirage). */
  function conseilNominal(date: string, pf: PreparedPlatform): boolean {
    if (!caseConseilNominale(date, pf)) return false;
    const t = textesFormats.find((x) => x.format === "conseil" && x.role !== "repli" && x.creneau === date && x.reseau === pf && !formatsUtilises.has(x.id));
    return !!t && posterFormat("conseil", date, pf, "Case de conseil nominale (plan §3, avant la vanne)");
  }

  /**
   * Relais LinkedIn validé sur son créneau (`mix-formats-s15.md` §2 « relais, sinon vanne », plan §2 « LinkedIn tire
   * d'abord les vannes de thème bureau », décision de la session du 08/10) : il passe AVANT toute vanne qui n'est pas
   * de thème bureau. Une vanne de thème bureau au niveau, libre, garde la priorité : elle prend la case, le texte est
   * rendu au repli. false : aucun relais validé sur cette case, elle suit le tirage.
   */
  function relaisLinkedInValide(date: string, pf: PreparedPlatform, relaisLi: Map<string, number>): boolean {
    if (pf !== "LINKEDIN") return false;
    const t = textesFormats.find((x) => x.format === "relaisLinkedIn" && x.creneau === date && x.reseau === pf && !formatsUtilises.has(x.id));
    if (!t) return false;
    const bureau = melange.LINKEDIN.map(deJoke).find((v) => v.categorie === "BOULOT" && libre(v, date, false, pf) && filtreReseau(pf)(v));
    if (bureau) {
      reserver(bureau, date, pf);
      poster(date, pf, "VANNE", { v: bureau, origine: "TIRAGE", note: `Vanne de thème bureau au niveau : passe avant le relais validé ${t.id} (plan §2), texte rendu au repli.` });
      return true;
    }
    if (!posterFormat("relaisLinkedIn", date, pf, "Relais LinkedIn validé sur son créneau (mix §2, avant toute vanne hors thème bureau)")) return false;
    relaisLi.set(mondayOf(date), 1);
    return true;
  }

  /** Repli inséré à sa place dans le lot (date, puis X, Instagram, LinkedIn). */
  function placer(p: LotPost): void {
    posts.splice(posts.indexOf(p), 1);
    const k = PLATEFORMES.indexOf(p.platform);
    const i = posts.findIndex((q) => q.date > p.date || (q.date === p.date && PLATEFORMES.indexOf(q.platform) > k));
    posts.splice(i < 0 ? posts.length : i, 0, p);
  }

  /** Ligne d'article notée : mot pour mot dans un article publié avant la case, libre au registre des 90 jours. */
  function vanneDeLigneNotee(t: TexteFormat, date: string): Vanne | null {
    const a = articleParSlug.get(t.article ?? "");
    const texte = t.texte ?? (t.cartes ?? []).join(" ");
    if (!a || a.date >= date) return null;
    if (!normaliser(a.content).includes(normaliser(texte))) return avertir(`Texte ${t.id} : ligne introuvable mot pour mot dans l'article ${a.slug}, non utilisée.`);
    const v: Vanne = { cle: cleLigne(t), lignes: t.cartes ? [...t.cartes] : [texte], cartes: t.cartes ? [t.cartes[0], t.cartes[1]] : deuxCartes([texte]),
      categorie: null, origine: "ARTICLE" };
    const d = utilise.get(v.cle);
    return (d && Math.abs(jours(d, date)) < C.ANTI_REPETITION_JOURS) || textes.has(normaliser(texteDe(v))) ? null : v;
  }

  /** R9 (mix §3) : vanne au niveau, 1re diffusion sur X ou LinkedIn depuis 28 jours, jamais rejouée ; cartes 1 et 2 = la vanne. */
  function vanneR9(t: TexteFormat, date: string): Vanne | null {
    const j = poolById.get(t.jokeId ?? "");
    const refus = (m: string) => avertir(`Carrousel ${t.id} (${t.jokeId}) : ${m}, non utilisé.`);
    if (!j) return refus("vanne absente du catalogue validé");
    if (rang && !rang.has(j.id)) return refus("vanne hors du pool");
    if (C.SOUS_HUIT.includes(j.id) || C.RESERVEES_NOEL.includes(j.id) || RESERVEES_CARROUSEL.some((r) => r.jokeId === j.id)) return refus("vanne sous 8 ou réservée");
    if (normaliser(`${t.cartes?.[0]} ${t.cartes?.[1]}`) !== normaliser(`${j.setup} ${j.punchline}`)) return refus("cartes 1 et 2 différentes de la vanne du catalogue");
    const p1 = premierEnBase.get(j.id);
    if (!p1) return refus("vanne jamais publiée en base");
    if (jours(p1.date, date) < PLAFONDS_MIX.r9Jours) return refus(`publiée depuis ${jours(p1.date, date)} jours (${PLAFONDS_MIX.r9Jours} au moins, mix §3)`);
    if (p1.pf === "INSTAGRAM") return refus("1re diffusion sur Instagram (R9 a)");
    const ds = usages.get(j.id) ?? [];
    return ds.length === 1 && ds[0] === p1.date ? deJoke(j) : null;
  }

  function avertir(m: string): null {
    if (!warnings.includes(m)) warnings.push(m);
    return null;
  }

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

  /**
   * Vanne simple du pool sur une case de relais abandonnée (CASES_VANNE) : mêmes règles que tout tirage
   * (pool, exclusions, anti-répétition, R6), sans renvoi ni lien. Tirée après tous les posts du lot, à la place
   * du repli qu'aurait eu le relais : elle ne prend aucune vanne aux autres posts, et les replis qui suivent
   * restent ceux du plan d'origine.
   */
  function construireDifferees(): void {
    for (const d of [...differees].reverse()) {
      const avant = posts.length;
      construireVanne(d.date, d.pf, "VANNE", d.note);
      if (posts.length > avant) posts.splice(d.rang, 0, posts.pop()!);
    }
  }

  function construire(): void {
    const parCase = new Map(FIXES.map((f) => [`${f.date}|${f.platform}`, f]));
    const forces = new Map(RELAIS_FORCES.map((r) => [`${r.date}|${r.platform}`, r]));
    const casesVanne = new Map(CASES_VANNE.map((c) => [`${c.date}|${c.platform}`, c]));
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
        // Case de conseil nominale (plan §3) : son conseil passe avant la vanne, qui retourne au tirage.
        if (conseilNominal(date, pf)) continue;
        // Relais LinkedIn validé (mix §2) : sa case avant toute vanne hors thème bureau.
        if (relaisLinkedInValide(date, pf, relaisLiParSemaine)) continue;
        const cv = casesVanne.get(`${date}|${pf}`);
        if (cv) { differees.push({ date, pf, note: cv.note, rang: posts.length }); continue; }
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

  // `signaler = false` : la case retombe ensuite sur une vanne, puis sur le repli du mix (aucune erreur ici).
  function construireRelais(date: string, pf: PreparedPlatform, a: ArticleLot | undefined, utm: string, type: TypePost, note: string | null, signaler = true) {
    if (!a) { errors.push(`${date} ${pf} : article du relais absent.`); return false; }
    const filtreLi = (v: Vanne) => pf !== "LINKEDIN" || nombreDePhrases(texteDe(v)) <= 2;
    let v = ligneRelais(a, date, pf, (x) => filtreLi(x) && filtreReseau(pf, "x".repeat(80))(x));
    let n = note;
    if (!v) {
      const themes = C.THEME_ARTICLE[a.slug] ?? [];
      v = tirer(pf, date, (x) => filtreLi(x) && filtreReseau(pf, "x".repeat(80))(x), (x) => themes.includes(x.categorie ?? ""));
      n = `${note ? `${note} ` : ""}Aucune ligne de l'article disponible : vanne du catalogue du même thème (v5 §1, relais (2)).`;
    }
    if (!v) {
      if (signaler) errors.push(`${date} ${pf} : aucune ligne ni vanne pour le relais de ${a.slug}.`);
      else warnings.push(`${date} ${pf} : aucune ligne ni vanne pour le relais de ${a.slug} : case servie par une vanne, sinon par le repli du mix.`);
      return false;
    }
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
    // Aucune vanne au niveau : la case passe au repli du mix (barre Alexa intacte, [CHOIX UTILISATEUR] du 06/10).
    if (!v) { aReplier.push({ date, pf }); return; }
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
      if (a && construireRelais(date, pf, a, t === "RELAIS_LUNDI" ? "lundi" : "jeudi", "RELAIS", null, false)) return;
      const note = date === REFONTE_17_12 ? "17/12 : vanne simple sans lien (refonte 2027 non confirmée)." : `Aucun article le ${date} : vanne.`;
      return construireVanne(date, pf, "VANNE", note, t === "RELAIS_JEUDI");
    }
    // LinkedIn : relais d'article à angle bureau (lundi pour le mardi, jeudi pour le jeudi), 1 par semaine au plus.
    const semaine = mondayOf(date);
    const a = articleParDate.get(t === "LI_MARDI" ? addDays(date, -1) : date);
    if (a && estAngleBureau(a) && !relaisLi.get(semaine) && construireRelais(date, pf, a, "relais", "RELAIS", null, false)) {
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
  // Carrousel R9 du mix : réutilisation unique contrôlée à la construction (28 jours, 1re diffusion hors Instagram).
  for (const p of posts) if (p.mix?.format !== "carrousel") for (const k of p.vannes) parCle.set(k, [...(parCle.get(k) ?? []), p.date]);
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
    // 2e relais LinkedIn admis seulement en repli du mix (LinkedIn sans vanne, mix-formats-s15.md §2).
    const relaisLi = ps.filter((p) => p.platform === "LINKEDIN" && p.lien);
    if (relaisLi.length > 2 || (relaisLi.length === 2 && !relaisLi.some((p) => p.mix))) errors.push(`Semaine du ${s} : ${relaisLi.length} relais LinkedIn.`);
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
