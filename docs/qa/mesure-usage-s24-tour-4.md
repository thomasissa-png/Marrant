# Relecture à l'aveugle QA, mesure d'usage serveur s24 (lot 0), tour 4 (confirmation)

> Commit relu : `d862442e` (3 corrections du tour 3 et avis @legal). Relecteur : @qa. Date : 12/11/2026.
> Preuves marquées [STATIQUE] ou [LIVE]. Environnement vide, base Postgres jetable propre à ce tour, port libre vérifié.

## Notes

| # | Critère | T1 | T2 | T3 | **T4** | Preuve principale |
|---|---|---|---|---|---|---|
| 1 | Exactitude des définitions | 4 | 9 | 10 | **10/10** | code de mesure inchangé depuis le tour 3, déjà vérifié en vrai |
| 2 | Zéro régression | 10 | 10 | 10 | **10/10** | [LIVE] texte visible identique avant/après sur 7 pages ; `/confidentialite` : exactement les 3 changements prévus |
| 3 | Écriture non bloquante, dédoublonnage, concurrence | 9 | 10 | 10 | **10/10** | inchangé depuis le tour 3 |
| 4 | Données personnelles | 7 | 8 | 9 | **10/10** | [LIVE] phrase publiée mot pour mot ; suppression du compte qui efface lignes et marqueur ; justification @legal corrigée |
| 5 | Migration et procédure | 9 | 10 | 9 | **10/10** | P6 positif repart de zéro et contrôle l'opposition ; date de mise à jour provisoire signalée avec sa procédure |
| 6 | Tests | 7 | 10 | 10 | **10/10** | [LIVE] Jest 6 168 verts ; CI verte sur `d862442e` (run 43216441959, 3 jobs) |
| 7 | Script de lecture | 7 | 8 | 9 | **10/10** | [LIVE] dates impossibles refusées, code de sortie 1 |
| 8 | Pré-commit en environnement vide | 10 | 10 | 10 | **10/10** | [LIVE] tsc build, lint, build avant et après, tsc complet, tsc E2E : 0 erreur |

**Note globale : 10/10** (T1 7,9 ; T2 9,4 ; T3 9,6). **Verdict : GO pour la mise en ligne de la mesure**, sur go écrit de Thomas. Aucune correction restante.

## Vérifications du tour 4

### Corrections du tour 3
1. **Dates impossibles** [LIVE], script lancé sur le jeu de dates du tour 3 :
   - refusées avec le message « Lecture impossible : --depuis : date impossible « … ». Attendu AAAA-MM-JJ… » : `2026-13-45`, `2026-02-30`, `2026-02-29` (année non bissextile), `2026-11-08T25:00:00Z`, une valeur vide, et `--depuis` directement suivi de `--activation` ;
   - `--activation 2026-02-30` arrête le script avec le code de sortie 1 ;
   - acceptées : `2028-02-29` (année bissextile) et `2026-11-08` (minuit à Paris).
2. **Justification @legal** [STATIQUE] (`docs/legal/espace-client-s24-phrases.md:18`, commit `2086f398`) : elle décrit maintenant les faits exacts. Les deux événements sont détectés dans la page (IntersectionObserver) puis envoyés par `fetch`, sans rien lire ni écrire dans le stockage du terminal en dehors du cookie de session. Conclusion de @legal : aucun consentement requis.
3. **Contrôle P6 positif** [STATIQUE] (`REPLIT_ACTIONS.md`) : il commence par effacer les lignes du compte de test et vérifier l'absence de marqueur d'opposition. La fausse alerte du tour 3 n'est plus possible.

### Suppression du compte (avis @legal) [LIVE]
`deleteAccount` réel sur Postgres jetable, compte sans abonnement Stripe :
- avant : 2 lignes `UsageEvent` et 1 marqueur `mesure-usage:opposition:<compte>` ;
- après : 0 ligne et 0 marqueur ;
- un autre compte, avec ses propres lignes et son marqueur, n'est pas touché (1 et 1).

