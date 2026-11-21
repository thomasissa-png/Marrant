# Relecture à l'aveugle, fiches vidéo s26 (P0 s18)

Date : 20/11/2026. Relecteur : @reviewer. Textes jugés : version AJUSTÉE de `docs/copy/textes-videos-remplacees-s26.md` (A1 avec le nouveau learning 4, A2 avec la nouvelle description, B2 en variante, A3 et B3 tels quels). Étalon de niveau : `apps/web/src/data/video-content-s20.json` (seedId 1 à 4). Sources vérifiées : les titres oEmbed de `docs/qa/remplacements-videos-s26.md` (l. 22 et 26) et les URL citées dans le doc s26. Aucune vidéo visionnée, c'est la décision du fondateur (non discutée ici).

Règle appliquée pour le critère 1 : chaque point « À VÉRIFIER AU VISIONNAGE » du doc s26 qu'aucune source ne couvre ne doit plus apparaître, même indirectement, dans le texte publié.

## Verdict

| Fiche | (1) Sourcé | (2) Niveau | (3) Ton | (4) Typo / français | Verdict |
|---|---|---|---|---|---|
| A1 Domenge | **FAIL** (R1) | PASS | PASS | PASS | NO-GO |
| A2 Gad | **FAIL** (R2) | PASS | **FAIL** (R3) | PASS | NO-GO |
| A3 Kev Adams | **FAIL** (R4) | PASS | PASS | PASS | NO-GO |
| B2 Domenge (parcours) | **FAIL** (R5) | PASS | PASS | PASS | NO-GO |
| B3 Kev Adams (parcours) | PASS | **FAIL** (R6) | PASS | PASS | NO-GO |

Verdict global : **NO-GO tant que les 6 remplacements ne sont pas faits, GO une fois qu'ils le sont** (ce sont des changements d'un mot ou d'une phrase, sans réécriture). Zéro tiret cadratin dans les 5 blocs. Tutoiement, guillemets « » et absence de concurrent cités : conformes partout.

## Remplacements exacts

