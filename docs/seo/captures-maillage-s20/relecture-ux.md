# Relecture UX : pagination numérotée des listes (S1 s20, 12/10/2026)

> @ux. Périmètre : `apps/web/src/components/ui/list-pagination.tsx`, `apps/web/src/hooks/use-list-page.ts`, `apps/web/src/lib/list-pagination.ts`, usage dans `vannes-list.tsx` (lu en entier), `conseils-list.tsx` et `videos-grid.tsx` (même hook), page thème (rendu serveur). Preuves visuelles : les 4 captures `vannes-page-{1,6}-{375,1280}px.png` (données simulées). Spec SEO : `docs/seo/maillage-decouverte-s20.md` §4 S1. Aucun code modifié. Les captures sont statiques : le comportement après clic est établi par lecture du code, pas par capture `[À VÉRIFIER en recette sur appareil : voir §6]`.

## 1. Verdict

| Critère | Desktop (1280) | Mobile (375) | Constat |
|---|---|---|---|
| Repérage (où suis-je, combien de pages) | 8/10 | 6/10 | Une rangée complète vaut mieux que « Page X / Y » (courante + total visibles). Mais la page courante n'est signalée que par un fond `#2A2A2A` sur `#0D0D0D` (≈ 1,4:1) et un texte blanc au lieu de gris, même graisse. Sur mobile, 3 blocs sur 4 lignes brouillent la lecture. |
| Effort du pouce | n/a | 6/10 | « Suivant » (action la plus fréquente) est bien en bas, mais « Précédent » seul occupe une ligne entière même quand il est inactif (page 1). Bloc de ~196 px de haut. |
| Risque de clic raté | 8/10 | 6/10 | Cibles 44 × 44 px avec 4 px d'écart : correct. Risque réel : la liste change de hauteur sous le pouce (voir §2.1) et le double-tap rapide sur iOS peut zoomer. |
| Accessibilité | 8/10 | 8/10 | Bonne base (`nav` nommé, `aria-current="page"`, `aria-label="Page N"`, anneau de focus). Manques : `role="list"` sur l'`ol` (VoiceOver), perte du focus au clic, « sur Y » absent, bouton `disabled` dans une `nav` de liens. |
| Retour en haut de liste après changement de page | **0/10** | **0/10** | **Absent.** Défaut bloquant (§2.1). |
| **Note globale** | **7,5/10** | **5,5/10** | Le correctif SEO est bon (liens réels, 11 liens en plus, profondeur 3). L'UX autour reste incomplète. |

Le défaut n° 1 (pas de retour en haut) existait déjà avec Précédent / Suivant, mais S1 l'aggrave : on offre un saut direct vers la page 9, et le lecteur y arrive sans voir le début de la page.

## 2. Constats détaillés

