# Architecture de contenu de l'espace Premium, v3 (s24)

> Auteur : @creative-strategy, 12/11/2026. Remplace `architecture-contenu-v2.md`. Réponse aux tours 2 de relecture : @ux 6,7, @reviewer 7,5, @elon 8,2 (`iterations/tour-2-*.md`), plus l'ajout de Thomas du 12/11 (onglet « Mes questions »). Chaque correction est tracée en annexe A (tour 2 et tour 1 encore partielles).
> Faits : `inventaire-cartographie-s24.md` (INV), dont le corps a été réaligné sur sa section 6 par @product-manager le 12/11 (la section 6 prime sur tout chiffre antérieur). Deux lignes d'INV restent à mettre à jour avec les preuves de la section 1.4 : la ligne « Carnet » (« résultat NON lu », « rien n'est validé ») et T3.
> Sources relues pour ce tour : les 3 rapports du tour 2, `docs/copy/carnet/` (départages et verdicts d'octobre et de novembre), `hebdo-premium.json` (lettres W46 à W51), `carnet-2026-10.md`, `2026-11.json`, `founder-preferences.md` (l. 37, 43, 65, 74, 86, 135, 161 à 163), `lib/progression.ts`, `config/premium.ts`.
> Conventions : [HYPOTHÈSE] = dimensionnement ou choix de travail. [À VÉRIFIER] = fait non lu. [EXEMPLE NON VALIDÉ] = illustration non relue à l'aveugle. Toute règle nouvelle (série, XP, texte libre, stockage, règle de relecture) est une question à Thomas en section 8, jamais une décision. Les noms de rubriques et de formats sont des propositions de travail, à caler par étalons rendus (P0 s8).
> Règles tenues : tutoiement, aucun tiret cadratin, aucun émoji, aucune mention d'IA, aucun concurrent nommé, rien de culpabilisant, aucune relance d'inactivité, aucun nouvel e-mail automatique.

## 0. Ce qui change depuis la v2 (12 lignes)

1. **Un seul chemin** : un calendrier type des 4 premières semaines, repris à l'identique partout (4.1). Les personas ne changent que la scène d'entrée et le parcours conseillé, chacun justifié par `project-context.md` ou par le seed.
2. **Stock de la rafale** : calcul posé en 2.3. Une nouvelle situation par jour (pas trois), le carnet entre dans la rafale, deux contextes par situation : le stock tient au-delà de J60 dès l'ouverture, et le flux mensuel suit la consommation.
3. **« Ta réponse d'abord »** : l'abonné tente SA réplique (10 secondes, à voix haute ou dans sa tête, rien de stocké) avant de voir les trois répliques (2.2).
4. **Mes questions** : nouvel onglet voulu par Thomas (2.6), qui absorbe l'encadré « Ta question à l'équipe ». Décision de Thomas du 12/11 (`founder-preferences.md` l. 164 et 165) : questions ET réponses gardées en base, historique visible par l'abonné. Plus une question ; il reste seulement la durée de conservation à confirmer (C9).
5. **Carnet** : sa relecture à l'aveugle est prouvée par les pièces (1.4). T3 est levé, avec trois vérifications de concordance à faire.
6. **Gradation** : les trois registres sont définis en une ligne chacun d'après les lettres approuvées ; la risquée gagne une part des contextes ; la grille d'auto-contrôle ne la condamne plus.
7. **Navigation** : le mot « Vocabulaire » ne mène qu'à du vocabulaire ou dit « et techniques » ; toute fiche et tout type a une porte ; une seule barre à 3 variantes dans UNE question (C1), avec « Mes questions » dedans.
8. **Totaux exacts** : fiches distinctes et emplacements séparés, 153 fiches neuves, 185 emplacements en parcours (5.3).
9. **Capacité** : contextes, rattrapages, bilans, mapping du quiz, étiquetage des défis, quatre tables de données : tout est compté (7.3).
10. **Règle de relecture** : plus aucune règle posée. C'est la question C8, avec la décision du 12/11 citée et les options marquées. L'allègement de la lecture de Thomas est recalculé pour de vrai.
11. **Aujourd'hui** : règle de priorité à 4 états, contenu du jour conservé (4.4).
12. **Persona** : une scène précise par persona dans chaque type.

---

## 1. Faits de base (sources)

### 1.1 Chiffres de production et de code

| Fait | Valeur | Source |
|---|---|---|
| Vannes, conseils, vidéos actifs en production | 149, 120, 89 | INV section 6 (`/api/content-stats`, 12/11) |
| Parcours et étapes | 5 parcours, 25 étapes (3, 4, 6, 6, 6) | `config/premium.ts` |
| Rythme annoncé | Machine à Café 15, Répartie 20, Confiance 20, Storytelling 20, Boulot 15 min/semaine | `config/premium.ts`, choix du 29/09 |
| Niveaux de difficulté | DEBUTANT : Machine à Café (`parcours-seed.json` l. 8), Boulot (`parcours-boulot-s19.json` l. 307) ; INTERMEDIAIRE : Répartie, Confiance (`parcours-seed.json`), Storytelling (`parcours-storytelling-s18.json` l. 94) | lus et vérifiés par @elon et @reviewer au tour 2 |
| Persona de Machine à Café dans le seed | « Sophie (26 ans, jeune active) » | `parcours-seed.json` l. 12 |
| Étape 1 de Machine à Café | scène, pourquoi, 1 conseil avec exemple et défi, 5 vannes, 2 vidéos (Paul Séré, Karim Duval), quiz de 4 questions, 50 XP, gratuite | `parcours-seed.json` |
| Durée réelle d'une étape | environ 22 à 25 min [HYPOTHÈSE de lecture : 200 mots/minute, vidéos de 5 à 8 min] | INV 3.1 |
| XP, niveaux, série (code) | XP d'étape (`moduleXp`, 20 par défaut), bonus de fin 100, seuils 0/100/500/1 500/5 000, série comptée sur la pratique (étape validée, quiz d'étape terminé), rythme doux de 7 jours (`NEXT_STEP_DELAY_DAYS`) ; la date conseillée n'existe qu'après une première validation (`nextRecommendedAt`) | `lib/progression.ts` |
| `progression-levels.md` | OBSOLÈTE : ses gains (+2 par vanne lue, +10 par conseil, badges) n'existent pas dans `lib/progression.ts` | lu le 12/11 |
| Retour d'exercice existant | 3 valeurs fermées `pas-essaye`, `essaye-bof`, `essaye-ca-a-marche` | `lib/progression.ts` l. 114, choix du 07/10 |
| Glossaire public | 12 termes (définitions de 40 à 60 mots) | INV section 6 et 1.1 |
| Carnet | 15 fiches (octobre) + 30 (novembre) | INV section 6 |
| Lettres | 6 du mois + 16 réservées, approuvées par Thomas. Les réservées alternent le format A (situation, la sûre, la joueuse, la risquée, comment choisir, erreur, exercice : W46, W48, W50 lues) et un format B par mois (décryptage : W47 Bref, W51 Palmashow). Nombre exact de lettres au format A : à compter [À VÉRIFIER] | `hebdo-premium.json`, choix du 25/10 |
| Univers déjà validés par Thomas | soirée, boulot, amis, famille, couple, dating, caisse, voisin (octobre) ; couple (Black Friday) en novembre ; un premier rendez-vous dans la lettre W50 ; un exposé de TD dans W46 | `departage-2026-10.md`, `departage-r2.md`, `hebdo-premium.json` |
| Ouverture des questions à l'équipe | réponse en général sous 1 à 2 jours ouvrés, jamais 7 jours ; signée « L'Équipe Deviens Marrant » ; envoi vers alex@deviens-marrant.fr ; rien en base ; limites techniques par abonné 3 par 10 minutes et 10 par jour, aucune limite affichée ; e-mails de questions conservés 6 mois après le dernier échange | `founder-preferences.md` l. 135 et 136 (25/10), brief §2.4 |

### 1.2 Les personas, d'après `project-context.md`

- **Yanis**, 20 ans, étudiant introverti : veut s'affirmer « en soirées, en coloc et avec ses potes » ; frustration : rester muet quand tout le monde se chambre, ne pas savoir répondre du tac au tac. Parcours qui répond à son sujet : Répartie.
- **Sophie**, 26 ans, jeune active : manque de conversation à la machine à café, veut des anecdotes à ressortir « en afterwork, dîners entre amis » ; frustration : pas de situations professionnelles. Parcours : Machine à Café (persona du seed), puis Boulot.
- **Marc**, 34 ans, récemment séparé : veut renouer avec l'humour et la légèreté, retrouver confiance dans ses interactions sociales ; cherche des parcours structurés et une progression mesurable. Parcours : Confiance.

Rencard, drague et couple n'apparaissent dans aucun persona écrit. Ils sont dans des contenus déjà validés par Thomas (tableau ci-dessus) : c'est l'argument sourcé de la question C6, pas une affirmation sur les personas.

### 1.3 Rendement de la barre « niveau Alexa » (faits, avec source)

| Fait | Source |
|---|---|
| 30 vannes au niveau sur 333 (30/09) | `founder-preferences.md` l. 37 |
| 2 vannes au niveau sur 360 au pilote des réseaux (06/10) | l. 65 |
| Boulot : 10 places validées sur 19 après 5 tours ; tour 6 pour les 11 places restantes (9 vannes et 2 phrases) | l. 86 (11/10) |
| Carnet d'octobre : 180 candidates relues à l'aveugle par 2 critiques ; 18 (critique A) et 14 (critique B) jugées « = » au niveau ; 15 répliques retenues au départage 2 sur 3, soit environ 8 % des candidates | `critique-A.md`, `critique-B.md`, `departage-2026-10.md` |

Pour des répliques en situation, la fourchette de rendement est donc de 1 sur 2 (Boulot) à 1 sur 12 (carnet d'octobre) [HYPOTHÈSE d'extrapolation].

### 1.4 Preuve de la relecture à l'aveugle du carnet (lève T3)

- **Octobre** : 180 candidates relues par deux critiques à l'aveugle (`critique-A.md`, `critique-B.md`), départage 2 sur 3 (`departage-2026-10.md`), 15 répliques retenues ; format et 15 fiches validés par Thomas le 03/10 (« je valide tout go »). Reste [À VÉRIFIER] : les champs autres que la réplique (pourquoi, sortie polie, exercice) ont-ils été relus de la même façon ?
- **Novembre** : relecture à l'aveugle en plusieurs passes (`aveugle-moitie1`, `aveugle-moitie2`, `aveugle-vague2`, critiques A et B par moitié, `departage-r1`, `departage-r2`, `departage-r3`, `verdicts-fiches/`). Verdict v4, passe 2 : 27 fiches à 10 sur 10, 3 à 9 (`verdict-v4-r2.md`). Confirmation v5 sur les 6 fiches retouchées : relecteurs 2 et 3 à 10 sur 10 sur les 6 ; relecteur 1 à 10 sur 10 sauf une fiche à 9 (H10, « aux points » jugé inexact, version corrigée proposée) ; conclusion du relecteur 2 : « le carnet est à 30/30 fiches publiables telles quelles » (`verdict-v5-r2.md`, `verdict-v5-r1.md`, `verdict-v5-r3.md`).
- **Concordance vérifiée sur 2 fiches** : `2026-11.json`, fiche 03 (la boulangère) et fiche 10 (le gratin) reprennent mot pour mot le texte v5 de H03 et H29.
- **Trois vérifications restantes, sans nouvelle relecture** : (a) le texte en ligne de la fiche H10 (rayon des retardataires) contient la correction du relecteur 1 ; (b) diff complet entre `2026-11.json` et la dernière version relue ; (c) les champs non relus d'octobre (ci-dessus). Une fiche qui échouerait à (a) ou (b) est corrigée puis relue à l'aveugle avant d'entrer dans la rafale (règle d'or P0 s18).
- **Portée** : le carnet a été relu sous la règle du 08/10 (2 avis sur 3). La règle du 12/11 (10 sur 10 chez tous) vaut pour les contenus NEUFS de l'espace ; elle n'est pas appliquée rétroactivement au carnet par défaut.

