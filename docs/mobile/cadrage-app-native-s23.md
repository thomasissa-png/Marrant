# Cadrage de l'app iPhone native, Deviens Marrant (session 23, v1, 04/11/2026)

> Auteur : @product-manager. Remplace la v0 (relecture à l'aveugle : @reviewer 6,5, @legal 5,5, @fullstack 5,2, @elon 4,5). Barre exigée : 9/10 chez chaque relecteur ET conformité aux deux grilles (utilisateur : `docs/mobile/attentes-utilisateur.md`, 11 critères ; Thomas : §1, en attente de ses réponses).
> Décision de Thomas (s23) : app native iPhone (ni site emballé, ni PWA), Android ensuite.
> Lu : `project-context.md`, `docs/founder-preferences.md`, les 4 revues, la grille utilisateur, les données Search Console. Les références `fichier:ligne` du code sont reprises des revues @fullstack et @reviewer (le PM ne les a pas relues une à une).
> Légende : [MESURÉ] chiffre lu dans une source citée. [HYPOTHÈSE] proposition du PM à ratifier. [À VÉRIFIER] ni le code ni une source primaire ne tranche. Prix en vigueur (24/10) : 1,99 € TTC/mois, 16,99 € TTC/an ; abonnés de lancement 0,99 € à vie, Stripe seulement.
> **Ce qui change par rapport à la v0** : (1) le centre de gravité devient UN geste quotidien de 30 s (§3), les parcours en sont la suite ; (2) le §7 liste les faits du code (la v0 en supposait plusieurs faux) ; (3) un chapitre consommation et conformité (§9) ; (4) hypothèses chiffrées et build 0 sur TestFlight dès le lot 7 ; (5) changements du site isolés (§12) ; (6) tableau de traçabilité des corrections (§16).

## 1. Grille de Thomas [EN ATTENTE DES RÉPONSES DE THOMAS]

Aucune réponse n'est inventée. Cinq questions posées ; les sections qui en dépendent sont « provisoires ». La v1 ne sera déclarée conforme à la grille de Thomas qu'après ses réponses.

| # | Question | Sections provisoires | Réponse de Thomas |
|---|---|---|---|
| 1 | Usage : réflexe quotidien de 30 s, entraînement (parcours), ou les deux ? | §2, §3, §4 | [EN ATTENTE DES RÉPONSES DE THOMAS] |
| 2 | App de référence : laquelle aimes-tu (hors humour si tu veux), et qu'en veux-tu ? | §4, §8 | [EN ATTENTE DES RÉPONSES DE THOMAS] |
| 3 | Indispensables et interdits de la V1 | §4, §5 | [EN ATTENTE DES RÉPONSES DE THOMAS] |
| 4 | Ton visuel : identité du site, ou plus vivante ? | §8, lot 1 (@design) | [EN ATTENTE DES RÉPONSES DE THOMAS] |
| 5 | Paiement : achat Apple dans l'app, ou connexion des abonnés du site seulement ? | §9, lot 10, décision 8 | [EN ATTENTE DES RÉPONSES DE THOMAS] |

Hypothèse de travail du PM (une reco, pas une réponse) : « les deux », geste quotidien en entrée, parcours en suite (données du §2). Si Thomas répond « entraînement », §3 et §4 sont à rééquilibrer. Si Thomas répond « connexion seulement » à la question 5 : risque de refus 3.1.3(b), l'accès à un abonnement acheté ailleurs n'étant accepté, d'après @legal, que si l'achat intégré est aussi vendu dans l'app [À VÉRIFIER par @legal sur ce cas précis] ; le lot 10 ne disparaît pas.

## 2. Ce que les gens cherchent, et la valeur centrale

**Données réelles** [MESURÉ, `donnees-gsc-2026-10.txt`, Search Console 28 j, et rapport du lundi 02/11 transmis par Thomas, non relu dans Umami] :
- Mobile : 300 clics sur 398 (75 %). Requêtes qui cliquent : « blague à mourir de rire 2026 » 38 clics, « blague humour noir 2026 » 27 (383 impressions), « blague 2026 » 20, « meilleur blague 2026 » 16, « blague halloween adulte » 10.
- Requêtes d'apprentissage : « comment devenir drôle » 34 impressions, 0 clic (position 21,9) ; « une répartie » 46, 0 clic ; « comment faire rire quelqu'un » 94, 0 clic. « autodérision » 339 impressions, 1 clic.
- Semaine du 26/10 au 01/11 : 205 visiteurs, 34 s en moyenne, 5 parcours ouverts, 1 quiz d'étape terminé, 0 inscription, 38 murs Premium vus, 1 clic vers le paiement, 4 abonnés actifs.

**Deux conséquences** : (1) le canal « depuis le site » pèse de l'ordre de 300 clics mobiles Google par 28 jours, pas une audience captive ; (2) la porte d'entrée est la vanne prête à l'emploi (persona d'entrée : Sophie), la valeur durable est le décryptage et la pratique (Yanis, Marc). H0 se teste donc d'abord sur ce lecteur de vannes, la vanne du jour en notification étant le pont.

**Valeur de l'app, une phrase** (fond fixé, libellé final par @copywriter après étalons de Thomas, P0 s8) : chaque jour, à l'heure que tu choisis, une vanne au niveau arrive sur ton téléphone ; tu révèles la chute, tu comprends pourquoi elle marche, tu fais ta version en 30 secondes, tu peux l'envoyer à tes potes. Le site sert à trouver et à lire ; l'app installe un réflexe. Le pont existe déjà dans le produit : chaque vanne porte un décryptage « Pourquoi ça marche » et un exercice « À toi de jouer » (cohérent avec la doctrine du 06/05 : la valeur est dans le décryptage).

