# Contrôle bref Quoi répondre et Parcours v5, 20/11/2026

[LIVE] Préversion :5400 (espace ouvert), commit f8d640e5 (serveur démarré à 08:48, relevés de 08:49 à 08:59), Chromium, 375x812 et 1280x900 (plus 1920x1080 pour la grille), deviceScaleFactor 1. Scripts de v4 rejoués, mêmes définitions : 74 premiers écrans de trajet, 8 pleines pages à 1280, 22 clics sur des sous-étapes (14 capturés), 4 relevés de grille ; 98 captures. Ajouts de mesure : décalages > 8 px toutes zones et visibilité de `main` (au moins un texte de `main` visible dans la fenêtre, vérifié à chaque image) pendant les 2 s suivant chaque arrivée sur une page d'étape ; barre compacte et menu à 375. Aplat, vide, typographie, saut : définitions de v4. Écarts de trajet : voir SEQUENCES.md (1280 abonnés, capture 4 = « 1.2 », relevés recopiés de la sortie console car la préversion a été arrêtée par une reconstruction à 08:59).
## 1. Par séquence (n° de capture : valeur)
| Séquence | Aplats par écran | Vides > 32 (hauteur@y) | Typo hors échelle (main) |
|---|---|---|---|
| qr-visiteur-375 | 1/1/2/1 (« Tout ouvrir » ; 3 : « S'abonner » + point 6x6) | 3 : 33@648 | 3 (/abonnement), voir §6 |
| qr-visiteur-1280 | 1/1/2/1 | 1, 2, 4 : 33@357 ; 3 : 34, 33, 33, 49 | 3 (/abonnement) |
| qr-gratuit-375 | 1/1/2/1 | 3 : 33@600 | 3 (/abonnement) |
| qr-gratuit-1280 | 1/1/2/1 | 1, 2, 4 : 33@357 ; 3 : 34, 33, 35, 49 | 3 (/abonnement) |
| qr-abonne-en-cours-375, qr-nouvel-abonne-375 | 1/0/1/0/0 (« Voir », « Situation suivante ») | 1 : 33@117, 33@180 | 0 |
| qr-abonne-en-cours-1280, qr-nouvel-abonne-1280 | 0/0/1/0/0 | 0 | 0 |
| pa-visiteur-375, pa-gratuit-375 | 1/1/1/1 (« Tout ouvrir » de l'en-tête, 98x44) | 1 : 33@117, 34@371 | 0 |
| pa-visiteur-1280, pa-gratuit-1280 | 1/1/1/1 (idem, 188x44) | 1 : 34@275 | 0 |
| pa-abonne-en-cours-375 | 1/0/0/0/0/0 (« Reprendre » de la carte) | 1 : 33@117, 33@180 | 0 |
| pa-abonne-en-cours-1280 | 1/0/0/0/0 | 1 : 49@773 | 0 |
| pa-nouvel-abonne-375 | 1/0/0/0/0/0 (« Commencer l'étape 1 ») | 1 : 33@117, 57@180 | 0 |
| pa-nouvel-abonne-1280 | 1/0/0/0/0 | 1 : 49@647 | 0 |

Écarts avec v4 : vide sous le hero de l'aperçu à 1280 33 px (v4 49) ; pa-abonne-en-cours-1280 49@773 (v4 49@785) ; fiche abonné après « Essayé, ça a marché » à 1280 scrollY 230 (v4 236). Parcours 375, scrollY plus bas qu'en v4 : arrivée visiteur et gratuit 783 (867), abonné 639 (755), nouvel 820 (904) ; sous-étape 2.2 3097 (3889) et 3495 (4191). « Passer à l'étape 2 » : 740-788 sur 812 et 828-876 sur 900 ; « Tester l'étape 1 » au premier écran : 405-471 (375), 562-610 (1280). Inchangés sinon.
## 2. Ouverture d'une étape ou d'une sous-étape (trajets)
| Geste | Haut du bloc à 300 ms / 1 s / 2,5 s | Décalages > 8 px (hors défilement) |
|---|---|---|
| « Tester l'étape 1 » (visiteur, gratuit) | 375 : 192 / 192 / 192 ; 1280 : 137 / 137 / 137 | aucun |
| « Reprendre » ou « Commencer l'étape 1 », 375 | 178 / 178 / 178 | aucun |
| « Reprendre » ou « Commencer l'étape 1 », 1280 | 137 / 137 / 137 | aucun (v4 : « Le programme » +69 puis -162 ou -44, menu +95 ou +27) |
| Étape 2 dans le menu, 1280 | 137 / 137 / 137 | aucun (v4 : menu ligne 3 +152 ou ligne 2 -196) |
| Étape 2 dans le menu ouvert, 375 | 226 (avancé) ou 283 (nouvel) / 178 / 178 | aucun (v4 nouvel : menu -208, contenu +20) |
| Sous-étape 2.2 dans la page, 375 (2 trajets) | 1883, 1297 / 210 / 210 | aucun |
| Sous-étape 1.2 dans le menu, 1280 (2 trajets) | 488, 393 / 169 / 169 | aucun |
## 3. Arrivée sur une page d'étape : 2 s suivantes (nouvelles mesures)
| Arrivée | Décalages > 8 px, toutes zones (main, en-tête, menu, barre, pied), 0-2 s | `main` et pied |
|---|---|---|
| Clic (navigation sans rechargement), 8 trajets (4 comptes x 375 et 1280) : « Tester l'étape 1 », « Reprendre », « Commencer l'étape 1 » | 0 sur 8 | visibles sans interruption de 0 à 2,5 s (8/8) |
| Chargement direct /parcours/machine-a-cafe et /parcours/repartie, abonnés, 375 et 1280 (6 chargements) | 0 sur 6 | texte de `main` visible dès 140 à 166 ms, avant la première peinture (168 à 208 ms) dans 5 cas ; 1 cas (nouvel, 375, série page) : `main` présent sans texte visible de 126 à 173 ms, première peinture à 200 ms ; jamais invisible après la première peinture |

Changement d'étape et de sous-étape dans les trajets (§2) : 0 décalage > 8 px, toutes zones, dans les 2 s, à 375 et 1280 (séries du §4 : non mesuré).
## 4. Clic sur chaque sous-étape de l'étape 2 (22 clics)
| Série | Libellés affichés (ancres) | Bon bloc, haut à 2,5 s | scrollY par clic | Actives après clic | Ligne d'étape active |
|---|---|---|---|---|---|
| abonne-en-cours 1280 menu | 2.1, 2.2, 2.3 (2-1, 2-2, 2-3) | 3/3 (137, 169, 169) | 376, 1595, 1595 | 1 dans le menu, = cliquée (3/3) | 2 seule |
| abonne-en-cours 375 menu, puis page | idem | 3/3 (178, 210, 178) | 826, 3097, 3519 | 1 dans la page, = cliquée ; menu replié (3/3) | 2 seule |
| nouvel-abonne 1280 menu | 2.1 à 2.4 (2-1 à 2-4) | 4/4 (137, 169, 169, 137) | 625, 1796, 1796, 2239 | 1 dans le menu, = cliquée (4/4) | 2 seule |
| nouvel-abonne 375 menu, puis page | idem | 4/4 (178, 210, 178, 178) | 1344, 3495, 3877, 4238 | 1 dans la page ; menu replié (4/4) | 2 seule |

Positions distinctes à 375 : 2.2, 2.3, 2.4 sur trois scrollY différents (écarts 382 et 361 px, repartie ; 422 px, machine-a-cafe), dans le menu comme dans la page. À 1280, 2.2 et 2.3 partagent le même scrollY (1595, 1796). Ancre = numéro affiché (« 2.2 » → `#fiche-2-2`) dans les 22 clics ; titre du bloc = libellé de la ligne (22/22). Menu dépliable : liste les sous-étapes des 3 (ou 4) étapes (10 et 16 liens).
## 5. Barre compacte « Retour : Parcours » + menu, 375
| Compte | Bas de l'en-tête | Barre (collante, `top` 117) | « Retour : Parcours » | Bouton du menu | Étape amenée |
|---|---|---|---|---|---|
| abonnés (2 trajets, 4 séries) | 117 | 117-170 (53 px) dès que la page défile ; 149-202 à scrollY 0 (32 px sous l'en-tête) | 121-165, x 12-152 (44 px) | « Étape 3 sur 3 » 139x44 / « Étape 1 sur 4 » 136x44, x 220-359 | 178 (= bas de barre + 8) ; vidéo 2.2 : 210 |
| visiteur, gratuit | 117 | 117-184 (67 px) | 128-172 | « Étape 1 gratuite, la suite avec Premium », 2 lignes, 195x58, x 164-359 | 192 (= 184 + 8) |

Menu déplié (2 trajets) : x 16-359, haut 169 sous une barre 117-170 et 201 sous une barre 149-202 (1 px sur le filet bas de la barre), bas 773 et 805 sur 812. Menu replié après le choix d'une étape (2/2), d'une sous-étape (7/7 en série « menu ») ; à 1280, menu latéral toujours affiché.
## 6. Typographie hors `typo.ts`
`main` de l'espace : 0 texte hors échelle sur 74 premiers écrans et 8 pleines pages. /abonnement (capture 3 de qr-visiteur et qr-gratuit) : 36/700 ou 28/700, 24/700, 20/700, 18/400 (1280), 15/600, 13/400, 13/500 (visiteur seul), 12/400, 12/500, 12/600.
## 7. Aperçu de Quoi répondre sur la grille (visiteur et gratuit, 1280 et 1920 : valeurs identiques, identiques à v4)
12 colonnes de 57,3 px, gouttière 48, de 32 à 1248 (1280) et de 352 à 1568 (1920). « Coloc : la poêle » c1-c8 et « Où et avec qui ? » c9-c12 (326 px) ; « Pour quoi faire ? » c1-c12 (106) ; 3 tuiles c1-c4, c5-c8, c9-c12 (122) ; « La suite est dans Premium » c5 -37 / c8 +37 (448 px, centrée). 24 px entre les rangées, 48 avant la carte de fin.
## 8. Constats annexes, sans recommandation
1. Après un clic sur une autre étape (menu), l'URL garde l'ancre de départ (`#etape-3`, `#etape-1`), à 375 et 1280. 2. 1280 : la 2e sous-étape du menu est désormais « 1.2 » (le menu liste toutes les étapes) ; 1.2 et 1.3 côte à côte, même défilement (capture `pa-abonne-en-cours-1280-4`).
