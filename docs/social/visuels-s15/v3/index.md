# Cartes sociales « piste A », v3 (s15, 05/10/2026, cycle 3)

Rendu réel par `next/og` (ImageResponse, même moteur que la production sous Workers), polices TTF de `apps/web/public/fonts/` : **Plus Jakarta Sans 800/700** (police de titre du site, `layout.tsx`) + Inter (pied, étiquettes). Syne est abandonnée et ses fichiers supprimés. Script : `cd apps/web && npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/render-visuels-piste-a.ts`. Code : `src/lib/social/templates/carte-marque.tsx`, `cartes-piste-a.tsx`, `carrousel-piste-a.ts`, `mise-en-lignes.ts`, `mesure-texte.ts`, `typo.ts`. Les 35 PNG ont été ouverts un par un et corrigés jusqu'à zéro défaut visible. Rien n'est publié.

Textes alternatifs : `alt.json` (un par image, envoyé à Buffer avec l'image, voir « Publication »).

## Ce qui change depuis la v2 (notations cycle 2 @design et @reviewer)

| Point | v3 |
|---|---|
| Police | Plus Jakarta Sans 800/700 partout (cartes = site). Chiffres alignés sur la ligne de base (« 45 », « n° 3 sur 5 », « 7 », « 1 », « 12 » vérifiés au rendu). |
| Espaces doubles, orphelins | Césure calculée sur les **largeurs réelles des glyphes** du TTF (`mesure-texte.ts` lit `hmtx`/`cmap`), une ligne = un bloc sans retour automatique, espaces normales (plus aucune insécable affichée, donc plus de trou). Nombre minimal de lignes, longueurs équilibrées, jamais un mot seul sur une ligne, jamais un début de phrase d'un mot en fin de ligne, dernière ligne ≥ 40 % de la plus longue, coupe de préférence après « : » ou une fin de phrase. Corps réduit seulement si nécessaire (jusqu'à -30 %, plancher 28 px). |
| Ponctuation | Plus Jakarta donne 0,13 em d'approche au point et à la virgule (et satori n'applique pas le crénage) : point, virgule, points de suspension et apostrophe sont rapprochés optiquement (« TGV, la », « inconnu. », « d’un »). |
| Tailles (Instagram) | amorce 80/800, chute 100, titre de couverture 76, nombre 220, pied et étiquettes 32 px, monogramme 72 px. X : chute 88, nombre 180. LinkedIn : chute 60. |
| Slide 1 | amorce en 800, bloc remonté au tiers haut, « Glisse → » en pied. Pas de pagination « n/N » (compteur natif d'Instagram). |
| Chevron « | règle unique : il marque la réplique à dire (conseil) ; retiré de l'amorce vanne et des extraits. « la timidité » s'affiche donc en guillemets français de 1er niveau. |
| Surtitres | « Vanne n° 2 sur 8 », « Accroche n° 3 sur 5 » (nom au singulier repris du titre de l'article). |
| Article | 4 slides : couverture, amorce de l'extrait, chute sur aplat, fin. Jamais amorce et chute sur la même slide. Fin : « Les N autres … » + bouton blanc « Lien en bio » (texte `#6D28D9`, 40 px / 800, rayon 12 px) ; « sur deviens-marrant.fr » retiré (le pied le porte). |
| Conseil | 3 slides : situation (titre du conseil en surtitre), réplique sur aplat, « Pourquoi ça marche » + principe en une phrase (1re phrase de définition du conseil id 42, `docs/content/conseils-seed.json`, mot pour mot) + bouton. Décliné LinkedIn (bouton « Lien en commentaire », la stratégie v2 met le lien en 1er commentaire). |
| Couvertures X et LinkedIn | article en 1600×900 (étiquette ARTICLE) et 1200×627 (sans étiquette). |
| LinkedIn vanne | chute seule si l'amorce tient avant « voir plus » (≤ 140 caractères, le post porte l'amorce) ; sinon carte de repli amorce + chute (`carteVanneRepli`). La plus longue amorce du catalogue fait 136 caractères. |

## Fichiers (mêmes cas que v2 + couvertures)

| Fichier | Cas | Dimensions |
|---|---|---|
| ig-vanne-audioguide-1 / -2 | Vanne : amorce, chute sur aplat (file IG 06/10) | 1080×1350 |
| ig-vanne-tgv-1 / -2 | Vanne : amorce, chute en 2 temps (file IG 07/10) | 1080×1350 |
| ig-article-halloween-1 à -4 | Couverture « 8 », amorce « Vanne n° 2 sur 8 », chute, fin « Les 7 autres vannes » (`docs/copy/articles-q4/S1-halloween.md`) | 1080×1350 |
| ig-article-se-presenter-1 à -4 | Couverture « 5 », « Accroche n° 3 sur 5 », chute, fin « Les 4 autres accroches » (`S2-se-presenter-avec-humour.md` l.94) | 1080×1350 |
| ig-conseil-ironie-bienveillante-1 à -3 | Situation, réplique, principe + « Lien en bio » (conseil id 42, étalon E7) | 1080×1350 |
| linkedin-conseil-ironie-bienveillante-1 à -3 | Même carrousel, fin « Lien en commentaire » | 1080×1350 |
| x-vanne-tgv, linkedin-vanne-tgv | Chute seule, le post porte l'amorce | 1600×900, 1200×627 |
| x-article-halloween, x-article-se-presenter | Couverture d'article X | 1600×900 |
| linkedin-article-halloween, linkedin-article-se-presenter | Couverture d'article LinkedIn, sans étiquette | 1200×627 |

**Tests de charge** (`charge/`, textes de test non publiables) : vanne courte (« J'ai pris un chien… », catalogue), vanne longue de 25 mots (« Dans le métro… », catalogue), amorce de 136 caractères sur LinkedIn (chute seule) et sa carte de repli, titre de 95 caractères avec « 12 » en Instagram, X et LinkedIn, titres avec « 1 » et « 7 ». Aucun débordement, aucun mot seul ; le titre de 95 caractères en X laisse 30 px au-dessus du pied (limite, mais tient).

## Publication (règles codées, `carrousel-piste-a.ts`)

- Tweet = amorce seule, mot pour mot (`texteAccompagnement`), sans URL ni hashtag avant elle ; l'image porte la chute.
- LinkedIn : amorce dans les 140 premiers caractères, sinon carte de repli.
- Texte alternatif : chaque image porte le sien (`Slide.alt`) ; toute image qui montre une chute porte amorce + chute.
- Légende Instagram : décision laissée à la stratégie v3 de @social (l'audit voulait l'amorce seule, @reviewer une question ou rien) ; la stratégie v2 dit « À envoyer à... » ou rien.

## Points restant à valider par Thomas `[PROVISOIRE]`

- Surtitre de la slide de principe : « Pourquoi ça marche » (proposé par @reviewer cycle 2).
- Bouton LinkedIn « Lien en commentaire ».
- Le tiret de « stand-upper » est le trait d'union de Plus Jakarta Sans (plus long qu'en Inter), identique sur le site.
