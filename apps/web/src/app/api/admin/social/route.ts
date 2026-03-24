import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/social — Liste les posts sociaux (avec filtres).
 * POST /api/admin/social — Actions en batch (approve, reject).
 *
 * Auth : Bearer ADMIN_PASSWORD (même pattern que /api/admin/stats et /api/admin/users).
 */

function verifyAdmin(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${adminPassword}`;
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const platform = searchParams.get("platform");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

  const where: Record<string, unknown> = {};
  if (status && status !== "ALL") where.status = status;
  if (platform) where.platform = platform;

  // Par défaut, masquer les posts passés sauf pour PUBLISHED (historique)
  // et REJECTED. Le param ?all=true montre tout.
  const showAll = searchParams.get("all") === "true";
  if (!showAll && status !== "PUBLISHED" && status !== "REJECTED") {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0); // début de la journée
    where.scheduledAt = { gte: now };
  }

  const posts = await prisma.socialPost.findMany({
    where,
    orderBy: { scheduledAt: "desc" },
    take: limit,
  });

  // Also fetch counts per status for the dashboard
  const counts = await prisma.socialPost.groupBy({
    by: ["status"],
    _count: true,
  });

  const statusCounts = Object.fromEntries(
    counts.map((c) => [c.status, c._count]),
  );

  return NextResponse.json({ posts, statusCounts });
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const { action, postIds, postId, content } = body;

  if (action === "approve_all") {
    // Only approve PENDING posts that the director actually validated (score >= 9)
    // Posts without director validation or with low scores must be reviewed individually
    const result = await prisma.socialPost.updateMany({
      where: {
        status: "PENDING",
        directorScore: { gte: 9 },
      },
      data: {
        status: "APPROVED",
        approvedBy: "admin",
      },
    });

    // Count how many PENDING posts were NOT approved (low score or no score)
    const remainingPending = await prisma.socialPost.count({
      where: { status: "PENDING" },
    });

    return NextResponse.json({
      message: `${result.count} posts approuvés (score directeur ≥ 9)${remainingPending > 0 ? ` — ${remainingPending} posts en attente de review manuelle (score < 9)` : ""}`,
      count: result.count,
      remainingPending,
    });
  }

  if (action === "approve" && postIds?.length) {
    // L'admin peut approuver n'importe quel post PENDING, meme avec un score < 9.
    // Le champ approvedBy: "admin" protege ces posts contre la retrogradation
    // par le cron publish-social (qui ne retrograde que les posts sans approvedBy).
    const result = await prisma.socialPost.updateMany({
      where: {
        id: { in: postIds },
        status: "PENDING",
      },
      data: {
        status: "APPROVED",
        approvedBy: "admin",
        directorNote: "Approuve manuellement par l'admin",
      },
    });
    return NextResponse.json({
      message: `${result.count} posts approuves (validation manuelle)`,
      count: result.count,
    });
  }

  if (action === "reject" && postIds?.length) {
    // Only reject PENDING or APPROVED posts — never retroactively reject PUBLISHED
    const result = await prisma.socialPost.updateMany({
      where: {
        id: { in: postIds },
        status: { in: ["PENDING", "APPROVED"] },
      },
      data: { status: "REJECTED" },
    });
    return NextResponse.json({
      message: `${result.count} posts rejetés`,
      count: result.count,
    });
  }

  if (action === "edit" && postId && content) {
    const post = await prisma.socialPost.update({
      where: { id: postId },
      data: {
        content: content.content || undefined,
        hook: content.hook || undefined,
        cta: content.cta || undefined,
        threadParts: content.threadParts || undefined,
      },
    });
    return NextResponse.json({ post });
  }

  return NextResponse.json({ error: "Action invalide" }, { status: 400 });
}
