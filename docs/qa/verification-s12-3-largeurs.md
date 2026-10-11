# Vérification automatique s12 : 64 pages × 4 largeurs

> Cible : https://marrant.thomas-issa.workers.dev (préproduction Cloudflare Workers, noindex, base de test réelle)
> Date : 2026-09-29 · Agent : @qa · Mode : lecture seule (aucun formulaire soumis, aucune inscription, aucun paiement)
> Largeurs : 390×844 (mobile, isMobile + hasTouch), 768×1024 (tablette), 1024×768 (petit portable), 1440×900 (desktop)

Statut : **terminé**. Toutes les mesures sont [LIVE] (Chromium piloté par Playwright sur le site déployé, sortie observée), sauf mention [STATIQUE].

## 1. Synthèse

### Verdict global : GO pour la bascule côté affichage (0 P0), avec 6 P1 à corriger de préférence avant

- **0 P0 aux 4 largeurs** : 256 chargements (64 pages × 4), tous en HTTP 200 (9 URL redirigées comme prévu, voir section 7) ; 0 erreur JS (`pageerror` et console) ; 0 réponse 4xx/5xx du site ni des tiers ; 0 débordement horizontal (scrollWidth = innerWidth sur les 256) ; 0 élément ou texte hors écran ; 0 chevauchement de textes ; 0 image cassée ; 0 texte coupé involontairement ; header propre sur les 60 pages qui en ont un (logo sur 1 ligne aux 4 largeurs, 0 chevauchement à 768 et 1024, recherche lisible à 1024 et 1440).
- **7 parcours interactifs OK aux 4 largeurs** (section 6), avec une réserve d'accessibilité sur la modale (P1-3).
- **Correctifs design N1 à N19** : 17 réglés, N9 réglé à 1440 avec un résidu à 1024 (P2), N10 partiel (section 2).
- **6 P1** : contraste des étapes verrouillées des 3 parcours (2,99:1), tirets cadratins restants hors titres (`/conseils` et 2 réponses de FAQ), focus de la modale d'inscription, blanc sur `#8B5CF6` (4,23:1) sur 2 éléments, absence de H1 sur `/forgot-password`, bouton « Afficher le mot de passe » de 16×16 sur `/login`.
- **P2** : surtout des cibles tactiles mobiles sous 44 px (aucune bloquante), tirets cadratins dans les H2/H3 de 13 articles (arbitrage Thomas déjà ouvert), 3 H1 avec un dernier mot seul à 390.

Par largeur : **390** : 52 pages sur 64 sans P0/P1 · **768** : 54/64 · **1024** : 54/64 · **1440** : 54/64. Les P1 sont les mêmes d'une largeur à l'autre (contenus, contrastes), sauf les cibles tactiles, qui ne sont comptées qu'à 390.

### Tableau pages × largeurs

Nombre d'occurrences mesurées par cellule (une étape verrouillée = 1 occurrence de contraste, une cible tactile = 1 occurrence). Non comptés : redirections attendues, troncatures volontaires (`line-clamp`, fil d'Ariane `truncate`). Cibles tactiles comptées à 390 seulement. « OK » = aucune anomalie mesurée.

