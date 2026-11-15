# Relecture UX à l'aveugle, tour 3, groupe « bibliotheque » (navigation v6, s25)

Périmètre : `docs/captures/s25/v6-tour-3/bibliotheque/` (4 comptes x 5 largeurs) + `fiches/` (construction, formule, vocabulaire, humour-noir, a-plat ; comptes en-cours et nouvel). Lu : brief v6, navigation v6, étalon accueil, captures. Les captures 375/768/1280/1920 de tous les comptes de la rubrique et des 5 fiches ont été ouvertes ; 1456 est identique à 1280 (même hauteur, coque plafonnée à 1216), vérifié sur la rubrique abonné.

## Constats généraux
- Rubrique abonné (en-cours et nouvel) : visuellement identique. Titre H1 à gauche, 4 cartes `rounded-xl` à filet violet, en 2 colonnes dès 768 (gauche : Vannes/conseils/vidéos, Humour noir, Comment c'est construit ; droite : Vocabulaire, Formules à détourner), 1 colonne à 375. Aucun débordement, coque 1216 centrée à 1280, 1456 et 1920.
- Aperçu Premium (visiteur et gratuit) : H1 centré + sous-titre validé, UNE vraie fiche lisible en entier (« Le faux secret »), un bloc offre (bouton plein + « Connexion » pour le visiteur seulement ; gratuit : bouton seul, correct). Pas de mur, pas de fenêtre, pas de second appel.
- Fiches : colonne unique de 768 px centrée (1280+), pleine largeur avec marges à 375/768, lien « Retour : <parent> », H1, méta en capitales, carte de contenu à filet, carte « À toi » (retour + réplique + Enregistrer). Chip de bande allumé juste (a-plat sur Quoi répondre, les 4 autres sur Bibliothèque). Nouvel et en-cours : fiches identiques (mêmes hauteurs), aucune page morte.

## Notes /10

| Critère | Note | Justification |
|---|---|---|
| Design 1 fidélité accueil | 9 | Cartes, filet dégradé, rythme conformes. Mais H1 de la rubrique abonné aligné à gauche, alors que l'étalon (et l'aperçu du visiteur sur la même adresse) centre ses titres. Piste, voir P1. |
| Design 2 hiérarchie / lisibilité | 9 | Titres de cartes clairs, lignes de 50 px lisibles. Les 4 cartes ont le même poids, rien ne dit par où commencer (P2). |
| Design 3 mise en page 5 largeurs | 10 | Aucun vide à droite, aucune colonne collée, aucun débordement ; colonne gauche plus courte de ~130 px à 1280+ (bas gauche), acceptable (cartes de contenus de tailles différentes). |
| Design 4 cohérence autres pages | 9 | Rythme de cartes, retour, « À toi » cohérents entre les 5 fiches. Écart : H1 centré (aperçu) vs gauche (rubrique) sur la même adresse. |
| Design 5 finition | 8 | Faute dure F1 (cibles sous 44 px). |
| UX 1 compréhension | 10 | « Bibliothèque » + chip allumé + groupes nommés : on sait où l'on est ; retour explicite dans les fiches. |
| UX 2 action principale | 9 | Rubrique : index sans action dominante (acceptable pour une bibliothèque, P2). Fiches : 2 saisies parallèles dans « À toi » (3 boutons « Ton retour » + textarea + Enregistrer), Enregistrer grisé tant que vide : lisible mais dense (P3). |
| UX 3 états vides / nouvel | 9 | Aucune page morte ; nouvel = en-cours (rien à « vide » dans une bibliothèque). Aucun repère de départ ni de « déjà lu » pour le nouvel abonné (P2). |
| UX 4 aperçu Premium | 9 | Valeur visible (fiche complète réelle), une seule offre, pas de mur. L'ampleur du catalogue (4 familles, ~38 fiches) reste invisible au visiteur (P4, conforme à la spec « 1 à 3 éléments »). |
| UX 5 accessibilité / cohérence comptes | 8 | Faute dure F1. Cohérence comptes : bande Favoris cadenassé chez visiteur ET gratuit, alors que la spec §2 dit groupes 2 et 3 ouverts (hors périmètre, à signaler au groupe bande). |

