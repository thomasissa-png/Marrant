# Marrant — Historique des audits

> Journal des audits de qualité, sécurité, SEO et architecture menés sur le projet.
> Référencé par `docs/marrant/playbook.md` et `CLAUDE.md`.

---

## Audit SEO + Sécurité + UX — 15 mars 2026
**Branche** : `claude/seo-audit-optimization-EU7uv`

### Sécurité (7 fixes)
- `auth.ts` : retrait `allowDangerousEmailAccountLinking`, JWT maxAge 30j
- `register/route.ts` : password minimum 12 caractères (était 8)
- `indexnow/route.ts` : clé IndexNow via `process.env.INDEXNOW_KEY`
- `next.config.js` : headers CSP + HSTS ajoutés
- `globals.css` : `prefers-reduced-motion: reduce` pour accessibilité

### Base de données (4 fixes)
- `schema.prisma` : modèle `WebhookEvent` (dédup Stripe persistante), index `JokeLike.jokeId`, `onDelete: Cascade` sur DailyContent
- `parcours/[id]/progress/route.ts` : `$transaction()` pour XP atomique

### Stripe & Achat (6 fixes)
- Nouveau endpoint `/api/stripe/portal` (portail client Stripe)
- `profil-dashboard.tsx` : bouton "Gérer mon abonnement"
- `webhook/route.ts` : dédup via DB (plus de Map in-memory), events `invoice.payment_succeeded` + `charge.refunded`
- `stripe.ts` : prix depuis `STRIPE_PRICE_ID` env var
- `premium-cta.tsx` : tableau comparatif FREE vs PREMIUM

### Frontend & Accessibilité (5 fixes)
- `youtube-player.tsx` : thumbnail via `next/image` + alt text
- `page.tsx` (home) : lazy-load `PremiumCta` + `HomeCta` via `dynamic()`
- Forms auth : `aria-describedby` + `aria-invalid` sur tous les champs
- `register/page.tsx` : validation Zod côté client
- `next.config.js` : 3 redirects 301 anti-cannibalisation SEO

### UX & Contenu (5 fixes)
- `humor-quiz.tsx` : persistance résultat quiz dans localStorage
- Limites gratuites augmentées : blagues 50, conseils 15, vidéos 25, favoris 50
- Nouvelle page `/retractation` (obligation légale, directive 2011/83/UE)
- `footer.tsx` : lien rétractation ajouté
- `premium-cta.tsx` : mention "Sans engagement" + lien rétractation

### Favicon (16 mars 2026)
- `favicon.ico` créé multi-size (16+32+48px) — Google + Bing
- `favicon.png` régénéré 48×48 (min Google SERP)
- `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` régénérés depuis SVG source
- `layout.tsx` : favicon.ico déclaré en premier + `rel="shortcut icon"` pour Bing + icon-512
- `manifest.json` : taille favicon corrigée 32→48

### Modal portal fix (16 mars 2026)
- `modal.tsx` : `createPortal(…, document.body)` — corrige PremiumModal qui s'affichait inline dans les Cards
- Cause : `animate-stagger-in` avec `transform` casse `position: fixed`
- Impact : toutes pages avec FavoriteButton

### Teasers variés vannes (16 mars 2026)
- `vannes-list.tsx` : 8 phrases de teaser en rotation au lieu de "Tape pour la chute"

### Limites gratuites finales
- Blagues : 10, Conseils : 3, Vidéos : 3, Favoris : Premium uniquement + contenu du jour renouvelé quotidiennement

---

## Audit qualité vannes — 18 mars 2026
**Branche** : `claude/fix-login-redirect-navigation-XCsj1`

### Catalogue vannes (`blagues-seed.json`) — 320 → 289 vannes
- **58 supprimées** : 19 objets qui parlent, 6 doublons conceptuels, 33 vannes faibles
- **27 nouvelles** ajoutées (absurde situationnel, vrais jeux de mots, comebacks, observations)
- **5 punchlines raccourcies**
- **10 vannes recatégorisées**
- Chaque vanne restante passe le Test Stand-Up

