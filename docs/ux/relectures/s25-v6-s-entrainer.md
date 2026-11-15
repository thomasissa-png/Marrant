# Relecture à l'aveugle v6 tour 1 : S'entraîner et ses fiches (jeu, séance, bilan)

Périmètre : captures `s-entrainer/` (4 comptes x 5 largeurs), `fiches/*fiche-jeu*`, `*fiche-seance*`, `*fiche-bilan*` (en-cours, nouvel) ; code `s-entrainer/page.tsx`, `fiche/[type]/[id]/page.tsx`, `components/espace/` (apercu-rubrique, carte/styles, corps-divers, boutons-reponse, reponse-dabord). Valeurs lues dans le code : `CARTE` = `rounded-lg` (12 px) sans filet ; aperçu = `rounded-xl` + filet dégradé `h-0.5`.

## Notes

| Critère | Note | Raison courte |
|---|---|---|
| D1 Fidélité à l'accueil | 7 | L'aperçu a `rounded-xl` + filet violet, les cartes de l'abonné (rafale, mission, fiches) non : deux langues sur la même rubrique |
| D2 Hiérarchie, lisibilité | 8 | Titre, accroche, cartes lisibles ; carte seule à 1216 px = lignes de 140 caractères |
| D3 Mise en page 5 largeurs | 6 | Aperçu : colonne de 768 px, vide à droite de 1280 à 1920 |
| D4 Cohérence espace | 8 | Rythme, `gap-6`, titres cohérents avec Aujourd'hui ; écart de carte ci-dessus |
| D5 Finition | 8 | Filet orphelin en haut de « À toi », « Ce qu'on aurait pu dire » sans marqueur |
| U1 Compréhension | 8 | Titre + accroche clairs ; bandeau « Si tu as 5 minutes » + « Nouvelle » lisible |
| U2 Action principale unique | 7 | Fiche jeu : la réponse (le cœur du jeu) est cachée derrière un intitulé qui ne ressemble pas à un contrôle |
| U3 États vides, nouvel abonné | 9 | Nouvel abonné : 1 carte + marche 1, jamais une page morte |
| U4 Aperçu Premium | 8 | Un seul bouton plein, Connexion pour le visiteur seul, pas de mur ; mais la valeur (la réponse) est masquée sans signal |
| U5 Accessibilité, cohérence | 8 | Cibles 44 px, puces avec contour ; summary sans indicateur d'ouverture |

**NOTE GLOBALE : 6/10** (minimum, D3). Sous la barre de 9.

## Fautes dures

### FD1 : aperçu S'entraîner, vide à droite de 1280 à 1920 (D3)
Fichiers : `visiteur-s-entrainer-1280.png`, `-1456.png`, `-1920.png`, `gratuit-s-entrainer-1280/1456/1920.png`. La carte s'arrête à 768 px (`max-w-3xl`), 448 px de noir à droite à 1280, davantage à 1456 et 1920 (coque 1216, voir `apercu-rubrique.tsx` ligne 49). Le titre et le sous-titre sont aussi collés à gauche sans rien en face.
Correction codable (`components/espace/apercu/apercu-rubrique.tsx`) : remplacer `mt-6 max-w-3xl` par une grille `mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]` ; l'`<article>` (exemple) prend la colonne 1 sans `max-w-3xl` ; le bloc `data-apercu-offre` (même bouton, même lien Connexion, mêmes textes) sort de l'article dans une carte `rounded-xl border border-border bg-background-card p-5 lg:sticky lg:top-32` en colonne 2 ; sous `lg`, ordre inchangé (exemple puis offre). Aucun texte nouveau. À 375 et 768 rien ne change. Ce qui ferait 10 : aucun vide à droite aux 3 largeurs larges, un seul bouton plein toujours visible à côté de l'exemple.