**NOTE GLOBALE = minimum = 8/10 : non validé (barre 9 sans faute dure).**

## Fautes dures

### F1. Cibles tactiles sous 44 px (Design 5, UX 5)
Liens texte autonomes de ~16 à 20 px de haut, sans zone de toucher étendue :
- `bibliotheque/en-cours-bibliotheque-1280.png` (et 375/768/1920, nouvel idem) : liens soulignés « Vannes / Conseils / Vidéos » de la carte « Vannes, conseils, vidéos », espacés de ~15 px.
- `bibliotheque/visiteur-bibliotheque-1280.png` : lien « Connexion » du bloc offre (idem 768, 375).
- `fiches/en-cours-fiche-construction-1280.png` (et toutes les fiches, tous widths) : lien « Retour : Bibliothèque » (~16 px de haut).
- `fiches/en-cours-fiche-vocabulaire-1280.png` : trois liens « Définition complète ».
Le reste (chips ~42-44 px, lignes de liste 55 px, « Entrer » 44 px, boutons « Voir une version possible » ~42 px, chips « Ton retour » ~44 px) est à la limite mais conforme ; vérifier que les chips et « Voir une version possible » atteignent bien `min-h-11`.
Correction codable : ajouter `inline-flex min-h-11 items-center` (et `px-1` pour la largeur) aux trois liens de `components/espace/bloc-bibliotheque.tsx` ; idem au lien « Connexion » du bloc offre de l'aperçu (composant de l'aperçu, pages `(dashboard)/mon-espace/bibliotheque/page.tsx`), au lien « Retour » et à « Définition complète » dans les composants de `(dashboard)/mon-espace/fiche/[type]/[id]/page.tsx`. Passer le conteneur en `gap-x-2` pour ne pas élargir visuellement le bloc. Ce qui ferait 10 : tous les éléments interactifs mesurent ≥ 44 px de haut aux 5 largeurs, sans changer la maquette (le texte garde sa taille).

## Pistes (ne retiennent pas la note)
- P1. H1 de la rubrique abonné aligné à gauche vs H1 centré de l'aperçu sur la même adresse. Soit les deux suivent le gabarit B (à gauche), soit les deux l'étalon (centré). Arbitrage Thomas ; si centré : `text-center` sur l'en-tête de `mon-espace/bibliotheque/page.tsx`.
- P2. La rubrique abonné et le nouvel abonné : rien n'indique par où commencer. Piste : mettre en tête de page un repère déjà existant (par exemple la 1re fiche « Le faux secret » en carte mise en avant) ; tout texte nouveau est à valider par Thomas.
- P3. Dans « À toi », choisir un ordre visuel plus net : réplique d'abord, « Ton retour » ensuite. Structure inchangée, simple réordonnancement.
- P4. Aperçu : montrer les titres des 4 familles de la Bibliothèque sous la fiche (titres validés déjà existants) pour donner à voir l'ampleur ; à valider par Thomas.
- P5. Vocabulaire : « Définition complète » n'apparaît que sur 3 termes sur 5 (Chambrer et Esprit de l'escalier n'en ont pas). Si c'est voulu (pas de glossaire correspondant), RAS ; sinon à vérifier avec le contenu.
- P6. Humour noir : la carte « Entrer » de la rubrique et celle de la fiche portent le même texte et le même bouton. Si le premier « Entrer » mène à la page de la fiche, l'utilisateur confirme deux fois ; non vérifiable sur les captures.
- Hors périmètre, à transmettre au groupe bande : cadenas sur « Favoris » pour visiteur ET gratuit (`gratuit-bibliotheque-1920.png`, `visiteur-bibliotheque-1280.png`), contraire à la spec §2 (« groupes 2 et 3 ouverts », Favoris vit dans la bande pour le gratuit).

## Ce qui est bon (à ne pas casser)
Aperçu servi en page, une fiche réelle lisible en entier, un seul bouton plein dans le bloc offre, nom de rubrique constant dans la bande, retour explicite des fiches, carte « À toi » homogène sur les 5 fiches, 375 sans débordement horizontal, chips de bande allumés correctement pour les fiches.
