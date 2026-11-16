# Relecture DESIGN à l'aveugle, « Aujourd'hui » s25 v7, tour 7

Relu : brief v7, `typo-harmonie-espace-s25.md`, `aujourdhui-refonte-s25.md` (début), `TAILLES.md`, `INDEX.md`, l'étalon `visiteur-accueil-1280.png`, les captures des 4 comptes (visiteur et nouvel à 375, 768, 1280, 1920 ; gratuit à 375 et 1280 en premier écran ; en-cours à 375, 768, 1280, 1920), et le code : `typo.ts`, `carte/styles.ts`, `aujourdhui/{tableau,action-du-jour,cap-du-jour,contenu-du-jour,mission-lien}.tsx`, `apercu/{hero-apercu,offre-apercu,extrait-coupe,tableau-verrouille}.tsx`. Non ouvertes : les captures 1456, `etape-en-cours.tsx`, `vanne-toucher.tsx`, `tuile-fermee.tsx`, `badge-premium.tsx`. Les cibles et contrastes ci-dessous sont donc jugés sur ce que j'ai lu et sur les captures.

## 1. Gate typographique MESURÉE (TAILLES.md, tour 7)

Citée telle quelle : 8 lignes sur 8, **4 tailles distinctes et 6 combinaisons**.
- 375 : 24, 20, 16, 14 px, soit 4 tailles et 6 combinaisons, pour les 4 comptes.
- 1280 : 30, 20, 16, 14 px, soit 4 tailles et 6 combinaisons, pour les 4 comptes.
- Combinaisons relevées : 30 ou 24/600 (display), 20/600 (display), 16/400, 16/600, 14/400, 14/600. Aucune capitale (`MAJ` absent de la sortie), graisses 400 et 600 seulement.

Recoupement avec le code : `typo.ts` définit exactement les 7 constantes de la spec §1 (identiques au caractère près). Les fichiers lus n'utilisent que ces constantes (`TITRE_CARTE`, `TEXTE`, `META`, `META_FORT`, `ETIQUETTE`, `TEXTE_FORT`, `TITRE_PAGE`). Un détail : `lienCarte` de `contenu-du-jour.tsx` passe en `font-display text-xl` à 768 seulement (`md:max-lg:`), qui reste dans l'échelle (20/600).
**Verdict gate : PASS, aucune faute dure automatique.** Cette mesure exclut l'en-tête global et la bande (hors périmètre) et ne couvre que le premier écran. Elle ne dit rien de l'élégance, qui est jugée ci-dessous.

## 2. Jugement d'ensemble, honnête : élégant, harmonieux, donne envie ?

**Harmonieux : oui, enfin.** Une seule échelle, un seul rayon (12 px), des bords de 1 px, un rythme de 24 px entre cartes, un seul violet plein par zone (le bouton), des gris à deux niveaux. Rien ne crie, rien ne dépare. Le défaut « gros / agressif / petit par ici » est corrigé : le H1 (30 px) ne domine plus une carte à 20 px, la pastille « Premium » est discrète. L'abonné en-cours (1280 et 1920) est la page la mieux tenue : grille 8/4 puis 5/7, « Contenu du jour » en 2 colonnes bien remplies, aucun trou.

**Élégant : à moitié.** Ce que je vois en face de l'étalon d'accueil : l'accueil a du caractère (titre à mot violet, emojis, vignette vidéo réelle, filets violets, cartes qui racontent quelque chose). « Aujourd'hui » est devenue propre, mais **plate et monochrome** : une pile de cartes gris sur gris, même poids, mêmes bords, sans un seul point de focalisation visuel hors le bouton. Le retrait des filets violets (décision de Thomas) était demandé, mais rien ne le remplace : la fidélité à l'accueil baisse. C'est sage, pas encore soigné au niveau d'un produit qui donne envie. Je ne le chiffre pas à 9.

**Donne envie ? Prospect : moyennement.** Il comprend en 3 secondes qu'il est devant un tableau de bord fermé, avec une seule offre en haut à droite (`OffreApercu`), la réassurance et la preuve sous le bouton. Mais la valeur montrée est faible : ce qui se lit dans l'extrait, ce sont des titres génériques (« Ton premier pas », « Répartie », « Vanne du jour ») sur des cartes grises estompées, la 2e rangée étant coupée après une ligne. Le « fermé » est bien lu (un seul mot « Premium », 5 verrous de coin, contenu à 0,75, bouton figé en contour, fondu, « La suite est dans Premium »), et l'on n'a jamais l'impression d'être dedans. C'est une réussite. Il manque la dose d'envie.

