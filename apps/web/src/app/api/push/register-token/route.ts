import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Endpoint d'enregistrement du push token (FCM Android / APNs iOS).
 * Appelé après opt-in onboarding de l'app mobile.
 *
 * Body : { token: string, platform: "ios" | "android" }
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { token?: string; platform?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { token, platform } = body;
  if (!token || !platform || !["ios", "android"].includes(platform)) {
    return NextResponse.json({ error: "Missing or invalid token/platform" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Upsert : un user peut avoir plusieurs devices, mais un token unique
  // Schema attendu : table PushToken { id, userId, token (unique), platform, createdAt, lastSeenAt }
  try {
    await prisma.pushToken.upsert({
      where: { token },
      create: {
        token,
        platform,
        userId: user.id,
        lastSeenAt: new Date(),
      },
      update: {
        userId: user.id,
        platform,
        lastSeenAt: new Date(),
      },
    });
  } catch (err) {
    console.error("[push/register-token] erreur DB :", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

/**
 * DELETE : retirer un token (ex : opt-out push, désinstall).
 */
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { token?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    await prisma.pushToken.delete({ where: { token: body.token } });
  } catch {
    // Token déjà absent : ok
  }

  return NextResponse.json({ ok: true });
}
