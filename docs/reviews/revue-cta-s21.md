# Revue croisée : intégration des blocs d'appel s21

- Date : 18/10/2026
- Branche : `claude/marrant-s21-integration` (worktree `.claude/worktrees/agent-a6072b0ac19da7774`)
- Réviseur : @reviewer
- Source de vérité des textes : `docs/copy/cta-s21/textes-finaux-valides.md` (version validée du 18/10)
- Périmètre : lien de test (pas la mise en ligne publique). Sauf mention contraire, les chemins de code sont relatifs à `apps/web/src/` du worktree.
- Limite : revue faite par lecture et recherche (Read, Grep). Je n'ai pu lancer ni `tsc`, ni Jest, ni le build : l'état de la CI n'est pas vérifié ici.

## Résumé exécutif

Le branchement des textes est très propre. Sur 17 blocs comparés mot pour mot (dont B3, B10 et les 5 profils de B12), je n'ai trouvé aucun écart. Les prix, le nombre de parcours, les titres d'étapes et la condition « de la coloc à l'afterwork » sont tous lus à leur source, rien n'est écrit en dur.

Il reste un vrai problème de fond. Pour un abonné, le site impose l'ordre des étapes : l'étape 3 reste fermée tant que la 2 n'est pas validée, et l'API refuse la validation (409). Or six blocs promettent que tout est ouvert d'un coup. Ce n'est pas un verrou par date, mais la promesse est fausse telle qu'elle est écrite.

Verdict : on peut avancer pour un lien de test. La mise en ligne publique doit attendre que ce point soit tranché.

## Note et verdict

**Note : 8/10.**
- **Lien de test : GO**, aux conditions listées en fin de rapport.
- **Mise en ligne publique : NO-GO** tant que le bloquant B-1 n'est pas réglé.

## Top 3 des corrections prioritaires

1. **B-1** : supprimer l'ordre imposé aux abonnés (interface et API), ou réécrire les six blocs qui disent « ouvert d'un coup ». La décision revient à Thomas.
2. **I-1** : dans `REPLIT_ACTIONS.md`, des contrôles périmés feraient échouer une étape de mise en ligne alors que tout va bien (fausse alerte, donc arrêt de la procédure).
3. **I-3** : des blocs d'appel hors chantier gardent « Débloque » ou « Commencer à 2,99 €/mois », dont la page `/carnet`, qui est la destination directe de l'encart B1.

## 1. Conformité mot pour mot (17 blocs sur 17 comparés)

