# C6b : les 5 bilans de fin de parcours

> Auteur : @copywriter, s24. **Statut : tour 3, à relire à l'aveugle.** Rien n'est publié.
> Modèle : `docs/espace-client/audit-contenu/architecture-contenu-v20.md` l. 536 à 545 (3.10). Schéma `bilan` de `apps/web/src/lib/espace/fiches-schema.ts` : 2 « laquelle », 1 « ordre », 1 « voix-haute ».
> `[Framework : démonstration puis geste]` `[Conscience : Solution-Aware]`
> **Mécanique des « laquelle » (tour 3)** : les trois options portent sur le MÊME sujet, celui du quiz de l'étape : la bonne réponse et deux mauvaises réponses du même quiz, mot pour mot. Le contexte neuf est une scène (qui est là, ce qui se passe), jamais l'énoncé de la règle. Le retour dit la règle et pourquoi les deux autres ne passent pas.
> **Compte neuf** : 10 contextes + 10 retours « laquelle » + 5 retours « ordre ». Aucune réplique neuve. Le renvoi « celle-là mérite un deuxième tour » est posé par l'écran, pas écrit dans le retour.
> Sources : `docs/content/parcours-seed.json` (S), `parcours-storytelling-s18.json` (ST), `parcours-boulot-s19.json` (BO), avec numéro de ligne. Guillemets : « » extérieurs, “ ” intérieurs, ‘ ’ au troisième niveau. Seuls changements aux options : guillemets intérieurs passés en “ ” (S l.159) et note de mise en scène retirée (S l.1100, « une micro-anecdote vraie, dans ton ton »). Convention « ordre » : étapes affichées a, b, c (indices 0, 1, 2) ; `ordreCorrect` donne les indices dans le bon ordre. La « voix haute » vient après l'« ordre ».

---

## 1. Machine à Café (`machine-a-cafe`)

**Laquelle 1** (quiz S l.57)
Contexte : « Lundi, 10 h 40, la matinée a été longue, et derrière toi à la machine, Kévin de la compta fait la queue en souriant. Tu te penches pour tenter ton faux secret. Laquelle ressortir ? »
- A) « Ça reste entre nous : je trouve que les réunions du lundi sont trop longues. » (S l.59)
- B) « Ça reste entre nous : Kévin de la compta fait semblant de comprendre les tableaux croisés dynamiques. » (S l.60)
- C) « Ça reste entre nous : je relis toujours mes mails deux fois avant de les envoyer, et je les envoie quand même avec une faute. » (S l.61)

`bonneReponse` : 2 (C)
Retour : « C. Le faux secret est un aveu minuscule sur toi, dit avec la gravité d'un scandale. A se plaint de la matinée, B vise quelqu'un qui est là : ni l'une ni l'autre n'est un faux secret. »

**Laquelle 2** (quiz S l.157)
Contexte : « Ta vanne était prête, mais quelqu'un a lancé un sujet de vacances et toute la tablée est partie dessus. Dans ta tête, ta phrase tourne encore. Que fais-tu ? »
- A) « Tu la ressors quand même en lançant “Pour revenir à ce qu'on disait...” » (S l.159)
- B) « Tu la laisses tomber et tu guettes le prochain blanc : il y en aura un » (S l.160)
- C) « Tu te tais pour le reste de la pause : ce n'est pas ton jour » (S l.162)

`bonneReponse` : 1 (B)
Retour : « B. Après chaque rire il y a un blanc, donc rien n'est perdu : tu laisses partir celui-ci et tu guettes le suivant. A force un moment qui a passé, C renonce au prochain. »

**Dans l'ordre**
Consigne : « Remets dans l'ordre : le faux secret à la machine à café. »
- a) Tu lâches l'aveu.
- b) Tu te penches et tu dis « Ça reste entre nous : ».
- c) Tu t'arrêtes net.