---

## 2. La leçon, le moteur d'entraînement et « Mes questions »

### 2.1 Définition

**Une leçon est une fiche d'environ 5 minutes qui apprend une chose et se termine par un geste** : choisir, écrire, dire à voix haute, ou tenter dans la vraie vie. Toute fiche a un geste, même celles reprises du catalogue (les 5 vannes d'une étape : « choisis celle que tu ressortiras cette semaine »). « Fait » se coche quand le geste est fait, déclaré par l'abonné, sans preuve : c'est le défaut proposé, à confirmer avec la question Q5 du brief (autres options : « Fait » seulement à la validation actuelle, défi ou quiz ; « Fait » à la lecture complète). L'état « Fait » est unique par fiche, quelle que soit la porte d'arrivée.

Deux étages : **les fiches** expliquent et font essayer (sections 3 à 5) ; **le moteur** fait répéter, revoir et sortir de l'écran (2.2 à 2.5). Un troisième lieu, **Mes questions** (2.6), prend le relais quand l'abonné bute sur sa propre situation.

### 2.2 La rafale du jour, carte par carte

Dans « Aujourd'hui », jusqu'à 3 cartes par jour (3 à 5 minutes [HYPOTHÈSE]) : 1 situation nouvelle plus jusqu'à 2 cartes à revoir. Une carte se déroule ainsi :
1. **La scène et le contexte** s'affichent (« tu connais bien la personne », « la file derrière toi s'impatiente »).
2. **« Ta réponse d'abord »** : l'abonné tente SA réplique, à voix haute ou dans sa tête (« dans ta tête, ça compte aussi », comme dans l'app, décision du 04/11), avec un compte à rebours visible de 10 secondes [HYPOTHÈSE de durée, à caler à l'étalon E5], désactivable. Rien n'est enregistré à cette étape, aucun jugement.
3. **Les répliques** apparaissent (la sûre, la joueuse, la risquée) et l'abonné choisit celle qui convient au contexte.
4. **La règle** s'affiche, en une phrase.

Le chrono entraîne la production, pas seulement la reconnaissance. Il est désactivable parce qu'un abonné introverti peut le vivre comme une pression ; il n'y a jamais de « raté », seulement « celle-là, on la reprend ».

**Règles d'écriture des contextes** : une seule bonne réponse défendable par contexte ; chaque situation porte 2 contextes ; sur l'ensemble de la base, environ la moitié des bonnes réponses sont des joueuses, un quart des sûres, un quart des risquées [HYPOTHÈSE, à fixer à l'étalon E1], pour que la rafale n'enseigne jamais « ne prends aucun risque ».

**Les trois registres, en une ligne chacun** (tirés des lettres au format A) :
- **La sûre** : ne vise personne, se ferme toute seule, la conversation reprend sans que l'autre ait à répondre. À choisir quand tu ne connais pas encore l'humour du groupe.
- **La joueuse** : prend la pique au mot et la retourne vers toi ou vers une règle, sans viser quelqu'un. À sortir quand le groupe a déjà ri ensemble.
- **La risquée** : s'adresse à l'autre ou lui rend la parole, elle appelle une réponse et peut sonner comme une provocation si le ton n'est pas complice.

La sûre est donc une vraie réplique légère, pas une simple politesse. Dans le carnet, la réponse correspond à la joueuse et la « sortie polie » (« si c'est tendu ») est une quatrième chose : elle reste nommée « sortie polie » et ne prend pas le nom de « sûre ».

### 2.3 Le stock de la rafale, calculé

**Consommation** : une situation NOUVELLE par jour au plus (le bouton « encore une » sert une carte à revoir ou un autre contexte, jamais une nouvelle). Un abonné qui vient 7 jours sur 7 consomme 30 situations nouvelles par mois. Révision : une carte ratée revient à J+2 puis J+7 ; à défaut de carte à revoir, la place est prise par un autre contexte d'une situation déjà vue.

**Stock**, en situations utilisables par la rafale :

| Source | À l'ouverture (seuil 7.4) | V1 complète |
|---|---|---|
| Carnet d'octobre et de novembre, 2 registres chacun (la réponse, ou la sortie polie si l'ambiance est tendue : le contexte est déjà dans la fiche) | 45 | 45 |
| Situations neuves à 3 répliques, 2 contextes chacune | 30 | 60 |
| **Situations nouvelles disponibles** | **75** | **105** |
| Cartes (situation x contexte) | 45 x 2 + 30 x 2 = 150 | 45 x 2 + 60 x 2 = 210 |

**Couverture d'un abonné quotidien** :

| Jour | Nouvelles consommées | Stock à l'ouverture (75) | Stock V1 complète (105) |
|---|---|---|---|
| J30 | 30 | tient | tient |
| J60 (au-delà du premier renouvellement, J25 à J30) | 60 | tient, marge de 15 | tient, marge de 45 |
| J90 | 90 | 75 : le carnet de décembre (+30, déjà prévu) porte à 105 | tient |

**Flux** : le carnet apporte 30 fiches par mois (déjà prévu) et les situations neuves environ 10 par mois [HYPOTHÈSE, à mesurer au lot 1] : 40 par mois contre 30 consommés par un abonné quotidien. Le stock ne s'épuise pas tant que le carnet continue. La v2 (3 nouvelles par jour, 90 par mois) ne tenait pas : règle abandonnée. Si le flux tombe sous la consommation, l'alerte de stock (même logique que `/api/health` pour les vannes, décision du 18/10) se déclenche à 30 jours d'avance.

**Prérequis** : le carnet n'entre dans la rafale qu'après les trois vérifications de concordance de 1.4. Aucun texte du carnet n'est modifié : la carte reprend ses champs tels quels.

### 2.4 Les missions, le retour et la grille

**Missions en 5 marches** : 1 seul, à voix haute ; 2 à un proche, par message ; 3 à un pote, en face ; 4 dans un petit groupe ; 5 avec quelqu'un qu'on connaît peu. Toujours facultatives, jamais comptées contre l'abonné. **Critère d'écriture : provocable cette semaine** (on lance la phrase, on n'attend pas qu'un vendeur d'aspirateurs surgisse) ; sinon la mission est reformulée. Les défis déjà écrits (conseils, vidéos) sont étiquetés par marche dans une table de correspondance séparée : aucun champ des seeds n'est modifié, diff à zéro mot (P0 s11).

**Retour d'une mission** : « Pas essayé », « Essayé, bof », « Essayé, ça a marché » (les 3 valeurs fermées déjà utilisées pour les exercices). « Essayé, bof » propose deux portes : la fiche « Quand ça tombe à plat » et un lien vers **Mes questions**, type « Situation à gérer » (« Raconte-nous ce qui s'est passé »).

**Grille d'auto-contrôle de la réplique écrite** (après Comment c'est construit, Formules, Jeux d'écriture) : 3 questions oui ou non, rien d'enregistré. (1) Elle tient en une phrase ? (2) Si elle vise quelqu'un, peut-il en rire avec toi ? (3) La fin surprend ? La question 2 ne condamne pas la risquée : elle l'autorise à condition que la cible puisse rire.

### 2.5 Ce que le moteur ne fait pas

Aucune relance d'inactivité, aucun e-mail, aucune notification qui culpabilise, aucun classement, aucune note qui sanctionne. La révision n'apparaît que si l'abonné ouvre l'espace.

### 2.6 Mes questions : l'onglet de l'abonné pour l'équipe

**Décision de Thomas, 12/11** (`founder-preferences.md` l. 164 et 165) : « Qu'il y ait aussi un onglet avec mes questions aussi pour leur espace question. Problème situation à gérer question etc. » puis « Gardons tout en base oui. Vu que c'est leur espace. Ils doivent avoir accès à leur historique ».

**Ce que c'est** : un onglet dédié (nom de travail « Mes questions », à caler par étalon, alternative : « Écrire à l'équipe », libellé déjà validé). L'abonné y choisit en un geste le type de son envoi (**Un problème**, **Une situation à gérer**, **Une question**), écrit, envoie, et retrouve plus bas **Mes envois** : ses messages, leur statut (envoyé, répondu) et les réponses de l'équipe. Il absorbe l'encadré « Ta question à l'équipe » du profil : l'encadré devient une ligne de lien vers l'onglet (l'ancre déjà citée par l'e-mail J12 approuvé reste valide, à vérifier [À VÉRIFIER]).

**Règles du 25/10 inchangées** : réponse en général sous 1 à 2 jours ouvrés (jamais 7 jours), préparée puis relue avant envoi, signée « L'Équipe Deviens Marrant », aucune mention d'IA, aucune limite affichée (garde-fous techniques seulement), questions vers alex@deviens-marrant.fr. **Pas de nouvel e-mail automatique.** L'abonné voit une réponse en ouvrant l'onglet (et, si Thomas le veut, par la cloche du brief §3.6, qui n'est pas un e-mail) ; l'équipe peut continuer à répondre aussi par e-mail à la main, c'est son choix.

**Stockage (décidé le 12/11)** : questions ET réponses sont gardées en base, l'abonné a accès à son historique. Cela rouvre et remplace « rien en base » du 25/10 pour cette fonction, avec l'accord écrit de Thomas. Conséquences à traiter sans alourdir : la confidentialité (sa section 9, à ne pas confondre avec la section 9 de ce document) et les CGU (art. 10) disent aujourd'hui que la question n'est pas conservée et deviennent fausses : elles sont mises à jour au plus court (rien de faux, règle du 19/10 ; pas de nouvel avis @legal de fond, décision du 25/10) ; le texte n'apparaît jamais dans les journaux ni dans Umami ; suppression avec le compte. **Durée de conservation** : défaut proposé « tant que le compte existe », à confirmer (question C9).

**Où l'abonné y arrive (porte unique : l'onglet ; raccourcis depuis le chemin)** :
- après un retour « Essayé, bof » (2.4) ;
- en bas d'une fiche « Quand ça tombe à plat » : « Ta situation n'est pas dans la liste ? Raconte-la à l'équipe » ;
- en fin de séance de 20 minutes et de « Comment c'est construit » : « Montre ta réplique à l'équipe », avec le texte écrit préchargé dans le champ (côté navigateur, jamais dans l'adresse de la page) ;
- depuis « Quoi répondre », quand aucune situation ne correspond au filtre choisi.
Le lien « Montre-la à l'équipe » de la v2 est donc remplacé par un raccourci vers cet onglet, limité à ces points d'entrée (pas après chaque jeu).

**Charge de l'équipe (fondateur solo)** : estimation par abonné actif [HYPOTHÈSE, aucune mesure : 4 abonnés au 02/11, brief §1] : de 0 à 1 message par mois et par abonné au départ ; à 100 abonnés actifs, cela ferait environ 100 messages par mois soit environ 5 par jour ouvré, à tenir en 1 à 2 jours ouvrés. Garde-fous : un message d'attente honnête affiché à l'envoi (« en général sous 1 à 2 jours ouvrés »), un seuil d'alerte interne pour l'équipe quand plus de N messages attendent [HYPOTHÈSE : N = 10], les limites techniques existantes par abonné (3 par 10 minutes, 10 par jour). Une réponse qui juge une réplique est elle-même au niveau (barre Alexa, « pas de vanne plutôt qu'une vanne moyenne »).

**Une valeur supplémentaire** : les envois de type « Situation à gérer » disent quelles scènes les abonnés vivent vraiment. Ils peuvent orienter le choix des nouvelles situations ; jamais reprises telles quelles, seulement anonymisées et avec l'accord de l'abonné, comme pour la lettre (décision du 17/10).

