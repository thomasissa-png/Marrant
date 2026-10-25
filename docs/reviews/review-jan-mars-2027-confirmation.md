# Relecture à l'aveugle de confirmation : lettres réservées Premium, janvier à mars 2027 (révision 3)

Date : 25/10/2026. Fichier relu : `docs/copy/lettres-reservees-jan-mars-2027.md`, révision 3 (tableau « Révision 3 » et passages NEUVE ; annexe « repli » ignorée). Rapports précédents : `review-jan-mars-2027-lecteur-v2.md`, `review-jan-mars-2027-editeur-v2.md`. Lecteur : 20 à 30 ans, introverti. Ton : `docs/copy/ton-alex.md`. Barre : 9/10 par lettre. Corpus du Grep : ce fichier, `docs/copy/lettres-du-mois-s22-a-lire.md`, `docs/copy/lettres-reservees-nov-dec-s22-a-lire.md`. Étape croisée : Storytelling é5 (`apps/web/src/config/parcours-etapes.ts` l.47, `docs/content/parcours-storytelling-s18.json` l.428 à 505).
Non rouvert (choix du fondateur) : signature « L'Équipe Deviens Marrant », liens d'étape sans mention « réservée aux abonnés ».

## Résumé exécutif

Les bloquants précis des deux rapports v2 sont levés : 11/02 (la règle et la joueuse disent maintenant la même chose), 28/01 (le lien avec le 21/01 est assumé), 25/03 (la règle ne contredit plus les répliques), 18/02 (la scène du tram tient). Deux restent à moitié levés. Au 18/02, la scène n'écarte toujours pas la réponse « Bref » du 19/11 (seconde moitié du B1 de l'éditeur), et l'exercice dit de « couper » la digression, ce que le quiz de l'étape liée compte comme une erreur. Et T1 recommence : les formules supprimées ont été remplacées par d'autres, qui reviennent elles aussi plus de deux fois dans le corpus (« Pour les tester » 6 fois sur 6 retours, « Elle parle de toi » 3 fois, « Avant de répondre » encore présent au 25/03 alors que le contrôle §8 annonce 0, « Il faut que », « Dis-la », « Regarde », « Elle demande », « X attend »). La risquée du 28/01 est sous la barre : je propose « Mehdi, deuxième manche. Je mise ta pièce. ».
Verdict : 1 GO (11/03), 8 NO-GO. Toutes les retouches tiennent en une ligne et sont données mot pour mot. Une fois appliquées, chaque lettre est à 9. Les phrases retouchées repassent l'aveugle (règle d'or s18), elles seules.

## Résumé technique

Cohérence interne bonne, faits des décryptages conformes aux sources, sauf deux tournures du 18/02. 0 tiret cadratin ni demi-cadratin (Grep `—|–` : 0). Blocage principal : T2, des formules de début de phrase saturées dans le corpus. NO-GO tant que les retouches ne sont pas faites.

## Tableau

| Date | Lettre | Note | Verdict | Ce qui bloque | Après retouches |
|---|---|---|---|---|---|
| 14/01 | Galette | 8,5 | NO-GO | T2 seul : « Dis-la » (joueuse), « Il faut que » et « garde-la » (risquée) | 9 |
| 21/01 | Frayssinet, micro | 8,5 | NO-GO | T2 seul : entrée B « On regarde… ce qu'on peut lui emprunter » (19/11, 18/02, 18/03) | 9 |
| 28/01 | Chandeleur | 8 | NO-GO | risquée sous la barre ; entrée « Mehdi attend… » ; T2 (« Elle passe », « Regarde et écoute », « Pour les tester ») | 9 |
| 11/02 | Angleterre-France | 8,5 | NO-GO | T2 : entrée « Toute la pièce attend » (calque de « Tout le salon attend », mensuelle) ; « Elle demande » ; « elle sonne comme une provocation » (mot pour mot nov-déc l.26) | 9 |
| 18/02 | Pascot, « Presque » | 8 | NO-GO | réponse « Bref » non écartée ; exercice contre é5 ; deux tournures au-delà des sources ; T2 (« Pour les tester », « Regarde », « Ces trois phrases restent ») | 9 |
| 25/02 | Voisine | 8,5 | NO-GO | T2 seul : « Elle parle de toi », « Dis-la » (joueuse) | 9 |
| 11/03 | Entretien annuel | 9 | GO | rien (2 mineurs) | 9 |
| 18/03 | Felpin, tournoi du BDE | 8,5 | NO-GO | T2 seul : entrée « Regardons ce qu'on peut lui emprunter », « Pour la tester », « Dis-la » | 9 |
| 25/03 | Pâques | 8 | NO-GO | T2 : « Avant de répondre » (3e du corpus), règle « Plus…, moins… » (4e), « Elle parle de toi », « Garde-la pour », « Regarde la table », « Pour les tester » | 9 |

