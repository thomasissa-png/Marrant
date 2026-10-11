# Implémentation s17, lot E (réserves de la revue croisée) @fullstack, 07/10/2026

Statut : FAIT. Rien commité, rien déployé, pas de build, aucune écriture en prod. Code des lots D et des textes finalisés conservé (ni stash ni checkout). Fichiers sous `apps/web/src/` sauf mention.

## 1. Changements
| Point | Changement | Fichiers |
|---|---|---|
| B2 lettres du quiz | Lettre A à D visible devant chaque réponse (`aria-hidden`), lue « Réponse A : … » par les lecteurs d'écran (texte masqué à l'œil). Les 54 explications du seed commencent bien par la lettre de la bonne réponse (testé) | `components/parcours/step-quiz.tsx`, `config/textes/parcours.ts` (`quizLettre`, `QUIZ_LETTRE_VOCALE`) |
| B1 déploiement | Section s17 réécrite : migration 13 jouée 2 fois PUIS vérifiée par une requête SQL (attendu `1 / 3 / 2`, sinon arrêt), pourquoi connexion, compte et paiement tombent sans elle, lots A à E, variables (`ANALYTICS_EMAILS_EXCLUS` fournie au déploiement, jamais dans le dépôt ; `PARCOURS_SUIVI_ACTIF_DEPUIS` ; `UNSUBSCRIBE_HMAC_SECRET`), logs attendus de `parcours-content:s17-v1` et des 5 défis, contrôles (dont captures B3), retour arrière | `REPLIT_ACTIONS.md` |
| B1 robustesse | **Non fait, à dessein.** Les lectures sans `select` relisent toute la ligne `User` : connexion par mot de passe (`lib/auth.ts:47`), adaptateur Prisma (Google), `user.update` de `lib/stripe-activation.ts` et du webhook Stripe. Pour les protéger, il faudrait masquer la colonne dans tout le client Prisma (Node et Workers), adaptateur compris : ni léger, ni vérifiable sans base réelle. La garde reste l'ordre de déploiement plus la requête de contrôle | aucun |
| N1 rappel | Filtre d'envoi partagé `FILTRE_DESTINATAIRE_RAPPEL` (Premium, `emailOptOut` faux, e-mail vérifié ou Google) : utilisé par le job ET par `eligible` (GET) et l'activation (POST, sinon 403). Aucun code ne marque `emailVerified` : les comptes à mot de passe ne voient donc pas la case (aucune promesse non tenue) | `lib/rappels/rappel-parcours.ts`, `app/api/user/rappel-parcours/route.ts` |
| N2 Umami | `etape-retour` n'est envoyé que pour un visiteur ; pour un Premium, seul l'envoi en base part | `components/parcours/step-blocks.tsx`, `parcours-step-card.tsx` |
| N4 fiches vannes | Confirmé : `findParcoursForJoke` lit `jokeContents` (repli `jokeIds`), page `vannes/[slug]/page.tsx:267`. Nouveau test : les 65 vannes des 13 étapes renvoient chacune à leur étape | test seulement |
| Rappel, jour | Aucun jour présélectionné (option « Choisis un jour »). Case cochée sans jour : rien n'est envoyé, message et focus sur le sélecteur, le choix du jour active le rappel | `app/(dashboard)/profil/rappel-parcours-toggle.tsx`, `config/textes/entrees-parcours.ts` |
| Reprendre | Même format partout (étalon 3.4 A) : `REPRENDRE.ligne` = `LISTE_PARCOURS.repriseLigne` (« Parcours X, étape N sur M : titre »). `/api/user/progress` renvoie `nextStepTitle` (titre de l'étape lu dans le seed, comme la liste /parcours), transmis par `pickParcoursAReprendre` (`titreEtape`) | `config/textes/entrees-parcours.ts`, `app/api/user/progress/route.ts`, `lib/entrees-parcours.ts`, `components/home/reprendre-parcours.tsx` |
| Défis | `machine-a-cafe-3` et `confiance-4` ajoutés à `DEFIS_CONFIRMES` (appliqués au prochain démarrage, marqueur par défi) | `lib/parcours-content-sync.ts` |

## 2. Textes provisoires (`config/textes`, marqués `PROVISOIRE s17 lot E`)
- `RAPPEL_PARCOURS_UI.jourVide` : « Choisis un jour » ; `RAPPEL_PARCOURS_UI.choisirJour` : « Choisis d'abord le jour du rappel, il s'activera aussitôt. »
- `QUIZ_LETTRE_VOCALE` (lu seulement par les lecteurs d'écran) : « Réponse A : ».

## 3. Tests
- Nouveaux : `__tests__/feature/parcours-s17-lot-e.test.tsx` (lettres, nom vocal, explication, lettre de chaque explication du seed = bonne réponse) ; `__tests__/api/parcours-s17-lot-e.test.ts` (`nextStepTitle`, parcours fini, slug hors seed).
- Complétés : `api/parcours-s17-routes` (éligibilité = filtre d'envoi, mot de passe non vérifié : case absente et 403) ; `feature/parcours-s17-lot-b` (pas d'`etape-retour` pour un Premium) ; `feature/entrees-parcours-s17-ui` (aucun jour présélectionné, activation par le jour, jour déjà réglé, ligne « Reprendre » avec et sans titre) ; `feature/entrees-parcours-s17` (`titreEtape`, 65 vannes) ; `lib/parcours-contenu-s17-lot-d` (5 défis).
- Alignés sur les textes finalisés : `dashboard/hero-section`, `feature/viral-quiz`, `feature/entrees-parcours-s17-ui` (« Lire la première étape gratuite ») ; `lib/rappel-parcours-s17` (objet 7.2 « Yanis, ta prochaine étape t'attend », parcours nommé dans le corps).
- `npx tsc --noEmit -p tsconfig.build.json` : 0 erreur. ESLint sur les 22 fichiers touchés : 0. **Jest complet : 3 750 OK, 2 ignorés, 0 échec (258 suites).**
- Dépendance au contenu en cours de modification par @copywriter : 4 tests lisent `parcours-seed.json` (lettres des explications, ≤ 4 réponses, 65 vannes avec au moins une par étape, `moduleTitle` de Confiance 3). Ils sont calés sur les données, pas sur les textes, mais sont à relancer après sa livraison.

## 4. À signaler
- @copywriter : 2 explications commencent par « La D. » (Répartie 1, question 1) et « La A. » (Confiance 1, question 1) au lieu de « La X : » (format des 52 autres). Elles restent lisibles. Je n'ai pas touché `parcours-seed.json` ni `parcours-reecriture-s17.json`. Le `statut` de MàC 3 et Conf 4 y dit encore « à confirmer » (le code ne le lit pas).
- Non traité (hors périmètre) : l'e-mail de rappel écrit « 15 à 20 minutes » en dur au lieu de la durée du parcours (point des textes finalisés).
- Vérifié : « tu testes le quiz » (`ABONNEMENT_ETAPE_1`) est vrai, puisque le visiteur fait le quiz de l'étape 1 (fin visiteur 3.2 B dans `step-quiz.tsx`).
- B3 (captures 375, 768 et 1280 px) : reste à faire après le build de l'orchestrateur (étape 8 de `REPLIT_ACTIONS.md`).
