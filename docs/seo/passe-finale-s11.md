# Passe SEO finale — s11 — 29/09/2026

**Agent :** @seo — worktree `wt-seo` (code `apps/web`) — non commité.
**Règles appliquées :** aucun slug/URL/titre d'article modifié, aucun chiffre retiré, années conservées, zéro mention d'IA dans le contenu public, pas de « coach » pour la marque.

## 1. Métadonnées des pages (title / description)

Rappel : le layout applique le template `%s | deviens-marrant.fr` (+20 car.). Longueurs = title **rendu** ; descriptions calculées avec les compteurs prod (600+ vannes / 400+ conseils / 80+ vidéos).

### 1.1 Bug corrigé — titres tronqués en « ... » (pages dynamiques)

Blog, conseils, vidéos et vannes coupaient le titre à 36 car. + `...`. Constaté en prod le 29/09 :
`Comment raconter une blague sans la ... | deviens-marrant.fr`, `Citation drôle : 40 perles à ressort... | deviens-marrant.fr`, etc. Le title ne correspondait plus au H1 (exact-match perdu pour Bing) et le mot-clé était coupé.

Correctif : nouveau helper `apps/web/src/lib/seo-meta.ts` (`fitTitle`, `fitDescription`, `truncateAtWord`, `stripMarkdown`) :
- titre + marque ≤ 60 → template avec marque ;
- sinon titre seul (`absolute`) = H1 exact ;
- > 60 → coupe propre à la frontière de mot (jamais au milieu du mot-clé de tête).
Descriptions dynamiques : coupe en fin de phrase (≥ 110 car.) sinon au mot + « … », Markdown retiré.
Même helper branché sur le générateur d'articles (`lib/ai/agents/seo-blog-agent.ts`, étape 4c) : `metaDescription` > 155 et `metaTitle` > 60 étaient coupés en `slice(…)+"..."` au milieu d'un mot ; désormais `fitDescription(…, 155)` / `truncateAtWord(…, 60)`.

| Page | Avant | Après |
|---|---|---|
| `/blog/[slug]` | `article.title.slice(0,36)+"..."` | `fitTitle(article.title)` — ex. « Comment faire rire une fille : 7 techniques » (43, absolute) ; description `fitDescription(excerpt)` (OG/Twitter alignés) |
| `/conseils/[slug]` | idem + description `content.slice(0,155)` coupée en plein mot | `fitTitle(tip.title)` + `fitDescription(content)` ; si < 110 car., complétée par « Avec un exemple concret à décortiquer et un exercice à tester dès ce soir. » |
| `/videos/[slug]` | idem + `"${channel} — ${desc}".slice(0,155)` | `fitTitle(video.title)` (titre YouTube intact) + `fitDescription` ; si < 110 car., + « La technique à retenir : {technique}. » |
| `/vannes/[slug]` | title = 36 premiers car. de la vanne + `...` ; description « … Découvre la chute et 300+ autres vannes… » tronquée à 155 | title `Vanne {catégorie} : {début de la vanne…}` (≤ 60, mot-clé en tête, absolute) ; description `Vanne {catégorie} à ressortir : {début…} La chute est sur la page, avec 300+ autres vannes par situation.` (≤ 160, « 300+ » conservé tel quel, voir §6/§8) |
| `/parcours/[slug]` (parcours DB hors des 3 canoniques) | `${title} — deviens-marrant.fr` + template = marque en double | `fitTitle(title)` + `fitDescription` |

### 1.2 Pages statiques

