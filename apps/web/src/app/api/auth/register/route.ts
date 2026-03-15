import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hash } from "@/lib/password";
import { rateLimit } from "@/lib/rate-limit";

const registerSchema = z.object({
  name: z.string().min(2, "Le prénom doit faire au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(12, "Le mot de passe doit faire au moins 12 caractères"),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 inscriptions par IP par heure
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const rl = rateLimit(`register:${ip}`, { maxRequests: 5, windowMs: 3600_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessaie plus tard." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = registerSchema.parse(body);
    const name = parsed.name.trim();
    const email = parsed.email.toLowerCase().trim();
    const password = parsed.password;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte avec cet email existe déjà" },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        level: true,
        xp: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[API /auth/register]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
