# Notation : A4 « blagues de couple » (`/blog/blagues-de-couple-drole`, itération 1, 05/10/2026)

> Revue @reviewer. Base : `docs/copy/articles-forte-frappe/A4-blagues-de-couple.md` (226 lignes, état final annoncé « prêt pour l'import »), gabarit `apps/web/src/app/(dashboard)/blog/[slug]/page.tsx`, `components/ui/markdown-renderer.tsx`, `lib/blog-faq.ts`, `lib/seo-meta.ts`, `config/blog-cta.ts`, `components/blog/article-cta.tsx`, `lib/vannes-themes.ts`, `config/blog-tracking.ts`, et l'étalon `meilleures-blagues-droles-2026` (`lib/blog-articles.ts` l.1368-1590, notations iter1 et iter4).
> Grille de 8 critères reprise telle quelle de `notation-article-blagues-2026-iter1.md`.
> Intouchables respectés par tous les correctifs : texte des 32 blagues (aucun mot modifié), zéro tiret cadratin (0 occurrence de « — » ou « – » dans le fichier), zéro humoriste, « 1 500+ membres » non touché (absent de l'article, non ajouté), aucune promesse nouvelle non vérifiée.
> Limites : article non importé, donc rendu réel non vu (aucune capture) ; pas de git ; volume de la requête inconnu (aucune donnée Search Console fournie).

## 1. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **8/10** | « En bref » et 1er paragraphe disent deux fois la même chose ; le sommaire n'arrive qu'en 3e bloc (environ 100 mots + H1 long), puis 2 blocs encore avant le 1er H2 (l.37 et l.39). |
| 2 | Sorties vers une 2e page | **9/10** | Couverture complète et sorties de section variées, mais la blague du jour est annoncée 2 fois avec la même phrase « Une nouvelle vanne arrive chaque jour » (l.39 et l.195). |
| 3 | CTA d'inscription | **6/10** | Aucune entrée dans `config/blog-cta.ts` : CTA par défaut, placé après FAQ, cluster, « À lire ensuite » et parcours (`page.tsx` l.267 vs l.356+), titre et note génériques (`article-cta.tsx` l.25-29). C'est exactement l'état noté 6 sur l'étalon à l'iter1. |
| 4 | Lisibilité mobile et structure | **6/10** | Pas de bouton Partager (`SHARE_JOKES_SLUGS` ne contient que l'étalon, `page.tsx` l.35) alors que le titre promet « à s'envoyer » ; guillemets « » imbriqués dans 10 vannes (lecture « « … » … »), cas que le renderer évite seulement pour les "…" (`markdown-renderer.tsx` l.109-113) ; 2 doublons de mécanisme. |
| 5 | Ton Marrant des textes affichés | **8/10** | Indications d'usage copiées-collées : « faux air de reproche » (n°11, n°14), « Garde un ton neutre » (n°3, n°13), « administratif » (n°9, n°13), « Sur le ton d'un constat » (n°6, n°25), « À raconter au retour, entre vous deux. Le rire tombe sur toi et sur » (n°19, n°20), « À sortir au retour » (n°28, n°29) ; faute « garde-la pour le dire » (n°30). |
| 6 | Conformité | **9/10** | Zéro tiret cadratin, zéro humoriste, « 20 minutes par semaine » conforme au [CHOIX UTILISATEUR] du 29/09 ; mais le quiz est vendu comme révélant « le type d'humour de ton couple » alors qu'il donne un profil individuel (l.203), et la règle « garde la famille de l'autre hors du jeu » (l.189, FAQ l.213) contredit la section belle-famille. |
| 7 | Sécurité SEO | **8/10** | Title 55 car., meta 151 car., 6 H2 en question, 6 ancres = `headingId`, FAQ conforme à `splitTrailingFaq` : PASS. Mais `/vannes/theme/couple` vise la même requête (title « Blagues de couple pour rire à deux », H1 « Blagues de couple : … », meta sur « les courses, le canapé », `vannes-themes.ts` l.37-40) et l'article lui envoie l'ancre exacte « les blagues de couple » (l.71). |
| 8 | Mesure | **9/10** | Scroll 4 paliers, ancres, sorties, `src=blog-<slug>` et suivi hebdo (`config/blog-tracking.ts` l.12) s'appliquent sans rien faire ; seul manque : `blog-vanne-partage`, l'événement de valeur de cet article, ne part pas sans Partager. |

**Note globale : 7,9/10** (63/80).
**Après application des 10 correctifs ci-dessous : 10/10 sur les 8 critères.**

## 2. Vérifications demandées

### SEO

| Point | Exigence | État | Verdict |
|---|---|---|---|
| Title | ≤ 60 car., avec la requête | « Blagues de couple : des vannes à se dire ou à s'envoyer », 55 car. ; avec le suffixe « \| deviens-marrant.fr » on dépasse 60, `fitTitle` sert donc le titre seul (`seo-meta.ts` l.52-53), affiché en entier | PASS (C10 ajoute le nombre, 54 car.) |
| Meta | ≤ 155 car. | 151 car. ; `page.tsx` l.62 prend `metaDescription` en priorité sur l'excerpt (290 car.), donc pas de coupe | PASS |
| H2 | en question | 6 H2 sur 6 finissent par « ? » ; « ## FAQ » est retiré du corps par `splitTrailingFaq` (`blog-faq.ts` l.22-35) et rendu en « Questions fréquentes » | PASS |
| Intention dès l'intro | réponse visible | « blague(s) de couple » dans « En bref » et au 1er paragraphe ; les vannes commencent après environ 250 mots | PASS, mais lent (critère 1, C1) |
| Ancres du sommaire | = `headingId` du H2 | 6/6 recalculées à la main (accents retirés, apostrophe → tiret) : identiques | PASS |
| FAQ JSON-LD | réponses sans markdown | 4 réponses en texte brut, aucune ne déclenche `UNSUPPORTED_ANSWER_MARKDOWN` | PASS |
| SERP | format attendu | Les 9 premiers résultats sont des listes numérotées (« Top 30 », « 58 meilleures », « 15 blagues ») ; l'article est le seul classé par moment, avec mode d'emploi : bon angle, mais sans nombre dans le titre | C10 |

### Variété des ressorts (32 vannes relues une par une)

| Paire | Mécanisme commun | Verdict | Décision |
|---|---|---|---|
| n°1 / n°15 | Même formule « On a une règle pour X : celui qui [condition]… » + la condition n'est jamais remplie | **Doublon strict** | Retirer n°15 (H8-2) en réserve (C5) |
| n°19 / n°21 | Faire bonne figure chez les beaux-parents, tenu jusqu'à l'absurde (« resté dans le rôle jusqu'au petit déjeuner » / « je savoure encore ») | **Doublon strict** | Retirer n°19 (H10-13) en réserve (C5) |
| n°16 / n°21 | Politesse prolongée (« jusqu'à dimanche ») | Voisin : n°16 joue sur la consigne vague « où tu veux », pas sur une feinte | Garder |
| n°14 / n°30 | L'outil d'organisation de l'autre révèle ma place | Voisin : n°14 rit de ma paresse (rien en bleu), n°30 de l'agenda de l'autre (je suis un créneau) | Garder (2 lignes catalogue) |
| n°24 / n°32 | Le romantique battu par le pratique | Voisin : fausse piste énumérée (n°24) contre réponse au mauvais message (n°32) | Garder |
| n°1 / n°4 | Règle de couple | Voisin : règle inopérante (n°1) contre règle respectée à la lettre (n°4) | Garder |
| n°2 / n°3, n°5 / n°8, n°28 / n°29 | Même thème (larmes devant l'écran, sommeil devant l'écran, photos de vacances) | Thème proche, mécanismes différents | Garder |

Après C5 : 30 vannes, aucune paire au même mécanisme.

### Cannibalisation

| Page | Recouvrement | Verdict |
|---|---|---|
| Étalon `meilleures-blagues-droles-2026`, section Date (n°17-24) | Rencontre et applis, aucun couple installé ; aucune des 32 lignes n'y figure | PASS |
| Étalon, section Famille (n°25-30) | Sa propre famille (mère, père, grand-mère, oncle) ; A4 parle des beaux-parents ; pas de ligne commune | PASS |
| Étalon, autres sections | Aucune section couple ; il pointe vers `/vannes/theme/couple` (l.1548), pas vers A4 | PASS (lien J0 prévu par le handoff A4) |
| `humour-saint-valentin` | Absent de `blog-articles.ts` ; ni « Saint-Valentin », ni « célibataire », ni « cadeau » dans A4 | PASS |
| `/vannes/theme/couple` | Même requête en title, H1 et meta, mêmes sous-thèmes (courses, canapé, « on mange quoi ? ») ; A4 lui donne l'ancre exacte | **FAIL** → C9 |

## 3. Top 3

1. **C2 (CTA dédié)** : critère le plus bas avec le 4. Sans entrée dans `blog-cta.ts`, A4 reprend le défaut que l'étalon a corrigé (CTA à 4 blocs du corps). Une entrée de 5 lignes, zéro code.
2. **C3 + C4 (Partager, guillemets)** : le titre promet « à s'envoyer » et aucune vanne ne peut s'envoyer d'un tap ; 10 vannes sur 32 se lisent avec des guillemets imbriqués. Une ligne de code et 10 retouches de ponctuation.
3. **C9 (cannibalisation avec `/vannes/theme/couple`)** : deux URL du même site sur la même requête exacte. À trancher avant l'import, pas après.

## 4. Correctifs exacts

Fichier article, sauf mention contraire : `docs/copy/articles-forte-frappe/A4-blagues-de-couple.md` (numéros de ligne actuels). Les numéros de vanne sont ceux d'aujourd'hui ; C5 les décale ensuite.

### C1. Intro : sommaire dans le 1er écran, une seule annonce de la règle (critères 1, 2, 5)

**Avant** (l.31 à l.39) :
```md
> **En bref :** Une blague de couple marche quand elle tombe sur vous deux ou sur la situation, jamais sur l'un des deux. Voici des vannes classées par moment du quotidien (canapé, courses, belle-famille, vacances, messages), avec pour chacune la façon de la dire ou de l'envoyer.

Après quelques années à deux, […] ou s'envoient entre deux réunions.

Va direct à ton moment : [Canapé](#…) · […] · [Règles du jeu](#comment-faire-rire-son-couple-sans-blesser-l-autre). Pour les autres situations (soirée, bureau, famille au sens large), les [50 blagues drôles à ressortir](/blog/meilleures-blagues-droles-2026) font le tour. Ici, on parle du couple installé, celui qui sait déjà qui a posé la télécommande dans le frigo.

> **Le test :** Une blague de couple passe si l'autre pourrait la dire à ta place. Elle tombe sur vous deux ou sur la situation, jamais sur le physique, jamais sur un point sensible de l'autre.

Une nouvelle vanne arrive chaque jour avec [la blague du jour](/blague-du-jour), et le [catalogue de vannes](/vannes) range le reste par thème.
```
**Après** (les 6 ancres et le paragraphe « Après quelques années à deux » sont repris mot pour mot, seul l'ordre change) :
```md
> **En bref :** 30 blagues de couple classées par moment du quotidien (canapé, courses, belle-famille, vacances, messages), chacune avec la façon de la dire ou de l'envoyer. Elles tombent sur vous deux ou sur la situation, jamais sur l'un des deux.

Va direct à ton moment : [Canapé](#quelles-blagues-de-couple-faire-sur-le-canape-la-telecommande-la-serie-le-dimanche) · [Courses](#quelles-blagues-pour-les-courses-le-diner-et-le-menage-le-quotidien-a-deux) · [Belle-famille](#comment-rire-du-week-end-chez-les-beaux-parents-sans-froisser-personne) · [Vacances](#quelles-blagues-de-couple-en-vacances-la-valise-la-route-la-location) · [Messages](#quelle-blague-de-couple-envoyer-par-message-dans-la-journee) · [Règles du jeu](#comment-faire-rire-son-couple-sans-blesser-l-autre). Ici, on parle du couple installé, celui qui sait déjà qui a posé la télécommande dans le frigo. Pour les autres situations (soirée, bureau, famille au sens large), les [50 blagues drôles à ressortir](/blog/meilleures-blagues-droles-2026) font le tour. La [blague du jour](/blague-du-jour) change tous les jours, et le [catalogue de vannes](/vannes) range le reste par thème.

Après quelques années à deux, on n'a plus besoin de blagues pour séduire. On en a besoin pour la télécommande, la liste de courses et le week-end chez les beaux-parents. Les meilleures blagues de couple ne se jouent pas sur scène : elles se disent à l'autre, sur le canapé, ou s'envoient entre deux réunions.

> **Le test :** Une blague de couple passe si l'autre pourrait la dire à ta place. Jamais sur le physique, jamais sur un point sensible de l'autre.
```
Pourquoi : le sommaire passe d'environ 100 mots à environ 40 mots sous le H1 (1er écran mobile, comme l'étalon) ; un bloc de moins avant le 1er H2 ; « tombe sur vous deux » n'est plus dit deux fois en 6 lignes ; la blague du jour reprend la formule de l'intro de l'étalon (« change tous les jours ») et ne répète plus celle de la fin (l.195). « 30 » suppose C5 ; si Thomas refuse C5, écrire « 32 ».

### C2. CTA dédié, juste après le corps (critère 3)

Fichier : `apps/web/src/config/blog-cta.ts`. **Avant** (l.22-23) :
```ts
  },
};
```
**Après** :
```ts
  },
  // Notation A4 iter1 (C2) : couple installé venu chercher une vanne, même position et même note que l'étalon.
  "blagues-de-couple-drole": {
    title: "Tu as les vannes. Reste à trouver le bon moment.",
    text: "Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours, dont Répartie : de quoi renvoyer la balle quand l'autre te répond du tac au tac.",
    primaryLabel: "Créer mon compte gratuit",
    note: "Gratuit, sans carte. Les vannes de cette page restent en accès libre, compte ou pas.",
  },
};
```
Pourquoi : une entrée suffit pour que `page.tsx` l.267 place le CTA juste après le corps, avant FAQ et maillage (aujourd'hui il tombe après 4 blocs, l.356+). Titre aligné sur la règle « Choisis le moment » de l'article ; promesse = [CHOIX UTILISATEUR] du 04/10 déjà utilisé par l'étalon ; note vraie (l'article n'a aucun contenu réservé). Aucun code.

### C3. Bouton Partager sur chaque vanne (critères 4 et 8)

Fichier : `apps/web/src/app/(dashboard)/blog/[slug]/page.tsx`. **Avant** (l.35) :
```ts
const SHARE_JOKES_SLUGS = new Set(["meilleures-blagues-droles-2026"]);
```
**Après** :
```ts
const SHARE_JOKES_SLUGS = new Set(["meilleures-blagues-droles-2026", "blagues-de-couple-drole"]);
```
Pourquoi : le title promet « à s'envoyer », une section entière parle d'envoi et 6 indications disent « à envoyer ». Les 32 lignes respectent `JOKE_RE` (`**N.** « … »`, `markdown-renderer.tsx` l.30) : bouton et `blog-vanne-partage` partent sans autre code, texte stocké inchangé. Test à ajouter : `renderMarkdown(contenuA4, { shareJokes: true })` contient 30 `data-share-vanne` et 6 `<h2 id=`.

### C4. Guillemets imbriqués : convention de l'étalon (critère 4)

10 vannes, aucun mot modifié : seuls les « » intérieurs deviennent des guillemets droits, que le renderer affiche en “…” à l'intérieur d'une vanne (`markdown-renderer.tsx` l.109-113, même rendu que la n°8 de l'étalon). Seul le texte entre « … » extérieurs change ; l'indication en italique ne bouge pas.

| Vanne (ligne) | Avant | Après |
|---|---|---|
| n°3 (l.53) | `j'ai dit « j'ai un truc dans l'œil ». Elle a répondu « oui, depuis la bande-annonce ». »` | `j'ai dit "j'ai un truc dans l'œil". Elle a répondu "oui, depuis la bande-annonce". »` |
| n°8 (l.68) | `dit toujours « je ne dors pas, je ferme les yeux ». Elle` | `dit toujours "je ne dors pas, je ferme les yeux". Elle` |
| n°10 (l.82) | `me demande « t'as envie de quoi ? » à 19 h 30.` | `me demande "t'as envie de quoi ?" à 19 h 30.` |
| n°16 (l.108) | `On m'a répondu « où tu veux ». Je` | `On m'a répondu "où tu veux". Je` |
| n°17 (l.111) | `à la cave « pour une grande occasion ». Je` | `à la cave "pour une grande occasion". Je` |
| n°18 (l.114) | `Ils disent tous « on ne l'entend plus ». Moi` | `Ils disent tous "on ne l'entend plus". Moi` |
| n°22 (l.126) | `chez ses parents : « je vais passer un coup de fil ». En fin` | `chez ses parents : "je vais passer un coup de fil". En fin` |
| n°25 (l.143) | `On se dit « plus que vingt minutes » depuis une heure.` | `On se dit "plus que vingt minutes" depuis une heure.` |
| n°28 (l.152) | `Une amie a répondu « la deuxième est top ». »` | `Une amie a répondu "la deuxième est top". »` |
| n°32 (l.172) | `de la semaine : « je t'aime », et « tu as appelé le plombier ? ». Elle` | `de la semaine : "je t'aime", et "tu as appelé le plombier ?". Elle` |

Pourquoi : « « j'ai un truc dans l'œil ». Elle a répondu « oui… ». » se lit comme si la vanne s'arrêtait au 1er « » ». C'est le défaut que l'étalon a réglé (iter4) ; ici le renderer ne peut rien, il ne convertit que les "…". Les 7 lignes catalogue n'ont pas de citation et ne bougent pas.