## 1. Bloquants des rapports v2 : levés ?

| Bloquant v2 | Source | État | Évidence |
|---|---|---|---|
| T1 « Ici »/« Là » en tête des 6 risquées, « Trois réponses, et… » en entrée | éditeur | **Levé sur ces formules, mais remplacé** | « Ici » 1 (l.66), « Là, tu » 0, « Trois réponses, et » 0 dans le corps. Les remplaçantes saturent à leur tour : voir §3 (T2). |
| 28/01 B1 : l'erreur refait la leçon du 21/01 | éditeur | **Levé** | l.188 « C'est le geste du micro de la semaine dernière, appliqué à la cuisine » |
| 11/02 B1 : règle et joueuse se contredisent | les deux | **Levé** | l.235 « prends la joueuse, qui rit de toi, pas du match » ; l.228 « ou quand le match est serré et que la pièce grogne à chaque sifflet » : même moment |
| 18/02 B1 : Maël descend à la même station | lecteur | **Levé** | l.269 « Il descend dans trois arrêts » ; l.279 « quand Maël est déjà sur le quai » |
| 18/02 B1 : scène et diagnostic calqués sur le 19/11 | éditeur | **À moitié** | Lundi, week-end et liste de détails ont disparu. La seconde moitié de la retouche de l'éditeur (« Résume en une phrase, et Maël n'a rien eu à attendre ») n'a pas été reprise : l'abonné du 19/11 pense « Bref, j'ai pas osé monter » et ne voit pas pourquoi il lui faut une autre méthode. |
| 18/02 B2 : le geste 2 dit l'inverse d'é5 | éditeur | **Levé pour le geste 2 et l'exemple 2, pas pour l'exercice** | l.283 et l.290 alignés sur é5 (« fait sourire pour elle-même »). Mais l.299 « c'est la digression qu'il faut couper » contre é5, quiz 4 : « Tu supprimes le tiroir : c'est lui qui rallonge » est la mauvaise réponse. Les notes l.664 et l.732 parlent encore d'« une digression qui explique ». |
| 25/03 B1 : la règle contredit les répliques | éditeur | **Levé sur le fond** | l.524 « moins ta phrase doit parler d'Adrien » colle aux trois répliques ; mais la tournure « Plus X, moins Y » est la 4e règle du corpus construite ainsi (§3). |
| 21/01 mineur 1 « Il reprend sa chronique » | éditeur | **Levé** | l.108 : seules des phrases sourcées |

## 2. Les phrases NEUVES tiennent-elles ?

