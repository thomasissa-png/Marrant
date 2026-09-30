import { NextResponse } from "next/server";
import { submitToIndexNow } from "@/lib/indexnow";

/**
 * IndexNow API : notifie Bing (et Yandex, Naver, Seznam) de la mise à jour de pages.
 * POST /api/indexnow avec un body JSON { urls: string[] }.
 * Logique partagée : src/lib/indexnow.ts (aussi utilisée par les crons et la
 * publication programmée des articles, sans self-fetch vers cette route).
 */
export async function POST(request: Request) {
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
