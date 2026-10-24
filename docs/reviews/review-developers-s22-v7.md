# Relecture à l'aveugle : /developers, sections « CORS and caching » et « Rate limit » (s22 v7)

Périmètre : `TEXTE_CORS_CACHE`, `TEXTE_CACHE`, `TEXTE_ROTATION`, `TEXTE_LIMITE` (`apps/web/src/config/textes/developers.ts:87-100`) et leur rendu (`apps/web/src/app/(dashboard)/developers/page.tsx:180-186`). Vérifié contre `route.ts`, `lib/widget/vanne-du-jour.ts` et la règle Cloudflare relevée dans `REPLIT_ACTIONS.md:23` (ip.src + cf.colo.id, 10 req / 10 s, blocage 10 s).

## Verdict : NO-GO, 8/10 (1 bloquant, correction d'une ligne)

## Exactitude, affirmation par affirmation

| Affirmation | Code / fait | Verdict |
|---|---|---|
| ACAO `*` sur GET 200, 403, 503 et OPTIONS | `route.ts:21-31` (BASE_HEADERS sur 200/403/503), `route.ts:70-71` | Exact |
| Réponses du CDN (429) sans CORS | Fait mesuré | Exact |
| `public, max-age=300, s-maxage=3600` | `route.ts:62`, `vanne-du-jour.ts:78-80` | Exact |
| s-maxage plafonné à minuit pendant la dernière heure, max-age pendant les 5 dernières minutes | `min(3600, secondes restantes)` et `min(300, sMaxAge)` | Exact |
| Retrait d'une vanne : peut changer avant minuit | Empreinte de liste dans la clé du cache edge (`vanne-du-jour.ts:156`), modulo du pool | Exact (« can » est juste) |
| « a fixed set » | La phrase d'avant dit qu'on peut retirer une vanne | Imprécis (C1) |
| 10 req / 10 s par IP, blocage 10 s, 429 | `REPLIT_ACTIONS.md:23` | Exact (le compteur par datacenter est une simplification sans risque pour l'intégrateur) |
| « The joke only changes at midnight UTC » | Contredit `TEXTE_ROTATION` (changement possible avant minuit) | **Faux (B1)** |

Tirets cadratin et demi-cadratin : aucun (Grep `[—–]` sur le fichier, 0 résultat). Rien d'inventé.

## Bloquant

**B1, `TEXTE_LIMITE`, 4e phrase : affirmation fausse, et qui contredit le paragraphe Rotation juste au-dessus.**
- Actuel : « The joke only changes at midnight UTC, so one call a day is enough: »
- Proposé : « The joke normally changes only at midnight UTC, so one call a day is enough: »

## Corrections (non bloquantes, à faire dans la même passe)

**C1, `TEXTE_ROTATION` : « fixed » contredit le retrait, et la 1re phrase répète le chapeau.**
- Actuel : « The joke changes every day at midnight UTC and is the same for everybody. If we withdraw a joke, the joke of the day can change before midnight UTC. The rotation is a fixed set of hand-picked jokes, so jokes come back over time. »
- Proposé : « The joke changes every day at midnight UTC and is the same for everybody. The rotation draws from a limited set of hand-picked jokes, so jokes repeat over time. If we withdraw a joke, the joke of the day can change before midnight UTC. »
- Pourquoi : le paragraphe finit sur l'exception, ce qui prépare le « normally » de B1 dans la section suivante.

**C2, `TEXTE_CACHE`, 1re phrase : la valeur fixe annoncée est ensuite démentie.** Le lecteur pressé retient « 300 / 3600 » sans le plafond.
- Actuel : « A successful response carries Cache-Control: public, max-age=300, s-maxage=3600, so browsers may keep it for 5 minutes and shared caches for 1 hour. »
- Proposé : « A successful response normally carries Cache-Control: public, max-age=300, s-maxage=3600, so browsers may reuse it for up to 5 minutes and shared caches for up to 1 hour. »
- Et : « capped at the seconds left before midnight » → « capped at the number of seconds left until midnight ».

**C3, `TEXTE_LIMITE`, anglais et rythme.** Le paragraphe mêle la limite et le conseil de cache (4 phrases, 2 idées).
- « Beyond that, the address is blocked for 10 seconds and gets an HTTP 429 response. » → « Beyond that, the address is blocked for 10 seconds: every request gets an HTTP 429 response. »
- « each visitor counts against their IP address; » → « each visitor's requests count against their own IP address; »
- Optionnel : couper en deux `<p>` avant « The joke normally changes… » (le conseil de cache devient lisible en 20 s). Ajout de constante = retouche de `page.tsx:186`.

**C4 (optionnel), `TEXTE_CORS_CACHE`.** « CORS is enabled for every origin: every GET response » : double « every ». Proposé : « CORS is open to all origins: every GET response… ».

## Note par critère

Exactitude 7/10 (B1) · anglais 8/10 · clarté 20 s 8/10 · enchaînement 8/10 · tirets 10/10 · invention 10/10. Après B1 + C1 + C2 : 9/10 attendu, GO.

## Handoff → @orchestrator
- Fichier : `/home/user/Marrant/docs/reviews/review-developers-s22-v7.md`
- Note : 8/10, NO-GO
- Bloquant : B1 (`TEXTE_LIMITE` « only changes at midnight UTC », faux puisqu'un retrait change la vanne avant minuit)
- À relancer : @copywriter (B1, C1-C3), puis contre-relecture à l'aveugle ciblée sur ces 4 constantes
