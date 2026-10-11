# Conseils (seed 65) : rapport de réécriture s11, passe finale (29/09/2026)

> Sortie : `docs/copy/contenus-s11/conseils.jsonl`, 65 lignes, une par conseil, champs `content` / `example` / `exercise` complets.
> Intouchables respectés : `id`, `title`, `category`, `difficulty` (absents du JSONL, donc non modifiés), `previousTitle` (id 6) non touché.
> Contrôles : les 65 lignes passent une regex JSON stricte (structure + échappements) ; aucune occurrence de « IA / robot / algorithme / coach / ChatGPT » dans les champs publiés (les seules occurrences sont dans `motif`, qui décrit ce qui a été retiré) ; chaque nouvelle vanne a été vérifiée par Grep contre `blagues-seed.json` et `blog-articles.ts`.
> Référentiel : charte s11 §3 (vannes) et §5 (textes), [CHOIX UTILISATEUR] du 29/09 (chiffres intouchables, vannes connues = faibles, améliorer sans amputer).

## Synthèse

- **59 exemples sur 65 réécrits (91 %)**. Ce taux dépasse la fourchette de 30 à 60 % attendue pour le blog. Raison : l'audit indépendant notait les conseils 4,5/5 sur la voix, mais sans passer les exemples à la barre « blague connue ailleurs ». Or une bonne partie étaient des classiques d'Internet : aspirateur qui prend la poussière, avocat pour mon divorce, détecteur de fumée qui sert de minuteur, poisson rouge Wifi, « pas paresseux, en mode économie d'énergie », le cactus, Physiquement/Mentalement/Émotionnellement, chocolatine, IKEA en suédois, Uber Eats…
- **6 exemples gardés mot pour mot** : 26 (tartare), 28 (chat devant la porte), 60 (routine), 63 et 64 (descriptions de timing), 65 (« Sinon on mange. »). S'y ajoute une réplique sur trois au n° 68 (« Je refais surtout mes placards »).
- **Collisions évitées avec l'existant** : n° 4 (« T'es toujours en retard » + rebond sur « toujours », déjà au blog), n° 10 (vocaux de la mère, déjà au catalogue), n° 23 (« spontané avec préavis », déjà au blog), n° 62 (« pot de départ », déjà au catalogue).
- **Règles appliquées au texte** :
  - CAPITALES d'emphase retirées. Le préfixe « DÉFI [NOM] : » est gardé, car c'est un format imposé par le code (gate G-T2, `tip-agent.ts`).
  - Clichés retirés : super-pouvoir, sweet spot, BAM, « c'est la mort », « vaut mille mots », « au final être authentique ».
  - « mémorise » remplacé par « ressortir » ou « garde ».
  - « le mec drôle » rendu neutre.
  - Chaque exercice est démarrable aujourd'hui, avec un critère de réussite quand il en manquait un.
- **Deux incohérences de fond corrigées** :
  - n° 7 : le texte recommandait les homophones, ce qui contredit la charte §3 (pas de calembour phonétique).
  - n° 36 : l'exemple se moquait des cultures étrangères, alors que le conseil dit exactement l'inverse.

## Inventaire (id | verdict | motif)

