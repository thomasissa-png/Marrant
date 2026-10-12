# Liens contextuels S4 (maillage s20) : verdicts, phrases et emplacements

> Livrable @copywriter, 12/10/2026. Spec : `docs/seo/maillage-decouverte-s20.md` §4 S4. Aucun article modifié, aucun code, pas de commit.
> `[Framework : n/a, phrase de liaison unique]` · `[Conscience : Solution-Aware, le lecteur est déjà dans un article du sujet voisin et cherche la suite]`

## 0. Méthode et limites

- **Lecture réelle** des 10 sources et des 7 cibles. Textes lus dans le dépôt : `apps/web/src/lib/blog-articles.ts` (articles statiques), `apps/web/src/data/blog-article-rewrites.json` (articles en base, copie de la refonte s11), `docs/copy/articles-q4/S2-se-presenter-avec-humour.md` (cible publiée le 12/10, seule version lue).
- **Limite 1 (prod non lue)** : cette session n'a pas d'accès shell, donc aucun `curl` sur `https://deviens-marrant.fr/blog/<slug>`. Les textes de la base sont ceux du JSON s11, qui peut avoir bougé depuis (correctifs de prix, patchs de démarrage). **Avant d'appliquer, @fullstack vérifie que chaque chaîne « avant » existe à l'identique, une seule fois, dans le contenu courant** (base ou fichier). Si ce n'est pas le cas : stop, retour @copywriter.
- **Limite 2 (cibles visibles)** : les 7 cibles figurent dans la liste des 17 articles « jamais explorés » du crawl du sitemap (`maillage-decouverte-s20.md` l.97), donc existent et sont visibles ; les statiques (`conversation-machine-a-cafe`, `storytelling-drole-5-structures`, `timidite-et-humour`) sont datées du 25/03/2026. Les 3 cibles en base (`etre-plus-a-l-aise-en-societe`, `techniques-humoristes-pros`, `citation-drole`) : date de publication non lue en base, preuve indirecte seulement (présence au sitemap, qui filtre sur `visibleBlogArticleWhere`). `se-presenter-avec-humour` : `publishedAt` 12/10/2026 05:00 UTC, en ligne (200) d'après `REPLIT_ACTIONS.md` l.21. `blagues-halloween-soiree-deguisee` est hors lot (demande d'indexation, pas de lien).
- **Article n°1 du trafic** : `meilleures-blagues-droles-2026` (368 clics sur 462 = 79,7 %, `point-etape-s20.md` §4). Il n'est source d'aucun des 14 appariements : **0 ajout** (plafond de 1 respecté). Pilier `comment-devenir-drole` : 0 ajout. Aucun ajout dans une FAQ ni dans le dernier paragraphe.
- **Registre** : tutoiement, phrases courtes, aucun tiret cadratin, pas de « ce n'est pas X, c'est Y », pas d'énumération par trois, pas de question rhétorique. Ancres descriptives, toutes différentes pour une même cible.

## 1. Verdict des 14 appariements

