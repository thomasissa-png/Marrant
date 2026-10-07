import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientIp, retryAfterSeconds, sharedRateLimit } from "@/lib/rate-limit";
import { generateResetToken, hashResetToken, RESET_TOKEN_TTL_MS } from "@/lib/reset-token";
import { sendPasswordResetEmail } from "@/lib/email";
import { firstNameFrom } from "@/lib/emails/annual-renewal-reminder";
import { TEXTES_API } from "@/config/textes/compte";

const FORGOT_LIMIT = { maxRequests: 3, windowMs: 3600_000 };
/** Lot H : 3 e-mails par adresse cible et par heure, quelle que soit l'IP (clé hachée). */
const FORGOT_EMAIL_LIMIT = { maxRequests: 3, windowMs: 3600_000 };

export async function POST(request: NextRequest) {
  try {
    // s16 reco 14 : limite partagée entre isolats, clé cf-connecting-ip.
    const rl = await sharedRateLimit("forgot-ip", getClientIp(request.headers), FORGOT_LIMIT);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: TEXTES_API.tropDeTentatives },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds(rl)) } }
      );
    }

    const body = (await request.json().catch(() => null)) as { email?: unknown } | null;
    const email = body?.email;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: TEXTES_API.emailRequis }, { status: 400 });
    }

    // Avant la recherche du compte : même réponse que le compte existe ou non.
    const parEmail = await sharedRateLimit("forgot-email", email.toLowerCase().trim(), FORGOT_EMAIL_LIMIT);
    if (!parEmail.allowed) {
      return NextResponse.json(
        { error: TEXTES_API.tropDeTentatives },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds(parEmail)) } }
      );
    }

    // Toujours répondre OK pour ne pas révéler si l'email existe
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, email: true, name: true, passwordHash: true },
    });

    if (user && user.passwordHash) {
      // s16 reco 15 : seul le hash SHA-256 du jeton est stocké en base.
      const token = generateResetToken();
      const expires = new Date(Date.now() + RESET_TOKEN_TTL_MS);

      // Supprimer les anciens tokens pour cet email
      await prisma.verificationToken.deleteMany({
        where: { identifier: user.email },
      });

      await prisma.verificationToken.create({
        data: {
          identifier: user.email,
          token: hashResetToken(token),
          expires,
        },
      });

      const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;
      try {
        await sendPasswordResetEmail(user.email, resetUrl, firstNameFrom(user.name));
      } catch (err) {
        console.error(`[API /auth/forgot-password] Erreur envoi email (user ${user.id}):`, err);
      }
    }

    return NextResponse.json({
      message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
    });
  } catch (error) {
    console.error("[API /auth/forgot-password]", error);
    return NextResponse.json({ error: TEXTES_API.erreurServeur }, { status: 500 });
  }
}
