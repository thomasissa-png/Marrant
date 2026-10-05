# A4 : blagues de couple (article à forte frappe s14, publication programmée jeudi 05/11/2026)

> Statut : **final après notation iter1 (`docs/growth/notation-A4-iter1.md`), prêt pour l'import en base** (29 lignes numérotées, humour retenu à l'aveugle en 2 vagues). Non publié, non commité. Gabarit : S9 (`docs/copy/articles-q4/S9-toast-drole-discours-qui-fait-rire.md`) et recette de l'étalon `meilleures-blagues-droles-2026`. Proposition source : `docs/growth/articles-forte-frappe-s14.md` (section 2, n°1 Couple, et section 4).
> Humour : 29 lignes = 23 lignes retenues à l'aveugle (départages `A4-departage.md` et `A4v2-departage.md`, texte dans `A4-candidates.md` et `A4-candidates-vague2.md`) + 6 lignes catalogue F1 à F4, F6 et F7 reprises mot pour mot. La pause « / » des fichiers candidates est rendue par un espace (aucun mot modifié). Les italiques d'usage sont adaptés à chaque ligne retenue.
> **ids utilisés (23)** : H1-1 (n°1) · H2-9 (n°3) · H3-12 (n°4) · H3-13 (n°5) · H3-14 (n°6) · H4-2 (n°8) · H5-8 (n°9) · H6-2 (n°10) · H6-4 (n°11) · H7-2 (n°13) · H9-7 (n°15) · H9-8 (n°16) · H10-12 (n°17) · H11-2 (n°18) · H12-2 (n°19) · H12-5 (n°20) · H13-6 (n°21) · H14-5 (n°22) · H15-7 (n°24) · H16-8 (n°25) · H16-14 (n°26) · H19-3 (n°28) · H20-1 (n°29). Catalogue : F1 (n°2), F2 (n°7), F3 (n°12), F4 (n°14), F6 (n°23), F7 (n°27).
> **Réserve (retenues à l'aveugle ou catalogue, non posées)** : H8-2 (même mécanisme que H1-1 : la règle de couple qui ne se déclenche jamais) · H10-13 (même mécanisme que H11-2 : la feinte polie tenue jusqu'à l'absurde) · F5, `cs14jkee5c537f7286c1da98` (le grand-père qui n'entend rien : la surdité d'un membre de la belle-famille sert de setup, alors que l'article interdit le physique et les membres de la famille ; jugée risquée, passée en réserve selon la notation iter1) · H2-8 (même ressort que F1, faire semblant d'aimer) · H3-7 (l'invité sur le canapé, doublon avec H3-14) · H9-12 (même ressort que H9-7, l'invité trop poli, une seule gardée) · H9-13 (le tutoiement, même gêne que H9-7) · H11-4 (le repas chez eux, doublon de ressort avec H11-2). **Supprimés, sans ligne retenue** : emplacements H17 et H18 (messages), avec leur indication d'usage.
> `[Framework : AIDA allégé (promesse claire, liste par situation, usage de chaque ligne, sorties)]` · `[Conscience : Solution-Aware, le lecteur sait qu'il cherche des blagues à faire à son couple, il ne sait pas lesquelles ni comment les placer sans blesser]`
> Handoff → @orchestrator (puis @seo, @fullstack) : (1) `/blog/humour-saint-valentin` est absent de `blog-articles.ts` : la phrase et le lien sont retirés (le slug n'existe que dans `blog-clusters.ts`) ; (2) volumes de « blagues de couple » à vérifier dans Search Console ; (3) levier J0 : lien « à lire ensuite » dans l'étalon et dans `phrases-droles-conversations`, sur GO Thomas ; (4) import en base (`apps/web/scripts/content/import-article.ts`) : dry-run à lancer depuis `apps/web`, puis `--write` sur GO Thomas, publication programmée le 05/11/2026 ; l'article n'est pas ajouté à `blog-articles.ts` ; (5) C9 de la notation : l'article garde la requête « blagues de couple », la page `/vannes/theme/couple` passe sur « vannes de couple » (`lib/vannes-themes.ts`, code côté @fullstack).

## CTA (pour blog-cta.ts)

Entrée à ajouter dans `apps/web/src/config/blog-cta.ts` (clé = slug), même position et même note que l'étalon :

- **clé** : `blagues-de-couple-drole`
- **title** : Tu as les vannes. Reste à trouver le bon moment.
- **text** : Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours, dont Répartie : de quoi renvoyer la balle quand l'autre te répond du tac au tac.
- **primaryLabel** : Créer mon compte gratuit
- **note** : Gratuit, sans carte. Les vannes de cette page restent en accès libre, compte ou pas.

## Métadonnées

- **slug** : `blagues-de-couple-drole`
- **title** (54 car.) : Blagues de couple : 29 vannes à se dire ou à s'envoyer
- **metaDescription** (151 car.) : 29 blagues de couple pour le canapé, les courses, la belle-famille, les vacances et les messages, chacune avec le bon moment pour la dire ou l'envoyer.
- **excerpt** : Des blagues de couple pour le couple installé, classées par situation du quotidien : le canapé et la télécommande, les courses, le week-end chez les beaux-parents, les vacances, le message à l'autre. Chaque vanne a son mode d'emploi, et le rire tombe sur vous deux, jamais sur l'un des deux.
- **mot-clé principal** : blagues de couple · volume à vérifier dans Search Console (aucun chiffre disponible)
- **mots-clés secondaires** : blague de couple drôle ; blague à envoyer à son copain ; blague à envoyer à sa copine ; humour de couple
- **date de publication** : 2026-11-05 (jeudi ; avancé du 07/01 au 05/11, rythme hebdomadaire validé par Thomas le 05/10 : plus de 3 mois pour se classer avant la Saint-Valentin)
- **category** : CATALOGUE · **readingTime** : 7 min
- **liens internes** : `/blog/meilleures-blagues-droles-2026` · `/blog/autoderision-interactions` · `/blog/timing-humour` · `/blog/comment-raconter-une-blague-sans-la-rater` (lien déjà présent dans l'étalon) · `/blog/phrases-droles-conversations` · `/vannes/theme/couple` · `/vannes/theme/famille` · `/vannes/theme/autoderision` · `/vannes/theme/soirees` · `/parcours/confiance` · `/parcours/repartie` · `/vannes` · `/quiz-humour` · `/conseils` · `/videos` · `/blague-du-jour`
- **cannibalisation** : `humour-saint-valentin` (saison, 14/02) : ni « Saint-Valentin » ni « célibataire » ni « cadeau » dans l'article, aucun lien vers lui (article absent de la base du code). Article des 50 blagues : sa section Date parle de rencontre, pas de couple installé, aucune ligne reprise. Page thème `/vannes/theme/couple` : l'article prend la requête « blagues de couple » et ne lui envoie plus l'ancre exacte (lien « le thème couple du catalogue ») ; la page thème passe sur « vannes de couple » (C9, côté code). 6 lignes du catalogue reprises, doublon voulu, même pratique que S9.
- **décisions fondateur appliquées** : zéro humoriste, zéro concurrent, zéro marque ; vannes catalogue mot pour mot ou lignes neuves validées à l'aveugle uniquement ; aucun chiffre ni étude inventé ; aucune vanne sur le physique ; parcours Confiance et Répartie = 20 minutes par semaine (formule S9) ; quiz = environ 2 minutes, sans inscription (formule de l'étalon)
- **vannes catalogue utilisées (6)** : `cs14jk360d10ea650e662770` (F1) · `cs14jk778d1f9eea5f8ea3a8` (F2) · `cmnz37u510010s60xj40i8lqu` (F3) · `cs14jkb13ecb02394551151e` (F4) · `cs14jkfec1cb933d1931e868` (F6) · `cs14jk18882246f6446df2b7` (F7)
- **objections traitées** : « ça va vexer l'autre » (encadré Le test, section règles, FAQ 1) ; « et si ça tombe à plat » (FAQ 4) ; « je ne veux pas me moquer de ma belle-famille » (section 3, FAQ 3) ; « à quel moment la sortir » (italique d'usage de chaque ligne, FAQ 2)
- **rappel FAQPage** : les 4 questions de la fin sont visibles dans la page, réponses en texte simple, sans lien

---

## Contenu de l'article (markdown importé en base)

> **En bref :** 29 blagues de couple classées par moment du quotidien (canapé, courses, belle-famille, vacances, messages), chacune avec la façon de la dire ou de l'envoyer. Elles tombent sur vous deux ou sur la situation, jamais sur l'un des deux.

Va direct à ton moment : [Canapé](#quelles-blagues-de-couple-faire-sur-le-canape-la-telecommande-la-serie-le-dimanche) · [Courses](#quelles-blagues-pour-les-courses-le-diner-et-le-menage-le-quotidien-a-deux) · [Belle-famille](#comment-rire-du-week-end-chez-les-beaux-parents-sans-froisser-personne) · [Vacances](#quelles-blagues-de-couple-en-vacances-la-valise-la-route-la-location) · [Messages](#quelle-blague-de-couple-envoyer-par-message-dans-la-journee) · [Règles du jeu](#comment-faire-rire-son-couple-sans-blesser-l-autre). Ici, on parle du couple installé, celui qui sait déjà qui a posé la télécommande dans le frigo. Pour les autres situations (soirée, bureau, famille au sens large), les [50 blagues drôles à ressortir](/blog/meilleures-blagues-droles-2026) font le tour. La [blague du jour](/blague-du-jour) change tous les jours, et le [catalogue de vannes](/vannes) range le reste par thème.

Après quelques années à deux, on n'a plus besoin de blagues pour séduire. On en a besoin pour la télécommande, la liste de courses et le week-end chez les beaux-parents. Les meilleures blagues de couple ne se jouent pas sur scène : elles se disent à l'autre, sur le canapé, ou s'envoient entre deux réunions.

> **Le test :** Une blague de couple passe si l'autre pourrait la dire à ta place. Jamais sur le physique, jamais sur un point sensible de l'autre.

---

## Quelles blagues de couple faire sur le canapé ? (la télécommande, la série, le dimanche)

Le canapé est l'endroit où un couple installé passe le plus de temps ensemble sans rien se dire d'important. Ambiance détendue, enjeu nul, et toujours un détail visible à observer : la télécommande, le plaid, le « dernier épisode ». C'est le meilleur terrain pour une première vanne.

**1.** « On a une règle pour la télécommande : elle revient à celui qui s'est levé en dernier. Personne ne s'est levé depuis novembre. »
*→ Dis-la pendant que l'un de vous deux cherche la télécommande, sans lever les yeux de l'écran. Le sérieux fait la moitié du travail.*

**2.** « Je fais semblant d'aimer la série préférée de ma copine depuis deux ans. Ils viennent d'annoncer une saison 5. On a pleuré tous les deux. »
*→ Dis-la tout bas, comme une confession. La chute doit arriver sans que tu souries.*

**3.** « À la fin du film, j'ai dit « j'ai un truc dans l'œil ». Elle a répondu « oui, depuis la bande-annonce ». »
*→ Raconte-la le lendemain d'un film qui vous a un peu émus. Garde un ton neutre, comme un compte rendu.*

**4.** « On s'est interdit les téléphones sur le canapé. Depuis, on vit par terre. »
*→ Dis-la en posant ton téléphone sur la table basse, avec l'air de quelqu'un qui tient sa résolution.*

**5.** « Elle s'est endormie sur moi, la télécommande hors d'atteinte. J'ai appris beaucoup de choses sur le compost. »
*→ À raconter le lendemain, avec le calme de quelqu'un qui n'a pas osé bouger. Ne commente pas la chute.*

**6.** « On a deux plaids : le beau pour les invités, le doux pour nous. Les invités trouvent qu'il fait frais chez nous. »
*→ À glisser avant que des invités arrivent, en rangeant le plaid doux. Sur le ton d'un constat, sans sourire.*

**7.** « Le dimanche, mon copain se lève à 7 h pour profiter de la journée. À 8 h, il l'avait profitée. Il est retourné se coucher. »
*→ À dire le dimanche en fin de matinée, sur un ton admiratif, en regardant l'heure.*

**8.** « Ma copine dit toujours « je ne dors pas, je ferme les yeux ». Elle m'a raconté la fin du film. Ce n'était pas la bonne. C'était mieux. »
*→ À dire un dimanche soir, quand l'un de vous deux ferme les yeux devant l'écran. Reste sérieux, regarde devant toi.*

Il en reste d'autres pour le canapé et la cuisine, chacune avec sa chute et son décryptage : [le thème couple du catalogue](/vannes/theme/couple).

---

## Quelles blagues pour les courses, le dîner et le ménage ? (le quotidien à deux)

Les courses, le dîner et le ménage ne produisent pas de grandes disputes, mais des centaines de petits rituels. Ce sont eux qui font rire, parce que tout le monde les reconnaît dès la première phrase.

**9.** « À la caisse automatique, on s'est disputés pour savoir qui scanne et qui emballe. Un employé est venu. Il a tout scanné lui-même, en silence. »
*→ À dire devant les caisses automatiques ou au retour des courses, sur le ton d'un incident administratif.*

**10.** « Ma copine me demande « t'as envie de quoi ? » à 19 h 30. J'ai envie qu'on ait décidé à 18 h. »
*→ Sors-la au moment où la question « t'as envie de quoi ? » tombe, ou juste après. Le timing fait tout.*

**11.** « On a rempli le frigo de légumes pour manger sain. Depuis dimanche, ils nous regardent dîner. »
*→ À dire en ouvrant le bac à légumes, avec un faux air de reproche.*

**12.** « Mon copain et moi, on a trouvé comment choisir un resto sans se disputer. On se fait livrer et on chuchote, comme si on était sortis. »
*→ Propose-la au moment de choisir, le téléphone déjà dans la main.*

**13.** « J'ai caché mon dessert au fond du frigo. Mon copain l'a retrouvé. Il l'a remis à sa place, vide, par honnêteté. »
*→ À dire en refermant le frigo, le pot vide à la main. L'objet fait la moitié de la chute.*

**14.** « Ma copine a fait un tableau des tâches ménagères avec un code couleur. J'ai le bleu. Il y a rien en bleu. »
*→ Si vous avez un tableau des tâches, montre-le du doigt en la disant. Sinon, dis-la avec la fierté de quelqu'un qui a trouvé la faille.*

Pour rire de toi d'abord, ce qui reste la valeur sûre à deux : [les vannes d'autodérision](/vannes/theme/autoderision).

---

## Comment rire du week-end chez les beaux-parents sans froisser personne ?

Le week-end chez les beaux-parents est une épreuve qu'on traverse à deux, et c'est ce qui la rend drôle. La règle du jeu : on rit de toi, de vous deux, de la situation. Jamais d'un membre de la famille, et jamais devant eux. Ces vannes se disent entre vous, à l'oreille ou sur la route du retour.

**15.** « Chez ses parents, j'ai demandé où poser mon sac. On m'a répondu « où tu veux ». Je l'ai gardé sur le dos jusqu'à dimanche. »
*→ À murmurer à l'autre dans la voiture, avant d'arriver, ou à lui raconter au retour. Ça détend les deux avant de sonner.*

**16.** « Son père a rangé ma bouteille à la cave « pour une grande occasion ». Je pensais que c'en était une. »
*→ À dire à l'autre au retour, sans viser son père : le rire tombe sur toi, qui y avais cru.*

**17.** « Chez ses parents, un coq chante à 5 h. Ils disent tous « on ne l'entend plus ». Moi, on est devenus proches. »
*→ À chuchoter le soir, porte fermée, ou au réveil quand le coq commence. Jamais devant eux.*

**18.** « À table chez ses parents, je mâche très lentement pour avoir l'air de savourer. Ils ont débarrassé, fait le café et sont partis se coucher. Je savoure encore. »
*→ À raconter à l'autre une fois seuls, ou à voix très basse en fin de repas. Jamais assez fort pour que la tablée l'entende.*

**19.** « J'ai un code pour m'échapper chez ses parents : « je vais passer un coup de fil ». En fin de week-end, ils m'ont proposé de me prêter le téléphone fixe. »
*→ À sortir dans la voiture du retour, quand la tension retombe. Une fois seulement.*

**20.** « Au retour de chez ses parents, on a raconté le week-end à des amis, chacun sa version. Dans la mienne, j'ai été très drôle. Dans la sienne, j'étais là. »
*→ À dire dans la voiture du retour, ou devant des amis si l'autre accepte d'en rire avec toi.*

Pour la famille au sens large, celle qu'on n'a pas choisie non plus : [les blagues de famille](/vannes/theme/famille).

---

## Quelles blagues de couple en vacances ? (la valise, la route, la location)

Les vacances à deux, c'est la même personne vingt-quatre heures sur vingt-quatre et une décision à prendre à chaque carrefour. Le rire sert de soupape : il passe mieux avant la dispute que pendant.

**21.** « On a choisi une date importante comme code du cadenas de la valise. J'ai essayé notre rencontre, son anniversaire, le mien. C'était le jour où on avait acheté le cadenas. »
*→ À dire en bouclant la valise, cadenas en main, ou à envoyer à l'autre la veille du départ.*

**22.** « On se dit « plus que vingt minutes » depuis une heure. Ce n'est pas une information. C'est du soutien. »
*→ Dis-la sur la route, quand l'un de vous vient de sortir son « plus que vingt minutes ». Avec douceur, comme un vrai encouragement.*

**23.** « Ma copine nous a acheté deux pulls assortis. On les a mis pour sortir. On a croisé un autre couple avec les mêmes. On a changé de trottoir. »
*→ À dire en sortant les pulls de la valise, ou à envoyer à l'autre avec le mot « assortis » en premier.*

**24.** « La cuisine de la location avait quatorze verres à vin et une seule casserole. On a mangé des pâtes dans un verre à vin, toute la semaine. »
*→ À dire le premier soir, en ouvrant les placards de la location. Elle donne le ton du séjour.*

**25.** « On a envoyé nos 200 photos de vacances à nos amis. Une amie a répondu « la deuxième est top ». »
*→ À sortir au retour, une fois les photos triées. Pas de sourire sur « la deuxième ».*

**26.** « On a pris chacun la photo du même coucher de soleil. Elle a posté la sienne. J'ai gardé la mienne, avec mon doigt. »
*→ Montre la photo d'abord, sans rien dire. La phrase vient quand l'autre a vu le doigt.*

Quand l'autre te renvoie une vanne sur l'itinéraire, il faut pouvoir répondre sur le même ton : c'est le travail du [parcours Répartie](/parcours/repartie), 20 minutes par semaine.

---

## Quelle blague de couple envoyer par message dans la journée ?

Dans un couple installé, les messages sont devenus des raccourcis : « j'arrive », « ok », « on en parle ce soir ». Une blague bien placée entre deux réunions rappelle à l'autre que tu penses à lui sans rien demander. Les lignes ci-dessous s'envoient en message ou se disent le soir, une fois l'écran posé. Pour des phrases à ressortir dans une conversation plus large, [les phrases drôles à ressortir](/blog/phrases-droles-conversations) prennent le relais.

**27.** « Ma copine m'a envoyé son planning de la semaine pour qu'on s'organise. Je suis mercredi, de 19 h à 19 h 30. »
*→ À envoyer en réponse à un planning ou à un agenda qui déborde. Si vous n'en avez pas, dis-la à voix haute, le soir.*

**28.** « Ce soir, on s'est disputés pour la même chose que le mois dernier. Chacun avait amélioré son texte. »
*→ À envoyer ou à dire après le bruit, jamais pendant. Le bon moment, c'est quand le calme est revenu.*

**29.** « Mes deux messages de la semaine : « je t'aime », et « tu as appelé le plombier ? ». Elle a répondu au deuxième d'abord. »
*→ À dire ou à envoyer un jour sans raison, en riant de toi autant que de l'autre. Plus le moment est ordinaire, plus il touche.*

Pour oser envoyer ce genre de message sans le relire dix fois, le [parcours Confiance](/parcours/confiance) demande 20 minutes par semaine.

---

## Comment faire rire son couple sans blesser l'autre ?

Une blague de couple se joue à deux, et les règles tiennent en cinq gestes.

**Fais tomber le rire sur toi d'abord.** L'[autodérision](/blog/autoderision-interactions) est la valeur sûre : si tu es le personnage maladroit de la vanne, l'autre rit sans se sentir visé.

**Choisis le moment.** La même phrase est une pique en pleine dispute et une réconciliation une fois le calme revenu. [Le timing de l'humour](/blog/timing-humour) compte autant que le texte.

**Ne l'explique pas.** Si l'autre ne rit pas, passe à autre chose. Réexpliquer une vanne la tue, c'est la première erreur de [raconter une blague sans la rater](/blog/comment-raconter-une-blague-sans-la-rater).

**Garde le physique hors du jeu.** Et aussi l'argent, ce que l'autre t'a confié et les membres de sa famille : le week-end chez eux est un sujet, eux non. Même gentil, même en riant.

**Adapte avec vos objets.** Les vannes ci-dessus sont des modèles : remplace la télécommande par ce qui traîne vraiment sur votre table basse, et les prénoms par les vôtres.

---

**Tu as fait le tour ?** Une nouvelle vanne arrive chaque jour : [la blague du jour](/blague-du-jour), avec sa chute et son décryptage.

Tu préfères choisir ton thème ?
- [Couple](/vannes/theme/couple)
- [Famille](/vannes/theme/famille)
- [Soirées](/vannes/theme/soirees)
- [Autodérision](/vannes/theme/autoderision)

Pas sûr de ton style d'humour ? [Le quiz « quel type d'humour es-tu ? »](/quiz-humour) prend environ 2 minutes, sans inscription. Faites-le chacun de votre côté, puis comparez.

→ **[Nos conseils d'humour](/conseils)** : les techniques de timing et de répartie.

→ **[Les vidéos](/videos)** : à regarder à deux avant de sortir ta prochaine vanne.

## FAQ

### Quelles blagues de couple peut-on faire sans vexer l'autre ?

Celles qui tombent sur vous deux ou sur une situation que vous partagez (la télécommande, les courses, la valise), avec toi dans le rôle du maladroit. Évite le physique, l'argent, les membres de la famille de l'autre et tout ce qu'il t'a confié en confidence. Un test simple : est-ce que l'autre pourrait la dire à ta place ? Si oui, tu peux la sortir.

### Comment envoyer une blague à son copain ou à sa copine par message ?

Envoie une seule vanne à la fois, courte, telle quelle, sans « mdr » ni explication. Choisis un moment où l'autre a une minute, pas en pleine réunion ni en pleine dispute. Laisse-lui le temps de répondre avant d'ajouter quoi que ce soit : une deuxième blague pour rattraper la première la dessert presque toujours.

### Peut-on faire des blagues sur sa belle-famille ?

Oui, à condition que le rire tombe sur toi, sur vous deux ou sur la situation (être l'invité, les règles qu'on ne connaît pas), jamais sur un membre de la famille de l'autre. Garde ces vannes pour les moments à deux, dans la voiture ou le soir, plutôt qu'à table. Un test : la dirais-tu devant eux sans que personne se raidisse ?

### Que faire si l'autre ne rit pas ?

Ça arrive : la vanne tombe à plat ou le moment n'était pas le bon. Ne l'explique pas et ne la répète pas. Dis « elle était meilleure dans ma tête » et change de sujet. Si c'est le sujet lui-même qui a touché quelque chose, laisse tomber la blague et vérifie simplement que l'autre va bien.
