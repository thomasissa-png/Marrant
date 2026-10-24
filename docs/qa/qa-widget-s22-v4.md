# QA indépendante : widget « La vanne du jour », tour 4 (s22)

Commit audité : `c1de819e` (widget) et `673312af` (confidentialité), branche `claude/ouverture-session-nzwj0w`, non déployé, `WIDGET_VANNE_DU_JOUR_PUBLIE = false`. Depuis : `cd660590` et `f4d401ef`, docs seules (`git diff --stat c1de819e HEAD -- apps/web playwright` vide).
24/10/2026, @qa. Aucun déploiement ni publication, aucune écriture en base, aucun commit, code de production non modifié. L'interrupteur n'a été mis à `true` que pour le build local des captures, puis restauré par `git checkout` (`git diff -- apps/web/src/config` vide). Le rapport @fullstack n'est pas pris pour preuve : tout est rejoué.
Légende : `[LIVE]` = sortie observée (Chromium réel, `next start`) ; `[STATIQUE]` = Jest, tsc, lecture de code ou de config.

## Verdict

**NO-GO, pour un seul point bloquant, nouveau et trivial : à 320 px, la page du programme déborde horizontalement (N-M2).** Le `whitespace-nowrap` ajouté sur le code CSP (`page.tsx`, M2 de @design) empêche la coupure au tiret, mais à 320 px les deux lignes de code mesurent 314 et 323 px dans une colonne de 288 px. La page défile de côté (`scrollWidth` 343 pour 320), le code est rogné au bord de l'écran et la virgule qui suit disparaît. C'est un échec WCAG 1.4.10 (redisposition à 320 px CSS, donc aussi un ordinateur zoomé à 400 %), introduit par cette itération : sans `nowrap` (état `b5e6e52c`), `scrollWidth` = 320. Correction d'une ligne, puis 1 minute de recontrôle.

**V1 bis est levé.** Avant le clic, le plus grand blanc d'un seul tenant passe de 51 % de la carte (médiane du tour 3 à 375 px) à 37 %. Les captures se lisent comme une carte composée, plus comme un chargement inachevé. Rognage 0, CLS 0, amorce immobile au clic (0 px) dans les 1 488 scénarios. La chute réservée n'est pas lue avant le clic ; après le clic, elle est focalisée et lue. Non-régression PASS. Confidentialité PASS : avec l'interrupteur à false, la page est identique à la production au caractère près ; à true, seule la puce s'ajoute. Chaîne complète verte.

Si N-M2 est corrigé et repasse le contrôle de 320 px (une ligne de mesure, ci-dessous), le widget est publiable sur go de Thomas.

## Contrôles

