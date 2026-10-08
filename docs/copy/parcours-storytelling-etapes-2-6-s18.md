# Parcours Storytelling, étapes 2 à 6 (s18, 08/10/2026)

> **Statut : brouillon complet, à relire à l'aveugle avant import** (règle d'or P0 du 08/10 : les 5 vannes neuves de l'étape 5 ne sont importées qu'après la relecture à l'aveugle, 2 relecteurs + départage). Rien n'est modifié dans `src/`, dans les seeds ni en base.
> Gabarit : `docs/copy/etalons-parcours-storytelling-s18.md` (validé par Thomas le 08/10 : choix 1 valider, 2 B, 3 A, 4 A, 5 A, 6 A à l'étape 3 et B à l'étape 6). Même forme que l'étape 1 (§3 des étalons) : `moduleTitle`, `why`, `moduleDetail` en version B avec scène « Imagine… », exercice du jour, quiz, 2 légendes, 5 vannes avec décryptage.
> Règles tenues : tutoiement, « vanne » (« blague à tiroirs » seul terme consacré, dans le titre du conseil), zéro tiret cadratin, aucune mention d'IA, aucun concurrent, aucune marque, aucun prénom de persona (Samir, Hugo, Nadia, Maëlle sont des exemples, jamais présentés comme de vrais membres), chiffres du site inchangés (« 20 min/semaine » dans « 15 à 20 min/semaine », 700 XP + 100).
> **La base fait foi** : les conseils sont ceux de `conseils-storytelling-base-s18.json` (étapes 2 et 3, inchangés), des étalons §1 (étapes 4 et 5) et de `conseils-finaux-109.json` (étape 6, version de l'audit).

## Tableau d'ensemble

| Étape | `moduleTitle` | Conseil affiché | Semaine / `dayNumber` / XP / gratuit |
|---|---|---|---|
| 2 | Des personnages qu'on entend | La technique du personnage | 2 / 10 / 75 / non |
| 3 | Faire le bilan de ton raté | Rigoler de ses échecs | 3 / 17 / 100 / non |
| 4 | Une chute qui se lit de deux façons | Le twist final | 4 / 24 / 125 / non |
| 5 | Un détour qui ne perd personne | La blague à tiroirs | 5 / 31 / 150 / non |
| 6 | Un détail qui revient à la fin | Le callback : faire revenir une vanne au bon moment | 6 / 38 / 200 (+100 de fin inchangé) / non |

Les titres reprennent les mots de la fiche validée (« des personnages qu'on entend », « une chute qui surprend », « un détour qui ne perd personne », « un détail qui revient »). `moduleFormat` : « Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. » aux étapes 2 à 5 ; « Un conseil, un défi, 5 vannes, une vidéo, un petit quiz. » à l'étape 6 (une seule vidéo, spec §2.2).

---

## Étape 2 : Des personnages qu'on entend

Conseil affiché : « La technique du personnage » (STORYTELLING, DEBUTANT), texte de la base, inchangé.
`[Framework : PAS court avec scène]` `[Conscience : Product-Aware]`

| Champ | Texte |
|---|---|
| `moduleTitle` | Des personnages qu'on entend |
| `why` | Une anecdote où tout le monde parle pareil ressemble à un résumé : on sait ce qui s'est passé, mais on n'y était pas. Un seul tic par personnage (un soupir, une phrase qui revient) suffit pour qu'on l'entende arriver. Ici, tu en donnes un à l'autre personnage de ton histoire, sans imiter personne. |
| `moduleDetail` (version B, scène) | Imagine Samir qui reprend son histoire de canapé coincé. Son cousin, à l'autre bout du meuble, dit « Attends, attends » à chaque marche, d'une voix posée, comme si l'escalier allait lui répondre. Samir n'imite personne : une phrase, un rythme, et la salle entend le cousin avant qu'il arrive. Dans cette étape, tu donnes un tic à l'autre personnage de ton histoire, tu changes un peu ton rythme et ta hauteur de voix, et tu regardes lequel des deux fait le plus rire. Ton anecdote de l'étape 1 fait l'affaire si quelqu'un d'autre y figure ; sinon, prends une anecdote récente. Si tu joues un accent ou une façon de parler, tu le fais avec la tendresse de quelqu'un qui aime cette voix, jamais pour t'en moquer. |

**Exercice « aujourd'hui »** : le défi du conseil, sans retouche (le pont vers l'anecdote de l'étape 1 est dans le texte d'étape ci-dessus, comme le prévoit le §7 des étalons).
> DÉFI PERSONNAGE : aujourd'hui, raconte une anecdote récente à un ami en donnant une voix à deux personnages : toi et quelqu'un d'autre (ton boss, un proche, un conseiller). Donne un seul tic à l'autre personnage et change seulement le rythme et la hauteur de la voix, puis demande lequel des deux l'a le plus fait rire. Personne sous la main ? Enregistre un vocal et écoute-le.

Le repli solo existe déjà (vocal). La vigilance de la spec (imiter avec tendresse, jamais se moquer d'un accent) est dans le texte d'étape et dans la question 4.

**Quiz** (ton B complice). Positions de la bonne réponse : **A, C, B, D**. Un seul prénom (Samir, question 1, comme dans le texte). Aucune bonne réponse n'est citée dans la scène ni dans l'exemple du conseil (le service client et « Je comprends votre frustration »).

**Question 1 (bonne réponse en A)**
> **Imagine Samir qui veut faire entendre le déménageur, un homme toujours pressé. Comment s'y prend-il ?**
> **A. Il choisit une seule phrase pressée, la répète, et la dit plus vite et plus sec que le reste.**
> B. Il lui prête un accent très marqué, pour qu'on le reconnaisse tout de suite.
> C. Il lui donne trois manies : un soupir, un sifflement et un « bon, allez ».
> D. Il prévient « là, c'est le déménageur qui parle » avant chacune de ses répliques.
>
> **Explication (3 phrases)** : La A. Un seul tic, tenu jusqu'au bout, fait entendre le personnage, et un simple changement de rythme suffit. La B force l'imitation, la C empile des manies qu'on ne retient pas, et la D explique au lieu de jouer.

**Question 2 (bonne réponse en C)**
> **Ton boss t'a répondu en deux mots, et tu veux qu'on l'entende dans ton histoire. Quel réglage de voix choisis-tu ?**
> A. Une voix très grave, avec un accent étranger, pour marquer la différence.
> B. Ta voix normale, avec « dit-il d'un ton froid » après chaque réplique.
> **C. Un cran plus lent et un cran plus bas, gardés à chaque réplique.**
> D. Une voix différente à chaque réplique, pour surprendre.
>
> **Explication (3 phrases)** : La C. Un léger changement de rythme et de hauteur suffit, à condition de le tenir d'une réplique à l'autre. La B décrit la voix au lieu de la jouer, la A force l'imitation, et la D change tout le temps, donc personne n'est reconnaissable.

**Question 3 (bonne réponse en B)**
> **Dans ton histoire, ta voisine ajoute « Ce n'est pas un reproche » à chaque phrase. Où tombe la meilleure chute ?**
> A. Elle dit enfin autre chose, pour surprendre le public.
> **B. Elle le dit une dernière fois, en demandant le plus gros service de l'histoire.**
> C. Tu expliques que c'est sa manie depuis toujours.
> D. Tu finis sur ta propre colère, que tout le monde comprend.
>
> **Explication (3 phrases)** : La B. Le tic tenu jusqu'au bout devient la chute quand il rencontre sa conséquence : le public l'attend, puis il le reçoit. La A casse ce que tu as construit, la C explique la manie, et la D parle de toi au lieu de la voisine.

**Question 4 (bonne réponse en D)**
> **Tu racontes un séjour chez ton beau-père, qui a un accent très marqué. Comment fais-tu entendre sa voix ?**
> A. Tu forces son accent au maximum, pour que ce soit bien clair.
> B. Tu l'évites en entier : mieux vaut ne rien jouer que prendre un risque.
> C. Tu prends l'accent d'un autre, plus facile à jouer.
> **D. Tu gardes son rythme et sa phrase favorite, comme tu pourrais la jouer devant lui, en souriant.**
>
> **Explication (3 phrases)** : La D. Le rythme et la phrase qu'il répète font entendre quelqu'un sans caricature, et le test est simple : pourrais-tu la jouer devant lui ? La A grossit jusqu'à la moquerie, la C déplace le problème, et la B te prive d'un bon personnage.

**Les 2 vidéos** (spec §2.2, plafond 8 min, 1 obligatoire + 1 facultative, aucune minute inventée). Les légendes invitent à observer ; elles ne disent que ce que la fiche du catalogue établit (imitation tendre, phrase culte, dialogue reconstruit).

| | Légende (`why`) |
|---|---|
| **Obligatoire** : Samia Orosemane, « Les accents africains » (5 min 10) | Samia Orosemane joue les voix de sa famille, et ce qu'on entend d'abord, c'est de l'affection. Repère une phrase qu'elle rejoue plusieurs fois, et demande-toi : de la tendresse ou de la moquerie dans sa voix ? C'est la règle que tu gardes pour tes propres personnages. |
| *Facultative* : Laura Domenge, « La vie de couple » (5 min 10) | Des disputes de couple minuscules, rejouées avec les voix. Repère un moment où elle rejoue une réplique au lieu de la résumer, et écoute ce qui change : le rythme, la hauteur, la posture. |

**Les 5 vannes** (désignées par leur texte exact en base, toutes actives, aucune déjà utilisée dans les 13 étapes réécrites en s17 ni dans l'étape 1). Technique : un personnage qui existe par sa seule phrase ou son seul tic.

| # | Vanne (`content` puis chute) | Décryptage de l'étape (une ligne) |
|---|---|---|
| 1 | « Je joue depuis dix ans avec un pote que je n'ai jamais vu. Il m'a enfin envoyé une photo. » / « Il a la tête de quelqu'un qui dit « on se regroupe ». » | Aucune description : la phrase « on se regroupe » suffit pour voir et entendre ce pote jamais rencontré. |
| 2 | « Mon copain n'a jamais retenu le prénom de ma meilleure amie. Il l'appelle « la fille de la soirée ». » / « Elle vit chez nous depuis un an. » | Un surnom répété fait le portrait du copain, et la chute pousse son tic jusqu'à sa conséquence. |
| 3 | « Ma mère me demande encore des nouvelles de mon ex. » / « Je n'en ai pas. Elle, si. » | La mère n'est jamais décrite : sa question est son tic, et la chute révèle que, elle, elle a des nouvelles. |
| 4 | « Ma collègue m'a briefé pendant 45 minutes avant ses congés pour me passer ses dossiers. » / « Elle revient lundi. » | Le tic de la collègue, c'est de tout dire : 45 minutes de briefing, puis une chute de trois mots qui en révèle l'inutilité. |
| 5 | « Mon petit frère m'a demandé de lui expliquer la vie. J'ai répondu « ça dépend ». » / « Il a dit « merci, c'est mieux que papa ». » | Une phrase par personnage suffit : le « ça dépend » du grand frère prudent, puis le frère, et même papa qu'on entend sans qu'il parle. |

---
