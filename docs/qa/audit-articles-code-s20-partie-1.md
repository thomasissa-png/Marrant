# Audit qualité des articles stockés dans le code (partie 1) : s20, 12/10/2026

Périmètre : les 15 premiers articles de `apps/web/src/lib/blog-articles.ts`.
Auteur : @reviewer. Lecture seule, aucune modification de contenu, pas de commit.

Règles appliquées (`docs/founder-preferences.md`) :
- P0 05/10 : humoristes nommés et cités autorisés partout. Citation douteuse = vérifier, corriger seulement si fausse. Aucune reco de retrait d'un humoriste.
- 29/09 : on ne retire jamais un chiffre, une étude ou une citation sans GO de Thomas ; en cas de doute, on garde et on signale.
- 08/10 : chiffre pédagogique non sourcé gardé s'il est cohérent ; chiffre incohérent = faute objective.
- 12/10 : passe de corrections ciblées sur les chiffres non sourcés « Stanford », « 90 % » (articles en base). Même logique proposée ici, Thomas tranche.
- P0 08/10 (règle d'or) : toute correction repasse la relecture à l'aveugle avant mise en ligne.
- Prix en vigueur : 2,99 €/mois, 24,99 €/an (03/10 et 04/10). Pas de compte gratuit (05/10).

## 0. Quels articles sont servis

**Limite de méthode** : pas de shell dans cette session, donc le `curl` demandé n'a pas été lancé. L'état a été établi depuis le code : `apps/web/src/lib/seo-redirects.data.cjs` (redirections 301 lues par `next.config.js`) et `UNPUBLISHED_STATIC_SLUGS` (`seo-redirects.ts` l.50-56). `findBlogArticle` (`blog-article-page.ts` l.52-55) sert l'article statique tel quel, sans retrait des tirets cadratins. **À confirmer par `curl` sur la branche déployée** (règle P0 s8 : branche déployée et HEAD peuvent différer).

| Slug | État (code) | Audité |
|---|---|---|
| timing-humour-ralentir | 301 → `/blog/timing-humour` (`seo-redirects.data.cjs` l.33) | non, fusionné |
| jeux-de-mots-technique-3-etapes | 301 → `/blog/jeu-de-mots-drole-techniques-creer` (l.35) | non, fusionné |
| raconter-blague-sans-massacrer | 301 → `/blog/comment-raconter-une-blague-sans-la-rater` (l.34) | non, fusionné |
| les 12 autres | servis depuis `blog-articles.ts` | oui |

## 1. Synthèse

| # | Article servi | FAUX | INVÉRIFIABLE | Autres problèmes | Verdict |
|---|---|---|---|---|---|
| 1 | comment-devenir-drole (pilier) | 3 (Gardin « 10 ans », étude Nouveau-Mexique, Frayssinet « génie de l'observation ») | 4 | 5 tirets cadratins en H3 | À CORRIGER |
| 2 | comment-avoir-de-la-repartie | 0 | 3 | - | À CORRIGER (léger) |
| 3 | timing-humour | 0 | 3 | pauses « 2-3 s » et « règle des 3 secondes » contraires au reste du site | À CORRIGER (prioritaire) |
| 4 | erreurs-blagues | 0 | 2 | - | À CORRIGER (léger) |
| 5 | autoderision-interactions | 0 | 1 (plausible) | - | AU NIVEAU |
| 6 | repartie-debutant-5-etapes | 0 | 5 (dont 4 propos rapportés : « a dit en interview », « a raconté », etc.) | « 90 % » non sourcé, 2 tirets cadratins en H2 | À CORRIGER (prioritaire) |
| 7 | humour-quotidien-8-habitudes | 0 | 4 (dont 1 citation de Blanche Gardin) | - | À CORRIGER |
| 8 | 5-types-humour-lequel-pour-toi | 2 (Frayssinet rangé en « observationnel », Fary en « jeux de mots ») | 1 | vanne connue, 5 tirets cadratins en H2 | À CORRIGER (prioritaire) |
| 9 | humour-noir-utiliser-sans-blesser | 1 (Waly Dia « de Créteil ») | 3 (dont 1 citation de Blanche Gardin) | section « 3 sketches décortiqués » fondée sur 2 sketches inventés | À REVOIR EN PROFONDEUR |
| 10 | exercices-developper-humour | 0 | 3 (dont Frayssinet « 80 % ») | FAQ « 7 exercices sur 10 » fausse, vanne connue | À CORRIGER |
| 11 | phrases-droles-conversations | 0 | 4 (dont 3 citations directes) | longueur d'une phrase drôle donnée de 3 façons, 5 vannes sous la barre ou déjà connues | À REVOIR EN PROFONDEUR |
| 12 | meilleures-blagues-droles-2026 | 0 | 0 | pause « 2-3 s » / « 3 s » ; vannes connues (déjà prévues dans la refonte 2027) | AU NIVEAU (1 retouche) |

**Totaux** : 6 relevés FAUX ou inexacts (5 faits distincts, Frayssinet étant mal décrit dans 2 articles), **33 attributions INVÉRIFIABLES** à des humoristes réels. Parmi elles, **13 se présentent comme des propos rapportés** (« a dit en interview », « a raconté », « comme le dit », citation entre guillemets) : c'est exactement le défaut trouvé ce matin dans les 9 articles en base. **VRAI** (sources en §3) : Mirabel à Bercy, étude Crawford et Caltabiano, pigeons pongistes de Skinner, thérapie et dépression de Blanche Gardin, autodérision de Pascot, humour politique de Waly Dia, durées des parcours, prix.

**Règle de correction proposée** (même traitement que `docs/copy/corrections-s11-s20.md` §2, déjà appliqué aux 9 articles en base) : on garde toujours l'humoriste (P0 05/10). Un propos rapporté introuvable devient une description de style (« dans la veine de X », « regarde comment X… ») ou un exemple imaginé assumé. Un chiffre attribué à une personne réelle (secondes de silence, « 80 % », « 30 % ») est retiré, la mention reste. Un fait faux est corrigé avec la source. Chaque version corrigée repasse la relecture à l'aveugle avant mise en ligne (règle d'or P0 08/10).

### Les 5 problèmes les plus graves

1. **humour-noir, « 3 sketches décortiqués »** (l.757-766) : deux sketches présentés comme réels, avec des répliques entre guillemets, sont introuvables. Celui de Waly Dia (« je suis de Créteil ») est en plus faux : il est né et a grandi à Grenoble.
2. **phrases-droles : trois citations directes introuvables**, dont une avec un chiffre : Paul Mirabel « 10 % de talent et 90 % de préparation » (l.1181), Waly Dia « le rythme c'est la ponctuation et le retour à la ligne » (l.1289), Fary « T'as pas besoin de 200 vannes » (l.1352).
3. **Série de propos rapportés introuvables** dans repartie-debutant (l.470, 485, 516), exercices (l.889, 936, 946) et humour-quotidien (l.548, 582) : Mirabel « a dit en interview », Pascot « a raconté » (2 fois), Frayssinet « a dit que 80 % », Gardin « Et si on arrêtait de faire semblant d'aimer Noël ? ».
4. **Humoristes mal classés ou mal décrits** : dans 5-types (l.634-694, CLEF, FAQ) et dans le pilier (l.51), Frayssinet est présenté comme « maître absolu de l'observationnel » alors que la presse décrit un humour absurde, introspectif et surréaliste. Fary est rangé dans les « jeux de mots », alors que la presse parle d'autodérision, d'observation sociale et d'identité. Dans le pilier (l.31), Blanche Gardin aurait mis « plus de 10 ans à passer de l'écriture pour les autres à son propre spectacle » : c'est faux, elle est révélée sur scène au Jamel Comedy Club en 2006 et son premier seul-en-scène date de 2015. L'étude de l'université du Nouveau-Mexique (l.37) est mal résumée.
5. **Durée de la pause contraire au reste du site** : timing-humour (l.238, 252, 256-262, 278), meilleures-blagues (l.1570, 1574) et repartie-debutant (l.481) enseignent « 2 à 3 secondes » avant la chute, ou d'« attendre 3 secondes » avant de répondre. Les articles en base, corrigés en s20, enseignent « une seconde » (`corrections-s11-s20.md` l.445). L'article statique `jamais-quoi-repondre-techniques` (l.2262, partie 2) appelle aussi « règle des 3 secondes » la consigne inverse (« réponds avant de réfléchir »).

Hors top 5 mais à trancher : **12 tirets cadratins dans des titres H2/H3 servis** (pilier l.49-78, repartie-debutant l.476 et 489, 5-types l.640-680). Ils restent visibles parce que `stripEmDashes` ne touche jamais aux titres (`em-dash.ts` l.53, l.148). Cela enfreint la règle 12, mais les H2 font partie des « intouchables » de la charte s11 (risque d'ancres). Thomas tranche.

## 2. Détail par article

Numéros de ligne : `apps/web/src/lib/blog-articles.ts` à HEAD. Sources : §3.

### 2.1 comment-devenir-drole (pilier) : À CORRIGER

**Humoristes**
| Ligne | Passage exact | Verdict | Correction proposée |
|---|---|---|---|
| 31 | « Paul Mirabel remplir Bercy » | VRAI (Accor Arena, 10 et 11/04/2026) | aucune |
| 31 | « Paul a commencé dans des salles de 20 personnes à Paris, à tester des vannes qui tombaient à plat une fois sur deux » | INVÉRIFIABLE pour « une fois sur deux » (débuts en cafés-concerts parisiens : vrai) | « Paul a commencé dans des cafés-concerts parisiens, devant quelques dizaines de personnes » |
| 31 | « Fary a fait des centaines d'open mics avant de trouver son style » | INVÉRIFIABLE | « Fary aussi est passé par les petites scènes avant de trouver son style », sans chiffre |
| 31 | « Blanche Gardin a mis plus de 10 ans à passer de l'écriture pour les autres à son propre spectacle » | **FAUX** : révélée sur scène au Jamel Comedy Club en 2006, premier seul-en-scène *Il faut que je vous parle !* en 2015 (à 38 ans) | « Blanche Gardin a attendu près de dix ans entre ses débuts au Jamel Comedy Club (2006) et son premier seul-en-scène (2015) » |
| 37 | « Des chercheurs de l'Université du Nouveau-Mexique ont montré que l'humour repose sur des mécanismes cognitifs précis : détection d'incongruité, résolution de tension, calibrage social » | **INEXACT** : l'étude de l'université du Nouveau-Mexique (Greengross et Miller, *Intelligence*, 2011) lie la capacité à produire de l'humour à l'intelligence verbale. La triade « incongruité / résolution » vient de la théorie incongruité-résolution, pas de cette équipe | soit citer correctement Greengross et Miller, soit retirer l'attribution (« Les chercheurs décrivent l'humour comme… »). Même phrase dans `llms-content.ts` l.56 (hors périmètre, à aligner) |
| 39-41 | Crawford et Caltabiano (2011), *J. Positive Psychology* 6(3), 237-252, programme de 8 semaines | **VRAI** (référence exacte, résultats conformes au résumé) | aucune |
| 51 | « Roman Frayssinet est un génie de l'observation. Il prend […] les groupes WhatsApp, les gens dans le métro, les réunions Zoom » | **INEXACT** pour le style (la presse décrit un humour absurde, introspectif et surréaliste) ; sujets INVÉRIFIABLES | « Roman Frayssinet part de choses minuscules et les fait dériver vers l'absurde » |
| 59 | « Fary est le roi de ça [la surprise] » | opinion, acceptable | aucune |
| 74 | Panayotis Pascot, autodérision positive | VRAI (*Presque* : il se raconte avec humour) | aucune |
| 82 | « Waly Dia raconte qu'à ses débuts, il avait un taux de réussite de 30 % » | INVÉRIFIABLE (propos rapporté et chiffre introuvables) | retirer le propos rapporté et le chiffre, garder Waly Dia : « Waly Dia a débuté dans un petit club de Nantes. Aujourd'hui il remplit des salles… » (débuts nantais : sources §3) |
| 101 | Inès Reg « 100 % elle-même » | opinion, acceptable | aucune |
| FAQ 121 | « Paul Mirabel, Fary, Blanche Gardin ont tous commencé en salle de 20 personnes à rater leurs vannes une fois sur deux » | INVÉRIFIABLE | « … ont tous commencé sur de petites scènes, avec leur lot de bides » |

**Chiffres** : « Les pros ont un taux de réussite de 60-70 % » (l.99), non sourcé mais cohérent et pédagogique : gardé (règle du 08/10). Prix « 2,99 €/mois » (l.113) : VRAI (`config/premium.ts` l.41-42).
**Cohérence** : l'ancre « Timing humour : plus fort que la blague » (l.68) ne correspond plus au titre réel (« Timing humour : le secret de la blague », l.235). Même ancre dans erreurs-blagues l.363.
**Tirets cadratins** : 5 titres H3 (l.49, 57, 66, 72, 78, « Pilier 1 : L'observation — Voir… »). Ils sont visibles : à trancher (§1).
**Ton** : au niveau. L'intro et l'exemple du yoga (l.63-64) sont bons.

### 2.2 comment-avoir-de-la-repartie : À CORRIGER (léger)

| Ligne | Passage exact | Verdict | Correction proposée |
|---|---|---|---|
| 157 | « Regarde Fary en interview. Quand un journaliste lui pose une question piège, il ne se précipite jamais. Il accuse réception… » | INVÉRIFIABLE | « Regarde un humoriste en interview face à une question piège : … » ou « Regarde Fary en interview et observe comment il gagne du temps » (consigne d'observation, sans fait affirmé) |
| 169 | « Roman Frayssinet utilise beaucoup cette technique sur scène : une remarque du public, et elle repart à l'envoyeur » | INVÉRIFIABLE (Frayssinet n'est pas connu pour l'interaction avec le public) | « dans la veine des humoristes qui jouent avec le public » ou description de style vérifiée |
| 179 | « des chercheurs ont appris à un pigeon à jouer au ping-pong » | **VRAI** (B. F. Skinner, 1950) | aucune |
| 185 | « Paul Mirabel est le roi de l'escalade » | opinion plausible | aucune |
| 201 | « Blanche Gardin peut tenir un silence de 5 secondes face au public » | INVÉRIFIABLE (mesure attribuée à une personne réelle ; même cas que C20 dans corrections-s11-s20) | retirer « de 5 secondes », garder Gardin |

**Chiffres** : « mieux que 80 % des gens » (l.163), pédagogique, gardé. « Parcours Répartie de 4 semaines » (l.221) : VRAI (`premium.ts` l.74).
**Ton** : bon niveau (« Ton cerveau livre bien, mais en point relais », technique 9 du JT).

### 2.3 timing-humour : À CORRIGER (prioritaire, page de référence du timing)

| Ligne | Passage exact | Verdict | Correction proposée |
|---|---|---|---|
| 248 | « Roman Frayssinet est probablement le meilleur exemple de timing […] il y a des silences de 3-4 secondes avant certaines chutes » | INVÉRIFIABLE (mesure ; le même chiffre a été retiré des articles en base, C20) | garder Frayssinet, retirer « de 3-4 secondes » (formulation C20 : « écoute ses silences avant certaines punchlines ») |
| 268 | « Blanche Gardin […] peut rester immobile 5 secondes en regardant le public » | INVÉRIFIABLE | retirer « 5 secondes » |
| 270 | « Fary […] accélère son débit dans le setup, puis freine d'un coup avant la chute » | INVÉRIFIABLE (description de style plausible) | formuler en consigne : « Chez Fary, écoute les changements de débit » |

**Incohérences (faute objective selon le 08/10)** :
- Pause avant la chute « 2 à 3 secondes » (l.238, 252, 278, FAQ) contre « une seconde » dans les articles en base corrigés (`corrections-s11-s20.md` l.445). Proposition : « une seconde environ » partout.
- « Règle des 3 secondes : attends 3 secondes » avant de répondre (l.254-262, 305, FAQ l.316). L'article statique `jamais-quoi-repondre-techniques` (l.2262, FAQ l.2340) appelle aussi « règle des 3 secondes » la consigne inverse (« réponds avant de réfléchir »). Il faut un seul sens et un seul nom sur le site.
- « Le timing social représente 50 % du succès d'une blague » (l.285, repris dans erreurs-blagues FAQ l.380) : non sourcé mais cohérent entre articles, gardé (08/10).

**Ton** : « c'est du ketchup sur un soufflé : techniquement légal » (l.287) tombe à plat (la chute ne veut rien dire). À réécrire, sans urgence.

### 2.4 erreurs-blagues : À CORRIGER (léger)

| Ligne | Passage exact | Verdict | Correction proposée |
|---|---|---|---|
| 333 | « Paul Mirabel a un sketch entier sur ce thème : il raconte une situation, la salle ne réagit pas immédiatement, et au lieu d'expliquer, il continue […] Et 30 secondes plus tard, le rire arrive » | INVÉRIFIABLE (aucun sketch identifié) | « Regarde Paul Mirabel quand une vanne met du temps à arriver : il n'explique pas, il continue » |
| 343 | « Waly Dia est un modèle d'efficacité : setup minimal, punchline chirurgicale » | cohérent avec la presse (« sniper de punchlines », *Le Temps*) | aucune |
| 349 | « Inès Reg ne fait pas le même contenu sur scène et sur Instagram » | VRAI (connue par une vidéo Instagram de 2019, puis la scène) | aucune |
| 359 | « Panayotis Pascot peut raconter un truc banal, genre faire ses courses » | INVÉRIFIABLE (sujet) | « raconter un truc banal » sans « faire ses courses », ou sujet vérifié de *Presque* |

**Cohérence** : ancre « Timing humour : plus fort que la blague » (l.363), voir 2.1. Le reste est au niveau (« c'est offrir un cadeau déjà déballé », « c'est un audiolivre »).

### 2.5 autoderision-interactions : AU NIVEAU

| Ligne | Passage exact | Verdict |
|---|---|---|
| 396, FAQ 452 | « Blanche Gardin parle de ses thérapies, de ses galères sentimentales, de ses angoisses » | VRAI (hospitalisation en psychiatrie après une rupture, dépression : *Paris Match*) |
| 398 | Pascot et ses « maladresses sociales », « un rendez-vous galère » | VRAI dans l'esprit (*Presque* a pour fil rouge un baiser manqué) |
| 426 | « Paul Mirabel utilise exactement cette technique en début de spectacle […] position de "faux faible" » | INVÉRIFIABLE mais plausible (son personnage timide est documenté) ; formulation possible : « Paul Mirabel joue souvent ce personnage de "faux faible" » |

**Chiffres** : « en 0,3 seconde » (l.408), « 10x plus séduisant » (l.434) : exagérations pédagogiques, gardées (08/10).
**Promesse** : « le parcours Confiance consacre une semaine entière » à l'autodérision (l.444) : VRAI (étape « Rire de toi », `docs/content/parcours-seed.json` l.711).
**Ton** : bon (« Je me suis déjà perdu en suivant quelqu'un », « ma poêle a demandé sa mutation »). « Mon chat a plus de vie sociale que moi » (l.432) est une formule déjà très répandue : à remplacer quand l'article repassera en relecture, pas en urgence.

### 2.6 repartie-debutant-5-etapes : À CORRIGER (prioritaire)

Lucas est présenté comme un exemple (« Imagine Lucas, 20 ans », l.460) : conforme au choix du 29/09.

| Ligne | Passage exact | Verdict | Correction proposée |
|---|---|---|---|
| 470 | « Paul Mirabel a dit en interview qu'à ses débuts, il ne cherchait pas à être drôle : il cherchait à être honnête » | INVÉRIFIABLE (aucune interview trouvée) | « Regarde Paul Mirabel : une bonne partie de ses vannes, c'est juste une gêne honnête dite à voix haute » (description de style) |
| 485 | « Fary utilise des phrases filet de sécurité tout le temps en interview […] il a toujours un "c'est une excellente question" qui lui achète 5 secondes » | INVÉRIFIABLE (phrase attribuée) | « Beaucoup d'humoristes en interview ont leur "c'est une excellente question" » ou « dans la veine de Fary » |
| 495 | « Roman Frayssinet fait ça sur scène : il attrape un mot du public et construit dessus » | INVÉRIFIABLE | même traitement que 2.2 l.169 |
| 505 | « Waly Dia raconte qu'il testait ses vannes dans des salles de 10 personnes » | INVÉRIFIABLE pour « 10 personnes » (débuts dans un club nantais : vrai) | « Waly Dia a débuté dans un petit club de Nantes avant les grandes scènes » |
| 516 | « Panayotis Pascot a raconté qu'il notait ses vannes ratées pour comprendre pourquoi elles ne marchaient pas » | INVÉRIFIABLE (aucune trace) | « C'est exactement ce que font les pros : noter ce qui n'a pas marché » (sans attribution) |

**Chiffres** : « 90 % des gens en conversation n'écoutent pas » (l.491) : même famille que le « 90 % » visé par la passe du 12/10. Proposition : « La plupart des gens… ». Le chiffre n'est retiré qu'avec le GO de Thomas (29/09).
**Cohérence** : « Donne 3 secondes de réflexion » (l.481) : à aligner sur la règle de pause retenue (2.3).
**Tirets cadratins** : 2 titres H2 (l.476 « Le filet de sécurité — 3 phrases prêtes », l.489 « L'écoute active — Ton arme secrète »).
**Ton** : « C'est comme apprendre à nager en traversant la Manche » (l.501) passe. Le reste est au niveau.

### 2.7 humour-quotidien-8-habitudes : À CORRIGER

| Ligne | Passage exact | Verdict | Correction proposée |
|---|---|---|---|
| 548, FAQ 621 | « Roman Frayssinet note tout […] Son téléphone est un cimetière de notes vocales, et ses meilleurs sketches en sortent » | INVÉRIFIABLE | « Beaucoup d'humoristes notent tout » ; ou garder Frayssinet en exemple imaginé : « Imagine le téléphone d'un Roman Frayssinet… » |
| 558 | « Paul Mirabel est le roi de la reformulation. Il prend une situation banale (aller chez le médecin, manger au resto) » | INVÉRIFIABLE (sujets) | garder le « roi de la reformulation », retirer les sujets non vérifiés |
| 574 | « Fary […] Il ne dit pas des trucs drôles : il dit des trucs vrais de façon drôle » | opinion cohérente avec la presse (observation sociale) | aucune |
| 582 | « Blanche Gardin part souvent d'un "et si" pour construire ses sketches : "Et si on arrêtait de faire semblant d'aimer Noël ?" » | INVÉRIFIABLE (citation entre guillemets, aucune trace) | exemple imaginé assumé : « Un "et si" à la Blanche Gardin, ça donnerait : "Et si on arrêtait…" » |
| 596 | « une technique de stand-up que Waly Dia utilise dans chaque spectacle » | INVÉRIFIABLE (« chaque ») | « que Waly Dia manie très bien » |
| 590 | Pascot, galères racontées avec recul | VRAI dans l'esprit | aucune |

**Affirmation non sourcée** : « Le compliment absurde est la forme d'humour la plus universellement appréciée » (l.564) : à adoucir (« une des plus faciles à faire passer »).
**Ton** : « Ma journée en un mot ? Tableur. » (l.604) est plat. Le reste est au niveau (« Techniquement, c'est une soirée »).

### 2.8 5-types-humour-lequel-pour-toi : À CORRIGER (prioritaire)

Le title et l'excerpt (avec Frayssinet, Mirabel, Gardin) relèvent du choix du 05/10 et ne sont pas remis en cause. Le problème est dans le corps : à qui l'article attribue quel type.

| Ligne | Passage exact | Verdict | Correction proposée |
|---|---|---|---|
| 634, 644, 694, FAQ 712 | « Roman Frayssinet est le maître absolu de l'observationnel français. Quand il parle des gens dans le métro […] les messages vocaux de 7 minutes de ta mère » | **INEXACT** (style décrit comme « absurde et introspection », « surréaliste ») ; les deux sujets sont INVÉRIFIABLES | le placer en type 3 (absurde) avec Mirabel, ou écrire « Frayssinet part du quotidien pour le faire dériver vers l'absurde » ; les deux exemples deviennent « dans la veine de » ou disparaissent du nom |
| 637, 674, 692, 694, FAQ 712 | « Les jeux de mots […] (Fary) », « Fary glisse des jeux de mots dans ses punchlines », « Fary = observationnel + jeux de mots + énergie » | **INEXACT** (la presse parle d'autodérision, d'observation sociale, d'identité, d'humour pince-sans-rire) | Fary en type 1 (observationnel, cohérent avec 2.7 l.574) ; le type 4 garde un exemple imaginé, sans nom |
| 654 | Pascot, autodérision, « échecs amoureux » | VRAI (*Presque*) | aucune |
| 664 | Mirabel, absurde par escalade | plausible | aucune |
| 684 | Gardin et l'humour noir (mort, dépression) ; Waly Dia et le second degré | VRAI dans l'esprit | aucune |

**Vanne connue** : « Mon médecin m'a dit de marcher tous les jours. Je l'ai écouté. Là, je suis en Belgique. » (l.664) reprend une structure très répandue (le médecin qui conseille de marcher X km par jour, et on se retrouve loin). Selon le choix du 29/09, une vanne déjà connue est faible : à remplacer par une vanne du catalogue relue à l'aveugle.
**Tirets cadratins** : 5 titres H2 (l.640, 650, 660, 670, 680).
**Ton** : « C'est le piment du placard » (l.682) passe. Rien d'autre sous la barre.

### 2.9 humour-noir-utiliser-sans-blesser : À REVOIR EN PROFONDEUR

La section « 3 sketches décortiqués » (l.757-766) est la colonne vertébrale de l'article, et ses deux exemples « réels » sont introuvables. L'un des deux est en plus faux.

| Ligne | Passage exact | Verdict | Correction proposée |
|---|---|---|---|
| 732, 740 | Gardin parle de ses thérapies, de la mort, de sa propre dépression | VRAI (*Paris Match*, 2020) | aucune |
| 740 | « Waly Dia fait de l'humour noir sur le racisme qu'il vit » | VRAI dans l'esprit (humour politique et social : *Politis*, *Le Temps*) | aucune |
| 749 | « Fary a expliqué en interview qu'il adapte constamment son niveau d'humour noir selon la salle » | INVÉRIFIABLE (propos rapporté) | « Les humoristes adaptent leur dosage selon la salle » ou description sans « a expliqué » |
| 755 | « Paul Mirabel utilise parfois l'humour noir dans ses escalades […] La construction est millimétrée » | INVÉRIFIABLE et peu cohérent avec son registre (timide, lunaire) | exemple imaginé assumé, ou un autre humoriste dont le registre est documenté |
| 759-760 | « Sketch 1 : Blanche Gardin sur la thérapie » : « Mon psy m'a dit que j'avais fait des progrès. J'ai répondu que lui aussi devrait en faire : ça fait 8 ans qu'il me supporte. » | INVÉRIFIABLE, présenté comme une réplique réelle | titre « Dans la veine de Blanche Gardin » + réplique présentée comme exemple imaginé, ou une vraie réplique sourcée de *Je parle toute seule* / *Bonne nuit Blanche* |
| 762-763 | « Sketch 2 : Waly Dia […] "On m'a dit 'retourne dans ton pays'. J'ai répondu 'je suis de Créteil, tu veux que je retourne à Créteil ?'" » | **FAUX** : Waly Dia est né et a grandi à Grenoble ; réplique introuvable | même traitement : exemple imaginé « dans la veine de Waly Dia », sans ville qui contredit sa biographie |

**Point d'attention pour Thomas (aucune action imposée)** : Blanche Gardin est présentée comme « la référence absolue de l'humour noir français réussi » dans un article sur l'humour « sans blesser ». Or elle a été prise dans une polémique en 2024 (sketch au gala « Voice for Gaza ») et a annoncé en novembre 2025 qu'elle arrêtait le stand-up. Le texte au présent (« elle parle de… ») reste juste pour ses spectacles. Le superlatif est un choix éditorial, à toi de voir.
**Promesses** : « nos parcours t'apprennent à le doser » et « nos vannes classées par style » (l.783). Les vannes sont classées par thème (boulot, couple…), pas par style, et aucun parcours n'a d'étape sur l'humour noir dans `parcours-seed.json`. À reformuler pour coller à l'offre réelle.
**Ton** : « Je l'ai enterré ce matin. La cérémonie était sobre. Il y avait un croissant. » (l.772) et la minute de silence pour l'ordre du jour (l.774) sont au niveau.

### 2.10 exercices-developper-humour : À CORRIGER

| Ligne | Passage exact | Verdict | Correction proposée |
|---|---|---|---|
| 889 | « Roman Frayssinet a dit que 80 % de son matériel vient de ce qu'il observe dans la vie quotidienne. Son téléphone est rempli de notes. » | INVÉRIFIABLE (propos et chiffre ; de plus, cela décrit mal son style) | retirer le propos et le chiffre : « Fais comme les humoristes : note tout » |
| 936 | « Panayotis Pascot a raconté qu'il notait tout : les vannes ratées, les répliques qu'il aurait voulu sortir » | INVÉRIFIABLE (doublon de 2.6 l.516) | même correction |
| 946 | « Fary utilise des compliments absurdes en interview pour créer de la complicité » | INVÉRIFIABLE | supprimer l'attribution, garder la consigne |
| 970 | « une technique de stand-up que Waly Dia maîtrise à la perfection » | opinion, acceptable | aucune |
| 913, 955 | Mirabel et l'exagération ; Gardin et le timing | opinions, acceptables | aucune |

**Incohérences** :
- FAQ l.993 : « Oui, pour 7 exercices sur 10 […] Seuls le ping-pong verbal et le one-man-show nécessitent un partenaire ». Ça fait 9 : l'exercice 6 (compliment absurde, « au collègue, au serveur ») est oublié et demande lui aussi quelqu'un. Corriger en « 7 sur 10 » avec le 6 parmi ceux qui demandent quelqu'un.
- L'exercice 7 (15 minutes, l.950) est rangé dans « Niveau intermédiaire (10 min/jour) » (l.915).

**Vanne connue** : « Il fait tellement chaud que même mon déodorant transpire » (l.910) est un classique. Faible selon le choix du 29/09 : à remplacer.
**Coquille** : « Ils ont fui au 47e » (l.900), point final manquant.

### 2.11 phrases-droles-conversations : À REVOIR EN PROFONDEUR

Trois citations directes introuvables, plus cinq phrases sous la barre ou déjà connues, dans un article de catalogue censé ne proposer que des vannes au niveau.

| Ligne | Passage exact | Verdict | Correction proposée |
|---|---|---|---|
| 1181 | « Comme le dit Paul Mirabel : l'humour, c'est 10 % de talent et 90 % de préparation que personne ne voit. » | INVÉRIFIABLE, citation + chiffre « 90 % » | sans « Comme le dit » : « L'humour des pros, c'est surtout de la préparation que personne ne voit » ; Mirabel peut rester en exemple (« regarde Paul Mirabel… ») |
| 1217 | « Roman Frayssinet l'a bien compris : ses meilleures punchlines tiennent en une phrase » | INVÉRIFIABLE (et contredit par son débit, décrit comme « mélodique ») | autre formulation, sans fait affirmé |
| 1246 | « Blanche Gardin a prouvé qu'on peut être cash, drôle et séduisant en même temps » | opinion, acceptable | aucune |
| 1255 | « Fary fait ça en permanence sur scène » | opinion plausible (autodérision documentée) | aucune |
| 1272 | « Panayotis Pascot a montré que la vulnérabilité pouvait être une force comique » | VRAI dans l'esprit | aucune |
| 1289 | « Waly Dia l'a théorisé : à l'écrit, "le rythme c'est la ponctuation et le retour à la ligne." » | INVÉRIFIABLE (citation) | consigne du site, sans attribution |
| 1352 | « Dernier conseil de Fary : "T'as pas besoin de 200 vannes. T'as besoin de 5 que tu maîtrises les yeux fermés." » | INVÉRIFIABLE (citation) | « Dernier conseil, dans la veine de Fary : … » ou conseil du site |

**Incohérence** : une bonne phrase drôle fait « moins de 25 mots » (l.1332), « moins de 15 mots » (FAQ l.1372), et « 15-20 mots » dans meilleures-blagues (FAQ l.1596). Il faut choisir une seule règle.
**Sous la barre ou déjà connues** (relecture à l'aveugle avant toute nouvelle version) :
- n°7 (l.1219) « J'ai failli pas venir. La dernière fois, c'était dans l'ascenseur. » : la chute est incompréhensible, et l'explication (« tu avoues ton trac ») ne colle pas à la phrase.
- n°9 « spontané, 48h de préavis », n°13 « un dessert dans chaque main », n°18 « Mon livreur peut en témoigner » : formules déjà très répandues, faibles selon le choix du 29/09.
- n°21 « remettre en selle / J'ai même pas de vélo » : plate.
**Promesse** : « Parcours Confiance : 6 semaines » (l.1283) et « 3 à 6 semaines » (l.1364) : VRAI (`premium.ts` l.73-81).

### 2.12 meilleures-blagues-droles-2026 : AU NIVEAU (1 retouche)

Aucun humoriste, aucune étude. Liens et promesses justes : « la blague du jour change tous les jours » (calendrier préparé, 30/09), « 15 minutes par semaine » pour Machine à Café (`premium.ts` l.73), quiz « environ 2 minutes ».
- **Cohérence** : « pause de 2-3 secondes avant la chute » (l.1570) et « un silence de 3 secondes » (l.1574) : à aligner sur « une seconde » (déjà relevé dans `corrections-s11-s20.md` l.445).
- **Vannes connues** : n°14 « habille-toi pour le poste que tu veux / pyjama », n°2 « Post-it pour acheter des Post-it », n°40 « anxiété avec du Wi-Fi ». Elles relèvent de la refonte 2027 déjà prévue (≥ 30 % de vannes neuves, du 15 au 20/12, choix du 05/10). Aucune action avant.

## 3. Sources (WebSearch du 12/10/2026, pages de résultats)

| Fait | Source |
|---|---|
| Mirabel à l'Accor Arena (10-11/04/2026) | https://www.accorarena.com/en/events-and-tickets/paul-mirabel--942cc (relevé dans `corrections-s11-s20.md` §3) |
| Mirabel, débuts en cafés-concerts parisiens | https://www.fnacspectacles.com/artist/paul-mirabel/ |
| Crawford et Caltabiano 2011 | https://researchonline.jcu.edu.au/18802/ |
| Greengross et Miller 2011 (université du Nouveau-Mexique) | https://www.uniad.org.br/?p=7578 ; https://www.aber.ac.uk/en/psychology/staff/gig9/ |
| Blanche Gardin : Jamel Comedy Club 2006, premier seul-en-scène 2015 | https://en.wikipedia.org/wiki/Blanche_Gardin ; https://www.purepeople.com/people/blanche-gardin_p266170 |
| Blanche Gardin : psychiatrie, dépression | https://www.parismatch.be/actualites/people/2020/06/05/blanche-gardin-comment-lhopital-psychiatrique-la-sortie-de-la-depression-PTSHZPR275C3JH4ABLZYCMDB3I/ |
| Blanche Gardin : arrêt du stand-up (11/2025), polémique de 2024 | https://www.parismatch.be/culture/scene/2025/11/12/blanche-gardin-met-un-terme-a-sa-carriere-dans-le-stand-up-un-peu-a-cote-des-enjeux-de-lepoque-6OALAFRA4NHGXAPOHJ2PW3AXN4/ ; https://www.dhnet.be/medias/divers/2025/12/11/je-dois-quitter-mon-appartement-blanche-gardin-a-la-rue-suite-a-son-sketch-sur-gaza-et-lantisemitisme-7FJO6ULDPBBG7IRL55X3TADE6I/ |
| Waly Dia : né à Grenoble (1988), débuts à Nantes | https://franco.wiki/fr/Waly_Dia.html ; https://www.politis.fr/articles/2022/01/waly-dia-eclats-de-rire-sur-france-reac-43985 ; https://www.fnacspectacles.com/artist/waly-dia/ |
| Waly Dia : « sniper de punchlines », humour politique | https://www.letemps.ch/culture/waly-dia-le-sniper-de-punchlines-fier-rempart-de-l-humour-politique |
| Frayssinet : « absurde et introspection », « surréalisme » | https://www.fnacspectacles.com/en/artist/roman-frayssinet/ ; https://leclaireur.fnac.com/article/273372-que-vaut-le-spectacle-de-roman-frayssinet-diffuse-ce-soir-sur-canal/ ; https://leclaireur.fnac.com/article/654846-o-dela-que-vaut-le-dernier-spetacle-de-roman-frayssinet-avis/ |
| Fary : autodérision, observation sociale, identité | https://www.timeout.fr/paris/comedie/fary-dans-hexagone ; https://www.dhnet.be/medias/divers/2019/02/18/fary-sinterroge-sur-lidentite-francaise-dans-son-one-man-show-il-y-a-le-rire-et-il-y-a-lattaque-AKYJONLQDNHHBLYMKZSHPDCGB4/ |
| Pascot, *Presque* | https://www.timeout.fr/paris/theatre/panayotis-pascot-presque |
| Skinner, pigeons et ping-pong (1950) | https://www.smithsonianmag.com/science-nature/bf-skinner-the-man-who-taught-pigeons-to-play-ping-pong-and-rats-to-pull-levers-5363946/ |
| Recherches sans résultat (INVÉRIFIABLES) | Mirabel « 10 % / 90 % » et « honnête » ; Fary « 200 vannes » ; Waly Dia « ponctuation » et « 30 % » ; Frayssinet « 80 % » ; Pascot « vannes ratées » ; Gardin « 8 ans qu'il me supporte » |

Limite : les résultats de recherche ont été lus, pas les articles en entier. « INVÉRIFIABLE » veut dire « introuvable dans des sources accessibles », pas « faux ». Si Thomas a une source, l'attribution reste.

## 4. Décisions à confirmer par Thomas

1. Appliquer la règle de correction du §1 (même règle que pour les 9 articles en base) aux 13 propos rapportés introuvables et au fait faux sur Waly Dia (« Créteil »).
2. Durée de pause unique sur tout le site (« une seconde environ ») et sens unique de la « règle des 3 secondes » (attendre ou répondre vite).
3. Retirer « 90 % » (repartie-debutant l.491) : GO requis (choix du 29/09).
4. Tirets cadratins dans 12 titres H2/H3 : appliquer la règle 12 (titres modifiés, ancres à vérifier) ou garder les H2 intouchables.
5. Blanche Gardin présentée comme « référence absolue » dans l'article sur l'humour noir : garder ou nuancer.

## Handoff → @orchestrator

- Fichier produit : `docs/qa/audit-articles-code-s20-partie-1.md`. Aucun autre fichier modifié, pas de commit.
- Agents à relancer : @copywriter pour les corrections (articles 9 et 11 en priorité, puis 3, 6, 8, 1, 7, 10, 2, 4), puis relecture à l'aveugle (règle d'or) ; @fullstack pour reporter les textes validés dans `blog-articles.ts` (et `llms-content.ts` l.56) ; vérification `curl` des 3 redirections sur la branche déployée.
- Point d'attention : la partie 2 (articles 16 et suivants) contient `jamais-quoi-repondre-techniques`, où la « règle des 3 secondes » a le sens inverse.
