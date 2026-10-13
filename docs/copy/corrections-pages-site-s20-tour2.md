# Corrections des pages du site, tour 2 (retouches après relecture à l'aveugle du 13/10)

> Auteur : @copywriter, 13/10/2026. Sources : `relecture-videos-s20/aveugle-pages-1310.md`, la clé, les 3 verdicts (reviewer, ux, creative-strategy), `corrections-pages-site-s20.md` (tour 1), `corrections-articles-s20-suite-tour3.md`.
> **Aucun fichier de code modifié.** Chemins relatifs à `apps/web/`. Zéro tiret cadratin.
> **« Avant »** = extrait exact du code lu à la rédaction, unique dans son fichier. Le tour 1 est en cours d'application par ailleurs (déjà passés : `vannes/page.tsx` l.57 J42, l.110 J04, l.138 J01 ; `faqs.ts` A2 ; `conseils/page.tsx` P2) : les numéros de ligne ont bougé. Si l'Avant ne correspond plus, utiliser la **variante** indiquée (= « Après » du tour 1). Les « Après » ci-dessous remplacent ceux du tour 1.
> **Règle d'or P0 s18** : chaque « Après » repasse la relecture à l'aveugle avant mise en ligne.

## 1. Liste des situations, alignée sur J01 / J04 / J22 (« boulot, couple, soirées, famille, gaming », école retiré : 5 vannes ÉCOLE actives sur 142, vérifié dans `vannes-actives-1310.json`)

**J29** (audit V3) : `src/app/(dashboard)/vannes/page.tsx:33`
- Avant : `rangées par situation : soirée, boulot, couple, école.`
- Après : `rangées par situation : boulot, couple, soirées, famille, gaming.`
- Variante d'Avant (tour 1) : `rangées par situation : soirée, boulot, couple, famille.`
- Raison : verdicts des 3 relecteurs, 4 situations au lieu de 5 et « soirée » au singulier. Attention : la méta description passe d'environ 148 à environ 159 caractères (avec « 290+ vannes »), au bord de la troncature Google. Si Thomas veut garder de la marge : `Chacune a sa chute et son décryptage, à replacer au bon moment.` (-6 caractères, à lui de trancher).

**J39** (audit V3) : `src/app/(dashboard)/vannes/page.tsx:92`
- Avant : `classées par situation (soirée, boulot, couple, école)`
- Après : `classées par situation (boulot, couple, soirées, famille, gaming)`
- Variante d'Avant (tour 1) : `classées par situation (soirée, boulot, couple, famille)`
- Raison : même défaut que J29 (JSON-LD de la page). Même liste, mêmes formes que J22.

## 2. Chiffres sans source retirés

**J32** (audit G2) : `src/lib/glossary.ts:79`
- Avant : `pour gagner 2-3 secondes`
- Après : `pour gagner quelques secondes`
- Variante d'Avant (tour 1) : `pour gagner 2 à 3 secondes`
- Raison : « 2 à 3 secondes » était présenté comme un gain mesuré, sans source (3 verdicts). Phrase obtenue : « …(« Intéressant », « Pas faux », « Bien vu ») pour gagner quelques secondes et trouver ta vraie réponse. » Le même chiffre traîne dans le blog (voir §7).

**J40** (audit V6) : `src/app/(dashboard)/vannes/page.tsx:57`
- Avant : `Au bout de 3-4 répétitions,`
- Après : `À force de la répéter,`
- Variante d'Avant (tour 1) : `Au bout de 3 ou 4 répétitions,`
- Raison : seuil d'effet inventé. Phrase obtenue : « …Avec Premium, tes favoris te servent de carnet à relire de temps en temps. À force de la répéter, elle sort toute seule, et de préférence au bon moment. » « La » renvoie à la vanne de la phrase 1 (« carnet » et « favoris » ne s'accordent pas).

**J30** (audit C2) : `src/app/(dashboard)/conseils/page.tsx:57`
- Avant : `Avec 5-10 minutes de pratique quotidienne,`
- Après : `Avec une pratique quotidienne, même courte,`
- Variante d'Avant (tour 1) : `Avec 5 à 10 minutes de pratique quotidienne,`

