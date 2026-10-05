# B6 : blagues de vacances entre amis (article à forte frappe s14, publication programmée jeudi 03/06/2027)

> Statut : **final, prêt pour l'import en base** (20 lignes numérotées, humour retenu à l'aveugle). Non publié, non commité. Gabarit : `A4-blagues-de-couple.md`. Étalon : `meilleures-blagues-droles-2026`. Proposition source : `docs/growth/articles-forte-frappe-s14.md` (section 2, n°7 Vacances, et section 4).
> `[Framework : AIDA allégé (promesse claire, liste par situation, usage de chaque ligne, sorties)]` · `[Conscience : Solution-Aware, le lecteur sait qu'il veut une blague pour son groupe de départ, il ne sait pas laquelle ni comment la placer sans froisser personne]`
> Humour : **20 lignes retenues à l'aveugle** (23 retenues au départage `B6-departage.md`, texte dans `B6-candidates.md`, 3 mises en réserve), recopiées mot pour mot. La pause « / » des fichiers candidates est rendue par un espace (aucun mot modifié). Aucune ligne du catalogue reprise (la vanne du GPS est déjà dans S4 ; d'autres lignes pertinentes figurent dans S3, S6 ou S13 : zéro doublon plutôt qu'un doublon utile). Les italiques d'usage sont adaptés à chaque ligne retenue.
> **ids utilisés (20)** : H2-3 (n°1) · H2-5 (n°2) · H3-1 (n°3) · H3-4 (n°4) · H5-1 (n°5) · H6-2 (n°6) · H7-6 (n°7) · H8-1 (n°8) · H8-3 (n°9) · H9-1 (n°10) · H9-3 (n°11) · H11-2 (n°12) · H11-5 (n°13) · H12-3 (n°14) · H14-3 (n°15) · H14-4 (n°16) · H14-5 (n°17) · H15-5 (n°18) · H19-5 (n°19) · H20-3 (n°20).
> **Réserve (retenues à l'aveugle, non posées, un seul ressort par idée)** : H2-4 (même ressort que H2-3 : le groupe ne sait pas se servir d'un équipement de la location) · H4-4 (même ressort que H9-1 : la délibération collective interminable pour un détail, avec un résultat minuscule ; reçu un « < » d'un des deux relecteurs) · H7-5 (même ressort que H9-1, une seule gardée : la plus proche du sujet de l'article, l'argent du groupe).
> **Supprimés, sans ligne retenue** : emplacements H1, H10, H13, H16, H17 et H18 (arrivée, addition, avant le départ, après le séjour, installation sur la plage, baignade), avec leur indication d'usage. Les titres de section et leurs parenthèses ont été recalés sur les lignes réellement présentes (plus de promesse de blague de plage ni d'addition).
> Évités volontairement (déjà dans A4, section vacances du couple) : le cadenas de valise, « plus que vingt minutes », les pulls assortis, les verres à vin de la location, les 200 photos, le coucher de soleil au doigt.
> Handoff → @orchestrator (puis @seo, @fullstack) : (1) volumes de « blagues de vacances » et « blagues d'été » à vérifier dans Search Console ; le mot-clé secondaire « blague de plage » est retiré (aucune ligne de plage) ; (2) `comment-faire-rire-ses-amis` est absent de `blog-articles.ts` et `repartie-soiree-anti-malaise` est présent : aucun lien vers eux, aucun angle « soirée » ici ; (3) `comment-raconter-une-blague-sans-la-rater` n'a pas de `slug:` dans `blog-articles.ts` : lien non repris ; (4) levier J0 : lien « à lire ensuite » dans l'étalon et dans `phrases-droles-conversations`, sur GO Thomas ; (5) dry-run d'import depuis `apps/web` (`apps/web/scripts/content/import-article.ts`), puis `--write` sur GO Thomas, publication programmée le 03/06/2027 ; l'article n'est pas ajouté à `blog-articles.ts` ; (6) comparaison automatique des 20 lignes retenues avec les articles de la base (étalon, A4 et Q4 compris) à faire avant import ; (7) entrée CTA ci-dessous à ajouter dans `apps/web/src/config/blog-cta.ts`.

## CTA (pour blog-cta.ts)

Entrée à ajouter dans `apps/web/src/config/blog-cta.ts` (clé = slug), même position et même note que l'étalon :

