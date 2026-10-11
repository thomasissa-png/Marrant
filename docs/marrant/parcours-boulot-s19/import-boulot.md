# Parcours Boulot : liste d'import UNIQUE pour @fullstack (s19, 11/10/2026)

> **Ce fichier fait foi.** Il remplace les listes d'import des handoffs de `docs/copy/etalons-parcours-boulot-s19.md` (section « Handoff », ligne « Après validation, @fullstack devra ») et de `docs/copy/parcours-boulot-etapes-2-6-s19.md` (« Handoff @fullstack »). En cas d'écart avec ces deux documents, ce fichier l'emporte. Toute donnée est ici un texte exact ou un renvoi précis (fichier + section) : rien à deviner, rien à recopier de mémoire.
> Notes de relecture closes : `iterations/etapes-iter-3-reviewer.md` (B1), `iterations/etapes-iter-3-ux.md` et `iterations/etapes-iter-4-reviewer.md` (C1 à C7, intégrées le 11/10 : interrupteur et `PARCOURS_META` §1, `tipTitle` §2, champs de relecture et sources des conseils §3, `jokeContents` §4). Aucune modification de texte de vanne, de conseil, de défi, ni de l'exemple du PS n'est permise à l'import (règle d'or : une retouche ferait repasser le texte à l'aveugle).
> Sources de texte : **E** = `docs/copy/etalons-parcours-boulot-s19.md` ; **P** = `docs/copy/parcours-boulot-etapes-2-6-s19.md` ; **V** = `docs/marrant/parcours-boulot-s19/vannes-neuves/vannes-finales.md` ; **BASE** = `docs/content/boulot-base-s19.json` (export du 10/10, vannes revérifiées le 11/10).

## 0. Ordre conseillé

1. Avant import : section 7 (visionnage, fiches vidéo). 2. Sauvegarde base + `DataPatch` (section 3). 3. Vannes neuves (section 4), conseils (section 3), parcours et étapes (sections 1 et 2). 4. Code (section 5). 5. Renommage `"pro"` (section 1). 6. Contrôles de contenu (section 6). 7. Après import : section 8. **Le parcours reste éteint (interrupteur à `false`) jusqu'au feu vert de Thomas.**

## 1. Parcours `boulot` : fiche, publication, renommage

