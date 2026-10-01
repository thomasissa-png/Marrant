/**
 * Contrôle bloquant SANS IA des posts sociaux préparés (s14, décision Thomas 01/10/2026).
 *
 * Appliqué par scripts/content/prepare-social-month.ts à chaque post avant toute
 * insertion. Un seul échec = le post est refusé (le script choisit une autre
 * vanne, ou s'arrête en code 1 si aucune ne passe).
 *
 * Règles :
 *  1. Zéro tiret cadratin (règle commune 12).
 *  2. Zéro gros mot (liste ci-dessous, mots entiers, insensible à la casse).
 *  3. Zéro humoriste nommé (règle fondateur du 30/09). Liste constituée à partir des
 *     noms relevés dans docs/social/audit-s14/export-posts.json (636 posts) : ces
 *     noms sont internes au contrôle et ne doivent jamais apparaître dans un post.
 *  4. Zéro « je » hors de la vanne : la vanne est reprise mot pour mot (elle peut
 *     parler à la 1re personne), mais la ligne de marque ou le titre ajoutés ne
 *     parlent jamais au nom d'une personne (le compte = la marque, règle du 05/05).
 *  5. Longueur : X 270 caractères (le cron publish-social découpe en thread au-delà
 *     de 270, or les threads sont interdits : on bloque avant), légende Instagram 150.
 */

export type PreparedPlatform = "TWITTER" | "INSTAGRAM";

/** Limites de longueur du texte publié (caractères JS, saut de ligne compris). */
export const MAX_LENGTH: Record<PreparedPlatform, number> = {
  // Consigne Thomas : X 280. Bloqué à 270 car publish-social transforme tout tweet
  // de plus de 270 caractères en thread (publish-social/route.ts, splitIntoTweetThread).
  TWITTER: 270,
  INSTAGRAM: 150,
};

const EM_DASH = /[—―]/;

/** Gros mots : mots entiers (et leurs formes courantes). */
export const FORBIDDEN_WORDS = [
  "merde", "merdes", "merdique", "putain", "connard", "connards", "connasse", "conne", "con", "cons",
  "salope", "salopes", "salaud", "enculé", "enculés", "enculer", "bite", "bites", "couille", "couilles",
  "chier", "chiant", "chiante", "foutre", "nique", "niquer", "pute", "putes", "bordel", "enfoiré",
  "enfoirés", "bâtard", "batard", "cul", "baiser", "baisé", "baisés", "branler", "teub", "zob",
];

/**
 * Humoristes et vidéastes nommés dans l'historique des posts (export s14).
 * Correspondance sensible à la casse sur le nom tel qu'il s'écrit (mot entier).
 */
export const HUMORIST_NAMES = [
  "Paul Mirabel", "Mirabel", "Fary", "Roman Frayssinet", "Frayssinet", "Blanche Gardin", "Gardin",
  "Waly Dia", "Waly", "Panayotis Pascot", "Panayotis", "Pascot", "Pierre Croce", "Croce", "Inès Reg",
  "Kevin Hart", "Gad Elmaleh", "Elmaleh", "Jérôme Commandeur", "Commandeur", "José Garcia", "Jamel",
  "Debbouze", "Cyprien", "Squeezie",
];

/** Première personne du singulier (je, j', me, m', moi, mon, ma, mes). */
const FIRST_PERSON = /(^|[^\p{L}])(je|j['’]|me|m['’]|moi|mon|ma|mes)(?=[^\p{L}]|$)/iu;

function wordRegex(word: string, flags: string): RegExp {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}])${escaped}(?=[^\\p{L}]|$)`, flags);
}

const FORBIDDEN_RES = FORBIDDEN_WORDS.map((w) => ({ w, re: wordRegex(w, "iu") }));
const HUMORIST_RES = HUMORIST_NAMES.map((w) => ({ w, re: wordRegex(w, "u") }));

export interface ControlInput {
  platform: PreparedPlatform;
  /** Texte publié tel quel (tweet ou légende Instagram). */
  text: string;
  /** Texte de la carte image (Instagram), contrôlé hors longueur. */
  cardText?: string;
  /** Partie reprise mot pour mot du catalogue (vanne ou titre d'article) : exclue du contrôle « je ». */
  quoted: string;
}

/** Retourne la liste des violations (vide = post accepté). */
export function checkPost(input: ControlInput): string[] {
  const errors: string[] = [];
  const all = [input.text, input.cardText ?? ""].join("\n");

  if (EM_DASH.test(all)) errors.push("tiret cadratin");
  for (const { w, re } of FORBIDDEN_RES) if (re.test(all)) errors.push(`mot interdit « ${w} »`);
  for (const { w, re } of HUMORIST_RES) if (re.test(all)) errors.push(`humoriste nommé « ${w} »`);

  // Hors vanne : on retire la partie reprise mot pour mot et les liens (slugs).
  const outside = (input.quoted ? input.text.split(input.quoted).join("\n") : input.text).replace(/https?:\/\/\S+/g, "");
  if (FIRST_PERSON.test(outside)) errors.push("« je » hors de la vanne");

  const max = MAX_LENGTH[input.platform];
  if (input.text.length > max) errors.push(`trop long (${input.text.length} > ${max} caractères)`);
  return errors;
}
