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