**Ce qui fait rester et payer** (et non « raisons d'ouvrir ») : parcours (suite naturelle du geste), carnet mensuel consultable hors ligne, catalogue complet, favoris.

**Le « 10× » en critères d'acceptation** : notification à la chute lue : 1 geste ; chute au partage : 2 gestes au plus ; vanne du jour et exercice lisibles sans réseau, toujours.

**Entrées vers l'app** : recherche dans l'App Store (canal à part entière, §10), page `/app` et lien du site (§12), widget intégrable, partage des vannes (§3). Demande de recherche App Store non mesurée [HYPOTHÈSE : « blague » y existe aussi].

## 3. Le geste quotidien (centre de gravité de la V1)

| Étape | Ce que voit la personne | Action principale unique | Critère binaire |
|---|---|---|---|
| 1. Notification | Début (mise en place) de la vanne du jour, jamais de prix ni de promotion | Toucher la notification | Ouvre directement la vanne du jour, sans écran intermédiaire |
| 2. Révéler | Mise en place visible, chute masquée | « Révéler la chute » (libellé du site) | Notification à chute lue : 1 geste |
| 3. Comprendre | « Pourquoi ça marche », visible après la révélation | Lire | Absent tant que la chute n'est pas révélée |
| 4. Jouer | « À toi de jouer », faisable en 30 s | Réponse écrite gardée sur l'appareil, jamais envoyée ni publiée, OU case « je l'ai fait à voix haute » (format final : @ux) | Aucun contenu d'utilisateur transmis (donc pas de 1.2) |
| 5. Partager ou garder | Boutons Partager et Garder | Partager : carte image (mise en place, chute, marque) + lien universel ; Garder : favori | Chute à partage : 2 gestes au plus |

- **Sous la boucle** : conseil du jour. La vidéo du jour quitte l'écran Aujourd'hui (reste dans Explorer). Le quiz d'humour vit dans Parcours (son rôle est l'orientation).
- **Notification et widget : sélection tout public** (93 vannes relues en s22, DATING, SOIREES et COUPLE exclus, choix du 24/10) quand la vanne du jour est d'une catégorie exclue, car l'écran verrouillé et l'écran d'accueil sont vus par l'entourage. Stock à vérifier par @fullstack [À VÉRIFIER : couverture du calendrier ; `/api/health` indiquait 124 jours d'inédits au 18/10]. Le texte de notification (mise en place seule, ou accroche courte préparée et relue à l'aveugle, jamais générée en direct, règle du 01/10) a son étalon au lot 3. Reco du PM : aucun prix ni promotion dans les notifications (extension de la règle sociale du 05/10, pas une décision existante).
- **Série de jours** : un jour compte si la personne fait l'« À toi de jouer » de la vanne du jour OU valide une étape, un défi ou un quiz de parcours. Révéler la chute seule ne compte pas. Raison : sans cela la série reste à zéro six jours sur sept (le parcours est hebdomadaire, choix du 29/09). Cela précise D3 (« streak compté sur la pratique », 07/10) : **soumis à Thomas en une ligne** (décision 4). Visiteur sans compte : série et XP **locaux** (le site ne donne ni série ni XP au visiteur, ils sont sur `User`) ; à la création du compte : série = la plus longue des deux, XP local ajouté une seule fois (clé d'idempotence).
- **Moments de conversion, ceux-là seulement** : (a) « Garder » sans Premium ouvre l'écran d'offre (« Premium ouvre tout Deviens Marrant ») ; (b) la 11e vanne d'une liste ; (c) l'exercice d'une vanne hors vanne du jour ; (d) l'étape 2 d'un parcours ou la 2e fiche du carnet. **Interdits** : écran d'offre avant la première chute révélée ou au lancement, prix en notification, compte à rebours, « tu as atteint ta limite » (doctrine du 06/05).
- **Exercice de la vanne du jour ouvert à tous** : nécessaire pour que le geste ne soit pas amputé pour les non-abonnés. Sur le site, l'exercice est réservé à Premium dans les listes et sur la fiche (`champs-premium.ts`, `page.tsx:145-147`) ; l'ouverture pour la vanne du jour de l'app touche l'offre gratuit/Premium [À VÉRIFIER par @fullstack : ce que fait `/api/daily` aujourd'hui] : décision 4.
- **Notification refusée** : le widget est proposé une fois, avec le geste pour l'ajouter (même mise en place, autre canal).
- **Carte image** : réutiliser les gabarits sociaux du site `apps/web/src/lib/social/templates/` [À VÉRIFIER par @fullstack : réutilisation possible]. Lien universel : ouvre l'app si installée, sinon la fiche publique du site, telle quelle (toute bannière d'installation est un changement du site : §12).

## 4. Périmètre V1 (iPhone)

**Principe conservé** : pas de compte gratuit (05/10). L'app s'ouvre sans compte avec les droits du visiteur (listes 10/3/3, contenu du jour, étape 1 de chaque parcours, quiz, fiche offerte du carnet). Le compte sert à retrouver son Premium et à acheter (décision 3).

**Navigation : 4 onglets** (arbitrage final @ux) : Aujourd'hui, Parcours, Explorer, Profil.
1. **Premier lancement : 2 écrans au plus**. Écran 1 = la vanne du jour avec sa chute à révéler (la vanne EST la promesse, pas d'écran de promesse). Après la révélation, écran 2 = heure de la vanne choisie par la personne (aucune heure imposée) et permission de notification, avec un texte qui dit ce qu'elle reçoit. Aucun prix, compte ni mur avant.
2. **Aujourd'hui** : la boucle du §3, conseil du jour dessous, série.
3. **Parcours** : hub des 5 parcours (Machine à Café, Répartie, Confiance, Storytelling, Boulot), détail, étape, défi, quiz d'orientation. Premium : toutes les étapes ouvertes, ordre conseillé jamais imposé (18/10). Présentés comme des défis de 5 minutes d'abord.
4. **Explorer** : vannes, conseils, vidéos (lecteur officiel intégré, jamais d'extraction), recherche, filtres, fiche détail, favoris (Premium), carnet (mois en cours, fiche offerte pour tous, lisible hors ligne). Collections éditoriales tirées du catalogue validé (saison en cours, meilleures de l'année, autodérision) ; l'humour noir est une décision (14.5).
5. **Profil** : connexion/création, abonnement (statut, source Apple ou site, comment gérer), notifications (heure ; rappel de parcours séparé, sur demande seulement, arrêté après 3 rappels sans activité : D7 du 07/10 et 2e série du 07/10 point 2), lettres (préférences : lettre du mois pour tous, lettre de la semaine pour Premium, arrêt en un clic ; inscription par adresse seulement pour le visiteur, 25/10), « Ta question à l'équipe » (Premium), mentions légales (identité de l'éditeur, hébergeur, contact, médiateur : liens vers les pages du site à jour), suppression du compte (§9.5).
6. **Écran d'offre** (§9.2). 7. **États transverses** : hors ligne, erreur réseau, session expirée, mise à jour obligatoire, contenu vide, contenu retiré (404), Premium requis (403 vers l'écran d'offre), double touche sur un achat ; chacun avec message exact et sortie (5 états par écran dans les user stories).
8. **Widget d'accueil** (sélection tout public ci-dessus ; nom distinct du widget intégrable s22 « La vanne du jour » ; API existante inerte, §7). **Liens universels** (`/vannes/*`, `/conseils/*`, `/videos/*`, `/parcours/*`, `/carnet/*`).

**Hors ligne** : lecture seule du contenu du jour, de l'exercice, des favoris, du carnet du mois, de l'étape en cours. File d'écritures limitée aux appels idempotents : `progress` oui (ligne unique) ; `user/xp` non (ni clé d'idempotence ni limiteur partagé aujourd'hui, `user/xp/route.ts:26`) : clé d'idempotence ajoutée, sinon jamais en file. La progression synchronisée n'existe que pour un compte Premium (`progress/route.ts:115-116`) ; le visiteur a une progression locale. Cache Premium purgé au retour de `bootstrap` non Premium ET à la déconnexion ; file propre à chaque compte (pas de rejeu sous un autre).

