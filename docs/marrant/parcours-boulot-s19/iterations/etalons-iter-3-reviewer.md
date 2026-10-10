# Étalons Parcours Boulot : itération 3, note @reviewer (s19, 10/10/2026)

Document noté : `docs/copy/etalons-parcours-boulot-s19.md` (413 lignes). Relus : ma note d'itération 2, le modèle `etalons-parcours-storytelling-s18.md` (et `parcours-storytelling-s18.json`), la spec s17 §1 (RC3 à RC8) et §3.2, `boulot-base-s19.json`, `vannes-actives-s17.json`, `parcours-seed.json`, `parcours-reecriture-s17.json`, les sources des conseils (`conseils-boulot-s19-v1.md`, `-v2.md`, `-v5.md`, `-v6.md`), `founder-preferences.md` (07/10 et 08/10), et le code qui affiche la fiche (`parcours-catalogue.ts`, `parcours-content.tsx`). Comme demandé, le texte des 6 conseils n'est pas noté.

## Note : 8,5/10

**Résumé.** Les 6 bloquants de l'itération 2 sont corrigés, et 12 des 13 non bloquants le sont aussi (le 7 ne l'est qu'en partie, voir la correction 10). Le choix 1 valide bien les cinq textes, partout. La question 1 du quiz ne se devine plus et couvre la première consigne du conseil. Machine à Café 2 est bien réservée aux membres Premium, Roumanoff a disparu, et le brief des vannes de l'étape 6 suit le rappel. J'ai recompté ce qui suit et tout est exact : `why` 52 mots, `moduleDetail` 99, longueurs des 12 réponses, positions B, D, A. Au §5 : 9 + 3 = 12 vannes en ligne (8 fortes, 4 acceptables), plus 18 neuves (3, 2, 3, 3, 2, 5), soit 30. Les titres font 60, 56 et 57 caractères. Le tableau des choix et « Je suis tes recos » sont alignés point par point (1 à 8). Aucun tiret cadratin, ni « blague », ni « carnet » dans les textes du site. Le champ `persona` (« Sophie… ») ne s'affiche nulle part : le site affiche `personaTagline` (`parcours-catalogue.ts` l. 43).

Deux points bloquent encore le 10. Ce sont les deux choix nouveaux de l'itération 2, et ils ont le même défaut : **une décision suspendue à une relecture à l'aveugle que personne n'a lancée.** Thomas ne sait donc pas ce qu'il valide.

**2 corrections bloquantes (1 et 2), 8 non bloquantes (3 à 10).**

## Vérification des 6 conseils (copie à l'identique)

| Étape | Source | Titre, catégorie, difficulté | contenu | exemple | exercice |
|---|---|---|---|---|---|
| 1 | v5, P2-bis (l. 30-41) | identiques | identique | identique, 2 lignes | identique (DÉFI TRACE) |
| 2 | en ligne | non recopié (choix 7 seulement) | | | |
| 3 | v2 (l. 48-58) | identiques | identique | identique | identique (DÉFI CROISEMENT) |
| 4 | v1 (l. 48-58) | identiques | identique | identique | identique |
| 5 | v1 (l. 66-77) | identiques | identique | identique, retours à la ligne rétablis | identique |
| 6 | v6, T-b (l. 28-41) | identiques | identique | identique (16 mots d'humour, total 107), retours à la ligne rétablis | identique |

Le DÉFI TRACE du §3 est mot pour mot celui du §1. Il ne reste aucun écart.

---

## Corrections bloquantes

**1. Étape 6 sans vidéo (choix 5B) : la condition ne tient pas et contredit la spec. Solution : Hamzawi à l'étape 6, traitée comme les étapes 2 à 5.**

*Pourquoi la condition ne tient pas.*
- La règle d'or (P0, 08/10) vise « un contenu jugé sous la barre (conseil, vanne, vidéo, texte retiré ou désactivé après une relecture à l'aveugle) ». Ni Hamzawi « Les chagrins d'amour » (en ligne, Storytelling 3, `Fw14PLdtSyA`) ni Rollman « Les enterrements de vie » (en ligne, Confiance 4) n'ont été jugées sous la barre. Une légende neuve n'est pas un contenu retiré. La règle d'or ne s'applique pas ici.
- La relecture à l'aveugle est définie pour les conseils (étalons E2 à E7, 08/10) et pour les vannes (barre Alexa, 06/10). Il n'existe aucun étalon de légende : la condition « une légende jugée par les deux relecteurs à l'aveugle » ne peut pas être exécutée.
- Le précédent est clair : en s18, les légendes ont été validées par Thomas avec les étalons, sans relecture à l'aveugle (modèle l. 137-144, choix validé le 08/10). Le document lui-même dit que les légendes des étapes 2 à 5 « s'écrivent avec les étapes, en regardant chaque vidéo » (l. 283). L'étape 6 reçoit un traitement à part sans raison.

