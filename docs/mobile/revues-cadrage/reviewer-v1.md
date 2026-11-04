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
| | **Note globale** | 6,5 | **8 / 10** | NO-GO pour 9/10 : 7 obligatoires (N1 à N7, qui soldent aussi les 2 corrections v0 partielles), toutes courtes |

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

## 3. Nouvelles corrections OBLIGATOIRES (bloquantes pour 9/10)

**N1. Deux « vannes du jour » possibles : en définir une seule pour l'app.**
Emplacement : §3 tableau l.44 (« Ouvre directement la vanne du jour »), l.51 (sélection tout public « quand la vanne du jour est d'une catégorie exclue »), l.52 (série = exercice « de la vanne du jour »), §7 l.116 (jour local).
Constat : les jours où la vanne du site est en DATING, SOIREES ou COUPLE, la notification montre une vanne tout public X et le toucher « ouvre la vanne du jour » Y : la mise en place lue sur l'écran verrouillé n'est pas celle qui s'ouvre, le critère « 1 geste » tombe, et on ne sait pas quel exercice compte pour la série. En plus, `/api/daily` choisit le jour en UTC (`todayUTC()`, `route.ts:18`) alors que l'envoi est calculé en jour local : entre minuit et 1 h ou 2 h à Paris, la vanne servie est celle de la veille.
Correction : écrire la règle « vanne du jour de l'app = la vanne notifiée, la même dans Aujourd'hui, le widget, la notification et la série, tirée de la sélection tout public » (ou l'inverse, mais une seule), et ajouter au lot 5b une route du jour en jour local (fuseau de l'installation).

**N2. Décision 3 : le risque 5.1.1 de l'inscription avant achat a disparu.**
Emplacement : §9.7 l.169, décision 3 l.245, §11 (aucune ligne).
Constat : Apple refuse régulièrement, au titre de 5.1.1, une app qui exige une inscription avant l'achat d'un abonnement « non lié à un compte », y compris quand le motif est de reconnaître un achat fait sur une autre plateforme (forums développeurs Apple, sources ci-dessous). La v0 portait ce point en [À VÉRIFIER] sur cette option ; la v1 en fait la reco sans le mentionner.
Correction : ajouter une ligne 5.1.1 au §11 et une phrase dans la décision 3 : argument (Premium lié au compte : accès sur le site, favoris, progression, lettre de la semaine, « Ta question à l'équipe »), parade (tout le gratuit reste sans compte, écran qui dit pourquoi le compte est demandé, notes de revue qui l'expliquent), plan B (l'alternative « compte juste après l'achat » déjà écrite, avec `TRANSFER`).

**N3. « Cela supprime `TRANSFER` » est faux.**
Emplacement : §9.7 l.169 ; décision 3 l.245 (« au prix de la gestion de `TRANSFER` »).
Constat : avec `appUserID = User.id`, un même identifiant Apple qui restaure sur un autre compte Marrant déclenche le comportement de restauration de RevenueCat, qui par défaut **transfère** l'achat (et le retire au premier compte) ; l'autre réglage bloque la restauration (documentation RevenueCat « Restore behavior »). Ça arrive dès qu'un couple ou une coloc partage un identifiant Apple, ou quand le relecteur d'Apple restaure sur le compte de démonstration.
Correction : retirer « supprime `TRANSFER` », choisir et écrire le réglage (transfert ou blocage), son effet sur `recalculerPlan` des deux comptes, le message affiché, et un test Jest de ce cas.

**N4. Série et XP locaux du visiteur : contraires au code et au CHOIX du 05/10, ouverts sans décision.**
Emplacement : §3 l.52 (« Visiteur sans compte : série et XP locaux »), §4 l.60 (« droits du visiteur »), §5 C8 l.86.
Constat : l'XP et le suivi de progression sont réservés à Premium (spec s15 §1.1 citée par `lib/parcours-access.ts:5-6` ; `api/user/xp/route.ts:37-45` renvoie 403 « Le suivi de progression fait partie de Premium »). Le CHOIX du 05/10 (founder-preferences l.63) dit « Rien n'est ouvert ni retiré aux visiteurs ». La v1 ouvre série et XP au visiteur dans l'app sans le soumettre à Thomas, et contredit sa propre ligne 60. J'avais recommandé cette option en v0 sans voir la règle s15 : c'est mon erreur.
Correction : faire entrer ce point dans la décision 4 (ou une décision 16), en citant le 05/10 et s15. Reco possible : série du geste visible pour tous (habitude, C8 et C9 de la grille), XP et niveau réservés à Premium comme sur le site. Alternative : rien pour le visiteur (C8 alors à justifier pour lui).

**N5. Plan : quatre dépendances manquantes.**
Emplacement : §13.
Constat et correction : (a) le **lot 4 (@legal) n'est la dépendance d'aucun lot** : l'ajouter au lot 5a (S7 y figure), au lot 8 (des testeurs extérieurs envoient jeton push et événements : `/confidentialite` à jour avant), au lot 10 (CGV mobile, EULA, écran d'offre) et au lot 13 (étiquettes App Privacy) ; (b) le **lot 3 (textes)** manque aux lots 7 (notification, permission, premier lancement), 8 et 10 (écran d'offre) : règle d'or P0 s18 avant toute mise sous les yeux de testeurs ; (c) **S2 (page `/app`) n'a pas de lot** : la rattacher (lot 8 ou un lot site) avec go de Thomas et `REPLIT_ACTIONS.md`, avant H0 et S3 ; (d) le lot 2 dit « seuils avant le premier TestFlight » mais le lot 8 ne dépend pas du lot 2 : l'ajouter.

**N6. Endroits où la v1 présume les réponses de Thomas (§1).**
Emplacement : l.7 (« le centre de gravité devient UN geste quotidien »), titre du §3 (« centre de gravité de la V1 »), §4 « Hors V1 » (liste figée alors que la question 3 porte sur les interdits et indispensables), §5 (conformité affirmée sur une structure qui dépend de la question 1), lot 7 (build 0 = boucle du geste), l.21 « le lot 10 ne disparaît pas » (réponse 5 présumée sans effet).
Constat : le §1 marque ces sections « provisoires », mais rien ne le dit dans les sections elles-mêmes ; un lecteur du §3 ou du plan lit une décision prise.
Correction : ajouter « [PROVISOIRE : question N de Thomas] » dans les titres du §3, du §4, du §5 et sur la ligne du lot 7 ; écrire à la l.7 « hypothèse de travail » au lieu de « devient ».

**N7. [À VÉRIFIER] sur un fait de code lisible, qui change la décision 4.**
Emplacement : §3 l.54, décision 4 l.246, §15 l.262.
Constat : `/api/daily` renvoie la vanne entière (`include: { joke: true }`, `route.ts:21-36` et `83-88`) sans `sansExerciceVanne` (`lib/champs-premium.ts:8`) : l'« À toi de jouer » (`howToApply`) de la vanne du jour est **déjà** servi à tout le monde par l'API publique, alors que les exercices Premium sont dits fermés côté API depuis s21.
Correction : remplacer le [À VÉRIFIER] par ce fait ; reformuler la décision 4 (la question n'est plus technique : afficher dans l'app un exercice que l'API publique sert déjà) ; signaler l'écart à @fullstack, qui le traite hors du cadrage (correctif ou exception assumée, avec go de Thomas).

## 4. Corrections SOUHAITABLES

**SOU-1. Décompte et nom (§10 l.185).** « La vanne du jour, décryptée » fait **27** caractères, pas 26 (toujours sous 30). Ce candidat reprend aussi le nom du widget intégrable s22 dont le §4.8 exige de se distinguer.

**SOU-2. Mot-clé « humour noir » (§10 l.185).** Le conditionner à la décision 5 : sans collection humour noir dans l'app, le mot-clé décrit un contenu absent (règle Apple sur les métadonnées trompeuses) et pèse sur le questionnaire d'âge.

**SOU-3. Persona (§2 l.30).** « Persona d'entrée : Sophie » déplace le persona principal (Yanis, `project-context.md`) sans le dire. La vanne prête à l'emploi sert aussi son travail confié (« de quoi répondre, ce soir », grille §1) : l'écrire, plutôt que de faire de Sophie la porte d'entrée.

**SOU-4. Profil (§4 l.67).** « Connexion/création » : une création de compte hors du trajet d'achat recrée le compte gratuit supprimé le 05/10. Écrire « connexion ; création seulement dans le trajet d'achat ».

**SOU-5. E-mail de recrutement des testeurs (§12 S9, décision 15).** Les 12 comptes gratuits sont inscrits d'office à la lettre du mois, pour la lettre (consentement `lettre-mensuelle-v3`). Un e-mail à part sur l'app sort de cette finalité : question courte à @legal, ou passage dans une lettre approuvée.

**SOU-6. Plan de marquage (lot 6).** Il dépend du lot 0 (D-U-N-S, délais d'Apple) sans raison : le placer au lot 2, parallèle au lot 1.

**SOU-7. Question 5 « connexion seulement » (§1 l.21).** Ajouter à la question posée à @legal l'exception « app de lecture » de 3.1.3(a) (le contenu de Marrant est surtout du texte et de la vidéo, mais les parcours et exercices l'en éloignent probablement), pour que la réponse à Thomas soit complète.

**SOU-8. Métadonnées (§10 l.186).** « Aucune mention d'IA, de concurrent, zéro tiret cadratin » n'est écrit que pour les notes de revue : l'étendre à la description, au sous-titre, aux mots-clés, aux captures et aux textes de notification.

**SOU-9. Décision 1 (l.243).** Ajouter : si l'entité qui existe porte un nom visé par la règle du 29/09 (Issa Capital ou autre identité réelle), le problème est le même qu'en individuel.

**SOU-10. Créneaux de 15 min (§7 l.116, §4 l.63).** L'écran 2 du premier lancement doit proposer des heures au quart d'heure, sinon l'heure choisie n'est pas celle de l'envoi.

**SOU-11. Date d'effet UE (§9.1 l.145).** « Effet 01/10/2026 selon Apple » : ma recherche ne l'a trouvé que dans la presse ; garder [À VÉRIFIER] jusqu'à la lecture de la page Apple.

**SOU-12. `user/xp` (§4 l.71, lot 5b).** La route accepte un `amount` de 1 à 500 fourni par le client, avec un limiteur en mémoire par isolate (`route.ts:11-14`, `26`). Pour l'app, faire calculer l'XP par le serveur à partir de l'action, en plus de la clé d'idempotence.

**SOU-13. Références de code (l.5).** Le PM signale ne pas avoir relu les `fichier:ligne`. J'en ai contrôlé quatre, justes (26 routes `getServerSession`, `user/xp/route.ts:26`, plafonds, `champs-premium.ts`) ; demander à @fullstack une passe de confirmation au début du lot 5 et retirer la mention de l'en-tête.

## 5. Ce qui est solide (à ne pas casser)

- Le §7 « Faits du code et travaux serveur » : le meilleur ajout de la v1, chaque ligne a un fait et un travail.
- Le geste quotidien en 5 étapes à critère binaire (§3) et les moments de conversion bornés, alignés sur la grille (C2, C5, C10).
- Le §5 qui reprend les 11 critères de la grille un par un ; le §12 qui ne présume aucun changement du site accepté ; le §16 de traçabilité (juste, sauf O3, O4 et O8 nuancés plus haut).
- Hypothèses chiffrées honnêtes sur l'échantillon (« des comportements et des verbatims, pas des écarts »), sans critère de ROI (commandement 5).
- Zéro tiret cadratin, aucune durée en semaines, aucun chiffre sans source.

## 6. Vérifications externes du relecteur (04/11/2026)

| Point | Résultat | Source |
|---|---|---|
| Restauration RevenueCat | Par défaut, transfert de l'achat au compte qui restaure ; option « bloquer » | [RevenueCat, Restore behavior](https://www.revenuecat.com/docs/projects/restore-behavior), [Restoring purchases](https://www.revenuecat.com/docs/getting-started/restoring-purchases) |
| 5.1.1 et inscription avant achat | Refus fréquents, y compris pour reconnaître un abonnement acheté ailleurs | [Forum Apple 731471](https://developer.apple.com/forums/thread/731471), [Forum Apple 810103](https://developer.apple.com/forums/thread/810103), [RevenueCat 6041](https://community.revenuecat.com/sdks-51/handling-apple-app-review-rejection-with-revenuecat-s-keep-with-original-app-user-id-setting-6041) |
| Lien externe UE | 15 %, 10 % pour le programme petites entreprises ; date d'effet non confirmée sur source primaire | [Game World Observer, 19/08/2026](https://gameworldobserver.com/2026/08/19/apple-will-reduce-the-app-store-commission-in-the-eu-to-resolve-disagreements-with-the-european-commission), [Cult of Mac](https://www.cultofmac.com/news/apples-eu-app-store-shake-up-brings-new-fees-relaxed-link-rules) |

Sources secondaires pour les deux dernières lignes : à reconfirmer sur les pages Apple, comme le cadrage le prévoit.

---
**Handoff → @orchestrator**
- Fichier produit : `docs/mobile/revues-cadrage/reviewer-v1.md`
- Verdict : NO-GO pour 9/10, note **8/10** (v0 : 6,5). Corrections v0 : 11 traitées, 2 partielles (O3, O8), 0 non traitée. **7 obligatoires restantes** (N1 à N7 ; N2 solde O3, N5 solde O8) ; 13 souhaitables
- Top 3 : N1 (une seule vanne du jour, jour local), N4 (série et XP du visiteur contre le 05/10 et s15, à soumettre à Thomas), N5 (@legal et textes absents des dépendances, page `/app` sans lot)
- Agent à relancer : @product-manager (v2) ; @fullstack informé de N7 (exercice du jour servi par `/api/daily`). Aucune décision de Thomas rouverte ; §1 non pénalisée, présomptions listées en N6
---
