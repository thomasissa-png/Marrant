# Audit parcours d'apprentissage s17 : technique et données (@fullstack)

> Session 17, 07/10/2026. Code lu : `79b11f3`. Prod : Cloudflare Workers `712ee919`, base Neon (lecture seule, transaction `readOnly`).
> Périmètre : C5 (fonctionnement et bugs), C11 (performance et technique), C9 (mesure), volet données de C1 et C12.
> Hors périmètre (audit s16) : connexion, achat, compte, e-mails, légal.
> Agrégats bruts : `/tmp/claude-0/-home-user-Marrant/bd072092-6ee5-586f-8f47-6fd05fa5f334/scratchpad/parcours-data.json`.
> Aucun code, contenu ni donnée modifiés. Aucun commit.

## 1. TL;DR

1. **Personne n'utilise les parcours** : depuis mars, la base ne compte qu'**une seule progression** (un compte gratuit, étape 1 de « Confiance », le 24/09) et **aucun parcours terminé**. Umami : 0 étape validée et 0 mur vu en 90 jours, 71 pages vues sur les pages parcours.
2. **Le mur de l'étape 2 ne s'affiche jamais à un visiteur.** Depuis la suppression du compte gratuit, un visiteur ne peut plus valider l'étape 1, donc l'étape 2 reste grisée avec « Termine l'étape 1 pour débloquer ». L'aperçu payant et sa mesure (`mur-vu`) ne sont visibles que dans les tests.
3. **Trois bugs touchent les abonnés** : « Parcours terminé ! » s'affiche au milieu de 2 parcours (4 étapes sur 13) ; une vidéo annoncée « Djimo » est en réalité une chronique de Thomas VDB sur le Bitcoin ; les « 5 vannes sélectionnées » de chaque étape ne sont jamais montrées (le lien mène au catalogue général).
4. **La gamification est en panne** : la série de jours (streak) n'avance qu'à la saisie du mot de passe (max 1 jour chez les 14 comptes) et le niveau ne bouge pas quand on valide une étape.
5. **La technique de base est saine** : les données en base suivent le fichier source (3 parcours, 13 étapes, 22 vidéos en ligne), le contenu payant ne sort pas du serveur (vérifié en prod), les pages sont en cache et le JavaScript reste sous 200 Ko.

## 2. Notes

| Critère | Note /10 | Preuve courte |
|---|---|---|
| C5 Fonctionnement et bugs | **5** | Contrôle d'accès serveur juste (403 en dessous de Premium, aperçu vérifié dans le HTML de prod) et 0 anomalie de données. Mais le mur de l'étape 2 est inaccessible (`parcours-detail.tsx:540-542`), un faux « Parcours terminé » s'affiche (`:757`), une vidéo est fausse, un abonné peut rester bloqué sur « Chargement… » (`:355`, `:646`), le streak et le niveau ne bougent pas |
| C11 Performance et technique | **7** | Cache ISR alimenté par la base (`x-nextjs-cache: HIT`, aucun id `seed-` en prod), 404 propre, JS compressé 176 Ko (`/parcours`) et 196 Ko (`/parcours/confiance`). Points faibles : pas d'`error.tsx` sur `/parcours`, aucun `loading.tsx`, logique du seed recopiée 3 fois, désaccord entre le schéma Prisma et la base sur les niveaux, Core Web Vitals non mesurés |
| C9 Mesure | **2** | 3 événements touchent les parcours, dont un qui ne peut pas se déclencher (`mur-vu` étape 2). Aucun événement pour le démarrage, la fin, le quiz d'orientation de `/parcours`, le clic « Commencer » ni le mur de validation de l'étape 1. Données réelles : 1 progression, 0 parcours terminé |
| C1 Quantité (volet données) | **7** | Base = seed : 3 parcours actifs, 3/4/6 étapes, 13 conseils actifs, 22/22 vidéos en base et en ligne. Mais 4 anciens parcours inactifs restent en base et l'étape 6 de « Confiance » demande 77 min de vidéo |
| C12 Promesse/réalité (volet données) | **4** | Promis mais absents : les vannes « sélectionnées pour ce module », le streak, le niveau. Faux : la vidéo Djimo, « Parcours terminé ! » au milieu d'un parcours, « Termine l'étape 1 pour débloquer » (impossible sans Premium), la difficulté « Intermédiaire » de « Confiance » dans les données Google (seed et base disent Expert). La durée « 20 min/semaine » est dépassée à l'étape 6 de « Confiance » |

