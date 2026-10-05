// ───────────────────────────────────────────────────────────────────
// Typographie française des cartes sociales (audit visuels s15, §5.7)
//
// Une seule fonction, appliquée à tout texte affiché sur une carte :
//   - apostrophe typographique ’ à la place de '
//   - "…" et « … » : guillemets français avec espace insécable ;
//     un « » imbriqué dans un « … » devient “…” (choix fondateur 05/10)
//   - espace fine insécable avant ; ? ! et insécable avant :
//   - nombre collé au mot suivant (« 8 vannes »)
//   - petits mots (à, le, les, aux…) collés au mot suivant
//   - deux derniers mots collés (pas d'orphelin en fin de paragraphe)
//
// Les espaces insécables sont écrites en échappement : un caractère
// invisible dans le source serait illisible à la relecture.
// ───────────────────────────────────────────────────────────────────

/** Espace insécable (avant « : », dans « »). */
export const NBSP = " ";
/** Espace fine insécable (avant ; ? !). */
export const NNBSP = " ";

/** Mots courts qu'on ne laisse jamais seuls en fin de ligne. */
const MOTS_COURTS = new Set([
  "à", "a", "au", "aux", "y", "en", "et", "ou", "le", "la", "les", "l’",
  "de", "du", "des", "d’", "un", "une", "je", "j’", "tu", "il", "on",
  "ma", "ta", "sa", "mon", "ton", "son", "mes", "tes", "ses", "ce", "se",
  "ne", "n’", "qu’", "s’", "m’", "t’", "par", "sur", "pour", "dans",
]);

/** Guillemets droits et imbriqués → « » de 1er niveau, “ ” au 2e. */
function guillemets(text: string): string {
  let out = "";
  let ouvertDroit = false;
  let profondeur = 0;
  for (const c of text) {
    let ch = c;
    if (ch === '"') {
      ch = ouvertDroit ? "»" : "«";
      ouvertDroit = !ouvertDroit;
    }
    if (ch === "«") {
      out += profondeur > 0 ? "“" : "«";
      profondeur++;
    } else if (ch === "»") {
      profondeur = Math.max(0, profondeur - 1);
      out += profondeur > 0 ? "”" : "»";
    } else {
      out += ch;
    }
  }
  return out;
}

function nettoyerMot(mot: string): string {
  return mot.replace(/^[«“(]+/, "").toLowerCase();
}

/** Choisit l'espace entre deux mots consécutifs d'un paragraphe. */
function espaceEntre(gauche: string, droite: string, avantDernier: boolean): string {
  if (/^[:»]/.test(droite)) return NBSP;
  if (/^[;?!]/.test(droite)) return NNBSP;
  if (gauche === "«" || gauche.endsWith("«")) return NBSP;
  if (/\d$/.test(gauche) && /^[A-Za-zÀ-ÖØ-öø-ÿŒœ]/.test(droite)) return NBSP;
  if (MOTS_COURTS.has(nettoyerMot(gauche))) return NBSP;
  if (avantDernier) return NBSP;
  return " ";
}

function paragraphe(ligne: string): string {
  const mots = ligne.trim().split(/ +/).filter(Boolean);
  if (mots.length === 0) return "";
  // Nombre de « vrais » mots (hors ponctuation isolée) pour l'anti-orphelin.
  const vrais = mots.filter((m) => !/^[:;?!»«]+$/.test(m)).length;
  let out = mots[0];
  let bloc = mots[0].length; // longueur du bloc insécable en cours
  for (let i = 1; i < mots.length; i++) {
    // Anti-orphelin : coller les 2 derniers mots, sauf si le bloc
    // insécable obtenu dépasse 18 caractères (en Syne 800 grand corps,
    // un bloc plus long forcerait une forte réduction du corps).
    const dernier = i === mots.length - 1;
    const avantDernier = vrais >= 4 && dernier && bloc + 1 + mots[i].length <= 18;
    const sep = espaceEntre(mots[i - 1], mots[i], avantDernier);
    out += sep + mots[i];
    bloc = sep === " " ? mots[i].length : bloc + 1 + mots[i].length;
  }
  return out;
}

/**
 * Applique la typographie française à un texte de carte.
 * Les retours à la ligne (\n) délimitent les paragraphes.
 */
export function typo(text: string): string {
  const base = guillemets(
    text
      .replace(/\.\.\./g, "…")
      .replace(/'/g, "’")
      .replace(/[  ]/g, " "),
  )
    // « x » : un espace de chaque côté, collé ensuite par paragraphe()
    .replace(/«\s*/g, "« ")
    .replace(/\s*»/g, " »")
    // “x” imbriqué : jamais d'espace intérieur
    .replace(/“\s+/g, "“")
    .replace(/\s+”/g, "”")
    // ponctuation haute collée au mot : « parlé? » → « parlé ? »
    .replace(/([^\s?!;])([?!;])/g, "$1 $2");
  return base
    .split("\n")
    .map(paragraphe)
    .join("\n");
}
