# Tour 2 : relecture à l'aveugle de l'architecture de contenu v2 (@elon)

> AVIS CONSULTATIF, validation requise avant exécution. Relecteur indépendant, sans accès aux autres avis du tour 2.
> Document noté : `architecture-contenu-v2.md` (V2), avec `inventaire-cartographie-s24.md` (INV) comme base de faits. Même grille C1 à C10 qu'au tour 1.
> Vérifications faites pour ce tour : `lib/progression.ts` l. 114 (`RETOURS_EXERCICE` : les 3 valeurs fermées existent), `parcours-seed.json` l. 84 (le faux secret « je regarde ça » est bien dans le seed), `parcours-boulot-s19.json` l. 307 (DEBUTANT), `parcours-storytelling-s18.json` l. 94 (INTERMEDIAIRE), `founder-preferences.md` l. 37 (30 sur 333), l. 65 (2 sur 360), l. 74 (6e parcours Répartie à la roadmap). Zéro tiret cadratin dans V2 (vérifié).

## Verdict en une phrase

Grand saut : V2 n'est plus une bibliothèque, c'est un chemin plus un moteur, et presque toutes les décisions sont respectées et marquées. Il reste un problème de physique : **le moteur tombe en panne sèche à la semaine 3**. La rafale consomme environ 90 situations par mois, on en écrit 60, puis 10 par mois. Et elle entraîne à reconnaître une bonne réplique, pas à en sortir une sous pression, alors que c'est ça, la répartie. Ces deux défauts se corrigent sans contenu neuf.

## Notes

