# Audit parcours d'apprentissage s17 : mesure et plan de tracking (@data-analyst)

> Session 17, 07/10/2026. Code lu : `79b11f3`. Périmètre : **C9 (Mesure)** + plan de mesure des parcours. Audit seul : aucun code, contenu ni donnée modifiés, aucun commit.
> Raccord s16 : la mesure du tunnel d'achat (inscription, paiement, panne) est déjà auditée dans `docs/marrant/audit-parcours-s16/data-analyst.md`. Elle n'est pas refaite ici. Ce document mesure ce qui se passe **avant** (découverte, étape 1, mur) et **après** le paiement (progression, fin).
> Sources : `parcours-umami.json`, `parcours-umami-journeys.json` (Umami Cloud, 90 j au 07/10/2026 13:45 UTC), `parcours-data.json` (base Neon, lecture seule), rapports `fullstack.md` et `product-manager.md` du même dossier. Aucune requête relancée.
> Convention de nommage retenue : celle du tunnel déjà en production (`objet-action` en kebab-case français, ex. `mur-vu`, `abonnement-clic`). La taxonomie `objet_action` en snake_case de la fiche agent n'est pas appliquée : elle obligerait à renommer une vingtaine d'événements déjà en code (voir DA-10).

## 1. TL;DR

1. **On ne mesure presque rien des parcours.** Sur 90 jours, 37 sessions Umami ont touché une page parcours et **aucune** n'a déclenché un événement. Les deux événements existants (`parcours-etape`, `mur-vu` étape 2) mesurent ce qui ne peut pas arriver à un visiteur.
2. **Le tunnel réel est vide après la page parcours** : 0 mur vu, 0 paiement venu d'un parcours (hors achat test du 07/10), 0 étape validée par un abonné, 0 parcours terminé, 1 seule progression en base (24/09, compte gratuit, étape 1 de « Confiance »).
3. **Le peu de trafic qui existe est pollué** : sur 37 sessions, 7 sont des tests du 07/10 et 7 suivent la même séquence de 10 pages en moins d'une minute (probables robots). Il reste **23 sessions plausiblement humaines en 90 jours**, soit moins de 2 par semaine.
4. **Note C9 : 2/10.** Plan proposé : 6 nouveaux événements, 3 propriétés ajoutées à des événements existants, 1 table de dates par étape, 1 section « Parcours » au rapport du lundi, 3 alertes. Aucun événement existant renommé.
5. **Les taux ne sont pas interprétables avant n = 30 abonnés** (marge de ±18 points) et ne servent à décider qu'à partir de n = 100 (±10 points). Aujourd'hui n = 2 abonnés et 0 abonné aux prix actuels : on lit des nombres, pas des pourcentages.

## 2. Tableau de notes (C9 et sous-critères)

| Critère | Note /10 | Preuve courte |
|---|---|---|
| **C9 Mesure (global)** | **2** | Sur les 15 critères K1-K15 du @product-manager : 1 mesurable avec biais (K1), 1 partiel (K2), 2 sans valeur (K5 et K6 : 0 mur vu), 5 lisibles en base mais vides (K7, K8, K10, K11, K13 : n = 0 à 2), 6 non mesurables (K3, K4, K9, K12, K14, K15) |
| C9a Couverture des événements | 2 | `parcours-detail.tsx:95` (`mur-vu`, inaccessible, FS-01) et `:403` (`parcours-etape`, Premium seulement). 0 événement pour : arrivée, étape ouverte, quiz, mur de validation, orientation, fin, erreur |
| C9b Qualité de la donnée Umami | 3 | Script et événements du tunnel fonctionnent (58 `blog-scroll`, 4 `abonnement-clic`), mais 14 sessions parcours sur 37 sont du test ou du scripté ; pays US = 33 à 64 % des visites des pages parcours |
| C9c Données de progression en base | 4 | Lisibles (`UserPathProgress`, intégrité propre : 0 doublon) mais **aucune date par étape** : `startedAt` et `completedAt` seulement. Délai entre étapes, rythme hebdo et retour à J7 incalculables |
| C9d Lecture régulière (rapport, alertes) | 1 | Section « Funnel de la semaine » du lundi (`weekly-funnel.ts:125-147`) sans une ligne sur les parcours ; aucune alerte parcours |
| C9e Réconciliation Umami / base | 2 | Base : 1 étape validée le 24/09 18:54 UTC ; Umami : 0 `parcours-etape` en 90 j. Les deux sources ne se recoupent pas |

## 3. Tunnel réel des parcours sur 90 jours (07/07 au 07/10/2026)

**Méthode de tri du trafic.** Les 37 sessions « touchant un parcours » (`parcours-umami-journeys.json`) sont réparties ainsi :
- **7 sessions de test du 07/10** : toutes le 07/10, 6 mobiles iOS (US) et 1 portable (US). Classement par date et pays, cohérent avec les séances QA s16/s17 [HYPOTHÈSE : non confirmé par Thomas].
- **7 sessions probablement scriptées** : portable Chrome (US), `views = 1`, séquence identique de 10 pages (`/`, `/vannes`, `/parcours/machine-a-cafe`, `/conseils`, `/parcours/repartie`, `/videos`, `/parcours/confiance`, `/parcours`, `/blog/comment-devenir-drole`, `/blog`) ou variante, en moins d'une minute, aux dates 26/08, 29/08, 03/09, 09/09, 16/09, 24/09 (00:29) et 01/10 [HYPOTHÈSE : robots ou outil de contrôle, non vérifié].
- **23 sessions plausiblement humaines** (FR 18, BE 2, GA 1, CA 1, SG 1). Le reste du texte les appelle « humaines ».

Corroboration : le pays US pèse 10 visites sur 30 pour `/parcours`, 9/16 pour `machine-a-cafe`, 7/16 pour `repartie`, 7/11 pour `confiance`, pour un site francophone.

