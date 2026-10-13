# Application de l'audit des pages, lot 1 : s20

> @fullstack, 13/10/2026. **Non commité, non déployé.** Sources : `docs/qa/audit-pages-site-s20.md`, `docs/copy/corrections-pages-site-s20.md`, clé `docs/copy/relecture-videos-s20/cle-pages-1310.md` (items J01-J44 de `aveugle-pages-1310.md`), décisions du 13/10 (`docs/founder-preferences.md`).
> Méthode : script de remplacement exact, nombre d'occurrences contrôlé AVANT écriture (rien n'est écrit si un seul « Avant » n'a pas le compte attendu). Les 47 « Avant » du lot de mots + graphie étaient tous trouvés au compte attendu (1, ou 2 quand le fichier l'annonce). Chemins relatifs à `apps/web/`.

## 1. Retouches de mots validées à l'aveugle (34 items, appliqués)

| Item | Code | Fichier | Mots changés / mots de l'extrait |
|---|---|---|---|
| J12 | A2/P1 | `src/lib/faqs.ts` (+ import `PARCOURS_MIN_WEEKS` / `PARCOURS_MAX_WEEKS` de `config/premium.ts`, `parcoursWeeks` retiré) | 19 / 19 |
| J26 | A3 | `src/lib/faqs.ts` | 7 / 7 |
| J09 | A4 | `src/lib/faqs.ts` | 3 / 5 |
| J16 | A7 | `src/components/home/home-cta.tsx` | 2 / 5 |
| J08, J28 | A8 | `src/app/(dashboard)/page.tsx` | 8 / 14 |
| J03 | A11 | `src/components/home/feature-cards.tsx` | 1 / 5 |
| J24 | E1 | `src/app/not-found.tsx` | 13 / 14 |
| J18 | E2 | `src/app/not-found.tsx` | 2 / 2 |
| J33 | V1 | `src/components/vannes/vannes-list.tsx` | 1 / 8 |
| J22, J21, J42 | V2 | `src/app/(dashboard)/vannes/page.tsx` (FAQ l. 52 et 57) | 18 / 37 |
| J04 | V3 | `vannes/page.tsx` (chapeau l. 110) | 1 / 9 |
| J38 | V3 | `src/app/llms.txt/route.ts` | 1 / 5 |
| J15, J19 | V4 | `vannes/page.tsx` (FAQ l. 62, bloc SEO l. 135) | 5 / 19 |
| J13, J34 | V5 | `vannes/page.tsx` | 10 / 8 |
| J01 | V7 | `vannes/page.tsx` | 3 / 4 |
| J07 | P2/C1 | `src/app/(dashboard)/conseils/page.tsx` | 10 / 9 |
| J02 | VI1 | `src/app/(dashboard)/videos/page.tsx` | 3 / 12 |
| J27, J31 | VI2 | `videos/page.tsx` l. 32 et 87 (2 occurrences identiques, comptées et attendues) ; mot-clé `stand-up français` de `keywords` intact | 2 / 14 |
| J06 | VI2 | `videos/page.tsx` | 1 / 11 |
| J37 | AP3 | `src/app/(dashboard)/a-propos/page.tsx` | 6 / 10 |
| J23, J36, J25 | AP4 | `a-propos/page.tsx` | 9 / 26 |
| J14 | AP5 | `a-propos/page.tsx` | 3 / 15 |
| J17 | Q3 | `src/components/quiz/quiz-data.ts` | 7 / 5 |
| J44 | Q4 | `quiz-data.ts` | 5 / 5 |
| J35, J11 | AN1 | `src/app/(dashboard)/anatomie-vanne/page.tsx` | 5 / 9 |

**Total : 145 mots changés sur 277 mots d'extraits** (les extraits sont des fragments de phrase ; rapporté aux pages entières, le changement est marginal).

Condition V3 vérifiée : export des vannes actives du 13/10 (`docs/copy/relecture-videos-s20/vannes-actives-1310.json`, 142 vannes) : **5 vannes ÉCOLE actives** (< 10). « école » retiré des énumérations validées (J04, J22, J38).

## 2. Refusés ou non appliqués

