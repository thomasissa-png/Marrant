import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "@/lib/password";
import { z } from "zod";

const resetSchema = z.object({
  token: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, email, password } = resetSchema.parse(body);

    // Vérifier le token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email.toLowerCase().trim(),
        token,
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
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[API /auth/reset-password]", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
