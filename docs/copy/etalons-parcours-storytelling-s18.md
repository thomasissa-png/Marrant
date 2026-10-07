# Étalons du parcours Storytelling (s18, 08/10/2026)

> **Statut : à valider par Thomas avant toute réécriture** (règle P0 s8, décision D5). Rien n'est modifié dans `src/`, dans les seeds ni en base. Les 12 étapes des deux nouveaux parcours restent à écrire après ton retour.
> Décisions acquises et NON re-proposées : textes d'étape en version B avec scène « Imagine… » ; quiz au ton B complice avec explication ; repli solo sur les exercices ; blocage s16 inchangé ; « Pro » devient « Parcours Boulot » ; Storytelling 20 min/semaine (dans « 15 à 20 min/semaine »), 700 XP + 100 ; « Expert » jamais affiché ; doublons de vidéos et de vannes acceptés ; profil Storyteller du quiz vers Storytelling dès la publication ; « première étape gratuite », jamais « cours gratuit ».
> Règles tenues : tutoiement, « vanne » (« blague à tiroirs » seul terme consacré conservé), zéro tiret cadratin dans les textes, pas scolaire, aucune mention d'IA, aucun concurrent, aucun prénom de persona (les exemples « Imagine Samir » sont des exemples, jamais présentés comme un vrai membre), aucun chiffre du site touché, humoristes cités seulement là où le conseil ou la fiche vidéo en base les cite déjà. Ce qui dépend d'un fait non vérifié est marqué `[À VÉRIFIER]`.
> **La base fait foi (RC2).** Texte des conseils relu dans `docs/content/conseils-storytelling-base-s18.json` (export prod du 08/10), vannes dans `docs/content/vannes-actives-s17.json` (127 actives), vidéos dans `videos-seed.json`.

## Tes choix en un coup d'œil (ma reco pour chacun)

| # | § | Point | Options | Reco |
|---|---|---|---|---|
| 1a | 1 | Étape 1, conseil inactif « Raconter une anecdote en 3 actes » | A réactiver avec retouche / B « Construire une histoire drôle » (actif) | **A** |
| 1b | 1 | Étape 4, conseil inactif « Le twist final » | A réactiver, retouche légère / B « La chute anti-climax » (actif) | **A** |
| 1c | 1 | Étape 5, conseil inactif « La blague à tiroirs » | A réactiver, exemple corrigé / B « Raconter à l'envers » (actif) | **A** |
| 2 | 2 | Fiche du parcours (description, accroche, témoignage « Imagine… ») | A sobre / B complice | **B** |
| 3 | 4 | Titre de la page (≤ 60 caractères) et slug | A avec durée / B avec promesse | **A**, slug `storytelling` |
| 4 | 5 | Phrase d'accroche du profil Storyteller du quiz | A même gabarit que les 4 autres / B plus explicite | **A** |
| 5 | 6 | Vannes des étapes 2 à 6 | A actives (étapes 2, 3, 4, 6) + 5 vannes neuves relues à l'aveugle pour l'étape 5 / B actives partout | **A** |

L'étape 1 complète (§3) n'a pas d'A/B : les choix de forme sont acquis depuis s17, tu valides le texte ou tu corriges un mot.
« Je suis tes recos » suffit. Le détail et les textes complets sont dessous.

## Ce que la base a changé (faits relus le 08/10)

- **3 conseils sur 6 sont inactifs en prod depuis le 30/09** : « Raconter une anecdote en 3 actes » (étape 1), « Le twist final » (étape 4), « La blague à tiroirs » (étape 5). Actifs : « La technique du personnage » (2), « Rigoler de ses échecs » (3), « Le callback… » (6).
- **Vannes** : sur les 30 vannes prévues par la spec, une seule est active (seedId 322, « Mon GPS m'a dit de tourner à droite. Y'avait un fleuve. »). Les vannes se choisissent donc parmi les 127 actives, désignées par leur texte exact.
- **Vidéos** : les 11 de la spec sont actives. **Votes « nouveaux parcours »** : 0 en base, aucune donnée, l'ordre Storytelling puis Boulot reste celui décidé.
- Deux écarts à connaître, sans choix à faire : voir « Signalements » en fin de fichier (étape 3 et titre du callback).

---

## 1. Les 3 conseils inactifs (choix 1a, 1b, 1c)

