# Note de déploiement, v6 tour 1, lot 3 (en-tête)

À reporter dans `REPLIT_ACTIONS.md` par l'intégration (ce lot n'y touche pas).

## Effet en ligne
Aucun. `ESPACE_CLIENT_PUBLIE = false` dans le dépôt : la bande des rubriques et le menu mobile universel ne sont pas rendus en production ; le site fermé (`header.tsx`, recherche sans `dansMenu`) est inchangé. Jest d'inertie : 47 instantanés identiques, sans mise à jour.

## Modifications (interrupteur ouvert seulement)
- `apps/web/src/components/layout/bande-rubriques.tsx` : chips `px-3` vers `px-1.5`, séparateurs `mx-1.5` vers `mx-1`, soulignement de la rubrique active `inset-x-3` vers `inset-x-1.5` (aligné sur le contenu), cadenas `text-text-muted` vers `text-text-secondary` (spec §2). Texte 14 px et cibles de 44 px de haut inchangés. « Carnet » tient à 1280, 1456 et 1920 px pour le visiteur et le gratuit : 95 px libres au pire cas avec libellés majorés de 4 px (143 px dans le Chromium local) ; avec `px-2`, 47 px seulement.
- `apps/web/src/components/ui/search-bar.tsx` : liste de la recherche du menu mobile (`dansMenu`) dans le flux (`relative`, plus `absolute`) : le menu grandit et défile, rien n'est tranché.
- `apps/web/src/components/layout/menu-mobile-universel.tsx` : indice de suite recalculé quand la liste ouvre ou ferme (`ResizeObserver`).

## Actions Replit
Aucune : ni variable d'environnement, ni paquet, ni migration.

## Contrôles
`npx tsc --noEmit -p tsconfig.build.json`, `npx tsc --noEmit`, `npm run lint`, Jest complet (451 suites, 6 891 tests, 47 instantanés) : verts. Playwright à lancer par l'intégration, serveur construit interrupteur ouvert (`E2E_ESPACE_OUVERT=1`) : `header-budget.spec.ts` (plancher de 80 px à 1280 px et plus, 3 états) et `nav-universelle-s24.spec.ts` (nouveau test « v6 tour 1 : suggestions de la recherche du menu », 375 et 320 px).
