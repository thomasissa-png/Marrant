# Itération 4, relecture UX des étalons du Parcours Boulot (angle : la lectrice avant de payer, puis Thomas qui décide)

Fichier noté : `docs/copy/etalons-parcours-boulot-s19.md` (non modifié, numéros de lignes = ce fichier, 377 lignes).
Lu : ce fichier en entier, ma notation d'itération 3, le modèle `etalons-parcours-storytelling-s18.md`, la spec s17 (§1 et §3), `founder-preferences.md` (07/10 et 08/10, plus les lignes P0 sur les humoristes et la règle d'or).
Code relu pour vérifier ce qui s'affiche vraiment : `config/textes/parcours.ts`, `components/parcours/` (detail, step-card, step-blocks, step-quiz, content), `lib/parcours-orientation.ts`, `lib/parcours-catalogue.ts`, `app/(dashboard)/parcours/[slug]/page.tsx`, `config/parcours-publication.ts`.
Hors note, comme demandé : le PS de l'étape 2 (emplacement `[EN COURS…]`) et le texte des 5 autres conseils. Recomptés et exacts : `moduleDetail` 99 mots, `why` 52 mots, titre de page 60 caractères, vannes 12 en ligne + 18 neuves = 30 (3, 2, 3, 3, 2, 5), 8 fortes et 4 acceptables, 5 vidéos changées en B, positions de quiz B, D, A, nombres de phrases des trois explications.

## Note

| Critère de la grille | Note | Pourquoi, en une ligne |
|---|---|---|
| Vitrine (étape 1) | 9 | Sans parole, sans envoi, replis nommés, scène lisible, exemple drôle, durée par défaut décrite exactement comme la page l'affiche. Reste : le texte d'étape est un bloc unique de 137 mots avec la phrase du test, le `why` répète le conseil, l'envie de l'étape 2 ne tient qu'aux titres. |
| Peur « me griller » | 9 | Test de l'équipe entière, repli par étape, demi-phrase du repli dans l'aperçu. Reste : le titre de l'étape 6 affiché au tableau est encore celui qui réveille la peur. |
| Progression d'exposition lisible | 9 | Le tableau §7 est clair et dit que les titres sont provisoires et visibles de tous. Reste : l'écran n'affiche que ces titres, et celui de l'étape 6 est le moins bon. |
| Fiche et titre | 9 | Trois champs, trois idées ; titre A de 60 caractères sans « drôle / bureau / humour » ; un seul témoignage ferme ; « première étape gratuite » respecté. Reste : description de 96 mots (la plus longue du site), méta à cadrer. |
| Quiz | 10 | B, D, A ; longueurs tenues ; aucun mot repris ; explication affichée quelle que soit la réponse (vérifié dans `step-quiz.tsx`). Rien à corriger sur le fond. |
| Vidéos | 9 | Vocabulaire de l'écran posé, règle de sortie écrite, plus aucun `[À MINUTER]` dans la reco B, étape 6 sans condition. Reste : durées lues sur la base (celle de Vérino était fausse), contenu jamais visionné. |
| Décision pour Thomas | 8 | Réponse numérotée qui nomme les 5 vidéos, plus aucun « si ». Reste : le texte de l'étape 1, la vitrine, n'est dans aucun numéro de « Je suis tes recos ». |
| Traces caduques | 9 | Historique sorti du fichier. Reste : « itération 3 » et « tour 8 » dans le handoff, noms de variantes dans le §1, une règle sur les humoristes héritée de la règle annulée le 05/10, un `[À VÉRIFIER]` devenu sans objet. |

**Note globale : 9/10** (moyenne 9,0). Aucun défaut ne touche la promesse « sans te griller » ni le contenu de l'étape 1.
**1 correction bloquante, 11 non bloquantes.** Le bloquant traité : 9,5. Les 11 autres en plus : 10.

## Ce qui est réglé depuis l'itération 3 (vérifié, à ne pas défaire)