**Hors V1, avec raison** : Android (décision de Thomas, code Expo partagé) ; articles de blog (SEO, ouverts dans le navigateur intégré) ; connexion Google ou Apple (évite 4.8 : option de connexion équivalente exigée dès qu'une connexion tierce existe) ; fonction IA membres `/api/ai` (aucun critère de qualité ni comportement d'échec spécifiés pour mobile) ; Apple Watch, Live Activities, forum (s21), certificat (s17) : aucune valeur persona démontrée ; période d'essai (le site n'en propose pas) ; lien de paiement externe (§9.1) ; « réplique du jour » (suite logique après 90 situations validées à l'aveugle, 24/10).

## 5. Conformité à la grille utilisateur (C1 à C11, règle GO de `attentes-utilisateur.md` §3)

| Critère | Comment la v1 y répond | Où |
|---|---|---|
| C1 (bloquant) Comprendre en 30 s | Première image = une vanne à chute masquée ; phrase de valeur au lot 3 | §2, §4.1 |
| C2 (bloquant) Réplique en ≤ 3 gestes, sans compte | Ouverture → vanne du jour : 0 à 1 geste, aucun compte ni paiement | §3, §4 |
| C3 Réplique prête à l'emploi (≥ 8/10) | Calendrier préparé et relu à l'aveugle (barre Alexa), jamais d'IA en direct | §3 |
| C4 Emporter en 1 geste | Partage natif (carte + lien) et « Garder » ; contenu du jour hors ligne | §3, §4 |
| C5 (bloquant) Rien avant la valeur | Aucun mur, prix ni compte avant la 1re chute ; permission après ; 2 écrans au plus | §3, §4.1 |
| C6 Ton complice (≥ 8/10) | Textes au lot 3 : étalons de Thomas, relecture à l'aveugle 2 sur 3, ni « cours » ni corporate | §13 |
| C7 Ma situation (≥ 7/10) | Sophie par la vanne, Yanis par la série et les parcours, Marc par la progression ; à vérifier au panel et en TestFlight (aucune donnée comportementale par persona) | §2, §6 |
| C8 Défi ≤ 5 min, progression visible | Exercice de 30 s, série et XP visibles, étape présentée en défi court | §3, §4 |
| C9 Raison de revenir, main gardée | Heure choisie, rappel de parcours séparé et sur demande, aucune promotion ni prix (condition B) | §3, §4.5 |
| C10 Je sais ce que j'achète | Extrait réel du Premium avant tout mur ; prix, durée, renouvellement, résiliation et « Restaurer mes achats » à l'écran | §9.2 |
| C11 (bloquant) Fiable, respectueux | États transverses lisibles, suppression en 2 touches dans l'app (§9.5), actions courantes ≤ 2 s [HYPOTHÈSE : seuil de la grille, mesuré par @fullstack] | §4, §9 |

Chaque critère est repris comme critère d'acceptation des user stories par écran (lot 1).

## 6. Hypothèses chiffrées

Tous les seuils sont des [HYPOTHÈSE : propositions du PM, à ratifier par @data-analyst avant le premier TestFlight]. Avec quelques dizaines de testeurs on lit des comportements et des verbatims, pas des écarts de quelques points. H3 de la v0 (la série augmente le passage à Premium) est remplacée : non mesurable avec 4 abonnés.

| # | Hypothèse | Mesure et échantillon | Lecture | Poursuite / alerte |
|---|---|---|---|---|
| H0 | Un visiteur mobile du site installe l'app | Clics vers TestFlight puis installations, depuis la page `/app` et la vanne du jour, mobile seulement | 28 j après l'ouverture du lien public | ≥ 10 installations venues du site / moins de 3 |
| H1 | La personne active la notification après sa 1re vanne | Part des installés qui acceptent | Build 0, testeurs (§13) | 1 sur 2 ou plus / moins de 1 sur 4 |
| H2 | La notification ramène chaque jour | Ouvertures depuis la notification par jour ; jours actifs sur 7, semaine 1 contre 2 | 2 semaines de build 0 | Semaine 2 au moins égale à la semaine 1 / baisse de moitié |
| H3' | Le geste devient une habitude | Part des installés qui font le geste 4 jours sur 7 la semaine 2 | Idem | 1 sur 3 ou plus / moins de 1 sur 6 |
| H4 | L'exercice est fait, pas sauté | Chutes révélées suivies de l'exercice | Build 0 | 1 sur 3 ou plus / moins de 1 sur 10 |
| H5 | Les gens envoient des vannes | Partages par utilisateur actif sur 7 j ; installations venues d'un lien partagé | Build 0 | 1 partage pour 2 actifs ou plus / moins de 1 pour 5 |
| H6 | « Garder » donne envie de Premium | Écrans d'offre vus depuis « Garder » puis achats en bac à sable | Après le lot 10 | Lecture qualitative, seuil fixé par @data-analyst |

Avant le build 0, @data-analyst lit dans Umami, sur mobile, le taux de révélation de la chute de la vanne du jour et les partages sur 4 semaines [À VÉRIFIER : événements existants]. Net par abonné Apple mensuel pour relier l'app au MRR (sans en faire un critère de GO, commandement 5) : 1,99 € TTC, environ 1,66 € HT, environ 1,41 € après 15 % (TVA 20 % supposée, base de commission à lire dans le contrat Apps payantes).

## 7. Faits du code et travaux serveur (migrations additives, rejouées deux fois sur base jetable)

| Sujet | Fait du code | Travail v1 |
|---|---|---|
| Jetons mobiles | NextAuth 4 en JWT de 30 j ; 26 routes lisent `getServerSession` sans en-tête | Utilitaire `lireUtilisateurRequete` (cookie OU `Authorization: Bearer`) sur les 26 routes (passe Grep) ; garde « même site » conservée pour les cookies. Jeton d'accès 15 min signé à part (`jose` en dépendance directe), table `MobileSession` (empreinte du renouvellement, famille, rotation, jeton déjà tourné présenté = famille révoquée, refus si `passwordChangedAt` postérieur, cascade à la suppression du compte). `authorizeCredentials` réutilisé (mêmes limites). Jamais le JWT NextAuth |
| Comptes Google et mot de passe oublié | `forgot-password` n'envoie rien sans `passwordHash` (`route.ts:46`) : un compte Google, abonné Stripe compris, ne se connecterait pas | Adapter la route : lien « créer ton mot de passe » (e-mail vérifié, usage unique, textes @copywriter sur étalons de Thomas) |
| Notification sans compte | `PushToken.userId` obligatoire ; `register-token` exige une session ; son `DELETE` supprime n'importe quel jeton sans contrôle de propriétaire (`route.ts:81`) | Migration : `userId` facultatif, `installationId` unique, `installationSecretHash`, `fournisseur`, `fuseau`, `heureLocale`, `minuteLocale`, `quotidienActif`, `rappelParcoursActif`, `dernierEnvoiJour`, `echecs`. Route publique `POST/PATCH/DELETE /api/mobile/push` (jeton Expo validé, secret d'installation, limite par IP, aucune donnée personnelle, rattachement au compte à la connexion). `register-token` supprimé dans le socle (faille) |
| `daily-push` | Jamais planifié ; API FCM historique fermée ; APNs factice qui renvoie `true` ; jour en UTC ; secret en URL ; titre avec tiret cadratin et émoji | **Réécrire** en job du planificateur (tick `*/15` existant, créneaux de 15 min, jour local), envoi par l'API Expo en lots de 100, accusés lus (`DeviceNotRegistered` supprime le jeton), idempotence par `dernierEnvoiJour`. Supprimer la route et les secrets FCM/APNs de `.env.example` ; secret `EXPO_ACCESS_TOKEN` |
| Plan Premium | `User.plan` écrit par 5 endroits : webhook Stripe, webhook RevenueCat, `stripe-activation.ts`, filet de `auth.ts`, synchronisation admin | **Un seul écrivain** `recalculerPlan(userId)` : PREMIUM si Stripe actif (ACTIVE, TRIALING, PAST_DUE) OU droit Apple non expiré OU accès offert ; `finPremiumLettreHebdo` seulement si le résultat passe à FREE. En production et testé (non-régression Stripe) avant toute vente |
| Bouton admin « synchroniser avec Stripe » | Remet FREE tout compte sans abonnement Stripe actif (`api/admin/users/route.ts:146-151`) | Corrigé : il appelle `recalculerPlan` |
| Modèle Apple | `Subscription` 100 % Stripe, `userId` unique | `StoreEntitlement` séparé (unique `userId` + `store` ; `rcAppUserId`, `productId`, `environment`, `status`, `expiresAt`, `willRenew`, `updatedFromEventAt`). `Subscription` intacte ; la source active se déduit |
| Webhook RevenueCat | `app_user_id` traité comme `User.id` (500 si anonyme) ; ligne `WebhookEvent` écrite avant traitement (événement perdu au rejeu) ; `eventId` vide accepté ; `EXPIRATION` met FREE même si Stripe actif ; pas d'environnement ; `TRANSFER` ignoré ; secret comparé en temps non constant ; `payload: any` ; aucun test ; pas d'`activerLettreHebdo` | **Réécrire** : secret en temps constant ; relecture de l'abonné par l'API REST RevenueCat à chaque événement ; écriture `StoreEntitlement` puis `recalculerPlan` ; déduplication marquée APRÈS succès, `eventId` vide refusé ; identifiant inconnu (anonyme, compte supprimé) : 200 avec trace, jamais 500 ; `TRANSFER` géré ; `activerLettreHebdo` à l'achat (inscription d'office du 25/10) ; tests Jest avec fixtures de chaque cas |
| Bac à sable | TestFlight et la revue d'Apple achètent en SANDBOX sur la production | Droits SANDBOX acceptés (sinon refus 2.1 : Premium invisible), marqués, exclus des statistiques ; préproduction avec son propre webhook ; compte relecteur à accès offert |
| Double abonnement | `createCheckoutSession` (`lib/stripe.ts:155`) ne voit pas Apple | Refus 409 `gere-par-apple` si `StoreEntitlement` actif ; `bootstrap` signale « Stripe actif » et l'app refuse l'achat avant StoreKit |
| Réconciliation et statistiques | Écart « Premium sans abonnement Stripe » (`stripe-reconciliation.ts:83-88`) ; MRR lu sur les prix Stripe | Exclure les droits Apple de l'écart ; statistiques par source et par environnement (MRR Apple net de commission) |
| Routes existantes | Plafonds 10/3/3 sur les listes, côté API ; aucune API de fiche par slug ; fiche `/vannes/[slug]` publique (décryptage pour tous, exercice Premium) | « Réutilisables après passage à l'utilitaire de session ». Créer `GET /api/mobile/vannes|conseils|videos/[slug]` avec les règles de `lib/catalogue-pages.ts` (anciens slugs, fiches inactives, exercice retiré). Règle : plafonds sur les LISTES, fiche ouverte par lien toujours lisible. `GET /api/carnet` à créer autour de `carnetViewForPlan`. `user/subscription` étendu (source, mode de gestion). `GET /api/mobile/bootstrap` (plan, source active, contenu du jour, version minimale, interrupteurs `APP_ACHAT_OUVERT` et `APP_PUSH_OUVERT` dans `config/mobile.ts`), `POST /api/mobile/iap/sync` (Premium visible sans attendre le webhook) |
| Suppression de compte | `DELETE /api/user` existe : cookie, garde d'origine, mot retapé, Stripe résilié d'abord | Adapter (§9.5) |
| Deux `schema.prisma` | `prisma/schema.prisma` et `apps/web/prisma/schema.prisma`, copies identiques de 1 246 lignes | **À signaler** : toute migration touche les deux, ou on en supprime un (décision à part) |
| Widget | `/api/widget/v1/vanne-du-jour` tout public mais inerte (`WIDGET_VANNE_DU_JOUR_PUBLIE = false`, 503) | Interrupteur ouvert ou route dédiée à l'app |
| `apps/mobile` | Expo 52, 2 fichiers utiles ; `app.json` invalide (paquet Android `fr.deviens-marrant.app` avec tiret, icône absente, pas de `scheme`, `projectId` vide) ; Capacitor : `fr.deviensmarrant.app` | Repartir à neuf, hors de tout espace de travail npm (verrou séparé). Reliquats Capacitor : passe séparée après la sortie |
| Cloudflare, liens universels | Règles anti-robots possibles ; pas d'`apple-app-site-association` | [À VÉRIFIER @infrastructure] exception sur `/api/mobile/*` (agent `CFNetwork`) ; fichier AASA servi en JSON, sans redirection (dépend de l'identifiant d'équipe, lot 0) |

