# Application des corrections de l'audit des articles du code (s20, 12/10)

Source de vérité pour @fullstack. Tout ce qui est listé ici a été validé à l'aveugle (3 relecteurs, 2 sur 3) ou est mécanique.

## 1. Partie 1 (`docs/copy/corrections-audit-code-s20-partie-1.md`)
- Tour 1 : appliquer les passages A validés = tous SAUF A7, A23, A25, A32, A35, A45, A53 (remplacés par leurs versions tour 2, §9 du même fichier).
- Tour 2 (§9) : appliquer tous les passages AA (dont intertitres « Exemple 1/2/3… » et H2 « 3 exemples décortiqués », ancre `3-exemples-decortiques`), SAUF AA10 remplacé par le texte final C1 ci-dessous.
- Corrections mécaniques de la partie 1 (pauses, ancres, coquille) : appliquer.

## 2. Partie 2 (`docs/copy/corrections-audit-code-s20-partie-2.md`)
- Tour 1 : appliquer les passages B validés = tous SAUF B14, B16, B24, B28, B33, B38, B41, B42, B50, B52, B53, B54, B59, B67 (remplacés par leurs versions tour 2, §9). B60 et B64 VALIDÉS (Aaker vérifié : NPR).
- Tour 2 (§9) : appliquer tous les passages BB, SAUF BB5 et BB15 remplacés par C2 et C3 ci-dessous.
- Corrections mécaniques de la partie 2 : appliquer.

