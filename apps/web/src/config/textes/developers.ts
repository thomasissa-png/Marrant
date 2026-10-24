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
  "Free JSON API for a French joke of the day: no key, no sign-up, CORS enabled. A new joke every day, read-only. The jokes are in French.";

export const H1 = "Joke of the Day API";
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
  "This API returns one French joke per day as JSON: a setup, a punchline, and a link to the page that explains why it is funny. It is free, needs no key and is read-only. The jokes are in French, and everyone gets the same one until midnight UTC.";

/** Phrase avant l'exemple d'appel (GET https://deviens-marrant.fr/api/widget/v1/vanne-du-jour). */
export const TEXTE_ENDPOINT =
  "Send a GET request to the endpoint below. There is no key, no sign-up and no parameter. The endpoint answers GET and OPTIONS requests.";

/** Phrase avant l'exemple de réponse. */
export const TEXTE_EXEMPLE = "A real response, returned on 24 October 2026:";

/** Réponse réelle du 24/10/2026, à placer telle quelle dans un bloc de code. */
export const EXEMPLE_REPONSE = `{"type":"vanne","date":"2026-10-24","amorce":"Mon père m’envoie ses messages en MAJUSCULES.","chute":"Je réponds en minuscules. Il m’a demandé pourquoi je boudais.","url":"https://deviens-marrant.fr/vannes/mon-pere-menvoie-ses-messages-en-majuscules-cmmnsqn160?utm_source=widget&utm_medium=embed&utm_campaign=vanne-du-jour&utm_content=inconnu","attribution":{"name":"Deviens Marrant","url":"https://deviens-marrant.fr/","required":true},"license":"https://deviens-marrant.fr/integrer-la-vanne-du-jour#licence"}`;

/** Les 7 champs de la réponse, dans l'ordre de la réponse. */
export const CHAMPS: { nom: string; description: string }[] = [
  {
    nom: "type",
    description:
      `Always "vanne" (French for a joke) today. A value "replique" is planned for later, with no date yet.`,
  },
  {
    nom: "date",
    description: "The day of the joke, in UTC, formatted YYYY-MM-DD.",
  },
  {
    nom: "amorce",
    description: "The setup of the joke.",
  },
  {
    nom: "chute",
    description: "The punchline.",
  },
  {
    nom: "url",
    description:
      "The public page of the joke on deviens-marrant.fr, which explains why it is funny. The link already carries UTM parameters. Its utm_content value is the domain of the calling site, taken from the Origin or Referer header, or inconnu (French for unknown) when neither gives it.",
  },
  {
    nom: "attribution",
    description:
      `An object {name, url, required}. “required” is true: the visible “Deviens Marrant” attribution link, pointing to that url, is mandatory wherever you display the joke (see the License section below).`,
  },
  {
    nom: "license",
    description: "The URL of the terms of use (see the License section below).",
  },
];

/** CORS, cache, moment du changement de vanne. */
export const TEXTE_CORS_CACHE =
  "CORS is open: responses carry Access-Control-Allow-Origin: *, so you can call the API straight from the browser. They also carry Cache-Control: public, max-age=300. Browsers keep a response for 5 minutes at most, and shared caches for up to 1 hour, never past midnight UTC. The joke changes every day at midnight UTC, the same one for everybody. Every joke in the rotation was picked by hand and is suitable for all audiences.";

/** Limite de requêtes et conseil de cache. */
export const TEXTE_LIMITE =
  "The limit is 10 requests per 10 seconds per IP address. Beyond that, the address is blocked for 10 seconds and gets an HTTP 429 response. One call a day is enough, since the joke only changes at midnight UTC: cache it on your side.";

/** Codes d'erreur. */
export const TEXTE_ERREURS =
  `503 with {"type":"vanne","error":"indisponible"}: the service is unavailable. The response includes a Retry-After: 3600 header, so try again in an hour. 403 with {"type":"vanne","error":"acces-refuse"}: the calling site is blocked (abuse). 429: you went over the rate limit, wait 10 seconds before the next call.`;

/** Vie privée : seul le domaine appelant est compté. */
export const TEXTE_VIE_PRIVEE =
  "The API sets no cookies and does not track your visitors. Only the technical data of the request is processed to serve the response. The domain of the calling site only goes into the utm_content parameter of the link, so we can see which sites send clicks (nothing about your visitors).";

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

/** Renvoi vers le widget prêt à copier (page en français). */
export const TEXTE_WIDGET =
  "Not in the mood to code? A ready-to-copy widget is on the page /integrer-la-vanne-du-jour. That page is in French.";
