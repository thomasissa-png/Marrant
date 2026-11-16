# Relecture DESIGN à l'aveugle, « Aujourd'hui » (s25 v7, tour 6)

Captures lues : `docs/captures/s25/v7-aujourdhui-tour-6/aujourdhui/` : visiteur 375 (écran), 1280 (écran + pleine page), 1920 ; gratuit 768 ; en-cours 375 (écran), 1280 ; nouvel 375 (écran), 1280, 1920. Je n'ai pas relu le code ligne à ligne : les constats de code sont déduits du rendu et de la spec `typo-harmonie-espace-s25.md`. Les fichiers à toucher sont indiqués à titre d'orientation.

## 1. Gate typographique mesurée (`TAILLES.md`, tour 6)

Citation : pour les 4 comptes, à 375 et à 1280, « TAILLES DISTINCTES : 4 » (24px puis 30px à 1280, 20px, 16px, 14px) et « COMBINAISONS : 6 » (24 ou 30/600 Jakarta, 20/600 Jakarta, 16/400, 16/600, 14/400, 14/600 Inter). Seuils : 4 tailles et 6 combinaisons, donc **PASS**, 8 lignes sur 8. Toutes les tailles sont dans l'échelle de la spec (14, 16, 20, 24 ou 30). Aucune capitale dans `main`.

Le comptage est bon. Il ne vaut pas verdict d'élégance : je juge le rendu ci-dessous.

## 2. Jugement d'élégance et d'harmonie (d'abord)

Le « gros, agressif, petit par ici, moyen là-bas » est réglé. À 1280, l'ensemble est calme : un titre de page à 30 px qui n'écrase plus rien, des cartes au même rayon, au même padding, au même rythme (gap 24 px), des titres de carte tous à 20 px. On lit une seule voix typographique. C'est net, plus sobre que le tour précédent, et propre.

Ce que je refuse encore d'appeler « soigné » :

1. **Le violet n'est pas un seul.** Le filet violet de 4 px en tête de la carte d'action (Z1) est toujours là sur les 4 comptes. Chez l'abonné et le nouvel abonné, il est répété sur les trois cartes du « Contenu du jour » (Vanne, Conseil, Vidéo). Le nouvel abonné au premier écran à 1280 montre donc le filet de Z1 ET le bouton « Commencer » plein : deux accents violets. La spec §2.1 retire ce filet sur Aujourd'hui, et le brief dit « un seul accent fort par écran, tout second accent est une faute dure ». Ces filets en haut de carte sont aussi ce qui garde un air « template ». En pleine page nouvel 1280, quatre barres violettes se répondent sur une page qui devait être calme.
2. **Z1 est creuse chez visiteur et nouvel abonné** (1280 et 1920). La carte fait environ 200 px, le contenu (étiquette, titre sur 2 lignes, bouton) en occupe 110 : 80 px de vide sous le titre. Un vide de fin de carte est permis, mais c'est la carte DOMINANTE, et elle paraît à moitié vide à côté de « Ton cap ». Entre le titre (qui s'arrête vers 360 px) et « Commencer » (634 px) il y a aussi un trou horizontal de 270 px au milieu de la rangée à 1280 : la rangée titre/bouton ne se lit pas comme un seul bloc.
3. **Hero de l'aperçu (visiteur, gratuit) : colonne gauche vide sous les pastilles**, environ 110 px à 1280 et 1920 (de 330 à 440 px), à côté de la carte d'offre qui descend à 436 px. Le tour 6 a remonté les pastilles sous la promesse, mais la colonne reste un bloc de 120 px de haut posé à côté d'un bloc de 280 px. C'est un vide au milieu de la composition (la rangée « hero » est un seul bloc), pas un vide de fin de carte. À 768, même motif, à moindre échelle.
4. **Chiffre à 20 px dans une phrase à 14 px** (« 1 500+ inscrits bossent leur humour », « 250 XP gagnés ») : la différence de baseline et de poids s'entend comme du « gros par ici, petit là-bas » en miniature. C'est conforme à la spec, mais c'est ce qui fait « moyen là-bas ». Je le note comme piste.
5. **Cohérence des couleurs de texte dans un même bloc** : « Tes 4 premières semaines » (nouvel) a la semaine 1 en blanc et les semaines 2 à 4 en gris ; « Pas moi. » et « Étape 1 sur 4 » sont en blanc plein au milieu de lignes grises. Défendable (accent de lecture), mais cela crée une 3e « voix ».
6. **Verrou sur chaque tuile fermée (5 verrous + 5 verrous dans la bande)** en plus du badge « Premium » du hero. La spec §2.2 réserve ce repli à Z1 seule et interdit « toutes les tuiles ». À 375 et 768 il fait du bruit sans servir : le « fermé » est déjà lu par le fondu, le bouton éteint et « La suite est dans Premium ».

