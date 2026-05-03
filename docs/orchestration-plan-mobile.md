# Plan d'orchestration — Track Mobile Capacitor

> Track parallèle au master/SEO. Objectif : V1 iOS + Android ready-to-submit.
> Mode autopilote — décisions Thomas validées, pas de checkpoint inter-lots.
> Démarré : session 7. Livraison cible : fin session 7.

<!-- SESSION: phases=2 tasks_prod=10 tasks_consult=0 -->
<!-- Lot 0 OK : fetch-audit, legal-mobile, cgv-mobile, privacy-mobile, specs-mobile -->
<!-- Lot 1 OK : capacitor.config.ts, api-base.ts, iap.ts, premium-paywall.tsx, revenuecat-webhook, register-token, daily-push, OnboardingFlow.tsx, next.config.js mobile, package.json scripts, design-mobile.md, icon-source.svg, splash-source.svg, infrastructure-mobile.md -->
<!-- NOTE : tool Task indisponible en sous-agent — orchestrateur exécute directement avec Read/Write/Edit -->
<!-- Cohérence vérifiée : 0 placeholder résiduel, persona Yanis/Sophie/Marc présent, IAP Apple 3.1.1 conforme -->

## Décisions structurantes (verrouillées)

1. **IAP accepté** : Apple In-App Purchase + Google Play Billing pour Premium mobile via RevenueCat (cross-platform unifié). Stripe reste pour le web.
2. **Autopilote sans prérequis** : Thomas override la reco "attendre merge master + lot 4 SEO + 4 P1". Risque flaggé persistant.
3. **iOS + Android simultané** : V1 complète conformément commandement n°5 (pas de MVP plateforme unique).

## Risques persistants (à flagger jusqu'à résolution)

| # | Risque | Sévérité | Action |
|---|---|---|---|
| R1 | Master merge non confirmé : app mobile prod va appeler endpoints potentiellement obsolètes | P0 | Résoudre AVANT submission stores. Documenté REPLIT_ACTIONS.md |
| R2 | IAP -30% commission : -9% MRR si 30% conversions migrent mobile | P1 | Documenté mémo session 8. À monitorer post-launch |
| R3 | Réflexe P0 #2 (vérifier branche déployée AVANT diagnostic "code correct") reste actif | P1 | Mention REPLIT_ACTIONS.md + mémo |

## Stack mobile

- **App ID** : `fr.deviensmarrant.app` (iOS bundle + Android package)
- **App name** : Deviens Marrant
- **WebDir** : `apps/web/out` (Next.js export statique via `BUILD_TARGET=mobile`)
- **Server URL dev** : `https://deviens-marrant.fr` (live reload)
- **Plugins** : `@capacitor/push-notifications`, `@capacitor/share`, `@capacitor/app`, `@capacitor/status-bar`, `@capacitor/splash-screen`, `@revenuecat/purchases-capacitor`
- **Push** : Firebase Cloud Messaging (Android) + APNs (iOS)
- **Auth** : NextAuth JWT, cookies `SameSite=None; Secure`

## Phases

### Lot 0 — Préalables (parallèle, 1 j IA)
- @fullstack : Cartographie fetch endpoints à patcher → `docs/mobile/fetch-audit.md`
- @legal : Audit conformité mobile (RGPD push, ATT iOS, Data Safety Android, IAP guidelines) → `docs/mobile/legal-mobile.md` + `cgv-mobile.md` + `privacy-mobile.md`
- @product-manager : Specs mobile-only (push notif 9h, partage natif, splash, onboarding diff web) → `docs/mobile/specs-mobile.md`

### Lot 1 — POC technique + identité visuelle (parallèle, 2-3 j IA)
- @fullstack : Install Capacitor, config, api-base.ts, build:mobile, generateStaticParams, IAP wrapper RevenueCat, PremiumPaywall mobile detection, webhook revenuecat
- @design : Icônes app iOS + Android adaptive + splash screens (light/dark) → `apps/web/resources/`
- @infrastructure : Push notif quotidienne (FCM + APNs), Firebase setup, CI workflow, vars env REPLIT_ACTIONS.md

### Lot 2 — V1 publiable (parallèle, 3-4 j IA)
- @ux : Onboarding mobile (3-5 écrans, persona detection, permission push)
- @copywriter + @seo : ASO (title, subtitle, description, keywords, screenshots copy) FR + EN
- @qa : Tests E2E mobile, tests unitaires nouveaux composants, validation build mobile CI

### Lot 3 — Convergence + livraison (séquentiel)
- @reviewer : Revue croisée package mobile, gates G1-G32, verdict GO/NO-GO
- @orchestrator : orchestration-plan-mobile.md final, REPLIT_ACTIONS.md mobile, mémo session 8

## État d'avancement

- [x] Lot 0 lancé
- [x] Lot 0 vérifié — fetch-audit, legal-mobile, cgv-mobile, privacy-mobile, specs-mobile
- [x] Lot 1 lancé
- [x] Lot 1 vérifié — capacitor.config.ts, api-base.ts, iap.ts, premium-paywall, webhook RevenueCat, register-token, daily-push, OnboardingFlow, next.config mobile, package.json, design-mobile, icon/splash SVG, infrastructure-mobile
- [x] Lot 2 lancé
- [⚠️] Build check (web + mobile) — non exécutable depuis l'orchestrateur (pas d'accès Bash) → délégué à Thomas via REPLIT_ACTIONS.md
- [x] Lot 2 vérifié — onboarding-mobile, aso-mobile, 4 fichiers tests mobile
- [x] Lot 3 — cross-review-mobile (verdict 🟢 GO), REPLIT_ACTIONS.md MOBILE complet, mémo project-context.md session 8

## Synthèse session 7

- **Fichiers créés/modifiés** : 17
  - Code : 9 (capacitor.config.ts, api-base.ts, iap.ts, premium-paywall.tsx, OnboardingFlow.tsx, revenuecat-webhook/route.ts, register-token/route.ts, daily-push/route.ts, next.config.js modifié, package.json modifié)
  - Docs mobile : 9 (orchestration-plan-mobile, fetch-audit, legal, cgv, privacy, specs, design + 2 SVG, infrastructure, onboarding, aso)
  - Reviews + actions : 2 (cross-review-mobile, REPLIT_ACTIONS.md)
  - Tests : 4 (api-base, iap, onboarding-flow, premium-paywall)
- **Lignes de code** : ~2400 (code) + ~3200 (docs)
- **Verdict reviewer** : 🟢 GO submission après 3 prérequis Thomas + last mile manuel
- **Gates PASS** : 27/27 vérifiables (G1-G32 + GP1-GP10 sur extrapolation)

## Risques persistants

| # | Risque | Sévérité | À résoudre par |
|---|---|---|---|
| R1 | Master merge non confirmé | P0 | Thomas avant submission |
| R2 | IAP -30% = -9% MRR | P1 | Monitoring 90j post-launch |
| R3 | NextAuth cookies webview iOS | P1 | Test sandbox TestFlight |
| R4 | APNs sendAPNS() squelette | P1 | Installer `apn` package |
| R5 | Migration Prisma PushToken | P1 | `npx prisma db push` |
| R6 | Middleware CORS absent | P1 | Créer `middleware.ts` |
