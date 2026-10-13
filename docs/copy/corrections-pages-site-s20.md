# Corrections de mots des pages du site : s20

> Auteur : @copywriter, 13/10/2026. Source : `docs/qa/audit-pages-site-s20.md` (@reviewer). Décisions de Thomas du 13/10/2026 (fin de `docs/founder-preferences.md`), non re-questionnables.
> **Aucun fichier de code modifié.** Ce fichier ne contient que des changements de mots. Les retouches à 0 mot changé (guillemets, « … », tirets des titles, « 100 % », casse des H2, lien G1, `aria-hidden`, replis JSON-LD) restent à @fullstack.
> **Règle d'or P0 s18** : chaque retouche de mots passe la relecture à l'aveugle 2 sur 3 avant mise en ligne. Les propositions ci-dessous sont des candidates, pas des textes validés.
> Chemins relatifs à `apps/web/`. « Avant » est un extrait exact de la ligne indiquée (entités JSX `&apos;` et `&nbsp;` conservées), unique dans son fichier. « Après » garde le même codage que le fichier.

## 0. Décisions du 13/10 appliquées

| Décision | Effet dans ce fichier |
|---|---|
| Coaching à 99 € retiré | A9 et A10 abandonnées (pas de réécriture). Textes qui le mentionnent signalés au §10. |
| « la première plateforme francophone » gardé | AP6 : aucun changement. |
| A3 : cohérence avec « 2 à 4 semaines », « 50 XP » reste | §1, A3. |
| V5 : préciser « objets qui parlent » | §3, V5. |
| Graphie « autodérision » partout (hors textes thèmes validés s14) | §8. |
| 404 : plus de « je » au nom de la marque | §2, E1. |
| « streak » devient « série » (libellé validé s17) | A8, AP3, VI1, puis récapitulatif §9. |
| « école » retiré des énumérations s'il y a moins de 10 vannes ÉCOLE actives | §3, V2, V3. **Condition à vérifier en base avant d'appliquer** (voir V3). |

Convention de la liste de situations retenue partout : « boulot, couple, soirées, famille, gaming » (ce sont les pages thème et les filtres existants). Dans les méta, version courte « soirée, boulot, couple, famille ».

## 1. Accueil

| Code | Fichier:ligne |
|---|---|
| A1 | `src/components/home/upcoming-features.tsx:42` |

**A1**
- Avant : `Des parcours plus poussés sur la répartie et le storytelling, pour le jour où les bases ne te suffiront plus.`
- Après : `Des parcours plus poussés, sur la répartie d'abord, pour le jour où les bases ne te suffiront plus.`
- Raison : le parcours Storytelling est en ligne depuis s18, le bloc « Prochainement » ne doit plus le promettre. Bloc au futur explicite, donc pas de fausse promesse. `[À CONFIRMER : Thomas, « répartie d'abord » repose sur la roadmap (6e parcours Répartie)]`. Repli sans engagement de sujet : `Des parcours plus poussés, pour le jour où les bases ne te suffiront plus.`

**A2 et P1** (FAQ partagée affichée sur `/`, `/parcours`, `/abonnement`)
- Fichier:ligne : `src/lib/faqs.ts:26`
- Avant : `Le Parcours Machine à Café dure ${parcoursWeeks("machine-a-cafe")} semaines, le Parcours Répartie ${parcoursWeeks("repartie")} semaines, et le Parcours Confiance ${parcoursWeeks("confiance")} semaines.`
- Après : `Nos parcours durent de ${PARCOURS_MIN_WEEKS} à ${PARCOURS_MAX_WEEKS} semaines, à toi de choisir celui qui colle à ta situation.`
- Raison : la phrase en dur ne connaît que 3 parcours sur 5. Les deux constantes existent déjà dans `config/premium.ts` (elles servent à `/a-propos`) et suivent les parcours publiés. À importer dans `faqs.ts` (@fullstack). Variante si Thomas veut le détail : générer « Machine à Café 3 semaines, Répartie 4, Confiance, Storytelling et Boulot 6 » depuis `PREMIUM_PARCOURS`.