| id | Verdict exemple | Motif |
|---|---|---|
| 1 | RÉÉCRIRE | Chute yoga « je suis tombé » prévisible ; CAPITALES ; critère ajouté |
| 2 | RÉÉCRIRE | Détecteur de fumée = minuteur : blague d'Internet (déjà retirée de la page n°1) |
| 3 | RÉÉCRIRE | « allô », télécommande, « revérifier l'heure » : observations usées |
| 4 | RÉÉCRIRE | « Vous êtes en avance sur mon emploi du temps » : réplique connue ; setup déjà au blog |
| 5 | RÉÉCRIRE | Avocat / divorce : calembour de double sens archi-connu ; « BAM » |
| 6 | RÉÉCRIRE | Callback GPS faible |
| 7 | RÉÉCRIRE | Proverbe détourné laborieux ; le texte prônait les homophones |
| 8 | RÉÉCRIRE | Poisson rouge Wifi, classé FAIBLE par l'audit |
| 9 | RÉÉCRIRE | « C'était des excuses » : même formule que la vanne n°9 du blog |
| 10 | RÉÉCRIRE | « Téléphone en congé maladie » convenu ; thème mère + messages déjà au catalogue |
| 11 | RÉÉCRIRE | Pain du confinement = matériau de construction : blague connue |
| 12 | RÉÉCRIRE | « Les restaurants te notent » : concept très vu |
| 14 | RÉÉCRIRE | Escalade sans marche intermédiaire ; « TED talk à mes plantes » |
| 15 | RÉÉCRIRE | L'exemple était un schéma, pas une réplique |
| 17 | RÉÉCRIRE | « Compte remarquable » : double sens flou qui s'explique lui-même |
| 18 | RÉÉCRIRE | L'exemple était une consigne, pas une réplique |
| 20 | RÉÉCRIRE | Non-dit qui ne mène à aucune conclusion |
| 22 | RÉÉCRIRE | « La table avait soif » : réplique très entendue |
| 23 | RÉÉCRIRE | Gag physique déconnecté de la montée |
| 24 | RÉÉCRIRE (même idée) | Audit du frigo resserré ; exercice démarrable aujourd'hui |
| 26 | GARDER | Tartare : vraie fausse naïveté ; seul l'exercice est retouché |
| 27 | RÉÉCRIRE | Gabarit « tellement silencieux que… » + formule mème |
| 28 | GARDER | Chat devant la porte : image juste ; seule la prose est retouchée |
| 29 | RÉÉCRIRE | « Je me suis envoyé un like » : faible et daté |
| 30 | RÉÉCRIRE | Twist Uber Eats connu |
| 31 | RÉÉCRIRE | « Je la remets au four » / « test du sens de l'humour » : classiques |
| 32 | RÉÉCRIRE | Général / bataille de Normandie lourd ; « espionne russe » (risque de viser un groupe) |
| 33 | RÉÉCRIRE | Contenait « algorithme » ; observation « lents devant / pressés derrière » usée |
| 36 | RÉÉCRIRE | Se moquait des Londoniens et des serveurs français, soit l'inverse du conseil |
| 37 | RÉÉCRIRE | Aspirateur qui prend la poussière : calembour classique |
| 38 | RÉÉCRIRE | Cactus : réplique connue, doublon avec le 55 |
| 39 | RÉÉCRIRE | IKEA « en suédois » : vanne d'Internet |
| 40 | RÉÉCRIRE | Check contre poignée de main : malaise rebattu, sans monologue intérieur |
| 41 | RÉÉCRIRE | GPS passif-agressif : idée très répandue |
| 42 | RÉÉCRIRE | « Pas de vieillir ensemble » : formule virale, classée FAIBLE par l'audit |
| 43 | RÉÉCRIRE | « Mode économie d'énergie » : mème |
| 44 | RÉÉCRIRE | L'exemple était un schéma |
| 45 | RÉÉCRIRE | Bocal de cornichons : chute attendue |
| 46 | RÉÉCRIRE | Cliché « au final, être authentique » ; méthode déplacée dans l'exercice |
| 51 | RÉÉCRIRE | « Réunion pour décider d'une réunion » : cliché de bureau |
| 52 | RÉÉCRIRE | « Out of the box → définir la box » : convenu |
| 53 | RÉÉCRIRE | « Mauvais chiffres en petit » : évoque une manipulation, risqué en contexte pro |
| 54 | RÉÉCRIRE | « Parfait c'était complet », « Suivante » : formules connues |
| 55 | RÉÉCRIRE | Cactus, Netflix / thérapie, « changé de miroir » : connus |
| 56 | RÉÉCRIRE | Gabarit Physiquement/Mentalement ; formule « de l'espoir » |
| 58 | RÉÉCRIRE | « Conseil municipal / défense nationale » : image confuse |
| 60 | GARDER | Routine concrète ; retouches de forme |
| 61 | RÉÉCRIRE | Chute « mon appart a pas changé » sans retournement |
| 62 | RÉÉCRIRE | « Phase 2 du régime » lourd ; « qualité #1 du mec drôle » |
| 63 | GARDER | Description de timing ; « sweet spot » et CAPITALES retirés |
| 64 | GARDER | Retouches CAPITALES / prose |
| 65 | GARDER | « Sinon on mange. » original ; CAPITALES retirées |
| 66 | RÉÉCRIRE | Chocolatine : débat le plus rebattu de France |
| 67 | RÉÉCRIRE | « Je cherche la télécommande » : image paresseuse |
| 68 | RÉÉCRIRE (2/3) | Netflix / chat / plantes : clichés ; placards gardés |
| 69 | RÉÉCRIRE (même idée) | Modem-méditation très vu ; chiffres gardés |
| 70 | RÉÉCRIRE | « Arctique ou morgue / autopsie » : morbide et trop long |
| 71 | RÉÉCRIRE | « Comme un robot » (règle IA) ; chute ghosting faible |
| 72 | RÉÉCRIRE (même idée) | Chute « pugilat » attendue |
| 73 | RÉÉCRIRE | « Œuvre d'art » convenu |
| 74 | RÉÉCRIRE | « 3 épisodes de Netflix », « groupe de soutien » : usés |
| 75 | RÉÉCRIRE | « Test ophtalmologique » : très vu |
| 76 | RÉÉCRIRE | « Ta copine sait que t'es là ? » : pique connue et un peu méchante |
| 77 | RÉÉCRIRE | Chute « mardi prochain » confuse |
| 78 | RÉÉCRIRE (même scène) | Chute « les Pépito aussi » plate |

