# Marrant — deviensmarrant.fr

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
