# Contrôle bref Quoi répondre et Parcours v2, 19/11/2026

[LIVE] Préversion :5400, commit c710c4d6, Chromium, 375x812 et 1280x900, deviceScaleFactor 1. Mesures prises sur chacun des 66 premiers écrans capturés (`getBoundingClientRect`), plus les 8 pleines pages à 1280 pour la typographie. Échelle de référence (`typo.ts`) : tailles 14, 16, 20, 24 (375) ou 30 (1280), graisses 400 et 600. Aplat = fond violet plein (opacité ≥ 0,95) visible à l'écran, en-tête compris ; la pastille de la cloche (≤ 24 px) n'est pas comptée. Vide = bande horizontale sans texte, contrôle, filet ni bord de fond > 32 px, sous l'en-tête. Saut = décalage de mise en page > 8 px (API Layout Shift, défilement exclu) plus position du titre de l'étape ouverte à 300 ms, 1 s et 2,5 s.

## 1. Par séquence (n° de capture : valeur)

| Séquence | Aplats par écran | Vides > 32 (hauteur@y) | Typo hors échelle (main) |
|---|---|---|---|
| qr-visiteur-375 | 1/1/2/1 (« Tout ouvrir » ; 3 : « S'abonner » + point 6x6) | 3 : 33@648 | 3 (/abonnement), voir §3 |
| qr-visiteur-1280 | 1/1/2/1 (idem) | 1, 2, 4 : 49@356 (pastilles → « Voici un exemple ») ; 3 : 34, 33, 33, 49 | 3 (/abonnement) |
| qr-gratuit-375 | 1/1/2/1 | 3 : 33@600 | 3 (/abonnement) |
| qr-gratuit-1280 | 1/1/2/1 | 1, 2, 4 : 49@365 ; 3 : 34, 33, 35, 49 | 3 (/abonnement) |
| qr-abonne-en-cours-375 | 1/0/1/0/1 (« Voir », « Situation suivante ») | 1 : 33@117 (en-tête → H1), 33@180 (H1 → carte) | 0 |
| qr-abonne-en-cours-1280 | 0/0/1/0/0 (« Situation suivante ») | 0 | 0 |
| qr-nouvel-abonne-375 | 1/0/1/0/1 | 1 : 33@117, 33@180 | 0 |
| qr-nouvel-abonne-1280 | 0/0/1/0/0 | 0 | 0 |
| pa-visiteur-375 | 1/1/1/1 (« Tout ouvrir » de l'en-tête, 98x44) | 1 : 33@117, 34@371 (→ « Tester l'étape 1 ») | 0 |
| pa-visiteur-1280 | 1/1/1/1 (idem, 188x44) | 1, 4 : 34@275 | 0 |
| pa-gratuit-375 | 1/1/1/1 | 1 : 33@117, 34@371 | 0 |
| pa-gratuit-1280 | 1/1/1/1 | 1, 4 : 34@275 | 0 |
| pa-abonne-en-cours-375 | 1/0/0/0/0/0 (« Reprendre » de la carte) | 1 : 33@117, 33@180 | 0 |
| pa-abonne-en-cours-1280 | 1/0/0/0/0 | 1 : 49@785 (carte → « Les parcours ») | 0 |
| pa-nouvel-abonne-375 | 1/0/0/0/0/0 (« Commencer l'étape 1 ») | 1 : 33@117, 57@180 (H1 → « Étape conseillée ») | 0 |
| pa-nouvel-abonne-1280 | 1/0/0/0/0 | 1 : 49@647 (carte → « Les parcours ») | 0 |

Maximum : 1 aplat par écran dans l'espace (aucun écran à 2) ; 2 sur /abonnement (bouton et point de 6x6). Pages d'étape (Parcours, captures 2 et suivantes) : 0 aplat chez les abonnés, 1 (en-tête) chez visiteur et gratuit. Le bouton « Reprendre » du menu d'étapes (en contour) n'est pas un aplat.

## 2. Ouverture d'une étape

| Geste | Titre de l'étape ouverte à 300 ms / 1 s / 2,5 s | Décalages > 8 px (hors défilement) |
|---|---|---|
| « Reprendre » / « Commencer l'étape 1 », 375 (2 abonnés) | 137 / 137 / 137 | aucun |
| idem, 1280 | 137 / 137 / 137 | pendant le chargement, à 101-126 ms : contenu « Le programme » +93 puis -186 et « Retour : Parcours » -174 (avancé), « Le programme » +93 (nouvel) ; menu, ligne 1 +95 / +27. Aucun après 300 ms |
| « Tester l'étape 1 » (visiteur, gratuit, 375 et 1280) | 137 / 137 / 137 | aucun |
| Autre étape dans le menu, 1280 | 137 / 137 / 137 (sans défilement visible) | menu seul : ligne suivante +240 (avancé) / -240 (nouvel), sous-étapes déplacées sous la nouvelle ligne active ; contenu : 0 |
| Autre étape dans le menu ouvert, 375 | 404 puis 221 / 137 / 137 (défilement animé) | avancé : aucun ; nouvel, à 49 ms : contenu « Le programme » +20, menu -252 et +20 |
| Sous-étape « 2.2 », 4 trajets | 419, 402, 1144, 1067 / 240 / 240 (défilement animé, haut de l'ancre à 240) | aucun |

## 3. Typographie hors `typo.ts`

Espace (`main`) : 0 texte hors échelle sur les 66 premiers écrans et les 8 pleines pages. Hors espace, sur /abonnement (capture 3 de qr-visiteur et qr-gratuit, page partagée avec le site fermé) : 36/700 et 28/700 (375) « Premium ouvre tout », « Deviens Marrant » ; 24/700 « Le carnet, en vrai » ; 20/700 « 1,99 € », « 16,99 € » ; 18/400 « Les listes ne s'arrêtent plus… » (1280) ; 15/600 « ✓ », « Tout le catalogue, du boulot… », « Les 5 parcours… », « Chaque mois, un carnet… », « S'abonner · 1,99 €/mois » (375) ; 13/400 « D'abord ton compte, puis le… », « Déjà un compte ? » (visiteur), « Paiement sécurisé par Stripe » (gratuit, 1280) ; 13/500 « Connecte-toi » ; 12/400 « TTC / mois », « TTC / an », « soit 1,42 € par mois », « Renouvelé chaque année… » ; 12/600 « plus de 3 mois offerts » ; 12/500 « On te dit ».

## 4. « Tester l'étape 1 » au premier écran de /parcours, 375

Visiteur : oui (lien `tester-etape-1-mobile`, y 405-471, écran de 812). Gratuit : oui (405-471). Pour mémoire à 1280 : 562-610 sur 900, deux comptes.

## 5. Constats annexes, sans recommandation

1. Sous-étape « 2.2 Vannes à pratiquer » (machine-a-cafe et repartie, 375 et 1280) : l'ancre `#fiche-2-2` est posée juste avant « Pour aller plus loin, facultatif » (vidéos) ; aucun titre « Vannes » dans l'étape 2. Les captures 4 (1280) et 5 (375) s'ouvrent sur ce bloc.
2. Après un clic sur une autre étape dans le menu, l'URL garde l'ancre de départ (`#etape-3` ou `#etape-1`).
3. À 375, le menu reste ouvert après le choix d'une étape (4 trajets).
