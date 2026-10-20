# Contre-épreuve QA : cartes du jour (accueil), avant mise en ligne

@qa, 20/10/2026. Branche `claude/marrant-cartes-du-jour`, HEAD relu `6906e0c` (code `30b50f9`), descend de la production `e8b431c` / `ffd2903` (version Cloudflare `b5e645dd`).

## Verdict : GO (9,0/10), sous réserve des deux conditions déjà écrites dans REPLIT_ACTIONS

1. Relecture à l'aveugle des captures v4.4 au niveau. 2. Feu vert écrit de Thomas.
Aucun défaut bloquant, aucun majeur. 4 mineurs ; seul m4 (poids JS de l'accueil) est une régression, de 4,5 kB.

## Environnement

- `env -i` avec PATH, HOME, le proxy, le certificat et les seules variables FACTICES du job `e2e-local` (`.github/workflows/tests.yml`), plus `PLAYWRIGHT_BROWSERS_PATH`. Aucun `.env` chargé (`apps/web` n'a que `.env.example`). Aucune variable affichée.
- PostgreSQL 16 jetable dans `/var/tmp/qa-cartes` (port 5442), `scripts/seed.sh` (80 vannes, 38 conseils, 89 vidéos, 7 jours de contenu). Un seul serveur `node .next/standalone/server.js` (port 5300). Build de référence de la production (`git archive ffd2903`, hors `docs/design`) dans `/var/tmp/qa-cartes/prod`, sans serveur. 18 Go libres.

## 1. Périmètre du diff `ffd2903..6906e0c` [STATIQUE]

- 541 fichiers : 531 dans `docs/design/cartes-du-jour/` (502 PNG, 29 MD, 78 Mo de captures, rien de déployé), `REPLIT_ACTIONS.md`, et 9 fichiers de code ou de test, tous dans le périmètre annoncé : `daily-content.tsx`, `daily-content-format.tsx` (nouveau), `youtube-player.tsx`, `header.tsx`, 3 tests Jest, 2 specs Playwright.
- **Aucun fichier hors périmètre** : `git diff --name-only | grep -iE "prisma|migration|\.env|wrangler|api/|middleware|package"` vide ; `.github` et `playwright.config.ts` inchangés.
- Aucun secret (scan des lignes ajoutées : `sk_`, `pk_`, `whsec_`, `re_…`, chaînes PostgreSQL avec mot de passe : zéro). Aucun `dangerouslySetInnerHTML` : `daily-content-format.tsx` ne fait que du rendu de texte.
- Aucun « Lorem ipsum / TODO / FIXME / PLACEHOLDER / TBD » ; aucun tiret cadratin dans les textes affichés (les 2 de `daily-content.tsx` sont des commentaires anciens).

## 2. Composants partagés [STATIQUE + LIVE]

- `ShareButton`, `FavoriteButton`, `ReactionButtons` : fichiers inchangés, appelés avec les mêmes props qu'en production (titres de partage identiques).
- `header.tsx` : seul changement, `xl:px-2` retiré des onglets (px-1.5 partout). [LIVE] padding 6 px mesuré sur `/`, `/vannes`, `/videos`, `/conseils`, `/parcours` à 1024, 1280 et 1440, aucun défilement horizontal ; `header-budget.spec.ts` (6 largeurs × visiteur / FREE / PREMIUM, nouveau garde-fou de marge droite) vert.
- `youtube-player.tsx` : prop `recadrage` optionnelle, passée seulement par l'accueil (`daily-content.tsx:665`) ; `videos-grid`, `favoris-list`, `step-blocks` l'appellent sans la prop, rendu de la vignette inchangé. Anneau de focus : voir m1.

## 3. Comportements de la section [LIVE, Chromium, build de production]

- « Révéler la chute » au clavier (Entrée) : la chute prend la place du bouton au pixel près (920 → 920 px en coordonnées de page, après l'animation), reçoit le focus avec un anneau visible (2 px violet), dans `#chute-du-jour` en `aria-live="polite"`. Capture lue : propre, chute lisible, pas de troncature.
- « Pourquoi ça marche » : absent avant la révélation, puis `<details>` fermé ; Tab l'atteint, Entrée l'ouvre (décision D1 respectée).
- « Lire la suite » : `aria-expanded="false"` puis « Réduire » en `aria-expanded="true"`, au clavier.
- axe-core WCAG 2.2 A/AA sur l'accueil à 375 px, chute révélée, accordéon ouvert, conseil déplié : **0 violation**.
- Cibles de 44 px, accordéons, rangée figée, focus sur « Lire la suite » : `cartes-du-jour-cibles.spec.ts` vert de 320 à 1440 px.
- Aucun débordement horizontal : `/`, `/vannes`, `/videos`, `/conseils`, `/parcours` à 320, 360, 375, 414, 768, 1024, 1280, 1366 et 1440 px (45 mesures, `scrollWidth ≤ innerWidth`).
- Mesure : aucun appel `umami` / `track` ni avant ni après dans `daily-content*.tsx` ; rien n'est ajouté ni retiré.

## 4. `conversion-v2-s21.spec.ts:103` (fenêtre Premium de /vannes, compte gratuit) [LIVE]

- Localement : spec complet 6/6, puis **5 relances isolées 5/5** (5,1 à 5,7 s, `--retries=0`), puis 10/10 sous charge CPU (4 cœurs saturés). Non reproduit.
- En CI (run 39494569424, `edfd63b`) : échec à l'essai ET au retry, même ligne 113 (`getByRole("dialog")` introuvable 10 s). La trace téléchargée montre que le clic a bien été traité : le morceau de la fenêtre Premium (`2691.*.js`, `PremiumModal`, chargé à la demande par `premium-modal-differe.tsx`) part 14 ms après le clic ; la session est chargée 150 ms avant le clic ; le rafraîchissement client de `/api/jokes` (`vannes-list.tsx:148`) répond 20 ms après le clic. La fenêtre s'ouvre donc puis disparaît, ou ne se monte jamais, dans cette fenêtre de 100 ms qui suit l'hydratation. Une reproduction hors dépôt avec `/api/jokes` retardé de 1,5 s passe : le rafraîchissement seul n'explique pas l'échec.
- **Verdict : instable (2 échecs sur 2 essais dans un run CI, 0 sur 16 en local), sans lien avec ce diff** (ni `/vannes`, ni la fenêtre, ni le spec ne sont touchés ; `/vannes` n'utilise pas `DailyContent`). Spec ni désactivé ni affaibli. Course côté application probable, au clic juste après l'hydratation : à confier à @fullstack (recherche de la cause, pas de patch du test).

## 5. Vérifications [LIVE sauf mention]

| Contrôle | Résultat |
|---|---|
| `npx tsc --noEmit -p tsconfig.build.json` | 0 erreur |
| `npx next lint` | « No ESLint warnings or errors » |
| `npx tsc --noEmit` (config complète, CI) | 0 erreur |
| `npx tsc -p ../../playwright/tsconfig.json` | 0 erreur |
| `npm run build` | code 0 ; `/` : 19,4 kB, First Load **152 kB** (production `ffd2903` rebâtie à l'identique : 14,9 kB, 148 kB) |
| Jest complet (variables du job `test`) | 355 suites, 5 406 tests verts, 5 ignorés |
| Playwright `local` : cartes-du-jour-cibles + header-budget (2 workers) | 31/31 |
| Playwright `local` : conversion-v2-s21 (2 workers, sans retry) | 6/6, puis :103 ×5 et ×10 sous charge |
| CI GitHub sur `6906e0c` (run 39500803715) | `test`, `lint`, `e2e-local` : success |

## Défauts

**Bloquants : aucun. Majeurs : aucun.**

- **m1, mineur** : `apps/web/src/components/ui/youtube-player.tsx:47`. L'anneau `focus-visible:ring-inset` du bouton est peint sous la vignette (`<img>` en `absolute inset-0`) : invisible sur `/videos`, fiches vidéo, favoris, parcours (capture lue). Seul le bouton rouge grossit à 110 %. Sur l'accueil, l'anneau visible est celui du conteneur (`daily-content.tsx:662`, `has-[:focus-visible]`). Pas une régression : en production, le contour par défaut est rogné par le parent `overflow-hidden`, rien n'est visible (mesuré). REPLIT_ACTIONS annonçait un anneau « sur toutes les pages » : c'est inexact, l'entrée est corrigée. Correctif (@fullstack, 3 conteneurs : `videos-grid.tsx:271`, `favoris-list.tsx`, `step-blocks.tsx`) : le même `has-[:focus-visible]:ring-2` que l'accueil. Pas corrigé ici, car le correctif touche 3 pages relues à l'aveugle et invaliderait la CI relue.
- **m2, mineur** : `playwright/tests/local/conversion-v2-s21.spec.ts:103`. Instabilité CI préexistante (section 4). @fullstack : chercher la cause, sans patch du test.
- **m3, mineur [STATIQUE]** : `daily-content.tsx:500-502`. La chute est à la fois annoncée par `aria-live` et focalisée : un lecteur d'écran peut la lire deux fois. Non vérifiable sans lecteur d'écran réel ; à juger par @ux.
- **m4, mineur [LIVE, build]** : First Load JS de `/` passe de 148 à **152 kB** (+4,5 kB de code propre à la page), au-dessus du budget de 150 Ko des contre-épreuves s21 (`docs/qa/qa-cta-s21-v2.md`, m3). Seule la page d'accueil est concernée. Pistes pour @fullstack : remplacer les 4 icônes Lucide par des SVG en ligne, comme `Chevron`, puis mesurer ; déporter le calcul de la rangée (dès 1280 px) dans un module chargé à la demande. Non bloquant : l'écart est de 1,3 %.
- Hors périmètre, inchangé depuis la production : `/api/daily` sert `howToApply`, l'exercice et les points clés à un visiteur (`app/api/daily/route.ts`), comme l'ancienne carte. Si le contenu du jour n'est pas voulu comme gratuit en entier, c'est à Thomas de trancher.

## Procédure de mise en ligne

Recopiée en tête de l'entrée « CARTES DU JOUR » de `REPLIT_ACTIONS.md` (P0 à P8, à suivre là-bas).

## Nettoyage

Seuls mes PID ont été arrêtés (serveur, PostgreSQL via `pg_ctl stop`, processus de charge) ; ports 5300 et 5442 libres. Sont supprimés : `/var/tmp/qa-cartes` (base, build de référence), `/var/tmp/home` (copie de traçage du build de référence) et les specs hors dépôt du scratchpad. `apps/web/.next` (ignoré par git) contient le build de `6906e0c`. Arbre de travail : seuls ce rapport et `REPLIT_ACTIONS.md` changent.
