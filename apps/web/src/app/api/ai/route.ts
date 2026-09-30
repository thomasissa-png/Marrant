import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { generateJoke, generateTip, analyzeRepartee } from "@/lib/claude";
import { rateLimit } from "@/lib/rate-limit";
import { consumeDailyQuota } from "@/lib/persistent-quota";
import { isLlmBudgetExceededError } from "@/lib/ai/budget-guard";

/** Générations IA max par membre et par jour UTC (surcharge : AI_USER_DAILY_LIMIT). */
function getAiUserDailyLimit(): number {
  const value = Number(process.env.AI_USER_DAILY_LIMIT);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 30;
}

// Incident s14 : aucun fetch sortant (LLM, Buffer…) mis en cache par Next.
export const fetchCache = "force-no-store";

const jokeSchema = z.object({
  type: z.literal("joke"),
  categories: z.array(z.string()).optional(),
  level: z.string().optional(),
});

const tipSchema = z.object({
  type: z.literal("tip"),
  currentLevel: z.string().optional(),
  weakCategories: z.array(z.string()).optional(),
});

const reparteeSchema = z.object({
  type: z.literal("repartee"),
  situation: z.string().min(10),
});

const requestSchema = z.discriminatedUnion("type", [
  jokeSchema,
  tipSchema,
  reparteeSchema,
]);

export async function POST(request: NextRequest) {
  try {
    // Auth guard — vérifie que l'utilisateur est connecté ET premium
    const session = await getServerSession(authOptions);
    if (!session?.user || !("id" in session.user)) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    // Rate limit: 10 requêtes IA par minute par utilisateur
    const rl = rateLimit(`ai:${userId}`, { maxRequests: 10, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Trop de requêtes. Réessaie dans quelques instants." },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    if (!user || user.plan !== "PREMIUM") {
      return NextResponse.json(
        { error: "Cette fonctionnalité est réservée aux membres Premium" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = requestSchema.parse(body);

    // Limite PERSISTANTE par membre (s14) : le rateLimit ci-dessus est en
    // mémoire, donc non fiable sous Workers (un isolat = une mémoire).
    const quota = await consumeDailyQuota(`ai:${userId}`, getAiUserDailyLimit());
    if (!quota.allowed) {
      return NextResponse.json(
        { error: `Tu as utilisé tes ${quota.limit} générations IA du jour. Reviens demain pour la suite !` },
        { status: 429 }
      );
    }

    switch (data.type) {
      case "joke": {
        const joke = await generateJoke({
          categories: data.categories,
          level: data.level,
        });
        return NextResponse.json({ result: joke });
      }
      case "tip": {
        const tip = await generateTip({
          currentLevel: data.currentLevel,
          weakCategories: data.weakCategories,
        });
        return NextResponse.json({ result: tip });
      }
      case "repartee": {
        const analysis = await analyzeRepartee(data.situation);
        return NextResponse.json({ result: analysis });
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Requête invalide", details: error.errors },
        { status: 400 }
      );
    }
    if (isLlmBudgetExceededError(error)) {
      console.error("[API /ai] Coupe-circuit budget LLM :", error.message);
      return NextResponse.json(
        { error: "L'IA fait une petite pause. Réessaie un peu plus tard, promis elle revient !" },
        { status: 503 }
      );
    }
    console.error("[API /ai]", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération IA" },
      { status: 500 }
    );
  }
}
