/**
 * Widget « La vanne du jour » (s22). Source unique de la configuration du
 * widget : publication, liste blanche des vannes, exclusions, domaines bloqués,
 * gabarits de code à copier.
 *
 * Spec : docs/marrant/widget-vanne-du-jour-s22-synthese.md (fait foi),
 * docs/seo/widget-replique-du-jour-s22-seo.md, docs/growth/widget-replique-du-jour-s22-growth.md,
 * docs/legal/widget-vanne-du-jour-s22.md. Revues V1 : docs/qa/qa-widget-s22-v1.md,
 * docs/design/revue-widget-s22-v1.md, docs/reviews/revue-widget-s22-v1.md.
 */

/**
 * Interrupteur de mise en ligne. `false` tant que Thomas n'a pas donné son go
 * écrit : la page du programme répond 404 et sort du sitemap, l'API répond 503
 * et l'iframe affiche le repli neutre sans vanne. Une modification = build et
 * déploiement (c'est une constante du code).
 */
export const WIDGET_VANNE_DU_JOUR_PUBLIE = true;

/**
 * Liste blanche des vannes servies par le widget (identifiants `Joke.id`) :
 * les 93 vannes gardées par les deux relecteurs tout public
 * (docs/growth/widget-relecture-s22/selection-finale.md, 24/10/2026).
 * Une vanne n'est servie que si elle reste dans le pool validé
 * (`VALIDATED_JOKE_WHERE`) et hors catégories exclues.
 * Retirer une vanne : supprimer son identifiant ici, build, déploiement (la clé
 * du cache edge contient une empreinte de cette liste : effet immédiat).
 */
export const WIDGET_JOKE_IDS: readonly string[] = [
  "cmmnsqn12000hth63y5wqmb9d", "cmmw0togs0001mw62152nl589", "cmmw0tois0002mw62b7bkcvj7", "cs14jk42ccc92a7e1c88add1",
  "cs14jka7e683e43af915bb60", "cs14jkab7cdbceeb2bf5da6c", "cs14jkfc1715f1d4c7509f3b", "cmmnsqn120000th63o435xsb0",
  "cmmnsqn130030th6381ol5rxt", "cmmnsqn130038th63fxn1wvhn", "cmmnsqn14004sth63rnutrbwi", "cs14jk2150421b8b4969cb67",
  "cs14jk4e0348d6f06a41d826", "cs14jk9cc844b92fde69e845", "cs14jkafa211aede70b92cc8", "cs14jkc13a4d9d7194d8e5ea",
  "cs14jke6736001250d3a940d", "cmoapu9k80020s60x7jv317hv", "cmonlkgeu000ds60wu0gazutb", "cmoxx7e56003xs60yyooxncw3",
  "cs14jk0aa83dd779a1c72b43", "cs14jk0c96df8dc97a67e3f6", "cs14jk4d523526fb0d6ca24e", "cs14jk69eb578cce484b6f87",
  "cs14jka89abf28d3769b05fe", "cs14jkdb222991fcbf194845", "cs14jke4221e9a31a33b0395", "cs14jke5d015b07714055538",
  "cs14jke956e7ca02641e25c5", "cs14jkefbc9f40abb6f8a2ca", "cs19jkboulot1", "cs19jkboulot2",
  "cs19jkboulot3", "cs19jkboulot4", "cs19jkboulot5", "cs19jkboulot8",
  "cv1105a3e91c7d42b8f06d5e1", "cv11236cb2b8716b34a7f6191", "cmmnsqn130033th63b54ux45o", "cmmnsqn14003rth6379n30nzd",
  "cmmnsqn14004nth638k89q5ig", "cmp9gspno007ms60xngd592ct", "cs14jk19d61c474a856962a1", "cs14jk20142f9a641e8ea80f",
  "cs14jk2f7e474771284319f5", "cs14jk45ee75c68d340d52f2", "cs14jkbc3334e2de46753dcf", "cp05d2c3950800b7575c12ce6",
  "cs14jk177b62432b07f5d17a", "cs14jk95ff5ad63e2e414ac6", "cs14jkfa44f4f0eb4df4e459", "cmmnsqn15006kth63res9rqp9",
  "cs14jk28b5acf3a95217071c", "cs14jkb81aae613b293f204b", "cmmnsqn14003vth63i2are7es", "cs14jk02047ed5635bab6a52",
  "cs14jk4fe660e7238281ce47", "cs14jk50c85bb0d73deaebaf", "cs14jk9de039def971586501", "cmmnsqn16008jth63zwal8rzj",
  "cp0465e601e49c114994d1a00", "cs14jk0e4fedaac1a91fddf1", "cs14jk10c844a13d108646fd", "cs14jk2fd7c7c96d7815407d",
  "cs14jk3ff87c9e6097be570d", "cs14jk5828aab353759ef4d5", "cs14jk5ce9195f000dfa330f", "cs14jk626438b67f197925d2",
  "cs14jk72ac436450535a3c29", "cs14jk88f075a4297ed90830", "cs14jkb541b3fd46a4229415", "cs14jkc4a2c545e132b38a92",
  "cs14jkd11f7913f8177df395", "cs14jkffeab1620070f2263e", "cmmnsqn150074th63m5g2yqip", "cs14jk04b4bc8bbf8a2d8a05",
  "cs14jk44dcd2dbf3ec29324d", "cs14jk7911857c4ff09eb025", "cs14jk7cac6246ac112b5afc", "cs14jk812483721e0a4d4228",
  "cs14jk8c54311509a1108b0a", "cs14jke92ed6178b5326c48c", "cs14jkf0a20e0837fa95c784", "cmnl01zwv004ss60y2ecodj9a",
  "cmnl1ns640055s60yy53xfnbw", "cs14jk2ef0aabfbf4784ad82", "cs14jk577fa779cb48fa9b55", "cs18jkstory5v1",
  "cs18jkstory5v3", "cs18jkstory5v4", "cv13109a2ec9fb9ceba2a1ae3", "cv131698c0aa03a1194d3e2d2",
  "cv141330f7753ee15285ae40a",
];

