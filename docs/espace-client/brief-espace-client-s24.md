# Brief s24 : espace client Premium (rubriques, parcours, XP, notes, notifications)

> Brief à lancer tel quel par la session s24 (même dépôt, même CLAUDE.md, mêmes règles de Thomas).
> Rédigé le 10/11/2026 par @product-manager, sur lecture du code et des docs listés en §2.
> Règle : tout ce qui n'est pas lu dans le code ou un document est marqué [HYPOTHÈSE : ...] ou [À VÉRIFIER au lot 0].
> Référence visuelle : `docs/espace-client/reference/reference-espace-client-parcours.png` (inspiration de STRUCTURE seulement : ne jamais nommer ce site, ne rien copier de sa marque, de ses textes ni de sa charte).

## 0. Demande de Thomas (10/11, verbatim)

« je voudrais qu'on transforme le compte parcours etc en un vrai accès client de ce type là, quelque chose de très poussé avec les sections etc en haut vocabulaire etc....... Peux-tu préparer et faire itérer un brief complet pour la prochaine session sur ce sujet, qu'elle lancera ? »

Lecture de la capture (ce qu'elle montre) : barre de rubriques en haut (guides, parcours, ateliers, grammaire, vocabulaire, expressions, exercices et jeux, favoris, mes notes, écrire au coach), cloche de notifications avec pastille, identité du membre, page d'un parcours : retour, titre, « XP total », progression globale en barre, sous-parcours par niveau (« 0/8 fiches »), liste numérotée de fiches avec « Voir » et « Fait ✓ ».

## 1. Objectif et valeur

**Pour l'abonné Premium** (Yanis, Sophie, Marc) : un endroit à lui où il voit d'un coup d'oeil où il en est, quoi faire aujourd'hui, ce qu'il a déjà fait, ce qu'il a gardé (favoris, notes), et où il peut poser sa question. Aujourd'hui « le compte » est un profil de statistiques et un abonnement : il ne donne pas envie d'y revenir.

**Pour le revenu** (KPI North Star : marge nette 3 000 €/mois ; objectif 6 mois : 1 000 € de MRR ; Premium 1,99 €/mois ou 16,99 €/an, décision du 24/10) : la valeur d'un abonnement à ce prix se joue sur la rétention. Constat de départ :
- 3 résiliations sur 4 sans aucun usage enregistré (chiffre cité par Thomas ; `docs/analytics/resiliations-s23-analyse.md` documente 3 cas, A, B, C, et note que « aucun usage » = aucune action enregistrée en base, la lecture de listes ou de vidéos ne laisse aucune trace ; le dénominateur « 4 » n'est pas extrait dans `resiliations-s23-donnees.md` [À VÉRIFIER au lot 0]).
- Cause la plus vraisemblable (H1, H2 de l'analyse, [HYPOTHÈSE]) : résiliation de précaution, sans valeur ressentie entre « Paiement reçu » et le premier contenu. Un espace client doit rendre la valeur visible dès le premier jour (premier pas proposé, progression à 0 % qui donne envie de commencer, rien de vide).
- Ce brief ne retire ni ne masque jamais la résiliation (obligations légales, choix du 07/10 et du 18/10).

**Hypothèse centrale à valider par la mesure** [HYPOTHÈSE : un abonné qui voit sa progression, son prochain pas et ses affaires gardées résilie moins dans les 7 premiers jours]. Elle n'est pas prouvée : la mesure d'usage serveur (lot 0) est donc un prérequis, pas une option.

**Ce que l'espace n'est pas** : pas un compte gratuit (P0 du 05/10 : « pas de compte gratuit », visiteur vers Premium) ; pas une refonte des pages publiques (SEO, 94 pages indexées sur 414 au 12/10) ; pas une vitrine de vente (le visiteur ne voit pas cet espace).

## 2. Inventaire de l'existant (vérifié dans le code le 10/11/2026)

Légende : LU = fichier lu pour ce brief ; NOM = existence confirmée par la liste des fichiers, contenu à relire au lot 0 [À VÉRIFIER].

### 2.1 Pages (`apps/web/src/app/(dashboard)/`)
| Zone | Fichier | État |
|---|---|---|
| Profil | `profil/page.tsx` (LU) | H1 « Mon profil », `ReprendreParcours src="profil"` en tête (rien pour un compte sans Premium), puis `ProfilDashboard`, `UpgradeToast`. `noindex`. |
| Parcours | `parcours/(liste)/page.tsx`, `parcours/[slug]/page.tsx` (LU en partie) | Page publique ISR (`revalidate = 3600`, `dynamicParams = true`). HTML partagé : étape 1 complète + aperçu des étapes 2+ ; l'abonné reçoit le contenu complet via `/api/parcours/by-slug` après hydratation. 5 parcours : Machine à Café, Répartie, Confiance, Storytelling (`STORYTELLING_PUBLIE`), Boulot (`BOULOT_PUBLIE = true` depuis le 11/10). |
| Favoris | `favoris/page.tsx` (LU) | H1 « Mes favoris », `FavorisList`, `noindex`. |
| Carnet | `carnet/page.tsx`, `carnet/[mois]/page.tsx` | NOM. Carnet mensuel Premium (fiche ~100 mots, 15 fiches le 1er mois puis 30). |
| Catalogue | `vannes/`, `conseils/`, `videos/` (listes + fiches `[slug]`, `vannes/theme/[slug]`) | NOM. Publics et indexables ; limite 10/3/3 sur la liste défilante des visiteurs seulement. |
| Glossaire | `glossaire/page.tsx` | NOM. |
| Quiz | `quiz-humour/page.tsx` | NOM (12 questions au dernier relevé de project-context, [À VÉRIFIER]). Orienté vers un parcours selon le profil. |
| Lettre | `lettre/page.tsx`, `lettre/confirmer`, `lettre/desinscrire`, `lettre/premium/arreter` | NOM. Lettre du mois (gratuite) et lettres réservées Premium (jeudi). |
| Abonnement | `abonnement/`, `abonnement/success/`, `resiliation/` (+ `confirmee`) | NOM. La page de résiliation maison est INERTE (`RESILIATION_PAGE_OUVERTE = false`, s23). |
| Autres | `blague-du-jour/`, `blog/` (menu : « Articles »), `anatomie-vanne/`, `a-propos/` | NOM. |

### 2.2 Navigation actuelle (`components/layout/`)
- `header.tsx` (LU) : onglets visiteur `Accueil, Vannes, Conseils, Vidéos, Parcours, Articles` (+ `La lettre` si inscriptions ouvertes) ; Premium : `Carnet` inséré après `Parcours`, sans `La lettre`. Bouton « Premium · 1,99 €/mois » pour visiteur et compte sans abonnement ; abonné : menu de compte seul. Barre en `sticky top-0 z-50`, hauteur 64 px (`h-16`).
- **Contrainte forte** : le budget de largeur est gardé par `playwright/tests/local/header-budget.spec.ts` (6 largeurs x 3 états, aucun débordement, recherche >= 160 px). Le commentaire du fichier dit qu'un onglet de plus doit trouver sa place dans le budget, « sinon aller dans le menu de compte ou le menu déroulant ». Dix rubriques sur une ligne ne tiennent pas dans l'en-tête actuel : voir décision Q3.
- `account-menu.tsx` (LU) : un seul bouton profil (Radix DropdownMenu) avec 3 entrées : Favoris, Mon profil, Déconnexion.
- `mobile-nav.tsx`, `footer.tsx` : NOM ; le pied affiche en permanence « Renoncer au contrat ici » et « Résilier ton contrat » (obligations, à ne jamais retirer).

### 2.3 Progression, série, XP (`lib/progression.ts` LU, schéma Prisma LU)
- Niveaux : `XP_THRESHOLDS` NOVICE 0, APPRENTI 100, FARCEUR 500, COMIQUE 1 500, LEGENDE 5 000 ; `calculateLevel`. Champs `User.xp`, `level`, `streak`, `lastPracticeAt`.
- XP d'étape : `moduleXp` du seed, 20 par défaut (`DEFAULT_STEP_XP`) ; bonus de fin de parcours 100 (`PATH_COMPLETION_BONUS_XP`) ; `getPathXpTotal` (bonus compris, ex. 325 pour Machine à Café d'après le commentaire UX-05 c).
- Série : comptée sur la PRATIQUE (étape validée, quiz d'étape terminé), jour civil de Paris ; `effectiveStreak` remet à 0 si rompue ; `recordPractice`.
- Rythme doux : `NEXT_STEP_DELAY_DAYS = 7`, étape suivante « conseillée », jamais bloquée. Avec Premium, toutes les étapes sont ouvertes d'un coup (choix du 18/10).
- Tables : `UserPathProgress` (currentStep, completedSteps[], startedAt, completedAt), `UserPathStepCompletion` (date de validation, unique par utilisateur/parcours/étape), `UserPathStepFeedback` (3 valeurs fermées `pas-essaye`, `essaye-bof`, `essaye-ca-a-marche`, avis @legal C13 : aucun champ libre), `ParcoursReminderPreference` (rappel e-mail sur demande, un par semaine, arrêté après 3 rappels sans activité), `UserFavorite`, `JokeLike`, `PremiumLetterPreference`, `AccountLetterPreference`, `PushToken` (app iPhone), `CancellationFeedback`.
- API : `/api/parcours/[id]/progress`, `/quiz`, `/retour`, `/api/parcours/by-slug/[slug]`, `/api/user/progress`, `/api/user/xp`, `/api/user/rappel-parcours`, `/api/favorites`, `/api/question-equipe`, `/api/user/subscription/*`.
- Composants : `components/parcours/` (`parcours-detail`, `parcours-step-card`, `step-quiz`, `step-blocks`, `path-completion-card`, `parcours-content`), `components/profil/` (`profil-dashboard`, `abonnement-card`, `prenom-card`, `question-equipe-card`, `question-equipe-messages`, `supprimer-compte-card`, `upgrade-toast`), `components/home/reprendre-parcours.tsx`, `components/favoris/favoris-list.tsx`, `components/carnet/*`. Contenu exact de chacun : [À VÉRIFIER au lot 0].

### 2.4 « Ta question à l'équipe »
Encadré Premium sous la carte abonnement du profil (`question-equipe-card.tsx`), `POST /api/question-equipe` (session + Premium vérifié en base, Reply-To du compte, 3/10 min et 10/jour, texte jamais en journal ni en base, questions vers alex@deviens-marrant.fr, réponse signée « L'Équipe Deviens Marrant », en général sous 1 à 2 jours ouvrés, jamais 7 jours). Interrupteur `QUESTION_EQUIPE_OUVERTE` (ouverture décidée avant le 05/11 : [À VÉRIFIER l'état en production]). Conséquence : aucune question n'est stockée, donc aucune réponse ne peut aujourd'hui s'afficher dans l'espace (voir Q6).

### 2.5 Exercices Premium (`lib/champs-premium.ts` LU)
L'exercice d'une fiche (« À toi de jouer » d'une vanne, exercice d'un conseil, points clés et exercice d'une vidéo) n'est jamais envoyé à un compte non Premium : ni dans le HTML (`lib/catalogue-pages.ts`), ni dans `/api/jokes`, `/api/tips`, `/api/videos` (`sansExerciceVanne`, `sansExerciceConseil`, `sansExerciceVideo`). Tout nouvel écran de l'espace qui liste ces champs doit passer par ces helpers côté serveur.

### 2.6 Écart avec la référence
| Élément de la capture | Chez nous aujourd'hui | Écart |
|---|---|---|
| Barre de rubriques en haut, une ligne | En-tête public à 6-7 onglets, menu de compte à 3 entrées | Pas de barre propre à l'espace ; budget de largeur saturé |
| Cloche + pastille | Rien (aucun modèle de notification ; `PushToken` sert l'app iPhone) | À créer |
| Identité du membre (nom) | `prenom-card.tsx` au profil ; pas dans l'en-tête | Petit |
| XP total + progression globale | `User.xp`, niveaux, série ; « N XP gagnés sur 700 » sur la carte d'un parcours (choix du 11/10) | Pas de total global par parcours en tête de page, pas de barre globale [À VÉRIFIER] |
| Sous-parcours par niveau (« Débutant 1, 0/8 fiches ») | Un parcours = 6 étapes (une par semaine), pas de niveaux | À NE PAS inventer : voir Q4 |
| Liste numérotée avec « Voir » et « Fait ✓ » | Cartes d'étape avec validation liée à l'exercice et au quiz | Écart de logique : voir Q5 |
| Mes notes | Rien | À créer, et risque RGPD (voir Q5b) |
| Favoris | Oui (`/favoris`) | À intégrer dans la barre |
| Écrire au coach | « Ta question à l'équipe » (encadré du profil) | À rendre accessible depuis la barre |
| Ateliers, grammaire | Aucun équivalent chez nous | Ne rien inventer ; rubrique absente |

## 3. Architecture cible (proposition, noms à caler avec Thomas, règle P0 s8)

Principe : l'espace est une zone connectée Premium, dynamique (jamais ISR), `noindex`, avec sa propre barre de rubriques. Les pages publiques (catalogue, fiches, articles, parcours ISR) ne changent pas : zéro retouche hors périmètre (P0 du 21/10).

### 3.1 Rubriques de la barre (correspondance avec nos contenus RÉELS)
Les noms sont des PROPOSITIONS de travail, à valider par étalons (Q2). Aucune rubrique sans contenu réel derrière.

| Rubrique proposée | Contenu réel | Page cible | Dans la capture |
|---|---|---|---|
| Aujourd'hui (accueil de l'espace) | contenu du jour (vanne, conseil, vidéo), « Reprendre », série, prochain pas | nouvelle | (absent, voir 3.2) |
| Parcours | les 5 parcours, progression globale | nouvelle page de synthèse + page parcours (3.3) | Parcours |
| Carnet | carnet du mois et mois passés | `/carnet` | (proche de « Guides ») |
| Vannes | catalogue illimité + exercice « À toi de jouer » | `/vannes` | (proche d'« Expressions ») |
| Conseils | catalogue illimité + exercice | `/conseils` | Guides |
| Vidéos | 89 vidéos décortiquées + points clés | `/videos` | Apprendre, lire et écouter |
| Vocabulaire | glossaire (jargon du stand-up) | `/glossaire` | Vocabulaire |
| Exercices et jeux | quiz d'humour + exercices des fiches | `/quiz-humour` + liste des exercices [HYPOTHÈSE : page d'agrégation à créer] | Exercices et jeux |
| Favoris | favoris | `/favoris` | Favoris |
| Mes notes | notes personnelles (3.5) | nouvelle | Mes notes |
| Ta question à l'équipe | encadré existant, sorti du profil | nouvelle entrée vers l'encadré | Écrire au coach |
| Lettre | lettres réservées Premium reçues, archive | `/lettre` [À VÉRIFIER ce qu'un abonné y voit] | (absent) |

Non repris faute de contenu : Ateliers, Grammaire, Expressions et proverbes. « Articles » (blog) reste dans le site public (SEO), avec un lien depuis l'espace [HYPOTHÈSE à trancher Q2].
Dix à douze rubriques sont trop pour une ligne : regroupement en 6 à 7 entrées + menu « Plus » (Q3).

### 3.2 Tableau de bord d'accueil de l'espace (« Aujourd'hui »)
Blocs, du haut vers le bas, chacun avec un état vide qui donne une action (jamais un tableau de zéros) :
1. Salutation avec prénom (repli « Salut, » si absent, règle du 07/10) et série « {n} jours de pratique d'affilée » (texte validé s17).
2. « Reprendre » : le parcours en cours (réutiliser `reprendre-parcours.tsx`) ; premier jour sans parcours commencé : un premier pas nommé, jamais « choisis un parcours » (cause H2).
3. Le contenu du jour (vanne, conseil, vidéo), réutilise `daily-content.tsx` [À VÉRIFIER réutilisable en zone connectée].
4. Progression : XP, niveau (NOVICE à LEGENDE, noms d'affichage à valider), barre vers le niveau suivant.
5. Nouveautés : carnet du mois, lettre de la semaine, date conseillée de la prochaine étape (rythme doux, jamais bloquant).
6. Raccourcis : favoris récents, dernière note.
Interdit (P0 s8) : hook de surveillance (« tu n'as pas pratiqué depuis N jours »), culpabilisation, pub déguisée. Ton : « le pote drôle et bienveillant », tutoiement, aucun émoji, zéro tiret cadratin.

### 3.3 Page parcours « progression + étapes + Voir / Fait »
Structure inspirée de la capture, avec NOS données :
- En-tête : lien retour aux parcours, titre du parcours, ligne « {n} étapes, {xp} XP gagnés », pastille « {xp} XP total » (réutilise `getPathXpTotal`, bonus de fin compris : le libellé exact du 11/10 « N XP gagnés sur 700, bonus de fin compris » est conservé).
- Carte « Progression globale » : barre `completedSteps.length / nombre d'étapes`, pourcentage.
- Liste numérotée des étapes (6 par parcours d'après les semaines du seed ; `parcoursWeeks`) : numéro, titre, format et durée, date conseillée, statut ; boutons « Voir » (ouvre l'étape) et « Fait » (selon Q5).
- « Sous-parcours par niveau » : NON repris tel quel. Nos parcours n'ont pas de niveaux (une étape par semaine). Options à Q4.
- Pour l'abonné, toutes les étapes sont ouvertes (choix du 18/10). Le visiteur garde la page publique ISR inchangée.

### 3.4 XP et progression (réutiliser l'existant)
Aucune nouvelle règle d'XP, de niveau ni de série sans accord de Thomas. L'espace AFFICHE `User.xp`, `level`, `streak` et les complétions déjà calculés par `lib/progression.ts` et les routes existantes. Une vue « Ma progression » regroupe : XP, niveau, série, étapes faites par parcours, bilans de fin (sans certificat, choix du 07/10).

### 3.5 Notes personnelles
Modèle de travail [HYPOTHÈSE] : une note rattachée à une fiche ou un parcours (vanne, conseil, vidéo, étape) ou libre. Table neuve `UserNote` (migration additive, comme les migrations 16 et 17). Point de vigilance : `UserPathStepFeedback` a été limité à 3 valeurs fermées sur avis @legal C13 (aucun champ libre) ; une note libre est une donnée personnelle de texte libre. Décision Q5b ; si Thomas retient le texte libre, avis @legal court et ciblé seulement sur ce point (règle du 19/10 : pas de juridique inutile), suppression avec le compte, export éventuel, jamais dans Umami ni dans les journaux.

### 3.6 Notifications (cloche)
Centre de notifications DANS le site, sans nouvel e-mail ni push (règle du 06/10 : au plus un e-mail par jour, et le 06/11 : peu d'e-mails ; les lettres existent déjà). Sources candidates, toutes déjà existantes dans le produit : nouvelle lettre réservée du jeudi, nouvelle fiche ou nouveau mois du carnet, étape conseillée disponible, nouveau parcours publié, réponse de l'équipe (si Q6 le permet). Pastille = nombre non lu. Tout ce qui ressemble à de la pression est exclu. Stockage : table `Notification` + lu/non lu [HYPOTHÈSE].

### 3.7 Favoris et « écrire à l'équipe »
Favoris : l'existant (`favoris-list.tsx`) est repris tel quel dans le cadre de l'espace. « Écrire à l'équipe » : l'encadré existant, accessible depuis la barre sans changer ses règles (délai 1 à 2 jours ouvrés, signature « L'Équipe Deviens Marrant », aucune mention d'IA).

### 3.8 Gratuit et Premium
- Visiteur (pas de compte gratuit, P0 05/10) : voit uniquement le site public inchangé : étape 1 de chaque parcours, aperçu des suivantes, listes limitées 10/3/3, fiches lisibles pour le SEO. Il ne voit pas l'espace ; une page de l'espace ouverte sans session redirige vers la connexion avec retour (`buildLoginUrl`).
- Premium : tout l'espace (barre, tableau de bord, progression, parcours complets, exercices, carnet, favoris, notes, notifications, question à l'équipe, lettres réservées).
- Les 12 comptes FREE historiques (conservés, aucune suppression sans GO) : que voient-ils ? Q7.
- Exercices et champs réservés : tout écran qui les expose passe par `sansExercice*` quand le plan n'est pas PREMIUM ; plan relu EN BASE côté serveur (jamais depuis le seul jeton de session).

## 4. Questions et étalons à trancher AVEC Thomas avant tout développement (règle P0 s8)

Méthode : présenter 3 options par question avec une reco, en une phrase sans jargon (founder-preferences 07/10) ; 3 à 5 étalons visuels ou textuels calibrés avec lui AVANT tout brief @copywriter. Un « go » global ne lève aucun [CHOIX UTILISATEUR] déjà écrit (règle du 03/10). Les questions Q1 à Q3 se posent en premier : elles conditionnent le reste.

| # | Question | Option A | Option B | Option C | Reco |
|---|---|---|---|---|---|
| Q1 | Où vit l'espace ? | Nouvelle zone `/mon-espace/...` avec sa barre, `/profil` y est intégré (redirection 308) | Garder `/profil` comme page d'entrée et ajouter les rubriques autour | Refondre `/profil` en place | A : la barre propre ne se mélange pas au site public ; ancien `/profil` redirigé, rien de public ne bouge |
| Q2 | Nom de l'espace et des rubriques | « Mon espace » + rubriques du §3.1 | « Mon carnet de bord » (ton maison) + mêmes rubriques | « Mon compte » + rubriques courtes | A, avec libellés calés sur 3 étalons de barre rendue |
| Q3 | Barre de rubriques et budget de l'en-tête | Sous-barre dédiée sous l'en-tête (sous le `h-16`), défilement horizontal sur mobile, en-tête public inchangé | Remplacer les onglets publics par la barre de l'espace quand l'abonné est dans l'espace | Menu latéral (colonne) sur ordinateur, barre basse sur mobile | A : respecte `header-budget.spec.ts`, le public ne change pas ; mobile : barre qui défile avec fondu de bord |
| Q4 | « Sous-parcours par niveau » : nous n'avons que des étapes de semaine | Pas de sous-parcours : une page = un parcours, 6 étapes (réalité) | Regrouper les étapes en blocs nommés (ex. 3 + 3) sans changer le contenu | Créer des niveaux Débutant/Intermédiaire sur un parcours | A, pas d'invention de structure ; B seulement si Thomas veut le rendu de la capture |
| Q5 | « Fait ✓ » : sens du bouton | « Fait » = la validation actuelle (exercice ou quiz fait, XP, série) | « Fait » manuel en un clic, sans preuve, XP réduit ou nul | « Voir » seul + « Fait » apparaît après lecture de l'étape | A : XP et série restent honnêtes (série comptée sur la PRATIQUE, choix 07/10) ; ajouter un « Voir » direct |
| Q5b | Notes : forme | Texte libre court (limite de longueur), privé | Notes cadrées (une phrase par fiche : « ma réplique à moi ») | Pas de notes en V1 | B : cohérent avec l'avis C13 et l'exercice « Écris-le ici si ça t'aide » de l'app ; A si Thomas veut la liberté, avec un avis @legal minimal |
| Q6 | Notifications et réponses de l'équipe | Notifications de contenu seulement (lettre, carnet, étape) | A + réponse de l'équipe affichée dans l'espace (stocker questions et réponses, durée de conservation déjà fixée à 6 mois pour les e-mails) | Pas de cloche en V1 | A en V1 ; B change la décision du 25/10 (« rien en base »), à ne faire que sur son accord écrit |
| Q7 | Les 12 comptes FREE | Voient l'espace verrouillé avec l'offre (aperçu, bouton S'abonner) | Redirigés vers `/abonnement` comme un visiteur | Accès partiel (progression seulement) | B : « pas de compte gratuit » (05/10) ; aucune suppression |
| Q8 | Page d'arrivée après connexion et après paiement | `Aujourd'hui` de l'espace (et page de succès avec premier pas, R1 de l'analyse) | `/parcours` comme aujourd'hui (`config/premium.ts`) | Retour à la page d'origine (`returnTo`) | A pour la connexion d'un abonné ; `returnTo` conservé après paiement si l'acheteur venait d'un contenu précis |
| Q9 | Noms d'affichage des niveaux (NOVICE à LEGENDE) et XP | Reprendre les noms internes en français courant | Noms inventés plus drôles, à valider par étalons | Masquer le niveau, ne garder que l'XP | A ou B selon étalons ; aucun seuil modifié |

Étalons visuels à obtenir de Thomas (3 à 5) : rendu de la barre (3 variantes), tableau de bord (2 variantes), carte de progression, ligne d'étape « Voir / Fait », cloche ouverte. Étalons de texte : titres et libellés des 12 rubriques, états vides, message de série, 3 notifications types (voir règle : ton de marque, zéro tiret cadratin, aucun émoji, « tu »).

## 5. Plan de livraison par lots (dépendances, pas de sprints ; V1 complète, commandement 5)

Calibrage vélocité IA : lots parallélisés dès que leurs dépendances sont levées ; aucune fonctionnalité coupée « par manque de temps » (seulement par valeur persona, décidée avec Thomas). Tout est construit INERTE derrière `ESPACE_CLIENT_PUBLIE = false` (même patron que `BOULOT_PUBLIE`, `QUESTION_EQUIPE_OUVERTE`, `RESILIATION_PAGE_OUVERTE`) : fermé = le profil et les pages actuels sont strictement inchangés.

| Lot | Contenu | Dépend de | Agents | Livrable |
|---|---|---|---|---|
| 0 | Relecture du code restant (§2 [À VÉRIFIER]) ; mesure d'usage en base (les 6 événements de `resiliations-s23-analyse.md` §4 : souscription, premier accès Premium, e-mail de bienvenue envoyé/échoué, clic sur résilier, résiliation programmée, délais) ; discovery-map et assumption-map courtes ; stories du template (`functional-specs`) ; questions Q1 à Q9 posées à Thomas | rien | @product-manager, @fullstack (mesure), @data-analyst (plan de tags), @ux | `docs/product/espace-client-specs-s24.md`, étalons dans `docs/copy/etalons-espace-client-s24.md`, mesure en base inerte |
| 1 | Coque : route, garde Premium (plan relu en base), barre de rubriques, identité, tableau de bord « Aujourd'hui », redirection de `/profil`, état par défaut des 5 états UI | Lot 0, Q1, Q2, Q3, Q8, Q9 | @ux, @design, @copywriter, @fullstack | Pages en local, interrupteur fermé |
| 2 | Synthèse des parcours + page parcours (XP, progression globale, liste d'étapes Voir / Fait) | Lot 1, Q4, Q5 | @ux, @design, @fullstack | Captures PC et mobile |
| 3 | Rubriques de contenu dans le cadre de l'espace : carnet, vannes, conseils, vidéos, vocabulaire, exercices et jeux, favoris ; agrégation des exercices | Lot 1 (parallèle au lot 2) | @fullstack, @ux, @design | Pages publiques inchangées, vérifié |
| 4 | Notes personnelles (table `UserNote`, migration additive, API, écran) | Lot 1, Q5b | @fullstack, @legal (seulement si texte libre), @qa | Migration jouée 2 fois sur base jetable |
| 5 | Notifications : modèle, génération depuis les événements existants, cloche, non lu | Lot 1, Q6 | @fullstack, @copywriter, @ux | Aucun e-mail nouveau |
| 6 | « Ta question à l'équipe » et lettres réservées accessibles depuis l'espace | Lot 1 (+ Q6 si réponses affichées) | @fullstack, @copywriter | Encadré réutilisé, règles du 25/10 intactes |
| 7 | Intégration, QA complète, captures avant/après, performance, relecture @design et @ux itérée jusqu'à 10/10, pré-déploiement masqué | Lots 1 à 6 | @qa, @design, @ux, @reviewer, @seo, @infrastructure | Rapport QA, avant/après, `REPLIT_ACTIONS.md` à jour |
| 8 | Activation (`ESPACE_CLIENT_PUBLIE = true`) et mesure | Go écrit de Thomas | @infrastructure, @data-analyst | Bilan de mesure |

Rappels de méthode : projet copy = 3 à 5 étalons avec Thomas avant tout brief @copywriter (P0 s8, charte `docs/copy/charte-refonte-copy-s11.md`) ; rendu relu à l'aveugle par @design et @ux jusqu'à 10/10 AVANT mise en ligne (règle du 07/10) ; aucun rapport d'agent validé sans mesure du diff réel (P0 s11) ; Thomas veut les recommandations sans jargon (problème, effet pour l'utilisateur, ce qu'on fait).

### 5.1 Critères d'acceptation binaires (extraits ; les stories complètes sont écrites au lot 0)
1. Interrupteur fermé : `/profil`, `/parcours`, `/favoris`, l'en-tête et le pied de page sont identiques à la production (diff de HTML et captures 375 et 1280 px).
2. Interrupteur ouvert, session absente : toute page de l'espace répond par une redirection vers la connexion avec retour ; aucune donnée personnelle dans le HTML.
3. Compte non Premium (plan lu en base) : aucun champ `howToApply`, `exercise`, `learnings` ni contenu d'étape 2+ dans le HTML ni dans une réponse d'API (test automatisé sur chaque nouvelle route).
4. Abonné : barre visible sur 6 largeurs (320, 375, 768, 1024, 1280, 1536), aucun libellé coupé, aucun débordement horizontal, cibles tactiles >= 44 px.
5. Le total d'XP, le niveau et la série affichés sont égaux aux valeurs de `User` et de `lib/progression.ts` (test sur 5 profils d'exemple, dont un à 0 XP).
6. Barre de progression d'un parcours = étapes validées / étapes du parcours ; 0 % affiché proprement, sans barre cassée, pour un nouveau compte.
7. Valider une étape deux fois (double clic) ne double ni l'XP ni la série (unicité existante conservée).
8. Chaque écran a ses 5 états (défaut, chargement, vide avec action, erreur avec récupération, succès) ; aucun écran vide sans bouton.
9. Notes : une note créée est visible seulement par son auteur ; supprimée avec le compte ; limite de longueur testée ; aucune note dans Umami ni dans les journaux.
10. Notifications : aucun e-mail ni push ajouté ; compteur non lu exact ; marquer comme lu persiste après rechargement.
11. Les pages publiques indexées (`/vannes`, `/conseils`, `/videos`, `/parcours/[slug]`, articles) : HTML, canonical, sitemap et `robots.txt` identiques avant et après ; les pages de l'espace sont `noindex` et absentes du sitemap.
12. Aucun tiret cadratin, aucun émoji, aucun nom de concurrent ni de la référence dans le texte client ; contrôle automatique sur les fichiers de textes.
13. Libellés de résiliation et de rétractation du pied de page et du profil inchangés et toujours accessibles en 1 clic depuis l'espace.
14. `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build` verts ; si des tests changent : `npx tsc --noEmit` (config complète), Jest sans secrets Stripe, CI GitHub verte sur le dernier commit.

### 5.2 Mesures de succès (lisibles sur nos effectifs réels)
Nos effectifs sont très petits (683 visiteurs sur 28 jours à l'audit du 13/10 ; peu d'abonnés ; aucune A/B possible). Donc : comptes bruts « x sur n abonnés », jamais un pourcentage isolé, lecture cas par cas tant que n est petit (comme l'analyse A, B, C), comparaison avant/après sur des fenêtres égales, mesure serveur en base (Umami ne voit pas les acheteurs, `resiliations-s23-analyse.md` §5).
- Nouveaux abonnés avec au moins un accès Premium enregistré dans les 10 min, à 24 h et à 7 jours.
- Nouveaux abonnés avec au moins une étape validée à 7 jours ; série >= 2 jours à 7 jours.
- Résiliations programmées dans les 24 h et dans les 7 jours, sur le nombre de nouveaux abonnements de la période (dénominateur à extraire au lot 0).
- Usage de l'espace : ouvertures de « Aujourd'hui », de la cloche, de notes créées, de questions posées (compte seulement).
- Seuils cibles : [HYPOTHÈSE : à fixer après la première semaine de mesure, aucune référence chiffrée n'existe pour ce site].
- Contre-mesures : conversion visiteur vers paiement (non dégradée), temps de réponse des pages (§5.3).

### 5.3 Risques et parades
| Risque | Parade |
|---|---|
| SEO : une page publique change par effet de bord (composant partagé) | Pages de l'espace dans un groupe de routes séparé ; diff de HTML des pages publiques avant/après (critère 11) ; @seo valide ; ne jamais modifier une URL qui se positionne |
| ISR : une page ISR devient dynamique ou, pire, un contenu personnel est mis en cache et servi à un autre | Zéro donnée personnelle dans une page ISR ; l'espace en rendu dynamique `no-store` ; cache Cloudflare (`enableCacheInterception`) vérifié sur les routes de l'espace |
| Fuite de champs Premium (exercices, étapes 2+) vers un non-abonné | Helpers `sansExercice*` côté serveur, plan relu en base, test automatisé par route (critère 3) |
| Mobile : barre de 10+ rubriques illisible, budget de l'en-tête | Sous-barre à défilement avec fondu, regroupement + « Plus », garde-fou `header-budget.spec.ts` étendu, captures 320 et 375 px |
| Performances (Workers, requêtes Prisma multiples sur le tableau de bord) | Une requête agrégée par bloc, pas de N+1 ; temps serveur médian de référence 0,26 s (13/10) à ne pas dégrader [À VÉRIFIER au lot 7] |
| Notes libres : donnée personnelle de texte libre | Q5b ; avis @legal minimal seulement si retenu ; suppression avec le compte |
| Notifications perçues comme de la pression | Contenu seulement, jamais de relance d'inactivité (P0 s8) |
| Doublons avec le profil actuel (abonnement, résiliation, prénom, rappel, suppression de compte) | Ces cartes migrent dans une rubrique « Mon compte » de l'espace sans changer leurs textes validés ; résiliation toujours à 1 clic |
| Dérive de scope et refonte non demandée (incident du 21/10) | Le périmètre est la zone espace ; hors périmètre : retouche minimale ; toute proposition de refonte d'une page publique = une phrase et accord de Thomas |

### 5.4 Contraintes non négociables (règles de Thomas)
- Retouche minimale hors périmètre : on ne touche pas aux pages publiques ; refonte seulement dans la zone espace demandée (P0 du 21/10).
- Avant/après en images, PC (1280 px) et mobile (375 px), montrés à Thomas pour chaque écran modifié ou créé ; pour l'espace neuf, captures « fermé = identique » et « ouvert ».
- Aucun déploiement sans go écrit de Thomas ; construire inerte, documenter dans `REPLIT_ACTIONS.md` (entrée « À DÉPLOYER ») ; hébergement actuel Cloudflare Workers/OpenNext ; procédure P0 à P8 et commandes de déploiement lancées avec `env -i` (consigne de Thomas ; forme exacte à relire dans `REPLIT_ACTIONS.md` [À VÉRIFIER]) ; migrations additives rejouées 2 fois sur base jetable AVANT le déploiement.
- Un « go » global ne lève jamais un [CHOIX UTILISATEUR] déjà écrit ; `[CHOIX UTILISATEUR]` non re-questionnables par aucun agent (@reviewer compris).
- Zéro tiret cadratin dans le client-facing, aucun émoji, zéro concurrent nommé (la référence non plus), aucune mention d'IA, aucune photo ni nom de fondateur sur le site, « 1 500+ » intouché, prix 1,99 €/mois et 16,99 €/an intacts, tous les prix TTC.
- Règle d'or : jamais de contenu sous la barre en ligne ; tout texte neuf passe la relecture à l'aveugle (2 sur 3) ; écrits publics : `docs/copy/ton-alex.md`.
- Thomas veut le moins d'e-mails possible : aucun nouvel e-mail automatique dans ce chantier.
- Moins de juridique : @legal seulement si strictement nécessaire (notes libres) et jamais au prix d'alourdir un texte.
- Pre-commit : commandes du §5.1 critère 14 ; Jest 100 % ; clôture = CI verte.
- Contenu d'étapes, vannes, conseils, vidéos : jamais modifiés dans ce chantier.

### 5.5 Agents à mobiliser, par étape
@product-manager (cadrage, stories, questions) ; @ux (parcours, états, scénarios persona : Yanis, Sophie, Marc nommés) ; @design (barre, tableau de bord, carte de progression, relecture à l'aveugle jusqu'à 10/10, contraste mesuré) ; @copywriter (libellés, états vides, notifications, après étalons validés) ; @fullstack (code, tests, interrupteur) ; @data-analyst (plan de tags, mesure en base) ; @seo (non-régression des pages publiques, noindex) ; @qa (critères §5.1, E2E, captures) ; @legal (notes libres, seulement si besoin) ; @reviewer (revue croisée) ; @infrastructure (migrations, déploiement masqué puis activation sur go). Aucun agent custom n'est recommandé à ce stade (pas de besoin non couvert par les 19 agents).

## 6. Texte exact du message de lancement (à coller dans la session s24)

```
Session s24 : espace client Premium. Lis d'abord docs/espace-client/brief-espace-client-s24.md en entier (c'est le brief, il fait foi), puis project-context.md, docs/founder-preferences.md (lignes [CHOIX UTILISATEUR] non re-questionnables) et docs/marrant/playbook.md. Commence par le lot 0 : relis le code marqué [À VÉRIFIER], pose-moi les questions Q1 à Q9 avec 3 options et une reco chacune (sans jargon), et ne développe rien avant mes réponses. Tout est construit inerte, aucun déploiement sans mon go écrit, avant/après en images PC et mobile, retouche minimale hors du périmètre de l'espace.
```

---
**Handoff : @orchestrator (session s24)**
- Fichier produit : `/home/user/Marrant/docs/espace-client/brief-espace-client-s24.md`
- Décisions prises : zone séparée noindex derrière interrupteur inerte, réutilisation de `lib/progression.ts` sans nouvelle règle d'XP, pas de « sous-parcours par niveau » inventé, pas de nouvel e-mail
- Points d'attention : Q1 à Q9 à poser à Thomas avant tout code ; mesure d'usage en base (lot 0) prérequis ; notes libres et réponses de l'équipe stockées contredisent deux décisions existantes (C13, « rien en base ») : accord écrit requis ; contenu de `profil-dashboard`, `parcours-detail`, quiz, glossaire non relu à ce stade.

