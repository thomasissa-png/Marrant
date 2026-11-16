# Captures aujourdhui (2026-11-16, http://localhost:5400)

Tour 13 (décision de Thomas du 16/11, « vas-y je te fais confiance » : l'aperçu vend les RÉPLIQUES). Régime ouvert seulement, aucun texte nouveau hors T1 (validé par Thomas le 16/11), aucune taille ni combinaison ajoutée (`TAILLES.md`).
(1) Extrait, carte « Ton premier pas » = vitrine des répliques : la situation une seule fois (le titre, la scène qui la répétait est retirée), puis les trois répliques de la fiche par défaut en cartes fermées (« La sûre », « La joueuse », « La risquée », verrou, deux barres `bg-border`) ; le texte des répliques n'est pas dans le HTML (test Jest) ; plus de bouton éteint ; carte neutre et nette. (2) En-tête : bouton d'offre masqué sur `/mon-espace` (visiteur et gratuit, toutes largeurs), présent ailleurs. (3) H1 de l'aperçu en texte dégradé (`text-gradient` de l'accueil), même 24/30 px. (4) Légende à 48 px de la carte d'offre (carte étirée au bas du hero dès 1024). (5) Abonné : bouton de Z1 à gauche sous le texte pour tous (nouvel abonné : titre, scène, bouton). T1 : « Cinq minutes par jour pour oser répondre au lieu de te taire. » (B : 1 ligne à 1280, 2 à 375).

## Mesures du tour 13 (préversion 5400, `a13-mesure.mjs`)

| Mesure | Avant (tour 12) | Après (tour 13) |
|---|---|---|
| Z1 de l'extrait | titre + scène (même réplique deux fois) + bouton éteint « Commencer » | titre seul + 3 répliques fermées (côte à côte dès 768, empilées dessous, 16 px entre elles) |
| Texte des répliques dans le HTML de `/mon-espace` | absent (non montré) | absent (0 occurrence, `curl` et test Jest) ; libellés seuls |
| 375 x 812 : situation / 1re réplique fermée / bouton d'offre | Z1 entière, bas à 784 | situation 612-696, réplique 1 dès 712 (libellé bas 749) ; gratuit 624-708, 724 (761) ; offre 322-370 |
| Bouton d'offre de l'en-tête sur `/mon-espace` (visiteur, gratuit) | présent, à côté de celui de la page | masqué (375 à 1920) ; présent sur `/`, `/vannes`, `/mon-espace/quoi-repondre` |
| H1 « Aujourd'hui » de l'aperçu | blanc, 24/30 px | dégradé de l'accueil (#A78BFA vers #7C3AED, texte découpé), 24/30 px |
| 1280, 1456, 1920 x 900 : carte d'offre vers légende | 82 px (visiteur), 70 (gratuit) | 48 px (visiteur et gratuit) ; 48 aussi à 768 et 1024 |
| 1280, 1456, 1920 x 900 : phrase / bouton de fin | 919 / 963 | 917 / 961 (sous le pli) |
| Z1 nouvel abonné 768 et 1280 | scène à gauche, bouton en bas à droite | titre, scène 8 px dessous, bouton à gauche 16 px dessous (comme la rafale) |

## Pleine page

