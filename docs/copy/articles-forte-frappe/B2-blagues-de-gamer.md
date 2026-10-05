# B2 : blagues de gamer (article à forte frappe s14, publication jeudi 26/11/2026)

> Statut : **brouillon à emplacements, en attente de la relecture à l'aveugle** (20 emplacements `[H1]` à `[H20]` à remplir avec une ligne retenue parmi les 6 candidates de `B2-candidates.md`, 3 lignes catalogue `[F1]` à `[F3]` reprises mot pour mot). Non publié, non commité. Gabarit : `A4-blagues-de-couple.md` et recette de l'étalon `meilleures-blagues-droles-2026`. Proposition source : `docs/growth/articles-forte-frappe-s14.md` (section 2, n°10 Gamer, et section 4).
> `[Framework : AIDA allégé (promesse claire, liste par situation, usage de chaque ligne, sorties)]` · `[Conscience : Solution-Aware, le lecteur sait qu'il cherche des blagues de gamer, il ne sait pas lesquelles envoyer à sa team ni lesquelles se comprennent sans jouer]`
> **Italiques d'usage** : chaque emplacement porte une indication `[USAGE : ...]` provisoire, à réécrire en italique `*→ ...*` une fois la ligne retenue (comme dans A4). Les 3 lignes catalogue ont déjà leur italique.
> **Écart assumé** : la proposition parlait de « 12 vannes » ; le plan en compte 23 (barre avant volume : 10 à 20 lignes validées minimum, plafond du plan si le taux de passage est faible : 10 lignes). Le titre et le meta ne citent aucun nombre, pour rester vrais quel que soit le nombre de lignes retenues. Un emplacement sans candidate retenue est supprimé, la numérotation est refaite.
> Handoff → @orchestrator (puis @seo, @fullstack) : (1) `/blog/raconter-blague-sans-massacrer` est le slug réel de `blog-articles.ts` (l'étalon et A4 pointent `/blog/comment-raconter-une-blague-sans-la-rater` : à vérifier côté redirections) ; (2) S4 (IA et assistants vocaux) n'est pas dans la base du code : aucun lien vers lui, aucune vanne sur l'IA ; (3) volumes de « blagues de gamer » et « blagues jeux vidéo » à vérifier dans Search Console (aucun chiffre disponible) ; (4) levier J0 : lien « à lire ensuite » dans l'étalon et dans `phrases-droles-conversations`, sur GO Thomas ; (5) import : dry-run depuis `apps/web`, puis `--write` sur GO Thomas.

## Métadonnées

- **slug** : `blagues-de-gamer-jeux-video`
- **title** (55 car.) : Blagues de gamer : des vannes pour ta team et tes nuits
- **metaDescription** (environ 145 car.) : Blagues de gamer et de jeux vidéo pour la partie en ligne, le vocal, la défaite, l'entourage et la nuit blanche : des vannes à envoyer à ta team.
- **excerpt** : Des blagues de gamer classées par moment : la partie en ligne, le vocal avec la team, la défaite, l'entourage qui ne comprend pas, la nuit blanche. Chaque vanne a son mode d'emploi, se comprend sans connaître le jeu, et le rire tombe sur toi ou sur la situation, jamais sur le niveau d'un coéquipier.
- **mot-clé principal** : blagues de gamer · volume à vérifier dans Search Console (aucun chiffre disponible)
- **mots-clés secondaires** : blagues jeux vidéo ; blague de gamer drôle ; blague à envoyer à sa team ; humour de gamer
- **date de publication** : 2026-11-26 (jeudi)
- **category** : CATALOGUE · **readingTime** : 6 min
- **liens internes** : `/blog/meilleures-blagues-droles-2026` · `/blog/autoderision-interactions` · `/blog/timing-humour` · `/blog/raconter-blague-sans-massacrer` · `/blog/phrases-droles-conversations` · `/vannes/theme/gaming` · `/vannes/theme/autoderision` · `/vannes/theme/soirees` · `/vannes/theme/famille` · `/vannes/theme/couple` · `/parcours/confiance` · `/parcours/repartie` · `/vannes` · `/quiz-humour` · `/conseils` · `/videos` · `/blague-du-jour`
- **cannibalisation** : S4 (IA et assistants vocaux) : ni « IA » ni « assistant » dans l'article, aucun lien vers lui (absent de la base du code). Article des 50 blagues : il ne contient aucune vanne de gamer (seulement le lien vers `/vannes/theme/gaming`), aucune ligne reprise. Article couple A4 : la section 4 touche le couple de gamer (une ligne ou deux), pas de recoupement de lignes. Page thème `/vannes/theme/gaming` : l'article sélectionne par situation et ne remplace pas la page (3 lignes du catalogue reprises, doublon voulu, même pratique que S9 et A4).
- **décisions fondateur appliquées** : zéro humoriste, zéro concurrent, zéro marque, aucun nom de jeu ni de console ; vannes catalogue mot pour mot ou lignes neuves validées à l'aveugle uniquement ; aucun chiffre ni étude inventé ; aucune vanne sur le physique ni sur le niveau d'un joueur identifiable ; parcours Confiance et Répartie = 20 minutes par semaine (formule S9 et A4) ; quiz = environ 2 minutes, sans inscription (formule de l'étalon)
- **vannes catalogue utilisées (3)** : `cmmnsqn15006kth63res9rqp9` (F1) · `cs14jk28b5acf3a95217071c` (F2) · `cs14jkb81aae613b293f204b` (F3). Écartée : `cs14jk0ae967eb481a4ecc4f` (la photo du pote, chute sur l'apparence).
- **objections traitées** : « ça va vexer un coéquipier » (encadré Le test, section règles, FAQ 1) ; « mon entourage ne joue pas, il ne comprendra pas » (section 4, FAQ 2) ; « ça va tomber à plat en vocal » (italique d'usage de chaque ligne, FAQ 3 et 4) ; « les blagues de gamer, je les connais déjà » (lignes inédites, règle 5)
- **rappel FAQPage** : les 4 questions de la fin sont visibles dans la page, réponses en texte simple, sans lien

---

## Contenu de l'article (markdown, format `content` de `blog-articles.ts`)

> **En bref :** Une blague de gamer marche quand elle part d'un détail vécu (la mise à jour, le micro ouvert, la défaite, la nuit qui s'allonge) et que le rire tombe sur toi ou sur la situation, jamais sur le niveau d'un coéquipier. Voici des vannes classées par moment (en ligne, en vocal, la défaite, l'entourage, la nuit blanche), avec pour chacune la façon de la dire ou de l'envoyer.

Le gamer n'a pas besoin de blagues pour la partie : elle fournit déjà de quoi rire. Il en a besoin pour ce qui l'entoure : le vocal où quelqu'un mange, la défaite qu'il rejoue en réunion, la voisine qui entend un seul côté de la conversation. Les meilleures blagues de jeux vidéo ne parlent pas du jeu. Elles parlent de ce qu'on fait pendant, et de ce que les autres en pensent.

Va direct à ton moment : [En ligne](#quelles-blagues-de-gamer-pour-une-partie-en-ligne-la-mise-a-jour-le-pseudo-la-connexion-l-attente) · [Vocal](#quelles-blagues-de-jeux-video-en-vocal-avec-ta-team-le-micro-les-ordres-les-departs) · [Défaite](#comment-rire-de-sa-defaite-avec-ses-potes-l-excuse-le-materiel-la-serie-noire-le-debrief) · [Entourage](#quelles-blagues-de-gamer-quand-l-entourage-ne-comprend-pas-couple-parents-enfants-voisins) · [Nuit blanche](#quelles-blagues-de-gamer-pour-la-nuit-blanche-3-h-du-matin-s-arreter-le-lever-du-jour-le-bureau) · [Règles du jeu](#comment-faire-une-blague-de-gamer-sans-vexer-ta-team). Pour les autres situations (soirée, bureau, famille, date), les [50 blagues drôles à ressortir](/blog/meilleures-blagues-droles-2026) font le tour. Ici, on parle de ceux qui jouent, et de ceux qui les regardent jouer.

> **Le test :** Une blague de gamer passe si ta team pourrait la dire à ta place et si quelqu'un qui ne joue jamais en comprend la chute. Elle tombe sur toi ou sur la situation, jamais sur le niveau d'un coéquipier.

Une nouvelle vanne arrive chaque jour avec [la blague du jour](/blague-du-jour), et le [catalogue de vannes](/vannes) range le reste par thème.

---

## Quelles blagues de gamer pour une partie en ligne ? (la mise à jour, le pseudo, la connexion, l'attente)

Une partie en ligne commence rarement par une partie. Il y a la mise à jour, le pseudo qu'on a choisi à quatorze ans, la box qui clignote, l'attente dans le salon. Ce sont ces moments creux qui font rire, parce que tous les joueurs les ont vécus et qu'aucun ne les raconte.

**1.** [H1]
*[USAGE : à dire ou à envoyer à la team pendant la mise à jour, sur le ton d'un constat, sans sourire.]*

**2.** « J'ai installé un jeu de 120 Go. J'y ai joué 20 minutes. C'était nul. Je l'ai pas désinstallé. On a fait le téléchargement ensemble. »
*→ À dire en regardant la barre de téléchargement, avec la tendresse de quelqu'un qui garde un souvenir. Ne commente pas la dernière phrase.*

**3.** [H2]
*[USAGE : à dire quand quelqu'un demande un pseudo, ou à envoyer à la team le jour d'une inscription.]*

**4.** [H3]
*[USAGE : à dire en regardant la box, ou à envoyer dès que la connexion revient.]*

**5.** « J'ai passé six heures à installer des mods pour embellir mon jeu. Il ne se lance plus, mais le message d'erreur est en 4K. »
*→ À dire sur un ton de fierté technique, juste après avoir regardé l'écran d'erreur. La chute doit arriver sans que tu bouges.*

**6.** [H4]
*[USAGE : à dire dans l'attente avant la partie, ou à envoyer à la team qui attend le dernier joueur.]*

Pour d'autres lignes de gamer, avec leur chute et leur décryptage : [les blagues de gamer](/vannes/theme/gaming).

---

## Quelles blagues de jeux vidéo en vocal avec ta team ? (le micro, les ordres, les départs)

Le vocal est un salon où cinq personnes partagent la même partie et rien d'autre. Un bruit de fond, une phrase d'organisation qui ne veut rien dire, un « je reviens » qui dure : le rire vient de ce que tout le monde entend et que personne n'ose dire. La règle du jeu : on rit de la situation et de soi, jamais d'un équipier qui est là pour l'entendre.

**7.** [H5]
*[USAGE : à dire pendant une pause de la partie, quand le bruit de fond se fait entendre, ou à raconter après.]*

**8.** [H6]
*[USAGE : à dire en vocal, sur un ton d'admiration ou de constat, sans viser un équipier précis.]*

**9.** [H7]
*[USAGE : à sortir avant le début de la partie, quand l'équipe se met d'accord.]*

**10.** [H8]
*[USAGE : à dire quand un pote part en pleine partie, ou le lendemain, pour rire de la situation.]*

Quand ta team te renvoie une vanne et qu'il faut répondre sur le même ton, c'est le travail du [parcours Répartie](/parcours/repartie), 20 minutes par semaine.

---

## Comment rire de sa défaite avec ses potes ? (l'excuse, le matériel, la série noire, le débrief)

La défaite est le moment où un gamer devient le plus drôle, à condition de rire le premier. Avant que les autres s'en chargent, tu peux t'en charger toi. Les lignes ci-dessous rient de ton excuse, de ton matériel et de ta série noire, pas du score de quelqu'un d'autre.

**11.** [H9]
*[USAGE : à dire juste après la défaite, sur un ton de plaidoirie, ou à envoyer à la team le lendemain.]*

**12.** [H10]
*[USAGE : à dire en montrant ton matériel du doigt, ou à envoyer avec le mot « investissement ».]*

**13.** [H11]
*[USAGE : à dire après une série de défaites, sans attendre que quelqu'un d'autre le dise.]*

**14.** [H12]
*[USAGE : à raconter le lendemain d'une défaite, dans le vocal ou à la machine à café.]*

Rire de toi d'abord, c'est la valeur sûre dans toutes les situations : [les vannes d'autodérision](/vannes/theme/autoderision).

---

<!-- SUITE -->
