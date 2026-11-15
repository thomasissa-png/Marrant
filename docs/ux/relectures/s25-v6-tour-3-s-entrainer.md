# Relecture UX à l'aveugle, tour 3 : S'entraîner + fiches jeu, séance, bilan (navigation v6, s25)

Captures lues : `v6-tour-3/s-entrainer/` (4 comptes, dont 1280, 1920, 375, 768 ouvertes une à une ; 1456 identique à 1280 d'après l'INDEX, mêmes hauteurs) et `v6-tour-3/fiches/` jeu, séance, bilan (en-cours, nouvel). Fichier principal : `apps/web/src/app/(dashboard)/mon-espace/s-entrainer/page.tsx`.

## Notes

| Critère | Note |
|---|---|
| Design 1 fidélité accueil | 9 |
| Design 2 hiérarchie / lisibilité | 9 |
| Design 3 mise en page 5 largeurs | **7** (faute dure) |
| Design 4 cohérence espace | 9 |
| Design 5 finition | 9 |
| UX 1 compréhension | 10 |
| UX 2 action principale | 9 |
| UX 3 états vides / nouvel | 9 |
| UX 4 aperçu Premium | 9 |
| UX 5 accessibilité / cohérence comptes | 9 |

Globale = 7/10 (minimum). Sous la barre de 9 à cause d'une seule faute dure.

## Faute dure

