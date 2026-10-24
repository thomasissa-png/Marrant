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
| Zéro tiret cadratin client-facing | PASS | Grep `—` sur les 8 fichiers du widget : 0. |
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
