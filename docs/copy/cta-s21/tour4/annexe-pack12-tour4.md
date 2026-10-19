# Annexe tour 4, packs 1 et 2 (hors relecture : ne pas transmettre aux relecteurs aveugles)

Pack : `pack-12-tour4.md` (6 duels). Clés et sources : `cles-pack12-tour4.md`. Pas de nouvelle recherche de marché : tour de correction sur les 3 verdicts du tour 3 (`verdict-pack12-r1/r2/r3.md`) et les 7 corrections de Thomas. Critère unique : l'envie de payer (choix du 18/10, `docs/founder-preferences.md`). Garde-fous conservés : rien de faux, aucune promesse de résultat chiffrée ou garantie, zéro tiret cadratin (contrôle par recherche : aucun dans les 3 fichiers). Pas de commit.

## 1. Taux de changement par bloc (comptage manuel de mots A contre B, marge de quelques points, pas d'outil d'exécution)

| Bloc | Mots ajoutés dans A (part de A) | Mots retirés de B (part de B) | Ce qui change dans A |
|---|---|---|---|
| B1 | 34 sur 61 (≈ 55 %) | 14 sur 41 (≈ 35 %) | Situation montrée (rendez-vous au lieu de l'ascenseur), note `[S7]`. `[S1]`, `[S3]`, bouton intacts. |
| B2 | 44 sur 122 (≈ 35 %) | 29 sur 107 (≈ 27 %) | Phrase-scène (propre au bloc, sans « Imagine »), ordre et liste complète des 4 étapes, lien « les 5 parcours », `[S9]` (+ 2,08 €/mois). Surtitre, titre, bouton intacts. |
| B18 | 31 sur 88 (≈ 35 % ; ≈ 50 % du sous-titre) | 0 | Sous-titre : vanne d'exemple + « ce qui la fait marcher ». Formule « pour écrire la tienne » et mention de Premium conservées. Ligne repliée, titre, note intacts. |
| B3 | 6 sur 45 (≈ 13 %) | 12 sur 49 (≈ 25 %) | Peu de mots neufs mais la note est réordonnée en entier (gratuit d'abord), le prix en est retiré, le lien passe à « les 5 parcours ». Bouton intact. |
| B4 + B5 | 3 sur 80 (≈ 4 %) | 29 sur 106 (≈ 27 %) | `[S11]` de 71 mots et 5 phrases à 47 mots et 2 phrases ; « La table qui rit » et « sans compte, quiz compris » retirés ; `[S12]` réécrit ; titre « le » devient « ton » ; bouton plein « les 5 parcours ». Avantages, `[S13]`, bouton contour intacts. |
| B6 | 100 % (un libellé contre un autre) | 100 % | Voir §6. |

**Intouchables respectés** : prix (2,99 €, 24,99 €, 2,08 €, 10,89 €), « 1 500+ », `[S13]`, 4 avantages, hero de l'accueil, surtitre et titre de B2, titre du formulaire B18, ligne repliée B18 (jugée la meilleure), slugs et liens. B4 + B5 : A reste proche de B en mots parce que le titre est la phrase la plus désirable du pack et que les relecteurs ne demandaient que des coupes ; l'écart est dans le retrait (27 %), pas dans l'ajout.

## 2. Les 7 corrections de Thomas, appliquées

1. **Liens payants** : « Débloquer les 5 parcours, 2,99 €/mois » (B2 lien, B3 lien, B4 + B5 bouton plein). **Nombre dynamique** : `PARCOURS_COUNT`, gabarit `Débloquer les {PARCOURS_COUNT} parcours, 2,99 €/mois` (Storytelling et Boulot dépendent de `STORYTELLING_PUBLIE` et `BOULOT_PUBLIE`). Repli si le compte tombe à 1 ou 0 : « Débloquer tous les parcours ». Le prix du libellé vient de la même source que l'en-tête de prix.
2. **« La table qui rit »** : retirée de B2 et de B4 + B5 dans A, et « Imagine » aussi. Chaque bloc a sa scène : B1 le rendez-vous, B2 les 50 vannes lues et la bouche contre le téléphone, B3 le hero (machine à café, inchangé), B4 + B5 le « j'aurais dû dire / j'ai dit » du titre. B2 : `[S5']` dit « cinquante vannes » parce que l'article en compte cinquante ; si le bloc est repris sur un autre article, paramétrer `{N} vannes`. « Pas de ton téléphone » joue sur le mobile du lecteur ; sur ordinateur l'image reste lisible.
3. **B4 + B5** : `[S11]` en 2 phrases (phrase 1 : rythme + défi ; phrase 2 : correspondance parcours). « La première étape se lit sans compte, quiz compris » sort de `[S11]` : l'idée reste portée par le bouton contour « gratuit » et par l'avantage 1 (« première étape offerte »), et B3 la dit en entier. `[S12]` : « Ou 24,99 €/an (2,08 €/mois, 10,89 € économisés). Prix TTC. » (le TTC passe en fin de ligne, plus d'accroche sur « Prix TTC, ou »). Si `isAnnualPlanAvailable()` est faux : `[S12]` = « Prix TTC. ». Titre repris du relecteur 3 (« ton »), réserve de deux relecteurs sur le tic « Et si » : la question rachète le tic, repli prudent inchangé depuis le tour 3 : « Et si la bonne réplique arrivait enfin à temps ? ».
4. **B3** : note = « Ça se lit sans compte, quiz compris. » puis Premium, résiliation et garantie en une phrase, sans prix (le lien le donne). La formule de garantie est l'ordre inversé de `REASSURANCE_PAIEMENT` (mêmes mots : « Tu as 14 jours pour te faire rembourser ton premier paiement » / « tu résilies en ligne quand tu veux »). Le « Ça » désigne la première étape que le bouton vient de nommer.
5. **B18** : voir §4.
6. **B1** : voir §5.
7. **B6** : voir §6.

## 3. Framework, conscience, objections

| Bloc | Framework | Conscience | Objections traitées |
|---|---|---|---|
| B1 | Démonstration puis un pas (écart de curiosité : la réplique est cachée) | Problem-Aware faible | « Ça coûte ? » (gratuit, sans compte), « Premium, c'est quoi ? » (l'abonnement du site) |
| B2 | PAS léger : le problème est la seconde qui compte, la solution l'étape de 20 min | Problem-Aware vers Solution-Aware | « C'est quoi exactement ? » (4 étapes), « Je paie pour quoi ? » (les 5 parcours), « Et si ça ne me va pas ? » (14 jours, résiliation) |
| B18 | Valeur d'abord (une vraie vanne), petit engagement | Unaware vers Problem-Aware | « Encore un mail commercial ? » (mot sur Premium annoncé, gratuit, désinscription) |
| B3 | Essai gratuit puis offre | Problem-Aware | « Dois-je payer pour voir ? » (sans compte, quiz compris), « Et si je regrette ? » (résiliable, 14 jours) |
| B4 + B5 | PAS : titre = esprit de l'escalier, `[S11]` = solution concrète (défi, parcours par situation) | Solution-Aware vers Product-Aware | « Pourquoi payer après le gratuit ? » (défi + 5 parcours), « Est-ce pour moi ? » (correspondance), prix annuel |
| B6 | Transparence ou ancrage du prix | Unaware | « C'est payant ? » / « C'est combien ? » |

## 4. B18 : « un exercice en trois étapes pour écrire la tienne », vérifié dans les vrais numéros

Source : `.claude/worktrees/agent-a6072b0ac19da7774/apps/web/src/data/lettre/numeros.json`, numéros 1 à 6 relus (le fichier n'existe qu'en worktree : `apps/web/src/data/lettre/` est absent du dépôt principal).
- Les 6 numéros contiennent « À toi de jouer » en **3 étapes numérotées + un exemple écrit** (la vanne produite). Les consignes : n°1 « Écris deux phrases », n°2 mot à double sens et réponse avec aplomb, n°3 « Raconte en trois courtes phrases », n°4 contredire par un détail chiffré, n°5 montrer un comportement et réagir, n°6 détour le plus long possible.
- **Verdict : la formule est vraie sur le fond** (chaque exercice amène à composer sa propre vanne sur un modèle, avec un exemple écrit) ; au sens littéral, seuls les numéros 1 (« Écris ») et 3 (« Raconte ») emploient un verbe d'écriture. Je la garde (Thomas : « garde si vraie »). Si un relecteur ou @legal la juge trop large, repli exact : « un exercice en trois étapes pour fabriquer la tienne ». B porte donc la même formule que A, **sans correctif factuel**.
- « Une lecture à suivre » : vrai pour 6 numéros sur 6 (article du blog dans 1, 2, 4, 5 ; étape 1 gratuite d'un parcours dans 3 et 6). « Un article du blog » serait faux.
- **Vanne d'exemple de A** : « J'ai pris un chien pour me faire des amis. Il en a plein. Moi, je tiens la laisse. » (numéro 3, mot pour mot, statut VALIDE, envoi prévu le 07/01/2027). Idée du relecteur 1 (montrer une vraie vanne, seul levier d'envie pour un lecteur venu chercher des vannes) et du relecteur 3 (le corps ne citait plus la vanne). « Ça donne, par exemple » reste vrai quel que soit le numéro affiché. Pour @fullstack : à terme, afficher la **dernière vanne déjà envoyée** (jamais celle du prochain envoi) ; avant le premier envoi (05/11/2026), garder cette vanne validée. Si Thomas ne veut pas montrer un extrait avant l'envoi, retirer la première ligne : le reste du sous-titre est autonome.
- À corriger par @fullstack / Thomas (déjà signalé au tour 3) : les 6 numéros disent « sans engagement » dans la mention Premium (faux pour l'annuel) ; remplacer par « résiliable en ligne ». Désinscription en un clic : vérifier le mécanisme réel (lien du pied de message, `List-Unsubscribe-Post`).

## 5. B1 : la situation, et la règle d'affichage pour @fullstack

**Constat** : la situation offerte d'octobre n'est **pas un chambrage**. C'est la fiche `2026-10-01` « Le soleil dans l'ascenseur » (contexte `quotidien`, « Ça fait du bien ce soleil, hein ? ») : une banalité, ce que les relecteurs 2 et 3 ont noté. Ce n'est pas un hasard : le carnet est « rangé de la moins tendue à la plus tendue » (`intro`) et la fiche offerte est `fiches[0]`, donc la moins mordante par construction.

**Choix dans le vrai carnet** (`apps/web/src/data/carnet/2026-10.json`, 15 fiches lues) :
1. **`2026-10-15` « Le premier rendez-vous silencieux »** (contexte `couple`) : « Tu parles toujours aussi peu ? ». Une pique adressée au lecteur, sur son silence : c'est le « Tu restes muet quand on te chambre ? » de l'accueil, au sens littéral. Retenue pour A. Sa sortie polie (« Oui, je suis plutôt discret au début. Parle-moi de toi, j'ai envie de t'écouter. ») rend vraie et utile la mention « une sortie polie si ça se tend », que le relecteur 3 jugeait déplacée avec le soleil. Limite : contexte couple, l'article est en mode soirée (le pont est faible mais la fiche reste la plus reconnaissable pour le persona).
2. `2026-10-14` « La fois du mariage » (contexte `amis`) : « Allez, raconte-lui la fois du mariage ! ». Taquinerie de groupe, bien placée après la section soirée ; moins directe.
3. `2026-10-05` « Ton métier, concrètement » (contexte `soirée`) : « Et toi, tu fais quoi, concrètement ? ». Même contexte que la section, pique douce.
Rien n'est inventé : `[S2]` de A reformule la fiche 15 (« Premier rendez-vous… au dessert… troisième phrase de la soirée » + « Tu parles toujours aussi peu ? ») ; `[S3]` « Tu réponds quoi ? » est fixe.

**Conséquence honnête** : le Texte A de B1 n'est vrai (« Gratuit, sans compte ») que si la fiche montrée est la fiche offerte. Aujourd'hui l'offerte est la 01. **Règle d'affichage proposée** :
1. Ajouter un champ `offerte: true` (ou `vitrine`) sur **une** fiche du mois, posé à la génération ; `getCurrentCarnet()` renvoie cette fiche comme fiche gratuite à la place de `fiches[0]` (`CARNET_FREE_FICHES = 1` inchangé ; l'ordre d'affichage du carnet par tension reste le même).
2. Règle de génération : la fiche `offerte` est un **chambrage** (`onTeDit` = pique, taquinerie ou question gênante adressée au lecteur, formulée en phrase adressée à lui), idéalement de contexte `soirée`, `amis` ou `couple`. Octobre : passer la 15 en offerte (décision produit de Thomas : c'est elle qui devient lisible sans compte, la 01 passe dans Premium).
3. `[S2]` = champ `accroche` (≈ 110 caractères, ajouté au schéma et au prompt du carnet) construit comme « {contexte en une demi-phrase}. {détail}, et on te lance : « {onTeDit} » ». `[S1]` et `[S3]` fixes.
4. « Les autres situations, nouvelles chaque mois, sont dans Premium » : affiché seulement si le carnet compte plus d'une fiche. Pas de carnet ouvert ce mois-ci : pas d'encart.
5. Tant que la règle n'est pas en ligne, **seul le Texte B de B1 est publiable** (la fiche 01 est la fiche offerte d'octobre). Si Thomas refuse de changer la fiche offerte, A ne se publie pas.
Hauteur estimée de A : ≈ 330 px (limite 400).

## 6. B6 : « 2,99 €/mois » contre « Voir les prix », largeur

Méthode du tour 2 (§3 de `annexe-tour2.md`) : Inter 600 à 14 px, métriques de police estimées à la main, ±5 px, **aucun rendu (pas d'outil d'exécution dans cette session)**. Texte disponible à 360 px : ≈ 83 à 98 px ; référence « Commencer » ≈ 85 px.

| Libellé | Largeur estimée | Écart avec « Commencer » (≈ 85) | Écart avec le bas de la plage (83) |
|---|---|---|---|
| « Voir les prix » | ≈ 81 px (5,83 em) | − 4 px | − 2 px |
| « 2,99 €/mois » | ≈ 83 px (5,93 em : chiffres ≈ 0,64 em, virgule 0,27, espace 0,28, € 0,68, « / » 0,40, « mois » 2,38) | − 2 px | 0 px |

Les deux passent avec une marge faible ; « 2,99 €/mois » est le plus large de ≈ 2 px, dans l'incertitude de l'estimation. À mesurer au code à 360 et 375 px. Pour @fullstack : espace insécable (U+00A0) entre « 2,99 » et « € » pour éviter un retour à la ligne ; nom accessible commun aux deux : « Voir les prix de Premium » (le prix en chiffres n'y est pas lu seul) ; ne pas écrire « dès 2,99 € » (l'annuel revient à 2,08 € par mois). Test : `__tests__/layout/header.test.tsx` attend encore « Commencer » ; libellé aux trois endroits de `header.tsx` (l. 141, 171, 285) ; `header-budget` à étendre à 360 et 375 px. Si A gagne : test sur le trafic réel (`src=header`) contre « Voir les prix » avant de généraliser.

Honnêteté sur les chances : trois relecteurs ont noté « Voir les prix » 7 à 9 et estiment qu'un 10 est presque hors d'atteinte dans 12 caractères (le désir se joue sur la page d'arrivée, dont le premier écran devrait nommer les 5 parcours et la scène du titre B4 + B5). « 2,99 €/mois » est la piste proposée par deux relecteurs sur trois, avec la réserve « s'il se lit comme un bouton et pas comme une étiquette ».

## 7. Hauteurs et autres points @fullstack

- **B2** : A ≈ 470 px estimés (limite 560) : `[S5']` passe de 45 à 60 mots. Remplir `finTexte`, supprimer `finPuces` pour Répartie ; `[S9]` par `prixTtcLabel`, annuel et « 2,08 € par mois » seulement si `isAnnualPlanAvailable()` ; remplacer `TEXTES_BLOC_FIN.note` (« sans engagement »).
- **B3** : le bouton plein mène à l'étape 1 de Répartie, en lecture libre ; le lien à `/abonnement?src=accueil-cta`. Mesurer le premier écran à 360, 375, 390 px (note de 3 lignes environ, plus courte qu'avant).
- **B4 + B5** : la phrase de correspondance se construit depuis `PREMIUM_PARCOURS` ; le prix de l'en-tête et du bouton vient d'une seule source (format « 2,99 €/mois »). La carte est plus courte qu'avant (`[S11]` : 5 phrases à 2).
- **B18** : voir §4 (vanne d'exemple pilotée par donnée).

## 8. Ce qui reste fragile pour atteindre 10/10 chez les trois relecteurs

- **B6** : un 10 est improbable (plafond de largeur), les trois relecteurs l'ont écrit.
- **B3** : le relecteur 2 trouvait « les 5 parcours » prématuré pour un visiteur qui ne sait pas ce qu'est un parcours ; Thomas l'a demandé, je l'ai appliqué. Risque résiduel de « jargon ».
- **B4 + B5** : le tic « Et si » (2 relecteurs sur 3) et la liste de parcours dans `[S11]` peuvent coûter un point.
- **B1** : A dépend d'une décision produit (§5) ; sans elle, le meilleur publiable reste B, plafonné à 7 au tour 3.
- **Hors duel** : « Tu parles et personne rit. On va arranger ça. » (hero, inchangé) frôle la promesse de résultat et « personne rit » est écrit sans « ne » ; propositions de repli au tour 3, annexe §7. « 1 500+ membres » : non commenté. La description de Répartie dans le seed (« exercices progressifs pensés pour les timides ») est une promesse de résultat existante, non reprise.
- Pack 3 non traité.
