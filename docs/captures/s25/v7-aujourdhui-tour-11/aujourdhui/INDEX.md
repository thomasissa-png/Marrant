# Captures aujourdhui (2026-11-16, http://localhost:5400)

Tour 11 (relectures du tour 10 : design 8/10, UX 7/10, sans faute dure ; « propre mais donne envie à moitié »). Aucun texte nouveau, aucune taille ni graisse ajoutée (`TAILLES.md`). (1) Extrait : Z1 « Ton premier pas » à pleine netteté (`TuileFermee nette`, verrou et bouton en contour éteint gardés), les 4 autres tuiles restent atténuées ; nom de l'étape (« Tes premières répliques ») en `TEXTE` au lieu de `META` ; fondu à partir de 9 rem (8 avant), même point transparent : nom de l'étape, deux lignes d'accroche de la mission et « Vidéo du jour » en clair. Vanne du jour réelle : pas disponible dans `tableau-verrouille.tsx` (rendu statique sans `/api/daily`), « Contenu du jour » garde ses trois titres. (2) Prospect sous 768 : pastilles du hero en `sr-only` (lues, plus affichées), preuve « 1 500+ » hors de la carte, en ligne simple sous la promesse (16 px). (3) Air au-dessus de l'extrait : 48 px dès 768 (64 avant dès 1024) ; la fin d'extrait recouvre 16 px du transparent au lieu de 32 (`lg:-mt-4`) : phrase et bouton de fin aux mêmes hauteurs qu'au tour 10. (4) Abonné : étape et mission côte à côte dès 768 (grille 5 + 7 de 768 à 1023, barre d'étapes empilée dans la tuile étroite) ; « Ton cap » à 768 calé en haut, cases des chiffres à droite, aide de la série dessous sur toute la largeur ; XP et série chacun dans une case (fond élevé neutre, 16 px de marge), flamme d'une série en cours en blanc. (5) « Contenu du jour » : 3 colonnes mesurées puis écartées, on garde 2 colonnes.

## Mesures du tour 11 (préversion 5400)

| Mesure | Avant (tour 10) | Après (tour 11) |
|---|---|---|
| Opacité du contenu de Z1 dans l'extrait | 0,75 | 1 (autres tuiles : 0,75) |
| Visiteur 375 x 812 : bouton d'offre (haut / bas) | 350 / 398 | 322 / 370 |
| Visiteur 375 x 812 : tuile Z1 (haut / bas du bouton éteint / bas de la tuile) | 648 / 849 / 874 (bouton et bas sous le pli) | 559 / 760 / 785 (entière au premier écran) |
| Gratuit 375 x 812 : idem | 660 / 861 / 886 | 571 / 772 / 797 (entière) |
| 375 : pastilles du hero | 2 lignes visibles (56 px) | `sr-only` (lues, 6 éléments) |
| 375 : preuve « 1 500+ » | dans la carte (y 462 visiteur, 526 gratuit) | sous la promesse (y 261), carte plus courte |
| 768 : preuve | dans la carte | inchangé (dans la carte) |
| 1280, 1456, 1920 x 900 : bas du hero / légende (bande vide) | 377 / 441 (64 px) | 377 / 425 (48 px) |
| 1024 x 900 : idem | 413 / 477 (64 px) | 413 / 461 (48 px) |
| 1280, 1456, 1920 x 900 : phrase / bouton de fin | 908 / 952 | 908 / 952 (sous le pli) ; 892 / 936 avec la seule baisse de l'air, phrase touchant le pli, d'où `lg:-mt-4` |
| Extrait, lignes depuis le haut de la suite coupée : nom de l'étape | 126 à 143 (`META`), fondu dès 128 | 127 à 147 (`TEXTE`), fondu dès 144 |
| Abonné avancé 768 : étape / mission | pleine largeur chacune (720 px, lignes de 95 caractères) | côte à côte 290 + 406 px, même haut ; vide avant le pied de l'étape 36 px (76 en 6 + 6) |
| Abonné avancé 768 : « Ton cap » | étiquette 12 px sous le haut de « 250 », carte de 174 px | étiquette et cases calées en haut, carte de 186 px |
| Contenu du jour, 3 colonnes simulées à 1280 (vignette vidéo) | | creux de 111 px (vanne) et 127 px (conseil) au-dessus du pied : au-delà de 32, 2 colonnes gardées |

Mesure : `getBoundingClientRect`, premier écran (script `a11-mesure.mjs`). Bande vide = haut de la légende moins bas de `[data-apercu-hero]`.

## Pleine page

- visiteur-aujourdhui-375.png : /mon-espace (page), HTTP 200, hauteur 2416px
- visiteur-aujourdhui-768.png : /mon-espace (page), HTTP 200, hauteur 1892px
- visiteur-aujourdhui-1280.png : /mon-espace (page), HTTP 200, hauteur 1534px
- visiteur-aujourdhui-1456.png : /mon-espace (page), HTTP 200, hauteur 1534px
- visiteur-aujourdhui-1920.png : /mon-espace (page), HTTP 200, hauteur 1534px
- gratuit-aujourdhui-375.png : /mon-espace (page), HTTP 200, hauteur 2428px
- gratuit-aujourdhui-768.png : /mon-espace (page), HTTP 200, hauteur 1924px
- gratuit-aujourdhui-1280.png : /mon-espace (page), HTTP 200, hauteur 1534px
- gratuit-aujourdhui-1456.png : /mon-espace (page), HTTP 200, hauteur 1534px
- gratuit-aujourdhui-1920.png : /mon-espace (page), HTTP 200, hauteur 1534px
- en-cours-aujourdhui-375.png : /mon-espace (page), HTTP 200, hauteur 4018px
- en-cours-aujourdhui-768.png : /mon-espace (page), HTTP 200, hauteur 2620px
- en-cours-aujourdhui-1280.png : /mon-espace (page), HTTP 200, hauteur 2119px
- en-cours-aujourdhui-1456.png : /mon-espace (page), HTTP 200, hauteur 2119px
- en-cours-aujourdhui-1920.png : /mon-espace (page), HTTP 200, hauteur 2119px
- nouvel-aujourdhui-375.png : /mon-espace (page), HTTP 200, hauteur 3363px
- nouvel-aujourdhui-768.png : /mon-espace (page), HTTP 200, hauteur 2361px
- nouvel-aujourdhui-1280.png : /mon-espace (page), HTTP 200, hauteur 1800px
- nouvel-aujourdhui-1456.png : /mon-espace (page), HTTP 200, hauteur 1800px
- nouvel-aujourdhui-1920.png : /mon-espace (page), HTTP 200, hauteur 1800px

## Premier écran (fenêtre seule ; 812 px de haut à 375, 900 px au-delà)

- visiteur-aujourdhui-ecran-375.png : /mon-espace (haut), HTTP 200, hauteur 2416px
- visiteur-aujourdhui-ecran-768.png : /mon-espace (haut), HTTP 200, hauteur 1892px
- visiteur-aujourdhui-ecran-1280.png : /mon-espace (haut), HTTP 200, hauteur 1534px
- visiteur-aujourdhui-ecran-1456.png : /mon-espace (haut), HTTP 200, hauteur 1534px
- visiteur-aujourdhui-ecran-1920.png : /mon-espace (haut), HTTP 200, hauteur 1534px
- gratuit-aujourdhui-ecran-375.png : /mon-espace (haut), HTTP 200, hauteur 2428px
- gratuit-aujourdhui-ecran-768.png : /mon-espace (haut), HTTP 200, hauteur 1924px
- gratuit-aujourdhui-ecran-1280.png : /mon-espace (haut), HTTP 200, hauteur 1534px
- gratuit-aujourdhui-ecran-1456.png : /mon-espace (haut), HTTP 200, hauteur 1534px
- gratuit-aujourdhui-ecran-1920.png : /mon-espace (haut), HTTP 200, hauteur 1534px
- en-cours-aujourdhui-ecran-375.png : /mon-espace (haut), HTTP 200, hauteur 4018px
- en-cours-aujourdhui-ecran-768.png : /mon-espace (haut), HTTP 200, hauteur 2620px
- en-cours-aujourdhui-ecran-1280.png : /mon-espace (haut), HTTP 200, hauteur 2119px
- en-cours-aujourdhui-ecran-1456.png : /mon-espace (haut), HTTP 200, hauteur 2119px
- en-cours-aujourdhui-ecran-1920.png : /mon-espace (haut), HTTP 200, hauteur 2119px
- nouvel-aujourdhui-ecran-375.png : /mon-espace (haut), HTTP 200, hauteur 3363px
- nouvel-aujourdhui-ecran-768.png : /mon-espace (haut), HTTP 200, hauteur 2361px
- nouvel-aujourdhui-ecran-1280.png : /mon-espace (haut), HTTP 200, hauteur 1800px
- nouvel-aujourdhui-ecran-1456.png : /mon-espace (haut), HTTP 200, hauteur 1800px
- nouvel-aujourdhui-ecran-1920.png : /mon-espace (haut), HTTP 200, hauteur 1800px