| Page | Title avant → après (rendu) | Description avant → après |
|---|---|---|
| Layout (défaut) | inchangé (58) | 129 car. « …Vannes, techniques de pro et parcours pas à pas. » → **157** « La plateforme pour devenir drôle et avoir de la répartie : des vannes à ressortir, des techniques de pro et des parcours pas à pas pour faire rire tes potes. » (OG 150 / Twitter 155 alignés) |
| `/` | « Deviens drôle et améliore ta répartie » (57) → **« Devenir drôle et avoir de la répartie »** (57) — exact-match des 2 requêtes cibles (Bing) | 164, liste de chiffres en fin → **158** « Devenir drôle, ça s'apprend : 600+ vannes à ressortir, 400+ conseils de répartie et 80+ vidéos de stand-up décortiquées pour sortir la bonne réplique à temps. » |
| `/vannes` | inchangé (58) | staccato « Tape pour la chute. » + promesse « testées » → **153** « 600+ vannes classées par situation (soirée, boulot, couple, école), chacune avec sa chute et son décryptage pour que tu saches la replacer au bon moment. » |
| `/conseils` | inchangé (59) | « tu lis, tu testes, tu progresses » → **147** « 400+ techniques de répartie et d'humour (timing, autodérision, storytelling), chacune avec un exemple, un dialogue et un défi à tester dès ce soir. » |
| `/videos` | inchangé (58) | « Tu regardes, tu comprends, tu reproduis. » → **149** « 80+ vidéos de stand-up de Fary, Paul Mirabel ou Blanche Gardin décortiquées technique par technique, avec un défi concret pour réutiliser le procédé. » |
| `/blog` | inchangé (54) | fragment « Techniques de stand-up, analyses… » → **159** « Le blog qui t'apprend l'humour en te faisant rire : techniques de stand-up, répartie, analyses d'humoristes et exercices à tester. Si tu souris pas, on a raté. » |
| `/parcours` | inchangé (57) | 173, « Tu t'inscris, tu progresses. » → **159** « 3 parcours pour devenir drôle (Machine à Café, Répartie, Confiance) : 15 à 20 min/semaine selon le parcours, des exercices concrets et de l'XP pour progresser. » |
| `/parcours/machine-a-cafe` | « Parcours Machine à Café — drôle au bureau » (**61**) → **« Drôle au bureau : parcours Machine à Café »** (41, sans marque) | 133, staccato → **156** « Des vannes et des anecdotes à ressortir à la machine à café, en réunion ou en afterwork : 3 semaines à 15 min/semaine pour devenir le collègue qu'on écoute. » |
| `/parcours/repartie` | « Parcours Répartie — réponse prête » (53) → **« Avoir de la répartie : le parcours guidé »** (60) | 115 → **153** « Développe ta répartie en 4 semaines avec des exercices concrets et progressifs, pour arrêter de rester muet quand on te chambre en soirée ou entre potes. » |
| `/parcours/confiance` | « Parcours Confiance — retrouve ta légèreté » (**61**) → **« Retrouver confiance grâce à l'humour »** (56) | 118, staccato « Bienveillant, progressif… » → **156** « 6 semaines pour retrouver confiance en soi grâce à l'humour, à ton rythme et sans pression : on remet de la légèreté dans tes échanges, une étape à la fois. » |
| `/anatomie-vanne` | « Anatomie d'une vanne : setup, pivot et punchline » (**68**) → même texte en `absolute` (**48**) | 147, fragment « Avec exemples concrets… » → **151** « Setup, pivot et punchline : décortique les 3 composants d'une blague qui fait rire, avec des exemples concrets de Paul Mirabel, Fary et Blanche Gardin. » ; OG « Setup → Pivot → Punchline. » → « Setup, pivot, punchline : comprends pourquoi… » |
| `/a-propos` | inchangé (54) | 158 (fragment « Objectif : … ») → **157** « L'humour, ça s'apprend : on a créé deviens-marrant.fr pour le prouver, avec des vannes, des techniques de répartie et du stand-up décortiqué pour faire rire. » |
| `/cgu` | inchangé | 114 → **155** (sections réelles : compte, offres et tarifs, rétractation, résiliation, PI, responsabilité) |
| `/confidentialite` | inchangé | 117 → **159** (données, finalités, base légale, cookies, conservation, droits RGPD) |
| `/mentions-legales` | inchangé | 109 → **151** (éditeur, hébergement, PI, crédits, contact) |
| `/glossaire` | inchangé (53) | 146, « one-liner... » + fragment « 12 termes expliqués avec exemples concrets. » → **152** « Punchline, timing, callback, one-liner : le dico de l'humour qui explique 12 termes clés des pros, chacun avec un exemple concret pour bien le replacer. » |
| `/quiz-humour` | inchangé (53) | 149, fragment « Quiz gratuit inspiré… » → **146** « Observateur, Storyteller, Absurde, Punchlineur ou Taquin ? Ce quiz gratuit inspiré du stand-up te dit en 2 minutes quel type d'humour est le tien. » |
| `/abonnement`, `/retractation` | inchangés (≤ 60) | inchangées (144 / 148) — conformes |
| Pages `noindex` (auth, profil, favoris, admin) | inchangées | inchangées (hors index, sans enjeu) |

