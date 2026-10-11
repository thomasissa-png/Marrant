# Notation : B4 /blog/message-drole-fete-des-meres (itération 1, 05/10/2026)

> Revue @reviewer. Base : `docs/copy/articles-forte-frappe/B4-message-drole-fete-des-meres.md` (numéros de ligne ci-dessous = ce fichier), `config/blog-cta.ts` l.79-85, `config/blog-forte-frappe.ts` l.25 et l.39-55, `config/blog-tracking.ts` l.18, `components/blog/blog-article-parcours-maillage.tsx` (textes par cluster), `lib/blog-clusters.ts`, `lib/blog-article-page.ts` l.67-77, `components/blog/blog-article-view.tsx` l.98, A1 (`A1-message-anniversaire-drole.md`), B3 et sa notation, B5 (`B5-message-drole-fete-des-peres.md`).
> Rendu : captures de l'aperçu admin (sans JS, donc sans boutons Partager) lues : m00, m03, m06 (mobile 390 px), d-haut, d-bas (desktop).
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés.
> Intouchables respectés : texte des 23 lignes (0 caractère modifié), slug, title, pages thèmes, « 1 500+ » absent et non ajouté. Grep U+2014 : 0 dans B4, 0 dans les textes proposés ici. Zéro humoriste, zéro concurrent.
> Fait vérifié : fête des mères 2027 en France = dimanche 30 mai (dernier dimanche de mai, Pentecôte le 16 mai cette année-là), conforme à la ligne 16 des métadonnées.

## 1. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **9/10** | Le sommaire arrive en 4e bloc (capture m00 : vers 1 150 px, hors du 1er écran), sous le paragraphe sur l'italique, et la date de la fête n'est nulle part dans le texte alors que la n°3 dit « poste-la au moins cinq jours avant ». |
| 2 | Sorties vers une 2e page | **8/10** | Autodérision proposée 3 fois dans le corps (l.88, l.111, l.157), famille 2 fois (l.68, l.137), et l'encart « Parcours recommandé » affiche Machine à Café (« l'équivalent d'une pause café », capture d-bas) pour une fête de famille. |
| 3 | CTA d'inscription | **9/10** | Entrée `blog-cta.ts` présente, note juste, mais titre et promesse quasi identiques à ceux de B5 (« Reste à le dire à voix haute » / « Reste à le dire en face », « au téléphone ou à table » dans les deux). |
| 4 | Lisibilité mobile et structure | **9/10** | Format A1, `text-only`, FAQ hors du corps : bon rendu (m03). Mais les n°7, 15 et 18 sont au masculin (« venu », « arrivé », « assis ») et le bouton les envoie tels quels : une fille qui écrit à sa mère envoie une faute d'accord. |
| 5 | Ton Marrant des textes affichés | **7/10** | Promesse fausse « une ou deux phrases » (3 endroits, 14 lignes sur 23 en font 3 ou 4), tic « Copier un texte, c'est bien » (déjà retiré de B3), 1 phrase d'A1 recopiée mot pour mot (l.137), règles 2 à 4, « À retenir » et FAQ 1 clonés d'A1, « Le prénom ne suffit pas » pour une mère, « ton écriture » sans ligne correspondante, « qui suit d'autres règles » faux. |
| 6 | Conformité | **9/10** | Zéro tiret cadratin, zéro humoriste, zéro marque (« note adhésive »), rien sur l'âge ou la cuisine de la mère, jour difficile traité (règle 5, FAQ 3). Seul écart : « parcours Confiance [...] pour oser dire le premier mot » (l.111), promesse déjà corrigée sur A1 et B3. |
| 7 | Sécurité SEO | **9/10** | Title 50 car., meta 145 car. avec la requête, 6 H2 en question, 6 ancres justes (recalculées). Mais la page affichera « 22 avril 2027 · Mis à jour le 5 octobre 2026 » (captures m00 et d-haut) et `dateModified` antérieur à `datePublished`. |
| 8 | Mesure | **10/10** | Slug dans `TRACKED_ARTICLES` (l.18), partage `text-only` mesuré, paliers de scroll, ancres séparées, `src=blog-<slug>` via l'entrée CTA. |

**Note globale : 8,8/10** (70/80).
**Après les 12 correctifs ci-dessous et le correctif de gabarit G1 : 10/10 sur les 8 critères.** Aucun ne touche le texte d'une des 23 lignes.

