# Relecture à l'aveugle du cadrage v2 de l'app iPhone : @reviewer (tour 3)

> Livrable relu : `docs/mobile/cadrage-app-native-s23.md` (v2, 04/11/2026, @product-manager, 313 lignes).
> Relu contre : ma revue `reviewer-v1.md`, la grille `docs/mobile/attentes-utilisateur.md`, `CLAUDE.md`, les sources des vannes du §2.1 (`docs/content/blagues-seed.json`, `apps/web/src/data/joke-decryptages.json`), la base telle que documentée (`docs/copy/catalogue-vannes-valides.md`, généré depuis la base le 01/10 ; `docs/qa/diagnostic-vannes-s11-s20.md` ; `__tests__/lib/blagues-seed-s20.test.ts`), le code (`config/widget-vanne-du-jour.ts`, `lib/widget/vanne-du-jour.ts`, `lib/scheduler/prepared-content.ts`, `lib/startup-tasks.ts`, `components/home/daily-content.tsx`), 2 recherches web (04/11/2026).
> Revues v2 des autres relecteurs non lues. Aucun fichier modifié hors de celui-ci, rien commité. Le §1 en attente de Thomas et les sections [PROVISOIRE : question N] ne sont pas pénalisés.

## 1. Notes

| # | Critère | v1 | **v2** | En une ligne |
|---|---|---|---|---|
| 1 | Cohérence interne et avec le projet réel | 8 | **7,5** | Mes 7 corrections sont faites. Mais la vanne du jour de l'app a maintenant trois sources mélangées (calendrier du site, rotation du widget, tirage par installation), et les « vannes réelles du site » du §2.1 ne sont pas en production |
| 2 | Conformité aux préférences fondateur | 8 | **8,5** | Série, points et Garder soumis à Thomas en citant le 05/10 et s15 ; P0 s18 et `REPLIT_ACTIONS.md` respectés. Reste : présenter au panel des textes s11 jamais relus à l'aveugle comme le contenu du site |
| 3 | Zéro donnée inventée, sources, [À VÉRIFIER] justifiés | 8 | **7,5** | Les deux vannes sont recopiées sans une virgule de différence avec leurs fichiers, mais ces fichiers ne sont pas la base. « Lues dans l'ordre du fichier » est faux, l'exemple couple est coupé sans le signaler, un [À VÉRIFIER] porte sur un fait déjà établi dans le dépôt, « SDK 55 confirmée » est périmé |
| 4 | Complétude du périmètre V1 | 8,5 | **8,5** | 5.1.1, restauration, accès offert, bac à sable, carburant : complets. Manquent : l'installation sans permission de notification, les textes de Parcours, Explorer, Profil et des états |
| 5 | Clarté des décisions laissées à Thomas | 8 | **8,5** | 17 décisions, chacune avec son risque et son alternative ; aucune décision fondateur rouverte. La décision 5 est posée sans la taille des thèmes, pourtant lisible aujourd'hui (9, 8, 16, 4 vannes) |
| 6 | Plan par dépendances exploitable | 7,5 | **8,5** | Les 4 trous de N5 sont fermés. Restent : aucun lot de textes pour le lot 9, liens universels sans lot |
| | **Note globale** | 8 | **8 / 10** | NO-GO pour 9/10 : mes 7 corrections v1 sont faites, mais il y a 5 nouvelles corrections obligatoires (M1 à M5), dont 2 de fond (M1, M2) |

Mesure de l'écart : sur 313 lignes, la v2 réécrit en profondeur le §2.1 (nouveau), le §3 (nouvelles sous-parties 3.2 à 3.5), le §7 (lignes « Restauration », « Bac à sable », « Widget », « Routes »), le §13 et le §14. Ce n'est pas une retouche cosmétique. Décompte fait à la lecture, pas avec un outil de diff (aucun shell disponible ici).

## 2. Statut de mes 7 corrections v1 (vérifiées dans le texte, pas dans le §16)

