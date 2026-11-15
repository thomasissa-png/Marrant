# Plan de corrections, navigation v6, tour 3 (s25)

Source : les 18 relectures `docs/{design,ux}/relectures/s25-v6-tour-3-*.md`. Toutes les corrections sont **interrupteur ouvert seulement** (fermé : site identique, inertie 47 instantanés sans mise à jour). Aucun texte nouveau : on retire, on déplace, on reprend un libellé existant.

## Notes du tour 3 (design / ux)
En-tête 9 / 9 (validé au tour 2) · **Aujourd'hui 9 / 9 (validé)** · Quoi répondre 9 / 8 · Bibliothèque 9 / 8 · Parcours 8 / 9 · Vannes 8 / 9 · Favoris-Profil 8 / 7 · Lettre-Carnet 7 / 7 · S'entraîner 6 / 7 · Questions-Répliques 6 / 6.

## Fautes écartées après mesure
- Favoris, « Partager » et « Retirer » : mesurés sur la préversion (abonné, 375 et 1280) à 44 × 44 et 69 × 44. Conforme, rien à faire.
- Parcours, pastilles et liens « Voir » : `min-h-11` confirmé au code (relecture UX).
- Vignettes vidéo en dégradé identique (Aujourd'hui, Parcours) : la préversion locale n'atteint pas les images de YouTube ; à revoir sur la page de test en ligne, pas une correction de code.

## Arbitrages (pilote automatique, décision de Thomas du 15/11)
1. **Titres de page centrés partout en régime ouvert** (remarque transversale de 6 relectures : H1 centré sur l'aperçu, à gauche pour l'abonné sur la même adresse) : H1, sur-titre et sous-titre centrés comme le hero de l'accueil sur toutes les pages de l'espace (rubriques, fiches exceptées), /parcours, /parcours/[slug], /carnet, /lettre, /favoris, /profil. Le contenu dessous garde sa grille. Sur-titre toujours AU-DESSUS du H1 (carnet : même ordre pour tous les comptes).
2. **S'entraîner (abonné)** : plus de carte pleine coque avec texte plafonné. Grille `md:grid-cols-2 items-stretch`, actions en `mt-auto` (cartes jumelles de même hauteur, aucun trou) ; carte impaire seule en fin de grille : pleine largeur avec son contenu réparti en `lg:grid-cols-2` (texte à gauche, étapes ou actions à droite), sans vide à droite.
3. **Mes répliques (abonné, nouvel)** : plus de carte de 768 px collée à gauche. Liste en grille pleine coque `md:grid-cols-2 xl:grid-cols-3` ; formulaire et état vide en colonne centrée `mx-auto max-w-3xl`.
4. **Aperçu Favoris (gratuit)** : les deux contenus réels l'un sous l'autre dans la colonne centrée (plus de `sm:grid-cols-2`), l'offre dessous : plus de trou sous la vanne.
5. **Profil (abonné, nouvel) dès `lg`** : les cartes courtes (cap, rappel, abonnement, lettre, question à l'équipe) en grille `lg:grid-cols-2 items-stretch` ; les cartes longues (parcours, suppression du compte) pleine largeur, texte en `max-w-prose` dans une carte centrée si besoin. Aucune demi-carte vide.
6. **Aperçus Premium avec boutons « Oui / À moitié / Rien »** (Quoi répondre, Aujourd'hui) : dans l'aperçu, la fiche est montrée en entier, la suite révélée (« Ce qu'on aurait pu dire » et répliques ouvertes) ; la porte « Tu avais une réponse ? » + ses trois boutons + « Avant de lire la suite » ne sont pas rendus en aperçu (rien de faux, rien d'actif qui ne fait rien). Si la rubrique abonné affiche déjà la liste des catégories avec effectifs (libellés existants), la reprendre en lecture seule sous l'exemple de l'aperçu Quoi répondre ; sinon rien.
7. **Bibliothèque et fiches** : liens autonomes en cible de 44 px (`inline-flex min-h-11 items-center`) : « Vannes / Conseils / Vidéos » de la carte, « Connexion » des blocs d'offre d'aperçu (tous), « Retour : … » et « Définition complète » des fiches. Les liens dans une phrase restent en ligne.
8. **Vannes, rangée de catégories à 375 et 768** : la première pastille alignée sur le bord des cartes (padding de départ `px-4 md:px-6` en gardant le débord `-mx-*` du défilement).
9. **Carnet (abonné)** : « Les carnets précédents » descend APRÈS les 30 fiches (fin de page) ; sommaire visiblement cliquable (liens soulignés ou chevron, cible 44 px), en `sm:grid-cols-2`, ancres avec `scroll-mt` sous l'en-tête collant. Si le site a déjà un bouton « haut de page », le réutiliser ; sinon rien (pas de libellé nouveau).
10. **/lettre, aperçu du dernier numéro (visiteur, gratuit)** : le corps dans une carte à filet, mesure `max-w-prose` ; paragraphes séparés par de l'espace (plus de `whitespace-pre-line` brut) ; une ligne seule sans ponctuation finale en tête d'un paragraphe de plusieurs lignes (« La sûre », « Comment choisir »…) rendue en intertitre (`font-semibold text-text-primary`). Texte inchangé.
11. **/lettre (abonné)** : les cartes de numéros avec signal de clic (chevron, survol, focus) ; suppression du `min-h-[60vh]` s'il crée le vide avant le pied de page. Pas d'intro inventée.
12. **Parcours** : liste des cartes de /parcours en `lg:grid-cols-2` dans la coque (forme et place des boutons inchangées, `cta-forme-place-s21.md` §1.3 prime).

## Points pour Thomas (pas de correction sans lui)
- Libellé « Tester l'étape 1 de X, gratuite » vs patron « Lire la première étape gratuite de X » (B15, s21).
- Prix 4,99 € d'une ligne du 01/10 de founder-preferences vs 1,99 € affiché partout (à vérifier).
- « Toutes » de /vannes : page 1 de l'abonné presque entièrement « Boulot & Collègues » (tri local, à voir).

## Lots (worktrees, carte de propriété stricte)
- **Lot 1, espace** : `components/espace/**`, `components/favoris/**`, `app/(dashboard)/mon-espace/**`, `app/(dashboard)/favoris/**`. Points 1 (espace et favoris), 2, 3, 4, 6, 7.
- **Lot 2, public** : `components/lettre/**`, `components/carnet/**`, `components/vannes/**`, `components/profil/**`, `components/parcours/**`, `app/(dashboard)/{vannes,lettre,carnet,parcours,profil}/**`. Points 1 (public), 5, 8, 9, 10, 11, 12.
- Chaque lot : Jest et Playwright de ses fichiers ; `inertie-espace.test.tsx` et `REPLIT_ACTIONS.md` NON touchés (liste blanche à demander dans le rapport).