## 2. Top 3 (impact le plus fort)

1. **C1 + C2 (sommaire et date)** : le lecteur arrive en avril-mai avec deux questions, « quoi écrire » et « c'est quand ». La page répond à la première au 4e bloc et jamais à la seconde.
2. **C4 (accord au féminin)** : le bouton « Envoyer le message n°7 » fait envoyer « Je suis venu dimanche » à une mère par sa fille. C'est l'usage n°1 de la page, et il casse sur 3 lignes.
3. **C9 + C10 + C11 (clones)** : règles, « À retenir », FAQ 1 et CTA sont ceux d'A1 ou de B5 à un mot près. Le lecteur qui lit les deux fêtes voit le gabarit ; Google voit 4 réponses FAQ identiques sur 4 pages.

## 3. Correctifs exacts

Fichier : `docs/copy/articles-forte-frappe/B4-message-drole-fete-des-meres.md`, à reporter en base par l'import `--update`, sauf C11, C12 (config) et G1 (code).

### C1. Sommaire en 2e bloc, sans la sortie « phrases drôles » (critères 1 et 5)

**Avant** (l.46 puis l.48, dans cet ordre) :
```md
Chaque message tient en une ou deux phrases. Après chacun, une ligne en italique te dit où et quand l'utiliser. Il te reste à changer ce qui ne te ressemble pas et à ajouter un détail que ta mère et toi êtes seuls à connaître. Pour l'anniversaire d'un parent, qui suit d'autres règles, il y a [les messages d'anniversaire drôles](/blog/message-anniversaire-drole-par-situation).

Va direct à ton moment : [Carte](#...) · [...] · [Les 5 règles](#comment-ecrire-un-message-drole-de-fete-des-meres-qui-touche-juste). Pour d'autres phrases à ressortir dans une conversation, il y a aussi [les phrases drôles](/blog/phrases-droles-conversations).
```
**Après** (blocs inversés ; ancres inchangées) :
```md
Va direct à ton moment : [Carte](#que-mettre-de-drole-sur-la-carte-de-la-fete-des-meres) · [Cadeau](#quel-mot-drole-glisser-avec-le-cadeau-de-la-fete-des-meres) · [Appel](#que-dire-de-drole-a-sa-mere-au-telephone-le-jour-de-la-fete-des-meres) · [Repas](#quelle-phrase-drole-sortir-au-repas-de-la-fete-des-meres) · [De loin](#quel-message-drole-envoyer-a-sa-mere-quand-on-habite-loin) · [Les 5 règles](#comment-ecrire-un-message-drole-de-fete-des-meres-qui-touche-juste).

Chaque message est court. Sous chacun, une indication en italique te dit où et quand l'utiliser. Il te reste à changer ce qui ne te ressemble pas et à ajouter un détail que ta mère et toi êtes seuls à connaître. Pour l'anniversaire d'un parent, il y a [les messages d'anniversaire drôles](/blog/message-anniversaire-drole-par-situation).
```
Pourquoi : le sommaire passe d'environ 150 à environ 95 mots du haut (« En bref » + l.44), dans le 1er écran mobile ; même correctif que C1 d'A1 et de B3. « Pour d'autres phrases à ressortir [...] il y a aussi » est la phrase d'A1 l.45 : elle descend en fin de section « De loin », où elle sert (C8). « Qui suit d'autres règles » est faux : les règles d'A1 sont celles de B4. « Une ou deux phrases » : voir C3.

### C2. La date de la fête dans l'intro (critère 1)

**Avant** (l.44) :
```md
Tu as une fête des mères à ne pas rater, et une carte du commerce qui dit « Bonne fête maman » comme celle de tous les autres. Le texto « bonne fête » est sûr, mais il ressemble à celui des autres enfants. Cet article te donne **23 messages drôles pour la fête des mères** à copier-coller, rangés selon le moment où tu les envoies.
```
**Après** :
```md
Tu as jusqu'au dimanche 30 mai 2027 pour trouver mieux que la carte du rayon qui dit « Bonne fête maman » et le texto « bonne fête » envoyé entre deux choses. Cet article te donne **23 messages drôles pour la fête des mères** à copier-coller, rangés selon le moment où tu les envoies.
```
Pourquoi : la date est la 2e question du lecteur (la n°3 lui demande de poster la carte 5 jours avant), et B5 la donne. Construction différente de B5 (« La fête des pères tombe le... ») pour ne pas ouvrir les deux articles par la même phrase. « Le texto [...] est sûr, mais il ressemble à » est le moule d'A1 l.43. À mettre à jour chaque année, comme la date de B5 (règle : dernier dimanche de mai, 1er dimanche de juin si Pentecôte), avec `updatedAt`.

