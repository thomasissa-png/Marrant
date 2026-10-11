# Notation : B5 /blog/message-drole-fete-des-peres (itération 1, 05/10/2026)

> Revue @reviewer. Base : `docs/copy/articles-forte-frappe/B5-message-drole-fete-des-peres.md` (numéros de ligne ci-dessous = ce fichier), `config/blog-cta.ts` l.86-92, `config/blog-forte-frappe.ts` l.26 et l.39-55, `config/blog-tracking.ts` l.19, `components/blog/blog-article-parcours-maillage.tsx`, `components/ui/markdown-renderer.tsx` (`headingId` l.180, `shareText` l.49), A1, B3 et sa notation, B4 et `notation-B4-iter1.md`.
> Rendu : captures de l'aperçu admin (sans JS) lues : m00, m04 (mobile 390 px), d-bas (desktop).
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés.
> Intouchables respectés : texte des 19 lignes (0 caractère modifié, vanne catalogue n°19 comprise), slug, title, meta, pages thèmes. Grep U+2014 : 0 dans B5, 0 dans les textes proposés. Zéro humoriste, zéro concurrent.
> Fait vérifié : fête des pères 2027 = 3e dimanche de juin = dimanche 20 juin (1er juin 2027 = mardi) ; l.45 et FAQ 4 justes.

## 1. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **9/10** | Date et promesse dès l.45, bien ; mais le sommaire arrive en 4e bloc (capture m00 : vers 1 100 px), sous le paragraphe sur l'italique, comme sur A1 et B3 avant correction. |
| 2 | Sorties vers une 2e page | **8/10** | Le timing est proposé 2 fois pour le même rôle (« la pause », l.101 et l.146), « les blagues de soirée » pour la suite d'un barbecue de fête des pères (l.101), pas de lien vers B4 alors qu'il est publié 3 semaines avant, et encart Machine à Café (capture d-bas). |
| 3 | CTA d'inscription | **10/10** | Entrée `blog-cta.ts` présente, CTA après le corps (m04), titre « Reste à le dire en face » qui colle à un père peu bavard, note juste. Le doublon avec B4 est corrigé côté B4 (C11 de sa notation). |
| 4 | Lisibilité mobile et structure | **9/10** | Format A1, `text-only`, FAQ hors du corps : bon rendu. Mais la n°19 dit « À raconter, pas à envoyer » sous un bouton « Envoyer le message n°19 », et la n°15 (« resté garé ») part au masculin. |
| 5 | Ton Marrant des textes affichés | **6/10** | « Une ou deux phrases » promis 3 fois alors que les 19 lignes en font 3 ou 4 ; règle 1 « ses silences, jamais » contredite par les n°14 et 18 (et la FAQ 1 la répète) ; exemples sans ligne (« goûter avant qu'il ait fini », « file d'attente », « estomac ») ; tic « Copier un texte, c'est bien » ; 1 phrase d'A1 mot pour mot (l.75) ; « Le reste du catalogue, lui, ne change pas » (retiré de B3) ; règle 2 ambiguë ; l.107 « c'est ton public qui les écrit » et la chute de la n°19 éventée. |
| 6 | Conformité | **9/10** | Zéro tiret cadratin, zéro humoriste, zéro marque, rien sur l'âge, la santé ou le travail, date vraie. Seul écart : « parcours Confiance est fait pour ça [...] pour oser envoyer le message » (l.130), déjà signalé par la notation B3. |
| 7 | Sécurité SEO | **8/10** | Title 54 car., meta 153 car., 4 H2 en question, ancres justes ; mais 2 H2 sur 4 jumeaux de B4 à un mot près (téléphone l.105, règles l.134) et « Mis à jour le 5 octobre 2026 » sous « 13 mai 2027 » (capture m00). |
| 8 | Mesure | **10/10** | Slug dans `TRACKED_ARTICLES` (l.19), partage `text-only` mesuré, paliers de scroll, ancres séparées, `src=blog-<slug>` via l'entrée CTA. |

**Note globale : 8,6/10** (69/80).
**Après les 15 correctifs ci-dessous et G1 (notation B4) : 10/10 sur les 8 critères.** Aucun ne touche le texte d'une des 19 lignes.

## 2. Top 3 (impact le plus fort)

