# Rendu Parcours Boulot, itération 2 : relecture @ux (s19, 11/10/2026)

**Boulot : 9/10. Non-régression des 4 parcours en ligne : 10/10 (sur ce qui est capturé, réserves en §5). Bloquants : 0. Suggestions : 9.**
Verdict : **GO au déploiement masqué** (`BOULOT_PUBLIE = false`). **GO à la publication sous conditions** (§6). Rien ne régresse.
Le 9 (et non 10) tient à deux critères du fondateur encore PARTIELS (« où j'en suis et quoi faire aujourd'hui », « version sans risque visible »), tous deux en attente de microcopy à valider, et à deux décisions de Thomas ouvertes (N5, N7). Ce ne sont pas des défauts de code. Avec ta définition stricte (10/10 = aucun bloquant, aucune régression), le seuil de déploiement est atteint.

Périmètre lu (regardé réellement avec Read) : 27 PNG Boulot sur 85 (375 : hub haut, carte, « Programme » déplié, page haut visiteur et Premium, étape 1 visiteur, quiz répondu, aperçu étape 3, étape 1 Premium, après validation, retour d'exercice, étape verrouillée, étapes 3 et 6, progression 2/6, erreur, fin et carte de fin ; 768 : étape 1, page haut visiteur et Premium, carte de fin ; 1280 : étape 1, page haut Premium, après validation, étape 6, « Programme ») et 19 PNG sur 52 de non-régression (hub 375 et 1280, les 4 cartes de fin en 375 et 2 en 1280, pages hautes, étapes 1 et 2, une fin de page). Lus aussi : `implementation.md` (« Rendu itération 2 »), `config/textes/parcours.ts`, `parcours-seed.ts`, `entrees-parcours.ts`, `parcours-boulot-s19.json` (défis), spec s17 §5.5. Les ~72 captures restantes (étapes 2, 4, 5 et variantes de largeur des mêmes états) reprennent les composants des étapes lues ; aucun contrôle automatique ne les signale (135 PASS et 120 PASS), mais je ne les ai pas regardées une à une. Les captures pleine page à 375 (5 000 à 6 000 px) sont réduites à la lecture : j'ai jugé le détail sur les captures d'élément.
Je ne touche à aucun code ni texte validé.

## 1. Statut de chaque point de l'itération 1

| Point | Statut | Preuve |
|---|---|---|
| **B1** étape 1 visiteur sans conseil, exemple, défi | **CORRIGÉ** | `visiteur-375-etape1`, `visiteur-768-etape1`, `visiteur-1280-etape1` : « Le conseil » + « Lire la fiche du conseil », « Exemple concret », « Exercice pratique » (DÉFI TRACE complet, repli « Pas de réunion en vue, ou elle se passe en visio ? » compris), « Alors, ce défi ? », vannes en encart Premium, 2 vidéos, quiz 1/3, bouton en contour. La promesse « chaque exercice a une version sans risque » est maintenant vérifiable par le visiteur. Correction 1 (appel API aussi pour le visiteur sur repli seed) : appliquée. Correction 3 (garde-fou de capture) : appliquée, 135 PASS dont `[html <w>]` JavaScript coupé. Correction 2 (purge ISR) : non appliquée, justification recevable (Cloudflare/OpenNext sans effet de `revalidatePath`) et rendue inutile par 1. |
| **N1** durée absente de l'en-tête | **CORRIGÉ** (tous parcours) | « 6 semaines · 15 min/semaine » sur `visiteur-375-page-haut`, `premium-375-page-haut`, `visiteur-768-page-haut`, `premium-1280-page-haut` ; aussi « 6 semaines · 20 min/semaine » sur Confiance, Storytelling, Répartie. Point médian propre, aucun retour à la ligne disgracieux. |
| **N2** pitch avant programme, rien ne dit « aujourd'hui, étape N » | **SCINDÉ** : N2a **CORRIGÉ**, N2b **NON CORRIGÉ** | N2a : `premium-375-page-haut-progression` (2 étapes validées) place la carte de progression et « Le programme » juste sous l'en-tête, l'argumentaire n'est plus au premier écran. N2b : la carte dit seulement « La prochaine étape t'attend. », sans numéro ni lien, et l'étape 3 est sous la ligne de flottaison (voir S1). Attendu : microcopy non codée par décision. |
| **N3** badge « Lecture libre » à l'abonné | **CORRIGÉ** | `premium-375-etape1` et `premium-1280-etape1` : « +50 XP » seul. Le visiteur le garde (`visiteur-375-etape1`), c'est voulu. |
| **N4** version sans risque noyée, défi tardif | **NON CORRIGÉ** | `premium-375-etape3`, `premium-375-retour-exercice` : le défi est un bloc continu, le repli en dernière phrase. Attendu : microcopy non codée. Règle de coupe à corriger, voir §4. |
| **N5** quiz d'orientation n'envoie pas vers Boulot, carte en dernier | **NON CORRIGÉ** (décision Thomas) | `visiteur-375-hub-haut`, `visiteur-375-hub`. Inchangé, à trancher. |
| **N6** barre pleine et carte de fin redondantes | **CORRIGÉ** | `premium-375-fin-parcours` : en-tête puis directement la carte « Parcours Boulot terminé ». |
| **N7** « Environ 20 min » étape 6 contre « 15 min/semaine » | **NON CORRIGÉ** (décision Thomas) | `premium-1280-etape6` : « Environ 20 min, hors vidéos : 10 min de lecture et de quiz, 10 min pour écrire ton toast ». Le détail 10 + 10 aide à lire le chiffre, mais l'écart reste. |
| **N8** états manquants | **CORRIGÉ** (3 sur 6 complets, 3 partiels) | Voir tableau ci-dessous. |

### Détail N8

| État demandé | Capture | Statut |
|---|---|---|
| Gain d'XP et date conseillée après validation | `premium-375-etape1-apres-validation`, `premium-1280-etape1-apres-validation` : « +50 XP gagnés ! », « Prochaine étape conseillée le dimanche 18 octobre. Tu peux y aller dès maintenant si tu veux. » (11/10 + 7 jours, juste) | Complet |
| Retour d'exercice choisi et réponse | `premium-375-retour-exercice` : bouton plein sur « Essayé, ça a marché », réponse « Bien joué. Garde cette phrase… » | Complet pour 1 des 3 choix (les deux autres : textes validés s17, pas de risque d'affichage différent) |
| Quiz visiteur répondu | `visiteur-375-etape1-quiz-repondu` : « 1 sur 3. Les explications sont là pour ça. », « Refaire le quiz », « Valider l'étape fait partie de Premium. », bouton | Partiel : la capture est le récapitulatif de fin. On ne voit pas les explications que la phrase promet (S6) |
| Étape verrouillée par l'ordre conseillé | `premium-375-etape2-ordre-conseille` : « Termine l'étape 1 pour débloquer » | Complet (S4 : double cadenas) |
| Erreur de chargement abonné | `premium-375-erreur-chargement` : « Ta progression est intacte. », « Réessayer » | Partiel : voir S3 |
| Page haute Premium avec progression 2/6 | `premium-375-page-haut-progression` | Partiel : état « date passée » seulement (« La prochaine étape t'attend. »). L'état « date future » n'est visible que dans la carte d'étape validée (S1) |

**Régressé : aucun point.**

## 2. Défauts nouveaux

### Bloquants : aucun.

### Suggestions (non bloquantes)

| # | Capture | Symptôme | Gravité | Correction proposée |
|---|---|---|---|---|
| S1 | `premium-375-page-haut-progression.png` | Abonné à l'étape 3 : « La prochaine étape t'attend. » ne dit pas laquelle, n'est pas cliquable, et l'étape 3 démarre juste sous le bas de l'écran (y 812). Le critère « quoi faire aujourd'hui » reste partiel (c'est N2b). | Moyenne | Sans aucun mot neuf : rendre la phrase validée `PROCHAINE_ETAPE_DISPONIBLE` cliquable vers `#etape-N` (ancre déjà gérée) et ajouter le numéro et le titre de l'étape en second plan (« Étape 3 : Le couloir : quinze secondes »). « Étape N » est déjà dans `etapeLibelle`. Voir §3 pour « aujourd'hui, étape N ». |
| S2 | `premium-375-page-haut-progression.png`, `premium-375-erreur-chargement.png` (en 768 et 1280 la phrase tient sur une ligne) | « 700 XP au total, dont 100 de bonus à la / dernière étape » est aligné à droite et coupé en deux lignes, avec « dernière étape » orphelin. Composant partagé (`totalXpTexte`), présent avant s19. | Faible | Aligner à gauche sous 640 px, ou `text-balance`. Gain pour les 5 parcours. |
| S3 | `premium-375-erreur-chargement.png` | Une zone vide d'environ 40 px au-dessus de l'alerte (la barre n'existe pas en erreur). La capture ne montre pas ce que voit l'abonné sous l'alerte : l'étape 1 est ouverte avec son contenu de repli. L'en-tête collant masque « Pour qui ? » (artefact de défilement). | Faible, à vérifier | Demander à @qa la même capture en pleine page. Vérifier qu'aucun « Voir l'offre Premium » ni « Lecture libre » n'apparaît à un abonné dans cet état. Retirer le vide en omettant le conteneur quand il n'y a que l'alerte. |
| S4 | `premium-375-etape2-ordre-conseille.png` | Deux cadenas dans la même ligne (gauche et droite). Redondant, et le bloc dit « Termine l'étape 1 » alors que rien n'est interdit à l'abonné de façon technique (ordre conseillé). | Faible | N'en garder qu'un (droite). Libellé validé, ne pas le changer. |
| S5 | `visiteur-375-etape1.png`, `premium-375-etape1.png` | Quand l'API relit la base, « Lire la fiche du conseil » apparaît après coup (le HTML de repli ne l'a pas). Décalage de mise en page d'une ligne sous le conseil. | Faible | Réserver la hauteur de la ligne dans le HTML de repli, ou afficher le lien dès le repli si l'identifiant du conseil y est connu [HYPOTHÈSE : à vérifier par @fullstack, le repli seed n'a pas d'identifiant de conseil]. |
| S6 | `visiteur-375-etape1-quiz-repondu.png` | « Les explications sont là pour ça » est vrai pendant les questions, mais l'état final n'en montre aucune. Sans capture d'une question répondue, la promesse n'est pas prouvée. | Faible | Ajouter une capture : une question répondue avec « Pas tout à fait » / « La bonne réponse : » et l'explication. |
| S7 | `regression/repartie-375-visiteur-etape1.png` contre `storytelling-375-visiteur-etape1.png` et `visiteur-375-etape1.png` | Le libellé « DÉFI X » est en gras sur Boulot et Storytelling, en normal sur Machine à Café, Répartie, Confiance. Décision @design assumée (« réservé à Storytelling et Boulot »), mais un abonné qui enchaîne les parcours verra deux styles. | Faible | Étendre le gras aux 5 parcours (typographique pur, aucun texte touché), ou assumer. Arbitrage @design. |
| S8 | Hors captures | L'intro du hub modifiée par 0441569 liste maintenant des noms de parcours après « chacun taillé pour une situation : ». Non vue en capture. | Très faible | Une capture du hub après 0441569, en 375, avec `BOULOT_PUBLIE` forcé à `true` : « 5 parcours ... Machine à Café, Répartie, Confiance, Storytelling et Boulot ». |
| S9 | `regression/` | Aucune capture 768 pour les 4 parcours en ligne, alors que 508cd96 touche `step-blocks` et les grilles. | Faible | Ajouter les 768 des pages hautes et étapes 1 à la prochaine passe de non-régression. |

## 3. Textes d'interface nouveaux : problème d'usage ?

Constat : « aujourd'hui, étape N », l'encadré « Version sans risque » et le lien « Aller au défi » **ne sont pas dans le rendu**. Ils figurent dans `implementation.md` comme « microcopy à valider avant code » et sont absents de `config/textes/parcours.ts`. Je les juge donc comme propositions, sur le texte et le comportement. Le ton reste à valider par Thomas.

**« aujourd'hui, étape N » : un risque d'usage réel, à encadrer.**
- La spec s17 §5.1 (règle 3) réserve « aujourd'hui » au jour même de la date conseillée. Après « Prochaine étape conseillée le dimanche 18 octobre », écrire « aujourd'hui, étape 3 » contredit la page et casse le rythme doux (D2).
- Règle d'affichage : cette ligne ne vit que dans l'état `PROCHAINE_ETAPE_DISPONIBLE` (date passée, jour même, reprise après 21 jours, étape 1 sans date). Dans l'état « date future », on garde `prochaineEtapeTexte(date)` tel quel.
- Formulations à proposer à Thomas (sans tiret cadratin) : « Aujourd'hui : étape 3, Le couloir : quinze secondes » ou « Étape 3 : c'est le moment, Le couloir : quinze secondes ». La seconde évite le mot « aujourd'hui » après une longue absence. Lien plein sur toute la ligne, cible d'au moins 44 px.
- À éviter : tout compteur de retard (P0 du 06/05), toute formule qui presse.

**Encadré « Version sans risque » : bon usage, mais ma règle de coupe de l'itération 1 est fausse pour 2 étapes sur 6.**
- J'avais écrit « première phrase qui commence par « Pas d… » et finit par « ? » », constant sur les étapes 1 à 4. Relu dans `parcours-boulot-s19.json` : l'étape 5 ouvre son repli par « Personne ne te le demande aujourd'hui ? » et l'étape 6 par « Aucun pot en vue ? ».
- **Règle corrigée** : couper au début de la dernière phrase interrogative du défi (chacun des 6 défis n'en contient qu'une, et c'est le repli : « Pas de réunion en vue, ou elle se passe en visio ? », « Pas de mail pro à envoyer aujourd'hui ? », « Pas de couloir aujourd'hui (…), ou pas envie de tenter devant n'importe qui ? », « Pas d'afterwork à venir ? », « Personne ne te le demande aujourd'hui ? », « Aucun pot en vue ? »). Garder le test existant « concaténation = texte d'origine ». Si le défi contient zéro ou plus d'un « ? », ne pas couper.
- Titre « Version sans risque » : cohérent avec la description validée du parcours. Pas de problème d'usage.
- Réserve : à l'étape 6 le repli pèse environ 90 mots (il porte les critères de réussite), plus long que sur les autres étapes. L'encadré reste utile, mais il sera plus lourd que le défi principal à 375 px. À accepter.

**Lien « Aller au défi » : utile, avec deux conditions.**
- Il sert le retour de l'abonné qui a déjà lu (le défi arrive après environ 2,5 écrans à 375, vu sur `premium-375-etape3` et `etape6`). Verbe d'action, court, pas de piège.
- Conditions : (1) `scroll-margin-top` d'au moins 72 px pour que l'en-tête collant ne masque pas le titre « Exercice pratique » ; (2) cible tactile d'au moins 44 px et focus visible, placé sous la ligne XP, pas dans l'en-tête de l'étape qui se replie au clic.
- Il ajoute une action à un écran qui en porte déjà beaucoup (fiches, retour d'exercice, quiz, validation) : acceptable car elle remplace du défilement, pas du contenu.

## 4. Fins de parcours : verdict sur la suite proposée (point soulevé par la QA)

**Verdict : conforme à la spec s17 §5.5 et acceptable. Aucune modification.**

| Fin de | Carte (captures) | Spec §5.5 (classement) | Conforme |
|---|---|---|---|
| Machine à Café | « Passer au parcours Storytelling » (`machine-a-cafe-375-premium-fin-carte`, `1280`) | `pro`, `storytelling`, `repartie`, `confiance` : Boulot est inactif donc sauté, premier restant = Storytelling | Oui |
| Répartie | Storytelling (`repartie-375-premium-fin-carte`) | `storytelling`, `confiance`, `machine-a-cafe`, `pro` | Oui |
| Confiance | Storytelling (`confiance-375-premium-fin-carte`) | `storytelling`, `machine-a-cafe`, `repartie`, `pro` | Oui (premier rang) |
| Storytelling | « Passer au parcours Machine à Café » (`storytelling-375-premium-fin-carte`, `1280`) | `machine-a-cafe`, `repartie`, `confiance`, `pro` | Oui |
| Boulot | « Passer au parcours Storytelling » (`premium-375-fin-parcours-carte`, `768`) | `storytelling`, `machine-a-cafe`, `repartie`, `confiance` | Oui |

Pourquoi c'est acceptable pour l'usage :
- Trois fins sur quatre mènent au même parcours, mais la spec le décide ainsi (Storytelling est le parcours « suite » de la plupart des personas : Sophie, Marc, Yanis) et il n'est proposé qu'à qui ne l'a pas fini. La phrase d'accroche est celle de la `personaTagline` de Storytelling (règle SU-07), identique sur trois cartes : c'est voulu, pas un oubli.
- Chaque carte garde un bouton plein, un seul, avec un nom de parcours qui ne se coupe pas (espace insécable). Aucune impasse.
- La logique pédagogique tient : Machine à Café finit sur « Raconter une anecdote qu'on écoute jusqu'au bout », ce qui prépare Storytelling ; Storytelling renvoie vers les vannes courtes de Machine à Café, avec une phrase écrite pour ce passage.

Quatre réserves, toutes hors défaut :
1. **La boucle Machine à Café, Storytelling, Machine à Café n'est évitée que par la règle « jamais un parcours déjà terminé » (SU-04).** Les captures n'ont qu'un parcours fini par compte : elles ne prouvent pas que Storytelling ne propose plus Machine à Café à quelqu'un qui vient de la finir. Je n'ai pas relu le code de `pickSuite`. À faire contrôler par @qa avec un compte ayant terminé Machine à Café puis Storytelling : la suite attendue est Répartie, pas Machine à Café.
2. **À la publication, les suites changent** : la fin de Machine à Café devra proposer **Boulot** (premier du classement spec, persona Sophie), pas Storytelling. Aucune capture ne couvre cet état (le script « non-régression » force Boulot à `false`). À capturer après activation locale : Machine à Café vers Boulot, Boulot vers Storytelling, les trois autres inchangées.
3. **Écart de classement connu** : Confiance garde Répartie avant Machine à Café (décision s17 COP-11 d, `parcours-storytelling-s18/implementation.md`), contre la spec (Machine à Café avant Répartie). Invisible tant qu'il n'y a qu'une suite affichée ; à reconsidérer si la suite secondaire (§5.5 point 3, « non faite : texte à écrire ») est ajoutée.
4. **Répartie vers Storytelling** sert moins Yanis (persona principal) que les autres : la spec le reconnaît (« Storytelling vaut 3 sur 5 pour lui »). Sans autre parcours pensé pour lui, c'est le meilleur candidat disponible ; le 6e parcours « Yanis » est déjà à la roadmap de la spec. Pas de correction à l'itération.

## 5. Non-régression des 4 parcours en ligne

**10/10 sur ce qui est capturé : aucune régression, aucun bloquant.** Réserves : 768 absent (S9) et ~33 captures sur 52 non regardées une à une.

Ce que j'ai vérifié, parcours par parcours (375 et 1280) :
- **Étape 1 visiteur** (`machine-a-cafe`, `repartie`, `confiance`, `storytelling`) : « Le conseil », exemple, « Exercice pratique », « Alors, ce défi ? », vannes en encart Premium, 2 vidéos, quiz, bouton en contour. Aucun bloc vide, aucun texte coupé, aucun « undefined ».
- **Étape 2 Premium** (Machine à Café, Storytelling) : défi, 5 vannes avec décryptage en gras, vidéos, quiz, « Termine le quiz pour valider cette étape ». Aucune étiquette « Lecture libre » (N3 respecté).
- **Pages hautes** : durée dans l'en-tête partout (N1), bandeau « Étape 1 offerte, étapes 2 à 6 avec Premium » ; Machine à Café affiche encore « étapes 2 à 3 » dans la capture (corrigé depuis par 0441569, non compté).
- **Cartes de fin** : 3 étapes et 325 XP, 4 étapes et 475 XP, 6 étapes et 800 XP : les totaux sont cohérents avec le hub (« 325, 475, 800, 800 XP à gagner »). Une seule carte, sans barre redondante (N6).
- **Hub** : 4 cartes, Boulot absent, « Programme » replié, intro « 4 parcours » (le texte d'intro qui oubliait Storytelling est corrigé depuis par 0441569, non compté).
- **Composants communs** (`fr-typo`, `text-pretty`, aperçus 2+ alignés sur la scène, `lignesExemple`, `decouperDefi`) : aucun effet de bord observable sur les 3 parcours dont le contenu n'a pas de conseil dans le seed. Les changements typographiques sont discrets et bénéfiques (pas de « à » orphelin en fin de ligne).
- **Seul écart visuel entre parcours** : S7 (libellé « DÉFI X » en gras sur 2 parcours seulement). Décision @design, pas une régression.

Hors périmètre UX, à passer à @seo ou @fullstack : pour Machine à Café, Répartie et Confiance, un build sans base laisse le HTML de repli sans conseil (le visiteur le voit après l'appel API, un robot sans JavaScript non). C'était déjà le cas avant 508cd96 ; Storytelling et Boulot n'ont plus ce défaut.

## 6. Conditions de publication (pas de déploiement masqué)

| # | Condition | Qui |
|---|---|---|
| 1 | Décision N5 : le quiz « Au boulot, en réunion, à la pause » reste sur Machine à Café, ou envoie vers Boulot, ou badge « Nouveau » | Thomas |
| 2 | Décision N7 : « Environ 20 min » (étape 6) contre « 15 min/semaine » (par exemple « 15 à 20 min/semaine » sur la carte et l'en-tête de Boulot seulement) | Thomas |
| 3 | Microcopy N2b et N4 (§3) : valider ou publier sans. Le parcours ne casse rien sans eux ; il perd en lisibilité pour l'abonné qui revient | Thomas, puis @fullstack |
| 4 | Captures d'activation : fins de parcours avec Boulot publié (§4 réserve 2), hub avec l'intro à 5 noms (S8), cas Machine à Café puis Storytelling (§4 réserve 1) | @qa |
| 5 | Visionnage des 10 vidéos et revue des descriptions de `m30qZa8p_Js` et `qdqIc-uzdbA` (déjà signalé dans `implementation.md`) | Thomas |

## 7. Audit heuristique Nielsen 10 (parcours Premium et visiteur, rendu itération 2)

| # | Heuristique | Verdict | Évidence |
|---|---|---|---|
| H1 | Visibilité de l'état | PASS | Barre 2/6, « +50 XP gagnés ! », date conseillée, badge « Lecture libre » réservé au visiteur, « Termine le quiz pour valider cette étape ». |
| H2 | Vocabulaire du persona | PASS | « vanne », « pot de départ », « afterwork », tutoiement ; pas de jargon d'apprentissage. |
| H3 | Contrôle et annulation | PASS | Étapes dépliables, quiz refaisable (« Refaire le quiz »), retour d'exercice modifiable, aucun blocage dur par la date. |
| H4 | Cohérence | PASS avec réserve | Même squelette sur 5 parcours ; S7 (gras du libellé de défi). |
| H5 | Prévention d'erreurs | PASS | Bouton de validation en contour tant que le quiz n'est pas fini ; ordre conseillé annoncé. |
| H6 | Reconnaissance plutôt que rappel | PARTIEL | « La prochaine étape t'attend. » ne nomme pas l'étape (S1). |
| H7 | Raccourcis experts | PARTIEL | Pas de lien vers le défi (« Aller au défi » proposé, §3). Ancres `#etape-N` OK. |
| H8 | Minimalisme | PASS | Colonne unique de 768 px, un seul bouton plein par état ; le bloc « Programme » du hub déplié est long (4 000 px à 375) mais replié par défaut. |
| H9 | Messages d'erreur humains avec solution | PASS | « Ta progression est intacte. » + « Réessayer » (S3 pour l'état sous l'alerte). |
| H10 | Aide dans le flux | PASS | « Pourquoi cette étape ? », exemple concret, repli solo dans chaque défi, explications du quiz. |

### Cognitive walkthrough (first-time user : Sophie, arrive de Google sur `/parcours/boulot`, mobile 375)

| Étape | Sait-elle quoi faire ? | Résultat |
|---|---|---|
| Arrivée | Titre, niveau, « 6 semaines · 15 min/semaine », promesse, « Pour qui ? » lisibles sans défiler | OUI |
| Lecture de l'étape 1 | Conseil, exemple, défi complets, aucune demande de compte | OUI |
| Défi | « Alors, ce défi ? » en 3 boutons de 44 px, réponse immédiate | OUI |
| Quiz | 4 réponses de 44 px, résultat et explications | OUI |
| Passage à l'offre | Un seul bouton plein, prix et « sans engagement » dessous | OUI |
| Retour d'une abonnée à l'étape 4 | [FRICTION H6] : à l'étape « retrouver où j'en suis », la lectrice voit « La prochaine étape t'attend. » sans numéro ni lien et doit défiler pour trouver l'étape. Solution : S1. |
| Étape 6 | [FRICTION H3] : un défi de plus de 250 mots dont le repli est la dernière phrase. Solution : encadré « Version sans risque » (§3, règle corrigée). |

### HEART (alimente `kpi-framework.md` via @data-analyst)

| Dimension | Signal observable | Cible | Mesure |
|---|---|---|---|
| Task success | Étape 1 lue puis quiz terminé par le visiteur | au moins 60 % des visiteurs qui ouvrent l'étape 1 | événements `etape-ouverte`, `quiz-termine` (spec s17) |
| Adoption | Clic « Voir l'offre Premium » depuis l'étape 1 ou un aperçu | à suivre dès 30 cas (un taux n'a pas de sens plus tôt, audit s17) | `parcours-ouvert`, `mur-vu` |
| Engagement | Retour d'exercice noté par étape | à suivre, pas de cible inventée | `etape-retour` |
| Retention | Étape N+1 validée dans les 14 jours de la date conseillée | à suivre, pas de cible inventée | `etape-ouverte` avec `conseillee` |
| Task success (fin) | Clic sur la suite de fin | complétion des parcours critiques au moins 90 % (défaut) ; suite : à suivre | `suite-clic`, `parcours-termine` |

Charge cognitive : au plus 3 actions principales par état (lire, essayer le défi, valider), les fiches et le quiz étant secondaires. Edge cases couverts par les captures : verrouillé, validé, quiz répondu, erreur, fin. Non capturés : connexion lente, retour après 30 jours (spec RD-07, reprise douce testée côté code, pas en capture), « bof » et « pas encore essayé ».

## Handoff

---
**Handoff → @orchestrator (puis @fullstack, @qa, @design selon les lignes)**
- Fichier produit : `/home/user/Marrant/docs/marrant/parcours-boulot-s19/iterations/rendu-iter-2-ux.md`
- Notes : Boulot **9/10** (0 bloquant, 9 suggestions) ; non-régression **10/10** (0 régression).
- Décisions prises : B1, N1, N2a, N3, N6, N8 corrigés ; N2b, N4 en attente de microcopy ; N5, N7 renvoyés à Thomas, non tranchés. Fins de parcours **conformes à la spec s17 §5.5 et acceptables**, aucune modification. Règle de coupe de « Version sans risque » corrigée : dernière phrase interrogative du défi, pas « Pas d… ». « aujourd'hui, étape N » affiché seulement quand la date conseillée est atteinte ou absente.
- Points d'attention : (1) @qa : contrôler la suite après Machine à Café puis Storytelling (SU-04), puis capturer les fins de parcours avec Boulot publié (Machine à Café vers Boulot attendu) ; (2) @fullstack, si Thomas valide : S1 (phrase validée cliquable vers l'étape), S2 (alignement du total d'XP à 375), S3 (état erreur), S4 (double cadenas) ; (3) @design : S7 (gras du libellé de défi sur les 5 parcours ou non) ; (4) Thomas : N5, N7, microcopy N2b et N4, visionnage des vidéos ; (5) rien n'a été modifié dans le code ni les textes validés.
---
