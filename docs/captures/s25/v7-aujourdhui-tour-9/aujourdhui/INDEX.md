# Captures aujourdhui (2026-11-16T16:11, http://localhost:5400)

Tour 9 (fautes dures des relectures du tour 8, design 7/10 et UX 8/10) : (1) carte « Ton premier pas » de l'extrait fermé (visiteur, gratuit) au cadre neutre des tuiles (`TUILE`), ni bord ni teinte violette ; l'abonné garde sa carte teintée et son bouton plein. (2) Dès 1024 px, la preuve « 1 500+ inscrits bossent leur humour. » sort de la carte d'offre et se pose sous les pastilles (`mt-6`, `META`, nombre en `TITRE_CARTE`) ; sous 1024, elle reste dans la carte ; « Connexion » reste dans la carte ; une seule preuve affichée à chaque largeur (l'autre en `display: none`, jamais lue). Le hero raccourci de 59 px, l'air au-dessus de l'extrait passe de 64 à 128 px dès 1024 pour garder la fin d'extrait sous le pli. (3) Cibles « Une autre » et puces C9 : déjà `min-h-11`, mesurées à 44 px, rien à corriger. Échelle typographique inchangée : `TAILLES.md`.

## Mesures du tour 9 (préversion 5400, 900 px de haut)

| Mesure | Avant (tour 8) | Après (tour 9) |
|---|---|---|
| Visiteur 1280 et 1920 : bas de la colonne de texte / bas de la carte d'offre (écart) | 325 / 436 (111 px) | 377 / 359 (18 px) |
| Gratuit 1280 et 1920 : bas de la colonne de texte / bas de la carte d'offre (écart) | 325 / 448 (123 px) | 377 / 371 (6 px) |
| 1456 (visiteur ; gratuit) : même chose | 111 px ; 123 px | 18 px ; 6 px |
| 1024 (visiteur ; gratuit) : écart | 115 px ; 147 px | 34 px ; 2 px |
| Fin d'extrait à 1280, 1456, 1920 x 900 (haut de la phrase / haut du bouton) | 907 / 951 | 912 / 956 (sous le pli ; 848 / 892 sans l'air ajouté) |
| Preuves affichées (375, 768 ; 1024 et plus) | carte ; carte | carte ; hero (une seule à chaque largeur) |
| Z1 de l'extrait (bord, fond) | `accent-primary/40`, dégradé `accent-primary/10` | rgb(42, 42, 42) (`border-border`), aucun dégradé |
| Z1 de l'abonné (bord) | rgba(139, 92, 246, 0,4) | inchangé |
| « Une autre » (en cours, 375 et 1280) | `min-h-11` au code | 99,8 x 44 px |
| Puces de la question C9 (375 ; 1280) | `min-h-11` au code | 83,6 à 111,1 x 44 px ; 186,3 x 44 px |

Mesure : bas de la colonne de texte = bas du dernier enfant affiché de la colonne de gauche du hero ; « avant » obtenu sur la même page en réaffichant la preuve de la carte et en masquant celle du hero (rendu du tour 8, à l'air de l'extrait près).

## Pleine page

