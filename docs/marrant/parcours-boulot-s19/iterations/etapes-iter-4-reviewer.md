# Parcours Boulot, itération 4 : vérification finale @reviewer avant import (s19, 11/10/2026)

> Fichier contrôlé : `docs/marrant/parcours-boulot-s19/import-boulot.md` (liste unique, fait foi). Recoupé avec `docs/copy/etalons-parcours-boulot-s19.md` (E), `docs/copy/parcours-boulot-etapes-2-6-s19.md` (P), `vannes-neuves/vannes-finales.md` (V), `docs/content/boulot-base-s19.json` (BASE), `vannes-actives-s19.json`, et le code cité (`schema.prisma`, `parcours-storytelling-sync.ts`, `parcours/[slug]/page.tsx`, composants `parcours/`, `copy-review-runner.ts`). Aucun autre fichier modifié.
> Hors notation : texte des vannes, du PS d'Anouk, des conseils et des défis ; choix documentés de Thomas.

## Note : 9/10, 0 bloquant

**Résumé.** B1 est levé : la liste unique existe, elle fait foi (dit en tête de E l. 396 et 403, et de P l. 427), et elle couvre tout ce que je demandais (a à h). B2 est levé. N1 à N7 sont faits. La `metaDescription` respecte la charte. Les renvois pointent tous vers des sections qui existent, et les ids, `youtubeId`, numéros de ligne et décomptes que j'ai contrôlés sont justes. Ce qui manque pour le 10 : la liste ne dit pas comment une étape est reliée à son conseil (`tipTitle`) ni à ses vannes (`jokeContents`, alors qu'elle dit « par id »). L'entrée `PARCOURS_META` est décrite sans la condition de l'interrupteur. Deux affirmations de justification sont fausses. Ce sont 7 corrections de document, sans risque pour le contenu : un écart sur `tipTitle` ou `jokeContents` fait échouer la tâche sans rien publier (refus journalisé, comme en s18).

## Vérifications

| Point | Verdict | Évidence |
|---|---|---|
| B1 (a) 10 neuves : places, champs, décryptage réparti, `type`, catégorie | PASS | Import §4.1 ; places = V l. 15-17, 26, 35-37, 47, 64-65 ; champs `schema.prisma` l. 129-131 ; « Décryptages des 10 neuves » existe (V l. 79) |
| B1 (b) 20 en ligne par id, `isActive` revérifié | PASS | Import §4.2 : 20 ids identiques à V, 2+4+2+4+5+3 = 20 ; « tir à l'arc » présent dans `vannes-actives-s19.json` l. 682 |
| B1 (c) S-2 n'est pas une vanne | PASS | Import §4.3 |
| B1 (d) conseils : réactiver, créer, remplacer, ids, PS ABSURDE | PASS | Ids des étapes 3, 4, 5 à BASE l. 606, 286, 946 (titres conformes) ; PS `cmmw0tqkc000smw62bo1yfeyg` BASE l. 86 ; `ABSURDE` existe dans `TipCategory` (`schema.prisma` l. 238) ; `conseils-seed.json` = `docs/content/conseils-seed.json` |
| B1 (e) étape 1 finale | PASS | E §3 : l. 157 tranché, l. 176 sans `[SI ...]`, ligne Tsamère retirée (l. 240) ; import §2 |
| B1 (f) code, N6 compris | PASS | `parcours-step-card.tsx` l. 269 et 285, `step-blocks.tsx` l. 39 : lignes exactes ; horaires 9 h 50 et 12 h 52 ajoutés |
| B1 (g) visionnage des 10 vidéos | PASS | Import §7 ; les 10 `youtubeId` sont dans BASE, titres conformes (Guiz fast-food l. 1664, Hamzawi l. 1889, Croce l. 1952, Vérino l. 2087…) |
| B1 (h) fiche, interrupteur, `"pro"`, contrôles, rendu à 10/10, feu vert de Thomas | PASS | Import §1, §6, §8 ; `"pro"` : 3 + 3 + 1 dans `docs/content/` et 2 dans le test, comme annoncé |
| Champs d'étape : XP, `dayNumber`, quiz, `retourExerciceNote`, `dureeTexte` | PASS | Conformes à P l. 15-19, 313-315, 380-387 et E l. 178, 191 |
| Renvois de sections | PASS | E §1 « Étape 1 », « Choix 7 » / « Le conseil complet », E §2 colonne B, E §3 « Quiz, trois questions » et « Les 2 vidéos », E §6, signalement 11 ; P « Les 2 vidéos », « La vidéo », « Fin de parcours », « Plan de mesure » ; `implementation.md` « Décisions d'architecture » ; `etapes-iter-3-ux.md` : tous présents |
| Liaison étape → conseil et étape → vannes | **FAIL** (non bloquant) | C2, C3 |
| `PARCOURS_META` | **FAIL** (non bloquant) | C1 |
| B2 | PASS | P l. 411 sans mention de relecture, statut l. 413, doute (a) l. 429 ; import l. 36 |
| N1 à N7 | PASS | N1 P l. 294 ; N2 P l. 373 et `repli-catalogue.md` l. 74 ; N3 P l. 309 ; N4 P l. 310, recompté 111 + 22 = **133** test compris (note l. 317 juste) ; N5 E l. 157, 176, 181, 240 ; N6 import §5 ; N7 V l. 93 |
| `metaDescription` (charte) | PASS | 154 caractères recomptés (32 + 33 + 29 + 36 + 24) ; zéro tiret cadratin ; « Première étape gratuite. » ; ni « drôle », ni « bureau », ni « humour » ; `fitDescription` coupe à 160 (`seo-meta.ts` l. 61), donc rien n'est tronqué. Justification fausse : C5 |
| Tirets cadratins dans l'import | PASS | Une seule occurrence : la règle elle-même (l. 128) |

