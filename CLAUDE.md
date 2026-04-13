# Marrant — deviens-marrant.fr

## Environnement

- **Hébergement** : Replit (PAS Vercel). Ne jamais mentionner Vercel.
- **Variables d'environnement** : se configurent dans l'onglet **Secrets** de Replit (icône cadenas).
- **Email transactionnel** : Resend (`RESEND_API_KEY` dans Secrets Replit). Variable optionnelle `EMAIL_FROM` pour personnaliser l'expéditeur (défaut : `Deviens Marrant <noreply@deviens-marrant.fr>`). Le domaine doit être vérifié dans le dashboard Resend.

## Règles de développement

### Tests obligatoires avant chaque commit
- **Toujours lancer les tests (`npx jest --no-coverage`) avant chaque commit** et s'assurer que 100% passent.
- Si un composant, une page, une lib ou un store est ajouté ou modifié, **mettre à jour ou créer les tests correspondants** dans `apps/web/src/__tests__/`.
- Les tests doivent couvrir : rendu, interactions, accessibilité (ARIA), appels API, états d'erreur/chargement/vide, filtres, pagination et navigation.

### Structure des tests
```
apps/web/src/__tests__/
├── ui/          # Composants UI (Button, Badge, Input, Card, ProgressBar, etc.)
├── layout/      # Header, Footer
├── feature/     # BlaguesList, ConseilsList, VideosGrid, ParcoursList, HumorQuiz
├── dashboard/   # ProfilDashboard, FavorisList, DailyContent, HeroSection
├── auth/        # Login, Register, ForgotPassword
├── lib/         # youtube, stripe, utils
└── stores/      # favorites-store, user-store
```

### Stack de test
- Jest + @testing-library/react + @testing-library/user-event
- Mocks : `jest.mock()` pour next-auth, next/navigation, stores Zustand, fetch API
- Config : `apps/web/jest.config.ts` + `apps/web/jest.setup.ts`

### Workflow
1. Coder la feature/correction
2. Mettre à jour les tests existants ou en créer de nouveaux
3. Lancer `npx jest --no-coverage` — tout doit passer
4. Commit + push

## Contrôle qualité vannes — Le Test Stand-Up

### Règle absolue
**Chaque vanne du catalogue DOIT passer ce test avant d'être ajoutée ou conservée :**

> « Est-ce que je peux la sortir ce soir en soirée / demain à la machine à café et faire rire ? »

Si la réponse est non, la vanne n'a rien à faire sur le site.

