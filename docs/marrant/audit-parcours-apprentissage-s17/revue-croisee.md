# Revue croisée avant mise en ligne : parcours d'apprentissage s17 (@reviewer, 07/10/2026)

> Lu : audit s17 (recos 1-19), décisions D1-D8 et étalons s17 (`founder-preferences.md` l.71-73), brief, rapports des lots A, B, C, avis @legal (C1-C16), le code des 3 lots (fichiers ci-dessous), `parcours-reecriture-s17.json`, `parcours-reecriture-s17.md`, `vannes-actives-s17.json`. Pas de shell dans cette session : code lu tel qu'il est dans l'arbre, sans `git show`. Lot D (chargement du contenu) et finalisation des textes provisoires : non jugés.

## 1. Verdict : GO avec réserves (3 bloquantes, toutes courtes à lever)

Le visiteur voit enfin ce qu'il achète, sans recevoir le contenu payant. La validation d'étape est solide. Les conditions juridiques sont tenues à 2 détails près. Restent 3 points à régler avant la mise en ligne (§7) : l'ordre de déploiement, les lettres A/B/C/D des quiz et un contrôle visuel après le build.

## 2. Recos 1 à 19

| # | État | Preuve |
|---|---|---|
| 1 Aperçu des étapes 2+ | Faite | `lib/parcours-preview.ts:56-81` (liste blanche), `step-blocks.tsx:25-50`, `parcours-detail.tsx:477` |
| 2 Fausses récompenses | Faite | `progress/route.ts:170-175,191-201` ; `parcours-detail.tsx:271-276` (fin donnée par le serveur) |
| 3 Mauvaise vidéo MàC 3 | Faite | seed (lot A) + `parcours-reecriture-s17.json` (Djimo `tpIOLzv11qo`, présent dans `videos-seed.json:546`) |
| 4 Mesure | Faite | 8 événements, bloc du lundi, 3 alertes ; liste des e-mails de test à fournir par Thomas |
| 5 Rythme, Reprendre, rappel | Faite | `parcours-detail.tsx:370-375`, `reprendre-parcours.tsx`, `rappel-parcours.ts` |
| 6 Série honnête, niveau | Faite | `progress/route.ts:184-189`, `quiz/route.ts:50`, `progression.ts:20-28` |
| 7 Vraie fin, vraie suite | Faite | `path-completion-card.tsx:30-33,109-117` |
| 8 3 étapes gratuites réalignées | Faite (contenu) | JSON réécrit, chargé par le lot D |
| 9 Vannes dans l'étape | Faite | `parcours-vannes.ts`, `step-blocks.tsx:95-124` ; vannes réelles avec le lot D |
| 10 Quiz qui apprennent | Faite, réserve B2 | 54 explications ; affichage `step-quiz.tsx:137` |
| 11 Retour sur l'exercice | Faite | `step-blocks.tsx:134-178`, `retour/route.ts` |
| 12 15-20 min/semaine | Faite (contenu) | Confiance 6 : Doully 7:30 (`videos-seed.json:746`) |
| 13 Storytelling puis Pro | Partielle, prévue | spec `docs/product/specs-parcours-storytelling-pro-s17.md`, rien à coder (D6) |
| 14 Étape 1 porte d'entrée | Faite | lot C (articles, fiches, accueil, quiz, /abonnement) |
| 15 Aperçu de partage, H2 | Faite | `parcours/[slug]/page.tsx:74-89`, `parcours-detail.tsx:401,460` |
| 16 Titres D8 | Faite | `page.tsx:43-67` = `seo.md:190-193` ; « cours gratuit » absent du code |
| 17 Accessibilité du quiz | Faite | `step-quiz.tsx:121-139`, en-tête sans nom vocal différent `parcours-step-card.tsx:94` |
| 18 Finitions techniques | Faite | double validation `progress/route.ts:158-162`, limite partagée l.99, « Réessayer » `parcours-step-card.tsx:163-169`, 404 et erreur |
| 19 Conseils : fichier = base | **Absente** | refusée par le garde-fou (rapport lot A §7) |

## 3. Sécurité et fuite

- **Contenu payant** : rien ne sort pour un non-Premium. La page partagée est toujours en aperçu (`page.tsx:116-119`). L'API lit l'abonnement en base (`by-slug/route.ts:22-29,70-73`). Le texte des vannes n'est jamais envoyé (`parcours-data.ts:96-105`). Les étapes 2+ arrivent vides : conseil, quiz, vidéos et vannes (`parcours-preview.ts:61-79`). OK.
- **Validation d'étape** : la personne est toujours celle de la session (`progress/route.ts:93-97`) et l'abonnement est relu en base (l.115-118). Même règle pour quiz et retour. Personne ne peut valider pour un autre. OK.
- **Rappel e-mail (C1-C8)** : case décochée et visible au seul Premium (C1), preuve gardée (C2, migration l.79-107), arrêt à la fin de Premium (C3, `rappel-parcours.ts:139-144`), un seul envoi par semaine réservé avant l'envoi (C5, l.185-189), e-mail de service sans offre (C6), lien d'arrêt signé et en-têtes de désabonnement (C7, l.213-216 ; `arret/route.ts`). C8 reste un réglage Resend pour Thomas. **C4 incomplet** : voir N1.
- **Umami (C9-C11)** : pas d'identification, valeurs en listes fermées (`parcours-tracking.ts:6-29`). **Un écart** : voir N2.

