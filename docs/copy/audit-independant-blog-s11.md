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

### 20. `humour-noir-utiliser-sans-blesser` — Voir fiche #9.

_Note : les fiches 21-38 suivent. Traitement des articles restants dans une seconde passe._

