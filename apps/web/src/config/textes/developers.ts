/**
 * Textes (en anglais) de la page /developers : documentation de l'API publique
 * « vanne du jour » (GET /api/widget/v1/vanne-du-jour). Les vannes restent en français.
 * TEXTE_LICENCE est la traduction fidèle des textes @legal (ligne « Licence d'usage » et
 * « Conditions » de /integrer-la-vanne-du-jour#licence) : toute retouche repasse par @legal.
 */

/** Titre absolu (≤ 60 caractères, 52 ici). */
export const PAGE_TITLE = "Free Joke of the Day API in French | Deviens Marrant";
/** Meta description (≤ 155 caractères). */
export const PAGE_DESCRIPTION =
  "Free JSON API for a French joke of the day: no key, no sign-up, CORS enabled. A different joke every day, read-only. The jokes are in French.";

/** H1, repris comme `name` du JSON-LD WebAPI. */
export const H1 = "French Joke of the Day API";
export const H2_ENDPOINT = "Endpoint";
export const H2_EXEMPLE = "Example response";
export const H2_CHAMPS = "Fields";
export const H2_CORS_CACHE = "CORS and caching";
export const H2_LIMITE = "Rate limit";
export const H2_ERREURS = "Errors";
export const H2_VIE_PRIVEE = "Privacy";
export const H2_LICENCE = "License and terms";
export const H2_WIDGET = "Prefer not to code?";

/** Chapeau sous le H1. */
export const TEXTE_INTRO =
  "Free JSON API, no key, HTTPS, CORS enabled. It returns one French joke per day: a setup (amorce), a punchline (chute) and a link to a page that explains why it is funny. The jokes are in French, and everyone normally gets the same one on a given UTC day. Every joke in the rotation was picked by hand and is suitable for all audiences.";

/** Phrase avant l'exemple d'appel (GET https://deviens-marrant.fr/api/widget/v1/vanne-du-jour). */
export const TEXTE_ENDPOINT =
  "Send a GET request to the endpoint below, over HTTPS. There is no key, no sign-up and no parameters.";

/** Comportement navigateur, sous les exemples curl (revue v5 C2 : l'URL d'abord). */
export const TEXTE_ENDPOINT_NAVIGATEUR =
  "The endpoint responds to GET (JSON) and OPTIONS (CORS preflight, 204 with no body). From the browser, send a plain GET: the preflight allows no request headers, so adding one such as Authorization, X-Requested-With or Content-Type: application/json makes the request fail with a CORS error. Server-side calls are not affected.";

/** Phrase avant l'exemple de réponse. */
export const TEXTE_EXEMPLE = "A real response, returned on 24 October 2026 (indented here for reading; the API returns it on one line):";

/** Réponse réelle du 24/10/2026, à placer telle quelle dans un bloc de code. */
export const EXEMPLE_REPONSE = `{"type":"vanne","date":"2026-10-24","amorce":"Mon père m’envoie ses messages en MAJUSCULES.","chute":"Je réponds en minuscules. Il m’a demandé pourquoi je boudais.","url":"https://deviens-marrant.fr/vannes/mon-pere-menvoie-ses-messages-en-majuscules-cmmnsqn160?utm_source=widget&utm_medium=embed&utm_campaign=vanne-du-jour&utm_content=inconnu","attribution":{"name":"Deviens Marrant","url":"https://deviens-marrant.fr/","required":true},"license":"https://deviens-marrant.fr/integrer-la-vanne-du-jour#licence"}`;

/** Renvoi vers la section #license : rendu en lien dans page.tsx (attribution, license). */
export const RENVOI_LICENCE = "License section";

