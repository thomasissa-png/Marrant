# Notation cycle 4 (final) des visuels sociaux, @design, s15, 05/10/2026

Base : les 11 PNG livrables de `visuels-s15/v4/` et les 6 PNG de `v4/charge/` ouverts un par un, `v4/index.md`, `v4/alt.json`, ma liste « 10/10 » (`notation-visuels-cycle3-design.md` §5), `strategie-relance-v5.md` §8 et R6, `duels-resultat-cycle5.md`. Positions en pixels : estimées à l'oeil sur le rendu (aucun outil de mesure dans cette passe), marge d'erreur environ 3 px. X = texte seul (v5 §8) : aucune carte X à noter ; `charge/x-titre-*.png` sont des bancs d'essai périmés, à ne pas insérer dans le lot.

**Verdict : NO-GO strict, à 0,1 près.** Moyenne V1 à V8 : **9,9 / 10** (cycle 3 : 8,5). **K4 : Instagram 9, LinkedIn 10.** Reste 2 correctifs de rendu (15 minutes) et 2 dépendances hors design (Buffer, légende du relais).

## 1. Ma liste 10/10 du cycle 3, point par point

| # | Point | Verdict | Preuve |
|---|---|---|---|
| 1 | R6 sur toutes les cartes vanne, “ ” imbriqués, `alt` avec « » | **Fait** | 8 cartes : `ig1-tuteur-1/-2`, `ig2-mimes-1/-2`, `ig3-anniv-de-lea-1/-2`, `ig-relais-blagues-ia-1/-2` ; une paire par ligne, « lilas sur noir, plus pâle sur aplat, espace fine ; `alt.json` 11 entrées conformes ; cartes 3 et 4, pied, surtitres sans guillemets |
| 1b | Ponctuation suspendue, toutes les lettres à x = 96 | **Partiel** | « à x = 52-57 (hors découpe 3:4 de 34 px, bon), mais texte à 123 (`ig1-tuteur-1`), 131 (`ig2-mimes-1`), 143-145 (chutes) au lieu de 96 : voir D1 |
| 2 | Bouton « Lien dans le post » | **Fait** | `charge/ig-conseil-3.png` : bouton blanc, texte violet, aucun « Glisse », aucune pagination |
| 3 | Test Buffer carrousel 2, 3, 4 images | **Non fait** | `index.md` « Reste ouvert » ; tâche @fullstack (v5 §2.6), pas du rendu : voir D3 |
| 4 | Césure : n'/l'/s'/t' jamais seuls, lignes à 40 % au moins, chiffre géant recalé | **Fait** | « qu'on / t'avait » (`charge/ig-conseil-2`), « il s'appelait » (`ig3-…-2`), plus petite ligne 52 % (`ig3-…-4`), chiffre géant supprimé |
| 5 | Trait d'union court | **Fait** | `charge/x-titre-stand-upper.png` : trait d'Inter, distinct d'un demi-cadratin |
| 6 | Titre à 4 lignes, écart au pied | **Fait** | `charge/x-titre-95-car.png` : 138 px ; `charge/linkedin-titre-95-car.png` : 85 px (plancher 64) |
| 7 | Gabarits décryptage (cartes 3 et 4) et relais à 2 cartes | **Fait** | `ig3-…-3.png` (surtitre intégré, 22 mots sur 30), `-4.png` (sans bouton, 32 mots sur 35), `ig-relais-blagues-ia-1/-2` |
| 8 | Amorce 88 px et bloc à 40 % | **Fait** | amorces 88 à 100 px ; bloc centré à 37,7 % (30 px au-dessus de 40 %, optiquement juste : goût) |
| 9 | Contrôle 390 px, vignette 3:4 | **Fait** | « Glisse → » à 100 px du bord, « à 52 px, rien coupé |

## 2. Conformité à la v5 §8 et aux duels

- **Formats** : 1080x1350 (Instagram), 1200x627 (couverture LinkedIn) ; vanne 2 cartes noir puis aplat, décryptage 4 cartes, relais 2 cartes : conforme. Pied sur les 11 cartes. « Glisse → » seulement en carte 1 (4 fois), jamais en carte 2, 3 ou 4.
- **Gagnants** : IG1 tuteur, IG2 **A mimes** (duels), IG3 **A Léa**, relais IA n°4 : conforme. X2 (C), X3 (A), L1, L2 (C), L3 (C) : texte seul, aucune carte attendue.
- **Légendes recomptées** : IG1 51, IG2 79 (variante « si A gagne » de §8), IG3 72, une seule occurrence de « lien en bio » : conforme. **Zéro tiret cadratin**, zéro IA hors sujet de la blague, `alt` = amorce + chute.
- Écart documentaire (hors rendu) : `strategie-relance-v5.md` §8 et §9 disent encore « IG2 retenu : C » ; les duels ont retenu A. À aligner par la session principale.

