# Itération 3, contrôle final UX des étapes 2 à 6 du Parcours Boulot

Fichier noté : `docs/copy/parcours-boulot-etapes-2-6-s19.md` (466 lignes, numéros de lignes = ce fichier), étape 1 relue dans `docs/copy/etalons-parcours-boulot-s19.md` §3. Ma note précédente : 10/10 (`etapes-iter-2-ux.md`).
Lu : le fichier en entier, `vannes-finales.md` en entier, ma note de l'itération 2, §3 des étalons (scène, quiz, vannes de l'étape 1). Pas de shell ni de Grep dans cette session : les traces ont été cherchées en lisant le fichier de bout en bout, pas par recherche automatique. Aucun autre fichier modifié.
Hors note, comme demandé : le texte des vannes, des conseils et des défis. Je ne juge des vannes que leur service à l'étape et à la persona. Comptages de mots à la main, plus ou moins 10 % (étape 6 recomptée un à un : 129 mots test compris).

## Note : 9/10, 0 bloquant, 2 corrections

| Critère | Iter 2 | Iter 3 | Pourquoi |
|---|---|---|---|
| Une seconde pour comprendre, envie de la suite | 10 | 10 | Titres, `why` et défis inchangés et alignés ; la scène 2 gagne un PS lisible en une passe. |
| Vannes au service de l'étape et de la persona | n/a | 9 | 22 vannes sur 25 servent directement l'étape ; trois sont à la marge (O1 à O3), sans effet sur ce que la lectrice fait. |
| Peur « me griller » | 10 | 10 | Aucune des 25 vannes ne vise un employeur ni une personne identifiable ; la plus proche (étape 3, n° 2) est signalée en O1. |
| Fin de parcours (étape 6) | 10 | 9 | Satisfaisante sans la vanne d'Anouk, mais un mot de la scène contredit le défi (correction 1) et la phrase de suite garde un statut flou (correction 2). |
| Continuité d'Anouk | 10 | 10 | Six scènes, aucun conflit (voir tableau). |
| Durées | 10 | 10 | Aucun chiffre affiché ne bouge (voir plus bas). |
| Quiz, vidéos, version sans risque, longueur | 10 | 10 | Non touchés par l'assemblage, aucune bonne réponse n'emprunte à une scène modifiée (revérifié pour les étapes 2 et 6). |

Moyenne 9,6, arrondie à 9 parce que la correction 1 est une contradiction visible par la lectrice dans la dernière marche (H4), même si elle ne change rien à ce qu'elle doit faire.

## Corrections demandées

**Correction 1 (étape 6, l.310 et note de scène l.317). [FRICTION H4] : à l'étape 6, la première lectrice lit « Elle enchaîne sur une seule phrase, et la salle rit » puis écrit, dans le défi, « deux phrases » par vanne (la première dit ce qui t'arrive, la seconde fait revenir le détail), comme dans l'exemple du conseil (deux phrases aussi). Elle peut croire que la vanne d'un toast tient en une phrase, ou que sa vanne ne ressemble pas à celle d'Anouk.**
Le titre dit « une seule vanne », le défi dit « deux phrases » : la scène ne doit dire ni l'un ni l'autre autrement. Solution : « Elle enchaîne sur sa seule vanne, et la salle rit. » (même longueur, 129 mots). Reporter le même mot dans la note l.317 (« une seule phrase, et la salle rit » devient « sa seule vanne, et la salle rit »). Variante facultative, qui donne en plus un but au « garde-le le temps qu'il faut » planté dans la scène sans écrire la vanne : « Elle enchaîne sur sa seule vanne, qui reprend ce parapluie, et la salle rit. » (+4 mots, 133). Je recommande la variante : sans elle, la citation du parapluie reste un détail sans suite, et la lectrice ne voit pas le rappel qu'elle va devoir écrire.

**Correction 2 (l.411, `nextParcoursReason`). Statut flou d'un texte du site.** Le champ porte toujours « `[PROPOSITION @copywriter, à soumettre à la relecture à l'aveugle avec les vannes avant l'import]` ». Les vannes ont fini leur relecture, cette phrase non, et elle n'apparaît pas dans la liste « À vérifier avant import » (l.428, points 1 à 6). Elle s'affiche pourtant au bilan de fin, juste après le moment qui doit être satisfaisant. Solution : au choix, la soumettre à l'aveugle avant l'import et retirer le marqueur ; ou la valider comme texte de site (même statut que les scènes, doute (a) du handoff) et ajouter un point 7 à « À vérifier avant import » : « `nextParcoursReason` : texte du site non relu à l'aveugle ». Ne pas laisser le marqueur entre crochets dans la colonne « Texte » : il serait importé tel quel.