## Corrections (toutes non bloquantes, toutes dans `import-boulot.md`)

**C1. `PARCOURS_META` : condition de l'interrupteur et champs du type** (import l. 40). Le type exige `name`, `title`, `description`, `duration`, `stepsCount` (`page.tsx` l. 44). L'entrée Storytelling n'existe que si `STORYTELLING_PUBLIE` est vrai (l. 73-83). Or `generateStaticParams` lit les clés de `PARCOURS_META` (l. 87), et la page ne renvoie un 404 que si la donnée et l'entrée manquent toutes les deux (l. 164). Une entrée `boulot` sans condition rendrait donc `/parcours/boulot` accessible avant le feu vert de Thomas. Écrire : « entrée `boulot` sous `...(BOULOT_PUBLIE ? { boulot: {...} } : {})`, comme Storytelling ; `description` = `metaDescription` du fichier de contenu, `duration` et `stepsCount` comme Storytelling ». Ajouter au paragraphe de l'interrupteur : « reproduire pour `BOULOT_PUBLIE` chaque usage de `STORYTELLING_PUBLIE` (Grep) : `parcours-seed.ts`, `entrees-parcours.ts`, `page.tsx`, offre Premium (« Les N parcours en entier », test `premium-paywall.test.tsx` l. 68), tests de l'interrupteur ; pas `quiz-data.ts` (orientation hors import, §5.4) ».

**C2. `tipTitle` n'est pas donné.** C'est la clé qui relie une étape à son conseil (`parcours-storytelling-sync.ts` l. 286-305 : recherche par titre exact). Or §2 dit d'importer « tel quel » le tableau d'étape, où `tipTitle` porte une parenthèse de note (E l. 174 « (conseil validé, §1) », P l. 36 « (conseil du tour 13, choix 7a) »). En même temps, le titre de l'étape 5 contient une vraie parenthèse, « (et briller) ». Ajouter à §2 : « `tipTitle` = colonne « Conseil » du tableau de la section 3, texte exact ; les parenthèses de E §3 et de P étape 2 sont des notes ; « (et briller) » fait partie du titre ». Préciser aussi que la ligne `exemple` du conseil du tableau P étape 2 ne s'importe pas dans l'étape (elle va dans le conseil, §3).

