import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hash } from "@/lib/password";
import { getClientIp, retryAfterSeconds, sharedRateLimit } from "@/lib/rate-limit";
import { TEXTES_API } from "@/config/textes/compte";
import { EMAIL_LONGUEUR_MAX } from "@/lib/email-longueur";

const registerSchema = z.object({
  // s21 B17 : prénom facultatif (vide ou absent → null en base, colonne déjà nullable ;
  // les e-mails disent alors « Salut, »). S'il est donné : au moins 2 caractères.
  name: z
    .string()
    .optional()
    .transform((v) => (v ?? "").trim())
    .refine((v) => v === "" || v.length >= 2, "Le prénom doit faire au moins 2 caractères"),
  // s26 batterie (défaut n°1) : adresse nettoyée (espaces, minuscules) puis bornée à 254 caractères (RFC 5321) ;
  // au-delà, même message qu'une adresse invalide (un e-mail de 10 016 caractères créait un compte).
  email: z.string().trim().toLowerCase().max(EMAIL_LONGUEUR_MAX, "Email invalide").email("Email invalide"),
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
    const name = parsed.name || null;
    const email = parsed.email;
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
