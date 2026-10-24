# Verdict à l'aveugle v1 : le sceptique

Persona : 35 ans, se méfie des abonnements, cherche le piège, veut savoir ce qu'il paie, ce qu'il a déjà gratuitement et comment il sort. Compare avec YouTube gratuit.
Matériel : `docs/design/conversion-s21/trajets-v1/` (captures 375 x 812, plus 2 captures à 1 280 px). Grille : §11 de `docs/ux/trajet-conversion-s21.md`, lue seule.

## Verdict global : 7,5 / 10 (seuil de la grille : 9 sur chaque critère, non atteint)

| Trajet | 1. Offre en 3 s | 2. Promesse tenue | 3. Clics | 4. Envie | 5. Confiance | Moyenne |
|---|---|---|---|---|---|---|
| T1 En-tête | 8 | 9 | 9 | 6 | 7 | 7,8 |
| T2 Mur de liste | 8 | 7 | 9 | 7 | 7 | 7,6 |
| T3 Fin d'étape 1 | 7 | 9 | 10 | 8 | 7 | 8,2 |
| T4 Fenêtre Premium | 5 | 6 | 10 | 4 | 6 | 6,2 |
| T5 Fin d'article | 8 | 9 | 9 | 6 | 7 | 7,8 |
| C1 Connecté, en-tête (hors seuil) | 8 | 9 | 10 | 6 | 8 | 8,2 |
| C2 Connecté, mur (hors seuil) | 8 | 7 | 10 | 6 | 8 | 7,8 |

Ce qui marche pour moi, sceptique : le prix TTC est partout, y compris dans les boutons ; la garantie est collée à chaque bouton payant, en texte lisible ; « Tu crées ton compte, puis tu paies par carte. » me prévient de l'étape compte ; « Pas encore sûr ? Tester l'étape 1 de Répartie, gratuite. Sans compte. » me laisse une sortie gratuite ; le tableau Gratuit et Premium existe ; la FAQ pose exactement mes deux questions (frais cachés, YouTube) ; le pied de page affiche « Résilier ton contrat ». J'ai vérifié le calcul : 24,99 € / 12 = 2,08 €, et 12 x 2,99 € = 35,88 €, soit 10,89 € d'écart, 3,6 mois : « plus de 3 mois offerts » est juste.

## Limites de la relecture (à dire avant de valider)

- Captures en 375 x 812 seulement. La grille demande 375 x 700 et 320 x 640, notées sur le plus étroit. À 700 px de haut, le bouton « S'abonner · 2,99 €/mois » (T1/02, y ≈ 607) reste visible ; à 320 x 640, rien ne le prouve. Notes provisoires tant que les captures 320 x 640 manquent.
- Écran de retour après Stripe absent (prévu par la grille pour T1). Stripe non capturé, comme convenu.
- Je ne vois pas le contenu des réponses de la FAQ (fermées dans toutes les captures) : je ne peux pas juger si elles répondent bien.

## T1 En-tête (01 → 05)