1. **C11 (règle 1) + C12 (FAQ 1)** : la page interdit de rire de « ses silences » puis propose « tu me passes maman » et « tu répondras « ok » ». Le lecteur qui suit la règle écarte les deux lignes les plus tendres.
2. **C8 + C11 + C12 (différenciation avec B4)** : mêmes H2, mêmes règles, même FAQ 1 à un mot près. Les deux pages sortent sur des requêtes voisines à 3 semaines d'écart : elles doivent se lire comme deux articles.
3. **C2 (« une ou deux phrases »)** : promesse fausse sur 19 lignes sur 19, dans l'excerpt, l'En bref et l'intro, c'est-à-dire tout ce que voit le lecteur avant la n°1.

## 3. Correctifs exacts

Fichier : `docs/copy/articles-forte-frappe/B5-message-drole-fete-des-peres.md`, à reporter en base par l'import `--update`, sauf C14 (config, donné dans la notation B4, C12) et G1 (code, notation B4).

### C1. Sommaire en 2e bloc (critères 1 et 5)

**Avant** (l.47 puis l.49, dans cet ordre) :
```md
Chaque message tient en une ou deux phrases. Après chacun, une ligne en italique te dit où et quand l'envoyer. Il te reste à mettre le mot que tu emploies pour lui (papa, p'pa, le prénom) et, si tu en as un, à ajouter un détail que toi seul connais.

Va direct à ta situation : [Bricolage](#...) · [Barbecue et voiture](#...) · [Appel et répondeur](#que-dire-de-drole-a-son-pere-au-telephone-le-jour-de-la-fete-des-peres) · [Les 4 règles](#comment-ecrire-un-message-drole-de-fete-des-peres-qui-touche-juste). Pour l'anniversaire de ton père, il y a [le message d'anniversaire drôle](/blog/message-anniversaire-drole-par-situation).
```
**Après** (blocs inversés ; 2 ancres mises à jour par C8) :
```md
Va direct à ta situation : [Bricolage](#quel-message-drole-ecrire-a-un-pere-qui-bricole) · [Barbecue et voiture](#quel-message-drole-pour-un-pere-au-barbecue-ou-au-volant) · [Appel et répondeur](#que-dire-de-drole-a-son-pere-au-telephone-ou-sur-son-repondeur) · [Les 4 règles](#comment-ecrire-un-message-drole-de-fete-des-peres-qu-il-gardera). Pour l'anniversaire de ton père, il y a [le message d'anniversaire drôle](/blog/message-anniversaire-drole-par-situation).

Chaque message tient sur un écran de téléphone, avec en dessous l'endroit et le moment où l'envoyer. Il te reste à remplacer « papa » par le mot que tu emploies pour lui (p'pa, son prénom) et à glisser le détail qui n'appartient qu'à vous deux : le nom de l'outil, la route, sa phrase à lui.
```
Pourquoi : le sommaire passe d'environ 120 à environ 85 mots du haut, dans le 1er écran mobile. L'ancienne l.47 était la l.47 d'A1 à 3 mots près ; la nouvelle annonce les détails que la règle 3 demande. « Une ou deux phrases » : voir C2. Formulation distincte de B4 (« Chaque message est court. Sous chacun, une indication en italique »).

### C2. « Une ou deux phrases » devient vrai (critère 5)

| Ligne | Avant | Après |
|---|---|---|
| l.13 (excerpt) | `Un message drôle de fête des pères, c'est une ou deux phrases, un rire qui tombe sur toi...` | `Un message drôle de fête des pères, c'est un texte court, un rire qui tombe sur toi...` |
| l.43 (En bref) | `...de fête des pères tient en une ou deux phrases, fait rire sur toi ou sur la situation...` | `...de fête des pères tient sur un écran de téléphone, fait rire sur toi ou sur la situation...` |
| l.47 | `Chaque message tient en une ou deux phrases.` | voir C1 |

Pourquoi : les 19 lignes font 3 ou 4 phrases (11 en font 4). Trois formules différentes de celles de B3 (« quelques phrases courtes ») et de B4 (« quelques lignes »).

### C3. Accord au féminin de la n°15 (critère 4)

**Avant** (l.116, fin) : `...Envoie-le seul, sans « merci pour hier » devant ni derrière.*`
**Après** : `...Envoie-le seul, sans « merci pour hier » devant ni derrière. Si tu es sa fille : « restée garée ».*`
Pourquoi : seule ligne de B5 accordée au masculin ; le bouton l'envoie telle quelle.

### C4. N°19 : l'indication et le bouton disent la même chose (critère 4)