| # | Marche | 90 j, toutes sessions | Hors test 07/10 | Humaines seules | Source / remarque |
|---|---|---|---|---|---|
| 0 | Visites du site | **2 471** (2 131 visiteurs, 3 078 pages vues) | non séparable | non séparable | Umami `stats` |
| 1 | Sessions qui voient une page parcours (hub ou parcours) | **37** (1,5 % des visites) | 30 | **23** (0,9 % des visites) | `journeys`. Pages vues : `/parcours` 45, `machine-a-cafe` 21, `repartie` 19, `confiance` 12 = 97 |
| 2 | Sessions qui ouvrent la page d'un parcours (pas seulement le hub) | 24 | 19 | **13** (57 % des 23) | `journeys`. 10 sessions humaines restent sur le hub |
| 3 | Étape 1 ouverte (dépliée, lue) | **non mesuré** | non mesuré | non mesuré | aucun événement |
| 4 | Quiz de l'étape 1 terminé | **non mesuré** | non mesuré | non mesuré | quiz en `sessionStorage` seulement (`parcours-detail.tsx:301-322`), aucun événement |
| 5 | Mur de validation de l'étape 1 vu (« Valider fait partie de Premium ») | **non mesuré** | non mesuré | non mesuré | bloc `:798-810` sans événement |
| 6 | Mur de l'étape 2 vu (`mur-vu` type `parcours-etape`) | **0** | 0 | 0 | impossible pour un visiteur (FS-01) ; 0 `mur-vu` en 90 j |
| 7 | Passage par `/abonnement` après une page parcours, dans la même session | 4 | 3 | **2** | lecture des séquences (de 0 à 32 min d'écart). Pas d'événement qui dise d'où vient le clic |
| 8 | Paiement après un passage par un parcours | **0** hors test | 0 | **0** | 1 `abonnement-reussi` (événement en ligne depuis le 05/10, donc probablement l'achat test du 07/10) et 5 vues de `/abonnement/success` en 90 j. Seul achat réel visible dans les séquences : le 14/08, où les 3 pages parcours ont été ouvertes **après** le paiement |
| 9 | Abonné qui valide une première étape (activation) | **0 sur 2** abonnés Premium | | | base : 2 abonnements actifs (lancement à 0,99 €), 0 progression Premium |
| 10 | Étape 2 validée (passage 1 → 2) | **0** | | | base : étape 1 de « Confiance » validée 1 fois, aucune autre |
| 11 | Parcours terminé | **0** | | | base : `completedAt` nul partout |
| 12 | Retour à J7, rythme hebdomadaire | **non mesuré** | | | aucune date par étape, streak max 1 jour (FS-05) |
| 13 | Parcours suivant après une fin | **non mesuré** (0 fin) | | | |

**Ce que le tunnel dit, sans surinterpréter.**
- Les 3 pages parcours reçoivent en moyenne **1 session humaine avec page détail par semaine** (13 sur 12,9 semaines). Une conversion même parfaite ne peut rien produire à ce volume : le goulot est l'entrée, pas le mur (cohérent avec PM-09).
- **La seule progression de la base** (24/09 18:54 UTC) correspond à la session BE mobile du 24/09, de 18:05 à 18:58 : connexion Google à 18:38, 8 passages sur `/conseils`, 2 sur le quiz d'humour, `/parcours/confiance` à 18:52 et 18:55 [HYPOTHÈSE : même personne, concordance d'heure, non prouvée]. Une session BE mobile Chrome revient le 26/09 sur le hub et `machine-a-cafe`, pas sur « Confiance » [HYPOTHÈSE : même personne]. Si c'est elle, l'étape 2 était derrière un mur qu'aucun événement n'a mesuré.
- **Réconciliation impossible** : une validation en base le 24/09, 0 `parcours-etape` dans Umami. Soit l'événement a été posé après cette date (historique git non consulté), soit il ne part pas dans certains cas (DA-09).
- L'achat réel du 14/08 est suivi, 4 à 12 minutes plus tard, de 3 visites de pages parcours sans progression enregistrée (0 abonné Premium avec progression) [HYPOTHÈSE : cet abonné est l'un des 2 abonnés de lancement].

## 4. Constats (DA-01 à DA-10)

Format : **Problème / Effet pour l'utilisateur (Thomas ici : celui qui pilote) / Ce qu'on fait**, puis le détail technique. Les constats FS-01 et FS-06 du @fullstack sont repris sans être dupliqués : DA-01 et DA-02 les complètent par le chiffrage.

### P1

