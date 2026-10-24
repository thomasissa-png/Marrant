# Contrôle SEO technique de la branche `claude/marrant-s21-integration` (commit f13b8e8)

Auteur : @seo, 18/10/2026. Méthode : `git diff origin/main..HEAD` (267 fichiers dans `apps/web/src`, 1158 au total), lecture du code, et curl GET sur l'aperçu `https://fba36551-marrant.thomas-issa.workers.dev` (= la branche, confirmé : `llms.txt` y porte les nouveaux textes) comparé à la production `https://deviens-marrant.fr`. Lecture seule, aucune écriture en base, aucun code modifié. Pièces brutes (HTML, JSON-LD, statuts des 217 liens) : dossier temporaire de session, non versionné.

Limites déclarées : l'en-tête `X-Robots-Tag: noindex` vu sur l'aperçu vient de l'hôte `*.workers.dev` (`cloudflare/worker.ts:124-127`), pas de la page ; l'indexabilité en production repose donc sur les balises meta, vérifiées ci-dessous. Rich Results Test et Inspection d'URL Search Console non exécutables ici : les JSON-LD ont été parsés et comparés au texte visible, pas validés par l'outil Google. Aucune donnée de volume ou de difficulté consultée (hors périmètre : contrôle technique de non-régression).

## Verdict global

**Pas de blocant SEO pour la mise en ligne.** Rien de ce qui est indexé aujourd'hui ne casse : sitemap et robots.txt identiques à la production octet pour octet, 217 liens internes de l'aperçu en 200 (un seul 307 attendu, `/profil` vers `/login`), canonicals corrects, JSON-LD FAQ conformes au texte visible, mois futur étanche. Mais la réponse à Thomas n'est pas « tout est à jour » : le sitemap et la balise `bingbot` n'ont pas été mis à jour pour la branche, et `/lettre` n'est **pas** dans le sitemap (voir point 1, c'est voulu par la spec @ux). 4 corrections recommandées avec cette mise en ligne (P2), 4 points de suivi (P3).

| # | Point | Verdict |
|---|---|---|
| 1 | Sitemap | OK, avec 1 À CORRIGER (lastmod périmés, P2) et 1 écart à la consigne (`/lettre` absente, par design) |
| 2 | robots.txt | OK |
| 3 | Métadonnées | OK sur title/description/prix/canonical ; À CORRIGER non régressif (Open Graph, P3) |
| 4 | Données structurées | OK |
| 5 | Maillage interne | OK, avec 1 À CORRIGER (balise `bingbot` sur pages noindex, P2) |
| 6 | IndexNow | OK (aucune notification nécessaire pour la lettre ni le carnet) ; dépend de la correction des lastmod |
| 7 | Rendu | OK |

## 1. Sitemap

Preuve : `curl /sitemap.xml` production et aperçu : 422 URL, `diff` vide. `apps/web/src/app/sitemap.ts` n'est pas dans le diff de la branche.

