# Tour 3 : mesures de Quoi répondre (liste + détail), 19/11/2026

[LIVE] Préversion locale http://localhost:5400 (commit cb71b39d), Chromium (Playwright), deviceScaleFactor 1, `load` + 1,5 s, `getBoundingClientRect`. Protocole et scripts du tour 2 (`trajet.js`, `qa-browser.js`), plus : clic sur l'offre de la page puis retour (visiteur, gratuit), bouton d'offre de l'en-tête (`offre.js`, 320 à 1280), vide de fin des cartes de l'aperçu (`vide.js`), retour navigateur dès 1024 (`retour.js`), codes HTTP (`codes.js`). Largeurs 375x812, 768x1024, 1024x768, 1280x900, 1920x1080 ; bouton d'offre aussi à 320x568 et 360x780. `comptes.sh` avant chaque trajet abonné et à la fin.
Non recomptés (clos par l'orchestrateur) : vide sous une liste filtrée courte ; aplats au premier écran de la fiche (règle « au plus un ») ; `/fiche/situation` sans préfixe ; graisses de l'en-tête ; 48 px hero / légende.

## A. Table §8 et trajet abonné (les 2 abonnés identiques sauf mention)
| Mesure | 375 | 768 | 1024 | 1280 | 1920 |
|---|---|---|---|---|---|
| Liste / gouttière / panneau | panneau 343 | 720 | 320 / 24 / 632 | 360 / 32 / 824 | 360 / 32 / 824 |
| Haut liste - haut fiche ; écart lignes de base ; blanc à droite | - ; - ; 0 | - ; - ; 0 | 0 ; 0 ; 0 | 0 ; 0 ; 0 | 0 ; 0 ; 0 |
| Hauteur liste (arrivée) ; haut collé à scrollY 150 | - | - | 600 ; 144 | 732 ; 144 | 912 ; 144 |
| Fin des cartes A et B | 24 | 24 | 24 | 24 | 24 |
| Ligne / Situation suivante / Retour (px) | 56 / 48 / 44 | 56 / 48 / 44 | 44 / 48 / - | 44 / 48 / - | 44 / 48 / - |
| Étape 2, 3e fiche : scrollY | 24 -> 24 (nouvel 0 -> 0) | 0 -> 0 | 0 -> 0 | 0 -> 0 | 0 -> 0 |
| Étape 3, « Fait » : scrollY | 697 -> 665 | 0 -> 164 | 439 -> 439 | 0 -> 200 | 0 -> 20 |
| Étape 4, Situation suivante | 665 -> 0 | 164 -> 0 | 439 -> 0 | 200 -> 0 | 20 -> 9 |
| Étape 5, Soirée puis fiche : scrollY / haut du panneau | 502 -> 0 | 206 -> 0 | 141 -> 9 / 144 | 63 -> 9 / 144 | 0 -> 0 / 153 |
| Étape 6, retour (bouton < 1024, navigateur dès 1024) | 502 -> 502, 6 lignes | 206 -> 206, 6 lignes | 141 -> 141 | 63 -> 63 | 0 -> 0 |
| Retour dès 1024 : haut du panneau / haut du H1 (bas de l'en-tête 121) | - | - | 12 / 37 | 90 / 115 | 153 / 178 |
Dès 1024 : `aria-current` = 1 à chaque étape, scrollTop liste 0, même nœud de liste ; repli refermé après « Soirée » (0 ouvert, 5 largeurs) ; corps de liste 381 (1024), 369 (1280, 1920) ; clics jusqu'à la fiche filtrée 3 dès 1024, 4 dessous. Historique (2 retours) : dès 1024 `?ou=soiree` puis `coloc-tu-en-as-pour-longtemps` ; dessous `/mon-espace/quoi-repondre` puis la même fiche. Typo dans `main` : 14, 16, 20, 24, 30 ; 400, 600 ; 0 capitale ; « 1 500+ » : 0 (HTML et RSC, 4 comptes, liste et fiche). « Situation suivante » après « Fait » : bas à 900 / 900 (1280), 1080 / 1080 (1920), 765 / 768 (1024), comme au tour 2.

## B. Aperçu (visiteur, gratuit)
| Mesure | 375 | 768 | 1024 | 1280 | 1920 |
|---|---|---|---|---|---|
| Bas texte hero / bas carte d'offre, visiteur | empilé | carte sous le texte | 371 / 376 (5) | 335 / 356 (21) | 335 / 356 (21) |
| idem, gratuit | empilé | carte sous le texte | 371 / 397 (26) | 335 / 365 (30) | 335 / 365 (30) |
| Tuile fermée : scrollY ; contour 2 px violet | 1017 -> 120 ; à 600 ms | 179 -> 179 ; à 100 ms | 95 -> 8 ; à 600 ms | 0 -> 0 ; à 100 ms | 0 -> 0 ; à 100 ms |
| Clic « Tout ouvrir · 1,99 €/mois » : arrivée /abonnement, scrollY | 68 (H1 coupé par l'en-tête) | 0 | 0 | 0 | 0 |
| Retour navigateur : scrollY = position quittée | 120 = 120 | 179 = 179 | 8 = 8 | 0 = 0 | 0 = 0 |
| Vide de fin, carte de l'extrait (padding 24) | 41 | 41 | 115 | 159 | 159 |
Gratuit : mêmes valeurs à ±20 px de scrollY. Contour retiré à 2,1 s ; 0 navigation ; focus sur `body`. Autres vides de fin > 24 : cartes « Rattraper un faux pas » et « Comment choisir » 52 (768, 1024). Adresses directes : identiques au tour 2 (visiteur, gratuit 307 -> liste ; abonnés 200 ; inexistant 404 ; `/mon-espace/fiche/situation/<id>` 308 ; `/fiche/situation/<id>` 404).

## C. Bouton d'offre de l'en-tête (visiteur et gratuit, identiques)
| Page | 320 | 360 | 375 | 768 | 1024 | 1280 |
|---|---|---|---|---|---|---|
| Quoi répondre, liste (et fiche, renvoyée à la liste) | masqué (offre en haut de page) | masqué | masqué | masqué | masqué | masqué |
| Offre de la page, libellé / largeur | « Tout ouvrir · 1,99 €/mois » 252 | idem 292 | idem 307 | idem 322 | idem 241 | idem 321 |
| /parcours et /, libellé lu | « Tout ouvrir » | « Tout ouvrir » | « Tout ouvrir » | « Tout ouvrir · 1,99 €/mois » | idem | idem |
| x gauche-droite / hauteur / taille du texte | 173-252 / 44 / 12 px | 194-292 / 44 / 14 | 209-307 / 44 / 14 | visiteur 552-740, gratuit 496-684 / 44 / 14 | 808-996 ; 752-940 | 1056-1244 ; 1000-1188 |
| Débordement horizontal (document, en-tête) | 0 | 0 | 0 | 0 | 0 | 0 |
Nom accessible : « Tout ouvrir, 1,99 € par mois : voir l'offre Premium ». Abonnés : bouton absent (attendu), 0 débordement aux 6 largeurs. Pleins au premier écran de /, en-tête compris : visiteur 2 (bouton + « Apprends à répondre… »), gratuit 2 (bouton + « Explorer les vannes »), 6 largeurs ; /parcours : 1.

## D. Aplats violets pleins au premier écran, en-tête compris (nombre ; contenu)
| Écran | 375 | 768 | 1024 | 1280 | 1920 |
|---|---|---|---|---|---|
| Visiteur, gratuit : arrivée, après tuile, retour | 1 (offre) | 1 | 1 | 1 | 1 |
| Visiteur, gratuit : /abonnement (étape 3 du trajet) | 2 (pastille radio + S'abonner) | 2 | 2 | 2 | 2 |
| `abonne-en-cours` : arrivée (liste ou fiche 1) | 2 (pastille cloche + Voir) | 2 (+ Voir) | 1 (pastille) | 2 (+ Essayé, ça a marché) | 2 |
| `abonne-en-cours` : 3e fiche, suivante, fiche filtrée | 1 (pastille) | 2 (+ Essayé…) | 1 | 2 | 2 |
| `abonne-en-cours` : après « Fait » | 2 (+ Situation suivante) | 2 | 2 | 2 | 2 |
| `abonne-en-cours` : retour | 1 | 2 (+ Voir à y 108, coupé par l'en-tête) | 1 | 2 | 2 |
| `nouvel-abonne` : arrivée / fiches / après « Fait » / retour | 1 / 0 / 1 / 0 | 1 / 1 / 1 / 1 (Voir) | 0 / 0 / 1 / 0 | 1 / 1 / 1 / 1 | 1 / 1 / 1 / 1 |
`abonne-en-cours` : pastille 12 x 12 de la cloche sur les 30 écrans du trajet ; 2 pleins sur 21 écrans sur 30.

## E. Écarts ouverts au tour 2 (partie Quoi répondre) : statut
| # tour 2 | Statut | Mesure tour 3 |
|---|---|---|
| 16 Hero de l'aperçu, gratuit, 1024 : 34 px | corrigé | 26 (texte 371, carte 397) ; 1280, 1920 : 30 ; visiteur 5 / 21 |
| 21 Pastille violette 12 x 12 de la cloche comptée avec le plein de la page | pas corrigé | 12 x 12, 30 écrans sur 30 ; 2 pleins sur 21 écrans (D) |
| 23 1280 : fiche filtrée ouverte à scrollY 63, haut du H1 sous l'en-tête | corrigé (étape 5) | 63 -> 9, haut du panneau 144 = haut de la liste, H1 à 169 ; 1024 : 141 -> 9 |
| 27 « 1 500+ » en commentaire dans `components/espace/apercu/` | pas corrigé | 3 occurrences (`hero-apercu.tsx:61`, `offre-apercu.tsx:38`, `offre-apercu.tsx:133`) ; 0 rendue |
| Tour 1 n° 1 à 4, 6, 8, 9, 13 (corrigés au tour 2) | toujours corrigés | A et B |
Nouveaux défauts relevés ce tour (N1 à 1280 et N2 déjà visibles sur les captures du tour 2, non relevés alors ; N4 : classe `text-xs` antérieure au nouveau libellé) :
- N1 Retour navigateur dès 1024 vers la liste filtrée : panneau rendu à la position quittée, haut du H1 à 37 (1024) et 115 (1280) sous le bas de l'en-tête (121) ; H1 invisible à 1024 (`qr-abonne-en-cours-1024-6-retour`), 2 comptes.
- N2 Carte de l'extrait (visiteur, gratuit) : vide de fin 159 (1280, 1920), 115 (1024), 41 (375, 768) contre 24, visible au premier écran dès 1024.
- N3 Retour bouton à 768 : bouton plein « Voir » à y 108, à moitié sous l'en-tête (`qr-abonne-en-cours-768-6-retour`), 2 comptes.
- N4 En-tête à 320 : « Tout ouvrir » en 12 px (14 dès 360).
- N5 Hors Quoi répondre, sur le trajet : /abonnement ouvert à scrollY 68 à 375 (H1 coupé, `trajet-*-375-3`) ; « 1 500+ inscrits » affiché sur /abonnement ; / à 2 pleins (C).

## F. Jeu de relecture à l'aveugle sur trajets (58 captures, 40 de trajets)
| Compte | Séquence (375 et 1280) |
|---|---|
| visiteur, gratuit | 1 arrivée ; 2 clic sur une tuile fermée ; 3 clic sur l'offre (/abonnement) ; 4 retour |
| abonne-en-cours, nouvel-abonne | 1 arrivée ; 2 3e fiche de la liste ; 3 « Essayé, ça a marché » ; 4 Situation suivante ; 5 filtre Soirée puis fiche ; 6 retour |
Fichiers `trajet-<compte>-<largeur>-<n>.png`, premier écran, sans annotation. Autres : `qr-<compte>-<768|1024|1920>-arrivee.png` (12), `qr-abonne-en-cours-1024-5-soiree-fiche`, `qr-abonne-en-cours-1024-6-retour`, `qr-abonne-en-cours-768-6-retour`, `offre-visiteur-320-parcours`, `offre-visiteur-360-parcours`, `offre-gratuit-320-qr`.

## Écarts restants (par gravité)
### Majeurs
1. N1 : retour navigateur dès 1024, H1 de la fiche sous l'en-tête (37 et 115 contre 121), invisible à 1024.
2. N2 : carte de l'extrait de l'aperçu, vide de fin 159 / 115 px au premier écran (1024 à 1920).
### Moyens
3. #21 : pastille 12 x 12 de la cloche, 2 pleins au premier écran sur 21 écrans sur 30 (`abonne-en-cours`).
4. N3 : « Voir » coupé par l'en-tête au retour à 768.
5. N2 (suite) : vide de fin 41 px à 375 et 768 ; cartes « Rattraper un faux pas », « Comment choisir » 52 (768, 1024).
### Mineurs
6. N4 : 12 px du bouton d'offre de l'en-tête à 320.
7. #27 : « 1 500+ » dans 3 commentaires de `components/espace/apercu/`.
8. N5 (hors Quoi répondre) : /abonnement à scrollY 68 à 375 ; « 1 500+ inscrits » sur /abonnement ; 2 pleins sur /.
