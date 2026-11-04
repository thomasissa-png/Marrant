# Relecture à l'aveugle du cadrage v0 de l'app iPhone : @reviewer

> Livrable relu : `docs/mobile/cadrage-app-native-s23.md` (v0, 04/11/2026, @product-manager).
> Relu contre : `project-context.md` (mémo s22), `docs/founder-preferences.md` (148 lignes, dont tous les [CHOIX UTILISATEUR]), `CLAUDE.md` (règles Marrant), code réel (`apps/web/prisma/schema.prisma`, `apps/web/src/app/api/**`, `apps/mobile/package.json`), `docs/mobile/revues-cadrage/donnees-gsc-2026-10.txt`.
> Relecture faite sans voir les autres relecteurs. Aucun fichier modifié hors de celui-ci, rien commité.

## 1. Notes

| # | Critère | Note /10 | En une ligne |
|---|---|---|---|
| 1 | Cohérence interne et avec le projet réel | **6** | Prix, offre, parcours, carnet, lettres justes ; mais 4 incohérences avec le code réel (push sans compte, webhook RevenueCat, « mot de passe oublié » des comptes Google, XP du visiteur) qui cassent des promesses de la V1 |
| 2 | Conformité aux préférences fondateur | **7** | Pas de compte gratuit, heure choisie, aucune IA en direct, étalons avant copy, juridique court : respectés. Manquent : identité réelle (Issa Capital) dans la décision 1, bandeau sur le site, réassurance unique du 18/10, déploiement par `REPLIT_ACTIONS.md` |
| 3 | Zéro donnée inventée, sources, [À VÉRIFIER] justifiés | **6** | Aucun chiffre inventé, sources datées. Mais 5 [À VÉRIFIER] portent sur des faits de code vérifiables en un Grep, la commission UE est périmée depuis le 01/10/2026, les données Search Console (75 % mobile) sont ignorées |
| 4 | Complétude du périmètre V1 | **7** | Écrans, états, hors-V1 motivés : bon. Manquent l'état « Premium sans compte », les migrations, les changements du site, la réassurance Apple |
| 5 | Clarté des décisions laissées à Thomas | **6,5** | 10 décisions avec reco et alternative, rien de déjà tranché rouvert. Mais décision 1 incomplète, décision 3 fondée sur un parcours qui ne marche pas, décision 9 avec une alternative impossible, décision 7 sans alternative, 3 décisions manquantes |
| 6 | Plan par dépendances exploitable | **7** | Lot 0 en chemin critique, parallélisme clair. Écran de premier lancement et états transverses sans lot, plan de marquage trop tard, aucune dépendance « API en production avant soumission » |
| | **Note globale** | **6,5 / 10** | NO-GO en l'état pour 9/10 : 13 corrections obligatoires, toutes courtes à appliquer |

## 2. Ce qui est solide (à ne pas casser en corrigeant)

