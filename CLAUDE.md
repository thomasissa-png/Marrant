# Marrant — deviens-marrant.fr

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

## Agent SEO — Instructions automatisées

### Planning éditorial
- Le planning éditorial est dans **`/seo-editorial-plan.json`** à la racine du projet.
- Ce fichier contient : mots-clés cibles, clusters thématiques, articles planifiés avec statut, et règles de maillage interne.

### Workflow agent SEO à chaque session
1. **Lire** `seo-editorial-plan.json`
2. **Identifier** les articles `planned` dont la `scheduledWeek` est passée ou en cours
3. **Rédiger** les articles dans `apps/web/src/lib/blog-articles.ts` en respectant les `qualityRules` du fichier
4. **Mettre à jour** le statut dans le JSON : `"status": "published"`, ajouter `"publishedDate": "YYYY-MM-DD"`
5. **Prolonger** : quand il reste < 4 articles `planned`, générer 8 nouveaux articles en suivant la stratégie de clusters et les mots-clés long-tail non couverts
6. **Commit + push** les changements

### Règles de rédaction SEO
- Titre < 60 caractères, mot-clé principal en début
- Meta description < 155 caractères, incitative
- Contenu : 1500-2500 mots (pillar) / 1000-1800 mots (satellite)
- Structure : H2 sous-sujets, H3 détails, listes, gras sur termes clés
- Maillage interne : minimum 5 liens par article
- FAQ schema : 3-5 questions en fin d'article
- CTA vers la section produit pertinente (/parcours, /vannes, /conseils)

### Cannibalisation
- Vérifier qu'un nouvel article ne cannibalise pas un article existant (même mot-clé principal)
- Les cas identifiés sont documentés dans `cannibalizationFixes` du JSON

## Personas de référence

Trois personas guident les décisions UX/copy du site. À consulter pour toute évolution majeure.

### Yanis — 20 ans, étudiant
- **Profil** : Étudiant introverti, manque de confiance en lui, veut progresser en répartie pour s'affirmer en soirées, en coloc et avec ses potes.
- **Objectif principal** : Avoir de la répartie — savoir quoi répondre du tac au tac sans rester muet.
- **Besoins** : Exercices concrets, techniques simples, progression visible (XP/streak), ton encourageant et complice.
- **Points de friction** : Contenu trop formel ou corporate, absence de message rassurant pour les timides, manque de références à la vie étudiante.

### Sophie — 26 ans, jeune active
- **Profil** : CDI dans une boîte moyenne, sociable mais manque de conversation à la machine à café. Veut avoir des anecdotes et blagues à ressortir au bon moment.
- **Objectif principal** : Alimenter ses conversations quotidiennes — machine à café, afterwork, dîners entre amis.
- **Besoins** : Blagues courtes et mémorisables, conseils de timing, contenu actualisé régulièrement, catégories filtrables.
- **Points de friction** : Contenu trop long, blagues datées, pas de mention de situations professionnelles.

### Marc — 34 ans, récemment séparé
- **Profil** : En reconstruction après une séparation, veut renouer avec l'humour et la légèreté. Cherche à progresser globalement — blagues, répartie, storytelling.
- **Objectif principal** : Redevenir drôle et à l'aise socialement, retrouver confiance en ses interactions.
- **Besoins** : Parcours structurés, progression mesurable, variété de contenus (blagues + conseils + vidéos), ton bienveillant sans infantiliser.
- **Points de friction** : Contenu uniquement orienté « ados/étudiants », manque de profondeur dans les parcours, absence de recommandations personnalisées.
