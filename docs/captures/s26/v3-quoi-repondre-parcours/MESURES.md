# Contrôle bref Quoi répondre et Parcours v3, 19/11/2026

[LIVE] Préversion :5400 (espace ouvert), commit 26f283cd, Chromium, 375x812 et 1280x900, deviceScaleFactor 1. Mêmes scripts et définitions que v2 : mesures sur chacun des 66 premiers écrans de trajet (`getBoundingClientRect`), plus les 8 pleines pages à 1280 pour la typographie, plus 22 clics sur des sous-étapes (14 capturés). Échelle `typo.ts` : 14, 16, 20, 24 (375) ou 30 (1280), graisses 400 et 600. Aplat = fond violet plein (opacité ≥ 0,95) visible, en-tête compris, hors pastille de la cloche (≤ 24 px). Vide = bande sans texte, contrôle, filet ni bord de fond > 32 px sous l'en-tête. Saut = décalage > 8 px (API Layout Shift, défilement exclu), plus haut du titre ouvert à 300 ms, 1 s et 2,5 s.

## 1. Par séquence (n° de capture : valeur)
| Séquence | Aplats par écran | Vides > 32 (hauteur@y) | Typo hors échelle (main) |
|---|---|---|---|
| qr-visiteur-375 | 1/1/2/1 (« Tout ouvrir » ; 3 : « S'abonner » + point 6x6) | 3 : 33@648 | 3 (/abonnement), voir §4 |
| qr-visiteur-1280 | 1/1/2/1 (idem) | 1, 2, 4 : 49@357 ; 3 : 34, 33, 33, 49 | 3 (/abonnement) |
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

Maximum : 1 aplat par écran dans l'espace ; 2 sur /abonnement. Écart avec v2 : capture 5 de qr-*-375 (liste après « Retour ») à 0 aplat (v2 : 1), défilée à 391 et 363. Fin d'étape 1 (capture 3, visiteur et gratuit) : « Passer à l'étape 2 » à 740-788 sur 812 (375, scrollY 4063) et 828-876 sur 900 (1280, scrollY 2099) ; 1 aplat (en-tête), 0 vide. « Tester l'étape 1 » au premier écran de /parcours : 405-471 (375), 562-610 (1280).

## 2. Ouverture d'une étape ou d'une sous-étape (trajets)
| Geste | Titre ouvert à 300 ms / 1 s / 2,5 s | Décalages > 8 px (hors défilement) |
|---|---|---|
| « Tester l'étape 1 » (visiteur, gratuit, 375 et 1280) | 137 / 137 / 137 | aucun |
| « Reprendre », 375 | 137 / 137 / 137 | à 121 ms, chargement : « Le programme » -424, « Retour : Parcours » -572, « Étape 3 sur 3 » -356 |
| « Commencer l'étape 1 », 375 | 137 / 137 / 137 | aucun |
| « Reprendre » / « Commencer », 1280 | 137 / 137 / 137 | à 91-106 ms : « Le programme » -200 (avancé), +93 (nouvel) ; 3.1 +16 ; menu +95/+12 (avancé), +27 (nouvel). Aucun après 300 ms |
| Étape 2 dans le menu, 1280 | 137 / 137 / 137 | menu seul, 27-28 ms : ligne 3 +152 (avancé), ligne 2 -196 (nouvel) ; contenu : 0 |
| Étape 2 dans le menu ouvert, 375 | 367 (avancé) ou 221 (nouvel) / 137 / 137 | avancé : aucun ; nouvel, 45 ms : menu -208 puis +20 (lignes 3, 4, « Commencer »), contenu « Le programme » +20 |
| Sous-étape « 2.3 », 4 trajets | 1156, 409, 1099, 389 / 137 / 137 | 1280 avancé, 22 ms : menu +12 (2.4, ligne 3, « Reprendre ») ; autres : aucun |

## 3. Clic sur chaque sous-étape de l'étape 2 (22 clics)
| Série | Sous-étapes | Bon bloc (haut à 2,5 s) | Sous-étapes actives après clic | Ligne d'étape active |
|---|---|---|---|---|
| abonne-en-cours 1280 menu | 2.1, 2.3, 2.4 | 3/3 (137) | 1 dans le menu, = sous-étape cliquée (3/3) | 2 seule |
| abonne-en-cours 375 menu | idem | 3/3 (137) | 1 dans le menu + 1 dans la liste de la page, même fiche (3/3) | 2 seule |
| abonne-en-cours 375 page | idem | 3/3 (137) | idem (3/3) | 2 seule |
| nouvel-abonne 1280 menu | 2.1, 2.3, 2.4, 2.5 | 4/4 (137) | 1 dans le menu, = cliquée (4/4) | 2 seule |
| nouvel-abonne 375 menu | idem | 4/4 (137) | 1 + 1 (page), même fiche (4/4) | 2 seule |
| nouvel-abonne 375 page | idem | 4/4 (137) | idem (4/4) | 2 seule |

Actif mesuré par `data-fiche-active` et `aria-current`, toujours sur le même lien. Bloc = `#fiche-2-k`, son titre (ou la carte vidéo) correspond au libellé de la ligne dans les 22 cas. Aucune ligne 2.2 dans les deux étapes 2.

## 4. Typographie hors `typo.ts`
Espace (`main`) : 0 texte hors échelle sur les 66 premiers écrans et les 8 pleines pages (captures `ss-*` non mesurées en typographie). Hors espace, /abonnement (capture 3 de qr-visiteur et qr-gratuit) : mêmes valeurs que v2 (36/700 ou 28/700, 20/700, 18/400, 15/600, 13/400, 13/500, 12/400, 12/500, 12/600).

## 5. Constats annexes, sans recommandation
1. 1280 : les cartes vidéo 2.3 et 2.4 sont côte à côte ; leurs deux clics donnent le même défilement (1647 machine-a-cafe, 1848 repartie). À 375 et 1280, le titre « Pour aller plus loin, facultatif » est coupé sous l'en-tête quand la carte 2.3 arrive à 137.
2. `ss-abonne-en-cours-1280-menu-1` : la ligne 2.3 sous le pointeur garde l'aspect survol (fond + soulignement) ; l'état actif mesuré est 2.1 seul.
3. Après un clic sur une autre étape dans le menu, l'URL garde l'ancre de départ (`#etape-3`, `#etape-1`) ; à 375, le menu reste ouvert après le choix d'une étape (2 trajets) et d'une sous-étape (4 séries).
4. Menu replié à 375 : « Étape 3 sur 3 » et « Étape 1 sur 4 » (v2 : « 2 sur 3 étapes », « 0 sur 4 étapes »).
