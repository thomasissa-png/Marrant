# Captures aujourdhui (2026-11-16, http://localhost:5400)

Tour 10 (relecture design du tour 9, 7/10, une faute ; relecture UX 9/10, aucune faute). (1) La légende validée « Voici un exemple de cette rubrique. Elle est ouverte avec Premium. » monte EN TÊTE de l'extrait (`META`, alignée à gauche comme le H1, `data-apercu-legende`), elle n'est plus répétée sous le bouton de fin ; air au-dessus de l'extrait : 64 px dès 1024 (`lg:mt-16`, 128 avant), 48 à 768, 24 sous 768 ; sous la légende : 40 px dès 1024, 16 à 768, 8 sous 768. (2) « Tes 4 premières semaines » passe en étiquette (`ETIQUETTE`, toujours le `h2`), comme « Contenu du jour » de l'extrait au tour 8 : l'étiquette est sur la ligne d'« Étape conseillée », la première semaine sur celle de « Répartie » ; aucune ligne vide, aucun texte neuf. (3) Verrou des tuiles fermées centré dans une boîte de 20 px (`h-5 items-center`), la hauteur de leur première ligne. (4) Piste UX (série et XP de l'abonné avancé au premier écran à 375) : pas faisable par les marges seules, laissée en l'état (voir mesures). Échelle typographique inchangée : `TAILLES.md`.

## Mesures du tour 10 (préversion 5400)

| Mesure | Avant (tour 9) | Après (tour 10) |
|---|---|---|
| Visiteur et gratuit, 1280, 1456, 1920 x 900 : bas du hero / premier élément de l'extrait (bande vide) | 377 / 505, tuiles (128 px) | 377 / 441, légende (64 px) ; tuiles à 501 |
| Idem à 1024 x 900 | 413 / 541 (128 px) | 413 / 477, légende (64 px) ; tuiles à 537 |
| Idem à 1920 x 1080 | 377 / 505 (128 px) | 377 / 441 (64 px) |
| Fin d'extrait à 1280, 1456, 1920 x 900 (haut de la phrase / haut du bouton) | 912 / 956 | 908 / 952 (sous le pli) |
| Légende : position (visiteur 1280) | sous le bouton de fin, y 1028 | en tête de l'extrait, y 441 à 461 ; une seule |
| Visiteur 375 x 812 : bas du hero / légende / tuiles | 576 / (sous l'extrait, 1385) / 608 | 576 / 600 à 640 (2 lignes) / 648 |
| Gratuit 375 x 812 : bas du hero / légende / tuiles | 588 / (1397) / 620 | 588 / 612 à 652 / 660 |
| 375 x 812 : bas du titre de la première tuile (visiteur ; gratuit) | 745 ; 757 | 785 ; 797 (étiquette et titre toujours entiers au premier écran de 812 ; au-delà du repère de 760 px visé au tour 8, la légende prend 2 lignes) |
| Visiteur 768 x 900 : bas du hero / légende / tuiles | 476 / (1156) / 524 | 476 / 524 / 560 |
| Nouvel abonné 1024, 1280, 1920 : « Étape conseillée » / « Tes 4 premières semaines » (haut de l'étiquette) | 497 / titre de 20 px à 497 | 497 / étiquette à 497 (0 px) |
| Idem : « Répartie » / ligne en face | 525 / liste à 533 (titre 28 px plus haut que « Répartie ») | 525 / « Semaine 1 » à 525 (0 px) |
| Verrou de Z1 de l'extrait : centre du verrou / centre de « 5 min » (375, 768, 1280, 1920) | 537 / 539,5 à 1280 (2,5 px au-dessus) | 535 / 535,5 (0,5 px) |
| Abonné avancé 375 x 812 : bas de « 250 » / bas des libellés XP et série | 893 / 933 (inchangé) | 893 / 933 : il faudrait remonter « Ton cap » de 121 px ; les marges sous `md` (grille, padding de Z1 et du cap, gouttière) en donnent environ 70 à 90 au plus (estimation), en cassant le padding commun des cartes. Laissé en l'état. |

Mesure : `getBoundingClientRect`, premier écran ; centre de « 5 min » = boîte du texte (Range). Bande vide = haut de la légende moins bas de `[data-apercu-hero]`.

## Pleine page

- visiteur-aujourdhui-375.png : /mon-espace (page), HTTP 200, hauteur 2505px
- visiteur-aujourdhui-768.png : /mon-espace (page), HTTP 200, hauteur 1892px
- visiteur-aujourdhui-1280.png : /mon-espace (page), HTTP 200, hauteur 1534px
- visiteur-aujourdhui-1456.png : /mon-espace (page), HTTP 200, hauteur 1534px
- visiteur-aujourdhui-1920.png : /mon-espace (page), HTTP 200, hauteur 1534px
- gratuit-aujourdhui-375.png : /mon-espace (page), HTTP 200, hauteur 2517px
- gratuit-aujourdhui-768.png : /mon-espace (page), HTTP 200, hauteur 1924px
- gratuit-aujourdhui-1280.png : /mon-espace (page), HTTP 200, hauteur 1534px
- gratuit-aujourdhui-1456.png : /mon-espace (page), HTTP 200, hauteur 1534px
- gratuit-aujourdhui-1920.png : /mon-espace (page), HTTP 200, hauteur 1534px
- en-cours-aujourdhui-375.png : /mon-espace (page), HTTP 200, hauteur 3958px
- en-cours-aujourdhui-768.png : /mon-espace (page), HTTP 200, hauteur 2794px
- en-cours-aujourdhui-1280.png : /mon-espace (page), HTTP 200, hauteur 2119px
- en-cours-aujourdhui-1456.png : /mon-espace (page), HTTP 200, hauteur 2119px
- en-cours-aujourdhui-1920.png : /mon-espace (page), HTTP 200, hauteur 2119px
- nouvel-aujourdhui-375.png : /mon-espace (page), HTTP 200, hauteur 3359px
- nouvel-aujourdhui-768.png : /mon-espace (page), HTTP 200, hauteur 2357px
- nouvel-aujourdhui-1280.png : /mon-espace (page), HTTP 200, hauteur 1796px
- nouvel-aujourdhui-1456.png : /mon-espace (page), HTTP 200, hauteur 1796px
- nouvel-aujourdhui-1920.png : /mon-espace (page), HTTP 200, hauteur 1796px

## Premier écran (fenêtre seule ; 812 px de haut à 375, 900 px au-delà)

- visiteur-aujourdhui-ecran-375.png : /mon-espace (haut), HTTP 200, hauteur 2505px
- visiteur-aujourdhui-ecran-768.png : /mon-espace (haut), HTTP 200, hauteur 1892px
- visiteur-aujourdhui-ecran-1280.png : /mon-espace (haut), HTTP 200, hauteur 1534px
- visiteur-aujourdhui-ecran-1456.png : /mon-espace (haut), HTTP 200, hauteur 1534px
- visiteur-aujourdhui-ecran-1920.png : /mon-espace (haut), HTTP 200, hauteur 1534px
- gratuit-aujourdhui-ecran-375.png : /mon-espace (haut), HTTP 200, hauteur 2517px
- gratuit-aujourdhui-ecran-768.png : /mon-espace (haut), HTTP 200, hauteur 1924px
- gratuit-aujourdhui-ecran-1280.png : /mon-espace (haut), HTTP 200, hauteur 1534px
- gratuit-aujourdhui-ecran-1456.png : /mon-espace (haut), HTTP 200, hauteur 1534px
- gratuit-aujourdhui-ecran-1920.png : /mon-espace (haut), HTTP 200, hauteur 1534px
- en-cours-aujourdhui-ecran-375.png : /mon-espace (haut), HTTP 200, hauteur 3958px
- en-cours-aujourdhui-ecran-768.png : /mon-espace (haut), HTTP 200, hauteur 2794px
- en-cours-aujourdhui-ecran-1280.png : /mon-espace (haut), HTTP 200, hauteur 2119px
- en-cours-aujourdhui-ecran-1456.png : /mon-espace (haut), HTTP 200, hauteur 2119px
- en-cours-aujourdhui-ecran-1920.png : /mon-espace (haut), HTTP 200, hauteur 2119px
- nouvel-aujourdhui-ecran-375.png : /mon-espace (haut), HTTP 200, hauteur 3359px
- nouvel-aujourdhui-ecran-768.png : /mon-espace (haut), HTTP 200, hauteur 2357px
- nouvel-aujourdhui-ecran-1280.png : /mon-espace (haut), HTTP 200, hauteur 1796px
- nouvel-aujourdhui-ecran-1456.png : /mon-espace (haut), HTTP 200, hauteur 1796px
- nouvel-aujourdhui-ecran-1920.png : /mon-espace (haut), HTTP 200, hauteur 1796px
