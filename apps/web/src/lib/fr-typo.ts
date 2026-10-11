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

// « à » / « À » isolé (mot d'une lettre) : jamais seul en fin de ligne.
const A_ISOLE = /(^|[\s(«])([àÀ]) (?=\S)/g;

// s19 (S3 @design rendu iter 2) : « En 6 semaines », « en 2 minutes » : « en » lié au nombre qui suit.
const EN_NOMBRE = /(^|[\s(«])([Ee]n) (?=\d)/g;

// Gluon (U+2060, WORD JOINER) : invisible, sans glyphe, interdit la coupure de ligne à cet endroit.
const GLUON = String.fromCharCode(0x2060);

// Impératif + pronom (« Choisis-en », « relis-les », « Dis-moi », « vas-y ») : pas de coupure après le trait d'union.
// Idempotente : un gluon déjà posé n'est jamais doublé (le pronom doit suivre le trait d'union directement).
const IMPERATIF_PRONOM = /(\p{L})-(en|y|le|la|les|lui|moi|toi|nous|vous|leur)(?![\p{L}\p{N}])/gu;

/**
 * s19 (S1 @design rendu iter 2) : gluon après le trait d'union d'un impératif suivi d'un pronom,
 * pour éviter « Choisis- / en » en fin de ligne. Seul un caractère invisible est ajouté.
 * Parcours seulement (défis, conseils, vannes, quiz) : le blog garde `frTypo`.
 */
export function frTypoParcours(text: string): string {
  // Deux passes : « dis-le-moi » (le pronom du milieu sert aussi de radical au suivant).
  const lier = (t: string) => t.replace(IMPERATIF_PRONOM, `$1-${GLUON}$2`);
  return lier(lier(frTypo(text)));
}

/**
 * s19 (N1 @design, rendu Boulot) : `frTypoParcours` + mot d'une lettre « à » et « en » devant
 * un nombre liés au mot suivant. Pour les paragraphes d'accroche des parcours (description,
 * « Pour qui ? », témoignage).
 */
export function frTypoTexte(text: string): string {
  return frTypoParcours(text).replace(A_ISOLE, `$1$2${NBSP}`).replace(EN_NOMBRE, `$1$2${NBSP}`);
}

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
