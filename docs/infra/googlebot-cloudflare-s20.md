# Googlebot et Cloudflare : canonique étrangère sur le pilier (s20)

> @infrastructure, 11/10/2026 (~23:00 UTC). **Lecture seule** : aucun réglage Cloudflare, aucun code, aucun commit.
> Zone `deviens-marrant.fr` (plan **Free**), Worker `marrant` (domaines personnalisés apex + www).

## 1. Verdict

**Hypothèse « challenge Cloudflare servi au vrai Googlebot » : NON confirmée et peu probable.** Elle ne peut pas être exclue à 100 % : les jetons disponibles n'ont pas accès aux événements de sécurité (§5). Trois preuves vont contre :

1. **Une requête a bien atteint le Worker sur le pilier dans la minute exacte du crawl.** L'entrée de cache ISR (R2 `marrant-next-cache`) du pilier pour le build en ligne à ce moment-là (`hxyh1qnH_nRI621Q07PPX`) a été **réécrite à 2026-10-11T13:06:39Z**. Le crawl Google a eu lieu à 13:06 UTC. Ce build a commencé à écrire à 12:35 (déploiement) : l'écriture de 13:06:39 vient donc d'une requête réelle (page STALE, revalidation en arrière-plan), pas du peuplement du cache. Trafic total d'environ 3 requêtes/min tous chemins confondus : il est très probable que ce soit la requête de Googlebot. Une requête bloquée par un challenge n'atteint jamais le Worker.
2. **Le HTML écrit à 13:06:39 est sain** : 109 157 octets, `<title>` correct, `<link rel="canonical" href="https://deviens-marrant.fr/blog/comment-devenir-drole">` à l'octet 3 074, article complet. Même chose pour les 32 versions du pilier en cache depuis le 29/09 : toutes ont la canonique.
3. **Search Console indique « récupération réussie ».** Un challenge Cloudflare répond avec l'en-tête `cf-mitigated: challenge`, avec un statut 403 d'après ce que j'ai relevé (ce statut ne figure pas dans l'extrait officiel lu, cf. sources). Search Console signale un 403 comme un échec d'exploration (« bloquée, 403 »). Il ne le classerait pas en « doublon » avec une récupération réussie.

Autre indice : les deux sites que Google choisit comme canoniques (`www.747live.bet` pour 9 URL, `www.marcustheatres.com` pour 2) **ne servent pas de challenge**. Ce sont des sites **Next.js** (`x-powered-by: Next.js`). `747live.bet` renvoie 200 et une vraie page à un UA Googlebot. Le regroupement ne se fait donc pas sur des pages « Just a moment… ».

## 2. Réglages de zone lus (jeton DM, `Zone Settings Read`)

| Réglage | Valeur | Effet possible sur Googlebot |
|---|---|---|
| Plan | Free | Pas de Super Bot Fight Mode, pas de WAF managé |
| `security_level` | `medium` | Challenge seulement les IP de mauvaise réputation. IP Google : non concernées |
| `browser_check` (Browser Integrity Check) | `on` | Vise les en-têtes anormaux. Googlebot n'est pas concerné en pratique (non vérifiable sans événements) |
| `challenge_ttl` | 1800 | Sans objet |
| `waf` (ancien WAF) | `off` | Sans objet |
| `email_obfuscation` | `on` | Aucune réécriture vue dans le HTML (`mailto:` en clair, aucun `cdn-cgi`) : sans effet sur le Worker |
| robots.txt géré par Cloudflare / Content Signals | **absent** | Le `robots.txt` servi est celui de Next (`robots.ts`), sans bloc Cloudflare ni `Content-Signal` |
| Bot Fight Mode, « Block AI bots », règles WAF personnalisées, limitation de débit, règles d'accès IP | **non lisibles** (erreur 10000) | Voir §5 |

