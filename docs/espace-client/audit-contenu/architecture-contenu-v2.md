# Architecture de contenu de l'espace Premium, v2 (s24)

> Auteur : @creative-strategy, 12/11/2026. Remplace `architecture-pedagogique-s24.md` (v1) et sert de base de travail avec les faits de `inventaire-cartographie-s24.md` (INV, section 6 seule source des chiffres de production). Réponse aux tours 1 de relecture : @ux 6,1, @elon 5,6, @reviewer 5,7 (`iterations/tour-1-*.md`). Chaque correction est tracée en annexe A.
> Sources relues en entier pour ce tour : les 3 rapports, `founder-preferences.md` (lignes 1 à 163), INV, `parcours-seed.json` (étapes 1 et 2 de Machine à Café), `config/premium.ts`, `lib/progression.ts`.
> Conventions : [HYPOTHÈSE] = dimensionnement ou choix de travail, jamais un fait. [À VÉRIFIER] = fait non lu. [EXEMPLE NON VALIDÉ] = illustration non relue à l'aveugle. Toute règle nouvelle (série, XP, texte libre, stockage) est une question à Thomas en section 8 : rien n'est décidé ici. Les noms de rubriques et de formats sont des propositions de travail, à caler par étalons rendus (règle P0 s8).
> Règles tenues : tutoiement, aucun tiret cadratin, aucun émoji, aucune mention d'IA, aucun concurrent nommé, rien de culpabilisant, aucune relance d'inactivité.

## 0. Ce qui change depuis la v1 (10 lignes)

1. La v1 décrivait un stock de fiches ; la v2 décrit un chemin (section 4) et un moteur d'entraînement (section 2) : rafale quotidienne courte, révision espacée, missions graduées, retour sur sa réplique.
2. Une fiche = une chose + un geste, et « Fait » veut dire « j'ai fait le geste » (déclaré par l'abonné, sans preuve).
3. Volumes recalibrés sur le rendement réel de la barre « niveau Alexa » : environ 153 fiches neuves au lieu de 220 (section 7). Les types sont tous là ; la cible monte par lots mensuels, pas par rabais sur la barre.
4. Les 5 parcours ne perdent rien : l'exemple de découpage liste les blocs réels (conseil, défi, 5 vannes, 2 vidéos, quiz) et affiche la durée ; la promesse « 15 à 20 min/semaine » devient une question (C2).
5. Les lettres réservées ne sont plus jamais reprises (décision du 25/10). Le carnet et les situations deviennent UNE rubrique.
6. Gradation alignée sur les lettres approuvées : « la sûre / la joueuse / la risquée ».
7. Libellés sans vocabulaire d'école. « Vocabulaire » reste (mot de Thomas, 12/11).
8. Barre : « Mon profil » reste dans le menu de compte ; 3 variantes en UNE question (C1) ; chaque page existante a une porte.
9. Chiffres : uniquement ceux de INV section 6 et du code (149 vannes, 120 conseils, 89 vidéos actives en production au 12/11). Niveaux : seulement DEBUTANT et INTERMEDIAIRE.
10. 8 questions, renumérotées C1 à C8 (le brief garde Q1 à Q12).

---

## 1. Faits de base (sources)

| Fait | Valeur | Source |
|---|---|---|
| Vannes, conseils, vidéos actifs en production | 149, 120, 89 | INV section 6 (`/api/content-stats`, 12/11) |
| Parcours et étapes | 5 parcours, 25 étapes (3, 4, 6, 6, 6) | `config/premium.ts` |
| Rythme annoncé | Machine à Café 15, Répartie 20, Confiance 20, Storytelling 20, Boulot 15 min/semaine | `config/premium.ts`, choix du 29/09 |
| Niveaux de difficulté dans les données | DEBUTANT : Machine à Café (lu), Boulot ; INTERMEDIAIRE : Répartie, Confiance, Storytelling | `difficulty` des seeds, lu par @reviewer et @elon ; Machine à Café relu ici (l. 8) |
| Contenu d'une étape lue (Machine à Café 1) | scène, pourquoi, 1 conseil avec exemple et défi, 5 vannes, 2 vidéos (Paul Séré, Karim Duval), 1 quiz de 4 questions, 50 XP, gratuite | `parcours-seed.json` |
| Durée réelle d'une étape | environ 22 à 25 min [HYPOTHÈSE de lecture INV 3.1 : 200 mots/minute, vidéos de 5 à 8 min] | INV 3.1 |
| XP, niveaux, série (code) | XP d'étape (`moduleXp`, 20 par défaut), bonus de fin 100, seuils 0/100/500/1 500/5 000, série comptée sur la pratique (étape validée, quiz d'étape terminé), rythme doux 7 jours | `lib/progression.ts` |
| `progression-levels.md` | OBSOLÈTE : ses gains (+2 par vanne lue, +10 par conseil, +25 par exercice, badges) n'existent pas dans `lib/progression.ts` | lu le 12/11, tranche INV T2 |
| Retour d'exercice existant | 3 valeurs fermées : `pas-essaye`, `essaye-bof`, `essaye-ca-a-marche` (aucun champ libre) | `lib/progression.ts`, choix du 07/10 « retour d'exercice A » |
| Glossaire public | 12 termes | INV section 6 |
| Carnet | 15 fiches (octobre) + 30 (novembre), validation à l'aveugle non documentée | INV section 6, T3 [À VÉRIFIER] |
| Lettres | 6 du mois + 16 réservées, approuvées par Thomas ; les réservées alternent format A (situation, répliques) et un format B par mois (décryptage) | INV 1.1, choix du 25/10 |
| Rendement de la barre Alexa (faits) | 30 vannes au niveau sur 333 (30/09) ; 2 sur 360 au pilote social (06/10) ; Boulot : 10 neuves validées sur 19 après 5 tours ; carnet d'octobre : environ 180 candidates pour 15 fiches | `founder-preferences.md`, INV 1.1 |

---

## 2. La leçon et le moteur d'entraînement

### 2.1 Définition

**Une leçon est une fiche d'environ 5 minutes qui apprend une chose et se termine par un geste** : choisir, écrire, dire à voix haute, ou tenter dans la vraie vie. Sans geste, ce n'est pas une leçon, c'est un contenu de plus (une vanne, un conseil). Toute fiche de l'espace a donc un geste, même les fiches reprises du catalogue (par exemple les 5 vannes d'une étape : « choisis celle que tu ressortiras cette semaine »). « Fait » se coche quand le geste est fait, déclaré par l'abonné, sans preuve.

La répartie est un réflexe, pas un savoir. L'espace a donc deux étages :
- **Les fiches** expliquent et font essayer (ce document, sections 3 à 5).
- **Le moteur d'entraînement** fait répéter, revoir et sortir de l'écran (cette section). Il ne demande presque aucun texte neuf : il utilise la base de situations déjà prévue, rangée en données.

### 2.2 Les quatre pièces du moteur

| Pièce | Ce que c'est | Ce qu'elle demande en contenu | Donnée stockée | Question |
|---|---|---|---|---|
| La rafale du jour | Dans « Aujourd'hui », 3 situations tirées de la base, un contexte donné pour chacune (« tu connais bien la personne », « la file derrière toi s'impatiente »), l'abonné choisit la réplique qui convient (la sûre, la joueuse ou la risquée), puis la règle s'affiche. 3 à 5 minutes. | Pour chaque situation de la base : 2 contextes courts et la bonne réplique de chacun (champ à ajouter à l'écriture des 60 situations neuves) | Un résultat de choix par situation (bon, à revoir), jamais de texte | C3 |
| La révision espacée | Une situation ratée revient 2 jours puis 7 jours plus tard dans la rafale, sans message d'échec (« on la reprend »). Elle n'apparaît que si l'abonné ouvre « Aujourd'hui » : aucun e-mail, aucune notification. | Aucun | L'état de chaque situation pour l'abonné | C3 |
| Les missions graduées | Passage au réel en 5 marches : 1 seul, à voix haute ; 2 à un proche, par message ; 3 à un pote, en face ; 4 dans un petit groupe ; 5 avec quelqu'un qu'on connaît peu. Chaque situation et chaque sous-parcours porte une mission à une marche. Les défis déjà écrits (120 conseils, 89 vidéos) sont étiquetés par marche, pas réécrits. Toujours facultatif, jamais compté contre l'abonné. | Étiquetage de 209 défis existants [À VÉRIFIER : combien ont un défi] ; mission des fiches neuves | Le retour (ci-dessous) | C3 |
| Le retour d'une mission | Trois boutons : « Pas essayé », « Essayé, bof », « Essayé, ça a marché » (mêmes valeurs que le retour d'exercice déjà validé). « Essayé, bof » renvoie vers la fiche « Quand ça tombe à plat » (type Rattrapage). | La fiche Rattrapage | Une des 3 valeurs fermées, déjà prévue par `lib/progression.ts` | C3 |

Un 5e élément, le **retour sur sa propre réplique**, fonctionne sans stockage : après toute fiche où l'abonné écrit (Construction, Formules, Jeux), une grille de 3 questions oui ou non s'affiche (« Elle tient en une phrase ? », « Tu vises toi ou une chose, pas la personne ? », « La fin surprend ? »). En plus, un lien « Montre-la à l'équipe » peut préremplir l'encadré existant « Ta question à l'équipe » (réponse en général sous 1 à 2 jours ouvrés, rien en base, limites de 3 par 10 minutes et 10 par jour déjà codées) : c'est le « coach » de la capture, déjà construit. Question C5.

