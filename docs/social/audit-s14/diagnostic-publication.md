# Diagnostic publication sociale (audit s14)

> Lecture seule, 01/10/2026 (@fullstack). Aucune publication, aucun appel à Buffer ni à un réseau social, aucune écriture en base, aucun code modifié, aucune valeur de secret affichée. Requêtes Neon en SELECT uniquement. Seul appel sortant : GET sur 3 URLs d'images de notre propre site (`/api/social/stored-image`).
> Légende : **[PROUVÉ]** = requête, ligne de code ou commande citée ; **[HYPOTHÈSE]** = plausible, non vérifiable sans action de Thomas.

## Résumé (causes racines)

1. **Arrêt du 15/06 : ce n'est pas la publication qui s'est arrêtée, c'est la génération.** Le modèle `claude-sonnet-4-20250514` a renvoyé `404 not_found_error` à partir du 16/06 04:06 UTC. Le social-media-agent n'a plus produit un seul post jusqu'au 30/09 (282 appels en échec), donc il n'y avait plus rien à publier. **[PROUVÉ]**
2. **Instagram : 0 publication sur 42 posts, depuis le premier.** 15 échecs sont des 429 Buffer ; les 26 autres sont des erreurs classées « permanentes » dès la 1re tentative, propres à Instagram (Twitter et LinkedIn passaient les mêmes jours, avec le même token). Le texte de l'erreur n'est **jamais enregistré en base**. **[PROUVÉ]** pour la classe d'erreur, **[HYPOTHÈSE]** pour la cause exacte (canal Instagram Buffer non autorisé à publier directement, ou image PNG servie sans extension).
3. **Statistiques à 0 : aucun code ne les remplit.** Les colonnes `impressions/likes/retweets/replies/clicks` existent, mais aucun cron ne les écrit ; les fonctions de métriques des clients directs ne sont jamais appelées, et `externalId` contient l'ID Buffer, pas l'ID du tweet ou du post. **[PROUVÉ]**

---

## 1. Chaîne de publication

| Étape | Qui | Où dans le code | Quand (UTC) |
|---|---|---|---|
| Déclencheur | Cron Trigger Cloudflare `*/15 * * * *` → `/api/cron/scheduler-tick` (en processus, pas de self-fetch). Avant le 30/09 : `setInterval` 15 min de Replit (`instrumentation.ts`) | `apps/web/cloudflare/worker.ts:44`, `:137` (garde `CRON_ENABLED`, = `"true"` dans `wrangler.jsonc`) | toutes les 15 min |
| Ordre des jobs à chaque tick | daily-content → … → **daily-social → publish-social → social-analytics** → … | `apps/web/src/lib/scheduler/jobs.ts:598-609` | |
| 1. Génération | Job `runDailySocialJob` → route `/api/cron/daily-social` → `generateDailySocialPosts` (social-media-agent, Claude) | `jobs.ts:290-358`, `daily-social/route.ts` | fenêtre 4h, catch-up 6h-23h |
| 2. Approbation | **Automatique** par le Stand-Up Director : `APPROVED` si `directorValidated === true` et score ≥ 9 (`approvedBy = "director"`), sinon `PENDING` (approbation manuelle admin, `approvedBy = "admin"`) | `daily-social/route.ts:188-190` ; `publish-social/route.ts` (filtre `approvedBy not null OR directorScore >= 9`, rétrogradation des APPROVED < 9) | à la génération |
| 3. Publication | Job `runPublishSocialJob` → `/api/cron/publish-social` : posts `APPROVED` avec `scheduledAt <= now`, **1 post par plateforme et par run**, envoyés à **Buffer** (API GraphQL `api.buffer.com`, mutation `createPost`, `dueAt = scheduledAt` ou now + 2 min). Buffer publie ensuite sur X, LinkedIn, Instagram | `jobs.ts:363-375`, `publish-social/route.ts`, `lib/social/buffer-client.ts` | toutes les 15 min |
| 4. Suivi | Job `runSocialAnalyticsJob` → `/api/cron/social-analytics` : comptages 7 j, APPROVED > 48 h → FAILED, PENDING > 48 h → FAILED, lecture de la queue Buffer. **Aucune métrique d'audience** | `social-analytics/route.ts` (time gate heures paires) | toutes les 2 h |

