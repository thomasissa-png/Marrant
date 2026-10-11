# Itération 1 : corrections @fullstack (s17, 07/10/2026)

Base : `815570a`. Écart → correction → fichier (chemins sous `apps/web/src/` sauf mention). Nouveaux textes marqués `// s17 tour 1` dans `config/textes/`. Rien n'est commité ni déployé.

## Bloquants

| Écart | Correction | Fichier |
|---|---|---|
| DES-1-01, UXV-1-01, bugs QA 1 et 3 | Gain d'XP + date conseillée (étalon 3.3 A) affichés DANS la carte validée, sous l'en-tête, sans minuterie (plus de `setTimeout`). La page cale la carte validée sous l'en-tête (`scroll-mt-24`, `block: start`, mouvement réduit respecté) et l'étape suivante s'ouvre juste en dessous, avec le focus. Zone `aria-live` permanente en `sr-only` (fin des 16 px morts) | `components/parcours/parcours-detail.tsx`, `parcours-step-card.tsx` |
| DES-1-02 | Token `error-text: #F87171` (6:1 sur carte, 5,4:1 sur `bg-error/10`) ; réponse fausse du quiz, alerte d'échec de validation, bouton et erreur de suppression de compte | `tailwind.config.ts`, `step-quiz.tsx`, `parcours-detail.tsx`, `profil/supprimer-compte-card.tsx` |
| DES-1-03, bug QA 4 | Série en `accent-link` `text-base`, `aria-label="série"` ; chiffres des stats et « Regarde les pros » en `accent-link` (survol `accent-primary`) ; titre « Série » ; règle « `accent-secondary` interdit en texte » + token `error-text` + interrupteur écrits | `ui/streak-counter.tsx`, `profil/profil-dashboard.tsx`, `docs/design/design-system.md` |
| DES-1-04 | `pb-0` sur l'en-tête d'une carte repliée | `parcours-step-card.tsx` |
| DES-1-05, UXV-1-04 | Visiteur : plus de « Continuer » (il faisait disparaître le quiz) ; quiz compté dès la fin (événement inchangé), bouton `outline` « Refaire le quiz » ; « Voir l'offre Premium » en `outline` tant que le quiz n'est pas fini, plein ensuite, filet au-dessus ; « Question suivante » et « Continuer » abonné à 44 px (`outline` pour « Continuer ») ; titre visiteur « Petit quiz pour t'entraîner » | `step-quiz.tsx`, `step-blocks.tsx`, `parcours-step-card.tsx`, `config/textes/parcours.ts` |
| DES-1-06 | Titres de bloc `font-display text-base font-bold`, `space-y-6`, corps « Ce que tu vas apprendre » et « Le conseil » en `text-base leading-7 sm:text-[15px] max-w-[68ch]`, filet avant vidéos et quiz | `parcours-step-card.tsx`, `step-blocks.tsx` |
| DES-1-07 | Pastille de succès 48 px, bilan dans un bloc `max-w-md text-left` séparé par un filet, coches violettes à la place des puces, défis dans le même bloc, bouton `w-full sm:w-auto min-h-[44px]` | `path-completion-card.tsx` |
| DES-1-08, UXV-1-02 | Invitation au rappel affichée seulement si l'API dit `eligible` et rappel pas encore activé ; interrupteur sous « Mes parcours » (avant « Prochaine étape », jamais après la suppression), `Card` + `CardTitle`, vrai `role="switch"` (piste, pastille, focus visible, label de 44 px), `select` du système, message `empty:mt-0`, ancre `#rappel-parcours` + `scroll-mt-24` + focus à l'arrivée | `parcours-detail.tsx`, `app/(dashboard)/profil/rappel-parcours-toggle.tsx`, `profil-dashboard.tsx`, `app/(dashboard)/profil/page.tsx` |
| DES-1-09 | « Statistiques » en `md:col-span-2`, carte Série `py-2` | `profil-dashboard.tsx` |
| UXV-1-03 | Parcours terminé rechargé : toutes les étapes repliées (sauf ancre `#etape-N`), carte de fin + bilan avant « Le programme » (aussi juste après la dernière validation) | `parcours-detail.tsx` |
| UXV-1-05 | Encart « Parcours recommandé » du blog : libellé unique « Lire la première étape gratuite » en bouton principal (les 9 libellés par cluster supprimés) ; CTA de fin d'article (étalons 3.1 / 3.2c) non touché | `blog/blog-article-parcours-maillage.tsx`, `config/textes/entrees-parcours.ts` |
| Bug QA 2 | Smoke réaligné sur le nom vocal actuel (`/^Étape 2 : .*Fait partie de Premium$/`) | `playwright/tests/smoke/murs-premium.spec.ts:115` |