## 3. Notes V1 à V8 et K4

| Critère | Note (c3) | Preuve | Correction |
|---|---|---|---|
| V1 Arrêt du défilement | **10** (8) | `ig2-mimes-1.png` 3 lignes à environ 100 px ; `ig3-…-1.png` 88 px, bloc haut, noir dessous | aucune |
| V2 Lisibilité | **10** (9) | contrastes recalculés : blanc 7,1:1, `#A78BFA` 7,1:1, `#DDD6FE` 5,0:1 ; pied 11,5 px téléphone | aucune |
| V3 Typo française | **9,5** (8,5) | apostrophes ’, insécables, aucun orphelin ; mais espaces entre mots serrés devant « j » et « à » : « Au**jeu** » (`ig2-mimes-1`), « trois**jours** » (`ig3-…-1`, `-3`), « quiz**est** » (`ig3-…-4`), « demandé**à** » (`ig-relais-…-1`) | D2 |
| V4 Identité | **9,5** (9,5) | même police, aplat, monogramme, pied sur 11 cartes ; colonne de texte à 123 / 131 / 143-145 contre 96 pour pied et cartes 3-4 (saut de 20 px entre amorce et chute : `ig1-tuteur-1` puis `-2`) | D1 |
| V5 Mise en scène | **10** (9) | noir puis violet, chute isolée, « qui encadre le « dit » (`ig3-…-2.png`) | aucune |
| V6 Adaptation réseau | **10** (8) | 2 cartes relais, décryptage 4 cartes, LinkedIn sans « Glisse » ni pagination (`charge/ig-conseil-3`), couverture 1200x627 nette (`linkedin-article-se-presenter.png`) | aucune de rendu (Buffer : K4) |
| V7 Partage | **10** (8,5) | chute isolée, réplique capturable ; invitation « À envoyer à... » en légende, hors carte (v5) | légende du relais : D4 |
| V8 Conformité | **10** (7,5) | R6, bouton, comptes de caractères, plafonds 25/30/35 mots, zéro tiret cadratin | aucune |

**K4 : Instagram 9** (carrousels 2 et 4 images jamais passés dans Buffer ; légende du relais absente). **LinkedIn 10** : le lot est en texte seul, la seule image est la couverture unique ; le test multi-images ne concerne que le carrousel `charge/` du conseil, hors lot.

## 4. Défauts réels (à corriger) et dépendances

- **D1, réel, @fullstack, V4** : la colonne de texte des cartes vanne bouge (123 amorce 88 px, 131 amorce 100 px, 143-145 chute) parce que le « est calé à x = 52 et la colonne en dépend. Correction : colonne unique à x = 144 sur les 8 cartes vanne (« à 144 moins sa largeur et l'espace fine, soit environ 65-73, au-dessus des 48 px). Cartes 3 et 4, pied et surtitres restent à 96.
- **D2, réel mais à confirmer au zoom 390 px, @fullstack, V3** : Plus Jakarta 800 à tracking serré ferme l'espace avant « j » et « à ». Correction : `word-spacing: 0.06em` sur les cartes, puis relire `ig2-mimes-1`, `ig3-…-1`, `ig3-…-4`.
- **D3, réel, hors design, @fullstack** : test Buffer d'un brouillon Instagram à 2 et 4 images (v5 §2.6), consigné dans `REPLIT_ACTIONS.md`, avant le J0 d'Instagram. Si Buffer refuse : repli vers l'export du carrousel en PDF ou publication manuelle.
- **D4, hors design, @social** : légende du relais du 26/10 (80 caractères au plus, sans pied, « À envoyer à... », « lien en bio » une fois) encore `[À FOURNIR]`.

## 5. Goût, non bloquant (aucun point retiré)

Césure sémantique : « un groupe sans / moi » (`ig3-…-1`), « Le rapport / commence page 3 » (`ig1-tuteur-2`). Bloc d'amorce à 37,7 % et non 40 %. « Glisse → » sur les cartes 1 des vannes à 2 cartes (lecture « carrousel Instagram » acceptée, utile pour la chute). Grand vide noir sous l'amorce (445 px) : voulu.

**Conditions du GO** : D1 et D2 re-rendus puis relus sur les 8 cartes (V3 et V4 passent à 10), D3 consigné, D4 livré. Aucune autre exigence ne manque.