| # | Critère | T1 | T2 | Justification (passage cité) |
|---|---|---|---|---|
| C1 | Valeur persona | 6 | 8 | Le moteur existe (2.2 : rafale, révision, missions en 5 marches, retour en un clic) et la grille de 3 questions avec « Montre-la à l'équipe » répond au besoin de retour. Mais la rafale fait seulement choisir (« l'abonné choisit la réplique qui convient »), sans temps imparti ni réponse personnelle d'abord. Des lignes persona restent interchangeables : « Marc retrouve l'envie de jouer » (3.9), « Marc retrouve un cadre simple » (3.4), « Marc retrouve le plaisir de rire » (3.7). |
| C2 | Respect des décisions | 5 | 9 | Lettres exclusives (C6 A), promesse de temps posée (C2), « Mon profil » gardé, Q2 C retirée, options qui rouvrent une décision marquées. Seul écart : C4 B est marquée « rouvre le 07/10 » alors que la décision du 07/10 dit « streak compté sur la pratique » (D3), et une rafale est de la pratique. Le marquage est discutable (correction N9). |
| C3 | Zéro donnée inventée | 6 | 8 | Les chiffres viennent de INV §6 et les sources que j'ai vérifiées sont exactes. Restent : C7 A « Pour Yanis et Sophie, le rencard est une scène centrale », que `project-context.md` ne dit pas (N4) ; « lu par @reviewer et @elon » pour Boulot et Storytelling, alors que je n'avais lu que les 3 parcours de `parcours-seed.json` (le fait est juste, l'attribution non) ; « 10 neuves validées sur 19 après 5 tours » contre « en 6 tours » dans INV ; « 153 - 50 = 103 » (N8). |
| C4 | Rubriques claires | 6 | 8 | « Quoi répondre » se lit en une seconde, le doublon avec le carnet a disparu, « Mon profil » sort des 6 entrées. Mais l'onglet « Vocabulaire » de la variante 1 ouvre aussi « Comment c'est construit » et « Formules à détourner » : le nom ne dit pas ce qu'il y a derrière (N6). « Une porte unique par page » (6.1) est contredit par « Jeux, séances : Aujourd'hui (carte) et Plus » (6.3). |
| C5 | Ambition | 6 | 8 | Moteur, missions, paliers, rythme mensuel, mesure par type : on y est presque. Mais le moteur n'est pas dimensionné (N1) : « 3 par jour x 21 jours = 63 » sert de justification aux 60 situations, ce qui revient à prévoir l'épuisement à J21. |
| C6 | Cohérence | 5 | 7 | Trois chemins différents dans le même document : 4.1 met les séances au palier « dès la semaine 4 », 5.4 en semaine 3, et 4.3 les fait faire à Marc entre J2 et J6. 4.3 donne à Sophie « 15 min en cœur » comme un fait, alors que 5.2 n'arrive à 15 min que si C2 = A, qui n'est pas tranchée. En 7.3, les rattrapages et le bilan sont classés « barre humour : seulement les exemples » alors qu'ils contiennent des répliques (N7). |
| C7 | Faisabilité au niveau | 6 | 8 | Rendement sourcé, candidates par emplacement, point de contrôle après le lot 1, échantillon pour Thomas, vérificateur de citations en prérequis, sortie de secours après 4 tours sans convergence : solide. Il manque les répliques de « Quand ça tombe à plat » (8 x 3 = 24) et celles des bilans dans le calcul de capacité. |
| C8 | Questions à Thomas | 6 | 9 | Une seule liste, C1 à C8, 3 options, une reco, marquages présents. Défauts : C7 A s'appuie sur un fait de persona inventé ; C2 B « et la décision du 07/10 (inchangé) » est illisible ; reco de C4 discutable (N9). |
| C9 | Exemples au ton maison | 5 | 9 | Exemples tirés du carnet et du seed, avec source ; « Dans toutes les autres boulangeries, je suis irréprochable » et le faux secret tiennent la route ; les répliques à écrire sont laissées vides, comme il se doit. Seul point : « La sûre : Merci, je regarde encore un moment, je viens vous voir si j'ai une question » est une sortie polie sans trait d'humour, ce qui change le sens de « la sûre » par rapport aux lettres (N10). |
| C10 | Progression | 5 | 8 | Premier pas défini (4.2), paliers, « Tes 4 premières semaines », version avancée par type, sommet nommé (le toast de Boulot). Restent les trois chemins contradictoires (C6) et une rafale où la risquée n'est jamais la bonne réponse dans les exemples (N11) : l'abonné apprend à ne jamais prendre de risque, l'inverse du but. |

**Note globale : 8,2 / 10** (82 / 10 critères ; tour 1 : 5,6).

## Statut de mes corrections du tour 1

| # | Correction T1 | Statut | Commentaire |
|---|---|---|---|
| EL1 | Moteur d'entraînement répété | Mal traité (en partie) | Le mode existe (2.2, C3), c'est bien un mode et pas un type. Mais le chrono de 10 secondes que je demandais a disparu, la rafale ne fait que choisir, et le stock s'épuise à J21 : voir N1 et N2. |
| EL2 | Échelle d'exposition | OK | 5 marches, défis existants étiquetés, retour avec les valeurs déjà codées. Détail en N12. |
| EL3 | Retour sur sa réplique | OK | Grille de 3 questions + « Montre-la à l'équipe » (C5 B), sans stockage. Refuser l'enregistrement par défaut est la bonne décision (07/10). |
| EL4 | Lettres réservées | OK | Exclusives par défaut (C6 A). Mon délai de 3 mois devient une option marquée (C6 B) : raison valable, puisqu'il rouvre le 25/10. |
| EL5 | Promesse de temps | OK | C2, avec la notion de « cœur » et de « plus loin ». |
| EL6 | Découpage qui garde tout | OK | 5.2 liste les 6 blocs, la durée et le statut cœur ou plus loin. |
| EL7 | Doublon Situations / Carnet | OK | Le carnet devient le flux, `/carnet` est conservé. La validation du carnet (T3) est un prérequis à lever (annexe B) : à garder bloquant avant toute mise en ligne. |
| EL8 | Renommer les rubriques | OK, refus valable | « Quoi répondre », « Mon profil » et la pratique dans « Aujourd'hui » sont appliqués. Le refus de « Comprendre » se tient : « Vocabulaire » est le mot de Thomas. En revanche, ce refus crée un nouveau défaut (N6). |
| EL9 | Dé-scolariser | OK, refus valable | Libellés remplacés. « Vocabulaire » gardé pour la même raison, acceptée. |
| EL10 | Gradation alignée | OK | Petit détail en N13 : ce sont « les lettres au format A », pas « les 22 lettres ». |
| EL11 | « Fait » = geste | OK | 2.1, 5.2. |
| EL12 | Entrée de Yanis | OK | 5.4 et C8, sans 6e parcours dans la reco, avec la roadmap du 07/10 citée (vérifié, l. 74). |
| EL13 | Définir l'avancé | OK, refus valable | Une version avancée par type, un sommet nommé. Le refus d'une répartition chiffrée tient : « avancé » n'est pas une valeur du code et dépend de C8. |
| EL14 | Chiffres et dates | OK, sauf INV | V2 est propre. Ne pas modifier INV est un refus valable pour @creative-strategy, mais l'étape « sections de contenu » contient aussi INV, dont le corps contredit encore son §6 : voir N14. |
| EL15 | Une seule liste de questions | OK | C1 à C8. Défauts restants en N4 et N13. |
| EL16 | Rendement de production | OK, incomplet | 7.2 et 7.3 sont solides ; il manque les rattrapages et les bilans (N7). |
| EL17 | Exemples au niveau ou vides | OK | |
| EL18 | Lignes persona spécifiques | Mal traité | L'annexe A dit « Appliqué : une scène par persona dans chaque type ». Faux pour 3.4, 3.7, 3.8 et 3.9 (N5). |
| EL19 | Critères d'arrêt | OK | 7.6, seuil marqué [HYPOTHÈSE]. |
| EL20 | Widget | OK | 3.3, stocks séparés, rien ne passe au widget sans décision. |

Bilan sur 20 : 16 OK (dont 3 refus valables : EL8, EL9, EL13), 1 OK incomplet (EL16), 1 OK sauf INV (EL14), 2 mal traités (EL1, EL18), 0 non traité.

## Nouvelles corrections

Problème n°1 : N1 et N2. Ce sont les deux seuls défauts qui rendent le reste inutile : un moteur à sec, ou un moteur qui entraîne le mauvais muscle.

N1. **[BLOQUANT] Le moteur tombe à sec à la semaine 3 (2.2, 3.2, 3.3, 4.5).**
- Passages : « la rafale a besoin d'environ 60 situations pour ne pas se répéter pendant 3 semaines (3 par jour x 21 jours = 63) » ; « Les 60 neuves sont celles de la rafale ; les fiches du carnet restent en lecture » ; « une dizaine de situations à 3 répliques ajoutées à la rafale » chaque mois.
- Problème : un abonné régulier consomme environ 90 situations par mois [HYPOTHÈSE : 3 par jour x 30], et on en ajoute environ 10. À J21, l'alerte de stock de 4.5 se déclenche pour tous les abonnés réguliers, et ensuite la rafale n'a plus rien à servir. C'est un réservoir dimensionné pour 3 semaines sur une fusée qui doit voler 12 mois. Or la fenêtre clé du brief, c'est le premier renouvellement (J25 à J30) : on tombe en panne juste avant.
- Correction (sans écrire plus) : (a) **la répétition est le produit, pas un défaut** : chaque jour, 1 situation neuve + 2 révisions (J+2, J+7, puis J+21, J+60). 60 situations donnent alors environ 60 jours de nouveautés [HYPOTHÈSE], et un « déjà vu » est voulu ; (b) **les contextes multiplient le stock** : 2 contextes par situation font 120 cartes, 3 contextes en font 180 ; (c) **le carnet entre dans la rafale** : on ajoute des contextes aux 45 fiches (texte neuf relu à l'aveugle, texte du carnet intact, après levée de T3) ; (d) refaire le calcul consommation contre production dans un tableau en 3.2 et 4.5, et fixer le seuil de l'alerte sur ce calcul.

N2. **[BLOQUANT] La rafale entraîne la reconnaissance, pas la répartie (2.2).**
- Passage : « l'abonné choisit la réplique qui convient (la sûre, la joueuse ou la risquée), puis la règle s'affiche. »
- Problème : reconnaître la bonne réplique parmi trois n'est pas en sortir une en 3 secondes. C'est la différence entre un QCM de code de la route et conduire. Yanis échoue au moment où il faut produire, pas quand il faut choisir. Le chrono de 10 secondes demandé au tour 1 (EL1) a disparu ; il n'existe plus que dans une séance « aller plus loin ».
- Correction, à coût de contenu nul et sans stockage : chaque carte de rafale commence par **« Ta réponse d'abord »** : la scène s'affiche, l'abonné dit sa réplique à voix haute ou dans sa tête (comme le 7B de l'app, 04/11 : « Dans ta tête, ça compte aussi ») avec un compte à rebours visible de 10 secondes, désactivable [HYPOTHÈSE de durée, à l'étalon E5]. Ensuite seulement, les 3 répliques et le choix selon le contexte. Rien n'est enregistré à cette étape. Ajouter ce point à C3 A.

N3. **[BLOQUANT] Un seul chemin, pas trois (4.1, 4.3, 5.4).**
- Passages : séances au palier « Aller plus loin, dès la semaine 4 » (4.1) ; « Semaine 3 : une séance de 20 minutes » (5.4) ; Marc, « Jour 2 à 6 : [...] une séance de 20 minutes (« Dix chambrages, dix secondes ») » (4.3). Sophie : « étape 1 de Machine à Café (gratuite, 15 min en cœur) » (4.3), alors que 5.2 dit « environ 15 min si la vidéo 2 passe en "plus loin", environ 22 min sinon », et C2 n'est pas tranchée.
- Problème : un concepteur qui lit 4.3 et un autre qui lit 5.4 construiront deux produits. Pour Marc, en reconstruction, une séance de 20 minutes de chambrages dès J2 est la mauvaise première marche.
- Correction : 5.4 devient la seule source ; 4.1 et 4.3 en dérivent (même semaine pour la séance, et Marc fait la rafale et la marche 1 en semaine 1, comme les autres). Durées de 4.3 écrites « 15 min si C2 = A, 22 min sinon ».

N4. **[BLOQUANT] C7 A s'appuie sur un fait de persona inventé (8, C7).**
- Passage : « Pour Yanis et Sophie, le rencard est une scène centrale » ; C7 B : « on perd les scènes de Yanis et de Sophie ».
- Problème : `project-context.md` situe Yanis « en soirées, en coloc et avec ses potes », et Sophie à « la machine à café », en « afterwork » et aux « dîners entre amis ». Le rencard n'apparaît chez aucun des deux. Mon rapport du tour 1 (« drague, le cas de vie de Marc et de Yanis ») a nourri cette erreur : il fallait l'écrire [HYPOTHÈSE], je corrige.
- Correction : le vrai argument est sourcé et plus fort. L'option B exclut SOIREES, qui est le terrain écrit de Yanis. Réécrire C7 A et C7 B sur ce fait ; rencard et couple marqués [HYPOTHÈSE : plausibles pour Marc, récemment séparé, et pour Yanis ; non écrits dans les personas].

N5. **[BLOQUANT] Lignes persona encore génériques, et annexe A inexacte (3.4, 3.7, 3.8, 3.9).**
- Passages : « Marc retrouve un cadre simple pour se lancer », « Marc retrouve le plaisir de rire avec une méthode », « Marc retrouve le droit de rater », « Marc retrouve l'envie de jouer », « Yanis s'entraîne dans sa chambre ».
- Problème : ces lignes s'appliquent à n'importe quel type et ne disent ni où, ni avec qui, ni quelle phrase. L'annexe A affirme le contraire (« Appliqué : une scène par persona dans chaque type »). Le modèle à suivre est déjà dans le document : la ligne de 3.3 (« quand son colocataire le chambre devant les autres »).
- Correction : une scène par persona et par type, au niveau de 3.3, et l'annexe A corrigée.

N6. **[BLOQUANT] L'onglet « Vocabulaire » ne dit pas ce qu'il contient (6.2, variante 1).**
- Passage : « Visible. Elle ouvre trois portes : Vocabulaire (les mots), Comment c'est construit, Formules à détourner ».
- Problème : Sophie veut « un gabarit pour sa vanne de pause café ». Elle ne cliquera jamais sur « Vocabulaire » pour le trouver. Le refus de renommer est valable (c'est le mot de Thomas), mais Thomas l'a dit pour les mots, pas pour les mécanismes.
- Correction, en gardant le mot de Thomas : soit l'écran d'entrée de l'onglet montre les 3 portes nommées en premier écran, sans défiler (à faire vérifier par @ux sur le rendu) ; soit une variante de libellé « Vocabulaire et mécanismes » est ajoutée au rendu de C1. Dans les deux cas, on le teste en 3 secondes sur le rendu, on ne l'affirme pas.

N7. **[BLOQUANT] Répliques oubliées dans la capacité (7.3).**
- Passage : « Comment c'est construit, Vocabulaire, Écouter, Rattrapage, Bilan, Séances [...] Barre humour : Seulement les exemples ».
- Problème : « Quand ça tombe à plat » contient 3 sorties par fiche (3.8 : « la sûre, la joueuse, la risquée »), soit 24 répliques, et les bilans contiennent des répliques à choisir. Règle d'or : elles passent la barre Alexa comme les autres.
- Correction : une ligne dédiée dans 7.3 (24 répliques de rattrapage + celles des bilans, avec leurs candidates et leurs tours).

N8. **[NON BLOQUANT] Arithmétique de 5.3.**
- Passage : « Neuves hors parcours (rubriques) | 153 - 50 = 103 ».
- Problème : les 50 emplacements d'étape sont pris dans 60 situations et 12 fiches de construction. Si chaque étape reçoit une situation et une construction, les 12 constructions servent plus de deux fois : 50 emplacements ne font pas 50 fiches distinctes, et 103 est faux.
- Correction : compter les fiches distinctes rattachées et recalculer.

N9. **[NON BLOQUANT] Avis sur C4.**
- Passage : C4 B « rouvre la décision du 07/10 (série comptée sur l'étape validée ou le quiz d'étape) ».
- Problème : la décision du 07/10 dit « streak compté sur la pratique » (D3). Une rafale terminée, c'est de la pratique : B applique la décision, il ne la rouvre pas forcément. Et une série de « jours d'affilée » qui ne compte que des étapes conseillées tous les 7 jours a du mal à dépasser quelques jours [À VÉRIFIER dans `lib/progression.ts`].
- Correction : marquer B « précise la décision du 07/10 » plutôt que « rouvre ». Mon avis, si c'était mon projet : reco B, parce que la série est le seul compteur qui suit l'habitude quotidienne et que la rafale est l'habitude quotidienne. Thomas tranche.

N10. **[NON BLOQUANT] Ce que veut dire « la sûre » (3.3).**
- Passage : « une fiche du carnet est une situation à deux répliques (« la joueuse » = sa réponse, « la sûre » = sa sortie polie, déjà écrites) ».
- Problème : dans l'exemple, la sûre est une sortie polie sans trait d'humour. Si, dans les lettres au format A, la sûre est une réplique légère, le même mot a deux sens chez le même abonné.
- Correction : relire 2 lettres au format A, écrire la définition des trois registres en une ligne chacun, et dire en clair si « la sûre » peut être sans vanne.

N11. **[NON BLOQUANT] La risquée doit parfois gagner (2.2, E1).**
- Passages : les deux contextes de l'exemple de rafale font gagner la joueuse et la sûre.
- Problème : si la risquée n'est jamais la bonne réponse, la rafale apprend à ne jamais prendre de risque : l'inverse de la progression vers « aller plus loin ».
- Correction : règle d'écriture des contextes, avec une seule bonne réponse défendable par contexte, et chaque registre qui gagne une part non nulle des cartes de la base [HYPOTHÈSE : environ un quart pour la risquée, à fixer à l'étalon E1].

N12. **[NON BLOQUANT] Missions qu'on peut tenter quand on veut (2.2).**
- Problème : une mission qui attend qu'un vendeur d'aspirateurs surgisse ne sera jamais tentée. Les marches 3 à 5 doivent pouvoir se provoquer dans la semaine.
- Correction : critère d'écriture « provocable cette semaine » (lancer la phrase, pas attendre qu'on nous la lance), sinon la mission se reformule.

N13. **[NON BLOQUANT] Détails factuels et de rédaction.**
- « lu par @reviewer et @elon » (1) : j'ai lu Machine à Café, Répartie et Confiance. Boulot DEBUTANT et Storytelling INTERMEDIAIRE sont vérifiés à ce tour (l. 307 et l. 94) : citer ces lignes comme source.
- « 10 neuves validées sur 19 après 5 tours » contre INV « en 6 tours » : aligner sur une seule source.
- C2 B : « et la décision du 07/10 (inchangé) » ne veut rien dire, à réécrire.
- « celle des 22 lettres approuvées » (3.1) devient « celle des lettres au format A ».
- « Où ? » liste « rencard », qui n'est pas un lieu : le passer dans « Pour quoi faire ? » ou renommer le filtre.
- 6.1 « une porte unique par page » contre jeux et séances dans « Aujourd'hui » ET « Plus » : écrire la règle réelle (une porte principale, des raccourcis).

N14. **[NON BLOQUANT pour V2, BLOQUANT pour l'étape] INV n'est pas aligné sur son propre §6.**
- Refuser de modifier INV est valable pour @creative-strategy. Mais l'étape « sections de contenu » comprend INV, dont le corps dit encore « 132 actives au 11/10 », « 708 lignes », « lettres (22 situations avec 3 répliques ») et « ≈ 45 ».
- Correction : @product-manager aligne le corps sur le §6, ou ajoute en tête « chiffres du corps remplacés par la section 6 » avec renvoi dans chaque cellule concernée. Sans ça, aucun relecteur ne peut mettre 10 en C3 sur l'étape.

---
**Handoff → session principale**
- Fichier : `docs/espace-client/audit-contenu/iterations/tour-2-elon.md` ; note 8,2/10 (T1 : 5,6). Sur mes 20 corrections du tour 1 : 16 OK (dont 3 refus valables), 2 incomplètes, 2 mal traitées (EL1, EL18).
- Top 3 : N1, le moteur à sec à J21 (3 situations par jour contre 10 ajoutées par mois : passer à 1 neuve + 2 révisions, multiplier les contextes, faire entrer le carnet) ; N2, la rafale entraîne à choisir et non à produire (« Ta réponse d'abord » en 10 s, sans stockage) ; N3 et N4, trois chemins contradictoires et un fait de persona inventé en C7.
- Ce sont des AVIS : Thomas décide.
---
