# Relecture design à l'aveugle, s25 navigation v6, tour 6, groupe « favoris-profil »

Périmètre : `favoris/` (visiteur, gratuit, en-cours, nouvel) et `profil/` (gratuit, en-cours, nouvel).
Captures : `docs/captures/s25/v6-tour-6/{favoris,profil}/`. Lues : 375, 1280, 1920 de chaque compte, plus 768 pour favoris et profil en-cours. Code lu pour juger les cibles : `favoris-list.tsx`, `profil-dashboard.tsx`, `abonnement-card.tsx`, `supprimer-compte-card.tsx`, `prenom-card.tsx`, `rappel-parcours-toggle.tsx`. Aucune relecture existante consultée.

## Verdict : 9/10, aucune faute dure

## Favoris

Ce qui est conforme à l'étalon et à la spec :
- Titre centré, sous-titre centré, cartes `rounded-xl` à filet violet, pastilles : même langue que l'accueil, sur les 4 comptes.
- Aperçu Premium (visiteur, gratuit) : une seule offre (bouton « Premium · 1,99 €/mois »), « Connexion » seulement pour le visiteur, aucun mur. Colonne centrée de 768 px, symétrique à 1280 et 1920 (`favoris/visiteur-favoris-1920.png`, `gratuit-favoris-1920.png`).
- En-cours : 3 colonnes à 1280 et 1920 (`en-cours-favoris-1280.png`), aucun vide à droite ; 2 colonnes à 768 avec la carte impaire sur toute la rangée (`en-cours-favoris-768.png`) : voulu par `largeursCourtes`, pas d'orphelin ; 1 colonne à 375.
- Nouvel : état vide soigné (étoile, phrase, bouton « Explorer les vannes »), carte pleine largeur à filet, onglets présents (`nouvel-favoris-375.png`, `-1280`, `-1920`). Jamais une page morte.
- Cibles : « Retirer » et onglets en `min-h-11` (44 px) à toutes les largeurs ; bouton de l'état vide en `md:h-11` ; texte muet `#9A9A9A` sur `#1F1F1F` autour de 5,9:1, AA.

Défauts mineurs (pistes, ne retiennent pas la note) :
1. `en-cours-favoris-1280.png` : la 3e carte (vanne) a ~45 px de vide sous « Clique pour la chute » (cartes étirées à la hauteur du conseil). Piste : rien à faire, c'est le prix des hauteurs égales.
2. `en-cours-favoris-768.png` et `-375.png` : les pastilles d'un conseil passent à la ligne (« Timing » sous « Conseil / Débutant ») et décalent le titre par rapport à la vanne voisine. Piste : `RangeeFavoris` / `favoris-list.tsx`, limiter à 2 pastilles dès `md` (à valider avec @ux).
3. « Retirer » supprime sans confirmation visible ni « Annuler » dans la capture : à vérifier dans `stores/favorites-store.ts` (toast avec annulation ?). Non vérifiable sur capture, donc non noté.
4. Aperçu Premium : les deux cartes d'exemple ne montrent ni onglets, ni « Retirer », ni partage ; elles ressemblent à une fiche de contenu, pas à la rubrique Favoris. La valeur « garder de côté » n'est dite que par le sous-titre validé. Piste : ajouter au composant d'aperçu l'étoile remplie en coin de carte (`apercu-premium`), aucun texte nouveau.
5. 375 : l'aperçu fait ~1 300 px avant le bouton ; le bouton « Premium » de l'en-tête reste visible, donc l'offre n'est jamais à plus d'un geste. Pas de faute.

## Profil