### Critères de rejet automatique
- **Objets qui parlent** : « Un X dit à un Y... » entre objets inanimés (fourchette/couteau, miroir/miroir, stylo/crayon). Personne ne sort ça en société.
- **Jeux de mots forcés** : si le calembour ne fonctionne qu'à l'écrit ou nécessite 3 secondes de réflexion, c'est non.
- **Punchline plus longue que le setup** : en stand-up, la chute doit être plus courte que l'amorce. Si la punchline fait 30+ mots, la raccourcir ou la couper.
- **Doublons conceptuels** : vérifier qu'aucune vanne existante n'utilise déjà le même concept/comparaison (ex : « X c'est comme le Wi-Fi »).
- **Blagues enfantines / Carambar** : format Q&A basique type « Pourquoi le X fait Y ? Parce que Z. » sans twist réel.
- **Autodérision triste sans punch** : « je suis seul / nul / ghosté » sans retournement comique = pas drôle, juste déprimant.

### Critères de qualité
- **Relatable** : la vanne parle d'une situation que nos personas vivent vraiment (coloc, boulot, date, soirée, famille).
- **Sortable à l'oral** : on doit pouvoir la raconter naturellement dans une conversation, sans intro artificielle.
- **Twist net** : la punchline doit surprendre. Si on la voit venir, c'est raté.
- **Courte et percutante** : setup + punchline < 40 mots idéalement. Les meilleures tiennent en 20 mots.
- **Persona-check** : vérifier que la vanne sert au moins un de nos 3 personas (Yanis 20 ans / Sophie 26 ans / Marc 34 ans).

### Workflow ajout/modification de vannes
1. Écrire la vanne
2. Appliquer le test stand-up (« je la sors ce soir ? »)
3. Vérifier les critères de rejet (pas d'objets qui parlent, pas de doublon, punchline courte)
4. Vérifier qu'au moins un persona peut l'utiliser dans sa vie
5. Vérifier qu'aucune vanne existante n'a le même concept
6. Ajouter au fichier `docs/content/blagues-seed.json`

## Diversité du catalogue vidéos — Règle permanente

### État actuel (mars 2026)
- Montreux Comedy = ~36% du catalogue (32/89 vidéos)
- Objectif : aucune chaîne au-dessus de 25% du catalogue total

### Règle de rééquilibrage progressif
- **Ne PAS supprimer** les vidéos Montreux existantes (contenu de qualité)
- **Chaque nouvelle vidéo ajoutée** doit venir d'une chaîne sous-représentée
- Chaînes à privilégier : chaînes d'artistes (Blanche Gardin, Paul Mirabel, Roman Frayssinet...), Jamel Comedy Club, France Inter, YouHumour, Campus Comedy Tour, Tarmac, chaînes individuelles
- L'agent vidéo (`video-agent.ts`) applique cette règle en critère 4 de sélection

### Workflow ajout de vidéos (manuel)
1. Vérifier que le youtubeId existe et que la vidéo est accessible
2. Privilégier une chaîne sous-représentée dans le catalogue
3. Rédiger description, learnings et exercice au format standard
4. Ajouter au fichier `docs/content/videos-seed.json`

### Découverte automatique mensuelle — Pipeline `monthly-videos`
Le cron `/api/cron/monthly-videos` découvre et ajoute automatiquement **10 nouvelles vidéos** chaque mois.

#### Architecture pipeline
```
CRON /api/cron/monthly-videos (1er du mois)
  → video-discovery-agent.ts
    1. Surveillance chaînes (WATCHED_CHANNELS — 15 chaînes prioritaires)
    2. Recherche par mots-clés stand-up FR (YouTube Data API)
    3. Filtrage IA (pertinence stand-up, diversité chaîne, durée)
    4. Enrichissement IA (description pédagogique, learnings, exercice)
  → Stand-Up Director validateNewVideo() (score ≥ 7 → ajout catalogue)
  → DB Video (generatedByAI: true)
```

#### Chaînes surveillées (WATCHED_CHANNELS)
- **Haute priorité** : Paul Mirabel, Fary, Roman Frayssinet, Blanche Gardin, Pierre Croce, Jamel Comedy Club, YouHumour
- **Moyenne priorité** : France Inter, Campus Comedy Tour, Tarmac, Waly Dia, Panayotis Pascot, Inès Reg, Nordine Ganso
- **Basse priorité** : Sugar Sammy

Les Channel IDs sont dans `video-discovery-agent.ts`. Ajouter de nouvelles chaînes en éditant `WATCHED_CHANNELS`.

#### Fichiers clés
| Fichier | Rôle |
|---|---|
| `lib/ai/agents/video-discovery-agent.ts` | Découverte, filtrage et enrichissement |
| `lib/youtube.ts` | `searchVideos()`, `getChannelVideos()`, `getMultipleVideoDetails()` |
| `lib/ai/agents/standup-director-agent.ts` | `validateNewVideo()` — validation avant ajout |
| `app/api/cron/monthly-videos/route.ts` | Endpoint cron mensuel |

#### Secrets Replit nécessaires
```
YOUTUBE_API_KEY    — Clé API YouTube Data v3 (obligatoire)
CRON_SECRET        — Auth du cron (existant)
```

## Agent SEO — Instructions automatisées

### Planning éditorial
- Le planning éditorial est dans **`/seo-editorial-plan.json`** (v4.0) à la racine du projet.
- Ce fichier contient : mots-clés cibles (primary + secondary + highVolume + longTail + seasonal), 9 clusters thématiques, articles planifiés avec statut, et règles de maillage interne.
- **9 clusters** : apprendre-humour, techniques-repartie, techniques-delivery, types-humour, humour-contexte, apprendre-des-pros, douleurs-personas, **fort-volume** (acquisition), **saisonnier** (pics de trafic)

### Workflow agent SEO à chaque session
1. **Lire** `seo-editorial-plan.json`
2. **Identifier** les articles `planned` dont la `scheduledWeek` est passée ou en cours
3. **Rédiger** les articles dans `apps/web/src/lib/blog-articles.ts` en respectant les `qualityRules` du fichier
4. **Valider** chaque article via `validateBlogArticle()` du Stand-Up Director avant publication. Si rejeté 3x, le directeur réécrit via `directorRewriteBlogArticle()`
5. **Mettre à jour** le statut dans le JSON : `"status": "published"`, ajouter `"publishedDate": "YYYY-MM-DD"`
6. **Prolonger** : quand il reste < 4 articles `planned`, générer 8 nouveaux articles en suivant la stratégie de clusters et les mots-clés long-tail non couverts
7. **Commit + push** les changements

### Rythme de publication
- **Objectif** : 3-4 articles/semaine avec **standard qualité MAXIMAL** à chaque article (pas de compromis volume/qualité — si le standard n'est pas atteint, on ne publie PAS)
- **Priorité** : clusters douleurs-personas + fort-volume (conversion + acquisition)
- **Saisonnier** : publier 2-3 semaines AVANT l'événement (Noël sem ~49, Saint-Valentin sem ~5, rentrée sem ~34)

### Règles de rédaction SEO
- Titre < 60 caractères, mot-clé principal en début
- Meta description < 155 caractères, incitative — **validation programmatique** (tronquée automatiquement si trop longue)
- Contenu : 1500-2500 mots (pillar) / 1000-1800 mots (satellite)
- Structure : H2 sous-sujets, H3 détails, listes, gras sur termes clés
- Maillage interne : minimum 5 liens par article
- FAQ schema : 3-5 questions en fin d'article
- CTA vers la section produit pertinente (/parcours, /vannes, /conseils)
- **Schema HowTo** : automatiquement injecté pour les articles GUIDE, PRATIQUE, ROADMAP (Rich Snippets avec étapes dans les SERP)

### Cannibalisation
- Vérifier qu'un nouvel article ne cannibalise pas un article existant (même **slug** ET même **mot-clé principal**)
- Vérification programmatique en DB + articles statiques dans `seo-blog-agent.ts`
- Les cas identifiés sont documentés dans `cannibalizationFixes` du JSON

### Maillage bidirectionnel pages produit ↔ blog
- Les pages `/vannes`, `/conseils`, `/videos` incluent des sections SEO textuelles avec liens vers les articles de blog piliers
- Les articles de blog lient vers les pages produit (minimum 5 liens internes)
- Les liens sont contextuels, pas juste en CTA final

### Performance SEO
- **Fonts self-hosted** via `next/font/google` (Inter + Plus Jakarta Sans) — plus de render-blocking Google Fonts
- **CSP simplifié** : plus de dépendance externe pour fonts.googleapis.com/fonts.gstatic.com
- **Sitemap dynamique** : lastModified via `BUILD_DATE` env var (plus de date hardcodée)

## Personas de référence

Trois personas guident les décisions UX/copy du site. À consulter pour toute évolution majeure.

### RÈGLE ABSOLUE — Personas = outils INTERNES uniquement
- Les noms "Yanis", "Sophie", "Marc" ne doivent **JAMAIS apparaître dans le contenu public** (articles, vannes, conseils, posts social, pages du site).
- Un visiteur qui lit "Sophie au bureau" ou "Yanis en soirée" ne comprend rien — c'est comme montrer les coulisses au public.
- **À la place** : utiliser le "tu" direct ou des descriptions de situation ("au bureau", "en soirée", "quand tu reprends confiance", "que tu sois étudiant ou jeune actif").
- **Validation programmatique** : `guardAgainstPersonaLeak()` dans `standup-director-agent.ts` rejette automatiquement tout contenu contenant un prénom de persona.
- Les personas sont utilisés **uniquement** dans les prompts système des agents (pour guider le ton et les thématiques), jamais dans le contenu généré.

### Yanis — 20 ans, étudiant
- **Profil** : Étudiant introverti, manque de confiance en lui, veut progresser en répartie pour s'affirmer en soirées, en coloc et avec ses potes.
- **Objectif principal** : Avoir de la répartie — savoir quoi répondre du tac au tac sans rester muet.
- **Besoins** : Exercices concrets, techniques simples, progression visible (XP/streak), ton encourageant et complice.
- **Points de friction** : Contenu trop formel ou corporate, absence de message rassurant pour les timides, manque de références à la vie étudiante.

### Sophie — 26 ans, jeune active
- **Profil** : CDI dans une boîte moyenne, sociable mais manque de conversation à la machine à café. Veut avoir des anecdotes et blagues à ressortir au bon moment.
- **Objectif principal** : Alimenter ses conversations quotidiennes — machine à café, afterwork, dîners entre amis.
- **Besoins** : Blagues courtes et mémorisables, conseils de timing, contenu actualisé régulièrement, catégories filtrables.
- **Points de friction** : Contenu trop long, blagues datées, pas de mention de situations professionnelles.

### Marc — 34 ans, récemment séparé
- **Profil** : En reconstruction après une séparation, veut renouer avec l'humour et la légèreté. Cherche à progresser globalement — blagues, répartie, storytelling.
- **Objectif principal** : Redevenir drôle et à l'aise socialement, retrouver confiance en ses interactions.
- **Besoins** : Parcours structurés, progression mesurable, variété de contenus (blagues + conseils + vidéos), ton bienveillant sans infantiliser.
- **Points de friction** : Contenu uniquement orienté « ados/étudiants », manque de profondeur dans les parcours, absence de recommandations personnalisées.

## Agent Stand-Up Director — Directeur Artistique (standup-director-agent.ts)

### Rôle et mission
Le Stand-Up Director est le **gardien qualité de TOUS les contenus** du site. Aucun contenu (vanne, conseil, vidéo, article blog) n'est publié sans son approbation. Il incarne la double mission :
1. **Site n°1 du stand-up français** — chaque contenu au niveau d'un showcase professionnel
2. **Plateforme de formation au stand-up n°1 en France** — chaque conseil/vidéo enseigne quelque chose de concret et mesurable

### 5 tests universels appliqués à TOUT contenu
1. **Test du Pote** : "Tu enverrais ça à ton meilleur pote ?"
2. **Test du Concret** : "Après ça, je sais exactement quoi faire"
3. **Test du Doublon** : "Ça existe déjà sous une autre forme ?"
4. **Test du Persona** : "Yanis, Sophie ou Marc est servi ?"
5. **Test de la Barre** : "C'est au niveau du leader du marché ?"

### Pipeline de validation (intégré dans les crons)
```
Tentative 1:  Agent génère → Directeur valide → REJETÉ ❌
                                                  ↓ feedback injecté dans le prompt
Tentative 2:  Agent re-génère → Directeur valide → REJETÉ ❌
                                                  ↓ feedback injecté dans le prompt
Tentative 3:  Agent re-génère → Directeur valide → REJETÉ ❌
                                                  ↓
              LE DIRECTEUR PREND LA MAIN
              → Reçoit la dernière version + tous les problèmes identifiés
              → Réécrit lui-même le contenu (directorRewrite*)
              → Publication ✅
```

### Fonctions disponibles
| Fonction | Rôle |
|---|---|
| `validateJoke(joke, persona)` | Valide une vanne (twist, punchline, persona, ton) |
| `validateTip(tip, persona)` | Valide un conseil (actionnable, défi, technique) |
| `validateVideoSelection(video, persona)` | Valide une sélection vidéo (pédagogie, diversité chaîne) |
| `validateBlogArticle(article)` | Valide un article (humour, SEO, refs modernes, liens internes) |
| `directorRewriteJoke(joke, validation, persona)` | Réécrit une vanne après 3 échecs |
| `directorRewriteTip(tip, validation, persona)` | Réécrit un conseil après 3 échecs |
| `directorRewriteBlogArticle(article, validation)` | Réécrit un article après 3 échecs |
| `generateEditorialVision(month, year)` | Vision éditoriale mensuelle pour tous les agents |
| `reviewContentBatch(items, date)` | Revue quotidienne de cohérence/diversité |

### Verdicts
- **APPROVED** (score ≥ 9) : publiable en l'état — au niveau du site n°1
- **NEEDS_REVISION** (score 7-8) : l'idée est bonne, suggestion de réécriture fournie
- **REJECTED** (score ≤ 6) : ne passe pas le test, recommencer de zéro

### Intégration dans les pipelines existants
- **daily-publisher.ts** : les 3 agents (vannes, conseils, vidéos) passent par la validation du directeur avant DB save. Si 3 échecs, le directeur réécrit.
- **seo-blog-agent.ts** : `publishWeeklyArticle()` valide l'article par le directeur entre génération et publication DB. Si 3 échecs, le directeur réécrit.
- **Crons inchangés** : `/api/cron/daily-content` (5h-6h UTC) et `/api/cron/weekly-seo` (lundi 9h UTC) appellent les mêmes fonctions — la validation est transparente.
- **Sécurité** : si l'API de validation crash, le contenu est publié tel quel (jamais de blocage).

### Références humoristes (barre de qualité)
Prioritaires : Paul Mirabel, Fary, Roman Frayssinet, Blanche Gardin, Waly Dia, Panayotis Pascot, Pierre Croce, Inès Reg
Legacy (max 1 mention) : Jamel Debbouze, Gad Elmaleh, Florence Foresti, Kev Adams

### Critères SEO blog (non négociables)
- Mot-clé dans intro, 2-3 H2/H3, conclusion
- Titre < 60 chars, meta 150-155 chars
- Min 5 liens internes (/vannes, /parcours, /conseils, /videos)
- FAQ schema 3-5 questions en fin d'article
- 1500-2500 mots, pas de keyword stuffing
- Anti-cannibalisation vérifié avant publication

## Architecture des agents IA

### Vue d'ensemble
```
┌─────────────────────────────────────────────────────────────┐
│                    CRONS (déclencheurs)                      │
│  Quotidien 5h-6h UTC    │  Mensuel 28     │  Lundi 9h UTC  │
│  /cron/daily-content     │  /cron/monthly  │  /cron/weekly-seo │
└──────────┬───────────────┴────────────────┬─────────────────┘
           ▼                                ▼
┌─────────────────────┐        ┌─────────────────────────┐
│  daily-publisher.ts │        │  seo-blog-agent.ts      │
│  Orchestrateur      │        │  Pipeline blog          │
└──────────┬──────────┘        └──────────┬──────────────┘
           ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                STAND-UP DIRECTOR (validation)               │
│  validate* → APPROVED ? publish : retry (max 3)            │
│  3 échecs → directorRewrite* → publish                     │
└──────────┬──────────────────────────────────┬───────────────┘
           ▼                                  ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│  Agents de contenu       │   │  Agent SEO Blog          │
│  joke-agent.ts           │   │  planNextArticle()       │
│  tip-agent.ts            │   │  generateArticle()       │
│  video-agent.ts          │   │  publishWeeklyArticle()  │
└──────────────────────────┘   └──────────────────────────┘
```

### Coordination inter-agents
- **Rotation personas** : Jour 1,4,7→YANIS | Jour 2,5,8→SOPHIE | Jour 3,6,9→MARC (fichier `personas.ts`)
- **Diversité quotidienne** : chaque agent reçoit les catégories des 2 autres pour éviter les doublons
- **Plans mensuels** : `content-planner.ts` génère 3 plans (vannes/conseils/vidéos) harmonisés via `plan-validator.ts`
- **Tonalité unique** : `TONALITY_BRIEF` dans `marketing-agent.ts` est la source de vérité partagée

### Fichiers clés
| Fichier | Rôle |
|---|---|
| `lib/ai/agents/standup-director-agent.ts` | Directeur artistique — validation + réécriture |
| `lib/ai/agents/joke-agent.ts` | Génération de vannes quotidiennes |
| `lib/ai/agents/tip-agent.ts` | Génération de conseils quotidiens |
| `lib/ai/agents/video-agent.ts` | Sélection de vidéos quotidiennes |
| `lib/ai/agents/video-discovery-agent.ts` | Découverte mensuelle + enrichissement de nouvelles vidéos |
| `lib/ai/agents/seo-blog-agent.ts` | Génération d'articles blog SEO |
| `lib/ai/agents/marketing-agent.ts` | Creative Strategist + TONALITY_BRIEF |
| `lib/ai/daily-publisher.ts` | Orchestrateur contenu quotidien |
| `lib/ai/content-planner.ts` | Planification mensuelle |
| `lib/ai/plan-validator.ts` | Harmonisation inter-agents |
| `lib/ai/personas.ts` | Définition des 3 personas + rotation |
| `lib/ai/client.ts` | Client Anthropic partagé + retry |

## Stratégie Social Media — Plan v2 (validé par le Directeur Artistique, 19 mars 2026)

### Principe fondateur
Chaque post est une **micro-performance de stand-up**. Pas un extrait du catalogue. Pas un engagement bait. Une micro-performance.

### Architecture pipeline
```
CRON /api/cron/daily-social (4h UTC)
  → social-media-agent.ts (génération social-native)
  → Stand-Up Director validateSocialPost() (7 critères social-spécifiques)
  → DB SocialPost (status: PENDING)
  → /admin/social (dashboard validation 1-clic)
  → CRON /api/cron/publish-social (toutes les 30 min, publie les APPROVED)
  → CRON /api/cron/social-analytics (1x/jour, pull metrics → feedback loop)
```

### Phases de déploiement
- **Phase 1** (Sem 1-2) : Twitter/X + Threads — texte pur, 100% auto
- **Phase 2** (Sem 3-4) : LinkedIn — angle pro Sophie/Marc
- **Phase 3** (Sem 5-8) : Instagram — **ACTIF** (publication via Buffer, single-image uniquement — pas de carousel API)

### 4 formats signature Twitter (PAS d'engagement bait)
1. **Technique du Jour** : "[Humoriste] + [technique] + comment TU l'utilises ce soir" (1x/jour)
2. **Vanne Réécrite Social** : réécriture social-native, hook en 5 mots (1x/jour)
3. **Thread Décryptage** : 5-7 tweets décortiquant une technique (2x/semaine)
4. **Quote Analyse** : citation humoriste + micro-analyse technique (3x/semaine)

### Ce qu'on ne fait JAMAIS
- "Complète cette vanne..."
- "Note de 1 à 10"
- "Tag un ami qui..."
- Tout format qu'un compte générique à 500 followers ferait
- Copier-coller du catalogue sans réécriture social-native

### validateSocialPost() — 7 critères du Directeur
1. **Hook test** (poids x2) : les 5 premiers mots arrêtent le scroll ?
2. **Standalone test** : compréhensible sans connaître le site ?
3. **Share test** (poids x2) : "j'envoie ça à mon pote" ?
4. **Brand test** : ton complice, mature, jamais corporate ?
5. **Anti-generic test** : un compte lambda pourrait poster ça ? → Si oui, REJETÉ
6. **Platform-native test** : exploite les codes de la plateforme ?
7. **Persona test** : Yanis/Sophie/Marc scrolle et s'arrête ?

### Brief social-media-agent (social-native, PAS fork du joke-agent)
- Ton plus punchy que le site (chaque mot compte, 0 filler)
- Plus "entre nous" (comme un DM à un pote)
- Plus spontané (pas de structure conseil → exemple → exercice)
- Hook en ≤ 5 mots obligatoire
- Zéro lien dans les 3 premières lignes (algo pénalise)
- CTA subtil en fin ("plus de techniques → lien en bio")

### Charte visuelle Instagram (Phase 3)
- Fond principal : noir/très sombre (se démarque dans le feed)
- Accent : violet/gradient du site (accent-primary)
- Texte : blanc cassé, punchlines en italique + taille 1.5x
- 3 templates reconnaissables : Technique du Jour, La Vanne, Le Défi (pas de carousel — limitation Buffer API)
- Règle : reconnaissable en < 1 seconde dans un feed

### Horaires de publication par persona
- Yanis : 21h-23h (scrolle le soir)
- Sophie : 8h-9h + 12h-13h (trajet + pause déj)
- Marc : 7h-8h + 20h-21h (matin calme + soirée)

### Stratégie de croissance 0 → 10K
1. **Format signature "Technique du Jour"** : USP = décortiquer des techniques de stand-up de manière actionnable
2. **Quotes/Reposts d'humoristes** : réagir à l'actualité stand-up, visibilité organique
3. **Cross-pollination site ↔ social** : contenu quotidien → post auto, blog → thread auto
4. **Threads viraux hebdomadaires** : format qui génère le plus de follows organiques

### Fichiers clés
| Fichier | Rôle |
|---|---|
| `lib/ai/agents/social-media-agent.ts` | Agent dédié social-native |
| `lib/ai/agents/standup-director-agent.ts` | + `validateSocialPost()` + `directorRewriteSocialPost()` |
| `lib/social/buffer-client.ts` | Client Buffer GraphQL API (publie sur toutes les plateformes) |
| `lib/social/twitter-client.ts` | (legacy) Client Twitter API v2 — remplacé par Buffer |
| `lib/social/linkedin-client.ts` | (legacy) Client LinkedIn Posts API — remplacé par Buffer |
| `lib/social/instagram-client.ts` | (legacy) Client Meta Graph API — remplacé par Buffer |
| `lib/social/image-generator.ts` | Génération visuels via satori (Instagram) |
| `lib/social/templates/*.tsx` | Templates JSX charte visuelle (Instagram) |
| `app/admin/social/page.tsx` | Dashboard validation 1-clic |
| `app/api/cron/daily-social/route.ts` | Cron génération quotidienne |
| `app/api/cron/publish-social/route.ts` | Cron publication via Buffer |
| `app/api/cron/social-analytics/route.ts` | Cron suivi + nettoyage (analytics via dashboard Buffer) |
| `social-editorial-plan.json` | Planning éditorial social |

### Publication via Buffer (mars 2026)
La publication sur Twitter, LinkedIn et Instagram passe par **Buffer** (GraphQL API).
Buffer gère les connexions OAuth, le scheduling et la publication effective.
- Plus besoin de gérer les tokens Twitter/LinkedIn/Instagram directement
- Analytics détaillées dans le dashboard Buffer (https://publish.buffer.com)
- Un seul token API à maintenir

### Secrets Replit nécessaires
```
BUFFER_ACCESS_TOKEN       — Token API Buffer (Settings > API dans Buffer)
BUFFER_ORGANIZATION_ID    — ID de l'organisation Buffer
BUFFER_CHANNEL_TWITTER    — Channel ID du profil Twitter dans Buffer
BUFFER_CHANNEL_LINKEDIN   — Channel ID de la page LinkedIn dans Buffer
BUFFER_CHANNEL_INSTAGRAM  — Channel ID du profil Instagram dans Buffer (REQUIS pour publier sur Instagram)
```

### Setup Buffer — Guide
1. Créer un compte sur https://buffer.com (plan Essentials ~6$/mois)
2. Connecter les profils : Twitter, LinkedIn (page entreprise), Instagram
3. **Settings > API** : générer un API token → `BUFFER_ACCESS_TOKEN`
4. Pour récupérer les Channel IDs : appeler l'endpoint GET `/api/admin/buffer-channels?secret=CRON_SECRET` ou utiliser la query GraphQL `GetChannels` avec l'Organization ID
5. Ajouter les 5 secrets dans Replit (onglet Secrets)

## GEO — Generative Engine Optimization (optimisation pour LLM)

### Score actuel : 78/100 → objectif 90/100

### Stratégie GEO
Les LLM (ChatGPT, Perplexity, Gemini, Claude) sont un canal d'acquisition majeur. Le contenu du site doit être **structuré pour être cité** par les IA génératives.

### Optimisations déployées (19 mars 2026)
- **Person schema auteur** (`authorPersonJsonLd`) : injecté sur `/blog/[slug]` et `/a-propos` — E-E-A-T pour LLM
- **CollectionPage schema** : injecté sur `/vannes`, `/conseils`, `/videos` — LLMs identifient les catalogues
- **Instructions GEO dans l'agent SEO** : listes numérotées, citation-worthy statements, contre-exemples bon/mauvais
- **robots.txt** : tous les bots LLM explicitement autorisés (GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, etc.)

### Règles GEO pour les articles blog
- Au moins 3 listes numérotées par article (LLMs extraient les listes pour leurs réponses)
- Des "citation-worthy statements" : `> **CLEF :** [affirmation mémorable]`
- Au moins 1 statistique/référence sourcée
- H2 formulés comme des questions conversationnelles
- Concepts clés définis clairement en 1-2 phrases
- **RÈGLE ABSOLUE** : le GEO ne doit JAMAIS tuer l'humour — listes et blockquotes doivent être drôles

### Schemas JSON-LD déployés
| Schema | Pages | Fichier |
|---|---|---|
| Organization | Toutes (root layout) | `json-ld.tsx` |
| WebSite + SearchAction | Toutes (root layout) | `json-ld.tsx` |
| Person (auteur) | `/blog/[slug]`, `/a-propos` | `json-ld.tsx` |
| Article | `/blog/[slug]` | `json-ld.tsx` |
| FAQPage | `/blog/[slug]`, `/vannes`, `/conseils`, `/videos`, `/a-propos`, homepage | `json-ld.tsx` |
| HowTo | `/blog/[slug]` (GUIDE/PRATIQUE/ROADMAP) | `json-ld.tsx` |
| BreadcrumbList | Toutes les pages | `json-ld.tsx` |
| CollectionPage | `/vannes`, `/conseils`, `/videos` | `json-ld.tsx` |
| Course | `/parcours`, `/parcours/[slug]` | `json-ld.tsx` |
| DefinedTermSet | `/glossaire` | `json-ld.tsx` |
| Product | `/abonnement` | `json-ld.tsx` |

### Prochaines optimisations GEO (backlog)
- [ ] Reformater les 5 articles pillar avec listes numérotées + définitions encadrées
- [ ] Ajouter rel="next"/rel="prev" sur pagination
- [ ] Créer articles "People Also Ask" manquants

## Architecture des clusters blog — Règles

### Membership unique
- **Chaque slug n'appartient qu'à UN seul cluster** (pas de shared slugs)
- Les articles transversaux doivent être classés par **intention primaire**
- Fichier : `apps/web/src/lib/blog-clusters.ts`

### 9 clusters
| Cluster | Pillar | Satellites |
|---|---|---|
| apprendre-humour | comment-devenir-drole | 5 |
| techniques-repartie | comment-avoir-de-la-repartie | 4 |
| techniques-delivery | timing-humour | 3 |
| types-humour | 5-types-humour-lequel-pour-toi | 3 |
| humour-contexte | blagues-travail-faire-rire-pro | 2 |
| apprendre-des-pros | techniques-standup-vie-sociale | 3 |
| douleurs-personas | je-suis-pas-drole-comment-changer | 5 |
| fort-volume | meilleures-blagues-droles-2026 | 5 |
| saisonnier | blagues-fetes-noel-nouvel-an | 2 |

### Fallback par catégorie
- `CATEGORY_TO_CLUSTER` mappe 15 catégories (dont SAISONNIER) vers les clusters
- `resolveCluster(slug, category?)` : slug d'abord, puis fallback par catégorie

## Compteurs d'affichage — Règle d'arrondi

### Règle
- Les compteurs affichés sont **arrondis à la dizaine inférieure** : 294 → 290+, 71 → 70+, 89 → 80+
- `roundToTen()` dans `hooks/use-content-stats.ts` centralise l'arrondi pour les composants dynamiques
- Les compteurs hardcodés (meta titles, descriptions, schemas) suivent la même règle
- **Incrémenter** uniquement quand le seuil de la dizaine suivante est atteint

### Compteurs actuels (mars 2026)
- Vannes : **290+** (289 réelles)
- Conseils : **60+** (66 réels)
- Vidéos : **80+** (89 réelles)

## Agent HARO — Backlinks presse automatisés

### Rôle
L'agent HARO génère des réponses d'expert au nom d'Alex pour obtenir des **backlinks de presse** (HARO, Connectively, SourceBottle, Qwoted, JournalRequest).

### Pipeline
```
Source opportunités → POST /api/cron/haro
  → filterRelevantOpportunities() (96 sujets pertinents)
  → generateHaroResponse() (hook drôle + réponse expert)
  → Score < 5 ? → skip
  → Score ≥ 5 ? → sendHaroDraftForReview() → email à alex@deviens-marrant.fr
  → Alex copie-colle et envoie au journaliste
```

### Fichiers clés
| Fichier | Rôle |
|---|---|
| `lib/ai/agents/haro-agent.ts` | Agent génération + filtrage + envoi |
| `app/api/cron/haro/route.ts` | Endpoint POST (webhook) + GET (statut) |

### Automatisation actuelle
- **Filtrage automatique** : 96 topics pertinents (humour, communication, confiance, dating, networking, etc.)
- **Génération automatique** : hook drôle + réponse expert 3-4 phrases + bio Alex
- **Score de pertinence** : 1-10, seuls les ≥5 sont envoyés
- **Email automatique** : draft envoyé à alex@deviens-marrant.fr via Resend

### Ce qui reste MANUEL
- **Source des opportunités** : pas de scraping automatique (HARO a fermé, Connectively nécessite un scraper ou Zapier)
- **Envoi final** : Alex copie-colle la réponse et l'envoie (pas d'envoi direct au journaliste)

### Secrets Replit nécessaires
```
CRON_SECRET (auth du cron)
RESEND_API_KEY (envoi email)
EMAIL_FROM (optionnel, défaut: noreply@deviens-marrant.fr)
```

## Historique des audits

### Audit SEO + Sécurité + UX — 15 mars 2026
Branche : `claude/seo-audit-optimization-EU7uv`

#### Sécurité (7 fixes)
- `auth.ts` : Retrait `allowDangerousEmailAccountLinking`, JWT maxAge 30j
- `register/route.ts` : Password minimum 12 caractères (était 8)
- `indexnow/route.ts` : Clé IndexNow via `process.env.INDEXNOW_KEY`
- `next.config.js` : Headers CSP + HSTS ajoutés
- `globals.css` : `prefers-reduced-motion: reduce` pour accessibilité

#### Base de données (4 fixes)
- `schema.prisma` : Model `WebhookEvent` (dédup Stripe persistante), index `JokeLike.jokeId`, `onDelete: Cascade` sur DailyContent
- `parcours/[id]/progress/route.ts` : `$transaction()` pour XP atomique

#### Stripe & Achat (6 fixes)
- Nouveau endpoint `/api/stripe/portal` (portail client Stripe)
- `profil-dashboard.tsx` : Bouton "Gérer mon abonnement"
- `webhook/route.ts` : Dédup via DB (plus de Map in-memory), events `invoice.payment_succeeded` + `charge.refunded`
- `stripe.ts` : Prix depuis `STRIPE_PRICE_ID` env var
- `premium-cta.tsx` : Tableau comparatif FREE vs PREMIUM

#### Frontend & Accessibilité (5 fixes)
- `youtube-player.tsx` : Thumbnail via `next/image` + alt text
- `page.tsx` (home) : Lazy-load `PremiumCta` + `HomeCta` via `dynamic()`
- Forms auth : `aria-describedby` + `aria-invalid` sur tous les champs
- `register/page.tsx` : Validation Zod côté client
- `next.config.js` : 3 redirects 301 anti-cannibalisation SEO

#### UX & Contenu (5 fixes)
- `humor-quiz.tsx` : Persistance résultat quiz dans localStorage
- Limites gratuites augmentées : blagues 50, conseils 15, vidéos 25, favoris 50
- Nouvelle page `/retractation` (obligation légale, directive 2011/83/UE)
- `footer.tsx` : Lien rétractation ajouté
- `premium-cta.tsx` : Mention "Sans engagement" + lien rétractation

#### Favicon (16 mars 2026)
- `favicon.ico` créé (multi-size 16+32+48px) — Google+Bing
- `favicon.png` régénéré à 48x48 (min Google SERP, était 32x32)
- `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` régénérés depuis SVG source
- `layout.tsx` : favicon.ico déclaré en premier + `rel="shortcut icon"` pour Bing + icon-512 ajouté
- `manifest.json` : taille favicon corrigée 32→48

#### Modal portal fix (16 mars 2026)
- `modal.tsx` : `createPortal(…, document.body)` — corrige le PremiumModal qui s'affichait inline dans les Cards au lieu d'en popup (cause : `animate-stagger-in` avec `transform` casse `position: fixed`)
- Impact : toutes les pages avec FavoriteButton (vannes, conseils, vidéos, daily-content)

#### Teasers variés vannes (16 mars 2026)
- `vannes-list.tsx` : 8 phrases de teaser en rotation au lieu du texte unique "Tape pour la chute"

#### Tests pre-existants en échec (non liés à l'audit)
- `blog.test.tsx` et `parcours-list.test.tsx` — à corriger séparément

#### Limites gratuites actuelles
- Blagues : 10, Conseils : 3, Vidéos : 3, Favoris : Premium uniquement + contenu du jour renouvelé quotidiennement

### Audit qualité vannes — 18 mars 2026
Branche : `claude/fix-login-redirect-navigation-XCsj1`

#### Catalogue vannes (blagues-seed.json) — 320 → 289 vannes
- **58 vannes supprimées** : 19 objets qui parlent, 6 doublons conceptuels, 33 vannes faibles
- **27 nouvelles vannes** ajoutées (absurde situationnel, vrais jeux de mots, comebacks, observations)
- **5 punchlines raccourcies** (trop longues par rapport au setup)
- **10 vannes recatégorisées** (étaient mal classées en JEUX_DE_MOTS au lieu de leur vraie catégorie)
- Chaque vanne restante passe le Test Stand-Up : « je la sors ce soir en soirée ? »

#### Agent IA vannes (joke-agent.ts) — brief réécrit niveau stand-up pro
- System prompt réécrit de zéro avec la posture d'un auteur stand-up (Fary, Paul Mirabel, Roman Frayssinet)
- Test Stand-Up intégré au prompt avec exemples concrets bon/mauvais
- 7 critères de rejet automatique + 5 critères de qualité obligatoires
- User prompt renforcé : l'IA doit se relire et valider « est-ce que ça fait rire ? » avant de répondre
- Validation programmatique : warning si punchline plus longue que le setup

#### Seed script (seed-data.ts) — désactivation automatique
- Les vannes seed retirées du fichier JSON sont automatiquement désactivées (`isActive: false`) au prochain seed
- Protège les vannes générées par l'IA (`generatedByAI: true` non touchées)
- Préserve les favoris et likes existants (pas de suppression, juste désactivation)

#### Règle qualité permanente ajoutée au CLAUDE.md
- Section « Contrôle qualité vannes — Le Test Stand-Up » avec critères de rejet et de qualité
- Workflow obligatoire pour tout ajout/modification de vanne
- S'applique au catalogue seed ET aux futures vannes générées par l'IA

### Audit qualité conseils — 18 mars 2026
Branche : `claude/fix-login-redirect-navigation-XCsj1`

#### Catalogue conseils (conseils-seed.json) — 60 → 66 conseils
- **12 supprimés** : doublons autodérision/storytelling, filler, exemple avouant être nul (ID 35)
- **9 corrigés** : exemples faibles, contenu vague, déconnexion titre/contenu
- **18 nouveaux** : 5 TIMING, 4 Marc-focused, 3 Sophie pro, 4 Yanis, 2 transversaux
- **34 exercices** standardisés au format "DÉFI [NOM] : ..." (66/66)
- TIMING renforcé de 5 → 10 | Marc passe de 0 → 4 conseils dédiés

#### Agent IA conseils (tip-agent.ts) — brief réécrit niveau coach stand-up
- Posture coach d'impro (atelier > amphi)
- Test du Coach : "est-ce que le persona peut l'appliquer AUJOURD'HUI ?"
- 6 critères de rejet + 5 critères de qualité + exemples bon/mauvais
- Validation programmatique : format DÉFI, dialogue dans l'exemple, contenu min 60 mots

#### Seed script (seed-data.ts)
- Désactivation automatique des conseils retirés du seed (`isActive: false`)
- Protège les conseils IA (`generatedByAI: true` non touchés)

### Audit qualité vidéos — 18 mars 2026
Branche : `claude/fix-login-redirect-navigation-XCsj1`

#### Catalogue vidéos (videos-seed.json) — 89 vidéos
- **84 exercices** standardisés au format "DÉFI [NOM] : ..." (89/89)
- **8 descriptions** génériques réécrites (contexte spécifique au lieu de "excellent exemple")
- **8 techniques** standardisées (variantes ramenées aux 7 catégories)
- Note : Montreux Comedy = 36% du catalogue, à rééquilibrer progressivement

#### Agent IA vidéos (video-agent.ts) — brief réécrit niveau directeur artistique
- 5 critères de sélection hiérarchisés : pédagogie > niveau > diversité > chaîne > catégorie
- Critère de diversité de chaîne intégré
- User prompt : "ce qui fait le plus progresser" plutôt que "le plus drôle"

### Audit qualité parcours — 18 mars 2026
Branche : `claude/fix-login-redirect-navigation-XCsj1`

#### Parcours-seed.json — source unique créée puis enrichie
- **Fichier créé** : `docs/content/parcours-seed.json` — source unique de vérité pour les 3 parcours
- **Curation par persona** : chaque step mappe un conseil spécifique au persona (Sophie→café/timing, Yanis→répartie/chambrages, Marc→confiance/style)
- **Alignement steps/semaines** : Machine à Café 3 steps (3 sem), Répartie 4 steps (4 sem), Confiance 6 steps (6 sem)
- **Enrichissement marketing** : moduleTitle, moduleDetail, moduleFormat, moduleXp, testimonial, personaTagline intégrés dans le seed
- **Seed-data.ts** : matching par titre de conseil (plus par index) pour lier les bons tips aux bons parcours

#### parcours-content.tsx — refactoring source unique
- **Import direct** de `parcours-seed.json` — plus de données hardcodées dans le composant
- Les modules, XP, descriptions, testimonials viennent tous du seed
- Le composant transforme le seed en données d'affichage via `.map()`
- 24 tests passent sans modification

#### Diversité vidéos — règle de rééquilibrage progressif
- Montreux Comedy à 36% — contenu de qualité, conservé intégralement
- Règle permanente ajoutée au CLAUDE.md : nouvelles vidéos = chaînes sous-représentées
- Agent vidéo (`video-agent.ts`) : critère 4 renforcé avec objectif <25% par chaîne
- Critère 6 ajouté : enrichissement obligatoire via chaînes sous-représentées

### Audit qualité blog — 18 mars 2026
Branche : `claude/fix-login-redirect-navigation-XCsj1`

#### Articles statiques (blog-articles.ts) — 7 → 5 articles (fusions anti-cannibalisation)
- **2 fusions** : `techniques-repartie` absorbé dans `comment-avoir-de-la-repartie` | `apprendre-etre-drole` absorbé dans `comment-devenir-drole`
- **5 articles réécrits de zéro** : humour injecté (min 3 vannes/article), refs modernisées, exemples drôles concrets
- **Catégorie corrigée** : `erreurs-blagues` passe de STORYTELLING à GUIDE
- **Refs modernisées** : priorité Paul Mirabel, Fary, Roman Frayssinet, Blanche Gardin, Waly Dia, Panayotis Pascot | Jamel/Gad/Foresti limités à 1 mention max
- **4 redirects 301** ajoutés dans `next.config.js` pour les slugs fusionnés

#### Agent SEO blog (seo-blog-agent.ts) — brief réécrit niveau stand-up
- Règle #1 "Le blog est la DÉMO du produit" — minimum 3 traits d'humour par article
- Quotas humoristes : prioritaires (min 2/article) vs legacy (max 1/article)
- Anti-cannibalisation : vérification slug statique + DB avant publication
- Variation de formats obligatoire : pas de listicle si les 2 derniers en étaient
- Test final intégré : "est-ce que le lecteur sourit au moins 3 fois ?"

#### Planning éditorial (seo-editorial-plan.json) — v2.0
- Cannibalisation résolue : 2 paires fusionnées, statut "resolved"
- Quality rules enrichies : humour obligatoire, refs modernes, formats variés, anti-cannibalisation
- `humoristQuotas` ajouté : legacy (max 1) vs priority (min 2) par article
- `formatNote` ajouté sur chaque article planifié pour varier les formats
- Cluster `techniques-delivery` ajouté (timing + erreurs + storytelling)
- Article pillar stand-up modernisé : Paul Mirabel/Fary/Blanche Gardin/Roman Frayssinet au lieu de Jamel/Gad/Foresti

### Création Stand-Up Director Agent — 18 mars 2026
Branche : `claude/fix-login-redirect-navigation-XCsj1`

#### Agent Stand-Up Director (standup-director-agent.ts) — créé de zéro
- **Directeur artistique** : gardien qualité de tous les contenus du site
- **Double mission** : site n°1 du stand-up français + plateforme de formation n°1
- **6 fonctions de validation** : validateJoke, validateTip, validateVideoSelection, validateBlogArticle, generateEditorialVision, reviewContentBatch
- **3 fonctions de réécriture** : directorRewriteJoke, directorRewriteTip, directorRewriteBlogArticle
- **5 tests universels** : Test du Pote, Test du Concret, Test du Doublon, Test du Persona, Test de la Barre
- **Verdicts** : APPROVED (≥7), NEEDS_REVISION (4-6), REJECTED (≤3) avec cohérence verdict/score

#### Intégration dans les pipelines (daily-publisher.ts + seo-blog-agent.ts)
- **Boucle generate→validate→retry** (max 3 tentatives) intégrée dans `publishDailyContent()` et `publishWeeklyArticle()`
- **Après 3 échecs** : le directeur réécrit lui-même le contenu et le publie
- **Graceful fallback** : si l'API de validation/réécriture crash, le contenu est publié tel quel
- **Vannes** : generateDailyJoke → validateJoke → REJECTED? → re-generate avec feedback → 3x? → directorRewriteJoke → save
- **Conseils** : generateDailyTip → validateTip → REJECTED? → re-generate avec feedback → 3x? → directorRewriteTip → save
- **Vidéos** : selectDailyVideo → validateVideoSelection → REJECTED? → exclure vidéo + re-select → 3x? → publish last
- **Blog** : generateArticle → validateBlogArticle → REJECTED? → re-generate avec feedback → 3x? → directorRewriteBlogArticle → save

#### Critères SEO blog renforcés dans la validation directeur
- Mot-clé dans intro, 2-3 H2/H3, conclusion
- Titre < 60 chars, meta 150-155 chars, min 5 liens internes
- FAQ schema, structure H2/H3, 1500-2500 mots, anti-keyword-stuffing
- Anti-cannibalisation vérifié

#### Tests — 80 tests passent dans ai-agents.test.ts
- 17 tests Stand-Up Director (validation, réécriture, edge cases)
- 4 tests intégration pipeline (approve, reject, 3-failure-rewrite, API-error)
- Aucune régression sur les 59 tests pré-existants

### Audit GEO + Maillage + Compteurs — 19 mars 2026
Branche : `claude/seo-keyword-analysis-idfz3`

#### GEO (Generative Engine Optimization) — Score 78/100
- **Person schema auteur** ajouté sur `/blog/[slug]` et `/a-propos` (jobTitle: "Fondateur & Coach d'humour")
- **CollectionPage schema** ajouté sur `/vannes`, `/conseils`, `/videos` avec `relatedArticles`
- **Instructions GEO** dans le prompt de `seo-blog-agent.ts` : listes numérotées, citation-worthy statements, contre-exemples bon/mauvais
- Validé par le Stand-Up Director (3/4 APPROVED, 1 NEEDS_REVISION corrigé)

#### Fix clusters blog (blog-clusters.ts)
- **SAISONNIER** ajouté à `CATEGORY_TO_CLUSTER` (manquait — articles saisonniers étaient orphelins)
- **Shared slugs** corrigés : `repartie-soiree-anti-malaise` et `conversation-machine-a-cafe` retirés de `humour-contexte` (gardés dans leur cluster primaire)
- **Mock test** mis à jour : `resolveCluster` + `getClusterForCategory` ajoutés au mock `blog.test.tsx`

#### Compteurs arrondis
- `roundToTen()` centralisé dans `hooks/use-content-stats.ts`
- Hardcoded harmonisé : 289→290+, 66→60+, 89→80+ dans meta titles, descriptions, schemas, pages cross-ref
- Fichiers impactés : vannes, conseils, videos, page d'accueil, abonnement, parcours, haro-agent

#### Tests
- 826 tests passent (60 suites, 0 échec)

### Audit directeur stand-up v2 — Directives 9.5/10 (22 mars 2026)
Branche : `claude/fix-social-media-posting-5nltR`

#### 5 directives implémentées dans social-media-agent.ts (getDailyPlan + getSchedulingHint)
- **Wild cards** : 2 slots réactifs/semaine (mercredi + samedi) — tweets "WILD CARD" pour réagir à l'actu stand-up, trends, memes, shows
- **Marc dating** : 1 tweet dédié le jeudi quand persona MARC — "premier date après 8 ans, comment ne pas être le mec gênant"
- **Marc hints** : "inspirant" → "actionnable (un truc à tester aujourd'hui)" / "reconstruction, motivation douce" → "come-back, une technique concrète à appliquer demain"
- **Yanis gen Z** : rotation de refs culturelles (`memes/TikTok`, `Netflix/séries`, `rap FR/musique`, `gaming/stream`, `dating apps`) injectées dans thèmes tweets, Instagram et scheduling hints via `yanisGenZRefs`
- **Sophie Vanne Réécrite Social** : tous les tweets JOKE de Sophie reformulés "Vanne Réécrite Social — prête à ressortir mot pour mot" avec contexte adapté (machine à café, afterwork, dîner)

#### Fix sécurité tonalité — fallback validation directeur (22 mars 2026)
- **Problème** : si l'API du Stand-Up Director crash pendant la validation, les posts étaient sauvés `APPROVED` et publiés automatiquement sans validation tonalité
- **Fix** : ajout flag `directorValidated: boolean` sur `GeneratedSocialPost`
- 4 chemins de fallback corrigés dans `validateAndRefinePost()` : tout crash → `directorValidated: false`
- `daily-social/route.ts` : `directorValidated === false` → `status: "PENDING"` + `directorNote: "⚠️ review manuelle requise"`
- Seuls les posts explicitement APPROVED par le directeur (score ≥ 9) ou réécrits par lui sont publiés automatiquement
- Les posts non validés apparaissent dans `/admin/social` pour review manuelle

#### Planning éditorial (social-editorial-plan.json) — v2 mis à jour
- `directorDirectives_v2` documentant les 5 changements, objectif 9.5/10
- `wildCardsPerWeek: 2` ajouté à la config Twitter
- `schedulingByPersona` enrichi : Yanis `genZRefs`, Sophie `priorityFormat: VANNE_REECRITE_SOCIAL`, Marc `datingTweetDay: jeudi`
- Weekly schedule mis à jour (mercredi/samedi wild cards, jeudi Marc dating)

#### Tests
- 915/915 tests passent après les deux commits

## Référence rapide — Interaction avec la base de données

### ORM & Config
- **ORM** : Prisma v6.2.0, PostgreSQL
- **Schema** : `prisma/schema.prisma` (+ copie dans `apps/web/prisma/schema.prisma`)
- **Client singleton** : `apps/web/src/lib/prisma.ts`
- **DATABASE_URL** : dans Secrets Replit

### Modèles principaux
| Modèle | Champs clés | Notes |
|---|---|---|
| `Joke` | content, punchline, category (13 enums), maturityLevel, type (7 enums), isActive, generatedByAI | Unique sur content (logique seed) |
| `Tip` | title, content, category (7 enums), difficulty, example, exercise, isActive, generatedByAI | |
| `Video` | youtubeId (unique), title, channelName, duration, category, difficulty, description, technique, learnings[], exercise, isActive, generatedByAI | |
| `DailyContent` | date (unique), jokeId, tipId, videoId | Rotation quotidienne |
| `SocialPost` | platform, format, content, hook, cta, hashtags[], targetPersona, status (PENDING/APPROVED/PUBLISHED/REJECTED/FAILED), directorScore, scheduledAt, publishedAt, externalId, analytics | |
| `BlogArticle` | slug (unique), title, excerpt, content, category, readingTime, targetKeyword, metaTitle, metaDescription, isPublished, publishedAt, generatedByAI | |
| `LearningPath` | title, slug (unique), duration, difficulty, icon, order, isActive | Steps via `LearningPathStep` |
| `User` | plan (FREE/PREMIUM), level, xp, streak | Auth via NextAuth |
| `UserFavorite` | userId, contentType, jokeId/tipId/videoId | |
| `ContentPlan` | agentType, month, year | Entries via `ContentPlanEntry` |

### 5 méthodes d'interaction DB

#### 1. API Admin (`/api/admin/db`) — CRUD direct
```
# Lire des vannes
GET /api/admin/db?secret=ADMIN_PASSWORD&model=Joke&action=query&where={"isActive":true,"category":"ABSURDE"}&take=10

# Modifier une vanne
POST /api/admin/db
Authorization: Bearer {ADMIN_PASSWORD}
{"action":"update","model":"Joke","where":{"id":"clx123"},"data":{"content":"Nouveau texte","isActive":false}}

# Créer un contenu
POST /api/admin/db
{"action":"update","model":"Joke","data":{"content":"...","punchline":"...","category":"ABSURDE"}}
```
Modèles autorisés : Joke, Tip, Video, DailyContent, SocialPost, BlogArticle, ContentPlan, LearningPath, LearningPathStep, User (read-only), Subscription (read-only), UserFavorite (read-only).

#### 2. Seed files + `npm run db:seed`
- Éditer les JSON dans `docs/content/` (blagues-seed.json, conseils-seed.json, videos-seed.json, parcours-seed.json)
- Lancer `npm run db:seed` (ou `npx prisma db seed`)
- Le seed **désactive** (`isActive: false`) les entrées supprimées du JSON (préserve les favoris/likes)
- Le seed **protège** les contenus IA (`generatedByAI: true` non touchés)
- Script : `apps/web/scripts/seed.sh` → compile `prisma/seed-data.ts` via esbuild

#### 3. Crons automatisés (`/api/cron/*`)
| Cron | Horaire | Action |
|---|---|---|
| `/cron/daily-content?secret=CRON_SECRET` | 5h-6h UTC | Génère vanne + conseil + vidéo du jour (force=true pour regénérer) |
| `/cron/weekly-seo?secret=CRON_SECRET` | Lundi 9h UTC | Publie un article blog SEO |
| `/cron/daily-social?secret=CRON_SECRET` | 4h UTC | Génère les posts sociaux |
| `/cron/publish-social?secret=CRON_SECRET` | Toutes les 30 min | Publie les posts APPROVED via Buffer |
| `/cron/social-analytics?secret=CRON_SECRET` | 1x/jour | Pull metrics + nettoyage |
| `/cron/monthly-plan?secret=CRON_SECRET` | 28 du mois | Plans mensuels pour tous les agents |
| `/cron/monthly-videos?secret=CRON_SECRET` | 1er du mois | Découvre et ajoute 10 nouvelles vidéos au catalogue |

#### 4. Admin Social (`/api/admin/social`)
```
# Voir les posts en attente
GET /api/admin/social?secret=ADMIN_PASSWORD&status=PENDING

# Approuver un post
POST /api/admin/social {"action":"approve","postIds":["clx456"]}

# Rejeter
POST /api/admin/social {"action":"reject","postIds":["clx789"],"reason":"Pas assez punchy"}

# Approuver en masse (score ≥ 9 uniquement)
POST /api/admin/social {"action":"approve_all"}
```

#### 5. Code Prisma direct (dans les API routes/agents)
```typescript
import { prisma } from "@/lib/prisma";

// Lire
const jokes = await prisma.joke.findMany({ where: { isActive: true }, take: 10 });

// Créer
await prisma.joke.create({ data: { content: "...", punchline: "...", category: "ABSURDE" } });

// Modifier
await prisma.joke.update({ where: { id: "clx..." }, data: { isActive: false } });

// Supprimer
await prisma.joke.delete({ where: { id: "clx..." } });

// Transaction atomique
await prisma.$transaction(async (tx) => { ... });
```

### Chemins essentiels
| Item | Chemin |
|---|---|
| Schema Prisma | `prisma/schema.prisma` |
| Client Prisma | `apps/web/src/lib/prisma.ts` |
| Seed TS | `apps/web/prisma/seed-data.ts` |
| Seed JSON vannes | `docs/content/blagues-seed.json` |
| Seed JSON conseils | `docs/content/conseils-seed.json` |
| Seed JSON vidéos | `docs/content/videos-seed.json` |
| Seed JSON parcours | `docs/content/parcours-seed.json` |
| Admin DB route | `apps/web/src/app/api/admin/db/route.ts` |
| Admin Social route | `apps/web/src/app/api/admin/social/route.ts` |
| Daily Publisher | `apps/web/src/lib/ai/daily-publisher.ts` |
| Articles statiques blog | `apps/web/src/lib/blog-articles.ts` |
| Clusters blog | `apps/web/src/lib/blog-clusters.ts` |

### Corrections de contenu en session
Pour corriger du contenu (vannes, conseils, vidéos, articles, posts sociaux) :
1. **Via seed** : modifier le JSON correspondant dans `docs/content/` → `npm run db:seed`
2. **Via API admin** : `POST /api/admin/db` avec action update/delete sur le modèle
3. **Via code** : éditer directement les fichiers source (blog-articles.ts pour les articles statiques, seed JSON pour le catalogue)
4. **Désactiver sans supprimer** : `{"action":"update","model":"Joke","where":{"id":"..."},"data":{"isActive":false}}`



<!-- GRADIENT-AGENTS-START -->
# Gradient Agents — Instructions globales

## Règle absolue — Contexte obligatoire (n°1)

Avant toute action dans ce projet, lire `project-context.md` à la racine.
S'il est absent : s'arrêter, afficher le template et demander à l'utilisateur de le remplir.
Ne jamais commencer un travail sans contexte projet validé.

## Quick Start

1. Remplis `project-context.md` à la racine (copie le template depuis `templates/`)
2. Dis à Claude : `@orchestrator lance mon projet`
3. Réponds aux questions des agents. C'est tout.

Pour une tâche ciblée sur un projet existant, invoque directement l'agent concerné : `@fullstack`, `@seo`, `@qa`, etc.

> **Installation dans un autre projet :** voir `INSTALL.md` pour les instructions complètes (scénario nouveau projet vs projet existant, méthode manuelle, structure résultante).

## Règle absolue — Mindset IA, pas équipe humaine (n°5)

Ce framework est opéré par des agents IA, pas par une équipe humaine. **Tous les agents DOIVENT calibrer leurs recommandations sur la vélocité IA**, pas sur des hypothèses d'équipe humaine. Concrètement :

### Ce qui change avec une équipe 100% IA

| Concept humain | Équivalent IA | Pourquoi |
|---|---|---|
| Sprint 2 semaines | Session de quelques heures | @fullstack code une feature complète en 20-30 min |
| MVP "minimal" — couper des features | V1 complète — tout coder, pas de scope réduit | Le coût marginal d'une feature supplémentaire est quasi nul. La seule raison d'exclure : pas de valeur pour le persona |
| RICE/MoSCoW pour décider quoi faire EN PREMIER | Dépendances strictes uniquement | Si A et B sont indépendants, faire les deux en parallèle |
| Roadmap now/next/later par trimestre | Plan d'exécution par dépendances | La seule contrainte est l'ordre logique, pas le temps |
| Vélocité en story points | Features par heure | Mesurer la capacité réelle, pas une estimation abstraite |
| "Activable en 2 semaines" | "Activable en quelques heures" | Les agents produisent en continu, pas en sprints |
| Séquencement A → B par défaut | Parallélisation par défaut, séquencement seulement si dépendance | L'orchestrateur lance TOUT en parallèle sauf dépendance stricte |

### Règles concrètes pour les agents

1. **Ne jamais produire de sprint-plan ou de vélocité estimée en jours/homme.** Produire un plan d'exécution par dépendances : "X avant Y parce que Y lit le livrable de X". Pas de timeline en semaines.
2. **Ne jamais couper une feature du scope "parce qu'on n'a pas le temps".** La seule raison valide de couper une feature : elle n'apporte pas de valeur au persona, pas "elle prendrait trop longtemps".
3. **Prioriser par valeur, pas par effort.** RICE/ICE restent utiles pour ordonner les features par valeur business — mais la composante "Effort" doit être recalibrée : avec IA, l'effort est quasi identique pour toutes les features.
4. **Paralléliser par défaut.** L'orchestrateur lance tous les agents indépendants en même temps. Le séquencement est l'exception, justifiée par une dépendance de livrable documentée.
5. **Tester tout, pas "les tests critiques uniquement".** @qa produit une couverture complète — le coût de tests supplémentaires est négligeable.

### Exception : contexte hybride

Si `project-context.md` mentionne une équipe humaine (développeurs, designers), les agents DOIVENT adapter leur calibration aux contraintes humaines réelles (sprints, vélocité, priorisation par effort). Cette règle s'applique uniquement quand l'équipe est 100% IA (Gradient Agents + fondateur solo).

### Automatisation par défaut du contenu récurrent

Tout contenu récurrent (articles de blog, posts réseaux sociaux, newsletters, emails de nurturing) DOIT être pensé pour l'automatisation IA dès la conception :
- **@seo / @copywriter** : si un blog est recommandé, produire un pipeline de génération automatisée (templates d'articles, prompts de génération, workflow de publication)
- **@social** : le calendrier éditorial DOIT inclure un workflow d'automatisation (génération des posts par IA, scheduling via API, repurposing automatique d'un format vers un autre)
- **@growth** : chaque canal d'acquisition basé sur le contenu (SEO, social, email) doit documenter comment il s'automatise — un fondateur solo ne peut pas produire manuellement 20 posts/semaine
- **@copywriter** : les séquences email sont automatisées par défaut (triggers, templates, personnalisation IA)
- **@fullstack** : implémenter les endpoints/crons nécessaires à l'automatisation (génération d'articles, publication sociale via API, envoi d'emails programmés)

**Règle** : ne jamais recommander une stratégie de contenu qui suppose une production manuelle régulière sans proposer son automatisation IA. Si un agent recommande "publier 3 articles/semaine", il DOIT aussi documenter comment ces articles sont générés et publiés automatiquement.

## Stratégie de modèles

Les agents utilisent deux modèles selon la complexité de leur tâche :
- **Opus** (`claude-opus-4-6`) : orchestrator, agent-factory, reviewer, elon, fullstack, ia, qa, infrastructure, moi — agents nécessitant un raisonnement complexe, de la coordination multi-étapes, ou de la génération de code
- **Sonnet** (`claude-sonnet-4-6`) : copywriter, creative-strategy, data-analyst, design, geo, growth, legal, product-manager, seo, social, ux — agents de production de contenu, stratégie, ou analyse

Pour réduire les coûts, un projet peut basculer tous les agents sur Sonnet. Pour maximiser la qualité, tout sur Opus. Modifier le champ `model` dans le frontmatter de chaque agent.

## Comment utiliser les agents

Les agents sont dans `.claude/agents/`. Chaque agent est un expert autonome.
Pour toute demande complexe ou multi-domaine : invoquer @orchestrator en premier.
Pour une tâche ciblée : invoquer directement l'agent concerné.

### Règle absolue — Toujours déléguer aux agents spécialisés (n°4)

**Ne JAMAIS produire un livrable à la place d'un agent spécialisé.** Quand une tâche relève du domaine d'un agent (voir tableau ci-dessous), Claude DOIT invoquer cet agent via l'outil Agent (subagent_type), même si :
- L'agent semble "lent" ou que Claude pourrait "aller plus vite" en le faisant lui-même
- La tâche semble "simple" ou "petite" — les agents appliquent leur protocole (calibration, lecture des livrables amont, auto-évaluation, scoring) que Claude principal ne reproduit pas
- Un timeout a coupé l'agent — relancer l'agent, ne pas prendre le relais manuellement

**Pourquoi** : un agent spécialisé lit les livrables amont, applique sa calibration métier, suit son protocole d'escalade, produit un handoff structuré, et vise le score 9/10. Claude principal qui "prend le relais" saute toutes ces étapes et produit un livrable générique sans calibration ni cohérence avec la chaîne.

**Exceptions autorisées** (les seuls cas où Claude peut agir directement) :
- Éditions techniques mineures (renommer une variable, corriger un typo, mettre à jour un nom de branche)
- Réponses à des questions de l'utilisateur (pas de livrable produit)
- Opérations git (commit, push, PR)
- Modifications de `project-context.md` ou `CLAUDE.md` (fichiers transversaux, pas des livrables agents)

## Ordre de priorité des agents par type de demande

| Type de demande | Agent principal | Agents secondaires |
|---|---|---|
| Nouveau projet complet | orchestrator | tous |
| Stratégie / positionnement | creative-strategy | product-manager |
| Code / développement | fullstack | qa, infrastructure, ia |
| Interface visuelle | design | ux |
| Parcours utilisateur | ux | design, copywriter |
| Contenu / texte | copywriter | seo, geo |
| Référencement | seo | geo, copywriter |
| Visibilité IA | geo | seo |
| Performance / déploiement | infrastructure | fullstack |
| Intégration LLM / IA | ia | fullstack, infrastructure |
| Analytics / mesure | data-analyst | product-manager |
| Acquisition / croissance | growth | social, data-analyst |
| Réseaux sociaux | social | copywriter, creative-strategy |
| Tests / qualité / non-régression | qa | fullstack, infrastructure |
| Revue croisée / cohérence | reviewer | orchestrator |
| Juridique / conformité | legal | — |
| Roadmap / backlog | product-manager | creative-strategy |
| Création d'agents spécialisés | agent-factory | ia, orchestrator |
| Audit stratégique / amélioration continue | elon | orchestrator, reviewer |
| Décision projet / arbitrage fondateur | moi | orchestrator |

## Convention d'appel

- `@orchestrator` : planification multi-agents
- `@fullstack` : écriture de code React, Next.js, Expo, API
- `@qa` : tests unitaires, E2E, intégration, pipeline CI/CD, audit qualité
- `@design` : UI, design system, composants visuels
- `@ux` : parcours, wireframes, conversion
- `@copywriter` : textes, landing pages, emails
- `@seo` : référencement technique et éditorial
- `@geo` : optimisation pour les LLM et moteurs génératifs
- `@ia` : intégrations LLM, choix de modèles, pipelines IA
- `@infrastructure` : configuration Replit, performance, CI/CD, monitoring post-launch
- `@creative-strategy` : positionnement, personas, plateforme de marque
- `@product-manager` : specs, roadmap, backlog
- `@data-analyst` : KPIs, tracking, analytics
- `@growth` : acquisition, funnel, PLG
- `@social` : stratégie et contenu réseaux sociaux
- `@reviewer` : revue croisée, cohérence inter-agents, validation finale
- `@legal` : RGPD, CGU, conformité
- `@agent-factory` : création d'agents spécialisés sur mesure pour le projet
- `@elon` : audit stratégique, challenge des décisions, amélioration continue du framework
- `@moi` : proxy décisionnel du fondateur Thomas, review de livrables et arbitrages comme Thomas le ferait

## Convention de chemin des livrables

Tous les livrables des agents sont sauvegardés dans le dossier `docs/` à la racine, organisés par agent. Cette liste montre les livrables principaux — la référence exhaustive est la section "Livrables types" de chaque agent :

```
docs/
├── strategy/          ← @creative-strategy : brand-platform.md, personas.md, creative-brief.md, competitive-benchmark.md
├── product/           ← @product-manager : product-vision.md, roadmap.md, functional-specs.md, backlog.md, execution-plan.md
├── analytics/         ← @data-analyst : kpi-framework.md, tracking-plan.md, dashboard-specs.md
├── ux/                ← @ux : user-flows.md, wireframes.md, ux-audit.md, onboarding-flow.md
├── design/            ← @design : design-system.md, design-tokens.json, component-library.md
├── copy/              ← @copywriter : brand-voice.md, landing-page-copy.md, email-sequences.md, ux-writing-guide.md
├── seo/               ← @seo : seo-strategy.md, keyword-map.md, metadata-templates.md
├── geo/               ← @geo : geo-strategy.md, content-restructuring.md, llm-content-templates.md
├── growth/            ← @growth : growth-strategy.md, acquisition-plan.md, funnel-audit.md
├── social/            ← @social : social-strategy.md, editorial-calendar.md, content-templates.md
├── legal/             ← @legal : legal-audit.md, cgu-draft.md, privacy-policy.md, rgpd-checklist.md
├── infra/             ← @infrastructure : infrastructure.md, performance-audit.md, security-checklist.md
├── ia/                ← @ia : ai-architecture.md, model-selection.md, prompt-library.md
├── qa/                ← @qa : qa-strategy.md, TESTING.md
├── reviews/           ← @reviewer : cross-review-report.md, consistency-audit.md
│                        @elon : elon-audit.md, strategic-review.md
```

Les fichiers de synthèse de l'orchestrateur (`project-synthesis.md`, `orchestration-plan.md`) sont à la racine de `docs/`.
Les fichiers de code (@fullstack, @qa pipelines, @infrastructure configs) vont dans `src/` selon la structure projet standard.

**Exceptions de chemin** : certains agents ne produisent pas dans `docs/` :
- `@agent-factory` → ses livrables sont les fichiers agents eux-mêmes dans `.claude/agents/` (+ modifications de `CLAUDE.md` et `orchestrator.md`)
- `@orchestrator` → `docs/orchestration-plan.md` et `docs/project-synthesis.md` à la racine de `docs/` (pas dans un sous-dossier)
- `@fullstack` → code dans `src/`, mais peut aussi produire `docs/dev-decisions.md` et `docs/api-documentation.md` à la racine de `docs/`

**Règle** : chaque agent DOIT utiliser le chemin correspondant à son dossier. Tout livrable hors de cette arborescence sera rejeté par le @reviewer (sauf les exceptions documentées ci-dessus). Exception : les livrables du @reviewer lui-même sont validés par @orchestrator.

## Règle absolue — Zéro invention de données (n°2)

**Ne JAMAIS inventer, deviner ou fabriquer une donnée manquante.** Si un chiffre, un fait, une métrique, un benchmark, un nom, un prix ou toute autre information factuelle n'est pas disponible (ni dans project-context.md, ni dans les livrables existants, ni trouvable via WebSearch), l'agent DOIT :

1. **Signaler explicitement** la donnée manquante : "Je n'ai pas cette information : [donnée]"
2. **Demander à l'utilisateur** de la fournir avant de continuer
3. **Ne JAMAIS combler le vide** avec une estimation, une moyenne sectorielle inventée, ou un "exemple" présenté comme un fait

### Cas des hypothèses de travail (assumptions)

Dans certains cas, avancer nécessite de poser une hypothèse. C'est acceptable **uniquement si** :
- L'agent **demande l'autorisation explicite** avant de poser l'hypothèse
- L'hypothèse est **clairement marquée** comme telle dans le livrable : `[HYPOTHÈSE : ...]`
- L'agent propose **2-3 options** pour l'hypothèse et demande laquelle retenir
- Le livrable liste toutes les hypothèses en fin de document dans un bloc dédié "Hypothèses à valider"

**Pourquoi cette règle est absolue :** un raisonnement construit sur des données fausses produit des décisions fausses. Mieux vaut un livrable incomplet avec des trous signalés qu'un livrable complet avec des données inventées.

### Exemples concrets

- **INTERDIT** : "Le taux de conversion moyen dans ce secteur est de 3.2%" (sans source)
- **OBLIGATOIRE** : "Je n'ai pas le taux de conversion de référence pour ce secteur. Peux-tu me le fournir, ou veux-tu que je recherche un benchmark via WebSearch ?"
- **ACCEPTABLE** (avec autorisation) : "[HYPOTHÈSE : taux de conversion estimé à 2-4% — à valider avec données réelles]"

## Règle absolue — Anti-timeout (n°3)

Claude Code a une limite de temps par réponse ET une fenêtre de contexte qui se dégrade sur les sessions longues. Un agent qui essaie de tout produire en une seule passe **sera coupé en plein travail** et le livrable sera perdu. Cette règle s'applique à TOUS les agents.

**Limite de session** : l'orchestrateur maintient un compteur de phases/agents et alerte l'utilisateur quand la session risque de dégénérer (voir orchestrator.md — Compteur de session obligatoire). Seuils : ALERTE JAUNE après 2 phases / 6 agents, ALERTE ROUGE après 3 phases / 10 agents. Un projet complet doit être découpé en plusieurs sessions.

### Principes anti-timeout

1. **Un fichier = un appel Write/Edit.** Ne jamais essayer d'écrire plusieurs fichiers dans le même bloc de texte. Écrire le fichier 1, puis le fichier 2, puis le fichier 3.
2. **Découper les gros livrables.** Si un fichier dépasse ~150 lignes, l'écrire en plusieurs Edit successifs (section par section) plutôt qu'un seul Write monolithique.
3. **Prioriser le contenu critique.** Toujours écrire d'abord les sections essentielles du livrable. Si un timeout survient, l'essentiel est sauvegardé.
4. **Sauvegarder au fur et à mesure.** Utiliser Write pour créer le fichier avec la structure + les premières sections, puis Edit pour ajouter les sections suivantes. Ne jamais accumuler du contenu en mémoire sans l'écrire.
5. **Signaler les livrables multi-fichiers.** Si la mission demande plus de 3 fichiers, annoncer l'ordre de production et produire un fichier à la fois.

### Pour l'orchestrateur spécifiquement

- **Ne JAMAIS lancer plus de 3 sous-agents (Task) dans un même message.** Lancer 2-3 Task, attendre leurs résultats, puis lancer les suivants.
- **Découper l'exécution par phase.** Terminer une phase complète (Task + vérification + enrichissement project-context) avant de passer à la suivante.
- **Préférer 3 messages courts à 1 message géant.** Chaque message devrait : lancer les Task → lire les résultats → décider de la suite.

### Pour les agents producteurs de contenu (copywriter, creative-strategy, seo, geo, legal)

- Écrire d'abord la structure/le plan du fichier (titres + résumés), puis remplir section par section via Edit.
- Ne jamais rédiger un document complet de >100 lignes en un seul Write.

### Pour les agents code (fullstack, qa, infrastructure)

- Un composant/fichier par appel Write. Ne jamais écrire 5 fichiers d'un coup.
- Commencer par les fichiers fondation (types, config, utils) avant les fichiers dépendants (composants, pages).

### En cas de timeout détecté

Si un agent a été interrompu par un timeout :
1. Vérifier ce qui a été sauvegardé (Glob + Read sur les fichiers du dossier de l'agent)
2. Reprendre là où le travail s'est arrêté — ne PAS repartir de zéro
3. Terminer les sections manquantes via Edit sur les fichiers existants

## Règles communes à tous les agents

1. Travailler exclusivement en français (sauf code et noms techniques)
2. Lire `project-context.md` avant toute production
3. **Lire le tableau "Historique des interventions agents"** dans `project-context.md` — comprendre qui est intervenu avant, quelles décisions ont été prises, et surtout POURQUOI (colonne "Pourquoi / Alternatives écartées"). Ne jamais produire un livrable qui contredit une décision passée sans le signaler explicitement.
4. Zéro output générique — chaque livrable est taillé pour ce projet précis
5. Objectif constant : faire de ce projet le numéro 1 de son secteur
6. Bloquer et signaler si le contexte est insuffisant
7. Terminer chaque livrable par un bloc Handoff standardisé
8. En mode révision : justifier chaque changement, ne pas tout réécrire
9. **Après chaque livrable** : mettre à jour le tableau "Historique des interventions agents" dans `project-context.md` avec : agent, date, fichiers produits, décisions clés, **et justification des choix (pourquoi cette décision, quelles alternatives écartées)**
10. **Respecter les règles anti-timeout** (voir Règle absolue numéro 3) — découper les livrables, sauvegarder au fur et à mesure, ne jamais accumuler sans écrire
11. **Objectif qualité : 100% gates PASS.** Chaque livrable sera évalué par @reviewer via 20 gates binaires (PASS/FAIL) réparties en BLOQUANT et REQUIS. Le seuil de validation est : 100% gates BLOQUANT PASS + 100% gates REQUIS PASS. Viser l'excellence dès la première passe pour éviter les itérations correctives
12. **Mise à jour du nom de branche obligatoire.** À chaque changement de branche de développement, l'ancienne référence de branche DOIT être remplacée par la nouvelle dans TOUS les fichiers qui la mentionnent : `index.html` (prompts d'installation frontend), `INSTALL.md`, `install.sh`, `update.sh`, et `project-context.md` (mémo de reprise). Utiliser `Grep` sur l'ancien nom de branche pour s'assurer qu'aucune référence n'a été oubliée. Cette mise à jour est la responsabilité de l'agent qui effectue le changement de branche (typiquement @orchestrator ou l'agent principal de la session)

## Protocole de test du framework

Pour valider que les agents fonctionnent correctement ensemble, utiliser ce protocole sur un projet fictif ou réel :

### Test unitaire (1 agent)
1. Remplir `project-context.md` avec un cas concret
2. Invoquer un agent isolé (ex : `@creative-strategy`)
3. Vérifier : lit-il bien project-context.md ? Refuse-t-il si champs manquants ? Le livrable est-il spécifique au projet ?

### Test d'intégration (2-3 agents en chaîne)
1. Lancer `@creative-strategy` → vérifier le handoff
2. Lancer `@copywriter` → vérifie-t-il le brand-platform de creative-strategy ?
3. Lancer `@design` → vérifie-t-il les wireframes UX ET le brand-platform ?
4. Vérifier : les livrables sont-ils cohérents entre eux ? Pas de contradictions ?

### Test E2E (orchestration complète)
1. Invoquer `@orchestrator` sur un projet complet
2. Vérifier : les phases s'exécutent-elles dans le bon ordre ? Les agents parallélisables sont-ils lancés ensemble ?
3. Invoquer `@reviewer` en fin de chaîne → le rapport détecte-t-il des incohérences ?

### Checklist de validation post-test
- [ ] Chaque agent a lu project-context.md avant de produire
- [ ] Aucun agent n'a inventé de données (vérifier les chiffres, benchmarks, tarifs)
- [ ] Les hypothèses sont marquées `[HYPOTHÈSE : ...]`
- [ ] Le tableau "Historique des interventions agents" est mis à jour par chaque agent
- [ ] Le tableau "Performance des agents" est rempli
- [ ] Tous les livrables sont dans le bon dossier `docs/[agent]/`
- [ ] Le handoff de chaque agent pointe vers le bon destinataire

### Projet test pré-configuré

Un `project-context.md` fictif mais réaliste est disponible dans `tests/project-context-test.md` (projet PulseBoard — analytics marketing pour PME). Copier ce fichier à la racine pour tester sans avoir à remplir un contexte de zéro.

### Contrôle qualité post-livrable — Système de gates binaires

Le contrôle qualité s'effectue en **deux temps** avec des responsabilités distinctes :

1. **Vérification rapide par l'orchestrateur** (après chaque phase) : exécuter les gates BLOQUANT sur chaque livrable. Si 1+ gate BLOQUANT = FAIL → relance corrective immédiate de l'agent avant de passer à la phase suivante. Objectif : éliminer les livrables insuffisants au fil de l'eau.
2. **Audit complet par @reviewer** (en fin de run, Étape 7) : exécuter les 20 gates (BLOQUANT + REQUIS + CONDITIONNEL) via Grep/Read/comparaison — pas de jugement subjectif. Boucle d'itération si besoin (max 3 passes). Les verdicts sont inscrits dans le tableau "Performance des agents".

### Les 20 gates binaires (PASS/FAIL)

Chaque livrable dans `docs/` est évalué par ces gates. Classification :
- **BLOQUANT** : 1 FAIL = NO-GO immédiat, relance obligatoire
- **REQUIS** : 1 FAIL = GO conditionnel (corriger dans la session)
- **CONDITIONNEL** : s'applique uniquement si la feature/le livrable amont existe

**COMPLÉTUDE**

| # | Gate | Classe | Vérification |
|---|---|---|---|
| G1 | Toutes les sections du template agent présentes (0 section vide/TODO) | BLOQUANT | Grep `[TODO]`, `[À REMPLIR]`, sections < 2 lignes |
| G2 | Les livrables amont référencés existent | REQUIS | Glob les chemins cités dans le livrable |
| G3 | Bloc Handoff structuré présent | BLOQUANT | Grep `Handoff` |
| G4 | Chaque donnée chiffrée a une source explicite (URL, livrable, ou marqueur `[HYPOTHÈSE]`) | REQUIS | Grep nombres, vérifier que chaque chiffre cite sa source |

**COHÉRENCE**

| # | Gate | Classe | Vérification |
|---|---|---|---|
| G5 | Persona identique à project-context.md | BLOQUANT | Grep nom persona dans le livrable. Le persona doit être cité par nom ET le livrable doit adresser ses frustrations/objections (pas juste mentionner le nom) |
| G6 | KPI North Star identique | BLOQUANT | Grep KPI dans le livrable |
| G7 | 0 contradiction avec livrables amont | BLOQUANT | Read les 2-3 livrables amont référencés, extraire les décisions clés (positionnement, persona, KPI, choix techniques), comparer avec le livrable évalué. Si une décision diverge → FAIL |
| G8 | Ton cohérent avec brand-voice.md (si existe) | CONDITIONNEL | Grep registre (tu/vous), vocabulaire |

**ACTIONNABILITÉ**

| # | Gate | Classe | Vérification |
|---|---|---|---|
| G9 | Chaque recommandation a un owner + action + cible | REQUIS | Grep `→ @` ou équivalent actionnable |
| G10 | 0 langage vague sans action ("envisager", "pourrait", "éventuellement") | REQUIS | Grep mots vagues |
| G11 | Critères de validation binaires (vérifiables oui/non) | REQUIS | Read section validation |
| G12 | Un agent pourrait implémenter sans poser de question | BLOQUANT | Pour chaque action/recommandation : a-t-elle (a) un verbe d'action, (b) un objet clair, (c) des inputs/outputs explicites, (d) un critère de done vérifiable ? Si une action dit "améliorer le SEO" sans préciser quoi/comment/critère → FAIL |

**MESSAGES**

| # | Gate | Classe | Vérification |
|---|---|---|---|
| G13 | 0 donnée inventée (aucun chiffre, benchmark ou métrique sans fondement factuel) | BLOQUANT | Grep chiffres sans source — vérifier crédibilité, pas juste présence de source |
| G14 | Livrables absents signalés | REQUIS | Grep tous les chemins docs/ mentionnés dans le livrable → Glob pour vérifier existence. Si un chemin référencé n'existe pas ET n'est pas documenté comme absent → FAIL |
| G15 | 0 placeholder résiduel | BLOQUANT | Grep `[À REMPLIR`, `[PLACEHOLDER`, `[TODO`, `[NOM`, `[EXEMPLE`, `[XX`, `[VOTRE`, `[INSÉRER`, `[REMPLACER` |

**SPÉCIFICITÉ**

| # | Gate | Classe | Vérification |
|---|---|---|---|
| G16 | Nom du projet cité >= 3 fois | REQUIS | Grep count |
| G17 | Persona cité par nom >= 2 fois | REQUIS | Grep count |
| G18 | >= 2 livrables amont référencés par chemin | REQUIS | Grep `docs/` |
| G19 | Pas copiable tel quel pour un projet concurrent | BLOQUANT | Test d'inversion : remplacer le nom du projet par un concurrent dans un autre secteur. Si > 50% du contenu reste applicable sans modification → FAIL. Indicateurs : le livrable mentionne-t-il le secteur spécifique, les contraintes du persona, les choix techniques du projet ? |
| G20 | >= 1 exemple concret spécifique au projet | REQUIS | Vérification sectorielle |

**QUALITÉ MÉTIER** (gates spécifiques par type de livrable — s'appliquent conditionnellement selon le type)

| # | Gate | Classe | Vérification |
|---|---|---|---|
| G21 | Les 5 états UI documentés par écran interactif (défaut, loading, vide, erreur, succès) | BLOQUANT | Pour specs/wireframes : Grep `loading\|erreur\|vide\|empty\|error\|succes` par écran. Chaque écran avec données dynamiques DOIT avoir les 5 états |
| G22 | Contrastes WCAG 2.2 AA respectés (>= 4.5:1 texte, >= 3:1 interactifs) | BLOQUANT | Pour design-system/tokens : vérifier chaque combinaison couleur texte/fond. Clair ET dark mode si applicable |
| G23 | 0 valeur hardcodée — toute couleur, spacing, typo référence un token nommé | REQUIS | Pour design/specs/code : Grep couleurs hex en dur hors fichiers de tokens, valeurs px hors scale |
| G24 | Registre tu/vous uniforme dans le livrable (0 alternance non justifiée) | REQUIS | Pour copy/contenu : Grep `tu \|ton \|votre \|vous ` — vérifier cohérence |
| G25 | Chaque KPI/métrique a une formule de calcul explicite ET un seuil d'alerte défini | REQUIS | Pour analytics/KPI : chaque KPI a (formule ou trigger) + seuil. Grep `formule\|calcul\|seuil\|alerte` |

### Verdict

- **GO** : 100% gates BLOQUANT PASS + 100% gates REQUIS PASS
- **GO CONDITIONNEL** : 100% gates BLOQUANT PASS + >= 1 gate REQUIS FAIL (corriger dans la session)
- **NO-GO** : >= 1 gate BLOQUANT FAIL → relance immédiate
- **Gates CONDITIONNEL** : s'appliquent uniquement si le livrable amont existe (ex: G8 s'applique si brand-voice.md existe). Si applicable et FAIL → traité comme REQUIS FAIL. Si non applicable → ignoré (N/A), ne compte pas dans le score dérivé.

### Score numérique dérivé (pour tracking)

Pour le tableau "Performance des agents" : `(gates PASS / gates applicables) × 10`. Ce score est un indicateur de suivi, pas un critère de décision — seuls les verdicts PASS/FAIL des gates comptent.

### Scoring persona et B2B (conservés)

Les grilles persona (/10, 9 dimensions, seuil 9/10) et B2B (/10, 7 dimensions, seuil 9/10 si applicable) sont conservées. Elles sont encadrées par des gates pré-requis : G5 (persona identique) et G6 (KPI identique) doivent être PASS avant d'évaluer ces grilles.

**Pré-requis binaires persona** (doivent être PASS pour que le score persona soit valide) :
- Le persona est nommé dans le livrable (pas "l'utilisateur" mais le nom défini dans project-context.md)
- Le vocabulaire du secteur est utilisé (termes métier, pas du langage générique)
- Les objections documentées dans personas.md (si existe) sont adressées dans le livrable

**Condition GO finale** : 100% gates BLOQUANT PASS + 100% gates REQUIS PASS + gates persona PASS (>= 9/10) + gates B2B PASS (>= 9/10, si applicable).

**Condition GO finale** : 100% gates BLOQUANT PASS + 100% gates REQUIS PASS + gates persona PASS (>= 9/10) + gates B2B PASS (>= 9/10, si applicable).

**Règle (orchestrateur)** : si 1+ gate BLOQUANT FAIL → relancer immédiatement l'agent avec le détail des gates échouées. Ne pas attendre la fin du run.
**Règle (reviewer)** : en fin de run, exécuter les 20 gates sur chaque livrable. Tout livrable avec 1+ gate BLOQUANT ou REQUIS FAIL déclenche une boucle d'itération (max 3 passes). Voir `orchestrator.md` Étape 7.

## Mémoire organisationnelle — Apprentissage inter-projets

Après chaque session (pas seulement chaque projet), l'orchestrateur DOIT mettre à jour `docs/lessons-learned.md` avec le format tableau structuré :

```markdown
## Session [date] — [Nom du projet]

| Session | Date | Catégorie | Sévérité | Description | Correction appliquée | Recommandation framework | Statut |
|---|---|---|---|---|---|---|---|
| [nom] | [date] | problème/insistance/requête/biais/pattern/recommandation/performance-ia | P0/P1/P2 | [description] | [ce qui a été fait] | [ce qu'il faudrait changer dans le framework] | ouvert/appliqué/obsolète |
```

**Catégories** : problème (bug/incohérence corrigé), insistance (utilisateur a demandé 2+ fois), requête (demande non couverte), biais (mindset humain détecté), pattern (ce qui a bien marché), recommandation (amélioration framework), performance-ia (coûts/latence/hallucinations).

**Cycle de vie des learnings** :
1. **Ouvert** : learning identifié, recommandation non encore appliquée
2. **Appliqué** : la recommandation a été implémentée dans le framework (agent, prompt, CLAUDE.md)
3. **Obsolète** : le learning n'est plus pertinent (contexte changé, problème disparu)

**Gestion du volume** : si le fichier contient plus de 30 learnings ouverts, synthétiser les récurrents en règles permanentes (dans CLAUDE.md ou les agents) et archiver les appliqués/obsolètes dans une section "## Archive" en bas du fichier.

**Boucle fermée** : à chaque reprise de session, l'orchestrateur DOIT lire les learnings ouverts P0/P1 et les intégrer dans son plan d'action — pas juste les signaler.

**Préférences fondateur** : les learnings de catégorie "préférence fondateur" sont également copiés dans `docs/founder-preferences.md`, source de vérité pour l'agent @moi. Ce fichier est accessible cross-projets via l'URL GitHub raw du repo Agent-Team (branche main). Voir la section "Sources de calibration" de `moi.md` pour le mécanisme complet.

**Pourquoi** : sans cette mémoire, chaque session repart de zéro. Les patterns qui marchent ne sont pas capitalisés. Les erreurs sont répétées. Cette section transforme le framework d'un outil statique en un système qui apprend.

## Journal de setup

L'historique complet des sessions de setup est dans `CHANGELOG.md` à la racine. Consulter ce fichier pour les décisions de conception passées et les modifications apportées au framework.
<!-- GRADIENT-AGENTS-END -->
