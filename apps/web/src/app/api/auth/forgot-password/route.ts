import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const rl = rateLimit(`forgot:${ip}`, { maxRequests: 3, windowMs: 3600_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessaie plus tard." },
        { status: 429 }
      );
    }

    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email requis" },
        { status: 400 }
      );
    }

    // Toujours répondre OK pour ne pas révéler si l'email existe
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, email: true, passwordHash: true },
    });

    if (user && user.passwordHash) {
      // Générer un token de réinitialisation
      const token = randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

      // Supprimer les anciens tokens pour cet email
      await prisma.verificationToken.deleteMany({
        where: { identifier: user.email },
      });

      // Créer le nouveau token
      await prisma.verificationToken.create({
        data: {
          identifier: user.email,
          token,
          expires,
        },
      });

      // TODO: Envoyer un email avec le lien de réinitialisation
      // resetUrl: ${NEXTAUTH_URL}/reset-password?token=${token}&email=${email}
      // Pour l'instant le token est stocké en DB et validé via /api/auth/reset-password
    }

    return NextResponse.json({
      message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
    });
  } catch (error) {
    console.error("[API /auth/forgot-password]", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