`ordreCorrect` : [1, 0, 2] (source : S l.70 et l.93, quiz de l'étape 1)
Retour : « b, a, c. La posture ouvre le suspense, l'aveu est unique, et le silence final fait le reste. »

**Dis-la à voix haute**
Consigne : « Lis-la une fois, puis dis-la à voix haute sans regarder l'écran, en te penchant : “Ça reste entre nous : je dis ‘je regarde ça’ sur tout ce que je ne regarderai jamais.” » (S l.84)

---

## 2. Repartie (`repartie`)

**Laquelle 1** (quiz S l.315)
Contexte : « Au restaurant, la personne que tu attends pousse enfin la porte, trente minutes après le début du repas prévu, en s'excusant déjà. Vous vous connaissez depuis longtemps et vous vous taquinez volontiers. Laquelle ressortir ? »
- A) « Pile à l'heure ! J'ai juste eu le temps de lire toute la carte. Deux fois. » (S l.320)
- B) « T'as une demi-heure de retard, c'est pas sérieux. » (S l.317)
- C) « Quelle surprise, un retard de ta part. Tu es vraiment incapable de te réveiller, toi. » (S l.318)

`bonneReponse` : 0 (A)
Retour : « A. L'ironie bienveillante dit l'inverse de ce qu'on pense, sur la situation, avec de la douceur. B reproche le retard, C est ironique mais vise la personne : c'est une pique. »

**Laquelle 2** (quiz S l.337)
Contexte : « Dans la cuisine, tu trouves la personne qui partage ton appart en train de manger le repas que tu gardais pour ce soir, sourire aux lèvres. Laquelle ressortir ? »
- A) « Ça va, y en avait pas beaucoup, t'as bien fait. » (tu le penses vraiment) (S l.340)
- B) « Tu es vraiment incapable de te retenir, toi. Bravo. » (S l.342)
- C) « Aucun souci, j'ai toujours rêvé de dîner en regardant ton assiette. Régale-toi. » (S l.341)

`bonneReponse` : 2 (C)
Retour : « C. L'ironie bienveillante dit l'inverse de ce qu'on pense, avec de la légèreté et sans reproche. A est sincère, donc sans jeu ; B est ironique mais vise la personne. »

**Dans l'ordre**
Consigne : « Quelqu'un te chambre sur ton retard habituel. Remets ta réponse dans l'ordre. »
- a) « C'est mon rôle : sans moi, personne ne remarque que vous êtes à l'heure. »
- b) « Tu me remercieras. »
- c) « Après tout le monde, oui. »

`ordreCorrect` : [2, 0, 1] (source : S l.471 et l.473, quiz de l'étape 3)
Retour : « c, a, b. On accepte, on pousse d'un cran, puis on retourne avec un compliment déguisé : l'autre rit avec toi, pas de toi. »

**Dis-la à voix haute**
Consigne : « Dis maintenant la réponse entière à voix haute : “Après tout le monde, oui. C'est mon rôle : sans moi, personne ne remarque que vous êtes à l'heure. Tu me remercieras.” » (S l.473)

---

## 3. Confiance (`confiance`)

**Laquelle 1** (quiz S l.762)
Contexte : « Lundi, à la machine, on te demande ton week-end, et le seul souvenir qui te vienne date de samedi : une heure à attendre, sans pouvoir rentrer chez toi. Laquelle ressortir ? »
- A) « J'ai oublié mes clés. Ça ne m'étonne même plus de moi. » (S l.765)
- B) « J'ai fermé la porte avec mes clés à l'intérieur. Le serrurier m'a demandé si c'était un abonnement. » (S l.766)
- C) « J'ai oublié mes clés, mais bon, tout le monde fait ça. » (S l.767)

`bonneReponse` : 1 (B)
Retour : « B. Un fait précis, et c'est le serrurier qui conclut : tu ne te juges pas. A retombe en verdict sur toi, C enlève la vanne en généralisant. »

