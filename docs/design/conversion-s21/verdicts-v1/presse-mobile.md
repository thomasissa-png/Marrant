# Verdict à l'aveugle : le visiteur pressé sur téléphone (trajets v1)

Relecteur : persona « visiteur pressé », 28 ans, téléphone, lit en diagonale, décide en quelques secondes.
Matériel : `trajets-v1/` (T1 à T5, C1, C2), grille §11 uniquement. Date : 19/10.

**Réserve de format (à lever avant validation)** : les captures sont en 375 x 812. La grille demande 375 x 700 et 320 x 640, avec une note sur le plus étroit. Les notes ci-dessous sont donc **provisoires**. À 320 x 640, le bouton « S'abonner · 2,99 €/mois » (aujourd'hui à y ≈ 607 sur 812 dans T1/02) a toutes les chances de passer sous la ligne de flottaison : à recapturer.

## Notes

| Trajet | 1. Clarté 3 s | 2. Promesse tenue | 3. Clics | 4. Envie | 5. Confiance | Moyenne |
|---|---|---|---|---|---|---|
| T1 En-tête | 8 | 9 | 9 | 6 | 8 | 8,0 |
| T2 Mur de liste | 8 | 7 | 9 | 6 | 8 | 7,6 |
| T3 Fin d'étape 1 | 7 | 9 | 10 | 8 | 7 | 8,2 |
| T4 Fenêtre Premium | 5 | 6 | 10 | 4 | 6 | 6,2 |
| T5 Fin d'article | 7 | 9 | 9 | 5 | 8 | 7,6 |
| C1 Connecté, en-tête | 8 | 9 | 10 | 6 | 9 | 8,4 |
| C2 Connecté, mur | 8 | 7 | 10 | 6 | 9 | 8,0 |

**Verdict global : 7,5 / 10.** Seuil P0 non atteint (9 minimum sur chaque critère) : aucun trajet ne passe. Le critère qui casse partout est l'envie.

Garde-fous objectifs : aucun tiret cadratin vu, aucune mention légale dans un bouton, prix et « 1 500+ » conformes, aucune promesse de résultat. Un risque non vérifiable sur captures (voir T1, critère 5).

## T1 En-tête (/conseils → /abonnement → /register → avant Stripe)

Ce que je comprends en 3 s (T1/02) : « Premium débloque tout, 2,99 € par mois, sinon ça s'arrête à 10 vannes. » Bon socle.

- **Clarté 8.** Preuve : T1/02, titre « Premium ouvre tout Deviens Marrant » puis 3 puces. Cause : « carnet de répartie » et « parcours » sont des mots maison ; un nouveau venu ne sait pas ce que c'est. Correction : puce 2 « Les 5 parcours d'exercices, de la première à la dernière étape » ; puce 3 « Un nouveau carnet de répartie chaque mois : une situation, la réplique qui va avec ».
- **Promesse 9.** Preuve : « Premium » (T1/01) → « Premium ouvre tout » (T1/02) : écho exact ; « Tu crées ton compte, puis tu paies par carte » (T1/02) → « Ton compte » (T1/04) : annoncé, donc tenu. Cause du point perdu : T1/05 dit « Te voilà connecté. » à quelqu'un qui vient de **créer** son compte. Correction : « Compte créé. On t'emmène au paiement… ».
- **Clics 9.** Preuve : 3 écrans (abonnement, compte, attente), minimum du trajet. Cause : sur téléphone, taper e-mail + mot de passe de 8 caractères est la vraie friction (T1/04). Correction (logique) : garder Google en tête, et envisager un lien de connexion par e-mail pour supprimer le champ mot de passe.
- **Envie 6.** Preuve : T1/02 ne montre que des fonctions (« Tout le catalogue », « Les 5 parcours »). Le seul moment où je **vis** le bénéfice est « Le carnet, en vrai » (T1/03, vers 1 450 à 2 000 px sur 4 010), après le tableau. Je ne descends pas jusque-là. Correction (mise en page) : remonter l'échange « On te dit : Tu parles toujours aussi peu ? / Tu réponds : Donne-moi la nuit. Demain, je t'envoie un message magnifique. » juste sous la carte d'offre, avant le tableau, en version compacte (2 bulles, sans « Pourquoi ça marche »). Le tableau vient après.
- **Confiance 8.** Preuve : prix TTC net, étape suivante annoncée (T1/02, sous le bouton). Causes : (1) la garantie est en gris clair d'environ 13 px (T1/02, y ≈ 670), exactement le « gris minuscule » que la grille refuse ; (2) côté visiteur, aucune mention de Stripe alors que la version connectée l'affiche (C1/02 « Paiement sécurisé par Stripe ») ; (3) risque non testé : si je coche « Annuel », /register affiche-t-il encore « Premium, 2,99 € TTC par mois » (T1/04) ? Si oui, c'est un fait faux. Corrections : garantie en blanc cassé, taille du corps de texte ; ajouter « Paiement sécurisé par Stripe. » sous le bouton de /register ; capturer le trajet T1 avec « Annuel » coché.
- Détail visuel : la carte « Mensuel » (T1/02) a un vide de 40 px sous « TTC / mois » face à la carte « Annuel » remplie ; la carte présélectionnée paraît la plus pauvre. Aligner les deux cartes en hauteur de contenu ou réduire la hauteur commune.