**Avant** (l.128) : `*→ À raconter, pas à envoyer : à table, au moment du café, en le regardant. Lis-le lentement et garde ton sérieux jusqu'à « quelque chose ».*`
**Après** : `*→ À raconter à table, au moment du café, en le regardant : tu parles de lui, devant lui. Par écrit, envoie-la plutôt dans le groupe de la famille. Garde ton sérieux jusqu'à « quelque chose ».*`
Pourquoi : « pas à envoyer » sous « Envoyer le message n°19 » ; la ligne parle du père à la 3e personne, elle marche aussi dans le groupe familial. « Lis-le » ne convient pas à une phrase dite de mémoire.

### C5. Sortie autodérision sans la phrase d'A1 (critère 5)

**Avant** (l.75) : `Pour garder le rire sur toi, [les blagues d'autodérision](/vannes/theme/autoderision) sont le bon terrain d'entraînement.`
**Après** : `Rater un trou dans le mur et le raconter soi-même, c'est déjà de l'autodérision : [les blagues d'autodérision](/vannes/theme/autoderision) en ont d'autres, avec leur chute et leur décryptage.`
Pourquoi : la phrase est A1 l.130 mot pour mot (B1 l.136 et B4 l.88 en sont des variantes). La nouvelle part de la section (n°4 à 6).

### C6. Barbecue et voiture : des exemples qui existent (critère 5)