Critères : on sourit (quand c'est une réplique), la phrase se dit d'un trait, sans mode d'emploi, et elle colle à la scène et à son commentaire.

**Elles tiennent.** 14/01 : « Tu as le temps d'une bouchée. » (on mesure le temps en bouchée : on sourit, et c'est juste) ; « Même la bouche pleine, elle se comprend. » ; condition de la règle alignée sur la risquée. 21/01 : « Encore un tunnel. Je reprends où il m'a coupé. » (le rappel fait sourire, la reprise suit le geste 3) ; « et il en fait un genre de spectacle ». 11/02 : « Avec fierté, une chips à la main. » (la meilleure consigne de diction du lot) ; « Bluffer. Tu lances… ». 25/02 : « Oui, c'était nous. Après minuit, désormais, c'est casque pour tout le monde. » (six invités sous casque : on le voit, on sourit) ; « Les coups de balai deviennent des applaudissements ». 11/03 : « il attend ta phrase pour l'écrire dans la case » (le stylo qui attend : sourire, et c'est la règle en image) ; « Je dirais que je travaille trop. » ; fin de règle. 18/03 : « Sofiane, je t'ai supplié de t'inscrire pour te voir gagner. Raté. » (11 mots, « Raté » fait la chute) ; « Deux temps, dans cet ordre. ». 25/03 : « Adrien a eu sa réponse ; ta mère attend encore la sienne. » ; « Le salon entier a entendu, ta mère aussi. ».

**Elles ne tiennent pas (retouches au §5).**
- 28/01, entrée « Mehdi attend. Ta réponse, elle, ne doit pas s'attarder sur le raté. » C'est un mode d'emploi glissé dans la scène, avec un « elle » incise qui alourdit. Et « X attend » est la 4e entrée du corpus construite ainsi (mensuelle l.64 « Tout le salon attend », 11/02 l.220, 25/02 l.341).
- **28/01, risquée « Mehdi, deuxième manche. Je tiens les paris. » : sous la barre.** C'est un défi, pas une vanne : il n'y a pas de chute, la cuisine fera « ooh » sans rire (le lecteur v2 le disait déjà). Le commentaire ne tient pas non plus : celui qui « tient les paris » ne parie pas, donc il ne peut pas avoir « perdu deux fois ». Proposition, mot pour mot : **« Mehdi, deuxième manche. Je mise ta pièce. »** Tu paries avec l'argent d'un autre, et pas n'importe lequel : la pièce porte la prospérité de son année. L'aplomb fait la chute, en six mots, et ça découle de la tradition posée dans la scène (l.166). La cible reste Mehdi et le risque est réel (il peut refuser, ou réussir). La réplique fait écho à la sûre (« Ma pièce n'a pas bougé ») sans reprendre son ressort. Grep « mise » : 0 dans le corps des trois fichiers.
- 18/02, technique (l.277) : « remonte le temps pour expliquer pourquoi ça coince. Chaque souvenir explique pourquoi ça coince » répète la même proposition d'une phrase à l'autre. « Chaque souvenir » généralise une source qui dit « ses souvenirs » (Time Out : « allant chercher dans ses souvenirs les clés de compréhension »). « la salle garde la même question » prête un état d'esprit au public, ce que la première relecture avait déjà fait retirer au 21/01. « Lui ne parle pas de méthode : le geste, c'est nous qui le tirons. » reprend presque mot pour mot le 18/03 l.452 (« La méthode, c'est nous qui la tirons de son récit. »), une semaine plus tard : c'était le gabarit B que l'éditeur v2 demandait de casser.
- 11/02, risquée « elle sonne comme une provocation » : c'est mot pour mot la fin de la joueuse de nov-déc l.26.

### Le 18/02 (Pascot) face à Storytelling é5

- **Scène** : cohérente (mercredi, « hier soir », Maël descend au troisième arrêt, soirée de quatre heures pour trois minutes qui comptent, récit de trente secondes). Mais elle ne dit pas pourquoi la réponse « Bref » du 19/11 (une phrase titre, puis on se tait) ne suffit pas ici. Pour un abonné de novembre, la leçon d'entrée reste « ne commence pas par le début ». Il manque une phrase, et c'est la seconde moitié du B1 de l'éditeur (§5).
- **Geste 2** (« une seule digression : une qui fait sourire pour elle-même et qui dit pourquoi ça coince ») : compatible avec é5. Le critère d'é5, c'est le tiroir qui fait sourire seul (l.432, quiz 3), et la lettre le garde. Elle ajoute une exigence de pertinence, que l'étape ne pose pas mais n'interdit pas. Le quiz 1 d'é5 écarte la parenthèse qui « explique le retard » parce qu'elle n'est pas drôle seule, pas parce qu'elle est liée à l'histoire. L'exemple 2 (« monter sans être invité, c'était du cambriolage ») tient seul : c'est un frère qui lit le code pénal à la place du code amoureux. Verdict : PASS.
- **Écarts restants** :
  - L'exercice (l.299) dit « c'est la digression qu'il faut couper ». Pour é5 (quiz 4), supprimer le tiroir est la mauvaise réponse ; la bonne est de le ramener à deux phrases. Le lecteur qui clique fait le quiz et se trouve contredit. **Bloquant.**
  - « Pas trois : tu as trois arrêts de tram » peut se lire « trois arrêts, donc trois digressions » (mineur).
  - Les notes l.664 et l.732 décrivent encore l'ancien geste (« une digression qui explique », « l'inverse » d'é5). Elles ne partent pas chez l'abonné, mais elles trompent l'orchestrateur et Thomas (mineur).
- **Exercice** (ouverture, digression, retour, moins de trente secondes) : compatible avec le « DÉFI TIROIR » (trois phrases, tiroir après la première, chronométré).

## 3. Grep des débuts de phrase (T2) : corpus = ce lot + mois + nov-déc (versions finales)

Règle appliquée : une formule de début de phrase ne revient pas plus de deux fois dans le corpus. Les versions finales de nov-déc et du mois ne changent plus : quand elles atteignent déjà 2, le lot ne doit plus rien y ajouter. Lignes du lot = corps des lettres (l.43 à 545), sans les notes ni l'annexe.

**Bloquants (au-dessus de 2)**

| Formule | Lot (lignes) | Mois / nov-déc | Total | Retouche (§5) |
|---|---|---|---|---|
| « Pour le/la/les tester, » (retour) | 101, 164, 267, 335, 440, 503 | 0 | **6** | garder 21/01 et 25/02 ; changer 28/01, 18/02, 18/03, 25/03 |
| « Elle parle de toi / à » (sûre, joueuse) | 58, 174, 349, 513 | 0 | **4** | garder 14/01 et 28/01 ; changer 25/02, 25/03 |
| « Avant de répondre » | 527 (25/03, erreur) | nov-déc 155, mois 269 | **3** | 25/03 (le contrôle §8 l.742 annonce 0 : il est faux) |
| « Il faut que [condition] » (risquée) | 66 | nov-déc 152, 238 ; mois 124 | **4** | 14/01 (§8 n'a compté que le lot) |
| « Dis-la + manière de dire » | 62, 349, 465 | nov-déc 22, 108, 234 ; mois 72, 168, 262 | **9** | 14/01, 25/02, 18/03 (§8 annonce deux joueuses et oublie l.465) |
| « Regarde + objet » en tête de règle ou de technique | 185, 277, 524 | nov-déc 58 ; mois 31, 79, 127 | **7** | 28/01, 18/02, 25/03 (la consigne de diction l.178 « Regarde la hotte en la disant » reste la seule) |
| « Plus X, plus/moins Y » (fin de règle) | 524 | mois 31, 127, 221 | **4** | 25/03 |
| « [Tout le salon / Toute la pièce / X] attend. » (entrée) | 170, 220, 341 | mois 64 | **4** | 28/01, 11/02 (l.220 calque « Tout le salon attend ») |
| « Elle demande [condition] » | 232 | mois 24, 214, 218 | **4** | 11/02 |
| « Elle passe [si / même si / devant] » | 182 | nov-déc 270 ; mois 68 | **3** | 28/01 |
| « Garde-la pour / garde-la » (condition) | 66, 521 | nov-déc 115 ; mois 76, 218 | **5** | 14/01, 25/03 |
| Entrée B « On regarde / Regardons… (ce qu'on peut) lui emprunter » | 105, 271, 446 | nov-déc 52 | **4** | 21/01, 18/03 (garder 18/02, qui ne dit pas « emprunter ») |
| Fermeture B « Ces N phrases / Ces deux-là restent [lieu] ; le geste… » | 294, 467 | nov-déc 199 (« Ces deux-là restent au chalet. Le geste… ») | **3** | 18/02 (§8 parle de « trois tournures différentes » : 18/02 et 18/03 suivent le même gabarit) |

**Tenues (au plus 2)** : « Ici, » 2 (l.66 ; mois « Ici, c'est tata ») ; « Tu reconnais » 2 (l.345, 513) ; « Tu donnes » 2 ; « Tu dis » 2 ; « Tu traites » 2 (l.62 ; mois l.24) ; « Cette semaine, » 2 (l.271 ; nov-déc l.52) ; « ne valent que pour » 2 (l.126 ; nov-déc l.73) ; « Tu devais écrire » 2 ; « Si tu hésites » 2 ; « En cas de doute » 1 ; « Dans tous les cas » 1 ; « Elle tient si » 1 ; « Réserve-la » 1 ; « Retiens » 1. Les débuts de commentaire de risquée sont six débuts différents, ce que §8 dit à juste titre.

**Hors règle, par choix (à confirmer par l'orchestrateur)** : les étiquettes fixes du format, présentes dans toutes les lettres du corpus depuis novembre et acceptées par les quatre relectures. Ce sont « À choisir quand / par défaut », « À sortir quand », « À éviter si », les titres de section, le nom de l'erreur en tête de section (« Bluffer. », « Promettre trop. ») et la consigne d'exercice « à voix haute ».

**Mineurs (formules en milieu de phrase, à varier dans la même passe)** : « sur le modèle de/du » 5 fois dans les exercices (l.191, 241, 362, 413, 530) ; « c'est toi qui » 3 dans le lot (l.122, 182, 521) pour 6 dans le corpus ; « sonne comme » 2 dans le lot (l.232, 353) pour 6 dans le corpus.

## 4. Tirets et décryptages

- Tiret cadratin ou demi-cadratin : **0** (Grep `—|–` sur le fichier entier).
- **21/01 Frayssinet** : chaque fait est sous la lettre (Ozap, Univers Freebox) ; « les grésillements cessent » vient de l'arbitrage de l'orchestrateur, non rouvert ; aucun état d'esprit prêté à la salle. PASS.
- **18/02 Pascot** : « sorti sur Netflix en novembre 2022 » est confirmé (TheTVDB dans les notes ; sortie le 3 novembre 2022, revérifiée ce jour, voir Sources). « s'ouvre sur un troisième rendez-vous » et « Il confesse d'emblée » s'appuient sur VL Media (« en introduction de “Presque” ») et sur la fiche §1, l.45. **Deux écarts** à la l.277, retouche au §5 : « Chaque souvenir » (la source dit « ses souvenirs ») et « la salle garde la même question » (non sourcé). Hors de ces deux points : PASS.
- **18/03 Felpin** : tout est dans Ozap §3. « mitigée » paraphrase « doux amer », sans guillemets prêtés à l'humoriste ; ni le mot grossier ni sa santé. La retouche d'entrée proposée au §5 (« la même gêne… face à sa référence dans l'humour ») reprend le titre de la source (« sa gêne de recevoir un Molière face à Florence Foresti ») et la citation « référence ». PASS. Il n'y a toujours qu'une seule page source pour le déroulé : à dire à Thomas, comme le notent déjà les v2.

## 5. Bloquants restants, retouche mot pour mot

Chaque nouvelle tournure a été cherchée par Grep dans les trois fichiers : aucune n'y figure déjà, sauf « Elle suppose » (1 fois en nov-déc l.278, donc 2 au total).

### 14/01
- l.62 : « Dis-la avec une résignation sincère, et laisse « avant 2028 » tomber seul. » → « Prends l'air résigné, et laisse « avant 2028 » tomber seul. »
- l.66 : « Il faut que Nathalie accepte qu'on la chambre devant l'équipe et que tu aies déjà plaisanté avec elle. Dans une équipe où l'on ne plaisante pas avec la hiérarchie, garde-la pour toi. » → « Deux conditions : Nathalie accepte qu'on la chambre devant l'équipe, et vous avez déjà plaisanté ensemble. Dans une équipe où la hiérarchie ne se chambre pas, oublie-la. »

### 21/01
- l.105 : « Pas de réplique à apprendre cette fois : un geste. On regarde ce que fait un humoriste quand son micro lâche devant un public, et ce qu'on peut lui emprunter. » → « Pas de réplique à apprendre cette fois : un geste, pris à un humoriste dont le micro s'est mis à grésiller devant le public. »

### 28/01
- l.164 : « Pour les tester, relis-les demain matin » → « Relis-les demain matin »
- l.170 : « Mehdi attend. Ta réponse, elle, ne doit pas s'attarder sur le raté. » → « Personne ne touche à la crêpe : c'est à toi de la commenter. » (on voit la crêpe laissée là-haut comme une pièce à conviction, et la phrase annonce la leçon de l'erreur : le raté se commente)
- l.181 : « Mehdi, deuxième manche. Je tiens les paris. » → « Mehdi, deuxième manche. Je mise ta pièce. »
- l.182 : « La poêle passe à Mehdi : sa pique devient un défi, et c'est toi qui arbitres. Elle passe si Mehdi aime le jeu et que la cuisine suit. S'il réussit une deuxième fois, tu as perdu deux fois : en lançant, puis en le défiant. » → « La poêle passe à Mehdi : sa pique devient un défi, et c'est sa prospérité que tu mets en jeu, pas la tienne. À tenter si Mehdi aime le jeu et que la cuisine suit. S'il réussit encore, tu as perdu deux fois : la crêpe, puis le pari. »
- l.185 : « Entre la crêpe qui se colle et la phrase de Mehdi, il s'est passé une seconde. Regarde et écoute ce que la cuisine y a mis. » → « Entre la crêpe qui se colle et la phrase de Mehdi, il s'est passé une seconde, et ce que la cuisine en a fait décide pour toi. »

### 11/02
- l.220 : « Toute la pièce attend de voir si tu sais. Tu ne sais pas, » → « Tu ne sais pas, » (la phrase restante suffit comme entrée)
- l.232 : « Elle demande un Maxime qui sait qu'on lit tout sur son visage et qui en rit, et un score confortable : à dix minutes de la fin d'un match serré, elle sonne comme une provocation. » → « Le terrain idéal : un Maxime qui sait qu'on lit tout sur son visage et qui en rit, et un score confortable. À dix minutes de la fin d'un match serré, la même phrase te vaut un coussin dans la figure. »

### 18/02
- l.267 : « Pour les tester, regarde la fin de chacune : » → « Le test est dans la fin de chacune : »
- l.269, ajouter après « …avant que tu arrives à sa porte. » : « Résume-la en une phrase, et il restera sur sa faim : il veut l'histoire, et tu as trois arrêts pour la tenir. » (la réponse « Bref » est écartée sans contredire le 19/11 : Clara posait une question en passant, Maël demande l'histoire)
- l.277 : « Regarde l'ordre. Il ne commence pas par sa petite enfance : il commence par l'instant qui compte, avec son échéance (trois minutes), puis il gèle cet instant et remonte le temps pour expliquer pourquoi ça coince. Chaque souvenir explique pourquoi ça coince, pendant que la salle garde la même question : va-t-il l'embrasser ? Lui ne parle pas de méthode : le geste, c'est nous qui le tirons. » → « Il ne commence pas par sa petite enfance : il commence par l'instant qui compte, avec son échéance (trois minutes), puis il gèle cet instant et remonte le temps. Ses souvenirs disent pourquoi ça coince, et la question du début reste en suspens : va-t-il l'embrasser ? Le nom et le geste viennent de nous, pas de lui. »
- l.294 : « Ces trois phrases restent dans le tram ; le geste vaut pour un oral, » → « Hors du tram, le même ordre marche pour un oral, »
- l.299 : « Si tu dépasses, c'est la digression qu'il faut couper. » → « Si tu dépasses, raccourcis la digression sans la supprimer : c'est elle qui fait sourire en route. » (aligné sur é5, quiz 4, et sur le retour du 25/02, « c'est la digression que tu raccourcis »)

### 25/02
- l.349 : « Elle parle de toi, jamais de Mme Roussel, et le « pour une fois » dit que ce n'est pas une habitude. Dis-la sans fanfaronner, avec une pointe de surprise. » → « Tu restes le seul sujet de la phrase, et le « pour une fois » dit que ce n'est pas une habitude. Une pointe de surprise dans la voix, sans fanfaronner. »

### 18/03
- l.440 : « Pour la tester, dis-la à quelqu'un en le regardant : » → « Essaie-la sur quelqu'un, en le regardant : »
- l.446 : « À la télé, une humoriste parle d'un prix gagné devant quelqu'un qu'elle admire. Regardons ce qu'on peut lui emprunter. » → « Une humoriste a connu la même gêne, avec un Molière, face à sa référence dans l'humour. »
- l.465 : « Dis-la au même ton que le reste, et arrête-toi sur « facture ». » → « Le ton ne change pas, et la phrase s'arrête sur « facture ». »

### 25/03
- l.503 : « Pour les tester, glisse-les dans une conversation : » → « Glisse-les dans une conversation : »
- l.513 : « Elle parle de toi, elle rassure ta mère : tu es venu pour manger. Elle clôt la pique d'Adrien sans lui répondre. » → « Ta mère comprend que tu es venu pour manger, et la pique d'Adrien se referme sans réponse. »
- l.521 : « Garde-la pour un frère qui rit de sa paresse, » → « Elle suppose un frère qui rit de sa paresse, »
- l.524 : supprimer « Regarde la table. » (la règle commence à « Si le plat est déjà dans les assiettes ») ; et « Plus quelque chose a refroidi, moins ta phrase doit parler d'Adrien. » → « Au premier signe de froid, Adrien sort de ta phrase. »
- l.527 : « Avant de répondre à celui qui parle, dis une chose à celle qui a attendu : « ça sent bon », « il est magnifique, ce gigot ». Le reste vient ensuite. » → « Ta première phrase revient à celle qui a attendu : « ça sent bon », « il est magnifique, ce gigot ». Adrien attendra son tour. »

### Contrôle après retouches (recompté)
« Pour les tester » 2 ; « Elle parle » 2 ; « Avant de répondre » 2 (corpus seul) ; « Il faut que » 3, tous dans le corpus figé ; « Dis-la + manière » : le lot n'en ajoute plus ; « Regarde » en tête de règle ou de technique : le lot n'en ajoute plus ; « Plus…, moins… » : le lot n'en ajoute plus ; « X attend. » en entrée 2 (mois l.64, 25/02) ; « Elle demande » et « Elle passe » : le lot n'en ajoute plus ; « Garde-la » : le lot n'en ajoute plus ; entrée B « On regarde » 2 (19/11, 18/02) ; fermeture « Ces… restent » 2 (chalet, BDE) ; « Elle suppose » 2.

## 6. Mineurs (3 au plus par lettre, à appliquer dans la même passe)

- **21/01** l.108 : « Mouloud Achour et le public éclatent de rire. Mouloud Achour finit par lui reprendre » → « Mouloud Achour et le public éclatent de rire, puis le présentateur finit par lui reprendre » (deux fois le nom d'une phrase à l'autre ; « présentateur » est le mot de la source).
- **28/01** l.191 : « Écris d'avance ta sûre sur le modèle de la pièce : » → « Écris d'avance ta sûre comme celle de la pièce : » (« sur le modèle de » revient 5 fois).
- **11/02** l.235 : « la sûre seule, car la faute de l'arbitre est alors la seule chose que » → « rien que la sûre, car la faute de l'arbitre est alors tout ce que » (« seule » deux fois). l.241 : « sur le modèle de l'arbitre » → « comme avec l'arbitre ».
- **18/02** l.283 : « Pas trois : tu as trois arrêts de tram. » → « Pas trois : tu n'as que trois arrêts de tram. » Notes l.664 et l.732 : remplacer « une digression qui explique » et « l'inverse » par la description du geste actuel (« une digression qui fait sourire pour elle-même et qui dit pourquoi ça coince »).
- **11/03** l.396 : « Julie peut recopier ton début dans la case » → « Julie peut recopier tes deux phrases dans la case » (la règle l.407 dit que la sûre est « la seule que Julie peut recopier sans y toucher » : c'est vrai pour la réplique entière, pas seulement pour son début). l.410 : « « Je dirais que je travaille trop. » : elle l'a entendu » → « « Je dirais que je travaille trop » : elle l'a entendu » (point final dans la citation, puis deux-points).
- **18/03** l.442 : « tu as gagné la finale du tournoi de quiz du BDE. En finale, » → « tu as gagné le tournoi de quiz du BDE. En finale, ». l.449 : « persuadée que Florence Foresti gagnerait » → « persuadée que sa référence gagnerait » (le nom revient trois fois en deux phrases ; « sa » ne peut renvoyer qu'à Laura Felpin).
- **25/03** l.521 : « et c'est toi qui passes pour l'ingrat » → « et l'ingrat, ce sera toi ». l.530 : « sur le modèle du dessert à rattraper » → « comme le dessert à rattraper ».

## Top 3 corrections prioritaires

1. **T2, les formules qui reviennent** (8 lettres) : le Grep §8 de la révision n'a croisé le corpus que pour les formules qu'il venait de supprimer. Il annonce « Avant de répondre : 0 » alors que la l.527 en contient une. Il ne compte « Il faut que » que dans le lot, et il oublie le « Dis-la » de la l.465. Tant que ce Grep ne compte pas aussi les formules de remplacement, T1 reviendra à chaque révision.
2. **18/02** : la phrase qui écarte la réponse « Bref », et l'exercice aligné sur le quiz d'é5. Sinon, l'abonné de novembre relit la même leçon, et celui qui clique sur l'étape se trouve contredit.
3. **28/01** : la risquée « Je mise ta pièce » à la place de « Je tiens les paris ».

## Contradictions

| Livrable A | Livrable B | Contradiction | Criticité | Résolution |
|---|---|---|---|---|
| Lettre 18/02 l.299 « c'est la digression qu'il faut couper » | `parcours-storytelling-s18.json` l.494 à 502 (quiz 4 d'é5) | supprimer le tiroir y est la mauvaise réponse | Bloquant | retouche du §5 ; rédacteur des lettres |
| Lettre 18/02 (geste 2 actuel) | Notes du même fichier l.664, l.732 | les notes décrivent l'ancien geste | Mineur | mettre à jour les notes |
| Contrôle §8 l.742 « Avant de répondre : 0 » | Lettre 25/03 l.527 | le contrôle est faux | Bloquant (T2) | retouche du §5 ; refaire le §8 sur le corpus entier |
| Rapport éditeur v2, 18/02 B1 (« en écartant aussi la réponse Bref ») | Tableau de la révision 3 l.18 (B1 levé) | levé à moitié | Bloquant | phrase ajoutée au §5 |

## Angles morts

- Aucun outil ne compte les formules de manière fiable. Un script de comptage des débuts de phrase par section (sûre, joueuse, risquée, règle, erreur, entrée, retour), lancé sur le corpus entier, éviterait la cinquième passe à la main. Agent à invoquer : @fullstack (script dans `scripts/`), sur demande de l'orchestrateur.
- La zone « condition de la risquée » est saturée dans le corpus (« Il faut que », « Elle demande », « Elle passe », « Garde-la »). Le lot d'avril devrait partir d'une liste des tournures déjà prises.

## Décisions à confirmer

- Les étiquettes fixes du format (« À choisir quand », « À sortir quand », « À éviter si », le nom de l'erreur en tête de section, « à voix haute » dans les exercices) restent hors de la règle des deux occurrences, comme dans tout le corpus depuis novembre. À confirmer par l'orchestrateur, ou par Thomas s'il veut les varier.
- Une seule page source pour le déroulé de Felpin (déjà signalé par les v2).

## Recommandation

**NO-GO** pour 14/01, 21/01, 28/01, 11/02, 18/02, 25/02, 18/03 et 25/03, jusqu'aux retouches du §5 (une à six lignes par lettre, aucune réécriture d'ensemble). **GO** pour le 11/03 (mineurs du §6 recommandés). Ensuite, une relecture à l'aveugle des seules phrases retouchées (règle d'or s18, priorité : la risquée du 28/01 et l'ajout au 18/02), puis la lecture de l'orchestrateur, puis l'approbation de Thomas dans l'admin. Agent à relancer : le rédacteur des lettres (@copywriter).

## Sources (vérification externe du 25/10/2026)

- Sortie de « Presque » sur Netflix le 3 novembre 2022 : [JustWatch](https://www.justwatch.com/fr/film/panayotis-pascot-presque), [WeArePlayStation, sorties Netflix de novembre 2022](https://www.weareplaystation.fr/communautes/netflix/actualites-communaute/netflix-les-sorties-de-novembre-2022-en-france-datees-avec-jason-momoa-panayotis-pascot-et-les-teletubbies), [JustGeek](https://www.justgeek.fr/netflix-les-nouveautes-films-et-series-a-voir-en-novembre-2022-100830/).

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/reviews/review-jan-mars-2027-confirmation.md`
- Décisions prises : 1 GO (11/03), 8 NO-GO. Les bloquants v2 sont levés, sauf le 18/02 (réponse « Bref », exercice contre é5). T2 : treize formules au-delà de deux occurrences dans le corpus. La risquée du 28/01 est sous la barre, remplacée par « Mehdi, deuxième manche. Je mise ta pièce. ». Toutes les retouches sont mot pour mot.
- Points d'attention : le contrôle §8 de la révision 3 est inexact (« Avant de répondre : 0 » faux, corpus non croisé pour « Il faut que », « Dis-la », « Regarde »). Les phrases retouchées repassent l'aveugle. Aucun autre fichier modifié, aucun commit.
---
