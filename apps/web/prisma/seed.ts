import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve } from "path";

const prisma = new PrismaClient();

function loadSeedData<T>(filename: string): T[] {
  const filePath = resolve(__dirname, "../../../docs/content", filename);
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T[];
}

interface JokeSeed {
  id: number;
  content: string;
  punchline: string;
  category: string;
  maturityLevel: number;
  type: string;
}

interface TipSeed {
  id: number;
  title: string;
  content: string;
  category: string;
  difficulty: string;
  example: string;
  exercise: string;
}

interface VideoSeed {
  id: number;
  youtubeId: string;
  title: string;
  channelName: string;
  duration: string;
  category: string;
  difficulty: string;
  description: string;
  technique: string;
}

async function main() {
  console.log("Début du seeding...");

  // Nettoyage dans une transaction (atomique)
  await prisma.$transaction([
    prisma.userPathProgress.deleteMany(),
    prisma.learningPathStep.deleteMany(),
    prisma.learningPath.deleteMany(),
    prisma.dailyContent.deleteMany(),
    prisma.userFavorite.deleteMany(),
    prisma.jokeLike.deleteMany(),
    prisma.joke.deleteMany(),
    prisma.tip.deleteMany(),
    prisma.video.deleteMany(),
  ]);
  console.log("Tables nettoyées (transaction)");

  // BLAGUES — insertion en batch
  const jokes = loadSeedData<JokeSeed>("blagues-seed.json");
  await prisma.joke.createMany({
    data: jokes.map((joke) => ({
      content: joke.content,
      punchline: joke.punchline,
      category: joke.category as never,
      maturityLevel: joke.maturityLevel,
      type: joke.type as never,
    })),
  });
  console.log(`${jokes.length} blagues importées (batch)`);

  // CONSEILS — insertion en batch
  const tips = loadSeedData<TipSeed>("conseils-seed.json");
  await prisma.tip.createMany({
    data: tips.map((tip) => ({
      title: tip.title,
      content: tip.content,
      category: tip.category as never,
      difficulty: tip.difficulty as never,
      example: tip.example,
      exercise: tip.exercise,
    })),
  });
  console.log(`${tips.length} conseils importés (batch)`);

  // VIDÉOS — insertion en batch
  const videos = loadSeedData<VideoSeed>("videos-seed.json");
  await prisma.video.createMany({
    data: videos.map((video) => ({
      youtubeId: video.youtubeId,
      title: video.title,
      channelName: video.channelName,
      duration: video.duration,
      category: video.category as never,
      difficulty: video.difficulty as never,
      description: video.description,
      technique: video.technique,
    })),
  });
  console.log(`${videos.length} vidéos importées (batch)`);

  // CONTENU DU JOUR — 7 jours
  const allJokes = await prisma.joke.findMany({ take: 7 });
  const allTips = await prisma.tip.findMany({ take: 7 });

  const dailyData = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    if (allJokes[i] && allTips[i]) {
      dailyData.push({
        date,
        jokeId: allJokes[i].id,
        tipId: allTips[i].id,
      });
    }
  }
  await prisma.dailyContent.createMany({ data: dailyData });
  console.log(`${dailyData.length} jours de contenu quotidien créés`);

  // PARCOURS D'APPRENTISSAGE
  const learningPaths = [
    {
      title: "Les bases de l'humour",
      description: "Maîtrise les fondamentaux : timing, structure de la blague, et punchline. Le parcours parfait pour débuter.",
      slug: "bases-humour",
      duration: "2 semaines",
      difficulty: "DEBUTANT" as const,
      icon: "🌱",
      order: 1,
    },
    {
      title: "Roi de la répartie",
      description: "Apprends à répondre du tac au tac avec style. Ne te fais plus jamais clouer le bec.",
      slug: "roi-repartie",
      duration: "3 semaines",
      difficulty: "INTERMEDIAIRE" as const,
      icon: "⚡",
      order: 2,
    },
    {
      title: "Maître du storytelling",
      description: "Raconte des histoires captivantes qui font rire aux larmes. L'art de tenir ton audience en haleine.",
      slug: "maitre-storytelling",
      duration: "4 semaines",
      difficulty: "INTERMEDIAIRE" as const,
      icon: "📖",
      order: 3,
    },
    {
      title: "Stand-up : du concept à la scène",
      description: "Crée ton propre set de stand-up de A à Z. Pour ceux qui veulent monter sur scène.",
      slug: "standup-scene",
      duration: "6 semaines",
      difficulty: "EXPERT" as const,
      icon: "🎤",
      order: 4,
    },
  ];

  const seededTips = await prisma.tip.findMany({ orderBy: { createdAt: "asc" } });
  let pathCount = 0;

  for (const pathData of learningPaths) {
    const path = await prisma.learningPath.create({
      data: {
        title: pathData.title,
        description: pathData.description,
        slug: pathData.slug,
        duration: pathData.duration,
        difficulty: pathData.difficulty,
        icon: pathData.icon,
        order: pathData.order,
      },
    });

    const stepsCount = Math.min(5, seededTips.length);
    const stepsData = [];
    for (let i = 0; i < stepsCount; i++) {
      const tipIndex = ((pathData.order - 1) * 5 + i) % seededTips.length;
      stepsData.push({
        learningPathId: path.id,
        tipId: seededTips[tipIndex].id,
        order: i + 1,
        dayNumber: (i + 1) * (pathData.order <= 2 ? 2 : 3),
      });
    }
    await prisma.learningPathStep.createMany({ data: stepsData });
    pathCount++;
  }
  console.log(`${pathCount} parcours d'apprentissage créés`);

  console.log("Seeding terminé !");
  console.log(`Total : ${jokes.length} blagues, ${tips.length} conseils, ${videos.length} vidéos, ${pathCount} parcours`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
