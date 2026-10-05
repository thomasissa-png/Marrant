import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  canauxEnPanne,
  lireInterrupteurs,
  mettreEnPause,
  reprendre,
  type SwitchDb,
} from "@/lib/social/platform-switch";
import { getBufferChannels, getConfiguredChannelIds, isBufferConfigured } from "@/lib/social/buffer-client";

/**
 * GET  /api/admin/social/platforms : état de l'interrupteur des 3 réseaux
 *      + santé du canal Buffer (déconnecté, verrouillé, introuvable).
 * POST /api/admin/social/platforms : { platform, action: "pause" | "reprise", raison? }
 *      Reprise refusée si le canal Buffer est en panne ; les posts en retard
 *      sont replanifiés à 1 par jour (pas de rafale).
 *
 * Auth : Bearer ADMIN_PASSWORD (même pattern que /api/admin/social).
 */
export const dynamic = "force-dynamic";

function verifyAdmin(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return request.headers.get("authorization") === `Bearer ${adminPassword}`;
}

const db = () => prisma as unknown as SwitchDb;

/** Pannes de canal ; null si Buffer est injoignable ou non configuré (inconnu). */
async function pannes(): Promise<Array<{ platform: string; motif: string }> | null> {
  if (!isBufferConfigured()) return null;
  try {
    return canauxEnPanne(await getBufferChannels(), getConfiguredChannelIds());
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const [etats, canaux] = await Promise.all([lireInterrupteurs(db()), pannes()]);
  return NextResponse.json({
    platforms: etats.map((e) => ({
      ...e,
      canal: canaux === null ? "inconnu" : canaux.find((c) => c.platform === e.platform)?.motif ?? "ok",
    })),
  });
}

const Body = z.object({
  platform: z.enum(["TWITTER", "INSTAGRAM", "LINKEDIN"]),
  action: z.enum(["pause", "reprise"]),
  raison: z.string().trim().max(300).optional(),
});

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide : platform (TWITTER, INSTAGRAM, LINKEDIN) et action (pause, reprise)." }, { status: 400 });
  }
  const { platform, action, raison } = parsed.data;
  const now = new Date();
  try {
    if (action === "pause") {
      await mettreEnPause(db(), platform, raison || "Mis en pause depuis l'admin.", now);
      return NextResponse.json({ success: true, message: `${platform} en pause : plus aucun post ne part.` });
    }
    const panne = (await pannes())?.find((p) => p.platform === platform);
    if (panne) {
      return NextResponse.json({ success: false, error: `Reprise impossible : ${panne.motif} Reconnecter le canal dans Buffer d'abord.` }, { status: 409 });
    }
    const { replanifies } = await reprendre(db(), platform, now);
    return NextResponse.json({
      success: true,
      message: `${platform} repris.${replanifies > 0 ? ` ${replanifies} post(s) en retard replanifié(s) à 1 par jour.` : ""}`,
    });
  } catch (err) {
    console.error("[admin/social/platforms] Échec :", err);
    return NextResponse.json({ success: false, error: "Base indisponible : réessaie dans une minute." }, { status: 503 });
  }
}
