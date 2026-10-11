# Baseline 2 et contrôle SQL des articles : requêtes à exécuter (@data-analyst, 11/10/2026)

> Aucune valeur n'est relevée par ce fichier : l'auteur n'a ni shell, ni accès à la base, à Stripe ou à Umami. Toutes les requêtes sont en **lecture seule**. La session les exécute, écrit chaque résultat dans la colonne « Valeur » (ou dans `REPLIT_ACTIONS.md` pour G3) et reporte la baseline 2 dans `docs/social/mesure.md` §6 (lignes « 11/10/2026 (dimanche) »). Aucun secret n'est écrit ici : `DATABASE_URL`, `STRIPE_SECRET_KEY`, `UMAMI_API_KEY` viennent de l'environnement de la session. Sources des points : `corrections-cycle9-plan.md` (lot Mesure), `notation-relance-cycle9-growth.md` (G2, G3, T2).

## 0. Paramètres communs

| Nom | Valeur | Vérification |
|---|---|---|
| `START_PARIS` | lun. 06/10/2026 00:00 Paris = `2026-10-05T22:00:00Z` = epoch `1791237600` | `date -u -d '2026-10-05 22:00:00' +%s` |
| `END` | instant de l'exécution (UTC), à écrire dans le tableau du §2 avec la valeur | `date -u +%s` |
| Fenêtre de test Umami (D8, `tests-c2-navigateurs-integres-11-10.md` §3) | `2026-10-11T05:50:00Z` (epoch `1791697800`) à `2026-10-11T06:10:00Z` (epoch `1791699000`) | `date -u -d '2026-10-11 05:50:00' +%s` |
| Client Stripe de test à exclure | `cus_VQ5vmmsBTa8djr` (créé 11/10 05:55:39 UTC, session Checkout ouverte non payée) | `tests-c2` §3, ligne « Stripe » |
| Achat de test à exclure | achat de Thomas du 07/10 : paiement 2,99 € à 13:15 UTC, remboursé en totalité à 13:20 UTC, abonnement `canceled`, compte FREE / CANCELED (`REPLIT_ACTIONS.md`, section « s16 (07/10/2026) : audit parcours, lots A à H », encadré « Correctif paiement + achat réel D1 ») | fenêtre epoch `1791378600` (13:10Z) à `1791379500` (13:25Z) |
| 3 comptes de Thomas | e-mails dans une variable de production, jamais dans le dépôt (`founder-preferences.md`, ligne du 07/10 : « comptes de test à exclure = les 3 comptes de Thomas ») ; nom de la variable `[À VÉRIFIER par la session]` | passer en `psql -v thomas_emails='a,b,c'` (en minuscules, séparés par des virgules) |
| Compte QA du 11/10 | `qa-c2-20261011-instagram@example.com` : créé 05:55:36 UTC, **supprimé** 05:56:37 UTC, rien à soustraire en base ; la clause `@example.com` ci-dessous est une ceinture | `tests-c2` §3 |

