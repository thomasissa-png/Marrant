# Implémentation s17, lot C (entrées et maillage) : rapport @fullstack

Statut : FAIT (07/10/2026). Rien commité, rien déployé, pas de `npm run build`.

## Recos traitées

- **Reco 14 / SEO-06 / QA-13 (articles)** : encart et CTA mènent à l'**étape 1** (`/parcours/<slug>?src=blog#etape-1`). Règle unique `resolveArticleParcours` (slug imposé `FORTE_FRAPPE_PARCOURS` > cluster > Répartie), utilisée par l'encart ET le CTA (sans `parcoursHref` dédié dans `config/blog-cta.ts`) : retour après paiement vers ce même parcours, plus vers la liste. Abonné : « Continuer mon parcours » vers l'étape à reprendre, sinon étape 1 du parcours de l'article. Fichiers : `components/blog/{blog-article-parcours-maillage,article-cta,blog-article-view}.tsx`.
- **Reco 14 / SEO-06 (fiches)** : bloc « Dans un parcours » (`components/entrees-parcours/fiche-parcours-lien.tsx`, serveur, ISR) sur vannes, conseils, vidéos, lien étape 1 `?src=fiche`. Résolution `lib/entrees-parcours-fiches.ts` : vidéos et vannes via `parcours-seed.json` (vanne retrouvée par son texte dans `blagues-seed.json`, versions précédentes comprises) ; conseils via `LearningPathStep` en base (id ou titre identique, parcours inactifs exclus, base KO = pas de bloc). Aucun parcours = aucun bloc.
- **Reco 14 / UX-08 (accueil)** : seul le lien secondaire du visiteur change : « Lire gratuitement l'étape 1 » vers Machine à Café étape 1. L'étalon 1.2 (bouton, note prix) est intact. Pastilles : étape 1 + `?src=accueil`.
- **Reco 5 / UX-03 (Reprendre)** : `components/home/reprendre-parcours.tsx` + `hooks/use-parcours-a-reprendre.ts`. En tête des CTA de l'accueil abonné et en haut du profil. Premium seulement ; visiteur : aucun rendu, aucune requête. `GET /api/user/progress` renvoie en plus `nextStepOrder` et `startedAt` (ajout, format existant inchangé). Choix : parcours non terminé le plus avancé, puis le plus récent.
- **Rappel e-mail (D7, legal C1)** : `app/(dashboard)/profil/rappel-parcours-toggle.tsx`. Case décochée par défaut, Premium en session ET `eligible` serveur, texte exact `RAPPEL_PARCOURS_CONSENTEMENT` (source lot A, version enregistrée côté serveur), choix du jour (1 à 7), décocher = arrêt. Branché sur l'API réelle du lot A (`/api/user/rappel-parcours`, `{enabled, weekday}`).
- **Confidentialité (legal §4)** : P1 à P8 mot pour mot (`&apos;`), SAUF la dernière phrase de P7 (25 mois, en attente de la purge Umami C12), laissée en commentaire. « Dernière mise à jour : 7 octobre 2026 » (déjà à cette date). Sitemap : `CONFIDENTIALITE_LASTMOD = 2026-10-07`.
- **QA-13 (quiz d'humour)** : `recommendedParcours` par profil (Observateur → Confiance, Storyteller et Absurde → Machine à Café, Punchlineur et Taquin → Répartie), encart « Ton point de départ », bouton étape 1 `?src=quiz`, retour paiement vers ce parcours. `[HYPOTHÈSE : correspondance profil → parcours, à valider par @product-manager]`. Onboarding : étape 1 `?src=onboarding`.
- **QA-13 (/abonnement)** : bloc « Pas encore sûr ? Lis d'abord une étape » : étape 1 du parcours de `returnTo` s'il y en a un, sinon les 3 (`?src=abonnement`). Promesse « ses vannes » de `premium-benefits.tsx` gardée telle quelle (lot B les affiche dans l'étape).
- **SEO-08 (llms-full)** : section « Programme des parcours » (`lib/llms-parcours.ts`) : titre, durée, niveau, public, objectif, titre et objectif de chaque étape, « première étape gratuite » + lien `#etape-1`. Rien de payant. `llms-content.ts` : « (streaks, XP) » remplacé par « avec Premium… XP à chaque étape validée, série des jours de pratique ».
- **SEO-07 (sitemap)** : `lib/sitemap-parcours.ts` : lastmod de chaque parcours = la plus récente entre `PARCOURS_PAGES_LASTMOD` (2026-10-07) et la base (`LearningPath.updatedAt`, `Tip.updatedAt` des étapes) ; `/parcours` = la plus récente des 3.
- **PM-12 / UX-04 (FAQ, `lib/faqs.ts`)** : streaks remplacés par la série telle qu'elle fonctionne ; « 5 minutes chaque jour valent mieux… » remplacé par les deux rythmes. « 8 semaines » et « 50 XP par semaine » intacts.

## Tests ajoutés et résultats

- Nouveaux : `__tests__/feature/entrees-parcours-s17.test.tsx` (18) et `entrees-parcours-s17-ui.test.tsx` (11) : liens étape 1, reprise (parcours de 4 et 6 étapes, terminé exclu, visiteur sans requête), fiches (vidéo dans 2 parcours, vanne par texte, conseil inactif), règle article, quiz (les 3 parcours couverts), lastmod, llms (jamais « cours gratuit »), rappel (visiteur, non éligible, décoché, POST `{enabled:true, weekday:3}`), /abonnement visiteur, P1-P8 sans « 25 mois ».
- Mis à jour : hero-section, blog-article-parcours-maillage, blog-article-cta-position, blog-article-tracking, humor-quiz, viral-quiz, faq-section.
- `npx tsc --noEmit -p tsconfig.build.json` : 0 erreur. ESLint sur les 29 fichiers du lot : 0 erreur, 0 avertissement.
- Jest complet : 242 suites OK ; 6 en échec, toutes en zone lot B en cours (parcours-list, parcours-detail, parcours-user-simulation, parcours-by-slug-premium, attribution, premium-offer : `?src=hub`, `moduleDetail` en aperçu, `ATTRIBUTED_EVENTS`), aucune liée au lot C.

## Textes provisoires (`config/textes/entrees-parcours.ts`, `// PROVISOIRE s17, étalon à valider`)

- `ACCUEIL_LIEN_ETAPE_1` : « Lire gratuitement l'étape 1 »
- `REPRENDRE` : « Reprendre ton parcours » / « {Parcours X} : étape N sur T. » / « Reprendre l'étape N »
- `FICHE_PARCOURS` : « Dans un parcours » / « Cette vanne fait partie de l'étape N du parcours X. » / « Ce conseil est l'étape N du parcours X. » / « Cette vidéo est travaillée dans l'étape N du parcours X. » / « Lire gratuitement l'étape 1 du parcours X »
- `QUIZ_HUMOUR_PARCOURS` : « Ton point de départ : », « Parcours X », 5 raisons (une par profil), « Lire gratuitement l'étape 1 »
- `ABONNEMENT_ETAPE_1` : « Pas encore sûr ? Lis d'abord une étape » / « La première étape de chaque parcours est en lecture libre, sans compte. » / « Étape 1 du parcours X »
- `FAQ_SERIE_XP` : « Avec Premium, tes XP montent à chaque étape validée et ta série compte les jours où tu pratiques (une étape validée, un quiz d'étape terminé). Le rythme conseillé : une étape par semaine, de quoi tenir sur la durée. »
- `FAQ_REGULARITE` : « L'important, c'est la régularité : dans un parcours, une étape par semaine ; à côté, le contenu du jour te prend 5 minutes. »
- `RAPPEL_PARCOURS_UI` : « Rappel de parcours », « Jour du rappel », « C'est noté. », « On n'a pas pu enregistrer ton choix. Réessaie dans un instant. »

## Actions prod

- Aucune migration ni variable d'environnement côté lot C. `REPLIT_ACTIONS.md` : à compléter par l'orchestrateur au commit.
- Si la mise en ligne n'a pas lieu le 07/10 : passer `PARCOURS_PAGES_LASTMOD` (`lib/sitemap-parcours.ts`) et `CONFIDENTIALITE_LASTMOD` (`app/sitemap.ts`) ainsi que « Dernière mise à jour » de /confidentialite à la date réelle.
- Legal C16 : P1 à P8 doivent partir dans le même commit que le rappel (lot A) et les événements (lot B).

## Demandes aux autres lots

- **Lot B** : (1) ajouter `quiz`, `fiche`, `abonnement`, `profil` à la liste blanche `src` de `parcours-ouvert`, sinon comptés `direct` ; (2) poser `id="etape-N"` (avec `scroll-margin-top`) sur la carte de chaque étape et ouvrir l'étape de l'ancre `#etape-N` si elle est accessible (sinon la première étape non faite, comportement actuel) ; (3) PM-11 dans `lib/parcours-orientation.ts` : la difficulté (Q2) passe avant « Partout » sauf si elle vaut confiance (fichier du lot B, non modifié ici).
- **Lot A** : aucune ; contrat `/api/user/rappel-parcours` repris tel quel.

## Ce qui reste

- Étalons @copywriter pour tous les textes provisoires ci-dessus ; validation @product-manager de la correspondance profil → parcours du quiz d'humour.
- UX-10 (un seul quiz d'orientation en fin de /quiz-humour) et UX-08 (2) (ligne « fait partie de l'étape N » dans le contenu du jour) : non faits, hors périmètre listé.
- `home-cta.tsx` (bas d'accueil) garde « Voir les vannes gratuites » : seul le lien secondaire du hero était visé. Boucle visuelle Playwright 3 tailles non exécutée (pas de serveur lancé, `.next` partagé).