## 4. Textes et étalons

- Les textes validés sont bien en place (aperçu 3.1, fin de quiz 3.2 B, rythme 3.3 A, retour 3.5 A, bilan 3.6 A, blocage s16 inchangé). Aucune contradiction avec les étalons s15 et s16. Aucun tiret cadratin côté client (seulement 2 commentaires de code). « Cours gratuit » est absent.
- La finalisation en cours doit couvrir : la case et l'e-mail du rappel, qui ne sont pas encore l'étalon 3.7 A et l'objet 7.2. L'étalon dit aussi « aucun jour présélectionné », or `rappel-parcours-toggle.tsx:56` présélectionne lundi. Enfin, la ligne « Reprendre » a deux formats (`parcours.ts:156` contre `entrees-parcours.ts:20`).

## 5. Contenu : 6 étapes tirées (MàC 2, Rép 2, Rép 4, Conf 1, Conf 2, Conf 5)

- Textes : justes, concrets, sur la voix des étalons, avec une scène et un défi faisable. Quiz : une seule bonne réponse défendable par question, explication juste, bonnes réponses bien réparties.
- **Défaut de quiz (Rép 2, question 2, JSON l.449)** : la scène, c'est une musique qui s'arrête et des gens qui parlent trop fort. Pourtant la bonne réponse dit « je chuchotais depuis dix minutes ». Il faut « je criais ». Conf 1, question 3 (« où repérer une règle ») se défend mais reste discutable.
- **Accord des vannes avec la technique** (`comedyTechnique`) : bon pour Conf 1 (4 sur 5), Conf 2 (4 sur 5) et Rép 4 (des ratés, 3 sur 5). Faible pour **MàC 2** (0 sur 5 : lecture littérale, bilan dérisoire, temps réel… des vannes sur le temps, aucune sur le moment où on parle), **Rép 2** (1 sur 5 : vannes de soirée) et Conf 5 (2 sur 5). Les vannes ont été choisies sur la situation, pas sur la technique.

## 6. Régressions possibles

- **Tunnel s16** : `buildAbonnementUrl` est inchangé et `src=parcours-apercu` est accepté. Le retour après paiement se fait vers le parcours. Risque réel : la migration 13 (B1). À rejouer : le smoke de bout en bout @s16 après le build.
- **Appli mobile** : `capacitor.config.ts` et le code natif ne sont pas touchés. Rien en vue, mais rien n'a été testé sur un téléphone.
- **Première transaction « interactive » du code** (`progress/route.ts:121`) sous Workers et Hyperdrive. Elle est supportée, mais jamais exercée en production : à rejouer avec un compte Premium de test (déjà prévu par le lot B).

## 7. Réserves

**Bloquantes (avant mise en ligne)**
- **B1. Ordre de déploiement.** Problème : le code lit une nouvelle colonne `User.lastPracticeAt`. Effet : sans la migration 13, la connexion, le compte et le paiement tombent, pas seulement la validation (contrairement à ce que dit `REPLIT_ACTIONS.md:6`). Ce qu'on fait : migration 13 jouée et vérifiée AVANT le déploiement, ligne corrigée, section s17 complétée avec les lots B, C et D.
- **B2. Quiz : « La A », « La C »… sans lettres à l'écran.** Problème : les 54 explications (étalon validé) citent des lettres, mais les réponses n'en ont pas (`step-quiz.tsx:123`). Effet : l'explication est incompréhensible, y compris sur les 3 étapes gratuites, la vitrine. Ce qu'on fait : afficher A, B, C, D devant chaque réponse (@fullstack, une ligne) avant de charger le contenu du lot D.
- **B3. Contrôle visuel.** Problème : aucune capture prise après l'implémentation. Ce qu'on fait : après le build, captures à 375, 768 et 1280 px (visiteur et Premium : aperçu, quiz, bilan, profil).

**Non bloquantes (même commit si possible)**
- N1. Rappel (C4) : un Premium inscrit par mot de passe peut cocher la case et lire « C'est noté », mais ne recevra jamais l'e-mail (seuls Google et les e-mails vérifiés partent, `rappel-parcours.ts:157-161`). Ce qu'on fait : `eligible` reprend le même filtre (`user/rappel-parcours/route.ts:47`).
- N2. `etape-retour` part avec le même détail que la ligne en base pour un Premium (`step-blocks.tsx:165`), ce que l'avis @legal §2 écarte. Ce qu'on fait : ne pas l'envoyer pour un Premium (la base compte déjà).
- N3. @copywriter : remplacer les vannes hors technique de MàC 2, Rép 2 et Conf 5, et corriger « chuchotais » (Rép 2).
- N4. Fiches vannes : le bloc « Dans un parcours » lit `jokeIds` (`entrees-parcours-fiches.ts:86`). Dès que le lot D passe à `jokeContents`, ce bloc disparaît sans bruit. Ce qu'on fait : lire aussi `jokeContents`.
- N5. Reco 19 : tant que le fichier des conseils n'est pas aligné, aucune tâche ne doit le réimporter, sinon les anciens textes reviennent. Écriture à faire avec l'accord de Thomas.
