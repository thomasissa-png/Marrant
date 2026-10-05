# B2 : blagues de gamer (article à forte frappe s14, publication jeudi 26/11/2026)

> Statut : **final après relecture à l'aveugle (`B2-departage.md`), prêt pour l'import en base** (24 lignes numérotées). Non publié, non commité. Gabarit : `A4-blagues-de-couple.md` et recette de l'étalon `meilleures-blagues-droles-2026`. Proposition source : `docs/growth/articles-forte-frappe-s14.md` (section 2, n°10 Gamer, et section 4).
> Humour : 24 lignes = 21 lignes retenues à l'aveugle (texte dans `B2-candidates.md`) + 3 lignes catalogue F1 à F3 reprises mot pour mot. La pause « / » des fichiers candidates est rendue par un espace (aucun mot modifié). Les italiques d'usage sont adaptés à chaque ligne.
> **ids utilisés (21)** : H2-2 (n°2) · H3-2 (n°3) · H2-4 (n°5) · H2-6 (n°6) · H5-5 (n°7) · H7-1 (n°8) · H6-6 (n°9) · H6-5 (n°10) · H8-1 (n°11) · H9-2 (n°12) · H10-3 (n°13) · H11-4 (n°14) · H12-1 (n°15) · H14-1 (n°16) · H14-4 (n°17) · H14-5 (n°19) · H16-2 (n°20) · H16-1 (n°21) · H16-6 (n°22) · H17-3 (n°23) · H19-1 (n°24). Catalogue : F1 (n°1) · F2 (n°4) · F3 (n°18).
> **Réserve (retenues à l'aveugle, non posées)** : H11-5 (même mécanisme que H11-4 : la défaite présentée comme une qualité) · H14-3 (même registre que H14-4 : le père qui regarde ou touche avec douceur ; section Entourage plafonnée à 7 lignes) · H16-4 (même mécanisme que H16-1 : le voisin bienveillant qui suit la partie à travers le mur). **Supprimés, sans ligne retenue** : emplacements H1, H4, H13, H15, H18 et H20, avec leur indication d'usage. Écartée côté catalogue : `cs14jk0ae967eb481a4ecc4f` (la photo du pote, chute sur l'apparence).
> `[Framework : AIDA allégé (promesse claire, liste par situation, usage de chaque ligne, sorties)]` · `[Conscience : Solution-Aware, le lecteur sait qu'il cherche des blagues de gamer, il ne sait pas lesquelles envoyer à sa team ni lesquelles se comprennent sans jouer]`
> Handoff → @orchestrator (puis @seo, @fullstack) : (1) `/blog/comment-raconter-une-blague-sans-la-rater` est le slug réel de `blog-articles.ts` (ligne 1069) ; `/blog/comment-raconter-une-blague-sans-la-rater`, utilisé dans l'étalon, A4 et deux autres articles, n'y est pas un slug : à vérifier côté redirections, sinon lien cassé ; (2) S4 (IA et assistants vocaux) n'est pas dans la base du code : aucun lien vers lui, aucune vanne sur l'IA ; (3) volumes de « blagues de gamer » et « blagues jeux vidéo » à vérifier dans Search Console (aucun chiffre disponible) ; (4) levier J0 : lien « à lire ensuite » dans l'étalon et dans `phrases-droles-conversations`, sur GO Thomas ; (5) import : dry-run depuis `apps/web`, puis `--write` sur GO Thomas, publication programmée le 26/11/2026 ; l'article n'est pas ajouté à `blog-articles.ts` ; (6) la section Nuit blanche ne compte que 2 lignes (H18 et H20 sans retenue) : à enrichir dans une vague 2 si Thomas le demande.

## CTA (pour blog-cta.ts)

Entrée à ajouter dans `apps/web/src/config/blog-cta.ts` (clé = slug), même position et même note que l'étalon :

- **clé** : `blagues-de-gamer-jeux-video`
- **title** : Tu as les vannes. Reste à les sortir en vocal.
- **text** : Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours, dont Répartie : de quoi renvoyer la balle quand ta team te répond du tac au tac.
- **primaryLabel** : Créer mon compte gratuit
- **note** : Gratuit, sans carte. Les vannes de cette page restent en accès libre, compte ou pas.

## Métadonnées

- **slug** : `blagues-de-gamer-jeux-video`
- **title** (54 car.) : Blagues de gamer : 24 vannes pour ta team et tes nuits
- **metaDescription** (149 car.) : 24 blagues de gamer et de jeux vidéo pour la partie en ligne, le vocal, la défaite, l'entourage et la nuit blanche, avec le bon moment pour les dire.
- **excerpt** : 24 blagues de gamer classées par moment : la partie en ligne, le vocal avec la team, la défaite, l'entourage qui ne comprend pas, la nuit blanche. Chaque vanne a son mode d'emploi, se comprend sans connaître le jeu, et le rire tombe sur toi ou sur la situation, jamais sur le niveau d'un coéquipier.
- **mot-clé principal** : blagues de gamer · volume à vérifier dans Search Console (aucun chiffre disponible)
- **mots-clés secondaires** : blagues jeux vidéo ; blague de gamer drôle ; blague à envoyer à sa team ; humour de gamer
- **date de publication** : 2026-11-26 (jeudi)
- **category** : CATALOGUE · **readingTime** : 5 min
- **liens internes** : `/blog/meilleures-blagues-droles-2026` · `/blog/autoderision-interactions` · `/blog/timing-humour` · `/blog/comment-raconter-une-blague-sans-la-rater` · `/vannes/theme/gaming` · `/vannes/theme/autoderision` · `/vannes/theme/soirees` · `/vannes/theme/famille` · `/parcours/confiance` · `/parcours/repartie` · `/vannes` · `/quiz-humour` · `/conseils` · `/videos` · `/blague-du-jour`
- **cannibalisation** : S4 (IA et assistants vocaux) : ni « IA » ni « assistant » dans l'article, aucun lien vers lui (absent de la base du code). Article des 50 blagues : il ne contient aucune vanne de gamer (seulement le lien vers `/vannes/theme/gaming`), aucune ligne reprise. Article couple A4 : aucune ligne de couple dans B2, pas de recoupement. Page thème `/vannes/theme/gaming` : l'article sélectionne par situation et ne remplace pas la page (3 lignes du catalogue reprises, doublon voulu, même pratique que S9 et A4). Arbitrage Thomas 05/10 : la page thème (`vannes-themes.ts`, textes validés [CHOIX UTILISATEUR]) n'est pas modifiée ; la différence est portée par l'article (intro « moment + façon de la sortir », H2 des sections En ligne et Nuit blanche en « que dire / que raconter », sortie vers la page thème en ancre descriptive « thème gaming du catalogue »).
- **décisions fondateur appliquées** : zéro humoriste, zéro concurrent, zéro marque, aucun nom de jeu ni de console ; vannes catalogue mot pour mot ou lignes neuves validées à l'aveugle uniquement ; aucun chiffre ni étude inventé ; aucune vanne sur le physique ni sur le niveau d'un joueur identifiable ; parcours Confiance et Répartie = 20 minutes par semaine (formule S9 et A4) ; quiz = environ 2 minutes, sans inscription (formule de l'étalon)
- **vannes catalogue utilisées (3)** : `cmmnsqn15006kth63res9rqp9` (F1) · `cs14jk28b5acf3a95217071c` (F2) · `cs14jkb81aae613b293f204b` (F3)
- **objections traitées** : « ça va vexer un coéquipier » (encadré Le test, section règles, FAQ 1) ; « mon entourage ne joue pas, il ne comprendra pas » (section 4, FAQ 2) ; « ça va tomber à plat en vocal » (italique d'usage de chaque ligne, FAQ 3 et 4) ; « les blagues de gamer, je les connais déjà » (lignes inédites, règle 5)
- **rappel FAQPage** : les 4 questions de la fin sont visibles dans la page, réponses en texte simple, sans lien

---

## Contenu de l'article (markdown importé en base)

> **En bref :** 24 blagues de gamer classées par moment (la partie en ligne, le vocal, la défaite, l'entourage, la nuit blanche), chacune avec la façon de la dire ou de l'envoyer. Elles partent d'un détail vécu et le rire tombe sur toi ou sur la situation, jamais sur le niveau d'un coéquipier.

Va direct à ton moment : [En ligne](#que-dire-quand-la-partie-en-ligne-n-a-pas-commence-le-telechargement-le-pseudo-la-connexion-les-mods) · [Vocal](#quelles-blagues-de-jeux-video-en-vocal-avec-ta-team-le-micro-les-ordres-les-departs) · [Défaite](#comment-rire-de-sa-defaite-avec-ses-potes-l-excuse-le-materiel-la-serie-noire-le-debrief) · [Entourage](#quelles-blagues-de-gamer-quand-l-entourage-ne-comprend-pas-parents-voisins-coloc-grand-mere) · [Nuit blanche](#que-raconter-apres-une-nuit-blanche-de-gamer-la-regle-de-minuit-le-lever-du-jour) · [Règles du jeu](#comment-faire-une-blague-de-gamer-sans-vexer-ta-team). Pour les autres situations (soirée, bureau, famille, date), les [50 blagues drôles à ressortir](/blog/meilleures-blagues-droles-2026) font le tour. Ici, on parle de ceux qui jouent, et de ceux qui les regardent jouer. La [blague du jour](/blague-du-jour) change tous les jours, et le [catalogue de vannes](/vannes) range le reste par thème.

Le gamer n'a pas besoin de blagues pour la partie : elle fournit déjà de quoi rire. Il en a besoin pour ce qui l'entoure : le vocal où la mère de quelqu'un dit bonsoir, la défaite qu'il rejoue en réunion, la voisine qui entend un seul côté de la conversation. Les meilleures blagues de jeux vidéo ne parlent pas du jeu. Elles parlent de ce qu'on fait pendant, et de ce que les autres en pensent. Ici, chaque vanne vient avec son moment et sa façon de la sortir à ta team.

> **Le test :** Une blague de gamer passe si ta team pourrait la dire à ta place et si quelqu'un qui ne joue jamais en comprend la chute.

---

## Que dire quand la partie en ligne n'a pas commencé ? (le téléchargement, le pseudo, la connexion, les mods)

Une partie en ligne commence rarement par une partie. Il y a le téléchargement qui n'avance pas, le pseudo dont on ne se débarrasse plus, la box qui clignote, le jeu qu'on ne lance plus. Ce sont ces moments creux qui font rire, parce que tous les joueurs les ont vécus et qu'aucun ne les raconte.

**1.** « J'ai installé un jeu de 120 Go. J'y ai joué 20 minutes. C'était nul. Je l'ai pas désinstallé. On a fait le téléchargement ensemble. »
*→ À dire en regardant la barre de téléchargement, avec la tendresse de quelqu'un qui garde un souvenir. Appuie à peine sur « ensemble ».*

**2.** « Mon pseudo était pris. Le deuxième aussi. Le troisième aussi. Je suis maintenant mon prénom et huit chiffres. Les gens me prennent pour un dossier. »
*→ À dire en tapant un pseudo dans un formulaire, ou à envoyer à la team le jour d'une inscription. Ton résigné, sans sourire.*

**3.** « Quand la connexion coupe, je débranche la box, je compte jusqu'à dix et je la rebranche. Je ne sais pas pourquoi dix. Je ne prends pas de risque. »
*→ À dire en regardant la box, ou à envoyer dès que la connexion revient. La dernière phrase se dit comme un aveu.*

**4.** « J'ai passé six heures à installer des mods pour embellir mon jeu. Il ne se lance plus, mais le message d'erreur est en 4K. »
*→ À dire sur un ton de fierté technique, juste après avoir regardé l'écran d'erreur. La chute doit arriver sans que tu bouges.*

**5.** « Je change de pseudo quand je perds trop. Je suis maintenant quarante-deux personnes, toutes mauvaises. »
*→ À dire à la team en créant ton nouveau pseudo. Laisse le chiffre faire le travail.*

**6.** « J'ai pris le nom de mon premier chat comme pseudo. Dix ans qu'on l'insulte à ma place. Il n'a rien fait. »
*→ À raconter quand on te demande d'où vient ton pseudo, avec la gravité d'un avocat. Garde « Il n'a rien fait » pour après un silence.*

Les vannes n°1 et n°4 viennent du [thème gaming du catalogue](/vannes/theme/gaming), où chacune a sa propre fiche.

---

## Quelles blagues de jeux vidéo en vocal avec ta team ? (le micro, les ordres, les départs)

Le vocal est un salon où cinq personnes partagent la même partie et rien d'autre. Un bruit de fond, une phrase d'organisation qui ne veut rien dire, un « je reviens » qui dure : le rire vient de ce que tout le monde entend et que personne n'ose dire. La règle du jeu : on rit de la situation et de soi, jamais d'un équipier qui est là pour l'entendre.

**7.** « Ma mère a passé la tête dans ma chambre et dit « bonsoir à tous ». Quatre hommes de trente ans ont répondu « bonsoir madame ». »
*→ À raconter à la team après la partie, ou à envoyer le lendemain. Ne commente pas les « quatre hommes ».*

**8.** « Dix minutes à se répartir les rôles, huit minutes de partie. L'organisation était excellente. »
*→ À sortir juste après la partie, sur le ton d'un compte rendu, quand l'équipe vient de se mettre d'accord pour la troisième fois.*

**9.** « Dans l'équipe, j'ai le rôle de celui qui protège les autres. On m'a dit « merci » une fois. C'était pour quelqu'un d'autre. »
*→ À dire en vocal quand la team se remercie après une manche, sur un ton de constat. « C'était pour quelqu'un d'autre » se dit plus bas.*

**10.** « Mon coéquipier me dit « pas grave » chaque fois que je meurs. Il le dit de plus en plus doucement. »
*→ À dire après une série de défaites, avec reconnaissance. Le rire tombe sur toi qui meurs, pas sur lui qui s'use.*

**11.** « Mon pote a dit « je vais chercher à boire, deux minutes ». On a fini la partie. Il est revenu avec un sandwich et une douche. »
*→ À dire quand un pote part en pleine partie, ou le lendemain, pour rire de la situation. Tout le monde l'a déjà fait, ne vise personne.*

Quand ta team te renvoie une vanne et qu'il faut répondre sur le même ton, c'est le travail du [parcours Répartie](/parcours/repartie), 20 minutes par semaine.

---

## Comment rire de sa défaite avec ses potes ? (l'excuse, le matériel, la série noire, le débrief)

La défaite est le moment où un gamer devient le plus drôle, à condition de rire le premier, avant que les autres s'en chargent. Les lignes ci-dessous rient de ton excuse, de ton matériel et de ta série noire, pas du score de quelqu'un d'autre.

**12.** « J'ai dit « le soleil m'éblouissait » en perdant. Il était 23 h 40. Personne n'a relevé, par pudeur. »
*→ À dire juste après la défaite, sur un ton de plaidoirie, ou à envoyer à la team le lendemain.*

**13.** « Ma chaise « de gamer » a coûté plus cher que mon canapé. Je perds maintenant avec le dos droit. »
*→ À dire en tapotant l'accoudoir, ou à envoyer avec le mot « investissement ».*

**14.** « Mon classement baisse tous les jours, très régulièrement. C'est la courbe la plus stable de ma vie. »
*→ À dire en regardant ton classement, avant que quelqu'un d'autre le remarque. Ton de bilan trimestriel.*

**15.** « Le lendemain d'une défaite, je la rejoue dans ma tête pendant la réunion. J'ai gagné quatre fois. On m'a demandé si j'étais d'accord. »
*→ À raconter le lendemain d'une défaite, dans le vocal ou à la machine à café.*

Rire de toi d'abord, c'est la valeur sûre dans toutes les situations : [les vannes d'autodérision](/vannes/theme/autoderision).

---

## Quelles blagues de gamer quand l'entourage ne comprend pas ? (parents, voisins, coloc, grand-mère)

Un gamer vit rarement seul avec son écran : il y a le parent qui passe derrière lui, le voisin qui entend à travers le mur, la coloc qui reconnaît sa victoire au bruit de la chaise. Ces vannes se comprennent sans jamais avoir tenu une manette, et elles se disent à ceux qui ne jouent pas. Le rire tombe sur toi, sur ta façon d'expliquer ce que tu fais, jamais sur eux.

**16.** « Mon père a regardé ma partie dix minutes en silence. Il m'a demandé « et c'est toi, le gentil ? ». J'ai dit oui. Je n'en étais plus sûr. »
*→ À raconter après un repas de famille, sur un ton hésitant. Marque un temps avant « Je n'en étais plus sûr ».*

**17.** « Mon père a tenu la manette trente secondes. Il me l'a rendue comme on rend un oiseau. »
*→ À dire en tendant une manette à quelqu'un qui ne joue jamais, ou à raconter après, les mains en coupe.*

**18.** « Ma grand-mère est niveau 4 812 dans son jeu de bonbons. Je suis niveau 60 dans mon jeu de rôle. Elle m'a dit « c'est un bon début ». »
*→ À raconter en famille, avec une fierté mal placée. Laisse la dernière phrase seule, sans sourire.*

**19.** « Ma mère dit à ses amies que je travaille sur ordinateur toute la nuit. Elle ne ment pas. Elle ne précise pas. »
*→ À raconter à la team ou à la famille, sur le ton de quelqu'un qui accepte sa place.*

**20.** « Mon voisin a tapé au plafond à minuit. J'ai baissé le son du jeu. Il a retapé. C'était donc moi. »
*→ À raconter le lendemain, comme une enquête enfin résolue. Dis « c'était donc moi » à plat.*

**21.** « Je parle à voix haute quand je joue. Ma voisine n'entend que moi. Elle m'a laissé un gâteau devant la porte. Je ne sais pas ce qu'elle a compris. »
*→ À dire à un voisin ou à une coloc le lendemain, pour rire de la scène sans t'excuser.*

**22.** « Ma coloc sait si j'ai gagné au bruit de ma chaise. Pour les défaites, elle prépare du thé. »
*→ À dire à ta coloc, ou à raconter à la team, sur un ton complice. Le thé est la chute : ne la souligne pas.*

Pour la famille au sens large, celle qui regarde par-dessus ton épaule : [les blagues de famille](/vannes/theme/famille).

---

## Que raconter après une nuit blanche de gamer ? (la règle de minuit, le lever du jour)

La nuit blanche est la part du gamer qu'il avoue le moins et dont il rit le mieux : la règle qu'on se fixe en début de soirée et l'heure où on remarque que le jour s'est levé. Ces vannes se racontent le matin, de préférence avec un café, et jamais en se vantant.

**23.** « Chaque soir, je me dis « minuit, pas plus tard ». À 21 h, je suis sincère. »
*→ À envoyer à la team en début de soirée, avant la première partie. Elle se relit toute seule vers minuit.*

**24.** « Vers 6 h, les oiseaux se sont mis à chanter. J'ai pris ça pour la musique de fin. »
*→ À raconter le matin, au retour de la nuit, ou à envoyer à la team qui a tenu aussi.*

Pour oser sortir ces vannes au bon moment, le [parcours Confiance](/parcours/confiance) demande 20 minutes par semaine.

---

## Comment faire une blague de gamer sans vexer ta team ?

Une blague de gamer se joue à plusieurs, et les règles tiennent en cinq gestes.

**Fais tomber le rire sur toi d'abord.** L'[autodérision](/blog/autoderision-interactions) est la valeur sûre : si tu es le joueur qui perd, qui s'endort ou qui n'a pas compris le plan, les autres rient sans se sentir visés.

**Choisis le moment.** La même phrase est une pique en pleine manche et une complicité entre deux parties. [Le timing de l'humour](/blog/timing-humour) compte autant que le texte : attends l'attente, la défaite ou la pause.

**Reste court en vocal.** Une phrase, un silence, et on enchaîne. Si la team ne rit pas, passe à autre chose : réexpliquer une vanne la tue, c'est la première erreur de [raconter une blague sans la rater](/blog/comment-raconter-une-blague-sans-la-rater).

**Laisse le niveau des autres hors du jeu.** Un équipier qui joue mal le sait déjà. Rire de son score, de son pseudo ou de sa voix, même gentiment, ne fait rire que toi.

**Adapte avec tes détails.** Les vannes ci-dessus sont des modèles : remplace la box par ce qui te lâche vraiment, les prénoms par les vôtres, l'heure par celle où tu t'arrêtes. Les formules que toute la team connaît déjà ne font plus rire ; un détail à toi, si.

---

**Tu as fait le tour ?** Une nouvelle vanne arrive chaque jour : [la blague du jour](/blague-du-jour), avec sa chute et son décryptage.

Tu préfères choisir ton thème ?
- [Gaming](/vannes/theme/gaming)
- [Autodérision](/vannes/theme/autoderision)
- [Soirées](/vannes/theme/soirees)
- [Famille](/vannes/theme/famille)

Pas sûr de ton style d'humour ? [Le quiz « quel type d'humour es-tu ? »](/quiz-humour) prend environ 2 minutes, sans inscription. Envoie-le à ta team, puis comparez.

→ **[Nos conseils d'humour](/conseils)** : les techniques de timing et de répartie.

→ **[Les vidéos](/videos)** : à regarder avant de sortir ta prochaine vanne.

## FAQ

### Quelles blagues de gamer peut-on faire sans vexer un coéquipier ?

Celles qui tombent sur toi ou sur une situation que toute la team connaît (le téléchargement, le micro ouvert, la défaite), avec toi dans le rôle du joueur qui rate. Évite le niveau de jeu, le pseudo ou la voix d'un équipier précis. Un test simple : est-ce qu'il pourrait la dire à ta place ? Si oui, tu peux la sortir.

### Comment faire une blague de gamer à quelqu'un qui ne joue pas ?

Pars de la situation, pas du jargon : la nuit qui s'allonge, la voisine qui entend un seul côté de la conversation, le père qui tient la manette trente secondes. Les vannes de la section sur l'entourage se comprennent sans connaître aucun jeu. Si tu dois expliquer un mot, change de blague.

### Quand placer une blague en vocal sans couper la partie ?

Pendant l'attente avant la partie, entre deux manches, juste après une défaite ou quand le silence s'installe. Évite la phase où tout le monde se concentre. Une phrase suffit : dis-la sans commentaire et laisse la team réagir, ou enchaîner.

### Que faire si la blague tombe à plat en vocal ?

Ça arrive : le micro était coupé, le moment n'était pas le bon, ou la team était en pleine action. Ne l'explique pas et ne la répète pas. Dis « elle était meilleure dans ma tête » et reviens à la partie. Si le sujet lui-même a touché quelqu'un, laisse tomber la blague et vérifie simplement que tout va bien.
