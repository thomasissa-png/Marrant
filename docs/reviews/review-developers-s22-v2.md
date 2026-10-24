# Relecture à l'aveugle : page /developers (s22, v2), 24/10/2026

Périmètre lu : `config/textes/developers.ts`, `app/(dashboard)/developers/page.tsx`, captures `docs/qa/captures-developers-s22/developers-pc.png` et `developers-mobile.png`, code de l'API (`api/widget/v1/vanne-du-jour/route.ts`, `lib/widget/vanne-du-jour.ts`, `config/widget-vanne-du-jour.ts`, plus `lib/fr-typo.ts` appelé par l'API). Aucun rapport existant lu.

## Verdict : NO-GO (8,5/10, zéro bloquant)

La page est propre, sobre et presque entièrement exacte. Un dev voit l'endpoint, le « gratuit, sans clé » et un exemple qui marche en moins de 20 s. Rien n'est faux au point de casser une intégration. Je refuse le GO pour quatre raisons : des imprécisions de périmètre (Cache-Control présenté comme valable pour toutes les réponses), un oubli qui gênera vraiment un dev (le caractère invisible U+2060 dans `amorce`/`chute`), une valeur future citée (`replique`, donc une annonce de feuille de route) et un 503 décrit comme « temporaire ». Les corrections C1 à C6 prennent environ 15 minutes. Avec elles, la page passe à 9 ou plus.

