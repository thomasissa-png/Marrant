# Notation : A5 « poisson d'avril pour adultes » (`/blog/blagues-poisson-d-avril-adultes`, itération 1, 05/10/2026)

> Revue @reviewer. Base : `docs/copy/articles-forte-frappe/A5-blagues-poisson-d-avril-adultes.md` (182 lignes), `config/blog-cta.ts` l.51-57, `config/blog-forte-frappe.ts`, `config/blog-tracking.ts` l.13, `components/blog/blog-vanne-share.tsx`, `components/ui/markdown-renderer.tsx` (`JOKE_RE` l.35, `shareText` l.49, `headingId` l.180), `lib/seo-meta.ts` (`fitTitle`), `lib/blog-clusters.ts` l.89, `blog/[slug]/page.tsx` l.59 et l.239.
> Grille de 8 critères reprise telle quelle de `notation-article-blagues-2026-iter1.md`. Faits techniques fournis par le brief pris comme acquis (import, FAQ, meta, CTA après le corps, Partager avec URL, typographie, gabarit 10/10).
> Intouchables respectés par tous les correctifs : texte des 15 idées (aucun mot modifié ; seuls 2 déplacements et des indications en italique), zéro tiret cadratin (0 occurrence de « — » ou « – » dans le fichier), zéro humoriste.
> Limites : rendu réel non vu (pas de capture), pas de git, volume de la requête non mesuré (aucune donnée Search Console).