/** Catégories refusées même si une vanne de la liste blanche y appartient (décision Thomas s22). */
export const WIDGET_CATEGORIES_EXCLUES = ["DATING", "SOIREES", "COUPLE"] as const;

/**
 * Domaines bloqués (@legal s22) : un site dont le Referer (ou l'Origin, côté
 * API) tombe sur un de ces domaines ou un de leurs sous-domaines reçoit une
 * iframe neutre sans vanne et un 403 sur l'API. Écrire le domaine nu, en
 * minuscules, sans « www. » (ex. "exemple.fr"). Limite : une requête sans
 * Referer ni Origin n'est pas bloquable par domaine.
 */
export const DOMAINES_BLOQUES: readonly string[] = [];

/**
 * Domaines dont les affichages ne sont pas comptés (mesure s22) : le site
 * lui-même (aperçu de la page du programme), les environnements locaux et de
 * prévisualisation. Sous-domaines compris.
 */
export const WIDGET_DOMAINES_NON_COMPTES: readonly string[] = [
  "deviens-marrant.fr",
  "localhost",
  "127.0.0.1",
  "workers.dev",
];

/** Origine publique du site (gabarits de code, liens absolus). */
export const WIDGET_ORIGIN = "https://deviens-marrant.fr";
export const WIDGET_EMBED_PATH = "/embed/vanne-du-jour";
export const WIDGET_SCRIPT_PATH = "/widget.js";
export const WIDGET_API_PATH = "/api/widget/v1/vanne-du-jour";
export const WIDGET_PROGRAMME_PATH = "/integrer-la-vanne-du-jour";
/** Libellé du lien de pied de page (s22, go Thomas 24/10), affiché seulement widget ouvert. */
export const WIDGET_LIBELLE_PIED = "Intègre la vanne du jour";
/** Date réelle de dernière modification du texte de la page du programme (sitemap) : à remettre au jour de la validation des textes. */
export const WIDGET_PROGRAMME_LASTMOD = "2026-10-24";
/** Page de documentation de l'API, en anglais (annuaires d'API publiques), publiée avec le widget. */
export const DEVELOPERS_PATH = "/developers";
/** Date réelle de dernière modification du texte de /developers (sitemap). */
export const DEVELOPERS_LASTMOD = "2026-10-24";

/** Titre accessible de l'iframe (attribut `title`). */
export const WIDGET_IFRAME_TITLE = "La vanne du jour, Deviens Marrant";
/**
 * Hauteur réservée selon la LARGEUR de la fenêtre de l'hôte (revue @design v2,
 * N1) : expression CSS posée dans le `style` de l'iframe et le `min-height` du
 * conteneur du script, connue avant tout chargement, donc aucun décalage et
 * aucun JavaScript au chargement. 340 px dès 672 px de large (ordinateur),
 * 518 px à 375 px, 551 px à 320 px, 560 px au plus. Vérifiée sur les 93 vannes
 * de la liste (aucune rognée à 1280, 768, 375 et 320 px) : mesures dans
 * REPLIT_ACTIONS.md, entrée s22.
 */
