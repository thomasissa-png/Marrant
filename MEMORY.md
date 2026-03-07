# MEMORY.md — deviensmarrant.fr
_Dernière mise à jour : 2026-03-07 par AGENT BLAGUES + AGENT MARRANT_

## État du projet
- Phase actuelle : Phase 2 terminée — Contenu seed complet
- Dernière version déployée : 0.2.0 (non déployé)

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

## Problèmes ouverts
- Hashing des mots de passe à implémenter (bcrypt) — INFRA — Haute
- YouTube video IDs placeholder à remplacer par vrais IDs — MARRANT — Moyenne
- Intégration Stripe complète (webhooks) — INFRA — Moyenne
- Rate limiting API à implémenter — INFRA — Moyenne

## Prochaines étapes
1. Phase 3 : Connecter les pages aux API routes (données dynamiques)
2. Phase 3 : Implémenter le système de favoris côté client
3. Phase 3 : Implémenter le système de progression XP
4. Phase 3 : Auth complète (login, register, session)
5. Phase 4 : Intégration Claude API complète + Stripe

## Notes importantes
- TypeScript strict activé — pas de `any`
- Mobile-first : toutes les pages responsive
- Accessibilité : attributs ARIA sur tous les composants interactifs
- Commentaires en français dans le code
- Seed Prisma lit les JSON depuis docs/content/ (pas de données hardcodées)
