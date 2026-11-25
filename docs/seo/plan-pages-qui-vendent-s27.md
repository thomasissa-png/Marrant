# Plan s27 : faire monter en page 1 les pages qui vendent

Date : 25/11/2026. Sources : Search Console `sc-domain:deviens-marrant.fr` (28 jours au 22/11, lecture seule), Umami (diagnostic s27), code du dépôt, HTML public de `/blog/meilleures-blagues-droles-2026` (lu le 25/11). Aucune donnée inventée : un volume de recherche n'est pas disponible dans Search Console (impressions seulement), les cibles de position sont des objectifs, pas des prévisions.

## 0. Constat

- 468 clics / 17 546 impressions / position moyenne 9,4. Les impressions ont doublé, pas les clics.
- Une page porte le site : `meilleures-blagues-droles-2026` (250 clics, position 5,0). **Correction du 25/11 : elle est statique dans `blog-articles.ts` (l. 1381) et n'existe pas en base** ; ses liens se modifient dans le code et demandent un déploiement (voir `docs/seo/liens-internes-s27.md`).
- Son HTML public renvoie 3 liens vers `/blog/comment-devenir-drole`, 3 vers `/parcours`, 1 vers `phrases-droles-conversations`, 1 vers chacun des articles « faire rire un homme / une fille ». **Aucun lien vers `/blog/comment-avoir-de-la-repartie` ni vers `/blog/exercices-developper-humour`.**
- JSON-LD présent sur cette page : Article, FAQPage, BreadcrumbList, Organization, WebSite. Les articles statiques utilisent le même composant (`components/seo/json-ld.tsx`) : pas de balisage manquant à ajouter pour ces trois pages (vérifier au Rich Results Test, voir mesure).

## 1. Requêtes cibles

| Requête | Page qui ranke (impressions, clics, position, 28 j) | Lecture |
|---|---|---|
| comment devenir drôle | `/blog/comment-devenir-drole` : 38 impr., 0 clic, pos. 13,3. Autres pages qui se positionnent sur la même requête : `/` (15, pos. 31,4), `/blog` (9, pos. 34,4), `/blog/exercices-developper-humour` (32, pos. 45,6), `/parcours` (1, pos. 39) | La bonne page est en page 2, mais 4 pages se disputent la requête : dilution et cannibalisation légère. Total ~95 impressions : volume faible, intention très forte. |
| comment être drôle | `/blog/comment-devenir-drole` : 7 impr., pos. 21,9 ; `/` : 5, pos. 35,6 ; `/blog/exercices-developper-humour` : 5, pos. 60 | Variante de la même intention : se traite avec la même page, sans créer de nouvel article. |
| comment être drôle dans une conversation | `/` (4, pos. 29), `exercices-developper-humour` (4, pos. 36), `comment-devenir-drole` (1, pos. 43) | Même constat : la page d'accueil et l'article exercices volent l'impression. |
| avoir de la répartie | `/blog/comment-avoir-de-la-repartie` : 3 impr., pos. 26,3 ; `phrases-droles-conversations` : 2 impr., pos. 2,5 ; `/conseils` : pos. 92 | Quasi aucune impression sur la requête exacte (a priori peu de recherches à cette formulation dans cette fenêtre). La page dédiée est à 26 ; l'article « phrases drôles » est mieux placé (2,5) mais ne vend pas la répartie. |
| avoir de la répartie définition | `comment-avoir-de-la-repartie` : 2 impr., pos. 17 | Intention de définition, comme autodérision : un paragraphe de tête manque. |
| phrase de répartie drôle | `phrases-droles-conversations` : 23 impr., 3 clics, pos. 5,1 | Déjà bonne : 3 clics sur 23. Pont naturel vers « avoir de la répartie ». |

Remarque : les chiffres du diagnostic (66 impressions et position 18,5 pour « comment devenir drôle » ; positions 20 à 45 pour « être drôle » ; 29 à 30 pour « répartie ») sont la somme/plage sur plusieurs pages ; le tableau ci-dessus donne le détail par page lu dans Search Console.

