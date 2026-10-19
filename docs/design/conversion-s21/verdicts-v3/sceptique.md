# Verdict à l'aveugle v3 : le sceptique

Persona : 35 ans, se méfie des abonnements, cherche le piège, veut savoir ce qu'il paie, ce qu'il a déjà gratuitement et comment il sort. Compare avec YouTube gratuit.
Matériel : `docs/design/conversion-s21/trajets-v3/` (375 x 700 et 320 x 640, barre fixe en annuel, FAQ ouverte, 1 280 px). Notes sur **320 x 640** (grille §11 de `docs/ux/trajet-conversion-s21.md`, lue seule). Aucun document de textes ni autre verdict lu.
Hors défauts, par choix du fondateur, non comptés : absence de « TTC » hors /abonnement, titre de /abonnement, FAQ YouTube fermée.

## Verdict global : 9,5 / 10 (tour 1 : 7,5 ; tour 2 : 9,1). Seuil atteint : je valide

| Trajet | 1. Offre en 3 s | 2. Promesse tenue | 3. Clics | 4. Envie | 5. Confiance | Moyenne |
|---|---|---|---|---|---|---|
| T1 En-tête, mensuel | 9 | 10 | 10 | 9 | 9 | 9,4 |
| T1 En-tête, annuel | 9 | 10 | 10 | 9 | 9 | 9,4 |
| T2 Mur de liste | 9 | 10 | 10 | 9 | 9 | 9,4 |
| T3 Fin d'étape 1 | 10 | 10 | 10 | 10 | 10 | 10 |
| T4 Fenêtre Premium | 10 | 10 | 10 | 9 | 10 | 9,8 |
| T5 Fin d'article | 9 | 10 | 10 | 9 | 9 | 9,4 |
| C1 Connecté, en-tête | 9 | 10 | 10 | 9 | 9 | 9,4 |
| C2 Connecté, mur | 9 | 10 | 10 | 9 | 9 | 9,4 |

Aucun critère sous 9 sur aucun trajet. Aucune faute objective de la grille. Les deux défauts restants (ci-dessous) sont des corrections de finition, pas des blocages.

## Revérification du top 5 du tour 2

| # | Défaut du tour 2 | État en v3 | Preuve (320 x 640) |
|---|---|---|---|
| 1 | Envie à 8 : premier écran descriptif | **Réglé** (dans le périmètre autorisé) : 1re coche « Tout le catalogue, du boulot au rencard » ; carnet mis en scène avec son titre « Le premier rendez-vous silencieux » juste sous le bloc prix | T1/02 ; T1/03 |
| 2 | « TTC » absent sur T3, T4, /register | **Hors défauts** (choix du fondateur), non compté | sans objet |
| 3 | Garantie sous le pli à 320 x 640 | **Réglé** : la garantie est juste sous le bouton, visible au premier écran | T1/02, T2/02, C1/02, C2/02, T1-annuel/02 |
| 4 | Barre fixe qui cache la réponse prix ; formule de la barre en annuel | **Réglé** : la réponse se lit en entier jusqu'à « …nouveau délai. » au-dessus de la barre ; la barre affiche « S'abonner · 24,99 €/an » en annuel | FAQ-prix ; T1-annuel/02b |
| 5 | Retour après paiement approximatif ; « Si j'arrête ? » sans réponse | **Réglé** : T1 revient sur /conseils avec « Tout est ouvert : les listes, les parcours, les carnets. Sers-toi. » ; T4 dit « Ta vanne est dans tes favoris. » ; la FAQ a « Et si j'arrête ? » | T1/06 ; T4/06 ; T1/03 |

Autres points du tour 2 : textes tronqués **réglés** (T3/01a « Certaines phrases ne demandent aucun talent, seulement un bon timing. » ; T4/02 « Moi, dix euros. ») ; « carnet du mois » contre « Toutes les situations » **réglé** (tableau : « Toutes, carnets passés compris ») ; prix des cartes à 1 280 px **alignés en haut**.

## Notes sous 10 : cause et correction

