# Brief s24 : espace client Premium (rubriques, parcours, XP, notes, notifications), v2.1

> Brief à lancer tel quel par la session s24 (même dépôt, même CLAUDE.md, mêmes règles de Thomas).
> v1 rédigée le 10/11/2026 par @product-manager. v2 du 10/11/2026 : intègre les 4 revues v1 (`docs/espace-client/revues/ux-v1.md`, `design-v1.md`, `growth-v1.md`, `reviewer-v1.md`). Journal v1 vers v2 en fin de fichier.
> Règle : tout ce qui n'est pas lu dans le code ou un document est marqué [HYPOTHÈSE : ...] ou [À VÉRIFIER au lot 0].
> Référence visuelle : `docs/espace-client/reference/reference-espace-client-parcours.png` (inspiration de STRUCTURE seulement : ne jamais nommer ce site, ne rien copier de sa marque, de ses textes ni de sa charte ; son rendu clair, ses emojis et ses boutons bleus ne sont PAS repris, voir D1 en §5.4).

## Résumé pour Thomas (10 lignes)

1. L'espace : une zone réservée aux abonnés Premium, avec une barre de rubriques sous l'en-tête (son contenu exact dépend de ta réponse à Q11), un écran « Aujourd'hui » qui propose UN premier pas, la progression, des notes et une cloche. Même thème sombre que le site, mêmes pages publiques.
2. Ce qu'on ne fait pas : pas de compte gratuit, pas de nouvel e-mail, pas de nouvelle règle d'XP, pas de niveaux inventés, rien de retiré à la résiliation (toujours à 1 clic).
3. Aucune promesse sur le revenu : l'espace protège les abonnés qu'on a, il n'en amène pas. Sa raison d'être est la valeur pour Yanis, Sophie et Marc.
4. Je te poserai chaque question avec 3 options et une reco sans jargon. D'abord la structure : Q1 (adresse de l'espace), Q3 (la barre), Q11 (en-tête et barre sur les pages publiques). Ensuite 3 rendus de barre pour Q2 (noms). Puis Q4 à Q10 et Q12.
5. Rouvrent une décision déjà prise, donc ton accord écrit est requis : Q6 option B (garder les questions à l'équipe pour afficher les réponses) rouvre la décision du 25/10 ; Q5b option A (notes en texte libre) rouvre la décision du 07/10 (aucun texte libre stocké). Ton accord écrit est aussi requis pour Q11 option A (la barre de l'espace sur les pages publiques, pour l'abonné seulement) et pour la phrase ajoutée sur /abonnement pour les anciens abonnés.
6. À annoncer, pas à trancher : les comptes sans abonnement sont traités comme un visiteur (décision du 05/10, Q7).
7. Ordre : lot 0 (relecture, questions, mesure d'usage construite) ; ta mesure déployée seule sur ton go, active au moins 14 jours avant l'espace ; retouches de la page de succès si pas déjà faites ; jalon 1 (« Aujourd'hui », progression, parcours) ; jalon 2 (rubriques, notes, cloche, question à l'équipe, un par un).
8. Chaque jalon passe un contrôle qualité complet, des captures sombres (320, 375, 768, 1280 px) et ton go écrit avant toute mise en ligne.
9. Construit inerte derrière un interrupteur fermé : tant qu'il est fermé, le site est strictement identique à aujourd'hui.
10. Ce que je te demanderai en plus : 3 à 5 étalons de rendu (sombre, vrais éléments du site) avant tout développement de l'écran.

## 0. Demande de Thomas (10/11, verbatim)

« je voudrais qu'on transforme le compte parcours etc en un vrai accès client de ce type là, quelque chose de très poussé avec les sections etc en haut vocabulaire etc....... Peux-tu préparer et faire itérer un brief complet pour la prochaine session sur ce sujet, qu'elle lancera ? »

Lecture de la capture (ce qu'elle montre) : barre de rubriques en haut (guides, parcours, ateliers, grammaire, vocabulaire, expressions, exercices et jeux, favoris, mes notes, écrire au coach), cloche de notifications avec pastille, identité du membre, page d'un parcours : retour, titre, « XP total », progression globale en barre, sous-parcours par niveau (« 0/8 fiches »), liste numérotée de fiches avec « Voir » et « Fait ✓ ».

## 1. Objectif et valeur

**Pour l'abonné Premium** (Yanis, Sophie, Marc) : un endroit à lui où il voit d'un coup d'oeil où il en est, quoi faire aujourd'hui, ce qu'il a déjà fait, ce qu'il a gardé (favoris, notes), et où il peut poser sa question. Aujourd'hui « le compte » est un profil de statistiques et un abonnement : il ne donne pas envie d'y revenir.

**Pour le revenu** (KPI North Star : marge nette 3 000 €/mois ; objectif 6 mois : 1 000 € de MRR ; Premium 1,99 €/mois ou 16,99 €/an, décision du 24/10) : la valeur d'un abonnement à ce prix se joue sur la rétention. Constat de départ :
- Constat de Thomas : la majorité des résiliations n'a aucun usage enregistré. `docs/analytics/resiliations-s23-analyse.md` documente 3 cas (A, B, C) et note que « aucun usage » = aucune action enregistrée en base (lire des listes ou des vidéos ne laisse aucune trace). Le dénominateur de ce constat n'est pas extrait dans `resiliations-s23-donnees.md` (indice : l. 29, « 4 abonnés actifs ») [À VÉRIFIER au lot 0] : aucun rapport ne cite « 3 sur 4 » tant qu'il n'est pas extrait.
- Cause la plus vraisemblable (H1, H2 de l'analyse, [HYPOTHÈSE]) : résiliation de précaution, sans valeur ressentie entre « Paiement reçu » et le premier contenu. Un espace client doit rendre la valeur visible dès le premier jour (premier pas proposé, progression à 0 % qui donne envie de commencer, rien de vide).
- Ce brief ne retire ni ne masque jamais la résiliation (obligations légales, choix du 07/10 et du 18/10).

**Hypothèse centrale à valider par la mesure** [HYPOTHÈSE : un abonné qui voit sa progression, son prochain pas et ses affaires gardées résilie moins dans les 7 premiers jours]. Elle n'est pas prouvée : la mesure d'usage serveur (lot 0) est donc un prérequis, pas une option.

**Fenêtre d'action de l'espace (correction growth).** Dans les 3 cas connus, 2 résiliations sur 3 arrivent en moins de 10 minutes (A : 4 min, C : 10 min) et la troisième environ 24 h après l'achat (B). L'espace, qu'on ouvre après un clic, ne peut pas agir sur ces 10 premières minutes : elles relèvent de la page de succès, de l'e-mail E0 et du premier écran vu (R1, R2, R4 de `resiliations-s23-analyse.md`, état à vérifier au lot 0). L'espace agit sur trois moments : le premier retour (J1 à J7), l'habitude (semaines 2 à 4) et le premier renouvellement (environ J25 à J30). Le brief traite ces trois moments. La page d'arrivée après paiement (Q8) fait partie du lot 1 : son premier écran est « Aujourd'hui » avec le premier pas visible, et la page de succès garde le lien « Renoncer au contrat ici » (D.221-5).

**Économie de l'abonnement (repère growth).** Premium coûte 1,99 € TTC par mois : 1 000 € de MRR demandent environ 503 abonnés mensuels, nous en avions 4 au 02/11. L'espace protège le stock d'abonnés, il n'en crée pas ; le goulot du MRR est l'acquisition, traitée dans `docs/growth/`. Le brief ne promet aucun effet chiffré sur le MRR. Sensibilité de la valeur d'un abonné (LTV = 1,99 / churn mensuel) [HYPOTHÈSE, aucun churn mesuré] : churn 75 % = 2,65 € ; 50 % = 3,98 € ; 25 % = 7,96 € ; 10 % = 19,90 €. Chaque point de rétention gagné pèse donc bien plus que 1,99 € de prix.

**Ce que l'espace n'est pas** : pas un compte gratuit (P0 du 05/10 : « pas de compte gratuit », visiteur vers Premium) ; pas une refonte des pages publiques (SEO, 94 pages indexées sur 414 au 12/10) ; pas une vitrine de vente (le visiteur ne voit pas cet espace) ; hors périmètre explicite : l'app iPhone (`apps/mobile`), dont le build `BUILD_TARGET=mobile` doit rester vert.

## 2. Inventaire de l'existant (vérifié dans le code le 10/11/2026)

Légende : LU = fichier lu pour ce brief ; NOM = existence confirmée par la liste des fichiers, contenu à relire au lot 0 [À VÉRIFIER].

### 2.1 Pages (`apps/web/src/app/(dashboard)/`)
| Zone | Fichier | État |
|---|---|---|
| Profil | `profil/page.tsx` (LU) | H1 « Mon profil », `ReprendreParcours src="profil"` en tête (rien pour un compte sans Premium), puis `ProfilDashboard`, `UpgradeToast`. `noindex`. |
| Parcours | `parcours/(liste)/page.tsx`, `parcours/[slug]/page.tsx` (LU en partie) | Page publique ISR (`revalidate = 3600`, `dynamicParams = true`). HTML partagé : étape 1 complète + aperçu des étapes 2+ ; l'abonné reçoit le contenu complet via `/api/parcours/by-slug` après hydratation. 5 parcours : Machine à Café, Répartie, Confiance, Storytelling (`STORYTELLING_PUBLIE`), Boulot (`BOULOT_PUBLIE = true` depuis le 11/10). |
| Favoris | `favoris/page.tsx` (LU) | H1 « Mes favoris », `FavorisList`, `noindex`. |
| Carnet | `carnet/page.tsx`, `carnet/[mois]/page.tsx` | NOM. Carnet mensuel Premium (fiche ~100 mots, 15 fiches le 1er mois puis 30). [À VÉRIFIER : `/carnet` est partiellement visible des visiteurs (extrait, [CHOIX UTILISATEUR] du 05/10).] |
| Catalogue | `vannes/`, `conseils/`, `videos/` (listes + fiches `[slug]`, `vannes/theme/[slug]`) | NOM. Publics et indexables ; limite 10/3/3 sur la liste défilante des visiteurs seulement. |
| Glossaire | `glossaire/page.tsx` | NOM. |
| Quiz | `quiz-humour/page.tsx` | NOM (12 questions au dernier relevé de project-context, [À VÉRIFIER]). Orienté vers un parcours selon le profil. |
| Lettre | `lettre/page.tsx`, `lettre/confirmer`, `lettre/desinscrire`, `lettre/premium/arreter` | NOM. Lettre du mois (gratuite) et lettres réservées Premium (jeudi). |
| Abonnement | `abonnement/`, `abonnement/success/`, `resiliation/` (+ `confirmee`) | NOM. La page de résiliation maison est INERTE (`RESILIATION_PAGE_OUVERTE = false`, s23). |
| Autres | `blague-du-jour/`, `blog/` (menu : « Articles »), `anatomie-vanne/`, `a-propos/` | NOM. |

### 2.2 Navigation actuelle (`components/layout/`)
- `header.tsx` (LU) : onglets visiteur `Accueil, Vannes, Conseils, Vidéos, Parcours, Articles` (+ `La lettre` si inscriptions ouvertes) ; Premium : `Carnet` inséré après `Parcours`, sans `La lettre`. Bouton « Premium · 1,99 €/mois » pour visiteur et compte sans abonnement ; abonné : menu de compte seul. Barre en `sticky top-0 z-50`, hauteur 64 px (`h-16`). `isPremium` vient de `useSession` (côté navigateur) : le HTML serveur, celui des robots, est celui du visiteur (l. 83-84).
- **Contrainte forte** : le budget de largeur est gardé par `playwright/tests/local/header-budget.spec.ts` (6 largeurs x 3 états, aucun débordement, recherche >= 160 px). Le commentaire de `header.tsx` (l. 47-50) dit qu'un onglet de plus doit trouver sa place dans le budget, « sinon aller dans le menu de compte ou le menu déroulant ». Le test fige aussi exactement 7 onglets (`toHaveCount(7)`) et les 3 entrées du menu de compte dans cet ordre (« Favoris », « Mon profil », « Déconnexion ») : ajouter « Mon espace » ou renommer « Mon profil » casse ce test ; le mettre à jour dans le même commit, une fois le libellé validé par étalon (Q2). Dix rubriques sur une ligne ne tiennent pas dans l'en-tête actuel : voir décisions Q3 et Q11.
- `account-menu.tsx` (LU) : un seul bouton profil (Radix DropdownMenu) avec 3 entrées : Favoris, Mon profil, Déconnexion.
- Le mot « profil » figure dans au moins 15 textes client validés ou approuvés : réassurance unique « Résiliable depuis ton profil. » (`config/textes/offre.ts:60`, choix du 18/10) ; texte Stripe et e-mail de confirmation (`paiement.ts:121` et `:296`, choix du 07/10) ; bienvenue E0 (`paiement.ts:364-365`, approuvé le 07/11) ; lettre de la semaine (`lettre-hebdo-s21.ts:44,90,91,93,106,177`) ; rappel de parcours (`parcours-emails.ts:87,89`) ; question à l'équipe (`question-equipe-s22.ts:88`) ; réactivation (`offre.ts:129`) ; CGU et confidentialité (`confidentialite/page.tsx:153,156,194`). Retirer le libellé « Mon profil » rend ces textes faux, et les modifier rouvre ces validations : accord écrit de Thomas requis, et les e-mails approuvés doivent être réapprouvés. Contrainte : une entrée visible « Mon profil » reste dans le menu de compte et mène aux réglages du compte, quel que soit le nom retenu à Q2.
- Liens vers `/profil` en dur : au moins `account-menu.tsx`, `mobile-nav.tsx`, `buildLoginUrl({callbackUrl:"/profil"})` dans `profil-dashboard.tsx`, `PREMIUM_DEFAULT_RETURN="/parcours"` ; e-mails (E0, E1, E1b, E2), retours Stripe et pied de page pointent vers `/profil`, `/profil#abonnement`, `/profil#rappel-parcours` : liste complète à établir au lot 0.
- `mobile-nav.tsx`, `footer.tsx` : NOM ; le pied affiche en permanence « Renoncer au contrat ici » et « Résilier ton contrat » (obligations, à ne jamais retirer). Le menu mobile calcule `max-h-[calc(100dvh-4rem-1px)]` : à suivre si une sous-barre s'ajoute.

### 2.3 Progression, série, XP (`lib/progression.ts` LU, schéma Prisma LU)
- Niveaux : `XP_THRESHOLDS` NOVICE 0, APPRENTI 100, FARCEUR 500, COMIQUE 1 500, LEGENDE 5 000 ; `calculateLevel`. Champs `User.xp`, `level`, `streak`, `lastPracticeAt`.
- XP d'étape : `moduleXp` du seed, 20 par défaut (`DEFAULT_STEP_XP`) ; bonus de fin de parcours 100 (`PATH_COMPLETION_BONUS_XP`) ; `getPathXpTotal` (`lib/progression.ts`, bonus compris, ex. 325 pour Machine à Café d'après le commentaire UX-05 c) et `totalParcoursXp` (`lib/parcours-xp.ts`, utilisé par `parcours-detail.tsx`) : [À VÉRIFIER au lot 0 laquelle est la source unique avant de réutiliser].
- Série : comptée sur la PRATIQUE (étape validée, quiz d'étape terminé), jour civil de Paris ; `effectiveStreak` remet à 0 si rompue ; `recordPractice`.
- Rythme doux : `NEXT_STEP_DELAY_DAYS = 7`, étape suivante « conseillée », jamais bloquée. Avec Premium, toutes les étapes sont ouvertes d'un coup (choix du 18/10).
- Tables : `UserPathProgress` (currentStep, completedSteps[], startedAt, completedAt), `UserPathStepCompletion` (date de validation, unique par utilisateur/parcours/étape), `UserPathStepFeedback` (3 valeurs fermées `pas-essaye`, `essaye-bof`, `essaye-ca-a-marche`, avis @legal C13 : aucun champ libre), `ParcoursReminderPreference` (rappel e-mail sur demande, un par semaine, arrêté après 3 rappels sans activité), `UserFavorite`, `JokeLike`, `PremiumLetterPreference`, `AccountLetterPreference`, `PushToken` (app iPhone), `CancellationFeedback`.
- API : `/api/parcours/[id]/progress`, `/quiz`, `/retour`, `/api/parcours/by-slug/[slug]`, `/api/user/progress`, `/api/user/xp`, `/api/user/rappel-parcours`, `/api/favorites`, `/api/question-equipe`, `/api/user/subscription/*`, `/api/fiches/exercice`.
- Composants : `components/parcours/` (`parcours-detail` : déjà une barre « x/N étapes complétées », XP gagnés et total, accordéon d'étapes avec ancre `#etape-N`, états chargement et échec ; `parcours-step-card`, `step-quiz`, `step-blocks`, `path-completion-card`, `parcours-content`), `components/profil/` (`profil-dashboard`, `abonnement-card`, `prenom-card`, `question-equipe-card`, `question-equipe-messages`, `supprimer-compte-card`, `upgrade-toast`), `components/home/reprendre-parcours.tsx`, `components/favoris/favoris-list.tsx`, `components/carnet/*`. Contenu exact de chacun : [À VÉRIFIER au lot 0].

### 2.4 « Ta question à l'équipe »
Encadré Premium sous la carte abonnement du profil (`question-equipe-card.tsx`), `POST /api/question-equipe` (session + Premium vérifié en base, Reply-To du compte, 3/10 min et 10/jour, texte jamais en journal ni en base, questions vers alex@deviens-marrant.fr, réponse signée « L'Équipe Deviens Marrant », en général sous 1 à 2 jours ouvrés, jamais 7 jours). Interrupteur `QUESTION_EQUIPE_OUVERTE` : `true` dans le code (`config/question-equipe.ts:11`), l'état en production reste [À VÉRIFIER]. Conséquence : aucune question n'est stockée, donc aucune réponse ne peut aujourd'hui s'afficher dans l'espace (voir Q6).

### 2.5 Exercices Premium (`lib/champs-premium.ts` LU)
L'exercice d'une fiche (« À toi de jouer » d'une vanne, exercice d'un conseil, points clés et exercice d'une vidéo) n'est jamais envoyé à un compte non Premium : ni dans le HTML (`lib/catalogue-pages.ts`), ni dans `/api/jokes`, `/api/tips`, `/api/videos` (`sansExerciceVanne`, `sansExerciceConseil`, `sansExerciceVideo`), ni dans `/api/favorites` et `/api/fiches/exercice` (déjà filtrés, base naturelle de l'agrégation des exercices). Tout nouvel écran de l'espace qui liste ces champs doit passer par ces helpers côté serveur.

### 2.6 Écart avec la référence
| Élément de la capture | Chez nous aujourd'hui | Écart |
|---|---|---|
| Barre de rubriques en haut, une ligne | En-tête public à 7 onglets (6 + « La lettre » ou « Carnet »), menu de compte à 3 entrées | Pas de barre propre à l'espace ; budget de largeur saturé |
| Cloche + pastille | Rien (aucun modèle de notification ; `PushToken` sert l'app iPhone) | À créer |
| Identité du membre (nom) | `prenom-card.tsx` au profil ; pas dans l'en-tête | Petit |
| XP total + progression globale | `User.xp`, niveaux, série ; « N XP gagnés sur 700 » sur la carte d'un parcours (choix du 11/10) | La page parcours abonné affiche déjà une barre « x/N étapes complétées », les XP gagnés et le total avec bonus (parcours-detail.tsx, parcours-xp.ts). Écart réel : pas de rappel XP et niveau global en tête, pas de vue regroupant les 5 parcours. |
| Sous-parcours par niveau (« Débutant 1, 0/8 fiches ») | Un parcours = 3 à 6 étapes, une par semaine (Machine à Café 3, Répartie 4, Confiance 6, Storytelling 6, Boulot 6 : `PREMIUM_PARCOURS`, `config/premium.ts`), pas de niveaux | À NE PAS inventer : voir Q4 |
| Liste numérotée avec « Voir » et « Fait ✓ » | Accordéon d'étapes avec validation liée à l'exercice et au quiz | Écart de logique : voir Q5 |
| Mes notes | Rien | À créer, et risque RGPD (voir Q5b) |
| Favoris | Oui (`/favoris`) | À intégrer dans la barre |
| Écrire au coach | « Ta question à l'équipe » (encadré du profil) | À rendre accessible depuis la barre, sous le libellé « Écrire à l'équipe » (vocabulaire validé) |
| Ateliers, grammaire | Aucun équivalent chez nous | Ne rien inventer ; rubrique absente |
| Pastilles de nouveauté, réglages, déconnexion, identifiant de membre | Rien / menu de compte | Pastilles : via la cloche seulement ; réglages et déconnexion : « Mon compte » ; identifiant chiffré : jamais repris |

## 3. Architecture cible (proposition, noms à caler avec Thomas, règle P0 s8)

Principe : l'espace est une zone connectée Premium, dynamique (jamais ISR), `noindex`, avec sa propre barre de rubriques. Les pages publiques (catalogue, fiches, articles, parcours ISR) ne changent pas : zéro retouche hors périmètre (P0 du 21/10).

### 3.1 Rubriques de la barre (correspondance avec nos contenus RÉELS)
Les noms sont des PROPOSITIONS de travail, à valider par étalons (Q2). Aucune rubrique sans contenu réel derrière.

| Rubrique proposée | Contenu réel | Page cible | Dans la capture |
|---|---|---|---|
| Aujourd'hui (accueil de l'espace) | contenu du jour (vanne, conseil, vidéo), « Reprendre », série, prochain pas | nouvelle (`/mon-espace`) | (absent, voir 3.2) |
| Parcours | les 5 parcours, progression globale | `/parcours` et `/parcours/[slug]` (URL existantes, 3.3) + vue « Ma progression » nouvelle | Parcours |
| Carnet | carnet du mois et mois passés | `/carnet` | (proche de « Guides ») |
| Vannes | catalogue illimité + exercice « À toi de jouer » | `/vannes` | (proche d'« Expressions ») |
| Conseils | catalogue illimité + exercice | `/conseils` | Guides |
| Vidéos | 89 vidéos décortiquées + points clés | `/videos` | Apprendre, lire et écouter |
| Vocabulaire | glossaire (jargon du stand-up) | `/glossaire` | Vocabulaire |
| Exercices et jeux | quiz d'humour + exercices des fiches | retirée de V1 sauf décision de Thomas (Q12) | Exercices et jeux |
| Favoris et notes | favoris | `/favoris`, `/mon-espace/notes` (3.5) | Favoris, Mes notes |
| Écrire à l'équipe | encadré existant, sorti du profil | nouvelle entrée vers l'encadré | Écrire au coach |
| Lettre | lettres réservées Premium reçues, archive | `/lettre` [À VÉRIFIER ce qu'un abonné y voit] | (absent) |
| Mon compte | abonnement, prénom, rappel, suppression | nouvelle (cartes du profil migrées, 5.3) | (réglages) |

Non repris faute de contenu : Ateliers, Grammaire, Expressions et proverbes. « Articles » (blog) reste dans le site public (SEO) ; sa place dans la sous-barre est tranchée à Q11.

**Règle de navigation (UX C5).** Les rubriques de contenu (Parcours, Carnet, Vannes, Conseils, Vidéos, Vocabulaire, Favoris) pointent vers les URL EXISTANTES. Aucune copie sous /mon-espace (pas de contenu dupliqué, pas de canonical à gérer). La sous-barre est rendue côté navigateur, pour une session Premium seulement, sur ces URL et sur les nouvelles pages de /mon-espace ; le HTML serveur reste celui du visiteur (même mécanisme que premiumNavItems dans header.tsx). Seules sont créées sous /mon-espace : Aujourd'hui, Ma progression, Mes notes, Mon compte, Écrire à l'équipe. Page cible publique = la barre de l'espace n'y existe pas aujourd'hui : voir Q11 (tant que Thomas n'a pas répondu, la sous-barre n'est pas affichée sur les pages publiques).

**Si Q11 = A : maximum 6 entrées visibles (UX C6).** Aujourd'hui, Parcours, Carnet, Favoris et notes, Écrire à l'équipe, Plus (Vannes, Conseils, Vidéos, Vocabulaire, Quiz, Lettre, Mon compte). Ordre par fréquence d'usage attendue, validé par étalons. Rubrique « Exercices et jeux » : retirée de V1 sauf décision Thomas (Q12). Si Q11 = B (voie par défaut tant que Thomas n'a pas répondu) : la sous-barre n'existe que sous /mon-espace et ne porte que Aujourd'hui, Ma progression, Mes notes, Écrire à l'équipe et Mon compte ; l'en-tête garde ses 7 onglets ; les autres rubriques restent dans l'en-tête public.

**Barre de rubriques (D4).** `nav` avec `aria-label`, élément actif marqué par `aria-current="page"` ET par un signe visible autre que la couleur (soulignement 2 px + texte `text-primary`). Libellés en texte (jamais d'icône seule), casse normale, au moins 14 px. Cible tactile >= 44 px de haut sur toute la barre. Sous-barre `sticky` sous l'en-tête (top-16), `z-index` inférieur à celui de l'en-tête (z-50), fond `background` opaque, séparation par `border`, sans ombre. Mobile : défilement horizontal avec `scroll-snap`, fondu de bord, rubrique active ramenée dans la vue à l'ouverture, focus clavier jamais masqué par le fondu. Menu « Plus » : bouton avec libellé « Plus », `aria-expanded`.

### 3.2 Tableau de bord d'accueil de l'espace (« Aujourd'hui »)
**Priorité d'affichage à 375 px, sans défiler :** (a) salutation et série sur une ligne, (b) UNE action principale : « Reprendre {étape} » ou, au jour 1, « Commencer {premier pas} » (règle : Q10), (c) le contenu du jour. Tout le reste (progression, nouveautés, raccourcis) passe sous la ligne de flottaison, en cartes repliables ou empilées. Maximum 3 actions principales visibles par écran.

Blocs, du haut vers le bas, chacun avec un état vide qui donne une action (jamais un tableau de zéros) :
1. Salutation avec prénom (repli « Salut, » si absent, règle du 07/10) et série « {n} jours de pratique d'affilée » (texte validé s17).
2. « Reprendre » : le parcours en cours (réutiliser `reprendre-parcours.tsx`) ; premier jour sans parcours commencé : un premier pas nommé, jamais « choisis un parcours » (cause H2). Le premier pas nommé ici est le même que sur la page de succès. L'e-mail E0 approuvé le 07/11 ne nomme aucune étape (« Par où commencer : la première étape d'un parcours, au choix parmi {listeParcours}. {url}/parcours », `docs/copy/onboarding-premium-s23-emails.md` l. 37) : il n'est pas modifié, l'espace précise ce qu'E0 laisse ouvert.
3. Le contenu du jour (vanne, conseil, vidéo), réutilise `daily-content.tsx` [À VÉRIFIER réutilisable en zone connectée].
4. Progression : étapes faites et série en tête ; XP et niveau (NOVICE à LEGENDE, noms d'affichage à valider) ensuite, avec barre vers le niveau suivant. Message de première victoire à la première étape validée.
5. Nouveautés : carnet du mois, lettre de la semaine, date conseillée de la prochaine étape (rythme doux, jamais bloquant).
6. Raccourcis : favoris récents, dernière note.

**Moment « aha » et premier pas (décision de Thomas, Q10).** Le premier pas du premier jour tient en moins de 5 minutes et produit quelque chose que l'abonné ressent (une réplique à lui, une étape faite), jamais un choix à faire. Règle d'affichage : un seul premier pas nommé. Pour un abonné sans parcours commencé : 1) le contenu d'où il vient (`returnTo`) s'il existe ; 2) sinon la première étape du parcours désigné par son quiz s'il l'a passé ; 3) sinon la valeur retenue à Q10. Ce premier pas est LE MÊME dans la page de succès et dans « Aujourd'hui » ; l'e-mail E0 (approuvé, non modifié) renvoie à /parcours sans nommer d'étape, ce qui reste cohérent avec toute réponse à Q10 ; la « prochaine étape » réutilise la logique de `rappel-parcours.ts`. L'événement « aha » mesuré est la première étape validée ou le premier exercice ouvert, jamais la simple ouverture d'une page.

Interdit (P0 s8) : hook de surveillance (« tu n'as pas pratiqué depuis N jours »), culpabilisation, pub déguisée. Ton : « le pote drôle et bienveillant », tutoiement, aucun émoji, zéro tiret cadratin.

### 3.3 Page parcours « progression + étapes + Voir / Fait »
Structure inspirée de la capture, avec NOS données :
- En-tête : lien retour aux parcours, titre du parcours, ligne « {n} étapes, {xp} XP gagnés », pastille « {xp} XP total » (réutilise le total avec bonus de fin : le libellé exact du 11/10 « N XP gagnés sur 700, bonus de fin compris » est conservé).
- URL et réutilisation : la page abonné reste /parcours/[slug] (ISR inchangée pour le visiteur). On ENRICHIT parcours-detail.tsx (déjà : barre, XP, accordéon, ancre #etape-N, états chargement et échec) au lieu de le reconstruire. Aucune seconde page de parcours sous /mon-espace. (Garde : l'enrichissement n'agit que pour une session Premium, côté navigateur ; critères 1 et 11.)
- Carte « Progression globale » : barre `completedSteps.length / nombre d'étapes`, pourcentage, toujours doublés du texte « {n} sur {total} étapes ».
- Liste numérotée des étapes : numéro, titre, format et durée, statut en texte (« À faire », « Conseillée le {date} », « Fait ») et UN seul bouton par ligne : « Voir » (devient « Reprendre » si commencée). « Fait » est un statut affiché (coche et texte, jamais une couleur seule), pas un bouton, tant que Q5 = A : la validation reste celle de l'exercice ou du quiz dans l'étape ouverte. Voir ouvre l'étape à la même page (ancre #etape-N). Nombre d'étapes : 3 à 6 selon le parcours, lu dans `LearningPathStep` ; ne pas utiliser `parcoursWeeks`, typé sur 3 slugs seulement.
- Hiérarchie des actions d'une page parcours (D3) : UNE seule action dominante visible (le bouton « Voir » de l'étape conseillée, `Button` variant `primary`). Les autres lignes : « Voir » en `outline-accent`, « Fait » en `outline` avec libellé texte « Fait » et coche, jamais six boutons pleins. Étape faite : coche + libellé « Fait » (pas seulement une couleur), bouton « Voir » conservé. Numéro d'étape et statut en texte, lisibles sans la couleur. (Arbitrage : tant que Q5 = A, « Fait » est le statut de la ligne ci-dessus et non un bouton ; le style `outline` de D3 s'applique seulement si Q5 = B ou C.)
- « Sous-parcours par niveau » : NON repris tel quel. Les parcours comptent 3 étapes (Machine à Café), 4 (Répartie), 6 (Confiance, Storytelling, Boulot), source config/premium.ts. Aucune règle de découpage ne doit supposer 6 étapes. Options à Q4.
- Pour l'abonné, toutes les étapes sont ouvertes (choix du 18/10). Le visiteur garde la page publique ISR inchangée.

### 3.4 XP et progression (réutiliser l'existant)
Aucune nouvelle règle d'XP, de niveau ni de série sans accord de Thomas. L'espace AFFICHE `User.xp`, `level`, `streak` et les complétions déjà calculés par `lib/progression.ts` et les routes existantes. Une vue « Ma progression » regroupe : XP, niveau, série, étapes faites par parcours, bilans de fin (sans certificat, choix du 07/10). [À VÉRIFIER au lot 0 : la page `/parcours` (liste) affiche-t-elle déjà la progression par carte pour un abonné ? Si oui, « Ma progression » ne la double pas.]

### 3.5 Notes personnelles
Modèle de travail [HYPOTHÈSE] : une note rattachée à une fiche ou un parcours (vanne, conseil, vidéo, étape) ou libre. Table neuve `UserNote` (migration additive, comme les migrations 16 et 17). Point de vigilance : `UserPathStepFeedback` a été limité à 3 valeurs fermées sur avis @legal C13 (aucun champ libre) ; une note libre est une donnée personnelle de texte libre. Décision Q5b ; si Thomas retient le texte libre, avis @legal court et ciblé seulement sur ce point (règle du 19/10 : pas de juridique inutile), suppression avec le compte, export éventuel, jamais dans Umami ni dans les journaux.

### 3.6 Notifications (cloche)
Centre de notifications DANS le site, sans nouvel e-mail ni push (règle du 06/10 : au plus un e-mail par jour, et le 06/11 : peu d'e-mails ; les lettres existent déjà). Sources candidates, toutes déjà existantes dans le produit : nouvelle lettre réservée du jeudi, nouvelle fiche ou nouveau mois du carnet, étape conseillée disponible, nouveau parcours publié, réponse de l'équipe (si Q6 le permet). Pastille = nombre non lu. Tout ce qui ressemble à de la pression est exclu (jamais de notification d'inactivité ni de série menacée). Stockage : table `Notification` + lu/non lu, ou notifications calculées à la volée + un seul champ « vu le » [HYPOTHÈSE, option plus légère à chiffrer au lot 0].

**Cloche (D5).** Bouton d'au moins 44 x 44 px avec `aria-label` incluant le nombre non lu (« Notifications, 3 non lues »), pastille avec le nombre en chiffres (« 9+ » au-delà), contraste texte/pastille >= 4,5:1, aucun clignotement ni animation en boucle. Panneau ouvert : bottom sheet sur mobile (`items-end`, `100dvh`, `safe-area-inset-bottom`), popover sur ordinateur ; ouverture et fermeture au clavier (Échap, focus rendu au bouton).

### 3.7 Favoris et « écrire à l'équipe »
Favoris : l'existant (`favoris-list.tsx`) est repris tel quel dans le cadre de l'espace. « Écrire à l'équipe » : l'encadré existant, accessible depuis la barre sans changer ses règles (délai 1 à 2 jours ouvrés, signature « L'Équipe Deviens Marrant », aucune mention d'IA). Garde-fou de charge : nombre de questions par semaine rapporté au délai promis (mesure 7 du §5.2).

### 3.8 Gratuit, Premium et états de compte
- Visiteur (pas de compte gratuit, P0 05/10) : voit uniquement le site public inchangé : étape 1 de chaque parcours, aperçu des suivantes, listes limitées 10/3/3, fiches lisibles pour le SEO. Il ne voit pas l'espace ; une page de l'espace ouverte sans session redirige vers la connexion avec retour (`buildLoginUrl`).
- Premium : tout l'espace (barre, tableau de bord, progression, parcours complets, exercices, carnet, favoris, notes, notifications, question à l'équipe, lettres réservées).
- Exercices et champs réservés : tout écran qui les expose passe par `sansExercice*` quand le plan n'est pas PREMIUM ; plan relu EN BASE côté serveur (jamais depuis le seul jeton de session).
- **États de compte (correction growth), chacun avec son écran défini avant le lot 1.** 1) Premium actif : tout l'espace. 2) Premium avec résiliation programmée (`cancelAtPeriodEnd`) : espace ouvert et identique ; dans « Mon compte » seulement, une ligne factuelle « Ton accès reste ouvert jusqu'au {date}. » et un lien « Reprendre l'abonnement » [À VÉRIFIER au lot 0 : faisable par le portail Stripe] ; aucune bannière, aucune pastille, aucun texte de regret ; la résiliation reste à 1 clic. 3) Ancien abonné (plan FREE après abonnement) : redirection vers `/abonnement` avec, au-dessus de l'offre, une ligne vraie et affichée seulement si n > 0 : « Tes favoris et ta progression sont gardés : {n} étapes faites, {n} favoris. » (texte neuf et retouche de `/abonnement` : accord de Thomas avant mise en ligne) ; les données ne sont pas supprimées à la fin de l'accès (durée de conservation des comptes inactifs : sujet reporté par Thomas le 07/10, ne pas le rouvrir, seulement ne rien supprimer). 4) Compte FREE historique ou visiteur : redirection vers la connexion ou `/abonnement` (Q7), sans aucun aperçu de l'espace dans les pages publiques sans accord écrit de Thomas.
- Les 12 comptes FREE et les anciens abonnés (plan remis à FREE par le webhook) : traités comme un visiteur ([CHOIX UTILISATEUR] 05/10), données conservées, aucune suppression sans GO.

### 3.9 Composants à réutiliser (D2)
Obligatoires : `ProgressBar` (progression globale et par niveau de XP, avec `ariaLabel`), `Card`, `Badge` (pastille « XP total », statut d'étape), `Button` (variantes ci-dessus), `Chip`, `StreakCounter`, `XpNotification`, `EmptyState`, `ErrorState`, `Chargement`, `LigneCompte`. Texte violet de moins de 24 px : `text-accent-link`, jamais `accent-primary`. Si un composant manque, @design le spécifie dans `docs/design/component-library.md` avant le code. Livrable @design complémentaire : `docs/design/page-compositions.md` (section espace : layout par breakpoint, ordre et priorité des blocs).

## 4. Questions et étalons à trancher AVEC Thomas avant tout développement (règle P0 s8)

Méthode : présenter 3 options par question avec une reco, en une phrase sans jargon (founder-preferences 07/10) ; 3 à 5 étalons visuels ou textuels calibrés avec lui AVANT tout brief @copywriter. Un « go » global ne lève aucun [CHOIX UTILISATEUR] déjà écrit (règle du 03/10). Une option qui rouvre une décision est marquée « rouvre la décision du JJ/MM, accord écrit de Thomas requis ».

**Ordre (reviewer O10).** Q1, Q3 et Q11 d'abord (structure). Puis @design rend 3 variantes de barre en local, interrupteur fermé, captures 375 et 1280 px, montrées à Thomas pour Q2. Puis Q4 à Q10 et Q12. Aucun brief @copywriter avant ces étalons.

| # | Question | Option A | Option B | Option C | Reco |
|---|---|---|---|---|---|
| Q1 | Où vit l'espace ? | Nouvelle zone `/mon-espace/...` avec sa barre, `/profil` y est intégré (redirection temporaire 307, côté serveur, seulement interrupteur ouvert) | Garder `/profil` comme page d'entrée et ajouter les rubriques autour | Refondre `/profil` en place | A : les écrans neufs vivent dans une zone propre ; ancien `/profil` redirigé en 307 : une 308 reste en cache dans les navigateurs et survivrait à un retour arrière de l'interrupteur |
| Q2 | Nom de l'espace et des rubriques | « Mon espace » + rubriques du §3.1 | « Mon carnet de bord » (ton maison) + mêmes rubriques | « Mon compte » + rubriques courtes | A, avec libellés calés sur 3 étalons de barre rendue (le libellé retenu met à jour `header-budget.spec.ts`, §2.2) ; quel que soit le choix, l'entrée « Mon profil » reste visible (§2.2 : au moins 15 textes validés disent « depuis ton profil ») |
| Q3 | Barre de rubriques et budget de l'en-tête | Sous-barre dédiée sous l'en-tête (sous le `h-16`), défilement horizontal sur mobile, en-tête du visiteur inchangé | Remplacer les onglets publics par la barre de l'espace quand l'abonné est dans l'espace | Menu latéral (colonne) sur ordinateur, barre basse sur mobile | A, avec trois précisions obligatoires. (1) Si Q11 = A : pour l'abonné, l'en-tête garde logo, recherche, cloche (si Q6 ≠ C) et menu de compte, et ses 7 onglets passent dans la sous-barre. Si Q11 = B : en-tête inchangé, sous-barre limitée aux rubriques neuves de /mon-espace. Dans les deux cas, aucune rubrique n'apparaît deux fois. (2) Mobile : sous-barre de 44 px de haut, rubrique active ramenée dans l'écran au chargement, fondu de bord, jamais plus de 6 entrées ; empilement total en-tête + sous-barre <= 112 px ; le calcul de hauteur du menu mobile et les ancres (scroll-padding-top) en tiennent compte. (3) header-budget.spec.ts étendu à l'état « abonné avec sous-barre ». |
| Q4 | « Sous-parcours par niveau » : nous n'avons que des étapes de semaine (3 à 6) | Pas de sous-parcours : une page = un parcours, ses 3 à 6 étapes (réalité) | Regrouper les étapes en blocs nommés sans changer le contenu (seulement pour les parcours à 6 étapes ; les parcours de 3 et 4 étapes restent d'un bloc) | Créer des niveaux Débutant/Intermédiaire sur un parcours | A, pas d'invention de structure ; B seulement si Thomas veut le rendu de la capture |
| Q5 | « Fait ✓ » : sens du bouton | « Fait » = la validation actuelle (exercice ou quiz fait, XP, série), affichée comme statut | « Fait » manuel en un clic, sans preuve, XP réduit ou nul [HYPOTHÈSE : effet sur la rétention non démontré] | « Voir » seul + « Fait » apparaît après lecture de l'étape | A : XP et série restent honnêtes (série comptée sur la PRATIQUE, choix 07/10) ; ajouter un « Voir » direct. Les options B et C ne touchent jamais la série (D3, [CHOIX UTILISATEUR] 07/10) |
| Q5b | Notes : forme | Texte libre court (limite de longueur), privé : rouvre la décision du 07/10 (conditions juridiques déjà intégrées au code maintenues, dont l'avis @legal C13 : aucun champ libre), accord écrit de Thomas requis | Notes cadrées (une phrase par fiche : « ma réplique à moi ») | Pas de notes en V1 | B : cohérent avec l'avis C13 et l'exercice « Écris-le ici si ça t'aide » de l'app ; A si Thomas veut la liberté, avec un avis @legal minimal |
| Q6 | Notifications et réponses de l'équipe | Notifications de contenu seulement (lettre, carnet, étape) | A + réponse de l'équipe affichée dans l'espace (stocker questions et réponses, durée de conservation déjà fixée à 6 mois pour les e-mails) : rouvre la décision du 25/10 (« rien en base »), accord écrit de Thomas requis | Pas de cloche en V1 (un bloc « Nouveautés » dans Aujourd'hui suffit si les sources donnent moins d'un événement par semaine) | A en V1 ; B seulement sur accord écrit |
| Q7 | Comptes sans abonnement (12 comptes FREE et anciens abonnés repassés en FREE) | Déjà tranché, [CHOIX UTILISATEUR] 05/10 : un compte non abonné a exactement ce qu'a un visiteur. Page de l'espace = redirection vers `/abonnement` avec retour ; favoris conservés en base et affichés comme aujourd'hui par `FavorisList` | (aucune : les options « espace verrouillé avec aperçu » et « accès partiel » rouvriraient un palier gratuit, retirées) | (aucune) | À annoncer à Thomas, pas à lui poser |
| Q8 | Page d'arrivée après connexion et après paiement | `Aujourd'hui` de l'espace (et page de succès avec premier pas, R1 de l'analyse) | `/parcours` comme aujourd'hui (`config/premium.ts`) | Retour à la page d'origine (`returnTo`) | A pour la connexion d'un abonné ; `returnTo` conservé après paiement si l'acheteur venait d'un contenu précis ; la page de succès garde « Renoncer au contrat ici » |
| Q9 | Noms d'affichage des niveaux (NOVICE à LEGENDE) et XP | Reprendre les noms internes en français courant | Noms inventés plus drôles, à valider par étalons | Masquer le niveau, ne garder que l'XP | A ou B selon étalons ; aucun seuil modifié ; les 4 premières semaines, étapes faites et série passent avant XP et niveau |
| Q10 | Quel est le premier pas du premier jour ? (fusion UX + growth) | La première étape de Machine à Café (3 étapes, la plus courte ; durée 15 à 20 min [À VÉRIFIER au lot 0]) | L'exercice de la vanne du jour (environ 2 min), qui mène à l'étape 1 le lendemain [À VÉRIFIER au lot 0 : l'action s'enregistre-t-elle ?] | Le quiz d'humour, puis le parcours conseillé | Règle de priorité de §3.2 (contenu d'origine, puis parcours du quiz, puis cette valeur) ; pour la valeur : B si l'action s'enregistre (victoire en 2 minutes), sinon A ; calé sur 3 étalons. Même premier pas dans la page de succès et Aujourd'hui (E0 inchangé : il ne nomme pas d'étape). L'option A (15 à 20 min) ne respecte pas la règle des 5 minutes du §3.2 : à dire à Thomas |
| Q11 | Entrée dans l'espace, en-tête de l'abonné et barre sur les rubriques qui sont des pages publiques (fusion UX Q11 + reviewer Q10) | Entrée par le menu de compte ; pour l'abonné, les 7 onglets de l'en-tête migrent dans la sous-barre, qui s'affiche aussi sur ces pages, rendue côté navigateur seulement (HTML serveur identique, critère 11) ; l'en-tête garde logo, recherche, cloche, compte ; « Accueil » = le logo, « Articles » dans « Plus » [HYPOTHÈSE] | En-tête de l'abonné inchangé ; la sous-barre n'existe que dans l'espace et ne porte que les rubriques neuves ; les rubriques de contenu renvoient aux pages publiques telles quelles, la barre disparaît dès qu'on les quitte | Copies des listes sous `/mon-espace/...` en noindex (doublons à faire valider par @seo) | A : un seul jeu de mots à l'écran, la barre ne disparaît jamais, rien ne change pour Google. A change l'aspect de pages publiques pour l'abonné seulement : accord écrit de Thomas requis ; B si Thomas veut zéro changement visible hors de l'espace (B est la voie par défaut tant qu'il n'a pas répondu) |
| Q12 | « Exercices et jeux » : que contient cette rubrique ? | Quiz d'humour et exercices des parcours seulement | A + exercices des fiches agrégés (vannes, conseils, vidéos), base : `/api/fiches/exercice` et `/api/favorites` | Pas de rubrique en V1 | C si l'agrégation des exercices n'est pas chiffrée ; A sinon (rien d'inventé) |

Étalons visuels à obtenir de Thomas (3 à 5) : rendu de la barre (3 variantes), tableau de bord (2 variantes), carte de progression, ligne d'étape « Voir / Fait », cloche ouverte. Étalons de texte : titres et libellés des rubriques, états vides, message de série, 3 notifications types (ton de marque, zéro tiret cadratin, aucun émoji, « tu »).

**Forme des étalons visuels (D8).** Écrans HTML statiques ou captures rendus avec les vrais tokens du site en thème sombre, jamais des maquettes d'un autre style. Ils sont produits par @design et soumis à Thomas AVANT le lot 1 (pas seulement au lot 0). Une variante est recommandée par étalon, avec une phrase sans jargon (effet pour l'abonné).

## 5. Plan de livraison par lots (dépendances, pas de sprints ; V1 complète, commandement 5)

Calibrage vélocité IA : lots parallélisés dès que leurs dépendances sont levées ; aucune fonctionnalité coupée « par manque de temps » (seulement par valeur persona, décidée avec Thomas). Tout l'espace est construit INERTE derrière `ESPACE_CLIENT_PUBLIE = false` (même patron que `BOULOT_PUBLIE`, `QUESTION_EQUIPE_OUVERTE`, `RESILIATION_PAGE_OUVERTE`) : fermé = le profil et les pages actuels sont strictement inchangés (et aucune écriture en base : notifications, notes).

**Ordre de livraison (correction growth).** a) La mesure d'usage du lot 0 est déployée ACTIVE (hors de l'interrupteur `ESPACE_CLIENT_PUBLIE`), sur go écrit de Thomas, au moins 14 jours avant l'activation de l'espace : une mesure inerte n'accumule aucune référence et interdit tout avant/après. b) Les retouches de la page de succès, de l'ordre de l'e-mail de confirmation et de la réassurance (R1, R2, R4 de l'analyse s23) sont indépendantes de l'espace et passent avant lui, si elles ne sont pas déjà faites (état à vérifier au lot 0). c) Activation en deux temps : jalon 1 = lots 1 et 2 (« Aujourd'hui », progression, parcours), activés dès qu'ils sont à 10/10 sur go de Thomas ; jalon 2 = lots 3 à 6, activés un par un. Le lot 8 décrit donc deux activations, chacune avec son bilan de mesure.

| Lot | Contenu | Dépend de | Agents | Livrable |
|---|---|---|---|---|
| 0 | Relecture du code restant (§2 [À VÉRIFIER]), dont l'état de R1, R2, R4 et la liste des liens vers `/profil` ; mesure d'usage en base : reprendre le bloc B de `docs/growth/onboarding-premium-s23-plan.md` (événements R3 et journal, non livré au 10/11 : aucun `first_premium_access` dans `src/`), jamais une seconde version ; construite et testée en local sans attendre les réponses de Thomas, puis déployée SEULE dès son go écrit (voir ordre a) ; discovery-map et assumption-map courtes ; liste des écrans à 5 états ; stories du template (`functional-specs`) ; questions posées dans l'ordre du §4 | rien | @product-manager, @fullstack (mesure), @data-analyst (plan de tags), @ux | `docs/product/espace-client-specs-s24.md`, étalons dans `docs/copy/etalons-espace-client-s24.md`, mesure en base prête à déployer |
| 1 | Coque : route, garde Premium (plan relu en base), barre de rubriques, identité, tableau de bord « Aujourd'hui », premier pas (Q10), états de compte (§3.8), redirection 307 de `/profil`, 5 états UI | Lot 0, étalons visuels (D8), Q1, Q2, Q3, Q8, Q9, Q10, Q11 | @ux, @design, @copywriter, @fullstack | Pages en local, interrupteur fermé |
| 2 | Vue « Ma progression » + enrichissement de la page parcours existante (XP et niveau en tête, progression globale, liste d'étapes Voir / Fait) | Lot 1, Q4, Q5 | @ux, @design, @fullstack | Captures sombres 320, 375, 768, 1280 |
| 3 | Rubriques de contenu : entrées de barre vers les pages publiques existantes (aucune fiche dupliquée) ; agrégation des exercices seulement si Q12 = B | Lot 1 (parallèle au lot 2), Q11, Q12 | @fullstack, @ux, @design | Pages publiques inchangées, vérifié |
| 4 | Notes personnelles (table `UserNote`, migration additive, API, écran) | Lot 1, Q5b | @fullstack, @legal (seulement si texte libre), @qa | Migration jouée 2 fois sur base jetable |
| 5 | Notifications : modèle, génération depuis les événements existants, cloche, non lu | Lot 1, Q6 | @fullstack, @copywriter, @ux | Aucun e-mail nouveau |
| 6 | « Ta question à l'équipe » et lettres réservées accessibles depuis l'espace | Lot 1 (+ Q6 si réponses affichées) | @fullstack, @copywriter | Encadré réutilisé, règles du 25/10 intactes |
| 7 | QA complète par jalon (jalon 1 : lots 1 et 2 ; jalon 2 : lots 3 à 6), captures avant/après, performance, relecture @design et @ux itérée jusqu'à 10/10, essai réel enchaîné (achat de test, capture 375 px du clic d'entrée jusqu'à « Aujourd'hui »), pré-déploiement masqué | Lots du jalon | @qa, @design, @ux, @reviewer, @seo, @infrastructure | Rapport QA, avant/après, `REPLIT_ACTIONS.md` à jour |
| 8 | Activation jalon 1 puis jalon 2 (`ESPACE_CLIENT_PUBLIE = true`, migrations `UserNote` et `Notification` jouées en production par P1/P2 avant l'ouverture) et bilan de mesure de chacune | Go écrit de Thomas, mesure active depuis >= 14 jours | @infrastructure, @data-analyst | Deux bilans de mesure |

Rappels de méthode : projet copy = 3 à 5 étalons avec Thomas avant tout brief @copywriter (P0 s8, charte `docs/copy/charte-refonte-copy-s11.md`) ; rendu relu à l'aveugle par @design et @ux jusqu'à 10/10 AVANT mise en ligne (règle du 07/10) ; aucun rapport d'agent validé sans mesure du diff réel (P0 s11) ; Thomas veut les recommandations sans jargon (problème, effet pour l'utilisateur, ce qu'on fait). États vides et libellés : budget de mots chiffré et lisibles en 3 secondes sur téléphone (lessons-learned n°21 bis, P0).

### 5.1 Critères d'acceptation binaires (extraits ; les stories complètes sont écrites au lot 0)
1. Interrupteur fermé : `/profil`, `/parcours`, `/favoris`, l'en-tête et le pied de page sont identiques à la production (diff de HTML et captures 375 et 1280 px), aucune écriture en base.
2. Interrupteur ouvert, session absente : toute page de l'espace répond par une redirection vers la connexion avec retour ; aucune donnée personnelle dans le HTML.
3. Compte non Premium (plan lu en base) : aucun champ `howToApply`, `exercise`, `learnings` ni contenu d'étape 2+ dans le HTML ni dans une réponse d'API (test automatisé sur chaque nouvelle route).
4. Abonné : barre visible sur 6 largeurs (320, 375, 768, 1024, 1280, 1536), aucun libellé coupé, aucun débordement horizontal, cibles tactiles >= 44 px.
5. Le total d'XP, le niveau et la série affichés sont égaux aux valeurs de `User` et de `lib/progression.ts` (test sur 5 profils d'exemple, dont un à 0 XP).
6. Barre de progression d'un parcours = étapes validées / étapes du parcours ; 0 % affiché proprement, sans barre cassée, pour un nouveau compte.
7. Valider une étape deux fois (double clic) ne double ni l'XP ni la série (unicité existante conservée).
8. Chaque écran de la liste fournie au lot 0 (Aujourd'hui, Ma progression, Mes notes, Mon compte, page parcours, Plus) a ses 5 états testés (défaut, chargement, vide avec une action, erreur avec bouton Réessayer, succès) ; aucun écran vide sans bouton.
9. Notes : une note créée est visible seulement par son auteur ; supprimée avec le compte ; limite de longueur testée ; aucune note dans Umami ni dans les journaux.
10. Notifications : aucun e-mail ni push ajouté ; compteur non lu exact ; marquer comme lu persiste après rechargement.
11. Les pages publiques indexées (`/vannes`, `/conseils`, `/videos`, `/parcours/[slug]`, articles) : HTML, canonical, sitemap et `robots.txt` identiques avant et après ; les pages de l'espace sont `noindex` et absentes du sitemap.
12. Aucun tiret cadratin, aucun émoji, aucun nom de concurrent ni de la référence dans le texte client ; contrôle automatique sur les fichiers de textes.
13. Libellés de résiliation et de rétractation du pied de page et du profil inchangés et toujours accessibles en 1 clic depuis l'espace.
14. `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build` verts (lancés en environnement vide, §5.4) ; si des tests changent : `npx tsc --noEmit` (config complète), Jest sans secrets Stripe, CI GitHub verte sur le dernier commit.
15. Jour 1 : après un paiement réussi, un abonné sans historique atteint la première étape ouverte en 2 clics depuis la page de succès, et cette page affiche le premier pas nommé (Q10). Test E2E sur compte neuf. (UX)
16. Sous-barre : lien actif porteur de aria-current="page", visible sans défiler à 320 et 375 px, focus clavier visible, ordre de tabulation logique, aucun libellé coupé ; aucune rubrique n'apparaît dans l'en-tête ET la sous-barre. (UX)
17. Empilement en-tête + sous-barre <= 112 px à 375 px ; une ancre #etape-N ou #main-content n'est jamais masquée par les barres collantes. (UX)
18. `/profil` répond 307 vers la nouvelle adresse (interrupteur ouvert seulement) en conservant les paramètres de requête et le fragment. Les liens des e-mails approuvés et du pied de page restent valides après la redirection de `/profil` : `/profil`, `/profil#abonnement`, `/profil#rappel-parcours`, `/parcours`, `/parcours?src=onboarding-premium` et les `lienEtape` aboutissent à l'écran voulu (ancres `abonnement` et `rappel-parcours` présentes dans « Mon compte », test automatisé) ; tous les liens internes (menu de compte, menu mobile, retours Stripe, callbackUrl) sont listés au lot 0 et testés. Les textes des e-mails E0, E1, E1b et E2 ne sont pas modifiés par ce chantier : toute modification fait perdre l'approbation de Thomas (founder-preferences 07/11, 08/11). (UX + growth + reviewer O9, fusion)
19. Page parcours : pour 3, 4 et 6 étapes, la liste, la barre et le pourcentage sont corrects (test sur les 3 tailles) ; un parcours à 0 étape faite affiche « 0 sur N » et un bouton « Commencer ». (UX)
20. Un visiteur et un compte sans abonnement ne reçoivent ni sous-barre, ni cloche, ni donnée personnelle dans le HTML (déjà critère 2 et 3, vérifié aussi sur les URL publiques enrichies). (UX)
21. Contrastes mesurés (texte >= 4,5:1, composants et focus >= 3:1) pour chaque couple de tokens utilisé dans l'espace, rapport joint à la revue @design. (D6)
22. Focus visible sur tout élément interactif (anneau `focus-visible:ring-2`, jamais `outline: none` seul). (D6)
23. Aucune couleur en dur ni valeur arbitraire Tailwind dans les fichiers de l'espace (grep automatique : `#[0-9a-fA-F]{3,6}` et `\[[0-9]+px\]`). (D6)
24. Texte courant >= 14 px, texte secondaire >= 12 px, jamais en dessous. (D6)
25. Ligne d'étape à 320 px : titre sur 2 lignes maximum, « Voir » et « Fait » (quand « Fait » est un bouton, Q5 B ou C) côte à côte ou empilés, chacun >= 44 px de haut et de large, 8 px d'écart minimum, aucune coupure de libellé. (D6)
26. `prefers-reduced-motion` : barres de progression, fondus et pastilles sans animation. (D6)
27. Aucun `EmptyState` avec emoji dans l'espace (prop emoji rendue optionnelle ou variante sans emoji, retouche minimale, sans changement des pages publiques). (D6)

### 5.2 Mesures de succès (lisibles sur nos effectifs réels)
Nos effectifs sont très petits (683 visiteurs sur 28 jours à l'audit du 13/10 ; 4 abonnés au 02/11 ; aucune A/B possible) et la mesure serveur en base est la seule fiable (Umami ne voit pas les acheteurs, `resiliations-s23-analyse.md` §5).

**Règles de lecture (correction growth).** 1) Mesure principale : un tableau d'UNE LIGNE PAR ABONNÉ (anonymisé A, B, C… dans l'ordre des souscriptions, comme `resiliations-s23-donnees.md`) : délai souscription vers premier accès à un contenu Premium, délai vers le « aha », jours de pratique à J7, résiliation programmée (délai), abonnement actif au 2e prélèvement. Lecture cas par cas tant qu'il y a moins de 15 abonnés depuis l'activation ; aucun pourcentage publié sous 15 ; au-delà, « x sur n ». 2) Référence : les abonnés souscrits avant l'activation, avec la mesure active depuis au moins 14 jours. Comparaison par COHORTES d'abonnés (les 10 premiers après contre les 10 derniers avant), pas par semaines calendaires ; au rythme observé (4 abonnés du 07/10 au 02/11) la lecture prend environ 3 mois [HYPOTHÈSE], c'est assumé. 3) Indicateurs avancés, dans l'ordre : accès à un contenu Premium dans les 10 minutes ; « aha » à 24 h ; au moins 2 jours de pratique à J7 ; résiliation programmée avant J7 ; abonné actif au 2e prélèvement (seule vraie mesure de rétention). 4) « Premier accès Premium » = lecture d'un CONTENU réservé (étape 2+ dépliée, bloc exercice vu, carnet ; les listes ne comptent pas) ; ouvrir « Aujourd'hui » ou la barre ne compte pas. 5) Seuil a priori [HYPOTHÈSE, à confirmer par Thomas] : sur les 10 premiers abonnés après activation, moins de résiliations avant J7 que sur les 10 derniers avant = « à poursuivre » ; sinon = « aucun effet visible, on corrige l'étape qui ne fait pas le travail ». La mesure sert à apprendre où corriger ; le GO de l'espace reste fondé sur la valeur persona (commandement 5). 6) Le « 3 sur 4 » n'est cité dans aucun rapport tant que le dénominateur n'est pas extrait au lot 0. 7) Garde-fou charge : nombre de questions à l'équipe par semaine, rapporté au délai promis (1 à 2 jours ouvrés).

- **Définitions opérationnelles de la mesure (tranchées par la session le 12/11 après la relecture QA tour 1, `docs/qa/mesure-usage-s24-tour-1.md`).**
  - « Premier accès Premium » = un contenu réservé RÉELLEMENT affiché à l'abonné, une fois par abonnement : étape 2+ dépliée (clic, ancre ou dépliage automatique) ; bloc exercice d'une fiche entré dans la vue ; page du carnet ouverte. Seul compte un contenu qu'un visiteur ne peut PAS voir : les listes (vannes, conseils, vidéos) ne comptent jamais, car toutes leurs pages, page 2 et suivantes comprises, sont servies en HTML public à tout visiteur (vérifié le 12/11 : `/vannes?page=2` anonyme = 12 vannes). Le simple chargement d'une page ou d'une API ne compte jamais.
  - « Entré dans la vue » = au moins la moitié de l'élément (ou de la hauteur d'écran) visible pendant au moins 1 seconde ; signal du navigateur vers `POST /api/mesure/acces` (session, plan relu en base, liste fermée, réponse 204), sans aucune différence de rendu ni de HTML.
  - « Aha » = première étape de parcours validée OU premier quiz d'étape terminé. L'ouverture d'un exercice n'est jamais un « aha ».
  - Heure de souscription = heure de l'événement Stripe `checkout.session.completed` (`event.created`), pas la création de la session de paiement.
  - Lecture : tableau anonymisé « M-A, M-B… » (lettres distinctes des A à D des données s23), heures de Paris ; le seuil « cas par cas sous 15 » porte sur les abonnés (comptes distincts) entrés depuis la mise en ligne de la mesure, ou depuis l'activation quand elle est donnée.
- **Facteur confondant (reviewer O6, fusionné avec le point 2).** L'onboarding Premium (E0 à E2) est ouvert depuis le 08/11 (`ONBOARDING_PREMIUM_OUVERT = true`) et vise les mêmes causes (H1, H2). Toute comparaison avant/après porte sur des abonnés entrés après le 08/11 des deux côtés ; sinon l'effet de l'espace et celui des e-mails d'accueil sont indiscernables. Si le nombre d'abonnés « avant » entrés après le 08/11 est trop faible pour une cohorte de 10, la lecture reste cas par cas (arbitrage : la condition la plus stricte l'emporte sur le point 2).
- Usage de l'espace (comptes seulement) : ouvertures de « Aujourd'hui », de la cloche, notes créées, questions posées ; redirections des comptes sans abonnement vers `/abonnement` (signal de demande, sans identifiant).
- Contre-mesures : conversion visiteur vers paiement (non dégradée), temps de réponse des pages (§5.3).