## 8. Choix techniques de l'app

- **Expo (React Native, TypeScript), dernière SDK stable au début du lot 7** (SDK 55 confirmée, sortie 25/02/2026 ; suivantes non confirmées par une source primaire ; noter le choix dans `docs/dev-decisions.md`). Depuis le 28/04/2026, Apple exige Xcode 26 et le SDK iOS 26 pour tout envoi : l'image EAS doit les utiliser. Builds de développement (RevenueCat et widget imposent du code natif, pas Expo Go), Expo Router, TanStack Query avec persistance locale, zustand, `expo-secure-store`. Pas de WebView du site pour le cœur (4.2). Types partagés par copie générée, jamais d'import de `apps/web/src`.
- **Notifications** : jeton Expo, envoi par l'API Expo (aucun coût associé selon la FAQ Expo), jeton d'accès Expo en secret Worker. Permission demandée en contexte ; l'app reste pleinement utilisable sans (4.5.4).
- **Analytics** : site Umami séparé pour l'app, événements sans donnée personnelle, identifiant d'installation aléatoire non relié au compte. Cet identifiant est un traceur : conditions de l'exemption CNIL (finalité limitée à l'éditeur, pas de recoupement, engagement du fournisseur) à cadrer par @legal [À VÉRIFIER : format d'envoi des événements depuis une app]. Aucun SDK de pistage, pas de fenêtre ATT. Plan de marquage par @data-analyst **avant le lot 7** ; événements du geste : premier lancement, première chute révélée, permission push, exercice fait, vanne partagée, garder, écran d'offre vu, achat, restauration.
- **Tests sans Mac** : Jest pour chaque route nouvelle et pour le webhook (fixtures RevenueCat) ; Maestro sur simulateur iOS dans le cloud avec captures, dès le build 0 [À VÉRIFIER : coût et disponibilité des workflows Maestro iOS sur l'offre retenue] ; TestFlight par Thomas pour notifications et achats (non testables sur simulateur).
- **Coûts** : RevenueCat gratuit jusqu'à 2 500 USD de revenu suivi par mois, puis 1 % ; EAS Starter 19 USD par mois, quota gratuit à relire sur la page Expo avant le lot 7 ; coût serveur négligeable (requêtes Worker et Neon, écriture `JobLock` par appel limité). `bootstrap` mis en cache côté app, fractionné si la latence dépasse 1 s (Neon à froid).
- **Design** : identité du site réutilisée, sauf réponse de Thomas à la question 4 (§1). Aucun CORS ouvert pour l'app.

## 9. Paiement, consommation et conformité

### 9.1 Règles Apple et chiffres (à reconfirmer sur les pages Apple avant paiement ou soumission)
- **Achat intégré obligatoire** pour un abonnement numérique vendu dans l'app (3.1.1). L'habilitation de lien externe (3.1.1(a)) existe : non retenue en V1.
- **Commission** : programme petites entreprises (moins d'1 M USD, sur inscription, approbation sous 15 jours après la fin du mois fiscal) = **15 % dès le premier paiement** d'un abonnement. **Inscrire avant la première vente.** Sans le programme : taux standard UE 26 % depuis le 01/10/2026 [source à reconfirmer : texte Attachment 14 à lire] la première année d'un abonné, puis 15 % au-delà d'un an de service payé.
- **Lien externe UE** (conditions d'août 2026, effet 01/10/2026 selon Apple) : 15 %, 10 % pour un membre du programme. Pour Marrant inscrit : achat intégré 15 % contre lien 10 %, moins des frais Stripe non chiffrés ici. Écart faible ; non retenu en V1 pour la simplicité et le risque de refus, pas parce que « ça n'économise rien » [À VÉRIFIER : conditions d'éligibilité pour la France]. À noter pour la V2 : l'achat intégré peut coexister avec un paiement alternatif en UE, avec engagement de 12 mois. La proposition américaine de 15 % citée en v0 n'est pas retrouvée : retirée (aucun lien externe en V1, donc sans impact).
- **3.1.3(b)** : accès à un abonnement acheté ailleurs seulement si l'achat intégré est aussi vendu dans l'app (levé). **Nulle part dans la V1** : ni lien, ni prix, ni mention de Stripe ou du paiement web dans l'app. Pas de « 0,99 € à vie » dans l'app.
- **Paliers** : 1,99 € et 16,99 € à confirmer dans la grille France d'App Store Connect [À VÉRIFIER] ; sinon palier le plus proche sans toucher au site, ou alignement du site (décision 6). Toute hausse future suit la procédure d'Apple (consentement des abonnés au-delà de seuils). TVA : qui facture et reverse, base de la commission : à lire dans le contrat Apps payantes, rien d'affirmé ici ; facturation électronique à ouvrir avec le comptable après lecture du contrat.

### 9.2 Écran d'offre conforme 3.1.2
Titre de l'abonnement, durée, prix, renouvellement automatique, résiliation dans Réglages > Abonnements, lien CGU (dans la description ou EULA personnalisée téléversée) et lien confidentialité (champ App Store Connect ET dans l'app), bouton **« Restaurer mes achats »**. Un extrait réel de ce que Premium débloque précède tout mur (grille C10). **Réassurance propre à l'app**, calibrée au lot 3 : la phrase du site « premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » est **fausse pour un achat Apple** (résiliation dans les réglages de l'iPhone, remboursement demandé à Apple) et ne doit pas y figurer. Question courte à @legal : régime des 14 jours et rappel de reconduction (`RenewalReminder`, L.215-1, lié au modèle Stripe) pour un abonné Apple.

### 9.3 Consommation, abonnement vendu dans l'app (validation par un avocat avant publication)
- **Rôle d'Apple** (commissionnaire ou vendeur) : à lire dans le contrat Apps payantes (aucune source primaire retrouvée) ; il détermine qui porte l'information précontractuelle (L.221-5), la rétractation, les remboursements et la facture.
- **Ce que Marrant affiche lui-même** : nature du service, prix TTC, durée, reconduction, résiliation via Réglages Apple, lien vers les conditions d'Apple pour les remboursements.
- **Rétractation** : confirmer sur Légifrance le régime du contenu numérique avec renoncement exprès (L.221-28 13°) et l'obligation de bouton de rétractation en ligne en vigueur depuis le 19/06/2026 (sources secondaires seulement à ce jour). Distinguer le site (Stripe, notre flux, CGU existantes) et l'app (flux Apple, hors de notre contrôle). CGV mobile courte : l'achat est géré par Apple, renvoi à ses conditions, aucune clause qui écarte les droits du consommateur (principe du 25/10 : juridique limité à l'obligatoire).

### 9.4 Vendeur, DSA et compte Apple Developer
- **Statut de vendeur professionnel (DSA) obligatoire** : adresse, téléphone et e-mail publiés sur la fiche dans les 27 pays de l'UE, pour une société comme pour un individuel. Prévoir des coordonnées professionnelles, pas personnelles.
- **Société** : suppose une entité immatriculée (réserve R4 à lever AVANT), la même que l'éditeur du site, de Stripe et des CGU ; le nom légal exact s'affiche ; D-U-N-S au nom exact ; Apple n'accepte pas de nom commercial (DBA) comme identité d'organisation. **Individuel** : le nom légal de Thomas s'affiche, contraire à la règle du 29/09 (aucun nom ni « Issa Capital » ni autre identité réelle) ; conversion en organisation possible plus tard (d'après Apple). On ne suppose pas quelle entité encaisse : décision 1. Chaîne : entité existante et nom exact, puis D-U-N-S, puis inscription, puis programme petites entreprises.

### 9.5 Suppression de compte (5.1.1(v))
`DELETE /api/user` adapté : jeton accepté ; Stripe résilié (existant) ; sessions mobiles révoquées ; client RevenueCat supprimé (API de suppression d'abonné, RGPD) ; jeton de notification supprimé. L'écran dit « ton abonnement Apple continue, annule-le ici » avec lien vers les abonnements, et offre « supprimer à l'échéance » en plus de la suppression immédiate (suggestion d'Apple). Un webhook postérieur pour un compte supprimé ne doit jamais échouer (§7). **Confirmation : 2 touches dans l'app** (bouton, puis confirmation système avec le rappel Apple), car la grille C11 est bloquante ; le mot retapé du site reste sur le web. Arbitrage : décision 14.

### 9.6 RGPD du mobile
Mettre à jour `/confidentialite` (obligatoire) : app, RevenueCat et Expo (sous-traitants, contrats, transferts hors UE : garanties non vérifiées ici), jeton de notification (donnée personnelle, base légale, durée), identifiant d'installation et sa conservation. Étiquettes App Privacy alignées sur ce texte et couvrant les SDK tiers (e-mail, identifiant utilisateur, achats via RevenueCat, jeton push, données d'usage) ; « non lié » seulement si jamais recoupé avec le compte ; manifestes `PrivacyInfo.xcprivacy` des SDK listés, inventaire par le rapport Xcode. La permission système n'est pas le consentement RGPD.