[Framework : avant/après sur le texte réel] [Conscience : Solution-Aware, c'est le contenu que le membre lit après l'étape]

**Principe de la retouche A** : on réactive le conseil prévu par la spec (une seule idée par étape, RC1), on corrige ce que l'audit s14 a relevé (tirets cadratins, flèches, guillemets droits, faute de casse, fausse étymologie, défi trop lourd), on ajoute le repli solo, et on garde les humoristes déjà cités (règle P0 s15 : citation douteuse = vérifier, pas retirer). Titre, catégorie et difficulté ne bougent pas. Les retouches passent par la base ET par `conseils-seed.json` (sinon un rejeu du seed remet l'ancien texte).

### 1a. Étape 1 : « Raconter une anecdote en 3 actes » (inactif, s14 REECRIRE)

**Texte en base aujourd'hui** : plan contexte / montée / chute, exemple « rendez-vous Tinder… j'ai renversé mon café sur elle » (jugé très bon par l'audit s14). Défauts : tirets cadratins ×2, faute « eNREGISTRE-TOI », défi lourd (filmer 3 anecdotes), « Tinder » nommé, « dans chaque sketch » non vérifiable.

**A (reco) : réactiver avec cette retouche**

- `contenu` : « Toute bonne histoire drôle tient en trois actes. 1) Le contexte : qui, où, quand, en deux phrases maximum. 2) La montée : ce qui s'est passé, avec des détails précis. 3) La chute : le retournement, en une seule phrase, plus courte que le contexte. Le plus dur n'est pas de trouver la chute, c'est de couper ce qui traîne entre les deux : un détail qui n'amène rien ralentit la montée. Paul Mirabel suit cette structure dans ses sketchs. » `[À VÉRIFIER : la phrase sur Paul Mirabel (adoucie de « religieusement dans chaque sketch » à « dans ses sketchs ») ; je la garde et je ne la retire pas]`
- `exemple` : « Contexte : mardi, premier rendez-vous. Montée : elle arrive, on discute, ça se passe bien, elle me dit qu'elle adore les gens spontanés. Chute : alors spontanément, j'ai renversé mon café sur elle. » (même vanne, « Tinder » retiré, plus de guillemets imbriqués)
- `exercice` : « DÉFI 3 ACTES : choisis une anecdote vraie et légère de ta semaine (un trajet, un repas, un rendez-vous). Pose-la en trois blocs : le contexte en deux phrases, la montée en trois ou quatre, la chute en une seule. Dis-la à voix haute à quelqu'un, puis demande-lui à quel moment il a décroché. Personne sous la main ? Enregistre un vocal et réécoute-le : repère ce qui traîne, et coupe-le. »

**B : remplacer par « Construire une histoire drôle »** (actif, EXPERT). Texte en base : situation normale, détails crédibles, dérapage absurde ; défi « remplace la dernière phrase par un détail absurde ». Pourquoi je ne le recommande pas : il enseigne le dérapage, pas le découpage (c'est le sujet de l'étape 4), il pousse à inventer plutôt qu'à travailler une anecdote vraie (le fil rouge du parcours), et il est étiqueté EXPERT pour une étape qui doit rassurer.

**Reco : A.** C'est le seul conseil dont le sujet est exactement le titre de l'étape.

### 1b. Étape 4 : « Le twist final » (inactif, s14 GARDER, candidat étalon)

**Texte en base aujourd'hui** : bon. L'audit demandait seulement « retoucher flèche et réf. plaquée ». Défauts réels : flèche « → » dans l'exemple, guillemets simples dans `contenu`, défi sans lien avec l'anecdote du parcours ni repli.

**A (reco) : réactiver, retouche légère**

- `contenu` : « Le twist, c'est la technique de base du stand-up : tu amènes l'audience dans une direction et tu pivotes au dernier moment. Tout le monde s'attend à A, et tu donnes B. La clé : le twist doit être logique rétrospectivement. Quand la personne comprend, elle doit se dire « ah oui, bien sûr » tout en riant. Le plus sûr : appuie ta chute sur un détail que tu as déjà cité. Rien de nouveau n'arrive à la fin, ce qui était déjà là change de sens. Panayotis Pascot excelle dans ces retournements narratifs. » (phrase sur Pascot inchangée ; une phrase ajoutée, celle de « le plus sûr »)
- `exemple` : « J'ai passé 3 heures à préparer un dîner romantique. Bougies, musique, tout. Elle a adoré. Le livreur Uber Eats aussi. » Le twist fonctionne parce que tu croyais qu'il cuisinait. (vanne inchangée, flèche remplacée par une phrase)
- `exercice` : « DÉFI TWIST : reprends une anecdote que tu connais bien et écris-la en trois phrases. Les deux premières orientent vers une conclusion logique, la troisième part dans la direction opposée, en s'appuyant sur un détail déjà cité. Écris deux fins différentes, puis dis-les à voix haute ou envoie-les à un proche : laquelle surprend, puis paraît évidente ? Seul aujourd'hui ? Dis les deux à voix haute et garde celle qui te fait sourire. »

