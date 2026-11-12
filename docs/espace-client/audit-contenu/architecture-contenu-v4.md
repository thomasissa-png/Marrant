# Architecture de contenu de l'espace Premium, v4 (s24)

> REMPLACÉ par `architecture-contenu-v5.md` le 12/11/2026 après le tour 4 de relecture (UX 8,0, Reviewer 8,1, Elon 8,7). Ne plus s'y référer pour l'entrée par le quiz, la barre, le temps, la carte de rafale, « Mes questions » ni C10.

> Auteur : @creative-strategy, 12/11/2026. Remplace `architecture-contenu-v3.md`. Réponse aux tours 3 de relecture : @ux 7,3, @reviewer 8,3, @elon 8,6 (`iterations/tour-3-*.md`) et aux arbitrages de la session. Chaque correction est tracée en annexe A (tour 3, puis restes partiels des tours 1 et 2).
> Faits : `inventaire-cartographie-s24.md` (INV), corps réaligné sur sa section 6 ; sa ligne T3 (carnet) a été corrigée par la session le 12/11 après le tour 3 (« partiellement levé ») et la section 1.4 ci-dessous s'aligne dessus. La ligne « Carnet » du tableau 1.1 d'INV reste à vérifier par @product-manager.
> Sources relues pour ce tour : les 3 rapports du tour 3, `departage-2026-10.md`, `verdict-v4-r2.md`, `verdict-v5-r1/r2/r3.md`, `2026-11.json` (fiche 2026-11-25), `founder-preferences.md` (l. 85, 135, 136, 154, 161 à 165), INV (T3), `lib/progression.ts`, `config/premium.ts`.
> Conventions : [HYPOTHÈSE] = dimensionnement ou choix de travail. [À VÉRIFIER] = fait non lu. [EXEMPLE NON VALIDÉ] = illustration non relue à l'aveugle. Toute règle nouvelle (série, points, texte libre, stockage, relecture) est une question à Thomas en section 8, jamais une décision. Les noms de rubriques et de formats sont des propositions de travail, à caler par étalons rendus (P0 s8).
> Règles tenues : tutoiement, aucun tiret cadratin, aucun émoji, aucune mention d'IA, aucun concurrent nommé, rien de culpabilisant, aucune relance d'inactivité, aucun nouvel e-mail automatique.

## 0. Ce qui change depuis la v3 (12 lignes)

1. **Barre** : trois variantes qui comptent réellement 6 entrées, « Aujourd'hui » toujours présent, recommandation ferme (6.2). Plus aucune « condition ». « Mon profil » reste dans le menu de compte.
2. **Mes questions : un seul circuit** (2.6). La réponse de l'équipe est saisie dans l'outil, enregistrée dans l'historique, puis part par l'e-mail de réponse habituel (ce n'est pas un nouvel e-mail automatique). Trois types définis en une phrase, états limites écrits, textes validés à retoucher listés. Les points restants tiennent en UNE question, C10.
3. **Personas** : le produit ne connaît que les 5 profils du quiz et le lien de retour (`returnTo`). Les entrées de 4.3 se déclenchent par ces signaux ; les personas sont des cas d'essai (4.3).
4. **Régime mensuel** (7.3 bis) : candidates, relectures et lecture de Thomas pour les 30 fiches de carnet par mois, les situations neuves et la rafale ; règle si un carnet est en retard.
5. **Progrès réel** (2.2, 4.4) : « Tu avais une réponse ? » en 3 valeurs fermées après « Ta réponse d'abord » ; une courbe dans « Ton mois ». Mesure d'affichage, ni série ni points.
6. **La rafale et les missions montent selon la réussite** (2.2, 2.4), pas selon le calendrier. Ordre de tirage, compte à rebours qui ne se raccourcit que si l'abonné le veut, révision à J+2, J+7, J+21.
7. **Carnet** (1.4) : relecture d'octobre décrite exactement (2 critiques et l'orchestrateur ; 10 répliques sur 15 avec un seul critique indépendant) ; fiche H10 corrigée en ligne mais jamais relue. La question C8 pose la portée de la règle du 12/11 sur ce carnet.
8. **C8** (relecture) : l'appui sur s19 est supprimé (c'était une exception limitée au PS de Boulot, `founder-preferences.md` l. 85).
9. **Exemples** : une fiche Formules, une entrée de Vocabulaire et deux questions de Bilan écrites en phrases réelles ; les exemples sous la barre de la v3 sont remplacés ou corrigés (3.3, 3.4, 3.6, 3.8, 3.9).
10. **Temps hebdomadaire total** par semaine dans le calendrier (4.1).
11. **Cartes du carnet** (2.2, 2.3) : annoncées comme cartes « Drôle ou poli ? », distinctes des cartes « Quel registre ? » ; la question C3 propose d'écrire les carnets suivants à 3 registres.
12. **Langage des questions** réécrit sans jargon ; références juridiques en note pour @legal.

---

## 1. Faits de base (sources)

### 1.1 Chiffres de production et de code

| Fait | Valeur | Source |
|---|---|---|
| Vannes, conseils, vidéos actifs en production | 149, 120, 89 | INV section 6 (`/api/content-stats`, 12/11) |
| Parcours et étapes | 5 parcours, 25 étapes (3, 4, 6, 6, 6) | `config/premium.ts` |
| Rythme annoncé | Machine à Café 15, Répartie 20, Confiance 20, Storytelling 20, Boulot 15 min/semaine | `config/premium.ts`, choix du 29/09 |
| Niveaux de difficulté | DEBUTANT : Machine à Café (`parcours-seed.json` l. 8), Boulot (`parcours-boulot-s19.json` l. 307) ; INTERMEDIAIRE : Répartie, Confiance, Storytelling (`parcours-storytelling-s18.json` l. 94) | lus et vérifiés par @elon et @reviewer |
| Persona de Machine à Café dans le seed | « Sophie (26 ans, jeune active) » | `parcours-seed.json` l. 12 |
| Étape 1 de Machine à Café | scène (`moduleDetail`, qui contient « Imagine Léa »), pourquoi, 1 conseil avec exemple et défi, 5 vannes, 2 vidéos (Paul Séré, Karim Duval), quiz de 4 questions, 50 XP, gratuite | `parcours-seed.json` |
| Durée réelle d'une étape | environ 22 à 25 min [HYPOTHÈSE de lecture : 200 mots/minute, vidéos de 5 à 8 min] | INV 3.1 |
| XP, niveaux, série (code) | XP d'étape (`moduleXp`, 20 par défaut), bonus de fin 100, seuils 0/100/500/1 500/5 000, série comptée sur la pratique (étape validée, quiz d'étape terminé), rythme doux de 7 jours ; la date conseillée n'existe qu'après une première validation (`nextRecommendedAt`) | `lib/progression.ts` |
| `progression-levels.md` | OBSOLÈTE (gains absents du code) | lu le 12/11 |
| Retour d'exercice existant | 3 valeurs fermées `pas-essaye`, `essaye-bof`, `essaye-ca-a-marche` | `lib/progression.ts` l. 114, choix du 07/10 |
| Glossaire public | 12 termes (définitions de 40 à 60 mots) | INV section 6 et 1.1 |
| Carnet | 15 fiches (octobre) + 30 (novembre). Les identifiants du JSON ne suivent pas les codes de relecture : la fiche H10 est `2026-11-25`, H03 est `2026-11-03`, H29 est `2026-11-10` | INV section 6, `2026-11.json` |
| Lettres | 6 du mois + 16 réservées, approuvées par Thomas. Les réservées alternent le format A (situation, la sûre, la joueuse, la risquée, comment choisir, erreur, exercice : W46, W48, W50 lues) et un format B par mois (décryptage : W47 Bref, W51 Palmashow). Nombre de lettres au format A : à compter [À VÉRIFIER] | `hebdo-premium.json`, choix du 25/10 |
| Univers déjà validés par Thomas | soirée, boulot, amis, famille, couple, dating, caisse, voisin (octobre) ; couple (Black Friday) en novembre ; un premier rendez-vous (lettre W50) ; un exposé de TD (W46) | `departage-2026-10.md`, `departage-r2.md`, `hebdo-premium.json` |
| Questions à l'équipe | réponse en général sous 1 à 2 jours ouvrés, jamais 7 jours (CGU : au plus tard 3 jours ouvrés, on prévient en cas de retard) ; réponse « préparée en session, relue et envoyée par l'équipe », signée « L'Équipe Deviens Marrant » ; limites techniques par abonné 3 par 10 minutes et 10 par jour, aucune limite affichée ; « stop au juridique excessif, pas de nouveaux avis » | `founder-preferences.md` l. 135 et 136 (25/10) |
| Conservation de réponses déjà décidée | 24 mois pour les réponses à la question de résiliation (`RESILIATION_CONSERVATION_MOIS`) ; 6 mois après le dernier échange pour les e-mails de questions | l. 154 (07/11), l. 135 (25/10) |

### 1.2 Les personas, d'après `project-context.md`

Les personas sont des cas d'essai pour écrire et tester les contenus ; **le produit ne les connaît pas**. Ses seuls signaux sont les 5 profils du quiz d'humour et le lien de retour (4.3).

- **Yanis**, 20 ans, étudiant introverti : veut s'affirmer « en soirées, en coloc et avec ses potes » ; frustration : rester muet quand tout le monde se chambre.
- **Sophie**, 26 ans, jeune active : manque de conversation à la machine à café, veut des anecdotes à ressortir « en afterwork, dîners entre amis » ; frustration : pas de situations professionnelles.
- **Marc**, 34 ans, récemment séparé : veut renouer avec l'humour et la légèreté, retrouver confiance dans ses interactions ; cherche des parcours structurés et une progression mesurable.

Rencard, drague et couple n'apparaissent dans aucun persona écrit ; ils sont dans des contenus déjà validés par Thomas (tableau 1.1) : c'est l'argument sourcé de la question C6.

### 1.3 Rendement de la barre « niveau Alexa » (faits, avec source)

| Fait | Source |
|---|---|
| 30 vannes au niveau sur 333 (30/09) | `founder-preferences.md` l. 37 |
| 2 vannes au niveau sur 360 au pilote des réseaux (06/10) | l. 65 |
| Boulot : 10 places validées sur 19 après 5 tours ; tour 6 pour les 11 places restantes | l. 86 (11/10) |
| Carnet d'octobre : 180 candidates ; 18 (critique A) et 14 (critique B) jugées « = » au niveau ; 15 répliques retenues, soit environ 8 % des candidates | `critique-A.md`, `critique-B.md`, `departage-2026-10.md` |

Pour des répliques en situation, la fourchette de rendement est de 1 sur 2 (Boulot) à 1 sur 12 (carnet d'octobre) [HYPOTHÈSE d'extrapolation].

### 1.4 État de la relecture à l'aveugle du carnet (T3 d'INV, partiellement levé)

