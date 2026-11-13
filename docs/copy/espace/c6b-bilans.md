# C6b : les 5 bilans de fin de parcours

> Auteur : @copywriter, s24. **Statut : tour 1, à relire à l'aveugle.** Rien n'est publié.
> Source : `docs/espace-client/audit-contenu/architecture-contenu-v20.md` 3.10, schéma `bilan` de `apps/web/src/lib/espace/fiches-schema.ts` (2 « laquelle », 1 « ordre », 1 « voix-haute » par bilan).
> `[Framework : démonstration puis geste]` `[Conscience : Solution-Aware]`
> **Compte neuf** : 10 contextes + 10 retours « laquelle » + 5 retours « ordre » = 25 textes écrits ici (les 15 retours sont la charge « textes de retour » ; les 10 contextes la charge « contextes »). **Aucune réplique neuve** : chaque option est reprise mot pour mot, avec sa ligne d'origine (`qr*-situations.md`, numéro de ligne). Les étapes des « ordre » reprennent les règles et les « À toi » des mêmes fiches.
> Convention « ordre » : les étapes sont affichées dans l'ordre a, b, c (indices 0, 1, 2) ; `ordreCorrect` donne les indices dans le bon ordre.
> Renvoi en cas d'erreur (« celle-là mérite un deuxième tour ») : posé par l'écran à partir de la fiche d'origine de la bonne réponse, pas écrit dans le retour.

---

## 1. Machine à Café (`machine-a-cafe`)

**Laquelle 1**
Contexte : « Le lendemain d'une réunion où tu as longuement pris la parole, quelqu'un du service te félicite à la pause. Laquelle ressortir ? »
- A) « Calme, merci. J'ai fait quelques petites choses, aucune de la liste. » (qr2 l.216)
- B) « Merci. L'équipe y est pour beaucoup : elle m'a évité les pires diapositives. » (qr2 l.330)
- C) « Avec plaisir. Je viens pour les gens. Les cacahuètes sont une coïncidence. » (qr2 l.254)

`bonneReponse` : 1 (B)
Retour : « B. On te félicite : tu rends une part du mérite et tu glisses un détail qui fait sourire. A répond à une autre question, C à une invitation. »

**Laquelle 2**
Contexte : « Dans le couloir, vers onze heures, quelqu'un te croise et te demande de tes nouvelles, sans s'arrêter. Laquelle ressortir ? »
- A) « Ça va, merci : j'ai trouvé un stylo qui marche du premier coup. » (qr1 l.107)
- B) « Je viens. J'ai même prévu une tenue : la même, en plus détendue. » (qr2 l.258)
- C) « Déjà sept prénoms retenus. Je ne sais pas à qui ils vont, mais je les ai. » (qr2 l.296)

`bonneReponse` : 0 (A)
Retour : « A. Une nouvelle minuscule, dite sans s'arrêter : elle tient dans la durée d'un couloir. B répond à une invitation, C à une première journée. »

**Dans l'ordre**
Consigne : « Remets dans l'ordre le geste du « Ça va ? » au bureau. »
- a) Un collègue te lance « Ça va ? »
- b) Tu bois.
- c) Tu dis ta réplique, rien d'autre.

`ordreCorrect` : [0, 2, 1] (source : qr1 l.118 et l.120)
Retour : « a, c, b. La question, ta réplique seule, puis le café. Tu n'expliques rien : c'est l'arrêt qui la fait tenir. »

**Dis-la à voix haute**
Consigne : « Dis à voix haute, sans l'expliquer : « Ça va. J'ai juste l'impression d'avoir oublié un mardi. » » (qr1 l.108)

---

## 2. Repartie (`repartie`)

**Laquelle 1**
Contexte : « Au dîner, une personne de la bande finit l'histoire qu'elle préparait depuis le début du repas, puis te fixe et te reproche ton air sérieux. Laquelle ressortir ? »
- A) « Jamais. Je le garde pour un mois où il ne se passera rien. » (qr3 l.182)
- B) « Samedi. Je commençais à devenir un souvenir. » (qr3 l.258)
- C) « Si, en différé. Le signal arrive jeudi. » (qr3 l.220)

`bonneReponse` : 2 (C)
Retour : « C. On te reproche de ne pas avoir ri : tu réponds « si », avec un décalage assumé. A et B répondent à d'autres phrases. »

**Laquelle 2**
Contexte : « Après une partie de cartes en famille, tu remportes la manche finale, et toute la tablée proteste. Laquelle ressortir ? »
- A) « J'ai ri à l'intérieur. Les murs sont épais. » (qr3 l.224)
- B) « Tout ce que j'ai fait est dans les règles. Celles que j'ai écrites au deuxième tour. » (qr3 l.340)
- C) « Je faisais des économies. J'ai maintenant assez de nouvelles pour une heure. » (qr3 l.302)

`bonneReponse` : 1 (B)
Retour : « B. On te soupçonne : tu te défends avec le sérieux d'un avocat, et la tablée rit de ta mauvaise foi. A répond à un silence, C à un reproche d'absence. »

