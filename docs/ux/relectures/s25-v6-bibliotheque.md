# Relecture à l'aveugle s25 v6 tour 1 : Bibliothèque et fiches (construction, vocabulaire, formule, humour noir)

Périmètre vu : 20 captures `bibliotheque/` (visiteur, gratuit, en-cours, nouvel x 5 largeurs, toutes ouvertes ou échantillonnées sur les 5 largeurs pour visiteur et en-cours), fiches `en-cours-*` et `nouvel-*` (1280, 375 ; 768/1456/1920 non rouvertes pour vocabulaire et formule). Code : `bibliotheque/page.tsx`, `fiche/[type]/[id]/page.tsx`, `bloc-bibliotheque.tsx`, `liste-fiches.tsx`, `fiche.tsx`, `coin-humour-noir.tsx`, `apercu/apercu-rubrique.tsx`, `carte/styles.ts`, `layout/gabarit.ts`.

Constats de lecture :
- Visiteur et gratuit voient le même aperçu (fiche « Le faux secret » en entier, un bouton plein « Premium · 1,99 €/mois », lien Connexion pour le visiteur). Conforme au spec v6 §2.
- En-cours et nouvel : captures de la Bibliothèque strictement identiques (aucune pastille « Fait » visible, ni sur les listes ni sur les fiches). Les fiches des deux comptes sont aussi identiques (retour « Pas essayé » non posé, 0/200).
- Fiche humour noir : les deux comptes sont au seuil (« Entrer »), le contenu du coin n'est pas dans les captures : non évalué.

## Notes

| Critère | Note | Verdict |
|---|---|---|
| Design 1 fidélité à l'accueil | 7 | faute dure |
| Design 2 hiérarchie, lisibilité | 9 | piste |
| Design 3 mise en page 5 largeurs | 6 | faute dure |
| Design 4 cohérence avec l'espace | 8 | piste |
| Design 5 finition | 8 | piste |
| UX 1 compréhension | 9 | piste |
| UX 2 action principale | 8 | piste |
| UX 3 états vides, nouvel abonné | 9 | piste |
| UX 4 aperçu Premium | 8 | piste |
| UX 5 accessibilité, cohérence comptes | 9 | piste |

**NOTE GLOBALE : 6/10** (minimum : Design 3).

## Fautes dures

### FD1. Aperçu Premium : colonne collée à gauche, vide à droite dès 1280 (Design 3)
Captures `visiteur-bibliotheque-1280.png`, `-1456`, `-1920`, `gratuit-*` identiques : titre et carte alignés à gauche, la carte s'arrête à 768 px, 430 px (1280) à 800 px (1920) de vide à droite. À 1920 la carte est dans le tiers gauche de la coque. La même fiche, côté abonné, est dans une colonne centrée (`COLONNE_LECTURE`, `en-cours-fiche-construction-1280.png`) : l'aperçu ne ressemble donc pas à ce qu'il promet.
Correction : `apps/web/src/components/espace/apercu/apercu-rubrique.tsx` : envelopper `<header>` et `<article>` dans `<div className={COLONNE_LECTURE}>` (import depuis `@/components/layout/gabarit`) et retirer `max-w-3xl` de l'article. Même gabarit que la fiche réelle, centré. Vérifier que les aperçus des autres rubriques (Favoris, Mes questions, Mes répliques, déjà dans le même composant) restent corrects dans une colonne de 768 px.
Ce qui fait 10 : aperçu centré identique à la fiche, ou deux colonnes (fiche à gauche, bloc offre collant à droite) si Thomas préfère remplir la coque ; la première option ne demande aucun texte neuf.

### FD2. Cartes de l'espace sans la langue de l'accueil (Design 1, cohérence comptes)
Étalon : cartes `rounded-xl` à filet dégradé violet en haut. Aperçu : bien le filet (`apercu-rubrique.tsx` : `rounded-xl` + `h-0.5 bg-gradient-to-r from-accent-primary-hover to-accent-secondary-hover`). Bibliothèque abonné (`en-cours-bibliotheque-1280.png`) et toutes les fiches (`en-cours-fiche-*-1280.png`) : cartes grises `rounded-lg` sans filet, titre de page à gauche, aucune pastille : l'abonné voit un tableau de bord gris là où le visiteur voit la langue de l'accueil. Même rubrique, deux langues visuelles.
Correction codable : `apps/web/src/components/espace/carte/styles.ts`, `CARTE` : passer `rounded-lg` à `rounded-xl`, ajouter `relative overflow-hidden`, et un filet commun (un composant `FiletCarte` rendant `<div aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent-primary-hover to-accent-secondary-hover" />`) inséré en tête des cartes de `BlocBibliotheque` (`bloc-bibliotheque.tsx`), de `CoinHumourNoir` (`coin-humour-noir.tsx`) et des deux `<div className={CARTE}>` de `fiche.tsx` (corps et geste). Attention : `CARTE` sert à tout l'espace, le changement doit être arbitré avec les autres groupes pour que toutes les pages restent cohérentes entre elles (sinon FD2 se déplace d'une page à l'autre).
Ce qui fait 10 : même carte (rayon, filet) sur aperçu, Bibliothèque, fiches, coin.

## Pistes (ne retiennent pas la note)