## 3. Constats

Format : **Problème / Effet pour l'utilisateur / Ce qu'on fait**, puis le détail technique.

### P1

#### FS-01 (P1, C5/C7/C9) : le mur de l'étape 2 n'apparaît jamais à un visiteur

- **Problème** : un visiteur (ou un ancien compte gratuit) ne peut pas valider l'étape 1, qui est réservée à Premium depuis le 05/10. Or l'étape 2 ne s'ouvre qu'une fois l'étape 1 validée. Elle reste donc grisée avec un cadenas et le texte « Termine l'étape 1 pour débloquer ».
- **Effet pour l'utilisateur** : on lui demande de terminer une étape qu'il n'a pas le droit de terminer. Il ne voit jamais l'aperçu de l'étape 2 (« Ce que tu vas apprendre », format, bouton « S'abonner »), qui est pourtant le meilleur argument de vente du parcours. Les étapes 3 à 6 ne s'ouvrent pas non plus. Son seul chemin vers l'offre est le bouton « Voir l'offre Premium » en bas de l'étape 1.
- **Ce qu'on fait** : pour un non-abonné, ne plus appliquer le verrou « dans l'ordre ». Les étapes 2 et suivantes s'ouvrent sur l'aperçu payant, le texte « Termine l'étape 1 » est remplacé par « Avec Premium ». Le verrou dans l'ordre reste pour les abonnés. Agent : @fullstack (+ @copywriter pour le libellé). Effort : rapide.
- **Détail technique** : `components/parcours/parcours-detail.tsx:540-542` (`isSequentiallyLocked` calculé sans regarder le plan), `:613` (libellé), `:642` (`LockedStepPreview` n'est rendu que si l'étape est ouverte). Le test `__tests__/feature/parcours-detail.test.tsx:490` ne passe qu'avec une progression simulée (`progressAfterStep1`), un cas qui n'existe plus en vrai. Seul le compte gratuit qui a validé « Confiance » étape 1 le 24/09 peut encore voir ce mur.

#### FS-02 (P1, C5/C6) : « Parcours terminé ! » s'affiche au milieu d'un parcours

- **Problème** : le message de gain d'XP ajoute « Parcours terminé ! » dès que l'étape rapporte 100 XP ou plus. Or certaines étapes intermédiaires valent 100, 125 ou 150 XP.
- **Effet pour l'utilisateur** : un abonné qui valide l'étape 3 de « Répartie » (sur 4), ou les étapes 3, 4 ou 5 de « Confiance » (sur 6), lit « +100 XP gagnés ! Parcours terminé ! » alors qu'il lui reste des étapes. La carte de fin, elle, ne s'affiche pas : les deux messages se contredisent. 4 étapes sur 13 sont concernées.
- **Ce qu'on fait** : afficher « Parcours terminé » seulement quand le serveur répond `pathCompleted: true`. Agent : @fullstack. Effort : rapide.
- **Détail technique** : `parcours-detail.tsx:757` (`xpGained.xp >= 100`). Le serveur renvoie déjà `pathCompleted` (`api/parcours/[id]/progress/route.ts:184-197`). Valeurs du seed : répartie 50/75/**100**/150, confiance 50/75/**100**/**125**/**150**/200.

#### FS-03 (P1, C2/C12) : une vidéo payante ne montre pas ce qu'elle annonce