- visiteur-aujourdhui-375.png : /mon-espace (page), HTTP 200, hauteur 2529px
- visiteur-aujourdhui-768.png : /mon-espace (page), HTTP 200, hauteur 1900px
- visiteur-aujourdhui-1280.png : /mon-espace (page), HTTP 200, hauteur 1582px
- visiteur-aujourdhui-1456.png : /mon-espace (page), HTTP 200, hauteur 1582px
- visiteur-aujourdhui-1920.png : /mon-espace (page), HTTP 200, hauteur 1582px
- gratuit-aujourdhui-375.png : /mon-espace (page), HTTP 200, hauteur 2541px
- gratuit-aujourdhui-768.png : /mon-espace (page), HTTP 200, hauteur 1932px
- gratuit-aujourdhui-1280.png : /mon-espace (page), HTTP 200, hauteur 1582px
- gratuit-aujourdhui-1456.png : /mon-espace (page), HTTP 200, hauteur 1582px
- gratuit-aujourdhui-1920.png : /mon-espace (page), HTTP 200, hauteur 1582px
- en-cours-aujourdhui-375.png : /mon-espace (page), HTTP 200, hauteur 3958px
- en-cours-aujourdhui-768.png : /mon-espace (page), HTTP 200, hauteur 2794px
- en-cours-aujourdhui-1280.png : /mon-espace (page), HTTP 200, hauteur 2119px
- en-cours-aujourdhui-1456.png : /mon-espace (page), HTTP 200, hauteur 2119px
- en-cours-aujourdhui-1920.png : /mon-espace (page), HTTP 200, hauteur 2119px
- nouvel-aujourdhui-375.png : /mon-espace (page), HTTP 200, hauteur 3367px
- nouvel-aujourdhui-768.png : /mon-espace (page), HTTP 200, hauteur 2365px
- nouvel-aujourdhui-1280.png : /mon-espace (page), HTTP 200, hauteur 1803px
- nouvel-aujourdhui-1456.png : /mon-espace (page), HTTP 200, hauteur 1803px
- nouvel-aujourdhui-1920.png : /mon-espace (page), HTTP 200, hauteur 1803px

## Premier écran (fenêtre seule ; 812 px de haut à 375, 900 px au-delà)

- visiteur-aujourdhui-ecran-375.png : /mon-espace (haut), HTTP 200, hauteur 2529px
- visiteur-aujourdhui-ecran-768.png : /mon-espace (haut), HTTP 200, hauteur 1900px
- visiteur-aujourdhui-ecran-1280.png : /mon-espace (haut), HTTP 200, hauteur 1582px
- visiteur-aujourdhui-ecran-1456.png : /mon-espace (haut), HTTP 200, hauteur 1582px
- visiteur-aujourdhui-ecran-1920.png : /mon-espace (haut), HTTP 200, hauteur 1582px
- gratuit-aujourdhui-ecran-375.png : /mon-espace (haut), HTTP 200, hauteur 2541px
- gratuit-aujourdhui-ecran-768.png : /mon-espace (haut), HTTP 200, hauteur 1932px
- gratuit-aujourdhui-ecran-1280.png : /mon-espace (haut), HTTP 200, hauteur 1582px
- gratuit-aujourdhui-ecran-1456.png : /mon-espace (haut), HTTP 200, hauteur 1582px
- gratuit-aujourdhui-ecran-1920.png : /mon-espace (haut), HTTP 200, hauteur 1582px
- en-cours-aujourdhui-ecran-375.png : /mon-espace (haut), HTTP 200, hauteur 3958px
- en-cours-aujourdhui-ecran-768.png : /mon-espace (haut), HTTP 200, hauteur 2794px
- en-cours-aujourdhui-ecran-1280.png : /mon-espace (haut), HTTP 200, hauteur 2119px
- en-cours-aujourdhui-ecran-1456.png : /mon-espace (haut), HTTP 200, hauteur 2119px
- en-cours-aujourdhui-ecran-1920.png : /mon-espace (haut), HTTP 200, hauteur 2119px
- nouvel-aujourdhui-ecran-375.png : /mon-espace (haut), HTTP 200, hauteur 3367px
- nouvel-aujourdhui-ecran-768.png : /mon-espace (haut), HTTP 200, hauteur 2365px
- nouvel-aujourdhui-ecran-1280.png : /mon-espace (haut), HTTP 200, hauteur 1803px
- nouvel-aujourdhui-ecran-1456.png : /mon-espace (haut), HTTP 200, hauteur 1803px
- nouvel-aujourdhui-ecran-1920.png : /mon-espace (haut), HTTP 200, hauteur 1803px
