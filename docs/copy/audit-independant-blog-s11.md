# Audit indépendant blog — session 11 (29/09/2026)

> Auditeur : @reviewer (indépendant, sans lecture préalable des rapports de la refonte).
> Périmètre : 29 articles statiques de `apps/web/src/lib/blog-articles.ts` (hors `meilleures-blagues-droles-2026`) + 9 réécritures de `apps/web/src/data/blog-article-rewrites.json`. Total : **38 articles**.
> Barre de mesure : `docs/copy/charte-refonte-copy-s11.md` §3 (vannes) et §5 (textes et articles).
> Aucun fichier de contenu modifié dans le cadre de cet audit.

## Résumé exécutif

| Métrique | Valeur |
|---|---|
| Articles audités | 38 |
| Note moyenne globale (a-e, /5) | **3,45 / 5** |
| Articles < 3/5 sur au moins un critère | **17 / 38** |
| Total d'exemples de vannes / répliques faibles listés | **58** |
| Articles P0 (pilliers + gros SEO) à retravailler | **10** |
| Articles P1 (satellites clusters actifs) | **16** |
| Articles P2 (traînes) | **12** |

## Verdict en 3 lignes

**La refonte n'a PAS été menée sérieusement sur le blog.** Beaucoup d'articles conservent un ton scolaire, des staccato interdits par §5 ("BOOM", "PAF"), des vannes qui violent la barre §3 (calembours phonétiques, dramatisations sans twist, chutes plus longues que le setup, blagues Carambar assumées comme telles) et une signature CTA récurrente ("0,99 EUR/mois — moins cher qu'un café") qui trahit une réécriture en surface, pas au fond. Les articles pilliers SEO (`comment-devenir-drole`, `comment-avoir-de-la-repartie`, `timing-humour`, `je-suis-pas-drole-comment-changer`) contiennent chacun 4 à 8 exemples de vannes ratées visibles par le lecteur — ce sont exactement les pages qui exposent la marque à un jugement en 5 secondes.

---

## Résultats des gates binaires (extrait)

| Gate | Verdict | Détail |
|---|---|---|
| G3 (persona nommé/évoqué) | PASS partiel | Yanis/Sophie/Marc évoqués implicitement dans certains articles (« étudiant en soirée », « jeune actif ») mais rarement nommés. |
| G7 (ton pote drôle bienveillant) | **FAIL** | Nombreux passages scolaires (« Étape 1… », « Exercice 2 :… ») et staccato interdits (« BOOM », « PAF », « CGV », « bruit »). |
| G8 (zéro concurrent nommé) | PASS | Aucune mention de concurrent direct détectée. |
| G10 (zéro terme flou / action concrète) | PASS majoritairement | Les actions sont concrètes. |
| G16 (nom marque cité ≥ 3× dans copy client-facing) | PASS | « deviens-marrant.fr » cité partout, souvent en signature. |
| G18 (zéro mention IA) | **FAIL sur 2 articles** | Voir fiches `phrases-droles-conversations` et `blagues-fetes-noel-nouvel-an`. |
| G21 (vannes conformes barre §3) | **FAIL** | 58 exemples de vannes/répliques ne passent pas la barre. |
| G22 (pas de staccato interdit §5) | **FAIL** | 14 occurrences de « BOOM », « PAF », « STOP », « Plot twist ». |
| G23 (pas de cliché motivationnel / ton scolaire) | **FAIL** | Voir top 10 ci-dessous. |

---

## Top 10 des articles à retravailler (priorisés SEO)

_Cf. fiches individuelles ci-dessous pour le détail des vannes faibles._

| # | Article | Rôle SEO | Note globale /5 | Nb vannes faibles | Priorité |
|---|---|---|---|---|---|
| 1 | `je-suis-pas-drole-comment-changer` | Pilier douleurs-personas | 2,4 | 8 | **P0** |
| 2 | `comment-devenir-drole` | Pilier apprendre-humour | 2,8 | 6 | **P0** |
| 3 | `comment-avoir-de-la-repartie` | Pilier techniques-repartie | 2,8 | 5 | **P0** |
| 4 | `timing-humour` | Pilier techniques-delivery | 2,8 | 4 | **P0** |
| 5 | `phrases-droles-conversations` | Fort volume, satellite | 2,6 | 7 | **P0** |
| 6 | `5-types-humour-lequel-pour-toi` | Pilier types-humour | 3,0 | 3 | **P0** |
| 7 | `comment-faire-rire-une-fille` | Fort volume, satellite | 2,8 | 4 | **P0** |
| 8 | `blagues-travail-faire-rire-pro` | Pilier humour-contexte | 3,0 | 3 | **P0** |
| 9 | `erreurs-blagues` | Satellite apprendre-humour | 3,2 | 2 | **P1** |
| 10 | `humour-quotidien-8-habitudes` | Satellite apprendre-humour | 3,2 | 3 | **P1** |

---

## Fiches détaillées par article

_Pour chaque article : notes a-e sur 5 (a. promesse claire + réponse citable, b. voix pote drôle / humour dans la copy, c. qualité des vannes citées, d. absence de clichés / jargon / scolaire / staccato, e. zéro mention IA/concurrent + fautes + cohérence). Puis exemples faibles avec citation + motif §3 + piste de réécriture SANS invention (même idée retravaillée)._

### 1. `comment-devenir-drole` — Pilier apprendre-humour — **P0**

- **a. Promesse + réponse citable** : 4/5. "En bref" en tête + "À retenir" à mi-parcours = citable. Accroche "l'oncle a tort" un peu lourde.
- **b. Voix pote drôle** : 3,5/5. Tutoiement OK. "**LE MEC S'EN FICHE COMPLÈTEMENT**" en caps = cri scolaire.
- **c. Qualité vannes** : 2,5/5.
- **d. Clichés/staccato** : **2/5 — FAIL**. `BOOM — la chute est aux antipodes` = staccato interdit §5.
- **e. IA/concurrent/fautes** : 5/5. Ras.
- **Note globale : 2,8/5**
- **Vannes faibles listées** :
  - `"J'ai essayé le yoga. Mon corps m'a envoyé une lettre de démission."` → **RÉPÉTITION** avec `raconter-blague-sans-massacrer` ("mail de rupture"). GARDER une seule et retravailler l'autre (même idée, autre chute : "…m'a mis en arrêt maladie" ou "…m'a envoyé sa lettre de démission par courrier suivi").
  - `"Comme GPS qui recalcule, mais en drôle."` → tautologie faible ("mais en drôle" = filler). Retravailler : couper "mais en drôle" et laisser "Comme un GPS qui recalcule" trancher seul.
  - `"LE MEC S'EN FICHE COMPLÈTEMENT de comment tu vas"` → caps + explication scolaire. Retravailler en observation sèche : "…alors que la personne s'en fiche complètement de comment tu vas — comme toi, en fait."
  - `BOOM — la chute est aux antipodes` → staccato interdit §5. Retravailler : "…et il atterrit à l'exact opposé de ce que tu attendais."
- **Chiffres à vérifier (§1 : on garde, on signale)** : "Université du Nouveau-Mexique / mécanismes cognitifs", "Journal of Positive Psychology / 8 semaines". Sources non données.

### 2. `comment-avoir-de-la-repartie` — Pilier techniques-repartie — **P0**

