/**
 * Typographie française au rendu : espaces insécables là où le français
 * interdit une coupure de ligne. Ne modifie jamais le texte stocké
 * (articles, vannes, FAQ) : à appeler uniquement dans le JSX / le HTML rendu,
 * jamais dans `metadata` ni dans le JSON-LD.
 */

// Espace insécable (U+00A0), écrite par son code pour rester visible dans le source.
const NBSP = String.fromCharCode(0xa0);

export function frTypo(text: string): string {
  return (
    text
      // « mot : » ne se coupe plus avant la ponctuation haute
      .replace(/ ([:;!?»])/g, `${NBSP}$1`)
      // « mot » ne se coupe plus après le guillemet ouvrant
      .replace(/« /g, `«${NBSP}`)
      // « 7 techniques », « 5 min » restent liés
      .replace(/(\d) (?=[A-Za-zÀ-ÿ€%°])/g, `$1${NBSP}`)
  );
}
