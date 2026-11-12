# Tour 8, relecture à l'aveugle @reviewer : « sections de contenu » (s24)

> Relecteur : @reviewer, 12/11/2026. Document noté : `architecture-contenu-v8.md` (V8). Grille C1 à C11 (C11 : pertinence pour l'audience réelle). Faits contrôlés dans le dépôt.

## 1. Notes

**Faits contrôlés et justes** :
- Plan des 60 situations (§3.3) : règle « 4 par univers, +2 [MESURÉ], +1 [OBSERVÉ] » appliquée ligne par ligne, 48 + 4 + 8 = 60.
- « Ce soir, c'est plutôt ? » appuyé sur des valeurs existantes de `JokeCategory` (SOIREES, BOULOT, PARENTS, DATING).
- FP l. 20 (pivot du 06/05, « conseils > vannes ») et l. 120 (stock d'inédits) cités juste.
- Pages Google « faire rire un homme / une fille » : 488 / 4 et 314 / 3 (`point-etape-s20.md` l. 62).
- Zéro tiret cadratin.

**Fait faux** : l'entrée depuis un article par `returnTo` (section 3).

| # | Critère | T6 | T7 | T8 | Justification (passage cité) |
|---|---|---|---|---|---|
| C1 | Valeur persona | 9 | 9 | 9 | Toucher « Ce soir, c'est plutôt ? », garde-fous de ton, « pour plaire » : gains réels. Mais l'abonné venu d'un article, cas présenté comme « l'entrée la plus fréquente », ne recevra pas le premier pas promis par la table « catégorie d'article » : aujourd'hui il atterrit sur `/parcours/<parcours>` (U1). |
| C2 | Respect des décisions | 8 | 10 | 10 | Règle de priorité écrite, C13 posée honnêtement face au pivot du 06/05, rien de rouvert sans marquage. |
| C3 | Zéro donnée inventée | 9 | 9 | 8 | « Le lien de retour (`returnTo`) : l'abonné vient d'une fiche **ou d'un article du blog** […] L'article est donc un signal » : faux dans le code (U1). La note [À VÉRIFIER] ne couvre que le slug, pas l'existence même du signal. |
| C4 | Rubriques | 9 | 10 | 10 | Rien à redire. |
| C5 | Ambition | 10 | 10 | 10 | Rien à redire. |
| C6 | Cohérence | 9 | 9 | 8 | La table « catégorie d'article » double la correspondance article-parcours qui existe déjà dans le code (`lib/blog-parcours.ts`) (U2) ; « Le premier pas est le même sur la page de succès et dans « Aujourd'hui » » ne dit pas ce qui l'emporte sur la redirection actuelle vers `returnTo` (U3) ; aucune ligne pour un `returnTo` qui vise un parcours sans étape, le cas réel venant d'un article (U5). |
| C7 | Faisabilité | 10 | 9 | 9 | S5 corrigé (jamais dans les inédits). Le chantier de développement (§7.3) n'inclut pas le transport de la source d'article après paiement, sans lequel la table de §4.2 ne marche pas (U4). |
| C8 | Questions | 8 | 9 | 10 | C13 bien posée (trois places, pivot cité, reco argumentée) ; C6 dit « intérêt mesuré sur deux pages ». |
| C9 | Exemples | 9 | 10 | 10 | Rien à redire. |
| C10 | Progression | 9 | 10 | 9 | Le premier pas du cas d'entrée le plus fréquent repose sur un signal qui n'existe pas (U1). |
| C11 | Pertinence pour l'audience réelle | - | 8 | 9 | S3 traité : « répondre sans être méchant » devient une règle d'écriture (« on rit avec, pas contre ») ; règle de priorité appliquée au plan et à C13 ; vocabulaire rétabli. Reste U1 : l'idée de relier l'espace à l'article de blagues d'où vient le visiteur est juste, mais elle n'existe pas encore dans le code. |

**Note globale : 9,3 / 10** sur 11 critères (102 / 110 ; T7 : 9,4). Six critères à 10. La baisse vient d'un fait nouveau et faux, introduit par la v8 (U1).

## 2. Statut de mes corrections du tour 7

| T7 | Objet | Statut | Commentaire |
|---|---|---|---|
| S3 | « Sans être méchant », « répliques par situation » | ok | Deux lignes [PISTE] ; règle « on rit avec, pas contre » (§2.2) ; part de la risquée revue à l'étalon E1. |
| S1 | Pages et requêtes | ok | « [MESURÉ] sur deux pages, pas sur des requêtes », partout, C6 compris. |
| S2 | « Le sujet le plus traité » | ok | « Sujet massif en offre » pour les deux ; « le nombre de pages publiques mesure l'OFFRE » (§0.1), meilleur que ma demande. |
| S4 | Vocabulaire réduit | ok | 40 mots rétablis, argument du glossaire public écrit (§0.3). |
| S5 | « Une autre » dans les inédits | ok | « jamais dans les vannes inédites réservées au contenu du jour » (§4.4). |
| S6 | Étiquettes | ok | Timidité rattachée à la soirée ; « Raconter » en [MESURÉ] faible (7 entrées) et [SUPPOSÉ]. |

**Bilan : 6 ok sur 6.**

## 3. `returnTo` et l'entrée depuis un article

**Verdict : la v8 s'appuie à tort sur `returnTo` pour l'article.** Ce que dit le code (lu ce tour) :

1. Le bouton payant de fin d'article est `buildAbonnementUrl(`/parcours/${parcours}`, "monthly", src)` (`components/blog/article-cta.tsx` l. 89), avec `src={`blog-${article.slug}`}` (`blog-article-view.tsx` l. 137). L'adresse réelle est donc `/abonnement?returnTo=%2Fparcours%2F<parcours>&src=blog-<slug>`.
2. **`returnTo` existe, mais il porte le PARCOURS associé à l'article, jamais l'article.** Ce parcours vient de `resolveArticleParcours` (`lib/blog-parcours.ts` : table par slug, puis par cluster, défaut `repartie`). Précision par rapport au fait de la session : la phrase « PAS `returnTo` » est juste pour l'article, mais un `returnTo` vers un parcours voyage bien.
3. Le slug n'est que dans `src`. `buildAbonnementUrl` et `getPostSignupRedirect` (`lib/premium-return.ts` l. 53 à 68 et 123 à 126) le relaient de `/abonnement` à `/register` et retour, « pour la mesure du tunnel ». Il **n'entre ni dans la session Stripe** (`lib/stripe.ts` l. 189 à 193 : `metadata: { userId, plan }`) **ni dans l'adresse de retour** (`cheminRetourPaiement`, `premium-return.ts` l. 33 à 37 : `session_id`, `returnTo`, `formule` seulement). Aucun stockage navigateur dans les fichiers du trajet. **Après le paiement, l'espace ne peut pas savoir de quel article vient l'abonné.**
4. Après le paiement, l'abonné est envoyé vers `returnTo` (`/parcours/<parcours>`), sinon `/parcours`, avec le message de bienvenue (`getPostPaymentDestination`, l. 40 à 46). Il n'arrive pas sur « Aujourd'hui ».

**Formulation juste exigée (§4.2, §0.2 ligne 1, §0.4 point 1, §0 bis point 4, annexe B)** : « Depuis un article, le bouton d'abonnement transmet le parcours associé à l'article (`returnTo=/parcours/<parcours>`, choisi par `lib/blog-parcours.ts`) et l'article seulement dans `src=blog-<slug>`, une source de mesure perdue au paiement. Aujourd'hui, le seul signal d'article qui arrive dans l'espace est donc le parcours associé. La table « catégorie d'article, premier pas » demande un développement : faire suivre `src` (ou la catégorie de l'article) jusqu'après le paiement. Tant qu'il n'est pas fait, un abonné venu d'un article est traité comme « lien de retour vers un parcours ». »

## 4. Nouvelles corrections

1. **U1. §4.2 « **Le lien de retour** (`returnTo`) : l'abonné vient d'une fiche **ou d'un article du blog**. […] L'article est donc un signal (table ci-dessous). [À VÉRIFIER] : que `returnTo` porte le slug de l'article. » ; reprise en §0.2 (« l'article de blagues est un signal d'entrée »), §0.4 point 1, §0 bis point 4, ordre 2 (« Lien de retour vers un article de répartie, de boulot ou de storytelling ») et annexe B.** Problème : faux dans le code (section 3). `returnTo` porte le parcours de l'article, et le slug, dans `src`, est perdu au paiement. La table « catégorie d'article, premier pas » décrit donc un comportement qui n'existe pas, présenté comme une connaissance du produit (« Ce que le produit connaît réellement »). Correction : la formulation de la section 3 ; la table d'article marquée « à construire » ; le cas actuel traité comme « lien de retour vers un parcours ». **Bloquant : oui.**
2. **U2. Table « catégorie d'article, situation d'entrée » [HYPOTHÈSE de correspondance] et ordre 2 « Lien de retour vers un article de répartie, de boulot ou de storytelling ».** Problème : une correspondance article vers parcours existe déjà et sert le bouton d'abonnement (`resolveArticleParcours`, `lib/blog-parcours.ts` : table par slug, `PARCOURS_PAR_CLUSTER`, défaut `repartie`). En créer une seconde fait deux sources qui divergeront. Correction : dériver l'ordre 2 de `lib/blog-parcours.ts` et ne définir de neuf que le premier pas par cluster. **Bloquant : non.**
3. **U3. §4.2 « Le premier pas est le même sur la page de succès et dans « Aujourd'hui » ».** Problème : aujourd'hui la destination après paiement est `returnTo` (par exemple `/parcours/repartie` depuis un article ou un mur d'étape), sinon `/parcours` (`getPostPaymentDestination`). Le document ne dit pas si l'espace remplace cette redirection par « Aujourd'hui », ni ce qui l'emporte quand un `returnTo` existe. Correction : une phrase de règle (par exemple « un `returnTo` vers une fiche ou une étape est honoré ; sinon, « Aujourd'hui » »), renvoyée à Q8 du brief et au chantier. **Bloquant : non.**
4. **U4. §7.3 « Chantier de développement en plus du contenu ».** Problème : la liste n'inclut pas le transport de la source d'article (ou de sa catégorie) jusqu'après le paiement : adresse de retour, métadonnées de la session ou champ du compte, avec la phrase de confidentialité si c'est retenu sur le compte (comme §7.5 d). Correction : l'ajouter, ou retirer la table d'article de la V1. **Bloquant : non.**
5. **U5. §4.2, ordre 1 : lignes « une vanne, un conseil ou une vidéo », « une étape de parcours », « un article », « une autre page publique ».** Problème : le `returnTo` le plus courant venant d'un article est `/parcours/<parcours>`, sans étape ; aucune ligne ne le traite. Correction : ligne « Lien de retour : un parcours (sans étape) » → premier pas = la plus courte fiche à geste de l'étape 1 (ou de l'étape à reprendre), parcours conseillé = ce parcours. **Bloquant : non.**

## 5. Conditions du 10/10

Lever U1 (formulation de la section 3, table d'article « à construire »), traiter U2 à U5, puis un dernier tour à l'aveugle. Tout le reste est au niveau.