| Item | Code | Raison |
|---|---|---|
| J10 | A1 | En reprise (consigne). Texte « Prochainement » inchangé, promet encore le storytelling. |
| J20 | V2 (chapeau l. 111) | En reprise. « garde tes préférées sous le coude » inchangé. |
| J29, J39 | V3 (méta l. 33, JSON-LD l. 92) | En reprise. **Incohérence temporaire** : méta et JSON-LD de `/vannes` disent encore « école », le chapeau et la FAQ disent « famille ». |
| J30, J43 | C2 | En reprise. « 5-10 minutes » inchangé (`conseils/page.tsx`, `faqs.ts`). |
| J32 | G2 | En reprise. « 2-3 secondes » inchangé (`glossary.ts`). |
| J40 | V6 | En reprise. « 3-4 répétitions » inchangé. |
| J41 | Waly Dia | En reprise, hors pages. |
| J05 | AN2 | Non appliqué : pivot de la vanne 1 (K01), qui sera remplacée (consigne « ne touche pas K01 » ; corrections §7 et §12.3 : AN2 caduque si la vanne 1 sort). |
| K01-K09 | Vannes d'anatomie | Non touchées (K01 et K04 remplacées plus tard, les 7 autres restent). |
| PC3, C3 (« y'a »), VI3 (« y'a ») | §11 | Non retenue (consigne). |
| A9, A10 | Coaching | Tombent avec le retrait du bloc. |

## 3. Graphie « autodérision » (§8, 15 emplacements, appliqués)

`vannes-themes.ts:91` (libellé de navigation seul, textes s14 intacts), `conseils-list.tsx:55`, `vannes-list.tsx:62` et `:69`, `videos-grid.tsx:56` et `:92`, `favoris-list.tsx` (2), `daily-content.tsx` (2), `conseils/[slug]`, `videos/[slug]`, `vannes/[slug]`, `feature-cards.tsx:26`, `(dashboard)/page.tsx:145`. Test `src/__tests__/dashboard/feature-cards.test.tsx` passé à `/timing, autodérision, storytelling/i`. Non touchés (consigne §8) : `src/data/*.json`, `blog-articles.ts`, textes des pages thème.

## 4. Retouches à 0 mot changé (appliquées)