### FD2 : « Ce qu'on aurait pu dire » ne ressemble pas à un contrôle (U2, D5)
Fichiers : `en-cours-fiche-jeu-1280.png`, `en-cours-fiche-jeu-375.png`, `nouvel-fiche-jeu-375.png`, `visiteur-s-entrainer-375/768/1280.png` (aperçu : même fiche). Dans `corps-divers.tsx` (CorpsJeu, ligne 79-87) c'est un `<details>` fermé dont le `<summary>` s'affiche comme un simple intitulé gras : pas de chevron, pas de bordure. Le lecteur voit un titre sans contenu dessous, croit à un bug ou à du contenu manquant, et le visiteur ne comprend pas que la réponse existe (la valeur de l'aperçu est masquée). Le même contrôle est utilisé dans la fiche abonné.
Correction : sur le `<summary>` ajouter `list-none [&::-webkit-details-marker]:hidden gap-2 rounded-lg border border-border-input px-3 hover:bg-background-elevated focus-visible:ring-2 focus-visible:ring-accent-primary` et un chevron SVG `aria-hidden` en fin de ligne, `group-open:rotate-180` (mettre `group` sur le `<details>`). Garder le libellé existant, la cible de 44 px (`min-h-11`) est déjà là. Ce qui ferait 10 : on voit tout de suite que l'intitulé s'ouvre.

### FD3 : cartes de l'abonné pas dans la langue de l'accueil (D1)
Fichiers : `en-cours-s-entrainer-1280.png` et suivantes vs `visiteur-s-entrainer-1280.png`. Sur la même rubrique, l'aperçu a `rounded-xl` et le filet dégradé violet en haut (comme les cartes de l'accueil), les cartes de l'abonné (rafale, mission, cartes de fiche, bilan, « À toi ») sont `rounded-lg` sans filet, comme un tableau de bord. La décision de Thomas impose l'étalon à tout l'espace.
Correction (`components/espace/carte/styles.ts`, constante `CARTE`, ligne 11) : passer à `relative overflow-hidden rounded-xl ...` et ajouter le filet dans les composants qui l'emploient, ou plus simple : classe `before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-accent-primary-hover before:to-accent-secondary-hover` ajoutée à `CARTE`. `CARTE` est partagée par toute l'espace (ses autres groupes en profitent ; à vérifier au tour suivant). Ce qui ferait 10 : une carte de l'espace = une carte de l'accueil.

## Pistes (ne retiennent pas la note seules)

- **P1 Mesure de ligne à 1216 px** (`nouvel-s-entrainer-1280/1456/1920.png`, `en-cours` pour la mission) : la carte seule et la mission prennent la ligne entière, texte sur ~150 caractères. Dans `s-entrainer/page.tsx`, quand `montrables === 1` et qu'une mission existe, retirer `md:col-span-2` de la mission et `seuleSurSaLigne` (deux colonnes, texte à ~560 px). Pour la mission pleine largeur (en-cours), borner le texte de l'énoncé dans `mission-carte.tsx` avec `max-w-prose` et poser « Ton retour » à droite dès `lg`.
- **P2 Filet orphelin** (`en-cours-fiche-jeu-1280.png` y 584, idem séance et bilan) : la carte « À toi » commence par un trait de séparation sans rien au-dessus. Retirer la `border-t`/`pt` du premier enfant (fichier `components/espace/carte/geste-fiche.tsx`, à confirmer).
- **P3 Séance, Observation** (`en-cours-fiche-seance-1280.png`) : les dix phrases à observer sont servies en un seul paragraphe « 1. ... 2. ... » (texte du lot, `whitespace-pre-line` ne les sépare pas). Texte inchangé : les rendre en liste dans `CorpsSeance` si les données portent un tableau ; sinon à signaler au lot de contenu (à valider par Thomas).
- **P4 Ordre dans la fiche jeu** : la carte « À toi » dit « Dis ta réponse avant de lire la suite » alors que les trois choix sont déjà affichés au-dessus. Texte validé : signalé, pas réécrit ; envisager de placer « À toi » avant les choix (structure, `fiche.tsx`).
- **P5 Bilan** (`en-cours-fiche-bilan-1280.png`) : trois cartes dont deux titrées « Refais une situation », sans repère « 1 sur 3 ». Un compteur serait un texte nouveau, à valider par Thomas.
- **P6 Titres alignés à gauche** alors que l'étalon centre les titres de section : cohérent avec les autres pages de l'espace et du site (PageHeader), pas un défaut ici.

## Hors périmètre, signalé
- Bande, visiteur à 1280 et 1920 (`visiteur-s-entrainer-1280.png`, `-1920.png`) : « Carnet » est coupé par le fondu avant « … » alors que la spec annonce 105 px libres ; rien n'est tronqué pour le gratuit et l'abonné. À traiter par le groupe de la bande.
- Les trois boutons « Oui / À moitié / Rien » paraissent éteints sur les captures : c'est la pause voulue de 3 secondes (`boutons-reponse.tsx`, `aria-disabled`), pas un défaut.

## Ce qui est conforme
Aperçu : un seul bouton plein, pas de fenêtre, Connexion seulement pour le visiteur (absent chez le gratuit, juste) ; chip S'entraîner allumé aux 3 comptes ; fiches jeu et séance allument S'entraîner, bilan allume Parcours ; « Retour : S'entraîner » présent ; aucun débordement horizontal à 375 ; puces avec contour en plus de la couleur ; colonne de lecture de 768 px centrée pour les fiches.

## Cognitive walkthrough bref (nouvel abonné)
Arrive : voit « S'entraîner », une carte « Nouvelle », « Ta réponse d'abord » puis 10 secondes : sait quoi faire. Marche 1 facultative en dessous : jamais bloquant. Friction : [FRICTION H6] sur la fiche jeu, l'abonné ne voit pas que la réponse s'ouvre (FD2).

NOTE GLOBALE : 6/10