## T2 Mur de liste (/vannes → /abonnement → /register → avant Stripe)

- **Clarté 8.** Mêmes causes et corrections que T1 (T2/02 identique hors accroche).
- **Promesse 7.** Preuve : je clique « Voir la suite des vannes · 2,99 €/mois » (T2/01) et j'arrive sur « Premium ouvre tout Deviens Marrant » (T2/02). L'écho n'existe que dans l'accroche violette « Pour la suite des vannes » d'environ 12 px, que je ne lis pas. La ligne « Listes » mise en avant est dans le tableau, hors du premier écran. -2 pour « Voir » qui mène à une page de vente et non à des vannes, +1 pour l'accroche. Correction : sur ce trajet, le titre porte le contexte, par exemple « La suite des vannes, et tout le reste » ; sous-titre inchangé ; accroche supprimée ou passée en taille de corps, couleur pleine.
- **Clics 9.** 3 écrans, minimum. Même friction de saisie que T1.
- **Envie 6.** Preuve : T2/01, sous le mur, une carte verrouillée vide (deux barres grises et un cadenas). Elle ne me fait rien imaginer. Correction : afficher la première ligne réelle de la vanne n° 11, floutée à partir de la moitié, avec le cadenas. Puis même correction d'envie que T1 sur /abonnement.
- **Confiance 8.** Preuve : garantie sous le bouton du mur (T2/01) et sous « S'abonner » (T2/02). Mêmes causes que T1 (gris minuscule, Stripe absent côté visiteur). En plus : sur /register (T2/04), le lien « Tester l'étape 1 de Répartie, gratuite » est une sortie au moment où je suis le plus décidé. Correction : le retirer de /register (il existe déjà sur /abonnement, bloc « Pas encore sûr ? »).

## T3 Fin d'étape 1 (carte → /register → avant Stripe)

- **Clarté 7.** Preuve : T3/01 « Les étapes suivantes s'ouvrent avec Premium. » + « Passer à l'étape 2 · 2,99 €/mois ». Je sais combien et ce que je débloque tout de suite, pas ce que Premium donne d'autre ; l'offre « Annuel » n'apparaît nulle part sur ce trajet. Les étapes verrouillées sous le bouton n'affichent que « +75 XP », « +100 XP », « +150 XP » : je ne sais pas ce que j'y apprends. Correction : sur /register de T3, une ligne sous le sous-titre « Avec Premium : toutes les vannes et les 5 parcours en entier. » ; sur les étapes verrouillées, une demi-ligne de contenu au lieu des XP seuls (le titre « Le rythme et les silences » est bien, c'est « +75 XP » qui ne dit rien).
- **Promesse 9.** Preuve : « Passer à l'étape 2 » (T3/01) → « Après le paiement, l'étape 2 de Répartie s'ouvre. » (T3/04). Meilleur écho de tous les trajets. Point perdu : titre « Ton compte » alors que je viens de demander l'étape 2.
- **Clics 10.** 2 écrans, minimum, et pas de lien de sortie sur /register. Très bien.
- **Envie 8.** J'ai fini l'étape 1, l'élan est là ; le bouton est le geste naturel.
- **Confiance 7.** Preuve : T3/01 ne dit nulle part qu'il faudra un compte ; le mot « compte » surgit en T3/04 (surprise, -2). Correction : sous le bouton de T3/01, au-dessus de la garantie : « D'abord ton compte, puis le paiement. » Même remarque garantie en gris minuscule.

