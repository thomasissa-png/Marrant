export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readingTime: string;
  category: string;
  faqs?: { question: string; answer: string }[];
}

export const blogArticles: BlogArticle[] = [
  {
    slug: "techniques-repartie",
    title: "7 techniques de répartie qui marchent vraiment",
    excerpt:
      "Tu restes muet quand on te lance une pique ? Voici 7 techniques concrètes pour avoir toujours une réponse prête, sans devenir agressif.",
    content: `Tu connais ce moment gênant où quelqu'un te lance une remarque, et tu restes planté là, bouche ouverte, sans rien trouver à dire ? Et bien sûr, la réplique parfaite te vient... deux heures plus tard sous la douche. Bonne nouvelle : **la répartie, ça s'apprend**. Voici 7 techniques qui marchent vraiment, testées et approuvées.

## 1. Accuser réception

La technique la plus simple et la plus sous-estimée. Quelqu'un te balance une remarque ? Au lieu de paniquer, commence par **accuser réception** : "Intéressant", "Pas faux", "Bien vu". Ça te donne 2 à 3 secondes pour formuler ta vraie réponse. C'est exactement ce que font les humoristes en spectacle quand un spectateur les interpelle. **Jamel Debbouze** est un maitre en la matière : il accuse réception, sourit, puis retourne la situation.

## 2. Rebondir sur un mot-clé

Prends un mot dans la phrase de l'autre et construis ta réponse dessus. Si on te dit "T'es toujours en retard", tu rebondis sur "toujours" : "Toujours ? La dernière fois j'étais à l'heure, c'est juste que personne ne m'a vu." **Simple, efficace, et ça montre que tu écoutes.**

## 3. Retourner la situation

Au lieu de te défendre, retourne la remarque vers l'autre personne. "Tu manges encore ?" devient "Oui, et toi tu surveilles encore ce que mangent les gens ?". **Florence Foresti** utilise beaucoup cette technique dans ses spectacles. Tu prends le pouvoir sans être méchant.

## 4. La fausse naiveté

Fais semblant de ne pas comprendre l'attaque. "Ah bon ? Qu'est-ce que tu veux dire exactement ?" Ça met l'autre dans une position inconfortable, parce qu'expliquer une vanne, c'est la tuer. En plus, ça te donne du temps pour préparer ta contre-attaque.

## 5. Le redirect

Change complètement de sujet de façon absurde. On te fait une remarque sur ta coiffure ? "Merci, et sinon t'as vu le prix des tomates ?" L'absurdité crée le rire et montre que la remarque ne t'atteint pas du tout. **Kev Adams** utilise souvent ce type de pivot dans ses interactions avec le public.

## 6. Le miroir

Répète exactement ce que l'autre vient de dire, mais avec un ton différent. Quelqu'un dit "T'es bizarre quand même", tu réponds "T'es bizarre quand même" avec un sourire complice. Ça crée un **effet comique immédiat** et ça désarme complètement l'autre.

## 7. L'escalade comique

Prends la remarque et pousse-la à l'extrême. "T'es toujours fatigué" devient "Fatigué ? Je suis au-delà de la fatigue. Je suis dans une dimension parallèle où le café n'existe pas. Envoie de l'aide." **Gad Elmaleh** est le roi de l'escalade comique : il part d'une observation banale et monte, monte, monte jusqu'à l'absurde.

**Le secret, c'est de pratiquer.** Commence par une ou deux techniques, utilise-les dans des situations à faible enjeu (avec des amis, en famille), puis élargis petit à petit. La répartie, c'est comme un muscle : plus tu l'entraines, plus elle devient naturelle.

Ces techniques marchent dans toutes les situations. Tu es étudiant et tu restes muet quand tes potes te chambrent en soirée ? **L'accusé de réception et le redirect absurde** vont devenir tes meilleurs alliés. Tu veux avoir de la conversation à la machine à café au bureau ? **Le rebond sur mot-clé** transforme n'importe quelle remarque banale en moment drôle. Tu traverses une période difficile et tu veux retrouver ta légèreté dans tes interactions ? **L'autodérision et le miroir** sont des techniques douces qui permettent de renouer avec l'humour sans forcer.

Tu veux aller plus loin ? Sur deviens-marrant.fr, on a des exercices interactifs pour pratiquer chaque technique avec des mises en situation concrètes. Découvre nos [parcours](/parcours) progressifs et nos [vannes](/vannes) à mémoriser. **Rejoins-nous dès 0,99 €/mois** et tu verras la différence en quelques jours.`,
    date: "2026-03-10",
    readingTime: "5 min",
    category: "REPARTIE",
    faqs: [
      { question: "Comment avoir de la répartie rapidement ?", answer: "La technique la plus rapide est l'accusé de réception : répondre « Intéressant » ou « Pas faux » pour gagner 2-3 secondes, puis rebondir sur un mot-clé de la phrase. Avec de la pratique, ça devient automatique en quelques semaines." },
      { question: "Est-ce que la répartie s'apprend ?", answer: "Oui, la répartie repose sur des techniques précises (miroir, redirect, fausse naïveté) qui se travaillent comme un muscle. Les humoristes pros comme Jamel Debbouze ou Florence Foresti les ont perfectionnées au fil des années." },
      { question: "Comment répondre à une pique sans être méchant ?", answer: "Utilisez le retournement de situation ou l'escalade comique : prenez la remarque et poussez-la à l'absurde. Ça désamorce l'attaque par le rire sans créer de conflit." },
    ],
  },
  {
    slug: "apprendre-etre-drole",
    title: "Peut-on vraiment apprendre à être drôle ?",
    excerpt:
      "\"Être drôle, c'est inné.\" Faux. La science prouve le contraire. Voici pourquoi l'humour est une compétence comme une autre, et comment la développer.",
    content: `"Soit t'es drôle, soit tu l'es pas." On a tous entendu cette phrase. Et c'est probablement le plus gros mythe sur l'humour. La vérité ? **L'humour est une compétence.** Et comme toute compétence, elle s'apprend, se travaille et se perfectionne.

## Le mythe du "don naturel"

Quand tu vois **Jamel Debbouze** improviser sur scène, ça a l'air tellement naturel que tu te dis qu'il est né comme ça. Sauf que Jamel a commencé au Café de la Gare, à enchainer des scènes devant des salles vides. **Gad Elmaleh** raconte qu'il écrivait des dizaines de vannes par jour pour en garder une seule. **Florence Foresti** a mis des années à trouver son personnage. Derrière chaque "naturel", il y a des heures de travail.

## Ce que dit la science

Des chercheurs de l'Université du Nouveau-Mexique ont montré que l'humour repose sur des **mécanismes cognitifs précis** : la détection d'incongruité, la résolution de tension, le timing. Ce sont des processus que le cerveau peut apprendre à maitriser. Une étude publiée dans le *Journal of Positive Psychology* a même démontré qu'un entrainement de 8 semaines à l'humour améliorait significativement la capacité des participants à faire rire.

## Les 3 piliers de l'humour qui s'apprennent

**L'observation** est le premier pilier. Les gens drôles voient le monde différemment. Ils remarquent les absurdités du quotidien. Bonne nouvelle : ça se travaille. Commence par noter chaque jour une situation bizarre ou contradictoire que tu as observée. En quelques semaines, ton "radar à humour" sera beaucoup plus affuté.

Le deuxième pilier, c'est **la structure**. Une blague, c'est setup + punchline. Une anecdote drôle, c'est contexte + tension + chute. Ces structures sont identifiables, reproductibles et perfectibles. C'est pas de la magie, c'est de l'architecture.

Le troisième pilier, c'est **la pratique**. Comme un instrument de musique, l'humour se joue. Plus tu essaies de faire rire (même si tu te plantes), plus tu développes ton instinct. Les open mics de stand-up, c'est exactement ça : un terrain d'entrainement.

## Comment progresser concrètement

Commence petit. Fais des observations drôles en privé, dans ta tête. Ensuite, partage-les avec un ami proche. Puis élargis le cercle. Note ce qui marche et ce qui ne marche pas. Regarde des spectacles et analyse pourquoi tu ris : quel mot, quel silence, quelle expression a déclenché le rire ?

**L'erreur classique, c'est de vouloir être hilare dès le premier essai.** L'humour, c'est un marathon, pas un sprint. Chaque vanne qui tombe à plat est une leçon. Chaque sourire arraché est une victoire.

Et ça fonctionne pour tout le monde. Si tu es étudiant timide qui galère à prendre la parole en TD ou en soirée, **l'observation** est ton meilleur point d'entrée : note ce que tu remarques, sans pression. Si tu cherches à alimenter tes conversations au bureau ou à l'afterwork, **la structure setup/punchline** va transformer tes anecdotes de pause déjeuner. Et si tu traverses une période où tu as perdu ta légèreté, **la pratique progressive** te permet de retrouver ton humour à ton rythme, sans te forcer. **Paul Mirabel**, **Fary**, **Panayotis Pascot** — ces humoristes de la nouvelle génération prouvent chaque jour que l'humour se construit et s'affine avec le temps.

Sur deviens-marrant.fr, on a conçu des [parcours](/parcours) progressifs pour développer ton humour étape par étape, avec des exercices concrets et un suivi de ta progression. **Rejoins-nous dès 0,99 €/mois** et découvre ton potentiel comique.`,
    date: "2026-03-05",
    readingTime: "4 min",
    category: "OBSERVATION",
    faqs: [
      { question: "Peut-on vraiment apprendre à être drôle ?", answer: "Oui. L'humour repose sur des mécanismes cognitifs (détection d'incongruité, résolution de tension, timing) que le cerveau peut apprendre à maîtriser. Des études scientifiques montrent qu'un entraînement de 8 semaines améliore significativement la capacité à faire rire." },
      { question: "Quels sont les 3 piliers de l'humour ?", answer: "L'observation (repérer les absurdités du quotidien), la structure (setup + punchline), et la pratique régulière. Ces trois compétences se développent avec des exercices concrets." },
      { question: "Comment devenir drôle quand on est introverti ?", answer: "L'introversion est un atout : vous observez plus et parlez moins, ce qui rend vos interventions plus marquantes. Commencez par l'observation et l'écriture avant de passer à l'oral." },
    ],
  },
  {
    slug: "timing-humour",
    title: "Le timing en humour : pourquoi c'est plus important que la blague",
    excerpt:
      "La même blague peut faire un tabac ou tomber à plat. La différence ? Le timing. Découvre comment maitriser cet art invisible.",
    content: `Tu as déjà raconté une blague que tu trouvais excellente, et... silence. Personne ne rit. Puis un pote raconte quasiment la même chose 10 minutes plus tard et tout le monde explose de rire. Frustrant ? Normal. Le problème n'était pas ta blague, c'était ton **timing**.

## Pourquoi le timing change tout

Le timing, c'est **l'art de dire le bon mot au bon moment**. C'est ce qui sépare une blague qui fait mouche d'une blague qui tombe dans le vide. Les meilleurs humoristes le savent : le silence avant la punchline vaut autant que la punchline elle-même. Regarde un spectacle de **Gad Elmaleh** au ralenti. Tu verras qu'il marque des pauses de 2 à 3 secondes avant ses chutes. Ce silence crée de la tension, et le rire est la libération de cette tension.

## La règle des 3 secondes

Quand tu veux placer une réplique drôle en conversation, **attends 3 secondes** après que la personne a fini de parler. Pas 1 seconde (trop rapide, on dirait que tu n'écoutais pas). Pas 10 secondes (le moment est passé). 3 secondes, c'est le sweet spot. Ça donne l'impression que tu réfléchis, que ta réponse est spontanée mais pesée. C'est exactement ce que font les grands improvisateurs.

## Le pouvoir du silence

La plupart des gens ont peur du silence. Ils débitent leur blague à toute vitesse pour en finir. Grave erreur. **Le silence est ton meilleur allié.** Avant ta punchline, marque une pause. Regarde ton interlocuteur. Laisse la tension monter. Puis lâche ta chute. **Florence Foresti** est redoutable pour ça : elle peut tenir un silence de 5 secondes en regardant le public, et la salle est déjà en train de rire avant même qu'elle ait dit un mot.

## La pause avant la punchline

Voici la structure parfaite. Tu racontes le setup normalement, à un rythme conversationnel. Quand tu arrives juste avant la chute, tu ralentis. Tu baisses légèrement le volume. Tu marques une **micro-pause**. Puis tu délivres la punchline avec un changement de ton ou de rythme. C'est ce **contraste** qui déclenche le rire.

## Lire la pièce

Le timing, c'est aussi **savoir lire l'ambiance**. Est-ce que les gens sont détendus ou tendus ? Est-ce qu'ils discutent légèrement ou ont une conversation sérieuse ? Placer une blague au mauvais moment, même une bonne blague, c'est le meilleur moyen de tuer l'ambiance. Les bons humoristes sentent la salle. En conversation, c'est pareil : observe avant de parler.

## Le timing dans la vraie vie

Le timing, ça change tout dans tes interactions quotidiennes. En soirée, quand tu sens que le groupe est en train de rire d'un sujet, c'est le moment de placer ton observation — pas 5 minutes après quand tout le monde est passé à autre chose. À la machine à café, la remarque drôle qui fonctionne, c'est celle qui arrive dans le silence naturel entre deux gorgées, pas celle que tu balances en coupant quelqu'un. Et si tu traverses une période où tu as du mal à trouver ta place dans les conversations, le timing t'aide justement à faire mouche avec moins de mots — **une seule remarque bien placée vaut mieux que dix tentatives précipitées**. **Fary** et **Paul Mirabel** sont d'excellents exemples de timing moderne : ils utilisent des silences longs et des changements de rythme qui créent une tension irrésistible.

## Comment pratiquer

Commence par observer. Regarde des spectacles de stand-up et chronométre les pauses. Note quand les rires arrivent par rapport aux silences. Ensuite, dans tes conversations, force-toi à attendre avant de répondre. Résiste à l'envie de combler le silence. Tu seras surpris de l'effet.

Envie de travailler ton timing avec des exercices interactifs ? Sur deviens-marrant.fr, chaque [conseil](/conseils) vient avec une mise en situation pour t'entrainer. **Rejoins-nous dès 0,99 €/mois**, ça prend 5 minutes par jour.`,
    date: "2026-02-28",
    readingTime: "4 min",
    category: "TIMING",
    faqs: [
      { question: "C'est quoi le timing en humour ?", answer: "Le timing est l'art de dire le bon mot au bon moment. C'est le silence avant la punchline, la pause qui crée la tension, et le choix du moment idéal pour intervenir dans une conversation." },
      { question: "Comment améliorer son timing comique ?", answer: "Appliquez la règle des 3 secondes : attendez 3 secondes après que quelqu'un a fini de parler avant de placer votre réplique. Regardez des spectacles de stand-up et chronométrez les pauses des humoristes." },
      { question: "Pourquoi mes blagues tombent à plat ?", answer: "Le problème est souvent le timing, pas la blague. Évitez de débiter votre blague trop vite. Marquez une pause avant la chute, baissez le volume, puis délivrez la punchline avec un changement de rythme." },
    ],
  },
  {
    slug: "erreurs-blagues",
    title: "5 erreurs qui tuent tes blagues (et comment les éviter)",
    excerpt:
      "Tu racontes une blague et personne ne rit ? Tu fais peut-être une de ces 5 erreurs classiques. Voici comment les repérer et les corriger.",
    content: `On a tous vécu ce moment : tu racontes une blague, tu arrives à la chute, et... rien. Le silence. Ou pire, un sourire poli. Si ça t'arrive souvent, c'est probablement pas un problème de blague. **C'est un problème de livraison.** Voici les 5 erreurs les plus courantes et comment les corriger.

## Erreur 1 : Expliquer la blague

C'est l'erreur numéro 1. Tu fais ta blague, il y a un petit flottement, et tu paniques : "Tu vois, c'est drôle parce que...". Stop. **Expliquer une blague, c'est la tuer.** Si les gens n'ont pas compris, tant pis. Passe à autre chose. Les meilleurs humoristes laissent parfois une vanne sans réaction et continuent comme si de rien n'était. L'explication montre que tu doutes de toi, et le doute est l'ennemi du rire. Si **Jamel Debbouze** devait expliquer chaque vanne, ses spectacles dureraient 6 heures.

## Erreur 2 : Le mauvais timing

On en a parlé dans un autre article, mais ça mérite d'être répété. Placer une blague quand l'ambiance ne s'y prête pas, c'est le crash assuré. Quelqu'un raconte un problème sérieux ? C'est pas le moment de placer ta vanne sur les chats. **Apprends à sentir quand le groupe est réceptif.** En général, les meilleurs moments pour l'humour sont les transitions entre deux sujets et les petits silences naturels dans la conversation.

## Erreur 3 : Se tromper d'audience

La blague sur ton prof de fac, elle cartonne avec tes potes étudiants. Au diner de famille avec ta grand-mère ? Moins. **Adapter son humour à son audience, c'est fondamental.** Ce n'est pas de l'autocensure, c'est de l'intelligence sociale. **Kev Adams** ne fait pas le même show devant des ados et devant un public de gala. Le contenu peut changer, mais le talent reste le même.

## Erreur 4 : Le setup trop long

"Attends, attends, il faut que je t'explique le contexte. Alors en fait, y'a trois mois, j'étais chez mon pote, enfin pas vraiment mon pote, c'est le cousin de...". Tu as perdu ton public. **Un bon setup est court et efficace.** L'idéal : 1 à 2 phrases max avant la chute. Si tu as besoin de 5 minutes de contexte, c'est que ta blague n'est pas assez bien structurée. Retravaille-la. Les one-liners sont si efficaces justement parce que le setup est minimaliste.

## Erreur 5 : Le manque d'engagement

Tu marmonnes ta blague en regardant tes chaussures, avec un demi-sourire gêné ? Personne ne va rire. **L'engagement, c'est la confiance avec laquelle tu délivres ta réplique.** Regarde les gens dans les yeux. Assume ton humour. Même si la blague est moyenne, la confiance dans la livraison peut la sauver. À l'inverse, la meilleure blague du monde, livrée sans conviction, tombera à plat. **Florence Foresti** peut dire "Bonjour" et faire rire 3000 personnes, parce que son engagement est total.

## Ces erreurs dans la vraie vie

Si tu es du genre timide et que tu oses enfin une blague en soirée, l'erreur la plus fréquente c'est l'erreur 1 : tu expliques la chute parce que tu doutes. Résiste. Au bureau, l'erreur 2 est la plus courante : tu sors une [vanne](/vannes) pendant que ton manager parle d'un sujet sérieux. Apprends à sentir le moment. Et si tu essaies de retrouver ton humour après une période difficile, l'erreur 5 est ton ennemi principal : le manque d'engagement. Tu marmonnes ta blague parce que tu n'oses pas encore l'assumer. La confiance reviendra avec la pratique — **Roman Frayssinet** et **Blanche Gardin** sont la preuve que l'authenticité dans la livraison vaut plus que la blague elle-même.

## Le plan d'action

Choisis une erreur que tu fais souvent. **Une seule.** Et pendant une semaine, concentre-toi uniquement sur celle-là. La semaine suivante, passe à la suivante. En un mois, tu auras corrigé les erreurs les plus courantes et tes blagues auront beaucoup plus d'impact.

Tu veux des exercices pratiques pour travailler chaque point ? Sur deviens-marrant.fr, on a des mises en situation pour chaque type d'erreur. **Rejoins-nous dès 0,99 €/mois** et progresse à ton rythme.`,
    date: "2026-02-20",
    readingTime: "5 min",
    category: "STORYTELLING",
    faqs: [
      { question: "Quelles sont les erreurs les plus courantes quand on raconte une blague ?", answer: "Les 5 erreurs principales : expliquer la chute, mal choisir le moment, raconter une blague trop longue, ne pas assumer la livraison, et négliger la réaction du public. Corriger une seule erreur par semaine suffit pour progresser." },
      { question: "Comment savoir si c'est le bon moment pour une blague ?", answer: "Observez l'ambiance : si les gens sont détendus et rient déjà, c'est le moment. Si la conversation est sérieuse ou tendue, attendez un changement de ton naturel." },
      { question: "Pourquoi ne faut-il jamais expliquer une blague ?", answer: "Expliquer une blague tue l'effet de surprise qui déclenche le rire. Si personne ne rit, passez à autre chose avec le sourire. La confiance dans la livraison est plus importante que la blague elle-même." },
    ],
  },
  {
    slug: "autoderision-interactions",
    title: "Comment l'autodérision peut transformer tes interactions sociales",
    excerpt:
      "L'autodérision est un super-pouvoir social. Elle désarme, crée de la complicité et montre ta confiance. Mais attention aux pièges.",
    content: `L'autodérision, c'est **l'art de rire de soi-même**. Et c'est probablement la compétence sociale la plus puissante que tu puisses développer. Quand tu sais rire de toi, tu deviens immédiatement plus sympathique, plus accessible et plus drôle. Mais attention : mal utilisée, l'autodérision peut se retourner contre toi.

## Pourquoi l'autodérision fonctionne

Quand quelqu'un rit de lui-même, ton cerveau interprète ça comme un **signal de confiance**. "Cette personne est assez sûre d'elle pour plaisanter sur ses défauts." C'est exactement l'inverse de ce qu'on pourrait croire. L'autodérision ne montre pas de la faiblesse, elle montre de la force. **Jamel Debbouze** plaisante sur sa main, **Gad Elmaleh** sur ses origines, **Florence Foresti** sur ses galères de mère. Aucun d'entre eux ne parait faible. Au contraire, ils dégagent une confiance folle.

## La règle d'or : confiance vs insécurité

Voilà le piège. Il y a une différence énorme entre **rire de soi avec confiance** et **se dénigrer par insécurité**. "Je suis nul en cuisine, la dernière fois j'ai fait bruler de l'eau" dit avec le sourire, c'est de l'autodérision. "Je suis nul, de toute façon je rate tout" dit avec un air triste, c'est de l'auto-sabotage. La différence ? Le ton et l'intention. L'autodérision positive vise à créer du rire et de la connexion. L'auto-dénigrement vise (inconsciemment) à obtenir de la pitié.

## Les 3 règles de l'autodérision réussie

**Première règle** : plaisante sur des choses peu importantes. Ton sens de l'orientation catastrophique, ta passion suspecte pour les séries B, ton incapacité à faire un créneau. Pas sur des sujets qui te blessent vraiment. Si ça te fait mal d'en parler, c'est pas de l'autodérision, c'est une blessure ouverte.

**Deuxième règle** : souris quand tu le dis. Le sourire signale au cerveau de l'autre que c'est de l'humour, pas un appel à l'aide. Sans le sourire, la même phrase peut être interprétée comme de la tristesse.

**Troisième règle** : ne le fais pas tout le temps. Si chaque phrase que tu dis est une blague sur toi, les gens vont finir par te prendre au sérieux. L'autodérision, c'est un outil ponctuel, pas une identité.

## Comment l'autodérision transforme les interactions

En groupe, l'autodérision **casse la glace**. Tu arrives dans une soirée où tu ne connais personne ? "Excusez-moi, je suis le gars qui connait personne et qui hésite entre le buffet et la sortie de secours." Rires garantis, et soudain tu es approchable.

En conflit, l'autodérision **désamorce**. Quelqu'un te reproche d'être en retard ? "Tu as raison, mon rapport au temps est un mystère même pour moi." La tension retombe immédiatement.

En séduction, l'autodérision **crée de l'authenticité**. Dans un monde où tout le monde essaie de paraitre parfait, quelqu'un qui assume ses imperfections avec humour, c'est rafraichissant.

## Exemples concrets pour commencer

Au boulot : "Je suis le genre de personne qui met 10 minutes à comprendre la machine à café, mais donne-moi un tableur Excel et je te fais des miracles."

Entre amis : "Mon sens de l'orientation est tellement mauvais que Google Maps m'a bloqué."

En rendez-vous : "Je te préviens, je suis très nul pour choisir au restaurant. Ma dernière commande aventureuse, c'était un menu enfant."

L'autodérision est un muscle qui se développe. Commence par des petites remarques en terrain connu (amis proches, famille), puis élargis progressivement. Sur deviens-marrant.fr, tu trouveras des exercices guidés et des [conseils](/conseils) pour développer ton autodérision sans tomber dans les pièges. **Rejoins-nous dès 0,99 €/mois** et découvre cette arme secrète.`,
    date: "2026-02-15",
    readingTime: "4 min",
    category: "AUTODERISION",
    faqs: [
      { question: "C'est quoi l'autodérision ?", answer: "L'autodérision consiste à rire de soi-même de façon contrôlée. C'est pointer un défaut mineur avec humour pour créer de la sympathie et de la connivence, sans se dévaloriser." },
      { question: "Comment faire de l'autodérision sans se rabaisser ?", answer: "La règle d'or : visez les défauts mineurs (retard, maladresse, sens de l'orientation), jamais les insécurités profondes. Le ton doit être complice, pas victimisant." },
      { question: "Pourquoi l'autodérision fonctionne-t-elle aussi bien ?", answer: "L'autodérision désarme les tensions, rend accessible et sympathique. Elle signale une intelligence émotionnelle forte et une confiance en soi paradoxale : seuls les gens à l'aise avec eux-mêmes peuvent rire d'eux-mêmes." },
    ],
  },
  {
    slug: "comment-devenir-drole",
    title: "Comment devenir drôle : le guide complet pour développer son humour",
    excerpt:
      "Tu veux devenir drôle mais tu ne sais pas par où commencer ? Ce guide complet te donne les clés pour développer ton sens de l'humour pas à pas, avec des exercices concrets.",
    content: `Tu rêves d'être la personne qui fait rire tout le monde, celle qui détend l'atmosphère d'une seule phrase ? Bonne nouvelle : **devenir drôle, ça s'apprend**. Ce n'est pas réservé aux humoristes professionnels ou aux "naturels". C'est une compétence que tout le monde peut développer avec les bonnes méthodes et un peu de pratique quotidienne.

## Pourquoi certaines personnes semblent naturellement drôles

Spoiler : elles ne le sont pas. Ce que tu perçois comme du "talent naturel" est en réalité le résultat de **milliers de micro-apprentissages inconscients**. Les personnes drôles ont grandi dans un environnement où l'humour était valorisé, elles ont observé, imité, échoué et recommencé des milliers de fois. **Jamel Debbouze** n'est pas né drôle. Il a passé des années au Café de la Gare à tester des vannes devant des salles vides. La différence entre toi et la personne "naturellement drôle", c'est simplement le nombre d'heures de pratique.

## Les 5 piliers pour devenir drôle

**Premier pilier : l'observation.** Les gens drôles voient le monde autrement. Ils repèrent les contradictions, les absurdités et les décalages que tout le monde ignore. Comment développer ton œil ? Note chaque jour une situation absurde que tu as observée. Au bout de 30 jours, tu auras un répertoire de 30 observations potentiellement drôles. C'est la matière première de l'humour.

**Deuxième pilier : la surprise.** L'humour repose presque toujours sur un décalage entre ce qu'on attend et ce qui arrive. C'est le principe du setup/punchline. Le setup crée une attente, la punchline la casse. Pour devenir drôle, entraîne-toi à trouver l'angle inattendu dans chaque situation. Si tout le monde pense A, pense B.

**Troisième pilier : le timing.** Dire le bon mot au bon moment, c'est 50 % du travail. Un silence de 2 secondes avant ta punchline crée de la tension. La chute libère cette tension sous forme de rire. Entraîne-toi à résister à l'envie de combler les silences. Le timing, ça se travaille comme un instrument de musique.

**Quatrième pilier : l'autodérision.** C'est l'arme secrète des gens drôles. Quand tu sais rire de toi-même, tu deviens immédiatement sympathique et accessible. L'autodérision montre de la confiance, pas de la faiblesse. **Florence Foresti**, **Gad Elmaleh**, **Blanche Gardin** — ils rient tous d'eux-mêmes constamment.

**Cinquième pilier : la pratique délibérée.** Tu ne deviendras pas drôle en lisant des articles (celui-ci inclus). Tu deviendras drôle en pratiquant. Commence avec des amis proches, dans des situations à faible enjeu. Teste une observation drôle par jour. Analyse ce qui marche et ce qui ne marche pas. C'est exactement ce que font les stand-uppers avec les open mics.

## Un plan d'action concret sur 30 jours

**Semaine 1 : L'observation.** Note chaque jour une situation bizarre, contradictoire ou absurde. Ne cherche pas à être drôle, cherche juste à observer. Le matin dans les transports, à la machine à café, dans la queue du supermarché.

**Semaine 2 : La reformulation.** Prends tes observations de la semaine 1 et essaie de les reformuler de façon drôle. Cherche l'angle inattendu. Écris 3 versions de chaque observation et garde la meilleure.

**Semaine 3 : Le test.** Partage tes meilleures trouvailles avec un ami proche. Note ses réactions. Ce qui fait sourire, ce qui fait rire, ce qui tombe à plat. Pas de jugement, juste des données.

**Semaine 4 : L'expansion.** Utilise ce qui a marché en semaine 3 dans des contextes plus larges. En réunion, en soirée, sur les réseaux sociaux. Tu as maintenant un petit répertoire testé et approuvé.

## Les erreurs qui empêchent de devenir drôle

**L'erreur numéro 1 : attendre d'être "prêt".** Tu ne seras jamais prêt. Lance-toi. Les premières vannes tomberont à plat, et c'est normal. Même les pros ont un taux de réussite de 60-70 %. L'important, c'est de s'entraîner.

**L'erreur numéro 2 : copier les autres.** Regarder des humoristes pour comprendre les mécanismes, oui. Répéter leurs vannes, non. L'humour le plus efficace est personnel et authentique. Trouve TA voix.

**L'erreur numéro 3 : forcer.** L'humour forcé se sent à des kilomètres. Si une blague ne vient pas naturellement dans la conversation, ne la force pas. Les gens drôles ne sont pas "on" en permanence. Ils choisissent leurs moments.

## Le rôle de la confiance en soi

Il y a un **cercle vertueux** entre humour et confiance. Plus tu fais rire, plus tu as confiance. Plus tu as confiance, plus tu oses. Plus tu oses, plus tu fais rire. Le déclencheur ? Accepter que les premières tentatives seront imparfaites. Et c'est OK. Personne ne te jugera pour une blague qui tombe à plat, tant que tu ne la forces pas.

Sur deviens-marrant.fr, on a conçu des [parcours](/parcours) progressifs qui te guident pas à pas dans ce processus. Des [vannes](/vannes) à mémoriser, des techniques de répartie à pratiquer, des [vidéos](/videos) de pros à analyser, et un système de progression (XP + streaks) pour rester motivé. **Rejoins-nous dès 0,99 €/mois** et deviens la personne drôle du groupe.`,
    date: "2026-03-13",
    readingTime: "7 min",
    category: "GUIDE",
    faqs: [
      { question: "Comment devenir drôle rapidement ?", answer: "Commencez par consommer de l'humour chaque jour (stand-up, podcasts), observez les absurdités du quotidien et mémorisez 5 vannes courtes. En 2 à 4 semaines de pratique régulière, vous verrez une vraie différence." },
      { question: "Est-ce que tout le monde peut devenir drôle ?", answer: "Oui. L'humour est une compétence, pas un talent inné. Il repose sur l'observation, la structure et la pratique — trois piliers que n'importe qui peut développer avec les bons exercices." },
      { question: "Comment devenir drôle quand on est timide ?", answer: "La timidité est un atout : les gens ne s'attendent pas à ce que vous soyez drôle, donc l'effet de surprise est doublé. Commencez par l'humour écrit (messages, réseaux sociaux), puis passez à l'oral progressivement." },
    ],
  },
  {
    slug: "comment-avoir-de-la-repartie",
    title: "Comment avoir de la répartie : 10 techniques concrètes pour ne plus rester muet",
    excerpt:
      "Tu restes planté quand on te chambre ? Tu trouves la réplique parfaite 2 heures trop tard ? Voici 10 techniques concrètes pour avoir de la répartie dans toutes les situations.",
    content: `"Alors, t'as rien à dire ?" Cette phrase, tu l'as entendue (ou pensée) combien de fois ? La répartie — cette capacité à répondre du tac au tac avec à-propos et souvent avec humour — est l'une des compétences sociales les plus admirées. Et les plus frustrantes quand on ne l'a pas. Si tu es du genre à trouver la réplique parfaite sous la douche, 2 heures après la conversation, cet article est fait pour toi.

## Qu'est-ce que la répartie exactement ?

La répartie n'est pas de l'agressivité déguisée. C'est la capacité à répondre rapidement, avec pertinence, souvent avec humour, à une remarque ou une situation. C'est ce que fait **Jamel Debbouze** quand un spectateur l'interpelle, ce que fait **Florence Foresti** quand une interview prend un tour inattendu. Ce n'est pas "avoir le dernier mot", c'est **"avoir le bon mot au bon moment"**.

## Pourquoi certains ont de la répartie et pas d'autres

La répartie n'est pas un don inné. C'est un muscle cognitif. Les personnes qui semblent avoir une répartie "naturelle" ont simplement plus de pratique : elles ont grandi dans des environnements où le ping-pong verbal était courant (fratries, groupes d'amis, etc.), elles ont développé des réflexes. Mais ces réflexes s'acquièrent à tout âge.

## 10 techniques concrètes pour avoir de la répartie

**Technique 1 : L'accusé de réception.** Face à une remarque, ne panique pas. Commence par un simple "Intéressant", "Pas faux" ou "Bien vu". Ces 2-3 secondes te donnent le temps de formuler ta vraie réponse. C'est la technique de base que tous les humoristes utilisent sur scène.

**Technique 2 : Le rebond sur mot-clé.** Attrape un mot dans la phrase de l'autre et construis ta réponse dessus. "T'es toujours en retard" → tu rebondis sur "toujours" : "Toujours ? C'est un peu excessif non ? Je dirais... souvent." L'autre rit, la tension baisse.

**Technique 3 : Le retournement.** Retourne la remarque vers l'expéditeur. "Tu manges encore ?" → "Oui, et toi tu comptes encore ce que mangent les gens ?" C'est la technique préférée de **Florence Foresti**. Tu reprends le pouvoir sans être méchant.

**Technique 4 : La fausse naïveté.** Fais semblant de ne pas comprendre : "Ah bon ? Qu'est-ce que tu veux dire exactement ?" L'autre est obligé d'expliquer sa pique, ce qui la rend ridicule. En bonus, ça te donne du temps.

**Technique 5 : Le redirect absurde.** Change totalement de sujet de façon inattendue. Remarque sur ta coiffure ? "Merci, et sinon t'as vu le prix des avocats en ce moment ?" L'absurdité crée le rire et montre que la remarque ne t'atteint pas.

**Technique 6 : L'autodérision stratégique.** Pousse la critique jusqu'à l'absurde toi-même. "T'es toujours fatigué" → "Fatigué ? Je suis au-delà de la fatigue. Mon dernier rêve, c'était un PowerPoint." Tu coupes l'herbe sous le pied de l'autre.

**Technique 7 : La question piège.** Réponds à une remarque par une question qui met l'autre face à son absurdité. "T'es bizarre quand même" → "Bizarre par rapport à quoi ? À la normalité ? Et c'est quoi la normalité ?" Ça fait réfléchir et rire en même temps.

**Technique 8 : Le compliment détourné.** Transforme l'attaque en pseudo-compliment. "Tu parles trop" → "Ah, tu as remarqué ! Je savais que mon charisme finirait par se voir." L'inattendu du compliment crée le rire.

**Technique 9 : Le miroir.** Répète exactement ce que l'autre vient de dire, mais avec un ton complètement différent (amusé, théâtral, chuchoté). L'effet comique est immédiat et ça désarme l'autre.

**Technique 10 : Le silence souriant.** Parfois, la meilleure répartie, c'est pas de réponse du tout. Un sourire confiant, un regard amusé, et le silence. Ça montre que la remarque ne mérite même pas une réponse. C'est dévastateur.

## Comment pratiquer la répartie au quotidien

**Exercice 1 : Le journal de répartie.** Chaque soir, note une situation où tu aurais voulu avoir de la répartie. Écris 3 réponses possibles en utilisant 3 techniques différentes. En quelques semaines, ces réponses te viendront de plus en plus vite en temps réel.

**Exercice 2 : Le ping-pong verbal.** Avec un ami complice, faites des sessions de 5 minutes où vous vous envoyez des remarques et devez répondre en moins de 5 secondes. Pas besoin d'être brillant, l'objectif est la rapidité.

**Exercice 3 : L'analyse de pros.** Regarde des interviews d'humoristes et analyse comment ils répondent aux questions piège des journalistes. Quelles techniques utilisent-ils ? **Gad Elmaleh**, par exemple, utilise énormément l'accusé de réception suivi d'un redirect.

## La répartie pour les timides

Si tu es introverti ou timide, la répartie peut sembler intimidante. Mais c'est justement là que les techniques 1 (accusé de réception), 4 (fausse naïveté) et 10 (silence souriant) sont les plus puissantes. Elles ne demandent ni d'être bruyant ni d'être extraverti. Elles demandent juste de rester calme et de prendre son temps. Et c'est souvent les personnes calmes qui ont la répartie la plus dévastatrice.

## La répartie n'est pas de l'agressivité

Attention au piège : la répartie, ce n'est pas "écraser l'autre". C'est créer un moment drôle et léger, même quand la remarque de départ était piquante. L'objectif, c'est que tout le monde rie — y compris la personne qui t'a lancé la remarque. Si ta réponse blesse l'autre, c'est pas de la répartie, c'est de la méchanceté.

Tu veux aller plus loin ? Sur deviens-marrant.fr, on a un [parcours](/parcours) Répartie de 4 semaines avec des exercices interactifs, des mises en situation et un suivi de ta progression. C'est conçu spécialement pour les personnes qui veulent développer cette compétence pas à pas, sans pression. **Rejoins-nous dès 0,99 €/mois.**`,
    date: "2026-03-12",
    readingTime: "8 min",
    category: "REPARTIE",
    faqs: [
      { question: "Comment avoir de la répartie quand on est timide ?", answer: "La répartie n'exige pas d'être extraverti. Les techniques comme l'accusé de réception, la fausse naïveté ou le questionnement socratique sont particulièrement adaptées aux personnes réservées car elles donnent du temps pour formuler une réponse." },
      { question: "Comment répondre quand on se fait chambrer ?", answer: "Trois options efficaces : rebondir sur un mot-clé de la remarque, retourner la question vers l'autre, ou pousser la remarque à l'absurde (escalade comique). L'essentiel est de rester calme et de sourire." },
      { question: "Combien de temps faut-il pour développer sa répartie ?", answer: "Avec une pratique quotidienne de 5-10 minutes (exercices, mises en situation), la plupart des gens constatent une amélioration en 2 à 4 semaines. La clé est la régularité, pas l'intensité." },
    ],
  },
  // Articles "devenir-marrant", "devenir-plus-drole" et "apprendre-a-etre-drole"
  // retirés pour anti-cannibalisation — 301 redirects dans next.config.js
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find((article) => article.slug === slug);
}
