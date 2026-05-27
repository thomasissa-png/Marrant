import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve } from "path";

const prisma = new PrismaClient();

function loadSeedData<T>(filename: string): T[] {
  const filePath = resolve(process.cwd(), "../../docs/content", filename);
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T[];
}

// Charge un JSON depuis un chemin relatif à la racine du repo (différent de
// docs/content). Utilisé pour le fichier de décryptages bundlé au runtime.
function loadRepoJson<T>(relativePath: string): T[] {
  const filePath = resolve(process.cwd(), "../..", relativePath);
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T[];
}

interface JokeDecryptageSeed {
  content: string;
  comedyTechnique: string;
  techniqueExplanation: string;
  howToApply: string;
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

  // BLAGUES — upsert par contenu pour préserver les relations (JokeLike, favoris)
  const jokes = loadSeedData<JokeSeed>("blagues-seed.json");
  {
    // Décryptages pédagogiques pré-rédigés (289 entrées, indexées par content).
    // Source bundlée au runtime : src/data/joke-decryptages.json — appliqués dès
    // le seed pour que les nouvelles installs aient le décryptage immédiatement
    // (le boot via applyJokeDecryptagesTask les applique aussi, par sécurité).
    const decryptages = loadRepoJson<JokeDecryptageSeed>("apps/web/src/data/joke-decryptages.json");
    const decryptageByContent = new Map(decryptages.map((d) => [d.content, d]));

    const existingJokes = await prisma.joke.findMany({
      where: { generatedByAI: false },
      select: { id: true, content: true },
    });
    const existingByContent = new Map(existingJokes.map((j) => [j.content, j.id]));

    let created = 0;
    let updated = 0;
    for (const joke of jokes) {
      const dec = decryptageByContent.get(joke.content);
      const existingId = existingByContent.get(joke.content);
      if (existingId) {
        // Mettre à jour la punchline, catégorie, type, niveau si modifiés
        await prisma.joke.update({
          where: { id: existingId },
          data: {
            punchline: joke.punchline,
            category: joke.category as never,
            maturityLevel: joke.maturityLevel,
            type: joke.type as never,
            isActive: true,
            ...(dec
              ? {
                  comedyTechnique: dec.comedyTechnique,
                  techniqueExplanation: dec.techniqueExplanation,
                  howToApply: dec.howToApply,
                }
              : {}),
          },
        });
        updated++;
      } else {
        await prisma.joke.create({
          data: {
            content: joke.content,
            punchline: joke.punchline,
            category: joke.category as never,
            maturityLevel: joke.maturityLevel,
            type: joke.type as never,
            ...(dec
              ? {
                  comedyTechnique: dec.comedyTechnique,
                  techniqueExplanation: dec.techniqueExplanation,
                  howToApply: dec.howToApply,
                }
              : {}),
          },
        });
        created++;
      }
    }
    console.log(`Blagues : ${created} ajoutées, ${updated} mises à jour`);

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
  }

  // CONSEILS — upsert par titre pour préserver les relations (favoris, parcours)
  const tips = loadSeedData<TipSeed>("conseils-seed.json");
  {
    const existingTips = await prisma.tip.findMany({
      where: { generatedByAI: false },
      select: { id: true, title: true },
    });
    const existingByTitle = new Map(existingTips.map((t) => [t.title, t.id]));

    let created = 0;
    let updated = 0;
    for (const tip of tips) {
      const existingId = existingByTitle.get(tip.title);
      if (existingId) {
        // Mettre à jour le contenu, exemple, exercice, catégorie, difficulté si modifiés
        await prisma.tip.update({
          where: { id: existingId },
          data: {
            content: tip.content,
            category: tip.category as never,
            difficulty: tip.difficulty as never,
            example: tip.example,
            exercise: tip.exercise,
            isActive: true,
          },
        });
        updated++;
      } else {
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
    }
    console.log(`Conseils : ${created} ajoutés, ${updated} mis à jour`);

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

  const parcoursSeed = loadSeedData<PathSeed>("parcours-seed.json");

  // Charger tous les tips pour matcher par titre
  const allTips = await prisma.tip.findMany({
    where: { isActive: true },
    select: { id: true, title: true },
  });
  const tipByTitle = new Map(allTips.map((t) => [t.title, t.id]));

  let upsertedPaths = 0;
  let upsertedSteps = 0;
  let missingTips: string[] = [];
  const seedSlugs = new Set(parcoursSeed.map((p) => p.slug));

  for (const pathData of parcoursSeed) {
    // Upsert le parcours (créer ou mettre à jour)
    const path = await prisma.learningPath.upsert({
      where: { slug: pathData.slug },
      create: {
        title: pathData.title,
        description: pathData.description,
        slug: pathData.slug,
        duration: pathData.duration,
        difficulty: pathData.difficulty as never,
        icon: pathData.icon,
        order: pathData.order,
        isActive: true,
      },
      update: {
        title: pathData.title,
        description: pathData.description,
        duration: pathData.duration,
        difficulty: pathData.difficulty as never,
        icon: pathData.icon,
        order: pathData.order,
        isActive: true,
      },
    });

    // Supprimer les steps existants pour ce parcours et recréer
    // (permet la mise à jour incrémentale des steps)
    await prisma.learningPathStep.deleteMany({
      where: { learningPathId: path.id },
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
      upsertedSteps += stepsData.length;
    }
    upsertedPaths++;
  }

  // Désactiver les parcours qui ne sont plus dans le seed
  const deactivated = await prisma.learningPath.updateMany({
    where: {
      slug: { notIn: Array.from(seedSlugs) },
      isActive: true,
    },
    data: { isActive: false },
  });

  console.log(`${upsertedPaths} parcours upsertés avec ${upsertedSteps} étapes curatées`);
  if (deactivated.count > 0) {
    console.log(`${deactivated.count} parcours désactivés (retirés du seed)`);
  }
  if (missingTips.length > 0) {
    console.warn(`⚠️  ${missingTips.length} tip(s) introuvable(s) pour les parcours :`);
    missingTips.forEach((t) => console.warn(`   ${t}`));
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
