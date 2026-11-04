# Cadrage de l'app iPhone native, Deviens Marrant (session 23, 04/11/2026)

> Auteur : @product-manager. Décision de Thomas : « commençons par une vraie app native » iPhone (ni site emballé, ni PWA), Android ensuite.
> Lu pour ce cadrage : `project-context.md`, `docs/founder-preferences.md`, squelette `apps/mobile`, début de `docs/mobile/specs-mobile.md`, routes `apps/web/src/app/api/**`, routes `iap/revenuecat-webhook`, `push/register-token`, `cron/daily-push`. Les autres `docs/mobile/*.md` n'ont pas été relus en détail (voir §3.0). Marqueur `[À VÉRIFIER]` = incertain ou source secondaire. Aucun chiffre Apple non sourcé.
> Prix en vigueur (founder-preferences 24/10) : Premium 1,99 € TTC/mois ou 16,99 € TTC/an. Abonnés de lancement : 0,99 € à vie (Stripe uniquement).

## 1. Proposition de valeur de l'app (par rapport au site)

**Le site sert à trouver et à lire. L'app sert à pratiquer et à avoir ses répliques sur soi.** Yanis (20 ans, muet quand on se chambre) ne progresse pas en lisant un article une fois : il progresse en s'entraînant un peu, souvent, juste avant les moments de situation (soirée, coloc, machine à café). Un site oblige à y penser. Une app vient le chercher.

| Raison d'ouvrir l'app chaque jour | Ce que le site ne fait pas | Persona servi |
|---|---|---|
| **La vanne du jour en notification** à l'heure choisie (mise en place seulement, la chute se révèle dans l'app, comme « Révéler la chute » du site) | Aucune relance sans e-mail ; la lettre est mensuelle (gratuite) ou hebdomadaire (Premium) | Yanis, Sophie |
| **Un défi de parcours à portée de pouce** (15 à 20 min/semaine, 5 parcours), série de jours de pratique, XP | Le parcours web demande de s'asseoir devant un écran et de se souvenir de revenir | Yanis, Marc |
| **Le carnet de répartie mensuel** consultable hors ligne, juste avant de sortir (situation, réplique, sortie polie) | Pas d'accès sans réseau, pas de « sac à répliques » dans la poche | Yanis, Sophie |
| **Le catalogue en poche** (vannes, conseils, vidéos analysées), favoris, partage natif d'une vanne à un pote | Partage par lien seulement, pas de feuille de partage native | Sophie (anecdotes pour l'afterwork) |

**Hypothèses à tester (assumption map)** : (H1) un visiteur active la notification quotidienne après avoir vu la première vanne ; (H2) la notification ramène dans l'app plus qu'un e-mail ; (H3) la série de jours de pratique augmente le passage à Premium. Seuils de succès à fixer par @data-analyst avant la sortie (aucune valeur inventée ici). Piège à éviter : l'app ne doit pas être un second site ; chaque écran doit servir la pratique (commandement 5 : décision sur la valeur persona, pas sur un calcul d'effort).

