# Relecture design à l'aveugle, « Aujourd'hui » s25 v7 tour 9

Lu : brief v7, `typo-harmonie-espace-s25.md`, `aujourdhui-refonte-s25.md`, `TAILLES.md` et `INDEX.md` du tour 9, `typo.ts`, `tableau`, `action-du-jour`, `cap-du-jour`, `contenu-du-jour`, `etape-en-cours`, `semaines-tuile`, `hero-apercu`, `offre-apercu`, `extrait-coupe`, `tableau-verrouille`. Captures ouvertes : visiteur 375, 768, 1280 (premier écran et page), 1920 ; gratuit 1280 ; en-cours 768, 1280, 1920 ; nouvel 375, 768, 1280. Aucune relecture existante lue.

## 0. Jugement d'abord : élégant, harmonieux, envie ?

**Abonné (en-cours, nouvel) : oui, c'est soigné.** Une seule famille de cartes (même rayon, même bord 1 px, même padding 24, gouttière 24), un titre à gauche avec la date en dessous, la carte du jour légèrement teintée avec son bouton plein, le reste en gris sobre. Lecture en 3 secondes : « je lance ça » (Z1), « je progresse » (cap, barres), « il y a du contenu ». En plissant les yeux, les 3 éléments sont identifiables : le bouton violet, le titre de la page, la carte Z1. Les bas de rangée sont alignés (Z1 et cap à 1280 : 249 à 447 pour le nouvel abonné ; 235 à 552 pour l'en-cours). Les vides de fin de carte (54 px sous « Commencer », 70 px sous le texte d'aide de Z2) sont des fins de carte, permis. « Tes 4 premières semaines » avec ses lignes alignées en sous-grille est la plus belle surface de la page : elle donne envie de continuer.

**Aperçu verrouillé (visiteur, gratuit) : propre, lisible comme fermé, mais pas encore au niveau de l'accueil.**
- Il se lit fermé : pastille « Premium », verrous, bouton « Commencer » en contour éteint, fondu, « La suite est dans Premium ». Aucune impression d'être dedans. Bouton d'offre en haut à droite dès 1024, en tête de page à 375 et 768. Une seule offre. Un seul violet plein dans le hero.
- Il ne donne pas « super envie » : la valeur est promise en texte (une ligne, six pastilles) puis montrée par des tuiles grises à 75 % d'opacité, un bouton éteint et des barres vides. Le prospect voit une coquille, pas un bénéfice. Aucune image, aucun chiffre vécu, rien de vivant. C'est cohérent avec la règle « pas de donnée simulée », mais l'envie reste tiède. Piste (hors périmètre de cette page, contenu) : une vraie scène ou une vraie vanne dans la tuile du premier pas.
- **L'air de 128 px entre hero et extrait (dès 1024) se lit comme un trou, pas comme une respiration.** Voir faute 1.

## 1. Gate typographique mesurée (citée de `TAILLES.md`)

Sortie de `tailles-comptes.mjs`, `main` seul, premier écran, 4 comptes x 375, 768, 1280, 1920 : les 16 lignes donnent **4 tailles distinctes** (24 puis 30 dès 1024, 20, 16, 14) et **6 combinaisons** (30 ou 24/600 display, 20/600 display, 16/400, 16/600, 14/400, 14/600), graisses 400 et 600 seulement, aucune capitale. Exemple lu : « visiteur 1280 : 4 (30px, 20px, 16px, 14px) | 6 ». Seuils (au plus 4 et au plus 6) respectés : **PASS, pas de faute dure typographique.**

Vérifié au code : `typo.ts` est la source des classes ; `ActionDuJour`, `CapDuJour`, `SemainesTuile`, `ParcoursTuile`, `ContenuDuJour`, `HeroApercu`, `OffreApercu`, `ExtraitCoupe` n'emploient que ses constantes. Le corps mobile 15 px (`CORPS_APPEL_MOBILE`) est retiré du bouton d'offre. Un seul écart de principe, hors mesure : `py-0.5` des pastilles du hero sous 768 (valeur interdite par §2.4 pour les marges verticales ; padding interne de pastille, toléré). Limite de la mesure : elle ne couvre que le premier écran ; à l'œil, le bas de page (contenu du jour, question C9) reste dans les mêmes tailles.
Les tailles sont tenues, mais la hiérarchie de « Contenu du jour » est plate : le H2 de section et les titres des trois cartes sont tous en 20/600 (en-cours 1280, y 847 puis 920). Seul l'espace les distingue. Piste, pas de taille à ajouter.

## 2. Accent violet

- **Abonné** : carte Z1 teintée (`from-accent-primary/10`) avec bord `accent-primary/40`, plus le bouton plein. Conforme à la règle du jour. Rien d'autre de violet dans `main` : barres et segments gris clair, flamme grise, liens blancs. PASS.
- **Aperçu** : le seul violet de `main` est le bouton d'offre (hero) et son jumeau de fin d'extrait. Carte d'offre en gris, Z1 de l'extrait en `TUILE` neutre (le correctif du tour 9 est bien là : bord rgb 42, aucun dégradé). PASS. Réserve : sur un écran de 1080 px de haut ou plus, les deux boutons d'offre (hero y 202, fin y 980) sont visibles ensemble, soit deux aplats pour une même action. Pas une faute (spec UX : même action, deux positions) mais l'air de 128 px a été réglé pour 900 px de haut seulement.
- L'en-tête global (bouton, logo, pastille de notification) est hors périmètre.

## 3. Contrastes et cibles (au code)

- Texte secondaire `#B3B3B3` à `opacity-75` sur carte `#1F1F1F` : environ 5,0:1 (calcul : #8E8E8E sur #1F1F1F), AA tenu même dans l'extrait inerte, qui est de toute façon `aria-hidden`.
- Cibles : bouton d'offre `size lg` (48 px) ; « Connexion » `min-h-11 min-w-11` ; pied de tuile `min-h-12` (48 px) ; « Une autre » et puces C9 mesurées à 44 px (`INDEX.md`) ; liens des cartes `min-h-11`. PASS.
- Les verrous (5 tuiles) sont gris et purement décoratifs, `aria-hidden` côté extrait : sans enjeu.

## 4. Grille design (note /10 par critère, globale = le minimum)

| # | Critère | Note | Justification |
|---|---|---|---|
| 1 | Élégance et fidélité à l'accueil | 8 | Abonné 9 : retenue, alignements, un accent. Aperçu 7 à 8 : propre mais sage, et le trou du hero à 1280 et 1920 casse le rythme. |
| 2 | Hiérarchie (une zone dominante, un accent) | 9 | Abonné : Z1 teintée + bouton plein, très net. Aperçu : l'offre domine en haut à droite ; le second bouton est sous le pli à 900 px. |
| 3 | Usage de la largeur, aucun vide mort | **7** | Bande vide d'environ 128 px, pleine largeur, entre le bas du hero (y 377, texte) et le haut des tuiles (y 505) à 1280, 1456 et 1920 (visiteur, gratuit). Autres vides : fins de carte seulement. 1920 : marges latérales de 352 px, voulues (coque 1216 px alignée sur l'accueil). |
| 4 | Cohérence entre comptes | 9 | Mêmes cartes, mêmes rayons, mêmes titres du visiteur au nouvel abonné ; l'extrait reproduit le tableau du nouvel abonné. Seul écart : la pastille « Premium » est à droite du H1 à 375 et au-dessus dès 768 (voulu, pour le premier écran). |
| 5 | Finition au pixel | 8 | Alignements nets, cibles tenues. Réserves : le titre « Tes 4 premières semaines » (y 512 à 1280) est sans étiquette et démarre 27 px plus haut que « Répartie » (y 539) de sa voisine, deux titres de même taille sur deux lignes de base différentes ; le verrou de Z1 de l'extrait flotte 3 px au-dessus de « 5 min ». |

**Note globale = 7.** Barre de 9 non atteinte, à cause de la faute 1.

## 5. Faute dure

**1. Vide mort entre hero et extrait dès 1024 (`extrait-coupe.tsx`, `lg:mt-32`).**
Preuve : `visiteur-aujourdhui-ecran-1280.png`, bande noire de y 377 à 505 sous « 1 500+ inscrits », large de 1216 px, sans aucun repère. Pas de bloc à cheval, mais rien ne la porte : la colonne de texte du hero n'a pas de cadre, la carte d'offre s'arrête à y 359, donc les deux colonnes finissent sans bas commun et l'air flotte. Il mesure 5 fois les 24 px entre tuiles et 2,7 fois les 48 px de §2.4 ; l'œil y lit une page coupée en deux, pas une respiration. La justification du code (garder le bouton de fin sous le pli à 900 px) est une contrainte de capture, pas un choix de composition. Même rendu à 1456 et 1920, et au gratuit.
Correction codable, sans nouvelle taille ni nouveau texte : donner à l'air un rôle. Dans `ExtraitCoupe`, remonter la légende existante (E, `META`, « Voici un exemple de cette rubrique… ») **au-dessus** de l'extrait comme étiquette de section, centrée sur la grille ou alignée à gauche comme le H1, et passer `lg:mt-32` à `lg:mt-24` : le bas du hero (377), 96 px d'air dont environ 52 de respiration, la légende (environ 20 px, `mb-6`), puis les tuiles. Les tuiles descendent d'environ 12 px, le bouton de fin reste sous le pli (956 vers 968). Le pied de page n'a plus de note orpheline sous le bouton. À arbitrer avec @ux : la spec §2.1 place E sous l'extrait. Option de repli : ancrer le bas du hero, par exemple le filet `border-t border-border` sur toute la largeur à y 489 (`mt-24 border-t pt-8`), qui transforme le vide en séparation de section. Ce qui ferait 10 : bas de hero et haut d'extrait reliés par un repère visible.

## 6. Pistes (non bloquantes)

- **Envie du prospect** : l'extrait ne montre que du gris atténué ; un contenu réel (scène du premier pas déjà là, mais le bouton éteint en contour est le point le plus faible visuellement) fait une aperçu « sage ». Piste de contenu avec @copywriter et @ux, pas de classe à changer.
- **Verrous** : cinq verrous sur les tuiles, alors que la spec §2.2 dit « jamais sur toutes les tuiles » (repli : un verrou nu sur Z1 seule). Avec la pastille, c'est redondant mais discret et gris ; à garder tant que la capture « se lit fermé » est bonne (elle l'est).
- **« Tes 4 premières semaines »** : aligner l'ordonnée du titre sur celle des titres voisins en ajoutant, dans `semaines-tuile.tsx`, une ligne `ETIQUETTE` au-dessus du titre, ou en acceptant l'écart. Corriger l'étiquette serait du texte neuf : à valider.
- **Contenu du jour** : H2 et H3 à égalité (20/600) ; renforcer par l'espace seulement (`mt-12` au-dessus du H2 est déjà là).
- **Texte à vérifier (signalé, non réécrit)** : « Étape 3 sur 3 » avec une barre remplie aux deux tiers (en-cours, `BarreProgression faites=ordre-1`). Cohérent (étapes validées sur total) mais un lecteur attend une barre pleine ; à vérifier avec @ux.
- **768 visiteur** : colonne de texte du hero finie à y 375, carte d'offre à 475 : vide de fin de colonne, permis.

NOTE GLOBALE : 7/10

Fautes dures :
1. Vide mort d'environ 128 px, pleine largeur, entre le hero et l'extrait dès 1024 (visiteur et gratuit, 1280/1456/1920) : donner un rôle à l'air (légende au-dessus de l'extrait et `lg:mt-24`, ou filet de section) dans `apps/web/src/components/espace/apercu/extrait-coupe.tsx` (et `hero-apercu.tsx` si le bas de colonne est ancré).
