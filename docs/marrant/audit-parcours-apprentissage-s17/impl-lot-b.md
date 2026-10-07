# Implémentation lot B (interface des parcours), s17, 07/10/2026

> @fullstack, lot B du brief `_brief-implementation.md`. Rien commité, rien déployé, pas de `npm run build`. Textes : étalons validés par Thomas (`docs/copy/etalons-parcours-apprentissage-s17.md`, commit `9c91c57`) appliqués là où ils existent, le reste marqué `PROVISOIRE s17`.

## 1. Recos traitées

| Reco | Changement | Fichiers (`apps/web/src/`) |
|---|---|---|
| A1 / D1 | Visiteur : étapes 2+ ouvrables dans l'ordre voulu, badge « Fait partie de Premium », aperçu = titre + ce qu'on apprend (`moduleDetail` ajouté à la liste blanche) + format, bas validé 3.1 c, bouton « Voir l'offre Premium » `src=parcours-apercu`, intro 3.1 b. Abonné : ordre conseillé gardé. Fin de quiz visiteur : étalon 3.2 B (plus de « Tu peux valider »). Contenu payant jamais dans le HTML ni l'API (testé) | `components/parcours/*`, `lib/parcours-preview.ts` |
| A2 | Fin pilotée par le serveur (`pathCompleted` ou `completedAt`, jamais un seuil d'XP), carte affichée sans recharger, total = `pathXpTotal` du serveur ou étapes + bonus ; gain d'XP dans une zone vocale permanente (6 s), focus sur l'étape suivante ou le bilan | `parcours-detail.tsx`, `path-completion-card.tsx`, `lib/parcours-xp.ts` |
| UX-06 / bilan | Bilan 3.6 A (titre, phrase maison, XP, « Ce que tu sais faire maintenant », défis essayés si ≥ 1) ; suite = 1er parcours non terminé (`/api/parcours`), sinon carnet ; plus de « parcours suivant » en cours de route pour l'abonné | `path-completion-card.tsx`, `api/parcours/route.ts` |
| D4 | 5 vannes de l'étape pour l'abonné : contrat `jokeContents` (textes exacts, `isActive`), repli `jokeIds` ; seules les vannes trouvées s'affichent, lien vers la fiche ; textes jamais envoyés à un non-Premium (seulement `jokeCount`) | `lib/parcours-vannes.ts`, `lib/parcours-data.ts`, `api/parcours/by-slug` |
| D2 | « Prochaine étape conseillée le … » (3.3 A, date `nextRecommendedAt` du lot A ou dates par étape), « La prochaine étape t'attend. » si passée | `parcours-detail.tsx`, `by-slug` (lit `UserPathStepCompletion`, tolérant si table absente) |
| D7 | Interrupteur au profil (lot C, avis @legal) : lien discret vers `/profil#rappel-parcours` | `parcours-detail.tsx` |
| PM-06 | 3 boutons 3.5 A sous le défi, facultatifs ; `etape-retour` ; abonné : `POST /api/parcours/{id}/retour` + préremplissage (GET) | `step-blocks.tsx` |
| B4 | `parcours-ouvert` (src en liste fermée, + `quiz fiche abonnement profil rappel`), `etape-ouverte` (auto/manuel), `quiz-etape-termine`, `orientation-resultat`, `parcours-termine`, `parcours-erreur` (codes du lot A mappés), `parcours-etape` + `etapes termine duree_s`, `mur-vu` `parcours-validation` ; 2 événements ajoutés à `ATTRIBUTED_EVENTS` | `parcours-detail.tsx`, `parcours-content.tsx`, `lib/parcours-tracking.ts`, `lib/umami.ts` |
| D3 (écran) | Quiz terminé d'un abonné → `POST /api/parcours/{id}/quiz` (série sur la pratique) | `parcours-detail.tsx` |
| F17 | Quiz : « Bonne réponse » / « Pas tout à fait. La bonne réponse : … » + icône, zone vocale, explication si présente, focus sur « Question suivante » ; en-tête d'étape sans `aria-label` (nom = texte visible), focus visible | `step-quiz.tsx`, `parcours-step-card.tsx` |
| FS-09 | Chargement abonné en échec ou > 10 s : message + « Réessayer » | `parcours-step-card.tsx` |
| SEO-02/03/D8 | 4 titres de `seo.md` §6, « Première étape gratuite. » dans les metas, og + twitter propres à chaque page | `parcours/page.tsx`, `parcours/[slug]/page.tsx` |
| SEO-04 / FS-11 | Hub : ItemList ; détail : Course avec `@id`, prix lu dans `config/premium`, niveau lu dans le seed, sans tiret cadratin | `lib/parcours-jsonld.ts` |
| SEO-05 | H2 « Pour qui ? » et « Le programme », liens vers la fiche conseil et les fiches vidéo (vidéos actives) | `parcours-detail.tsx`, `lib/parcours-data.ts` |
| FS-13 / QA-11 / SEO-11 | `loading.tsx`, `error.tsx` (liste), 404 dans le layout avec « Voir les parcours » et une seule consigne `noindex` ; fusion base + seed dans `lib/parcours-data.ts` ; liste par slug ; `parcours-list.tsx` supprimé (inclus dans le commit `31cc35b` par l'orchestrateur) | `app/(dashboard)/parcours/**` |
| QA-13 / QA-07 / UX-11 | Visiteur : plus de barre immobile, « Étape 1 offerte, étapes 2 à N avec Premium » ; liste : XP bonus compris, « Terminé », « Reprendre ton parcours » (3.4 A) | `parcours-detail.tsx`, `parcours-content.tsx` |
| Lot C | `id="etape-N"` + `scroll-mt-24`, ouverture de l'étape de l'ancre si accessible ; PM-11 (difficulté nommée avant « Partout », sauf confiance) | `parcours-step-card.tsx`, `lib/parcours-orientation.ts` |

## 2. Tests et résultats

- Nouveaux : `__tests__/feature/parcours-s17-lot-b.test.tsx` (14 : parcours de 4 et 6 étapes, carte sans recharger, 409 ordre, Réessayer, rythme, quiz accessible, événements, src fermé, retour, ancres) et `__tests__/api/parcours-s17-lot-b.test.ts` (34 : aucun secret dans l'ISR ni l'API, vannes Premium seules, `jokeContents` avec 1 texte inconnu → 4 vannes, repli `jokeIds`, metas D8, noindex, JSON-LD, `/api/parcours`, constantes = `lib/progression`, PM-11).
- Mis à jour (comportement voulu) : `parcours-detail`, `parcours-user-simulation`, `parcours-list`, `parcours-by-slug-premium`, `attribution`, `premium-offer`, `corrections-s16-lot-f`.
- `tsc --noEmit -p tsconfig.build.json` : 0 erreur. ESLint sur les fichiers du lot : 0. Jest complet : 255 suites, 3 721 OK, 2 ignorés. `parcours-list` « keeps programmes collapsed… » a échoué 1 fois sur 3 passages complets (instable sous charge, OK seul ×3).

## 3. Textes (`apps/web/src/config/textes/parcours.ts`)

- **Validés** (étalons 3.1 à 3.6) : `ETAPE_APERCU_LIBELLE`, `APERCU_INTRO`, `APERCU_BAS`, `quizFinVisiteur`, `prochaineEtapeTexte`, `PROCHAINE_ETAPE_DISPONIBLE`, `RETOUR_EXERCICE`, `FIN_PARCOURS` (sauf le bouton), `LISTE_PARCOURS.reprendre/repriseLigne`.
- **Provisoires** : `etapeOrdreTexte` « Termine l'étape N pour débloquer », `progressionVisiteurTexte`, `dureeEtapeTexte` « Durée estimée : 20 min environ », `QUIZ_CORRECTION` « Bonne réponse » / « Pas tout à fait » / « La bonne réponse : … », `XP_GAIN` « +N XP gagnés ! » / « …, dont 100 de bonus de fin. Parcours terminé ! », `totalXpTexte`, `RAPPEL_LIEN` « Envie d'un rappel par e-mail le jour de ton choix ? Règle-le dans ton profil », `CHARGEMENT_ETAPE`, `VANNES_ETAPE` (« N vannes choisies pour cette étape t'attendent avec Premium. »), `LIENS_FICHES`, `TITRES_SECTIONS` (« Pour qui ? », « Le programme »), `FIN_PARCOURS.suite` « Passer au parcours X », `LISTE_PARCOURS.termine/revoir`, `PAGES_ETAT`.

## 4. Actions prod

Aucune propre au lot B. Dépend de la migration du lot A (dates par étape : sans elle, pas de date conseillée, rien ne casse). Après déploiement : rejouer en Premium (environnement de test) la dernière validation d'un parcours de 4 et 6 étapes ; vérifier la 404 `/parcours/slug-inexistant` (une seule balise robots).

## 5. Demandes aux autres lots

- **Lot C** : ancre `id="rappel-parcours"` sur l'interrupteur du profil (lien posé vers `/profil#rappel-parcours`).
- **Lot A** : garder `PATH_COMPLETION_BONUS_XP` et `NEXT_STEP_DELAY_DAYS` alignés sur `lib/parcours-xp.ts` (test de garde en place) ; seed avec `jokeContents` attendu de @copywriter.
- **@copywriter** : champ `explanation` des quiz (déjà affiché s'il existe) ; textes provisoires ci-dessus.

## 6. Ce qui reste

- Conflit à trancher : D1 cite « durée estimée » dans l'aperçu, l'étalon 3.1 validé dit « rien d'autre » ; appliqué : l'étalon (durée seulement dans l'étape ouverte).
- FAQ propre aux parcours (SEO-04) et H1 « cours d'humour » de `/parcours` : contenu, non touchés. Prix « 2,99 € » écrit en dur dans « Explore aussi » de `/parcours` (préexistant).
- `parcours-detail.tsx` (532 lignes), `parcours-content.tsx` (362) et `parcours-step-card.tsx` (277) dépassent 150 lignes : découpe déjà faite en 6 fichiers, à poursuivre au prochain passage.
- Boucle visuelle Playwright (375/768/1280) non lancée (pas de build ici) : à faire après le build de l'orchestrateur.
