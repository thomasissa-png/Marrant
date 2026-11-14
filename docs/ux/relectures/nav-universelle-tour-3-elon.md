# Relecture à l'aveugle, tour 3 (elon) : `docs/ux/navigation-universelle-s24.md` v3

AVIS CONSULTATIF : validation requise avant exécution.

## Note : 10 / 10 (tour 1 : 7,6 ; tour 2 : 9,2)

Aucune faute dure. La spec tient en une règle par sujet. L'en-tête est le même partout. Aujourd'hui est à 1 geste (le lien « Mon espace » ou le logo de l'abonné), et chaque rubrique à 2 gestes, menu mobile compris, sans défilement. Le lien retour est fixé par le type de page. On n'ajoute rien au site public. Il reste 4 pistes de précision, à traiter pendant le lot @fullstack.

## Contrôle de FD4

Corrigée.
- Le §4.3 (l. 94-104) fixe le lien retour par type de page, sans état ni paramètre.
- L'élément allumé suit le parent (l. 94 et critère 13, l. 122).
- La fiche « bilan » renvoie à Parcours et allume Parcours : il n'y a plus deux parents.
- L'ajout de `a-plat` (Quoi répondre) et de `jeu`, `seance` (S'entraîner) est juste. Je l'ai vérifié dans `rubriques.ts` : `a-plat` est une porte de Quoi répondre (l. 32), `jeu` et `seance` sont dans `PORTES_PLUS` (l. 77). Les 10 types de fiches sont couverts.

## Fautes dures

Aucune.

## Pistes (ne bloquent pas le 10)

- **P9. Carnet : la spec s'écarte du code et il manque une ligne.**
  - `rubriques.ts` l. 32 range `/carnet` comme porte de Quoi répondre. La v3 en fait une entrée d'index à part, avec « Retour : Mon espace » (l. 104).
  - `/carnet/[mois]` (A) n'a pas de lien retour dans le tableau du §4.3, alors qu'il entre dans le critère 13.
  - Correction : ajouter la ligne « `/carnet/[mois]` (abonné) : Carnet », et inscrire au lot @fullstack la refonte de `rubriques.ts` : `/carnet` sort des portes de Quoi répondre, et `/vannes`, `/conseils`, `/videos` sortent des portes de Bibliothèque (l. 40), puisque ces trois pages allument désormais leur propre lien.
- **P10. Calcul « sans défilement » du menu (l. 36 et critère 5).** 65 + 52 + 44 + 352 = 513 px. Cela tient dans une fenêtre de 568 px de CSS, mais pas forcément sur un vrai téléphone de 568 px une fois les barres du navigateur affichées. Écrire « hauteur de fenêtre CSS (viewport Playwright) de 568 px » pour que le critère soit testable sans ambiguïté, et compter les marges internes et le séparateur dans la somme.
- **P11. Lien retour d'un bilan.** « Parcours (la liste) » est déterministe mais renvoie un cran trop haut. Le bilan appartient à un parcours connu par son identifiant : « Retour : {nom du parcours} » vers `/parcours/[slug]` reste sans état et économise un clic.
- **P12. Aujourd'hui à 768 px.** La carte du jour et l'index côte à côte font environ 350 px de large chacun. À vérifier sur capture : le bouton « Les cartes du jour » doit rester la chose la plus visible de l'écran, et l'index ne doit pas peser autant que l'action du jour.

## Réponse de fond

C'est la navigation la plus simple qui serve à la fois la valeur et la conversion. Le visiteur voit 6 liens et un bouton d'offre. L'abonné voit « Mon espace » et 5 liens. La page pivot porte à la fois l'action du jour et le sommaire de l'espace. Pour construire, il manque seulement que Thomas tranche les 10 écarts ROUVRE du §6. Je recommande de les lui présenter en un seul message, avec un oui ou non par ligne.

---
Handoff → session principale (présentation des écarts du §6 à Thomas), puis @fullstack (lot avec P9 à P12). Ce sont des avis : Thomas décide.