| # | Source → Cible | Verdict | Raison | N° relecture |
|---|---|---|---|---|
| 1 | `phrases-droles-conversations` → `conversation-machine-a-cafe` | **Retenu** | La source a une section « Phrases drôles pour la machine à café » ; la cible déroule cette scène en 5 situations avec accroche, relance, sortie. | 5 |
| 2 | `comment-improviser-des-blagues` → `conversation-machine-a-cafe` | **Retenu** | L'étape « Transformer » se joue à la machine à café ; la cible apporte les accroches préparées qui complètent le réflexe d'improvisation. | 9 |
| 3 | `avoir-confiance-en-soi-grace-a-l-humour` → `etre-plus-a-l-aise-en-societe` | **Retenu** | « Étape 3 : du cercle d'amis aux inconnus » (famille, semi-formel, inconnus) = la « méthode des cercles concentriques » de la cible. Meilleur appariement du lot. | 2 |
| 4 | `comment-avoir-de-la-repartie` → `etre-plus-a-l-aise-en-societe` | **Écarté** | Seul passage voisin : la section timidité, déjà à 3 liens (autodérision, `rester-muet-en-groupe`, `jamais-quoi-repondre-techniques`) dont un sur l'aisance en groupe. Un 4e lien serait redondant. Aucun autre passage sur l'aisance sociale générale. | n/a |
| 5 | `autoderision-interactions` → `se-presenter-avec-humour` | **Retenu** | « L'autodérision comme brise-glace » (arriver chez des inconnus, « Salut, je suis celui qui… ») = le cas de la cible (tour de table, groupe d'inconnus). | 7 |
| 6 | `comment-faire-rire-une-fille` → `se-presenter-avec-humour` | **Écarté** | Forcé. La source parle de faire rire quelqu'un en date ou en soirée ; la cible traite l'oral de rentrée (tour de table, premier jour) et exclut explicitement le registre rencontre. Aucun passage de la source ne parle de se présenter. | n/a |
| 7 | `exercices-developper-humour` → `techniques-humoristes-pros` | **Retenu** | L'exercice 7 (analyse de sketch) demande de noter « c'est quoi la technique ? » ; la cible liste les 7 mécaniques à repérer. | 1 |
| 8 | `blague-drole-7-criteres-pepite` → `techniques-humoristes-pros` | **Retenu** (pertinence moyenne) | L'intro invoque Mirabel et Fary (« ce sont ces critères ») ; la cible s'ouvre sur le même Bercy et donne les autres outils de scène. Lien de prolongement, pas de doublon de contenu. | 10 |
| 9 | `phrases-droles-conversations` → `citation-drole` | **Retenu** | La source dit « Pour fabriquer les tiennes… » ; la cible a une section « créer tes propres citations » avec 3 méthodes. | 4 |
| 10 | `blague-courte-arme-secrete-humour` → `citation-drole` | **Retenu** | Après les 15 blagues courtes rangées par situation, « Si tu en veux d'autres » : la cible en propose 40 par situation avec mode d'emploi. | 8 |
| 11 | `comment-raconter-une-blague-sans-la-rater` → `storytelling-drole-5-structures` | **Retenu** | L'exemple « rayon fromage » (anecdote ratée contre réussie) appelle la construction d'une anecdote ; la cible répond par ses 5 structures. | 3 |
| 12 | `comment-improviser-des-blagues` → `storytelling-drole-5-structures` | **Retenu** (pertinence moyenne) | Les patterns « escalade absurde » et « retournement » de la source sont les structures 1 et 2 de la cible, appliquées à une anecdote entière. | 11 |
| 13 | `comment-faire-rire-une-fille` → `timidite-et-humour` | **Écarté** | Décalage d'intention. La requête « faire rire une fille timide » vise la timidité de l'autre ; la cible s'adresse à celui qui est timide. La source ne parle jamais de la timidité du lecteur (elle dit même « la plupart des mecs parlent trop »). Lien bancal, non remplacé. | n/a |
| 14 | `comment-avoir-de-la-repartie` → `timidite-et-humour` | **Retenu** | Section « avoir de la répartie quand on est timide » : « quand elles parlent, tout le monde écoute » = Clé 3 de la cible (« quand un timide parle, tout le monde écoute »). | 6 |

**Bilan : 11 retenus, 3 écartés (4, 6, 13).** Par source : `phrases-droles-conversations` 2, `comment-improviser-des-blagues` 2, `comment-avoir-de-la-repartie` 1, les 7 autres sources 1 chacune (plafond de 2 respecté). Nouveaux liens entrants : `conversation-machine-a-cafe` 2, `techniques-humoristes-pros` 2, `citation-drole` 2, `storytelling-drole-5-structures` 2, `etre-plus-a-l-aise-en-societe` 1, `se-presenter-avec-humour` 1, `timidite-et-humour` 1.

Conséquence pour `etre-plus-a-l-aise-en-societe` (cible à 2 pages sources dans le crawl) : un seul nouveau lien au lieu de deux. À signaler à @seo, sans lien de remplacement.

## 2. Consignes d'application (@fullstack)

1. **Articles statiques** (`apps/web/src/lib/blog-articles.ts`) : `phrases-droles-conversations`, `comment-avoir-de-la-repartie`, `autoderision-interactions`, `exercices-developper-humour`. Remplacer la chaîne « avant » par la chaîne « après » dans `content`. Passer `updatedAt` à la date réelle de déploiement pour ces 4 seulement. Le test `src/__tests__/lib/blog-em-dash-static.test.ts` compare mots, liens et `updatedAt` à `__tests__/lib/fixtures/blog-em-dash-baseline.json` : **régénérer l'empreinte de ces 4 slugs** (diff attendu : mots ajoutés et un lien de plus, rien d'autre) et le dire dans `REPLIT_ACTIONS.md`. Vérifier d'abord qu'aucune ligne `BlogArticle` ne porte l'un de ces slugs en base (la base masque le statique).
2. **Articles en base** : `avoir-confiance-en-soi-grace-a-l-humour`, `blague-courte-arme-secrete-humour`, `blague-drole-7-criteres-pepite`, `comment-improviser-des-blagues`, `comment-raconter-une-blague-sans-la-rater`. Ne PAS bumper `_meta.version` de `blog-article-rewrites.json` (cela réécrirait les 9 articles depuis le JSON). Utiliser un remplacement exact en base, une seule fois, avec marqueur `DataPatch` (`blog-liens-s4-s20:v1:<slug>`), erreur si la chaîne « avant » est absente ou présente plus d'une fois, sauvegarde du contenu avant. Reporter ensuite la même phrase dans le JSON (champ `content`, guillemets `\"` et sauts de ligne `\n` échappés) pour qu'une réapplication future ne la fasse pas disparaître. Repères JSON : confiance l.12, blague-courte l.18, 7-critères l.24, improviser l.36, raconter l.42.
3. **Mesure du diff réel (P0 s11)** : une phrase de 11 à 22 mots par ajout, 0 mot retiré, H2, FAQ, liens existants, chiffres et humoristes inchangés. À mesurer par @fullstack avant et après (ordre de grandeur attendu : 0,5 à 1,5 % de mots par article ; `phrases-droles-conversations` 25 mots et `comment-improviser-des-blagues` 36 mots sont les deux plus chargés, `[À MESURER]`).
4. **Contrôle final** : aucun « — » dans les chaînes ajoutées ; chaque lien pointe vers un slug publié ; aucun lien dans une FAQ ni dans le dernier paragraphe.

