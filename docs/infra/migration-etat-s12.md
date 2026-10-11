# Migration Cloudflare : état au 29/09/2026 (session s12)

Complète `migration-cloudflare-plan.md`. Aucune action sur le site en ligne, aucun changement DNS.

## 1. Variables de l'environnement Claude (vérifiées par API, valeurs jamais affichées)

| Variable | Nature réelle constatée | Utilisable pour |
|---|---|---|
| `CLOUDFLARE_DM_TOKEN` | Token API **utilisateur**, actif, sans expiration | Lecture compte, Workers Scripts (lecture OK), R2 (lecture OK) |
| `CLOUDFLARE_DM_ID` | **Pas l'Account ID** : c'est l'Access Key ID d'une clé **R2 S3** (ListBuckets S3 = 200 avec `CLOUDFLARE_SECRET_KEY`) | Accès S3 à R2 uniquement |
| `CLOUDFLARE_SECRET_KEY` | Secret Access Key R2 S3 (paire avec `CLOUDFLARE_DM_ID`) | Accès S3 à R2 uniquement |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID correct (compte « Thomas.issa@gmail.com's Account ») | `CLOUDFLARE_ACCOUNT_ID` de wrangler |
| `CLOUDFLARE_API_TOKEN` | Autre token du même compte (voit les 5 zones Versi/devrefs/levantinelives), non annoncé pour Marrant : **non utilisé** | - |
| `NEON_DATABASE_URL` | Connexion directe (sans `-pooler`), Neon eu-central-1 (Francfort), Postgres 16, base `neondb` | OK techniquement |

### Droits de `CLOUDFLARE_DM_TOKEN` (appels réels sur le bon compte)

| Service | Résultat | Requis pour |
|---|---|---|
| Account (lecture) | OK | - |
| Workers Scripts | lecture OK, écriture non testée | déploiement |
| Sous-domaine workers.dev (`thomas-issa`) | **refusé** | publier sur `*.workers.dev` |
| R2 | lecture OK (1 bucket existant `levantine-scans`, hors Marrant, non touché) | cache ISR OpenNext |
| Hyperdrive | **refusé** | connexion Neon |
| KV | refusé | non requis par défaut |
| D1, Queues | refusé | non requis |
| Zones / DNS | **0 zone visible** | étape C (ajout de zone, import des enregistrements) |
| Abonnement (offre Workers payante) | illisible | vérifier à la main dans le tableau de bord |

## 2. Base Neon : VIDE

- `neondb` : 0 table (schéma `public` vide, 7 Mo = taille d'une base vide).
- `postgres` : uniquement les tables internes Neon (`health_check`, `neon_migration.migration_id`, `lakebase_attributes`).
- Conclusion : l'import Replit n'est pas dans la branche/base pointée par `NEON_DATABASE_URL` (import non terminé, fait sur une autre branche Neon, ou dans un autre projet).

## 3. DNS deviens-marrant.fr (2e capture IONOS du 29/09 = conforme au DNS public)

DNS public actuel (Google et Cloudflare DoH, 29/09/2026) :

| Nom | Type | Valeur publique | 1re capture (autre domaine) |
|---|---|---|---|
| @ | NS | ns1117.ui-dns.org, ns1067.ui-dns.biz, ns1091.ui-dns.com, ns1101.ui-dns.de | - |
| @ | A | **34.111.179.208** (Replit, `server: Google Frontend`, HTTP 200) | Non : capture = 217.160.0.10 (redirection IONOS) |
| @ | AAAA | aucun | Non : capture = 2001:8d8:100f:f000::200 |
| www | CNAME | deviens-marrant.fr (www → 301 vers l'apex) | Non : capture = A/AAAA de redirection |
| @ | MX | 10 mx00.ionos.fr, 10 mx01.ionos.fr | Oui |
| @ | TXT | `v=spf1 include:_spf-eu.ionos.com ~all` | Oui |
| @ | TXT | `google-site-verification=d5iu…` | **Non** |
| @ | TXT | `replit-verify=e34d97b7-…` | **Non** |
| _dmarc | CNAME | dmarc.ionos.fr (`v=DMARC1; p=none;`) | Oui |
| s1-ionos._domainkey | CNAME | s1.dkim.ionos.com | Oui |
| resend._domainkey | TXT | clé DKIM Resend | **Non** |
| send | MX | 10 feedback-smtp.eu-west-1.amazonses.com (Resend) | **Non** |
| send | TXT | `v=spf1 include:amazonses.com ~all` (Resend) | **Non** |
| _dep_ws_mutex | TXT | inexistant (NXDOMAIN) | Non : présent dans la capture |

2e capture IONOS : confirme A @ 34.111.179.208, `replit-verify`, `google-site-verification`, `resend._domainkey`, MX `send`, et ajoute `s2-ionos._domainkey` → s2.dkim.ionos.com, `autodiscover` → adsredir.ionos.info, `_domainconnect` → _domainconnect.ionos.com (spécifique IONOS, inutile sur Cloudflare). Hors cadre de la capture (bas de liste) mais publics : TXT `send` (SPF amazonses) et CNAME `www`, à vérifier à l'import.

**DNSSEC : désactivé** (aucun enregistrement DS ni DNSKEY publié ; le champ de la demande était resté « [activé/désactivé] »). Rien à désactiver chez IONOS avant l'étape C.

## 4. Ce qui manque (à faire par Thomas)

1. ~~Neon~~ : fait, copie directe depuis la base Replit (voir §7).
2. **Token Cloudflare** : éditer `CLOUDFLARE_DM_TOKEN` (ou en créer un nouveau) avec, sur le compte : Workers Scripts **Edit**, Workers Routes **Edit** (inclut le sous-domaine workers.dev), Hyperdrive **Edit**, Workers R2 Storage **Edit**, Account Settings **Read** ; et pour l'étape C : Zone **Edit** + DNS **Edit** (toutes les zones du compte, ou deviens-marrant.fr une fois ajoutée).
3. ~~Offre Workers payante~~ : active (confirmé par Thomas le 29/09).
4. ~~Capture DNS~~ : reçue (2e capture), conforme.
5. **Autorisation étape C** : l'ajout de la zone sur Cloudflare a été bloqué par le garde-fou de la session Claude (changement DNS). Soit Thomas ajoute la zone lui-même (tableau de bord Cloudflare, « Add a site », offre Free, import automatique), soit il autorise explicitement cette action dans la session.

## 5. Étape C, déroulé préparé (sans effet visible)

1. Ajouter la zone deviens-marrant.fr sur Cloudflare (import auto).
2. Comparer l'import avec le tableau §3 : tous les enregistrements du §3 (hors NS) doivent être présents, en **DNS only (nuage gris)** pour A @ et CNAME www (le site reste sur Replit), MX/TXT/DKIM Resend et IONOS identiques. Ajouter à la main tout enregistrement manquant (Resend et `replit-verify` sont souvent oubliés).
3. DNSSEC : rien à faire (désactivé).
4. **Changement des serveurs DNS chez IONOS vers ceux de Cloudflare : uniquement sur GO explicite de Thomas.** Le site continue de pointer vers Replit.

## 6. Base source Replit (lecture seule, 29/09/2026)

Hébergée chez Neon (us-west-2), Postgres 16, 31 Mo, **36 tables, 42 860 lignes**, pas d'historique `_prisma_migrations` (schéma géré par `db push`).

| Table | Lignes |
|---|---|
| Account | 2 |
| BlogArticle | 12 |
| CeoAuditLog | 1 |
| CeoBacklink | 0 |
| CeoCommentBlacklist | 0 |
| CeoConfig | 1 |
| CeoDedup | 0 |
| CeoKpiSnapshot | 125 |
| CeoLead | 0 |
| CeoMemory | 0 |
| CeoOutboundMessage | 0 |
| CeoTask | 0 |
| ContentPlan | 12 |
| ContentPlanEntry | 366 |
| DailyContent | 115 |
| FeatureVote | 0 |
| JobLock | 0 |
| Joke | 746 |
| JokeLike | 3 |
| LearningPath | 7 |
| LearningPathStep | 33 |
| LlmUsageLog | 40037 |
| PushToken | 0 |
| SeoCalendar | 17 |
| Session | 0 |
| SocialPost | 634 |
| SocialPostDailyLock | 146 |
| Subscription | 2 |
| Tip | 464 |
| User | 12 |
| UserFavorite | 4 |
| UserPathProgress | 1 |
| VerificationToken | 1 |
| Video | 119 |
| WebhookEvent | 0 |
| _prisma_migrations | 0 |

Compatibilité avec le `schema.prisma` de la branche : **0 colonne perdue**. La cible ajoute 2 tables (`DataPatch`, `NewsletterSubscriber`) et 10 colonnes facultatives (`Joke`/`Tip` : `copyReviewVersion`, `copyReviewedAt`, `copyVerdict`, `originalContent`, `originalPunchline`/`originalTitle`).

## 7. Copie Replit → Neon Francfort (29/09/2026, accord explicite de Thomas)

- Schéma : généré hors ligne depuis `apps/web/prisma/schema.prisma` (`prisma migrate diff --from-empty`), 181 instructions en une transaction : 37 tables, enums, index, clés étrangères.
- Données : copie par l'API SQL HTTPS de Neon (lecture seule côté Replit), tables parentes d'abord, lots de 1 000 lignes (`json_agg` côté source → `json_populate_recordset` côté cible, colonnes source uniquement).
- **Contrôle : 35/35 tables identiques** (nombre de lignes + md5 du contenu trié par clé primaire, calculé des deux côtés). 42 860 lignes. Aucune séquence (identifiants texte). `ANALYZE` passé.
- Les 2 nouvelles tables (`DataPatch`, `NewsletterSubscriber`) sont vides : les tâches de démarrage de la branche s11 s'appliqueront au premier lancement sur Cloudflare.
- À refaire au moment de la bascule (étape D) : la même copie, sur base cible vidée, pour récupérer les données écrites entre-temps sur Replit (inscriptions, usage IA, posts).

## 8. Déploiement de test workers.dev (29/09/2026, accord explicite de Thomas)

- URL : https://marrant.thomas-issa.workers.dev (aucune route, aucun domaine ; `X-Robots-Tag: noindex, nofollow` sur *.workers.dev ; crons programmés mais `CRON_ENABLED=false`).
- Ressources créées avec `CLOUDFLARE_DM_TOKEN` : buckets R2 `marrant-next-cache` et `marrant-social-images` (Europe de l'Ouest), Hyperdrive `marrant-neon` (id `fab86e8a22204112961f483a20c261ee`, cache de requêtes désactivé) → Neon Francfort.
- Secrets de test posés (valeurs neuves générées, jamais affichées) : `NEXTAUTH_SECRET`, `CRON_SECRET`, `ADMIN_PASSWORD`, `UNSUBSCRIBE_HMAC_SECRET`, `NEXTAUTH_URL`, `CRON_ORIGIN` ; `RESEND_API_KEY` provisoire. À remplacer à la session suivante par les vraies clés (Stripe test, Resend, Google, Anthropic) que Thomas a ajoutées à l'environnement.
- Contrôles : pages principales 200 (mêmes 404 qu'en prod), `/api/health` → base `up` (Worker → Hyperdrive → Neon), API vannes/conseils/vidéos/contenu du jour servies depuis la copie. Sitemap : 43 URL contre 60 en prod (figé au build sans base, se régénère en 1 h).
- **Bug corrigé** (commit `fix(cf)`) : les chunks JS des groupes de routes `(dashboard)` et segments `[slug]` partaient en boucle 307 (normalisation d'encodage de la couche assets) → page blanche « Application error » dans Chromium. Le Worker sert désormais `/_next/static/chunks/app/*` en suivant lui-même ces redirections (`run_worker_first`). 0 erreur console vérifiée sur 6 pages.
- Build fait dans l'environnement Claude (TCP Postgres bloqué) : pages ISR figées avec données de repli jusqu'à revalidation. Pour la bascule, builder là où Neon est joignable ou accepter la revalidation.

## 9. Constat sur la prod Replit (lecture seule, 29/09/2026)

- Aucune vanne, aucun conseil ni post social générés depuis le **15/06/2026** ; dernier contenu du jour : 12/09/2026.
- Cause : les agents IA appellent un modèle retiré (`claude-sonnet-4-2025…`) → **100 % d'erreurs 404** (~3 500 appels en 7 jours, 0 $ facturé). La branche s11 utilise les modèles actuels (vérifié via `/api/health` du Worker de test) : la bascule règle le problème. Pas de redéploiement Replit (décision fondateur du 29/09).

## 10. Étape C : zone Cloudflare (29/09/2026, accord explicite de Thomas)

- Zone `deviens-marrant.fr` ajoutée (id `d650dd78a6786e01a67d50096137eb53`, offre Free, statut `pending` tant que les NS IONOS ne changent pas). Serveurs DNS attribués : **`johnny.ns.cloudflare.com`**, **`treasure.ns.cloudflare.com`**.
- L'import automatique n'a rien trouvé : les 15 enregistrements ont été créés à la main depuis le DNS public (TTL 3600, **tous en DNS only**, A @ toujours vers Replit 34.111.179.208).
- Contrôle : diff automatique zone Cloudflare ↔ DNS public = **identique (15/15)**, 0 enregistrement proxifié, DNSSEC désactivé des deux côtés.
- Reste (GO Thomas) : remplacer chez IONOS les 4 serveurs `ui-dns` par les 2 serveurs Cloudflare. Sans effet visible (le site reste sur Replit, e-mails IONOS et Resend inchangés), propagation jusqu'à 48 h : à faire **avant** la bascule pour que celle-ci (étape D) se limite à changer l'enregistrement A @ / www dans Cloudflare (minutes, réversible).