Horaires observés en base (scheduledAt des derniers posts) : X vers 05h ou 11h, LinkedIn vers 15h, Instagram entre 05h et 19h UTC (`getOptimalScheduleTime`). Rythme cible : 1 X + 1 LinkedIn (sauf jours Yanis) + 1 Instagram par jour.

Clients directs (`twitter-client.ts`, `linkedin-client.ts`, `instagram-client.ts`) : **code mort**, jamais importés hors tests (Grep `lib/social/(twitter|linkedin|instagram)-client` : 0 import dans `src/` hors `__tests__`). Tout passe par Buffer.

---

## 2. Causes racines

### 2.1 Arrêt du 15/06 : génération coupée par le retrait du modèle Claude **[PROUVÉ]**

**Preuve 1, la publication marchait encore le 15/06.**
```sql
SELECT platform, status, count(*), max("publishedAt") FROM "SocialPost" GROUP BY 1,2;
```
TWITTER PUBLISHED 518 (dernier 15/06 05:06), LINKEDIN PUBLISHED 39 (dernier 15/06 15:06). Le 15/06, le tweet et le post LinkedIn générés à 04:06 ont bien été publiés.

**Preuve 2, plus aucun post créé entre le 16/06 et le 30/09.**
```sql
SELECT to_char(date_trunc('month',"createdAt"),'YYYY-MM'), count(*) FROM "SocialPost" GROUP BY 1;
```
2026-03 : 48, 04 : 467, 05 : 83, 06 : 36, **07, 08, 09 : 0**, 10 : 2.

**Preuve 3, le planificateur tournait bien tous les jours.** `SocialPostDailyLock` contient une ligne par jour du 16/06 au 01/10, prise vers 04:03-04:10 UTC. Le job a donc appelé `daily-social` chaque matin.

**Preuve 4, c'est l'appel LLM qui échouait.**
```sql
SELECT model, success, left("errorMessage",90), count(*), min("createdAt"), max("createdAt")
FROM "LlmUsageLog" WHERE agent='social-media-agent' AND "createdAt">='2026-06-01' GROUP BY 1,2,3;
```
| model | success | erreur | n | période |
|---|---|---|---|---|
| claude-sonnet-4-20250514 | true | | 40 | 01/06 → 15/06 04:06 |
| claude-sonnet-4-20250514 | **false** | `404 not_found_error "model: claude-sonnet-4-20250514"` | **282** | **16/06 04:06 → 30/09 04:10** |
| claude-sonnet-5-5 | true | | 2 | 01/10 04:00 |

Le même 404 touche joke-agent, tip-agent, video-agent et seo-blog-agent dès le 16/06. Déjà documenté dans `apps/web/src/lib/ai/client.ts:29-31` (incident s11) et `lib/ai/failure-alert.ts:4-9`. **Le modèle est corrigé dans le code** (constante centrale `claude-sonnet-5-5`, surchargeable par `ANTHROPIC_SONNET_MODEL`) : le run du 01/10 04:00 a de nouveau produit 2 posts (X + Instagram, jour sans LinkedIn), remis en `PENDING` à 06:39 par la pause de l'orchestrateur.

**Facteur aggravant [PROUVÉ, code]** : `jobs.ts:310` prend le verrou du jour **avant** d'appeler la génération (`jobs.ts:350`). Si la génération échoue, le verrou bloque tout rattrapage (6h-23h) : un échec = une journée perdue, sans relance. Et l'échec n'était visible que dans `LlmUsageLog` (aucune alerte avant le module `failure-alert.ts`, ajouté en s11).

### 2.2 Instagram : 41/41 en échec, 0 publication depuis le début **[classe d'erreur PROUVÉE, cause exacte HYPOTHÈSE]**

```sql
SELECT platform, ("directorNote" LIKE '429%') is429, count(*),
  percentile_cont(0.5) within group (order by extract(epoch from ("updatedAt"-"scheduledAt"))/60) med_min,
  sum(("directorNote" LIKE '%[retry:%')::int) retried
FROM "SocialPost" WHERE status='FAILED' GROUP BY 1,2;
```
| plateforme | 429 | n | médiane échec après scheduledAt | relances |
|---|---|---|---|---|
| INSTAGRAM | non | **26** | **8,6 min** | **0** |
| INSTAGRAM | oui | 15 | 11 h | 0 |
| TWITTER | oui | 26 | 16 min | 0 |
| LINKEDIN | oui | 10 | 9,6 min | 0 |