### Agent IA vannes (`joke-agent.ts`) — brief réécrit niveau stand-up pro
- System prompt réécrit de zéro avec posture d'auteur stand-up (Fary, Paul Mirabel, Roman Frayssinet)
- Test Stand-Up intégré au prompt avec exemples bon/mauvais
- 7 critères de rejet automatique + 5 critères de qualité
- User prompt renforcé : l'IA se relit et valide avant de répondre
- Validation programmatique : warning si punchline plus longue que setup

### Seed script — désactivation automatique
- Vannes seed retirées du JSON automatiquement désactivées (`isActive: false`)
- Protège vannes IA (`generatedByAI: true` non touchées)
- Préserve favoris et likes

---

## Audit qualité conseils — 18 mars 2026

### Catalogue conseils (`conseils-seed.json`) — 60 → 66 conseils
- **12 supprimés** : doublons autodérision/storytelling, filler, exemple avouant être nul
- **9 corrigés** : exemples faibles, contenu vague, déconnexion titre/contenu
- **18 nouveaux** : 5 TIMING, 4 Marc-focused, 3 Sophie pro, 4 Yanis, 2 transversaux
- **34 exercices** standardisés au format "DÉFI [NOM] : ..." (66/66)
- TIMING renforcé 5 → 10 | Marc 0 → 4 conseils dédiés

### Agent IA conseils (`tip-agent.ts`) — brief réécrit niveau coach stand-up
- Posture coach d'impro (atelier > amphi)
- Test du Coach : "le persona peut l'appliquer AUJOURD'HUI ?"
- 6 critères de rejet + 5 critères de qualité + exemples bon/mauvais
- Validation programmatique : format DÉFI, dialogue dans l'exemple, contenu min 60 mots

---

## Audit qualité vidéos — 18 mars 2026

### Catalogue vidéos (`videos-seed.json`) — 89 vidéos
- **84 exercices** standardisés au format "DÉFI [NOM] : ..." (89/89)
- **8 descriptions** génériques réécrites
- **8 techniques** standardisées (variantes ramenées aux 7 catégories)
- Note : Montreux Comedy = 36% du catalogue, à rééquilibrer progressivement

### Agent IA vidéos (`video-agent.ts`) — brief réécrit niveau directeur artistique
- 5 critères hiérarchisés : pédagogie > niveau > diversité > chaîne > catégorie
- Critère diversité de chaîne intégré
- User prompt : "ce qui fait le plus progresser" plutôt que "le plus drôle"

---

## Audit qualité parcours — 18 mars 2026

### Parcours-seed.json — source unique créée puis enrichie
- **Fichier créé** : `docs/content/parcours-seed.json` — source unique de vérité
- **Curation par persona** : Sophie→café/timing, Yanis→répartie/chambrages, Marc→confiance/style
- **Alignement steps/semaines** : Machine à Café 3 steps, Répartie 4 steps, Confiance 6 steps
- **Enrichissement marketing** : moduleTitle, moduleDetail, moduleFormat, moduleXp, testimonial, personaTagline
- **Seed-data.ts** : matching par titre de conseil

### parcours-content.tsx — refactoring source unique
- Import direct de `parcours-seed.json` — plus de données hardcodées
- 24 tests passent sans modification

---

## Audit qualité blog — 18 mars 2026

### Articles statiques (`blog-articles.ts`) — 7 → 5 articles
- **2 fusions anti-cannibalisation** : `techniques-repartie` → `comment-avoir-de-la-repartie` | `apprendre-etre-drole` → `comment-devenir-drole`
- **5 articles réécrits de zéro** : humour injecté (min 3 vannes/article), refs modernisées
- **Catégorie corrigée** : `erreurs-blagues` STORYTELLING → GUIDE
- **4 redirects 301** ajoutés dans `next.config.js`

### Agent SEO blog (`seo-blog-agent.ts`) — brief réécrit niveau stand-up
- Règle #1 : "Le blog est la DÉMO du produit" — minimum 3 traits d'humour par article
- Quotas humoristes : prioritaires (min 2/article) vs legacy (max 1/article)
- Anti-cannibalisation : vérification slug statique + DB avant publication
- Variation de formats obligatoire