export const WIDGET_IFRAME_HEIGHT_CSS = "clamp(340px,calc(340px + (672px - 100vw) * .6),560px)";
/** Hauteur de repli (attribut `height`, navigateurs sans `clamp`, hôtes qui retirent le `style`). */
export const WIDGET_IFRAME_HEIGHT = 420;
export const WIDGET_IFRAME_SANDBOX = "allow-scripts allow-popups allow-popups-to-escape-sandbox";
/** Style de l'iframe : rayon identique à la carte, schéma de couleurs déclaré (pas de fond opaque en coins carrés). */
export const WIDGET_IFRAME_STYLE =
  "border:0;border-radius:12px;color-scheme:light dark;display:block;width:100%;max-width:640px;" +
  `height:${WIDGET_IFRAME_HEIGHT}px;height:${WIDGET_IFRAME_HEIGHT_CSS}`;

/** Paramètres UTM des liens sortant du widget (mesure Umami, pas SEO). */
export const WIDGET_UTM = {
  utm_source: "widget",
  utm_medium: "embed",
  utm_campaign: "vanne-du-jour",
} as const;
/** `utm_content` quand le domaine hôte est inconnu (pas de Referer). */
export const WIDGET_UTM_CONTENT_INCONNU = "inconnu";

/** Attribution obligatoire renvoyée par l'API. */
export const WIDGET_ATTRIBUTION = {
  name: "Deviens Marrant",
  url: `${WIDGET_ORIGIN}/`,
  required: true,
} as const;
export const WIDGET_LICENCE_URL = `${WIDGET_ORIGIN}${WIDGET_PROGRAMME_PATH}#licence`;

/** Ancre de la ligne de backlink : la marque seule, aucun mot-clé (décision Thomas s22). */
export const WIDGET_BACKLINK_ANCRE = "Deviens Marrant";

/**
 * Ligne de backlink posée APRÈS le cadre dans les deux codes à copier (décision
 * Thomas s22, docs/founder-preferences.md) : HTML normal dans la page de l'hôte,
 * donc un vrai lien (celui de l'iframe n'en est pas un). Lien suivi (aucun
 * `rel`), vers l'accueil, sans UTM ; facultative pour l'hôte (seul le lien dans
 * le cadre est obligatoire). Hors du conteneur du script : présente même sans
 * JavaScript, et après la hauteur réservée, donc aucun décalage.
 */
export function widgetLigneBacklink(origin: string = WIDGET_ORIGIN): string {
  return (
    `<p style="margin:6px 0 0;font:13px/1.4 system-ui,sans-serif">La vanne du jour par ` +
    `<a href="${origin}/">${WIDGET_BACKLINK_ANCRE}</a></p>`
  );
}

/** Code à copier, format A (iframe seule, aucun JavaScript chez l'hôte), suivi de la ligne de backlink. */
export function widgetIframeSnippet(origin: string = WIDGET_ORIGIN, theme?: "clair" | "sombre"): string {
  const query = theme ? `?theme=${theme}` : "";
  return (
    `<iframe src="${origin}${WIDGET_EMBED_PATH}${query}" title="${WIDGET_IFRAME_TITLE}" loading="lazy" ` +
    `width="100%" height="${WIDGET_IFRAME_HEIGHT}" style="${WIDGET_IFRAME_STYLE}" ` +
    `sandbox="${WIDGET_IFRAME_SANDBOX}"></iframe>\n` +
    widgetLigneBacklink(origin)
  );
}

/**
 * Code à copier, format B : conteneur qui réserve la hauteur AVANT l'exécution
 * du script (même courbe que l'iframe, aucun décalage), script chargeur qui y
 * crée la même iframe. Le `min-height:420px` précède la courbe : repli des
 * navigateurs sans `clamp`. La ligne de backlink suit le conteneur (pas dedans).
 */
export function widgetScriptSnippet(origin: string = WIDGET_ORIGIN, theme?: "clair" | "sombre"): string {
  const dataTheme = theme ? ` data-theme="${theme}"` : "";
  return (
    `<div style="min-height:${WIDGET_IFRAME_HEIGHT}px;min-height:${WIDGET_IFRAME_HEIGHT_CSS};max-width:640px">` +
    `<script async src="${origin}${WIDGET_SCRIPT_PATH}"${dataTheme}></script></div>\n` +
    widgetLigneBacklink(origin)
  );
}
