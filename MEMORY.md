# MEMORY.md — deviensmarrant.fr
_Dernière mise à jour : 2026-03-07 par AGENT MARRANT_

## État du projet
- Phase actuelle : Phase 4 en cours — Améliorations post-audit (toutes phases)
- Dernière version déployée : 0.3.0 (non déployé)
- Audit complet réalisé le 2026-03-08 par l'agent auditeur

## Décisions techniques prises
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
- Design system : palette sombre (#0D0D0D), accents jaune (#F5C518) et orange (#FF6B35)
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

## Agents et périmètres stricts

Chaque agent a un périmètre précis. L'agent auditeur juge chaque agent **uniquement sur sa mission propre**, pas sur celle des autres.

### Agent Blagues
- **Mission** : Produire les blagues (contenu, punchline, catégorisation, ton, variété, qualité humoristique)
- **Périmètre d'audit** : Qualité du contenu, nombre, diversité catégories, pertinence cible 15-35 ans, ton/style, maturityLevel
- **Hors périmètre** : UX des pages, SEO, composants React, API routes

### Agent Conseils
- **Mission** : Produire les conseils humour (titre, contenu, exemples, exercices, catégories, niveaux)
- **Périmètre d'audit** : Qualité pédagogique, progression, exemples concrets, exercices actionnables, cohérence des niveaux
- **Hors périmètre** : UX des pages, SEO, composants React, API routes

### Agent Stand-up (Vidéos)
- **Mission** : Sélectionner et structurer les vidéos stand-up (vrais youtubeId, titres, humoristes, techniques, descriptions)
- **Périmètre d'audit** : Validité des YouTube IDs, diversité des humoristes, pertinence des techniques identifiées, qualité des descriptions, accents/orthographe
- **Hors périmètre** : Player vidéo, UI des cartes, SEO, composants React

### Agent UX
- **Mission** : Design system, composants UI, layout, pages, navigation, responsive, interactions utilisateur
- **Périmètre d'audit** : Cohérence visuelle, architecture composants, accessibilité (a11y), responsive, états (loading/empty/error), parcours utilisateur, micro-interactions
- **Hors périmètre** : Contenu des blagues/conseils/vidéos, SEO technique, API routes, logique métier backend

### Agent SEO (futur)
- **Mission** : Référencement naturel (metadata, structured data, sitemap, robots.txt, Core Web Vitals, SSR/SSG)
- **Périmètre d'audit** : Balises meta, Open Graph, schema.org, canonical URLs, performance, indexabilité
- **Hors périmètre** : Design, contenu humoristique, logique métier

### Agent Auditeur
- **Mission** : Auditer chaque agent **dans son périmètre uniquement**. Donner une note /10, un compte rendu détaillé, et la liste exhaustive des améliorations à faire.
- **Règles strictes** :
  1. Ne PAS auditer un agent sur le périmètre d'un autre agent
  2. Se mettre à la place d'un confrère expert du même domaine (ex : pour l'agent Blagues, se mettre à la place d'un auteur humour professionnel ; pour l'agent UX, se mettre à la place d'un designer UI/UX senior)
  3. Évaluer par rapport à l'objectif produit : devenir n°1 pour les 15-35 ans qui veulent apprendre l'humour
  4. Note /10 obligatoire + compte rendu détaillé + liste d'améliorations concrètes
  5. Ne PAS implémenter les corrections soi-même — lister les améliorations pour que l'agent concerné les implémente

## Notes importantes
- TypeScript strict activé — pas de `any`
- Mobile-first : toutes les pages responsive
- Accessibilité : attributs ARIA sur tous les composants interactifs
- Commentaires en français dans le code
- Seed Prisma lit les JSON depuis docs/content/ (pas de données hardcodées)
- Cible utilisateur : 15-35 ans francophones qui veulent apprendre l'humour et la répartie