- **Problème** : à l'étape 3 de « Machine à Café », la carte vidéo annonce « Djimo, Quand il croise Carl Lewis ». Le lecteur affiche en réalité « Bitcoin, JPEG et blockchain, Thomas VDB se penche sur les concepts flous ! » (France Inter).
- **Effet pour l'utilisateur** : un abonné voit un autre humoriste et un autre sujet que ceux annoncés, sur l'étape « storytelling ». Il peut croire à un bug ou à une page bâclée.
- **Ce qu'on fait** : trouver la bonne vidéo Djimo (identifiant YouTube réel, vérifié) ou changer le texte de la carte pour décrire la vidéo de Thomas VDB, si elle sert la leçon. Agent : @copywriter (choix et texte) puis @fullstack (seed). Effort : rapide.
- **Détail technique** : `docs/content/parcours-seed.json`, étape `machine-a-cafe` semaine 3, `youtubeId 57Ip2k3us_8`. Vérifié par l'oEmbed YouTube (200) et dans `videos-seed.json` id 74 et la table `Video` (mêmes titre et chaîne). Pour les 21 autres vidéos, l'humoriste correspond. Les titres des vidéos Jamel Comedy Club sont génériques (« Saison 8 ») et je n'ai pas vérifié que le sujet annoncé (« Le mariage », « Le quotidien »…) correspond.

#### FS-04 (P1, C12/C2) : les « vannes à pratiquer » de chaque étape ne sont jamais montrées

- **Problème** : chaque étape affiche « 5 vannes sélectionnées pour ce module. Découvre-les dans le catalogue », mais le lien mène à la page `/vannes` générale. Les 62 vannes choisies pour les 13 étapes ne sont affichées nulle part.
- **Effet pour l'utilisateur** : l'abonné cherche « ses » 5 vannes dans un catalogue de plus de 600 et ne les trouve pas. La promesse « Conseil technique + vannes à pratiquer », affichée dans le format de chaque étape, n'est tenue qu'à moitié.
- **Ce qu'on fait** : afficher les vannes directement dans l'étape. Cela demande de relier les numéros du seed aux vannes en base, par leur texte comme le fait déjà le patch du catalogue. Il faut aussi remplacer les 3 numéros introuvables. Agent : @fullstack (affichage) + @copywriter (remplacements). Effort : moyen.
- **Détail technique** : `parcours-detail.tsx:244-258` (`JokeTeaser` : nombre et lien seulement). Les `jokeIds` du seed renvoient aux `id` de `blagues-seed.json`. Les ids **85, 82 et 180** n'y existent pas (repartie semaine 2, confiance semaine 4). La table `Joke` n'a pas d'identifiant numérique : le lien se ferait par `content`/`previousContent`.

#### FS-05 (P1, C6/C8/C12) : la série de jours (streak) ne compte que les connexions avec mot de passe

