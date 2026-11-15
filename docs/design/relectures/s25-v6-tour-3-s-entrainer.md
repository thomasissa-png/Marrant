# Relecture DESIGN à l'aveugle, s25 v6 tour 3, groupe s-entrainer

Périmètre : `v6-tour-3/s-entrainer/` (4 comptes) et `v6-tour-3/fiches/` jeu, seance, bilan (en-cours, nouvel). Captures lues : visiteur 375 et 1280, gratuit 1920, en-cours 768 et 1280, nouvel 1280, fiches jeu 1280, seance 1280 et 375 (nouvel), bilan 1280 et 1920. Les largeurs non ouvertes sont déduites du gabarit commun et non notées séparément. Aucune relecture existante lue.

## Notes

| Critère | Note | Verdict |
|---|---|---|
| 1 Fidélité à l'accueil | 7 | Filet violet et `rounded-xl` repris ; titres alignés à gauche, aucune pastille d'accueil |
| 2 Hiérarchie, lisibilité | 8 | Bonne ; fiche séance trop plate |
| 3 Mise en page 5 largeurs | 6 | Vides à droite à 1280+ (faute dure) |
| 4 Cohérence avec l'espace | 7 | Aperçu centré vs liste abonné à gauche |
| 5 Finition | 8 | Quelques détails |

Globale = minimum = 6/10.

## Ce qui est conforme
- Aperçu visiteur/gratuit (visiteur-s-entrainer-1280, gratuit-s-entrainer-1920) : H1 et sous-titre centrés comme l'accueil, carte `rounded-xl` à filet violet, une fiche réelle lisible en entier, un seul bouton plein ; le lien Connexion n'apparaît que chez le visiteur (cohérent avec le gratuit déjà connecté). Chip S'entraîner allumé avec cadenas. 375 : rien ne déborde, bouton et Connexion tiennent sur une ligne.
- Fiches jeu et bilan (colonne centrée ~768 px, retour, H1, méta, cartes à filet) : lisibles, alignées, rythme régulier aux largeurs 1280 et 1920. Pas de vide parasite : la colonne étroite centrée est un choix de lecture assumé.
- Chip Parcours allumé sur le bilan et S'entraîner allumé sur jeu/séance : conforme à la spec §4.

## Fautes dures

**F1. Vide à droite dans les cartes de la liste abonné à 1280, 1456, 1920** (en-cours-s-entrainer-1280, nouvel-s-entrainer-1280). La carte « À un proche, par message » (Marche 2) et les deux cartes du compte nouvel occupent 1216 px de coque mais leur texte est plafonné à environ 650 px (`max-w` de lecture posé sur le texte, pas sur la carte) : toute la moitié droite de la carte est vide, filet violet compris. Même défaut sur « À voix haute, sans public » du compte nouvel. Critère explicite de la grille (aucun vide à droite à 1280+).
- Correction : soit plafonner la CARTE (`mx-auto max-w-3xl`, comme les fiches jeu/bilan à 768 px) pour tous les états de la liste, soit conserver la grille 2 colonnes `lg:grid-cols-2` y compris pour les marches et les séances seules (une carte seule = `mx-auto max-w-3xl`). Fichier : page `apps/web/src/app/(espace)/s-entrainer/page.tsx` (ou composant de liste S'entraîner) ; classes `grid lg:grid-cols-2 gap-6` et `max-w-3xl mx-auto` sur la carte unique.
- Ferait 10 : à 1280+, chaque carte pleine largeur répartit son contenu (scène à gauche, réponse et boutons à droite) ou devient une colonne centrée de 768 px.

**F2. Hauteurs inégales dans la grille 2 colonnes** (en-cours-s-entrainer-1280 : carte « Amis » finit à y 868, carte « Soirée » à y 992, soit 124 px de vide sous la carte de gauche). Le texte plus long de la carte de droite laisse un trou sous la gauche, visible comme un défaut d'alignement.
- Correction : `items-start` plus sobre n'y change rien ; passer à une seule colonne centrée (`max-w-3xl`, comme F1) pour toutes les fiches du jour, ou `items-stretch` avec le bloc boutons en `mt-auto` pour aligner les bas. Même fichier que F1.

## Pistes (ne retiennent pas la note)
- Cohérence 4 : l'aperçu est centré (H1, sous-titre), la liste abonné est alignée à gauche avec un sous-titre de 790 px. L'accueil est centré ; si la liste abonné devait suivre la langue de l'étalon, centrer H1 et sous-titre (`text-center mx-auto`). Piste subjective, cohérent avec les autres pages B de l'espace que je n'ai pas revues.
- Fiche séance (en-cours-fiche-seance-1280, nouvel-fiche-seance-375) : dix sous-titres de même poids dans une seule carte de 660 px, 1 100 px de hauteur, pas de séparateur entre les temps (Échauffement, Observation, Essai, Bilan). Lisible mais monolithique. Piste : filet `border-t border-border pt-4` entre sections (`space-y-6` existe déjà). Un chronométrage en pastille (« 3 min ») serait un contenu à valider par Thomas.
- Labels 12 px gris (« Si tu as 5 minutes », « LA SCÈNE », « Facultative ») : sur fond de carte sombre le gris paraît proche de 4,5:1 ; contraste à mesurer, je ne peux pas le confirmer sur capture.
- Bouton « Enregistrer » désactivé (fiches jeu, séance, bilan) : état désactivé violet très atténué, texte illisible ; acceptable pour un état disabled mais peu soigné. Piste : `disabled:opacity-60` sur la couleur pleine plutôt qu'un violet foncé à texte grisé.
- Mobile 375 (nouvel-fiche-seance-375) : la bande défile, Aujourd'hui masqué à gauche, S'entraîner visible et centré : conforme.

## Hors périmètre signalé
Aucun texte jugé faux. Aucune proposition de texte.

NOTE GLOBALE : 6/10