## 5 meilleurs avant / après

| id | Avant | Après |
|---|---|---|
| 5 | « L'autre jour au supermarché, je cherchais les avocats. […] 'Non, je cherche un avocat pour mon divorce.' […] 'Rayon 7, entre les couteaux et les valises.' » | « Dimanche, je cherche mes clés partout. Je vide mon sac, je soulève les coussins, j'appelle ma mère pour savoir si elle les a vues. Elle habite à Lyon. Je finis par les retrouver dans le frigo, à côté du beurre. Le plus inquiétant, c'est que le beurre, lui, je l'ai jamais retrouvé. » |
| 20 | « Mon ex m'a dit qu'il me trouvait changé. J'ai répondu... enfin, j'ai rien répondu. Mais dans ma tête... » | « J'ai montré mon premier tatouage à mon père. Il l'a regardé longtemps. Il a ouvert la bouche, il l'a refermée. Puis il m'a demandé si je voulais un café. » |
| 33 | « Pourquoi les gens qui conduisent lentement sont toujours devant toi […] l'univers avait un algorithme pour maximiser ta frustration. » | « Pourquoi un simple « t'as deux minutes ? » suffit à faire défiler toute ta vie ? Personne a jamais été convoqué pour un compliment. » |
| 36 | « À Londres, j'ai commandé 'un café'. Le barista m'a posé 47 questions. En France, le serveur te pose une seule question : 'Quoi ?' » | « À Londres, j'ai voulu commander un café en anglais. J'avais répété ma phrase tout le long de la file. Le barista m'a répondu en français. J'ai continué en anglais, par fierté. » |
| 51 | « Encore une réunion de 45 minutes pour décider qu'on fera une autre réunion. […] » | « Ça fait des semaines que le mug « Meilleur collègue du monde » traîne dans l'évier. Personne le lave. Je crois que personne veut assumer le titre. » |

## Chiffres signalés (Thomas tranche)

