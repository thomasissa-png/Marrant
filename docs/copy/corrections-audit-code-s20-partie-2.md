# Corrections de l'audit des articles du code, partie 2 (s20) : proposition, rien appliqué

> @copywriter, 12/10/2026. Cible : champs `content` et `faqs[].answer` des articles de `apps/web/src/lib/blog-articles.ts` (l. 1602 à 3834), d'après `docs/qa/audit-articles-code-s20-partie-2.md`. **Aucune modification du code, aucun commit.** Les textes « Avant » sont recopiés du fichier (guillemets droits `"` et `'` du fichier, `**` du markdown). Les « Après » sont écrits pour rester dans le même registre (tutoiement, « pote drôle et bienveillant »), sans tiret cadratin.
> Périmètre : 11 articles « à corriger » ou « à revoir en profondeur » + la retouche de numérotation de `confiance-humour-apres-rupture`. Hors périmètre (redirigés 301) : `humour-apres-rupture`, `blagues-courtes-vs-longues`.
> Application prévue après relecture à l'aveugle (règle d'or P0 s18) : voir la section 7 (liste anonymisée) et `docs/copy/relecture-audit-code-s20/passages-partie-2.md`. La clé est tout en bas de CE fichier, à ne pas ouvrir avant les verdicts.

## 1. Synthèse

| Type | Corrections | Détail (numéros = section 4) |
|---|---|---|
| 1. Citation, propos ou anecdote introuvable : humoriste gardé, « dans la veine de » ou exemple imaginé | 36 | les 7 citations entre guillemets de l'audit (Fary ×3, Waly Dia, Mirabel, Pascot, Gardin : 1.1, 2.3, 6.2, 6.4, 7.1, 12.2, 13.2) + 29 propos, superlatifs, détails chiffrés ou anecdotes prêtés (les corrections de pause sont comptées au type 4) |
| 2. Fait faux corrigé, source donnée | 5 | Inès Reg « sans calcul » (1.4), FAQ « les études le confirment » (2.4), Blanche Gardin « plus de 10 ans » (3.7), « un palier par semaine » du Parcours Répartie (7.5), « module storytelling » devenu Parcours Storytelling (8.5) |
| 3. Étude fausse ou déformée retirée / remplacée par la vraie source | 5 | Université du Colorado 76 % (3.1), Stanford 23 % / 25 % dans la CLEF (5.1) et la FAQ (5.4), Université de Pennsylvanie (5.2), « 50 % des bons conversationnalistes » (6.6) |
| 4. Pause = « une seconde environ » | 4 | 3-4 s de Blanche Gardin (2.2), 2 s ×4 (10.4), 1,5 s ×3 (12.5), 1,5 s ×3 (13.6) |
| 5. « Règle des 3 secondes » : un seul sens (« attends un instant avant la chute ») | 1 correction, 6 chaînes | usage « réponds dans les 3 secondes » renommé « Réponds sans trop réfléchir » (6.3) |
| 6. Exemple ou ratio qui contredit sa propre règle ou le reste de l'article | 6 | exemple « Bon » Tinder (12.6), 70 % / 40 % / 3-4 sur 10 (3.2, 3.3), « personne n'écoute » (13.5), « palier 0 » (7.6), « 30 secondes » (6.8) |
| 7. Terme prêté à un chercheur réel (« hyper-monitoring social », Mark Leary) | 1 correction, 2 chaînes | 13.1 |
| 8. Pseudo-statistique reformulée sans chiffre | 4 | « 90 % » (1.5), « 65 % » (6.1), « 80 % » (12.7), « 90 % » (12.8) |
| 9. Forme ou sous la barre (chute, gabarit, libellé, numérotation) | 10 | « Ouf. » (1.6), astreinte (8.1), coq (12.1), gabarit `[humoriste]` (6.7), « sortie en 10 secondes » (9.2), numérotation imbriquée (11.1, 11.2), libellé de lien (2.5), lien storytelling (7.7), « promus plus vite » (5.3) |
| **Total** | **72 corrections** | 13 articles. 70 passages dans la liste anonymisée (3 corrections purement mécaniques n'y figurent pas : 2.5, 6.8, 7.6 ; la 6.3 y compte pour 2) |

**Mesure du diff** (P0 s11) : pas de shell dans cette session, donc pas de calcul automatique. Estimation manuelle : 72 corrections de 15 à 330 caractères, soit environ 14 000 caractères touchés sur environ 280 000 caractères de contenu et de FAQ pour les 13 articles (≈ 5 %), avant la passe mécanique des tirets d'intertitres. À recalculer par script à l'application. Intouchables non modifiés : slugs, titres, tous les H2 et H3 (une seule exception : le H2 « Technique 2 : La règle des 3 secondes » de `jamais-quoi-repondre-techniques`, renommé sur demande, voir 6.3), questions de FAQ, URL des liens (une seule exception signalée : 7.7), prix (2,99 € inchangé), nombres de parcours et de semaines.

## 2. Règles appliquées

Les 5 règles de correction validées le 12/10 (founder-preferences, dernière ligne), appliquées ainsi :
1. **Citation, propos ou anecdote introuvable** : l'humoriste reste. Une citation entre guillemets devient une idée reformulée « dans la veine de » (le guillemet disparaît, le nom reste), ou un exemple imaginé assumé (« Imagine… »). Aucun chiffre prêté à une personne réelle (« 70 % », « 15 personnes », « 40 minutes », « 3-4 secondes », « 20 personnes » retirés). Les faits sourcés restent (Mirabel à Bercy, timidité, scènes ouvertes).
2. **Pause** : « une seconde environ » partout. **Règle des 3 secondes** : le sens « attends un instant avant la chute » reste (c'est celui de `timing-humour`, hors périmètre) ; l'autre usage s'appelle « Réponds sans trop réfléchir ».
3. **Pseudo-statistique** (« 90 % des gens ») : « la plupart des gens », sans chiffre. Les chiffres pédagogiques cohérents restent (règle du 08/10) : « 10 fois plus », « multiplié par 3 », « 9 cas sur 10 », 30/70 d'exécution, 50 % du travail comique, 80 % des situations sociales, 70/30 du storytelling.
4. **Tirets d'intertitres** : non traités ici (passe mécanique à part).
5. **Gardin** : gardée, avec un fait juste (débuts au Jamel Comedy Club en 2006, premier spectacle solo en 2015).

## 3. Faits vérifiés (WebSearch du 12/10/2026, pages de résultats, pas de lecture intégrale des sources)

| Fait (article) | Verdict | Source |
|---|---|---|
| « Les leaders qui utilisent l'humour sont 23 % plus respectés » (blagues-travail) | **VRAI, mais déclaration des auteurs en interview** : Jennifer Aaker (Stanford GSB) dit à NPR que les leaders qui utilisent l'humour sont 23 % plus respectés et vus comme plus compétents et plus confiants, à condition que l'humour soit approprié. Aucun pourcentage pour la compétence, « 25 % plus appréciés » introuvable. Étude d'origine non nommée : le texte dit « rapportent ». | https://www.npr.org/transcripts/965572857 ; https://www.npr.org/2022/06/03/1102646998/jennifer-aaker-and-naomi-bagdonas-why-good-humor-makes-for-good-business |
| Humour et statut : Wharton + Harvard (blagues-travail) | **VRAI** : Bitterly, Brooks et Schweitzer, « Risky Business : When Humor Increases and Decreases Status ». Un humour approprié signale confiance et compétence et augmente le statut ; un humour inapproprié signale une faible compétence et le diminue. | https://knowledge.wharton.upenn.edu/article/using-humor-in-the-office-when-it-works-when-it-backfires/ ; https://www.bps.org.uk/research-digest/done-tastefully-joke-telling-work-could-make-you-appear-more-confident-and ; https://news.harvard.edu/gazette/story/2016/10/laugh-your-way-to-success/ |
| « 76 % des gens pensent ne pas être drôles, étude de l'Université du Colorado » (je-suis-pas-drole) | **INTROUVABLE** : le Humor Research Lab de CU Boulder existe, aucune publication ne donne ce chiffre. Retiré. | https://www.nhpr.org/post/researching-funny-university-colorados-humor-lab |
| Mark Leary (Duke), anxiété sociale (rester-muet-en-groupe) | **Chercheur réel, terme inventé** : « hyper-monitoring social » introuvable. La vraie théorie (Schlenker et Leary, 1982, *Psychological Bulletin* 92(3)) : on est anxieux en société quand on veut faire une certaine impression et qu'on doute d'y parvenir. Rien ne dit que l'effet augmente avec la taille du groupe. | https://scholars.duke.edu/individual/pub676982 ; https://www.mcmaster.ca/inabis98/ameringen/leary0485 |
| Poser des questions augmente l'appréciation (jamais-quoi-repondre) | **VRAI** : Huang, Yeomans, Brooks, Minson et Gino (Harvard), « It Doesn't Hurt to Ask: Question-Asking Increases Liking », 3 études de conversations réelles et speed-dating : ceux qui posent plus de questions, surtout de relance, sont mieux appréciés. | https://www.hks.harvard.edu/centers/cpl/publications/it-doesnt-hurt-ask-question-asking-increases-liking ; https://psychologicalscience.org/news/minds-business/asking-questions-increases-likability.html |
| « Les hommes aiment les femmes drôles, les études le confirment » (comment-faire-rire-un-homme, FAQ) | **DÉFORMÉ** : Bressler, Martin et Balshine (2006, *Evolution and Human Behavior* 27) : les hommes valorisent surtout une partenaire qui apprécie leur humour, les femmes un partenaire qui en produit ; répliqué par Hone, Hurwitz et Lieberman (2015). | https://abel.mcmaster.ca/publications/BresslerEtAl2006 |
| Blanche Gardin : « plus de 10 ans à oser faire du stand-up solo » | **DÉFORMÉ** : Jamel Comedy Club (1re saison) en 2006, premier seule-en-scène *Il faut que je vous parle* en 2015, soit environ 9 ans. | https://www.parisbouge.com/mag/articles/blanche-gardin-le-stand-up-trash-au-feminin-2655 ; https://www.sortiraparis.com/scenes/spectacle/articles/84413-blanche-gardin-a-la-nouvelle-seine-notre-critique ; https://en.wikipedia.org/wiki/Blanche_Gardin |
| Paul Mirabel : scènes ouvertes en nombre, timidité, Bercy | **VRAI** pour les scènes ouvertes (« jusqu'à cent passages par mois », sources secondaires), pour Bercy (Accor Arena, 10 et 11/04/2026) et pour une part de timidité dans son humour (« autodérision et situations embarrassantes »). « Marque de fabrique » est une interprétation : le texte dit « joue de sa timidité sur scène ». « 15 personnes », « 20 personnes », « citation d'interview » : introuvables, retirés. | https://www.accorarena.com/en/events-and-tickets/paul-mirabel--942cc ; https://fr.vikidia.org/wiki/Paul_Mirabel ; https://www.fnacspectacles.com/artist/paul-mirabel/ |
| Inès Reg « virale en étant juste elle-même, sans calcul » | **INEXACT** : la vidéo « Des paillettes dans ma vie, Kévin » (août 2019) est une scène de couple tournée avec son mari de l'époque ; elle affirme que c'était improvisé, d'autres sources parlent de mise en scène. Le texte dit désormais « en jouant une scène de couple que tout le monde a vécue ». | https://www.dexerto.fr/divertissement/des-paillettes-dans-ma-vie-kevin-video-ines-reg-enflamme-reseaux-sociaux-958404/ ; https://www.parismatch.be/lifestyle/technologie/2019/08/27/des-paillettes-dans-ma-vie-kevin-cette-video-hilarante-resume-parfaitement-la-vie-de-couple-ZUI35ENSVRB3NERADEYHGT23OA/ |
| Panayotis Pascot « décrit ses débuts : j'écrivais des trucs, je testais par messages » | **INTROUVABLE**, et ses débuts connus sont à la télévision (*Le Petit Journal*, *Quotidien*). Citation retirée, méthode présentée comme celle du site. | https://www.ozap.com/actu/-je-n-etais-pas-heureux-panayotis-pascot-revele-les-raisons-de-son-depart-de-quotidien/621595 |
| Fary : citations et « milliers de blagues », « 20 personnes » | **INTROUVABLES**. Seul fait trouvé : Time Out écrit que sa force comique est de « toujours trouver le moyen de parler de soi ». Reformulé en « dans la veine de Fary ». | https://www.timeout.fr/paris/comedie/fary-dans-hexagone |
| Waly Dia, Roman Frayssinet, Pierre Croce, Blanche Gardin (citations, silences, durées, « systématiquement ») | **INTROUVABLES** (aucune interview, mesure ou citation trouvée par l'audit ni par cette session). Mentions conservées. | aucune |
| « Un palier par semaine » du Parcours Répartie (timidite-et-humour) | **FAUX comme écrit** : le parcours a bien 4 semaines et une étape par semaine (`apps/web/src/config/premium.ts` l. 64 et 74 ; `apps/web/src/config/textes/entrees-parcours.ts` l. 72-81), mais ses étapes ne montent pas par taille de groupe : S1 « Tes premières répliques » (ironie bienveillante), S2 « Le rythme et les silences », S3 « Retourner les piques avec le sourire », S4 « Improviser sur l'inattendu » (`docs/content/parcours-seed.json` l. 281 et suivantes, `docs/content/parcours-reecriture-s17.json`). Reformulé sur ces faits (7.5). | code du dépôt |
| Parcours Storytelling publié | **VRAI** : `STORYTELLING_PUBLIE = true` (`apps/web/src/config/parcours-publication.ts` l. 12), slug `storytelling`, 6 semaines (`premium.ts` l. 77-78). | code du dépôt |
| Prix 2,99 €/mois ; Parcours Machine à Café 3 s, Répartie 4 s, Confiance 6 s | **VRAI** (inchangés). | `premium.ts` l. 73-75 |

## 4. Corrections détaillées (avant / après exacts)

Convention : chaque « Avant » est une chaîne unique du fichier (à vérifier par recherche exacte avant remplacement). Origine = ligne de l'audit (`audit-articles-code-s20-partie-2.md`) ; l. = ligne de `blog-articles.ts` avant correction.

### Article 1 : `comment-faire-rire-une-fille` (l. 1602)

**1.1** | type 1 | audit §2.1 (citation Fary introuvable) | `content` l. 1612
- Avant : `**Fary** l'a dit mieux que personne : "L'autodérision, c'est montrer qu'on est assez confiant pour rire de soi." C'est le contraire du mec qui essaie d'impressionner.`
- Après : `Dans la veine de **Fary**, qui sait parler de lui sur scène : l'autodérision, c'est montrer qu'on est assez confiant pour rire de soi. C'est le contraire du mec qui essaie d'impressionner.`
- Source : citation introuvable ; Time Out sur *Hexagone* (section 3).

