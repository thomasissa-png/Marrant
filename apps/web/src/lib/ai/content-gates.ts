/**
 * Gates programmatiques de publication (lot Q3, s14) : sans LLM, avant tout
 * enregistrement d'un contenu généré (conseil, article, post social,
 * description de vidéo).
 *
 *  (a) tirets cadratins : remplacés automatiquement (stripEmDashes, ponctuation
 *      seulement, aucun mot touché) ;
 *  (b) gros mots / vulgarités : rejet ;
 *  (c) vouvoiement adressé au lecteur : rejet (le site tutoie toujours) ;
 *  (d) auto-mention IA (« généré par IA », « en tant qu'IA », « notre IA ») :
 *      rejet. L'IA comme SUJET reste autorisée (décision V6) ;
 *  (e) marques / séries / plateformes nommées : signalées dans les logs, jamais
 *      rejetées.
 *
 * Politique d'appel (voir `runWithContentGates`) : une seule régénération
 * maximum, puis repli propre à chaque contenu. Jamais de boucle.
 */
import { stripEmDashes } from "@/lib/em-dash";

export type ContentGateCode = "VULGARITE" | "VOUVOIEMENT" | "MENTION_IA";

export interface ContentGateReport<T> {
  /** Contenu après corrections automatiques (tirets cadratins). */
  value: T;
  ok: boolean;
  /** Motifs de rejet (codes + extrait). Vide si ok. */
  rejections: Array<{ code: ContentGateCode; field: string; match: string }>;
  /** Signalements non bloquants (marques, séries, plateformes). */
  flags: Array<{ field: string; match: string }>;
  /** Nombre de champs modifiés par le retrait des tirets cadratins. */
  emDashFieldsFixed: number;
}

// Frontières Unicode : \b ne gère pas les lettres accentuées (« enculé »).
const L = "(?<![\\p{L}\\p{N}_])";
const R = "(?![\\p{L}\\p{N}_])";

const VULGAR_WORDS = [
  "putain", "putains", "pute", "putes", "merde", "merdes", "merdique", "merdiques",
  "emmerd\\p{L}*", "chier", "chiant", "chiante", "chiants", "chiantes", "chiotte", "chiottes",
  "bordel", "connard", "connards", "connasse", "connasses", "con", "cons", "conne", "connes",
  "connerie", "conneries", "enculé", "enculée", "enculés", "enculer", "enfoiré", "enfoirée", "enfoirés",
  "salaud", "salauds", "salope", "salopes", "pétasse", "pétasses", "couille", "couilles",
  "couillon", "bite", "bites", "niquer", "nique", "foutre", "branleur", "branleuse", "bâtard", "bâtards",
  "ta gueule", "ferme ta gueule", "cul", "trou du cul", "fdp", "ntm", "wtf",
];
const VULGAR_RE = new RegExp(`${L}(?:${VULGAR_WORDS.join("|")})${R}(?!-de-sac)`, "giu");

// Vouvoiement du lecteur : « vous » + verbe courant, « votre X », « vos X ».
const VOUS_RE = new RegExp(
  `${L}(?:vous\\s+(?:êtes|avez|devez|pouvez|devriez|pourriez|allez|venez|faites|voulez|pensez|trouvez|savez|croyez|aimez|serez|aurez|verrez|n'avez|n'êtes|souhaitez|cherchez|voyez)|votre|vos)${R}`,
  "giu",
);
// Phrases où « vous » est un pluriel adressé à « toi + quelqu'un » : exclues.
const PLURAL_TU_RE = /(toi et|et toi|vous deux|vous trois|vous tous|vous toutes|entre vous|toi, tes|tes potes et toi|ton pote et toi)/iu;

const AI_SELF_MENTION_RE = new RegExp(
  [
    `(?:généré|générée|générés|générées|écrit|écrite|écrits|rédigé|rédigée|rédigés|créé|créée|produit|produite|propulsé|propulsée)\\s+(?:par|avec|grâce à)\\s+(?:une\\s+|l['’]\\s*|notre\\s+|nos\\s+)?(?:ia|i\\.a\\.|intelligence artificielle|chatgpt|claude|modèle de langage)${R}`,
    `en tant qu['’]\\s*(?:ia|intelligence artificielle|assistant(?:e)? (?:virtuel|ia)|modèle de langage)${R}`,
    `${L}(?:notre|nos)\\s+(?:ia|i\\.a\\.|intelligence artificielle|algorithme|assistant ia)${R}`,
    `${L}je suis (?:une\\s+|un\\s+)?(?:ia|intelligence artificielle|modèle de langage|assistant virtuel)${R}`,
    `${L}as an ai${R}`,
  ].join("|"),
  "giu",
);

/** Marques / séries / plateformes : signalement seulement (log). */
const BRAND_WORDS = [
  "netflix", "disney", "disney\\+", "prime video", "amazon", "marvel", "hbo", "canal\\+",
  "kaamelott", "friends", "the office", "game of thrones", "squid game", "stranger things",
  "koh-lanta", "star wars", "harry potter", "mcdo", "mcdonald['’]?s", "uber eats", "deliveroo",
  "coca-cola", "nike", "ikea", "apple", "iphone", "samsung", "tiktok", "instagram", "youtube",
  "twitter", "linkedin", "facebook", "snapchat", "tinder", "meetic", "duolingo", "babbel",
  "masterclass", "udemy", "openclassrooms",
];
const BRAND_RE = new RegExp(`${L}(?:${BRAND_WORDS.join("|")})${R}`, "giu");

