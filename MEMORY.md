# MEMORY.md — deviensmarrant.fr
_Dernière mise à jour : 2026-03-07 par AGENT INFRASTRUCTURE_

## État du projet
- Phase actuelle : Setup (Phase 1)
- Dernière version déployée : 0.1.0 (non déployé)

## Décisions techniques prises
- 2026-03-07 INFRA : Monorepo avec apps/web (Next.js 14) + apps/mobile (Expo)
- 2026-03-07 INFRA : PostgreSQL avec Prisma ORM, schéma complet défini
- 2026-03-07 INFRA : NextAuth.js avec Credentials + Google OAuth
- 2026-03-07 INFRA : Tailwind CSS + design system flat/dark (palette Netflix)
- 2026-03-07 INFRA : Claude API (claude-sonnet-4-20250514) pour génération IA
- 2026-03-07 INFRA : Stripe pour gestion abonnements premium (9,99€/mois)
- 2026-03-07 INFRA : Zustand pour state management côté client
- 2026-03-07 INFRA : Zod pour validation des inputs API

## Contenu seed
- Blagues : 15/200 rédigées
- Conseils : 7/50 rédigés
- Vidéos : 5/30 sélectionnées

## Architecture
- Design system : palette sombre (#0D0D0D), accents jaune (#F5C518) et orange (#FF6B35)
- Composants UI : Button, Card, Badge, Input, ProgressBar, StreakCounter
- Pages : Home, Blagues, Conseils, Vidéos, Favoris, Profil, Login, Register
- API routes : /api/jokes, /api/tips, /api/videos, /api/daily, /api/ai, /api/favorites, /api/auth

## Problèmes ouverts
- Hashing des mots de passe à implémenter (bcrypt) — INFRA — Haute
- YouTube video IDs placeholder à remplacer par vrais IDs — MARRANT — Moyenne
- Compléter les 200 blagues seed — BLAGUES — Haute
- Compléter les 50 conseils seed — MARRANT — Haute
- Intégration Stripe complète (webhooks) — INFRA — Moyenne
- Rate limiting API à implémenter — INFRA — Moyenne

## Prochaines étapes
1. Phase 2 : Compléter le contenu seed (200 blagues, 50 conseils, 30 vidéos)
2. Phase 3 : Connecter les pages aux API routes (données dynamiques)
3. Phase 3 : Implémenter le système de favoris côté client
4. Phase 3 : Implémenter le système de progression XP
5. Phase 4 : Intégration Claude API complète + Stripe

## Notes importantes
- TypeScript strict activé — pas de `any`
- Mobile-first : toutes les pages responsive
- Accessibilité : attributs ARIA sur tous les composants interactifs
- Commentaires en français dans le code
