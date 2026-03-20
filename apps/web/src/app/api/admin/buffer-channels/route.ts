import { NextResponse } from "next/server";
import { getBufferChannels, isBufferConfigured } from "@/lib/social/buffer-client";

/**
 * GET /api/admin/buffer-channels?secret=CRON_SECRET
 *
 * Utilitaire pour récupérer les Channel IDs Buffer.
 * Appeler une fois après avoir connecté les profils dans Buffer,
 * puis copier les IDs dans les Secrets Replit :
 *   BUFFER_CHANNEL_TWITTER, BUFFER_CHANNEL_LINKEDIN, BUFFER_CHANNEL_INSTAGRAM
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isBufferConfigured()) {
    return NextResponse.json({
      error: "Buffer non configuré. Ajoute BUFFER_ACCESS_TOKEN et BUFFER_ORGANIZATION_ID dans les Secrets Replit.",
    }, { status: 500 });
  }

  try {
    const channels = await getBufferChannels();

    return NextResponse.json({
      message: "Copie les IDs ci-dessous dans les Secrets Replit",
      channels: channels.map((ch) => ({
        id: ch.id,
        name: ch.displayName || ch.name,
        platform: ch.service,
        paused: ch.isQueuePaused,
        secretName: `BUFFER_CHANNEL_${ch.service.toUpperCase()}`,
      })),
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
