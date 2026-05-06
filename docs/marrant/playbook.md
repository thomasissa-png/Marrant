# Marrant — Playbook Projet

> Source de vérité unique pour les règles spécifiques au projet **deviens-marrant.fr**.
> Les règles universelles du framework sont dans `CLAUDE.md` (8 commandements).
> Les règles techniques communes aux agents Gradient sont dans `.claude/agents/_base-agent-protocol.md`.

---

## Environnement

- **Hébergement** : Replit (PAS Vercel — ne jamais mentionner Vercel).
- **Variables d'environnement** : onglet **Secrets** de Replit (icône cadenas).
- **Email transactionnel** : Resend (`RESEND_API_KEY`). Variable optionnelle `EMAIL_FROM` (défaut : `Deviens Marrant <noreply@deviens-marrant.fr>`). Domaine vérifié dans le dashboard Resend.

---

## Règles de développement

### Tests obligatoires avant chaque commit
- **Toujours lancer `npx jest --no-coverage` avant chaque commit** — 100% doivent passer.
- Si un composant, page, lib ou store est ajouté ou modifié → **mettre à jour ou créer les tests** dans `apps/web/src/__tests__/`.
- Couverture attendue : rendu, interactions, accessibilité (ARIA), appels API, états (erreur/chargement/vide), filtres, pagination, navigation.

