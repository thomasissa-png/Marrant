# Plan de corrections, navigation v6, tour 4 (s25)

Source : les 16 relectures `docs/{design,ux}/relectures/s25-v6-tour-4-*.md`. Corrections **interrupteur ouvert seulement** (fermé : site identique, inertie 47 instantanés sans mise à jour). Aucun texte nouveau.

## Notes du tour 4 (design / ux)
En-tête 9 / 9 (validé tour 2) · Aujourd'hui 9 / 9 (validé tour 3) · **Quoi répondre 9 / 9** · **Vannes 9 / 9** · **Questions-Répliques 9 / 9** · **Bibliothèque 9 / 9** · **Lettre-Carnet 9 / 9** (validés) · S'entraîner 8 / 9 · Parcours 8 / 8 · Favoris-Profil 7 / 7.

## Fautes écartées
- /parcours/repartie, argumentaire de l'abonné après le programme : décision documentée s19 (N2 @ux rendu, `parcours-detail.tsx` `argumentaireApresProgramme`). Rien à faire.

## Arbitrages (pilote automatique, décision de Thomas du 15/11)
1. **S'entraîner, cartes jumelles** : plus de trou au milieu de la carte courte. Les cartes d'une même rangée en sous-grille (`grid-rows-subgrid` + `row-span-N`) : en-tête, « Le contexte », « Ta réponse d'abord », actions alignés d'une carte à l'autre ; retirer le `flex-1` du texte. Si la sous-grille n'est pas tenable, `items-start` + actions directement sous le texte.
2. **Parcours, cartes jumelles** : « Programme » (details) et bouton regroupés dans un même bloc `mt-auto` (plus de trou entre eux, « Programme » aligné d'une carte à l'autre).
3. **Parcours, carte impaire seule (Boulot) à `lg`** : même largeur que ses sœurs, centrée (`lg:col-span-2 lg:mx-auto lg:w-[calc(50%-gap/2)]`), plus de ligne de 150 caractères ni de bouton de 1150 px.
4. **Profil Premium dès `lg`** : « Ta question à l'équipe » (une ligne, sans titre) sort de la grille des cartes courtes : ligne pleine largeur de la coque, hauteur naturelle, aucun étirement. Aucune carte seule en demi-largeur : une carte impaire en fin de grille passe en `lg:col-span-2` (ou la grille est recomposée pour être paire).
5. **Supprimer mon compte** : plus de moitié droite vide à 1280+ : contenu réparti (`lg:flex lg:items-center lg:justify-between lg:gap-8`, texte `max-w-prose` à gauche, bouton à droite).
6. **Boutons `size="sm"` (32 px dès 768) dans l'espace ouvert** : favoris (« Explorer les vannes »), profil (« Voir tout », « Découvrir les parcours », « Supprimer mon compte », « Enregistrer » du prénom) en cible de 44 px (`md:h-11` ajouté en régime ouvert seulement). Le composant `Button` n'est pas modifié.
7. **Favoris (abonné), 768 à 1920** : plus de vide de 200 px dans les vannes étirées à la hauteur d'un conseil : `items-start` ou conseil replié tronqué (`line-clamp`) pour des hauteurs voisines ; aucune carte orpheline avec un trou à sa droite (dernière carte impaire en pleine ligne ou grille recomposée).
8. **Finitions validées hors faute** : sommaire du carnet, numéros en largeur fixe (`tabular-nums min-w-[2.5ch] text-right`) ; cartes d'archive de /lettre, `frTypo()` sur titre et objet (apostrophes typographiques, texte inchangé).

## Points pour Thomas (ajoutés au tour 4)
- Fiche bilan : la carte « À toi » affiche la solution complète juste sous l'exercice « Remets ta réponse dans l'ordre » (contenu).
- Carnet abonné (25 000 px) : pas de retour au sommaire depuis une fiche ; libellé à valider si tu en veux un.

## Lots (worktrees, carte de propriété stricte)
- **Lot 1, espace** : `components/espace/**` (sauf `espace/profil/**`), `components/favoris/**`, `app/(dashboard)/mon-espace/**`, `app/(dashboard)/favoris/**`. Points 1, 6 (favoris), 7.
- **Lot 2, public** : `components/parcours/**`, `components/profil/**`, `components/espace/profil/**`, `components/carnet/**`, `components/lettre/**`, `app/(dashboard)/{parcours,profil,carnet,lettre}/**`. Points 2, 3, 4, 5, 6 (profil), 8.
- Chaque lot : Jest et Playwright de ses fichiers ; `inertie-espace.test.tsx` et `REPLIT_ACTIONS.md` NON touchés.