- **clé** : `blagues-vacances-ete-entre-amis`
- **title** : Les vannes sont prêtes. Reste à oser les sortir.
- **text** : Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours, dont Confiance : de quoi sortir ta vanne devant tout le groupe sans la relire dix fois.
- **primaryLabel** : Créer mon compte gratuit
- **note** : Gratuit, sans carte. Les vannes de cette page restent en accès libre, compte ou pas.

## Métadonnées

- **slug** : `blagues-vacances-ete-entre-amis`
- **title** (53 car.) : Blagues de vacances : 20 vannes pour l'été entre amis
- **metaDescription** (145 car.) : 20 blagues de vacances pour la location, la route, la cagnotte, le groupe de discussion et les photos, chacune avec le bon moment pour la sortir.
- **excerpt** : Des blagues de vacances pour le groupe d'amis, classées par situation : la location, la route, le partage des comptes, le groupe de discussion, les photos et le retour. Chaque vanne a son mode d'emploi, et le rire tombe sur le groupe ou sur toi, jamais sur quelqu'un.
- **mot-clé principal** : blagues de vacances · volume à vérifier dans Search Console (aucun chiffre disponible)
- **mots-clés secondaires** : blagues d'été ; blague de vacances drôle ; humour de vacances entre amis
- **date de publication** : 2027-06-03 (jeudi ; pic visé juillet-août, délai 28 jours)
- **category** : CATALOGUE · **readingTime** : 6 min
- **liens internes** : `/blog/meilleures-blagues-droles-2026` · `/blog/autoderision-interactions` · `/blog/timing-humour` · `/blog/phrases-droles-conversations` · `/vannes/theme/soirees` · `/vannes/theme/autoderision` · `/vannes/theme/famille` · `/vannes/theme/boulot` · `/parcours/confiance` · `/parcours/repartie` · `/vannes` · `/quiz-humour` · `/conseils` · `/videos` · `/blague-du-jour`
- **cannibalisation** : mot-clé « vacances » en tête, jamais « amis » seul (`comment-faire-rire-ses-amis`). Pas de « soirée » ni d'« apéro » dans le corps (`repartie-soiree-anti-malaise`, `/vannes/theme/soirees` seulement en sortie). Article des 50 blagues : aucune ligne reprise. A4 (couple) : situations différentes (groupe, pas couple) et ressorts évités.
- **décisions fondateur appliquées** : zéro humoriste, zéro concurrent, zéro marque (ni plateforme de location, ni messagerie, ni appli de comptes nommées) ; lignes retenues à l'aveugle uniquement ; aucun chiffre ni étude inventé ; aucune vanne sur le physique ; parcours Confiance et Répartie = 20 minutes par semaine ; quiz = environ 2 minutes, sans inscription
- **objections traitées** : « ça va vexer quelqu'un du groupe » (encadré Le test, règles, FAQ 1) ; « à quel moment la sortir » (usage de chaque ligne, FAQ 2) ; « l'argent entre amis, c'est sensible » (section 3, règles, FAQ 3) ; « et si personne ne rit » (FAQ 4) ; « je ne suis pas le drôle du groupe » (règle 5, parcours Confiance)
- **rappel FAQPage** : les 4 questions de la fin sont visibles dans la page, réponses en texte simple, sans lien

---

## Contenu de l'article (markdown importé en base)

> **En bref :** 20 blagues de vacances classées par moment du séjour (location, route, comptes, groupe de discussion, photos et retour), chacune avec la façon de la sortir. Elles tombent sur le groupe ou sur la situation, jamais sur quelqu'un.

