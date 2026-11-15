# Relecture design à l'aveugle, s25 : en-tête et menu mobile (tour 10)

Méthode : lecture de la spec v5, des décisions fondateur (lignes 191 à 194), du code (`en-tete-universel.tsx`, `menu-mobile-universel.tsx`, `account-menu.tsx`, `panneau-eleve.ts`, `search-bar.tsx`, `cloche.tsx`, `cloche-lignes.tsx`, `tailwind.config.ts`) puis des captures réelles de `docs/captures/s25/entete-tour-10/` : bandeaux des 4 comptes (visiteur 290, 320, 440, 520, 641, 768, 1024, 1456 ; gratuit 440, 600, 641, 768, 1280, 1920 ; en-cours 440, 520, 640, 768, 1024, 1280, 1920 ; nouvel 290, 440, 1456), menus mobiles (visiteur 290/375/520/768, gratuit 375/768, en-cours 375/768/290, nouvel 375), `menu-court` (en-cours 320/375, gratuit 375, nouvel 320), cloche (en-cours 290/375/1280/1920, nouvel vide 290/768/1280), compte (gratuit 768/1280, en-cours 1280, nouvel 1456), focus (série `dans-menu` en-cours 375 : 01, 02, 05, 10, 12 ; `retour-menu-04` ; `dans-compte` 768-00 et 1280-02 ; `dans-cloche` 375-01 et 1280-02 ; barre 768-06 et 1280-09), recherche ouverte (en-cours 375/768/1280, visiteur 1280, nouvel 768). Étalon : `etalon-accueil` (visiteur 375 et 1280 vus ; les pleines pages sont réduites, j'ai pris l'en-tête des bandeaux d'accueil comme référence de fond). Rayons vérifiés dans le thème : `rounded-md` 8 px, `rounded-lg` 12 px ; `rounded-xl` n'est pas redéfini, il reste à la valeur Tailwind par défaut de 12 px (0,75 rem).

Décisions de Thomas non retenues dans la note : recherche à 176 px, position variable selon le compte (x = 782, 826, 956 à 1280 px), ligne 194.

## Ce qui est conforme (constaté sur capture)

- En-tête de 65 px identique sur toutes les pages et tous les comptes ; logo, premier lien et filet alignés sur la coque `max-w-7xl` : à 1456 le logo est à x = 120, à 1920 à x = 352, c'est-à-dire sur le bord gauche du contenu de la page ; à droite, la cloche ou le compte finit sur le bord droit des cartes (1568 à 1920).
- Aucun libellé coupé ni chevauchement de 290 à 1920 (bandeaux visiteur, gratuit, en-cours, nouvel) ; Premium « court » sous 640, complet dès 640 puis court de 1024 à 1279, comme documenté.
- Actif de la barre (fond élevé, texte `accent-link`, soulignement violet 2 px) lisible sans la teinte ; ouvert distinct de l'actif : la cloche ouverte et le bouton Menu/croix ont le fond élevé sans soulignement, l'actif a le soulignement.
- Menu mobile : une colonne, lignes de 44 px, bloc des 8 entrées sur rail, « Mon espace » en semi-gras, séparateurs de 1 px. Mesures sur `en-cours-menu-court-375` (fenêtre de 568 px) : « Carnet » finit vers y = 528, séparateur à 529, « Parcours » commence sous le pli, donc critère 5 de la spec tenu. À 768 px (`en-cours-menu-mon-espace-768`) l'intitulé « Mon espace » non cliquable est bien en blanc semi-gras pendant que le lien de barre est allumé.
- Indice de suite : fondu de 24 px visible sous la ligne « Mon profil » (`en-cours-menu-mon-espace-375`), absent quand le menu est en bout (`en-cours-focus-dans-menu-375-12`, `gratuit-menu-court-375` avec tout visible) ; le menu défile pour amener « Mon profil » actif en vue (`en-cours-menu-profil-375`).
- Cloche et compte : même bord droit que la coque, 8 px sous le filet, finition des cartes de l'accueil (filet dégradé de 4 px, `rounded-xl`, fond élevé, anneau fin), état vide posé (« Rien de nouveau. Reviens quand tu veux. », `nouvel-cloche-vide-1280`, 290, 768), ligne en cours du compte lisible sans la teinte (filet gauche, semi-gras).
- Anneau de focus : 2 px `accent-link` dans la barre, le menu, la cloche et le compte ; le focus ne se perd pas (retour sur la croix, bouclage, cloche, compte vus).
- Cibles 44 px : boutons, lignes, puces de suggestions (`min-h-11`).

## Notes par critère

| Critère | Note |
|---|---|
| 1. Fidélité à la langue visuelle de l'accueil | 10 |
| 2. Cohérence entre comptes et pages | 10 |
| 3. Hiérarchie et lisibilité | 10 |
| 4. Menu mobile (dont indice de suite) | 10 |
| 5. Panneaux cloche, compte, liste de suggestions | 8 |
| 6. Grandes largeurs 1456 et 1920 | 10 |
| 7. Finition au pixel | 9 |

### Critère 5, note 8 : la liste de suggestions n'est pas au niveau des deux autres panneaux

**F1, faute dure (pixel). Le panneau de suggestions chevauche le filet de l'en-tête quand la loupe est ouverte (440 à 1279 px).**
Capture : `en-cours-recherche-ouverte-768.png` et `nouvel-recherche-ouverte-768.png`. Le filet bas de l'en-tête est à y = 133, le haut du panneau à y = 130 : le panneau déborde de 3 px sur l'en-tête et recouvre le filet entre x = 16 et 752, alors que cloche et compte démarrent 8 px sous ce filet. Cause : `#mobile-search` a `py-3` + `border-b` (13 px sous le champ) et la liste est ancrée au champ en `mt-2` (8 px) dans `search-bar.tsx`.
Correction codable : dans `en-tete-universel.tsx`, sur le conteneur `#mobile-search`, `[&_[role=listbox]]:mt-[calc(0.75rem+1px+0.5rem)]` (12 px de `py-3` + 1 px de filet + 8 px, la règle des autres panneaux). Le panneau du menu mobile (champ dans le menu) n'est pas concerné.

**F2, piste objective (finition). La liste n'a pas la finition des panneaux de l'en-tête.**
Captures : `en-cours-recherche-ouverte-1280.png`, `visiteur-recherche-ouverte-1280.png`, `en-cours-recherche-ouverte-375.png`. Cloche et compte : `PANNEAU_ELEVE` (fond élevé #2A2A2A, `shadow-2xl`, anneau blanc 10 %) et filet dégradé de 4 px. Suggestions : `bg-background-card`, `shadow-xl` (invisible sur fond noir), bordure #2A2A2A seule, pas de filet. Sur la page /vannes à 1280, la liste se détache seulement par son fond un cran plus clair ; elle recouvre le titre sans ombre lisible.
Correction codable : dans `search-bar.tsx`, remplacer `bg-background-card ... shadow-xl` des trois listes (suggestions, résultats, aucun résultat) par `PANNEAU_ELEVE` (import depuis `panneau-eleve.ts`) et ajouter le filet `h-1 bg-gradient-to-r from-accent-primary to-accent-secondary` en tête, comme `account-menu.tsx`. Les puces (`bg-background-elevated`) doivent alors passer à `bg-border-hover` pour rester visibles sur le fond élevé, avec le même recalcul de contraste que celui documenté dans `panneau-eleve.ts` pour les survols.

**F3, piste (alignement). À 1280 et plus, la liste fait 176 px de large et les 6 puces s'empilent une par ligne** (`en-cours-recherche-ouverte-1280.png` : 6 lignes, environ 244 px de haut, vide à droite de chaque puce). La largeur de 176 px du champ est acquise (décision 194), pas celle de la liste.
Correction codable : sur la liste ouverte depuis la barre desktop, `xl:left-auto xl:right-0 xl:w-72` (bord droit sur celui du champ, 288 px, 2 à 3 puces par ligne). À contrôler en capture à 1280 pour le compte visiteur (Connexion et Premium à droite du champ : la liste s'étend vers la gauche, sous les liens, sans les masquer plus qu'aujourd'hui).

Ce qui ferait 10 : F1 corrigé et F2 appliqué (même finition que cloche et compte) ; F3 recommandé mais non bloquant.

### Critère 7, note 9 : deux écarts à l'anneau unique

**F4, piste objective. Les puces et « Voir {type} » ont un anneau décalé de 2 px** (`PUCE_MENU` : `ring-offset-2 ring-offset-background-card`) alors que le reste de l'en-tête a un anneau collé (`ring-offset-0`, règle écrite dans `panneau-eleve.ts`). Capture : `visiteur-focus-09-1280.png` (puce « timing » : liseré violet, 2 px de fond entre le liseré et la puce) face à `en-cours-focus-dans-menu-375-05.png` (anneau collé à la ligne).
Correction : dans `search-bar.tsx`, `PUCE_MENU` sans `ring-offset-2 ring-offset-background-card`, avec `focus-visible:ring-inset` (puce de 44 px dans un panneau en `p-3`, rien n'est coupé).

**F5, piste (au pixel). Dans le menu mobile, l'anneau des lignes est décalé de 2 px à gauche par rapport à celui de la recherche.** `FILET` laisse un `border-l-2` transparent, et `ring-inset` se dessine à l'intérieur de la bordure : sur `en-cours-focus-dans-menu-375-01.png` l'anneau de la recherche commence à x = 16, sur `-12.png` celui de « Mon profil » et sur `-10.png` celui de « Vannes » commencent vers x = 18, avec le bord droit à 358 pour tous.
Correction : dans `FOCUS` de `menu-mobile-universel.tsx`, ajouter `focus-visible:border-l-0` et compenser le padding (+2 px : `focus-visible:pl-3` pour les lignes à `pl-[10px]`, `focus-visible:pl-[25px]` pour les entrées du rail à `pl-[23px]`) afin que le texte ne bouge pas.

Ce qui ferait 10 : F4 et F5 corrigés. Pas de défaut de contraste (texte secondaire #B3B3B3 sur #0D0D0D, `accent-link` #A78BFA sur #2A2A2A : 5,27:1, valeurs du thème), pas de cible sous 44 px, pas de débordement dans l'en-tête ou le menu.

## Pistes sans effet sur la note (subjectives, existant conforme à l'étalon et à la spec)

- Concentricité : lignes des panneaux en `rounded-lg` (12 px) dans un panneau de 12 px avec 4 px de marge ; des lignes de 8 px seraient plus concentriques, mais le tour 8 a unifié les 12 px avec le menu mobile.
- Indice de suite : le fondu rend « Mon profil » proche d'une ligne désactivée à 375 x 812 ; il fonctionne et disparaît en bas du menu.
- Hors design : en barre (pas dans le menu), les 6 puces de suggestion sont dans l'ordre de tabulation entre la recherche et Connexion/Premium (`visiteur-focus-09-1280.png`) ; à voir par @ux.
- Hors périmètre : les captures `visiteur-vannes-*` et `gratuit-vannes-*` montrent une rangée de catégories sans « Toutes » alors que `en-cours-` et `nouvel-` l'ont (décision du 14/11, une seule rangée pour tous) ; à vérifier dans la section Vannes.

NOTE GLOBALE : 8/10
