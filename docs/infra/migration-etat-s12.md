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

1. **Neon** : relancer/terminer l'Import Data Assistant vers la branche `main`, base `neondb`, du projet pointé par `NEON_DATABASE_URL` (ou me donner l'URL de la branche où l'import a atterri). Claude recomptera les lignes par table.
2. **Token Cloudflare** : éditer `CLOUDFLARE_DM_TOKEN` (ou en créer un nouveau) avec, sur le compte : Workers Scripts **Edit**, Workers Routes **Edit** (inclut le sous-domaine workers.dev), Hyperdrive **Edit**, Workers R2 Storage **Edit**, Account Settings **Read** ; et pour l'étape C : Zone **Edit** + DNS **Edit** (toutes les zones du compte, ou deviens-marrant.fr une fois ajoutée).
3. ~~Offre Workers payante~~ : active (confirmé par Thomas le 29/09).
4. ~~Capture DNS~~ : reçue (2e capture), conforme.
5. **Autorisation étape C** : l'ajout de la zone sur Cloudflare a été bloqué par le garde-fou de la session Claude (changement DNS). Soit Thomas ajoute la zone lui-même (tableau de bord Cloudflare, « Add a site », offre Free, import automatique), soit il autorise explicitement cette action dans la session.

## 5. Étape C, déroulé préparé (sans effet visible)

1. Ajouter la zone deviens-marrant.fr sur Cloudflare (import auto).
2. Comparer l'import avec le tableau §3 : tous les enregistrements du §3 (hors NS) doivent être présents, en **DNS only (nuage gris)** pour A @ et CNAME www (le site reste sur Replit), MX/TXT/DKIM Resend et IONOS identiques. Ajouter à la main tout enregistrement manquant (Resend et `replit-verify` sont souvent oubliés).
3. DNSSEC : rien à faire (désactivé).
4. **Changement des serveurs DNS chez IONOS vers ceux de Cloudflare : uniquement sur GO explicite de Thomas.** Le site continue de pointer vers Replit.