| v1 | Sujet | Statut | Preuve dans la v2, et réserve |
|---|---|---|---|
| N1 | Une seule vanne du jour, jour cohérent | **Traitée** | §3.2 l.81 (une vanne assignée, même identifiant pour la notification, l'écran Aujourd'hui, le widget, l'exercice et la série ; la notification embarque l'identifiant). l.82 : jour unique en UTC, assumé, avec l'écart de `progression.ts` signalé. J'avais demandé « une seule définition », le PM a choisi l'UTC : c'est recevable. Réserve Canada : SOU-2. La règle unique est juste, mais la SOURCE de la vanne assignée ne l'est pas : voir M2 |
| N2 | Risque 5.1.1 du compte avant achat | **Traitée** | §11 l.223 (risque, parades, plan B) ; décision 3 l.273 ; §9.7 l.206 (la raison du compte dite à l'écran, et tout le gratuit reste sans compte) |
| N3 | « Supprime `TRANSFER` » | **Traitée** | §7 l.181 (« pas les transferts », trois cas cités), l.180 (fixture Jest du transfert), décision 8 (réglage, reco, alternative). Il reste une trace de l'ancienne idée : SOU-1 |
| N4 | Série et points du visiteur | **Traitée** | §3.3 l.93-97 (cite le 05/10, s15 et le code) ; décision 4 avec reco et deux alternatives ; build 0 conditionné à la décision. Il reste des présomptions ailleurs : SOU-4 |
| N5 | 4 dépendances | **Traitée** | (a) 4b avant 5a-écrans, 10 et 13, 4a avant 8 ; (b) 3a avant 7 et 8, 3b avant 10 ; (c) S2 rattachée au lot 8 (§12, §13) ; (d) lot 2 avant le lot 8. D'autres trous : M5, SOU-9 |
| N6 | Présomptions des réponses de Thomas | **Traitée** | Marques [PROVISOIRE] sur les §2 à §6 et le §13 ; l.21 « hypothèse de travail » ; le lot 10 « ne disparaît pas tant que la réponse manque ». Il manque la marque sur le §9 : SOU-5 |
| N7 | Fait `/api/daily` | **Traitée** | §3.2 l.89 [FAIT] (j'ai vérifié : `daily-content.tsx:206-214` affiche « Pourquoi ça marche » et « À toi de jouer » à tous) ; S10 ; question posée à part à Thomas. L'effet sur l'offre est mal délimité : voir M2 |
| v0 O3 | Premium sans compte | **Traitée** | Soldée par N2 |
| v0 O8 | Changements du site | **Traitée** | Soldée par N5(c) : S2 au lot 8, avant S3 |

Bilan : **7 sur 7 traitées, et O3 et O8 soldées.** Mes souhaitables v1 sont traités aussi : SOU-1 (« Une vanne par jour », 18 caractères, compté juste), SOU-2, SOU-3, SOU-4, SOU-5, SOU-6, SOU-7, SOU-8, SOU-9, SOU-10, SOU-11, SOU-12, SOU-13.

## 3. Contrôle des deux vannes du §2.1 contre leurs sources

| Élément | Comparé à | Résultat |
|---|---|---|
| Vanne A : amorce, chute, catégorie, niveau | `blagues-seed.json` l.3-7 (id 1) | Identique au caractère près |
| Vanne A : technique, « Pourquoi ça marche », « À toi de jouer » | `joke-decryptages.json` l.3-6 | Identique (les `\"` du JSON rendus par des guillemets droits) |
| Vanne B : amorce, chute, catégorie, niveau | `blagues-seed.json` l.20-24 (id 7) | Identique |
| Vanne B : technique, « Pourquoi ça marche », « À toi de jouer » | `joke-decryptages.json` l.39-42 | Identique |
| Exemple couple | `joke-decryptages.json` l.33-35 | Amorce exacte. Le « Pourquoi ça marche » est **coupé** : la 2e phrase (« Le rire vient du contraste… ») manque, sans « […] ». Cette vanne n'est ni dans le seed ni dans `catalogue-vannes-valides.md` |
| « Lues dans l'ordre du fichier, sans tri » | ordre du seed | **Faux pour B** : l'id 2 (« Mon psy… »), placé entre A et B, a été sauté sans que ce soit dit |
| « Vannes réelles du site, telles qu'elles existent » | base (diagnostic s20, catalogue du 01/10) | **Faux**, voir M1 |

Il n'y a aucune invention de texte : tout est recopié. C'est la source qui est fausse.

## 4. Nouvelles corrections OBLIGATOIRES (bloquantes pour 9/10)

**M1. Les deux « vannes réelles du site » du §2.1 ne sont pas en production.**
Emplacement : titre du §2.1 et l.40-56 ; §5 C3 l.139 ; changement (1) de l'en-tête l.7.
Constat : les vannes A (seed id 1) et B (seed id 7) sont des réécritures s11 qui ont un `previousContent`. Le diagnostic s20 établit que « aucune réécriture s11 de vanne n'est en base » et que « les textes s11 n'ont jamais été en ligne ni relus à l'aveugle avec la barre s14 » (`diagnostic-vannes-s11-s20.md` l.8-11). Le test s20 le confirme : seules 6 entrées du seed portent le texte de la base, les id 2, 18, 80, 109, 266 et 323 (`blagues-seed-s20.test.ts` l.5-6 et 23-30). En base, la ligne de la vanne A (`cmmnsqn120000th63o435xsb0`, dans les 93) porte un autre texte : « Mon détecteur de fumée me sert de minuteur… » (`catalogue-vannes-valides.md` l.8). L'ancien texte de B (« Tu es irremplaçable ») n'est plus actif. Les décryptages de `joke-decryptages.json` sont indexés par le texte s11 (`startup-tasks.ts:832-835`), donc ils ne sont pas servis non plus pour ces vannes. La capture s21 où l'on voit « Mon manager me dit… » a été prise sur une base jetable remplie par le seed (`revue-visuelle-s21/index-captures.md` l.3), pas sur la production. L'exemple couple (« agenda partagé ») n'est pas non plus au catalogue validé. Conséquences : le panel jugerait C3 sur un contenu que personne ne reçoit, et le [À VÉRIFIER : texte en base identique au seed] porte sur un fait déjà tranché dans le dépôt (le même défaut que N7 en v1).
Correction : remplacer A et B par deux vannes de `catalogue-vannes-valides.md`, la seule liste « autorisée, à recopier mot pour mot » (l.3), prises si possible dans les 93. Lire leur « Pourquoi ça marche » et leur « À toi de jouer » dans la base (fiche de production ou lecture seule par @fullstack), pas dans le JSON. Dire comment elles ont été choisies. Pour la preuve qu'il existe du contenu de situation, citer les sections COUPLE, DATING et SOIREES du catalogue (l.65, 128, 140) au lieu de l'exemple couple, ou bien remettre la phrase coupée avec « […] ». Retirer « lues dans l'ordre du fichier ». Le constat (1) du PM sur le format de « À toi de jouer » est à refaire sur les vrais textes.

**M2. La vanne du jour de l'app a trois sources incompatibles.**
Emplacement : §3.2 l.84, 85, 87, 88 et 89 ; lot C(a) ; H-stock (§6) ; décision 5.
Constat : le texte combine trois mécanismes. (1) Le **calendrier du site** : l.88 « le job d'envoi appelle `ensureDailyContentFromStock` », qui remplit le `DailyContent` du site (`prepared-content.ts:110`, `jobs.ts:54`), avec le stock de « 109 jours inédits » du lot C(a) et H-stock. (2) La **rotation du widget** : l.87, la route « importe `getWidgetVanneDuJour` », qui donne une seule vanne pour tout le monde (modulo 93, `widget/vanne-du-jour.ts:150`). (3) Le **tirage par installation** : l.85, déterministe, dans le pool validé filtré par thèmes, « sans répétition avant épuisement ». Ces trois sources donnent trois vannes différentes le même jour. Le l.89 suppose ensuite que, sans thème, la vanne de l'app est celle du site (« ne change pas l'offre »), alors que le l.84 dit que, sans thème, elle est tirée dans les 93 par installation : elle diffère donc de la vanne du site pour **tout le monde**, et l'élargissement de l'offre d'exercices n'est plus limité aux personnes qui choisissent des thèmes. Enfin, H-stock mesure le calendrier, pas le pool par thème.
Correction : choisir et écrire UN modèle. (a) Vanne du site pour tous, et les thèmes remplacent la vanne seulement pour qui en choisit ; ou (b) tirage par installation pour tous. Puis aligner sur ce choix le l.88 (`ensureDailyContentFromStock` ou non), le l.87 (supprimer l'import de `getWidgetVanneDuJour` s'il ne sert qu'au filtre de l'écran verrouillé), le lot C(a), H-stock, et le volet exercice de la décision 5, en disant à qui il s'applique.

**M3. Installation sans permission de notification, et contournement de la barrière de l'exercice.**
Emplacement : §3.2 l.85 (« aucun état serveur nécessaire ») et l.89 (« jamais un paramètre du client ») ; §7 l.175 (route `push` qui exige un « jeton Expo validé ») ; §4.1.
Constat : (a) Une personne qui refuse la notification n'a pas de jeton, donc pas d'installation enregistrée. Le texte ne dit alors ni où vivent ses thèmes, ni comment la route du jour et le widget calculent sa vanne assignée. Ce n'est pas un cas rare : H1 prévoit qu'une personne sur deux, ou moins, accepte. (b) Si l'assignation se calcule seulement à partir de l'identifiant d'installation et des thèmes, et que ces deux valeurs sont générées par l'app, le client les contrôle. Il suffit de créer des identifiants pour récolter un à un les « À toi de jouer » que le site réserve à Premium depuis s21. La règle « identifiant comparé côté serveur » ne protège rien si l'entrée vient du client.
Correction : enregistrer l'installation dès le premier lancement, sans attendre la permission (jeton Expo facultatif, secret d'installation, thèmes stockés côté serveur, limite de création par IP). La route du jour exige ce secret. L'exercice n'est servi que pour l'assignation que le serveur a enregistrée pour cette installation ce jour-là. Le risque résiduel est écrit dans la décision 5.

**M4. La décision 5 est posée sans la taille des thèmes, qui est lisible aujourd'hui.**
Emplacement : §3.2 l.84-85 ; décision 5 l.275 ; §5 C7.
Constat : le catalogue validé (base au 01/10) compte **16 vannes COUPLE, 9 DATING, 8 SOIREES, 4 ECOLE** (`catalogue-vannes-valides.md` l.65-159). Ces chiffres sont bien en dessous du seuil de 60 que le §3.2 fixe lui-même : avec « sans répétition avant épuisement », une personne qui coche « dates » revoit la même vanne tous les 9 jours environ. Par ailleurs, la liste des catégories « lues dans le seed » oublie ECOLE, SITUATION, GAMING, RESEAUX_SOCIAUX et PARENTS. Or la vie étudiante est un motif de désinstallation de Yanis, le persona principal (grille §1).
Correction : écrire ces chiffres, datés et à remettre à jour au lot C, dans le §3.2 et dans la décision 5. Dire que tous les thèmes de situation sont aujourd'hui sous le seuil, et ce que cela implique (mélange avec « tout le reste », ou commande d'un lot par thème au lot C(d) avant l'ouverture des thèmes). Prendre la liste des catégories dans le catalogue, ECOLE comprise.

**M5. Aucun lot de textes pour Parcours, Explorer, Profil, les états transverses et la suppression.**
Emplacement : §13, lots 3a/3b, 9 et 11 ; §4.7 (« chacun avec message exact ») ; §3.5.
Constat : le lot 3a couvre le geste et le lot 3b l'offre, la fiche, les notes et les e-mails. Les messages des 8 états transverses, la confirmation de suppression (« ton abonnement Apple continue »), les libellés de Parcours, d'Explorer et de Profil, et les noms que le §3.5 renvoie aux étalons (série, défi, carnet, lettres, thèmes) n'ont aucun lot. Le lot 9 ne dépend d'aucun lot 3. Le lot 11 (widget : accroche neutre, nom distinct) ne dépend pas du lot 3a. C'est le même défaut que N5(b), qui contredit la règle d'or P0 s18 et l'interdiction de vocabulaire du §3.5.
Correction : ajouter ces textes au lot 3b (ou créer un lot 3c), avec étalons et relecture à l'aveugle. Ajouter cette dépendance au lot 9, et le lot 3a au lot 11.

## 5. Corrections SOUHAITABLES

**SOU-1. `TRANSFER` présenté comme le coût du plan B (§11 l.223, décision 3 l.273).** Le §7 l.181 dit que le transfert existe dans les deux options. Écrire plutôt : plan B = « Premium sans compte un temps, et fusion après l'achat ».
**SOU-2. Jour UTC hors d'Europe (§3.2 l.82, décision 12).** Au Québec, le jour change vers 19 h ou 20 h. Deux pratiques dans la même soirée comptent alors pour 2 jours de série, et la vanne change en pleine soirée. Le dire, ou limiter le lancement à l'Europe tant que cette règle tient.
**SOU-3. Vanne retirée entre l'envoi et le toucher (§3.2 l.81).** « Aucun écart » ne dit pas ce qui s'affiche. Rouvrir une vanne retirée (souvent pour sa qualité) est à exclure ; écrire le repli (état « contenu retiré » et vanne de remplacement).
**SOU-4. Présomptions des décisions 4, 5 et 6.** §4 l.118 (« 7 vannes gardées en local », exercice de la vanne assignée dans les droits du visiteur), §4.2 (« série masquable »), §5 C4 et C8 : ajouter « si décision N ».
**SOU-5. Marque sur le §9.** Le §1 le donne provisoire pour la question 5 ; ajouter « [PROVISOIRE : question 5] » à son titre.
**SOU-6. SDK Expo (§8 l.193).** « SDK 55 confirmée » est périmé : la SDK 56 est sortie le 21/05/2026, et Expo recommande la 57 (régression mémoire Hermes de la 56 avec reanimated). Garder la règle « dernière stable au début du lot 7 » et retirer la mention « 55 confirmée ».
**SOU-7. Dates du stock (lot C).** 02/11 + 109 jours = 19/02/2027, donc « mi-février » plutôt que « fin février » ; 86 jours = 27/01/2027, juste.
**SOU-8. Liens universels sans lot (§4.8, §3.1 étape 5).** Les rattacher au lot 9, qui dépend alors du lot 6b (AASA, identifiant d'équipe). Au build 0, le lien du partage ouvre le site : le dire.
**SOU-9. Lot 5a-moteur.** L'inventaire des comptes PREMIUM sans Stripe actif, « classés par Thomas » (§7 l.177), est une dépendance : l'ajouter dans la colonne « Dépend de ».
**SOU-10. Décision 8.** « Comme Apple le prévoit » n'a pas de source : retirer ou citer.
**SOU-11. Commission UE (§9.1).** 26 % la première année et 15 % ensuite, avec effet au 01/10 : confirmé par la presse (Nasdaq, iClarified), mais je n'ai pas trouvé le communiqué Apple. Le marquer [À VÉRIFIER] comme le lien externe, ou citer l'URL de la newsroom.

## 6. Ce qui est solide (à ne pas casser)

- §3.2 « Règle unique » : une seule vanne assignée, l'identifiant porté par la notification, aucun recalcul à l'ouverture. Le cœur est juste, M2 porte seulement sur la source.
- §3.3 et §3.4 : série, points et réserve « Garder » soumis à Thomas, en citant le 05/10, s15 et le code. Le compromis de la réserve locale est bien argumenté.
- §3.5 : vocabulaire de cours banni, libellés renvoyés aux étalons, critère binaire de relecture.
- §7 : restauration, bac à sable, accès offert (`PremiumGrant`), `recalculerPlan` en mode alerte avant écriture, webhook qui n'appelle jamais `activerLettreHebdo`.
- §13 : build 0 réduit au geste, 5b-0 en production avant le lot 8, avocat comme critère de GO des lots 10 et 13.
- Zéro tiret cadratin (0 occurrence), aucune durée en semaines dans le plan, net par abonné juste (1,99 / 1,2 × 0,85 = 1,41).

## 7. Vérifications externes du relecteur (04/11/2026)

| Point | Résultat | Source |
|---|---|---|
| Commission UE | 26 % (au lieu de 30 %) la première année d'un abonnement, 15 % ensuite, effet au 01/10/2026 ; communiqué Apple non trouvé | [Nasdaq](https://www.nasdaq.com/articles/apple-cut-its-standard-eu-app-store-commission-30-26), [iClarified 18/08/2026](https://www.iclarified.com/101814/apple-revises-eu-app-store-terms-replaces-core-technology-fee-with-5-commission), [Daring Fireball](https://daringfireball.net/2026/08/apple_eu_business_terms_conceding_little) |
| SDK Expo | SDK 56 sortie le 21/05/2026 ; régression corrigée dans la 57, que recommande Expo | [Expo SDK 56](https://expo.dev/changelog/sdk-56), [expo.dev/sdk/56](https://expo.dev/sdk/56) |

---
**Handoff → @orchestrator**
- Fichier produit : `docs/mobile/revues-cadrage/reviewer-v2.md`
- Verdict : NO-GO pour 9/10, note **8/10** (v1 : 8). Corrections v1 : 7 sur 7 traitées, O3 et O8 soldées. **5 obligatoires nouvelles** (M1 à M5) ; 11 souhaitables
- Top 3 : M1 (les vannes du §2.1 ne sont pas en base : les reprendre dans le catalogue validé), M2 (une seule source pour la vanne du jour de l'app), M3 (installation sans notification, et barrière de l'exercice contournable)
- Agent à relancer : @product-manager (v3). M1 et M4 se corrigent avec `catalogue-vannes-valides.md` seul ; M3 gagne à être validée par @fullstack. Aucune décision de Thomas rouverte
---