Ce qui est prouvé :
- **Aucun post Instagram n'a jamais été publié** : les 42 posts Instagram (premier le 05/05, format `IMAGE_QUI_CLAQUE`) sont 41 FAILED + 1 PENDING.
- Les 26 échecs non-429 tombent **au premier passage** de `publish-social` (8,6 min médiane, 0 `[retry:N]`). Ce ne sont donc ni des posts bloqués 48 h (nettoyés par social-analytics bien plus tard), ni un canal absent (`isChannelConfigured` aurait laissé le post en APPROVED), ni un texte trop long (max 697 caractères, hashtags compris, pour une limite de 2 200).
- L'erreur entre dans la branche « permanente » de `publish-social/route.ts:370-385` : message contenant `400/401/403`, `invalid`, `invalide`, `not found`, `forbidden`, `unauthorized`, `expiré` ou `MutationError`. Le post passe en FAILED **sans enregistrer le message** (`route.ts:384` : `data: { status: "FAILED" }`). C'est pour ça que la base ne contient aucun texte d'erreur : la `directorNote` affichée (« Réécrit par le directeur… ») est celle de la génération.
- L'erreur est **spécifique à Instagram** : le 12/06 et le 15/06, X et LinkedIn passent au même run ou le même jour avec le même token et la même organisation Buffer.
- Seule différence de code pour Instagram : `createBufferImagePost` (`buffer-client.ts:340-412`, lignes 369 et 381) envoie `assets.images[{url}]` + `metadata: { instagram: { type: post, shouldShareToFeed: true } }`. L'URL d'image est `https://deviens-marrant.fr/api/social/stored-image?key=social-images%2F<id>.png` : un PNG (`image-generator.ts:162`, `stored-image/route.ts`, `Content-Type: image/png`) derrière une URL **sans extension de fichier** (la clé est en query string).