| # | Contrôle | Statut | Preuve |
|---|---|---|---|
| V1 | Vide de la carte, 93 vannes × 1280 / 768 / 375 / 320 × iframe et script × hôte clair et sombre (1 488 scénarios, avant et après révélation) | PASS | `[LIVE]` banc du tour 3 (gabarits officiels, `widget.js` réel, en-têtes réels de `next.config.js`, hôte et widget sur deux origines), HTML rendu par le code `c1de819e`. Voir « Vide, chiffres » |
| V2 | Rognage | PASS | `[LIVE]` 0 zone rognée sur 1 488, avant et après ; marque visible, pied sur une ligne, titre jamais masqué partout |
| V3 | CLS hôte | PASS | `[LIVE]` `PerformanceObserver` posé avant chargement : somme 0 partout (y compris décalages après action) ; hauteur de l'iframe inchangée au clic (0 px) ; 0 violation CSP |
| V4 | Mouvement de l'amorce au clic | PASS | `[LIVE]` 0,0 px pour les 93 vannes, à toutes les largeurs (chute réservée dans la même cellule de grille que le bouton) |
| V5 | Lecture des captures (critères Thomas) | PASS | `[LIVE]` lues : 4 vannes (courte `cs19jkboulot5`, pire bande `cmmnsqn130030th6381ol5rxt`, médiane `cv1105a3e91c7d42b8f06d5e1`, longue `cs18jkstory5v4`), 375 et 320 clair avant, 320 sombre après, 1280 avant. Bloc centré un peu au-dessus du milieu, blanc réparti, lu comme de l'air : PRO, AÉRÉ, HIÉRARCHIE, CONVERSION (bouton dominant) tenus ; après clic, carte pleine sans coupure |
| A1 | Chute réservée cachée aux lecteurs d'écran avant le clic | PASS | `[LIVE]` 93 vannes : arbre d'accessibilité complet (CDP `Accessibility.getFullAXTree`), `ariaSnapshot` et `innerText` ne contiennent jamais la chute avant le clic (0/93) ; `visibility:hidden` la retire de l'arbre ; non focalisable (`tabindex=-1`) |
| A2 | Chute annoncée après le clic, clavier | PASS | `[LIVE]` 93 vannes : Tab sur le bouton, Entrée, focus sur `#c`, `aria-expanded=true`, chute présente dans l'arbre (0 échec) ; bouton retiré. Parcours, 3 vannes × clair et sombre × 640 et 288 px : bouton > Entrée > chute > « Pourquoi ça marche ? » > marque > sortie |
| A3 | axe-core WCAG 2.2 AA (iframe) | PASS | `[LIVE]` mêmes 12 cas, avant et après le clic : 0 violation |
| A4 | Texte à 200 % (R1 de @design, capture refaite) | PASS | `[LIVE]` texte seul ×2 dans l'iframe (fenêtre 375, iframe 343×518) et zoom de page 200 % (fenêtre CSS 188 px, densité ×2, iframe 156×560). Plus longue vanne : `scrollTop` 0, titre à 4 px du haut de la zone, amorce lisible dès le haut, `scrollHeight` 1 268 > `clientHeight` 451 (876 > 493 en zoom page) : les entretoises tombent à 0, la zone défile depuis le haut. Après Entrée : focus sur la chute, visible et lisible. La capture de @fullstack était vide (iframe non chargée), elle est remplacée : `docs/qa/captures-widget-s22/v4-zoom200-iframe-longue-avant-375.png`, plus `-apres-375.png` et `v4-zoompage200-iframe-longue-apres-375.png` |
| N1 | En-têtes contre `27caee2e` | PASS | `[STATIQUE]` `next.config.js`, `_headers`, middleware, route de l'embed, `mesure.ts`, `wrangler.jsonc` inchangés depuis `b5e6e52c`. Compilateur de règles de Next rejoué : 146 identiques (sensible à la casse), 4 écarts attendus (`/embed/vanne-du-jour`, `/integrer-la-vanne-du-jour` et leurs variantes avec barre finale) |
| N2 | CSP de l'embed, empreinte inchangée | PASS | `[LIVE]` `next start` : `script-src 'sha256-NVljRHrCOeuxj/Q/OTRJS7ydJny25yTCpWqEufk8tPc='`, identique au tour 3 ; un seul `<script>` (repli servi, et vanne rendue par `c1de819e`), son sha256 = celui de la CSP |
| N3 | XSS, réseau | PASS | `[LIVE]` vanne piégée (`<img onerror>`, `<svg onload>`, `&#x3C;script&#x3E;`, `</script><script>`, `<math><mtext>`, `"onmouseover="`) en iframe et en script : 0 dialogue, 0 `img`, 1 script, attribut injecté absent, 0 violation. La chute piégée est désormais dans le DOM dès le départ (cachée), et reste inerte. Requêtes : hôte, `widget.js`, `/embed/vanne-du-jour`, rien d'autre ; cookie et `localStorage` bloqués (bac à sable) |
| N4 | noindex, zéro cookie, interrupteur false | PASS | `[LIVE]` embed : `X-Robots-Tag: noindex`, sans XFO, sans `Set-Cookie` ; API : 503 + `Retry-After: 3600` + noindex ; `widget.js` : 200 sans cookie ; `/embed/inconnu` : 404 + XFO DENY ; page du programme : 404 |
| N5 | Mesure Analytics Engine | PASS | `[STATIQUE]` `mesure.ts`, route et `wrangler.jsonc` identiques à `b5e6e52c` : les preuves `[LIVE]` workerd du tour 3 restent valables (seul le domaine, no-op sans liaison) ; `widget-mesure-qa-s22` vert |
| C1 | Confidentialité, interrupteur à false | PASS | `[LIVE]` `next start` (build false) contre la prod `https://deviens-marrant.fr/confidentialite?ne-pas-compter=1` : HTML de la `section` « 5. Cookies » identique (1 357 caractères, même md5), `<main>` complet identique (scripts retirés), 0 « Widget La vanne ». Revérifié sur le build final (`build:cf`) : identique |
| C2 | Confidentialité, interrupteur à true (local) | PASS | `[LIVE]` section 5 : 3 puces > 4 ; HTML à true moins la puce = HTML à false, pour la section et pour tout `<main>` ; texte = visa @legal N8 (`docs/legal/widget-vanne-du-jour-s22.md` l. 47, adapté en puce), sans tiret cadratin. Captures APRÈS lues : `docs/qa/captures-confidentialite-s22/apres-partie5-1280.png` et `-375.png` (élément `section`, fenêtre haute pour éviter l'en-tête collant). 1280 : même méthode que l'AVANT existant (AVANT refait pixel pour pixel identique). 375 : l'AVANT existant a l'en-tête collant sur le titre (artefact de capture) ; AVANT net ajouté, `avant-net-partie5-375.png` |
| P1 | Page du programme, M1 (aperçus en eager) | PASS | `[LIVE]` interrupteur à true en local : 2 iframes `loading="eager"`, les 2 requêtes d'embed partent au chargement, avant tout défilement, à 1280 et 375 ; aperçu sombre lu en capture (défilement et fenêtre de 6 000 px). Le rectangle vide qui reste en capture « pleine page » standard à 375 est un artefact de Chromium (iframe bac à sable hors fenêtre, non peinte), pas un défaut de la page : document chargé (`t-sombre js`) |
| P2 | Page du programme, M2 (code CSP en nowrap) | **FAIL (320)** | `[LIVE]` 1280, 375 et 360 : 1 ligne chacun, pas de coupure au tiret, `scrollWidth` = largeur. **320 : `scrollWidth` 343 > 320**, `frame-src …` jusqu'à 330 px, `script-src …` jusqu'à 339 px, seuls éléments en dépassement ; capture lue : « deviens-marrant.fr » rogné au bord, virgule hors écran. Voir N-M2 |
| CH | Chaîne sous `env -i` | PASS | voir « Chaîne » |

## Vide, chiffres (V1)

Hauteur de la carte : 340 px à 1280 et 768 (iframe 640), 518 à 375 (343), 551 à 320 (288). Identique en iframe et en script, en hôte clair et en hôte sombre. « Au-dessus » et « en dessous » = entretoises (médiane / max, px). « Vide total » = part de la carte sans contenu visible. « Bande » = plus grand blanc d'un seul tenant, marges intérieures comprises, en part de la carte. Format : médiane / max / nombre de vannes au-delà de 40 %.

| Largeur | Avant clic : au-dessus / en dessous | Vide total | Bande | Après clic : en dessous | Vide total | Bande |
|---|---|---|---|---|---|---|
| 1280 et 768 | 42 (53) / 63 (91) | 31 / 39 / 0 | 23 / 31 / 0 | 63 (80) | 31 / 39 / 0 | 23 / 28 / 0 |
| 375 | 94 (128) / 175 (197) | 51 / 62 / 89 | **37 / 41 / 7** | 141 (191) | 45 / 62 / 83 | 30 / 40 / 0 |
| 320 | 107 (130) / 189 (217) | 54 / 59 / 89 | **37 / 42 / 24** | 161 (194) | 49 / 59 / 79 | 32 / 38 / 0 |

Lecture honnête : le vide total ne change pas (même hauteur, même contenu), la correction le répartit. Au tour 3, tout le blanc était d'un seul bloc sous le bouton : 51 % de la carte en médiane à 375 et 54 % à 320. Il est maintenant coupé en deux bandes de part et d'autre du bloc, et la plus grande vaut 37 % en médiane. Avant le clic, la chute réservée ajoute du blanc sous le bouton (médiane +28 px, max +84 à 375). La plus grande bande dépasse donc à peine 40 % pour 7 vannes à 375 et 24 à 320 (max 42 %, 233 px). Les captures de ces vannes restent lisibles comme une composition. C'est le prix du « zéro mouvement », accepté (voir m-i).

## Défauts restants

### Bloquant (publication)

- **N-M2. Débordement horizontal à 320 px, page du programme.** `apps/web/src/app/(dashboard)/integrer-la-vanne-du-jour/page.tsx`, les deux `<code className={`${CODE} whitespace-nowrap`}>` du paragraphe CSP (introduits par `c1de819e`). Mesure `[LIVE]` 320 px : `scrollWidth` 343, code rogné au bord, virgule hors écran ; échec WCAG 1.4.10. Essais dans le DOM (sans toucher au code) : sans `nowrap`, 320 sans débordement mais coupure au tiret revenue (le défaut M2) ; `break-all` sans `nowrap`, 320 sans débordement, coupe à l'intérieur de l'URL. Pistes pour @fullstack (arbitrage @design) : `nowrap` à partir de 360 px seulement (`min-[360px]:whitespace-nowrap`, mesuré : 1 ligne jusqu'à 360 inclus), ou les deux directives en petit bloc de code à défilement interne. Critère de sortie : `document.documentElement.scrollWidth === clientWidth` à 320, 360 et 375, aucun `code` au-delà de `clientWidth`, pas de coupure entre « deviens- » et « marrant.fr » à partir de 360.

### Mineurs

- **m-h. « 3 mois » coupé en fin de ligne** dans la nouvelle puce de confidentialité à 375 (« conservé 3 » / « mois », capture `apres-partie5-375.png`). `confidentialite/page.tsx` : espace insécable entre « 3 » et « mois » (`3&nbsp;mois` ou `frTypo`). Interrupteur à false : sans effet en ligne.
- **m-i. Blanc sous le bouton avant le clic** (voir les chiffres) : 7 vannes à 375 et 24 à 320 ont une bande de 41 à 42 %. Accepté : c'est la contrepartie de l'amorce immobile, et les captures sont au niveau. À ne pas « corriger » en baissant la courbe de hauteur, qui est juste (la plus longue vanne tient au pixel).
- **m-a (tour 2, toujours là).** `docs/seo/widget-replique-du-jour-s22-seo.md` l. 57 et 60 : `punchline` et `ETag`, faux par rapport au code (spec interne seulement).
- m-f (colonne étroite) et m-g (domaines déclaratifs) : documentés dans `REPLIT_ACTIONS.md` (entrée s22), rien de plus à faire.

### Hors périmètre (préexistants, déjà signalés)

- `wrangler dev` avec l'entrée du dépôt refusé par workerd (exports non handlers) ; redirections 307 du middleware sans en-têtes de sécurité sous Worker.
- `build:cf` : 90 lignes « base indisponible » de Prisma au prérendu (pas de base locale), comme au tour 3.

## Chaîne

Sous `env -i PATH HOME DATABASE_URL=…deviens_marrant_test ANTHROPIC_API_KEY=dummy NEXTAUTH_SECRET=test-secret RESEND_API_KEY=re_dummy` (proxy et CA ajoutés seulement pour `build` et `build:cf`), aucune variable affichée :
- `tsc --noEmit -p tsconfig.build.json` : 0 ; `tsc --noEmit` (config de la CI) : 0 ; `tsc --noEmit -p ../../playwright/tsconfig.json` : 0 ; `next lint` : « No ESLint warnings or errors ».
- Jest complet, sans secret Stripe : 359 suites PASS (1 ignorée), 5 460 tests PASS, 5 ignorés.
- `npm run build` : code 0 avec l'interrupteur à false, code 0 avec l'interrupteur à true (local, pour C2, P1 et P2). `npm run build:cf` : code 0, interrupteur à false.
- e2e `playwright/tests/local/widget-hote-s22.spec.ts` contre `next start` (false, `E2E_BASE_URL=http://127.0.0.1:5055`, Chromium `/opt/pw-browsers/chromium`) : 3/3 PASS `[LIVE]`.
- Aucune publication (ni `deploy:cf`, ni `wrangler deploy`), aucune écriture en base. État final : `git diff -- apps/web/src` vide, `WIDGET_VANNE_DU_JOUR_PUBLIE = false`, serveurs arrêtés ; seuls changements dans le dépôt, ce rapport et les captures listées ci-dessus.

## Bancs (hors dépôt)

Scratchpad `/tmp/claude-0/-home-user-Marrant/5d6d1c1e-57ce-52c7-8f39-4aea23f0efcf/scratchpad/` : `v4-mesure.js` (résultats `v4-mesure-1280_768_375_320.json`), `v4-a11y.js`, `v4-zoom.js`, `v4-xss-net.js`, `v4-pages.js`, `v4-m1.js`, `v4-conf-shot.js`, `conf/sec5.js` (comparaison de la section 5), `hdr3/compare.js` ; captures `v4shots/` (planches `planche-*.png`).

## Limites

- Pas de base locale : vannes rendues par le vrai `renderEmbedVanne` de `c1de819e` et servies sur banc avec les en-têtes réels. Les aperçus de la page du programme reçoivent une vanne de banc (en-têtes du serveur conservés).
- Chromium seul (ni WebKit ni Firefox). Texte à 200 % simulé de deux façons (polices doublées dans l'iframe, zoom de page) : pas de réglage « taille du texte » d'iOS.
- Le proxy a refusé 2 connexions vers `hote.test` (domaine fictif des bancs, routé par Playwright) : requêtes tardives après fermeture d'un contexte, sans effet sur les mesures.
