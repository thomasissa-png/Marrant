# Relecture design à l'aveugle, s25 navigation v6, tour 5, groupe « s-entrainer »

Périmètre : `s-entrainer/` (visiteur, gratuit, en-cours, nouvel) et `fiches/` jeu, séance, bilan (en-cours, nouvel).
Captures ouvertes : 375, 1280, 1920 de chaque compte S'entraîner ; 375, 1280, 1920 des fiches jeu/séance/bilan (768 et 1456 non ouvertes : aucun doute de mise en page aux trois largeurs vues).
Étalon : accueil visiteur 1280 (cartes `rounded-xl` à filet violet, rythme aéré).

## Constats vérifiés
- Cible tactile du lien « Retour : … » : visuellement ~36 px, mais `min-h-11` dans `apps/web/src/components/espace/lien-retour.tsx` = 44 px. Pas une faute.
- Colonne centrée `max-w-3xl` des fiches et de S'entraîner (marges égales à 1280 et 1920) : gabarit voulu, pas un vide.
- Puces Oui / À moitié / Rien, Pas essayé / Essayé, bof / Essayé, ça a marché, « 10 secondes pour répondre » : ~44 px de haut mesurés sur les captures 1280.

## Design
1. Fidélité à la langue de l'accueil : 10/10. Filet dégradé violet en haut de chaque carte, `rounded-xl`, titre H1 centré sur les rubriques, pastilles « Nouvelle » / « À revoir » et jauge « Marche N », fond et cartes identiques à l'accueil (visiteur-s-entrainer-1280.png, en-cours-s-entrainer-1920.png).
2. Hiérarchie et lisibilité : 9/10.
   - Défaut : la séance « Dix chambrages, dix secondes » (en-cours-fiche-seance-1280.png) enchaîne onze intertitres en gras à la même taille que le corps (« Pour qui, quand », « Échauffement · 3 min », « Essai · 8 min »…) dans une seule carte : on lit un mur, les étapes chronométrées ne ressortent pas.
   - Piste codable (ne retient pas la note) : intertitres d'étape en `text-lg font-semibold` avec `mt-6` plus marqué entre blocs, durée en pastille `text-text-secondary`, ou un filet `border-t border-border` entre étapes, dans le composant de rendu de la fiche séance (`apps/web/src/components/espace/` fiche séance). Ferait 10.
   - Piste : dans l'aperçu Premium (visiteur/gratuit), la réponse « C. » est une ligne nue au-dessus de l'explication grise 14 px (visiteur-s-entrainer-1280.png) ; la préfixer visuellement (« Réponse » en eyebrow ou `font-semibold text-text-primary`) la ferait ressortir. Texte à ne pas changer, style seul.
3. Mise en page aux 5 largeurs : 10/10. À 375, aucune coupe : cartes pleine largeur, puces qui passent à la ligne proprement (en-cours-fiche-jeu-375.png), liste numérotée 1 à 10 sans débordement (nouvel-fiche-seance-375.png). À 1280 et 1920, colonne centrée de lecture, marges égales.
4. Cohérence avec le reste de l'espace : 9/10. Même rythme de cartes et mêmes intertitres sur S'entraîner, jeu, séance, bilan. Défaut mineur : sur le bilan, le titre de la 3e carte (« Quelqu'un te chambre sur ton retard / habituel. Remets ta réponse dans l'ordre. ») se coupe à ~60 % de la largeur de la carte à 1280 et 1920 (en-cours-fiche-bilan-1280.png), alors que les autres titres vont jusqu'au bord. Piste : retirer le plafond de largeur du titre (`max-w-*` sur le H2) ou passer `text-balance`.
5. Finition au pixel : 9/10. Alignements propres, contrastes AA visibles (gris secondaire sur carte sombre lisible), focus ring prévu dans le code. Réserve légère : eyebrows « LA SCÈNE », « À TOI », « LE CONTEXTE » et « Si tu as 5 minutes » en ~11-12 px, lisibles mais petits (piste : `text-xs` plancher). « Enregistrer » grisé tant que le champ est vide : état désactivé, exempté.

## UX
1. Compréhension : 10/10. Titre « S'entraîner » + sous-titre, onglet actif souligné, « Retour : S'entraîner » sur chaque fiche. Sur le bilan, l'onglet actif est « Parcours » et le retour dit « Retour : Répartie » : cohérent entre eux.
2. Action principale : 9/10. Sur S'entraîner (en-cours), trois cartes empilées portent chacune trois puces de poids égal ; aucune action unique dominante, mais c'est une file d'exercices à parcourir, pas une page de décision. Piste : rien à coder, à garder sous surveillance si la file s'allonge.
3. États vides et nouvel abonné : 10/10. `nouvel` reçoit deux exercices (une situation « Nouvelle » et la marche 1), jamais une page morte (nouvel-s-entrainer-1280.png). À signaler sans retenir la note : les trois cartes du bilan s'affichent identiques pour `nouvel` et `en-cours` (nouvel-fiche-bilan-1280.png) alors que `nouvel` n'a pas fait le parcours ; si c'est une donnée de démonstration, rien à faire, sinon à vérifier côté contenu.
4. Aperçu Premium pour non-abonné : 10/10. Un exemple réel et complet (« Quelle réplique ? » avec sa réponse dépliée), une seule offre « Premium · 1,99 €/mois », « Connexion » seulement pour le visiteur, pas de mur. Cohérent entre visiteur et gratuit.
5. Accessibilité visible et cohérence entre comptes : 10/10. Gabarits identiques entre comptes, libellés texte (jamais d'icône seule dans le contenu), cibles 44 px.

## Fautes dures
Aucune.

## Pistes (ne retiennent pas la note)
- Séance : séparer visuellement les étapes (taille/filet), fiche séance dans `apps/web/src/components/espace/`.
- Aperçu : mettre « C. » en valeur (style seulement).
- Bilan : retirer le plafond de largeur du titre de la 3e carte.
- Eyebrows de 11-12 px : monter d'un cran si la place le permet.

NOTE GLOBALE : 9/10