### C3. « Une ou deux phrases » devient vrai, sans copier B3 (critère 5)

| Ligne | Avant | Après |
|---|---|---|
| l.13 (excerpt) | `Un message drôle pour la fête des mères, c'est une ou deux phrases où le rire tombe sur toi...` | `Un message drôle pour la fête des mères, c'est quelques lignes où le rire tombe sur toi...` |
| l.42 (En bref) | `...pour la fête des mères tient en une ou deux phrases, fait rire sur toi...` | `...pour la fête des mères tient en quelques lignes, fait rire sur toi...` |
| l.46 | `Chaque message tient en une ou deux phrases.` | `Chaque message est court.` (dans C1) |

Pourquoi : 14 lignes sur 23 font 3 phrases ou plus (n°11 en fait 4). B3 a pris « quelques phrases courtes » : B4 ne reprend pas sa formule.

### C4. Accord au féminin, là où le bouton envoie la ligne (critère 4)

| N° | Ligne | Avant (fin de l'indication) | Après |
|---|---|---|---|
| 7 | l.83 | `...que tu viens en personne. Sinon, choisis une autre ligne.*` | `...que tu viens en personne. Sinon, choisis une autre ligne. Si tu es sa fille : « Je suis venue ».*` |
| 15 | l.123 | `...Garde-la seulement si tu étais vraiment en avance.*` | `...Garde-la seulement si tu étais vraiment en avance. Si tu es sa fille : « arrivée ».*` |
| 18 | l.132 | `...Dis-le sur le ton de celui qui avoue, sans le jouer.*` | `...Dis-le sur le ton de celui qui avoue, sans le jouer. Si tu es sa fille : « assise ».*` |

Pourquoi : la ligne reste verbatim ; l'indication, lue juste à côté du bouton « Envoyer le message n°N », dit quoi changer. `shareText` coupe l'indication : rien ne part en trop.

### C5. Les exemples de la section carte renvoient aux vraies lignes (critère 5)

**Avant** (l.54, fin) : `Garde donc une seule phrase drôle, sur toi (ton écriture, ta carte du rayon, ton retard), et laisse le reste sincère.`
**Après** : `Garde donc une seule phrase drôle, sur toi (la carte prise au rayon, le stylo emprunté, tes visites trop rares, ton cœur découpé de travers), et laisse le reste sincère.`
Pourquoi : aucune ligne ne parle de l'écriture, et la n°3 parle de visites trop rares, pas de retard. Les 4 exemples = n°1 à 4.

### C6. Appel : un angle propre à B4, plus celui de B5 (critère 5)

**Avant** (l.94) : `Au téléphone, tout se joue dans les dix premières secondes : un parent qui voit ton nom s'afficher se demande d'abord s'il y a un problème. Rassure-la avec une phrase drôle, où c'est toi qui es pris en défaut, puis laisse venir le mot sincère.`
**Après** : `Au téléphone, tout se joue dans les dix premières secondes. Si tu l'appelles d'habitude pour demander quelque chose (un numéro, un conseil, une température de lavage), commence par là : le rire tombe sur toi, et le mot sincère vient ensuite tout seul.`
**Avant** (l.97) : `*→ Dans les premières secondes de l'appel, avant qu'elle ait le temps de s'inquiéter. Dis-le d'une voix calme, sans rire.*`
**Après** : `*→ Dans les premières secondes de l'appel, avant qu'elle te demande ce qui t'amène. Dis-le d'une voix calme, sans rire.*`
Pourquoi : le parent inquiet qui décroche, c'est le ressort de B5 (« qu'est-ce qui se passe ? », n°19 et l.107). La n°9 dit autre chose : l'enfant n'appelle que pour demander. Le nouveau texte explique la ligne au lieu d'en emprunter une autre. « Pris en défaut » ne s'accordait pas pour une fille.

### C7. Confiance : la promesse validée, sans doublon autodérision (critères 2, 5 et 6)