Indice indirect sur Bot Fight Mode : en plan Free, ce mode s'accompagne d'une injection de script de détection (`/cdn-cgi/challenge-platform/...`) dans les pages HTML **[À VÉRIFIER : comportement documenté pour le trafic proxifié, non confirmé pour une réponse de Worker]**. Aucun script de ce type n'apparaît dans le HTML servi. De plus, `curl` depuis une IP de centre de données (sans aucun UA de navigateur) reçoit 200. Les deux indices vont plutôt dans le sens d'un Bot Fight Mode désactivé, sans le prouver.

## 3. Worker : erreurs et latence depuis le 30/09 (`workersInvocationsAdaptive`)

| Période | Requêtes `success` | Exceptions | `clientDisconnected` | wall time P99 |
|---|---|---|---|---|
| 30/09 au 11/10 (12 jours) | 83 852 | **5** (le 07/10 uniquement) | 506 (dont 372 le 07/10) | 2,5 à 6,2 s |
| 11/10 | 4 684 | 0 | 3 | **6,17 s** |

- Aucune vague d'erreurs Worker sur les dates de crawl des URL touchées (30/09, 02/10, 10/10, 11/10).
- `success` signifie que le script n'a pas levé d'exception, **pas** que la réponse est en HTTP 200. La répartition par code HTTP (`httpRequestsAdaptiveGroups.edgeResponseStatus`) demande `Analytics Read` sur la zone (§5).
- `wrangler tail` ne remonte pas le passé. Workers Logs est activé (`observability.enabled: true` dans `wrangler.jsonc`), mais son API de requête (`/workers/observability/telemetry/query`) refuse les deux jetons.
- La traîne P99 de 2,5 à 6 s correspond au diagnostic `diagnostic-vitesse-ahrefs-s20.md` (fiches perpétuellement STALE, corrigé au déploiement s20 de 20:24 UTC). C'est un frein au **budget d'exploration** (305 URL jamais explorées), pas une cause de canonique étrangère.

## 4. Hypothèses éliminées (preuves)

| Hypothèse | Test | Résultat |
|---|---|---|
| Middleware ou Worker qui réagit au user-agent | Grep `googlebot\|bot\|user-agent` dans `src/middleware.ts` et `cloudflare/worker.ts` | Aucune logique par UA. Seuls traitements : redirection www vers apex (301), `withAuth` limité à `/profil`, `/favoris`, `/onboarding`, `/abonnement`, `X-Robots-Tag` sur `*.workers.dev` |
| Contenu différent selon l'UA | 8 UA (Googlebot smartphone, Googlebot simple, bingbot, AhrefsBot, GPTBot, ClaudeBot, curl, vide) | 200 partout, même titre, même canonique, aucun `cf-mitigated` |
| Contenu différent selon les en-têtes | `Accept: */*`, `Accept-Encoding: identity`, HTTP/1.1, `Accept-Language: en-US` | 200, 109 157 octets, `text/html`, canonique présente |
| Redirection ou DNS | `www.` et `http://` vers l'URL canonique en 301 en un seul saut. Apex et www : mêmes IP Cloudflare (A et AAAA) | Sain |
| Plantage du rendu JS (WRS) qui efface la canonique | Chromium sans tête, UA Googlebot smartphone, `/api/` bloqué (comme le fait robots.txt), puis chunks JS forcés en 404 (page, layout, chunks partagés, `main-app`) | Titre, H1, canonique et 12 163 caractères de texte toujours présents. Aucun « Application error ». Les seules erreurs sont next-auth `CLIENT_FETCH_ERROR` et Umami, attendues avec `/api/` bloqué |
| Chunks JS indisponibles | Les 15 ressources `/_next/static` de la page | 200, sans redirection |
| Page d'erreur ISR mise en cache | 32 versions du pilier dans R2 | Toutes en `type: app`, avec canonique. Depuis le 04/10, un marqueur `BAILOUT_TO_CLIENT_SIDE_RENDERING` (composant client utilisant `useSearchParams` sans Suspense, vide, en tête de `<main>`). Bénin : le contenu SSR est complet |