/** Retire les passages cités (dialogues d'exemple) avant le test du vouvoiement. */
function stripQuoted(text: string): string {
  return text
    .replace(/«[^»]*»/g, " ")
    .replace(/“[^”]*”/g, " ")
    .replace(/"[^"\n]*"/g, " ")
    .split("\n")
    .filter((line) => !/^\s*(?:[-—–]\s|>)/.test(line))
    .join("\n");
}

function firstMatch(re: RegExp, text: string): string | null {
  re.lastIndex = 0;
  const m = re.exec(text);
  re.lastIndex = 0;
  return m ? m[0] : null;
}

export function findVulgarity(text: string): string | null {
  return firstMatch(VULGAR_RE, text);
}

export function findReaderVouvoiement(text: string): string | null {
  const sentences = stripQuoted(text).split(/(?<=[.!?\n])\s+/u);
  for (const s of sentences) {
    if (PLURAL_TU_RE.test(s)) continue;
    const m = firstMatch(VOUS_RE, s);
    if (m) return m;
  }
  return null;
}

export function findAiSelfMention(text: string): string | null {
  return firstMatch(AI_SELF_MENTION_RE, text);
}

export function findBrandMentions(text: string): string[] {
  BRAND_RE.lastIndex = 0;
  const found = new Set<string>();
  for (const m of text.matchAll(BRAND_RE)) found.add(m[0]);
  return [...found];
}

/**
 * Applique les gates (a)-(e) aux champs texte listés. Les champs absents ou
 * non textuels sont ignorés. Fonction pure (hors log des signalements).
 */
export function applyContentGates<T extends object>(
  content: T,
  fields: ReadonlyArray<keyof T & string>,
  label = "contenu",
): ContentGateReport<T> {
  const value = { ...content } as T;
  const rejections: ContentGateReport<T>["rejections"] = [];
  const flags: ContentGateReport<T>["flags"] = [];
  let emDashFieldsFixed = 0;

  for (const field of fields) {
    const raw = (value as Record<string, unknown>)[field];
    let cleaned: string;
    if (Array.isArray(raw)) {
      // Champ liste (ex. threadParts) : chaque élément est corrigé, le test
      // porte sur l'ensemble.
      const parts = raw.map((p) => (typeof p === "string" && p.includes("—") ? stripEmDashes(p) : p));
      if (parts.some((p, i) => p !== raw[i])) {
        (value as Record<string, unknown>)[field] = parts;
        emDashFieldsFixed++;
      }
      cleaned = parts.filter((p): p is string => typeof p === "string").join("\n");
      if (!cleaned) continue;
    } else {
      if (typeof raw !== "string" || raw.length === 0) continue;
      cleaned = raw.includes("—") ? stripEmDashes(raw) : raw;
      if (cleaned !== raw) {
        (value as Record<string, unknown>)[field] = cleaned;
        emDashFieldsFixed++;
      }
    }
    const vulgar = findVulgarity(cleaned);
    if (vulgar) rejections.push({ code: "VULGARITE", field, match: vulgar });
    const vous = findReaderVouvoiement(cleaned);
    if (vous) rejections.push({ code: "VOUVOIEMENT", field, match: vous });
    const ai = findAiSelfMention(cleaned);
    if (ai) rejections.push({ code: "MENTION_IA", field, match: ai });
    for (const match of findBrandMentions(cleaned)) flags.push({ field, match });
  }

  if (flags.length > 0) {
    console.log(
      `[ContentGates] ${label} : marques/séries citées (signalement, pas de rejet) : ${flags.map((f) => `${f.field}=${f.match}`).join(", ")}`,
    );
  }
  if (rejections.length > 0) {
    console.warn(
      `[ContentGates] ${label} rejeté : ${rejections.map((r) => `${r.code} (${r.field} : « ${r.match} »)`).join(" ; ")}`,
    );
  }

  return { value, ok: rejections.length === 0, rejections, flags, emDashFieldsFixed };
}

/** Feedback court à injecter dans la régénération unique. */
export function describeRejections(report: { rejections: ContentGateReport<unknown>["rejections"] }): string {
  const labels: Record<ContentGateCode, string> = {
    VULGARITE: "gros mot ou vulgarité",
    VOUVOIEMENT: "vouvoiement du lecteur (tutoie toujours)",
    MENTION_IA: "le texte se présente comme écrit par une IA",
  };
  return report.rejections.map((r) => `${labels[r.code]} (« ${r.match} »)`).join(" ; ");
}

export type GatedOutcome<T> =
  | { ok: true; value: T; regenerated: boolean; report: ContentGateReport<T> }
  | { ok: false; regenerated: boolean; report: ContentGateReport<T> };

/**
 * Politique commune : passe les gates ; si rejet, UNE régénération (motif en
 * feedback) ; si nouveau rejet, `ok: false` et l'appelant applique son repli
 * (conseil du stock, pas de post, article reporté). Jamais de boucle : au plus
 * un appel supplémentaire à `regenerate`.
 */
export async function runWithContentGates<T extends object>(
  first: T,
  regenerate: (feedback: string) => Promise<T>,
  fields: ReadonlyArray<keyof T & string>,
  label: string,
): Promise<GatedOutcome<T>> {
  const report = applyContentGates(first, fields, label);
  if (report.ok) return { ok: true, value: report.value, regenerated: false, report };

  const feedback = `REJET AUTOMATIQUE : ${describeRejections(report)}. Corrige sans changer l'idée.`;
  let second: T;
  try {
    second = await regenerate(feedback);
  } catch (err) {
    console.warn(`[ContentGates] ${label} : régénération impossible, repli.`, err);
    return { ok: false, regenerated: true, report };
  }
  const report2 = applyContentGates(second, fields, `${label} (régénéré)`);
  if (report2.ok) return { ok: true, value: report2.value, regenerated: true, report: report2 };
  return { ok: false, regenerated: true, report: report2 };
}
