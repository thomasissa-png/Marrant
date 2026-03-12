import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: "ADMIN_PASSWORD non configuré" }, { status: 500 });
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const [users, jokes, tips, videos, paths, favorites] = await Promise.all([
      prisma.user.count(),
      prisma.joke.count(),
      prisma.tip.count(),
      prisma.video.count(),
      prisma.learningPath.count(),
      prisma.userFavorite.count(),
    ]);

    return NextResponse.json({ users, jokes, tips, videos, paths, favorites });
  } catch {
    return NextResponse.json(
      { users: 0, jokes: 0, tips: 0, videos: 0, paths: 0, favorites: 0 }
    );
  }
}