## T4 Fenêtre Premium (étoile d'une vanne → fenêtre → /register → avant Stripe)

- **Clarté 5.** Preuve : T4/02, la fenêtre dit seulement « Mets-la de côté / 2,99 € TTC / mois / Je m'abonne et je la garde ». Ce que je lis : « 2,99 € par mois pour mettre une blague en favori ». Rien sur le reste de Premium, rien sur la vanne concernée. Correction : sous le prix, une ligne « Premium garde tes vannes préférées et ouvre toutes les listes et les 5 parcours. » ; en haut de la fenêtre, rappeler la première ligne de la vanne cliquée (« Pour ta valise de départ, chacun a cotisé selon ses moyens… »).
- **Promesse 6.** Preuve : « Je m'abonne et je la garde » (T4/02) → T4/04 « Ton compte · Premium, 2,99 € TTC par mois. » : plus aucune trace de « la » vanne ni des favoris (-2). Et le lien « Tester l'étape 1 de Répartie, gratuite » (T4/04) parle d'un sujet que je n'ai jamais vu sur ce trajet (-2). Corrections : sous-titre de /register sur ce trajet « Premium, 2,99 € TTC par mois. Après le paiement, garde tes vannes préférées d'un clic. » (à condition que le geste fonctionne bien ainsi après paiement : à vérifier côté code, sinon ne pas l'écrire) ; retirer le lien Répartie de /register.
- **Clics 10.** 2 écrans (fenêtre, compte), minimum.
- **Envie 4.** Preuve : T4/02. La fenêtre arrive pile au moment où une vanne me plaît, c'est le bon moment, mais elle ne vend qu'un marque-page. Correction : la ligne de bénéfice ci-dessus, plus l'option « Annuel · 24,99 € » en lien discret sous le bouton (lien, pas bouton) pour ceux que 2,99 €/mois pour un favori fait tiquer.
- **Confiance 6.** Preuve : la fenêtre (T4/02) ne dit pas qu'il faut un compte ; « Ton compte » surgit en T4/04 (-2). La garantie est là mais en gris minuscule (-1, y ≈ 765). Correction : « D'abord ton compte, puis le paiement. » sous le bouton de la fenêtre, avant la garantie.

## T5 Fin d'article (bloc de fin → /abonnement → /register → avant Stripe)

- **Clarté 7.** Preuve : T5/01, « Tout ouvrir · 2,99 €/mois » : tout ouvrir quoi ? Je suis sur un article de blagues, « tout » ne désigne rien. Sur T5/02, mêmes forces et faiblesses que T1/02. Correction : une ligne juste au-dessus du lien « Avec Premium : toutes les vannes et les 5 parcours en entier. »
- **Promesse 9.** Preuve : « Tout ouvrir » (T5/01) → accroche « Pour tout ouvrir » + titre « Premium ouvre tout » (T5/02) : écho exact. Point perdu : l'accroche est trop petite pour être lue (même remarque que T2).
- **Clics 9.** 3 écrans, minimum. Même friction de saisie.
- **Envie 5.** Preuve : T5/01, trois demandes empilées sur un écran : bouton plein « Tester mes premières répliques, gratuit », puis le lien souligné « Tout ouvrir · 2,99 €/mois », puis le formulaire « Envoie-moi la lettre » avec un gros bouton bordé. L'offre payante est la plus faible visuellement des trois et n'a aucun argument. Corrections : passer « Tout ouvrir · 2,99 €/mois » en bouton secondaire bordé de 44 px de haut ; ajouter la ligne d'argument ci-dessus ; éloigner le bloc lettre (au moins un écran d'écart, ou après les articles liés).
- **Confiance 8.** Preuve : T5/02 identique à T1/02 (mêmes causes). Le lien de sortie Répartie revient sur /register (T5/04).

