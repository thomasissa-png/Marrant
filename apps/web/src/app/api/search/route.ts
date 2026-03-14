import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { selectSlidingFreeItems } from "@/lib/free-content";

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q");
    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    // Vérifier le plan de l'utilisateur
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    let isPremium = false;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true },
      });
      isPremium = user?.plan === "PREMIUM";
    }

    if (isPremium) {
      // Premium : recherche dans tout le catalogue
      const [jokes, tips, videos] = await Promise.all([
        prisma.joke.findMany({
          where: {
            isActive: true,
            OR: [
              { content: { contains: q, mode: "insensitive" } },
              { punchline: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 5,
          select: { id: true, content: true, punchline: true },
        }),
        prisma.tip.findMany({
          where: {
            isActive: true,
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { content: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 5,
          select: { id: true, title: true, content: true },
        }),
        prisma.video.findMany({
          where: {
            isActive: true,
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { channelName: { contains: q, mode: "insensitive" } },
              { technique: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 5,
          select: { id: true, title: true, channelName: true },
        }),
      ]);

      return NextResponse.json({
        results: formatResults(jokes, tips, videos).slice(0, 10),
      });
    }

    // FREE / anonyme : recherche uniquement dans le set gratuit du jour
    const [allJokes, allTips, allVideos] = await Promise.all([
      prisma.joke.findMany({
        where: { isActive: true },
        orderBy: { id: "asc" },
        select: { id: true, content: true, punchline: true, category: true },
      }),
      prisma.tip.findMany({
        where: { isActive: true },
        orderBy: { id: "asc" },
        select: { id: true, title: true, content: true, category: true },
      }),
      prisma.video.findMany({
        where: { isActive: true },
        orderBy: { id: "asc" },
        select: { id: true, title: true, channelName: true, technique: true, category: true },
      }),
    ]);

    // Appliquer la même fenêtre glissante que les routes /api/jokes, /api/tips, /api/videos
    const freeJokes = selectSlidingFreeItems(allJokes, 20, 7919, (j) => j.category);
    const freeTips = selectSlidingFreeItems(allTips, 5, 6871, (t) => t.category);
    const freeVideos = selectSlidingFreeItems(allVideos, 10, 5381, (v) => v.category);

    // Filtrer par la recherche dans le set gratuit uniquement
    const qLower = q.toLowerCase();
    const matchedJokes = freeJokes
      .filter((j) => j.content.toLowerCase().includes(qLower) || j.punchline.toLowerCase().includes(qLower))
      .slice(0, 5);
    const matchedTips = freeTips
      .filter((t) => t.title.toLowerCase().includes(qLower) || t.content.toLowerCase().includes(qLower))
      .slice(0, 5);
    const matchedVideos = freeVideos
      .filter((v) =>
        v.title.toLowerCase().includes(qLower) ||
        v.channelName.toLowerCase().includes(qLower) ||
        (v.technique?.toLowerCase().includes(qLower) ?? false)
      )
      .slice(0, 5);

    return NextResponse.json({
      results: formatResults(matchedJokes, matchedTips, matchedVideos).slice(0, 10),
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

function formatResults(
  jokes: Array<{ id: string; content: string; punchline: string }>,
  tips: Array<{ id: string; title: string; content: string }>,
  videos: Array<{ id: string; title: string; channelName: string }>
) {
  return [
    ...jokes.map((j) => ({
      id: j.id,
      type: "JOKE" as const,
      title: j.content.slice(0, 80),
      preview: j.punchline.slice(0, 60),
    })),
    ...tips.map((t) => ({
      id: t.id,
      type: "TIP" as const,
      title: t.title,
      preview: t.content.slice(0, 60),
    })),
    ...videos.map((v) => ({
      id: v.id,
      type: "VIDEO" as const,
      title: v.title,
      preview: v.channelName,
    })),
  ];
}