**Avant** (l.111) : `Si l'idée de passer l'appel te fait hésiter, le [parcours Confiance](/parcours/confiance) est fait pour ça : 20 minutes par semaine pour oser dire le premier mot. Et pour t'entraîner à rire de toi avec douceur : [les blagues d'autodérision](/vannes/theme/autoderision).`
**Après** : `Si l'idée de passer l'appel te fait hésiter, surtout après une longue pause, le [parcours Confiance](/parcours/confiance) t'aide à reprendre, une conversation à la fois : 20 minutes par semaine.`
Pourquoi : « est fait pour ça [...] pour oser » prête au parcours un objet qu'il n'a pas (correctif C5 d'A1, C8 de B3) ; la promesse reprend l'encart Confiance (« Reprends confiance, une conversation à la fois », « reprendre après une pause »). Autodérision est déjà proposée l.88.

### C8. Trois fins de section : une sortie chacune, plus de doublon ni de phrase d'A1 (critères 2 et 5)

| Ligne | Avant | Après |
|---|---|---|
| l.68 | `Pour comprendre pourquoi une chute courte tombe mieux qu'une chute expliquée, [le timing de l'humour](/blog/timing-humour) donne le principe. Et pour le reste de la famille : [les blagues de famille](/vannes/theme/famille).` | `Pour comprendre pourquoi une chute courte tombe mieux qu'une chute expliquée, [le timing de l'humour](/blog/timing-humour) donne le principe.` |
| l.137 | `Il y aura bientôt un autre repas de famille : [les blagues de famille](/vannes/theme/famille) t'attendent avec leur chute et leur décryptage.` | `Le prochain repas de famille n'attendra pas l'an prochain : [les blagues de famille](/vannes/theme/famille) ont leur chute et leur décryptage.` |
| l.157 | `Écrire le premier mot demande un peu de courage. Si tu veux t'entraîner avant dimanche, [les blagues d'autodérision](/vannes/theme/autoderision) te donnent de quoi rire de toi avec douceur.` | `La fête passe, les messages continuent. Pour les jours ordinaires où vous vous écrivez juste pour prendre des nouvelles, [les phrases drôles](/blog/phrases-droles-conversations) se glissent dans n'importe quelle conversation.` |

Pourquoi : famille passe de 2 à 1 (gardée au repas, où elle sert), autodérision de 3 à 1 (l.88), et la l.137 était mot pour mot A1 l.110. La sortie « phrases drôles » retirée du sommaire (C1) arrive là où le lecteur continue d'écrire à sa mère. Le timing reste 2 fois avec 2 rôles distincts (chute courte l.68, pause à l'oral l.173), comme S9 dans B3.

### C9. Règles et « À retenir » : du B4, plus du A1 (critère 5)

| Ligne | Avant | Après |
|---|---|---|
| l.163 | `> **À retenir :** [...] Une phrase drôle suffit : le reste de ton message peut être sincère.` | `> **À retenir :** Un message drôle de fête des mères réussi est court, vrai, et laisse le rire sur toi. Une chute pour la faire sourire, une phrase vraie pour qu'elle garde le message.` |
| l.165 | `Copier un texte, c'est bien. L'adapter, c'est ce qui le rend à toi. Cinq règles, dans l'ordre :` | `Pour qu'un de ces messages sonne comme toi, cinq règles, dans l'ordre :` |
| l.169 | `**2. Garde une seule idée par message.** Une situation, une chute. Si tu en mets deux, la première gâche la seconde.` | `**2. Garde une seule idée par message.** La carte du rayon ou le stylo emprunté, pas les deux : avec deux chutes, la première gâche la seconde.` |
| l.171 | `**3. Ajoute un détail que vous êtes seuls à connaître.** Le prénom ne suffit pas : un mot qu'elle répète, un objet de la maison, un lieu. Si ton détail demande trois lignes d'explication, retire-le.` | `**3. Ajoute un détail que vous êtes seuls à connaître.** Un mot qu'elle répète, un objet de la maison, un trajet que vous faisiez ensemble : remplace celui de la ligne par le vôtre. Si ton détail demande trois lignes d'explication, retire-le.` |
| l.173 | `**4. Choisis le support avant le texte.** Une phrase écrite sur une carte ne se joue pas comme un vocal. [Le timing de l'humour](/blog/timing-humour) donne la règle de la pause, utile à l'oral.` | `**4. Choisis le support avant le texte.** La carte se relit, l'appel s'entend une fois, le repas a des témoins : la même phrase n'y produit pas le même effet. [Le timing de l'humour](/blog/timing-humour) donne la règle de la pause, utile à l'oral.` |

