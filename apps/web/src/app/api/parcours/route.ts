import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const paths = await prisma.learningPath.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        steps: {
          orderBy: { order: "asc" },
          include: {
            tip: {
              select: { id: true, title: true, category: true, difficulty: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ paths });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
