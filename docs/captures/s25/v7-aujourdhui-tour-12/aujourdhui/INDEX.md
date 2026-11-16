# Captures aujourdhui (2026-11-16, http://localhost:5400)

Tour 12 (relectures du tour 11 : design 7/10, UX 6/10, deux fautes dures UX). Aucun texte nouveau, aucune taille ni combinaison ajoutée (`TAILLES.md`). (1) Extrait : la tuile du contenu du jour montre la première vanne gratuite du catalogue (page 1 de `/vannes`, même source que l'aperçu de Favoris, lue côté serveur par la page) : étiquette « Vanne du jour », énoncé puis chute, 4 lignes au plus (au-delà de 3, la 4e s'efface ; coupe entre deux lignes, jamais dans un mot). Sans vanne (base indisponible) : les trois libellés d'avant. (2) « Ton cap » sans chiffres à 768 (visiteur, gratuit, nouvel) : plus de bandeau, barre pleine largeur, phrase de série dessous sous un filet, verrou seul sur la ligne de l'étiquette. (3) Z1 « Ton premier pas » (nouvel abonné et extrait) : dès 768, la scène réelle de la fiche du premier pas (`contenu.scene.texte` de « Amis : Tu as changé quelque chose, non ? ») à gauche du bouton, 32 px entre eux, bas alignés ; masquée sous 768. (4) Bouton éteint de l'extrait : texte gris secondaire, même 16/600, bord fin gardé. (5) Légende : 64 px au-dessus, 24 px dessous dès 1024. (6) « Semaine n : » en 14/600 gris secondaire. (7) Pastilles du hero : `px-2 py-0.5` retirés.

## Mesures du tour 12 (préversion 5400, `a12-mesure.mjs`)

| Mesure | Avant (tour 11) | Après (tour 12) |
|---|---|---|
| Tuile « Contenu du jour » de l'extrait | 3 libellés (« Vanne du jour », « Conseil du jour », « Vidéo du jour ») | « Vanne du jour » puis la vanne réelle : 3 lignes à 1280 et 1920 (53 à 125 px du haut de la suite, fondu dès 144, transparent à 168) ; 4 lignes à 1024 (4e dans le fondu) |
| « Ton cap » 768 (visiteur, gratuit, nouvel) : barre / largeur intérieure | 320 / 670 (350 px vides à droite) | 670 / 670 (25 px de bord et marge de chaque côté) |
| « Ton cap » 768 : phrase de série | en haut à droite, à 8 px du verrou | sous la barre (154 px du haut de la carte), toute la largeur ; verrou à 8 px au moins de tout texte (test en vrai navigateur) |
| « Ton cap » 768, abonné avancé (chiffres) | bandeau | inchangé (cases à droite) |
| Z1 1280 et 1920 (nouvel, visiteur) : vide à droite du bouton | environ 395 px (bouton de 256 seul à gauche) | 0 (scène 361 px sur 4 lignes, 32 px, bouton 256 au bord droit) |
| Z1 1280 et 1920 : vide sous le bouton | 50 px | 0 (carte de 210 px, scène et bouton bas alignés) |
| Z1 768 (nouvel, visiteur) | bouton 176 seul à gauche (environ 490 px vides) | scène 462 px sur 3 lignes, 32 px, bouton au bord droit |
| Z1 375 | titre puis bouton pleine largeur | inchangé (scène masquée) ; tuile Z1 entière au premier écran (bas à 784 visiteur) |
| Bouton éteint de l'extrait : couleur du texte | rgb(255, 255, 255) | rgb(179, 179, 179), environ 7,9:1 sur la tuile (calculé) |
| 1024 à 1920 x 900 : hero / légende / tuiles | 48 / 40 px | 64 / 24 px |
| 1280, 1456, 1920 x 900 : phrase / bouton de fin | 908 / 952 | 919 / 963 (sous le pli ; rangée 1 plus haute de 11 px) |
| « Tes 4 premières semaines » : titre / préfixes | 14/600 gris / 14/600 blanc | 14/600 gris / 14/600 gris |

Les « avant » viennent de `INDEX.md` du tour 11 et des relectures du tour 11.

## Pleine page

