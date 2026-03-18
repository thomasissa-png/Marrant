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

### Workflow ajout de vidéos
1. Vérifier que le youtubeId existe et que la vidéo est accessible
2. Privilégier une chaîne sous-représentée dans le catalogue
3. Rédiger description, learnings et exercice au format standard
4. Ajouter au fichier `docs/content/videos-seed.json`

## Agent SEO — Instructions automatisées

### Planning éditorial
- Le planning éditorial est dans **`/seo-editorial-plan.json`** à la racine du projet.
- Ce fichier contient : mots-clés cibles, clusters thématiques, articles planifiés avec statut, et règles de maillage interne.

### Workflow agent SEO à chaque session
1. **Lire** `seo-editorial-plan.json`
2. **Identifier** les articles `planned` dont la `scheduledWeek` est passée ou en cours
3. **Rédiger** les articles dans `apps/web/src/lib/blog-articles.ts` en respectant les `qualityRules` du fichier
4. **Mettre à jour** le statut dans le JSON : `"status": "published"`, ajouter `"publishedDate": "YYYY-MM-DD"`
5. **Prolonger** : quand il reste < 4 articles `planned`, générer 8 nouveaux articles en suivant la stratégie de clusters et les mots-clés long-tail non couverts
6. **Commit + push** les changements

### Règles de rédaction SEO
- Titre < 60 caractères, mot-clé principal en début
- Meta description < 155 caractères, incitative
- Contenu : 1500-2500 mots (pillar) / 1000-1800 mots (satellite)
- Structure : H2 sous-sujets, H3 détails, listes, gras sur termes clés
- Maillage interne : minimum 5 liens par article
- FAQ schema : 3-5 questions en fin d'article
- CTA vers la section produit pertinente (/parcours, /vannes, /conseils)

### Cannibalisation
- Vérifier qu'un nouvel article ne cannibalise pas un article existant (même mot-clé principal)
- Les cas identifiés sont documentés dans `cannibalizationFixes` du JSON

## Personas de référence

Trois personas guident les décisions UX/copy du site. À consulter pour toute évolution majeure.

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
- **APPROVED** (score ≥ 7) : publiable en l'état
- **NEEDS_REVISION** (score 4-6) : l'idée est bonne, suggestion de réécriture fournie
- **REJECTED** (score ≤ 3) : ne passe pas le test, recommencer de zéro

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
| `lib/ai/agents/seo-blog-agent.ts` | Génération d'articles blog SEO |
| `lib/ai/agents/marketing-agent.ts` | Creative Strategist + TONALITY_BRIEF |
| `lib/ai/daily-publisher.ts` | Orchestrateur contenu quotidien |
| `lib/ai/content-planner.ts` | Planification mensuelle |
| `lib/ai/plan-validator.ts` | Harmonisation inter-agents |
| `lib/ai/personas.ts` | Définition des 3 personas + rotation |
| `lib/ai/client.ts` | Client Anthropic partagé + retry |

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
- Blagues : 50, Conseils : 15, Vidéos : 25, Favoris max : 50

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
