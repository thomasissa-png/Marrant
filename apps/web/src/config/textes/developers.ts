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
  "This API returns one French joke per day as JSON: a setup (amorce), a punchline (chute) and a link to a page that explains why it is funny. It is free, needs no key, works over HTTPS and is read-only. The jokes are in French, and everyone gets the same one until midnight UTC. Every joke in the rotation was picked by hand and is suitable for all audiences.";

/** Phrase avant l'exemple d'appel (GET https://deviens-marrant.fr/api/widget/v1/vanne-du-jour). */
export const TEXTE_ENDPOINT =
  "Send a GET request to the endpoint below, over HTTPS. There is no key, no sign-up and no parameter. The endpoint responds to GET and OPTIONS (CORS preflight) requests and returns application/json.";

/** Phrase avant l'exemple de réponse. */
export const TEXTE_EXEMPLE = "A real response, returned on 24 October 2026:";

/** Réponse réelle du 24/10/2026, à placer telle quelle dans un bloc de code. */
export const EXEMPLE_REPONSE = `{"type":"vanne","date":"2026-10-24","amorce":"Mon père m’envoie ses messages en MAJUSCULES.","chute":"Je réponds en minuscules. Il m’a demandé pourquoi je boudais.","url":"https://deviens-marrant.fr/vannes/mon-pere-menvoie-ses-messages-en-majuscules-cmmnsqn160?utm_source=widget&utm_medium=embed&utm_campaign=vanne-du-jour&utm_content=inconnu","attribution":{"name":"Deviens Marrant","url":"https://deviens-marrant.fr/","required":true},"license":"https://deviens-marrant.fr/integrer-la-vanne-du-jour#licence"}`;

/** Les 7 champs de la réponse, dans l'ordre de la réponse. */
export const CHAMPS: { nom: string; description: string }[] = [
  {
    nom: "type",
    description:
      `Currently always "vanne" (French for "joke"). Other values, such as "replique", may be added later: do not reject unknown values.`,
  },
  {
    nom: "date",
    description: "The day of the joke, in UTC, formatted YYYY-MM-DD.",
  },
  {
    nom: "amorce",
    // amorce et chute passent par frTypo côté API (lib/widget/vanne-du-jour.ts).
    description:
      "The setup of the joke. Plain UTF-8 text with French typography (curly apostrophes, non-breaking spaces before some punctuation). No HTML.",
  },
  {
    nom: "chute",
    description: "The punchline.",
  },
  {
    nom: "url",
    description:
      `The public page of the joke on deviens-marrant.fr (in French), which explains why it is funny. The link already carries UTM parameters. Its utm_content value is the domain of the calling site, taken from the Origin header, then the Referer header (lowercase, without "www."), or inconnu (French for "unknown") when neither header is usable, as with a server-side call or curl.`,
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
  "CORS is enabled for every origin: responses carry Access-Control-Allow-Origin: *, so you can call the API straight from the browser. They also carry Cache-Control: public, max-age=300, s-maxage=3600. Browsers keep a response for 5 minutes at most and shared caches for 1 hour at most. Both values shrink as midnight UTC approaches, so no cache keeps a joke past midnight UTC. The joke changes every day at midnight UTC, the same one for everybody. If we withdraw a joke, the joke of the day can change before midnight UTC.";

/** Limite de requêtes et conseil de cache. */
export const TEXTE_LIMITE =
  "The limit is 10 requests per 10 seconds per IP address. Beyond that, the address is blocked for 10 seconds and gets an HTTP 429 response. When you call the API from the browser, each visitor counts against their own IP. The joke only changes at midnight UTC, so one call a day is enough: cache the response on your side (the license allows up to 24 hours) and refresh it after midnight UTC.";

/**
 * Codes d'erreur, rendus en <dl> comme CHAMPS. 429 : mesuré en production, la règle
 * Cloudflare bloque sans réponse personnalisée (ni CORS ni JSON).
 */
export const ERREURS: { code: string; description: string }[] = [
  {
    code: "503",
    description:
      `{"type":"vanne","error":"indisponible"} ("unavailable"): the service is temporarily unavailable. The response carries Retry-After: 3600, so try again in an hour.`,
  },
  {
    code: "403",
    description: `{"type":"vanne","error":"acces-refuse"} ("access denied"): the calling site has been blocked for abuse.`,
  },
  {
    code: "429",
    description:
      "Rate limit exceeded. Wait 10 seconds before the next call. This response comes from our CDN: its body is not JSON and it has no CORS header, so a browser may report it as a network or CORS error.",
  },
];

/** Vie privée : usages du domaine appelant et des données de la requête. */
export const TEXTE_VIE_PRIVEE =
  "The API sets no cookies and does not track your visitors. Request data is used only to serve the response and to enforce the rate limit. The domain of the calling site, read from the Origin or Referer header, is used for two things only: checking it against our list of blocked sites, and filling the utm_content parameter of the link, so we can see which sites send clicks. It says nothing about your visitors.";

/**
 * Traduction de la ligne « Licence d'usage » et des « Conditions » (@legal), adaptée à l'API.
 * « Le lien dans le cadre fait partie du widget » devient l'obligation d'afficher le lien
 * d'attribution avec la vanne ; la parenthèse sur la ligne facultative sous le cadre n'existe
 * pas dans l'API et est retirée ; « Le widget ne pose aucun cookie » devient « The API ».
 */
export const TEXTE_LICENCE_USAGE =
  "Usage license: display of the joke free of charge and unmodified, with the “Deviens Marrant” attribution link visible; client-side cache of 24 hours maximum; archiving, mass republishing, reselling, or training a model with these texts is forbidden; service provided without warranty, access revocable.";
export const TEXTE_LICENCE_CONDITIONS =
  "The joke of the day is free of charge: you can use it on your site without asking us. It is provided as is, with no guarantee of availability, and it may change. The “Deviens Marrant” attribution link must be displayed with the joke: leave it in place and visible. Do not modify the text of the joke and do not present it as your own. You can display it on a site that carries advertising, but you may not resell it, copy it in bulk, or reuse it in a collection or another product. The API sets no cookies and does not track your visitors. We can change or stop the service, and cut off a site's access (inappropriate content, abuse), at any time.";
export const TEXTE_LICENCE_FOI =
  "This text is a courtesy translation. If it differs from the French original, the French version prevails: https://deviens-marrant.fr/integrer-la-vanne-du-jour#licence";
export const TEXTE_LICENCE = `${TEXTE_LICENCE_USAGE}\n\n${TEXTE_LICENCE_CONDITIONS}\n\n${TEXTE_LICENCE_FOI}`;

/** Renvoi vers le widget prêt à copier (page en français). Le chemin n'y figure qu'une fois (split dans page.tsx). */
export const TEXTE_WIDGET =
  "A copy-and-paste widget (iframe or script tag) is available at /integrer-la-vanne-du-jour. That page is in French.";
