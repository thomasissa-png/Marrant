# Relecture UX à l'aveugle, Favoris et Carnet, s26 tour 2

Méthode : brief v7, specs UX et design s26, captures `docs/captures/s26/encarts-favoris-carnet-tour-2/`. Ouvertes : Favoris visiteur (375, 1280, 1920), en-cours (375, 1280), nouvel (1280) ; Carnet visiteur (375, 1280), fenêtres abonné en-cours (1280 : 3 positions ; 375 nouvel : premier écran). Gratuit et le reste des largeurs : jugés par `TAILLES.md` (métriques identiques au visiteur), pas ouverts. Code lu : `rail-carnet.tsx`, `cartes-abonne.tsx`.

## Gate TAILLES.md (citée)
| Page, compte | 375 | 1280 |
|---|---|---|
| Favoris visiteur / gratuit | 4 tailles (24, 20, 16, 14), 6 combinaisons | 4 tailles (30, 20, 16, 14), 6 combinaisons |
| Favoris en-cours | 4 tailles, 6 combinaisons | 4 tailles, 6 combinaisons |
| Favoris nouvel | 3 tailles, 5 combinaisons | 3 tailles, 5 combinaisons |
| Carnet visiteur / gratuit | 4 tailles, 5 combinaisons | 4 tailles, 6 combinaisons |
| Carnet en-cours / nouvel | 3 tailles, 4 combinaisons | 3 tailles, 4 combinaisons |
Limites (4 tailles, 6 combinaisons) respectées partout, toutes dans l'échelle 14/16/20/24-30, graisses 400/600. Les 🔥 et 💀 comptés en 14/600 sont les réactions existantes (`ReactionButtons`), pas une taille hors échelle.

## FAVORIS

