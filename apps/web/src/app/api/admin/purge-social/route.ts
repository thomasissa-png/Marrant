import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Purge les posts sociaux non publiés (PENDING, APPROVED, FAILED)
 * pour permettre une re-génération avec les nouveaux briefs.
 *
 * Usage : GET /api/admin/purge-social?secret=CRON_SECRET
 * Les posts PUBLISHED sont conservés (historique).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Supprimer tous les posts non publiés
    const deleted = await prisma.socialPost.deleteMany({
      where: {
        status: { in: ["PENDING", "APPROVED", "FAILED"] },
      },
    });

    console.log(
      `[PurgeSocial] ${deleted.count} posts non publiés supprimés`,
    );

    return NextResponse.json({
      message: `${deleted.count} posts purgés (PENDING + APPROVED + FAILED)`,
      deletedCount: deleted.count,
    });
  } catch (error) {
    console.error("[PurgeSocial] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la purge" },
      { status: 500 },
    );
  }
}