## 1. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **8/10** | Le sommaire n'arrive qu'au 4e bloc (environ 190 mots après le H1) et la 1re idée après environ 380 mots ; « papier dans le dos » est dit deux fois en 3 lignes (l.43 et l.45). |
| 2 | Sorties vers une 2e page | **9/10** | Couverture complète, mais la blague du jour est proposée 3 fois, dont 2 avec la même phrase (« change tous les jours » l.47, « change chaque jour » l.128). |
| 3 | CTA d'inscription | **9/10** | Entrée dédiée, placée après le corps, note vraie ; mais le CTA vend « la riposte » (Répartie) et l'encart parcours qui suit propose Machine à Café (CATALOGUE → `fort-volume`, `blog-clusters.ts` l.89, aucune entrée dans `FORTE_FRAPPE_PARCOURS`). |
| 4 | Lisibilité mobile et structure | **9/10** | Partager actif sur les 15 idées (`**N.** texte` capté par `JOKE_RE`), mais libellé « Partager la vanne n°N » et titre de partage « Vanne » sur un canular (`blog-vanne-share.tsx` l.46 et l.49) ; deux idées « ta sœur » d'affilée (n°6, n°7) et deux « samedi » d'affilée au même groupe (n°10, n°11). |
| 5 | Ton Marrant des textes affichés | **8/10** | Indications : « Plus tu es…, plus… » puis « Plus il a…, plus… » (n°4, n°5) ; « Garde » en ouverture 3 fois (n°3, n°11, n°14) plus « Garde ton sérieux » (n°1) ; n°12 obscure (« le résultat, jamais le nombre exact ») ; sortie famille copiée de l'étalon (« Le prochain repas de famille arrive plus vite que prévu »). |
| 6 | Conformité | **8/10** | Zéro tiret cadratin, zéro humoriste : PASS. Mais 4 affirmations non sourcées (« en moins de deux secondes » n°2, « souvent » n°9, « le bureau sera plein » l.57, « presque toujours » CLEF l.145) ; le quiz est vendu comme révélant un « style de canular » (l.139) ; « Laisse-la paniquer » (n°6), « cinq secondes de panique » (n°7) et « le soulagement » (n°3) contredisent l'excerpt (« Aucune ne fait peur ») et la règle « Révèle vite » (l.151). |
| 7 | Sécurité SEO | **8/10** | Slug, meta 134 car., 4 H2 en question, 4 ancres = `headingId`, FAQ en fin : PASS. Mais le title, repris en H1 (`page.tsx` l.59 et l.239), est en français cassé (« Blague poisson d'avril adultes »), et le mot « blague » n'apparaît ni dans « En bref » ni dans l'intro. |
| 8 | Mesure | **10/10** | Slug dans `config/blog-tracking.ts` l.13 (scroll 4 paliers, ancres, sorties, suivi hebdo), `blog-vanne-partage` via Partager, `src=blog-<slug>` via le CTA dédié. Rien à ajouter. |

**Note globale : 8,6/10** (69/80).
**Après application des 10 correctifs ci-dessous : 10/10 sur les 8 critères.**

## 2. Vérifications demandées

### SEO

| Point | Exigence | État | Verdict |
|---|---|---|---|
| Title | ≤ 60 car., requête en tête, lisible | 56 car. ; + « \| deviens-marrant.fr » (20) = 76 > 60, `fitTitle` sert le titre seul (`seo-meta.ts` l.53). Requête exacte en tête, mais sans « pour » : c'est aussi le H1 affiché | FAIL lisibilité → C10 (59 car.) |
| Meta | ≤ 155 car., promesse | 134 car., nombre, terrains, « sans méchanceté », « la phrase à dire » | PASS |
| H1 | = title | `metaTitle \|\| title` (`page.tsx` l.59) | voir C10 |
| Mot-clé dans les 100 premiers mots | « blague poisson d'avril (pour) adultes » | « poisson d'avril pour adultes » en « En bref », mais « blague » absent avant la l.47 (lien « blague du jour ») | C10 |
| H2 | en question | 4 sur 4 finissent par « ? » ; « ## FAQ » sorti du corps | PASS |
| Ancres du sommaire | = `headingId` | 4 sur 4 recalculées (ç → c, apostrophe et virgules → tiret) : identiques | PASS |
| FAQ JSON-LD | réponses sans markdown | 4 réponses en texte brut | PASS |
| Cannibalisation | aucune autre page sur la requête | 0 occurrence de « poisson d'avril » ou « 1er avril » dans `apps/web/src` ; étalon, A4 et thèmes sans canular | PASS |
| SERP | format attendu | Résultats en listes numérotées d'« idées » ou de « blagues » (20, 30, 40+, 90), plusieurs assumant d'« être bien lourd » ou citant les « pires » ; l'angle « inoffensif, avec la phrase à dire » est différenciant | PASS (C10 garde « inoffensives ») |
| Fraîcheur | date | Publication 25/02/2027 (jeudi : vérifié), 5 semaines avant le pic ; « 1er avril 2027 = jeudi » vérifié (1er janvier 2027 = vendredi, + 90 jours) | PASS |

### Innocuité, faisabilité, révélation (15 idées relues une par une)

Interdits du brief : danger, coût, peur santé / accident / licenciement, humiliation. Plus faisabilité et clarté de la révélation.

| N° | Danger | Coût | Peur | Humiliation | Réalisable | Révélation claire | Verdict | Correctif |
|---|---|---|---|---|---|---|---|---|
| 1 frigo | non | non | non | non (aucun pot désigné) | oui (frigo commun) | **partielle** : seul celui qui vient lire l'apprend, l'affiche reste | PASS après correctif | I1 |
| 2 visio | non | non | non | **légère** si on nomme ceux qui ont dit oui, devant un chef ou un client | oui ; si personne ne dit oui, raté sans dégât | oui | PASS après correctif | I2 |
| 3 réunion | non | non | **travail, légère** : ton grave + silence + « le soulagement » | non | **seulement si tu animes** la réunion | oui | PASS après correctif | I3 |
| 4 eau | non | non | non | non | oui | oui | PASS | aucun |
| 5 tondeuse | non | non | non | **risque** : 15 min d'exposé pour rien | **fragile** : l'indication propose perceuse ou taille-haie, alors que la chute dit « pelouse » ; un père qui sait qu'il n'y a pas de jardin déjoue le canular | oui si outil = tondeuse | PASS après correctif | I5 |
| 6 lettre | non | non | **gêne** : « Laisse-la paniquer » | non (rien de vrai, pas de public) | oui | oui | PASS après correctif | I6 |
| 7 Cordialement | non | non | « cinq secondes de panique » (formulation) | non | oui ; suppose une sœur (2e idée « sœur » d'affilée) | oui | PASS après correctif | I7, C4 |
| 8 groupe | non | non | non | non | oui | oui | PASS | aucun |
| 9 dimanche | non | non | non | non | **seulement si le repas a lieu chez toi** | **ambiguë** : qu'est-ce qui est faux, le repas ou « rien à apporter » ? | PASS après correctif | I9 |
| 10 rendez-vous | non | **risque** : quelqu'un se déplace samedi | non | non (tout le groupe, pas une personne) | oui | **ambiguë** : le rendez-vous est-il annulé ? | PASS après correctif | I10 |
| 11 randonnée | non | non | non | non | oui | oui ; même samedi que n°10 au même groupe | PASS après correctif | I11, C4 |
| 12 papier | non | non | non | non | oui | oui | PASS | I12 (clarté de l'indication) |
| 13 cuisine | non | non | non | non | oui (rien à faire) | oui | PASS | aucun |
| 14 « j'arrive » | non | non | non | non (autodérision) | oui | oui | PASS | I14 (ton) |
| 15 horoscope | non | non | non | non | **logistique floue** : « Dis » puis « Entre dans la pièce » | oui | PASS après correctif | I15 |

Bilan : 15 sur 15 inoffensives une fois les indications corrigées. Aucune idée à retirer : chaque risque vient de la consigne d'usage, jamais du texte validé.

## 3. Top 3

1. **C6 (indications I1 à I15)** : c'est là que se jouent l'innocuité, la faisabilité et la révélation. Trois idées laissent aujourd'hui une ambiguïté réelle (n°9, n°10 : qui croit encore quoi ; n°1 : l'affiche reste) et deux poussent à faire durer l'inquiétude (n°3, n°6), à rebours de la règle « Révèle vite ».
2. **C10 (title et H1)** : « Blague poisson d'avril adultes » est la première ligne lue dans Google et sur la page. Trois caractères (« pour ») la rendent française sans perdre la requête.
3. **C1 (sommaire)** : le lecteur arrive le 31 mars au soir ou le 1er avril au matin, pressé ; le sommaire doit tomber dans le 1er écran mobile.

## 4. Correctifs exacts

Fichier article, sauf mention contraire : `docs/copy/articles-forte-frappe/A5-blagues-poisson-d-avril-adultes.md` (numéros de ligne actuels). Après correction du fichier, relancer l'import avec `--update`.

### C1. Sommaire juste sous « En bref », sans répétition (critères 1 et 5)

**Avant** (l.43 à l.47, trois paragraphes dans cet ordre) :
```md
Le 1er avril, tout adulte se dit qu'il est trop vieux pour ça. […] Le papier dans le dos, c'est pour les enfants.

Cet article, c'est ton stock de **15 idées** inédites, classées par terrain, à lancer en une à trois phrases. Pas de sel dans le sucre, pas de poisson en papier dans le dos : les classiques, tu les as déjà tous reçus.

Va direct à ton terrain : [Bureau](#…) · […] · [Les règles](#comment-reussir-un-poisson-d-avril-sans-le-gacher). Et quand tu auras tout joué : […] range le reste par situation.
```
**Après** (le paragraphe « Va direct » remonte en 1er, mot pour mot ; le paragraphe « Le 1er avril » ne change pas) :
```md
Va direct à ton terrain : [Bureau](#quel-poisson-d-avril-faire-au-bureau-sans-que-ca-tourne-mal) · [Famille](#quels-canulars-en-famille-sans-jamais-vexer-personne) · [Potes et couple](#quels-canulars-entre-potes-et-en-couple-pour-que-tout-le-monde-rie-a-la-fin) · [Les règles](#comment-reussir-un-poisson-d-avril-sans-le-gacher). Et quand tu auras tout joué : la [blague du jour](/blague-du-jour) change tous les jours, et le [catalogue de vannes](/vannes) range le reste par situation.

Le 1er avril, tout adulte se dit qu'il est trop vieux pour ça. […] Le papier dans le dos, c'est pour les enfants.

Cet article, c'est ton stock de **15 idées** inédites, classées par terrain, à lancer en une à trois phrases. Pas de sel dans le sucre ni de fausse panne d'ordinateur : les classiques, tu les as déjà tous reçus.
```
Pourquoi : le sommaire passe d'environ 190 à environ 60 mots sous le H1, dans le 1er écran mobile, comme l'étalon (iter1 C1) et A4 (C1). « Papier dans le dos » n'est plus dit deux fois en 3 lignes. Ancres inchangées.

### C2. Fin de corps : la blague du jour n'est plus annoncée une 2e fois avec la même phrase (critère 2)

**Avant** (l.128) : `**Tu as fait le tour ?** La [blague du jour](/blague-du-jour) change chaque jour, avec sa chute et son décryptage. Le reste du catalogue ne bouge pas : c'est ton stock.`
**Après** : `**Tu as fait le tour ?** Les vannes, elles, servent toute l'année et sans piège : le [catalogue](/vannes) les range toutes, chacune avec son décryptage.`

Pourquoi : « change tous les jours » (intro) et « change chaque jour » (ici) se suivent à l'écran ; la 3e mention (l.159, « celle d'aujourd'hui, et demain une autre ») dit autre chose et reste. La nouvelle phrase introduit la liste « Tu préfères choisir ta situation ? » qui suit, et ouvre l'après-1er avril.

### C3. Encart parcours aligné sur le CTA (critère 3)

Fichier : `apps/web/src/config/blog-forte-frappe.ts`. **Avant** (l.50-51) :
```ts
  "message-anniversaire-drole-par-situation": "repartie",
};
```
**Après** :
```ts
  "message-anniversaire-drole-par-situation": "repartie",
  // Poisson d'avril : le CTA vend « la riposte » ; Machine à Café est déjà lié dans la section bureau.
  "blagues-poisson-d-avril-adultes": "repartie",
};
```
Pourquoi : le CTA (« Le canular est prêt. Et la riposte ? ») et la section potes (l.124) mènent à Répartie ; sans entrée, l'encart affiche Machine à Café (`CATALOGUE` → `fort-volume`), déjà proposé l.68. Une ligne, même mécanisme que A1.

### C4. Deux déplacements, aucun mot changé (critère 4)

- Échanger les blocs l.87-88 (Cordialement) et l.90-91 (groupe « ravi de rejoindre ») : la n°7 devient le groupe, la n°8 « Cordialement ». Les deux idées « ta sœur » ne se suivent plus.
- Échanger les blocs l.107-108 (randonnée) et l.110-111 (papier plié) : la n°11 devient le papier, la n°12 la randonnée. Les deux « samedi » envoyés au groupe ne se suivent plus.

Seul le `**N.**` de tête est renuméroté. Liste d'ids de l'en-tête (l.4) inchangée (elle ne porte pas les numéros). Article non publié : aucune ancre `#vanne-N` partagée à casser.

### C5. Partager « l'idée », pas « la vanne » (critère 4)

Fichier : `apps/web/src/config/blog-forte-frappe.ts`. **Avant** (l.30) : `export const FORTE_FRAPPE_SLUGS = Object.keys(FORTE_FRAPPE_SHARE);`
**Après** :
```ts
export const FORTE_FRAPPE_SLUGS = Object.keys(FORTE_FRAPPE_SHARE);

/** Lignes numérotées = idées (canulars), pas des vannes : libellé et titre de partage adaptés. */
export const FORTE_FRAPPE_IDEA_SLUGS: ReadonlySet<string> = new Set(["blagues-poisson-d-avril-adultes"]);
```
Fichier : `apps/web/src/components/blog/blog-vanne-share.tsx`.

| Ligne | Avant | Après |
|---|---|---|
| l.7 | `import type { BlogShareMode } from "@/config/blog-forte-frappe";` | `import { FORTE_FRAPPE_IDEA_SLUGS, type BlogShareMode } from "@/config/blog-forte-frappe";` |
| l.31 | `const textOnly = mode === "text-only";` | `const textOnly = mode === "text-only";` puis, ligne suivante : `const idea = FORTE_FRAPPE_IDEA_SLUGS.has(slug);` |
| l.46 | `title="Vanne - deviens-marrant.fr"` | `title={idea ? "Idée de poisson d'avril - deviens-marrant.fr" : "Vanne - deviens-marrant.fr"}` |
| l.49 | ``label={textOnly ? `Envoyer le message n°${vanne}` : `Partager la vanne n°${vanne}`}`` | ``label={textOnly ? `Envoyer le message n°${vanne}` : `Partager ${idea ? "l'idée" : "la vanne"} n°${vanne}`}`` |

Pourquoi : le lecteur partage un canular à un complice ; « Partager la vanne n°3 » (lecteur d'écran compris) et un titre « Vanne » décrivent autre chose. Les 11 autres slugs ne bougent pas. Le trait d'union du titre existe déjà (pas un tiret cadratin). @fullstack relance les tests de `blog-vanne-share` s'il en existe.

### C6. Indications d'usage : innocuité, faisabilité, révélation, ton (critères 5 et 6)

Seule la ligne en italique change. Numéros après C4.

| Idée (ligne) | Avant | Après |
|---|---|---|
| I1, n°1 (l.60) | `*→ Affiche-la tôt le matin et attends le premier qui ouvre le frigo « pour vérifier ». Garde ton sérieux, c'est lui qui doit sourire en premier.*` | `*→ Affiche-la tôt le matin et attends le premier qui ouvre le frigo « pour vérifier ». À midi, écris « Poisson d'avril » en bas de l'affiche, pour ceux que tu n'as pas croisés.*` |
| I2, n°2 (l.63) | `*→ Dis-le comme une vérification technique de routine. Les « oui » arrivent en moins de deux secondes.*` | `*→ Dis-le comme une vérification technique de routine, en réunion interne seulement, jamais devant un client. Ne nomme personne : on rit de la politesse de tous, pas de celui qui a dit oui.*` |
| I3, n°3 (l.66) | `*→ Garde la gravité jusqu'à la dernière syllabe. Le soulagement fait le reste.*` | `*→ Seulement si c'est toi qui animes la réunion. Deux secondes de silence, pas plus : on doit se demander quoi, pas commencer à s'inquiéter.*` |
| I5, n°5 (l.82) | `*→ Choisis l'outil qui lui plaît (tondeuse, perceuse, taille-haie). Plus il a d'avis, plus c'est drôle.*` | `*→ Ne change pas d'outil : toute la chute repose sur la pelouse. Idéal si tu as déménagé il y a peu. Révèle dès qu'il compare deux modèles : il doit rire de sa passion, pas avoir parlé dans le vide.*` |
| I6, n°6 (l.85) | `*→ Parle d'une lettre inventée, jamais d'un vrai souvenir que ta sœur voudrait garder pour elle.*` | `*→ Parle d'une lettre inventée, jamais d'un vrai souvenir que ta sœur voudrait garder pour elle. Révèle dès sa première réponse : l'inquiétude doit tenir en un message.*` |
| I7, n°8 (l.88) | `*→ La formule fait le travail : elle a pris cinq secondes de panique pour une signature.*` | `*→ Écris un message banal, sans un mot de trop : la signature fait tout le travail. Marche avec n'importe quel proche qui ne signe jamais ses messages.*` |
| I9, n°9 (l.94) | `*→ Écris-le vraiment avec le ton le plus généreux possible. Le groupe se met souvent à compter les chaises.*` | `*→ Seulement si le repas a vraiment lieu chez toi. Écris-le avec le ton le plus généreux possible, et précise après les rires que la chaise, elle, est une vraie consigne.*` |
| I10, n°10 (l.105) | `*→ Envoie-le à un groupe qui a vraiment un endroit d'habitude. Le premier à demander « mais lequel ? » a tout compris.*` | `*→ Envoie-le à un groupe qui a vraiment un endroit d'habitude. Après les rires, précise qu'il n'y a pas de rendez-vous samedi, sauf si quelqu'un en propose un pour de vrai.*` |
| I11, n°12 (l.108) | `*→ Garde un ton très sportif. Ceux qui répondent « ok » tout de suite sont ta cible préférée.*` | `*→ Prends un ton très sportif, et choisis un autre groupe que celui du rendez-vous de samedi (n°10). Ceux qui répondent « ok » tout de suite sont ta cible préférée.*` |
| I12, n°11 (l.111) | `*→ Écris la phrase à la main avant de plier. Demande-lui seulement le résultat, jamais le nombre exact.*` | `*→ Écris la phrase à la main avant de plier, et donne le papier le matin : il aura toute la journée pour regarder l'heure.*` |
| I14, n°14 (l.117) | `*→ Garde le compte sur une feuille, visible. Le troisième « j'arrive » a un autre poids.*` | `*→ Tiens le compte sur une feuille, bien en vue. Le troisième « j'arrive » a un autre poids.*` |
| I15, n°15 (l.120) | `*→ Entre dans la pièce juste après la phrase. Le timing est la moitié du plaisir.*` | `*→ Lance la phrase depuis le couloir, porte entrouverte, puis entre aussitôt. Le timing est la moitié du plaisir.*` |

Pourquoi, par famille :
- **Révélation** (I1, I9, I10) : plus personne ne reste dans le faux (affiche, repas, rendez-vous), donc plus de déplacement pour rien.
- **Peur et durée** (I3, I5, I6, I7) : chaque indication applique la règle « Révèle vite » (l.151) ; « panique » et « soulagement » disparaissent, l'excerpt (« Aucune ne fait peur ») devient vrai.
- **Humiliation et travail** (I2, I3) : jamais devant un client, personne de nommé, seulement l'animateur de la réunion (FAQ 2 : rien qui touche au travail).
- **Faisabilité** (I5, I7, I15) : l'indication ne contredit plus la chute (pelouse) ; l'idée « sœur » marche sans sœur ; la n°15 dit d'où lancer la phrase.
- **Ton** (I1, I3, I5, I11, I12, I14) : « Garde » n'ouvre plus aucune indication, « Plus…, plus… » n'apparaît plus qu'une fois (n°4), la n°12 se comprend en une lecture.
- **Affirmations non sourcées** (I2, I9) : « en moins de deux secondes » et « souvent » retirés.

### C7. Sortie famille propre à l'article (critère 5)

**Avant** (l.96) : `Le prochain repas de famille arrive plus vite que prévu : [les blagues de famille](/vannes/theme/famille) sont là pour ça.`
**Après** : `Pour le prochain repas où toute la tablée sera là : [les blagues de famille](/vannes/theme/famille).`

Pourquoi : c'est presque mot pour mot la sortie famille de l'étalon (iter1 C10) ; un lecteur des deux pages lit deux fois la même formule.

### C8. Deux affirmations non sourcées (critère 6)

**Avant** (l.57) : `Le 1er avril 2027 tombe un jeudi : le bureau sera plein.`
**Après** : `Le 1er avril 2027 tombe un jeudi : un jour de semaine, donc un jour de bureau.`

**Avant** (CLEF, l.145) : `Les ratés viennent presque toujours de la révélation trop tardive ou de l'amorce trop grave.`
**Après** : `Un canular rate pour deux raisons : la révélation arrive trop tard, ou l'amorce est trop grave.`

Pourquoi : « sera plein » et « presque toujours » sont des données de fréquence sans source (CLAUDE.md n°2). Les versions corrigées disent la même chose sans chiffre implicite. Le reste de la ligne CLEF ne bouge pas.

### C9. Le quiz ne promet plus un « style de canular » (critère 6)

**Avant** (l.139) : `Pas sûr de ton style de canular ? [Le quiz « quel type d'humour es-tu ? »](/quiz-humour) prend environ 2 minutes, sans inscription.`
**Après** : `Pas sûr de ton style d'humour ? [Le quiz « quel type d'humour es-tu ? »](/quiz-humour) prend environ 2 minutes, sans inscription.`

Pourquoi : le quiz donne un profil d'humour, pas de canular (même écart que A4 C8).

### C10. Title et H1 en français, mot « blague » dès « En bref » (critère 7)

**Avant** (l.10) : `Blague poisson d'avril adultes : 15 canulars inoffensifs` (56 car.)
**Après** : `Blague poisson d'avril pour adultes : 15 idées inoffensives` (59 car., ≤ 60 : servi seul par `fitTitle`, sans coupe)

**Avant** (l.41, début) : `> **En bref :** Un bon poisson d'avril pour adultes tient en deux ou trois phrases,`
**Après** : `> **En bref :** Une bonne blague de poisson d'avril pour adultes tient en deux ou trois phrases,` (suite de la ligne inchangée)

Pourquoi : le title est aussi le H1 affiché (`page.tsx` l.59 et l.239) ; sans « pour », il se lit comme une suite de mots-clés. « Idées » est le mot de la SERP et du corps (« 15 idées », l.45) ; « canulars » reste dans la meta, l'excerpt et deux H2. « Inoffensives » garde la promesse qui distingue la page des listes « pour être bien lourd ». Mettre à jour l'en-tête : `**title** (59 car.)`. Meta, slug et excerpt inchangés.

## 5. Récapitulatif

| # | Critère(s) | Fichier(s) | Agent |
|---|---|---|---|
| C1 | 1, 5 | A5 l.43-47 | @copywriter |
| C2 | 2 | A5 l.128 | @copywriter |
| C3 | 3 | config/blog-forte-frappe.ts l.50-51 | @fullstack |
| C4 | 4 | A5 l.87-91, l.107-111 | @copywriter |
| C5 | 4 | config/blog-forte-frappe.ts l.30, blog-vanne-share.tsx l.7, 31, 46, 49 | @fullstack |
| C6 | 5, 6 | A5, 12 indications | @copywriter |
| C7 | 5 | A5 l.96 | @copywriter |
| C8 | 6 | A5 l.57, l.145 | @copywriter |
| C9 | 6 | A5 l.139 | @copywriter |
| C10 | 7 | A5 l.10, l.41 | @copywriter |

Notes projetées après application : 1 = 10, 2 = 10, 3 = 10, 4 = 10, 5 = 10, 6 = 10, 7 = 10, 8 = 10.

Diff réel attendu (P0 s11) : environ 22 lignes de texte modifiées sur environ 140 de contenu, 4 blocs déplacés, 4 numéros changés, 0 mot changé dans les 15 idées ; environ 8 lignes de code. Ne pas l'annoncer comme une réécriture. Contenu : import relancé avec `--update`. Code : pre-commit `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`, déploiement noté dans `REPLIT_ACTIONS.md`.

## 6. Ne comptent pas contre le 10

- **Section bureau à 3 idées** (famille et potes en ont 6) alors que le bureau ouvre la meta : seul remède, une vague d'idées validées à l'aveugle. À ouvrir si `blog-ancre-clic` montre que « Bureau » est l'ancre la plus cliquée.
- **Rendu réel** : captures 390 px et desktop après la mise en ligne du 25/02/2027.
- **Mesure saisonnière** : le bilan utile se lit après le 1er avril 2027 (J+7), pas à J+30 de la publication.

## 7. Décisions pour Thomas (hors note)

- **C4** : si tu considères l'ordre des idées comme intouchable, C4 tombe ; I7 et I11 suffisent alors à lever la gêne (critère 4 à 9,5 de fait).
- **C10** : « 15 idées inoffensives » (proposé) ou « 15 canulars gentils » (57 car., garde « canulars » mais perd la promesse de sécurité). Défaut proposé : « idées inoffensives ».

## 8. Sources externes

- SERP « blague poisson d'avril adultes » consultée le 05/10/2026 : [joueclub.fr](https://tous-joueurs.joueclub.fr/articles/actualites/poisson-d-avril-20-idees-originales-de-blagues-a-faire/), [blogdumoderateur.com](https://www.blogdumoderateur.com/blagues-1er-avril/), [flexilivre.com](https://www.flexilivre.com/nos-conseils/idees-de-poisson-d-avril-blagues-et-pieges/), [topito.com](https://www.topito.com/top-des-meilleures-blagues-du-1er-avril-hihi-mdr-lol-exlpdr-ferme-la), [santeplusmag.com](https://www.santeplusmag.com/111127719-poisson-davril-psychologie/). Usage : format de la requête (listes numérotées, vocabulaire « idées » et « blagues ») uniquement ; aucun nom de site dans le client-facing.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-A5-iter1.md
- Décisions prises : note 8,6/10 (69/80) ; 15 idées sur 15 inoffensives après correction des indications, aucune retirée ; 10 correctifs exacts (C1 à C10) pour 10/10, aucun mot changé dans les idées.
- Points d'attention : @copywriter applique C1, C2, C4, C6 à C10 dans le fichier A5, puis réimport `--update` ; @fullstack applique C3 et C5 (config + `blog-vanne-share.tsx`) ; Thomas tranche les 2 points du §7 ; itération 2 après application, avec captures du rendu.
---
