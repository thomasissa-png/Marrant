# Contrôle bref Quoi répondre et Parcours v4, 20/11/2026

[LIVE] Préversion :5400 (espace ouvert), commit e2e0e017, Chromium, 375x812 et 1280x900 (plus 1920x1080 pour la grille), deviceScaleFactor 1. Scripts de v3 rejoués sans changement de définition : 74 premiers écrans de trajet, 8 pleines pages à 1280 (typographie), 22 clics sur des sous-étapes (14 capturés), plus 4 relevés de grille. Échelle `typo.ts` : 14, 16, 20, 24 (375) ou 30 (1280), graisses 400 et 600. Aplat = fond violet plein (opacité ≥ 0,95) visible, en-tête compris, hors pastille de la cloche. Vide = bande sans texte, contrôle, filet ni bord de fond > 32 px sous l'en-tête. Saut = décalage > 8 px (Layout Shift, défilement exclu) et haut du bloc ouvert à 300 ms, 1 s, 2,5 s.
## 1. Par séquence (n° de capture : valeur)
| Séquence | Aplats par écran | Vides > 32 (hauteur@y) | Typo hors échelle (main) |
|---|---|---|---|
| qr-visiteur-375 | 1/1/2/1 (« Tout ouvrir » ; 3 : « S'abonner » + point 6x6) | 3 : 33@648 | 3 (/abonnement), voir §4 |
| qr-visiteur-1280 | 1/1/2/1 | 1, 2, 4 : 49@357 ; 3 : 34, 33, 33, 49 | 3 (/abonnement) |
| qr-gratuit-375 | 1/1/2/1 | 3 : 33@600 | 3 (/abonnement) |
| qr-gratuit-1280 | 1/1/2/1 | 1, 2, 4 : 49@357 ; 3 : 34, 33, 35, 49 | 3 (/abonnement) |
| qr-abonne-en-cours-375 | 1/0/1/0/0 (« Voir », « Situation suivante ») | 1 : 33@117, 33@180 | 0 |
| qr-abonne-en-cours-1280 | 0/0/1/0/0 | 0 | 0 |
| qr-nouvel-abonne-375 | 1/0/1/0/0 | 1 : 33@117, 33@180 | 0 |
| qr-nouvel-abonne-1280 | 0/0/1/0/0 | 0 | 0 |
| pa-visiteur-375 | 1/1/1/1 (« Tout ouvrir » de l'en-tête, 98x44) | 1 : 33@117, 34@371 | 0 |
| pa-visiteur-1280 | 1/1/1/1 (idem, 188x44) | 1 : 34@275 | 0 |
| pa-gratuit-375 | 1/1/1/1 | 1 : 33@117, 34@371 | 0 |
| pa-gratuit-1280 | 1/1/1/1 | 1 : 34@275 | 0 |
| pa-abonne-en-cours-375 | 1/0/0/0/0/0 (« Reprendre » de la carte) | 1 : 33@117, 33@180 | 0 |
| pa-abonne-en-cours-1280 | 1/0/0/0/0 | 1 : 49@785 | 0 |
| pa-nouvel-abonne-375 | 1/0/0/0/0/0 (« Commencer l'étape 1 ») | 1 : 33@117, 57@180 | 0 |
| pa-nouvel-abonne-1280 | 1/0/0/0/0 | 1 : 49@647 | 0 |

Aplats, vides et typographie : valeurs identiques à v3 sur les 74 écrans. Seuls les scrollY changent : fiche abonné après « Essayé, ça a marché » 669 (375) et 236 (1280), v3 665 et 232 ; trajets Parcours abonnés 24 px plus haut à l'arrivée (ex. 755 au lieu de 779), 56 px plus haut sur la sous-étape (3889, 1591, 4191, 1792). « Passer à l'étape 2 » : 740-788 sur 812 et 828-876 sur 900 ; « Tester l'étape 1 » au premier écran : 405-471 (375), 562-610 (1280).
## 2. Ouverture d'une étape ou d'une sous-étape (trajets)
| Geste | Haut du bloc à 300 ms / 1 s / 2,5 s | Décalages > 8 px (hors défilement) |
|---|---|---|
| « Tester l'étape 1 » (visiteur, gratuit, 375 et 1280) | 137 / 137 / 137 | aucun |
| « Reprendre », 375 | 137 / 137 / 137 | aucun (v3 : 3 à 121 ms) |
| « Commencer l'étape 1 », 375 | 137 / 137 / 137 | aucun |
| « Reprendre », 1280 | 137 / 137 / 137 | 185 ms : « Le programme » +69 ; 211 ms : « Le programme » -162, menu ligne 1 +95, ligne 3 +12 |
| « Commencer l'étape 1 », 1280 | 137 / 137 / 137 | 139 ms : « Le programme » +69 ; 200 ms : -44, menu ligne 1 +27 |
| Étape 2 dans le menu, 1280 | 137 / 137 / 137 | menu seul, 40-41 ms : ligne 3 +152 (avancé), ligne 2 -196 (nouvel) ; contenu : 0 |
| Étape 2 dans le menu ouvert, 375 | 367 (avancé) ou 205 (nouvel) / 137 / 137 | avancé : aucun ; nouvel, 30 ms : menu ligne 2 -208, lignes 3, 4, « Commencer » +20, contenu « Le programme » +20 |
| Sous-étape « 2.2 » (`#fiche-2-3`), 4 trajets | 1163, 427, 1107, 407 / 169 / 169 | aucun |
## 3. Clic sur chaque sous-étape de l'étape 2 (22 clics)
| Série | Libellés affichés (ancres) | Bon bloc, haut à 2,5 s | Actives après clic | Ligne d'étape active |
|---|---|---|---|---|
| abonne-en-cours 1280 menu | 2.1, 2.2, 2.3 (2-1, 2-3, 2-4) | 3/3 (137, 169, 169) | 1 dans le menu, = cliquée (3/3) | 2 seule |
| abonne-en-cours 375 menu | idem | 3/3 (137, 169, 137) | 1 menu + 1 page, même fiche (3/3) | 2 seule |
| abonne-en-cours 375 page | idem | 3/3 (137, 169, 137) | idem (3/3) | 2 seule |
| nouvel-abonne 1280 menu | 2.1 à 2.4 (2-1, 2-3, 2-4, 2-5) | 4/4 (137, 169, 169, 137) | 1 dans le menu, = cliquée (4/4) | 2 seule |
| nouvel-abonne 375 menu | idem | 4/4 (137, 169, 137, 137) | 1 + 1 (page), même fiche (4/4) | 2 seule |
| nouvel-abonne 375 page | idem | 4/4 (137, 169, 137, 137) | idem (4/4) | 2 seule |

Numérotation : continue dans le menu et dans la liste de la page (plus de 2.2 manquant), sur l'étape 2 seule mesurée. Actif mesuré par `data-fiche-active` et `aria-current`, toujours sur le même lien ; titre du bloc = libellé de la ligne dans les 22 cas. Haut 169 = carte vidéo, son titre de section « Pour aller plus loin, facultatif » visible au-dessus (captures `ss-*-2`, `pa-*-375-5`).
## 4. Typographie hors `typo.ts`
`main` de l'espace : 0 texte hors échelle sur 74 premiers écrans et 8 pleines pages. Hors espace, /abonnement (capture 3 de qr-visiteur et qr-gratuit) : relevé identique à v3 : 36/700 ou 28/700, 24/700 (« Le carnet, en vrai », présent aussi en v3, non listé alors), 20/700, 18/400, 15/600, 13/400, 13/500, 12/400, 12/500, 12/600.
## 5. Aperçu de Quoi répondre sur la grille (visiteur et gratuit, valeurs identiques)
Grille de la spec : 12 colonnes de 57,3 px, gouttière 48, du bord gauche du texte du hero (32 à 1280, 352 à 1920) au bord droit de la carte d'offre (1248, 1568) ; c1 = gauche de la 1re colonne, c12 = droite de la 12e. Mêmes bords à 1280 et 1920 :
- exemple « Coloc : la poêle » c1-c8 et « Où et avec qui ? » c9-c12 (326 px chacune) ; « Pour quoi faire ? » c1-c12 (106) ; 3 tuiles fermées c1-c4, c5-c8, c9-c12 (122 chacune) ;
- « La suite est dans Premium » (`data-apercu-fin`, 448 px, centrée) : c5 -37 px / c8 +37 px, hors grille.
Gouttières horizontales 48 dans chaque rangée, 0 px de vide sous une carte de rangée, 24 px entre les trois rangées, 48 avant la carte de fin.
## 6. Constats annexes, sans recommandation
1. Ancres non renumérotées (« 2.2 » → `#fiche-2-3`, « 2.3 » → `#fiche-2-4`, « 2.4 » → `#fiche-2-5`). 1280 : cartes vidéo 2.2 et 2.3 côte à côte, même défilement pour les deux clics (1591 machine-a-cafe, 1792 repartie).
2. Après un clic sur une autre étape, l'URL garde l'ancre de départ (`#etape-3`, `#etape-1`) ; à 375, le menu reste ouvert après le choix d'une étape (2 trajets) et d'une sous-étape (4 séries).
3. Vignette vidéo : titre incrusté à 1280, absent de la vignette à 375 (`pa-abonne-en-cours-375-5`).
