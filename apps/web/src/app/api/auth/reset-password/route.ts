import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "@/lib/password";
import { z } from "zod";
import { getClientIp, retryAfterSeconds, sharedRateLimit } from "@/lib/rate-limit";
import { hashResetToken } from "@/lib/reset-token";
import { TEXTES_API } from "@/config/textes/compte";

const RESET_LIMIT = { maxRequests: 10, windowMs: 15 * 60_000 };

const resetSchema = z.object({
  token: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
});

export async function POST(request: NextRequest) {
  try {
    // s16 reco 14 : limite partagée, clé cf-connecting-ip.
    const rl = await sharedRateLimit("reset-ip", getClientIp(request.headers), RESET_LIMIT);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: TEXTES_API.tropDeTentatives },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds(rl)) } }
      );
    }

    const body = await request.json();
    const { token, email, password } = resetSchema.parse(body);

    // s16 reco 15 : la base ne contient que le hash du jeton.
    const tokenHash = hashResetToken(token);
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email.toLowerCase().trim(),
        token: tokenHash,
        expires: { gt: new Date() },
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Lien invalide ou expiré. Demande un nouveau lien." },
        { status: 400 }
      );
    }

    // Mettre à jour le mot de passe
    const passwordHash = await hash(password);

    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { passwordHash, passwordChangedAt: new Date() },
    });

    // Supprimer le token utilisé
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
        },
      },
    });

    return NextResponse.json({
      message: "Mot de passe réinitialisé avec succès.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Le seul message utile à l'écran : la longueur du mot de passe.
      const passwordIssue = error.errors.find((e) => e.path[0] === "password" && e.code === "too_small");
      return NextResponse.json(
        { error: passwordIssue?.message ?? TEXTES_API.donneesInvalides, details: error.errors },
        { status: 400 }
      );
    }
    console.error("[API /auth/reset-password]", error);
    return NextResponse.json({ error: TEXTES_API.erreurServeur }, { status: 500 });
  }
}