**R1. A1, learning 3** (le doc s26 dit « elle montre les deux points de vue (sinon retirer le 3e) » ; le « malentendu » est un déroulé que rien ne source). Remplacer tout le learning par :
> TECHNIQUE DU DILEMME PARTAGÉ : pars d'une question que la salle s'est déjà posée (se remettre avec un ex, rappeler quelqu'un, revenir dans un ancien job). Avant même ta première vanne, chacun a son avis, et tu n'as plus qu'à jouer avec.

(Ce learning s'appuie sur le titre et sur la phrase de la description « ce sujet que presque tout le monde a déjà retourné dans sa tête ».)

**R2. A2, learning 1** (le fondateur a retiré « avec le corps » de la description parce que le jeu corporel n'est pas sourcé, mais le mot « mime » l'affirme encore). Remplacer :
- « TECHNIQUE DE L'OBSERVATION MIMÉE » par « TECHNIQUE DE L'OBSERVATION JOUÉE »
- « Le mime transforme une observation en scène » par « Le jeu transforme une observation en scène »

**R3. A2, dernière phrase de la description** (une fois ajustée, la description dit deux fois « jusqu'au bout » en deux phrases de suite, et une troisième fois dans le learning 4). Remplacer :
> Utile pour voir comment une situation banale devient un sketch quand on joue un rôle jusqu'au bout.

par :
> Utile pour voir comment une situation banale devient un sketch.

**R4. A3, première phrase de la description** (le doc s26, l. 47, source la venue de Kev Adams au festival, mais « pas le lien avec ce sketch » ; seule la chaîne est sourcée). Remplacer :
> Kev Adams s'empare du tennis sur la scène de Montreux Comedy.

par la formule de l'étalon Vérino :
> Kev Adams s'empare du tennis dans cette vidéo de Montreux Comedy.

**R5. B2, why** (« en une phrase » décrit un procédé précis que personne n'a vu ; si elle met trois phrases, l'élève cherche quelque chose qui n'existe pas). Remplacer :
> Repère comment elle présente l'autre en une phrase : qu'est-ce qui le fait reconnaître tout de suite ?

par :
> Repère comment elle présente l'autre : qu'est-ce qui le fait reconnaître tout de suite ?

**R6. B3, why** (« un détail que tout le monde reconnaît : c'est ce qui fait un bon irritant partagé » mélange deux choses : reconnaître un détail ne suffit pas, il faut aussi qu'il agace. L'élève de la fiche 3.4 apprendrait une technique fausse). Remplacer :
> Repère un détail que tout le monde reconnaît d'emblée : c'est ce qui fait un bon irritant partagé.

par :
> Repère un détail que tout le monde reconnaît d'emblée : c'est par là que commence un irritant partagé.

## Hors critères (pour info, pas bloquant)

- A2 : le doc s26 demande aussi de retirer `recommendedTimestamp` (l. 43). Le texte n'est pas concerné, mais c'est à faire au moment de l'application.
- A3 : les learnings 2 (« code partagé ») et 3 (« énergie de récit ») passent parce qu'ils s'appuient sur le sujet (le tennis, que la description pose comme un univers à rituels) et pas sur le passage lui-même. Risque restant : si le passage est de l'interaction avec le public plutôt que du récit, « en racontant » sonnera faux. Au premier retour d'un abonné, c'est la phrase à revoir.
- R1 à R6 ne touchent à aucun intouchable (titres, `channelName`, `youtubeId`). La mesure du diff réel (P0 s11) reste à faire sur le JSON au moment de l'application.

## B1 Ngijol, 21/11

Texte jugé : B1 de `docs/copy/textes-videos-remplacees-s26.md` (l. 72-73), storytelling 1.4, `l__Xirj2N6c`, `steps[0].videos[1]`. Vidéo non visionnée (décision du fondateur). Même règle que le 20/11 pour le critère 1. Seule source sûre : le titre oEmbed « Thomas Ngijol - Superman - Jamel Comedy Club (2006) » (`docs/qa/remplacements-videos-s26.md`, l. 27). Le sketch décrit par Politis n'est pas rattaché à cette vidéo, et la montée en plusieurs marches n'est pas vérifiée (doc s26, l. 69 et 76). Technique de la fiche actuelle (`docs/content/parcours-storytelling-s18.json`, l. 139) : « banal, puis agaçant, puis dément », la montée, le deuxième acte.

| Champ | (1) Sourcé | (2) Technique | (3) Ton | (4) Typo | Verdict |
|---|---|---|---|---|---|
| title « Superman » | PASS (titre oEmbed) | PASS | PASS | PASS | GO |
| why proposé | **FAIL** (R7) | **FAIL** (R7) | PASS | PASS | NO-GO |

**R7. B1, why.** Trois affirmations reposent sur des points « À VÉRIFIER » que rien ne couvre :
- « et qui devient vite soûlant » : c'est le mot de Politis (« soûlant »), donc l'attribution non prouvée revient en douce dans le texte ;
- « qu'on devrait admirer » : le conditionnel annonce que le sketch démolit le héros, ce qui reprend la même source par la bande ;
- « Repère chaque marche entre les deux » : ça suppose plusieurs marches, soit exactement le point (2) non vérifié.

Critère 2 : si la vidéo ne monte pas par paliers, l'élève cherche des marches qui n'existent pas, et la phrase « c'est la montée » colle le nom de la technique sur autre chose. Il apprendrait une technique fausse.

Remplacer le why par :
> Le héros qu'on admire depuis l'enfance. Repère s'il dérape, et à quel moment : c'est là que commence la montée, le deuxième acte.

Pourquoi ça passe :
- (1) La première phrase parle de Superman en général, pas du sketch. « S'il dérape » est une consigne d'observation au conditionnel : rien n'est affirmé sur le contenu.
- (2) L'élève repère le point de départ (le héros admiré, l'équivalent du « banal ») puis le premier écart, et c'est bien là que commence la montée de la fiche. La phrase reste juste même si l'escalade est courte.
- (3) Tutoiement, phrases courtes, ni coach ni scolaire.
- (4) Zéro tiret cadratin, espace avant les deux-points.

Le title « Superman » ne change pas.

Hors critères (pas bloquant) : comme le notait déjà le doc s26, la vidéo sert la fiche moins nettement que « Le voisin ». Si le premier retour d'un abonné dit « il ne dérape pas », c'est le why à revoir, ou il faut passer au secours JCC prévu dans le doc s26 (l. 76). Pour le diff réel (P0 s11) : seuls le `title` et le `why` de `steps[0].videos[1]` changent, aucun intouchable n'est touché.