/** Les 7 champs de la réponse, dans l'ordre de la réponse. */
export const CHAMPS: { nom: string; description: string }[] = [
  {
    nom: "type",
    description:
      `"vanne" (French for "joke"). Do not reject the response on this field: treat any other value like "vanne".`,
  },
  {
    nom: "date",
    description: "The day of the joke, in UTC, formatted YYYY-MM-DD. If it is not today's UTC date, your cached copy is stale.",
  },
  {
    nom: "amorce",
    // amorce et chute passent par frTypo côté API (lib/widget/vanne-du-jour.ts) : insécables
    // U+00A0 et gluon U+2060 (lib/fr-typo.ts), d'où la mise en garde.
    description:
      "The setup of the joke. Plain UTF-8 text, no HTML, with French typography: it may contain curly apostrophes (’), French quotation marks (« ») and no-break spaces (U+00A0), for example before colons, semicolons, exclamation marks and question marks, plus an invisible word joiner (U+2060) after the hyphen of some compound words. Strip U+2060 if you search, compare or read the text aloud.",
  },
  {
    nom: "chute",
    description: "The punchline. Same format as amorce.",
  },
  {
    nom: "url",
    description:
      `The public page of the joke on deviens-marrant.fr (in French), which explains why it is funny. The link already carries UTM parameters. Its utm_content value is the domain of the calling site, taken from the Origin header, or from the Referer header when there is no usable Origin (lowercase, without "www."), or inconnu (French for "unknown") when neither header is usable, as with a server-side call or curl.`,
  },
  {
    nom: "attribution",
    description:
      `An object {name, url, required}. required is always true: a visible "Deviens Marrant" link pointing to that url is mandatory wherever you display the joke (see the License section below).`,
  },
  {
    nom: "license",
    description:
      "The URL of the terms of use, in French (an English translation is in the License section below).",
  },
];

/** CORS, cache, moment du changement de vanne. */
export const TEXTE_CORS_CACHE =
  "CORS is open to all origins: every GET response from the API (200, 403 and 503) and the OPTIONS preflight carry Access-Control-Allow-Origin: *, so you can call it straight from the browser. Responses generated by our CDN, such as the 429 below, have no CORS header.";

/** En-têtes de cache (paragraphe à part, revue v6 AC2). */
export const TEXTE_CACHE =
  "A successful response normally carries Cache-Control: public, max-age=300, s-maxage=3600, so browsers may reuse it for up to 5 minutes and shared caches for up to 1 hour. Neither lifetime ever extends past midnight UTC: s-maxage is capped at the number of seconds left until midnight during the last hour of the day, and max-age during the last 5 minutes, so a cache that follows these headers does not serve yesterday's joke.";

/** Rotation : changement de vanne, retrait, retour des vannes (paragraphe à part, revue v3 C3). */
export const TEXTE_ROTATION =
  "The joke changes every day at midnight UTC and is normally the same for everybody. The rotation draws from a limited set of hand-picked jokes, so jokes come back over time. If we withdraw a joke, the joke of the day can change before midnight UTC.";

/** Limite de requêtes et conseil de cache. */
export const TEXTE_LIMITE =
  "The limit is 10 requests per 10 seconds per IP address. Beyond that, the address is blocked for 10 seconds: every request gets an HTTP 429 response. When you call the API from the browser, each visitor's requests count against their own IP address; visitors who share one (office, school, mobile carrier) share the limit, so on a busy site prefer a server-side call with your own cache. The joke normally changes only at midnight UTC, so one call a day is enough: cache the response on your side (the license allows up to 24 hours) and refresh it after midnight UTC.";

/**
 * Codes d'erreur, rendus en <dl> comme CHAMPS. 429 : mesuré en production, la règle
 * Cloudflare bloque sans réponse personnalisée (ni CORS ni JSON).
 */