## 3. Blocs avant / après (11 retenus)

Convention : la phrase ajoutée est en **gras** dans « après » (le gras n'est pas à reproduire). Les guillemets droits des chaînes JSON s'écrivent `\"` dans le fichier JSON.

### Appariement 1 : `phrases-droles-conversations` → `conversation-machine-a-cafe`
- **Emplacement** : statique, `apps/web/src/lib/blog-articles.ts`, slug `phrases-droles-conversations`, l.1211 (dernier paragraphe de la section « Phrases drôles pour la machine à café », avant le `---`). Ni FAQ ni dernier paragraphe de l'article.
- **Paragraphe précédent** : `**6. "Ma boîte mail, c'est un journal intime : j'écris, personne répond."**` puis `→ *Quand quelqu'un se plaint des mails.* Enchaîne immédiatement après sa plainte, comme si c'était une évidence.`
- **Avant** : `Pour plus de techniques sur [comment avoir de la répartie au travail](/blog/comment-avoir-de-la-repartie), on a un article entier là-dessus.`
- **Après** : `Pour plus de techniques sur [comment avoir de la répartie au travail](/blog/comment-avoir-de-la-repartie), on a un article entier là-dessus.` **`Pour la scène complète, [la conversation à la machine à café](/blog/conversation-machine-a-cafe) détaille cinq situations.`**
- **Paragraphe suivant** : `---` puis `## Phrases drôles pour les soirées` (inchangé).
- **Ancre** : « la conversation à la machine à café » · **14 mots** · cible : 5 situations (lundi, nouveau collègue, boss, crush, silence entre inconnus), vérifié.

### Appariement 2 : `comment-improviser-des-blagues` → `conversation-machine-a-cafe`
- **Emplacement** : base, `BlogArticle.slug = 'comment-improviser-des-blagues'` ; copie JSON `blog-article-rewrites.json` l.36 ; section `### Transformer` (H2 « 1. La méthode des 3 piliers »), nouveau paragraphe entre la scène du stagiaire et `**Les 3 étapes en pratique :**`.
- **Paragraphe précédent** : `Tu retournes la situation, à la machine à café, après la réunion :` puis `"J'ai demandé à mon stagiaire ce qu'était la synergie collaborative. Il a réfléchi 5 secondes et il a proposé une pause café. Honnêtement, je crois que c'est exactement ça."`
- **Avant** (chaîne à trouver) : `Honnêtement, je crois que c'est exactement ça."\n\n**Les 3 étapes en pratique :**`
- **Après** : `Honnêtement, je crois que c'est exactement ça."\n\n` **`Pour préparer ce genre d'échange, [tenir la conversation à la machine à café](/blog/conversation-machine-a-cafe) donne des accroches pour cinq situations.`** `\n\n**Les 3 étapes en pratique :**`
- **Paragraphe suivant** : `**Les 3 étapes en pratique :**` et la liste Observer / Connecter / Transformer (inchangés).
- **Ancre** : « tenir la conversation à la machine à café » · **19 mots**.

### Appariement 3 : `avoir-confiance-en-soi-grace-a-l-humour` → `etre-plus-a-l-aise-en-societe`
- **Emplacement** : base, slug `avoir-confiance-en-soi-grace-a-l-humour` ; JSON l.12 ; `### Niveau 3 : Situations inconnues` (dans « Étape 3 - L'exposition progressive : Du cercle d'amis aux inconnus »), fin du paragraphe.
- **Paragraphe précédent** (Niveau 2) : `Machine à café au bureau, queue au supermarché, soirées entre amis d'amis. L'avantage : si ça rate, tu peux toujours faire semblant de consulter ton téléphone comme si de rien n'était.`
- **Avant** : `Transports en commun, afterworks, rencontres. C'est là que tu testes vraiment ta [répartie en situation réelle](/blog/comment-avoir-de-la-repartie).`
- **Après** : `Transports en commun, afterworks, rencontres. C'est là que tu testes vraiment ta [répartie en situation réelle](/blog/comment-avoir-de-la-repartie).` **`Le même chemin, de la famille aux inconnus, est détaillé dans [être plus à l'aise en société](/blog/etre-plus-a-l-aise-en-societe) sous forme de cercles concentriques.`**
- **Paragraphe suivant** : `Panayotis Pascot raconte sur scène ses histoires les plus gênantes. Du coup, même quand il "échoue" dans la vie, […]` (inchangé).
- **Ancre** : « être plus à l'aise en société » · **22 mots** · cible : « La méthode des cercles concentriques : de la famille aux inconnus », vérifié.

### Appariement 5 : `autoderision-interactions` → `se-presenter-avec-humour`
- **Emplacement** : statique, slug `autoderision-interactions`, l.426, fin de la section « L'autodérision comme brise-glace ». Ni FAQ ni dernier paragraphe.
- **Paragraphe précédent** : `Option B : "Salut, je suis celui qui connaît personne et qui hésite entre le buffet et la sortie de secours." La glace se brise, et d'un coup tu deviens approchable, […]`
- **Avant** : `**Paul Mirabel** utilise exactement cette technique en début de spectacle. Il se met dans une position de "faux faible" qui rend le public bienveillant. Et à partir de là, tout ce qu'il dit est accueilli avec sympathie.`
- **Après** : même paragraphe + **`Au tour de table, [te présenter avec humour](/blog/se-presenter-avec-humour) suit la même logique, en trois temps.`**
- **Paragraphe suivant** : `## L'autodérision dans différents contextes` (inchangé).
- **Ancre** : « te présenter avec humour » · **15 mots** · cible : « trois temps suffisent » (En bref du brouillon validé 01/10 ; à recontrôler sur la version en base).

### Appariement 7 : `exercices-developper-humour` → `techniques-humoristes-pros`
- **Emplacement** : statique, slug `exercices-developper-humour`, l.953, « Exercice 7 : L'analyse de sketch ». Ni FAQ ni dernier paragraphe.
- **Paragraphe précédent** : `**Le principe :** Regarde 5 minutes d'un sketch d'un humoriste. Mets en pause après chaque rire. Note : c'est quoi la technique ? Setup ? Punchline ? Timing ? Callback ?`
- **Avant** : `Nos [vidéos](/videos) de pros sont analysées technique par technique : c'est l'exercice déjà fait pour toi. Mais le faire toi-même avec du nouveau matériel te rend meilleur.`
- **Après** : même paragraphe + **`Pour savoir quoi repérer, [les techniques des humoristes pros](/blog/techniques-humoristes-pros) détaillent sept mécaniques de stand-up.`**
- **Paragraphe suivant** : `**Blanche Gardin** est parfaite pour cet exercice : […]` (inchangé).
- **Ancre** : « les techniques des humoristes pros » · **14 mots** · cible : « 7 mécaniques » en intro, vérifié.

### Appariement 8 : `blague-drole-7-criteres-pepite` → `techniques-humoristes-pros` (pertinence moyenne)
- **Emplacement** : base, slug `blague-drole-7-criteres-pepite` ; JSON l.24 ; fin du dernier paragraphe de l'introduction, juste avant `## MYTHE BRISÉ : "Une blague drôle doit être compliquée"`.
- **Paragraphe précédent** : `Parce que tu connais la scène : tu racontes une blague qui t'avait fait pleurer de rire la veille, et autour de la table, rien. Un pote fixe son verre, un autre te demande si c'est fini.`
- **Avant** : `On les passe en revue un par un, avec une grille pour tester les tiennes à la fin.\n\n## MYTHE BRISÉ`
- **Après** : `On les passe en revue un par un, avec une grille pour tester les tiennes à la fin.` **`Côté scène, les mêmes humoristes ont d'autres outils, passés en revue dans [comment les pros construisent leurs blagues](/blog/techniques-humoristes-pros).`** `\n\n## MYTHE BRISÉ`
- **Paragraphe suivant** : titre `## MYTHE BRISÉ : "Une blague drôle doit être compliquée"` (inchangé).
- **Ancre** : « comment les pros construisent leurs blagues » · **18 mots**. Si @reviewer juge ce lien trop distant de l'article, c'est le premier à retirer (il n'abîme rien en son absence).

### Appariement 9 : `phrases-droles-conversations` → `citation-drole`
- **Emplacement** : statique, slug `phrases-droles-conversations`, l.1332, section « L'art de la phrase drôle : pourquoi certaines marchent ». Ni FAQ ni dernier paragraphe.
- **Paragraphe précédent** : `---` puis le titre de la section.
- **Avant** : `Les 33 phrases au-dessus ont un point commun : elles sont **courtes** (moins de 25 mots), elles parlent de **situations universelles**, et la chute arrive **là où on ne l'attend pas**. Pour fabriquer les tiennes, lis [le guide pour devenir drôle](/blog/comment-devenir-drole).`
- **Après** : même paragraphe + **`L'article sur la [citation drôle](/blog/citation-drole) ajoute trois méthodes pour y arriver.`**
- **Paragraphe suivant** : `C'est exactement ce que Roman Frayssinet fait sur scène : […]` (inchangé).
- **Ancre** : « citation drôle » · **11 mots** · cible : section « créer tes propres citations mémorables » (déformation, contraste, autodérision constructive = 3 méthodes), vérifié.

### Appariement 10 : `blague-courte-arme-secrete-humour` → `citation-drole`
- **Emplacement** : base, slug `blague-courte-arme-secrete-humour` ; JSON l.18 ; paragraphe qui clôt la liste des « 15 blagues courtes testées et approuvées par situations ». Ni FAQ ni dernier paragraphe.
- **Paragraphe précédent** : item `15. "Mes enfants m'entendent jamais. Sauf quand je chuchote le mot 'glace'."`
- **Avant** : `Chacune est pensée pour son contexte : sortie au mauvais endroit, une vanne courte tombe aussi vite qu'elle est partie. Si tu en veux d'autres, notre [abonnement](/abonnement) en propose 50 nouvelles chaque mois.`
- **Après** : `Chacune est pensée pour son contexte : sortie au mauvais endroit, une vanne courte tombe aussi vite qu'elle est partie.` **`Des formules courtes rangées par situation, il y en a aussi dans [40 citations drôles avec leur mode d'emploi](/blog/citation-drole).`** `Si tu en veux d'autres, notre [abonnement](/abonnement) en propose 50 nouvelles chaque mois.`
- **Paragraphe suivant** : `## Challenge 30 jours : maîtriser l'art de la concision humoristique` (inchangé).
- **Ancre** : « 40 citations drôles avec leur mode d'emploi » · **19 mots** · « 40 » = méta de la cible, vérifié.

### Appariement 11 : `comment-raconter-une-blague-sans-la-rater` → `storytelling-drole-5-structures`
- **Emplacement** : base, slug `comment-raconter-une-blague-sans-la-rater` ; JSON l.42 ; « 5. L'art de construire et livrer la chute parfaite », paragraphe qui suit les deux versions du rayon fromage.
- **Paragraphe précédent** : `**Réussie :** "Au rayon fromage, un mec hésite depuis cinq minutes. […] J'attendais qu'il choisisse pour moi."`
- **Avant** : `Même histoire. Dans la première, la chute se noie entre la charcuterie et la gare. Dans la seconde, rien ne dépasse.`
- **Après** : même paragraphe + **`Quand c'est une anecdote entière à construire, [5 structures de storytelling drôle](/blog/storytelling-drole-5-structures) te donnent le plan.`**
- **Paragraphe suivant** : `Dernier réglage : le placement. Le mot drôle doit être le dernier mot prononcé. […]` (inchangé).
- **Ancre** : « 5 structures de storytelling drôle » · **16 mots** · la cible renvoie déjà vers cet article (lien réciproque).

### Appariement 12 : `comment-improviser-des-blagues` → `storytelling-drole-5-structures` (pertinence moyenne)
- **Emplacement** : base, slug `comment-improviser-des-blagues` ; JSON l.36 ; « 4. Les patterns humoristiques universels à maîtriser », paragraphe de conclusion des 5 patterns. Ni FAQ ni dernier paragraphe.
- **Paragraphe précédent** : `### Pattern 5 : L'auto-contradiction assumée` et `"Je suis pas rancunier. J'ai juste une liste."`
- **Avant** : `Ces patterns sont partout dans le stand-up, et Blanche Gardin en fait un usage redoutable : la chute prend toujours nos attentes à contre-pied.`
- **Après** : même paragraphe + **`Sur une anecdote entière, [raconter une histoire drôle](/blog/storytelling-drole-5-structures) repose sur cinq structures, dont l'escalade et le pivot.`**
- **Paragraphe suivant** : `> **CLEF :** Maîtriser ces 5 patterns, c'est avoir un kit de survie humoristique pour 80% des situations sociales.` (inchangé).
- **Ancre** : « raconter une histoire drôle » · **17 mots** · cible : structures 1 (escalade) et 2 (pivot), vérifié. Cet article reçoit 2 liens (appariements 2 et 12) : 36 mots ajoutés au total, `[À MESURER]` contre sa longueur réelle.

### Appariement 14 : `comment-avoir-de-la-repartie` → `timidite-et-humour`
- **Emplacement** : statique, slug `comment-avoir-de-la-repartie`, l.215, section « Comment avoir de la répartie quand on est timide ? », au milieu du paragraphe (après la 3e phrase). Ni FAQ ni dernier paragraphe.
- **Paragraphe précédent** : titre `## Comment avoir de la répartie quand on est timide ?`
- **Avant** : `Et souvent, ce sont les personnes calmes qui ont la répartie la plus dévastatrice, parce que quand elles parlent, tout le monde écoute. L'[autodérision](/blog/autoderision-interactions) est aussi un allié puissant pour les timides`
- **Après** : `Et souvent, ce sont les personnes calmes qui ont la répartie la plus dévastatrice, parce que quand elles parlent, tout le monde écoute.` **`Ce ressort se travaille par paliers dans [oser faire rire quand on est timide](/blog/timidite-et-humour).`** `L'[autodérision](/blog/autoderision-interactions) est aussi un allié puissant pour les timides`
- **Paragraphe suivant** : `## Un dernier truc important` (inchangé).
- **Ancre** : « oser faire rire quand on est timide » · **14 mots** · cible : Clé 3 (« quand un timide parle, tout le monde écoute ») et Clé 5 (progression par paliers), vérifié. Le paragraphe garde ses 3 liens d'origine, un 4e lien est ajouté parce que le sujet est exactement celui de la section.

## 4. Points d'attention pour la suite

- **Appariements 4, 6, 13 écartés sans remplaçant.** Si Thomas veut tout de même un lien vers `etre-plus-a-l-aise-en-societe` ou `timidite-et-humour`, la cible trouve déjà sa place dans le pilier (gelé) et dans `se-presenter-avec-humour` (qui lie `etre-plus-a-l-aise-en-societe`) ; pas de lien forcé proposé ici.
- **Deux phrases à retirer en premier** si la relecture à l'aveugle ou @reviewer en juge une trop distante : appariements 8 et 12 (pertinence moyenne).
- **Cible `se-presenter-avec-humour`** : « en trois temps » repose sur le brouillon validé du 01/10 ; la version en base n'a pas pu être relue (voir §0). Si la formule a changé de structure, adapter la phrase 5 (« en trois temps » est le seul élément à recontrôler).
- **Après mise en ligne** : IndexNow sur les 9 sources modifiées et sur les 7 cibles (cron existant) ; mesure Search Console à J+14 sur les 7 cibles (première exploration), conformément à `maillage-decouverte-s20.md` §7.

## 5. Liste anonymisée pour la relecture à l'aveugle

> À copier seule dans le prompt des relecteurs (sans les §1 à §4). Relecture sur le ton, le registre et les tics d'écriture uniquement. 11 phrases ; les numéros correspondent à la dernière colonne du tableau du §1.

1. Pour savoir quoi repérer, les techniques des humoristes pros détaillent sept mécaniques de stand-up.
2. Le même chemin, de la famille aux inconnus, est détaillé dans être plus à l'aise en société sous forme de cercles concentriques.
3. Quand c'est une anecdote entière à construire, 5 structures de storytelling drôle te donnent le plan.
4. L'article sur la citation drôle ajoute trois méthodes pour y arriver.
5. Pour la scène complète, la conversation à la machine à café détaille cinq situations.
6. Ce ressort se travaille par paliers dans oser faire rire quand on est timide.
7. Au tour de table, te présenter avec humour suit la même logique, en trois temps.
8. Des formules courtes rangées par situation, il y en a aussi dans 40 citations drôles avec leur mode d'emploi.
9. Pour préparer ce genre d'échange, tenir la conversation à la machine à café donne des accroches pour cinq situations.
10. Côté scène, les mêmes humoristes ont d'autres outils, passés en revue dans comment les pros construisent leurs blagues.
11. Sur une anecdote entière, raconter une histoire drôle repose sur cinq structures, dont l'escalade et le pivot.

---

## 6. Tour 2 (12/10/2026) : réécriture après relecture à l'aveugle

**Les phrases et emplacements du §3 et du §5 sont remplacés par ceux de ce §6.** Les verdicts du tour 1 (`docs/copy/relecture-s4-s20/verdicts-relecteur-1.md` et `-2.md`) : 0/11 au niveau chez le relecteur 1, 4/11 chez le relecteur 2 (D, E, H, I). Défaut commun : les 11 phrases suivaient un même moule « Pour X, [titre] détaille N choses », reconnaissable à la suite. Autres défauts : titre collé sans déterminant, ancre à l'infinitif en sujet, passif, « Pour » répété, nombres qui se télescopent, élan coupé.

**Ce qui change** : chaque phrase a sa propre construction (« reste à savoir », « voilà comment », « notre guide sur », « pioche dans nos », « l'article sur », etc.), l'ancre est toujours précédée d'un déterminant, d'un verbe ou d'un « pour », plus aucun décompte systématique. **Aucun appariement retiré** : les 11 trouvent une formulation naturelle. **3 emplacements déplacés** dans le même article source (hors FAQ, hors dernier paragraphe) : appariement 2 (fin de la section « méthode des 3 piliers » au lieu de la coupure entre l'exemple et la liste), appariement 9 (après « Nos conseils humour… » au lieu de sous le titre, ce qui cassait « C'est exactement ce que Roman Frayssinet fait »), appariement 12 (après le CLEF, ce qui sépare « ces 5 patterns » des « cinq structures »). Les 8 autres restent à leur place.

### Table de correspondance : lettres de `extraits-aveugle-tour2.md` → appariements

| Lettre | Appariement | Source → Cible |
|---|---|---|
| A | 11 | `comment-raconter-une-blague-sans-la-rater` → `storytelling-drole-5-structures` |
| B | 1 | `phrases-droles-conversations` → `conversation-machine-a-cafe` |
| C | 5 | `autoderision-interactions` → `se-presenter-avec-humour` |
| D | 12 | `comment-improviser-des-blagues` → `storytelling-drole-5-structures` |
| E | 10 | `blague-courte-arme-secrete-humour` → `citation-drole` |
| F | 14 | `comment-avoir-de-la-repartie` → `timidite-et-humour` |
| G | 3 | `avoir-confiance-en-soi-grace-a-l-humour` → `etre-plus-a-l-aise-en-societe` |
| H | 7 | `exercices-developper-humour` → `techniques-humoristes-pros` |
| I | 2 | `comment-improviser-des-blagues` → `conversation-machine-a-cafe` |
| J | 8 | `blague-drole-7-criteres-pepite` → `techniques-humoristes-pros` |
| K | 9 | `phrases-droles-conversations` → `citation-drole` |

### Blocs avant / après à jour (chaînes « avant » vérifiées à l'identique, une occurrence chacune, le 12/10)

Convention du §3. « Avant » = chaîne à trouver ; « Après » = chaîne de remplacement, phrase ajoutée en gras. Statique = `apps/web/src/lib/blog-articles.ts` (n° de ligne actuel) ; base = JSON `blog-article-rewrites.json` (copie) et remplacement exact en base (§2).

**1 · lettre B · `phrases-droles-conversations`, statique l.1211** (fin de la section machine à café, inchangé en emplacement)
- Avant : `Pour plus de techniques sur [comment avoir de la répartie au travail](/blog/comment-avoir-de-la-repartie), on a un article entier là-dessus.`
- Après : même ligne + **`Reste à savoir quoi dire entre deux vannes : notre guide sur [la conversation à la machine à café](/blog/conversation-machine-a-cafe) s'en occupe.`** · 20 mots.

**2 · lettre I · `comment-improviser-des-blagues`, base (JSON l.36)** · emplacement DÉPLACÉ : fin de la section 1, après le paragraphe Waly Dia (plus d'ajout dans « Transformer »). Paragraphe précédent : `3. **Transformer** : exagérer ou retourner la situation`. Paragraphe suivant : `## 2. Technique du rebond : partir de ce qui se dit`.
- Avant : `et en tire des **punchlines** qui tapent juste.\n\n## 2. Technique du rebond`
- Après : `et en tire des **punchlines** qui tapent juste.` **`Si la pause café te fait plus peur que la réunion, voilà comment [tenir la conversation à la machine à café](/blog/conversation-machine-a-cafe).`** `\n\n## 2. Technique du rebond` · 21 mots.

**3 · lettre G · `avoir-confiance-en-soi-grace-a-l-humour`, base (JSON l.12)**, fin du « Niveau 3 »
- Avant : `C'est là que tu testes vraiment ta [répartie en situation réelle](/blog/comment-avoir-de-la-repartie).\n\nPanayotis Pascot raconte`
- Après : `…[répartie en situation réelle](/blog/comment-avoir-de-la-repartie).` **`Cette échelle, de la famille aux inconnus, revient en cercles concentriques dans l'article sur [être plus à l'aise en société](/blog/etre-plus-a-l-aise-en-societe).`** `\n\nPanayotis Pascot raconte` · 20 mots.

**5 · lettre C · `autoderision-interactions`, statique l.426**
- Avant : `Et à partir de là, tout ce qu'il dit est accueilli avec sympathie.` (fin du paragraphe `**Paul Mirabel** utilise exactement cette technique…`)
- Après : même phrase + **`Même principe au tour de table, avec une petite formule en trois temps pour [te présenter avec humour](/blog/se-presenter-avec-humour).`** · 18 mots.

**7 · lettre H · `exercices-developper-humour`, statique l.953**
- Avant : `Nos [vidéos](/videos) de pros sont analysées technique par technique : c'est l'exercice déjà fait pour toi. Mais le faire toi-même avec du nouveau matériel te rend meilleur.`
- Après : même paragraphe + **`Au début, les ficelles passent inaperçues : on a décortiqué [les techniques des humoristes pros](/blog/techniques-humoristes-pros), sept en tout.`** · 17 mots.

**8 · lettre J · `blague-drole-7-criteres-pepite`, base (JSON l.24)**, fin de l'intro
- Avant : `On les passe en revue un par un, avec une grille pour tester les tiennes à la fin.\n\n## MYTHE BRISÉ`
- Après : `On les passe en revue un par un, avec une grille pour tester les tiennes à la fin.` **`Côté scène, on montre aussi [comment les pros construisent leurs blagues](/blog/techniques-humoristes-pros), avec d'autres outils que cette grille.`** `\n\n## MYTHE BRISÉ` · 17 mots.

**9 · lettre K · `phrases-droles-conversations`, statique l.1346** · emplacement DÉPLACÉ (l'ajout sous le titre l.1332 est abandonné). Paragraphe précédent : fin de la liste « Trois erreurs qui tuent une bonne phrase » (`- **La répéter** : une phrase drôle, c'est un one-shot.`). Paragraphe suivant : `---` puis `## Mémorise 5, pas 30`.
- Avant : `Nos [conseils humour](/conseils) te donnent les techniques derrière ces phrases, pas juste le "quoi dire" mais le "comment le dire".`
- Après : même ligne + **`Écrire tes propres formules se travaille aussi : notre article sur la [citation drôle](/blog/citation-drole) te montre trois méthodes.`** · 17 mots.

**10 · lettre E · `blague-courte-arme-secrete-humour`, base (JSON l.18)**
- Avant : `une vanne courte tombe aussi vite qu'elle est partie. Si tu en veux d'autres, notre [abonnement](/abonnement) en propose 50 nouvelles chaque mois.`
- Après : `une vanne courte tombe aussi vite qu'elle est partie.` **`Des formules courtes rangées par situation, tu en trouveras aussi dans notre sélection de [40 citations drôles avec leur mode d'emploi](/blog/citation-drole).`** `Si tu en veux d'autres, notre [abonnement](/abonnement) en propose 50 nouvelles chaque mois.` · 21 mots.

**11 · lettre A · `comment-raconter-une-blague-sans-la-rater`, base (JSON l.42)**
- Avant : `Dans la seconde, rien ne dépasse.\n\nDernier réglage : le placement.`
- Après : `Dans la seconde, rien ne dépasse.` **`Quand c'est toute une anecdote à construire, pioche dans nos [5 structures de storytelling drôle](/blog/storytelling-drole-5-structures) : elles te donnent le plan.`** `\n\nDernier réglage : le placement.` · 20 mots.

**12 · lettre D · `comment-improviser-des-blagues`, base (JSON l.36)** · emplacement DÉPLACÉ : nouveau paragraphe après le CLEF des patterns. Paragraphe précédent : `> **CLEF :** Maîtriser ces 5 patterns, c'est avoir un kit de survie humoristique pour 80% des situations sociales.` Paragraphe suivant : `## 5. Gérer l'échec : transformer un flop en rebond`.
- Avant : `pour 80% des situations sociales.\n\n## 5. Gérer l'échec : transformer un flop en rebond`
- Après : `pour 80% des situations sociales.\n\n` **`Le jour où une phrase ne suffit plus, on t'explique comment [raconter une histoire drôle](/blog/storytelling-drole-5-structures), avec l'escalade et le pivot en renfort.`** `\n\n## 5. Gérer l'échec : transformer un flop en rebond` · 22 mots.

**14 · lettre F · `comment-avoir-de-la-repartie`, statique l.215**
- Avant : `parce que quand elles parlent, tout le monde écoute. L'[autodérision](/blog/autoderision-interactions) est aussi un allié puissant pour les timides`
- Après : `parce que quand elles parlent, tout le monde écoute.` **`C'est peut-être toi : il existe un guide pour [oser faire rire quand on est timide](/blog/timidite-et-humour), palier par palier.`** `L'[autodérision](/blog/autoderision-interactions) est aussi un allié puissant pour les timides` · 18 mots.

### Contrôles et points d'attention du tour 2
- **Mots ajoutés** : `phrases-droles-conversations` 37 mots (appariements 1 et 9) et `comment-improviser-des-blagues` 43 mots (2 et 12), soit au-dessus des 25 et 36 du tour 1, probablement 1,5 à 1,8 % de l'article `[À MESURER par @fullstack]`. Si la mesure dépasse 1,5 %, retirer d'abord l'appariement 9 puis le 12 (pertinence la plus faible), pas raccourcir les phrases.
- **Chiffres** : « 5 » (appariement 11) et « 40 » (appariement 10) sont les nombres des titres cibles ; « sept » (7), « trois » (5, 9), « cinq » absent. Aucun nombre ne reprend un nombre du paragraphe voisin.
- **Zéro tiret cadratin**, aucun décompte en triple, aucune question en ouverture. Tutoiement partout (les phrases 3 et 11 à tournure impersonnelle : « Cette échelle… », « Quand c'est… pioche »).
- **Règle d'or P0 s18** : ces 11 formulations sont neuves, elles repassent la relecture à l'aveugle (`extraits-aveugle-tour2.md`) avant toute application. Une phrase non validée ne part pas.
- **Baseline statique** : 4 articles statiques touchés comme avant (§2), mêmes consignes de régénération.

---

**Handoff → @orchestrator (puis @reviewer pour la relecture à l'aveugle, puis @fullstack pour l'application)**
- Fichier produit : `/home/user/Marrant/docs/copy/liens-s4-s20.md`.
- Décisions : 11 appariements retenus, 3 écartés (4, 6, 13) sans remplacement ; 0 ajout sur le n°1 et sur le pilier ; ancres toutes différentes par cible ; remplacement exact en base avec marqueur `DataPatch`, sans bump de version du JSON.
- Points d'attention : prod non lue (pas de shell, `curl` impossible), chaînes « avant » à contrôler à l'identique avant application ; baseline `blog-em-dash-baseline.json` à régénérer pour 4 articles statiques ; `se-presenter-avec-humour` jugé sur le brouillon validé ; objections traitées : sans objet (phrases de liaison).


