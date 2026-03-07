# Plan de tests — deviensmarrant.fr

## Stack de tests

| Type | Outil | Couverture cible |
|------|-------|------------------|
| Unit tests | Jest + React Testing Library | 80% |
| E2E tests | Playwright | Pages critiques |
| API tests | Supertest via Jest | Toutes les routes |
| Performance | Lighthouse CI | Core Web Vitals |
| Accessibilité | axe-core | WCAG AA |

## Tests unitaires

### Composants UI
- [ ] Button : tous les variants et tailles
- [ ] Card : rendu correct
- [ ] Badge : tous les variants
- [ ] Input : états (focus, disabled, error)
- [ ] ProgressBar : calcul pourcentage, variantes
- [ ] StreakCounter : affichage correct

### Lib/Utils
- [ ] `cn()` : fusion de classes
- [ ] `formatDateFr()` : format français
- [ ] `USER_LEVELS` : seuils XP corrects
- [ ] `FREE_LIMITS` : limites plan gratuit

### API Routes
- [ ] GET /api/jokes : pagination, filtres, validation
- [ ] GET /api/tips : pagination, filtres, validation
- [ ] GET /api/videos : pagination, filtres, validation
- [ ] GET /api/daily : contenu du jour
- [ ] POST /api/ai : validation, génération
- [ ] GET/POST /api/favorites : CRUD favoris

## Tests E2E (Playwright)

- [ ] Parcours inscription → connexion
- [ ] Navigation entre toutes les sections
- [ ] Affichage blague du jour
- [ ] Filtrage des blagues par catégorie
- [ ] Ajout / suppression de favoris
- [ ] Upgrade premium (mock Stripe)

## Métriques cibles

| Métrique | Cible |
|----------|-------|
| LCP | < 2.5s |
| CLS | < 0.1 |
| FID | < 100ms |
| Coverage | > 80% |
| Accessibilité | Score > 90 |