export const ERREURS: { code: string; description: string }[] = [
  {
    code: "503",
    description:
      `{"type":"vanne","error":"indisponible"} ("unavailable"): no joke can be served right now. The response carries Retry-After: 3600, so wait at least an hour before trying again.`,
  },
  {
    code: "403",
    description: `{"type":"vanne","error":"acces-refuse"} ("access denied"): the calling site, read from the Origin or Referer header, has been blocked (abuse or inappropriate content, see License and terms).`,
  },
  {
    code: "429",
    description:
      "Rate limit exceeded. Wait 10 seconds before the next call. This response comes from our CDN: its body is not JSON and it has no CORS header, so a browser may report it as a network or CORS error.",
  },
];

/** Vie privée : usages du domaine appelant et des données de la requête. */
export const TEXTE_VIE_PRIVEE =
  "The API sets no cookies and does not track your visitors. Request data, such as the IP address of whoever makes the call (your server, or each visitor's browser if you call the API client-side), is used to serve the response and enforce the rate limit, and may appear in our hosting provider's technical logs. Apart from those technical logs, the domain of the calling site, read from the Origin or Referer header, is used for two things only: checking it against our list of blocked sites, and filling the utm_content parameter of the link, so we can see which sites send clicks. It says nothing about your visitors.";

/**
 * Traduction de la ligne « Licence d'usage » et des « Conditions » (@legal), adaptée à l'API.
 * « Le lien dans le cadre fait partie du widget » devient l'obligation d'afficher le lien
 * d'attribution avec la vanne ; la parenthèse sur la ligne facultative sous le cadre n'existe
 * pas dans l'API et est retirée ; « Le widget ne pose aucun cookie » devient « The API » ;
 * « Si tu passes par l'API, tu peux garder la vanne en cache » devient une phrase sans condition.
 */
export const TEXTE_LICENCE_USAGE =
  "Usage license: you may display the joke free of charge and unmodified, on a site, in an app, a bot, an extension or a newsletter, with the “Deviens Marrant” attribution link clearly visible next to it. You may cache it on your side (server or browser) for 24 hours maximum. You may not archive it, copy it in bulk, resell it, put it in a collection or a database of jokes, or use it to train an AI model. Bot messages and newsletters that have already been sent can stay where they are. The service is provided without warranty, and we can cut off your access.";
export const TEXTE_LICENCE_CONDITIONS =
  "The joke of the day is free of charge: you can display it on your site, in an app, a bot (Discord, Slack, Telegram…), an extension or a newsletter, without asking us. It is provided as is, with no guarantee of availability, and it may change. Wherever you show the joke, display the “Deviens Marrant” attribution link next to it, clearly visible. Do not modify the text of the joke and do not present it as your own. You can display the joke even if your site, app, bot, extension or newsletter carries advertising. However, you may not resell the joke, copy it in bulk, archive it, reuse it in a collection or a database of jokes, or use it to train an AI model. Bot messages and newsletters that have already been sent can stay where they are: what is forbidden is keeping the jokes aside to reuse them later or gather them together. You may cache the joke on your side (server or browser) for 24 hours maximum. The API sets no cookies and does not track your visitors. We can change or stop the service, and cut off your access (inappropriate content, abuse), at any time.";
export const TEXTE_LICENCE_FOI =
  "These terms are a courtesy translation. If they differ from the French original, the French version prevails: https://deviens-marrant.fr/integrer-la-vanne-du-jour#licence";
export const TEXTE_LICENCE = `${TEXTE_LICENCE_USAGE}\n\n${TEXTE_LICENCE_CONDITIONS}\n\n${TEXTE_LICENCE_FOI}`;

/** Renvoi vers le widget prêt à copier (page en français). Le chemin n'y figure qu'une fois (split dans page.tsx). */
export const TEXTE_WIDGET =
  "A copy-and-paste widget (iframe or script tag) is available at /integrer-la-vanne-du-jour. That page is in French.";

/** Contact, ligne à part sous TEXTE_WIDGET. L'adresse n'y figure qu'une fois (split + mailto dans page.tsx). */
export const CONTACT_API = "contact@deviens-marrant.fr";
export const TEXTE_CONTACT = `Questions or problems with the API: ${CONTACT_API}.`;
