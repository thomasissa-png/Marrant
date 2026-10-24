# Verdict à l'aveugle, tour 2 : le visiteur pressé sur téléphone (trajets v2)

Relecteur : persona « visiteur pressé », 28 ans, téléphone, lit en diagonale. Matériel : `trajets-v2/`, grille §11 seule. **Notes données sur 320 x 640** (le plus étroit), 375 x 700 regardé en contrôle. Date : 19/10.

## Notes (320 x 640)

| Trajet | 1. Clarté | 2. Promesse | 3. Clics | 4. Envie | 5. Confiance | Moyenne |
|---|---|---|---|---|---|---|
| T1 En-tête (mensuel) | 10 | 9 | 10 | 8 | 9 | 9,2 |
| T1 Annuel | 10 | 10 | 10 | 8 | 8 | 9,2 |
| T2 Mur de liste | 10 | 9 | 10 | 8 | 9 | 9,2 |
| T3 Fin d'étape 1 | 10 | 10 | 10 | 9 | 9 | 9,6 |
| T4 Fenêtre Premium | 10 | 10 | 10 | 9 | 9 | 9,6 |
| T5 Fin d'article | 10 | 10 | 10 | 8 | 9 | 9,4 |
| C1 Connecté, en-tête | 10 | 10 | 10 | 8 | 9 | 9,4 |
| C2 Connecté, mur | 10 | 9 | 10 | 8 | 9 | 9,2 |

**Verdict global : 9,3 / 10** (7,5 au tour 1). **T3 et T4 passent la barre** (9 minimum partout). **T1, T2, T5, C1 et C2 bloquent sur un seul critère, l'envie (8)**, tous pour la même cause : le premier écran de /abonnement. T1 Annuel bloque aussi sur la confiance (8).

