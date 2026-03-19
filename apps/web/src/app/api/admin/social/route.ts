import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/social — Liste les posts sociaux (avec filtres).
 * POST /api/admin/social — Actions en batch (approve, reject).
 */
export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Simple admin check — email whitelist
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim());
  if (!adminEmails.includes(session.user.email)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "PENDING";
  const platform = searchParams.get("platform");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

  const where: Record<string, unknown> = { status };
  if (platform) where.platform = platform;

  const posts = await prisma.socialPost.findMany({
    where,
    orderBy: { scheduledAt: "asc" },
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

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim());
  if (!adminEmails.includes(session.user.email)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await req.json();
  const { action, postIds, postId, content } = body;

  if (action === "approve_all") {
    // Approve all PENDING posts
    const result = await prisma.socialPost.updateMany({
      where: { status: "PENDING" },
      data: { status: "APPROVED" },
    });
    return NextResponse.json({
      message: `${result.count} posts approuvés`,
      count: result.count,
    });
  }

  if (action === "approve" && postIds?.length) {
    const result = await prisma.socialPost.updateMany({
      where: { id: { in: postIds }, status: "PENDING" },
      data: { status: "APPROVED" },
    });
    return NextResponse.json({
      message: `${result.count} posts approuvés`,
      count: result.count,
    });
  }

  if (action === "reject" && postIds?.length) {
    const result = await prisma.socialPost.updateMany({
      where: { id: { in: postIds } },
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
