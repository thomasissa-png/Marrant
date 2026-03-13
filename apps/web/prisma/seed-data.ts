import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve } from "path";

const prisma = new PrismaClient();

function loadSeedData<T>(filename: string): T[] {
  const filePath = resolve(process.cwd(), "../../docs/content", filename);
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
  learnings: string[];
  exercise: string | null;
}

async function main() {
  console.log("Début du seeding...");

  const [jokeCount, tipCount, videoCount] = await Promise.all([
    prisma.joke.count(),
    prisma.tip.count(),
    prisma.video.count(),
  ]);

  // BLAGUES — re-seed si le count ne correspond pas au fichier seed
  const jokes = loadSeedData<JokeSeed>("blagues-seed.json");
  if (jokeCount !== jokes.length) {
    // Nettoyer les dépendances avant de supprimer
    if (jokeCount > 0) {
      await prisma.dailyContent.deleteMany({});
      await prisma.joke.deleteMany({});
      console.log(`${jokeCount} anciennes blagues supprimées`);
    }
    await prisma.joke.createMany({
      data: jokes.map((joke) => ({
        content: joke.content,
        punchline: joke.punchline,
        category: joke.category as never,
        maturityLevel: joke.maturityLevel,
        type: joke.type as never,
      })),
    });
    console.log(`${jokes.length} blagues importées`);
  } else {
    console.log(`Blagues à jour (${jokeCount}), ignoré`);
  }

  // CONSEILS — re-seed si le count ne correspond pas au fichier seed
  const tips = loadSeedData<TipSeed>("conseils-seed.json");
  if (tipCount !== tips.length) {
    // Nettoyer les dépendances avant de supprimer
    if (tipCount > 0) {
      await prisma.dailyContent.deleteMany({});
      await prisma.learningPathStep.deleteMany({});
      await prisma.tip.deleteMany({});
      console.log(`${tipCount} anciens conseils supprimés`);
    }
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
    console.log(`${tips.length} conseils importés`);
  } else {
    console.log(`Conseils à jour (${tipCount}), ignoré`);
  }

  // VIDÉOS — upsert pour mettre à jour IDs YouTube, learnings, exercices
  const videos = loadSeedData<VideoSeed>("videos-seed.json");
  if (videoCount === 0) {
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
        learnings: video.learnings ?? [],
        exercise: video.exercise ?? null,
      })),
    });
    console.log(`${videos.length} vidéos importées`);
  } else {
    // Upsert chaque vidéo et désactiver celles qui ne sont plus dans le seed
    const seedYoutubeIds = videos.map((v) => v.youtubeId);
    let updated = 0;
    for (const video of videos) {
      await prisma.video.upsert({
        where: { youtubeId: video.youtubeId },
        update: {
          title: video.title,
          channelName: video.channelName,
          duration: video.duration,
          category: video.category as never,
          difficulty: video.difficulty as never,
          description: video.description,
          technique: video.technique,
          learnings: video.learnings ?? [],
          exercise: video.exercise ?? null,
          isActive: true,
        },
        create: {
          youtubeId: video.youtubeId,
          title: video.title,
          channelName: video.channelName,
          duration: video.duration,
          category: video.category as never,
          difficulty: video.difficulty as never,
          description: video.description,
          technique: video.technique,
          learnings: video.learnings ?? [],
          exercise: video.exercise ?? null,
        },
      });
      updated++;
    }
    // Désactiver les vidéos qui ne sont plus dans le seed (IDs YouTube invalides)
    const deactivated = await prisma.video.updateMany({
      where: { youtubeId: { notIn: seedYoutubeIds } },
      data: { isActive: false },
    });
    console.log(`${updated} vidéos mises à jour/ajoutées, ${deactivated.count} désactivées`);
  }

  // CONTENU DU JOUR — recréer si vide (supprimé lors du re-seed blagues/conseils)
  const dailyCount = await prisma.dailyContent.count();
  if (dailyCount === 0) {
    const allJokes = await prisma.joke.findMany({ take: 7 });
    const allTips = await prisma.tip.findMany({ take: 7 });
    const allVideos = await prisma.video.findMany({ where: { isActive: true }, take: 7 });

    const dailyData = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i)
      );

      if (allJokes[i] && allTips[i]) {
        dailyData.push({
          date,
          jokeId: allJokes[i].id,
          tipId: allTips[i].id,
          videoId: allVideos[i]?.id ?? null,
        });
      }
    }
    await prisma.dailyContent.createMany({ data: dailyData });
    console.log(`${dailyData.length} jours de contenu quotidien créés`);
  } else {
    console.log(`Contenu quotidien déjà présent (${dailyCount}), ignoré`);
  }

  // PARCOURS D'APPRENTISSAGE — recréer si vide ou si les steps ont été nettoyées
  const pathCount = await prisma.learningPath.count();
  const stepCount = await prisma.learningPathStep.count();
  if (pathCount === 0 || stepCount === 0) {
    // Nettoyer avant de recréer
    if (pathCount > 0) {
      await prisma.learningPathStep.deleteMany({});
      await prisma.learningPath.deleteMany({});
    }

    const learningPaths = [
      {
        title: "Les bases de l'humour",
        description:
          "Maîtrise les fondamentaux : timing, structure de la blague, et punchline. Le parcours parfait pour débuter.",
        slug: "bases-humour",
        duration: "2 semaines",
        difficulty: "DEBUTANT" as const,
        icon: "🌱",
        order: 1,
      },
      {
        title: "Roi de la répartie",
        description:
          "Apprends à répondre du tac au tac avec style. Ne te fais plus jamais clouer le bec.",
        slug: "roi-repartie",
        duration: "3 semaines",
        difficulty: "INTERMEDIAIRE" as const,
        icon: "⚡",
        order: 2,
      },
      {
        title: "Maître du storytelling",
        description:
          "Raconte des histoires captivantes qui font rire aux larmes. L'art de tenir ton audience en haleine.",
        slug: "maitre-storytelling",
        duration: "4 semaines",
        difficulty: "INTERMEDIAIRE" as const,
        icon: "📖",
        order: 3,
      },
      {
        title: "Stand-up : du concept à la scène",
        description:
          "Crée ton propre set de stand-up de A à Z. Pour ceux qui veulent monter sur scène.",
        slug: "standup-scene",
        duration: "6 semaines",
        difficulty: "EXPERT" as const,
        icon: "🎤",
        order: 4,
      },
    ];

    const seededTips = await prisma.tip.findMany({
      orderBy: { createdAt: "asc" },
    });
    let createdPaths = 0;

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
      createdPaths++;
    }
    console.log(`${createdPaths} parcours d'apprentissage créés`);
  } else {
    console.log(`Parcours déjà présents (${pathCount}), ignoré`);
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