- Proposition de valeur nette et persona-centrée (« le site sert à trouver et à lire, l'app sert à pratiquer », §1), qui évite le « second site ».
- Respect des [CHOIX UTILISATEUR] structurants : pas de compte gratuit et droits du visiteur inchangés (05/10), contenu préparé et validé, jamais d'IA en direct (01/10), rappel de parcours sur demande (s17), pas de forum (17/10), pas de certificat (s17), abonnés de lancement jamais migrés (01/10), prix 1,99 € et 16,99 € TTC (24/10), étalons avec Thomas avant toute rédaction (P0 s8), juridique limité à l'obligatoire (19/10, 25/10).
- Plafonds 10/3/3 appliqués côté API, jamais côté app seule (§3.3) ; purge du cache Premium (§3.5).
- Choix techniques argumentés (Expo neuf, pas de WebView pour le cœur, RevenueCat avec alternative écartée et motivée).
- Tableau des risques de refus spécifique au produit (humour, extraits de stand-up, push quotidien).
- Aucun tiret cadratin, aucune durée en semaines, chiffres Apple accompagnés de leur source.

## 3. Corrections OBLIGATOIRES (bloquantes pour 9/10)

**O1. La notification du jour sans compte est impossible avec la table actuelle.**
Emplacement : §1 tableau (l.13) et H1 (l.18), §2 (l.24, l.39), §3.0 (l.61), §3.3 ligne « Enregistrement du jeton » (l.81), §3.4.
Constat : `PushToken.userId` est obligatoire (`schema.prisma` l.576-583) et `push/register-token` exige une session NextAuth (route l.13-33). Or le cadrage fait de la notification le premier crochet du **visiteur sans compte** (H1, widget sans compte). `cron/daily-push` envoie à heure fixe (8 h UTC, route l.8) via l'ancienne API FCM `fcm/send`.
Correction : écrire le fait (« `PushToken` existe, lié à un compte obligatoire ») et retenir un modèle : jeton rattaché à un **identifiant d'installation** (userId facultatif, heure choisie, fuseau), endpoint d'enregistrement sans session avec limite de débit, rattachement au compte à la connexion, migration additive. Indiquer que `daily-push` est à **réécrire** (envoi par Expo, par fuseau), pas à adapter.

**O2. Le webhook RevenueCat existant contredit le cadrage sur 5 points.**
Emplacement : §3.0 (l.61), §3.3 ligne « origine » (l.82), §4.2 (l.108), §4.4 (l.114-118), lots 4 et 7.
Constat (`api/iap/revenuecat-webhook/route.ts`) : (a) `app_user_id` est traité comme `User.id` (l.44, l.80-81) : un achat **anonyme** (§4.4, l.116) fait échouer la mise à jour, renvoie 500, RevenueCat réessaie sans fin ; (b) `TRANSFER` et `SUBSCRIBER_ALIAS` ignorés (l.109-111), donc le rattachement après connexion n'est jamais traité ; (c) `EXPIRATION` passe `plan = FREE` sans regarder Stripe (l.91-96) : un abonné Stripe ayant eu un abonnement Apple perd son Premium ; (d) rien n'est écrit dans `Subscription`, modèle purement Stripe avec `userId` unique (l.504-522) ; (e) l'achat n'appelle pas `activerLettreHebdo` (`lib/lettre/hebdo.ts` l.154) : un abonné Apple ne recevrait pas la lettre de la semaine, avantage affiché sur /abonnement et inscription d'office décidée le 25/10.
Correction : remplacer « déjà prévus côté site » par la liste des travaux : champ origine STRIPE/APPLE et champs Apple (produit, expiration, identifiant RevenueCat) par migration ; webhook réécrit (écrit `Subscription`, ne rétrograde jamais si l'autre source est active, gère `TRANSFER`, inscription d'office à l'hebdo, idempotence conservée) ; même garde côté webhook Stripe ; tests Jest de chaque cas. Le rattacher aux lots 4 et 7.

**O3. « Premium sans compte » : état nouveau, non décidé.**
Emplacement : §2 (l.24 « le compte ne se crée que pour retrouver son Premium »), §4.4 (l.116), §8.
Constat : sur le site, la création de compte est intégrée à l'abonnement (CHOIX 05/10). Favoris, progression, lettre de la semaine et « Ta question à l'équipe » reposent sur `User` (e-mail requis). Un abonné Apple anonyme paierait sans y avoir accès.
Correction : ajouter une **décision 11** avec reco et alternative. Reco proposée : compte demandé juste après l'achat (e-mail et mot de passe sur l'écran de succès, rappel tant qu'il manque), identifiant RevenueCat lié au compte à la connexion. Alternative : compte avant l'achat [À VÉRIFIER : guideline 5.1.1(v)]. Lister ce que garde un Premium anonyme (lecture, hors ligne) et ce qu'il n'a pas.

**O4. XP et série promis au visiteur, qui n'en a pas sur le site.**
Emplacement : §1 tableau (l.14), H3 (l.18), §2 (l.24 « exactement les droits du visiteur »), §3.5 (l.91).
Constat : `xp`, `streak`, `lastPracticeAt` sont sur `User` (`schema.prisma` l.66-71) : le visiteur du site n'a ni XP ni série. La file de progression « synchronisée » n'a pas de destination sans compte.
Correction : trancher dans le cadrage ou en décision : reco = série et XP **locaux** pour le visiteur, fusionnés au compte à sa création (règle de fusion écrite) ; alternative = série réservée aux comptes (H3 alors limitée aux comptes). Réécrire H3 en conséquence.

**O5. « Mot de passe oublié » ne crée pas de mot de passe pour un compte Google.**
Emplacement : §3.2 (l.70), décision 3 (l.175).
Constat : `api/auth/forgot-password/route.ts` l.46 n'envoie l'e-mail que si `passwordHash` existe : un compte créé par Google ne reçoit rien (et le message d'erreur des étalons s16 renvoie vers Google).
Correction : écrire le fait et prévoir dans le lot 4 un parcours « créer un mot de passe » pour les comptes Google (lien par e-mail, textes à calibrer au lot 3), ou revoir la reco de la décision 3.

**O6. Cinq [À VÉRIFIER] sur des faits vérifiables, à remplacer par les faits.**
Emplacement : l.59, l.61, l.79, l.80, l.82, l.188.
Correction : (a) `PushToken` existe (l.576) ; (b) `DELETE /api/user` existe (route l.143) mais exige la session par cookie, refuse les appels d'un autre site (`refuserSiAutreSite`, l.144) et un mot de confirmation retapé (l.128-153), et résilie Stripe : écrire « à adapter » (jeton, suppression des jetons push et de renouvellement, message sur l'abonnement Apple) et trancher « 2 touches » (§6 l.139) contre le mot retapé ; (c) `/api/carnet` n'existe pas (carnet = page serveur `(dashboard)/carnet`) : « à créer » ; (d) `Subscription` n'a pas d'origine : « migration » ; (e) l.59 : depuis le 28/04/2026, Apple exige Xcode 26 et le SDK iOS 26 pour tout envoi (page Apple « Upcoming requirements »), ce qui confirme qu'Expo 52 ne peut pas être conservé. Mettre la l.188 à jour.

**O7. Les données réelles d'audience sont absentes.**
Emplacement : §1 (l.20), H1 à H3 (l.18).
Constat (`donnees-gsc-2026-10.txt`) : sur 28 jours, 300 clics mobiles sur 398 (75 %) ; les requêtes qui amènent du trafic sont des blagues (« blague à mourir de rire 2026 », « blague humour noir 2026 »), « comment devenir drôle » fait 0 clic.
Correction : citer ces chiffres et la source. En tirer deux conséquences écrites : le canal « depuis le site » pèse environ 300 visites mobiles par mois ; la première audience mobile vient lire des vannes, pas s'entraîner, donc H1 se teste d'abord sur ce lecteur de vannes (la vanne du jour en notification est le pont naturel).

**O8. Les changements du site ne sont ni listés ni soumis à Thomas.**
Emplacement : §1 (l.20 « bannière d'app, page /app, lien sous la vanne du jour »), §4.4 (l.115 « Abonnement géré par Apple »), lot 10.
Constat : une bannière sur le site heurte « visible sans surcharger, pas de pop-up ni de bandeau » (17/10), le refus du bloc B18 pour ne pas concurrencer le bouton payant (18/10) et la règle de retouche minimale (P0 21/10). Aucun lot ne porte les changements du site ni leur mise en ligne (`REPLIT_ACTIONS.md`, CI verte, go de Thomas).
Correction : ajouter une **décision 12** « entrée vers l'app sur le site » (reco : page /app et lien discret sous la vanne du jour, rien qui concurrence le bouton payant ; alternative : bannière native de Safari) et un **lot « site »** : /abonnement et profil pour l'abonné Apple, webhooks, migrations, fichier d'association, page /app, déployés selon `REPLIT_ACTIONS.md`.

**O9. La décision 1 omet deux faits qui changent la reco.**
Emplacement : §5 lignes « Individuel ou société » et « Entité juridique » (l.125-126), décision 1 (l.173).
Constat : (a) en société, c'est le **nom légal de l'entité** qui s'affiche : si l'entité qui encaisse n'est pas « deviens-marrant SAS » (immatriculation non confirmée, R4), une autre identité réelle apparaît, ce que la règle du 29/09 que le cadrage applique déjà au nom de Thomas vise aussi (« pas de Thomas ou d'Issa Capital ou autre ») ; (b) dans l'UE, un vendeur déclaré professionnel (DSA) affiche **adresse, téléphone et e-mail** sur la fiche : en individuel, ce sont les coordonnées personnelles de Thomas.
Correction : réécrire la décision 1 avec ces deux faits et la chaîne de dépendances (entité existante et son nom exact, puis D-U-N-S, puis inscription). Ne pas supposer quelle entité encaisse : la question reste à Thomas.

**O10. Commission Apple : chiffres périmés et phrase ambiguë.**
Emplacement : §4.1 (l.101-103), §4.3 (l.111), décision 4 (l.176).
Constat : depuis le 01/10/2026, le taux standard des achats intégrés dans l'UE est de 26 % (annonce du 18/08/2026 : Irish Times, Nasdaq) ; le programme petites entreprises donne 15 % **dès le premier mois** d'un abonnement ; le « 15 % à partir de la deuxième année » ne concerne que le taux standard. La phrase actuelle laisse croire l'inverse.
Correction : « En France : 15 % avec le programme petites entreprises (dès le premier paiement) ; sans lui, 26 % la première année d'un abonné puis 15 % ». Garder [À VÉRIFIER] sur le taux du lien externe dans l'UE (non confirmé par ma recherche) et conditionner la conclusion « n'économise rien » à ce taux.

**O11. La réassurance du site serait fausse dans l'app.**
Emplacement : §2 écran 8 (l.34), §4.1 (l.105), §4.4 (l.118), décision 2 (l.174 « identique au site »).
Constat : la réassurance unique décidée le 18/10 (« premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. ») est inexacte pour un achat Apple : résiliation dans les réglages de l'iPhone, remboursement demandé à Apple. Le 18/10 exige « rien de faux » sur les 14 jours. Le rappel de reconduction de l'annuel (`RenewalReminder`, L.215-1) est lié au modèle Stripe.
Correction : écrire que l'écran d'offre a sa propre réassurance (calibrée au lot 3) et confier à @legal, en une question courte, les 14 jours et le rappel de reconduction pour un abonné Apple.

**O12. Plan : trois trous de dépendance.**
Emplacement : §7.
Correction : (a) affecter l'écran 1 « Premier lancement » (heure, permission push) et l'écran 10 « États transverses » au lot 5 ; (b) lot 11 (plan de marquage) **avant le lot 5**, ses premiers événements (premier lancement, permission push, première chute révélée) étant construits au lot 5 ; (c) lot 13 dépend aussi de « API mobile et lot site **en production** » (la revue d'Apple se fait contre la production), migrations jouées d'abord. Ajouter au lot 12 « rendu itéré jusqu'à 10/10 chez @design et @ux » (CHOIX 07/10) et au lot 3 « textes relus à l'aveugle, 2 sur 3, avant intégration » (règle d'or P0 s18).

**O13. L'alternative de la décision 9 est impossible.**
Emplacement : décision 9 (l.181).
Constat : « Deviens Marrant : répartie et humour » fait 36 caractères ; le nom App Store est limité à 30 (sous-titre : 30 aussi).
Correction : alternative = nom « Deviens Marrant » et mots-clés dans le sous-titre (30 caractères), à calibrer avec @copywriter.

## 4. Corrections SOUHAITABLES

**S1. Guideline 4.8 (décision 3, l.175 ; §6 l.141).** Apple exige une option de connexion « équivalente » (nom et e-mail seulement, e-mail masquable, pas de pistage publicitaire) ; « Se connecter avec Apple » est l'option reconnue. Remplacer « obligatoire dès qu'on propose Google » par cette formulation.

**S2. Widget d'accueil (§2 l.43, §6 l.142, décision 8).** Le nom « Vanne du jour » se confond avec le widget intégrable s22 « La vanne du jour ». Un widget d'écran d'accueil est vu par l'entourage : préciser s'il reprend la sélection tout public déjà relue (93 vannes, DATING, SOIREES et COUPLE exclus, CHOIX 24/10) et l'API `/api/widget/v1/vanne-du-jour` (inerte), ou la vanne du jour du site. « Widget tout public » (l.142) est ambigu tant que ce n'est pas tranché.

**S3. Profil (§2 écran 9, l.35).** Les comptes gratuits et Premium sont inscrits d'office aux lettres (CHOIX 25/10) : le profil montre des **préférences** (lettre du mois, lettre de la semaine pour Premium, arrêt en un clic), l'inscription par adresse ne concerne que le visiteur.

**S4. Notifications sans prix (§2 l.39).** C'est une reco qui étend la règle sociale du 05/10, pas une décision existante : l'écrire comme reco (Thomas veut le prix dans le PS de la lettre, 25/10 ; le contexte diffère, la reco tient).

**S5. Métadonnées et notes de revue (§6 « Métadonnées », lot 3).** Ajouter : aucune mention d'IA (P0 06/05), aucun concurrent nommé (règle commune 9), zéro tiret cadratin (règle commune 12).

**S6. Décision 7 sans alternative.** La déplacer dans les prérequis du §5 (où elle figure déjà, l.131) ou lui donner une vraie alternative.

**S7. Sources primaires.** Remplacer Magora (programme petites entreprises, D-U-N-S) par les pages Apple (`developer.apple.com/app-store/small-business-program/`, `developer.apple.com/support/D-U-N-S/`) et le lien court `apple.co/308Ikbq` par l'adresse complète.

**S8. Données à créer (§3.3).** Lister les migrations : jetons de renouvellement, `PushToken` (installation, heure, fuseau), `Subscription` (origine, champs Apple), avec la pratique s22 (migration additive rejouée deux fois sur base jetable). Préciser que l'utilitaire « session OU jeton » garde la protection contre les appels d'un autre site pour les cookies.

**S9. §4.1 (l.104).** « Hors États-Unis et UE, ne jamais inciter » laisse croire qu'on pourrait le faire aux États-Unis et dans l'UE : écrire « nulle part dans la V1 », comme le §6 et la décision 4.

**S10. Objectif 6 mois.** Donner à @data-analyst le net par abonné Apple mensuel (1,99 € TTC, environ 1,66 € HT, environ 1,41 € après 15 %) pour relier l'app au MRR, sans en faire un critère de GO (commandement 5).

**S11. Références internes.** « Décision s17, D7 » (l.40) : D7 = rappel sur demande ; l'arrêt après 3 rappels vient de la 2e série s17 (07/10, point 2). Citer les deux.

## 5. Vérifications externes faites par le relecteur (04/11/2026)

| Point | Résultat | Source |
|---|---|---|
| SDK minimal | Xcode 26 et SDK iOS 26 exigés depuis le 28/04/2026 | [Apple, Upcoming requirements](https://www.developer.apple.com/news/upcoming-requirements/), [Expo](https://expo.dev/blog/app-store-connect-minimum-sdk-26.md) |
| Commission UE | 26 % standard au 01/10/2026, 15 % programme petites entreprises ; taux du lien externe non confirmé | [Irish Times](https://www.irishtimes.com/business/2026/08/19/apple-introduces-app-store-changes/), [Nasdaq](https://www.nasdaq.com/articles/apple-cut-its-standard-eu-app-store-commission-30-26), [Born City](https://borncity.com/news/app-store-apple-senkt-provisionen-auf-26-prozent-ab-oktober/) |
| Programme petites entreprises | 15 % dès le premier jour d'abonnement | [RevenueCat](https://revenuecat.com/blog/engineering/small-business-program), [Adapty](https://adapty.io/blog/app-store-small-business-program/) |
| DSA | Coordonnées du vendeur professionnel affichées sur la fiche UE | [MacRumors](https://www.macrumors.com/2025/02/18/european-union-trader-status-deadline/), [heise](https://heise.de/-9838371) |
| Guideline 4.8 | Option « équivalente », Sign in with Apple reconnue | [Forum développeurs Apple](https://developer.apple.com/forums/thread/765145) |
| Nom et sous-titre | 30 caractères chacun | [Apple, product page](https://developer.apple.com/app-store/product-page) |

Sources en partie secondaires : à reconfirmer sur les pages Apple avant paiement ou soumission, comme le cadrage le prévoit déjà.

---
**Handoff → @orchestrator**
- Fichier produit : `docs/mobile/revues-cadrage/reviewer-v0.md`
- Verdict : NO-GO pour 9/10, note 6,5/10, 13 obligatoires (O1 à O13), 11 souhaitables
- Top 3 : O1 (push sans compte impossible en l'état), O2 (webhook RevenueCat : achat anonyme, rétrogradation d'un abonné Stripe, lettre hebdo), O3 et O4 (Premium sans compte, XP du visiteur : décisions manquantes)
- Agent à relancer : @product-manager (cadrage v1) ; aucune décision de Thomas rouverte
---