### 5.3 Risques et parades
| Risque | Parade |
|---|---|
| SEO : une page publique change par effet de bord (composant partagé, dont `parcours-detail.tsx` enrichi) | Pages neuves de l'espace dans un groupe de routes séparé ; enrichissements rendus côté navigateur pour Premium seulement ; diff de HTML des pages publiques avant/après (critère 11) ; @seo valide ; ne jamais modifier une URL qui se positionne |
| ISR : une page ISR devient dynamique ou, pire, un contenu personnel est mis en cache et servi à un autre | Zéro donnée personnelle dans une page ISR ; l'espace en rendu dynamique `no-store` ; cache Cloudflare (`enableCacheInterception`) vérifié sur les routes de l'espace |
| Fuite de champs Premium (exercices, étapes 2+) vers un non-abonné | Helpers `sansExercice*` côté serveur, plan relu en base, test automatisé par route (critère 3) |
| Mobile : barre et empilement de barres collantes, budget de l'en-tête | Sous-barre de 44 px à défilement avec fondu, max 6 entrées + « Plus », garde-fou `header-budget.spec.ts` étendu (7 onglets et menu de compte figés à mettre à jour dans le même commit), captures 320 et 375 px |
| Redirection de `/profil` qui survit à un retour arrière, liens d'e-mails cassés | 307 serveur seulement interrupteur ouvert ; critère 18 |
| Performances (Workers, requêtes Prisma multiples sur le tableau de bord) | Une requête agrégée par bloc, pas de N+1 ; temps serveur médian de référence 0,26 s (13/10) à ne pas dégrader [À VÉRIFIER au lot 7] |
| Notes libres : donnée personnelle de texte libre | Q5b ; avis @legal minimal seulement si retenu ; suppression avec le compte |
| Notifications perçues comme de la pression | Contenu seulement, jamais de relance d'inactivité (P0 s8) |
| Doublons avec le profil actuel (abonnement, résiliation, prénom, rappel, suppression de compte) | Ces cartes migrent dans « Mon compte » sans changer leurs textes validés ; résiliation toujours à 1 clic, en style neutre `outline`, jamais en rouge plein |
| Dérive de scope et refonte non demandée (incident du 21/10) | Le périmètre est la zone espace ; hors périmètre : retouche minimale ; toute proposition de refonte d'une page publique = une phrase et accord de Thomas |