Modèle de fiche et de tâche de démarrage : `docs/marrant/parcours-storytelling-s18/implementation.md` (un fichier de contenu à part, une tâche idempotente avec `DataPatch`, parcours créé avec `isActive` = interrupteur, jamais reconstruit depuis le seed tant qu'inactif).

| Champ | Valeur |
|---|---|
| `slug` | `boulot` |
| `title` (H1, fil d'Ariane, repère « Parcours Boulot · 6 semaines ») | Parcours Boulot |
| Titre de page `<title>` (choix 3 = A, 60 caractères) | Parcours Boulot : oser une vanne sans te griller, 6 semaines |
| `description`, `personaTagline`, `testimonial` | Colonne **B (complice)** de E §2 (tableau « Fiche du parcours »), texte exact des trois lignes |
| `duration` / `timePerWeek` | 6 semaines / 15 min/semaine |
| `difficulty` / `difficultyLabel` | DEBUTANT / DEBUTANT → INTERMEDIAIRE |
| `order` | 5 |
| `persona` | Sophie (26 ans, jeune active en CDI) (forme du champ de Storytelling) |
| `icon` | 💼, retenue par @design (rendu itération 1, `iterations/rendu-iter-1-design.md`) |
| `metaDescription` (154 caractères, s19, retenue : voir la note sous le tableau) | Oser une vanne sans te griller, du silence en réunion au toast : 6 semaines à 15 min/semaine, mail, couloir et afterwork compris. Première étape gratuite. |
| XP des 6 étapes, puis fin | 50, 75, 100, 100, 125, 150, puis +100 de fin (inchangé) |
| `nextParcours` | `storytelling` |
| `nextParcoursRanking` | `["storytelling", "machine-a-cafe", "repartie", "confiance"]` |
| `nextParcoursReason` | Tu sais écrire court et le dire sans te griller. Storytelling t'apprend à en faire une histoire entière, celle qu'on te redemande. |

> **Note `metaDescription` (s19, [Framework : promesse + preuve par le programme] [Conscience : Problem-Aware])** : texte retenu = 154 caractères, comptés à la machine (regex). Il porte « 6 semaines à 15 min/semaine » et « Première étape gratuite. » comme l'exigent les étalons (signalement 8). Correction C5 (a) de l'itération 4 : ce n'est pas « comme les quatre autres pages » ; dans le code (`apps/web/src/app/(dashboard)/parcours/[slug]/page.tsx`), seule Machine à Café porte « 15 min/semaine » (l. 51), Répartie et Confiance n'ont que « Première étape gratuite. » (l. 59 et 67), et Storytelling n'a ni l'un ni l'autre (« Lis la première étape gratuite du parcours Storytelling. », `parcours-storytelling-s18.json`, champ `metaDescription`). La même affirmation dans E (l. 146 et 385) est de l'historique validé : ne pas y toucher. Le texte retenu ne change pas. Il ne contient ni « drôle », ni « bureau », ni « humour » (ni « cours gratuit »), ni tiret cadratin, ni IA. Il suit l'arc réel du parcours : « du silence en réunion » = étape 1 (observer sans un mot), « au toast » = étape 6, « mail, couloir et afterwork » = étapes 2, 3 et 4 ; l'étape 5 (« tu fais quoi dans la vie ? ») est couverte par « compris », faute de place. À importer tel quel dans `PARCOURS_META.boulot.description` (texte exact, sans retouche).
> - Candidate B (146 caractères, écartée : pas de « 15 min/semaine », que les étalons exigent, signalement 8) : Apprends à oser une vanne sans te griller en 6 semaines : réunion, mail, couloir, afterwork, « tu fais quoi ? » et toast. Première étape gratuite.
> - Candidate C (143 caractères, écartée : ne cite que 2 des 6 situations, moins de mots pour la requête) : Une vanne en tête, un mail à envoyer, un couloir à traverser : 6 semaines à 15 min/semaine pour oser, sans te griller. Première étape gratuite.

`nextParcoursReason` : importer **la seule phrase ci-dessus** (texte de site, relu par @reviewer et @ux en itération 3, non relu à l'aveugle : même statut que les scènes). Toute parenthèse de note voisine dans P (section « Fin de parcours ») est une note, pas du texte.

**Interrupteur de publication** : créer `BOULOT_PUBLIE` dans `apps/web/src/config/parcours-publication.ts`, à côté de `STORYTELLING_PUBLIE`, valeur `false` à la livraison. Même mécanique qu'en s18 (implementation.md, « Décisions d'architecture » 1 à 3) : le contenu n'entre dans la liste des parcours (hub, `llms.txt`, fiches, quiz, progression, rappels, page, sitemap) que si l'interrupteur est à `true` ; la tâche de démarrage aligne `LearningPath.isActive` sur lui. Activation = passer à `true` + déployer, sur feu vert de Thomas (section 8).

**Reproduire pour `BOULOT_PUBLIE` chaque usage de `STORYTELLING_PUBLIE`** (C1, Grep du 11/10 sur `apps/web/src/`, état du code à ce jour ; refaire le Grep avant d'écrire, les lignes bougent). `STORYTELLING_PUBLIE` vaut aujourd'hui `true` (Storytelling publié) : les deux interrupteurs coexistent, aucun ne remplace l'autre.

| Fichier (sous `apps/web/src/`) | Lignes | À faire pour `BOULOT_PUBLIE` |
|---|---|---|
| `config/parcours-publication.ts` | 12 | Ajouter `export const BOULOT_PUBLIE = false;` avec un commentaire calqué sur l. 1-11 |
| `lib/parcours-seed.ts` | 12, 23-24, 27 | `publishedSeedJson` ajoute l'entrée Boulot (fichier de contenu à part) seulement si `BOULOT_PUBLIE` ; exporter `BOULOT_SEED` / `BOULOT_IMPORT` comme `STORYTELLING_SEED` / `STORYTELLING_IMPORT` (l. 17, 20) |
| `lib/entrees-parcours.ts` | 14, 16, 19-24, 27-32 | Ajouter `"boulot"` au type `ParcoursSlug` (l. 16), à `PARCOURS_SLUGS` sous condition (l. 23) et à `PARCOURS_NOMS` (« Boulot »). `sitemap.ts` l. 54 et `components/premium/abonnement-view.tsx` l. 301 suivent seuls via `PARCOURS_SLUGS` |
| `config/premium.ts` | 19, 77-79 | `PREMIUM_PARCOURS` : `{ slug: "boulot", name: "Boulot", timePerWeek: "15 min/semaine", weeks: 6 }` sous condition, après Storytelling ; `PARCOURS_COUNT` (l. 83) suit. Voir la note sur le second type `ParcoursSlug` (l. 85) ci-dessous |
| `app/(dashboard)/parcours/[slug]/page.tsx` | 30, 73-83 | Entrée `boulot` de `PARCOURS_META` (paragraphe suivant) |
| `lib/parcours-storytelling-sync.ts` | 12, 22, 31, 135, 237, 347 | Modèle de la tâche Boulot (fichier à part), appelée dans `lib/startup-tasks.ts` à côté de l. 1382 ; marqueur global `...:publie=<bool>` pour réaligner `isActive` quand l'interrupteur change |
| `app/sitemap.ts` | 53 | Commentaire seulement (la liste vient de `PARCOURS_SLUGS`) |
| `components/quiz/quiz-data.ts` | 6, 64 | **Ne pas reproduire** : orientation du quiz, hors import (§5.4) |
| `config/textes/entrees-parcours.ts` | 12, 51 | **Ne pas reproduire** : accroche du profil STORYTELLER du quiz, même motif |

Tests qui comptent les parcours (à adapter pour que le compte suive les deux interrupteurs, par exemple `3 + (STORYTELLING_PUBLIE ? 1 : 0) + (BOULOT_PUBLIE ? 1 : 0)`) : `__tests__/mobile/premium-paywall.test.tsx` l. 9, 68 ; `__tests__/feature/premium-modal.test.tsx` l. 4, 23 ; `__tests__/feature/abonnement-page.test.tsx` l. 4, 78 ; `__tests__/feature/parcours-list.test.tsx` l. 5, 8 ; `__tests__/api/parcours-s17-lot-b.test.ts` l. 54, 200 (titre du hub « N parcours ») ; `__tests__/lib/parcours-contenu-s17-lot-d.test.ts` l. 59, 146 (`19 : 13` modules, +6 si Boulot publié) ; `__tests__/feature/entrees-parcours-s17.test.tsx` l. 18, 118, 143, 144 (l. 118 : à examiner, liste d'entrées par fiche). Modèle du test d'interrupteur : `__tests__/lib/parcours-storytelling-sync-s18.test.ts` l. 51, 77, 102. Sans changement : `__tests__/feature/viral-quiz.test.tsx` l. 10, 318 (quiz non touché) ; commentaires seuls dans `__tests__/lib/premium-offer.test.ts` l. 5 et `__tests__/lib/public-figures.test.tsx` l. 11.

Note de code (incohérence relevée, pas une décision d'import) : il existe **deux** types `ParcoursSlug`. Celui de `lib/entrees-parcours.ts` l. 16 a 4 slugs (Storytelling compris) ; celui de `config/premium.ts` l. 85 n'en a que 3 et sert à `parcoursWeeks` (l. 88). Ajouter `"boulot"` au premier ; pour le second, ne l'étendre que si `parcoursWeeks("boulot")` est appelé (l'entrée `PARCOURS_META` ci-dessous lit le fichier de contenu, comme Storytelling, et n'en a pas besoin).

**`PARCOURS_META`** (`apps/web/src/app/(dashboard)/parcours/[slug]/page.tsx`, type l. 42-45 : `name`, `title`, `description`, `duration`, `stepsCount` obligatoires). Entrée **conditionnée**, sur le modèle exact de Storytelling (l. 73-83) : `...(BOULOT_PUBLIE ? { boulot: { ... } } : {})`. Raison : `generateStaticParams` lit les clés de `PARCOURS_META` (l. 86-88) et la page ne renvoie un 404 que si la donnée **et** l'entrée manquent toutes les deux (l. 164) ; une entrée sans condition rendrait `/parcours/boulot` accessible avant le feu vert de Thomas. Champs :
- `name` : « Parcours Boulot » ;
- `title` : « Parcours Boulot : oser une vanne sans te griller, 6 semaines » (texte exact du tableau ci-dessus) ;
- `description` : `BOULOT_SEED.metaDescription` (la `metaDescription` du tableau, portée par le fichier de contenu, comme `STORYTELLING_SEED.metaDescription` l. 78) ;
- `duration` : `BOULOT_SEED.duration` (« 6 semaines ») ;
- `stepsCount` : `BOULOT_SEED.steps.length` (6).
Sans cette entrée, la page n'a pas le titre signé.

**Renommage `"pro"` en `"boulot"`** dans les classements de fin de parcours des parcours existants : 7 occurrences dans 3 fichiers (`docs/content/parcours-reecriture-s17.json` 3, `docs/content/parcours-seed.json` 3, `docs/content/parcours-storytelling-s18.json` 1). Puis Grep de `"pro"` dans `docs/content/` et `apps/web/src/` (dont `__tests__/lib/parcours-contenu-s18-storytelling.test.ts`, 2 occurrences à examiner : mettre à jour si ce sont des classements) : zéro reste.

## 2. Les 6 étapes

Pour chaque étape, importer **tel quel** les champs de la ligne indiquée. Les marqueurs de mise en forme entre crochets ne s'importent pas : `[saut de paragraphe (\n\n)]` devient un vrai saut de paragraphe (`\n\n`) ; `[ESTIMATION @ux ...]` est une note, pas du texte de `dureeTexte`.

| Étape | Champs (`moduleTitle`, `why`, `moduleDetail`, `moduleFormat`, XP / gratuit / `dayNumber`) | `dureeTexte` | `retourExerciceNote` | Quiz | Légendes et vidéos | Les 5 vannes |
|---|---|---|---|---|---|---|
| 1 | **E §3**, tableau « Champ / Texte », **version finale** (voir ci-dessous) ; XP 50, gratuit oui, `dayNumber` 3 | Vide (défaut « Environ 15 min, hors vidéos ») | Aucun | E §3, « Quiz, trois questions » (B, D, A) ; guillemets des réponses de Q1 et Q2 conservés, ceux de Q3 retirés | E §3, « Les 2 vidéos » : VDB (obligatoire), Vérino (facultative) | Section 4, étape 1 |
| 2 | **P**, « Étape 2 », tableau « Champ / Texte » ; XP 75, payant, `dayNumber` 10 | Vide (défaut) | P, étape 2 | P, étape 2, 3 questions (C, B, D) | P, « Les 2 vidéos » (Croce, Brokerss) | Section 4, étape 2 |
| 3 | **P**, « Étape 3 » ; XP 100, `dayNumber` 17 | Vide (défaut) | P, étape 3 | P, étape 3 (C, A, B) | P, « Les 2 vidéos » (Guiz cabillauds, Kev Adams) | Section 4, étape 3 |
| 4 | **P**, « Étape 4 » ; XP 100, `dayNumber` 24 | Vide (défaut, à ajuster au chiffre mesuré si la médiane dépasse) | Aucun | P, étape 4 (D, C, A) | P, « Les 2 vidéos » (Guiz fast-food, Foresti) | Section 4, étape 4 |
| 5 | **P**, « Étape 5 » ; XP 125, `dayNumber` 31 ; `moduleFormat` « Un conseil, un défi, 5 vannes, une vidéo, un petit quiz. » | Vide (défaut) | Aucun | P, étape 5 (B, C, A) | P, « La vidéo » (Delmoitiez seule) | Section 4, étape 5 |
| 6 | **P**, « Étape 6 » ; XP 150, `dayNumber` 38 ; `moduleFormat` « Un conseil, un défi, 5 vannes, une vidéo, un petit quiz. » | Environ 20 min, hors vidéos : 10 min de lecture et de quiz, 10 min pour écrire ton toast. | P, étape 6 | P, étape 6, 4 questions (D, B, C, A) | P, « La vidéo » (Hamzawi) | Section 4, étape 6 |

**`tipTitle` de chaque étape (C2)** : c'est la clé qui relie une étape à son conseil (la tâche s18 cherche le conseil par **titre exact**, `isActive: true`, `parcours-storytelling-sync.ts` l. 286-305 ; titre absent = étape non créée, refus journalisé dans `tipsMissing`). Valeur = colonne « Conseil » du tableau de la section 3, mot pour mot, ci-dessous. Les parenthèses de la ligne `tipTitle` de E §3 (l. 174, « (conseil validé, §1) ») et de P étape 2 (l. 36, « (conseil du tour 13, choix 7a) ») sont des **notes** et ne s'importent pas ; « (et briller) » de l'étape 5 **fait partie du titre** (titre en base, BASE l. 947). Apostrophes droites ('), deux-points précédés d'une espace simple, comme en base (BASE l. 87, 287, 607, 947).

| Étape | `tipTitle` (texte exact) |
|---|---|
| 1 | Ce que raconte une salle de réunion |
| 2 | Le PS qui détend un mail sérieux |
| 3 | La vanne de couloir : l'art du timing entre deux réunions |
| 4 | L'afterwork : passer de collègue à personne drôle |
| 5 | Survivre (et briller) au networking pro avec humour |
| 6 | Le toast de soixante secondes qui tient debout |

Le `title` écrit sur les conseils créés (étapes 1 et 6, section 3) est ce même texte, sinon l'étape ne trouve pas son conseil. Dans le tableau de P étape 2, la ligne `exemple` du conseil **ne s'importe pas dans l'étape** : elle va dans le champ `example` du conseil (section 3).

Étapes 2 à 6 : payantes (`free` non), l'étape 1 est la seule gratuite et lisible par la visiteuse (validation Premium). Le test unique (« Avant de la sortir, un seul test : passerait-elle si toute l'équipe l'entendait ou la lisait, y compris la personne dont elle parle ? ») est le dernier paragraphe de chaque `moduleDetail`, précédé d'un saut de paragraphe. Les exercices (« aujourd'hui ») sont les défis des conseils, déjà recopiés dans P sous chaque étape : ne pas les retoucher.

**Étape 1, version finale** (E §3 après application de N5) : la phrase du test (choix 6 B) est **incluse**, sur son propre paragraphe ; la vidéo facultative est **Vérino** (choix 5 B), la ligne Tsamère (5 A) **ne s'importe pas** ; aucune condition `[SI ...]` ne subsiste dans le texte. Légende de VDB et de Vérino : E §3, tableau « Les 2 vidéos ». `dureeTexte` vide.

**Variantes si une vidéo tombe au visionnage** (section 7) : étape 5 sans Delmoitiez : `moduleFormat` « Un conseil, un défi, 5 vannes, un petit quiz. » ; étape 6 sans Hamzawi : même `moduleFormat` et `dureeTexte` « Environ 20 min : 10 min de lecture et de quiz, 10 min pour écrire ton toast. » (P, étape 6, ligne « variante sans vidéo »). Le bloc vidéo disparaît seul ; le texte du verrou ne cite « les vidéos » que si l'étape en a (vérifier `LockedStepPreview` / `APERCU_BAS`).

**Vidéos (`youtubeId`)** : étape 1 VDB `57Ip2k3us_8` puis Vérino `rldvVgHQSvo` ; étape 2 Croce `QGqA4va99rw` puis Brokerss `zGT7TX66JFQ` ; étape 3 Guiz « cabillauds » `NebHsD_K9lM` puis Kev Adams `3v8Y4C9Q5hE` ; étape 4 Guiz « fast-food » `DK7ASNHnKm4` puis Foresti `TDmd7JRlxFc` ; étape 5 Delmoitiez `ztKRY4eNUTA` (seule) ; étape 6 Hamzawi `Fw14PLdtSyA` (seule). Toutes présentes dans BASE (`videosActives`). Légendes (`why`) : textes exacts des tableaux de P (étapes 2 à 6) et de E §3 (étape 1). Aucune vidéo découpée (choix 8 a).

## 3. Conseils (base ET `conseils-seed.json`, sauvegarde avant)

Avant toute écriture : sauvegarder (export des **4 conseils existants** : étapes 2, 3, 4, 5 ; les conseils des étapes 1 et 6 sont créés, rien à exporter) et poser un marqueur `DataPatch` par conseil qui garde l'ancien état (contenu, exemple, exercice, `isActive`), comme `parcours-storytelling-sync.ts` l. 90-125 (retour arrière possible). Chaque écriture est répliquée dans `conseils-seed.json` (sinon un rejeu du seed remet l'ancien texte). Texte à importer : champs **contenu / exemple / exercice** du conseil dans **E §1**, section de l'étape (texte identique à `docs/copy/conseils-boulot-s19-v1.md`, `-v2.md` (étape 3), `-v5.md` (étape 1), `-v6.md` (étape 6) : contrôle par comparaison avant import, aucune retouche).

**Si E §1 et la source diffèrent (C6)** : la **source validée fait foi** (texte relu à l'aveugle ; le handoff des étalons, E l. 398, dit d'importer depuis les sources, « et non depuis ce fichier »). En cas d'écart, **rien n'est importé pour ce conseil** et l'écart est signalé à la session (champ, étape, les deux textes) : @fullstack ne choisit pas entre les deux. Sources exactes, section par section (chaque fichier contient plusieurs versions, ne pas comparer au fichier entier) :

| Étape | Source qui fait foi | Section |
|---|---|---|
| 1 | `docs/copy/conseils-boulot-s19-v5.md` | « Étape 1, variante de réserve P2-bis » (l. 28-48) |
| 2 | Pas de fichier source : E §1, « Choix 7 », bloc « Le conseil complet » (E l. 109-112), décision directe de Thomas | |
| 3 | `docs/copy/conseils-boulot-s19-v2.md` | conseil « La vanne de couloir » (l. 48-65) |
| 4 | `docs/copy/conseils-boulot-s19-v1.md` | conseil « L'afterwork » (l. 48-65) |
| 5 | `docs/copy/conseils-boulot-s19-v1.md` | conseil « Survivre (et briller) » (l. 66-84) |
| 6 | `docs/copy/conseils-boulot-s19-v6.md` | « Variante T-b » (l. 26 à la fin) |

Contrôle fait le 11/10 par la session (ligne à ligne, par recherche du texte exact de chaque ligne de E §1 dans la section source) : **aucun écart** pour les étapes 1, 3, 4, 5, 6. À refaire à l'import, champ par champ, sur le texte réellement écrit.

| Étape | Conseil | Action | Id / catégorie / difficulté | Texte |
|---|---|---|---|---|
| 1 | Ce que raconte une salle de réunion | **Créer** (conseil neuf ; « Survivre aux réunions avec humour » `cmmp8ozsx001fqk6301jruvzj` reste retiré) | OBSERVATION / INTERMEDIAIRE | E §1, « Étape 1 » |
| 2 | Le PS qui détend un mail sérieux | **Remplacer** le conseil en ligne par le conseil complet du choix 7 = a | `cmmw0tqkc000smw62bo1yfeyg` / **ABSURDE** (et non JEUX_DE_MOTS) / INTERMEDIAIRE | E §1, « Choix 7 », bloc « Le conseil complet » : `contenu` et `exercice` (défi du tour 13, Y1) mot pour mot ; `exemple` avec la **chute a**, « … mais à mon reflet dans l'écran. » |
| 3 | La vanne de couloir : l'art du timing entre deux réunions | **Réactiver** (`isActive = true`) avec le texte validé | `cmmw0tr870014mw62jnung2qp` / OBSERVATION / DEBUTANT | E §1, « Étape 3 » |
| 4 | L'afterwork : passer de collègue à personne drôle | **Réactiver** avec le texte validé | `cmmw0trc60016mw629l4o8rav` / STORYTELLING / DEBUTANT | E §1, « Étape 4 » |
| 5 | Survivre (et briller) au networking pro avec humour | **Réactiver** avec le texte validé | `cmmw0tra60015mw62l0360wm9` / AUTODERISION / INTERMEDIAIRE | E §1, « Étape 5 » |
| 6 | Le toast de soixante secondes qui tient debout | **Créer** (conseil neuf) | STORYTELLING / INTERMEDIAIRE | E §1, « Étape 6 » |

Points précis :
- **Étape 2 (PS)** : l'exception de Thomas (choix 7 = a, du 10/10) est inscrite dans `docs/founder-preferences.md` ; la condition posée par le handoff des étalons (« sans cette inscription, @fullstack n'a pas le droit d'importer le PS ») est remplie. Format du champ `example` : la ligne **exemple** de E §1 telle quelle, une seule citation entre guillemets français qui contient le mail puis le PS, séparés par une espace. Vérifier sur la base de prod avant tout UPDATE (`[À VÉRIFIER sur la base de prod]`). La règle d'or reste entière pour tout le reste.
- **Ids des étapes 3, 4, 5** : ceux de l'export `docs/content/boulot-base-s19.json` (retrouvés dans le fichier : l. 606, 286, 946). Vérifier le titre avant d'écrire, comme la tâche s18.
- **Étape 1, difficulté** : `INTERMEDIAIRE` comme dans le texte validé. Passer à `DEBUTANT` est une décision @product-manager, non bloquante, hors de cet import.
- **Champs de relecture des 6 conseils (C4, remplace la consigne précédente, qui disait `GARDER` alors que la tâche s18 écrit `REECRIRE`)**. Alignés sur ce que la tâche s18 écrit réellement (`parcours-storytelling-sync.ts` l. 110-122, « même trace que la phase 2 de l'audit s18 (version 18, texte réécrit) »), pour les 6 conseils, créés (1, 6) comme remplacé (2) ou réactivés (3, 4, 5) :
  - `copyVerdict` = `"REECRIRE"` ; `copyReviewVersion` = `18` ; `copyReviewedAt` = date de l'import ;
  - `originalContent` = ancien `content` s'il est vide en base (conseils 2 à 5, comme l. 121) ; rien pour les conseils créés ;
  - **`generatedByAI` = `false`, écrit explicitement** (la tâche s18 ne l'écrit pas sur les conseils : elle s'appuie sur la valeur en base). Raison : `copy-review-runner.ts` (l. 295-302) relit et peut réécrire tout conseil `generatedByAI: true`, `isActive: true` dont `copyReviewVersion` diffère de `COPY_REVIEW_VERSION` (`lib/ai/copy-review-version.ts` : variable d'environnement, **1 par défaut**, vide dans `.env.example` l. 43). La version 18 ne protège donc pas : seul `generatedByAI: false` met ces textes hors de portée de la relecture IA, quel que soit l'état de l'interrupteur de génération (`jobs.ts` l. 561). Pour les 4 existants, `generatedByAI` est absent de l'export : lire la valeur en base et la garder dans le `DataPatch` (état avant) ;
  - même règle pour les **10 vannes neuves** (section 4.1 : `generatedByAI` `false`, déjà prévu).

## 4. Vannes (30 places)

Source qui fait foi pour les 30 : **V** (tableaux « Tableau par étape »), **pas** le §5 de E. Répartition : 11 en ligne retenues + 10 neuves + 9 du catalogue = 30. Étape par étape, les places (1, 2, V-1-1 à V-6-5) sont dans V, avec `content`, `punchline` et `id`. Les neuves s'importent par création (4.1).

**Lien étape → vannes : `jokeContents`, pas l'id (C3).** Le contrat D4 relie une étape à ses vannes par les **5 `content` exacts** de vannes actives (`apps/web/src/lib/parcours-data.ts` l. 40, `apps/web/src/lib/parcours-vannes.ts` l. 3 et 28-32), comme s18 (`docs/content/parcours-storytelling-s18.json`, champ `jokeContents` de chaque étape ; contrôle au démarrage `parcours-storytelling-sync.ts` l. 325-333, toute vanne absente ou inactive bloque le marqueur global). Dans le fichier de contenu Boulot, chaque étape porte `jokeContents` = les 5 valeurs de la colonne `content` de V (jamais la `punchline`), **copiées caractère pour caractère, dans l'ordre des lignes du tableau de l'étape** :

| Étape | `jokeContents`, dans cet ordre | V, lignes |
|---|---|---|
| 1 | place 1, place 2, V-1-1, V-1-2, V-1-3 | l. 13-17 |
| 2 | place 1, place 2, place 3, V-2-1, V-2-2 | l. 23-27 |
| 3 | place 1, place 2, V-3-1, V-3-2, V-3-3 | l. 33-37 |
| 4 | place 1, place 2, V-4-1, V-4-2, V-4-3 | l. 43-47 |
| 5 | place 1, place 2, V-5-1, V-5-2, V-5-3 | l. 53-57 |
| 6 | V-6-1, V-6-2, V-6-3, V-6-4, V-6-5 | l. 63-67 |

Les textes ne sont pas recopiés ici (une seule source, pas de seconde copie à tenir à jour) : copier depuis V, sans retoucher ponctuation ni guillemets (par exemple l'apostrophe droite de « 'point rapide avant l'été' », l. 14, les guillemets français dans le `content` de l. 25, 27, 53, 66, 67). Les **ids** de §4.2 servent au **contrôle** seulement : l'id existe, son `content` en base est identique au texte de `jokeContents`, il est `isActive`. Un écart de texte d'un caractère = vanne introuvable = étape incomplète (refus journalisé, rien de publié), jamais de correction du texte de V pour « faire passer ».

### 4.1 Les 10 neuves à créer (catégorie BOULOT)

Places : V-1-1, V-1-2, V-1-3 (étape 1) ; V-2-1 (étape 2) ; V-3-1, V-3-2, V-3-3 (étape 3) ; V-4-3 (étape 4) ; V-6-2, V-6-3 (étape 6). Aucune neuve à l'étape 5.

- `content` et `punchline` : colonnes du tableau de V pour la place, **caractère pour caractère**.
- Décryptage : V, section « Décryptages des 10 neuves validées », paragraphe de la place. **V fait foi**, y compris pour V-3-3, dont le décryptage a perdu une parenthèse de brief par rapport à `vannes-neuves/v5.md` (N7, itération 3 ; vanne intacte) : un contrôle contre `v5.md` signalera cet écart, il est voulu (C7). Répartition dans les champs du modèle `Joke` (`apps/web/prisma/schema.prisma` l. 128-131) :
  - `comedyTechnique` = le **titre en italique** (sans les astérisques ni le point final), par exemple « La trace qui parle » ;
  - `techniqueExplanation` = le texte qui suit le titre, **jusqu'avant** « À toi de jouer » ;
  - `howToApply` = « À toi de jouer : ... » **avec son exemple** (sans les astérisques de mise en forme).
- Autres champs. Correction C5 (b) : dans BASE, **15 des 16** vannes BOULOT en ligne sont `ONE_LINER` (l. 1041-1191 ; celle de l. 1191 est `STORY`), et la tâche s18 créait ses vannes neuves en `STORY`, sans `howToApply` (`parcours-storytelling-sync.ts` l. 208-225). `ONE_LINER` est retenu pour suivre la catégorie BOULOT ; la décision ne change pas. Valeurs : `category` `BOULOT`, `type` `ONE_LINER`, `maturityLevel` 1, `isActive` `true`, `generatedByAI` `false`, `copyVerdict` `GARDER`, `copyReviewVersion` 1, `copyReviewedAt` à l'import. Création **si absente** (rapprochement par `content` exact), un marqueur `DataPatch` par vanne (id de la vanne créée), comme s18.

### 4.2 Les 20 vannes en ligne, désignées par id

Contrôle croisé à l'import : l'id existe et son `content` est identique au tableau de V (rapprochement par texte exact en cas de doute sur un id, comme `jokeContents` en s18). `isActive` revérifié contre la base de prod (export du 11/10 : `docs/content/vannes-actives-s19.json` ; « tir à l'arc » `cs14jk7911857c4ff09eb025` en particulier). Une vanne inactive bloque l'import de l'étape et se signale, jamais de réactivation silencieuse. **Lire aussi `generatedByAI`** de ces 20 vannes en base (champ absent de l'export) : une vanne liée à `true` reste exposée à la relecture IA (`copy-review-runner.ts` l. 139-146), qui peut réécrire son `content` et casser le lien `jokeContents`. La signaler à la session avec son id ; ne pas changer le champ sans décision (ces vannes ne sont ni créées ni réécrites par cet import).

| Étape | Places en ligne (ids) |
|---|---|
| 1 | place 1 `cs14jka89abf28d3769b05fe` ; place 2 `cmoxx7e56003xs60yyooxncw3` |
| 2 | place 1 `cs14jk69eb578cce484b6f87` ; place 2 `cs14jk0c96df8dc97a67e3f6` ; place 3 `cs14jkd6b11e811ffbf7f301` ; V-2-2 (catalogue) `cs14jk8c54311509a1108b0a` |
| 3 | place 1 `cs14jk4d523526fb0d6ca24e` ; place 2 `cmmnsqn14003rth6379n30nzd` |
| 4 | place 1 `cs14jk0aa83dd779a1c72b43` ; place 2 `cs14jkdb222991fcbf194845` ; V-4-1 (catalogue) `cmnl01zwv004ss60y2ecodj9a` ; V-4-2 (catalogue) `cmmw0togs0001mw62152nl589` |
| 5 | place 1 `cs14jke4221e9a31a33b0395` ; place 2 `cs14jk7911857c4ff09eb025` ; V-5-1 `cmmnsqn15007dth63pcggw13x` ; V-5-2 `cs14jk1e07f8547b752601b8` ; V-5-3 `cs14jk88f075a4297ed90830` |
| 6 | V-6-1 `cmmnsqn14003vth63i2are7es` ; V-6-4 `cs14jkbdb9858fdd496e962a` ; V-6-5 `cs14jk8f28ff20e1cf82f3a8` |

Total : 2 + 4 + 2 + 4 + 5 + 3 = 20. Les ids de V ont été contrôlés contre l'export ; l'id de V-5-1 est le bon (`...pcggw13x`, pas `...jbugyxvs`).

### 4.3 Le PS d'Anouk (S-2) n'est PAS une vanne du catalogue

Il vit dans le `moduleDetail` de l'étape 2 (texte de scène) et ne se crée pas en table `Joke`. Idem la scène de l'étape 6, qui ne cite aucune vanne.

## 5. Code

1. **Sauts de ligne** : ajouter `whitespace-pre-line` aux trois `<p>` qui affichent `moduleDetail` (avant cela, vérifier qu'aucun `moduleDetail` des autres parcours ne contient de `\n`) : `apps/web/src/components/parcours/parcours-step-card.tsx` (étape ouverte, vers l. 285), `apps/web/src/components/parcours/step-blocks.tsx` (aperçu verrouillé `LockedStepPreview`, vers l. 39, ce que voit la visiteuse) et `apps/web/src/components/parcours/parcours-content.tsx` (bloc « Programme » de /parcours, vers l. 335-337).
2. **`frTypo` étendu au slug `boulot`** (insécables dans « 9 h 50 », « 16 h 40 », « 12 h 52 », « 18 h 30 », « 19 h 10 », « 17 h 30 » et avant « : ») : la condition `slug === "storytelling" ? frTypo(...)` de `parcours-step-card.tsx` (vers l. 269) devient valable pour `boulot`, avec `why` et `moduleDetail` passés dans `frTypo`, **et** les deux autres rendus du `moduleDetail` (`step-blocks.tsx` aperçu verrouillé, `parcours-content.tsx` bloc « Programme »), pour `boulot` seulement. Horaires à vérifier dans la liste : **« 9 h 50 »** (étape 1) et **« 12 h 52 »** (étape 3) s'ajoutent aux quatre autres ci-dessus (N6 de @reviewer).
3. **Données structurées et `llms`** : `parcours-jsonld.ts` et `llms-parcours.ts` ne reprennent pas le saut de ligne tel quel.
4. **Autres** : la liste unique `src/lib/parcours-seed.ts` ne publie `boulot` que si `BOULOT_PUBLIE` est à `true` ; le texte du verrou « Le conseil, les vannes, les vidéos et le quiz de cette étape font partie de Premium » ne cite « les vidéos » que si l'étape en a ; la spec RC8 dit que l'aperçu d'une étape 2 à 6 montre la durée alors que `LockedStepPreview` n'en montre aucune (`[DÉCISION @product-manager, défaut si silence : corriger la phrase de la spec ; la durée est déjà dans la liste /parcours et dans l'étape 1]`) ; le titre « Pour aller plus loin, facultatif » est provisoire dans le code (le vocabulaire « facultatif » des légendes suit s'il change). L'orientation de /parcours (`parcours-orientation.ts`) et l'onboarding ne ciblent pas le Boulot : information donnée à Thomas, décision @product-manager, hors import.
5. Pre-commit : `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`.

## 6. Contrôles de contenu sur les textes importés

Zéro tiret cadratin (—) ; zéro « blague » ; zéro « carnet » (dire « tes notes ») ; tutoiement ; aucun prénom de persona dans les textes du site (Anouk est un exemple de scène, jamais une vraie membre ; Inès et Camille sont dans l'exemple validé du PS) ; aucun marqueur entre crochets (`[...]`) résiduel dans les champs importés ; aucun concurrent nommé.

## 7. Avant l'import : vidéos

1. **Chaque vidéo retenue (les 10, étape 1 comprise : VDB et Vérino) est regardée une fois par une personne** (Thomas ou quelqu'un qu'il désigne) : contenu confirmé, **durée affichée relevée**, fiche corrigée en base. Une session ne peut pas visionner. Légendes et durées vraies à confirmer en particulier : Croce « avion » (fiche « 10 vannes en 5 minutes », base 2 min 30), Hamzawi (4 min), Delmoitiez (6 min), Foresti, Guiz « fast-food ».
2. **Fiches en base à corriger** (E, signalement 11) : `m30qZa8p_Js` (titre YouTube « JCC 8è saison - Marina Rollman », 5 min 08 ; vidéo de Répartie 1, la regarder pour vérifier le contenu) ; `qdqIc-uzdbA` (titre YouTube « Haroun - Jamel Comedy Club Saison 9 » ; vidéo de Répartie 4) ; **Vérino `rldvVgHQSvo` : 5 min 51 s** (la base dit 7 min 30, `PT7M30S`, et la fiche « 7 minutes de comédie »).
3. Une vidéo qui ne tient pas est retirée : étapes 5 et 6, variantes sans vidéo (section 2) ; autres étapes, la vidéo de la spec (E §6, colonne A) reprend sa place.

## 8. Après l'import

1. **Relecture du rendu par @design et @ux, jusqu'à 10/10** (choix de Thomas du 07/10) : captures 375, 768 et 1280, visiteur et Premium, interrupteur forcé localement (jamais committé).
2. **Feu vert de publication par Thomas**, puis `BOULOT_PUBLIE` à `true` et déploiement.
3. **`REPLIT_ACTIONS.md`** complété par @fullstack : déploiement, activation, retour arrière (restaurer les `DataPatch`, repasser l'interrupteur à `false`).
4. Instrumentation : lire `parcours-etape.duree_s` en commençant par l'étape 6 (médiane cible ≤ 1 300 s ; étapes 2 à 5 ≤ 900 s), puis l'étape 4 ; ajuster `dureeTexte` au chiffre mesuré, arrondi à 5 min. Plan de mesure : P, section « Plan de mesure ».
5. Rejouer la section 6 sur le rendu.

---
**Handoff → @fullstack** (puis @design et @ux pour le rendu, @orchestrator pour la clôture)
- Fichier produit : `/home/user/Marrant/docs/marrant/parcours-boulot-s19/import-boulot.md`.
- Décisions prises : liste d'import unique (remplace les deux handoffs) ; étape 1 en version finale (choix 5 B Vérino seule en facultative, choix 6 B phrase du test incluse) ; PS : choix 7 = a, ABSURDE, INTERMEDIAIRE ; vannes neuves en `ONE_LINER`, convention BOULOT de la base et de s18.
- Points d'attention : `metaDescription` écrite (154 caractères, section 1) ; `isActive` des 20 vannes en ligne à revérifier ; visionnage des 10 vidéos avant import ; interrupteur éteint tant que Thomas n'a pas donné son feu vert.
- Itération 4 (C1 à C7, 11/10) : entrée `PARCOURS_META.boulot` sous `BOULOT_PUBLIE` et liste Grep des usages de `STORYTELLING_PUBLIE` (§1) ; `tipTitle` exacts (§2) ; 4 conseils à sauvegarder, pas 6, source `-vN` qui fait foi et aucun écart trouvé au 11/10, `REECRIRE` / 18 / `generatedByAI: false` (§3) ; `jokeContents` dans l'ordre des tableaux de V, ids pour le contrôle, `generatedByAI` des 20 vannes liées à lire (§4) ; deux justifications corrigées (§1 note `metaDescription`, §4.1) ; exception V-3-3 notée dans V. Aucun texte validé modifié.
---

## Constat de la session (11/10, base prod en lecture seule)

Les 20 vannes en ligne liées au parcours sont toutes actives. **Deux sont marquées `generatedByAI = true`** : `cmoxx7e56003xs60yyooxncw3` (étape 1, « point rapide avant l'été ») et `cmnl01zwv004ss60y2ecodj9a` (étape 4, le bus). Ne PAS passer ce champ à `false` : il dit la provenance réelle (obligation de transparence). À l'import, @fullstack vérifie si une relecture IA automatique du catalogue peut encore tourner sur des vannes `generatedByAI = true` ; si oui, il protège ces deux vannes par un autre moyen (exclusion explicite des vannes liées à une étape de parcours, par exemple) ou propose à Thomas de les remplacer par une vanne de réserve de `repli-catalogue.md`, sans rien décider seul.

