# Parcours Boulot, étapes 1 à 6, itération 3 : contrôle final @reviewer (s19, 11/10/2026)

> Fichiers contrôlés (non modifiés) : `docs/copy/parcours-boulot-etapes-2-6-s19.md` (étapes 2 à 6) et `docs/copy/etalons-parcours-boulot-s19.md` §3 (étape 1).
> Sources confrontées : `vannes-neuves/vannes-finales.md`, `vannes-neuves/repli-catalogue.md`, ma note de l'itération 2 (`etapes-iter-2-reviewer.md`), `docs/founder-preferences.md` (entrées du 10/10 et du 11/10), `apps/web/prisma/schema.prisma` (modèle `Joke`), rendu `apps/web/src/components/parcours/` (`parcours-step-card.tsx`, `step-blocks.tsx`, `parcours-content.tsx`).
> Hors notation, comme demandé : texte des 30 vannes, du PS d'Anouk (S-2), des conseils et des défis. Choix de Thomas du 10/10 (7a) et du 11/10 (un tour, puis catalogue) non re-questionnés.

## Note : 9/10

**Résumé.** Le texte est au niveau. Les 30 vannes sont à leur place, leurs textes et leurs ids correspondent à `vannes-finales.md`, les promesses du texte d'étape sont honnêtes (« rappels », « faux rectificatifs », « métiers »), les deux scènes réécrites tiennent avec le fil d'Anouk, le quiz et les durées, la charte est respectée. Ce qui empêche le 10 : le **handoff d'import n'est pas prêt**. Il est réparti entre deux fichiers, dont un garde les consignes d'avant l'assemblage (« 19 neuves », « manquent 3 vannes »), et il ne dit pas comment créer les 10 vannes neuves. S'y ajoute un texte du site (`nextParcoursReason`) que le handoff fait importer alors qu'il porte encore la mention « à soumettre à la relecture à l'aveugle ». Trois affirmations de comptage sont fausses dans les notes de liens des vannes.

**2 corrections bloquantes (B1, B2), 7 non bloquantes (N1 à N7).** Toutes sont des corrections de document : aucune ne touche une vanne, un conseil ou un défi.

## Vérifications