Pourquoi : l.163 « Une phrase drôle suffit [...] » figure dans A1, B1, B4 et B5 ; l.165 est le tic retiré de B3 (C11) ; l.169 est A1 l.162 mot pour mot ; « Le prénom ne suffit pas » vient d'A1 et n'a pas de sens pour une mère qu'on appelle « maman » ; l.173 reprend la 1re phrase d'A1 l.166. Les nouveaux exemples renvoient aux sections de B4 (carte, appel, repas) et aux n°1-2.

### C10. FAQ 1 : une réponse qui n'existe pas déjà sur 3 autres pages (critère 5)

**Avant** (l.195) : `Fais rire sur toi, jamais sur son âge, son physique, sa cuisine ou ses habitudes. Si tu hésites, relis ton message en te mettant à sa place : s'il te fait sourire de l'autre côté, il peut partir. Une phrase drôle suivie d'une phrase sincère passe presque toujours mieux qu'un message uniquement moqueur.`
**Après** : `Fais rire sur toi, jamais sur son âge, son physique, sa cuisine ou ses habitudes. Avant d'envoyer, lis ton message en imaginant sa voix à elle : si une phrase pourrait la piquer, enlève-la. Termine par une phrase sincère : c'est celle-là que ta mère relira quand la blague sera passée.`
Pourquoi : les phrases 2 et 3 sont identiques dans A1 l.188, B3 l.192 et B5 l.167 (réponses FAQPage en double sur 4 URL). La question reste inchangée (requête). Texte simple, sans lien : conforme à `splitTrailingFaq`.

### C11. CTA : distinct de B5 (critère 3)

Fichier : `apps/web/src/config/blog-cta.ts`, entrée `"message-drole-fete-des-meres"` (et l.33-34 du fichier B4, à garder synchrones).

| Champ | Avant (l.81-82) | Après |
|---|---|---|
| title | `"Le message est choisi. Reste à le dire à voix haute."` | `"Le message est choisi. Le reste de la journée s'improvise."` |
| text | `"Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours : de quoi oser le dire au téléphone ou à table, pas seulement l'écrire sur une carte."` | `"Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours, dont Confiance : de quoi trouver tes mots au téléphone ou à table aussi, quand il n'y a plus de texte à copier."` |

Pourquoi : B5 garde « Reste à le dire en face » et « au téléphone ou à table, pas seulement par SMS » ; les deux CTA se lisaient comme un seul. « Reste à le dire à voix haute » sonnait faux après 11 lignes sur 23 (n°9 à 19) déjà faites pour l'oral. Promesse = [CHOIX UTILISATEUR] du 04/10 + parcours nommé (format A3 et B6), cohérente avec C12. primaryLabel et note inchangés.

### C12. Parcours recommandé : Confiance, pas Machine à Café (critère 2)

Fichier : `apps/web/src/config/blog-forte-frappe.ts`. **Avant** (l.53-55) :
```ts
  // Poisson d'avril : le CTA vend « la riposte » (notation A5 iter1).
  "blagues-poisson-d-avril-adultes": "repartie",
};
```
**Après** :
```ts
  // Poisson d'avril : le CTA vend « la riposte » (notation A5 iter1).
  "blagues-poisson-d-avril-adultes": "repartie",
  // Fêtes des mères et des pères : le CTA nomme Confiance, le corps y renvoie (notations B4/B5 iter1).
  "message-drole-fete-des-meres": "confiance",
  "message-drole-fete-des-peres": "confiance",
  // Vacances entre amis : « trouver ta place dans un groupe qui rit » (notation B6 iter1).
  "blagues-vacances-ete-entre-amis": "confiance",
};
```
Pourquoi (réponse à la question du brief) : **le parcours déduit du cluster n'est pas le bon.** CATALOGUE → `fort-volume` → Machine à Café, dont l'encart (capture d-bas) promet « l'équivalent d'une pause café un peu longue » : c'est l'humour de bureau, à la fin d'un article sur sa mère. Confiance est le seul parcours que B4 cite (l.111), son encart parle de « reprendre après une pause » et de « trouver ta place dans un groupe qui rit » (la table familiale), et C11 le nomme. Répartie (« chambrage entre potes, pique en TD ») ne colle pas à une mère. Les 3 entrées sont données ici une fois pour B4, B5 et B6 (une seule modification du fichier).