**J43** (audit C2) : `src/lib/faqs.ts:28` (ligne 26 avant le tour 1)
- Avant : `Avec une pratique quotidienne de 5-10 minutes,`
- Après : `Avec une pratique quotidienne, même courte,`
- Variante d'Avant (tour 1) : `Avec une pratique quotidienne de 5 à 10 minutes,`
- Raison commune J30 et J43 : **une seule formulation** sur les deux pages. Vérification dans le code : « 5 à 10 minutes par jour » n'est **pas** une donnée produit. Les seules durées sourcées sont `timePerWeek` des parcours (15 ou 20 min par semaine, `config/premium.ts:73-81`) et « le contenu du jour te prend 5 minutes » (`FAQ_REGULARITE`, `config/textes/entrees-parcours.ts:80`, texte et non constante). Le chiffre est donc retiré, sans rien promettre de plus. Reste volontairement : « 5 minutes par jour valent mieux qu'une heure une fois par semaine » (`conseils/page.tsx:57`, comparaison d'illustration, cohérente avec `FAQ_REGULARITE`). Reste aussi « 2 à 4 semaines » (A3, décision du 13/10) : même nature de promesse de résultat, à garder à l'œil.

## 3. Accueil, bloc « Prochainement »

**J10** (audit A1) : `src/components/home/upcoming-features.tsx:42`
- Avant : `Des parcours plus poussés sur la répartie et le storytelling, pour le jour où les bases ne te suffiront plus.`
- Après : `D'autres parcours plus poussés sont à venir, pour le jour où les bases ne te suffiront plus.`
- Variante d'Avant (tour 1) : `Des parcours plus poussés, sur la répartie d'abord, pour le jour où les bases ne te suffiront plus.`
- Raison : phrase avec verbe, ni date ni sujet annoncé. Constat dans le code : Storytelling (`STORYTELLING_PUBLIE = true`), Boulot (`BOULOT_PUBLIE = true`) **et Répartie** (`config/premium.ts:74`) sont en ligne, donc « sur la répartie d'abord » annonçait un parcours déjà publié : la formule du tour 1 est abandonnée. « D'autres » dit que les parcours actuels existent. Le titre « De nouveaux parcours » et le badge « Bientôt » restent cohérents.

## 4. Hub des vannes, lead

**J20** (audit V2) : `src/app/(dashboard)/vannes/page.tsx:111`
- Avant : `pour révéler la chute et garde tes préférées sous le coude.`
- Après : `pour révéler la chute. Avec Premium, tu gardes tes préférées sous le coude.`
- Variante d'Avant (tour 1) : `pour révéler la chute et, avec Premium, garde tes préférées sous le coude.`
- Raison : l'infinitif de but et l'impératif étaient coordonnés (verdict UX). Deux phrases, même registre (« tu »). Lead obtenu : « Boulot, couple, soirées, famille, gaming : choisis ta situation, clique pour révéler la chute. Avec Premium, tu gardes tes préférées sous le coude. La théorie, c'est bien… » Favoris = Premium confirmé au tour 1 (V2). À surveiller (non bloquant, reviewer) : « Premium » et les favoris reviennent 4 fois sur le hub (J20, J21, J22, J42).

## 5. Article « confiance et humour après une rupture »

**J41** (audit WALY) : `src/lib/blog-articles.ts:3289`
- Avant : `**Waly Dia** utilise systématiquement ce troisième niveau dans ses spectacles : il parle de ses expériences difficiles avec une précision d'entomologiste. Pas pour minimiser, mais pour montrer qu'il les a traversées et qu'il peut maintenant les cartographier.`
- Après : `**Waly Dia** nomme frontalement ce qui fait mal dans la société et en fait rire, sans détourner le regard. Fais pareil avec ta rupture : prends du champ par rapport à elle en la racontant comme un reporter. Consigne : trois phrases de compte rendu neutres, sans un seul adjectif, puis une quatrième avec le détail le plus absurdement précis. Exemple imaginé : « Samedi, elle m'a proposé de faire un point. Nous nous sommes assis dans la cuisine. Elle a parlé, j'ai écouté. Elle avait préparé un support de douze diapositives, sommaire inclus. » Relis-le à voix haute : si tu souris, le recul est là.`
- Raison : Waly Dia est gardé (règle P0). Seule la première phrase change par rapport au tour 3 (consigne, exemple des douze diapositives, test à voix haute : mot pour mot). « De loin » disparaît : il est présenté comme ce qu'il revendique, un humour frontal. Lien avec la consigne : il regarde le sujet en face, le reporter aussi (faits nus, sans adjectif), et c'est ce regard direct, pas la fuite, qui donne le recul. « Société » n'apparaît qu'une fois. Sources : Politis 2022 (« Je fais rire les gens qui luttent »), Le Temps (« le sniper de punchlines »). Je n'ai **pas** repris la piste « passer d'une anecdote perso à un constat sur la société » : une recherche web rapide ne la confirme pas comme procédé (elle confirme l'humour à visée sociale et frontal).

## 6. Anatomie d'une vanne : deux vannes remplacées par des vannes du catalogue (copiées à l'identique, id + texte)

Fichier : `src/app/(dashboard)/anatomie-vanne/page.tsx`. Les vannes du catalogue vivent en base : aucune autre occurrence des anciennes vannes dans `src/` (hors docs de ce lot).

**K01** (audit AN2 / vanne 1, tableau `vanneExamples`, l.62-68). Catégorie « Observation » inchangée.
- Vanne retenue : id `cs14jk4fe660e7238281ce47` (OBSERVATIONNEL) : `Ma grand-mère cuisine toujours pour douze. On est trois.`
- Découpage : **setup** `Ma grand-mère cuisine toujours pour douze.` (6 mots), **pivot**, **punchline** `On est trois.` (3 mots). Setup plus long que la punchline : la règle d'or de la page tient.

| Ligne | Avant | Après |
|---|---|---|
| 63 | `J'ai lancé une séance de sport sur une appli, dans mon salon.` | `Ma grand-mère cuisine toujours pour douze.` |
| 64 | `On attend l'effort, on découvre qui a vraiment remarqué l'abandon` | `L'amour d'une grand-mère se compte en portions, pas en convives` |
| 65 | `Après 4 minutes, elle m'a demandé : “Toujours là ?”` | `On est trois.` |
| 67 | `Setup court et relatable (tout le monde a déjà ouvert une appli de sport pleine de bonnes intentions). Le pivot est invisible : l'appli censée te motiver se met à vérifier que tu n'es pas parti. La punchline tient en 8 mots, et c'est l'appli qui la délivre à ta place : tu n'as même pas besoin d'avouer que tu t'es arrêté.` | `Setup de 6 mots : une grand-mère qui prévoit large, ça parle à beaucoup de familles. Le pivot tient dans le chiffre : « douze » promet une grande tablée, et la punchline la ramène à la réalité sans commentaire. Elle tient en 3 mots, et l'écart dit tout : l'amour d'une grand-mère se compte en portions, pas en convives.` |

- Dépendances : **J05 / AN2 devient caduc** (le pivot l.64 est remplacé, ne pas appliquer « c'est l'appli qui constate l'abandon »). Le compte « 8 mots » de l'analyse devient « 3 mots » (fait ci-dessus ; setup « 6 mots » ajouté). Les guillemets anglais “ ” disparaissent avec la vanne (défaut relevé par le reviewer). Les autres textes de la page (hero, règles d'or, FAQ) ne citent pas l'ancienne vanne. Le bloc (setup, pivot, punchline, analyse) est du texte pédagogique neuf : à repasser en relecture à l'aveugle avec la vanne.

**K04** (audit vanne 4, section « Les 6 types de pivots », `anatomie-vanne/page.tsx:267`)
- Avant : `« Mon chef m'a dit de prendre des initiatives. » → « J'ai pris mon vendredi. »`
- Après : `« Pour Halloween, j'ai proposé à mon date qu'on se déguise en couple. »`
- Vanne retenue : id `cs14jk1bc86d3502a2cef27b` (DATING), texte copié à l'identique. Le double sens porte sur « en couple » : le costume que le contexte Halloween installe, puis le statut que « mon date » révèle (la `desc` du pivot, « tu en installes un, et la chute révèle l'autre », s'applique). Il joue sur le sens et non sur le son, donc cohérent avec l'erreur « jeu de mots forcé » de la page.
- **Réserve honnête** : j'ai relu les 142 vannes actives, aucune n'est un double sens de manuel (un mot polysémique posé puis retourné). Celle-ci est la plus proche. Seconde option, moins bonne : id `cmmnsqn15007dth63p3dzv6pc` (DATING) `Elle m'a demandé ce que je faisais dans la vie.` (« dans la vie » : métier ou existence), mais sans chute visible, et la vanne 7 de la même page contient déjà « ce qu'il faisait dans la vie ». Le champ `desc` (l.266) reste inchangé. À repasser en relecture à l'aveugle sous l'étiquette « Double sens ».

## 7. Signalé, non touché

- `src/components/home/feature-cards.tsx:15` : « École, boulot, couple, soirées » (même énumération avec école, hors page `/vannes`).
- Blog : « 5 à 10 minutes par jour » (`blog-articles.ts:23`, `:93`, test `src/__tests__/lib/pilier-haut-de-page-s15.test.ts:14` qui fige la chaîne) et « 2-3 secondes » de pause ou d'accusé de réception (`blog-articles.ts:155`, `:230`, `:1061`, `:1063`, `:1074`) : même statut de chiffre sans source, à traiter dans la passe articles.
- Tour 3 (Waly Dia) : le fichier `corrections-articles-s20-suite-tour3.md` contient l'ancien « Après » (« qu'il regarde de loin ») : à marquer comme remplacé par le §5 ci-dessus.

## 8. Mesure du diff (P0 s11)

| Item | Changement réel |
|---|---|
| J29, J39 | la liste seule : 5 mots touchés par ligne, le reste intact |
| J32 | 1 mot (« 2-3 » devient « quelques ») |
| J40 | 5 mots remplacés par 5 (« Au bout de 3-4 répétitions » devient « À force de la répéter ») |
| J30, J43 | 3 à 5 mots par ligne, un même groupe de mots |
| J10 | 7 mots sur 20 |
| J20 | environ 5 mots sur 10 de la proposition |
| J41 | 1 phrase sur 9 par rapport au tour 3 (le reste mot pour mot), mais phrase réécrite à 100 % par rapport au code actuel |
| K01 | 4 champs sur 4 de la vanne 1 (remplacement voulu), 0 autre champ de la page |
| K04 | 1 exemple sur 6, `desc` et `name` intacts |

Intouchables vérifiés : slugs, H2, FAQ (questions), liens, prix, « 50 XP », « 2 à 4 semaines », durées de parcours : non modifiés.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/copy/corrections-pages-site-s20-tour2.md`
- Décisions : J29, J39 (5 situations, école retiré) ; J32, J40, J30, J43 (chiffres retirés, une seule formulation « Avec une pratique quotidienne, même courte, ») ; J10 (« D'autres parcours plus poussés sont à venir », la formule « répartie d'abord » du tour 1 est abandonnée car Répartie est déjà en ligne) ; J20 (deux phrases) ; J41 (Waly Dia « nomme frontalement ce qui fait mal », reste du paragraphe inchangé) ; K01 (grand-mère « pour douze », id `cs14jk4fe660e7238281ce47`, analyse et comptes de mots refaits, AN2/J05 caduc) ; K04 (« se déguise en couple », id `cs14jk1bc86d3502a2cef27b`).
- Points d'attention : (1) K04 est le meilleur double sens trouvé parmi les 142 actives mais pas un cas d'école, Thomas peut préférer une autre étiquette ; (2) méta description `/vannes` à environ 159 caractères ; (3) le code bouge pendant l'application du tour 1, utiliser les variantes d'Avant ; (4) tous les « Après » + bloc K01 repassent la relecture à l'aveugle avant mise en ligne ; (5) historique des interventions non mis à jour (aucun fichier d'historique touché dans cette tâche).
---
