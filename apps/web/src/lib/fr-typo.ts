/**
 * Typographie française au rendu : espaces insécables là où le français
 * interdit une coupure de ligne. Ne modifie jamais le texte stocké
 * (articles, vannes, FAQ) : à appeler uniquement dans le JSX / le HTML rendu,
 * jamais dans `metadata` ni dans le JSON-LD.
 */

// Espace insécable (U+00A0), écrite par son code pour rester visible dans le source.
export const NBSP = String.fromCharCode(0xa0);

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

/**
 * s21 (lettre) : seulement la ponctuation haute (« : ; ! ? ») et les guillemets
 * (« … ») liés au mot voisin. Aucun autre caractère touché : sûr pour les
 * e-mails texte (liens, jetons) et les textes validés mot pour mot.
 */
export function frPonctuation(text: string): string {
  return text.replace(SPACES_BEFORE_PUNCT, `${NBSP}$1`).replace(SPACES_AFTER_OPEN, `«${NBSP}`);
}

// Revue visuelle s21 (verdict @design, décision 4) : filtre d'affichage, aucun mot changé, la donnée
// stockée reste intacte. Apostrophe droite entre deux lettres : apostrophe typographique.
const APOSTROPHE_DROITE = /(\p{L})'(?=\p{L})/gu;
// Guillemets droits appariés sur une ligne : guillemets français (insécables posés ensuite).
const GUILLEMETS_DROITS = /"([^"\n]+)"/g;
// Tiret cadratin entre deux espaces (règle 12 du projet) : virgule, en filet de sécurité.
const CADRATIN_ESPACE = / — /g;

// Revue visuelle s21, tour 5 (T4-01) : tiret d'incise précédé d'une espace (« Roman Frayssinet - L’intelligence
// des animaux », titres en base avec un trait d'union entre deux espaces, ou « – », « — ») : insécable avant le
// tiret, il ne commence jamais une ligne. Seule l'espace change. Jamais en début de ligne ni après une autre
// espace (puces de liste « - » ou «   - » intactes).
const ESPACE_AVANT_TIRET = /(?<=\S) (?=[–—]|-(?= ))/g;

// Revue visuelle s21, tour 4 (T3-02) : mot composé court (« stand-up », « start-up », « rendez-vous »)
// jamais coupé après son trait d'union (« stand- / up »). Gluon (U+2060) après le trait d'union, comme
// pour l'impératif : le trait d'union insécable U+2011 n'est pas dans les polices du site (sous-ensembles
// Inter et Plus Jakarta Sans), il s'afficherait dans une police de secours. Hors URL, ancres, adresses et
// slugs (ni point, barre, arobase, dièse ni paramètre autour du mot).
const MOT_COMPOSE = /(?<![\p{L}\p{N}\-./@_#?=&])(\p{L}+)-(\p{L}+)(?![\p{L}\p{N}\-/@_#?=&]|\.[\p{L}\p{N}])/gu;
const COMPOSES_LONGS = new Set(["auto-dérision", "e-mail", "e-mails"]);
const lierCompose = (mot: string, a: string, b: string): string =>
  (a.length >= 2 && b.length >= 2 && mot.length < 12) || COMPOSES_LONGS.has(mot.toLowerCase()) ? `${a}-${GLUON}${b}` : mot;

/** Seulement la liaison des mots composés courts (T3-02), sans le reste de `frTypo`. */
export function lierComposes(text: string): string {
  return text.replace(MOT_COMPOSE, lierCompose);
}

export function frTypo(text: string): string {
  return (
    // « mot : » ne se coupe plus avant la ponctuation haute ; « mot » ne se coupe plus après le guillemet ouvrant
    frPonctuation(
      text
        .replace(APOSTROPHE_DROITE, "$1’")
        .replace(GUILLEMETS_DROITS, "« $1 »")
        .replace(CADRATIN_ESPACE, ", ")
        .replace(MOT_COMPOSE, lierCompose),
    )
      // « 7 techniques », « 5 min » restent liés
      .replace(/(\d) (?=[A-Za-zÀ-ÿ€%°])/g, `$1${NBSP}`)
      // « 4 812 » et « 23 h 40 » ne se coupent jamais (notation B2 iter2)
      .replace(/(\d) (?=\d{3}(?!\d))/g, `$1${NBSP}`)
      .replace(new RegExp(`(\\d${NBSP}h) (?=\\d)`, "g"), `$1${NBSP}`)
      .replace(ESPACE_AVANT_TIRET, NBSP)
  );
}

// Lot D11c (revue d'harmonie de la préversion s24, défauts 7, 8 et 11) : espace fine insécable (U+202F).
export const FINE = String.fromCharCode(0x202f);
const BLANC = `[ ${NBSP}${FINE}]+`;
const AVANT_PONCTUATION_HAUTE = new RegExp(`${BLANC}([;:!?])`, "g");
const APRES_GUILLEMET_OUVRANT = new RegExp(`«${BLANC}`, "g");
const AVANT_GUILLEMET_FERMANT = new RegExp(`${BLANC}»`, "g");
const AVANT_CHEVRON_OU_FLECHE = new RegExp(`${BLANC}([›→])`, "g");

/**
 * Typographie de l'espace client (lot D11c) : seules les espaces changent, aucun mot, aucune apostrophe.
 * Fine insécable (U+202F) avant « ; : ! ? », après « « » et avant « » » (la même des deux côtés du guillemet :
 * une insécable pleine avant « » » faisait « «Et toi, tu fais quoi ? » », dissymétrique à l'œil) ;
 * insécable (U+00A0) avant « › » et « → ».
 * N'ajoute jamais d'espace là où il n'y en a pas (« 10:30 », « https: »). Idempotente. Rendu seulement :
 * la donnée (JSON de l'espace, base) reste intacte.
 */
export function frEspace(text: string): string {
  return text
    .replace(AVANT_PONCTUATION_HAUTE, `${FINE}$1`)
    .replace(APRES_GUILLEMET_OUVRANT, `«${FINE}`)
    .replace(AVANT_GUILLEMET_FERMANT, `${FINE}»`)
    .replace(AVANT_CHEVRON_OU_FLECHE, `${NBSP}$1`);
}

/** Clés jamais retouchées par `frEspaceProfond` (adresses, identifiants, valeurs techniques). */
const CLES_TECHNIQUES = new Set(["id", "cle", "type", "href", "slug", "url", "src", "lien", "adresse", "email", "ancre", "theme", "registre", "contexteId", "videoId"]);

/**
 * `frEspace` sur chaque texte d'un objet (fiche, carte, textes de l'interface), fonctions comprises (leur
 * résultat texte). Retourne une copie : l'objet d'origine (donnée importée, config) n'est pas modifié.
 */
export function frEspaceProfond<T>(valeur: T): T {
  return profond(valeur, "") as T;
}

function profond(v: unknown, cle: string): unknown {
  if (typeof v === "string") return CLES_TECHNIQUES.has(cle) ? v : frEspace(v);
  if (typeof v === "function") {
    const f = v as (...a: unknown[]) => unknown;
    return (...a: unknown[]) => profond(f(...a), cle);
  }
  if (Array.isArray(v)) return v.map((x) => profond(x, cle));
  if (v && typeof v === "object" && !("$$typeof" in v) && Object.getPrototypeOf(v) === Object.prototype) {
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, profond(x, k)]));
  }
  return v;
}