| Bloc | Code | Verdict |
|---|---|---|
| B1 (S1, S2 rendu avec la fiche offerte, S3, S6, S7 + condition « plus d'une fiche ») | `config/textes/cta-articles-accueil.ts:114-128`, `data/carnet/2026-10.json:162-167` | Conforme |
| B2 (S1, S8, S5', S6, lien OUVRIR, S9) | `cta-articles-accueil.ts:136-156`, `config/textes/offre.ts:41`, `encarts-blog-s20.ts:75` | Conforme |
| **B3** (S19, OUVRIR_ACCUEIL, S20 : « Les 3 suivantes, dont « Retourner les piques avec le sourire », c'est Premium, résiliable depuis ton profil. ») | `cta-articles-accueil.ts:184-198`, titre lu dans `config/parcours-etapes.ts:27` | Conforme |
| B4+B5 (S10, S11 en trois blocs + liste, S12 avec et sans annuel, OUVRIR, contour, S13, « 1 500+ ») | `cta-articles-accueil.ts:203-239` | Conforme |
| B6 (bouton + nom accessible) | `cta-articles-accueil.ts:102-105` | Conforme |
| B7 (/vannes, /conseils, /videos : S21 à S26, LP-A) | `config/textes/cta-pages.ts:90-135`, `:77-81` | Conforme |
| B8, B9 (S14, S15, bouton, LP-A2, S25 gabarit b, lien) | `cta-pages.ts:160-175` | Conforme |
| **B10** (S14, S15 du tour 21 avec condition coloc, bouton, S25) | `cta-pages.ts:177-184` | Conforme au tableau l.142 (voir M-4) |
| B11 (favori vanne, conseil, vidéo ; vote ; trois cartes floutées ; S28) | `cta-pages.ts:204-265` | Conforme |
| **B12** (phrase d'étape 1, bouton, OUVRIR_P, LP_B12_A/M, garantie, 5 phrases de profil, repli) | `cta-pages.ts:273-341` | Conforme pour les 5 profils (rendus recalculés : Observateur 3e de Confiance, 6 étapes de 20 min ; Storyteller 4e de Storytelling ; L'Absurde 2e de Machine à Café, 3 étapes de 15 min ; Punchlineur 2e de Répartie ; Taquin 3e de Répartie) |
| B13 (trois paragraphes, programme lu dans la donnée, garantie) | `cta-pages.ts:350-394` | Conforme (Répartie « Ensuite : … » ; Boulot « Ensuite, entre autres : … » avec formes courtes) |
| B14, B15, B16, B17, B18 | `cta-pages.ts:398-494`, `cta-articles-accueil.ts:166-175` | Conformes |

Les espaces insécables avant « : », « ? », « » » sont posés au rendu par `frTypo` (`lib/fr-typo.ts:54-68`). C'est vérifié pour l'accueil, le quiz d'humour, l'encart B1 et le bas d'article. Je ne l'ai pas vérifié pour les composants de B7 à B11 et de B13 à B17.

## 2. Vérité des faits affichés

| Fait | Preuve | Verdict |
|---|---|---|
| Prix tirés de l'offre | `config/premium.ts:31-46` : 299 et 2499 centimes ; 2,08 € = arrondi à l'inférieur de 24,99 / 12 ; 10,89 € = 35,88 − 24,99. Tous les blocs passent par `formatEuros` et les libellés de prix. Annuel affiché seulement si `isAnnualPlanAvailable()` | PASS |
| « 5 parcours » dynamique | `PARCOURS_COUNT = PREMIUM_PARCOURS.length` (`premium.ts:85`), Storytelling et Boulot publiés (`config/parcours-publication.ts:12,25`) ; `{AUTRES}` = `PARCOURS_COUNT - 1` (`cta-pages.ts:51`) | PASS |
| Résiliation par le profil puis le portail Stripe | `app/api/user/subscription/portal/route.ts:18-19,56-61` : parcours `resilier` → flux Stripe `subscription_cancel`, repli sur le portail simple, retour sur `/profil`. Aucun « en un clic » dans les blocs | PASS |
| Étapes non bloquées dans le temps | Aucun verrou par date (recherche sur unlock, date, semaine écoulée, 7 jours) ; la « date conseillée » de `components/parcours/parcours-detail.tsx:509-513` ne fait qu'afficher une date. **Mais il existe un verrou par ordre de validation pour les abonnés** : voir B-1 | PASS pour la date, **FAIL pour l'ordre** |
| Remboursement limité au premier paiement | Tous les blocs disent « ton premier paiement » ; `config/textes/juridique.ts:18` ; la rétractation vérifie la date de première souscription (`paiement.ts:391,423`) ; le remboursement est fait à la main, le webhook résilie l'abonnement en cas de remboursement total (`app/api/stripe/webhook/route.ts:326-370`) | PASS (voir M-5) |
| Fiche offerte du carnet identique sur /carnet, l'encart d'article et /abonnement | Source unique `ficheOfferte` (`lib/carnet.ts:99-101`), utilisée par `carnetViewForPlan` (:170-186), `getCarnetExtrait` (:232-238) et `getCarnetDemo` (:253-259) ; une seule fiche `offerte` par carnet (schéma :63) ; le bouton de B1 pointe vers `/carnet?src=…#fiche-<id>` (`components/blog/demo-vanne.tsx:33`), l'ancre existe (`carnet-fiche-card.tsx:24`) | PASS (voir I-4) |
| Phrase de profil B12 rattachée au bon parcours | Table `PHRASES_PROFIL` (`cta-pages.ts:273-302`) ; garde-fou : la phrase est omise si le parcours conseillé n'est pas celui de la table, s'il n'est pas publié ou si l'étape citée n'existe plus (:308-314) ; parcours conseillés dans `components/quiz/quiz-data.ts:51,64,76,88,100` = ceux de la table | PASS |
| « de la coloc à l'afterwork » conditionné | `colocAfterworkVrai` (`cta-articles-accueil.ts:78-81`) : au moins 5 parcours, avec Répartie et Machine à Café publiés ; utilisé par B3 (:84) et B10 (`cta-pages.ts:179`). Le texte validé (l.25) conditionne sur Machine à Café, pas sur Boulot. Boulot a pourtant une étape « L'afterwork » (`parcours-etapes.ts:58`). Le code est plus strict que nécessaire (« au moins 5 » suppose les 5 publiés) : le groupe ne s'affiche jamais à tort | PASS |

## 3. Décisions de Thomas (17/10 et 18/10)

| Décision | Preuve | Verdict |
|---|---|---|
| « Articles » | `LIBELLE_SECTION_ARTICLES` dans `components/layout/header.tsx:44`, `footer.tsx:16`, `blog-article-view.tsx:79,91`, `app/(dashboard)/blog/page.tsx:110,125`, `lib/llms-content.ts:121` ; `/blog` inchangé | PASS |
| En-tête vers /abonnement | `header.tsx:99` (`buildAbonnementUrl(null, "monthly", "header")`), bouton masqué sur /abonnement et /register (:103), mobile dès 360 px (:199-209) | PASS |
| Pas de juridique dans les blocs | Aucune mention « rétractation » ou juridique dans les deux fichiers de textes ; la carte Premium ne la porte plus | PASS |
| Libellés rouverts | « Ouvrir … · 2,99 €/mois » dans tous les blocs du chantier | PASS dans le périmètre, voir I-3 en dehors |
| Fiche offerte du carnet | voir section 2 | PASS |
| Lettre, premier envoi le 05/11 | `data/lettre/numeros.json:5-6` (date plancher 02/11, envoi le 05/11 à 08:00 heure de Paris) ; `config/lettre.ts:27-28`, les deux interrupteurs à `true` | PASS |
| « Ta question à l'équipe » fermé | Aucune interface ; seul un commentaire dans `app/(dashboard)/cgu/page.tsx:71-74` | PASS |
| Les deux emplacements en attente ne s'affichent pas | `LETTRE_ARTICLE.ligneRepliee` (`cta-articles-accueil.ts:174`) et `FIN_ETAPE_1.lienLettre` (`cta-pages.ts:420`) ne sont lus par aucun composant (recherche faite sur `src/`) | PASS |

## 4. Mesure et données

- `checkout-ouvert` {src, formule} et `checkout-echec` {src, raison[, formule]} sont dans `lib/checkout-tracking.ts:27-39`. Ils sont appelés par l'accueil, /abonnement, la fenêtre Premium et le quiz (`usePremiumCheckout`), le paywall et le profil. Le retour sans paiement est capté une fois dans le layout (`app/layout.tsx:145`). **PASS.**
- Aucune donnée personnelle : `src` est filtré par une regex, avec « inconnu » par défaut (:21-25) ; l'attribution n'ajoute que l'origine et le contenu (`lib/umami.ts:53-58`) ; `token` et `email` sont retirés des URL envoyées (`lib/umami-before-send.ts:33`). **PASS.**
- Filtre d'hôte : `hostname=deviens-marrant.fr` sur chaque lecture de l'API Umami (`lib/analytics/umami.ts:18,81`). Le filtre s'applique **à la lecture** (rapport du lundi, alertes), pas à l'envoi. Le trafic du lien de test arrive donc quand même dans le tableau de bord Umami : naviguer avec `?ne-pas-compter=1`. **PASS.**

## 5. REPLIT_ACTIONS.md (procédure P0 à P8)

La procédure est complète et ordonnée :
- P3 : migration 14 jouée deux fois, contrôles de tables et de colonnes, conduite à tenir en cas d'échec (l.100-103) ;
- P5 : « Soirée de Noël » avancée au 02/11 par une écriture conditionnelle (comparer puis écrire), avec le délai du 01/11 et la commande inverse (l.110-116) ;
- interrupteurs `LETTRE_INSCRIPTIONS_OUVERTES` et `LETTRE_ENVOIS_OUVERTS` décrits (l.144) ;
- P6 : contrôles curl (l.118-125) ;
- P8 : retour arrière, avec ce qui reste en base et les liens morts (l.134-139).

La cohérence avec les ajouts du chantier des blocs d'appel n'est en revanche **pas acquise** : voir I-1 et I-2.

## 6. Régressions possibles

- SEO : canonical de `/blog` inchangé (`blog/page.tsx:29`), slugs inchangés. La BreadcrumbList dit « Articles », comme le fil d'Ariane visible (`blog-article-view.tsx:76-97`). Pas de régression. Le `<title>` et la description de `/blog` disent toujours « Blog humour » (`blog/page.tsx:18-20`) : voir M-3.
- Données structurées : l'Article, la FAQ, le HowTo et l'ItemList ne sont pas touchés par le renommage.
- Pages non touchées par le chantier : l'en-tête et le pied de page sont partagés par tout le site. `/quiz-humour` passe en ISR 1 h (REPLIT l.58). Je n'ai pas fait de test de bout en bout (pas de shell). Captures disponibles à 375 et 1280 px seulement (voir M-6).

## Écarts classés par gravité

### Bloquant (mise en ligne publique ; pas le lien de test)

**B-1. L'ordre des étapes est imposé à l'abonné, alors que six blocs promettent que tout est ouvert d'un coup.**
- Le verrou :
  - `components/parcours/parcours-detail.tsx:493-497` (`etapeVerrouillee` : abonné, étape non validée, et une étape précédente non validée) ;
  - `components/parcours/parcours-step-card.tsx:202` (`canExpand = !isSequentiallyLocked` : l'étape ne s'ouvre pas) et `:276-277` (affiche « Termine l'étape N pour débloquer », `config/textes/parcours.ts:23-24`) ;
  - côté serveur, `app/api/parcours/[id]/progress/route.ts:26-27,154` : 409 `code: "ordre"`.
- Les promesses contredites :
  - B4+B5 « tout est ouvert d'un coup » (`cta-articles-accueil.ts:222`) ;
  - B12 « Premium ouvre d'un coup les {N} étapes » (`cta-pages.ts:338`), avec en plus des phrases de profil qui citent la 3e ou la 4e étape ;
  - B13 « les étapes 2 à {N} sont ouvertes tout de suite » (`cta-pages.ts:382`) ;
  - B14 « l'étape 2 est ouverte tout de suite, les suivantes aussi » (`cta-pages.ts:414`) ;
  - B10 « s'ouvrent aussi en entier » (`cta-pages.ts:179`).
- Ce n'est pas un verrou par date : les étapes peuvent s'enchaîner dans la journée. Mais un abonné qui achète pour « L'œil de l'observateur » (3e étape de Confiance) ne peut pas l'ouvrir avant d'avoir validé les étapes 1 et 2, quiz compris. Cela contredit la décision D2 du 07/10 (« toutes les étapes ouvertes d'un coup ») et la seule règle gardée par Thomas le 18/10 (« rien de faux »). Le texte validé demandait justement de vérifier ce point (`textes-finaux-valides.md:308`).
- Résolution proposée : décision de Thomas. Option recommandée : retirer le verrou d'ordre pour les abonnés (interface et API), garder seulement l'ordre conseillé en indication. C'est cohérent avec D2 et avec des textes validés à 10/10. Sinon, réécrire les six blocs avec @copywriter et une nouvelle relecture à l'aveugle (règle d'or P0 s18). Responsable : @fullstack (ou @copywriter).

### Important

**I-1. `REPLIT_ACTIONS.md` contient des contrôles périmés qui contredisent les textes finaux.**
- l.61 : `grep -c "Le rire, à ton rythme, sans te forcer"` doit renvoyer 1 ou plus. Le titre final est « Retrouver le rire à table, … » (contrôle l.19), et « à ton rythme » est interdit. Résultat attendu : 0, donc arrêt de la procédure (« une étape échouée = arrêt », l.81).
- l.35 : le lien de fin d'article est décrit comme « Débloquer les 5 parcours, 2,99 €/mois », ce qui contredit l.10 et l.18 (« Débloquer » → 0).
- l.42 : l'encart est décrit comme « Une situation de répartie » ; le surtitre final est « La situation offerte ce mois-ci ».
- l.30 et l.59 : « gagnants du tour 4 » ; l.63 : ancien libellé « Commencer l'étape 1 de … , gratuite ».
- Résolution : fusionner les quatre entrées « Blocs d'appel s21 » (l.5-75) en une seule, avec les seuls contrôles finaux. Responsable : @fullstack, relu par @infrastructure.

**I-2. La liste de pages de P6 (l.119) ne couvre pas les pages du chantier** (`/quiz-humour`, désormais en ISR, `/parcours`, `/carnet`, `/vannes`, une fiche vidéo). Leurs contrôles sont dispersés dans quatre entrées (l.17-21, 41-48, 60-65, 75). Résolution : les ajouter à P6. Responsable : @infrastructure.

**I-3. Des blocs d'appel hors chantier gardent les anciens libellés**, alors que Thomas a demandé le 18/10 que « tous les blocs d'appel du site » soient réécrits, et que le texte validé dit que « Débloquer » ne doit plus apparaître dans aucun libellé d'appel (l.24).
- `components/carnet/carnet-page.tsx:98` « Débloque tout le carnet », `:100-101` « se débloquent », `:108` « Commencer à 2,99 €/mois ». C'est la page d'arrivée du bouton de B1 : le visiteur qui vient d'un article voit les anciens textes.
- `app/(dashboard)/glossaire/page.tsx:141` « Commencer à » ; `components/auth/auth-cta.tsx:28` et `app/(dashboard)/a-propos/page.tsx:214` « Accéder aux parcours complets » ; `components/profil/abonnement-card.tsx:138` « pour débloquer ».
- Compte connecté sans abonnement : « Active mon accès · 2,99 €/mois » sur la carte d'accueil (`components/home/premium-cta.tsx:121`) et sur /abonnement (`components/premium/abonnement-view.tsx:296`), au lieu de `OUVRIR` et du bouton nommé de B16.
- Résolution : Thomas tranche le périmètre (hors chantier volontaire, ou nouveau tour). Si nouveau tour : @copywriter puis relecture à l'aveugle. Responsable : @copywriter et @fullstack.

**I-4. Aucun carnet de novembre dans le code** (`data/carnet/` ne contient que `2026-10.json`). Dès le 01/11, `getCarnetExtrait` renvoie `null` (`lib/carnet.ts:234`) : l'encart B1 disparaît de tous les articles et l'extrait de /abonnement aussi. /carnet continue d'afficher le carnet d'octobre. L'état vide est propre (rien de faux), mais le principal bloc nouveau du chantier s'éteint quatre jours avant la première lettre. Résolution : déposer `2026-11.json` avec une fiche `offerte` munie d'une `accroche` qui soit un chambrage (condition de B1). Responsable : @copywriter et @fullstack, avant le 01/11.

### Mineur

**M-1. La liste d'interdits du texte validé (l.301) n'est pas vide dans `src/`.** On trouve encore :
- « Voir toutes les vannes » (`vannes-list.tsx:249`, `vannes/theme/[slug]/page.tsx:99`, `blague-du-jour/page.tsx:107`, `liens-page-content.tsx:17`), « Voir tous les conseils » (`conseils-list.tsx:253`), « Voir toutes les vidéos » (`videos-grid.tsx:254`), « Voir tous les parcours » (`parcours-detail.tsx:474`, `parcours/[slug]/error.tsx:37`) ;
- « Choisis ton parcours » (`lib/blog-articles.ts:1364`) ;
- « à ton rythme » (`parcours/[slug]/page.tsx:68`, description de la page Confiance ; `faqs.ts:22` ; `(dashboard)/page.tsx:120` ; articles).

Ce sont des états vides, de la navigation et des articles, pas les blocs eux-mêmes. Il faut préciser le périmètre de cette liste. Responsable : @copywriter.

**M-2. Numéro de la fiche offerte.** Le visiteur la voit en « Situation 1 · offerte » sur /carnet et sur /abonnement (`carnet-page.tsx:51`, `carnet-extrait.ts:14`). Pour un abonné, c'est la situation 15 du carnet (`2026-10.json:162`). C'est cohérent pour le visiteur ; je le signale seulement.

**M-3. SEO** : le `<title>` « Blog humour : guides et techniques » et la description « Le blog qui… » de `/blog` (`blog/page.tsx:18-20`) ne suivent pas « Articles ». Garder le mot-clé est défendable, aucune régression. À confirmer par @seo.

**M-4. Le document source se contredit sur B10.** La note `textes-finaux-valides.md:148` décrit un S15 du tour 17 (« Revois cette vidéo… », « Tu la gardes aussi en favori », « par étape, un défi à chaque fois ») différent du tableau l.142 (tour 21), que le code suit. Risque : un relecteur ou @qa compare à la mauvaise version. Responsable : @copywriter (nettoyer la note).

**M-5.** Le texte du paiement Stripe (`config/textes/paiement.ts:119`) dit « Tu as 14 jours pour te faire rembourser » sans « premier paiement ». Une personne qui se réabonne le lit aussi. C'est hors des blocs d'appel. Responsable : @copywriter.

**M-6.** Les captures `docs/qa/captures-s21/textes-finaux/` existent à 375 et 1280 px, pas à 768 px. J'en ai regardé deux (accueil et quiz L'Absurde à 375 px) : rien d'anormal à cette échelle. L'en-tête collant en plein milieu de la capture du quiz est un effet de la capture pleine page, pas un bug.

## Contradictions entre livrables

| Livrable A | Livrable B | Contradiction | Criticité | Résolution |
|---|---|---|---|---|
| `textes-finaux-valides.md` (B4+B5, B10, B12 à B14) et la décision D2 du 07/10 | `parcours-detail.tsx:493`, `progress/route.ts:154` | « Ouvert d'un coup » contre un ordre imposé | Bloquante | B-1, décision de Thomas |
| `REPLIT_ACTIONS.md` l.19 | `REPLIT_ACTIONS.md` l.61 | Deux titres Confiance attendus | Importante | I-1 |
| `founder-preferences.md` du 18/10 (« tous les blocs ») | `carnet-page.tsx`, `premium-cta.tsx:121`, `abonnement-view.tsx:296` | Anciens libellés restants | Importante | I-3 |
| `textes-finaux-valides.md` l.142 | même fichier, l.148 | Deux versions de B10 S15 | Mineure | M-4 |

## Décisions à confirmer par Thomas

1. B-1 : retirer l'ordre imposé aux abonnés (recommandé), ou réécrire six blocs.
2. I-3 : périmètre des « blocs d'appel » (page /carnet, boutons des comptes connectés, glossaire, à propos).
3. I-4 : la fiche offerte et la situation du carnet de novembre.

## Conditions du GO pour le lien de test

1. CI verte sur le dernier commit de la branche (non vérifié ici).
2. Naviguer avec `?ne-pas-compter=1` (le filtre d'hôte ne s'applique qu'à la lecture).
3. [À confirmer par @infrastructure] Si le lien de test utilise les liaisons de production (base Neon, Stripe live, Resend) : ne pas s'inscrire à la lettre tant que P3 (migration 14) n'est pas jouée, et ne pas payer. Confirmer aussi que les tâches planifiées (envoi de la lettre) ne tournent pas sur une version de test.
4. B-1 tranché, et I-1 à I-4 corrigés, avant de dérouler P0 à P8 en production.

## Recommandation

**GO pour le lien de test. NO-GO pour la mise en ligne publique** tant que B-1 n'est pas réglé. Agents à relancer : @fullstack (B-1 selon la décision, I-1, I-3 pour le code), @infrastructure (I-2, condition 3), @copywriter (I-3, I-4, M-1, M-4, M-5), @seo (M-3).
