# Promesses du hero des aperçus Premium (s26)

Propositions, à choisir par Thomas. Aucun texte n'entre dans le code sans son choix.
Étalon validé le 16/11 (Aujourd'hui) : « Cinq minutes par jour pour oser répondre au lieu de te taire. » (61 car., plafond).
Cible : 60 car. au plus, espaces compris (1 ligne à 1280 px, 2 lignes à 375 px). Comptage fait mot par mot.
Objectif de Thomas (16/11) : « pour les prospects, la section doit donner super envie de joindre et de s'inscrire ».

Base factuelle relue dans les données : `situations.json` (scène + trois réponses : la sûre, la joueuse, la risquée, avec « pourquoi » et « erreur »),
`constructions.json` (schéma, « comment c'est fait », essais, « copie cette précision, pas la phrase »),
`jeux.json` (« Quelle réplique ? », consigne « Dis ta réponse avant de lire la suite. Rien n'est noté. »).

## Quoi répondre (avoir la réplique pour une situation précise)

- **A** : « La bonne réplique sous la main, au moment où on te chambre. » (59 car.)
  Pourquoi : parle droit à Yanis, la situation qui le fige, aucun mot de l'étalon.
- **B** : « Trouve ta situation, repars avec la réponse qui te va. » (54 car.)
  Pourquoi : évoque le choix sûre, joueuse ou risquée, sans le chiffrer, et vise Sophie et Marc.
- **C** : « Quand on te lance une pique, tu auras déjà ta réponse. » (54 car.)
  Pourquoi : promesse en scène, le soulagement d'être prêt avant que ça arrive.

**Reco : A.** La plus proche du persona le plus touché (le chambrage), et elle nomme la situation, pas la rubrique.

## Bibliothèque (comprendre comment c'est construit, pour en fabriquer soi-même)

- **A** : « Vois pourquoi une vanne marche, puis fabrique les tiennes. » (58 car.)
  Pourquoi : deux temps, comprendre puis faire, calqué sur « Comment c'est construit ».
- **B** : « Repère ce qui fait rire, puis fais-le à ta façon. » (49 car.)
  Pourquoi : la plus courte, parle de l'oreille qu'on se fait, sans vocabulaire de métier.
- **C** : « Tu ne copies plus une vanne, tu sais en fabriquer une. » (54 car.)
  Pourquoi : la plus ambitieuse, un avant/après net, mais promet un résultat fort.

**Reco : B.** Elle ne promet pas un résultat garanti, reprend l'idée des données (« copie cette précision, pas la phrase ») et tient en 1 ligne partout.

## S'entraîner (s'exercer pour que ça sorte tout seul)

- **A** : « Répète à voix haute, pour que ça sorte tout seul ensuite. » (58 car.)
  Pourquoi : le geste réel des fiches (« dis-la à voix haute ») et le bénéfice final.
- **B** : « Ici, rien n'est noté : tu t'essaies avant que ça compte. » (56 car.)
  Pourquoi : lève la peur de se tromper (Yanis), reprend la consigne « Rien n'est noté ».
- **C** : « Teste ta réplique chez toi avant de la sortir pour de vrai. » (59 car.)
  Pourquoi : concrète et rassurante, l'entraînement comme répétition privée.

**Reco : B.** Pour un introverti, savoir qu'on peut se tromper sans être jugé est la vraie envie d'entrer.
Point à vérifier avant choix : « rien n'est noté » est vrai dans `jeux.json` ; à confirmer pour toutes les séances (situations, constructions).

## Favoris (s26, 18/11)

Contenu réel relu (`favoris-list.tsx`) : onglets Tout / Vannes / Conseils / Vidéos, carte vanne (chute au clic, « Pourquoi ça marche »), conseil (exemple, exercice), vidéo, « Partager », « Retirer ». Rubrique Premium (visiteur et gratuit voient l'aperçu). État vide : « Mets des vannes, conseils ou vidéos de côté : tu nous remercieras en soirée. »
Avis sur la proposition @ux « Garde la vanne qui t'a sauvé, retrouve-la le jour J. » (52 car.) : ne tient pas telle quelle. « t'a sauvé » suppose un vécu, « jour J » sonne événement, et « vanne » seule oublie conseils et vidéos. L'idée (garder puis retrouver) est reprise en C.

- **A** : « Ce qui t'a plu, rangé là où tu le retrouves. » (44 car.)
  Pourquoi : la plus sobre, nomme le rangement sans vocabulaire de fonction.
- **B** : « Ta vanne préférée t'attend, pile quand tu en as besoin. » (55 car.)
  Pourquoi : la retrouvaille comme soulagement, ton de pote, mais vannes seulement.
- **C** : « Garde ce qui t'a servi, retrouve-le sans chercher. » (50 car.)
  Pourquoi : garder puis retrouver, vannes, conseils et vidéos, aucun vécu supposé.

**Reco : C.** Reprend l'idée de @ux sans « sauvé » ni « jour J », couvre les trois types de contenu, et « sans chercher » est le bénéfice réel d'une liste triée par onglets.
Aucun mot des 4 promesses validées (réplique, main, moment, chambre, repère, rire, façon, noté, essaies, oser, taire). Aucun tiret cadratin, émoji, exclamation, chiffre.

## Mes questions, Mes répliques (s26, 19/11)

Contenu réel relu : `espace-questions.ts` (trois types : problème, « Une situation à gérer » = « une scène que tu vas vivre ou que tu viens de vivre », question ; aide « Évite les noms : décris la scène. » ; délai « L'équipe répond en général sous 1 à 2 jours ouvrés ») et `espace-repliques.ts` (écrire, modifier, supprimer, relire ; état vide « Écrire ma première réplique », validé 14/11).
Les deux promesses évitent les mots des 5 validées (réplique, répondre, garde, retrouve, jour, moment, sans, rien, noté, etc.). Le titre « Mes répliques » est déjà au-dessus du hero, le mot n'a pas à se répéter.
Pas de délai dans les promesses : il est sur l'écran d'écriture (« en général sous 1 à 2 jours ouvrés »), on ne le duplique pas dans un hero.

### 1. Mes questions

Avis sur la proposition @ux « Pose ta question, l'équipe te répond. » (36 car.) : correcte mais pas retenue. « Pose ta question » redit le titre de la rubrique, « te répond » reprend la racine de « Quoi répondre » et ne dit pas l'essentiel : c'est une scène vécue (ou à venir), traitée pour toi. Repli acceptable, pas une promesse qui donne envie.

- **A** : « Décris ta scène, l'équipe t'écrit en retour. » (44 car.)
  Pourquoi : reprend « décris la scène » du formulaire, le bénéfice (une réponse écrite) sans délai ni garantie de contenu.
- **B** : « Une scène à venir ou déjà vécue ? Raconte-la à l'équipe. » (55 car.)
  Pourquoi : couvre les deux cas du type « situation », la question fait entrer le lecteur, mais ne dit pas qu'on reçoit une réponse.
- **C** : « Ta situation à toi, pas un conseil pour tout le monde. » (54 car.)
  Pourquoi : l'envie (du sur-mesure), mais la plus ambitieuse : à garder seulement si Thomas confirme que les réponses sont écrites au cas par cas.

**Reco : A.** Dit ce qu'on fait et ce qu'on reçoit, ton de pote, rien d'invérifiable.

### 2. Mes répliques

Avis sur la proposition @ux « Tes meilleures répliques, au même endroit, prêtes pour le jour J. » (61 car.) : écartée. 1 car. au-dessus du plafond, « jour J » déjà refusé pour Favoris, « meilleures » suppose un tri qui n'existe pas, et « au même endroit » est l'idée de Favoris (garder puis retrouver). L'écran se distingue par l'écriture : ce sont les mots de l'abonné.

- **A** : « Tes mots à toi, écrits une fois, relus quand il le faut. » (56 car.)
  Pourquoi : écrire et relire, les deux gestes réels de l'écran, sans mot de la rubrique.
- **B** : « Écris ce que tu dirais vraiment, relis-le à ton rythme. » (54 car.)
  Pourquoi : la plus concrète, invite à écrire comme on parle (Yanis), mais « dirais » frôle la consigne « dis-la à voix haute ».
- **C** : « Ce que tu inventes mérite une place à côté du catalogue. » (56 car.)
  Pourquoi : valorise l'abonné, la plus envie pour un prospect, mais plus abstraite sur ce qu'on fait.

**Reco : A.** Chaque geste promis existe à l'écran (écrire, relire), ton simple, aucune promesse de résultat. C en deuxième choix si Thomas veut plus d'élan.

### 3. Libellé du lien quand l'abonné a déjà des répliques

Validé pour l'état vide : « Écrire ma première réplique ».

- **A** : « Écrire une autre réplique » (26 car.), proposition @ux : claire, neutre, mais « une » rompt le « ma » du libellé validé.
- **B** : « Écrire ma prochaine réplique » (29 car.) : même construction que « ma première » (verbe + ma + rang), la suite naturelle.
- **C** : « Ajouter une réplique » (21 car.) : la plus courte, mais change de verbe, donc la paire n'est plus cohérente.

**Reco : B.** Le lien se lit comme la suite du libellé validé. Si Thomas préfère la neutralité, A est sûr.

Vérifs : toutes les promesses ≤ 60 car. (comptage mot par mot), tutoiement, zéro tiret cadratin, émoji, exclamation, chiffre. Framework : bénéfice direct, Problem-Aware. Aucun fichier de code touché.

## Vérifications faites
Aucun tiret cadratin, émoji, point d'exclamation, chiffre, concurrent. Aucun mot de l'étalon (« oser répondre », « te taire », « cinq minutes »).

## Handoff
- Fichier : `/home/user/Marrant/docs/copy/promesses-apercus-s26.md` (9 propositions, 3 recos A / B / B).
- Framework : bénéfice direct (voix du pote), niveau de conscience Problem-Aware (prospect qui reste muet) ; aucun fichier de code touché.
- À faire après choix de Thomas : @fullstack ajoute les 3 promesses dans `espace-apercu.ts` et mesure la longueur à 1280 et 375 px.