| Code | Fichier | Changement |
|---|---|---|
| B1 | `blog/page.tsx` | title « Blog humour : guides et techniques » |
| AP1 | `a-propos/page.tsx` | title « L'humour s'apprend : notre mission » |
| AP2 | `a-propos/page.tsx` | « jeux de mots : les mêmes techniques » (source du JSON-LD FAQPage) |
| A5 | `faqs.ts` | « observation…) » |
| C3 (partie « … ») | `conseils-list.tsx` | « se font désirer… » |
| VI3 (partie « … ») | `videos-grid.tsx` | « Pas de vidéo ici… » |
| Q1 | `quiz-data.ts` | 4 devises entre « » (espaces insécables) |
| Q2 | `quiz-data.ts` | « … » sur 10 questions (les 9 de l'audit hors Q3/Q4 réécrites, + « En rencard, tu mises sur… », même défaut) |
| Q5 | `quiz-humour/page.tsx`, `quiz-data.ts` | « 100 % » (insécable) |
| AN3 | `anatomie-vanne/page.tsx` | H2 « Le setup », « Le pivot », « La punchline » |
| G1 | `glossary.ts` | lien `/parcours/storytelling`, libellé « Parcours Storytelling » (`STORYTELLING_PUBLIE = true`) |

Non appliqués : « email » → « e-mail » des pages légales (juridique laissé en l'état, [CHOIX] du 29/09 ; hors liste demandée) ; PC1/PC2 (`docs/content/parcours-seed.json` : le texte affiché vient de la base, modifier le seed seul ne change rien en ligne) ; phrase de repli de `/blague-du-jour` (texte nouveau, non relu).

## 5. Code

- **(a) Coaching à 99 € retiré.** `premium-cta.tsx` : bloc `<details>` « Coaching individuel » supprimé (56 lignes : prix, 5 puces, lien Calendly `contact-deviens-marrant/45min`, phrase « Pour toi si… »). `llms-content.ts` : ligne tarif supprimée, `getLlmsTarifs` ajoute l'annuel en fin de liste (plus de `coachingIndex`). `marketing-agent.ts` : « Coaching individuel à 99 €/session » et « coaching (99 €/session) » retirés du prompt (le générateur ne doit plus le proposer ; « coaching impro (cher) », qui parle des concurrents, gardé). `(dashboard)/page.tsx` : commentaire mis à jour. **Pas de route de checkout, pas de produit Stripe, rien en base** pour le coaching (grep `coaching`, `calendly`, `99 €` sur `src/`, `prisma/`, scripts) : la réservation passait par Calendly, hors de notre base. **Achat possible : oui, via Calendly, invisible pour nous** ; à vérifier par Thomas dans son compte Calendly (et à désactiver l'événement 45 min). Rien supprimé ailleurs.
- **Point bloquant avant mise en ligne** : le H2 du bloc reste « Deux façons de t'y mettre » alors qu'il n'y a plus qu'une offre. Je ne l'ai pas réécrit (nouveau texte = relecture à l'aveugle, règle d'or). À faire écrire par @copywriter et relire 2 sur 3.
- **(b)** `homepageFaqs` supprimé de `(dashboard)/page.tsx` (et `void homepageFaqs`), commentaire du JSON-LD mis à jour.
- **(c)** `faqs.ts` importe `PARCOURS_MIN_WEEKS` / `PARCOURS_MAX_WEEKS` (A2/P1 validé) : aujourd'hui « de 3 à 6 semaines », suit les parcours publiés.
- **(d)** `conseils/page.tsx` et `videos/page.tsx` : replis 50 et 60 retirés ; base indisponible = `numberOfItems` omis (comportement de `buildCollectionPageJsonLd`, comme `/vannes`).
- **(e)** Prix en dur → `PREMIUM_PRICE_LABEL` : `a-propos/page.tsx:216`, `parcours/(liste)/page.tsx:110`, `glossaire/page.tsx:140` (audit), plus question prix de `faqs.ts`, 3 textes de `llms-content.ts`, `premium-paywall.tsx` (mobile), `humor-quiz.tsx`. Texte identique (« 2,99 €/mois », avec espace insécable). Non touchés : CGU (juridique), articles de `blog-articles.ts`, prompts IA.

## 6. Tests

Mis à jour : `feature-cards.test.tsx` (graphie), `premium-annual-display.test.ts` (dernier tarif = annuel), `anatomie-vanne.test.tsx` (casse H2), `conseils-list.test.tsx` et `videos-grid.test.tsx` (« … »), `viral-quiz.test.tsx` (devises avec insécables : la chaîne cherchée est normalisée comme le texte rendu). Ajouté : `src/__tests__/feature/coaching-retire-s20.test.tsx` (rendu du bloc Premium sans coaching ni Calendly ; FAQ et llms.txt sans coaching ; aucune ligne de code de `src/` hors commentaires et tests ne contient « 99 € », « Coaching individuel », « Calendly », « Réserver un appel » ou « / séance »).

## 7. Contrôles (sortie réelle, 13/10)

- Jest de référence AVANT modification : 299 suites, 4593 tests OK.
- `tsc --noEmit -p tsconfig.build.json` : 0 erreur. `tsc --noEmit` : 0 erreur.
- `npm run lint` : OK, 1 avertissement préexistant (`src/app/admin/page.tsx:1006`, `<img>`, fichier non touché).
- `env -u STRIPE_SECRET_KEY -u STRIPE_WEBHOOK_SECRET npx jest` : 300 suites (1 ignorée), 4596 tests OK, 5 ignorés.
- `npm run build` : « Compiled successfully », sortie 0 (erreurs Prisma de base absente pendant le prérendu, attendues en local et gérées).

## 8. Mesure du diff et fichiers

`git diff --shortstat` : 37 fichiers modifiés, 121 insertions, 194 suppressions, + 1 test créé. Mots (word-diff de `src/`) : 796 retirés, 356 ajoutés, dont 572 retirés pour le bloc coaching et `homepageFaqs`, et 70 ajoutés dans les tests. Intouchables : aucun slug, aucune URL publique, aucun chiffre [CHOIX] (50 XP, 8 semaines, 1 500+), aucun prix modifié ; H2 modifiés en casse seulement (AN3) ; un seul lien modifié (G1, demandé).

Fichiers : `src/lib/{faqs,glossary,llms-content,vannes-themes}.ts`, `src/lib/ai/agents/marketing-agent.ts`, `src/app/not-found.tsx`, `src/app/llms.txt/route.ts`, `src/app/(dashboard)/{page,a-propos/page,anatomie-vanne/page,blog/page,conseils/page,conseils/[slug]/page,glossaire/page,parcours/(liste)/page,quiz-humour/page,vannes/page,vannes/[slug]/page,videos/page,videos/[slug]/page}.tsx`, `src/components/{conseils/conseils-list,favoris/favoris-list,home/daily-content,home/feature-cards,home/home-cta,home/premium-cta,marketing/premium-paywall,onboarding/humor-quiz,vannes/vannes-list,videos/videos-grid}.tsx`, `src/components/quiz/quiz-data.ts`, 6 tests modifiés, 1 test ajouté.

## 9. Signalés, non traités

- `llms-content.ts:101` (llms-full.txt) cite encore « école » dans les contextes des vannes ; `blague-du-jour/page.tsx:48` aussi (FAQ validée s14, GO de Thomas requis).
- Porte interne G-J3 « Pas d'objets qui parlent » (`standup-director-agent.ts`) à aligner sur V5 par @ia.
- « streaks » restants hors pages : `blog-articles.ts:1915`, prompts `marketing-agent.ts` (§9 des corrections).