1. « Je suis tes recos » numérotée et nominative (l.26-34), plus aucun « si » dans la réponse. Réglé.
2. Étape 6 : plus de condition liée à l'aveugle ; Hamzawi est une proposition ferme, « B sauf étape 6 » reste la sortie. Je ne maintiens pas ma demande « étape 6 sans vidéo » : le choix est honnêtement présenté (« aucune vidéo n'est vraiment juste », l.18, l.292) et Thomas peut le refuser en trois mots. Réglé.
3. Témoignage : un seul texte B, sans vanne, sans condition. Réglé.
4. Durée : « Environ 15 min, hors vidéos » décrit exactement le rendu (`dureeEtapeTexte`, affiché sous « Ce que tu vas apprendre »), étape 6 à mesurer en premier (l.154, l.350). Réglé.
5. Vannes : « le visiteur voit le nombre, pas le texte » (l.23, l.132, l.219), confirmé par `StepJokes`. Réglé.
6. Vocabulaire de l'écran en tête (l.8, l.281) ; `[À MINUTER]` seulement dans la colonne A. Réglé.
7. Règle de sortie des vidéos non visionnées (l.7). Réglé.
8. Titres 2 à 6 présentés comme visibles et provisoires (l.24, l.319). Réglé, voir correction 3 pour le dernier pas.
9. Historique déplacé ; alignements @fullstack ajoutés (l.366). Réglé.

## Parcours de la lectrice (cognitive walkthrough, 26 ans, CDI, peur de se griller)

| Étape | Sait-elle quoi faire ? Voit-elle l'action ? Le but est-il lié à l'action ? Feedback ? |
|---|---|
| Carte sur /parcours | Oui : badge, « 6 semaines · 15 min/semaine · XP », accroche B (« le lundi à 9 h, un ton de compte rendu »), description, témoignage. La carte est la plus longue de la liste (correction 6). |
| Page /parcours/boulot | Oui : H1, description, « Pour qui ? », ligne « Étape 1 offerte, étapes 2 à 6 avec Premium », étape 1 ouverte. Le rythme hebdomadaire n'est pas dans l'en-tête de la page (seulement « 6 semaines ») : il apparaît dans l'étape ouverte (« Environ 15 min, hors vidéos »). |
| Étape 1 : why, scène, conseil, défi | Oui : « sans un mot », trois traces notées, deux phrases, rien à dire, repli visio. Le même message est dit trois fois de suite (correction 5). |
| Quiz | Oui : explication affichée même sans faute, « Refaire le quiz », Q3 traite son cas (agenda en visio). |
| Envie de l'étape 2 | Oui si le titre de l'étape 2 est lu (« sans finir en capture d'écran » parle à la peur). Pour l'étape 6, non (correction 3). |
| Arrivée par le quiz « Quel parcours est fait pour toi ? » | `[FRICTION H4]` : à la question « Au boulot, en réunion, à la pause », la lectrice est envoyée à Machine à Café, jamais au Boulot (correction 7). |

`[FRICTION H8]` : à l'étape 1, la first-time user lit le `moduleDetail` en un seul paragraphe de 137 mots (99 + la phrase du test) ; le test arrive collé à la scène au lieu de se détacher comme une règle. Solution : correction 4.
`[FRICTION H2]` : fiche de 96 mots pour une persona dont la frustration est « contenu trop long ». Solution : correction 6.
Pas d'autre friction : premier résultat concret (trois traces notées) en 2 pas (fiche, étape 1), sous la limite de 3.

## Audit Nielsen (flow : visiteuse, carte, étape 1, quiz, réponse de Thomas)

H1 visibilité de l'état PASS · H2 vocabulaire du persona PASS sous réserve de la fiche longue · H3 contrôle PASS (repli solo, « Refaire le quiz », « B sauf étape X ») · H4 cohérence PASS léger (entrée par le quiz d'orientation, voir 7) · H5 prévention d'erreurs PASS (test de l'équipe, rien à envoyer en vitrine) · H6 reconnaissance PASS · H7 raccourcis PASS (« Je suis tes recos ») · H8 minimalisme PASS sous surveillance (corrections 4, 5, 6) · H9 messages « Pas tout à fait » + explication PASS · H10 aide dans le flux PASS (repli écrit dans chaque défi).
Mesure (déjà en place, rien à ajouter) : `parcours-ouvert`, `etape-ouverte`, `quiz-etape-termine`, `mur-vu` (type `parcours-validation`), `etape-retour`. Signal Adoption de l'étape 1 : visiteurs qui finissent le quiz sur ceux qui ouvrent l'étape (cible par défaut 60 %, `[HYPOTHÈSE : à caler sur la première semaine de données]`).

