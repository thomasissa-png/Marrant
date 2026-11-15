# Relecture DESIGN à l'aveugle, tour 2 : groupe quoi-repondre (rubrique + fiche situation)

Captures lues : `v6-tour-2/quoi-repondre/` (visiteur, gratuit, en-cours, nouvel, 5 largeurs sauf visiteur/gratuit partiellement relus à 375, 768, 1280, 1456, 1920) et `v6-tour-2/fiches/` (en-cours et nouvel, 5 largeurs). Étalon : accueil visiteur 1280.

## Notes

| Critère | Note | Raison |
|---|---|---|
| 1 Fidélité à l'accueil | 8 | Cartes `rounded-xl` à filet violet, pastilles rondes, typo et violet corrects. Mais titres de page alignés à gauche, pas de hero centré ni de rythme aéré de l'accueil ; la liste est un empilement de lignes grises sans filet. Piste, pas faute (écart assumé pour un écran d'usage). |
| 2 Hiérarchie et lisibilité | 8 | Fiche claire : titre, scène, "À toi", une action violette. Liste : H1, deux rangées de pastilles, groupes à titre + compteur, lisible. Sur la fiche en-cours, les trois boutons Oui / À moitié / Rien sont gris sombre sur gris (`fiches/en-cours-fiche-situation-1280.png`) et ressemblent à des boutons désactivés alors que c'est l'interaction centrale. |
| 3 Mise en page 5 largeurs | 7 | Faute dure sur l'aperçu Premium (ci-dessous). Liste et fiche : aucun débordement, grille 2 colonnes propre, colonne fiche centrée (max ~768) à 1280, 1456, 1920. |
| 4 Cohérence avec l'espace | 9 | Même rythme (H1 ~40 px, cartes à filet, footer identique), mêmes pastilles "Fait", même bande. |
| 5 Finition au pixel | 8 | Faute dure sur textarea tronquée à 375 (ci-dessous). Pistes : cibles des pastilles de filtre ~42 px au lieu de 44, rupture "Rien / n'est noté." orpheline dans la description de la scène quand la carte fait 700 px (aperçu 1280, 1456, 1920). |

## NOTE GLOBALE : 7/10 (minimum des critères)

## Fautes dures

1. **Aperçu Premium, colonne droite orpheline à ≥ 1024 px** (`visiteur-quoi-repondre-1280.png`, `-1456.png`, `-1920.png`, idem gratuit). La carte d'offre ne contient que le bouton Premium (et Connexion) : une petite carte de 90 px de haut, accrochée en haut à droite, avec ~380 px de vide en dessous jusqu'au footer, et 0 phrase de valeur. Ce n'est ni la langue de l'accueil (bloc d'offre centré, titre, sous-titre, encadré violet) ni une mise en page équilibrée. Correction codable : passer l'aperçu en une colonne `max-w-3xl mx-auto` avec la carte d'offre sous l'exemple (comme déjà à 375 et 768), ou la rendre `lg:sticky lg:top-24` avec `rounded-xl` + filet dégradé violet, un titre `font-display` et le bouton pleine largeur ; ce qui ferait 10 : bloc d'offre sur le modèle de l'encadré « Tout ouvrir · 1,99 €/mois » de l'accueil (texte à valider par Thomas). Fichier : composant de la page d'aperçu Premium de `apps/web/src/app/(espace)/quoi-repondre/` (grille `lg:grid-cols-[...]`).
2. **Textarea « Ma réplique à moi » tronquée à 375** (`en-cours-fiche-situation-375.png`) : le texte saisi passe sur 2 lignes puis la 3e ("témoin.") est coupée en deux, hauteur fixe ~55 px, avec la poignée de resize. Correction : `min-h-[96px]` (`rows={3}`) ou auto-grow sur la textarea de la fiche situation, `resize-none` ; 10 = texte entièrement visible à 375 pour 200 caractères. Fichier : formulaire « À toi » de la fiche situation dans `apps/web/src/app/(espace)/quoi-repondre/[slug]/`.

## Pistes (ne retiennent pas la note)

- Boutons Oui / À moitié / Rien : donner un fond `bg-surface-2` et un texte `text-foreground` pour qu'ils ne ressemblent pas à des éléments désactivés (même fichier de la fiche).
- Pastilles de filtre : `min-h-[44px]` (cible tactile) sur la liste.
- Description « Avant de lire la suite… » : retirer le `max-w` étroit (`max-w-prose` au lieu d'un `max-w-[~580px]`) pour éviter la ligne orpheline "n'est noté.".
- Titre de page et titres de groupe pourraient reprendre la graisse et l'échelle des H2 de l'accueil ; pas d'urgence.
- Hors périmètre : la bande à 375 sur la fiche s'affiche coupée à gauche ("cours") quand l'onglet actif est recentré ; à voir par le groupe En-tête.