### G1. Gabarit : pas de « Mis à jour » antérieur à la publication (critère 7)

Seul correctif hors texte, commun à tous les articles programmés en base (B4, B5, B6, et ceux déjà importés avant leur date). Fichier : `apps/web/src/lib/blog-article-page.ts`.

**Avant** (l.66 à l.77) :
```ts
  const { content, faqs } = splitTrailingFaq(dbArticle.content);
  return {
    article: {
      [...]
      date: dbArticle.publishedAt
        ? dbArticle.publishedAt.toISOString().split("T")[0]
        : dbArticle.createdAt.toISOString().split("T")[0],
      // Vrai updatedAt de la DB (colonne Prisma) : utilisé pour Article.dateModified
      updatedAt: dbArticle.updatedAt ? dbArticle.updatedAt.toISOString().split("T")[0] : undefined,
```
**Après** :
```ts
  const { content, faqs } = splitTrailingFaq(dbArticle.content);
  const date = (dbArticle.publishedAt ?? dbArticle.createdAt).toISOString().split("T")[0];
  const updated = dbArticle.updatedAt ? dbArticle.updatedAt.toISOString().split("T")[0] : undefined;
  return {
    article: {
      [...]
      date,
      // Vrai updatedAt de la DB (colonne Prisma) : utilisé pour Article.dateModified.
      // Article importé avant sa date de publication : pas de « Mis à jour » antérieur à la publication.
      updatedAt: updated && updated > date ? updated : undefined,
```
Pourquoi : `updatedAt` est la colonne Prisma automatique, donc la date de l'import (05/10/2026). Captures m00 et d-haut : « 22 avril 2027 · Mis à jour le 5 octobre 2026 ». Le lecteur voit une page « mise à jour » 6 mois avant d'exister, et `dateModified` < `datePublished` dans le JSON-LD et `og:modifiedTime` (page.tsx l.44, json-ld.tsx l.217 se replient déjà sur `date`). Un seul point de correction couvre la vue, le JSON-LD et l'OG. Test à ajouter : `publishedAt` 2027-04-22 et `updatedAt` 2026-10-05 → `updatedAt` absent. Les métadonnées B4 (l.16) prévoyaient déjà `updatedAt` = date de publication au jour J : le code ne le permettait pas.

### Récapitulatif

| # | Critère(s) | Lignes / fichier | Test |
|---|---|---|---|
| C1 | 1, 5 | B4 l.46-48 | aucun |
| C2 | 1 | B4 l.44 | aucun |
| C3 | 5 | B4 l.13, l.42 (l.46 dans C1) | aucun |
| C4 | 4 | B4 l.83, l.123, l.132 | aucun |
| C5 | 5 | B4 l.54 | aucun |
| C6 | 5 | B4 l.94, l.97 | aucun |
| C7 | 2, 5, 6 | B4 l.111 | aucun |
| C8 | 2, 5 | B4 l.68, l.137, l.157 | aucun |
| C9 | 5 | B4 l.163-173 | aucun |
| C10 | 5 | B4 l.195 (FAQ) | aucun |
| C11 | 3 | blog-cta.ts l.81-82 (+ B4 l.33-34) | test CTA s'il fige les textes |
| C12 | 2 | blog-forte-frappe.ts l.53-55 | test du parcours s'il liste les slugs |
| G1 | 7 | blog-article-page.ts l.66-77 | ajouter le cas « programmé » |

Diff réel attendu (P0 s11) : 21 lignes de contenu touchées sur environ 208 (dont 2 blocs inversés), plus les 2 lignes CTA du fichier (l.33-34), 0 caractère dans les 23 lignes, le slug, le title, les H2, les ancres, les questions de FAQ et la meta. Plus 2 lignes de config CTA, 5 de config parcours, 4 de code (G1). Ne pas l'annoncer comme une réécriture. Notes projetées : 10 sur les 8 critères.

## 4. Vérifications demandées

### Répétitions inter-articles (A1, B3, B5)