Va direct à ton moment : [Location](#quelles-blagues-de-vacances-pour-la-location-les-consignes-les-chambres-la-salle-de-bain) · [Route](#quelles-blagues-de-vacances-pour-la-route-le-depart-la-playlist-l-aire-de-repos-le-coffre) · [Comptes](#quelles-blagues-pour-le-partage-des-comptes-la-cagnotte-les-courses-le-remboursement) · [Groupe de discussion](#quelles-blagues-pour-le-groupe-de-discussion-des-vacances-pendant-le-sejour-au-fil-des-messages) · [Photos et retour](#quelles-blagues-pour-la-photo-de-groupe-et-le-retour-le-trepied-la-galerie) · [Règles du jeu](#comment-faire-rire-son-groupe-en-vacances-sans-blesser-personne). Pour les autres situations (soirée, bureau, famille), les [50 blagues drôles à ressortir](/blog/meilleures-blagues-droles-2026) font le tour. Ici, on reste dans le séjour : du règlement de la location au dernier message du groupe. La [blague du jour](/blague-du-jour) change tous les jours, et le [catalogue de vannes](/vannes) range le reste par thème.

Des vacances entre amis, c'est six personnes, une maison, une voiture et une cagnotte. Personne n'a choisi de faire tout ça ensemble avec autant de sérieux, et c'est exactement ce qui fait rire : les petites décisions collectives qui prennent une heure. Les meilleures blagues de vacances ne s'apprennent pas, elles se glissent là où le groupe se reconnaît.

> **Le test :** Une blague de vacances passe si tout le groupe pourrait la dire de lui-même. Elle tombe sur vous tous ou sur la situation, jamais sur le physique, jamais sur l'argent de quelqu'un, jamais sur un point sensible.

---

## Quelles blagues de vacances pour la location ? (les consignes, les chambres, la salle de bain)

La location est le décor où le groupe découvre en direct qu'il ne sait pas lancer un lave-vaisselle, lire un règlement sans en faire trop ni se partager une salle de bain. Ambiance détendue, enjeu nul, détails partout : c'est le meilleur terrain pour une première vanne.

**1.** « Le lave-vaisselle avait neuf boutons. Personne n'a osé. On a tout lavé à la main, par respect pour lui. »
*→ À dire devant l'évier le premier soir, ou en lançant la vaisselle à la main. Sérieux, comme quelqu'un qui respecte les machines.*

**2.** « Règlement affiché : « silence après 22 h ». À 22 h 01, on s'est mis à chuchoter. Le voisin le plus proche est à deux kilomètres. »
*→ À sortir quand le groupe baisse la voix le soir sans raison, ou en relisant le règlement de la location à voix haute.*

**3.** « La grande chambre est restée vide toute la semaine. Chacun l'avait refusée par politesse. Elle a eu les meilleures vacances. »
*→ À raconter en fin de séjour, en passant devant la porte de la grande chambre restée intacte. Ou quand la répartition s'éternise.*

**4.** « On a affiché un planning pour la salle de bain. Il a tenu un matin. Depuis, quelqu'un se lève à 6 h 30 pour gagner. »
*→ À dire au deuxième ou troisième matin, en croisant quelqu'un déjà douché. Le planning, c'est vous tous : personne n'est visé.*

Pour d'autres lignes, avec leur chute et leur décryptage : [les blagues d'autodérision](/vannes/theme/autoderision).

---

## Quelles blagues de vacances pour la route ? (le départ, la playlist, l'aire de repos, le coffre)

La route est un petit espace fermé où tout le groupe a un avis et une seule destination. Le rire sert de soupape : il passe mieux au péage qu'après la troisième discussion sur la climatisation.

**5.** « Départ prévu à 7 h pour éviter les bouchons. On est partis à 10 h 40, pour les rencontrer en personne. »
*→ À dire en route, au premier ralentissement, sur le ton de quelqu'un qui retrouve de vieilles connaissances.*

**6.** « Règle de la voiture : une chanson chacun, sans commentaire. Le premier commentaire est venu de celui qui avait inventé la règle. »
*→ À dire en lançant la playlist collective, avec l'air de réciter un règlement. Si c'est toi qui as proposé la règle, c'est encore mieux.*

**7.** « Sur l'aire de repos, il y avait une balançoire. À six adultes, on y est restés trois quarts d'heure. Le tour de rôle était très respecté. »
*→ À sortir devant une aire de jeux, ou en reprenant la route. Sur un ton d'arbitre, sans sourire.*

**8.** « Le coffre ne fermait pas. Quelqu'un a tout sorti et tout remis dans le même ordre. Il a fermé. On n'a pas posé de questions. »
*→ En chargeant le coffre, juste après le déclic de la fermeture, sur un ton de constat.*

**9.** « À l'arrière, on avait un parasol sur les genoux. Après deux heures, il participait à la conversation. »
*→ À dire au déchargement, en sortant le parasol de la voiture, avec un petit salut pour lui.*