## 2. Ce qui manque

1. **Maillage entrant.** La page qui reçoit 250 clics ne pointe pas vers l'article répartie. Les articles à impressions (`autoderision-interactions` 1 954, `phrases-droles-conversations` 2 811, `repondre-moqueries-avec-humour` 885, `5-types-humour` 403) pointent déjà vers `comment-devenir-drole`, mais `5-types-humour` et `phrases-droles-conversations` ne vont pas toujours vers `comment-avoir-de-la-repartie` (à vérifier au code avant d'ajouter, un seul lien utile par article suffit).
2. **Intention.** « Comment devenir drôle » (1 859 mots, 6 H2, 4 FAQ) et « avoir de la répartie » (1 668 mots, 13 H2, 4 FAQ) ont la profondeur ; le titre et la première phrase doivent répondre à la question (réponse courte dans les 160 premiers caractères, utile pour Bing et pour les extraits IA).
3. **Cannibalisation.** `/` et `exercices-developper-humour` se positionnent sur « comment devenir drôle » devant la bonne page. Cause probable : titre/H1 d'accueil et de l'article exercices sur le même champ lexical. À traiter en différenciant (exercices = « s'entraîner », devenir-drôle = « comment devenir drôle »), sans toucher aux slugs.
4. **Données structurées.** FAQPage et Article existent. Manque éventuel : `HowTo` sur « comment devenir drôle » (5 piliers + plan 30 jours). Google a réduit les rich results HowTo : valeur surtout pour la lecture par les IA (@geo), pas pour un affichage enrichi. Priorité basse.

## 3. Actions classées par impact

| # | Action | Page | Impact attendu | Qui / validation |
|---|---|---|---|---|
| 1 | Ajouter dans `meilleures-blagues-droles-2026` (code statique, pas la base : voir `liens-internes-s27.md`) un lien contextuel vers `comment-avoir-de-la-repartie` et un vers `exercices-developper-humour`, aux endroits où l'article parle déjà de répartie/s'entraîner | meilleures-blagues | Fort : transmet le poids de la page à 250 clics ; 0 coût. Vérifier avant que 2 liens de plus ne dégradent pas la conversion de l'encart (658 vues d'encart, 36 clics) | Thomas valide (écriture en base, hors périmètre de cette session) |
| 2 | Paragraphe de définition/réponse en tête de `comment-devenir-drole` et `comment-avoir-de-la-repartie` (2 phrases : ce que c'est, la réponse courte), sans toucher aux H2/FAQ/liens/chiffres existants | les deux | Moyen à fort sur la position et sur les extraits IA ; même méthode que pour autodérision | @copywriter + relecture à l'aveugle (P0 s18), test d'empreinte comme s27 |
| 3 | Réécrire le title et la description de ces deux pages sur l'intention (« Comment devenir drôle : 5 piliers et un plan sur 30 jours » existe déjà dans `/vannes` JSON-LD ; vérifier l'écart avec le title réel) | les deux | Moyen : CTR dès que la page passe en page 1 | @seo, lot 3 après J+14 (ne pas empiler les changements avant de mesurer le lot 1) |
| 4 | Retirer la cannibalisation : différencier le title de `exercices-developper-humour` et l'ancre des liens internes vers cet article (« exercices pour s'entraîner » plutôt que « comment devenir drôle ») | exercices | Moyen | @seo + @copywriter |
| 5 | Lien depuis `phrases-droles-conversations` (2 811 impr.) vers `comment-avoir-de-la-repartie` avec ancre « avoir de la répartie » | phrases-droles | Moyen : l'article se place à 2,5 sur la requête, le passage vers la bonne page évite qu'elle lui serve de page d'arrivée | code (`blog-articles.ts`), vérification des liens existants d'abord |
| 6 | Ancres internes depuis les articles à impressions vers `comment-devenir-drole` avec ancre exacte « comment devenir drôle » (au moins `5-types-humour`, `autoderision-interactions`, `repondre-moqueries`) | plusieurs | Faible à moyen | code, un lien par article |
| 7 | Contenu externe : articles invités et échanges de liens (déjà en cours) vers `comment-devenir-drole` | `comment-devenir-drole` | Moyen sur 2 à 3 mois, dépend des réponses reçues | Thomas / @growth |
| 8 | HowTo JSON-LD sur `comment-devenir-drole` | idem | Faible | @fullstack, après les actions 1 à 5 |

