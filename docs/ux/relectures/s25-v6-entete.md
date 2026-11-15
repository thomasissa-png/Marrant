# Relecture UX à l'aveugle s25 v6 : en-tête et bande des rubriques

Périmètre : `docs/captures/s25/v6-tour-1/entete/` (bandeaux, menus, cloche, compte, focus, recherche, 3 comptes + visiteur, 375/768/1280, plus 440 à 641 et 1024/1456 pour le visiteur), code `apps/web/src/components/layout/` et `components/espace/rubriques.ts`. Relecture à l'aveugle : aucune relecture, aucun commit, aucun REPLIT_ACTIONS lu.

## Ce qui est vu et n'est pas vu
- Vu : bandeaux et pages hautes visiteur (375, 440, 520, 641, 768, 1024, 1280, 1456), gratuit (641, 768, 1280), en-cours et nouvel (375, 768, 1280) ; menus 375/320 (visiteur, gratuit, en-cours) ; cloche (375, 768, 1280, vide 375) ; compte (768, 1280, profil) ; focus bande 375/768/1280, focus menu, cloche, compte ; recherche 375/1280.
- Non vu, donc non noté : fenêtre de moins de 500 px de haut (bande dans le menu) : aucune capture ne l'exerce (les « menu-court » font 568 px). `/abonnement` sans bande : aucune capture. Cloche au clavier à 768 : pas de capture lisible utilisée.

## Notes

| Critère | Note | Verdict |
|---|---|---|
| Design 1 fidélité à l'accueil | 9 | Pastille `rounded-xl`, panneaux cloche/compte/suggestions avec filet dégradé violet en haut : même langue que les cartes de l'accueil. La bande elle-même est unie (`bg-background-light`), sans filet : choix assumé, piste seulement. |
| Design 2 hiérarchie et lisibilité | 9 | Rubrique active en blanc sur pastille avec soulignement violet de 3 px (lisible sans la teinte). Cadenas discrets, texte `#B3B3B3` sur `#1A1A1A` AA. |
| Design 3 mise en page aux largeurs | **5** | **Faute dure** : « Carnet » coupé au repos à 1280, 1456 (et 1920, même coque) pour visiteur et gratuit ; voir F1. Pour l'abonné (sans cadenas) tout tient avec marge. |
| Design 4 cohérence avec l'espace | 9 | Mêmes panneaux et mêmes anneaux de focus sur cloche, compte, menu, recherche. |
| Design 5 finition | 8 | Suggestions de recherche coupées dans le menu mobile (F2). Cibles 44 px et anneaux `accent-link` conformes sur tout ce qui est capturé. |
| UX 1 compréhension | 9 | On sait où on est (chip allumé, icône du compte allumée sur /profil). |
| UX 2 action principale unique | 9 | Un seul bouton d'offre dans l'en-tête ; menu réduit à 3 à 5 lignes. |
| UX 3 états vides, nouvel abonné | 10 | Cloche vide : « Rien de nouveau. Reviens quand tu veux. » ; cloche sans pastille pour le nouvel abonné ; Aujourd'hui jamais mort. |
| UX 4 aperçu Premium | 9 | Aperçu « Aujourd'hui » du gratuit : valeur visible, un seul bouton plein dans la page. Réserve : sur la bande, la rubrique Premium « Carnet » est coupée (F1). |
| UX 5 accessibilité et cohérence | 9 | Focus visible partout, ordre de Tab logique, focus dans cloche (Fermer) et compte conforme. Réserve : « Carnet » n'est atteignable qu'au Tab ou au défilement latéral à 1280 (F1). |

**NOTE GLOBALE : 5/10** (minimum : design 3). Sous la barre de 9.

## Fautes dures

