import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateJoke, generateTip, analyzeRepartee } from "@/lib/claude";

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
    // TODO: Vérifier que l'utilisateur est premium
    const body = await request.json();
    const data = requestSchema.parse(body);

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
    return NextResponse.json(
      { error: "Erreur lors de la génération IA" },
      { status: 500 }
    );
  }
}