### 5.4 Contraintes non négociables (règles de Thomas)
- Retouche minimale hors périmètre : on ne touche pas aux pages publiques ; refonte seulement dans la zone espace demandée (P0 du 21/10).
- **Design (D1).** L'espace utilise EXCLUSIVEMENT le design system existant (`apps/web/tailwind.config.ts` et `components/ui`), en thème sombre natif du site. Aucune couleur en dur (pas de #hex, pas de `bg-[...]`), aucune taille hors échelle Tailwind, aucune ombre ou police nouvelle. La capture de référence est claire, en petites capitales, avec emojis et boutons bleus : rien de ce rendu n'est repris. Un besoin de token neuf est d'abord proposé à @design, ajouté à `tailwind.config.ts` avec son rapport de contraste mesuré, puis utilisé.
- **Captures (D7).** Captures du rendu réel local, en thème sombre, à 375, 768 et 1280 px (et 320 px pour la barre et la ligne d'étape), pour CHAQUE écran et CHAQUE état (défaut, chargement, vide, erreur, succès), nommées `tests/screenshots/espace-<écran>-<état>-<largeur>.png`. @design lit chaque PNG et note les 10 critères visuels (PRO, BEAU, aligné, aéré, conversion, hiérarchie, accessible, même identité, brand-aligned, propre) en PASS/FAIL avec justification concrète ; pas de validation sans captures. Avant/après montrés à Thomas pour chaque écran modifié ou créé ; pour l'espace neuf, captures « fermé = identique » et « ouvert ».
- Aucun déploiement sans go écrit de Thomas ; construire inerte, documenter dans `REPLIT_ACTIONS.md` (entrée « À DÉPLOYER ») ; hébergement actuel Cloudflare Workers/OpenNext ; procédure P0 à P8 de `REPLIT_ACTIONS.md`, étapes adaptées à chaque mise en ligne (migration jouée par P1/P2 avant l'ouverture, comme la migration 17) ; tout build, serveur local, tsc, lint, Jest et Playwright lancés en environnement vide (`env -i` + variables factices du job `e2e-local` de `.github/workflows/tests.yml`), jamais avec l'environnement du shell (lessons-learned n°21, P0), et jamais `env` ni `printenv` sans filtre (n°17) ; consigne recopiée dans CHAQUE prompt @fullstack et @qa ; migrations additives rejouées 2 fois sur base jetable AVANT le déploiement.
- Un « go » global ne lève jamais un [CHOIX UTILISATEUR] déjà écrit ; `[CHOIX UTILISATEUR]` non re-questionnables par aucun agent (@reviewer compris).
- Zéro tiret cadratin dans le client-facing, aucun émoji, zéro concurrent nommé (la référence non plus), aucune mention d'IA, aucune photo ni nom de fondateur sur le site, « 1 500+ » intouché, prix 1,99 €/mois et 16,99 €/an intacts, tous les prix TTC.
- Règle d'or : jamais de contenu sous la barre en ligne ; tout texte neuf passe la relecture à l'aveugle (2 sur 3) ; écrits publics : `docs/copy/ton-alex.md`.
- Thomas veut le moins d'e-mails possible : aucun nouvel e-mail automatique dans ce chantier.
- Moins de juridique : @legal seulement si strictement nécessaire (notes libres) et jamais au prix d'alourdir un texte.
- Pre-commit : commandes du §5.1 critère 14 ; Jest 100 % ; clôture = CI verte.
- Contenu d'étapes, vannes, conseils, vidéos : jamais modifiés dans ce chantier.

### 5.5 Agents à mobiliser, par étape
@product-manager (cadrage, stories, questions) ; @ux (parcours, états, scénarios persona : Yanis, Sophie, Marc nommés) ; @design (barre, tableau de bord, carte de progression, étalons, relecture à l'aveugle jusqu'à 10/10, contraste mesuré) ; @copywriter (libellés, états vides, notifications, après étalons validés) ; @fullstack (code, tests, interrupteur) ; @data-analyst (plan de tags, mesure en base) ; @seo (non-régression des pages publiques, noindex) ; @qa (critères §5.1, E2E, captures) ; @legal (notes libres, seulement si besoin) ; @reviewer (revue croisée) ; @infrastructure (migrations, déploiement masqué puis activation sur go). Aucun agent custom n'est recommandé à ce stade ; un testeur-persona (Yanis, Sophie, Marc) pour le jour 1 serait envisagé au lot 7 seulement si les critères 15 à 20 ne suffisent pas.

Chaque prompt de sous-agent commence par : `ANTI-TIMEOUT : écris le fichier IMMÉDIATEMENT après lecture. Write d'abord, Edit ensuite.` (CLAUDE.md, commandement 3) ; ceux de @fullstack et @qa reprennent aussi la consigne d'environnement vide du §5.4.

## 6. Texte exact du message de lancement (à coller dans la session s24)

```
Session s24 : espace client Premium. Lis d'abord project-context.md, puis docs/espace-client/brief-espace-client-s24.md en entier (c'est le brief v2.1, il fait foi), docs/founder-preferences.md (lignes [CHOIX UTILISATEUR] non re-questionnables) et docs/marrant/playbook.md. Commence par le lot 0 : relis le code marqué [À VÉRIFIER], pose-moi les questions Q1 à Q12 dans l'ordre du §4 (Q7 est une annonce, pas une question) (Q1, Q3, Q11 d'abord) avec 3 options et une reco chacune (sans jargon), en marquant celles qui rouvrent une décision. Ne développe rien de l'espace avant mes réponses (seules exceptions : la mesure d'usage du lot 0, construite en local, dont le déploiement attend mon go écrit ; et les 3 rendus de barre de @design pour Q2, en local, interrupteur fermé, jamais déployés). Tout l'espace est construit inerte, aucun déploiement sans mon go écrit, avant/après en images sombres (320, 375, 768, 1280 px), retouche minimale hors du périmètre de l'espace. Builds, serveurs locaux, tsc, lint, Jest et Playwright en environnement vide (env -i, §5.4). Chaque prompt de sous-agent commence par la ligne ANTI-TIMEOUT (§5.5).
```

---
**Handoff : @orchestrator (session s24)**
- Fichier produit : `/home/user/Marrant/docs/espace-client/brief-espace-client-s24.md` (v2)
- Décisions prises : zone séparée noindex derrière interrupteur inerte, redirection 307, réutilisation de `lib/progression.ts` sans nouvelle règle d'XP, page parcours enrichie à la même URL, sous-barre à 6 entrées sur les URL existantes (sous réserve de Q11), thème sombre et composants `ui/` imposés, mesure déployée active 14 jours avant, activation en deux jalons
- Points d'attention : Q6 B (décision du 25/10) et Q5b A (avis C13) exigent l'accord écrit de Thomas ; Q7 est une annonce ; Q11 A modifie l'aspect de pages publiques pour l'abonné ; dénominateur « 4 », durée du premier pas, `getPathXpTotal` vs `totalParcoursXp` à vérifier au lot 0

## Journal v1 vers v2 (correction / source)

| # | Correction appliquée | Source |
|---|---|---|
| 1 | Résumé de 10 lignes pour Thomas en tête | Consigne de relecture |
| 2 | §2.6 ligne XP : barre et XP existent déjà, écart réel reformulé | UX C1 |
| 3 | Nombre d'étapes 3 à 6 (§2.6, §3.3, Q4), `parcoursWeeks` écarté, source `LearningPathStep` et `config/premium.ts` | UX C2 + reviewer O1 (fusion) |
| 4 | Page parcours abonné à la même URL, `parcours-detail.tsx` enrichi | UX C3 |
| 5 | Liste d'étapes : un seul bouton par ligne, « Fait » = statut | UX C4 |
| 6 | Règle de navigation (URL existantes, sous-barre rendue côté navigateur) | UX C5 |
| 7 | Max 6 entrées + « Plus », « Exercices et jeux » retirée de V1 | UX C6 |
| 8 | Q3 : trois précisions (un seul jeu de mots, 112 px, test étendu) | UX C7 |
| 9 | §3.2 : priorité d'affichage à 375 px | UX C8 |
| 10 | Q10 premier pas : une seule formulation, règle de priorité (returnTo, quiz, valeur), même pas dans succès, E0 et Aujourd'hui | UX C9 + growth O2 (fusion) |
| 11 | Q11 (en-tête abonné, barre sur pages publiques) et Q12 (Exercices et jeux) | UX C9 + reviewer O4 (fusion Q11) |
| 12 | Critère 8 remplacé (liste d'écrans) ; critères 15 à 20 | UX C10, C11 |
| 13 | D1 contraintes de design (§5.4), D2 composants (§3.9), D3 hiérarchie des boutons (§3.3), D4 barre (§3.1), D5 cloche (§3.6) | Design D1 à D5 |
| 14 | Critères 21 à 27 (contraste, focus, hex, tailles, 320 px, reduced-motion, EmptyState) | Design D6 |
| 15 | Captures sombres 320, 375, 768, 1280, tous états, nommage et notation @design | Design D7 |
| 16 | Étalons visuels rendus avec les vrais tokens, avant le lot 1 | Design D8 |
| 17 | Fenêtre d'action en 3 moments (§1) | Growth O1 |
| 18 | Moment « aha » et premier pas (§3.2) | Growth O2 |
| 19 | Ordre de livraison : mesure active 14 jours avant, retouches de succès avant, activation en deux jalons (lots 7 et 8 adaptés) | Growth O3 |
| 20 | Règles de lecture des mesures (§5.2) | Growth O4 |
| 21 | États de compte (§3.8) | Growth O5 |
| 22 | Liens des e-mails approuvés protégés (fusionné au critère 18) | Growth O6 + UX C10 (18) |
| 23 | Économie de l'abonnement (§1) | Growth O7 |
| 24 | `env -i` replacé : builds, serveurs et tests locaux, pas déploiement ; consigne dans chaque prompt @fullstack et @qa | Reviewer O2 |
| 25 | Commentaire attribué à `header.tsx`, test figé à 7 onglets et 3 entrées, en-tête à 7 onglets | Reviewer O3 |
| 26 | Lot 0 : reprise du bloc B du plan d'onboarding, pas de seconde mesure ; message §6 aligné (exception de la mesure) | Reviewer O5 |
| 27 | Facteur confondant du 08/11 (§5.2) et premier pas identique à E0 | Reviewer O6 |
| 28 | Q7 : annonce, options rouvrant le 05/10 retirées ; §3.8 aligné | Reviewer O7 |
| 29 | ANTI-TIMEOUT dans chaque prompt de sous-agent | Reviewer O8 |
| 30 | Q1 : redirection 307 temporaire | Reviewer O9 |
| 31 | Ordre des questions et étalons avant tout brief @copywriter | Reviewer O10 |
| 32 | Marquages « rouvre la décision du 25/10 » (Q6 B) et « contredit l'avis C13 » (Q5b A), accord écrit requis | Consigne de relecture |

Arbitrages (conflits entre revues, option la plus prudente pour l'abonné et les règles de Thomas) :
- 307 (reviewer O9) l'emporte sur 308 (UX critère 18, growth O6) : réversible ; le fragment est conservé par le navigateur, testé au critère 18.
- « Fait » : statut (UX C4) l'emporte sur le bouton `outline` de D3 tant que Q5 = A, pour ne pas promettre un clic qui ne valide pas.
- Barre sur les pages publiques : B (rien de visible hors de l'espace) par défaut tant que Thomas n'a pas répondu à Q11 (reviewer O4 contre UX C5 / Q11 A).
- Référence de mesure : abonnés entrés après le 08/11 des deux côtés ET mesure active 14 jours (reviewer O6 + growth O4) ; en cas d'effectif insuffisant, lecture cas par cas.
- Mesure : construite sans attendre les réponses (reviewer O5), déployée seule, active, sur go écrit, au moins 14 jours avant l'activation (growth O3).
- Premier pas : E0 (approuvé le 07/11) ne nomme aucune étape ; le premier pas nommé vit dans la page de succès et Aujourd'hui, E0 n'est pas modifié (reviewer O6 v1 corrigé par reviewer v2 R1).
- `getPathXpTotal` (reviewer) et `totalParcoursXp` (UX) existent peut-être tous deux : à trancher au lot 0 .
- Q1 : la reco « la barre propre ne se mélange pas au site public » est reformulée en « écrans neufs dans une zone propre », pour rester cohérente avec Q11.

## Journal v2 vers v2.1 (correction / source : `docs/espace-client/revues/reviewer-v2.md`)

| # | Correction appliquée | Source |
|---|---|---|
| 1 | Premier pas : E0 ne nomme aucune étape, le pas nommé vit dans la page de succès et Aujourd'hui (§3.2 bloc 2 et « aha », Q10, arbitrage) | Reviewer v2 R1 |
| 2 | Q11 : barre décrite pour A et pour B (résumé ligne 1, §3.1, Q3 précision 1) | Reviewer v2 R2 |
| 3 | Mot « profil » : puce au §2.2 (15 textes validés), entrée « Mon profil » conservée, reco de Q2 complétée | Reviewer v2 R3 |
| 4 | Q5b A : marquage « rouvre la décision du 07/10 » au format du §4 | Reviewer v2 R4 |
| 5 | Résumé ligne 5 : Q11 A et phrase de `/abonnement` ajoutées aux accords écrits requis | Reviewer v2 R4 |
| 6 | Message de lancement §6 : 3 rendus de barre de Q2 autorisés, Q7 précisée comme annonce | Reviewer v2 R5 |