### Structure des tests
```
apps/web/src/__tests__/
├── ui/          # Composants UI (Button, Badge, Input, Card, ProgressBar...)
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
2. Mettre à jour ou créer les tests
3. `npx jest --no-coverage` — tout doit passer
4. Commit + push

---

## Contrôle qualité vannes — Le Test Stand-Up

### Règle absolue
Chaque vanne du catalogue DOIT passer ce test avant ajout/conservation :

> « Est-ce que je peux la sortir ce soir en soirée / demain à la machine à café et faire rire ? »

Si non, la vanne n'a rien à faire sur le site.

### Critères de rejet automatique
- **Objets qui parlent** : « Un X dit à un Y... » entre objets inanimés (fourchette/couteau, miroir/miroir, stylo/crayon).
- **Jeux de mots forcés** : calembour qui ne fonctionne qu'à l'écrit ou nécessite 3 secondes de réflexion.
- **Punchline plus longue que le setup** : la chute doit être plus courte que l'amorce (raccourcir si > 30 mots).
- **Doublons conceptuels** : aucune vanne existante n'utilise déjà le même concept/comparaison.
- **Blagues enfantines / Carambar** : format Q&A « Pourquoi le X fait Y ? Parce que Z. » sans twist.
- **Autodérision triste sans punch** : « je suis seul / nul / ghosté » sans retournement = pas drôle, juste déprimant.

### Critères de qualité
- **Relatable** : situation que les personas vivent vraiment (coloc, boulot, date, soirée, famille).
- **Sortable à l'oral** : racontable naturellement dans une conversation, sans intro artificielle.
- **Twist net** : la punchline doit surprendre.
- **Courte et percutante** : setup + punchline < 40 mots idéalement (les meilleures < 20 mots).
- **Persona-check** : sert au moins un des 3 personas.

### Workflow ajout/modification
1. Écrire la vanne
2. Test stand-up (« je la sors ce soir ? »)
3. Vérifier critères de rejet (objets qui parlent, doublon, longueur)
4. Vérifier qu'au moins un persona peut l'utiliser
5. Vérifier qu'aucune vanne existante n'a le même concept
6. Ajouter dans `docs/content/blagues-seed.json`

---

## Personas de référence

> **RÈGLE ABSOLUE — Personas = outils INTERNES uniquement.**
> Les noms "Yanis", "Sophie", "Marc" ne doivent **JAMAIS apparaître dans le contenu public** (articles, vannes, conseils, posts social, pages du site).
> À la place : "tu" direct ou descriptions de situation ("au bureau", "en soirée", "que tu sois étudiant ou jeune actif").
> Validation programmatique : `guardAgainstPersonaLeak()` dans `standup-director-agent.ts` rejette tout contenu contenant un prénom de persona.

### Yanis — 20 ans, étudiant
- **Profil** : Étudiant introverti, manque de confiance, veut progresser en répartie pour s'affirmer en soirées, en coloc, avec ses potes.
- **Objectif** : Avoir de la répartie — savoir quoi répondre du tac au tac.
- **Besoins** : Exercices concrets, techniques simples, progression visible (XP/streak), ton encourageant et complice.
- **Frictions** : Contenu trop formel ou corporate, absence de message rassurant pour les timides, manque de réfs vie étudiante.

### Sophie — 26 ans, jeune active
- **Profil** : CDI dans une boîte moyenne, sociable mais manque de conversation à la machine à café.
- **Objectif** : Alimenter ses conversations quotidiennes (machine à café, afterwork, dîners entre amis).
- **Besoins** : Blagues courtes mémorisables, conseils de timing, contenu actualisé, catégories filtrables.
- **Frictions** : Contenu trop long, blagues datées, pas de mention de situations professionnelles.

### Marc — 34 ans, récemment séparé
- **Profil** : En reconstruction après une séparation, veut renouer avec l'humour et la légèreté.
- **Objectif** : Redevenir drôle et à l'aise socialement, retrouver confiance.
- **Besoins** : Parcours structurés, progression mesurable, variété de contenus, ton bienveillant sans infantiliser.
- **Frictions** : Contenu uniquement « ados/étudiants », manque de profondeur, absence de recommandations personnalisées.

---

## Agent Stand-Up Director — Directeur Artistique

### Rôle et mission
Le Stand-Up Director (`standup-director-agent.ts`) est le **gardien qualité de TOUS les contenus** du site. Aucun contenu (vanne, conseil, vidéo, article blog, post social) n'est publié sans son approbation. Double mission :
1. **Site n°1 du stand-up français** — chaque contenu au niveau d'un showcase pro.
2. **Plateforme de formation au stand-up n°1 en France** — chaque conseil/vidéo enseigne quelque chose de concret et mesurable.

### 5 tests universels appliqués à TOUT contenu
1. **Test du Pote** : "Tu enverrais ça à ton meilleur pote ?"
2. **Test du Concret** : "Après ça, je sais exactement quoi faire"
3. **Test du Doublon** : "Ça existe déjà sous une autre forme ?"
4. **Test du Persona** : "Yanis, Sophie ou Marc est servi ?"
5. **Test de la Barre** : "C'est au niveau du leader du marché ?"

### Pipeline de validation
```
Tentative 1: Agent génère → Directeur valide → REJETÉ ❌
                                                 ↓ feedback injecté dans le prompt
Tentative 2: Agent re-génère → REJETÉ ❌
Tentative 3: Agent re-génère → REJETÉ ❌
                                                 ↓
              LE DIRECTEUR PREND LA MAIN
              → Reçoit la dernière version + tous les problèmes identifiés
              → Réécrit lui-même via directorRewrite*
              → Publication ✅