### 2.7 Anatomie commune d'une fiche

1. Titre qui dit la situation ou le mécanisme (jamais un titre de cours). 2. Accroche d'une phrase. 3. Exemple d'abord, règle ensuite. 4. Une seule erreur courante, dite sans jugement. 5. Le geste, avec sa marche de mission quand il y en a une. 6. « Ce qu'on aurait pu dire » : une version possible, jamais « corrigé ». 7. Deux liens vers le catalogue. 8. Durée affichée, statut « Voir » / « Fait ».

---

## 3. Les types de fiches neufs

### 3.1 Libellés vus par l'abonné (propositions, à calibrer à l'étalon)

« Scolaire » ne définit pas la marque. Les noms de travail restent internes.

| Nom de travail | Libellé proposé | Remplace |
|---|---|---|
| Situation | « Quoi répondre » | Situations |
| Gradation | « la sûre / la joueuse / la risquée » | douce, moyenne, piquante |
| Grammaire de la vanne | « Comment c'est construit » | Grammaire |
| Vocabulaire | « Vocabulaire » (mot de Thomas) | pas de renommage |
| Expressions | « Formules à détourner » | Expressions |
| Écouter et décortiquer | « Écouter, repérer » | |
| Rattrapage | « Quand ça tombe à plat » | Guide |
| Exercice et jeu | « À toi » et « Jeux » | Exercice |
| Corrigé | « Ce qu'on aurait pu dire » | Corrigé |
| Test de section | « Le bilan du parcours » (mot déjà dans l'offre, sans certificat) ; le quiz d'étape garde son nom | Test de section |
| Atelier | « Séance de 20 minutes » | Atelier |
| Écrire à l'équipe | « Mes questions » (à caler) | encadré « Ta question à l'équipe » |

Les 12 principes de la v1 (observer avant de parler, se moquer de soi sans s'écraser, viser l'autre sans blesser, l'humour au boulot, etc.) ne forment plus un type « Guide » : ce rôle est tenu par les 120 conseils actifs du catalogue (catégories timing, autodérision, observation, répartie, storytelling, INV 1.1), que chaque fiche neuve relie. Trois de ces principes (le silence, quand ça ne prend pas, être la cible) sont des fiches « Quand ça tombe à plat ». Thomas peut demander des guides neufs plus tard.

### 3.2 Tableau d'ensemble (9 types, volumes V1, paliers)

Volumes = [HYPOTHÈSE de dimensionnement] justifiés par la rafale (2.3) et le rendement (7.3). Paliers : P1 premier pas, P2 prendre le pli (semaines 1 à 4), P3 aller plus loin.

| # | Type | Geste | Fiches neuves | Dont P1 | Dont P2 | Dont P3 | Réemploi |
|---|---|---|---|---|---|---|---|
| 1 | Quoi répondre (3 répliques) | choisir, dire, tenter | 60 | 5 | 40 | 15 (supérieur, inconnu, groupe) | Carnet (45) repris tel quel |
| 2 | Comment c'est construit | écrire | 12 | 0 | 9 | 3 (combiner deux mécanismes) | `/anatomie-vanne`, décryptages |
| 3 | Vocabulaire | reconnaître, placer | 8 fiches (40 mots) | 0 | 8 | 0 | Glossaire (12) |
| 4 | Formules à détourner | écrire | 12 | 0 | 12 | 0 | Vannes déjà détournées [À VÉRIFIER] |
| 5 | Écouter, repérer | repérer, écrire | 12 | 0 | 1 | 11 | Vidéos actives (89) |
| 6 | Quand ça tombe à plat | choisir | 8 | 0 | 8 | 0 | Conseils liés |
| 7 | Jeux | choisir, écrire | 30 | 0 | 30 | 0 | Quiz d'humour, défis |
| 8 | Le bilan du parcours | choisir, dire | 5 | 0 | 5 | 0 | Quiz d'étape conservés |
| 9 | Séance de 20 minutes | faire | 6 | 0 | 1 | 5 | Défis |
| | **Total** | | **153** | 5 | 114 | 34 | |

La ligne « P3 » donne un volume et un emplacement à l'avancé : 15 situations (marches 4 et 5), 3 constructions, 11 écoutes et 5 séances. Le parcours Boulot (DEBUTANT) n'est pas « plus loin » : c'est le parcours suivant de Sophie.

Les 4 pièces du moteur ne comptent pas de fiches : elles réutilisent le type 1.

### 3.3 Quoi répondre (le cœur)

- **Définition** : une scène de la vie courante, trois répliques (la sûre, la joueuse, la risquée), la règle pour choisir, l'erreur courante, le geste. Même squelette que le format A des lettres, **jamais le même texte** (décision du 25/10).
- **Carnet et situations, une seule porte** : le carnet est le flux mensuel de cette rubrique (« Nouvelles ce mois-ci » en tête, archive par mois). Une fiche du carnet est une situation à 2 registres (sa réponse = la joueuse, sa sortie polie), reprise sans modification, signalée « 2 répliques » ; une situation neuve a 3 répliques. `/carnet` garde son URL.
- **Filtres** (deux, en clair) : « Où et avec qui ? » (soirée, boulot, amis, famille, couple, rencontre, commerces, voisins : ce sont les catégories des fiches validées) et « Pour quoi faire ? » (désamorcer, répondre à un chambrage, relancer une conversation, rattraper un faux pas). Un chemin d'entrée : « Les 5 situations pour commencer » (les 5 premières nouvelles de la rafale, 4.1).
- **Persona** : Yanis, au dîner de coloc du dimanche, quand un colocataire sort une poêle de l'évier devant les autres ; Sophie, à la machine à café, face à « ça va ? » qui ne mène nulle part ; Marc, chez un ami, quand on lui demande « alors, quoi de neuf ? » et qu'il cherche une réponse légère [HYPOTHÈSE de scène, à valider à l'étalon].
- **Exemple complet, trois registres [EXEMPLE NON VALIDÉ, candidat d'étalon E1, à passer à l'aveugle avant tout usage]** :
  - Scène : dimanche, 19 h, coloc. Ton colocataire sort la poêle de l'évier, la tient au bout des doigts devant les deux autres : « Quelqu'un connaît le propriétaire de cette poêle ? Elle est là depuis jeudi. »
  - La sûre : « Elle est à moi. Je la laissais refroidir, c'est tout. »
  - La joueuse : « Je ne voulais pas la déraciner : elle s'est bien intégrée. »
  - La risquée : « Elle est à moi. Dis-moi plutôt à qui sont les trois verres qui vivent dans ta chambre. »
  - Pour choisir : après des semaines de remarques sur le ménage, la sûre reconnaît sans t'excuser trois fois. Si les colocs rient déjà de ces dimanches, la joueuse. La risquée seulement si ton colocataire vit lui aussi dans le désordre : sinon elle sonne comme un reproche.
  - Erreur courante : nier d'abord (« ce n'est pas la mienne »), puis t'excuser plusieurs fois. La réplique arrive pendant que tu rangeais déjà.
  - Deux contextes de rafale : (1) « Les remarques sur le ménage s'accumulent depuis des semaines et l'ambiance est lasse » : la sûre. (2) « Ton colocataire vient lui-même de laisser sa vaisselle trois jours » : la risquée.
  - À toi, marche 1 : tiens une poêle ou un autre objet à bout de bras et dis la sûre à voix haute, sans sourire. Marche 2 : envoie à un proche l'aveu minuscule de ta semaine. Marche 3 : au prochain petit désordre que tu provoques toi-même, dis la joueuse en face.
  - Retour : « Pas essayé », « Essayé, bof », « Essayé, ça a marché ».
- **Exemple de rafale tiré du carnet (2026-11-03)** : « Mardi à la boulangerie, la boulangère emballe ton troisième pain au chocolat de la semaine : "Vous n'aviez pas arrêté le sucre, vous ?" » Contexte 1 : tu la connais depuis des mois, elle sourit : « Dans toutes les autres boulangeries, je suis irréprochable. » Contexte 2 : il y a une file derrière toi et elle est pressée : la sortie polie, « Vous avez bonne mémoire. J'essaie de réduire, et cette semaine, ce n'est pas une réussite. » (carnet validé, 1.4)
- **Widget** : le seuil de 90 du 24/10 est celui de « La réplique du jour » du widget, pas celui de l'espace. Le widget garde son stock tout public ; la fiche complète reste Premium ; rien de l'espace n'alimente le widget sans décision séparée.

### 3.4 Comment c'est construit

- **Définition** : un mécanisme de vanne démonté en deux temps (installer, casser) puis refait par l'abonné.
- **Persona** : Yanis cherche, avant le repas de coloc, comment lancer un aveu minuscule sur lui sans que ça sonne comme une excuse ; Sophie veut un gabarit de dix secondes pour la machine à café, sur sa propre mauvaise habitude de bureau ; Marc, quand un ami lui demande des nouvelles, veut pouvoir lâcher un aveu léger plutôt que le résumé de sa vie.
- **Format** : 5 minutes, 200 à 250 mots, schéma en une ligne, un exemple, un geste d'écriture, la grille de 2.4.
- **Volume** : 12 mécanismes, une fiche maîtresse par notion (callback, escalade comique, aveu minuscule fusionné avec le faux secret, règle de trois, détournement, contraste, litote, fausse logique, détail trop précis, chute qui retourne le début, exagération contrôlée, combinaison de deux mécanismes). Une notion, une fiche : Vocabulaire et Formules y renvoient.
- **Noms de techniques** : cités seulement ici et dans Vocabulaire, jamais dans les situations ni les étapes (cohérent avec la décision du 04/11 pour l'app).
- **Exemple [EXEMPLE NON VALIDÉ], source : étape 1 de Machine à Café, quiz validé** :
  - Le mécanisme, le faux secret : « Ça reste entre nous : » puis un aveu minuscule, sur toi, dit avec la gravité d'un scandale.
  - Un exemple : « Ça reste entre nous : je dis "je regarde ça" sur tout ce que je ne regarderai jamais. »
  - La règle : un seul aveu, court, sur toi, avec un détail que tout le monde reconnaît.
  - Erreur courante : ajouter « non mais je rigole » juste après.
  - À toi : écris ton faux secret en trois essais, puis passe la grille.
  - Une seconde version possible, tirée du même quiz : « Ça reste entre nous : le nouveau stagiaire dit "pas de souci" à tout, même à ce qu'il ne comprend pas » : elle échoue à la grille (elle vise le stagiaire), et c'est justement ce qu'elle montre : une version qui ne marche pas, pour sentir pourquoi.

### 3.5 Vocabulaire

- **Définition** : le jargon utile pour parler d'humour, un mot par entrée. Les 12 termes du glossaire public sont la base ; la rubrique ajoute 28 mots, soit 40.
- **Format** : une fiche = 5 mots d'un thème, 5 minutes. Chaque entrée : une ligne neuve qui dit le mot en clair, un exemple en deux temps, « à ne pas confondre avec », un lien vers la définition complète (glossaire pour les 12, fiche maîtresse de construction sinon). **Les définitions du glossaire ne sont pas recopiées** : la rubrique renvoie, un seul glossaire.
- **Règle** : un mot qui a une fiche maîtresse dans Comment c'est construit n'est jamais l'exemple de Vocabulaire ; chaque mot a un emploi attesté vérifié ; aucun mot de scène (open mic, plateau, flop).
- **Persona** : Yanis, un samedi chez ses potes, entend « c'est un callback » devant une vidéo et ne sait pas de quoi on parle ; Sophie veut nommer ce qu'elle fait quand elle rebondit sur le mot d'un collègue ; Marc regarde du stand-up avec un ami et veut suivre la conversation.
- **Exemple [EXEMPLE NON VALIDÉ, structure seule]** : « Accusé de réception. [Une ligne neuve d'après le glossaire.] En deux temps : [la pique, puis le geste qui montre que tu l'as entendue : à écrire à l'étalon E3]. À ne pas confondre avec : l'excuse. Définition complète : /glossaire. »

### 3.6 Formules à détourner

- **Définition** : une expression que tout le monde connaît, dont on garde le début tel quel et dont on remplace la fin par son quotidien.
- **Persona** : Sophie en cherche une pour le mot d'excuse de fin de réunion ; Yanis, pour un message de groupe où il veut se glisser sans risque ; Marc, pour un toast léger à un dîner.
- **Format** : 5 minutes, 5 expressions par fiche : la règle (début conservé, fin remplacée), le piège (changer les deux moitiés), le geste d'écriture, une version possible.
- **Volume** : 12 fiches, 60 détournements [HYPOTHÈSE], chacun passe la barre Alexa.
- **Exemple [EXEMPLE NON VALIDÉ, la règle seule, aucun détournement présenté]** : « Expression : [une expression courante]. Règle : on garde la première moitié telle quelle, on remplace la seconde. Deux versions possibles : [à écrire à l'étalon E2, barre Alexa, jamais entendues]. Piège : changer aussi la première moitié, plus personne ne reconnaît l'expression. »

### 3.7 Écouter, repérer

- **Définition** : un passage court (1 à 2 minutes) d'un humoriste, démonté puis transposé à la vie de l'abonné (le format B des lettres appliqué aux vidéos du site, avec d'autres passages et d'autres textes ; aucun texte de lettre repris).
- **Persona** : Yanis revoit avec ses potes un passage qui l'a fait rire et veut savoir pourquoi la salle part à cet instant ; Sophie veut reprendre un mécanisme pour le pot de départ d'un collègue ; Marc regarde seul le soir et veut une raison de rire qui lui laisse quelque chose à essayer le lendemain.
- **Format** : le passage (minute et seconde exactes), ce que l'artiste fait (3 observations), pourquoi c'est efficace (une idée), ta version à toi, la grille de 2.4.
- **Volume** : 12 en V1, puis 1 à 2 par mois en session [HYPOTHÈSE : 12 = 1 par mois sur un an, rythme déjà tenu pour le format B des lettres ; la vérification de chaque passage est le facteur limitant].
- **Règles** : humoristes récents proches de l'audience (25/10), nommés et cités sans réserve (P0 du 05/10), citation réelle et courte, jamais de citation inventée ; citation douteuse = on vérifie, on ne retire pas. Prérequis en 7.5.
- **Exemple [EXEMPLE NON VALIDÉ, structure seule]** : passage candidat : Karim Duval, « Génération Y » (le « pourquoi » du seed : détournement de jargon corporate en humour, à confirmer en visionnant). Minute : [à relever]. Ce qu'il fait : [3 observations après visionnage]. À toi : prends un jargon de ton boulot ou de ta fac, dis-le avec un sérieux total, puis ajoute un détail qui le trahit.

### 3.8 Quand ça tombe à plat

- **Définition** : une fiche courte pour la minute d'après : une réplique qui ne prend pas, un silence, une phrase dirigée contre toi. Même structure que Quoi répondre (3 sorties). Se retrouve dans « Quoi répondre » avec le filtre « rattraper un faux pas ».
- **Persona** : Yanis, sa vanne tombe à plat devant les colocs et personne ne dit rien ; Sophie, le silence en réunion après sa phrase ; Marc, au dîner, quelqu'un le reprend sur ce qu'il vient de dire.
- **Volume** : 8 fiches, 24 sorties à écrire (barre Alexa, comptées en 7.3) : le silence après ta vanne, quand ça ne prend pas, quand tu es la cible, quand tu as dit la mauvaise chose, quand on te corrige en public, quand on te coupe, quand tu oublies la chute, quand tu veux sortir de la conversation.
- **Exemple [EXEMPLE NON VALIDÉ, candidat d'étalon]** : « Ta vanne tombe à plat, trois secondes de silence. La sûre : "Celle-là demandait un deuxième café." La joueuse : "Je la garde pour la version deux." La risquée : "Je recommence plus lentement, pour les derniers rangs." Pour choisir : la risquée s'adresse à la salle et demande qu'elle joue : réservée aux groupes qui te connaissent. » Retour : « Essayé, bof » arrive ici ; « Ta situation n'est pas dans la liste ? Raconte-la à l'équipe » mène à Mes questions.

### 3.9 Jeux

- **Définition** : un défi de 3 à 5 minutes qui fait pratiquer une compétence, avec « ce qu'on aurait pu dire ».
- **Persona** : Yanis, 5 minutes dans le tram avant les cours, sur son téléphone ; Sophie, 5 minutes entre deux réunions, sans que personne ne voie ce qu'elle fait ; Marc, un soir chez lui, quand le silence de l'appartement pèse.
- **Familles (30)** : « Quelle réplique ? » (reprend des situations existantes avec un autre contexte, aucune réplique neuve) ; « Finis la phrase » (même mécanique que le défi de l'app, décision du 04/11) ; « Trouve l'angle » ; « Change de registre » ; « Remets la chute » ; « Les pires réponses ».
- **Où ils vivent** : la page « S'entraîner » (jeux, séances, missions), atteinte par une carte de « Aujourd'hui », et un lien « À toi » depuis chaque fiche et chaque étape.
- **Exemple [EXEMPLE NON VALIDÉ] : « Trouve l'angle »** : « Objet : la photocopieuse de l'étage. Note trois choses vraies sur elle, pas des blagues. Ce qu'on aurait pu relever : 1) elle tombe en panne le jour des impressions urgentes ; 2) il y a toujours un bac vide que tout le monde a vu ; 3) personne ne sait qui l'a déclarée en panne la dernière fois. L'angle qui travaille le mieux est le troisième : un non-dit que tout le monde partage. La blague vient ensuite, de ce que tu fais de lui. » (le premier exemple, l'odeur de poisson, est retiré : cliché de l'open space)

### 3.10 Le bilan du parcours

- **Définition** : six questions à la fin d'un parcours : choisir et dire, pas seulement reconnaître.
- **Format** : 4 questions « laquelle de ces répliques convient ? » construites sur des situations déjà validées du parcours avec un contexte (aucune réplique neuve : seul le contexte est à écrire, 20 contextes en tout), 1 « remets dans l'ordre », 1 « dis-la à voix haute » (déclaré). Retour en phrases, pas de note, pas de seuil, pas de certificat (07/10). Une erreur renvoie vers la fiche à revoir : « celle-là mérite un deuxième tour ».
- **Persona** : Sophie, à la fin de Machine à Café, veut savoir si elle placerait sa vanne au bon moment ; Marc veut une mesure concrète de sa progression, sans note ; Yanis la prend à son rythme, sans public.
- **Volume** : 5, un par parcours, comptés comme fiches du parcours.
- **Exemple de forme** : la structure du quiz de Machine à Café étape 1, question 2 (« Ton faux secret est lâché, les collègues se sont penchés vers toi. Et maintenant ? », bonne réponse : s'arrêter net, source seed).

### 3.11 Séance de 20 minutes

- **Définition** : une séance guidée hors écran (seul ou avec un pote). Le coaching en direct n'existe pas chez nous (supprimé le 13/10) : c'est un exercice long, sans écran, que le site ne reçoit pas.
- **Format** : 3 temps puis un bilan : 3 min d'échauffement, 5 min d'observation, 8 min d'essai, 4 min de bilan (20 minutes). Rien n'est enregistré.
- **Persona** : Marc la fait seul chez lui avant d'oser en face ; Yanis la fait avec un colocataire de confiance ; Sophie la fait sur son trajet du soir, à voix basse.
- **Volume** : 6 (1 au palier 2, la semaine 3 ; 5 au palier 3).
- **Exemple [EXEMPLE NON VALIDÉ], tiré du carnet de novembre : « Dix chambrages, dix secondes »** :
  - Échauffement (3 min) : lis à voix haute les trois répliques d'une fiche de « Quoi répondre ».
  - Observation (5 min) : lis dix phrases qu'on te dit, par exemple « Il n'en reste que deux, hein. », « Vous n'aviez pas arrêté le sucre, vous ? », « Ça y est, ils ont rallumé le chauffage collectif ! » (champ « on te dit » du carnet).
  - Essai (8 min) : à chaque phrase, réponds à voix haute en dix secondes ; tu peux t'enregistrer sur ton téléphone, le site ne reçoit rien.
  - Bilan (4 min) : la grille de 3 questions sur la réplique que tu as préférée.

---

## 4. Le chemin de l'abonné dans le temps (une seule source)

### 4.1 Calendrier type des 4 premières semaines

Tout reste ouvert (décision du 18/10) : c'est un ordre conseillé, jamais un verrou. Ce tableau est la SEULE source ; 4.3 et 5.4 en dérivent sans le contredire.

| | Semaine 1 | Semaine 2 | Semaine 3 | Semaine 4 |
|---|---|---|---|---|
| Rafale (tous les jours, facultative) | 1 situation nouvelle par jour : les 5 premières sont « Les 5 situations pour commencer » | idem | idem | idem |
| Situations nouvelles vues (au plus) | 7 | 7 | 7 | 7 |
| Premier pas | Jour 1 : la situation d'entrée (5 min, marche 1) | | | |
| Parcours conseillé | aucun (facultatif) | étape 1 | étape 2 (date conseillée 7 jours après la validation de l'étape 1) | étape 3, puis le bilan si le parcours est fini (Machine à Café) |
| Mécanisme | « Le faux secret » (Comment c'est construit) | un mot ou deux de Vocabulaire, au choix | | |
| Séance de 20 minutes | | | la première, facultative | |
| Écouter, repérer | | | | le premier, facultatif |
| Mission | marche 1 | marche 2 | marche 3 | marche 3 (reprise) |
| Mes questions | à tout moment, jamais demandé | idem | idem | idem |

Temps : rafale jusqu'à 5 min par jour (jusqu'à 35 min par semaine, facultatif), plus l'étape (cœur 15 à 20 min si C2 = A, environ 22 min sinon), plus les missions hors écran. Le calendrier est identique pour les trois personas ; seuls changent la scène d'entrée et le parcours conseillé (4.3). **Palier** : P1 = jour 1 ; P2 (« prendre le pli ») = semaines 1 à 4 ; P3 (« aller plus loin ») = après la semaine 4 : situations avec un supérieur ou un inconnu, écoutes, séances, marches 4 et 5, parcours Storytelling.

**Règle du « jour 7 »** : la date conseillée de l'étape suivante n'existe qu'après une première validation (`nextRecommendedAt`). Pour un abonné sans étape validée, « Aujourd'hui » propose « Commencer l'étape 1 » sans date, jamais « en retard ».

### 4.2 Le premier pas (moins de 5 minutes)

Règle du brief (§3.2) : un seul premier pas nommé, qui produit quelque chose que l'abonné ressent, le même sur la page de succès et dans « Aujourd'hui ». Contenu proposé, **qui modifie la règle n°2 du brief** (« la première étape du parcours désigné par le quiz ») :
1. Si l'abonné vient d'une fiche (`returnTo`) : cette fiche.
2. Sinon, si le quiz a été passé : la situation d'entrée du profil (5 profils : Observateur, Storyteller, Absurde, Punchlineur, Taquin ; 5 situations d'entrée à désigner parmi les 60, 5 jugements comptés en 7.3).
3. Sinon : la première des « 5 situations pour commencer » (valeur proposée pour le cas 3 de Q10 du brief).
La règle du brief garde l'étape 1 de parcours comme première étape conseillée, pas comme premier pas (elle dure 15 minutes ou plus). L'événement « aha » du brief (étape validée ou exercice ouvert) devient « Fait » déclaré de la situation d'entrée : à confirmer avec @data-analyst que ce signal est assez fort, et avec la réponse à Q10 du brief.

### 4.3 Par persona (ce qui varie)

| | Yanis, 20 ans | Sophie, 26 ans | Marc, 34 ans |
|---|---|---|---|
| Scène d'entrée (jour 1) | « Quelqu'un te chambre devant tout le monde en coloc » (son sujet écrit : coloc, soirées, potes) | « Le collègue qui lance "ça va ?" à la machine à café » (son sujet écrit) | « Quelqu'un te demande "alors, quoi de neuf ?" » [HYPOTHÈSE : scène d'étalon, non écrite dans le persona] |
| Parcours conseillé (semaines 2 à 4) | Répartie, étape 1 « Tes premières répliques » (gratuite), étapes 2 et 3 ; INTERMEDIAIRE au code : à relire pour un débutant [À VÉRIFIER] ; son sujet écrit est le tac au tac | Machine à Café (DEBUTANT, persona du seed : Sophie), étapes 1 à 3 puis bilan ; ensuite Boulot (DEBUTANT) | Confiance, étapes 1 à 3 (INTERMEDIAIRE ; son besoin écrit : retrouver confiance dans ses interactions) |
| Après la semaine 4 | Confiance ou Storytelling ; marches 4 et 5 | Boulot ; situations avec un supérieur | Storytelling ; marche 4 en groupe |
| Si le quiz d'humour a été passé | le parcours désigné par le quiz remplace le parcours conseillé | idem | idem |

Aucune relance : si l'abonné n'ouvre pas l'espace, rien ne part. Ce qui l'attend à son retour s'affiche à l'ouverture de « Aujourd'hui ».

### 4.4 Aujourd'hui : règle de priorité

Une seule action principale visible, quatre états (brief §3.2 : maximum 3 actions principales par écran) :
1. **Aucune fiche faite** : le premier pas.
2. **La rafale du jour n'est pas faite** : la rafale du jour.
3. **La rafale est faite** : « Reprendre » l'étape en cours (ou « Commencer l'étape 1 » sans date).
4. **Mission ouverte** : lien secondaire, jamais l'action principale.

Au-dessus de la ligne de flottaison à 375 px : (a) salutation et repère neutre « 12 situations cette semaine » (ni série ni points, voir C4) ; (b) l'action principale ; (c) le contenu du jour. **Le contenu du jour (vanne, conseil, vidéo, calendriers préparés) est conservé** (brief §3.2, bloc 3) : la « situation du jour » est la nouvelle situation de la rafale, pas un bloc de plus. En dessous : S'entraîner (jeux, séances, missions), nouveautés (carnet du mois, date conseillée, lettre du jeudi), « Ton mois » (à J25 environ : situations faites, étapes validées, missions tentées ; jamais un tableau de zéros, absent tant que rien n'est fait). Le détail visuel revient à @design.

### 4.5 Au-delà de la V1 : qui ajoute quoi

Règle du 25/10 déjà en place pour les lettres : un mois ajouté chaque mois, en session, jamais par tâche planifiée ni génération automatique.

| Rythme | Quoi | Qui |
|---|---|---|
| Mensuel | Carnet du mois (30 fiches, déjà prévu) ; environ 10 situations neuves ; 1 à 2 « Écouter, repérer » ; un point sur les types de « Situation à gérer » reçus dans Mes questions (anonymisés, avec accord) | @copywriter en session avec Thomas, même contrôle que les lettres |
| Trimestriel | 4 à 5 jeux neufs ; réévaluation des types peu utilisés (7.6) | @creative-strategy, @data-analyst |
| Alerte | Stock de situations non vues à 30 jours de la fin pour un abonné régulier | @fullstack |

---

## 5. Parcours : découpage sans rien perdre, temps, niveaux

### 5.1 Principe

On garde les 5 parcours, leurs 25 étapes et leurs textes. Chaque étape devient un sous-parcours de fiches numérotées « Voir / Fait ». Aucun texte validé n'est réécrit (P0 s18, étalons s17 à s19). Les ancres `#etape-N` restent (les lettres approuvées y pointent), les fiches s'ajoutent en `#fiche-N-M`. Mesure du diff réel (taux de changement, slugs, titres, liens, chiffres, prix) à chaque parcours (P0 s11). Compléments de Storytelling (second défi, phrase de protection) et de Boulot (« Version sans risque », « Aller au défi ») : conservés, chacun devient une fiche ou une partie de fiche (INV T8).

### 5.2 Exemple complet : Machine à Café, étape 1

Blocs existants (`parcours-seed.json`) : scène, pourquoi, conseil « L'humour à la machine à café » avec exemple et défi, 5 vannes, 2 vidéos (Paul Séré « Les relations amoureuses », Karim Duval « Génération Y »), quiz de 4 questions, 50 XP, gratuite. Durées : estimations INV 3.1 [HYPOTHÈSE], à chronométrer.

| N° | Fiche | Origine | Geste | Durée | Cœur ou plus loin |
|---|---|---|---|---|---|
| 0 | Introduction du parcours (de la fiche 0 du parcours, une seule pour les 3 étapes) | Assemblée depuis le seed : description, durée, rythme, accroche persona, exemple « Imagine Léa » (textes validés, inchangés) | Choisir ton point de départ | 2 min | Cœur |
| 1.1 | Le conseil et son défi (scène fondue en introduction) | Existant, inchangé | Le défi du conseil | 4 min | Cœur |
| 1.2 | Les 5 vannes | Existantes, inchangées | Choisir celle que tu ressortiras cette semaine | 2 min | Cœur |
| 1.3 | Écouter : des vannes enchaînées | Vidéo 1, Paul Séré | Repérer l'amorce et la chute | 7 min | Cœur |
| 1.4 | Écouter : détourner le jargon | Vidéo 2, Karim Duval | Repérer le mot détourné | 7 min | Plus loin (C2) |
| 1.5 | Le quiz de l'étape | Existant, inchangé | Répondre | 2 min | Cœur |
| 1.6 | Une situation liée : le collègue qui lance « ça va ? » | NEUVE, une des 60 de « Quoi répondre » | Choisir, dire (marche 1) | 5 min | Plus loin |
| 1.7 | Le faux secret, comment c'est construit | NEUVE, une des 12 constructions | Écrire ton faux secret | 5 min | Plus loin |

- **Rien n'est perdu** : conseil, défi, 5 vannes, 2 vidéos, quiz, scène et « pourquoi » sont tous là, mot pour mot.
- **Total de l'étape** : 7 fiches numérotées (1.1 à 1.7), plus la fiche 0 commune. **Cœur** : environ 17 min (dont 2 min d'introduction faite une seule fois) si la vidéo 2 passe en « plus loin » ; environ 24 min sinon (cohérent avec l'étape actuelle, 22 à 25 min d'après INV).
- **Le « Fait » de l'étape** (XP, série) reste celui d'aujourd'hui : défi du conseil et quiz.
- **C2 A touche le statut de vidéos choisies par Thomas** (étalons du 07/10, vidéos de Boulot regardées le 11/10) : elles passent de « obligatoires » à « pour aller plus loin » sans qu'aucun texte change. La phrase de format affichée (« Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. ») serait ajustée en conséquence (« dont une vidéo pour aller plus loin ») : c'est une retouche de texte validé, marquée dans C2.
- **Les 4 autres parcours** : même découpage, à relire étape par étape avant écriture [À VÉRIFIER : seuls Machine à Café 1 et 2 relus].

### 5.3 Totaux exacts (fiches distinctes et emplacements)

Chaque étape reçoit deux fiches neuves : une situation (25 étapes, 25 situations distinctes sur 60) et, selon l'étape, soit son mécanisme (12 étapes, une construction chacune, 12 sur 12) soit un jeu (13 étapes, 13 jeux distincts sur 30). Chaque parcours reçoit une fiche 0 (assemblée du seed, aucun texte neuf) et un bilan (neuf, compté).

| | Fiches distinctes | Emplacements dans les parcours | Réemplois |
|---|---|---|---|
| Fiches existantes reconditionnées (conseil, vannes, 2 vidéos, quiz) | 5 par étape = 125 | 125 | 0 |
| Fiches 0 d'introduction (assemblées du seed) | 5 | 5 | 0 |
| Situations neuves | 60 | 25 | 0 (35 hors parcours) |
| Comment c'est construit | 12 | 12 | 0 |
| Jeux | 30 | 13 | 0 (17 hors parcours) |
| Bilans du parcours | 5 | 5 | 0 |
| Vocabulaire, Formules, Écouter, Quand ça tombe à plat, Séances | 8 + 12 + 12 + 8 + 6 = 46 | 0 | 0 |
| **Total** | **125 + 5 + 153 = 283** | **125 + 5 + 25 + 12 + 13 + 5 = 185** | 0 |

Fiches neuves : 153, dont 55 dans les parcours (25 + 12 + 13 + 5) et 98 hors parcours (35 + 17 + 46). Emplacements par parcours : Machine à Café 3 x 7 + 2 = 23 ; Répartie 4 x 7 + 2 = 30 ; Confiance, Storytelling et Boulot 6 x 7 + 2 = 44 chacun ; total 185. Les chiffres « 125 à 150 » et « 40 % de neuves » de la v1 et « 103 hors parcours » de la v2 sont abandonnés.

### 5.4 Ordre conseillé « Tes 4 premières semaines »

En tête de « Parcours », le calendrier de 4.1 présenté en quatre lignes, sans nouveau parcours ni niveau (c'est le « Parcours Débutant » de la capture). Yanis n'a pas de parcours DEBUTANT sur son sujet : cet ordre lui donne une marche 1 sans toucher à « les 5 parcours ». Un 6e parcours Répartie pour Yanis est à la roadmap depuis le 07/10 : le prolonger est l'option C de la question C7.

### 5.5 Accès visiteur et abonné (aucun compte gratuit, rien d'ouvert ni retiré aux visiteurs, 05/10)

| Contenu | Visiteur | Abonné Premium |
|---|---|---|
| Étape 1 de chaque parcours | Page publique actuelle, inchangée | Découpage en fiches |
| Fiches neuves | Rien | Tout |
| Glossaire `/glossaire` (12 termes) | Public, inchangé | Public, plus la rubrique Vocabulaire (40 mots) |
| Carnet | Extrait actuel, inchangé | Tout, dans « Quoi répondre » |
| Exercices et missions | Jamais (`champs-premium.ts`) | Tout |
| Mes questions | Rien | Envoi, historique et réponses |
| Pages de l'espace | `noindex` | `noindex` |

Aucun extrait des nouvelles rubriques pour les visiteurs en V1. **Angle mort signalé** : la page `/abonnement` (textes approuvés) ne mentionne pas ces nouvelles rubriques ; les y ajouter rouvre des textes validés et relève de @growth et @copywriter, avec Thomas (la conversion est « LA priorité », 19/10).

---

## 6. Barre de rubriques et portes

### 6.1 Contraintes

6 entrées visibles au plus, « Plus » compris (12/11, Q3 = A) ; « Mon espace » (Q2 = A) ; la barre s'affiche aussi sur les pages publiques pour l'abonné (Q11 = A) ; **« Mon profil » reste dans le menu de compte, hors des 6**, et mène aux réglages (`/profil`) ; libellés en texte ; aucune rubrique vide à l'ouverture ; aucun doublon. **Règle de porte** : chaque contenu a UNE porte principale ; les liens depuis un parcours, une fiche ou « Aujourd'hui » sont des raccourcis vers la même fiche, dont l'état « Fait » est unique. `header-budget.spec.ts` fige les onglets : à mettre à jour avec le libellé validé (@ux, @design).

### 6.2 Trois variantes, UNE question (C1)

Thomas veut « Vocabulaire » et « Mes questions » dans l'espace. Aucune variante n'affiche « Vocabulaire » sur un onglet qui contiendrait autre chose sans le dire.

| | A | B | C (recommandée) |
|---|---|---|---|
| Barre | Aujourd'hui, Parcours, Quoi répondre, Catalogue, Mes questions, Plus | Aujourd'hui, Parcours, Quoi répondre, Vocabulaire et techniques, Mes questions, Plus | Parcours, Quoi répondre, Vocabulaire et techniques, Catalogue, Mes questions, Plus ; « Mon espace » en tête de barre mène à « Aujourd'hui » |
| Vocabulaire, Comment c'est construit, Formules | Première ligne de « Plus », sous le titre « Vocabulaire et techniques », et une carte dans « Aujourd'hui » | Onglet visible « Vocabulaire et techniques » (trois portes nommées dès le premier écran) | Onglet visible « Vocabulaire et techniques » (idem) |
| Catalogue (vannes, conseils, vidéos, écouter-repérer) | Visible | Dans « Plus » | Visible |
| Pour | Reste dans les 6 sans condition ; le catalogue payé reste à un clic | « Vocabulaire » visible ; « Aujourd'hui » est un onglet | Tout ce que Thomas a nommé est visible : vocabulaire, questions, parcours, catalogue |
| Contre | Le mot de Thomas n'est pas sur la barre | Catalogue repoussé dans « Plus » (sur `/vannes`, l'onglet actif serait « Plus ») | « Aujourd'hui » n'est plus un onglet : si le lien « Mon espace » compte parmi les 6 entrées, la barre fait 7 et il faut revenir à A |

Reco : C, à valider par @ux et @design sur rendu sombre, avec le test de 3 secondes (« où irais-tu pour apprendre à construire une vanne ? »). Si le lien « Mon espace » compte comme entrée, A.

**Contenu de « Plus »** (dans les trois variantes, deux blocs) : « Mon contenu » : Favoris et notes. « Le reste » : Lettre (ton inscription du jeudi et la date de la prochaine lettre, rien d'autre : l'espace ne reprend aucun texte de lettre), Articles, Quiz d'humour. « Écrire à l'équipe » n'y est plus : c'est « Mes questions ».

**État de la barre à l'ouverture** : seules les entrées dont le seuil de 7.4 est atteint apparaissent. Aucune entrée n'ouvre sans « Quoi répondre » : c'est la condition d'ouverture.

### 6.3 Porte principale de chaque page ou type

| Contenu | Porte | Remarque |
|---|---|---|
| Aujourd'hui (rafale, premier pas, cartes) | « Mon espace » ou onglet Aujourd'hui | |
| Parcours, étapes, fiche 0, bilan du parcours | Parcours | Le bilan est la dernière fiche du parcours |
| Quoi répondre, carnet (`/carnet`) | Quoi répondre | URL conservées |
| Quand ça tombe à plat | Quoi répondre (filtre « rattraper un faux pas ») | Lien depuis « Essayé, bof » |
| Vocabulaire, Comment c'est construit, Formules | Vocabulaire et techniques | Un seul glossaire : `/glossaire` public est la vitrine |
| Vannes, conseils, vidéos, Écouter repérer | Catalogue | |
| Jeux, séances, missions | Page « S'entraîner », atteinte par une carte de « Aujourd'hui » et par « À toi » | |
| Mes questions (envoi, historique, réponses) | Mes questions | Remplace l'encadré du profil |
| Quiz d'humour, Articles | Plus | Articles restent publics (SEO) |
| Favoris, notes | Plus | Notes : Q5b du brief |
| Lettre | Plus | Inscription et prochaine date |
| Mon profil | Menu de compte | `/profil` garde son adresse |

### 6.4 Correspondance avec la capture

| Rubrique de la capture | Décision |
|---|---|
| Guides | Conseils (catalogue) et Comment c'est construit |
| Parcours | Parcours |
| L'atelier des mots | Vocabulaire ; écriture guidée dans Comment c'est construit et Formules |
| Grammaire | Comment c'est construit |
| Vocabulaire | Vocabulaire |
| Expressions et proverbes | Formules à détourner |
| Apprendre, lire et écouter | Catalogue (vidéos) et Écouter, repérer |
| Exercices et jeux | Jeux (page S'entraîner) |
| Favoris, Mes notes | Plus |
| Ateliers | Séance de 20 minutes ; pas de coaching en direct (13/10) |
| Écrire au coach | Mes questions |
| Test de fin de section | Le bilan du parcours |
| (demande de Thomas, hors capture) | Quoi répondre |

---

## 7. Production

### 7.1 Règle de relecture : la question C8

La décision de Thomas du 12/11 est « chaque étape itérée jusqu'à 10 », relecture à l'aveugle, « jusqu'à 10/10 chez tous les relecteurs » (`founder-preferences.md` l. 163). Elle ne dit pas comment l'appliquer à 180 répliques drôles, ni ce que devient « 2 avis sur 3 » (08/10) pour les contenus de l'espace. Ce document ne pose donc AUCUNE règle de relecture : la question C8 la pose. En attendant la réponse : les 5 étalons sont relus à 10/10 chez tous les relecteurs (lecture littérale du 12/11), et le garde-fou du 08/10 reste vrai (une faute objective est corrigée quel que soit le vote). Barre « niveau Alexa » pour toute vanne ou réplique : chute surprenante, courte, logique, observation vraie, jamais entendue ailleurs ; pas de réplique plutôt qu'une réplique moyenne ; rien sous la barre n'entre en ligne (P0 s18).

### 7.2 Pipeline et lecture de Thomas

1. Étalon validé par Thomas, par type (section 9), avant tout brief @copywriter.
2. Écriture par lots de @copywriter : 3 candidates par emplacement de réplique [HYPOTHÈSE].
3. Contrôle de vérité (citations, minutes, définitions, sources) avant relecture.
4. Relecture à l'aveugle (règle C8), puis Stand-Up Director sur les répliques.
5. Mesure du diff réel pour tout contenu existant reconditionné (P0 s11).
6. **Lecture de Thomas, recalculée pour de vrai** : les 5 étalons en entier, puis un échantillon de 3 fiches sur 10 par lot (au lieu de tout lire), et le visionnage de chaque passage choisi pour « Écouter, repérer ». Sauf avis contraire de Thomas, c'est la règle proposée ; il peut demander à tout lire.

| Type | Fiches | Lots | Échantillon lu |
|---|---|---|---|
| Quoi répondre | 60 | 6 de 10 | 18 |
| Comment c'est construit | 12 | 2 de 6 | 4 |
| Formules | 12 | 2 de 6 | 4 |
| Jeux | 30 | 3 de 10 | 9 |
| Écouter, repérer | 12 | 2 de 6 | 4 (et 12 passages visionnés) |
| Vocabulaire | 8 | 1 | 3 |
| Quand ça tombe à plat | 8 | 1 | 3 |
| Bilans | 5 | 1 | 2 |
| Séances | 6 | 1 | 2 |
| Étalons | 5 | | 5 |
| **Total lu** | | | **54 fiches sur 153 (environ un tiers) plus 12 passages visionnés** |

La mise en ligne reste sur le go écrit de Thomas, derrière l'interrupteur fermé du brief.

### 7.3 Capacité par type

Rendement de la section 1.3 : de 1 sur 2 à 1 sur 12. Base : 3 candidates par emplacement ; pire cas : 12 par emplacement.

| Type | Emplacements à tenir | Candidates (base, pire cas) | Barre humour | Palier |
|---|---|---|---|---|
| Quoi répondre, 3 répliques | 60 x 3 = 180 répliques | 540, 2 160 | Oui | P1, P2, P3 |
| Contextes de la rafale (2 par situation neuve) | 120 contextes, une seule bonne réponse défendable ; les désaccords se règlent en reformulant le contexte | 240 | Jugement, pas d'humour | P2 |
| Quand ça tombe à plat | 8 x 3 = 24 sorties | 72, 288 | Oui | P2 |
| Formules à détourner | 60 détournements | 180, 720 | Oui | P2 |
| Jeux d'écriture (Finis la phrase, Remets la chute) | environ 20 chutes | 60, 240 | Oui | P2 |
| Bilans | 0 réplique neuve ; 20 contextes (5 bilans x 4 questions) | 40 | Jugement | P2 |
| Mapping du quiz d'humour vers une situation d'entrée | 5 profils, 5 situations d'entrée | | Jugement | P1 |
| Étiquetage des défis par marche | défis des 120 conseils et 89 vidéos [À VÉRIFIER : nombre réel] ; table de correspondance séparée, aucun champ modifié | 1 passe plus 1 relecture | Non | P2, P3 |
| Comment c'est construit, Vocabulaire, Écouter, Séances | 38 fiches de texte | 1 version corrigée chacune | Exemples seulement | P2, P3 |
| **Total de candidates à écrire** | | **environ 1 100 (base) à 3 700 (pire cas)** | | |

Règles : (a) **60 est une cible de situations VALIDÉES, pas une coupe** : si le rendement est bas, on écrit plus de candidates, jamais moins de situations, jamais une barre abaissée. (b) Une situation peut sortir avec 2 répliques bonnes sur 3 (la risquée est la plus fragile) ; on ne force pas la troisième. (c) Point de contrôle après le lot 1 de 10 situations : on mesure le rendement réel, on met ce tableau à jour et on le montre à Thomas avant le lot 2.

**Chantier de développement en plus du contenu** (@product-manager, @fullstack) : 4 tables (état de rafale par abonné et situation ; retours de mission ; état « Fait » par fiche ; messages et réponses de Mes questions), un outil pour que l'équipe saisisse ses réponses, la page « S'entraîner », la barre pilotée par les seuils. Aucune notification par e-mail.

### 7.4 Ordre de production et seuils d'ouverture

| Ordre | Quoi | Dépend de | Seuil d'ouverture |
|---|---|---|---|
| 0 | Étalons (5) | Thomas | Bloquant |
| 0 bis | Concordance du carnet (1.4) et levée de INV T5 (vidéos) | | Prérequis de 2 et de 6 |
| 1 | Vocabulaire et Comment c'est construit, en parallèle (ils fixent les noms) | E2, E3 | Vocabulaire et techniques : 6 mécanismes et 4 fiches de vocabulaire |
| 2 | Quoi répondre : 6 lots de 10, contextes écrits avec les situations | Noms de 1 | **30 neuves validées + carnet** : condition d'ouverture de TOUT l'espace |
| 3 | Découpage des 25 étapes (diff mesuré), mes questions (développement) | 2 et modèle de données | Parcours par parcours, Machine à Café d'abord |
| 4 | Jeux et Formules | 2 | Jeux : 10 ; Formules : 4 |
| 5 | Écouter, repérer (lancer tôt) | E4, 0 bis | 4 fiches vérifiées |
| 6 | Quand ça tombe à plat, bilans, séances | 2, 3 | Selon la rubrique |

La production est parallèle (1 et 2 démarrent ensemble), l'**ouverture** est séquencée : rien ne s'ouvre avant que « Quoi répondre » le soit ; les autres entrées apparaissent quand leur seuil est atteint. Mes questions peut ouvrir dès qu'il est développé et que les textes de confidentialité et des CGU sont à jour.

### 7.5 Prérequis non négociables

(a) Carnet : trois vérifications de concordance de 1.4 avant son entrée dans la rafale. (b) Écouter, repérer : INV T5 levé (Rollman, Haroun, Ngijol, Bun Hay Mean) ; chaque passage visionné et minuté par une personne ; chaque citation vérifiée sur la source, page ouverte, par un relecteur indépendant de l'auteur. (c) Mes questions : confidentialité (sa section 9, à ne pas confondre avec la section 9 de ce document) et CGU (art. 10) mises à jour au plus court avant l'ouverture, puisque « rien n'est conservé » devient faux.

### 7.6 Mesure de la valeur du contenu neuf

Lire une fiche ne laisse aucune trace (INV T4). Le « Fait » par fiche le rend visible. Mesure minimale (cibles à poser avec @data-analyst, aucune inventée ici) :

| Axe | Événement | Source |
|---|---|---|
| Adoption | Premier pas fait le jour 1 | « Fait » de la situation d'entrée |
| Engagement | Fiches « Fait » par semaine ; rafales faites ; missions tentées ; envois dans Mes questions | « Fait », état de rafale, retours, messages |
| Rétention | Retour à J7, J30, J60 | Événement serveur d'ouverture |
| Utilité par type | Part des fiches ouvertes dont le geste est fait | « Fait » par type |

Réévaluation d'un type à 60 jours [HYPOTHÈSE de seuil, à fixer par @data-analyst].

---

## 8. Questions pour Thomas (C1 à C9)

Numérotation propre à ce document (« C » pour contenu), sans collision avec Q1 à Q12 du brief. Chaque question a 3 options et une reco, sans jargon. Une option qui rouvre une décision déjà prise est marquée « rouvre la décision du JJ/MM ». Tranchés sans question (défauts évidents) : gradation « la sûre / la joueuse / la risquée », humoristes récents nommés, rien d'ouvert aux visiteurs, noms de techniques seulement dans « Vocabulaire et techniques », questions et réponses de « Mes questions » gardées en base (décision de Thomas du 12/11, `founder-preferences.md` l. 164 et 165).

**C1. Quelle barre en haut de l'espace ?** (à voir en rendu sombre)
- A. Aujourd'hui, Parcours, Quoi répondre, Catalogue, Mes questions, Plus. Le vocabulaire est dans « Plus », en première ligne.
- B. Aujourd'hui, Parcours, Quoi répondre, Vocabulaire et techniques, Mes questions, Plus. Le catalogue (vannes, conseils, vidéos) passe dans « Plus ».
- C. Parcours, Quoi répondre, Vocabulaire et techniques, Catalogue, Mes questions, Plus, avec « Mon espace » en tête qui mène à « Aujourd'hui ». Tout ce que tu as nommé est visible. **Reco**, à condition que le lien « Mon espace » ne compte pas comme une 7e entrée ; sinon A.
Dans les trois cas, « Mon profil » reste dans le menu de ton compte.

**C2. Combien de temps par semaine promet-on ?** Une étape demande aujourd'hui environ 22 à 25 minutes (deux vidéos de 5 à 8 minutes) pour « 15 à 20 min/semaine » annoncé. S'y ajoute, si tu le veux, la rafale de 3 à 5 minutes par jour (C3).
- A. On garde la promesse : le cœur de chaque étape tient dans 15 à 20 minutes, la 2e vidéo et les nouvelles fiches passent en « pour aller plus loin », facultatives. Aucun texte n'est réécrit, mais le statut de vidéos que tu as choisies (étalons du 07/10, vidéos de Boulot regardées le 11/10) change, et la phrase « Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz » serait retouchée. **Reco.**
- B. On change la promesse affichée (par exemple « 20 à 30 min/semaine ») : rouvre la décision du 29/09 (« 15 à 20 min/semaine selon le parcours ») que la décision du 07/10 a reprise sans changement ; chaque texte qui la porte demande ton go.
- C. On ne touche à rien : la promesse reste, les 2 vidéos restent obligatoires, les nouvelles fiches vivent seulement dans leurs rubriques. L'écart avec la promesse reste.

**C3. Veux-tu un entraînement quotidien ?** Une situation nouvelle par jour (3 cartes au plus, 3 à 5 minutes), tu tentes d'abord ta réponse (10 secondes, à voix haute ou dans ta tête, rien de stocké), puis tu vois les trois répliques ; celles qu'on rate reviennent 2 puis 7 jours plus tard ; des missions pour tenter dans la vraie vie. Rien n'est envoyé, tout se passe quand l'abonné ouvre l'espace. À J30 la rafale continue : le carnet mensuel (30 fiches) et environ 10 situations neuves par mois suffisent pour 1 par jour. C'est un vrai chantier de développement (4 tables) en plus du contenu.
- A. Oui, complet : le site retient un résultat de choix par situation et le retour de chaque mission (trois valeurs fermées déjà utilisées, aucun texte libre). Aucune décision rouverte. **Reco.**
- B. Oui, sans mémoire : une situation tirée au hasard, pas de révision, rien n'est retenu.
- C. Non : des fiches et des parcours, pas d'entraînement quotidien.

**C4. La série, les points et « Fait » ?** Aujourd'hui la série compte les jours où l'abonné valide une étape ou termine un quiz d'étape ; les points viennent des étapes et du bonus de fin. « Fait » par fiche, déclaré par l'abonné quand il a fait le geste, est le défaut proposé (c'est la Q5 du brief, pas encore posée).
- A. Aucune nouvelle règle : la rafale et les fiches ne comptent ni pour la série ni pour les points ; un repère neutre (« 12 situations cette semaine ») montre l'habitude. On mesure 30 jours avant d'y revenir. **Reco.**
- B. Une rafale terminée compte comme une pratique pour la série, jamais pour les points : précise la décision du 07/10 (« série comptée sur la pratique ») ou la rouvre selon ta lecture, car elle cite l'étape validée et le quiz d'étape. C'est la lecture la plus naturelle de cette décision.
- C. B, plus des points pour chaque fiche faite : nouvelle règle de points (ton accord est requis) et même réserve sur le 07/10.

**C5. Les situations des lettres du jeudi ?** Le 25/10 tu as dit que la lettre doit apporter ce que le site ne donne pas.
- A. Jamais reprises : le site a ses situations, les lettres gardent les leurs. **Reco.**
- B. Une situation de lettre entre dans « Quoi répondre » 3 mois après son envoi, retravaillée : rouvre la décision du 25/10.
- C. Les lettres déjà reçues restent consultables telles quelles dans « Plus », sans copie dans « Quoi répondre » : rouvre la décision du 25/10 sur le principe.

**C6. Quels univers pour les situations ?** Déjà validés par toi : soirée, boulot, amis, famille, couple, dating, caisse, voisin (carnet), couple (Black Friday), un premier rendez-vous (lettre W50). Yanis vit « en soirées, en coloc et avec ses potes ».
- A. Tous les univers du quotidien, soirées, rencontres et couple compris. Rupture et deuil : jamais comme sujet de vanne. Rencard et couple sont [HYPOTHÈSE : plausibles pour Marc et Yanis, non écrits dans les personas], mais déjà dans des contenus que tu as validés. **Reco.**
- B. Comme le widget : sans soirées, rencontres ni couple. Plus prudent, mais retire les soirées, terrain écrit de Yanis, et plusieurs fiches du carnet déjà validées.
- C. A, plus la rupture traitée avec légèreté sur le fait de recommencer à parler, jamais sur la personne : Marc s'y retrouverait, le risque de blesser est réel.

**C7. Niveaux et entrée de Yanis ?** Dans les données, les niveaux sont DEBUTANT et INTERMEDIAIRE (Machine à Café et Boulot DEBUTANT ; Répartie, Confiance, Storytelling INTERMEDIAIRE). Yanis n'a pas d'entrée débutante sur son sujet.
- A. Un ordre conseillé « Tes 4 premières semaines » en tête de « Parcours », les niveaux actuels, des fiches « pour aller plus loin » sans nom de niveau. **Reco.**
- B. A, plus un niveau « avancé » créé : ajoute une valeur au code et aux libellés, accord requis.
- C. A, plus un sixième parcours débutant pour Yanis : rouvre les textes validés qui disent « les 5 parcours » (offre, e-mails approuvés) et prolonge la roadmap du 07/10.

**C8. Jusqu'où itérer chaque contenu avant qu'il te soit montré ?** Le 12/11 tu as demandé d'itérer « chaque étape jusqu'à 10 », relecture à l'aveugle, 10/10 chez tous les relecteurs. Pour 180 répliques drôles, les goûts divergent : en s19, six réécritures sans convergence (choix 7 de Boulot) t'ont été remontées.
- A. 10/10 chez tous, sans plafond de tours, pour tout contenu de l'espace : lecture littérale du 12/11 ; remplace pour l'espace « 2 avis sur 3 suffisent » (rouvre la décision du 08/10) et la barre 9/10 des lettres du 25/10 pour ces contenus. Risque : des boucles sur des désaccords de goût.
- B. 10/10 chez tous pour les 5 étalons et le premier lot de chaque type ; ensuite « 2 avis sur 3 au niveau » (règle du 08/10, faute objective toujours corrigée) pour la suite de la production : touche ta décision du 12/11 pour la production en série.
- C. 10/10 chez tous, avec une sortie : après 4 tours sans convergence [HYPOTHÈSE de seuil], on te soumet les deux versions et les verdicts, comme en s19, et la réplique la plus faible peut sortir (situation à 2 répliques) : touche ta décision du 12/11 (plafond de tours). **Reco** : elle garde ton 10/10 et reprend la pratique que tu as déjà validée en s19.

**C9. Combien de temps garde-t-on « Mes questions » ?** Tu as décidé le 12/11 de tout garder en base, avec l'historique visible. Reste la durée. Les textes de confidentialité (sa section 9, à ne pas confondre avec la section 9 de ce document) et des CGU (art. 10), qui disent aujourd'hui que la question n'est pas conservée, seront mis à jour au plus court.
- A. Tant que le compte existe, supprimé avec le compte. **Reco** : c'est ton espace, et l'historique reste complet.
- B. 6 mois après le dernier échange, comme les e-mails de questions (25/10) : l'historique ancien disparaît, ce qui contredit en partie « accès à leur historique ».
- C. 24 mois après le dernier échange [HYPOTHÈSE de durée] : compromis, l'historique ancien disparaît quand même.

---

## 9. Étalons à calibrer avec Thomas en premier (5)

Chaque étalon est relu à 10/10 chez tous les relecteurs à l'aveugle avant de t'être montré (décision du 12/11), puis Thomas choisit entre 2 versions. Les noms de rubriques, de registres et de l'onglet « Mes questions » sont présentés en même temps, en rendu sombre.

| # | Étalon | Ce qu'il fixe |
|---|---|---|
| E1 | Une situation « Quoi répondre » complète (3 répliques, règle, erreur, geste, 2 contextes de rafale), à partir du candidat de 3.3 ou d'un meilleur | La voix de l'espace, le niveau des 60 situations, la part de contextes gagnés par la risquée |
| E2 | Une fiche « Comment c'est construit » (le faux secret) et une fiche « Formules à détourner » | L'absence de ton scolaire, la grille de retour, le niveau des détournements |
| E3 | Une fiche de Vocabulaire (5 mots) | Le niveau de jargon assumé, le lien avec le glossaire public |
| E4 | Une fiche « Écouter, repérer » sur un humoriste récent choisi par Thomas | Le choix des humoristes, le degré de découpage, la vérification |
| E5 | Une carte de rafale avec « Ta réponse d'abord » (durée du compte à rebours), un jeu, une mission avec son retour, une question de bilan, et l'écran « Mes questions » (3 types, historique) | Le chrono, l'interaction (choisir, écrire, dire, tenter), le ton de « Ce qu'on aurait pu dire », le libellé de l'onglet |

---

## Annexe A. Traitement de chaque correction

Sigles : UX2 = `tour-2-ux.md`, RE2 = `tour-2-reviewer.md`, EL2 = `tour-2-elon.md`. T1 : corrections du tour 1 restées partielles ou mal traitées, citées par les relecteurs du tour 2. « Appliqué » renvoie à la section de ce document ; les refus sont expliqués.

### A.1 Nouvelles corrections du tour 2

| Correction | Traitement |
|---|---|
| UX2 N1, RE2 N1, EL2 N1 stock de la rafale | Appliqué : 2.3 (1 nouvelle par jour, carnet dans la rafale, 2 contextes, tableau J30, J60, J90, flux, stock minimal à l'ouverture) ; C3 annonce ce qui se passe à J30 |
| EL2 N2 « Ta réponse d'abord », chrono | Appliqué : 2.2, C3, E5 (durée à caler, désactivable) |
| UX2 N2, RE2 N6, EL2 N6 « Vocabulaire » ne dit pas ce qu'il contient | Appliqué : l'onglet s'appelle « Vocabulaire et techniques » ou le contenu est en « Plus » (C1) ; test de 3 secondes à faire sur rendu |
| UX2 N3, RE2 N16, EL2 N3 chemins contradictoires, séance à 3 endroits | Appliqué : 4.1 seule source, 4.3 et 5.4 en dérivent, séance en semaine 3, une seule règle de « jour 7 » |
| UX2 N3 portes manquantes, « une porte unique » contredit | Appliqué : 6.1 (règle de porte réécrite : une porte principale, des raccourcis, « Fait » unique), 6.3 (Rattrapage, bilan, séances, Mes questions ajoutés) |
| UX2 N4 versions avancées sans volume | Appliqué : 3.2 (colonne palier : 15 situations, 3 constructions, 11 écoutes, 5 séances en P3), 7.3 |
| UX2 N5 Aujourd'hui | Appliqué : 4.4 (4 états, contenu du jour conservé, ligne de flottaison) |
| UX2 N7, EL2 N7 coût du moteur | Appliqué : 7.3 (contextes, rattrapages, bilans, mapping, étiquetage) et chantier à 4 tables ; C3 dit la portée réelle |
| UX2 N8, RE2 N2 règle « 10/10 unanime » et « 4 tours » | Appliqué : plus aucune règle posée, question C8 avec la décision du 12/11 citée et options marquées (08/10, 25/10, 12/11) |
| UX2 N9, RE2 N14, EL2 N14 corps d'INV | Appliqué en partie : INV réaligné par @product-manager sur sa section 6 (12/11) ; deux lignes (Carnet, T3) restent à mettre à jour avec les preuves de 1.4, à lui de le faire |
| UX2 N10, RE2 N10 chiffres et sources de rendement | Appliqué : section 1.3 (sources ligne par ligne, « 10 places sur 19 après 5 tours » de `founder-preferences.md` l. 86 ; carnet : 15 sur 180 relu à l'aveugle), « 22 lettres » remplacé par « lettres au format A », « 9 types » corrigé |
| RE2 N10 carnet non validé | Appliqué sur preuve : 1.4 (départages et verdicts cités, concordance vérifiée sur 2 fiches, 3 vérifications restantes) |
| UX2 N11, EL2 N9 « Fait », C3 temps, C7 | Appliqué : C4 intègre « Fait » (défaut déclaratif, Q5 du brief) ; C3 annonce le temps ajouté ; C6 ne mêle plus les précautions. Appliqué en partie : EL2 N9 recommande B pour la série, je garde A en reco (aucune règle nouvelle) et marque B « précise ou rouvre le 07/10 » |
| UX2 N12, RE2 N13 exemples | Appliqué : une situation complète à 3 registres (3.3), un rattrapage (3.8), second exemple du faux secret non circulaire (3.4), photocopieuse à la place de l'odeur de poisson (3.9), fusion faux secret et aveu minuscule (3.4) ; Formules et Vocabulaire restent en structure seule, détournements non présentés |
| UX2 N13 « Plus » fourre-tout, état de la barre | Appliqué : 6.2 (deux blocs, contenu de « Lettre » défini, état à l'ouverture) |
| UX2 N14 boucle d'habitude | Appliqué : repère neutre « 12 situations cette semaine », « Ton mois » absent tant que rien n'est fait (4.4, C4) |
| UX2 N15, RE2 N9 charge de « Montre-la à l'équipe » | Appliqué : 2.6 (estimation de volume, message d'attente honnête, seuil d'alerte, raccourcis limités à 4 points d'entrée, aucune limite affichée) |
| UX2 N16, RE2 N17 Guides retirés sans le dire | Appliqué en partie : dit en 3.1 (les 120 conseils tiennent ce rôle, 3 principes sont des rattrapages). Refusé : rétablir un type « Guide » : doublon avec les conseils existants ; Thomas peut en demander plus tard |
| UX2 N17 premier pas modifie la règle du brief | Appliqué : 4.2 le dit, à confirmer avec Q10 du brief et @data-analyst |
| RE2 N2 règle d'arrêt à 4 tours | Appliqué : C8 option C (la seule où le seuil apparaît, marquée) |
| RE2 N3, EL2 N8 arithmétique des totaux | Appliqué : 5.3 (25 + 12 + 13 + 5 = 55 neuves en parcours, 98 hors parcours, 185 emplacements, 283 fiches distinctes) |
| RE2 N4 échantillon de 10 sur un lot de 10 | Appliqué : 7.2 (3 sur 10, 54 fiches sur 153 plus 12 passages visionnés) |
| RE2 N5 grille qui condamne la risquée | Appliqué : 2.4 (« si elle vise quelqu'un, peut-il en rire avec toi ? ») |
| RE2 N7 « Lettre » sans contenu | Appliqué : 6.2 (inscription et date de la prochaine lettre, rien d'autre) |
| RE2 N8 C2 A touche des vidéos validées | Appliqué : C2 A et 5.2 marquent le statut des vidéos et la phrase de format |
| RE2 N11 extrait visiteur, conversion | Appliqué : 5.5 (angle mort signalé, renvoi à @growth et @copywriter, textes de `/abonnement` approuvés) |
| RE2 N12 « 12 = un par étape » | Appliqué : justification remplacée (1 par mois sur un an), marquée [HYPOTHÈSE] |
| RE2 N13 doublons faux secret, callback, escalade | Appliqué : 3.4 (une notion, une fiche) et 3.5 (Vocabulaire renvoie, exemple sans fiche maîtresse) |
| RE2 N15 fiche d'introduction de parcours | Appliqué : fiche 0 par parcours (5), assemblée du seed validé, aucun texte neuf (5.2, 5.3) |
| RE2 N18 définitions du glossaire recopiées | Appliqué : 3.5 (ligne neuve qui renvoie, un seul glossaire) |
| RE2 N19 ordre d'ouverture | Appliqué : 7.4 (production parallèle, ouverture séquencée, « Quoi répondre » condition de tout) |
| EL2 N4 fait de persona inventé (rencard) | Appliqué : 1.2 et C6 (sources : persona écrit et contenus validés, rencard marqué [HYPOTHÈSE]) |
| EL2 N5 lignes persona génériques et annexe A inexacte | Appliqué : une scène précise par persona dans 3.3 à 3.11 ; l'annexe A de la v2 est corrigée par la présente |
| EL2 N10 sens de « la sûre » | Appliqué : 2.2 (définitions tirées des lettres W46, W48, W50 lues ; la sortie polie du carnet n'est pas « la sûre ») |
| EL2 N11 la risquée doit parfois gagner | Appliqué : 2.2 (quart des contextes) et exemples de 3.3 |
| EL2 N12 missions provocables | Appliqué : 2.4 |
| EL2 N13 détails | Appliqué : lignes citées pour DEBUTANT et INTERMEDIAIRE (1.1), « 10 sur 19 » avec sa source, C2 B réécrite, « lettres au format A », filtre renommé « Où et avec qui ? » |

### A.2 Corrections du tour 1 restées partielles ou mal traitées

| Correction | Traitement |
|---|---|
| UX1 découpage (T1) | Corrigé : 5.2 avec fiche 0, durées et statut du cœur |
| UX3 échelle, avancé (T1) | Corrigé : paliers chiffrés (3.2), calendrier (4.1) |
| UX4 faits (T1) | 264 décryptages pour 149 vannes actives : hypothèse de décryptages de vannes retirées, non vérifiée en base ; à vérifier [À VÉRIFIER] |
| UX5 contradictions (T1) | Corrigé : un seul découpage, un seul calendrier, bilan = fin de parcours |
| UX6 rubriques (T1) | Corrigé : 6 (une porte principale par contenu) |
| UX8 exemples (T1) | Corrigé : voir A.1 UX2 N12 |
| UX9 faisabilité (T1) | Corrigé : 7.3, 7.5 |
| UX15 navigation mobile (T1) | Refus valable maintenu : le dessin du panneau « Plus » et du budget d'en-tête reste à @ux et @design (tour design) |
| RE9 production non chiffrée (T1) | Corrigé : 7.2 (échantillon réel), 7.3 |
| RE12 ouverture contre barre (T1) | Corrigé : 7.4 |
| RE18 réconciliation (T1) | Corrigé : 5.3 |
| RE21 corps d'INV (T1) | Voir UX2 N9 : réaligné par @product-manager, deux lignes à finir |
| RE manque n°1 fiche d'introduction (T1) | Corrigé : fiche 0 |
| EL1 moteur (T1) | Corrigé : chrono, stock, contextes |
| EL14 chiffres (T1) | Corrigé : 1.1 à 1.4 |
| EL16 rendement (T1) | Corrigé : rattrapages et bilans comptés (7.3) |
| EL18 lignes persona (T1) | Corrigé : voir EL2 N5 |
| EL4 lettres (T1) | Maintenu : jamais reprises, C5 |
| EL8, EL9, EL13 refus valables (T1) | Maintenus et précisés : « Vocabulaire » reste le mot de Thomas, l'onglet dit « Vocabulaire et techniques » ; pas de répartition chiffrée par niveau, mais un volume par palier (3.2) |

### A.3 Ajouts de Thomas du 12/11

| Ajout | Traitement |
|---|---|
| Onglet « Mes questions » (problème, situation à gérer, question) | Appliqué : 2.6, barre (6.2), chemin (2.4, 3.8, 4.1), portes (6.3), accès (5.5), capacité (7.3), prérequis (7.5), étalon E5 |
| « Gardons tout en base », historique visible | Appliqué comme décision : 2.6, C9 réduite à la durée de conservation, mise à jour de la confidentialité (sa section 9, à ne pas confondre avec la section 9 de ce document) et des CGU (art. 10) au plus court |

## Annexe B. Ce qui reste inconnu

- Les 3 vérifications de concordance du carnet (1.4) et la mise à jour de INV (ligne Carnet, T3) par @product-manager.
- Explication des 264 décryptages pour 149 vannes actives.
- Découpage exact des 4 autres parcours ; nombre de défis par conseil et par vidéo.
- Rendement réel des répliques en situation : mesuré au lot 1 (7.3).
- Nombre exact de lettres au format A.
- Valeur de Q10 du brief (cas 3 du premier pas) et Q5 du brief (« Fait »).
- Cible de la mesure d'usage : avec @data-analyst.
- Ancre de l'e-mail J12 approuvé qui pointe vers l'encadré du profil.

## Annexe C. Agents spécialisés recommandés (angle mort vérifiable seulement)

| Agent | Type | Rôle | Justification | Priorité |
|---|---|---|---|---|
| Testeur-persona (Yanis, Sophie, Marc) | testeur | Lire 3 fiches de chaque type, jouer la rafale et « Mes questions », dire ce qui sonne cours ou pèse | Le risque n°1 (ton scolaire, pression du chrono) ne se voit pas à l'écriture | Haute |
| Relecteur humoriste à l'aveugle | expert domaine | Noter répliques, détournements, sorties sur la barre Alexa | 180 répliques, 24 sorties, 60 détournements | Haute |
| Vérificateur de citations | expert domaine | Source, minute, exactitude (prérequis 7.5) | Règle anti-invention, humoristes récents | Haute |

Handoff vers @agent-factory si Thomas valide le périmètre.
