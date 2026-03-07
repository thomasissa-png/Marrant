import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Début du seeding...");

  // ========================
  // BLAGUES SEED (20 exemples initiaux)
  // ========================
  const jokes = [
    {
      content: "Mon psy m'a dit que j'avais un complexe de supériorité.",
      punchline: "Mais le mien est clairement mieux que le vôtre.",
      category: "AUTODERISION" as const,
      maturityLevel: 2,
      type: "CLASSIQUE" as const,
    },
    {
      content: "J'ai demandé à mon GPS de me trouver un bon restaurant.",
      punchline: "Il m'a dit : \"Dans 500 mètres, faites demi-tour sur votre vie.\"",
      category: "ABSURDE" as const,
      maturityLevel: 1,
      type: "ABSURDE" as const,
    },
    {
      content: "Mon chat me regarde avec un air supérieur depuis le haut de l'armoire.",
      punchline: "Normal, il est le seul de nous deux à avoir réussi à monter aussi haut dans la vie.",
      category: "OBSERVATIONNEL" as const,
      maturityLevel: 1,
      type: "CLASSIQUE" as const,
    },
    {
      content: "Je suis tellement introverti que",
      punchline: "même mon ombre essaie de prendre ses distances.",
      category: "AUTODERISION" as const,
      maturityLevel: 1,
      type: "SUBTIL" as const,
    },
    {
      content: "Un comédien entre dans un bar et commande un jeu de mots.",
      punchline: "Le barman lui dit : \"Désolé, on n'en a pas en stock, mais j'ai une bonne blague sur les bars.\"",
      category: "JEUX_DE_MOTS" as const,
      maturityLevel: 2,
      type: "CLASSIQUE" as const,
    },
    {
      content: "Ma copine m'a quitté parce que je fais trop de blagues.",
      punchline: "La porte en sortant, ça c'était pas une blague.",
      category: "COUPLE" as const,
      maturityLevel: 2,
      type: "CLASSIQUE" as const,
    },
    {
      content: "Mon patron m'a dit : \"Tu es irremplaçable.\"",
      punchline: "C'est pour ça qu'ils ne peuvent pas me virer — personne d'autre ne veut ce poste.",
      category: "BOULOT" as const,
      maturityLevel: 2,
      type: "SUBTIL" as const,
    },
    {
      content: "Le problème avec les blagues sur les ascenseurs,",
      punchline: "c'est qu'elles marchent à tous les niveaux.",
      category: "JEUX_DE_MOTS" as const,
      maturityLevel: 1,
      type: "CLASSIQUE" as const,
    },
    {
      content: "J'ai essayé la méditation. Le prof m'a dit : \"Videz votre esprit.\"",
      punchline: "Ça a pris 3 secondes. Il a eu l'air inquiet.",
      category: "AUTODERISION" as const,
      maturityLevel: 1,
      type: "CLASSIQUE" as const,
    },
    {
      content: "Tu connais la blague du lit superposé ?",
      punchline: "Elle est à deux étages.",
      category: "JEUX_DE_MOTS" as const,
      maturityLevel: 1,
      type: "CLASSIQUE" as const,
    },
    {
      content: "J'ai un ami invisible.",
      punchline: "Il est super cool, mais les photos de groupe sont toujours gênantes.",
      category: "ABSURDE" as const,
      maturityLevel: 1,
      type: "ABSURDE" as const,
    },
    {
      content: "Mon frigo fait un bruit bizarre depuis ce matin.",
      punchline: "Je crois qu'il a un running gag.",
      category: "JEUX_DE_MOTS" as const,
      maturityLevel: 2,
      type: "SUBTIL" as const,
    },
    {
      content: "En télétravail, mon patron m'a dit que je manquais de visibilité.",
      punchline: "J'ai allumé ma webcam, ça n'a pas aidé.",
      category: "BOULOT" as const,
      maturityLevel: 1,
      type: "CLASSIQUE" as const,
    },
    {
      content: "Je suis allé chez le médecin, il m'a dit : \"Vous avez une maladie imaginaire.\"",
      punchline: "Je lui ai répondu : \"Vous pouvez me prescrire un médicament imaginaire ?\"",
      category: "ABSURDE" as const,
      maturityLevel: 2,
      type: "ABSURDE" as const,
    },
    {
      content: "Ma grand-mère m'a dit : \"À ton âge, j'étais déjà mariée.\"",
      punchline: "Je lui ai répondu : \"À ton âge, j'espère l'être aussi.\"",
      category: "SITUATION" as const,
      maturityLevel: 2,
      type: "SUBTIL" as const,
    },
  ];

  for (const joke of jokes) {
    await prisma.joke.create({ data: joke });
  }
  console.log(`${jokes.length} blagues créées`);

  // ========================
  // CONSEILS SEED (10 exemples)
  // ========================
  const tips = [
    {
      title: "La règle des 3 secondes",
      content:
        "Le timing est tout en humour. Quand tu fais une blague, marque une pause de 3 secondes avant la chute. Ce silence crée de l'anticipation et amplifie l'effet comique. Les meilleurs stand-uppers maîtrisent cette technique instinctivement. Regarde comment Blanche Gardin laisse traîner ses silences — le public rit avant même la chute parce que la tension est insupportable.",
      category: "TIMING" as const,
      difficulty: "DEBUTANT" as const,
      example:
        "\"J'ai essayé le yoga ce matin... (pause 3s) ...j'ai réussi à toucher mes pieds... (pause 2s) ...parce que je suis tombé.\"",
      exercise:
        "Choisis une blague que tu connais bien. Raconte-la à voix haute devant un miroir en comptant 3 secondes dans ta tête avant chaque chute. Fais-le 5 fois.",
    },
    {
      title: "Le pouvoir de l'auto-dérision",
      content:
        "L'auto-dérision est le super-pouvoir des gens drôles. Elle te rend attachant, désamorce les tensions et montre une vraie confiance en toi. La clé : ris de tes défauts mineurs, jamais de tes vraies insécurités. L'auto-dérision doit être un choix, pas un cri d'aide. Pierre Croce excelle dans cet art — il se moque de lui-même avec une assurance qui le rend encore plus cool.",
      category: "AUTODERISION" as const,
      difficulty: "DEBUTANT" as const,
      example:
        "\"Je suis tellement mauvais en cuisine que mon détecteur de fumée me sert de minuteur.\"",
      exercise:
        "Écris 3 phrases d'auto-dérision sur des sujets légers (ta cuisine, ton sens de l'orientation, ton style vestimentaire). Teste-les sur un ami.",
    },
    {
      title: "L'observation du quotidien",
      content:
        "Les meilleures blagues viennent de l'observation de situations banales que tout le monde vit. Devenir observateur, c'est noter les absurdités du quotidien. Pourquoi on dit \"allô\" au téléphone ? Pourquoi on appuie plus fort sur la télécommande quand les piles sont faibles ? Seinfeld a bâti sa carrière entière là-dessus. L'humour est partout, il faut juste apprendre à le voir.",
      category: "OBSERVATION" as const,
      difficulty: "INTERMEDIAIRE" as const,
      example:
        "\"Vous avez remarqué qu'on vérifie toujours l'heure sur son téléphone, et 3 secondes après on doit revérifier parce qu'on a regardé sans regarder ?\"",
      exercise:
        "Pendant une journée, note dans ton téléphone 10 petites absurdités du quotidien. Le soir, essaie de transformer au moins 3 d'entre elles en début de blague.",
    },
    {
      title: "La répartie en 3 temps",
      content:
        "Une bonne répartie suit toujours le même schéma : 1) Accuser réception (montrer qu'on a entendu), 2) Rebondir sur un mot-clé, 3) Retourner la situation. C'est comme le judo verbal — tu utilises la force de l'autre contre lui. Fary est excellent là-dedans dans ses spectacles. La clé c'est de ne jamais être méchant, juste malin.",
      category: "REPARTIE" as const,
      difficulty: "INTERMEDIAIRE" as const,
      example:
        "Quelqu'un dit : \"T'es toujours en retard !\" → \"C'est pas que je suis en retard, c'est que vous êtes tous en avance sur mon emploi du temps.\"",
      exercise:
        "Demande à un ami de te lancer 5 \"piques\" amicales. Pour chacune, applique le schéma : accuse réception → rebondis → retourne. Chronomètre-toi : la meilleure répartie prend moins de 5 secondes.",
    },
    {
      title: "Construire une histoire drôle",
      content:
        "Le storytelling comique repose sur la tension narrative. Tu construis une situation normale, tu accumules les détails crédibles, et BAM — tu fais dérailler le tout avec un détail absurde. Plus l'histoire est crédible, plus la chute est drôle. Paul Mirabel est un maître en la matière : ses histoires commencent toujours de façon hyper-réaliste.",
      category: "STORYTELLING" as const,
      difficulty: "EXPERT" as const,
      example:
        "\"L'autre jour au supermarché, je cherchais les avocats. J'ai demandé à un employé, il m'a dirigé vers le rayon fruits. J'ai dit : 'Non, je cherche un avocat pour mon divorce.' L'employé m'a regardé et m'a dit : 'Rayon 7, entre les couteaux et les valises.'\"",
      exercise:
        "Écris une anecdote vraie de ta vie (max 1 minute à raconter). Maintenant, change la fin par quelque chose d'inattendu et absurde. Teste les deux versions sur des amis et compare les réactions.",
    },
    {
      title: "Le callback : la technique secrète des pros",
      content:
        "Le callback, c'est reprendre une blague ou un élément mentionné plus tôt dans la conversation et y revenir au moment inattendu. Ça crée un effet de surprise et montre que tu maîtrises ta narration. C'est la technique favorite de Gad Elmaleh dans ses one-man shows — il revient sur un thème du début quand tu l'as complètement oublié.",
      category: "TIMING" as const,
      difficulty: "EXPERT" as const,
      example:
        "En début de soirée : \"Mon GPS m'a dit de faire demi-tour.\" (...plus tard...) Quelqu'un se trompe de chemin → \"Attends, toi aussi t'as mon GPS ?\"",
      exercise:
        "Lors de ta prochaine conversation de groupe, note mentalement la première chose drôle qui est dite. 20 minutes plus tard, trouve un moyen naturel d'y faire référence. Observe la réaction.",
    },
    {
      title: "L'art du jeu de mots élégant",
      content:
        "Le jeu de mots a mauvaise réputation parce que la plupart sont forcés. Un bon jeu de mots doit sembler naturel — la personne met un instant à le comprendre, puis sourit. La clé : utilise des homophones ou des double sens que tout le monde connaît, pas des calembours de dictionnaire. Le jeu de mots doit enrichir la conversation, pas l'interrompre.",
      category: "JEUX_DE_MOTS" as const,
      difficulty: "INTERMEDIAIRE" as const,
      example:
        "À quelqu'un qui mange lentement : \"Tu sais, la patience c'est un plat qui se mange... ah non, ça c'est la vengeance. Toi tu manges juste lentement.\"",
      exercise:
        "Prends 5 expressions courantes (\"c'est la fin des haricots\", \"avoir la pêche\", etc.) et invente pour chacune une situation concrète où l'expression reprendrait son sens littéral de façon drôle.",
    },
  ];

  for (const tip of tips) {
    await prisma.tip.create({ data: tip });
  }
  console.log(`${tips.length} conseils créés`);

  // ========================
  // VIDÉOS SEED (10 exemples)
  // ========================
  const videos = [
    {
      youtubeId: "dQw4w9WgXcQ",
      title: "Blanche Gardin — L'auto-dérision absolue",
      channelName: "Blanche Gardin Officiel",
      duration: "PT12M30S",
      category: "AUTODERISION" as const,
      difficulty: "INTERMEDIAIRE" as const,
      description:
        "Blanche Gardin maîtrise l'art de se moquer d'elle-même avec une honnêteté brutale qui désarme le public.",
      technique: "Auto-dérision poussée à l'extrême",
    },
    {
      youtubeId: "placeholder2",
      title: "Fary — La répartie urbaine",
      channelName: "Fary",
      duration: "PT8M15S",
      category: "REPARTIE" as const,
      difficulty: "DEBUTANT" as const,
      description:
        "Fary démontre comment la répartie peut être à la fois rapide, bienveillante et hilarante.",
      technique: "Répartie et punchlines",
    },
    {
      youtubeId: "placeholder3",
      title: "Paul Mirabel — Le storytelling comique",
      channelName: "Paul Mirabel",
      duration: "PT15M00S",
      category: "STORYTELLING" as const,
      difficulty: "INTERMEDIAIRE" as const,
      description:
        "Paul Mirabel construit des histoires longues avec des chutes parfaitement timéées. Analyse de sa technique narrative.",
      technique: "Storytelling avec callback",
    },
    {
      youtubeId: "placeholder4",
      title: "Pierre Croce — L'absurde du quotidien",
      channelName: "Pierre Croce",
      duration: "PT10M45S",
      category: "OBSERVATION" as const,
      difficulty: "DEBUTANT" as const,
      description:
        "Pierre Croce transforme des observations banales en sketchs hilarants grâce à son regard décalé.",
      technique: "Observation + exagération",
    },
    {
      youtubeId: "placeholder5",
      title: "Gad Elmaleh — Le timing parfait",
      channelName: "Gad Elmaleh",
      duration: "PT7M30S",
      category: "TIMING" as const,
      difficulty: "EXPERT" as const,
      description:
        "Analyse du timing de Gad Elmaleh : ses pauses, ses accélérations, et comment il contrôle le rythme du rire.",
      technique: "Maîtrise du timing et des silences",
    },
  ];

  for (const video of videos) {
    await prisma.video.create({ data: video });
  }
  console.log(`${videos.length} vidéos créées`);

  // ========================
  // CONTENU DU JOUR (aujourd'hui)
  // ========================
  const allJokes = await prisma.joke.findMany({ take: 1 });
  const allTips = await prisma.tip.findMany({ take: 1 });

  if (allJokes[0] && allTips[0]) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.dailyContent.create({
      data: {
        date: today,
        jokeId: allJokes[0].id,
        tipId: allTips[0].id,
      },
    });
    console.log("Contenu du jour créé");
  }

  console.log("Seeding terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