### Design
- **Hiérarchie (9)** : H1 de 36-40 px, titres de bloc 20 px, lignes 14 px : lisible, mais les 8 thèmes (puces) et les 3 liens soulignés « Vannes, Conseils, Vidéos » du premier bloc sont de deux poids différents pour la même chose (aller vers le catalogue public). Sur `en-cours-bibliotheque-1280.png` les liens soulignés violets à 14 px, très proches (gap 16 px), sont sous la cible de 44 px visuelle même si `LIEN` donne `min-h-11` : à contrôler en ouvrant l'inspecteur, non mesuré ici. Ce qui ferait 10 : liens du catalogue en puces pleines ou en ligne de 44 px visibles.
- **Cohérence (8)** : l'aperçu est aligné à gauche sous la bande, les fiches centrées, la Bibliothèque en pleine coque 2 colonnes : trois gabarits pour une même rubrique (corrigé en partie par FD1).
- **Finition (8)** :
  - `fiche.tsx` / `gesteFiche` : dans le bloc « À toi » (`en-cours-fiche-construction-1280.png`) un filet horizontal pleine largeur précède l'étiquette « À TOI » dans la carte même, collée à la consigne sans respiration (étiquette 12 px puis texte sur la ligne suivante, 0 écart visible). Ajouter `mb-1` à l'étiquette et retirer le filet de tête (`apps/web/src/components/espace/carte/geste-fiche.tsx`).
  - Colonne de gauche à 1280, la Bibliothèque se termine 130 px avant la colonne de droite (colonnes CSS équilibrées) : acceptable, pas de vide majeur.
  - Bande (hors périmètre, signalé au groupe dédié) : `visiteur-bibliotheque-1280.png` et `-1920.png` coupent « Carnet » avec un fondu, alors que le spec v6 §1 dit « aucune rubrique tronquée » et annonce 105 px libres. À reprendre côté `rubriques.ts` / bande.

### UX
- **Action principale (8)** : la Bibliothèque abonné n'a aucun point d'entrée dominant : 30 lignes équivalentes, aucune « Reprendre » ni « Commence par », aucune pastille « Fait » visible dans les captures (nouvel et en-cours identiques : on ne peut pas voir la progression, ni que « Fait » fonctionne). C'est une bibliothèque, donc une liste est acceptable, mais préférence fondateur « coaching, pas bibliothèque ». Proposition (texte à valider par Thomas, ne retient pas la note) : un repère sur la première fiche non faite de chaque groupe, sans texte neuf (pastille `Voir` déjà validée dans la maquette), ou ordre « à lire ensuite » en tête. Ne bloque pas.
- **Compréhension (9)** : titre, 4 blocs titrés clairement. Il manque une ligne qui dit à quoi sert la page (le sous-titre existe pour l'aperçu, pas pour l'abonné). Texte à valider par Thomas.
- **États vides (9)** : nouvel abonné voit une Bibliothèque pleine (jamais une page morte) ; aucun état vide réel n'est atteint. Coin « Humour noir » absent quand son lot est vide (code `coin.length > 0`) : comportement voulu.
- **Aperçu (8)** : valeur visible (fiche entière, une seule offre, pas de mur, lien Connexion) ; mais l'aperçu ne montre pas que la rubrique contient une trentaine de fiches (le visiteur ne voit qu'une). Piste : après la carte, une liste des titres sans lien ni texte neuf (titres déjà publics des fiches) pour donner l'ampleur du catalogue ; à valider par Thomas.
- **Accessibilité (9)** : cibles `min-h-11`/`min-h-14`, focus `ring-accent-link`, `aria-labelledby` sur les listes, statut « Fait » en texte (pas la couleur seule), bouton « Entrer » `aria-expanded`. Plusieurs liens de même nom sur les fiches (« Voir une version possible » x3 sur `en-cours-fiche-formule-1280.png`, « Définition complète » x3 sur vocabulaire) : ajouter un contexte accessible (`aria-describedby` vers l'item) dans `corps-technique.tsx`. Contrastes : non mesurés (aucune valeur citée sans mesure).

## Signalements éditoriaux (aucun texte réécrit)
- Fiche vocabulaire : étiquette « VOCABULAIRE · 5 min » sous le H1 « Vocabulaire : quand on te lance une pique » répète le mot ; `fiche.tsx` compare l'étiquette au libellé du parent (« Bibliothèque »), donc elle s'affiche toujours. Possible redondance : l'étiquette dit le type, utile. À trancher par Thomas.
- Fiche vocabulaire : « Définition complète » présent sur 3 mots sur 5 (Chambrer et Esprit de l'escalier n'en ont pas). Incohérence de contenu à vérifier (donnée ou règle d'affichage).
- Fiche formule « Proverbes » : « À toi » demande d'écrire une suite puis « ouvre la version possible », alors que les versions sont dans « Trois à toi » en liens repliés : cohérent, rien à signaler.

## Cognitive walkthrough rapide (abonné)
Je veux apprendre « la règle de trois » : bande allumée Bibliothèque (oui), je lis les 4 blocs, je clique la ligne (cible évidente, chevron). Fiche : « Retour : Bibliothèque » visible (oui), je lis, j'arrive à « À toi », saisie et « Enregistrer » grisé jusqu'à saisie (feedback : compteur 0/200). Aucun FRICTION bloquante.

## Handoff
Fichiers à toucher : `apps/web/src/components/espace/apercu/apercu-rubrique.tsx` (FD1), `apps/web/src/components/espace/carte/styles.ts`, `bloc-bibliotheque.tsx`, `coin-humour-noir.tsx`, `fiche.tsx` (FD2). Objectif tour 2 : FD1 et FD2 levées donnent Design 3 et Design 1 à 9 ou plus, global 8 à 9 selon les pistes retenues.