```

### Verdicts
- **APPROVED** (score ≥ 9) : publiable en l'état
- **NEEDS_REVISION** (score 7-8) : idée bonne, suggestion de réécriture fournie
- **REJECTED** (score ≤ 6) : ne passe pas, recommencer

### Fonctions disponibles
| Fonction | Rôle |
|---|---|
| `validateJoke(joke, persona)` | Valide une vanne (twist, punchline, persona, ton) |
| `validateTip(tip, persona)` | Valide un conseil (actionnable, défi, technique) |
| `validateVideoSelection(video, persona)` | Valide une sélection vidéo (pédagogie, diversité) |
| `validateBlogArticle(article)` | Valide un article (humour, SEO, refs modernes, liens) |
| `validateSocialPost(post)` | Valide un post social (gates G-S1 à G-S20) |
| `directorRewrite*` | Réécriture après 3 échecs |
| `generateEditorialVision(month, year)` | Vision éditoriale mensuelle |
| `reviewContentBatch(items, date)` | Revue quotidienne cohérence/diversité |

### Intégration dans les pipelines
- **`daily-publisher.ts`** : 3 agents (vannes, conseils, vidéos) passent par la validation. 3 échecs → directeur réécrit.
- **`seo-blog-agent.ts`** : `publishWeeklyArticle()` valide entre génération et DB save.
- **Crons inchangés** : `/api/cron/daily-content` (5h-6h UTC) et `/api/cron/weekly-seo` (lundi 9h UTC).
- **Sécurité** : si l'API crash, le contenu est publié tel quel (jamais de blocage en cascade).

### Références humoristes (barre de qualité)
- **Prioritaires** : Paul Mirabel, Fary, Roman Frayssinet, Blanche Gardin, Waly Dia, Panayotis Pascot, Pierre Croce, Inès Reg
- **Legacy** (max 1 mention/article) : Jamel Debbouze, Gad Elmaleh, Florence Foresti, Kev Adams

---

## Architecture des agents IA

```
┌─────────────────────────────────────────────────────────────┐
│                    CRONS (déclencheurs)                      │
│  Quotidien 5h-6h UTC    │  Mensuel 28     │  Lundi 9h UTC  │
│  /cron/daily-content    │  /cron/monthly  │  /cron/weekly-seo │
└──────────┬──────────────┴────────────────┬─────────────────┘
           ▼                                ▼
┌─────────────────────┐        ┌─────────────────────────┐
│  daily-publisher.ts │        │  seo-blog-agent.ts      │
└──────────┬──────────┘        └──────────┬──────────────┘
           ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                STAND-UP DIRECTOR (validation)               │
│  validate* → APPROVED ? publish : retry (max 3)             │
│  3 échecs → directorRewrite* → publish                      │
└──────────┬──────────────────────────────────┬───────────────┘
           ▼                                  ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│  joke-agent.ts           │   │  seo-blog-agent.ts       │
│  tip-agent.ts            │   │  planNextArticle()       │
│  video-agent.ts          │   │  generateArticle()       │
└──────────────────────────┘   └──────────────────────────┘
```

### Coordination inter-agents
- **Rotation personas** : Jour 1,4,7→YANIS | Jour 2,5,8→SOPHIE | Jour 3,6,9→MARC (`personas.ts`)
- **Diversité quotidienne** : chaque agent reçoit les catégories des 2 autres pour éviter les doublons
- **Plans mensuels** : `content-planner.ts` génère 3 plans (vannes/conseils/vidéos) harmonisés via `plan-validator.ts`
- **Tonalité unique** : `TONALITY_BRIEF` dans `marketing-agent.ts` est la source de vérité partagée

### Fichiers clés agents
| Fichier | Rôle |
|---|---|
| `lib/ai/agents/standup-director-agent.ts` | Directeur artistique — validation + réécriture |
| `lib/ai/agents/joke-agent.ts` | Génération vannes quotidiennes |
| `lib/ai/agents/tip-agent.ts` | Génération conseils quotidiens |
| `lib/ai/agents/video-agent.ts` | Sélection vidéos quotidiennes |
| `lib/ai/agents/video-discovery-agent.ts` | Découverte mensuelle + enrichissement |
| `lib/ai/agents/seo-blog-agent.ts` | Génération articles blog SEO |
| `lib/ai/agents/marketing-agent.ts` | Creative Strategist + TONALITY_BRIEF |
| `lib/ai/daily-publisher.ts` | Orchestrateur contenu quotidien |
| `lib/ai/content-planner.ts` | Planification mensuelle |
| `lib/ai/plan-validator.ts` | Harmonisation inter-agents |
| `lib/ai/personas.ts` | Définition + rotation des 3 personas |
| `lib/ai/client.ts` | Client Anthropic partagé + retry + cache |

---

## Diversité du catalogue vidéos — Règle permanente

### État actuel
- Montreux Comedy = ~36% du catalogue (32/89 vidéos)
- **Objectif : aucune chaîne au-dessus de 25% du catalogue total**

### Règle de rééquilibrage progressif
- **Ne PAS supprimer** les vidéos Montreux existantes (contenu de qualité).
- **Chaque nouvelle vidéo** doit venir d'une chaîne sous-représentée.
- Chaînes à privilégier : artistes (Blanche Gardin, Paul Mirabel, Roman Frayssinet...), Jamel Comedy Club, France Inter, YouHumour, Campus Comedy Tour, Tarmac.
- L'agent vidéo (`video-agent.ts`) applique cette règle en critère 4 de sélection.

### Découverte automatique mensuelle — Pipeline `monthly-videos`
Le cron `/api/cron/monthly-videos` découvre et ajoute **10 nouvelles vidéos** chaque mois.

```
CRON /api/cron/monthly-videos (1er du mois)
  → video-discovery-agent.ts
    1. Surveillance chaînes (WATCHED_CHANNELS — 15 chaînes prioritaires)
    2. Recherche par mots-clés stand-up FR (YouTube Data API)
    3. Filtrage IA (pertinence, diversité chaîne, durée)
    4. Enrichissement IA (description pédagogique, learnings, exercice)
  → Stand-Up Director validateNewVideo() (score ≥ 7 → ajout)
  → DB Video (generatedByAI: true)