**C3. Vannes : le lien d'étape est `jokeContents`, pas l'id** (import l. 86, « importer les liens d'étape par id »). Le contrat D4 (`parcours-data.ts` l. 39-40, `parcours-vannes.ts` l. 3) relie une étape à ses vannes par les 5 `content` exacts, et s18 fait pareil (`parcours-storytelling-s18.json` l. 121). Écrire : « dans le fichier de contenu, chaque étape porte `jokeContents` = les 5 `content` de V, dans l'ordre des places du tableau ; les ids de §4.2 servent au contrôle (existence, texte identique, `isActive`) ».

**C4. Champs de relecture des conseils : consigne contradictoire et incomplète** (import l. 82). « `copyVerdict` `GARDER`, `copyReviewVersion` et `copyReviewedAt` comme la tâche s18 (l. 113-120) » : la tâche s18 écrit `REECRIRE` et la version `18` (l. 118-119). Rien n'est dit non plus pour les conseils 3, 4, 5 et pour le PS. L'enjeu est réel : `copy-review-runner.ts` (l. 297-301) relit et peut réécrire tout conseil `generatedByAI: true` dont la version diffère de `COPY_REVIEW_VERSION`. Le travail est coupé par l'interrupteur de génération (`jobs.ts` l. 561), mais rien ne garantit qu'il le restera. Écrire, pour les 6 conseils : `copyVerdict` (valeur unique à choisir), `copyReviewVersion` = valeur courante de `COPY_REVIEW_VERSION` en prod, `generatedByAI` = `false` (champ absent de l'export : le vérifier en base pour les 4 existants). Au passage, « export des 6 conseils concernés » (l. 67) : 4 existent ; les 2 autres sont créés.

**C5. Deux justifications fausses** (le texte retenu ne change pas).
- (a) Note `metaDescription` (l. 32-33) : « comme les quatre autres pages ». Seule Machine à Café porte « 15 min/semaine » (`page.tsx` l. 51). Répartie et Confiance n'ont que « Première étape gratuite. » (l. 59, 67). Storytelling n'a ni l'un ni l'autre (« Lis la première étape gratuite du parcours Storytelling. », `parcours-storytelling-s18.json` l. 103). Écrire « comme l'exigent les étalons (signalement 8) », et écarter la candidate B pour ce motif, pas pour un « écart avec les 4 autres pages ». La même affirmation figure dans E l. 146 et 385 (historique validé : ne pas y toucher).
- (b) §4.1 (l. 97) : « les 16 vannes BOULOT en ligne sont `ONE_LINER`, l. 1041-1191 ». Il y en a 15 sur 16 : BASE l. 1191 est `STORY`. Et le code cité (l. 208-225) crée en `STORY` sans `howToApply`. Écrire « 15 sur 16 en base ; s18 créait en `STORY` ; `ONE_LINER` retenu pour suivre la catégorie BOULOT ». La décision tient.

**C6. Conseils : que faire si E §1 et la source diffèrent ?** (l. 67). La liste demande une comparaison entre E §1 et `conseils-boulot-s19-v1/-v2/-v5/-v6.md` sans dire quoi faire en cas d'écart. Or le handoff des étalons dit d'importer depuis les sources, « non depuis ce fichier » (E l. 398). Écrire : « source = fichier `-vN` (texte relu à l'aveugle) ; en cas d'écart avec E §1, rien n'est importé pour ce conseil et l'écart est signalé ». Préciser aussi : `-v1.md` pour les étapes 4 et 5.

**C7. V-3-3 n'est plus « mot pour mot » de sa source** (V l. 79 et 93). N7 a retiré la parenthèse de brief, ce qui est voulu. Mais l'en-tête de V annonce toujours une reprise mot pour mot de `v5.md`, et la comparaison de C6 ou un contrôle @qa signalerait un faux écart. Ajouter à V l. 79, ou à l'import §4.1 : « sauf V-3-3 : parenthèse de brief retirée (N7, iter-3) ; V fait foi ».

## Observations (aucune correction demandée)

- **O1.** `metaDescription` : « du silence en réunion ». Le mot « silence » est banni des textes de l'étape 1 (E l. 169, vocabulaire de Machine à Café 2). La meta n'est pas un texte d'étape, et « silence » y dit le problème de la persona (Problem-Aware), pas la technique : je ne demande rien.
- **O2.** Le décryptage de V-3-3 garde « Le setup compte six mots » : un anglicisme visible par le membre. C'est du texte relu, je le signale seulement.
- **O3.** Je n'ai pas d'outil shell : diff réel (P0 s11) non mesuré ici. Les comptes ci-dessus sont faits à la main, mot par mot (scène 6) et caractère par caractère (meta).

## Pour la suite

C1 à C7 sont des phrases à ajouter dans `import-boulot.md` (plus une ligne dans V pour C7), sans toucher aucun texte validé. Avec elles : 10/10. Je ne repasse que ces sept points. Si la session préfère lancer @fullstack tout de suite, lui transmettre C1 à C4 dans son prompt suffit : C5 à C7 ne changent pas ce qui est importé.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/marrant/parcours-boulot-s19/iterations/etapes-iter-4-reviewer.md`. Aucun autre fichier modifié.
- Décisions prises : 9/10, 0 bloquant ; B1, B2, N1 à N7 levés ; `metaDescription` conforme à la charte ; GO pour l'import une fois C1 à C4 transmis à @fullstack (inscrits dans `import-boulot.md` ou dans son prompt).
- Points d'attention : C1 (risque de page `/parcours/boulot` visible avant le feu vert si l'entrée `PARCOURS_META` n'est pas conditionnée), C4 (conseils validés exposés au travail de réécriture IA si `generatedByAI`/`copyReviewVersion` sont mal posés). Agent à relancer : la session (édition mineure de document) ; puis @fullstack.
---
