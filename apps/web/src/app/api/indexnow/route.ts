import { NextResponse } from "next/server";
import { submitToIndexNow } from "@/lib/indexnow";
import { bearerToken, isAdminPassword, safeEqual } from "@/lib/blog-preview-auth";

/**
 * Accès réservé (s15) : `Authorization: Bearer <CRON_SECRET>` ou
 * `Bearer <ADMIN_PASSWORD>`, comparaison en temps constant. Avant : route
 * ouverte, n'importe qui pouvait faire soumettre des URL avec notre clé.
 */
async function isAuthorized(request: Request): Promise<boolean> {
  const token = bearerToken(request.headers.get("authorization"));
  if (!token) return false;
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (cronSecret && (await safeEqual(token, cronSecret))) return true;
  return isAdminPassword(token);
}

/**
 * IndexNow API : notifie Bing (et Yandex, Naver, Seznam) de la mise à jour de pages.
 * POST /api/indexnow avec un body JSON { urls: string[] }.
 * Logique partagée : src/lib/indexnow.ts (aussi utilisée par les crons et la
 * publication programmée des articles, sans self-fetch vers cette route).
 */
export async function POST(request: Request) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let urls: unknown;
  try {
    urls = ((await request.json()) as { urls?: unknown })?.urls;
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  if (!Array.isArray(urls) || urls.length === 0 || !urls.every((u) => typeof u === "string")) {
    return NextResponse.json(
      { error: "Le champ 'urls' est requis (tableau de strings)" },
      { status: 400 }
    );
  }

  const result = await submitToIndexNow(urls as string[]);
  if (result.ok) {
    return NextResponse.json({ success: true, status: result.status, submitted: result.submitted });
  }
  if (result.reason === "missing-key") {
    return NextResponse.json({ error: "INDEXNOW_KEY not configured" }, { status: 503 });
  }
  return NextResponse.json(
    { error: "Erreur lors de la soumission IndexNow", status: result.status ?? null },
    { status: 502 }
  );
}
