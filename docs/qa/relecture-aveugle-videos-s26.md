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