```

### Chaînes surveillées (`WATCHED_CHANNELS`)
- **Haute priorité** : Paul Mirabel, Fary, Roman Frayssinet, Blanche Gardin, Pierre Croce, Jamel Comedy Club, YouHumour
- **Moyenne priorité** : France Inter, Campus Comedy Tour, Tarmac, Waly Dia, Panayotis Pascot, Inès Reg, Nordine Ganso
- **Basse priorité** : Sugar Sammy

### Secrets Replit
```
YOUTUBE_API_KEY    — Clé API YouTube Data v3 (obligatoire)
CRON_SECRET        — Auth du cron
```

---

## Agent SEO blog — Instructions automatisées

### Planning éditorial
Fichier : **`/seo-editorial-plan.json`** (v4.0). Contient mots-clés cibles, 9 clusters, articles planifiés, règles de maillage interne.

### 9 clusters
apprendre-humour | techniques-repartie | techniques-delivery | types-humour | humour-contexte | apprendre-des-pros | douleurs-personas | **fort-volume** (acquisition) | **saisonnier** (pics trafic)

### Workflow agent SEO à chaque session
1. Lire `seo-editorial-plan.json`
2. Identifier articles `planned` dont `scheduledWeek` est passée/en cours
3. Rédiger dans `apps/web/src/lib/blog-articles.ts` en respectant les `qualityRules`
4. Valider via `validateBlogArticle()` — si rejeté 3×, le directeur réécrit via `directorRewriteBlogArticle()`
5. MAJ statut JSON : `"status": "published"` + `"publishedDate": "YYYY-MM-DD"`
6. Si < 4 articles `planned` restants → générer 8 nouveaux (clusters + long-tail non couverts)
7. Commit + push

### Rythme de publication
- **Objectif** : 3-4 articles/semaine, **standard qualité MAXIMAL** (pas de compromis volume/qualité)
- **Priorité** : douleurs-personas + fort-volume
- **Saisonnier** : publier 2-3 semaines AVANT (Noël sem ~49, Saint-Valentin sem ~5, rentrée sem ~34)

### Règles de rédaction SEO
- Titre < 60 caractères, mot-clé en début
- Meta description < 155 caractères, incitative — validation programmatique tronque automatiquement
- Contenu : 1500-2500 mots (pillar) / 1000-1800 mots (satellite)
- Structure : H2 sous-sujets, H3 détails, listes, gras sur termes clés
- Maillage : minimum 5 liens internes par article
- FAQ schema : 3-5 questions en fin
- CTA vers section produit pertinente (/parcours, /vannes, /conseils)
- Schema HowTo : auto-injecté pour articles GUIDE, PRATIQUE, ROADMAP

### Cannibalisation
- Vérifier qu'un nouvel article ne cannibalise pas un existant (même slug ET même mot-clé)
- Vérification programmatique en DB + articles statiques dans `seo-blog-agent.ts`
- Cas identifiés documentés dans `cannibalizationFixes` du JSON

### Critères SEO blog (non négociables)
- Mot-clé dans intro, 2-3 H2/H3, conclusion
- Titre < 60 chars, meta 150-155 chars
- Min 5 liens internes (/vannes, /parcours, /conseils, /videos)
- FAQ schema 3-5 questions en fin
- 1500-2500 mots, pas de keyword stuffing
- Anti-cannibalisation vérifié avant publication

---

## GEO — Generative Engine Optimization

### Score actuel : 78/100 → objectif 90/100

### Stratégie GEO
LLM (ChatGPT, Perplexity, Gemini, Claude) = canal d'acquisition majeur. Le contenu doit être **structuré pour être cité** par les IA génératives.

### Optimisations déployées (mars 2026)
- **Person schema auteur** sur `/blog/[slug]` et `/a-propos` — E-E-A-T pour LLM
- **CollectionPage schema** sur `/vannes`, `/conseils`, `/videos`
- **Instructions GEO dans agent SEO** : listes numérotées, citation-worthy statements, contre-exemples bon/mauvais
- **robots.txt** : tous les bots LLM autorisés (GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot...)

### Règles GEO pour les articles blog
- Au moins **3 listes numérotées** par article
- Des **"citation-worthy statements"** : `> **CLEF :** [affirmation mémorable]`
- Au moins **1 statistique/référence sourcée**
- H2 formulés comme des **questions conversationnelles**
- Concepts clés définis clairement en 1-2 phrases
- **RÈGLE ABSOLUE** : le GEO ne doit JAMAIS tuer l'humour — listes et blockquotes doivent être drôles

### Schemas JSON-LD déployés
| Schema | Pages |
|---|---|
| Organization | Toutes (root layout) |
| WebSite + SearchAction | Toutes (root layout) |
| Person (auteur) | `/blog/[slug]`, `/a-propos` |
| Article | `/blog/[slug]` |
| FAQPage | `/blog/[slug]`, `/vannes`, `/conseils`, `/videos`, `/a-propos`, homepage |
| HowTo | `/blog/[slug]` (GUIDE/PRATIQUE/ROADMAP) |
| BreadcrumbList | Toutes les pages |
| CollectionPage | `/vannes`, `/conseils`, `/videos` |
| Course | `/parcours`, `/parcours/[slug]` |
| DefinedTermSet | `/glossaire` |
| Product | `/abonnement` |

---

## Architecture des clusters blog

### Membership unique
- Chaque slug n'appartient qu'à **UN seul cluster** (pas de shared slugs).
- Articles transversaux classés par **intention primaire**.
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
- `CATEGORY_TO_CLUSTER` mappe 15 catégories (dont SAISONNIER) vers les clusters.
- `resolveCluster(slug, category?)` : slug d'abord, puis fallback par catégorie.

---

## Compteurs d'affichage — Règle d'arrondi

- Compteurs affichés **arrondis à la dizaine inférieure** : 294 → 290+, 71 → 70+, 89 → 80+
- `roundToTen()` dans `hooks/use-content-stats.ts` centralise l'arrondi
- Compteurs hardcodés (meta titles, descriptions, schemas) suivent la même règle
- Incrémenter uniquement quand le seuil de la dizaine suivante est atteint

### Compteurs actuels
- Vannes : **290+** (289 réelles)
- Conseils : **60+** (66 réels)
- Vidéos : **80+** (89 réelles)

---

## Stratégie Social Media — Refonte s7

### Doctrine
Chaque post = **micro-performance de stand-up**. Le compte @marrant n'est PAS une personne — c'est une **marque qui parle AU lecteur**, jamais DE soi. Aucun "je / mon / ma" hors citation explicite (G-S19).

### 1 format par plateforme (refonte s7)
| Plateforme | Format unique | Promesse | Char limit |
|---|---|---|---|
| Twitter | **MINI_STANDUP** | Punchline 30s, prête à recracher | 270 |
| LinkedIn | **POTE_AU_TAF** | Vanne courte vie de bureau, ≤ 3 phrases, zéro leçon | 1300 |
| Instagram | **IMAGE_QUI_CLAQUE** | Punchline ≤ 6 mots fond noir + caption ≤ 80 chars | 80 (caption) |

**Deprecated** (skip publication) : THREAD, QUOTE_ANALYSIS, WILD_CARD, TECHNIQUE_DU_JOUR.

### 5 voix narratives valides (G-S19)
1. Observation universelle ("Ce moment où tu...")
2. Mise en scène impersonnelle ("Le X qui...", pas "mon X")
3. Vanne du catalogue citée explicitement ("Une vanne à recracher : '...'")
4. Question rhétorique au lecteur
5. Statement provocateur ("Personne te le dit, mais...")

### Pipeline
```
CRON /api/cron/daily-social (4h UTC)
  → social-media-agent.ts (1 post par plateforme par jour)
  → Stand-Up Director validateSocialPost() (gates G-S1 à G-S20)
  → DB SocialPost (PENDING si pas validé, APPROVED si score ≥ 9)
  → /admin/social (dashboard validation 1-clic)
  → CRON /api/cron/publish-social (publie APPROVED via Buffer)