**A3** (le « 50 XP » est intouchable et reste)
- Fichier:ligne : `src/lib/faqs.ts:15`
- Avant : `voient une vraie différence en quelques jours.`
- Après : `sentent la différence au fil des semaines.`
- Raison : « quelques jours » contredisait « 2 à 4 semaines » trois questions plus bas. Phrase obtenue : « Nos membres gagnent en moyenne 50 XP par semaine et sentent la différence au fil des semaines. » Aucun nouveau chiffre.

**A4**
- Fichier:ligne : `src/lib/faqs.ts:36`
- Avant : `ou le redirect absurde permettent`
- Après : `ou le détour par l’absurde permettent`
- Raison : anglicisme isolé, et `/conseils` dit « le détour par l'absurde » (`conseils/page.tsx:62`). Apostrophe typographique, comme le reste de cette FAQ.

**A7**
- Fichier:ligne : `src/components/home/home-cta.tsx:29`
- Avant : `{tipsLabel} conseils de pros et`
- Après : `{tipsLabel} conseils concrets et`
- Raison : « de pros » n'est étayé nulle part et les conseils ne sont pas signés. « Concrets » est vrai et tient la promesse (chaque conseil a son défi).

**A8**
- Fichier:ligne : `src/app/(dashboard)/page.tsx:113`
- Avant : `et un streak pour garder le rythme.`
- Après : `et une série de jours de pratique pour garder le rythme.`
- Fichier:ligne : `src/app/(dashboard)/page.tsx:146`
- Avant : `avec tes XP et ton streak pour`
- Après : `avec tes XP et ta série pour`
- Raison : « Série » est le libellé validé en s17 (étalon 3.8, profil, FAQ). La FAQ dit « ta série compte les jours où tu pratiques » : la première occurrence l'explique, la seconde la reprend en court.

**A11**
- Fichier:ligne : `src/components/home/feature-cards.tsx:45`
- Avant : `Les meilleurs extraits d'humoristes français,`
- Après : `Les meilleurs extraits d'humoristes francophones,`
- Raison : le catalogue compte des humoristes belges et suisses (Marina Rollman, parcours Répartie).

## 2. Page 404 globale

**E1**
- Fichier:ligne : `src/app/not-found.tsx:24`
- Avant : `On dirait que cette page n&apos;existe pas... Un peu comme mes talents de danse.`
- Après : `Cette page n&apos;existe pas, ou plus. Les vannes, elles, sont toujours là.`
- Raison : le « je » de la marque est interdit par la charte (§1, règle 3, « le je est réservé aux vannes ») et le site parle au lecteur. Retire aussi les trois points tapés. Reste dans le jeu du H1 (« a oublié sa punchline ») et renvoie vers le bouton « Voir les vannes ».