## 3. Constats par capture (mesures en px de la capture)

**Visiteur 1280 / 1920 (premier écran)**
- Hero : à gauche H1 + promesse + 6 pastilles sur une ligne, à droite la carte d'offre (`col-span-4`). Le texte finit à y 325, la carte à y 435 : 110 px vides sous les pastilles, plus un vide horizontal à droite des pastilles (de x 667 à x 875 à 1280). C'est une fin de colonne, donc permise, mais elle donne un hero « maigre » comparé à l'offre.
- Z1 (`ActionDuJour`, 8 colonnes) : 803 px de large (à 1280 comme à 1920, la coque reste à 1216) pour 198 px de haut. Contenu : l'étiquette, **une ligne de titre**, le bouton figé à gauche. Plus de la moitié de la carte est vide (à droite du bouton et en dessous). La carte « dominante » est la plus creuse de la page : voir faute 1.
- « Contenu du jour » : 35 px vides au-dessus du titre (`h-5` + `mt-2` posés pour l'alignement avec les titres voisins). L'alignement est juste, mais l'œil lit un haut de tuile vide.
- Fond : la fin d'extrait (« La suite est dans Premium » y 922, bouton y 975) arrive juste après le fondu : propre, une seule action.
- Deux pleins violets visibles à la fois (bouton d'en-tête et bouton du hero, même libellé, même action). Hors périmètre (en-tête global), à arbitrer par Thomas : le plus gros risque pour « un seul accent fort » est là.

**Visiteur 768**
- Pastilles en 3 colonnes `max-content` : écarts irréguliers dans une même ligne. Ligne 1, « Ton premier pas » (x 16 à 143) puis « Ton cap » (x 179) : 36 px ; puis « Série » à x 308 : 63 px après « Ton cap ». Ligne 2 : « Mission » finit à x 241, « Contenu du jour » commence à x 308 : 67 px. Les colonnes sont alignées, mais les pastilles de largeurs différentes laissent des trous inégaux au milieu d'une ligne : voir faute 2.
- « Ton cap » en bandeau : barre de 320 px à gauche, la phrase de série à droite à y 783 sous une barre à y 819 : les deux colonnes ne sont pas alignées sur une ligne de base (haut de la colonne droite flotte). Léger.

**Visiteur 375 / gratuit 375**
- Hero lisible, offre entière avant le pli (bouton y 470 à 518), première tuile qui affleure à y 776 : tient au minimum de la gate « une tuile visible ».
- Gratuit : la phrase d'objet puis la réassurance, deux paragraphes centrés en 14/400 qui commencent tous deux par « Premium » (`offre-apercu.tsx`, `mt-4` entre eux), se lisent comme un mur de quatre lignes sans hiérarchie. Piste, pas faute (texte hors périmètre).

**Nouvel abonné (1280, 1920, 768, 375)**
- Z1 avec bouton violet plein : même défaut de carte creuse (803 x 198 px). Le reste de la page est équilibré : « Étape conseillée » (5/12) + « Tes 4 premières semaines » (7/12) remplissent leur rangée, les lignes de semaine ont le même gris, le pied « Commencer l'étape 1 » est une vraie ligne de 48 px. « Semaine n : » varie de largeur, donc le texte ne démarre pas sur une même colonne (piste).
- Jamais une page morte : premier pas, cap, étape, semaines, contenu du jour.

**Abonné en-cours (1280, 1920, 768, 375)**
- Z1 « Si tu as 5 minutes » + Z2 avec XP et série : bien rempli. Z2 a ~55 px de vide en bas : fin de carte, permis.
- « Étape en cours » a un pied « Reprendre » (48 px, libellé + chevron) ; « Mission · Marche 2 » n'a qu'un **chevron nu** en bas à droite à côté de « Facultative ». Deux tuiles côte à côte, deux affordances différentes. Pas de défaut de cible (toute la tuile est le lien, `mission-lien.tsx`), mais c'est un manque de cohérence de finition (piste).
- « Étape 3 sur 3 » avec une barre remplie à environ 67 % : le chiffre et la barre se contredisent à l'œil (à signaler à @ux, pas un texte à réécrire ici).
- 1920 : même coque de 1216 px, bandes noires de 352 px de chaque côté ; cohérent avec l'accueil, pas de trou.

## 4. Cibles et contrastes (au code)
- Boutons : `buttonVariants lg` (h-12, 48 px), `PIED_TUILE` `min-h-12`, `LIEN` « Connexion » `min-h-11 min-w-11` : OK. Tuile Mission = lien entier : OK.
- Violet : `accent-secondary-hover` sur `BOUTON_OFFRE` et `buttonVariants primary` seulement ; plus de `FILET_CARTE` sur Aujourd'hui (`CADRE_CARTE_NEUTRE`), segments et barre en `bg-text-secondary` : conforme à la décision du 16/11.
- Contraste de Z1 figé : fond `background-elevated` à `opacity-75`, texte `text-secondary`. Mon calcul donne environ 4,55:1 (le commentaire de `tableau.tsx` dit 4,5:1) : **tient, mais sans marge** ; à mesurer par le test avant de clore. Les tuiles sur `background-card` à 0,75 donnent environ 5:1.

## 5. Notes par critère (barre : 9 minimum, global = le minimum)

| Critère | Note | Défaut précis et correction codable |
|---|---|---|
| Design 1 Élégance, fidélité à l'accueil | **7** | Propre mais plate (voir §2). Correction : aucun retour du violet ; donner du relief par la composition seulement : Z1 plus compact (faute 1), pastilles régulières (faute 2). Ce qui ferait 10 : une zone qui porte du contenu riche (vignette ou visuel) au premier écran du prospect, à décider avec Thomas ; non inventé ici. |
| Design 2 Hiérarchie | **8** | Prospect : l'offre domine bien. Abonné : Z1 ne domine que par sa place et son bouton, la carte la plus creuse. Correction : `lg:col-span-7` sur Z1 et `lg:col-span-5` sur Z2 dans `tableau-verrouille.tsx` et la page abonné. |
| Design 3 Largeur, vides, tuiles creuses | **7** | Z1 803 x 198 px, plus de moitié vide (faute 1) ; pastilles à 768 (faute 2) ; haut vide de la tuile « Contenu du jour » à 1280 (35 px, piste). |
| Design 4 Cohérence entre comptes | **8** | Même grammaire partout. Écart : Mission à chevron nu contre Étape à pied « Reprendre ». Correction : même `PIED_TUILE` sur `mission-lien.tsx` avec un libellé existant, sans nouvelle taille. |
| Design 5 Finition au pixel | **8** | Alignements justes, 24 px partout, rayons uniformes, cibles OK. Reste : contraste de Z1 figé à 4,55:1 sans marge, résidu `ETIQUETTE` (faute 3), colonne « Semaine n : » non alignée. |
| UX 1 Prospect, envie en 3 s | **8** | Fermé lisible, une seule offre en haut, preuve et réassurance. Valeur montrée faible (titres génériques en gris). Gratuit : deux paragraphes « Premium… » collés. Piste : `META_FORT` sur la phrase d'objet pour la détacher de la réassurance (14/600 est dans l'échelle). |
| UX 2 Abonné, clarté | **9** | En-cours : une action violette, étape et mission lisibles ; « Étape 3 sur 3 » à barre incomplète à faire arbitrer par @ux. |
| UX 3 Abonné, envie de continuer | **8** | Cap, série et XP bien visibles, rien de célébrant : ça informe sans donner envie. Piste produit, pas de typographie. |
| UX 4 Nouvel abonné | **8** | Jamais morte, bon ordre ; Z1 creuse comme le visiteur. |
| UX 5 Accessibilité visible, cohérence | **9** | Focus, cibles, `aria-hidden`/`inert` de l'extrait corrects ; marge de contraste à confirmer (Z1 figé). |

**Note globale (minimum des critères) : 7. Barre de validation de 9 non atteinte.**

## 6. Fautes dures

1. Z1 creuse aux grands écrans (803 x 198 px à 1280 et 1920, plus de la moitié vide, visiteur, gratuit, nouvel) : passer Z1 à `lg:col-span-7` et Z2 à `lg:col-span-5` (`tableau-verrouille.tsx`, page abonné) ; `action-du-jour.tsx` reste en colonne.
2. Pastilles du hero à 768 : trous irréguliers (36 px puis 63 à 67 px) au milieu d'une ligne : colonnes égales `md:grid-cols-3` avec `justify-center` sur chaque `li` (`hero-apercu.tsx`) au lieu de `max-content`.
3. `carte/styles.ts` exporte encore l'ancien `ETIQUETTE` (`text-xs font-semibold uppercase tracking-wide text-text-muted`), que la spec §1 demandait de supprimer : hors échelle (12 px, capitales, 3e gris) ; le supprimer et le ré-exporter depuis `typo.ts` (vérifier ses importeurs : je n'ai pas pu faire de grep).

Non comptés comme fautes : le second plein violet de l'en-tête global (hors périmètre, à arbitrer par Thomas) ; les pistes ci-dessus.

NOTE GLOBALE : 7/10