**Laquelle 2** (quiz S l.1096)
Contexte : « Au dîner, quelqu'un te demande ce que devient ta vie. Ta semaine a été banale, avec une seule petite chose vraie à raconter : un bruit qui te réveille chaque jour. Laquelle ressortir ? »
- A) « Mon voisin s'est mis au didgeridoo, tous les matins à 7h. Je ne lui en veux pas : il est plus matinal que moi. » (S l.1100)
- B) « Beaucoup de choses ! » (S l.1099)
- C) « Rien de spécial. » (S l.1098)

`bonneReponse` : 0 (A)
Retour : « A. Une micro-anecdote vraie, dans ton ton, donne à l'autre de quoi rebondir. “Rien de spécial” ferme la conversation, “beaucoup de choses” ne laisse rien à reprendre. »

**Dans l'ordre**
Consigne : « Remets dans l'ordre : trouver ton style d'humour. »
- a) Tu le refais exprès sur un quatrième sujet.
- b) Tu retrouves trois messages qui ont fait rire.
- c) Tu notes en une phrase ce qui se répète.

`ordreCorrect` : [1, 2, 0] (source : S l.1054 et l.1067, quiz de l'étape 6)
Retour : « b, c, a. On cherche dans ce qui a marché, on note ce qui revient, puis on le refait exprès : le style se repère avant de se jouer. »

**Dis-la à voix haute**
Consigne : « Lis-la une fois, puis dis-la à voix haute sans regarder l'écran, avec le sérieux d'un communiqué : “Compte rendu de dimanche : le programme 40 degrés a ramené un pull d'adulte au format d'un pull d'enfant. Les pertes sont estimées à un pull.” » (S l.978)

---

## 4. Storytelling (`storytelling`)

**Laquelle 1** (quiz ST l.155)
Contexte : « Tu racontes le déménagement d'un proche : le canapé est resté coincé entre deux étages, et tout le monde attend la fin. Laquelle ressortir ? »
- A) « Alors on a essayé de le tourner, puis de le pencher, puis de le soulever, et on a fini par se dire que peut-être. » (ST l.159)
- B) « Depuis, il fait partie de l'immeuble. » (ST l.158)
- C) « Moralité : la prochaine fois, je louerai un monte-meuble, parce que ce n'est vraiment pas pratique, un canapé coincé. » (ST l.157)

`bonneReponse` : 1 (B)
Retour : « B. Une chute courte, sans leçon : l'image finit seule. A s'enlise dans l'étape par étape, C fait une morale que personne n'a demandée. »

**Laquelle 2** (quiz ST l.393)
Contexte : « Tu racontes ce qui t'attend chaque soir en rentrant, sans dire ce que c'est : “Il est toujours là quand je rentre. Il garde tout ce que je lui confie.” Tes amis attendent la dernière phrase. Laquelle ressortir ? »
- A) « Vous l'avez deviné : je parlais de mon frigo, évidemment. » (ST l.396)
- B) « Et le plus drôle, c'est que ce n'était pas une personne. » (ST l.397)
- C) « Hier soir, j'ai ouvert sa porte à minuit, et il s'est allumé pour moi. » (ST l.395)

`bonneReponse` : 2 (C)
Retour : « C. La dernière phrase montre sans nommer : elle reste vraie pour une personne comme pour l'appareil. A annonce la solution, B explique la blague : les deux coupent le jeu. »

**Dans l'ordre**
Consigne : « Remets dans l'ordre : faire revenir un détail dans la soirée. »
- a) Tu attends que la conversation soit passée à autre chose.
- b) Tu reprends ce détail, une seule fois.
- c) Tu choisis un détail précis et un peu étrange, dit en passant.

