# Architecture pédagogique et contenus à inventer, espace Premium (s24)

> Auteur : @creative-strategy, 12/11/2026. Complète l'inventaire factuel de @product-manager (non refait ici).
> Sources lues : `project-context.md` (en-tête), `brief-espace-client-s24.md` (§1 à §3), `founder-preferences.md` (lignes du 29/09 au 12/11 utiles), `docs/copy/ton-alex.md`, la capture de référence (structure seulement), `parcours-seed.json` (début), carnet de novembre, `config/premium.ts`.
> Toute donnée non lue est marquée [À VÉRIFIER]. Tout texte d'illustration est marqué [EXEMPLE NON VALIDÉ] : aucun n'a passé la relecture à l'aveugle ni la barre « niveau Alexa ».
> Règle P0 s8 : les noms de rubriques et de formats sont des propositions de travail, à caler avec Thomas par étalons avant tout brief @copywriter.

> REMPLACÉ le 12/11/2026 par `architecture-contenu-v2.md` après le tour 1 de relecture (UX 6,1, Elon 5,6, Reviewer 5,7). Ce fichier n'est plus la base de travail ; ne pas s'y référer pour les chiffres ni les exemples.

## Résumé en 10 lignes

1. Une leçon chez nous = une fiche de 5 minutes environ qui apprend UNE chose et finit par UN geste (choisir, écrire, dire à voix haute). Le catalogue donne des vannes à ressortir ; la leçon apprend à en fabriquer et à choisir la bonne.
2. Neuf types de fiches neufs : Guide, Situation (« quelle réponse dans quelle situation »), Grammaire de la vanne, Vocabulaire, Expressions, Écouter et décortiquer, Exercice et jeu, Test de section, Atelier.
3. Le cœur : la bibliothèque de Situations (90 en V1, trois répliques graduées, la règle pour choisir, l'erreur courante, l'exercice), qui prolonge le format A des lettres réservées.
4. Volume neuf V1 : environ 220 fiches, dont 90 situations. Le goulot n'est pas l'écriture mais la relecture à l'aveugle et le calibrage avec Thomas.
5. Organisation recommandée : on garde les 5 parcours thématiques ; chaque étape devient un sous-parcours de 5 à 6 fiches numérotées « Voir / Fait » ; le niveau devient une étiquette, pas une structure. Aucun niveau inventé.
6. Les parcours existants ne perdent rien : conseil, vannes, vidéos et quiz de chaque étape deviennent des fiches, mots inchangés (mesure du diff obligatoire, P0 s11).
7. Barre recommandée : Aujourd'hui, Parcours, Situations, Les bases, Bibliothèque, Plus.
8. Aucune règle d'XP nouvelle décidée ici : trois propositions soumises (section 2.5).
9. Production : 5 étalons avec Thomas d'abord, puis vocabulaire et grammaire, puis situations, puis fiches de parcours et jeux, puis décryptages (citations vérifiées) et ateliers.
10. 8 questions pour Thomas en section 5, dont 2 qui touchent à une décision déjà prise (signalées).

---

## 1. Qu'est-ce qu'une « leçon » d'humour chez nous

### 1.1 Définition de travail

**Une leçon est une fiche de 5 minutes environ qui apprend une seule chose et se termine par un seul geste.** Le geste est l'un de quatre : lire et comprendre, choisir entre des répliques, écrire sa propre version, la dire à voix haute. Sans geste, c'est un contenu de plus (une vanne, un conseil), pas une leçon.

Ce qui sépare une leçon d'une fiche du catalogue :
- Une vanne du catalogue se ressort telle quelle. Une leçon apprend le mécanisme qui permet d'en trouver une soi-même.
- Un conseil dit quoi faire. Une leçon le fait faire, sur une situation précise, avec une réplique à soi à la fin.
- Une vidéo se regarde. Une leçon la décortique minute par minute pour que l'abonné en retire une technique et pas seulement un rire.

Rappel de la logique de la capture de référence : une barre de rubriques par nature de contenu (guides, grammaire, vocabulaire, expressions, écouter, exercices, ateliers), un parcours qui assemble des fiches numérotées, des tests de section. Nous reprenons la structure, pas les mots ni la charte.

### 1.2 Anatomie commune d'une fiche (squelette à valider par étalon)

1. Titre qui dit la situation ou le mécanisme (jamais un titre de cours).
2. Accroche en une phrase (la scène ou le problème).
3. Le contenu : exemple d'abord, règle ensuite (« il observe plutôt qu'il ne fait la leçon », `ton-alex.md`).
4. L'erreur courante, une seule, dite sans jugement.
5. Le geste : « À toi » (choisir, écrire, dire).
6. Deux liens « pour aller plus loin » vers la bibliothèque (vanne, conseil, vidéo liés).
7. Statut « Voir » / « Fait » (voir 2.4).

Ton : « le pote drôle et bienveillant », tutoiement, aucun émoji, aucun tiret cadratin, aucune mention d'IA, rien de culpabilisant (jamais « tu n'as pas fait la fiche »). Pas de vanne plutôt qu'une vanne moyenne.

### 1.3 Vue d'ensemble des 9 types