Conforme :
- Filets violets sur toutes les cartes, titres `font-display`, grille 2 colonnes dès `lg` avec groupes courts, cartes longues en pleine largeur (« Prochaine étape », « Mes parcours », suppression). Aucun débordement à 375 ni 768, rien de collé à gauche à 1280 et 1920 (conteneur de 1216 px centré, `en-cours-profil-1920.png`).
- Nouvel abonné : « Prochaine étape » en tête, « Ton cap » (cap 1 sur 5, 0 XP), statistiques à zéro, « Mes parcours » vide avec « Découvrir les parcours » : pas de page morte (`nouvel-profil-1280.png`).
- Gratuit : une seule offre, carte « Abonnement » avec « S'abonner · 1,99 €/mois » (`min-h-11`, pleine largeur à 375), réassurance à gauche (`gratuit-profil-375.png`).
- En-cours : bloc « Reprendre ton parcours » avec bouton unique, évident en tête (`en-cours-profil-1280.png`).
- Cibles jugées au code : interrupteurs `min-h-[44px]`, sélecteur `min-h-[44px]`, « Enregistrer » `min-h-11 md:h-11`, « Voir tout » `md:h-11` (`max-md:h-11` du bouton `sm` sous 768), portail Stripe et « Résilier » `md:h-11`, « Renoncer au contrat ici » `min-h-11`, suppression `md:h-11`. Aucune cible sous 44 px.

Défauts mineurs (pistes) :
1. `en-cours-profil-1456.png`, `-1920.png` : « Supprimer mon compte » est un bouton fantôme rouge poussé à l'extrême droite, à ~350 px du texte qu'il commande (milieu de carte vide). Lisible et voulu (tour 4, point 5), mais l'action flotte. Piste : `supprimer-compte-card.tsx`, borner l'action avec `lg:ml-auto lg:w-64 lg:text-right` n'améliore rien ; vraie piste = `lg:justify-start lg:gap-16` pour la coller au texte.
2. `en-cours-profil-1280.png` : « Rappel de parcours » (~35 px) et « La lettre de la semaine » ont du vide en bas, étirées à la hauteur de leur voisine. Inévitable avec `items-stretch`.
3. « Reprendre ton parcours » n'a pas le filet violet : carte teintée à part. Défendable (c'est l'action principale), pas de faute.
4. « Enregistrer » (variante `outline`) : sa bordure `#2A2A2A` sur `#1F1F1F` est à peine visible (`gratuit-profil-375.png`, bouton pleine largeur sans contour net). Le libellé suffit à l'identifier, donc pas de faute 1.4.11, mais la finition gagne en passant la bordure en `border-border-input` (`prenom-card.tsx`, ligne du `Button`).
5. Mentions `text-xs text-text-muted` (lettre, statistiques) : AA tenu (≈ 5,9:1), mais corps de 12 px dense. Pas de faute.
6. « Ta question à l'équipe » : une ligne seule dans une carte pleine largeur à ~84 px de haut (`en-cours-profil-1280.png`) ; sans titre, elle fait un peu bloc creux. Piste, cohérente avec la décision du tour 4.

## Grille

| Critère | Note | Raison |
|---|---|---|
| Design 1 fidélité accueil | 9 | filets, rayons, pastilles, centrage conformes ; carte « Reprendre » sans filet |
| Design 2 hiérarchie | 9 | action primaire claire sur chaque compte |
| Design 3 mise en page 5 largeurs | 9 | aucun débordement ni colonne collée ; vides résiduels mineurs (suppression, rappel) |
| Design 4 cohérence espace | 9 | même rythme et mêmes titres que les autres pages |
| Design 5 finition | 9 | cibles 44 px OK, contrastes AA ; bordure « Enregistrer » faible, pastilles qui se replient |
| UX 1 compréhension | 10 | « Mes favoris » / « Mon profil », rôle immédiat |
| UX 2 action principale | 9 | une action dominante par état |
| UX 3 vides et nouvel abonné | 9 | états vides soignés partout |
| UX 4 aperçu Premium | 9 | une offre, pas de mur ; l'aperçu ne montre pas la mécanique « favori » |
| UX 5 accessibilité et cohérence | 9 | cibles et focus OK ; pas de confirmation de « Retirer » vérifiable |

NOTE GLOBALE : 9/10 (minimum de la grille), aucune faute dure. Barre de validation (9/10 sans faute dure) atteinte pour ce groupe.
