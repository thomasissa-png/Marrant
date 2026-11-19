# Relecture design à l'aveugle, tour 2 (s26) : Mes questions et Mes répliques

Méthode : brief v7 (grille Design, barre 9/10), spec design et UX s26, captures `docs/captures/s26/lot2-tour-2/{questions,repliques}/` (4 comptes, 375 / 768 / 1280 / 1920 ouverts, 1456 non ouvert), code lu pour les éléments collants (`mes-questions.tsx`, `liste-repliques.tsx`, `hero-apercu.tsx`, `offre-apercu.tsx`, `styles.ts`). Aucune relecture existante lue. Décisions listées par le prompt non notées.

## 1. Gate typographique mesurée (citée)

Sortie `TAILLES-mon-espace_questions.md` et `TAILLES-mon-espace_repliques.md`, premier écran, 4 comptes, 375 et 1280 (768 et 1920 identiques) :

| Page | Compte | Tailles | Combinaisons | Verdict |
|---|---|---|---|---|
| Questions | visiteur, gratuit | 4 (24 ou 30, 20, 16, 14) | 6 | PASS (limite : 4 et 6 ne sont pas dépassés) |
| Questions | en-cours | 4 | 6 | PASS (limite) |
| Questions | nouvel | 4 | 5 (375), 6 (1280) | PASS |
| Répliques | visiteur, gratuit | 4 | 6 | PASS (limite) |
| Répliques | en-cours | 4 | 4 | PASS |
| Répliques | nouvel | 3 | 4 | PASS |

Graisses 400 et 600 seulement, polices de l'échelle (Plus Jakarta 24/30 et 20, Inter 16 et 14). Aucun hors-échelle relevé. Les deux pages sont au plafond sur l'aperçu (6 combinaisons) : toute correction ci-dessous ne doit pas ajouter une combinaison.