- visiteur-aujourdhui-375.png : /mon-espace (page), HTTP 200, hauteur 2416px
- visiteur-aujourdhui-768.png : /mon-espace (page), HTTP 200, hauteur 1977px
- visiteur-aujourdhui-1280.png : /mon-espace (page), HTTP 200, hauteur 1545px
- visiteur-aujourdhui-1456.png : /mon-espace (page), HTTP 200, hauteur 1545px
- visiteur-aujourdhui-1920.png : /mon-espace (page), HTTP 200, hauteur 1545px
- gratuit-aujourdhui-375.png : /mon-espace (page), HTTP 200, hauteur 2428px
- gratuit-aujourdhui-768.png : /mon-espace (page), HTTP 200, hauteur 2009px
- gratuit-aujourdhui-1280.png : /mon-espace (page), HTTP 200, hauteur 1545px
- gratuit-aujourdhui-1456.png : /mon-espace (page), HTTP 200, hauteur 1545px
- gratuit-aujourdhui-1920.png : /mon-espace (page), HTTP 200, hauteur 1545px
- en-cours-aujourdhui-375.png : /mon-espace (page), HTTP 200, hauteur 4018px
- en-cours-aujourdhui-768.png : /mon-espace (page), HTTP 200, hauteur 2620px
- en-cours-aujourdhui-1280.png : /mon-espace (page), HTTP 200, hauteur 2119px
- en-cours-aujourdhui-1456.png : /mon-espace (page), HTTP 200, hauteur 2119px
- en-cours-aujourdhui-1920.png : /mon-espace (page), HTTP 200, hauteur 2119px
- nouvel-aujourdhui-375.png : /mon-espace (page), HTTP 200, hauteur 3363px
- nouvel-aujourdhui-768.png : /mon-espace (page), HTTP 200, hauteur 2446px
- nouvel-aujourdhui-1280.png : /mon-espace (page), HTTP 200, hauteur 1811px
- nouvel-aujourdhui-1456.png : /mon-espace (page), HTTP 200, hauteur 1811px
- nouvel-aujourdhui-1920.png : /mon-espace (page), HTTP 200, hauteur 1811px

## Premier écran (fenêtre seule ; 812 px de haut à 375, 900 px au-delà)

- visiteur-aujourdhui-ecran-375.png : /mon-espace (haut), HTTP 200, hauteur 2416px
- visiteur-aujourdhui-ecran-768.png : /mon-espace (haut), HTTP 200, hauteur 1977px
- visiteur-aujourdhui-ecran-1280.png : /mon-espace (haut), HTTP 200, hauteur 1545px
- visiteur-aujourdhui-ecran-1456.png : /mon-espace (haut), HTTP 200, hauteur 1545px
- visiteur-aujourdhui-ecran-1920.png : /mon-espace (haut), HTTP 200, hauteur 1545px
- gratuit-aujourdhui-ecran-375.png : /mon-espace (haut), HTTP 200, hauteur 2428px
- gratuit-aujourdhui-ecran-768.png : /mon-espace (haut), HTTP 200, hauteur 2009px
- gratuit-aujourdhui-ecran-1280.png : /mon-espace (haut), HTTP 200, hauteur 1545px
- gratuit-aujourdhui-ecran-1456.png : /mon-espace (haut), HTTP 200, hauteur 1545px
- gratuit-aujourdhui-ecran-1920.png : /mon-espace (haut), HTTP 200, hauteur 1545px
- en-cours-aujourdhui-ecran-375.png : /mon-espace (haut), HTTP 200, hauteur 4018px
- en-cours-aujourdhui-ecran-768.png : /mon-espace (haut), HTTP 200, hauteur 2620px
- en-cours-aujourdhui-ecran-1280.png : /mon-espace (haut), HTTP 200, hauteur 2119px
- en-cours-aujourdhui-ecran-1456.png : /mon-espace (haut), HTTP 200, hauteur 2119px
- en-cours-aujourdhui-ecran-1920.png : /mon-espace (haut), HTTP 200, hauteur 2119px
- nouvel-aujourdhui-ecran-375.png : /mon-espace (haut), HTTP 200, hauteur 3363px
- nouvel-aujourdhui-ecran-768.png : /mon-espace (haut), HTTP 200, hauteur 2446px
- nouvel-aujourdhui-ecran-1280.png : /mon-espace (haut), HTTP 200, hauteur 1811px
- nouvel-aujourdhui-ecran-1456.png : /mon-espace (haut), HTTP 200, hauteur 1811px
- nouvel-aujourdhui-ecran-1920.png : /mon-espace (haut), HTTP 200, hauteur 1811px
