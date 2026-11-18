# Relecture UX à l'aveugle, Favoris et Carnet, s26 tour 3

Périmètre : captures `docs/captures/s26/encarts-favoris-carnet-tour-3/{favoris,carnet,carnet-fenetres}` (visiteur, gratuit, en-cours, nouvel ; 375, 768, 1280, 1920 ouvertes, 1456 non ouverte). Code lu : `rail-carnet.tsx`, `carnet-ouvert.tsx`, `favoris-abonne.tsx`, `cartes-abonne.tsx`, `carte/styles.ts`. Aucune relecture existante lue.

## Gate typographique (TAILLES.md cité, premier écran, tailles / combinaisons)

| Page | visiteur | gratuit | en-cours | nouvel |
|---|---|---|---|---|
| Favoris 375 | 4 / 6 | 4 / 6 | 4 / 6 | 3 / 5 |
| Favoris 1280 | 4 / 6 | 4 / 6 | 4 / 6 | 3 / 5 |
| Carnet 375 | 4 / 5 | 4 / 5 | 3 / 4 | 3 / 4 |
| Carnet 1280 | 4 / 6 | 4 / 6 | 3 / 4 | 3 / 4 |

Seuils (4 tailles, 6 combinaisons) respectés partout, échelle 30/24, 20, 16, 14 en 600 et 400, aucune capitale dans les pages (les capitales PRODUIT/LÉGAL du pied sont hors périmètre). Gate PASS. Aucune taille ajoutée.

## FAVORIS

### Prospect (visiteur et gratuit, cohérents)
- 1280 : hero 8/4, bouton d'offre y = 203 (< 450), un seul aplat dans le premier écran 900 px ; extrait vanne 5/7 + conseil replié (2 lignes) ; tuile « Vidéo » fermée pleine largeur ; carte de fin y = 910 à 1108 (> 900). Hauteur de page 1 643 px (≤ 2 000). 0 bloc « Exemple ». Lecture « fermé » : verrous sur chaque carte, fondu sous la vidéo. Le prospect voit un vrai favori en 3 secondes, l'offre est en haut.
- 375 : bouton y = 277 (< 700), vanne, conseil, fondu, carte de fin. Lisible, une seule offre à l'écran à la fois.
- 768 : hero 3/2 avec offre en ligne, 6/6 vanne et conseil, tuile vidéo, fin. Propre.
- Gratuit : même structure, seule la réassurance change (pas de « Connexion »). Cohérent.
- Pistes (pas des fautes) : (a) à 375 les pastilles Tout/Vannes/Conseils/Vidéos du hero n'apparaissent pas, alors qu'elles sont présentes à 768 et plus : incohérence de largeur, à confirmer avec la spec design ; (b) à 1280, 100 px vides entre le fondu de la tuile vidéo (y ≈ 810) et la carte de fin (y = 910) : entre deux blocs, donc permis, mais c'est le seul « trou » de la page.

### Abonné en-cours (3 favoris)
- 1280 : titre à gauche, rail 3 col (Tout 3, Vannes 2, Conseils 1, Vidéos 0, actif = filet 2 px blanc, pas d'aplat), liste 9 col : carte de tête dépliée sur 12 (chute, réactions, Partager, Retirer), puis conseil et vanne 6/6. Aucun aplat violet (la teinte de la carte de tête est la zone d'accent documentée de `CARTE_ACTION`). Je sais quoi faire : relire la dernière pépite. 1920 : même grille dans 1 216 px, pas de colonne centrée seule.
- Vide de fin de colonne (vanne 251 px contre conseil 303 px) : permis.
- 375 : onglets défilants, cartes en 1 col, bien ordonnées.

### Abonné nouvel
- État vide : étoile, titre, phrase, un seul bouton plein « Explorer les vannes » (seul aplat). Jamais une page morte. Rail à 0 partout, cohérent.

