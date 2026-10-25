import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { refuserSiAutreSite } from "@/lib/same-site";
import { retryAfterSeconds, sharedRateLimit } from "@/lib/rate-limit";
import { LETTRE_HEBDO_INSCRIPTIONS_OUVERTES, LETTRE_HEBDO_ORIGINES_ACTIVATION } from "@/config/lettre";
import { activerLettreHebdo, arreterLettreHebdo, arretExplicite, recoitHebdo, SELECT_CANDIDAT_HEBDO } from "@/lib/lettre/hebdo";

export const dynamic = "force-dynamic";

/**
 * Préférence de la lettre de la semaine (hebdo Premium, s21 ; spec US-H1, US-H2).
 *
 * s22 (inscription d'office) : `enabled` = inscrit, c'est-à-dire pas d'arrêt explicite (`arretExplicite`) ;
 * vrai par défaut, sans ligne de préférence.
 *
 * GET → { eligible, enabled, opposition, mensuelleSuspendue, finPrevue, adresseVerifiee, email }
 *   404 inscriptions fermées ; 401 sans session. `eligible` = plan PREMIUM. `opposition` =
 *   `User.emailOptOut` (aucune lettre ne part, quel que soit le réglage).
 * PUT { enabled: boolean, origine: "paiement" | "profil" } → { enabled, mensuelleSuspendue }
 *   - reprendre : inscriptions ouvertes (404 sinon), Premium (403), adresse vérifiée (403) ;
 *     efface l'arrêt explicite ; idempotent (inscrit d'office : rien n'est écrit) ;
 *   - arrêter : toujours possible, même inscriptions fermées ; respecté à vie.
 *   10 requêtes par minute et par compte (429 + Retry-After).
 */
const bodySchema = z.object({ enabled: z.boolean(), origine: z.enum(LETTRE_HEBDO_ORIGINES_ACTIVATION) }).strict();
const LIMITE = { maxRequests: 10, windowMs: 60_000 };

async function userIdCourant(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

async function etat(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { ...SELECT_CANDIDAT_HEBDO, subscription: { select: { cancelAtPeriodEnd: true, currentPeriodEnd: true } } },
  });
  if (!user) return null;
  const pref = user.premiumLetter;
  return {
    eligible: user.plan === "PREMIUM",
    enabled: !arretExplicite(pref),
    opposition: user.emailOptOut,
    // Pause de la mensuelle = destinataire de l'hebdo (fonction unique).
    mensuelleSuspendue: recoitHebdo(user),
    finPrevue: user.subscription?.cancelAtPeriodEnd && user.subscription.currentPeriodEnd ? user.subscription.currentPeriodEnd.toISOString() : null,
    adresseVerifiee: Boolean(user.emailVerified) || user.accounts.length > 0,
    email: user.email,
  };
}

export async function GET() {
  if (!LETTRE_HEBDO_INSCRIPTIONS_OUVERTES) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  try {
    const userId = await userIdCourant();
    if (!userId) return NextResponse.json({ error: "session" }, { status: 401 });
    const e = await etat(userId);
    if (!e) return NextResponse.json({ error: "session" }, { status: 401 });
    return NextResponse.json(e, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[API lettre-premium/preference GET]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "serveur" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const refus = refuserSiAutreSite(request, "PUT /api/lettre-premium/preference");
  if (refus) return refus;
  try {
    const userId = await userIdCourant();
    if (!userId) return NextResponse.json({ error: "session" }, { status: 401 });
    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "invalide" }, { status: 400 });
    const { enabled, origine } = parsed.data;
    if (enabled && !LETTRE_HEBDO_INSCRIPTIONS_OUVERTES) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

    const now = new Date();
    const rl = await sharedRateLimit("lettre-hebdo-preference", userId, LIMITE, now.getTime());
    if (!rl.allowed) {
      return NextResponse.json({ error: "trop" }, { status: 429, headers: { "Retry-After": String(retryAfterSeconds(rl, now.getTime())) } });
    }

    if (!enabled) {
      await arreterLettreHebdo(userId, origine, now);
    } else {
      const avant = await etat(userId);
      if (!avant) return NextResponse.json({ error: "session" }, { status: 401 });
      if (!avant.eligible) return NextResponse.json({ error: "non-premium" }, { status: 403 });
      if (!avant.adresseVerifiee) return NextResponse.json({ error: "adresse" }, { status: 403 });
      await activerLettreHebdo(userId, origine, now);
    }
    const apres = await etat(userId);
    return NextResponse.json({ enabled: apres?.enabled ?? false, mensuelleSuspendue: apres?.mensuelleSuspendue ?? false });
  } catch (err) {
    console.error("[API lettre-premium/preference PUT]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "serveur" }, { status: 500 });
  }
}