- **Problème** : le compteur de jours d'affilée n'est mis à jour qu'au moment de la connexion. La session dure 30 jours : un utilisateur qui revient chaque jour sans se reconnecter reste à 1.
- **Effet pour l'utilisateur** : le streak, mis en avant comme moteur de motivation (« progression gamifiée : XP, streak, niveaux »), ne progresse jamais. Mesure : **max 1 jour** sur les 14 comptes.
- **Ce qu'on fait** : faire compter le streak quand l'abonné valide une étape ou lit un conseil (une action d'apprentissage), en heure de Paris, et non à la connexion. Agent : @fullstack. Effort : rapide.
- **Détail technique** : `lib/auth.ts:107-150` (`updateStreak`), appelé seulement depuis `jwt()` quand `user` est présent, c'est-à-dire à la connexion (`:207`). `maxAge` 30 j (`:192`). Les dates utilisent l'heure du serveur (UTC sous Workers), pas `Europe/Paris`.

#### FS-06 (P1, C9) : la mesure des parcours a des trous et rien n'y est enregistré

- **Problème** : seuls deux événements sont liés aux parcours. `parcours-etape` ne peut venir que d'un abonné. `mur-vu` (étape 2) ne peut pas se déclencher (voir FS-01). Ne sont pas mesurés : le démarrage d'un parcours, sa fin, le résultat du quiz « Quel parcours est fait pour toi ? », le clic « Commencer ce parcours », la vue du mur de validation de l'étape 1 et le clic « Voir l'offre Premium » depuis une étape.
- **Effet pour l'utilisateur** : aucun effet direct. Pour Thomas, il est impossible de savoir où les visiteurs décrochent, et si les parcours font vendre.
- **Ce qu'on fait** : ajouter 5 événements : `parcours-ouvert` (slug, connecté ou non), `orientation-resultat` (slug recommandé), `parcours-commencer-clic`, `mur-vu` type `parcours-validation` sur l'étape 1, `parcours-termine` (slug). Ajouter aussi `src` sur le lien d'abonnement de l'aperçu. Agent : @data-analyst (plan de marquage) puis @fullstack. Effort : rapide.
- **Détail technique** : seuls appels dans le périmètre : `parcours-detail.tsx:95` (`mur-vu`, inaccessible) et `:403` (`parcours-etape`). L'événement `onboarding-termine` (`components/onboarding/humor-quiz.tsx:163`) est à part. Le lien de `LockedStepPreview` appelle `buildAbonnementUrl` sans `src` (`:112`), ce qui donne `abonnement-vu` avec `src=direct`. Le lien de l'étape 1 passe `src=parcours-etape`, mais aucun clic n'est mesuré sur place. Umami sur 90 jours : 0 `parcours-etape`, 0 `mur-vu`, 0 `onboarding-termine`.

### P2

#### FS-07 (P2, C5/C6) : le niveau ne bouge pas quand on valide une étape, et il plante à partir de 1 500 XP

- **Problème** : valider une étape ajoute des XP sans recalculer le niveau. Le niveau n'est recalculé que lorsqu'un abonné lit un conseil. Ensuite, le calcul peut donner « Comique » (1 500 XP) ou « Légende » (5 000 XP), deux niveaux que le code de l'application ne connaît pas. L'enregistrement échoue alors, une fois les XP déjà ajoutés.
- **Effet pour l'utilisateur** : un abonné qui termine « Répartie » (475 XP) reste « Novice » sur son profil. Celui qui finit les 3 parcours (1 600 XP) voit ensuite chaque lecture de conseil échouer sans le savoir, et son niveau reste bloqué.
- **Ce qu'on fait** : recalculer le niveau dans la validation d'étape, et ajouter les deux niveaux manquants au schéma (ils existent déjà en base, aucune migration de données). Agent : @fullstack. Effort : rapide.
- **Détail technique** : `api/parcours/[id]/progress/route.ts:177,193` (XP sans `level`). `api/user/xp/route.ts:9-25` (`calculateLevel` renvoie COMIQUE/LEGENDE) et `:76-80`. L'enum `UserLevel` de `prisma/schema.prisma:97-101` ne contient que NOVICE/APPRENTI/FARCEUR, alors que l'enum Postgres en base contient `NOVICE,APPRENTI,FARCEUR,COMIQUE,LEGENDE` (requête `pg_enum`). Base : 13 NOVICE, 1 APPRENTI, max 120 XP, donc personne n'est encore touché.

#### FS-08 (P2, C5) : deux validations simultanées peuvent compter l'étape deux fois

- **Problème** : le serveur vérifie que l'étape n'est pas déjà validée, puis l'ajoute, sans verrouiller la ligne entre les deux.
- **Effet pour l'utilisateur** : en cas de double appui ou de deux onglets ouverts, l'étape peut être comptée deux fois : XP en double, et le parcours peut être déclaré « terminé » (avec ses 100 XP de bonus) avant la dernière étape. Le premier appui sur un parcours jamais commencé peut aussi renvoyer une erreur. Base : 0 doublon aujourd'hui.
- **Ce qu'on fait** : verrouiller la progression (`SELECT … FOR UPDATE`, ou mise à jour conditionnelle « seulement si l'étape n'y est pas »), et compter les étapes distinctes pour décider de la fin. Agent : @fullstack. Effort : rapide.
- **Détail technique** : `api/parcours/[id]/progress/route.ts:147-170` (lecture puis `push` en READ COMMITTED), `:184` (`completedSteps.length` au lieu des étapes distinctes). Ce qui marche : un 2e appel séquentiel ne donne pas de XP (`:151-157`), l'utilisateur vient de la session et non de la requête (pas d'accès à la progression d'un autre), l'étape doit exister dans le parcours (`:139-141`), et un compte non Premium reçoit un 403 avant toute écriture. Le serveur accepte les étapes dans le désordre et sans le quiz : seul l'écran l'empêche.

#### FS-09 (P2, C5) : un abonné peut rester bloqué sur « Chargement du contenu de l'étape… »

- **Problème** : la page d'un parcours est servie sous forme d'aperçu à tout le monde. Le contenu complet d'un abonné arrive ensuite par un second appel. Si cet appel échoue, l'erreur est ignorée.
- **Effet pour l'utilisateur** : un abonné qui a payé voit indéfiniment « Chargement du contenu de l'étape… » sur les étapes 2 et suivantes, sans message ni bouton pour réessayer. C'est aussi le cas pendant une panne de la base : le serveur renvoie alors l'aperçu.
- **Ce qu'on fait** : après 10 secondes ou en cas d'échec, afficher « Le contenu n'a pas voulu se charger » avec un bouton « Réessayer ». Agent : @fullstack (+ @copywriter pour le message). Effort : rapide.
- **Détail technique** : `parcours-detail.tsx:335-357` (`.catch(() => {})` silencieux) et `:642-647`. `api/parcours/by-slug/[slug]/route.ts:220-226` (repli seed en aperçu si erreur base). Autre cas : si l'API répond 403 alors que l'écran croit l'utilisateur abonné (jeton pas à jour), il voit « L'étape n'a pas voulu se valider. Réessaie. » au lieu d'un message sur l'abonnement (`:415-417`).

#### FS-10 (P2, C1/C12) : la promesse « 15 à 20 min par semaine » est loin à l'étape 6 de « Confiance »

- **Problème** : selon les durées en base, les vidéos de chaque étape représentent 10 à 17 min. C'est cohérent avec la promesse, en ajoutant la lecture et le quiz. Seule exception : l'étape 6 de « Confiance » contient le spectacle complet « Pulsions » de Kyan Khojandi (72 min), soit 77 min de vidéo.
- **Effet pour l'utilisateur** : la dernière semaine de « Confiance » demande 4 fois le temps annoncé.
- **Ce qu'on fait** : désigner un extrait précis du spectacle (avec le moment de départ) ou annoncer clairement « bonus : le spectacle entier ». Agent : @copywriter. Effort : rapide.
- **Détail technique** : `Video.duration` en base (des valeurs rondes comme PT5M00S, donc probablement saisies à la main ; non vérifiées sur YouTube). Minutes de vidéo par étape : machine-a-cafe 11/10/12, repartie 15/14/15/14, confiance 11/16/17/16/15/**77**.

#### FS-11 (P2, C10/C12) : la difficulté de « Confiance » n'est pas la même partout

- **Problème** : la base et le seed classent « Confiance » en `EXPERT`, avec le libellé « Débutant → Expert ». Les données structurées pour Google des pages `/parcours` et `/parcours/confiance` disent `INTERMEDIAIRE`.
- **Effet pour l'utilisateur** : faible. Google et les IA peuvent afficher un niveau différent de celui de la page.
- **Ce qu'on fait** : lire la difficulté dans le seed au lieu de la recopier dans le code. Agent : @fullstack (+ @seo). Effort : rapide.
- **Détail technique** : `app/(dashboard)/parcours/[slug]/page.tsx:61` et `app/(dashboard)/parcours/page.tsx:70`.

#### FS-12 (P2, C11) : les textes des conseils en base ne sont plus ceux du fichier source

- **Problème** : les 13 conseils utilisés par les étapes ont été réécrits en base le 30/09 (refonte copy, passe 2). Le fichier `conseils-seed.json` garde l'ancienne version (texte, exemple et exercice différents pour les 11 conseils comparables). Deux titres d'étape n'existent même pas dans ce fichier.
- **Effet pour l'utilisateur** : aucun aujourd'hui. Mais si le patch du catalogue est rejoué (nouvelle version) ou si le seed est relancé sur une base neuve, les anciens textes reviennent en silence, et les étapes 2 de « Répartie » et 1 de « Confiance » disparaissent.
- **Ce qu'on fait** : remettre dans `conseils-seed.json` les textes de la base (export en lecture, relu par @copywriter) et ajouter les 2 conseils manquants. Ensuite, un test qui échoue si un `tipTitle` du parcours n'existe pas dans le seed. Agent : @fullstack. Effort : rapide.
- **Détail technique** : 13/13 conseils `isActive`, `generatedByAI=false`, `copyReviewedAt=2026-09-30`. Titres absents de `conseils-seed.json` : « Le silence entre deux chansons » et « Énoncer la règle non écrite ». `prisma/seed-data.ts:440-443` ignore une étape dont le conseil est introuvable. Le patch `catalogue-content:v1` a été appliqué le 29/09 à 20:26 ; `startup-tasks.ts:1039` (`patchCatalogueTips`) réécrit content/example/exercise depuis le seed si on monte la version.

#### FS-13 (P2, C11) : robustesse et dette de code autour des parcours

- **Problème** : (a) la liste `/parcours` n'a pas de page d'erreur propre, et aucune page de chargement n'existe pour les parcours. (b) La liste relie la progression aux parcours par leur titre exact : un titre retouché fait disparaître la barre de progression. (c) Le même code qui mélange base et seed est recopié dans 3 fichiers. (d) Le composant `parcours-list.tsx` n'est plus utilisé (testé, jamais affiché). (e) La limite de 10 validations par minute est comptée en mémoire, donc non fiable sous Workers.
- **Effet pour l'utilisateur** : en cas de panne, il voit l'écran d'erreur générique de Next. Le reste n'a pas d'effet aujourd'hui, mais complique toute évolution (risque de corriger un fichier et pas les deux autres).
- **Ce qu'on fait** : ajouter `error.tsx` et `loading.tsx` dans `parcours/`, faire la correspondance par `slug`, mettre la fusion base + seed dans un seul module `lib/parcours-data.ts`, supprimer `parcours-list.tsx` et son test, passer la limite sur `sharedRateLimit`. Agent : @fullstack. Effort : moyen.
- **Détail technique** : (a) `app/(dashboard)/parcours/` ne contient que `page.tsx` ; ni `app/error.tsx` ni `(dashboard)/error.tsx` n'existent (seul `app/not-found.tsx`). (b) `parcours-content.tsx:162`. (c) `enrichPathWithSeed` dans `api/parcours/by-slug/[slug]/route.ts:90-124` et `parcours/[slug]/page.tsx:201-234`, plus `buildFallbackFromSeed` en double. (d) Aucun import de `ParcoursList` hors `__tests__`. (e) `api/parcours/[id]/progress/route.ts:70` (`rateLimit`, documenté « NON fiable en prod » dans `lib/rate-limit.ts:4-6`).

#### FS-14 (P2, C11) : 4 anciens parcours inactifs et leurs 20 étapes restent en base

- **Problème** : « Les bases de l'humour », « Roi de la répartie », « Maître du storytelling » et « Stand-up : du concept à la scène » (mars 2026) sont désactivés mais toujours présents, avec 20 étapes.
- **Effet pour l'utilisateur** : aucun (leurs URL renvoient bien 404, vérifié pour `/parcours/bases-humour`). Seul risque : un outil d'admin ou un export qui oublie le filtre `isActive`.
- **Ce qu'on fait** : rien d'urgent. Les garder tant qu'aucune décision n'est prise. Aucune progression n'y est rattachée.
- **Détail technique** : `LearningPath.isActive=false` ×4. `generateMetadata` interroge la base sans filtre `isActive` (`parcours/[slug]/page.tsx:129-134`), sans conséquence puisque la page renvoie ensuite 404.

[SUITE EN COURS]