| Page | 390 | 768 | 1024 | 1440 |
|---|---|---|---|---|
| `/` | **P1 1** · P2 5 | **P1 1** | **P1 1** | **P1 1** |
| `/a-propos` | P2 5 | OK | OK | OK |
| `/abonnement` | **P1 1** · P2 3 | **P1 1** | **P1 1** | **P1 1** |
| `/anatomie-vanne` | **P1 1** · P2 7 | **P1 1** · P2 1 | **P1 1** · P2 1 | **P1 1** · P2 1 |
| `/blog` | **P1 1** · P2 4 | **P1 1** | **P1 1** | **P1 1** |
| `/blog/5-types-humour-lequel-pour-toi` | P2 10 | P2 1 | P2 1 | P2 1 |
| `/blog/apprendre-la-repartie-methode-30-jours` | P2 9 | OK | OK | OK |
| `/blog/autoderision-interactions` | P2 9 | OK | OK | OK |
| `/blog/avoir-confiance-en-soi-grace-a-l-humour` | P2 9 | OK | OK | OK |
| `/blog/blague-courte-arme-secrete-humour` | P2 9 | OK | OK | OK |
| `/blog/blague-drole-7-criteres-pepite` | P2 9 | OK | OK | OK |
| `/blog/blagues-courtes-vs-longues` | P2 9 | OK | OK | OK |
| `/blog/blagues-travail-faire-rire-pro` | P2 10 | P2 1 | P2 1 | P2 1 |
| `/blog/citation-drole` | P2 9 | OK | OK | OK |
| `/blog/comment-avoir-de-la-repartie` | P2 9 | OK | OK | OK |
| `/blog/comment-devenir-drole` | P2 10 | P2 1 | P2 1 | P2 1 |
| `/blog/comment-faire-rire-un-homme` | P2 10 | P2 1 | P2 1 | P2 1 |
| `/blog/comment-faire-rire-une-fille` | P2 10 | P2 1 | P2 1 | P2 1 |
| `/blog/comment-improviser-des-blagues` | P2 9 | OK | OK | OK |
| `/blog/comment-raconter-une-blague-sans-la-rater` | P2 9 | OK | OK | OK |
| `/blog/confiance-humour-apres-rupture` | P2 9 | OK | OK | OK |
| `/blog/conversation-machine-a-cafe` | P2 10 | P2 1 | P2 1 | P2 1 |
| `/blog/erreurs-blagues` | P2 9 | OK | OK | OK |
| `/blog/etre-plus-a-l-aise-en-societe` | P2 9 | OK | OK | OK |
| `/blog/exercices-developper-humour` | P2 9 | OK | OK | OK |
| `/blog/humour-apres-rupture` | P2 9 | OK | OK | OK |
| `/blog/humour-noir-utiliser-sans-blesser` | P2 9 | OK | OK | OK |
| `/blog/humour-quotidien-8-habitudes` | P2 9 | OK | OK | OK |
| `/blog/jamais-quoi-repondre-techniques` | P2 10 | P2 1 | P2 1 | P2 1 |
| `/blog/je-ne-sais-jamais-quoi-repondre` | P2 10 | P2 1 | P2 1 | P2 1 |
| `/blog/je-suis-pas-drole-comment-changer` | P2 9 | OK | OK | OK |
| `/blog/jeu-de-mots-drole-techniques-creer` | P2 9 | OK | OK | OK |
| `/blog/jeux-de-mots-technique-3-etapes` | P2 9 | OK | OK | OK |
| `/blog/meilleures-blagues-droles-2026` | P2 9 | OK | OK | OK |
| `/blog/ne-plus-rester-muet-en-groupe` | P2 10 | P2 1 | P2 1 | P2 1 |
| `/blog/phrases-droles-conversations` | P2 9 | OK | OK | OK |
| `/blog/pourquoi-blagues-marchent-pas` | P2 10 | P2 1 | P2 1 | P2 1 |
| `/blog/raconter-blague-sans-massacrer` | P2 9 | OK | OK | OK |
| `/blog/repartie-debutant-5-etapes` | P2 10 | P2 1 | P2 1 | P2 1 |
| `/blog/repartie-soiree-anti-malaise` | P2 10 | P2 1 | P2 1 | P2 1 |
| `/blog/repondre-moqueries-avec-humour` | P2 10 | P2 1 | P2 1 | P2 1 |
| `/blog/rester-muet-en-groupe` | P2 10 | P2 1 | P2 1 | P2 1 |
| `/blog/storytelling-drole-5-structures` | P2 9 | OK | OK | OK |
| `/blog/techniques-humoristes-pros` | P2 9 | OK | OK | OK |
| `/blog/timidite-et-humour` | P2 10 | P2 1 | P2 1 | P2 1 |
| `/blog/timing-humour` | P2 9 | OK | OK | OK |
| `/blog/timing-humour-ralentir` | P2 9 | OK | OK | OK |
| `/cgu` | P2 4 | OK | OK | OK |
| `/confidentialite` | P2 4 | OK | OK | OK |
| `/conseils` | **P1 1** · P2 4 | **P1 1** | **P1 1** | **P1 1** |
| `/forgot-password` | **P1 1** · P2 5 | **P1 1** | **P1 1** | **P1 1** |
| `/glossaire` | P2 16 | OK | P2 1 | OK |
| `/login` | **P1 1** · P2 9 | OK | OK | OK |
| `/mentions-legales` | P2 3 | OK | OK | OK |
| `/onboarding` | **P1 1** · P2 9 | OK | OK | OK |
| `/parcours` | **P1 1** · P2 4 | **P1 1** | **P1 1** | **P1 1** |
| `/parcours/confiance` | **P1 15** · P2 5 | **P1 15** | **P1 15** | **P1 15** |
| `/parcours/machine-a-cafe` | **P1 6** · P2 5 | **P1 6** | **P1 6** | **P1 6** |
| `/parcours/repartie` | **P1 9** · P2 5 | **P1 9** | **P1 9** | **P1 9** |
| `/quiz-humour` | P2 7 | OK | OK | OK |
| `/register` | P2 10 | OK | OK | OK |
| `/retractation` | P2 7 | OK | OK | OK |
| `/vannes` | P2 4 | OK | OK | OK |
| `/videos` | P2 4 | OK | OK | OK |