Ordre conseillé : lot 1 déjà commité (titles/descriptions) → 1 et 5 (liens) → 2 (paragraphes de tête) → mesure J+14 → 3, 4, 6 selon les résultats.

## 4. Mesure

Référence avant changement (28 jours au 22/11) : voir tableau §1 et lot 1 ci-dessous. Déploiement à date D (non fait à ce jour).

| Page | Mesure de référence | Seuil de lecture à J+14 | À J+28 |
|---|---|---|---|
| `autoderision-interactions` | 1 954 impr., 8 clics, pos. 10,0 (« autodérision def » 490, pos. 10,5, 2 clics) | CTR de « autodérision def » > 0,4 % (aujourd'hui 0,4 %) puis suivre la position | position moyenne < 9 |
| `5-types-humour-lequel-pour-toi` | « humour observationnel » 367 impr., pos. 7,9, 0 clic | au moins 1 clic | CTR > 2 % à position égale |
| `comment-faire-rire-une-fille` | « comment faire rire une femme » 74 impr., 1 clic, pos. 7,6 | CTR en hausse à position égale | idem |
| `comment-faire-rire-un-homme` | « comment faire rire quelqu'un » 54 impr., 0 clic, pos. 10,7 | idem | idem |
| `phrases-droles-conversations` | 2 811 impr., 54 clics, pos. 7,2 | CTR > 1,9 % (aujourd'hui 1,9 %) | idem |
| `repondre-moqueries-avec-humour` | 885 impr., 6 clics, pos. 6,6 | CTR en hausse | idem |
| `/vannes` | 947 impr., 11 clics, pos. 6,6 (« faire des vannes » 21 impr., 0 clic, pos. 8) | CTR en hausse | idem |
| Cibles qui vendent | « comment devenir drôle » pos. 13,3 sur la page cible ; « avoir de la répartie » pos. 26,3 | la page cible reste seule à se positionner (plus de `/` ni `exercices`) | `comment-devenir-drole` en position < 10 |

Méthode : même requête `searchAnalytics/query` (dimensions query et page, fenêtre de 28 jours, propriété domaine) à J+14 et J+28 après déploiement, comparaison à CTR égal et position égale (un gain de CTR avec position stable vient du title/description). Un lot à la fois : ne pas changer les titles du lot 1 avant J+14. Umami : clics vers `/abonnement` et lettre depuis les pages cibles, pour relier SEO et ventes.

À ne pas conclure sans données : un volume de recherche mensuel (non disponible ici), un classement concurrent (pas de relevé SERP dans cette session).

## 5. Lot 1 (commité, non déployé)

Title et description réécrits pour 7 pages (diff dans le commit et `REPLIT_ACTIONS.md`). Les corps d'article, slugs, H2, FAQ, liens et chiffres sont identiques (vérifié par le test d'empreinte, qui compare désormais le title et l'excerpt à leur valeur d'avant via `METAS_AVANT_S27`).

Paragraphes de définition proposés (non écrits, à faire par @copywriter) :
- `autoderision-interactions` : 2 phrases de définition avant le paragraphe d'ouverture (« L'autodérision, c'est... »), pour l'intention « autodérision def » (490 impressions).
- `5-types-humour-lequel-pour-toi` : définition de l'humour observationnel (le bloc « En bref » la contient déjà en parenthèse ; en faire une phrase de tête).
- `comment-devenir-drole`, `comment-avoir-de-la-repartie` : voir action 2.