**1.2** | type 1 | audit §2.1 (superlatif « préférée ») | `content` l. 1642
- Avant : `C'est un callback : la technique préférée de **Blanche Gardin** en spectacle.`
- Après : `C'est un callback, une technique qu'on retrouve chez **Blanche Gardin** en spectacle.`

**1.3** | type 1 | audit §2.1 (fait non trouvé) | `content` l. 1660
- Avant : `Regarde **Panayotis Pascot** en interview. Il laisse des blancs. Ces blancs créent de la tension, et la phrase d'après en est 10 fois plus drôle.`
- Après : `Imagine **Panayotis Pascot** en interview qui laisse un blanc avant de répondre : ce blanc crée de la tension, et la phrase d'après en est 10 fois plus drôle.`
- Exemple imaginé assumé ; « 10 fois plus drôle » gardé (règle du 08/10).

**1.4** | type 2 | audit §2.1 (« sans calcul » inexact) | `content` l. 1666
- Avant : `**Inès Reg** est devenue virale en étant juste elle-même, sans filtre, sans calcul.`
- Après : `**Inès Reg** est devenue virale en jouant une scène de couple que tout le monde a vécue, sans forcer.`
- Source : vidéo « Des paillettes dans ma vie, Kévin » (août 2019), scène de couple (section 3).

**1.5** | type 8 | audit §2.1 (« 90 % ») | `content` l. 1646
- Avant : `Et ça, c'est plus rare que tu ne crois. 90% des gens attendent juste leur tour pour parler.`
- Après : `Et ça, c'est plus rare que tu ne crois. La plupart des gens attendent juste leur tour pour parler.`

**1.6** | type 9 | audit §2.1 (chute « Ouf. » floue) | `content` l. 1636
- Avant : `"Au début, je t'ai trouvée normale. Et puis t'as parlé de ta collection de cactus. Ouf."`
- Après : `"Au début, je t'ai trouvée normale, j'étais presque déçu. Et puis t'as parlé de ta collection de cactus."`
- La chute porte désormais sur « cactus » (détail précis, en dernier mot), sans le recul ambigu. À relire à l'aveugle.

### Article 2 : `comment-faire-rire-un-homme` (l. 1704)

**2.1** | type 1 | audit §2.2 (« Fary parle souvent de ça ») | `content` l. 1722
- Avant : `**Fary** parle souvent de ça : le chambrage, c'est du lien social. Plus tu chambres quelqu'un, plus ça montre que tu l'apprécies : à condition de doser.`
- Après : `Dans la veine de **Fary**, le chambrage, c'est du lien social. Plus tu chambres quelqu'un, plus ça montre que tu l'apprécies : à condition de doser.`

**2.2** | type 4 (+ type 1) | audit §2.2 (3-4 secondes, gabarit réattribué) | `content` l. 1768
- Avant : `**Blanche Gardin** utilise des silences de 3-4 secondes avant certaines punchlines. Ces silences créent l'attente, et l'attente crée le rire.`
- Après : `**Blanche Gardin** laisse la salle attendre avant certaines punchlines ; en conversation, une seconde environ suffit. Ce silence crée l'attente, et l'attente crée le rire.`
- Même formule que les corrections s11 (« laisse la salle attendre ») ; durée du site : une seconde environ.

**2.3** | type 1 | audit §2.2 (citation Waly Dia = phrase du site, l. 1683) | `content` l. 1793
- Avant : `**Waly Dia** dit un truc juste : "Les gens drôles ne sont pas ceux qui font rire, ce sont ceux avec qui on se sent assez à l'aise pour rire." C'est exactement ça.`
- Après : `Dans la veine de **Waly Dia**, l'humour est d'abord une affaire de confort : on rit avec ceux auprès de qui on se sent à l'aise. C'est exactement ça.`
- Waly Dia reste ; la formulation n'est plus un quasi-doublon de la phrase du site à la l. 1683 (`comment-faire-rire-une-fille`). Si Thomas préfère la phrase sans nom, supprimer « Dans la veine de **Waly Dia**, ».

**2.4** | type 2 | audit §2.2 (FAQ « les études le confirment », déformé) | `faqs[1].answer` l. 1808
- Avant : `Oui, et les études le confirment : l'humour est un marqueur d'intelligence sociale et de confiance en soi. Les hommes apprécient les femmes qui les font rire parce que ça crée une dynamique de complicité, pas de performance.`
- Après : `Oui, mais pas forcément comme on l'imagine. Les études sont nuancées : dans l'expérience de Bressler, Martin et Balshine (2006), les hommes valorisaient surtout une partenaire qui apprécie leur humour, plus qu'une partenaire qui en produit. Ce qui compte, c'est la complicité, pas la performance : l'humour est un marqueur d'intelligence sociale et de confiance en soi.`
- Source : Bressler, Martin et Balshine 2006 (section 3). La suite de la réponse (« Blanche Gardin, Inès Reg, Florence Foresti… ») est inchangée.

**2.5** | type 9 (mécanique, hors liste anonymisée) | audit §2.2 (« repartie » sans accent, libellé qui promet des techniques de répartie vers `/conseils`) | `content` l. 1799
- Avant : `→ **[Nos techniques de répartie](/conseils)**, timing, repartie, autodérision : les outils des pros.`
- Après : `→ **[Nos conseils d'humour](/conseils)**, timing, répartie, autodérision : les outils des pros.`
- URL inchangée ; libellé aligné sur celui de `comment-faire-rire-une-fille` (l. 1689).

### Article 3 : `je-suis-pas-drole-comment-changer` (l. 1814) : à revoir en profondeur, réécriture limitée aux passages fautifs

**3.1** | type 3 | audit §2.3 (fausse étude Université du Colorado, calcul bancal 76 % / 3 sur 4 / 7 sur 10) | `content` l. 1820
- Avant : `T'es pas seul : 76% des gens pensent ne pas être drôles, selon une étude de l'Université du Colorado. Trois personnes sur quatre. Dans ta prochaine soirée, sur les 10 personnes présentes, 7 pensent secrètement comme toi. Y compris le mec qui a l'air super à l'aise. Il fait juste mieux semblant.`
- Après : `T'es pas seul : dans ta prochaine soirée, plusieurs personnes pensent exactement pareil, y compris le mec qui a l'air super à l'aise. Il fait juste mieux semblant.`
- Étude introuvable (section 3), idée conservée sans chiffre. L'accroche garde sa promesse (« tu n'es pas seul »). Le reste du paragraphe est inchangé.

**3.2** | type 6 | audit §2.3 (chiffre inventé prêté à Frayssinet, incohérent avec 40 % et 3-4 sur 10) | `content` l. 1842
- Avant : `**Roman Frayssinet** a un taux de réussite d'environ 70% sur scène. Autrement dit, même chez un pro, 30% de ses vannes ne marchent pas comme prévu, et ça ne l'empêche pas de continuer.`
- Après : `Même **Roman Frayssinet** a des vannes qui ne marchent pas comme prévu. C'est le métier, et ça ne l'empêche pas de continuer.`

**3.3** | type 6 | audit §2.3 (ratios contradictoires dans le même article) | `content` l. 1902
- Avant : `Quand tu acceptes que 40% de tes tentatives d'humour vont tomber à plat, tu arrêtes de te censurer.`
- Après : `Quand tu acceptes qu'une bonne partie de tes tentatives d'humour vont tomber à plat, tu arrêtes de te censurer.`
- Le seul repère chiffré de l'article devient « sur 10 tentatives d'humour, 3-4 vont marcher » (l. 1904, conservé).

**3.4** | type 1 | audit §2.3 (« Pascot parle de ça ») | `content` l. 1902
- Avant : `**Panayotis Pascot** parle de ça : la liberté de foirer.`
- Après : `Dans la veine de **Panayotis Pascot** : la liberté de foirer.`

