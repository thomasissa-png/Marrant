export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readingTime: string;
  category: string;
}

export const blogArticles: BlogArticle[] = [
  {
    slug: "techniques-repartie",
    title: "7 techniques de répartie qui marchent vraiment",
    excerpt:
      "Tu restes muet quand on te lance une pique ? Voici 7 techniques concrètes pour avoir toujours une réponse prête, sans devenir agressif.",
    content: `Tu connais ce moment gênant où quelqu'un te lance une remarque, et tu restes planté là, bouche ouverte, sans rien trouver à dire ? Et bien sûr, la réplique parfaite te vient... deux heures plus tard sous la douche. Bonne nouvelle : la répartie, ça s'apprend. Voici 7 techniques qui marchent vraiment, testées et approuvées.

1. Accuser réception

La technique la plus simple et la plus sous-estimée. Quelqu'un te balance une remarque ? Au lieu de paniquer, commence par accuser réception : "Intéressant", "Pas faux", "Bien vu". Ça te donne 2 à 3 secondes pour formuler ta vraie réponse. C'est exactement ce que font les humoristes en spectacle quand un spectateur les interpelle. Jamel Debbouze est un maitre en la matière : il accuse réception, sourit, puis retourne la situation.

2. Rebondir sur un mot-clé

Prends un mot dans la phrase de l'autre et construis ta réponse dessus. Si on te dit "T'es toujours en retard", tu rebondis sur "toujours" : "Toujours ? La dernière fois j'étais à l'heure, c'est juste que personne ne m'a vu." Simple, efficace, et ça montre que tu écoutes.

3. Retourner la situation

Au lieu de te défendre, retourne la remarque vers l'autre personne. "Tu manges encore ?" devient "Oui, et toi tu surveilles encore ce que mangent les gens ?". Florence Foresti utilise beaucoup cette technique dans ses spectacles. Tu prends le pouvoir sans être méchant.

4. La fausse naiveté

Fais semblant de ne pas comprendre l'attaque. "Ah bon ? Qu'est-ce que tu veux dire exactement ?" Ça met l'autre dans une position inconfortable, parce qu'expliquer une vanne, c'est la tuer. En plus, ça te donne du temps pour préparer ta contre-attaque.

5. Le redirect

Change complètement de sujet de façon absurde. On te fait une remarque sur ta coiffure ? "Merci, et sinon t'as vu le prix des tomates ?" L'absurdité crée le rire et montre que la remarque ne t'atteint pas du tout. Kev Adams utilise souvent ce type de pivot dans ses interactions avec le public.

6. Le miroir

Répète exactement ce que l'autre vient de dire, mais avec un ton différent. Quelqu'un dit "T'es bizarre quand même", tu réponds "T'es bizarre quand même" avec un sourire complice. Ça crée un effet comique immédiat et ça désarme complètement l'autre.

7. L'escalade comique

Prends la remarque et pousse-la à l'extrême. "T'es toujours fatigué" devient "Fatigué ? Je suis au-delà de la fatigue. Je suis dans une dimension parallèle où le café n'existe pas. Envoie de l'aide." Gad Elmaleh est le roi de l'escalade comique : il part d'une observation banale et monte, monte, monte jusqu'à l'absurde.

Le secret, c'est de pratiquer. Commence par une ou deux techniques, utilise-les dans des situations à faible enjeu (avec des amis, en famille), puis élargis petit à petit. La répartie, c'est comme un muscle : plus tu l'entraines, plus elle devient naturelle.

Ces techniques marchent dans toutes les situations. Tu es étudiant et tu restes muet quand tes potes te chambrent en soirée ? L'accusé de réception et le redirect absurde vont devenir tes meilleurs alliés. Tu veux avoir de la conversation à la machine à café au bureau ? Le rebond sur mot-clé transforme n'importe quelle remarque banale en moment drôle. Tu traverses une période difficile et tu veux retrouver ta légèreté dans tes interactions ? L'autodérision et le miroir sont des techniques douces qui permettent de renouer avec l'humour sans forcer.

Tu veux aller plus loin ? Sur deviens-marrant.fr, on a des exercices interactifs pour pratiquer chaque technique avec des mises en situation concrètes. Essaie gratuitement et tu verras la différence en quelques jours.`,
    date: "2026-03-10",
    readingTime: "5 min",
    category: "REPARTIE",
  },
  {
    slug: "apprendre-etre-drole",
    title: "Peut-on vraiment apprendre à être drôle ?",
    excerpt:
      "\"Être drôle, c'est inné.\" Faux. La science prouve le contraire. Voici pourquoi l'humour est une compétence comme une autre, et comment la développer.",
    content: `"Soit t'es drôle, soit tu l'es pas." On a tous entendu cette phrase. Et c'est probablement le plus gros mythe sur l'humour. La vérité ? L'humour est une compétence. Et comme toute compétence, elle s'apprend, se travaille et se perfectionne.

Le mythe du "don naturel"

Quand tu vois Jamel Debbouze improviser sur scène, ça a l'air tellement naturel que tu te dis qu'il est né comme ça. Sauf que Jamel a commencé au Café de la Gare, à enchainer des scènes devant des salles vides. Gad Elmaleh raconte qu'il écrivait des dizaines de vannes par jour pour en garder une seule. Florence Foresti a mis des années à trouver son personnage. Derrière chaque "naturel", il y a des heures de travail.

Ce que dit la science

Des chercheurs de l'Université du Nouveau-Mexique ont montré que l'humour repose sur des mécanismes cognitifs précis : la détection d'incongruité, la résolution de tension, le timing. Ce sont des processus que le cerveau peut apprendre à maitriser. Une étude publiée dans le Journal of Positive Psychology a même démontré qu'un entrainement de 8 semaines à l'humour améliorait significativement la capacité des participants à faire rire.

Les 3 piliers de l'humour qui s'apprennent

L'observation est le premier pilier. Les gens drôles voient le monde différemment. Ils remarquent les absurdités du quotidien. Bonne nouvelle : ça se travaille. Commence par noter chaque jour une situation bizarre ou contradictoire que tu as observée. En quelques semaines, ton "radar à humour" sera beaucoup plus affuté.

Le deuxième pilier, c'est la structure. Une blague, c'est setup + punchline. Une anecdote drôle, c'est contexte + tension + chute. Ces structures sont identifiables, reproductibles et perfectibles. C'est pas de la magie, c'est de l'architecture.

Le troisième pilier, c'est la pratique. Comme un instrument de musique, l'humour se joue. Plus tu essaies de faire rire (même si tu te plantes), plus tu développes ton instinct. Les open mics de stand-up, c'est exactement ça : un terrain d'entrainement.

Comment progresser concrètement

Commence petit. Fais des observations drôles en privé, dans ta tête. Ensuite, partage-les avec un ami proche. Puis élargis le cercle. Note ce qui marche et ce qui ne marche pas. Regarde des spectacles et analyse pourquoi tu ris : quel mot, quel silence, quelle expression a déclenché le rire ?

L'erreur classique, c'est de vouloir être hilare dès le premier essai. L'humour, c'est un marathon, pas un sprint. Chaque vanne qui tombe à plat est une leçon. Chaque sourire arraché est une victoire.

Et ça fonctionne pour tout le monde. Si tu es étudiant timide qui galère à prendre la parole en TD ou en soirée, l'observation est ton meilleur point d'entrée : note ce que tu remarques, sans pression. Si tu cherches à alimenter tes conversations au bureau ou à l'afterwork, la structure setup/punchline va transformer tes anecdotes de pause déjeuner. Et si tu traverses une période où tu as perdu ta légèreté, la pratique progressive te permet de retrouver ton humour à ton rythme, sans te forcer. Paul Mirabel, Fary, Panayotis Pascot — ces humoristes de la nouvelle génération prouvent chaque jour que l'humour se construit et s'affine avec le temps.

Sur deviens-marrant.fr, on a conçu des parcours progressifs pour développer ton humour étape par étape, avec des exercices concrets et un suivi de ta progression. Teste gratuitement et découvre ton potentiel comique.`,
    date: "2026-03-05",
    readingTime: "4 min",
    category: "OBSERVATION",
  },
  {
    slug: "timing-humour",
    title: "Le timing en humour : pourquoi c'est plus important que la blague",
    excerpt:
      "La même blague peut faire un tabac ou tomber à plat. La différence ? Le timing. Découvre comment maitriser cet art invisible.",
    content: `Tu as déjà raconté une blague que tu trouvais excellente, et... silence. Personne ne rit. Puis un pote raconte quasiment la même chose 10 minutes plus tard et tout le monde explose de rire. Frustrant ? Normal. Le problème n'était pas ta blague, c'était ton timing.

Pourquoi le timing change tout

Le timing, c'est l'art de dire le bon mot au bon moment. C'est ce qui sépare une blague qui fait mouche d'une blague qui tombe dans le vide. Les meilleurs humoristes le savent : le silence avant la punchline vaut autant que la punchline elle-même. Regarde un spectacle de Gad Elmaleh au ralenti. Tu verras qu'il marque des pauses de 2 à 3 secondes avant ses chutes. Ce silence crée de la tension, et le rire est la libération de cette tension.

La règle des 3 secondes

Quand tu veux placer une réplique drôle en conversation, attends 3 secondes après que la personne a fini de parler. Pas 1 seconde (trop rapide, on dirait que tu n'écoutais pas). Pas 10 secondes (le moment est passé). 3 secondes, c'est le sweet spot. Ça donne l'impression que tu réfléchis, que ta réponse est spontanée mais pesée. C'est exactement ce que font les grands improvisateurs.

Le pouvoir du silence

La plupart des gens ont peur du silence. Ils débitent leur blague à toute vitesse pour en finir. Grave erreur. Le silence est ton meilleur allié. Avant ta punchline, marque une pause. Regarde ton interlocuteur. Laisse la tension monter. Puis lâche ta chute. Florence Foresti est redoutable pour ça : elle peut tenir un silence de 5 secondes en regardant le public, et la salle est déjà en train de rire avant même qu'elle ait dit un mot.

La pause avant la punchline

Voici la structure parfaite. Tu racontes le setup normalement, à un rythme conversationnel. Quand tu arrives juste avant la chute, tu ralentis. Tu baisses légèrement le volume. Tu marques une micro-pause. Puis tu délivres la punchline avec un changement de ton ou de rythme. C'est ce contraste qui déclenche le rire.

Lire la pièce

Le timing, c'est aussi savoir lire l'ambiance. Est-ce que les gens sont détendus ou tendus ? Est-ce qu'ils discutent légèrement ou ont une conversation sérieuse ? Placer une blague au mauvais moment, même une bonne blague, c'est le meilleur moyen de tuer l'ambiance. Les bons humoristes sentent la salle. En conversation, c'est pareil : observe avant de parler.

Le timing dans la vraie vie

Le timing, ça change tout dans tes interactions quotidiennes. En soirée, quand tu sens que le groupe est en train de rire d'un sujet, c'est le moment de placer ton observation — pas 5 minutes après quand tout le monde est passé à autre chose. À la machine à café, la remarque drôle qui fonctionne, c'est celle qui arrive dans le silence naturel entre deux gorgées, pas celle que tu balances en coupant quelqu'un. Et si tu traverses une période où tu as du mal à trouver ta place dans les conversations, le timing t'aide justement à faire mouche avec moins de mots — une seule remarque bien placée vaut mieux que dix tentatives précipitées. Fary et Paul Mirabel sont d'excellents exemples de timing moderne : ils utilisent des silences longs et des changements de rythme qui créent une tension irrésistible.

Comment pratiquer

Commence par observer. Regarde des spectacles de stand-up et chronométre les pauses. Note quand les rires arrivent par rapport aux silences. Ensuite, dans tes conversations, force-toi à attendre avant de répondre. Résiste à l'envie de combler le silence. Tu seras surpris de l'effet.

Envie de travailler ton timing avec des exercices interactifs ? Sur deviens-marrant.fr, chaque conseil vient avec une mise en situation pour t'entrainer. Essaie gratuitement, ça prend 5 minutes par jour.`,
    date: "2026-02-28",
    readingTime: "4 min",
    category: "TIMING",
  },
  {
    slug: "erreurs-blagues",
    title: "5 erreurs qui tuent tes blagues (et comment les éviter)",
    excerpt:
      "Tu racontes une blague et personne ne rit ? Tu fais peut-être une de ces 5 erreurs classiques. Voici comment les repérer et les corriger.",
    content: `On a tous vécu ce moment : tu racontes une blague, tu arrives à la chute, et... rien. Le silence. Ou pire, un sourire poli. Si ça t'arrive souvent, c'est probablement pas un problème de blague. C'est un problème de livraison. Voici les 5 erreurs les plus courantes et comment les corriger.

Erreur 1 : Expliquer la blague

C'est l'erreur numéro 1. Tu fais ta blague, il y a un petit flottement, et tu paniques : "Tu vois, c'est drôle parce que...". Stop. Expliquer une blague, c'est la tuer. Si les gens n'ont pas compris, tant pis. Passe à autre chose. Les meilleurs humoristes laissent parfois une vanne sans réaction et continuent comme si de rien n'était. L'explication montre que tu doutes de toi, et le doute est l'ennemi du rire. Si Jamel Debbouze devait expliquer chaque vanne, ses spectacles dureraient 6 heures.

Erreur 2 : Le mauvais timing

On en a parlé dans un autre article, mais ça mérite d'être répété. Placer une blague quand l'ambiance ne s'y prête pas, c'est le crash assuré. Quelqu'un raconte un problème sérieux ? C'est pas le moment de placer ta vanne sur les chats. Apprends à sentir quand le groupe est réceptif. En général, les meilleurs moments pour l'humour sont les transitions entre deux sujets et les petits silences naturels dans la conversation.

Erreur 3 : Se tromper d'audience

La blague sur ton prof de fac, elle cartonne avec tes potes étudiants. Au diner de famille avec ta grand-mère ? Moins. Adapter son humour à son audience, c'est fondamental. Ce n'est pas de l'autocensure, c'est de l'intelligence sociale. Kev Adams ne fait pas le même show devant des ados et devant un public de gala. Le contenu peut changer, mais le talent reste le même.

Erreur 4 : Le setup trop long

"Attends, attends, il faut que je t'explique le contexte. Alors en fait, y'a trois mois, j'étais chez mon pote, enfin pas vraiment mon pote, c'est le cousin de...". Tu as perdu ton public. Un bon setup est court et efficace. L'idéal : 1 à 2 phrases max avant la chute. Si tu as besoin de 5 minutes de contexte, c'est que ta blague n'est pas assez bien structurée. Retravaille-la. Les one-liners sont si efficaces justement parce que le setup est minimaliste.

Erreur 5 : Le manque d'engagement

Tu marmonnes ta blague en regardant tes chaussures, avec un demi-sourire gêné ? Personne ne va rire. L'engagement, c'est la confiance avec laquelle tu délivres ta réplique. Regarde les gens dans les yeux. Assume ton humour. Même si la blague est moyenne, la confiance dans la livraison peut la sauver. À l'inverse, la meilleure blague du monde, livrée sans conviction, tombera à plat. Florence Foresti peut dire "Bonjour" et faire rire 3000 personnes, parce que son engagement est total.

Ces erreurs dans la vraie vie

Si tu es du genre timide et que tu oses enfin une blague en soirée, l'erreur la plus fréquente c'est l'erreur 1 : tu expliques la chute parce que tu doutes. Résiste. Au bureau, l'erreur 2 est la plus courante : tu sors une vanne pendant que ton manager parle d'un sujet sérieux. Apprends à sentir le moment. Et si tu essaies de retrouver ton humour après une période difficile, l'erreur 5 est ton ennemi principal : le manque d'engagement. Tu marmonnes ta blague parce que tu n'oses pas encore l'assumer. La confiance reviendra avec la pratique — Roman Frayssinet et Blanche Gardin sont la preuve que l'authenticité dans la livraison vaut plus que la blague elle-même.

Le plan d'action

Choisis une erreur que tu fais souvent. Une seule. Et pendant une semaine, concentre-toi uniquement sur celle-là. La semaine suivante, passe à la suivante. En un mois, tu auras corrigé les erreurs les plus courantes et tes blagues auront beaucoup plus d'impact.

Tu veux des exercices pratiques pour travailler chaque point ? Sur deviens-marrant.fr, on a des mises en situation pour chaque type d'erreur. Essaie gratuitement et progresse à ton rythme.`,
    date: "2026-02-20",
    readingTime: "5 min",
    category: "STORYTELLING",
  },
  {
    slug: "autoderision-interactions",
    title: "Comment l'autodérision peut transformer tes interactions sociales",
    excerpt:
      "L'autodérision est un super-pouvoir social. Elle désarme, crée de la complicité et montre ta confiance. Mais attention aux pièges.",
    content: `L'autodérision, c'est l'art de rire de soi-même. Et c'est probablement la compétence sociale la plus puissante que tu puisses développer. Quand tu sais rire de toi, tu deviens immédiatement plus sympathique, plus accessible et plus drôle. Mais attention : mal utilisée, l'autodérision peut se retourner contre toi.

Pourquoi l'autodérision fonctionne

Quand quelqu'un rit de lui-même, ton cerveau interprète ça comme un signal de confiance. "Cette personne est assez sûre d'elle pour plaisanter sur ses défauts." C'est exactement l'inverse de ce qu'on pourrait croire. L'autodérision ne montre pas de la faiblesse, elle montre de la force. Jamel Debbouze plaisante sur sa main, Gad Elmaleh sur ses origines, Florence Foresti sur ses galères de mère. Aucun d'entre eux ne parait faible. Au contraire, ils dégagent une confiance folle.

La règle d'or : confiance vs insécurité

Voilà le piège. Il y a une différence énorme entre rire de soi avec confiance et se dénigrer par insécurité. "Je suis nul en cuisine, la dernière fois j'ai fait bruler de l'eau" dit avec le sourire, c'est de l'autodérision. "Je suis nul, de toute façon je rate tout" dit avec un air triste, c'est de l'auto-sabotage. La différence ? Le ton et l'intention. L'autodérision positive vise à créer du rire et de la connexion. L'auto-dénigrement vise (inconsciemment) à obtenir de la pitié.

Les 3 règles de l'autodérision réussie

Première règle : plaisante sur des choses peu importantes. Ton sens de l'orientation catastrophique, ta passion suspecte pour les séries B, ton incapacité à faire un créneau. Pas sur des sujets qui te blessent vraiment. Si ça te fait mal d'en parler, c'est pas de l'autodérision, c'est une blessure ouverte.

Deuxième règle : souris quand tu le dis. Le sourire signale au cerveau de l'autre que c'est de l'humour, pas un appel à l'aide. Sans le sourire, la même phrase peut être interprétée comme de la tristesse.

Troisième règle : ne le fais pas tout le temps. Si chaque phrase que tu dis est une blague sur toi, les gens vont finir par te prendre au sérieux. L'autodérision, c'est un outil ponctuel, pas une identité.

Comment l'autodérision transforme les interactions

En groupe, l'autodérision casse la glace. Tu arrives dans une soirée où tu ne connais personne ? "Excusez-moi, je suis le gars qui connait personne et qui hésite entre le buffet et la sortie de secours." Rires garantis, et soudain tu es approchable.

En conflit, l'autodérision désamorce. Quelqu'un te reproche d'être en retard ? "Tu as raison, mon rapport au temps est un mystère même pour moi." La tension retombe immédiatement.

En séduction, l'autodérision crée de l'authenticité. Dans un monde où tout le monde essaie de paraitre parfait, quelqu'un qui assume ses imperfections avec humour, c'est rafraichissant.

Exemples concrets pour commencer

Au boulot : "Je suis le genre de personne qui met 10 minutes à comprendre la machine à café, mais donne-moi un tableur Excel et je te fais des miracles."

Entre amis : "Mon sens de l'orientation est tellement mauvais que Google Maps m'a bloqué."

En rendez-vous : "Je te préviens, je suis très nul pour choisir au restaurant. Ma dernière commande aventureuse, c'était un menu enfant."

L'autodérision est un muscle qui se développe. Commence par des petites remarques en terrain connu (amis proches, famille), puis élargis progressivement. Sur deviens-marrant.fr, tu trouveras des exercices guidés pour développer ton autodérision sans tomber dans les pièges. Essaie gratuitement et découvre cette arme secrète.`,
    date: "2026-02-15",
    readingTime: "4 min",
    category: "AUTODERISION",
  },
  {
    slug: "comment-devenir-drole",
    title: "Comment devenir drôle : le guide complet pour développer son humour",
    excerpt:
      "Tu veux devenir drôle mais tu ne sais pas par où commencer ? Ce guide complet te donne les clés pour développer ton sens de l'humour pas à pas, avec des exercices concrets.",
    content: `Tu rêves d'être la personne qui fait rire tout le monde, celle qui détend l'atmosphère d'une seule phrase ? Bonne nouvelle : devenir drôle, ça s'apprend. Ce n'est pas réservé aux humoristes professionnels ou aux "naturels". C'est une compétence que tout le monde peut développer avec les bonnes méthodes et un peu de pratique quotidienne.

Pourquoi certaines personnes semblent naturellement drôles

Spoiler : elles ne le sont pas. Ce que tu perçois comme du "talent naturel" est en réalité le résultat de milliers de micro-apprentissages inconscients. Les personnes drôles ont grandi dans un environnement où l'humour était valorisé, elles ont observé, imité, échoué et recommencé des milliers de fois. Jamel Debbouze n'est pas né drôle. Il a passé des années au Café de la Gare à tester des vannes devant des salles vides. La différence entre toi et la personne "naturellement drôle", c'est simplement le nombre d'heures de pratique.

Les 5 piliers pour devenir drôle

Premier pilier : l'observation. Les gens drôles voient le monde autrement. Ils repèrent les contradictions, les absurdités et les décalages que tout le monde ignore. Comment développer ton œil ? Note chaque jour une situation absurde que tu as observée. Au bout de 30 jours, tu auras un répertoire de 30 observations potentiellement drôles. C'est la matière première de l'humour.

Deuxième pilier : la surprise. L'humour repose presque toujours sur un décalage entre ce qu'on attend et ce qui arrive. C'est le principe du setup/punchline. Le setup crée une attente, la punchline la casse. Pour devenir drôle, entraîne-toi à trouver l'angle inattendu dans chaque situation. Si tout le monde pense A, pense B.

Troisième pilier : le timing. Dire le bon mot au bon moment, c'est 50 % du travail. Un silence de 2 secondes avant ta punchline crée de la tension. La chute libère cette tension sous forme de rire. Entraîne-toi à résister à l'envie de combler les silences. Le timing, ça se travaille comme un instrument de musique.

Quatrième pilier : l'autodérision. C'est l'arme secrète des gens drôles. Quand tu sais rire de toi-même, tu deviens immédiatement sympathique et accessible. L'autodérision montre de la confiance, pas de la faiblesse. Florence Foresti, Gad Elmaleh, Blanche Gardin — ils rient tous d'eux-mêmes constamment.

Cinquième pilier : la pratique délibérée. Tu ne deviendras pas drôle en lisant des articles (celui-ci inclus). Tu deviendras drôle en pratiquant. Commence avec des amis proches, dans des situations à faible enjeu. Teste une observation drôle par jour. Analyse ce qui marche et ce qui ne marche pas. C'est exactement ce que font les stand-uppers avec les open mics.

Un plan d'action concret sur 30 jours

Semaine 1 : L'observation. Note chaque jour une situation bizarre, contradictoire ou absurde. Ne cherche pas à être drôle, cherche juste à observer. Le matin dans les transports, à la machine à café, dans la queue du supermarché.

Semaine 2 : La reformulation. Prends tes observations de la semaine 1 et essaie de les reformuler de façon drôle. Cherche l'angle inattendu. Écris 3 versions de chaque observation et garde la meilleure.

Semaine 3 : Le test. Partage tes meilleures trouvailles avec un ami proche. Note ses réactions. Ce qui fait sourire, ce qui fait rire, ce qui tombe à plat. Pas de jugement, juste des données.

Semaine 4 : L'expansion. Utilise ce qui a marché en semaine 3 dans des contextes plus larges. En réunion, en soirée, sur les réseaux sociaux. Tu as maintenant un petit répertoire testé et approuvé.

Les erreurs qui empêchent de devenir drôle

L'erreur numéro 1 : attendre d'être "prêt". Tu ne seras jamais prêt. Lance-toi. Les premières vannes tomberont à plat, et c'est normal. Même les pros ont un taux de réussite de 60-70 %. L'important, c'est de s'entraîner.

L'erreur numéro 2 : copier les autres. Regarder des humoristes pour comprendre les mécanismes, oui. Répéter leurs vannes, non. L'humour le plus efficace est personnel et authentique. Trouve TA voix.

L'erreur numéro 3 : forcer. L'humour forcé se sent à des kilomètres. Si une blague ne vient pas naturellement dans la conversation, ne la force pas. Les gens drôles ne sont pas "on" en permanence. Ils choisissent leurs moments.

Le rôle de la confiance en soi

Il y a un cercle vertueux entre humour et confiance. Plus tu fais rire, plus tu as confiance. Plus tu as confiance, plus tu oses. Plus tu oses, plus tu fais rire. Le déclencheur ? Accepter que les premières tentatives seront imparfaites. Et c'est OK. Personne ne te jugera pour une blague qui tombe à plat, tant que tu ne la forces pas.

Sur deviens-marrant.fr, on a conçu des parcours progressifs qui te guident pas à pas dans ce processus. Des blagues à mémoriser, des techniques de répartie à pratiquer, des vidéos de pros à analyser, et un système de progression (XP + streaks) pour rester motivé. Commence gratuitement et deviens la personne drôle du groupe.`,
    date: "2026-03-13",
    readingTime: "7 min",
    category: "GUIDE",
  },
  {
    slug: "comment-avoir-de-la-repartie",
    title: "Comment avoir de la répartie : 10 techniques concrètes pour ne plus rester muet",
    excerpt:
      "Tu restes planté quand on te chambre ? Tu trouves la réplique parfaite 2 heures trop tard ? Voici 10 techniques concrètes pour avoir de la répartie dans toutes les situations.",
    content: `"Alors, t'as rien à dire ?" Cette phrase, tu l'as entendue (ou pensée) combien de fois ? La répartie — cette capacité à répondre du tac au tac avec à-propos et souvent avec humour — est l'une des compétences sociales les plus admirées. Et les plus frustrantes quand on ne l'a pas. Si tu es du genre à trouver la réplique parfaite sous la douche, 2 heures après la conversation, cet article est fait pour toi.

Qu'est-ce que la répartie exactement ?

La répartie n'est pas de l'agressivité déguisée. C'est la capacité à répondre rapidement, avec pertinence, souvent avec humour, à une remarque ou une situation. C'est ce que fait Jamel Debbouze quand un spectateur l'interpelle, ce que fait Florence Foresti quand une interview prend un tour inattendu. Ce n'est pas "avoir le dernier mot", c'est "avoir le bon mot au bon moment".

Pourquoi certains ont de la répartie et pas d'autres

La répartie n'est pas un don inné. C'est un muscle cognitif. Les personnes qui semblent avoir une répartie "naturelle" ont simplement plus de pratique : elles ont grandi dans des environnements où le ping-pong verbal était courant (fratries, groupes d'amis, etc.), elles ont développé des réflexes. Mais ces réflexes s'acquièrent à tout âge.

10 techniques concrètes pour avoir de la répartie

Technique 1 : L'accusé de réception. Face à une remarque, ne panique pas. Commence par un simple "Intéressant", "Pas faux" ou "Bien vu". Ces 2-3 secondes te donnent le temps de formuler ta vraie réponse. C'est la technique de base que tous les humoristes utilisent sur scène.

Technique 2 : Le rebond sur mot-clé. Attrape un mot dans la phrase de l'autre et construis ta réponse dessus. "T'es toujours en retard" → tu rebondis sur "toujours" : "Toujours ? C'est un peu excessif non ? Je dirais... souvent." L'autre rit, la tension baisse.

Technique 3 : Le retournement. Retourne la remarque vers l'expéditeur. "Tu manges encore ?" → "Oui, et toi tu comptes encore ce que mangent les gens ?" C'est la technique préférée de Florence Foresti. Tu reprends le pouvoir sans être méchant.

Technique 4 : La fausse naïveté. Fais semblant de ne pas comprendre : "Ah bon ? Qu'est-ce que tu veux dire exactement ?" L'autre est obligé d'expliquer sa pique, ce qui la rend ridicule. En bonus, ça te donne du temps.

Technique 5 : Le redirect absurde. Change totalement de sujet de façon inattendue. Remarque sur ta coiffure ? "Merci, et sinon t'as vu le prix des avocats en ce moment ?" L'absurdité crée le rire et montre que la remarque ne t'atteint pas.

Technique 6 : L'autodérision stratégique. Pousse la critique jusqu'à l'absurde toi-même. "T'es toujours fatigué" → "Fatigué ? Je suis au-delà de la fatigue. Mon dernier rêve, c'était un PowerPoint." Tu coupes l'herbe sous le pied de l'autre.

Technique 7 : La question piège. Réponds à une remarque par une question qui met l'autre face à son absurdité. "T'es bizarre quand même" → "Bizarre par rapport à quoi ? À la normalité ? Et c'est quoi la normalité ?" Ça fait réfléchir et rire en même temps.

Technique 8 : Le compliment détourné. Transforme l'attaque en pseudo-compliment. "Tu parles trop" → "Ah, tu as remarqué ! Je savais que mon charisme finirait par se voir." L'inattendu du compliment crée le rire.

Technique 9 : Le miroir. Répète exactement ce que l'autre vient de dire, mais avec un ton complètement différent (amusé, théâtral, chuchoté). L'effet comique est immédiat et ça désarme l'autre.

Technique 10 : Le silence souriant. Parfois, la meilleure répartie, c'est pas de réponse du tout. Un sourire confiant, un regard amusé, et le silence. Ça montre que la remarque ne mérite même pas une réponse. C'est dévastateur.

Comment pratiquer la répartie au quotidien

Exercice 1 : Le journal de répartie. Chaque soir, note une situation où tu aurais voulu avoir de la répartie. Écris 3 réponses possibles en utilisant 3 techniques différentes. En quelques semaines, ces réponses te viendront de plus en plus vite en temps réel.

Exercice 2 : Le ping-pong verbal. Avec un ami complice, faites des sessions de 5 minutes où vous vous envoyez des remarques et devez répondre en moins de 5 secondes. Pas besoin d'être brillant, l'objectif est la rapidité.

Exercice 3 : L'analyse de pros. Regarde des interviews d'humoristes et analyse comment ils répondent aux questions piège des journalistes. Quelles techniques utilisent-ils ? Gad Elmaleh, par exemple, utilise énormément l'accusé de réception suivi d'un redirect.

La répartie pour les timides

Si tu es introverti ou timide, la répartie peut sembler intimidante. Mais c'est justement là que les techniques 1 (accusé de réception), 4 (fausse naïveté) et 10 (silence souriant) sont les plus puissantes. Elles ne demandent ni d'être bruyant ni d'être extraverti. Elles demandent juste de rester calme et de prendre son temps. Et c'est souvent les personnes calmes qui ont la répartie la plus dévastatrice.

La répartie n'est pas de l'agressivité

Attention au piège : la répartie, ce n'est pas "écraser l'autre". C'est créer un moment drôle et léger, même quand la remarque de départ était piquante. L'objectif, c'est que tout le monde rie — y compris la personne qui t'a lancé la remarque. Si ta réponse blesse l'autre, c'est pas de la répartie, c'est de la méchanceté.

Tu veux aller plus loin ? Sur deviens-marrant.fr, on a un parcours Répartie de 4 semaines avec des exercices interactifs, des mises en situation et un suivi de ta progression. C'est conçu spécialement pour les personnes qui veulent développer cette compétence pas à pas, sans pression. Essaie gratuitement.`,
    date: "2026-03-12",
    readingTime: "8 min",
    category: "REPARTIE",
  },
  {
    slug: "devenir-marrant",
    title: "Devenir marrant : pourquoi c'est à la portée de tout le monde",
    excerpt:
      "Tu penses que les gens marrants sont nés comme ça ? Faux. Être marrant, c'est un ensemble de compétences qui se développent. Voici comment.",
    content: `"Lui, il est marrant." On l'a tous dit en parlant de quelqu'un. Ce pote qui détend n'importe quelle ambiance. Ce collègue qui fait rire toute la table à chaque déjeuner. Cette personne qui a toujours le bon mot au bon moment. Et toi, tu te demandes : "Pourquoi pas moi ?" La réponse est simple : rien ne t'en empêche.

Être marrant vs être drôle : la différence qui change tout

Être "drôle", c'est faire rire avec une blague. Être "marrant", c'est plus profond. C'est une énergie, une façon d'être. La personne marrante ne raconte pas forcément des blagues. Elle a un regard amusé sur le monde, elle reformule les situations banales de façon inattendue, elle crée une atmosphère légère autour d'elle. C'est un état d'esprit, pas une performance.

Et la bonne nouvelle ? Cet état d'esprit se cultive. Comme la forme physique ou la culture générale, devenir marrant demande de la pratique régulière, pas un talent spécial.

Les 4 habitudes des personnes marrantes

Habitude 1 : Elles observent tout. Les personnes marrantes sont des éponges. Elles remarquent les détails que personne ne voit. Le collègue qui fait toujours le même geste bizarre en réunion. L'absurdité d'une règle au bureau. Le décalage entre ce que les gens disent et ce qu'ils font. Cette observation constante est leur matière première.

Comment développer cette habitude : pendant une semaine, note chaque jour 3 choses bizarres, absurdes ou contradictoires que tu observes. Pas besoin qu'elles soient drôles. L'exercice, c'est juste d'entraîner ton œil à voir ce que les autres ignorent.

Habitude 2 : Elles reformulent. Les personnes marrantes prennent une situation banale et la présentent sous un angle inattendu. "La réunion de ce matin" devient "45 minutes de ma vie que je ne récupérerai jamais, sacrifiées sur l'autel du reporting trimestriel." Même information, emballage différent.

Comment développer cette habitude : prends un événement banal de ta journée et essaie de le raconter de 3 façons différentes. La version neutre, la version dramatique et la version absurde. La version absurde est souvent la plus drôle.

Habitude 3 : Elles ne se prennent pas au sérieux. L'autodérision est le trait commun de toutes les personnes marrantes. Elles assument leurs défauts avec humour. Elles se moquent d'elles-mêmes avant que les autres ne le fassent. Et ça les rend immédiatement sympathiques et accessibles. Blanche Gardin en a fait un art : elle transforme ses galères les plus intimes en matière comique, et le public l'adore pour ça. Fary fait pareil avec ses observations sur sa propre culture et ses contradictions — c'est drôle parce que c'est vrai et assumé.

Comment développer cette habitude : identifie 2-3 défauts légers chez toi (sens de l'orientation catastrophique, incapacité à cuisiner, retard chronique) et prépare des blagues dessus. La prochaine fois qu'on te fait remarquer un de ces défauts, tu auras ta réponse prête.

Habitude 4 : Elles dosent. Les personnes marrantes ne sont pas "on" en permanence. Elles sentent quand c'est le bon moment et quand ce ne l'est pas. Elles savent que l'humour constant fatigue, et que le silence rend les prochaines saillies encore plus impactantes.

Devenir marrant quand on est introverti

Être introverti et être marrant ne sont absolument pas incompatibles. Beaucoup de grands humoristes sont introvertis dans la vie — Panayotis Pascot en est un exemple frappant : calme et réservé en interview, dévastateur sur scène. L'introversion te donne même un avantage : tu observes plus, tu réfléchis plus, et quand tu parles, les gens écoutent. La personne silencieuse qui lâche une pépite de temps en temps fait souvent plus rire que le bavard qui mitraille. Roman Frayssinet construit tout son humour sur l'observation silencieuse du quotidien — et ça cartonne.

Devenir marrant au bureau

La machine à café, les réunions, le déjeuner — ce sont tes terrains d'entraînement. Commence par des observations sur la vie de bureau. Les gens adorent rire de leur quotidien professionnel parce que ça crée de la complicité. "Est-ce que quelqu'un comprend vraiment à quoi sert cette réunion, ou on fait tous semblant ?" — ce genre d'observation honnête et légère, ça crée immédiatement du lien.

Devenir marrant après une période difficile

Après une séparation, un deuil ou une période de stress intense, l'humour est souvent la première chose qu'on perd. Et c'est normal. Mais retrouver sa légèreté est un acte de reconstruction puissant. Commence doucement. Regarde des comédies, écoute des podcasts drôles, entoure-toi de personnes positives. L'humour reviendra naturellement, comme un muscle qui se réveille après un long repos.

Le plan d'action pour devenir marrant en 6 semaines

Semaines 1-2 : Observer et noter. 3 observations par jour. Pas de pression pour être drôle.

Semaines 3-4 : Reformuler et partager. Transforme tes meilleures observations en formulations drôles. Partage-les avec des amis proches.

Semaines 5-6 : Intégrer et élargir. Utilise tes observations et reformulations dans des contextes plus larges (bureau, soirées, réseaux sociaux). Note ce qui marche.

Sur deviens-marrant.fr, on propose exactement ce type de progression structurée avec le Parcours Confiance (6 semaines). Des blagues à mémoriser, des techniques à pratiquer, des vidéos de pros à analyser, et un suivi de ta progression avec des XP et des streaks. Deviens la personne marrante du groupe, à ton rythme. Essaie gratuitement.`,
    date: "2026-03-11",
    readingTime: "7 min",
    category: "GUIDE",
  },
  {
    slug: "devenir-plus-drole",
    title: "Comment devenir plus drôle au quotidien : 8 habitudes simples",
    excerpt:
      "Tu fais parfois sourire mais tu voudrais faire franchement rire ? Voici 8 habitudes simples à adopter pour devenir progressivement plus drôle dans ta vie de tous les jours.",
    content: `Tu n'es pas "pas drôle". Tu fais sourire de temps en temps, tu as tes moments, mais tu voudrais que ces moments soient plus fréquents. Tu voudrais passer de "il est sympa" à "il est vraiment drôle". C'est un objectif très atteignable, et il ne demande pas de transformation radicale — juste quelques habitudes quotidiennes.

Pourquoi "plus drôle" est plus réaliste que "drôle"

Le piège, c'est de viser la perfection comique. Tu n'as pas besoin de devenir humoriste professionnel. Tu as besoin de rendre tes conversations 20 % plus drôles. Et 20 %, ça se fait avec des petits ajustements, pas avec une refonte complète de ta personnalité.

Habitude 1 : Consomme de l'humour chaque jour

On devient ce qu'on consomme. Si tu ne regardes que des drames et des documentaires, ton cerveau n'est pas en "mode humour". Intègre 15 minutes de contenu drôle par jour : un sketch de Paul Mirabel ou Fary, un podcast humoristique, des vidéos de Blanche Gardin ou Florence Foresti. Ton cerveau va progressivement adopter les patterns de l'humour — la surprise, le décalage, le timing. C'est comme ça que les humoristes se forment eux-mêmes : Gad Elmaleh regardait des heures de Jerry Seinfeld, Roman Frayssinet épluchait les sketchs de Pierre Desproges.

Habitude 2 : Le carnet d'observations drôles

Aie un endroit (note sur ton téléphone) où tu notes les situations drôles que tu observes au quotidien. Le collègue qui dit "on va faire court" et parle pendant 45 minutes. La file d'attente à la boulangerie qui ressemble à une scène de film. Tu développes ainsi ton "radar à humour". En quelques semaines, tu verras du potentiel comique partout.

Habitude 3 : Reformule au lieu de raconter

Au lieu de dire "J'ai eu une réunion ennuyeuse", essaie "J'ai survécu à 2 heures de PowerPoint, je devrais recevoir une médaille." Même information, mais la reformulation ajoute de l'humour. C'est la technique la plus simple et la plus efficace pour devenir plus drôle au quotidien. Tu ne changes pas le fond, tu changes la forme.

Habitude 4 : Pratique la règle du "oui, et..."

C'est la règle d'or de l'improvisation théâtrale. Quand quelqu'un dit quelque chose, au lieu de bloquer, tu enchéris. "Il fait froid aujourd'hui" → "Oui, et je suis à peu près sûr que mes orteils ont fait sécession." Tu construis sur ce que l'autre a dit au lieu de couper la dynamique.

Habitude 5 : Maîtrise 5 blagues par cœur

Pas 50, pas 100. Juste 5 blagues courtes, adaptées à des situations courantes, que tu peux ressortir à tout moment. Une pour le bureau, une pour les dîners, une passe-partout, une sur toi-même, une sur l'actualité (à renouveler). Comme un musicien qui a ses morceaux de référence, avoir un petit répertoire prêt te donne de la confiance.

Habitude 6 : Travaille tes réactions

L'humour, c'est pas seulement ce que tu inities. C'est aussi comment tu réagis. Quand quelqu'un raconte quelque chose, entraîne-toi à trouver l'angle drôle dans ta réponse. Pas à chaque fois — ça serait épuisant — mais une fois sur trois ou quatre. C'est la répartie conversationnelle, et elle se développe avec la pratique.

Habitude 7 : Ose le silence

Les gens les plus drôles ne parlent pas tout le temps. Ils observent, ils écoutent, et quand ils parlent, c'est pour dire quelque chose qui a de l'impact. Le silence crée l'espace pour que ta prochaine remarque ait plus de poids. C'est contre-intuitif, mais parler moins te rend souvent plus drôle.

Habitude 8 : Accepte les échecs

Chaque blague qui tombe à plat est une donnée. Pas un drame, une donnée. Les stand-uppers professionnels testent 100 blagues pour en garder 10. Ton taux de réussite sera meilleur parce que tu as l'avantage du contexte conversationnel, mais l'échec fait partie du processus. La personne qui n'échoue jamais est celle qui n'essaie jamais.

Ces habitudes s'adaptent à ta situation

Si tu es étudiant et que tu veux être plus drôle en soirée ou en coloc, commence par les habitudes 1 et 5 : consomme de l'humour chaque jour et mémorise 5 blagues. Tu auras toujours quelque chose à sortir. Si tu es au bureau et que tu veux briller à la machine à café ou en réunion, les habitudes 2 et 3 sont tes meilleures alliées : observe les absurdités du quotidien professionnel et reformule-les. Et si tu traverses une période où tu as perdu ta légèreté — après une séparation, un changement de vie, un passage à vide — l'habitude 8 est la plus importante : accepte que les premiers essais seront imparfaits, et donne-toi le droit de réapprendre à être drôle à ton rythme.

Mettre tout ça ensemble

Tu n'as pas besoin d'appliquer les 8 habitudes dès demain. Choisis-en 2 et intègre-les pendant 2 semaines. Puis ajoute-en 2 autres. En un mois, tu auras transformé tes conversations quotidiennes. Les gens autour de toi le remarqueront, et ce cercle vertueux (plus de rires → plus de confiance → plus d'humour) s'enclenchera naturellement.

Pour accélérer ta progression, deviens-marrant.fr te propose des blagues à mémoriser, des techniques de répartie avec exercices, et des vidéos de stand-up analysées. Le tout avec un système de progression qui te motive (XP et streaks). Commence gratuitement et deviens plus drôle, un jour à la fois.`,
    date: "2026-03-09",
    readingTime: "6 min",
    category: "GUIDE",
  },
  {
    slug: "apprendre-a-etre-drole",
    title: "Apprendre à être drôle : par où commencer quand on part de zéro",
    excerpt:
      "Tu te trouves pas drôle du tout et tu ne sais pas par où commencer ? Cet article est ton point de départ. Pas de prérequis, pas de talent nécessaire.",
    content: `"Je ne suis pas drôle." Si tu as déjà prononcé cette phrase, cet article est écrit pour toi. Pas pour le gars qui fait déjà rire mais veut s'améliorer. Pour toi, qui pars de zéro (ou qui penses partir de zéro). Spoiler : tu ne pars pas vraiment de zéro. Tu as déjà un sens de l'humour — il est juste en sommeil.

Pourquoi tu penses ne pas être drôle

La plupart des gens qui se décrivent comme "pas drôles" ont en fait un bon sens de l'humour... dans leur tête. Ils pensent des trucs drôles mais ne les disent pas. Ils trouvent des répliques parfaites mais les gardent pour eux. Pourquoi ? La peur du jugement. La peur du silence gêné. La peur que les autres ne rient pas.

Le premier pas pour apprendre à être drôle, c'est pas d'apprendre des blagues. C'est de comprendre que cette peur est normale, universelle, et surmontable. Même les humoristes professionnels ont peur avant de monter sur scène. Paul Mirabel a raconté qu'il tremblait avant ses premiers passages au Jamel Comedy Club. Blanche Gardin avoue avoir le trac à chaque spectacle. Fary, malgré son aisance apparente, a mis des années à trouver son style. La différence, c'est qu'ils montent quand même.

Étape 1 : Réapprends à observer

L'humour commence par l'observation. Pas l'observation "je regarde le monde", l'observation "je remarque ce que les autres ignorent". Le panneau d'affichage qui contredit le précédent. Le collègue qui envoie un email de 3 paragraphes pour dire "OK". Le chat qui te fixe comme s'il planifiait un coup d'état.

Exercice concret : pendant 7 jours, note sur ton téléphone au moins 2 choses absurdes, bizarres ou contradictoires que tu observes dans ta journée. Ne te censure pas. Même les observations "pas drôles" comptent. Tu entraînes ton œil, pas ton public.

Étape 2 : Commence par l'écrit

Si tu as peur de parler, commence par écrire. Envoie un message drôle à un ami. Commente une story avec une observation amusante. Écris tes reformulations drôles dans tes notes. L'écrit te donne du temps. Tu peux réfléchir, éditer, peaufiner. C'est un terrain d'entraînement sans pression.

Exercice concret : chaque jour, envoie à un ami un message qui reformule un événement banal de façon drôle. "Ma réunion de ce matin, c'était comme un épisode de série que personne n'a demandé — long, sans intrigue et avec un cliffhanger qui n'intéresse personne."

Étape 3 : Mémorise quelques classiques

Avant de créer ton propre humour, commence par emprunter celui des autres. Mémorise 3 à 5 blagues courtes et universelles. Pas des blagues de comptoir interminables. Des one-liners, des observations drôles, des retours rapides. C'est ton filet de sécurité. Quand la conversation s'y prête, tu en sors une. Et le rire des autres te donne confiance pour la suite.

Exercice concret : va sur la section Blagues de deviens-marrant.fr, choisis 5 blagues qui te font vraiment rire, et mémorise-les. Teste-les avec un ami cette semaine.

Étape 4 : Apprends une seule technique de répartie

Pas 10 techniques, une seule. L'accusé de réception : quand quelqu'un te lance une remarque, réponds "Intéressant" avec un sourire. Ces 2-3 secondes te donnent le temps de trouver ta réponse. C'est simple, c'est universel, et ça marche dans 100 % des situations. Une fois que cette technique est automatique, tu en apprendras d'autres.

Étape 5 : Accepte la courbe d'apprentissage

Apprendre à être drôle, c'est comme apprendre à nager. Les premiers cours sont maladroits et inconfortables. Tu bois la tasse. Mais un jour, tu flottes. Et là, ça devient naturel. Le plus dur, c'est de commencer et de persévérer pendant les premières semaines. Après, l'effet boule de neige se met en place.

Le piège de la comparaison

Ne te compare pas aux gens qui sont drôles depuis 20 ans. Compare-toi à toi-même d'il y a une semaine. Tu as fait rire un collègue avec une observation ? Victoire. Tu as osé une blague qui a fait sourire ? Victoire. Chaque micro-progrès compte. Panayotis Pascot a commencé par des vidéos YouTube timides avant de remplir des salles. Pierre Croce faisait des sketchs dans sa chambre avant de devenir une référence. Tout le monde commence quelque part.

Le plan de démarrage sur 2 semaines

Jours 1-3 : Observer et noter. 2 observations absurdes par jour. Pas besoin qu'elles soient drôles.

Jours 4-7 : Écrire et reformuler. Prends tes observations et reformule-les par écrit. Envoie la meilleure à un ami chaque jour.

Jours 8-10 : Mémoriser. Choisis 5 blagues courtes sur deviens-marrant.fr et apprends-les par cœur.

Jours 11-14 : Tester. Ressors une blague en conversation. Utilise l'accusé de réception quand on te chambre. Note comment tu te sens.

Apprendre à être drôle quand on est timide

Si tu es timide, tu as un super-pouvoir que tu ignores : les gens s'attendent pas à ce que tu sois drôle. Donc quand tu lâches une réplique bien placée, l'effet de surprise est doublé. La personne silencieuse qui sort une pépite de temps en temps fait souvent beaucoup plus rire que le bavard qui mitraille. Utilise ta discrétion comme un atout.

Sur deviens-marrant.fr, on a conçu des parcours spécialement pour les débutants et les personnes timides. Le Parcours Répartie (4 semaines) te guide pas à pas, avec des exercices que tu peux pratiquer seul avant de les tester en situation réelle. Gagne des XP, maintiens ton streak, et regarde ta confiance grandir semaine après semaine. Commence gratuitement.`,
    date: "2026-03-08",
    readingTime: "7 min",
    category: "GUIDE",
  },
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find((article) => article.slug === slug);
}
