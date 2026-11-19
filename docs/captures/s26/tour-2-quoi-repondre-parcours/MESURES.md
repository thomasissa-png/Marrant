# Tour 2 : mesures de Quoi répondre (liste + détail) et de /parcours, /parcours/[slug] (19/11/2026)

[LIVE] Préversion locale http://localhost:5400 (commit b1f7341a), Chromium (Playwright), deviceScaleFactor 1, `load` + 1,5 s, `getBoundingClientRect`. Largeurs 375x812, 768x1024, 1024x768, 1280x900, 1920x1080 (C3 cite 1280x800 : mesuré à 900). Comptes remis à l'état de référence (`comptes.sh`) avant chaque trajet abonné et à la fin. Même protocole et mêmes scripts que le tour 1 (`trajet.js`, `qa-browser.js`), plus `pa.js` / `pa-browser.js` pour les parcours.
Captures (90) : `qr-`, `parcours-`, `slug-` + `<compte>-<largeur>-<étape>.png`. Premier écran : arrivée aux 5 largeurs (QR, /parcours), slug à 375 et 1280 ; pleine page à 375 et 1280 pour chaque arrivée ; trajets complets de `abonne-en-cours` à 375 et 1280 (`qr-…-2…6`, `slug-…-reprendre`, `slug-…-suivante`, `parcours-…-retour`) ; clic sur tuile : `qr-visiteur-375-7-tuile-apres-clic`. Slug mesuré : `machine-a-cafe` (avancé, visiteur, gratuit), `repartie` (nouvel abonné : « Commencer l'étape 1 »).

## A. Quoi répondre
### A1. Table §8 de la spec design (abonnés ; avancé et nouvel identiques)
| # | Mesure | Attendu 1024 / 1280 / 1920 | Mesuré 1024 / 1280 / 1920 | 375 / 768 |
|---|---|---|---|---|
| 1-3 | Liste / gouttière / panneau | 320/24/632, 360/32/824, 360/32/824 | identique | panneau 343 / 720 |
| 4 | Haut liste - haut fiche | 0 | 0 / 0 / 0 | - |
| 5 | Haut collé (page défilée de 150) | 144 | 144 / 144 / 144 | - |
| 6 | Hauteur liste | 600 / 732 / 912 | 600 / 732 / 912 | - |
| 7 | Écart lignes de base titre liste / H1 | <= 2 | 0 / 0 / 0 | - |
| 8 | Blanc à droite du panneau | 0 | 0 | 0 / 0 |
| 9 | Vide entre blocs de fiche | 24 | aucun vide > 32 (24 non remesuré au px) | idem |
| 10 | Fin des cartes A et B | <= 24 | 24 (5 largeurs, 4 fiches, 2 comptes) | 24 |
| 11 | Bas texte hero / bas carte d'offre | <= 32 | visiteur 5 / 21 / 21 ; gratuit 34 (371/405) / 30 / 30 | 768 : carte sous le texte |
| 12 | Ligne / Situation suivante / Retour | >= 44 | 44 / 48 / - | 56 / 48 / 44 |
| 14 | Tailles / graisses dans `main` | <= 4 / 2 | 14, 16, 20, 30 ; 400, 600 ; 0 capitale | 14, 16, 20 ou 24 |
Dernière ligne de la liste atteignable : oui (1024, 1280, 1920). Filet de ligne active : blanc 2 px (arbitrage du 19/11). Lignes 13 et 15 : A3 ; décalage du texte à l'activation non remesuré.
### A2. Trajet abonné, scrollY avant -> après (avancé ; nouvel identique sauf mention)
| Étape | 375 | 768 | 1024 | 1280 | 1920 |
|---|---|---|---|---|---|
| 2 3e fiche | 24 -> 24 (nouvel 0 -> 0) | 0 -> 0 | 0 -> 0 | 0 -> 0 | 0 -> 0 |
| 3 Fait | 697 -> 665 (nouvel 697) | 0 -> 164 | 471 -> 471 | 0 -> 200 | 0 -> 20 |
| 4 Suivante | 665 -> 0 | 164 -> 0 | 471 -> 0 | 200 -> 0 | 20 -> 20 |
| 5 Soirée puis fiche | 502 -> 0 | 206 -> 0 | 141 -> 141 | 63 -> 63 | 0 -> 0 |
| 6 Retour (bouton < 1024, navigateur dès 1024) | 502 -> 502, 6 lignes | 206 -> 206, 6 lignes | 141 -> 141 | 63 -> 63 | 0 -> 0 |
Dès 1024 : même nœud de liste à chaque étape, `aria-current` = 1, scrollTop liste 0 -> 0. Après « Soirée » : repli refermé seul (0 ouvert, 5 largeurs) ; corps de liste 381 (1024), 369 (1280, 1920) ; lignes au premier écran 4 (375, avancé) / 3 (375, nouvel) / 6 (768 à 1920). Clics jusqu'à la fiche filtrée : 3 dès 1024 (tour 1 : 4), 4 sous 1024. Historique, 2 retours depuis la fiche Soirée dès 1024 : `?ou=soiree` puis `coloc-tu-en-as-pour-longtemps` (fiche de l'étape 4) ; sous 1024 : `/mon-espace/quoi-repondre` puis `coloc-tu-en-as-pour-longtemps`.
### A3. Aplats violets pleins au premier écran
| Écran | 375 | 768 | 1024 | 1280 | 1920 |
|---|---|---|---|---|---|
| Visiteur, gratuit (aperçu) | 1 (offre) | 1 | 1 | 1 | 1 |
| Abonnés, page liste (< 1024) | 1 (« Voir ») | 1 (« Voir ») | - | - | - |
| Abonnés, fiche avant « Fait » | 0 (« Essayé, ça a marché » à y 961 à 1145) | 1 (« Essayé, ça a marché ») | 0 (y 837 à 933), 1 à l'étape 5 (y 648) | 1 (y 706 à 802) | 1 |
| Abonnés, après « Fait » | 1 (« Situation suivante ») | 1 | 1 | 1 | 1 |
| Abonnés, liste après « Retour » | 0 | 1 (« Voir ») | - | - | - |
| `abonne-en-cours`, en-tête | + pastille 12x12 de la cloche, toutes étapes | idem | idem | idem | idem |
« Enregistrer » n'est plus un plein. En-tête : 14/500 (onglets), 16 ou 20/700 (logo), inchangé.
### A4. Tuile fermée et adresses directes
Clic sur la 1re tuile fermée (visiteur, gratuit, 5 largeurs) : 0 navigation ; contour `solid 2px rgb(139,92,246)` posé sur la carte d'offre (`rounded-2xl`), présent à 100 ms (600 ms à 375 et 1024, après défilement), retiré à 2,1 s ; défilement : 375 1017 -> 120 (gratuit 1026 -> 120), carte entière à y 141 ; 1024 95 -> 8 (gratuit 123 -> 8) ; 768, 1280, 1920 : carte déjà à l'écran, scrollY inchangé. Focus : reste sur `body`.
| Adresse (requête sans suivre) | Visiteur | Gratuit | Nouvel abonné | Abonné avancé |
|---|---|---|---|---|
| `/mon-espace/quoi-repondre/<id>` | 307 -> liste | 307 | 200 | 200 |
| `/mon-espace/quoi-repondre/inexistant-xyz` | 307 -> liste | 307 | 404 | 404 |
| `/mon-espace/fiche/situation/<id>` | 308 -> `/mon-espace/quoi-repondre/<id>` | 308 | 308 | 308 |
| `/fiche/situation/<id>` | 404 | 404 | 404 | 404 |
| `/parcours/inexistant-xyz` | 404 | 404 | 404 | 404 |
Navigateur, visiteur et gratuit : 307 puis 200 sur l'aperçu, scrollY 0. « 1 500+ » : 0 dans le HTML et le flux RSC de `/mon-espace/quoi-repondre`, `/parcours`, `/parcours/machine-a-cafe` (4 comptes) et dans les 90 captures.
### A5. Écarts du tour 1 : statut
| # tour 1 | Statut | Mesure tour 2 |
|---|---|---|
| 1 Repli ouvert après filtre | corrigé | 0 repli ouvert ; corps 369 px à 1280 ; 3 clics au lieu de 4 |
| 2 Retour sous 1024 décalé | corrigé | 375 : 502 -> 502 (tour 1 : +53) ; 768 : 206 -> 206 (tour 1 : -12) ; 6 lignes visibles |
| 3 Fiche retirée de l'historique | corrigé | 2e retour = fiche de l'étape 4 |
| 4 Tuile fermée sans réaction | corrigé | contour violet 2 px + défilement (A4) |
| 5 0 aplat sur la fiche | partiel | 1 à 768, 1280, 1920 ; 0 à 375 et à 1024 (4 étapes sur 5) |
| 6 « Situation suivante » hors écran après « Fait » | corrigé | visible aux 5 largeurs (défilement auto 0 -> 200 à 1280, 0 -> 164 à 768) |
| 7 12 px, capitales, 5 tailles | corrigé | 4 tailles max, 0 capitale dans `main` |
| 8 Fin des cartes A et B à 32 | corrigé | 24 |
| 9 Liste collante à 24 (1920) | corrigé | 144 |
| 10 Vide sous la liste filtrée | pas corrigé | étape 5 : 331 (1280, liste 636 / panneau 967, 264 visibles), 385 (1920, visibles) ; étape 6 : 499 / 553 ; 1024 : 261 ; sans filtre 1920 : 61 (nouvel 117) |
| 11 Filet blanc | clos par arbitrage | blanc 2 px, conforme à l'arbitrage du 19/11 |
| 12 Hero gratuit 38 | corrigé à 1280, 1920 (30) | nouveau à 1024 : 34 (texte 371, carte 405) |
| 13 Id inconnu en 200 | corrigé | 404 (2 abonnés) |
| 14 `/fiche/situation/<id>` 404 | inchangé | 404 ; `/mon-espace/fiche/situation/<id>` 308 |
| 15 En-tête 500/700, pastille | pas corrigé | idem tour 1 |
| 16 Hero -> légende 48 | pas corrigé | 48 à 768, 1024, 1280, 1920 |
Nouveau : 1280, arrivée sur la fiche filtrée à scrollY 63 conservé : haut du H1 sous l'en-tête (capture `qr-abonne-en-cours-1280-5-soiree-fiche`).