- **Octobre** : 180 candidates relues par deux critiques à l'aveugle (A et B). Le départage est de l'**orchestrateur** (« Départage orchestrateur (2 avis sur 3) », `departage-2026-10.md` l. 3), pas d'un troisième relecteur indépendant. Sur les 15 répliques retenues, **5 sont jugées au niveau par les deux critiques** (n° 56, 131, 108, 121 et V2-12) et **10 par un seul critique indépendant** plus l'orchestrateur (S1, S2, S4, S5, S6, S9, S10, S11, S13, S15). Format et 15 fiches validés par Thomas le 03/10 (« je valide tout go »). Les champs autres que la réplique (pourquoi, sortie polie, exercice) : relecture non établie [À VÉRIFIER].
- **Novembre** : relecture à l'aveugle en plusieurs passes (`aveugle-*`, `critique-A-moitie*`, `departage-r1` à `r3`, `verdicts-fiches/`). Verdict v4, passe 2 : 27 fiches à 10 sur 10, 3 à 9 (H03, H09, H10) (`verdict-v4-r2.md`). Confirmation v5 sur les 6 fiches retouchées : relecteurs 2 et 3 à 10 sur 10 ; relecteur 1 à 10 sauf H10 à 9 (« aux points arrachée au dernier round » inexact). Conclusion du relecteur 2 : 30 fiches sur 30 publiables.
- **Fiche H10 (`2026-11-25`, « Le rayon des retardataires »)** : le texte en ligne contient la correction proposée par le relecteur 1 (« à la décision des juges », l. 303). Cette version corrigée **n'a été relue à l'aveugle par personne** (les verdicts v5 portent sur l'ancienne formule). Règle d'or P0 s18 : un tour de relecture à l'aveugle avant son entrée dans la rafale.
- **Concordance vérifiée** sur 3 fiches : `2026-11-03` = H03 v5, `2026-11-10` = H29 v5, `2026-11-25` = H10 avec la correction.
- **À faire avant que le carnet entre dans la rafale** : (a) un tour de relecture de H10 ; (b) le diff complet entre `2026-11.json` et la dernière version relue ; (c) la relecture d'octobre et de ses champs non relus, selon la règle choisie en C8.
- **Portée de la règle du 12/11** : ce document ne la tranche pas pour le carnet. C'est un point de la question C8.

---

## 2. La leçon, le moteur d'entraînement et « Mes questions »

### 2.1 Définition

**Une leçon est une fiche d'environ 5 minutes qui apprend une chose et se termine par un geste** : choisir, écrire, dire à voix haute, ou tenter dans la vraie vie. Toute fiche a un geste, même celles reprises du catalogue (les 5 vannes d'une étape : « choisis celle que tu ressortiras cette semaine »). « Fait » se coche quand le geste est fait, déclaré par l'abonné, sans preuve : défaut proposé, à confirmer avec Q5 du brief (autres options : « Fait » seulement à la validation actuelle, défi ou quiz ; « Fait » à la lecture complète). L'état « Fait » est unique par fiche, quelle que soit la porte d'arrivée.

Deux étages : **les fiches** expliquent et font essayer (sections 3 à 5) ; **le moteur** fait répéter, revoir et sortir de l'écran (2.2 à 2.5). Un troisième lieu, **Mes questions** (2.6), prend le relais quand l'abonné bute sur sa propre situation.

### 2.2 La rafale du jour, carte par carte

Dans « Aujourd'hui », jusqu'à 3 cartes par jour (3 à 5 minutes [HYPOTHÈSE]) : 1 situation nouvelle plus jusqu'à 2 cartes à revoir. Il existe **deux sortes de cartes** :
- **« Quel registre ? »** : situation neuve à trois répliques (la sûre, la joueuse, la risquée), deux contextes par situation.
- **« Drôle ou poli ? »** : fiche du carnet, qui a deux répliques (sa réponse, et sa sortie polie « si c'est tendu »). Le contexte est une ambiance, avec deux étiquettes fixes : « ambiance détendue » (la réponse) et « ambiance tendue » (la sortie polie). Aucun texte neuf par fiche, aucun texte du carnet modifié.

Une carte se déroule ainsi :
1. **La scène et le contexte** s'affichent.
2. **« Ta réponse d'abord »** : l'abonné tente SA réplique, à voix haute ou dans sa tête (« dans ta tête, ça compte aussi », comme dans l'app, décision du 04/11). Un compte à rebours de 10 secondes [HYPOTHÈSE, à caler à l'étalon E5] est **désactivé la première fois, activable ensuite**, et un bouton « Voir les répliques » est toujours disponible : un minuteur ne bloque jamais l'accès. Aucun jugement, rien de ce texte n'est enregistré.
3. **« Tu avais une réponse ? »** : trois boutons fermés, « Rien », « Oui, à peu près celle-là », « Oui, une autre ». Un seul toucher, aucun texte libre. « Rien » met la carte à revoir.
4. **Les répliques** apparaissent ; l'abonné choisit celle qui convient au contexte.
5. **La règle** s'affiche, en une phrase.

**Ce que le moteur retient** (avec le résultat du choix) : la réponse à « Tu avais une réponse ? ». C'est la mesure de la compétence : combien de cartes où l'abonné avait déjà une réponse, semaine après semaine. Elle est affichée sous forme de courbe dans « Ton mois » (4.4). C'est une mesure d'affichage : elle ne compte ni pour la série ni pour les points (sauf si Thomas le choisit, option C de C4).

**Ordre de tirage et progression** :
- La situation nouvelle du jour suit un ordre : les 5 situations d'entrée d'abord (P1), puis les situations P2, puis les P3 (supérieur, inconnu, groupe) **seulement après la semaine 4 ou après 20 cartes où l'abonné avait une réponse** [HYPOTHÈSE de seuil, à caler à l'étalon E5]. Les contextes où la risquée gagne arrivent surtout dans les P3.
- Le compte à rebours ne raccourcit **jamais de lui-même** : après une semaine où l'abonné avait une réponse sur 7 cartes ou plus de 10, l'espace propose « 7 secondes ? », puis « 5 secondes ? ». Il peut refuser sans conséquence.
- **Révision** : une carte ratée (mauvais choix) revient à J+2, J+7 puis J+21 ; une carte où l'abonné a répondu « Rien » revient à J+2 ; une partie des cartes réussies revient à J+30 [HYPOTHÈSE]. Maximum 3 cartes par jour. À défaut de carte à revoir, la place est prise par un autre contexte d'une situation déjà vue.