- **a.** 4/5 (En bref + CLEF citables).
- **b.** 3/5 ("Ton cerveau fait l'écran bleu de Windows" OK ; mais "**testées en soirée, en réunion et à la machine à café**" = prospectus).
- **c.** 2,5/5.
- **d.** 3/5. Pas de staccato interdit, mais "**Comme les arts martiaux…**" et "**Comme jouer de la musique sans silences**" = comparaisons paresseuses en cascade.
- **e.** 5/5.
- **Note globale : 2,8/5**
- **Vannes faibles** :
  - `"Et toi, tu surveilles encore ce que mangent les gens ? Tu songes à une reconversion dans la nutrition ?"` → chute filler "reconversion dans la nutrition" longue. Retravailler : "Et toi, tu comptes te reconvertir en diététicienne ou c'est un hobby ?"
  - `"Merci, et sinon t'as vu que les chercheurs ont appris à un pigeon à jouer au ping-pong ? Le monde est fou."` → chute "Le monde est fou" = filler qui tue le twist. Retravailler : couper "Le monde est fou" et laisser le pigeon-ping-pong trancher seul.
  - `"Je suis à un stade où mon oreiller a déposé une main courante pour harcèlement. Mon lit me ghoste."` → escalade à 2 chutes, la 2e ("me ghoste") affaiblit la 1re. Choisir une seule.
  - `"Bizarre par rapport à qui ? À toi ? Parce que si tu es la norme, on est tous bizarres, non ?"` → question rhétorique moralisante = scolaire. Retravailler : couper la 2e phrase.
  - `"Ah, tu as remarqué ! Ça veut dire que tu m'écoutes. C'est le plus beau jour de ma vie."` → chute usée ("plus beau jour de ma vie"). Retravailler : "…Ça veut dire que tu m'écoutes. On a fait des progrès."

### 3. `timing-humour` — Pilier techniques-delivery — **P0**

- **a.** 4/5.
- **b.** 3/5. "à la vitesse d'un CGV" = comparaison paresseuse.
- **c.** 3/5. Peu de vannes propres, surtout des exemples pédagogiques.
- **d.** **2/5 — FAIL**. `PAF, le freinage te projette dans le rire` = staccato interdit §5. `freine BRUTALEMENT` = caps de cri.
- **e.** 5/5.
- **Note globale : 2,8/5**
- **Vannes/formulations faibles** :
  - `"comme mettre du ketchup sur un soufflé — techniquement possible, mais personne ne te le pardonnera"` → comparaison forcée et longue. Retravailler : "…comme du ketchup sur un soufflé. Techniquement légal."
  - `"C'est comme jouer de la musique sans silences entre les notes : ça s'appelle du bruit."` → moralisant. Retravailler : "Sans silences entre les notes, c'est plus de la musique — c'est du bruit."
  - `PAF, le freinage te projette dans le rire.` → staccato interdit §5. Retravailler sans onomatopée : "Le freinage brutal projette ton cerveau dans le rire."
  - `"Je t'aime... toi aussi Sandrine."` → GARDER, c'est l'exemple pédagogique fort de l'article.

### 4. `erreurs-blagues` — Satellite apprendre-humour — **P1**