### 2.1 [FRICTION H1] Aucun retour en haut de liste (bloquant, desktop et mobile)
`onNavigate` = `goToPage` de `use-list-page.ts` : `setPage(next)` puis `history.pushState`. **Aucun `scrollTo`, `scrollIntoView` ni `focus`**, dans le hook comme dans les 3 listes (`vannes-list.tsx` l.445, même hook dans `conseils-list` et `videos-grid`). Conséquences, à l'étape « Yanis clique 7 en bas de la page 1 » :
1. `page` change tout de suite (le chip violet saute sur 7) mais la liste reste l'ancienne jusqu'au retour de `/api/jokes` (pas de skeleton : il n'apparaît que si la liste est vide, `showSkeleton`). État incohérent : indicateur = page 7, contenu = page 1.
2. Les 12 nouvelles cartes se substituent **au-dessus** du viewport. Sur mobile, 12 cartes de vannes font ~3 000 px : Yanis voit le bas de la page 7 (ou la FAQ) sans signal que quelque chose a changé, et doit remonter à la main.
3. Au retour des données, la hauteur peut changer (dernière page : 10 vannes ; vidéos page 8 : 5 cartes) : la pagination se déplace sous le pouce, d'où un clic raté possible au tap suivant.
4. Le lien cliqué est remplacé par un `<span aria-current>` (même `<li>`, élément différent) : le **focus clavier est détruit** (retombe sur `body`), les lecteurs d'écran n'annoncent rien.
Cognitive walkthrough : le but (« voir les vannes suivantes ») est clair, l'action est visible, le feedback immédiat est **non**. Solution : §3.1.

Pages thème : rendu serveur, pas de `onNavigate`, lien classique = nouveau document ouvert en haut de page (en-tête, H1, navigation thème visibles). Acceptable, pas de correction.

### 2.2 [FRICTION H8] Mobile : 4 lignes pour une pagination
Mesuré sur la capture : lignes à y = 282 (Précédent seul), 334 (1 à 7), 382 (8 à 12), 434 (Suivant seul). Calcul : 7 cellules de 44 px + 6 écarts de 4 px = 332 px ≤ 343 px utiles, d'où 7 + 5. Défauts : ligne orpheline 8 à 12 centrée (grille irrégulière), « Précédent » inactif sur page 1 prend une ligne pleine (44 px) pour rien, bloc de ~196 px de haut avant la FAQ.

### 2.3 « Page X / Y » retiré : nuit-il au repérage ?
- **Desktop : non.** La rangée donne plus : courante surlignée + total (dernier numéro) + saut direct. Elle remplace avantageusement le texte.
- **Mobile : légèrement, à cause de l'exécution, pas du principe.** Le chip courant est discret (1,4:1) et noyé dans 4 lignes ; le total est le dernier chip de la 3e ligne.
- **Lecteur d'écran : oui.** Plus de « sur 12 » ; reste « Page 6, page courante » + « liste de N éléments » (et Safari/VoiceOver ne l'annonce pas : `list-style: none` de Tailwind retire le rôle liste sans `role="list"`).
- **> 15 pages** (non atteint : 12, 12, 8) : le total reste visible (dernier numéro après « … »). OK.
- Conclusion : **ne pas remettre « Page X / Y »** ; renforcer le chip courant et ajouter « sur Y » en `sr-only`.