**Avant** (l.81, 2e phrase) : `Tu peux sourire de la file d'attente, de tes trajets ou de ton estomac, pas du cuisinier ni du conducteur.`
**Après** : `Tu peux sourire de tes talents au barbecue, de tes trajets ou de l'huile que tu n'as jamais su vérifier, pas du cuisinier ni du conducteur.`
Pourquoi : aucune ligne ne parle de file d'attente ni d'estomac (l'appétit est un ressort de B4, n°19). Les 3 exemples = n°7, n°9, n°10.

### C7. Timing une seule fois, plus de « soirée » pour un barbecue (critère 2)

| Ligne | Avant | Après |
|---|---|---|
| l.101 | `Pour la suite du repas, [les blagues de soirée](/vannes/theme/soirees) ont leur chute et leur décryptage. Et pour comprendre pourquoi une pause avant la chute change tout, [le timing de l'humour](/blog/timing-humour) explique le principe.` | `Au barbecue comme au volant, tout tient dans la pause avant le dernier mot : [le timing de l'humour](/blog/timing-humour) montre où la placer.` |
| l.146 | `**4. Choisis le support avant le texte.** Une phrase sur une carte ne se joue pas comme un vocal. Le SMS arrive le matin, la carte se lit debout, le mot de table se dit lentement. [Le timing de l'humour](/blog/timing-humour) donne la règle de la pause.` | `**4. Choisis le support avant le texte.** Le SMS arrive le matin, la carte se lit debout, le mot de table se dit lentement. Décide d'abord où il la recevra, ensuite la phrase.` |

Pourquoi : les 2 liens timing avaient le même rôle (la pause) ; la sortie de section garde le sien, appuyé sur les indications de la section (pause avant « injuste », « rallumé », « c'était bon »). La 2e phrase de l.101 était A1 l.67 mot pour mot, la 1re phrase de l.146 A1 l.166. Soirées reste dans la liste de fin (l.156) ; la notation B3 (C8) l'avait retiré pour un déjeuner, pour la même raison. Famille sert déjà la table (l.130).

### C8. Deux H2 qui ne sont plus les jumeaux de B4 (critère 7)

| Ligne | Avant | Après | Ancre (`headingId`) |
|---|---|---|---|
| l.105 | `## Que dire de drôle à son père au téléphone le jour de la fête des pères ?` | `## Que dire de drôle à son père au téléphone, ou sur son répondeur ?` | `que-dire-de-drole-a-son-pere-au-telephone-ou-sur-son-repondeur` |
| l.134 | `## Comment écrire un message drôle de fête des pères qui touche juste ?` | `## Comment écrire un message drôle de fête des pères qu'il gardera ?` | `comment-ecrire-un-message-drole-de-fete-des-peres-qu-il-gardera` |

Pourquoi : B4 a `Que dire de drôle à sa mère au téléphone le jour de la fête des mères ?` et `Comment écrire un message drôle de fête des mères qui touche juste ?`. Le 1er H2 gagne « répondeur », propre à B5 (n°16 à 18) et déjà dans le libellé du sommaire ; le 2e reprend ce que les n°17 et 18 disent (« Je l'ai gardé », « je l'encadrerai »). Ancres reportées dans C1. Article non publié ; Grep `apps/web/src` sur les 2 anciennes ancres : 0 test.

### C9. Intro de l'appel : sans éventer la n°19 (critère 5)

**Avant** (l.107) : `Au téléphone, tu n'as que la voix. Les appels de père ont leurs rites (le « qu'est-ce qui se passe ? », le « je te laisse » qui dure vingt minutes) et son répondeur aussi : joue avec, c'est ton public qui les écrit. S'il ne décroche pas, le vocal ou le SMS prend le relais.`
**Après** : `Au téléphone, tu n'as que la voix. Les appels de père ont leurs rites (le haut-parleur, la question d'ouverture, le « ok » en guise de réponse) et son répondeur aussi : joue avec, il les reconnaîtra tout de suite. S'il ne décroche pas, le vocal ou le SMS prend le relais.`
Pourquoi : « qu'est-ce qui se passe ? » est l'accroche de la n°19, citée 20 lignes avant elle ; « c'est ton public qui les écrit » ne se comprend pas ; « je te laisse » est aussi dans l'indication de la n°13 de B4. Les 3 rites = n°13, n°19, n°18.

### C10. Confiance : la promesse de l'encart (critères 5 et 6)

**Avant** (l.130, 2e phrase) : `Et appeler sans raison demande un peu de courage : le [parcours Confiance](/parcours/confiance) est fait pour ça, 20 minutes par semaine pour oser envoyer le message.`
**Après** : `Et si appeler sans raison ne fait pas partie de vos habitudes, le [parcours Confiance](/parcours/confiance) t'aide à reprendre confiance, une conversation à la fois : 20 minutes par semaine.`
Pourquoi : écart signalé par la notation B3 (§6). La promesse est le titre de l'encart Confiance (« Reprends confiance, une conversation à la fois »). Formule distincte de B4 (C7 : « t'aide à reprendre »).

### C11. Règles et « À retenir » propres au père (critère 5)

| Ligne | Avant | Après |
|---|---|---|
| l.136 | `> **À retenir :** Un message drôle réussi est court, vrai et précis. Une phrase drôle suffit : le reste de ton message peut être sincère.` | `> **À retenir :** Un message drôle de fête des pères réussi est court, précis, et ne demande pas de réponse. Le détail juste (l'outil, la route, sa phrase à lui) dit ce que tu n'oserais pas dire en face.` |
| l.138 | `Copier un texte, c'est bien. L'adapter, c'est ce qui le rend à toi. Quatre règles, dans l'ordre :` | `Pour qu'il reconnaisse ta voix dans le message, quatre règles, dans l'ordre :` |
| l.140 | `**1. Le rire tombe sur toi ou sur la situation, pas sur ton père.** Ton incapacité à percer un mur, ta façon de goûter avant qu'il ait fini : tu peux tout te permettre. Son âge, sa santé, son travail, ses silences, jamais.` | `**1. Le rire tombe sur toi ou sur la situation, pas sur ton père.** Le mur que tu ne sais pas percer, l'huile que tu vérifies sans savoir quoi chercher, le carton « à rendre à papa » : tu peux tout te permettre. Son âge, sa santé et son travail, jamais. Ses silences et ses « ok », seulement pour dire que tu y tiens, comme dans les n°14 et 18.` |
| l.142 | `**2. Garde une seule idée par message.** Une situation, une chute, puis, si tu veux, une phrase vraie. Si tu en mets deux, la première gâche la seconde.` | `**2. Garde une seule idée par message.** Une situation, une chute, et s'il le faut une phrase vraie derrière. Le bricolage et la voiture dans le même SMS, ce sont deux blagues qui se marchent dessus.` |

Pourquoi : l.136 est la formule d'A1, B1 et B4 ; « ne demande pas de réponse » reprend la FAQ 2 et la n°18, et la fin rejoint le CTA (« Reste à le dire en face »). l.138 : tic retiré de B3. l.140 : « goûter avant qu'il ait fini » ne renvoie à aucune ligne, et « ses silences, jamais » interdit les n°14 et 18 (et touche la n°11), qui parlent du père peu bavard pour dire qu'on y tient. l.142 : « si tu en mets deux » se lisait « deux phrases vraies ». Ressort distinct de la règle 2 de B4 après sa notation (C9).

### C12. FAQ 1 alignée sur la règle 1, sans le texte d'A1 (critère 5)

**Avant** (l.167) : `Fais rire sur toi ou sur une situation que vous partagez (le bricolage, le trajet, l'appel), jamais sur son âge, sa santé, son travail ou ses silences. Si tu hésites, relis ton message en te mettant à sa place : s'il te fait sourire de l'autre côté, il peut partir. Une phrase drôle suivie d'une phrase sincère passe presque toujours mieux qu'un message uniquement moqueur.`
**Après** : `Fais rire sur toi ou sur une situation que vous partagez (le bricolage, le trajet, l'appel), jamais sur son âge, sa santé ou son travail. S'il parle peu, tu peux en sourire si la phrase finit sur ce que ses mots comptent pour toi, comme un « ok » qu'on encadre. Avant d'envoyer, imagine-le lire ton message à table devant tout le monde : si tu n'as rien à retirer, il peut partir.`
Pourquoi : même contradiction que la règle 1 ; phrases 2-3 identiques dans A1, B3 et B4 (réponse FAQPage en double sur 4 URL). Question inchangée. Texte simple, sans lien.

### C13. Pied de page : la phrase défensive retirée de B3 (critère 5)

**Avant** (l.152, 2e phrase) : `Le reste du catalogue, lui, ne change pas : [toutes les vannes](/vannes) sont rangées par situation.`
**Après** : `Le reste est dans [le catalogue de vannes](/vannes), rangé par situation.`
Pourquoi : correctif C11 de B3, signalé pour B5 par cette même notation (§6). Pied commun du gabarit (A1, B1, B3, B4).

### C14. Parcours recommandé : Confiance (critère 2)

Entrée `"message-drole-fete-des-peres": "confiance"` dans `FORTE_FRAPPE_PARCOURS` : code exact dans `notation-B4-iter1.md`, C12 (une seule modification pour B4, B5, B6). **Le parcours déduit du cluster n'est pas le bon** : Machine à Café (« l'équivalent d'une pause café un peu longue », capture d-bas) parle du bureau. Confiance est le seul parcours que B5 cite (l.130), son encart parle de « reprendre après une pause », et la FAQ 3 vise le lecteur dont la relation est compliquée.

### C15. Lien vers B4 (critère 2)

**Avant** (l.148) : `Si tu cherches un autre format, [les 50 blagues drôles par situation](/blog/meilleures-blagues-droles-2026) couvrent la soirée, le bureau, les dates et la famille, et [les phrases drôles](/blog/phrases-droles-conversations) servent dans toutes les conversations.`
**Après** : `Si tu cherches un autre format, [les 50 blagues drôles par situation](/blog/meilleures-blagues-droles-2026) couvrent la soirée, le bureau, les dates et la famille, et [les phrases drôles](/blog/phrases-droles-conversations) servent dans toutes les conversations. La fête des mères tombe quelques semaines plus tôt : [les messages drôles pour la fête des mères](/blog/message-drole-fete-des-meres) sont prêts aussi.`
Pourquoi : B5 n'est publié que si B4 l'est (condition l.5), et le 13/05 la fête des mères (30/05) n'est pas encore passée : c'est la sortie la plus utile de la page pendant 17 jours. « Quelques semaines » reste vrai chaque année (3 semaines en 2027, 2 si la fête des mères glisse au 1er dimanche de juin). Condition des métadonnées (l.18, « seulement s'il est publié ») remplie par construction : à vérifier en base avant `--update`.

### Récapitulatif

| # | Critère(s) | Lignes / fichier | Test |
|---|---|---|---|
| C1 | 1, 5 | B5 l.47-49 | aucun |
| C2 | 5 | B5 l.13, l.43 | aucun |
| C3 | 4 | B5 l.116 | aucun |
| C4 | 4 | B5 l.128 | aucun |
| C5 | 5 | B5 l.75 | aucun |
| C6 | 5 | B5 l.81 | aucun |
| C7 | 2 | B5 l.101, l.146 | aucun |
| C8 | 7 | B5 l.105, l.134 (+ ancres dans C1) | aucun |
| C9 | 5 | B5 l.107 | aucun |
| C10 | 5, 6 | B5 l.130 | aucun |
| C11 | 5 | B5 l.136-142 | aucun |
| C12 | 5 | B5 l.167 (FAQ) | aucun |
| C13 | 5 | B5 l.152 | aucun |
| C14 | 2 | blog-forte-frappe.ts (notation B4, C12) | voir B4 |
| C15 | 2 | B5 l.148 | aucun |
| G1 | 7 | blog-article-page.ts (notation B4) | voir B4 |

Diff réel attendu (P0 s11) : 21 lignes de contenu touchées sur environ 180 (dont 2 blocs inversés), 0 caractère dans les 19 lignes, le slug, le title, la meta et les questions de FAQ ; 2 H2 changés (C8), assumés : article non publié. Ne pas l'annoncer comme une réécriture. Notes projetées : 10 sur les 8 critères.

## 4. Vérifications demandées

### Répétitions inter-articles (A1, B3, B4)

| Texte de B5 | Déjà dans | Traité par |
|---|---|---|
| « une ou deux phrases » (l.13, l.43, l.47) | B1, B4 (B3 corrigé) | C2, C1 |
| l.47 « Il te reste à mettre [...] un détail que toi seul connais » | A1 l.47 | C1 |
| « Pour garder le rire sur toi [...] bon terrain d'entraînement » (l.75) | A1 l.130, mot pour mot | C5 |
| « pourquoi une pause avant la chute change tout » (l.101) | A1 l.67 | C7 |
| « est fait pour ça [...] pour oser envoyer le message » (l.130) | signalé par notation B3 | C10 |
| « À retenir » (l.136) et tic l.138 | A1, B1, B4 | C11 |
| « Une phrase sur une carte ne se joue pas comme un vocal » (l.146) | A1 l.166, B4 l.173 | C7 |
| « Le reste du catalogue, lui, ne change pas » (l.152) | B3 avant correction | C13 |
| FAQ 1, phrases 2-3 (l.167) | A1, B3, B4 | C12 |

### Différenciation B4 / B5

Après C1, C2, C8, C11 et C12 ici, et C3, C6, C9, C10, C11 de la notation B4 : ouvertures, H2, règles, « À retenir », FAQ 1 et CTA sont propres à chaque article. Restent communs, par choix de gabarit : la structure (sections, indications en italique, pied, liste de thèmes) et les questions FAQ calquées sur chaque requête. Aucune ligne commune ; deux ressorts voisins (silence du répondeur : B4 n°11 / B5 n°16), voir §5.

### SEO

| Point | État | Après correctifs |
|---|---|---|
| Title ≤ 60 car. avec la requête | PASS : 54 car. | inchangé |
| Meta ≤ 155 car. | PASS : 153 car. | inchangée |
| H2 en question | 4 sur 4 ; 2 jumeaux de B4 | PASS (C8) |
| Ancres du sommaire | PASS : 4/4 = `headingId` | 2 recalculées (C1, C8) |
| dateModified | FAIL : 2026-10-05 < 2027-05-13 | PASS (G1) |
| Mots-clés secondaires | « carte », « SMS » présents dans le corps | inchangé |

## 5. Ne comptent pas contre le 10

- **Silence du répondeur (n°16) et silence offert (B4 n°11)** : ressorts voisins, lignes validées toutes deux ; le retrait n'est pas justifié (situations et chutes différentes).
- **Bouton « Envoyer le message n°N » sur les lignes à dire à voix haute (n°3, 5, 6, 8, 10, 11)** : même cas qu'A1 ; l'envoi en SMS reste un usage valable pour la plupart.
- **« À lire ensuite » avec « Comment faire rire une fille »** (capture d-bas) : gabarit commun, voir notation B4 §5.

## 6. Points d'attention (hors note)

- Condition de publication (l.5) : si B5 est fusionné dans B4, ces correctifs restent valables pour la section « père » de la fusion, sauf C8 et C15.
- Relecture @copywriter des textes ajoutés contre `docs/copy/charte-refonte-copy-s11.md`, puis `--update`. Captures avec JS à reprendre après import.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-B5-iter1.md
- Décisions prises : note globale 8,6/10 (69/80) ; 15 correctifs exacts (C1 à C15) + G1 commun (notation B4) pour 10/10, sans toucher aux 19 lignes, au slug, au title, à la meta ni aux questions de FAQ ; parcours Confiance au lieu de Machine à Café ; lien B5 → B4 ajouté.
- Points d'attention : @copywriter applique C1 à C13 et C15 dans le fichier B5 puis `--update` (vérifier B4 publié en base) ; @fullstack applique C14 et G1 avec ceux de B4.
---
