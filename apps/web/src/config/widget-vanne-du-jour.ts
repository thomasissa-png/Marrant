/**
 * Widget « La vanne du jour » (s22). Source unique de la configuration du
 * widget : publication, liste blanche des vannes, exclusions, domaines bloqués,
 * gabarits de code à copier.
 *
 * Spec : docs/marrant/widget-vanne-du-jour-s22-synthese.md (fait foi),
 * docs/seo/widget-replique-du-jour-s22-seo.md, docs/growth/widget-replique-du-jour-s22-growth.md,
 * docs/legal/widget-vanne-du-jour-s22.md.
 */

/**
 * Interrupteur de mise en ligne. `false` tant que Thomas n'a pas donné son go
 * écrit : la page du programme répond 404 et sort du sitemap, l'API répond 503
 * et l'iframe affiche le repli sans vanne.
 */
export const WIDGET_VANNE_DU_JOUR_PUBLIE = false;

/**
 * Liste blanche des vannes servies par le widget (identifiants `Joke.id`).
 * À remplir APRÈS la relecture tout public à la main (@reviewer, regard d'un
 * parent et d'un RH) à partir de docs/growth/widget-candidats-s22.md, 90 vannes
 * minimum au lancement. Une vanne de cette liste n'est servie que si elle reste
 * dans le pool validé (`VALIDATED_JOKE_WHERE`) et hors catégories exclues.
 * Liste vide : aucune vanne n'est servie (API 503, repli dans l'iframe).
 */
export const WIDGET_JOKE_IDS: readonly string[] = [];

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

/** Origine publique du site (gabarits de code, liens absolus). */
export const WIDGET_ORIGIN = "https://deviens-marrant.fr";
export const WIDGET_EMBED_PATH = "/embed/vanne-du-jour";
export const WIDGET_SCRIPT_PATH = "/widget.js";
export const WIDGET_API_PATH = "/api/widget/v1/vanne-du-jour";
export const WIDGET_PROGRAMME_PATH = "/integrer-la-vanne-du-jour";
/** Date réelle de dernière modification du texte de la page du programme (sitemap). */
export const WIDGET_PROGRAMME_LASTMOD = "2026-10-24";

/** Titre accessible de l'iframe (attribut `title`). */
export const WIDGET_IFRAME_TITLE = "La vanne du jour, Deviens Marrant";
/** Hauteur réservée (px) : pas de décalage de mise en page chez l'hôte. */
export const WIDGET_IFRAME_HEIGHT = 240;
export const WIDGET_IFRAME_SANDBOX = "allow-scripts allow-popups allow-popups-to-escape-sandbox";

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

/** Code à copier, format A (iframe seule, aucun JavaScript chez l'hôte). */
export function widgetIframeSnippet(origin: string = WIDGET_ORIGIN): string {
  return (
    `<iframe src="${origin}${WIDGET_EMBED_PATH}" title="${WIDGET_IFRAME_TITLE}" loading="lazy" ` +
    `width="100%" height="${WIDGET_IFRAME_HEIGHT}" style="border:0;max-width:640px" ` +
    `sandbox="${WIDGET_IFRAME_SANDBOX}" referrerpolicy="strict-origin-when-cross-origin"></iframe>`
  );
}

/** Code à copier, format B (script chargeur qui crée la même iframe à sa place). */
export function widgetScriptSnippet(origin: string = WIDGET_ORIGIN): string {
  return `<script async src="${origin}${WIDGET_SCRIPT_PATH}"></script>`;
}
