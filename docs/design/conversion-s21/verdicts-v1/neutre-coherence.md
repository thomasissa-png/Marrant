# Verdict à l'aveugle, trajets v1 : relecteur neutre (cohérence)

Grille : `docs/ux/trajet-conversion-s21.md` §11 (seule partie lue). Matériel : `docs/design/conversion-s21/trajets-v1/`, 33 captures lues une par une (T1 à T5, C1, C2, desktop-1280). Stripe non capturé, comme annoncé.

## Réserves de protocole (à lever avant validation)

1. **Formats non conformes à la grille.** Le §11 demande des captures en 375 × 700 et en 320 × 640, avec une note sur le plus étroit des deux. Ici, tout est en 375 × 812. Les notes ci-dessous sont donc **provisoires**. À 320 × 640, le bouton « S'abonner · 2,99 €/mois » de /abonnement (aujourd'hui à y ≈ 605-655 sur 812) risque de passer sous la ligne de flottaison : titre sur 3 lignes, puces et carte « Annuel » plus longues.
2. **T3 : la carte « Étape 2 sur N » prévue par la grille n'apparaît pas** dans `T3/01-entree-clic.png`. On voit le quiz (réponses A à D, aucune cochée) puis le bouton. On ne voit ni que l'étape 1 est finie, ni le compteur.
3. **Chemin « Annuel » non capturé.** Aucune capture avec « Annuel » coché : on ne sait pas si le bouton devient « S'abonner · 24,99 €/an », ni si /register affiche toujours « Premium, 2,99 € TTC par mois ». C'est le risque d'incohérence de prix le plus probable du trajet (voir I-P1).

## Notes par trajet (sur 10)

| Trajet | 1. Clarté 3 s | 2. Promesse tenue | 3. Clics | 4. Envie | 5. Confiance | Moyenne |
|---|---|---|---|---|---|---|
| T1 En-tête | 9 | 8 | 9 | 7 | 9 | 8,4 |
| T2 Mur de liste | 9 | 8 | 9 | 8 | 9 | 8,6 |
| T3 Fin d'étape 1 | 9 | 9 | 9 | 8 | 8 | 8,6 |
| T4 Fenêtre Premium | 7 | 7 | 9 | 7 | 7 | 7,4 |
| T5 Fin d'article | 9 | 9 | 9 | 6 | 8 | 8,2 |
| C1 Connecté, en-tête | 9 | 10 | 10 | 7 | 10 | 9,2 |
| C2 Connecté, mur | 9 | 10 | 10 | 8 | 10 | 9,4 |

**Verdict global : 8/10** (moyenne T1 à T5 : 8,2). Le seuil du §11 (9 minimum sur chacun des 5 critères, pour chaque trajet T1 à T5) n'est **pas atteint** : 12 notes sur 25 sont sous 9. Les trajets connectés (C1, C2) sont presque au niveau. Les défauts se concentrent sur trois points : /register identique quelle que soit l'entrée, T4, et l'entrée de T5.

## Détail des notes sous 10, avec preuve et correction

### Sur toutes les captures de /abonnement (T1, T2, T5, C1, C2)

- **Clarté 9, pas 10** (`T1/02`, haut) : « Premium ouvre tout Deviens Marrant » se lit en deux temps (« Premium ouvre tout. Deviens marrant ? ») parce que le nom du site n'est pas typographiquement distinct. Le sous-titre ne nomme que les vannes et les parcours. La ligne « Listes : vannes, conseils, vidéos, 10, 3 et 3 » (`T1/03`, tableau, 1re ligne) est cryptique.
  - Correction : écrire le nom comme dans le logo (« Premium ouvre tout deviens-marrant.fr ») ou le passer en ligne propre. Dans le tableau, écrire « 10 vannes, 3 conseils, 3 vidéos » au lieu de « 10, 3 et 3 ».
- **Envie 7 (T1, C1), 8 (T2, C2)** (`T1/03`) : tout le premier écran décrit le catalogue (3 puces). Le seul bénéfice vécu de la page, l'exemple du carnet (« Donne-moi la nuit. Demain, je t'envoie un message magnifique. »), arrive après le tableau, à environ 1 500 px du haut. Le §11 veut le bénéfice avant la description.
  - Correction : placer le bloc « Le carnet, en vrai » avant « Gratuit et Premium, côte à côte ». Le tableau devient la preuve, l'exemple devient l'envie. T2 et C2 gagnent un point grâce à l'accroche « Pour la suite des vannes » et à la ligne « Listes » mise en avant.