Fuseau : `createdAt` est stocké en UTC (type Prisma `DateTime`), d'où `AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Paris'` pour grouper par semaine de Paris (lundi à dimanche). Heure d'été jusqu'au 25/10 : Paris = UTC+2.

## 1. G3 (urgent, butoir 12/10 04:30 UTC = 06:30 Paris) : « compte gratuit » dans `BlogArticle`

**1.1 Lecture du code statique (faite le 11/10 par recherche dans `apps/web`, hors tests, `node_modules` et build)** : motifs « compte gratuit », « gratuitement », « Crée ton compte », « inscription gratuite », insensible à la casse.

| Fichier | Occurrence | Verdict |
|---|---|---|
| `apps/web/src/lib/blog-articles.ts` | **aucune** des 4 locutions ; seul « gratuit » seul, l. 1700 : « l'humour vulgaire gratuit » (sens « sans raison », FAQ) | 0 occurrence du motif |
| `apps/web/src/config/blog-cta.ts` | l. 6, commentaire de code : « Plus de compte gratuit (s15) » | non rendu, sans effet |
| `apps/web/src/components/blog/article-cta.tsx` (l. 42), `quiz/viral-quiz.tsx` (l. 108), `premium/abonnement-view.tsx` (l. 126), `auth/auth-cta.tsx` (l. 22), `lib/umami.ts`, `lib/premium-return.ts`, `lib/safe-callback.ts`, `lib/parcours-access.ts`, `lib/analytics/weekly-funnel.ts`, `middleware.ts`, `api/user/xp/route.ts`, `api/admin/stats/route.ts` | commentaires de code, tous de la forme « plus de compte gratuit (s15) » | non rendus |
| `apps/web/src/app/(auth)/register/layout.tsx` | l. 8, description de la page `/register` : « Crée ton compte pour activer … dès [prix] » | rendu, mais annonce le prix : **pas** une promesse gratuite |
| `apps/web/src/app/(dashboard)/cgu/page.tsx` | l. 55 et l. 66 : « résilier … gratuitement » et « recourir gratuitement à un médiateur » | sens juridique, hors sujet |
| `apps/web/src/lib/claude.ts` | l. 6 : « jamais vulgaire gratuitement » dans le prompt système des vannes | non rendu, hors sujet |

Le texte des articles servi en ligne vient de la base : le code ne tranche rien pour `se-presenter-avec-humour` (en base `isPublished=false`, programmé le 12/10 05:00 UTC, `REPLIT_ACTIONS.md`) ni pour les autres. **La requête 1.2 est donc obligatoire.**

**1.2 Requête A : toutes les occurrences, tous les articles (publiés ou non)**

```sql
SELECT a.slug,
       a."isPublished",
       a."publishedAt",
       m.motif,
       c.champ,
       (SELECT count(*) FROM regexp_matches(c.texte, m.re, 'gi')) AS occurrences,
       regexp_replace(
         substring(c.texte from '(?i).{0,80}' || m.re || '.{0,80}'),
         '\s+', ' ', 'g') AS extrait
FROM "BlogArticle" a
CROSS JOIN (VALUES
  ('compte gratuit',       'compte[\s  ]+gratuit'),
  ('gratuitement',         'gratuitement'),
  ('Crée ton compte',      'cr[ée]e[\s  ]+ton[\s  ]+compte'),
  ('inscription gratuite', 'inscription[\s  ]+gratuite')
) AS m(motif, re)
CROSS JOIN LATERAL (VALUES
  ('content', replace(a.content, '&nbsp;', ' ')),
  ('title',   replace(a.title,   '&nbsp;', ' '))
) AS c(champ, texte)
WHERE c.texte ~* m.re
ORDER BY a."isPublished" DESC, a."publishedAt" DESC NULLS LAST, a.slug, m.motif, c.champ;
```

Sortie attendue : 0 ligne. Une ligne = un slug à corriger (`slug`, `isPublished`, `publishedAt`, motif, champ, nombre et extrait). La locution « Crée ton compte » est tolérante à l'accent (`Crée`, `Cree`). Les espaces insécables et `&nbsp;` sont traités.

**1.3 Requête B : présence et statut des 8 slugs relayés du 12/10 au 09/11 (`strategie-relance-v5.md` §3, S1 à S5)**

Distingue « 0 occurrence » de « slug absent de la base » (un slug absent donne `en_base = false`).

```sql
WITH slugs(slug) AS (VALUES
  ('se-presenter-avec-humour'),
  ('humour-en-colocation-desamorcer-tensions'),
  ('message-anniversaire-drole-par-situation'),
  ('blagues-sur-l-ia-assistants-vocaux'),
  ('premier-message-drole-appli-de-rencontre'),
  ('humour-en-visio-reunion-en-ligne'),
  ('blagues-de-couple-drole'),
  ('chambrer-sans-blesser-entre-potes')
)
SELECT s.slug,
       (a.id IS NOT NULL) AS en_base,
       a."isPublished",
       a."publishedAt",
       length(a.content) AS longueur,
       (a.content ~* 'compte[\s  ]+gratuit'
        OR a.content ~* 'gratuitement'
        OR a.content ~* 'cr[ée]e[\s  ]+ton[\s  ]+compte'
        OR a.content ~* 'inscription[\s  ]+gratuite'
        OR a.title   ~* 'compte[\s  ]+gratuit|gratuitement|inscription[\s  ]+gratuite|cr[ée]e[\s  ]+ton[\s  ]+compte') AS motif_present
FROM slugs s
LEFT JOIN "BlogArticle" a ON a.slug = s.slug
ORDER BY s.slug;
```

**1.4 Requête C (complément, lecture) : tout « gratuit » dans le contenu publié, pour juger les cas limites**

```sql
SELECT a.slug, a."isPublished",
       regexp_replace(substring(replace(a.content, '&nbsp;', ' ') from '(?i).{0,60}gratuit.{0,60}'), '\s+', ' ', 'g') AS extrait
