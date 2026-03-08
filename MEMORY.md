# MEMORY.md — deviensmarrant.fr
_Dernière mise à jour : 2026-03-08 par AGENT MARRANT_

## État du projet
- Phase actuelle : Phase 4 en cours — Améliorations post-audit (toutes phases)
- Dernière version déployée : 0.3.0 (non déployé)
- Audit complet réalisé le 2026-03-08 par l'agent auditeur

## Décisions techniques prises
- 2026-03-08 DEPLOY : Configuration Replit (.replit, replit.nix, port 5000 sur 0.0.0.0)
- 2026-03-08 DEPLOY : Script setup (`npm run setup` = install + prisma generate + db push + seed)
- 2026-03-08 DESIGN : Remplacement couleur secondaire orange (#FF6B35) → violet (#8B5CF6)
- 2026-03-08 DESIGN : Accent-violet comme couleur secondaire, gradient jaune→violet
- 2026-03-07 INFRA : Monorepo avec apps/web (Next.js 14) + apps/mobile (Expo)
- 2026-03-07 INFRA : PostgreSQL avec Prisma ORM, schéma complet défini
- 2026-03-07 INFRA : NextAuth.js avec Credentials + Google OAuth
- 2026-03-07 INFRA : Tailwind CSS + design system flat/dark (palette Netflix)
- 2026-03-07 INFRA : Claude API (claude-sonnet-4-20250514) pour génération IA
- 2026-03-07 INFRA : Stripe pour gestion abonnements premium (9,99€/mois)
- 2026-03-07 INFRA : Zustand pour state management côté client
- 2026-03-07 INFRA : Zod pour validation des inputs API
- 2026-03-07 CONTENU : Seed Prisma importe depuis fichiers JSON (docs/content/)
- 2026-03-07 CONTENU : Système de progression XP avec 5 niveaux et badges défini
- 2026-03-07 AUTH : Hashing scrypt natif (crypto Node.js) au lieu de bcrypt
- 2026-03-07 AUTH : Register API (/api/auth/register) avec validation Zod
- 2026-03-07 AUTH : Login/Register wired à NextAuth signIn + auto-login après inscription
- 2026-03-07 AUTH : SessionProvider wrapping le layout racine
- 2026-03-07 AUTH : Header dynamique (connecté vs déconnecté)
- 2026-03-07 STORE : Zustand user-store (XP, level, streak, stats)
- 2026-03-07 STORE : Zustand favorites-store (add/remove/toggle favoris)
- 2026-03-07 API : /api/user (GET profil), /api/user/xp (POST gain XP)
- 2026-03-07 API : /api/favorites/[id] (DELETE), favoris via session auth
- 2026-03-07 API : /api/daily fallback déterministe si pas de DailyContent configuré
- 2026-03-07 UI : Composants client pour toutes les pages dynamiques

## Contenu seed
- Blagues : 200/200 rédigées ✅
- Conseils : 50/50 rédigés ✅
- Vidéos : 30/30 sélectionnées ✅
- Système de progression : niveaux, XP, badges, streaks ✅

## Architecture
- Design system : palette sombre (#0D0D0D), accents jaune (#F5C518) et violet (#8B5CF6)
- Composants UI : Button, Card, Badge, Input, ProgressBar, StreakCounter
- Pages : Home, Blagues, Conseils, Vidéos, Favoris, Profil, Login, Register
- API routes : /api/jokes, /api/tips, /api/videos, /api/daily, /api/ai, /api/favorites, /api/auth

## Fichiers de contenu
- `docs/content/blagues-seed.json` — 200 blagues (8 catégories, 3 types, maturité 1-3)
- `docs/content/conseils-seed.json` — 50 conseils (7 catégories, 3 niveaux)
- `docs/content/videos-seed.json` — 30 vidéos (10 humoristes, 7 catégories)
- `docs/content/progression-levels.md` — 5 niveaux, système XP, 20+ badges

## Phase 3 — Réalisations
- Pages dynamiques : toutes les pages chargent depuis les API routes ✅
- Auth complète : register, login, session, header dynamique ✅
- Hashing mots de passe : scrypt natif (timing-safe) ✅
- Favoris : store Zustand + API CRUD + page favoris dynamique ✅
- Progression XP : store Zustand + API XP + calcul niveau auto ✅
- Profil : dashboard dynamique (niveau, streak, stats, abonnement) ✅
- Contenu du jour : fallback déterministe basé sur le jour de l'année ✅

## Déploiement Replit
1. **Provisionner PostgreSQL** dans Replit (Database tab ou secrets `DATABASE_URL`)
2. **Configurer les secrets Replit** : `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (= URL Replit publique)
3. **Installer et initialiser** : `cd apps/web && npm run setup` (install + prisma generate + db push + seed)
4. **Lancer** : `npm run dev` (port 5000 sur 0.0.0.0, automatiquement exposé par Replit)
5. **Build production** : `npm run build && npm run start`

## Problèmes ouverts
- YouTube video IDs placeholder à remplacer par vrais IDs — MARRANT — Moyenne
- Intégration Stripe complète (webhooks, checkout) — INFRA — Moyenne
- Rate limiting API à implémenter — INFRA — Moyenne
- Streak auto-update sur login quotidien — INFRA — Basse
- Badges système à implémenter côté backend — INFRA — Basse

## Phase 4 — Améliorations post-audit (en cours)
### Agent Stand-up
- Remplacement des 30 youtubeId placeholders par de vrais IDs
- Correction des accents manquants dans les données

### Agent UX — Fondations
- Layout partagé `(dashboard)/layout.tsx` avec Header + Footer
- Page 404 personnalisée et drôle
- Indication de page active dans la navigation
- Pages légales (CGU, mentions légales, confidentialité)
- Metadata SEO pour les pages auth (login, register, forgot-password)

### Agent UX — Engagement
- Boutons Favori inline sur les cartes blagues/conseils/vidéos
- Bouton Partager (Web Share API + fallback clipboard)
- Barre de recherche globale (blagues + conseils + vidéos)
- Système de réactions (🔥/💀) sur les blagues

### Agent Blagues
- 6 nouvelles catégories jeunes (École, Gaming, Réseaux sociaux, Dating, Soirées, Parents)
- 120 nouvelles blagues pour les nouvelles catégories
- Système de vote/réactions

### Agent Conseils
- Parcours d'apprentissage guidés (4 parcours)
- Gain d'XP à la lecture des conseils
- Page Parcours avec progression

### Agent UX — Rétention
- Quiz d'onboarding ("Découvre ton profil humour")
- PWA manifest + robots.txt + sitemap.xml
- Hero section adaptative (connecté vs déconnecté)
- Redirection post-inscription vers l'onboarding

## Prochaines étapes
1. Phase 5 : Intégration Claude API complète (page coaching IA)
2. Phase 5 : Intégration Stripe (checkout, webhooks, portail billing)
3. Phase 5 : Streak auto-increment sur connexion quotidienne
4. Phase 6 : Tests E2E Playwright + déploiement

## Personas de référence

Trois personas guident **toutes les décisions** de contenu, UX, design, SEO et audit. Chaque agent doit les avoir en tête dans son travail.

### Yanis — 17 ans, lycéen
- **Profil** : Manque de confiance en lui, introverti, veut progresser en répartie pour s'affirmer au lycée et avec ses potes.
- **Objectif** : Avoir de la répartie — savoir quoi répondre du tac au tac sans rester muet.
- **Besoins** : Exercices concrets, techniques simples, progression visible (XP/streak), ton encourageant et non intimidant.
- **Friction** : Jargon trop « adulte », contenu qui suppose une vie sociale active, absence de message rassurant pour les timides.

### Sophie — 26 ans, jeune active
- **Profil** : CDI dans une boîte moyenne, sociable mais manque de conversation à la machine à café. Veut avoir des anecdotes et blagues à ressortir au bon moment.
- **Objectif** : Alimenter ses conversations quotidiennes — machine à café, afterwork, dîners entre amis.
- **Besoins** : Blagues courtes et mémorisables, conseils de timing, contenu actualisé régulièrement, catégories filtrables.
- **Friction** : Contenu trop long, blagues datées, pas de mention de situations professionnelles.

### Marc — 34 ans, récemment séparé
- **Profil** : En reconstruction après une séparation, veut renouer avec l'humour et la légèreté. Cherche à progresser globalement — blagues, répartie, storytelling.
- **Objectif** : Redevenir drôle et à l'aise socialement, retrouver confiance en ses interactions.
- **Besoins** : Parcours structurés, progression mesurable, variété de contenus (blagues + conseils + vidéos), ton bienveillant sans infantiliser.
- **Friction** : Contenu uniquement orienté « ados/étudiants », manque de profondeur dans les parcours, absence de recommandations personnalisées.

---

## Agents et périmètres stricts

Chaque agent a un périmètre précis. L'agent auditeur juge chaque agent **uniquement sur sa mission propre**, pas sur celle des autres. **Tous les agents doivent intégrer les 3 personas (Yanis, Sophie, Marc) dans leurs décisions.**

### Agent Blagues
- **Mission** : Produire les blagues (contenu, punchline, catégorisation, ton, variété, qualité humoristique)
- **Périmètre d'audit** : Qualité du contenu, nombre, diversité catégories, pertinence cible 15-35 ans, ton/style, maturityLevel
- **Hors périmètre** : UX des pages, SEO, composants React, API routes
- **Directive personas** :
  - Yanis : inclure des blagues qui marchent au lycée (école, potes, parents), ton jamais condescendant, maturityLevel 1 majoritaire
  - Sophie : privilégier les blagues courtes et mémorisables, faciles à ressortir à la machine à café ou en afterwork, inclure des blagues « situation pro »
  - Marc : varier les registres (auto-dérision, storytelling, observationnel), blagues qui marchent en contexte social adulte (dîner, rendez-vous, soirée)

### Agent Conseils
- **Mission** : Produire les conseils humour (titre, contenu, exemples, exercices, catégories, niveaux)
- **Périmètre d'audit** : Qualité pédagogique, progression, exemples concrets, exercices actionnables, cohérence des niveaux
- **Hors périmètre** : UX des pages, SEO, composants React, API routes
- **Directive personas** :
  - Yanis : exercices réalisables seul ou avec un ami, ton encourageant « tu vas y arriver », accent mis sur la répartie et la confiance
  - Sophie : conseils de timing et de placement dans une conversation, exemples en contexte professionnel (réunion, pause café, afterwork)
  - Marc : conseils de storytelling et d'auto-dérision, progression structurée de « débutant » à « à l'aise », ton bienveillant adulte

### Agent Stand-up (Vidéos)
- **Mission** : Sélectionner et structurer les vidéos stand-up (vrais youtubeId, titres, humoristes, techniques, descriptions)
- **Périmètre d'audit** : Validité des YouTube IDs, diversité des humoristes, pertinence des techniques identifiées, qualité des descriptions, accents/orthographe
- **Hors périmètre** : Player vidéo, UI des cartes, SEO, composants React
- **Directive personas** :
  - Yanis : inclure des humoristes jeunes/actuels (Fary, Paul Mirabel, Kev Adams), contenu accessible, techniques de répartie identifiées
  - Sophie : mettre en avant les techniques de timing et d'anecdote, descriptions orientées « à reproduire au quotidien »
  - Marc : varier les profils d'humoristes (débutants et confirmés), inclure des exemples d'auto-dérision et de storytelling

### Agent Design
- **Mission** : Design system, identité visuelle, palette, typographie, composants visuels, cohérence graphique
- **Périmètre d'audit** : Cohérence palette, contraste, lisibilité, hiérarchie visuelle, responsive, dark mode
- **Hors périmètre** : Contenu textuel, SEO technique, logique métier
- **Directive personas** :
  - Yanis : interface gaming-friendly, animations engageantes (XP, streak, badges), pas d'UI « corporate » qui ferait fuir un ado
  - Sophie : design clean et pro, pas enfantin, rapide à scanner (cards courtes, CTAs clairs)
  - Marc : interface mature sans être austère, progression visible et gratifiante, pas de design trop « jeune »

### Agent UX
- **Mission** : Parcours utilisateur, navigation, layout, pages, interactions, états (loading/empty/error), onboarding, rétention
- **Périmètre d'audit** : Architecture de l'information, parcours utilisateur, accessibilité (a11y), micro-interactions, conversion, rétention
- **Hors périmètre** : Contenu des blagues/conseils/vidéos, SEO technique, API routes, logique métier backend
- **Directive personas** :
  - Yanis : onboarding guidé et rassurant, quiz d'entrée orienté « objectif » (répartie/confiance), progression gamifiée (XP, streaks, badges), recommandations personnalisées sur le profil
  - Sophie : accès rapide au contenu du jour, filtres efficaces, favoris faciles à retrouver, partage en 1 clic
  - Marc : parcours structurés mis en avant, section « Prochaine étape » dans le profil, recommandations contextuelles basées sur la progression

### Agent SEO
- **Mission** : Référencement naturel (metadata, structured data, sitemap, robots.txt, Core Web Vitals, SSR/SSG)
- **Périmètre d'audit** : Balises meta, Open Graph, schema.org, canonical URLs, performance, indexabilité
- **Hors périmètre** : Design, contenu humoristique, logique métier
- **Directive personas** :
  - Yanis : cibler « comment avoir de la répartie », « devenir drôle ado », « manque de confiance humour »
  - Sophie : cibler « blagues machine à café », « conversation bureau », « devenir drôle au travail »
  - Marc : cibler « apprendre l'humour adulte », « progresser en humour », « retrouver confiance humour »

### Agent Test
- **Mission** : Garantir la qualité du code par les tests unitaires, d'intégration et E2E. Exécuter les tests avant chaque commit.
- **Périmètre d'audit** : Couverture des composants, pages, stores, libs, API routes. Tests de rendu, interactions, ARIA, états, filtres, pagination, navigation.
- **Hors périmètre** : Contenu des blagues/conseils/vidéos, design visuel, SEO
- **Directive personas** :
  - Tester les parcours critiques de chaque persona : onboarding quiz (objectif + contexte), recommandations profil, filtres par catégorie, favoris, partage
  - Vérifier que le copy persona-driven est bien rendu (use-case tags hero, « percutant », « répartie », « machine à café »)
  - Tester les états conditionnels du profil (tipsCompleted < 3, jokesRead < 10, etc.)

### Agent Auditeur
- **Mission** : Auditer chaque agent **dans son périmètre uniquement**. Donner une note /10, un compte rendu détaillé, et la liste exhaustive des améliorations à faire.
- **Règles strictes** :
  1. Ne PAS auditer un agent sur le périmètre d'un autre agent
  2. Se mettre à la place d'un confrère expert du même domaine (ex : pour l'agent Blagues, se mettre à la place d'un auteur humour professionnel ; pour l'agent UX, se mettre à la place d'un designer UI/UX senior)
  3. Évaluer par rapport à l'objectif produit : devenir n°1 pour les 15-35 ans qui veulent apprendre l'humour
  4. Note /10 obligatoire + compte rendu détaillé + liste d'améliorations concrètes
  5. Ne PAS implémenter les corrections soi-même — lister les améliorations pour que l'agent concerné les implémente
- **Directive personas** :
  - Évaluer **systématiquement** chaque agent à travers le prisme des 3 personas
  - Pour chaque audit, inclure une section « Adéquation personas » qui vérifie que le travail de l'agent sert bien Yanis, Sophie ET Marc
  - Signaler tout contenu/design/UX qui exclurait ou frustrerait l'un des 3 profils
  - Bonus : proposer des améliorations spécifiques par persona quand c'est pertinent

---

## Notes importantes
- TypeScript strict activé — pas de `any`
- Mobile-first : toutes les pages responsive
- Accessibilité : attributs ARIA sur tous les composants interactifs
- Commentaires en français dans le code
- Seed Prisma lit les JSON depuis docs/content/ (pas de données hardcodées)
- Cible utilisateur : 15-35 ans francophones qui veulent apprendre l'humour et la répartie
- **Les 3 personas (Yanis, Sophie, Marc) sont la boussole de toutes les décisions produit**