#### DA-01 (P1) : les deux seuls événements « parcours » mesurent ce qui n'arrive pas
- **Problème** : `parcours-etape` ne part que quand un abonné valide une étape. `mur-vu` de l'étape 2 ne part que si l'étape 2 s'ouvre, ce qu'un visiteur ne peut pas faire (FS-01).
- **Effet** : 90 jours à 0 sur ces deux lignes, qui ressemblent à « personne ne s'intéresse » alors que la vraie cause est « personne ne peut atteindre ce point ».
- **Ce qu'on fait** : corriger FS-01, puis mesurer le mur qu'un visiteur voit vraiment (celui de la validation de l'étape 1) et la lecture de l'étape 1. Agent : @fullstack (après décision FS-01 de Thomas). Effort : rapide.
- **Détail technique** : `parcours-detail.tsx:95`, `:403`, `:540-542`, `:798-810`.

#### DA-02 (P1) : toutes les marches avant le paiement sont aveugles
- **Problème** : ni l'arrivée sur un parcours, ni l'étape lue, ni le quiz, ni le mur de validation, ni le résultat du quiz d'orientation, ni la fin d'un parcours ne déclenchent d'événement. 37 sessions, 0 événement.
- **Effet** : impossible de dire où les visiteurs décrochent ni si les parcours font vendre. Les 10 sessions humaines qui restent sur le hub sans ouvrir un parcours ne se voient que par la lecture manuelle des séquences.
- **Ce qu'on fait** : poser les 6 événements du §5, tous reliés au vocabulaire déjà en place. Agent : @fullstack. Effort : rapide.
- **Détail technique** : voir §5 (fichier:ligne par événement).

#### DA-03 (P1) : 14 sessions sur 37 sont du test ou du scripté
- **Problème** : 7 sessions du 07/10 (tests) et 7 séquences identiques de 10 pages en une minute, venues des États-Unis. Aucun filtre dans Umami ni dans le rapport.
- **Effet** : 38 % des sessions ne sont pas des visiteurs réels : la « découverte » (K1) est de 23 sessions, pas 37. Le 07/10, jour des tests, les parcours affichent un pic qui n'existe pas. Les tests à venir (compte Premium de test) vont aggraver cela.
- **Ce qu'on fait** : (1) sur chaque navigateur de test, y compris les tests automatiques Playwright, désactiver l'envoi (réglage Umami `localStorage umami.disabled`, à confirmer dans la documentation Umami Cloud) ; (2) limiter l'envoi au domaine de production (réglage `data-domains` du script) ; (3) dans le rapport du lundi, lire les parcours « hors États-Unis » en plus du total tant que le trafic est faible. Agent : @fullstack (1 et 2), @data-analyst (3). Effort : rapide.
- **Détail technique** : script Umami `app/layout.tsx:143-159`, filtre existant `data-before-send` (`:146-157`) qui n'écarte que l'aperçu blog ; `lib/umami.ts:46-50`.

#### DA-04 (P1) : la base ne garde aucune date par étape
- **Problème** : `UserPathProgress` conserve la date du premier passage (`startedAt`) et celle de la fin (`completedAt`), pas celle de chaque étape validée.
- **Effet** : on ne saura jamais combien de temps un abonné met entre l'étape 1 et 2, s'il tient un rythme d'une étape par semaine, ni s'il revient une semaine après. Ce sont pourtant les critères qui disent si l'offre marche (K9, K12, K14).
- **Ce qu'on fait** : une petite table `UserPathStepCompletion` (une ligne par étape validée, avec sa date, unique par utilisateur + parcours + étape). Elle règle aussi le risque de double validation (FS-08). Agent : @fullstack. Effort : rapide (1 migration, 1 écriture dans la transaction existante).
- **Détail technique** : `prisma/schema.prisma:279-293` ; écriture à ajouter dans `api/parcours/[id]/progress/route.ts:160-172` (même transaction). Aucune donnée à reprendre : 1 seule ligne de progression.

#### DA-05 (P1) : le rapport du lundi ne dit rien des parcours
- **Problème** : la section « Funnel de la semaine » (10 lignes) couvre l'abonnement, jamais les parcours.
- **Effet** : même avec les événements, personne ne lit les chiffres. Les requêtes d'activation, de passage 1 → 2, de complétion et de suite existent déjà en lecture possible aujourd'hui (K7, K8, K10, K11), sur 2 abonnés.
- **Ce qu'on fait** : ajouter un bloc « Parcours » dans le même e-mail du lundi (§6), chiffres en nombres absolus avec le nombre de personnes concernées à côté de chaque pourcentage. Agent : @fullstack. Effort : moyen.
- **Détail technique** : `lib/analytics/weekly-funnel.ts:22-66,125-147` ; appel dans `weekly-visits-job.ts:88-102`.

### P2

#### DA-06 (P2) : on ne sait pas d'où viennent les gens qui arrivent sur un parcours
- **Problème** : les liens vers un parcours (article de blog, accueil, quiz d'onboarding, page Liens, fin de parcours) n'ont pas de repère de provenance. Le bouton « S'abonner » de l'aperçu verrouillé (`parcours-detail.tsx:112`) n'en a pas non plus : l'arrivée sur `/abonnement` est comptée `src=direct`.
- **Effet** : impossible de savoir quel article envoie du monde vers l'étape 1, alors que c'est le levier à pousser (PM-09). Les achats venus de l'aperçu seraient attribués à « direct ».
- **Ce qu'on fait** : ajouter `?src=` aux liens d'entrée (liste au §5) et `src=parcours-apercu` au bouton de l'aperçu. Agent : @fullstack. Effort : rapide.
- **Détail technique** : `blog-article-parcours-maillage.tsx:191`, `article-cta.tsx:74`, `humor-quiz.tsx:175`, `parcours-content.tsx:191`, `parcours-detail.tsx:835,859`, `liens-page-content.tsx:16`. Le paramètre est lu côté navigateur (`window.location.search`) pour ne pas rendre la page dynamique et casser le cache ; vérifier que la balise canonique ignore `?src=` (@seo).

#### DA-07 (P2) : aucune alerte sur les parcours
- **Problème** : une erreur à la validation d'une étape finit dans `console.error` (`progress/route.ts:211`) ; un abonné qui ne démarre jamais n'est signalé à personne ; un événement qui cesse de partir passe inaperçu.
- **Effet** : un abonné qui a payé et n'arrive pas à valider peut résilier en silence.
- **Ce qu'on fait** : 3 alertes dans l'e-mail quotidien existant (§7). Agent : @fullstack. Effort : rapide.
- **Détail technique** : `admin-alerts.ts:167` (`recordAdminAlert`), classe B.

#### DA-08 (P2) : risque de décider sur des pourcentages à n = 1 à 2
- **Problème** : le bloc du lundi et les futurs tableaux afficheraient des taux sur 1 à 2 personnes (le @product-manager a défini 15 seuils « bon » en pourcentage).
- **Effet** : « 50 % d'activation » veut dire 1 abonné sur 2. Une décision prise dessus est du bruit.
- **Ce qu'on fait** : règle d'affichage du §8 : tout taux est suivi de « sur n », et masqué sous n = 10. Agent : @data-analyst (règle), @fullstack (rendu). Effort : rapide.

#### DA-09 (P2) : base et Umami ne se recoupent pas
- **Problème** : 1 étape validée en base (24/09 18:54 UTC), 0 `parcours-etape` dans Umami sur 90 jours.
- **Effet** : on ne peut pas dire si le suivi Umami est fiable à 100 % pour les abonnés.
- **Ce qu'on fait** : après la mise en place du §5, comparer chaque lundi le nombre d'étapes validées en base avec le nombre de `parcours-etape` Umami ; un écart non nul sur 2 semaines = suivi à réparer. Agent : @data-analyst. Effort : rapide.
- **Détail technique** : [HYPOTHÈSE : l'événement `parcours-etape` a été posé après le 24/09 ; historique git non consulté]. `parcours-detail.tsx:403` n'émet qu'après réponse serveur `ok` ; un bloqueur de publicité supprime aussi l'événement (s16 C4).

#### DA-10 (P2) : deux conventions de nommage coexistent
- **Problème** : tunnel en kebab-case français (`mur-vu`, `abonnement-clic`), anciens événements en snake_case (`share_vanne`), et la règle de la fiche agent demande du snake_case.
- **Effet** : confusion à la lecture, risque de doublons de noms.
- **Ce qu'on fait** : garder le kebab-case français pour tout événement nouveau (cohérence avec la vingtaine d'événements déjà en code et le rapport du lundi qui les lit par nom), ne rien renommer. Décision d'architecture à confirmer par Thomas si besoin. Agent : @data-analyst. Effort : aucun.

## 5. Plan de tracking minimal et unifié (implémentable par @fullstack sans question)

**Principes.**
- **Umami** pour tout ce qui précède le paiement (le visiteur n'a pas de compte : la base ne le connaît pas). **La base** pour tout ce qui suit le paiement (progression, fin, retour) : source de vérité, pas de doublon d'événement serveur. Cohérent avec s16 (aucun événement serveur dans la chaîne actuelle).
- Aucun événement existant renommé. Événements déjà en place et conservés : `parcours-etape`, `mur-vu`, `onboarding-termine` (`humor-quiz.tsx:163`), `abonnement-vu`, `abonnement-clic`, `abonnement-reussi`, `inscription-*`, `connexion-*`.
- **Vocabulaire des propriétés (identique à l'existant)** : `parcours` = slug (`machine-a-cafe`, `repartie`, `confiance`) ; `etape` = numéro (nombre) ; `statut` = `visiteur` | `membre` (connecté sans Premium, anciens comptes gratuits) | `premium` ; `src` = provenance, minuscules et tirets ; `declencheur` = `auto` | `manuel`. Aucune donnée personnelle (pas d'e-mail, pas d'identifiant), comme `lib/umami.ts`.
- `statut` n'est émis qu'une fois la session résolue (`useSession().status !== "loading"`, `parcours-detail.tsx:323`), sinon tous les visiteurs apparaîtraient `visiteur`.
- Tous les événements passent par `trackUmami` (`lib/umami.ts:46`) : ils héritent du filtre de l'aperçu admin et ne partent pas côté serveur.

### 5.1 Six nouveaux événements

| Événement | Quand | Propriétés (valeurs) | Où (fichier:ligne) | Permet de calculer |
|---|---|---|---|---|
| `parcours-ouvert` | Une fois par affichage de la page d'un parcours, session résolue | `parcours` ; `statut` ; `src` ∈ `hub`, `blog`, `accueil`, `header`, `onboarding`, `suite`, `liens`, `direct` (lu dans `?src=`, défaut `direct`, valeur hors liste ramenée à `direct`) | `parcours-detail.tsx`, nouveau `useEffect` après `:333` (une fois par montage, `useRef`) | **K1** (avec les pages vues), **K2** (par `src`) |
| `etape-ouverte` | L'étape est dépliée à l'écran | `parcours` ; `etape` ; `statut` ; `declencheur` = `auto` (dépliée d'office à l'arrivée, `:291-297`) ou `manuel` (clic) | `:564-567` et `:572` (clic et clavier : `manuel`) ; effet sur `expandedStep` pour l'ouverture `auto` initiale. Une fois par étape et par affichage | **K2**, **K3** (étape 1 `manuel` + quiz) |
| `quiz-etape-termine` | La dernière question du quiz de l'étape est passée | `parcours` ; `etape` ; `score` (nombre) ; `total` (nombre) ; `statut` | `StepQuiz` `:155` (`setFinished(true)`) : faire passer le score à `onComplete` (`:130`, `:171`) et émettre depuis l'appel `:740-742` qui connaît `slug` | **K4** (visiteur comme abonné), **K3** |
| `orientation-resultat` | Le quiz « Quel parcours est fait pour toi ? » rend son verdict | `parcours` (slug recommandé) ; `statut` | `parcours-content.tsx:56` (`setResult(recommendParcours(...))`) | **K2** (orientation puis ouverture), lecture de PM-11 |
| `parcours-termine` | La dernière étape est validée (réponse serveur `pathCompleted: true`) | `parcours` ; `jours` (nombre, jours entre `progress.startedAt` et maintenant) ; `etapes` (nombre d'étapes) | `parcours-detail.tsx:401-403`, à côté de `parcours-etape` | **K10**, **K11** (avec `src=suite` de `parcours-ouvert`) |
| `parcours-erreur` | Échec de chargement ou de validation visible par l'utilisateur | `parcours` ; `etape` (0 si chargement) ; `motif` ∈ `limite` (429), `refus` (403), `serveur` (autre statut), `reseau`, `chargement` | `:413` (429), `:415` (autres statuts), `:418` (réseau), `:355` (échec du contenu abonné, FS-09) | Qualité de **K7**, **K8** (un abonné qui n'arrive pas à valider) ; alerte DA-07 |

Réservé, **non à implémenter maintenant** : `etape-retour {parcours, etape, resultat ∈ pas-essaye | essaye-bof | essaye-ca-a-marche}`, à poser avec la fonction F4 du @product-manager (retour sur l'exercice), qui donnera **K15**. Écartés : `hero-pastille-clic` (remplacé par `?src=` sur le lien d'entrée) et `parcours-commencer-clic` (le clic « Commencer » amène sur la page, déjà comptée par `parcours-ouvert src=hub`).

### 5.2 Propriétés ajoutées à des événements existants (aucun renommage)

| Événement existant | Ajout | Où | Permet |
|---|---|---|---|
| `parcours-etape` | `etapes` (total d'étapes), `termine` = `oui` / `non` (`data.pathCompleted`), `duree_s` (secondes depuis l'ouverture de cette étape dans la même page, plafond 3 600 ; absent si l'étape n'a pas été ouverte dans cette page) | `parcours-detail.tsx:403` | **K8** (étape 2), **K10**, **K14** approché (durée d'une séance, pas d'une étape sur plusieurs jours) |
| `mur-vu` | nouvelle valeur `type: "parcours-validation"` (`src` = slug, `etape: 1`) pour le mur de validation de l'étape 1 | nouveau petit composant à poser dans le bloc `:798-810` (même mécanique que `LockedStepPreview` `:94-96`) | **K5** : c'est **le mur réellement vu par un visiteur** |
| `abonnement-vu` (via le lien) | `src=parcours-apercu` sur le bouton de l'aperçu verrouillé : `buildAbonnementUrl(\`/parcours/${slug}\`, "monthly", "parcours-apercu")` | `parcours-detail.tsx:112` (aujourd'hui sans `src`, donc `direct`). Le lien de validation `:325` porte déjà `parcours-etape` | **K6** : provenance du paiement |

Pour `parcours-ouvert` et `parcours-termine`, ajouter les deux noms à `ATTRIBUTED_EVENTS` (`lib/umami.ts:21-37`), pour qu'ils reçoivent `origine` et `contenu` comme `parcours-etape`.

### 5.3 Liens d'entrée à marquer `?src=` (lecture côté navigateur, sans toucher au cache)

| Lien | Fichier:ligne | `src` |
|---|---|---|
| Maillage article vers parcours | `components/blog/blog-article-parcours-maillage.tsx:191` | `blog` |
| Bloc CTA d'article (abonné : « Continuer mon parcours » vers le hub ; autres : vers `parcoursHref`) | `components/blog/article-cta.tsx:74` et `parcoursHref` `:52` | `blog` |
| Quiz d'onboarding | `components/onboarding/humor-quiz.tsx:175` | `onboarding` |
| Cartes du hub (« Commencer ce parcours ») | `components/parcours/parcours-content.tsx:191` | `hub` |
| Fin de parcours (« Passer au parcours suivant ») | `parcours-detail.tsx:835`, `:859` | `suite` |
| Page Liens | `components/liens/liens-page-content.tsx:16` | `liens` |
| Pastilles et CTA de l'accueil | `components/home/hero-section.tsx` (lignes `:21`, `:73`, `:76` selon le @product-manager, **à localiser** par @fullstack : aucune ne porte de lien `/parcours` dans la recherche) | `accueil` |
| Entrée du menu et du pied de page | `layout/header.tsx:25`, `layout/footer.tsx:9` | pas de `?src=` : la provenance « menu » se lit par `parcours-ouvert src=direct` précédé de la page d'origine (`referrer` interne) ; laisser tel quel |

### 5.4 Entonnoir à créer dans Umami (aucun développement)

Funnel « Parcours vers Premium », fenêtre d'un jour [À VÉRIFIER : réglage de fenêtre disponible dans l'offre Umami Cloud en usage] : `parcours-ouvert` → `quiz-etape-termine` → `mur-vu` → page `/abonnement` → page `/abonnement/success`. Lecture en **volumes absolus** (§8). Second entonnoir de profondeur : `parcours-ouvert` → `etape-ouverte` (`manuel`) → `quiz-etape-termine`.

### 5.5 Données de progression (base)

- **Nouvelle table** `UserPathStepCompletion` : `id`, `userId`, `learningPathId`, `stepOrder`, `completedAt` (défaut maintenant), unique (`userId`, `learningPathId`, `stepOrder`). Écriture dans la transaction de `progress/route.ts:160-172`. Requêtes : §6.
- Aucune reprise de données (1 ligne de progression, 24/09, étape 1 de « Confiance » : à copier à la main si on veut garder la trace).
- Ne pas stocker de contenu libre ni de réponse de quiz (K15 viendra avec F4 et ses propres règles RGPD, avis @legal avant mise en ligne).

### 5.6 Couverture K1-K15 après mise en place

| K | Mesure | Source |
|---|---|---|
| K1 découverte | sessions avec `parcours-ouvert` divisées par visites (hors États-Unis tant que le trafic est faible) | Umami |
| K2 démarrage | `etape-ouverte` ou `quiz-etape-termine` par `parcours-ouvert`, ventilé par `src` | Umami |
| K3 lecture étape 1 | `etape-ouverte manuel` et `quiz-etape-termine` étape 1 | Umami |
| K4 étape 1 terminée | `quiz-etape-termine etape=1` par `etape-ouverte etape=1` | Umami (visiteur), base (abonné) |
| K5 arrivée au mur | `mur-vu type=parcours-validation` (et `parcours-etape` après FS-01) | Umami |
| K6 mur vers paiement | `mur-vu` → `abonnement-vu src=parcours-*` → `abonnement-reussi` | Umami entonnoir + Stripe |
| K7 activation | requête Q1 | base |
| K8 passage 1 → 2 | requête Q2 | base |
| K9 rythme | requête Q5 (nécessite la table) | base |
| K10 parcours terminé | requête Q3 (+ `parcours-termine`) | base |
| K11 parcours suivant | requête Q4 | base |
| K12 retour J7 | requête Q6 (nécessite la table) | base |
| K13 rétention payante | existant : résiliations du bloc du lundi (`weekly-funnel.ts:131-134`) + date de `completedAt` | base + Stripe |
| K14 temps réel | `duree_s` (approximatif) puis table | Umami puis base |
| K15 résultat vécu | **hors périmètre** tant que F4 n'existe pas (`etape-retour` réservé) | produit |

## 6. Requêtes de lecture pour le rapport du lundi (bloc « Parcours »)

**Où.** Dans le **même e-mail du lundi** (aucun envoi supplémentaire, règle du 06/10) : nouveau fichier `lib/analytics/weekly-parcours.ts` sur le modèle de `weekly-funnel.ts` (comptages injectables pour les tests, « n.d. » si une source échoue, jamais d'exception), appelé à côté de `buildWeeklyFunnel` dans `weekly-visits-job.ts:88-102` et ajouté avant `buildFunnelSectionHtml`. En production, écrire les comptages en Prisma (`count`, `groupBy`) ou `$queryRaw` paramétré ; les SQL ci-dessous sont la spécification, en **lecture seule**. Tables non renommées par Prisma (aucun `@@map`) : noms entre guillemets.

Paramètres : `$1` début de semaine, `$2` fin de semaine, `$3` liste d'e-mails de test à exclure (à fournir par Thomas : aucune adresse de test n'est connue de l'audit ; `'{}'::text[]` en attendant).

**Q1. Activation (K7)** : abonnés d'au moins 48 h qui ont validé une première étape dans les 48 h suivant leur abonnement. (`startedAt` = date de la première validation ; le serveur accepte des étapes dans le désordre, d'où le contrôle sur l'étape 1.)
```sql
SELECT COUNT(*) AS abonnes_eligibles,
       COUNT(*) FILTER (WHERE EXISTS (
         SELECT 1 FROM "UserPathProgress" p
         WHERE p."userId" = s."userId" AND 1 = ANY (p."completedSteps")
           AND p."startedAt" <= s."createdAt" + interval '48 hours'
       )) AS actives_48h
FROM "Subscription" s JOIN "User" u ON u.id = s."userId"
WHERE s.plan = 'PREMIUM' AND s.status <> 'INACTIVE'
  AND s."createdAt" >= $1 - interval '28 days' AND s."createdAt" < $2
  AND s."createdAt" <= now() - interval '48 hours'
  AND u.email <> ALL ($3::text[]);
```

**Q2. Passage de chaque étape à la suivante (K8)** : cumul, abonnés Premium, par parcours.
```sql
SELECT lp.slug, k AS etape,
       COUNT(*) FILTER (WHERE k = ANY (p."completedSteps")) AS ont_valide
FROM "LearningPath" lp
JOIN "UserPathProgress" p ON p."learningPathId" = lp.id
JOIN "User" u ON u.id = p."userId" AND u.plan = 'PREMIUM' AND u.email <> ALL ($3::text[])
CROSS JOIN LATERAL generate_series(1, (SELECT COUNT(*) FROM "LearningPathStep" st WHERE st."learningPathId" = lp.id)::int) k
WHERE lp."isActive"
GROUP BY lp.slug, k ORDER BY lp.slug, k;
```
Lecture : passage 1 → 2 = `ont_valide(2) / ont_valide(1)` pour un parcours, avec le nombre `ont_valide(1)` affiché à côté.

**Q3. Complétion (K10)** : commencés, terminés, médiane de jours.
```sql
SELECT lp.slug, COUNT(*) AS commences, COUNT(p."completedAt") AS termines,
       percentile_cont(0.5) WITHIN GROUP (ORDER BY extract(epoch FROM (p."completedAt" - p."startedAt")) / 86400) AS mediane_jours
FROM "UserPathProgress" p JOIN "LearningPath" lp ON lp.id = p."learningPathId" AND lp."isActive"
JOIN "User" u ON u.id = p."userId" AND u.email <> ALL ($3::text[])
GROUP BY lp.slug;
```

**Q4. Parcours suivant (K11)** : parmi les parcours terminés depuis au moins 7 jours, part des abonnés qui en ont démarré un autre dans les 7 jours.
```sql
SELECT COUNT(*) AS finis_depuis_7j,
       COUNT(*) FILTER (WHERE EXISTS (
         SELECT 1 FROM "UserPathProgress" q
         WHERE q."userId" = f."userId" AND q.id <> f.id
           AND q."startedAt" > f."completedAt" AND q."startedAt" <= f."completedAt" + interval '7 days'
       )) AS autre_demarre
FROM "UserPathProgress" f
WHERE f."completedAt" IS NOT NULL AND f."completedAt" <= now() - interval '7 days';
```

**Q5. Rythme (K9), après création de `UserPathStepCompletion`** : semaines actives sur semaines écoulées (plafonnées à 6), abonnés dont la première validation a plus de 14 jours.
```sql
WITH debut AS (SELECT "userId", MIN("completedAt") AS t0 FROM "UserPathStepCompletion" GROUP BY "userId")
SELECT d."userId",
       COUNT(DISTINCT floor(extract(epoch FROM (c."completedAt" - d.t0)) / 604800)) AS semaines_actives,
       LEAST(floor(extract(epoch FROM (now() - d.t0)) / 604800) + 1, 6) AS semaines_ecoulees
FROM debut d JOIN "UserPathStepCompletion" c ON c."userId" = d."userId"
WHERE d.t0 <= now() - interval '14 days'
GROUP BY d."userId", d.t0;
```
Le rapport affiche la somme des `semaines_actives` sur la somme des `semaines_ecoulees` et le nombre d'abonnés.

**Q6. Retour à J7 (K12), après création de la table** : validation d'une nouvelle étape entre 12 h et 8 jours après la première (12 h pour exclure la même séance).
```sql
WITH debut AS (SELECT "userId", MIN("completedAt") AS t0 FROM "UserPathStepCompletion" GROUP BY "userId")
SELECT COUNT(*) AS eligibles,
       COUNT(*) FILTER (WHERE EXISTS (
         SELECT 1 FROM "UserPathStepCompletion" c
         WHERE c."userId" = debut."userId"
           AND c."completedAt" >  debut.t0 + interval '12 hours'
           AND c."completedAt" <= debut.t0 + interval '8 days')) AS revenus_7j
FROM debut WHERE t0 <= now() - interval '8 days';
```
Limite : un retour sans validation d'étape n'est pas vu (la série de jours ne compte que les connexions, FS-05).

### 6.1 Contenu du bloc du lundi

Chaque ligne affiche un nombre **et** son dénominateur (« 1 sur 2 »), jamais un pourcentage seul. Les seuils « cible » reprennent ceux du @product-manager et sont des **[HYPOTHÈSE]** (aucun repère public pour un parcours d'humour à 2,99 €/mois). Le seuil d'alerte est fixé à la moitié de la cible [HYPOTHÈSE : à recaler après 8 semaines de données] et ne s'applique qu'à partir de n = 30 (§8). Avant cela, la règle est une action individuelle.

| Ligne du bloc | Formule | Seuil d'alerte (n ≥ 30) | Action recommandée si franchi |
|---|---|---|---|
| Sessions qui voient un parcours | `parcours-ouvert` de la semaine (total et par `src`), à côté des pages vues `/parcours*` | `parcours-ouvert` = 0 alors que les pages vues > 0 : alerte 3 (§7). Découverte K1 < 7,5 % des visites (moitié de la cible 15 %) | Regarder quel `src` s'effondre ; relancer le maillage article vers parcours (@growth, @seo) |
| Étape 1 lue | `etape-ouverte manuel` étape 1 / `parcours-ouvert` | < 25 % (cible K3 50 %) | Revoir l'accroche de la page parcours et la lisibilité de l'étape 1 (@ux) |
| Quiz de l'étape 1 terminé | `quiz-etape-termine` étape 1 / `etape-ouverte` étape 1 | < 20 % (cible K4 40 %) | Raccourcir ou rendre le quiz plus engageant (@ux, @copywriter) |
| Murs de validation vus et clics vers l'offre | `mur-vu parcours-validation` ; `abonnement-vu src=parcours-*` | aucun seuil en taux avant 300 murs (§8) ; lecture en volumes | Si 0 mur vu alors que `quiz-etape-termine` > 0 : mur cassé (@fullstack) |
| Activation | Q1 `actives_48h` / `abonnes_eligibles` | un abonné de 3 à 14 jours sans aucune étape : alerte 1 (§7) | Brouillon d'e-mail d'accueil (étalon validé par Thomas) et vérification qu'il peut valider (FS-09) |
| Passage 1 → 2 | Q2 `ont_valide(2)` / `ont_valide(1)` | < 35 % (cible K8 70 %) | Entretien avec l'abonné ; rythme conseillé et rappel (F1, F2 du @product-manager) |
| Parcours terminés | Q3 `termines` / `commences`, médiane de jours | < 20 % (cible K10 40 %) | Regarder l'étape où l'on décroche (Q2) |
| Parcours suivant | Q4 `autre_demarre` / `finis_depuis_7j` | < 25 % (cible K11 50 %) | Suite personnalisée (F7) |
| Retour à J7 | Q6 `revenus_7j` / `eligibles` | < 20 % (cible K12 40 %) | Rappel hebdomadaire sur demande (F2) |
| Erreurs vues par l'utilisateur | `parcours-erreur` de la semaine, par `motif` | ≥ 1 `refus` ou `serveur` chez un abonné | Corriger avant toute autre chose (un abonné qui paie et ne valide pas résilie) |
| Cohérence des sources | étapes validées en base de la semaine moins `parcours-etape` Umami | écart non nul 2 semaines de suite | Réparer le suivi Umami (DA-09) |

## 7. Trois alertes pour l'e-mail quotidien unique

**Règle respectée** (décision du 06/10, `docs/founder-preferences.md`) : aucune alerte ne part seule. Chacune est **enregistrée** par `recordAdminAlert` (`lib/admin-alerts.ts:167`), puis reprise par le digest du matin (`admin-digest.ts`). Les trois ont des clés qui commencent par `parcours-`, absentes de `CLES_ACTION_THOMAS` (`:66-80`) : elles sont donc de **classe B** (lues par la session, filet à 48 h vers l'e-mail), car l'action est une correction ou un brouillon, pas un geste que seul Thomas peut faire. Aucune alerte n'est basée sur un pourcentage (volumes trop faibles) : toutes sont des comptes.

| # | Clé | Condition (comptes) | Source et où la calculer | Message et action |
|---|---|---|---|---|
| 1 | `parcours-sans-demarrage` | Un abonné Premium actif dont l'abonnement a 3 jours (créé entre 96 h et 72 h avant le contrôle) et qui n'a validé **aucune étape**. Fenêtre de 24 h : une seule alerte par abonné. E-mails de test exclus | Base (`Subscription.createdAt`, `UserPathProgress`) ; job quotidien exécuté avant le digest (ex. la réconciliation de 4 h UTC de s16, **fichier à confirmer** par @fullstack) | « Un abonné de 3 jours n'a validé aucune étape. » Action : la session prépare un brouillon d'e-mail d'accueil (étalon validé par Thomas, e-mail jamais envoyé sans accord) et vérifie qu'il pouvait valider (FS-09, FS-01) |
| 2 | `parcours-progress-erreur` | Au moins 1 erreur serveur sur la validation d'une étape dans la journée | Base et serveur : `recordAdminAlert` dans le `catch` de `api/parcours/[id]/progress/route.ts:210-213`, qui ne fait que `console.error` aujourd'hui. Détail : message d'erreur, jamais d'identifiant ni d'e-mail | « La validation d'une étape a échoué côté serveur. » Action : la session lit le journal et corrige avant le prochain abonné |
| 3 | `parcours-suivi-muet` | Sur 7 jours glissants : au moins 5 pages vues de pages parcours (`/parcours/<slug>`) mais **0** événement `parcours-ouvert`. Actif seulement après la mise en ligne du §5 | Umami, lecture déjà utilisée par le rapport du lundi (`lib/analytics/umami.ts`, `fetchUmamiMetrics` et `fetchUmamiPathMetrics`) ; même job quotidien | « Les pages parcours sont vues mais l'événement n'arrive plus. » Action : vérifier le script Umami et le code de `parcours-detail.tsx` (une page vue et un événement dépendent du même script : un écart veut dire que le code est cassé, pas que personne ne vient) |

Écartées volontairement : alerte « taux de passage trop bas » (n trop petit), alerte « résiliation après fin de parcours » (K13, 0 fin de parcours à ce jour : une ligne du bloc du lundi suffit), alerte « 0 visite parcours » (c'est l'état normal actuel, pas un incident).

## 8. Seuil de volume : quand un taux devient interprétable

Aujourd'hui : **n ≈ 1** (1 progression en base, 2 abonnés, 0 abonné aux prix actuels, 13 sessions humaines avec page détail en 90 jours).

**Marge d'erreur à 95 % pour un taux proche de 50 %** (cas le plus défavorable, formule `1,96 × √(0,25 / n)`) :

| n (personnes dans le dénominateur) | Marge | Usage |
|---|---|---|
| < 10 | plus de ±31 points | **ne rien afficher en pourcentage** : « 1 sur 2 » |
| 10 à 29 | ±18 à ±31 points | afficher « x sur n », pas de décision |
| **30** | **±18 points** | **seuil d'interprétation** : le taux devient une tendance grossière (±18 points ; comparer deux périodes demande environ 2 fois plus) |
| 96 à 100 | ±10 points | **seuil de décision** (changer une page, un seuil) |
| 384 | ±5 points | lecture fine |

**Cas des petits taux** (conversion du mur vers le paiement, cible hypothétique 3 %) : pour affirmer « moins de 1 % » avec 0 paiement, il faut **300 murs vus** (règle des trois : borne haute ≈ 3 / n) ; pour une marge de ±1 point sur un taux de 3 %, il faut environ 1 120 murs vus (±2 points : environ 280).

**Où en est chaque dénominateur, au rythme des 90 derniers jours** (sessions humaines uniquement, hors test et scripté) :

| Taux (critère) | Dénominateur | Rythme actuel | n = 30 atteint dans | n = 100 atteint dans |
|---|---|---|---|---|
| Découverte (K1) | visites du site | 27 par jour (2 471 en 90 j) | **déjà atteint** (marge de ±0,4 point sur 0,9 %) | déjà atteint |
| Démarrage (K2) | sessions avec page parcours | 1,8 par semaine (23 en 90 j) | environ 17 semaines | environ 56 semaines |
| Lecture, quiz, mur (K3, K4, K5) | sessions avec page détail | 1,0 par semaine (13 en 90 j) | environ 30 semaines | environ 100 semaines |
| Mur vers paiement (K6) | murs vus | au plus 1,0 par semaine (borne haute : chaque session détail verrait le mur) | 30 semaines au mieux | 300 murs : plus de 5 ans |
| Activation, passage 1 → 2, complétion, suite, J7 (K7, K8, K10, K11, K12) | abonnés | **non estimable** : 0 abonné aux prix actuels, 2 abonnés de lancement | dépend de l'acquisition (l'objectif de 1 000 € de MRR demande environ 335 abonnés mensuels, PM-09) | idem |

**Conséquences.**
- Tant que n < 30, le rapport du lundi affiche des nombres (« 1 sur 2 »), et le traitement est **individuel** : chaque abonné sans démarrage reçoit une attention (alerte 1), chaque abandon se discute en entretien (5 à 8 entretiens, H4 du @product-manager).
- **L'A/B classique n'est pas viable** : 713 visiteurs par mois au site ; pour détecter un passage de 40 % à 60 % d'étape 1 terminée (puissance 80 %, risque 5 %), il faut environ 98 personnes par variante, soit près de 200 semaines au rythme actuel. À la place : entretiens, tests de variantes en séquence (avant/après avec lecture en volumes), faux bouton (fake door) pour les parcours à venir, 1 question de sondage en fin d'étape (pas de contenu libre sans avis @legal).
- Le levier de la mesure est **le volume d'entrée** (PM-09) : pour voir 100 murs en 90 jours il faudrait au moins 8 sessions par semaine sur les pages détail, soit 8 fois le rythme actuel, et davantage dans la réalité puisque tous les visiteurs n'atteignent pas le mur.
- Un seuil d'alerte en pourcentage est inutile avant n = 30 : les 3 alertes du §7 sont des comptes.

## 9. Vérifié / Non vérifié (G_PROOF)

**Vérifié (constaté directement)**
- Lecture des données extraites : `parcours-umami.json` (stats 30 et 90 j du site et des 4 pages parcours, pays, appareils, événements), `parcours-umami-journeys.json` (37 sessions, séquences de pages et propriétés d'événements), `parcours-data.json` (progression, comptes, intégrité). Classement des 37 sessions en test / scripté / humaines fait par moi à la main, session par session, sur dates, pays et séquences.
- Code lu au commit `79b11f3` : `lib/umami.ts` (en entier), `components/premium/use-mur-vu.ts`, `parcours-detail.tsx` (`:85-175`, `:270-430`, `:530-575`, `:725-850`), `parcours-content.tsx` (`:40-70`, `:145-205`), `api/parcours/[id]/progress/route.ts` (`:100-214`), `lib/analytics/weekly-funnel.ts` (en entier), `lib/admin-alerts.ts` (`:1-108`), `prisma/schema.prisma` (modèles `LearningPath`, `UserPathProgress`, `Subscription`, `User`), `lib/premium-return.ts:42-54`. Recensement par recherche de tous les appels `trackUmami` de `apps/web/src` (hors tests) : 2 appels dans le périmètre parcours (`parcours-detail.tsx:95` et `:403`) plus `humor-quiz.tsx:163` (`onboarding-termine`).
- Calculs refaits : 14/37 = 38 % ; 23/2 471 = 0,9 % ; 37/2 471 = 1,5 % ; 13 sessions sur 12,9 semaines = 1,0 par semaine ; 23 sur 12,9 = 1,8 par semaine ; marges `1,96 × √(0,25 / n)` pour n = 10, 24, 29, 30, 96, 100, 384 ; 98 par variante ; 1 120 et 280 pour le petit taux.
- Les SQL ont été écrits contre le schéma Prisma lu (noms de colonnes et de tables, aucun `@@map`). **Ils n'ont pas été exécutés** (pas d'accès shell dans cette session).

**Non vérifié (déduit ou impossible)**
- **Nature des 14 sessions écartées** : « test du 07/10 » et « scripté » sont des classements d'après la date, le pays, l'appareil et la séquence, pas une confirmation (Thomas ou la QA peuvent confirmer les sessions du 07/10 ; l'identification des robots n'est pas possible depuis l'API lue).
- **Identité** des sessions BE du 24/09 et du 26/09 et de l'achat du 14/08 : rapprochements par l'heure, non prouvés.
- **Pourquoi** `parcours-etape` est à 0 malgré 1 validation en base le 24/09 : historique git non consulté.
- **Réglages Umami** à confirmer avant implémentation : `localStorage umami.disabled`, attribut `data-domains` du script, fenêtre des entonnoirs, ventilation par propriété via l'API event-data (non utilisée par le code actuel).
- **Seuils « cible » K1-K15** : repris du @product-manager, tous **[HYPOTHÈSE]** (repères d'applis d'apprentissage, sources secondaires). Mes seuils d'alerte à la moitié de la cible sont aussi des hypothèses, à recaler après 8 semaines. Aucune nouvelle recherche de benchmark n'a été faite : le @product-manager a déjà sourcé (Jordan 2015, RevenueCat 2025, Duolingo, rapports d'éditeurs) et aucun repère ne concerne un parcours d'humour francophone à ce prix.
- **Compatibilité RGPD** : les nouveaux événements ne portent aucune donnée personnelle (parcours, numéro d'étape, provenance, statut). La dispense de consentement d'Umami reste à faire valider par @legal (point ouvert s16 C12).
- **Fichier hôte du job quotidien** des alertes 1 et 3 : non identifié (job de réconciliation de 4 h UTC de s16 supposé).
- **Hero** : lignes exactes des liens vers les parcours dans `hero-section.tsx` non localisées (recherche `/parcours` sans résultat dans ce fichier).

## 10. Handoff

---
**Handoff → @orchestrator** (puis @fullstack pour l'implémentation, @legal pour le point de consentement, @product-manager pour les seuils)
- **Fichier produit** : `/home/user/Marrant/docs/marrant/audit-parcours-apprentissage-s17/data-analyst.md`. Aucun autre fichier modifié, aucun commit. L'historique des interventions de `project-context.md` n'a pas été mis à jour (consigne de ne toucher à aucun autre fichier) : à faire par la session.
- **Décisions prises** : outil = Umami (inchangé) ; nommage = kebab-case français comme le tunnel existant (aucun renommage) ; source de vérité = Umami avant le paiement, base après ; un seul e-mail par jour respecté (alertes en classe B via le digest, bloc « Parcours » dans le rapport du lundi).
- **Note C9 : 2/10** (projection après mise en place du §5 et du §6 : 7/10, plafonnée par l'absence de K15 et par le volume).
- **Ordre d'implémentation conseillé** : (1) DA-03 (exclure tests et localhost) et FS-01 d'abord, sinon les nouveaux chiffres sont faux dès le premier jour ; (2) les 6 événements et propriétés du §5.1 à §5.3 ; (3) table `UserPathStepCompletion` (§5.5) ; (4) bloc du lundi et 3 alertes ; (5) entonnoir Umami.
- **À trancher par Thomas** : (a) fournir la liste des adresses e-mail de test à exclure des requêtes ; (b) confirmer que les 7 sessions du 07/10 sont bien les tests ; (c) valider la création de la table de dates par étape (une migration).
- **Points d'attention** : tout taux affiché avec son « sur n » ; aucun A/B classique ; vérifier la balise canonique avec `?src=` (@seo) ; aucune donnée personnelle dans les propriétés.
---