### 9.7 Coexistence Stripe et Apple (règle d'or : une seule source active par compte)
- Abonné Stripe qui ouvre l'app : `bootstrap` renvoie Premium, écran d'offre masqué, profil « abonnement géré depuis le site » sans lien d'achat. Abonné Apple sur le site : « Abonnement géré par Apple », jamais de bouton d'achat (§12).
- **Achat : compte avant paiement** (reco @fullstack, décision 3) : le compte est créé dans le trajet d'achat avant StoreKit, comme sur le site ; `appUserID` RevenueCat = `User.id` (jamais l'e-mail). Cela supprime les identifiants orphelins et `TRANSFER`. Connexion à un compte déjà Premium Stripe : blocage doux avant le paiement. Un Premium n'existe donc jamais sans compte (favoris, progression, lettre, question à l'équipe en dépendent).
- Abonnés de lancement à 0,99 € : restent sur Stripe, jamais migrés (01/10). Résiliation = perte d'accès aux livrables, identique sur les deux circuits.
- **RevenueCat** (au-dessus de StoreKit) : un seul modèle de droits pour iPhone puis Android, validation des reçus, restauration. Alternative StoreKit direct non retenue (validation des reçus et notifications serveur à construire).

## 10. Prérequis qui ne dépendent que de Thomas