`ordreCorrect` : [2, 0, 1] (source : ST l.569 et l.583, quiz de l'étape 6)
Retour : « c, a, b. On sème en passant, on laisse la conversation avancer, puis le détail revient une fois : il arrive quand plus personne ne l'attend. »

**Dis-la à voix haute**
Consigne : « Lis-la une fois, puis dis-la à voix haute sans regarder l'écran, comme une phrase d'ouverture : “Sur la table d'apéro, les bâtonnets de carottes n'ont pas bougé de la soirée.” » (ST l.122)

---

## 5. Boulot (`boulot`)

**Laquelle 1** (quiz BO l.424)
Contexte : « Ton mail de confirmation pour l'atelier de jeudi est prêt, destiné aux six personnes de ton service, que tu croises chaque jour. Ta signature est posée, et tu veux ajouter une dernière ligne d'humeur. Laquelle ressortir ? »
- A) « PS : petite correction, ce n'est pas le ficus que j'arrose depuis mardi, mais son sosie en plastique. » (BO l.428)
- B) « PS : bon week-end à tous, et merci pour la réactivité de chacun. » (BO l.426)
- C) « PS : si la compta valide enfin à temps, ce sera une première. » (BO l.427)

`bonneReponse` : 0 (A)
Retour : « A. Le PS rectifie un détail minuscule et sans enjeu : il détend sans rien parasiter. B est une formule de politesse qui ne fait pas sourire, C pique un service. »

**Laquelle 2** (quiz BO l.632)
Contexte : « Au pot d'un réseau pro, on te demande ton métier. Tu viens de dire : “Je plante des arbres dans un parc.” Laquelle ajoutes-tu ? »
- A) « La mairie me paie pour regarder pousser, avec patience, ce que d'autres ont mal choisi. » (BO l.634)
- B) « Dans quarante ans, des familles pique-niqueront à l'ombre de mon travail, sans me remercier. » (BO l.636)
- C) « Mais assez parlé de moi : et vous, qu'est-ce que vous faites ? » (BO l.637)

`bonneReponse` : 1 (B)
Retour : « B. La seconde phrase prolonge la première avec une image qui regarde loin, et ce temps long fait sourire. A plaisante sur les choix des autres, C passe la parole sans rien dire de ton métier. »

**Dans l'ordre**
Consigne : « Remets dans l'ordre : la vanne de couloir. »
- a) Tu continues ta route, qu'on ait souri ou non.
- b) Tu sors ta phrase en passant, dans le couloir.
- c) Tu choisis le sujet le plus sûr : le thermostat du service.