Ce que le moteur ne fait pas : aucune relance d'inactivité, aucun message « tu n'as pas pratiqué », aucun classement, aucune note qui sanctionne.

### 2.3 Règles qui restent à Thomas

Rien ici ne modifie la série, l'XP ni le stockage de texte. Les trois sujets sont posés en section 8 :
- série et points pour la rafale et les fiches (C4) ;
- stockage d'un résultat de choix par situation (C3) ;
- retour sur la réplique, avec ou sans l'équipe (C5).

### 2.4 Anatomie commune d'une fiche

1. Titre qui dit la situation ou le mécanisme (jamais un titre de cours).
2. Accroche d'une phrase (la scène).
3. Exemple d'abord, règle ensuite.
4. Une seule erreur courante, dite sans jugement.
5. Le geste, avec sa marche de mission quand il y en a une.
6. Ce qu'on aurait pu dire (une version possible, pas la seule), jamais un « corrigé » seul.
7. Deux liens vers le catalogue (vanne, conseil ou vidéo liés).
8. Durée affichée et statut « Voir » / « Fait ».

---

## 3. Les types de fiches neufs

### 3.1 Libellés vus par l'abonné (propositions, à calibrer à l'étalon)

« Scolaire » est un mot qui ne définit pas la marque. Les noms de travail restent internes.

