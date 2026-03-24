import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePostImage } from "@/lib/social/generate-post-image";

export const dynamic = "force-dynamic";

/**
 * GET /api/social/image?postId=xxx&slide=0
 *
 * Génère un PNG 1080×1080 à partir d'un SocialPost.
 * Utilisé comme fallback si l'image Object Storage n'est pas disponible.
 *
 * Le template est choisi en fonction du format du post :
 * - TECHNIQUE_DU_JOUR → template "Technique du Jour"
 * - QUOTE_ANALYSIS → template "La Vanne"
 * - CAROUSEL → template "Décryptage" (slide index requis)
 * - POST / TWEET → template "Le Défi"
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    const slideIndex = parseInt(searchParams.get("slide") || "0", 10);

    if (!postId) {
      return NextResponse.json({ error: "postId requis" }, { status: 400 });
    }

    const post = await prisma.socialPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post introuvable", postId, hint: "Vérifiez que le postId existe dans la base de données de cet environnement" },
        { status: 404 },
      );
    }

    // Validate carousel slide index
    if (post.format === "CAROUSEL") {
      const slides = post.threadParts;
      if (slideIndex < 0 || slideIndex >= slides.length) {
        return NextResponse.json(
          { error: `Slide ${slideIndex} hors limites (0-${slides.length - 1})` },
          { status: 400 },
        );
      }
    }

    const png = await generatePostImage(post, slideIndex);

    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("[social/image] Erreur génération:", error);
    return NextResponse.json(
      { error: "Erreur génération image" },
      { status: 500 },
    );
  }
}