## 3. Textes finaux (tour 3, confirmés à l'aveugle)
- **C1 (remplace AA10)** : `Imagine une séance de thérapie racontée sans filtre : "Mon psy m'a dit que j'avais fait d'énormes progrès. Il veut qu'on se voie deux fois par semaine pour les consolider." La cible, c'est le système : personne n'est blessé, et tout le monde rit.`
- **C2 (remplace BB5)** : phrase du corps `La solution tient en trois réflexes : avoir quelques phrases prêtes à l'emploi, répondre sans trop réfléchir et poser des questions.` ; dernière phrase de la réponse FAQ : `Avec de la pratique, les blancs se font plus rares.` (au lieu de « En 2 semaines, les blancs se raréfient nettement. »). Le reste de BB5 (plan d'action, FAQ) tel que proposé au tour 2.
- **C3 (remplace BB15)** : phrase précédente `En stand-up, la chute est **en général plus courte** que l'amorce.` (au lieu de « toujours plus courte ») ; passage `Une chute qui s'éternise, c'est un public qui regarde son téléphone.` (remplace « Le public décroche au mot 8 / avant la fin d'une punchline trop longue »).

## 4. Mécanique décidée par Thomas (règle 4)
- Tirets cadratins des intertitres H2/H3 des articles servis : « — » → « : » (ou « , » si « : » est déjà présent dans l'intertitre). Slugs, title, H1 intouchés. Vérifier et mettre à jour les ancres de sommaire générées depuis les intertitres.

## 5. Résultat (application @fullstack, 12/10/2026)

Appliqué dans `apps/web/src/lib/blog-articles.ts` par script : paires avant / après extraites des documents (partie 1 §4 et §9, partie 2 §4 et §9, C1 à C3 de ce fichier), remplacement exact, chaque « avant » vérifié présent exactement une fois avant application et au moment de l'application. **166 remplacements appliqués, 0 refusé** (partie 1 : 74 ; partie 2 et textes finaux : 92), puis 49 intertitres passés à la règle 4. Pas de commit, pas de déploiement.

**Lecture des consignes retenue** (sans écart avec ce fichier) :
- PD6 (A45) : la phrase n°18 du tour 1 (« Mon four est comme neuf ») est appliquée avec la ligne de contexte du tour 2, comme l'écrit le §9 de la partie 1 (« la phrase n°18 reste celle du tour 1 »).
- 6.3 : b, c, d (B6) et e (« inchangé par rapport au tour 1 ») au tour 1 ; a = phrase C2 ; f = tour 2 ; fin de la réponse FAQ = phrase C2. 12.5 : a au tour 1, b et c au tour 2.
- C3 : avant = celui de 12.10 ; « **toujours plus courte** » devient la phrase C3 « **en général plus courte** », « **Le public décroche au mot 8** d'une punchline trop longue. » devient « Une chute qui s'éternise, c'est un public qui regarde son téléphone. ». La phrase « 12 mots / 25 mots » entre les deux est inchangée.
- Règle 4 : « — » devient « : », ou « , » quand l'intertitre contient déjà « : » (casse du mot suivant inchangée, aucun mot touché). Articles servis = tous les statiques sauf les 5 sources de redirection de `seo-redirects.data.cjs` (aucun intertitre à tiret n'y figurait).

**Ancres** : `headingId()` (`markdown-renderer.tsx`) ne pose un `id` que sur les H2 et traite « — », « : » et « , » de la même façon (séparateur `-`) : la règle 4 ne déplace aucune ancre. Deux ancres changent, sans aucun lien qui les vise (Grep du dépôt) : `humour-noir-utiliser-sans-blesser` `#3-sketches-decortiques` → `#3-exemples-decortiques` ; `jamais-quoi-repondre-techniques` `#technique-2-la-regle-des-3-secondes-reponds-avant-de-reflechir` → `#technique-2-reponds-sans-trop-reflechir`. Les ancres internes (sommaire de `meilleures-blagues-droles-2026`) sont toutes résolues (test).

### 5.1 Mesure du diff réel (P0 s11, par script)

Mots = suite de mots du contenu et des réponses de FAQ (même découpage que `blog-fingerprint.ts`) ; « mots changés » = mots de l'ancien texte remplacés ou supprimés (alignement difflib), rapportés aux mots d'avant. `updatedAt` passé au 2026-10-12 pour ces 24 articles (3 l'étaient déjà).

| Article | Passages | Mots avant | Mots après | Mots changés | % changé | H2/H3 modifiés | Réponses FAQ modifiées | Liens modifiés |
|---|---|---|---|---|---|---|---|---|
| `5-types-humour-lequel-pour-toi` | 9 | 1527 | 1529 | 99 | 6.5 % | 5 | 1 (3) | 0 |
| `blagues-travail-faire-rire-pro` | 6 | 1822 | 1851 | 86 | 4.7 % | 4 | 1 (2) | 0 |
| `comment-avoir-de-la-repartie` | 3 | 1615 | 1618 | 30 | 1.9 % | 0 | 0 (-) | 0 |
| `comment-devenir-drole` | 6 | 1849 | 1821 | 114 | 6.2 % | 5 | 1 (2) | `[Timing humour : plus fort que la blague](/blog/timing-humour)` → `[Timing humour : le secret de la blague](/blog/timing-humour)` |
| `comment-faire-rire-un-homme` | 5 | 1435 | 1478 | 78 | 5.4 % | 4 | 1 (2) | `[Nos techniques de répartie](/conseils)` → `[Nos conseils d'humour](/conseils)` |
| `comment-faire-rire-une-fille` | 6 | 1341 | 1367 | 31 | 2.3 % | 4 | 0 (-) | 0 |
| `confiance-humour-apres-rupture` | 5 | 2025 | 2017 | 16 | 0.8 % | 0 | 0 (-) | 0 |
| `conversation-machine-a-cafe` | 3 | 1812 | 1821 | 27 | 1.5 % | 5 | 1 (4) | 0 |
| `erreurs-blagues` | 3 | 1017 | 1006 | 26 | 2.6 % | 0 | 0 (-) | `[Timing humour : plus fort que la blague](/blog/timing-humour)` → `[Timing humour : le secret de la blague](/blog/timing-humour)` |
| `exercices-developper-humour` | 6 | 1257 | 1271 | 35 | 2.8 % | 0 | 1 (4) | 0 |
| `humour-noir-utiliser-sans-blesser` | 10 | 1153 | 1205 | 91 | 7.9 % | 4 | 0 (-) | 0 |
| `humour-quotidien-8-habitudes` | 7 | 1185 | 1209 | 65 | 5.5 % | 0 | 1 (4) | 0 |
| `jamais-quoi-repondre-techniques` | 14 | 1731 | 1711 | 132 | 7.6 % | 5 | 2 (3, 4) | 0 |
| `je-suis-pas-drole-comment-changer` | 8 | 1799 | 1767 | 87 | 4.8 % | 0 | 0 (-) | 0 |
| `meilleures-blagues-droles-2026` | 2 | 2555 | 2554 | 8 | 0.3 % | 0 | 0 (-) | 0 |
| `phrases-droles-conversations` | 11 | 2154 | 2244 | 85 | 3.9 % | 0 | 1 (3) | 0 |
| `pourquoi-blagues-marchent-pas` | 14 | 2040 | 2065 | 110 | 5.4 % | 1 | 2 (2, 4) | 0 |
| `repartie-debutant-5-etapes` | 7 | 1108 | 1099 | 83 | 7.5 % | 2 | 0 (-) | 0 |
| `repartie-soiree-anti-malaise` | 7 | 1857 | 1843 | 77 | 4.1 % | 2 | 1 (1) | 0 |
| `repondre-moqueries-avec-humour` | 4 | 1602 | 1599 | 29 | 1.8 % | 6 | 0 (-) | 0 |
| `rester-muet-en-groupe` | 8 | 2747 | 2771 | 103 | 3.7 % | 3 | 3 (1, 3, 5) | 0 |
| `storytelling-drole-5-structures` | 5 | 2497 | 2512 | 27 | 1.1 % | 0 | 0 (-) | `[parcours](/parcours)` → `[Parcours Storytelling](/parcours/storytelling)` |
| `timidite-et-humour` | 7 | 2198 | 2199 | 63 | 2.9 % | 4 | 2 (1, 5) | `[techniques de storytelling](/blog/comment-devenir-drole)` → `[techniques de storytelling](/blog/storytelling-drole-5-structures)` |
| `timing-humour` | 10 | 1290 | 1335 | 62 | 4.8 % | 0 | 1 (2) | 0 |
| **Total** | **166** | **41616** | **41892** | **1564** | **3.8 %** | **54** | **19** | **5** |

**Intouchables vérifiés par script** : slugs, title (= H1), excerpt, date, readingTime, catégorie, questions de FAQ et prix identiques pour les 24 articles. Liens : 5 modifiés, aucun supprimé ni ajouté (2 textes d'ancre PI4/ER3, 1 libellé 2.5, 2 URL 7.7 et 8.5, cibles existantes).

### 5.2 Intertitres modifiés (54)

Hors règle 4 (5) : `humour-noir-utiliser-sans-blesser` « 3 sketches décortiqués » → « 3 exemples décortiqués », « Sketch 1/2/3 » → « Exemple 1, dans la veine de Blanche Gardin : la thérapie… », « Exemple 2, dans la veine de Waly Dia : les clichés racistes… », « Exemple 3 : quand ça ne marche PAS… » ; `jamais-quoi-repondre-techniques` « Technique 2 : La règle des 3 secondes — Réponds avant de réfléchir » → « Technique 2 : Réponds sans trop réfléchir ».

Règle 4 (49) :
- `comment-devenir-drole` :
  - `### Pilier 1 : L'observation, Voir ce que les autres ignorent`
  - `### Pilier 2 : La surprise, L'art du virage inattendu`
  - `### Pilier 3 : Le timing, Le silence qui vaut de l'or`
  - `### Pilier 4 : L'autodérision, Rire de soi sans se démolir`
  - `### Pilier 5 : La pratique, Le seul vrai secret`
- `repartie-debutant-5-etapes` :
  - `## Étape 2 : Le filet de sécurité, 3 phrases prêtes`
  - `## Étape 3 : L'écoute active, Ton arme secrète`
- `5-types-humour-lequel-pour-toi` :
  - `## Type 1 : L'observationnel, "C'est tellement vrai"`
  - `## Type 2 : L'autodérision, "Je suis un désastre (et j'assume)"`
  - `## Type 3 : L'absurde, "Ça n'a aucun sens (et c'est ça qui est drôle)"`
  - `## Type 4 : Les jeux de mots, "Tu l'as ? Tu l'as ?"`
  - `## Type 5 : L'humour noir, "Trop loin ? Pas assez loin."`
- `comment-faire-rire-une-fille` :
  - `## 2. L'observation partagée : "Tu vois le truc aussi ?"`
  - `## 3. L'effet de surprise : Le virage que personne voit venir`
  - `## 5. L'exagération stratégique : Le curseur poussé à fond`
  - `## 6. Le silence qui parle : Ne pas tout remplir`
- `comment-faire-rire-un-homme` :
  - `## 2. L'humour décalé : Dire le truc que personne attendait`
  - `## 3. Les références partagées : Le ciment du rire complice`
  - `## 4. L'autodérision cool : Pas fragile, juste lucide`
  - `## 6. Le timing de la punchline : Dire moins, pas plus`
- `repondre-moqueries-avec-humour` :
  - `## Technique 1 : L'accord exagéré, "Oui, et c'est encore pire"`
  - `## Technique 2 : Le rebond sur mot-clé, Retourne ses propres mots`
  - `## Technique 3 : Le compliment inversé, "Merci, c'est adorable"`
  - `## Technique 4 : La question Colombo, "Ah bon ? Explique-moi"`
  - `## Technique 5 : Le callback, Reviens-y 20 minutes plus tard`
  - `## Technique 6 : Le silence + sourire, L'arme nucléaire`
- `blagues-travail-faire-rire-pro` :
  - `## Zone 1 : La machine à café, Le terrain d'entraînement`
  - `## Zone 2 : La réunion, L'art du timing chirurgical`
  - `## Zone 3 : L'afterwork, Le terrain miné`
  - `## Zone 4 : Les emails et Slack, L'humour écrit au bureau`
- `jamais-quoi-repondre-techniques` :
  - `### Le "freeze social" : ton cerveau te protège`
  - `## Technique 1 : Les 5 réponses automatiques, Ton kit de survie`
  - `## Technique 4 : Le rebond sur le dernier mot, La technique du perroquet intelligent`
  - `## Technique 5 : La "banque de sujets", Ne pars plus les mains vides`
- `timidite-et-humour` :
  - `## Clé 2 : L'humour écrit d'abord, ta zone d'entraînement`
  - `## Clé 3 : L'effet de surprise, quand un timide parle, tout le monde écoute`
  - `## Clé 4 : L'autodérision légère, ta timidité devient matière comique`
  - `## Clé 5 : La progression par paliers, du petit groupe au grand groupe`
- `conversation-machine-a-cafe` :
  - `## Le lundi matin : comment briser la glace avec un zombie`
  - `## Le nouveau collègue : l'intégrer sans être awkward`
  - `## Face au boss : l'humour hiérarchique et ses règles`
  - `## Le crush du 3ème étage : flirter subtilement à la machine à café`
  - `## Le silence gênant entre inconnus : la technique du sauvetage`
- `repartie-soiree-anti-malaise` :
  - `## Situation 3 : Tu rejoins un groupe déjà lancé, et tu ne sais pas comment t'insérer`
  - `## Situation 4 : Il y a un malaise généralisé, sujet glissant, blague ratée de quelqu'un d'autre`
- `pourquoi-blagues-marchent-pas` :
  - `### Raison 2 : Le timing, le tueur silencieux n°2`
- `rester-muet-en-groupe` :
  - `### Niveau 1 : La micro-interaction (caissier, livreur, voisin)`
  - `### Niveau 2 : Le groupe de confiance (3-4 personnes que tu connais bien)`
  - `### Niveau 3 : Le groupe ouvert (soirée, dîner, afterwork élargi)`

**Tests** : `blog-audit-code-s20.test.ts` (aucun « avant » restant, chaque « après » présent, zéro « — » dans les H2/H3 servis, ancres résolues, `updatedAt`) avec sa fixture extraite par script ; baseline `blog-em-dash-baseline.json` recalculée pour les 24 articles (une entrée `rebaselines` chacun) ; `liens-pilier-s15` et `pilier-haut-de-page-s15` alignés (updatedAt 2026-10-12, 0 tiret dans le pilier).