Accent : un seul aplat violet visible par écran sur les 8 vues abonné (bouton « L'équipe t'a répondu » si réponse non lue, sinon « Envoyer à l'équipe » ; « Écrire ma première réplique » ; aucun aplat avec une réplique, conforme spec §5). Aperçus : bouton du haut plein ; bouton de fin plein sur ces captures à 900 px de haut, contour dès 960 px (`fenetre-haute:` dans `BOUTON_OFFRE_FIN`, vérifié au code) : un seul aplat par écran, conforme.

## 2. Mes questions (`/mon-espace/questions`)

Constats sur le rendu :
- Aperçu 1280/1920 : hero 8/4, offre en haut, grille 8/4 de l'extrait calée sur le hero (bords de la tuile de droite = bords de la carte d'offre), rangée du fil fermé pleine largeur, carte de fin centrée, halo discret. Fermé lisible, aucune impression d'être dedans. La tuile « Mes envois » (étirée à la hauteur de la colonne de droite) garde 100 px de vide EN FIN de carte : permis.
- 375 : offre au premier écran, 3 tuiles empilées, fondu, carte de fin. Propre.
- Abonné en-cours 1280/1920 : formulaire 4 colonnes à gauche (non collant à 900 px de haut, voulu : `xl:[@media(min-height:64rem)]:sticky`, lu au code), tuile de réponse non lue en tête à droite (seul aplat), « Mes envois » dessous avec compteur `1 / 1`. Le bouton d'envoi passe en contour : correct.
- 375 en-cours : la tuile non lue vient avant le formulaire (au code et à l'image), bouton plein pleine largeur. Bon.
- Nouvel 1280 : formulaire (bouton plein) + tuile d'exemples. Colonne de droite finit à y = 538 pour 1017 à gauche : vide de fin de colonne, permis.

Défauts (aucun chiffrable au sens des fautes dures) :
- D1. 768 en-cours : « Mes envois » est une carte de 318 px sur 660 (grille 2 colonnes, une seule carte) ; la moitié droite de la rangée est vide sur 175 px de haut. Lu comme « tuile creuse » (critère 3). Correction : `ListeEnvois` en `md:grid-cols-1` tant qu'il y a moins de 2 fils, 2 colonnes ensuite (fichier `apps/web/src/components/espace/questions/liste-envois.tsx`). Ferait 10 sur ce point.
- D2. 768 visiteur et gratuit : carte d'offre en ligne mal alignée : le groupe gauche (bouton + « Premium ouvre tout… ») est calé en haut avec texte centré, le groupe droit (réassurance) est centré verticalement avec texte aligné à gauche ; décalage mesuré 27 px entre le haut du bouton (y 336) et le haut du texte de droite (y 363), alignements de texte mixtes (`offre-apercu.tsx`, ligne 129 `md:max-lg:items-center`, ligne 134 `text-center`). Correction : `md:max-lg:items-start` sur le conteneur et `md:max-lg:text-left` sur la phrase d'objet. Ferait 10.
- D3. En-cours 1280/1920 : le haut de la tuile non lue (y = 221) n'est pas le haut de la carte du formulaire (y = 265) ; chez `nouvel`, les deux colonnes partent de y = 265 sous deux H2 alignés. Alignement différent entre comptes (44 px). Piste : placer un H2 « Mes envois » aussi au-dessus de la tuile non lue, ou aligner la tuile sur y = 265. Pas une faute dure.
- D4. Nouvel 1280 : la tuile d'exemples fait 273 px, le formulaire 752 : 480 px de vide de fin de colonne. Permis, mais l'écran est déséquilibré ; ne se comble pas en grossissant un texte.

Grille Design :
1. Élégance et fidélité accueil : 9. Objet Premium, titres blancs, cartes neutres, aucun second accent ; léger manque : D3.
2. Hiérarchie : 9. Un bouton dominant par écran, sans exception.
3. Usage de la largeur : 8. D1 (768), D4 (1280 nouvel). Pas de débordement.
4. Cohérence entre comptes : 9. Même grille, mêmes titres ; D3.
5. Finition : 8. D2 (alignement carte d'offre 768). Cibles : `BOUTON_SECONDAIRE` et `puce` en `min-h-11`, `LIEN_NEUTRE` en `min-h-11` ; contrastes META lus 7:1 sur carte (commentaire du code, non remesuré).

NOTE GLOBALE Mes questions : 8/10

## 3. Mes répliques (`/mon-espace/repliques`)

Constats sur le rendu :
- Aperçu 1280/375 : même modèle que Mes questions, tuile claire (« Coloc : la poêle », consigne, champ inerte), tuile fermée à droite, rangée Modifier / Supprimer fermée, carte de fin. Propre, cohérent avec Mes questions. 27 px sous le champ dans la tuile claire, sous le seuil de 32.
- En-cours 1280 : UNE carte de 389 px dans une grille de 3 colonnes (1216 px) : 827 px de largeur vides à droite sur 210 px de haut, sous un en-tête où le lien « Écrire ma prochaine réplique » et le compteur « 1 » flottent à l'extrême droite. La page n'utilise pas la largeur (critère 3), le compteur « 1 » nu ne dit pas ce qu'il compte (finition). Le commentaire du code mentionne lui-même ce cas (« deux tiers vides, mesuré à 1280 ») puis garde la grille.
- Nouvel 1280/1920 : tuile d'action pleine largeur (1216 px) dont le contenu occupe 441 px (36 %) : 700 px de vide à droite DANS la tuile, bouton et lien calés à gauche. Tuile creuse (critère 3). Le tour 1 avait une tuile de droite creuse ; le tour 2 l'a supprimée en étirant l'autre, ce qui déplace le défaut.
- 375 en-cours : texte de la réplique coupé à 262 px alors que la carte a 293 px utiles (« elle a tout / vu depuis jeudi, je la garde / comme témoin ») : ragged right de 70 px, probablement une insécable `frEspace` collée (non vérifié). Lien « Écrire ma prochaine réplique » sous le titre, seule action de la page : discret.
- 375 nouvel : tuile d'action propre, bouton plein pleine largeur, lien Quoi répondre dessous.

Défauts :
- R1. Vide (nouvel) : tuile pleine largeur creuse à 1280/1456/1920. Correction : dans `liste-repliques.tsx` (l. 95), sur la tuile `CARTE_ACTION`, `lg:flex-row lg:items-center lg:justify-between lg:gap-12` avec le lien « Quoi répondre » à droite (`mt-2 lg:mt-0`) : texte et bouton à gauche, lien à droite, plus de vide intérieur. Ou retour à la spec (tuile `lg:col-span-8` + rail `lg:col-span-4`) si le rail porte autre chose qu'un lien seul. Ferait 10.
- R2. Une seule réplique à 1280+ : 2/3 de la rangée vides. Correction : tant que `liste.length < 3`, grille `lg:grid-cols-2` (deux répliques à 50 %) et, pour une seule, la carte en `lg:col-span-2` avec texte et actions sur une ligne (`lg:flex-row`), ou le lien « Écrire ma prochaine réplique » descendu en rail `lg:col-span-4` à droite de la carte. Ferait 10.
- R3. Compteur « 1 » nu à côté du lien (en-tête, `liste-repliques.tsx` l. 122-131) : le placer collé au titre (`flex items-baseline gap-4` : titre + compteur) et laisser le lien seul à droite ; aucun texte neuf.
- R4. Coupure précoce du texte à 375 : vérifier la colle `frEspace` / `FINE` dans `<p>` ligne 206 (`[text-wrap:pretty]` ou retirer l'insécable en trop). Piste.

Grille Design :
1. Élégance : 9.
2. Hiérarchie : 9 (un seul aplat ; avec réplique, aucune action dominante, voulu par la spec).
3. Largeur : 7. R1 (tuile 64 % creuse), R2 (carte seule à 1/3).
4. Cohérence entre comptes : 8 (titre au même endroit, en-tête qui change de forme : lien et compteur seulement chez en-cours ; tuile pleine largeur chez nouvel contre carte étroite chez en-cours).
5. Finition : 8 (R3, R4 ; cibles 44 px lues au code : `LIEN_NEUTRE min-h-11`, boutons `min-h-11`).

NOTE GLOBALE Mes répliques : 7/10

## 4. Fautes dures (chiffrables seulement)

Aucune faute dure. Gate typographique : PASS sur les deux pages (4 tailles, 6 combinaisons au plus). Un seul aplat par écran. Aucun hors-échelle, aucun vide > 32 px au milieu d'un bloc relevé ; R1 et R2 sont des vides de fin de ligne ou de rangée (permis par la règle) mais échouent le critère 3 (tuile creuse) et la barre de 9.

Liste numérotée des fautes dures : néant.

Sous la barre de 9 (pas fautes dures) : Mes questions 8 (D1, D2), Mes répliques 7 (R1, R2).

NOTE GLOBALE Mes questions : 8/10
NOTE GLOBALE Mes répliques : 7/10
