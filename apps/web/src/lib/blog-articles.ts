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
    slug: "comment-devenir-drole",
    title: "Comment devenir drôle : le guide",
    excerpt:
      "\"Être drôle, c'est inné.\" Faux. La science et les humoristes prouvent le contraire. Voici la méthode complète pour développer ton sens de l'humour, avec des exercices concrets.",
    content: `"Soit t'es drôle, soit tu l'es pas." On a tous un oncle qui dit ça. Généralement, c'est le même oncle qui raconte la même blague sur les blondes depuis 2003. Lui, il est "né drôle", paraît-il. Spoiler : **l'humour est une compétence**, pas un chromosome. Et comme toute compétence, elle s'apprend.

## Le mythe du "talent naturel" (et pourquoi c'est des conneries)

Quand tu vois **Paul Mirabel** remplir Bercy avec un naturel déconcertant, tu te dis "OK, ce mec est né avec un don." Sauf que Paul a commencé dans des salles de 20 personnes à Paris, à tester des vannes qui tombaient à plat une fois sur deux. **Fary** a fait des centaines d'open mics avant de trouver son style. **Blanche Gardin** a mis plus de 10 ans à passer de l'écriture pour les autres à son propre spectacle.

Derrière chaque "naturel", il y a un disque dur plein de vannes ratées. C'est rassurant, non ?

## Ce que dit la science (spoiler : elle est de ton côté)

Des chercheurs de l'Université du Nouveau-Mexique ont montré que l'humour repose sur des **mécanismes cognitifs précis** : détection d'incongruité, résolution de tension, calibrage social. Ton cerveau sait déjà faire tout ça — il le fait chaque fois que tu comprends une blague. Le truc, c'est de passer de "comprendre" à "produire".

Une étude du *Journal of Positive Psychology* a démontré qu'un entraînement de 8 semaines améliorait significativement la capacité à faire rire. 8 semaines. C'est moins que le temps qu'il faut pour apprendre à faire un créneau.

## Les 5 piliers de l'humour (et comment les bosser)

### Pilier 1 : L'observation — Voir ce que les autres ignorent

**Roman Frayssinet** est un génie de l'observation. Il prend un truc que tout le monde vit — les groupes WhatsApp, les gens dans le métro, les réunions Zoom — et il le décrit avec une précision chirurgicale qui te fait dire "Mais c'est EXACTEMENT ça".

L'observation, c'est le premier muscle à entraîner. Note chaque jour un truc absurde que tu as remarqué. Le collègue qui répond "bien et toi ?" sans écouter la réponse. Le mec qui fait semblant de chercher dans son sac au moment de payer au resto. Le mail professionnel qui commence par "J'espère que tu vas bien" alors que LE MEC S'EN FICHE COMPLÈTEMENT de comment tu vas.

En 30 jours, tu auras 30 observations. Et au moins 10 potentiellement drôles.

### Pilier 2 : La surprise — L'art du virage inattendu

L'humour, c'est de la manipulation d'attentes. Tu emmènes le cerveau de ton public dans une direction... et tu tournes. **Fary** est le roi de ça : il commence une histoire de façon banale, tu crois savoir où ça va, et BOOM — la chute est aux antipodes.

La formule : setup (tu poses le décor) → pivot (tu changes de direction) → punchline (tu atterris ailleurs). Comme GPS qui recalcule, mais en drôle.

Exemple nul : "J'ai essayé le yoga. C'est dur." (Pas de surprise, pas de pivot.)
Exemple qui marche : "J'ai essayé le yoga. Mon corps m'a envoyé une lettre de démission."

### Pilier 3 : Le timing — Le silence qui vaut de l'or

Regarde un sketch de **Blanche Gardin** au ralenti. Compte les secondes de silence avant chaque chute. Ce silence crée de la tension. Le rire, c'est la libération de cette tension. Sans le silence, pas de tension, pas de rire.

Un bon timing, ça veut dire : résister à l'envie de combler le vide. La plupart des gens débitent leur blague comme un communiqué de presse. Ralentis. Pose ta phrase. Laisse le silence faire le travail.

### Pilier 4 : L'autodérision — Rire de soi sans se démolir

**Panayotis Pascot** est un maître de l'autodérision positive. Il parle de ses galères, de ses maladresses, de ses moments gênants — mais toujours avec un recul bienveillant. Tu ris AVEC lui, pas de lui.

La règle : plaisante sur des trucs mineurs (ton sens de l'orientation, ta relation avec la technologie, tes goûts musicaux douteux). Jamais sur des blessures profondes. L'autodérision, c'est montrer qu'on s'assume, pas qu'on se détruit.

### Pilier 5 : La pratique — Le seul vrai secret

Tu ne deviendras pas drôle en lisant des articles. (Oui, celui-ci inclus. C'est l'ironie du truc.) Tu deviendras drôle en ESSAYANT de faire rire. En te plantant. En analysant pourquoi. En réessayant.

**Waly Dia** raconte qu'à ses débuts, il avait un taux de réussite de 30%. Aujourd'hui, il remplit des salles. La différence ? Des milliers de vannes testées, affinées, recalibrées.

## Plan d'action concret sur 30 jours

**Semaine 1 — Observer.** Note chaque jour une situation absurde. Pas besoin d'être drôle, juste d'être attentif. Le matin dans les transports, à la machine à café, en scrollant LinkedIn (mine d'or d'absurdité involontaire).

**Semaine 2 — Reformuler.** Reprends tes observations et cherche l'angle drôle. Écris 3 versions de chaque observation. Garde la plus courte et la plus surprenante.

**Semaine 3 — Tester.** Partage tes meilleures trouvailles avec un ami proche. Note ce qui fait sourire, rire, ou tomber à plat. Pas de jugement, juste des données. Tu fais de la R&D comique.

**Semaine 4 — Élargir.** Utilise ce qui a marché en semaine 3 dans des contextes plus larges. En réunion, en soirée, dans un groupe WhatsApp. Tu as maintenant un petit répertoire testé et approuvé.

## Les 3 erreurs qui empêchent de devenir drôle

**Attendre d'être "prêt".** Tu ne seras jamais prêt. Les pros ont un taux de réussite de 60-70%. Si tu attends la vanne parfaite, tu attendras longtemps. Lance-toi.

**Copier les autres.** Regarder des humoristes pour comprendre les mécanismes, oui. Répéter leurs vannes mot pour mot au dîner, non. Ton humour doit être le tien. **Inès Reg** est drôle parce qu'elle est 100% elle-même, pas parce qu'elle copie quelqu'un.

**Forcer.** L'humour forcé se sent à 10 kilomètres. C'est le mec qui dit "ATTENDS j'ai une blague" et qui tue l'ambiance avant même d'avoir commencé. Les gens drôles ne sont pas "on" en permanence. Ils choisissent leurs moments.

## À qui ça s'adresse ?

Que tu sois étudiant et que tu galères à prendre ta place en soirée — commence par l'observation, c'est le point d'entrée le moins intimidant. Que tu cherches à alimenter tes conversations au bureau — la structure setup/punchline va transformer tes anecdotes de pause déjeuner. Ou que tu traverses une période où tu as perdu ta légèreté — la pratique progressive te permet de retrouver ton humour à ton rythme, sans pression.

Sur deviens-marrant.fr, on a conçu des [parcours](/parcours) progressifs qui te guident pas à pas dans ce processus. Des [vannes](/vannes) à mémoriser, des [conseils](/conseils) de timing et de répartie, des [vidéos](/videos) de pros à analyser. Le tout avec un système de progression pour rester motivé. **C'est 0,99 EUR/mois** — moins cher qu'un café. Et beaucoup plus drôle.`,
    date: "2026-03-13",
    readingTime: "7 min",
    category: "GUIDE",
    faqs: [
      { question: "Comment devenir drôle rapidement ?", answer: "Commencez par observer les absurdités du quotidien (1 par jour), mémorisez 5 vannes courtes, et testez-les avec des proches. En 2 à 4 semaines de pratique régulière, vous verrez une vraie différence dans vos interactions." },
      { question: "Est-ce que tout le monde peut devenir drôle ?", answer: "Oui. L'humour repose sur des mécanismes cognitifs (observation, surprise, timing) que n'importe qui peut développer. Paul Mirabel, Fary, Blanche Gardin — tous ont appris et perfectionné leur humour pendant des années avant de devenir les pros qu'on connaît." },
      { question: "Comment devenir drôle quand on est timide ?", answer: "La timidité est un atout : vous observez plus et parlez moins, donc quand vous intervenez, l'effet de surprise est décuplé. Commencez par l'humour écrit (messages, réseaux sociaux), puis passez à l'oral progressivement avec des amis proches." },
      { question: "Peut-on apprendre à être drôle à tout âge ?", answer: "Absolument. L'humour est un muscle cognitif qui se développe à tout âge. Des études scientifiques montrent qu'un entraînement de 8 semaines améliore significativement la capacité à faire rire, quel que soit l'âge de départ." },
    ],
  },
  {
    slug: "comment-avoir-de-la-repartie",
    title: "Répartie : 10 techniques efficaces",
    excerpt:
      "Tu restes planté quand on te chambre ? Tu trouves la réplique parfaite 2 heures trop tard ? Voici 10 techniques concrètes pour ne plus jamais rester muet.",
    content: `Tu connais ce moment. Quelqu'un te lance une remarque. Ton cerveau fait l'écran bleu de Windows. Bouche ouverte. Rien ne sort. Et puis, évidemment, la réplique PARFAITE te vient sous la douche, 2 heures plus tard. Comme si ton cerveau avait un délai de livraison.

Bonne nouvelle : **la répartie, ça s'apprend**. Ce n'est pas un don mystique réservé aux animateurs TV et aux humoristes. C'est un ensemble de réflexes qu'on peut entraîner. Voici 10 techniques qui fonctionnent vraiment, testées en soirée, en réunion et à la machine à café.

## Technique 1 : L'accusé de réception

La plus simple. La plus sous-estimée. Quelqu'un te balance une remarque ? Au lieu de paniquer, tu poses un "Intéressant", "Pas faux" ou "Bien vu". Ça te donne **2 à 3 secondes** pour formuler ta vraie réponse. C'est le "chargement en cours" de la répartie.

Regarde **Fary** en interview. Quand un journaliste lui pose une question piège, il ne se précipite jamais. Il accuse réception, sourit, prend son temps. Et sa réponse est toujours meilleure que si il avait répondu en panique.

## Technique 2 : Le rebond sur mot-clé

Attrape UN mot dans la phrase de l'autre et construis ta réponse dessus. On te dit "T'es toujours en retard" ? Tu rebondis sur "toujours" : "Toujours ? Non, l'autre jour j'étais pile à l'heure. Sauf que c'était un samedi et le bureau était fermé."

Simple, efficace, et ça prouve que tu écoutes — ce qui est déjà mieux que 80% des gens.

## Technique 3 : Le retournement

Au lieu de te défendre, tu retournes la remarque vers l'expéditeur. C'est du judo verbal. "Tu manges encore ?" → "Et toi, tu surveilles encore ce que mangent les gens ? Tu songes à une reconversion dans la nutrition ?"

**Roman Frayssinet** utilise beaucoup cette technique sur scène. Quelqu'un fait une remarque, et hop — retour à l'envoyeur, mais en plus drôle.

## Technique 4 : La fausse naïveté

Tu fais semblant de ne pas comprendre l'attaque. "Ah bon ? Qu'est-ce que tu veux dire exactement ?" L'autre est obligé d'expliquer sa pique, et expliquer une vanne, c'est comme disséquer une grenouille : techniquement instructif, mais la grenouille meurt dans le processus.

Bonus : ça te donne du temps pour préparer ta contre-attaque pendant que l'autre s'enlise.

## Technique 5 : Le redirect absurde

Change complètement de sujet de façon tellement random que tout le monde rit. On te fait une remarque sur ta coiffure ? "Merci, et sinon t'as vu que les chercheurs ont appris à un pigeon à jouer au ping-pong ? Le monde est fou." L'absurdité montre que la remarque ne t'atteint pas. Et c'est ça, le vrai pouvoir.

## Technique 6 : L'escalade comique

Prends la remarque et pousse-la à l'extrême. "T'es toujours fatigué" → "Fatigué ? Je suis au-delà. Je suis à un stade où mon oreiller a déposé une main courante pour harcèlement. Mon lit me ghoste."

**Paul Mirabel** est le roi de l'escalade : il part d'une observation banale et monte, monte, monte jusqu'à l'absurde total. L'astuce : chaque cran d'exagération doit être PLUS surprenant que le précédent.

## Technique 7 : La question piège

Réponds par une question qui met l'autre face à son propre absurde. "T'es bizarre quand même" → "Bizarre par rapport à qui ? À toi ? Parce que si tu es la norme, on est tous bizarres, non ?" Ça fait réfléchir et rire en même temps.

## Technique 8 : Le compliment empoisonné

Transforme l'attaque en pseudo-compliment. "Tu parles trop" → "Ah, tu as remarqué ! Ça veut dire que tu m'écoutes. C'est le plus beau jour de ma vie." L'inattendu du compliment désarme à tous les coups.

## Technique 9 : Le miroir

Répète exactement ce que l'autre vient de dire, mais avec un ton complètement différent — théâtral, chuchoté, façon présentateur JT. "T'es bizarre" → (ton de David Pujadas) "T'es bizarre. Mesdames, messieurs, bonsoir." L'effet est immédiat et imparable.

## Technique 10 : Le silence souriant

Parfois, la meilleure répartie, c'est pas de réponse. Un sourire confiant. Un regard amusé. Et le silence. **Blanche Gardin** peut tenir un silence de 5 secondes face au public — et la salle rit avant même qu'elle ait dit un mot. Le silence dit : "Ta remarque ne mérite même pas que je dépense des mots."

## Comment s'entraîner au quotidien

**Le journal de répartie.** Chaque soir, note une situation où tu aurais voulu avoir de la répartie. Écris 3 réponses avec 3 techniques différentes. En 3 semaines, ces réponses viendront de plus en plus vite en temps réel.

**Le ping-pong verbal.** Avec un pote, faites des sessions de 5 minutes : vous vous envoyez des remarques et devez répondre en moins de 5 secondes. Pas besoin d'être brillant — l'objectif, c'est la vitesse.

**L'analyse de pros.** Regarde des interviews de **Fary**, **Panayotis Pascot** ou **Waly Dia** et note comment ils gèrent les questions pièges. Quelles techniques utilisent-ils ?

## La répartie pour les timides

Si tu es introverti, les techniques 1 (accusé de réception), 4 (fausse naïveté) et 10 (silence souriant) sont tes meilleures amies. Elles ne demandent ni d'être bruyant ni d'être le centre de l'attention. Et souvent, ce sont les personnes calmes qui ont la répartie la plus dévastatrice — parce que quand elles parlent, tout le monde écoute.

## Un dernier truc important

La répartie, ce n'est pas "écraser l'autre". C'est créer un moment drôle et léger. L'objectif, c'est que tout le monde rie — y compris celui qui t'a lancé la remarque. Si ta réponse blesse, c'est pas de la répartie, c'est de la méchanceté. Et ça, ça ne rend personne drôle.

Tu veux aller plus loin ? Sur deviens-marrant.fr, on a un [parcours Répartie](/parcours) de 4 semaines avec des mises en situation et des exercices progressifs. Complète avec nos [conseils](/conseils) de timing et nos [vannes](/vannes) à mémoriser. **0,99 EUR/mois** — c'est le prix d'une répartie ratée en moins par jour.`,
    date: "2026-03-12",
    readingTime: "8 min",
    category: "REPARTIE",
    faqs: [
      { question: "Comment avoir de la répartie quand on est timide ?", answer: "Les techniques comme l'accusé de réception, la fausse naïveté ou le silence souriant sont idéales pour les introvertis : elles donnent du temps, ne demandent pas d'être bruyant, et ont souvent plus d'impact car les personnes calmes surprennent davantage quand elles répondent." },
      { question: "Comment répondre quand on se fait chambrer ?", answer: "Trois options efficaces : le rebond sur un mot-clé de la remarque, le retournement (renvoyer la question), ou l'escalade comique (pousser la remarque à l'absurde). L'essentiel : rester calme, sourire, et ne jamais être méchant." },
      { question: "Combien de temps faut-il pour développer sa répartie ?", answer: "Avec un exercice quotidien de 5 minutes (journal de répartie + analyse de 3 réponses possibles), la plupart des gens constatent une amélioration en 2 à 4 semaines. La répartie est un réflexe qui s'automatise avec la pratique." },
      { question: "Quelle est la technique de répartie la plus simple ?", answer: "L'accusé de réception : répondre 'Intéressant' ou 'Pas faux' pour gagner 2-3 secondes de réflexion. C'est la technique de base utilisée par tous les humoristes en spectacle face aux interpellations du public." },
    ],
  },
  {
    slug: "timing-humour",
    title: "Timing humour : plus fort que la blague",
    excerpt:
      "La même blague peut faire un tabac ou tomber à plat. La différence ? Le timing. Analyse d'un art invisible avec des techniques de pros.",
    content: `Tu as déjà raconté une blague que tu trouvais excellente, et... rien. Le silence. Pas un sourire. Même pas un "ah ouais". Puis un pote raconte EXACTEMENT la même chose 10 minutes plus tard, et tout le monde explose. Tu te dis "mais WTF". Je vais te dire WTF : le problème, c'était pas ta blague. C'était ton **timing**.

## Le timing, cet art invisible

Le timing, c'est le "quand" et le "comment" de l'humour. C'est la différence entre dire "Je t'aime" et "Je t'aime... toi aussi Sandrine." Mêmes mots. Résultats très, très différents.

**Roman Frayssinet** est probablement le meilleur exemple de timing en stand-up français actuel. Regarde un de ses sketches au ralenti. Tu verras qu'il y a des silences de 3-4 secondes avant certaines chutes. Des moments où il REGARDE le public, laisse la tension monter, et lâche sa punchline pile au moment où le cerveau de tout le monde est en "mais il va dire quoi ??"

C'est ce suspense microscopique qui déclenche le rire.

## La règle des 3 secondes

En conversation, quand tu veux placer une remarque drôle : **attends 3 secondes** après que la personne a fini de parler.

Pas 1 seconde — trop rapide, on dirait que tu n'écoutais pas et que tu attendais juste ton tour de parler. (On a tous ce pote. Ne sois pas ce pote.)

Pas 10 secondes — le train est parti, le moment est mort, tu es resté sur le quai avec ta vanne.

3 secondes. Le sweet spot. Ça donne l'impression que tu réfléchis, que ta réponse est spontanée. C'est exactement ce que font les bons improvisateurs.

## Le pouvoir du silence

La plupart des gens ont peur du silence. Comme s'il allait les mordre. Alors ils débitent leur blague à la vitesse d'un CGV, sans respirer, sans pause, et se demandent pourquoi personne ne rit. C'est comme jouer de la musique sans silences entre les notes : ça s'appelle du bruit.

**Blanche Gardin** est redoutable pour ça. Elle peut rester immobile 5 secondes en regardant le public. La salle est déjà en train de rire nerveusement avant qu'elle ait dit un mot. Le silence EST la blague.

**Fary** utilise un timing différent mais tout aussi efficace : il accélère son débit dans le setup, puis freine BRUTALEMENT avant la chute. Ce contraste de rythme crée un effet de surprise physique — ton cerveau est embarqué dans la vitesse et PAF, le freinage te projette dans le rire.

## La micro-pause avant la punchline

Voici la structure secrète :

1. **Le setup** : tu racontes normalement, rythme conversationnel
2. **Le ralentissement** : juste avant la chute, tu baisses le volume et tu ralentis
3. **La micro-pause** : 1-2 secondes de silence
4. **La punchline** : changement de ton, souvent plus bas ou plus direct

C'est ce **contraste** qui fait le travail. Le cerveau de ton public s'attend à la suite logique du setup... et le silence le met en alerte. La punchline libère la tension sous forme de rire.

## Lire la pièce : le timing social

Le timing, c'est aussi savoir **quand** c'est ton moment. Est-ce que les gens sont détendus ou tendus ? Est-ce qu'on rigole déjà ou est-ce qu'on parle du licenciement de Kevin ? Placer une blague au mauvais moment, même une bonne blague, c'est comme mettre du ketchup sur un soufflé — techniquement possible, mais personne ne te le pardonnera.

Les bons moments pour l'humour en groupe :
- La transition entre deux sujets (le "creux" naturel de la conversation)
- Juste après que quelqu'un a dit un truc involontairement drôle
- Le silence naturel quand tout le monde boit une gorgée en même temps

Les MAUVAIS moments :
- Quand quelqu'un raconte un vrai problème
- Quand le manager finit une phrase et attend une réponse sérieuse
- Quand tu es le seul à trouver que c'est le bon moment (spoiler : c'est pas le bon moment)

## Comment bosser son timing

**Exercice 1 : L'analyse au ralenti.** Regarde un sketch de Roman Frayssinet, Blanche Gardin ou Fary avec un chronomètre. Mesure les silences avant les punchlines. Note les changements de rythme. Tu vas voir des patterns.

**Exercice 2 : Les 3 secondes.** En conversation, force-toi à compter mentalement "1... 2... 3..." avant de répondre. C'est TRÈS inconfortable au début. Mais l'effet sur la qualité de tes interventions est radical.

**Exercice 3 : Le silence volontaire.** Quand tu racontes une histoire, marque une pause AVANT la chute. Regarde ton interlocuteur. Laisse le silence. Puis lâche la punchline. C'est contre-intuitif, mais essaie une fois et tu seras converti.

Le timing, c'est un truc que tu peux pratiquer chaque jour, dans chaque conversation. Sur deviens-marrant.fr, chaque [conseil](/conseils) vient avec des mises en situation pour bosser ton timing. Et nos [vidéos](/videos) de pros sont analysées technique par technique. **0,99 EUR/mois**, 5 minutes par jour — et tu ne raconteras plus jamais une blague trop tôt (ni trop tard).`,
    date: "2026-02-28",
    readingTime: "5 min",
    category: "TIMING",
    faqs: [
      { question: "C'est quoi le timing en humour ?", answer: "Le timing est l'art de dire le bon mot au bon moment. C'est la combinaison du silence avant la punchline, du rythme de la narration, et du choix du moment social pour intervenir. C'est souvent plus important que la blague elle-même." },
      { question: "Comment améliorer son timing comique ?", answer: "Trois exercices : analysez les silences dans les sketches de pros (Roman Frayssinet, Blanche Gardin), pratiquez la règle des 3 secondes en conversation (attendre avant de répondre), et marquez des pauses volontaires avant vos chutes." },
      { question: "Pourquoi mes blagues tombent à plat ?", answer: "Le problème est souvent le timing, pas la blague. Les erreurs classiques : parler trop vite, ne pas marquer de pause avant la chute, ou choisir le mauvais moment social pour intervenir. Le silence avant la punchline est votre meilleur allié." },
    ],
  },
  {
    slug: "erreurs-blagues",
    title: "5 erreurs qui tuent tes blagues",
    excerpt:
      "Tu racontes une blague et personne ne rit ? Tu fais sûrement une de ces 5 erreurs. Diagnostic et solutions concrètes.",
    content: `Tu racontes une blague. Tu arrives à la chute. Et... rien. Le silence. Pas le silence de "je cherche de l'air parce que j'ai trop ri", non. Le silence de "quelqu'un a un sujet de conversation de rechange ?". Si ça t'arrive souvent, c'est probablement pas un problème de blague. **C'est un problème de livraison.** Et ça se corrige.

## Erreur 1 : Expliquer la blague

C'est le crime numéro 1 contre l'humour. Tu fais ta blague, il y a un flottement, tu paniques : "Non mais tu vois, c'est drôle parce que..." STOP. Tu viens de commettre un meurtre comique. Expliquer une blague, c'est comme disséquer un papillon : techniquement intéressant, mais le papillon est mort.

**Paul Mirabel** a un sketch entier sur ce thème — il raconte une situation, la salle ne réagit pas immédiatement, et au lieu d'expliquer, il CONTINUE comme si de rien n'était. Et 30 secondes plus tard, le rire arrive. Parce que parfois, le cerveau a besoin de quelques secondes pour faire "clic".

Si personne ne rit, la seule bonne réponse c'est : sourire et passer à la suite. La confiance de celui qui ne se justifie pas est infiniment plus drôle que l'explication gênée.

## Erreur 2 : Le setup de 47 minutes

"Attends attends, faut que je t'explique le contexte. Alors en fait, y'a trois mois, j'étais chez mon pote, enfin c'est pas vraiment mon pote, c'est le cousin de la sœur de..." Mon frère. Tu as perdu ton public à "en fait". Et ta punchline est maintenant à 3 kilomètres derrière un mur de contexte inutile.

Un bon setup : **1 à 2 phrases**. Maximum. Si ta blague a besoin de 5 minutes d'introduction, c'est pas une blague, c'est un podcast.

**Waly Dia** est un modèle d'efficacité : setup minimal, punchline chirurgicale. Chaque mot compte. Rien de superflu. C'est du chirurgien, pas du romancier.

## Erreur 3 : Se tromper de public

Ta blague sur les partiels qui tue en BDE, tu la sors au dîner de famille devant papy et mamie. Résultat : papy tousse, mamie parle de la météo, et tu fixes ta purée en te demandant pourquoi tu existes.

**Adapter son humour à son audience, c'est pas de l'autocensure, c'est de l'intelligence sociale.** Le contenu change, mais le talent reste. **Inès Reg** ne fait pas le même contenu sur scène et sur Instagram — et elle est drôle partout. Parce qu'elle calibre.

Le test : avant de sortir ta blague, demande-toi "est-ce que cette personne va COMPRENDRE le contexte ?". Si la réponse est non, garde-la pour le bon public.

## Erreur 4 : Le manque d'engagement

Tu marmonnes ta blague les yeux rivés sur tes chaussures, avec un demi-sourire gêné qui dit "pardon d'exister". Personne ne va rire. Pas parce que ta blague est nulle, mais parce que TOI tu n'y crois pas. L'engagement, c'est la confiance avec laquelle tu livres ta réplique.

Regarde les yeux. Assume. Même si la blague est moyenne, la conviction dans la livraison peut la sauver. À l'inverse, la meilleure vanne du monde livrée sans énergie tombera à plat.

**Panayotis Pascot** peut raconter un truc banal — genre faire ses courses — et c'est hilarant. Parce qu'il est DEDANS. Il revit la scène, ses yeux brillent, son corps accompagne l'histoire. L'engagement total transforme le banal en comique.

## Erreur 5 : Ignorer les signaux du groupe

Tu as ta blague prête. Tu attends ton moment. SAUF QUE le groupe est en train de parler de la grand-mère de Thomas qui est malade. Et toi tu balances ta vanne sur les pigeons. Le timing social, c'est pas optionnel — c'est la BASE.

Les signaux verts (go) : rires, énergie montante, transitions entre sujets, silences légers et détendus.
Les signaux rouges (pas maintenant) : voix basses, sujet sérieux, quelqu'un qui se confie, ton manager qui fait sa face de "j'attends une vraie réponse".

## Le plan de rattrapage

Choisis UNE erreur que tu fais souvent. **Une seule.** Pendant une semaine, concentre-toi uniquement sur celle-là. La semaine suivante, passe à la suivante. En un mois, tu auras corrigé tes erreurs de livraison les plus courantes — et tes blagues auront beaucoup plus d'impact.

Tu veux des exercices pour travailler chaque point ? Sur deviens-marrant.fr, nos [conseils](/conseils) couvrent chaque aspect de la livraison avec des mises en situation concrètes. Combine avec nos [vannes](/vannes) pour avoir du matériel testé à livrer. **0,99 EUR/mois** — l'investissement le plus rentable depuis que tu as arrêté de raconter des blagues Carambar.`,
    date: "2026-02-20",
    readingTime: "5 min",
    category: "GUIDE",
    faqs: [
      { question: "Quelles sont les erreurs quand on raconte une blague ?", answer: "Les 5 erreurs principales : expliquer la chute après un silence, un setup trop long (plus de 2 phrases), ne pas adapter au public, manquer d'engagement dans la livraison, et ignorer les signaux sociaux du groupe." },
      { question: "Pourquoi ne faut-il jamais expliquer une blague ?", answer: "Expliquer une blague tue l'effet de surprise qui déclenche le rire. Si personne ne rit, la meilleure réponse est de sourire et passer à la suite avec confiance. Le cerveau a parfois besoin de quelques secondes pour 'capter' — laissez-lui le temps." },
      { question: "Comment savoir si c'est le bon moment pour une blague ?", answer: "Observez les signaux du groupe : rires, énergie montante et transitions entre sujets sont des signaux verts. Voix basses, sujets sérieux et quelqu'un qui se confie sont des signaux rouges. Le timing social est aussi important que le contenu." },
    ],
  },
  {
    slug: "autoderision-interactions",
    title: "Autodérision : transforme tes interactions",
    excerpt:
      "L'autodérision est un super-pouvoir social. Elle désarme, crée de la complicité et montre ta confiance. Mais il y a un piège énorme.",
    content: `L'autodérision, c'est un super-pouvoir. C'est aussi un piège mortel. Et la différence entre les deux tient en un truc : **le ton**. Bien dosée, l'autodérision te rend sympathique, accessible et drôle. Mal dosée, elle te rend pathétique. Bienvenue dans le guide qui va t'apprendre à rire de toi sans te démolir.

## Pourquoi l'autodérision est une arme nucléaire

Quand quelqu'un rit de lui-même, ton cerveau traduit ça par : "cette personne est assez forte pour montrer ses failles". C'est paradoxal, mais rire de soi, c'est un signal de CONFIANCE, pas de faiblesse.

**Blanche Gardin** parle de ses thérapies, de ses galères sentimentales, de ses angoisses — et elle est perçue comme une des humoristes les plus puissantes de France. Pas malgré son autodérision, mais GRÂCE à elle. Parce qu'elle rit de ses galères depuis une position de force : "regardez, j'ai traversé ça, et maintenant c'est du matériel comique."

**Panayotis Pascot** fait pareil avec ses maladresses sociales. Il raconte un rendez-vous galère ou un moment gênant, et tu ris AVEC lui parce que tu sens qu'il s'est réconcilié avec ces moments. Il ne cherche pas ta pitié. Il cherche ton rire.

## Le piège : autodérision vs auto-sabotage

Et voilà le piège. Il y a un gouffre entre rire de soi et se démolir.

**Autodérision** : "Mon sens de l'orientation est tellement mauvais que Google Maps m'a envoyé un mail de condoléances." (Tu ris d'un défaut mineur, avec le sourire, pour créer de la complicité.)

**Auto-sabotage** : "De toute façon, je suis nul. Je rate tout ce que je fais." (Tu te détruis devant les gens, tu cherches qu'on te console. Ce n'est pas drôle, c'est triste.)

La différence ? L'intention. L'autodérision vise le rire et la connexion. L'auto-sabotage vise (inconsciemment) la pitié. Et les gens sentent la différence en 0,3 seconde.

## Les 3 règles d'or

**Règle 1 : Vise les défauts mineurs.** Ton incapacité à faire un créneau, ta passion suspecte pour les séries B, ta relation toxique avec le bouton "snooze" de ton réveil. PAS les trucs qui te blessent vraiment. Si ça fait mal d'en parler, c'est pas de l'autodérision, c'est une thérapie — et ça se fait avec un professionnel, pas au dîner de Noël.

**Règle 2 : Souris quand tu le dis.** Le sourire est le signal qui dit au cerveau de l'autre "c'est de l'humour, pas un SOS". Sans sourire, "je suis nul en cuisine" peut être interprété comme un appel à l'aide. Avec sourire, c'est une ouverture de conversation drôle.

**Règle 3 : Dose-la.** Si CHAQUE phrase que tu dis est une blague sur toi, les gens vont finir par te croire. "Haha il se déteste vraiment en fait." L'autodérision, c'est un assaisonnement, pas le plat principal. Un trait d'esprit sur soi par conversation, c'est le bon dosage.

## L'autodérision comme brise-glace

Tu arrives dans une soirée où tu ne connais personne. La glace est épaisse de 3 mètres. Tu as deux options :

Option A : Rester dans un coin en espérant que quelqu'un vienne te parler. (Spoiler : personne ne viendra.)

Option B : "Salut, je suis celui qui connaît personne et qui hésite entre le buffet et la sortie de secours." Rires. Glace brisée. Et soudain, tu es approchable. Pourquoi ? Parce que tu viens de montrer ta vulnérabilité avec humour — et ça crée une connexion instantanée.

**Paul Mirabel** utilise exactement cette technique en début de spectacle. Il se met dans une position de "faux faible" qui rend le public bienveillant. Et à partir de là, tout ce qu'il dit est accueilli avec sympathie.

## L'autodérision dans différents contextes

**Au boulot** : "Je suis le genre de personne qui met 10 minutes à comprendre la machine à café nouvelle. Mais donne-moi un tableur Excel et je deviens Neo dans Matrix." Tu admets un défaut mineur, tu enchaînes sur une force. C'est du aikido social.

**Entre amis** : "Mon chat a plus de vie sociale que moi. Il reçoit des visites, il a des rendez-vous réguliers chez le véto, il a même un carnet de vaccinations — moi j'ai même pas de dentiste." Tu transformes un constat banal en observation absurde.

**En date** : "Je te préviens, je suis désastreux pour choisir au restaurant. Ma dernière 'commande aventureuse', c'était un plat pour enfant. J'ai pas regretté." L'honnêteté décalée, c'est 10x plus séduisant que le mec qui essaie d'avoir l'air parfait.

## Comment s'entraîner à l'autodérision

**Étape 1 :** Liste 5 de tes "défauts drôles" — les trucs que tu assumes et qui ne te blessent pas. Sens de l'orientation, rapport à la technologie, goûts musicaux, capacité à monter un meuble IKEA.

**Étape 2 :** Pour chacun, écris une phrase d'autodérision avec une exagération comique. "Mauvais en cuisine" devient "La dernière fois que j'ai cuisiné, les pompiers m'ont ajouté à leur liste de contacts favoris."

**Étape 3 :** Teste la meilleure avec des proches. Si tu souris en la disant et qu'ils rient, c'est validé. Si tu as l'air triste en la disant, retravaille le ton.

L'autodérision, c'est le muscle le plus puissant de l'humour social. Sur deviens-marrant.fr, le [parcours Confiance](/parcours) consacre une semaine entière à maîtriser cette compétence, avec des exercices progressifs et des exemples adaptés. Nos [conseils](/conseils) sur l'autodérision te guident pas à pas. **0,99 EUR/mois** — investis dans la compétence qui rend TOUT le monde plus sympathique.`,
    date: "2026-02-15",
    readingTime: "5 min",
    category: "AUTODERISION",
    faqs: [
      { question: "C'est quoi l'autodérision ?", answer: "L'autodérision consiste à rire de soi-même de façon contrôlée et bienveillante. C'est pointer un défaut mineur avec humour pour créer de la connexion, pas se démolir pour obtenir de la pitié. C'est un signal de confiance, pas de faiblesse." },
      { question: "Comment faire de l'autodérision sans se rabaisser ?", answer: "Trois règles : visez uniquement les défauts mineurs (jamais les blessures profondes), souriez en le disant (signal d'humour, pas de détresse), et dosez (1 trait d'esprit par conversation, pas à chaque phrase)." },
      { question: "Pourquoi l'autodérision fonctionne-t-elle aussi bien ?", answer: "Elle désarme les tensions, rend accessible et crée de la connexion instantanée. C'est paradoxal : montrer ses failles avec humour est perçu comme un signal de force et de confiance en soi, pas de faiblesse." },
    ],
  },
  // Articles "devenir-marrant", "devenir-plus-drole", "apprendre-a-etre-drole", "techniques-repartie"
  // fusionnés ou redirigés — 301 redirects dans next.config.js
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find((article) => article.slug === slug);
}
