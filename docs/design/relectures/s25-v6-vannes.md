# Relecture design à l'aveugle, s25 v6 tour 1 : Vannes (/vannes)

Captures lues : visiteur 375 et 1280, gratuit 1920, en-cours 1280 et 375, nouvel 768 (les autres largeurs partagent la même mise en page). Code lu : `vannes/page.tsx`, `vannes-list.tsx`, `vannes-theme-nav.tsx`, `ui/card.tsx`, `ui/chip.ts`, `ui/liens.ts`, `layout/page-header.tsx`. Étalon : accueil 1280.

## Ce qui est conforme
- Décision du 14/11 respectée : une seule rangée de catégories pour les trois profils, « Toutes » active (pastille violette pleine), aucune rangée de liens thème au-dessus (`visiteur-vannes-1280.png`, `en-cours-vannes-1280.png`).
- Les 10 vannes gratuites du visiteur couvrent 10 catégories différentes (Boulot, Vie quotidienne, Couple, Soirées, École, Famille, Autodérision, Absurde, Digital, Jeux de mots) : le seuil « au moins 5 catégories » est tenu.
- Une seule offre au mur (bouton « Ouvrir la suite des vannes · 1,99 €/mois », lien secondaire gratuit), pas de modale à l'arrivée, pas de mur plein écran.
- Cibles 44 px : pastilles `min-h-[44px]`, flèche de fiche `h-11 w-11` (pastille 32 px), bouton « Révéler la chute » `min-h-11`.
- Aucun débordement horizontal aux 5 largeurs ; grille 2 colonnes dès `md`, 1 colonne à 375.
- Abonné : pagination 1 à 8 présente, pas de mur ; la phrase de vente Premium est bien masquée dans le chapô (`en-cours-vannes-1280.png`).

## Notes

| Critère | Note |
|---|---|
| Design 1 Fidélité à l'accueil | 7 |
| Design 2 Hiérarchie, lisibilité | 9 |
| Design 3 Mise en page 5 largeurs | 8 |
| Design 4 Cohérence avec l'espace | 9 |
| Design 5 Finition au pixel | 8 |
| UX 1 Compréhension | 10 |
| UX 2 Action principale | 9 |
| UX 3 États vides / nouvel abonné | 9 |
| UX 4 Aperçu Premium | 8 |
| UX 5 Accessibilité, cohérence comptes | 9 |

**Note globale (minimum) : 7/10. Barre de 9 non atteinte.**

## Détail des défauts

### D1 : cartes sans le filet dégradé violet de l'étalon (faute dure, Design 1 = 7)
Sur l'accueil (étalon 1280), chaque carte porte un filet dégradé violet en haut et des coins `rounded-xl`. Ici (`visiteur-vannes-1280.png`, `gratuit-vannes-1920.png`) les 10 cartes sont des rectangles gris uniformes à fin liseré : on lit « tableau de bord gris », ce que le brief interdit. `ui/card.tsx` donne `rounded-lg border border-border bg-background-card`, sans filet. Les murs (`MurListe`, `CarteFloutee`) n'en ont pas non plus.
Correction : dans `vannes-list.tsx`, sur la `Card` des vannes (et des squelettes), ajouter le filet de l'accueil (reprendre la classe ou le pseudo-élément utilisé par les cartes de `components/home`, à retrouver par recherche de `gradient` dans ce dossier) avec `relative overflow-hidden rounded-xl`. De préférence, en faire une variante `Card variant="filet"` dans `ui/card.tsx` pour que Conseils, Vidéos et le reste de l'espace parlent la même langue (à arbitrer avec les autres groupes). Ce qui ferait 10 : filet + `rounded-xl` sur les cartes, mur et carte floutée compris, et titre de page traité comme l'accueil (voir D2).

### D2 : titre et chapô alignés à gauche, titre de section de la FAQ sans le traitement de l'accueil (piste, Design 1)
L'accueil centre hero et titres de section. `PageHeader` est aligné à gauche pour tout le catalogue ; si l'espace entier est à gauche (non vérifié ici, hors groupe), c'est cohérent et ce n'est qu'une piste. Ne retient pas la note à elle seule.

