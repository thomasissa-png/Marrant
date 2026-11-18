# Relecture UX à l'aveugle : Quoi répondre, s26 tour 2

Captures ouvertes : 4 comptes x 375, 1280, 1920 (12 captures pleine page) ; code lu : `quoi-repondre/page.tsx`, `filtres-situations.tsx` (pour les cibles 44 px et le sticky).

## Gate typographique (`TAILLES.md`, citée)
- Aperçu (visiteur et gratuit, 375/768/1280/1920) : 4 tailles (24 ou 30, 20, 16, 14), 6 combinaisons : à la limite, PASS (seuils : > 4 tailles ou > 6 combinaisons = faute).
- Abonné (en-cours et nouvel, 4 largeurs) : 4 tailles, 5 combinaisons : PASS. Aucune taille hors échelle, aucune capitale visible, un seul aplat violet par écran (« Voir » ; « Premium · 1,99 €/mois » en haut côté aperçu, le second en fin d'extrait est hors premier écran : y 1113 > 900 à 1280, > 812 à 375).

## Prospect (visiteur, gratuit)
- Lecture FERMÉ immédiate : cadenas sur chaque tuile, barres grises, fondu sous la rangée 2, une seule tuile de la rangée 2 visible à 375. Le « dedans » ne se confond pas avec la rubrique ouverte.
- Valeur visible en 3 s : situation « Coloc : la poêle » lisible en clair (scène + réplique lancée), 3 registres fermés (La sûre, La joueuse, La risquée), catalogue montré (12 lieux avec effectifs, 5 intentions). Donne l'envie : on veut savoir ce que dit « La risquée ».
- Offre en haut : 1280, bouton y = 202 ; 375, y ≈ 345 (premier écran), une seule offre pleine avant le fondu. Gratuit : l'encart ajoute la phrase « Premium ouvre tout », hauteur identique à 1280, rien de cassé.
- Promesse du hero : bien placée (sous le titre, avant les pastilles). Les 6 pastilles inertes redondent avec les tuiles dessous (filtres, registres) : léger doublon, pas une faute.
- Vides : situation à 1280/1920, ≈ 100 px sous les 3 registres (y 765 à 870) : fin de carte, permis. Encart d'offre : ≈ 30 px en bas, permis. Aucun vide > 32 px au milieu d'un bloc.

## Abonné (en-cours, nouvel)
- Clarté : la tuile « prochaine action » (titre, 5 min, « Voir » à droite dès 1024, pleine largeur à 375) est la première chose lue, avant les 13 lieux. Rail de filtres ouvert à gauche à 1280/1920 ; repli « Filtrer les cartes » à 375 (carnet gardé visible dessous).
- Envie de continuer : compteur « faits/total » et barre sur chaque lieu (en-cours : Coloc 1/4, « La poêle ✓ Fait » ; la prochaine action saute bien à « C'est quoi, cette odeur ? »). Manque : aucune vue d'ensemble (total faits sur 64) ; 12 barres vides sur 13 à 0/n, effet « mur de zéros » (surtout chez le nouvel).
- Nouvel abonné : jamais une page morte ; tuile « Coloc : la poêle » + « Voir », 0/4 : le premier pas est évident. Même structure que l'abonné avancé (cohérence entre comptes).
- 375 : tout en 1 colonne, prochaine action en premier (« Voir » y ≈ 360). Longueur : 8000 px, lieux tous dépliés.
- Largeur 1920 : contenu à 1216 px centré comme l'en-tête, aucun vide mort. Cellule vide en fin de grille des lieux à 5 éléments : fin de carte, permis.

## Accessibilité
- Pastilles : `min-h-11` (44 px), lien serveur, `aria-current`, focus visible (`filtres-situations.tsx`) : OK. Sommaire du repli 44 px : OK. « Voir » `size="lg"`.
- **Rail sticky trop haut (faute dure chiffrable)** : `page.tsx` l. 112, `lg:[@media(min-height:56rem)]:sticky lg:top-24`. Le rail ouvert mesure ≈ 915 px sur les captures 1280 et 1920 (y 226 à 1144 ; mesure sur capture réduite, ± 10 px). À 1280x900 (viewport 900 > 896, donc sticky actif), l'espace utile sous `top-24` (96 px) est 804 px : ≈ 110 px du bas (dernières pastilles « Pour quoi faire ? » et le lien « Le carnet du mois ») restent hors écran tant que le conteneur n'est pas fini ; ils ne sont atteignables qu'en bas de page. Vrai pour tout viewport de 896 à ≈ 1010 px de haut.

## Notes
| Critère | Note | Défaut / correction |
|---|---|---|
| UX1 prospect : envie en 3 s | 9 | Pastilles du hero redondantes avec les tuiles ; piste : les retirer (`apercu-quoi-repondre.tsx`) pour que le premier écran respire. Ferait 10 : une seule couche d'aperçu des filtres. |
| UX2 abonné : clarté | 9 | La tuile d'action ne dit pas son lieu (le titre « Coloc : … » le porte seulement pour la 1re). Pas de correction textuelle (hors périmètre). |
| UX3 abonné : envie de continuer | 9 | Pas de total global ; mur de barres à 0. Piste : replier les lieux à 0/n sous les 3 premiers (`page.tsx`, `<details>` par lieu) ; ou afficher la somme `faits/total` en `META` à côté du titre de page (données déjà calculées, aucune taille nouvelle). |
| UX4 nouvel abonné | 9 | Même défaut de « mur de zéros » ; aucune différence d'accueil entre premier jour et avancé. |
| UX5 accessibilité et cohérence | 8 | Faute dure 1 ci-dessous. Hors cela : 44 px, focus, `aria-current` PASS. |

## Pistes (non bloquantes)
1. Replier les lieux à 0/n (ou limiter à 3 ouverts) pour raccourcir 8000 px à 375 et casser le mur de zéros.
2. Total global « faits/total » en `META` sur la ligne du titre de page.
3. Retirer les 6 pastilles du hero de l'aperçu : elles dupliquent les tuiles.

NOTE GLOBALE : 8/10

Fautes dures :
1. Rail de filtres sticky ≈ 915 px de haut pour 804 px d'espace utile à 1280x900 : bas du rail (pastilles « Pour quoi faire ? », carnet) inatteignable pendant le défilement. Corriger `apercu` non concerné : `apps/web/src/app/(dashboard)/mon-espace/quoi-repondre/page.tsx` l. 112, remplacer `[@media(min-height:56rem)]` par `[@media(min-height:64rem)]` (1024 px : 928 px utiles > 915 px).
