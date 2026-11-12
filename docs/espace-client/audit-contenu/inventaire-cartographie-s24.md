# Audit de contenu s24 : inventaire, cartographie, découpage en fiches, trous et doublons

> Auteur : @product-manager, 12/11/2026. Périmètre : INVENTAIRE et CARTOGRAPHIE factuels. Aucun format nouveau n'est détaillé ici (c'est le travail de @creative-strategy, en parallèle). Aucun fichier de `apps/` modifié.
> Demande de Thomas (12/11, `docs/founder-preferences.md` dernière ligne) : « Regarde bien le screenshot. Y a plein d'autres contenus à créer. Le vocabulaire. Et des trucs à inventer. C'est des leçons. On peut faire quelle réponse dans quelle situation etc. Y a un gros audit à faire avant. »
> La capture de référence n'est pas nommée ici : inspiration de STRUCTURE seulement (site d'apprentissage d'une langue : rubriques, parcours par niveau, fiches « Voir / Fait »).

## 0. Méthode et limites (à lire avant les chiffres)

- Outils de la rédaction initiale : lecture de fichiers sans shell ni grep. Les nombres étaient (L) lus, (C) calculés par la longueur des fichiers, ou (D) documentés. Depuis, la section 6 donne les valeurs recomptées le 12/11 (production et seeds) : elles PRIMENT sur tout chiffre antérieur du corps. Les seuls « ≈ » restants sont signalés « écart restant » (quiz d'étapes, points clés vidéo).
- Production : valeurs du 12/11 via `/api/content-stats` (vannes, conseils, vidéos).
- Aucune inférence sur la validation à l'aveugle : « relu » n'est écrit que si un document de projet le dit.

## 1. Inventaire du contenu existant

### 1.1 Tableau d'ensemble (une ligne par type de contenu)

| Contenu | Volume | Format et longueur type | Gratuit / Premium | Validation (selon les docs) | Où ça s'affiche | Source |
|---|---|---|---|---|---|---|
| Vannes (catalogue) | Production : 149 actives au 12/11 (section 6, `/api/content-stats`) ; valeurs antérieures périmées : 132 au 11/10, 125 « GARDER » au 01/10, 124 jours planifiés au 18/10. Seed : `blagues-seed.json` = 80 entrées (section 6, ids non contigus, id max 345). Décryptages : 264 entrées dans `joke-decryptages.json` (voir 6.1) | Amorce + chute, 1 à 2 phrases (règle : moins de 40 mots, idéal moins de 20) ; + décryptage « Pourquoi ça marche » (`comedyTechnique`, `techniqueExplanation`) + « À toi de jouer » (`howToApply`) | Liste visiteur limitée à 10 (`FREE_JOKE_LIMIT`) ; fiches `/vannes/[slug]` publiques (SEO) ; « À toi de jouer » réservé Premium (`champs-premium.ts`) | Catalogue tri « GARDER » après audit s14 ; les vannes de parcours sont protégées de la relecture IA (s19). Validation à l'aveugle propre à chaque lot (ex. Boulot : 10 neuves validées en 6 tours) | `/vannes`, `/vannes/[slug]`, `/vannes/theme/[slug]`, contenu du jour, étapes de parcours, lettres | `docs/content/vannes-actives-s19.json` (méta), `blagues-seed.json`, `project-context.md`, `docs/marrant/inventaire-trous-s14.md` |
| Conseils | Seed : `conseils-seed.json` 38 entrées (section 6), id max 82. Production : 120 actifs au 12/11 (section 6) ; le « 400 » de `project-context.md` (29/09) est périmé | Titre + texte de 90 à 150 mots + exemple + « DÉFI … » (exercice 40 à 120 mots) ; catégories TIMING, AUTODERISION, OBSERVATION, REPARTIE, STORYTELLING… ; difficulté DEBUTANT / INTERMEDIAIRE | Liste visiteur limitée à 3 (`FREE_TIP_LIMIT`) ; exercice jamais envoyé hors Premium | Boulot : 6 conseils validés à l'aveugle (2 sur 2 ou 2 sur 3) ; Storytelling : étalons itérés 5 tours | `/conseils`, `/conseils/[slug]`, étapes de parcours (1 conseil par étape) | `docs/content/conseils-seed.json`, `boulot-base-s19.json` (méta), `lib/champs-premium.ts` (brief §2.5) |
| Vidéos | 89 actives en production au 12/11 (section 6 ; cohérent avec `videosActivesTotal` 89 et le seed de 1 620 lignes) | Fiche : description de 50 à 80 mots + 4 « points clés » (`learnings`, « TECHNIQUE DU … ») + 1 « DÉFI … » ; vidéo YouTube de 5 à 8 min (exemples lus : 8:12, 5:51, 6:45, 6:30) | Liste visiteur limitée à 3 ; points clés et exercice Premium | 89 fiches sur 89 au nouveau texte s11/s20 (duel à l'aveugle 14/14, 3 relecteurs) ; 89/89 durées corrigées le 13/10 (API YouTube) ; légendes Répartie de Rollman et Haroun « non vérifiées » (note du 13/10) | `/videos`, `/videos/[slug]`, étapes de parcours (2 par étape) | `docs/content/videos-seed.json`, `project-context.md` (13/10) |
| Parcours | 5 parcours, 25 étapes (3 + 4 + 6 + 6 + 6, `PREMIUM_PARCOURS`, `config/premium.ts`) | Voir 1.2 | Étape 1 de chaque parcours gratuite (`free: true`), étapes 2+ Premium ; toutes ouvertes d'un coup en Premium (choix 18/10) | Machine à Café, Répartie, Confiance : refonte s17 ; Storytelling : 5 tours reviewer et ux jusqu'à 10/10 ; Boulot : étapes 2 à 6 reviewer 9, ux 9, activé le 11/10 après visionnage par Thomas ; PS de l'étape 2 de Boulot jugé sous la barre puis exception décidée par Thomas (choix 7 = a) | `/parcours`, `/parcours/[slug]`, `#etape-N` | `config/premium.ts`, `docs/content/parcours-seed.json`, `parcours-boulot-s19.json`, `parcours-storytelling-s18.json`, `parcours-reecriture-s17.json` |
| Carnet mensuel | 2 mois en code : octobre 15 fiches, novembre 30 fiches, soit 45 (section 6 ; cohérent avec le brief « 15 fiches le 1er mois puis 30 ») | Fiche d'environ 100 mots : `titre`, `contexte`, `situation`, `onTeDit`, `reponse`, `pourquoi`, `siTendu`, `exercice` (+ `accroche` en novembre). Format = « une situation, une phrase qu'on te dit, une réplique, pourquoi ça marche, une sortie polie si tendu, un exercice à voix haute » | Premium ; extrait partiellement visible des visiteurs ([CHOIX UTILISATEUR] 05/10, à vérifier au lot 0) | Octobre : ≈ 180 candidates, relecture à l'aveugle demandée (note 18/10) mais résultat NON lu dans les documents ouverts ; novembre : brouillon du 18/10 déclaré « rien n'est validé » ; l'état de validation final est [À VÉRIFIER] | `/carnet`, `/carnet/[mois]` | `apps/web/src/data/carnet/2026-10.json`, `2026-11.json`, `project-context.md` (18/10) |
| Lettre du mois (gratuite) | 6 numéros VALIDE (nov. 2026 à avril 2027) (D, s22) | E-mail de 600 à 900 mots (≈, lu sur n°1 à n°3) : une situation vécue, trois répliques « la sûre / la joueuse / la risquée », « Comment choisir », « L'erreur que tout le monde fait », « À essayer cette semaine », un article lié, une étape de parcours liée, un PS d'invitation Premium | Gratuite (inscrits + comptes) ; version Premium sans invitation | 22 lettres (6 + 16) réécrites, barre 9/10, double relecture à l'aveugle, APPROUVÉES par Thomas en session ; toute modification efface l'approbation | E-mail ; page `/lettre` (formulaire, noindex) [À VÉRIFIER : ce qu'un abonné y voit] | `apps/web/src/data/lettre/numeros.json`, `project-context.md` (28/10) |
| Lettres réservées Premium (hebdo, jeudi) | 16 numéros (section 6), semaines 2026-W46 à 2027 | Même longueur ; format variable : W46 = situation + 3 répliques (même gabarit que la mensuelle) ; W47 = « un passage » d'humoriste + une technique + 3 gestes + « À toi de jouer » (format décryptage) | Premium | Approuvées (idem ci-dessus) ; décryptages d'humoristes : sources vérifiées page ouverte | E-mail seulement | `apps/web/src/data/lettre/hebdo-premium.json` |
| Glossaire | 12 termes (L : liste complète de `lib/glossary.ts`) : Répartie, Timing, Autodérision, Punchline, Storytelling, One-liner, Observationnel, Setup, Callback, Escalade comique, Accusé de réception, Rebond sur mot-clé | Définition de 40 à 60 mots + lien « related » vers une page du site | Gratuit, public, indexé (DefinedTermList JSON-LD) | Figé dans le code (revu en PR) ; pas de relecture à l'aveugle documentée | `/glossaire` | `apps/web/src/lib/glossary.ts`, `glossaire/page.tsx` |
| Quiz d'humour | 12 questions, 5 profils (Observateur, Storyteller, Absurde, Punchlineur, Taquin) (L : `quiz-data.ts`) | 12 questions à choix, scores par profil ; résultat : titre, humoriste, force, conseil, parcours recommandé (`?src=quiz`) | Gratuit, sans inscription | Figé dans le code ; non documenté à l'aveugle | `/quiz-humour` (ISR 1 h), onboarding | `components/quiz/quiz-data.ts`, `quiz-humour/page.tsx` |
| `/anatomie-vanne` | 1 page : 3 composants (setup, pivot, punchline) + 4 questions de FAQ lues ; ≥ 4 vannes d'exemple (vannes 1 et 4 écrites pour l'occasion, 3/3 à l'aveugle, 13/10) | Page d'explication illustrée | Gratuit, public | Vannes 1 et 4 validées à l'aveugle ; le reste revu en PR | `/anatomie-vanne` | `anatomie-vanne/page.tsx`, `project-context.md` (13/10) |
| Articles du blog | 34 actifs en base (D, 29/09, `project-context.md`) ; 25 articles dans le code (D, audit s20) ; 94 pages indexées sur 414 au 12/10 (D) | Article de 1 000 à 1 500 mots (ex. article invité : 1 520 mots) avec FAQ | Gratuit, public (SEO) | Refonte s11 + corrections s20 : 166 remplacements, 24 articles, validés 2 sur 3 à l'aveugle ; 3 points éditoriaux restent à soumettre à Thomas | `/blog`, `/blog/[slug]` (menu : « Articles ») | `docs/qa/audit-articles-code-s20-partie-*.md`, `project-context.md` |
| Exercices des fiches | Un par vanne (« À toi de jouer »), un par conseil (« DÉFI … »), un par vidéo (« DÉFI … » + 4 points clés) ; agrégés par `/api/fiches/exercice` | Consigne de 40 à 120 mots, à faire seul ou avec un tiers, avec une variante « pas de réunion / pas d'occasion » sur les contenus Boulot | Premium seulement : `sansExerciceVanne`, `sansExerciceConseil`, `sansExerciceVideo` | Suit la validation de la fiche | Dans chaque fiche, étape de parcours, `/favoris` | `lib/champs-premium.ts`, brief s24 §2.5 |
| Quiz d'étapes | 1 quiz par étape : 25 quiz, 3 à 4 questions chacun d'après les étapes lues (Machine à Café étape 1 : 4 questions ; Boulot étapes 1 et 2 : 3 questions) ; total ≈ 75 à 100 questions [À COMPTER par script] | Question de mise en situation + 4 options + `correctIndex` + `explanation` | Étape 1 gratuite, étapes 2+ Premium | Suit la validation de l'étape | Dans l'étape ouverte (`step-quiz.tsx`) | `parcours-seed.json`, `parcours-boulot-s19.json` |
| Progression, XP, niveaux, série | 5 niveaux (NOVICE 0, APPRENTI 100, FARCEUR 500, COMIQUE 1 500, LEGENDE 5 000) ; XP d'étape 20 par défaut (`DEFAULT_STEP_XP`), souvent 50 / 75 / 100 ; bonus de fin de parcours 100 | Données `User.xp`, `level`, `streak`, `UserPathProgress` | Premium | Règles figées (s16-s17) | Profil, carte de parcours | brief s24 §2.3 ; `docs/content/progression-levels.md` (à comparer, voir 4.2) |
| Favoris, question à l'équipe | Favoris sans plafond Premium ; « Ta question à l'équipe » (interrupteur `true` dans le code, « en ligne » à la clôture s22) | Liste ; formulaire sans texte stocké | Premium | Textes validés (relecture à l'aveugle, s22) | `/favoris`, profil | brief s24 §2.1, §2.4 |

### 1.2 Parcours : composition réelle des étapes

Blocs lus dans une étape (type `Step`, `parcours-types.ts` ; seeds lus) : titre et scène « Ce que tu vas apprendre » (`moduleDetail`, 60 à 150 mots), « pourquoi » (`why`), 1 conseil (texte + exemple + défi), 5 vannes (`jokeContents`, avec décryptage), 2 vidéos (chacune avec une phrase « pourquoi / repère »), 1 quiz de 3 à 4 questions, XP d'étape (`moduleXp`), format affiché (`moduleFormat` : « Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. », identique sur les 4 étapes lues de Machine à Café et de Boulot). Storytelling ajoute des champs : durée affichée (`dureeTexte`), second défi titré (`exerciceSecondTitre`), phrase de protection (`exerciceProtection`).

| Parcours | Étapes | Rythme annoncé | Étapes lues (titre du conseil) | XP d'étape lus | Vannes (emplacements) | Vidéos (emplacements) | Quiz |
|---|---|---|---|---|---|---|---|
| Machine à Café | 3 | 15 min/semaine | 1 « L'humour à la machine à café » (gratuite, 4 questions) ; 2 « Lire le tempo du groupe » | 50, 75 ; étape 3 non lue : 100 si l'on retrouve le total 325 cité au brief §2.3 (225 + 100 de bonus) [HYPOTHÈSE de calcul] | 3 × 5 = 15 | 3 × 2 = 6 | 3 |
| Répartie | 4 | 20 min/semaine | étape 1 « Tes premières répliques » ; étape 3 « Retourner les piques avec le sourire » (titres cités par les lettres) | non lus | 4 × 5 = 20 [format non relu étape par étape] | 8 | 4 |
| Confiance | 6 | 20 min/semaine | étape 3 « L'œil de l'observateur » ; étape 4 « Être à l'aise en groupe » ; dernière étape : question sur « ton style » lue | non lus | 30 | 12 | 6 |
| Storytelling | 6 | 20 min/semaine | étape 1 « couper son anecdote au plus court » (lettre W47) | non lus | 30 [1 vanne sur 30 active au 08/10, les autres choisies parmi 127 actives] | 12 | 6 |
| Boulot | 6 | 15 min/semaine | 1 « Ce que raconte une salle de réunion » ; 2 « Le PS qui détend un mail sérieux » ; 3 « La vanne de couloir » ; 4 « L'afterwork » ; 5 « Survivre au networking » ; 6 « Le toast de soixante secondes » | 50, 75 ; suite non lue | 30 (L : 30 vannes finales dont 10 neuves validées et 9 du catalogue, 11 en ligne) | 12 emplacements, 10 vidéos distinctes visionnées par Thomas (11/10) | 6 (étapes 1 et 2 : 3 questions) |
| Total | 25 | | | | 125 | 50 | 25 quiz, ≈ 75 à 100 questions |

Constat de calibrage : une étape à 15 min/semaine contient 2 vidéos de 5 à 8 minutes (exemples lus : 5:51, 6:30, 6:45, 8:12) : les vidéos seules peuvent dépasser le rythme annoncé. La durée affichée est un engagement de temps que l'espace devra tenir fiche par fiche (voir 3.2).

### 1.3 Ce que la page parcours affiche déjà (brief §2.3, §3.3, lu)

Barre « x/N étapes complétées », XP gagnés et total (bonus compris), accordéon d'étapes avec ancre `#etape-N`, statut de validation lié à l'exercice et au quiz, bonus de fin 100 XP (`path-completion-card`, bilan de fin sans certificat, choix du 07/10), rythme doux (`NEXT_STEP_DELAY_DAYS = 7`, étape suivante « conseillée », jamais bloquée).

## 2. Cartographie des rubriques de la capture vers notre contenu

Légende : EXISTE (tel quel) / À RESTRUCTURER (le contenu existe, pas sous cette forme) / À CRÉER (rien chez nous) / SANS OBJET (justifié pour l'humour). Colonne « Qui tranche » : rappel que le format précis d'une rubrique à créer est du ressort de @creative-strategy, pas de cet audit.

| # | Rubrique de la capture | Statut | Équivalent chez nous (lu) | Écart / remarque | Source |
|---|---|---|---|---|---|
| 1 | Guides | À RESTRUCTURER | Articles du blog (25 dans le code, 34 en base au 29/09) et `/anatomie-vanne` ; conseils (« techniques ») | Les guides longs existent mais restent publics (SEO) et hors de l'espace ; l'espace n'a pas de « guide » en fiches courtes. Brief §3.1 : « Articles » reste public | `project-context.md`, brief §3.1 |
| 2 | Parcours (page d'un parcours : titre, « XP total », progression globale) | EXISTE | 5 parcours, barre x/N étapes, XP gagnés et total | Manque seulement XP et niveau globaux en tête et la vue des 5 parcours (brief §2.6) | `parcours-detail.tsx` (brief §2.3), `premium.ts` |
| 3 | Sous-parcours par niveau (« Débutant 1, 0/8 fiches », 9 sous-parcours, 36 fiches) | À CRÉER (si Thomas veut ce rendu) | Aucun niveau : un parcours = 3 à 6 étapes d'une semaine (brief Q4 : option A = pas d'invention) | La capture annonce 36 fiches et 9 sous-parcours pour un seul « niveau » ; chez nous, le plus gros parcours (6 étapes) donne 36 fiches avec le découpage de 3.1 option A | brief §3.3, Q4 |
| 4 | Liste numérotée de fiches avec « Voir » et « Fait ✓ » | À RESTRUCTURER | Accordéon d'étapes, validation = exercice ou quiz fait (XP, série) | Une étape = 1 grosse fiche ; la capture a une fiche par bloc court. Q5 option A : « Fait » reste un statut, pas un bouton | brief §3.3, Q5 |
| 5 | Leçon d'introduction (« COURS DÉBUTANT, vidéos 1, 2 et 3 ») | À RESTRUCTURER | Scène « Ce que tu vas apprendre » par étape (`moduleDetail`) ; aucune introduction au niveau du parcours | Pas d'introduction de parcours ni de « comment ça marche » | `parcours-seed.json` |
| 6 | Test de fin de section (« Test connaissances section A, exercice 1 ») | À CRÉER | Quiz d'étape (3 à 4 questions) ; bilan de fin de parcours sans certificat (07/10) | Aucun test de fin de parcours ni de bloc ; le quiz d'étape existe mais fait partie de l'étape | brief §3.4 ; `step-quiz.tsx` |
| 7 | L'atelier des mots | À RESTRUCTURER (partiel) | `/anatomie-vanne` (setup, pivot, punchline) ; « À toi de jouer » des vannes ; décryptages `comedyTechnique` | Pas d'atelier d'écriture guidée ; seulement des consignes isolées par fiche | `anatomie-vanne/page.tsx`, `vannes-actives-s19.json` |
| 8 | Grammaire | À RESTRUCTURER | Techniques de conseils par catégorie, « points clés » des vidéos (4 « TECHNIQUE DU … » par vidéo = ≈ 356 techniques écrites, C : 89 × 4) | La « grammaire de l'humour » existe de façon dispersée, jamais classée ni indexée par technique | `videos-seed.json`, `conseils-seed.json` |
| 9 | Vocabulaire | À RESTRUCTURER | Glossaire de 12 termes (public) ; noms de techniques de chaque décryptage (`comedyTechnique` : « La réponse trop honnête », « Le constat chiffré »…) | 12 termes seulement ; les noms de techniques existent par vanne mais ne forment aucune liste | `glossary.ts`, `vannes-actives-s19.json` |
| 10 | Expressions et proverbes | À RESTRUCTURER | Carnet (45 fiches « situation, ce qu'on te dit, réplique ») ; vannes ; lettres (22 situations avec 3 répliques) | Les répliques existent mais en e-mail et en carnet mensuel, jamais classées par situation | `carnet/*.json`, `lettre/*.json` |
| 11 | Apprendre, lire et écouter | À RESTRUCTURER | Vidéos (89, « écouter ») ; articles (« lire ») ; points clés | Pas de fiche « regarde et repère » courte : les vidéos viennent avec une phrase « pourquoi / repère » dans les étapes | `videos-seed.json`, `parcours-seed.json` |
| 12 | Exercices et jeux | À RESTRUCTURER | Quiz d'humour (12 questions), quiz d'étapes (≈ 75 à 100), exercices des fiches (vannes, conseils, vidéos) | Rubrique retirée de V1 sauf décision (brief Q12) ; aucun « jeu » au sens d'une mécanique de répétition | brief §3.1, Q12 |
| 13 | « Quelle réponse dans quelle situation » (demande verbale de Thomas, hors capture) | À RESTRUCTURER | Carnet (situation, ce qu'on te dit, réplique, pourquoi, si tendu, exercice) + lettres (situation + sûre / joueuse / risquée) | Le contenu existe en 2 formes proches ; il manque une entrée par situation et un classement (voir 4.1) | `carnet/2026-11.json`, `lettre/numeros.json` |
| 14 | Favoris | EXISTE | `/favoris`, `FavorisList`, favoris en base | Tel quel | brief §2.1, §3.7 |
| 15 | Mes notes | À CRÉER | Rien (`UserNote` à créer) ; question Q5b ouverte (texte libre contre phrase cadrée) | Risque RGPD si texte libre (avis @legal C13) | brief §3.5, Q5b |
| 16 | Ateliers | SANS OBJET | Rien, volontairement : le coaching en ligne à 99 € a été retiré du site le 13/10 (« coaching 99 € retiré »), fondateur solo | Si « ateliers » = sessions en direct, c'est une offre qui n'existe pas ; si « ateliers » = exercices pratiques, voir lignes 7 et 12 | `project-context.md` (13/10) |
| 17 | Écrire au coach (« Écrire à … ») | EXISTE | « Ta question à l'équipe » (`/api/question-equipe`, réponse par e-mail sous 1 à 2 jours ouvrés) ; libellé validé « Écrire à l'équipe » | À sortir du profil vers la barre ; aucune réponse affichée dans l'espace (Q6) | brief §2.4, §3.7 |
| 18 | XP total | EXISTE | `User.xp`, niveaux NOVICE à LEGENDE | À afficher en tête de l'espace | `lib/progression.ts` (brief §2.3) |
| 19 | Progression globale (barre en pourcentage) | EXISTE | Barre x/N par parcours ; absente à l'échelle des 5 parcours | Vue « Ma progression » à construire (lot 2) | brief §3.4 |
| 20 | Cloche de notifications | À CRÉER | Rien (`PushToken` sert l'app iPhone) | Sources existantes : lettre du jeudi, carnet, étape conseillée | brief §3.6 |
| 21 | Identité du membre, identifiant chiffré | SANS OBJET (identifiant) | Prénom (`prenom-card.tsx`) ; l'identifiant chiffré n'est jamais repris | Décision du brief | brief §2.6 |
| 22 | Réglages, déconnexion | EXISTE | Profil, abonnement, menu de compte | « Mon profil » garde son adresse (Thomas 12/11) | `founder-preferences.md` 12/11 |
| 23 | Pastilles « nouveau » sur les rubriques | À CRÉER | Rien | Passent par la cloche seulement | brief §2.6 |

Bilan des 23 lignes : 6 EXISTE (2, 14, 17, 18, 19, 22), 10 À RESTRUCTURER (1, 4, 5, 7, 8, 9, 10, 11, 12, 13), 5 À CRÉER (3, 6, 15, 20, 23), 2 SANS OBJET (16, 21). Lecture : presque tout le fond existe déjà ; ce qui manque est surtout la FORME (fiches courtes, classement, entrées par situation, test de fin) et 3 mécaniques (notes, cloche, test de fin).

## 3. Découpage des parcours en fiches « Voir / Fait »

### 3.1 Trois découpages possibles d'une étape en ses blocs réels (comptage, pas proposition de format)

Les durées par fiche sont des ESTIMATIONS de lecture [HYPOTHÈSE : ≈ 200 mots/minute, vidéos aux durées lues dans les fiches, défi = temps de pratique à lire dans la consigne] à valider par un essai chronométré avec un lecteur. Seules les durées de vidéo (5 à 8 min) sont lues.

| Découpage | Fiches par étape | Détail | Durée estimée de l'étape |
|---|---|---|---|
| A : un bloc = une fiche, scène fondue dans le conseil | 6 | conseil (≈ 2 min), défi (≈ 4 min), vannes ×5 réunies (≈ 2 min), vidéo 1 (≈ 7 min), vidéo 2 (≈ 7 min), quiz (≈ 2 min) | ≈ 24 min |
| B : A + scène d'introduction à part | 7 | + scène « Ce que tu vas apprendre » (≈ 1 min) | ≈ 25 min |
| C : une vanne = une fiche | 11 | scène, conseil, défi, 5 vannes (≈ 1 min chacune), 2 vidéos, quiz | ≈ 25 min |

Constat : dans les 3 découpages, l'étape dépasse les 15 à 20 minutes par semaine promises (`timePerWeek`), surtout à cause des 2 vidéos. Ce n'est pas un défaut du découpage : c'est déjà vrai pour l'étape actuelle. Thomas devra arbitrer entre garder la promesse (vidéos facultatives ? une seule vidéo ?) et corriger le rythme annoncé (décision de contenu, donc P0 : pas de modification sans son accord).

### 3.2 Total de fiches par parcours

| Parcours | Étapes | Découpage A (6) | Découpage B (7) | Découpage C (11) |
|---|---|---|---|---|
| Machine à Café | 3 | 18 | 21 | 33 |
| Répartie | 4 | 24 | 28 | 44 |
| Confiance | 6 | 36 | 42 | 66 |
| Storytelling | 6 | 36 | 42 | 66 |
| Boulot | 6 | 36 | 42 | 66 |
| Total | 25 | 150 | 175 | 275 |

Repère de la capture : « 36 fiches, 9 sous-parcours » pour un parcours, soit environ 4 fiches par sous-parcours en moyenne (le premier sous-parcours affiche 8 fiches, dont une leçon d'introduction et un test final). Un parcours de 6 étapes en découpage A fait aussi 36 fiches : la taille du parcours est comparable, la structure ne l'est pas (6 grosses étapes contre 9 sous-parcours). Cette comparaison ne vaut que pour l'ordre de grandeur.

### 3.3 Ce qui manque pour qu'un parcours ressemble à « Débutant 1, 0/8 fiches »

| Manque | Existe aujourd'hui ? | Source |
|---|---|---|
| Une fiche d'introduction au niveau du parcours (« comment ça marche », ce qu'on saura faire) | Non : seulement la scène de chaque étape et la description du parcours (`description`, `testimonial`, `personaTagline`) | `parcours-seed.json` |
| Un test de fin de section (exercice de synthèse sur plusieurs fiches) | Non : un quiz par étape ; le bilan de fin de parcours est une carte sans test | `step-quiz.tsx`, `path-completion-card` |
| Un compteur « n/N fiches » par bloc | Non : le compteur actuel est « x/N étapes » | `parcours-detail.tsx` |
| Un statut « Fait » par fiche | Non : la validation est enregistrée par étape (`UserPathStepCompletion`, unique par utilisateur, parcours, étape). Marquer 6 ou 7 fiches par étape demande un enregistrement par fiche, donc une décision sur l'XP et la série (Q5, [CHOIX UTILISATEUR] du 07/10 : la série est comptée sur la PRATIQUE) | brief §2.3, Q5 |
| Des titres de fiche courts et numérotés | Non : les blocs n'ont pas de titre propre (le conseil a un titre, les vannes et vidéos non). Les 125 vannes d'étape et 50 emplacements de vidéo n'ont pas de titre de fiche | `parcours-types.ts` |
| Une durée affichée par fiche | Partiel : `timePerWeek` par parcours, `dureeTexte` pour Storytelling seulement | `parcours-types.ts` |
| Une couverture 100 % égale des 5 parcours | Non : Storytelling a un second défi et une protection ; Boulot a « Version sans risque » et « Aller au défi » | `parcours-types.ts`, project-context 11/10 |
| Un niveau (Débutant / Intermédiaire) | Non (Q4 : ne pas inventer) ; seule `difficulty` du parcours existe | brief Q4 |

## 4. Trous et doublons

### 4.1 Doublons constatés (ce qui existe plusieurs fois)

| # | Doublon | Où | Remarque |
|---|---|---|---|
| D1 | « Quelle réponse dans quelle situation » existe sous 3 formes : carnet (1 réplique, une sortie polie), lettre (3 répliques graduées, « Comment choisir »), conseil « La répartie en 3 temps » (méthode) | `carnet/*.json` (45 fiches), `lettre/*.json` (22), `conseils-seed.json` id 4 | Le fond est le même, les formes diffèrent : une seule réplique contre trois niveaux de risque. Le dédoublonnage ne doit pas supprimer l'une des deux (lettres approuvées) |
| D2 | Glossaire (12 termes) contre noms de techniques des décryptages (`comedyTechnique`) contre « TECHNIQUE DU … » des points clés vidéo (≈ 356 lignes) contre `/anatomie-vanne` (setup, pivot, punchline) | `glossary.ts`, `vannes-actives-s19.json`, `videos-seed.json`, `anatomie-vanne/page.tsx` | « Setup » et « Punchline » sont définis au glossaire ET dans `/anatomie-vanne` ; « Rebond sur mot-clé », « Escalade comique », « Accusé de réception » sont aussi des techniques de conseils. Aucune liste unique du vocabulaire |
| D3 | Vannes de parcours reprises du catalogue | Boulot (9 vannes du catalogue sur décision du 11/10), Machine à Café (ex. « Je suis nul en small talk… » à la fois étape 1 et export des actives) | Une même vanne peut s'afficher dans une étape, le catalogue et une lettre : à ne pas compter deux fois dans le volume neuf |
| D4 | Vidéos réutilisées dans plusieurs étapes | Vérino « Le distributeur de baguettes » (Boulot étape 1 ; fiche vidéo lue : exercice « Œil neuf ») | Boulot : 12 emplacements pour 10 vidéos distinctes |
| D5 | Exercices de vanne, de conseil et de vidéo : trois formes de « DÉFI » | `howToApply`, `exercise` | Même rôle, trois endroits, jamais agrégés (Q12) |
| D6 | Libellés de la lettre et du carnet qui mènent à une étape de parcours | lettres : lien `#etape-N` | Les lettres dépendent de l'ordre des étapes : toute réorganisation des étapes casse ces liens et ces textes approuvés |

### 4.2 Trous (ce qui manque ou est incohérent)

| # | Trou | Constat | Source |
|---|---|---|---|
| T1 | Chiffres de contenu périmés dans `project-context.md` | Il dit « 3 parcours », « ~602 vannes », « 400 conseils » (mesure prod du 29/09) ; valeurs du 12/11 : 5 parcours, 149 vannes, 120 conseils, 89 vidéos actives (section 6). À corriger avant tout texte public chiffré | `project-context.md` l. 82, `vannes-actives-s19.json` |
| T2 | `docs/content/progression-levels.md` documente d'autres gains d'XP (lire une blague +2, conseil +10, exercice +25, badges, séries) que le brief (XP d'étape 20 par défaut, bonus 100) | Source probablement obsolète ; le code fait foi. [À VÉRIFIER : quels gains existent dans `lib/progression.ts`] | `progression-levels.md`, brief §2.3 |
| T3 | État de validation du carnet (octobre, novembre) non documenté dans les pièces lues | Le brouillon de novembre est noté « rien n'est validé » le 18/10 ; il est en code (30 fiches). Ne pas s'appuyer dessus comme « validé » avant vérification | `project-context.md` 18/10 |
| T4 | Aucun chiffre d'usage du contenu | La résiliation s23 note « aucun usage » = aucune action enregistrée en base ; lire une vanne ou une vidéo ne laisse aucune trace. On ne sait pas quels contenus sont lus | brief §1 |
| T5 | Vidéos : légendes Répartie de Rollman et Haroun « non vérifiées » (13/10) ; durées corrigées mais 2 vidéos (Ngijol, Bun Hay Mean) à visionner en version officielle | À lever avant de bâtir des fiches vidéo sur ces vidéos | `project-context.md` 13/10 |
| T6 | Pas de classement du contenu par situation (soirée, bureau, famille, rencard…) | Le champ `contexte` existe dans le carnet (valeur « quotidien » lue) ; les vannes ont une `category` thématique ; aucun classement par situation transverse | `carnet/2026-11.json` |
| T7 | Calendrier : fin du stock quotidien le 31/12 sans alerte (lot T1 2027 à poser avant le 15/12) | Concerne le catalogue du jour, pas l'espace, mais l'espace réutilise le contenu du jour | `inventaire-trous-s14.md` |
| T8 | Aucun gabarit commun aux 5 parcours pour la « fiche courte » | Les 5 parcours ne partagent pas tous les mêmes champs (Storytelling, Boulot) | `parcours-types.ts` |

### 4.3 Contenu réutilisable tel quel

- Les 25 conseils d'étape, leurs exemples et défis (étalons validés pour Boulot et Storytelling).
- Les 89 fiches vidéo au nouveau texte (86 puis 89 sur 89 au 13/10) et leurs 4 points clés chacune, comme matière de fiches « regarde et repère ».
- Les décryptages de vannes (« Pourquoi ça marche ») pour toute fiche de technique.
- Le carnet (45 fiches) et les lettres (22 situations) comme matière de « quelle réponse dans quelle situation » : le contenu est déjà écrit au gabarit situation + réplique + pourquoi + sortie polie.
- Le glossaire (12 termes), les 12 questions du quiz d'humour, `/anatomie-vanne`.

### 4.4 Contenu à ne pas toucher (règle d'or P0 s18 : rien sous la barre en ligne ; textes approuvés)

- Les 22 lettres (6 mensuelles + 16 réservées) : approuvées par Thomas en session, toute modification efface l'approbation et revient à lui.
- Les e-mails d'onboarding E0, E1, E1b, E2 (approuvés les 07/11 et 08/11) et la page d'arrêt : `TEXTES_ARRET_ONBOARDING`.
- Les fiches vidéo (14/14 au duel à l'aveugle) et les articles corrigés s11 / s20 (relus 2 sur 3).
- Les étalons des parcours Storytelling et Boulot, dont le PS de l'étape 2 de Boulot (exception décidée par Thomas, limitée à ce PS).
- Les vannes de parcours (protégées de la relecture IA) et le garde-fou `catalogue-content` (seed refusé sur base non vide).
- Les textes de résiliation, rétractation, pied de page, « Ta question à l'équipe » (règles du 25/10).
- Le nom « Mon profil » (au moins 15 textes validés disent « depuis ton profil »).
- Un contenu NEUF créé pour l'espace devra passer la relecture à l'aveugle (2 relecteurs sur 3 au moins, barre 9/10) avant toute mise en ligne ; les parcours modifiés par le découpage aussi (rouvre la règle du brief §5.4, accord écrit donné le 12/11).

## 5. Questions ouvertes pour Thomas ou pour la suite

1. Le fond des 5 parcours doit-il rester IDENTIQUE (seul le découpage change) ou le découpage peut-il réécrire des textes ? Impact : le contrôle P0 s11 (diff réel, intouchables) ne s'applique que si le texte change.
2. Les vidéos restent-elles 2 par étape alors que l'étape annonce 15 à 20 min ? (3.1)
3. « Fait » par fiche : enregistrement par fiche sans XP, ou XP inchangé par étape ? (Q5 et série sur la pratique, 07/10)
4. Le carnet et les lettres : sont-ils la matière de « quelle réponse dans quelle situation » (réutiliser) ou source d'inspiration pour du contenu neuf ? (D1)
5. Production : levée le 12/11 (149 vannes, 120 conseils, 89 vidéos actives, section 6). Écart restant : nombre de questions de quiz d'étapes et de points clés vidéo (≈ 356 = 89 × 4, non recompté).
6. État de validation à l'aveugle du carnet d'octobre et de novembre (T3).

<!-- Fin du document. -->

## 6. Faits recomptés par la session (12/11/2026, remplacent les « ≈ »)

| Contenu | Valeur | Source |
|---|---|---|
| Vannes actives en production | 149 | `GET https://deviens-marrant.fr/api/content-stats` (public), 12/11 |
| Conseils actifs en production | 120 | idem |
| Vidéos actives en production | 89 | idem |
| Vannes du seed | 80 entrées | `docs/content/blagues-seed.json`, script |
| Conseils du seed | 38 entrées | `docs/content/conseils-seed.json`, script |
| Parcours du seed | 3 (Machine à Café, Répartie, Confiance ; Storytelling et Boulot hors de ce fichier) | `docs/content/parcours-seed.json` |
| Carnet | 15 fiches (2026-10) + 30 fiches (2026-11) | `apps/web/src/data/carnet/*.json` |
| Lettres | 6 du mois + 16 réservées | `apps/web/src/data/lettre/numeros.json`, `hebdo-premium.json` |
| Décryptages de vannes | 264 | `apps/web/src/data/joke-decryptages.json` |
| Glossaire | 12 termes | `apps/web/src/lib/glossary.ts` |

Les chiffres de `project-context.md` (« ~602 vannes, 400 conseils, 3 parcours ») sont périmés.

### 6.1 Pourquoi 264 décryptages pour 149 vannes actives

Constat lu : `joke-decryptages.json` est une liste d'objets à 4 champs (`content`, `comedyTechnique`, `techniqueExplanation`, `howToApply`), sans `id` ni indicateur d'activité (30 premières lignes lues) : les décryptages sont rattachés aux vannes par le texte `content`. Rien dans le fichier ne le restreint aux vannes actives.
Explication la plus probable [HYPOTHÈSE, non vérifiée en base] : le fichier couvre aussi des vannes INACTIVES ou retirées (le stock était de ~602 vannes au 29/09, puis trié à ~125 « GARDER » au 01/10 ; le lot a été appliqué sans IA par `applyJokeDecryptagesTask`, `docs/marrant/inventaire-trous-s14.md` §6). Un décryptage resté pour une vanne retirée n'est pas affiché. Autre cause possible : plusieurs entrées pour un même `content`. À vérifier : croiser les 264 `content` avec les 149 vannes actives (requête lecture seule) pour chiffrer décryptages orphelins et doublons. Écart restant jusque-là : ≈ 115 décryptages sans vanne active, non prouvé.