Parcours : les 3 pages gardent leur nom visible « Parcours X » via un nouveau champ `name` dans `PARCOURS_META` (fil d'Ariane JSON-LD + schéma `Course`) ; seul le `<title>` porte le mot-clé en tête. Pages légales : vouvoiement conservé (registre du corps des pages).

## 2. Blog — excerpts / metaDescription

Aucun slug, aucun titre d'article modifié. Tous les chiffres des anciens excerpts sont conservés (2h, 10 minutes, 30 secondes, 30 jours, 90 secondes, huit minutes, 20 minutes, 33, etc.).

### 2.1 Articles statiques (`apps/web/src/lib/blog-articles.ts`) — 24 excerpts réécrits → tous entre 140 et 160 car.

L'excerpt sert à la fois de meta description, d'OG, de carte sur `/blog` et de résumé dans `llms.txt`. Défauts corrigés : longueur (95 à 184 car. avant), staccato (« Le silence. Même pas un sourire poli. »), mot-clé absent ou tardif.

| Slug | Avant (car.) | Après (car.) — texte |
|---|---|---|
| comment-devenir-drole | 137, staccato « L'oncle a tort. » | 159 — « Devenir drôle, ça s'apprend, n'en déplaise à l'oncle qui répète « t'es drôle ou tu l'es pas » : les 5 piliers, ce qu'en dit la science et un plan sur 30 jours. » |
| comment-avoir-de-la-repartie | 171 | 157 — « Avoir de la répartie, c'est trouver la réplique sur le moment, pas sous la douche 2h après : 10 techniques concrètes pour y arriver, en soirée comme au bureau. » |
| timing-humour | 146, 6 phrases hachées | 155 — « Ton pote raconte ta blague mot pour mot 10 minutes plus tard et fait exploser la table ? C'est le timing en humour, et ça se travaille avec les bons silences. » |
| erreurs-blagues | 167, staccato | 157 — « Ta blague n'a même pas eu droit au sourire poli ? Le problème vient rarement de la blague : voici les 5 erreurs qui tuent tes blagues et comment les corriger. » |
| autoderision-interactions | 176 | 153 — « L'autodérision bien dosée te rend sympathique en 30 secondes, mal dosée elle fait fuir : le guide pour rire de toi sans te démolir, règles d'or incluses. » |
| repartie-debutant-5-etapes | 150, « Aucun problème. » | 151 — « Ta meilleure répartie, c'est « euh… toi-même » ? Répartie pour débutant : 5 étapes progressives pour débloquer ta tchatche, sans talent naturel requis. » |
| humour-quotidien-8-habitudes | 181 | 148 — « L'humour au quotidien tient à 8 habitudes simples : prends-en une ou deux, tiens-les 30 jours, et ton cerveau cherchera l'angle drôle tout seul. » |
| 5-types-humour-lequel-pour-toi | 157 (fragment final) | 155 — « Il y a l'humour de Roman Frayssinet, celui de Paul Mirabel, celui de Blanche Gardin, et puis le tien : explore les 5 types d'humour pour trouver ton style. » |
| humour-noir-utiliser-sans-blesser | 169 | 154 — « L'humour noir peut faire rire toute une table ou vider la pièce avec la même phrase : tout se joue sur le contexte. Les règles pour l'utiliser sans blesser. » |
| exercices-developper-humour | 142, « tu lis, tu essaies, tu progresses » | 160 — « 10 exercices concrets pour développer ton humour, de 5 à 20 min selon ton niveau : pas de théorie, juste de quoi t'entraîner du débutant au confirmé, pas à pas. » |
| phrases-droles-conversations | 161 | 160 — « 33 phrases drôles prêtes à ressortir à la machine à café, en soirée, en date ou en réunion : les gens drôles ont surtout un arsenal bien rodé, et voilà le tien. » (voir §6 : 30 vs 33) |
| **meilleures-blagues-droles-2026** | 135 | **inchangé** — page n°1 SEO, meta description déclarée « intacte » dans `docs/copy/page-n1-blagues-2026-avant-apres.md` validé par Thomas. À rallonger (135 < 140) seulement sur GO. |
| comment-faire-rire-une-fille | 151 | 159 — « Pour faire rire une fille, arrête d'abord de chercher à être drôle. Ça paraît idiot, et pourtant : 7 techniques qui marchent en soirée, en date ou par message. » |
| comment-faire-rire-un-homme | 163, « Pas 'pour une fille' — juste drôles. » | 160 — « Faire rire un homme ne demande pas un humour spécial : chambrage léger, réponse décalée, autodérision… 6 techniques sans cliché, qui marchent sur tout le monde. » |
| je-suis-pas-drole-comment-changer | 128 | 152 — « Tu te dis « je suis pas drôle » ? Tu te trompes sûrement : l'humour s'entraîne, et tu as déjà la matière première. 7 pistes concrètes pour le débloquer. » |
| repondre-moqueries-avec-humour | 127 | 160 — « Quand on te chambre, ton cerveau fait Ctrl+Alt+Suppr ? Répondre aux moqueries avec humour tient à quelques réflexes : 6 techniques pour ne plus rester muet. » |
| blagues-travail-faire-rire-pro | 104 | 155 — « Machine à café, réunion, afterwork, Slack : comment placer une blague au travail sans risquer ta réputation pro, en visant la situation et jamais les gens. » |
| jamais-quoi-repondre-techniques | 118 | 146 — « Tu sais jamais quoi répondre et le blanc s'installe pendant que tu cherches tes mots ? Ça s'entraîne : 5 techniques pour ne plus revivre ce moment. » |
| timidite-et-humour | 95 | 158 — « Timidité et humour font meilleur ménage qu'on croit : tu observes plus que les autres, et ta réplique surprend. 5 clés pour oser, par paliers, sans te forcer. » |
| storytelling-drole-5-structures | 100 | 155 — « Une histoire drôle tient moins au talent qu'à sa structure : escalade, pivot, exagération, callback et boucle, 5 structures pour des anecdotes qui font rire. » |
| conversation-machine-a-cafe | 178 | 150 — « Toi, un collègue et 90 secondes de silence gêné devant la machine à café : 5 situations avec la phrase à sortir, et comment filer quand le café est prêt. » |
| repartie-soiree-anti-malaise | 184 | 158 — « Ta vanne tombe à plat, on te chambre devant tout le monde, le groupe est déjà lancé : la répartie en soirée en 5 situations et 5 techniques, phrases incluses. » |
| confiance-humour-apres-rupture | 98 | 159 — « Après une rupture, l'humour aide à reprendre confiance : rire de la situation, c'est la regarder de l'extérieur. 5 étapes pour le retrouver, dans le bon ordre. » |
| pourquoi-blagues-marchent-pas | 150 | 157 — « Une vanne, et tu récoltes un silence ou un sourire poli ? Pourquoi tes blagues ne marchent pas : 7 raisons précises à diagnostiquer dès ce soir, et les parades. » |
| rester-muet-en-groupe | 179 | 159 — « Tu restes muet en groupe, un « ah ouais » toutes les huit minutes, ta réplique arrive 20 minutes trop tard ? 7 techniques pour reprendre la parole dès ce soir. » |

Les 5 articles statiques redirigés (cannibalisation) n'ont pas été touchés.

### 2.2 Réécritures en base (`apps/web/src/data/blog-article-rewrites.json`, v2) — 18/18 champs entre 140 et 160

| Slug | Champ | Avant → après |
|---|---|---|
| avoir-confiance-en-soi-grace-a-l-humour | excerpt | 167 → 144 (tiret cadratin → deux-points) |
| | metaDescription | 165 → 160 — « La confiance en soi grâce à l'humour, ça se construit : 3 étapes concrètes, 5 exercices pratiques et un programme de 30 jours pour changer ta timidité en force. » (« charisme naturel » retiré : cliché) |
| blague-courte-arme-secrete-humour | excerpt | 139 → 149 |
| | metaDescription | 164 → 155 — « La blague courte, arme secrète de l'humour : l'anatomie d'une vanne qui marche, 3 pièges à éviter, la méthode pour raccourcir et 15 exemples par situation. » |
| blague-drole-7-criteres-pepite | metaDescription | 172 (liste des 7 critères) → 157 — « Une blague drôle qui marche vraiment coche 7 critères, de la surprise à la règle des 3 secondes : la grille pour reconnaître une pépite avant de la raconter. » |
| citation-drole | excerpt | 161 → 154 |
| comment-improviser-des-blagues | metaDescription | 161 → 148 — « Improviser des blagues, ça s'apprend : 5 méthodes des pros, du rebond à l'association libre, et comment gérer le flop quand la vanne ne prend pas. » |
| comment-raconter-une-blague-sans-la-rater | metaDescription | 160 (liste de 7 items) → 159 — mot-clé exact en tête |
| etre-plus-a-l-aise-en-societe | metaDescription | 163 → 148 |
| jeu-de-mots-drole-techniques-creer | metaDescription | 175 → 154 — mot-clé « Jeu de mots drôle » en tête |
| techniques-humoristes-pros | metaDescription | 168 → 156 |

Les autres champs (content, excerpts déjà conformes) sont intacts. `_meta.version` laissé à **2** : la v2 n'est pas encore déployée (prod = code s9/s10), donc les nouvelles valeurs partiront avec elle. **Si la v2 avait déjà tourné sur une base, bumper à 3** sinon les nouvelles metaDescription ne seront jamais appliquées (patchId `blog-rewrite:v2:<slug>` déjà marqué).

## 3. Données structurées

| Point | Constat | Action |
|---|---|---|
| **Organization.logo / publisher.logo / Course.provider.logo / Product.image** | Pointaient vers `https://deviens-marrant.fr/icon-512.png` → **404 en prod** (vérifié `curl` 29/09). Le logo était donc ignoré par Google (Knowledge Panel) malgré l'ImageObject. Même 404 pour les icônes du `manifest.webmanifest` (`/icon-192.png`, `/icon-512.png`, `/favicon.png`, `/apple-touch-icon.png`). | Copie des icônes existantes de `src/app/` vers `public/` : `icon2.png` (512×512) → `public/icon-512.png`, `icon1.png` (192) → `public/icon-192.png`, `apple-icon.png` (180) → `public/apple-touch-icon.png`, `icon.png` (48) → `public/favicon.png`. Aucune ligne de code modifiée, dimensions conformes aux déclarations. |
| **FAQPage home** | Le JSON-LD fusionnait 4 questions `homepageFaqs` **affichées nulle part** + la FAQ visible (`FaqSection`). Contraire à la règle Google (balisage = contenu visible). | JSON-LD home = FAQ visible uniquement. `homepageFaqs` conservé tel quel dans le code (chiffres compris), non balisé → arbitrage Thomas §8. |
| FAQPage autres pages | `/vannes`, `/conseils`, `/videos`, `/quiz-humour`, `/a-propos`, `/anatomie-vanne`, `/parcours`, `/abonnement`, articles statiques : même tableau pour le rendu visible et le JSON-LD. | Conforme, rien à faire. Articles DB : pas de `faqs` → pas de FAQPage (cohérent). |
| **Article.dateModified** | `buildArticleJsonLd` lit `updatedAt` (statique : champ `updatedAt` = 2026-09-29 pour les 24 articles réécrits ; DB : colonne `updatedAt`, remise à jour par la tâche de réécriture). OG `modifiedTime` identique. | Conforme (le trou G3 du réaudit est fermé). Le H1/méta visible n'affiche que la date de publication : afficher « Mis à jour le … » relève du texte visible (autre agent). |
| BreadcrumbList | Blog, catalogue, parcours : 3 niveaux, URLs absolues. Parcours : le dernier niveau affichait le **title SEO** → nouveau champ `name` (« Parcours Répartie », etc.) pour le fil d'Ariane et `Course.name`. | Corrigé. |
| CollectionPage `/vannes`, `/conseils`, `/videos` | Descriptions JSON-LD en staccato (« Tape pour la chute. », « Chaque technique annotée + un défi concret. ») et `hasPart` avec des titres d'articles inexacts (« Techniques de stand-up pour la vie sociale » → pointait sur `timing-humour`). | Descriptions alignées sur les nouvelles meta ; `hasPart.headline` = vrais titres (« Timing humour : le secret de la blague », « Comment devenir drôle : le guide », « Répartie : 10 techniques efficaces », « Répartie débutant : 5 étapes simples »). |
| Person / Organization | `authorPersonJsonLd` : « Fondateur », aucun « coach ». `sameAs` émis seulement si `NEXT_PUBLIC_SOCIAL_PROFILES` est défini (jamais d'URL inventée). | Conforme. « Coaching individuel 99 € » subsiste comme **offre** (home, llms) : décision Thomas en attente, §8. |
| HowTo (articles GUIDE/PRATIQUE/ROADMAP) | Généré depuis les H2 (`text` = `name`). Google n'affiche plus les rich results HowTo depuis 2023 ; sans effet négatif. | Laissé en l'état (signalé). |

## 4. Maillage interne

**Liens vers URL redirigée / inexistante :** aucun. Vérifié sur tout `src/` (articles statiques, 9 réécritures JSON, pages, composants) contre `seo-redirects.data.cjs` : les seuls `timing-humour-ralentir` restants sont la règle de correction `blog-article-fixes.json` (search/replace) et un test. Les slugs orphelins de `blog-clusters.ts` (`devenir-drole-30-jours`, `humour-self-deprecating`, `techniques-standup-vie-sociale`, etc.) ne produisent aucun lien : la page filtre sur les articles existants. Garde-fou ajouté : test « aucun lien interne d'article vers un slug redirigé » (`src/__tests__/lib/seo-meta.test.ts`).

**Ancres :** aucune ancre non descriptive (« ici », « cet article », « en savoir plus ») dans les contenus.

**Liens ciblés vers les parcours (13 liens)** — ancres nommées qui pointaient vers le hub `/parcours` au lieu de la page du parcours cité :
- `[Parcours Répartie]` / `[parcours Répartie]` / `[parcours répartie]` (×8) → `/parcours/repartie` (casse harmonisée « Répartie », nom du produit) ;
- `[Parcours Machine à Café]` (×2) → `/parcours/machine-a-cafe` ;
- `[Parcours Confiance]` / `[parcours Confiance]` (×3) → `/parcours/confiance`.
Les ancres génériques (`[parcours]`, `[nos parcours]`, `[Choisis ton parcours]`) restent sur le hub, c'est correct.

**Liens ajoutés vers piliers et pages orphelines (5 insertions, sens inchangé) :**

| Article source | Ajout | Cible | Pourquoi |
|---|---|---|---|
| comment-avoir-de-la-repartie (pilier) | 1 phrase en fin de section « timide » : « Si tu bloques surtout en groupe, lis comment [ne plus rester muet en groupe] ; si c'est le blanc total face à une question, voici [5 techniques quand tu sais jamais quoi répondre]. » | `rester-muet-en-groupe`, `jamais-quoi-repondre-techniques` | Les 2 gagnants de la cannibalisation s11 (ils absorbent 2 articles redirigés) n'avaient **aucun** lien entrant contextuel. |
| blagues-travail-faire-rire-pro | Encadré après « Nos vannes du jour » : « [50 blagues drôles à ressortir en 2026] — classées par situation, avec une section entière pour le bureau. » | `meilleures-blagues-droles-2026` | Page n°1 SEO : seulement 2 liens entrants contextuels. |
| phrases-droles-conversations | Ligne après le CTA catalogue : « Et pour des blagues complètes, voici [50 blagues drôles à ressortir en 2026], rangées par situation. » | `meilleures-blagues-droles-2026` | Même cluster « fort volume ». |
| comment-devenir-drole (pilier) | Lien posé sur l'existant « "je suis pas drôle" » | `je-suis-pas-drole-comment-changer` | Pilier d'un cluster sans lien entrant. |
| confiance-humour-apres-rupture | Lien posé sur l'existant « redevenir drôle » | `comment-devenir-drole` | L'article ne liait aucun pilier. |

Restent sans lien entrant **contextuel** (ils reçoivent ceux des blocs « Continue ta progression » / navigation de cluster) : `timidite-et-humour`, `storytelling-drole-5-structures`, `repartie-soiree-anti-malaise`, `pourquoi-blagues-marchent-pas`, `comment-faire-rire-une-fille`/`-un-homme` et les 9 articles DB. À traiter au prochain lot éditorial plutôt qu'en insertions forcées.

## 5. Sitemap, robots, llms.txt

- **`sitemap.ts`** : les pages structurelles utilisaient `BUILD_DATE` (lastmod qui change à chaque déploiement sans changement de contenu, signal négatif Bing — P2-01 du réaudit). Remplacé par deux constantes versionnées : `STRUCTURAL_PAGES_LASTMOD = "2026-09-29"` (refonte s11) et `LEGAL_PAGES_LASTMOD = "2026-05-06"` (dernier commit des pages légales). **À mettre à jour à la main quand le texte d'une page change.** Articles statiques : exclusion étendue à tout slug de `REDIRECTED_BLOG_SLUGS` (en plus de `UNPUBLISHED_STATIC_SLUGS`). `/blog/meilleures-blagues-droles-2026` reste dans le sitemap (aucune redirection).
- **`robots.ts`** : un groupe `User-agent` spécifique remplace le groupe `*`. Bingbot n'avait pas `/login`, `/forgot-password`, `/reset-password` ; msnbot et les 9 bots LLM n'avaient **aucun** disallow (accès `/api/`, `/profil`…). Tous les groupes reprennent désormais `disallowedPrivate` ; bots LLM toujours autorisés sur tout le contenu public (GEO).
- **`llms.txt`** : liste dynamique statiques + DB hors redirections, résumés = nouveaux excerpts (plus de coupe au milieu d'un mot). Durées des parcours cohérentes (3/4/6 semaines). Aucune mention d'IA dans le contenu servi (les seules occurrences sont des commentaires de code).
- **`llms-full.txt`** : ajout de la ligne « Mis à jour : AAAA-MM-JJ » par article quand `updatedAt` ≠ date de publication (statique et DB) — signal de fraîcheur pour les moteurs génératifs.
- `llms-content.ts` : inchangé (FAQ, tarifs, études conservés — choix fondateur). Points signalés en §6/§8.

## 6. Incohérences chiffrées (signalées, non corrigées)

Aucun de ces chiffres n'a été modifié (règle fondateur). Ils se contredisent d'une page à l'autre et envoient des signaux flous aux moteurs comme aux lecteurs.

| # | Sujet | Version A | Version B | Où |
|---|---|---|---|---|
| 1 | **Durée du parcours Répartie** | « 4 semaines » : meta `/parcours/repartie`, `/parcours` (meta, JSON-LD, cartes), home (« Parcours Répartie · 4 semaines »), `llms.txt`, `llms-full.txt`, `llms-content.ts`, bloc maillage blog, FAQ `/conseils`, articles `comment-avoir-de-la-repartie`, `timidite-et-humour` | « une progression de **30 jours** » | `blog-articles.ts` l.3770 (`rester-muet-en-groupe`) |
| 2 | **Rythme du parcours Répartie** | « 15 à 20 min/semaine selon le parcours » (meta + chapô `/parcours`) | « Un exercice concret par jour, 10 min max » (`components/blog/blog-article-parcours-maillage.tsx` l.36) et « exercices concrets à tester chaque jour… 5 minutes par jour » (FAQ `/conseils` l.42). 5 à 10 min/jour = 35 à 70 min/semaine | 3 fichiers |
| 3 | **Taille du catalogue de vannes** | « 600+ vannes » (compteur prod dynamique : `/`, `/vannes`, `/abonnement`) | « 300+ autres vannes » (description de **chaque** page `/vannes/[slug]`, chaîne figée) | `vannes/[slug]/page.tsx` l.85 |
| 4 | **Nombre de phrases** (`phrases-droles-conversations`) | Titre « 30 phrases drôles prêtes à ressortir » (intouchable), corps « plus de 30 », « Les 30 phrases au-dessus » | Excerpt/meta « 33 phrases » (chiffre de l'excerpt d'origine, conservé) | `blog-articles.ts` l.1165-1321 : à recompter dans le corps pour savoir laquelle est juste |
| 5 | **Parcours Confiance** | 6 étapes (`stepsCount: 6`, une par semaine) | « consacre une semaine entière » à l'autodérision (`autoderision-interactions`) | À vérifier contre le contenu réel du parcours en base (non accessible depuis le worktree) |
| 6 | **Nombre de techniques** (hors SEO, pour info) | « 400+ conseils/techniques » (compteur prod) | « 50+ techniques » | `lib/social/templates/instagram-templates.tsx` l.417, `lib/ai/agents/standup-director-agent.ts` l.2386 |

Données douteuses (non chiffrées mais factuelles), gardées telles quelles :
- `llms-content.ts` l.47 (FAQ servie aux moteurs génératifs) : « Une étude du Journal of Positive Psychology a démontré qu'un entraînement de **8 semaines**… » et « chercheurs de l'Université du Nouveau-Mexique » : ni auteur, ni année, ni lien. À sourcer précisément, sinon risque E-E-A-T et citation erronée reprise par les moteurs génératifs.
- Excerpt de la page n°1 `meilleures-blagues-droles-2026` : « testées et approuvées », promesse invérifiable (voir §8).

Vérifié cohérent : accès gratuit « 10 vannes, 3 conseils, 3 vidéos » (= `FREE_JOKE_LIMIT` et limites API), quiz « 12 questions » (12 dans `quiz-data.ts`), glossaire « 12 termes » (12 entrées), Machine à Café 3 semaines / 15 min/semaine, Confiance 6 semaines, prix 0,99 €/mois.

## 7. Vérifications (tsc / jest)

Commande : `cd apps/web && npx tsc --noEmit -p tsconfig.build.json && npx jest` (29/09, après toutes les modifications, reprise comprise).

| Contrôle | Résultat |
|---|---|
| `tsc --noEmit -p tsconfig.build.json` | **0 erreur** |
| `jest` | **118 suites passées, 1 skipped : 1973 tests passés, 2 skipped, 0 échec** |
| `eslint` (fichiers modifiés principaux) | 0 erreur |
| Nouveau test `src/__tests__/lib/seo-meta.test.ts` | vert : `fitTitle` / `fitDescription` (≤ 60 / ≤ 160, jamais « ... »), excerpt de chaque article statique indexé entre 140 et 160 car. (page n°1 exemptée), 18 champs des réécritures DB entre 140 et 160, aucun lien interne vers un slug redirigé |

Aucun test existant ne figeait les anciens titres/descriptions : rien à réaligner.

Contrôle de longueur (script, compteurs prod 600+/400+/80+) :
- **Titles rendus** : tous ≤ 60 et uniques sur les pages indexables ; les 25 articles statiques indexés ≤ 60 (max 60 : `exercices-developper-humour`, `repartie-soiree-anti-malaise`).
- **Descriptions** : pages statiques indexables entre 144 et 159 ; 24/25 excerpts statiques entre 144 et 160 (exception assumée : page n°1, 135) ; 18/18 champs des réécritures DB entre 140 et 160.
- Pages dynamiques (`/vannes/[slug]`, `/conseils/[slug]`, `/videos/[slug]`) : ≤ 160 garanti ; le plancher de 140 dépend de la longueur du contenu source (complément ajouté sous 110 car.).
- Pages `noindex` (auth, profil, favoris, admin) : descriptions courtes, sans enjeu.

`npm run build` complet non lancé (hors demande) : requis avant commit (commandement 6).

## 8. Points à trancher par Thomas

| # | Question | Options | Reco @seo |
|---|---|---|---|
| 1 | **Durée du parcours Répartie** : 4 semaines ou 30 jours ? (§6-1) | a) « 4 semaines » partout (remplacer « 30 jours » dans `rester-muet-en-groupe`) ; b) garder les deux | a) : une dizaine de sources (pages, llms, JSON-LD, articles) disent 4 semaines, une seule dit 30 jours |
| 2 | **Rythme des parcours** : « 15 à 20 min/semaine » ou « 5 à 10 min par jour » ? (§6-2) | Choisir la vraie charge, puis aligner meta `/parcours`, chapô, bloc maillage et FAQ `/conseils` | Donner la valeur réelle du contenu en base ; c'est une promesse de conversion, elle doit être exacte |
| 3 | **« 300+ autres vannes »** dans la description de chaque page vanne (§6-3) | a) passer au compteur dynamique (« 600+ », même source que `/vannes`) ; b) garder 300+ | a) : chiffre sous-évalué de moitié, répété sur des centaines d'URL |
| 4 | **30 ou 33 phrases** (`phrases-droles-conversations`) (§6-4) | Recompter ; si 30 : excerpt → « 30 » ; si 33 : garder (le titre, intouchable, dit 30) | Aligner l'excerpt sur le titre si le compte donne 30 |
| 5 | **Meta de la page n°1** `meilleures-blagues-droles-2026` : 135 car., « testées et approuvées » invérifiable | a) laisser intacte (état validé) ; b) rallonger à ~155 sans toucher titre/slug/année, ex. « Les 50 meilleures blagues courtes de 2026, classées par situation (soirée, boulot, date, famille) : la bonne vanne pour chaque moment, avec sa chute. » | b) seulement sur GO explicite : la page est n°1, le gain de CTR est probable mais le risque n'est pas nul |
| 6 | **FAQ `homepageFaqs`** (4 questions, chiffres compris) : balisées en JSON-LD mais **invisibles** sur la home | a) les afficher dans une section visible puis les remettre dans le FAQPage ; b) les supprimer | a) : les questions « Comment devenir drôle quand on n'est pas drôle ? » / « Comment avoir de la répartie rapidement ? » visent les 2 requêtes cibles |
| 7 | **« Coaching individuel 99 €/séance »** (home, `llms-content.ts`) : le mot « coach » est banni pour la marque, pas pour l'offre | Garder l'offre telle quelle ou la renommer (ex. « séance individuelle ») | Décision produit, pas SEO ; aucune modification faite |
| 8 | **Étude « Journal of Positive Psychology, 8 semaines »** + « Université du Nouveau-Mexique » (`llms-content.ts`) | Fournir la référence exacte (auteurs, année) ou retirer l'attribution | Sourcer : ce texte est servi tel quel aux moteurs génératifs |
| 9 | **Version des réécritures DB** (`blog-article-rewrites.json`, `_meta.version: 2`) | Si la v2 a déjà tourné sur une base (prod ou préprod), passer à **3**, sinon les nouvelles metaDescription ne s'appliqueront jamais | Vérifier avant déploiement |
| 10 | **Fusion avec la branche de réécriture du texte visible** | Ce worktree modifie les metadata de `glossaire`, `quiz-humour`, `anatomie-vanne`, `parcours`, `conseils`, `videos`, `vannes`, `a-propos`, `blog`, home, ainsi que des liens et 3 courtes insertions de maillage dans le corps de `blog-articles.ts` | Merger après l'autre branche et relire les conflits sur ces fichiers (lignes différentes, conflits textuels peu probables) |
| 11 | **Lastmod du sitemap** : constantes `STRUCTURAL_PAGES_LASTMOD` / `LEGAL_PAGES_LASTMOD` à tenir à jour à la main | a) garder la maintenance manuelle ; b) confier à @fullstack une date par page (git log au build) | b) à terme ; a) acceptable tant que les pages bougent peu |

---
**Handoff → @orchestrator**
- Fichiers produits/modifiés : voir le rapport de handoff (liste `git status` du worktree `wt-seo`)
- Décisions prises : titles = H1 exact (plus de troncature « ... »), descriptions 140-160 sans staccato, FAQPage home = FAQ visible uniquement, logos JSON-LD servis depuis `public/`, lastmod sitemap stables, robots par bot, 13 liens retargetés vers les pages parcours + 5 liens de maillage
- Points d'attention : §6 (incohérences chiffrées), §8 (11 arbitrages), `npm run build` avant commit, page n°1 intacte
---
