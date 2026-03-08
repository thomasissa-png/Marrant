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

## Tests persona-driven

Chaque persona a des parcours critiques à couvrir par les tests :

### Yanis (17 ans — répartie & confiance)
- [x] Quiz onboarding : sélection « Avoir de la répartie » + « Entre potes / au lycée »
- [x] HeroSection : affichage tags « Répartie au quotidien », « Confiance en soi »
- [x] Profil : recommandation « Apprends les bases » quand tipsCompleted < 3
- [ ] Parcours : accès au parcours débutant depuis la recommandation profil

### Sophie (26 ans — machine à café)
- [x] Quiz onboarding : sélection « Faire rire les gens » + « Au boulot / machine à café »
- [x] HeroSection : affichage tag « Blagues machine à café »
- [x] Blagues : filtrage par catégorie, pagination, reveal punchline
- [ ] Favoris : ajout rapide et consultation dans l'onglet favoris

### Marc (34 ans — progression globale)
- [x] Quiz onboarding : sélection « Tout ça à la fois » + résultat adapté
- [x] Profil : section « Prochaine étape » avec recommandations contextuelles
- [x] Profil : « Lance un parcours » quand stats suffisantes (tips >= 3, jokes >= 10)
- [ ] Parcours : progression et gain d'XP

## Métriques cibles

| Métrique | Cible |
|----------|-------|
| LCP | < 2.5s |
| CLS | < 0.1 |
| FID | < 100ms |
| Coverage | > 80% |
| Accessibilité | Score > 90 |