Garde-fous objectifs : aucun tiret cadratin, aucune mention légale dans un bouton, prix et « 1 500+ » conformes, garantie intacte, aucune promesse de résultat. Le cas annuel est juste de bout en bout (bouton « S'abonner · 24,99 €/an », /register « Premium, 24,99 €/an, renouvelé chaque année, sauf résiliation. », attente « Ton compte est prêt. »).

## Mes 5 défauts du tour 1 : revérification

| # | Défaut tour 1 | État v2 | Preuve |
|---|---|---|---|
| 1 | Aucun bénéfice vécu avant le bouton de /abonnement | **Partiellement corrigé** | « Le carnet, en vrai » vient maintenant juste après la carte d'offre, avant le tableau (T1/320/03, vers 610 à 1 040 px). Le premier écran reste 100 % description. |
| 2 | La fenêtre de l'étoile vend un marque-page | **Corrigé** | T4/320/02 : rappel de la vanne, « Il ouvre aussi tout le catalogue et les 5 parcours. », « D'abord ton compte, puis le paiement. » ; /register « Après le paiement, ta vanne est dans tes favoris. » ; T4/07 étoile pleine. |
| 3 | Contexte d'entrée perdu sur /abonnement | **Corrigé pour T5, quasi corrigé pour T2/C2** | T5/02 « Premium ouvre tout » répond à « Tout ouvrir ». T2/320/02 : accroche « Pour la suite des vannes » en blanc lisible, mais le titre reste générique (voir T2). |
| 4 | Offre payante la plus faible en fin d'article | **Corrigé** | T5/320/01 : bouton plein « Tout ouvrir · 2,99 €/mois », ligne d'argument au-dessus, gratuit en lien, bloc lettre parti. |
| 5 | Compte non annoncé, sortie gratuite sur /register, garantie en gris | **Corrigé** | « D'abord ton compte, puis le paiement. » (T3/01, T4/02) ; titre /register « Ton compte, puis le paiement » ; lien Répartie retiré de /register (T1/375/04) ; garantie en blanc, taille du corps ; « Paiement sécurisé par Stripe. » sur /register. |

## Causes et corrections, note par note (toutes les notes sous 10)

### Envie 8 : T1, T1 Annuel, T2, T5, C1, C2 (une seule cause)
- **Preuve** : T1/320/02 (identique sur T2, T5, C1, C2). Entre l'en-tête et le bouton, je lis un titre, un sous-titre et 3 puces : que des fonctions. Le seul moment où je vis le bénéfice (« On te dit : Tu parles toujours aussi peu ? / Tu réponds : Donne-moi la nuit… ») commence vers 610 px, donc sur le deuxième écran, après le bouton.
- **Correction (mise en page, sans hauteur en plus)** : ajouter un lien d'ancre en fin de puce 3, « Un nouveau carnet de répartie chaque mois · voir un exemple », qui descend à « Le carnet, en vrai ». Si une ligne peut être gagnée (voir confiance ci-dessous), mieux : remplacer la puce 3 par la réplique elle-même, sur une ligne, en italique : « Chaque mois, un carnet : « Tu parles toujours aussi peu ? » « Donne-moi la nuit… » ».

### Confiance 9 : T1, T2, T5, C1, C2 ; confiance 8 : T1 Annuel
- **Preuve** : à 320 x 640, la garantie passe sous la ligne de flottaison. Mensuel (T1/320/02) : seule une demi-ligne « Premium : premier paiement… » dépasse en bas, coupée. Annuel (T1-annuel/320/02) : la ligne « Renouvelé chaque année, sauf résiliation. » pousse le bouton à y ≈ 632, et **ni « Tu crées ton compte, puis tu paies par carte sur Stripe. » ni la garantie ne sont visibles** avant de toucher le bouton (-2 sur annuel : surprise du compte et garantie invisible).
- **Correction (mise en page)** : gagner environ 70 px au-dessus du bouton : (1) passer « 1 500+ inscrits bossent leur humour. » sous le bouton, entre « Tu crées ton compte… » et la garantie (texte inchangé) ; (2) réduire l'espace entre l'en-tête et le titre (≈ 35 px aujourd'hui) et entre les puces ; (3) en annuel, fusionner « Renouvelé chaque année, sauf résiliation. » dans la carte « Annuel » sous « plus de 3 mois offerts », au lieu d'une ligne à part entre la carte et le bouton.

### Promesse 9 : T1 (écran de retour)
- **Preuve** : T1/320/06. J'arrive de /conseils, je n'ai rien commencé, et la bannière me dit « Reprends là où tu t'étais arrêté. » au-dessus d'une page Parcours. Et le titre se casse ainsi : « Parcours humour / : deviens drôle / pas à pas », deux-points en début de ligne.
- **Correction** : pour un compte qui n'a rien commencé, bannière « Tout est ouvert : les listes, les parcours, le carnet du mois. Commence par le parcours de ton choix, juste en dessous. » ; garder « Reprends là où tu t'étais arrêté. » seulement s'il y a une progression. Titre : espace insécable avant le deux-points.

### Promesse 9 : T2 et C2
- **Preuve** : T2/320/01 « Ouvrir la suite des vannes » → T2/320/02 : l'écho est dans l'accroche « Pour la suite des vannes » (lisible désormais), mais le titre reste « Premium ouvre tout Deviens Marrant », le même que pour tous les trajets. /register (T2/320/04) reprend bien « la suite des vannes s'ouvre ».
- **Correction (texte)** : sur ce trajet seulement, fondre l'accroche dans le titre : « La suite des vannes, et tout le reste », sous-titre inchangé. Même hauteur qu'aujourd'hui (accroche supprimée).

### Envie 9 : T3
- **Preuve** : T3/320/01a, la carte « Étape 2 sur 4 · Le rythme et les silences » est le meilleur argument du site, mais sa description est coupée en plein mot à 320 px : « Ici, tu apprends à repére… ». La phrase qui me vend l'étape 2 s'arrête avant de dire quoi.
- **Correction** : autoriser 4 lignes à 320 px ou raccourcir la description pour qu'elle tienne entière en 3 lignes.

### Confiance 9 : T3 et T4
- **Preuve** : ces deux trajets ne passent pas par /abonnement, et la mention TTC a disparu partout ailleurs : T3/01 « 2,99 €/mois », T4/320/02 « 2,99 € /mois », /register « Premium, 2,99 €/mois. » (au tour 1, /register et la fenêtre affichaient « TTC »). Sur T3 et T4, je ne vois donc jamais « TTC ».
- **Correction (texte)** : remettre « TTC » sous le prix de la fenêtre (« 2,99 € TTC / mois ») et dans le sous-titre de /register (« Premium, 2,99 € TTC par mois. Après le paiement, … »).

### Envie 9 : T4
- **Preuve** : T4/320/02, le rappel de la vanne s'arrête sur « Moi, dix… » : ce n'est pas la chute (cachée derrière « Révéler »), c'est l'amorce que je viens de lire en entier sur la fiche. Coupée ainsi, elle ressemble à un bug, pas à un teaser.
- **Correction** : afficher l'amorce entière (2 lignes : « Pour ta valise de départ, chacun a cotisé selon ses moyens. Moi, dix euros. »).

## Nouveaux défauts (hors notes ou mineurs)
- **T3/320/01**, sous la garantie : lien « Lettre gratuite : une vanne décryptée par mois. ». Une deuxième sortie juste sous le bouton payant, sur le trajet le plus chaud. Pas de point retiré (alternative discrète), mais je la déplacerais sous la liste des étapes verrouillées.
- **T3/320/01**, juste sous la carte : la ligne verrouillée « Le rythme et les silences · +75 XP » répète la carte « Étape 2 sur 4 » au-dessus. Doublon visible ; masquer la ligne de l'étape 2 quand la carte est affichée.
- **T4/320/02** : « Il ouvre aussi tout le catalogue… » : le « Il » renvoie à Premium, trois lignes plus haut. « Premium ouvre aussi tout le catalogue et les 5 parcours. » se lit sans effort.
- **T4/320/06** : la bannière de bienvenue ne dit pas que la vanne est gardée ; je le découvre en défilant (T4/07). Ajouter « Ta vanne est dans tes favoris. » à la bannière sur ce trajet.

## Top 5 des défauts restants, du plus coûteux au moins coûteux
1. **Premier écran de /abonnement sans bénéfice vécu** (envie 8 sur 6 trajets sur 8) : lien d'ancre « voir un exemple » ou réplique en puce 3.
2. **Garantie et annonce du compte sous la ligne de flottaison à 320 x 640**, surtout en annuel : remonter le bouton d'environ 70 px (« 1 500+ » sous le bouton, espacements, ligne de renouvellement dans la carte).
3. **Mention TTC disparue sur les trajets T3 et T4** (fenêtre et /register) : la remettre.
4. **Écran de bienvenue T1** : « Reprends là où tu t'étais arrêté. » faux pour un nouveau venu, deux-points orphelin dans le titre.
5. **Titre générique sur T2/C2** (« Premium ouvre tout Deviens Marrant » après « Ouvrir la suite des vannes ») : « La suite des vannes, et tout le reste ».
