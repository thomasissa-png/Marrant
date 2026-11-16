# Relecture DESIGN à l'aveugle, s25 navigation v6, tour 4, groupe « s-entrainer »

Périmètre : `s-entrainer/` (visiteur, gratuit, en-cours, nouvel) et `fiches/` jeu, seance, bilan (en-cours, nouvel). Captures ouvertes : 375, 1280, 1920 des 4 comptes de `s-entrainer/` ; 768 en-cours ; 375, 1280 de jeu, seance, bilan (en-cours, nouvel) ; 1920 de bilan (en-cours) et de jeu (nouvel). Cibles tactiles vérifiées dans `components/espace/carte/styles.ts` : `min-h-11` partout (boutons, puces, `SOMMAIRE_REPLIABLE`, `LIEN`) = 44 px, aucune faute.

## Ce qui est conforme
- Langue de l'accueil : H1 centré, sous-titre centré, cartes `rounded-xl` à filet dégradé violet, pastilles « Nouvelle » / « À revoir », rythme `gap-6`. Même grammaire à 375, 768, 1280, 1920.
- Aperçu visiteur / gratuit (`visiteur-s-entrainer-*`, `gratuit-s-entrainer-*`) : une vraie fiche lisible (« Quelle réplique ? » avec la réponse dépliée), un seul bouton plein, « Connexion » en lien seulement pour le visiteur, aucun mur, chip S'entraîner allumé avec cadenas, bande identique aux autres comptes. Colonne centrée de 768 px à 1280 et 1920, symétrique, aucun vide à droite.
- Nouvel abonné (`nouvel-s-entrainer-*`) : jamais une page morte, une carte de rafale + la marche 1, sur la pleine largeur (texte à gauche, actions à droite dès 1280), aucun débordement à 375.
- Fiches jeu, seance, bilan : gabarit A cohérent (« Retour : S'entraîner » ou « Retour : Répartie », titre, méta, carte à filet, carte « À toi »), colonne de 768 px centrée, identiques entre en-cours et nouvel, bonne lecture à 375. Chip Parcours allumé sur bilan, S'entraîner sur jeu et seance : conforme à la règle de chip allumé.
- Bouton « Enregistrer » grisé (désactivé tant que le champ est vide) : état désactivé, exempt de contraste.

## Notes /10

| Critère | Note | Justification |
|---|---|---|
| D1 Fidélité à l'accueil | 9 | Cartes, filets, pastilles, titres centrés conformes. Les cartes de la rafale sont plus denses que celles de l'accueil (texte long) mais c'est le contenu. |
| D2 Hiérarchie et lisibilité | 9 | H1, titre de carte, étiquette « LA SCÈNE », contexte en encart : clair. Piste : la fiche séance (`en-cours-fiche-seance-1280`) est un seul bloc de ~900 px sans séparateur entre étapes (Échauffement, Observation, Essai, Bilan) ; l'œil retrouve les étapes seulement par le gras. |
| D3 Mise en page aux 5 largeurs | 8 | Faute dure F1 ci-dessous (trou dans la carte de gauche). Piste F2 pour le nouvel abonné. |
| D4 Cohérence avec le reste de l'espace | 9 | Mêmes cartes et titres que les autres rubriques. Écart léger : en-cours montre deux cartes côte à côte, nouvel une carte scindée en deux colonnes (conséquence de la règle « carte seule = pleine ligne »), cohérent avec la spec. |
| D5 Finition au pixel | 9 | Cibles 44 px confirmées dans le code, focus `ring-accent-primary`, contrastes lisibles. Piste : coupures de ligne irrégulières dans « Quelqu'un se tourne vers toi : « Et toi, tu / fais quoi ? » » (`en-cours-s-entrainer-1280` et `-1920`, carte de droite), les espaces insécables forcent un retour à la ligne court ; c'est de la typographie, à signaler sans réécrire le texte. |
| U1 Compréhension | 9 | Titre + accroche + carte étiquetée « Si tu as 5 minutes » : on sait quoi faire. |
| U2 Action principale unique | 9 | En-cours : plusieurs réponses (Oui / À moitié / Rien) par carte, c'est le geste attendu, pas de bouton plein concurrent. Aperçu : un seul bouton plein. |
| U3 États vides / nouvel abonné | 9 | `nouvel-s-entrainer-*` : rafale du jour + marche 1, rien de vide. |
| U4 Aperçu Premium | 10 | Valeur visible (fiche réelle lisible), une seule offre, pas de mur, prix lu en config. |
| U5 Accessibilité et cohérence entre comptes | 9 | Cadenas et cible de 44 px conformes, structure identique entre comptes. |

## Fautes dures

**F1. Trou de ~130 px dans la carte de gauche de la rafale en-cours** (`en-cours-s-entrainer-768`, `-1280`, `-1920`, y 570 à 700 à 1280). La carte « Amis : Tu as changé quelque chose, non ? » est courte, sa voisine est longue : `cadreEntrainement(false)` = `flex h-full flex-col` avec `texteEntrainement` en `flex-1` repousse « Ta réponse d'abord » tout en bas, ce qui crée un vide au milieu de la carte, entre l'encart « Le contexte » et les actions. Sur 3 largeurs sur 5, c'est le premier défaut visible de la page et il contredit « aéré » (c'est un vide, pas de l'air). Correction codable dans `apps/web/src/components/espace/carte/styles.ts` : retirer `flex-1` de `texteEntrainement` (carte jumelle) pour que les actions suivent le texte, et laisser la marge se perdre en bas de carte (les deux cartes gardent la même hauteur via `h-full`), ou passer la grille de `s-entrainer/page.tsx` en sous-grille par rangées pour aligner seulement les blocs d'actions sans étirer le texte au milieu. Ce qui ferait 10 : plus aucun vide supérieur à 32 px entre deux blocs d'une carte, aux 5 largeurs. (Si l'arbitrage 2 du tour 3, « actions en bas », est un [CHOIX UTILISATEUR] de Thomas, cette faute est à lui soumettre plutôt qu'à corriger seul : la capture montre son effet réel.)

## Pistes (ne retiennent pas la note)
- P1. `nouvel-s-entrainer-1280` et `-1920` : la colonne de droite de la carte seule laisse ~170 px vides sous les trois boutons, et la marche 1 laisse ~150 px sous « Ton retour ». Acceptable dans une carte, mais on peut rapprocher en `lg:items-start` (déjà le cas) et ne rien ajouter. Aucune action requise.
- P2. `en-cours-fiche-seance-1280` : ajouter un filet `border-t border-border pt-4` entre les étapes pour scander le bloc de 20 minutes (`apps/web` composant de rendu des fiches séance).
- P3. Coupures irrégulières signalées en D5 : à voir côté `frEspaceProfond` (`apps/web/src/lib/fr-typo`), sans toucher au texte.

NOTE GLOBALE : 8/10