## Vérification point par point

| Point demandé | Résultat | Détail |
|---|---|---|
| Une seconde par étape, envie de la suivante | OK | Titres inchangés. Les `why` des étapes 2 à 6 ne promettent rien sur les vannes. La scène 2 reste en une passe : le PS d'Anouk est un faux rectificatif d'une phrase, la scène dit qu'elle le garde en brouillon et que « il compte quand même ». |
| Textes d'étape qui ne promettent pas plus que les vannes | OK | Étape 2 : « aucune des cinq n'est un faux rectificatif » (dans une note, rien de promis à la lectrice). Étape 3 : seules les trois neuves tiennent en dix mots, et le texte ne le promet pas pour les cinq. Étape 5 : pas de promesse de « métier en deux phrases ». Étape 6 : plus de « cinq rappels », deux rappels, un presque, deux vannes de pot. |
| Fin du parcours sans la vanne d'Anouk | OK, sous réserve des corrections 1 et 2 | La scène montre les trois blocs du conseil (souvenir, vanne, fermeture), la vanne de rechange que le défi exige, et la salle qui rit : elle ferme l'arc « tu finis par un toast », que l'ancienne version laissait sur « il ne lui restera qu'à lire sa feuille ». Rien n'est prononcé pendant l'exercice : la scène se passe au jour J, `retourExerciceNote` le redit (« Il se dit le jour du pot, pas avant »). Même procédé que le témoignage B de la fiche (le résultat se lit dans la réaction des autres). Le risque d'attente non tenue (qu'est-ce qu'elle a dit ?) est faible : le conseil donne l'exemple complet (Claire, « demain à tête reposée ») juste après. |
| Durées | OK | Scène 2 : +25 mots, environ +8 s, les 11 à 14 min estimées tiennent, défaut « Environ 15 min ». Scène 6 : 142 vers 129 mots, aucun effet sur « Environ 20 min » (10 min de lecture et quiz, 10 min d'écriture), variante sans vidéo présente. Étape 4 inchangée (13 à 16 min, mesure à l'import). Plan de mesure inchangé (900 s et 1 300 s). |
| Traces d'emplacement | OK, hors point 2 | Plus aucun `[PS D'ANOUK...]`, `[VANNE D'ANOUK...]`, ni « à écrire » dans les textes d'étape, les tableaux ni le handoff. Restent seulement dans l'historique : arbitrage 5 (l.440), « Corrections de l'itération 2 » B1 (l.452) et l'en-tête l.3, qui dit que les emplacements sont remplis. Les marqueurs de mise en forme à retirer à l'import sont connus (voir O6). |
| Étape 1 (étalons §3) | OK | Les trois vannes neuves sont écrites et validées (l.248-251), plus de mention « à écrire » dans le §3. Les mentions « à écrire puis à relire à l'aveugle » restent dans l'en-tête et le point 9 des étalons (l.24 et l.36), qui sont l'historique daté du 10/10. |

## Vannes au service de l'étape et de la persona (jeune active, peur de se griller)

| Étape | Situation | Verdict | Détail |
|---|---|---|---|
| 2 | Le mail | Sert, une à la marge | Quatre vannes sont des écrits de bureau (copie de 90 mails, mail de bienvenue, adresse « alternant2 », smiley qui signale la vanne). La cinquième (avis sur une boulangerie) n'est ni du boulot ni un mail : voir O2. Aucune ne vise un collègue. |
| 3 | Le couloir | Sert, une à la marge | Les trois neuves (7 à 10 mots, un objet, une chute courte) sont exactement le geste du défi : la lectrice voit ce que « dix mots » donne. Le portique est un irritant partagé. La « pause déjeuner » est la seule vanne de tout le parcours dont la chute est la réaction d'un collègue : voir O1. |
| 4 | L'afterwork | Sert la technique, moins le décor | Cinq héros ratés : celui qui raconte est toujours la victime, jamais un absent, ce que le conseil demande. Trois sont du boulot (archives, costume, visio), deux sont du quotidien (bus, GPS). Le voisinage bus/GPS est déjà tracé et accepté (`vannes-finales.md`). |
| 5 | « Tu fais quoi dans la vie ? » | Sert | Cinq autodérisions sur soi, aucune sur l'employeur ni sur le métier d'un autre. Deux sont des entretiens, une répond à la question de l'étape, deux sont des soirées. Voir O3 pour la réponse « des erreurs, principalement ». |
| 6 | Le toast | Sert | Deux rappels, un presque, deux vannes de pot (annonce de standard, cotisation) : la lectrice voit que le rappel n'est qu'une façon parmi d'autres, et le texte ne le prétend pas. Les cinq se retournent contre celui qui parle. |

Sur la peur de se griller : parmi les 25 vannes, aucune ne vise l'employeur, un chef ou un collègue identifiable. C'est la différence avec l'itération 1, où les emplacements ne garantissaient rien.

## Continuité d'Anouk

| Étape | Jour, heure, lieu | Caractère montré | Conflit |
|---|---|---|---|
| 1 | Mardi 9 h 50, seule dans la salle | Observe, n'en parle à personne | Aucun |
| 2 | Jeudi 16 h 40, devant un mail ; PS sur la lumière du « deuxième » restée allumée hier soir | Reste tard seule, répète comment dire « bonne soirée », garde le PS en brouillon | Aucun (voir O4) |
| 3 | Mardi 12 h 52, « troisième étage », ascenseur | Lâche une phrase sans attendre | Aucun (O4) |
| 4 | Vendredi 18 h 30, afterwork, trois collègues | C'est elle qui s'en sort mal dans son histoire | Aucun |
| 5 | Jeudi 19 h 10, pot de bienvenue | Répond en deux phrases | Aucun (le pot n'est pas présenté comme le sien) |
| 6 | Vendredi 17 h 30, pot de départ ; feuille écrite mardi soir | Lit son toast, la salle rit | Aucun : vendredi, comme le pot de la fiche (témoignage A) ; 17 h 30 évite le 18 h 30 de l'étape 4 ; le « troisième jour » est un souvenir |

Le PS inséré à l'étape 2 renforce le personnage au lieu de le contredire : une Anouk qui reste seule tard pour répéter une formule de sortie est cohérente avec celle qui observe seule une salle à l'étape 1 et qui garde son PS en brouillon. Une lectrice qui a peur de se griller se reconnaît dans les trois.

## Observations sans effet sur la note (rien à corriger avant l'import)

- **O1. Étape 3, vanne n° 2 (pause déjeuner).** Seule vanne dont la chute est la réaction d'un collègue, sur un texte de plus de vingt mots, alors que la leçon est « un objet, dix mots, sans attendre de réponse ». Déjà classée « acceptable » (réserve nommée l.158 et doute (b) du handoff). Elle ne contredit pas un texte d'étape (rien n'y promet des vannes de dix mots). Si une place se libère, elle est la première à remplacer par une vanne d'objet ; sinon, on laisse.
- **O2. Étape 2, vanne n° 5 (boulangerie).** Un avis sur un commerce n'est pas un écrit de boulot. Le lien (« le détail d'un message prend des proportions absurdes ») est honnête mais lointain. La vanne reste drôle et sans risque pour la persona ; aucune correction.
- **O3. Étape 5, vanne n° 3 (« des erreurs, principalement »).** C'est la seule vanne qui répond à la question de l'étape, mais elle répond en moquant sa propre compétence, alors que le conseil demande un verbe concret puis un détail, et que la Q3 de l'étape pose « si ton chef entendait ta réponse ». La note de la table (« ne vise que soi », « structures voisines, pas identiques ») le dit honnêtement. Une lectrice peureuse pourrait la prendre pour un modèle. Pas de correction ; si l'on veut lever l'ambiguïté, la légende de la table n'est pas affichée, donc il faudrait remplacer la vanne.
- **O4. Étages.** L'étape 2 parle de « la lumière du deuxième » (PS d'Anouk), l'étape 3 la place « au troisième étage », et l'étape 1 mentionne « le deuxième » dans l'exemple du conseil et dans deux vannes (V-1-1, V-1-3). Rien ne se contredit : elle a pu rester tard dans une salle du deuxième sans y travailler. Si l'on veut zéro question, remplacer « au troisième étage » (étape 3) par « au bout du couloir » ; je ne le demande pas.
- **O5. Antécédent de « la » dans le test de l'étape 6.** Le test commun dit « Avant de la sortir… passerait-elle… ». À l'étape 6, la dernière phrase avant lui parle du toast (masculin) ; l'antécédent réel (la vanne) est trois phrases plus haut. La lectrice a lu quatre fois ce test à l'identique et le comprend, donc pas de friction. À garder en tête si le test est un jour reformulé (il est « mot pour mot » par décision).
- **O6. Marqueurs entre crochets à ne pas importer comme texte.** `[saut de paragraphe (\n\n)]` dans les `moduleDetail`, `[ESTIMATION @ux ...]` dans `dureeTexte` des étapes 4 et 6, `[PROPOSITION ...]` (correction 2), et à l'étape 1 `[SI 6B : ...]` (étalons l.176) : le choix 6B est validé, la phrase du test doit donc s'afficher et le marqueur disparaître. À mettre au handoff @fullstack.
- **O7. Mesure du diff réel (P0 s11) toujours non faite.** Le document le dit lui-même (l.464) : pas de shell dans la session de l'assemblage. Estimation à la main : 2 `moduleDetail` sur 5 modifiés, 16 lignes de tableau de vannes remplies, 0 conseil, 0 défi, 0 question. La session principale lance `git diff --stat` sur ce fichier avant de clore ; le rapport ne doit pas être validé sans elle.

## Cognitive walkthrough rejoué (première lectrice, 26 ans, 15 min)

| Étape | Sait quoi faire ? | Action visible ? | But et action liés ? | Feedback immédiat ? | Friction |
|---|---|---|---|---|---|
| 2 | Oui | Oui | Oui | Oui | Aucune |
| 3 | Oui | Oui | Oui | Oui | Aucune |
| 4 | Oui | Oui | Oui | Oui | Aucune |
| 5 | Oui | Oui | Oui | Oui | Aucune |
| 6 | Oui, sauf « une seule phrase » (deux écrites) | Oui | Oui | Oui | `[FRICTION H4]` correction 1 |

## Audit heuristique (Nielsen)

| Heuristique | Verdict | Évidence |
|---|---|---|
| H1 Visibilité de l'état | PASS | Durée de l'étape 6 vraie, variante sans vidéo écrite, `retourExerciceNote` aux étapes 2, 3 et 6. |
| H2 Vocabulaire de la persona | PASS | « vanne », « PS », « pot », « afterwork » ; aucun mot de coach. |
| H3 Contrôle et annulation | PASS | PS en brouillon, replis solo, rien à prononcer avant le jour J. |
| H4 Cohérence | FAIL léger | « Une seule phrase » (scène 6) contre « deux phrases » (défi et exemple). Corrigé par la correction 1. |
| H5 Prévention d'erreurs | PASS | Test unique identique ; aucune vanne ne vise une personne identifiable. |
| H6 Reconnaissance plutôt que rappel | PASS | Un test à retenir, mot pour mot. |
| H7 Flexibilité | PASS | Un repli par défi. |
| H8 Minimalisme | PASS | Scènes de 125 à 144 mots, plafond de 146. |
| H9 Messages d'erreur | PASS | Explications du quiz sans reproche. |
| H10 Aide dans le flux | PASS | Version sans risque dans chaque scène, avant le conseil. |

## Reste hors périmètre (inchangé)

Le visionnage des vidéos, la durée mesurée en production (étape 6 en premier), `isActive` des 20 vannes en ligne ou du catalogue à l'import, le code de rendu des sauts de ligne et de `frTypo` (handoff @fullstack, point 1).

---

**Handoff → @orchestrator** (puis @copywriter pour les corrections 1 et 2, @fullstack pour O6)
- Fichier produit : `/home/user/Marrant/docs/marrant/parcours-boulot-s19/iterations/etapes-iter-3-ux.md`. Aucun autre fichier modifié.
- Note : 9/10. Bloquants : 0. Corrections : 2 (une substitution de mot à l'étape 6 et une mise au clair du statut de `nextParcoursReason`). Avec les deux appliquées, je redonne 10/10 sans nouvelle relecture complète.
- Décisions prises : la scène de l'étape 6 sans vanne est acceptée ; le PS d'Anouk à l'étape 2 est accepté ; les vannes des cinq étapes sont acceptées pour la persona (aucune ne vise une personne).
- Points d'attention : lancer `git diff --stat` avant clôture (O7) ; retirer les marqueurs entre crochets à l'import (O6) ; `nextParcoursReason` n'a pas passé l'aveugle (correction 2).
