# Revue croisée : widget « La vanne du jour », V1 (commit `89a97648`) : 24/10/2026

> @reviewer. Branche `claude/ouverture-session-nzwj0w`, non déployée. Références qui font foi : synthèse s22, ligne du 24/10 et P0 de `docs/founder-preferences.md`, volets legal, SEO, growth. Limite de la revue : pas d'accès au shell dans cette session, donc `git show --stat 89a97648` non exécuté ; le périmètre est vérifié par la liste de fichiers de `REPLIT_ACTIONS.md` (l. 8), Grep sur `apps/web/src` et lecture de chaque fichier du widget.

## Résumé exécutif

La V1 fait ce que Thomas a validé et rien de plus : une iframe servie par le site, un lien de marque toujours là, seulement l'amorce et la chute, DATING/SOIREES/COUPLE exclus, et tout est éteint tant que Thomas n'a pas dit go. Le texte juridique est posé mot pour mot. Il manque trois choses, toutes à régler avant la mise en ligne (pas avant l'étape suivante) : compter les affichages par site (sinon l'objectif J+30 « 3 sites actifs » est impossible à mesurer), garantir qu'une vanne retirée disparaît le jour même, et ajouter la phrase prévue dans la page de confidentialité. On peut passer à la sélection des vannes et aux textes.

## Résumé technique

Cohérence forte avec la synthèse ; aucune page existante modifiée visuellement ; en-têtes des autres routes inchangés et testés. 0 bloquant, 3 majeurs (mesure, cache, confidentialité), 10 mineurs. **GO pour l'étape suivante, NO-GO mise en ligne tant que M1 à M3 ne sont pas corrigés.**

**Note : 8/10.**

## Points vérifiés

| Point demandé | Verdict | Évidence |
|---|---|---|
| Périmètre : aucune page existante modifiée visuellement | PASS | Fichiers existants touchés : `next.config.js` (en-têtes), `sitemap.ts` (entrée conditionnée à l'interrupteur, l. 81-83), `public/_headers` (+ `/widget.js`). Aucun composant ni page existante modifiés (Grep `widget\|WIDGET` : seul `liens-page-content.tsx` remonte, sur l'id `vanne-du-jour` antérieur, l. 66). |
| En-têtes des autres routes inchangés | PASS | `next.config.js:134-144` : règle générale `/((?!embed/).*)`, mêmes valeurs et même ordre ; `/lettre/*` intact (l. 167-170) ; tests `widget-headers-s22.test.ts:49-58` et `cloudflare-static-headers.test.ts`. |
| `/embed/*` encadrable, noindex | PASS | `next.config.js:26` et `149-155` : pas de X-Frame-Options, `frame-ancestors *`, script autorisé par empreinte, `X-Robots-Tag: noindex` ; `embed-html.ts:60` meta noindex ; `robots.ts` sans `/embed/`. |
| Texte légal mot pour mot | PASS | `page.tsx:40-45` = `docs/legal/widget-vanne-du-jour-s22.md` §1 et §2 à l'identique (seules apostrophes et espaces typographiques via `frTypo`) ; titre « Conditions d'utilisation », ancre `#licence` (l. 134). |
| Brouillons marqués, non présentés comme validés | PASS | `// BROUILLON s22` sur title, description, H1, chaque paragraphe (`page.tsx:26, 81-126`), repli (`embed-html.ts:87`), bouton Copier (`bloc-code.tsx:35`) ; étape (2) de la procédure (`REPLIT_ACTIONS.md:10`). Textes non marqués = ceux validés dans la synthèse (« La vanne du jour », « Révéler la chute », « Pourquoi ça marche ? », « Deviens Marrant »). Voir m1. |
| Interrupteur fermé | PASS | `config/widget-vanne-du-jour.ts:16` `false`, l. 26 `WIDGET_JOKE_IDS = []` ; page 404 (`page.tsx:62`), API 503 (`route.ts:51`), iframe en repli (`embed/route.ts:33`), absente du sitemap (test `widget-sitemap-s22.test.ts:40`). |
| Aucun Premium ni décryptage exposé | PASS | `lib/widget/vanne-du-jour.ts:104` (select id, content, punchline, category), `187-196` (7 champs listés un par un) ; test `widget-vanne-du-jour-s22.test.ts:149` (aucun champ interdit). Pas d'archive : aucun paramètre de date. |
| Exclusions de catégories | PASS | Filtre SQL `notIn` (l. 89) + double garde JS (l. 108-110) + export (`exporter-candidats-widget.ts:62`) ; test l. 99. `maturityLevel` non utilisé comme filtre, conforme à la synthèse point 5. |
| Lien de marque toujours présent | PASS | `embed-html.ts:62` : dans tous les états (vanne, repli, domaine bloqué), aucun paramètre pour le masquer ; 13 px, contraste AA (l. 29-32) ; capture `hote-apres-revelation-375.png`. |
| Mesure prévue par la spec | **FAIL** | Voir M1. |
| Volets SEO et growth résolus comme la synthèse | PASS | Voir tableau des contradictions. |
| Procédure de mise en ligne et retour arrière | PASS avec réserves | `REPLIT_ACTIONS.md:10-13` complet sur l'essentiel ; manques M1, M2, M3, m2, m8. |
| Zéro tiret cadratin client-facing | PASS | Grep du tiret cadratin (U+2014) sur les 8 fichiers du widget : 0. |
| Règle Cloudflare (véracité externe) | PASS | Plan Free = 1 règle, période 10 s, blocage 10 s, confirmé sur la doc Cloudflare (sources en fin de rapport). |