Les marqueurs de l'onboarding que @legal recommande aussi d'effacer sont hors de ce lot, et notés comme sujet à part dans `REPLIT_ACTIONS.md`. Cela n'entre pas dans la note de la mesure.

### Phrase publiée mot pour mot [LIVE]
- Les 2 phrases proposées dans le bloc 1 de `espace-client-s24-phrases.md` (partie 3, « Comprendre où les abonnés avancent ou décrochent… » ; partie 2, puce « Usage du service, si tu es ou as été abonné… ») se retrouvent **caractère pour caractère** :
  - dans `confidentialite/page.tsx`, sans aucune normalisation ;
  - dans le texte rendu par Chrome, sans écart une fois neutralisés les espaces insécables que le rendu typographique insère.
- L'ancienne phrase « de façon globale » n'existe plus.
- Diff du texte visible de `/confidentialite`, `b654b2f~1` contre `d862442e` : exactement 3 changements. La date « 8 novembre 2026 » devient « 12 novembre 2026 », la puce « Usage du service » est ajoutée, et la phrase de la partie 3 est remplacée. Rien d'autre.
- `/cgu`, `/`, `/abonnement`, `/vannes`, `/conseils`, `/parcours/repartie` et `/carnet` : 0 ligne de texte visible différente.
- Date : `MESURE_USAGE_DATE_TEXTES = "12 novembre 2026"`, marquée [PROVISOIRE]. `REPLIT_ACTIONS.md` impose de la remplacer par la date réelle de mise en ligne avant `build:cf`, et le contrôle P6 la vérifie. Ce n'est pas un défaut, c'est une étape de déploiement.

### Captures (thème sombre, deviceScaleFactor 2, zone = parties 2 et 3)
`docs/captures/s24-mesure/` :
- `confidentialite-avant-375.png`, `confidentialite-apres-375.png` ;
- `confidentialite-avant-1280.png`, `confidentialite-apres-1280.png`.

Prises dans Chrome réel, sur les builds `b654b2f~1` et `d862442e` servis en environnement vide, sur une base jetable et un port libre. Lecture visuelle des 4 images [LIVE] :
- **Ce qui change :** la nouvelle puce s'insère entre « Abonnement » et « Rétractation », et la phrase de la partie 3 est remplacée à la même place.
- **Ce qui ne change pas :** même typographie, mêmes puces, mêmes marges. Aucun libellé coupé, aucun débordement horizontal (`scrollWidth` égal à la largeur, à 375 comme à 1280), contraste identique au reste de la page.
- **Densité :** la puce fait 11 lignes à 375 px. C'est le texte exigé par @legal, lisible et sans coupure.
- **Correction pendant la prise :** au premier essai, l'en-tête collant masquait le titre de la partie 2 sur la capture « après » à 375 px. J'ai refait les 4 captures avec la page remise en haut avant le découpage ; celles commitées sont propres.

### CI et pré-commit
- [LIVE] Run `43216441959` sur `d862442e` : `test`, `lint` et `e2e-local` en succès. Le code de `apps/` à `HEAD` est identique à `d862442e`.
- [LIVE] Worktree `d862442e`, `env -i` + variables factices des jobs CI :
  - Jest : 405 suites, 6 168 tests verts (5 ignorés, existants) ;
  - `npx tsc --noEmit -p tsconfig.build.json` = 0 ;
  - `npx next lint` sans avertissement ;
  - `npm run build` = 0, pour avant comme pour après ;
  - `npx tsc --noEmit` = 0 ;
  - `npx tsc -p ../../playwright/tsconfig.json` = 0.

## Corrections restantes
Aucune. Avant la mise en ligne : remplacer la date provisoire le jour du déploiement (procédure déjà écrite), puis go écrit de Thomas.
