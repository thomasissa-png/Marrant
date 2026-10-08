# Étalons du parcours Storytelling (s18, 08/10/2026)

> **Statut : à valider par Thomas avant toute réécriture** (règle P0 s8, décision D5). Rien n'est modifié dans `src/`, dans les seeds ni en base. Les 12 étapes des deux nouveaux parcours restent à écrire après ton retour.
> Décisions acquises et NON re-proposées : textes d'étape en version B avec scène « Imagine… » ; quiz au ton B complice avec explication ; repli solo sur les exercices ; blocage s16 inchangé ; « Pro » devient « Parcours Boulot » ; Storytelling 20 min/semaine (dans « 15 à 20 min/semaine »), 700 XP + 100 ; « Expert » jamais affiché ; doublons de vidéos et de vannes acceptés ; profil Storyteller du quiz vers Storytelling dès la publication ; « première étape gratuite », jamais « cours gratuit ».
> Règles tenues : tutoiement, « vanne » (« blague à tiroirs » seul terme consacré conservé), zéro tiret cadratin dans les textes, pas scolaire, aucune mention d'IA, aucun concurrent, aucun prénom de persona (les exemples « Imagine Samir » sont des exemples, jamais présentés comme un vrai membre), aucun chiffre du site touché, humoristes cités seulement là où le conseil ou la fiche vidéo en base les cite déjà. Ce qui dépend d'un fait non vérifié est marqué `[À VÉRIFIER]`.
> **La base fait foi** (le texte réel en production l'emporte sur le fichier seed). Texte des conseils relu dans `docs/content/conseils-storytelling-base-s18.json` (export prod du 08/10), vannes dans `docs/content/vannes-actives-s17.json` (127 actives), vidéos dans `videos-seed.json`.

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
| 6 | 7 | Fil rouge « ton anecdote » : défis des étapes 3 et 6 | A on garde le défi du conseil actif tel quel (l'anecdote reste une option) / B le défi ramène à ton anecdote (étape 6 : raconter l'histoire finale à deux personnes) | **A pour l'étape 3, B pour l'étape 6** |

L'étape 1 complète (§3) n'a pas d'A/B : les choix de forme sont acquis depuis s17, tu valides le texte ou tu corriges un mot.
« Je suis tes recos » suffit. Le détail et les textes complets sont dessous.

## Ce que la base a changé (faits relus le 08/10)

- **3 conseils sur 6 sont inactifs en prod (export du 08/10)** : « Raconter une anecdote en 3 actes » (étape 1), « Le twist final » (étape 4), « La blague à tiroirs » (étape 5). Actifs : « La technique du personnage » (2), « Rigoler de ses échecs » (3), « Le callback… » (6).
- **Vannes** : sur les 30 vannes prévues par la spec, **3 sont actives** (seed 136, 308 et 322 ; 136 et 308 sous un texte réécrit en s14, d'où leur absence du rapprochement par texte exact de `vannes-actives-s17.json`). Les 27 autres ont été retirées le 30/09 lors de la bascule du catalogue (seules les 125 vannes relues à l'aveugle restent actives). Les vannes se choisissent donc parmi les 127 actives, désignées par leur texte exact ; la vanne 136 (étape 5, détour) est à relire pour le choix 5.
- **Vidéos** : les 11 de la spec sont actives. **Votes « nouveaux parcours »** : 0 en base, aucune donnée, l'ordre Storytelling puis Boulot reste celui décidé.
- Deux écarts à connaître, sans choix à faire : voir « Signalements » en fin de fichier (étape 3 et titre du callback).

---

## 1. Les 3 conseils inactifs (choix 1a, 1b, 1c)

**Principe de la retouche A** : on réactive le conseil prévu par la spec (une seule idée par étape), on corrige ce que l'audit s14 a relevé (tirets cadratins, flèches, guillemets droits, faute de casse, fausse étymologie, défi trop lourd), on ajoute le repli solo, et on garde les humoristes déjà cités (règle P0 s15 : citation douteuse = vérifier, pas retirer). Titre, catégorie et difficulté ne bougent pas. Les retouches passent par la base ET par `conseils-seed.json` (sinon un rejeu du seed remet l'ancien texte).

### 1a. Étape 1 : « Raconter une anecdote en 3 actes » (inactif ; l'audit des conseils de s14 conseillait de le réécrire)