## Finitions

| Écart | Correction | Fichier |
|---|---|---|
| DES-1-11 | `Badge variant="premium"` « Fait partie de Premium », titre verrouillé en `text-text-secondary`, cadenas sans `opacity-60`, icône droite `text-text-muted` | `parcours-step-card.tsx` |
| DES-1-12 | Quiz dans un conteneur, lettres en pastille (contour : un fond teinté passait la lettre à 4,2:1), question `text-base`, explication en encadré `border-l-2` | `step-quiz.tsx` |
| DES-1-13 | Description vidéo `text-sm not-italic text-text-secondary` ; liens de fiche (vidéo, vanne, conseil) et boutons « Alors, ce défi ? » à 44 px | `step-blocks.tsx`, `parcours-step-card.tsx` |
| DES-1-14 | Étiquette « Dans un parcours » en capitales violettes, lien en bouton `outline` (texte inchangé) | `entrees-parcours/fiche-parcours-lien.tsx` |
| DES-1-15 | Amorce `text-text-secondary`, chute `font-semibold text-text-primary`, `divide-y`, `py-3` | `step-blocks.tsx` |
| DES-1-16 | Carte visiteur `py-3` sans double padding ; total d'XP à gagner en `text-text-secondary` | `parcours-detail.tsx` |
| DES-1-17 | En-tête `bg-background/95` | `layout/header.tsx` |
| UXV-1-06 | Repère « Parcours Répartie · 4 semaines » (titre + durée du parcours) au-dessus du titre de l'étape 1, masqué au lecteur d'écran (le H1 le dit déjà, le nom « Étape 1 : … » ne change pas) ; même `scroll-mt-24` | `parcours-step-card.tsx`, `parcours-detail.tsx` |
| UXV-1-07 | Ligne `{PREMIUM_PRICE_LABEL}, sans engagement.` (prix lu dans `config/premium.ts`) sous « Voir l'offre Premium » de l'aperçu et du blocage de validation ; texte du blocage s16 intact | `step-blocks.tsx` |
| UXV-1-08, DES-1-13 | Lien d'accueil en `text-base font-semibold text-text-primary`, soulignement violet, `px-3 py-2`, 44 px ; bouton principal (étalon 1.2) intact | `home/hero-section.tsx` |
| UXV-1-09 | « Série » + libellé validé étalon 3.8 A (« {n} jours de pratique d'affilée », aide, état à zéro) ; « Premiers XP » seulement au premier niveau, sinon « Niveau {x} atteint. Le prochain se gagne en pratiquant. » ; carte « Prochaine étape » masquée quand un parcours est en cours (« Reprendre » seul) | `ui/streak-counter.tsx`, `profil-dashboard.tsx`, `config/textes/parcours.ts` |
| UXV-1-11 | Les 3 encadrés SSR de /parcours passent hors écran (`sr-only`) : liens gardés pour les robots, le quiz puis les 3 cartes à l'écran | `app/(dashboard)/parcours/page.tsx` |

## Non traités (hors code)

- DES-1-10 et UXV-1-10 (captures d'états et de parcours manquantes) : à @qa pour l'itération 2 (survol, focus, réponse fausse, « On valide… », interrupteur coché, résultat dans la carte, MàC Premium, Marc).
- Largeur pleine de la page profil (DES-1-09) : signalé hors périmètre par @design. Token `error-text` non déployé hors parcours et profil (admin, rétractation : 20 occurrences ignorées, hors s17).

## Textes nouveaux à relire par @copywriter (voix des étalons)

`QUIZ_TITRE.visiteur` « Petit quiz pour t'entraîner » (arbitrage orchestrateur), `QUIZ_FIN_BOUTON.visiteur` « Refaire le quiz », `PROGRESSION_NIVEAU.nouveauNiveau`, `APERCU_REASSURANCE`, `etapeContexteTexte`.

## Vérifications

`npx tsc --noEmit -p tsconfig.build.json` OK ; ESLint sur les 27 fichiers TS touchés OK ; Jest complet 259 suites, 3 756 PASS, 0 échec (8 tests réalignés, 6 ajoutés dont `parcours-s17-tour1.test.tsx`) ; `npm run build` OK (`/parcours/[slug]` 139 kB, `/profil` 130 kB de First Load JS). 0 tiret cadratin ajouté.

## Tour 2 : chargement Premium (et finitions iter-2-design / iter-2-ux)

| Écart | Correction | Fichier |
|---|---|---|
| QA iter-2, DES-2-01, UXV-2-01 | Progression : dernière valeur du compte gardée dans le navigateur (`localStorage`, liée à l'id) et affichée tout de suite ; inconnue = squelette, jamais « 0/N » ; aucun verrou d'ordre tant qu'elle est inconnue. Chargement : `aria-busy`, ligne `role="status"`, carte d'étape ouverte avec squelette 3 lignes (100/90/60 %, `min-h-[160px]`). Échec : bloc `border-l-2 border-error-text bg-error/10` dans la carte de progression, `role="alert"`, « Ta progression est intacte. » + message court, « Réessayer » outline 44 px (focus rendu après un nouvel échec) ; l'étape dépliée garde son message sans 2e annonce | `parcours-detail.tsx`, `parcours-step-card.tsx`, `lib/parcours-progress-cache.ts`, `CHARGEMENT_PREMIUM` (`// s17 tour 2`) |
| DES-2-02 | Contours par `className` (variante globale intacte) : offre Premium (blocage étape 1) et « Dans un parcours » `border-accent-primary hover:bg-accent-primary/10` ; « Refaire le quiz » et « Continuer » `border-text-muted hover:border-text-primary` | `step-blocks.tsx`, `fiche-parcours-lien.tsx`, `step-quiz.tsx` |
| DES-2-03, UXV-2-02 | « Termine le quiz… » : `aria-disabled`, fond `background-elevated`, texte `text-secondary`, contour `border` ; « On valide… » `disabled:opacity-80` + indicateur 16 px | `parcours-step-card.tsx` |
| DES-2-04 / 2-05 | « +N XP » statique masqué quand le gain est affiché, gain en `text-base` ; parcours terminé : plus de « XP au total » dans la carte de progression, phrases de suite en `mx-auto max-w-md` | `parcours-step-card.tsx`, `parcours-detail.tsx`, `path-completion-card.tsx` |
| DES-2-06 / 2-07 / 2-08 | Aperçu : label `font-display text-base font-bold text-text-primary`, corps `max-w-[68ch]`, phrase Premium `max-w-[48ch] mx-auto` ; « Supprimer mon compte » `-ml-3` ; accueil : « Explorer les vannes » en contour quand « Reprendre » est affiché (une seule requête, bloc `ReprendreParcoursBloc`) | `step-blocks.tsx`, `supprimer-compte-card.tsx`, `hero-section.tsx`, `reprendre-parcours.tsx` |
| DES-2-11 / UXV-2-03 / UXV-2-05 | Terminé : intro et « Pour qui ? » passent sous la carte de fin ; sélecteur de jour inactif interrupteur éteint (étalon 3.7 gardé : pas de lundi imposé) ; /parcours : abonné qui a entamé un parcours = cartes avant le quiz d'orientation (titre inchangé) | `parcours-detail.tsx`, `rappel-parcours-toggle.tsx`, `parcours-content.tsx` |

DES-2-10 : doublon réel dans `HEAD` (`parcours-seed.json`, Répartie étape 2, `moduleDetail` = conseil 80 « Le silence entre deux chansons » à quelques mots près, la déduplication stricte ne l'attrape pas) ; contenu non modifié ici, une réécriture non commitée d'un autre agent est en cours dans le seed. Textes à relire par @copywriter : `CHARGEMENT_PREMIUM`.
Tests : `parcours-s17-tour2.test.tsx` (9 : lent avec et sans progression connue, autre compte, échec puis réessai, focus, échec sans progression, DES-2-04, 2-05/2-11, UXV-2-05) ; 2 tests réalignés (`Réessayer` de l'étape ciblé, sélecteur inactif). tsc OK, ESLint OK (1 avertissement préexistant admin), Jest 260 suites, 3 765 PASS, 0 échec, `npm run build` OK (`/parcours/[slug]` 140 kB). Captures à refaire par @qa (DES-2-09, UXV-2-06).

## Tour 3 (07/10, sur fb5fbba)
- Interrupteur du rappel (défaut QA iter-3, focus sur `body` après Espace) : `disabled={saving}` remplacé par `aria-disabled` + garde synchrone (`useRef`) dans `save` et `onChange` (React rétablit l'état de la case), style `peer-aria-disabled:opacity-60`. Sélecteur de jour non modifié, mais il garde `disabled={saving}` : même risque de perte du focus quand on choisit un jour au clavier, à vérifier par @qa (`rappel-parcours-toggle.tsx`).
- Échec du chargement Premium (capture `p-375-etape-echec-arrivee`, UXV-3-01, DES-3-06) : étape dépliée en échec = « Ta progression est intacte. » (`CHARGEMENT_ETAPE.progressionIntacte` = `CHARGEMENT_PREMIUM.echec`), `role="alert"` et le seul « Réessayer » dans la carte de l'étape (focus rendu après un nouvel échec) ; le haut garde une ligne neutre (`echecTexte`, sans rôle) ; étape repliée = bloc du haut inchangé. Une seule règle pour la page et la carte : `etapeAfficheEchec` (`parcours-step-card.tsx`, `parcours-detail.tsx`, `config/textes/parcours.ts`).
- Échec de validation (QA) : message dans la carte, au-dessus de « Valider cette étape », `role="alert"` `text-error-text`, bloc du haut de page supprimé, focus rendu à « Valider » ; DES-3-05 : en-tête déplié `mb-2` (anneau de focus à 4 px du bloc « Pourquoi cette étape ? »), cartes d'étape `scroll-mt-28` (« Le programme » entier sous la barre de 64 px). UXV-3-02 : survol déjà en place dans `step-quiz.tsx` (contour 1,15:1 → 3,39:1, fond `background-elevated`), aucun changement ; la capture a sans doute été prise pendant la transition de 150 ms, refaire avec une pause.
- Tests : +1 `entrees-parcours-s17-ui` (Espace : pas de `disabled`, focus gardé, 2e Espace pendant l'envoi ignoré, 1 requête par bascule) ; +4 `parcours-s17-tour2` (arrivée par `#etape-2`, un seul « Réessayer » étape dépliée et repliée, échec de validation) ; 2 tests réalignés (alerte portée par l'étape, un seul « Réessayer » dans `lot-b`).
- Vérifications : tsc OK, ESLint 0 erreur (avertissements préexistants), Jest 260 suites, 3 770 PASS, 0 échec, `npm run build` OK (`/parcours/[slug]` 141 kB). Pas de commit. Captures à refaire par @qa (interrupteur au clavier sous Chromium, étape en échec, échec de validation, survol d'une option du quiz).

## Tour 4 (07/10, sur 33ceaa0)

- Arrivée par `#etape-N`, chargement Premium terminé (capture `iter-4/p-768-etape-echec-arrivee`) : le défilement d'arrivée était calculé sur la page longue du HTML ISR, puis la page raccourcissait. Dès que l'état passe à « échec » ou « contenu chargé », la carte de l'étape ouverte est recalée UNE fois sous l'en-tête (`scrollIntoView({ behavior: "instant", block: "start" })` + `scroll-mt-28` existant, `instant` pour ne pas dépendre du `scroll-behavior: smooth` global), focus non touché, aucun recalage après « Réessayer » ni sans ancre (`ancreARecaler`, `parcours-detail.tsx`).
- En-tête d'étape dépliable : survol = titre souligné (`decoration-text-muted`, décalage 4 px) et chevron qui passe de `text-muted` à `text-primary` (`group` / `group-hover:`), rien sur un en-tête verrouillé ; la carte garde son `hover:border-border-hover` (`parcours-step-card.tsx`).
- Interrupteur du rappel : survol éteint = bordure `text-muted` #9A9A9A (6:1 sur la carte #1F1F1F, contre 1,5:1 avant) ; survol allumé = piste et bordure `accent-primary-hover` #A78BFA (`peer-hover:`, `peer-checked:peer-hover:`, `rappel-parcours-toggle.tsx`).
- Tests : +4 `parcours-s17-tour4` (recalage unique après échec puis aucun après « Réessayer », recalage après contenu chargé, aucun sans ancre, classes de survol de l'en-tête). Vérifications : tsc OK, ESLint 0 erreur sur les fichiers touchés, Jest 263 suites, 3 799 PASS, 0 échec, `npm run build` OK. Pas de commit. Capture à refaire par @qa : arrivée `#etape-2` en échec à 768 px, survols.
