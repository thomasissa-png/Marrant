# Revue croisée v2 : chantier s21 (blocs d'appel, boutons, carnet de novembre, étapes ouvertes)

- Date : 18/10/2026. Réviseur : @reviewer.
- Branche : `claude/marrant-s21-integration`, HEAD `d5aa7ca` (worktree `.claude/worktrees/agent-a6072b0ac19da7774`). Commits relus depuis `22baf68` : `787707d` (B-1) à `d5aa7ca` (corrections QA v2), d'après le journal de la branche.
- Revue précédente : `docs/reviews/revue-cta-s21.md` (8/10, NO-GO public avant B-1). QA v2 : `docs/qa/qa-cta-s21-v2.md` (8,5/10, testée sur `9568ed0`).
- Limite : lecture et recherche seulement (pas de shell) : ni `tsc`, ni Jest, ni build, ni état de la CI vérifiés ici. Chemins de code relatifs à `apps/web/src/`.

## Résumé exécutif

Le bloquant de la v1 est levé : un abonné ouvre et valide les étapes dans n'importe quel ordre. C'est prouvé dans le code et en vrai par la QA (ordre 6, 3, 1, 5, 2, 4, XP justes). Les promesses tiennent partout : étapes ouvertes d'un coup, remboursement du premier paiement, résiliation depuis le profil (aucun « en un clic » côté abonnement), prix et « 1 500+ » intacts. Le carnet de novembre est embarqué et bascule à minuit le 01/11. Je n'ai trouvé aucun fait faux affiché, quel que soit le profil. Restent des détails de mesure et deux libellés anciens sur des pages secondaires. Les 4 dernières corrections (`d5aa7ca`) n'ont pas encore été contre-testées par @qa.

## Note et verdicts

**Note : 9/10** (8 en v1).
- **(a) Lien de test : GO**, aux conditions T1 à T3 (section 6).
- **(b) Mise en ligne publique : GO conditionnel.** Aucun bloquant de fond. Trois préalables : contre-épreuve @qa ciblée sur `d5aa7ca` et CI verte (P0) ; feu vert de Thomas après le lien de test ; décision de Thomas sur I-A. Tant que ces préalables manquent : NO-GO. Le délai est serré : P5 doit être faite au plus tard le 01/11, et Thomas est absent du 18 au 25/10.

## 1. Points de la revue v1