### 2.4 Accessibilité
| Point | État | Preuve |
|---|---|---|
| `nav aria-label="Pagination"` | OK | l.54 |
| `aria-current="page"` + `Page ` sr-only | OK | l.70-79 |
| Libellé accessible des numéros | OK (« Page N » contient le texte visible « N », WCAG 2.5.3) | l.82 |
| Focus visible | OK : `ring-2` violet `#8B5CF6` (≈ 4,6:1) + offset 2 (`buttonVariants`) | button.tsx l.6 |
| Focus conservé après navigation JS | **KO** (§2.1.4) | l.69-83 |
| `ol` annoncée comme liste | **KO sous VoiceOver** : ajouter `role="list"` | l.62 |
| Précédent / Suivant inactifs | `<button disabled>` dans une `nav` de liens : bruit pour lecteur d'écran, texte à 50 % d'opacité quasi illisible sur la capture page 1 | l.58, l.90 |
| Annonce du changement de page | **KO** : aucune région `aria-live` | n/a |
| Cible tactile | OK < 768 px (44 × 44). Entre 768 et ~1024 px (tablette tactile) : 32 × 32 px (ok WCAG 2.5.8 AA, sous la règle 44 px du projet) | l.22, button.tsx l.22 |
| « … » | `span` lu comme texte (non utilisé aujourd'hui) | l.66 |

### 2.5 Compatibilité avec les contraintes SEO
Aucune correction ci-dessous ne contredit la spec : liens `<a href>` réels dans le HTML serveur, aucun `display:none` sur un lien, pas de `nofollow`, `listPageHref` / taille de page / tri inchangés, `onNavigate` conservé (clics modifiés = natif). Attention au test existant `pagination-numerotee-s20.test.tsx` l.93 : `expect(html).not.toMatch(/nofollow|display:\s*none|hidden/)` échouera dès qu'un `aria-hidden` apparaîtra : cibler `class="[^"]*\bhidden\b` et `display:\s*none`.

## 3. Corrections précises pour 10/10 (ordre de priorité)

### 3.1 P0 : retour en haut, focus, état de chargement (3 listes + hook)
1. `use-list-page.ts` : créer `const listRef = useRef<HTMLElement | null>(null)` et le renvoyer. Dans `goToPage`, après `setPage` et `pushState` :
   `listRef.current?.scrollIntoView({ block: "start" }); listRef.current?.focus({ preventScroll: true });` (défilement instantané, jamais `smooth` : 3 000 px de défilement animé est lent, et `prefers-reduced-motion` est respecté d'office).
2. Dans `vannes-list.tsx`, `conseils-list.tsx`, `videos-grid.tsx` : poser `ref={listRef} tabIndex={-1}` sur un conteneur placé juste avant la grille (après les filtres), avec `className="scroll-mt-20 outline-none"` (`scroll-mt` = hauteur de l'en-tête `[À VÉRIFIER : en-tête sticky ?]`). Le focus sur ce conteneur évite la perte de focus (§2.1.4) ; `outline-none` est admis car l'élément n'est pas dans l'ordre de tabulation.
3. Même conteneur : `aria-busy={isLoading}` et, pendant le chargement d'une page qui remplace une liste non vide, `opacity-60 transition-opacity` sur la grille (la liste ne disparaît pas, on ne casse pas le seuil de 300 ms du skeleton). L'état de chargement est ainsi visible dès le tap.
4. Région d'annonce, dans le même composant : `<p role="status" className="sr-only">Page {page} sur {totalPages}</p>`, rendue seulement quand `!isLoading` (annonce après arrivée des données, pas avant).
5. Ne pas changer le comportement des pages thème (navigation classique).

### 3.2 P0 mobile : une grille de 2 lignes au lieu de 4 (`list-pagination.tsx`)
Remplacer `flex flex-wrap` + `ol` séparée par **un seul `<ol role="list">`** dont les `<li>` sont : Précédent, les numéros, Suivant (ordre DOM = ordre visuel, donc ordre de focus correct).
- `nav` : `mt-8` conservé. `ol` mobile : `grid justify-center gap-0.5` avec `grid-template-columns: repeat(var(--cols), minmax(0, 1fr))` (variable posée en `style`, calculée en rendu serveur : `cells = items.length + 2`, `cols = Math.ceil(cells / Math.ceil(cells / 7))`). Résultat : 12 pages = 14 cellules = 7 + 7 ; 8 pages (vidéos) = 10 = 5 + 5 ; plus de ligne orpheline. Sous 360 px de large : 6 colonnes max (`max-[359px]`, variable `--cols-xs`), car 7 × 44 px + écarts dépasse 328 px utiles. Écart `gap-0.5` (2 px) : 7 colonnes à 360 px = 45,1 px par cellule (≥ 44), à 375 px = 47,3 px.
- ≥ 768 px : `md:flex md:flex-wrap md:items-center md:justify-center md:gap-1` (rendu actuel conservé : Précédent, 1 à 12, Suivant sur une ligne, avec écart `md:gap-x-3` autour des extrémités).
- Précédent / Suivant : texte `Précédent` / `Suivant` dans un `<span className="max-md:sr-only">` (texte présent dans le HTML, pas masqué par `display:none`) + chevron SVG `aria-hidden` visible sous 768 px (même style de chevron que `videos-grid.tsx` l.89-95). Cellule 44 × 44 sous 768 px. `aria-label` : `Précédent, page 5` / `Suivant, page 7` (contient le texte visible : WCAG 2.5.3). Attention test : les numéros sont filtrés par `label.startsWith("Page ")` ; ne pas nommer Précédent / Suivant « Page … ».
- Gain mesuré : ~196 px → 90 px (2 × 44 + 2) sur 375 px, soit −54 %, géométrie identique sur toutes les pages (aucun chip ne bouge d'une page à l'autre tant que ≤ 15 pages).
- Au-delà de 15 pages (non concerné aujourd'hui) : même grille, la fenêtre ±2 bouge ; rien à faire maintenant.

### 3.3 P1 : lisibilité de la page courante et des cellules
- Page courante : remplacer `bg-background-elevated text-text-primary` par `bg-accent-secondary-hover text-white font-bold` (blanc sur `#7C3AED` ≈ 5,7:1 ; fond contre page `#0D0D0D` ≈ 3,4:1, donc ≥ 3:1 de WCAG 1.4.11). Le texte sr-only reste « Page » + numéro, ajouter `<span className="sr-only"> sur {totalPages}</span>` après le numéro : lecture « Page 6 sur 12, page courante ».
- Numéros cliquables : conserver `ghost` et ajouter `active:bg-background-elevated` (retour visuel du tap pendant les 100 à 500 ms de chargement) et `touch-manipulation` (supprime le délai et le zoom au double-tap rapide sur iOS : le « clic raté » le plus probable).
- Précédent / Suivant inactifs : remplacer `<Button disabled>` par `<span aria-hidden="true">` de mêmes dimensions, `opacity-40` (la cellule reste, la grille ne bouge pas ; plus de bruit pour lecteur d'écran, « Page 1 » dit déjà qu'on est au début). Éviter `disabled:opacity-50` sur du texte gris (lisible à peine sur la capture).

### 3.4 P2 : finitions
- Tablettes tactiles : cellules 44 px aussi entre 768 et 1024 px via `[@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:min-w-11` (aujourd'hui `max-md` seulement).
- `…` : `<li aria-hidden="true">`.
- Limite connue, à ne pas traiter maintenant : avec `?q=` ou un filtre de catégorie, les `href` pointent vers la liste non filtrée (le clic simple garde le filtre via `withPageParam`, un Ctrl+clic non). Corriger imposerait un HTML différent du HTML serveur : hors périmètre SEO.

## 4. Audit Nielsen (périmètre pagination)
| Heuristique | Verdict | Évidence |
|---|---|---|
| H1 Visibilité de l'état | **FAIL** | liste change hors écran, indicateur avant contenu, pas de chargement (§2.1) |
| H2 Vocabulaire | PASS | Précédent, Suivant, numéros |
| H3 Contrôle / annulation | PASS | historique du navigateur suit `?page=`, Ctrl+clic et clic molette natifs |
| H4 Cohérence | PASS | mêmes classes que les boutons ghost existants |
| H5 Prévention d'erreurs | **FAIL (mineur)** | nav qui bouge avec la hauteur de la liste, double-tap iOS |
| H6 Reconnaissance | PASS | tous les numéros visibles (≤ 15) |
| H7 Raccourcis | PASS | saut direct à n'importe quelle page |
| H8 Minimalisme | **FAIL mobile** | 4 lignes dont 2 pour un seul bouton chacune |
| H9 Messages d'erreur | PASS | `ErrorState` avec « Réessayer » si l'API échoue ; repli sur la liste serveur |
| H10 Aide | PASS (n/a) | action évidente |

## 5. Mesure (HEART, composant partagé)
| Dimension | Signal observable | Cible | Mesure |
|---|---|---|---|
| Task success | clic sur un numéro ou Suivant suivi d'une carte vue/ouverte sur la nouvelle page | ≥ 90 % des changements de page suivis d'une interaction sous 30 s `[HYPOTHÈSE : seuil à recaler]` | événement Umami `pagination_clic` `{liste, de, vers, mode: numero|precedent|suivant}` `[À VÉRIFIER : taxonomie d'événements existante, @data-analyst]` |
| Engagement | pages vues par session de liste | à comparer à l'avant-S1 | Umami, avant / après déploiement |
| Happiness | « retour arrière en 5 s » après un changement de page (signe de page ratée) | < 10 % `[HYPOTHÈSE]` | Umami |
| SEO (spec §7) | profondeur ≤ 3, 0 fiche orpheline | inchangé | re-crawl (spec S1) |

## 6. Recette demandée à @fullstack puis @qa
1. Mobile 375 et 360 px : 14 cellules sur 2 lignes (vannes, conseils), 10 sur 2 lignes (vidéos), aucune cellule sous 44 × 44 px, aucun défilement horizontal ; à 320 px : 6 colonnes sans débordement.
2. Clic sur un numéro depuis le bas de `/vannes` : la première carte est en haut du viewport, focus sur le conteneur, liste à 60 % d'opacité pendant le chargement, annonce « Page 7 sur 12 » (VoiceOver et NVDA).
3. Clavier seul : Tab traverse Précédent, 1…12, Suivant dans l'ordre visuel ; focus visible partout ; après Entrée le focus n'est pas perdu.
4. Ctrl/Cmd+clic, clic molette, retour arrière du navigateur : inchangés (tests existants).
5. HTML serveur (sans JS) : mêmes liens que la spec S1 (12, 12, 12, 8 numéros, courante sans lien, page 1 = URL de base, aucun `nofollow`), texte « Précédent » / « Suivant » présent dans le HTML.
6. Captures 3 appareils (375 / 768 / 1280) pages 1, 6, 12, à remettre dans ce dossier avant validation.

## 7. Décision
**GO conditionnel** : le correctif SEO peut rester déployé (il ne dégrade rien de crawlable). Corrections §3.1 et §3.2 = P0 avant de considérer S1 fini côté UX ; §3.3 = P1 même lot ; §3.4 = P2. Après corrections, notes attendues : desktop 10/10, mobile 10/10 sur ces critères.

---
**Handoff → @fullstack (corrections §3), @qa (recette §6), @data-analyst (événement §5), @design (arbitrage visuel du chip courant §3.3 : proportions, pas la structure)**
- Fichier produit : `/home/user/Marrant/docs/seo/captures-maillage-s20/relecture-ux.md`.
- Décisions : ne pas remettre « Page X / Y » ; grille unique 2 lignes sur mobile avec chevrons ; retour en haut instantané + focus + état de chargement dans le hook partagé.
- Points d'attention : test `pagination-numerotee-s20.test.tsx` l.93 (`hidden`) ; libellés Précédent / Suivant ne doivent pas commencer par « Page » ; en-tête sticky `[À VÉRIFIER]` pour `scroll-mt` ; déploiement à noter dans `REPLIT_ACTIONS.md`.
---

# Tour 2 : relecture du commit `e906661` (12/10/2026)

Preuves : `list-pagination.tsx`, `list-results.tsx`, `use-list-page.ts`, `lib/list-pagination.ts`, les trois listes (`vannes-list` l.259, `conseils-list` l.238, `videos-grid` l.250 : même branchement `ListResults` + `ref={listRef}`), le test `pagination-numerotee-s20.test.tsx`, et les captures `pagination-vannes-*` (p1 / p6 / p12 à 320, 375, 768, 1280 ; 30 pages ; avant / après clic 7). Données simulées. Arbitrage de la session accepté (chevrons bordés, violet).

## Notes

| Device | Tour 1 | Tour 2 | Reste |
|---|---|---|---|
| Desktop 1280 et 768 | 7,5 | **10 / 10** | rien |
| Mobile 375, 360, 320 | 5,5 | **9,5 / 10** | 1 correction visuelle d'une ligne (déjà demandée par @design, validée côté UX, §2) |

## 1. Les 6 corrections du tour 1 : constat

| Correction | État | Preuve |
|---|---|---|
| Retour en haut + focus | **Résolu** | `goToPage` : `scrollIntoView({block:"start", behavior:"instant"})` puis `focus({preventScroll:true})` sur `ListResults` (`tabIndex={-1}`, `outline-none`). Capture après clic 7 : première carte (« Vanne 73 ») à 80 px, sous l'en-tête collant de 64 px, URL `?page=7`. Ordre de tabulation : le Tab suivant tombe sur la première carte. |
| Grille mobile 2 lignes | **Résolu** | 375 : 7 + 7 alignés, ~90 px au lieu de ~196 (−54 %), identique sur p1, p6, p12. 320 : 5 + 5 + 4 sans débordement. 30 pages : `‹ 1 2 … 8 9 10` puis `11 12 … 29 30 ›` (13 cellules, 7 + 6). Précédent en haut à gauche, Suivant en bas à droite (zone du pouce). |
| Page courante violette, « sur Y » | **Résolu** | `bg-accent-secondary-hover text-white` (5,7:1), sr-only « Page 6 sur 12 », `aria-current="page"` conservé. Lisible sur toutes les captures. |
| Extrémités inactives | **Résolu** | `span aria-hidden` de même taille, plus de `<button disabled>` ; la grille ne bouge pas. |
| Clic raté (`touch-manipulation`, `active:`) | **Résolu** | `TAP` sur tous les liens ; cellules 44 px sous 768 px et sur écran tactile (`[@media(pointer:coarse)]`, tablettes couvertes). |
| Accessibilité | **Résolu** | `role="list"`, `…` en `aria-hidden`, région `role="status"`, `aria-busy`. Libellés « Page précédente (page 5) » : contiennent le texte visible « précédent » (2.5.3 respecté, comparaison insensible à la casse). Texte « Précédent » / « Suivant » dans le HTML (`max-md:sr-only`, pas `display:none`). Tests adaptés (`/^Page \d+$/`, `hidden` ciblé sur la classe). |
| Chargement | **Résolu, bien fait** | `pending = isLoading && liste non vide && pagination.page !== page` : pas de clignotement au premier rendu, et retour vers la page rendue par le serveur correctement atténué (comparer à `initialData.page` aurait raté ce cas). La pagination est hors du conteneur, donc reste nette. |

Aucun point de la spec SEO n'est touché : liens `<a href>` réels, page 1 = URL de base, courante sans lien, ni `nofollow` ni `display:none`, pages thème inchangées (rechargement complet, ouvertes en haut de page).

## 2. Reste à corriger (mobile 9,5 → 10)

1. **Cellules carrées 44 px centrées** (relevé par @design, validé UX). À 2 px d'écart, la pastille violette (47 × 44) touche le contour du chevron voisin (p1 : x=65 contre x=63 ; p12 : x=310 contre x=312). Correction exacte, `list-pagination.tsx` :
   `const MOBILE_CELL = "max-md:mx-auto max-md:h-11 max-md:w-11";` (remplace `"max-md:h-11 max-md:w-full max-md:min-w-11"`). Effet UX : cible 44 × 44 (règle du projet respectée), zone morte de ~3 px de chaque côté (pas de risque de clic sur le mauvais numéro, la cible est inchangée en hauteur et en centre). **Test à adapter dans le même commit** : `pagination-numerotee-s20.test.tsx` l.113 attend `max-md:min-w-11`, qui disparaît ; attendre `max-md:w-11` et `max-md:mx-auto`. Recapturer p1 et p12 à 375 px.

## 3. Durcissement recommandé (non bloquant, même commit)

2. **Annonce « Page N sur Y » trop tôt sur le retour arrière du navigateur.** Sur un clic, React 18 vide les effets avant le rendu (pas de fenêtre visible). Mais sur `popstate`, `setPage(urlPage)` rend une fois avec `isLoading === false` et `announce === true` avant que `fetchJokes` ne passe `isLoading` à vrai : le texte peut être annoncé, effacé, puis annoncé de nouveau `[À VÉRIFIER avec NVDA et VoiceOver]`. Correction d'une ligne dans chacune des 3 listes : passer `isLoading={isLoading || pagination?.page !== page}` à `ListResults` (l'annonce attend que les données affichées soient celles de la page demandée). `pending` reste inchangé (sinon `ErrorState` serait atténué à vie après un échec).

## 4. Réserves de lecture des captures et compromis assumés

- `pagination-vannes-avant-clic-7-375px.png` : la liste y est atténuée alors que la courante est « 1 ». Cause la plus probable : l'animation `animate-stagger-in` (délai `index × 50 ms`, la carte 12 démarre à 550 ms), capture prise trop tôt, et non `pending` (qui est faux sur la page rendue par le serveur). L'état `pending` n'est donc **pas prouvé par une capture** (la logique est correcte à la lecture). Renommer ou recapturer après 1 s ; recapture de `pending` possible avec l'API bridée `[non bloquant]`.
- Absents des captures, à ajouter à la recette (non bloquant) : un état de focus clavier sur une cellule (anneau violet `ring-2`, 4,6:1, cellules à 2 px d'écart) ; un après-clic desktop à 1280 px (vérifier que `scroll-mt-20` laisse bien la liste sous l'en-tête).
- Compromis assumé : après un changement de page, le focus clavier est sur la liste ; revenir à la pagination demande plusieurs Tab (ou la navigation par repères pour un lecteur d'écran : `nav` nommée « Pagination »). C'est le comportement attendu d'un SPA qui change de contenu, préférable à un focus perdu ; pas de correction.
- Utilisateur gratuit, pages > 1 : la liste est vide et les cartes verrouillées sont hors `ListResults`, juste en dessous (`mt-4`) : le défilement les place bien en haut de l'écran. Conforme.

## 5. Verdict tour 2

**GO** après la correction §2 (une ligne + un test) ; §3 recommandé dans le même commit. Notes finales attendues : desktop 10 / 10, mobile 10 / 10.

---
**Handoff Tour 2 → @fullstack (§2, §3), @qa (recette : p1 et p12 à 375 px, focus clavier, retour arrière avec lecteur d'écran)**
- Fichier mis à jour : `/home/user/Marrant/docs/seo/captures-maillage-s20/relecture-ux.md`.
- Décisions : tour 1 validé à 6 sur 6 ; reste une correction visuelle (cellules carrées) et un durcissement d'annonce.
- Points d'attention : test l.113 à adapter ; état `pending` non capturé ; déploiement à noter dans `REPLIT_ACTIONS.md`.
---
