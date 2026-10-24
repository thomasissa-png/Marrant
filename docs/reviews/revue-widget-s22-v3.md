# Revue croisée : widget « La vanne du jour », tour 3 (commit `b5e6e52c`) : 24/10/2026

> @reviewer. Code non déployé, `WIDGET_VANNE_DU_JOUR_PUBLIE = false`. Références qui font foi : synthèse s22, ligne du 24/10/2026 de `docs/founder-preferences.md` ([CHOIX UTILISATEUR] : toutes les recos de la spec suivies), `docs/legal/widget-vanne-du-jour-s22.md`. Limite : pas de shell dans cette session, donc lecture de l'arbre de travail et Grep, pas de `git show --stat b5e6e52c` (à rejouer par la session principale, P0 s11). QA tour 3 (`docs/qa/qa-widget-s22-v3.md`) encore « [EN COURS] ».

## Résumé exécutif

Le point qui bloquait la mise en ligne est réglé : le comptage ne passe plus par Umami mais par l'outil de statistiques de Cloudflare, déjà hébergeur du site. Seul le domaine du site qui affiche la vanne est enregistré, rien sur le visiteur. La phrase publiée « ne suit pas tes visiteurs » reste vraie et la page de confidentialité n'a pas bougé. Les décisions de Thomas tiennent en un bloc de 5 lignes. On peut mettre en ligne dès que les textes sont validés, avec deux retouches d'une ligne avant le go.

## Résumé technique