### D3 : vide à droite sur les blocs de texte à 1280 et plus (faute dure, Design 3 = 8)
« Pourquoi ces vannes sont différentes » (`max-w-3xl`) et le chapô laissent environ 40 % de la largeur vide à droite à 1280, 1456 et 1920 (`visiteur-vannes-1280.png` : texte s'arrêtant vers x=500 sur 784 ; `gratuit-vannes-1920.png` : vers x=690 sur 985). Le brief exige « aucun vide à droite à 1280+ ». La FAQ et « La suite » occupent toute la largeur, d'où un rythme décousu.
Correction dans `page.tsx` : bloc SEO en deux colonnes `lg:grid lg:grid-cols-[1fr_2fr]` (H2 à gauche, paragraphes à droite) ou paragraphes sur 3 colonnes (`lg:columns-2 lg:gap-8`) ; passer le texte de `text-sm` à `text-base`. Le chapô garde `max-w-3xl` (longueur de lecture), c'est admis.

### D4 : paragraphe « Premium : premier paiement remboursable… » centré dans un bloc aligné à gauche (Design 5 = 8)
`visiteur-vannes-1280.png`, bloc du mur : titre, bouton et lien sont à gauche, cette ligne est centrée, ce qui casse l'alignement. Fichier : `components/premium/mur-liste.tsx`, retirer le `text-center` de cette ligne (ou centrer tout le bloc comme l'encart d'offre de l'accueil, qui est centré). Piste de finition, pas une faute dure.

### D5 : carte floutée quasi vide (UX 4 = 8)
Sous le mur (`visiteur-vannes-1280.png`), la carte verrouillée n'est que deux barres grises et un cadenas : elle ne montre aucune valeur. Pour « valeur visible, pas de mur », un amorce réelle floutée (début d'une vanne, catégorie lisible, par exemple le nombre de vannes restantes déjà connu via `totalReal`) vaudrait mieux. Fichier : `components/premium/carte-floutee.tsx`. Si le texte ajouté est nouveau, il est à valider par Thomas et ne retient pas la note. Piste.

### D6 : rangée de catégories coupée, « Jeux de mots » jamais visible sans défilement (Design 3 / Design 5)
À 1280 et 1920 la rangée (`RANGEE_CHIPS_UNE_LIGNE`) coupe « Absurde » et masque « Jeux de mots » alors que la colonne de 764 à 984 px est pleine : la 10e catégorie, présente dans les vannes gratuites, n'est pas atteignable à l'œil sur desktop. Le choix « une seule ligne » vient d'un arbitrage s21 (T3-07), donc non rediscuté ; piste : réduire `gap-2` à `gap-1.5` et le padding `lg:px-3` à `lg:px-2.5` pour faire tenir 9 pastilles, ou ajouter une flèche de défilement visible à droite dès `lg`. Piste.

### D7 : « Toutes » semble filtrée pour l'abonné (UX 1 / UX 5, piste)
`en-cours-vannes-1280.png` et `nouvel-vannes-768.png` : 11 vannes sur 12 de la page 1 sont « Boulot & Collègues ». « Toutes » active donne l'impression d'un filtre Boulot, et la page ne varie pas entre visiteur et abonné (visiteur : 10 catégories mélangées). C'est un souci de tri des données (ordre de `getJokesPage`), pas de design : `lib/catalogue-pages.ts`, mélanger les catégories sur la page 1. À signaler à Thomas, ne retient pas la note design.

### D8 : cohérence entre comptes (UX 5)
Le visiteur et le compte gratuit sont identiques (normal). Abonné : bonne différence (pagination à la place du mur). Aucune incohérence d'état trouvée. L'icône cloche et le profil changent selon le compte, hors périmètre.

## Ce qui ferait 10
1. Filet dégradé et `rounded-xl` sur toutes les cartes (D1).
2. Blocs de texte et FAQ qui remplissent la largeur à 1280+ (D3).
3. Carte floutée avec un aperçu réel (D5), ligne de prix alignée (D4).

## Fautes dures
1. Cartes sans filet dégradé ni `rounded-xl` : `apps/web/src/components/vannes/vannes-list.tsx` (et variante dans `apps/web/src/components/ui/card.tsx`).
2. Vide à droite à 1280+ sur le bloc « Pourquoi ces vannes sont différentes » : `apps/web/src/app/(dashboard)/vannes/page.tsx`.

NOTE GLOBALE : 7/10