`ordreCorrect` : [2, 1, 0] (source : BO l.503 à 505 et l.514 à 517, quiz de l'étape 3)
Retour : « c, b, a. Le sujet sûr d'abord, la phrase en passant, puis tu continues : on ne vérifie pas si ça a fait rire. »

**Dis-la à voix haute**
Consigne : « Lis-la une fois, puis dis-la à voix haute sans regarder l'écran, sur le ton d'un constat : “Un chargeur est branché sous la table, sans téléphone au bout.” » (BO l.360)

---

## Table de contrôle

Test d'acceptation : « Sans parcours » = hésite entre ces options ; « Avec parcours » = n'en garde qu'une.

| Bilan | Contexte | Bonne réponse (ligne) | Mots du contexte absents de la bonne réponse | Sans parcours | Avec parcours |
|---|---|---|---|---|---|
| 1 | L1 | S l.61 | oui (matinée, Kévin, compta, queue, souriant, penches, tenter, faux, secret) | A ou C (deux phrases sur soi ou sur la matinée) | C : aveu minuscule sur toi, A se plaint, B vise Kévin |
| 1 | L2 | S l.160 | oui (vanne, quelqu'un, sujet, vacances, tablée, partie, tête, tourne) | A ou B (reprendre ou laisser passer) | B : le blanc reviendra |
| 2 | L1 | S l.320 | oui (restaurant, attends, pousse, trente, minutes, début, repas, prévu, excusant, taquinez) | A ou B (une pique douce ou un reproche) | A : l'inverse dit avec douceur |
| 2 | L2 | S l.341 | oui (cuisine, trouves, partage, appart, train, manger, repas, gardais, soir, sourire, lèvres) | A, B ou C (sincère, pique, ironie) | C : ironie sur la situation, sans reproche |
| 3 | L1 | S l.766 | oui (week-end, souvenir, date, samedi, attendre, rentrer) | A ou B (deux versions drôles) | B : le serrurier conclut, A est un verdict |
| 3 | L2 | S l.1100 | oui (dîner, quelqu'un, demande, devient, vie, semaine, banale, bruit, réveille) | A ou B (donner du contenu) | A : micro-anecdote qui donne prise |
| 4 | L1 | ST l.158 | oui (déménagement, proche, canapé, resté, coincé, étages, attend, fin) | A, B ou C (trois fins plausibles) | B : chute courte, sans leçon |
| 4 | L2 | ST l.395 | oui (récit, attend, soir, rentrant, dire, amis, dernière, phrase) | B ou C (deux fins à effet) | C : montre sans nommer, A et B annoncent |
| 5 | L1 | BO l.428 | oui (confirmation, atelier, jeudi, six, personnes, service, croises, signature, posée, humeur) | A ou B (une note sympa ou un détail) | A : rectifier un détail minuscule |
| 5 | L2 | BO l.636 | oui (pot, réseau, pro, demande, métier, viens, plante, arbres, parc) | A ou B (deux secondes phrases drôles) | B : image qui regarde loin |

| Contrôle | Résultat |
|---|---|
| Répliques | mot pour mot, lignes citées ; chaque bonne réponse est la réponse juste du quiz (S l.75, 86, 97, 322, 344, 478, 589, 1059, 1103, 1070 ; ST l.162, 400 ; BO l.364, 431, 639 vérifiés au tour 2), chaque leurre est une mauvaise réponse du même quiz |
| Une seule bonne réponse | B, C, A, B, A, B, B, C, A, B désignées avant les retours (à reconfirmer à l'aveugle) |
| Position de la bonne réponse | 2, 1, 0, 2, 1, 0, 1, 2, 0, 1 |
| Tirets cadratins | 0 (grep fait) ; emoji, IA, concurrent : 0 ; « TGV » supprimé |
| Guillemets | « » extérieurs, “ ” intérieurs, ‘ ’ au troisième niveau (B1 voix haute) |
| Genre | aucune option avec accord genré de l'utilisateur ou de la personne d'en face (« voleur » S l.339 et « venu » S l.319 écartées) ; contextes avec « la personne », « quelqu'un », « un proche » |
| Doublons | grep (Kévin, palier, canapé, ficus, pot d'un réseau, pull d'adulte, cantine, etc.) dans qr*, c3*, c4*, c6a, c6c, c7 et le blog : aucune scène identique ; les occurrences de « canapé » ou « palier » sont d'autres scènes |

## Tour 3 : retouche → ligne

| Retouche demandée | Où |
|---|---|
| 10 « laquelle » refaites : même sujet, bonne réponse du quiz et deux mauvaises du même quiz | bilans 1 à 5, 10 blocs « Laquelle » (lignes citées) |
| Contexte en scène, sans énoncé de la règle | B3 L1 (week-end sans pouvoir rentrer), B4 L1 (canapé coincé), B4 L2 (« Il est toujours là… »), B5 L2 (« Je plante des arbres dans un parc. ») |
| Test d'acceptation par question | table de contrôle, colonnes « Sans parcours » et « Avec parcours » |
| Guillemets imbriqués (7 lignes, 3 niveaux en B1) | consignes « voix haute » des 5 bilans, option S l.159 |
| B4 L2 et B5 L1 à deux bonnes réponses | options remplacées par celles des quiz ST l.393 et BO l.424 (la correction d'eau de S/BO l.429 écartée) |
| B2 L2 : repas « déjà mangé » et « Régale-toi » | « en train de manger le repas que tu gardais » |
| Retour B2 L2 faux (« jamais sur la personne ») | « avec de la légèreté et sans reproche » |
| « TGV » | l'option est sortie du bilan 1 (S l.194 n'est plus utilisée) |
| Écho « Mon voisin… » de B1 L2 et B3 L2 | le leurre de B1 L2 est retiré |
| Voix haute B3 proche de C4b J2 (four) | remplacée par S l.978, réponse juste |
| Les 5 « ordre » | inchangés |