**Fait à garder en tête** : la base installée au départ est minuscule (2 abonnés de lancement au 01/10, 12 comptes gratuits). L'app n'a donc pas d'audience captive : l'entrée passe par le site (bannière d'app, page `/app`, lien sous la vanne du jour), le widget intégrable et le bouche à oreille de la feuille de partage.

## 2. Périmètre V1 (iPhone)

**Principe maison conservé** : pas de compte gratuit (founder-preferences 05/10). L'app s'ouvre **sans compte** avec exactement les droits du visiteur du site (listes 10/3/3, contenu du jour, étape 1 de chaque parcours, quiz, fiche offerte du carnet). Le compte ne se crée que pour retrouver son Premium sur plusieurs appareils.

### Écrans
1. **Premier lancement** (3 écrans au plus) : promesse, choix de l'heure de la vanne du jour **par l'utilisateur** (pas d'heure imposée), demande de permission push seulement après avoir montré une première vanne.
2. **Aujourd'hui** : vanne du jour + chute à révéler, conseil du jour, vidéo du jour, série en cours.
3. **Parcours** : hub des 5 parcours (Machine à Café, Répartie, Confiance, Storytelling, Boulot), détail, étape, défi, quiz d'étape, XP. Premium : toutes les étapes ouvertes ; ordre conseillé, jamais imposé.
4. **Carnet** : mois en cours, fiches (la fiche offerte pour tous, le reste Premium), lisible hors ligne.
5. **Explorer** : vannes, conseils, vidéos, recherche, filtres, fiche détail, partage natif. Vidéos via le lecteur officiel intégré (jamais d'extraction du flux).
6. **Favoris** (Premium).
7. **Quiz d'humour** (12 questions, profil, orientation vers un parcours).
8. **Premium** (écran d'offre) : « Premium ouvre tout Deviens Marrant », mensuel et annuel, restauration des achats, liens CGU et confidentialité.
9. **Profil** : connexion/création, abonnement (statut, origine Apple ou site, comment gérer), notifications (heure, rappel de parcours séparé), inscription à la lettre du mois, « Ta question à l'équipe » (Premium), mentions légales, **suppression du compte dans l'app**.
10. **États transverses** : hors ligne, erreur réseau, session expirée, mise à jour obligatoire, contenu vide, chacun avec message et sortie.

### Fonctionnalités
- Notification quotidienne de la vanne du jour (contenu du calendrier préparé et validé à l'avance, jamais généré en direct) ; **aucune promotion, aucun prix dans les notifications** (cohérent avec la règle sociale du 05/10).
- Rappel de parcours **uniquement sur demande**, arrêté après 3 rappels sans activité (décision s17, D7).
- Achat intégré Apple (mensuel, annuel), restauration, Premium partagé avec les abonnés Stripe (§4).
- Lecture hors ligne : contenu du jour, favoris, carnet du mois, étape en cours ; la progression (XP, étape validée) est mise en file et synchronisée avec garde d'idempotence.
- Widget d'écran d'accueil « Vanne du jour » (mise en place visible, chute dans l'app), sans compte. Risque technique propre (extension native sous Expo) : voir décision 8.
- Liens universels (une vanne partagée s'ouvre dans l'app si elle est installée, sinon sur le site).

### Hors V1, avec raison
| Élément | Pourquoi hors V1 |
|---|---|
| Android | Décision de Thomas (iPhone d'abord) ; le code Expo est partagé, la facturation passe par le même outil (§4) |
| Articles de blog dans l'app | La valeur d'un article est le SEO et la lecture ; l'app ouvre l'article dans le navigateur intégré, sans le recopier |
| Connexion Google ou Apple | Évite la règle 4.8 et la fusion de comptes à e-mail masqué (décision 3) |
| Fonction IA membres (`/api/ai`) | Aucun critère de qualité ni comportement d'échec spécifié pour mobile ; état de la fonction en production à confirmer [À VÉRIFIER] |
| Apple Watch, Live Activities, forum, certificat de fin | Aucune valeur persona démontrée (pas de forum : décision s21 ; pas de certificat : décision s17) |
| Période d'essai | Le site n'en propose pas ; cohérence d'offre et de mesure |

## 3. Choix techniques recommandés

### 3.0 Existant : repartir à neuf, réutiliser les décisions
- **Squelette `apps/mobile` : repartir d'un projet neuf.** Il contient un `App.tsx`, un navigateur et un `HomeScreen`, sur Expo 52 (fin 2024). Peu de valeur à conserver ; une SDK de cette ancienneté est un frein aux dépôts App Store [À VÉRIFIER : exigences minimales de SDK/Xcode d'Apple en 2026 et version courante d'Expo]. On garde seulement les choix : TypeScript, zustand, `expo-secure-store`.
- **`docs/mobile/*.md` : à réviser, pas à reprendre tels quels.** Pensés pour un emballage Capacitor, l'époque Replit et l'ancien prix (0,99 € partout). `specs-mobile.md` (export statique du site, cookies inter-sites, heure d'envoi fixe 9 h UTC+1) est caduc. Les documents ASO, CGV, légal, privacy, design, onboarding, infra et fetch-audit sont à rejouer par les agents concernés sur la base de ce cadrage.
- **Déjà en place côté site, à vérifier avant usage** : `api/iap/revenuecat-webhook` (met `plan = PREMIUM` ou `FREE`, dédoublonne via `WebhookEvent`), `api/push/register-token` (écrit une table `PushToken` dont l'existence dans `schema.prisma` n'a pas été confirmée [À VÉRIFIER]), `api/cron/daily-push` (conçu pour FCM et APNs en direct, jamais mis en service à ma connaissance [À VÉRIFIER]).

### 3.1 Application
- **Expo (React Native, TypeScript), SDK actuelle, Expo Router, builds de développement** (RevenueCat et le widget imposent du code natif, donc pas Expo Go). Raison : un seul code pour iPhone puis Android, build et soumission dans le cloud (EAS), pas de Mac obligatoire (§5).
- **Données** : TanStack Query avec persistance locale pour l'hors ligne ; zustand pour l'état léger ; `expo-secure-store` pour les jetons.
- **Pas de WebView du site** pour les écrans cœur (garde-fou guideline 4.2 et qualité de la pratique).

### 3.2 Authentification (comptes existants du site)
- L'API du site s'appuie sur des cookies NextAuth (`getServerSession`) : inutilisables tels quels depuis une app. **Ajouter une authentification par jeton** : l'app envoie e-mail et mot de passe, reçoit un jeton d'accès court et un jeton de renouvellement avec rotation, stockés dans `expo-secure-store`. Les routes concernées acceptent session OU jeton via un seul utilitaire (pas de duplication de routes).
- Les comptes créés par Google sur le site n'ont pas de mot de passe : ils utilisent « mot de passe oublié » (`api/auth/forgot-password`) pour en créer un. Alternative : décision 3.

### 3.3 Consommation de l'API et endpoints à ajouter
Réutilisables en l'état ou avec un simple accès par jeton : `jokes`, `tips`, `videos`, `daily`, `search`, `parcours` (et `by-slug`, `progress`, `quiz`, `retour`), `favorites`, `user` (et `progress`, `xp`, `subscription`), `newsletter`, `question-equipe`.
À ajouter (@fullstack, avec tests) :
| Endpoint | Rôle |
|---|---|
| `POST /api/mobile/auth/login`, `/refresh`, `/logout` | Jetons (§3.2) |
| `GET /api/mobile/bootstrap` | Statut Premium et origine, contenu du jour, version minimale de l'app, interrupteurs |
| `DELETE /api/user` (si absent [À VÉRIFIER]) | Suppression de compte dans l'app, révoque les jetons, supprime les jetons de notification |
| `GET /api/carnet` (si absent [À VÉRIFIER]) | Fiches du mois et fiche offerte |
| Enregistrement du jeton de notification | Adapter `push/register-token` à un jeton Expo ; ajouter heure choisie et fuseau |
| Champ « origine de l'abonnement » (STRIPE ou APPLE) | Éviter le double abonnement, afficher le bon écran de gestion [À VÉRIFIER dans le schéma] |
Les listes plafonnées (10/3/3) restent appliquées côté API (le contenu payant n'est jamais envoyé au visiteur), jamais côté app seule.

### 3.4 Notifications push
- **APNs via le service de notification d'Expo** : l'app obtient un jeton Expo, le serveur envoie par l'API d'envoi d'Expo, qui relaie à Apple. Plus simple que de signer des requêtes APNs depuis Cloudflare Workers. Conditions tarifaires du service [À VÉRIFIER].
- Envoi planifié par le planificateur existant, **par fuseau et heure choisis**, contenu tiré du calendrier validé (aucune IA en direct, règle du 01/10). Nettoyage des jetons invalides après retour d'erreur.
- Permission demandée en contexte (après la première vanne) ; l'app reste pleinement utilisable sans (guideline 4.5.4 [À VÉRIFIER]).

### 3.5 Hors ligne
Lecture seule du contenu mis en cache (jour, favoris, carnet du mois, étape en cours) ; écritures de progression en file avec identifiant d'idempotence, rejouées à la reconnexion ; bandeau « hors ligne » sobre. Jamais de contenu Premium mis en cache pour un compte qui n'est plus Premium (purge au prochain `bootstrap`).

### 3.6 Analytics
- Umami reste l'outil du site. Pour l'app : **un site Umami séparé** (ne pas mélanger web et app), événements envoyés par l'API d'envoi d'Umami [À VÉRIFIER : format et en-têtes depuis une app], **sans donnée personnelle** (même règle que le site), identifiant d'installation aléatoire non relié au compte.
- Aucun suivi publicitaire ni SDK tiers de tracking : pas de fenêtre ATT, étiquettes de confidentialité Apple minimales.
- Revenus et abonnements : tableau de bord de l'outil de facturation (§4) plus App Store Connect. `@data-analyst` écrit le plan de marquage de l'app (entonnoir : premier lancement, permission push, première chute révélée, étape commencée, écran d'offre vu, achat, restauration).

## 4. Paiement : règles Apple et coexistence avec Stripe

### 4.1 Règles (états sourcés, à reconfirmer chez Apple avant soumission)
- **Un abonnement numérique vendu dans l'app passe par l'achat intégré d'Apple** (guideline 3.1.1). Apple se rémunère par commission ; les paliers de prix sont imposés (§4.3).
- **Commission** : standard 30 % dans le monde ; **programme petites entreprises : 15 %** pour les développeurs dont les gains annuels restent sous 1 million de dollars, mesurés après commission et taxes, sur inscription ([source magora](https://magora-systems.com/app-store-small-business-program/)). Pour un abonnement, 15 % à partir de la deuxième année continue du même abonné ([source RevenueCat](https://www.revenuecat.com/blog/engineering/app-store-fees), [9to5mac août 2026](https://9to5mac.com/2026/08/20/apples-long-running-app-store-battle-with-the-eu-appears-to-finally-be-over/)) [À VÉRIFIER : taux UE exacts, une source tierce cite 26 % comme taux standard dans l'UE].
- **Liens de paiement externes** : aux États-Unis, une décision de justice (avril 2025, confirmée en appel) interdit à Apple de prélever sur les achats par lien externe ; Apple a proposé en août 2026 15 % sur ces achats, **proposition non tranchée** ([TechCrunch](https://techcrunch.com/2025/05/08/apple-urges-court-to-suspend-ruling-that-bars-it-from-taking-a-cut-on-external-app-payments), [iClarified](https://www.iclarified.com/101778/apple-seeks-court-approval-for-15-commission-on-external-app-purchases)). **Dans l'UE**, nouvelles conditions annoncées en août 2026 : 15 % sur les achats par lien externe, 10 % pour les membres du programme petites entreprises, applicables selon la plupart des sources au 01/10/2026 ([Apple](https://apple.com/newsroom/2026/08/apple-announces-changes-for-apps-in-the-european-union), [MacRumors](https://macrumors.com/2026/08/18/eu-app-store-fee-change)) [À VÉRIFIER : conditions d'éligibilité et mise en œuvre pour la France]. Conclusion : le lien externe n'économise rien en UE (commission du même ordre que le programme à 15 %) et ajoute des écrans d'avertissement et du code ; **non retenu pour la V1**.
- **Accès à un abonnement acheté ailleurs** : un utilisateur qui s'est abonné via Stripe sur le site peut retrouver son Premium en se connectant dans l'app, à condition que l'app propose aussi l'achat intégré (service multiplateforme, guideline 3.1.3(b)) [À VÉRIFIER : texte actuel]. Hors États-Unis et UE, **ne jamais inciter dans l'app à aller payer sur le site** (ni prix, ni lien, ni mention de Stripe).
- Rappels obligatoires de l'écran d'offre : prix, durée, renouvellement automatique, liens CGU et confidentialité, bouton « Restaurer mes achats » ; la suppression du compte ne résilie pas l'abonnement Apple, l'écran de suppression doit le dire [À VÉRIFIER].

### 4.2 Outil recommandé : RevenueCat (au-dessus de StoreKit)
Raison : un seul modèle de droits pour iPhone puis Android, validation des reçus, restauration et webhooks déjà prévus côté site (`api/iap/revenuecat-webhook`), pas de serveur de reçus à écrire sur Workers. Alternative StoreKit direct : aucune dépendance tierce mais validation des reçus, notifications serveur d'Apple et Android à construire ; non retenue. Tarification de l'outil [À VÉRIFIER avant engagement].

### 4.3 Paliers de prix
Apple impose des paliers par pays. **1,99 € et 16,99 € doivent exister dans la grille France** : à confirmer dans App Store Connect [À VÉRIFIER]. Sinon, choisir le palier le plus proche sans toucher au prix du site, ou aligner le site (décision de Thomas). Ordre de grandeur illustratif en France seulement (TVA 20 % supposée incluse dans le prix affiché) : 1,99 € TTC ≈ 1,66 € HT ; commission 15 % ≈ 0,25 € ; 30 % ≈ 0,50 €. Pour les autres pays francophones, Apple gère la taxe et les paliers [À VÉRIFIER].

### 4.4 Coexistence Stripe et Apple
- **Règle d'or : une seule source d'abonnement active par compte.** Champ « origine » sur l'abonnement (STRIPE ou APPLE).
- Abonné Stripe qui ouvre l'app : `bootstrap` renvoie Premium, l'écran d'offre est masqué, le profil indique « abonnement géré depuis le site » sans lien incitatif d'achat. Abonné Apple qui ouvre le site : le bouton « S'abonner » est remplacé par « Abonnement géré par Apple », jamais de second paiement possible.
- Utilisateur qui achète dans l'app **sans compte** : l'achat est rattaché à un identifiant anonyme, puis l'écran de succès propose de créer un compte ou de se connecter pour le retrouver ; s'il se connecte à un compte déjà Premium Stripe, blocage doux avant le paiement et explication (pas de double facturation).
- Abonnés de lancement à 0,99 € à vie : restent sur Stripe, jamais migrés (décision du 01/10).
- Résiliation = perte d'accès aux contenus Premium (règle maison), identique sur les deux circuits. Remboursements Apple gérés par Apple ; texte CGV mobile à adapter par @legal, court (principe du 25/10 : pas de juridique excessif).

## 5. Prérequis qui ne dépendent que de Thomas

| Prérequis | Détail |
|---|---|
| **Compte Apple Developer** | 99 USD par an selon les sources tierces ; montant en euros affiché à l'inscription [À VÉRIFIER] ([Apple, D-U-N-S](https://apple.co/308Ikbq)) |
| **Individuel ou société** | **Point structurant.** En individuel, le nom affiché comme vendeur sur l'App Store est le nom légal de Thomas, ce qui contredit « aucune mention de Thomas » (founder-preferences 29/09). En société, c'est le nom de l'entité qui s'affiche. Aucun D-U-N-S requis en individuel ; **en société il faut un D-U-N-S au nom légal exact** : délai annoncé jusqu'à 5 jours ouvrés par Apple, jusqu'à 14 selon un guide tiers ; une différence de nom entre l'entité et la base D-U-N-S fait échouer l'inscription ([guide](https://magora-systems.com/duns-number-apple-developer/)). Pour les vendeurs professionnels de l'UE, Apple demande aussi d'afficher des coordonnées (adresse, téléphone, e-mail) sur la fiche [À VÉRIFIER]. |
| **Entité juridique** | Thomas doit confirmer **quelle entité** édite le site et encaisse (« deviens-marrant SAS » : immatriculation non confirmée, réserve R4 connue) |
| **Contrats, banque, fiscal dans App Store Connect** | Contrat « Apps payantes », coordonnées bancaires, formulaires fiscaux : indispensables pour que les achats intégrés soient vendables |
| **Mac** | **Non obligatoire** : build et soumission dans le cloud via EAS. Un Mac n'est utile que pour le simulateur ; les agents testent sur appareil réel via TestFlight. Coût d'EAS [À VÉRIFIER] |
| **Appareils de test** | Au moins un iPhone physique récent de Thomas pour TestFlight (notifications push et achats ne se testent pas sur simulateur) ; un second, plus ancien ou petit écran, si disponible |
| **Fiche App Store** | Nom (reco « Deviens Marrant », disponibilité à vérifier dans App Store Connect), sous-titre, description, mots-clés, captures (@design), URL de la politique de confidentialité (existante : `/confidentialite`), URL d'assistance, catégorie, questionnaire d'âge, coordonnées de revue |
| **Compte de test pour la revue** | Compte Premium offert pour Apple et pour les testeurs, créé par l'admin, exclu des statistiques (comme `EMAILS_INTERNES_EXCLUS`) |

## 6. Risques de refus App Store et parades

| Risque | Pourquoi ce produit y est exposé | Parade |
|---|---|---|
| **3.1.1 / 3.1.3 achats** | Abonnés Stripe à reconnaître dans l'app ; tentation d'un lien vers `/abonnement` | Achat intégré toujours proposé ; zéro mention de paiement web dans l'app ; blocage du double abonnement ; mention des règles de 3.1.2 (prix, durée, restauration) |
| **4.2 fonctionnalité minimale** | Un contenu éditorial ressemble vite à « un site emballé » | Pas de WebView pour le cœur ; notifications, hors ligne, widget, partage natif, progression locale ; compte de démonstration Premium avec notes de revue qui expliquent la valeur (parcours et défis) |
| **5.1.1(v) suppression de compte** | Création de compte possible dans l'app | Suppression dans l'app en 2 touches, effective côté base ; message sur l'abonnement Apple à résilier |
| **5.1.1 / 5.1.2 confidentialité** | Étiquettes de confidentialité, politique, permissions | Étiquettes minimales (e-mail, identifiant, usage), aucun pistage, texte de permission push qui dit ce que l'utilisateur reçoit |
| **4.8 connexion tierce** | Le site propose Google | Pas de connexion Google ni Apple en V1 (décision 3) |
| **1.1 contenu offensant** | Humour, chambrage, humoristes nommés et cités | Contenu déjà filtré (barre « Alexa », widget tout public) ; Apple exempte en principe les humoristes professionnels [À VÉRIFIER : texte exact] ; questionnaire d'âge rempli honnêtement (nouvelles tranches d'âge [À VÉRIFIER]) ; pas de signalement utilisateur nécessaire car aucun contenu d'utilisateur |
| **5.2 propriété intellectuelle** | Extraits de stand-up de tiers | Lecteur YouTube officiel uniquement, jamais d'extraction ni de téléchargement ; fiches pédagogiques à nous |
| **4.5.4 notifications** | Push quotidien | Opt-in en contexte, contenu éditorial sans promotion, réglage de l'heure et arrêt dans l'app |
| **Métadonnées** | Nom, captures, mention d'une autre plateforme | Aucune mention d'Android, de prix web ou de bêta ; captures de l'app réelle |

## 7. Plan par dépendances

Aucune durée en semaines. Le chemin critique est le **lot 0** (délais d'Apple, hors de portée des agents) : le lancer aujourd'hui.

| Lot | Contenu | Agents | Dépend de |
|---|---|---|---|
| **0** | Inscription Apple Developer (D-U-N-S si société), contrats et banque, App Store Connect, identifiant d'app, noms de produits d'abonnement | **Thomas** (guidé par @infrastructure) | Décisions 1, 2 |
| **1** | Specs par écran en user stories (états, critères, événements) ; parcours et maquettes ; design système de l'app (réutilise les valeurs du site), icône | @product-manager, @ux, @design | Ce cadrage validé |
| **2** | Revue minimale des documents (privacy, CGU, CGV mobile, étiquettes Apple) limitée à l'obligatoire | @legal | Lot 1 (parallèle) |
| **3** | Textes de l'app : étalons calibrés avec Thomas AVANT toute rédaction (règle P0 s8), puis écran d'offre, premier lancement, notifications, fiche App Store, notes de revue | @copywriter | Lot 1 ; étalons de Thomas |
| **4** | API mobile : jetons, `bootstrap`, suppression, carnet, origine d'abonnement, jetons de notification, tests Jest | @fullstack | Lot 1 (parallèle au 3) |
| **5** | Projet Expo neuf, navigation, authentification, Aujourd'hui, Explorer, hors ligne | @fullstack | Lot 4 (en partie), Lot 1 |
| **6** | Parcours, carnet, favoris, quiz, profil, suppression de compte | @fullstack | Lot 5 |
| **7** | Achat intégré : produits, écran d'offre, restauration, webhook et origine d'abonnement, anti double abonnement | @fullstack | Lot 0 (contrats et produits), Lot 4 |
| **8** | Push : planification par fuseau, envoi, nettoyage, réglages | @fullstack, @infrastructure | Lots 0 et 4 |
| **9** | Widget d'accueil (extension native) | @fullstack | Lot 5 |
| **10** | Infrastructure : EAS, liens universels (fichier d'association sur le site), environnement de préproduction (branche Neon), secrets | @infrastructure | Parallèle dès le lot 1 |
| **11** | Plan de marquage de l'app | @data-analyst | Lot 1 ; avant le lot 6 |
| **12** | QA sur appareil réel (TestFlight interne), achats en bac à sable, scénarios persona, 5 états, hors ligne, relecture à l'aveugle des textes | @qa, @reviewer, @ux, @design | Lots 5 à 9 |
| **13** | Soumission, réponse à la revue, mise en ligne | @infrastructure, @fullstack | Lot 12 et décision de Thomas |
| **14** | Android (même code, facturation Google par le même outil), après retour du lot 13 | @fullstack, @qa | Lot 13 |

**En parallèle** : 0, 1, 10 au départ ; 2, 3, 4, 11 une fois le lot 1 posé ; 7, 8, 9 en parallèle après 5. Contrôle de la règle du diff réel (P0 s11) sur tout rapport d'agent.

## 8. Décisions à prendre par Thomas

1. **Individuel ou société pour le compte Apple Developer ?** Reco : **société** (le nom du vendeur s'affiche publiquement, individuel y mettrait ton nom, contraire à ta règle du 29/09) ; il faut alors confirmer quelle entité édite le site et obtenir son D-U-N-S. Alternative : individuel, plus rapide, ton nom légal visible sur la fiche.
2. **Prix dans l'app** : reco **identique au site** (1,99 €/mois, 16,99 €/an), sans rien dire du prix du site. Alternative : prix plus haut dans l'app pour absorber la commission (incohérent avec la marque, risque de comparaison).
3. **Connexion dans l'app** : reco **e-mail et mot de passe seulement** en V1 (les comptes Google passent par « mot de passe oublié »). Alternative : ajouter « Se connecter avec Apple » (obligatoire dès qu'on propose Google) plus Google, au prix d'une fusion de comptes à e-mail masqué.
4. **Vendre dans l'app via l'achat intégré Apple** : reco **oui** (commission réduite de 15 % via le programme petites entreprises, sur inscription). Alternative : lien de paiement externe (UE), commission du même ordre, plus d'écrans à gérer, non retenu.
5. **Android** : reco **après l'approbation iPhone** (code partagé, aucune dette). Alternative : en parallèle dès le lot 5, au prix d'une double QA.
6. **Heure de la notification** : reco **choisie par l'utilisateur** à l'onboarding (aucune heure imposée, pas d'ancienne valeur 9 h reprise). Alternative : une heure fixe, plus simple mais ratée pour une partie des utilisateurs.
7. **Compte relecteur Premium offert** pour Apple et les testeurs : reco **oui**, exclu des statistiques. Alternative : aucune, la revue ne pourrait pas voir le Premium.
8. **Widget d'accueil dans la V1** : reco **oui** (déclencheur d'habitude, vanne du jour sans ouvrir l'app) ; si l'extension native fragilise le build, il part en V1.1 sans changer le reste. Alternative : V1.1 d'emblée.
9. **Nom sur l'App Store** : reco **« Deviens Marrant »** (cohérent avec la marque) ; sous-titre à calibrer avec @copywriter. Alternative : « Deviens Marrant : répartie et humour » pour l'ASO, à valider sur la disponibilité du nom.
10. **Abonnés Premium Stripe existants** : reco **aucune action de leur part** (ils se connectent et retrouvent Premium). Alternative : e-mail d'annonce de l'app aux abonnés, brouillon seulement, envoi par toi.

## 9. Handoff

- **Fait** : cadrage complet de l'app iPhone native (valeur, V1, technique, paiement Apple et coexistence Stripe, prérequis, risques de refus, plan par dépendances, décisions).
- **Décisions ouvertes** : les 10 ci-dessus, dont **1 (compte société ou individuel)** qui bloque le lot 0 et donc la chaîne de soumission.
- **À vérifier** : tout `[À VÉRIFIER]` (taux Apple en UE et pour la France, grille 1,99 € et 16,99 €, textes 3.1.3(b), 4.8, 4.5.4, 1.1, tarifs d'EAS, d'Expo Push et de RevenueCat, existence de `PushToken`, de `DELETE /api/user` et de `/api/carnet`). Les sources web sont en partie secondaires (blogs, presse spécialisée) : reconfirmer sur les pages développeur d'Apple avant de payer ou de soumettre.
- **Prochain agent** : @product-manager (user stories par écran, template complet, dans un fichier de specs mobiles à créer) en parallèle de @infrastructure (inscription Apple, EAS) dès réponse de Thomas aux décisions 1 et 2. La session principale ajoute l'entrée de cette session à `project-context.md`.

**Sources web consultées (04/11/2026)** : [TechCrunch, mai 2025](https://techcrunch.com/2025/05/08/apple-urges-court-to-suspend-ruling-that-bars-it-from-taking-a-cut-on-external-app-payments) · [iClarified, août 2026](https://www.iclarified.com/101778/apple-seeks-court-approval-for-15-commission-on-external-app-purchases) · [Apple Newsroom, UE, août 2026](https://apple.com/newsroom/2026/08/apple-announces-changes-for-apps-in-the-european-union) · [MacRumors, 18/08/2026](https://macrumors.com/2026/08/18/eu-app-store-fee-change) · [9to5mac, 20/08/2026](https://9to5mac.com/2026/08/20/apples-long-running-app-store-battle-with-the-eu-appears-to-finally-be-over/) · [Magora, programme petites entreprises](https://magora-systems.com/app-store-small-business-program/) · [RevenueCat, frais](https://www.revenuecat.com/blog/engineering/app-store-fees) · [Apple, D-U-N-S](https://apple.co/308Ikbq) · [Magora, D-U-N-S](https://magora-systems.com/duns-number-apple-developer/)