**F1. Vide à droite dans les cartes de S'entraîner, à 1280, 1456 et 1920** (`en-cours-s-entrainer-1280.png`, `-1920.png`, `nouvel-s-entrainer-1280.png`, `-1920.png`).
- Carte « Marche 2 » (en-cours) et cartes « Soirée » et « Marche 1 » (nouvel) occupent toute la coque (1216 px) mais leur texte est plafonné à environ 650 px : environ 45 % de la carte est vide à droite, titre et bouton compris. À 1920 la carte « Marche 2 » montre un grand rectangle sombre vide à droite du texte.
- Les rangées Oui / À moitié / Rien du compte nouvel s'arrêtent à 713 px sur une carte large de 1216 : l'alignement du bloc est collé à gauche dans sa propre carte.
- En-cours : les deux cartes de la 1re rangée n'ont pas la même hauteur (868 contre 992 px) et la carte de gauche laisse un trou de 124 px sous elle avant la carte pleine largeur.
- Critère de la grille : « aucun vide à droite à 1280+, aucune colonne collée à gauche ». Non conforme.
- Correction codable (`s-entrainer/page.tsx` et le composant de carte d'exercice) : une carte pleine largeur ne doit exister que si son contenu l'est. Soit (a) grille `md:grid-cols-2 items-stretch` pour toutes les cartes (la 3e passe en demi-largeur, la carte impaire reste en demi-largeur, pas `col-span-2`), soit (b) colonne unique `mx-auto max-w-3xl` (768 px, même gabarit que les fiches) pour la liste entière. Retirer le plafond de texte interne (`max-w-prose`/équivalent) des cartes qui restent larges. Ajouter `items-stretch` et `flex flex-col` avec le bloc de boutons en `mt-auto` pour aligner le bas des cartes de gauche et de droite.
- Ce qui ferait 10 : à 1280 et plus, aucune carte n'a de zone vide supérieure à 15 % de sa largeur, et les bords bas des cartes d'une même rangée coïncident.

## Détail par critère (notes < 10)

- **Design 1 (9)** : cartes `rounded-xl` à filet violet, conformes à l'étalon. En-tête de page aligné à gauche alors que l'accueil centre ses titres ; cohérent avec les autres pages de l'espace (gabarit B), donc piste seulement. Pour 10 : rien d'obligatoire.
- **Design 2 (9)** : le sous-titre de page se casse en laissant « la dire à temps. » seul sur sa 2e ligne à 1280 (`en-cours-s-entrainer-1280.png`) : piste, ajouter `text-balance` au `<p>` du sous-titre. Dans la fiche séance (`en-cours-fiche-seance-1280.png`) les intertitres (« Échauffement · 3 min », « Essai · 8 min ») ont la même taille que le corps : un `text-base font-semibold` n'ancre pas assez le découpage en minutes ; piste, passer en `text-lg` avec `mt-6`. Contenu validé non touché.
- **Design 3** : voir F1. Fiches jeu, séance, bilan : colonne centrée de 768 px à 1280 et plus, mêmes bords aux 5 largeurs, rien ne déborde, 375 propre. Conforme.
- **Design 4 (9)** : la page S'entraîner utilise la pleine coque (1216 px) alors que ses fiches filles sont en 768 px centrées. Piste liée à F1 (option b règle les deux).
- **Design 5 (9)** : les puces de niveau (« Marche 2 » + barres) sont minuscules à côté du libellé (barres d'environ 8 px de large) ; la hauteur des boutons Oui / À moitié / Rien et « Essayé » est d'environ 44 px, à conserver. Le bouton « Enregistrer » désactivé est faible (exempt AA, état désactivé) mais se confond avec un bouton actif sombre ; piste : ajouter `disabled:opacity-60` plutôt que de changer la teinte. À 375, `en-cours-s-entrainer-375.png` : le texte « Prends ton temps » en gris moyen sur fond de carte est à vérifier à 4,5:1 (`text-text-muted` ?).
- **UX 1 (10)** : titre, sous-titre et badge « Si tu as 5 minutes » disent tout en 3 secondes ; chip S'entraîner allumé aux 4 comptes ; « Retour : S'entraîner » présent sur les fiches jeu et séance, « Retour : Répartie » sur le bilan avec Parcours allumé (conforme à la règle de chip).
- **UX 2 (9)** : dans une carte d'exercice, « 10 secondes pour répondre », « Prends ton temps » et « Tu avais une réponse ? Oui / À moitié / Rien » sont tous visibles et cliquables en même temps : un premier visiteur peut répondre avant d'avoir cherché. Piste (non retenue pour la note) : `aria-disabled` sur les trois boutons de réponse tant que le chrono n'a pas été lancé ou passé, ou masquer le bloc de réponse sous un bouton unique « J'ai répondu ». Aucun texte nouveau requis. À 1280 deux cartes de même poids se partagent la page : l'exercice « Nouvelle » ne se distingue que par un badge ; piste, mettre le premier en `border-accent-primary/40`.
- **UX 3 (9)** : le compte nouvel voit 2 exercices complets avec boutons et une fiche « Marche 1 » : jamais une page morte, c'est correct. Fiches nouvel et en-cours identiques, bon. Piste : aucun message de progression (« 0 exercice fait ») : à valider par Thomas, non retenu.
- **UX 4 (9)** : aperçu visiteur et gratuit (`visiteur-s-entrainer-1280.png`, `gratuit-s-entrainer-375.png`) : H1, sous-titre validé, une vraie fiche (« Quelle réplique ? ») lisible en entier avec sa réponse dépliée, un seul bouton plein dans la carte d'offre, lien Connexion pour le visiteur, aucun mur ni fenêtre. Cadenas sur les rubriques Premium, chip allumé. Conforme à la spec. Réserve : au visiteur à 1280, le bouton d'offre apparaît deux fois (en-tête et carte d'offre). C'est dicté par la spec (bouton d'en-tête existant) : ni faute ni retenue. La carte d'offre ne dit pas ce que contient Premium (aucune ligne de valeur) : piste « à valider par Thomas ».
- **UX 5 (9)** : cohérence entre comptes bonne (même gabarit, mêmes états). Focus visible non vérifiable sur capture : à confirmer au test clavier. À 375, la bande défile avec fondu à droite et chip actif visible : conforme. Le compte gratuit à 375 n'affiche pas Connexion (normal, connecté).

## Pistes (ne retiennent pas la note)
1. `text-balance` sur le sous-titre de S'entraîner.
2. Intertitres de la séance plus marqués (taille).
3. Bloc de réponse désactivé jusqu'au chrono.
4. Mise en avant de l'exercice « Nouvelle ».

## Verdict
NO-GO tant que F1 n'est pas corrigé ; le reste dépasse la barre de 9. Après correction de F1, la note remonte à 9 minimum.

NOTE GLOBALE : 7/10
