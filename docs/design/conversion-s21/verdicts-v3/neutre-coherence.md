# Verdict à l'aveugle, trajets v3 : relecteur neutre (cohérence)

Grille : `docs/ux/trajet-conversion-s21.md` §11. Matériel : `docs/design/conversion-s21/trajets-v3/`. Notes sur le **320 × 640**. Je n'ai lu ni les documents de textes ni les autres verdicts.

Hors défauts, sur décision du fondateur : l'absence de « TTC » sur /register et dans la fenêtre T4 (tous les prix sont TTC) ; l'annuel absent de T3 et T4 ; le payant comme geste principal en fin d'article.

## Notes par trajet (320 × 640)

| Trajet | 1. Clarté 3 s | 2. Promesse tenue | 3. Clics | 4. Envie | 5. Confiance | Moyenne |
|---|---|---|---|---|---|---|
| T1 En-tête (mensuel) | 10 | 10 | 10 | 10 | 10 | 10 |
| T1 variante annuelle | 10 | 10 | 10 | 10 | 10 | 10 |
| T2 Mur de liste | 10 | 10 | 10 | 10 | 10 | 10 |
| T3 Fin d'étape 1 | 10 | 10 | 10 | 10 | 10 | 10 |
| T4 Fenêtre Premium | 10 | 10 | 10 | 10 | 10 | 10 |
| T5 Fin d'article | 10 | 10 | 10 | 10 | 10 | 10 |
| C1 Connecté, en-tête | 10 | 10 | 10 | 10 | 10 | 10 |
| C2 Connecté, mur | 10 | 10 | 10 | 10 | 10 | 10 |

**Verdict global : 10/10 sur la grille** (tour 1 : 8 ; tour 2 : 9,6). Le seuil du §11 est atteint de mon côté : aucune note sous 9. Le garde-fou objectif ne relève aucune faute. Les points listés plus bas sont des défauts de mise en page ou de cohérence **hors critères de la grille**. Ils ne baissent aucune note, mais restent à corriger.

## Preuves des 10 (une par critère, sur le trajet le plus exigeant)

- **Clarté** (`T1/320x640/02`). Sans défiler, on lit ce qu'on achète (3 puces), combien (2,99 € ou 24,99 €) et ce qui est bloqué en gratuit (« Les listes ne s'arrêtent plus à la dixième vanne, les parcours vont au bout. »). Le bouton et la garantie sont entiers au-dessus de la ligne de flottaison.
- **Promesse** (T1 à T5). Chaque entrée trouve son écho :
  - T1 : retour sur /conseils, la page de départ, avec « Tout est ouvert : les listes, les parcours, les carnets. Sers-toi. » (`T1/06`) ;
  - T2 : « Pour la suite des vannes », puis « la suite des vannes s'ouvre » (`T2/02`, `T2/04`) ;
  - T3 : « l'étape 2 de Répartie s'ouvre : Le rythme et les silences » (`T3/04`) ;
  - T4 : « Ta vanne est dans tes favoris. » (`T4/06`), et l'étoile pleine (`T4/07`) ;
  - T5 : « Tout ouvrir », puis « Premium ouvre tout », puis « tout s'ouvre ».
  - En annuel, le prix suit sans écart : « S'abonner · 24,99 €/an », la barre fixe au même prix (`T1-annuel/02b`), puis /register et « Dernière étape. » avec la même ligne de renouvellement (`T1-annuel/04`, `05b`).
- **Clics** : 3 écrans pour T1, T2 et T5, 2 pour T3 et T4. Plus de page d'attente pour l'inscription par e-mail.
- **Envie** :
  - la scène du carnet est revenue (« Le premier rendez-vous silencieux », `T1/03`) ;
  - la carte T3 est en phrase entière (« Certaines phrases ne demandent aucun talent, seulement un bon timing. ») ;
  - la vanne T4 est citée en entier (« Moi, dix euros. ») ;
  - le sous-titre T5 relie le titre au bouton (« Premium ouvre le catalogue, les parcours et leurs exercices. »).
- **Confiance** : la garantie est juste sous chaque bouton payant, en taille lisible. Stripe est nommé. L'étape compte est annoncée par « D'abord ton compte, puis le paiement. » ou par le titre « Ton compte, puis le paiement ». La FAQ se lit en entier au-dessus de la barre fixe (`FAQ-prix`).

## Revérification du top 5 du tour 2

| # | Défaut tour 2 | Statut v3 | Preuve |
|---|---|---|---|
| 1 | Retour T1 sur /parcours avec « Reprends là où tu t'étais arrêté. » | **Corrigé** | `T1/06` : fil d'Ariane « Accueil / Conseils », bandeau « … Sers-toi. » |
| 2 | TTC absent de T3 et T4 | **Hors défaut** (choix du fondateur) | Sans objet. |
| 3 | Titre de T5 sans lien avec le bouton | **Corrigé** | `T5/01` : le sous-titre fait le lien, et le lien gratuit est en graisse normale. |
| 4 | Scène du carnet perdue | **Corrigé** | `T1/03` : « Le premier rendez-vous silencieux ». |
| 5 | Textes coupés (« repére… », « dix… ») | **Corrigé** | `T3/01a` et `T4/02` : phrases entières. |

## Revérification des incohérences du tour 2

