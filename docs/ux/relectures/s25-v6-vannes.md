# Relecture à l'aveugle s25 v6, tour 1 : Vannes (/vannes)

Captures lues : `docs/captures/s25/v6-tour-1/vannes/` (visiteur, gratuit, en-cours, nouvel x 375, 768, 1280, 1456, 1920) + étalon accueil 1280. Code : `apps/web/src/app/(dashboard)/vannes/page.tsx`, `components/vannes/vannes-list.tsx`, `components/ui/chip.ts`, `components/ui/card.tsx`, `components/layout/page-header.tsx`, `config/vannes-categories.ts`. Aucun texte validé réécrit.

## Conformité à la décision du 14/11 (OK)
- Une seule rangée de catégories pour tous, « Toutes » active par défaut : vérifié sur les 4 comptes.
- Non-abonné : 10 vannes gratuites avec 10 badges de catégorie différents (Boulot, Vie quotidienne, Soirées, École, Famille, Autodérision, Absurde, Couple, Digital, Jeux de mots), donc au moins 5 catégories : OK (`selectionGratuite`).
- Chute révélée au clic (« Révéler la chute » + carte cliquable + flèche vers la fiche) : OK.
- Favoris : étoile visible pour le non-abonné, elle ouvre l'offre (code `FavoriteButton` hors périmètre, non vérifié au clic) ; le lead « Avec Premium, tu gardes tes préférées » est masqué à l'abonné (visible sur capture en-cours).
- Mur Premium : un seul bouton plein (« Ouvrir la suite des vannes · 1,99 €/mois »), lien gratuit en second, réassurance unique : conforme aux règles de concision.

## Notes

| Critère | Note | Raison |
|---|---|---|
| D1 Fidélité à l'accueil | 7 | Cartes `Card` = `rounded-lg` sans filet dégradé violet en haut (étalon : `rounded-xl` + filet). Titre H1 aligné à gauche, pas de rythme centré. |
| D2 Hiérarchie et lisibilité | 9 | H1 > lead > rangée > cartes nets ; amorce lisible, chute en violet. |
| D3 Mise en page 5 largeurs | 7 | Rangée de catégories coupée à droite à 1280, 1456, 1920 (« Absurde » tronqué, « Jeux de mots » invisible). Bloc « Pourquoi ces vannes sont différentes » et lead : 40 % vide à droite à 1280+. |
| D4 Cohérence espace | 9 | Même `PageHeader`, mêmes cartes, mêmes FAQ que les autres catalogues. |
| D5 Finition | 8 | Réassurance du mur centrée alors que titre, bouton et lien sont alignés à gauche (1280 : x centre du bloc). Cibles chips 44 px OK (`min-h-[44px]`). |
| U1 Compréhension | 9 | Je sais en 3 s : « Toutes », 10 cartes, révéler. Piste : voir P1. |
| U2 Action principale | 9 | Révéler la chute, une seule par carte. |
| U3 États vides / nouvel abonné | 9 | `nouvel` = `en-cours` (le catalogue n'a pas d'état vide propre) : jamais une page morte. État « catégorie vide » existe (EmptyState) mais non capturé. |
| U4 Aperçu Premium | 9 | Valeur visible (10 vannes variées), une seule offre, pas de mur. Piste P3 sur la carte floutée. |
| U5 Accessibilité et cohérence | 7 | Voir F1 (catégories inatteignables à la souris) et P2 (rôles ARIA). Comptes cohérents. |

**NOTE GLOBALE : 7/10** (minimum).

## Fautes dures