| Nom de travail | Libellé proposé à l'abonné | Remplace |
|---|---|---|
| Situation | « Quoi répondre » | « Situations » |
| Gradation douce / moyenne / piquante | « la sûre / la joueuse / la risquée » (celle des 22 lettres approuvées) | douce, moyenne, piquante |
| Grammaire de la vanne | « Comment c'est construit » | « Grammaire » |
| Vocabulaire | « Vocabulaire » (mot de Thomas, gardé) | pas de renommage |
| Expressions | « Formules à détourner » | « Expressions » |
| Écouter et décortiquer | « Écouter, repérer » | |
| Exercice et jeu | « À toi » et « Jeux » | « Exercice » |
| Corrigé | « Ce qu'on aurait pu dire » ou « Une version possible » | « Corrigé » |
| Test de section | « Le bilan du parcours » (le mot « bilan » existe déjà dans l'offre, sans certificat, choix du 07/10) ; le quiz d'étape garde son nom actuel | « Test de section » |
| Guide | « Quand ça tombe à plat » (famille Rattrapage) | « Guide » |
| Atelier | « Séance de 20 minutes » | « Atelier » |

### 3.2 Tableau d'ensemble (8 types, volumes V1)

Tous les volumes sont des [HYPOTHÈSE de dimensionnement] justifiés par le rendement de la section 7, pas par un goût du chiffre rond. Ce qui augmente la valeur : la rafale a besoin d'environ 60 situations pour ne pas se répéter pendant 3 semaines (3 par jour x 21 jours = 63), d'où la cible de 60 situations neuves.

| # | Type | Geste | Volume neuf V1 | Réemploi |
|---|---|---|---|---|
| 1 | Quoi répondre (situation, 3 répliques) | choisir, dire, tenter | 60 | Carnet (45 fiches) repris sans modification, voir 3.3 |
| 2 | Comment c'est construit | écrire | 12 | `/anatomie-vanne`, décryptages de vannes (264) |
| 3 | Vocabulaire | reconnaître, placer | 8 fiches de 5 mots = 40 mots (dont les 12 du glossaire, repris mot pour mot) | Glossaire (12) |
| 4 | Formules à détourner | écrire | 12 | Vannes qui détournent déjà une expression [À VÉRIFIER] |
| 5 | Écouter, repérer | repérer, écrire | 12 | Vidéos actives (89) et leur « pourquoi » |
| 6 | Quand ça tombe à plat | choisir | 8 | Conseils sur le silence et l'auto-dérision [À VÉRIFIER] |
| 7 | Jeux | choisir, écrire | 30 | Quiz d'humour (12 questions), défis des fiches |
| 8 | Le bilan du parcours | choisir, dire | 5 (un par parcours) | Quiz d'étape (25, conservés) |
| 9 | Séance de 20 minutes | faire | 6 | Défis existants |
| | **Total** | | **153 fiches** | |

Les 4 pièces du moteur (section 2) ne comptent pas : elles réutilisent le type 1.

### 3.3 Quoi répondre (le cœur)

- **Définition** : une scène de la vie courante, trois répliques (la sûre, la joueuse, la risquée), la règle pour choisir, l'erreur courante, le geste. Même squelette que le format A des lettres réservées, mais **jamais le même texte** : les lettres restent exclusives (décision du 25/10, « la lettre apporte ce que le site ne donne pas »).
- **Carnet et situations, une seule porte** : le carnet mensuel devient le flux de cette rubrique (« Nouvelles ce mois-ci » en tête, archive par mois en filtre). Règle claire : une fiche du carnet est une situation à deux répliques (« la joueuse » = sa réponse, « la sûre » = sa sortie polie, déjà écrites), reprise sans modification de texte. Une situation neuve a trois répliques. Les deux coexistent, signalées par « 2 répliques » ou « 3 répliques ». L'URL `/carnet` reste (aucun lien à casser) et affiche la même rubrique.
- **Volume** : 60 situations neuves à 3 répliques (dont 30 avant l'ouverture, voir 7.4) plus les 45 fiches du carnet, soit 105 entrées. Les 60 neuves sont celles de la rafale ; les fiches du carnet restent en lecture (leur validation à l'aveugle est à confirmer, [À VÉRIFIER] T3).
- **Classement** : deux filtres visibles, « Où ? » (coloc, soirée, boulot, famille, magasin, transport, rencard) et « Pour quoi faire ? » (désamorcer, répondre à un chambrage, relancer une conversation, rattraper un faux pas). L'enjeu (copain, collègue, inconnu, supérieur) est un troisième niveau. Un chemin d'entrée : « Les 5 situations pour commencer » (voir 4).
- **Ce que l'abonné en retire** : Yanis, quand son colocataire le chambre devant les autres, a une phrase prête dans trois registres. Sophie sait quoi répondre à « ça va ? » à la machine à café sans s'enfermer dans « ça va ». Marc sait répondre à « alors, quoi de neuf ? » sans en faire un moment lourd.
- **Version avancée** : la même scène avec un supérieur ou un inconnu (marches 4 et 5) ; rattraper une réplique qui a mal pris en public.
- **Exemple [EXEMPLE NON VALIDÉ], entièrement tiré du carnet de novembre (fiche 2026-11-01), la troisième réplique reste à écrire** :
  - Scène : tu hésites depuis cinq minutes devant un aspirateur, le vendeur surgit : « Il n'en reste que deux, hein. »
  - La sûre : « Merci, je regarde encore un moment, je viens vous voir si j'ai une question. »
  - La joueuse : « Ce sont les deux derniers ? Je m'en voudrais de les séparer. »
  - La risquée : [à écrire à l'étalon E1 : retourner l'argument de rareté contre lui, sans le vexer]
  - Pour choisir : tu ne le connais pas et il fait son travail, reste sur la sûre ou la joueuse ; la risquée seulement si le ton est déjà complice.
  - Erreur courante : répondre à la pression en t'excusant d'hésiter. Tu t'excuses d'une chose que tu as le droit de faire.
  - À toi, marche 1 : aligne deux tasses identiques sur une table et dis la joueuse en ralentissant sur « séparer » (exercice de la fiche du carnet). Retour : Pas essayé, Essayé bof, Essayé ça a marché.
- **Exemple de rafale [EXEMPLE NON VALIDÉ], tiré du carnet (2026-11-03)** : « Mardi à la boulangerie, la boulangère emballe ton troisième pain au chocolat de la semaine : "Vous n'aviez pas arrêté le sucre, vous ?" » Contexte 1 : tu la connais depuis des mois, elle sourit. Bonne réplique : la joueuse, « Dans toutes les autres boulangeries, je suis irréprochable. » Contexte 2 : il y a une file derrière toi et elle est pressée. Bonne réplique : la sûre, « Vous avez bonne mémoire. J'essaie de réduire, et cette semaine, ce n'est pas une réussite. »
- **Widget** : le seuil de 90 situations du 24/10 est celui de « La réplique du jour » du widget, pas celui de l'espace. Le widget garde son stock tout public propre ; la fiche complète (3 répliques, règle, mission) reste Premium. Rien de l'espace n'alimente le widget sans décision séparée.

### 3.4 Comment c'est construit

- **Définition** : un mécanisme de vanne démonté en deux temps (installer, casser) puis refait par l'abonné sur son sujet.
- **Retire** : Yanis arrête de croire qu'on naît drôle (il voit un mécanisme) ; Sophie a un gabarit pour sa vanne de pause café ; Marc retrouve un cadre simple pour se lancer.
- **Format** : 5 minutes, 200 à 250 mots, un schéma en une ligne, un exemple, un geste d'écriture, le retour sur sa réplique (grille de 3 questions).
- **Volume** : 12 mécanismes [HYPOTHÈSE : 12 fiches, une par mécanisme listé]. **Une notion, une fiche maîtresse** : le callback, la règle de trois, le détournement d'expression et la « liste qui déraille » ne se dédoublent pas avec Vocabulaire ni Formules ; les autres types y renvoient. Liste de départ à croiser avec les noms de techniques des 264 décryptages et des 89 vidéos (INV D2) : le faux secret, la règle de trois, le callback, le détournement d'expression, l'exagération contrôlée, le contraste (grand mot, petit sujet), la litote, l'aveu minuscule, la fausse logique, le détail trop précis, la chute qui retourne le début, l'escalade comique.
- **Version avancée** : combiner deux mécanismes dans une réplique.
- **Noms de techniques** : cités seulement dans Comment c'est construit et Vocabulaire, jamais dans les situations ni dans les étapes de parcours (cohérent avec la décision du 04/11 pour l'app, qui ne concernait que l'app).
- **Exemple [EXEMPLE NON VALIDÉ], source : étape 1 de Machine à Café, quiz et explications validés** :
  - Le mécanisme, le faux secret : « Ça reste entre nous : » suivi d'un aveu minuscule, sur toi, dit avec la gravité d'un scandale.
  - Un exemple : « Ça reste entre nous : je dis "je regarde ça" sur tout ce que je ne regarderai jamais. »
  - La règle : un seul aveu, court, sur toi, avec un détail que tout le monde reconnaît.
  - Erreur courante : ajouter « non mais je rigole » juste après. Ça casse le sérieux dont la vanne a besoin.
  - À toi : écris ton faux secret en trois essais. Puis la grille : tient-il en une phrase ? Vises-tu toi ? La fin surprend-elle ?
  - Une version possible : celle de l'exemple ci-dessus. Elle passe la grille, c'est pour ça qu'elle marche.

### 3.5 Vocabulaire

- **Définition** : le jargon utile pour parler d'humour et de répartie, un mot par entrée.
- **Retire** : Yanis comprend ce qu'on dit dans les vidéos ; Sophie nomme ce qu'elle fait quand elle rebondit ; Marc a un langage commun avec des amis qui regardent du stand-up.
- **Format** : une fiche regroupe 5 mots d'un même thème, 5 minutes. Chaque entrée : le mot, une définition d'une ligne, un exemple en deux temps (le premier moment, puis le second), « à ne pas confondre avec ».
- **Volume** : 40 mots, dont les 12 du glossaire actuel (Répartie, Timing, Autodérision, Punchline, Storytelling, One-liner, Observationnel, Setup, Callback, Escalade comique, Accusé de réception, Rebond sur mot-clé) repris mot pour mot, plus 28 neufs. **Un seul glossaire** : la page publique `/glossaire` reste (12 termes, indexée, inchangée) et devient la vitrine ; la rubrique Vocabulaire de l'espace en est le prolongement.
- **Ce qu'on retire de la v1** : la famille « scène » (open mic, plateau, crowd work, flop) : elle sert à monter sur scène, pas à parler à ses amis. Restent les mots utiles dans une conversation : construction, rythme, effets, répartie.
- **Source de chaque mot** : un emploi attesté par mot, vérifié avant écriture. Aucun mot du type « retour de volée » ou « rythme de trois » sans source (il double « règle de trois »).
- **Version avancée** : les mots de rythme et d'effets (escalade, running gag, retournement).
- **Exemple [EXEMPLE NON VALIDÉ, structure seule]** : « Callback. [définition du glossaire actuel, reprise mot pour mot]. En deux temps : [premier moment à écrire à l'étalon E3, tiré du catalogue ou d'un humoriste vérifié], puis [le moment où il revient]. À ne pas confondre avec : répéter la même vanne (un callback change de sens). »

### 3.6 Formules à détourner

- **Définition** : une expression que tout le monde connaît, dont on garde le début tel quel et dont on remplace la fin par son quotidien.
- **Retire** : une matière de départ quand on n'a aucune idée. Sophie y trouve des amorces de pause café ; Yanis, des détournements courts et peu risqués.
- **Format** : 5 minutes, 5 expressions par fiche : l'expression, la règle (début conservé, fin remplacée), le piège (changer les deux moitiés, plus personne ne la reconnaît), le geste d'écriture, et une version possible.
- **Volume** : 12 fiches [HYPOTHÈSE : 12 x 5 = 60 expressions]. Chaque détournement proposé passe la barre Alexa : c'est une vanne.
- **Exemple [EXEMPLE NON VALIDÉ, la règle seule, détournements à écrire à l'étalon E2]** : « Expression : [une expression courante]. Règle : on garde la première moitié, on remplace la seconde. Deux versions possibles : [à écrire, barre Alexa, jamais entendues]. Le piège : changer aussi la première moitié. »

### 3.7 Écouter, repérer

- **Définition** : un passage court (1 à 2 minutes) d'un humoriste, démonté puis transposé à la vie de l'abonné. C'est le format B des lettres réservées appliqué aux vidéos du site, avec d'autres passages et d'autres textes.
- **Retire** : Yanis voit que la répartie est de l'observation ; Sophie récupère un mécanisme pour le boulot ; Marc retrouve le plaisir de rire avec une méthode.
- **Format** : le passage (minute et seconde exactes), ce que l'artiste fait (3 observations), ce qui rend le moment efficace (une idée), ta version à toi, et le retour sur sa réplique.
- **Volume** : 12 en V1, puis 1 à 2 par mois en session [HYPOTHÈSE : 12 = un par étape de parcours pour les 12 premières semaines ; la vérification de chaque passage est le facteur limitant, T5].
- **Règles de production** : humoristes récents et proches de l'audience (décision du 25/10), nommés et cités sans réserve (P0 du 05/10), citation réelle et courte, aucune retranscription longue, jamais de citation inventée. Une citation douteuse se vérifie, on ne la retire pas. Responsable de la vérification : @copywriter propose, un relecteur indépendant vérifie la source page ouverte (comme pour les lettres, s22) ; Thomas regarde chaque vidéo choisie une fois (comme le visionnage des 10 vidéos de Boulot, 11/10). Avant toute fiche : lever INV T5 (légendes Répartie de Rollman et Haroun, Ngijol, Bun Hay Mean).
- **Version avancée** : décortiquer un passage complexe (plusieurs mécanismes imbriqués).
- **Exemple [EXEMPLE NON VALIDÉ, structure seule, aucune citation inventée]** : passage candidat : Karim Duval, « Génération Y » (le « pourquoi » du seed le décrit comme un détournement de jargon corporate en humour : à confirmer en visionnant). Minute début et fin : [à relever]. Ce qu'il fait : [3 observations à écrire après visionnage]. Ce qui marche : [une phrase]. À toi : prends un jargon de ton boulot ou de ta fac, dis-le avec le plus grand sérieux, puis ajoute un détail qui le trahit.

### 3.8 Quand ça tombe à plat

- **Définition** : une fiche courte pour la minute d'après : une réplique qui ne prend pas, un silence, une phrase dirigée contre toi.
- **Retire** : Yanis ose tenter parce qu'il sait quoi faire si ça rate ; Sophie sort d'un silence en réunion ; Marc retrouve le droit de rater.
- **Format** : 5 minutes, 3 sorties dans le même ordre que les situations (la sûre, la joueuse, la risquée), la règle pour choisir, le geste.
- **Volume** : 8 [HYPOTHÈSE : silence après ta vanne, quand ça ne prend pas, quand tu es la cible, quand tu as dit la mauvaise chose, quand quelqu'un te corrige en public, quand on te coupe, quand tu oublies la chute, quand tu veux sortir de la conversation]. C'est la fiche vers laquelle renvoie « Essayé, bof ».
- **Exemple [EXEMPLE NON VALIDÉ, structure seule]** : « Trois secondes de silence, c'est long, et c'est normal. La sûre : [à écrire]. La joueuse : [à écrire]. La risquée : [à écrire]. Pour choisir : [à écrire]. À toi : choisis celle qui te ressemble le plus et dis-la à voix haute une fois. »

### 3.9 Jeux

- **Définition** : un défi de 3 à 5 minutes qui fait pratiquer une seule compétence, avec une réponse possible montrée.
- **Retire** : de la pratique seul, sans public. Yanis s'entraîne dans sa chambre ; Sophie fait un jeu entre deux réunions ; Marc retrouve l'envie de jouer.
- **Familles (30 en V1)** : « Quelle réplique ? » (choisir parmi 3) ; « Finis la phrase » (même mécanique que le défi de l'app, décision du 04/11, stock partagé si possible) ; « Trouve l'angle » ; « Change de registre » (la même réplique, de la sûre à la joueuse) ; « Remets la chute » ; « Les pires réponses » (repérer ce qu'il ne faut pas dire, pour sentir la limite).
- **Où ils vivent** : une porte « Jeux » dans « Aujourd'hui » et un lien depuis chaque fiche et chaque étape (« À toi » renvoie au jeu lié). Ils ne sont pas cachés (voir C1 pour une variante où ils ont leur onglet).
- **Exemple [EXEMPLE NON VALIDÉ] : « Trouve l'angle »** : « Objet : le micro-ondes de l'open space. Note trois choses vraies sur lui, pas des blagues. Ce qu'on aurait pu relever : 1) il y a toujours une gamelle qui tourne depuis trop longtemps et personne n'ose l'arrêter ; 2) l'odeur de ce que quelqu'un a chauffé reste jusqu'à 15 h ; 3) tout le monde sait à qui est l'odeur de poisson et personne ne le dit. L'angle qui travaille le mieux est le troisième : un non-dit que tout le monde partage. La blague vient ensuite, de ce que tu fais de lui. »

### 3.10 Le bilan du parcours

- **Définition** : six questions à la fin d'un parcours qui vérifient qu'on sait choisir et dire, pas seulement reconnaître.
- **Format** : 5 minutes. 4 questions « laquelle de ces répliques convient ? », 1 « remets dans l'ordre », 1 « dis-la à voix haute » (déclaré). Retour en phrases, pas de note, pas de seuil, pas de certificat (décision du 07/10). Chaque erreur renvoie vers la fiche à revoir, sur un ton d'ami (« celle-là mérite un deuxième tour »).
- **Rapport avec le quiz d'étape** : le quiz d'étape existant garde sa place et son nom. Le bilan clôt le parcours. Les 25 quiz existent déjà, ils ne sont pas réécrits.
- **Volume** : 5.
- **Exemple de forme [EXEMPLE NON VALIDÉ]** : même structure que le quiz de Machine à Café étape 1, question 2 (« Ton faux secret est lâché, les collègues se sont penchés vers toi. Et maintenant ? », bonne réponse : s'arrêter net, source seed) ; les questions du bilan sont d'autres scènes du même parcours, jamais celles du quiz d'étape.

### 3.11 Séance de 20 minutes

- **Définition** : une séance guidée hors écran (seul ou avec un pote), qui assemble plusieurs gestes déjà vus. Les « ateliers » de la capture n'existent pas chez nous au sens coaching en direct (supprimé le 13/10) ; ici c'est un exercice long à faire sans l'écran.
- **Format** : 4 temps de 5 minutes : échauffement, observation, essai, bilan. Rien n'est enregistré par le site.
- **Volume** : 6.
- **Exemple [EXEMPLE NON VALIDÉ], tiré du carnet de novembre : « Dix chambrages, dix secondes »** :
  - Échauffement (3 min) : tu lis à voix haute les trois répliques d'une fiche de « Quoi répondre ».
  - Observation (5 min) : tu lis dix phrases qu'on te dit, par exemple « Il n'en reste que deux, hein. », « Vous n'aviez pas arrêté le sucre, vous ? », « Ça y est, ils ont rallumé le chauffage collectif ! » (carnet, champ « on te dit »).
  - Essai (8 min) : à chaque phrase, tu réponds à voix haute en dix secondes, avec la sûre ou la joueuse ; tu peux t'enregistrer sur ton téléphone si ça t'aide (le site ne reçoit rien).
  - Bilan (4 min) : la grille de 3 questions sur la réplique que tu as préférée.

---

## 4. Le chemin de l'abonné dans le temps

### 4.1 Trois paliers de lecture (aucun niveau d'accès inventé)

Tout reste ouvert (décision du 18/10). Les paliers sont un ordre conseillé, jamais un verrou.

| Palier | Quand | Ce qu'on y fait | Fiches concernées |
|---|---|---|---|
| Premier pas | Jour 1, 5 minutes | Une situation d'entrée, un geste, un « Fait » | Une fiche « Quoi répondre » désignée |
| Prendre le pli | Semaines 1 à 4 | La rafale, un premier parcours, le vocabulaire en appui, missions marches 1 à 3 | Rafale, parcours, Comment c'est construit, Vocabulaire, Jeux |
| Aller plus loin | Dès la semaine 4 | Écouter, repérer ; séances ; situations avec un supérieur ou un inconnu ; missions marches 4 et 5 ; parcours Storytelling et Boulot | Écouter, repérer ; séances ; Quoi répondre (version avancée) ; bilan du parcours |

Niveaux de difficulté : ceux du code seulement, DEBUTANT et INTERMEDIAIRE (les 5 parcours). Un niveau « avancé » est une option soumise à Thomas (C8), pas un fait. La pente existe sans lui : le contenu « pour aller plus loin » ci-dessus, et le sommet déjà en place, le toast de soixante secondes de l'étape 6 de Boulot.

### 4.2 Le premier pas (jour 1, moins de 5 minutes)

Règle du brief (§3.2) : un seul premier pas nommé, qui produit quelque chose que l'abonné ressent. Le contenu qui le remplit :
1. Si l'abonné vient d'une fiche (`returnTo`) : cette fiche.
2. Sinon, si le quiz d'humour a été passé : la situation d'entrée du profil (5 profils : Observateur, Storyteller, Absurde, Punchlineur, Taquin ; chacun mène déjà à un parcours recommandé) [À VÉRIFIER : un mapping profil vers situation d'entrée est à écrire].
3. Sinon : la première des « 5 situations pour commencer » (valeur proposée pour le cas 3 de Q10 du brief).

Le premier pas est une fiche « Quoi répondre » de la rubrique : on lit la scène, on choisit parmi les 3 répliques, on la dit à voix haute (marche 1). Pas un choix de parcours (cause H2 de l'analyse des résiliations).

### 4.3 Par persona

Scènes d'entrée proposées (titres de travail, textes à écrire aux étalons) :

| | Yanis, 20 ans, étudiant introverti | Sophie, 26 ans, jeune active | Marc, 34 ans, en reconstruction |
|---|---|---|---|
| Fiche d'entrée (jour 1, 5 min) | « Quelqu'un te chambre devant tout le monde en coloc » | « Le collègue qui lance "ça va ?" à la machine à café » | « Quelqu'un te demande "alors, quoi de neuf ?" » |
| Pourquoi celle-là | C'est sa frustration de départ : rester muet quand on se chambre | Elle évite la pause qui se résume à « ça va » | Il veut renouer sans que ça devienne lourd ; la réponse légère est la bonne |
| Jour 2 à 6 | La rafale (3 situations par jour), mission marche 1 puis 2 (un pote proche, par message) | La rafale, étape 1 de Machine à Café (gratuite, 15 min en cœur) | La rafale, une séance de 20 minutes (« Dix chambrages, dix secondes ») seul chez lui |
| Jour 7 | Étape conseillée (rythme doux, 7 jours après la dernière validation, rien n'est bloqué) : parcours Répartie, étape 1 | Étape 2 de Machine à Café | Parcours Confiance, étape 1 (ou le parcours désigné par le quiz) |
| Semaines 2 à 4 | « Quand ça tombe à plat » avant la première mission en face (marche 3) ; premier mot de Vocabulaire repéré dans une vidéo | « Comment c'est construit » : le faux secret ; mission marche 3 à la machine à café ; bilan de Machine à Café à la semaine 3 | Écouter, repérer ; mission marche 3 avec un ami proche ; le carnet du mois en lecture |
| Après la V1 | Parcours Confiance et Storytelling ; marches 4 et 5 | Parcours Boulot ; situations avec un supérieur (version avancée) | Parcours Storytelling ; marche 4 en groupe |

Chaque cellule « Jour 7 » dépend du parcours que l'abonné a réellement commencé ; ce sont des cas types, pas des cheminements imposés. Aucune relance : si l'abonné n'ouvre pas l'espace, rien ne part. Ce qui l'attend à son retour s'affiche à l'ouverture de « Aujourd'hui ».

### 4.4 Aujourd'hui, jour par jour

- **Premier jour** : salutation, le premier pas, la situation du jour. Rien de vide (brief §3.2).
- **Jours suivants** : la rafale (3 situations, 3 à 5 minutes), une révision si une situation a été ratée 2 ou 7 jours plus tôt, « Reprendre » le parcours en cours, la mission en cours si elle est ouverte.
- **Semaine** : date conseillée de la prochaine étape, carnet du mois (flux de « Quoi répondre »), lettre du jeudi (arrive par e-mail ; l'espace n'en reprend pas le texte).
- **Fin de mois (environ J25 à J30)** : une carte « Ton mois » : situations faites, étapes validées, missions tentées, tirées de ce qui est déjà enregistré, sans appel à payer. C'est une présentation de progression, pas une promesse.

### 4.5 Au-delà de la V1 : qui ajoute quoi, à quel rythme

Règle du 25/10 déjà en place pour les lettres : un mois de contenu ajouté chaque mois, en session, jamais par tâche planifiée ni génération automatique. Proposition [HYPOTHÈSE, à fixer avec Thomas après le premier lot] :

| Rythme | Quoi | Qui |
|---|---|---|
| Mensuel | Le carnet du mois (30 fiches, déjà prévu) ; 1 à 2 « Écouter, repérer » ; une dizaine de situations à 3 répliques ajoutées à la rafale (rendement à mesurer, section 7) | @copywriter en session avec Thomas, même contrôle que les lettres |
| Trimestriel | Une série de 4 à 5 jeux neufs ; réévaluation des types peu utilisés (section 7.6) | @creative-strategy, @data-analyst |
| Alerte | Quand le stock de situations non vues par un abonné régulier approche de la fin (même logique que `/api/health` pour les vannes, décision du 18/10) | @fullstack |

---

## 5. Parcours : découpage sans rien perdre, temps, niveaux

### 5.1 Principe : l'étape devient une série de fiches

On garde les 5 parcours, leurs 25 étapes et leurs textes. Chaque étape devient un sous-parcours de fiches courtes numérotées « Voir / Fait ». Aucun texte validé n'est réécrit (règle d'or P0 s18, étalons s17 à s19). Les ancres d'étape `#etape-N` restent (les lettres approuvées y pointent) ; les fiches s'ajoutent en `#fiche-N-M`. La mesure du diff réel (taux de changement, slugs, titres, liens, chiffres, prix) est obligatoire à chaque parcours (P0 s11). Compléments propres à Storytelling (second défi, phrase de protection) et à Boulot (« Version sans risque », « Aller au défi ») : conservés, chacun devient une fiche ou une partie de fiche (INV T8, gabarit à fixer au lot de découpage).

### 5.2 Exemple complet : Machine à Café, étape 1

Blocs existants lus dans `parcours-seed.json` : scène (`moduleDetail`), « pourquoi » (`why`), conseil « L'humour à la machine à café » avec exemple et défi, 5 vannes, 2 vidéos (Paul Séré « Les relations amoureuses », Karim Duval « Génération Y »), quiz de 4 questions, 50 XP, étape gratuite. Durées : estimations de lecture INV 3.1 [HYPOTHÈSE], à chronométrer avec un lecteur.

| N° | Fiche | Origine | Geste | Durée | Cœur ou plus loin |
|---|---|---|---|---|---|
| 1.1 | Le conseil et son défi (la scène fondue en introduction) | Conseil existant, scène existante, inchangés | Le défi du conseil | 4 min | Cœur |
| 1.2 | Les 5 vannes | 5 vannes existantes, inchangées | Choisir celle que tu ressortiras cette semaine | 2 min | Cœur |
| 1.3 | Écouter : des vannes enchaînées | Vidéo 1, Paul Séré, existante | Repérer l'amorce et la chute d'une vanne | 7 min | Cœur |
| 1.4 | Écouter : détourner le jargon | Vidéo 2, Karim Duval, existante | Repérer le mot de jargon détourné | 7 min | Plus loin (voir C2) |
| 1.5 | Le quiz de l'étape | Quiz existant (4 questions), inchangé | Répondre | 2 min | Cœur |
| 1.6 | Une situation liée : le collègue qui lance « ça va ? » | NEUVE, prise dans « Quoi répondre » | Choisir, dire (marche 1) | 5 min | Plus loin |
| 1.7 | Le faux secret, comment c'est construit | NEUVE, prise dans « Comment c'est construit » | Écrire ton faux secret | 5 min | Plus loin |

- Ce qui est perdu : rien. Les 6 blocs existants (conseil, défi, 5 vannes, 2 vidéos, quiz, plus la scène et le « pourquoi » fondus dans 1.1) sont tous là, mot pour mot.
- Ce qui s'ajoute : 2 fiches neuves, qui sont des entrées de la bibliothèque (une seule fiche, deux portes : le parcours et la rubrique), pas des textes dupliqués.
- Total : 7 fiches. Cœur : environ 15 min si la vidéo 2 passe en « plus loin », environ 22 min sinon (cohérent avec l'étape actuelle, environ 22 à 25 min d'après INV). Les fiches neuves s'ajoutent sans effet sur le « Fait » de l'étape.
- Le « Fait » de l'étape (XP, série) reste celui d'aujourd'hui : le défi du conseil et le quiz.
- Ce que les 4 autres parcours demandent : le même découpage, relu étape par étape sur les seeds avant écriture [À VÉRIFIER : seuls Machine à Café étapes 1 et 2 ont été relus ici ; INV T8].

### 5.3 Total de fiches (réconciliation)

| Quoi | Nombre | Détail |
|---|---|---|
| Fiches issues de l'existant | 5 par étape x 25 = 125 | conseil, vannes, 2 vidéos, quiz (4 blocs réunis ou non selon le seed) [À VÉRIFIER par parcours] |
| Entrées de la bibliothèque rattachées à une étape | 2 par étape x 25 = 50 | prises dans les 153 fiches neuves, pas ajoutées en plus |
| Total par parcours (exemple Confiance, 6 étapes) | 42 | 6 x 7 |
| Total sur les 5 parcours | 175 emplacements | dont 125 existants et 50 neufs, ces 50 étant des entrées de la bibliothèque |
| Neuves hors parcours (rubriques) | 153 - 50 = 103 | situations, vocabulaire, jeux, séances, formules, écouter, rattrapages restants |

La v1 donnait « 125 à 150 » et « 40 % de neuves » : chiffres abandonnés.

### 5.4 Ordre conseillé : « Tes 4 premières semaines »

En tête de « Parcours », un ordre conseillé de 4 semaines, assemblé à partir de fiches existantes ou neuves, sans nouveau parcours ni nouveau niveau (c'est le « Parcours Débutant » de la capture) :
- Semaine 1 : 5 situations (« Les 5 situations pour commencer »), un mécanisme (le faux secret), mission marche 1.
- Semaine 2 : l'étape 1 du parcours que le quiz a désigné (ou Machine à Café) ; mission marche 2.
- Semaine 3 : une séance de 20 minutes ; mission marche 3.
- Semaine 4 : le bilan du parcours si le parcours est fini, sinon l'étape suivante conseillée.

Yanis n'a aujourd'hui aucun parcours DEBUTANT sur son sujet (Machine à Café et Boulot sont DEBUTANT et parlent de bureau ; Répartie, Confiance et Storytelling sont INTERMEDIAIRE). Cet ordre conseillé lui donne une marche 1 sans toucher à « les 5 parcours ». Un 6e parcours Répartie pour Yanis est à la roadmap depuis le 07/10 : le prolonger est l'option C de la question C8.

### 5.5 Accès visiteur et abonné (aucun compte gratuit, rien d'ouvert ni retiré aux visiteurs, décisions du 05/10)

| Contenu | Visiteur | Abonné Premium |
|---|---|---|
| Étape 1 de chaque parcours (existante) | Page publique actuelle, inchangée | Découpage en fiches (rendu côté abonné, brief §3.3) |
| Fiches neuves (tous types) | Rien | Tout |
| Glossaire `/glossaire` (12 termes) | Public, inchangé | Public, plus la rubrique Vocabulaire (40 mots) |
| Carnet | Extrait actuel, inchangé ([CHOIX UTILISATEUR] 05/10) | Tout, dans « Quoi répondre » |
| Exercices et missions | Jamais (helpers `champs-premium.ts`, brief §2.5) | Tout |
| Pages de l'espace | `noindex` | `noindex` |

Aucun extrait des nouvelles rubriques pour les visiteurs en V1. Si Thomas veut un extrait pour la conversion, c'est une décision séparée qui touche la décision du 05/10 (rien ouvert aux visiteurs) : non posée ici pour ne pas multiplier les questions.

---

## 6. Barre de rubriques et portes

### 6.1 Contraintes

6 entrées visibles au plus, « Plus » compris (12/11, Q3 = A) ; « Mon espace » (Q2 = A) ; la barre s'affiche aussi sur les pages publiques pour l'abonné (Q11 = A) ; **« Mon profil » reste dans le menu de compte, hors des 6, et mène aux réglages** (`/profil`, 15 textes validés disent « depuis ton profil ») ; libellés en texte ; aucune rubrique vide à l'ouverture ; aucun doublon ; une porte unique par page ; `header-budget.spec.ts` fige les onglets (à mettre à jour avec le libellé validé, @ux et @design).

### 6.2 Trois variantes, présentées comme UNE question (C1)

| | Variante 1 (recommandée) | Variante 2 | Variante 3 |
|---|---|---|---|
| Les 6 entrées | Aujourd'hui, Parcours, Quoi répondre, Vocabulaire, Catalogue, Plus | Aujourd'hui, Parcours, Quoi répondre, S'entraîner, Vocabulaire, Plus | Aujourd'hui, Parcours, Quoi répondre, Comprendre, Catalogue, Plus |
| Rubrique « Vocabulaire » | Visible. Elle ouvre trois portes : Vocabulaire (les mots), Comment c'est construit, Formules à détourner | Visible, même contenu | Dans « Comprendre » (Vocabulaire, Comment c'est construit, Formules) |
| Catalogue (vannes, conseils, vidéos, écouter-repérer) | Visible, 1 clic | Dans « Plus » | Visible |
| Jeux et séances | Une carte dans « Aujourd'hui » + lien depuis chaque fiche + « Plus » | Visibles : onglet « S'entraîner » (rafale, jeux, séances, missions) | Carte dans « Aujourd'hui » + « Plus » |
| Pour | Respecte « tout Deviens Marrant ouvert » (19/10) ; « Vocabulaire », mot de Thomas, visible | Met la pratique au premier plan (le moteur du 2.2) | Nom qui dit ce qu'on y fait ; une seule porte pour tout le « comprendre » |
| Contre | Le nom « Vocabulaire » couvre trois portes ; les jeux ne sont pas un onglet | Catalogue payé repoussé dans « Plus » ; sur `/vannes` l'onglet actif serait « Plus » | « Vocabulaire » n'est pas visible tout de suite (une porte de plus) ; « Comprendre » peut faire scolaire |

Reco : variante 1. Raison : le catalogue est ce que l'offre vend, il reste à un clic ; « Vocabulaire » est le mot de Thomas ; la pratique vit dans « Aujourd'hui » où elle est ouverte chaque jour. Si Thomas veut les jeux visibles, la variante 2 est la bonne, au prix du catalogue en « Plus ». Libellés à valider sur rendu sombre (P0 s8).

### 6.3 Porte unique de chaque page (variante 1)

| Page ou contenu | Porte | Remarque |
|---|---|---|
| `/mon-espace` (Aujourd'hui) | Aujourd'hui | Rafale, premier pas, jeux, mission en cours |
| `/parcours`, `/parcours/[slug]` | Parcours | Fiches « Voir / Fait », « Tes 4 premières semaines » en tête |
| Situations et carnet (`/carnet`, `/carnet/[mois]`) | Quoi répondre | Le carnet est le flux mensuel ; URL conservées |
| Glossaire `/glossaire` | Vocabulaire | Un seul glossaire : le public (12 termes) est la vitrine, l'espace prolonge |
| Comment c'est construit, Formules | Vocabulaire (3 portes) | |
| Vannes, conseils, vidéos | Catalogue | |
| Écouter, repérer | Catalogue (porte « Écouter, repérer ») et dans les étapes | Une leçon, rangée avec les vidéos qu'elle décortique |
| Quiz d'humour `/quiz-humour` | Plus | Et en premier pas si pas encore passé (4.2) |
| Articles (blog) | Plus | Reste public (SEO, brief §3.1) |
| Favoris, notes | Plus | |
| Écrire à l'équipe | Plus, et « Montre-la à l'équipe » depuis les fiches (C5) | |
| Lettre | Plus | |
| Jeux, séances | Aujourd'hui (carte) et Plus | |
| Mon profil (réglages, abonnement, résiliation) | Menu de compte, hors des 6 | `/profil` garde son adresse |

### 6.4 Correspondance partagée avec la capture

| Rubrique de la capture | Décision de la v2 |
|---|---|
| Guides | Comment c'est construit et Quand ça tombe à plat (fiches courtes) ; les articles longs restent publics (Plus) |
| Parcours | Parcours |
| L'atelier des mots | Vocabulaire (les mots) ; l'écriture guidée passe par Comment c'est construit et les Formules |
| Grammaire | Comment c'est construit |
| Vocabulaire | Vocabulaire |
| Expressions et proverbes | Formules à détourner (la partie « situations » du carnet est dans Quoi répondre) |
| Apprendre, lire et écouter | Catalogue (vidéos) et Écouter, repérer ; articles en Plus |
| Exercices et jeux | Jeux (Aujourd'hui, Plus) |
| Favoris, Mes notes | Plus (notes : question Q5b du brief, hors de ce document) |
| Ateliers | Séance de 20 minutes ; pas de coaching en direct (supprimé le 13/10) |
| Écrire au coach | Écrire à l'équipe (Plus) |
| Test de fin de section | Le bilan du parcours |
| (hors capture, demande de Thomas) | Quoi répondre |

### 6.5 Ouverture et rubriques vides

La barre est pilotée par les données : une entrée n'apparaît que lorsque son seuil d'ouverture (7.4) est atteint. Aucune rubrique vide, aucun « bientôt ».

---

## 7. Production

### 7.1 Règle de relecture (décision du 12/11 : 10/10 chez tous)

Pour tout contenu de l'espace (étalons puis production) : relecture à l'aveugle par des agents indépendants, notes sur 10 par critère, corrections, nouveau tour, jusqu'à 10/10 chez tous les relecteurs. Cette règle remplace « 2 relecteurs sur 3 » et « barre 9/10 » (08/10, 25/10) pour l'espace seulement ; le garde-fou « faute objective » du 08/10 reste (une faute objective est corrigée quel que soit le vote). Barre « niveau Alexa » pour toute vanne ou réplique : chute surprenante, courte, logique, observation vraie, jamais entendue ailleurs. Pas de réplique plutôt qu'une réplique moyenne.

Quand les verdicts ne convergent pas (même situation qu'en s19, choix 7 de Boulot : six réécritures sans convergence, verdicts inversés sur des textes quasi identiques) : après 4 tours sans convergence [HYPOTHÈSE : seuil de 4 tours, à confirmer], on arrête d'itérer, on remonte la décision à Thomas avec les deux versions et les verdicts. Un contenu sous la barre n'entre jamais en ligne (règle d'or P0 s18) : à défaut de décision, la fiche reste hors ligne ou perd sa réplique faible (la risquée) et la situation sort à 2 répliques (7.3).

### 7.2 Pipeline par fiche

1. Étalon validé par Thomas (par type, section 9) avant tout brief @copywriter.
2. Écriture par lots de 10 par @copywriter, avec 3 candidates par emplacement de réplique [HYPOTHÈSE, voir 7.3].
3. Contrôle de vérité : citations, minutes, définitions et sources vérifiées avant relecture.
4. Relecture à l'aveugle (7.1), puis passage Stand-Up Director sur les répliques.
5. Mesure du diff réel pour tout contenu existant reconditionné (P0 s11).
6. Lecture de Thomas : les étalons en entier, puis un échantillon de 10 fiches par lot (taille proposée [HYPOTHÈSE]), pas toutes les fiches. La mise en ligne reste sur son go écrit, derrière l'interrupteur fermé du brief. Sauf avis contraire de Thomas, c'est la règle.

### 7.3 Capacité par type

Faits de rendement : 10 vannes neuves validées sur 19 pour Boulot (53 % après 5 tours), environ 180 candidates pour 15 fiches du carnet d'octobre (environ 1 sur 12), 30 vannes au niveau sur 333 le 30/09. Pour des répliques en situation (plus contraintes qu'une vanne libre), la fourchette de rendement est donc de 1 sur 2 à 1 sur 12 [HYPOTHÈSE].

| Type | Emplacements à tenir | Candidates à écrire [HYPOTHÈSE : 3 par emplacement, 12 en cas de rendement carnet] | Tours attendus | Barre humour |
|---|---|---|---|---|
| Quoi répondre (3 répliques) | 60 x 3 = 180 répliques | 540 (jusqu'à 2 160) | 3 à 6 [HYPOTHÈSE d'après Boulot] | Oui, Alexa |
| Formules à détourner | 60 détournements | 180 | 3 à 6 | Oui |
| Jeux « Finis la phrase », « Remets la chute » | environ 20 chutes | 60 | 3 à 6 | Oui |
| Comment c'est construit, Vocabulaire, Écouter, Rattrapage, Bilan, Séances | 8 + 12 + 12 + 8 + 5 + 6 = 51 fiches de texte | 1 version, corrigée | 2 à 3 | Seulement les exemples |

Règles : (a) 60 est une cible de situations VALIDÉES, pas une coupe ; si le rendement est bas on écrit plus de candidates, jamais moins de situations ni une barre abaissée. (b) Une situation peut sortir avec 2 répliques bonnes sur 3 (la risquée est la plus fragile) ; on ne force pas la troisième. (c) Point de contrôle après le premier lot de 10 : on mesure le rendement réel, on met à jour ce tableau et on le montre à Thomas avant le lot 2.

Nombre de lots de situations : 6 (de 10). Lectures de Thomas : 5 étalons, puis un échantillon par lot, soit environ 6 passages courts plus les étalons des autres types, au lieu de 22 lectures de 10 fiches.

### 7.4 Ordre de production et seuils d'ouverture

| Ordre | Quoi | Dépend de | Seuil d'ouverture de la rubrique |
|---|---|---|---|
| 0 | Étalons (5) | Thomas | Bloquant pour tout |
| 1 | Vocabulaire et Comment c'est construit, en parallèle (ils fixent les noms) | Étalons E2, E3 | Vocabulaire : 4 fiches (20 mots) en plus du glossaire ; construction : 6 fiches |
| 2 | Quoi répondre : lots 1 à 6 | Noms fixés en 1, champs « contextes » de la rafale | 30 situations neuves validées ; la rafale et le premier pas s'ouvrent avec elles |
| 3 | Découpage des 25 étapes en fiches (diff mesuré) | 2 et modèle de données (@product-manager, @fullstack) | Parcours par parcours, Machine à Café d'abord |
| 4 | Jeux et Formules | 2 | Jeux : 10 ; Formules : 4 |
| 5 | Écouter, repérer : lancer tôt, les vérifications de sources sont lentes (INV T5) | Étalon E4 | 4 fiches vérifiées |
| 6 | Rattrapages, bilans, séances | 2, 3 | Selon la rubrique |

Première rubrique ouverte : Quoi répondre, parce que c'est la demande verbatim de Thomas et le cœur de la valeur pour les trois personas.

### 7.5 Vérificateur de citations (prérequis, pas recommandation)

Aucune fiche Écouter, repérer n'est écrite avant que : (a) INV T5 soit levé (Rollman, Haroun, Ngijol, Bun Hay Mean) ; (b) chaque passage soit visionné et minuté par une personne ; (c) chaque citation soit vérifiée sur la source, page ouverte, par un relecteur indépendant de l'auteur.

### 7.6 Mesure de la valeur du contenu neuf

Lire une fiche ne laisse aucune trace (INV T4). Le « Fait » par fiche (qui demande une table neuve, décision @product-manager et @fullstack) rend l'usage visible pour la première fois. Mesure minimale [aucune cible chiffrée inventée : à poser avec @data-analyst avec la mesure du lot 0] :

| Axe | Événement | Source |
|---|---|---|
| Adoption | Premier pas fait le jour 1 | « Fait » de la première fiche |
| Engagement | Fiches « Fait » par semaine ; rafales terminées ; missions tentées | « Fait », résultats de rafale, retours de mission |
| Rétention | Retour à J7 | Événement serveur d'ouverture de l'espace |
| Utilité par type | Part des fiches ouvertes dont le geste est fait | « Fait » par type |

Seuil de refonte d'un type : réévaluation à 60 jours [HYPOTHÈSE de seuil, à fixer par @data-analyst]. Sans cette mesure, on ne saura pas si « Comment c'est construit » sert ou fait joli.

---

## 8. Questions pour Thomas (C1 à C8)

Numérotation propre à ce document : « C » pour contenu, sans collision avec Q1 à Q12 du brief. Chaque question a 3 options et une reco, sans jargon. Une option qui rouvre une décision déjà prise est marquée « rouvre la décision du JJ/MM ». Les défauts évidents sont tranchés sans question (gradation « la sûre / la joueuse / la risquée », humoristes récents nommés, rien d'ouvert aux visiteurs, noms de techniques seulement dans « Vocabulaire » et « Comment c'est construit »).

**C1. Quelle barre en haut de l'espace ?** (rendu sombre à voir avec les noms)
- A. Aujourd'hui, Parcours, Quoi répondre, Vocabulaire, Catalogue, Plus. Le catalogue reste à un clic, « Vocabulaire » est visible, les jeux sont dans « Aujourd'hui ». **Reco.**
- B. Aujourd'hui, Parcours, Quoi répondre, S'entraîner, Vocabulaire, Plus. La pratique a son onglet ; le catalogue passe dans « Plus ».
- C. Aujourd'hui, Parcours, Quoi répondre, Comprendre, Catalogue, Plus. « Vocabulaire » devient une porte dans « Comprendre ».
Dans les trois cas, « Mon profil » reste dans le menu de ton compte.

**C2. Combien de temps par semaine promet-on ?** Aujourd'hui une étape demande environ 22 à 25 minutes (estimation de lecture, deux vidéos de 5 à 8 minutes), pour « 15 à 20 min/semaine » annoncé.
- A. On garde la promesse : le cœur de chaque étape tient dans 15 à 20 minutes, la 2e vidéo et les nouvelles fiches passent en « pour aller plus loin », facultatives. Aucun texte validé n'est modifié. **Reco.**
- B. On change la promesse affichée (par exemple « 20 à 30 min/semaine ») : rouvre la décision du 29/09 (« 15 à 20 min/semaine ») et la décision du 07/10 (inchangé) ; il faut ton go pour chaque texte qui la porte.
- C. On ne touche à rien : la promesse reste, les 2 vidéos restent obligatoires, les nouvelles fiches vivent seulement dans leurs rubriques. L'écart avec la promesse reste.

**C3. Veux-tu un entraînement quotidien ?** Trois situations par jour (3 à 5 minutes), celles qu'on rate reviennent 2 puis 7 jours plus tard, et des missions pour tenter dans la vraie vie (seul, avec un proche, en groupe), avec un retour en un clic. Rien n'est envoyé : tout se passe quand l'abonné ouvre l'espace.
- A. Oui, complet. Le site retient un résultat de choix par situation et le retour de chaque mission (trois valeurs fermées déjà utilisées pour les exercices, aucun texte libre). Aucune décision rouverte ; une table à créer. **Reco.**
- B. Oui, sans mémoire : trois situations tirées au hasard, pas de révision, rien n'est retenu.
- C. Non : des fiches et des parcours, pas d'entraînement quotidien.

**C4. La série et les points pour tout ça ?** Aujourd'hui la série compte les jours où l'abonné valide une étape ou termine un quiz d'étape.
- A. Aucune nouvelle règle : la rafale et les fiches ne comptent ni pour la série ni pour les points. On mesure l'usage 30 jours avant d'y revenir. **Reco.**
- B. Une rafale terminée compte comme une pratique pour la série, jamais pour les points : rouvre la décision du 07/10 (série comptée sur l'étape validée ou le quiz d'étape).
- C. B, plus des points pour chaque fiche faite : nouvelle règle de points (ton accord est requis) et rouvre la décision du 07/10.

**C5. Quel retour quand l'abonné écrit sa propre réplique ?**
- A. Une grille de 3 questions oui ou non qu'il se pose lui-même (« elle tient en une phrase ? », « tu vises toi ou une chose, pas la personne ? », « la fin surprend ? »). Rien n'est enregistré.
- B. A, plus un lien « Montre-la à l'équipe » qui préremplit « Ta question à l'équipe » (réponse sous 1 à 2 jours ouvrés, rien en base, limites déjà codées). Charge de réponse en plus pour l'équipe. **Reco.**
- C. A, plus l'enregistrement des réponses dans « Mes notes » : rouvre la décision du 07/10 (aucun texte libre stocké) et demande un avis juridique court.

**C6. Les situations des lettres du jeudi ?** Le 25/10 tu as dit que la lettre doit apporter ce que le site ne donne pas.
- A. Jamais reprises : le site a ses propres situations, les lettres gardent les leurs. **Reco.**
- B. Une situation de lettre entre dans « Quoi répondre » 3 mois après son envoi, retravaillée : rouvre la décision du 25/10.
- C. Les lettres déjà reçues restent consultables telles quelles dans « Plus », sans copie dans « Quoi répondre » : rouvre la décision du 25/10 sur le principe.

**C7. Quels univers pour les situations ?**
- A. Tous les univers du quotidien : coloc, boulot, famille, amis, magasins, transports, soirées, rencard et couple. Pour Yanis et Sophie, le rencard est une scène centrale. Pour Marc, la rupture se traite avec légèreté sur le fait de recommencer à parler, jamais sur la personne. Pas de deuil. **Reco.**
- B. Comme le widget : sans rencard, soirées, ni couple. Plus sûr, mais on perd les scènes de Yanis et de Sophie.
- C. Tout sans exception, rupture et deuil compris, sans précaution : Marc y trouverait son sujet, mais le risque de blesser est réel.

**C8. Niveaux et entrée de Yanis ?** Dans les données, les niveaux sont DEBUTANT et INTERMEDIAIRE (Machine à Café et Boulot sont DEBUTANT, Répartie, Confiance et Storytelling INTERMEDIAIRE). Yanis n'a pas d'entrée débutante sur son sujet.
- A. Un ordre conseillé « Tes 4 premières semaines » en tête de « Parcours », les niveaux actuels, et des fiches « pour aller plus loin » sans nom de niveau. **Reco.**
- B. A, plus un niveau « avancé » créé : ajoute une valeur au code et aux libellés, accord requis.
- C. A, plus un sixième parcours débutant pour Yanis : rouvre les textes validés qui disent « les 5 parcours » (offre, e-mails approuvés) et prolonge la roadmap du 07/10.

---

## 9. Étalons à calibrer avec Thomas en premier (5)

Chaque étalon passe d'abord 10/10 chez tous les relecteurs à l'aveugle (décision du 12/11), puis Thomas choisit entre 2 versions. Les noms de rubriques et de gradation sont présentés en même temps, en rendu sombre.

| # | Étalon | Ce qu'il fixe |
|---|---|---|
| E1 | Une situation « Quoi répondre » complète : 3 répliques (la risquée à écrire), règle, erreur courante, geste, 2 contextes de rafale | La voix de l'espace et le niveau des 60 situations ; la gradation ; la forme de la rafale |
| E2 | Une fiche « Comment c'est construit » (le faux secret) et une fiche « Formules à détourner » | L'absence de ton scolaire ; la grille de retour sur sa réplique ; le niveau des détournements |
| E3 | Une fiche Vocabulaire (5 mots) | Le niveau de jargon assumé ; la fusion avec le glossaire public |
| E4 | Une fiche « Écouter, repérer » sur un humoriste récent choisi par Thomas | Le choix des humoristes ; le degré de découpage ; la méthode de vérification |
| E5 | Un jeu, une mission avec son retour, et une question de bilan | L'interaction (choisir, écrire, dire, tenter) ; le ton de « Ce qu'on aurait pu dire » ; « Essayé, bof » vers « Quand ça tombe à plat » |

---

## Annexe A. Traitement de chaque correction des tours 1

Sigles : UX = `tour-1-ux.md` (18 corrections), EL = `tour-1-elon.md` (20), RE = `tour-1-reviewer.md` (25). « Appliqué » renvoie à la section de ce document. Les refus ou applications partielles sont expliqués.

| Correction | Traitement |
|---|---|
| UX1 découpage perd du contenu, étape allongée | Appliqué : 5.2 (tous les blocs listés, durée affichée) ; question C2 |
| UX2 aucun chemin dans le temps | Appliqué : section 4 (jour 1, J7, semaines 2 à 4, après la V1, par persona) |
| UX3 aucune échelle de progression | Appliqué : paliers de lecture 4.1, « Tes 4 premières semaines » 5.4. Un niveau « avancé » n'est pas créé (C8) |
| UX4 faits faux, non réconciliés | Appliqué : section 1 (149, 120, 89), « 290+ » et « 60+ » supprimés, glossaire 12, carnet 15 + 30, lettres 6 + 16. Appliqué en partie : 264 décryptages pour 149 vannes actives non expliqué (non lu, [À VÉRIFIER]), fichier cité `joke-decryptages.json` |
| UX5 contradictions entre les deux documents | Appliqué : un seul découpage (5.2, 5.3), ateliers = séances hors écran (3.11), bilan = fin de parcours (3.10), « 22 situations » abandonné (C6), options XP alignées (C4) |
| UX6 rubriques illisibles, doublons | Appliqué : 6 (« Les bases » supprimé, carnet fusionné, glossaire unique, une porte par page y compris Articles, Quiz, Lettre) |
| UX7 questions non marquées, numérotation | Appliqué : section 8, C1 à C8, options marquées, sans jargon (« sous-parcours », « étiquette », « ISR » retirés) |
| UX8 exemples sous la barre | Appliqué : section 3 (GPS et rond-point supprimés, exemples tirés du carnet ou du seed avec source, répliques à écrire laissées en place) |
| UX9 faisabilité non chiffrée | Appliqué : 7.3 (capacité par type, rendement, point de contrôle), 7.5 (vérificateur en prérequis) |
| UX10 règle d'accès | Appliqué : 5.5 |
| UX11 ancres | Appliqué : 5.1 (`#etape-N` conservées, `#fiche-N-M`) |
| UX12 définition contredite par une fiche sans geste | Appliqué : 2.1, 5.2 (geste ajouté à chaque fiche) |
| UX13 recouvrement des notions | Appliqué : 3.4 (une notion, une fiche maîtresse) |
| UX14 volumes sans source | Appliqué : 3.2 ([HYPOTHÈSE] et justification par la rafale), 7.3 |
| UX15 navigation mobile et budget | Appliqué en partie : « Mon profil » hors des 6 (6.1). Le dessin du panneau « Plus » et du budget par taille d'écran reste à @ux et @design (hors de ma mission) |
| UX16 filtres de situations obscurs | Appliqué : 3.3 (deux filtres en clair, chemin « Les 5 situations pour commencer ») |
| UX17 seuil d'ouverture par rubrique | Appliqué : 6.5, 7.4 |
| UX18 mesure de la valeur | Appliqué : 7.6 |
| EL1 moteur d'entraînement | Appliqué : 2.2, C3. Ce n'est pas un type de fiche mais un mode, comme proposé |
| EL2 échelle d'exposition à 5 marches | Appliqué : 2.2 (missions) |
| EL3 retour sur sa réplique | Appliqué : 2.2, C5 (grille sans stockage ; « Montre-la à l'équipe » ; enregistrement refusé par défaut car il rouvre le 07/10) |
| EL4 lettres réservées | Appliqué : jamais reprises (C6 A, 3.3). Le délai de 3 mois proposé par @elon est offert en option marquée (C6 B), pas en défaut |
| EL5 promesse de temps | Appliqué : 5.2, C2 |
| EL6 découpage qui garde tout | Appliqué : 5.2 |
| EL7 doublon Situations et Carnet | Appliqué : 3.3, 6.3 (carnet = flux mensuel de « Quoi répondre ») |
| EL8 renommer les rubriques | Appliqué : « Quoi répondre » (3.1), « Mon profil » (6.1), pratique dans « Aujourd'hui » ou onglet (variante B de C1). Refusé en recommandation : « Comprendre » à la place de « Vocabulaire » (variante C de C1, non recommandée) car « Vocabulaire » est le mot de Thomas du 12/11 et doit être visible |
| EL9 dé-scolariser | Appliqué : 3.1 (« Comment c'est construit », « Le bilan du parcours », « Ce qu'on aurait pu dire », « Formules à détourner », « Séance »). Refusé : renommer « Vocabulaire » en « Les mots du métier », pour la même raison |
| EL10 gradation alignée | Appliqué : « la sûre / la joueuse / la risquée », tranché sans question (défaut évident) |
| EL11 « Fait » = geste | Appliqué : 2.1. L'option « Fait seulement à la fin de l'étape » est retirée des questions |
| EL12 entrée de Yanis | Appliqué : 5.4, C8 (sans 6e parcours en reco) |
| EL13 définir l'avancé | Appliqué en partie : une « version avancée » par type (section 3), paliers (4.1), C8. Refusé : une répartition chiffrée débutant, intermédiaire, avancé des fiches, car « avancé » n'est pas un niveau du code et dépend de C8 |
| EL14 chiffres périmés, dates | Appliqué : section 1 ; la date fausse (« règle du 15/10 ») n'est plus citée, la règle est le P0 du 05/10 ; « 40 % de neuves » abandonné (5.3) |
| EL15 une seule liste de questions | Appliqué : 8 questions fusionnées (INV, v1, nouvelles), l'option de remplissage « tout d'un coup » retirée, la drague dite en clair (C7) |
| EL16 rendement de production | Appliqué : 7.2, 7.3 (a, b, c), 7.5 (d) |
| EL17 exemples au niveau ou pas d'exemple | Appliqué : exemples sourcés ou structure avec « à écrire » |
| EL18 lignes persona spécifiques | Appliqué : une scène par persona dans chaque type (section 3) |
| EL19 critères d'arrêt | Appliqué : 7.6 (seuil à 60 jours, [HYPOTHÈSE]) |
| EL20 widget | Appliqué : 3.3 (stock du widget séparé, fiche complète Premium) |
| RE1 10/10 contre 2 sur 3 | Appliqué : 7.1 |
| RE2 « Mon compte » | Appliqué : « Mon profil » partout |
| RE3 lettres réutilisées | Appliqué : C6, 3.3, 3.7 (le format B est un gabarit, jamais un texte repris) |
| RE4 temps par étape | Appliqué : 5.2, C2 |
| RE5 exemple de découpage | Appliqué : 5.2 |
| RE6 « 290+ » et « 60+ » | Appliqué : section 1 |
| RE7 « Avancé » inventé | Appliqué : seulement DEBUTANT et INTERMEDIAIRE, C8 |
| RE8 options qui défont le 12/11 | Appliqué : options retirées ou marquées (C8 B et C, C4) |
| RE9 production non chiffrée | Appliqué : 7.3 ; allègement de Thomas par échantillon (7.2) |
| RE10 aucune question sur la barre | Appliqué : C1 |
| RE11 jeux cachés dans « Plus » | Appliqué : carte dans « Aujourd'hui » et lien depuis chaque fiche (3.9, 6.2) |
| RE12 ouverture par rubrique contre barre | Appliqué : barre pilotée par les données (6.5), ordre justifié par la valeur persona (7.4) |
| RE13 date et option de remplissage (humoristes) | Appliqué : date supprimée, question supprimée (défaut P0 du 05/10), 12 fiches plus 1 à 2 par mois (3.7) |
| RE14 univers des situations | Appliqué : C7, rencard et couple dits en clair |
| RE15 gradation | Appliqué : comme EL10 |
| RE16 famille « scène » du vocabulaire | Appliqué : 3.5 (retirée, chaque mot sourcé, un seul glossaire) |
| RE17 doublons de structures | Appliqué : 3.4 |
| RE18 tableau de réconciliation | Appliqué : 3.2 et 5.3 |
| RE19 annexe qui répond déjà | Appliqué : réponses intégrées, annexe B ne garde que l'inconnu |
| RE20 correspondance partagée avec la capture | Appliqué : 6.4 |
| RE21 corps d'INV non mis à jour | Appliqué en partie : la v2 n'utilise que la section 6 de INV. Refusé : modifier INV, c'est le document de @product-manager, hors de ma mission ; à lui de le réaligner |
| RE22 numérotation des questions | Appliqué : C1 à C8 |
| RE23 exemples sous la barre | Appliqué : comme UX8 et EL17 |
| RE24 stock du widget et justification de 90 | Appliqué : 3.3 (60 neuves justifiées par la rafale : 3 par jour x 21 jours = 63 [HYPOTHÈSE]) |
| RE25 lire `lib/progression.ts` | Appliqué : lu, section 1 (le tableau de `progression-levels.md` est obsolète) |

## Annexe B. Ce qui reste inconnu

- Validation à l'aveugle du carnet d'octobre et de novembre (INV T3) : à lever avant de le ranger sous « Quoi répondre ».
- Découpage exact des 4 autres parcours (seuls Machine à Café étapes 1 et 2 ont été relus) et nombre de défis par conseil et par vidéo, pour l'étiquetage des missions.
- Explication des 264 décryptages pour 149 vannes actives.
- Contenu exact du glossaire (définitions) pour la reprise « mot pour mot ».
- Rendement réel des répliques en situation : mesuré au premier lot (7.3).
- Valeur de Q10 du brief (cas 3 du premier pas) : consignée avec la réponse.

## Annexe C. Agents spécialisés recommandés (angle mort vérifiable seulement)

| Agent | Type | Rôle | Justification | Priorité |
|---|---|---|---|---|
| Testeur-persona (Yanis, Sophie, Marc) | testeur | Lire 3 fiches de chaque type et la rafale, dire ce qui sonne cours ou ne donne pas envie | Le risque n°1 (ton scolaire, contenu qui ne change rien) ne se voit pas à l'écriture | Haute |
| Relecteur humoriste à l'aveugle | expert domaine | Noter les répliques, détournements et chutes sur la barre Alexa | 180 répliques et 60 détournements à tenir au niveau | Haute |
| Vérificateur de citations | expert domaine | Source, minute, exactitude de chaque passage (prérequis de 7.5) | Règle anti-invention, humoristes récents moins documentés | Haute |

Handoff vers @agent-factory si Thomas valide le périmètre.