**Règles d'écriture des contextes** (situations neuves) : une seule bonne réponse défendable par contexte ; chaque situation porte 2 contextes ; sur l'ensemble des situations neuves, environ la moitié des bonnes réponses sont des joueuses, un quart des sûres, un quart des risquées [HYPOTHÈSE, à fixer à l'étalon E1]. La répartition ne vaut que pour les cartes « Quel registre ? » : les cartes du carnet n'ont pas de risquée. Part des cartes du carnet : 60 % à l'ouverture (45 situations sur 75) et environ 75 % avec le flux mensuel (30 contre 10 par mois) ; la question C3 propose d'écrire les carnets suivants à trois registres pour que l'entraînement ne reste pas surtout un choix « drôle ou poli ».

**Les trois registres, en une ligne chacun** (tirés des lettres au format A) :
- **La sûre** : ne vise personne, se ferme toute seule, la conversation reprend sans que l'autre ait à répondre. À choisir quand tu ne connais pas encore l'humour du groupe.
- **La joueuse** : prend la pique au mot et la retourne vers toi ou vers une règle, sans viser quelqu'un. À sortir quand le groupe a déjà ri ensemble.
- **La risquée** : s'adresse à l'autre ou lui rend la parole, elle appelle une réponse et peut sonner comme une provocation si le ton n'est pas complice.

La sûre est donc une vraie réplique légère. Dans le carnet, la réponse correspond à la joueuse et la « sortie polie » est une quatrième chose : elle garde son nom et ne s'appelle pas « la sûre ».

### 2.3 Le stock de la rafale, calculé

**Consommation** : une situation NOUVELLE par jour au plus (le bouton « encore une » sert une carte à revoir ou un autre contexte, jamais une nouvelle). Un abonné qui vient 7 jours sur 7 consomme 30 situations nouvelles par mois.

| Source | À l'ouverture (seuil 7.4) | V1 complète |
|---|---|---|
| Carnet d'octobre et de novembre, cartes « Drôle ou poli ? » (2 ambiances fixes) | 45 | 45 |
| Situations neuves à 3 répliques, 2 contextes chacune, cartes « Quel registre ? » | 30 | 60 |
| **Situations nouvelles disponibles** | **75** | **105** |
| Cartes (situation x contexte) | 45 x 2 + 30 x 2 = 150 | 45 x 2 + 60 x 2 = 210 |

| Jour d'un abonné quotidien | Nouvelles consommées | Stock à l'ouverture (75) | Stock V1 complète (105) |
|---|---|---|---|
| J30 | 30 | tient | tient |
| J60 (après le premier renouvellement, J25 à J30) | 60 | tient, marge de 15 | tient, marge de 45 |
| J90 | 90 | le carnet de décembre (+30, déjà prévu) porte le stock à 105 | tient |

**Flux** : 30 fiches de carnet par mois (déjà prévu) plus environ 10 situations neuves par mois [HYPOTHÈSE, à mesurer au lot 1] : 40 contre 30 consommées par un abonné quotidien. Le régime mensuel est chiffré en 7.3 bis.

**Si le carnet d'un mois est en retard** : la rafale passe à une situation nouvelle **un jour sur deux** (les autres jours, cartes à revoir ou autre contexte) plutôt que de répéter. L'alerte de stock se déclenche à 30 jours de la fin pour un abonné régulier (même logique que `/api/health` pour les vannes, décision du 18/10).

**Prérequis** : le carnet n'entre dans la rafale qu'après les vérifications de 1.4.

### 2.4 Les missions, le retour et la grille

**Missions en 5 marches** : 1 seul, à voix haute ; 2 à un proche, par message ; 3 à un pote, en face ; 4 dans un petit groupe ; 5 avec quelqu'un qu'on connaît peu. Toujours facultatives, jamais comptées contre l'abonné. **Critère d'écriture : provocable cette semaine** (on lance la phrase, on n'attend pas qu'un vendeur surgisse) ; sinon la mission est reformulée. Les défis déjà écrits (conseils, vidéos) sont étiquetés par marche dans une table de correspondance séparée : aucun champ des seeds n'est modifié, diff à zéro mot (P0 s11).

**Retour d'une mission** : « Pas essayé », « Essayé, bof », « Essayé, ça a marché » (les 3 valeurs fermées déjà utilisées pour les exercices).

**La marche suivante dépend du retour, pas de la date** :
- « Essayé, ça a marché » : l'espace propose la marche d'au-dessus.
- « Essayé, bof » : même marche, avec une autre situation, la fiche « Quand ça tombe à plat » et un lien vers **Mes questions** (type « Situation à gérer » : « Raconte-nous ce qui s'est passé »).
- « Pas essayé » deux fois de suite : l'espace propose la marche d'en dessous, sans commentaire.
Le calendrier de 4.1 indique la **marche visée**, pas la marche imposée. Un introverti n'est jamais poussé en face parce que c'est mardi.

**Grille d'auto-contrôle de la réplique écrite** (après Comment c'est construit, Formules, jeux d'écriture) : 3 questions oui ou non, rien d'enregistré. (1) Elle tient en une phrase ? (2) Si elle vise quelqu'un, peut-il en rire avec toi ? (3) La fin surprend ?

### 2.5 Ce que le moteur ne fait pas

Aucune relance d'inactivité, aucun e-mail, aucune notification qui culpabilise, aucun classement, aucune note qui sanctionne. La révision n'apparaît que si l'abonné ouvre l'espace.

### 2.6 Mes questions : l'onglet de l'abonné pour l'équipe

**Décisions de Thomas, 12/11** (`founder-preferences.md` l. 164 et 165) : « Qu'il y ait aussi un onglet avec mes questions aussi pour leur espace question. Problème situation à gérer question etc. » puis « Gardons tout en base oui. Vu que c'est leur espace. Ils doivent avoir accès à leur historique ». Elles rouvrent, avec son accord écrit, « rien en base » (25/10) et, pour cette fonction, « aucun texte libre stocké » (07/10, avis @legal C13).

**Ce que c'est** : un onglet (nom de travail « Mes questions », alternative : « Écrire à l'équipe », libellé déjà validé). L'abonné choisit un type en un geste, écrit, envoie, et retrouve **Mes envois** : ses messages, leur statut et les réponses de l'équipe. Il absorbe l'encadré « Ta question à l'équipe » du profil : l'encadré devient une ligne de lien vers l'onglet, tant que l'espace n'est pas ouvert l'encadré reste tel qu'aujourd'hui.

**Les trois types, en une phrase chacun**
- **Un problème** : quelque chose ne marche pas ou ne se passe pas comme prévu sur le site (accès, paiement, affichage). L'équipe répond en priorité.
- **Une situation à gérer** : une scène que tu vas vivre ou que tu viens de vivre, et pour laquelle tu veux des idées de réponse. La réponse propose des répliques, préparée en session et au niveau de la barre Alexa.
- **Une question** : tout le reste (comprendre une technique, un contenu, l'offre).
Sous le champ : « Évite les noms : décris la scène. » Les trois types ont le même délai.

**Un seul circuit de réponse** : la réponse de l'équipe est **saisie dans l'outil de l'admin**, **enregistrée** dans l'historique de l'abonné, puis part par **l'e-mail de réponse habituel** (la réponse que l'abonné attend déjà aujourd'hui, signée « L'Équipe Deviens Marrant », Reply-To du compte : ce n'est pas un nouvel e-mail automatique). Aucune réponse n'est envoyée par e-mail seul : toute réponse faite hors de l'outil y est recopiée, avec la question. L'e-mail de J12 approuvé (« pose-nous ta question ») invite à répondre à cet e-mail : ces échanges sont recopiés dans l'outil de la même façon. Dans l'espace, « Aujourd'hui » affiche « L'équipe t'a répondu » tant que la réponse n'a pas été ouverte ; aucune pastille sur les onglets (règle du brief §2.6 : pastilles par la cloche seulement, si elle existe).

**Règles du 25/10 conservées** : réponse en général sous 1 à 2 jours ouvrés (jamais 7 jours), **préparée en session, relue et envoyée par l'équipe**, signée « L'Équipe Deviens Marrant », aucune mention d'IA, aucune limite affichée, questions vers alex@deviens-marrant.fr.

**États limites**

| État | Ce que voit l'abonné | Règle |
|---|---|---|
| Aucun envoi | Un exemple de message par type et la phrase sur le délai | jamais un tableau vide |
| Envoi en cours | « Envoi en cours » | le message n'est pas perdu en cas d'échec : il reste dans le champ |
| Envoyé | « Envoyé, l'équipe répond en général sous 1 à 2 jours ouvrés » | |
| Répondu | La réponse, datée ; « L'équipe t'a répondu » dans « Aujourd'hui » | |
| En retard | Après 3 jours ouvrés (délai maximal des CGU) : « L'équipe n'a pas encore répondu, ta demande est bien là » | alerte interne à l'équipe ; on prévient en cas de retard (25/10) |
| Retiré par l'abonné | L'envoi disparaît de son historique | suppression définitive de l'échange (question et réponse) : à confirmer, C10 |
| Abonnement terminé | Historique gardé et lisible, ou accès fermé : à confirmer, C10 | |
| Message sensible | Réponse à la main, en priorité | un message qui évoque une détresse suit la conduite du playbook (orientation vers le 3114) [À VÉRIFIER dans `docs/marrant/playbook.md`] ; ce n'est jamais un contenu de l'espace |

**Où l'abonné y arrive** (porte unique : l'onglet ; raccourcis) : après « Essayé, bof » ; en bas d'une fiche « Quand ça tombe à plat » (« Ta situation n'est pas dans la liste ? Raconte-la à l'équipe ») ; en fin de séance et de « Comment c'est construit » (« Montre ta réplique à l'équipe », texte préchargé côté navigateur, jamais dans l'adresse) ; depuis « Quoi répondre » quand aucun filtre ne donne de situation. Pas après chaque jeu.

**Ouverture** : « Mes questions » suit la règle commune (7.4) et s'ouvre avec l'espace, pas avant. L'encadré du profil reste en service jusqu'à là.

**Textes validés à retoucher** (chaque retouche repasse par Thomas) [À VÉRIFIER : liste exacte au lot 0] : l'encadré « Ta question à l'équipe » du profil ; `question-equipe-s22.ts` ; la page de confidentialité (sa section 9 et sa partie 4) et les conditions d'utilisation (art. 10), qui disent que la question n'est pas conservée ; l'e-mail J12 approuvé (E1b) et son ancre ; les textes qui disent « depuis ton profil » seulement s'ils parlent de cet encadré. Mise à jour au plus court (« rien de faux », règle du 19/10, `founder-preferences.md` l. 165). Avis juridique : le 25/10 Thomas a dit « pas de nouveaux avis » (l. 136) ; le brief §3.5 en demande un court pour tout texte libre stocké : question C10.

**Charge de l'équipe (fondateur solo)** [HYPOTHÈSE : de 0 à 1 message par mois et par abonné actif ; aucune mesure, 4 abonnés au 02/11] : à 100 abonnés actifs, environ 100 messages par mois, soit environ 5 par jour ouvré ; **à l'objectif de 6 mois (environ 503 abonnés, brief §1), environ 25 par jour ouvré**. Garde-fous : message d'attente honnête à l'envoi, seuil d'alerte interne [HYPOTHÈSE : plus de 10 messages en attente], limites techniques existantes. **Leviers prévus** : des réponses types tirées des réponses déjà envoyées (toujours relues avant envoi) ; les « Situations à gérer » qui reviennent deviennent des fiches de « Quoi répondre » (jamais reprises telles quelles : anonymisées et avec l'accord de l'abonné, comme pour la lettre, décision du 17/10), ce qui fait baisser le volume.

### 2.7 Anatomie commune d'une fiche

1. Titre qui dit la situation ou le mécanisme (jamais un titre de cours). 2. Accroche d'une phrase. 3. Exemple d'abord, règle ensuite. 4. Une seule erreur courante, dite sans jugement. 5. Le geste, avec sa marche de mission quand il y en a une. 6. « Ce qu'on aurait pu dire » : une version qui marche, jamais « corrigé ». 7. Deux liens vers le catalogue. 8. Durée affichée, statut « Voir » / « Fait ».

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
| Corrigé | « Ce qu'on aurait pu dire » (une version qui marche) | Corrigé |
| Test de section | « Le bilan du parcours » (mot déjà dans l'offre, sans certificat) ; le quiz d'étape garde son nom | Test de section |
| Atelier | « Séance de 20 minutes » | Atelier |
| Écrire à l'équipe | « Mes questions » (à caler) | encadré « Ta question à l'équipe » |

**Guides** : Thomas a mis « Guides » en tête de sa capture. Nous ne créons pas un type de plus : les 120 conseils actifs (timing, autodérision, observation, répartie, storytelling) tiennent ce rôle et chaque fiche neuve les relie ; trois principes sont des fiches « Quand ça tombe à plat ». Thomas peut demander des guides neufs quand il veut (note reprise en tête de la section 8).

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

Les 4 pièces du moteur ne comptent pas de fiches : elles réutilisent le type 1. Le parcours Boulot (DEBUTANT) n'est pas « plus loin » : c'est le parcours suivant de Sophie.

### 3.3 Quoi répondre (le cœur)

- **Définition** : une scène de la vie courante, trois répliques, la règle pour choisir, l'erreur courante, le geste. Même squelette que le format A des lettres, **jamais le même texte** (décision du 25/10).
- **Carnet et situations, une seule porte** : le carnet est le flux mensuel de cette rubrique (« Nouvelles ce mois-ci » en tête, archive par mois). Une fiche du carnet est une situation à 2 répliques (sa réponse = la joueuse, sa sortie polie), reprise sans modification, signalée « 2 répliques » ; une situation neuve a 3 répliques. `/carnet` garde son URL.
- **Filtres** : « Où et avec qui ? » (coloc, soirée, boulot, amis, famille, couple, rencontre, commerces, transports, voisins ; les catégories des fiches validées plus « coloc » et « transports », à remplir par les 60 neuves) et « Pour quoi faire ? » (désamorcer, répondre à un chambrage, relancer une conversation, rattraper un faux pas). Chemin d'entrée : « Les 5 situations pour commencer » (4.2).
- **Persona (cas d'essai)** : Yanis, au dîner de coloc du dimanche, quand un colocataire sort une poêle de l'évier devant les autres ; Sophie, à la machine à café, face à « ça va ? » ; Marc, chez un ami, quand on lui demande « alors, quoi de neuf ? » [HYPOTHÈSE de scène].
- **Exemple complet, trois registres [EXEMPLE NON VALIDÉ, candidat d'étalon E1, à passer à l'aveugle avant tout usage]** :
  - Scène : dimanche, 19 h, coloc. Ton colocataire sort la poêle de l'évier, la tient au bout des doigts devant les deux autres : « Quelqu'un connaît le propriétaire de cette poêle ? Elle est là depuis jeudi. »
  - La sûre : « Elle est à moi. Je la laissais refroidir, c'est tout. »
  - La joueuse : « Je ne voulais pas la déraciner : elle s'est bien intégrée. »
  - La risquée : « Elle est à moi. Dis-moi plutôt à qui sont les trois verres qui vivent dans ta chambre. »
  - Pour choisir : après des semaines de remarques sur le ménage, la sûre reconnaît sans t'excuser trois fois. Si les colocs rient déjà de ces dimanches, la joueuse. La risquée seulement si ton colocataire vit lui aussi dans le désordre : sinon elle sonne comme un reproche.
  - Erreur courante : nier d'abord (« ce n'est pas la mienne »), puis t'excuser plusieurs fois. La réplique arrive pendant que tu rangeais déjà.
  - Deux contextes de rafale : (1) « Les colocs rient déjà de ces dimanches » : la joueuse. (2) « Ton colocataire vient lui-même de laisser sa vaisselle trois jours » : la risquée.
  - À toi, marche 1 : tiens une poêle ou un autre objet à bout de bras et dis la sûre à voix haute, sans sourire. Marche 2 : envoie à un proche un message qui avoue, sur le ton de la sûre, une petite négligence de ta semaine. Marche 3 : au prochain petit désordre que tu as toi-même laissé, dis la joueuse en face.
  - Retour : « Pas essayé », « Essayé, bof », « Essayé, ça a marché ».
- **Exemple de carte « Drôle ou poli ? », tiré du carnet (`2026-11-03`)** : « Mardi à la boulangerie, la boulangère emballe ton troisième pain au chocolat de la semaine : "Vous n'aviez pas arrêté le sucre, vous ?" » Ambiance détendue : « Dans toutes les autres boulangeries, je suis irréprochable. » Ambiance tendue : « Vous avez bonne mémoire. J'essaie de réduire, et cette semaine, ce n'est pas une réussite. »
- **Widget** : le seuil de 90 du 24/10 est celui de « La réplique du jour » du widget, pas celui de l'espace ; le widget garde son stock tout public ; la fiche complète reste Premium.

### 3.4 Comment c'est construit

- **Définition** : un mécanisme de vanne démonté en deux temps (installer, casser) puis refait par l'abonné.
- **Persona** : Yanis cherche, avant le repas de coloc, comment lancer un aveu minuscule sur lui sans que ça sonne comme une excuse ; Sophie veut un gabarit de dix secondes pour la machine à café ; Marc, quand un ami lui demande des nouvelles, veut pouvoir lâcher un aveu léger plutôt que le résumé de sa vie.
- **Format** : 5 minutes, 200 à 250 mots, schéma en une ligne, un exemple, un geste d'écriture, la grille de 2.4.
- **Volume** : 12 mécanismes, une fiche maîtresse par notion (callback, escalade comique, faux secret avec son aveu minuscule, règle de trois, détournement, contraste, litote, fausse logique, détail trop précis, chute qui retourne le début, exagération contrôlée, combinaison de deux mécanismes). Vocabulaire et Formules y renvoient.
- **Noms de techniques** : cités seulement ici et dans Vocabulaire, jamais dans les situations ni les étapes.
- **Exemple [EXEMPLE NON VALIDÉ], source : étape 1 de Machine à Café, quiz validé** :
  - Le mécanisme, le faux secret : « Ça reste entre nous : » puis un aveu minuscule, sur toi, dit avec la gravité d'un scandale.
  - Une version qui marche : « Ça reste entre nous : je dis "je regarde ça" sur tout ce que je ne regarderai jamais. »
  - La règle : un seul aveu, court, sur toi, avec un détail que tout le monde reconnaît.
  - Erreur courante : ajouter « non mais je rigole » juste après.
  - À toi : écris ton faux secret en trois essais, puis passe la grille.
  - **Une version qui ne marche pas, et pourquoi** (tirée du même quiz) : « Ça reste entre nous : le nouveau stagiaire dit "pas de souci" à tout, même à ce qu'il ne comprend pas. » Elle échoue à la question 2 de la grille : le stagiaire n'est pas là, il ne peut pas en rire avec toi.

### 3.5 Vocabulaire

- **Définition** : le jargon utile pour parler d'humour, un mot par entrée. Les 12 termes du glossaire public sont la base ; la rubrique ajoute 28 mots, soit 40.
- **Format** : une fiche = 5 mots d'un thème, 5 minutes. Chaque entrée : une ligne neuve qui dit le mot en clair, un exemple en deux temps, « à ne pas confondre avec », un lien vers la définition complète (glossaire pour les 12, fiche maîtresse de construction sinon). Les définitions du glossaire ne sont pas recopiées.
- **Règle** : un mot qui a une fiche maîtresse dans Comment c'est construit n'est jamais l'exemple de Vocabulaire ; chaque mot a un emploi attesté vérifié ; aucun mot de scène (open mic, plateau, flop).
- **Persona** : Yanis, un samedi chez ses potes, entend « c'est un callback » devant une vidéo et ne sait pas de quoi on parle ; Sophie veut nommer ce qu'elle fait quand elle rebondit sur le mot d'un collègue ; Marc regarde du stand-up avec un ami et veut suivre la conversation.
- **Exemple de fiche, une entrée écrite [EXEMPLE NON VALIDÉ, à aligner sur la définition du glossaire, non relue ici]** : « Accusé de réception. Le petit signe, un sourire ou un "ah oui", qui dit à l'autre "je t'ai entendu" avant de répondre à sa pique : 2 à 3 secondes suffisent. En deux temps : il te lance « Tu as encore oublié ton badge ? » ; tu hoches la tête, sourire en coin, tu laisses passer deux secondes, puis tu réponds. Ta réponse sonne alors comme un choix et non comme une défense. À ne pas confondre avec : l'excuse ("oui, pardon"), qui répond avant d'avoir écouté. Définition complète : /glossaire. »

### 3.6 Formules à détourner

- **Définition** : une expression que tout le monde connaît, que tu dis en entier, comme si de rien n'était, puis que tu fais dérailler sur un détail de ta vie.
- **Persona** : Sophie en cherche une pour clore sa journée de réunions ; Yanis, pour un message de groupe où il veut se glisser sans risque ; Marc, pour un toast léger à un dîner.
- **Format** : 5 minutes, 5 expressions par fiche : la règle, le piège (dérailler avant d'avoir dit l'expression en entier : personne ne la reconnaît), la limite (la seconde phrase tient en une douzaine de mots), le geste d'écriture, une version possible.
- **Volume** : 12 fiches, 60 détournements [HYPOTHÈSE], chacun passe la barre Alexa.
- **Exemple de fiche, deux détournements écrits [EXEMPLE NON VALIDÉ, candidats d'étalon E2]** :
  - Expression 1 : « À chaque jour suffit sa peine. » Détournement : « À chaque jour suffit sa peine. Le lundi a pris celle de jeudi, pour dépanner. »
  - Expression 2 : « Tout vient à point à qui sait attendre. » Détournement : « Tout vient à point à qui sait attendre. Sauf le bus, qui préfère ceux qui ont couru. »
  - Règle : l'expression en entier d'abord, puis une seule phrase courte qui la contredit sur un détail.
  - Piège : commencer par le détail ; l'expression n'est plus reconnue et la chute n'a rien à retourner.
  - À toi : choisis une expression, écris la phrase qui la fait dérailler sur ta semaine, puis passe la grille. Une version possible : les deux ci-dessus.

### 3.7 Écouter, repérer

- **Définition** : un passage court (1 à 2 minutes) d'un humoriste, démonté puis transposé à la vie de l'abonné (le format B des lettres appliqué aux vidéos du site, avec d'autres passages et d'autres textes ; aucun texte de lettre repris).
- **Persona** : Yanis revoit avec ses potes un passage qui l'a fait rire et veut savoir pourquoi la salle part à cet instant ; Sophie veut reprendre un mécanisme pour le pot de départ d'un collègue ; Marc regarde seul le soir et veut une raison de rire qui lui laisse quelque chose à essayer le lendemain.
- **Format** : le passage (minute et seconde exactes), ce que l'artiste fait (3 observations), pourquoi c'est efficace (une idée), ta version à toi, la grille de 2.4.
- **Volume** : 12 en V1, puis 1 à 2 par mois en session [HYPOTHÈSE : 1 par mois sur un an, rythme déjà tenu pour le format B des lettres ; la vérification est le facteur limitant].
- **Règles** : humoristes récents proches de l'audience (25/10), nommés et cités sans réserve (P0 du 05/10), citation réelle et courte, jamais de citation inventée ; citation douteuse = on vérifie, on ne retire pas. Prérequis en 7.5.
- **Exemple [EXEMPLE NON VALIDÉ, structure seule : un passage ne s'écrit qu'après visionnage et vérification]** : passage candidat : Karim Duval, « Génération Y » (le « pourquoi » du seed : détournement de jargon corporate en humour). Minute : [à relever]. À toi : prends un jargon de ton boulot ou de ta fac, dis-le avec un sérieux total, puis ajoute un détail qui le trahit.

### 3.8 Quand ça tombe à plat

- **Définition** : une fiche courte pour la minute d'après : une réplique qui ne prend pas, un silence, une phrase dirigée contre toi. Même structure que Quoi répondre (3 sorties), retrouvée dans « Quoi répondre » avec le filtre « rattraper un faux pas ».
- **Persona** : Yanis, sa vanne tombe à plat devant les colocs et personne ne dit rien ; Sophie, le silence en réunion après sa phrase ; Marc, au dîner, quelqu'un le reprend sur ce qu'il vient de dire.
- **Volume** : 8 fiches, 24 sorties (comptées en 7.3) : le silence après ta vanne, quand ça ne prend pas, quand tu es la cible, quand tu as dit la mauvaise chose, quand on te corrige en public, quand on te coupe, quand tu oublies la chute, quand tu veux sortir de la conversation.
- **Exemple [EXEMPLE NON VALIDÉ, candidat d'étalon]** : « Ta vanne tombe à plat devant les colocs, trois secondes de silence. La sûre : "Celle-là demandait un deuxième café." La joueuse : "Je la garde pour la version deux." La risquée : "Quelqu'un a un autre avis ? Je prends les notes." Pour choisir : la risquée rend la parole aux autres et attend qu'ils jouent : réservée aux groupes qui te connaissent. » Retour : « Essayé, bof » arrive ici ; « Ta situation n'est pas dans la liste ? Raconte-la à l'équipe » mène à Mes questions.

### 3.9 Jeux

- **Définition** : un défi de 3 à 5 minutes qui fait pratiquer une compétence, avec « ce qu'on aurait pu dire ».
- **Persona** : Yanis, 5 minutes dans le tram avant les cours, sur son téléphone ; Sophie, 5 minutes entre deux réunions ; Marc, un soir chez lui, quand le silence de l'appartement pèse.
- **Familles (30)** : « Quelle réplique ? » (reprend des situations existantes avec un autre contexte, aucune réplique neuve) ; « Finis la phrase » (même mécanique que le défi de l'app, 04/11) ; « Trouve l'angle » ; « Change de registre » ; « Remets la chute » ; « Les pires réponses ».
- **Où ils vivent** : la page « S'entraîner » (jeux, séances, missions), avec une entrée dans le menu « Plus » (6.2) et une carte dans « Aujourd'hui », et un lien « À toi » depuis chaque fiche et chaque étape.
- **Exemple [EXEMPLE NON VALIDÉ] : « Trouve l'angle »** : « Objet : le frigo de la coloc. Note trois choses vraies sur lui, pas des blagues. Ce qu'on aurait pu relever : 1) un pot de moutarde dont personne ne se souvient de l'achat ; 2) une étiquette "ne pas toucher" collée sur quelque chose de périmé ; 3) tout le monde connaît celui qui laisse la porte entrouverte, et personne ne le nomme. L'angle qui travaille le mieux est le troisième : un non-dit que tout le monde partage. La blague vient ensuite, de ce que tu fais de lui. »

### 3.10 Le bilan du parcours

- **Définition** : six questions à la fin d'un parcours : choisir et dire, pas seulement reconnaître.
- **Format** : 4 questions « laquelle de ces répliques convient ? » construites sur des situations déjà validées du parcours avec un contexte (aucune réplique neuve : seul le contexte est à écrire, 20 en tout), 1 « remets dans l'ordre », 1 « dis-la à voix haute » (déclaré). Retour en phrases, pas de note, pas de seuil, pas de certificat (07/10). Une erreur renvoie vers la fiche à revoir : « celle-là mérite un deuxième tour ».
- **Persona** : Sophie, à la fin de Machine à Café, veut savoir si elle placerait sa vanne au bon moment ; Marc veut une mesure concrète de sa progression, sans note ; Yanis la prend à son rythme, sans public.
- **Volume** : 5, un par parcours, comptés comme fiches du parcours.
- **Deux questions écrites [EXEMPLE NON VALIDÉ, sur le modèle du quiz d'étape existant]** :
  - Question « registre » : « Ton colocataire sort la poêle de l'évier devant les autres : "Elle est là depuis jeudi." Les remarques sur le ménage s'accumulent depuis des semaines et l'ambiance est lasse. Laquelle ? A) "Elle est à moi. Je la laissais refroidir, c'est tout." B) "Je ne voulais pas la déraciner : elle s'est bien intégrée." C) "Elle est à moi. Dis-moi plutôt à qui sont les trois verres qui vivent dans ta chambre." » Retour : « A. Quand l'ambiance est lasse, tu reconnais sans t'excuser trois fois. B demande que le groupe rie déjà ; C serait prise pour un reproche. »
  - Question « dans l'ordre » (matière : quiz de Machine à Café, étape 1) : « Remets dans l'ordre : a) tu lâches l'aveu ; b) tu te penches et tu dis "Ça reste entre nous :" ; c) tu t'arrêtes net. » Retour : « b, a, c. Le silence final fait le reste. »

### 3.11 Séance de 20 minutes

- **Définition** : une séance guidée hors écran (seul ou avec un pote). Le coaching en direct n'existe pas chez nous (supprimé le 13/10) : c'est un exercice long, sans écran, que le site ne reçoit pas.
- **Format** : 3 minutes d'échauffement, 5 d'observation, 8 d'essai, 4 de bilan (20 minutes). Rien n'est enregistré.
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

Tout reste ouvert (18/10) : c'est un ordre conseillé, jamais un verrou. Ce tableau est la SEULE source ; 4.2, 4.3 et 5.4 en dérivent. Il est identique pour tous les abonnés ; seuls changent la scène d'entrée et le parcours conseillé (4.2).

| | Semaine 1 | Semaine 2 | Semaine 3 | Semaine 4 |
|---|---|---|---|---|
| Rafale (tous les jours, facultative) | 1 situation nouvelle par jour : les 5 premières sont « Les 5 situations pour commencer » | idem | idem | idem |
| Situations nouvelles vues (au plus) | 7 | 7 | 7 | 7 |
| Premier pas | Jour 1 : la situation d'entrée (5 min, marche 1) | | | |
| Parcours conseillé | aucun (facultatif) | étape 1 | étape 2 (date conseillée 7 jours après la validation de l'étape 1) | étape 3, puis le bilan si le parcours est fini (Machine à Café) |
| Mécanisme | « Le faux secret » (Comment c'est construit) | un mot ou deux de Vocabulaire, au choix | | |
| Séance de 20 minutes | | | la première, facultative | |
| Écouter, repérer | | | | le premier, facultatif |
| Mission, marche visée | 1 | 2 | 3 | 3 |
| Mes questions | à tout moment, jamais demandé | idem | idem | idem |
| **Temps maximum de la semaine** | rafale 35 min + mécanisme 5 min = environ 40 min | rafale 35 + étape 15 à 24 + vocabulaire 5 = jusqu'à 64 min | rafale 35 + étape 15 à 24 + séance 20 = **jusqu'à 79 min** | rafale 35 + étape 15 à 24 + écoute 7 = jusqu'à 66 min |

Tout est facultatif sauf le cœur de l'étape (15 à 20 minutes annoncées : voir C2) ; la rafale est de 3 à 5 minutes par jour, jamais plus. La **marche visée** n'est pas une marche imposée : la marche proposée dépend du retour de l'abonné (2.4). **Palier** : P1 = jour 1 ; P2 (« prendre le pli ») = semaines 1 à 4 ; P3 (« aller plus loin ») = après la semaine 4 : situations avec un supérieur ou un inconnu, écoutes, séances, marches 4 et 5, parcours Storytelling.

**Règle du « jour 7 »** : la date conseillée de l'étape suivante n'existe qu'après une première validation (`nextRecommendedAt`). Pour un abonné sans étape validée, « Aujourd'hui » propose « Commencer l'étape 1 » sans date, jamais « en retard ».

### 4.2 Les signaux qui choisissent l'entrée (le produit ne connaît pas les personas)

Le produit ne connaît que deux signaux : le **profil du quiz d'humour** (5 profils : Observateur, Storyteller, Absurde, Punchlineur, Taquin) et le **lien de retour** (`returnTo`). Tableau signal, entrée (situations d'entrée provisoires [HYPOTHÈSE], à écrire à l'étalon E1) :

| Signal | Situation d'entrée (premier pas) | Parcours conseillé de la semaine 2 |
|---|---|---|
| Lien de retour : l'abonné vient d'une fiche | cette fiche | le parcours de cette fiche, s'il y en a un |
| Quiz passé : Taquin | « Quelqu'un te chambre devant tout le monde en coloc » (la poêle, 3.3) | le parcours désigné par le quiz |
| Quiz passé : Observateur | « Le collègue qui lance "ça va ?" à la machine à café » | idem |
| Quiz passé : Storyteller | « Quelqu'un te demande "alors, quoi de neuf ?" » | Storytelling (07/10) |
| Quiz passé : Absurde | « Le vendeur qui surgit à ton épaule » (inspirée du carnet, `2026-11-01`) | le parcours désigné par le quiz |
| Quiz passé : Punchlineur | « La caisse : "Vous avez la carte du magasin ?" » (inspirée du carnet d'octobre) | idem |
| **Aucun signal** | « Le collègue qui lance "ça va ?" à la machine à café » (situation par défaut) | Machine à Café (DEBUTANT, premier parcours) |

**Les 5 situations d'entrée des 5 profils sont « Les 5 situations pour commencer »** : l'abonné commence par celle de son signal, puis reçoit les quatre autres dans un ordre fixe aux jours 2 à 5. Le parcours désigné par le quiz de chaque profil est déjà dans le code du quiz (`quiz-data.ts`) [À VÉRIFIER : sauf Storyteller vers Storytelling, 07/10]. Sans quiz, « Aujourd'hui » propose Machine à Café par défaut et montre en une ligne les quatre autres parcours à la semaine 2 : l'abonné choisit, jamais « choisis un parcours » au jour 1 (cause H2 de l'analyse des résiliations).

La règle du brief §3.2 (n°2 : « la première étape du parcours désigné par le quiz ») est modifiée : le premier pas est une situation d'entrée (5 minutes), l'étape 1 du parcours désigné devient la première étape conseillée (semaine 2). L'événement « aha » du brief (étape validée ou exercice ouvert) devient « Fait » déclaré de la situation d'entrée : à confirmer avec @data-analyst et avec la réponse à Q10 du brief. Le premier pas est le même sur la page de succès et dans « Aujourd'hui ».

### 4.3 Les personas, cas d'essai (pas des chemins du produit)

Les personas servent à écrire et à tester ; ils ne déclenchent rien. Tableau d'essai (profil du quiz le plus proche [HYPOTHÈSE], et parcours que leur besoin écrit appelle) :

| Cas d'essai | Profil proche | Parcours que son besoin écrit appelle | Remarque de test |
|---|---|---|---|
| Yanis (coloc, soirées, potes) | Taquin | Répartie (INTERMEDIAIRE ; étape 1 « Tes premières répliques » à relire pour un débutant [À VÉRIFIER]) | Sans quiz, le produit lui propose Machine à Café : à tester si cela suffit ou si « Tes 4 premières semaines » doit lui montrer Répartie |
| Sophie (machine à café, afterwork) | Observateur | Machine à Café (persona du seed), puis Boulot (DEBUTANT) | Cas nominal |
| Marc (reconstruction) | Storyteller | Confiance (INTERMEDIAIRE) | Vérifie que la progression se lit sans note ni classement |

Aucune relance : si l'abonné n'ouvre pas l'espace, rien ne part. Ce qui l'attend à son retour s'affiche à l'ouverture de « Aujourd'hui ».

### 4.4 Aujourd'hui : règle de priorité

Une seule action principale visible, quatre états (brief §3.2 : maximum 3 actions principales par écran) :
1. **Aucune fiche faite** : le premier pas.
2. **La rafale du jour n'est pas faite** : la rafale du jour.
3. **La rafale est faite** : « Reprendre » l'étape en cours (ou « Commencer l'étape 1 » sans date).
4. **Mission ouverte** : lien secondaire, jamais l'action principale.

**Au-dessus de la ligne de flottaison à 375 px** : (a) salutation et repère neutre « 12 cartes cette semaine » (cartes jouées, révisions comprises ; ni série ni points ; affiché seulement à partir d'une carte, jamais « 0 carte ») ; (b) l'action principale ; (c) le contenu du jour (vanne, conseil, vidéo, calendriers déjà préparés). **Deux éléments distincts** : le contenu du jour est conservé tel quel (brief §3.2, bloc 3) ; la situation nouvelle du jour est la première carte de la rafale, pas un bloc supplémentaire. En dessous : « L'équipe t'a répondu » (si une réponse n'est pas lue), S'entraîner (jeux, séances, missions), nouveautés (carnet du mois, date conseillée, lettre du jeudi), « Ton mois ».

**« Ton mois »** (à partir de J25 environ, absent tant que rien n'est fait) : situations jouées, étapes validées, missions tentées, et **la courbe de la répartie** : la part des cartes où l'abonné avait déjà une réponse, semaine après semaine [HYPOTHÈSE d'illustration : de 2 cartes sur 10 la semaine 1 à 6 sur 10 la semaine 8]. C'est la preuve de progrès de la compétence, pas seulement de l'activité ; elle ne compte ni pour la série ni pour les points. Le détail visuel revient à @design.

### 4.5 Au-delà de la V1 : qui ajoute quoi

Règle du 25/10 déjà en place pour les lettres : un mois ajouté chaque mois, en session, jamais par tâche planifiée ni génération automatique. Chiffrage en 7.3 bis.

| Rythme | Quoi | Qui |
|---|---|---|
| Mensuel | Carnet du mois (30 fiches) ; environ 10 situations neuves ; 1 à 2 « Écouter, repérer » ; un point sur les types de « Situation à gérer » reçus (anonymisés, avec accord) | @copywriter en session avec Thomas, même contrôle que les lettres |
| Trimestriel | 4 à 5 jeux neufs ; réévaluation des types peu utilisés (7.6) | @creative-strategy, @data-analyst |
| Alerte | Stock de situations non vues à 30 jours de la fin pour un abonné régulier | @fullstack |

---

## 5. Parcours : découpage sans rien perdre, temps, niveaux

### 5.1 Principe

On garde les 5 parcours, leurs 25 étapes et leurs textes. Chaque étape devient un sous-parcours de fiches numérotées « Voir / Fait ». Aucun texte validé n'est réécrit (P0 s18, étalons s17 à s19). Les ancres `#etape-N` restent (les lettres approuvées y pointent), les fiches s'ajoutent en `#fiche-N-M`. Mesure du diff réel à chaque parcours (P0 s11). Compléments de Storytelling (second défi, phrase de protection) et de Boulot (« Version sans risque », « Aller au défi ») : conservés (INV T8).

### 5.2 Exemple complet : Machine à Café, étape 1

Blocs existants (`parcours-seed.json`) : scène, pourquoi, conseil « L'humour à la machine à café » avec exemple et défi, 5 vannes, 2 vidéos (Paul Séré « Les relations amoureuses », Karim Duval « Génération Y »), quiz de 4 questions, 50 XP, gratuite. Durées : estimations INV 3.1 [HYPOTHÈSE].

| N° | Fiche | Origine | Geste | Durée | Cœur ou plus loin |
|---|---|---|---|---|---|
| 0 | Introduction du parcours (une seule pour les 3 étapes) | Assemblée depuis le seed : description, durée, rythme, accroche persona (textes validés, inchangés) ; **sans la scène « Imagine Léa »**, qui reste dans 1.1 | Choisir ton point de départ | 2 min | Cœur |
| 1.1 | Le conseil et son défi (scène « Imagine Léa » fondue en introduction) | Existant, inchangé | Le défi du conseil | 4 min | Cœur |
| 1.2 | Les 5 vannes | Existantes, inchangées | Choisir celle que tu ressortiras cette semaine | 2 min | Cœur |
| 1.3 | Écouter : des vannes enchaînées | Vidéo 1, Paul Séré | Repérer l'amorce et la chute | 7 min | Cœur |
| 1.4 | Écouter : détourner le jargon | Vidéo 2, Karim Duval | Repérer le mot détourné | 7 min | Plus loin (C2) |
| 1.5 | Le quiz de l'étape | Existant, inchangé | Répondre | 2 min | Cœur |
| 1.6 | Une situation liée : le collègue qui lance « ça va ? » | NEUVE, une des 60 de « Quoi répondre » | Choisir, dire (marche 1) | 5 min | Plus loin |
| 1.7 | Le faux secret, comment c'est construit | NEUVE, une des 12 constructions | Écrire ton faux secret | 5 min | Plus loin |

- **Rien n'est perdu** : conseil, défi, 5 vannes, 2 vidéos, quiz, scène et « pourquoi » sont tous là, mot pour mot.
- **Total de l'étape** : 7 fiches numérotées, plus la fiche 0 commune. **Cœur de l'étape 1** : 15 minutes sans la fiche 0, **17 minutes avec**, si la vidéo 2 passe en « plus loin » (la fiche 0 ne se lit qu'une fois) ; environ 24 minutes sinon. La promesse affichée de Machine à Café est de 15 min/semaine : le cœur de l'étape 1 la tient à 15 minutes hors introduction et la dépasse de 2 minutes la première fois.
- **Le « Fait » de l'étape** (XP, série) reste celui d'aujourd'hui : défi du conseil et quiz.
- **C2 A touche le statut de vidéos choisies par Thomas** (étalons du 07/10, vidéos de Boulot regardées le 11/10) et la phrase « Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. ».
- **Les 4 autres parcours** : même découpage, à relire étape par étape avant écriture [À VÉRIFIER].

### 5.3 Totaux exacts (fiches distinctes et emplacements)

Chaque étape reçoit deux fiches neuves : une situation (25 étapes, 25 situations distinctes sur 60) et, selon l'étape, soit son mécanisme (12 étapes, une construction chacune) soit un jeu (13 étapes, 13 jeux distincts sur 30). Chaque parcours reçoit une fiche 0 (assemblée du seed, aucun texte neuf) et un bilan (neuf).

| | Fiches distinctes | Emplacements dans les parcours | Réemplois |
|---|---|---|---|
| Fiches existantes reconditionnées | 5 par étape = 125 | 125 | 0 |
| Fiches 0 d'introduction | 5 | 5 | 0 |
| Situations neuves | 60 | 25 | 0 (35 hors parcours) |
| Comment c'est construit | 12 | 12 | 0 |
| Jeux | 30 | 13 | 0 (17 hors parcours) |
| Bilans du parcours | 5 | 5 | 0 |
| Vocabulaire, Formules, Écouter, Quand ça tombe à plat, Séances | 8 + 12 + 12 + 8 + 6 = 46 | 0 | 0 |
| **Total** | **125 + 5 + 153 = 283** | **125 + 5 + 25 + 12 + 13 + 5 = 185** | 0 |

Fiches neuves : 153, dont 55 dans les parcours (25 + 12 + 13 + 5) et 98 hors parcours (35 + 17 + 46). Emplacements par parcours : Machine à Café 23, Répartie 30, Confiance, Storytelling et Boulot 44 chacun, soit 185.

### 5.4 Ordre conseillé « Tes 4 premières semaines »

En tête de « Parcours », le calendrier de 4.1 en quatre lignes, sans nouveau parcours ni niveau (le « Parcours Débutant » de la capture). Un 6e parcours Répartie pour Yanis est à la roadmap depuis le 07/10 : le prolonger est l'option C de la question C7.

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

**6 entrées au plus, comptées à l'écran** (12/11, Q3 = A) : tout lien visible dans la barre est une entrée, « Plus » compris. « Aujourd'hui » (écran du premier pas, de la rafale et de « Ton mois ») est toujours un onglet. « Mon espace » (Q2 = A) nomme la zone. La barre s'affiche aussi sur les pages publiques pour l'abonné (Q11 = A). **« Mon profil » reste dans le menu de compte, hors des 6**, et mène aux réglages (`/profil`). Libellés en texte ; aucune rubrique vide à l'ouverture ; aucun doublon. **Règle de porte** : chaque contenu a UNE porte principale ; les liens depuis un parcours, une fiche ou « Aujourd'hui » sont des raccourcis vers la même fiche, dont l'état « Fait » est unique. `header-budget.spec.ts` fige les onglets : à mettre à jour avec le libellé validé (@ux, @design).

### 6.2 Trois variantes à 6 entrées, UNE question (C1)

Thomas veut « Vocabulaire » et « Mes questions » dans l'espace. Aucun onglet ne porte le nom d'un contenu qu'il ne contient pas.

| | A | B (recommandée) | C |
|---|---|---|---|
| Barre | Aujourd'hui, Parcours, Quoi répondre, Vocabulaire et techniques, Mes questions, Plus | Aujourd'hui, Parcours, Quoi répondre, Bibliothèque, Mes questions, Plus | Aujourd'hui, Parcours, Quoi répondre, Catalogue, Mes questions, Plus |
| Catalogue (vannes, conseils, vidéos, écouter-repérer) | Première ligne de « Plus » (2 clics) | Onglet « Bibliothèque », bloc « Vannes, conseils, vidéos » | Onglet visible |
| Vocabulaire, Comment c'est construit, Formules | Onglet visible, trois portes nommées au premier écran | Onglet « Bibliothèque », bloc « Vocabulaire et techniques » : deux blocs nommés au premier écran, sans défiler | Première ligne de « Plus » (2 clics) |
| Pour | « Vocabulaire » (mot de Thomas) est sur la barre | Le catalogue payé reste à 1 clic ET le vocabulaire aussi ; sur `/vannes` l'onglet actif est « Bibliothèque » | Le catalogue payé reste à 1 clic |
| Contre | Le catalogue est repoussé à 2 clics ; sur `/vannes` l'onglet actif serait « Plus » | Un nom générique : il tient par ses deux blocs nommés | Le mot de Thomas n'est pas sur la barre |

**Reco : B.** Elle garde tout ce que Thomas a nommé (vocabulaire, questions, parcours, catalogue) visible en un clic, avec « Aujourd'hui » en onglet. Test des 3 secondes sur rendu sombre (« où irais-tu pour apprendre à construire une vanne ? »), par @ux et @design.

**Contenu de « Plus »** (dans les trois variantes, trois blocs) : « S'entraîner » (jeux, séances, missions ; la page est aussi une carte de « Aujourd'hui » et un lien « À toi » depuis les fiches) ; « Mon contenu » : Favoris et notes ; « Le reste » : Lettre (ton inscription du jeudi et la date de la prochaine lettre, rien d'autre), Articles, Quiz d'humour. « Écrire à l'équipe » n'y est plus : c'est « Mes questions ».

**État de la barre à l'ouverture** : seules les entrées dont le seuil de 7.4 est atteint apparaissent ; « Aujourd'hui », « Parcours » et « Quoi répondre » ouvrent avec l'espace. « Mes questions » ouvre avec l'espace.

### 6.3 Porte principale de chaque page ou type (variante B)

| Contenu | Porte | Remarque |
|---|---|---|
| Aujourd'hui (rafale, premier pas, cartes) | Aujourd'hui | |
| Parcours, étapes, fiche 0, bilan du parcours | Parcours | Le bilan est la dernière fiche du parcours |
| Quoi répondre, carnet (`/carnet`) | Quoi répondre | URL conservées |
| Quand ça tombe à plat | Quoi répondre (filtre « rattraper un faux pas ») | Lien depuis « Essayé, bof » |
| Vocabulaire, Comment c'est construit, Formules | Bibliothèque, bloc « Vocabulaire et techniques » | Un seul glossaire : `/glossaire` public est la vitrine |
| Vannes, conseils, vidéos, Écouter repérer | Bibliothèque, bloc « Vannes, conseils, vidéos » | |
| Jeux, séances, missions | « Plus », ligne « S'entraîner » | Carte dans « Aujourd'hui », lien « À toi » depuis les fiches |
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
| Apprendre, lire et écouter | Bibliothèque (vidéos) et Écouter, repérer |
| Exercices et jeux | Jeux (page S'entraîner) |
| Favoris, Mes notes | Plus |
| Ateliers | Séance de 20 minutes ; pas de coaching en direct (13/10) |
| Écrire au coach | Mes questions |
| Test de fin de section | Le bilan du parcours |
| (demande de Thomas, hors capture) | Quoi répondre |

---

## 7. Production

### 7.1 Règle de relecture : la question C8

La décision de Thomas du 12/11 est « chaque étape itérée jusqu'à 10 », relecture à l'aveugle, « jusqu'à 10/10 chez tous les relecteurs » (`founder-preferences.md` l. 163). Elle ne dit pas comment l'appliquer à 180 répliques drôles, ni ce qu'elle implique pour les contenus existants repris dans l'espace (carnet). Ce document ne pose donc AUCUNE règle de relecture : la question C8 la pose. En attendant la réponse : les 5 étalons sont relus à 10/10 chez tous les relecteurs, et le garde-fou du 08/10 reste vrai (une faute objective est corrigée quel que soit le vote). Barre « niveau Alexa » pour toute vanne ou réplique : chute surprenante, courte, logique, observation vraie, jamais entendue ailleurs ; pas de réplique plutôt qu'une réplique moyenne ; rien sous la barre n'entre en ligne (P0 s18).

### 7.2 Pipeline et lecture de Thomas

1. Étalon validé par Thomas, par type (section 9), avant tout brief @copywriter.
2. Écriture par lots de @copywriter : 3 candidates par emplacement de réplique [HYPOTHÈSE].
3. Contrôle de vérité (citations, minutes, définitions, sources) avant relecture.
4. Relecture à l'aveugle (règle C8), puis Stand-Up Director sur les répliques.
5. Mesure du diff réel pour tout contenu existant reconditionné (P0 s11).
6. **Lecture de Thomas** : les 5 étalons en entier, puis 3 fiches sur 10 par lot, et le visionnage de chaque passage choisi pour « Écouter, repérer ». Sauf avis contraire de Thomas ; il peut demander à tout lire.

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

### 7.3 Capacité par type (V1)

Rendement de la section 1.3 : de 1 sur 2 à 1 sur 12. Base : 3 candidates par emplacement ; pire cas : 12.

| Type | Emplacements à tenir | Candidates (base, pire cas) | Barre humour | Palier |
|---|---|---|---|---|
| Quoi répondre, 3 répliques | 60 x 3 = 180 répliques | 540, 2 160 | Oui | P1, P2, P3 |
| Contextes de la rafale (2 par situation neuve) | 120 contextes, une seule bonne réponse défendable ; les désaccords se règlent en reformulant le contexte | 240 | Jugement | P2 |
| Cartes du carnet « Drôle ou poli ? » | 45 cartes, 2 ambiances fixes, 0 texte neuf par fiche | 0 | Non | P2 |
| Quand ça tombe à plat | 8 x 3 = 24 sorties | 72, 288 | Oui | P2 |
| Formules à détourner | 60 détournements | 180, 720 | Oui | P2 |
| Jeux d'écriture (Finis la phrase, Remets la chute) | environ 20 chutes | 60, 240 | Oui | P2 |
| Bilans | 0 réplique neuve ; 20 contextes | 40 | Jugement | P2 |
| Mapping du quiz vers une situation d'entrée | 5 profils, 5 situations d'entrée | | Jugement | P1 |
| Étiquetage des défis par marche | défis des 120 conseils et 89 vidéos [À VÉRIFIER : nombre réel] ; table séparée | 1 passe plus 1 relecture | Non | P2, P3 |
| Comment c'est construit, Vocabulaire, Écouter, Séances | 38 fiches de texte | 1 version corrigée chacune | Exemples seulement | P2, P3 |
| **Total de candidates à écrire** | | **environ 1 100 (base) à 3 700 (pire cas)** | | |

Règles : (a) **60 est une cible de situations VALIDÉES, pas une coupe** : si le rendement est bas, on écrit plus de candidates, jamais moins de situations ni une barre abaissée. (b) Une situation peut sortir avec 2 répliques bonnes sur 3. (c) Point de contrôle après le lot 1 de 10 situations : on mesure le rendement réel, on met ce tableau à jour et on le montre à Thomas avant le lot 2. (d) **Relecture préalable du carnet** : 15 fiches d'octobre selon la règle de C8, un tour pour H10 corrigée ; hors du total ci-dessus.

**Chantier de développement en plus du contenu** (@product-manager, @fullstack) : de quoi retenir, par abonné, le résultat de chaque carte et sa réponse à « Tu avais une réponse ? » ; les retours de mission ; l'état « Fait » par fiche ; les messages et réponses de Mes questions ; un outil pour que l'équipe saisisse ses réponses ; la page « S'entraîner » ; la barre pilotée par les seuils. L'e-mail de réponse existe déjà.

### 7.3 bis Régime mensuel (après l'ouverture)

| Quoi | Par mois | Candidates (base, pire cas) | Relectures à l'aveugle | Lecture de Thomas | Délai |
|---|---|---|---|---|---|
| Carnet | 30 fiches (une réplique chacune, plus pourquoi, sortie polie, exercice) | 60 (2 par fiche, rendement de Boulot) à 360 (12 par fiche, rendement d'octobre) | 3 lots de 10, soit 3 x (2 critiques + départage) = 9 passes (méthode d'octobre) | 3 sur 10, soit 9 fiches | Carnet du mois suivant prêt avant le 30 (celui de décembre avant le 30/11, déjà au planning) |
| Situations neuves | 10 (30 répliques, 20 contextes) | 90 à 360 (répliques), 40 (contextes) | 1 lot | 3 fiches | Fin du mois |
| Écouter, repérer | 1 à 2 | vérification de sources | 1 passe | visionnage de 1 à 2 passages | Fin du mois |
| Mes questions | environ 5 par jour ouvré à 100 abonnés actifs, environ 25 à 500 [HYPOTHÈSE] | réponses types relues | | | 1 à 2 jours ouvrés |
| **Total de candidates** | | **environ 190 à 760** | | **environ 12 fiches plus 1 à 2 passages** | |

Si le carnet d'un mois est en retard : la rafale passe à une situation nouvelle un jour sur deux (2.3), l'alerte de stock se déclenche à 30 jours. Ce régime s'ajoute aux lettres du jeudi, qui suivent leur propre régime (25/10).

### 7.4 Ordre de production et seuils d'ouverture

| Ordre | Quoi | Dépend de | Seuil d'ouverture |
|---|---|---|---|
| 0 | Étalons (5) | Thomas | Bloquant |
| 0 bis | Relecture du carnet (1.4, C8) et levée de INV T5 (vidéos) | | Prérequis de 2 et de 6 |
| 1 | Vocabulaire et Comment c'est construit, en parallèle (ils fixent les noms) | E2, E3 | Bibliothèque, bloc « Vocabulaire et techniques » : 6 mécanismes et 4 fiches de vocabulaire |
| 2 | Quoi répondre : 6 lots de 10, contextes écrits avec les situations | Noms de 1 | **30 neuves validées + carnet** : condition d'ouverture de TOUT l'espace |
| 3 | Découpage des 25 étapes (diff mesuré) ; développement de Mes questions | 2 et modèle de données | Parcours par parcours, Machine à Café d'abord |
| 4 | Jeux et Formules | 2 | Jeux : 10 ; Formules : 4 |
| 5 | Écouter, repérer (lancer tôt) | E4, 0 bis | 4 fiches vérifiées |
| 6 | Quand ça tombe à plat, bilans, séances | 2, 3 | Selon la rubrique |

La production est parallèle ; l'**ouverture** est séquencée : rien ne s'ouvre avant que « Quoi répondre » le soit, **y compris « Mes questions »**, qui s'ouvre avec l'espace (l'encadré du profil reste en service d'ici là). Les autres entrées apparaissent quand leur seuil est atteint.

### 7.5 Prérequis non négociables

(a) Carnet : les vérifications de 1.4 (relecture de H10, diff complet, relecture d'octobre selon C8) avant son entrée dans la rafale. (b) Écouter, repérer : INV T5 levé (Rollman, Haroun, Ngijol, Bun Hay Mean) ; chaque passage visionné et minuté ; chaque citation vérifiée par un relecteur indépendant de l'auteur. (c) Mes questions : confidentialité (sa section 9 et sa partie 4) et conditions d'utilisation (art. 10) mises à jour au plus court avant l'ouverture, puisque « rien n'est conservé » devient faux.

### 7.6 Mesure de la valeur du contenu neuf

Lire une fiche ne laisse aucune trace (INV T4). Le « Fait » par fiche le rend visible. Cibles à poser avec @data-analyst, aucune inventée ici :

| Axe | Événement | Source |
|---|---|---|
| **Compétence (indicateur n°1)** | Part des cartes où l'abonné avait une réponse, par semaine | « Tu avais une réponse ? » |
| Adoption | Premier pas fait le jour 1 | « Fait » de la situation d'entrée |
| Engagement | Fiches « Fait » par semaine ; cartes jouées ; missions tentées ; envois dans Mes questions | « Fait », état de rafale, retours, messages |
| Rétention | Retour à J7, J30, J60 | Événement serveur d'ouverture |
| Utilité par type | Part des fiches ouvertes dont le geste est fait | « Fait » par type |

Réévaluation d'un type à 60 jours [HYPOTHÈSE de seuil, à fixer par @data-analyst].

---

## 8. Questions pour Thomas (C1 à C8, puis C10)

Numérotation propre à ce document (« C » pour contenu). Le numéro C9 est volontairement vide : la question sur le stockage de « Mes questions » est devenue une décision de Thomas du 12/11 (l. 164 et 165) et ses points restants sont groupés en C10. Chaque question a 3 options et une reco, sans jargon. Une option qui rouvre une décision déjà prise est marquée « rouvre la décision du JJ/MM ».

**Un mot avant les questions.** Tu avais mis « Guides » en tête de ta capture. Je ne crée pas un type de plus : les 120 conseils du catalogue tiennent ce rôle et chaque fiche neuve les relie. Si tu veux des guides neufs, dis-le. Tranchés sans question : les trois registres « la sûre / la joueuse / la risquée », les humoristes récents nommés, rien d'ouvert aux visiteurs, les noms de techniques seulement dans « Bibliothèque, Vocabulaire et techniques », « Mes questions » ouvert avec l'espace.

**C1. Quelle barre en haut de l'espace ?** (à voir en rendu sombre ; les trois comptent 6 entrées, « Aujourd'hui » y est toujours)
- A. Aujourd'hui, Parcours, Quoi répondre, Vocabulaire et techniques, Mes questions, Plus. Le catalogue (vannes, conseils, vidéos) passe en première ligne de « Plus ».
- B. Aujourd'hui, Parcours, Quoi répondre, Bibliothèque, Mes questions, Plus. « Bibliothèque » montre deux blocs : « Vannes, conseils, vidéos » et « Vocabulaire et techniques ». **Reco** : tout ce que tu as nommé est à un clic.
- C. Aujourd'hui, Parcours, Quoi répondre, Catalogue, Mes questions, Plus. Le vocabulaire passe en première ligne de « Plus ».
Dans les trois cas, « Mon profil » reste dans le menu de ton compte.

**C2. Combien de temps par semaine promet-on ?** Une étape demande aujourd'hui environ 22 à 25 minutes (deux vidéos de 5 à 8 minutes) pour « 15 à 20 min/semaine » annoncé. Le cœur de l'étape 1 de Machine à Café tient en 15 minutes hors introduction.
- A. On garde la promesse : le cœur de chaque étape tient dans 15 à 20 minutes, la 2e vidéo et les nouvelles fiches passent en « pour aller plus loin », facultatives. Aucun texte n'est réécrit, mais le statut de vidéos que tu as choisies (étalons du 07/10, vidéos de Boulot regardées le 11/10) change, et la phrase « Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz » serait retouchée. **Reco.**
- B. On change la promesse affichée (par exemple « 20 à 30 min/semaine ») : rouvre la décision du 29/09 (« 15 à 20 min/semaine selon le parcours »), reprise sans changement le 07/10 ; chaque texte qui la porte demande ton go.
- C. On ne touche à rien : la promesse reste, les 2 vidéos restent obligatoires, les nouvelles fiches vivent seulement dans leurs rubriques. L'écart avec la promesse reste.

**C3. Veux-tu un entraînement quotidien ?** Une situation nouvelle par jour (3 cartes au plus, 3 à 5 minutes) : tu tentes d'abord ta réponse (rien n'est enregistré, le compte à rebours est facultatif), tu dis si tu avais une réponse (trois boutons), puis tu vois les répliques ; les cartes ratées reviennent 2, 7 puis 21 jours plus tard ; des missions montent d'une marche seulement quand la précédente a marché. Rien n'est envoyé, tout se passe quand l'abonné ouvre l'espace. À 30 jours la rafale continue : le carnet mensuel et environ 10 situations neuves par mois suffisent pour 1 par jour. Il faut construire de quoi retenir les choix de chaque abonné : c'est un vrai chantier en plus du contenu. Les fiches du carnet donnent des cartes « drôle ou poli ? » (deux réponses), les situations neuves des cartes « quel registre ? » (trois réponses) ; le carnet serait 60 % des cartes au début, 75 % ensuite.
- A. Oui, carnet inchangé : les cartes du carnet restent « drôle ou poli ? ». Aucune décision rouverte. **Reco.** On pourra reposer la question B en janvier, avec la première mesure.
- B. Oui, et les carnets à partir de janvier sont écrits avec trois réponses et deux contextes : rouvre la décision du 03/10 (carnet validé : une réplique par fiche, une sortie polie). L'entraînement converge alors vers le choix entre trois registres, sans retoucher aucun texte existant.
- C. Non : des fiches et des parcours, pas d'entraînement quotidien.

**C4. La série, les points et « Fait » ?** Aujourd'hui la série compte les jours où l'abonné valide une étape ou termine un quiz d'étape ; les points viennent des étapes et du bonus de fin. « Fait » par fiche, déclaré par l'abonné quand il a fait le geste, est le défaut proposé (c'est la Q5 du brief). Dans tous les cas, la courbe « avais-tu une réponse ? » est affichée dans « Ton mois » comme simple mesure, sans effet sur la série ni les points.
- A. Aucune nouvelle règle : la rafale et les fiches ne comptent ni pour la série ni pour les points ; un repère neutre (« 12 cartes cette semaine ») montre l'habitude. On mesure 30 jours avant de toucher à la série. **Reco.**
- B. Une rafale terminée compte comme une pratique pour la série, jamais pour les points : précise la décision du 07/10 (« série comptée sur la pratique ») ou la rouvre selon ta lecture, car elle cite l'étape validée et le quiz d'étape.
- C. B, plus des points pour chaque fiche faite : nouvelle règle de points (ton accord est requis) et même réserve sur le 07/10.

**C5. Les situations des lettres du jeudi ?** Le 25/10 tu as dit que la lettre doit apporter ce que le site ne donne pas.
- A. Jamais reprises : le site a ses situations, les lettres gardent les leurs. **Reco.**
- B. Une situation de lettre entre dans « Quoi répondre » 3 mois après son envoi, retravaillée : rouvre la décision du 25/10.
- C. Les lettres déjà reçues restent consultables telles quelles dans « Plus », sans copie dans « Quoi répondre » : rouvre la décision du 25/10 sur le principe.

**C6. Quels univers pour les situations ?** Déjà validés par toi : soirée, boulot, amis, famille, couple, dating, caisse, voisin (carnet), couple (Black Friday), un premier rendez-vous (lettre W50). Yanis vit « en soirées, en coloc et avec ses potes ».
- A. Tous les univers du quotidien, soirées, rencontres et couple compris. Rupture et deuil : jamais comme sujet de vanne. Rencard et couple sont [HYPOTHÈSE : plausibles pour Marc et Yanis, non écrits dans les personas], mais déjà dans des contenus que tu as validés. **Reco.**
- B. Comme le widget : sans soirées, rencontres ni couple. Plus prudent, mais retire les soirées, terrain écrit de Yanis, et plusieurs fiches du carnet déjà validées.
- C. A, plus la rupture traitée avec légèreté sur le fait de recommencer à parler, jamais sur la personne : Marc s'y retrouverait, le risque de blesser est réel.

**C7. Niveaux et entrée de Yanis ?** Dans les données, les niveaux sont DEBUTANT et INTERMEDIAIRE (Machine à Café et Boulot DEBUTANT ; Répartie, Confiance, Storytelling INTERMEDIAIRE). Le produit ne connaît que les 5 profils du quiz : un abonné comme Yanis, sans quiz, reçoit Machine à Café.
- A. Un ordre conseillé « Tes 4 premières semaines » en tête de « Parcours », les niveaux actuels, des fiches « pour aller plus loin » sans nom de niveau ; sans quiz, Machine à Café par défaut avec les quatre autres montrés en une ligne. **Reco.**
- B. A, plus un niveau « avancé » créé : ajoute une valeur au code et aux libellés, accord requis.
- C. A, plus un sixième parcours débutant pour Yanis : rouvre les textes validés qui disent « les 5 parcours » (offre, e-mails approuvés) et prolonge la roadmap du 07/10.

**C8. Jusqu'où itérer chaque contenu avant qu'il te soit montré ?** Le 12/11 tu as demandé d'itérer « chaque étape jusqu'à 10 », relecture à l'aveugle, 10/10 chez tous les relecteurs. Cela vaut-il aussi pour le carnet déjà écrit que l'espace reprend ? Octobre a été relu par deux critiques, mais dix des quinze répliques n'ont qu'un seul critique indépendant (l'autre voix est celle de l'orchestrateur) ; novembre est à 10 sur 10 sauf la fiche H10, corrigée depuis et jamais relue.
- A. 10/10 chez tous, sans limite de tours, pour tout contenu neuf de l'espace ET pour le carnet repris (octobre relu à cette règle, H10 relue, avant l'entrée dans la rafale). C'est la décision du 12/11 prise à la lettre : elle a déjà remplacé « 2 avis sur 3 » pour les contenus de l'espace, donc elle ne rouvre rien. Risque dit en clair : une boucle quand les relecteurs ne s'accordent pas sur une réplique drôle ; tu peux l'arrêter à tout moment. **Reco.**
- B. 10/10 chez tous pour les 5 étalons et le premier lot de chaque type, puis « 2 avis sur 3 au niveau » (règle du 08/10) pour la suite ; carnet : octobre relu à 2 avis sur 3 par des relecteurs indépendants, H10 relue. Touche ta décision du 12/11 pour la production en série.
- C. A, avec une limite de 4 tours [HYPOTHÈSE] : si les relecteurs ne s'accordent pas, on te montre les deux versions et leurs notes, et la réplique la plus faible peut sortir. Touche ta décision du 12/11 (limite de tours).

**C10. « Mes questions » : trois points à confirmer** (tu as décidé le 12/11 de tout garder en base, avec l'historique visible). La réponse de l'équipe est saisie dans l'outil, enregistrée, puis part par l'e-mail de réponse habituel. Restent : combien de temps on garde, ce que devient l'historique quand l'abonnement s'arrête, et le droit de retirer un envoi. Les textes de confidentialité et des conditions d'utilisation qui disent « rien n'est conservé » seront mis à jour au plus court. Message qui évoque une détresse : réponse à la main, en priorité, selon le playbook.
- A. Tant que le compte existe, supprimé avec le compte ; l'abonné peut retirer un envoi (l'échange est supprimé) ; après la résiliation, l'historique reste lisible depuis « Mon profil » tant que le compte existe ; un avis juridique d'une page sur ces trois points (durée, suppression, messages sensibles). **Reco** : c'est son espace.
- B. Comme A pour la durée et le retrait, mais après la résiliation l'accès à l'historique est fermé et les données sont gardées 24 mois puis supprimées (durée déjà utilisée pour les réponses de résiliation, 07/11) ; avis d'une page.
- C. Les messages sont gardés 6 mois après le dernier échange (durée des e-mails de questions, 25/10), retrait possible, accès fermé après la résiliation, sans nouvel avis juridique (comme tu l'as dit le 25/10) : contredit en partie « accès à leur historique » du 12/11.

---

## 9. Étalons à calibrer avec Thomas en premier (5)

Chaque étalon est relu à 10/10 chez tous les relecteurs à l'aveugle avant de t'être montré, puis Thomas choisit entre 2 versions. Les noms de rubriques, de registres et de l'onglet « Mes questions » sont présentés en même temps, en rendu sombre.

| # | Étalon | Ce qu'il fixe |
|---|---|---|
| E1 | Une situation « Quoi répondre » complète (3 répliques, règle, erreur, geste, 2 contextes) à partir du candidat de 3.3 ou d'un meilleur, plus la liste des 5 situations d'entrée (4.2) | La voix de l'espace, le niveau des 60 situations, la part de contextes gagnés par la risquée, les 5 entrées |
| E2 | Une fiche « Comment c'est construit » (le faux secret) et une fiche « Formules à détourner » (3.6) | L'absence de ton scolaire, la grille de retour, le niveau des détournements |
| E3 | Une fiche de Vocabulaire (5 mots, entrée de 3.5) | Le niveau de jargon, le lien avec le glossaire public |
| E4 | Une fiche « Écouter, repérer » sur un humoriste récent choisi par Thomas | Le choix des humoristes, le degré de découpage, la vérification |
| E5 | Une carte de rafale (« Ta réponse d'abord », « Tu avais une réponse ? », défaut du compte à rebours, ordre de tirage), un jeu, une mission avec ses retours qui font monter ou non la marche, une question de bilan, l'écran « Mes questions » (3 types, états, historique) | Le chrono, l'interaction, la progression, le ton de « Ce qu'on aurait pu dire », le libellé de l'onglet |

---

## Annexe A. Traitement de chaque correction

Sigles : UX3 = `tour-3-ux.md`, RE3 = `tour-3-reviewer.md`, EL3 = `tour-3-elon.md` (numéros M ou N des rapports). « Appliqué » renvoie à la section de ce document.

### A.1 Corrections du tour 3

| Correction | Traitement |
|---|---|
| UX3 M1, RE3 M7, EL3 N1 barre : 7 entrées, « Aujourd'hui » absent, reco conditionnelle | Appliqué : 6.1 (compte à l'écran), 6.2 (trois variantes à 6 entrées, « Aujourd'hui » toujours présent, reco B ferme), C1 sans « à condition que » |
| UX3 M2, RE3 M5, EL3 N4 l'abonné ne sait pas qu'on lui a répondu ; réponses hors base | Appliqué : 2.6 « Un seul circuit » (saisie dans l'outil, enregistrement, e-mail de réponse habituel, recopie de toute réponse faite hors outil, signal dans « Aujourd'hui », aucune pastille d'onglet) |
| UX3 M3 types et états limites | Appliqué : 2.6 (trois types en une phrase, tableau des états : vide, envoi en cours, envoyé, répondu, en retard, retiré, abonnement terminé, message sensible ; phrase « Évite les noms » ; routage) ; retrait et historique après résiliation posés en C10 |
| UX3 M4 sélecteur de scène d'entrée | Appliqué : 4.2 (tableau signal, entrée ; personas = cas d'essai en 4.3 ; « Les 5 situations pour commencer » = les 5 situations d'entrée des 5 profils ; situation par défaut nommée) |
| UX3 M5 régime mensuel | Appliqué : 7.3 bis (candidates, relectures, lecture de Thomas, délai) ; règle du carnet en retard (2.3) |
| UX3 M6, RE3 M11 exemples | Appliqué : Formules, Vocabulaire et Bilan écrits (3.6, 3.5, 3.10) ; jeu « frigo de la coloc » à la place de la photocopieuse (3.9) ; « une version qui ne marche pas, et pourquoi » (3.4) ; marche 2 portée par la scène de la poêle et contexte où la joueuse gagne (3.3) ; sortie de scène classique remplacée (3.8) |
| UX3 M7 base juridique, textes validés | Appliqué en partie : 2.6 cite le 07/10 et le 25/10 comme décisions rouvertes avec l'accord du 12/11 (l. 164 et 165), liste les textes à retoucher ; la décision « pas de nouveaux avis » est sourcée (l. 136) ; la demande d'un avis court est posée en C10 plutôt que décidée |
| UX3 M8 (a) ouverture de Mes questions | Appliqué : 7.4, 2.6 (suit la règle commune, l'encadré du profil reste d'ici là) |
| UX3 M8 (b) « S'entraîner » sans entrée | Appliqué : ligne « S'entraîner » dans « Plus » (6.2, 6.3), carte dans « Aujourd'hui » |
| UX3 M8 (c) contenu du jour contre situation du jour | Appliqué : 4.4 (deux éléments distincts, ligne de flottaison) |
| UX3 M8 (d), RE3 M10 repère | Appliqué : « 12 cartes cette semaine », affiché à partir d'une carte (4.4) |
| UX3 M9 temps hebdomadaire | Appliqué : ligne « temps maximum » par semaine (4.1, semaine 3 jusqu'à 79 min) ; cœur de l'étape 1 à 15 puis 17 minutes (5.2) |
| UX3 M10 jargon des questions | Appliqué : section 8 réécrite en phrases simples ; références juridiques en note dans 2.6 |
| UX3 M11 chrono | Appliqué : désactivé la première fois, « Voir les répliques » toujours disponible (2.2) |
| UX3 M12 Guides | Appliqué : note à Thomas en tête de la section 8 et en 3.1 (pas de type de plus, les 120 conseils tiennent le rôle) |
| UX3 M13 INV deux lignes | Appliqué en partie : la session a corrigé T3 ; la ligne « Carnet » du tableau 1.1 d'INV reste à vérifier par @product-manager |
| RE3 M1 C8 : appui faussé sur s19 | Appliqué : l'appui est supprimé (c'était une exception limitée au PS de Boulot, `founder-preferences.md` l. 85), C8 argumentée sur ses mérites, reco A avec le risque dit |
| RE3 M2 §1.4 octobre, portée sur le carnet | Appliqué : 1.4 décrit la preuve exacte (2 critiques + orchestrateur ; 5 répliques à deux critiques, 10 à un seul) ; la portée de la règle du 12/11 sur le carnet est un point de C8, plus une phrase de ce document |
| RE3 M3 H10 | Appliqué : vérification (a) faite (texte corrigé en ligne, l. 303) ; un tour de relecture avant la rafale (1.4, 7.3 d, 7.5) |
| RE3 M4, EL3 N5 cartes du carnet | Appliqué : deux sortes de cartes (2.2), aucun texte neuf par fiche (2 ambiances fixes : le contexte spécifique de la v3 est supprimé), part de 60 % puis 75 % dite, répartition du quart seulement pour les neuves ; carnets suivants à trois registres posés en C3 B (option marquée, pas défaut) |
| RE3 M6 | Appliqué : voir UX3 M8 (a) |
| RE3 M8 fiche 0 et « Imagine Léa » | Appliqué : la scène reste dans 1.1, retirée de la fiche 0 (5.2) |
| RE3 M9 filtre | Appliqué : « coloc » et « transports » ajoutés (3.3) |
| RE3 M12 24 mois | Appliqué : précédent `RESILIATION_CONSERVATION_MOIS` (07/11) cité en C10 B |
| RE3 M13 « en session » | Appliqué : formule de la l. 135 reprise (2.6) |
| EL3 N2 progrès réel | Appliqué : « Tu avais une réponse ? » (2.2), courbe dans « Ton mois » (4.4), indicateur n°1 (7.6) ; mesure d'affichage, ni série ni points |
| EL3 N3 difficulté de la rafale | Appliqué : ordre de tirage P1, P2, P3 après la semaine 4 ou 20 cartes avec réponse ; compte à rebours raccourci seulement sur proposition ; risquée plus tard (2.2) |
| EL3 N6 missions selon la réussite | Appliqué : 2.4 (marche suivante selon le retour), 4.1 (« marche visée ») |
| EL3 N7 charge à 500 abonnés | Appliqué : 2.6 (environ 25 par jour ouvré, leviers) et 7.3 bis |
| EL3 N8 exemple du stagiaire | Appliqué : 3.4 (échoue à la question 2) |
| EL3 N9 rédaction de C4, C8, 1.4 | Appliqué : C4 B précise le choix de la reco A (mesure 30 jours) ; C8 A dit qu'elle ne rouvre rien ; la phrase de 1.4 sur la portée déplacée dans C8 |
| EL3 N10 révision trop courte | Appliqué : J+2, J+7, J+21, retour à J+30 d'une partie des réussies, 3 cartes par jour au plus (2.2) |
| Arbitrages de la session 1 à 8 | Appliqués : voir sections 2.6, 4.2, 6.2, 7.3 bis, 2.2, 2.4, 8 (C8) et 3.5, 3.6, 3.10 |

### A.2 Restes partiels des tours 1 et 2

| Reste | Traitement |
|---|---|
| UX2 N9, RE2 N14, EL2 N14 corps d'INV, T3 | T3 corrigé par la session (« partiellement levé ») ; 1.4 s'aligne dessus ; ligne « Carnet » du tableau 1.1 d'INV à vérifier par @product-manager |
| RE2 N2 règle d'arrêt à 4 tours | Appliqué : seule C8 option C la porte, marquée |
| RE2 N10 carnet non validé | Appliqué : preuve exacte et limites (1.4) ; relecture d'octobre selon C8 |
| RE2 N19 ordre d'ouverture | Appliqué : « Mes questions » suit la règle (7.4) |
| EL2 N11 la risquée dans le carnet | Appliqué : cartes « Drôle ou poli ? » séparées (2.2) |
| EL2 N9 reco de la série | Maintenu : reco A, B marquée, raison donnée (C4) |
| UX2 N16 Guides | Refus maintenu et dit à Thomas (3.1, section 8) |
| UX2 N15 charge de « Montre-la » | Absorbé par « Mes questions » (2.6) |
| UX2 N13 état de la barre le jour de l'ouverture | Appliqué : 6.2 |
| UX1 panneau « Plus » et budget d'en-tête | Refus valable maintenu : le dessin reste à @ux et @design ; le contenu de « Plus » est posé (6.2) |
| UX2 N4 / UX2 N12 | Appliqué : volumes par palier (3.2), exemples écrits |
| 264 décryptages pour 149 vannes actives | Hypothèse de décryptages de vannes retirées, non vérifiée en base [À VÉRIFIER] |

## Annexe B. Ce qui reste inconnu

- Relecture du carnet : tour de relecture de H10 corrigée ; diff complet de `2026-11.json` ; relecture d'octobre et de ses champs non relus ; ligne « Carnet » d'INV (1.4).
- Découpage exact des 4 autres parcours ; nombre de défis par conseil et par vidéo.
- Rendement réel des répliques en situation : mesuré au lot 1 (7.3).
- Nombre exact de lettres au format A.
- Parcours désigné par chaque profil du quiz (`quiz-data.ts`) ; valeur de Q10 et de Q5 du brief.
- Cible de la mesure d'usage : avec @data-analyst.
- Liste exacte des textes validés à retoucher pour « Mes questions », ancre de l'e-mail J12, conduite du playbook (3114).

## Annexe C. Agents spécialisés recommandés (angle mort vérifiable seulement)

| Agent | Type | Rôle | Justification | Priorité |
|---|---|---|---|---|
| Testeur-persona (cas d'essai Yanis, Sophie, Marc) | testeur | Lire 3 fiches de chaque type, jouer la rafale et « Mes questions » avec le compte à rebours, dire ce qui sonne cours ou pèse | Le risque n°1 (ton scolaire, pression du chrono) ne se voit pas à l'écriture | Haute |
| Relecteur humoriste à l'aveugle | expert domaine | Noter répliques, détournements, sorties sur la barre Alexa | 180 répliques, 24 sorties, 60 détournements, plus le régime mensuel | Haute |
| Vérificateur de citations | expert domaine | Source, minute, exactitude (prérequis 7.5) | Règle anti-invention, humoristes récents | Haute |

Handoff vers @agent-factory si Thomas valide le périmètre.
