# Vérification visuelle finale s12 (@design)

> Demande Thomas : « vérifiez bien que tout est OK sur mobile et PC » avant la bascule.
> Méthode : relecture humaine des captures fraîches (`tranches/`, 1440 / 768 / 390), tranche 01 de toutes les pages aux 3 largeurs, pages entières pour accueil, vannes, conseils, videos, parcours, parcours/repartie, blog (liste), blog/comment-devenir-drole, login, register, abonnement, quiz-humour, glossaire, a-propos, cgu. Causes localisées dans le code (fichier:ligne lus). Aucun code modifié, pas de git. Mesures en pixels lues sur les JPEG (±2 px). Les contrastes, débordements et cibles tactiles sont laissés à @qa.
> Références : `passe-visuelle-s12.md` (défauts d'origine), `passe-ux-s12.md`, `a-valider-s12.md` (arbitrages).

## 1. Verdict global par largeur

| Largeur | Verdict | Pourquoi |
|---|---|---|
| Desktop 1440 | **À corriger (mineur)** | 0 P0. Les 15 P0 d'origine sont réglés. Restent 4 P1 : boutons du CTA de bas d'accueil déséquilibrés, index du glossaire coupé au milieu d'un mot, tirets cadratins encore visibles dans l'UI, guillemets inversés en tête d'un article. |
| Tablette 768 | **À corriger** | 1 P0 : le header casse sur TOUTES les pages (logo sur 2 lignes, recherche écrasée à « Re », onglet actif collé au logo). Plus 2 P1 sur l'accueil (bouton de carte qui déborde, badge coupé dans « contenu du jour »). |
| Mobile 390 | **À corriger (mineur)** | 0 P0. 5 P1 : carte « vanne du jour » étirée sur 450 px de vide, ligne « Coaching individuel 99 € » cassée, bouton « Crée ton compte gratuit pour valider l'étape » qui déborde de sa hauteur, espace manquant sur `/anatomie-vanne`, tirets cadratins visibles. |

Ce qui est confirmé propre aux 3 largeurs : titres équilibrés sans orphelin (accueil, videos, parcours, blog, articles, register, abonnement, quiz), citations `>` et séparateurs `---` rendus, H2/H3 d'articles espacés, badges lisibles (violet clair sur violet foncé), bouton primaire `#7C3AED` cohérent partout, dates en français, catégories accentuées, libellés `One-liner` / `Débutant → Intermédiaire`, ☕ ⚡ en couleur, pages légales à 768 px de mesure, fil d'Ariane aligné sur la colonne (parcours, à-propos, articles), 10 vannes gratuites toutes différentes, colonnes et paddings mobiles corrigés (parcours, abonnement, cartes blog).

Ordre conseillé avant bascule : N1 (header tablette), puis N2 à N9 (une seule PR, quelques lignes chacune), puis N10 à N12 (contenu / règle 12, arbitrage Thomas pour les titres d'articles).

## 2. Suivi des P0 / P1 d'origine

Légende : réglé / partiel / non réglé / non vérifiable (image). Capture = fichier de `tranches/`.

### 2.1 Les 15 P0

| # | Constat d'origine | Statut | Preuve |
|---|---|---|---|
| 1 | H1 accueil desktop, « ça. » orphelin | **réglé** (2 lignes : « Tu parles et personne rit. » / « On va arranger ça. ») | desktop_accueil__01 |
| 2 | H1 accueil mobile, phrase coupée | **réglé** (2 lignes au lieu de 3, tient à 28 px) | mobile_accueil__01 |
| 3 | « Deux façons de t'y / mettre » | **réglé** | mobile_accueil__05, desktop_accueil__04 |
| 4 | Badge `ONE_LINER` | **réglé** (« One-liner », masqué si doublon de catégorie) | desktop_vannes__01, mobile_vannes__01 |
| 5 | /videos H1, « humoristes » orphelin | **réglé** (« Apprends à être drôle en piquant leur / mécanique aux meilleurs humoristes ») | desktop_videos__01 |
| 6 | /parcours mobile, « pas » orphelin, marge 32 px | **réglé** (2 lignes, marge 16 px) | mobile_parcours__01 |
| 7 | Badge « Semaine N » 2,1:1 | **réglé dans le code** (`badge.tsx:12`), **non vérifiable à l'image** (le programme est replié sous « PROGRAMME ») | badge.tsx:11-12 |
| 8 | /blog mobile, « : guides et techniques » en début de ligne | **réglé** | mobile_blog__01 |
| 9 | `> En bref :` affiché avec le signe `>` | **réglé** (encarts violets) | desktop_blog__comment-devenir-drole__01, desktop_blog__5-types-humour-lequel-pour-toi__01 |
| 10 | `---` affiché en clair | **réglé** (filet horizontal) | desktop_blog__meilleures-blagues-droles-2026__01, desktop_blog__phrases-droles-conversations__01 |
| 11 | H1 « … guide / pratique » | **réglé** (« Confiance en soi grâce à / l'humour : guide pratique ») | desktop_blog__avoir-confiance-en-soi-grace-a-l-humour__01 |
| 12 | citation-drole : « moment » et « assourdissant » orphelins | **réglé** | desktop_blog__citation-drole__01, tablette_blog__citation-drole__01 |
| 13 | H1 « … 5 / méthodes » et « … pas : 7 / raisons » | **réglé** | desktop_blog__comment-improviser-des-blagues__01, desktop_blog__pourquoi-blagues-marchent-pas__01 |
| 14 | H2 « … tue la / spontanéité » | **réglé** | desktop_blog__etre-plus-a-l-aise-en-societe__01 |
| 15 | Article mobile, « : le guide » + fil d'Ariane sur 2 lignes | **réglé** (H1 en 2 lignes propres, fil d'Ariane tronqué avec « … » sur une ligne) | mobile_blog__comment-devenir-drole__01 |

Bilan P0 : 15 réglés sur 15 (1 non revérifiable à l'image, réglé dans le code).

### 2.2 Les P1 d'origine (regroupés par zone)

| Zone | Constat d'origine | Statut | Preuve |
|---|---|---|---|
| Accueil | Cartes « contenu du jour » étirées | **partiel** : desktop réglé (`items-start`), mais mobile (carrousel) carte vanne étirée sur 450 px de vide, et tablette badge coupé (voir N3, N4) | desktop_accueil__02 / mobile_accueil__02 / tablette_accueil__01 |
| Accueil | 3 CTA « Trois outils » à 3 hauteurs, 2e d'une autre teinte | **partiel** : desktop et mobile réglés (y identiques, même violet), tablette : le 2e bouton déborde (N2) | desktop_accueil__03 / tablette_accueil__03 |
| Accueil | « Tu te reconnais ? » : h3 sans `font-display`, ☕ ⚡ gris, liens à 3 hauteurs, guillemets droits | **réglé** (liens alignés, emojis couleur, « » avec insécables) | desktop_accueil__03 |
| Accueil | FAQ mobile « si je n'ai pas le « / sens de l'humour » ? » | **réglé** (« sens de l'humour » tient ensemble) | mobile_accueil__08 |
| Accueil | Badges « Bientôt » / « Abonnés » violet sur violet | **réglé** | desktop_accueil__06 |
| Accueil | Puces vidéo en MAJUSCULES | **réglé** (titre en gras, casse normale, vu sur /videos) | desktop_videos__02 |
| Vannes | Intro sur 1240 px, H1 collé | **réglé** (PageHeader, intro ~760 px) | desktop_vannes__01 |
| Vannes | 3 vannes identiques d'affilée | **réglé** (10 vannes toutes différentes) | desktop_vannes__01-02, mobile_vannes__01-05 |
| Vannes | Filtres fantômes `opacity-50` | **réglé** (ligne cadenas + lien Premium) | desktop_vannes__01 |
| Vannes | « Débloquer » 3,9:1, FAQ/texte SEO à 1248 px | **réglé** (texte SEO 768 px, FAQ 672 px) | desktop_vannes__03-04 |
| Conseils | Paragraphes sur ~1170 px | **réglé** (~640 px) | desktop_conseils__01 |
| Conseils | Badge « Intermédiaire » violet sur violet, séparateur « · » isolé | **réglé** | desktop_conseils__01, mobile_conseils__01 |
| Vidéos | Blocs « Ce que tu vas apprendre » et « Page dédiée » à 3 hauteurs | **réglé** (alignés sur les 3 cartes) | desktop_videos__01-02 |
| Parcours | Contenu à x=288, fil d'Ariane y=155 | **réglé** (fil d'Ariane y=106, colonne 4xl centrée volontaire) | desktop_parcours__01 |
| Parcours | « DEBUTANT → INTERMEDIAIRE » | **réglé** (« Débutant → Intermédiaire », idem sur le détail : « Débutant → Expert ») | desktop_parcours__01, desktop_parcours__confiance__01 |
| Parcours | ☕ ⚡ gris | **réglé** | desktop_parcours__01 |
| Parcours | Titre de module sur 4 lignes, badge écrasé (mobile) | **non vérifiable** (programme replié) | mobile_parcours__03 |
| Parcours détail | « 0/4 étapes » collé à la barre, 30 px vides | **réglé** | desktop_parcours__repartie__01 |
| Parcours détail | Colonne de texte ~290 px sur mobile | **réglé** (marge 16 px) | mobile_parcours__repartie__01 |
| Parcours détail | Feedback du quiz `bg-green-50` (classe `dark:` morte) | **non vérifiable** (état interactif) | n/a |
| Blog liste | Catégories en MAJUSCULES sans accent, dates ISO | **réglé** (« Répartie », « 5 mai 2026 ») | desktop_blog__01 |
| Blog liste | Padding 36 px par côté sur mobile, « anti- / malaise » | **réglé** | mobile_blog__02, tablette_blog__01 |
| Article | H2/H3 collés au paragraphe précédent | **réglé** (48 px avant un H2) | desktop_blog__comment-devenir-drole__02-04 |
| Article | Listes en lignes brutes (`1. …`, `- Être méchant…`) | **réglé** | desktop_blog__5-types-humour-lequel-pour-toi__01, desktop_blog__humour-noir-utiliser-sans-blesser__01 |
| Article | Dates ISO, badge catégorie brut | **réglé** (« 13 mars 2026 », « Guide ») | desktop_blog__comment-devenir-drole__01 |
| Article | « « » orphelin en fin de ligne, guillemets droits | **réglé** (« » avec insécables) | desktop_blog__techniques-humoristes-pros__01 |
| Article | Bas de page : 3 panneaux à 3 fonds | **réglé** (même fond, mêmes bordures). Reste la case à cocher native blanche (P2) | desktop_blog__comment-devenir-drole__06-07 |
| Auth | Liens violets 3,9:1, H1 register mobile coupé | **réglé** (« Crée ton compte, ta / première vanne t'attend ») | desktop_register__01, mobile_register__01 |
| Abonnement | Badge et titre sur 2 lignes, texte à 262 px (mobile) | **réglé** | mobile_abonnement__01 |
| Abonnement | Sous-titre coupé en milieu de phrase (desktop) | **réglé** (2 lignes équilibrées) | desktop_abonnement__01 |
| Quiz | Sous-titre avec « film. » orphelin, deux `<main>` | **réglé** | desktop_quiz-humour__01 |
| À-propos | Fil d'Ariane à x=96 / H1 à x=336, nom de marque coupé (mobile) | **réglé** | desktop_a-propos__01, mobile_a-propos__01 |
| Anatomie | `<br />` forcé sur mobile | **réglé mais régression** : l'espace disparaît (« l'autre ?Réponse », N8) | mobile_anatomie-vanne__01 |
| Anatomie | Guillemets doublés | **réglé** (“Toujours là ?” dans « … ») | desktop_anatomie-vanne__02 |
| Légal | Lignes de 170 caractères, H1 y=118 | **réglé** (colonne 768 px, H1 y identique) | desktop_cgu__01, desktop_retractation__01 |
| Transverse | Onglet actif violet 3,4:1, « Blog » non actif sur un article | **réglé** | desktop_blog__comment-devenir-drole__01 |
| Transverse | Footer sans « .fr », Produit sur 1 colonne, copyright « (et un / peu de café) » | **réglé** (desktop : Produit sur 2 colonnes, copyright équilibré) | desktop_vannes__04 |
| Transverse | Boutons `sm` à 32 px sur mobile | **réglé** (`max-md:h-11`, `button.tsx:22`) | mobile_vannes__01 |

Bilan P1 : 34 réglés, 2 partiels (cartes accueil), 1 réglé avec régression (anatomie), 2 non vérifiables (états repliés / interactifs).

## 3. Nouveaux problèmes (régressions et défauts jamais vus, dont la tablette)

Prio : P0 = visible sur toutes les pages ou casse la lecture ; P1 = à corriger avant bascule ; P2 = polissage. Chemins relatifs à `apps/web/src/`.

| # | Page | Largeur | Capture | Problème | Cause probable | Correctif exact | Prio |
|---|---|---|---|---|---|---|---|
| N1 | TOUTES | 768 | tablette_accueil__01, tablette_vannes__01, tablette_blog__01 (idem les 64 pages) | Header cassé : logo « deviens- / marrant.fr » sur 2 lignes, barre de recherche écrasée à ~30 px (« Re »), onglet actif (« Accueil », « Blog ») collé au logo. Le header desktop est affiché à 768 alors qu'il ne tient pas | `components/layout/header.tsx:66` (nav `md:flex`), `:83` (`SearchBar` `hidden w-64 md:block`), `:86` (actions `md:flex`), `:119` (boutons mobiles `md:hidden`), `:156` et `:164` (overlay recherche et menu `md:hidden`), logo `:59-62` sans `nowrap` | Basculer le header en mode mobile jusqu'à 1023 px : `md:flex` devient `lg:flex` (`:66`, `:86`), `md:hidden` devient `lg:hidden` (`:119`, `:156`, `:164`), `SearchBar` : `hidden w-44 lg:block xl:w-64`. Logo : `<Link className="flex shrink-0 items-center gap-2">` et `<span className="… whitespace-nowrap">`. Calcul à 1024 : logo 190 + nav 433 + recherche 176 + « Commencer » 107 = 906 px pour 992 disponibles | P0 |
| N2 | accueil, « Trois outils » | 768 | tablette_accueil__03 | Bouton « Découvrir les techniques → » sur 2 lignes dans un bouton de 32 px : le texte touche le haut et le bas, le bouton s'étire sur toute la carte alors que les deux autres restent compacts | `components/home/feature-cards.tsx:70-74` : `<Link className="mt-auto pt-5">` (étiré par `flex-col`) + `Button size="sm"` (`h-8`, `button.tsx:22`) dans une carte de 228 px | `<Link href={feature.href} className="mt-auto self-start pt-5">` et `<Button variant={feature.variant} size="sm" className="h-auto min-h-8 whitespace-normal py-1.5 text-left leading-snug max-md:h-auto">` | P1 |
| N3 | accueil, « Ton contenu du jour » | 768 | tablette_accueil__01, tablette_accueil__02 | Badge « École & Études » coupé au bord de la carte (« École & E »), 3 colonnes de 228 px dont une de 700 px de texte | `components/home/daily-content.tsx:165` (`mb-4 flex items-center gap-2` sans `flex-wrap`, carte `overflow-hidden` `:162`) ; `:160` grille dès `md:` | `:165` : `flex flex-wrap items-center gap-2`. Recommandé : garder le carrousel jusqu'à 1023 px, en remplaçant les `md:` de `:160` et `:162` par `lg:` (`md:mx-0 md:grid md:grid-cols-3 md:items-start md:gap-6 md:overflow-visible md:px-0 md:pb-0 md:w-auto` devient `lg:…`) | P1 |
| N4 | accueil, « Ton contenu du jour » | 390 | mobile_accueil__02, mobile_accueil__03 | Carrousel : la carte « vanne du jour » (200 px de contenu) est étirée à la hauteur de la carte conseil, soit ~450 px de vide sombre sous les boutons | `daily-content.tsx:160` : `flex` sans `items-start` (seul `md:items-start` est posé) | Ajouter `items-start` (sans préfixe) : `… flex snap-x snap-mandatory items-start gap-3 overflow-x-auto …` | P1 |
| N5 | accueil, bloc « Tu crois avoir tout essayé » | 1440, 768 | desktop_accueil__04, tablette_accueil__04 | « Voir les vannes gratuites » passe sur 2 lignes dans son bouton, la ligne de prix de gauche aussi : la paire de boutons est déséquilibrée. Sur mobile (colonne) c'est correct | `components/home/home-cta.tsx:38-41` (bouton outline sans `nowrap`) et `:36` (ligne de prix sans largeur maîtrisée) ; colonne utile 608 px | `:39` : `<Button variant="outline" size="lg" className="w-full whitespace-nowrap">` ; `:36` : `<p className="max-w-[16rem] text-balance text-sm text-text-muted">…</p>` | P1 |
| N6 | accueil, offre | 390 | mobile_accueil__07 | Ligne repliée « Coaching individuel 99 € / séance » : « 99 » et « € » sur 2 lignes, « / séance » écrasé | `components/home/premium-cta.tsx:140-148` : `summary` flex sans `nowrap` ni `shrink-0` sur le prix | `:141` : `<h3 className="min-w-0 text-lg font-semibold …">` ; `:142` : `<span className="flex shrink-0 items-center gap-2 whitespace-nowrap text-text-muted">` ; `:143` : `99&nbsp;€` | P1 |
| N7 | parcours détail (repartie, machine-a-cafe, confiance) | 390 | mobile_parcours__repartie__03 | « Crée ton compte gratuit pour valider l'étape » sur 2 lignes dans un bouton de 40 px : le texte touche les bords haut et bas | `components/parcours/parcours-detail.tsx:748-754` : `Button className="w-full"` (`h-10` fixe, `button.tsx:23`) | `className="h-auto min-h-10 w-full whitespace-normal py-2 leading-snug"` | P1 |
| N8 | /anatomie-vanne | 390 | mobile_anatomie-vanne__01 | « … chez l'autre ?Réponse en 3 parties » : plus d'espace entre « ? » et « Réponse » depuis que le `<br>` est masqué sur mobile (régression du correctif) | `app/(dashboard)/anatomie-vanne/page.tsx:106-108` : JSX supprime l'espace autour du `<br>` | `Pourquoi la même vanne fait un carton chez l&apos;un et un blanc chez l&apos;autre&nbsp;?{" "}<br className="hidden sm:block" />Réponse en 3 parties, …` | P1 |
| N9 | glossaire (index) | 1440 | desktop_glossaire__01 | L'index des 12 termes déborde : « Rebond sur m » est coupé au milieu d'un mot au bord droit, sans indice de défilement (souris) | `app/(dashboard)/glossaire/page.tsx:158` (`gap-1`) et `:163` (`px-3`) | `:158` : `flex snap-x gap-0 overflow-x-auto py-1` ; `:163` : `px-2` (gagne ~140 px, tout tient à 1440 ; le défilement reste actif en dessous). La cible reste à 44 px de haut | P1 |
| N10 | parcours, parcours détail, à-propos, 5 articles | 1440, 768, 390 | desktop_parcours__01 (« Ça va ? — Ça va. »), desktop_parcours__repartie__02 (« … préparés — la meilleure démonstration de répartie », « … devants — la répartie bienveillante en action »), desktop_a-propos__02 (« jeux de mots — les mêmes techniques »), desktop_blog__comment-devenir-drole__03 (H3 « Pilier 1 : L'observation — Voir ce que… », piliers 2 à 5), desktop_blog__5-types-humour-lequel-pour-toi__01 (« Type 1 : L'observationnel — « C'est tellement vrai » »), desktop_blog__conversation-machine-a-cafe__01, desktop_blog__comment-faire-rire-une-fille__01, desktop_blog__jamais-quoi-repondre-techniques__01 | Tirets cadratins encore visibles (règle 12). Le corps des articles est déjà propre (`lib/em-dash.ts`), mais `HEADING_RE` (`em-dash.ts:53`) exclut les titres, et la description de parcours, l'annotation vidéo et la FAQ d'à-propos n'y passent pas | `components/ui/markdown-renderer.tsx:132` (`inlineMarkdown(heading[2])`) ; `components/parcours/parcours-content.tsx:257` et `:261` (description, témoignage) ; `parcours-detail.tsx` (bloc « Vidéos à regarder », annotation en italique) ; `(dashboard)/a-propos/page.tsx` (tableau de FAQ, réponse « Quelles techniques d'humour sont enseignées ? ») ; source `docs/content/parcours-seed.json` | Rendu, sans toucher aux mots : `import { stripEmDashes } from "@/lib/em-dash"` puis `inlineMarkdown(stripEmDashes(heading[2]))` (`:132`), `{stripEmDashes(p.description)}` (`:257`), idem pour `testimonial`, l'annotation vidéo et la réponse de FAQ. Le lib produit ponctuation seulement (« Pilier 1 : L'observation. Voir ce que les autres ignorent »). **Titres d'articles : décision déjà ouverte dans `a-valider-s12.md` (« tirets cadratins dans les 34 articles »), à trancher par Thomas** | P1 |
| N11 | article comment-raconter-une-blague-sans-la-rater | 1440, 390 | desktop_blog__comment-raconter-une-blague-sans-la-rater__01, mobile_blog__comment-raconter-une-blague-sans-la-rater__01 | Première ligne de l'article : « … il dit »pas de moutarde« . Ah… » : guillemets inversés, sans espaces, avec une espace avant le point | Donnée : `lib/blog-articles.ts`, contenu du slug `comment-raconter-une-blague-sans-la-rater` (aussi cible de `raconter-blague-sans-massacrer`), chaîne `»pas de moutarde« .` ; `frenchQuotes` (`markdown-renderer.tsx:36`) ne traite que les `"` droits | Remplacer `»pas de moutarde« .` par `« pas de moutarde ».` (ponctuation seulement). Filet de sécurité au rendu, dans `inlineMarkdown` avant `frTypo` : `.replace(/»\s?([^«»\n]{1,80}?)\s?«\s?/g, "« $1 »")` | P1 |
| N12 | /conseils | 1440, 768, 390 | desktop_conseils__01-02, tablette_conseils__01-02, mobile_conseils__02 | Sur les 3 conseils gratuits, 2 portent le même titre « L'auto-blague préventive : désamorcer avant l'explosion » (textes différents : « viens de faire une bourde » / « foires au boulot ») : même défaut que les vannes en double, en plus discret | Données (2 conseils quasi identiques) ; le dédoublonnage n'existe que pour les vannes (`lib/jokes-dedupe.ts`) | Dédoublonner à l'affichage par titre normalisé (même schéma que `dedupeJokesByContent`, clé = `title`) dans la liste et l'API des conseils, ou désactiver la copie en base. À faire valider côté contenu (les deux textes sont distincts) | P1 |
| N13 | /vannes (et probablement /conseils, /videos) | 1440, 768, 390 | desktop_vannes__01 | Carte vanne : 54 px au-dessus des badges pour 17 px sur les côtés, la carte paraît décalée vers le bas | `components/vannes/vannes-list.tsx:263` : `CardContent className="pt-4"` dans un `Card` qui a déjà `p-4` (`ui/card.tsx:9`) | `:263` : `<CardContent className="pt-0">` (même retouche sur les cartes équivalentes de `conseils-list.tsx` et `videos-grid.tsx` si elles ont le même `pt-4`) | P2 |
| N14 | accueil, hero | 1440, 768 | desktop_accueil__01 | Les 3 pastilles cliquables et les 2 descriptives ont presque le même gris : rien n'indique lesquelles sont des liens. « Voir les vannes gratuites » ressemble à du texte | `components/home/hero-section.tsx:82` (liens) et `:91` (descriptives) ; `:67-72` (lien sans soulignement) | Descriptives : `bg-transparent text-text-muted` (sans fond). Lien : ajouter `underline decoration-border underline-offset-4 hover:decoration-current` | P2 |
| N15 | accueil, « Trois outils » | 768, 390 | tablette_accueil__03, mobile_accueil__04 | « 80+ vidéos de stand- / up décryptées » coupé au tiret | `components/home/feature-cards.tsx:33` (chaîne) | `getTitle` retourne un `ReactNode` : `<>{count}+ vidéos de <span className="whitespace-nowrap">stand-up</span> décryptées</>` | P2 |
| N16 | /parcours | 390 | mobile_parcours__02, mobile_parcours__03 | Ligne de méta : la 2e ligne commence par un « · » orphelin (« · 15 min/semaine · 225 XP à gagner ») | `components/parcours/parcours-content.tsx:236-245` (les « · » sont dans le texte des `span`) | Sortir les points : `<span aria-hidden className="hidden sm:inline">·</span>` entre les `span`, et `gap-x-3 gap-y-1` sur le conteneur | P2 |
| N17 | pages auth | 1440, 768, 390 | desktop_login__01, mobile_register__01 | Le logo des cartes de connexion / inscription / mot de passe oublié est « deviens-marrant » (sans « .fr »), alors que header et footer disent « deviens-marrant.fr » | `app/(auth)/login/page.tsx`, `register/page.tsx`, `forgot-password/page.tsx` (span logo) | Ajouter « .fr » dans les 3 span (cohérence avec `header.tsx:61`, `footer.tsx:62`) | P2 |
| N18 | /glossaire, /conseils | 1440 | desktop_glossaire__01, desktop_conseils__01 | Cartes pleine largeur (1248 px) dont le texte n'occupe que les 770 px de gauche : 450 px de vide dans chaque carte | `glossaire/page.tsx:172-177` (cartes non plafonnées, seul le `<p>` l'est) ; idem cartes de `conseils-list.tsx` | Plafonner le conteneur des cartes : `space-y-6` devient `max-w-4xl space-y-6`. Pour conseils : `max-w-4xl` sur la liste | P2 |
| N19 | /parcours détail | 1440, 768, 390 | desktop_parcours__repartie__02 | Réponses du mini-quiz encadrées de guillemets droits simples ('Ferme-la') | Données du quiz (seed parcours) | Remplacer `'…'` par « … » dans les réponses (ponctuation seulement) | P2 |
| N20 | footer | 768 | tablette_accueil__07 | Colonne Produit sur 1 seule colonne de 9 liens face à Légal (5 liens) : colonne haute de 440 px, bas de page déséquilibré | `layout/footer.tsx:94` (`lg:grid-cols-2` seulement) | Acceptable tel quel (2 colonnes ne tiennent pas dans 224 px). Option : passer la grille du footer à `md:grid-cols-[1.2fr_1fr_1fr]` et `md:[&_ul]:columns-1` : pas prioritaire | P2 |

Vérifications faites sans anomalie (pour mémoire) : hero mobile (H1 sur 2 lignes, CTA pleine largeur, ligne de prix), hero tablette, bouton « Créer mon compte gratuit » + ligne de prix (hero, bas d'accueil, à-propos : cohérents, sauf N5), pastilles hero (3 liens en mobile), cartes « Tu te reconnais ? » et « Trois outils » (desktop), index du glossaire (mobile et tablette), bas d'article (parcours recommandé, CTA à deux boutons, newsletter : mêmes fonds, mêmes rayons), footer desktop et mobile, modales non capturées (voir section 4).

## 4. Non vérifiable

- **États interactifs** : menu burger ouvert, recherche mobile ouverte, `AuthModal` / `PremiumModal`, toasts, FAQ dépliées, chute révélée, hover et focus-visible, feedback du quiz de parcours (`bg-green-50` / classes `dark:` mortes), quiz d'humour en cours et écran de résultat.
- **Programmes repliés** des trois parcours (accordéon « PROGRAMME ») : badge « Semaine N » (contraste corrigé dans `badge.tsx:12`, non vu à l'image) et lignes de module sur mobile.
- **Index collant du glossaire** (`glossaire/page.tsx:154-157`, `sticky top-16`) : les captures en tranches ne montrent pas le comportement au défilement.
- **Largeur 1024 px** (jamais capturée). Après N1, c'est la largeur la plus serrée du header (906 px pour 992) : à recapturer.
- **Pages de détail** `/vannes/<slug>`, `/conseils/<slug>`, `/videos/<slug>` : non capturées, non relues.
- **Pages connectées** (`/profil`, `/favoris`, `/abonnement/success`, admin) et `/onboarding` (les captures montrent la page `/login`, redirection hors connexion).
- **Tablette des articles de blog** : relus 9 articles sur 34 (comment-devenir-drole en entier, 8 autres en tranche 01). Les 25 autres partagent le même gabarit (`blog/[slug]/page.tsx` + `markdown-renderer.tsx`) et n'ont pas été lus un par un. Desktop et mobile : tranche 01 relue pour les articles distincts, sauf `ne-plus-rester-muet-en-groupe`, `timing-humour-ralentir`, `raconter-blague-sans-massacrer`, `jeux-de-mots-technique-3-etapes` (redirections vers une cible déjà relue).
- **Casse « eN GROUPE »** (corrigée au rendu par `fixInvertedCase`) : aucune occurrence vue dans les tranches relues, non prouvé sur les 89 vidéos.
- **Contrastes, débordements horizontaux, cibles tactiles** : laissés à @qa (mesures automatiques).
- **Signalé au passage, hors périmètre design** : (1) `/vannes` annonce « 552 vannes supplémentaires » soit 562 au total, alors que l'accueil et `/abonnement` disent « 600+ » (project-context : ~602 actives) : à aligner sur `/api/content-stats` (règle « chiffres justes »). (2) « 0,99 EUR/mois » reste écrit ainsi dans le corps des articles (T36 non fait, déjà listé dans `a-valider-s12.md`). (3) Le nom d'auteur affiché (byline, à-propos, mentions légales) est celui d'avant la passe, conforme à l'arbitrage « auteur affiché inchangé » : aucune photo, aucune mention supplémentaire, rien à faire.

---
**Handoff → @fullstack** (correctifs), copie @qa (recapture et mesures)
- Fichier produit : `/home/user/Marrant/docs/design/verification-finale-s12.md` (aucun code modifié).
- Décisions prises : verdicts par largeur (desktop À corriger mineur, tablette À corriger, mobile À corriger mineur) ; aucune régression sur les 15 P0 d'origine ; header en mode mobile jusqu'à 1023 px (N1) ; carrousel « contenu du jour » conservé jusqu'à 1023 px (N3).
- À faire avant la bascule : N1 (P0), puis N2 à N12 (P1). N13 à N20 : P2, non bloquants.
- À trancher par Thomas : N10, partie titres d'articles (remplacer les tirets cadratins des H2/H3 par de la ponctuation, mots inchangés) ; N12 (deux conseils au titre identique : désactiver l'un ou dédoublonner à l'affichage).
- Points d'attention : après N1, recapturer 768 et 1024 sur accueil, un article, `/vannes`, `/parcours` ; après N3/N4, recapturer accueil 768 et 390 ; consigner les changements dans `REPLIT_ACTIONS.md` ; pre-commit `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build` ; règles projet respectées (aucune photo ni mention du fondateur proposée, aucun bloc / chiffre / lien à retirer, aucun tiret cadratin dans les textes proposés).
- Références marché : non consultées (vérification de correctifs, pas de nouvelle direction artistique).