### Offre 9 (T1, T1 annuel, T2, T5, C1, C2) : le mot « carnet » reste opaque au premier écran
- **Cause** : 3e coche « Un nouveau carnet de répartie chaque mois » (T1/02, coches). Je ne sais pas ce qu'est un carnet avant de défiler ; c'est expliqué juste sous le pli (« La situation offerte d'octobre, et la réplique qui va avec. »). Même cause qu'au tour 2, inchangée. Ce n'est pas le titre, donc pas dans le choix du fondateur.
- **Correction** : « Un carnet de répartie chaque mois : des situations et la réplique qui va avec ».

### Confiance 9 (mêmes trajets) : carte « Annuel » illisible à 320 px
- **Cause** : T1/02 et T1-annuel/02, carte Annuel. À 320 px, « soit 2,08 € par mois » et « plus de 3 mois offerts » tiennent sur une seule ligne sans séparateur : on lit « 2,08 € par mois plus de 3 mois offerts », comme si les 3 mois s'ajoutaient au prix. Juste en dessous, « Renouvelé chaque année, sauf résiliation. » est en gris d'environ 11 px, alors que c'est la réponse que le sceptique cherche. À 1 280 px, les trois éléments sont sur trois lignes et se lisent bien.
- **Correction** : à 320 px, mettre « plus de 3 mois offerts » sur sa propre ligne (comme à 1 280 px), ou les séparer par « · » ; afficher « Renouvelé chaque année, sauf résiliation. » à la même taille que « soit 2,08 € par mois ».

### Envie 9 (T1, T1 annuel, T2, T5, C1, C2)
- **Cause** : le premier écran reste surtout descriptif ; le moment vécu (la scène du carnet) arrive juste après le pli. Je ne retire qu'un point : la 1re coche porte maintenant une scène (« du boulot au rencard »), et le titre comme la FAQ YouTube sont hors périmètre.
- **Correction** : la même que pour l'offre (une 3e coche qui dit ce que contient le carnet suffit à donner une scène au premier écran).

### Envie 9 (T4) : le favori reste le motif le plus faible
- **Cause** : T4/02, « Il ouvre aussi tout le catalogue et les 5 parcours. » Après la citation de la vanne, « Il » se rattache mal à Premium, et « catalogue » est abstrait à cet endroit.
- **Correction** : « Premium ouvre aussi toutes les vannes et les 5 parcours. »

## Nouveaux défauts relevés en v3

1. **Carte Annuel à 320 px** (voir Confiance) : « 2,08 € par mois plus de 3 mois offerts » se lit d'un bloc, et le renouvellement est en gris minuscule. Seul défaut nouveau qui touche la compréhension du prix.
2. Rien d'autre de nouveau sur les trajets. Vérifié : T2/04 et T5/04 gardent leur ligne de contexte ; T3/04 « l'étape 2 de Répartie s'ouvre : Le rythme et les silences. » ; T1-annuel/05b « Dernière étape. Premium, 24,99 €/an, renouvelé chaque année, sauf résiliation. » ; C1/04, attente dans le bouton et « Paiement sécurisé par Stripe » visible au premier écran.

## Remarques sans effet sur la note

- **T3** : l'offre annuelle n'apparaît pas sur ce trajet. Je l'avais comptée aux tours 1 et 2. Je ne la compte plus : le trajet prévu par la grille va directement à /register, et le persona ne rencontre ni surprise ni question sans réponse sur ces 2 écrans. Reste une piste : un lien « Ou 24,99 €/an » sur /register, si le paiement le permet.
- **T3/01a** : « Lettre gratuite : une vanne décryptée par mois. » sous le bouton payant offre au sceptique une sortie gratuite au meilleur moment du site. La grille ne compte pas ça comme un défaut, mais c'est le seul endroit où une sortie gratuite passe avant la suite du parcours.
- **FAQ « Et si j'arrête ? »** : présente, mais fermée sur toutes les captures. Je ne peux pas juger la réponse.
- **T5/01** : le titre du bloc, « La vanne dans ta bouche, pas dans ton téléphone », parle d'entraînement à voix haute, alors que le bouton vend le catalogue. Écart léger, l'écho « Tout ouvrir » → « Premium ouvre tout » reste exact.

## Contrôles de la grille

Chiffres cohérents partout (2,99 €, 24,99 €, 2,08 €/mois, « plus de 3 mois offerts », « 1 500+ » inchangé). Phrase de garantie intacte, juste sous chaque bouton payant. Aucune mention légale dans un bouton. Aucun tiret cadratin vu. Aucune promesse de résultat vue. Promesse « S'abonner et la garder » tenue (T4/06 et T4/07, étoile pleine).
