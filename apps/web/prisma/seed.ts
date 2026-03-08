import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve } from "path";

const prisma = new PrismaClient();

// Charger les fichiers JSON de seed
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

  // Nettoyage des tables existantes (ordre important pour les FK)
  await prisma.userPathProgress.deleteMany();
  await prisma.learningPathStep.deleteMany();
  await prisma.learningPath.deleteMany();
  await prisma.dailyContent.deleteMany();
  await prisma.userFavorite.deleteMany();
  await prisma.jokeLike.deleteMany();
  await prisma.joke.deleteMany();
  await prisma.tip.deleteMany();
  await prisma.video.deleteMany();
  console.log("Tables nettoyées");

  // ========================
  // BLAGUES — 200 entrées
  // ========================
  const jokes = loadSeedData<JokeSeed>("blagues-seed.json");
  let jokeCount = 0;
  for (const joke of jokes) {
    await prisma.joke.create({
      data: {
        content: joke.content,
        punchline: joke.punchline,
        category: joke.category,
        maturityLevel: joke.maturityLevel,
        type: joke.type,
      },
    });
    jokeCount++;
  }
  console.log(`${jokeCount} blagues importées`);

  // ========================
  // CONSEILS — 50 entrées
  // ========================
  const tips = loadSeedData<TipSeed>("conseils-seed.json");
  let tipCount = 0;
  for (const tip of tips) {
    await prisma.tip.create({
      data: {
        title: tip.title,
        content: tip.content,
        category: tip.category,
        difficulty: tip.difficulty,
        example: tip.example,
        exercise: tip.exercise,
      },
    });
    tipCount++;
  }
  console.log(`${tipCount} conseils importés`);

  // ========================
  // VIDÉOS — 30 entrées
  // ========================
  const videos = loadSeedData<VideoSeed>("videos-seed.json");
  let videoCount = 0;
  for (const video of videos) {
    await prisma.video.create({
      data: {
        youtubeId: video.youtubeId,
        title: video.title,
        channelName: video.channelName,
        duration: video.duration,
        category: video.category,
        difficulty: video.difficulty,
        description: video.description,
        technique: video.technique,
      },
    });
    videoCount++;
  }
  console.log(`${videoCount} vidéos importées`);

  // ========================
  // CONTENU DU JOUR — 7 jours de contenu
  // ========================
  const allJokes = await prisma.joke.findMany({ take: 7 });
  const allTips = await prisma.tip.findMany({ take: 7 });

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    if (allJokes[i] && allTips[i]) {
      await prisma.dailyContent.create({
        data: {
          date,
          jokeId: allJokes[i].id,
          tipId: allTips[i].id,
        },
      });
    }
  }
  console.log("7 jours de contenu quotidien créés");

  // ========================
  // PARCOURS D'APPRENTISSAGE
  // ========================
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

    // Link existing tips as steps (use up to 5 tips per path, cycling through available tips)
    const stepsCount = Math.min(5, seededTips.length);
    for (let i = 0; i < stepsCount; i++) {
      const tipIndex = ((pathData.order - 1) * 5 + i) % seededTips.length;
      await prisma.learningPathStep.create({
        data: {
          learningPathId: path.id,
          tipId: seededTips[tipIndex].id,
          order: i + 1,
          dayNumber: (i + 1) * (pathData.order <= 2 ? 2 : 3),
        },
      });
    }
    pathCount++;
  }
  console.log(`${pathCount} parcours d'apprentissage créés`);

  console.log("Seeding terminé !");
  console.log(`Total : ${jokeCount} blagues, ${tipCount} conseils, ${videoCount} vidéos, ${pathCount} parcours`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