**F1. Catégories cachées sans repère à 1280+ (D3, U5).** `visiteur-vannes-1280.png`, `-1456`, `-1920`, `gratuit-*`, `en-cours-*` : la rangée fait environ 1 350 px dans 1 216, « Absurde » est coupé et « Jeux de mots » n'apparaît pas. `RANGEE_CHIPS_UNE_LIGNE` masque la barre de défilement (`[scrollbar-width:none]`), aucune flèche : à la souris sans trackpad, deux catégories (dont celle d'une carte gratuite visible, « Jeux de mots ») sont introuvables. La rangée unique est décidée (14/11) : on la garde, on la rend atteignable.
- Correction codable (`vannes-list.tsx` + `chip.ts`) : sur `lg:` ajouter un bouton chevron 44 px (`hidden lg:inline-flex h-11 w-11 rounded-full border border-border bg-background-elevated`, `aria-label` à valider par Thomas) à droite de la rangée, qui fait `scrollBy({ left: 320, behavior: "smooth" })` et disparaît en fin de rangée ; masque de fondu retiré à ce moment. Variante sans nouveau composant : à `lg:` passer `gap-1.5` et `lg:px-2.5` pour gagner environ 90 px, puis réduire le fondu ; insuffisant seul (il reste 40 px de trop), donc à combiner avec le chevron.
- Ce qui fait 10 : les 11 pastilles atteignables à la souris, au clavier (déjà le cas par Tab) et au doigt, avec un repère visible.

**F2. Réassurance du mur désalignée (D5).** `visiteur-vannes-1280.png`, `gratuit-vannes-1280.png`, `-1456`, `-1920`, `visiteur-vannes-768.png` : « Premium : premier paiement remboursable sous 14 jours... » est centrée sous un bouton et un lien alignés à gauche (décision du 18/10 : défauts d'alignement entre blocs = non pro). Fichier : `components/premium/mur-liste.tsx` (classe `text-center` sur la ligne de réassurance, à passer à `text-left`). Texte inchangé. Ce qui fait 10 : tout le bloc sur le même bord gauche à 375 et à 1920.

## Pistes (ne retiennent pas la note seules)

- **P0 Étalon (retient D1 à 7 : écart objectif à l'étalon imposé).** `vannes-list.tsx`, carte vanne : ajouter `rounded-xl relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-accent-primary before:to-accent-secondary` (vérifier les noms de couleurs dans `tailwind.config.ts` avant de coder) ; l'idéal est de porter le filet dans `Card` pour tout l'espace (décision de cohérence, à arbitrer avec le groupe design). H1 centré non retenu : la structure commune `PageHeader` est partagée par toutes les pages catalogue.
- **P1 « Toutes » d'un abonné ressemble à un filtre Boulot.** `en-cours-vannes-1280.png` : 7 cartes sur 8 sont « Boulot & Collègues » en page 1 (ordre chronologique), alors que le visiteur voit 10 catégories. Correction : `app/api/jokes` et `getJokesPage` pour `category` vide, entrelacer les groupes avec la logique de `selectionGratuite`. Ce qui fait 10 : « Toutes » varie dès la page 1.
- **P2 ARIA.** La rangée est un `role="tablist"` sans flèches clavier ni `aria-controls`, et le `tabpanel` n'existe qu'avec des résultats. Plus simple et plus juste : `role="group"` + `aria-pressed` sur chaque bouton.
- **P3 Carte floutée.** Sans texte (deux barres grises + cadenas), elle peut se lire comme un chargement bloqué. Un libellé serait un texte nouveau : à valider par Thomas.
- **P4 Vide à droite des blocs éditoriaux (D3).** `page.tsx` : « Pourquoi ces vannes sont différentes » en `max-w-3xl` laisse environ 40 % de vide à 1280+. Correction : `grid lg:grid-cols-3 gap-8` (H2 en colonne 1, paragraphes en `lg:col-span-2`). Le lead en `max-w-3xl` est une mesure de lecture normale, non retenu.
- **P5 EmptyState** : emoji (😅) dans `vannes-list.tsx` alors que la règle du site est zéro emoji (la 404 est une exception décidée, pas celle-ci). À confirmer par Thomas.

## Cognitive walkthrough (visiteur, 375 px)
Voir « Toutes » active : oui. Toucher une catégorie : oui (défile, fondu). Révéler : bouton explicite. Voir la fiche : flèche discrète. Arriver au mur : « Les 10 vannes gratuites, c'est fait. » puis un bouton : clair. Aucune friction hors F1 (sur mobile le défilement tactile suffit).

## HEART
Task success : part des visiteurs qui révèlent au moins une chute (cible 60 %) ; Adoption : clic « Ouvrir la suite des vannes » / vues du mur ; mesure Umami, événement déjà couvert par `useMurVu`.
