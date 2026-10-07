import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { refuserSiAutreSite } from "@/lib/same-site";
import { isPremiumPlan } from "@/lib/parcours-access";
import { arreterRappel } from "@/lib/rappels/rappel-parcours";
import { RAPPEL_PARCOURS_CONSENTEMENT, TEXTES_RAPPEL_API as T } from "@/config/textes/parcours-emails";

export const dynamic = "force-dynamic";

/**
 * Préférence du rappel e-mail des parcours (s17, D7). Interface : profil (lot C).
 *
 * GET  → { enabled, weekday, activatedAt, consentText, consentVersion, eligible }
 *        (`eligible` = Premium en cours : la case n'est montrée qu'à lui, C1).
 * POST { enabled: boolean, weekday?: 1..7 } → même forme.
 *   - activer : Premium uniquement (403 sinon), `weekday` obligatoire, date
 *     d'activation et version du texte enregistrées (preuve du consentement) ;
 *   - changer de jour : `enabled: true` + nouveau `weekday` (la date d'activation reste) ;
 *   - arrêter : toujours possible, origine `profil`.
 */
const bodySchema = z
  .object({ enabled: z.boolean(), weekday: z.number().int().min(1).max(7).optional() })
  .refine((b) => !b.enabled || b.weekday !== undefined);

async function userIdCourant(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

async function etat(userId: string) {
  const [user, pref] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { plan: true } }),
    prisma.parcoursReminderPreference.findUnique({
      where: { userId },
      select: { enabled: true, weekday: true, activatedAt: true },
    }),
  ]);
  return {
    enabled: pref?.enabled ?? false,
    weekday: pref?.weekday ?? null,
    activatedAt: pref?.activatedAt?.toISOString() ?? null,
    consentText: RAPPEL_PARCOURS_CONSENTEMENT.texte,
    consentVersion: RAPPEL_PARCOURS_CONSENTEMENT.version,
    eligible: isPremiumPlan(user?.plan),
  };
}

export async function GET() {
  try {
    const userId = await userIdCourant();
    if (!userId) return NextResponse.json({ error: T.authRequise }, { status: 401 });
    return NextResponse.json(await etat(userId));
  } catch (error) {
    console.error("[API /user/rappel-parcours GET]", error);
    return NextResponse.json({ error: T.serveur }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const refus = refuserSiAutreSite(request, "POST /api/user/rappel-parcours");
  if (refus) return refus;
  try {
    const userId = await userIdCourant();
    if (!userId) return NextResponse.json({ error: T.authRequise }, { status: 401 });

    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: T.invalide }, { status: 400 });
    const { enabled, weekday } = parsed.data;
    const now = new Date();

    if (!enabled) {
      await arreterRappel(prisma, userId, "profil", now);
      return NextResponse.json(await etat(userId));
    }

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
    if (!isPremiumPlan(user?.plan)) return NextResponse.json({ error: T.reservePremium }, { status: 403 });

    const prev = await prisma.parcoursReminderPreference.findUnique({ where: { userId }, select: { enabled: true } });
    const activation = prev?.enabled
      ? {}
      : { activatedAt: now, consentVersion: RAPPEL_PARCOURS_CONSENTEMENT.version, stoppedAt: null, stopOrigin: null };
    await prisma.parcoursReminderPreference.upsert({
      where: { userId },
      create: { userId, enabled: true, weekday: weekday as number, ...activation },
      update: { enabled: true, weekday: weekday as number, ...activation },
    });
    return NextResponse.json(await etat(userId));
  } catch (error) {
    console.error("[API /user/rappel-parcours POST]", error);
    return NextResponse.json({ error: T.serveur }, { status: 500 });
  }
}