## 5. Droits manquants (pour clore la question du challenge)

Jetons testés : `CLOUDFLARE_API_TOKEN` et `CLOUDFLARE_DM_TOKEN` (valeurs non reproduites). Ajouter au jeton DM, **en lecture seule**, sur la zone `deviens-marrant.fr` :

| Permission (écran « Créer un jeton personnalisé ») | Débloque |
|---|---|
| Zone > **Analytics** > Read | GraphQL `firewallEventsAdaptive(Groups)` (actions et sources des challenges/blocages par UA) et `httpRequestsAdaptiveGroups` (codes HTTP par UA) |
| Zone > **Bot Management** > Read | `GET /zones/{id}/bot_management` : `fight_mode`, `ai_bots_protection`, `is_robots_txt_managed` |
| Zone > **Zone WAF** > Read | Rulesets `http_request_firewall_custom` et `http_ratelimit` |
| Zone > **Firewall Services** > Read | Règles d'accès IP/ASN/pays et blocage par UA |
| Compte > **Workers Observability** > Read (nom exact à confirmer dans l'écran) | Journaux Worker historiques (UA, chemin, statut) autour du 11/10 13:06 |

Limite : la rétention des événements de sécurité en plan Free est courte **[À VÉRIFIER dans la doc Cloudflare]**. Les crawls du 30/09 et du 02/10 sont peut-être déjà hors fenêtre. Agir vite.

## 6. Ce qui reste ouvert

Google dit n'avoir vu **aucune canonique déclarée**, alors que tout ce qu'on peut observer (cache R2 à 13:06:39, réponses actuelles, rendu headless) en contient une. Deux pistes restent ouvertes, elles ne sont pas prouvées :
- **[HYPOTHÈSE A]** Une règle Cloudflare non lisible (Bot Fight Mode, règle personnalisée, limitation de débit) a touché **certaines** requêtes de Googlebot (crawl de rendu ou de ressources, d'autres jours). La requête de 13:06 sur le pilier, elle, est bien passée (§1.1). Se tranche avec les droits du §5.
- **[HYPOTHÈSE B]** Côté Google : regroupement erroné de pages jugées faibles ou quasi vides après rendu avec des pages d'autres sites Next.js (les deux canoniques étrangères sont des sites Next.js). Se tranche avec le test en direct de Search Console (§7).

## 7. Actions (aucune n'a été faite)

### 7.1 Thomas, Search Console (10 min, à faire en premier, c'est le test décisif)
1. Inspection d'URL > `https://deviens-marrant.fr/blog/comment-devenir-drole` > **« Tester l'URL en direct »**. Ce test passe par une IP Google, il voit donc tout éventuel challenge Cloudflare.
2. **« Afficher la page testée »** : onglet HTML (chercher `rel="canonical"` et le titre « Comment devenir drôle : 5 piliers… »), capture d'écran, puis « Plus d'infos » > ressources de la page (aucune ne doit être « Autre erreur » ou 403) et messages de la console JavaScript.
3. Résultat attendu : HTML complet avec canonique, capture de l'article. Dans ce cas, cliquer **« Demander l'indexation »**. Puis faire la même chose pour 1 conseil touché (liste dans `docs/seo/point-etape-s20.md` §1). Une seule demande par URL.
4. Si le test montre « Just a moment… », un 403/503 ou une capture vide : envoyer la capture et le HTML à la session. On applique alors 7.2. Ne pas demander l'indexation avant correction.

### 7.2 Correctif Cloudflare, seulement si 7.1 ou les événements (§5) montrent un challenge
| Source constatée | Changement exact | Réversible |
|---|---|---|
| Bot Fight Mode | Tableau de bord > zone `deviens-marrant.fr` > Sécurité > Paramètres (filtre « Trafic des bots ») > **Bot Fight Mode : désactivé** (libellés selon la version du tableau de bord). API : `PUT /zones/d650dd78a6786e01a67d50096137eb53/bot_management` avec `{"fight_mode": false}`. En plan Free, Bot Fight Mode ne peut pas être contourné par une règle de saut : le seul correctif est l'interrupteur. | Oui, simple interrupteur |
| Browser Integrity Check | Sécurité > Paramètres > **Browser Integrity Check : désactivé**. API : `PATCH /zones/d650dd78a6786e01a67d50096137eb53/settings/browser_check` avec `{"value":"off"}` | Oui, simple interrupteur |
| Règle WAF personnalisée | Sécurité > Règles WAF > règle en cause : ajouter `and not cf.client.bot` à son expression | Oui (rétablir l'expression) |
| Limitation de débit | Même endroit, onglet limitation de débit : ajouter `and not cf.client.bot` | Oui |
| « Block AI bots » | Sans effet sur Googlebot (Google-Extended est un jeton robots.txt, pas un robot distinct). Ne pas toucher pour ce problème | - |

Rollback : remettre l'interrupteur ou l'expression dans l'état d'avant (relever l'état exact avant toute modification).

### 7.3 Session / agents
- **Session** : ajouter les permissions du §5 au jeton DM, puis relancer les 2 requêtes GraphQL (`firewallEventsAdaptiveGroups` et `httpRequestsAdaptiveGroups`, filtre `userAgent_like: "%Googlebot%"`, depuis le 30/09, groupées par `action`, `source`, `edgeResponseStatus`). 15 min.
- **@data-analyst** : réinspecter les 11 URL à J+3 et J+7 (script s20 existant).
- **@fullstack (mineur, ce n'est pas la cause)** : le `BAILOUT_TO_CLIENT_SIDE_RENDERING` en tête de `<main>` (depuis le 04/10) vient d'un composant client qui utilise `useSearchParams` hors `<Suspense>`. L'envelopper dans `<Suspense fallback={null}>` pour garder un SSR propre.
- Le budget d'exploration (305 URL jamais explorées) dépend surtout de la latence (§3), traitée par le lot s20 (`enableCacheInterception`). À re-mesurer après déploiement.

## 8. Méthode (reproductible)
- R2 : `GET /accounts/{acc}/r2/buckets/marrant-next-cache/objects/incremental-cache/<buildId>/<sha256(chemin)>.cache` (jeton DM). Pour le pilier, la clé se termine par `27eb9117…4e4a.cache`. Le `Last-Modified` donne l'heure d'écriture.
- Rendu : Playwright + Chromium 1194 (`/opt/pw-browsers`), UA Googlebot smartphone, viewport 412×732, `networkidle` + 3 s.

## Sources
- [Cloudflare challenges (docs, en-tête `cf-mitigated`)](https://developers.cloudflare.com/waf/reference/cloudflare-challenges)
- [Stop malicious bots (Free, Pro, Business)](https://developers.cloudflare.com/use-cases/solutions/stop-malicious-bots/)
- [Retour d'expérience : Bot Fight Mode et Googlebot (anecdotique)](https://daily.dev/posts/how-cloudflare-bot-fight-mode-quietly-killed-our-google-rankings-lbdhmurms)
- [En-tête cf-mitigated](https://http.dev/cf-mitigated)

---
**Handoff → session principale**
- Fichier produit : `/home/user/Marrant/docs/infra/googlebot-cloudflare-s20.md`
- Décisions : aucun réglage modifié. Le challenge Cloudflare n'est pas la cause démontrée sur le pilier (requête Worker à 13:06:39, HTML avec canonique).
- Points d'attention : jetons sans Analytics, Bot Management, WAF ni Observability en lecture ; rétention courte des événements en plan Free.
- **Actions infra requises** : (1) Thomas : test en direct dans Search Console puis demande d'indexation ; (2) session : droits en lecture du §5, puis requêtes GraphQL ; (3) 7.2 seulement si un challenge est constaté.
---
