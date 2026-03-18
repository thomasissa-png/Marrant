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
  // Protection : ne jamais exécuter le seed destructif en production
  if (process.env.NODE_ENV === "production") {
    console.log("⚠️  Seed bloqué en production pour protéger les données utilisateur (votes, favoris).");
    console.log("   Utilisez NODE_ENV=development pour forcer le seed.");
    process.exit(0);
  }

  console.log("Début du seeding...");

  const [jokeCount, tipCount, videoCount] = await Promise.all([
    prisma.joke.count(),
    prisma.tip.count(),
    prisma.video.count(),
  ]);

  // BLAGUES — upsert pour préserver les relations (JokeLike, favoris)
  const jokes = loadSeedData<JokeSeed>("blagues-seed.json");
  if (jokeCount !== jokes.length) {
    // Identifier les blagues existantes par contenu pour éviter les doublons
    const existingJokes = await prisma.joke.findMany({ select: { id: true, content: true } });
    const existingByContent = new Map(existingJokes.map((j) => [j.content, j.id]));

    let created = 0;
    let skipped = 0;
    for (const joke of jokes) {
      if (existingByContent.has(joke.content)) {
        skipped++;
        continue;
      }
      await prisma.joke.create({
        data: {
          content: joke.content,
          punchline: joke.punchline,
          category: joke.category as never,
          maturityLevel: joke.maturityLevel,
          type: joke.type as never,
        },
      });
      created++;
    }
    console.log(`Blagues : ${created} ajoutées, ${skipped} déjà présentes`);

    // Désactiver les vannes seed qui ne sont plus dans le fichier (retirées lors d'un audit qualité)
    // Ne touche PAS aux vannes générées par l'IA (generatedByAI = true)
    const seedContents = new Set(jokes.map((j) => j.content));
    const seedJokesToDeactivate = await prisma.joke.findMany({
      where: {
        generatedByAI: false,
        isActive: true,
        content: { notIn: Array.from(seedContents) },
      },
      select: { id: true, content: true },
    });
    if (seedJokesToDeactivate.length > 0) {
      await prisma.joke.updateMany({
        where: { id: { in: seedJokesToDeactivate.map((j) => j.id) } },
        data: { isActive: false },
      });
      console.log(`Blagues désactivées (retirées du seed) : ${seedJokesToDeactivate.length}`);
    }
  } else {
    console.log(`Blagues à jour (${jokeCount}), ignoré`);
  }

  // CONSEILS — upsert pour préserver les relations (favoris, parcours)
  const tips = loadSeedData<TipSeed>("conseils-seed.json");
  if (tipCount !== tips.length) {
    const existingTips = await prisma.tip.findMany({ select: { id: true, title: true } });
    const existingByTitle = new Map(existingTips.map((t) => [t.title, t.id]));

    let created = 0;
    let skipped = 0;
    for (const tip of tips) {
      if (existingByTitle.has(tip.title)) {
        skipped++;
        continue;
      }
      await prisma.tip.create({
        data: {
          title: tip.title,
          content: tip.content,
          category: tip.category as never,
          difficulty: tip.difficulty as never,
          example: tip.example,
          exercise: tip.exercise,
        },
      });
      created++;
    }
    console.log(`Conseils : ${created} ajoutés, ${skipped} déjà présents`);
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
        title: "Parcours Machine à Café",
        description:
          "Tu veux avoir des anecdotes et vannes à ressortir au bon moment ? En 3 semaines, tu auras un arsenal de vannes courtes, le bon timing pour les placer, et des techniques de storytelling pour captiver ton audience.",
        slug: "machine-a-cafe",
        duration: "3 semaines",
        difficulty: "DEBUTANT" as const,
        icon: "☕",
        order: 1,
      },
      {
        title: "Parcours Répartie",
        description:
          "Tu veux savoir quoi répondre du tac au tac sans rester muet ? En 4 semaines, tu passes de celui qui cherche ses mots à celui qui a toujours la bonne réplique. Exercices progressifs, zéro pression.",
        slug: "repartie",
        duration: "4 semaines",
        difficulty: "INTERMEDIAIRE" as const,
        icon: "⚡",
        order: 2,
      },
      {
        title: "Parcours Confiance",
        description:
          "Un parcours complet pour renouer avec le rire et te sentir à l'aise dans toutes tes interactions. Vannes, répartie, storytelling, autodérision : tu explores tout et tu trouves ton style.",
        slug: "confiance",
        duration: "6 semaines",
        difficulty: "EXPERT" as const,
        icon: "🌱",
        order: 3,
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