**B : remplacer par « La chute anti-climax »** (actif, EXPERT, s14 GARDER : « 6 mois de musculation… ouvrir un bocal de cornichons »). Pourquoi je ne le recommande pas : c'est une autre chute (on dégonfle une attente, on ne surprend pas), donc le titre de l'étape « La chute qu'on n'a pas vue venir » ne serait plus vrai, et les vannes prévues pour l'étape 4 (chute logique après coup) ne collent plus.

**Reco : A.** Si tu veux quand même l'anti-climax, il trouvera sa place comme conseil de l'étape 3 ou en bonus, pas ici.

### 1c. Étape 5 : « La blague à tiroirs » (inactif, s14 REECRIRE)

**Texte en base aujourd'hui** : technique claire, chute « marié, avec un chariot et un hot-dog » bonne. Défauts : tirets cadratins ×2, **vouvoiement** (« vous savez »), **fausse étymologie** (Ikea ne veut pas dire « tu trouveras jamais la sortie » en suédois : on ne la garde pas), « architecture narrative avancée » qui sent l'Expert. Titre conservé tel quel : « blague à tiroirs » est le terme consacré.

**A (reco) : réactiver avec exemple corrigé**

- `contenu` : « La blague à tiroirs est une blague qui en contient d'autres. Tu ouvres un sujet, tu digresses sur un détail, tu fais une vanne dans la digression, puis tu reviens au sujet principal pour la chute finale. C'est de l'architecture : deux étages, et un escalier pour redescendre. Garde la digression courte (deux phrases), sinon on perd le fil de l'histoire. Paul Mirabel est le roi de cette technique : ses spectacles sont des poupées russes comiques. » `[À VÉRIFIER : la phrase sur Paul Mirabel, gardée telle quelle, tiret remplacé par deux-points]`
- `exemple` : « L'autre jour, je vais chez Ikea acheter une étagère. Parenthèse : c'est le seul endroit où des couples se disputent à voix basse devant un meuble à quarante euros, comme si c'était un divorce. Bref. L'étagère. J'en suis ressorti marié, avec un chariot et un hot-dog. » (chute d'origine gardée, digression remplacée : plus de fausse étymologie, et la chute « marié » répond maintenant à la digression sur les couples)
- `exercice` : « DÉFI TIROIRS : reprends une anecdote que tu connais bien. Ajoute une seule digression de deux phrases au milieu (une parenthèse, un commentaire sur un détail), puis reviens à l'histoire avec un « bref ». Chronomètre-toi : le tout doit tenir en moins d'une minute trente. Pas de public ? Fais-le en vocal et réécoute. »

**B : remplacer par « Raconter à l'envers »** (actif, DEBUTANT : commencer par la fin absurde, remonter le temps, finir par une morale petite et fausse ; exemple du hall en pyjama avec le sac-poubelle). Bon texte, bon exemple, mais c'est un autre sujet : l'ordre du récit, pas le détour. L'étape deviendrait « Commencer par la fin » et perdrait sa raison d'être entre la chute (4) et le détail qui revient (6).
Je ne propose pas « La digression qui revient à la fin » (actif, EXPERT) : c'est presque mot pour mot l'étape 6 (planter un détail, le faire revenir).

**Reco : A.**

---

## 2. Fiche du parcours (choix 2)

[Framework : PAS court, l'histoire qui s'éparpille puis le chemin] [Conscience : Solution-Aware, la personne cherche un moyen de mieux raconter]

Champs du seed : `description`, `personaTagline`, `testimonial`. Les deux versions disent la même chose (6 semaines, une seule anecdote vraie travaillée, jusqu'à ce qu'on te la redemande). Rien n'annonce de score, de certificat ou de chiffre nouveau. Le témoignage est un exemple : il commence par « Imagine » et ne dit jamais « un membre a dit ».

