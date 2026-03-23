import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * /api/admin/db — Accès lecture/écriture à la base de données.
 *
 * Auth : query param `secret=ADMIN_PASSWORD` ou header `Authorization: Bearer ADMIN_PASSWORD`.
 *
 * GET  ?action=query&model=Joke&where={}&take=5&select={}
 *      → prisma[model].findMany({ where, take, select, orderBy })
 *
 * GET  ?action=findOne&model=DailyContent&where={"date":"2026-03-23T00:00:00.000Z"}
 *      → prisma[model].findFirst({ where })
 *
 * GET  ?action=count&model=Joke&where={"isActive":true}
 *      → prisma[model].count({ where })
 *
 * POST { action: "update", model: "Joke", where: { id: "..." }, data: { content: "...", punchline: "..." } }
 *      → prisma[model].update({ where, data })
 *
 * POST { action: "delete", model: "DailyContent", where: { date: "2026-03-23T00:00:00.000Z" } }
 *      → prisma[model].delete({ where })
 *
 * Tables autorisées : Joke, Tip, Video, DailyContent, SocialPost, BlogArticle,
 *                      ContentPlan, ContentPlanEntry, LearningPath, Subscription, User (read-only)
 */

// Tables autorisées et leurs clés Prisma
const ALLOWED_MODELS: Record<string, keyof typeof prisma> = {
  Joke: "joke",
  Tip: "tip",
  Video: "video",
  DailyContent: "dailyContent",
  SocialPost: "socialPost",
  BlogArticle: "blogArticle",
  ContentPlan: "contentPlan",
  ContentPlanEntry: "contentPlanEntry",
  LearningPath: "learningPath",
  LearningPathStep: "learningPathStep",
  Subscription: "subscription",
  User: "user",
  UserPathProgress: "userPathProgress",
  UserFavorite: "userFavorite",
};

// Tables en lecture seule (pas d'update/delete)
const READ_ONLY_MODELS = new Set(["User", "Subscription", "UserFavorite"]);

function verifyAuth(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${adminPassword}`) return true;

  const { searchParams } = new URL(request.url);
  return searchParams.get("secret") === adminPassword;
}

function safeJsonParse(str: string | null): Record<string, unknown> | undefined {
  if (!str) return undefined;
  try {
    return JSON.parse(str);
  } catch {
    return undefined;
  }
}

// ─── GET : read operations ────────────────────────────────────────

export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "query";
  const modelName = searchParams.get("model");

  if (!modelName || !ALLOWED_MODELS[modelName]) {
    return NextResponse.json({
      error: `Modèle invalide. Autorisés : ${Object.keys(ALLOWED_MODELS).join(", ")}`,
    }, { status: 400 });
  }

  const prismaModel = prisma[ALLOWED_MODELS[modelName]] as Record<string, CallableFunction>;
  const where = safeJsonParse(searchParams.get("where")) || {};
  const select = safeJsonParse(searchParams.get("select"));
  const orderBy = safeJsonParse(searchParams.get("orderBy"));
  const take = Math.min(parseInt(searchParams.get("take") || "20"), 100);

  try {
    if (action === "count") {
      const count = await prismaModel.count({ where });
      return NextResponse.json({ model: modelName, count });
    }

    if (action === "findOne") {
      const record = await prismaModel.findFirst({
        where,
        ...(select ? { select } : {}),
      });
      return NextResponse.json({ model: modelName, record });
    }

    // Default: query (findMany)
    const records = await prismaModel.findMany({
      where,
      ...(select ? { select } : {}),
      ...(orderBy ? { orderBy } : { orderBy: { createdAt: "desc" } }),
      take,
    });

    return NextResponse.json({ model: modelName, count: records.length, records });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Erreur requête",
    }, { status: 500 });
  }
}

// ─── POST : write operations ──────────────────────────────────────

export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const { action, model: modelName, where, data } = body;

  if (!modelName || !ALLOWED_MODELS[modelName]) {
    return NextResponse.json({
      error: `Modèle invalide. Autorisés : ${Object.keys(ALLOWED_MODELS).join(", ")}`,
    }, { status: 400 });
  }

  if (READ_ONLY_MODELS.has(modelName) && action !== "query") {
    return NextResponse.json({
      error: `${modelName} est en lecture seule`,
    }, { status: 403 });
  }

  const prismaModel = prisma[ALLOWED_MODELS[modelName]] as Record<string, CallableFunction>;

  try {
    if (action === "update") {
      if (!where || !data) {
        return NextResponse.json({ error: "where et data requis" }, { status: 400 });
      }
      const updated = await prismaModel.update({ where, data });
      return NextResponse.json({ model: modelName, action: "updated", record: updated });
    }

    if (action === "delete") {
      if (!where) {
        return NextResponse.json({ error: "where requis" }, { status: 400 });
      }
      const deleted = await prismaModel.delete({ where });
      return NextResponse.json({ model: modelName, action: "deleted", id: deleted.id });
    }

    return NextResponse.json({ error: "Action invalide. Utilisez: update, delete" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Erreur requête",
    }, { status: 500 });
  }
}
