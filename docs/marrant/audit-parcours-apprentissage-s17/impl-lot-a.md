# Implémentation s17, lot A (serveur et données) @fullstack, 07/10/2026

Code non commité, non déployé, aucune écriture en prod (base Neon lue en SELECT `readOnly` seulement). Fichiers sous `apps/web/` sauf mention.

## 1. Recos traitées
| Reco | Changement | Fichiers |
|---|---|---|
| A2 / UX-02, FS-02 (serveur) | La fiche est renvoyée APRÈS la date de fin (`progress.completedAt` rempli à la dernière étape). Réponse POST : `xpGained` (étape + bonus), `stepXp`, `bonusXp`, `pathCompleted`, `alreadyCompleted`, `user {xp, level, levelChanged, streak}`, `pathXpTotal` (bonus compris : 325 / 475 / 800), `nextRecommendedAt` | `app/api/parcours/[id]/progress/route.ts` |
| F18 / FS-08, QA-08 | Table `UserPathStepCompletion` unique (utilisateur, parcours, étape), insérée en `ON CONFLICT DO NOTHING` avant tout XP : un 2e appel simultané attend puis compte 0. Fin décidée sur les étapes distinctes. Abonné hors ordre : 409 `code: "ordre"`, `etapeAttendue` | route progress, `prisma/schema.prisma`, migration 13 |
| FS-13 e | Limite 10/min passée sur `sharedRateLimit` (Postgres, fiable sous Workers), 429 + `Retry-After` | route progress |
| B4 / §7 alerte 2 | Erreur serveur → `recordAdminAlert("parcours-progress-erreur")` awaité, sans identifiant | route progress, `lib/admin-alerts.ts` (`CLES_PARCOURS`) |
| C6 / D3, FS-05, UX-04 | Série comptée sur la pratique (étape validée + nouvelle route quiz), jour civil de Paris ; la connexion ne met plus à jour que `lastActiveAt` ; `/api/user` renvoie 0 si la série est rompue | `lib/progression.ts`, `lib/auth.ts`, `app/api/parcours/[id]/quiz/route.ts`, `app/api/user/route.ts` |
| FS-07 | Niveau recalculé à chaque validation ; barème unique (COMIQUE 1 500, LÉGENDE 5 000, déjà dans l'enum : rejoués par la migration) partagé avec `/api/user/xp` | `lib/progression.ts`, `app/api/user/xp/route.ts` |
| D2 (serveur) | `nextRecommendedAt` = dernière validation + 7 j (POST et GET) ; GET renvoie aussi `stepCompletions` et `pathXpTotal` | route progress |
| PM-06 (serveur) | Retour d'exercice : 3 valeurs fermées, facultatif, jamais exigé pour valider (C13) | `app/api/parcours/[id]/retour/route.ts`, table `UserPathStepFeedback` |
| C5 / D7 | Rappel sur demande : préférence (désactivé par défaut, jour ISO, date d'activation, version du texte, date et origine d'arrêt), job quotidien 9h Paris, Premium + adresse vérifiée (e-mail vérifié ou Google) + `emailOptOut` faux + parcours en cours, 1 envoi par semaine de Paris réservé avant l'envoi, arrêt auto `fin-premium`, lien d'arrêt dédié signé + `List-Unsubscribe(-Post)`, texte seul, pas d'offre | `lib/rappels/rappel-parcours.ts`, `app/api/user/rappel-parcours/route.ts`, `app/api/rappel-parcours/arret/route.ts`, `lib/email.ts`, `lib/scheduler/jobs.ts` |
| B4 / §6 | Bloc « Parcours » du lundi (Q1 à Q6 + validations de la semaine, 8 événements Umami, cohérence base / Umami), nombres et dénominateurs, n.d. si panne | `lib/analytics/weekly-parcours.ts`, `weekly-visits-job.ts` |
| B4 / §7 alertes 1 et 3 | `parcours-sans-demarrage` et `parcours-suivi-muet` (job 4h UTC, classe B) | `lib/analytics/parcours-alertes.ts`, `jobs.ts` |
| Comptes de test | `ANALYTICS_EMAILS_EXCLUS` (liste d'e-mails), utilisée par le lundi et les alertes | `lib/analytics/comptes-test.ts` |
| A3 / FS-03 | MàC étape 3 : `57Ip2k3us_8` → `tpIOLzv11qo` (Djimo, actif en base, vérifié) | `docs/content/parcours-seed.json` |
| D4 / FS-04 | 85 et 82 (Répartie 2, « rythme et silences ») → **266** (« Long silence. On attendait tous les deux. ») et **322** (« J'ai hésité. Il avait l'air sûr de lui. ») ; 180 (Confiance 4) → **2** (autodérision « Je me compare à moi il y a cinq ans »). Les 3 sont actives en base (SELECT) | `parcours-seed.json` |
| C14 | Les 3 nouvelles tables effacées dans la transaction de `deleteAccount` (+ cascade) ; `collecterDonneesParcours(userId)` pour une demande d'accès | `lib/account.ts` |

## 2. Tests (tous verts)
- 81 tests dans 6 fichiers (`src/__tests__/`) : `api/parcours-progress.test.ts` (réécrit : parcours de 3, 4 et 6 étapes, fiche à jour à la fin, pas de « terminé » à l'étape 3 de Répartie ni à la 5 de Confiance, double validation, ordre, 429, alerte, niveau COMIQUE), `api/parcours-s17-routes.test.ts` (rappel, arrêt en un clic, quiz, retour), `lib/progression-s17.test.ts` (niveaux, série en jour de Paris, seed), `lib/rappel-parcours-s17.test.ts` (jeton, filtres C3 à C5, envoi unique, gabarit C6), `lib/parcours-analytics-s17.test.ts` (lundi, alertes, exclusion), `api/user-account-s16.test.ts` (+1 : aucune ligne restante, C14).
- `tsc -p tsconfig.build.json` : 0 erreur. ESLint sur les 26 fichiers du lot : 0. Jest complet : 3 685 OK, **2 échecs hors lot A** (`premium-offer.test.ts` : `parcours-preview` du lot B ; `attribution.test.tsx` : `ATTRIBUTED_EVENTS` de `lib/umami.ts`, lot B).
- Migration 13 jouée 2 fois sur un Postgres 16 local construit depuis le schéma de `HEAD` : 2 passes OK, `prisma migrate diff` vers le nouveau schéma = vide.

## 3. Textes provisoires (`config/textes/parcours-emails.ts`, marqués PROVISOIRE)
`TEXTES_PROGRESSION_API` (dont `ordre` : « Valide d'abord l'étape N, la suite s'ouvre juste après. »), `RAPPEL_PARCOURS_CONSENTEMENT` (texte de @legal C1, version `s17-v1`), `rappelParcoursEmail` (objet « Ton parcours X : l'étape N t'attend », pied légal C6), `TEXTES_ARRET_RAPPEL`, `TEXTES_RAPPEL_API`.

## 4. Contrat d'API pour les lots B et C
- `POST /api/parcours/{id}/progress {stepOrder}` → champs du §1 ; erreurs `{error, code}` avec `code` ∈ `auth` 401, `corps`/`etape` 400, `refus` 403, `introuvable` 404, `ordre` 409 (+`etapeAttendue`), `limite` 429, `serveur` 500. Pour `parcours-erreur` : 429 → `limite`, 403 → `refus`, autres → `serveur`.
- `GET /api/parcours/{id}/progress` → `{progress, stepCompletions[{stepOrder, completedAt}], nextRecommendedAt, pathXpTotal}`.
- `POST /api/parcours/{id}/quiz {stepOrder}` (Premium, à la fin du quiz) → `{streak}`.
- `GET|POST /api/parcours/{id}/retour` ; POST `{stepOrder, retour ∈ pas-essaye|essaye-bof|essaye-ca-a-marche}`.
- `GET /api/user/rappel-parcours` → `{enabled, weekday (1 = lundi … 7), activatedAt, consentText, consentVersion, eligible}` ; `POST {enabled, weekday?}` (activer : Premium + jour ; changer de jour : `enabled:true` + jour ; arrêter : `enabled:false`). Contrôle d'origine (403 si autre site).

## 5. Actions prod (détail : `REPLIT_ACTIONS.md` s17)
Migration 13 (2 passes) ; `UNSUBSCRIBE_HMAC_SECRET` présent ; `ANALYTICS_EMAILS_EXCLUS` (liste de Thomas) ; `PARCOURS_SUIVI_ACTIF_DEPUIS` le jour du déploiement ; Thomas : suivi Resend désactivé (C8).

## 6. Demandes aux autres lots
- **Lot B** : lire `data.pathCompleted` et `data.progress` (fiche à jour) ; afficher `pathXpTotal` ; gérer `code: "ordre"` ; appeler `/quiz` à la fin du quiz d'un Premium ; boutons de retour → `/retour` ; ajouter `rappel` aux valeurs de `src` de `parcours-ouvert` (lien du rappel `?src=rappel`) ; corriger les 2 tests en échec.
- **Lot C** : case du rappel dans le profil (`id="rappel-parcours"`, cible du lien « changer de jour »), texte `consentText` tel quel, visible si `eligible` ; série affichée = valeur de `/api/user` (0 si rompue).
- **Orchestrateur / @legal** : phrases P1 à P8 de la politique (C16) dans le même commit ; C4 exclut aujourd'hui les comptes mot de passe (aucune vérification d'e-mail n'existe) : décider s'il faut en ajouter une.

## 7. Ce qui reste
- **FS-12 non fait** : la réécriture de `docs/content/conseils-seed.json` avec les textes de la base (13 conseils exportés en lecture, 2 titres à ajouter) a été **refusée par le garde-fou de permissions** (écriture du fichier entier). Export prêt dans le scratchpad (`lota/tips.json`) ; à faire après accord de Thomas.
- **Constat nouveau, D4** : sur les 65 citations de vannes des 13 étapes (62 numéros distincts), **seules 5 sont actives en base** (dont les 3 remplaçantes) ; 45 inactives, 15 introuvables par texte (ni `content` ni `previousContent`). Afficher « les vannes actives » montrera 0 ou 1 vanne par étape : choix de vannes à refaire par @copywriter.
- Passage minuté de Confiance 6 : non fourni par @copywriter, laissé tel quel. Aucun export de données automatisé n'existe (la fonction est prête pour une demande manuelle).