**Texte en base aujourd'hui** : plan contexte / montée / chute, exemple « rendez-vous Tinder… j'ai renversé mon café sur elle » (jugé très bon par l'audit s14). Défauts : tirets cadratins ×2, faute « eNREGISTRE-TOI », défi lourd (filmer 3 anecdotes), « Tinder » nommé, « dans chaque sketch » non vérifiable.

**A (reco) : réactiver avec cette retouche**

- `contenu` : « Toute bonne histoire drôle tient en trois actes. 1) Le contexte : qui, où, quand, en deux phrases maximum. 2) La montée : ce qui s'est passé, avec les seuls détails qui servent la chute. 3) La chute : le retournement, en une seule phrase, plus courte que le contexte. Le plus dur n'est pas de trouver la chute, c'est de couper ce qui traîne entre les deux : un détail qui n'amène rien ralentit la montée. Paul Mirabel suit cette structure dans ses sketchs. » `[À VÉRIFIER : la phrase sur Paul Mirabel (adoucie de « religieusement dans chaque sketch » à « dans ses sketchs ») ; je la garde et je ne la retire pas]`
- `exemple` : « Contexte : mardi soir, premier rendez-vous dans un bistrot près de chez moi. Montée : elle arrive, on discute, ça se passe bien, elle me dit qu'elle adore les gens spontanés. Chute : alors spontanément, j'ai renversé mon café sur elle. » (même vanne ; « Tinder » retiré parce qu'il n'apporte rien à la chute, alors qu'Uber Eats et Ikea portent la leur ; plus de guillemets imbriqués ; mots comptés : contexte 11, chute 8, donc l'exemple respecte la règle qu'il illustre)
- `exercice` : « DÉFI 3 ACTES : choisis une anecdote vraie et légère de ta semaine (si une histoire te pèse, prends-en une autre), avec au moins une autre personne dedans (rien en tête ? prends celle que tu racontes le plus souvent). Écris-la en trois blocs dans tes notes : le contexte en une ou deux phrases, la montée en trois ou quatre, la chute en une seule. C'est réussi quand ta chute est plus courte que ton contexte et que tu as coupé au moins un détail qui n'amène rien. La version dite à quelqu'un peut attendre ce soir : demande-lui à quel moment son attention a décroché. Personne sous la main ? Enregistre un vocal et réécoute-le : repère ce qui traîne, et coupe-le. Garde ton texte : il te resservira. »

Ce que ce défi règle : un critère de réussite écrit (chute plus courte que le contexte, un détail coupé), un support (tes notes), une anecdote qui contient quelqu'un d'autre (l'étape 2 donne une voix aux personnages), un repli si rien ne vient, ce qui tient dans la séance (écrire) et ce qui attend ce soir (la dire), un garde-fou qui ne repose pas que sur le mot « légère » (« si une histoire te pèse, prends-en une autre »). Le temps n'est pas chiffré : il n'est pas mesuré, je n'écris pas de durée.

**B : remplacer par « Construire une histoire drôle »** (actif, EXPERT). Texte en base : situation normale, détails crédibles, dérapage absurde ; défi « écris en 4 phrases une anecdote vraie de ta journée, puis remplace la dernière phrase par un détail absurde ». Pourquoi je ne le recommande pas : il enseigne le dérapage absurde, pas le découpage (c'est le sujet de l'étape 4), et son défi remplace la vraie chute par une chute inventée, alors que le parcours garde l'anecdote vraie d'un bout à l'autre.

**Reco : A.** C'est le seul conseil dont le sujet est exactement le titre de l'étape.

### 1b. Étape 4 : « Le twist final » (inactif ; l'audit s14 conseillait de le garder, candidat étalon)

**Texte en base aujourd'hui** : bon. L'audit demandait seulement « retoucher flèche et réf. plaquée ». Défauts réels : flèche « → » dans l'exemple, guillemets simples dans `contenu`, défi sans lien avec l'anecdote du parcours ni repli. Et une explication à corriger : dans l'exemple, ce n'est pas un élément nouveau qui crée le twist (le livreur arrive à la fin), c'est le mot « préparer », déjà dit, qui change de sens.

**A (reco) : réactiver, retouche légère**

- `contenu` : « Le twist, c'est la technique de base du stand-up : tu amènes l'audience dans une direction et tu pivotes au dernier moment. Tout le monde s'attend à A, et tu donnes B. La clé : le twist doit être logique rétrospectivement. Quand la personne comprend, elle doit se dire « ah oui, bien sûr » tout en riant. Le plus sûr : appuie ta chute sur un mot ou un détail déjà dit, qui change de sens à la fin. Panayotis Pascot excelle dans ces retournements narratifs. » (phrase sur Pascot inchangée ; une phrase ajoutée, celle de « le plus sûr ») `[À VÉRIFIER : la phrase sur Panayotis Pascot, gardée telle quelle ; je la garde et je ne la retire pas]`
- `exemple` : « J'ai passé 3 heures à préparer un dîner romantique. Bougies, musique, tout. Elle a adoré. Le livreur Uber Eats aussi. » Le twist tient sur un mot déjà là : « préparer ». On croyait qu'il avait cuisiné, il avait commandé. (vanne inchangée, flèche remplacée par une explication qui désigne le vrai mécanisme)
- `exercice` : « DÉFI TWIST : reprends ton anecdote du parcours Storytelling (ou, à défaut, une que tu connais bien) et résume-la en trois phrases. Les deux premières orientent vers une conclusion logique, la troisième part dans la direction opposée, en s'appuyant sur un mot ou un détail déjà dit. Écris deux fins différentes, puis teste-les sur un proche, à l'oral ou par message : laquelle surprend, puis paraît évidente ? Seul aujourd'hui ? Dis les deux à voix haute et garde celle qui te fait sourire. »

**B : remplacer par « La chute anti-climax »** (actif, EXPERT, s14 GARDER : « 6 mois de musculation… ouvrir un bocal de cornichons »). Pourquoi je ne le recommande pas : c'est une autre chute (on dégonfle une attente, on ne surprend pas), donc le titre de l'étape « La chute qu'on n'a pas vue venir » ne serait plus vrai, et les vannes prévues pour l'étape 4 (chute logique après coup) ne collent plus.

**Reco : A.** Si tu veux quand même l'anti-climax, il trouvera sa place comme conseil de l'étape 3 ou en bonus, pas ici.

### 1c. Étape 5 : « La blague à tiroirs » (inactif ; l'audit s14 conseillait de le réécrire)

**Texte en base aujourd'hui** : technique claire, chute « marié, avec un chariot et un hot-dog » bonne. Défauts : tirets cadratins ×2, **vouvoiement** (« vous savez »), **fausse étymologie** (Ikea ne veut pas dire « tu trouveras jamais la sortie » en suédois : on ne la garde pas), « architecture narrative avancée » qui sent l'Expert. Titre conservé tel quel : « blague à tiroirs » est le terme consacré.

**A (reco) : réactiver avec exemple corrigé**

- `contenu` : « La blague à tiroirs, c'est une vanne qui en contient d'autres. Tu ouvres un sujet, tu digresses sur un détail, tu fais une vanne dans la digression, puis tu reviens au sujet principal pour la chute finale. C'est de l'architecture : deux étages, et un escalier pour redescendre. Garde la digression courte (deux phrases), sinon on perd le fil de l'histoire. Paul Mirabel est le roi de cette technique : ses spectacles sont des poupées russes comiques. » `[À VÉRIFIER : la phrase sur Paul Mirabel, gardée telle quelle, tiret remplacé par deux-points]`
- `exemple` : « L'autre jour, je vais chez Ikea acheter une étagère. Parenthèse : c'est le seul endroit où des couples se disputent à voix basse devant un meuble à quarante euros, comme si c'était un divorce. Bref. L'étagère. J'en suis ressorti marié, avec un chariot et un hot-dog. » (chute d'origine gardée, digression remplacée : plus de fausse étymologie, et la chute « marié » répond maintenant à la digression sur les couples)
- `exercice` : « DÉFI TIROIRS : reprends ton anecdote du parcours Storytelling (ou, à défaut, une que tu connais bien). Ajoute une seule digression de deux phrases au milieu (une parenthèse, un commentaire sur un détail), puis reviens à l'histoire avec un « bref ». Chronomètre-toi : le tout doit tenir en moins d'une minute trente. Pas de public ? Fais-le en vocal et réécoute. »

**B : remplacer par « Raconter à l'envers »** (actif, DEBUTANT : commencer par la fin absurde, remonter le temps, finir par une morale petite et fausse ; exemple du hall en pyjama avec le sac-poubelle). Bon texte, bon exemple, mais c'est un autre sujet : l'ordre du récit, pas le détour. L'étape deviendrait « Commencer par la fin » et perdrait sa raison d'être entre la chute (4) et le détail qui revient (6).
Je ne propose pas « La digression qui revient à la fin » (actif, EXPERT) : c'est presque mot pour mot l'étape 6 (planter un détail, le faire revenir).

**Reco : A.**

---

## 2. Fiche du parcours (choix 2)

Champs du seed : `description`, `personaTagline`, `testimonial`. Les deux versions disent la même chose (6 semaines, une anecdote vraie que tu travailles au fil des étapes, jusqu'à ce qu'on te la redemande). « Au fil des étapes » et non « chaque semaine » : l'étape 3 laisse l'anecdote en option (choix 6). Avec la reco 6B pour l'étape 6, la fin du parcours ramène bien à ton anecdote, ce qui tient « jusqu'à ce qu'on te la redemande ». Rien n'annonce de score, de certificat ou de chiffre nouveau. Le témoignage est un exemple : il commence par « Imagine » et ne dit jamais « un membre a dit ».

| | **A (sobre)** | **B (complice)** |
|---|---|---|
| `description` | Tu as une histoire vraie qui marche à moitié quand tu la racontes. En 6 semaines, tu la remets dans l'ordre, tu donnes une voix à ses personnages, tu soignes la chute et tu fais revenir un détail à la fin. Une seule anecdote, que tu retravailles au fil des étapes, jusqu'à ce qu'on te la redemande. | Il y a toujours quelqu'un pour dire « et donc ? » au milieu de ton histoire. En 6 semaines, tu apprends à ne plus lui laisser la place : un plan en trois actes, des personnages qu'on entend, une chute qui surprend, un détour qui ne perd personne, un détail qui revient. Une seule anecdote vraie, que tu retravailles au fil des étapes, jusqu'à ce qu'on te la redemande. |
| `personaTagline` | Pour toi si tu as de bonnes histoires mais que tu t'arrêtes en route, au dîner, à l'afterwork ou entre potes, de peur d'être trop long | Pour toi si tu as de quoi tenir une table, mais que ta chute arrive quand tout le monde est passé au dessert |
| `testimonial` | Imagine Samir. Dans les dîners, son histoire de déménagement le faisait rire, lui, mais la chute arrivait après trois digressions et quelqu'un finissait par changer de sujet. Six semaines plus tard, c'est la même histoire, dite dans l'ordre, et c'est lui qu'on relance : « Raconte l'histoire du canapé. » | Imagine Samir. Il y a six semaines, son histoire de déménagement durait trois minutes et comptait trois digressions qui ne menaient nulle part. Hier soir, au dîner, il l'a racontée en une minute, canapé coincé compris, et quelqu'un a demandé : « Attends, refais le passage du cousin. » |

**Reco : B.** Elle montre le problème avant de le nommer (« humour présent dans la copy elle-même », charte §5), l'accroche « et donc ? » est reconnaissable en une seconde, et chacun des trois champs apporte une idée différente : on te coupe la parole (description), ta chute arrive trop tard (accroche), le résultat visible (témoignage, avec une réplique qui fait sourire). A reste le plan B si tu trouves le « et donc ? » trop familier pour une page de vente.
Vérifié contre le parcours : chaque élément cité par B existe dans une étape (plan en trois actes = 1, personnages qu'on entend = 2, chute qui surprend = 4, détour = 5, détail qui revient = 6). Le raté de l'étape 3 n'est pas dans la description : c'est une option, pas le fil. Le témoignage reprend l'histoire de l'étape 1 (trois minutes, canapé coincé) : les deux textes se répondent sans se répéter.
Le prénom « Samir » n'est pas un prénom de persona et ne figure dans aucune vidéo du parcours (pas de confusion avec un humoriste). Il revient dans l'étape 1 (§3), comme Léa dans Machine à Café.

---

## 3. Étape 1 complète : « Ton anecdote en trois actes »

C'est la vitrine que le visiteur lit avant de payer. Aucun A/B : forme acquise (version B avec scène, repli solo, quiz complice).

**Ce qui doit se lire face à Machine à Café 3** (« La règle des détails spécifiques », texte validé s17 : ajouter 3 détails précis à une anecdote banale, sans repli ni suite) :

| | Machine à Café 3 | Storytelling 1 |
|---|---|---|
| Le geste | Ajouter | **Découper et couper** |
| La matière | Une anecdote banale, au choix | **TON anecdote vraie**, reprise dans la suite du parcours |
| Ce qu'on travaille | Le grain (heure, lieu, vêtement) | **La charpente** (contexte, montée, chute) |
| Ce qui se mesure | La réaction de l'autre aux détails | **La chute plus courte que le contexte**, et ce qui traîne repéré à la réécoute |
| Repli solo | Aucun | **Vocal** à réécouter |

Aucune phrase de l'étape 1 ne reprend un exemple de Machine à Café 3 (boulangerie, bonnet de ski, heure, prénom d'ami). Pour qui a fait Machine à Café, c'est une révision rapide, mais le geste est inverse.

| Champ | Texte |
|---|---|
| `moduleTitle` | Ton anecdote en trois actes `[remplace le titre de travail « Le plan en trois actes » ; à valider]` |
| `why` (« Pourquoi cette étape ? ») | Une anecdote qui te fait déjà sourire se perd souvent en route : trop de contexte, une chute qui arrive en retard, un détail de trop. Le plan en trois actes remet de l'ordre avant de travailler le reste. Ici, on ne rajoute rien : on découpe, on garde, on coupe. |
| `moduleDetail` (version B, scène) | Imagine Samir qui raconte son déménagement : la météo du jour, le voisin du dessous, la queue à la station-service, et enfin, trois minutes plus tard, le canapé coincé. Entre-temps, quelqu'un a repris du fromage deux fois. L'histoire était bonne, juste mal découpée. Dans cette étape, tu prends une histoire vraie à toi, tu la poses en trois actes et tu coupes ce qui traîne. Tu la retrouveras dans les étapes suivantes. |
| `moduleFormat` | Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. |
| `moduleXp` / `free` / `dayNumber` | 50 / oui / 3 (spec, inchangé) |

**Exercice « aujourd'hui »** : c'est le `exercice` du conseil réactivé, texte complet au §1a (anecdote avec une autre personne dedans, trois blocs écrits dans tes notes, critère de réussite écrit, version dite à quelqu'un ce soir, repli vocal, « si une histoire te pèse, prends-en une autre »). Le garde-fou renforcé sur les histoires douloureuses reste celui de l'étape 3.

**Quiz, questions modèles** (ton B complice). La question 1 porte sur le découpage en actes (ce qui reste dans le deuxième acte et ce qu'on coupe) ; la question 2 porte sur le premier acte, le contexte. Aucune bonne réponse n'est citée dans le texte de l'étape. Positions de la bonne réponse pour les 4 questions de l'étape : **D, B, A, C** (jamais deux de suite au même rang). Les questions 3 et 4 s'écrivent après ta validation de celles-ci. Un seul prénom dans l'étape (question 1, comme Samir dans le texte) ; les questions 2 à 4 n'en ont pas.

**Question 1 (bonne réponse en D)**
> **Imagine Samir qui écrit le deuxième acte de son histoire de canapé coincé. Il a quatre phrases en réserve. Laquelle doit-il couper ?**
> A. « L'escalier faisait un coude à chaque étage. »
> B. « Le canapé faisait deux mètres dix. »
> C. « Mon cousin a lâché son côté en riant. »
> **D. « Deux jours avant, j'avais changé d'abonnement internet. »**
>
> **Explication (affichée quelle que soit la réponse, 3 phrases)** : La D. L'abonnement internet n'amène rien à la chute : il ralentit juste le deuxième acte. Le coude, les deux mètres dix et le cousin qui lâche son côté préparent tous le canapé coincé, donc ils restent.

(La bonne réponse n'apparaît pas dans la scène de l'étape, qui cite d'autres détails qui traînent : la météo, le voisin, la station-service.)

**Question 2 (bonne réponse en B)**
> **Tu racontes l'histoire d'un canapé coincé dans l'escalier. Quelle ouverture pose le mieux le contexte ?**
> A. « Il m'est arrivé un truc de fou en déménageant, vous allez pas en revenir. » (promet, ne pose rien)
> **B. « Dimanche matin, quatrième étage sans ascenseur : mon cousin devait m'aider à descendre mon canapé. »**
> C. « Alors, d'abord, le camion, qui était trop cher, ensuite mon cousin, qui devait venir mais qui avait un truc, et puis l'escalier, qui est étroit. » (le contexte qui s'éternise)
> D. « Dimanche matin, mon cousin m'a aidé à déménager et on a fini par laisser le canapé coincé dans l'escalier. » (la chute dite d'avance)
>
> **Explication (3 phrases)** : La B. Un quand, un où, un qui, en une phrase, et le canapé coincé reste en réserve pour la chute. La A promet sans rien poser, la C s'éternise, la D raconte la fin avant le début.

Question 1 : les trois mauvaises réponses sont des détails qui préparent la chute, et l'explication dit pourquoi ils restent. Question 2 : chaque mauvaise réponse enfreint une seule règle, ce que l'explication nomme. Aucune ne reprend l'exemple du conseil (rendez-vous et café) ni les détails de Machine à Café 3. Les mots entre parenthèses sont des notes pour toi, pas du texte affiché.

**Les 2 vidéos** (plafond 8 min, 1 obligatoire + 1 facultative, aucune minute inventée). Les légendes ne disent que ce que la fiche du catalogue établit, et elles invitent à observer plutôt qu'à constater : elles restent vraies quoi qu'on voie.

| | Légende (`why`) |
|---|---|
| **Obligatoire** : Panayotis Pascot, « Amsterdam et le Kem's » (6 min 30) | Amsterdam, une partie de Kem's entre potes, racontée comme s'il y était encore, sans effet de manche. Repère le moment où le décor est posé et celui où l'histoire démarre : combien de phrases entre les deux ? |
| *Facultative* : Thomas Ngijol, « Le voisin » (5 min 40) | Un voisin banal, puis agaçant, puis dément. Repère chaque marche : c'est la montée, le deuxième acte, vue de l'intérieur. |

(Sources : fiches `videos-seed.json`, « récit revécu », « ton sincère, sans effet de manche », « marche après marche », « le banal, puis l'agaçant, puis l'absurde, puis le dément ». Regarder les deux vidéos reste utile pour choisir où lancer la lecture, mais plus aucune légende n'en dépend.)

**Les 5 vannes** (désignées par leur texte exact en base, toutes actives, aucune déjà utilisée dans les 13 étapes réécrites en s17). Critère : la chute est plus courte que le contexte (mots comptés, vérifiés un à un).

| # | Vanne (`content` puis chute) | Décryptage de l'étape (une ligne) |
|---|---|---|
| 1 | « Mon copain a vu sur la carte que j'allais à la salle de sport tous les mardis. Il était fier. » / « Il a zoomé. Sur le parking. » | Le contexte fait dix-sept mots, la montée trois (« Il était fier. »), la chute six : « sur le parking » dit tout sans rien expliquer. |
| 2 | « On m'a volé le cadenas de mon vélo. Pas le vélo. » / « Je prends ça pour une critique. » | Le contexte fait huit mots, la montée trois (« Pas le vélo. »), la chute six : la vexation arrive sans explication. |
| 3 | « Chez le médecin, je ne connaissais pas mon numéro de sécu. J'ai appelé ma mère. » / « Elle me l'a dicté de mémoire, avec les espaces. » | Le contexte fait onze mots, l'appel à la mère quatre, la chute neuf : un détail précis, « avec les espaces », pas un commentaire. |
| 4 | « Mon père a acheté une tondeuse robot pour ne plus avoir à tondre la pelouse. » / « Il la surveille depuis trois heures. Il la trouve lente. » | Le contexte fait quinze mots, la montée six (« Il la surveille depuis trois heures. »), la chute quatre : « Il la trouve lente. » est la phrase la plus courte des trois. |
| 5 | « Ma copine a acheté deux couettes pour qu'on arrête de se disputer. » / « Elle a pris les deux. » | Le contexte fait douze mots et promet une solution, la chute en fait cinq et la retourne. Rallonge-la d'un mot et elle perd. |

Pour le catalogue : les décryptages complets (`comedyTechnique`, `techniqueExplanation`) existent déjà en base pour ces 5 vannes ; la ligne ci-dessus est celle qui relie la vanne à l'étape.

---

## 4. Titre de la page et slug (choix 3)

Le titre de Storytelling n'est pas dans `seo.md` §6 (les 4 titres signés sont /parcours, Répartie, Machine à Café, Confiance) : c'est une proposition à faire signer. Même gabarit que les trois autres : « Parcours X : bénéfice en N semaines », 60 caractères maximum. Volumes de requêtes : **non mesurés** (aucun outil), je n'avance aucun chiffre.

| | Titre | Caractères |
|---|---|---|
| **A** (reco) | Parcours Storytelling : raconter tes histoires en 6 semaines | 60 |
| **B** | Parcours Storytelling : une anecdote qu'on te redemande | 55 |

**Reco : A.** Elle porte la durée comme « Parcours Confiance : retrouver ta légèreté en 6 semaines », et « raconter » est le verbe de la requête. B est plus joli mais ne dit ni la durée ni ce qu'on fait. Règle de partage SEO inchangée : l'article répond à la question, le parcours vend le programme et la première étape gratuite (jamais « cours gratuit »).
**Slug : `storytelling`** (spec §2.1, même logique que `repartie`, `confiance`). Pas de choix : un slug descriptif plus long n'apporterait rien mesurable, et un slug stable évite toute redirection ultérieure.

## 5. Phrase d'accroche du profil Storyteller du quiz (choix 4)

Emplacement : `QUIZ_HUMOUR_PARCOURS.raison.STORYTELLER` (`apps/web/src/config/textes/entrees-parcours.ts`, lu en lecture seule). Texte actuel : « Tu sais tenir une table avec une histoire : ce parcours t'apprend à la raconter au bon moment et jusqu'au bout. » Il promet trop pour Machine à Café (l'anecdote n'y arrive qu'à l'étape 3) et ne dit rien de ce que le visiteur lit à Storytelling 1. Les specs de s17 (§12) jugeaient cette phrase « vraie » une fois Storytelling publié ; relue face à l'étape 1 écrite ici, « au bon moment » et « jusqu'au bout » n'y sont pas enseignés (le timing est une étape de Machine à Café, la voix et la chute viennent plus tard), d'où la nouvelle phrase.

La phrase doit être **vraie pour l'étape 1 affichée** (§3 : découper en trois actes, couper ce qui traîne), et rien de plus : la voix, la chute et le détour sont des étapes payantes, donc hors de la phrase.

| | Phrase |
|---|---|
| **A** (même gabarit que les 4 autres profils) | Tu sais tenir une table avec tes histoires : ce parcours commence par en découper une en trois actes, et par couper ce qui traîne. |
| **B** (plus explicite) | Tu racontes bien, mais tu t'étires parfois : l'étape 1 t'apprend à découper ton anecdote en trois actes et à couper ce qui traîne. |

**Reco : A.** Elle garde la forme « Tu [qualité] : ce parcours [ce qu'il fait] » des quatre autres phrases, elle reprend la première moitié déjà en ligne (la partie vraie, passée au pluriel pour que « en découper une » ne se rattache pas à « une table »), et elle n'accuse personne de s'étirer. B est plus précise mais suppose que le profil Storyteller « s'étire », ce que le quiz ne mesure pas.
**Garde-fou pour @fullstack** : tant que Storytelling n'est pas publié, le bouton du profil mène à Machine à Café avec la phrase « vraie » de transition (spec §12, point 3) ; cette phrase de transition est hors de ce choix. La phrase A ne doit s'afficher qu'avec `/parcours/storytelling` en ligne.

---

## 6. Méthode de choix des vannes pour les étapes 2 à 6 (choix 5)

Contrainte : une seule des 30 vannes prévues est active (322, GPS). On ne compte donc plus sur les ids du seed. **Méthode proposée** : pour chaque étape, parcourir les 127 actives avec la fiche technique de l'étape (« personnage défini par un tic », « bilan positif d'un raté », « chute logique après coup », « motif qui revient »), retenir 5 vannes de techniques différentes, écarter celles déjà dans les 13 étapes réécrites en s17, et désigner chaque vanne par son `content` exact.

Lecture rapide des actives (par titre et technique, pas encore par étape finale) :

| Étape | Actives suffisantes ? | Exemples de pistes (non définitives) |
|---|---|---|
| 2, voix et tic des personnages | **Oui**, nombreuses | le père qui répond « je vais chercher du pain », le père en MAJUSCULES, la grand-mère qui cuisine pour douze |
| 3, bilan d'un raté | **Oui** | les mods en 4K, l'arrêt de bus d'en face, « Anniv de Léa » |
| 4, chute logique après coup | **Oui**, nombreuses | « Il a zoomé. Sur le parking. » (déjà en étape 1, à remplacer ici), les deux couettes (déjà en étape 1, à remplacer ici), la liste de l'ex, la tondeuse robot (déjà en étape 1 aussi) |
| 5, détour au milieu | **Non** | les actives sont presque toutes des one-liners en deux temps ; aucune ne montre une digression au milieu qui revient au fil |
| 6, motif qui revient | **Juste**, 4 à 5 pistes | « notre truc », « ça lui était égal aussi », le message « Bonjour à tous » sans réponse |

**A (reco)** : actives pour les étapes 2, 3, 4 et 6 ; pour l'étape 5, 5 vannes **neuves** (courtes histoires avec un détour), écrites par @copywriter puis relues à l'aveugle par deux relecteurs avant l'import. La spec prévoyait déjà cette option pour l'étape 5 (« adéquation moyenne »).
**B** : actives partout, y compris à l'étape 5, avec des vannes qui montrent le détour par un autre angle (le décryptage dit « ici le détour est dans la chute »). Plus rapide, mais l'étape 5 illustre mal sa propre technique.
Une étape payante qui ne montre pas ce qu'elle enseigne est un défaut que l'audit des parcours de s17 reprochait déjà aux parcours existants. **Reco : A.**

---

## 7. Le fil rouge « une seule anecdote » (choix 6)

La fiche promet une anecdote vraie que tu travailles au fil du parcours, « jusqu'à ce qu'on te la redemande ». Le défi de l'étape 1 te fait choisir ton anecdote, ceux des étapes 4 et 5 la reprennent (les trois sont retouchés ici). Celui de l'étape 2 demande « une anecdote récente » : le texte de l'étape 2 dira « prends celle de l'étape 1 », le défi du conseil ne change pas. Les deux conseils déjà actifs des étapes 3 et 6 ont leur propre défi : à l'étape 3, « pense à un petit échec récent » ; à l'étape 6, « lors de ta prochaine conversation de groupe, retiens le premier détail précis qui fait sourire ». Ni l'un ni l'autre ne parle de ton anecdote.

**Retouche commune aux deux options, pas un choix (repli solo, acquis depuis s17)** : le défi de l'étape 3 (« Rigoler de ses échecs ») se termine par « Raconte-la à quelqu'un ce soir avec l'air satisfait d'un bilan annuel » et n'a pas de repli. On ajoute à la fin : « Personne ce soir ? Dis-la à voix haute ou enregistre-la en vocal. » En base ET dans `conseils-seed.json`. Le garde-fou « échec récent et sans gravité, dont tu peux déjà sourire aujourd'hui » est déjà dans le conseil.

**Étape 3**

| | Ce qui change | Coût |
|---|---|---|
| **A (reco)** | Le défi garde son sujet (un petit échec récent) ; l'anecdote reste une option, car la technique du bilan se joue sur n'importe quel raté. Seul le repli solo est ajouté. | Aucune autre retouche. |
| **B** | On ajoute au défi : « Ton anecdote du parcours Storytelling contient un petit raté ? Fais-en le bilan. Sinon, prends un échec récent et sans gravité. » | Un conseil actif de plus parle d'un parcours à tous ceux qui le lisent. |

**Étape 6**

| | Ce qui change | Coût |
|---|---|---|
| **A** | Le défi du « Callback » reste celui de la conversation de groupe. La personne finit le parcours sans avoir raconté son histoire finale. | Le critère de réussite du parcours prévu par la spec (l'histoire finale racontée à au moins deux personnes) ne se mesure plus, et « jusqu'à ce qu'on te la redemande » (fiche) n'a plus d'étape qui le tienne. |
| **B (reco)** | On ajoute au défi : « Tu travailles ton anecdote du parcours Storytelling ? Plante dans ses deux premières phrases un détail qui fait sourire, et fais-le revenir dans la chute : la deuxième fois, il fait rire. Raconte-la ensuite à deux personnes cette semaine, à une soirée si l'occasion se présente ou une par une. Pas de public ? Envoie-la en vocal ou par écrit à deux amis. » Une soirée est proposée, jamais exigée. | Un conseil actif retouché en base ET dans `conseils-seed.json`. `[À VÉRIFIER @fullstack : « Le callback » est-il aussi utilisé par un autre parcours ? Si oui, ajout conditionnel plutôt que remplacement.]` |

**Reco : A pour l'étape 3, B pour l'étape 6.** L'étape 3 enseigne une technique qui marche sur n'importe quel raté : l'anecdote y est une option sans conséquence. L'étape 6 est le point d'arrivée que la fiche annonce, et le seul endroit où le critère de réussite du parcours (l'histoire finale racontée à deux personnes) peut se vivre : son défi doit donc ramener à ton anecdote. Si tu préfères garder A pour l'étape 6, on retire « jusqu'à ce qu'on te la redemande » des deux descriptions et on termine par « jusqu'à ce que tu saches la raconter sans qu'on te coupe la parole ».

---

## Signalements (information, rien à trancher)

1. **Étape 3 : le conseil en base ne dit pas ce que la spec prévoit.** La spec écrit « Raconter un raté comme une épopée » (3 versions : factuelle, dramatisée, épique). Le conseil actif « Rigoler de ses échecs » enseigne autre chose : le **bilan positif pour de mauvaises raisons** (« C'est raté, mais l'opération n'est pas un échec : je connais enfin tous mes voisins »), avec le défi BILAN. Règle « la base fait foi » : l'étape suit le conseil qui est en ligne. Décidé par cette règle, rien à trancher aujourd'hui : tu verras le texte de l'étape 3 (titre de type « Faire le bilan de ton raté », défi du conseil, garde-fou « échec récent et sans gravité » déjà dans le conseil, avec un repli solo ajouté comme en s17, voir §7) quand on l'écrira. Si tu veux vraiment l'épopée, il faudrait écrire un autre conseil ; je ne le recommande pas.
2. **Titre du callback en base** : « Le callback : faire revenir une **blague** au bon moment », alors que le seed et la spec disent « une **vanne** ». À aligner avec `previousTitle` pour les favoris (comme en s11). Pas de choix, c'est de la cohérence de vocabulaire.
3. **Étape 6 / callback** : le conseil actif parle d'un détail qui a déjà fait rire (version débutant : y revenir deux minutes plus tard). Planter dans l'anecdote un détail qui revient à la fin est une variante naturelle, à présenter dans le texte de l'étape 6 ; voir le choix 6 pour la retouche éventuelle du défi.
4. **Étape 2** : la spec cite la vidéo des « accents africains » avec la règle « imiter avec tendresse, jamais se moquer d'un accent ». Légendes à écrire en regardant les vidéos.
5. **Niveaux « Expert »** (conseils 5 et 6, et « Construire une histoire drôle ») : jamais affichés (décision acquise).
6. **Durée de l'étape 1** (18 min 30 estimée en spec) : non mesurée, non écrite dans les textes.

---

## Handoff

**Handoff → @orchestrator** (puis @fullstack pour l'import, @design pour l'icône, @seo pour la signature du titre)

- **Fichier produit** : `/home/user/Marrant/docs/copy/etalons-parcours-storytelling-s18.md`. Aucun autre fichier modifié, aucun commit, rien en base. `project-context.md` (historique) à compléter par la session : consigne de session = ne produire que ce fichier.
- **Prêt (en attente de ta validation)** : 3 retouches de conseils avec textes complets (§1) ; fiche A/B (§2) ; étape 1 complète au format s17 (§3 : `why`, `moduleDetail`, exercice, 2 questions de quiz modèles, 2 légendes, 5 vannes avec décryptage) ; titre A/B (§4) ; phrase d'accroche A/B (§5) ; méthode de vannes pour les étapes 2 à 6 (§6) ; fil rouge par étape (§7, avec le repli solo de l'étape 3 hors choix).
- **Frameworks et niveau de conscience (pour les agents, pas pour Thomas)** : retouches de conseils = avant/après sur texte réel, Solution-Aware ; fiche = PAS court, Solution-Aware ; étape 1 = PAS court avec scène, Product-Aware (vitrine lue avant l'achat) ; quiz = mise en situation puis explication, Product-Aware.
- **Attend Thomas** : choix 1a, 1b, 1c, 2, 3, 4, 5, 6. « Je suis tes recos » = A, A, A, B, A (titre), A (accroche), A (vannes), et pour le fil rouge A à l'étape 3 et B à l'étape 6. Puis, hors étalons : vérification des trois phrases d'humoristes gardées telles quelles (Paul Mirabel dans 1a et 1c, Panayotis Pascot dans 1b, toutes marquées `[À VÉRIFIER]`, jamais retirées). Les légendes vidéo n'ont plus de `[À VÉRIFIER]`.
- **Après validation, @fullstack devra** : (1) **réactiver** les 3 conseils (ids de l'audit s14 : « Raconter une anecdote en 3 actes » `cmmp8ozsx000mqk63ux155ma1`, « Le twist final » `cmmp8ozsx000tqk63yhagsgqi`, « La blague à tiroirs » `cmmp8ozsx0012qk63kxfsux75` `[À VÉRIFIER sur la base de prod avant tout UPDATE]`) en y posant `isActive = true` et les textes retouchés, **en base ET dans `conseils-seed.json`** (sinon un rejeu du seed les remet à l'ancien texte, cf. FS-12/COP-09) ; (2) **aligner le titre du callback** (« vanne ») avec `previousTitle`, **ajouter le repli solo au défi de « Rigoler de ses échecs »** (§7, hors choix) et, si 6B est retenu pour l'étape 6, **ajouter la phrase au défi du « Callback »** (en base ET dans `conseils-seed.json`) ; (3) importer le parcours (`slug: storytelling`, `order: 4`, vannes désignées par leur texte exact via `jokeContents`, vérifier `isActive` de chacune à l'import, RC3/PM-04 ; `[À VÉRIFIER @fullstack : l'import accepte-t-il une désignation par texte ? Les 5 vannes de l'étape 1 ont seedId null et l'annexe A de la spec utilise jokeIds]`) ; (4) **brancher la bascule du quiz** : profil Storyteller vers `/parcours/storytelling?src=quiz` seulement quand le parcours est publié, avec la phrase de §5 ; (5) laisser `icon` à @design et ne pas afficher « Expert ». Ordre d'importation : conseils d'abord, puis parcours (le rattachement étape/conseil se fait par titre, `[À VÉRIFIER @fullstack : mécanisme réel de la tâche parcours-content]`).
- **Décisions prises** : registre « pote drôle et bienveillant », version B avec scène (acquis), Samir comme personnage d'exemple (fiche + étape 1), positions de bonne réponse D, B, A, C (questions 1 et 2 livrées), vannes de l'étape 1 comptées mot à mot (chute plus courte que le contexte), différence avec Machine à Café 3 posée dans un tableau lisible (découper et couper contre ajouter), slug `storytelling`.
- **Points d'attention** : objections traitées (« je ne suis pas drôle » : anecdote vraie et légère, repli vocal ; « je m'étire » : étape dédiée à la coupe ; « je n'ai personne à qui raconter » : vocal ; « ça ressemble à Machine à Café » : tableau §3). Références consultées : étalons s17, charte s11, export base du 08/10, 127 vannes actives, fiches vidéo `videos-seed.json`, audit s14 (lignes 162, 294, 296, 473, 518). Mots-clés SEO : `keyword-map` absent ; « raconter » dans le titre `[À SIGNER, volumes non mesurés]`.
- **Contrôles faits sur ce fichier** : zéro tiret cadratin dans les textes ; « blague » uniquement dans « blague à tiroirs » (terme consacré) et dans les citations du texte ou du titre en base ; aucun prénom de persona (Samir, Léa, Tom, Julien sont des exemples) ; aucun concurrent ; aucun chiffre du site modifié (« 20 min/semaine » et « 700 XP + 100 » = décisions de la spec, non réécrits dans les textes publics).
