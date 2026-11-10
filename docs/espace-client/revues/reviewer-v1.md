# Revue @reviewer v1 : brief espace client s24

> Livrable relu : `docs/espace-client/brief-espace-client-s24.md` (v1, 10/11/2026). Brief non modifié.
> Angle : exécutabilité et exactitude. Méthode : chaque fait sur le code vérifié par Read, Grep ou Glob le 10/11/2026 (fichier:ligne ci-dessous).

## Note globale : 7/10

Inventaire du code solide dans l'ensemble : environ 40 faits vérifiés, 1 faux qui compte (6 étapes par parcours) et 2 mal attribués. Les [HYPOTHÈSE] sont honnêtes et les [CHOIX UTILISATEUR] connus de l'auteur. Ce qui coûte des points : une consigne P0 mal recopiée (`env -i`), une question qui rouvre un [CHOIX UTILISATEUR], un lot 0 qui contredit le message de lancement et refait un bloc déjà prévu, une mesure avant/après faussée par l'onboarding ouvert le 08/11, et un trou d'architecture (la barre de l'espace sur des pages publiques que le brief déclare intouchables). Avec les 10 corrections obligatoires : 9/10.

| Axe | Note | Constat |
|---|---|---|
| 1. Exactitude des faits sur le code | 7 | Voir tableau de vérification. Faux : « 6 étapes par parcours ». Mal attribué : commentaire de budget (dans `header.tsx`, pas dans le test), `env -i` (commandes locales, pas de déploiement). Contraintes du test omises (7 onglets figés, menu à 3 entrées figé). |
| 2. Zéro invention, [HYPOTHÈSE] marquées | 9 | Chiffres tous sourcés (683, 0,26 s, 94/414, 89 vidéos, 12 questions, 12 comptes FREE au 25/10, prix du 24/10). Dénominateur « 4 » honnêtement marqué [À VÉRIFIER] (indice : `resiliations-s23-donnees.md:29` « 4 abonnés actifs »). |
| 3. Conformité au cadre | 6,5 | Pre-commit, interrupteur, avant/après, go écrit, zéro tiret cadratin, référence jamais nommée : OK. `env -i` mal placé ; ANTI-TIMEOUT absent des consignes aux sous-agents ; Q7 rouvre le [CHOIX UTILISATEUR] du 05/10 sans le signaler. |
| 4. Lancement §6 sans ambiguïté | 6 | « Ne développe rien avant mes réponses » contredit le lot 0 (mesure en base = code). Ordre questions / étalons rendus non défini (Q2 et Q3 dépendent d'étalons de barre « rendue »). |
| 5. Lots, critères, interrupteur, risques | 7,5 | Bon découpage et bons critères binaires. Manquent : lien avec le bloc B de l'onboarding (doublon), période « avant » de mesure, facteur confondant du 08/11, redirection 308 qui survit au retour arrière. |

## Vérification fait par fait (extraits significatifs)

| Fait du brief | Verdict | Évidence |
|---|---|---|
| Pages sous `apps/web/src/app/(dashboard)/` (profil, parcours, favoris, carnet, glossaire, quiz, lettre, abonnement, résiliation) | VRAI | Glob des `page.tsx` |
| `profil/page.tsx` : H1 « Mon profil », `ReprendreParcours src="profil"`, `ProfilDashboard`, `UpgradeToast`, noindex | VRAI | `profil/page.tsx:9,21,31,34` |
| `parcours/[slug]` ISR `revalidate = 3600`, `dynamicParams = true`, contenu complet via `/api/parcours/by-slug` | VRAI | `parcours/[slug]/page.tsx:12,34,35` |
| `STORYTELLING_PUBLIE`, `BOULOT_PUBLIE = true` | VRAI | `config/parcours-publication.ts:12,25` |
| `RESILIATION_PAGE_OUVERTE = false` | VRAI | `config/resiliation.ts:13` |
| `QUESTION_EQUIPE_OUVERTE` « [À VÉRIFIER] » | VRAI dans le code (`true`) | `config/question-equipe.ts:11` : écrire « `true` dans le code », seul l'état en production reste à vérifier |
| En-tête `sticky top-0 z-50`, `h-16`, Carnet après Parcours | VRAI | `header.tsx:65,132,133` |
| `header-budget.spec.ts` : 6 largeurs x 3 états, recherche >= 160 px | VRAI | `header-budget.spec.ts:20-22,149` (largeurs 1024 à 1920) |
| « Le commentaire du fichier dit qu'un onglet de plus doit trouver sa place… » | MAL ATTRIBUÉ | Ce commentaire est dans `header.tsx:47-50`, pas dans le test |
| Contraintes du test non citées | OMIS | `toHaveCount(7)` onglets (`spec:142`) ; menu figé `["Favoris", "Mon profil", "Déconnexion"]` (`spec:218`) |
| `account-menu.tsx` : Radix, 3 entrées | VRAI | `account-menu.tsx:24-53` |
| `XP_THRESHOLDS` 0/100/500/1500/5000, `DEFAULT_STEP_XP` 20, bonus 100, `NEXT_STEP_DELAY_DAYS` 7, `getPathXpTotal`, `effectiveStreak`, `recordPractice` | VRAI | `lib/progression.ts:16-39,60,80,105` |
| 325 XP Machine à Café (commentaire UX-05 c) | VRAI | `lib/progression.ts:59` |
| `User.xp`, `level`, `streak`, `lastPracticeAt` ; `UserPathProgress`, `UserPathStepCompletion` (unique), `UserPathStepFeedback` (3 valeurs, C13) | VRAI | `schema.prisma:65-71,292-341` |
| « Un parcours = 6 étapes », « 6 par parcours d'après `parcoursWeeks` » | FAUX | `config/premium.ts:77-85` : Machine à Café 3, Répartie 4, Confiance 6, Storytelling 6, Boulot 6 ; `parcoursWeeks` typé sur 3 slugs seulement (`premium.ts:91-94`) |
| Routes API citées (progress, quiz, retour, by-slug, user/*, favorites, question-equipe, subscription/*) | VRAI | Glob `app/api/**/route.ts` |
| Composants `parcours/`, `profil/`, `reprendre-parcours`, `daily-content`, `favoris-list` | VRAI | Glob `components/**` |
| `sansExerciceVanne/Conseil/Video` dans `/api/jokes`, `/api/tips`, `/api/videos` | VRAI | `api/jokes/route.ts:102`, `api/tips/route.ts:93`, `api/videos/route.ts:114` ; aussi `/api/favorites` et `/api/fiches/exercice` (non cités) |
| `buildLoginUrl`, `PREMIUM_DEFAULT_RETURN = "/parcours"` | VRAI | `lib/auth-links.ts:54`, `config/premium.ts:118` |
| `enableCacheInterception` | VRAI | `open-next.config.ts:48` |
| Migrations 16 et 17 additives | VRAI | `prisma/migrations/16_lettre_mois_comptes_s22`, `17_resiliation_motif_s23` |
| « Ta question à l'équipe » : rien en base, Reply-To du compte, alex@ | VRAI | `api/question-equipe/route.ts:3,14-16` ; founder-preferences l. 135-136 |
| « commandes de déploiement lancées avec `env -i` (consigne de Thomas) » | FAUX | `env -i` = builds, serveurs locaux et tests en environnement vide + variables factices CI (lessons-learned n°21, P0) ; jamais une consigne de déploiement |
| Pre-commit (critère 14) | VRAI | CLAUDE.md Marrant, ligne « Pre-commit code » |
| Aucun tiret cadratin, référence jamais nommée | VRAI | Grep `—` et nom du site de la capture : 0 résultat |

## Top 3 (impact)

1. **O1, nombre d'étapes faux** : il fausse Q4, la page parcours, la barre de progression (critère 6) et les étalons.
2. **O4, la barre sur les pages publiques** : sans arbitrage, le lot 3 est inexécutable (soit la barre disparaît, soit on touche des pages déclarées intouchables).
3. **O5 et O6, mesure** : sans période « avant » ni neutralisation de l'onboarding du 08/11, l'hypothèse centrale du §1 ne pourra pas être jugée.

## Corrections OBLIGATOIRES (texte exact)

**O1. §2.6, ligne « Sous-parcours par niveau », colonne « Chez nous aujourd'hui ».** Remplacer « Un parcours = 6 étapes (une par semaine), pas de niveaux » par :
« Un parcours = 3 à 6 étapes, une par semaine (Machine à Café 3, Répartie 4, Confiance 6, Storytelling 6, Boulot 6 : `PREMIUM_PARCOURS`, `config/premium.ts`), pas de niveaux »
Puis **§3.3, 3e puce** : remplacer « (6 par parcours d'après les semaines du seed ; `parcoursWeeks`) » par « (3 à 6 selon le parcours, nombre lu dans `LearningPathStep` ; ne pas utiliser `parcoursWeeks`, typé sur 3 slugs seulement) ». Puis **§3.3, 4e puce** : remplacer « (une étape par semaine) » par « (3 à 6 étapes, une par semaine) ». Puis **§4, Q4** : option A « une page = un parcours, ses 3 à 6 étapes (réalité) » ; option B « (ex. 3 + 3 pour les parcours de 6 étapes, sans objet pour Machine à Café) ».

**O2. §5.4, 3e puce.** Remplacer « procédure P0 à P8 et commandes de déploiement lancées avec `env -i` (consigne de Thomas ; forme exacte à relire dans `REPLIT_ACTIONS.md` [À VÉRIFIER]) » par :
« procédure P0 à P8 de `REPLIT_ACTIONS.md`, étapes adaptées à chaque mise en ligne (migration jouée par P1/P2 avant l'ouverture, comme la migration 17) ; tout build, serveur local, tsc, lint, Jest et Playwright lancés en environnement vide (`env -i` + variables factices du job `e2e-local` de `.github/workflows/tests.yml`), jamais avec l'environnement du shell (lessons-learned n°21, P0), et jamais `env` ni `printenv` sans filtre (n°17) ; consigne recopiée dans CHAQUE prompt @fullstack et @qa »

**O3. §2.2, 2e puce.** Remplacer « Le commentaire du fichier dit » par « Le commentaire de `header.tsx` (l. 47-50) dit », puis ajouter en fin de puce :
« Le test fige aussi exactement 7 onglets (`toHaveCount(7)`) et les 3 entrées du menu de compte dans cet ordre (« Favoris », « Mon profil », « Déconnexion ») : ajouter « Mon espace » ou renommer « Mon profil » casse ce test ; le mettre à jour dans le même commit, une fois le libellé validé par étalon (Q2). »
Et **§2.6, ligne 1** : « En-tête public à 6-7 onglets » devient « En-tête public à 7 onglets (6 + « La lettre » ou « Carnet ») ».

**O4. §4, ajouter une ligne Q10 après Q9** (et dans §3.1, sous le tableau : « Page cible publique = la barre de l'espace n'y existe pas aujourd'hui : voir Q10. ») :
« | Q10 | Entrée dans l'espace, et barre sur les rubriques qui sont des pages publiques (Vannes, Conseils, Vidéos, Carnet, Vocabulaire) | Entrée par le menu de compte ; pour l'abonné, la barre s'affiche aussi sur ces pages, rendue côté client seulement (HTML serveur identique, critère 11) | Les rubriques renvoient aux pages publiques telles quelles : la barre disparaît dès qu'on quitte l'espace | Copies des listes sous `/mon-espace/...` en noindex (doublons à faire valider par @seo) | A : la barre ne disparaît jamais et rien ne change pour Google ; B si Thomas veut zéro changement visible hors de l'espace | »

**O5. §5, tableau, lot 0, colonne Contenu.** Remplacer « mesure d'usage en base (les 6 événements de `resiliations-s23-analyse.md` §4 : … délais) » par :
« mesure d'usage en base : reprendre le bloc B de `docs/growth/onboarding-premium-s23-plan.md` (événements R3 et journal, non livré au 10/11 : aucun `first_premium_access` dans `src/`), jamais une seconde version ; construite inerte sans attendre les réponses de Thomas, puis déployée SEULE dès son go écrit, pour disposer d'une période « avant » »
Et **§6, message de lancement** : remplacer « et ne développe rien avant mes réponses » par « ne développe rien de l'espace avant mes réponses (seule exception : la mesure d'usage du lot 0, construite inerte ; son déploiement attend mon go écrit) ».

**O6. §5.2, ajouter une puce après « Contre-mesures ».**
« Facteur confondant : l'onboarding Premium (E0 à E2) est ouvert depuis le 08/11 (`ONBOARDING_PREMIUM_OUVERT = true`) et vise les mêmes causes (H1, H2). Toute comparaison avant/après porte sur des abonnés entrés après le 08/11 des deux côtés ; sinon l'effet de l'espace et celui des e-mails d'accueil sont indiscernables. »
Et **§3.2, bloc 2** : ajouter « Le premier pas proposé est celui de l'e-mail E0 (même étape, même formulation, sauf étalon contraire). »

**O7. §4, Q7 : rouvre le [CHOIX UTILISATEUR] du 05/10 sans le dire.** Remplacer la ligne par :
« | Q7 | Comptes sans abonnement (12 comptes FREE et anciens abonnés repassés en FREE) | Déjà tranché, [CHOIX UTILISATEUR] 05/10 : un compte non abonné a exactement ce qu'a un visiteur. Page de l'espace = redirection vers `/abonnement` avec retour ; favoris conservés en base et affichés comme aujourd'hui par `FavorisList` | (aucune : A et C rouvriraient un palier gratuit) | | À annoncer à Thomas, pas à lui poser | »
Et **§3.8, 3e puce** : remplacer « Les 12 comptes FREE historiques (conservés, aucune suppression sans GO) : que voient-ils ? Q7. » par « Les 12 comptes FREE et les anciens abonnés (plan remis à FREE par le webhook) : traités comme un visiteur ([CHOIX UTILISATEUR] 05/10), données conservées, aucune suppression sans GO. »

**O8. §5.5, ajouter en fin de section.**
« Chaque prompt de sous-agent commence par : `ANTI-TIMEOUT : écris le fichier IMMÉDIATEMENT après lecture. Write d'abord, Edit ensuite.` (CLAUDE.md, commandement 3) ; ceux de @fullstack et @qa reprennent aussi la consigne d'environnement vide du §5.4. »

**O9. §4, Q1, colonnes Option A et Reco.** Remplacer « (redirection 308) » et « ancien `/profil` redirigé » par « (redirection temporaire 307, côté serveur, seulement interrupteur ouvert) » et « ancien `/profil` redirigé en 307 : une 308 reste en cache dans les navigateurs et survivrait à un retour arrière de l'interrupteur ».

**O10. §4, paragraphe « Méthode », ajouter en fin.**
« Ordre : Q1, Q3 et Q10 d'abord (structure). Puis @design rend 3 variantes de barre en local, interrupteur fermé, captures 375 et 1280 px, montrées à Thomas pour Q2. Puis Q4 à Q9. Aucun brief @copywriter avant ces étalons. »

## Corrections souhaitables (une ligne chacune)

- §0 : compléter la lecture de la capture (pastilles de nouveauté sur les rubriques, engrenage de réglages, déconnexion, identifiant de membre) et dire lesquels on reprend.
- §2.1 : préciser `/carnet` partiellement visible des visiteurs (extrait, [CHOIX UTILISATEUR] 05/10 « carnet » dans les fonctions visiteur) au lieu de « Carnet mensuel Premium ».
- §2.5 : citer `/api/fiches/exercice` et `/api/favorites`, déjà filtrés, base naturelle de l'agrégation des exercices (lot 3).
- §3.6 : ajouter l'option sans table (notifications calculées à la volée + un seul champ « vu le »), plus légère qu'une table `Notification`.
- Q5 : préciser que les options B et C ne touchent jamais la série (D3, [CHOIX UTILISATEUR] 07/10).
- Critère 4 : aligner les largeurs sur le garde-fou existant (320, 360, 375, 414, 640, 768, 1024, 1100, 1280, 1440, 1536, 1920).
- Critères : ajouter navigation clavier de la barre (`aria-current`, focus visible) et « interrupteur fermé = aucune écriture en base » (notifications, notes).
- Lot 8 : nommer l'étape où les migrations `UserNote` et `Notification` sont jouées en production (P1/P2, avant l'ouverture).
- Périmètre : app iPhone (`apps/mobile`) hors périmètre explicite ; le build `BUILD_TARGET=mobile` doit rester vert.
- États vides et libellés : budget de mots chiffré et critère « lu en 3 secondes sur téléphone » (lessons-learned n°21 bis, P0).
- §6 : lire `project-context.md` avant le brief (CLAUDE.md n°1) et indiquer la branche de travail.

## Recommandation

**NO-GO en l'état, GO après O1 à O10** (corrections de texte seules, aucune refonte du brief). Agent à relancer : @product-manager, avec ce rapport ; re-vérification limitée aux 10 points.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/espace-client/revues/reviewer-v1.md`
- Décisions prises : 7/10, NO-GO tant que O1 à O10 ne sont pas intégrés ; brief non modifié
- Points d'attention : Q7 rouvre un [CHOIX UTILISATEUR] (05/10) ; `env -i` mal recopié (P0) ; doublon avec le bloc B de l'onboarding s23 ; nombre d'étapes faux
---
