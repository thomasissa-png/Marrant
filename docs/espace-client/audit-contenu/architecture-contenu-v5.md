# Architecture de contenu de l'espace Premium, v5 (s24)

> REMPLACÉ par `architecture-contenu-v6.md` le 12/11/2026 après le tour 5 de relecture (Elon 9,3, Reviewer 8,6, UX 8,2). Ne plus s'y référer pour l'ordre des signaux, la carte de rafale, la détresse, le parcours par défaut, le bilan ni C9 à C11.

> Auteur : @creative-strategy, 12/11/2026. Remplace `architecture-contenu-v4.md`. Réponse aux tours 4 de relecture : @ux 8,0, @reviewer 8,1, @elon 8,7 (`iterations/tour-4-*.md`) et aux arbitrages de la session. Chaque correction est tracée en annexe A.
> Faits vérifiés par la session dans le code et repris ici : `quiz-data.ts` l. 41 à 100 (OBSERVATEUR vers confiance ; STORYTELLER vers storytelling, sinon machine-a-cafe si le parcours n'est pas publié ; ABSURDE vers machine-a-cafe ; PUNCHLINEUR vers repartie ; TAQUIN vers repartie) ; le résultat du quiz n'est gardé que dans le navigateur (`localStorage`, `viral-quiz.tsx` l. 36 à 46) : rien en base, rien sur le compte ; playbook l. 595 (aide officielle, 3114 en cas de détresse) ; `glossary.ts` l. 79 (Accusé de réception) ; phrases juridiques de @legal dans `docs/legal/espace-client-s24-phrases.md`.
> Sources relues pour ce tour : les 3 rapports du tour 4, le brief §0 (demande d'origine de Thomas, 10/11 : « les sections etc en haut vocabulaire etc »), `founder-preferences.md` (l. 85, 135, 136, 154, 161 à 165), INV (T3 corrigé par la session).
> Conventions : [HYPOTHÈSE] = dimensionnement ou choix de travail. [À VÉRIFIER] = fait non lu. [EXEMPLE NON VALIDÉ] = illustration non relue à l'aveugle. Toute règle nouvelle (série, points, texte libre, stockage, relecture) est une question à Thomas en section 8, jamais une décision. Les noms de rubriques et de formats sont des propositions de travail, à caler par étalons rendus (P0 s8).
> Règles tenues : tutoiement, aucun tiret cadratin, aucun émoji, aucune mention d'IA, aucun concurrent nommé, rien de culpabilisant, aucune relance d'inactivité, aucun nouvel e-mail automatique.

## 0. Ce qui change depuis la v4 (12 lignes)

1. **Entrée** (4.2, 4.3) : le tableau signal vers parcours reprend le code du quiz (Observateur vers Confiance, Storyteller vers Storytelling, Absurde vers Machine à Café, Punchlineur et Taquin vers Répartie). Le résultat du quiz n'est gardé que dans le navigateur : l'entrée par le quiz ne marche que sur le même appareil, sinon `returnTo`, sinon la scène par défaut. Une option (C9) propose de rattacher un signal au compte.
2. **Sans signal** : une scène universelle, « La caisse » (ni bureau ni études). Les cas d'essai Yanis, Sophie et Marc sont recalés sur ce que le produit ferait réellement, avec une vraie question de test pour chacun.
3. **Barre** (6.2) : la reco garde « Vocabulaire et techniques » en haut (demande d'origine de Thomas, 10/11), 6 entrées réelles, « Aujourd'hui » présent. Chaque variante dit honnêtement ce qu'elle sacrifie ; plus aucune phrase « tout à un clic ».
4. **Temps** (C2, 4.1) : le temps hebdomadaire réel (rafale comprise, jusqu'à 79 minutes en semaine 3) est posé à Thomas contre la promesse « 15 à 20 min/semaine ».
5. **La carte de rafale** (2.2) : « Ta réponse d'abord », puis les répliques, puis « Tu avais une réponse ? », puis le choix, puis la règle. Les cartes du carnet deviennent des cartes de production, sans étape de choix.
6. **Mes questions** (2.6) : un seul délai pour tous (plus de « en priorité »), un fil par envoi (l'abonné peut répondre à la réponse), Reply-To lu en base, lien du profil conservé pour que l'e-mail J12 approuvé reste vrai, réponses « Situation à gérer » avec norme et charge comptée.
7. **C10** : réduite à la durée, au sort après résiliation et au retrait d'un envoi. Les phrases juridiques sont déjà écrites par @legal : plus d'avis recommandé.
8. **Exemples** : détournements remplacés, risquée du rattrapage remplacée, bilan construit sur Machine à Café, Accusé de réception aligné sur le glossaire (formule dite).
9. **Mesure de compétence** : « Tu avais une réponse tout de suite ? », avec l'état du compte à rebours enregistré ; courbe affichée à partir de 10 cartes, texte neutre si elle baisse.
10. **Missions** : cas limites (marche 5, marche 1, une seule mission ouverte).
11. **Régime mensuel** : relecture du carnet « selon C8 » (plancher de la méthode d'octobre), réponses « Situation à gérer » comptées.
12. **Numérotation** : C1 à C10 sans trou (C9 devient la question sur le signal d'entrée).

---

## 1. Faits de base (sources)

### 1.1 Chiffres de production et de code

| Fait | Valeur | Source |
|---|---|---|
| Vannes, conseils, vidéos actifs en production | 149, 120, 89 | INV section 6 (`/api/content-stats`, 12/11) |
| Parcours et étapes | 5 parcours, 25 étapes (3, 4, 6, 6, 6) | `config/premium.ts` |
| Rythme annoncé | Machine à Café 15, Répartie 20, Confiance 20, Storytelling 20, Boulot 15 min/semaine | `config/premium.ts`, choix du 29/09 |
| Niveaux de difficulté | DEBUTANT : Machine à Café (`parcours-seed.json` l. 8), Boulot (`parcours-boulot-s19.json` l. 307) ; INTERMEDIAIRE : Répartie, Confiance, Storytelling (`parcours-storytelling-s18.json` l. 94) | lus et vérifiés par @elon et @reviewer |
| Parcours désigné par le quiz, par profil | Observateur, confiance ; Storyteller, storytelling (machine-a-cafe si non publié) ; Absurde, machine-a-cafe ; Punchlineur, repartie ; Taquin, repartie | `quiz-data.ts` l. 41 à 100 |
| Conservation du résultat du quiz | navigateur seulement (`localStorage`), rien en base ni sur le compte | `viral-quiz.tsx` l. 36 à 46 |
| Persona de Machine à Café dans le seed | « Sophie (26 ans, jeune active) » | `parcours-seed.json` l. 12 |
| Étape 1 de Machine à Café | scène (`moduleDetail`, qui contient « Imagine Léa »), pourquoi, 1 conseil avec exemple et défi, 5 vannes, 2 vidéos (Paul Séré, Karim Duval), quiz de 4 questions, 50 XP, gratuite | `parcours-seed.json` |
| Durée réelle d'une étape | environ 22 à 25 min [HYPOTHÈSE de lecture : 200 mots/minute, vidéos de 5 à 8 min] ; mesurée seulement sur Machine à Café | INV 3.1 |
| XP, niveaux, série (code) | XP d'étape (`moduleXp`, 20 par défaut), bonus de fin 100, seuils 0/100/500/1 500/5 000, série comptée sur la pratique (étape validée, quiz d'étape terminé), rythme doux de 7 jours ; la date conseillée n'existe qu'après une première validation (`nextRecommendedAt`) | `lib/progression.ts` |
| `progression-levels.md` | OBSOLÈTE (gains absents du code) | lu le 12/11 |
| Retour d'exercice existant | 3 valeurs fermées `pas-essaye`, `essaye-bof`, `essaye-ca-a-marche` | `lib/progression.ts` l. 114, choix du 07/10 |
| Glossaire public | 12 termes (définitions de 40 à 60 mots). « Accusé de réception » = formule dite (« Intéressant », « Pas faux », « Bien vu ») pour gagner quelques secondes | `glossary.ts` l. 79 |
| Carnet | 15 fiches (octobre) + 30 (novembre). Les identifiants du JSON ne suivent pas les codes de relecture : H10 est `2026-11-25`, H03 est `2026-11-03`, H29 est `2026-11-10` | INV section 6, `2026-11.json` |
| Lettres | 6 du mois + 16 réservées, approuvées par Thomas. Les réservées alternent le format A (situation, la sûre, la joueuse, la risquée, comment choisir, erreur, exercice : W46, W48, W50 lues) et un format B par mois (décryptage : W47, W51). Nombre de lettres au format A : à compter [À VÉRIFIER] | `hebdo-premium.json`, choix du 25/10 |
| Univers déjà validés par Thomas | soirée, boulot, amis, famille, couple, dating, caisse, voisin (octobre) ; couple (Black Friday) en novembre ; un premier rendez-vous (lettre W50) ; un exposé de TD (W46) | `departage-2026-10.md`, `departage-r2.md`, `hebdo-premium.json` |
| Questions à l'équipe | réponse en général sous 1 à 2 jours ouvrés, jamais 7 jours (CGU : au plus tard 3 jours ouvrés, on prévient en cas de retard) ; réponse « préparée en session, relue et envoyée par l'équipe », signée « L'Équipe Deviens Marrant » ; limites techniques par abonné 3 par 10 minutes et 10 par jour, aucune limite affichée ; « stop au juridique excessif, pas de nouveaux avis » | `founder-preferences.md` l. 135 et 136 (25/10) |
| Conservation déjà décidée | 24 mois pour les réponses à la question de résiliation (`RESILIATION_CONSERVATION_MOIS`) ; 6 mois après le dernier échange pour les e-mails de questions | l. 154 (07/11), l. 135 (25/10) |
| Messages de détresse | orientation vers l'aide officielle (3114), réponse sans humour | `docs/marrant/playbook.md` l. 595 |
| Phrases juridiques de « Mes questions » | déjà écrites par @legal : confidentialité section 9 (puces 1 et 4), partie 6 (dernier paragraphe), partie 4 (ligne Neon, facultatif), CGU art. 10 | `docs/legal/espace-client-s24-phrases.md` |

### 1.2 Les personas, d'après `project-context.md`

Les personas sont des cas d'essai pour écrire et tester les contenus ; **le produit ne les connaît pas**. Ses seuls signaux sont le lien de retour (`returnTo`) et, sur le même appareil, le résultat du quiz d'humour (4.2).

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

- **Octobre** : 180 candidates relues par deux critiques à l'aveugle (A et B). Le départage est de l'**orchestrateur** (`departage-2026-10.md` l. 3), pas d'un troisième relecteur indépendant. Sur les 15 répliques retenues, **5 sont jugées au niveau par les deux critiques** (n° 56, 131, 108, 121 et V2-12) et **10 par un seul critique indépendant** plus l'orchestrateur. Format et 15 fiches validés par Thomas le 03/10 (« je valide tout go »). Les champs autres que la réplique (pourquoi, sortie polie, exercice) : relecture non établie [À VÉRIFIER].
- **Novembre** : relecture à l'aveugle en plusieurs passes. Verdict v4, passe 2 : 27 fiches à 10 sur 10, 3 à 9 (H03, H09, H10). Confirmation v5 sur les 6 fiches retouchées : relecteurs 2 et 3 à 10 sur 10 ; relecteur 1 à 10 sauf H10 à 9 (« aux points arrachée au dernier round » inexact).
- **Fiche H10 (`2026-11-25`)** : le texte en ligne contient la correction proposée par le relecteur 1 (« à la décision des juges », l. 303). Cette version corrigée **n'a été relue à l'aveugle par personne**. Règle d'or P0 s18 : un tour de relecture à l'aveugle avant son entrée dans la rafale.
- **Concordance vérifiée** sur 3 fiches : `2026-11-03` = H03 v5, `2026-11-10` = H29 v5, `2026-11-25` = H10 corrigée.
- **À faire avant que le carnet entre dans la rafale** : (a) un tour de relecture de H10 ; (b) le diff complet entre `2026-11.json` et la dernière version relue ; (c) la relecture d'octobre et de ses champs non relus, selon la règle choisie en C8. **Toute fiche du carnet corrigée revient à Thomas avant de reprendre sa place** (comme les lettres).
- **Portée de la règle du 12/11** : ce document ne la tranche pas pour le carnet. C'est un point de la question C8.

---

## 2. La leçon, le moteur d'entraînement et « Mes questions »

### 2.1 Définition

**Une leçon est une fiche d'environ 5 minutes qui apprend une chose et se termine par un geste** : choisir, écrire, dire à voix haute, ou tenter dans la vraie vie. Toute fiche a un geste, même celles reprises du catalogue (les 5 vannes d'une étape : « choisis celle que tu ressortiras cette semaine »). « Fait » se coche quand le geste est fait, déclaré par l'abonné, sans preuve : défaut proposé, à confirmer avec Q5 du brief (autres options : « Fait » seulement à la validation actuelle, défi ou quiz ; « Fait » à la lecture complète). L'état « Fait » est unique par fiche, quelle que soit la porte d'arrivée.

Deux étages : **les fiches** expliquent et font essayer (sections 3 à 5) ; **le moteur** fait répéter, revoir et sortir de l'écran (2.2 à 2.5). Un troisième lieu, **Mes questions** (2.6), prend le relais quand l'abonné bute sur sa propre situation.

### 2.2 La rafale du jour, carte par carte

Dans « Aujourd'hui », jusqu'à 3 cartes par jour (3 à 5 minutes [HYPOTHÈSE]) : 1 situation nouvelle plus jusqu'à 2 cartes à revoir. Libellé de l'action : « Si tu as 5 minutes » : la rafale n'est jamais présentée comme une obligation. Il existe **deux sortes de cartes**.

**Carte « Quel registre ? »** (situation neuve à trois répliques, deux contextes par situation). Ordre :
1. **La scène et le contexte** s'affichent.
2. **« Ta réponse d'abord »** : l'abonné tente SA réplique, à voix haute ou dans sa tête (« dans ta tête, ça compte aussi », comme dans l'app, décision du 04/11). Un compte à rebours de 10 secondes [HYPOTHÈSE, à caler à l'étalon E5] est **désactivé la première fois, activable ensuite**, et un bouton « Voir les répliques » est toujours disponible : un minuteur ne bloque jamais l'accès. Aucun jugement, rien de ce texte n'est enregistré.
3. **Les répliques** apparaissent (la sûre, la joueuse, la risquée).
4. **« Tu avais une réponse tout de suite ? »** : « Rien », « Oui, proche de celle-ci » (l'abonné touche la réplique la plus proche), « Oui, une autre ». Un seul toucher, aucun texte libre. L'état du compte à rebours (actif ou non) est enregistré avec la réponse, pour lire la courbe dans les deux cas. « Rien » met la carte à revoir.
5. **Le choix** : l'abonné choisit la réplique qui convient au contexte.
6. **La règle**, en une phrase.

**Carte « Et toi ? »** (fiche du carnet, qui a deux répliques : sa réponse et sa sortie polie « si c'est tendu »). C'est une **carte de production, sans étape de choix** : l'étiquette d'ambiance (« détendue » pour la réponse, « tendue » pour la sortie polie) donnerait la réponse. Ordre : la scène ; « Ta réponse d'abord » ; les deux répliques montrées, chacune avec son ambiance ; « Tu avais une réponse tout de suite ? » ; le « pourquoi » du carnet. Aucun texte neuf par fiche, aucun texte du carnet modifié. Seule la réponse « Rien » les fait revenir (J+2).

**Ce que le moteur retient** (par carte) : la réponse à « Tu avais une réponse tout de suite ? », l'état du compte à rebours, et, sur les cartes « Quel registre ? », le résultat du choix. La mesure de la compétence est la part des cartes où l'abonné avait déjà une réponse. **Courbe** dans « Ton mois » (4.4) : affichée à partir de 10 cartes, **sans pente colorée ni phrase de reproche** ; si elle baisse, texte neutre (« Les semaines varient. Cette semaine : 4 cartes sur 10 avec une réponse. »). Mesure d'affichage : ni série ni points (sauf option C de C4).

**Ordre de tirage et progression** :
- La situation nouvelle du jour suit un ordre : les 5 situations d'entrée d'abord (P1), puis les P2, puis les P3 (supérieur, inconnu, groupe) **seulement après la semaine 4 ou après 20 cartes où l'abonné avait une réponse** [HYPOTHÈSE de seuil, à caler à l'étalon E5]. Les contextes où la risquée gagne arrivent surtout dans les P3.
- Le compte à rebours ne raccourcit **jamais de lui-même** : après une semaine où l'abonné avait une réponse sur 7 cartes ou plus de 10, l'espace propose « 7 secondes ? », puis « 5 secondes ? ». Il peut refuser sans conséquence.
- **Révision** : une carte « Quel registre ? » ratée (mauvais choix) revient à J+2, J+7 puis J+21 ; une carte où l'abonné a répondu « Rien » revient à J+2 ; une partie des cartes réussies revient à J+30 [HYPOTHÈSE]. Maximum 3 cartes par jour : **les cartes en trop glissent au lendemain, jamais d'arriéré affiché**. À défaut de carte à revoir, la place est prise par un autre contexte d'une situation déjà vue.

**Règles d'écriture des contextes** (situations neuves) : une seule bonne réponse défendable par contexte ; chaque situation porte 2 contextes ; sur l'ensemble des situations neuves, environ la moitié des bonnes réponses sont des joueuses, un quart des sûres, un quart des risquées [HYPOTHÈSE, à fixer à l'étalon E1]. Part des cartes du carnet : 60 % à l'ouverture (45 situations sur 75) et environ 75 % avec le flux mensuel (30 contre 10 par mois) ; la question C3 propose d'écrire les carnets suivants à trois registres pour que l'entraînement ne reste pas surtout de la production sans choix.

**Les trois registres, en une ligne chacun** (tirés des lettres au format A) :
- **La sûre** : ne vise personne, se ferme toute seule, la conversation reprend sans que l'autre ait à répondre. À choisir quand tu ne connais pas encore l'humour du groupe.
- **La joueuse** : prend la pique au mot et la retourne vers toi ou vers une règle, sans viser quelqu'un. À sortir quand le groupe a déjà ri ensemble.
- **La risquée** : s'adresse à l'autre ou lui rend la parole, elle appelle une réponse et peut sonner comme une provocation si le ton n'est pas complice.

La sûre est une vraie réplique légère. Dans le carnet, la réponse correspond à la joueuse et la « sortie polie » est une quatrième chose : elle garde son nom.

### 2.3 Le stock de la rafale, calculé

**Consommation** : une situation NOUVELLE par jour au plus (le bouton « encore une » sert une carte à revoir ou un autre contexte, jamais une nouvelle). Un abonné qui vient 7 jours sur 7 consomme 30 situations nouvelles par mois.

| Source | À l'ouverture (seuil 7.4) | V1 complète |
|---|---|---|
| Carnet d'octobre et de novembre, cartes « Et toi ? » | 45 | 45 |
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

**Missions en 5 marches** : 1 seul, à voix haute ; 2 à un proche, par message ; 3 à un pote, en face ; 4 dans un petit groupe ; 5 avec quelqu'un qu'on connaît peu. Toujours facultatives, jamais comptées contre l'abonné, **une seule mission ouverte à la fois**. **Critère d'écriture : provocable cette semaine** (on lance la phrase, on n'attend pas qu'un vendeur surgisse) ; sinon la mission est reformulée. Les défis déjà écrits (conseils, vidéos) sont étiquetés par marche dans une table de correspondance séparée : aucun champ des seeds n'est modifié, diff à zéro mot (P0 s11).

**Retour d'une mission** : « Pas essayé », « Essayé, bof », « Essayé, ça a marché » (les 3 valeurs fermées déjà utilisées pour les exercices).

**La marche suivante dépend du retour, pas de la date** :
- « Essayé, ça a marché » : l'espace propose la marche d'au-dessus. **À la marche 5**, une mission libre ou une nouvelle situation à la même marche.
- « Essayé, bof » : même marche, avec une autre situation, la fiche « Quand ça tombe à plat » et un lien vers **Mes questions** (type « Situation à gérer » : « Raconte-nous ce qui s'est passé »).
- « Pas essayé » deux fois de suite : l'espace propose la marche d'en dessous, sans commentaire. **À la marche 1**, une autre situation, jamais un message.
Le calendrier de 4.1 indique la **marche visée**, pas la marche imposée. Un introverti n'est jamais poussé en face parce que c'est mardi.

**Grille d'auto-contrôle de la réplique écrite** (après Comment c'est construit, Formules, jeux d'écriture) : 3 questions oui ou non, rien d'enregistré. (1) Elle tient en une phrase ? (2) Si elle vise quelqu'un, peut-il en rire avec toi ? (3) La fin surprend ?

### 2.5 Ce que le moteur ne fait pas

Aucune relance d'inactivité, aucun e-mail, aucune notification qui culpabilise, aucun classement, aucune note qui sanctionne. La révision n'apparaît que si l'abonné ouvre l'espace.

### 2.6 Mes questions : l'onglet de l'abonné pour l'équipe

**Décisions de Thomas, 12/11** (`founder-preferences.md` l. 164 et 165) : « Qu'il y ait aussi un onglet avec mes questions aussi pour leur espace question. Problème situation à gérer question etc. » puis « Gardons tout en base oui. Vu que c'est leur espace. Ils doivent avoir accès à leur historique ». Elles rouvrent, avec son accord écrit, « rien en base » (25/10) et, pour cette fonction, « aucun texte libre stocké » (07/10, avis @legal C13).

**Ce que c'est** : un onglet (nom de travail « Mes questions », alternative : « Écrire à l'équipe », libellé déjà validé). L'abonné choisit un type en un geste, écrit, envoie, et retrouve **Mes envois** : ses messages, leur statut et les réponses de l'équipe. Il absorbe l'encadré « Ta question à l'équipe » du profil.

**Les trois types, en une phrase chacun**
- **Un problème** : quelque chose ne marche pas ou ne se passe pas comme prévu sur le site (accès, paiement, affichage).
- **Une situation à gérer** : une scène que tu vas vivre ou que tu viens de vivre, et pour laquelle tu veux des idées de réponse.
- **Une question** : tout le reste (comprendre une technique, un contenu, l'offre).
Sous le champ : « Évite les noms : décris la scène. »

**Un seul délai pour tous** : les trois types ont le même engagement, « en général sous 1 à 2 jours ouvrés » (règle du 25/10 ; au plus tard 3 jours ouvrés aux conditions d'utilisation). Aucune promesse de priorité affichée.

**Un seul circuit de réponse** : la réponse de l'équipe est **saisie dans l'outil de l'admin**, **enregistrée** dans l'historique de l'abonné, puis part par **l'e-mail de réponse habituel** (la réponse que l'abonné attend déjà aujourd'hui, signée « L'Équipe Deviens Marrant » : ce n'est pas un nouvel e-mail automatique). Aucune réponse n'est envoyée par e-mail seul : toute réponse faite hors de l'outil y est recopiée, avec la question. Les e-mails d'accueil approuvés E1 (« Réponds à cet e-mail ») et J21 restent inchangés : les réponses qu'ils suscitent sont recopiées dans l'outil de la même façon. L'e-mail J12 approuvé (E1b) porte « Poser ma question : /profil », sans ancre : **`/profil` garde une ligne de lien vers « Mes questions »**, ce qui le laisse vrai. Dans l'espace, « Aujourd'hui » affiche « L'équipe t'a répondu » tant que la réponse n'a pas été ouverte ; aucune pastille sur les onglets (règle du brief §2.6 : pastilles par la cloche seulement, si elle existe).

**Adresses** (à fixer par @fullstack) : l'adresse du compte est **toujours lue en base** (session), jamais saisie ni recopiée d'un message entrant ; c'est elle qui sert de Reply-To sur le message transmis à l'équipe et d'adresse du destinataire de la réponse. Sur l'e-mail de réponse, l'adresse de réponse est celle de l'équipe, pour que l'abonné puisse y répondre ; sa réponse est recopiée dans le même fil.

**Un fil par envoi** : l'abonné peut ajouter un message à un envoi répondu (« Continuer »), l'équipe répond dans le même fil ; chaque nouveau message suit le même engagement de délai et les limites techniques existantes. L'historique est une liste de fils, pas une pile de messages isolés.

**Règles du 25/10 conservées** : réponse **préparée en session, relue et envoyée par l'équipe**, signée « L'Équipe Deviens Marrant », aucune mention d'IA, aucune limite affichée, questions vers alex@deviens-marrant.fr.

**Norme d'une réponse « Situation à gérer »** : d'abord la méthode, puis 1 à 3 répliques **déjà validées** les plus proches (Quoi répondre, carnet, catalogue), avec leur lien. Une réplique neuve seulement si elle passe la relecture à l'aveugle dans le délai ; sinon aucune (« pas de vanne plutôt qu'une vanne moyenne »). Coût compté en 7.3 bis.

**États limites**

| État | Ce que voit l'abonné | Règle |
|---|---|---|
| Aucun envoi | Un exemple de message par type et la phrase sur le délai | jamais un tableau vide |
| Envoi en cours | « Envoi en cours » | le message n'est pas perdu en cas d'échec : il reste dans le champ |
| Envoyé | « Envoyé, l'équipe répond en général sous 1 à 2 jours ouvrés » | |
| Répondu | La réponse, datée ; « L'équipe t'a répondu » dans « Aujourd'hui » ; « Continuer » | le fil reste ouvert |
| En retard | Après 3 jours ouvrés : « L'équipe n'a pas encore répondu, ta demande est bien là » | alerte interne à l'équipe ; on prévient en cas de retard (25/10) |
| Retiré par l'abonné | L'envoi disparaît de son historique | suppression définitive de l'échange (question et réponse) : à confirmer, C10 |
| Abonnement terminé | Historique gardé ; affichage ou non : à confirmer, C10 | le compte est conservé |
| Message sensible | Réponse à la main, sans humour, avec l'orientation vers l'aide officielle (3114) | playbook l. 595 ; même engagement de délai, aucune promesse de priorité |

**Détresse** : une ligne discrète sous le champ pour les messages qui évoquent une détresse n'est pas ajoutée en V1 ; si Thomas la veut, c'est un texte à faire valider.

**Où l'abonné y arrive** (porte unique : l'onglet ; raccourcis) : après « Essayé, bof » ; en bas d'une fiche « Quand ça tombe à plat » (« Ta situation n'est pas dans la liste ? Raconte-la à l'équipe ») ; en fin de séance et de « Comment c'est construit » (« Montre ta réplique à l'équipe », texte préchargé côté navigateur, jamais dans l'adresse) ; depuis « Quoi répondre » quand aucun filtre ne donne de situation. Pas après chaque jeu.

**Ouverture** : « Mes questions » suit la règle commune (7.4) et s'ouvre avec l'espace, pas avant. L'encadré du profil reste en service jusque-là.

**Textes validés à retoucher** (chaque retouche repasse par Thomas ; **phrases déjà écrites par @legal** dans `docs/legal/espace-client-s24-phrases.md`) : `confidentialite/page.tsx` (section 9, puces 1 et 4 ; partie 6, dernier paragraphe ; partie 4, ligne Neon, facultatif) ; `config/textes/question-equipe-s22.ts` (CGU art. 10 : « depuis ton espace (Mes questions) » et « tu retrouves ta question et sa réponse dans ton espace ») ; l'encadré du profil, qui devient une ligne de lien. Base légale : exécution du contrat ; aucune mention d'opposition obligatoire. **Aucun avis juridique supplémentaire n'est recommandé** (décision du 25/10, l. 136 ; « sans alourdir », l. 165).

**Charge de l'équipe (fondateur solo)** [HYPOTHÈSE : de 0 à 1 message par mois et par abonné actif ; aucune mesure, 4 abonnés au 02/11] : à 100 abonnés actifs, environ 5 messages par jour ouvré ; **à l'objectif de 6 mois (environ 503 abonnés, brief §1), environ 25 par jour ouvré**. Garde-fous : message d'attente honnête à l'envoi, seuil d'alerte interne [HYPOTHÈSE : plus de 10 messages en attente], limites techniques existantes. **Leviers** : réponses types tirées des réponses déjà envoyées (toujours relues avant envoi) ; les « Situations à gérer » qui reviennent deviennent des fiches de « Quoi répondre » (jamais reprises telles quelles : anonymisées et avec l'accord de l'abonné, décision du 17/10).

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

Les 4 pièces du moteur ne comptent pas de fiches : elles réutilisent le type 1. Le parcours Boulot (DEBUTANT) n'est pas « plus loin » : c'est le parcours suivant d'un abonné qui vient de Machine à Café.

### 3.3 Quoi répondre (le cœur)

- **Définition** : une scène de la vie courante, trois répliques, la règle pour choisir, l'erreur courante, le geste. Même squelette que le format A des lettres, **jamais le même texte** (décision du 25/10).
- **Carnet et situations, une seule porte** : le carnet est le flux mensuel de cette rubrique (« Nouvelles ce mois-ci » en tête, archive par mois). Une fiche du carnet est une situation à 2 répliques (sa réponse = la joueuse, sa sortie polie), reprise sans modification, signalée « 2 répliques » ; une situation neuve a 3 répliques. `/carnet` garde son URL.
- **Filtres** : « Où et avec qui ? » (coloc, soirée, boulot, amis, famille, couple, rencontre, commerces, transports, voisins) et « Pour quoi faire ? » (désamorcer, répondre à un chambrage, relancer une conversation, rattraper un faux pas). Chemin d'entrée : « Les 5 situations pour commencer » (4.2).
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
- **Exemple de carte « Et toi ? » (production), tiré du carnet (`2026-11-03`)** : « Mardi à la boulangerie, la boulangère emballe ton troisième pain au chocolat de la semaine : "Vous n'aviez pas arrêté le sucre, vous ?" » Ta réponse d'abord. Puis les deux répliques : en ambiance détendue, « Dans toutes les autres boulangeries, je suis irréprochable. » ; en ambiance tendue, « Vous avez bonne mémoire. J'essaie de réduire, et cette semaine, ce n'est pas une réussite. » Puis « Tu avais une réponse tout de suite ? » et le « pourquoi » du carnet. Aucun choix à faire : l'ambiance donnerait la réponse.
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
- **Exemple de fiche, une entrée écrite, alignée sur le glossaire (`glossary.ts` l. 79) [EXEMPLE NON VALIDÉ]** : « Accusé de réception. Une formule courte, "Intéressant", "Pas faux", "Bien vu", que tu dis avant ta vraie réponse : tu gagnes quelques secondes et tu as l'air de réfléchir. En deux temps : il te lance "Tu as encore oublié ton badge ?" ; tu dis "Bien vu.", tu laisses passer deux secondes, puis tu réponds. À ne pas confondre avec : l'excuse ("oui, pardon"), qui répond avant d'avoir pris le temps. Définition complète : /glossaire. »

### 3.6 Formules à détourner

- **Définition** : une expression que tout le monde connaît, que tu dis en entier, comme si de rien n'était, puis que tu fais dérailler sur un détail de ta vie.
- **Persona** : Sophie en cherche une pour clore sa journée de réunions ; Yanis, pour un message de groupe où il veut se glisser sans risque ; Marc, pour un toast léger à un dîner.
- **Format** : 5 minutes, 5 expressions par fiche : la règle, le piège (dérailler avant d'avoir dit l'expression en entier : personne ne la reconnaît), la limite (la seconde phrase tient en une douzaine de mots), le geste d'écriture, une version possible.
- **Volume** : 12 fiches, 60 détournements [HYPOTHÈSE], chacun passe la barre Alexa.
- **Exemple de fiche, deux détournements écrits [EXEMPLE NON VALIDÉ, candidats d'étalon E2 à passer à l'aveugle ; ils sont remplacés s'ils échouent]** :
  - Expression 1 : « Mieux vaut tard que jamais. » Détournement : « Mieux vaut tard que jamais, dit celui qui souhaite un bon anniversaire en mars. »
  - Expression 2 : « Chassez le naturel, il revient au galop. » Détournement : « Chassez le naturel, il revient au galop. Chassez le "on se voit bientôt", il revient chaque fin d'été, intact. »
  - Règle : l'expression en entier d'abord, puis une courte suite qui la tire vers un détail de ta vie.
  - Piège : commencer par le détail ; l'expression n'est plus reconnue et la suite n'a rien à retourner.
  - À toi : choisis une expression, écris la suite qui la fait dérailler sur ta semaine, puis passe la grille.

### 3.7 Écouter, repérer

- **Définition** : un passage court (1 à 2 minutes) d'un humoriste, démonté puis transposé à la vie de l'abonné (le format B des lettres appliqué aux vidéos du site, avec d'autres passages et d'autres textes ; aucun texte de lettre repris).
- **Persona** : Yanis revoit avec ses potes un passage qui l'a fait rire et veut savoir pourquoi la salle part à cet instant ; Sophie veut reprendre un mécanisme pour le pot de départ d'un collègue ; Marc regarde seul le soir et veut une raison de rire qui lui laisse quelque chose à essayer le lendemain.
- **Format** : le passage (minute et seconde exactes), ce que l'artiste fait (3 observations), pourquoi c'est efficace (une idée), ta version à toi, la grille de 2.4.
- **Volume** : 12 en V1, puis 1 à 2 par mois en session [HYPOTHÈSE : 1 par mois sur un an, rythme déjà tenu pour le format B des lettres ; la vérification est le facteur limitant].
- **Règles** : humoristes récents proches de l'audience (25/10), nommés et cités sans réserve (P0 du 05/10), citation réelle et courte, jamais de citation inventée ; citation douteuse = on vérifie, on ne retire pas. Prérequis en 7.5. **L'étalon E4 est le premier à produire des phrases réelles, avant le lot 1.**
- **Exemple [EXEMPLE NON VALIDÉ, structure seule : un passage ne s'écrit qu'après visionnage et vérification]** : passage candidat : Karim Duval, « Génération Y » (le « pourquoi » du seed : détournement de jargon corporate en humour). Minute : [à relever]. À toi : prends un jargon de ton boulot ou de ta fac, dis-le avec un sérieux total, puis ajoute un détail qui le trahit.

### 3.8 Quand ça tombe à plat

- **Définition** : une fiche courte pour la minute d'après : une réplique qui ne prend pas, un silence, une phrase dirigée contre toi. Même structure que Quoi répondre (3 sorties), retrouvée dans « Quoi répondre » avec le filtre « rattraper un faux pas ».
- **Persona** : Yanis, sa vanne tombe à plat devant les colocs et personne ne dit rien ; Sophie, le silence en réunion après sa phrase ; Marc, au dîner, quelqu'un le reprend sur ce qu'il vient de dire.
- **Volume** : 8 fiches, 24 sorties (comptées en 7.3) : le silence après ta vanne, quand ça ne prend pas, quand tu es la cible, quand tu as dit la mauvaise chose, quand on te corrige en public, quand on te coupe, quand tu oublies la chute, quand tu veux sortir de la conversation.
- **Exemple [EXEMPLE NON VALIDÉ, candidat d'étalon]** : « Ta vanne tombe à plat devant les colocs, trois secondes de silence. La sûre : "Celle-là demandait un deuxième café." La joueuse : "Je la garde pour la version deux." La risquée : "Je vous laisse jusqu'à trois pour trouver ça drôle. Un." Pour choisir : la risquée met les autres au défi : réservée aux groupes qui te connaissent, et à dire avec le sourire. » Retour : « Essayé, bof » arrive ici ; « Ta situation n'est pas dans la liste ? Raconte-la à l'équipe » mène à Mes questions.

### 3.9 Jeux

- **Définition** : un défi de 3 à 5 minutes qui fait pratiquer une compétence, avec « ce qu'on aurait pu dire ».
- **Persona** : Yanis, 5 minutes dans le tram avant les cours, sur son téléphone ; Sophie, 5 minutes entre deux réunions ; Marc, un soir chez lui, quand le silence de l'appartement pèse.
- **Familles (30)** : « Quelle réplique ? » (reprend des situations existantes avec un autre contexte, aucune réplique neuve) ; « Finis la phrase » (même mécanique que le défi de l'app, 04/11) ; « Trouve l'angle » ; « Change de registre » ; « Remets la chute » ; « Les pires réponses ».
- **Où ils vivent** : la page « S'entraîner » (jeux, séances, missions), avec une entrée dans le menu « Plus » (6.2) et une carte dans « Aujourd'hui », et un lien « À toi » depuis chaque fiche et chaque étape.
- **Exemple [EXEMPLE NON VALIDÉ] : « Trouve l'angle »** : « Objet : le frigo de la coloc. Note trois choses vraies sur lui, pas des blagues. Ce qu'on aurait pu relever : 1) un pot de moutarde dont personne ne se souvient de l'achat ; 2) une étiquette "ne pas toucher" collée sur quelque chose de périmé ; 3) tout le monde connaît celui qui laisse la porte entrouverte, et personne ne le nomme. L'angle qui travaille le mieux est le troisième : un non-dit que tout le monde partage. La blague vient ensuite, de ce que tu fais de lui. »

### 3.10 Le bilan du parcours

- **Définition** : six questions à la fin d'un parcours : choisir et dire, pas seulement reconnaître.
- **Format** : 4 questions « laquelle de ces répliques convient ? » construites sur des situations **du parcours** avec un contexte (le contexte est le seul texte neuf : 20 en tout), 1 « remets dans l'ordre », 1 « dis-la à voix haute » (déclaré). Retour en phrases, pas de note, pas de seuil, pas de certificat (07/10). Une erreur renvoie vers la fiche à revoir : « celle-là mérite un deuxième tour ».
- **Persona** : Sophie, à la fin de Machine à Café, veut savoir si elle placerait sa vanne au bon moment ; Marc veut une mesure concrète de sa progression, sans note ; Yanis la prend à son rythme, sans public.
- **Volume** : 5, un par parcours, comptés comme fiches du parcours.
- **Deux questions écrites, bilan de Machine à Café [EXEMPLE NON VALIDÉ]** :
  - Question « registre » (réponses A et B tirées du carnet d'octobre, fiche 3 « Le lundi à la machine à café ») : « Le lundi, à la machine à café, un collègue te demande "Tu as passé un bon week-end ?". Il est pressé, son café à la main, il regarde déjà son écran. Laquelle ? A) "Le samedi était excellent. Le dimanche a démissionné vers 15 h." B) "Oui, merci, il était tranquille. Et toi, tu as pu te reposer ?" C) "Alors, samedi : j'ai d'abord pris le bus, puis..." » Retour : « B. Il est pressé : une phrase qui se ferme toute seule. La A demande un collègue qui a le temps de sourire ; la C lui fait rater son café. »
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
| Parcours conseillé (celui du signal, 4.2) | aucun (facultatif) | étape 1 | étape 2 (date conseillée 7 jours après la validation de l'étape 1) | étape 3 ; **bilan seulement si le parcours a 3 étapes (Machine à Café)** ; Répartie en a 4, les autres 6 |
| Mécanisme | « Le faux secret » (Comment c'est construit) | un mot ou deux de Vocabulaire, au choix | | |
| Séance de 20 minutes | | | la première, facultative | |
| Écouter, repérer | | | | le premier, facultatif |
| Mission, marche visée | 1 | 2 | 3 | 3 |
| Mes questions | à tout moment, jamais demandé | idem | idem | idem |
| **Temps maximum, cœur annoncé de l'étape (15 min Machine à Café et Boulot, 20 min Répartie, Confiance, Storytelling)** | rafale 35 + mécanisme 5 = environ 40 min | rafale 35 + étape 15 à 20 + vocabulaire 5 = 55 à 60 min | rafale 35 + étape 15 à 20 + séance 20 = 70 à 75 min | rafale 35 + étape 15 à 20 + écoute 7 = 57 à 62 min |
| **Temps maximum, étape complète (mesurée sur Machine à Café : 24 min)** | 40 min | 64 min | **79 min** | 66 min |

Tout est facultatif sauf le cœur de l'étape ; la rafale est de 3 à 5 minutes par jour, jamais plus (35 minutes par semaine au plus). Ces durées sont posées à Thomas dans C2. La **marche visée** n'est pas une marche imposée : la marche proposée dépend du retour de l'abonné (2.4). **Palier** : P1 = jour 1 ; P2 (« prendre le pli ») = semaines 1 à 4 ; P3 (« aller plus loin ») = après la semaine 4 : situations avec un supérieur ou un inconnu, écoutes, séances, marches 4 et 5, parcours suivant.

**Règle du « jour 7 »** : la date conseillée de l'étape suivante n'existe qu'après une première validation (`nextRecommendedAt`). Pour un abonné sans étape validée, « Aujourd'hui » propose « Commencer l'étape 1 » sans date, jamais « en retard ».

### 4.2 Les signaux qui choisissent l'entrée (le produit ne connaît pas les personas)

**Ce que le produit connaît réellement** :
- **Le lien de retour** (`returnTo`) : l'abonné vient d'une fiche.
- **Le résultat du quiz d'humour, sur le même appareil seulement** : il n'est gardé que dans le navigateur (`localStorage`), jamais en base ni sur le compte. Un abonné qui a passé le quiz sur son téléphone et s'abonne depuis son ordinateur n'a pas de signal. Ce document ne promet rien d'autre : le rattachement du profil au compte est une option (C9 C).

**Priorité** : lien de retour, puis quiz (même appareil), puis la réponse au geste « Où veux-tu être plus à l'aise ? » si Thomas le retient (C9 B), puis la scène par défaut.

| Signal | Situation d'entrée (premier pas) [HYPOTHÈSE, à écrire à l'étalon E1] | Parcours conseillé de la semaine 2 (`quiz-data.ts`) |
|---|---|---|
| Lien de retour : l'abonné vient d'une fiche | cette fiche | le parcours de cette fiche, s'il y en a un |
| Quiz : Observateur | « Tu arrives dans un groupe où tu connais presque personne et on te lance "et toi, tu fais quoi ?" » (terrain de Confiance) | Confiance (INTERMEDIAIRE, 6 étapes, 20 min) |
| Quiz : Storyteller | « Quelqu'un te demande "alors, quoi de neuf ?" » | Storytelling (machine-a-cafe si Storytelling n'est pas publié) |
| Quiz : Absurde | « Le collègue qui lance "ça va ?" à la machine à café » | Machine à Café (DEBUTANT, 3 étapes, 15 min) |
| Quiz : Punchlineur | « La caisse : "Vous avez la carte du magasin ?" » (inspirée du carnet d'octobre) | Répartie (INTERMEDIAIRE, 4 étapes, 20 min) |
| Quiz : Taquin | « Quelqu'un te chambre devant tout le monde en coloc » (la poêle, 3.3) | Répartie |
| **Aucun signal** | **« La caisse »**, scène universelle (ni bureau ni études) | Répartie, étape 1 « Tes premières répliques » (gratuite) : le parcours de la promesse du site (« avoir de la répartie ») et celui de deux profils sur cinq [HYPOTHÈSE ; étape 1 à relire pour un débutant, repli Machine à Café] |

**Les 5 situations d'entrée des 5 profils sont « Les 5 situations pour commencer »** : l'abonné commence par celle de son signal (« La caisse » sans signal), puis reçoit les quatre autres dans un ordre fixe aux jours 2 à 5. Sans signal, « Aujourd'hui » montre en une ligne les quatre autres parcours à la semaine 2 : l'abonné choisit, jamais « choisis un parcours » au jour 1 (cause H2 de l'analyse des résiliations).

La règle du brief §3.2 (n°2 : « la première étape du parcours désigné par le quiz ») est modifiée : le premier pas est une situation d'entrée (5 minutes), l'étape 1 du parcours désigné devient la première étape conseillée (semaine 2). L'événement « aha » du brief (étape validée ou exercice ouvert) devient « Fait » déclaré de la situation d'entrée : à confirmer avec @data-analyst et avec la réponse à Q10 du brief. Le premier pas est le même sur la page de succès et dans « Aujourd'hui ». Part des abonnés qui arrivent avec un signal : inconnue [À VÉRIFIER avec @data-analyst] ; on suppose qu'elle est minoritaire tant que le quiz n'est pas rattaché au compte.

### 4.3 Les personas, cas d'essai recalés sur ce que le produit ferait

Les personas servent à écrire et à tester ; ils ne déclenchent rien. Pour chacun, ce que le produit ferait réellement et la question de test :

| Cas d'essai | Ce que fait le produit | Question de test |
|---|---|---|
| Yanis (coloc, soirées, potes) | Taquin ou Punchlineur sur le même appareil : Répartie ; sans signal : « La caisse » et Répartie | L'étape 1 de Répartie est-elle accessible à un débutant ? Sinon repli Machine à Café |
| Sophie (machine à café, afterwork) | Observateur : **Confiance** (INTERMEDIAIRE, 20 min), alors que son besoin écrit appelle Machine à Café ; Absurde : Machine à Café ; sans signal : Répartie | Confiance est-il bon pour Sophie ? Sinon, le geste de C9 B (« au boulot ») l'envoie vers Machine à Café |
| Marc (reconstruction) | Storyteller : **Storytelling** (INTERMEDIAIRE), alors que son besoin écrit appelle Confiance ; Observateur : Confiance ; sans signal : Répartie | Storytelling convient-il à Marc ? Sinon, le geste de C9 B (« partout ») l'envoie vers Confiance |

On ne touche pas au code du quiz sans décision de Thomas : si ces tests montrent un écart, c'est une question à lui. Aucune relance : si l'abonné n'ouvre pas l'espace, rien ne part. Ce qui l'attend à son retour s'affiche à l'ouverture de « Aujourd'hui ».

### 4.4 Aujourd'hui : règle de priorité

Une seule action principale visible, quatre états (brief §3.2 : maximum 3 actions principales par écran) :
1. **Aucune fiche faite** : le premier pas.
2. **La rafale du jour n'est pas faite** : la rafale du jour (« Si tu as 5 minutes »).
3. **La rafale est faite** : « Reprendre » l'étape en cours (ou « Commencer l'étape 1 » sans date).
4. **Mission ouverte** : lien secondaire, jamais l'action principale.

**Au-dessus de la ligne de flottaison à 375 px** : (a) salutation et repère neutre « 12 cartes cette semaine » (cartes jouées, révisions comprises ; ni série ni points ; affiché seulement à partir d'une carte, jamais « 0 carte ») ; (b) l'action principale ; (c) le contenu du jour (vanne, conseil, vidéo, calendriers déjà préparés). **Deux éléments distincts** : le contenu du jour est conservé tel quel (brief §3.2, bloc 3) ; la situation nouvelle du jour est la première carte de la rafale, pas un bloc supplémentaire. En dessous : « L'équipe t'a répondu » (si une réponse n'est pas lue), S'entraîner (jeux, séances, missions), nouveautés (carnet du mois, date conseillée, lettre du jeudi), « Ton mois ».

**« Ton mois »** (à partir de J25 environ, absent tant que rien n'est fait) : situations jouées, étapes validées, missions tentées, et **la courbe de la répartie** : la part des cartes où l'abonné avait déjà une réponse tout de suite, semaine après semaine, affichée à partir de 10 cartes [HYPOTHÈSE d'illustration : de 2 cartes sur 10 la semaine 1 à 6 sur 10 la semaine 8]. Pas de pente colorée ; texte neutre si elle baisse (2.2). C'est la preuve de progrès de la compétence, pas seulement de l'activité ; elle ne compte ni pour la série ni pour les points. Le détail visuel revient à @design.

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
- **Total de l'étape** : 7 fiches numérotées, plus la fiche 0 commune. **Cœur de l'étape 1** : 15 minutes sans la fiche 0, **17 minutes avec**, si la vidéo 2 passe en « plus loin » ; environ 24 minutes sinon. La promesse affichée de Machine à Café est de 15 min/semaine : le cœur tient à 15 minutes hors introduction et la dépasse de 2 minutes la première fois.
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

**6 entrées au plus, comptées à l'écran** (12/11, Q3 = A) : tout lien visible dans la barre est une entrée, « Plus » compris. « Aujourd'hui » (écran du premier pas, de la rafale et de « Ton mois ») est toujours un onglet. « Mon espace » (Q2 = A) nomme la zone. La barre s'affiche aussi sur les pages publiques pour l'abonné (Q11 = A). **« Mon profil » reste dans le menu de compte, hors des 6**, et mène aux réglages (`/profil`, qui garde une ligne de lien vers « Mes questions »). Libellés en texte ; aucune rubrique vide à l'ouverture ; aucun doublon. **Règle de porte** : chaque contenu a UNE porte principale ; les liens depuis un parcours, une fiche ou « Aujourd'hui » sont des raccourcis vers la même fiche, dont l'état « Fait » est unique. `header-budget.spec.ts` fige les onglets : à mettre à jour avec le libellé validé (@ux, @design).

### 6.2 Trois variantes à 6 entrées, UNE question (C1)

**La contrainte, dite en une phrase** : Thomas a voulu « Mes questions » en onglet (12/11) et, depuis le 10/11, « les sections en haut, vocabulaire etc » ; avec 6 entrées au plus, il faut sacrifier soit le catalogue à un clic, soit « Vocabulaire » en haut. Dans les trois variantes, les jeux, séances et missions sont à deux clics (« Plus », ligne « S'entraîner ») ou depuis la carte d'« Aujourd'hui » : aucune variante ne les met en onglet.

| | A (recommandée) | B | C |
|---|---|---|---|
| Barre | Aujourd'hui, Parcours, Quoi répondre, Vocabulaire et techniques, Mes questions, Plus | Aujourd'hui, Parcours, Quoi répondre, Bibliothèque, Mes questions, Plus | Aujourd'hui, Parcours, Quoi répondre, Catalogue, Mes questions, Plus |
| Vocabulaire, Comment c'est construit, Formules | Onglet visible, trois portes nommées au premier écran | Bloc « Vocabulaire et techniques » de l'onglet « Bibliothèque » | Première ligne de « Plus » |
| Catalogue (vannes, conseils, vidéos, écouter-repérer) | Première ligne de « Plus » | Bloc « Vannes, conseils, vidéos » de l'onglet « Bibliothèque » | Onglet visible |
| **Ce qu'elle sacrifie** | **Le catalogue payé n'est plus à un clic** : « Plus », première ligne, soit deux clics ; sur `/vannes` l'onglet actif serait « Plus » | **Ton mot « Vocabulaire » n'est plus sur la barre** : c'est le titre d'un des deux blocs de « Bibliothèque », un nom générique | **« Vocabulaire » n'est plus en haut** (« Plus », deux clics), contre ta demande d'origine du 10/11 |
| Ce qu'elle garde | « Vocabulaire » en haut (ton mot) ; catalogue à deux clics | Catalogue ET vocabulaire à un clic, via un seul onglet | Catalogue à un clic |

**Reco : A.** « Vocabulaire » reste visible en haut, c'est ta demande d'origine ; le catalogue reste atteignable (« Plus », première ligne). B est la variante pour qui veut garder le catalogue à un clic sans perdre le vocabulaire, au prix du nom. Test des 3 secondes sur rendu sombre (« où irais-tu pour apprendre à construire une vanne ? »), par @ux et @design. **Si Thomas veut les jeux en onglet** : remplacer « Plus » par « S'entraîner » et ranger Favoris, Lettre, Articles et Quiz dans le menu de compte ; cela coûte une des deux lignes ci-dessus (le catalogue ou le vocabulaire passe dans le menu de compte).

**Contenu de « Plus »** (trois blocs ; dans A la première ligne est « Vannes, conseils, vidéos », dans C « Vocabulaire et techniques », dans B aucune) : « S'entraîner » (jeux, séances, missions ; la page est aussi une carte de « Aujourd'hui » et un lien « À toi » depuis les fiches) ; « Mon contenu » : Favoris et notes ; « Le reste » : Lettre (ton inscription du jeudi et la date de la prochaine lettre, rien d'autre), Articles, Quiz d'humour. « Écrire à l'équipe » n'y est plus : c'est « Mes questions ». Lisibilité de la première ligne à tester sur rendu.

**État de la barre à l'ouverture** : seules les entrées dont le seuil de 7.4 est atteint apparaissent ; « Aujourd'hui », « Parcours » et « Quoi répondre » ouvrent avec l'espace ; « Mes questions » ouvre avec l'espace ; l'onglet « Vocabulaire et techniques » (variante A) apparaît au seuil de 6 mécanismes et 4 fiches de vocabulaire ; avant, ses contenus déjà prêts sont dans « Plus » ou absents, jamais un onglet vide. En variante B, « Bibliothèque » ouvre avec le catalogue et ajoute son second bloc au même seuil.

### 6.3 Porte principale de chaque page ou type (variante A)

| Contenu | Porte | Remarque |
|---|---|---|
| Aujourd'hui (rafale, premier pas, cartes) | Aujourd'hui | |
| Parcours, étapes, fiche 0, bilan du parcours | Parcours | Le bilan est la dernière fiche du parcours |
| Quoi répondre, carnet (`/carnet`) | Quoi répondre | URL conservées |
| Quand ça tombe à plat | Quoi répondre (filtre « rattraper un faux pas ») | Lien depuis « Essayé, bof » |
| Vocabulaire, Comment c'est construit, Formules | Vocabulaire et techniques | Un seul glossaire : `/glossaire` public est la vitrine |
| Vannes, conseils, vidéos, Écouter repérer | Plus, première ligne « Vannes, conseils, vidéos » | Deux clics |
| Jeux, séances, missions | Plus, ligne « S'entraîner » | Carte dans « Aujourd'hui », lien « À toi » depuis les fiches |
| Mes questions (envoi, historique, réponses) | Mes questions | Remplace l'encadré du profil |
| Quiz d'humour, Articles | Plus | Articles restent publics (SEO) |
| Favoris, notes | Plus | Notes : Q5b du brief |
| Lettre | Plus | Inscription et prochaine date |
| Mon profil | Menu de compte | `/profil` garde son adresse et une ligne vers Mes questions |

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
| Cartes du carnet « Et toi ? » | 45 cartes de production, 0 texte neuf | 0 | Non | P2 |
| Quand ça tombe à plat | 8 x 3 = 24 sorties | 72, 288 | Oui | P2 |
| Formules à détourner | 60 détournements | 180, 720 | Oui | P2 |
| Jeux d'écriture (Finis la phrase, Remets la chute) | environ 20 chutes | 60, 240 | Oui | P2 |
| Bilans | 0 réplique neuve ; 20 contextes | 40 | Jugement | P2 |
| Mapping : situations d'entrée des 5 profils | 5 situations d'entrée | | Jugement | P1 |
| Étiquetage des défis par marche | défis des 120 conseils et 89 vidéos [À VÉRIFIER : nombre réel] ; table séparée | 1 passe plus 1 relecture | Non | P2, P3 |
| Comment c'est construit, Vocabulaire, Écouter, Séances | 38 fiches de texte | 1 version corrigée chacune | Exemples seulement | P2, P3 |
| **Total de candidates à écrire** | | **environ 1 100 (base) à 3 700 (pire cas)** | | |

Règles : (a) **60 est une cible de situations VALIDÉES, pas une coupe** : si le rendement est bas, on écrit plus de candidates, jamais moins de situations ni une barre abaissée. (b) Une situation peut sortir avec 2 répliques bonnes sur 3. (c) Point de contrôle après le lot 1 de 10 situations : on mesure le rendement réel, on met ce tableau à jour et on le montre à Thomas avant le lot 2. (d) **Relecture préalable du carnet** : 15 fiches d'octobre selon la règle de C8, un tour pour H10 corrigée ; hors du total ci-dessus.

**Chantier de développement en plus du contenu** (@product-manager, @fullstack) : de quoi retenir, par abonné, le résultat de chaque carte, sa réponse à « Tu avais une réponse tout de suite ? » et l'état du compte à rebours ; les retours de mission ; l'état « Fait » par fiche ; les fils, messages et réponses de Mes questions ; un outil pour que l'équipe saisisse ses réponses ; la page « S'entraîner » ; la barre pilotée par les seuils ; selon C9, un signal retenu sur le compte. L'e-mail de réponse existe déjà.

### 7.3 bis Régime mensuel (après l'ouverture)

| Quoi | Par mois | Candidates (base, pire cas) | Relectures à l'aveugle | Lecture de Thomas | Délai |
|---|---|---|---|---|---|
| Carnet | 30 fiches (une réplique chacune, plus pourquoi, sortie polie, exercice) | 60 (2 par fiche, rendement de Boulot) à 360 (12 par fiche, rendement d'octobre) | Selon C8. Plancher : 3 lots de 10, soit 3 x (2 critiques + départage) = 9 passes (méthode d'octobre). Avec C8 A, le nombre de passes n'est pas borné (tours jusqu'à 10/10) ; avec C8 B, 2 avis sur 3 par des relecteurs indépendants | 3 sur 10, soit 9 fiches | Carnet du mois suivant prêt avant le 30 (celui de décembre avant le 30/11, déjà au planning) |
| Situations neuves | 10 (30 répliques, 20 contextes) | 90 à 360 (répliques), 40 (contextes) | 1 lot | 3 fiches | Fin du mois |
| Écouter, repérer | 1 à 2 | vérification de sources | 1 passe | visionnage de 1 à 2 passages | Fin du mois |
| Réponses « Situation à gérer » avec une réplique neuve | à 100 abonnés actifs : environ 8 (40 messages de ce type, dont 20 % avec une réplique neuve) ; à 500 : environ 40 [HYPOTHÈSE] | 24 à 96 ; 120 à 480 | relecture à l'aveugle dans le délai de 1 à 2 jours ouvrés, sinon aucune réplique neuve (2.6) | 0 | 1 à 2 jours ouvrés |
| Mes questions, autres réponses | environ 5 par jour ouvré à 100 abonnés actifs, environ 25 à 500 [HYPOTHÈSE] | réponses types relues | | | 1 à 2 jours ouvrés |
| **Total de candidates par mois** | | **environ 190 à 760, plus 24 à 96 (100 abonnés) ou 120 à 480 (500 abonnés)** | | **environ 12 fiches plus 1 à 2 passages** | |

Si le carnet d'un mois est en retard : la rafale passe à une situation nouvelle un jour sur deux (2.3), l'alerte de stock se déclenche à 30 jours. Ce régime s'ajoute aux lettres du jeudi, qui suivent leur propre régime (25/10).

### 7.4 Ordre de production et seuils d'ouverture

| Ordre | Quoi | Dépend de | Seuil d'ouverture |
|---|---|---|---|
| 0 | Étalons (5) | Thomas | Bloquant |
| 0 bis | Relecture du carnet (1.4, C8) et levée de INV T5 (vidéos) | | Prérequis de 2 et de 5 |
| 1 | Vocabulaire et Comment c'est construit, en parallèle (ils fixent les noms) | E2, E3 | « Vocabulaire et techniques » : 6 mécanismes et 4 fiches de vocabulaire |
| 2 | Quoi répondre : 6 lots de 10, contextes écrits avec les situations | Noms de 1 | **30 neuves validées + carnet** : condition d'ouverture de TOUT l'espace |
| 3 | Découpage des 25 étapes (diff mesuré) ; développement de Mes questions | 2 et modèle de données | Parcours par parcours, Machine à Café d'abord |
| 4 | Jeux et Formules | 2 | Jeux : 10 ; Formules : 4 |
| 5 | Écouter, repérer (lancer tôt) | E4, 0 bis | 4 fiches vérifiées |
| 6 | Quand ça tombe à plat, bilans, séances | 2, 3 | Selon la rubrique |

La production est parallèle ; l'**ouverture** est séquencée : rien ne s'ouvre avant que « Quoi répondre » le soit, **y compris « Mes questions »**, qui s'ouvre avec l'espace (l'encadré du profil reste en service d'ici là). Les autres entrées apparaissent quand leur seuil est atteint.

### 7.5 Prérequis non négociables

(a) Carnet : les vérifications de 1.4 (relecture de H10, diff complet, relecture d'octobre selon C8) avant son entrée dans la rafale. (b) Écouter, repérer : INV T5 levé (Rollman, Haroun, Ngijol, Bun Hay Mean) ; chaque passage visionné et minuté ; chaque citation vérifiée par un relecteur indépendant de l'auteur. (c) Mes questions : les phrases de @legal (`docs/legal/espace-client-s24-phrases.md`) appliquées à la confidentialité et aux conditions d'utilisation avant l'ouverture, puisque « rien n'est conservé » devient faux.

### 7.6 Mesure de la valeur du contenu neuf

Lire une fiche ne laisse aucune trace (INV T4). Le « Fait » par fiche le rend visible. Cibles à poser avec @data-analyst, aucune inventée ici :

| Axe | Événement | Source |
|---|---|---|
| **Compétence (indicateur n°1)** | Part des cartes où l'abonné avait une réponse tout de suite, par semaine, lue avec l'état du compte à rebours | « Tu avais une réponse tout de suite ? » |
| Adoption | Premier pas fait le jour 1 | « Fait » de la situation d'entrée |
| Engagement | Fiches « Fait » par semaine ; cartes jouées ; missions tentées ; envois dans Mes questions | « Fait », état de rafale, retours, messages |
| Rétention | Retour à J7, J30, J60 | Événement serveur d'ouverture |
| Utilité par type | Part des fiches ouvertes dont le geste est fait | « Fait » par type |

Réévaluation d'un type à 60 jours [HYPOTHÈSE de seuil, à fixer par @data-analyst].

---

## 8. Questions pour Thomas (C1 à C10)

Numérotation propre à ce document (« C » pour contenu). Chaque question a 3 options et une reco, sans jargon. Une option qui rouvre une décision déjà prise est marquée « rouvre la décision du JJ/MM ».

**Un mot avant les questions.** Tu avais mis « Guides » en tête de ta capture. Je ne crée pas un type de plus : les 120 conseils du catalogue tiennent ce rôle et chaque fiche neuve les relie. Si tu veux des guides neufs, dis-le. Tranchés sans question : les trois registres « la sûre / la joueuse / la risquée », les humoristes récents nommés, rien d'ouvert aux visiteurs, « Mes questions » ouvert avec l'espace, un seul délai pour tous les types de messages, les phrases juridiques déjà écrites par @legal.

**C1. Quelle barre en haut de l'espace ?** Tu as voulu « Mes questions » en onglet et, depuis le 10/11, « les sections en haut, vocabulaire etc » ; avec 6 entrées au plus, il faut sacrifier soit le catalogue à un clic, soit « Vocabulaire » en haut. Dans les trois variantes les jeux sont à deux clics (« Plus », ligne « S'entraîner ») ; « Aujourd'hui » y est toujours un onglet.
- A. Aujourd'hui, Parcours, Quoi répondre, Vocabulaire et techniques, Mes questions, Plus. **Sacrifie** : le catalogue (vannes, conseils, vidéos) passe en première ligne de « Plus », à deux clics. **Reco** : ton mot « Vocabulaire » reste en haut.
- B. Aujourd'hui, Parcours, Quoi répondre, Bibliothèque, Mes questions, Plus. « Bibliothèque » montre deux blocs : « Vannes, conseils, vidéos » et « Vocabulaire et techniques ». **Sacrifie** : ton mot « Vocabulaire » n'est plus sur la barre, c'est le titre d'un bloc.
- C. Aujourd'hui, Parcours, Quoi répondre, Catalogue, Mes questions, Plus. **Sacrifie** : « Vocabulaire » n'est plus en haut, il passe en première ligne de « Plus », contre ta demande d'origine.
Dans les trois cas, « Mon profil » reste dans le menu de ton compte. Si tu veux les jeux en onglet, il faut remplacer « Plus » par « S'entraîner » et ranger Favoris, Lettre, Articles et Quiz dans ton menu de compte, ce qui coûte une des deux lignes ci-dessus.

**C2. Combien de temps par semaine ?** L'offre promet « 15 à 20 min/semaine » (décision du 29/09, reprise le 07/10). Cette promesse porte sur les parcours. Une étape demande en réalité environ 22 à 25 minutes (mesuré sur Machine à Café). Si l'abonné suit le calendrier, s'ajoutent la rafale (3 à 5 minutes par jour, jusqu'à 35 minutes par semaine), une séance de 20 minutes en semaine 3 et une écoute en semaine 4 : **jusqu'à 40 minutes en semaine 1, 64 en semaine 2, 79 en semaine 3, 66 en semaine 4 si l'abonné fait tout**, de 55 à 75 minutes avec seulement le cœur des étapes. Tout est facultatif sauf le cœur de l'étape.
- A. La promesse vaut pour le cœur des parcours : 15 à 20 minutes, la 2e vidéo et les nouvelles fiches passent en « pour aller plus loin », facultatives. La pratique quotidienne et les séances sont « en plus », facultatives, avec leur durée affichée ; « Aujourd'hui » dit « Si tu as 5 minutes » et ne la présente jamais comme une obligation. Le texte de l'offre ne change pas. Touche le statut de vidéos que tu as choisies (étalons du 07/10, vidéos de Boulot regardées le 11/10) et la phrase « Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz ». **Reco** : elle garde ta promesse sur ce qu'elle couvre, et dit honnêtement que la semaine la plus chargée monte à 79 minutes si tout est fait.
- B. A, et le texte de l'offre dit la promesse des parcours ET mentionne la pratique quotidienne comme un plus : touche des textes validés (offre, `/abonnement`), ton go pour chacun ; aucun chiffre n'est retiré (29/09).
- C. On change la promesse affichée (par exemple « jusqu'à une heure par semaine ») : rouvre la décision du 29/09, reprise le 07/10.

**C3. Veux-tu un entraînement quotidien ?** Une situation nouvelle par jour (3 cartes au plus, 3 à 5 minutes) : tu tentes d'abord ta réponse (rien n'est enregistré, le compte à rebours est facultatif), tu vois les répliques, tu dis si tu avais une réponse tout de suite (trois boutons), puis tu choisis ; les cartes ratées reviennent 2, 7 puis 21 jours plus tard ; des missions montent d'une marche seulement quand la précédente a marché. Rien n'est envoyé, tout se passe quand l'abonné ouvre l'espace. À 30 jours la rafale continue : le carnet mensuel et environ 10 situations neuves par mois suffisent pour 1 par jour. Il faut construire de quoi retenir les choix de chaque abonné : c'est un vrai chantier en plus du contenu. Les fiches du carnet donnent des cartes « Et toi ? » (tu produis ta réponse, tu vois les deux répliques, sans choix), les situations neuves des cartes « Quel registre ? » (tu choisis entre trois) ; le carnet serait 60 % des cartes au début, 75 % ensuite.
- A. Oui, carnet inchangé : les cartes du carnet restent des cartes de production. Aucune décision rouverte. **Reco.** On pourra reposer la question B en janvier, avec la première mesure.
- B. Oui, et les carnets à partir de janvier sont écrits avec trois réponses et deux contextes : rouvre la décision du 03/10 (carnet validé : une réplique par fiche, une sortie polie). L'entraînement converge alors vers le choix entre trois registres, sans retoucher aucun texte existant.
- C. Non : des fiches et des parcours, pas d'entraînement quotidien.

**C4. La série, les points et « Fait » ?** Aujourd'hui la série compte les jours où l'abonné valide une étape ou termine un quiz d'étape ; les points viennent des étapes et du bonus de fin. « Fait » par fiche, déclaré par l'abonné quand il a fait le geste, est le défaut proposé (c'est la Q5 du brief). Dans tous les cas, la courbe « avais-tu une réponse tout de suite ? » est affichée dans « Ton mois » comme simple mesure, sans effet sur la série ni les points.
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

**C7. Niveaux et sixième parcours ?** Dans les données, les niveaux sont DEBUTANT et INTERMEDIAIRE (Machine à Café et Boulot DEBUTANT ; Répartie, Confiance, Storytelling INTERMEDIAIRE). Le parcours par défaut sans signal est Répartie, qui est INTERMEDIAIRE.
- A. Un ordre conseillé « Tes 4 premières semaines » en tête de « Parcours », les niveaux actuels, des fiches « pour aller plus loin » sans nom de niveau. **Reco.**
- B. A, plus un niveau « avancé » créé : ajoute une valeur au code et aux libellés, accord requis.
- C. A, plus un sixième parcours débutant sur la répartie : rouvre les textes validés qui disent « les 5 parcours » (offre, e-mails approuvés) et prolonge la roadmap du 07/10.

**C8. Jusqu'où itérer chaque contenu avant qu'il te soit montré ?** Le 12/11 tu as demandé d'itérer « chaque étape jusqu'à 10 », relecture à l'aveugle, 10/10 chez tous les relecteurs. Cela vaut-il aussi pour le carnet déjà écrit que l'espace reprend ? Octobre a été relu par deux critiques, mais dix des quinze répliques n'ont qu'un seul critique indépendant (l'autre voix est celle de l'orchestrateur) ; novembre est à 10 sur 10 sauf la fiche H10, corrigée depuis et jamais relue.
- A. 10/10 chez tous, sans limite de tours, pour tout contenu neuf de l'espace ET pour le carnet repris (octobre relu à cette règle, H10 relue, avant l'entrée dans la rafale). C'est la décision du 12/11 prise à la lettre : elle a déjà remplacé « 2 avis sur 3 » pour les contenus de l'espace. En revanche, relire octobre peut faire corriger des fiches que tu as validées le 03/10 : **toute fiche du carnet corrigée te revient avant de reprendre sa place**, comme les lettres. Risque dit en clair : une boucle quand les relecteurs ne s'accordent pas sur une réplique drôle ; tu peux l'arrêter à tout moment. **Reco.**
- B. 10/10 chez tous pour les 5 étalons et le premier lot de chaque type, puis « 2 avis sur 3 au niveau » (règle du 08/10) pour la suite ; carnet : octobre relu à 2 avis sur 3 par des relecteurs indépendants, H10 relue, fiche corrigée = te revient. Touche ta décision du 12/11 pour la production en série.
- C. A, avec une limite de 4 tours [HYPOTHÈSE] : si les relecteurs ne s'accordent pas, on te montre les deux versions et leurs notes, et la réplique la plus faible peut sortir. Touche ta décision du 12/11 (limite de tours).

**C9. Comment l'espace sait-il ce que veut l'abonné ?** Aujourd'hui le résultat du quiz d'humour n'est gardé que dans le navigateur : un abonné qui l'a passé sur son téléphone et s'abonne depuis son ordinateur n'a aucun signal. L'espace ne sait presque rien de lui. Sans signal, il reçoit la scène « La caisse » et le parcours Répartie.
- A. Rien de plus : le quiz (même appareil), le lien de retour, sinon la scène par défaut. Aucune donnée en plus. 
- B. A, plus, juste après le premier pas, un seul toucher : « Où veux-tu être plus à l'aise ? » (entre potes, au boulot, partout). Ce n'est pas un choix de parcours : c'est un signal, retenu sur le compte (un choix parmi trois, aucun texte), qui oriente la semaine 2 vers Répartie, Machine à Café ou Confiance. Une phrase à ajouter à la confidentialité, au plus court. **Reco** : il marche sur tous les appareils et corrige le cas de Sophie et de Marc.
- C. A, plus le résultat du quiz rattaché au compte (le profil, un choix parmi cinq, gardé en base) : l'entrée par le quiz marche sur tous les appareils. Même phrase à ajouter.

**C10. « Mes questions » : trois points à confirmer.** Tu as décidé le 12/11 de tout garder en base, avec l'historique visible. La réponse de l'équipe est saisie dans l'outil, enregistrée, puis part par l'e-mail de réponse habituel, avec un seul délai pour tous. Les phrases de confidentialité et des conditions d'utilisation sont déjà écrites par @legal (`docs/legal/espace-client-s24-phrases.md`) ; aucun avis supplémentaire n'est recommandé. Restent : combien de temps on garde, ce que devient l'historique quand l'abonnement s'arrête, et le droit de retirer un envoi.
- A. Gardé tant que le compte existe, effacé avec lui (c'est la durée écrite par @legal) ; après la résiliation le compte est conservé et l'historique reste lisible depuis « Mon profil » ; l'abonné peut retirer un envoi (l'échange est supprimé). **Reco** : c'est son espace.
- B. Même durée et même retrait, mais après la résiliation l'historique est gardé sans être affiché (il réapparaît à la réabonnement).
- C. Gardé 6 mois après le dernier échange (durée des e-mails de questions, 25/10), retrait possible, accès fermé après la résiliation : contredit en partie « accès à leur historique » du 12/11.
Si tu veux malgré tout un avis juridique d'un avocat (le brouillon de @legal le propose « si Thomas le souhaite »), c'est une option qui rouvre ta décision du 25/10 (« pas de nouveaux avis ») : dis-le et on le demande.

---

## 9. Étalons à calibrer avec Thomas en premier (5)

Chaque étalon est relu à 10/10 chez tous les relecteurs à l'aveugle avant de t'être montré, puis Thomas choisit entre 2 versions. Les noms de rubriques, de registres et de l'onglet « Mes questions » sont présentés en même temps, en rendu sombre.

| # | Étalon | Ce qu'il fixe |
|---|---|---|
| E1 | Une situation « Quoi répondre » complète (3 répliques, règle, erreur, geste, 2 contextes) à partir du candidat de 3.3 ou d'un meilleur, plus les 5 situations d'entrée (4.2, dont « La caisse » par défaut) | La voix de l'espace, le niveau des 60 situations, la part de contextes gagnés par la risquée, les 5 entrées |
| E2 | Une fiche « Comment c'est construit » (le faux secret) et une fiche « Formules à détourner » (3.6) | L'absence de ton scolaire, la grille de retour, le niveau des détournements |
| E3 | Une fiche de Vocabulaire (5 mots, entrée de 3.5) | Le niveau de jargon, le lien avec le glossaire public |
| E4 | Une fiche « Écouter, repérer » sur un humoriste récent choisi par Thomas, avec des phrases réelles | Le choix des humoristes, le degré de découpage, la vérification |
| E5 | Une carte « Quel registre ? » et une carte « Et toi ? » (ordre : ta réponse d'abord, répliques, « Tu avais une réponse tout de suite ? », choix, règle ; défaut du compte à rebours ; ordre de tirage), une mission avec ses retours qui font monter ou non la marche, une question de bilan, l'écran « Mes questions » (3 types, fils, états) | Le chrono, l'interaction, la progression, le ton de « Ce qu'on aurait pu dire », le libellé de l'onglet |

---

## Annexe A. Traitement de chaque correction

Sigles : UX4 = `tour-4-ux.md` (P1 à P9), RE4 = `tour-4-reviewer.md` (P1 à P12), EL4 = `tour-4-elon.md` (M1 à M10). « Appliqué » renvoie à la section de ce document.

### A.1 Corrections du tour 4

| Correction | Traitement |
|---|---|
| UX4 P1, RE4 P1, EL4 M3 table signal vers parcours contraire au code du quiz ; cas d'essai faux | Appliqué : 4.2 (table au code : Observateur Confiance, Storyteller Storytelling, Absurde Machine à Café, Punchlineur et Taquin Répartie) ; 4.3 recalé avec la question de test de chaque cas ; temps recalculé par parcours et bilan seulement pour Machine à Café (4.1) ; conservation du quiz dite (navigateur seulement) et option de rattachement posée en C9 ; question de l'Observateur posée en 4.3 et C9 |
| UX4 P1 (4) comment le quiz arrive au compte | Appliqué : il n'y arrive pas (`localStorage`) ; ce document ne promet que « même appareil » ; C9 B et C |
| EL4 M4 le persona principal entre par le bureau sans signal | Appliqué : scène par défaut universelle « La caisse » ; parcours par défaut Répartie [HYPOTHÈSE, étape 1 à relire pour un débutant] ; geste « Où veux-tu être plus à l'aise ? » en C9 B |
| UX4 P2, RE4 P12 temps hebdomadaire non posé à Thomas | Appliqué : C2 réécrite (promesse des parcours contre temps réel, 79 minutes en semaine 3, rafale comprise, options marquées, libellé « Si tu as 5 minutes ») ; 4.1 avec deux lignes de temps |
| UX4 P3 contradiction « en priorité » et même délai ; suivi ; Reply-To | Appliqué : un seul délai (2.6) ; un fil par envoi avec « Continuer » ; adresse du compte lue en base, adresse de l'équipe sur l'e-mail de réponse |
| UX4 P4, RE4 P5, EL4 M5 C10 : avis non marqué, trois décisions empilées | Appliqué : C10 réduite à la durée, au sort après résiliation et au retrait ; phrases juridiques déjà écrites par @legal, aucun avis recommandé ; l'avis n'existe plus que comme option qui rouvre le 25/10 ; playbook l. 595 cité à la place du [À VÉRIFIER] |
| UX4 P5, RE4 P2, EL4 M8 reco C1 inexacte, mot « Vocabulaire » | Appliqué : la reco A garde « Vocabulaire et techniques » en haut ; ligne « Ce qu'elle sacrifie » honnête pour chaque variante ; contrainte dite en une phrase ; aucun « à un clic » faux ; coût d'un onglet « S'entraîner » dit |
| UX4 P6, RE4 P6 base de relecture du régime mensuel | Appliqué : 7.3 bis (plancher de la méthode d'octobre ; non borné avec C8 A ; 2 avis sur 3 avec C8 B) |
| UX4 P7, RE4 P10, EL4 M10 détournements, risquée du rattrapage | Appliqué : deux détournements nouveaux (3.6), risquée remplacée (3.8) ; ils restent des candidats d'étalon à passer à l'aveugle ; E4 premier à produire des phrases réelles (3.7) |
| UX4 P8 révision et courbe | Appliqué : les cartes en trop glissent au lendemain, jamais d'arriéré ; courbe affichée à partir de 10 cartes, texte neutre si elle baisse, pas de pente colorée (2.2) |
| UX4 P9 renumérotation, « Plus », Bibliothèque | Appliqué : C1 à C10 sans trou ; première ligne de « Plus » à tester sur rendu ; ouverture de l'onglet au seuil (6.2) |
| RE4 P3, EL4 M2 cartes du carnet : l'étiquette donne la réponse | Appliqué : cartes « Et toi ? », cartes de production sans étape de choix, révision seulement sur « Rien » (2.2, 3.3, C3) |
| EL4 M1 ordre de la carte | Appliqué : ta réponse d'abord, répliques, « Tu avais une réponse tout de suite ? », choix, règle (2.2, C3, E5) |
| EL4 M7 mesure sans compte à rebours | Appliqué : formulation « tout de suite », état du compte à rebours enregistré (2.2, 7.6) |
| EL4 M6 répliques des réponses « Situation à gérer » | Appliqué : norme (méthode, 1 à 3 répliques déjà validées avec lien, réplique neuve seulement si relue à l'aveugle dans le délai) en 2.6 ; ligne dans 7.3 bis |
| EL4 M9 cas limites des missions | Appliqué : marche 5, marche 1, une seule mission ouverte (2.4) |
| RE4 P4 e-mail J12 | Appliqué : E1b renvoie à `/profil` sans ancre, `/profil` garde un lien vers Mes questions ; E1 et J21 inchangés, leurs réponses recopiées (2.6) |
| RE4 P7 C8 A | Appliqué : toute fiche du carnet corrigée revient à Thomas avant de reprendre sa place |
| RE4 P8 [À VÉRIFIER] levés | Appliqué : quiz, playbook (sans humour), annexe B nettoyée |
| RE4 P9 Accusé de réception | Appliqué : exemple aligné sur la formule dite du glossaire (3.5) |
| RE4 P11 bilan sur la poêle | Appliqué : bilan de Machine à Café, réponses tirées du carnet d'octobre fiche 3 (3.10) |
| Arbitrages de la session 1 à 6 | Appliqués : voir 4.2, 6.2, C2, 2.2, 2.6, C10 |

### A.2 Restes partiels des tours précédents

| Reste | Traitement |
|---|---|
| UX3 M4 sélecteur de scène d'entrée | Corrigé : voir UX4 P1 |
| UX3 M7 base juridique | Corrigé : phrases de @legal, aucun avis recommandé (C10) |
| UX3 M9 temps hebdomadaire | Corrigé : C2 |
| UX3 M13, UX2 N9, EL2 N14 ligne « Carnet » du tableau 1.1 d'INV | Refus d'en modifier le contenu : le document est celui de @product-manager. T3 est corrigé par la session et 1.4 s'aligne dessus ; la ligne « Carnet » du tableau 1.1 reste à vérifier par lui |
| EL3 N5 carnets suivants à trois registres | Maintenu en option marquée (C3 B), pas par défaut |
| UX2 N16 Guides | Refus maintenu et dit à Thomas (3.1, section 8) |
| UX1 panneau « Plus » et budget d'en-tête | Refus valable maintenu : le dessin reste à @ux et @design |
| 264 décryptages pour 149 vannes actives | Hypothèse de décryptages de vannes retirées, non vérifiée en base [À VÉRIFIER] |

## Annexe B. Ce qui reste inconnu

- Relecture du carnet : tour de relecture de H10 corrigée ; diff complet de `2026-11.json` ; relecture d'octobre et de ses champs non relus ; ligne « Carnet » du tableau 1.1 d'INV.
- Part des abonnés qui arrivent avec un signal (lien de retour ou quiz sur le même appareil) : avec @data-analyst.
- Étape 1 de Répartie à relire pour un débutant (parcours par défaut sans signal).
- Découpage exact des 4 autres parcours ; nombre de défis par conseil et par vidéo.
- Rendement réel des répliques en situation : mesuré au lot 1 (7.3).
- Nombre exact de lettres au format A ; valeur de Q10 et de Q5 du brief.
- Cible de la mesure d'usage : avec @data-analyst.
- Application des phrases de @legal aux fichiers `confidentialite/page.tsx` et `question-equipe-s22.ts` (hors de ce document).

## Annexe C. Agents spécialisés recommandés (angle mort vérifiable seulement)

| Agent | Type | Rôle | Justification | Priorité |
|---|---|---|---|---|
| Testeur-persona (cas d'essai Yanis, Sophie, Marc) | testeur | Lire 3 fiches de chaque type, jouer la rafale (avec et sans compte à rebours) et « Mes questions », dire ce qui sonne cours ou pèse, et jouer les questions de test de 4.3 | Le risque n°1 (ton scolaire, pression du chrono, mauvais aiguillage) ne se voit pas à l'écriture | Haute |
| Relecteur humoriste à l'aveugle | expert domaine | Noter répliques, détournements, sorties sur la barre Alexa | 180 répliques, 24 sorties, 60 détournements, plus le régime mensuel et les réponses « Situation à gérer » | Haute |
| Vérificateur de citations | expert domaine | Source, minute, exactitude (prérequis 7.5) | Règle anti-invention, humoristes récents | Haute |

Handoff vers @agent-factory si Thomas valide le périmètre.