### F1 : « Carnet » tronqué à 1280, 1456 et 1920 (visiteur et gratuit) `[FRICTION H4/H8]`
- Preuves : `visiteur-vannes-1280.png`, `visiteur-vannes-1280-bandeau.png`, `visiteur-vannes-1456.png`, `visiteur-accueil-1280.png`, `gratuit-mon-espace-1280.png`, `gratuit-vannes-1280.png`. Le libellé s'arrête sur « Carnet » puis un fondu, avant le bouton « … ». À 1456 la bande fait 1216 px de coque : même défaut. Abonné : `en-cours-vannes-1280-bandeau.png`, tout tient (195 px libres).
- Spec violée : `navigation-v6-menu-rubriques.md` §1 (« Aucune rubrique n'est jamais comprimée ni tronquée », total pire cas 1 111 px donné, ≥ 80 px libres) et critère 6.2. Le budget estimé (1 111) est faux : la bande réelle mesure environ 1 190 px, soit un dépassement d'environ 20 px au lieu de 105 libres.
- Correction codable, `apps/web/src/components/layout/bande-rubriques.tsx` :
  - chaque chip : `px-3` devient `px-2` dans la ligne `className={cn(ZONE, "gap-[5px] whitespace-nowrap px-3", …)}` (gain 8 px par chip, 12 chips, environ 96 px) ; la cible reste ≥ 44 px de haut, la largeur reste > 44 px ;
  - séparateurs : `mx-1.5` devient `mx-1` (gain 8 px) ;
  - `after:inset-x-3` du soulignement de `ACTIF` devient `after:inset-x-2` pour garder la même longueur relative ;
  - la valeur définitive est à mesurer par `playwright/tests/local/header-budget.spec.ts` (Chrome de la CI, plancher 80 px libres, pire cas visiteur).
- Ce qui ferait 10 : à 1280, 1456 et 1920, les 12 chips et « … » visibles sans fondu au repos, ≥ 80 px libres au pire cas, mesurés à la CI.

### F2 : suggestions de recherche coupées dans le menu mobile (375, 320)
- Preuve : `visiteur-recherche-ouverte-375.png`. Le panneau « Suggestions » s'ouvre dans le menu : la première rangée (timing, répartie, storytelling) est entière, la seconde (observation, absurde, jeux de mots) est tranchée net par le bas du menu (y ≈ 305). Le menu à `overflow-y-auto` rogne la liste en position absolue ; l'utilisateur ne voit pas qu'il y a une suite, et un chip à moitié coupé est une finition cassée.
- Correction codable : `apps/web/src/components/ui/search-bar.tsx`, branche `dansMenu` : rendre la liste des suggestions dans le flux (`static` / `relative mt-2`, pleine largeur) au lieu de `absolute`, de sorte que le menu grandisse (`menu-mobile-universel.tsx` a déjà `max-h` et `overflow-y-auto`). Alternative : `scrollIntoView` du bas de la liste à l'ouverture.
- Ce qui ferait 10 : les 6 suggestions entières visibles dans le menu à 375 et 320, Connexion et le bouton d'offre repoussés vers le bas.

## Pistes (ne retiennent pas la note)
1. `rubriques.ts` : `estPremium` pose le cadenas sur Favoris (groupe 3) pour le visiteur et le gratuit. La spec §2 dit « groupes 2 et 3 ouverts » ; le code cite un arbitrage du 15/11 (page d'aperçu au lot B). Cohérent avec le code, mais le cadenas isolé de Favoris à droite du second séparateur brouille la lecture « gauche = Premium, droite = gratuit ». Écart documenté, à confirmer par Thomas.
2. Recherche 1280 (`visiteur-recherche-ouverte-1280.png`) : le panneau de suggestions recouvre les chips Vannes à Articles. Normal pour une liste déroulante au-dessus de la bande (z-50) ; rien à corriger.
3. Cadenas en `text-text-muted` (`#9A9A9A`) au lieu de `text-text-secondary` prévu par la spec §2 ; contraste suffisant (≥ 3:1 en icône), pas de défaut visible.
4. Menu mobile : « Connexion » du visiteur est une ligne sans icône alors que « Mon profil » et « Déconnexion » en ont ; asymétrie minime (`visiteur-menu-vannes-375.png` contre `en-cours-menu-mon-espace-375.png`).
5. Aperçu du gratuit à 1280 : deux boutons d'offre pleins visibles (en-tête et page, `gratuit-mon-espace-1280.png`) ; le bouton d'en-tête est une décision existante, hors périmètre.
6. Fenêtre basse (< 500 px) : à faire capturer (aucune preuve) avant validation.

## Audit Nielsen, en-tête et bande
H1 visibilité de l'état : PASS (chip allumé, compte allumé, pastille de la cloche). H2 vocabulaire : PASS (libellés validés). H3 contrôle : PASS (Échap, X, clic dehors, Fermer). H4 cohérence : FAIL (3 états censés avoir la même bande ; le visiteur et le gratuit perdent « Carnet », pas l'abonné). H5 prévention d'erreur : PASS. H6 reconnaissance : PASS. H7 raccourcis : PASS (flèches dans « … », Tab). H8 minimalisme : PASS. H9 erreurs : sans objet visible. H10 aide : PASS (suggestions de recherche), sous réserve de F2.

## Checklist de revalidation
- Capturer 1280/1456/1920 visiteur et gratuit : « Carnet » entier et ≥ 80 px libres.
- Capturer la recherche ouverte dans le menu à 375 et 320 : 6 suggestions entières.
- Capturer une fenêtre 375 x 480 (bande dans le menu) et `/abonnement` (sans bande).
