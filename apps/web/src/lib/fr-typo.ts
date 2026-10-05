/**
 * Typographie française au rendu : espaces insécables là où le français
 * interdit une coupure de ligne. Ne modifie jamais le texte stocké
 * (articles, vannes, FAQ) : à appeler uniquement dans le JSX / le HTML rendu,
 * jamais dans `metadata` ni dans le JSON-LD.
 */

// Espace insécable (U+00A0), écrite par son code pour rester visible dans le source.
const NBSP = String.fromCharCode(0xa0);

// Idempotente : une insécable déjà présente (seule ou collée à une espace) donne
// une seule insécable, jamais deux.
const SPACES_BEFORE_PUNCT = new RegExp(`(?:${NBSP}* +${NBSP}*)([:;!?»])`, "g");
const SPACES_AFTER_OPEN = new RegExp(`«(?:${NBSP}* +${NBSP}*)`, "g");

export function frTypo(text: string): string {
  return (
    text
      // « mot : » ne se coupe plus avant la ponctuation haute
      .replace(SPACES_BEFORE_PUNCT, `${NBSP}$1`)
      // « mot » ne se coupe plus après le guillemet ouvrant
      .replace(SPACES_AFTER_OPEN, `«${NBSP}`)
      // « 7 techniques », « 5 min » restent liés
      .replace(/(\d) (?=[A-Za-zÀ-ÿ€%°])/g, `$1${NBSP}`)
      // « 4 812 » et « 23 h 40 » ne se coupent jamais (notation B2 iter2)
      .replace(/(\d) (?=\d{3}(?!\d))/g, `$1${NBSP}`)
      .replace(new RegExp(`(\\d${NBSP}h) (?=\\d)`, "g"), `$1${NBSP}`)
  );
}