| Point v1 | Statut | Preuve |
|---|---|---|
| **B-1** ordre imposé aux abonnés | **Corrigé** | `app/api/parcours/[id]/progress/route.ts:26-27,152-153` (plus de 409 `ordre`) ; `isSequentiallyLocked` et `etapeVerrouillee` absents de `components/parcours/` ; « pour débloquer » / « Termine l'étape » : 0 dans `src/`. QA v2 §3 [LIVE] : 6 étapes dans le désordre, toutes en 200, bonus versé une seule fois ; visiteur 401, compte gratuit 403, étapes 2+ servies `locked`. Capture `parcours-abonne-apres-etape-6-375.png` lue : « Tu peux y aller dès maintenant si tu veux ». |
| I-1 contrôles périmés dans REPLIT | **Corrigé** | Une seule entrée « Blocs d'appel s21 » (`REPLIT_ACTIONS.md:5-62`), contrôles 1 à 12 à jour ; l'ancien titre Confiance et « Débloquer » ne sont plus attendus. |
| I-2 pages du chantier absentes de P6 | **Corrigé** | `REPLIT_ACTIONS.md:106` (`/quiz-humour`, `/parcours`, `/carnet`, `/vannes`, fiche vidéo) et `:108` (étape 3 ouverte par un abonné). |
| I-3 anciens libellés hors chantier | **Corrigé en grande partie** | E1 à E4 posés, mot pour mot conformes à `textes-valides-boutons.md` (vérifié sur `config/textes/cta-pages.ts:514-540` et `cta-articles-accueil.ts:242-245`). **Restent** « Commencer à 2,99 €/mois » (`app/(dashboard)/glossaire/page.tsx:141`) et « Accéder aux parcours complets » (`a-propos/page.tsx:214`, `components/auth/auth-cta.tsx:28`) : voir I-A. |
| I-4 pas de carnet de novembre | **Corrigé** | `data/carnet/2026-11.json`, 30 fiches, fiche offerte `2026-11-10` (chambrage au dîner : condition de B1 remplie). QA v2 §4 : bascule à 00:00 Paris, 0 fuite des fiches verrouillées, sha256 identique à `docs/copy/carnet/novembre/carnet-2026-11.json`. |
| M-1 interdits hors blocs | Ouvert (hors blocs) | « à ton rythme » encore dans la description de Confiance (vu sur la capture). États vides et navigation : périmètre à préciser, inchangé. |
| M-2 numéro de la fiche offerte | **Corrigé** | `9568ed0` : position réelle (« Situation 15 », puis « Situation 10 » en novembre). |
| M-3 `<title>` de `/blog` | Ouvert | `blog/page.tsx:18` « Blog humour : guides et techniques ». Avis @seo toujours attendu. |
| M-4 note B10 contradictoire | Ouvert | `textes-finaux-valides.md:148`. |
| M-5 texte Stripe sans « premier paiement » | Ouvert | `config/textes/paiement.ts:119`. Vrai au moment du paiement, mais pas aligné sur les autres. |
| M-6 captures à 768 px | Partiel | v2 : 320, 360, 375 et 1280 ; 768 seulement pour m7. |
| QA v2 MJ-1, m-b, m-c, m-d | **Corrigés dans le code, pas contre-testés** | MJ-1 : `components/carnet/carnet-page.tsx:21-23,122` (`carnetSrc`, `src` d'arrivée sinon `carnet`), pages en `force-dynamic`, test `__tests__/lib/checkout-mesure-s21.test.tsx`. m-b : `carte-premium-achat.tsx:43`. m-c : `premium-cta.tsx:90-94` (`MasqueSiConnecte`, texte « 1 500+ » intact). m-d : `blog/article-cta.tsx:81`. La capture E2 de la QA est antérieure à m-c : elle montre encore la ligne. |
| QA v2 m-a (B2 sur 3 lignes à 320 px) | Ouvert, assumé | `REPLIT_ACTIONS.md:38` « non traité ». Forme seule. |

## 2. Cohérence des promesses entre les pages : PASS

| Promesse | Constat |
|---|---|
| Étapes ouvertes d'un coup | Dit par B4+B5, B10, B12, B13, B14, E1 (« elles s'ouvrent toutes d'un coup »), E3 (« tout s'ouvre d'un coup »), E4, `premium-welcome.tsx:29`. Plus aucun texte contraire dans `src/`. « Une étape par semaine » (B2 visiteur, `cta-articles-accueil.ts:152`) reste un rythme conseillé, conforme au choix du 18/10. |
| Remboursement « premier paiement » | « ton premier paiement » dans tous les blocs (`cta-pages.ts:51,264,341,392,520`, `cta-articles-accueil.ts:249`, `offre.ts:41,50`). E4 dit « ce paiement » : c'est validé, et c'est vrai aussi pour un ancien abonné (un réabonnement = un nouvel abonnement, `paiement.ts:425`). Seul écart : `paiement.ts:119` (M-5). |
| Résiliation | « depuis ton profil » ou « résiliable en ligne » partout ; `lib/llms-content.ts:79,126,141,155` sans « en un clic ». « en un clic » ne reste que pour la désinscription de la lettre et l'arrêt du rappel (`lettre-s21.ts:67,175`, `cta-articles-accueil.ts:173`, `confidentialite`), ce qui est exact (RFC 8058). |
| Prix | `config/premium.ts:31-39` inchangés (299, 2499, 2,08 € et 10,89 € calculés) ; E3 annuel « 24,99 €/an ». |
| « 1 500+ » | Texte intact (`cta-articles-accueil.ts:251`, `hero-section.tsx:63`). Après m-c, il est masqué pour un compte connecté sur la carte Premium : seul l'affichage change, le texte reste. |

## 3. Rien de faux par profil : PASS

- **Visiteur** : étape 1 libre, étapes 2+ en aperçu, API sans fuite (QA v2 §3). Fiches du carnet verrouillées absentes du HTML (§4).
- **Compte sans abonnement** : E2, E3, E4 conformes. La ligne « Déjà 1 500+ inscrits, et toi ? » sous « Tu as déjà ton compte » est retirée (m-c).
- **Ancien abonné** : il voit E2, E3 et E4 comme un compte gratuit. « 14 jours… ce paiement » est vrai d'après la règle. Nuance hors bloc : l'accusé automatique de rétractation se base sur la première souscription du compte (`app/api/retractation/route.ts:78-105`). Un réabonné reçoit donc la version conditionnelle, et Thomas vérifie dans Stripe (`paiement.ts:425`). Le message n'est pas faux, mais il est moins net : à garder en tête.
- **Abonné** : pas de carte Premium, pas de prix au quiz, favoris actifs, bloc de fin d'article réduit à « Continuer mon parcours » (m-d). **Écart mineur** : `/glossaire` affiche « Commencer à 2,99 €/mois » à tout le monde, abonné compris (`glossaire/page.tsx:140-142`, sans masque). Le prix est vrai, mais l'abonné se voit proposer un achat (voir I-A).

## 4. Mesure

- **Sources des boutons payants du chantier : PASS.** Les 23 entrées de la QA ont chacune leur `src`. E1 est corrigé (`carnet`, ou `blog-demo-milieu-1` de bout en bout si on arrive par l'encart B1).
- **Restent sans source** (tout est compté `abonnement`, donc mélangé à la page elle-même) : `/glossaire` (`glossaire/page.tsx:140`), la carte « Abonnement » de `/parcours` (`parcours/(liste)/page.tsx:109`), `/favoris` non abonné (`favoris-list.tsx:196`), le lien « passe en Premium » de la recherche (`ui/search-bar.tsx:255`), et `/a-propos` pour un compte connecté (`auth-cta.tsx:46`). Faible trafic probable : mineur (m-1).
- **Ce qui change pour le rapport du lundi** :
  1. Le rapport automatique ne lit que `abonnement-clic` et les paiements Stripe (`lib/analytics/weekly-funnel.ts:129,159`). **`checkout-ouvert` et `checkout-echec` par source n'y figurent pas** : pour savoir quel bloc donne envie de payer, il faut aujourd'hui les lire à la main dans Umami (m-2, @data-analyst).
  2. `abonnement-clic` : la valeur `accueil` disparaît au profit de `accueil-premium` (m-b) ; le total ne bouge pas. Sur `/abonnement`, compte connecté, l'événement part sans `entree` (`abonnement-view.tsx:180`) : la source n'est connue que par `checkout-ouvert`.
  3. `abonnement-vu` : la série `direct` baisse (le retour après inscription devient `retour-inscription`) ; la série `src=abonnement` baisse d'autant que `carnet` apparaît.
  4. La mesure change à la date de mise en ligne : la trace de P6 (`REPLIT_ACTIONS.md:114`) la note. Le trafic du lien de test est exclu à la lecture par le filtre `hostname`.

## 5. Procédure P0 à P8 : PASS

Elle est complète et ordonnée : prérequis avec CI et feu vert (P0), N-1 relevé (P1), contrôles bloquants (P2), migration jouée deux fois (P3), build (P4), « Soirée de Noël » avancée au 02/11 par une écriture conditionnelle, avec délai du 01/11 et commande inverse (P5, `:97-103`), contrôles 1 à 12 dont le carnet au 01/11 après 01:00 Paris (`:58`), l'étape 3 de l'abonné, la source du carnet (`:44`), les contrôles du 02/11 et du 05/11 (P6), essai réel de la lettre (P7), retour arrière en une commande `npx wrangler rollback <N-1>`, avec ce qu'il laisse (P8, `:124-128`).
- Petit manque : P0 vérifie la CI mais pas la contre-épreuve @qa sur le commit final, alors que `REPLIT_ACTIONS.md:131` l'exige. Il faut l'ajouter comme case de P0 (m-3).
- Le lien de test n'a aucune consigne (quel environnement, quelle base, quel Stripe) : condition T3.

## 6. Corrections classées

**Bloquant** : aucun.

**Important**
- **I-A** (Thomas, puis @copywriter et @fullstack) : le choix du 18/10 dit « tous les blocs d'appel du site réécrits avant la mise en ligne ». Restent « Commencer à 2,99 €/mois » (`/glossaire`, montré aussi aux abonnés) et « Accéder aux parcours complets » (`/a-propos`). Ce n'est pas faux, mais c'est hors du choix. Soit un tour à l'aveugle court, soit Thomas les déclare hors périmètre.
- **I-B** (@qa) : contre-épreuve ciblée sur `d5aa7ca` : E1 vers `checkout-ouvert {src: carnet}` et chaîne B1 → carnet ; `abonnement-clic` accueil connecté ; carte connectée sans « 1 500+ » ; B2 abonné sans corps visiteur. Plus la CI verte (jobs `test`, `lint`, `e2e-local`).

**Mineur**
- m-1 (@fullstack) : `src` pour les 5 entrées payantes listées en §4.
- m-2 (@data-analyst) : `checkout-ouvert` par `src` dans le rapport du lundi, avant le premier lundi qui suit la mise en ligne.
- m-3 (@infrastructure) : ajouter la contre-épreuve @qa à P0.
- M-3 (@seo), M-4 et M-5 (@copywriter), m-a (@design) : inchangés depuis la v1 et la QA v2.
- Hors branche : `docs/copy/cta-s21/complements/carnet-2026-11.json`, dans la copie principale, est une version antérieure qui porte le même nom que le fichier validé. Il faut l'archiver (@copywriter).

**Conditions du lien de test**
- T1 : CI verte sur `d5aa7ca` (non vérifiée ici).
- T2 : naviguer avec `?ne-pas-compter=1`.
- T3 : @infrastructure confirme l'environnement. S'il utilise les liaisons de production (Neon, Stripe live, Resend) : ne pas payer, ne pas s'inscrire à la lettre (migration 14 pas encore jouée), et valider des étapes seulement avec un compte de test (l'XP serait réelle).

## 7. À trancher par Thomas

1. I-A : faire réécrire `/glossaire` et `/a-propos`, ou les laisser hors périmètre.
2. La date de mise en ligne : entre le 26 et le 31/10 (P5 au plus tard le 01/11), ou feu vert à distance pendant le voyage.
3. Toujours en attente (rappel de la v1, rien de nouveau) : l'emplacement de la lettre dans les articles (B18) et en fin d'étape 1 (B14 `[S30]`), `REPLIT_ACTIONS.md:60`.

---
**Handoff → @orchestrator**
- Fichier produit : `docs/reviews/revue-cta-s21-v2.md`
- Décisions : 9/10 ; lien de test GO (T1 à T3) ; mise en ligne publique GO conditionnel (I-B, feu vert de Thomas, I-A tranché)
- Agents à relancer : @qa (I-B), @copywriter (I-A selon décision, M-4, M-5, fichier homonyme), @fullstack (m-1), @data-analyst (m-2), @infrastructure (m-3, T3), @seo (M-3)
---