**Chiffres qui disparaissent parce que la vanne qui les portait a été remplacée.** Même logique que la page n°1 validée, où « 10 % / 90 % » a été remplacé par « 1 274 en 3 ans ». Aucun chiffre de `content` ou d'`exercise` n'a été retiré.
- 3 : « 3 secondes » (revérifier l'heure)
- 36 : « 47 questions »
- 51 : « réunion de 45 minutes »
- 68 : « 3 plantes »
- 77 : « réunion à 14h »

Si Thomas veut les conserver, il suffit de reprendre l'ancien exemple.

**Changements de forme, valeur inchangée :**
- 65 : « 0.3 » devient « 0,3 » (virgule décimale).
- 62 : « #1 » devient « numéro un ».
- 24 : « Jour 1 / Jour 2 / Jour 3 » devient « aujourd'hui / demain / après-demain », selon la charte §5 (anti-scolaire). La durée « (3 jours) » est conservée.

**Petits chiffres comiques ajoutés dans de nouvelles vannes** (détails de récit, pas des statistiques) :
- 1 : « une heure »
- 12 : « il y a trois ans »
- 31 : « dans dix ans »
- 33 : « deux minutes »

**Statistiques douteuses conservées telles quelles :**
- 1 : « 50% de l'humour passe par le non-verbal »
- 9 : « 80% du travail »
- 54 : « 80% des situations »
- 71 : « 90% des gens »
- 32 et 58 : « 10 fois plus »

Aucune source n'est citée pour ces chiffres. Ils sont gardés conformément au [CHOIX UTILISATEUR].

## Humoristes : affirmations à vérifier (toutes conservées)

Aucune citation verbatim n'est attribuée à un humoriste, ni avant ni après. Seules des descriptions de technique sont présentes.

- **26 : « Lilia Benchabane »**. Je ne peux confirmer ni l'identité de cette humoriste ni l'affirmation qui l'accompagne. C'est le point le plus à risque : à vérifier en priorité, ou à remplacer par un nom sûr.
- **60** : « Panayotis Pascot note des observations chaque jour dans son téléphone ». C'est un fait biographique précis, invérifiable ici.
- **6** (Élodie Poux et les callbacks), **31** (Tania Dutel et les rattrapages en live), **10** (Kev Adams parlant de sa mère), **61** (Kev Adams et ses apartés en interview) : affirmations plausibles, non vérifiées.
- **23** : « Paul Mirabel suit cette structure religieusement dans chaque sketch » est devenu « Les histoires de Paul Mirabel suivent souvent cette mécanique à la lettre ». La généralisation absolue était invérifiable. C'est la seule affirmation modifiée : à valider par Thomas.
- **3** : Seinfeld est conservé (la référence est exacte). L'audit proposait de le remplacer par un humoriste français ; non fait, en vertu de « améliorer, pas amputer ».
- **Références « legacy »** conservées : Jamel (9, 18) et Florence Foresti (17, 24, 28). La règle s7 « zéro Jamel/Gad/Foresti » visait les articles de blog. Il faut décider si elle s'applique aussi aux conseils.

## Points d'attention pour l'intégration (hors périmètre, aucun fichier modifié)

- `docs/content/conseils-seed.json` n'est **pas** modifié. Il faut appliquer le JSONL au seed, puis à la base de prod. Les ids du seed ne correspondent pas aux CUID de prod : il faudra faire le rapprochement par `title`, comme pour les vannes.
- La prod compte environ 400 conseils. Ce lot ne couvre que les 65 du seed ; les conseils générés au quotidien ne sont pas concernés.
- `project-context.md` (historique des interventions) n'a pas été mis à jour, parce que la consigne interdisait de toucher un autre fichier. C'est à faire par l'orchestrateur.

---
**Handoff → @orchestrator**
- Fichiers produits : `docs/copy/contenus-s11/conseils.jsonl` (65 lignes) et `docs/copy/contenus-s11/conseils-rapport.md`.
- Décisions prises :
  - Barre §3 appliquée sans complaisance : toute vanne connue ailleurs a été remplacée.
  - Format « DÉFI [NOM] : » conservé (gate G-T2).
  - Chaque exercice démarre aujourd'hui.
  - Tutoiement, pas de « coach », pas de mention d'IA.
- Points d'attention : décisions à obtenir de Thomas sur « Lilia Benchabane » (26), la reformulation Mirabel (23), les 5 chiffres d'anciennes vannes et les références legacy.
---
