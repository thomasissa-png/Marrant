# Notation : B2 « blagues de gamer » (`/blog/blagues-de-gamer-jeux-video`, itération 1, 05/10/2026)

> Revue @reviewer. Base : `docs/copy/articles-forte-frappe/B2-blagues-de-gamer.md` (210 lignes, 24 vannes), `config/blog-cta.ts` l.58-64, `config/blog-forte-frappe.ts` l.23, `config/blog-tracking.ts` l.16, `lib/vannes-themes.ts` l.77-87, `app/(dashboard)/vannes/theme/[slug]/page.tsx`, `components/ui/markdown-renderer.tsx` (`headingId` l.180-192), `docs/copy/catalogue-vannes-valides.md` l.109-114, l.146.
> Grille de 8 critères reprise telle quelle de `notation-article-blagues-2026-iter1.md` ; même méthode que `notation-A4-iter1.md`.
> Acquis (non re-vérifiés) : import en base programmé et corrigeable par `--update`, FAQ convertie en `faqs` + JSON-LD, meta = `metaDescription`, CTA après le corps, Partager avec URL, « » imbriqués rendus en “…”, `frTypo`, mots composés protégés, gabarit commun 10/10.
> Intouchables respectés par tous les correctifs : texte des 24 vannes (0 mot modifié, 0 vanne retirée), zéro tiret cadratin (0 occurrence de « — » ou « – » dans l'article), zéro humoriste, zéro marque, jeu ou console.
> Limites : rendu réel non vu (publication le 26/11) ; volume de la requête inconnu (aucune donnée Search Console fournie) ; nombre de vannes de la page thème lu dans `catalogue-vannes-valides.md` (généré depuis la base le 01/10), `[à confirmer en base]`.

## 1. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **10/10** | « En bref » avec « 24 blagues de gamer », puis le sommaire en 2e bloc (6 ancres) : c'est l'ordre corrigé de A4 (C1), la vanne n°1 arrive dans le même délai que sur l'étalon. |
| 2 | Sorties vers une 2e page | **9/10** | Couverture complète (intro, 5 fins de section, 3 liens de règles, fin) ; mais la sortie l.73 promet « d'autres lignes de gamer » vers une page thème qui en compte 4, dont 3 sont déjà dans l'article et la 4e a été écartée par B2 lui-même (chute sur l'apparence, l.6). |
| 3 | CTA d'inscription | **10/10** | Entrée dédiée présente (`blog-cta.ts` l.59-64), identique au fichier ; promesse = [CHOIX UTILISATEUR] du 04/10 ; note vraie (aucun contenu réservé). |
| 4 | Lisibilité mobile et structure | **10/10** | Partager avec URL actif (`blog-forte-frappe.ts` l.23), guillemets imbriqués gérés par le rendu, aucun doublon strict de mécanisme (§2), sections annoncées dans les H2 = vannes présentes dans l'ordre. |
| 5 | Ton Marrant des textes affichés | **8/10** | Indications d'usage répétées : « après une série de défaites » (n°5, n°10, n°14), « Le rire tombe sur toi » (n°9, n°10), « Laisse la dernière phrase seule, sans sourire » (n°16, n°18), « dernière phrase » 5 fois, « reconnaissance » (n°10, n°22), « le ton de quelqu'un qui » (n°19, n°20), « Une phrase, un silence » (n°17, règle 3) ; l'italique n°23 (« résolution sincère ») vend la chute « je suis sincère » ; « En bref » et « Le test » disent la même phrase à 4 lignes d'écart (défaut corrigé sur A4 par C1) ; « tu peux t'en charger toi » (l.102). |
| 6 | Conformité | **9/10** | Zéro tiret cadratin, humoriste, marque, jeu ou console ; « 20 minutes par semaine » conforme. Mais le quiz est vendu comme révélant « le type d'humour de ta team » alors qu'il donne un profil individuel (l.187, même défaut que A4 C8), et la FAQ 1 interdit « la disponibilité d'un équipier précis » (l.197) alors que la n°11 rit d'un pote parti « deux minutes ». |
| 7 | Sécurité SEO | **8/10** | Title 54 car., meta 149 car., 6 H2 en question, 6 ancres = `headingId`, FAQ sans markdown : PASS. Mais `/vannes/theme/gaming` vise la même requête (title « Blagues de gamer et de jeux vidéo », H1 « Blagues de gamer : … », `vannes-themes.ts` l.81-84) et l'article lui envoie l'ancre exacte « les blagues de gamer » (l.73). |
| 8 | Mesure | **10/10** | Slug dans `blog-tracking.ts` l.16 (scroll, ancres, sorties, `src=blog-<slug>`, suivi hebdo) ; `blog-vanne-partage` part avec le bouton Partager ; CTA dédié attribuable. |

**Note globale : 9,25/10** (74/80).
**Après application des 8 correctifs ci-dessous : 10/10 sur les 8 critères.**

## 2. Vérifications demandées

### SEO

| Point | Exigence | État | Verdict |
|---|---|---|---|
| Slug | requête en tête | `blagues-de-gamer-jeux-video` (requête + secondaire) | PASS |
| Title | ≤ 60 car., requête + nombre | « Blagues de gamer : 24 vannes pour ta team et tes nuits », 54 car., requête en tête, nombre comme l'étalon | PASS |
| Meta | ≤ 155 car. | 149 car. (150 au recomptage manuel), « blagues de gamer » et « jeux vidéo » présents | PASS |
| H2 | en question | 6 H2 sur 6 contiennent leur question ; « ## FAQ » extrait par `splitTrailingFaq` | PASS |
| Ancres du sommaire | = `headingId` | 6/6 recalculées (NFD, `[^a-z0-9]+` → « - ») : identiques | PASS |
| FAQ JSON-LD | réponses sans markdown | 4 réponses en texte brut (guillemets et parenthèses seulement) | PASS |
| Liens internes | cibles existantes | 15 cibles ; `comment-raconter-une-blague-sans-la-rater` existe (`blog-clusters.ts` l.31, `blog-article-rewrites.json`), `autoderision-interactions` (l.375) et `timing-humour` (l.225) dans `blog-articles.ts` | PASS (le point (1) du handoff B2, l.8, compare deux slugs identiques : note interne à nettoyer, non importée) |
| SERP | format attendu | Résultats = catalogues « geek » et calembours courts, sans tri par situation ni mode d'emploi : l'angle de B2 est différenciant | PASS |
| Cannibalisation | une URL par requête | Voir ci-dessous | **FAIL** → C2, C8 |

### Cannibalisation

| Page | Recouvrement | Verdict |
|---|---|---|
| `/vannes/theme/gaming` | Title « Blagues de gamer et de jeux vidéo » = mot-clé principal + secondaire de B2 ; H1 « Blagues de gamer : la partie du soir qui finit à l'aube » = section Nuit blanche ; B2 lui envoie l'ancre exacte (l.73). La page affiche 4 vannes (catalogue l.111-114), 3 sont reprises dans B2 : B2 est la page la plus riche sur la requête. Sa meta et son intro annoncent « les lags », « le juste une dernière », « le coéquipier qui joue en solo » : aucune des 4 vannes n'en parle (description fausse depuis la bascule s14) | **FAIL** → C2, C8 |
| Étalon `meilleures-blagues-droles-2026` | Aucune vanne de gamer (seulement le lien Gaming l.1552) ; aucune ligne commune | PASS |
| A4 couple | Aucune ligne de couple dans B2 | PASS |
| S4 (IA, assistants vocaux) | Ni « IA » ni « assistant » dans B2 | PASS |

### Variété des ressorts (24 vannes relues une par une)

12 ressorts distincts : attachement absurde (n°1), escalade administrative (n°2), superstition (n°3), ambition contre résultat (n°4), identités multipliées (n°5), transfert (n°6), inversion des rôles (n°7), ironie de proportion (n°8, n°13), méprise (n°9), gradation (n°10, n°11), excuse impossible (n°12), recadrage (n°14), double sens (n°15), doute moral (n°16), comparaison (n°17), inversion des niveaux (n°18), omission (n°19), prise de conscience (n°20), malentendu (n°21), signal (n°22), auto-contradiction (n°23), confusion jeu et réel (n°24).

| Paire | Mécanisme commun | Verdict | Décision |
|---|---|---|---|
| n°4 / n°13 | L'achat pour mieux jouer ne produit qu'un échec mieux présenté | Voisin : n°4, l'achat cause la panne ; n°13, il ne change rien au score | Garder |
| n°2 / n°5 / n°6 | Pseudo | Thème commun, mécanismes différents (escalade, fuite, transfert) | Garder |
| n°9 / n°10 | Reconnaissance de l'équipe | Méprise contre gradation | Garder |
| n°16 / n°17 | Le père face au jeu | Doute moral contre comparaison (H14-3 déjà en réserve) | Garder |
| n°20 / n°21 | Le voisin entend la partie | Prise de conscience contre malentendu (H16-4 déjà en réserve) | Garder |
| n°15 / n°24 | Le jeu déborde sur la vie | Absence en réunion contre confusion sonore | Garder |

Aucune paire au même mécanisme strict : PASS. Collision hors article signalée au §6 (n°20 et une vanne Soirées).

### Noms de jeu, console, marque

Grep sur le fichier (noms de plateformes, consoles, jeux, messageries, « Wi-Fi ») : 0 occurrence dans le contenu. « box », « 4K », « Go », « jeu de bonbons », « jeu de rôle » : génériques. PASS.

## 3. Top 3

1. **C2 + C8 (cannibalisation avec `/vannes/theme/gaming`)** : deux URL du site sur la requête exacte, la page thème la plus pauvre (4 vannes) reçoit l'ancre exacte de la plus riche (24). Même décision que A4 C9 (encore non appliquée : `vannes-themes.ts` l.37-40 inchangé), à trancher ensemble avant le 26/11.
2. **C3 + C4 (indications d'usage)** : 10 italiques sur 24 répètent une formule ou vendent la chute ; c'est la partie que le lecteur lit à chaque vanne.
3. **C6 + C7 (quiz et FAQ 1)** : une promesse fausse et une règle contredite par la n°11 dans le client-facing, une ligne chacune.

## 4. Correctifs exacts

Fichier article, sauf mention contraire : `docs/copy/articles-forte-frappe/B2-blagues-de-gamer.md` (numéros de ligne actuels). Aucun numéro de vanne ne change. Application en base : `--update` après correction.

### C1. « Le test » ne répète plus l'« En bref » (critère 5)

**Avant** (l.47) : `> **Le test :** Une blague de gamer passe si ta team pourrait la dire à ta place et si quelqu'un qui ne joue jamais en comprend la chute. Elle tombe sur toi ou sur la situation, jamais sur le niveau d'un coéquipier.`
**Après** : `> **Le test :** Une blague de gamer passe si ta team pourrait la dire à ta place et si quelqu'un qui ne joue jamais en comprend la chute.`

Pourquoi : « le rire tombe sur toi ou sur la situation, jamais sur le niveau d'un coéquipier » est déjà la dernière phrase de l'« En bref » (l.41), 4 lignes plus haut. Même correction que A4 C1.

### C2. Sortie Gaming : une promesse vraie, sans l'ancre exacte (critères 2 et 7)

**Avant** (l.73) : `Pour d'autres lignes de gamer, avec leur chute et leur décryptage : [les blagues de gamer](/vannes/theme/gaming).`
**Après** : `Les vannes n°1 et n°4 viennent du [thème gaming du catalogue](/vannes/theme/gaming), où chacune a sa propre fiche.`

Pourquoi : la page thème compte 4 vannes, dont les n°1, n°4 et n°18 de l'article ; la seule autre est la ligne que B2 a écartée (l.6). La nouvelle phrase est vraie (chaque vanne de la liste mène à `/vannes/<slug>`, `page.tsx` l.82) et ne donne plus l'ancre « les blagues de gamer » à la page concurrente.

### C3. Indications d'usage, sections En ligne et Vocal (critère 5)

Seule la ligne en italique change.

| Vanne (ligne) | Avant | Après |
|---|---|---|
| n°1 (l.56) | `… qui garde un souvenir. Ne commente pas la dernière phrase.*` | `… qui garde un souvenir. Appuie à peine sur « ensemble ».*` |
| n°5 (l.68) | `*→ À dire à la team après une série de défaites, sans sourire. Laisse le chiffre faire le travail.*` | `*→ À dire à la team en créant ton nouveau pseudo. Laisse le chiffre faire le travail.*` |
| n°6 (l.71) | `… avec la gravité d'un avocat. La dernière phrase se dit seule.*` | `… avec la gravité d'un avocat. Garde « Il n'a rien fait » pour après un silence.*` |
| n°9 (l.88) | `*→ À dire en vocal sur un ton de constat, sans viser un équipier précis. Le rire tombe sur toi.*` | `*→ À dire en vocal quand la team se remercie après une manche, sur un ton de constat. « C'était pour quelqu'un d'autre » se dit plus bas.*` |

### C4. Indications d'usage, sections Défaite, Entourage et Nuit blanche (critère 5)

| Vanne (ligne) | Avant | Après |
|---|---|---|
| n°14 (l.111) | `*→ À dire après une série de défaites, sans attendre que quelqu'un d'autre le dise. Ton de bilan trimestriel.*` | `*→ À dire en regardant ton classement, avant que quelqu'un d'autre le remarque. Ton de bilan trimestriel.*` |
| n°16 (l.125) | `… sur un ton hésitant. Laisse la dernière phrase seule, sans sourire.*` | `… sur un ton hésitant. Marque un temps avant « Je n'en étais plus sûr ».*` |
| n°17 (l.128) | `*→ À dire en tendant une manette à quelqu'un qui ne joue jamais, ou à raconter après. Une phrase, un silence.*` | `*→ À dire en tendant une manette à quelqu'un qui ne joue jamais, ou à raconter après, les mains en coupe.*` |
| n°20 (l.137) | `*→ À raconter le lendemain, avec le ton de quelqu'un qui vient de comprendre. Dis « c'était donc moi » à plat.*` | `*→ À raconter le lendemain, comme une enquête enfin résolue. Dis « c'était donc moi » à plat.*` |
| n°22 (l.143) | `… ou à raconter à la team, avec de la reconnaissance. Le thé est la chute : ne la souligne pas.*` | `… ou à raconter à la team, sur un ton complice. Le thé est la chute : ne la souligne pas.*` |
| n°23 (l.154) | `*→ À envoyer à la team en début de soirée, ou à dire au moment de te dire « j'arrête », sur le ton d'une résolution sincère.*` | `*→ À envoyer à la team en début de soirée, avant la première partie. Elle se relit toute seule vers minuit.*` |

Pourquoi (C3 + C4) : après correction, chaque formule n'apparaît qu'une fois : « série de défaites » (n°10), « Le rire tombe sur toi » (n°10), « reconnaissance » (n°10), « dernière phrase » (n°3, n°18, éloignées), « sans sourire » (n°2, n°18), « le ton de quelqu'un qui » (n°19), « Une phrase, un silence » (règle 3). La n°23 ne souffle plus sa chute (« sincère ») et la n°17 gagne un geste au lieu d'une consigne générique. Les 14 autres italiques, relus un par un, sont propres à leur vanne.

### C5. Intro Défaite : une phrase au lieu de deux (critère 5)

**Avant** (l.102) : `La défaite est le moment où un gamer devient le plus drôle, à condition de rire le premier. Avant que les autres s'en chargent, tu peux t'en charger toi. Les lignes ci-dessous …`
**Après** : `La défaite est le moment où un gamer devient le plus drôle, à condition de rire le premier, avant que les autres s'en chargent. Les lignes ci-dessous …`

Pourquoi : la 2e phrase redit la 1re, avec un « toi » final bancal à l'oral.

### C6. Le quiz ne promet plus un profil d'équipe (critère 6)

**Avant** (l.187) : `Pas sûr du type d'humour de ta team ? [Le quiz « quel type d'humour es-tu ? »](/quiz-humour) prend environ 2 minutes, sans inscription.`
**Après** : `Pas sûr de ton style d'humour ? [Le quiz « quel type d'humour es-tu ? »](/quiz-humour) prend environ 2 minutes, sans inscription. Envoie-le à ta team, puis comparez.`

Pourquoi : le quiz donne un profil individuel (« es-tu »). Même correction que A4 C8.

### C7. FAQ 1 alignée sur la n°11 et sur la règle 4 (critère 6)

**Avant** (l.197) : `Évite le niveau de jeu, le pseudo, la voix ou la disponibilité d'un équipier précis.`
**Après** : `Évite le niveau de jeu, le pseudo ou la voix d'un équipier précis.`

Pourquoi : la n°11 (« Mon pote a dit « je vais chercher à boire, deux minutes » ») rit précisément de la disponibilité d'un pote ; la règle 4 (l.173) cite score, pseudo et voix, pas la disponibilité. Réponse toujours sans markdown.

### C8. Page thème Gaming : requête « vannes », description vraie (critère 7)

Fichier : `apps/web/src/lib/vannes-themes.ts`. **Avant** (l.81-86) :
```ts
    title: "Blagues de gamer et de jeux vidéo",
    description:
      "Des blagues de gamer sur les lags, les parties du soir et le « juste une dernière ». Chaque vanne a sa chute et son décryptage.",
    h1: "Blagues de gamer : la partie du soir qui finit à l'aube",
    intro:
      "Le « juste une dernière partie » qui finit à l'aube, le lag qui frappe au pire moment, le coéquipier qui joue en solo : les gamers ont leur propre folklore. Ces vannes en font des chutes, chacune avec son décryptage. Envoie-en une à ta team.",
```
**Après** :
```ts
    title: "Vannes de gamer et de jeux vidéo",
    description:
      "Des vannes de gamer sur le téléchargement interminable, les mods qui cassent tout et la grand-mère mieux classée que toi. Chaque vanne a sa chute et son décryptage.",
    h1: "Vannes de gamer : le jeu, et tout ce qu'il y a autour",
    intro:
      "Le téléchargement qui n'en finit pas, les mods qui cassent tout, la famille qui joue aussi : les gamers ont leur propre folklore. Ces vannes en font des chutes, chacune avec son décryptage. Envoie-en une à ta team.",
```
Pourquoi : B2 (24 vannes, SERP de listes) est le meilleur candidat pour « blagues de gamer » ; la page thème prend « vannes de gamer », vocabulaire du site, et décrit enfin ses 4 vannes réelles (lags, « juste une dernière » et coéquipier solo n'y sont plus depuis la bascule s14). Le coéquipier visé disparaît aussi de l'intro (contraire à la règle 4 de B2). Condition, à vérifier par @seo AVANT application : si `/vannes/theme/gaming` est déjà dans le top 10 Search Console sur « blagues de gamer », on inverse. « chacune avec son décryptage » est repris de l'existant `[à confirmer en base pour les 3 vannes cs14]`. À appliquer avec A4 C9 (même fichier, même logique).

## 5. Récapitulatif

| # | Critère(s) | Fichier(s) | Agent |
|---|---|---|---|
| C1 | 5 | B2 l.47 | @copywriter |
| C2 | 2, 7 | B2 l.73 | @copywriter |
| C3 | 5 | B2, 4 italiques (n°1, 5, 6, 9) | @copywriter |
| C4 | 5 | B2, 6 italiques (n°14, 16, 17, 20, 22, 23) | @copywriter |
| C5 | 5 | B2 l.102 | @copywriter |
| C6 | 6 | B2 l.187 | @copywriter |
| C7 | 6 | B2 l.197 (FAQ, donc `faqs` et JSON-LD via `--update`) | @copywriter |
| C8 | 7 | lib/vannes-themes.ts l.81-86 | @seo (vérif. Search Console) puis @fullstack |

Notes projetées après application : 1 = 10, 2 = 10, 3 = 10, 4 = 10, 5 = 10, 6 = 10, 7 = 10, 8 = 10.

Diff réel attendu (P0 s11) : 16 lignes de texte modifiées sur environ 170 de contenu (environ 9 %), 0 mot changé dans les 24 vannes, 0 slug, H2, question de FAQ, lien de sortie (hors ancre l.73), chiffre ou prix touché ; 4 propriétés de config (C8). Ne pas l'annoncer comme une réécriture. Code : pre-commit `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`, déploiement noté dans `REPLIT_ACTIONS.md`.

## 6. Ne comptent pas contre le 10

- **Nuit blanche à 2 vannes** : seul remède, une vague de lignes validées à l'aveugle (déjà au handoff B2, point 6). À ouvrir si `blog-ancre-clic` montre que « Nuit blanche » est l'ancre la plus cliquée.
- **SERP orientée calembours** (« quand un gamer pleure, on le console ») : B2 n'en a aucun. Ajout possible seulement par des lignes neuves validées à l'aveugle ; l'angle par situation est un choix défendable.
- **n°20 et la vanne Soirées `cs14jkb03209d55cbfc17448`** (« Il m'a regardé comme si j'étais le bruit ») : même chute, le narrateur est le bruit. Scènes différentes, pages différentes : garder (défaut tranché, voir §7).
- **Handoff B2 point (1)** (l.8) : compare deux slugs identiques ; note interne non importée, à nettoyer par @copywriter.
- **Rendu réel** : captures 390 px et desktop après publication du 26/11.

## 7. Décisions pour Thomas (hors note)

- **C8** : sens de l'arbitrage article / page thème, conditionné à Search Console, à trancher en même temps que A4 C9 (toujours en attente).
- **n°20 / Soirées** : défaut appliqué, garder les deux. Si tu juges la collision gênante, la n°20 (H16-2) passe en réserve, l'article tombe à 23 vannes (title, meta, « En bref » et excerpt à 23).

## 8. Sources externes

- SERP « blagues de gamer » consultée le 05/10/2026 : [gohumour.com](https://www.gohumour.com/blague/societe/geeks/gamer), [blague-drole.fr](https://blague-drole.fr/blague-geek), [blague-humour.com](https://blague-humour.com/blagues-de-geek/), [mes-economies-faciles.fr](https://mes-economies-faciles.fr/blagues-droles/blagues-geek-droles/), [openclassrooms.com](https://openclassrooms.com/forum/sujet/blagues-de-programmeursgamergeek-34370). Usage : format de la requête uniquement ; aucun nom de site dans le client-facing.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-B2-iter1.md
- Décisions prises : note 9,25/10 (74/80) ; 8 correctifs exacts (C1 à C8) pour 10/10, 0 mot changé dans les 24 vannes ; variété PASS (aucun doublon strict) ; zéro marque, jeu ou console PASS ; cannibalisation avec `/vannes/theme/gaming` FAIL, résolution C2 + C8.
- Points d'attention : @copywriter applique C1 à C7 puis import `--update` ; @seo vérifie Search Console avant C8, @fullstack applique C8 avec A4 C9 ; la description actuelle de `/vannes/theme/gaming` annonce des vannes absentes de la page (à corriger même si C8 est inversé) ; itération 2 avec captures après le 26/11.
---