- **Mise en page** (`T1/02`, carte Mensuel) : la case « Mensuel » a un vide d'environ 50 px sous « TTC / mois », parce qu'elle est alignée sur la hauteur de la case « Annuel ». Elle a l'air inachevée. Correction : centrer verticalement le contenu des deux cases, ou réduire leur hauteur commune.

### T1 En-tête

- **Promesse 8** : pas de rupture entre l'en-tête et /abonnement, puisque le bouton « Premium » est repris dans le titre. Il y en a deux, plus petites, ensuite :
  - `T1/04` : le titre « Ton compte » ne reprend pas le verbe « S'abonner ». L'enchaînement est quand même annoncé par « Tu crées ton compte, puis tu paies par carte », donc -1 seulement.
  - `T1/05` : « Te voilà connecté. » alors que la personne vient de **créer** un compte, pas de se connecter (-1).
  - Correction : sur `05`, écrire « Ton compte est créé. » au-dessus de « On t'emmène au paiement… ».
- **Clics 9** : on compte 3 écrans, plus une page d'attente pleine (`T1/05`), avec en-tête et pied de page, sans aucune interaction. Les comptes connectés ont un meilleur geste : le bouton passe à « On t'emmène au paiement… » (`C1/04`). Correction : pour le visiteur, reprendre ce même état sur le bouton de /register au lieu de charger une page. On gagne un écran, et le geste est le même pour tous.
- **Confiance 9** : le visiteur ne voit jamais le nom du prestataire de paiement avant la redirection. Le connecté, lui, voit « Paiement sécurisé par Stripe » (`C1/02`). Arriver sur un autre domaine sans l'avoir lu est une surprise. Correction : sur /abonnement (`T1/02`, sous le bouton), écrire « Tu crées ton compte, puis tu paies par carte sur Stripe. ». Sur /register (`T1/04`), ajouter « Paiement sécurisé par Stripe », comme chez le connecté, mais à la place du lien « Tester l'étape 1 de Répartie, gratuite » plutôt qu'en plus (voir T2).

### T2 Mur de liste

- **Promesse 8** : l'écho est bon entre le mur et /abonnement : « Voir la suite des vannes » devient l'accroche « Pour la suite des vannes », et la ligne « Listes » est mise en avant (`T2/02`, `T2/03`). Il casse à /register (`T2/04`), qui est mot pour mot celui de T1 : plus aucune trace des vannes (-1). Le mur (`T2/01`) et /register proposent tous deux une sortie « Tester l'étape 1 de Répartie, gratuite ». La personne voulait des vannes, on lui propose un parcours : le sujet change (-1).
  - Correction : sur /register, appliquer le même principe qu'en T3 : « Premium, 2,99 € TTC par mois. Après le paiement, la suite des vannes s'ouvre. ». Retirer le lien « Tester l'étape 1… » de /register sur toutes les entrées : T3 l'a déjà retiré, et c'est la page où la personne est la plus proche de payer.
