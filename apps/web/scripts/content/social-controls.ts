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
 *  3. (Retiré le 05/10/2026, P0 Thomas : les humoristes nommés et cités sont
 *     autorisés, « on est un site d'humoriste ». Ne jamais réintroduire ce contrôle.)
 *  4. Zéro « je » hors de la vanne : la vanne est reprise mot pour mot (elle peut
 *     parler à la 1re personne), mais la ligne de marque ou le titre ajoutés ne
 *     parlent jamais au nom d'une personne (le compte = la marque, règle du 05/05).
 *  5. Longueur : X 270 caractères pondérés (lien = 23, règle de X ; fils interdits :
 *     publish-social refuse tout post X plus long, sans découpage), légende Instagram
 *     150 (80 pour le lot v5, `maxLength`), LinkedIn 1300.
 *  6. (s15, v5 R6) `r6: true` : le « je » n'est admis qu'entre « » (vanne citée) ;
 *     hors guillemets, le texte de marque ne parle jamais à la 1re personne.
 *  7. (s15, v5 R4) LinkedIn : 3 phrases au plus (ligne du lien exclue).
 */

import { longueurX } from "../../src/lib/social/longueur-x";

export { longueurX };

export type PreparedPlatform = "TWITTER" | "INSTAGRAM" | "LINKEDIN";

/** Limites de longueur du texte publié (caractères JS, saut de ligne compris). */
export const MAX_LENGTH: Record<PreparedPlatform, number> = {
  // Consigne Thomas : X 280. Bloqué à 270 : publish-social refuse (FAILED « fil X
  // interdit ») tout tweet de plus de 270 caractères (s15, plus de découpage).
  TWITTER: 270,
  INSTAGRAM: 150,
  // LinkedIn (s15) : limite Buffer 1300 ; l'amorce doit en plus tenir avant
  // « voir plus » (140 caractères), contrôlé par social-month-plan.
  LINKEDIN: 1300,
};

const EM_DASH = /[—―]/;

/** Gros mots : mots entiers (et leurs formes courantes). */
export const FORBIDDEN_WORDS = [
  "merde", "merdes", "merdique", "putain", "connard", "connards", "connasse", "conne", "con", "cons",
  "salope", "salopes", "salaud", "enculé", "enculés", "enculer", "bite", "bites", "couille", "couilles",
  "chier", "chiant", "chiante", "foutre", "nique", "niquer", "pute", "putes", "bordel", "enfoiré",
  "enfoirés", "bâtard", "batard", "cul", "baiser", "baisé", "baisés", "branler", "teub", "zob",
];

/** Première personne du singulier (je, j', me, m', moi, mon, ma, mes). */
// (s15) j' et m' sont suivis d'une lettre (« j'ai ») : pas de frontière de mot après l'apostrophe.
const FIRST_PERSON = /(^|[^\p{L}])((je|me|moi|mon|ma|mes)(?=[^\p{L}]|$)|[jm]['’])/iu;
/** Narrateur au pluriel (« nos salaires », « notre frigo ») : la vanne est aussi citée (R6). */
const FIRST_PERSON_PLURAL = /(^|[^\p{L}])(nous|nos|notre)(?=[^\p{L}]|$)/iu;

/** Vrai si le texte parle à la 1re personne du singulier (vanne à citer entre « », R6). */
export function premierePersonne(texte: string): boolean {
  return FIRST_PERSON.test(texte) || FIRST_PERSON_PLURAL.test(texte);
}

function wordRegex(word: string, flags: string): RegExp {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}])${escaped}(?=[^\\p{L}]|$)`, flags);
}

const FORBIDDEN_RES = FORBIDDEN_WORDS.map((w) => ({ w, re: wordRegex(w, "iu") }));

/** Texte hors citations « … » (imbrications comprises) et hors liens. */
export function horsCitations(texte: string): string {
  let out = "";
  let niveau = 0;
  for (const ch of texte) {
    if (ch === "«") niveau++;
    else if (ch === "»") niveau = Math.max(0, niveau - 1);
    else if (niveau === 0) out += ch;
  }
  return out.replace(/https?:\/\/\S+/g, "");
}

/**
 * Nombre de phrases (LinkedIn, v5 R4) : une fin de phrase est . ! ? ou … suivi
 * (après guillemets fermants éventuels) d'une majuscule, d'un « ouvrant ou de la
 * fin. « t'as deux minutes ? » et rien d'autre » reste une seule phrase.
 * Les lignes qui ne contiennent qu'un lien sont ignorées.
 */
export function nombreDePhrases(texte: string): number {
  const corps = texte.split("\n").filter((l) => !/^\s*https?:\/\/\S+\s*$/.test(l)).join(" ").trim();
  if (!corps) return 0;
  const fins = corps.match(/[.!?…][\s\u00a0\u202f]*[»”"]?(?=[\s\u00a0\u202f]*(?:$|«|[A-ZÀ-ÖØ-Þ]))/gu) ?? [];
  const dernier = corps.replace(/https?:\/\/\S+/g, "").trim();
  const finale = /[.!?…][\s\u00a0\u202f]*[»”"]?$/.test(dernier);
  return fins.length + (finale ? 0 : 1);
}

export const LINKEDIN_MAX_PHRASES = 3;

export interface ControlInput {
  platform: PreparedPlatform;
  /** Texte publié tel quel (tweet ou légende Instagram). */
  text: string;
  /** Texte de la carte image (Instagram), contrôlé hors longueur. */
  cardText?: string;
  /** Partie reprise mot pour mot du catalogue (vanne ou titre d'article) : exclue du contrôle « je ». */
  quoted: string;
  /** v5 R6 : le « je » n'est admis qu'entre « » (le champ `quoted` est alors ignoré). */
  r6?: boolean;
  /** Plafond de longueur propre au post (ex. légende Instagram v5 : 80). */
  maxLength?: number;
}

/** Retourne la liste des violations (vide = post accepté). */
export function checkPost(input: ControlInput): string[] {
  const errors: string[] = [];
  const all = [input.text, input.cardText ?? ""].join("\n");

  if (EM_DASH.test(all)) errors.push("tiret cadratin");
  for (const { w, re } of FORBIDDEN_RES) if (re.test(all)) errors.push(`mot interdit « ${w} »`);

  // Hors vanne : on retire la partie reprise mot pour mot (ou, en R6, tout ce qui
  // est entre « ») et les liens (slugs).
  const outside = input.r6
    ? horsCitations(input.text)
    : (input.quoted ? input.text.split(input.quoted).join("\n") : input.text).replace(/https?:\/\/\S+/g, "");
  if (FIRST_PERSON.test(outside)) errors.push(input.r6 ? "« je » hors des « » (R6)" : "« je » hors de la vanne");

  const max = Math.min(MAX_LENGTH[input.platform], input.maxLength ?? Infinity);
  const len = input.platform === "TWITTER" ? longueurX(input.text) : [...input.text].length;
  if (len > max) errors.push(`trop long (${len} > ${max} caractères)`);
  if (input.platform === "LINKEDIN") {
    const n = nombreDePhrases(input.text);
    if (n > LINKEDIN_MAX_PHRASES) errors.push(`LinkedIn : ${n} phrases (max ${LINKEDIN_MAX_PHRASES})`);
  }
  return errors;
}
