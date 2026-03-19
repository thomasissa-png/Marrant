import { NextResponse } from "next/server";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? "35cc97ed505a4ae89d8470d259fc5662";
const HOST = "deviens-marrant.fr";

/**
 * IndexNow API — notifie Bing (et Yandex, Naver, Seznam) de la mise à jour de pages.
 * POST /api/indexnow avec un body JSON { urls: string[] }
 * Appelé automatiquement par le cron de contenu quotidien.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const urls: string[] = body.urls;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: "Le champ 'urls' est requis (tableau de strings)" },
        { status: 400 }
      );
    }

    // Soumettre à IndexNow (Bing + moteurs partenaires)
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/indexnow-key.txt`,
        urlList: urls.map((url) =>
          url.startsWith("http") ? url : `https://${HOST}${url}`
        ),
      }),
    });

    return NextResponse.json({
      success: true,
      status: response.status,
      submitted: urls.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la soumission IndexNow" },
      { status: 500 }
    );
  }
}