- **`/lettre` absente : écart avec la consigne, conforme à la spec. Verdict OK (décision à confirmer par Thomas).** `docs/ux/lettre-inscription-s21.md:55` : « `robots: noindex`, hors sitemap (94 pages indexées sur 414 : ne pas ajouter une page mince au crawl) ». Code : `lettre/page.tsx:27` (`robots: { index: false, follow: false }`), commentaire `lettre/page.tsx:18`. Curl : `/lettre` aperçu = 200, meta `robots: noindex, nofollow`. Avis @seo : garder ainsi (page-formulaire sans intention de recherche propre, rendue en `force-dynamic` avec variantes `?statut=`). Ouvrir `/lettre` à l'index demanderait un canonical sans paramètre et une page de fond ; non recommandé pour cette version.
- **`/lettre/confirmer` et `/lettre/desinscrire` : absentes du sitemap et en noindex. OK.** `confirmer/page.tsx:19`, `desinscrire/page.tsx:17`. Curl : meta `noindex, nofollow` et `referrer: same-origin` ; sans jeton, 307 vers `/lettre?statut=invalide` (noindex aussi). Elles ne sont jamais liées dans le HTML public (seulement dans les e-mails).
- **`/carnet` et `/carnet/[mois]` : absents du sitemap par design, en noindex. OK.** `carnet/page.tsx:1-5,18` et `carnet/[mois]/page.tsx:1-3,23`. Il n'y a donc rien à « faire apparaître » en sitemap le 01/11 et rien à notifier.
- **Mois futur étanche. OK.** `lib/carnet.ts:147-168` : `listPublishedCarnets` filtre `mois <= currentParisMonth(now)` (fuseau Europe/Paris), `getCarnetByMonth` passe par ce filtre. Preuves : aujourd'hui (18/10) `/carnet/2026-11` = 404 + `noindex`, `/carnet` affiche « Carnet d'octobre » ; grep de `gratin`, `2026-11-10`, `Carnet de novembre` dans le HTML de 42 pages de l'aperçu et dans les 25 chunks JS de `/carnet`, `/abonnement`, d'un article et de l'accueil : aucune fuite. Bascule vérifiée par `Intl` : 2026-10-31T22:59:59Z = 2026-10, 23:00:00Z = 2026-11 (01/11 00:00 Paris, heure d'hiver) ; couverte par `carnet-novembre-2026.test.tsx:88-130`. `2026-11.json` : 30 fiches, 1 fiche `offerte` (`2026-11-10`), `accroche` de 84 caractères (limite 110), donc l'encart des articles et l'extrait `/abonnement` basculent aussi.
- **Articles programmés exclus. OK.** `sitemap.ts:109` utilise `visibleBlogArticleWhere()` (`isPublished` ET `publishedAt <= now`, `lib/blog-visibility.ts:13-18`). Articles statiques : date max 2026-05-05, aucun futur. Le sitemap live compte 36 URL `/blog/`. La base n'a pas été interrogée (lecture du code seulement).
- **lastModified : stable, mais périmé pour les pages modifiées par la branche. À CORRIGER (P2, non bloquant).** Les constantes de `sitemap.ts` n'ont pas bougé alors que le texte a changé :
  - `/abonnement`, `/glossaire`, `/a-propos`, `/quiz-humour` : sitemap `2026-09-29` (`STRUCTURAL_PAGES_LASTMOD`, `sitemap.ts:14`), dernier commit de contenu 2026-10-18.
  - `/cgu` : sitemap `2026-05-06` (`LEGAL_PAGES_LASTMOD`, `sitemap.ts:16`), partagée avec `/mentions-legales` et `/retractation` (non modifiées) ; la page affiche « Dernière mise à jour : 17 octobre 2026 » (`cgu/page.tsx`).
  - `/confidentialite` : sitemap `2026-10-07` (`sitemap.ts:18`) ; la page affiche « 17 octobre 2026 » (nouvelle section 8 « La lettre »).
  - `/parcours` et `/parcours/<slug>` : `PARCOURS_PAGES_LASTMOD = "2026-10-07"` (`lib/sitemap-parcours.ts:12`), alors que `parcours-detail`, `parcours-step-card` et `config/textes/parcours.ts` ont changé le 18/10.
  - Changement à faire pour @fullstack : `STRUCTURAL_PAGES_LASTMOD = "2026-10-18"` ; `PARCOURS_PAGES_LASTMOD = "2026-10-18"` ; `CONFIDENTIALITE_LASTMOD = "2026-10-17"` ; ajouter `CGU_LASTMOD = "2026-10-17"` et l'utiliser pour la seule ligne `/cgu` (`sitemap.ts:71`). Adapter `__tests__/lib/sitemap-lastmod-s20.test.ts:42,105` qui fige `2026-09-29` comme repli de `/vannes`. Raison : Bing exige un lastmod réel et stable, et le cron `weekly-seo` ne notifie IndexNow que les URL dont le lastmod a moins de 8 jours (voir point 6) : sans bump, les pages modifiées ne sont jamais soumises. Ne pas utiliser une date future : `capLastModToToday` la ramènerait à « aujourd'hui » chaque jour (instable).
  - Les 4-5 articles statiques dont une phrase de prix a changé ne sont pas à bumper (changement de formulation sans effet sur le sujet).

## 2. robots.txt

Preuve : `diff` production/aperçu vide (`robots.ts` hors diff). Disallow inchangés : `/api/`, `/admin/`, `/login`, `/forgot-password`, `/reset-password`, `/onboarding`, `/profil`, `/favoris`, `/register`, `/abonnement?`, répétés pour bingbot, msnbot et chaque bot IA ; bots de recherche IA (OAI-SearchBot, Claude-SearchBot, PerplexityBot…) autorisés. **OK, rien à ajouter.** `/lettre`, `/lettre/*` et `/carnet*` doivent rester **crawlables** : bloquer une page noindex dans robots.txt empêcherait de lire sa balise noindex. Les nouveaux liens `/abonnement?src=…&returnTo=…` et `/register?callbackUrl=…&src=…` tombent dans les Disallow existants : pas de doublons crawlés. Un lien nu `/abonnement` reste présent sur chaque page testée (pied de page), donc la page garde ses liens internes crawlables.

