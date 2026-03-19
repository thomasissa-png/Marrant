import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/social — Liste les posts sociaux (avec filtres).
 * POST /api/admin/social — Actions en batch (approve, reject).
 */

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((e) => e.trim())
    .filter((e) => e.length > 0);
}

async function verifyAdmin(): Promise<{ email: string } | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) return null; // No admins configured
  if (!adminEmails.includes(session.user.email)) return null;

  return { email: session.user.email };
}

export async function GET(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
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
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await req.json();
  const { action, postIds, postId, content } = body;

  if (action === "approve_all") {
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