## C1 et C2 (compte sans abonnement)

- **C1 : 8 / 9 / 10 / 6 / 9.** Preuve : C1/02, « Paiement sécurisé par Stripe » remplace la ligne compte, et le bouton devient « On t'emmène au paiement… » (C1/04) : 2 écrans, rien de superflu. L'envie reste celle de /abonnement (voir T1).
- **C2 : 8 / 7 / 10 / 6 / 9.** Preuve : même écart de contexte que T2 (accroche de 12 px seule à porter « la suite des vannes »). Mêmes corrections.
- Petit point C1/04 et C2/04 : le bouton en cours de chargement est violet délavé, texte gris ; on dirait un bouton désactivé. Ajouter un indicateur de chargement dans le bouton.

## Les 5 défauts les plus coûteux, du plus grave au moins grave

1. **Aucun bénéfice vécu avant le bouton de /abonnement** (T1/02, T2/02, T5/02, C1/02, C2/02). Le premier écran liste des fonctions ; le seul passage qui donne envie (« Le carnet, en vrai », l'échange « Tu parles toujours aussi peu ? / Donne-moi la nuit… ») est enterré après le tableau, aux deux tiers de la page. Correction : remonter cet échange, en 2 bulles, juste sous la carte d'offre et avant le tableau.
2. **La fenêtre de l'étoile vend un marque-page à 2,99 €/mois** (T4/02), puis /register oublie la vanne (T4/04). Correction : une ligne de bénéfice global dans la fenêtre, rappel de la vanne cliquée, « D'abord ton compte, puis le paiement. », et un sous-titre de /register qui parle des vannes gardées (si c'est vrai dans le produit).
3. **Le contexte d'entrée se perd à l'arrivée sur /abonnement** (T2/02, T5/02, C2/02) : l'écho tient dans une accroche violette de 12 px, le titre reste « Premium ouvre tout Deviens Marrant » quel que soit le clic. Correction : sur T2 et C2, titre de contexte (« La suite des vannes, et tout le reste ») ; accroche en taille de corps pour les autres.
4. **L'offre payante en fin d'article est la plus faible des trois demandes de l'écran** (T5/01) : lien souligné sans argument, coincé entre un bouton gratuit plein et un formulaire de lettre. Correction : bouton secondaire bordé, une ligne d'argument, bloc lettre éloigné.
5. **Le compte surgit sans annonce et la sortie gratuite reste ouverte au pire moment** : sur T3/01 et T4/02, aucun mot sur le compte avant « Ton compte » ; sur /register (T1/04, T2/04, T4/04, T5/04), « Tester l'étape 1 de Répartie, gratuite » offre une sortie au moment de plus forte intention. Correction : « D'abord ton compte, puis le paiement. » sous les boutons de T3 et T4 ; retirer le lien Répartie de /register. Dans la même passe : garantie en couleur lisible plutôt qu'en gris minuscule, et « Compte créé. » au lieu de « Te voilà connecté. » sur l'écran d'attente.

## À vérifier avant la prochaine relecture

- Recapturer en 375 x 700 et 320 x 640 (exigence de la grille) ; vérifier que « S'abonner · 2,99 €/mois » reste visible sans défiler à 320 x 640.
- Capturer T1 avec « Annuel » coché : libellé du bouton et sous-titre de /register (aujourd'hui « 2,99 € TTC par mois ») doivent suivre, sinon c'est un fait faux.