- **1. Offre en 3 s : 8.** Preuve T1/02 : titre « Premium ouvre tout Deviens Marrant », sous-titre « Les listes ne s'arrêtent plus à la dixième vanne, les parcours vont au bout. », prix 2,99 € TTC / mois. J'écris : « Premium à 2,99 €/mois, sinon je suis bloqué à 10 vannes par liste et à l'étape 1 des parcours. » Cause du -2 : « Un nouveau carnet de répartie chaque mois » (3e coche) ne me dit pas ce qu'est un carnet (une page ? un PDF ? un e-mail ?), et ce que j'ai déjà en gratuit n'apparaît pas avant le tableau (T1/03, sous le pli). En plus, « Premium ouvre tout Deviens Marrant » se lit d'abord comme un ordre (« Deviens marrant ») avant que je comprenne que c'est le nom du site. **Correction** : 3e coche « Un carnet de répartie chaque mois : des situations et la réplique qui marche » (si c'est bien le format) ; titre « Premium ouvre tout deviens-marrant.fr » ou « Premium ouvre tout le site ».
- **2. Promesse tenue : 9.** « Premium » (T1/01, en-tête) se retrouve dans le titre T1/02. « S'abonner · 2,99 €/mois » mène à « Ton compte » (T1/04) : annoncé par « Tu crées ton compte, puis tu paies par carte. », donc pas de surprise, mais le titre ne reprend ni « Premium » ni « abonnement » (le sous-titre, oui). Cause du -1 : T1/05 « Te voilà connecté. » alors que je viens de créer un compte. **Correction** : T1/04 titre « Ton compte, puis le paiement » ; T1/05 « Compte créé. On t'emmène au paiement… ».
- **3. Clics : 9.** /abonnement, /register (2 champs ou Google), puis une page d'attente plein écran (T1/05) avant Stripe : écran en plus, avec le pied de page du site, qui me fait croire un instant que c'est fini. **Correction** : garder l'attente dans le bouton de /register, comme le fait déjà C1/04 (« On t'emmène au paiement… » dans le bouton).
- **4. Envie : 6.** Le premier écran décrit un catalogue (« Tout le catalogue : vannes, conseils, vidéos ») : c'est une liste de contenus, pas ce que je vis. Le seul moment vécu, « Le carnet, en vrai » (« Donne-moi la nuit. Demain, je t'envoie un message magnifique. »), est le meilleur argument de la page et il arrive après le tableau, bien sous le pli (T1/03, tiers du milieu). Face à YouTube gratuit, ma question est posée en FAQ (« C'est quoi la différence avec juste regarder des vidéos YouTube ? ») mais fermée, en bas de page. **Correction** : remonter « Le carnet, en vrai » juste sous le bloc prix (avant le tableau) ; ouvrir par défaut les deux FAQ « frais cachés » et « YouTube ».
- **5. Confiance : 7.** Bon : TTC, garantie sous le bouton, étape compte annoncée. Questions sans réponse (-1 chacune, arrondi) : (a) l'annuel se renouvelle-t-il tout seul à 24,99 € ? Rien ne le dit sur la carte « Annuel » ; (b) le visiteur ne voit jamais qui encaisse : « Paiement sécurisé par Stripe » n'apparaît qu'en mode connecté (C1/02), alors que le visiteur lit « puis tu paies par carte » ; (c) si je résilie, je garde quoi (les carnets déjà sortis, mes favoris, ma progression) ? **Correction** : carte annuelle « 24,99 € TTC / an, renouvelé chaque année » (si c'est le cas dans Stripe) ; ligne visiteur « Tu crées ton compte, puis tu paies par carte via Stripe. » ; une FAQ « Si j'arrête, je garde quoi ? » avec la réponse vérifiée dans le code.

## T2 Mur de liste (01 → 05)