## 3. Métadonnées (aperçu vs production)

| Page | Title / description | Canonical | Verdict |
|---|---|---|---|
| `/` | identiques à la production | `https://deviens-marrant.fr` | OK |
| `/abonnement` | title « Abonnement Premium : 2,99 €/mois », description « …2,99 €/mois ou 24,99 €/an, résiliable en ligne » (production : « sans engagement ») | `/abonnement` | OK : prix justes, formulation alignée avec la page (« Résiliable depuis ton profil ») et avec la CGU (annuel reconduit) |
| `/register` | description « …pour 2,99 €/mois » ; `noindex, nofollow` ; hors sitemap | aucun (voulu) | OK |
| `/carnet`, `/carnet/2026-10` | titre/description inchangés ; `noindex, nofollow` | aucun (voulu) | OK |
| `/glossaire`, `/a-propos` | title/description identiques ; le texte a perdu « 1 500+ membres » (retiré aussi des JSON-LD et llms : 0 occurrence restante dans les 42 pages) | self | OK |
| `/parcours` | identiques | self | OK |
| `/lettre` | « La lettre : une vanne décryptée, chaque mois » ; `noindex, nofollow` | aucun (voulu) | OK |
| `layout.tsx` racine | +2 lignes (`CheckoutRetourTracker`, composant client), metadata inchangée | n/a | OK |

Preuves : curl + extraction des balises sur 42 pages ; `abonnement/layout.tsx:26-38`. Prix : « 2,99 » 5 fois et « 24,99 » 2 fois dans le texte visible de `/abonnement`.

**À CORRIGER, non régressif (P3)** :
- Open Graph hérité de l'accueil : `og:url = https://deviens-marrant.fr` et `og:title` générique sur `/abonnement`, `/glossaire`, `/a-propos`, `/vannes`, `/conseils`, `/videos`, `/blog`, `/mentions-legales`, `/cgu`, `/confidentialite`, `/retractation` (identique en production). Les pages de la branche en sont sans nouveauté, mais Facebook/LinkedIn rattachent le partage à la page d'accueil. Changement : dans chaque `metadata`, ajouter `openGraph: websiteOpenGraph({ title, description, url })` et `twitter: websiteTwitter({ title, description })` (helpers `lib/seo-meta.ts:119-139`, déjà utilisés par `/parcours`).
- Canonical absent sur `/cgu`, `/confidentialite`, `/mentions-legales`, `/retractation` (production identique, déjà relevé P1-5 dans `docs/seo/audit-post-bascule-s14.md:42`, jamais appliqué). `cgu` et `confidentialite` sont touchées par la branche : ajouter `alternates: { canonical: "https://deviens-marrant.fr/<page>" }` aux quatre.
- Observation de contenu, sans action imposée : le H1 de `/abonnement` est maintenant « Ta réplique en soirée, pas dans le bus du retour » (sans « abonnement » ni « Premium »), et les compteurs « 140+ vannes, 120+ conseils, 80+ vidéos » de la meta description n'apparaissent plus dans le texte visible. Pour Bing (mot-clé exact dans title + H1 + 1er paragraphe), c'est un peu plus faible ; le mot « Premium » est dans le bloc juste dessous. À arbitrer par Thomas, pas un défaut technique.

## 4. Données structurées

Parse des JSON-LD de l'aperçu et comparaison mot pour mot avec le texte visible (normalisation des espaces insécables) :

- **Accueil** : FAQPage = **4 questions** (apprendre, timide, prix, YouTube), 4/4 réponses présentes à l'identique dans le HTML visible ; les 4 anciennes (temps, répartie, méchant, sens de l'humour) ont disparu du schéma ET de la page (0 occurrence). Source unique `FAQ_VENTE` (`lib/faqs.ts:56-70`, `page.tsx` du dashboard). OK.
- **`/abonnement`** : FAQPage = 4 questions identiques, 4/4 réponses visibles, réponse prix variante annuelle (« chaque mois ou chaque année ») cohérente avec le texte affiché. `Product` : 2 offres, `2.99` EUR `P1M` et `24.99` EUR `P1Y`, `InStock`, identique à la production hors FAQ. OK.
- **`/parcours`** : FAQPage 8 questions, 8/8 visibles (utilise `faqs` complet, voulu : « Les 4 autres restent dans `faqs` (/parcours, SEO) »). `/a-propos` : 3/3. Fiches vanne/conseil/vidéo et glossaire : JSON-LD identiques à la production (diff vide). Fil d'Ariane `/blog` et articles : « Articles » dans le JSON-LD ET dans le fil visible, cohérent.
- **À suivre (P3, avant le 31/12)** : `priceValidUntil: "2026-12-31"` sur les deux offres (identique en production) expire dans 74 jours ; à repousser avant fin d'année pour éviter l'avertissement Rich Results.