FROM "BlogArticle" a
WHERE a.content ~* 'gratuit'
ORDER BY a."isPublished" DESC, a.slug;
```

**1.5 Règle de lecture** : 0 occurrence par slug sur A et `motif_present = false` sur B. Sinon : correction par étalon de Thomas, diff réel mesuré (P0 s8, P0 s11), repasse à l'aveugle avant remise en ligne (règle d'or P0 s18). Requête, date-heure UTC et résultat à consigner dans `REPLIT_ACTIONS.md` (par la session). Résultat : `[à relever par la session]`.

## 2. G2 : mesures de la baseline 2 (dim. 11/10/2026)

Heure d'exécution (UTC) et valeur `END` : `[à relever par la session]`. Colonne « Valeur » : `[à relever par la session]` pour toutes les lignes.

| # | Mesure | Source | Valeur |
|---|---|---|---|
| B1 | Comptes créés par semaine, hors exclusions | base | `[à relever par la session]` |
| B2 | Comptes créés par méthode (e-mail, Google) | base | `[à relever par la session]` |
| B3 | Abonnements actifs et MRR (base) | base | `[à relever par la session]` |
| B4 | Abonnements créés depuis le 06/10 | base | `[à relever par la session]` |
| S1 | Abonnements actifs et MRR | Stripe | `[à relever par la session]` |
| S2 | Abonnements créés depuis le 06/10 | Stripe | `[à relever par la session]` |
| S3 | Clients Stripe (total, depuis le 06/10), hors `cus_VQ5vmmsBTa8djr` | Stripe | `[à relever par la session]` |
| S4 | Paiements réussis et remboursés (total, depuis le 06/10), hors achat de test du 07/10 | Stripe | `[à relever par la session]` |
| U1 | Visites par `utm_source` (`x`, `instagram`, `linkedin`) depuis le 06/10, hors événements de test du 11/10 05:50 à 06:10 UTC | Umami | `[à relever par la session]` |
| U2 | Fenêtre de test seule (à soustraire), par `utm_source` | Umami | `[à relever par la session]` |
| T2 | Abonnés X, Instagram, LinkedIn au 11/10 | captures de Thomas | `[à relever par Thomas]` |

Hors périmètre G2 : impressions Google de « deviens marrant » (Search Console, accès à confirmer, `mesure.md` §2) ; `[à relever par Thomas]` si l'accès est le sien.

### 2.1 Base Neon (psql, lecture seule : `psql "$DATABASE_URL" -v thomas_emails='…' -f requete.sql`, ou l'équivalent HTTP du script de la session)

**B1, comptes créés par semaine de Paris depuis le 28/09** (la semaine du 05/10 est la baseline ; la semaine du 28/09 sert de repère)

```sql
SELECT date_trunc('week', "createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Paris')::date AS lundi_paris,
       count(*)                                  AS comptes_bruts,
       count(*) FILTER (WHERE excl)              AS exclus,
       count(*) FILTER (WHERE NOT excl)          AS comptes_hors_exclusions
FROM (
  SELECT u.*,
         (lower(u.email) = ANY (string_to_array(:'thomas_emails', ','))
          OR lower(u.email) LIKE '%@example.com') AS excl
  FROM "User" u
  WHERE u."createdAt" >= TIMESTAMP '2026-09-27 22:00:00'
) t
GROUP BY 1 ORDER BY 1;
-- Contrôle de cohérence (sans filtre de date) : total attendu sur la base brute
SELECT count(*) AS total_comptes_bruts FROM "User";
```

Repères : 13 comptes au 05/10 (`snapshot-trafic-2026-10-05.md` §5), 14 comptes à 05:56:37 UTC le 11/10 (`tests-c2` §3). Un écart avec le total relevé est à expliquer, pas à corriger.

**B2, méthode de création** (règle Google de `mesure.md` §3 : « 0 compte créé par Google en base sur la même semaine »)

```sql
SELECT date_trunc('week', u."createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Paris')::date AS lundi_paris,
       count(*) FILTER (WHERE u."passwordHash" IS NOT NULL) AS par_email,
       count(*) FILTER (WHERE EXISTS (SELECT 1 FROM "Account" a
                                      WHERE a."userId" = u.id AND a.provider = 'google')) AS par_google
FROM "User" u
WHERE u."createdAt" >= TIMESTAMP '2026-09-27 22:00:00'
  AND NOT (lower(u.email) = ANY (string_to_array(:'thomas_emails', ',')) OR lower(u.email) LIKE '%@example.com')
GROUP BY 1 ORDER BY 1;
```

**B3, abonnements actifs et MRR en base** (jamais d'e-mail en sortie : identifiants seulement)

```sql
SELECT s.status,
       s."billingInterval",
       s."priceAmountCents",
       s."cancelAtPeriodEnd",
       count(*) AS abonnements,
       round(sum(CASE WHEN s."billingInterval" = 'year' THEN s."priceAmountCents" / 12.0
                      ELSE s."priceAmountCents" END) / 100.0, 2) AS mrr_eur
FROM "Subscription" s
JOIN "User" u ON u.id = s."userId"
WHERE NOT (lower(u.email) = ANY (string_to_array(:'thomas_emails', ',')) OR lower(u.email) LIKE '%@example.com')
GROUP BY 1, 2, 3, 4 ORDER BY 1, 2, 3;
```

MRR de la base = somme de `mrr_eur` des lignes `status = 'ACTIVE'` seulement. `priceAmountCents` NULL (abonnement antérieur non resynchronisé, `schema.prisma`) : lister à part et lire le prix côté Stripe (S1). Repère du 05/10 : 2 actifs à 0,99 €/mois, MRR 1,98 € (`snapshot-trafic-2026-10-05.md` §5).

**B4, abonnements créés depuis le 06/10** (la ligne `Subscription` est créée par le webhook Stripe : à confirmer en lisant S2)

```sql
SELECT date_trunc('week', s."createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Paris')::date AS lundi_paris,
       s.status, s."billingInterval", s."priceAmountCents",
       s."createdAt" AS cree_le_utc, s."userId"
FROM "Subscription" s
JOIN "User" u ON u.id = s."userId"
WHERE s."createdAt" >= TIMESTAMP '2026-10-05 22:00:00'
  AND NOT (lower(u.email) = ANY (string_to_array(:'thomas_emails', ',')) OR lower(u.email) LIKE '%@example.com')
ORDER BY s."createdAt";
-- Ligne à part, exclue ci-dessus : l'abonnement du test D1 du 07/10 (créé vers 13:15 UTC, annulé 13:20), si son compte n'est pas dans les 3 comptes de Thomas
SELECT s.id, s.status, s."createdAt" FROM "Subscription" s
WHERE s."createdAt" BETWEEN TIMESTAMP '2026-10-07 13:10:00' AND TIMESTAMP '2026-10-07 13:25:00';
```

### 2.2 Stripe (mode live, lecture seule, `STRIPE_SECRET_KEY` de l'environnement ; contrôler `has_more` à chaque appel, `limit=100`)

```bash
START=$(date -u -d '2026-10-05 22:00:00' +%s)   # 1791237600
# S1 : abonnements actifs + MRR (mensualisé), hors clients de Thomas
curl -sS -G https://api.stripe.com/v1/subscriptions -u "$STRIPE_SECRET_KEY:" \
  -d status=active -d limit=100 -d 'expand[]=data.customer' \
| jq --argjson excl "$THOMAS_EMAILS_JSON" '{has_more, n: ([.data[] | select((.customer.email|ascii_downcase) as $e | $excl|index($e)|not)]|length),
    mrr_eur: ([.data[] | select((.customer.email|ascii_downcase) as $e | $excl|index($e)|not) | .items.data[] |
      (.price.unit_amount * (.quantity // 1)) / (if .price.recurring.interval=="year" then 12 else 1 end)] | add // 0) / 100}'
# S2 : abonnements créés depuis le 06/10, tous statuts (active, canceled, incomplete, incomplete_expired)
curl -sS -G https://api.stripe.com/v1/subscriptions -u "$STRIPE_SECRET_KEY:" \
  -d status=all -d "created[gte]=$START" -d limit=100 \
| jq '{has_more, lignes: [.data[] | {id, status, created, customer, cancel_at_period_end, prix: .items.data[0].price.unit_amount, intervalle: .items.data[0].price.recurring.interval}]}'
# S3 : clients (total, puis depuis le 06/10), à écrire hors cus_VQ5vmmsBTa8djr
curl -sS -G https://api.stripe.com/v1/customers -u "$STRIPE_SECRET_KEY:" -d limit=100 | jq '{has_more, n: (.data|length), ids: [.data[].id]}'
curl -sS -G https://api.stripe.com/v1/customers -u "$STRIPE_SECRET_KEY:" -d "created[gte]=$START" -d limit=100 | jq '{has_more, ids: [.data[] | {id, created}]}'
# S4 : paiements (total, puis depuis le 06/10) ; l'achat de test du 07/10 se repère à amount=299, refunded=true, created entre 1791378600 et 1791379500
curl -sS -G https://api.stripe.com/v1/charges -u "$STRIPE_SECRET_KEY:" -d limit=100 \
| jq '{has_more, lignes: [.data[] | {id, created, amount, paid, refunded, amount_refunded, status}]}'
```

`THOMAS_EMAILS_JSON` : tableau JSON des 3 e-mails en minuscules, construit par la session depuis la variable de production, jamais écrit dans un fichier du dépôt. Repères du 05/10 : 2 abonnements actifs, 1 `incomplete_expired`, 6 clients, 9 paiements réussis pour 8,91 €, 0 remboursement, MRR 1,98 € (`snapshot-trafic-2026-10-05.md` §5). Depuis : l'achat du 07/10 (2,99 €, remboursé) est le premier paiement possible après la panne du 30/09 au 07/10 ~15:15 ; le consigner sur une ligne « exclu » avec l'identifiant du paiement trouvé, jamais présumé. Les coupons et remises ne sont pas déduits du MRR `[HYPOTHÈSE : aucun coupon actif, à confirmer sur S1]`.

### 2.3 Umami Cloud (`https://api.umami.is/v1`, en-tête `x-umami-api-key`)

Identifiant du site : `UMAMI_WEBSITE_ID` est absent des secrets de session et le compte porte 8 sites (`snapshot-trafic-2026-10-05.md` §1) : lister les sites puis retenir celui dont le domaine est `deviens-marrant.fr`.

```bash
curl -sS -H "x-umami-api-key: $UMAMI_API_KEY" "https://api.umami.is/v1/websites?pageSize=50" | jq '.data[] | {id, name, domain}'
WID=<id du site deviens-marrant.fr>
START_MS=1791237600000          # 06/10 00:00 Paris
END_MS=$(( $(date -u +%s) * 1000 ))
# U1 : visites (sessions) par utm_source, plage complète
for S in x instagram linkedin; do
  echo "== $S (plage complète)"
  curl -sS -H "x-umami-api-key: $UMAMI_API_KEY" \
   "https://api.umami.is/v1/websites/$WID/stats?startAt=$START_MS&endAt=$END_MS&utmSource=$S" | jq '{visits, visitors, pageviews}'
done
# U2 : fenêtre de test seule (à soustraire de U1)
for S in x instagram linkedin; do
  echo "== $S (fenêtre de test 05:50 à 06:10 UTC)"
  curl -sS -H "x-umami-api-key: $UMAMI_API_KEY" \
   "https://api.umami.is/v1/websites/$WID/stats?startAt=1791697800000&endAt=1791699000000&utmSource=$S" | jq '{visits, visitors, pageviews}'
done
```

Valeur retenue pour U1 = plage complète moins fenêtre de test, par source. **Garde-fou** : le nom du filtre `utmSource` est celui de la documentation Umami (filtres UTM depuis la v2.6, [docs.umami.is/docs/api/website-stats](https://docs.umami.is/docs/api/website-stats)) et n'a pas été éprouvé sur ce compte. Si un filtre est ignoré, le résultat est égal au total du site (donc identique pour les 3 sources) : ce cas est à signaler, pas à reporter. Repli : `metrics?type=query&startAt=$START_MS&endAt=$END_MS&limit=500` (méthode du 05/10, `snapshot-trafic` §4), lire les lignes `utm_source=x|instagram|linkedin`, en notant que ce repli peut compter des pages vues et non des sessions `[À VÉRIFIER par la session]`. Contrôle de la soustraction : la fenêtre de test contient 17 envois, dont 11 pages vues (`tests-c2` §3) ; la somme U2 des 3 sources doit être cohérente avec les pages vues portant un `utm_source` (3 visites `/quiz-humour?utm_source=instagram…`, bloc `/liens*` posant eux-mêmes les UTM).

### 2.4 Exclusions à écrire en toutes lettres dans `mesure.md` avec les valeurs

1. Les 3 comptes de Thomas (base et Stripe), sans écrire leurs e-mails.
2. L'achat de test du 07/10 (2,99 €, 13:15 UTC, remboursé 13:20 UTC) : identifiant du paiement relevé par S4.
3. Le client Stripe de test `cus_VQ5vmmsBTa8djr` et sa session Checkout ouverte (expire sous 24 h) : à soustraire du nombre de clients, ou à supprimer par Thomas.
4. Les événements Umami de test du 11/10, 05:50 à 06:10 UTC (U2).
5. Le compte QA `qa-c2-20261011-instagram@example.com` : supprimé à 05:56:37 UTC, rien à soustraire (14 comptes avant, 15, puis 14).

## 3. Résultats relevés par la session (11/10/2026, 06:11 à 06:14 UTC, lecture seule)

**G3** : requête A = **0 ligne** (aucune des 4 locutions dans aucun article, titre ou contenu). Requête B : les 8 slugs sont en base, `motif_present = false` partout ; tous `isPublished = false` avec `publishedAt` programmé à 05:00 UTC (12/10, 19/10, 22/10, 26/10, 29/10, 02/11, 05/11, 09/11), chacun avant son premier relais. Requête C : 2 « gratuit » hors sujet, ressorts de blague (`blague-drole-7-criteres-pepite`, publié : « le mot 'gratuit' était notre marque préférée » ; `je-ne-sais-jamais-quoi-repondre`, non publié : « attaques gratuites »). **Rien à corriger.**

**Exclusions appliquées** : comptes `@example.com` (test C2 du 11/10, supprimé) et compte de Thomas repérable par l'e-mail (1) ; **compte du test D1 du 07/10** (`cmuy4dogd0000xf1k0yckxvqv`, créé 13:04 UTC, porteur de l'abonnement de test `cmuy4t3hl0003y61lj488nadx`, annulé) ; client Stripe `cus_VQ5vmmsBTa8djr` (test C2) et `cus_VOi7vEcunhm7p5` (test D1) ; paiement `ch_3UNuhdRqTNSm2ji51FPyG1Wx` (2,99 €, test D1, remboursé) ; fenêtre Umami 05:50 à 06:10 UTC du 11/10. La liste complète des 3 e-mails de Thomas n'est pas dans l'environnement de session : les autres comptes de Thomas ne sont pas repérables `[À VÉRIFIER]` (sans effet sur la semaine 0 : aucun compte créé hors tests).

| # | Mesure | Valeur au 11/10 |
|---|---|---|
| B1 | Comptes créés, semaine du 28/09 / semaine du 05/10 | 1 / 1 bruts ; **semaine du 05/10 = 0 hors tests** (le seul compte est celui du test D1) ; total base 14 |
| B2 | Méthode (semaine du 05/10, hors tests) | e-mail 0, Google 0 |
| B3 | Abonnements en base (hors compte de Thomas repérable) | 1 ACTIVE à 0,99 €/mois ; 1 CANCELED (test D1) |
| B4 | Abonnements créés depuis le 06/10 | 1, le test D1 (exclu) ; **0 hors tests** |
| S1 | Stripe, abonnements actifs | 2 à 0,99 €/mois (créés le 18/03 et le 14/08), MRR **1,98 €** brut (identique au 05/10 ; part de Thomas `[À VÉRIFIER]`) |
| S2 | Stripe, abonnements créés depuis le 06/10 | 1 (test D1, annulé) ; **0 hors tests** |
| S3 | Stripe, clients | 8 au total, dont 2 tests (C2, D1) : **6 hors tests** (identique au 05/10) |
| S4 | Stripe, paiements réussis | 10 pour 11,90 €, dont le test D1 remboursé : **9 pour 8,91 € hors test**, 0 depuis le 06/10 hors test (identique au 05/10) |
| U1 | Umami, visites par `utm_source` depuis le 06/10, moins la fenêtre de test | **X 1** (2 moins 1), **Instagram 0** (1 moins 1), **LinkedIn 0** (1 moins 1) ; site entier : 213 visites, 190 visiteurs |
| U2 | Umami, fenêtre de test | X 1, Instagram 1, LinkedIn 1 (les 3 visites `bio-quiz` du test C2) |
| T2 | Abonnés X, Instagram, LinkedIn | `[à relever par Thomas]` |

Contrôle du filtre `utmSource` : résultats différents par source et inférieurs au total du site, donc le filtre est pris en compte. Recoupement `metrics?type=query` : 3 lignes `bio-quiz` (test) et 1 ligne `utm_source=x&…&utm_campaign=2026-10` (la visite X réelle).