- **1. Offre en 3 s : 8.** Même premier écran que T1, plus l'accroche « Pour la suite des vannes » (T2/02, haut). Même cause et même correction que T1.
- **2. Promesse tenue : 7.** Le bouton dit « Voir la suite des vannes · 2,99 €/mois » (T2/01, milieu) : le verbe « Voir » me promet les vannes, j'arrive sur une page de vente (-2, une rupture). L'accroche « Pour la suite des vannes » en petit violet et la ligne « Listes » surlignée dans le tableau (T2/03) rattrapent bien. Puis /register (T2/04) perd le contexte : « Ton compte, Premium, 2,99 € TTC par mois. », plus un mot sur les vannes (-1). **Correction** : bouton « La suite des vannes · 2,99 €/mois » (sans verbe qui promet l'affichage) ; sous-titre /register depuis ce trajet « Après le paiement, la suite des vannes s'ouvre. » (même mécanique que T3/04).
- **3. Clics : 9.** Même cause que T1 (page d'attente T2/05).
- **4. Envie : 7.** Le moment est bon : je voulais lire la suite, la carte floutée avec un cadenas (T2/01, bas) me le rappelle. Mais /abonnement me remet le discours général au lieu de me montrer ce que je rate dans cette liste. **Correction** : sous l'accroche « Pour la suite des vannes », une ligne avec le nombre réel de vannes restantes dans la liste quittée, si le code le connaît (sinon, rien).
- **5. Confiance : 7.** « Les 10 gratuites, c'est fait. » (T2/01) : 10 par liste, par jour, ou au total ? Est-ce que ça revient demain ? Le tableau dit « 10, 3 et 3 » sans unité. Pour un sceptique, une limite floue sent le piège. **Correction** : écrire l'unité vérifiée dans le code, par exemple « 10 par liste » si c'est le cas, dans le mur et dans le tableau.

## T3 Fin d'étape 1 (01 → 04 → 05)

- **1. Offre en 3 s : 7.** Pas de /abonnement sur ce trajet : je sais le prix et que l'étape 2 s'ouvre (T3/04, sous-titre « Après le paiement, l'étape 2 de Répartie s'ouvre. »), mais je ne sais pas que les 5 parcours, les listes et le carnet viennent avec. Je crois payer 2,99 €/mois pour une étape. **Correction** : sous-titre T3/04 « Après le paiement, l'étape 2 de Répartie s'ouvre, et tout le reste de Premium avec. »
- **2. Promesse tenue : 9.** « Passer à l'étape 2 · 2,99 €/mois » (T3/01) trouve son écho dans le sous-titre de T3/04. -1 : le titre reste « Ton compte ». Même correction que T1 pour le titre.
- **3. Clics : 10.** 2 écrans comme prévu (la page d'attente T3/05 est comptée sur T1, pas deux fois).
- **4. Envie : 8.** Le meilleur moment du site : je viens de finir l'étape 1, les étapes verrouillées sont listées en dessous (« Le rythme et les silences », « Retourner les piques avec le sourire », « Improviser sur l'inattendu »). -2 : les « +75 XP », « +100 XP », « +150 XP » ne me parlent pas ; je voudrais savoir ce que j'apprends. **Correction** : sous chaque étape verrouillée, une demi-ligne de ce qu'on y fait, à la place ou à côté de l'XP.
- **5. Confiance : 7.** Le mot « compte » arrive sans annonce : le bouton de T3/01 ne dit pas que je vais créer un compte (-2). L'offre annuelle à 24,99 € n'existe pas sur ce trajet : le sceptique se demande si on lui cache l'option moins chère (-1). **Correction** : sous le bouton de T3/01, « D'abord ton compte, puis le paiement. » (hors bouton) ; sur T3/04, un lien « Ou 24,99 €/an » qui sélectionne l'annuel, si le paiement le permet.

## T4 Fenêtre Premium (01 → 02 → 04 → 05)

- **1. Offre en 3 s : 5.** La fenêtre (T4/02, bas) dit « Mets-la de côté », « 2,99 € TTC / mois », « Je m'abonne et je la garde ». Ce que j'achète, pour moi : 2,99 €/mois pour mettre une vanne en favori. Le mot « Premium » n'apparaît que dans la ligne de garantie, rien ne dit que les listes, les parcours et le carnet sont compris. Réflexe du sceptique : « 36 € par an pour un marque-page ? Je fais une capture d'écran. » **Correction** : sous le titre, « Les favoris font partie de Premium, avec les listes complètes et les 5 parcours. »
- **2. Promesse tenue : 6.** « Je m'abonne et je la garde » mène à « Ton compte » (T4/04) sans rappel de la vanne (-2) ; et « je la garde » est une promesse : je dois retrouver cette vanne dans mes favoris après Stripe. Rien à l'écran ne le confirme, et je ne peux pas le vérifier sur captures (-2 tant que non prouvé). L'icône cliquée est une étoile (T4/01, entourée), pas un cœur : sans gravité pour moi, à aligner dans les docs. **Correction** : sous-titre T4/04 « Après le paiement, ta vanne est dans tes favoris. », à n'écrire que si le code l'ajoute vraiment au retour de Stripe (sinon, changer le bouton en « Je m'abonne · 2,99 €/mois »).
- **3. Clics : 10.** Fenêtre puis /register : le minimum prévu.
- **4. Envie : 4.** Le favori est le plus faible des motifs : rien de vécu, aucun aperçu de ce que Premium m'apporte d'autre, pas d'issue gratuite dans la fenêtre (seulement la croix). **Correction** : la ligne proposée au critère 1, et un lien sous la garantie « Voir tout ce que Premium ouvre » vers /abonnement.
- **5. Confiance : 6.** Mot « compte » non annoncé dans la fenêtre (-2), pas d'annuel (-1), pas de mention du moyen de paiement (-1). **Correction** : sous le bouton, « D'abord ton compte, puis le paiement par carte. » (hors bouton, au-dessus de la garantie).

## T5 Fin d'article (01 → 05)

- **1. Offre en 3 s : 8.** Même premier écran que T1 avec l'accroche « Pour tout ouvrir » (T5/02). Mêmes causes et corrections que T1.
- **2. Promesse tenue : 9.** Le meilleur écho de tous les trajets : « Tout ouvrir · 2,99 €/mois » (T5/01) → « Pour tout ouvrir » → « Premium ouvre tout ». -1 : /register (T5/04) perd le contexte. **Correction** : sous-titre « Après le paiement, tout s'ouvre. »
- **3. Clics : 9.** Même cause que T1 (page d'attente).
- **4. Envie : 6.** Bon pour la confiance, faible pour l'envie : le lien payant est un simple lien texte sous un gros bouton gratuit (« Tester mes premières répliques, gratuit »), puis juste dessous un formulaire « Une vanne décryptée, chaque mois. Gratuite, par e-mail, avec un exercice. » Le sceptique conclut : « Une vanne par mois gratuite, ça me suffit. » Et sur /abonnement, « Un nouveau carnet de répartie chaque mois » ressemble à la même chose en payant. **Correction** : sur /abonnement, différencier noir sur blanc le carnet Premium de la lettre gratuite (par exemple « Le carnet : toutes les situations du mois, la lettre gratuite en décrypte une. », si c'est exact).
- **5. Confiance : 7.** Mêmes questions sans réponse que T1 (renouvellement annuel, Stripe non nommé, ce qui reste après résiliation).

## C1 et C2 (compte sans abonnement, hors seuil)

- C1 : « Premium » (C1/01) → /abonnement (C1/02) → bouton qui devient « On t'emmène au paiement… » (C1/04). 1 clic utile, aucun écran inutile : c'est le modèle à suivre pour les visiteurs. « Paiement sécurisé par Stripe » sous le bouton rassure : à donner aussi aux visiteurs. Envie 6 pour les mêmes raisons que T1.
- C2 : même rupture « Voir la suite des vannes » que T2 (promesse 7). « Pas encore sûr ? » a disparu, logique pour un compte qui a sans doute déjà testé.

## Les 5 défauts les plus coûteux pour la conversion

1. **La fenêtre Premium vend un favori, pas Premium** (T4/02). 2,99 €/mois pour « mettre de côté » une vanne, sans dire ce qui vient avec, et « je la garde » non confirmé après le paiement. Trajet le plus faible (6,2).
2. **Le meilleur argument arrive trop tard** (T1/03, T2/03, T5/03). « Le carnet, en vrai » est le seul moment vécu ; il est sous le tableau, et les deux FAQ du sceptique (frais cachés, YouTube) sont fermées en bas de page. Le premier écran décrit un catalogue.
3. **Les limites gratuites n'ont pas d'unité** : « Les 10 gratuites, c'est fait. », « 10, 3 et 3 », « 1 situation » contre « Toutes les situations ». Une limite floue ressemble à un piège.
4. **Sortie et engagement incomplets** : renouvellement de l'annuel non dit, ce qu'on garde après résiliation non dit, Stripe nommé seulement pour les comptes connectés. La phrase de garantie fait son travail, mais elle est seule.
5. **Le contexte se perd sur /register et un écran de trop** : « Ton compte » générique sur T2, T4, T5 (seul T3 rappelle ce qui s'ouvre), puis la page « Te voilà connecté. » plein écran avant Stripe, alors que le parcours connecté fait l'attente dans le bouton.

## Phrases fausses, ambiguës ou trompeuses

| Écran | Phrase | Problème | Gravité |
|---|---|---|---|
| T4/02 | « Je m'abonne et je la garde » | Promesse à prouver : la vanne doit être en favori au retour de Stripe. Si ce n'est pas automatique, c'est un bouton qui promet ce que l'écran suivant ne tient pas (faute objective de la grille). | À vérifier avant validation |
| T2/01, C2/01 | « Voir la suite des vannes · 2,99 €/mois » | « Voir » promet l'affichage, l'écran suivant est une page de vente. | Moyenne |
| T2/01 | « Les 10 gratuites, c'est fait. » | Ambigu : 10 par liste, par jour, au total ? | Moyenne |
| T1/03 | « 10, 3 et 3 » | Sans unité, illisible. | Moyenne |
| T1/03 | « Carnet d'octobre · Situation 15, offerte » puis « Il en reste 14 » | La numérotation fait croire à une 15e situation sur davantage ; on comprend ensuite qu'il y en a 15 en tout. « Toutes les situations » (tableau) : celles du mois ou de tous les carnets ? | Faible à moyenne |
| T1/02 | « Premium ouvre tout Deviens Marrant » | Se lit d'abord comme une injonction (« Deviens marrant »). | Faible |
| T1/05 | « Te voilà connecté. » | Après une création de compte, on attend « Compte créé ». | Faible |
| T5/01 et T1/02 | « Une vanne décryptée, chaque mois. Gratuite » et « Un nouveau carnet de répartie chaque mois » | Deux promesses mensuelles proches, l'une gratuite, l'autre payante : le sceptique choisit la gratuite. | Moyenne |
| Partout | « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » | Intouchable, je ne la modifie pas. Questions qu'elle laisse : 14 jours à compter de quoi ? Vaut aussi pour l'annuel à 24,99 € ? À traiter dans la réponse de la FAQ « frais cachés », pas dans la phrase. | Faible |
| Carte « Annuel » | « 24,99 € TTC / an » | Renouvellement non dit. | Moyenne |

Rien de faux relevé dans les chiffres visibles : 2,99 €, 24,99 €, 2,08 €/mois, « plus de 3 mois offerts », « 1 500+ » sont cohérents entre eux et identiques sur toutes les captures. Aucune mention légale dans un bouton (« En créant ton compte, tu acceptes les CGU » est hors bouton). Aucun tiret cadratin vu dans les captures. Aucune promesse de résultat vue.