| Texte de B4 | Déjà dans | Traité par |
|---|---|---|
| « une ou deux phrases » (l.13, l.42, l.46) | B1 l.48, B5 l.13/43/47 (B3 corrigé) | C3, C1 |
| « Copier un texte, c'est bien. L'adapter [...] » (l.165) | A1 l.158, B1 l.169, B5 l.138 | C9 |
| « Il y aura bientôt un autre repas de famille [...] » (l.137) | A1 l.110, mot pour mot | C8 |
| Règle 2 (l.169) | A1 l.162, mot pour mot | C9 |
| « Une phrase drôle suffit : le reste [...] sincère » (l.163) | A1 l.156, B1 l.167, B5 l.136 | C9 |
| FAQ 1, phrases 2-3 (l.195) | A1 l.188, B3 l.192, B5 l.167 | C10 |
| « Pour d'autres phrases à ressortir dans une conversation [...] » (l.48) | A1 l.45 | C1 + C8 |
| « est fait pour ça [...] pour oser » (l.111) | B5 l.130 (corrigé dans A1, B3) | C7 |
| Pied « Tu as fait le tour ? [...] rangé par situation » (l.181) | A1, B1, B3 | gardé : pied de gabarit commun, comme sur l'étalon |

### Différenciation B4 / B5

Structure : distincte (B4 par moment de la journée, B5 par terrain du père) ; aucune ligne commune. Clones avant correctifs : En bref et intro (« tient en une ou deux phrases »), règles 2 à 4, « À retenir », FAQ 1, CTA, H2 de l'appel et H2 des règles, angle du parent inquiet au téléphone (l.94). Après C3, C6, C9, C10, C11 ici et C2, C8, C11, C12 de la notation B5 : il ne reste en commun que le gabarit (sections, pied, format des indications) et les questions FAQ calquées sur chaque requête.

### SEO

| Point | État | Après correctifs |
|---|---|---|
| Title ≤ 60 car. avec la requête | PASS : 50 car. | inchangé |
| Meta ≤ 155 car. | PASS : 145 car., requête en tête | inchangé |
| H2 en question | 6 sur 6 | inchangés (le H2 jumeau des règles est changé côté B5) |
| Ancres du sommaire | PASS : 6/6 = `headingId` (recalculées) | inchangées |
| dateModified | FAIL : antérieur à la publication | PASS (G1) |
| Date de la fête | absente | dans l'intro (C2) |

## 5. Ne comptent pas contre le 10

- **Répondeur et silence, n°11 (B4) et n°16 (B5)** : deux ressorts voisins (silence offert / silence du répondeur du père). Lignes validées, mécanismes distincts : pas de retrait.
- **Bouquet et transports, n°14 (B4) et n°11 d'A1** : même décor, chute différente (choix entre fleurs et gâteau / état du bouquet). Intouchable.
- **Bouton « Envoyer le message n°N » sur les lignes à dire à table (n°14 à 19)** : même cas qu'A1 (n°4, 12, 13) ; envoyer la ligne avant le repas reste un usage valable.
- **« À lire ensuite » (capture d-bas)** : 50 blagues, 30 phrases drôles et « Comment faire rire une fille ». La 3e carte détonne sous un article sur sa mère. Gabarit commun à tout article CATALOGUE en base (`blog-clusters.ts`, cluster `fort-volume`), hors texte : à instruire par @fullstack pour toute la série (par exemple une liste de cartes par slug dans `blog-forte-frappe.ts`, sur le modèle de `FORTE_FRAPPE_PARCOURS`).

## 6. Points d'attention (hors note)

- B5 est publié le 13/05, avant la fête des mères (30/05) : la notation B5 (C15) y ajoute un lien vers B4. Lien retour B4 → B5 à poser par `--update` le jour de la publication de B5 seulement (B5 est conditionnel à J+21).
- Relecture @copywriter des textes ajoutés (C1 à C11) contre `docs/copy/charte-refonte-copy-s11.md`, puis `--update`. Captures 375/768/1280 à reprendre après import, boutons Partager visibles (rendu avec JS).

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-B4-iter1.md
- Décisions prises : note globale 8,8/10 (70/80) ; 12 correctifs exacts (C1 à C12) + 1 correctif de gabarit (G1) pour 10/10, sans toucher aux 23 lignes, au slug, au title, à la meta ni aux questions de FAQ ; parcours déduit du cluster (Machine à Café) jugé faux, Confiance recommandé pour B4, B5 et B6.
- Points d'attention : @copywriter applique C1 à C10 dans le fichier B4 puis `--update` ; @fullstack applique C11, C12 et G1 (avec le test) et instruit les cartes « À lire ensuite » ; date de la fête (C2) à mettre à jour chaque année.
---