**E2** (variante qui change un mot ; l'option `aria-hidden="true"` à 0 mot est au choix de @fullstack)
- Fichier:ligne : `src/app/not-found.tsx:16`
- Avant : `aria-label="confused face"`
- Après : `aria-label="visage perplexe"`
- Raison : l'étiquette anglaise est lue telle quelle par les lecteurs d'écran francophones.

## 3. Hub des vannes (`src/app/(dashboard)/vannes/page.tsx` et `src/components/vannes/vannes-list.tsx`)

**V1**
- Fichier:ligne : `src/components/vannes/vannes-list.tsx:214`
- Avant : `Aperçu gratuit : {FREE_JOKE_LIMIT} vannes accessibles sans compte.`
- Après : `Aperçu gratuit : {FREE_JOKE_LIMIT} vannes accessibles sans abonnement.`
- Raison : il n'y a plus de compte gratuit ([CHOIX] du 05/10), la limite vaut pour tout visiteur non abonné.

**V2** (filtres et favoris réservés à Premium ; la liste sans « école » est conditionnée par V3)
- Fichier:ligne : `vannes/page.tsx:52`
- Avant : `Passe par les filtres : boulot, couple, soirée, école, gaming.`
- Après : `Passe par les pages thème (boulot, couple, soirées, famille, gaming) ou, avec Premium, par les filtres.`
- Avant : `Mets tes préférées en favoris : tu les auras sous la main le jour J.`
- Après : `Avec Premium, mets tes préférées en favoris : tu les auras sous la main le jour J.`
- Fichier:ligne : `vannes/page.tsx:57`
- Avant : `Tes favoris te servent de carnet à relire de temps en temps.`
- Après : `Avec Premium, tes favoris te servent de carnet à relire de temps en temps.`
- Fichier:ligne : `vannes/page.tsx:111`
- Avant : `pour révéler la chute et garde tes préférées sous le coude.`
- Après : `pour révéler la chute et, avec Premium, garde tes préférées sous le coude.`
- Raison : filtres et favoris sont Premium (bandeau juste au-dessus : « tout le catalogue, les filtres et les favoris »). Les pages thème, elles, sont visibles sans abonnement (commentaire l. 117).

**V3** (école retiré des énumérations, uniquement si moins de 10 vannes ÉCOLE actives en base `[À VÉRIFIER en base]`)
- Fichier:ligne : `vannes/page.tsx:33`
- Avant : `rangées par situation : soirée, boulot, couple, école.`
- Après : `rangées par situation : soirée, boulot, couple, famille.`
- Fichier:ligne : `vannes/page.tsx:92`
- Avant : `classées par situation (soirée, boulot, couple, école)`
- Après : `classées par situation (soirée, boulot, couple, famille)`
- Fichier:ligne : `vannes/page.tsx:110`
- Avant : `Boulot, couple, soirées, école, gaming&nbsp;: choisis ta situation, clique`
- Après : `Boulot, couple, soirées, famille, gaming&nbsp;: choisis ta situation, clique`
- Fichier:ligne : `src/app/llms.txt/route.ts:162` (même énumération, hors page mais publique)
- Avant : `(boulot, couple, soirées, école, gaming…)`
- Après : `(boulot, couple, soirées, famille, gaming…)`
- Raison : aucune page thème « école » (`vannes-themes.ts:6`, moins de 20 vannes au 30/09). Si le comptage en base donne 10 ou plus, ne pas appliquer V3 et garder « école » dans les « Après » de V2.
- Signalé, non touché : `src/app/(dashboard)/blague-du-jour/page.tsx:48` dit « boulot, couple, soirée, école » dans une FAQ validée en s14 (landings) ; à n'aligner qu'avec un GO de Thomas.

**V4** (une seule formule du Test Stand-Up, sans « en soirée »)
- Fichier:ligne : `vannes/page.tsx:62`
- Avant : `la sortir ce soir en soirée ? »`
- Après : `la sortir ce soir et faire rire ? »`
- Fichier:ligne : `vannes/page.tsx:135`
- Avant : `la sortir ce soir en soirée et faire rire ? »`
- Après : `la sortir ce soir et faire rire ? »`
- Fichier:ligne : `src/app/(dashboard)/a-propos/page.tsx:171-172` : voir AP4.
- Raison : trois versions du même test sur le site. Formule retenue : « est-ce que je peux la sortir ce soir et faire rire ? ».

**V5** (préciser, ne pas retirer ; compatible avec la vanne étalon Alexa et l'exemple 1 de `/anatomie-vanne`)
- Fichier:ligne : `vannes/page.tsx:62`
- Avant : `pas d'objets qui parlent,`
- Après : `pas de grille-pain qui parle tout seul,`
- Fichier:ligne : `vannes/page.tsx:135`
- Avant : `pas d&apos;objets qui parlent,`
- Après : `pas de grille-pain qui parle tout seul,`
- Raison : le critère visait le gadget qui monologue sans raison ; une enceinte ou une appli qui répond (Alexa, « Toujours là ? ») reste permise (charte §1, règle 2, révisée le 30/09). Note : la porte interne `G-J3 « Pas d'objets qui parlent »` de `src/lib/ai/agents/standup-director-agent.ts:87-90` et la ligne 881 portent le même énoncé trop large ; à aligner par @ia (prompts internes, hors pages).

**V6**
- Fichier:ligne : `vannes/page.tsx:57`
- Avant : `Au bout de 3-4 répétitions,`
- Après : `Au bout de 3 ou 4 répétitions,`

**V7**
- Fichier:ligne : `vannes/page.tsx:138`
- Avant : `boulot, couple, soirée, potes`
- Après : `boulot, couple, soirées, famille, gaming`
- Raison : « potes » n'est pas une catégorie ; reprend la liste réelle des pages thème et des filtres.

## 4. Conseils et vidéos

**P2 et C1** (FAQ de `/conseils`, rythme réel : une étape par semaine, cf. `FAQ_REGULARITE`)
- Fichier:ligne : `src/app/(dashboard)/conseils/page.tsx:57`
- Avant : `te donne des exercices concrets à tester chaque jour.`
- Après : `te donne un défi concret à chaque étape, à raison d'une par semaine.`
- Raison : « chaque jour » contredit « une étape par semaine » (FAQ_REGULARITE, et FAQ de l'accueil).

**C2** (chiffres inchangés)
- Fichier:ligne : `conseils/page.tsx:57`
- Avant : `Avec 5-10 minutes de pratique quotidienne,`
- Après : `Avec 5 à 10 minutes de pratique quotidienne,`
- Fichier:ligne : `src/lib/faqs.ts:26`
- Avant : `Avec une pratique quotidienne de 5-10 minutes,`
- Après : `Avec une pratique quotidienne de 5 à 10 minutes,`
- Raison : « 5-10 » est un tiret de plage ; « 5 à 10 », comme « 2 à 4 semaines » dans la même phrase. (`homepageFaqs` de `page.tsx:28` est supprimé, rien à faire.)

**VI1**
- Fichier:ligne : `src/app/(dashboard)/videos/page.tsx:58`
- Avant : `Et avec les streaks et les XP, tu tiens sur la durée,`
- Après : `Et avec ta série et tes XP, tu tiens sur la durée,`

**VI2** (le mot-clé `stand-up français` de la liste `keywords`, l. 34, reste intact)
- Fichier:ligne : `videos/page.tsx:32`
- Avant : `de stand-up français décortiquées technique par technique,`
- Après : `de stand-up en français décortiquées technique par technique,`
- Fichier:ligne : `videos/page.tsx:87`
- Avant : `de stand-up français décortiquées technique par technique,`
- Après : `de stand-up en français décortiquées technique par technique,`
- Fichier:ligne : `videos/page.tsx:53`
- Avant : `On décortique les meilleurs passages de pros de la scène française,`
- Après : `On décortique les meilleurs passages de pros de la scène francophone,`
- Raison : mêmes humoristes belges et suisses que A11. « En français » garde les deux mots de la requête dans les méta tout en restant exact. Attention à l'édition : l'Avant des lignes 32 et 87 est identique (deux endroits à corriger, un par ligne, pas de remplacement global sans contrôle).

**G2** (chiffres inchangés ; « 2 à 3 secondes » gardé le 13/10)
- Fichier:ligne : `src/lib/glossary.ts:79`
- Avant : `pour gagner 2-3 secondes`
- Après : `pour gagner 2 à 3 secondes`

## 5. À propos (`src/app/(dashboard)/a-propos/page.tsx`)

**AP3**
- Fichier:ligne : `a-propos/page.tsx:120`
- Avant : `progresser pas à pas avec des XP et des streaks`
- Après : `progresser pas à pas avec des XP et une série de jours de pratique`

**AP4**
- Fichier:ligne : `a-propos/page.tsx:165`
- Avant : `pas juste à ceux qui sont &quot;nés drôles&quot;.`
- Après : `pas juste à ceux qui sont «&nbsp;nés drôles&nbsp;».`
- Fichier:ligne : `a-propos/page.tsx:171` (début du test, coupé sur deux lignes dans le JSX)
- Avant : `passe un test simple avant d&apos;être publié : &quot;est-ce que`
- Après : `passe un test simple avant d&apos;être publié : «&nbsp;est-ce que`
- Fichier:ligne : `a-propos/page.tsx:172`
- Avant : `je la sors ce soir en soirée ?&quot;`
- Après : `je peux la sortir ce soir et faire rire ?&nbsp;»`
- Raison : guillemets français, et test aligné sur V4 (« est-ce que je peux la sortir ce soir et faire rire ? »).

**AP5**
- Fichier:ligne : `a-propos/page.tsx:152`
- Avant : `son set soir après soir : ce qui fait rire reste, ce qui fait un`
- Après : `son set soir après soir. Ce qui fait rire reste, ce qui fait un`
- Raison : deux deux-points dans la même phrase (le premier suit « Roder, comme en open mic »). Reste de la phrase inchangé (« blanc saute. Tu avances de la même façon, essai après essai. »).

**AP6** : « première plateforme francophone » gardé, aucune retouche.

## 6. Quiz « Quel type d'humour es-tu ? » (`src/components/quiz/quiz-data.ts`)

**Q3**
- Fichier:ligne : `quiz-data.ts:281`
- Avant : `question: "Quand t'es stressé(e), tu...",`
- Après : `question: "Quand la pression monte, tu fais quoi ?",`
- Raison : « tu » répété avec les réponses (« Tu relativises… ») et seule écriture inclusive du site. Les 4 réponses commencent par « Tu » et répondent à « tu fais quoi ? ». Le dernier choix de réponse (« Tu lâches une vanne pince-sans-rire, et la pression retombe ») répète « pression » ; acceptable car il répond à la question posée, à contrôler à la relecture.

**Q4**
- Fichier:ligne : `quiz-data.ts:106`
- Avant : `question: "En soirée, t'es plutôt...",`
- Après : `question: "En soirée, tu fais plutôt quoi ?",`
- Raison : l'audit proposait « En soirée, tu… » ; devant des réponses qui commencent par « Tu », cela donne « tu… Tu observes ». La forme question règle les deux défauts (adjectif attendu, « tu » répété) et reste jumelle de Q3.

## 7. Anatomie d'une vanne (`src/app/(dashboard)/anatomie-vanne/page.tsx`)

**AN1** (encadré aligné sur la section « Les 6 types de pivots », même ordre)
- Fichier:ligne : `anatomie-vanne/page.tsx:161`
- Avant : `Double sens, retournement, association inattendue, exagération,`
- Après : `Double sens, retournement, exagération, décalage,`
- Fichier:ligne : `anatomie-vanne/page.tsx:162`
- Avant : `sous-entendu, décalage temporel.`
- Après : `sous-entendu, anti-chute.`

**AN2** (caduque si l'exemple 1 est remplacé par la relecture à l'aveugle, voir §11)
- Fichier:ligne : `anatomie-vanne/page.tsx:64`
- Avant : `On attend l'effort, on découvre qui a vraiment remarqué l'abandon`
- Après : `On attend l'effort, c'est l'appli qui constate l'abandon`
- Raison : phrase obscure, à la différence des deux autres pivots, qui disent l'attente puis l'écart.

## 8. Graphie « autodérision » partout

Remplacer « Auto-dérision » par « Autodérision » (et « auto-dérision » par « autodérision »). **Ne pas toucher** : les textes des pages thème validés s14 (`vannes-themes.ts`, sauf le libellé de navigation ligne 91, comme l'audit §7), les fiches vidéo, décryptages et articles en base ou en JSON (`src/data/*.json`, `blog-articles.ts`), qui passent par leur propre relecture.

| Fichier:ligne | Avant | Après |
|---|---|---|
| `src/lib/vannes-themes.ts:91` | `label: "Auto-dérision",` | `label: "Autodérision",` |
| `src/components/conseils/conseils-list.tsx:55` | `{ value: "AUTODERISION", label: "Auto-dérision" },` | `{ value: "AUTODERISION", label: "Autodérision" },` |
| `src/components/vannes/vannes-list.tsx:62` | `{ value: "AUTODERISION", label: "Auto-dérision" },` | `{ value: "AUTODERISION", label: "Autodérision" },` |
| `src/components/vannes/vannes-list.tsx:69` | `AUTODERISION: "Auto-dérision",` | `AUTODERISION: "Autodérision",` |
| `src/components/videos/videos-grid.tsx:56` | `AUTODERISION: "Auto-dérision",` | `AUTODERISION: "Autodérision",` |
| `src/components/videos/videos-grid.tsx:92` | `{ value: "AUTODERISION", label: "Auto-dérision" },` | `{ value: "AUTODERISION", label: "Autodérision" },` |
| `src/components/favoris/favoris-list.tsx:59` | `AUTODERISION: "Auto-dérision",` + ligne suivante `SITUATION:` (le tableau des vannes) | `AUTODERISION: "Autodérision",` |
| `src/components/favoris/favoris-list.tsx:77` | `AUTODERISION: "Auto-dérision",` précédé de `TIMING: "Timing",` (le tableau des conseils) | `AUTODERISION: "Autodérision",` |
| `src/components/home/daily-content.tsx:55` | `AUTODERISION: "Auto-dérision",` + ligne suivante `SITUATION:` (vannes) | `AUTODERISION: "Autodérision",` |
| `src/components/home/daily-content.tsx:73` | `AUTODERISION: "Auto-dérision",` précédé de `TIMING: "Timing",` (conseils et vidéos) | `AUTODERISION: "Autodérision",` |
| `src/app/(dashboard)/conseils/[slug]/page.tsx:31` | `AUTODERISION: "Auto-dérision",` | `AUTODERISION: "Autodérision",` |
| `src/app/(dashboard)/videos/[slug]/page.tsx:25` | `AUTODERISION: "Auto-dérision",` | `AUTODERISION: "Autodérision",` |
| `src/app/(dashboard)/vannes/[slug]/page.tsx:27` | `AUTODERISION: "Auto-dérision",` | `AUTODERISION: "Autodérision",` |
| `src/components/home/feature-cards.tsx:26` | `Timing, auto-dérision, storytelling :` | `Timing, autodérision, storytelling :` |
| `src/app/(dashboard)/page.tsx:145` | `Blagues, storytelling et auto-dérision pour le` | `Blagues, storytelling et autodérision pour le` |

Pour `favoris-list.tsx` et `daily-content.tsx`, la même ligne `AUTODERISION: "Auto-dérision",` apparaît deux fois par fichier (tableau des vannes, tableau des conseils) : éditer avec la ligne voisine indiquée comme contexte, pas en remplacement global.

**Test à mettre à jour (@fullstack)** : `src/__tests__/dashboard/feature-cards.test.tsx:50` attend `/timing, auto-dérision, storytelling/i` ; passer à `/timing, autodérision, storytelling/i`, sinon le test casse.

Déjà en « autodérision » (rien à faire) : `src/lib/faqs.ts`, `conseils/page.tsx`, `videos/page.tsx`.

## 9. « streak » devient « série » : récapitulatif

Textes de pages couverts plus haut : A8 (`page.tsx:113`, `:146`), AP3 (`a-propos/page.tsx:120`), VI1 (`videos/page.tsx:58`). Il n'en reste aucun autre dans le texte affiché des pages.

Occurrences hors pages, à traiter par leur propre passe (non modifiées ici) :
- `src/lib/blog-articles.ts:1915` : « Avec XP, streaks et progression visible » (article, relecture à l'aveugle des articles). Proposition : `Avec XP, série de jours et progression visible`.
- `src/lib/ai/agents/marketing-agent.ts:150,156,165` : « XP, streaks » dans les prompts du générateur (instructions internes, mais les textes qu'il produit reprendront le mot). Proposition @ia : « XP, série ».
- Le reste des occurrences est du code (champs `streak`, tests) : ne pas renommer.

## 10. Textes qui mentionnent le coaching à 99 € (retiré : à retirer ou masquer, pas réécrits ici)

- `src/components/home/premium-cta.tsx:119-175` : le bloc « Coaching individuel », 99 € / séance, « Un appel de 45 min avec un professionnel de l'humour » (l. 133), « Diagnostic personnalisé de tes points forts / faiblesses » (l. 143), « Suivi post-appel par email » (l. 155), « Réserver un appel · 99 € » (l. 165), le lien Calendly et la phrase « Pour toi si tu préfères qu'on regarde ensemble… » (l. 171). A9 et A10 de l'audit tombent avec le bloc.
- `src/lib/llms-content.ts:125` : `"Coaching individuel : 99 €/séance (45 min en visio)."` et la logique `coachingIndex` (l. 144-145) qui insère les tarifs avant cette ligne.
- `src/app/(dashboard)/page.tsx:174` : commentaire « abonnement d'abord, coaching en dessous » (code, pas de texte affiché).
- À vérifier aussi hors `src/` : `public/llms*.txt` générés, JSON-LD d'offre, CGU (offre « appel » éventuelle) : non lus ici.

## 11. À trancher par Thomas (propositions non incluses dans la liste d'application par défaut)

| Code | Fichier:ligne | Avant | Après proposé | Ma recommandation |
|---|---|---|---|---|
| PC3 | `src/app/(dashboard)/parcours/[slug]/page.tsx:67` | `pour retrouver confiance en soi grâce à l'humour` | `pour retrouver confiance en toi grâce à l'humour` | Ne pas appliquer. « En soi » est impersonnel (le tutoiement n'est pas violé) et « retrouver confiance en soi » est un mot-clé du site (`layout.tsx:59`, `llms-full.txt`), charte §1, règle 6. |
| C3 | `src/components/conseils/conseils-list.tsx:261` | `Change tes filtres, y'a plein de techniques qui t'attendent.` | `Change tes filtres, il y a plein de techniques qui t'attendent.` | Garder « y'a » : l'étalon C validé par le fondateur l'emploie (« Dans le jeu, y'a un bouton « trier » »), c'est le registre oral du pote. |
| VI3 | `src/components/videos/videos-grid.tsx:262` | `Essaie un autre niveau, y'a du lourd qui t'attend.` | `Essaie un autre niveau, il y a du lourd qui t'attend.` | Même raison que C3. |

Si Thomas préfère suivre l'audit à la lettre, les « Après » ci-dessus sont prêts.

## 12. Les 9 vannes d'exemple de `/anatomie-vanne`, recopiées à l'identique pour la relecture à l'aveugle

Source : `apps/web/src/app/(dashboard)/anatomie-vanne/page.tsx`. Aucune modification proposée : ce sont les textes en ligne aujourd'hui. Les guillemets “ ” et les apostrophes droites sont ceux du fichier. Les 3 premières existent avec un setup, un pivot, une punchline et une analyse (comptes de mots vérifiés par l'audit : 8, 9, 7). Pour la relecture, la vanne = setup + punchline.

### 12.1 Les 3 vannes décortiquées (tableau `vanneExamples`, l. 60-85)

**Vanne 1, catégorie Observation** (setup l. 63, pivot l. 64, punchline l. 65, analyse l. 67)
> J'ai lancé une séance de sport sur une appli, dans mon salon. Après 4 minutes, elle m'a demandé : “Toujours là ?”

**Vanne 2, catégorie Autodérision** (setup l. 71, pivot l. 72, punchline l. 73, analyse l. 75)
> Chez le coiffeur, on m'a demandé ce que je voulais comme coupe. J'ai montré la photo d'un mec sûr de lui.

**Vanne 3, catégorie Absurde** (setup l. 79, pivot l. 80, punchline l. 81, analyse l. 83)
> Mon voisin met la musique à fond tous les soirs. Hier, je suis allé m'excuser de dormir.

### 12.2 Les 6 vannes de la section « Les 6 types de pivots » (champ `example`)

**Vanne 4, Double sens** (l. 267)
> « Mon chef m'a dit de prendre des initiatives. » → « J'ai pris mon vendredi. »

**Vanne 5, Retournement** (l. 273)
> « Mon psy m'a dit que j'étais normal. » → « J'ai changé de psy. »

**Vanne 6, Exagération** (l. 279)
> « J'ai tellement de mails non lus que les plus anciens m'écrivent pour prendre de mes nouvelles. »

**Vanne 7, Décalage** (l. 285)
> « J'ai présenté mon nouveau canapé à mes parents. Mon père lui a demandé ce qu'il faisait dans la vie. »

**Vanne 8, Sous-entendu** (l. 291)
> « Ma mère m'a demandé comment était le repas chez mes beaux-parents. J'ai dit que la nappe était très jolie. »

**Vanne 9, Anti-chute** (l. 297)
> « Mon père m'a pris à part, l'air grave, pour me transmettre le secret de famille. » → « On met le lait après les céréales. »

### 12.3 Conséquences si une vanne échoue (décision du 13/10 : remplacée par une vanne validée du catalogue)

- Vannes 1 à 3 : si l'une est remplacée, ses lignes `pivot`, `punchline` et `analysis` (dont le compte de mots) sont à réécrire avec la nouvelle vanne ; AN2 devient caduque si la vanne 1 sort. Les analyses sont des textes de pédagogie : repasser aussi la relecture à l'aveugle.
- Vannes 4 à 9 : le champ `desc` du type de pivot reste, seul `example` change ; la nouvelle vanne doit illustrer le même mécanisme (double sens, retournement, exagération, décalage, sous-entendu, anti-chute).
- Point de vigilance pour la lecture : la vanne 5 (psy) ressemble à un classique connu ; la vanne 4 (« pris mon vendredi ») joue sur « initiatives ».

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/copy/corrections-pages-site-s20.md`
- Décisions prises : retouches de mots proposées pour A1 à A4, A7, A8, A11, E1, E2, V1 à V7, P2/C1, C2, VI1, VI2, G2, AP3 à AP5, Q3, Q4, AN1, AN2, plus la graphie « autodérision » sur 15 emplacements ; A9 et A10 abandonnées (coaching retiré) ; AP6 inchangé ; V5 devient « pas de grille-pain qui parle tout seul » ; A3 devient « sentent la différence au fil des semaines » ; Q3 et Q4 passent en questions (« tu fais quoi ? ») au lieu des points de suspension de l'audit.
- Points d'attention : (1) V3 et la liste sans « école » conditionnés au comptage des vannes ÉCOLE actives en base (moins de 10) ; (2) A1 « répartie d'abord » à confirmer par la roadmap ; (3) PC3, C3, VI3 gardés hors application par défaut, à trancher (mot-clé SEO ; « y'a » présent dans l'étalon C) ; (4) test `feature-cards.test.tsx:50` à mettre à jour avec la graphie ; (5) coaching : bloc `premium-cta.tsx` et ligne `llms-content.ts:125` à retirer par @fullstack ; (6) porte interne G-J3 « Pas d'objets qui parlent » à aligner par @ia ; (7) toute retouche ci-dessus repasse la relecture à l'aveugle 2 sur 3 avant mise en ligne ; (8) les 9 vannes du §12 sont à faire juger telles quelles, puis les remplacements éventuels à choisir dans le catalogue validé.
---