- **Clics 9, Confiance 9** : mêmes causes qu'en T1 (page d'attente pleine, Stripe jamais nommé au visiteur).
- **Envie 8** : le mur est le meilleur moment du site (« Les 10 gratuites, c'est fait. Encore des vannes à ressortir »). Mais /abonnement repart sur « Premium ouvre tout » et sur les parcours avant de reparler de vannes. Correction : l'accroche suffit, et il ne faut pas réécrire le titre. Si le bloc carnet remonte (voir plus haut), on gagne le point.
- **Mise en page** (`T2/01`) : sous le bouton, la ligne de garantie est alignée à gauche, alors qu'elle est centrée sur /abonnement, sur /register, en T3 et en T4. Correction : la centrer.

### T3 Fin d'étape 1

- **Promesse 9** : c'est le meilleur écho de tout le lot. « Passer à l'étape 2 » devient « Après le paiement, l'étape 2 de Répartie s'ouvre. » (`T3/04`). Il reste -1 pour « Te voilà connecté. » (`T3/05`), comme en T1.
- **Clics 9** : page d'attente, comme en T1.
- **Envie 8** (`T3/01`) : le bouton ne nomme pas ce qui s'ouvre. Juste dessous, les étapes verrouillées ont pourtant des noms qui donnent envie (« Le rythme et les silences », « Retourner les piques avec le sourire »). Le « +75 XP » est du jargon de jeu qui n'aide pas à payer. Correction : sur /register, nommer l'étape (« Après le paiement, l'étape 2, Le rythme et les silences, s'ouvre. »), si c'est bien l'étape 2. Ne pas toucher au bouton.
- **Confiance 8** : deux points.
  - La carte (`T3/01`) n'annonce pas qu'il faudra créer un compte. Le visiteur découvre « Ton compte » à l'écran suivant, alors que /abonnement l'annonce (-1). Correction : sous le bouton, avant la garantie, ajouter « Tu crées ton compte, puis tu paies par carte. », la phrase déjà utilisée sur /abonnement.
  - Ce trajet n'offre pas l'annuel à 24,99 €. Celui qui le découvre plus tard sur /abonnement peut se sentir moins bien traité. Ce n'est pas une faute, c'est une incohérence d'offre à arbitrer (voir « Décisions »).

### T4 Fenêtre Premium

- **Clarté 7** (`T4/02`) : la fenêtre dit « Mets-la de côté », « 2,99 € TTC / mois » et « Je m'abonne et je la garde ». Le prix est clair. En revanche, on ne sait pas qu'on achète Premium : le mot n'apparaît que dans la ligne de garantie, en petit. On ne sait pas non plus que cela ouvre aussi tout le reste. C'est le seul point d'entrée qui vend 2,99 €/mois pour une seule fonction.
  - Correction : ajouter sous le titre une ligne : « Avec Premium, tes vannes préférées restent sous le coude, et tout le reste s'ouvre. ». Elle reprend l'intro de /vannes (`T4/01` : « Avec Premium, tu gardes tes préférées sous le coude »).
- **Promesse 7** : le contexte est perdu sur /register (`T4/04`). Rien ne parle de la vanne gardée, alors que T3 fait l'écho (-2). Le lien « Tester l'étape 1 de Répartie, gratuite » est hors sujet après un clic sur une vanne (-1).
  - Correction : « Premium, 2,99 € TTC par mois. Après le paiement, tes favoris s'ouvrent. ». Écrire « ta vanne est déjà gardée » seulement si le code l'enregistre vraiment après le paiement. Retirer aussi le lien Répartie (voir T2).
- **Clics 9** : page d'attente.
- **Envie 7** : garder une vanne est un petit désir pour un abonnement. Sans la ligne proposée sous Clarté, le prix pèse plus que le bénéfice.
- **Confiance 7** : il manque deux choses. La fenêtre n'annonce pas la création du compte (-1), et « Je m'abonne » sans le mot « Premium » laisse une question ouverte : « m'abonner à quoi ? » (-2). Corrections : la ligne proposée sous Clarté, plus « Tu crées ton compte, puis tu paies par carte. » sous le bouton, comme sur /abonnement.

### T5 Fin d'article

- **Promesse 9** : « Tout ouvrir » devient « Pour tout ouvrir », puis « Premium ouvre tout » (`T5/02`). L'écho est exact, et même redondant : on lit « ouvrir » puis « ouvre » à deux lignes d'écart. /register est générique (`T5/04`). Correction : retirer l'accroche « Pour tout ouvrir » pour cette source, puisque le titre fait déjà l'écho.
- **Clics 9** : page d'attente.
- **Envie 6** (`T5/01`) : le bloc de fin donne envie de s'entraîner gratuitement. Le titre « La vanne dans ta bouche, pas dans ton téléphone » mène au gros bouton « Tester mes premières répliques, gratuit ». « Tout ouvrir · 2,99 €/mois » n'est qu'un lien texte sous « Sans compte. ». Juste après vient un 3e appel, le formulaire « Envoie-moi la lettre ». Trois gestes se disputent l'écran, et le geste payant est le plus faible. « Tout ouvrir » ne dit pas non plus ce qui s'ouvre par rapport à l'article qu'on vient de lire.
  - Correction : décider dans ce bloc qui est le geste principal. Si c'est le payant, il devient un bouton plein et le gratuit un lien. Si c'est le gratuit, la note d'envie de T5 restera sous 9 par construction, et il faut l'accepter. Dans les deux cas, éloigner le formulaire de la lettre d'au moins un écran.
- **Confiance 8** (`T5/01`) : c'est le seul point d'entrée payant sans la ligne de garantie dessous. T2, T3 et T4 l'ont. Correction : ajouter sous « Tout ouvrir · 2,99 €/mois » la phrase intouchable « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. ».

### C1 et C2 (comptes connectés)

- **Clarté 9 et Envie 7 (C1) ou 8 (C2)** : mêmes causes que sur /abonnement visiteur.
- Le reste est à 10. Le bouton passe à « On t'emmène au paiement… » sur place (`C1/04`, `C2/04`), « Paiement sécurisé par Stripe » remplace la ligne sur le compte, et le bloc « Pas encore sûr ? » disparaît (`C1/03`). C'est le modèle à reprendre pour le visiteur.

### Desktop 1280

- `desktop-1280/abonnement-premier-ecran.png` : la carte fait environ 770 px de large pour 3 puces courtes. Les cases Mensuel et Annuel ont plus de 200 px de vide à droite du prix. Correction : limiter la carte à environ 560 px.
- L'en-tête dit « Connexion », la page dit « Connecte-toi » (voir I-V4).

## Top 5 des défauts les plus coûteux

1. **/register est le même écran quelle que soit l'entrée (T1, T2, T4, T5).** Seul T3 rappelle ce que la personne achète. Le contexte se perd au moment de taper son e-mail. Correction : une phrase « Après le paiement, … s'ouvre. » par source (vannes, favoris, tout).
2. **T4 vend 2,99 €/mois pour « garder une vanne », sans dire « Premium » ni ce que ça ouvre d'autre** (`T4/02`). Clarté, envie et confiance sont toutes à 7.
3. **Fin d'article T5 : le geste payant est un lien texte noyé entre un gros bouton gratuit et un formulaire de lettre** (`T5/01`), sans ligne de garantie. Envie à 6.
4. **Sur /abonnement, le bénéfice vécu (exemple du carnet) arrive après le tableau.** Le premier écran ne fait que décrire (`T1/03`). L'envie reste à 7-8 sur 4 trajets.
5. **Le visiteur passe par une page d'attente pleine intitulée « Te voilà connecté. »** (`T1/05`, `T2/05`, `T3/05`, `T4/05`, `T5/05`) : un écran de plus, un mot faux (« connecté » au lieu de « compte créé »), et le prestataire de paiement jamais nommé, alors que le connecté a un bouton sur place et « Paiement sécurisé par Stripe ».

À traiter avant toute note définitive : refaire les captures en 375 × 700 et 320 × 640, et capturer le chemin « Annuel » (réserves 1 et 3).

## Incohérences (liste séparée)

### Verbes (un même geste, plusieurs verbes)

| # | Où | Constat | Correction |
|---|---|---|---|
| I-V1 | Boutons payants d'entrée | « Voir la suite des vannes », « Passer à l'étape 2 », « Tout ouvrir » (infinitifs) ; « Je m'abonne et je la garde » (1re personne, `T4/02`) ; « S'abonner » (/abonnement). Le verbe propre à chaque contexte est justifié par l'écho. La personne grammaticale ne l'est pas. | Aligner T4 sur l'infinitif : « S'abonner et la garder ». Le prix est déjà affiché en gros au-dessus. |
| I-V2 | Sortie gratuite | « Tester l'étape 1 de Répartie, gratuite » (`T1/03`, `T2/01`, /register) contre « Tester mes premières répliques, gratuit » (`T5/01`). Si c'est la même destination, c'est le même geste avec deux libellés, et l'accord change (« gratuite » ou « gratuit »). | Choisir un seul libellé si la destination est la même. Sinon, laisser tel quel. À vérifier dans le code. |
| I-V3 | Fin de création de compte | « Créer mon compte et passer au paiement » (bouton) est suivi de « Te voilà connecté. » (`05`). | « Ton compte est créé. » |
| I-V4 | Connexion | « Connexion » (en-tête desktop) contre « Connecte-toi » (/abonnement, /register). | Garder « Connexion » dans la navigation et « Connecte-toi » dans le texte : c'est acceptable. Ne pas créer de 3e forme. |

### Libellés

| # | Où | Constat | Correction |
|---|---|---|---|
| I-L1 | /abonnement | La puce dit « Tout le catalogue : vannes, conseils, vidéos », le tableau dit « Listes : vannes, conseils, vidéos ». C'est le même objet sous deux noms. | Choisir un seul mot. « Listes » colle au sous-titre (« Les listes ne s'arrêtent plus… ») et au mur. |
| I-L2 | /conseils (`T1/01`) contre le tableau (`T1/03`) | La page /conseils promet « Chaque conseil vient avec un exemple concret et un défi à tester aujourd'hui » et chaque carte « Clique pour l'exemple et le défi ». Le tableau dit « Exercices des fiches : Non » en gratuit. Si « défi » et « exercice » désignent la même chose, l'un des deux est faux. **C'est un garde-fou « fait faux » potentiel.** | À vérifier dans le code. Si le défi est gratuit, renommer la ligne du tableau pour qu'elle désigne seulement ce qui est réservé. Si le défi est Premium, corriger l'intro de /conseils. |
| I-L3 | En-tête contre cible | L'index parle de « cœur », l'écran montre une étoile (`T4/01`). Ce n'est pas un défaut pour l'utilisateur, seulement pour les documents internes. | Dire « étoile » dans les docs. |
| I-L4 | Résiliation | « Résiliable depuis ton profil » (près de chaque bouton) contre « Résilier ton contrat » (pied de page). Deux chemins sont suggérés. | Aucune correction de texte, puisque la phrase est intouchable. Vérifier que les deux mènent au même endroit. |