*Pourquoi c'est bloquant.*
- RC4 demande une vidéo obligatoire, et la spec §3.2 prévoit « une seule » vidéo à l'étape 6. Le document pose lui-même la règle « étape 6 une seule » (l. 268), puis recommande zéro vidéo. Le modèle Storytelling écrit pour son étape 6 « Un conseil, un défi, 5 vannes, une vidéo, un petit quiz » (`parcours-storytelling-s18.json` l. 514).
- Thomas ne sait pas ce qu'il valide. « Je suis tes recos » dit « étape 6 sans vidéo » (l. 23, l. 347), mais le §6 dit que Hamzawi « n'entre que si sa légende est jugée… » (l. 278). Selon la ligne qu'il lit, c'est une décision ferme ou une condition.
- Une étape sans vidéo n'a jamais existé sur le site. Rien ne garantit que le rendu tienne (section vidéo vide) : c'est un risque d'import que rien ne justifie.

*Correction (la plus simple pour Thomas).* En B, l'étape 6 prend **Nora Hamzawi, « Les chagrins d'amour »** comme vidéo unique, sans condition. Raisons :
- elle dure 4 min en base, sous le plafond de 5 min, donc il n'y a pas d'extrait à découper (Rollman, avec 6 min 40, en demande un) ;
- la session a vérifié qu'elle existe et s'intègre ;
- sa fiche dit « auto-dérision », ce qui colle à la règle de cible du conseil (« la cible, c'est toi ») ;
- son format (une chronique de radio, donc un texte écrit d'avance puis lu à voix haute) est celui du toast, qui « reste sur ta feuille jusqu'au jour J ».

Sa légende s'écrit avec l'étape 6, en regardant la vidéo, comme aux étapes 2 à 5. Piste pour @copywriter, vraie quoi qu'on voie : « Une chronique, c'est un texte écrit d'avance puis lu à voix haute, comme ton toast. Repère qui fait les frais de chaque rire : dans ton toast, ce sera toi ou un détail, jamais la personne honorée. » Si, une fois regardée, elle ne tient pas, @copywriter le signale à l'écriture de l'étape, comme pour toute autre vidéo. Ce n'est pas une condition posée à Thomas.

Endroits à aligner :
- l. 17 (ligne 5) : « B mes remplacements pour les étapes 1 (facultative), 2, 4, 5 et 6 ; étape 3 gardée comme dans la spec » ; colonne « Ce que ça change » : « …à l'étape 6, aucune vidéo du catalogue n'est vraiment juste : Hamzawi est la moins éloignée (autodérision, texte écrit puis lu) ».
- l. 23 et l. 347 : « B (vidéos : Vérino en facultative de l'étape 1, Hamzawi à l'étape 6) ».
- l. 278 (§6, étape 6, colonne B) : « Une seule : **Nora Hamzawi, « Les chagrins d'amour »** (4 min en base, sous le plafond, déjà utilisée dans Storytelling 3) ». Dans « Pourquoi », supprimer les deux dernières phrases (« Elle n'entre que si… », « …vide assumé… ») et garder l'adéquation « moyenne à faible » avec ses raisons.
- l. 282 (bilan) : « 5 vidéos changées sur 5 étapes (1 jamais utilisée ; 4 déjà utilisées : Vérino, Croce « avion », Rollman « relations sociales », Hamzawi) ». Supprimer « L'étape 6 est sans vidéo en B ».
- l. 283 (reco) : « À l'étape 6, gain faible mais réel : une vidéo sous le plafond, sans extrait, dont la fiche porte l'autodérision. » Ajouter Storytelling 3 à la liste des doublons.
- l. 349 (décisions) et l. 351 (« 4 vidéos changées en B » devient 5) ; la note de l'en-tête l. 7 reste juste.

**2. Témoignage B conditionnel (choix 2) : décidable sur le papier, mais Thomas ne sait pas quel texte sera publié, et le repli n'a pas été vérifié. Solution : régler la condition avant de lui remettre le document.**

*Le constat.*
- Sur le fond, la condition est légitime. La réplique « Il descend par l'escalier. » est une vanne publiée sur la page de vente, et la barre Alexa vaut pour « toute vanne publiée » (06/10). Le modèle s18 n'avait pas ce problème : son témoignage cite une réaction (« Attends, refais le passage du cousin. »), pas une vanne.
- Sur la forme, ce n'est pas décidable pour Thomas. Il dit « B » sans savoir quel témoignage ira en ligne. Personne n'est désigné pour lancer la relecture, et aucune date n'est fixée (avec les 18 vannes neuves, après le choix 4 ? avant ?).
- Le repli n'a pas été relu. Avec la description B, le témoignage A répète l'idée de la description : « une vanne… que tu as gardée pour toi » face à « une phrase en tête qu'elle gardait pour elle ». Cela casse la règle que le document s'est donnée (« Trois champs, trois idées différentes », l. 107).
- Le choix 7 a le même défaut. La retouche du PS « repasse la relecture à l'aveugle avant d'être mise en base » (l. 91). Si elle échoue, la phrase « Chaque exercice a une version sans risque » de la description B ne tient plus pour l'étape 2, et Thomas l'aura validée.

*Correction (la plus simple pour Thomas : il valide des textes déjà passés, comme pour les conseils au choix 1).*
- Avant de remettre le document, la session fait passer à l'aveugle la vanne du témoignage B et la phrase ajoutée au défi du PS. Le circuit est celui des tours 5 et 6 (2 critiques, départage si elles divergent).
- Si les deux passent, la ligne 2 du tableau devient « **B** » sans condition, et la ligne 7 « **Oui** (phrase passée à l'aveugle) ».
- Si la vanne échoue, @copywriter réécrit le témoignage B sur le modèle s18 : le résultat se lit dans une réaction, sans vanne citée. Exemple de direction : elle lâche une phrase de dix mots en passant devant l'ascenseur, et à midi un collègue la répète. Plus rien n'est alors à relire à l'aveugle. Le témoignage A reste une option du tableau, jamais un repli automatique mélangé à la description B.
- Si la retouche du PS échoue, le choix 7 est présenté avec le texte qui a passé, ou retiré, avec la conséquence déjà écrite l. 91.

Endroits à aligner : l. 14, l. 19, l. 23, l. 91, l. 107-108 (supprimer le paragraphe « Témoignage B conditionnel »), l. 347, l. 349 ; tableau des choix, colonne Reco du choix 2 : « **B** (description, accroche et témoignage) ».

*Si la session ne peut pas lancer la relecture avant la remise :* la reco du choix 2 devient « B, avec un témoignage B réécrit sans vanne citée », et ce texte est écrit dans le document. Dans tous les cas, plus aucune condition n'apparaît dans « Je suis tes recos ».

---

## Corrections non bloquantes (nécessaires pour le 10)

**3. §2, l. 108 : la raison donnée pour l'objet du témoignage B est fausse.** « L'objet n'est pas celui de l'étape 3 (l'imprimante…), pour que la page de vente ne dévoile pas le ressort d'une étape payante. » Or le DÉFI CROISEMENT de l'étape 3 cite justement « l'ascenseur » (§1, l. 63). Et le ressort de l'étape (un irritant partagé, une phrase courte) est précisément ce que montre le témoignage. Rien n'interdit d'ailleurs qu'un témoignage montre un résultat : RC8 ne protège que le conseil, l'exercice et les vannes. Correction : supprimer la phrase. Si le témoignage est réécrit (correction 2), la question ne se pose plus.

**4. §5, l. 260 : mauvaise date d'export.** « 127 vannes en ligne du catalogue (à la date de l'export, 08/10) » : `vannes-actives-s17.json` est daté du **07/10** (`_meta.date`), comme le dit la l. 255. Correction : « (export du 07/10) ».

**5. §3, explications du quiz : le nombre de phrases annoncé ne suit pas une règle unique.** La Q1 annonce « 3 phrases » en comptant « La B. ». La Q2 annonce 3 et la Q3 annonce 2 sans compter « La D. » ni « La A. ». Avec une seule règle, on obtient 2, 3, 2 (sans compter « La X. ») ou 3, 4, 3 (en le comptant). Correction : l. 162, « 2 phrases après « La B. » », et la même mention aux l. 171 et 180 ; ou supprimer ces comptes, qui ne servent à rien.

**6. §3, l. 199 : la légende de VDB fait un lien flou avec la leçon.** « C'est le regard neuf que tu poses sur ta salle » ne renvoie à aucune consigne du conseil. La fiche (« le jargon ramené au langage de tous les jours ») colle en revanche à la première consigne : « La première dit ce que tu vois, mot pour mot. » Correction proposée : « Repère chaque fois le mot simple qui prend la place du mot savant : c'est ce que fait ta première phrase, qui dit ce que tu vois, mot pour mot. » Ensuite, refaire le contrôle lexical (aucun mot de la liste interdite).

**7. §7, l. 300, étape 6 : la colonne « Repli sans risque » répète l'exercice.** « Écrire le texte et compter les mots, sans rien prononcer », c'est déjà l'exercice principal, qui finit par « Rien à prononcer ». Le vrai repli du conseil, c'est : « Aucun pot en vue ? Choisis quelqu'un qui t'a dépanné au travail et imagine son pot de départ. » Correction : « Pas de pot en vue : imaginer celui de quelqu'un qui t'a dépanné au travail ; rien n'est prononcé. »

**8. Signalement 7, l. 332 : deux estimations dans le même paragraphe.** Le texte dit « environ 1 000 mots à lire », puis « mots estimés à l'œil, environ 1 050 ». Correction : garder un seul chiffre (1 000), le calcul de 5 minutes en dépend.

**9. §2, l. 111 : une validation cachée.** « Cette ligne est pour toi, pas pour le site ; ton choix 2 la valide » glisse dans le choix 2 une décision qui n'est pas dans le tableau. Correction : « Cette ligne est pour toi, pas pour le site : rien à décider. »

**10. Traces caduques (reste de mon point 7 de l'itération 2).**
- l. 1 : supprimer « version après l'itération 2 ». Le titre devient « Étalons du parcours Boulot (s19, 10/10/2026) », comme le modèle s18. Même chose l. 344.
- l. 355-409 (« Historique des corrections », itérations 1 et 2) : Thomas y lit des états qu'il n'a jamais vus (« Fary n'est plus la vidéo obligatoire », « étape 1 entièrement réécrite au tour 5 », « Roumanoff… »). L'itération 2 refusait de déplacer ces tables parce qu'elle ne devait modifier aucun autre fichier. Cette contrainte ne vaut pas pour la session à la remise. Correction : déplacer les deux tables dans `docs/marrant/parcours-boulot-s19/iterations/` et laisser une ligne : « Historique des relectures : `docs/marrant/parcours-boulot-s19/iterations/`. » Le document remis à Thomas s'arrête au handoff.
- l. 349 (« Décisions prises ») : après les corrections 1 et 2, retirer « étape 6 sans vidéo tant qu'aucune légende n'a passé l'aveugle » et « conditionnel à la relecture à l'aveugle de sa vanne ».

---

## Ce qui a été vérifié et est exact

- Conseils : les 5 textes du §1 sont identiques aux sources (tableau ci-dessus), et la retouche du PS reste présentée comme un choix.
- Étape 1 : `why` 52 mots et `moduleDetail` 99 mots (recomptés un à un). La scène suit le défi : trois traces notées, deux phrases au présent, « En ce moment, » qui reste juste, une durée et un rang, aucune personne. Les longueurs du quiz sont exactes (Q1 12, 11, 9, 10 ; Q2 12, 13, 11, 12 ; Q3 12, 11, 11, 13), et aucune bonne réponse n'est la plus longue ni la plus courte. Positions B, D, A. Aucun mot plein de la question n'est repris dans les réponses. Aucun mot de la liste interdite (tempo, blanc, silence, rythme, morceau, règle, article, loi, tout le monde).
- Faits vidéo : VDB `57Ip2k3us_8` 4 min 30 ; Vérino `rldvVgHQSvo` (base 7 min 30, fiche « 7 minutes », Confiance 3) ; Fary (fiche « 8 minutes ») ; Hamzawi `Fw14PLdtSyA` 4 min (Storytelling 3) ; fiches de Rollman, Croce « avion » et Guiz « fast-food » citées exactement. Aucune vidéo n'est reprise à l'intérieur du parcours.
- §5 : 16 vannes BOULOT, moins 6 écartées et le mug, soit 9 ; plus 3 rangées ailleurs, soit 12 ; plus 18 neuves, soit 30. Le lot plus petit (2, 2, 2, 0 ; 3, 3) est exact.
- Spec : XP 50 à 150 plus 100 de fin, `dayNumber` 3, 3 questions (4 à la dernière étape), aucune vidéo obligatoire au-dessus de 5 min sans `[À MINUTER]`.
- Charte : tutoiement, « vanne », « tes notes », aucun prénom de persona affiché, aucune cible humaine dans les textes du site, aucune mention d'IA ni de concurrent.

## Pour l'itération 4

Appliquer 1 et 2 (lancer la relecture à l'aveugle de la vanne du témoignage et de la retouche du PS avant la remise), puis 3 à 10. Reporter ensuite les comptes de vidéos (5 changées, 4 doublons) partout où ils apparaissent : tableau des choix, §6, handoff. Avec ces corrections, le document est à 10 : il ne reste rien à vérifier sur les faits, et chaque reco de « Je suis tes recos » désigne un texte connu et sans condition.
