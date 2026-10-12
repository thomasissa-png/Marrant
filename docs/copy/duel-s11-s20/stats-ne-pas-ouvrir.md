# Statistiques du duel (réservé à la session, ne pas transmettre aux relecteurs)

> @fullstack, 12/10/2026. Base de prod lue en lecture seule (Neon HTTP, en-tête `Neon-Batch-Read-Only`, un seul SELECT sur `BlogArticle`). Aucune écriture, aucun déploiement, aucun code modifié.
> Version « en ligne » = `title`, `metaDescription`, `content` en base (0 « — » depuis le patch tirets v2 du matin). Version « s11 » = `metaDescription` et `content` de `apps/web/src/data/blog-article-rewrites.json` (`_meta.version` 2), `content` passé dans `stripEmDashesWithStats` (`apps/web/src/lib/em-dash.ts`, la fonction de `stripBlogEmDashesTask`, titres `#` exclus) ; `title` = celui de la base (le JSON n'en fournit pas, donc identique dans les deux versions).
> Mots = suites de lettres et chiffres du texte de l'article (hors titre et méta). Différence = 1 − (plus longue sous-suite commune de mots) / moyenne des deux longueurs. Sensible à la casse (comme le diagnostic, à ±0,2 point près) ; entre parenthèses, insensible à la casse.

| Article | Version 1 = | Mots en ligne | Mots s11 | Diff. texte | Diff. méta | « — » retirés de s11 |
|---|---|---|---|---|---|---|
| `avoir-confiance-en-soi-grace-a-l-humour` | s11 | 1 512 | 1 734 | 36,4 % (34,9) | 79,6 % | 8 |
| `blague-courte-arme-secrete-humour` | s11 | 1 805 | 2 098 | 51,8 % (50,2) | 73,6 % | 16 |
| `blague-drole-7-criteres-pepite` | en ligne | 1 795 | 2 098 | 33,5 % (32,3) | 77,4 % | 0 |
| `citation-drole` | en ligne | 1 901 | 1 992 | 28,5 % (27,4) | 68,9 % | 0 |
| `comment-improviser-des-blagues` | s11 | 1 949 | 2 082 | 32,5 % (31,9) | 75,5 % | 2 |
| `comment-raconter-une-blague-sans-la-rater` | en ligne | 1 843 | 2 149 | 42,2 % (40,4) | 65,4 % | 5 |
| `etre-plus-a-l-aise-en-societe` | s11 | 2 108 | 2 242 | 31,1 % (28,1) | 56,9 % | 0 |
| `jeu-de-mots-drole-techniques-creer` | s11 | 1 819 | 2 342 | 46,2 % (45,5) | 80,0 % | 24 |
| `techniques-humoristes-pros` | s11 | 1 694 | 1 778 | 37,7 % (36,2) | 73,9 % | 4 |
| **Total** | 6 s11 / 3 en ligne en position 1 | 16 426 | 18 515 | | | 59 |

Différences de longueur : la version s11 est plus longue dans les 9 cas (+5 % à +29 %). Un relecteur attentif peut le remarquer ; ça ne dit pas laquelle est en ligne.

## Contrôles d'anonymat

- 0 « — » dans les 18 fichiers (titre, méta, texte). Les 59 tirets du JSON sont tous hors titres (0 titre `#` concerné), donc tous retirés, 0 mot changé.
- 0 occurrence de « s11 », « JSON », « refonte », « Replit », « Neon », « patch », d'ID ou de date technique ; les seules « base » sont dans le texte des articles (« la base de tout », « mot de base »), présentes dans les deux versions.
- Format identique : mêmes en-têtes de champs, même séparateur, texte rogné en début et fin, fins de ligne LF.
- Tirage : `crypto.randomInt(2)` par article, re-tiré si les 9 tombaient du même côté.

## Indices typographiques résiduels (non corrigés : hors périmètre, la consigne ne retire que les « — »)

Ils ne désignent pas une origine pour un relecteur qui ne connaît pas les conventions des deux textes, mais ils les distinguent :
- `jeu-de-mots…` : en ligne 25 « ... » / 0 « … » ; s11 0 « ... » / 7 « … ».
- `techniques-humoristes-pros` : en ligne 0 guillemet droit `"` (tout en « ») ; s11 8 `"` et 28 « ».
- « ... » plus fréquents en ligne dans tous les articles (`techniques-humoristes-pros` 18 contre 5 ; ailleurs 1 à 7 contre 0 à 5) ; « (ex: » en ligne contre « (ex : » s11 dans `jeu-de-mots…`.
- Un relecteur qui lirait la page publiée reconnaîtrait la version en ligne : le README interdit de consulter le site et de chercher le texte en ligne.