| Prérequis | Détail |
|---|---|
| Compte Apple Developer | 99 USD par an [À VÉRIFIER à l'inscription] ; décision 1 (entité, DSA, D-U-N-S : [Apple](https://developer.apple.com/help/account/membership/D-U-N-S/), délais à confirmer) |
| Programme petites entreprises | Inscription dès l'ouverture du compte, avant la première vente |
| Contrats, banque, fiscal | Contrat « Apps payantes », coordonnées bancaires, formulaires fiscaux, dans App Store Connect |
| Identifiant d'app | Reco `fr.deviensmarrant.app` (valable iPhone et Android) ; irréversible une fois créé ; le `fr.deviens-marrant.app` d'`app.json` est invalide pour Android (décision 2) |
| Expo et RevenueCat | Compte Expo (EAS), projet RevenueCat |
| Mac | Non obligatoire (build et envoi par EAS) ; aucun simulateur sous Linux : Maestro cloud + TestFlight |
| Appareils | Au moins un iPhone physique récent de Thomas pour TestFlight ; un second plus ancien si possible |
| Compte relecteur | Accès Premium offert pour Apple et les testeurs, exclu des statistiques (comme `EMAILS_INTERNES_EXCLUS`) |
| Fiche App Store | **Nom** « Deviens Marrant » (disponibilité à vérifier dans App Store Connect). **Sous-titre ≤ 30 caractères** (nom et sous-titre : 30 chacun), candidats à calibrer avec @copywriter : « Une vanne par jour, décryptée » (29), « La vanne du jour, décryptée » (26). **Mots-clés fondés sur les requêtes réelles** : blague, vanne, humour noir, blague 2026, autodérision, humour observationnel (la demande dans l'App Store reste à mesurer par @seo ou @growth avant de figer). Description, captures de l'app réelle (@design), URL confidentialité et assistance, catégorie, questionnaire d'âge à jour (4+, 9+, 13+, 16+, 18+ ; « pas de contenu utilisateur partagé », la question à l'équipe est privée), storefronts (décision 13), coordonnées de revue |
| Notes de revue | Contenu humoristique tout public, aucun contenu utilisateur partagé, compte de démonstration Premium. Ne pas invoquer l'exemption des humoristes professionnels pour nos propres vannes. Aucune mention d'IA (P0 06/05), de concurrent, d'Android, de prix web, de bêta ; zéro tiret cadratin |

## 11. Risques de refus App Store et parades

| Risque | Pourquoi | Parade |
|---|---|---|
| 3.1.1, 3.1.2, 3.1.3 | Abonnés Stripe à reconnaître ; métadonnées d'abonnement | Achat intégré toujours proposé ; écran d'offre §9.2 ; zéro mention de paiement web |
| 2.1 revue | La revue achète en bac à sable | Droits SANDBOX acceptés et marqués, compte relecteur, notes claires |
| 4.2 fonctionnalité minimale | Un contenu éditorial ressemble à un site emballé | Pas de WebView ; geste quotidien, notifications, hors ligne, widget, partage natif |
| 5.1.1(v) suppression | Création de compte dans l'app | §9.5 |
| 5.1.1, 5.1.2 confidentialité | SDK tiers, jeton push, identifiant d'installation | §9.6 |
| 4.8 connexion tierce | Le site propose Google | Pas de connexion tierce en V1 ; toute connexion tierce ajoutée plus tard déclenche l'obligation d'une option équivalente (nom et e-mail seulement, e-mail masquable, pas de pistage) |
| 1.1 contenu offensant | Humour, chambrage, humour noir très recherché | Contenu tout public filtré (barre Alexa) ; questionnaire d'âge honnête ; l'exemption des humoristes professionnels n'a pas été retrouvée et ne couvre pas nos vannes |
| 5.2 propriété intellectuelle | Extraits de stand-up de tiers | Lecteur officiel uniquement, jamais d'extraction ; fiches pédagogiques à nous |
| 4.5.4 notifications | Push quotidien | Opt-in en contexte, éditorial sans promotion, heure réglable, arrêt dans l'app |

## 12. Changements côté site : à soumettre à Thomas, chacun par `REPLIT_ACTIONS.md`, CI verte, go de Thomas

Aucun n'est présumé accepté (règles du 17/10 « pas de pop-up ni de bandeau », du 18/10 « ne pas concurrencer le bouton payant », du 21/10 « retouche minimale »).

| # | Changement | Pourquoi | Reco / alternative |
|---|---|---|---|
| S1 | `/abonnement`, `/profil`, résumé d'abonnement : abonné Apple voit « Abonnement géré par Apple », jamais de bouton d'achat | Garde double abonnement (§7) | Nécessaire, textes sur étalons |
| S2 | Page `/app` | Entrée vers l'app | Reco : page + lien discret sous la vanne du jour. Alternative : bannière native de Safari (un bandeau : à trancher, décision 9) |
| S3 | Lien public TestFlight « Essayer l'app en avant-première » sur `/app` et la vanne du jour, mobile seulement | Tester H0 sans rien de faux | Après la revue bêta d'Apple du build 0 |
| S4 | Fiche partagée ouverte hors app : bannière d'installation éventuelle | Distribution par le partage | Reco : fiche telle quelle. Alternative : bandeau discret (décision 9) |
| S5 | `forgot-password` : e-mail « créer ton mot de passe » pour les comptes Google | Comptes Google dans l'app | Textes @copywriter sur étalons |
| S6 | Fichier `/.well-known/apple-app-site-association` | Liens universels | Sans effet visible |
| S7 | `/confidentialite`, CGU, mentions : mise à jour de l'obligatoire (app, sous-traitants, achat Apple) | §9.3, §9.6 | Minimale, validée par un avocat |
| S8 | Ouverture de l'API widget ou route dédiée app | Widget iPhone | Interrupteur existant |
| S9 | E-mail de recrutement des testeurs (inscrits à la lettre, 12 comptes gratuits, 4 abonnés) | Build 0 | Brouillon seulement, envoi par Thomas, hors lettres approuvées |

## 13. Plan par dépendances (aucune durée en semaines)

Le lot 0 (délais d'Apple) est le chemin critique : le lancer dès la décision 1. Le build 0 part en TestFlight sans les contrats bancaires.

| Lot | Contenu | Agents | Dépend de |
|---|---|---|---|
| **0** | Compte Apple Developer, D-U-N-S si société, programme petites entreprises, identifiant d'app, compte Expo, projet RevenueCat ; contrats et banque ensuite | Thomas guidé par @infrastructure | Décisions 1, 2 |
| **1** | User stories par écran (geste, premier lancement, états transverses, critères de la grille C1 à C11), maquettes, design de l'app | @product-manager, @ux, @design | Cadrage validé, réponses §1 |
| **2** | Mesure préalable (Umami, §6), seuils H0 à H6, demande App Store pour sous-titre et mots-clés | @data-analyst, @seo ou @growth | Parallèle au lot 1 ; seuils avant le premier TestFlight |
| **3** | Textes : étalons calibrés avec Thomas AVANT rédaction (P0 s8), notification, permission, écran d'offre, fiche, notes de revue ; textes relus à l'aveugle 2 sur 3 avant intégration (règle d'or P0 s18) | @copywriter | Lot 1, étalons de Thomas |
| **4** | Consommation, CGV mobile, EULA, confidentialité, étiquettes ; avocat | @legal | Lot 1 |
| **5a** | **Socle site en production avant toute vente** : `recalculerPlan`, `StoreEntitlement`, webhook réécrit, gardes, admin, réconciliation, écrans S1, S5, S7, correctif `DELETE` push, migrations (deux schémas), tests Jest non-régression Stripe | @fullstack | Lot 1, décision 3 |
| **5b** | API mobile : jetons, `bootstrap`, fiches par slug, carnet, push public, job d'envoi, `iap/sync`, `user/xp` idempotent | @fullstack | Lot 1, parallèle à 5a |
| **6** | Préproduction (branche Neon, Worker, webhook RevenueCat séparé), EAS, liens universels (S6), exception Cloudflare, plan de marquage | @infrastructure, @data-analyst | Lot 0 (identifiant d'équipe) ; avant les lots 7 et 10 |
| **7** | **Build 0** : projet Expo neuf, premier lancement, boucle du geste, notification à l'heure choisie, série, partage, états transverses ; TestFlight interne | @fullstack | Lots 0, 5b, 6, 1 |
| **8** | Testeurs (S9), lien public (S3), lecture à J7 : 3 questions dans l'app (qu'est-ce qui t'a fait ouvrir, qu'as-tu envoyé, qu'est-ce qui manque) et celles de la grille §4 | Thomas, @data-analyst | Lot 7 |
| **9** | Parcours, carnet, favoris, quiz, Explorer, profil, suppression de compte, hors ligne complet | @fullstack | Lot 7 |
| **10** | Achat intégré : produits, écran d'offre, restauration, `iap/sync` | @fullstack | Lots 0 (contrats), 5a, 6 |
| **11** | Widget d'accueil (extension native) ; part en V1.1 sans changer le reste s'il fragilise le build | @fullstack | Lot 7, S8 |
| **12** | QA complète : Maestro dès le build 0, TestFlight, achats en bac à sable, scénarios persona, 5 états, hors ligne ; rendu itéré jusqu'à 10/10 chez @design et @ux (07/10) ; panel à l'aveugle noté sur la grille utilisateur | @qa, @reviewer, @ux, @design | Lots 7 à 11 |
| **13** | Soumission et mise en ligne : **API mobile et lot site EN PRODUCTION** (migrations jouées d'abord), fiche, notes de revue, compte relecteur | @infrastructure, @fullstack | Lot 12, 5a, 5b, décision de Thomas |
| **14** | Android (même code, facturation Google par le même outil) | @fullstack, @qa | Lot 13 |

## 14. Décisions de Thomas

1. **Entité éditrice et compte Apple** : existe-t-il une entité immatriculée qui édite le site et encaisse (« deviens-marrant SAS » non confirmée, R4) ? Reco : société si l'entité existe (nom légal exact affiché, coordonnées professionnelles DSA) ; sinon immatriculer d'abord. Alternative : compte individuel tout de suite (ton nom légal et tes coordonnées visibles, contraire à la règle du 29/09), convertible plus tard.
2. **Identifiant d'app** (irréversible) : reco `fr.deviensmarrant.app`. Alternative : un autre identifiant, à fixer avant la création dans App Store Connect.
3. **Achat sans compte** : reco **compte avant paiement** (trajet du site, `appUserID` = `User.id`, aucun droit orphelin). Alternative : compte demandé juste après l'achat, au prix de la gestion de `TRANSFER` et d'un Premium temporairement sans compte.
4. **Série et exercice du jour** : reco série = exercice de la vanne du jour OU étape/défi/quiz validé (précise D3), et exercice de la vanne du jour ouvert à tous dans l'app. Alternative : série réservée à l'étape de parcours (reste à zéro six jours sur sept) et exercice réservé à Premium (geste amputé pour les non-abonnés).
5. **Humour noir** : catégorie absente de la base, très recherchée (« blague humour noir 2026 », 383 impressions, 27 clics). Reco : collection éditoriale tirée du catalogue validé, questionnaire d'âge rempli en conséquence. Alternative : ne rien créer en V1 (risque 1.1 et âge évités, demande non servie).
6. **Prix dans l'app** : reco identique au site (1,99 € et 16,99 €), sous réserve des paliers France. Alternative : prix plus haut pour absorber la commission (incohérent avec la marque).
7. **Connexion** : reco e-mail et mot de passe seulement ; les comptes Google créent leur mot de passe par e-mail (S5). Alternative : « Se connecter avec Apple » et Google, avec fusion de comptes à e-mail masqué.
8. **Vendre dans l'app via l'achat intégré** (lié à ta question 5 du §1) : reco oui (15 % dès le premier mois via le programme). Alternative : connexion des abonnés du site seulement (risque 3.1.3(b), §1).
9. **Entrée vers l'app sur le site** : reco page `/app` et lien discret sous la vanne du jour. Alternative : bannière native de Safari et bandeau sur la fiche partagée (S2, S4).
10. **Android** : reco après l'approbation iPhone. Alternative : en parallèle dès le lot 9, double QA.
11. **Widget dans la V1** : reco oui, sélection tout public ; V1.1 s'il fragilise le build. Alternative : V1.1 d'emblée.
12. **Nom et sous-titre App Store** : reco nom « Deviens Marrant », sous-titre ≤ 30 caractères calibré sur les requêtes réelles (§10). Alternative : nom seul, mots-clés dans le champ caché.
13. **Pays de distribution** : reco pays francophones d'abord (France, Belgique, Suisse, Canada ; Afrique francophone selon la grille de prix). Alternative : monde entier, y compris les États-Unis où le régime des liens externes bouge.
14. **Suppression de compte** : reco 2 touches dans l'app avec confirmation système (grille C11), mot retapé conservé sur le site. Alternative : garder le mot retapé aussi dans l'app (protection contre un geste accidentel).
15. **Testeurs du build 0** : reco e-mail dédié en brouillon, envoyé par toi aux inscrits, comptes gratuits et abonnés. Alternative : aucun recrutement avant la revue publique.

## 15. Handoff

- **Bloquants** : §1 (réponses de Thomas, 5 questions) ; décision 1 (chemin critique du lot 0) ; décisions 3 et 4 avant le lot 1.
- **À vérifier** : taux Apple UE (texte Attachment 14) et éligibilité France ; grille France 1,99 € et 16,99 € ; rôle d'Apple dans le contrat Apps payantes ; Légifrance (L.221-5, L.221-28, bouton de rétractation) ; `/api/daily` et exercice ouvert ; événements Umami ; coût Maestro et quota EAS ; stock tout public couvrant le calendrier ; réutilisation des gabarits de cartes ; 99 USD ; délais D-U-N-S.
- **Prochains agents** : @ux et @product-manager (lot 1, dès réponses §1), @infrastructure (lot 0), @data-analyst (lot 2), @fullstack (5a et 5b), @legal (lot 4). La session principale ajoute l'entrée s23 à `project-context.md`.

## 16. Tableau Correction → où elle est traitée dans la v1

Préfixes : R = @reviewer (O1 à O13), L = @legal (O1 à O8), F = @fullstack (1 à 15), E = @elon (O1 à O9).

| Correction | Traitée en |
|---|---|
| R-O1, F-7, F-8 (notification sans compte, `daily-push`) | §7 lignes « Notification sans compte » et « `daily-push` » ; §3 ; lot 5b |
| R-O2, F-3, F-4, L-O5 (webhook, modèle Apple, rétrogradation, anonyme, `TRANSFER`, hebdo, SANDBOX) | §7 lignes « Modèle Apple », « Webhook RevenueCat », « Bac à sable » ; §9.7 ; lot 5a |
| F-2 (un seul écrivain du plan) et bouton admin (surprise F n°10) | §7 lignes « Plan Premium » et « Bouton admin » ; lot 5a avant le lot 10 |
| F-5 (double abonnement, écrans « géré par Apple ») | §7 « Double abonnement » ; §9.7 ; §12 S1 |
| R-O3, F-6 (Premium sans compte) | §9.7 ; décision 3 |
| R-O4, F-13 (XP et série du visiteur, file hors ligne, progression Premium) | §3 « Série de jours » ; §4 « Hors ligne » |
| R-O5, F-1 (comptes Google, mot de passe oublié) | §7 « Comptes Google » ; §12 S5 ; décision 7 |
| R-O6, F-15 (marqueurs levés par le code ou une source primaire) | §7 (existence de `PushToken`, `DELETE /api/user`, absence de `/api/carnet`) ; §8 (Xcode 26, Expo gratuit, RevenueCat) ; §9.5 (mot retapé, décision 14) |
| R-O7, E-O2 (données réelles) | §2 |
| R-O8 (changements du site à soumettre) | §12 ; décision 9 ; lots 5a et 6 |
| R-O9, L-O4 (décision 1 : entité, DSA, identité réelle) | §9.4 ; §10 ; décision 1 |
| R-O10, L-O8 (commission, sources, US, TVA) | §9.1 ; §10 |
| R-O11 (réassurance fausse pour Apple) | §9.2 ; lot 3 |
| R-O12 (trous du plan) | §13 : premier lancement et états transverses au lot 7, plan de marquage au lot 6 avant le 7, lot 13 dépend de la production, rendu 10/10 au lot 12, relecture à l'aveugle au lot 3 |
| R-O13, E-O9 (sous-titre ≤ 30, mots-clés fondés sur les données) | §10 « Fiche App Store » ; §2 ; décision 12 |
| L-O1, L-O2, L-O3 (consommation, rétractation, résiliation ; 3.1.2 et restauration) | §9.3 ; §9.2 |
| L-O6 (suppression de compte) | §9.5 ; §7 « Suppression de compte » |
| L-O7 (RGPD mobile, étiquettes, SDK) | §9.6 ; §8 « Analytics » ; lot 4 |
| F-9 (bac à sable, préproduction avant la vente) | §7 « Bac à sable » ; lot 6 avant le lot 10 |
| F-10 (identifiant d'app) | §10 ; décision 2 ; lot 0 |
| F-11, F-12 (jetons mobiles dédiés ; routes réutilisables après utilitaire, fiches par slug) | §7 « Jetons mobiles » et « Routes existantes » |
| F-14 (tests sans Mac) | §8 « Tests sans Mac » ; lot 12 |
| E-O1, E-O3, E-O4, E-O5, E-O6 (un seul geste, boucle, série et D3, partage, conversion, exercice du jour) | §2 ; §3 (étape 5, « Série de jours », « Moments de conversion », « Carte image ») ; §4 ; décision 4 |
| E-O7, E-O8 (hypothèses chiffrées, H0 ; build 0) | §6 ; §13 lots 7 et 8 |

## 17. Sources (consultées par les relecteurs le 04/11/2026, à reconfirmer sur les pages Apple)

[App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) · [5.1.1(v)](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion/) · [Small Business Program](https://developer.apple.com/app-store/small-business-program/) · [Apple Newsroom UE, 08/2026](https://www.apple.com/newsroom/2026/08/apple-announces-changes-for-apps-in-the-european-union/) · [Apple Developer, changements UE](https://developer.apple.com/news/?id=gmws0jgp) · [DSA vendeur](https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-compliance-information) · [Exigences SDK](https://developer.apple.com/news/upcoming-requirements/) · [Tranches d'âge](https://developer.apple.com/news/?id=ks775ehf) · [App Privacy Details](https://developer.apple.com/app-store/app-privacy-details/) · [SDK tiers](https://developer.apple.com/support/third-party-SDK-requirements/) · [Fiche produit, 30 caractères](https://developer.apple.com/app-store/product-page) · [CNIL, mesure de fréquentation](https://www.cnil.fr/fr/mesurer-la-frequentation-de-vos-sites-web-et-de-vos-applications) · [Expo SDK 55](https://expo.dev/sdk/55) · [Expo, notifications](https://docs.expo.dev/push-notifications/faq/) · [Expo, offres](https://docs.expo.dev/billing/plans/) · [RevenueCat, tarifs](https://www.revenuecat.com/pricing/) · [RevenueCat, programme petites entreprises](https://revenuecat.com/blog/engineering/small-business-program)
