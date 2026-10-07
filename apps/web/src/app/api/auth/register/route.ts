import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hash } from "@/lib/password";
import { getClientIp, retryAfterSeconds, sharedRateLimit } from "@/lib/rate-limit";
import { TEXTES_API } from "@/config/textes/compte";

const registerSchema = z.object({
  name: z.string().min(2, "Le prénom doit faire au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit faire au moins 8 caractères"),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit : 5 inscriptions par IP par heure, partagé entre isolats
    // et clé cf-connecting-ip (s16 reco 14).
    const rl = await sharedRateLimit("register-ip", getClientIp(request.headers), {
      maxRequests: 5,
      windowMs: 3600_000,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: TEXTES_API.tropDeTentatives },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds(rl)) } }
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
      // `details` alimente les erreurs par champ de /register ; `error` = texte humain.
      return NextResponse.json(
        { error: TEXTES_API.donneesInvalides, details: error.errors },
        { status: 400 }
      );
    }
    console.error("[API /auth/register]", error);
    return NextResponse.json({ error: TEXTES_API.erreurServeur }, { status: 500 });
  }
}
