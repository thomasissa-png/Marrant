import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  canauxEnPanne,
  lireInterrupteurs,
  mettreEnPause,
  reprendre,
  sauterAvantJ0,
  type SwitchDb,
} from "@/lib/social/platform-switch";
import { getBufferChannels, getConfiguredChannelIds, isBufferConfigured } from "@/lib/social/buffer-client";

/**
 * GET  /api/admin/social/platforms : état de l'interrupteur des 3 réseaux
 *      + santé du canal Buffer (déconnecté, verrouillé, introuvable).
 * POST /api/admin/social/platforms : { platform, action: "pause" | "reprise" | "sauter-avant-j0", raison?, j0? }
 *      Reprise refusée si le canal Buffer est en panne OU si Buffer est
 *      injoignable (état inconnu, QA C3). Posts en retard de plus de 24 h :
 *      REJECTED ; moins de 24 h : replanifiés à 1 par jour, hors silences, à
 *      l'heure de Paris du réseau. « sauter-avant-j0 » : posts APPROVED datés
 *      avant `j0` (AAAA-MM-JJ, Paris) passés en REJECTED.
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
  action: z.enum(["pause", "reprise", "sauter-avant-j0"]),
  raison: z.string().trim().max(300).optional(),
  j0: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide : platform (TWITTER, INSTAGRAM, LINKEDIN), action (pause, reprise, sauter-avant-j0), j0 au format AAAA-MM-JJ." }, { status: 400 });
  }
  const { platform, action, raison, j0 } = parsed.data;
  const now = new Date();
  try {
    if (action === "pause") {
      await mettreEnPause(db(), platform, raison || "Mis en pause depuis l'admin.", now);
      return NextResponse.json({ success: true, message: `${platform} en pause : plus aucun post ne part.` });
    }
    if (action === "sauter-avant-j0") {
      if (!j0) return NextResponse.json({ success: false, error: "j0 (AAAA-MM-JJ) obligatoire pour sauter les posts avant J0." }, { status: 400 });
      const { sautes } = await sauterAvantJ0(db(), platform, j0);
      return NextResponse.json({ success: true, message: `${platform} : ${sautes} post(s) datés avant le ${j0} passés en REJECTED.` });
    }
    const canaux = await pannes();
    if (canaux === null) {
      return NextResponse.json({ success: false, error: "Reprise refusée : Buffer injoignable ou non configuré, état du canal inconnu. Réessaie dans quelques minutes." }, { status: 503 });
    }
    const panne = canaux.find((p) => p.platform === platform);
    if (panne) {
      return NextResponse.json({ success: false, error: `Reprise impossible : ${panne.motif} Reconnecter le canal dans Buffer d'abord.` }, { status: 409 });
    }
    const { replanifies, expires } = await reprendre(db(), platform, now);
    return NextResponse.json({
      success: true,
      message: `${platform} repris.${replanifies > 0 ? ` ${replanifies} post(s) en retard replanifié(s) à 1 par jour.` : ""}${expires > 0 ? ` ${expires} post(s) expiré(s) (plus de 24 h de retard) passés en REJECTED.` : ""}`,
    });
  } catch (err) {
    console.error("[admin/social/platforms] Échec :", err);
    return NextResponse.json({ success: false, error: "Base indisponible : réessaie dans une minute." }, { status: 503 });
  }
}