| Point | Verdict | Évidence |
|---|---|---|
| Chaque étape liste ses 5 vannes finales | PASS | Étape 1 : étalons l. 246-251 (canapé, point rapide, V-1-1 à V-1-3). Étapes 2 à 6 : l. 89-93, 157-161, 225-229, 292-296, 370-374. Textes et ids identiques à `vannes-finales.md` l. 13-67, lus place par place |
| Répartition annoncée = comptée | PASS | 11 en ligne (2, 3, 2, 2, 2, 0), 10 neuves (3, 1, 3, 1, 0, 2), 9 catalogue (0, 1, 0, 2, 3, 3) = 30 (l. 9 et l. 400). En-têtes des blocs « Les 5 vannes » justes aux cinq étapes. « 16 emplacements = 7 + 9 » (l. 460) juste |
| Le texte d'étape ne promet rien que ses vannes ne tiennent | PASS | Étape 2 : l. 85, aucune des cinq n'est un faux rectificatif, la mécanique est dans le conseil et S-2. Étape 5 : l. 288, autodérisions sur soi, pas des métiers. Étape 6 : l. 366, 2 rappels, 1 presque, 2 sans rappel, « aucun texte ne promet cinq rappels » vérifié (`why`, scène, titre, tableau d'ensemble). Les « techniques de l'étape » en tête des blocs décrivent le conseil, pas les vannes une à une |
| Détails des liens de vannes | **FAIL** (non bloquant) | N1, N2 ci-dessous |
| Scène de l'étape 2 (S-2 inséré) | PASS | Recomptée mot à mot : 100 hors PS + 25 de PS = 125, test compris (l. 44 juste). Le PS ne reprend ni « clavier », ni « reproches », ni reflet ; Q1 C et D ne l'imitent pas ; « horaire » tient (Q2 B). Fil d'Anouk : jeudi 16 h 40, aucun objet ni horaire repris des étapes 1 et 3. Voir l'observation O1 |
| Scène de l'étape 6 (réécrite sans vanne) | PASS | Recomptée : 107 + 22 = 129, test compris (l. 317 juste). Trois blocs et vanne de rechange visibles ; cohérente avec le défi (pot imaginé, « quelqu'un qui t'a dépanné »), le `retourExerciceNote`, la Q1 (humour après le souvenir) et la Q3 (la bonne réponse ne dit pas « rechange »). 17 h 30 ne rejoue pas le 18 h 30 de l'étape 4. Parapluie de V-1-2 : voisinage nommé et assumé (`vannes-finales.md` l. 107). Voir N3 et N4 |
| Durées | PASS | Étape 2 : 125 mots de scène au lieu d'environ 117, le défaut « Environ 15 min, hors vidéos » tient (11 à 14 min). Étape 6 : `dureeTexte` « Environ 20 min » reste une estimation à mesurer en premier (l. 313, 417) |
| Traces d'emplacement « en relecture » hors historique | **FAIL** (bloquant) | Étapes 2 à 6 : seules les l. 440, 452 et 460 (arbitrages et historique) en parlent, PASS. Mais l. 411 : `nextParcoursReason` porte `[PROPOSITION @copywriter, à soumettre à la relecture à l'aveugle avec les vannes avant l'import]`, alors que le handoff (l. 427, point 2) le fait importer (B2). Étalons : l. 24, 36, 396 et 403 disent encore « manquent 3 vannes » ou « 19 neuves » (B1, d) |
| Charte (textes du site) | PASS | Zéro tiret cadratin dans les deux fichiers et dans `vannes-finales.md` ; « blague » et « carnet » absents des textes affichés ; tutoiement (les « vous » sont des répliques citées) ; aucun prénom de persona (Anouk = exemple ; Inès, Camille dans l'exemple validé du conseil) ; aucune mention d'IA (la vanne de rang 1 de l'étape 2, qui citait une IA, est écartée) ; aucune personne visée dans les scènes |
| Handoff @fullstack pour l'import | **FAIL** (bloquant) | B1 |
| Code cité au handoff | PASS, à compléter | `parcours-step-card.tsx` l. 269 (`slug === "storytelling" ? frTypo(...)`) et l. 285 (`moduleDetail` sans `whitespace-pre-line` ni `frTypo`), `step-blocks.tsx` l. 39, `parcours-content.tsx` l. 336 : lignes exactes. N6 |

## Corrections bloquantes

**B1. Le handoff d'import n'est pas complet ni à jour : en écrire un seul, qui fait foi** (étapes l. 419-429 ; étalons l. 395-403).
Aujourd'hui, @fullstack doit croiser deux handoffs. Celui des étalons date d'avant l'assemblage : « 19 vannes neuves » (l. 397, 400 (3), 403), « manquent 3 vannes » (l. 396), et les consignes du conseil du PS y sont rédigées en trois branches (a, b, c) alors que Thomas a tranché. Celui des étapes ne parle ni des vannes à créer, ni des conseils. Correction : ajouter à la fin de `parcours-boulot-etapes-2-6-s19.md` une section « Import : liste unique pour @fullstack » (et, en tête du handoff des étalons, une ligne « historique : l'import suit la liste unique de `parcours-boulot-etapes-2-6-s19.md` »). Elle contient au minimum :
- (a) **Créer les 10 vannes neuves** (V-1-1 à V-1-3, V-2-1, V-3-1 à V-3-3, V-4-3, V-6-2, V-6-3) depuis `vannes-finales.md` : `content` et `punchline` du tableau ; décryptage réparti dans les champs du modèle `Joke` (`schema.prisma` l. 129-131) : titre en italique → `comedyTechnique`, texte → `techniqueExplanation`, « À toi de jouer » et son exemple → `howToApply` ; catégorie BOULOT (étalons l. 303) ; `maturityLevel`, `type` et `generatedByAI` selon la convention des imports s17 et s18, à relire dans le code d'import plutôt qu'à deviner.
- (b) **Rattacher les 20 vannes déjà en ligne par leur id** (11 retenues + 9 catalogue, `vannes-finales.md`), `isActive` revérifié à l'import (export du 11/10). Dire que la source qui fait foi pour les 30 est `vannes-finales.md`, pas le §5 des étalons.
- (c) **S-2 n'est pas une vanne** : il vit dans le `moduleDetail` de l'étape 2 et ne se crée pas en base.
- (d) **Conseils** : réactiver les 3 conseils des étapes 3, 4 et 5 (ids des étalons l. 400) ; créer ceux des étapes 1 et 6 ; remplacer le conseil du PS (`cmmw0tqkc000smw62bo1yfeyg`) par le conseil complet du tour 13 avec la chute a, **catégorie ABSURDE**, difficulté INTERMEDIAIRE, exception de Thomas inscrite le 10/10 (`founder-preferences.md`) : la condition du handoff des étalons est remplie, le dire. En base ET dans `conseils-seed.json`, base sauvegardée avant.
- (e) **Étape 1 dans sa version finale** : la phrase `[SI 6B]` est incluse (choix 6B), précédée d'un saut de paragraphe ; la facultative est Vérino (choix 5B), la ligne Tsamère (5A) ne s'importe pas.
- (f) **Code** : reprendre le point 1 actuel (sauts de ligne, `frTypo`, JSON-LD et `llms`), en le complétant avec N6.
- (g) **Visionnage** : les 10 vidéos du parcours, étape 1 comprise (VDB, Vérino), regardées une fois par une personne avant l'import ; durées relevées, base corrigée ; variantes sans vidéo prêtes (étapes 5 et 6).
- (h) Le reste du handoff actuel (champs `dureeTexte`, `retourExerciceNote`, `nextParcours*`, renommage `"pro"` → `"boulot"`, interrupteur de publication, contrôles de contenu, instrumentation).

**B2. `nextParcoursReason` : une mention « à soumettre à la relecture à l'aveugle » sur un texte que le handoff fait importer** (l. 411 et l. 427, point 2).
La relecture des vannes est finie et ce texte n'y est pas passé. Défaut retenu (pas de question à Thomas) : le traiter comme les scènes, texte du site écrit par @copywriter et non relu à l'aveugle. Retirer la mention de la l. 411, l'ajouter au doute (a) de la l. 429, et à la liste « À vérifier avant import » : « relu par Thomas avec les scènes des étapes 2 à 6 ». Si la session préfère une relecture à l'aveugle, l'import de ce seul champ attend ; le reste du parcours n'en dépend pas (sans ce champ, le bouton de fin arrive nu, l. 405).

## Corrections non bloquantes

**N1. Étape 5, vanne 3 (V-5-1), lien : « une réponse de deux mots »** (l. 294). « des erreurs, principalement » fait trois mots. Écrire « une réponse de trois mots ».

**N2. Étape 6, vanne 4 (V-6-4), lien : « sur le dernier mot »** (l. 373). La chute finit sur « discrète » : « enfance » est l'avant-dernier mot. Écrire « revient dans la chute, juste avant le dernier mot, contre soi ». Même erreur dans `repli-catalogue.md` l. 74 (fichier de travail, à corriger par la session si elle le garde).

**N3. Étape 6, `why` : « Ici, tu écris le tien »** (l. 309). Le `why` ne dit jamais « toast » : le dernier nom masculin est « moment », donc « le tien » se lit « ton moment ». C'est ma formulation de l'itération 2 (N6) : mon erreur. Écrire « Ici, tu écris ton toast, sans rien dire à personne. »

**N4. Étape 6, scène : le rappel n'est plus montré** (l. 310). Depuis la réécriture, la technique de l'étape (la vanne fait revenir un détail du souvenir) ne se voit que dans l'exemple du conseil et dans 2 vannes sur 5. Sans citer de vanne (décision du 11/10 respectée), la scène peut nommer le détail qui revient : « Elle enchaîne sur une seule phrase qui ramène le parapluie, et la salle rit. » (+4 mots, 133 test compris, sous 146). Mettre à jour la note de scène (compte et phrase « sans dire laquelle », qui reste vraie).

**N5. Étalons §3, étape 1 : des conditions déjà tranchées restent écrites comme ouvertes** (l. 157, 176, 181, 240-241). L. 157 : « deux éléments [...] dépendent d'un choix » (5 et 6 sont tranchés depuis le 10/10). L. 176 : la phrase garde son marqueur `[SI 6B : ...]`. L. 240-241 : les deux facultatives « si choix 5B » et « si choix 5A ». Écrire la version finale (phrase du test incluse, Vérino seule), et ne garder les conditions que dans le tableau des choix (historique).

**N6. Handoff, point 1 (b) : `frTypo` à étendre aux trois rendus du `moduleDetail` et aux horaires des étapes 1 et 3** (l. 427). Le `moduleDetail` s'affiche aussi sans `frTypo` dans `step-blocks.tsx` l. 39 (aperçu verrouillé, que voit la visiteuse) et `parcours-content.tsx` l. 336 (« Programme ») : « 16 h 40 » peut y être coupé de la même façon. Ajouter ces deux rendus (pour `boulot`), et compléter la liste des horaires avec « 9 h 50 » (étape 1) et « 12 h 52 » (étape 3).

**N7. Décryptage de V-3-3 : une parenthèse de brief, visible par le membre** (`vannes-finales.md` l. 93). « (pas le format « setup très court, chute de deux mots ») » parle à un relecteur, pas à la lectrice (et « setup » est un anglicisme). À trancher par la session : si le décryptage a été relu à l'aveugle avec la vanne, ne rien toucher ; sinon, retirer la parenthèse à l'import (le reste de la phrase tient seul).

## Observations (aucune correction demandée)

- **O1. Étape 2.** Le PS d'Anouk porte sur « hier soir », la scène demande « une petite scène vraie de ta journée » (texte du défi). Le critère de réussite du défi ne dépend pas du moment, et S-2 est validé : rien à changer, je le signale pour la relecture du rendu.
- **O2. Étape 6, Q4.** La bonne réponse (« Mon deuxième jeudi ») et la scène (« son troisième jour ») ont la même forme. C'était déjà vrai à l'itération 2, je ne l'avais pas relevé ; la question teste justement ce que la scène montre (un souvenir daté). Je ne demande pas de changement.
- **O3. Diff réel (P0 s11).** Les deux fichiers annoncent qu'il n'a pas été mesuré (l. 464). Je ne l'ai pas mesuré non plus (pas d'outil shell ici) : `git diff --stat` reste à faire par la session avant de clore.

## Pour la suite

B1 et B2 se règlent dans les documents, sans toucher aux textes validés. N1 à N3 sont des phrases toutes faites ; N4 à N7 sont courtes. Avec B1, B2 et N1 à N6 faits : 10. Je repasse seulement la nouvelle section d'import (B1), la l. 411 (B2) et le compte de la scène 6 si N4 est pris.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/marrant/parcours-boulot-s19/iterations/etapes-iter-3-reviewer.md`. Aucun autre fichier modifié.
- Décisions prises : 9/10, NO-GO pour l'import en l'état (2 bloquants documentaires), GO sur le texte.
- Points d'attention : B1 (liste d'import unique, vannes neuves à créer avec leur décryptage, conseils et PS ABSURDE, étape 1 finale) ; B2 (statut de `nextParcoursReason`). Agent à relancer : @copywriter (ou la session) pour B1, B2, N1 à N5 ; N6 est du code pour @fullstack, au moment de l'import.
---