**Dans l'ordre**
Consigne : « Remets dans l'ordre la scène de la poêle. »
- a) Tu dis une seule phrase, calmement.
- b) Tu tends la main pour reprendre la poêle.
- c) Quelqu'un tient la poêle en l'air : « Elle est là depuis jeudi. »

`ordreCorrect` : [2, 0, 1] (source : qr1 l.19, l.45)
Retour : « c, a, b. Une phrase, puis le geste. Pas de déni, pas d'excuses répétées : la scène passe avant. »

**Dis-la à voix haute**
Consigne : « Debout, sans sourire, dis à voix haute : « Elle est à moi. Je la lave, et jeudi n'aura jamais existé. » » (qr1 l.29, geste de l'« À toi » l.48)

---

## 3. Confiance (`confiance`)

**Laquelle 1**
Contexte : « Il est tard, ton énergie est à plat, et l'hôte te presse de rester une heure de plus. Laquelle ressortir ? »
- A) « Je file pendant que tout le monde m'aime encore. » (qr2 l.176)
- B) « Je viens. Je danse surtout des épaules, le reste me suit quand il peut. » (qr2 l.102)
- C) « Avec plaisir. Je fais plusieurs photos : on garde celle où personne n'a fermé les yeux. » (qr2 l.64)

`bonneReponse` : 0 (A)
Retour : « A. Tu pars en gardant le sourire de la salle : un départ qui se présente comme un compliment. B et C disent oui à une danse ou à une photo. »

**Laquelle 2**
Contexte : « En réunion, on t'interroge sur un point alors que ton esprit est resté deux sujets plus tôt. Laquelle ressortir ? »
- A) « Merci. C'était la version courte. Voici celle avec le son. » (qr3 l.28)
- B) « Je prends les notes. Je n'ai qu'un stylo, donc une idée à la fois. » (qr2 l.372)
- C) « J'avais une excellente réponse à une autre question. Tu peux reformuler celle-ci ? » (qr3 l.104)

`bonneReponse` : 2 (C)
Retour : « C. Tu as perdu le fil, tu le dis en une phrase et tu redemandes la question. A répond à un micro coupé, B à une prise de notes. »

**Dans l'ordre**
Consigne : « Remets dans l'ordre : on te demande ce que tu fais, en soirée. »
- a) Tu ajoutes un détail qui relance.
- b) On te demande ce que tu fais.
- c) Tu réponds vrai en une phrase courte.

`ordreCorrect` : [1, 2, 0] (source : qr1 l.74)
Retour : « b, c, a. Une phrase vraie d'abord, le détail ensuite : c'est lui qui donne une prise à l'autre. »

**Dis-la à voix haute**
Consigne : « Dis à voix haute, sans la lire : « Personne. J'ai encore toutes mes premières impressions à faire. » » (qr2 l.30)

---

## 4. Storytelling (`storytelling`)

**Laquelle 1**
Contexte : « À un mariage, micro en main, tu as une limite de temps fixée d'avance et la salle patiente. Laquelle ressortir ? »
- A) « Le gâteau attend, et il a de l'autorité : je commence. » (qr5 l.24)
- B) « En vous voyant, j'ai décidé d'applaudir plutôt que de parler. » (qr5 l.133)
- C) « On m'a dit “deux minutes”. J'en ai déjà utilisé dix secondes à vous le dire. » (qr5 l.98)

`bonneReponse` : 2 (C)
Retour : « C. Le temps est compté : tu le dis en riant, et tu commences. A ouvre un anniversaire, B remercie une salle de fin de soirée. »

**Laquelle 2**
Contexte : « Dîner entre proches : on te demande de raconter ta semaine, et elle n'a eu aucun événement digne d'un récit. Laquelle ressortir ? »
- A) « Si, mardi. Il est au chaud dans l'entrée. » (qr5 l.243)
- B) « J'ai réparé un tiroir. Il ferme. Je ne m'en remets pas. » (qr1 l.85)
- C) « Samedi. Je commençais à devenir un souvenir. » (qr3 l.258)

`bonneReponse` : 1 (B)
Retour : « B. Rien de grand à raconter : tu annonces la plus petite nouvelle avec le sérieux d'un exploit. A parle d'un colis, C fixe un rendez-vous. »

**Dans l'ordre**
Consigne : « Remets dans l'ordre : tu as beaucoup à dire. »
- a) L'autre demande la suite.
- b) Tu donnes d'abord la plus petite nouvelle.
- c) Quelqu'un te lance « Alors, quoi de neuf ? »

`ordreCorrect` : [2, 1, 0] (source : qr1 l.96)
Retour : « c, b, a. La petite nouvelle ouvre la porte, et la suite se demande toute seule. »

**Dis-la à voix haute**
Consigne : « Dis à voix haute, en la posant : « J'ai essayé un nouveau café. Je n'ai pas encore de conclusion. » » (qr1 l.86)

---

## 5. Boulot (`boulot`)

**Laquelle 1**
Contexte : « L'échange d'embauche s'achève, et la personne en face te laisse la parole. Laquelle ressortir ? »
- A) « Une seule, et sérieuse : à quoi ressemble une bonne première semaine ici ? » (qr3 l.66)
- B) « Oui, merci. Du premier coup : je vais le noter quelque part. » (qr3 l.142)
- C) « Très bien. J'ai trouvé les toilettes du premier coup : le reste suivra. » (qr2 l.292)