Une fois la voiture garée, [les blagues de soirée](/vannes/theme/soirees) prennent le relais entre potes.

Quand quelqu'un renvoie une vanne depuis la banquette arrière, il faut pouvoir répondre sur le même ton : c'est le travail du [parcours Répartie](/parcours/repartie), 20 minutes par semaine.

---

## Quelles blagues pour le partage des comptes ? (la cagnotte, les courses, le remboursement)

L'argent entre amis ne fait pas de grosses disputes, il fait des rituels : la cagnotte, le ticket de caisse, le remboursement de fin de séjour. On rit du système que le groupe a inventé pour s'en sortir, jamais de qui a payé quoi, ni de qui a plus ou moins que les autres.

**10.** « On a ouvert une cagnotte pour « les courses communes ». Dès le deuxième jour, il a fallu définir « commun ». Le dentifrice a pris une soirée. »
*→ À dire quand quelqu'un ouvre la cagnotte commune, ou au premier achat qui fait hésiter. Le rire tombe sur la règle que vous avez inventée.*

**11.** « Le trésorier de la cagnotte a un carnet. Depuis qu'il a noté « olives, 3,40 € », on les mange avec plus de considération. »
*→ À dire à table, en passant le bol d'olives. Le rire tombe sur le carnet, pas sur celui qui le tient.*

**12.** « En relisant le ticket, une ligne : « caviar d'aubergine ». Personne ne s'est dénoncé. On l'a mangé à six, en silence. »
*→ À dire en vidant le sac de courses ou en relisant le ticket, sans chercher le coupable des yeux.*

**13.** « À la caisse, un autre groupe avait exactement notre chariot : bières, chips, glaçons. On s'est salués d'un signe de tête, de chariot à chariot. »
*→ À raconter en rentrant des courses, ou à voix basse dans la file, face à un chariot qui ressemble au vôtre.*

**14.** « Selon l'appli des comptes, je dois 3,20 euros « au groupe ». Je cherche son IBAN. »
*→ À dire ou à envoyer en fin de séjour, quand les remboursements tombent. Garde-la pour toi : c'est toi qui dois.*

Pour rire de toi d'abord, ce qui reste la valeur sûre dès qu'on parle d'argent : [les vannes d'autodérision](/vannes/theme/autoderision).

---

## Quelles blagues pour le groupe de discussion des vacances ? (pendant le séjour, au fil des messages)

Le groupe de discussion naît en février, vit en juin et meurt en septembre. Il a ses codes, ses pouces et ses silences, et chacun les reconnaît à la première phrase. Ces lignes se disent à voix haute en lisant l'écran, ou s'envoient telles quelles dans le groupe. Pour des phrases à ressortir dans une conversation plus large, [les phrases drôles à ressortir](/blog/phrases-droles-conversations) prennent le relais.

**15.** « Il pleut. Quelqu'un l'a écrit dans le groupe. Quatre personnes ont répondu « confirmé », depuis la même fenêtre. »
*→ À dire un matin de pluie, téléphone à la main, devant la fenêtre. Ou à envoyer dans le groupe en regardant dehors.*

**16.** « À 7 h 30, quelqu'un a écrit « qui est réveillé ? ». On l'était tous. Personne n'a répondu, par peur de faire le café. »
*→ À raconter à voix haute devant la machine à café, ou à glisser dans le groupe un matin sans réponse.*

**17.** « Un deuxième groupe a été créé « pour les trucs importants ». Dans le premier, il reste les trucs. »
*→ À envoyer dans le groupe quand un deuxième apparaît, ou à dire à voix haute en lisant l'écran à plusieurs.*

**18.** « Quelqu'un a écrit « il faut qu'on parle ». Silence de quatre minutes. C'était pour le pain. »
*→ À raconter dans la cuisine une fois l'inquiétude passée, ou à envoyer dans le groupe quand un message du genre vient de tomber.*

Le groupe de discussion de la famille a lui aussi ses codes : [les blagues de famille](/vannes/theme/famille).

Pour oser envoyer ce genre de message sans le relire dix fois, le [parcours Confiance](/parcours/confiance) demande 20 minutes par semaine.

---

## Quelles blagues pour la photo de groupe et le retour ? (le trépied, la galerie)

