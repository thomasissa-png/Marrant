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

    // Désactiver les conseils seed qui ne sont plus dans le fichier (retirés lors d'un audit qualité)
    // Ne touche PAS aux conseils générés par l'IA (generatedByAI = true)
    const seedTitles = new Set(tips.map((t) => t.title));
    const seedTipsToDeactivate = await prisma.tip.findMany({
      where: {
        generatedByAI: false,
        isActive: true,
        title: { notIn: Array.from(seedTitles) },
      },
      select: { id: true, title: true },
    });
    if (seedTipsToDeactivate.length > 0) {
      await prisma.tip.updateMany({
        where: { id: { in: seedTipsToDeactivate.map((t) => t.id) } },
        data: { isActive: false },
      });
      console.log(`Conseils désactivés (retirés du seed) : ${seedTipsToDeactivate.length}`);
    }
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
  // Utilise parcours-seed.json pour une curation par thème et persona (pas par index)
  interface PathSeed {
    slug: string;
    title: string;
    description: string;
    duration: string;
    difficulty: string;
    icon: string;
    order: number;
    steps: Array<{ week: number; tipTitle: string; dayNumber: number }>;
  }

  const pathCount = await prisma.learningPath.count();
  const stepCount = await prisma.learningPathStep.count();
  if (pathCount === 0 || stepCount === 0) {
    // Nettoyer avant de recréer
    if (pathCount > 0) {
      await prisma.learningPathStep.deleteMany({});
      await prisma.learningPath.deleteMany({});
    }

    const parcoursSeed = loadSeedData<PathSeed>("parcours-seed.json");

    // Charger tous les tips pour matcher par titre
    const allTips = await prisma.tip.findMany({
      where: { isActive: true },
      select: { id: true, title: true },
    });
    const tipByTitle = new Map(allTips.map((t) => [t.title, t.id]));

    let createdPaths = 0;
    let createdSteps = 0;
    let missingTips: string[] = [];

    for (const pathData of parcoursSeed) {
      const path = await prisma.learningPath.create({
        data: {
          title: pathData.title,
          description: pathData.description,
          slug: pathData.slug,
          duration: pathData.duration,
          difficulty: pathData.difficulty as never,
          icon: pathData.icon,
          order: pathData.order,
        },
      });

      const stepsData = [];
      for (const step of pathData.steps) {
        const tipId = tipByTitle.get(step.tipTitle);
        if (!tipId) {
          missingTips.push(`[${pathData.slug}] Semaine ${step.week}: "${step.tipTitle}"`);
          continue;
        }
        stepsData.push({
          learningPathId: path.id,
          tipId,
          order: step.week,
          dayNumber: step.dayNumber,
        });
      }

      if (stepsData.length > 0) {
        await prisma.learningPathStep.createMany({ data: stepsData });
        createdSteps += stepsData.length;
      }
      createdPaths++;
    }

    console.log(`${createdPaths} parcours créés avec ${createdSteps} étapes curatées`);
    if (missingTips.length > 0) {
      console.warn(`⚠️  ${missingTips.length} tip(s) introuvable(s) pour les parcours :`);
      missingTips.forEach((t) => console.warn(`   ${t}`));
    }
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
