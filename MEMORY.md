# MEMORY.md — deviensmarrant.fr
_Dernière mise à jour : 2026-03-07 par AGENT MARRANT_

## État du projet
- Phase actuelle : Phase 3 terminée — Pages dynamiques + Auth + Favoris + XP
- Dernière version déployée : 0.3.0 (non déployé)

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

## Prochaines étapes
1. Phase 4 : Intégration Claude API complète (page coaching IA)
2. Phase 4 : Intégration Stripe (checkout, webhooks, portail billing)
3. Phase 4 : Boutons favoris inline sur les cartes blagues/conseils/vidéos
4. Phase 4 : Streak auto-increment sur connexion quotidienne
5. Phase 5 : Tests E2E Playwright + déploiement

## Notes importantes
- TypeScript strict activé — pas de `any`
- Mobile-first : toutes les pages responsive
- Accessibilité : attributs ARIA sur tous les composants interactifs
- Commentaires en français dans le code
- Seed Prisma lit les JSON depuis docs/content/ (pas de données hardcodées)