## Gates (livrable : code V1 + entrée REPLIT)

| # | Gate | Verdict | Évidence |
|---|---|---|---|
| G1 | Sections complètes | PASS | Entrée REPLIT : fichiers, contrôles, procédure, règle Cloudflare, blocage, retour arrière. |
| G3 | Handoff | PASS | Entrée REPLIT en tête « NON DÉPLOYÉ (attend le go de Thomas) ». |
| G5 | Persona | PASS | Ton tutoiement, pas de prix ni de pub dans le widget (growth §2). |
| G7 | 0 contradiction amont | **FAIL** | Synthèse « Ensuite » (comptage sans cookie) et legal §4.3 (phrase de confidentialité) non couverts : M1, M3. |
| G12 | Implémentable sans question | PASS | Procédure numérotée, commandes `curl` attendues. |
| G13 | 0 donnée inventée | PASS | 1 075 octets vérifiable ; contraste 7,1:1 recalculé (#6D28D9 sur blanc : 7,13). |
| G15 | 0 placeholder | PASS | Seul `[À VÉRIFIER dans le tableau de bord]` (Retry-After), signalement explicite et légitime. |
| G17 | Non copiable | PASS | Taillé pour ce site (pool GARDER, catégories, Paris, Cloudflare Free). |
| G_PROOF | Preuve reproductible | PASS partiel | Commandes listées (`REPLIT_ACTIONS.md:9`) et 6 captures, sans extrait de sortie ; non rejoué ici (pas de shell). |

## Écarts

### Bloquant (pour l'étape suivante)

Aucun. La sélection des vannes et les textes ne dépendent d'aucun écart ci-dessous.

### Majeurs (à corriger avant la mise en ligne)

**M1. Mesure J+30 impossible : aucun comptage des affichages par domaine.**
Référence : synthèse point 9 (J+30 ≥ 3 domaines actifs, ≥ 30 clics) et « Ensuite » (@fullstack : « comptage sans cookie ») ; growth §4 (domaine actif = ≥ 1 affichage sur 7 jours, hors nos domaines ; bloc « Widget » du rapport du lundi ; baseline des recherches de marque AVANT le lancement) ; SEO §7. Constat : le code ne compte rien (`embed/route.ts`, `api/.../route.ts` : aucune écriture). Les clics sont mesurables (UTM `utm_content` = domaine hôte, `embed-script.data.cjs:15-17`, lus par Umami) ; les domaines actifs et les affichages ne le sont pas. Effet secondaire : l'aperçu de la page du programme envoie `utm_content=deviens-marrant.fr` et gonflera les clics.
Correction (@fullstack, puis @data-analyst) : compteur agrégé par (jour de Paris, domaine du Referer), sans IP ni cookie, à chaque affichage de `/embed/vanne-du-jour` (Workers Analytics Engine ou équivalent : [À VÉRIFIER disponibilité et coût sur le plan Workers du projet]) ; domaines `deviens-marrant.fr` et de test exclus ; bloc « Widget » du rapport du lundi (domaines actifs, affichages, clics, stock) ; relevé de la baseline « deviens marrant » (Search Console + Bing) ajouté comme étape de la procédure, avant le déploiement. Révélations : facultatif (growth seulement, absent de la synthèse).

**M2. Une vanne retirée de la liste reste servie jusqu'à minuit.**
Référence : `lib/widget/vanne-du-jour.ts:132` (clé de cache = jour seul) et commentaire l. 126 « une liste corrigée prend effet au déploiement suivant » (non démontré) ; growth §2 et §7 risque 1 (vanne déplacée remplacée vite) ; legal §1 (« couper l'accès… contenu inapproprié »). La clé ne dépend pas de `WIDGET_JOKE_IDS` : après un déploiement qui retire une vanne, chaque point de présence peut garder l'entrée du jour. La doc Cloudflare n'est pas claire sur la survie de `caches.default` à un déploiement et sur sa purge (sources en fin de rapport).
Correction (@fullstack) : ajouter à la clé une empreinte de `WIDGET_JOKE_IDS` et `WIDGET_CATEGORIES_EXCLUES` (toute liste modifiée = cache neuf), test associé, et une ligne « Retirer une vanne déplacée » dans `REPLIT_ACTIONS.md` (retrait de l'id, déploiement, `curl` de contrôle).

**M3. Phrase de confidentialité absente du code et de la procédure.**
Référence : legal §4.3 : ajouter à la page de confidentialité « Le widget La vanne du jour ne dépose aucun cookie ; seules les données techniques de la requête sont traitées pour l'afficher. » Grep `widget` dans `confidentialite/page.tsx` : 0.
Correction (@fullstack) : phrase mot pour mot, affichée seulement quand `WIDGET_VANNE_DU_JOUR_PUBLIE` vaut `true` ; étape ajoutée à la procédure ; une phrase dans une page existante = retouche minimale (P0 du 21/10) : avant/après montré à Thomas.

### Mineurs

| # | Écart | Référence | Correction |
|---|---|---|---|
| m1 | Non publié, `/embed/vanne-du-jour` sert quand même le texte BROUILLON du repli (« La vanne du jour revient très vite. ») si la branche part avec un autre déploiement | `embed/route.ts:33`, `embed-html.ts:87` | 404 tant que non publié, ou repli sans phrase ; le repli rédigé n'apparaît qu'après validation |
| m2 | Retour arrière « sans redéploiement de code complet » trompeur : l'interrupteur est une constante, il faut un build et un déploiement | `REPLIT_ACTIONS.md:13`, `config/widget-vanne-du-jour.ts:16` | Reformuler : « modifier la constante, build, déployer » ; `wrangler rollback` reste le chemin le plus rapide |
| m3 | Consigne d'export « écarter vanne attribuée à un humoriste tiers » plus stricte que le legal (écarter du widget OU garder avec nom et source dans le texte servi) | `exporter-candidats-widget.ts:37`, legal §4.1, P0 du 05/10 | Reprendre la formulation à deux options du legal. Rien n'est retiré du site |
| m4 | API : 403 et 503 en `public, s-maxage=60`, réponse 200 en `public, s-maxage` alors que `url` dépend de l'Origin ; Cloudflare n'honore pas `Vary: Origin` si une règle de cache est posée un jour | `api/widget/v1/vanne-du-jour/route.ts:40, 61` | 403 en `private, no-store` ; étendre la consigne « jamais de règle de cache » (`REPLIT_ACTIONS.md:12`) à l'API |
| m5 | Écarts au volet SEO non répercutés : champs API `amorce`/`chute` sans `slug` ni `category`, chargeur `/widget.js` au lieu de `/embed/loader.js`, pas de paramètre `taille`, pas d'ETag ni de `stale-while-revalidate`, hauteur 240 au lieu de 220 | SEO §1, §4 ; `config/widget-vanne-du-jour.ts:43, 52` | Acceptables (moins exposé). @seo met son volet à jour, aucun code à changer |
| m6 | Page du programme : FAQ, contact, signalement « Une vanne déplacée ? », lien de pied de page et maillage (`/vannes`, `/a-propos`) absents | SEO §6, growth §2 | Contenu : étape copy. Lien de pied de page = modification d'une page existante : le proposer à Thomas en une phrase, ne pas l'ajouter d'office (P0 du 21/10) |
| m7 | Rotation silencieuse si des vannes sortent du pool validé : pas d'alerte sous 90 | `vanne-du-jour.ts:111-112`, synthèse point 5, growth §1 | Nombre de vannes éligibles dans `/api/health` ou le rapport du lundi, alerte sous 90 |
| m8 | `WIDGET_PROGRAMME_LASTMOD` figé au 24/10, alors que les textes vont changer | `config/widget-vanne-du-jour.ts:47` | Étape « date réelle » dans la procédure, au moment de la validation des textes |
| m9 | Captures : pas de 768 px ; pas d'image avant/après des pages existantes | synthèse « Ensuite », `docs/qa/captures-widget-s22/` (6 PNG, 375 et 1280) | Compléter 768 px au tour des textes ; avant/après des en-têtes suffit pour les pages existantes |
| m10 | Champ `type` : seulement `"vanne"` dans le type TypeScript, la valeur `replique` n'est pas réservée | synthèse point 1 | Union `"vanne" \| "replique"` à la V1.1, sans effet aujourd'hui |

Captures lues : rendu propre, aligné, aéré, lien de marque lisible, chute révélée au clic, bouton de 44 px (`embed-html.ts:43`). Sur la page du programme (fond sombre), l'aperçu en thème auto s'affiche en clair avec une bande blanche sous la carte : à regarder avec @design au tour des textes, sans refonte.

## Top 3 corrections prioritaires

1. M1 : comptage des affichages par domaine + bloc du lundi + baseline, sinon le bilan J+30 décidé par Thomas ne peut pas se faire.
2. M2 : clé de cache liée à la liste, pour qu'une vanne déplacée disparaisse le jour même chez tous les hôtes.
3. M3 : phrase de confidentialité du legal, conditionnée à l'interrupteur.

## Contradictions

| Livrable A | Livrable B | Contradiction | Criticité | Résolution |
|---|---|---|---|---|
| SEO §6 (`/integrer-la-vanne-du-jour`) | growth §2 (`/widget`) | Nom de la page | Résolue | Synthèse point 8 ; code conforme |
| SEO §2 (lien facultatif) | growth §2 (« Pourquoi ça marche ? ») | Second lien | Résolue | Synthèse point 3 ; code conforme |
| growth §1 (`maturityLevel` ≤ 2) | synthèse point 5 | Filtre de maturité | Résolue | Liste relue à la main, pas de filtre de maturité ; code conforme |
| SEO §7 (≥ 25 hôtes à 90 j) | growth §4 (≥ 10 domaines) | Seuils | Résolue | Synthèse point 9 (seuils growth) ; mesure non codée (M1) |
| growth §1 (calendrier en base, remplacement en 5 min) | synthèse point 5 (liste d'identifiants) | Support de la sélection | Résolue par la synthèse | Liste en code, rotation par jour ; reste M2 pour le retrait |
| SEO §4 (champs `setup`, `slug`, `category`) | code (`amorce`, `chute`, sans `slug`) | Contrat d'API | Mineure | m5 : @seo aligne son volet |
| legal §4.3 | code et `REPLIT_ACTIONS.md` | Phrase de confidentialité | Majeure | M3 |

## Angles morts

- Stock tout public réel inconnu : l'export n'a pas tourné (`docs/growth/widget-candidats-s22.md` absent). C'est la première action de l'étape suivante, avant toute promesse de date (growth §7 risque 5).
- Baseline des recherches de marque à relever AVANT le lancement (@data-analyst), sinon la comparaison J+90 est perdue.

## Décisions à confirmer par Thomas (au moment de la mise en ligne, pas maintenant)

1. Lien « Intègre la vanne du jour » dans le pied de page : oui / non ? (seule modification visible d'une page existante proposée)

## Recommandation

**GO pour l'étape suivante** : export des candidates, relecture tout public à la main (@reviewer), étalons des textes avec Thomas puis @copywriter. **NO-GO mise en ligne** tant que M1, M2 et M3 ne sont pas corrigés et revérifiés (gates G7 et G_PROOF seulement). Agents : @fullstack (M1 à M3, m1, m2, m4, m7, m8), @data-analyst (M1 : bloc du lundi, baseline), @seo (m5), @design (aperçu, m9).

Vérifié :
- Read `apps/web/src/config/widget-vanne-du-jour.ts:16` : `export const WIDGET_VANNE_DU_JOUR_PUBLIE = false;`
- Read `apps/web/src/lib/widget/vanne-du-jour.ts:132` : clé `${WIDGET_ORIGIN}/__cache/widget/v1/vanne-du-jour/${dateKey}` (jour seul)
- Grep `widget` dans `apps/web/src/app/(dashboard)/confidentialite/` : 0 occurrence

Sources externes : [Cloudflare, Rate limiting rules](https://developers.cloudflare.com/waf/rate-limiting-rules/) ; [Cloudflare, Purging the cache (Workers)](https://developers.cloudflare.com/workers/cache/purge/) ; [Cloudflare, How the cache works](https://developers.cloudflare.com/workers/reference/how-the-cache-works/).

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/reviews/revue-widget-s22-v1.md`
- Décisions prises : GO étape suivante, NO-GO mise en ligne (M1 à M3)
- Points d'attention : `git show --stat 89a97648` à rejouer par la session principale pour confirmer le périmètre (pas de shell ici)
---
