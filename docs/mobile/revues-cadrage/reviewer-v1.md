# Relecture à l'aveugle du cadrage v1 de l'app iPhone : @reviewer (tour 2)

> Livrable relu : `docs/mobile/cadrage-app-native-s23.md` (v1, 04/11/2026, @product-manager, 299 lignes).
> Relu contre : ma revue `reviewer-v0.md`, la grille `docs/mobile/attentes-utilisateur.md`, `project-context.md` (mémo s22), `docs/founder-preferences.md` (119 [CHOIX UTILISATEUR]), `CLAUDE.md`, code réel (`api/daily/route.ts`, `api/user/xp/route.ts`, `lib/champs-premium.ts`, `lib/parcours-access.ts`, décompte des `getServerSession`), `donnees-gsc-2026-10.txt`, 3 recherches web (04/11/2026).
> Revues v1 des autres relecteurs non lues. Aucun fichier modifié hors de celui-ci, rien commité. La §1 « Grille de Thomas » en attente n'est pas pénalisée.

## 1. Notes

| # | Critère | v0 | **v1** | En une ligne |
|---|---|---|---|---|
| 1 | Cohérence interne et avec le projet réel | 6 | **8** | Le §7 (faits du code) est un vrai saut : push, webhook, plan, double abonnement justes. Restent : deux « vannes du jour » possibles, XP du visiteur contraire au code, « supprime `TRANSFER` » faux |
| 2 | Conformité aux préférences fondateur | 7 | **8** | Identité réelle, bandeau, réassurance, `REPLIT_ACTIONS.md`, étalons : traités. Mais série et XP ouverts au visiteur sans décision, contre le CHOIX du 05/10 « rien n'est ouvert ni retiré aux visiteurs » |
| 3 | Zéro donnée inventée, sources, [À VÉRIFIER] justifiés | 6 | **8** | Données Search Console exactes (383 et 339 impressions vérifiées), commission corrigée, sources primaires. Nouveau [À VÉRIFIER] sur un fait lisible (`/api/daily`), un décompte faux (26 au lieu de 27) |
| 4 | Complétude du périmètre V1 | 7 | **8,5** | États transverses, premier lancement, suppression, RGPD, bac à sable : complets. Manquent le risque 5.1.1 de l'achat avec compte et le comportement de restauration |
| 5 | Clarté des décisions laissées à Thomas | 6,5 | **8** | 15 décisions avec reco et alternative, aucune décision fondateur rouverte. Décision 3 sans son risque, décision 4 sans le volet visiteur, réponses du §1 présumées dans 4 endroits |
| 6 | Plan par dépendances exploitable | 7 | **7,5** | Mes 5 trous v0 comblés, build 0 bien placé. Mais @legal (lot 4) n'est la dépendance d'aucun lot, la page `/app` n'a pas de lot, les textes (lot 3) manquent aux lots 7, 8 et 10 |
| | **Note globale** | 6,5 | **8 / 10** | NO-GO pour 9/10 : 2 corrections v0 partielles, 7 obligatoires nouvelles, toutes courtes |

## 2. Statut de mes 13 corrections v0 (vérifiées dans le texte, pas dans le §16)

| v0 | Sujet | Statut | Preuve dans la v1, et ce qui manque |
|---|---|---|---|
| O1 | Notification sans compte | **Traitée** | §7 l.115 (`userId` facultatif, `installationId`, fuseau, heure locale, route publique, rattachement) et l.116 (`daily-push` **réécrit**, Expo, tick `*/15`, jour local). Faille du `DELETE` trouvée en plus |
| O2 | Webhook RevenueCat (5 points) | **Traitée** | §7 l.117-120 : (a) inconnu = 200 avec trace ; (b) `TRANSFER` géré ; (c) `recalculerPlan` seul écrivain ; (d) `StoreEntitlement` séparé (meilleur que ma piste `Subscription`) ; (e) `activerLettreHebdo`. Tests Jest. Lots 5a et 10 |
| O3 | Premium sans compte | **Partielle** | Supprimé par la reco « compte avant paiement » (§9.7 l.169, décision 3). Mais mon [À VÉRIFIER : 5.1.1(v)] sur cette option a disparu alors qu'elle devient la reco : voir N2 |
| O4 | XP et série du visiteur | **Traitée, à revoir** | §3 l.52 : série et XP locaux, règle de fusion écrite, H3 remplacée (§6). C'était ma reco v0 ; elle ignorait que l'XP est réservée à Premium par décision s15 : voir N4 (erreur de ma part, assumée) |
| O5 | Mot de passe des comptes Google | **Traitée** | §7 l.114, §12 S5, décision 7 |
| O6 | 5 [À VÉRIFIER] vérifiables | **Traitée** | (a) l.115 ; (b) l.125, §9.5, décision 14 ; (c) l.124 « `GET /api/carnet` à créer » ; (d) l.119 ; (e) §8 l.133. Le défaut réapparaît ailleurs : N7 |
| O7 | Données réelles d'audience | **Traitée** | §2 l.25-30, chiffres et source exacts (contrôlés dans `donnees-gsc-2026-10.txt`), deux conséquences écrites, H0 sur le lecteur de vannes |
| O8 | Changements du site | **Partielle** | §12 S1 à S9, décision 9, règles du 17/10, 18/10, 21/10 citées. Mais S2 (page `/app`) n'est porté par aucun lot alors que H0 et S3 en dépendent, et S7 est au lot 5a sans dépendre de @legal : voir N5 |
| O9 | Décision 1 (entité, DSA) | **Traitée** | §9.4 l.158-159, décision 1 : nom légal affiché, DSA pour tous, coordonnées professionnelles, chaîne entité, D-U-N-S, inscription, programme. Réserve mineure : SOU-9 |
| O10 | Commission Apple | **Traitée** | §9.1 l.144 reprend la formulation demandée ; l.145 lien externe 15 % et 10 % (confirmé par la presse, ma recherche ci-dessous), conclusion « n'économise rien » retirée |
| O11 | Réassurance fausse pour Apple | **Traitée** | §9.2 l.150 : phrase du site exclue, réassurance propre au lot 3, question courte à @legal (14 jours, `RenewalReminder`) |
| O12 | 3 trous du plan | **Traitée** | Premier lancement et états transverses au lot 7, plan de marquage au lot 6 avant le 7, lot 13 « EN PRODUCTION », 10/10 @design et @ux au lot 12, relecture à l'aveugle au lot 3. D'autres trous apparaissent : N5 |
| O13 | Nom de 36 caractères | **Traitée** | §10 l.185 et décision 12 : nom « Deviens Marrant », sous-titre ≤ 30. Décompte faux d'un candidat : SOU-1 |

Bilan : **11 traitées, 2 partielles (O3, O8), 0 non traitée.**

Souhaitables v0 : S1 (4.8) traitée (§4, §11) ; S2 (widget) traitée ; S3 (profil) traitée ; S4 (reco sans prix) traitée ; S5 (métadonnées) partielle, voir SOU-8 ; S6, S7, S8, S9, S10, S11 traitées.