| # | Statut v3 |
|---|---|
| I-V2, sortie gratuite à deux libellés | **Corrigé** : « Tester l'étape 1 de Répartie, gratuite » partout, fin d'article comprise (`T5/01`). |
| I-L2, « défi » sur /conseils | L'intro est corrigée (`T1/06` : « un exemple concret, à tester aujourd'hui »). Le libellé des cartes n'apparaît toujours dans aucune capture : **à vérifier** dans le code. |
| I-L4, résiliation par le profil ou par « Résilier ton contrat » | Inchangé. Vérifier que les deux mènent au même endroit. |
| N1, ligne annuelle de l'attente, « Ton compte est prêt » après connexion | **Corrigé** : « Dernière étape. » et la ligne complète, « …sauf résiliation. » (`T1-annuel/05b`). |
| N2, FAQ cachée par la barre, barre en annuel | **Corrigé** : la réponse se lit jusqu'à « nouveau délai. » (`FAQ-prix`), et la barre affiche « 24,99 €/an » (`T1-annuel/02b`). |
| N4, garantie coupée par le bas de l'écran | **Corrigé** : elle est entière à 320 × 640, depuis l'en-tête comme depuis le mur (`T1/02`, `T2/02`). |
| N5, deux-points en début de ligne sur /parcours | Plus dans le trajet, puisque T1 revient sur /conseils. Non revérifiable : à corriger quand même (espace insécable). |
| N6, largeurs desktop | **Corrigé en grande partie** : carte, carnet, tableau et bouton du bas sont à 560 px. Il reste la FAQ (voir R4). |
| N7, filtres de /vannes différents après le paiement | **Persiste** : « Boulot & Collègues, Couple, Dating » (`T4/01`) contre « Toutes, Vie quotidienne, Boulot &… » (`T4/07`). |
| N8, sortie Répartie sur le mur des vannes | **Persiste** (`T2/01`). Ce n'est pas une rupture, donc ce n'est pas noté. |
| Répétition T3 : le nom de l'étape 2 apparaît deux fois | **Persiste** : la carte « Le rythme et les silences » est suivie, en bas du même écran, par l'étape verrouillée du même nom (`T3/01a`). |

## Nouveaux points (hors grille, à corriger)

| # | Où | Constat | Correction |
|---|---|---|---|
| R1 | Carte « Annuel », `T1/320x640/02` | À 320 px, trois informations tiennent en deux lignes de très petit texte gris : « soit 2,08 € par mois », « plus de 3 mois offerts » et « Renouvelé chaque année, sauf résiliation. ». C'est la plus petite taille de la page, alors qu'elle porte la condition de renouvellement. | Passer « plus de 3 mois offerts » sur sa propre ligne, et la ligne de renouvellement à la même taille que « TTC / an ». La carte grandit d'une ligne, et la garantie reste au-dessus de la flottaison (mesurée à 608 px pour 640). |
| R2 | 1re puce contre tableau (`T1/02`, `T1/03`) | La puce dit « Tout le catalogue, du boulot au rencard » (des situations), le tableau dit « Tout le catalogue : 10 vannes, 3 conseils, 3 vidéos » (des types de contenu). Le même mot reçoit deux définitions. Le premier écran ne dit plus « vannes, conseils, vidéos », même si le sous-titre parle de vannes. | Acceptable en l'état. Pour aligner, compléter la puce : « Tout le catalogue, vannes, conseils et vidéos, du boulot au rencard ». |
| R3 | Ordre sous le bouton (`T1/02`) | La garantie passe maintenant avant « Tu crées ton compte, puis tu paies par carte sur Stripe. ». À 320 × 640, cette 2e ligne est coupée par le bas de l'écran. L'étape compte est quand même annoncée par le titre de /register, donc ce n'est pas une surprise. | Rien d'obligatoire. Si la place le permet après R1, raccourcir à « D'abord ton compte, puis le paiement sur Stripe. », pour reprendre la formule de T3 et T4. |
| R4 | `desktop-1280/abonnement-complete` | La FAQ fait environ 770 px de large, alors que tous les blocs au-dessus sont à 560 px. La case Mensuel a de nouveau un vide d'environ 50 px sous le prix, parce que les prix sont alignés en haut et que la case Annuel fait 4 lignes. | Mettre la FAQ à 560 px. Dans la case Mensuel, centrer le contenu verticalement, ou accepter le vide. |
| R5 | Bloc carnet (`T1/03`, desktop) | Le titre « Le premier rendez-vous silencieux » est aligné à gauche, entre un titre de section et un sous-titre centrés. | Le centrer, ou aligner tout le bloc à gauche. |

## Top 5 restant (tous hors grille)
1. R1, renouvellement annuel en très petit texte à 320 px.
2. N7, filtres de /vannes qui changent après le paiement.
3. Répétition du nom de l'étape 2 en T3.
4. R2, deux définitions de « Tout le catalogue ».
5. R4 et R5, largeur de la FAQ et alignement du titre du carnet.

## Garde-fous objectifs (§11)
Aucune faute trouvée. Aucun bouton ne promet ce que l'écran suivant ne tient pas. Les prix sont justes (24,99 / 12 = 2,08 € ; 12 × 2,99 − 24,99 = 10,89 €, soit plus de 3 mois). « 1 500+ » est intact. La garantie est identique partout. Aucune mention légale dans un bouton. Aucun tiret cadratin vu.