## Correction bloquante

**1. « Je suis tes recos » ne couvre pas le texte de l'étape 1, qui est ce que Thomas doit le plus lire.**
Emplacement : l.22-23 (paragraphe sous le tableau), l.26-34 (réponse type et liste « ce que chaque numéro valide »), l.365 (« Attend Thomas : choix 1 à 8 »).
Problème : le §3 dit « tu valides le texte écrit ou tu corriges un mot » (l.23), mais aucun des 8 numéros ne le nomme. Thomas qui répond « Je suis tes recos » valide huit choix et laisse le titre, le « Pourquoi cette étape ? », la scène d'Anouk, les 3 questions de quiz et les légendes de la vitrine sans validation explicite, alors que la règle P0 s8 exige sa validation avant toute écriture. C'est le défaut de l'itération 3 à l'envers (valider plus que ce qu'on lit), avec le même effet : un aller-retour de plus.
Correction : ajouter un numéro 9 au tableau (colonnes : § 3 ; « Étape 1 écrite » ; « Valider le texte / corriger un mot » ; « C'est la page que lit la visiteuse avant de payer » ; reco « Valider ») et à la réponse type :
> Réponse type : 1 oui, 2 B, 3 A, 4 A, 5 B, 6 B, 7 oui, 8 a, 9 oui.
> 9. **L'étape 1 du §3 telle qu'écrite** : le titre « La salle de réunion, sans un mot », le « Pourquoi cette étape ? », le texte d'étape avec la scène d'Anouk (sa phrase finale ne s'affiche que si tu as dit B au 6), le défi, les 3 questions du quiz, la légende de la vidéo de Thomas VDB (et celle de Vérino si 5 B). Pas encore écrits : 3 vannes (voir 4) et la durée (mesurée à l'import). Pour changer un mot : « 9 sauf [le mot] ».
Mettre « choix 1 à 9 » au handoff (l.365) et dans le paragraphe l.22-23.

## Corrections non bloquantes

**2. Réponse type, numéro 5 : nommer aussi les vidéos qui ne changent pas.**
Emplacement : l.31.
Problème : « 5 vidéos changées » est exact, mais Thomas ne lit pas dans la réponse ce qui reste de la spec aux étapes 2, 4, 5 (facultatives) et 3 (les deux). « Complet » veut dire que tout ce qui part en ligne est nommé.
Correction : ajouter « Restent comme dans la spec : étape 3 (Guiz « cabillauds », Kev Adams), facultatives des étapes 2 (Brokerss), 4 (Foresti) et 5 (Delmoitiez), obligatoire de l'étape 1 (Thomas VDB). »

**3. Titre de l'étape 6 : mettre la proposition à la place du titre qui réveille la peur.**
Emplacement : l.316 (tableau §7, colonne « Titre vu par la visiteuse »), l.319, l.24.
Problème : le titre de la spec (« Prendre la parole quand c'est officiel ») est affiché au tableau comme « vu par la visiteuse », et la meilleure proposition (« Un mot de départ en soixante secondes, une seule vanne ») reste dans un paragraphe en dessous. Le titre est à l'écran pour tous (liste, carte de l'étape, programme) et c'est lui qui clôt la promesse « sans te griller ».
Correction : écrire la proposition dans la cellule du tableau avec `[PROPOSITION, à finaliser par @copywriter]`, et reléguer le titre de la spec en note. Aucun numéro de plus pour Thomas (l.24 : « rien à décider »).

**4. Texte d'étape : donner au test sa propre ligne.**
Emplacement : l.151 (`moduleDetail` de l'étape 1, avec `[SI 6B]`), l.320 (même règle pour les étapes 2 à 6).
Problème : sous le choix 6B, la scène (99 mots) et la phrase du test (38 mots) forment un seul `<p>` de 137 mots (`parcours-step-card.tsx` l.285, `step-blocks.tsx` l.39 : pas de `whitespace-pre-line`). Sur 375 px, c'est un mur d'environ 25 lignes, et la règle à retenir se lit comme la suite de la scène. L'aperçu des étapes 2 à 6 (scène, demi-phrase du repli, test) a le même poids.
Correction : écrire un saut de paragraphe (`\n\n`) avant « Le test à retenir… » et demander à @fullstack `whitespace-pre-line` sur ces deux `<p>` (la classe existe déjà pour l'exemple du conseil). `[À VÉRIFIER @fullstack : aucun `moduleDetail` des autres parcours ne contient de saut de ligne, donc aucun rendu existant ne change.]` Variante sans code : supprimer « Ici, ta phrase ne parle que d'un objet : elle passe ce test d'avance. » (16 mots), ce qui ramène le bloc à 121 mots.

**5. Étape 1 : le `why` répète le conseil et le texte d'étape.**
Emplacement : l.150 (`why`).
Problème : trois blocs de suite portent le même message. « Chaque scotch, chaque étiquette jaunie garde une histoire de bureau que personne n'a notée » reprend presque mot pour mot le conseil (« Chaque trace est un petit fait divers que personne n'a raconté »), et « tu en tires deux phrases, gardées dans tes notes » précède « deux phrases écrites, rien à dire » (`moduleDetail`) puis le défi, puis la fin du conseil. La consigne est lue quatre fois sur une page que la visiteuse lit avant de payer.
Correction : garder dans le `why` la seule raison (« une matière qui ne vexe personne », les objets d'une salle) et retirer la phrase finale de consigne (« Ici, tu les repères… ») ainsi que l'écho « que personne n'a notée ». Le `why` passe à une quarantaine de mots ; recompter. Texte du site non relu à l'aveugle : @copywriter retouche, pas de nouveau tour.

**6. Fiche : description B de 96 mots, et méta à cadrer.**
Emplacement : l.117 (description B), l.351 (signalement 8).
Problème : 96 mots comptés (18 + 60 + 18) contre environ 52 pour Machine à Café et 70 pour Storytelling. Sur /parcours, la description et le témoignage s'affichent en entier sur chaque carte (`parcours-content.tsx` l.289-294) : la carte du Boulot est la plus haute de la liste, pour la persona qui reproche aux contenus d'être trop longs. Par ailleurs la `metaDescription` à écrire plus tard n'a pas de cadre : les quatre autres pages portent la durée hebdomadaire et « Première étape gratuite. » (`page.tsx` l.51, 59, 67).
Correction : demander à @copywriter une description B de 80 mots maximum en gardant les trois idées (la vanne gardée pour soi, « sans te griller » en un cran à la fois, la vanne vise la situation). La liste des six situations peut perdre « dans un mail, dans un couloir, à l'afterwork » puisque le programme les affiche juste dessous. Signalement 8 : « la `metaDescription` porte « 6 semaines à 15 min/semaine » et « Première étape gratuite. », et n'ouvre pas par drôle, bureau, humour ».

**7. Entrées : dire à Thomas où mène « Au boulot ».**
Emplacement : l.124 (« Boulot ou Machine à Café d'abord ? »), handoff @fullstack l.366.
Problème : le document traite le quiz d'humour à 5 profils (« le Boulot n'est la cible d'aucun profil », l.4). Il ne dit rien du petit quiz « Quel parcours est fait pour toi ? » de /parcours ni de l'onboarding : `ParcoursSlug` ne contient pas `boulot` (`parcours-orientation.ts` l.7), et la réponse « Au boulot, en réunion, à la pause » (`parcours-content.tsx` l.34) comme le contexte `work` de l'onboarding mènent à Machine à Café (l.37-41). Une lectrice qui répond « Au boulot » ne se voit jamais proposer le Boulot. C'est peut-être le bon défaut (Machine à Café dure 3 semaines, Boulot 6), mais Thomas doit le savoir.
Correction : ajouter à l.124 : « Le petit quiz « Quel parcours est fait pour toi ? » et l'onboarding envoient « Au boulot » vers Machine à Café (3 semaines, plus léger) ; le Boulot est proposé en suite de fin de parcours et dans la liste. Reco : laisser ainsi. Dis-moi si tu veux que « Au boulot » mène au Boulot. » Et au handoff : `[À VÉRIFIER @product-manager : l'orientation de /parcours et de l'onboarding ne cible pas le Boulot ; décision à acter]`.

**8. Vidéos : lire aussi la durée de chaque vidéo retenue.**
Emplacement : l.7 (règle de sortie), l.292 (Hamzawi), l.288 (Croce).
Problème : la durée de Vérino en base était fausse (7 min 30 contre 5 min 51 sur YouTube). Celles de Hamzawi (« 4 min », présentée comme « sous le plafond, sans extrait ») et de Croce (fiche 5 min, base 2 min 30) ne sont pas lues. L'argument « sous le plafond » de l'étape 6 repose sur un chiffre de la base.
Correction : étendre la règle de sortie : « la session regarde chaque vidéo retenue, relève sa durée affichée et corrige la base ; celle qui ne tient pas est retirée ». Marquer `[DURÉE DE LA BASE, À LIRE]` sur Hamzawi et Croce.

**9. Traces caduques à nettoyer.**
Emplacement et correction :
- l.362 « (itération 3) » et l.368 « notes d'itération 3 de @reviewer et @ux » : écrire « version envoyée à Thomas » et retirer la mention des notes.
- l.57, l.103 et l.368 « tour 8 » : les fichiers `lot-aveugle-conseils-s19-tour9*.md` existent, le numéro est déjà périmé ; il est remplacé à l'insertion du texte (voir 11).
- l.63 « variante P2-bis », « variante T-b » et noms de fichiers `-v5.md`, `-v6.md` : déplacer les sources au handoff (l.362, qui les cite déjà).
- l.5 et l.369 « humoristes cités seulement là où la fiche vidéo en base les cite » : formulation héritée de la règle « zéro humoriste » annulée le 05/10 (P0 s15 : humoristes nommés partout). Écrire « citations réelles uniquement, jamais inventées ; aucune limite de nombre ».
- l.40 `[À VÉRIFIER @fullstack : aucun conseil en ligne ne couvre déjà la prise de parole officielle]` : sans objet depuis que le conseil de l'étape 6 est écrit et validé à l'aveugle, et qu'un doublon est accepté (s18). Retirer.
- l.366 (7)(b) « la spec RC8 et ce document disent que l'aperçu montre la durée » : le document ne le dit nulle part (§7 l.320 : texte d'étape, format, bouton). Écrire « la spec RC8 dit… ».
- l.373-377 : garder la ligne « Historique des relectures », retirer les trois lignes vides.

**10. Handoff @fullstack : la publication du titre et de la page.**
Emplacement : l.366 (3).
Problème : le titre de page validé (choix 3) n'est pas dans le seed mais dans `PARCOURS_META` (`app/(dashboard)/parcours/[slug]/page.tsx` l.42-84), derrière un interrupteur comme `STORYTELLING_PUBLIE`. Importer le parcours sans ces deux gestes laisse la page sans le titre signé (et, selon l'interrupteur, en 404).
Correction : ajouter à (3) : « ajouter l'entrée `boulot` dans `PARCOURS_META` (name « Parcours Boulot », title du choix 3, `metaDescription`), derrière un interrupteur de publication du même type que `STORYTELLING_PUBLIE`, activé sur feu vert de Thomas seulement ».

**11. À l'insertion du PS (checklist pour la session, non pénalisée dans la note).**
Emplacement et correction : quand le texte validé remplace `[EN COURS…]`, aligner dans la foulée :
- l.57 (tableau d'état : verdict et numéro de tour), l.103-105 (supprimer la phrase « la session insère ici… » et le `[EN COURS]`), l.14 (colonne État du choix 1) et l.20 (choix 7) ;
- l.312 (§7, ligne 2) : recopier le repli du défi inséré (le tableau dit « rien n'est envoyé ») et la colonne « Qui l'entend » ;
- l.117 : la phrase « Chaque exercice a une version sans risque au boulot » doit rester vraie contre le défi inséré (le §7 en fait la preuve étape par étape) ;
- l.363, l.365, l.367, l.368 : « version corrigée en relecture » devient « validée à l'aveugle ».
Si le texte ne propose pas de version qui n'envoie rien, la phrase de la description B (l.117) et la promesse « sans te griller » tombent : c'est le seul point où le PS touche une autre partie notée.

**12. Deux précisions d'import (n'enlèvent pas de point).**
- Quiz Q3 (l.188-193) : ses réponses sont des consignes (« Tu regardes… »), non des phrases à écrire. Dire si les « » du document restent à l'écran : Q1 et Q2 oui (phrases à écrire), Q3 non.
- Étape 1, difficulté du conseil : `INTERMEDIAIRE` (l.66) alors que les conseils des étapes 3 et 4 sont `DEBUTANT`. La première étape, la plus facile du parcours, est la seule des trois premières à porter le niveau le plus haut sur la fiche du conseil, lue par la visiteuse qui clique « Lire la fiche du conseil ». C'est une métadonnée, pas un texte relu : proposer `DEBUTANT` `[À VÉRIFIER @fullstack : la difficulté n'est exploitée nulle part ailleurs (XP, classement)]`.

## Points solides à ne pas défaire

Étape 1 sans parole, sans envoi, sans collègue, avec repli visio ; tableau de différence avec Machine à Café 2 et Confiance 1 ; tableau d'exposition §7 avec un repli par étape ; test unique en dernière phrase des étapes 2 à 6 ; « cinq textes » exact ; colonne « Ce que ça change pour la lectrice » ; réponse type numérotée ; vocabulaire de l'écran en tête du §6 ; témoignage B sans vanne ; accroche B distincte de Machine à Café ; titre A de 60 caractères sans « drôle / bureau / humour » ; refus des vannes qui visent une personne ; « tes notes » à la place de « carnet » ; quiz B, D, A.

## Pour l'itération 5

À re-vérifier : (1) numéro 9 dans le tableau, la réponse type, la liste « ce que valide chaque numéro » et le handoff ; (2) vidéos qui restent nommées au numéro 5 ; (3) titre de l'étape 6 dans le tableau §7 ; (4) saut de ligne avant le test et note @fullstack ; (5) `why` recompté ; (6) description B à 80 mots maximum et cadre de la méta ; (7) phrase sur le quiz d'orientation ; (8) durées lues ; (9) traces nettoyées ; (10) `PARCOURS_META` au handoff ; (11) PS inséré et six endroits alignés ; (12) précisions d'import. Le bloquant traité : 9,5. Avec les 11 autres : 10. Limite connue qui ne bloque pas le 10 si la règle de sortie étendue (8) est écrite : aucune vidéo n'a été visionnée.
