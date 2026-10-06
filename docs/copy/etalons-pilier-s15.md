# Étalons du pilier `/blog/comment-devenir-drole` (s15, 06/10/2026)

Calibrage P0 s8 : **rien n'est réécrit dans le code tant que Thomas n'a pas choisi** une proposition par étalon. Sources : diagnostic `docs/seo/pilier-non-indexe-s15.md` §4.2-4.3, charte `docs/copy/charte-refonte-copy-s11.md`, préférences `docs/founder-preferences.md`. Texte source : `apps/web/src/lib/blog-articles.ts` (article statique, slug l.19). [Conscience : Problem-Aware (« comment devenir drôle ») vers Solution-Aware ; Framework : réponse directe en tête puis PAS léger (l'oncle, le mécanisme, le plan).]

## 0. Constats préalables (vérifiés dans le code)

- **Le H1 EST le title** : `blog/[slug]/page.tsx:31` (`fitTitle(article.title)`) et `components/blog/blog-article-view.tsx:92` (`<h1>{frTypo(article.title)}</h1>`). Changer `title` (blog-articles.ts:20) change donc le title de page, le H1, le fil d'Ariane, le JSON-LD et les cartes de liste en même temps. Précédent : title/H1 déjà réécrits ensemble pour 5 pages avec GO Thomas (s15). Slug inchangé dans toutes les propositions. Les 3 propositions de titre gardent « Comment devenir drôle » en tête exacte.
- **Une seule version vraie des chiffres**, tirée du contenu existant :

| Chiffre | Version retenue | Où c'est déjà dit |
|---|---|---|
| Piliers | **5 piliers** (observation, surprise, timing, autodérision, pratique) | H2 l.43, H3 l.47-76, excerpt l.22, article `erreurs-blagues` l.361 |
| Plan | **30 jours**, **5 à 10 minutes par jour**, 4 étapes (observer, reformuler, tester, élargir) | H2 l.82, étapes l.84-87, CLEF l.89 |
| 8 semaines | **durée du programme étudié par Crawford et Caltabiano**, pas une promesse du site | l.37, l.41, l.114 (intouchables) |
| 2 à 4 semaines | premiers effets visibles (cohérent avec 30 jours), inchangé | FAQ l.111 |
| 3 leviers | = les 3 premiers piliers (observation, surprise, timing) ; à ne plus présenter comme un autre système | l.23, l.41, l.112 |

- Aucun chiffre n'est ajouté. L'étalon 1 retire de l'« En bref » « 3 leviers » et « 8 semaines » (promesse du site) : les deux restent ailleurs sur la page (l.37, 41, 112, 114). **Règle chiffres : GO Thomas requis pour ce déplacement** (Q1 ci-dessous).

---

## Étalon 1 : « En bref » (réponse directe en tête, 40 à 60 mots)

**Texte actuel** (`blog-articles.ts:23`, 55 mots) :
> **En bref :** Devenir drôle est une compétence qui s'apprend, pas un talent inné. L'humour s'appuie sur 3 leviers (observation, surprise, timing) que n'importe qui peut développer. Un programme structuré de 8 semaines suffit à progresser significativement, quel que soit le niveau de départ.

Défauts : dit *que* ça s'apprend, pas *comment* ; 3 leviers puis 5 piliers ; 8 semaines puis 30 jours ; aucune action.

**Proposition 1A : les 4 gestes du plan, à l'impératif** (53 mots)
> **En bref :** Pour devenir drôle, note chaque jour une situation absurde, reformule-la en 3 versions, teste la meilleure sur un proche, puis réutilise ce qui a fait sourire. 5 à 10 minutes par jour pendant 30 jours suffisent à la plupart des gens pour sentir la différence : l'humour est une compétence, pas un talent inné.

**Proposition 1B : 4 étapes + preuve par un humoriste** (58 mots)
> **En bref :** Pour devenir drôle, suis quatre étapes : observer une situation absurde par jour, reformuler en 3 versions, tester sur un proche, puis élargir en réunion ou en soirée. Compte 5 à 10 minutes par jour pendant 30 jours. L'humour s'entraîne comme une compétence : Paul Mirabel a commencé devant 20 personnes, avec une vanne sur deux qui tombait à plat.

**Proposition 1C : comprendre + plan (5 piliers nommés)** (51 mots)
> **En bref :** Devenir drôle s'apprend : l'humour repose sur 5 piliers (observation, surprise, timing, autodérision, pratique) et se travaille avec un plan sur 30 jours, à raison de 5 à 10 minutes par jour. Commence par noter une absurdité par jour, puis teste-la sur un proche : le reste du guide t'explique pourquoi ça marche.

**Recommandation : 1A.** Réponse la plus actionnable et la plus citable (verbes, ordre du plan, zéro doublon de chiffres), la thèse « compétence, pas talent inné » reste en fin de phrase. 1B répète l'anecdote Mirabel déjà dans l'intro l.29 ; 1C est correcte mais la liste de piliers ralentit la tête de page et se répète dans le H2 l.43.

---

## Étalon 2 : titre affiché (title = H1)

**Texte actuel** : `blog-articles.ts:20` : « Comment devenir drôle : le guide » (32 car., + suffixe de marque = 53, donc rendu avec template). Excerpt l.22 (meta description) : « ... les 5 piliers, ce qu'en dit la science et un plan sur 30 jours » : déjà aligné sur 5 piliers + 30 jours, **à ne pas toucher**.

Différenciant vrai : la page contient réellement 5 piliers (comprendre) et un plan de 30 jours (agir) ; « 10 exercices pour développer ton humour » (titre de `exercices-developper-humour`, l.864) occupe « s'entraîner ». Le title doit donc dire « comprendre + plan », pas « exercices ».

**Proposition 2A** (57 car., title absolu sans suffixe, ≤ 60 donc non tronqué)
> Comment devenir drôle : 5 piliers et un plan sur 30 jours

**Proposition 2B** (45 car.)
> Comment devenir drôle : le guide en 5 piliers

**Proposition 2C** (41 car.)
> Comment devenir drôle : plan sur 30 jours

**Recommandation : 2A.** Seule à porter les deux rôles du pilier (comprendre et plan), elle reprend la piste du diagnostic §4.3(d), elle se distingue nettement de « 10 exercices... » et elle garde l'ancre « Comment devenir drôle » en tête. 2B garde « le guide » mais ne dit rien du plan ; 2C est la plus actionnable mais efface le « comprendre » et le mot « piliers » que l'article de répartie et `erreurs-blagues` (l.361) utilisent déjà en lien.

**Effets de bord à traiter par @fullstack si 2A/2B/2C est retenue** (non touchés ici) :
- Titre en dur dans `app/(dashboard)/vannes/page.tsx:96` et `app/(dashboard)/videos/page.tsx:92` (objets titre/url) : à aligner.
- Tests : `__tests__/feature/blog.test.tsx` utilise un mock indépendant (pas d'impact) ; `blog-em-dash-static.test.ts` (baseline `blog-em-dash-baseline.json:20`) : aucun tiret cadratin ajouté par ces propositions.
- `updatedAt` (l.107) à mettre à la date réelle de déploiement (L7 du diagnostic).

---

## Étalon 3 : introduction recentrée « comprendre + plan sur 30 jours »

**Texte actuel** (`blog-articles.ts:25`) :
> "Soit t'es drôle, soit tu l'es pas." Celui qui dit ça, c'est souvent l'oncle qui raconte la même blague sur les blondes depuis 2003. Il est "né drôle", paraît-il. **L'humour est une compétence**, pas un chromosome : ça s'apprend.

Le paragraphe est bon (hook de l'oncle repris dans l'excerpt) : **on le garde intact** (« améliorer, pas amputer ») et on ajoute le contrat de lecture, qui manque : la page n'annonce ni son contenu ni son rôle, ni le renvoi vers l'article d'exercices (lien absent du pilier aujourd'hui, L6 du diagnostic).

**Proposition 3A : deux temps annoncés** (+ 1 paragraphe, 63 mots)
> Ce guide fait deux choses. D'abord, il t'explique comment ça marche : pourquoi on croit à un don, ce que la science en dit et les 5 piliers qui font rire. Ensuite, il te donne un plan sur 30 jours, à raison de 5 à 10 minutes par jour. Pour t'entraîner en détail, on a réuni [10 exercices pour développer ton humour](/blog/exercices-developper-humour).

**Proposition 3B : pont « comprendre » vers « produire »** (+ 1 paragraphe, 71 mots)
> Reste à savoir comment. Au programme : pourquoi les humoristes ne sont pas « nés drôles » (ils ont enchaîné les bides avant de remplir des salles), ce que la science dit de l'apprentissage, les 5 piliers, puis un plan sur 30 jours pour passer de « comprendre » à « produire ». Quand tu voudras t'entraîner séance par séance, direction nos [10 exercices pour développer ton humour](/blog/exercices-developper-humour).

**Proposition 3C : version minimale** (+ 2 phrases, 38 mots)
> Le programme : comprendre pourquoi l'humour s'apprend (5 piliers), puis le pratiquer pendant 30 jours. Pour le détail des exercices, va voir [10 exercices pour développer ton humour](/blog/exercices-developper-humour).

**Recommandation : 3B.** Elle a la voix du site (clin d'oeil à l'H2 « Pourquoi pense-t-on que l'humour est un talent inné ? » et écho de la phrase l.35 « passer de comprendre à produire »), elle annonce les 5 piliers et les 30 jours sans doublon de durée avec l'« En bref » (la fréquence 5 à 10 min/jour n'y figure pas), et elle règle le rôle : le pilier explique et planifie, l'article d'exercices fait s'entraîner. 3A est claire mais d'une structure plus scolaire (« D'abord... Ensuite ») ; 3C est trop discrète pour fixer le rôle.

---

## Questions pour Thomas (GO requis)

1. **Chiffres de l'« En bref »** (étalon 1) : « 3 leviers » et « 8 semaines (programme) » quittent la tête de page, remplacés par le plan « 30 jours, 5 à 10 minutes par jour ». Les deux restent dans le corps (l.37, 41, 112, 114, avec 8 semaines attribué à l'étude). OK ?
2. **Title = H1** (étalon 2) : GO pour que le H1 change avec le title ?
3. **Optionnel, non inclus dans les étalons** : « 3 leviers » reste en l.41 (« À retenir ») et l.112 (FAQ 2) ; pour supprimer l'ambiguïté avec les 5 piliers, reformuler « les 3 premiers piliers (observation, surprise, timing) ». Chiffre touché : GO séparé.

## Périmètre de la réécriture après choix (mesure du diff, P0 s11)

- **Modifié** : l.23 (En bref), l.20 (title), l.25 (+ 1 paragraphe ajouté après). Ordre de grandeur : ≈ 100 mots sur 1 433, soit ≈ 7 % de changement. À mesurer sur le diff réel avant tout rapport.
- **Intouchable** : slug, H2, H3, FAQ (questions et réponses), liens existants, excerpt, citation Crawford et Caltabiano et sa source, humoristes, prix (« 2,99 EUR/mois » l.105), `updatedAt` hors L7.
- **Signalé, hors périmètre** : 5 H3 des piliers contiennent un tiret cadratin (l.47, 55, 64, 70, 76, « Pilier 1 : L'observation — Voir... ») : le test `blog-em-dash-static.test.ts` plafonne le total sans les corriger. À traiter dans une passe dédiée avec GO ; les contraintes SEO des H3 (ancres) sont à vérifier avant.

## Handoff → @orchestrator (puis Thomas pour le choix, puis @fullstack)

- **Fichier produit** : `/home/user/Marrant/docs/copy/etalons-pilier-s15.md`. Aucun autre fichier modifié.
- **Décisions** : recommandations 1A, 2A, 3B (les trois se complètent sans doublon : action en tête, différenciant dans le title, contrat de lecture dans l'intro). Une seule version de chiffres : 5 piliers, plan de 30 jours (5 à 10 min/jour), 8 semaines = l'étude, 2 à 4 semaines = premiers effets. H1 = title (blog-article-view.tsx:92), donc changement lié.
- **Points d'attention** : GO Thomas pour Q1 et Q2 avant toute écriture dans le code ; titre en dur à aligner dans `vannes/page.tsx:96` et `videos/page.tsx:92` ; liens L6 (vers `exercices-developper-humour`) introduits par l'étalon 3 ; validation @geo de la tête de page recommandée par le diagnostic (le pilier est la cible des citations IA) ; keyword-map absent (`docs/seo/keyword-map.md`) : requêtes cœur prises du diagnostic (« comment devenir drôle », « comment être drôle »), aucune zone `[MOT-CLÉ SEO À INTÉGRER]` ajoutée. Références marché non consultées (périmètre limité à la calibration interne).