| | **A (sobre)** | **B (complice)** |
|---|---|---|
| `description` | Tu as une histoire vraie qui marche à moitié quand tu la racontes. En 6 semaines, tu la remets dans l'ordre, tu donnes une voix à ses personnages, tu soignes la chute et tu fais revenir un détail à la fin. Une seule anecdote, retravaillée chaque semaine, jusqu'à ce qu'on te la redemande. | Il y a toujours quelqu'un pour dire « et donc ? » au milieu de ton histoire. En 6 semaines, tu apprends à ne plus lui laisser la place : un plan en trois actes, des personnages qu'on entend, une chute qui surprend, un détail qui revient. Une seule anecdote vraie, retravaillée chaque semaine, jusqu'à ce qu'on te la redemande. |
| `personaTagline` | Pour toi si tu as de bonnes histoires mais que tu t'arrêtes en route, au dîner, à l'afterwork ou entre potes, de peur d'être trop long | Pour toi si on te dit « raconte ! » et que tu réponds « bof, c'est une longue histoire », alors que tu as de quoi tenir une table |
| `testimonial` | Imagine Samir, 34 ans. Dans les dîners, son histoire de déménagement le faisait rire, lui, mais la chute arrivait après trois digressions et quelqu'un finissait par changer de sujet. Six semaines plus tard, c'est la même histoire, dite sans détour, et c'est lui qu'on relance : « Raconte l'histoire du canapé. » | Imagine Samir à un dîner : il lance « Je vous raconte mon déménagement ? » et, quelques minutes plus tard, la table réclame la suite. Six semaines plus tôt, il aurait dit « bref, c'est une longue histoire » et changé de sujet. |