Points forts : cohérence entre comptes (même gabarit de carte, mêmes rayons), l'offre en haut à droite à 1280 et en premier bloc à 375 (lisible fermé en 3 secondes, une seule offre, bouton plein dominant), le bouton figé de Z1 en contour (se lit éteint), la liste du nouvel abonné à 1920 qui utilise la largeur, le premier écran de l'abonné à 375 (« Les cartes du jour » en plein, hiérarchie claire).

## 3. Grille

### Design
| Critère | Note | Défaut / correction codable |
|---|---|---|
| 1 Élégance, fidélité à l'accueil | 7 | Filets violets (voir 2.1), Z1 creuse. Correction : supprimer `FILET_CARTE` sur Z1 et sur les cartes de `contenu-du-jour` (`aujourdhui/tableau.tsx`, `CARTE_ACTION`, composant de carte du contenu du jour, `daily-content` appelé avec une prop sans filet). 10 : aucun violet hors du bouton plein. |
| 2 Hiérarchie, un seul accent | 6 | Second accent violet au premier écran (nouvel, en-cours : filet + bouton). Faute dure. Correction idem. |
| 3 Usage de la largeur, aucun vide mort | 7 | Hero gauche vide (2.3) : ranger les pastilles en bas de la colonne (`lg:self-stretch lg:flex lg:flex-col lg:justify-between` dans `apercu/hero-apercu.tsx`) pour que le bloc occupe la hauteur de l'offre, ou aligner verticalement le bloc texte au centre de la rangée (`lg:items-center`). Z1 : `max-w-none` sur le titre pour qu'il occupe la rangée, et `items-center` sur titre + bouton ; 10 : carte dont la hauteur colle au contenu. |
| 4 Cohérence entre comptes | 8 | Gabarit identique. Reste le blanc/gris des lignes (2.5). |
| 5 Finition au pixel | 8 | Alignements corrects, titres de tuiles alignés à 790 px (visiteur 1280). Lignes inégales en couleur (2.5). Vignette vidéo hors périmètre. |

### UX
| Critère | Note | Remarque |
|---|---|---|
| 1 Prospect : envie en 3 secondes | 8 | Fermé lisible, offre en haut, une seule offre. Le violet en filet dilue légèrement le bouton plein. |
| 2 Abonné : clarté | 9 | « Les cartes du jour » est l'action unique en plein. |
| 3 Abonné : envie de continuer | 8 | Cap, série, XP présents. Pas de signal de progression plus fort (ce n'est pas un défaut de placement). |
| 4 Nouvel abonné | 8 | Jamais une page morte, liste des 4 semaines. Z1 creuse. |
| 5 Accessibilité visible, cohérence | 8 | Contrastes visibles OK, cibles apparentes >= 44 px (boutons de 48 px). Non vérifié au code. |

## 4. Fautes dures

Distinction : faute dure = non conforme au brief ou à la spec ; piste = amélioration.

Fautes dures :
1. Second accent violet : filet de 4 px sur Z1 (tous comptes) et sur les 3 cartes du « Contenu du jour » (abonné, nouvel), à retirer. Fichiers : `apps/web/src/components/espace/aujourdhui/tableau.tsx` (`CARTE_ACTION`/filet), `contenu-du-jour.tsx`, `carte/styles.ts` seulement si le filet y est fixé pour Aujourd'hui.

Pistes (pas fautes dures) : vide du hero gauche (2.3), Z1 creuse et trou titre/bouton (2.2), verrous sur toutes les tuiles (`apercu/tuile-fermee.tsx`, spec §2.2), lignes blanc/gris des semaines (`dans-ton-espace.tsx` ou `semaines-tuile.tsx`), chiffres 20 px dans une phrase 14 px.

Gate typographique : aucune faute (4 tailles, 6 combinaisons).

NOTE GLOBALE : 6/10

Fautes dures :
1. Second accent violet (filet en tête de Z1 et des cartes du contenu du jour) : `apps/web/src/components/espace/aujourdhui/tableau.tsx`, `contenu-du-jour.tsx`.
