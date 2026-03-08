import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q");
    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = `%${q}%`;

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

    const results = [
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

    return NextResponse.json({ results: results.slice(0, 10) });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