### Planning éditorial (`seo-editorial-plan.json`) — v2.0
- Quality rules enrichies : humour obligatoire, refs modernes, formats variés, anti-cannibalisation
- `humoristQuotas` ajouté : legacy (max 1) vs priority (min 2) par article
- Cluster `techniques-delivery` ajouté
- Article pillar stand-up modernisé : Paul Mirabel/Fary/Blanche Gardin/Roman Frayssinet

---

## Création Stand-Up Director Agent — 18 mars 2026

### Agent (`standup-director-agent.ts`) — créé de zéro
- **Directeur artistique** : gardien qualité de tous les contenus
- **Double mission** : site n°1 stand-up FR + plateforme formation n°1
- **6 fonctions de validation** + **3 fonctions de réécriture**
- **5 tests universels** + verdicts APPROVED/NEEDS_REVISION/REJECTED

### Intégration pipelines
- Boucle generate→validate→retry (max 3) dans `publishDailyContent()` et `publishWeeklyArticle()`
- Après 3 échecs : directeur réécrit lui-même
- Graceful fallback si API crash : contenu publié tel quel

### Tests — 80 tests passent
- 17 Stand-Up Director (validation, réécriture, edge cases)
- 4 intégration pipeline (approve, reject, 3-failure-rewrite, API-error)
- Aucune régression sur les 59 tests pré-existants

---

## Audit GEO + Maillage + Compteurs — 19 mars 2026
**Branche** : `claude/seo-keyword-analysis-idfz3`

### GEO — Score 78/100
- **Person schema auteur** sur `/blog/[slug]` et `/a-propos`
- **CollectionPage schema** sur `/vannes`, `/conseils`, `/videos`
- **Instructions GEO** dans le prompt de `seo-blog-agent.ts`

### Fix clusters blog (`blog-clusters.ts`)
- **SAISONNIER** ajouté à `CATEGORY_TO_CLUSTER`
- **Shared slugs** corrigés : `repartie-soiree-anti-malaise`, `conversation-machine-a-cafe` retirés de `humour-contexte`
- **Mock test** mis à jour : `resolveCluster` + `getClusterForCategory`

### Compteurs arrondis
- `roundToTen()` centralisé dans `hooks/use-content-stats.ts`
- Hardcoded harmonisé : 289→290+, 66→60+, 89→80+

### Tests
- 826 tests passent (60 suites, 0 échec)

---

## Audit directeur stand-up v2 — 22 mars 2026
**Branche** : `claude/fix-social-media-posting-5nltR`

### 5 directives implémentées dans `social-media-agent.ts`
- **Wild cards** : 2 slots réactifs/semaine (mercredi + samedi) — tweets "WILD CARD"
- **Marc dating** : 1 tweet dédié le jeudi quand persona MARC
- **Marc hints** : "actionnable (un truc à tester aujourd'hui)" / "come-back, technique concrète"
- **Yanis gen Z** : rotation refs culturelles (memes/TikTok, Netflix, rap FR, gaming, dating apps)
- **Sophie Vanne Réécrite Social** : tous tweets JOKE Sophie reformulés "prête à ressortir mot pour mot"

### Fix sécurité tonalité — fallback validation directeur
- **Problème** : si API directeur crash, posts sauvés `APPROVED` sans validation
- **Fix** : flag `directorValidated: boolean` sur `GeneratedSocialPost`
- 4 chemins de fallback : tout crash → `directorValidated: false`
- `daily-social/route.ts` : `directorValidated === false` → `status: PENDING` + `directorNote: "⚠️ review manuelle requise"`

### Planning éditorial (`social-editorial-plan.json`) — v2 mis à jour
- `directorDirectives_v2` documentant les 5 changements (objectif 9.5/10)
- `wildCardsPerWeek: 2` ajouté
- `schedulingByPersona` enrichi

### Tests
- 915/915 tests passent

---

## Audit cible : prochaines sessions

> Section vivante — chaque audit clôturé est ajouté ci-dessus avec date et branche.