## 2. Vérification des correctifs design N1 à N19

Source : `docs/design/verification-finale-s12.md`. Mesures [LIVE] sur le site déployé, aux 4 largeurs (sonde `nprobe.js`, 20 pages × 4 largeurs, et sondes ciblées avec captures).

| # | Constat design | Statut | Mesure sur le site déployé |
|---|---|---|---|
| N1 | Header tablette cassé | **réglé** | 768 : header en mode mobile (bouton Menu 44×44 visible, nav desktop masquée). 1024 : logo sur 1 ligne (188 px), recherche 176 px (placeholder 87 px pour 122 px utiles), 0 chevauchement logo/nav/recherche/bouton, écart mini 4 px entre 2 onglets. Résultat étendu aux 64 pages en section 1 |
| N2 | « Découvrir les techniques » déborde (768) | **réglé** | 768 : bouton 179×51 sur 2 lignes, texte à ≥ 1 px des bords ; 390 : 1 ligne, 44 px ; 1024 et 1440 : 1 ligne, 32 px |
| N3 | Badge « École & E » coupé (768) | **réglé** | 768 : carrousel (`display:flex`, `align-items:flex-start`), 0 badge coupé sur les 3 cartes ; grille à partir de 1024 |
| N4 | Carte vanne étirée (390) | **réglé** | 390 : `align-items:flex-start`, vide sous le contenu = 1 px sur chacune des 3 cartes (hauteurs 300 / 839 / 515 px) |
| N5 | « Voir les vannes gratuites » sur 2 lignes | **réglé** | 1 ligne, 48 px, aux 4 largeurs |
| N6 | « 99 / € » cassé (390) | **réglé** | 390 : « 99 € / séance » sur une ligne (129 px) ; « Coaching individuel » passe sur 2 lignes (167 px de large), sans chevauchement (capture `n6_390.png` relue) |
| N7 | Bouton « Crée ton compte gratuit pour valider l'étape » (390) | **réglé** | 390 : 2 lignes dans 55 px, 9 px de marge haut et bas (3 parcours) ; 1 ligne, 40 px à partir de 768 |
| N8 | « l'autre ?Réponse » (390) | **réglé** | Chaîne « ?Réponse » absente aux 4 largeurs |
| N9 | Index du glossaire coupé (1440) | **réglé à 1440**, résiduel à 1024 (P2-4) | 1440 : 12 termes tiennent (scrollWidth = clientWidth = 1248). 1024 : liste défilante coupée au milieu de « Accusé de réception » (879 à 1032 px, conteneur jusqu'à 1008 px), sans dégradé ni flèche |
| N10 | Tirets cadratins visibles | **partiel** (P1-2, P2-1) | Réglé sur `/parcours`, `/parcours/*` (0 hors titres), `/a-propos` (0). Restent : un paragraphe de `/conseils`, 2 réponses de FAQ (`lib/faqs.ts`) et les H2/H3 d'articles (arbitrage Thomas ouvert) |
| N11 | « »pas de moutarde« . » | **réglé** | Forme inversée absente ; le texte affiché est « il dit “pas de moutarde”. Ah » (guillemets anglais, voir P2-6) |
| N12 | 2 conseils au même titre | **réglé** | `/conseils` : 3 cartes, 0 titre en double aux 4 largeurs |
| N13 | Carte vanne décalée vers le bas | **réglé** | 1440 : environ 29 px au-dessus des badges (rangée alignée sur les boutons d'icône de 32 px) contre 54 px avant, 16 px sur les côtés (lu sur `n13_vannes_1440.png`, ±2 px) |
| N14 | Pastilles du hero indistinctes | **réglé** | 3 liens sur fond `#2a2a2a`, 2 pastilles descriptives sur fond transparent ; « Voir les vannes gratuites » souligné |
| N15 | « stand- / up » | **réglé** | 0 occurrence coupée, toutes les occurrences de « stand-up », 4 largeurs |
| N16 | « · » orphelin sur `/parcours` (390) | **réglé** | 390 : lignes « Débutant → Intermédiaire / 3 semaines / 15 min/semaine / 225 XP à gagner », aucune ne commence par « · » |
| N17 | Logo des cartes auth sans « .fr » | **réglé** | « deviens-marrant.fr » sur `/login`, `/register`, `/forgot-password` |
| N18 | Cartes pleine largeur (glossaire, conseils) | **réglé** | 1440 : cartes de 896 px (glossaire, texte 768 px ; conseils, texte 636 px) |
| N19 | Guillemets droits dans le quiz de parcours | **réglé** | 0 chaîne entre apostrophes droites dans le texte rendu des 3 parcours (accordéons ouverts). Même défaut trouvé ailleurs, sur `/conseils` (P2-6) |

Bilan : 17 réglés, 1 réglé avec un résidu à 1024 (N9), 1 partiel (N10).

## 3. Problèmes P0

**Aucun.** Contrôles à zéro sur les 256 chargements : erreurs JS, réponses 4xx/5xx, débordement horizontal, éléments hors écran, chevauchements de textes, images cassées, textes coupés involontairement, header à 768 et 1024 (logo sur une ligne, 0 chevauchement de rectangles entre logo, onglets, recherche et boutons, rangée du header sans défilement).

## 4. Problèmes P1

Chemins relatifs à `apps/web/src/`. Aucune ligne de code modifiée : les corrections sont à faire par @fullstack.

**P1-1. Étapes verrouillées des parcours illisibles (contraste 2,99:1)**
- Pages : `/parcours/confiance`, `/parcours/machine-a-cafe`, `/parcours/repartie` · largeurs : 390, 768, 1024, 1440.
- Éléments : titres d'étape `h3.font-display.font-bold.text-base.text-text-muted` (« Rire de toi sans te rabaisser », « Le rythme et les silences »…) et `span.text-xs.text-text-muted` (« + 75 XP », « Termine l'étape 1 pour débloquer »…). 10 titres et 20 mentions par largeur.
- Mesure : `#9A9A9A` à opacité 0,6 sur `#1F1F1F` = **2,99:1** (4,5:1 requis). Sans l'opacité, le même gris donne 5,86:1.
- Source probable : `components/parcours/parcours-detail.tsx:500` (`"opacity-60"` posé sur l'étape verrouillée). « Termine l'étape N pour débloquer » est une consigne : l'exemption WCAG des composants inactifs ne la couvre pas.

**P1-2. Tirets cadratins visibles hors titres (règle 12)**
- `/conseils` (4 largeurs), 2 occurrences dans `p.max-w-[72ch].text-sm` : « … ne te défends pas — complimente-le sur son 'expertise' … ». Source : contenu en base, rendu brut par `components/conseils/conseils-list.tsx:258` (`{tip.content}`, sans `stripEmDashes`).
- `/`, `/abonnement`, `/parcours` (4 largeurs), 2 réponses de FAQ repliées, visibles à l'ouverture : « … que tout le monde rie — y compris la personne qui t'a lancé la remarque » et « Tout le monde a un sens de l'humour — il est peut-être juste en sommeil ». Source : `lib/faqs.ts:25` et `:41`, rendues par `components/home/faq-section.tsx:47` (`{faq.answer}`, sans `stripEmDashes`).
- Réglé ailleurs : `/parcours`, `/parcours/*`, `/a-propos` n'ont plus aucun tiret hors titres.

**P1-3. Modale d'inscription : le focus reste sur la page derrière**
- Page : `/` (CTA « Créer mon compte gratuit » du hero) · largeurs : 390, 768, 1024, 1440.
- Mesure : après ouverture, `document.activeElement` reste le CTA « Créer mon compte gratuit » (à 300 ms et à 1 200 ms) ; 12 appuis sur Tab sur 12 atterrissent **hors** de la modale (« Voir les vannes gratuites », « Avoir de la répartie », « Révéler la chute »…). La modale a bien `role="dialog"` et `aria-modal="true"` ; Échap et « Fermer » fonctionnent, et le focus revient au CTA.
- Source probable : `components/ui/modal.tsx:21-28` (seul Échap est géré : pas de focus initial ni de piège à focus). Impact : navigation clavier et lecteur d'écran (WCAG 2.4.3). Mesuré sur le CTA du hero ; toutes les ouvertures qui passent par `Modal` sont probablement concernées [STATIQUE].

**P1-4. Texte blanc sur `#8B5CF6` (4,23:1)**
- `/blog` (4 largeurs) : pastille active « Tous », 14 px normal. Source : `app/(dashboard)/blog/blog-list-client.tsx:41` et `:53` (`bg-accent-primary text-white`).
- `/anatomie-vanne` (4 largeurs) : bouton « Voir des vannes en action », 14 px, graisse 600. Source : `app/(dashboard)/anatomie-vanne/page.tsx:376`.
- Mesure : blanc sur `#8B5CF6` = **4,23:1** (4,5:1 requis). Le bouton primaire du design system (`button.tsx:11`, `#7C3AED`) donne 5,70:1.
- [STATIQUE] Même couple de couleurs, non mesuré car ces éléments n'apparaissent qu'après une interaction : onglet actif de la modale (`components/auth/auth-modal.tsx:208`, `:220`), `components/home/upcoming-features.tsx:209`, `components/parcours/parcours-detail.tsx:527`, `components/vannes/vanne-share-row.tsx:78`, `components/ui/toast.tsx:66`, `components/ui/xp-notification.tsx:46`.

**P1-5. `/forgot-password` sans H1**
- 4 largeurs : 0 `h1` dans la page. Le titre « Mot de passe oublié » est rendu en `h3` par `CardTitle` (`components/ui/card.tsx:29-33`, appelé dans `app/(auth)/forgot-password/page.tsx:49`). `/login` et `/register` ont bien 1 H1.

**P1-6. `/login` : bouton « Afficher le mot de passe » de 16×16 px**
- 390 (également sur `/onboarding`, qui redirige vers `/login` hors connexion). C'est la 2e plus petite cible mesurée.
- Source : `app/(auth)/login/page.tsx:152-156` (`absolute right-3 …`, sans taille). La même commande fait 44×44 sur `/register` (`app/(auth)/register/page.tsx:186`, `h-11 w-11`).

## 5. Problèmes P2

**P2-1. Tirets cadratins dans les H2/H3 d'articles (arbitrage Thomas ouvert, `a-valider-s12.md`)**
- 58 titres sur 15 URL, soit 13 articles distincts (2 URL redirigent vers un autre article de la liste), aux 4 largeurs : `5-types-humour-lequel-pour-toi`, `blagues-travail-faire-rire-pro`, `comment-devenir-drole` (H3 « Pilier 1 : L'observation — Voir ce que les autres ignorent », etc.), `comment-faire-rire-un-homme`, `comment-faire-rire-une-fille`, `conversation-machine-a-cafe`, `jamais-quoi-repondre-techniques` (+ `je-ne-sais-jamais-quoi-repondre`), `rester-muet-en-groupe` (+ `ne-plus-rester-muet-en-groupe`), `pourquoi-blagues-marchent-pas`, `repartie-debutant-5-etapes`, `repartie-soiree-anti-malaise`, `repondre-moqueries-avec-humour`, `timidite-et-humour`.
- Source : `components/ui/markdown-renderer.tsx:132` (titres non passés par `stripEmDashes`), `lib/em-dash.ts:53` (`HEADING_RE` exclut les titres).

**P2-2. Cibles tactiles sous 44×44 px à 390 (hors liens dans un paragraphe)**

Nombre par page (cibles < 44 px / cibles mesurées) : `/` 5/66 · `/a-propos` 4/23 · `/abonnement` 3/31 · `/anatomie-vanne` 6/28 · `/blog` 4/62 · 42 articles 9/34 à 9/36 · `/cgu`, `/confidentialite`, `/mentions-legales` 3/21 · `/conseils` 4/36 · `/forgot-password` 5/6 · `/glossaire` 16/50 · `/login` et `/onboarding` 10/11 · `/parcours`, `/videos` 4/45 · `/parcours/*` 5/31 · `/quiz-humour` 7/30 · `/register` 10/12 · `/retractation` 7/28 · `/vannes` 4/72.

Les 5 pires : case à cocher de la newsletter **13×16** (42 articles) · « Afficher le mot de passe » **16×16** (`/login`, P1-6) · fil d'Ariane « Blog » **30×17** (42 articles) · fil d'Ariane « Accueil » **49×17** (52 pages) · fil d'Ariane « Parcours » **59×17** (3 parcours).

| Groupe | Mesure | Pages | Source probable |
|---|---|---|---|
| Liens du fil d'Ariane | 17 px de haut | 52 | `className="hover:text-text-primary"` en ligne, ex. `components/parcours/parcours-detail.tsx:411-413`, `app/(dashboard)/videos/page.tsx`, `vannes/page.tsx`, `blog/[slug]/page.tsx:199` |
| Case de consentement newsletter | 13×16 (le label associé reste cliquable, ce qui limite l'impact) | 42 articles | `components/newsletter/newsletter-inline.tsx:142` |
| Champ email et « Je m'inscris » de la newsletter | 308×35 à 324×40, et 308×40 | 42 à 46 | `newsletter-inline.tsx` |
| Logo du header | 188×28 | 60 | `components/layout/header.tsx:59` |
| Liens du pied de page « Blog », « CGU » | 30×44, 31×44 (hauteur conforme, largeur trop faible) | 60 | `components/layout/footer.tsx:99` |
| Lien vers le parcours en fin d'article | 38 px de haut | 42 articles | `components/blog/blog-article-parcours-maillage.tsx:177` (`py-2`) |
| Liens « … → » sous les termes du glossaire | 20 px de haut (8 liens) | `/glossaire` | `app/(dashboard)/glossaire/page.tsx:187` |
| Liens texte des pages auth (« Inscris-toi », « Mot de passe oublié ? », « Retour à la connexion »), boutons | 17 px ; boutons de 40 px | auth | `app/(auth)/*/page.tsx` |
| Réactions 🔥 / 💀 | 50×24, 51×24 | `/` | `components/ui/reaction-buttons.tsx` (appelé dans `components/home/daily-content.tsx`) |
| Questions de FAQ | 358×26 (3) | `/anatomie-vanne` | `app/(dashboard)/anatomie-vanne/page.tsx` (`summary`) |
| Modale d'inscription | « Fermer » 40×40, onglets de 36 px, champs et bouton de 40 px | modale | `components/ui/modal.tsx:60`, `components/auth/auth-modal.tsx` |
| « Voir ce parcours » (résultat du quiz) | 32 px de haut à 768, 1024 et 1440 (44 px à 390) | `/parcours` | `components/parcours/parcours-content.tsx:93` |

**P2-3. H1 : dernier mot seul sur sa ligne, à 390 uniquement**
- `/a-propos` : « À propos de / deviens-marrant.fr » (`app/(dashboard)/a-propos/page.tsx:62`) ; `/cgu` : « Conditions Générales / d'Utilisation » (`cgu/page.tsx:11`) ; `/confidentialite` : « Politique de / confidentialité » (`confidentialite/page.tsx:11`).
- Nombre de lignes des H1 (390 / 768 / 1024 / 1440) : 1/1/1/1 sur 6 pages ; 2/1/1/1 sur 32 pages ; 2/2/1/1 sur 3 articles ; 2/2/2/2 sur `/` et `/register` ; 3/2/1/1 sur `/blog`, `/conseils`, `/vannes` ; 3/2/2/2 sur 15 articles et `/videos` ; 3/2/2/1 sur `/glossaire` ; 0 H1 sur `/forgot-password` (P1-5). Jamais plus de 3 lignes ; 0 page avec plusieurs H1 visibles. Aucun autre dernier mot seul aux 4 largeurs.

**P2-4. Index du glossaire coupé au milieu d'un mot à 1024 (résidu de N9)**
- 1024 : liste défilante de 16 à 1008 px, « Accusé de réception » va de 879 à 1032 px, donc coupé ; aucun dégradé ni flèche (`mask-image: none`). À 768 et 390, même liste défilante, utilisable au doigt. Source : `app/(dashboard)/glossaire/page.tsx:158-163`.

**P2-5. Symbole « ✗ » en `#EF4444` sur `#1F1F1F` : 4,38:1**
- `/anatomie-vanne`, 4 largeurs, symbole placé à côté d'un texte lisible. Source : `app/(dashboard)/anatomie-vanne/page.tsx:350`.

**P2-6. Typographie des guillemets**
- `/conseils` (4 largeurs), apostrophes droites : 'preuves', 'expertise', 'talent', 'œil artistique', 'celui qui reconnaît les compétences'. Contenu en base, rendu par `components/conseils/conseils-list.tsx:258`.
- Article `comment-raconter-une-blague-sans-la-rater` : « il dit “pas de moutarde”. Ah » (guillemets anglais au lieu de « »). Source : `lib/blog-articles.ts:1071`.

## 6. Parcours interactifs

[LIVE], script `flows.mjs`, 7 parcours × 4 largeurs, sans rien soumettre. 0 `pageerror`, 0 erreur console sur l'ensemble.

| Parcours | 390 | 768 | 1024 | 1440 | Mesure |
|---|---|---|---|---|---|
| Menu burger ouvert / fermé | OK | OK | n/a (nav desktop) | n/a | Bouton 44×44 cliquable ; `aria-expanded` passe de true à false ; 7 liens visibles, tous cliquables et dans l'écran ; 0 débordement |
| Modale « Créer mon compte gratuit » | OK, avec réserve | OK, avec réserve | OK, avec réserve | OK, avec réserve | S'ouvre et se ferme (Échap et bouton Fermer), focus rendu au CTA, 9 contrôles cliquables et visibles, 0 débordement. **Réserve P1-3** : focus non placé dans la modale et Tab qui sort vers la page |
| FAQ dépliée (accueil) | OK | OK | OK | OK | `summary` 44 px de haut, `open=true`, contenu de 107 à 221 px de haut |
| Filtre de catégorie du blog | OK | OK | OK | OK | 11 pastilles de 44 px ; « Autodérision » : URL `/blog?category=AUTODERISION`, 25 articles puis 1, pastille active |
| « Révéler la chute » (`/vannes`) | OK | OK | OK | OK | Bouton 132×44, carte de 136 à 179 caractères, focus placé sur la chute |
| Quiz d'orientation (`/parcours`) | OK | OK | OK | OK | Options de 54 à 66 px, cliquables ; 2 questions puis résultat affiché ; clic sur « Voir ce parcours » : reste sur `/parcours`, aucune modale, aucune erreur (position d'arrivée non mesurée). Ce bouton fait 32 px de haut à partir de 768 (44 px à 390) |
| Index du glossaire (clic sur « Storytelling ») | OK | OK | OK | OK | 12 termes ; hash `#storytelling` ; titre à 153 px du haut, sous l'index collant (bas à 117 px) et le header (bas à 65 px) : rien n'est masqué |

## 7. Méthode et limites

**Outillage** : Chromium (`/opt/pw-browsers/chromium`) piloté par Playwright, via le proxy, `locale fr-FR`. 390×844 : `isMobile` + `hasTouch`, DPR 2, user agent Android. 768×1024, 1024×768 et 1440×900 : contexte desktop. 4 pages en parallèle, timeout de navigation 45 s, puis `networkidle` (15 s au plus), défilement complet de la page (chargements paresseux) et 1,5 s d'attente avant mesure. Scripts et sorties hors dépôt, dans `scratchpad/qa-final/` : `run.mjs` + `inpage.js` (script de la tentative précédente, repris) + `extra.js` (header, tirets cadratins), `analyze.mjs`, `nprobe.js` / `nrun.mjs` (N1 à N19), `flows.mjs`, `focus.mjs`, `precise.mjs`, `conseils.mjs` ; données `results.json`, `issues.json`, `agg.txt`, `nprobe.json`, `flows.json` ; captures `n6_390.png`, `n9_1024.png`, `n13_vannes_1440.png`, `flows/*.png`, toutes relues.

**Règles de mesure**
- Réseau : ressources du site en 4xx/5xx ou en échec, en ignorant les préchargements `?_rsc=` et `/api/auth/session` interrompus. Tiers : 0 erreur.
- Débordement : `scrollWidth > innerWidth`, et éléments ou textes au-delà du viewport, hors conteneurs `overflow-x: auto/scroll` volontaires et tiroirs `fixed` fermés.
- Chevauchement : rectangles de ligne des nœuds texte directs d'éléments différents, recouvrement ≥ 25 % de la plus petite surface (le parent et l'enfant ne partagent pas de nœud texte, donc pas de faux positif de ce type).
- Contraste : **tous** les textes visibles, pas un échantillon (9 271 à 9 770 textes par largeur). Le fond est recomposé à partir de la pile `elementsFromPoint` (fonds semi-transparents, dégradés au pire arrêt, opacité cumulée). Seuils : 4,5:1, ou 3:1 pour un texte ≥ 24 px ou ≥ 18,66 px en gras. Non mesurés : 126 textes en dégradé par largeur (logos `text-gradient` du header et du pied de page, environ 2 par page), 10 à 11 textes par largeur jamais dégagés d'un calque (`/vannes`, `/conseils`, `/`).
- Cibles tactiles : liens, boutons, champs, `summary`, onglets, `label[for]` visibles ; liens en ligne dans un paragraphe exclus ; comptées à 390.
- Texte coupé : `overflow` hidden/clip avec `scrollWidth`/`scrollHeight` supérieur à la boîte, ou texte qui dépasse sa boîte. Les `line-clamp` et `text-overflow: ellipsis` sont classés volontaires : extraits de conseils (4 lignes), descriptions de vidéos (2 lignes), titres d'articles liés (2 lignes, à partir de 768), fil d'Ariane des articles (`truncate`, 390), titre de vidéo « Ahmed Sparrow - Piétons vs Automobilistes » (2 lignes, 1024 seulement).
- Tirets cadratins : nœuds texte visibles hors `h1-h3`, y compris le contenu replié dans des `<details>` (marqué « replié ») ; titres comptés à part.
- H1 : lignes comptées par position des mots ; orphelin = dernière ligne d'un seul mot.

**Redirections constatées (attendues)** : `/blog/apprendre-la-repartie-methode-30-jours` → `comment-avoir-de-la-repartie`, `blagues-courtes-vs-longues` → `blague-courte-arme-secrete-humour`, `humour-apres-rupture` → `confiance-humour-apres-rupture`, `jeux-de-mots-technique-3-etapes` → `jeu-de-mots-drole-techniques-creer`, `je-ne-sais-jamais-quoi-repondre` → `jamais-quoi-repondre-techniques`, `raconter-blague-sans-massacrer` → `comment-raconter-une-blague-sans-la-rater`, `ne-plus-rester-muet-en-groupe` → `rester-muet-en-groupe`, `timing-humour-ralentir` → `timing-humour` ; `/onboarding` → `/login?callbackUrl=…` (non connecté). Les lignes de ces URL dans le tableau mesurent donc la page cible.

**Limites (non vérifié)**
- Chromium uniquement : Safari/WebKit (iPhone réel) et Firefox non testés.
- 768 mesuré sans `hasTouch` : cibles tactiles comptées à 390 seulement.
- Pas d'axe-core ni de pixel-diff. La relecture visuelle page par page est celle de @design (`verification-finale-s12.md`) ; ici, seules les captures ciblées ont été relues.
- États non mesurés : survol, `focus-visible`, `PremiumModal`, toasts, recherche mobile ouverte, écran de résultat de `/quiz-humour`, feedback du mini-quiz de parcours.
- Hors des 64 pages : pages connectées (`/profil`, `/favoris`, onboarding réel), détails `/vannes/<slug>`, `/conseils/<slug>`, `/videos/<slug>`.
- Hors périmètre, relevé au passage dans le texte des bannières : « 552 vannes supplémentaires », « 369 conseils supplémentaires », « 86 vidéos supplémentaires » (cohérence avec « 600+ » déjà signalée par @design).

---
**Handoff → @orchestrator** (copie @fullstack pour les correctifs)
- Fichier produit : `/home/user/Marrant/docs/qa/verification-s12-3-largeurs.md`. Aucun code modifié, pas de git, aucun formulaire soumis.
- Décisions prises : 4 largeurs (390 mobile tactile, 768, 1024, 1440) ; P0 = casse, erreur, débordement, illisible ; P1 = contraste AA non atteint sur du texte informatif, règle 12 hors titres, accessibilité clavier, H1 absent, cible < 24 px isolée ; P2 = cibles de 24 à 43 px ou compensées par un label, titres d'articles en attente d'arbitrage, orphelins.
- Verdict : **GO pour la bascule côté affichage** (0 P0 aux 4 largeurs, 7 parcours OK). À corriger de préférence avant : P1-1 à P1-6 (quelques lignes chacun, sources indiquées).
- Validations : tout est [LIVE] sur https://marrant.thomas-issa.workers.dev, sauf la liste des autres usages de `bg-accent-primary text-white` (P1-4) et l'extension de P1-3 à toutes les modales, qui sont [STATIQUE] (Grep).
- À trancher par Thomas : P2-1 (tirets dans les H2/H3 des 13 articles, déjà dans `a-valider-s12.md`).
- Après correctifs : relancer `run.mjs` puis `analyze.mjs` (environ 35 min) et `focus.mjs` ; consigner dans `REPLIT_ACTIONS.md`.