```

### Gates Director — 20 gates programmatiques
- **G-S1 à G-S13** : persona leak, hook ≤ 5 mots, anti-IA, anti-bait, char limits, CTA, emojis, voix équipe, tutoiement, anti-vulgarité, anti-dialogue, lien-3-lignes, hashtags-tweet
- **G-S14** TWITTER format MINI_STANDUP uniquement
- **G-S15** LINKEDIN ≤ 3 phrases + anti-leçon/storytelling/broetry
- **G-S16** INSTAGRAM caption ≤ 80 + anti-bait IG
- **G-S17** Anti-corporate/coach (growth mindset, scaler, synergie)
- **G-S18** Humoriste avec vanne ou geste précis
- **G-S19** Anti-1ère-personne (compte = marque)
- **G-S20** Fit plateforme × sujet (vie privée intime → pas LinkedIn, ROI/KPI → pas Twitter)

### Quotas par jour
- Tous personas : 1 Twitter + 1 LinkedIn + 1 Instagram = 3 posts/jour
- Yanis (jour Yanis) : 1 Twitter + 1 Instagram = 2 posts (pas de LinkedIn)
- 1 post sur 5 max avec lien vers le site (`siteLinkDay = dayOfMonth % 5 === 0`)

### Charte visuelle Instagram
- Fond noir #0D0D0D | Accent violet #8B5CF6 | Punchline blanc cassé italique
- Template unique : `IMAGE_QUI_CLAQUE` (réutilise `generateLaVanne` avec setup vide)
- Reconnaissable en < 1 seconde dans le feed

### Fichiers clés social
| Fichier | Rôle |
|---|---|
| `lib/ai/agents/social-media-agent.ts` | Brief refondu, type `SocialFormat` |
| `lib/ai/agents/standup-director-agent.ts` | `runSocialGates()` G-S1 à G-S20 |
| `lib/social/generate-post-image.ts` | Mapping format → template satori |
| `lib/social/templates/instagram-templates.tsx` | LaVanne réutilisé |
| `app/api/cron/daily-social/route.ts` | Quotas refondus |
| `app/api/cron/publish-social/route.ts` | Skip formats deprecated |
| `social-editorial-plan.json` | v2.0-s7 |
| `docs/social/social-reform-s7.md` | Doc refonte + 9 posts canoniques |

### Publication via Buffer (mars 2026)
Publication Twitter/LinkedIn/Instagram via **Buffer** (GraphQL API). Buffer gère OAuth, scheduling et publication.

### Secrets Replit Buffer
```
BUFFER_ACCESS_TOKEN       — Token API Buffer
BUFFER_ORGANIZATION_ID    — ID organisation
BUFFER_CHANNEL_TWITTER    — Channel ID Twitter
BUFFER_CHANNEL_LINKEDIN   — Channel ID LinkedIn
BUFFER_CHANNEL_INSTAGRAM  — Channel ID Instagram (REQUIS pour IG)
```

### Setup Buffer
1. Compte sur https://buffer.com (plan Essentials ~6$/mois)
2. Connecter profils Twitter, LinkedIn (page entreprise), Instagram
3. Settings > API : générer token → `BUFFER_ACCESS_TOKEN`
4. Channel IDs : appeler GET `/api/admin/buffer-channels?secret=CRON_SECRET` ou query GraphQL `GetChannels`
5. Ajouter les 5 secrets dans Replit

---

## Agent HARO — Backlinks presse automatisés

### Rôle
L'agent HARO génère des réponses d'expert au nom d'Alex pour obtenir des **backlinks de presse** (HARO, Connectively, SourceBottle, Qwoted, JournalRequest).

### Pipeline
```
Source opportunités → POST /api/cron/haro
  → filterRelevantOpportunities() (96 sujets pertinents)
  → generateHaroResponse() (hook drôle + réponse expert)
  → Score < 5 → skip
  → Score ≥ 5 → sendHaroDraftForReview() → email à alex@deviens-marrant.fr
  → Alex copie-colle et envoie au journaliste