### Notes UX Favoris
1. Prospect, envie en 3 s : 9 (fermé lisible, offre en haut, une offre ; piste (a)).
2. Abonné, clarté : 9.
3. Abonné, envie de continuer : 9 (tête dépliée, effectifs par onglet ; pas de série, voulu par la spec).
4. Nouvel abonné : 9.
5. Accessibilité et cohérence : 8, à cause de la faute dure 1 ci-dessous.

## CARNET

### Prospect (visiteur et gratuit)
- 1280 : kicker en 14 sans capitales, titre blanc, intro, bouton d'offre à y = 203 dans la carte d'offre 4 col, tuile « Au programme » (3 titres verrouillés + « Et 26 autres répliques ») sous l'offre, fiche offerte 8 col avec « On te dit » visible à y = 675 dans le premier écran, carte de fin à y = 987 (> 900). Le carnet paraît riche (30 situations nommées, une fiche entière). Largeur utile 1 216 px (≥ 1 100).
- 375 : bouton y = 227 en capture réduite, soit environ 372 px réels (< 700) ; programme, fiche en 1 col, bloc d'appel. 
- Piste : à 1280, la colonne de droite sous « Au programme » est vide sur environ 230 px (programme 420 à 731, fiche jusqu'à 962). Vide de fin de colonne, permis, et la tuile est collante (voir faute 1).

### Abonné (en-cours et nouvel identiques)
- 1280 fenêtre 1 : titre, intro, sommaire en tuiles 4/4/4 (numéro, titre 16/600, contexte), première tuile avec filet blanc ; 4 rangées visibles. Aucun aplat, aucun bouton plein : lieu de référence, conforme. Pas de progression (voulu).
- Milieu et bas (1280) : rail 3 col collant qui suit la fiche courante (17, puis 30) : la ligne courante reste visible (correctif tour 2 effectif), fiche en 9 col sur 2 colonnes internes, « Retour au sommaire » à gauche après chaque fiche (lien 44 px via `LIEN_NEUTRE`), puis « Les carnets précédents » aligné à gauche.
- Faute observée : le haut du rail est coupé sous l'en-tête (item « 2. Le voisin en bonnet » rogné à y = 118, bordure haute du rail invisible) ; cause dans le code, voir faute 1.
- 375 : sommaire en liste de 30 lignes (≥ 44 px) dans une carte, puis fiches 1 col ; « Retour au sommaire » à 44 px. Long mais ordonné.

### Notes UX Carnet
1. Prospect, envie en 3 s : 9.
2. Abonné, clarté : 9 (30 tuiles, la première marquée).
3. Abonné, envie de continuer : 9 (position courante dans le rail ; pas de « lu », voulu).
4. Nouvel abonné : 9 (arrive sur le sommaire, première fiche marquée).
5. Accessibilité et cohérence : 8, faute dure 1.

## Fautes dures (chiffrables)
1. Les éléments collants (rail Favoris, rail Carnet, tuile « Au programme ») se collent à `top-24` = 96 px alors que l'en-tête collant mesure 120 px : 24 px de carte masqués sous l'en-tête, rail rogné en haut (item 2 coupé à y = 118 en capture milieu et bas, 1280). Corriger : `lg:top-24` devient `lg:top-32` (128 px, 8 px d'air) dans `favoris-abonne.tsx` (ligne 112), `carnet-ouvert.tsx` (lignes 106 et 193) et ajuster `max-h-[calc(100vh-7rem)]` de `rail-carnet.tsx` (ligne 58) en `calc(100vh-9rem)`. Ce qui ferait 10 : rail entier visible à tout moment du défilement, bordure haute comprise.

NOTE GLOBALE Favoris : 8/10
NOTE GLOBALE Carnet : 8/10

Liste des fautes dures :
1. Éléments collants à 96 px sous un en-tête de 120 px (24 px masqués) : `apps/web/src/components/espace/favoris/favoris-abonne.tsx`, `apps/web/src/components/espace/carnet/carnet-ouvert.tsx`, `apps/web/src/components/espace/carnet/rail-carnet.tsx`.
