# Contrôle final Quoi répondre et Parcours, 19/11/2026

[LIVE] Préversion locale http://localhost:5400 (commit 090d8033), Chromium (Playwright), deviceScaleFactor 1, `load` + 1,5 s, `getBoundingClientRect`, échantillons à 300 ms, 1 s et 2,5 s après chaque geste. Largeurs 375x812, 768x1024, 1024x768, 1280x900, 1920x1080. `comptes.sh` avant chaque trajet abonné et à la fin. Scripts : `scratchpad/t4/` (`ctrl-qr.js`, `ctrl-pa.js`, `seq.js`, repris de t3 et t2r).

## 1. Contrôle des points corrigés au tour 3

| Point | Critère | Mesure | Statut |
|---|---|---|---|
| QR N1, 1024 | haut du H1 ≥ 144 après retour navigateur, 2 abonnés | 1er retour (liste `?ou=soiree`) : 169 / 169 / 169 ; 2e retour (3e fiche) : 169 ; en-tête 121, scrollY 9 ; avant correction : 37 | PASS |
| QR N1, 1280 | idem | 169 aux deux retours, 2 abonnés ; avant correction : 115 | PASS |
| QR N2, vide de fin de la carte d'exemple | ≤ 24, visiteur et gratuit, 5 largeurs | 0 aux 10 mesures (padding 24) ; avant : 41 / 41 / 115 / 159 / 159 | PASS |
| QR N2, blanc sous la carte à 1024 | mesure | 98 (carte 320 de haut à côté de « Où et avec qui ? » 394 : 74, puis gouttière 24) ; 1280, 1920 : 24 (la carte est la plus haute de sa rangée, la voisine finit 34 plus haut) | mesuré |
| QR N3, 375, ligne n° 7 (critère du test) | ligne restaurée entière sous l'en-tête | bouton « Retour » et retour navigateur : entière (401-459, en-tête 117), scrollY 771 = quitté, 2 abonnés | PASS |
| QR N3, 768, ligne n° 7 | idem | entière (914-970), scrollY 40 = quitté (liste courte : la ligne 7 est en bas d'écran) | PASS |
| QR N3, ligne collée sous l'en-tête (n° 68 sur 70) | idem | 375 : entière, haut 128 (en-tête 117), scrollY 6514 contre 6521 quitté ; 768 : haut 128 (en-tête 121), 4500 contre 4503 ; bouton et navigateur, 2 abonnés | PASS |
| PA « Reprendre » → étape | haut 137 ± 2, 5 largeurs | 137 à 300 ms, 1 s et 2,5 s, 2 abonnés, 5 largeurs (avancé : `#etape-3` ; nouvel : « Commencer l'étape 1 », `#etape-1`) ; avant : 265 | PASS |
| PA étape suivante | haut 137 ± 2 | 137 à 1 s et 2,5 s, 10 trajets (avancé 2 → 3, nouvel 1 → 2) | PASS |
| PA retour → carte | haut 137 ± 2 | 137 à 300 ms, 1 s, 2,5 s, 10 trajets (« Retour : Parcours ») | PASS |
| PA « Reprendre » sur la page d'un parcours, 375 | 0 visible | 0, 4 comptes (aussi 0 à 768) ; dès 1024 : 1 (avancé, y 478, colonne de progression) | PASS |

## 2. Vides > 32 px restants (4 comptes, 5 largeurs)

Gratuit = visiteur à toutes les largeurs (mêmes valeurs au pixel). « Bande » = bande verticale sans contenu au premier écran ; « entre » = écart entre deux blocs de la page entière.

### /parcours
| Vide | 375 | 768 | 1024 | 1280 | 1920 | Comptes |
|---|---|---|---|---|---|---|
| Bande sous l'en-tête (avant le H1) | 33 | 33 | - | - | - | 4 |
| Chapô → 1re carte | 34 | 34 | 34 | 34 | 34 | visiteur, gratuit |
| « Tes 4 premières semaines » → « Les parcours » (page entière) | 48 | 48 | 48 | 48 | 48 | 2 abonnés |
| Bandes du premier écran, avancé | 33 (180-213, « Parcours » → « Nouveau cap »), 49 (597-646) | 33 (184-217), 50 (577-627) | 0 | 49 (837-886) | 49 (837-886) | avancé |
| Bandes du premier écran, nouvel | 57 (180-237, « Parcours » → « Étape conseillée ») | 57 (184-241), 49 (860-909) | 44 (724-768, bas d'écran) | 49 (647-696) | 49 (647-696) | nouvel |
| Entre sections de bas de page (cartes → « Quel parcours est fait pour toi », → « Explore aussi », → « Questions fréquentes ») | 48 x 3 | 48 x 3 | 48 x 3 | 48 x 3 | 48 x 3 | 4 |
| Vide de fin de carte > 32 ; colonnes décalées > 32 | 0 | 0 | 0 | 0 | 0 | 4 |

### /parcours/<slug> (avancé : machine-a-cafe ; nouvel : repartie ; visiteur, gratuit : machine-a-cafe)
| Vide | 375 | 768 | 1024 | 1280 | 1920 | Comptes |
|---|---|---|---|---|---|---|
| Bande sous l'en-tête | - | 33 | 33 | 33 | 33 | 4 |
| Autres bandes de 33-34 au premier écran | avancé 34 (243-277), 33 (583-616) | avancé 33 (507-540) ; nouvel 33 (751-784) | - | - | - | abonnés |
| Fil d'Ariane → « Étape 1 gratuite » | 34 | 34 | - | - | - | visiteur, gratuit |
| Bande dans la carte de progression (251-285) | 34 (243-277) | 34 | 34 | 34 | 34 | avancé |
| « Envie d'un rappel » ou fil d'Ariane → « Le programme » | - | - | 56 | 56 | 56 | avancé, nouvel |
| « 0 sur 3 étapes » → « 0 XP gagné » | - | - | 45 | 38 | 38 | nouvel |
| Bandes du premier écran, visiteur et gratuit (dont la ligne précédente) | 34 | 34, 33, 47, 44 | 33, 33, 47 | 33, 33, 47, 44 | idem 1280 | visiteur, gratuit |
| « Exercice pratique » → bloc suivant | 45 | 45 | 45 | 45 | 45 | 4 |
| « Pour aller plus loin » → « Petit quiz » | 37 | 37 | 37 | 37 | 37 | 4 |
| Quiz : pastille de lettre (24) à côté d'une réponse sur plusieurs lignes | 44 à 92 | - | - | - | - | 4 |
| Vide de fin de carte > 32 | 0 | 0 | 0 | 0 | 0 | 4 |

## 3. Écarts restants, classés (sans recommandation)
1. Parcours, corps d'étape ouverte : 45 et 37 px entre blocs, 4 comptes, 5 largeurs (identique au tour 2).
2. /parcours/<slug> dès 1024, abonnés : 56 px avant « Le programme » ; bande de 57 au premier écran (avancé 665-722, nouvel 585-642).
3. /parcours, abonnés : 48 px entre « Tes 4 premières semaines » et « Les parcours » (5 largeurs) ; bande de 49-50 au premier écran à 375, 768 (avancé), 768 (nouvel), 1280 et 1920 (2 abonnés) ; nouvel 375, 768 : 57 entre « Parcours » et « Étape conseillée ».
4. /parcours et slug, 375 à 768 : bande de 33-34 sous l'en-tête ou sous le fil d'Ariane ; chapô → 1re carte 34 (visiteur, gratuit, 5 largeurs).
5. Quoi répondre, aperçu à 1024 : blanc de 98 sous la carte d'exemple (rangée alignée sur la colonne voisine, plus haute de 74).
6. Quoi répondre, aperçu : vide de fin 50 sur les cartes « Rattraper un faux pas », « L'erreur que tout le monde… », « Comment choisir » (768 à 1920 ; 375 : 1 carte), hors critère N2.
7. Parcours, compte avancé : l'étape reprise (3) est la dernière, sans lien « étape suivante » ; la suivante n'est atteignable qu'en rouvrant l'étape 2 (1 clic de plus), 5 largeurs.
8. Mouvements animés : retour vers une ligne lointaine de Quoi répondre à 375 (scrollY 1582 à 300 ms, 6317 à 1 s, 6514 à 2,5 s) ; étape suivante de Parcours encore hors écran à 300 ms (haut -234 à -1391), à 137 dès 1 s.
9. Quoi répondre, retour à 375 et 768 : position rendue 3 à 7 px au-dessus du scrollY quitté (ligne entière, dans la tolérance de 40 du test).

## 4. Jeu de relecture à l'aveugle
78 captures : 70 premiers écrans en 16 séquences (`qr-` 4 ou 5 par séquence, `pa-` 4 ou 5) et 8 pleines pages d'arrivée à 1280 (`qr-<compte>-1280-pleine.png`, `pa-<compte>-1280-pleine.png`). Actions entre captures : `SEQUENCES.md`. Aucune annotation.
