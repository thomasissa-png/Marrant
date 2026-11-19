# Relecture design à l'aveugle, tour 3 (s26) : Mes questions et Mes répliques

Sources : captures `docs/captures/s26/lot2-tour-3/{questions,repliques}/` (visiteur, gratuit, en-cours, nouvel ; 375/768/1280/1920 ouverts, 1456 non ouvert), code lu : `mes-questions.tsx`, `reponse-non-lue.tsx`, `liste-envois.tsx`, `liste-repliques.tsx`, `tableau.tsx` (CARTE_ACTION), pages `questions/page.tsx` et `repliques/page.tsx`. Aucune relecture existante lue.

## Gate typographique (cité)
- `TAILLES-mon-espace_questions.md` : 4 tailles (24 ou 30 / 20 / 16 / 14) sur les 16 mesures ; combinaisons 6 (visiteur, gratuit, en-cours, nouvel 1280) et 5 (nouvel 375/768). Seuil « plus de 6 » non dépassé : PASS, au plafond.
- `TAILLES-mon-espace_repliques.md` : 4 tailles et 6 combinaisons (aperçus), 4 à 5 (en-cours), 3 tailles et 4 combinaisons (nouvel). PASS. Graisses 400/600, aucune taille hors échelle.
- Un seul aplat violet par écran : vérifié sur tous les comptes (en-cours questions : le bouton « L'équipe t'a répondu ; formulaire en contour). Les deux boîtes d'offre des aperçus relèvent de la décision « objet Premium » : non notées.

## Mes questions

### Faute dure
**F1. Tuile « réponse non lue » (en-cours, dès 1024) : elle déborde de 44 px sur le titre « Mes envois » et son compteur.** Mesuré sur `en-cours-questions-1280.png` et `-1920.png` : bas de la tuile y = 498, le titre « Mes envois » (y ≈ 488 à 502) et le « 1 / 1 » sont rognés par le cadre de la tuile (on lit « Mes envois » coupé en deux). Cause au code : `CARTE_ACTION` porte `h-full`, et `mes-questions.tsx` ligne 42 ajoute `lg:mt-11` ; la hauteur 100 % de la rangée + 44 px de marge dépasse la rangée de 44 px. Au passage, la tuile compte 68 px de vide sous le bouton (vide de fin de carte, permis, mais c'est ce même excédent). Correction : `lg:h-auto` ajouté à la className passée à `ReponseNonLue` dans `apps/web/src/components/espace/questions/mes-questions.tsx` (ligne 42). Aucune taille ajoutée.

### Notes
| Critère | Note | Défaut / justification |
|---|---|---|
| 1 Élégance, fidélité accueil | 8 | Titre blanc, cartes neutres, une tuile teintée : proche de l'accueil. F1 abîme la tuile de tête. |
| 2 Hiérarchie | 8 | En-cours : tuile violette puis formulaire, une zone dominante nette. Nouvel : l'aplat « Envoyer » domine bien. |
| 3 Largeur 5 largeurs | 6 | F1 à 1280/1456/1920. En plus, colonne droite vide sur 480 px (nouvel, 1280/1920) et 300 px (en-cours) sous la liste : vide de fin de colonne, permis, mais lecture « page à moitié vide ». |
| 4 Cohérence entre comptes | 8 | « Mes envois » à y = 235 chez le nouvel, caché à y = 495 chez l'abonné avec réponse : la tête de colonne droite saute d'un compte à l'autre. |
| 5 Finition | 6 | F1 (chevauchement). Sinon alignements au 24 px, cibles 44 px, contrastes tenus. |
Aperçu (visiteur/gratuit, 1280) : hero 8/4, tuile « Mes envois » en clair 7 et 5 fermée, rangée fermée pleine largeur : propre. Tuile « Mes envois » : 80 px de vide en bas de carte (fin de carte, permis).

**NOTE GLOBALE Mes questions : 6/10**

### Pistes (max 3)
1. Corriger F1 (`lg:h-auto`), le 10 est alors à portée sur le chevauchement.
2. Aligner le titre « Mes envois » sur « Écrire à l'équipe » (y = 235) quelle que soit la présence de la tuile : sortir le `lg:mt-11` de la tuile et mettre la tuile dans la rangée 1 à `lg:row-start-1` sous une ligne de titre commune (`mes-questions.tsx`).
3. Colonne droite du nouvel abonné : donner à la colonne formulaire `lg:sticky lg:top-36` quelle que soit la hauteur de fenêtre (aujourd'hui sticky seulement sous `min-height:64rem`) pour que le vide à droite ne se lise pas comme un trou. Sans ajouter de contenu.

## Mes répliques

### Faute dure
Aucune chiffrable. Gate typographique PASS, un seul aplat (vide : « Écrire ma première réplique »), alignements et gap 24 px conformes, 8 + 4 colonnes respecté à 1280 et 1920 (1 réplique : carte 802 px, tuile 388 px).

### Notes
| Critère | Note | Défaut / justification |
|---|---|---|
| 1 Élégance | 9 | Carte neutre, filet, actions en liens gris : sobre, fidèle. |
| 2 Hiérarchie | 9 | En-cours : la réplique domine. Nouvel : tuile teintée + un seul bouton plein. |
| 3 Largeur | 8 | À 768 avec 1 réplique : carte de 348 px dans une grille 2 colonnes, moitié droite entièrement vide (`en-cours-repliques-768.png`, x 380 à 744) ; la décision 8 + 4 ne vaut que dès 1024. Tuile de droite à 1280 : bouton seul + 80 px de vide de fin de carte (permis). |
| 4 Cohérence | 9 | Même coque, même titre ; compteur « 1 » sans libellé chez l'abonné, absent chez le nouvel (normal). |
| 5 Finition | 9 | Texte de la réplique à 375/768 coupé à ~220 px sur une carte de 300 px (« Réplique de test : elle a tout / vu depuis jeudi »), mesure plus étroite que la carte : à vérifier, non chiffrable ici (probablement `[overflow-wrap:anywhere]` + espace fine). |

**NOTE GLOBALE Mes répliques : 8/10**

### Pistes (max 3)
1. 768 avec 1 réplique : appliquer le 8 + 4 dès `md` quand `peu` (remplacer `lg:` par `md:` dans `GRILLE_8_4`, `TUILE_LIEN` et la `ul` de `liste-repliques.tsx`, `md:grid-cols-1` pour la liste), ou carte `md:col-span-2` pour une seule réplique.
2. Vérifier la mesure du texte de la réplique à 375/768 (`CARTE_GRILLE`, `liste-repliques.tsx` ligne 230) : le texte doit occuper la largeur utile de la carte.
3. Compteur « 1 » seul à côté du titre : à valider avec le fondateur (pas de libellé), sans texte neuf de ma part.

## Liste numérotée des fautes dures
1. Mes questions, en-cours dès 1024 (1280, 1456, 1920) : tuile « réponse non lue » (`CARTE_ACTION` `h-full` + `lg:mt-11`) déborde de 44 px et recouvre « Mes envois » et le compteur ; fichier `apps/web/src/components/espace/questions/mes-questions.tsx` ligne 42 (ajouter `lg:h-auto`).
2. Mes répliques : aucune faute dure.