### Prix

| # | Où | Constat | Correction |
|---|---|---|---|
| I-P1 | Annuel contre /register | /register affiche toujours « Premium, 2,99 € TTC par mois ». Si « Annuel » est coché sur /abonnement et que ce texte ne change pas, la personne voit un prix différent de celui qu'elle a choisi. **Non capturé.** | Capturer le chemin, et faire afficher « Premium, 24,99 € TTC par an » le cas échéant. |
| I-P2 | Formats | « 2,99 €/mois » (boutons), « 2,99 € TTC / mois » (fenêtre T4), « 2,99 € TTC par mois » (/register), « TTC / mois » (carte), « 24,99 € TTC / an ». On compte 3 graphies. | Garder « /mois » dans les boutons, et une seule graphie ailleurs : « 2,99 € TTC par mois ». |
| I-P3 | Offre selon l'entrée | L'annuel (24,99 €) n'est proposé que via /abonnement. T3 et T4 n'offrent que le mensuel. | Décision fondateur (voir plus bas). |
| Contrôle | Calculs | « soit 2,08 € par mois » : 24,99 / 12 = 2,0825, donc juste. « plus de 3 mois offerts » : 12 × 2,99 = 35,88, et 35,88 − 24,99 = 10,89, soit 3,6 mois, donc juste. « Il en reste 14 » avec « situation 15, offerte » et « 1 situation » en gratuit : cohérent. « 1 500+ » est identique partout. | Rien. |

