# Arbitrages UX D5b (s24), @ux, 13/11/2026
> Lu : `parcours-espace.tsx`, `en-tete-espace.tsx`, `quatre-semaines.tsx`, `ton-cap.tsx`, `filtres-replies.tsx`. Les captures `s24-d5b/` n'ont aucun `parcours*` ; seules celles de `s24-d4` existent (antérieures aux deux leviers, donc non probantes). Gains estimés, non mesurés.

## 1. N2 à 200 % : y = 815, cible <= 796 (reste 19 px)
Les cartes (`quatre-semaines.tsx`, `ton-cap.tsx`) sont déjà resserrées sous e300 ; le reste est l'écart entre blocs, que personne n'a touché.
**Levier unique** : `components/espace/parcours/parcours-espace.tsx` l. 71, `max-e300:gap-4` devient `max-e300:gap-2` (16 px à 8 px). Le conteneur empile 3 blocs (Quatre semaines, Ton cap, titre de la liste) : 2 écarts, soit -16 px (3 si « Tes bonus » est ouvert : -24 px). Estimation 799, ce qui passe le critère (<= 812) mais pas encore la cible.
**Complément pour atteindre 796** : même ligne, `max-e300:mb-4` devient `max-e300:mb-3` (-4 px). Estimation 795.
Aucune ligne d'en-tête retirée, aucune cible tactile touchée (8 px d'écart entre cartes non interactives), HTML public intact (classes `max-e300:` dans un composant réservé à l'abonné). Re-mesurer sur `parcours-cap-2-375-200pc` ; si y > 812, me revenir (le prochain levier serait `text-xl` du h2 de la liste à `max-e300:text-lg`, gain 0 à 28 px selon les retours à la ligne, à mesurer avant).
Assouplir le test n'est pas nécessaire.

## 2. Résumé des filtres repliés sans filtre choisi (20 caractères au plus)
Le lot a mis « Où et avec qui ? Pour quoi faire ? » (34 caractères, deux questions). À soumettre à Thomas :
- « Filtrer les cartes » (18) : un verbe d'action, dit ce que fait le bouton. **Recommandé.**
- « Choisir un contexte » (19) : plus précis, mais « contexte » est le mot de l'architecture, pas forcément celui de l'abonné.
- « Tous les contextes » (18) : dit l'état, pas l'action ; peut se lire comme déjà filtré.
Avec filtres choisis, le résumé continue de nommer les valeurs (règle `filtres-replies.tsx`).