N1, N2, N3, N5, N6, N7 corrigés ; N4, m5, m6 ouverts, aucun bloquant (m6 bloque le go par construction, c'est l'étape textes). 0 bloquant, 0 majeur, 2 mineurs neufs (N8 @legal, N9 contrôle de l'étape 7). Gates G7 et G13 repassées à PASS. **GO.**

**Note : 9/10** (8,5 au tour 2).

## Suivi des écarts du tour 2

| # | Écart V2 | Statut | Évidence |
|---|---|---|---|
| N1 | IP du visiteur possiblement transmise à Umami | Corrigé | `mesure.ts:66-75` : `writeDataPoint` local au Worker, aucun `fetch` ; point = `{ blobs: [domaine], indexes: [domaine] }` (`mesure.ts:46-49`) ; test `widget-mesure-qa-s22.test.ts:73-81` (IP, User-Agent, chemin, e-mail, cookie, thème absents du point ; `fetch` jamais appelé) et `:135-140` (ni `umami.is` ni `fetch(` dans `mesure.ts`) |
| N2 | 3 événements Umami par affichage | Corrigé | 1 appel = 1 point écrit (doc Cloudflare, tarifs) ; quota Analytics Engine distinct de celui d'Umami : 100 000 points par jour en Workers Free, 10 millions par mois en Paid (`REPLIT_ACTIONS.md:19`, vérifié) |
| N3 | Décisions Thomas dispersées, lien de pied de page absent | Corrigé | Bloc « Ce qui dépend de Thomas » (`REPLIT_ACTIONS.md:9-14`) : go et textes, règle Cloudflare, jeton de lecture, phrase, lien de pied de page oui / non |
| N4 | Pas d'alerte de stock sous 90 | Ouvert, justifié | `countWidgetVannesEligibles` toujours appelée nulle part (Grep `apps/web` : 1 occurrence) ; noté « Non fait » (`REPLIT_ACTIONS.md:30`). Non bloquant : 93 vannes au lancement, synthèse point 5 (« au moins 90 jours au lancement ») respectée |
| N5 | Contrôle de retrait fragile | Corrigé | `jq -r .url \| cut -d'?' -f1` comparé à la ligne « Fiche : » en ASCII ; portée au point de présence écrite (`REPLIT_ACTIONS.md:27`) |
| N6 | Limite par IP étendue à l'iframe | Justifié | Effet connu écrit, revue au bilan J+30, sortie prévue « limiter la règle à l'API seule » (`REPLIT_ACTIONS.md:26`) |
| N7 | Statistiques du site mêlées, filtre robots d'Umami | Corrigé | Jeu de données dédié `widget_vanne_du_jour` (`wrangler.jsonc:61-68`) ; Umami du site intact ; robots déclarés et requêtes sans User-Agent écartés par le code (`mesure.ts:32, 40-43`, test `:110-119`) ; affichage de test gardé à l'étape (7) |
| m5 | Volet SEO non aligné | Ouvert, non bloquant | Document interne ; `docs/seo/widget-replique-du-jour-s22-seo.md:85` évoque déjà Analytics Engine |
| m6 | FAQ, signalement, maillage | Ouvert (étape textes) | Item 1 du bloc Thomas ; 10 marqueurs `BROUILLON s22` dans `page.tsx` |

## Points demandés

| Point | Verdict | Évidence |
|---|---|---|
| « ne suit pas tes visiteurs » reste vrai | PASS | Seul le domaine hôte est écrit, ni IP ni User-Agent ni chemin (`mesure.ts:9-11, 46-49`) ; aucun cookie, aucun script tiers dans l'iframe (test `widget-vanne-du-jour-s22.test.ts:230-238`) ; phrase publiée mot pour mot (`page.tsx:42` = legal §1). Legal §3 (« aucun Umami dans `/embed/*` ») redevient exact |
| Page de confidentialité non touchée | PASS | Grep `widget\|vanne-du-jour\|analytics engine` dans `confidentialite/` : 0 ; Cloudflare y figure déjà comme prestataire (`confidentialite/page.tsx:31`) |
| Non-corrigés et mise en ligne | PASS | N4 et m5 ne bloquent pas ; m6 est la condition 1 du go |
| Bloc « Ce qui dépend de Thomas » complet et exécutable | PASS avec réserves | 5 items, procédure numérotée, requêtes SQL valides ; « rien à activer » exact (jeu créé à la première écriture, doc Cloudflare) ; réserves N8, N9 |
| Zéro tiret cadratin client-facing | PASS | Grep U+2014 sur les fichiers du widget et `public/widget.js` : 0 |
| Aucun [CHOIX UTILISATEUR] remis en cause | PASS | Lien de marque, sélection, iframe servie par le site : inchangés |

## Gates (code tour 3 + entrée REPLIT)

| # | Gate | Verdict | Évidence |
|---|---|---|---|
| G1 | Sections complètes | PASS | Mesure, lecture des chiffres, procédure, phrase, règle, retrait, blocage, retour arrière, non fait (`REPLIT_ACTIONS.md:9-30`) |
| G3 | Handoff | PASS | « NON DÉPLOYÉ (attend le go de Thomas) » (`REPLIT_ACTIONS.md:5`) |
| G5 | Persona | PASS | Tutoiement, ni prix ni pub dans le widget, lien de marque toujours présent |
| G7 | 0 contradiction amont | PASS | Legal §1 et §3, synthèse point 2 (« sans cookie ni Umami ») et SEO l. 31 cohérents avec `mesure.ts` |
| G12 | Implémentable sans question | PASS avec réserve | Réserve N9 (contrôle de l'étape 7) |
| G13 | 0 donnée inventée | PASS | Quotas, gratuité en Workers Free, création automatique du jeu, conservation 3 mois : vérifiés sur la doc Cloudflare (sources en bas) |
| G15 | 0 placeholder | PASS | Seul `Retry-After : [À VÉRIFIER dans le tableau de bord]`, explicite |
| G17 | Non copiable | PASS | 93 identifiants, domaines exclus du site, règle Cloudflare Free |
| G_PROOF | Preuve reproductible | PASS partiel | Tests Jest lus (mesure, en-têtes, absence d'Umami) ; contrôles annoncés (359 suites, 5 459 tests) non rejoués ici ; QA v3 en cours ; diff du commit à mesurer (`git show --stat b5e6e52c`) |

## Écarts restants

### Bloquant

Aucun.

### À faire avant le go de mise en ligne (une ligne chacun)

| # | Écart | Référence | Correction |
|---|---|---|---|
| N8 | Phrase de confidentialité : la phrase @legal dit « seules les données techniques de la requête sont traitées **pour l'afficher** », alors que le domaine hôte est désormais aussi gardé 3 mois pour compter. Le complément « Chaque affichage est compté par site, sans donnée sur le visiteur » est exact avec Analytics Engine mais attend encore la revalidation @legal annoncée (`REPLIT_ACTIONS.md:25`), et legal §3 ne dit rien du comptage | legal §3, §4.3 ; `REPLIT_ACTIONS.md:13, 25` | @legal : une ligne dans son document qui confirme §1 et §3 avec Analytics Engine et valide le complément ; recommander de poser les deux phrases ensemble si Thomas dit oui. Item 4 du bloc Thomas : préciser « après le visa @legal » |
| N9 | Étape (7) : « un affichage depuis un domaine tiers » sans moyen donné. Un fichier local ou `curl` sans Referer tombe sous `inconnu`, exclu de la requête « domaines actifs » ; le `curl` par défaut est écarté comme robot | `REPLIT_ACTIONS.md:21, 24` ; `mesure.ts:32` | Écrire la commande : `curl -s -o /dev/null -e https://test-widget.example/ -A "Mozilla/5.0" https://deviens-marrant.fr/embed/vanne-du-jour`, puis la requête « domaines actifs » montre `test-widget.example`. Dire aussi où lire `ACCOUNT_ID` (tableau de bord Cloudflare, page du compte) |

### Mineurs (après la mise en ligne)

| # | Écart | Échéance | Correction |
|---|---|---|---|
| N4 | Alerte de stock sous 90 non branchée | Avant le bilan J+30 | Arbitrage @data-analyst déjà noté ; en attendant, ajouter à la procédure « Retirer une vanne » : « si la liste passe sous 90 identifiants, prévenir » |
| m5 | Volet SEO non aligné sur le contrat d'API | Avant la phase 2 (extension WordPress) | @seo, document seulement |

### Remarque (aucune action exigée)

Les journaux du Worker (`observability.enabled`, `wrangler.jsonc:82-84`, antérieurs au widget et communs à tout le site) enregistrent les requêtes `/embed` comme les autres pages. C'est du traitement technique, couvert par la phrase @legal et par Cloudflare déjà listé en page de confidentialité ; ce n'est pas un suivi des visiteurs. À signaler à @legal avec N8 pour qu'il le sache.

## Top 3 corrections prioritaires

1. N8 : visa @legal sur la phrase et son complément, avant l'étape (3).
2. N9 : commande d'affichage de test et emplacement de `ACCOUNT_ID`, pour que l'étape (7) prouve le comptage.
3. N4 : garde-fou de stock dans la procédure de retrait, en attendant l'alerte.

## Contradictions

| Livrable A | Livrable B | Contradiction | Criticité | Résolution |
|---|---|---|---|---|
| legal §4.3 (« pour l'afficher ») | `mesure.ts` (domaine gardé 3 mois pour compter) | Finalité du traitement incomplète si la phrase est posée seule | Mineure | N8 (@legal) |
| SEO §4 | code | Contrat d'API | Mineure | m5 (@seo) |

## Angles morts

- Bloc « Widget » du rapport du lundi (@data-analyst) : les deux sources sont maintenant fixées (Analytics Engine pour les affichages, Umami pour les clics), il reste à l'écrire ; exporter le bilan avant J+90 (conservation 3 mois).

## Décisions à confirmer par Thomas (au moment de la mise en ligne)

1. Phrase de confidentialité (avec son complément, après visa @legal) : oui / non ?
2. Lien « Intègre la vanne du jour » dans le pied de page : oui / non ?
3. Jeton d'API « Account Analytics : Read » : à créer seulement pour lire les chiffres.

## Recommandation

**GO** : mise en ligne sur go écrit de Thomas, une fois les textes validés (m6) et N8, N9 faits ; pas de nouvelle revue complète, re-vérification de N8 et N9 seulement. Agents : @legal (N8), session principale (N9, garde-fou N4 dans `REPLIT_ACTIONS.md`, `git show --stat b5e6e52c`), @data-analyst (N4, bloc du lundi), @seo (m5), @copywriter après étalons (m6).

Sources externes : [Cloudflare, Analytics Engine, tarifs](https://developers.cloudflare.com/analytics/analytics-engine/pricing) ; [Cloudflare, Analytics Engine, limites (conservation 3 mois)](https://developers.cloudflare.com/analytics/analytics-engine/limits) ; [Cloudflare, Analytics Engine, démarrage (jeu créé à la première écriture)](https://developers.cloudflare.com/analytics/analytics-engine/get-started/) ; [Cloudflare, Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/).

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/reviews/revue-widget-s22-v3.md`
- Décisions prises : GO 9/10 ; N1, N2, N3, N5, N6, N7 corrigés ou justifiés ; N4 et m5 non bloquants ; N8 et N9 avant le go
- Points d'attention : QA v3 en cours ; diff réel du commit non mesuré (pas de shell)
---