## 5. Maillage interne

- **Liens cassés : aucun.** 217 destinations internes uniques extraites des pages de l'aperçu (accueil, listes, fiches, article, carnet, lettre, légales) (menu avec l'onglet « La lettre », pied de page, boutons, `?src=`, `?returnTo=`, `/register?callbackUrl=`, `/login?callbackUrl=`) : 216 en 200, 1 en 307 (`/profil` vers `/login`, attendu et déjà Disallow). Le lien de pied de page `/confidentialite#lettre` fonctionne : l'ancre `id="lettre"` existe dans le HTML de `/confidentialite`. `/lettre` est liée depuis l'accueil, le menu et le pied de page (page noindex : le lien est utile à l'utilisateur, sans effet de classement).
- **`?src=` sans doublon indexable. OK.** Canonical sans paramètre sur `/abonnement?src=header`, `/parcours/repartie?src=accueil`, `/?src=accueil`, `/blog/<slug>?src=x` ; `/carnet?src=…` et `/lettre?emplacement=` sont noindex. Les liens `/parcours/<slug>?src=<origine>#etape-1` sont crawlables (10 variantes sur l'aperçu, 13 en production) : doublons « page alternative avec canonical » dans Search Console, sans conséquence, pas de nouveauté de nature.
- **Murs `/vannes`, `/conseils`, `/videos` : Google voit toujours les pages 2+. OK.** Le HTML serveur de l'aperçu est identique en structure à la production : liens `?page=2..13` (vannes), `..12` (conseils), `..8` (vidéos) présents ; la page 2 sert 12/10/12 fiches différentes de la page 1 (0 en commun) ; canonical auto-référent `…?page=2` (`listCanonical`). Le masquage (`vannes-list.tsx:398`, `conseils-list.tsx:382`, `videos-grid.tsx:363`) ne se déclenche qu'après un `fetch('/api/…')` réussi qui renvoie `limited: true`; or `/api/` est Disallow dans robots.txt, donc le moteur de rendu de Google ne peut pas l'appeler, tombe dans `fallBackToServer()` et garde la pagination. Conclusion issue du code, **à confirmer par Inspection d'URL (HTML rendu) sur `/vannes?page=2` après la mise en ligne**. Réserve : un robot qui ignore le Disallow des sous-ressources (aperçus de réseaux sociaux, bots IA de consultation) verrait la liste limitée, sans conséquence sur l'index. Hors branche et inchangé : les pages 2+ partagent le title et la description de la page 1.
- **Ancre des fiches** : sur les cartes de `/vannes`, « Page dédiée → » est remplacé par une flèche (icône SVG, `aria-label="Voir la fiche de cette vanne"`, `vannes-list.tsx` diff). Le lien `href` reste dans le HTML et les fiches sont dans le sitemap : pas de risque de découverte, mais ce lien perd son texte d'ancre visible. Observation P3, pas de correction demandée.
- **À CORRIGER (P2, non bloquant) : `bingbot: index, follow` contradictoire sur les pages noindex.** `layout.tsx:121` pose `other.bingbot = "index, follow, …"` pour tout le site. Sur `/lettre`, `/lettre/confirmer`, `/lettre/desinscrire`, `/carnet`, `/carnet/[mois]` (et `/register`, production identique), la page émet `robots: noindex, nofollow` ET `bingbot: index, follow`. Comment Bing arbitre cette contradiction n'est pas documenté dans ce que j'ai pu consulter (source non trouvée) : le risque est que Bing indexe ces pages, dont `/carnet` qui est du contenu payant filtré côté serveur. Le correctif existe déjà pour les 404 : `NOT_FOUND_ROBOTS` (`lib/seo-meta.ts:150-153`, `other: { bingbot: "" }`). Changement pour @fullstack : ajouter `other: { bingbot: "" }` aux `metadata` des cinq pages (au minimum `lettre/page.tsx:24-29`, `lettre/confirmer/page.tsx:17-21`, `lettre/desinscrire/page.tsx:15-19`, `carnet/page.tsx:14-20`, `carnet/[mois]/page.tsx:21-25`), idéalement via un helper `NOINDEX_ROBOTS` partagé qui sert aussi `register/layout.tsx:9`. Vérification après correctif : `curl -s <page> | grep -c bingbot` doit donner 0 et il ne doit rester qu'une balise `robots`.

## 6. IndexNow et notifications

- Mécanisme : le cron hebdomadaire `weekly-seo` appelle `notifyRecentSitemapUrls` (`lib/indexnow-sitemap.ts:26-50`), qui soumet les URL de `sitemap()` dont le lastmod a moins de 8 jours ; `daily-content` soumet une liste fixe de pages produit ; le cron article soumet `/blog/<slug>`. Clé IndexNow servie à l'identique sur l'aperçu et la production (`/indexnow-key.txt` et `/35cc97ed….txt`).
- **`/lettre` et carnet de novembre : aucune notification nécessaire, et elles n'auront pas lieu** (hors sitemap, noindex). Rien à ajouter ; soumettre une URL noindex n'aurait aucun intérêt.
- **Pages indexables modifiées** : l'accueil (lastmod quotidien) sera soumis automatiquement ; `/abonnement`, `/glossaire`, `/a-propos`, `/parcours`, `/confidentialite`, `/cgu` ne le seront que si leur lastmod est bumpé (point 1). Après la mise en ligne et le bump, rien à lancer à la main : le cron du lundi suivant les prend.

## 7. Rendu (HTML serveur)

- `/lettre` : 200, 50 Ko, H1 « Une vanne décryptée, chaque mois », formulaire, mention éditeur et lien Confidentialité présents dans le HTML brut (SSR `force-dynamic`, `lettre/page.tsx:20`). `Cache-Control: private, no-store`.
- `/carnet` : 200, H1 « Carnet d'octobre » et fiche offerte en entier dans le HTML brut ; le reste du carnet n'est servi qu'en titre et contexte (filtre côté serveur, `carnetViewForPlan`).
- Article `/blog/comment-avoir-de-la-repartie` : 200, 114 Ko, contenu, Person, FAQPage et fil d'Ariane dans le HTML brut, canonical auto-référent. Fiches vanne/conseil/vidéo : JSON-LD identiques à la production.
- Réserve sur les articles : `revalidate = 3600` (`blog/[slug]/page.tsx:10`). L'encart carnet des articles passera à novembre au plus tard 1 h après le 01/11 00:00 Paris (premier passage après expiration du cache). Acceptable ; `/carnet` et `/abonnement` sont, eux, `force-dynamic` et basculent à la seconde.

## llms.txt / llms-full.txt (coordination @geo)

Mis à jour par la branche via `lib/llms-content.ts` et `llms-parcours.ts` : tarifs « 2,99 €/mois, résiliable en ligne », « situation offerte du carnet mensuel », formulation « avec Premium, toutes les étapes sont ouvertes d'un coup », zéro « sans engagement » restant (production : 6). Écart cosmétique P3 : `llms-full.txt` titre la section « Articles » alors que `llms.txt` garde « [Blog] » (ligne « Sections principales »). Choix @geo : ne pas ajouter la lettre aux fichiers LLM (formulaire noindex, aucune valeur de citation).

## Liste des corrections pour @fullstack

| Prio | Correction | Fichier | Bloquant |
|---|---|---|---|
| P2 | Bump des lastmod (valeurs ci-dessus) + `CGU_LASTMOD` + test `sitemap-lastmod-s20` | `sitemap.ts:14,16,18,71`, `lib/sitemap-parcours.ts:12` | Non |
| P2 | `other: { bingbot: "" }` sur 5 pages noindex (+ `/register`) | voir point 5 | Non |
| P3 | `websiteOpenGraph` / `websiteTwitter` sur abonnement, glossaire, a-propos, listes, légales | pages concernées | Non |
| P3 | Canonical sur 4 pages légales | `cgu`, `confidentialite`, `mentions-legales`, `retractation` | Non |
| P3 | `priceValidUntil` à repousser avant le 31/12/2026 | JSON-LD `Product` de `/abonnement` | Non |
| P3 | Libellé « Articles » ou « Blog » aligné entre `llms.txt` et `llms-full.txt` | `lib/llms-content.ts` | Non |

À vérifier après la mise en ligne (pas faisable avant) : Inspection d'URL du HTML rendu de `/vannes?page=2`, `site:deviens-marrant.fr/lettre` et `/carnet` dans Bing, et sitemap soumis à nouveau dans Search Console et Bing Webmaster Tools.