| # | Type | En une phrase | Geste | Volume V1 neuf |
|---|---|---|---|---|
| 1 | Guide | Un principe expliqué sur une page, avec un exemple vécu | Lire + 1 mini choix | 12 |
| 2 | Situation | Une scène, trois répliques graduées, la règle pour choisir | Choisir + dire | 90 |
| 3 | Grammaire de la vanne | Une structure de phrase drôle, démontée et refaite | Écrire | 12 |
| 4 | Vocabulaire | Un mot du métier (callback, chute...) en 4 lignes | Lire + reconnaître | 12 fiches (60 mots) |
| 5 | Expressions | Des tournures toutes faites à détourner ou à lancer | Écrire | 20 |
| 6 | Écouter et décortiquer | Un vrai passage d'humoriste, démonté puis transposé à ta vie | Repérer + écrire | 20 |
| 7 | Exercice et jeu | Un défi court, avec corrigé | Choisir ou écrire | 40 |
| 8 | Test de section | 6 questions de fin de sous-parcours, sans note qui sanctionne | Choisir + dire | 5 de section (les 25 quiz d'étape existent) |
| 9 | Atelier | Une séance guidée de 20 minutes, seul ou avec un pote | Faire | 8 |

Total neuf : environ 220 fiches. Les chiffres de réutilisation de l'existant (carnet, lettres réservées, conseils, vidéos, quiz) sont à confirmer par l'inventaire de @product-manager [À VÉRIFIER].

### 1.4 Les types, un par un

#### Type 2 (le plus important) : Situation, « quelle réponse dans quelle situation »

- **Définition** : une scène précise de la vie courante, trois répliques de force croissante, la règle pour choisir entre elles, l'erreur courante, l'exercice.
- **Ce que l'abonné en retire** : Yanis sait quoi dire quand on le chambre en coloc ; Sophie a une réplique pour la réunion qui déraille ; Marc retrouve des phrases pour les dîners entre amis, sans forcer.
- **Format** : 5 minutes, 250 à 300 mots. Même squelette que le format A des lettres réservées (situation, trois répliques, règle, erreur, exercice), ce qui permet de réutiliser les lettres déjà relues. Le carnet (situation, « on te dit », réponse, pourquoi, « si c'est tendu », exercice) devient la version à une réplique : on lui ajoute deux répliques et la règle.
- **Interaction** : choisir la réplique qui convient à SON cas (3 choix), puis la dire à voix haute. Pas de texte libre stocké.
- **Gradation proposée** [HYPOTHÈSE de travail, à caler à l'étalon] : réplique douce (on rit avec la personne, on se vise soi), réplique moyenne (on renvoie un détail, sans viser), réplique piquante (on vise l'autre, seulement si le lien le permet). La règle pour choisir tient en une phrase : « plus tu es proche de la personne et plus le public te connaît, plus tu peux viser l'autre ; sinon, vise-toi ».
- **Classement de la bibliothèque** (pour retrouver « la bonne réponse dans la bonne situation ») : par lieu (coloc, soirée, boulot, famille, magasin, transport), par intention (désamorcer, répondre au chambrage, relancer une conversation, rattraper un faux pas), par enjeu (copain, collègue, inconnu, supérieur). Un filtre « je suis dans quelle situation » sur deux entrées.
- **Volume V1** : 90 situations (seuil déjà fixé au 24/10 pour « La réplique du jour » : 90 validées à l'aveugle). Environ 35 viennent du carnet et des lettres réservées, enrichies ; environ 55 sont neuves [HYPOTHÈSE sur la part réutilisable, à confirmer].
- **Réutilisation** : carnet d'octobre et de novembre (45 fiches), lettres réservées au format A, vannes de parcours.
- **Exemple [EXEMPLE NON VALIDÉ]** :
  - Situation : tu arrives vingt minutes en retard à un dîner entre amis. Un pote lance devant tout le monde : « Ah, on te pensait mort. »
  - Douce : « Presque. Mon GPS m'a fait visiter trois fois le même rond-point. »
  - Moyenne : « Mort, non. Mais j'ai vu ma vie défiler : c'était surtout un rond-point. »
  - Piquante : « Si j'étais mort, tu aurais déjà mangé mon dessert. »
  - Règle : entre amis proches, la piquante passe ; devant des gens que tu connais mal, reste sur la douce.
  - Erreur courante : t'excuser trois fois avant de répondre. La réplique arrive quand le rire est passé.
  - À toi : choisis la réplique qui irait avec TON dernier retard, dis-la à voix haute en regardant un mur, comme si c'était lui l'ami.

#### Type 3 : Grammaire de la vanne

- **Définition** : une structure de phrase qui produit un effet comique, démontée en deux temps (installer, casser) puis refaite par l'abonné sur son sujet.
- **Ce que l'abonné en retire** : Yanis passe de « je ne sais pas être drôle » à « je sais où est le mécanisme » ; Sophie a des gabarits pour ses vannes de pause café ; Marc retrouve un cadre qui rassure.
- **Format** : 5 minutes, 200 à 250 mots, un schéma en une ligne, deux exemples, un à compléter.
- **Interaction** : écrire sa version (texte à l'écran, non enregistré) puis la dire.
- **Structures candidates (V1, 12 fiches)** : la règle de trois (deux éléments installent un rythme, le troisième le casse) ; le faux secret ; l'exagération contrôlée ; la litote et l'euphémisme ; le contraste (grand mot, petit sujet) ; le détournement d'expression ; le callback ; l'auto-dérision dosée ; le piège de la fausse logique ; la liste qui déraille ; le détail trop précis ; la chute qui retourne le début. Liste à croiser avec les 290+ vannes du catalogue pour que chaque structure ait des exemples réels maison [À VÉRIFIER].
- **Réutilisation** : `anatomie-vanne`, décryptages de vannes (`blagues-decryptage.json`), conseils existants sur la construction [À VÉRIFIER leur contenu].
- **Tension à trancher (question Q4)** : la décision du 04/11 pour l'app est « Pourquoi ça marche » SANS nom de technique. Ici le nom de la structure est le contenu. Proposition : noms de techniques seulement dans « Les bases » (Grammaire et Vocabulaire), jamais dans les situations ni dans les étapes de parcours.
- **Exemple [EXEMPLE NON VALIDÉ]** : « La règle de trois. Tu installes deux éléments du même monde, tu casses avec le troisième. 'Dans mon sac : mes clés, mon portefeuille, et une chaussette dont j'ignore tout.' Les deux premiers font une liste normale, le troisième la fait dérailler. Erreur courante : casser dès le deuxième, la tension n'a pas eu le temps de monter. À toi : sac, frigo, poches, trois éléments, le dernier doit surprendre. »

#### Type 4 : Vocabulaire

- **Définition** : le jargon du stand-up et de la répartie, un mot par entrée, défini en une ligne, illustré, avec le piège à éviter. Va au-delà du glossaire existant (`/glossaire`, contenu exact [À VÉRIFIER]).
- **Ce que l'abonné en retire** : un langage commun pour comprendre ce qu'il regarde (« là, c'est un callback ») et pour nommer ce qui ne marche pas chez lui. Yanis gagne en confiance, Sophie comprend les vidéos, Marc retrouve une culture.
- **Format** : une fiche regroupe 5 mots autour d'un thème, 5 minutes. Une entrée : mot, définition en une ligne, mini exemple, « à ne pas confondre avec ».
- **Interaction** : relier le mot à l'exemple (3 choix), puis un mot à placer dans une phrase à soi.
- **Familles et mots candidats (60 en V1)** : construction (amorce, chute, punchline, angle, premise, tag, topper) ; rythme (timing, pause, silence, relance, rythme de trois) ; effets (callback, running gag, retournement, fausse piste, décalage, understatement) ; répartie (renvoi, contre, retour de volée, rebond, désamorcer, piquer sans blesser) ; scène (set, open mic, plateau, crowd work, rire de politesse, flop) ; posture (persona, auto-dérision, ton neutre, regard, public). Chaque mot est vérifié dans la pratique du stand-up (pas d'usage inventé) ; les termes anglais sont signalés comme tels.
- **Réutilisation** : glossaire existant, au minimum comme base de départ et pour éviter les doublons.
- **Exemple [EXEMPLE NON VALIDÉ]** : « Callback. Reprendre plus tard une phrase dite plus tôt, dans un nouveau contexte. Le dessert du dîner revient quand quelqu'un hésite à se resservir : 'C'est pour la survie du dessert.' À ne pas confondre avec : répéter la même vanne (un callback change de sens). »

#### Type 5 : Expressions

- **Définition** : des tournures toutes faites de la langue, prêtes à être détournées (proverbes, expressions, formules) ou à lancer (amorces de conversation, transitions).
- **Ce que l'abonné en retire** : une matière de base immédiate, même sans idée : on détourne ce que tout le monde connaît. Sophie y trouve des amorces de pause café ; Yanis, des détournements courts, peu risqués.
- **Format** : 5 minutes, 5 à 6 expressions par fiche, avec pour chacune : le détournement type, le piège.
- **Interaction** : détourner une expression avec sa propre vie (écrire), puis comparer avec le corrigé.
- **Deux familles** : (1) expressions et proverbes à détourner ; (2) amorces qui lancent une vanne (« Moi, mon problème, c'est que... », « Le truc que personne n'avoue... ») et transitions qui rattrapent un silence.
- **Volume V1** : 20 fiches (environ 110 expressions).
- **Réutilisation** : vannes du catalogue qui détournent déjà une expression (à repérer par tag) [À VÉRIFIER].
- **Exemple [EXEMPLE NON VALIDÉ]** : « 'Petit à petit, l'oiseau fait son nid.' Détourné : 'Petit à petit, mon salon fait son tas de linge.' Le schéma : garde la première moitié, remplace la seconde par ton quotidien. Piège : changer les deux moitiés, plus personne ne reconnaît l'expression. »

#### Type 6 : Écouter et décortiquer

- **Définition** : un passage court d'un vrai humoriste (1 à 2 minutes), démonté pour montrer la technique, puis transposé à la vie de l'abonné. C'est le format B des lettres réservées appliqué aux vidéos.
- **Ce que l'abonné en retire** : il arrête de regarder passivement. Yanis voit que la « répartie » est de l'observation ; Sophie récupère un mécanisme qu'elle transpose au boulot ; Marc retrouve un plaisir (le rire) et une méthode.
- **Format** : 5 minutes de lecture plus le passage. Quatre blocs : le passage (minute et seconde exactes), ce qu'il fait (3 observations), pourquoi ça marche (une idée), ta version à toi.
- **Interaction** : repérer le moment du retournement (choisir parmi 3 repères de temps), puis écrire sa transposition.
- **Règles de production** : humoristes récents proches de l'audience (décision du 25/10, « pas Devos »), humoristes nommés autorisés partout (P0 s15). Citation courte et sourcée, retranscription longue interdite. Chaque citation et chaque minute est vérifiée sur la source ; citation douteuse = vérifier, jamais retirer ni inventer. Pas d'avis @legal sauf extrait qui dépasse la citation brève (décision du 19/10 : pas de juridique inutile).
- **Volume V1** : 20 fiches. Le catalogue de 89 vidéos décortiquées est la matière première ; la fiche ajoute la transposition et l'exercice [À VÉRIFIER : profondeur des analyses actuelles].
- **Réutilisation** : vidéos des parcours (par exemple Paul Séré, « Les relations amoureuses », pour les vannes courtes enchaînées ; Karim Duval, « Génération Y », pour le détournement de jargon, déjà présents dans `parcours-seed.json` avec leur « why »).
- **Exemple [EXEMPLE NON VALIDÉ, structure seule, aucune citation inventée]** : « Passage : [artiste, titre, minute début-fin à vérifier]. Ce qu'il fait : 1) il installe un détail banal, 2) il le répète trois fois sans changer de ton, 3) il change de mot à la quatrième. Pourquoi ça marche : [une phrase, à relire à l'aveugle]. À toi : choisis un détail banal de ta journée, répète-le trois fois dans une phrase, change un mot à la fin. »

#### Type 7 : Exercice et jeu

- **Définition** : un défi court avec un corrigé, qui fait pratiquer UNE compétence sans la théorie autour.
- **Ce que l'abonné en retire** : de la pratique sans risque, seul. Yanis s'entraîne sans public ; Sophie fait un exercice entre deux réunions ; Marc retrouve l'envie de jouer.
- **Format** : 3 à 5 minutes. Une consigne, un support, un corrigé qui montre une bonne réponse (pas la seule).
- **Interaction** : choisir (« quelle réplique ? »), écrire (« finis la phrase »), dire à voix haute (« change de registre »).
- **Familles de jeux (V1, 40 fiches)** : « Quelle réplique ? » (choisir parmi 3, justification en une ligne) ; « Finis la phrase » (en cohérence avec le défi de l'app, décision du 04/11, même stock si possible) ; « Trouve l'angle » (un objet banal, trois observations vraies) ; « Change de registre » (la même réplique, douce puis piquante) ; « Détourne l'expression » ; « Remets la chute » (le début est donné, trouve ce qui retourne la phrase) ; « Le jeu des pires réponses » (trouver ce qu'il ne faut PAS dire, pour sentir la limite).
- **Réutilisation** : exercices « À toi de jouer » des vannes, exercices des conseils et des vidéos (déjà protégés côté serveur par `lib/champs-premium.ts`, voir brief §2.5) ; quiz d'humour.
- **Exemple [EXEMPLE NON VALIDÉ]** : « Trouve l'angle. Objet : le micro-ondes de l'open space. Écris trois choses vraies sur lui, pas des blagues : 1) à qui il appartient, 2) ce qu'on y réchauffe, 3) ce qu'on y oublie. Corrigé : la blague se cache souvent dans la troisième, celle que tout le monde a vue sans jamais la dire. »

#### Type 8 : Test de section

- **Définition** : un bilan de 6 questions à la fin d'un sous-parcours, qui vérifie que l'abonné sait CHOISIR et DIRE, pas seulement reconnaître.
- **Ce que l'abonné en retire** : la preuve qu'il a progressé, sans examen. Yanis voit qu'il choisit mieux ; Marc obtient un repère concret.
- **Format** : 5 minutes. 4 questions « quelle réplique convient ici ? », 1 « remets dans l'ordre », 1 « dis-la à voix haute » (auto-déclaré). Pas de note qui sanctionne, pas de certificat (décision du 07/10, bilans de fin sans certificat). Résultat dit en phrases, avec « revoir cette fiche » pour chaque erreur, jamais de message culpabilisant.
- **Interaction** : choisir, ordonner, auto-déclarer.
- **Volume V1** : 5 tests de section (un par parcours, fin de parcours) ; les 25 quiz d'étape existants sont conservés tels quels, comme fiche « Test de l'étape » [À VÉRIFIER : état et nombre des quiz dans les seeds].
- **Exemple de question [EXEMPLE NON VALIDÉ]** : « Un collègue lance devant l'équipe : 'Encore en retard, toi.' Quelle réplique te laisse la main ? A) 'Pardon, pardon, c'est la dernière fois !' B) 'J'ai pris de l'avance : c'est demain que je serai à l'heure.' C) 'Et toi, tu es toujours là à 9 h ? Quel courage.' Corrigé : B, tu te vises, tu fais sourire, tu restes détendu. C vise l'autre devant l'équipe : réservé aux collègues proches. »

#### Type 9 : Atelier

- **Définition** : une séance guidée de 20 minutes à faire hors écran (à voix haute, seul ou avec un pote), qui assemble plusieurs gestes autour d'un objectif.
- **Ce que l'abonné en retire** : le passage de la lecture au corps. Yanis a un cadre pour s'exercer sans être jugé ; Sophie prépare un afterwork ; Marc invite un ami à jouer.
- **Format** : 20 minutes, 4 étapes de 5 minutes (échauffement, observation, essai, bilan), un corrigé le jour même (jamais « semaine suivante », rien n'est envoyé).
- **Interaction** : faire, dire, enregistrer sur son téléphone si l'abonné le veut (rien ne remonte au site).
- **Volume V1** : 8 ateliers, par exemple : « Cinq amorces sur ta semaine », « Répondre sans réfléchir (dix chambrages, dix secondes) », « Raconter ton week-end en trois temps ».
- **Réutilisation** : défis de la semaine des étapes de parcours [À VÉRIFIER].

#### Type 1 : Guide

- **Définition** : un principe expliqué sur une page, avec un exemple vécu et un petit choix à faire.
- **Ce que l'abonné en retire** : la compréhension du « pourquoi » : pourquoi on se tait, ce que fait un humoriste avant de parler. Yanis dédramatise, Sophie comprend le moment, Marc s'autorise.
- **Format** : 5 minutes, 300 à 350 mots, 1 exemple, 1 erreur courante.
- **Interaction** : lire, puis un choix en 3 réponses (« qu'est-ce que tu ferais ? »).
- **Volume V1** : 12 guides neufs, par exemple : observer avant de parler ; se moquer de soi sans s'écraser ; viser l'autre sans blesser ; le silence après ta vanne ; quand ça ne prend pas ; quand tu es la cible ; l'humour au boulot ; écrire ses vannes dans un carnet.
- **Réutilisation** : les conseils du catalogue (60+) restent la bibliothèque ; un guide neuf n'en recopie aucun, il les relie.
- **Exemple [EXEMPLE NON VALIDÉ]** : « Quand ta vanne tombe à plat. Trois secondes de silence, c'est long, et c'est normal. Réplique à garder sous la main : 'Je le mets dans le carnet des tests.' Puis continue ta phrase. Le silence ne dure que si tu le nourris. À toi : choisis la suite qui te ressemble le plus (rire de toi, passer à autre chose, relancer la personne). »

---

## 2. Organisation : niveaux ou parcours thématiques

Point de départ vérifié : 5 parcours (Machine à Café 3 étapes, Répartie 4, Confiance 6, Storytelling 6, Boulot 6 : 25 étapes, `config/premium.ts`). Chaque étape contient déjà un conseil, des vannes, des vidéos, un quiz et un défi (`parcours-seed.json`, exemple Machine à Café étape 1 : conseil « L'humour à la machine à café », 5 vannes, 2 vidéos, un quiz, 50 XP). Le brief interdit d'inventer des niveaux et de supposer 6 étapes partout.

### 2.1 Trois options

| | A. Parcours thématiques gardés, niveau en étiquette | B. Trois niveaux comme colonne vertébrale | C. A plus un 6e parcours « Les bases » |
|---|---|---|---|
| Principe | Les 5 parcours restent. Chaque étape devient un sous-parcours de 5 à 6 fiches. Une étiquette de difficulté (déjà dans le seed : `difficulty`) guide le choix. | Débutant, Intermédiaire, Avancé : on redistribue les 25 étapes dans 3 niveaux. | Comme A, plus un parcours neuf d'entrée pour vocabulaire, grammaire, premières situations. |
| Pour | Rien de validé n'est déplacé. Cohérent avec la décision du 18/10 (étapes ouvertes, ordre conseillé). Le quiz de profil continue d'orienter. | Proche de la capture (« Débutant 1 »). Lecture linéaire simple. | Donne un vrai point de départ commun. Contenu neuf visible dès le premier jour. |
| Contre | Pas de fil « progression de A à Z » entre parcours. | Casse la logique par besoin (Machine à Café, Boulot), défait des étapes validées, niveaux à inventer. Contredit le brief. | Passe de 5 à 6 parcours : « les 5 parcours » est écrit dans des textes client validés (`PARCOURS_COUNT`, offre, e-mails) : réouverture de textes approuvés. |
| Risque contenu | Faible | Élevé | Moyen |

**Reco : A pour la V1.** Le contenu neuf obligatoire arrive par les rubriques transversales (Situations, Les bases) liées depuis chaque fiche, sans toucher au nombre de parcours annoncé. C reste possible plus tard si Thomas veut un « premier parcours » ; il faudra alors lister les textes à rouvrir. [Question Q1.]

### 2.2 Comment les parcours existants s'y rangent, sans rien perdre

Règle : l'étape existante devient un **sous-parcours**, ses éléments validés deviennent des **fiches**, mot pour mot. On ajoute du neuf autour, on ne réécrit pas le validé (règle d'or P0 s18). Mesure du diff réel obligatoire à chaque parcours (taux de changement, slugs, titres, liens, chiffres, prix intouchés : P0 s11).

Exemple de découpage proposé, Machine à Café, étape 1 [titres de fiches = propositions]. Numérotation `1.1`, `1.2`, etc. :

| N° | Fiche | Type | Origine |
|---|---|---|---|
| 1.1 | L'humour à la machine à café | Guide | Conseil existant, inchangé |
| 1.2 | Le faux secret, mode d'emploi | Grammaire | NEUF |
| 1.3 | Cinq vannes courtes à ressortir | Bibliothèque (lecture) | 5 vannes existantes |
| 1.4 | Écouter : des vannes enchaînées | Écouter et décortiquer | Vidéo existante (Paul Séré), analyse enrichie |
| 1.5 | Le collègue qui lance « ça va ? » | Situation | NEUF |
| 1.6 | Test de l'étape 1 | Test | Quiz existant, inchangé |

Les 25 étapes donnent environ 125 à 150 fiches numérotées, dont 40 % de neuves (grammaire, situations, jeux) et 60 % de contenu existant reconditionné. [HYPOTHÈSE : 5 à 6 fiches par étape, à confirmer à l'étalon.] Les fiches de type Situation, Grammaire, Vocabulaire et Jeu pointent vers l'entrée de la bibliothèque : la fiche vit en un seul endroit et se retrouve dans le parcours ET dans la rubrique.

### 2.3 Sous-parcours, numérotation, test de section

- **Sous-parcours = une étape.** Le titre reste celui de l'étape (par exemple « Des vannes courtes, faciles à ressortir »). Compteur « 0/6 fiches » comme sur la capture.
- **Fiches numérotées dans l'étape** (1.1, 1.2...). Toutes ouvertes (décision du 18/10) ; l'ordre est conseillé, jamais imposé.
- **Test de fin de section** : le « Test de l'étape » existant (quiz) clôt chaque sous-parcours. Un **test de section** plus long (6 questions, type 8) clôt chaque parcours. Dit en phrases, sans note, sans certificat.
- **Niveau** : étiquette « pour qui » sur le parcours (Débutant, Intermédiaire, Avancé), reprise du champ `difficulty` du seed [À VÉRIFIER : valeurs des 5 parcours, seul Machine à Café est lu à DEBUTANT]. Aucune règle de déverrouillage par niveau.

### 2.4 « Voir » et « Fait » sur une fiche

Proposition cohérente avec le brief §3.3 : « Voir » ouvre la fiche, « Fait » est un statut affiché (coche et texte). Sur une fiche de lecture, « Fait » se coche à l'ouverture complète ; sur une fiche à geste (choisir, écrire, dire), à la fin du geste. La validation de l'étape (XP, série) reste celle du quiz et du défi existants. Stocker un « Fait » par fiche demande une table neuve : décision technique pour @product-manager et @fullstack, pas ici.

### 2.5 Place de l'XP et de la série (proposition, aucune règle décidée)

État de l'existant à respecter : XP par étape (`moduleXp`, 20 par défaut), bonus de fin de parcours 100, série comptée sur la pratique (étape validée, quiz d'étape terminé). Le tableau de `docs/content/progression-levels.md` (lecture de vanne +2 XP, etc.) diffère du code lu dans le brief : ne pas s'en servir [À VÉRIFIER par @product-manager].

Trois propositions, à choisir par Thomas (question Q2) :
1. **Sans XP sur les fiches** (reco) : « Fait » est un suivi, l'XP reste à l'étape et au parcours. Aucune nouvelle règle.
2. **XP par fiche à geste** (exercice, test) : nouvelle règle d'XP, accord de Thomas requis.
3. **Pratique élargie** : terminer un exercice ou un test compte pour la série (pas pour l'XP). Nouvelle règle de série, accord requis.

---

## 3. Barre de rubriques

Contraintes : 6 entrées visibles au plus, le reste dans « Plus » (décision du 12/11, Q3 = A) ; libellés en texte, jamais d'icône seule, casse normale ; Q2 = « Mon espace » ; la barre s'affiche aussi sur les pages publiques pour l'abonné (Q11 = A). Chaque rubrique doit avoir un contenu réel derrière à l'ouverture (brief §3.1).

### 3.1 Proposition (V1)

| Position | Rubrique (nom de travail) | Contenu | Neuf ou existant |
|---|---|---|---|
| 1 | Aujourd'hui | Premier pas, contenu du jour, série, reprendre | Neuf (brief) |
| 2 | Parcours | Les 5 parcours, sous-parcours, fiches « Voir / Fait » | Existant enrichi |
| 3 | Situations | Bibliothèque « quelle réponse dans quelle situation », filtres lieu / intention / enjeu | Neuf |
| 4 | Les bases | Vocabulaire, Grammaire de la vanne, Expressions, Guides | Neuf |
| 5 | Bibliothèque | Vannes, Conseils, Vidéos (dont Écouter et décortiquer), Carnet | Existant, regroupé |
| 6 | Plus | Jeux et ateliers, Favoris et notes, Écrire à l'équipe, Lettre, Mon compte | Mélange |

Raisons : le catalogue est ce que l'offre vend (« tout Deviens Marrant ouvert », décision du 19/10), il reste donc à un clic. Les deux rubriques neuves (Situations, Les bases) sont visibles dès le premier jour : le contenu neuf obligatoire ne se cache pas. « Jeux et ateliers » va dans « Plus » en V1, il est le plus jeune ; on le promeut si l'usage le justifie (mesure du lot 0).

Variante si Thomas veut les jeux visibles : remplacer « Bibliothèque » par « Jeux » et passer Vannes, Conseils, Vidéos et Carnet dans « Plus ». Je ne la recommande pas : elle éloigne le catalogue payé.

À signaler à @ux et @design (hors de ma mission) : « Bibliothèque » et « Les bases » demandent une page d'entrée à 3 ou 4 portes ; le test `header-budget.spec.ts` fige les onglets et les entrées de menu (brief §2.2).

### 3.2 Correspondance avec la capture

| Capture | Chez nous |
|---|---|
| Guides | Les bases (Guides) |
| Parcours | Parcours |
| L'atelier des mots | Les bases (Vocabulaire) |
| Grammaire | Les bases (Grammaire de la vanne) |
| Vocabulaire / Expressions et proverbes | Les bases (Vocabulaire, Expressions) |
| Apprendre, lire et écouter | Bibliothèque (Vidéos, Écouter et décortiquer) |
| Exercices et jeux | Plus (Jeux) |
| Favoris, Mes notes | Plus |
| Ateliers | Plus |
| Écrire au coach | Plus (Écrire à l'équipe) |
| (absent de la capture) | Situations : notre rubrique centrale |

---

## 4. Production

### 4.1 Pipeline commun à tous les types

1. **Étalon avec Thomas** (P0 s8) : une fiche modèle par type, calibrée avant tout brief @copywriter. Pas d'écriture en série avant son OK.
2. **Brief @copywriter** : étalon validé, squelette de la section 1.2, vocabulaire prescrit et proscrit (aucun tiret cadratin, aucun émoji, tutoiement, aucune mention d'IA, aucun concurrent nommé).
3. **Écriture par lots de 10** par @copywriter.
4. **Contrôle de vérité** : toute citation d'humoriste, minute de vidéo, nom de technique ou fait vérifié sur la source avant la relecture. Rien d'inventé (règle 2).
5. **Relecture à l'aveugle, 2 relecteurs sur 3**, grille : exactitude, niveau, ton « pote », utilité du geste final. **Barre « niveau Alexa »** pour toute vanne ou réplique drôle (chute surprenante, courte, logique, observation vraie, jamais entendue ailleurs). Pas de réplique plutôt qu'une réplique moyenne. Contenu sous la barre : corrigé puis re-relu à l'aveugle, jamais mis en ligne en l'état (P0 s18).
6. **Passage Stand-Up Director** sur les vannes et répliques (déjà en place pour le catalogue).
7. **Lecture de Thomas**, par lot, avant mise en ligne. Mise en ligne seulement sur son go écrit ; construction derrière l'interrupteur fermé du brief (site identique tant qu'il est fermé).
8. **Mesure du diff** sur tout contenu existant reconditionné (P0 s11) : taux de changement, slugs, titres, FAQ, liens, chiffres, prix.

Univers et sensibilité des situations : le widget exclut DATING, SOIREES et COUPLE parce qu'il est tout public ; l'espace Premium est un lieu adulte connecté, mais Marc est en reconstruction. Proposition : couple et rupture traités avec soin ou écartés (question Q6). Rien de culpabilisant, aucune blague sur la personne qui apprend.

### 4.2 Particularités par type

| Type | Étalon à calibrer | Contrôle particulier |
|---|---|---|
| Situation | Oui (le premier) | Scène que vit le lecteur type, saison juste, réplique sans mode d'emploi, trois niveaux réellement différents (grille de la décision du 25/10) |
| Grammaire | Oui | Aucun ton scolaire (« Scolaire » est un mot proscrit de la marque) ; chaque structure illustrée par une vanne du catalogue validé |
| Vocabulaire | Oui | Définitions confrontées à l'usage réel du stand-up ; termes anglais signalés |
| Expressions | Non (suit les étalons Grammaire) | Expression réellement courante ; détournement testé à l'aveugle |
| Écouter et décortiquer | Oui | Source, minute, citation vérifiées ; humoristes récents ; citation brève |
| Exercice et jeu | Oui, groupé avec le test | Corrigé juste et non unique ; exercice faisable sans personne |
| Test de section | Groupé avec l'exercice | Chaque question a une seule bonne réponse défendable |
| Atelier | Non en V1 d'abord | Faisable seul, sans enregistrement obligatoire |
| Guide | Non (suit Situation) | Un seul principe par guide |

### 4.3 Ordre de production par dépendances

Calibrage IA : V1 complète, parallélisation par défaut, aucune fiche coupée « par manque de temps » (règle 5). Les vraies dépendances :

1. **Étalons** (5, section 5.1) : bloquants pour tout le reste.
2. **Vocabulaire et Grammaire** (en parallèle) : ils fixent les noms de techniques utilisés partout.
3. **Situations** (90) : dépendent des noms fixés en 2 et du classement (lieu, intention, enjeu). Réutilise carnet et lettres réservées.
4. **Guides et Expressions** : en parallèle de 3.
5. **Exercices et jeux** : dépendent des situations (ils les mettent en jeu) et de la grammaire.
6. **Écouter et décortiquer** : indépendant, peut démarrer dès les étalons ; le plus lent à vérifier (sources). Lancer tôt.
7. **Découpage des 25 étapes en fiches** : dépend de 2, 3, 5 (les fiches pointent vers elles) et du modèle de données (@product-manager, @fullstack).
8. **Tests de section** (5) : après 7.
9. **Ateliers** (8) : en dernier, ils assemblent des gestes déjà validés.

Faisable en V1 complète : tout l'ensemble, soit environ 220 fiches neuves. Le facteur limitant est la relecture à l'aveugle (2 relecteurs par fiche, par lots de 10) et les passages de Thomas, pas l'écriture. Une V1 « moitié des types » n'est pas recommandée : un espace où manquent Situations ou Les bases ne répond pas à la demande de Thomas du 12/11.

Format de livraison : JSON dans `docs/content/` comme les parcours et le carnet, puis import (conception du schéma : @product-manager et @fullstack).

### 4.4 Risques et garde-fous

- **Ton scolaire** : Grammaire et Vocabulaire peuvent basculer en cours magistral. Garde-fou : exemple avant règle, 250 mots au plus, un geste à la fin.
- **Humour sous la barre** : 90 situations, c'est 270 répliques. Garde-fou : pas de réplique plutôt qu'une réplique moyenne ; une situation peut n'avoir que 2 bonnes répliques sur 3, on le dit plutôt que de forcer.
- **Citations fausses** : vérification systématique, sinon la ligne saute et la fiche s'appuie sur la technique seule.
- **Mots non cohérents** entre fiches : un seul glossaire, tenu par la rubrique Vocabulaire.
- **Retouche des textes validés** : les parcours existants gardent leurs mots ; tout changement passe la mesure de diff.

---

## 5. Étalons et questions pour Thomas

### 5.1 Étalons à calibrer en premier (5)

| # | Étalon | Pourquoi en premier |
|---|---|---|
| E1 | Une Situation complète (trois répliques, règle, erreur, exercice) | C'est le cœur (90 fiches) et la voix de tout l'espace. Il fixe aussi la gradation douce, moyenne, piquante. |
| E2 | Une fiche de Grammaire (la règle de trois) | Le plus gros risque de ton scolaire. Si ce format sonne « pote » et non « cours », tout le reste suit. |
| E3 | Une page de Vocabulaire (5 mots) | Fixe le niveau de jargon assumé et la tension sur les noms de techniques (décision du 04/11 pour l'app). |
| E4 | Un Écouter et décortiquer sur un humoriste récent | Le plus exposé aux erreurs de citation ; Thomas choisit les humoristes et le degré de découpage. |
| E5 | Un Exercice et son mini test (3 questions) | Définit l'interaction (choisir, écrire, dire) et le ton du corrigé : jamais culpabilisant. |

Pour chaque étalon : 2 versions à comparer à l'aveugle (règle de calibrage), puis le choix de Thomas. Les nouveaux noms de rubriques (Situations, Les bases, Bibliothèque) sont présentés en même temps, sur le rendu sombre du site.

### 5.2 Questions pour Thomas (8)

Chaque question : 3 options, une reco. Les options qui rouvrent un `[CHOIX UTILISATEUR]` sont marquées.

**Q1. Comment ranger les parcours ?**
- A. On garde les 5 parcours, chaque étape devient une série de 5 à 6 fiches ; le niveau (débutant, intermédiaire) est une simple étiquette. **Reco.**
- B. On redécoupe tout en trois niveaux (débutant, intermédiaire, avancé). Casse des étapes validées et oblige à inventer des niveaux.
- C. Comme A, avec un sixième parcours neuf « Les bases ». Attention : rouvre les textes validés qui disent « les 5 parcours » (offre, e-mails approuvés).

**Q2. Que fait « Fait » sur une fiche ?**
- A. Un simple repère « j'ai vu cette fiche », sans points. Les points restent à l'étape et au parcours. **Reco.**
- B. Des points pour chaque fiche à exercice. Nouvelle règle de points : ton accord est requis.
- C. Rien sur les fiches : « Fait » seulement à la fin de l'étape, comme aujourd'hui.

**Q3. Quand l'abonné écrit sa réplique dans un exercice, qu'en fait-on ?**
- A. Elle reste à l'écran et n'est jamais enregistrée ; il peut la copier s'il veut. **Reco.**
- B. Elle est gardée dans « Mes notes ». Rouvre la décision du 07/10 (aucun texte libre stocké) et demande un avis juridique court.
- C. On ne demande jamais d'écrire : tout se fait en choisissant ou à voix haute.

**Q4. Nomme-t-on les techniques (règle de trois, callback...) ?**
- A. Oui, mais seulement dans « Les bases » (vocabulaire et grammaire) ; dans les situations et les parcours, on montre sans nommer. **Reco.**
- B. Oui partout, c'est l'intérêt de l'apprentissage.
- C. Jamais, on explique sans mot technique. Aligné sur ta décision du 04/11 pour l'app, mais retire le vocabulaire de la barre.

**Q5. Quels humoristes pour « Écouter et décortiquer » ?**
- A. Un par mois seulement, comme dans les lettres.
- B. 20 passages en V1, choisis dans ta liste d'humoristes récents ; je vérifie chaque citation et chaque minute. **Reco.**
- C. Aucun nommé, on décortique des vannes du catalogue. Contredit ta règle du 15/10 (humoristes nommés autorisés partout).

**Q6. Quels univers pour les 90 situations ?**
- A. Les mêmes que le widget : on exclut drague, soirées et couple.
- B. Tous les univers du quotidien (coloc, boulot, famille, amis, magasins, transports, soirées), sauf rupture et deuil. **Reco.**
- C. On choisit les univers par type de personne (étudiant, actif, adulte en reconstruction) et on pondère.

**Q7. Le test de fin de parcours.**
- A. Six questions, des phrases de retour, « revoir cette fiche », aucune note, aucun certificat. **Reco.**
- B. Un score en pourcentage avec un seuil pour « valider » le parcours.
- C. Pas de test de parcours : on garde seulement le quiz de chaque étape.

**Q8. Comment ouvrir tout ça ?**
- A. Tout d'un coup, quand les 220 fiches sont relues.
- B. Rubrique par rubrique, dans l'ordre des dépendances (Les bases, Situations, parcours découpés, jeux et ateliers), chacune sur ton go écrit. **Reco.**
- C. Un seul parcours pilote complet (Machine à Café) et la bibliothèque de situations, le reste ensuite.

---

## Annexe : points à confirmer par l'inventaire de @product-manager

- Contenu exact et taille du glossaire existant.
- Nombre de fiches du carnet et de lettres réservées au format A réutilisables comme situations.
- Valeurs de `difficulty` des 5 parcours.
- Nombre et état des quiz et défis dans `parcours-storytelling-s18.json`, `parcours-boulot-s19.json`, `parcours-reecriture-s17.json`.
- Source unique du total d'XP (`getPathXpTotal` ou `totalParcoursXp`).
- Écart entre `progression-levels.md` et le code d'XP.

## Agents spécialisés recommandés (angle mort vérifiable seulement)

| Agent | Type | Rôle | Justification | Priorité |
|---|---|---|---|---|
| Testeur-persona Yanis, Sophie, Marc | testeur | Lire 3 fiches de chaque type avant ouverture, dire ce qui est scolaire ou perdant | Le risque n°1 (ton cours) ne se voit pas depuis l'écriture | Haute |
| Relecteur humoriste à l'aveugle | expert domaine | Noter les répliques et décryptages sur la barre « niveau Alexa » | 270 répliques et 20 décryptages à tenir au niveau | Haute |
| Vérificateur de citations | expert domaine | Source, minute, exactitude de chaque citation | Règle anti-invention, humoristes récents moins documentés | Haute |

Handoff vers @agent-factory pour la création de ces agents si Thomas valide le périmètre.