La photo de groupe est le seul moment où tout le monde fait la même chose en même temps, et où personne ne sait qui décide. Le retour prolonge le séjour : on rit pour que ça dure un peu plus.

**19.** « Notre trépied : un sac à dos, un livre et une bouteille d'eau. C'est le membre le plus stable du groupe. »
*→ À dire au moment de la photo de groupe, en calant le téléphone sur le tas, avant de lancer le minuteur.*

**20.** « J'ai quarante photos de la même mer, prises à quarante secondes d'intervalle. Elle n'a pas bougé. »
*→ À dire au retour, en faisant défiler la galerie, ou à envoyer dans le groupe avec la plus belle des quarante.*

Au retour, la question tombe aussi au bureau : « alors, ces vacances ? ». Pour le lundi de la reprise, [les blagues de boulot](/vannes/theme/boulot) sont prêtes pour la machine à café.

---

## Comment faire rire son groupe en vacances sans blesser personne ?

Une blague de vacances se joue à plusieurs, et les règles tiennent en cinq gestes.

**Fais tomber le rire sur toi d'abord.** L'[autodérision](/blog/autoderision-interactions) est la valeur sûre : si tu es celui qui n'a pas lu le message avec le code, le groupe rit sans se sentir visé.

**Choisis le moment.** La même phrase est une pique en pleine discussion sur le budget et un soulagement une fois l'ambiance détendue. [Le timing de l'humour](/blog/timing-humour) compte autant que le texte.

**Ne l'explique pas.** Si personne ne rit, passe à autre chose. Réexpliquer une vanne la tue.

**Garde le physique et l'argent de chacun hors du jeu.** On rit du système (la cagnotte, le planning de la salle de bain), pas de qui paie plus, dort mieux ou mange plus. Même gentil, même en riant.

**Adapte avec vos objets.** Les vannes ci-dessus sont des modèles : remplace la cagnotte, le parasol ou la playlist par ce qui a vraiment existé dans votre séjour. Une blague qui n'a eu lieu que chez vous gagne à chaque fois.

---

**Tu as fait le tour ?** Une nouvelle vanne arrive chaque jour : [la blague du jour](/blague-du-jour), avec sa chute et son décryptage.

Tu préfères choisir ton thème ?
- [Soirées](/vannes/theme/soirees)
- [Autodérision](/vannes/theme/autoderision)
- [Famille](/vannes/theme/famille)
- [Boulot](/vannes/theme/boulot)

Pas sûr du type d'humour de ton groupe ? [Le quiz « quel type d'humour es-tu ? »](/quiz-humour) prend environ 2 minutes, sans inscription.

→ **[Nos conseils d'humour](/conseils)** : les techniques de timing et de répartie.

→ **[Les vidéos](/videos)** : à regarder avant de sortir ta prochaine vanne.

## FAQ

### Quelles blagues de vacances peut-on faire sans vexer personne ?

Celles qui tombent sur le groupe entier ou sur une situation que tout le monde a vécue (la location, la route, la cagnotte), avec toi dans le rôle du maladroit. Évite le physique, l'argent de chacun et tout ce qu'un ami t'a confié. Un test simple : est-ce que chacun pourrait la dire de lui-même ? Si oui, tu peux la sortir.

### Quand sortir une blague de vacances sans casser l'ambiance ?

Quand la tension retombe, pas pendant. Une blague sur la route marche au péage ou à l'aire de repos, pas au milieu d'une discussion sur l'itinéraire. Choisis-en une ou deux par moment du séjour plutôt que la liste d'un coup : une blague bien placée vaut mieux que dix à la suite.

### Peut-on rire de l'argent et des comptes entre amis ?

Oui, si le rire tombe sur le système (la cagnotte, le carnet, le ticket de caisse) et jamais sur ce que chacun a dépensé ou gagné. Garde les vannes de comptes pour un moment détendu, pas le jour où quelqu'un hésite à rembourser. Un test : la dirais-tu en riant devant celui qui doit le plus d'argent au groupe sans qu'il se raidisse ?

### Que faire si personne ne rit ?

Ça arrive : la vanne tombe à plat ou le moment n'était pas le bon. Ne l'explique pas et ne la répète pas. Dis « elle était meilleure dans ma tête » et change de sujet. Si c'est le sujet lui-même qui a touché quelque chose, laisse tomber la blague et vérifie simplement que tout le monde va bien.
