# Notation growth des bannières s15, cycle 3 (06/10/2026)
> @growth. Ouvert un par un : 6 PNG, 6 contrôles, 3 aperçus mobiles ; relus : `index.md`, cycle 2, `lib/liens.ts`, `lib/attribution.ts`, `app/liens/*`. Pas de shell : cotes relues sur les images (±5 px), recoupées avec `index.md` (Répartie : point (730, 1144) = 264 px du centre). Test : en 2 secondes, une raison de suivre et un chemin vers le site. `[HYPOTHÈSE : bannière plus claire = plus d'abonnés par visite de profil ; relever visites et abonnés avant/après à J+28]`

## Corrections du cycle 2 (fait / pas fait)
- **Répartie 520 vers 420 px : fait.** Encre x 335 à 737, rayon max 264,5 px (limite 270, marge 95 px dans le cercle de 360), bulles séparées et ouvertes ; à 64 px, même poids que Quiz, Vannes, Conseils.
- **LinkedIn x 348, titre 48 px : fait.** Encre x 351 à 982 ; 2 cadrages (pleine largeur, 900 px) : 0 collision avec le logo, sous-titre 13 px et 16,5 px lisible.
- **X appel 56 px : fait.** Glyphes x 539 à 1382, y 351 à 403, 0 pixel dans la photo (x 0 à 400, y 300 à 500) ni dans les recadrages ; 14,6 px à l'aperçu. **Vannes, tige : fait**, plus d'encoche.
- **Pas fait, hors PNG** : les 6 gestes de Thomas ci-dessous et la lecture sur un vrai téléphone (zones sûres non mesurées dans les applis).

## Notes
| Visuel | Cycle 2 | Cycle 3 | Verdict |
|---|---|---|---|
| X en-tête | 10 | **10** | Promesse 22 px à l'aperçu, appel lisible, chemin vers le site dit en 1 ligne |
| LinkedIn couverture | 10 | **10** | Titre et sous-titre dégagés du logo dans les 2 cadrages |
| Instagram Quiz / Vannes / Conseils | 10 | **10 / 10 / 10** | « ? », micro, ampoule nets à 64 px ; rayons 248, 263, 250 px |
| Instagram Répartie | 9 | **10** | Même échelle que les 3 autres, lu « dialogue » à 64 px |

Règles : aucun prix, « gratuit », tiret cadratin, IA, « je » de marque ni nom du fondateur ; « sans inscription » = quiz seulement (vrai, bloc `/liens`). Réserve : « une vanne par jour » vrai tant que la vanne du jour sort chaque jour.

## Marche à suivre finale pour Thomas (cycle 2 confirmé, 1 précision)
1. **X** : Modifier le profil, en-tête = `x-entete.png` ; lien du profil = `https://deviens-marrant.fr/liens/x` (pose `utm_source=x`, rien d'autre).
2. **LinkedIn** : page, Modifier, couverture = `linkedin-couverture.png` ; site web et bouton « Visiter le site web » = `https://deviens-marrant.fr/liens/li` `[À VÉRIFIER : bouton personnalisable]`.
3. **Instagram** : lien de bio unique = `https://deviens-marrant.fr/liens`. Publier 4 stories, les mettre à la une dans l'ordre Quiz, Vannes, Conseils, Répartie (noms exacts), couvertures = `instagram-alaune-quiz.png`, `-vannes.png`, `-conseils.png`, `-repartie.png`.
4. **Story derrière chaque couverture** : Quiz = « Quel est ton profil d'humour ? Environ 2 minutes, sans inscription. » ; Vannes = une carte vanne déjà publiée ; Conseils = une carte conseil déjà publiée ; Répartie = une carte déjà publiée + « Avoir de la répartie, étape par étape. »
5. **Sticker lien** = `https://deviens-marrant.fr` + chemin + `?utm_source=instagram&utm_medium=social&utm_campaign=bio&utm_content=` + valeur : Quiz `/quiz-humour` `bio-quiz` ; Vannes `/vannes` `bio-vannes` ; Conseils `/conseils` `bio-conseils` ; Répartie `/parcours/repartie` `bio-parcours`. Valeurs dans `CONTENUS`, chemins existants ; jamais `/register` ni `/abonnement`. **Précision** : ce sont les `utm_content` des blocs de `/liens` (aucune valeur « story » en liste blanche, rien inventé) : clics de bio et de stickers comptés ensemble.
6. **Avant** : ouvrir `/liens`, `/liens/x`, `/liens/li` en production (`/liens/ig` reste 404). **Après** : voir les 3 bannières sur un vrai téléphone, relever visites de profil et abonnés à J+28.

## Handoff @orchestrator
- Fichier : `/home/user/Marrant/docs/social/visuels-s15/bannieres/notation-growth-cycle3.md`. Décision : 6 visuels à 10/10, publiables tels quels ; marche à suivre confirmée. À faire : Thomas pose les 6 gestes ; la session met à jour l'historique de `project-context.md` (non lu en entier). Aucun code modifié.