**3.5** | type 1 | audit §2.3 (« 15 personnes », « une fois sur deux ») | `content` l. 1830
- Avant : `Sauf que Paul a fait des centaines d'open mics à Paris devant 15 personnes, avec des vannes qui tombaient à plat une fois sur deux.`
- Après : `Sauf que Paul a fait des centaines de scènes ouvertes à Paris, avec son lot de vannes qui tombaient à plat.`
- « Des centaines » est étayé (jusqu'à cent passages par mois, section 3).

**3.6** | type 1 | audit §2.3 (« milliers de blagues » Fary) | `content` l. 1830
- Avant : `**Fary** a écrit des milliers de blagues avant de trouver son style.`
- Après : `**Fary**, comme tous les pros, a beaucoup écrit et beaucoup jeté avant de trouver son style.`

**3.7** | type 2 | audit §2.3 (Gardin « plus de 10 ans à oser ») | `content` l. 1830
- Avant : `**Blanche Gardin** a mis plus de 10 ans à oser faire du stand-up solo.`
- Après : `**Blanche Gardin** a fait près de dix ans de scène avant son premier spectacle solo.`
- Source : Jamel Comedy Club 2006, *Il faut que je vous parle* 2015 (section 3).

**3.8** | type 1 | audit §2.3 (Waly Dia « petites salles de 30 personnes », pratique générale) | `content` l. 1870
- Avant : `**Waly Dia** ne teste pas ses nouvelles vannes à Bercy. Il les teste dans des petites salles de 30 personnes.`
- Après : `Les humoristes ne testent pas leurs nouvelles vannes à Bercy : ils les rodent dans de petites salles, **Waly Dia** comme les autres.`

### Article 4 : `repondre-moqueries-avec-humour` (l. 1939)

**4.1** | type 1 | audit §2.4 (« technique préférée ») | `content` l. 1961
- Avant : `La technique préférée de **Blanche Gardin**. Au lieu de nier la moquerie, tu l'acceptes et tu la pousses jusqu'à l'absurde.`
- Après : `Une technique qu'on retrouve chez **Blanche Gardin**. Au lieu de nier la moquerie, tu l'acceptes et tu la pousses jusqu'à l'absurde.`

**4.2** | type 1 | audit §2.4 (« constamment », « jamais ») | `content` l. 1980
- Avant : `**Fary** fait ça en interview constamment : il ne répond jamais à la question, il rebondit sur un mot et part ailleurs.`
- Après : `Dans la veine de **Fary** en interview : tu rebondis sur un mot et tu pars ailleurs, sans forcément répondre à la question.`

**4.3** | type 1 | audit §2.4 (« 40 minutes plus tard ») | `content` l. 2020
- Avant : `**Paul Mirabel** est le roi du callback en spectacle : il fait une blague en début de show, et la reprend 40 minutes plus tard dans un contexte totalement différent. Le public explose.`
- Après : `Le callback, **Paul Mirabel** le manie souvent en spectacle : une blague en début de show, reprise bien plus tard dans un contexte totalement différent. Le public explose.`

**4.4** | type 1 | audit §2.4 (Waly Dia, exemple imaginé assumé) | `content` l. 2038
- Avant : `**Waly Dia** fait ça sur scène quand un spectateur tente un truc : il le regarde, sourit, attend. Le public comprend. Le spectateur aussi.`
- Après : `Imagine **Waly Dia** sur scène quand un spectateur tente un truc : il le regarde, sourit, attend. Le public comprend. Le spectateur aussi.`

### Article 5 : `blagues-travail-faire-rire-pro` (l. 2079)

**5.1** | type 3 | audit §2.5 (Stanford « 23 % plus compétents et 25 % plus appréciés », déformé) | `content` l. 2087 (CLEF)
- Avant : `Selon une étude de Stanford, les leaders qui utilisent l'humour sont perçus comme 23% plus compétents et 25% plus appréciés. La clé : l'humour situationnel`
- Après : `Jennifer Aaker et Naomi Bagdonas, qui enseignent l'humour à Stanford, rapportent que les leaders qui utilisent l'humour sont jugés 23% plus respectés, et perçus comme plus compétents. La clé : l'humour situationnel`
- Source : interview NPR, https://www.npr.org/transcripts/965572857 (« 23 % plus respectés », « plus compétents », sans pourcentage pour la compétence ; « 25 % plus appréciés » introuvable). « Rapportent » signale que c'est la déclaration des auteurs.

**5.2** | type 3 | audit §2.5 (Pennsylvanie : vrai mais incomplet) | `content` l. 2093
- Avant : `Une étude de l'Université de Pennsylvanie montre que l'humour est un marqueur de compétence sociale et cognitive. Quand tu fais rire en réunion,`
- Après : `Une étude de chercheurs de Wharton (Université de Pennsylvanie) et de Harvard montre qu'une blague réussie te fait passer pour quelqu'un de plus sûr de toi et de plus compétent, et qu'une blague déplacée fait l'inverse. Quand tu fais rire en réunion,`
- Source : Bitterly, Brooks et Schweitzer, URL en section 3. La moitié « déplacée » sert le propos de l'article (« sans déraper »).

**5.3** | type 9 | audit §2.5 (« promus plus vite », causal non sourcé) | `content` l. 2095
- Avant : `3. **Les gens qui font rire sont promus plus vite.** Pas parce qu'ils sont "sympas", mais parce que l'humour est un signal de leadership. Tu gères le stress, tu communiques bien, tu crées de l'engagement.`
- Après : `3. **Un humour bien placé passe pour un signal de leadership.** Pas parce que tu es "sympa", mais parce que tu gères le stress, tu communiques bien, tu crées de l'engagement.`

**5.4** | type 3 | audit §2.5 (FAQ « 23% plus compétents (Stanford) ») | `faqs[1].answer` l. 2212
- Avant : `Oui, et les études le prouvent : les leaders qui utilisent l'humour sont perçus comme 23% plus compétents (Stanford). L'humour au travail est un marqueur d'intelligence sociale, de gestion du stress et de leadership.`
- Après : `Oui, et les chercheurs le constatent : Jennifer Aaker et Naomi Bagdonas (Stanford) rapportent que les leaders qui utilisent l'humour sont jugés 23% plus respectés, à condition que la blague reste appropriée. L'humour au travail est un marqueur d'intelligence sociale, de gestion du stress et de leadership.`

**5.5** | type 1 | audit §2.5 (« Fary ne place jamais ») | `content` l. 2129
- Avant : `**Fary** parle souvent du timing en spectacle : il ne place jamais une vanne au milieu d'un développement. Toujours dans une pause, une transition, un silence. En réunion, c'est pareil.`
- Après : `Dans la veine de **Fary** : on ne place pas une vanne au milieu d'un développement, mais dans une pause, une transition, un silence. En réunion, c'est pareil.`

**5.6** | type 1 | audit §2.5 (« règle » prêtée à Mirabel) | `content` l. 2153
- Avant : `**Paul Mirabel** a une règle : il ne se moque que de lui-même ou de situations universelles. Jamais d'attaques personnelles. Au bureau, c'est la même stratégie : vise la situation, pas les gens.`
- Après : `L'humour de **Paul Mirabel** vise surtout lui-même et des situations que tout le monde connaît. Au bureau, c'est la même stratégie : vise la situation, pas les gens.`

### Article 6 : `jamais-quoi-repondre-techniques` (l. 2218)

**6.1** | type 8 | audit §2.6 (« 65 % des gens ») | `content` l. 2226
- Avant : `Si ça t'arrive, tu fais partie des 65% des gens qui rapportent avoir régulièrement le "blanc conversationnel". C'est pas un défaut,`
- Après : `Si ça t'arrive, tu es loin d'être le seul à connaître le "blanc conversationnel". C'est pas un défaut,`

**6.2** | type 1 | audit §2.6 (interview de Mirabel introuvable) | `content` l. 2236
- Avant : `**Paul Mirabel** l'a décrit dans une interview : "Mes premiers open mics, j'avais le blanc total entre deux vannes. Mon cerveau disait 'tais-toi, tu vas te ridiculiser'." Et c'est un mec qui remplit Bercy aujourd'hui.`
- Après : `**Paul Mirabel**, qui joue de sa timidité sur scène, a commencé par enchaîner les scènes ouvertes, et c'est aujourd'hui un mec qui remplit Bercy.`
- Faits gardés et sourcés : timidité, scènes ouvertes, Bercy (section 3). La phrase qui précède (« C'est la même réaction que le trac. ») est inchangée.

**6.3** | type 5 | audit §2.6 et §3 (deux « règles des 3 secondes » opposées) | `content` et FAQ, 6 chaînes. Le sens retenu pour « règle des 3 secondes » reste celui de `timing-humour` (attendre un instant avant la chute) ; cet article, qui parle de répondre vite, ne porte plus ce nom.
- 6.3a, `content` l. 2222 :
  - Avant : `La solution tient en quelques phrases prêtes à l'emploi, une règle de timing et l'habitude de poser des questions.`
  - Après : `La solution tient en quelques phrases prêtes à l'emploi, une règle de rapidité et l'habitude de poser des questions.`
- 6.3b, H2 l. 2262 (seul intertitre modifié du lot ; l'ancre de sommaire change, aucun lien interne ne la vise, vérifié par Grep) :
  - Avant : `## Technique 2 : La règle des 3 secondes — Réponds avant de réfléchir`
  - Après : `## Technique 2 : Réponds sans trop réfléchir`
  - Si la passe mécanique des tirets est appliquée avant, l'« Avant » devient `## Technique 2 : La règle des 3 secondes : Réponds avant de réfléchir`.
- 6.3c, `content` l. 2266 :
  - Avant : `**La règle** : réponds dans les 3 secondes qui suivent la fin de la phrase de l'autre. N'importe quoi. Même un "hmm" ou un "ah ouais ?". Parce que :`
  - Après : `**La règle** : réponds dès que l'autre a fini sa phrase, sans chercher la réponse parfaite. N'importe quoi. Même un "hmm" ou un "ah ouais ?". Parce que :`
- 6.3d, `content` l. 2269 :
  - Avant : `2. C'est le silence après 3 secondes qui crée le malaise, même une réponse banale le prévient`
  - Après : `2. C'est le silence qui s'étire qui crée le malaise, même une réponse banale le prévient`
- 6.3e, `content` l. 2326 :
  - Avant : `1. Applique la règle des 3 secondes (Technique 2) dans chaque conversation`
  - Après : `1. Réponds sans trop réfléchir (Technique 2) dans chaque conversation`
- 6.3f, `faqs[2].answer` l. 2340 :
  - Avant : `applique la règle des 3 secondes (réponds n'importe quoi plutôt que rien, une réponse moyenne au bon moment vaut mieux qu'une réponse parfaite trop tard)`
  - Après : `réponds sans trop réfléchir (réponds n'importe quoi plutôt que rien, une réponse moyenne au bon moment vaut mieux qu'une réponse parfaite trop tard)`

**6.4** | type 1 | audit §2.6 (citation Fary) | `content` l. 2272
- Avant : `**Fary** a une technique en interview : il réagit d'abord ("Ah mais c'est intéressant ça") puis développe. La première réaction n'est jamais sa vraie réponse : c'est un accusé de réception qui maintient le flux.`
- Après : `Dans la veine de **Fary** en interview : tu réagis d'abord ("Ah mais c'est intéressant ça") puis tu développes. La première réaction n'est jamais ta vraie réponse : c'est un accusé de réception qui maintient le flux.`

**6.5** | type 1 | audit §2.6 (Waly Dia « utilise cette technique ») | `content` l. 2304
- Avant : `**Waly Dia** utilise cette technique en spectacle quand il interagit avec le public. Il reprend le mot de la personne et part dans une direction inattendue. En conversation, c'est pareil, mais pas besoin de partir dans l'absurde. Juste de relancer.`
- Après : `Imagine **Waly Dia** face au public : il reprend le mot de la personne et part dans une direction inattendue. En conversation, c'est pareil, mais pas besoin de partir dans l'absurde. Juste de relancer.`

**6.6** | type 3 | audit §2.6 (« 50 % des bons conversationnalistes », étude réelle disponible) | `content` l. 2290 (CLEF)
- Avant : `Ça maintient la conversation, te donne du temps, et montre que tu écoutes. 50% des "bons conversationnalistes" sont en réalité de bons questionneurs.`
- Après : `Ça maintient la conversation, te donne du temps, et montre que tu écoutes. Des chercheurs de Harvard ont observé que ceux qui posent des questions, surtout des questions de relance, sont plus appréciés.`
- Source : Huang, Yeomans, Brooks, Minson et Gino, « It Doesn't Hurt to Ask » (section 3).

**6.7** | type 9 | audit §2.6 (gabarit `[humoriste]` / `[sujet]` oublié) | `content` l. 2310
- Avant : `1. **Un truc que tu as vu/lu récemment** : "Vous avez vu le dernier spectacle de [humoriste] ? Le sketch sur [sujet] est incroyable"`
- Après : `1. **Un truc que tu as vu/lu récemment** : "Vous avez vu quoi de bien en ce moment ? Moi, je suis en pleine période Paul Mirabel."`
- Aucun fait prêté à l'humoriste (pas de « dernier spectacle », pas de sketch précis).

**6.8** | type 6 (mécanique, hors liste anonymisée) | audit §2.6 (FAQ « 30 secondes » incohérent avec la règle) | `faqs[3].answer` l. 2341
- Avant : `ça te donne 30 secondes pour formuler ta vraie réponse.`
- Après : `ça te donne quelques secondes pour formuler ta vraie réponse.`

### Article 7 : `timidite-et-humour` (l. 2345)

**7.1** | type 1 | audit §2.7 (citation Pascot introuvable, contredite par son parcours télé) | `content` l. 2398
- Avant : `C'est exactement comme ça que **Panayotis Pascot** décrit ses débuts : "J'écrivais des trucs, je testais par messages, je voyais ce qui faisait réagir." L'écrit sert de brouillon avant l'oral, et de filet de sécurité.`
- Après : `La méthode est simple : tu écris un truc, tu le testes par message, tu regardes ce qui fait réagir. L'écrit sert de brouillon avant l'oral, et de filet de sécurité.`
- Pascot reste cité à d'autres endroits de l'article (CLEF, clé 4). Ici l'écrit devient une méthode du site.

**7.2** | type 1 | audit §2.7 (« salles de 20 personnes », « maladive ») | `content` l. 2357 (CLEF)
- Avant : `**Paul Mirabel** a commencé dans des salles de 20 personnes avec une timidité maladive. Ils sont partis d'où tu es.`
- Après : `**Paul Mirabel** joue de sa timidité sur scène. Ils sont partis d'où tu es.`

**7.3** | type 1 | audit §2.7 (« Frayssinet teste ses sketches en conversation ») | `content` l. 2409
- Avant : `Tu répètes, en somme. **Roman Frayssinet** teste ses sketches en conversation avant de les mettre sur scène : tu fais exactement la même chose, en plus petit.`
- Après : `Tu répètes, en somme. Les humoristes rodent leurs vannes avant la scène, **Roman Frayssinet** comme les autres : tu fais exactement la même chose, en plus petit.`

**7.4** | type 1 | audit §2.7 (FAQ « introvertis maladroits ») | `faqs[0].answer` l. 2506
- Avant : `Panayotis Pascot et Paul Mirabel ont tous les deux commencé en introvertis maladroits. La timidité n'empêche pas l'humour`
- Après : `Paul Mirabel joue de sa timidité sur scène, et Panayotis Pascot de sa vulnérabilité. La timidité n'empêche pas l'humour`

**7.5** | type 2 | audit §2.7 et §5 (« un palier par semaine » du Parcours Répartie, à confirmer par @product-manager) | `content` l. 2466
- Avant : `C'est exactement la progression de notre [Parcours Répartie](/parcours/repartie) sur deviens-marrant.fr : 4 semaines structurées pour passer de "je sais jamais quoi dire" à "je gère", à raison d'un palier par semaine.`
- Après : `C'est la même logique de montée en douceur que notre [Parcours Répartie](/parcours/repartie) sur deviens-marrant.fr : 4 semaines structurées, une étape par semaine, de tes premières répliques à l'improvisation sur l'inattendu, pour passer de "je sais jamais quoi dire" à "je gère".`
- **Vérifié dans le code** : 4 semaines et une étape par semaine sont vrais (`premium.ts` l. 64 et 74). Mais « la même progression » que les 4 paliers par taille de groupe de l'article est faux : les étapes du parcours vont de « Tes premières répliques » à « Improviser sur l'inattendu » (`parcours-seed.json`, `parcours-reecriture-s17.json`). Lien `/parcours/repartie` conservé.

**7.6** | type 6 (mécanique, hors liste anonymisée) | audit §2.7 (FAQ « palier 0 » alors que le corps commence au palier 1) | `faqs[4].answer` l. 2527
- Avant : `Commence par le palier 0 : envoie une vanne par message à un seul ami de confiance.`
- Après : `Commence par le palier 1 : envoie une vanne par message à un seul ami de confiance.`
- Le corps dit « Le palier 1, c'est maintenant, ce soir, avec la première personne que tu vois » (l. 2470).

**7.7** | type 9 | audit §2.7 (lien « techniques de storytelling » vers le guide général alors que l'article dédié existe) | `content` l. 2388
- Avant : `C'est la même mécanique que les [techniques de storytelling](/blog/comment-devenir-drole) : tu apprends à extraire la substance drôle d'un fait réel.`
- Après : `C'est la même mécanique que les [techniques de storytelling](/blog/storytelling-drole-5-structures) : tu apprends à extraire la substance drôle d'un fait réel.`
- **Seule modification d'URL du lot** (la cible existe : slug `storytelling-drole-5-structures`, l. 2532). À valider par Thomas si les liens sont jugés intouchables.

### Article 8 : `storytelling-drole-5-structures` (l. 2532)

**8.1** | type 9 | audit §2.8 (« l'assistante de mon propre sommeil » : faute d'accord ou chute ratée) | `content` l. 2575
- Avant : `**Cran 3 (absurde total) :** "Du coup, je dors avec mon téléphone allumé. Je suis devenu l'assistante de mon propre sommeil."`
- Après : `**Cran 3 (absurde total) :** "Du coup, je dors avec mon téléphone allumé. Mon sommeil est d'astreinte, sans la prime."`
- Les deux défauts sont levés d'un coup (plus d'accord à faire, chute plus nette). À relire à l'aveugle.

**8.2** | type 1 | audit §2.8 (« signatures » établies) | `content` l. 2540
- Avant : `**Paul Mirabel, Fary, Roman Frayssinet, Blanche Gardin, Waly Dia** : chacun a ses signatures. Et ces signatures, elles s'apprennent.`
- Après : `**Paul Mirabel, Fary, Roman Frayssinet, Blanche Gardin, Waly Dia** : chez chacun, on reconnaît des façons de construire une histoire. Et ces façons de faire, elles s'apprennent.`

**8.3** | type 1 | audit §2.8 (« une par humoriste ») | `content` l. 2542
- Avant : `Voici les 5 structures à maîtriser, une par humoriste, avec des exercices pour les appliquer dès ce soir.`
- Après : `Voici les 5 structures à maîtriser, chacune avec un humoriste chez qui tu la reconnaîtras, et des exercices pour les appliquer dès ce soir.`
- Les H3 « La structure : Paul Mirabel » etc. et la FAQ (« l'escalade (Paul Mirabel)… ») ne changent pas : intertitres et FAQ intouchables, la mention reste lisible comme « l'humoriste chez qui on la reconnaît ».

**8.4** | type 1 | audit §2.8 (« 10 minutes plus tard ») | `content` l. 2634
- Avant : `Elle pose une info en passant, tu l'oublies, elle te la balance 10 minutes plus tard.`
- Après : `Elle pose une info en passant, tu l'oublies, elle te la balance bien plus tard.`

**8.5** | type 2 | audit §2.8 (« module storytelling » alors que le Parcours Storytelling existe ; « chaque humoriste » à vérifier) | `content` l. 2703
- Avant : `Les [parcours](/parcours) incluent un module storytelling avec exercices progressifs. Et pour voir les 5 structures en action sur des scènes réelles, nos [vidéos](/videos) analysées décortiquent les techniques de chaque humoriste.`
- Après : `Le [Parcours Storytelling](/parcours/storytelling) te fait pratiquer en 6 semaines, avec des exercices progressifs. Et pour voir ces structures en action sur des scènes réelles, nos [vidéos](/videos) analysées décortiquent les techniques des pros.`
- Source : `STORYTELLING_PUBLIE = true`, 6 semaines (section 3). Le lien `/parcours` devient `/parcours/storytelling` (cible existante) : modification d'URL signalée avec 7.7. « Les techniques de chaque humoriste » supposait une vidéo par humoriste cité, non vérifiée : « des pros ».

### Article 9 : `conversation-machine-a-cafe` (l. 2739)

**9.1** | type 1 | audit §2.9 (thèse prêtée à Pascot) | `content` l. 2797
- Avant : `L'autodérision sur soi, jamais sur le contexte professionnel. **Panayotis Pascot** en fait une démonstration sur scène : rire de soi montre qu'on est à l'aise ; rire des autres montre plutôt qu'on ne l'est pas.`
- Après : `L'autodérision sur soi, jamais sur le contexte professionnel. C'est l'esprit de **Panayotis Pascot**, qui rit d'abord de lui : rire de soi montre qu'on est à l'aise ; rire des autres montre plutôt qu'on ne l'est pas.`

**9.2** | type 9 | audit §2.9 (« sortie en 10 secondes » se lit comme une durée totale) | `content` l. 2853
- Avant : `4. **La sortie en 10 secondes.** Une bonne conversation machine à café dure entre 60 et 90 secondes. Pars sur une note positive, pas quand ça s'essouffle.`
- Après : `4. **Une sortie qui tient en une phrase.** Une bonne conversation machine à café dure entre 60 et 90 secondes. Pars sur une note positive, pas quand ça s'essouffle.`

### Article 10 : `repartie-soiree-anti-malaise` (l. 2907)

**10.1** | type 1 | audit §2.10 (spectacle non nommé, thèse prêtée) | `content` l. 2921
- Avant : `**Panayotis Pascot** explique dans un de ses spectacles que la peur du jugement est le plus grand tueur de répartie : ce qui manque, ce ne sont pas les idées, c'est l'audace de les sortir.`
- Après : `Dans la veine de **Panayotis Pascot** : la peur du jugement est le plus grand tueur de répartie. Ce qui manque, ce ne sont pas les idées, c'est l'audace de les sortir.`

**10.2** | type 1 | audit §2.10 (« 20 personnes ») | `content` l. 2931
- Avant : `**Fary** a passé des années d'open mic à se planter devant 20 personnes.`
- Après : `**Fary**, comme tous les humoristes, a connu des salles où ça ne riait pas.`

**10.3** | type 1 | audit §2.10 (« utilise souvent ce type de pivot ») | `content` l. 2999
- Avant : `**Roman Frayssinet** utilise souvent ce type de pivot dans ses spectacles : transformer le malaise en méta-commentaire absurde sur le malaise lui-même.`
- Après : `Dans la veine de **Roman Frayssinet** : transformer le malaise en méta-commentaire absurde sur le malaise lui-même.`

**10.4** | type 4 | audit §2.10 et §1.3 point 4 (pause de 2 secondes enseignée 4 fois) | 4 chaînes
- 10.4a, `content` l. 2938 (la pause après une vanne plantée est aussi alignée : « partout », décision du 12/10) :
  - Avant : `- Vanne plantée → silence → tu attends 2 secondes → "OK, j'annule mon spectacle."`
  - Après : `- Vanne plantée → silence → tu attends une seconde environ → "OK, j'annule mon spectacle."`
- 10.4b, `content` l. 3022 :
  - Avant : `Deux secondes de silence avant une réplique font 3x plus d'effet que la même réplique lancée tout de suite.`
  - Après : `Une seconde environ de silence avant une réplique fait 3x plus d'effet que la même réplique lancée tout de suite.`
- 10.4c, `content` l. 3029 :
  - Avant : `2. **Travaille la pause.** Après une vanne, attends 2 secondes avant de parler.`
  - Après : `2. **Travaille la pause.** Après une vanne, attends une seconde environ avant de parler.`
- 10.4d, `faqs[0].answer` l. 3041 :
  - Avant : `L'autodérision sèche est ta meilleure arme : attends 2 secondes, puis sors`
  - Après : `L'autodérision sèche est ta meilleure arme : attends une seconde environ, puis sors`
- « 3x plus d'effet » est gardé (chiffre pédagogique cohérent, règle du 08/10).

### Article 11 : `confiance-humour-apres-rupture` (l. 3212) : numérotation seulement

**11.1** | type 9 | audit §2.11 (« Étape 1 à 4 » imbriquées dans « Étape 2 », l. 3253-3268) | `content`
- Avant (4 lignes) :
  - `**Étape 1. Observer sans produire (première semaine) :**`
  - `**Étape 2. Partager des trucs drôles (deuxième semaine) :**`
  - `**Étape 3. Remarquer des absurdités du quotidien (troisième semaine) :**`
  - `**Étape 4. Faire une remarque à voix haute (quatrième semaine) :**`
- Après :
  - `**Semaine 1. Observer sans produire :**`
  - `**Semaine 2. Partager des trucs drôles :**`
  - `**Semaine 3. Remarquer des absurdités du quotidien :**`
  - `**Semaine 4. Faire une remarque à voix haute :**`
- Les H2 « Étape 1 à 5 » ne changent pas. Même renommage « Semaine N » proposé par l'audit.

**11.2** | type 9 | même ambiguïté de numérotation, dans la section « Étape 4 » (l. 3306) | `content`
- Avant : `4. **Les contextes plus larges.** Soirées, nouvelles rencontres, quand les étapes 1-3 sont stabilisées.`
- Après : `4. **Les contextes plus larges.** Soirées, nouvelles rencontres, quand les trois niveaux précédents sont stabilisés.`
- Non listé par l'audit mais de la même famille (« étapes 1-3 » désigne la liste juste au-dessus, pas les H2 « Étape 1 à 3 »). À retirer du lot si Thomas veut strictement la liste de l'audit.

### Article 12 : `pourquoi-blagues-marchent-pas` (l. 3371)

**12.1** | type 9 | audit §2.12 (blague-modèle « coq » faible, coq pour poule ; la paire Mauvais/Bon doit rester la même blague) | `content` l. 3387-3389
- Avant :
  `**Mauvais :** "Attendez attendez, j'ai une bonne, écoutez. Pourquoi le coq a deux ailes ? Pour traverser la route." (Personne ne rit.)`
  `**Bon :** "On a passé 200 000 ans à se demander pourquoi le coq traverse la route. Personne lui a jamais demandé comment il allait."`
- Après :
  `**Mauvais :** "Attendez attendez, j'ai une bonne, écoutez. Ça fait trois semaines que je réponds 'non' quand on me dit 'ça va ?'. Personne a relevé." (Personne ne rit.)`
  `**Bon :** "Ça fait trois semaines que je réponds 'non' quand on me dit 'ça va ?'. Personne a relevé."`
- La règle illustrée (ne pas annoncer sa blague) est inchangée, la phrase « Différence : pas d'annonce, pas de pression… » qui suit reste vraie. Observation du quotidien, pas une blague connue. À relire à l'aveugle.

**12.2** | type 1 | audit §2.12 (citation Fary introuvable) | `content` l. 3417
- Avant : `**Fary** dit souvent : "Ma règle, c'est : si la blague a besoin d'une notice, elle a échoué. La punchline doit être comme une porte qui claque : sec, fini."`
- Après : `Dans la veine de **Fary**, la règle tient en deux lignes : si la blague a besoin d'une notice, elle a échoué, et la punchline doit être comme une porte qui claque : sec, fini.`

**12.3** | type 1 | audit §2.12 (Pierre Croce « parfois 2 secondes ») | `content` l. 3397
- Avant : `**Pierre Croce** maîtrise ça à la précision : il pose son setup, **il attend** (parfois 2 secondes, une éternité sur scène), et lâche la chute quand le public a commencé à anticiper.`
- Après : `**Pierre Croce** maîtrise ça à la précision : il pose son setup, **il laisse la salle attendre**, et lâche la chute quand le public a commencé à anticiper. Une seconde environ suffit : sur scène, c'est une éternité.`

**12.4** | type 1 | audit §2.12 (propos prêtés à Frayssinet) | `content` l. 3465
- Avant : `**Roman Frayssinet** dit que la pire chose à faire après une blague qui rate, c'est d'essayer de la sauver : tu enterres deux fois au lieu d'une.`
- Après : `Dans la veine de **Roman Frayssinet** : la pire chose à faire après une blague qui rate, c'est d'essayer de la sauver. Tu enterres deux fois au lieu d'une.`

**12.5** | type 4 | audit §1.3 point 4 (pause de 1,5 s, 3 occurrences) | 3 chaînes
- 12.5a, `content` l. 3401 :
  - Avant : `**Bon (avec pause après "cuisiner hier") :** "Mon coloc a essayé de cuisiner hier... [pause d'1,5 sec] les voisins ont fermé leurs fenêtres."`
  - Après : `**Bon (avec pause après "cuisiner hier") :** "Mon coloc a essayé de cuisiner hier... [pause d'une seconde environ] les voisins ont fermé leurs fenêtres."`
- 12.5b, `content` l. 3403 :
  - Avant : `Tu rajoutes 1,5 seconde de silence à la même phrase, et l'effet est multiplié par 3.`
  - Après : `Tu rajoutes une seconde environ de silence à la même phrase, et l'effet est multiplié par 3.`
- 12.5c, `faqs[1].answer` l. 3491 :
  - Avant : `(pause de 1,5 seconde avant la chute la deuxième fois)`
  - Après : `(pause d'une seconde environ avant la chute la deuxième fois)`

**12.6** | type 6 | audit §2.12 (garde-fou du 08/10 : exemple « Bon » qui contredit sa règle : setup 5 mots, punchline 11 mots, alors que la chute doit être « toujours plus courte » et que le public décroche au mot 8) | `content` l. 3431-3433
- Avant :
  `**Bon :** "Six mois sur Tinder, bilan : c'est une thérapie, sauf que le psy ne me répond jamais."`
  `Setup 5 mots, punchline 11 mots : sec et clair.`
- Après :
  `**Bon :** "Six mois sur Tinder, j'ai parlé de moi à des inconnus qui ne répondent jamais. Une thérapie, quoi."`
  `Setup 15 mots, punchline 3 mots : sec et clair.`
- Comptage : « Six mois sur Tinder, j'ai parlé de moi à des inconnus qui ne répondent jamais. » = 15 mots ; « Une thérapie, quoi. » = 3 mots, bien sous le seuil du mot 8. Le « Mauvais » (l. 3429) et la règle (l. 3427) sont inchangés. À relire à l'aveugle.

**12.7** | type 8 | audit §2.12 (« 80 % des blagues qui marchent pas ») | `content` l. 3439
- Avant : `Regarde-toi. 80% des "blagues qui marchent pas" sont en fait des blagues correctement écrites`
- Après : `Regarde-toi. La plupart des "blagues qui marchent pas" sont en fait des blagues correctement écrites`

**12.8** | type 8 | audit §2.12 (« 90 % de ton problème », le chiffre retiré le 12/10) | `content` l. 3475
- Avant : `la raison 1 (annoncer la blague) et la raison 2 (timing) sont 90% de ton problème.`
- Après : `la raison 1 (annoncer la blague) et la raison 2 (timing) sont l'essentiel de ton problème.`

**12.9** | type 1 | audit §2.12 (FAQ Croce et Mirabel) | `faqs[3].answer` l. 3501
- Avant : `Pierre Croce et Paul Mirabel construisent une bonne partie de leur stand-up sur cette mécanique de pause et de silence.`
- Après : `Dans la veine de Pierre Croce ou de Paul Mirabel, on construit une bonne partie de son stand-up sur cette mécanique de pause et de silence.`

### Article 13 : `rester-muet-en-groupe` (l. 3634)

**13.1** | type 7 | audit §2.13 (« hyper-monitoring social » prêté à Mark Leary, terme introuvable) | `content` l. 3654 et `faqs[0].answer` l. 3811
- 13.1a, `content` :
  - Avant : `Des chercheurs en psychologie sociale (notamment Mark Leary, Université Duke) appellent ça l'**hyper-monitoring social** : plus le groupe est grand, plus on évalue ses propres mots, plus le délai augmente, plus on rate la fenêtre de tir. C'est une boucle.`
  - Après : `Le psychologue Mark Leary (Université Duke), spécialiste de l'anxiété sociale, l'explique ainsi : on se tait quand on tient à faire bonne impression et qu'on doute d'y arriver. Résultat, on évalue ses propres mots, le délai augmente, on rate la fenêtre de tir. C'est une boucle.`
  - Source : Schlenker et Leary 1982, *Psychological Bulletin* 92(3) (section 3). L'effet de la taille du groupe, non sourcé, est retiré.
- 13.1b, `faqs[0].answer` :
  - Avant : `C'est l'hyper-monitoring social : plus le groupe est grand, plus ton cerveau évalue tes phrases avant de les sortir, plus le délai augmente, plus tu rates la fenêtre de tir.`
  - Après : `C'est la peur de mal faire impression : quand on tient à bien paraître et qu'on doute d'y arriver (c'est la théorie du psychologue Mark Leary), ton cerveau évalue tes phrases avant de les sortir, le délai augmente, tu rates la fenêtre de tir.`

**13.2** | type 1 | audit §2.13 (citation Gardin introuvable) | `content` l. 3724
- Avant : `**Blanche Gardin** parle souvent de cette mécanique : elle dit que dans une conversation, "ce n'est pas le mec le plus drôle qui parle, c'est le mec qui place le bon truc dans le bon trou de silence." C'est le timing, pas la blague.`
- Après : `Dans la veine de **Blanche Gardin** : dans une conversation, ce n'est pas le mec le plus drôle qui parle, c'est le mec qui place le bon truc dans le bon trou de silence. C'est le timing, pas la blague.`

**13.3** | type 1 | audit §2.13 (Inès Reg « a fait carrière sur cette posture ») | `content` l. 3706
- Avant : `**Inès Reg** a fait carrière sur cette posture : celle qui pose la question que tout le monde se pose et que personne n'ose poser.`
- Après : `Dans la veine d'**Inès Reg** : celle qui pose la question que tout le monde se pose et que personne n'ose poser.`

**13.4** | type 1 | audit §2.13 (FAQ : trait de personnalité prêté à 3 personnes réelles) | `faqs[4].answer` l. 3831
- Avant : `La plupart des humoristes professionnels (Roman Frayssinet, Blanche Gardin, Panayotis Pascot) sont des introvertis qui ont appris à utiliser leur sensibilité comme matière première.`
- Après : `Paul Mirabel joue de sa timidité sur scène, et des humoristes comme Roman Frayssinet, Blanche Gardin ou Panayotis Pascot ont fait de l'observation leur matière première.`
- Les trois noms restent ; « sont des introvertis » (trait de personnalité) est retiré.

**13.5** | type 6 | audit §2.13 et §3 (« Personne n'écoute vraiment dans un groupe » contredit `timidite-et-humour` l. 2415 et la technique 3 du même article) | `content` l. 3700
- Avant : `Personne n'écoute vraiment dans un groupe. Du coup, **poser une question naïve** est souvent un acte de courage utile :`
- Après : `Dans un groupe, l'attention est diffuse. Du coup, **poser une question naïve** est souvent un acte de courage utile :`

**13.6** | type 4 | audit §1.3 point 4 (fenêtre de 1,5 seconde) | `content` l. 3722 et `faqs[2].answer` l. 3821
- 13.6a, `content` :
  - Avant : `Le moment d'or, c'est **les 1,5 seconde après une chute** : quelqu'un finit une histoire, le groupe rit, et il y a une fenêtre de 1,5 seconde avant que la personne suivante ne reprenne la parole.`
  - Après : `Le moment d'or, c'est **la seconde qui suit une chute** : quelqu'un finit une histoire, le groupe rit, et il y a une fenêtre d'une seconde environ avant que la personne suivante ne reprenne la parole.`
- 13.6b, `faqs[2].answer` :
  - Avant : `(3) le timing des 1,5 seconde après une chute, la fenêtre de tir où la conversation est ouverte.`
  - Après : `(3) le timing de la seconde qui suit une chute, la fenêtre de tir où la conversation est ouverte.`

## 5. Points relevés et NON corrigés (avec la raison)

**5.1 Bloqués par vos contraintes** (intertitres protégés ou passe mécanique à part, à trancher par Thomas) :
- `comment-faire-rire-une-fille` : numérotation des H2 incohérente (« Comment faire rire… avec l'autodérision » sans numéro, « 2. », « 3. », « Faire rire une fille en prouvant que tu écoutes » sans numéro, « 5. », « 6. »). `comment-faire-rire-un-homme` : même défaut (« 2. », « 3. », « 4. », « 6. », techniques 1 et 5 sans numéro). Corriger = modifier des H2 (ancres de sommaire). Proposition : retirer tous les numéros, ou renuméroter de 1 à 6.
- `pourquoi-blagues-marchent-pas` : le H2 « Le test du miroir : 3 façons de récupérer une blague qui tombe à plat » ne parle pas de miroir (le test vidéo est plus bas). `storytelling-drole-5-structures` : H2 « Comment l'escalade peut transformer une anecdote banale ? » (manque « -elle »). H2 : non touchés.
- Tirets cadratins des H2/H3 (38 sur 10 articles) : passe mécanique à part, non traités. La seule modification d'intertitre de ce lot est 6.3b (renommage de la règle), écrite sans tiret.

**5.2 Chiffres pédagogiques gardés** (règle du 08/10, non sourcés mais cohérents et agréables à lire) : « 10 fois plus » (articles 1 et 2), « multiplié par 3 » et « 3x plus d'effet » (les durées changent, pas les multiplicateurs), « 9 cas sur 10 » et 30 % d'idée / 70 % d'exécution (`pourquoi-blagues-marchent-pas`, y compris la FAQ), 50 % du travail comique, « 80 % des situations sociales » (`je-suis-pas-drole`), « le timing fait 80 % de la blague » (`blagues-travail`), « la structure fait 70 % du travail » (`storytelling`), « 3-4 sur 10 vont marcher » (devenu le seul repère de `je-suis-pas-drole`), « 80 % des situations où tu resterais muet » (`jamais-quoi-repondre`). Pris ensemble, 70 %, 80 % et 50 % se contredisent d'un article à l'autre (audit §1.4, criticité basse) ; chacun reste tolérable seul. Si Thomas veut aller plus loin : « l'essentiel du travail » prêt à remplacer, sans y toucher sans son GO.

**5.3 « À qui ça s'adresse ? »** (`pourquoi-blagues-marchent-pas`, `rester-muet-en-groupe`, audit §1.4 « gabarit visible ») : relu phrase par phrase, chaque « Que tu sois… , la raison 6 est ta priorité » a bien une proposition principale (la syntaxe n'est pas cassée). Le défaut est stylistique (même gabarit « Que tu… Que tu… Ou que tu… » dans deux articles), pas une faute : non corrigé, à réécrire seulement si Thomas veut varier.

**5.4 Durées de silence qui ne sont pas « la pause avant la chute »** (audit muet, à trancher) :
- `repondre-moqueries-avec-humour` l. 2041 et FAQ l. 2075 : « tu ne dis rien pendant 3 secondes » (technique silence + sourire face à une moquerie, un autre geste que la pause d'une blague). Proposition si Thomas veut tout aligner : « tu ne dis rien un instant ».
- `jamais-quoi-repondre-techniques` l. 2248 (« te donne 3 secondes pour formuler la suite ») et, hors lot, `comment-avoir-de-la-repartie` l. 155 et 230 (« 2 à 3 secondes » pour l'accusé de réception) : durée pour gagner du temps avant de répondre, pas pause de comédie.
- À vérifier dans la partie 1 (hors de ce lot) : `timing-humour` l. 238-262 et 278-305 (« 2 à 3 secondes », « attends 3 secondes », « Les 3 secondes ») et `raconter-blague-sans-massacrer` l. 1061-1074 gardent encore leurs durées. Le nom « règle des 3 secondes » est resté dans `timing-humour` et `llms-content.ts` l. 106, avec le sens « attends avant la chute » : cohérent avec ce lot, mais la durée « 3 secondes » de `timing-humour` doit être alignée sur « une seconde environ » par la partie 1.

**5.5 Hors périmètre ou hors audit** :
- `confiance-humour-apres-rupture` l. 3289 : « Waly Dia utilise **systématiquement** ce troisième niveau » (invérifiable, audit §2.11). Non traité (périmètre = numérotation seulement) ; correction prête : « Waly Dia utilise souvent ce troisième niveau ».
- `je-suis-pas-drole-comment-changer` l. 1911-1913 : la liste des parcours (3/4/6 semaines) ne mentionne ni Storytelling ni Boulot : incomplète, pas fausse.
- `comment-faire-rire-un-homme` l. 1748 et 1783 : l'article parle à un homme qui veut faire rire un homme, mais deux exemples sont au féminin (« Je suis tellement nulle en tout », « Jouer la naïve… pour "être mignonne" »). Relevé de lecture, absent de l'audit, non corrigé.
- Caractérisations de style laissées en l'état (audit : « acceptables ») : Frayssinet roi de l'observation, Mirabel et le pivot, Waly Dia et l'exagération (`comment-faire-rire-une-fille`) ; Mirabel « ne dit jamais voici une blague » et Inès Reg « proportionnée » (`pourquoi-blagues-marchent-pas`) ; Pascot « référence absolue » de l'autodérision (`timidite-et-humour`) ; fight, flight, freeze ; Crawford et Caltabiano 2011 (vrai, la FAQ le dit correctement).
- Motif de la redirection `seo-redirects.data.cjs:31` (« article sans témoignages fictifs ») : redevient exact une fois 13.2 appliqué (la citation Gardin disparaît).
- Statut 200 / 301 des 13 slugs : non confirmé par `curl` (pas de shell dans cette session), comme dans l'audit.

## 6. Points d'attention pour l'application

- **Source de vérité** : ces 11 articles sont servis par `blog-articles.ts` avant la base (`findBlogArticle`, audit §0). Les chaînes se remplacent donc dans ce fichier, pas via le JSON de la refonte s11. Les phrases S4 de `blog-liens-s4-s20.ts` qui citent `conversation-machine-a-cafe` ou `storytelling-drole-5-structures` sont des liens VERS ces articles, insérés dans d'autres articles (base) : aucune chaîne en commun avec ce lot (vérifié par Grep).
- **Faits à jour** : mettre à jour `updatedAt` (aujourd'hui `"2026-09-29"`) des 11 articles à la date de mise en ligne réelle ; relancer IndexNow sur les 11 slugs.
- **FAQ et données structurées** : 12 réponses de FAQ changent (2.4, 5.4, 6.3f, 6.8, 7.4, 7.6, 10.4d, 12.5c, 12.9, 13.1b, 13.4, 13.6b). Le JSON-LD FAQPage suit automatiquement. Aucune question de FAQ ne change.
- **Tests** : vérifier qu'aucun test ne fige l'une des chaînes remplacées (Grep fait : seuls `blog-corrections-s11-s20.test.ts` et le JSON `blog-article-rewrites.json` contiennent « 23% », « règle des 3 secondes » ou « 1,5 seconde », et ce sont d'autres articles). Ajouter un garde-fou : aucune occurrence de « Colorado », « hyper-monitoring », « taux de réussite », « 1,5 seconde », « palier par semaine » dans `blog-articles.ts`.
- **Mesure du diff réel** (P0 s11) à produire par script après application : taux de changement par article, et contrôle que slugs, H2/H3 (hors 6.3b), questions de FAQ, URL (hors 7.7 et 8.5), prix et nombres de semaines sont identiques à `HEAD`.
- **Ordre** : relecture à l'aveugle d'abord (section 7), application ensuite, avec `REPLIT_ACTIONS.md` et `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`.
- **Méthode** : recherches web par moteur de résumé, aucune page ouverte en intégralité ; décomptes de mots (12.6) faits à la main.

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/Marrant/docs/copy/corrections-audit-code-s20-partie-2.md` ; `/home/user/Marrant/docs/copy/relecture-audit-code-s20/passages-partie-2.md` (liste anonymisée seule + consigne). Aucune modification du code, aucun commit.
- Décisions : framework = correction éditoriale minimale (pas de réécriture) ; conscience = Problem-Aware (lecteur Yanis arrivé de Google) ; registre inchangé « pote drôle et bienveillant », tutoiement, zéro tiret cadratin ; pause unique « une seconde environ » ; « règle des 3 secondes » = attendre avant la chute, l'autre usage devient « Réponds sans trop réfléchir » ; tous les humoristes conservés ; études fausses remplacées par la vraie source (Aaker/NPR, Bitterly et al., Huang et al., Schlenker et Leary, Bressler et al.).
- Points d'attention : section 5 (non corrigés), dont les décisions de Thomas sur les H2 numérotés et les durées de silence hors pause ; deux URL modifiées (7.7, 8.5) ; relecture à l'aveugle de la section 7 avant toute mise en ligne (règle d'or P0 s18) ; promesse « un palier par semaine » vérifiée dans le code et corrigée (7.5).

---

## 7. Liste anonymisée pour la relecture à l'aveugle (70 passages, ordre mélangé)

> Même contenu que `docs/copy/relecture-audit-code-s20/passages-partie-2.md` (la section 7 est copiée dans ce fichier, sans la clé ni les sections 1 à 6, pour la relecture).

**B1**
- Avant : **Fary**, comme tous les pros, a beaucoup écrit et beaucoup jeté avant de trouver son style.
- Passage : **Blanche Gardin** a fait près de dix ans de scène avant son premier spectacle solo.
- Après : Les gens drôles ne sont pas nés drôles : ils ont commencé plus tôt que toi. Leur "naturel" est le résultat de milliers d'heures de pratique.

**B2**
- Avant : Tu n'as pas besoin d'être drôle, tu as besoin de rebondir. Le rebond montre que tu écoutes et que tu es engagé dans la conversation. C'est souvent suffisant.
- Passage : Imagine **Waly Dia** face au public : il reprend le mot de la personne et part dans une direction inattendue. En conversation, c'est pareil, mais pas besoin de partir dans l'absurde. Juste de relancer.
- Après : (intertitre) Technique 5 : La "banque de sujets"

**B3**
- Avant : C'est la peur de tout le monde. Et c'est aussi ce qui arrive aux meilleurs.
- Passage : **Fary**, comme tous les humoristes, a connu des salles où ça ne riait pas.
- Après : La différence entre lui et quelqu'un qui arrête, c'est la façon de gérer le plat.

**B4**
- Avant : (FAQ) Oui : être introverti, c'est avoir besoin de calme pour recharger, pas être incapable de parler.
- Passage : Paul Mirabel joue de sa timidité sur scène, et des humoristes comme Roman Frayssinet, Blanche Gardin ou Panayotis Pascot ont fait de l'observation leur matière première.
- Après : L'observation est même un avantage pour les introvertis : tu vois ce que les autres ratent.

**B5**
- Avant : Paradoxe : les gens les plus drôles sont ceux qui s'autorisent à ne pas l'être. Ils tentent, ça marche pas, ils haussent les épaules et passent à autre chose sans en faire un drame.
- Passage : Dans la veine de **Panayotis Pascot** : la liberté de foirer.
- Après : Quand tu acceptes qu'une bonne partie de tes tentatives d'humour vont tomber à plat, tu arrêtes de te censurer.

**B6**
- Avant : C'est comme un joueur de tennis : le retour de service est un réflexe, pas une réflexion.
- Passage : (intertitre) Technique 2 : Réponds sans trop réfléchir / Ton ennemi n°1, c'est le perfectionnisme verbal. Tu veux que ta réponse soit pertinente, drôle, bien formulée... et pendant que tu optimises, le silence s'installe. / **La règle** : réponds dès que l'autre a fini sa phrase, sans chercher la réponse parfaite. N'importe quoi. Même un "hmm" ou un "ah ouais ?". Parce que : / 1. Une réponse moyenne dite au bon moment vaut mieux qu'une réponse parfaite dite trop tard / 2. C'est le silence qui s'étire qui crée le malaise, même une réponse banale le prévient
- Après : 3. Tu peux toujours compléter/corriger ta première réponse : tu ne peux pas compenser un blanc

**B7**
- Avant : L'autodérision sur soi, jamais sur le contexte professionnel.
- Passage : C'est l'esprit de **Panayotis Pascot**, qui rit d'abord de lui : rire de soi montre qu'on est à l'aise ; rire des autres montre plutôt qu'on ne l'est pas.
- Après : **La sortie élégante :** "Bon, bonne réunion. Je prends des notes en vrai, promis."

**B8**
- Avant : Et il l'évalue sept fois, sous tous les angles, comme un jury de Top Chef devant une mousse au chocolat. Pendant ce temps, le sujet est passé.
- Passage : Le psychologue Mark Leary (Université Duke), spécialiste de l'anxiété sociale, l'explique ainsi : on se tait quand on tient à faire bonne impression et qu'on doute d'y arriver. Résultat, on évalue ses propres mots, le délai augmente, on rate la fenêtre de tir. C'est une boucle. / (FAQ) C'est la peur de mal faire impression : quand on tient à bien paraître et qu'on doute d'y arriver (c'est la théorie du psychologue Mark Leary), ton cerveau évalue tes phrases avant de les sortir, le délai augmente, tu rates la fenêtre de tir.
- Après : (intertitre) Mécanisme 2 : le syndrome du ticket de caisse

**B9**
- Avant : "Je suis pas drôle", tu l'as sûrement pensé après un blanc en soirée, ou le jour où ta vanne a eu pour seule réponse un "ah." poli.
- Passage : T'es pas seul : dans ta prochaine soirée, plusieurs personnes pensent exactement pareil, y compris le mec qui a l'air super à l'aise. Il fait juste mieux semblant.
- Après : > **CLEF :** "Je suis pas drôle" n'est pas un diagnostic, c'est une croyance.

**B10**
- Avant : Donc sois drôle, mais reste en terrain sûr. L'observation partagée marche toujours, l'autodérision légère aussi. Le chambrage, seulement avec quelqu'un que tu connais vraiment bien.
- Passage : L'humour de **Paul Mirabel** vise surtout lui-même et des situations que tout le monde connaît. Au bureau, c'est la même stratégie : vise la situation, pas les gens.
- Après : (intertitre) Les 3 vannes passe-partout d'afterwork

**B11**
- Avant : **Paul Mirabel, Fary, Roman Frayssinet, Blanche Gardin, Waly Dia** : chez chacun, on reconnaît des façons de construire une histoire. Et ces façons de faire, elles s'apprennent.
- Passage : Voici les 5 structures à maîtriser, chacune avec un humoriste chez qui tu la reconnaîtras, et des exercices pour les appliquer dès ce soir.
- Après : > **CLEF :** Le storytelling humour n'est pas une question d'inspiration, c'est de l'architecture narrative.

**B12**
- Avant : **Test simple :** demande à un pote de te filmer pendant que tu racontes une blague.
- Passage : Regarde-toi. La plupart des "blagues qui marchent pas" sont en fait des blagues correctement écrites mais racontées avec un visage de PV de réunion.
- Après : (intertitre) Raison 7 : Le contexte est mort avant que tu commences

**B13**
- Avant : Ce "non" fait plus rire qu'un paragraphe. Parce que le timing est parfait.
- Passage : **Blanche Gardin** laisse la salle attendre avant certaines punchlines ; en conversation, une seconde environ suffit. Ce silence crée l'attente, et l'attente crée le rire.
- Après : Notre article sur le [timing en humour](/blog/timing-humour) explique cette mécanique en détail.

**B14**
- Avant : 2. **L'humour crée du lien plus vite qu'un team building.** Un bon mot à la machine à café fait plus pour la cohésion d'équipe que 3 heures de paintball sous la pluie.
- Passage : 3. **Un humour bien placé passe pour un signal de leadership.** Pas parce que tu es "sympa", mais parce que tu gères le stress, tu communiques bien, tu crées de l'engagement.
- Après : (intertitre) Zone 1 : La machine à café

**B15**
- Avant : Le simple fait de formuler à l'écrit entraîne ton cerveau à trouver l'angle comique.
- Passage : C'est la même mécanique que les [techniques de storytelling](/blog/storytelling-drole-5-structures) : tu apprends à extraire la substance drôle d'un fait réel.
- Après : (intertitre) Clé 2 : L'humour écrit d'abord

**B16**
- Avant : **Mauvais (débit mitraillette) :** "Mon coloc a essayé de cuisiner hier les voisins ont fermé leurs fenêtres."
- Passage : **Bon (avec pause après "cuisiner hier") :** "Mon coloc a essayé de cuisiner hier... [pause d'une seconde environ] les voisins ont fermé leurs fenêtres." / Tu rajoutes une seconde environ de silence à la même phrase, et l'effet est multiplié par 3. / (FAQ) Test simple : raconte la même vanne deux fois, à deux groupes différents, en variant uniquement le timing (pause d'une seconde environ avant la chute la deuxième fois).
- Après : Pour creuser le sujet, on a un guide complet sur [le timing en humour](/blog/timing-humour).

**B17**
- Avant : Pourquoi ça marche ? Parce que ça prouve que tu écoutes. Et ça, c'est plus rare que tu ne crois.
- Passage : La plupart des gens attendent juste leur tour pour parler.
- Après : Toi, tu recycles ce qu'on te dit pour en faire quelque chose de drôle.

**B18**
- Avant : Parfois, la meilleure réponse, c'est pas de réponse. Juste un regard, un sourire, et le silence.
- Passage : Imagine **Waly Dia** sur scène quand un spectateur tente un truc : il le regarde, sourit, attend. Le public comprend. Le spectateur aussi.
- Après : **Situation :** Quelqu'un te balance une moquerie méchante.

**B19**
- Avant : Si c'est un emoji rire, tu as une vanne. Si c'est "ok..." tu as une donnée.
- Passage : Tu répètes, en somme. Les humoristes rodent leurs vannes avant la scène, **Roman Frayssinet** comme les autres : tu fais exactement la même chose, en plus petit.
- Après : Et pour les répliques en direct, nos [10 techniques de répartie](/blog/comment-avoir-de-la-repartie) prennent le relais.

**B20**
- Avant : Il glisse l'observation dans le flux, et le rire vient parce que personne ne l'a vu venir.
- Passage : **Mauvais :** "Attendez attendez, j'ai une bonne, écoutez. Ça fait trois semaines que je réponds 'non' quand on me dit 'ça va ?'. Personne a relevé." (Personne ne rit.) / **Bon :** "Ça fait trois semaines que je réponds 'non' quand on me dit 'ça va ?'. Personne a relevé."
- Après : Différence : pas d'annonce, pas de pression, pas de "préparez-vous". Juste le truc qui sort.

**B21**
- Avant : Reprends un truc qu'elle a dit il y a 20 minutes et replace-le dans un nouveau contexte.
- Passage : C'est un callback, une technique qu'on retrouve chez **Blanche Gardin** en spectacle.
- Après : Elle mentionne qu'elle a peur des pigeons. 20 minutes plus tard, devant un parc : "Bon, on traverse ou tu veux un gilet pare-pigeons ?"

**B22**
- Avant : (intertitre) Technique 1 : L'accord exagéré
- Passage : Une technique qu'on retrouve chez **Blanche Gardin**. Au lieu de nier la moquerie, tu l'acceptes et tu la pousses jusqu'à l'absurde.
- Après : L'attaquant ne s'y attend pas du tout.

**B23**
- Avant : Avant un événement social (soirée, afterwork, réunion informelle), prépare 3 sujets dans ta tête. Pas des discours, juste des amorces.
- Passage : 1. **Un truc que tu as vu/lu récemment** : "Vous avez vu quoi de bien en ce moment ? Moi, je suis en pleine période Paul Mirabel."
- Après : 2. **Une question sur l'autre** : "Tu fais quoi ce week-end ?" / "T'as testé le nouveau resto à côté du bureau ?"

**B24**
- Avant : **L'exemple :**
- Passage : - Vanne plantée → silence → tu attends une seconde environ → "OK, j'annule mon spectacle." / Une seconde environ de silence avant une réplique fait 3x plus d'effet que la même réplique lancée tout de suite. / 2. **Travaille la pause.** Après une vanne, attends une seconde environ avant de parler. / (FAQ) L'autodérision sèche est ta meilleure arme : attends une seconde environ, puis sors 'OK, j'annule mon spectacle' ou 'Dans ma tête c'était hilarant, on va s'en tenir à ça'.
- Après : - Ou : "Bon. Dans ma tête c'était hilarant. On va s'en tenir à ça."

**B25**
- Avant : (intertitre) Technique 7 : Le timing des silences
- Passage : Le moment d'or, c'est **la seconde qui suit une chute** : quelqu'un finit une histoire, le groupe rit, et il y a une fenêtre d'une seconde environ avant que la personne suivante ne reprenne la parole. / (FAQ) (3) le timing de la seconde qui suit une chute, la fenêtre de tir où la conversation est ouverte.
- Après : Pas avant (tu coupes), pas après (c'est fermé). À toi de placer ton observation préparée.

**B26**
- Avant : Sauf que Paul a fait des centaines de scènes ouvertes à Paris, avec son lot de vannes qui tombaient à plat.
- Passage : **Fary**, comme tous les pros, a beaucoup écrit et beaucoup jeté avant de trouver son style.
- Après : **Blanche Gardin** a fait près de dix ans de scène avant son premier spectacle solo.

**B27**
- Avant : 3. Tu peux toujours compléter/corriger ta première réponse : tu ne peux pas compenser un blanc
- Passage : Dans la veine de **Fary** en interview : tu réagis d'abord ("Ah mais c'est intéressant ça") puis tu développes. La première réaction n'est jamais ta vraie réponse : c'est un accusé de réception qui maintient le flux.
- Après : Pour approfondir cette technique, nos [10 techniques de répartie](/blog/comment-avoir-de-la-repartie) détaillent comment l'accusé de réception devient un réflexe.

**B28**
- Avant : La répartie en soirée, ce n'est pas juste avoir des vannes prêtes. C'est gérer la **pression sociale en temps réel** : avec du bruit, de l'alcool, des gens que tu connais à moitié, et l'impression que tout le monde te regarde.
- Passage : Dans la veine de **Panayotis Pascot** : la peur du jugement est le plus grand tueur de répartie. Ce qui manque, ce ne sont pas les idées, c'est l'audace de les sortir.
- Après : Et ce n'est pas une question de confiance en soi innée : c'est une compétence.

**B29**
- Avant : Tu déclenches deux réactions possibles : soit quelqu'un t'explique (et la conversation rebascule autour de toi), soit tout le monde réalise que personne n'avait suivi non plus, et tu deviens le héros silencieux du groupe.
- Passage : Dans la veine d'**Inès Reg** : celle qui pose la question que tout le monde se pose et que personne n'ose poser.
- Après : (intertitre) Technique 5 : Le piggyback (s'accrocher à quelqu'un)

**B30**
- Avant : Dans la veine de **Panayotis Pascot** : la liberté de foirer.
- Passage : Quand tu acceptes qu'une bonne partie de tes tentatives d'humour vont tomber à plat, tu arrêtes de te censurer.
- Après : Et c'est en arrêtant de te censurer que tu trouves les pépites.

**B31**
- Avant : C'est la même réaction que le trac.
- Passage : **Paul Mirabel**, qui joue de sa timidité sur scène, a commencé par enchaîner les scènes ouvertes, et c'est aujourd'hui un mec qui remplit Bercy.
- Après : (intertitre) Les 3 vraies causes du "je sais jamais quoi répondre"

**B32**
- Avant : Pour te constituer une base de structures testées, le catalogue de [vannes](/vannes) classe les exemples par type de construction comique.
- Passage : Le [Parcours Storytelling](/parcours/storytelling) te fait pratiquer en 6 semaines, avec des exercices progressifs. Et pour voir ces structures en action sur des scènes réelles, nos [vidéos](/videos) analysées décortiquent les techniques des pros.
- Après : Si tu veux aussi progresser sur la manière d'apprendre à être drôle plus globalement, le guide [Comment devenir drôle](/blog/comment-devenir-drole) couvre tous les piliers.

**B33**
- Avant : (FAQ) Parce que l'humour repose sur la libération d'une tension. Sans pause avant la punchline, il n'y a pas de tension à libérer, donc pas de rire. Une blague moyenne avec un excellent timing fait sourire ; une bonne blague avec un mauvais timing tombe à plat.
- Passage : Dans la veine de Pierre Croce ou de Paul Mirabel, on construit une bonne partie de son stand-up sur cette mécanique de pause et de silence.
- Après : (fin de la réponse)

**B34**
- Avant : (FAQ, question) Les hommes aiment les femmes drôles ?
- Passage : Oui, mais pas forcément comme on l'imagine. Les études sont nuancées : dans l'expérience de Bressler, Martin et Balshine (2006), les hommes valorisaient surtout une partenaire qui apprécie leur humour, plus qu'une partenaire qui en produit. Ce qui compte, c'est la complicité, pas la performance : l'humour est un marqueur d'intelligence sociale et de confiance en soi.
- Après : Blanche Gardin, Inès Reg, Florence Foresti : elles font rire tout le monde, sans adapter leur style.

**B35**
- Avant : "Bon, point suivant : le budget. Profitez, c'était la partie joyeuse."
- Passage : Dans la veine de **Fary** : on ne place pas une vanne au milieu d'un développement, mais dans une pause, une transition, un silence. En réunion, c'est pareil.
- Après : Tu ne coupes pas le flux : tu le ponctues. Notre article sur le [timing en humour](/blog/timing-humour) détaille cette mécanique.

**B36**
- Avant : Les meilleurs humoristes ne "sont" pas drôles. Ils utilisent des structures narratives précises qui transforment n'importe quelle anecdote banale en histoire qui fait rire.
- Passage : **Paul Mirabel, Fary, Roman Frayssinet, Blanche Gardin, Waly Dia** : chez chacun, on reconnaît des façons de construire une histoire. Et ces façons de faire, elles s'apprennent.
- Après : Voici les 5 structures à maîtriser, chacune avec un humoriste chez qui tu la reconnaîtras, et des exercices pour les appliquer dès ce soir.

**B37**
- Avant : En stand-up, la chute est **toujours plus courte** que l'amorce. Si ton setup fait 12 mots et ta punchline en fait 25, tu vas perdre l'attention avant l'atterrissage. **Le public décroche au mot 8** d'une punchline trop longue. / **Mauvais :** "Tinder ? J'y suis depuis 6 mois et je crois que ça m'a appris plus de choses sur ma propre psychologie, sur mes blocages relationnels et sur ma capacité à juger les autres en 3 secondes que 10 ans de psychanalyse à 90 balles la séance."
- Passage : **Bon :** "Six mois sur Tinder, j'ai parlé de moi à des inconnus qui ne répondent jamais. Une thérapie, quoi." / Setup 15 mots, punchline 3 mots : sec et clair.
- Après : (intertitre) Raison 6 : Tu manques d'énergie ou tu en as trop

**B38**
- Avant : **Ce qui ne marche pas :** les chambrages sur des sujets sensibles (physique, travail, famille). Tu le connais pas assez pour aller là.
- Passage : Dans la veine de **Fary**, le chambrage, c'est du lien social. Plus tu chambres quelqu'un, plus ça montre que tu l'apprécies : à condition de doser.
- Après : (intertitre) 2. L'humour décalé : Dire le truc que personne attendait

**B39**
- Avant : 1. **Les gens drôles sont perçus comme plus intelligents.**
- Passage : Une étude de chercheurs de Wharton (Université de Pennsylvanie) et de Harvard montre qu'une blague réussie te fait passer pour quelqu'un de plus sûr de toi et de plus compétent, et qu'une blague déplacée fait l'inverse.
- Après : Quand tu fais rire en réunion, tu envoies un message aux autres : "cette personne a compris la situation mieux que tout le monde, et en plus elle sait le dire."

**B40**
- Avant : Chaque palier est un niveau à débloquer : tu ne passes au suivant que quand le précédent est devenu confortable.
- Passage : C'est la même logique de montée en douceur que notre [Parcours Répartie](/parcours/repartie) sur deviens-marrant.fr : 4 semaines structurées, une étape par semaine, de tes premières répliques à l'improvisation sur l'inattendu, pour passer de "je sais jamais quoi dire" à "je gère".
- Après : **Les erreurs à éviter dans la progression :**

**B41**
- Avant : Une blague, c'est un rythme : setup, pause, punchline. La pause **avant** la chute crée la tension. La tension libérée, c'est le rire. Sans pause, pas de tension. Sans tension, juste une phrase plate.
- Passage : **Pierre Croce** maîtrise ça à la précision : il pose son setup, **il laisse la salle attendre**, et lâche la chute quand le public a commencé à anticiper. Une seconde environ suffit : sur scène, c'est une éternité.
- Après : Le décalage entre ce qu'on attend et ce qui arrive, c'est l'humour.

**B42**
- Avant : Paradoxe : les gens les plus drôles ne sont pas ceux qui essaient d'être drôles.
- Passage : **Inès Reg** est devenue virale en jouant une scène de couple que tout le monde a vécue, sans forcer.
- Après : Les meilleurs moments d'humour en date ou en soirée, c'est quand tu dis un truc que tu penses vraiment, avec un angle légèrement décalé.

**B43**
- Avant : (intertitre) Technique 5 : Le callback
- Passage : Le callback, **Paul Mirabel** le manie souvent en spectacle : une blague en début de show, reprise bien plus tard dans un contexte totalement différent. Le public explose.
- Après : En conversation, tu peux faire pareil. Quelqu'un se moque de toi à 20h.

**B44**
- Avant : > **CLEF :** La timidité n'est pas l'opposé de l'humour. C'est souvent son meilleur carburant. Les introvertis observent plus, parlent moins, et créent naturellement l'effet de surprise : l'ingrédient n°1 du rire. **Panayotis Pascot** a construit toute sa carrière sur sa vulnérabilité.
- Passage : **Paul Mirabel** joue de sa timidité sur scène. Ils sont partis d'où tu es.
- Après : (intertitre) Tu n'es pas "pas drôle". Tu es juste mal équipé.

**B45**
- Avant : 3. **Les petits groupes de connaissances.** 3-4 personnes que tu connais à moitié. Objectif : une remarque drôle par soirée, pas dix.
- Passage : 4. **Les contextes plus larges.** Soirées, nouvelles rencontres, quand les trois niveaux précédents sont stabilisés.
- Après : Chaque interaction réussie, même micro, recalibre la confiance.

**B46**
- Avant : (intertitre) Comment faire rire une fille avec l'autodérision
- Passage : Dans la veine de **Fary**, qui sait parler de lui sur scène : l'autodérision, c'est montrer qu'on est assez confiant pour rire de soi. C'est le contraire du mec qui essaie d'impressionner.
- Après : Raconte un truc où tu passes pour un idiot : un idiot attachant.

**B47**
- Avant : (intertitre) Piste 3 : Teste en terrain safe avant le grand bain
- Passage : Les humoristes ne testent pas leurs nouvelles vannes à Bercy : ils les rodent dans de petites salles, **Waly Dia** comme les autres.
- Après : Toi pareil. Teste tes observations et tes vannes avec :

**B48**
- Avant : Les gens qui "ont toujours quelque chose à dire" posent en réalité beaucoup de questions. C'est leur secret. Ils ne parlent pas plus : ils font parler les autres et rebondissent sur ce qui est dit.
- Passage : > **CLEF :** Poser une question est la réponse la plus sous-estimée face au blanc conversationnel. Ça maintient la conversation, te donne du temps, et montre que tu écoutes. Des chercheurs de Harvard ont observé que ceux qui posent des questions, surtout des questions de relance, sont plus appréciés.
- Après : (intertitre) Technique 4 : Le rebond sur le dernier mot

**B49**
- Avant : Ou (version plus culottée) : "Bien. On va dire que ce sujet a quitté la soirée avant nous."
- Passage : Dans la veine de **Roman Frayssinet** : transformer le malaise en méta-commentaire absurde sur le malaise lui-même. La technique, c'est de nommer l'inconfort de façon tellement décalée que ça le dédramatise.
- Après : (intertitre) Situation 5 : La soirée s'essouffle et tu veux finir sur une bonne note

**B50**
- Avant : (intertitre) Technique 4 : La question idiote assumée
- Passage : Dans un groupe, l'attention est diffuse. Du coup, **poser une question naïve** est souvent un acte de courage utile :
- Après : - "Attendez, c'est quoi le padel, exactement ?"

**B51**
- Avant : **Paul Mirabel** remplit Bercy. Tu le regardes et tu te dis "ce mec est né drôle".
- Passage : Sauf que Paul a fait des centaines de scènes ouvertes à Paris, avec son lot de vannes qui tombaient à plat.
- Après : **Fary**, comme tous les pros, a beaucoup écrit et beaucoup jeté avant de trouver son style.

**B52**
- Avant : Si tu sais jamais quoi répondre, ce n'est ni un manque d'intelligence ni un défaut de personnalité : c'est un réflexe qui n'a pas été entraîné.
- Passage : La solution tient en quelques phrases prêtes à l'emploi, une règle de rapidité et l'habitude de poser des questions. / (plan d'action) 1. Réponds sans trop réfléchir (Technique 2) dans chaque conversation / (FAQ) 3 leviers : garde en tête 5 réponses passe-partout (kit de survie), réponds sans trop réfléchir (réponds n'importe quoi plutôt que rien, une réponse moyenne au bon moment vaut mieux qu'une réponse parfaite trop tard), et prépare 3 sujets dans ta tête avant chaque événement social.
- Après : Tu connais la scène : en groupe, quelqu'un te pose une question, ou pire, te chambre. Et là, rien.

**B53**
- Avant : 3. **L'autodérision courte.** "Je suis encore en mode week-end" ou "ou c'est juste moi ?" : une micro-autodérision par échange suffit.
- Passage : 4. **Une sortie qui tient en une phrase.** Une bonne conversation machine à café dure entre 60 et 90 secondes. Pars sur une note positive, pas quand ça s'essouffle.
- Après : 5. **Garder 3 phrases en poche.** Tu n'improvises pas à 8h30 avec ton premier café.

**B54**
- Avant : À toi de placer ton observation préparée.
- Passage : Dans la veine de **Blanche Gardin** : dans une conversation, ce n'est pas le mec le plus drôle qui parle, c'est le mec qui place le bon truc dans le bon trou de silence. C'est le timing, pas la blague.
- Après : > **CLEF :** Les 7 techniques se résument en une seule règle : **n'attends pas l'idée parfaite, prends l'espace verbal disponible**.

**B55**
- Avant : (intertitre) Croyance n°3 : "Quand je fais une blague et que ça marche pas, c'est la preuve que je suis nul"
- Passage : Même **Roman Frayssinet** a des vannes qui ne marchent pas comme prévu. C'est le métier, et ça ne l'empêche pas de continuer.
- Après : Toi, tu fais une vanne, ça tombe à plat, et tu conclus : "je suis pas drôle".

**B56**
- Avant : Et 20 minutes plus tard, la réponse parfaite arrive, pile quand le sujet a changé trois fois.
- Passage : Si ça t'arrive, tu es loin d'être le seul à connaître le "blanc conversationnel". C'est pas un défaut, c'est un manque de réflexes, et les réflexes, ça se programme.
- Après : > **CLEF :** Le blanc conversationnel ("je sais jamais quoi répondre") n'est pas un problème d'intelligence ni de personnalité, c'est un réflexe qui n'a pas été entraîné.

**B57**
- Avant : **Blanche Gardin** excelle dans les callbacks sur plusieurs minutes.
- Passage : Elle pose une info en passant, tu l'oublies, elle te la balance bien plus tard.
- Après : L'effet est dévastateur parce que tu ne l'as pas vu venir, mais rétrospectivement, tu réalises que le signe était là depuis le début.

**B58**
- Avant : Que tu cherches à placer plus de vannes au boulot, les raisons 3 (public) et 7 (contexte) sont les plus importantes : un open space n'est pas une scène.
- Passage : Ou que tu galères en soirée à faire rire alors que tu en es capable en privé, la raison 1 (annoncer la blague) et la raison 2 (timing) sont l'essentiel de ton problème.
- Après : Sur deviens-marrant.fr, on a des [conseils](/conseils) ciblés sur chaque erreur, un catalogue de [vannes](/vannes) déjà calibrées par contexte (pour éviter le mauvais public), et des [vidéos](/videos) de pros à analyser au ralenti.

**B59**
- Avant : Ce qui change, c'est le contexte. En date, le chambrage léger crée de la complicité. Entre amis, les références partagées solidifient le groupe. Au travail, l'observation fine te rend mémorable.
- Passage : Dans la veine de **Waly Dia**, l'humour est d'abord une affaire de confort : on rit avec ceux auprès de qui on se sent à l'aise. C'est exactement ça.
- Après : **Comment faire rire un homme** se résume à ça : crée un climat où le rire est naturel, pas une performance.

**B60**
- Avant : (FAQ, question) Est-ce que l'humour est professionnel ?
- Passage : Oui, et les chercheurs le constatent : Jennifer Aaker et Naomi Bagdonas (Stanford) rapportent que les leaders qui utilisent l'humour sont jugés 23% plus respectés, à condition que la blague reste appropriée. L'humour au travail est un marqueur d'intelligence sociale, de gestion du stress et de leadership.
- Après : La clé : l'humour situationnel, pas les blagues de comptoir.

**B61**
- Avant : **Cran 2 (légèrement exagéré) :** "Le dimanche à 23h. Avec 'URGENT' dans l'objet."
- Passage : **Cran 3 (absurde total) :** "Du coup, je dors avec mon téléphone allumé. Mon sommeil est d'astreinte, sans la prime."
- Après : Chaque étape est plus inattendue que la précédente. Et chaque étape crée une attente pour la suivante.

**B62**
- Avant : **Stratégie 3. Le silence assumé :** tu ne dis rien, tu fais juste un demi-sourire et tu passes à autre chose. Surtout, ne répète pas la blague plus fort, et ne l'explique pas.
- Passage : Dans la veine de **Roman Frayssinet** : la pire chose à faire après une blague qui rate, c'est d'essayer de la sauver. Tu enterres deux fois au lieu d'une.
- Après : (intertitre) Comment t'entraîner à corriger ces 7 erreurs

**B63**
- Avant : Le cerveau adore être surpris. Tu commences une phrase dans une direction, et tu tournes.
- Passage : "Au début, je t'ai trouvée normale, j'étais presque déçu. Et puis t'as parlé de ta collection de cactus."
- Après : **Paul Mirabel** utilise ça en permanence : setup normal → pivot absurde → punchline au mauvais endroit.

**B64**
- Avant : > **CLEF :** L'humour au travail n'est pas un risque, c'est un avantage compétitif.
- Passage : Jennifer Aaker et Naomi Bagdonas, qui enseignent l'humour à Stanford, rapportent que les leaders qui utilisent l'humour sont jugés 23% plus respectés, et perçus comme plus compétents.
- Après : La clé : l'humour situationnel (réagir à ce qui se passe) plutôt que les blagues formatées.

**B65**
- Avant : (FAQ) Oui, et la timidité est souvent un atout. Les introvertis observent plus, parlent moins, et créent naturellement l'effet de surprise quand ils interviennent.
- Passage : Paul Mirabel joue de sa timidité sur scène, et Panayotis Pascot de sa vulnérabilité. La timidité n'empêche pas l'humour : elle demande juste des techniques adaptées.
- Après : (fin de la réponse)

**B66**
- Avant : Si tu dois expliquer pourquoi c'est drôle, c'est mort. La punchline doit atterrir et **se fermer toute seule**. Quand tu rajoutes "tu vois ce que je veux dire ?" ou "enfin c'est plus drôle dans le contexte", tu es en train d'enterrer ta propre vanne.
- Passage : Dans la veine de **Fary**, la règle tient en deux lignes : si la blague a besoin d'une notice, elle a échoué, et la punchline doit être comme une porte qui claque : sec, fini.
- Après : **Mauvais :** "Mon proprio m'a augmenté le loyer de 15%, et toi tu sais l'inflation c'est 3%, donc en gros il me vole, c'est ça que je veux dire, c'est abusé."

**B67**
- Avant : La plupart des mecs parlent trop. Par nervosité, par envie de combler le vide, par peur du silence. Or le silence n'est pas un trou à boucher.
- Passage : Imagine **Panayotis Pascot** en interview qui laisse un blanc avant de répondre : ce blanc crée de la tension, et la phrase d'après en est 10 fois plus drôle.
- Après : En pratique : après ta punchline, ne rajoute rien. Pas de "haha tu vois ce que je veux dire ?".

**B68**
- Avant : Attrape un seul mot dans la phrase de l'autre et construis ta réponse dessus.
- Passage : Dans la veine de **Fary** en interview : tu rebondis sur un mot et tu pars ailleurs, sans forcément répondre à la question.
- Après : **Situation :** "Tu manges encore ?"

**B69**
- Avant : **L'humour écrit (messages, groupes WhatsApp, réponses Instagram), c'est ton terrain d'entraînement idéal.** Tu as le temps de formuler. Tu peux relire avant d'envoyer. Tu peux corriger. Et si ça tombe à plat, tu n'as pas à gérer 12 visages qui te regardent.
- Passage : La méthode est simple : tu écris un truc, tu le testes par message, tu regardes ce qui fait réagir. L'écrit sert de brouillon avant l'oral, et de filet de sécurité.
- Après : **Les 3 formats d'entraînement écrits, du plus sûr au moins sûr :**

**B70**
- Avant : **Le programme en douceur :**
- Passage : **Semaine 1. Observer sans produire :** (3 puces) / **Semaine 2. Partager des trucs drôles :** (3 puces) / **Semaine 3. Remarquer des absurdités du quotidien :** (3 puces) / **Semaine 4. Faire une remarque à voix haute :** (3 puces)
- Après : > **À retenir :** L'humour se reconstruit du plus facile au plus exposé : consommer avant de produire, partager avant de créer, observer avant de raconter.

---

## 8. Clé de la liste anonymisée (NE PAS OUVRIR AVANT LES VERDICTS)

> Pour la relecture, utiliser le fichier `passages-partie-2.md`, qui ne contient ni cette clé ni les sections 1 à 6.

| Lettre | Correction | Lettre | Correction | Lettre | Correction | Lettre | Correction |
|---|---|---|---|---|---|---|---|
| B1 | 3.7 | B19 | 7.3 | B37 | 12.6 | B55 | 3.2 |
| B2 | 6.5 | B20 | 12.1 | B38 | 2.1 | B56 | 6.1 |
| B3 | 10.2 | B21 | 1.2 | B39 | 5.2 | B57 | 8.4 |
| B4 | 13.4 | B22 | 4.1 | B40 | 7.5 | B58 | 12.8 |
| B5 | 3.4 | B23 | 6.7 | B41 | 12.3 | B59 | 2.3 |
| B6 | 6.3 (b, c, d : intertitre et règle) | B24 | 10.4 | B42 | 1.4 | B60 | 5.4 |
| B7 | 9.1 | B25 | 13.6 | B43 | 4.3 | B61 | 8.1 |
| B8 | 13.1 | B26 | 3.6 | B44 | 7.2 | B62 | 12.4 |
| B9 | 3.1 | B27 | 6.4 | B45 | 11.2 | B63 | 1.6 |
| B10 | 5.6 | B28 | 10.1 | B46 | 1.1 | B64 | 5.1 |
| B11 | 8.3 | B29 | 13.3 | B47 | 3.8 | B65 | 7.4 |
| B12 | 12.7 | B30 | 3.3 | B48 | 6.6 | B66 | 12.2 |
| B13 | 2.2 | B31 | 6.2 | B49 | 10.3 | B67 | 1.3 |
| B14 | 5.3 | B32 | 8.5 | B50 | 13.5 | B68 | 4.2 |
| B15 | 7.7 | B33 | 12.9 | B51 | 3.5 | B69 | 7.1 |
| B16 | 12.5 | B34 | 2.4 | B52 | 6.3 (a, e, f : intro, plan, FAQ) | B70 | 11.1 |
| B17 | 1.5 | B35 | 5.5 | B53 | 9.2 | | |
| B18 | 4.4 | B36 | 8.2 | B54 | 13.2 | | |

Non soumises à la relecture (corrections purement mécaniques, vérifiables à la lecture) : 2.5 (libellé de lien et accent), 6.8 (« 30 secondes » devenu « quelques secondes »), 7.6 (« palier 0 » devenu « palier 1 »).

Après verdicts : pour chaque « SOUS LA BARRE », ne pas appliquer la correction correspondante telle quelle (règle d'or) ; la réécriture proposée repasse la relecture à l'aveugle avant mise en ligne.