```

### Fichiers
- `lib/ai/agents/haro-agent.ts` — Agent génération + filtrage + envoi
- `app/api/cron/haro/route.ts` — Endpoint POST (webhook) + GET (statut)

### Automatisation
- Filtrage automatique : 96 topics pertinents (humour, communication, confiance, dating, networking...)
- Génération : hook drôle + réponse expert 3-4 phrases + bio Alex
- Score 1-10, seuls ≥ 5 sont envoyés
- Email auto à alex@deviens-marrant.fr via Resend

### Manuel
- Source des opportunités (HARO fermé, Connectively nécessite scraper ou Zapier)
- Envoi final (Alex copie-colle et envoie)

### Secrets Replit
```
CRON_SECRET (auth du cron)
RESEND_API_KEY (envoi email)
EMAIL_FROM (optionnel, défaut: noreply@deviens-marrant.fr)
```

---

## Référence rapide — Interaction avec la base de données

### ORM & Config
- **ORM** : Prisma v6.2.0, PostgreSQL
- **Schema** : `prisma/schema.prisma` (+ copie `apps/web/prisma/schema.prisma`)
- **Client singleton** : `apps/web/src/lib/prisma.ts`
- **DATABASE_URL** : Secrets Replit

### Modèles principaux
| Modèle | Champs clés | Notes |
|---|---|---|
| `Joke` | content, punchline, category (13 enums), maturityLevel, type (7 enums), isActive, generatedByAI | Unique sur content |
| `Tip` | title, content, category (7 enums), difficulty, example, exercise, isActive, generatedByAI | |
| `Video` | youtubeId (unique), title, channelName, duration, category, difficulty, description, technique, learnings[], exercise, isActive, generatedByAI | |
| `DailyContent` | date (unique), jokeId, tipId, videoId | Rotation quotidienne |
| `SocialPost` | platform, format, content, hook, cta, hashtags[], targetPersona, status, directorScore, scheduledAt, publishedAt, externalId, analytics | |
| `BlogArticle` | slug (unique), title, excerpt, content, category, readingTime, targetKeyword, metaTitle, metaDescription, isPublished, publishedAt, generatedByAI | |
| `LearningPath` | title, slug (unique), duration, difficulty, icon, order, isActive | Steps via `LearningPathStep` |
| `User` | plan (FREE/PREMIUM), level, xp, streak | NextAuth |
| `UserFavorite` | userId, contentType, jokeId/tipId/videoId | |
| `ContentPlan` | agentType, month, year | Entries via `ContentPlanEntry` |

### 5 méthodes d'interaction DB

#### 1. API Admin (`/api/admin/db`) — CRUD direct
```
GET /api/admin/db?secret=ADMIN_PASSWORD&model=Joke&action=query&where={"isActive":true}&take=10