### Répétitions

| # | Où | Constat | Verdict |
|---|---|---|---|
| I-R1 | /abonnement | La garantie et « Tu crées ton compte, puis tu paies par carte. » apparaissent 2 fois, sous chacun des deux boutons. | Acceptable : garantie près de chaque bouton, comme le veut la grille. |
| I-R2 | T2 de bout en bout | La garantie est lue 4 fois (mur, /abonnement × 2, /register). | Acceptable, puisque la phrase est intouchable. Ne rien ajouter de plus. |
| I-R3 | T5 | On lit « Tout ouvrir », puis « Pour tout ouvrir », puis « Premium ouvre tout ». | Retirer l'accroche pour cette source. |
| I-R4 | Page d'attente (`05`) | Le logo apparaît deux fois (en-tête, pied de page). Le pied de page occupe le dernier tiers d'une page de transition. | Supprimer la page (voir Top 5, n°5) ou masquer le pied de page. |

## Décisions à confirmer par l'utilisateur

- Fin d'article (T5) : le geste principal est-il le gratuit ou le payant ? Tant que c'est le gratuit, l'envie de T5 ne passera pas 9.
- Faut-il proposer l'annuel sur les entrées directes T3 et T4, ou est-ce volontaire ?
- Garde-fou à trancher en priorité : le « défi » de /conseils (I-L2) est-il gratuit ou réservé ?