**Reco : B.** Elle montre le problème avant de le nommer (« humour présent dans la copy elle-même », charte §5), l'accroche « et donc ? » est reconnaissable en une seconde, et le témoignage se lit en dix secondes. A reste le plan B si tu trouves le « et donc ? » trop familier pour une page de vente.
Vérifié contre le parcours : chaque élément cité existe dans une étape (plan en trois actes = 1, personnages qu'on entend = 2, chute qui surprend = 4, détour = 5, détail qui revient = 6). Le raté de l'étape 3 n'est pas dans la description : c'est une option, pas le fil.
Le prénom « Samir » n'est pas un prénom de persona et ne figure dans aucune vidéo du parcours (pas de confusion avec un humoriste). Il revient dans l'étape 1 (§3), comme Léa dans Machine à Café.

---

## 3. Étape 1 complète : « Ton anecdote en trois actes »

[Framework : PAS court avec scène, comme les 3 étapes gratuites validées en s17] [Conscience : Product-Aware, c'est la vitrine que le visiteur lit avant de payer] Aucun A/B : forme acquise (version B avec scène, repli solo, quiz complice).

**Ce qui doit se lire face à Machine à Café 3** (« La règle des détails spécifiques », texte validé s17 : ajouter 3 détails précis à une anecdote banale, sans repli ni suite) :

| | Machine à Café 3 | Storytelling 1 |
|---|---|---|
| Le geste | Ajouter | **Découper et couper** |
| La matière | Une anecdote banale, au choix | **TON anecdote vraie**, gardée pour tout le parcours |
| Ce qu'on travaille | Le grain (heure, lieu, vêtement) | **La charpente** (contexte, montée, chute) |
| Ce qui se mesure | La réaction de l'autre aux détails | **La chute plus courte que le contexte**, et ce qui traîne repéré à la réécoute |
| Repli solo | Aucun | **Vocal** à réécouter |

Aucune phrase de l'étape 1 ne reprend un exemple de Machine à Café 3 (boulangerie, bonnet de ski, heure, prénom d'ami). Pour qui a fait Machine à Café, c'est une révision rapide, mais le geste est inverse.

| Champ | Texte |
|---|---|
| `moduleTitle` | Ton anecdote en trois actes `[remplace le titre de travail « Le plan en trois actes » ; à valider]` |
| `why` (« Pourquoi cette étape ? ») | Une anecdote qui te fait déjà sourire se perd souvent en route : trop de contexte, une chute qui arrive en retard, un détail de trop. Le plan en trois actes remet de l'ordre avant de travailler le reste. Ici, on ne rajoute rien : on découpe, on garde, on coupe. |
| `moduleDetail` (version B, scène) | Imagine Samir qui raconte son déménagement : le prix du camion, le cousin qui devait aider, la cage d'escalier, et enfin, au bout de trois minutes, le canapé coincé. Autour de la table, la moitié regarde son téléphone. L'histoire était bonne, elle était juste mal découpée. Une anecdote tient en trois actes : le contexte en deux phrases, la montée avec ses détails, la chute en une phrase. Ici, tu choisis une histoire vraie à toi, tu la découpes en trois blocs et tu coupes tout ce qui traîne. Tu la garderas pour la suite du parcours. |
| `moduleFormat` | Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. |
| `moduleXp` / `free` / `dayNumber` | 50 / oui / 3 (spec, inchangé) |

**Exercice « aujourd'hui »** : c'est le `exercice` du conseil réactivé (§1a, avec repli solo). Texte affiché : « DÉFI 3 ACTES : choisis une anecdote vraie et légère de ta semaine (un trajet, un repas, un rendez-vous). Pose-la en trois blocs : le contexte en deux phrases, la montée en trois ou quatre, la chute en une seule. Dis-la à voix haute à quelqu'un, puis demande-lui à quel moment il a décroché. Personne sous la main ? Enregistre un vocal et réécoute-le : repère ce qui traîne, et coupe-le. » Garde-fou : « vraie et légère » écarte d'emblée une histoire qui touche une blessure (le garde-fou renforcé est celui de l'étape 3).

**Quiz, question modèle** (ton B complice, une question sur le découpage et pas sur les détails). **Bonne réponse en position D** ; positions prévues pour les 4 questions de l'étape : D, B, A, C (jamais deux de suite au même rang). Les 3 autres questions s'écrivent après ta validation de celle-ci. Aucun prénom dans les questions 2 à 4.

> **Imagine Samir qui veut raconter son canapé coincé dans l'escalier. Quelle ouverture pose le mieux le contexte ?**
> A. « Il m'est arrivé un truc de fou en déménageant, vous allez pas en revenir. » (promet, ne pose rien)
> B. « Alors, d'abord, le camion, qui était trop cher, ensuite mon cousin, qui devait venir mais qui avait un truc, et puis l'escalier, qui est étroit. » (le contexte qui s'éternise)
> C. « Dimanche matin, mon cousin m'a aidé à déménager et on a fini par laisser le canapé coincé dans l'escalier. » (la chute dite d'avance)
> **D. « Dimanche matin, quatrième étage sans ascenseur : mon cousin devait m'aider à descendre mon canapé. »**
>
> **Explication (affichée quelle que soit la réponse, 3 phrases)** : La D. Un quand, un où, un qui, en deux phrases au plus, et le canapé coincé reste en réserve pour la chute. La A promet sans rien poser, la B s'éternise, la C raconte la fin avant le début.

Chaque mauvaise réponse enfreint une seule règle (promettre / s'éterniser / griller la chute), ce que l'explication nomme. Aucune ne reprend l'exemple du conseil (rendez-vous et café).

**Les 2 vidéos** (RC4 : plafond 8 min, 1 obligatoire + 1 facultative, aucune minute inventée)

| | Légende (`why`) |
|---|---|
| **Obligatoire** : Panayotis Pascot, « Amsterdam et le Kem's » (6 min 30) | Amsterdam, une partie de Kem's entre potes : il pose le décor en quelques phrases, puis raconte comme s'il y était encore, sans effet de manche. Un modèle de contexte court qui laisse la place à l'histoire. `[À VÉRIFIER en visionnant : que le décor soit bien posé en quelques phrases, et où tombe la chute. Les 4 points de la fiche catalogue (récit revécu, cadre qui dépayse, jeu entre amis, ton sincère) sont vérifiés, pas la structure en actes.]` |
| *Facultative* : Thomas Ngijol, « Le voisin » (5 min 40) | Un voisin banal, puis agaçant, puis dément : chaque marche est un peu pire que la précédente. C'est la montée du deuxième acte, vue de l'intérieur. `[À VÉRIFIER en visionnant ; la fiche catalogue décrit bien l'escalade « marche après marche »]` |

**Les 5 vannes** (désignées par leur texte exact en base, toutes actives, aucune déjà utilisée dans les 13 étapes réécrites en s17). Critère : le contexte et la montée tiennent en une ou deux phrases, la chute est plus courte que le reste.

| # | Vanne (`content` puis chute) | Décryptage de l'étape (une ligne) |
|---|---|---|
| 1 | « Mon copain a vu sur la carte que j'allais à la salle de sport tous les mardis. Il était fier. » / « Il a zoomé. Sur le parking. » | Le contexte et la montée tiennent en une phrase chacun (la carte, sa fierté), la chute en cinq mots : « sur le parking » dit tout sans rien expliquer. |
| 2 | « J'ai couru pour attraper le bus ce matin sous la pluie. » / « Le chauffeur m'a fait un petit signe de la main en passant. » | Le contexte monte l'effort (la course, la pluie), la chute le dégonfle par un geste poli. Personne n'explique : le petit signe est la chute. |
| 3 | « Chez le médecin, je ne connaissais pas mon numéro de sécu. J'ai appelé ma mère. » / « Elle me l'a dicté de mémoire, avec les espaces. » | Trois actes en trois phrases : le problème, l'appel, puis « avec les espaces ». La chute est un détail précis, pas un commentaire. |
| 4 | « J'ai bloqué quelqu'un sur les réseaux. Il m'a appelé pour demander pourquoi. » / « J'ai décroché. J'ai dû mal comprendre le principe. » | Contexte et montée en deux phrases, chute en deux courtes dont la dernière est un aveu sec. Rien ne traîne : retire n'importe quel mot, elle boite. |
| 5 | « Ma copine a acheté deux couettes pour qu'on arrête de se disputer. » / « Elle a pris les deux. » | Un contexte d'une phrase qui promet une solution, une chute de quatre mots qui la retourne. Rallonge-la d'un mot et elle perd. |

Pour le catalogue : les décryptages complets (`comedyTechnique`, `techniqueExplanation`) existent déjà en base pour ces 5 vannes ; la ligne ci-dessus est celle qui relie la vanne à l'étape.

---

## 4. Titre de la page et slug (choix 3)

Le titre de Storytelling n'est pas dans `seo.md` §6 (les 4 titres signés sont /parcours, Répartie, Machine à Café, Confiance) : c'est une proposition à faire signer. Même gabarit que les trois autres : « Parcours X : bénéfice en N semaines », 60 caractères maximum. Volumes de requêtes : **non mesurés** (aucun outil), je n'avance aucun chiffre.

| | Titre | Caractères |
|---|---|---|
| **A** (reco) | Parcours Storytelling : raconter ses histoires en 6 semaines | 60 |
| **B** | Parcours Storytelling : une anecdote qu'on te redemande | 55 |

**Reco : A.** Elle porte la durée comme « Parcours Confiance : retrouver ta légèreté en 6 semaines », et « raconter » est le verbe de la requête. B est plus joli mais ne dit ni la durée ni ce qu'on fait. Règle de partage SEO inchangée : l'article répond à la question, le parcours vend le programme et la première étape gratuite (jamais « cours gratuit »).
**Slug : `storytelling`** (spec §2.1, même logique que `repartie`, `confiance`). Pas de choix : un slug descriptif plus long n'apporterait rien mesurable, et un slug stable évite toute redirection ultérieure.

## 5. Phrase d'accroche du profil Storyteller du quiz (choix 4)

Emplacement : `QUIZ_HUMOUR_PARCOURS.raison.STORYTELLER` (`apps/web/src/config/textes/entrees-parcours.ts`, lu en lecture seule). Texte actuel : « Tu sais tenir une table avec une histoire : ce parcours t'apprend à la raconter au bon moment et jusqu'au bout. » Il promet trop pour Machine à Café (l'anecdote n'y arrive qu'à l'étape 3) et ne dit rien de ce que le visiteur lit à Storytelling 1.

La phrase doit être **vraie pour l'étape 1 affichée** (§3 : découper en trois actes, couper ce qui traîne), et rien de plus : la voix, la chute et le détour sont des étapes payantes, donc hors de la phrase.

| | Phrase |
|---|---|
| **A** (même gabarit que les 4 autres profils) | Tu sais tenir une table avec une histoire : ce parcours commence par lui donner un plan en trois actes, et par couper ce qui traîne. |
| **B** (plus explicite) | Tu racontes bien, mais tu t'étires parfois : l'étape 1 t'apprend à découper ton anecdote en trois actes et à couper ce qui traîne. |

**Reco : A.** Elle garde la forme « Tu [qualité] : ce parcours [ce qu'il fait] » des quatre autres phrases, elle reprend la première moitié déjà en ligne (la partie vraie), et elle n'accuse personne de s'étirer. B est plus précise mais suppose que le profil Storyteller « s'étire », ce que le quiz ne mesure pas.
**Garde-fou pour @fullstack** : tant que Storytelling n'est pas publié, le bouton du profil mène à Machine à Café avec la phrase « vraie » de transition (spec §12, point 3) ; cette phrase de transition est hors de ce choix. La phrase A ne doit s'afficher qu'avec `/parcours/storytelling` en ligne.

---

## 6. Méthode de choix des vannes pour les étapes 2 à 6 (choix 5)

Contrainte : une seule des 30 vannes prévues est active (322, GPS). On ne compte donc plus sur les ids du seed. **Méthode proposée** : pour chaque étape, parcourir les 127 actives avec la fiche technique de l'étape (« personnage défini par un tic », « bilan positif d'un raté », « chute logique après coup », « motif qui revient »), retenir 5 vannes de techniques différentes, écarter celles déjà dans les 13 étapes réécrites en s17, et désigner chaque vanne par son `content` exact.

Lecture rapide des actives (par titre et technique, pas encore par étape finale) :

| Étape | Actives suffisantes ? | Exemples de pistes (non définitives) |
|---|---|---|
| 2, voix et tic des personnages | **Oui**, nombreuses | le père qui répond « je vais chercher du pain », le père en MAJUSCULES, la grand-mère qui cuisine pour douze |
| 3, bilan d'un raté | **Oui** | les mods en 4K, l'arrêt de bus d'en face, « Anniv de Léa » |
| 4, chute logique après coup | **Oui**, nombreuses | « Il a zoomé. Sur le parking. » (déjà en étape 1, à remplacer ici), les deux couettes, la liste de l'ex |
| 5, détour au milieu | **Non** | les actives sont presque toutes des one-liners en deux temps ; aucune ne montre une digression au milieu qui revient au fil |
| 6, motif qui revient | **Juste**, 4 à 5 pistes | « notre truc », « ça lui était égal aussi », le message « Bonjour à tous » sans réponse |

**A (reco)** : actives pour les étapes 2, 3, 4 et 6 ; pour l'étape 5, 5 vannes **neuves** (courtes histoires avec un détour), écrites par @copywriter puis relues à l'aveugle par deux relecteurs (RC10) avant l'import. La spec prévoyait déjà cette option pour l'étape 5 (« adéquation moyenne »).
**B** : actives partout, y compris à l'étape 5, avec des vannes qui montrent le détour par un autre angle (le décryptage dit « ici le détour est dans la chute »). Plus rapide, mais l'étape 5 illustre mal sa propre technique.
Une étape payante qui ne montre pas ce qu'elle enseigne est le défaut que l'audit s17 reprochait (COP-01). **Reco : A.**

---

## Signalements (aucun choix à faire, à lire)

1. **Étape 3 : le conseil en base ne dit pas ce que la spec prévoit.** La spec écrit « Raconter un raté comme une épopée » (3 versions : factuelle, dramatisée, épique). Le conseil actif « Rigoler de ses échecs » enseigne autre chose : le **bilan positif pour de mauvaises raisons** (« C'est raté, mais l'opération n'est pas un échec : je connais enfin tous mes voisins »), avec le défi BILAN. Règle RC2 : le brief suit la base. Je proposerai donc, à l'écriture de l'étape 3, un titre de type « Faire le bilan de ton raté » et le défi BILAN du conseil (déjà sûr : « échec récent et sans gravité »). Si tu veux vraiment l'épopée, c'est un autre conseil à écrire ; je ne le recommande pas.
2. **Titre du callback en base** : « Le callback : faire revenir une **blague** au bon moment », alors que le seed et la spec disent « une **vanne** ». À aligner avec `previousTitle` pour les favoris (comme en s11). Pas de choix, c'est de la cohérence de vocabulaire.
3. **Étape 6 / callback** : le conseil actif parle d'un détail qui a déjà fait rire (version débutant : y revenir deux minutes plus tard). Le fil rouge du parcours (planter dans les premières phrases un détail de SON anecdote) y trouve sa place, mais le texte de l'étape 6 devra faire le pont. Rien de bloquant.
4. **Étape 2** : la spec cite la vidéo des « accents africains » avec la règle « imiter avec tendresse, jamais se moquer d'un accent ». Légendes à écrire en regardant les vidéos.
5. **Niveaux « Expert »** (conseils 5 et 6, et « Construire une histoire drôle ») : jamais affichés (décision acquise).
6. **Durée de l'étape 1** (18 min 30 estimée en spec) : non mesurée, non écrite dans les textes.

---

## Handoff

**Handoff → @orchestrator** (puis @fullstack pour l'import, @design pour l'icône, @seo pour la signature du titre)

- **Fichier produit** : `/home/user/Marrant/docs/copy/etalons-parcours-storytelling-s18.md`. Aucun autre fichier modifié, aucun commit, rien en base. `project-context.md` (historique) à compléter par la session : consigne de session = ne produire que ce fichier.
- **Prêt (en attente de ta validation)** : 3 retouches de conseils avec textes complets (§1) ; fiche A/B (§2) ; étape 1 complète au format s17 (§3 : `why`, `moduleDetail`, exercice, question de quiz modèle, 2 légendes, 5 vannes avec décryptage) ; titre A/B (§4) ; phrase d'accroche A/B (§5) ; méthode de vannes pour les étapes 2 à 6 (§6).
- **Attend Thomas** : choix 1a, 1b, 1c, 2, 3, 4, 5. « Je suis tes recos » = A, A, A, B, A (titre), A (accroche), A (vannes). Puis, hors étalons : visionnage de 2 vidéos de l'étape 1 (`[À VÉRIFIER]` des légendes) ; vérification de la phrase sur Paul Mirabel dans 1a et 1c.
- **Après validation, @fullstack devra** : (1) **réactiver** les 3 conseils (ids de l'audit s14 : « Raconter une anecdote en 3 actes » `cmmp8ozsx000mqk63ux155ma1`, « Le twist final » `cmmp8ozsx000tqk63yhagsgqi`, « La blague à tiroirs » `cmmp8ozsx0012qk63kxfsux75` `[À VÉRIFIER sur la base de prod avant tout UPDATE]`) en y posant `isActive = true` et les textes retouchés, **en base ET dans `conseils-seed.json`** (sinon un rejeu du seed les remet à l'ancien texte, cf. FS-12/COP-09) ; (2) **aligner le titre du callback** (« vanne ») avec `previousTitle` ; (3) importer le parcours (`slug: storytelling`, `order: 4`, vannes désignées par `jokeContents`, vérifier `isActive` de chacune à l'import, RC3/PM-04) ; (4) **brancher la bascule du quiz** : profil Storyteller vers `/parcours/storytelling?src=quiz` seulement quand le parcours est publié, avec la phrase de §5 ; (5) laisser `icon` à @design et ne pas afficher « Expert ». Ordre d'importation : conseils d'abord, puis parcours (le rattachement étape/conseil se fait par titre, `[À VÉRIFIER @fullstack : mécanisme réel de la tâche parcours-content]`).
- **Décisions prises** : registre « pote drôle et bienveillant », version B avec scène (acquis), Samir comme personnage d'exemple (fiche + étape 1), positions de bonne réponse D, B, A, C, différence avec Machine à Café 3 posée dans un tableau lisible (découper et couper contre ajouter), slug `storytelling`.
- **Points d'attention** : objections traitées (« je ne suis pas drôle » : anecdote vraie et légère, repli vocal ; « je m'étire » : étape dédiée à la coupe ; « je n'ai personne à qui raconter » : vocal ; « ça ressemble à Machine à Café » : tableau §3). Références consultées : étalons s17, charte s11, export base du 08/10, 127 vannes actives, fiches vidéo `videos-seed.json`, audit s14 (lignes 162, 294, 296, 473, 518). Mots-clés SEO : `keyword-map` absent ; « raconter » dans le titre `[À SIGNER, volumes non mesurés]`.
- **Contrôles faits sur ce fichier** : zéro tiret cadratin dans les textes ; « blague » uniquement dans « blague à tiroirs » (terme consacré) et en citation de la base ; aucun prénom de persona (Samir, Léa, Tom, Julien sont des exemples) ; aucun concurrent ; aucun chiffre du site modifié (« 20 min/semaine » et « 700 XP + 100 » = décisions de la spec, non réécrits dans les textes publics).