`bonneReponse` : 0 (A)
Retour : « A. Une vraie question qui te montre déjà dans le poste, avec un petit trait sérieux. B répond à un trajet, C à une première journée. »

**Laquelle 2**
Contexte : « Dernière heure de ton premier jour dans l'entreprise : une personne de ton étage passe voir comment tu t'en sors. Laquelle ressortir ? »
- A) « J'ai fait une sieste d'une conviction rare. Je pourrais donner une formation. » (qr2 l.220)
- B) « Très facilement. Le plus dur : arrêter de répéter mes réponses à voix haute dans la rue. » (qr3 l.146)
- C) « Déjà sept prénoms retenus. Je ne sais pas à qui ils vont, mais je les ai. » (qr2 l.296)

`bonneReponse` : 2 (C)
Retour : « C. Des prénoms sans visages : un aveu minuscule, vrai pour toute personne qui arrive. A parle d'une sieste, B d'un trajet. »

**Dans l'ordre**
Consigne : « Remets dans l'ordre : ton premier jour au travail. »
- a) Tu choisis celle qui te fait le plus sourire.
- b) Tu écris deux petites réussites de ton premier jour.
- c) Tu la dis à voix haute.

`ordreCorrect` : [1, 0, 2] (source : qr2 l.311)
Retour : « b, a, c. D'abord deux candidates, puis la plus drôle, puis la voix : une phrase qui sonne se choisit avant de se dire. »

**Dis-la à voix haute**
Consigne : « Dis à voix haute : « Très bien. J'ai trouvé les toilettes du premier coup : le reste suivra. » » (qr2 l.292)

---

## Table de contrôle

| Bilan | Contexte | Bonne réponse (reprise, ligne d'origine) | Mots du contexte absents de la bonne réponse |
|---|---|---|---|
| 1 | L1 | qr2 l.330 (B4 sûre) | oui (lendemain, réunion, parole, service, félicite, pause) |
| 1 | L2 | qr1 l.107 (A4 sûre) | oui (couloir, onze, heures, croise, nouvelles, arrêter) |
| 2 | L1 | qr3 l.220 (M2 sûre) | oui (dîner, bande, histoire, fixe, reproche, air, sérieux) |
| 2 | L2 | qr3 l.340 (F2 joueuse) | oui (cartes, famille, manche, finale, tablée, proteste) |
| 3 | L1 | qr2 l.176 (S5 sûre) | oui (tard, énergie, plat, hôte, presse, rester, heure) |
| 3 | L2 | qr3 l.104 (R3 sûre) | oui (réunion, interroge, point, esprit, sujets, tôt) |
| 4 | L1 | qr5 l.98 (P3 joueuse) | oui (mariage, micro, limite, temps, fixée, salle, patiente) |
| 4 | L2 | qr1 l.85 (A3 sûre) | oui (dîner, proches, raconter, semaine, événement, digne, récit) |
| 5 | L1 | qr3 l.66 (R2 sûre) | oui (échange, embauche, achève, personne, face, laisse, parole) |
| 5 | L2 | qr2 l.296 (B3 joueuse) | oui (dernière, heure, premier, jour, entreprise, étage, sors) |

Autres répliques reprises (options et voix haute) : toutes listées avec leur ligne dans le texte ci-dessus ; 0 réplique neuve. Pas de mot ni de signal de registre dans les contextes : aucun ne dit « sourit », « plaisante » ni « tu as déjà ri ».

| Contrôle | Résultat |
|---|---|
| Tirets cadratins | 0 (recherche du caractère faite sur ce fichier) |
| Emoji, IA, concurrent | 0 |
| Genre | aucun accord pour l'utilisateur ni pour la personne d'en face (« quelqu'un », « une personne », « l'hôte », « la bande », pas de participe accordé) |
| Guillemets | « » extérieurs, “ ” intérieurs |
| Doublons | grep des idées (félicitation après exposé, croisement dans le couloir, reproche de ne pas rire, partie de cartes, hôte qui retient, perte de fil en réunion, limite de temps au micro, semaine sans événement, fin d'entretien, fin de premier jour) dans qr*, c3*, c4*, c6a, c6c, c7 et `blog-article-rewrites.json` : seules coïncidences = les situations d'origine des répliques reprises (voulu, contexte réécrit). Aucun doublon avec un autre lot ni avec le blog. |
| Une seule bonne réponse | chaque décor ne correspond qu'à une des trois répliques (les deux autres répondent à une autre question) |
| Position de la bonne réponse | 1, 0, 2, 1, 0, 2, 2, 1, 0, 2 |

Points à surveiller en relecture à l'aveugle : le bilan teste surtout « à quelle question répond cette réplique » (la mécanique de l'exemple 3.10) ; les étapes des « ordre » sont tirées des règles et « À toi » des fiches d'origine, à aligner avec le quiz réel de chaque parcours quand @fullstack les branche.