- visiteur-aujourdhui-375.png : /mon-espace (page), HTTP 200, hauteur 2706px
- visiteur-aujourdhui-768.png : /mon-espace (page), HTTP 200, hauteur 2015px
- visiteur-aujourdhui-1280.png : /mon-espace (page), HTTP 200, hauteur 1543px
- visiteur-aujourdhui-1456.png : /mon-espace (page), HTTP 200, hauteur 1543px
- visiteur-aujourdhui-1920.png : /mon-espace (page), HTTP 200, hauteur 1543px
- gratuit-aujourdhui-375.png : /mon-espace (page), HTTP 200, hauteur 2718px
- gratuit-aujourdhui-768.png : /mon-espace (page), HTTP 200, hauteur 2047px
- gratuit-aujourdhui-1280.png : /mon-espace (page), HTTP 200, hauteur 1543px
- gratuit-aujourdhui-1456.png : /mon-espace (page), HTTP 200, hauteur 1543px
- gratuit-aujourdhui-1920.png : /mon-espace (page), HTTP 200, hauteur 1543px
- en-cours-aujourdhui-375.png : /mon-espace (page), HTTP 200, hauteur 4018px
- en-cours-aujourdhui-768.png : /mon-espace (page), HTTP 200, hauteur 2620px
- en-cours-aujourdhui-1280.png : /mon-espace (page), HTTP 200, hauteur 2119px
- en-cours-aujourdhui-1456.png : /mon-espace (page), HTTP 200, hauteur 2119px
- en-cours-aujourdhui-1920.png : /mon-espace (page), HTTP 200, hauteur 2119px
- nouvel-aujourdhui-375.png : /mon-espace (page), HTTP 200, hauteur 3363px
- nouvel-aujourdhui-768.png : /mon-espace (page), HTTP 200, hauteur 2486px
- nouvel-aujourdhui-1280.png : /mon-espace (page), HTTP 200, hauteur 1827px
- nouvel-aujourdhui-1456.png : /mon-espace (page), HTTP 200, hauteur 1827px
- nouvel-aujourdhui-1920.png : /mon-espace (page), HTTP 200, hauteur 1827px

## Premier écran (fenêtre seule ; 812 px de haut à 375, 900 px au-delà)

- visiteur-aujourdhui-ecran-375.png : /mon-espace (haut), HTTP 200, hauteur 2706px
- visiteur-aujourdhui-ecran-768.png : /mon-espace (haut), HTTP 200, hauteur 2015px
- visiteur-aujourdhui-ecran-1280.png : /mon-espace (haut), HTTP 200, hauteur 1543px
- visiteur-aujourdhui-ecran-1456.png : /mon-espace (haut), HTTP 200, hauteur 1543px
- visiteur-aujourdhui-ecran-1920.png : /mon-espace (haut), HTTP 200, hauteur 1543px
- gratuit-aujourdhui-ecran-375.png : /mon-espace (haut), HTTP 200, hauteur 2718px
- gratuit-aujourdhui-ecran-768.png : /mon-espace (haut), HTTP 200, hauteur 2047px
- gratuit-aujourdhui-ecran-1280.png : /mon-espace (haut), HTTP 200, hauteur 1543px
- gratuit-aujourdhui-ecran-1456.png : /mon-espace (haut), HTTP 200, hauteur 1543px
- gratuit-aujourdhui-ecran-1920.png : /mon-espace (haut), HTTP 200, hauteur 1543px
- en-cours-aujourdhui-ecran-375.png : /mon-espace (haut), HTTP 200, hauteur 4018px
- en-cours-aujourdhui-ecran-768.png : /mon-espace (haut), HTTP 200, hauteur 2620px
- en-cours-aujourdhui-ecran-1280.png : /mon-espace (haut), HTTP 200, hauteur 2119px
- en-cours-aujourdhui-ecran-1456.png : /mon-espace (haut), HTTP 200, hauteur 2119px
- en-cours-aujourdhui-ecran-1920.png : /mon-espace (haut), HTTP 200, hauteur 2119px
- nouvel-aujourdhui-ecran-375.png : /mon-espace (haut), HTTP 200, hauteur 3363px
- nouvel-aujourdhui-ecran-768.png : /mon-espace (haut), HTTP 200, hauteur 2486px
- nouvel-aujourdhui-ecran-1280.png : /mon-espace (haut), HTTP 200, hauteur 1827px
- nouvel-aujourdhui-ecran-1456.png : /mon-espace (haut), HTTP 200, hauteur 1827px
- nouvel-aujourdhui-ecran-1920.png : /mon-espace (haut), HTTP 200, hauteur 1827px
