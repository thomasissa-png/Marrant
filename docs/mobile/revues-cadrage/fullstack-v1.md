# Revue technique à l'aveugle du cadrage v1 de l'app iPhone (@fullstack, s23, tour 2, 04/11/2026)

> Document relu : `docs/mobile/cadrage-app-native-s23.md` (v1, commit `dfd506f`), confronté à ma revue v0 (`docs/mobile/revues-cadrage/fullstack-v0.md`) et au code réel de la branche `claude/ouverture-session-nzwj0w` (alignée sur la clôture s22 d'après le mémo). Revues v1 des autres relecteurs non lues. Aucun code, aucun cadrage, aucune base modifiés ; rien commité ni déployé.
> Références `fichier:ligne` relatives à `apps/web/` sauf mention contraire.

## 1. Notes

| Critère | v0 | v1 | Motif principal |
|---|---|---|---|
| Faisabilité | 7 | 8/10 | Tous les prérequis cachés de la v0 sont écrits (jetons, plan à écrivain unique, `StoreEntitlement`, notification sans compte, job d'envoi). Restent trois mécanismes promis sans support : vanne du jour lisible hors ligne « toujours » (le serveur ne connaît que le jour en cours), série comptée sur l'exercice du jour (aucune route ne le reçoit), « accès offert » (n'existe pas dans le schéma). |
| Exactitude par rapport au code | 5 | 7/10 | Les faits du §7 sont justes dans l'ensemble. Quatre erreurs : widget « inerte » (faux, il est en ligne, erreur héritée de ma v0), « le compte avant paiement supprime `TRANSFER` » (faux, erreur héritée de ma v0), « `activerLettreHebdo` à l'achat » (faux et nuisible, nouveau), règle « sélection tout public quand la vanne du jour est d'une catégorie exclue » (ne correspond pas au code). Les deux `[À VÉRIFIER par @fullstack]` du §3 restaient ouverts : tranchés ici. |
| Sécurité (comptes, Premium, jetons) | 4 | 7/10 | Jetons, rotation, déduplication après succès, temps constant, faille du `DELETE` push : traités. Nouveaux trous : droits `SANDBOX` acceptés en production + lien TestFlight public (S3) = Premium gratuit pour n'importe qui, site compris ; appel à `activerLettreHebdo` qui effacerait un désabonnement explicite ; série et XP du visiteur recopiés tels quels dans le compte (valeur fournie par le client). |
| Cohérence Premium site ↔ app | 5 | 7,5/10 | Écrivain unique, gardes croisées, écrans « géré par Apple », réconciliation : bons. Manque le modèle de l'« accès offert » et l'inventaire des comptes Premium actuels sans Stripe avant la bascule (sinon `recalculerPlan` les rétrograde) ; fuite du Premium bac à sable vers le site. |
| Testabilité | 4 | 7/10 | Stratégie écrite (Jest par route, fixtures RevenueCat, Maestro cloud, TestFlight). Manque : sur quel serveur tournent les testeurs publics du lot 8 (la préproduction n'a pas leurs comptes), et le test de non-régression de la bascule `recalculerPlan` sur une copie de la base. |
| Plan technique par dépendances | 6 | 6,5/10 | Lots 5a/5b et préproduction avant la vente : bien. Le lot 5a ne dépend ni des textes (lot 3), ni du juridique (lot 4), ni du go de Thomas alors qu'il porte S1, S5 et S7 ; le lot 8 (testeurs publics) ne dépend pas de la mise en production de l'API mobile ; la route de pratique du jour n'est dans aucun lot. |
| **Note globale** | **5,2** | **7,2/10** | **GO sous réserve, sous la barre de 9** : 9 corrections obligatoires (§4), dont 3 erreurs factuelles à retirer du texte et 2 trous de sécurité. Aucune ne remet en cause l'architecture. |

## 2. Statut de mes 15 corrections obligatoires v0 (vérifié dans le texte, pas seulement au §16)

| # v0 | Sujet | Statut | Où dans la v1 | Vérification dans le code / réserve |
|---|---|---|---|---|
| 1 | Comptes Google et mot de passe oublié | **Traitée** | §7 « Comptes Google », §12 S5, décision 7 | Juste : `forgot-password/route.ts:46` exige `passwordHash` ; `reset-password/route.ts:49-53` pose le mot de passe sans condition, donc seul `forgot-password` change ; `authorizeCredentials` accepte ensuite le compte (`lib/auth.ts:52-55`). Effet de bord à écrire (souhaitable S-3) : `passwordChangedAt` posé déconnecte la session web Google sous 5 min (`lib/auth.ts:226-232`). |
| 2 | Plan à deux sources, écrivain unique | **Traitée, réserve** | §7 « Plan Premium », « Bouton admin » ; lot 5a « avant toute vente » | Les 5 écrivains sont bien nommés. Réserve : « OU accès offert » s'appuie sur une notion absente du schéma (aucun champ ni table ; l'admin ne sait que synchroniser avec Stripe, `app/api/admin/users/route.ts:100-187`). Voir O-5. |
| 3 | Webhook RevenueCat à réécrire | **Partielle** | §7 « Webhook RevenueCat » | Les 7 défauts sont repris et la réécriture est juste. Mais la ligne ajoute « pas d'`activerLettreHebdo` » / « `activerLettreHebdo` à l'achat » : erreur (O-3). Et « `TRANSFER` géré » (§7) contredit « cela supprime `TRANSFER` » (§9.7) : O-2. |
| 4 | `StoreEntitlement` séparé de `Subscription` | **Traitée** | §7 « Modèle Apple » | Conforme (`prisma/schema.prisma:504-522`, `Subscription` reste Stripe). |
| 5 | Double abonnement, écrans « géré par Apple » | **Traitée** | §7 « Double abonnement », §9.7, §12 S1 | Conforme : garde dans `createCheckoutSession` (`lib/stripe.ts:155`), refus côté app avant StoreKit. |
| 6 | Achat sans compte | **Traitée, une phrase fausse** | §9.7, décision 3 | Reco reprise. La phrase « supprime les identifiants orphelins et `TRANSFER` » vient de ma v0 et elle est fausse : O-2. |
| 7 | Notification sans compte (`PushToken`) | **Traitée** | §7 « Notification sans compte » | Migration et route publique conformes. Souhaitable S-5 : `onDelete: SetNull` plutôt que cascade pour l'installation. |
| 8 | `daily-push` à réécrire en job | **Traitée, réserve** | §7 « `daily-push` », lot 5b | Conforme. Réserve : « jour local » de l'envoi contre jour UTC du contenu et jour de Paris de la série (O-6). |
| 9 | Bac à sable, préproduction avant la vente | **Partielle** | §7 « Bac à sable », lot 6 | Règle et ordre corrects. Trou nouveau : SANDBOX accepté en production + lien TestFlight public (S3, lot 8) (O-4). |
| 10 | Identifiant d'app au lot 0 | **Traitée** | §10, décision 2, lot 0 | Conforme. |
| 11 | Jetons mobiles dédiés | **Traitée** | §7 « Jetons mobiles » | Conforme (15 min, `jose`, `MobileSession`, famille, `passwordChangedAt`, cascade). Les 4 routes d'authentification ne sont plus listées : souhaitable S-6. |
| 12 | Routes « réutilisables après utilitaire », fiches par slug | **Traitée** | §7 « Routes existantes » | Conforme : 26 fichiers de `app/api` appellent `getServerSession(` (34 appels), compte recompté. La fiche doit porter l'exception « exercice ouvert pour la vanne du jour » (§3) : couvert par O-1. |
| 13 | File hors ligne idempotente, progression Premium | **Traitée** | §4 « Hors ligne » | Conforme. |
| 14 | Tests sans Mac | **Traitée** | §8 « Tests sans Mac », lot 12 | Conforme ; réserve sur l'environnement des testeurs publics (O-8). |
| 15 | Marqueurs levés par le code ou une source | **Partielle** | §7, §8, §9.5 | Les marqueurs de la v0 sont levés. Mais deux `[À VÉRIFIER par @fullstack]` restaient au §3 (`/api/daily`, gabarits de cartes), tranchés au §3 ci-dessous, et un fait faux persiste (widget « inerte », O-7). |

Bilan : 10 traitées, 2 traitées avec une phrase fausse héritée de ma v0, 3 partielles.