Hypothèses, par probabilité décroissante (à trancher avec l'e-mail d'alerte ou le tableau de bord Buffer, voir §4) :
- **[HYPOTHÈSE H1]** Canal Instagram de Buffer non autorisé à la publication directe (compte personnel ou créateur au lieu d'un compte Business relié à une page Facebook, ou connexion expirée). Buffer refuse alors la création via l'API (`MutationError`).
- **[HYPOTHÈSE H2]** Image refusée : l'API de publication Instagram n'accepte que le JPEG. Buffer peut convertir, mais une URL sans extension servie en `image/png` peut être rejetée à l'import.
- **[HYPOTHÈSE H3]** Schéma `metadata.instagram` refusé (valeur `type: post` ou champ obligatoire manquant) → erreur GraphQL 400.

Où se trouve le message exact : (a) e-mails « Publication social — echec Buffer » envoyés quand un run n'a que des échecs, ce qui arrive aux runs où Instagram est seul (19h UTC : 11 cas). Destinataire codé en dur `alex@deviens-marrant.fr` (`lib/email.ts:7`) ; (b) logs Replit de l'époque, s'ils sont conservés. Je n'y ai pas accès en lecture seule.

État actuel des images : les 2 images de juin testées renvoient **404** (stockées dans l'Object Storage Replit, non recopiées dans le bucket R2 `marrant-social-images`) ; celle du 01/10 renvoie **200 image/png, 22,8 Ko** (R2 opérationnel côté Worker). **[PROUVÉ, GET sur notre site]**

### 2.3 Les 51 échecs 429 (X, LinkedIn, Instagram, 05/05 → 13/06) **[PROUVÉ]**

36 échecs X/LinkedIn et 15 Instagram portent la note `429 rate limit … circuit breaker 24h activé` : limite de débit de l'API Buffer, alimentée par `social-analytics` qui interrogeait Buffer toutes les 15 min. Corrigé par le hotfix s10 (gate 2 h + cache 60 min + coupe-circuit, `social-analytics/route.ts:33-38`). Aucun 429 après le 13/06. Ce n'est pas la cause de l'arrêt.

### 2.4 Statistiques d'audience toujours à 0 **[PROUVÉ]**

```sql
SELECT sum(impressions), sum(likes), sum(retweets), sum(replies), sum(clicks) FROM "SocialPost";
```
→ 0 sur les 557 posts publiés.
- `schema.prisma:547-552` annonce « remplies par le cron social-analytics », mais ce cron n'écrit aucune métrique : il renvoie seulement la note « Analytics détaillées … disponibles dans le dashboard Buffer » (`social-analytics/route.ts:292`).
- `getTweetMetrics` (`twitter-client.ts:227`), `getLinkedInMetrics` (`linkedin-client.ts:195`) et `getInstagramMetrics` (`instagram-client.ts:219`) existent mais ne sont **jamais appelées**.
- Même branchées, elles ne pourraient pas fonctionner : `externalId` = ID du post **Buffer** (`buffer-client.ts`, retour de `createPost`), pas l'ID du tweet ou du post LinkedIn.
- L'API GraphQL Buffer propose des requêtes de métriques de posts, mais Buffer les présente comme **expérimentales** et déconseille de s'y fier en production ([Buffer Help Center](https://support.buffer.com/article/859-does-buffer-have-an-api), [exemples API](https://developers.buffer.com/examples/)).

## 3. Ce qui manque côté Worker Cloudflare

Méthode : noms uniquement (`env | cut -d= -f1` côté session, `wrangler secret list` côté Worker `marrant`), croisés avec les `process.env.*` lus par la chaîne sociale (`lib/social`, les 3 routes cron, `lib/scheduler`, `lib/ai/client.ts`, `lib/email.ts`, `cloudflare/worker.ts`).

| Variable / binding lu par le code | Session | Worker | Verdict |
|---|---|---|---|
| `BUFFER_ACCESS_TOKEN`, `BUFFER_ORGANIZATION_ID` | présents | présents (secrets) | OK, validité du token **non testée** (aucun appel Buffer autorisé) |
| `BUFFER_CHANNEL_TWITTER`, `_LINKEDIN`, `_INSTAGRAM` | présents | présents (secrets) | OK |
| `CRON_SECRET`, `CRON_ORIGIN`, `CRON_ENABLED` | CRON_SECRET présent | secrets + var `CRON_ENABLED="true"` | OK |
| `ANTHROPIC_API_KEY` | absent (session : `MARRANT_ANTHROPIC_API_KEY`) | présent | OK |
| `ANTHROPIC_SONNET_MODEL`, `ANTHROPIC_OPUS_MODEL`, `ANTHROPIC_EFFORT` | absents | absents | OK : défauts du code (`claude-sonnet-5-5`) |
| `CONTENT_GENERATION_ENABLED` | absent | absent | **Voulu** : absent = génération sociale en pause (`jobs.ts:292`, commit `beffa4d`). Ne pas toucher |
| `RESEND_API_KEY`, `EMAIL_FROM` | présents / absent | présents | OK (alertes admin envoyables) |
| `NEXT_PUBLIC_SITE_URL` | présent | build | Figée au build, sert aux URLs d'images |
| R2 `SOCIAL_IMAGES` (bucket `marrant-social-images`) | n/a | lié (`wrangler.jsonc`) | OK pour les nouvelles images (200) ; **images d'avant le 30/09 non migrées** (404) |
| `INSTAGRAM_ACCESS_TOKEN`, `TWITTER_BEARER_TOKEN` | absents | absents | Sans effet : seuls les clients directs (code mort) les lisent |

Conclusion **[PROUVÉ]** : **rien ne manque au Worker pour publier via Buffer**. Les 5 variables Buffer sont en place et le cron de publication tourne toutes les 15 min (`worker.ts:44`, `jobs.ts:603`). Points d'attention :
- `docs/infra/cloudflare-env.md` ne liste que `BUFFER_CHANNEL_TWITTER` (§2) : `BUFFER_CHANNEL_LINKEDIN` et `BUFFER_CHANNEL_INSTAGRAM` manquent dans la doc (pas sur le Worker).
- `publish-social` **n'est pas couvert par la pause** : tout post repassé en `APPROVED` (approbation admin comprise) part chez Buffer au tick suivant. Les 2 posts du 01/10 sont `PENDING` : social-analytics les passera en FAILED le 03/10 vers 04h (TTL 48 h, `social-analytics/route.ts`), ce qui est sans risque.
- Les messages d'erreur de `publish-social` ne vivent que dans les logs Workers (`observability.enabled`, rétention limitée) et dans l'e-mail envoyé à `alex@deviens-marrant.fr`.

## 4. Correctifs proposés (non appliqués)

### Actions Thomas (comptes, aucune ligne de code)
1. **Buffer, canal Instagram** : dans publish.buffer.com, vérifier que le compte Instagram est connecté en **publication directe** (compte Business relié à une page Facebook), sans bandeau « reconnecter ». Reconnecter si besoin. Tranche H1.
2. **Message d'erreur Instagram** : chercher dans la boîte `alex@deviens-marrant.fr` les e-mails « Publication social — echec Buffer » (mai-juin, envois vers 19h UTC) : ils contiennent le texte exact renvoyé par Buffer. Tranche H1, H2 ou H3 en une lecture.
3. **Token Buffer** : vérifier dans les réglages API de Buffer que le token utilisé n'est ni révoqué ni expiré (dernier succès prouvé : 15/06). Ne pas me transmettre la valeur.
4. Confirmer que l'adresse destinataire des alertes (`alex@deviens-marrant.fr`, codée en dur) est bien lue.

### Code (à confier à @fullstack après le GO de l'orchestrateur)
| # | Correctif | Fichier | Effet |
|---|---|---|---|
| C1 | Enregistrer le message d'erreur sur chaque FAILED (`directorNote` ou nouvelle colonne `lastError`), dans les branches permanente et 3e relance | `publish-social/route.ts:381-398` | Plus jamais d'échec muet en base |
| C2 | Prendre le verrou journalier **après** une génération réussie (ou le libérer en cas d'échec) pour que le rattrapage 6h-23h fonctionne | `jobs.ts:310` et `:350` | Une panne ponctuelle ne coûte plus une journée |
| C3 | Images Instagram : servir une URL terminée par `.jpg` (ex. `/api/social/image/<id>.jpg`) en **JPEG** (conversion via le binding `IMAGES` déjà déclaré) | `image-generator.ts`, `image-storage.ts`, route `stored-image` | Lève H2 |
| C4 | Avant de publier sur Instagram, vérifier le canal via `getBufferChannels()` (service, `isQueuePaused`) et journaliser l'état | `publish-social/route.ts` | Diagnostic immédiat de H1 |
| C5 | Statistiques : nouveau job quotidien qui lit les métriques des posts envoyés via l'API Buffer (requêtes « posts with metrics », expérimentales) et remplit `impressions/likes/…` ; stocker aussi l'ID réseau quand Buffer le renvoie. Alternative : supprimer les colonnes et assumer le tableau de bord Buffer | `social-analytics/route.ts`, `schema.prisma` | Fin des stats à 0, ou fin de la fausse promesse du schéma |
| C6 | Supprimer le code mort (`twitter-client.ts`, `linkedin-client.ts`, `instagram-client.ts` côté `lib/social`, après Grep de confirmation) | `lib/social/` | Moins de confusion sur la chaîne réelle |
| C7 | Mettre à jour `docs/infra/cloudflare-env.md` (`BUFFER_CHANNEL_LINKEDIN`, `BUFFER_CHANNEL_INSTAGRAM`) et les messages d'erreur « Secrets Replit » → « secrets Worker » | `buffer-client.ts`, `publish-social/route.ts`, doc | Exactitude |

### Config
- Aucune variable à ajouter au Worker pour la publication. Pour relancer : remettre `CONTENT_GENERATION_ENABLED="true"` **seulement** à la fin de l'audit, sur décision de Thomas.
- Optionnel : migrer les images Replit vers R2, inutile si les posts de juin ne sont pas republiés.

### Ordre recommandé
Actions Thomas 1-2 (trancher Instagram) → C1 + C2 (observabilité, robustesse) → C3/C4 selon le verdict → test sur **un** post Instagram approuvé à la main → C5.

---

**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/social/audit-s14/diagnostic-publication.md`
- Aucun code, aucune donnée, aucune config modifiés. Aucun appel Buffer ou réseau social.
- Actions infra requises : aucune immédiate ; actions de compte Thomas 1-4 ci-dessus.
- Pre-commit check : sans objet (aucun fichier `src/` modifié).
