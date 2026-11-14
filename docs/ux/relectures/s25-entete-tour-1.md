# Relecture UX à l'aveugle, s25, en-tête et menu mobile, tour 1

Périmètre : `en-tete-universel.tsx`, `menu-mobile-universel.tsx`, `account-menu.tsx`, `espace/cloche`, `espace-navigation.ts`. Captures : `docs/captures/s25/entete-tour-1/`. Étalon : `etalon-accueil/visiteur-accueil-{1280,1920}.png`. Spec v5 et [CHOIX UTILISATEUR] non rediscutés.

Limites de la preuve : aucune capture de 440 à 767 px, aucune capture de focus clavier, aucun état vide de la cloche (les 3 comptes ont au moins « Le carnet du mois »), visiteur /mon-espace redirige vers la connexion (pas d'en-tête, normal). Gratuit /mon-espace redirige vers l'offre : le bouton d'offre y est masqué par `pageChaude`, cohérent avec la règle /abonnement, pas un défaut.

## Notes

| # | Critère | Note |
|---|---|---|
| 1 | Conformité à la spec v5 | 8 |
| 2 | Orientation | 9 |
| 3 | Menu mobile | 8 |
| 4 | Cloche et menu du compte | 7 |
| 5 | Charge cognitive et cohérence | 8 |
| 6 | Grandes et petites largeurs | 9 |
| 7 | Accessibilité visible | 8 |
| | **Globale (plafonnée par le plus bas)** | **7** |

Langue de l'étalon : l'en-tête reprend celle de l'accueil (logo violet, liens gris 14 px, champ de recherche arrondi, bouton plein violet, fond noir, même alignement `max-w-7xl` à 1456 et 1920). Le visiteur (`visiteur-accueil-1280.png`) est identique à l'étalon. Pas de défaut de langue visuelle.

## 1. Conformité à la spec : 8/10

Conforme, vu sur capture : ordre Parcours, Vannes, Conseils, Vidéos, Articles, La lettre ; abonné « Mon espace » en 1er sans La lettre ; recherche 176 px à 1280 ; cloche à point violet seulement sur l'abonné `en-cours` ; compte Favoris, Mon profil, Déconnexion (gratuit) et Mon profil, Déconnexion (abonné) ; à 768 : loupe, cloche, compte, Menu et « Mon espace » en barre ; intitulé non cliquable dans le menu à 768 ; soulignement et fond de l'état actif ; ligne « Quoi répondre » allumée sur la fiche situation (375 et 768) avec « Mon espace » non allumé ; « Mon espace » allumé sur Aujourd'hui.

Écarts :
- **[Faute dure, spec contre rendu] Cinq liens du site sur deux colonnes pour l'abonné** (`en-cours-menu-mon-espace-375.png`, `en-cours-menu-mon-espace-768.png`) : la spec §1 dit « de haut en bas dans le menu mobile », un seul ordre. Le rendu lit Parcours, Vannes / Conseils, Vidéos / Articles, et diffère du menu du gratuit et du visiteur (une colonne). La décision est documentée dans le code (tour 2, 104 px gagnés) mais la spec n'a pas été mise à jour. Correction : au choix de Thomas, soit `menu-mobile-universel.tsx` ligne 89, retirer `grid grid-cols-2 gap-2` et garder `contents` pour tous (le menu abonné à 375 x 812 passe de 779 à 883 px de contenu, défilement du bloc bas seulement, les 8 entrées restent visibles sans défilement), soit amender la spec §1 (ligne 36) et le critère 5 pour écrire « deux colonnes pour l'abonné ». Pour passer à 10 : un seul des deux, spec et rendu d'accord.
- **Piste : hauteur du §1** (530 px) ne comptait pas les 5 liens du site, calcul à refaire dans la spec (à 667 px de haut, « Mon profil » et « Déconnexion » sortent de l'écran, les entrées de l'espace restent accessibles).

## 2. Orientation : 9/10

- Abonné : logo vers Aujourd'hui, « Mon espace » en barre dès 768, première ligne du menu sous 768 ; sur la fiche situation à 375 (`en-cours-menu-situation-375.png`) le menu montre le parent « Mon espace » en blanc et la ligne « Quoi répondre » allumée : l'abonné sait où il est. Retour à Aujourd'hui en 1 geste en barre (logo) et en 2 sur mobile.
- Visiteur et gratuit voient l'offre en permanence (« Premium » 375, « Premium · 1,99 €/mois » 640+), et dans le menu : bouton plein sous les liens.
- Piste (non bloquante, 1 point) : le logo de l'abonné mène à Aujourd'hui sans indication (nom accessible = « deviens-marrant.fr »). Correction : `en-tete-universel.tsx` ligne 127, ajouter `aria-label` pour l'abonné. Texte à faire valider par Thomas, proposé « deviens-marrant.fr, Aujourd'hui ». Pour passer à 10.

## 3. Menu mobile : 8/10

Acquis : 2 touchers sans défilement à 375 x 812 pour chaque rubrique (Menu, ligne), ordre conforme, parent « Mon espace » en `font-semibold`, bloc d'entrées en retrait avec filet vertical, lignes de 44 px, ligne allumée juste (`en-cours-menu-situation-375.png`, `nouvel-menu-mon-espace-375.png`), croix, voile, Échap.

Défauts :
- **[Faute dure] Alignement des actions du compte incohérent** (`gratuit-menu-accueil-375.png`, `gratuit-menu-situation-375.png`, `en-cours-menu-mon-espace-375.png`) : « Favoris » et « Mon profil » sont à gauche avec icône, « Déconnexion » est centré sans icône. Côté abonné : « Mon profil » à gauche, « Déconnexion » au centre de sa moitié (x=275). Cause : `Button` centre par défaut, les liens portent `justify-start`. Correction `menu-mobile-universel.tsx` ligne 137 : `className="h-11 w-full justify-start gap-2"` et ajouter une icône de sortie identique à celle de `account-menu.tsx` (celle de `gratuit-compte-1280.png`) devant « Déconnexion » ; pour l'abonné, passer le conteneur ligne 121 en `flex-col` ou garder la ligne avec les deux `justify-start`. Pour passer à 10 : les trois actions alignées pareil, avec icône.
- **Piste : visiteur 768, bouton plein sur toute la largeur** (`visiteur-menu-accueil-768.png`, 736 px de large) : l'offre est lisible mais la barre est écrasée par rapport à l'accueil. Correction : `max-w-sm` sur le bouton ligne 109, ou le laisser (la conversion prime).
- Piste : à 768, la grille de l'abonné place « Vannes » à x=400 avec 350 px de vide entre les deux colonnes (`en-cours-menu-mon-espace-768.png`) ; supprimée par le point 1 si on repasse en une colonne.

## 4. Cloche et menu du compte : 7/10

Acquis : point violet seulement sur l'abonné avec réponse non lue (`en-cours-cloche-*`) ; panneau titré « Notifications », deux groupes, bouton « Fermer » 44 px ; compte : panneau net sous l'icône lit.

Défauts :
- **[Faute dure à vérifier dans le code de `cloche.tsx`, non visible] Lignes du panneau sans signe de lien** (`en-cours-cloche-1280.png`) : « Une question » et « Le carnet du mois » sont du texte blanc sans chevron, souligné ni survol visible. Un first-time user ne sait pas qu'on peut toucher. Correction : si ce sont des liens, ajouter le chevron des lignes de l'index (même composant que « Dans ton espace ») et `min-h-11` ; si ce n'est pas un lien, le dire par le style (sans lien, pas de blanc plein).
- **Piste : bottom sheet à 375** (`en-cours-cloche-375.png`, `nouvel-cloche-375.png`) : le panneau s'ouvre tout en bas, à 600 px de la cloche, avec la page assombrie ; le lien de cause à effet est faible, et « Fermer » est un gros bouton à bordure. Correction : ancrer sous l'en-tête (`top-16 right-3 left-3`) comme à 1280, ou garder le tiroir en ajoutant une poignée. À arbitrer avec @design.
- **Non prouvé : état vide** (« Rien de nouveau. Reviens quand tu veux. », `espace-navigation.ts` ligne 41) : aucune capture. Demander une capture d'un abonné sans carnet ni réponse pour le noter.
- Piste : le menu du compte n'indique pas qui est connecté (pas de nom ni e-mail). Texte éventuel à faire valider par Thomas.
- Pas de défaut sur le point violet : cohérent avec le code (réponses de l'équipe non lues seulement), `nouvel` sans point mais avec « Le carnet du mois » dans le panneau est voulu (un fait, un signal).

## 5. Charge cognitive et cohérence : 8/10

Acquis : rien en double entre barre et menu (Connexion et compte dédoublonnés selon la largeur), en-tête identique d'une page à l'autre pour un même état, 3 actions principales au plus par état.
Défauts : les deux écarts du menu (colonnes selon le compte, alignement des actions). Le menu est ainsi présenté différemment pour l'abonné et pour le gratuit alors que le rôle est le même. Corrigés par 1 et 3 : 10.

## 6. Grandes et petites largeurs : 9/10

- 1456 et 1920 : en-tête centré dans `max-w-7xl`, logo aligné sur le contenu comme l'étalon (`en-cours-mon-espace-1920.png`), aucun vide anormal.
- 375 : logo, « Premium » court, Menu tiennent ; abonné logo, cloche, Menu ; rien de coupé.
- 768 : visiteur et gratuit tiennent (`gratuit-vannes-768.png`), abonné tient.
- Non prouvé : 440 à 767 px et 320 px, aucune capture. Pour passer à 10 : joindre ces captures (ou le rapport `header-budget` à 520, 640, 641).

## 7. Accessibilité visible : 8/10

Acquis : cibles 44 px (`h-11`, liens `py-3`) ; état actif de la barre par fond plus soulignement, lisible sans la teinte ; menu : fond et `font-semibold` ; contrastes des liens gris sur noir corrects ; `aria-current`, `aria-expanded`, nom accessible de la cloche avec le nombre.
Défauts :
- **Piste** : dans le menu, l'allumage ne repose que sur le fond `bg-background-elevated` (#222 sur #0d0d0d, faible contraste) ; pour « Mon espace » parent déjà `font-semibold`, le gras ne distingue pas. Correction : ajouter à `ALLUMEE` (`menu-mobile-universel.tsx` ligne 25) `border-l-2 border-accent-primary` (et `-ml-0.5` sur les lignes d'index) ; pour 10.
- Focus clavier : le code porte `focus-visible:ring-2`, mais aucune capture ne le prouve. Fournir une capture au Tab sur Menu, cloche, compte.
- Piste : le point violet de la cloche est une couleur seule ; le nom accessible porte le nombre, un chiffre visible reste au choix de Thomas.

## Récapitulatif des corrections

| Priorité | Fichier | Action |
|---|---|---|
| Dure | `menu-mobile-universel.tsx` l.137, 121 | `justify-start gap-2` et icône sur « Déconnexion », alignement des 3 actions |
| Dure | `menu-mobile-universel.tsx` l.89 et spec §1 | Deux colonnes abonné : retirer la grille ou amender la spec (choix Thomas) |
| Dure à vérifier | `espace/cloche.tsx` | Lignes du panneau : chevron et `min-h-11` ou style sans lien |
| Piste | `menu-mobile-universel.tsx` l.25 | Filet gauche accent pour l'état actif |
| Piste | `en-tete-universel.tsx` l.127 | `aria-label` du logo abonné (texte à valider) |
| Piste | cloche à 375 | Ancrer sous l'en-tête |
| Preuve | captures | 440 à 767 px, focus, cloche vide |

NOTE GLOBALE : 7/10