| # | Critère | Note | Motif principal |
|---|---|---|---|
| 1 | Exactitude technique | 8 | Aucune affirmation fausse pour une réponse 200. Imprécisions : Cache-Control et CORS présentés comme valables pour « les réponses » (le 403 renvoie `private, no-store`, le 503 `public, max-age=60`, le 429 n'a aucun des deux), « no cache keeps a joke past midnight » trop absolu, 503 dit « temporaire », U+2060 non signalé |
| 2 | Clarté pour un dev anglophone en 20 s | 8,5 | Hiérarchie nette, endpoint visible sans défiler sur PC. Intro dense (5 phrases), quelques redites (minuit UTC répété 7 fois), « no parameter » |
| 3 | Complétude pour un annuaire | 8,5 | Auth, HTTPS, CORS, limite, erreurs, licence et exemple réel sont tous là. Manquent : le format exact du texte (U+2060), un contact, le retour des vannes au fil de la rotation |
| 4 | Exemples curl et fetch | 8,5 | Corrects et sûrs (`textContent` et `append`, jamais `innerHTML`, attribution affichée). Le fetch ne capture pas l'erreur réseau, alors que la doc annonce elle-même qu'un 429 en produira une |
| 5 | Règles maison | 8,5 | Zéro tiret cadratin ou demi-cadratin (Grep : 0), zéro concurrent, rien d'inventé. Écarts : `replique` « may be added later » (feuille de route), « temporarily unavailable » (promesse implicite de retour) |
| 6 | SEO de base | 9 | Title de 52 caractères, description de 141, canonical relatif `/developers` résolu via `metadataBase` (layout.tsx:68), page dans le sitemap, H1 et 9 H2, deux JSON-LD (WebPage `inLanguage: en`, WebAPI). `lang="en"` posé sur le conteneur, `<html lang="fr">` à la racine (acceptable). `isAccessibleForFree` sur WebAPI reste à valider |

Captures : rendu PC soigné et lisible (contraste, espacement, blocs de code distincts, aucun JSON brut parasite). Sur mobile, je n'ai pas vu de débordement horizontal, mais la capture (390x6628) est réduite à la lecture et la typographie fine n'y est pas vérifiable. Les blocs de code passent à la ligne (`pre-wrap`), ce qui rend le fetch moins lisible sur mobile mais n'abîme pas le copier-coller. L'en-tête et le pied de page restent en français : c'est cohérent avec le site et ce n'est pas bloquant.

## Bloquants

Aucun.

## À corriger

**C1. `CHAMPS` > `amorce` (le format réel du texte n'est pas décrit)**
Le code appelle `frTypo`, qui insère un WORD JOINER invisible (U+2060) après le trait d'union des mots composés courts (« stand-up », « peut-être », « est-ce » : fr-typo.ts:77-80 et 95). Il pose aussi des guillemets « » et des insécables U+00A0 après les nombres. Un dev qui compare, cherche, compte ou passe le texte en synthèse vocale tombera dessus sans comprendre. Certains terminaux affichent U+2060 sous forme de carré.
- Actuel : `The setup of the joke. Plain UTF-8 text with French typography (curly apostrophes, non-breaking spaces before some punctuation). No HTML.`
- Proposé : `The setup of the joke. Plain UTF-8 text, no HTML, with French typography: curly apostrophes (’), French quotation marks (« »), no-break spaces (U+00A0) before : ; ! ? and after numbers, and an invisible word joiner (U+2060) after the hyphen of some short compound words. Remove U+2060 if you search, compare or read the text aloud.`
- Variante côté code, à décider par Thomas avec @fullstack : remplacer `frTypo` par une typographie sans gluon dans l'API. Le commentaire de `fr-typo.ts:3-5` réserve d'ailleurs `frTypo` au rendu HTML, pas aux données. Si le gluon disparaît, retirer la fin de la phrase proposée.

**C2. `CHAMPS` > `chute`**
- Actuel : `The punchline.`
- Proposé : `The punchline. Same format as amorce.`

**C3. `TEXTE_CORS_CACHE` (périmètre des en-têtes, formule absolue)**
- Actuel : `CORS is enabled for every origin: responses carry Access-Control-Allow-Origin: *, so you can call the API straight from the browser. They also carry Cache-Control: public, max-age=300, s-maxage=3600. Browsers keep a response for 5 minutes at most and shared caches for 1 hour at most. Both values shrink as midnight UTC approaches, so no cache keeps a joke past midnight UTC. The joke changes every day at midnight UTC, the same one for everybody. If we withdraw a joke, the joke of the day can change before midnight UTC.`
- Proposé : `CORS is enabled for every origin: our responses carry Access-Control-Allow-Origin: *, so you can call the API straight from the browser (the 429 below is the only exception). A successful response carries Cache-Control: public, max-age=300, s-maxage=3600, so browsers may keep it for 5 minutes and shared caches for 1 hour. Near midnight UTC, both values shrink to the time left before midnight: a cache that follows these headers never serves yesterday's joke. The joke changes every day at midnight UTC and is the same for everybody. If we withdraw a joke, the joke of the day can change before midnight UTC.`

**C4. `ERREURS` > `503` (« temporarily » promet un retour, or le 503 sert aussi quand le service est coupé : route.ts:52)**
- Actuel : `... ("unavailable"): the service is temporarily unavailable. The response carries Retry-After: 3600, so try again in an hour.`
- Proposé : `... ("unavailable"): no joke can be served right now. The response carries Retry-After: 3600, so wait at least an hour before trying again.`

**C5. `ERREURS` > `403` (motif incomplet par rapport à la licence)**
- Actuel : `... ("access denied"): the calling site has been blocked for abuse.`
- Proposé : `... ("access denied"): the calling site, read from the Origin or Referer header, has been blocked (abuse or inappropriate content, see License and terms).`

**C6. `CHAMPS` > `type` (`replique` annonce la V1.1, ce qui est une feuille de route)**
- Actuel : `Currently always "vanne" (French for "joke"). Other values, such as "replique", may be added later: do not reject unknown values.`
- Proposé : `Always "vanne" (French for "joke") in this version. If you get another value, do not reject the response.`

**C7. Licence (pour @legal, sans réécriture) : usage dans une app ou un bot**
`TEXTE_LICENCE_CONDITIONS` dit « use it on your site » et interdit de « reuse it in a collection or another product ». Or le public visé par un annuaire d'API construit justement des bots, des applis mobiles, des extensions et des CLI, et la page cite elle-même l'appel côté serveur et curl. Lu à la lettre, ce texte peut faire comprendre qu'un bot Discord qui affiche la vanne avec son attribution est interdit. Question pour @legal : la licence couvre-t-elle l'affichage dans une app ou un bot (pas seulement « un site ») ? Si oui, la phrase doit le dire. Si non, l'annuaire attirera surtout des usages interdits. Même question pour « client-side cache » : un serveur qui met la réponse en cache pour ses utilisateurs compte-t-il comme « client » ? Tant que la version française n'est pas tranchée, ne pas toucher à la traduction.

**C8. `TEXTE_VIE_PRIVEE` (à vérifier avant de garder « only »)**
`Request data is used only to serve the response and to enforce the rate limit.` est une affirmation absolue. Le code de la route n'enregistre rien, mais j'ignore si les journaux Cloudflare ou Workers (observability, logpush) conservent les IP. @infrastructure doit vérifier. Si des journaux existent, proposé : `Request data, such as your IP address, is used to serve the response and enforce the rate limit, and may appear in our hosting provider's technical logs.` S'il n'y en a pas, garder le texte actuel.

## Optionnel

**O1. `TEXTE_ENDPOINT`** : `There is no key, no sign-up and no parameter.` devient `There is no key, no sign-up and no parameters.`. Pour être exact sur OPTIONS (route.ts:70-71, 204 sans corps), `responds to GET and OPTIONS (CORS preflight) requests and returns application/json.` devient `responds to GET (JSON) and OPTIONS (CORS preflight, 204 with no body).`.

**O2. Exemple fetch (`page.tsx:86-96`)** : capturer l'erreur réseau, que la doc annonce elle-même pour le 429, et marquer la langue du texte affiché.
```js
// <div id="joke" lang="fr"></div> then, in a <script type="module">:
try {
  const res = await fetch("https://deviens-marrant.fr/api/widget/v1/vanne-du-jour");
  if (res.ok) {
    const joke = await res.json();
    const link = document.createElement("a");
    link.href = joke.attribution.url;
    link.textContent = joke.attribution.name;
    document.getElementById("joke").append(joke.amorce, " ", joke.chute, " ", link);
  }
} catch {
  // Network error or rate limit (the 429 has no CORS header): show nothing.
}
```

**O3. `TEXTE_LIMITE`** : la règle compte par IP ET par datacenter Cloudflare. La doc Cloudflare (ancienne génération du produit) indique aussi un comptage par plage /64 en IPv6. Si @infrastructure le confirme pour la règle actuelle : `per IP address` devient `per IP address (per /64 range for IPv6)`. Sinon, laisser tel quel : la formule actuelle reste vraie du point de vue du client.

**O4. JSON-LD WebAPI** : je n'ai pas retrouvé de source officielle qui confirme que `isAccessibleForFree` s'applique à WebAPI (de mémoire, CreativeWork, Event et Place, à vérifier sur schema.org/isAccessibleForFree). WebAPI hérite de Service, donc la propriété risque d'être ignorée ou signalée. Passer le JSON-LD au validateur schema.org. Si la propriété est signalée, ajouter `offers: { "@type": "Offer", price: 0, priceCurrency: "EUR" }` (garder `isAccessibleForFree` ne coûte rien).

**O5. Intro (`TEXTE_INTRO`), lisible en 20 s** : ouvrir sur les faits qu'un annuaire vérifie, puis détailler.
- Proposé : `Free JSON API, no key, HTTPS, CORS enabled. It returns one French joke per day: a setup (amorce), a punchline (chute) and a link to a page that explains why it is funny. The jokes are in French, and everyone gets the same one until midnight UTC. Every joke in the rotation was picked by hand and is suitable for all audiences.`
- « read-only » est déjà dans la description et dans TEXTE_ENDPOINT (GET seul) : on peut le retirer de l'intro.

**O6. Liens internes** : `(see the License section below)` et `(an English translation is in the License section below)` peuvent pointer vers `#license` (l'ancre existe déjà : page.tsx:171).

**O7. Rotation** : un dev qui stocke les vannes voudra savoir qu'elles reviennent. Ajouter à la fin de `TEXTE_CORS_CACHE` : `The rotation is a fixed set of hand-picked jokes, so jokes come back over time.`. Ne pas donner le chiffre de 93 : il changera à chaque retrait.

**O8. Contact** : l'annuaire et les devs cherchent à qui écrire. L'adresse `contact@deviens-marrant.fr` figure déjà dans le pied de page. Proposé, à la fin de `TEXTE_WIDGET` ou dans une ligne à part : `Questions or problems with the API: contact@deviens-marrant.fr.`

**O9. En-têtes non documentés** : `Vary: Origin, Referer` et `Access-Control-Max-Age: 86400` (route.ts:24 et 30) peuvent tenir en une demi-phrase dans `TEXTE_CORS_CACHE`. Utile, pas indispensable.

**O10. Guillemets** : les champs écrivent `"Deviens Marrant"` en guillemets droits, la licence en guillemets courbes. Pour harmoniser, retoucher les textes hors licence, jamais la licence.

## Top 3

1. C1 : documenter U+2060 dans `amorce` et `chute` (ou le retirer de l'API, décision Thomas avec @fullstack). C'est le seul point qui casse quelque chose chez un dev qui ne s'y attend pas.
2. C7 : @legal doit dire si un bot ou une app est un usage autorisé. La licence actuelle (« on your site », « another product ») est ambiguë pour le public même de l'annuaire.
3. C3, C4 et C6 ensemble : périmètre exact des en-têtes, plus de « temporarily », plus de `replique`. Trois retouches de texte qui suffisent pour atteindre le GO sur l'exactitude et les règles maison.

## Décisions à confirmer par l'utilisateur

- U+2060 dans les données de l'API : on le documente (C1) ou on le retire du code ?
- Bots et apps dans la licence : question pour @legal (C7).

## Handoff → @orchestrator

- Fichier produit : `/home/user/Marrant/docs/reviews/review-developers-s22-v2.md`
- Verdict : NO-GO, 8,5/10, zéro bloquant. C1 à C6 sont des retouches de texte dans `config/textes/developers.ts` (@copywriter ou @fullstack). C7 revient à @legal, C8 à @infrastructure. Après C1 à C6, une re-relecture limitée aux critères 1 et 5 suffit.
- Points d'attention : licence non réécrite, conformément à la consigne. Capture mobile vérifiée à résolution réduite seulement.