### Constats (captures)
- Aperçu 1280 : bouton d'offre y = 203 (< 450), hero 8/4, vanne 5 col et conseil 7 col de même hauteur (193 px), conseil replié, plus de bloc « Exemple », vidéo en tuile fermée, fin d'extrait y = 964 (> 900). Hauteur de page 1 604 px (<= 2 000). Un seul aplat par écran (le second est sous le pli). Fermé lisible : verrous, fondu, pastille Premium. 375 : bouton y = 276 (< 700), vanne et conseil visibles au premier écran.
- Abonné en-cours 1280 : titre à gauche, rail 3 col (onglets avec effectifs, filet blanc, pas d'aplat), liste 9 col, carte de tête teintée (CARTE_ACTION) dépliée avec chute et réactions, deux cartes 6/6 de hauteur propre (plus de vide étiré). Aucun aplat violet (juste le soulignement global de la bande, validé).
- Nouvel 1280 : rail à 0, carte vide (étoile, phrase existante, bouton « Explorer les vannes » 44 px = seul aplat). Jamais une page morte. Vide sous la carte vide (rail plus haut) = vide de fin de colonne, permis.
- 375 abonné : onglets défilants avec flèche de suite visible, cartes 1 col, effectifs lisibles.

### Grille UX
| Critère | Note | Défaut précis et correction |
|---|---|---|
| 1 Prospect, envie en 3 s | 9 | Offre en haut, fermé lisible, vrai favori visible. Défaut : les 4 pastilles du hero (Tout, Vannes, Conseils, Vidéos) ont la forme de filtres cliquables alors qu'elles sont inertes (`visiteur-favoris-1280.png`, y = 311). Correction : dans le hero `ApercuVerrouille`, `pointer-events-none` + `aria-hidden` + `opacity-75`, comme les tuiles fermées. 10 = pastilles lues comme décor. |
| 2 Abonné, clarté | 9 | La carte de tête dépliée dit quoi faire. Défaut : « Partager » est une icône seule (cercle de 32 px visuel, `-ml-2.5`) à côté du mot « Retirer » : deux actions de formes différentes. Piste : libellé « Partager » = texte à valider par Thomas. Zone de clic à vérifier à 44 px au code (`ShareButton`). |
| 3 Abonné, envie de continuer | 9 | Effectifs par onglet comme progression, voulu. Défaut : les réactions gardent des emojis (🔥 💀) alors que la spec retire les emojis ; c'est un composant partagé, donc piste, pas faute. |
| 4 Nouvel abonné | 9 | État vide propre, bouton unique. 10 = un second lien (Conseils, Vidéos) serait du texte neuf, donc non proposé. |
| 5 Accessibilité, cohérence | 9 | Focus visible, onglets au clavier, cibles 44 px visibles. Cohérence visiteur / abonné bonne (même gabarit de carte). |

NOTE UX Favoris (minimum) : 9/10. Aucune faute dure chiffrable.

### Pistes Favoris (3 max)
1. Pastilles du hero inertes : `pointer-events-none`, `aria-hidden`, `opacity-75` (`apercu-verrouille.tsx`).
2. Libellé visible sur « Partager » : TEXTE À VALIDER par Thomas (aucun texte neuf sans lui).
3. Réactions : remplacer 🔥 💀 par les icônes de la bande dans `ReactionButtons` `echelle="espace"` (composant partagé, à arbitrer avec Thomas).

## CARNET

### Constats (captures)
- Visiteur 1280 : hero 8/4, bouton y = 203, tuile « Au programme » (3 titres verrouillés, « Et 26 autres répliques ») à droite, fiche offerte 8 col (« On te dit » visible à y = 689), fin d'extrait y = 1 130 (> 900). Vide sous la tuile programme (y 745 à 975) et sous « Tu réponds » (environ 95 px) : fins de colonne, permis. 375 : titre, intro, bouton y = 276, programme, fiche 1 col dans l'ordre contexte, on te dit, tu réponds, pourquoi, bloc d'appel. Un seul aplat au premier écran.
- Abonné 1280 premier écran : en-tête à gauche, sommaire 4/4/4 en tuiles (numéro, titre, contexte), tuile 1 avec filet blanc, aucun aplat (3 tailles, 4 combinaisons).
- Abonné milieu de fiche 1280 : rail 3 col sticky, fiche 9 col en 2 colonnes, « Retour au sommaire » à gauche, 44 px. Bas de page : carnets précédents en pastille à gauche. Bon.
- Abonné 375 : tuiles 1 col, 16 px de marge (C4), compactes.

### Faute dure chiffrable
Le rail sticky (`apps/web/src/components/espace/carnet/rail-carnet.tsx`, ligne 38) est `max-h-[calc(100vh-7rem)] overflow-y-auto` sans aucun défilement automatique vers la ligne courante (aucun `scrollIntoView` ni `scrollTo` dans l'effet, lignes 19 à 35). À 1280x900 le rail montre 17 lignes sur 30 (`en-cours-carnet-1280-2-milieu-fiche.png`, `...-3-bas-de-page.png` : dernière ligne visible « 17. Des piles et un mystère » alors qu'on est au bas de la page, fiche 30). Donc pour les fiches 18 à 30 (13 sur 30, 43 %) le repère « où suis-je » est hors de la vue : la fonction du rail échoue. Correction : dans `useEffect` de `RailCarnet`, après `setCourante`, faire `ref.current?.querySelector('[aria-current="location"]')?.scrollIntoView({ block: "nearest" })` (ref sur le `<nav>`), sans changer les classes du thème. 10 = marqueur toujours visible dans le rail aux 30 fiches.

### Grille UX
| Critère | Note | Défaut précis et correction |
|---|---|---|
| 1 Prospect, envie en 3 s | 9 | Offre en haut, valeur visible (une vraie fiche), liste du programme verrouillée, une seule offre au premier écran. Défaut léger : les 2 colonnes de la fiche donnent un bas de colonne gauche vide de 95 px (permis). 10 = rien à corriger au code, tient. |
| 2 Abonné, clarté | 8 | Faute dure ci-dessus (rail). Aussi : sur la tuile 1 seul un filet blanc dit « commence ici », sans mot (piste, texte à valider). |
| 3 Abonné, envie de continuer | 9 | Pas de progression : voulu (aucune donnée lue). Sommaire en tuiles donne l'envie d'ouvrir. 10 = suivi « lu » absent par décision, donc 9. |
| 4 Nouvel abonné | 9 | Même sommaire que l'abonné avancé, jamais une page morte ; le premier jour tout est ouvert et lisible. |
| 5 Accessibilité, cohérence | 9 | Tuiles >= 44 px, `aria-current`, focus visible. Rail : lignes à 2 lignes de texte (« La promesse à la / boulangère ») plus serrées que les lignes simples (`...-2-milieu-fiche.png`, y 221 à 285) : piste d'espacement (`py-1` sur `<a>`). |

NOTE UX Carnet (minimum) : 8/10, retenue par la faute dure du rail.

### Pistes Carnet (3 max)
1. Rail : défilement auto vers la ligne courante (fait lever la faute dure).
2. 375 : le sommaire pèse environ 4 100 px avant la première fiche (INDEX : 4 116 px). Passer les tuiles en ligne (numéro + titre, contexte à droite, `min-h-11`) sous 768 px pour environ 1 700 px, sans texte neuf (`carnet-ouvert.tsx`).
3. Tuile 1 : un mot « Commence ici » serait un texte neuf, à soumettre à Thomas ; sinon laisser le filet blanc.

NOTE GLOBALE Favoris : 9/10
NOTE GLOBALE Carnet : 8/10

Fautes dures (numérotées) :
1. Carnet abonné, 1280x900 : le rail (`apps/web/src/components/espace/carnet/rail-carnet.tsx`) ne suit pas la ligne courante, 13 fiches sur 30 (43 %) sans repère visible.
