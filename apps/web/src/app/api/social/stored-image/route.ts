import { NextResponse } from "next/server";
import { getStoredImage } from "@/lib/social/image-storage";

export const dynamic = "force-dynamic";

/**
 * GET /api/social/stored-image?key=social-images/xxx.png
 *
 * Sert une image pré-générée depuis Replit Object Storage.
 * Utilisé par Buffer pour récupérer les images Instagram.
 *
 * Cache : 7 jours (l'image ne change plus une fois uploadée).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key || !key.startsWith("social-images/")) {
    return NextResponse.json({ error: "key requis (format: social-images/xxx.png)" }, { status: 400 });
  }

  const png = await getStoredImage(key);

  if (!png) {
    return NextResponse.json(
      { error: "Image introuvable", key },
      { status: 404 },
    );
  }

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=604800, immutable",
    },
  });
}