## B. Parcours
### B1. /parcours, table §5 (design) et C1 à C6
| Mesure | Attendu | 375 | 768 | 1024 | 1280 | 1920 |
|---|---|---|---|---|---|---|
| Bords G-D : H1, En cours, semaines, cartes, quiz, explore, FAQ | écart 0 | 16-359 | 24-744 | 24-1000 | 32-1248 | 352-1568 |
| Largeur contenu | 343/720/976/1216/1216 | 343 | 720 | 976 | 1216 | 1216 |
| Carte de parcours / gouttière | 343/348/476/596/596, 24 | 343 | 348 / 24 | 476 / 24 | 596 / 24 | 596 / 24 |
| Cellule des semaines (2x2 jusqu'à 1279) | 295/348/2x2/274/274 | 293 | 323 | 451 | 274 | 274 |
| Réponses du quiz | 295/232/288/389/389 | 293 | 3 x 218 | 3 x 303 | 3 x 383 | 3 x 383 |
| Écart des bas / hauts de boutons, même rangée | 0 | - | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| Écart des hauts de titres, rangée 1 | 0 | - | 0 | 20 (Machine 1064, Répartie 1084 ; 4 comptes) | 0 | 0 |
| Vide de fin, cartes de parcours | <= 8 | 0 à 2 | 0 à 2 ; Explore (visiteur, gratuit) 26 | 0 à 2 | 0 à 2 | 0 à 2 |
| Vide interne > 32 dans les cartes (C1) | 0 | 0 | Confiance 114, Machine 42, Répartie 34, témoignage -> barre 38 (-> Programme 46 sans compte) | Confiance 66, Machine 42, 38 / 46 | Confiance 66, 38 / 46 | idem 1280 |
| Hauteur carte En cours, avancé / nouvel | ≈330/270/270/245/245 | 435 / 359 | 359 / 307 | 271 / 211 | 271 / 211 | 271 / 211 |
| Rangée 1 En cours : bas bouton / bas texte (C2) | <= 32 | empilé | empilé | 34 (nouvel 12) | 34 (nouvel 20) | 34 (nouvel 20) |
| Pleins au premier écran, en-tête compris (C6) | 1 | avancé : Reprendre + pastille ; nouvel : Commencer ; sans compte : bouton d'en-tête | idem | idem | idem | idem |
| « Reprendre » visibles (avancé) | 1 | 1 | 1 | 1 | 1 | 1 |
Rangée 2 (avancé) : barre 373 x 8 (col 4, sans libellé `n/total` visible) + Ton cap 769 x 56 (col 8, 2 lignes à 1280) ; nouvel : Ton cap seul 1166 (1280). « Tes bonus » : absent pour les 2 abonnés. Annonce de cap (avancé) : bords 32-1248, retrait intérieur 16 (texte à x 49) contre 24 (x 57) pour les autres cartes. Typo : 14, 16, 20, 24 ou 30 ; 400, 600 ; 0 capitale ; hors échelle 15/600 à 375 (« Tester l'étape 1 de … », « Continuer ce parcours », « Commencer ce parcours »). Cibles < 44 : aucune. Bandes vides > 32 au premier écran : 1280 et 1920 abonnés 49 (semaines -> H2 « Les parcours », `mt-12`) ; sans compte 34 (chapô -> 1re carte) ; nouvel 375 et 768 : 57 (H1 -> texte de la carte, 33 + `p-6`).
### B2. /parcours/[slug] (C2, C3, C5, C6)
| Mesure | Attendu | 375 | 768 | 1024 | 1280 | 1920 |
|---|---|---|---|---|---|---|
| Gauche / droite de l'en-tête, sans compte et nouvel | 343, 720, 559/393, 699/493 | empilé | empilé | 559 / 393 | 699 / 493 | 699 / 493 |
| idem, avancé | 7/5 | empilé | empilé | carte 976 x 456 pleine largeur sous le H1 | 1216 x 456 | 1216 x 456 |
| Haut carte - haut H1 | 0 | - | - | 0 (avancé 96) | 0 (avancé 96) | 0 (avancé 96) |
| Hauteur gauche - hauteur carte (C3) | <= 32 | - | - | sans compte 34 ; nouvel -127 (390 / 517) | 34 ; -147 (370 / 517) | 34 ; -147 |
| Vide de fin, carte de progression (C5) | <= 32 | 0 | 0 | sans compte 100 ; abonnés 0 | 104 ; 0 | 104 ; 0 |
| `details` du sommaire sous 1024 | fermé, 4 comptes | abonnés fermé ; sans compte : pas de `details`, liste dépliée (256 px) | idem (228 px) | ouvert (abonnés) | ouvert | ouvert |
| « Reprendre » / pleins au premier écran | 1 / 1 (abonnés dès 1024) | 0 / 0 | 0 / 0 | 1 / 1 (102 x 44) ; nouvel « Commencer » | idem | idem |
| Carte -> H2 « Le programme » | rythme | 34 | 34 | 56 (abonnés) | 56 ; sans compte 33 | 56 |
Corps d'étape ouverte : une colonne de 12 à toutes largeurs (aucun 7/5) ; vides 45 (« Exercice pratique » -> bloc suivant) et 37 (« Pour aller plus loin » -> « Petit quiz »), 4 comptes, 5 largeurs. Cibles < 44 : fil d'Ariane 17 px (« Accueil », « Parcours »), « Termine le quiz pour… » 40 px (abonnés, dès 768). Typo : conforme, sauf 15/600 « Passer à l'étape 2 · 1,99 » (sans compte, 375).
### B3. Trajets (C7), 2 abonnés, 5 largeurs
| Trajet | Attendu | 375 | 768 | 1024 | 1280 | 1920 |
|---|---|---|---|---|---|---|
| /parcours -> Reprendre (Commencer) : clics | 1 | 1 | 1 | 1 | 1 | 1 |
| Haut de la carte d'étape (300 à 2500 ms, stable) | 137 ± 2 | 265 | 265 | 265 | 265 | 265 |
| Haut de l'en-tête d'étape / focus | - | 290, focus `#etape-n-entete` | idem | idem | idem | idem |
| Étape suivante : clics / haut d'arrivée | 1 / 137 | 1 / 265 | 1 / 265 | 1 / 265 | 1 / 265 | 1 / 265 |
| Retour : clics / URL | 1 / `#parcours-{slug}` | 1 / oui | 1 / oui | 1 / oui | 1 / oui | 1 / oui |
| Carte retrouvée : haut / entière | entière | 265 / non (bas 975) | 265 / oui | 265 / non (bas 867) | 265 / oui | 265 / oui |
| `goBack()` après Retour : scrollY / attendu | position quittée | 686 / 4390 | 578 / 2755 | 828 / 3089 | 828 / 3026 | 828 / 2936 |
| `goBack()` après Reprendre : scrollY / attendu | 0 | 0 | 0 | 0 | 0 | 0 |
Mesuré sur la page : `html { scroll-padding-top: 128px }` (`en-tete-universel.tsx`) et `scroll-margin-top: 137px` sur `#etape-n` et `#parcours-{slug}` ; 128 + 137 = 265. Avancé : l'étape 3 (reprise) est la dernière, pas de lien « suivante » (conforme) ; « suivante » testée depuis l'étape 2 (1 clic de plus pour l'ouvrir). Nouvel : étape 1 -> 2. `goBack()` après Retour : en nouvel, 738 / 4716 (375), 570 / 2905 (768), 541 / 2985 (1280). Pleins : 0 dans `main` à l'arrivée sur l'étape.
### B4. C8 à C11
C8 : aucune colonne seule à côté d'un vide dans /parcours (12 colonnes partout) ; slug : colonne gauche du nouvel abonné vide sur 127 à 147 px sous son contenu (B2). C9 : 0 « 1 500+ » rendu ; Grep `components/espace/apercu/*` : 3 occurrences, toutes en commentaire (`hero-apercu.tsx:61`, `offre-apercu.tsx:38`, `offre-apercu.tsx:130`) ; `config/textes/espace-apercu.ts` : 0 ; inertie du HTML fermé non mesurée (préversion ouverte). C10 : cibles (B2) ; clavier et focus visible non mesurés ce tour. C11 : relecture à l'aveugle non faite (hors mission).

## Écarts (liste brute, par gravité)
### Majeurs
1. Parcours, Reprendre, étape suivante et retour : haut de la carte d'arrivée à 265 px au lieu de 137 ± 2, 5 largeurs, 2 abonnés (128 de `scroll-padding-top` + 137 de `scroll-margin-top`).
2. Parcours, `goBack()` après « Retour : Parcours » : retour à la position d'arrivée de Reprendre (686, 578, 828) au lieu de la position quittée (2755 à 4390).
3. /parcours/[slug], abonné avancé : pas d'en-tête 7/5 ; carte de progression en 12 colonnes (1216 x 456) sous le H1, haut carte - haut H1 = 96.
4. /parcours/[slug], nouvel abonné : carte de progression 517 contre colonne gauche 370 à 390 : écart 127 (1024), 147 (1280, 1920).
5. /parcours/[slug], visiteur et gratuit : vide de fin de la carte de progression 100 (1024) à 104 px (1280, 1920), visible au premier écran.
6. /parcours, vides internes des cartes de parcours > 32 : Confiance 114 (768), 66 (1024 à 1920) ; Machine 42 (768, 1024) ; témoignage -> barre 38 (abonnés), témoignage -> Programme 46 (sans compte) ; 4 comptes.
7. Quoi répondre, vide sous la liste filtrée à côté du panneau : 331 (1280, 264 visibles), 385 (1920), 499 / 553 à l'étape 6, 261 (1024).
8. Parcours, carte retrouvée au retour non entière à 375 (bas 975) et 1024 (bas 867).
### Moyens
9. /parcours à 1024 : titres de la rangée 1 décalés de 20 px (méta de Répartie sur 2 lignes), 4 comptes.
10. /parcours/[slug] sous 1024, visiteur et gratuit : pas de `details` fermé, liste d'étapes dépliée (256 px à 375, 228 à 768).
11. Quoi répondre, fiche abonné : 0 aplat au premier écran à 375 (étapes 2, 4, 5) et à 1024 (étapes 1, 2, 4, 6).
12. /parcours/[slug] abonnés dès 1024 : 56 px entre la carte de progression et « Le programme ».
13. Corps d'étape ouverte : vides de 45 et 37 px entre blocs, 4 comptes, 5 largeurs.
14. Carte « En cours » : 435 / 359 px (avancé 375 / 768) contre ≈ 330 / 270 ; 271 contre ≈ 245 à 1280, 1920 ; Ton cap sur 2 lignes à 1280 ; rangée 1 bouton / texte 34 (> 32).
15. /parcours/[slug] sans compte : écart de hauteur de l'en-tête 34 (> 32) à 1024, 1280, 1920.
16. Hero de l'aperçu Quoi répondre, gratuit, 1024 : 34 px (texte 371, carte 405).
17. Hero -> légende de l'extrait (Quoi répondre) : 48 px à 768, 1024, 1280, 1920.
18. Explore aussi à 768, visiteur et gratuit : vide de fin 26 px (Conseils, Glossaire) contre <= 8.
19. Annonce de cap : retrait intérieur 16 px contre 24 pour les autres cartes (texte à x 49 contre 57 à 1280).
### Mineurs
20. Taille 15/600 hors échelle à 375 : boutons des cartes de parcours, « Passer à l'étape 2 · 1,99 ».
21. En-tête : 14/500 et 16 ou 20/700 ; pastille violette 12 x 12 de la cloche (avancé), comptée avec le plein de la page.
22. Cibles < 44 : fil d'Ariane 17 px, « Termine le quiz pour… » 40 px.
23. Quoi répondre 1280 : fiche filtrée ouverte à scrollY 63, haut du H1 sous l'en-tête.
24. /parcours/[slug] abonnés sous 1024 : 0 plein au premier écran (sommaire replié).
25. Réponses du quiz 383 / 303 / 218 contre 389 / 288 / 232 ; cellule des semaines 323 contre 348 à 768 (valeurs `[ESTIMÉ]` de la spec).
26. Barre de la carte « En cours » sans libellé `n/total` visible.
27. « 1 500+ » : 3 occurrences en commentaire dans `components/espace/apercu/`.
28. `/fiche/situation/<id>` : 404 (inchangé).