POST /api/admin/db
Authorization: Bearer {ADMIN_PASSWORD}
{"action":"update","model":"Joke","where":{"id":"clx123"},"data":{"isActive":false}}
```
Modèles autorisés : Joke, Tip, Video, DailyContent, SocialPost, BlogArticle, ContentPlan, LearningPath, LearningPathStep, User (RO), Subscription (RO), UserFavorite (RO).

#### 2. Seed files + `npm run db:seed`
- Éditer JSON dans `docs/content/` (blagues, conseils, videos, parcours)
- `npm run db:seed` (ou `npx prisma db seed`)
- Désactive (`isActive: false`) entrées supprimées du JSON (préserve favoris/likes)
- Protège contenus IA (`generatedByAI: true` non touchés)
- Script : `apps/web/scripts/seed.sh` → compile `prisma/seed-data.ts` via esbuild

#### 3. Crons automatisés
| Cron | Horaire | Action |
|---|---|---|
| `/cron/daily-content` | 5h-6h UTC | Vanne + conseil + vidéo du jour |
| `/cron/weekly-seo` | Lundi 9h UTC | Article blog SEO |
| `/cron/daily-social` | 4h UTC | Posts sociaux |
| `/cron/publish-social` | /30 min | Publie APPROVED via Buffer |
| `/cron/social-analytics` | 1×/jour | Pull metrics + nettoyage |
| `/cron/monthly-plan` | 28 du mois | Plans mensuels tous agents |
| `/cron/monthly-videos` | 1er du mois | 10 nouvelles vidéos |

#### 4. Admin Social (`/api/admin/social`)
```
GET /api/admin/social?secret=ADMIN_PASSWORD&status=PENDING
POST /api/admin/social {"action":"approve","postIds":["clx456"]}
POST /api/admin/social {"action":"reject","postIds":["clx789"],"reason":"..."}
POST /api/admin/social {"action":"approve_all"}
```

#### 5. Code Prisma direct
```typescript
import { prisma } from "@/lib/prisma";
const jokes = await prisma.joke.findMany({ where: { isActive: true }, take: 10 });
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
| Articles statiques blog | `apps/web/src/lib/blog-articles.ts` |
| Clusters blog | `apps/web/src/lib/blog-clusters.ts` |

### Corrections de contenu en session
1. **Via seed** : éditer JSON dans `docs/content/` → `npm run db:seed`
2. **Via API admin** : `POST /api/admin/db` action update/delete
3. **Via code** : éditer fichiers source (blog-articles.ts, seed JSON)
4. **Désactiver sans supprimer** : `{"action":"update","data":{"isActive":false}}`

---

## Références croisées

- **Historique des audits** : `docs/marrant/audits-history.md`
- **Préférences fondateur** : `docs/founder-preferences.md`
- **Lessons learned actives** : `docs/lessons-learned.md`
- **Lessons archivées** : `docs/lessons-learned-archive.md`
- **Plan d'orchestration courant** : `docs/orchestration-plan.md`
- **Plan d'orchestration mobile** : `docs/orchestration-plan-mobile.md`
- **Refonte social s7** : `docs/social/social-reform-s7.md`
- **Stratégie GEO** : `docs/geo/geo-strategy.md`
- **Stratégie backlinks** : `docs/seo/backlink-strategy.md`