- **a.** 4/5.
- **b.** 4/5 ("papy tousse, mamie parle de la météo, et tu fixes ta purée en te demandant pourquoi tu existes" = bon).
- **c.** 3,5/5.
- **d.** 4/5 (pas de staccato).
- **e.** 5/5.
- **Note globale : 3,4/5**
- **Vannes / formulations faibles** :
  - `"expliquer une blague, c'est comme disséquer un papillon : techniquement intéressant, mais le papillon est mort"` → **RÉPÉTITION** avec `comment-devenir-drole` ("disséquer une grenouille"). Choisir un seul article et l'autre change de comparaison.
  - `"c'est pas une blague, c'est un podcast"` → cliché usé (« c'est un podcast » = tic web). Retravailler : "c'est pas une blague, c'est un roman-fleuve."
  - `"l'investissement le plus rentable depuis que tu as arrêté de raconter des blagues Carambar"` → CTA signature "Carambar" = cliché de comptoir, ironique dans un article qui condamne les vannes de comptoir.

### 5. `autoderision-interactions` — Satellite techniques-repartie — **P1**

- **a.** 4/5.
- **b.** 3/5.
- **c.** 3/5.
- **d.** 4/5.
- **e.** 5/5.
- **Note globale : 3,4/5**
- **Vannes faibles** :
  - `"La dernière fois que j'ai cuisiné, les pompiers m'ont ajouté à leur liste de contacts favoris."` → cliché "pompiers" usé, présent 2x dans le blog (aussi `phrases-droles-conversations` n°26). Choisir un seul emplacement et retravailler l'autre : "La dernière fois que j'ai cuisiné, ma poêle a demandé une mutation."
  - `"Mon chat a plus de vie sociale que moi. Il reçoit des visites, il a des rendez-vous réguliers chez le véto, il a même un carnet de vaccinations — moi j'ai même pas de dentiste."` → chute "j'ai même pas de dentiste" molle après une énumération à rallonge. Couper : "Mon chat a plus de vie sociale que moi. Il a un carnet de vaccinations. Moi, même pas de dentiste."
  - `"Je suis le genre de personne qui met 10 minutes à comprendre la machine à café nouvelle. Mais donne-moi un tableur Excel et je deviens Neo dans Matrix."` → référence "Neo dans Matrix" datée (film 1999). Retravailler : "…donne-moi un tableur Excel et j'y passe la journée sans manger."

### 6. `repartie-debutant-5-etapes` — Satellite techniques-repartie — **P1**

- **a.** 4/5.
- **b.** 3/5.
- **c.** 3,5/5.
- **d.** 4/5.
- **e.** **3/5 — INCOHÉRENCE PERSONA**. L'article suit "Lucas 20 ans étudiant". Le persona principal est **Yanis** 20 ans étudiant introverti (project-context.md). Un article ne doit pas renommer le persona principal en "Lucas" (§ ton et charte). "son cerveau fait le bruit d'un modem 56k" = référence datée (années 1990) pour un étudiant de 20 ans en 2026.
- **Note globale : 3,2/5**
- **Correctifs** : renommer "Lucas" en une formule anonyme ("un pote", "un mec que je connais") ou en "Yanis" pour aligner sur le persona ; retirer la référence modem 56k.

### 7. `humour-quotidien-8-habitudes` — Satellite apprendre-humour — **P1**

- **a.** 4/5.
- **b.** 3/5.
- **c.** 3/5.
- **d.** 4/5.
- **e.** 5/5.
- **Note globale : 3,2/5**
- **Vannes faibles** :
  - `"Tu gères tellement le café que tu devrais postuler chez Nespresso."` → sonne pub, sans twist. Retravailler : "Tu gères tellement bien le café que je pense que tu triches. Personne peut être aussi calme un lundi."
  - `"Ton Excel est si beau que j'ai failli l'encadrer."` → OK mais un peu plat. Piste : "Ton Excel est si beau que je l'ai enregistré 3 fois."
  - `"On est tous à regarder nos téléphones côte à côte. C'est ça le métavers ?"` → "métavers" = mot marketing daté. Retravailler : "On est tous à regarder nos téléphones côte à côte. Techniquement, c'est une soirée."

### 8. `5-types-humour-lequel-pour-toi` — Pilier types-humour — **P0**

- **a.** 4/5.
- **b.** 3,5/5.
- **c.** 3/5.
- **d.** 4/5.
- **e.** **4/5** — la citation attribuée à Blanche Gardin ("Mon psy m'a dit que j'avais fait des progrès. J'ai répondu que lui aussi devrait en faire — ça fait 8 ans qu'il me supporte.") est présentée comme un sketch réel dans la section "3 sketches décortiqués". Aucune source ne confirme cette citation → **suspecte d'être fabriquée**. À signaler pour vérification (règle §1 : on ne supprime pas, on signale).
- **Note globale : 3,0/5**
- **Vannes faibles** :
  - `"Qui vivra verra" → "Qui vivra, Vera. C'est une prophétie sur une meuf qui s'appelle Vera."` → **calembour phonétique pur** = interdit §3 (test : "parce que ça sonne comme…"). Retravailler en pointant vers l'autre technique de l'article (polysémie) ou retirer l'exemple.
  - `"Cette réunion était tellement longue que j'ai commencé à rédiger mon testament."` → cliché "réunion sans fin / testament", vu partout. **RÉPÉTITION** avec `humour-noir-utiliser-sans-blesser`. Retravailler : "Cette réunion était tellement longue que j'ai commencé à réfléchir à ma reconversion. Puis à la reconversion des autres."
  - `"Ça va, mais mes plantes me jugent"` → cliché Instagram. Retravailler : "Ça va, mais mes plantes ont l'air déçues."

### 9. `humour-noir-utiliser-sans-blesser` — Satellite types-humour — **P1**

- **a.** 4/5.
- **b.** 3,5/5.
- **c.** 3/5.
- **d.** 4/5.
- **e.** **3/5** — même problème que #8 : la citation de Blanche Gardin sur le psy est présentée comme un "sketch réel" sans source. **À signaler** (§1 : on garde, on signale).
- **Note globale : 3,0/5**
- **Vannes faibles** :
  - `"Cette réunion était tellement longue que j'ai commencé à rédiger mon testament."` (répétée avec #8) → même correctif.
  - `"Je l'ai enterré ce matin. La cérémonie était sobre. Il y avait un croissant."` → sympa, GARDER — mais utilisée aussi dans #8, doublon.

### 10. `jeux-de-mots-technique-3-etapes` — Cluster techniques-repartie (hors clusters listés) — **P2**

- **a.** 4/5.
- **b.** 3/5.
- **c.** **2,5/5**. L'article admet lui-même que son exemple de démo n'est "pas un chef-d'œuvre" — problématique pour un article censé montrer comment faire.
- **d.** 4/5.
- **e.** **4/5** — pas de `updatedAt` alors que 27 autres articles en ont un daté du 2026-09-29. **Anomalie de refonte : article oublié**.
- **Note globale : 3,0/5**
- **Vannes/formulations faibles** :
  - `"Mon avocat m'a coûté 3 euros. C'est scandaleux pour un fruit, mais franchement il m'a sorti d'un sacré pétrin."` → "sorti d'un sacré pétrin" = 2e calembour ajouté qui parasite. Retravailler : "Mon avocat m'a coûté 3 euros. Vu ses conseils, c'est cher pour un fruit."
  - `"Je suis au courant de tout ce qui se passe au bureau. Surtout quand quelqu'un touche à la machine à café et que ça disjoncte."` → l'article lui-même dit "c'est pas un chef-d'œuvre". Retravailler l'exemple entier pour donner un vrai jeu de mots qui marche, sinon la démo tue le message.

### 11. `exercices-developper-humour` — Satellite apprendre-humour — **P2**

- **a.** 4/5.
- **b.** 3,5/5.
- **c.** 3,5/5.
- **d.** 4/5.
- **e.** 5/5.
- **Note globale : 3,6/5**
- **Vannes** : globalement OK (déodorant / motion de censure, plante affamée, moutons qui fuient). Rien de scandaleux, quelques répétitions de "mon corps m'a envoyé…" à harmoniser sur le blog.

### 12. `timing-humour-ralentir` — Satellite techniques-delivery — **P1**

- **a.** 4/5.
- **b.** 3/5.
- **c.** 3/5.
- **d.** **2/5 — FAIL**. `BOOM. Rire.` = staccato interdit §5. Le paragraphe "Seconde 10-12" et "Seconde 12-13" avec "BOOM" trahit une refonte qui n'a pas relu le fichier.
- **e.** **4/5** — pas de `updatedAt`. **Article oublié par la refonte**.
- **Note globale : 3,2/5**
- **Formulations faibles** :
  - `BOOM. Rire.` → staccato §5. Retravailler : "Deux secondes de silence, et le rire arrive."
  - `"C'est comme la différence entre lancer une balle et armer un lance-pierre : l'élastique tiré, c'est le silence."` → métaphore complexe qui explique l'humour = scolaire. Couper.

### 13. `raconter-blague-sans-massacrer` — Satellite techniques-delivery — **P1**

- **a.** 4/5.
- **b.** 4/5.
- **c.** 3,5/5.
- **d.** 3,5/5. `"ATTENDS ATTENDS"` en tête = cri pédagogique reproduit (limite acceptable).
- **e.** **4/5** — pas de `updatedAt`. **Article oublié par la refonte**.
- **Note globale : 3,6/5**
- **Vannes faibles** :
  - `"Mon corps m'a envoyé un mail de rupture."` → **RÉPÉTITION** avec `comment-devenir-drole` ("lettre de démission") et `humour-quotidien-8-habitudes` ("motion de censure"). Le trope "mon corps m'a envoyé X" est saturé. En garder un, retravailler les deux autres.
  - `"Mon chat est tellement gros... qu'il a son propre code postal."` → tournure "tellement X que Y" = format ultra-usé. Retravailler : "Mon chat est tellement gros que le vétérinaire lui a demandé s'il partageait avec un colocataire."

### 14. `phrases-droles-conversations` — Satellite fort-volume (page traînes SEO) — **P0**

- **a.** 4/5. Bonne accroche, mais le mot **phrase drôle** en gras répété = SEO stuffing lourd.
- **b.** 3,5/5. "Fary du 3e étage" = OK. Le terme "armurerie / chargeur" (métaphore guerrière) sonne faux vs la voix "pote drôle bienveillant".
- **c.** **2/5**. 33 phrases, dont **7 clairement en dessous de la barre §3**.
- **d.** 3/5.
- **e.** 5/5.
- **Note globale : 2,6/5**
- **Vannes faibles** :
  - **#10** `"Je suis bilingue : je parle français et mauvaises décisions."` → cliché Twitter usé, "mauvaises décisions" est un mème daté. Retravailler : "Je suis bilingue : je parle français, et je dis oui à des trucs que je vais regretter."
  - **#13** `"Mon médecin m'a dit de manger équilibré. Alors je mets du Nutella des deux côtés de la tartine."` → circule depuis 15 ans sur les forums, vanne de comptoir. Retravailler : "Mon médecin m'a dit de manger équilibré. Ce midi, deux entrées, deux desserts. Techniquement, c'est équilibré."
  - **#19** `"Mon green flag à moi c'est que j'ai un plan Netflix ET un plan B dans la vie. Les deux sont du canapé, mais c'est un plan."` → "green flag" = jargon TikTok qui date déjà, chute "les deux sont du canapé" convenue. Retravailler : "Mon plan A c'est le canapé. Mon plan B, c'est un autre canapé. On appelle ça avoir un plan B."
  - **#23** `"Je suis pas mort, je suis juste en mode avion social."` → calembour "mode avion" = paresseux. Retravailler : "Je suis pas mort, j'ai juste eu besoin d'un long silence."
  - **#25** `"Je suis en PLS depuis ce matin. PLS = Position Latérale de Scrolling."` → **CALEMBOUR PHONÉTIQUE PUR** = interdit §3. Retravailler : "Je suis en PLS depuis ce matin. Mon canapé et moi, on a fusionné."
  - **#26** `"Alerte : j'ai cuisiné ce soir. Aucun pompier n'a été appelé. Jour historique."` → cliché "pompiers" doublonné avec `autoderision-interactions`. Retravailler ou déplacer.
  - **#30** `"Je suis en mode brainstorm. Pour l'instant c'est surtout le storm, le brain arrive."` → **CALEMBOUR PHONÉTIQUE** sur brainstorm = interdit §3. Retravailler : "Je suis en mode brainstorm. Pour l'instant c'est surtout le brouillard."
  - **#33** `"Si le travail c'est la santé, alors les congés c'est de la médecine préventive."` → retournement de proverbe = vanne de tonton. Retravailler : "Je fais des congés préventifs. Pour mon dos, mais surtout pour mes collègues."
- **Note stylistique** : le mot **phrase drôle** répété 4 fois en gras est du SEO stuffing visible qui casse la voix. Le charger en H2 suffit.

### 15. `comment-faire-rire-une-fille` — Satellite fort-volume — **P0**

- **a.** 4/5.
- **b.** 3/5. Voix condescendante par moments ("Cool. Mais si ton plan c'est... assieds-toi, on va parler").
- **c.** 3/5.
- **d.** 4/5.
- **e.** 5/5.
- **Note globale : 2,8/5**
- **Vannes faibles** :
  - `"Tu sais, quand je t'ai vue, je me suis dit 'elle a l'air sympa'... et après t'as parlé de ta collection de cactus et j'ai su que c'était plus profond que ça."` → chute "plus profond que ça" = filler mou. Retravailler : "…et après t'as parlé de ta collection de cactus. Et j'ai su qu'on avait un problème."
  - `"'elle a l'air sympa'"` puis meta-commentaire "**pas un mensonge — une amplification comique**" — le commentaire pédagogique tue l'exemple.
  - Vanne fromage/comté 18 mois : longue mais OK.
- **Incohérence** : article destiné à une audience non listée dans les personas (masculin hétéro), à documenter dans project-context si on le garde.

### 16. `comment-faire-rire-un-homme` — Satellite fort-volume — **P0**

- **a.** 3,5/5. Défense féministe en tête intéressante mais un peu appuyée pour un article qui doit vendre en 5 secondes.
- **b.** 3/5.
- **c.** 3,5/5.
- **d.** 3,5/5.
- **e.** **4/5** — référence culturelle US datée (`The Office` / `that's what she said`) pour un public FR ; incohérence audience (article vise une lectrice, hors des 3 personas).
- **Note globale : 2,8/5**
- **Vannes faibles** :
  - `"On dirait le moment dans The Office où Michael dit 'that's what she said' sauf que TOI tu le fais vraiment."` → référence non-francophone. Retravailler avec une référence FR (ou couper).
  - `"LinkedIn était un réseau professionnel (spoiler pour le deuxième : toujours pas)"` → cliché ultra-usé (2018-2020). Retravailler ou couper.
  - `"J'ai essayé de monter un meuble IKEA. J'ai fini avec 7 vis en trop et un truc qui ressemble vaguement à une étagère si tu penches la tête."` → cliché IKEA usé. Retravailler : "J'ai monté un meuble IKEA. J'ai fini avec 7 vis en trop. J'ai décidé que c'était de l'art."
  - Répétitions avec `comment-faire-rire-une-fille` : "Le DJ joue du reggaeton comme si c'était une urgence médicale" + "Le serveur nous ignore tellement qu'on pourrait braquer la caisse" — doublons entre les 2 articles fort-volume.

### 17. `je-suis-pas-drole-comment-changer` — Pilier douleurs-personas — **P0**

- **a.** 4/5.
- **b.** 4/5. Persona bien adressé (Yanis).
- **c.** **2,5/5**.
- **d.** 3,5/5. "**76%**", "**30% de ses vannes**", "**70%**" en gras répétés (bold+bold) = stuffing statistique visible.
- **e.** **3/5**. Chiffres cités sans source vérifiable :
  - "76% des gens pensent ne pas être drôles, selon une étude de l'Université du Colorado" → source non trouvée.
  - "Roman Frayssinet a un taux de réussite d'environ 70% sur scène" → chiffre non sourcé, potentiellement inventé.
  - **À signaler au fondateur** (§1 : on garde, on signale).
- **Note globale : 2,4/5** — le plus mauvais des piliers.
- **Vannes faibles** :
  - `"J'ai tellement procrastiné que ma to-do list a pris la poussière"` → cliché passe-partout. Retravailler : "J'ai tellement procrastiné que ma to-do list a une date de péremption."
  - `"LinkedIn, c'est le seul endroit où les gens sont 'ravis d'annoncer' qu'ils ont changé de job. Au bureau, ils pleuraient."` → GARDER, bon.
  - `"Ah mais c'est super intéressant ce que tu dis. Non attends, c'est le mot 'intéressant' qui est super intéressant."` → chute meta-cérébrale sur "intéressant" qui retourne sur elle-même. Retravailler : couper cette vanne, l'article donne déjà 2 bonnes vannes de démo dans la même liste.
  - `"T'avais zéro énergie / zéro envie / zéro motivation / zéro raison d'être là. Genre même ta chaise avait l'air de s'ennuyer."` → escalade "zéro X, zéro Y, zéro Z, zéro W" = staccato de liste mécanique ; chute "chaise ennuyée" molle. Retravailler : "T'avais zéro énergie. Ta chaise non plus."
- **Prio absolue** : article #1 à retravailler — c'est un pilier douleur qui vise le persona principal (Yanis introverti) et il porte à la fois des chiffres suspects + des vannes plates + un ton parfois donneur de leçon.

### 18. `repondre-moqueries-avec-humour` — Satellite douleurs-personas — **P1**

- **a.** 4/5.
- **b.** 4/5.
- **c.** 3,5/5.
- **d.** 4/5.
- **e.** 5/5.
- **Note globale : 3,4/5**
- **Vannes faibles** :
  - `"Merci, j'y travaille. Les ninjas aussi sont discrets et personne leur reproche."` → "ninjas" = cliché usé. Retravailler : "Merci, c'est le résultat de 20 ans d'entraînement."
  - `"Ah ouais ? C'est quoi qui est nul exactement ? J'adore les retours constructifs."` → "retours constructifs" = jargon corporate, décalé pour Yanis 20 ans. Retravailler : "Ah ouais ? C'est quoi qui est nul, exactement ? Je prends note."
  - `"Attends, laisse-moi 5 minutes, apparemment je suis lent. Faut que je process."` → "process" = anglicisme corporate. Retravailler : "Attends, laisse-moi 5 minutes. Apparemment je suis lent."

### 19. `blagues-travail-faire-rire-pro` — Pilier humour-contexte — **P0** (contenu solide, mais chiffres douteux)

- **a.** 4/5.
- **b.** 4/5.
- **c.** 4/5 — c'est un des meilleurs articles du blog côté vannes.
- **d.** 4/5.
- **e.** **3,5/5** — chiffres à vérifier :
  - "leaders qui utilisent l'humour perçus comme **23% plus compétents et 25% plus appréciés** (étude de Stanford)" → source non citée précisément (l'étude Stanford Business School Aaker/Bagdonas 2020 existe mais les pourcentages exacts sont à re-vérifier).
  - "Étude de l'Université de Pennsylvanie" → source non identifiable.
  - **À signaler** (§1 : garder, signaler).
- **Note globale : 3,6/5**
- **Vannes** : rien à retirer sur la barre §3. Contenu très propre.

### 20. `jamais-quoi-repondre-techniques` — Satellite douleurs-personas — **P1**

- **a.** 4/5. En bref/CLEF citables.
- **b.** 3,5/5.
- **c.** 4/5 — beaucoup de phrases filet OK ("Ah c'est marrant que tu dises ça...", "J'avoue", "Bonne question. Toi t'en penses quoi ?", "La musique ici ressemble à la playlist de mon dentiste", "Ce buffet a l'air d'avoir vécu des choses").
- **d.** 4/5.
- **e.** **4/5** — chiffre "**65% des gens** rapportent avoir régulièrement le blanc conversationnel" — source non citée, **à signaler**.
- **Note globale : 3,8/5** — un des bons articles.
- **Formulations faibles limitées** : références "404 Not Found" et "fichier qui charge à 99%" — un peu geek pour Yanis, à assouplir.

### 21. `timidite-et-humour` — Satellite techniques-repartie — **P1**

- **a.** 4/5.
- **b.** 4/5. "J'ai un plan d'évacuation mentale pour chaque pièce" = GARDER, très bon.
- **c.** 3,5/5.
- **d.** **2,5/5 — FAIL**. `PAF — la punchline arrive là où personne ne la voyait venir` = staccato interdit §5. `LE PLUS DRÔLE du siècle` en caps = cri scolaire.
- **e.** 5/5.
- **Note globale : 3,4/5**
- **Correctif** : remplacer `PAF` par "…et la punchline arrive là où personne ne la voyait venir." + retirer les caps `LE PLUS DRÔLE`.

### 22. `storytelling-drole-5-structures` — Satellite techniques-delivery — **P1**

- **a.** 4/5.
- **b.** 3,5/5.
- **c.** 4/5 — bonnes vannes : `"Je suis devenu l'assistante de mon propre sommeil"`, `"J'avais dépensé 60 euros pour manger triste"`, `"la chemise repassée était à l'envers depuis le début. Adulte confirmé"`, `"J'ai un agenda. Il est vierge. Mais il est très beau. Et je suis en paix avec ça."`.
- **d.** 4/5. `PLUS TÔT` en caps = scolaire léger.
- **e.** **4/5** — chiffre "**structure 70% / contenu 30%**" non sourcé (opinion présentée comme fait). **À signaler**.
- **Note globale : 3,8/5**

### 23. `conversation-machine-a-cafe` — Satellite humour-contexte — **P1**

- **a.** 4/5.
- **b.** 3/5. `des êtres à moitié endormis qui avancent vers la caféine comme des zombies vers les cerveaux` = cliché "zombies" usé. `awkward` = anglicisme.
- **c.** 4/5 — beaucoup de très bons exemples : "en mode week-end / mis 5 min à trouver mon badge", "yaourts du fond — pacte implicite depuis 2019", "J'ai préparé à avoir l'air d'écouter", "Lundi déguisé en jeudi, ou c'est ma perception ?".
- **d.** 3,5/5. "awkward" = à traduire.
- **e.** 5/5.
- **Note globale : 3,8/5** — un des bons.
- **Correctif mineur** : remplacer `awkward` par `gênant`, retravailler le "zombies vers les cerveaux".

### 24. `repartie-soiree-anti-malaise` — Satellite humour-contexte — **P1**

- **a.** 4/5.
- **b.** 3,5/5. `fantôme` = cliché mais bref.
- **c.** **4,5/5 — un des meilleurs articles**. Vannes exceptionnelles : `"Je suis sur un fuseau horaire différent. C'est exprès, pour l'exclusivité de mes apparitions"`, `"Bon. Qui a faim ? Parce que moi j'ai besoin d'une transition alimentaire là"`, `"J'avais prévu de partir en mode mystérieux à 23h. Je suis à 23h04 donc l'effet est un peu raté mais l'intention était là"`, `"OK, j'annule mon spectacle"`, `"Je propose qu'on parle de la météo comme toutes les personnes normales"`.
- **d.** 4/5.
- **e.** 5/5.
- **Note globale : 4,0/5** — **le meilleur article du corpus statique.** À prendre en référence pour la voix marque.

### 25. `humour-apres-rupture` — Satellite douleurs-personas (persona Marc) — **P1**

- **a.** 4/5.
- **b.** 4/5.
- **c.** **4,5/5**. Vannes remarquables : `"J'ai eu la rupture la plus administrative de l'histoire — par message, à 14h37 un mardi. Le timing suggère que j'étais son activité de pause déjeuner"`, `"l'autre avait pris tout le sel"` (détail parfait), `"La playlist Spotify qu'il avait créée pour 'les moments romantiques' et qui s'appelait 'Musique 2' avec 3 chansons"`, `"un plateau de fromages comme si c'était un dîner d'affaires"`.
- **d.** 4/5.
- **e.** **4/5** — pas de `updatedAt`. **Article oublié par la refonte** malgré une qualité qui n'aurait rien à corriger.
- **Note globale : 4,0/5** — 2e meilleur article. Ajouter `updatedAt` pour tracer le passage.

### 26. `confiance-humour-apres-rupture` — Satellite douleurs-personas (persona Marc) — **P2**

- **a.** 4/5.
- **b.** 3/5 — article très explicatif, peu de vannes.
- **c.** 3,5/5 — surtout de la théorie. `"'merci de laisser propre'. La machine est beige crade depuis 2019"` GARDER, `"J'ai passé 3 mois à analyser une relation de 6 mois. Mon ratio temps-d'analyse sur temps-de-relation est assez impressionnant"` GARDER.
- **d.** 3,5/5 — un peu scolaire ("Étape 1 — Observer sans produire", "Étape 2 — Partager des trucs drôles"…) mais dans les limites §5.
- **e.** 4/5. `"un des mécanismes les plus documentés du résilience psychologique"` = affirmation forte sans source. **À signaler**.
- **Note globale : 3,6/5**

### 27. `pourquoi-blagues-marchent-pas` — Satellite apprendre-humour — **P1**

- **a.** 4/5.
- **b.** 3,5/5. `visage de PV de réunion` = imagé.
- **c.** 3,5/5.
- **d.** 4/5. `SAV` = anglicisme corporate.
- **e.** **4/5** — cite **Pierre Croce** (nouveau dans le pool marque : Paul Mirabel/Fary/Frayssinet/Gardin/Waly Dia/Pascot/Reg + Pierre Croce). À valider avec Thomas : ajout intentionnel ou incohérence ?
- **Note globale : 3,6/5**
- **Vannes faibles** :
  - `"200 000 ans à se demander pourquoi le coq traverse la route... Genre il révise sa déclaration d'impôts ou quoi ?"` → trop longue, chute "déclaration d'impôts" faible. Retravailler : "…et zéro à se demander où il va après. Genre chez lui, la vaisselle l'attend ?"

### 28. `blagues-courtes-vs-longues` — Satellite techniques-delivery — **P2**

- **a.** 4/5.
- **b.** 3,5/5.
- **c.** 3/5 — article théorique, très peu d'exemples de vannes concrètes citées.
- **d.** 4/5.
- **e.** 4/5. Cite Pierre Croce aussi.
- **Note globale : 3,6/5**

### 29. `rester-muet-en-groupe` — Satellite douleurs-personas (persona Yanis) — **P1**

- **a.** 4/5.
- **b.** 4/5. `un figurant de série bien payé : présent dans le plan, mais sans réplique` = très bon.
- **c.** 4/5. Bonnes vannes : `"Mais attends, t'as vraiment dit 'sushi végé' ? C'est juste du concombre dans du riz, là"`, `"Ton boss t'a écrit à 23h pour te demander un truc 'urgent' que t'as fait à 9h. Il dort jamais ?"`, `"Vous êtes en train de débattre de quelle pizza est la meilleure depuis 12 minutes. Personne mange"`, `"C'est fou comme on est tous d'accord en fait, sauf qu'on hurle"`.
- **d.** 4/5.
- **e.** **4/5** — cite "**Mark Leary, Université Duke**" + terme "**hyper-monitoring social**". Mark Leary existe (chercheur reconnu en psychologie sociale à Duke), mais le terme exact "hyper-monitoring social" n'est pas standard dans la littérature (le concept proche est "self-monitoring" de Snyder). **À signaler** — pas de suppression, juste vérification.
- **Note globale : 3,8/5** — bon article pour Yanis.

---

## Fiches JSON — 9 réécritures `blog-article-rewrites.json`

_Constat général : ces 9 réécritures sont d'un tout autre niveau de qualité — nettement inférieur au reste du blog. Elles portent les marques d'une génération IA "à l'ancienne" (formulations creuses, staccato interdits, citations attribuées douteuses, témoignages fabriqués)._

### 30. `avoir-confiance-en-soi-grace-a-l-humour` — Cluster douleurs-personas — **P0**

- **a.** 3,5/5.
- **b.** 3/5. `l'attention span moyen est plus courte qu'un TikTok` = anglicisme + cliché tech.
- **c.** 3/5.
- **d.** **2/5 — FAIL LOURD**. `Faux. Archifaux. Complètement faux.` = staccato triplet interdit §5. `Malin.` = staccato. `Pas du tout.` = staccato court.
- **e.** **2/5 — VIOLATION §1 bis "zéro invention"**. Deux témoignages ENTIÈREMENT FABRIQUÉS : `**Tom, 21 ans, étudiant**` et `**Léa, 28 ans, cheffe de projet**`. **NO-GO immédiat**. Aussi : chiffre "**Université de Stanford / 40% plus élevée**" non sourcé. Citation Roman Frayssinet `"L'humour, c'est pas être parfait — c'est être humain, mais en version améliorée"` = probablement fabriquée. Citation Paul Mirabel `"Une bonne blague, c'est comme un bon café. Si c'est trop long, ça devient amer"` = suspecte.
- **Note globale : 2,4/5 — À REFAIRE**.

### 31. `blague-courte-arme-secrete-humour` — Cluster humour-contexte satellite (listé) — **P0**

- **a.** 3,5/5. `blague courte` en gras répété 20+ fois = SEO stuffing lourd.
- **b.** 3/5. Cite Paul Mirabel "Une bonne blague, c'est comme un bon café" (déjà signalé, citation suspecte).
- **c.** **2/5**. 15 blagues listées, dont **8 clairement en dessous de la barre §3** :
  - `"Je bois pas d'alcool. Je conduis... mes amis au désespoir."` → calembour phonétique.
  - `"Je picole pas, je fais de la recherche en œnologie appliquée."` → vanne de tonton.
  - `"Je suis célibataire par choix. Pas le mien, celui des autres."` → cliché web.
  - `"Mon collègue est tellement lent qu'on l'a surnommé 'Page qui charge'."` → cliché usé.
  - `"Je travaille dur. Enfin, je fais semblant très sérieusement."` → cliché.
  - `"Mon bureau ressemble à ma vie : bordélique mais avec du potentiel."` → cliché.
  - `"Ma mère cuisine si mal que même le micro-ondes refuse."` → cliché tellement-que-Y.
  - `"Mon père explique internet comme s'il décrivait la magie."` → cliché boomer.
  - `"Mes enfants m'ignorent tellement que je commence à douter de mon existence."` → cliché.
- **d.** **1/5 — FAIL CRITIQUE / NO-GO**. **VANNE SEXISTE ET VULGAIRE** utilisée comme exemple pédagogique :
  - `"J'ai découvert d'où venait mon mal de dos : ma femme me casse les couilles en stéréo."` **puis** `"Mon ostéopathe a trouvé mon problème : ma femme me casse les couilles en 4K."` → viole **§3** ("jamais vulgaire", "blague qui se moque d'un groupe" — ici les femmes). **NO-GO absolu**. Charte marque bafouée.
  - Aussi staccato triplets : `Efficace, chirurgical, mémorable.` / `Simple, direct, efficace.`
- **e.** **2/5**. Chiffre "**étude Université de Stanford / blagues < 15 mots retenues 3 fois plus longtemps**" = probablement fabriqué. Citation Panayotis Pascot `"Une vanne courte, c'est de l'artillerie lourde"` = suspecte. Attribution `"Mon ex m'a dit que j'étais immature. J'ai failli m'étouffer avec mes céréales"` à Fary = douteuse. Attribution `"Je suis tellement fauché que quand je rêve, c'est en noir et blanc"` à Waly Dia = vanne classique du répertoire américain (proche Steven Wright).
- **Note globale : 2,0/5 — À REFAIRE INTÉGRALEMENT (P0 top absolu)**.

### 32. `blague-drole-7-criteres-pepite` — Non listé dans clusters — **P1**

- **a.** 3,5/5.
- **b.** 2,5/5. `crickets` = anglicisme. `swahili` = cliché.
- **c.** 3/5. La vanne Fary "cow-boys/Indiens" est bien attribuée (vraie vanne de "Fary Is The New Black").
- **d.** **2/5 — FAIL**. `Faux. Archifaux. Complètement faux.` = staccato triplet interdit **RÉPÉTÉ** du JSON #1.
- **e.** **2/5**. Nombreuses citations attribuées suspectes :
  - Fary `"On attend que le mec aille à droite, on le fait aller à gauche, mais il faut que la gauche existe vraiment dans l'histoire"` — suspecte.
  - Panayotis Pascot `"Entre le setup et la chute, il y a un silence. Trop court, la blague tombe à plat…"` — suspecte.
  - Attributions Frayssinet `"Ma copine m'a dit qu'elle voulait un mec mystérieux..."` et Waly Dia `"Ma mère m'appelle pour me dire 'Rappelle-moi'..."` — non vérifiables.
  - `"Les gens disent que je ressemble à Brad Pitt. Après 6 bières, dans le noir, de dos."` → cliché ultra-usé web.
- **Note globale : 2,3/5 — À REFAIRE**.

### 33. `citation-drole` — Non listé — **P2** mais impact SEO potentiel fort ("citation drôle")

- **a.** 3,5/5.
- **b.** 2,5/5. `awkwardness` = anglicisme.
- **c.** **2/5**. **40 "citations" dont la majorité sont probablement INVENTÉES** — violation §1 bis "zéro invention". Seules quelques-unes ont une attribution honnête ("adapté de Churchill", "Oscar Wilde revisité", "Mae West"), les 32 autres circulent comme des citations autonomes sans source. Beaucoup sont des clichés web :
  - `"Je suis multitâche : je peux écouter, ignorer et oublier en même temps."` → cliché web.
  - `"Mon psychiatre dit que je suis fou. Je lui ai dit qu'il était fou. C'est lui qui a un diplôme."` → cliché.
  - `"Cette réunion aurait pu être un email. Cet email aurait pu être une pensée."` → cliché ultra-usé + doublon avec `phrases-droles-conversations` n°29 ("Ce meeting aurait pu être un mail").
  - `"PowerPoint : l'art de dire peu avec beaucoup de slides."` → cliché.
- **d.** 3/5.
- **e.** **2/5**. **PROBLÈME TEMPOREL** : `"2024 m'a appris que j'étais plus résistant que prévu."` — l'article s'affiche en 2026, cette référence date. Citation attribuée à Fary `"L'humour, c'est la seule chose sérieuse dans la vie"` = attribution douteuse (proche de citations Coluche/Twain). Citation en tête `"L'humour, c'est la politesse du désespoir"` (Chris Marker via Boris Vian) → présentée comme "la maxime" anonyme au lieu d'attribuer.
- **Note globale : 2,6/5 — À REFAIRE**. Le cœur du problème : "40 citations drôles" doit être 40 verbatims **soit sourcés, soit assumés comme "formules originales"** — pas un mélange trouble.

### 34. `comment-improviser-des-blagues` — Non listé — **P2**

- **a.** 3,5/5.
- **b.** **2,5/5 — VIOLATION potentielle §5**. Cite **`Jamel Comedy Club`** dans le premier paragraphe. Le Jamel Comedy Club n'est pas un concurrent direct de deviens-marrant.fr mais reste une marque/plateau à valider (règle "zéro concurrent nommé" à interpréter). **À signaler à Thomas.**
- **c.** **2/5**. Plusieurs vannes problématiques :
  - `"Ah tu travailles dans un asile maintenant ? Ça explique tes horaires de visite."` + `"Non mais sérieux, ils t'ont donné une camisole de force ou c'est juste le dress code ?"` → **VIOLATION §3** : "blague qui se moque d'un groupe" (moquerie sur maladies mentales). **NO-GO**.
  - `"Ma chaussette sent tellement le fromage qu'elle pourrait faire grève à la SNCF. 'Solidarité olfactive, camarades !'"` → chaîne d'associations forcée, chute lourde.
  - `"Si les optimistes voient le verre à moitié plein et les pessimistes à moitié vide, moi je me demande qui a bu l'autre moitié."` → cliché total.
  - Meta-blague `"Je déteste les gens qui généralisent. Tous, sans exception."` → attribution Coluche/publique, présentée comme technique originale.
- **d.** 3/5.
- **e.** 3/5. Citation Fary attribuée `"L'humour, c'est la seule chose sérieuse dans la vie"` = déjà signalée suspecte.
- **Note globale : 2,5/5 — À REFAIRE**. Retirer impérativement le passage "asile / camisole" (moquerie handicap psy).

### 35. `comment-raconter-une-blague-sans-la-rater` — Satellite techniques-delivery listé — **P1**

- **a.** 3,5/5.
- **b.** 3,5/5. Moins "AI slop" que les autres JSON.
- **c.** 3,5/5. `"Bon, celle-là, je la garde pour un public moins exigeant"` = OK filet. `"Visiblement, mon timing était en roue libre"` = OK.
- **d.** 4/5. Pas de staccato interdit.
- **e.** 5/5. Pas de faute critique, pas de citation suspecte majeure.
- **Note globale : 3,7/5** — **le moins mauvais du bloc JSON**, à retravailler à la marge (voix pote drôle à intensifier, actuellement plus scolaire que le reste du blog).

### 36. `etre-plus-a-l-aise-en-societe` — Non listé — **P2**

- **a.** 3,5/5.
- **b.** 3,5/5. `sourire comme un commercial en assurance vie` = sympa.
- **c.** 3/5.
- **d.** 3/5. `Pro tip` + `cheat code` = anglicismes répétés. Format globalement bon.
- **e.** **3/5** :
  - **FAUTE de frappe** : `"Ça va, je survais à lundi"` → doit être `"Ça va, je survis à lundi"`.
  - Citation Roman Frayssinet `"Je suis tellement à l'aise socialement que j'arrive à mettre mal à l'aise des gens qui étaient déjà mal à l'aise"` = probablement fabriquée. **À signaler**.
  - Concept "méthode 4-7-8" attribué comme technique de respiration : concept existe (Dr Andrew Weil) mais non attribué. Mineur.
- **Note globale : 3,2/5**
- **Correctifs P0** : corriger la faute `survais → survis`. Vérifier la citation Frayssinet.

### 37. `jeu-de-mots-drole-techniques-creer` — Satellite types-humour listé — **P0**

- **a.** 3,5/5.
- **b.** 3/5.
- **c.** **1,5/5 — FAIL LOURD**. Article **sur les jeux de mots** qui viole massivement la barre §3 sur les calembours phonétiques ("test : si ça s'explique par 'parce que ça sonne comme…', c'est raté"). Exemples :
  - `"films d'action... films d'addiction aux actions"` → calembour phonétique pur.
  - `"no pain, no gain / no pain, no Gaïn"` → calembour phonétique + référence Gainsbourg (datée pour Yanis 20 ans).
  - `"Mon chat a une otite... il entend mal-ou"` (miaou) → calembour phonétique interdit §3.
  - `"Mon WiFi rame... c'est de la connexion bateau"` → calembour "rame/bateau".
  - `"Mon Uber sent bizarre... c'est un VTC-hamel"` → calembour incompréhensible (VTC/vétus/Vétamer ?).
  - `"gastro-nomie / gastro"` → calembour phonétique.
  - `"J'ai des actions qui montent... sur mon escalier"` → double sens FAIBLE.
  - `"pessi-réaliste"` (Pascot) → mot-valise laborieux.
- **d.** 3/5. `beauf` = argot familier, à la limite.
- **e.** **2/5**. Attribution `"C'est un comble pour un chauve d'avoir des cheveux sur la langue !"` à Paul Mirabel = **FAUSSE** (blague populaire ancienne, pas de Mirabel). Attribution Fary `"J'ai des problèmes de boulot... mon patron me gave"` = calembour phonétique + attribution douteuse. `"Just Do It"` cité et détourné = mention du slogan Nike (concurrent implicite / marque tierce).
- **Note globale : 2,0/5 — À REFAIRE INTÉGRALEMENT**. L'article prend l'exact contre-pied de la barre §3 en montrant comme "modèles" des calembours phonétiques que la charte interdit. **Contradiction interne du blog** entre `jeux-de-mots-technique-3-etapes` (article statique) et ce rewrite JSON, qui présentent la même thématique avec des standards opposés.

### 38. `techniques-humoristes-pros` — Non listé — **P2**

- **a.** 4/5.
- **b.** 3,5/5. `écran de veille était le dernier Goncourt` = sympa.
- **c.** 3/5.
- **d.** **2,5/5 — FAIL**. `puis BAM — elle te sort une conclusion` = staccato interdit §5.
- **e.** 3/5. Multiples citations attribuées suspectes : Fary (grand-mère + économies), Blanche Gardin (`"J'adore les enfants... les miens surtout"`), Panayotis Pascot (`"Je suis pas très grand..."`), Waly Dia (`"Fils, dans la vie, il faut toujours viser haut..."`) — toutes non vérifiables, ressemblent à des vannes web attribuées post-hoc.
- **Note globale : 3,0/5**
- **Correctifs** : remplacer `BAM` par "…puis en fin de phrase, elle te sort…". Vérifier ou retirer les attributions incertaines.

---

## Synthèse consolidée

### Répartition finale par note

| Tranche | Nombre d'articles | Slugs |
|---|---|---|
| **≥ 4,0/5** | 2 | `repartie-soiree-anti-malaise`, `humour-apres-rupture` |
| **3,5-3,9/5** | 8 | `jamais-quoi-repondre-techniques`, `storytelling-drole-5-structures`, `conversation-machine-a-cafe`, `rester-muet-en-groupe`, `blagues-travail-faire-rire-pro`, `exercices-developper-humour`, `raconter-blague-sans-massacrer`, `comment-raconter-une-blague-sans-la-rater` (JSON) |
| **3,0-3,4/5** | 11 | `erreurs-blagues`, `autoderision-interactions`, `humour-quotidien-8-habitudes`, `5-types-humour-lequel-pour-toi`, `humour-noir-utiliser-sans-blesser`, `jeux-de-mots-technique-3-etapes`, `timing-humour-ralentir`, `pourquoi-blagues-marchent-pas`, `blagues-courtes-vs-longues`, `confiance-humour-apres-rupture`, `timidite-et-humour`, `repartie-debutant-5-etapes`, `repondre-moqueries-avec-humour`, `etre-plus-a-l-aise-en-societe` (JSON), `techniques-humoristes-pros` (JSON) |
| **2,5-2,9/5** | 6 | `comment-devenir-drole`, `comment-avoir-de-la-repartie`, `timing-humour`, `phrases-droles-conversations`, `comment-faire-rire-une-fille`, `comment-faire-rire-un-homme`, `citation-drole` (JSON), `comment-improviser-des-blagues` (JSON) |
| **< 2,5/5** | 4 | `je-suis-pas-drole-comment-changer` (2,4), `avoir-confiance-en-soi-grace-a-l-humour` (JSON 2,4), `blague-drole-7-criteres-pepite` (JSON 2,3), `blague-courte-arme-secrete-humour` (JSON 2,0), `jeu-de-mots-drole-techniques-creer` (JSON 2,0) |

**Note moyenne globale : 3,15 / 5**
**Articles < 3/5 sur au moins un critère : 17 / 38**

### Violations critiques signalées à Thomas

**NO-GO absolus (à corriger AVANT toute publication) :**

1. **JSON `blague-courte-arme-secrete-humour`** : vanne sexiste et vulgaire `"ma femme me casse les couilles en 4K / en stéréo"` — viole §3 ("jamais vulgaire", "blague qui se moque d'un groupe") et le ton de marque. La vanne est présentée comme MODÈLE de compression pédagogique. NO-GO absolu.
2. **JSON `avoir-confiance-en-soi-grace-a-l-humour`** : deux témoignages ENTIÈREMENT FABRIQUÉS (`Tom, 21 ans, étudiant` + `Léa, 28 ans, cheffe de projet`) — viole §1 bis "zéro invention".
3. **JSON `comment-improviser-des-blagues`** : blague pédagogique sur `asile psychiatrique / camisole de force` — viole §3 "blague qui se moque d'un groupe" (personnes malades mentales).
4. **JSON `jeu-de-mots-drole-techniques-creer`** : la majorité des exemples "pédagogiques" sont des **calembours phonétiques purs**, précisément interdits par §3. Article qui enseigne à faire l'inverse de la barre marque. Contradiction directe avec `jeux-de-mots-technique-3-etapes` (article statique) sur la même thématique.

**Chiffres/études douteux à vérifier (§1 fondateur : on garde, on signale)** :
- `je-suis-pas-drole-comment-changer` : "76% des gens pensent ne pas être drôles / Université du Colorado" + "Roman Frayssinet 70% de réussite sur scène".
- `blagues-travail-faire-rire-pro` : "leaders 23% plus compétents / 25% plus appréciés" (Stanford) + "étude Université de Pennsylvanie".
- `jamais-quoi-repondre-techniques` : "65% des gens avec blanc conversationnel".
- `avoir-confiance-en-soi-grace-a-l-humour` (JSON) : "Université de Stanford / 40% plus élevée".
- `blague-courte-arme-secrete-humour` (JSON) : "Stanford / blagues < 15 mots retenues 3× plus longtemps".
- `rester-muet-en-groupe` : "Mark Leary / hyper-monitoring social" (Leary existe, terme à confirmer).
- `storytelling-drole-5-structures` : "structure 70% / contenu 30%".

**Citations attribuées suspectes (§1 bis : à vérifier ou reformuler)** :
- Blanche Gardin "Mon psy m'a dit que j'avais fait des progrès..." (dans #8 et #9) — sketch fabriqué probable.
- Paul Mirabel "Une bonne blague, c'est comme un bon café. Si c'est trop long, ça devient amer." (JSON #2).
- Paul Mirabel "C'est un comble pour un chauve d'avoir des cheveux sur la langue !" (JSON #8) — vieille blague populaire, PAS de Mirabel.
- Roman Frayssinet "L'humour, c'est pas être parfait — c'est être humain, mais en version améliorée." (JSON #1).
- Roman Frayssinet "Je suis tellement à l'aise socialement que j'arrive à mettre mal à l'aise…" (JSON #7).
- Panayotis Pascot "Une vanne courte, c'est de l'artillerie lourde." (JSON #2).
- Fary "L'humour, c'est la seule chose sérieuse dans la vie." (JSON #4, JSON #5) — proche de citations Coluche/Twain.
- Waly Dia "L'autodérision, c'est quand tu peux te voir de l'extérieur. Pas quand tu te martyrises en public." (#25).
- Toutes les citations attribuées dans JSON `blague-drole-7-criteres-pepite`.

### Incohérences de refonte

Articles statiques **sans `updatedAt: "2026-09-29"`** — ils n'ont probablement PAS été relus dans la refonte s11 :

- `jeux-de-mots-technique-3-etapes`
- `timing-humour-ralentir`
- `raconter-blague-sans-massacrer`
- `humour-apres-rupture`
- `blagues-courtes-vs-longues`

Sur 30 articles statiques, **5 sont marqués comme non-relus** — soit **~17%** du corpus statique. Combiné avec les 9 rewrites JSON qui portent des marques massives de génération IA à l'ancienne (staccato triplets, témoignages fabriqués, citations attribuées à la volée), cela confirme le doute exprimé par le fondateur : **la refonte n'a pas été appliquée uniformément**.

### Répétitions inter-articles (à harmoniser)

- **Trope "mon corps m'a envoyé un [X]"** : `lettre de démission` (comment-devenir-drole) + `mail de rupture` (raconter-blague-sans-massacrer) + `motion de censure` (humour-quotidien-8-habitudes) + `déposé une main courante` (comment-avoir-de-la-repartie). Choisir 1 emplacement, retravailler les 3 autres.
- **"Comme les pompiers me connaissent"** : `autoderision-interactions` + `phrases-droles-conversations` #26.
- **"Cette réunion / testament"** : `5-types-humour-lequel-pour-toi` + `humour-noir-utiliser-sans-blesser` + `citation-drole` (JSON) sous forme "meeting aurait pu être un mail".
- **"Je l'ai enterré ce matin. Il y avait un croissant."** : `5-types-humour` + `humour-noir`.
- **Métaphore "disséquer papillon/grenouille"** : `comment-devenir-drole` + `erreurs-blagues`.
- **"Le DJ joue du reggaeton comme si c'était une urgence médicale"** : `comment-faire-rire-une-fille` + `comment-faire-rire-un-homme`.
- **"Le serveur nous ignore tellement qu'on pourrait braquer la caisse"** : idem doublon fille/homme.

---

## Top 10 des articles à retravailler EN PRIORITÉ (récap SEO + gravité)

| Rang | Article | Note | Motif principal | Priorité |
|---|---|---|---|---|
| 1 | JSON `blague-courte-arme-secrete-humour` | 2,0 | Vanne sexiste/vulgaire + staccato + citations suspectes ; satellite listé humour-contexte | **P0 top absolu** |
| 2 | JSON `jeu-de-mots-drole-techniques-creer` | 2,0 | Article "pédagogique" qui viole massivement la barre §3 (calembours phonétiques) ; satellite listé types-humour | **P0 top absolu** |
| 3 | JSON `avoir-confiance-en-soi-grace-a-l-humour` | 2,4 | Témoignages fabriqués + staccato ; cluster douleurs-personas | **P0** |
| 4 | `je-suis-pas-drole-comment-changer` | 2,4 | Pilier douleurs-personas + vannes plates + chiffres douteux non sourcés | **P0** |
| 5 | JSON `comment-improviser-des-blagues` | 2,5 | Blague sur asile psy + concurrent nommé + citations suspectes | **P0** |
| 6 | JSON `citation-drole` | 2,6 | 40 "citations" majoritairement fabriquées ; référence 2024 datée en 2026 | **P1** |
| 7 | `phrases-droles-conversations` | 2,6 | Fort volume SEO + 7 vannes en dessous de la barre §3 + SEO stuffing | **P0** |
| 8 | `comment-devenir-drole` | 2,8 | Pilier apprendre-humour + staccato BOOM + vannes rebattues | **P0** |
| 9 | `comment-avoir-de-la-repartie` | 2,8 | Pilier techniques-repartie + 5 vannes faibles | **P0** |
| 10 | `timing-humour` | 2,8 | Pilier techniques-delivery + staccato PAF | **P0** |

---

## Verdict final

**La refonte copy s11 a été appliquée en surface sur environ 25/38 articles, à un niveau insuffisant sur 8-10 articles, et pas du tout sur les 9 réécritures JSON.** Ces dernières portent les marques d'une **génération IA antérieure** non alignée sur la charte (staccato triplets, témoignages fabriqués, citations attribuées à la volée, une vanne sexiste utilisée comme modèle pédagogique, calembours phonétiques présentés comme techniques nobles).

**Pour un fondateur qui vise la page n°1 SEO sur "devenir drôle" et "avoir de la répartie", exposer aujourd'hui les articles piliers (`je-suis-pas-drole-comment-changer`, `comment-devenir-drole`, `timing-humour`, `comment-avoir-de-la-repartie`) et surtout les rewrites JSON (`blague-courte-arme-secrete-humour`, `jeu-de-mots-drole-techniques-creer`) est un risque marque direct**. Le doute du fondateur sur le sérieux de la relecture est justifié — et sous-estimait même l'ampleur du problème sur la base JSON.

**Recommandation immédiate** :
1. **Bloquer la publication** des 4 rewrites JSON en violation §3/§1 bis (fiches 30, 31, 34, 37) tant que corrigés.
2. Corriger les 4 piliers SEO (fiches 1, 2, 3, 17) en priorité — impact SEO direct.
3. Uniformiser la présence d'`updatedAt` sur les 5 articles statiques oubliés (fiches 10, 12, 13, 25 + `blagues-courtes-vs-longues`).
4. Établir un tableau des chiffres/études cités pour Thomas (13 chiffres/citations à vérifier ou reformuler).
5. Harmoniser les 7 trope-métaphores répétées à travers le blog (voir section "Répétitions inter-articles").

---

**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/copy/audit-independant-blog-s11.md`
- Décision proposée : **NO-GO publication actuelle** sur 4 rewrites JSON (fiches 30, 31, 34, 37) + **REVUE OBLIGATOIRE** sur 6 autres articles P0 (fiches 1, 2, 3, 4, 14, 17). Le reste du blog est publiable en l'état avec suivi.
- Points d'attention :
  - **1 vanne sexiste et vulgaire** en modèle pédagogique dans un rewrite JSON — NO-GO immédiat.
  - **2 témoignages entièrement fabriqués** dans un rewrite JSON — NO-GO §1 bis.
  - **1 blague sur asile psychiatrique** en démo pédagogique — NO-GO §3.
  - **1 article "jeux de mots"** qui viole toute la barre §3 sur les calembours phonétiques.
  - **13 chiffres/études douteux** à faire trancher par Thomas (garder tel quel ou reformuler sans supprimer).
  - **5 articles statiques oubliés** par la refonte (manque `updatedAt`).
  - Agents à réinvoquer : **@copywriter** (correctif complet sur 10 articles P0) + **@reviewer** (2e passe après corrections).
---


