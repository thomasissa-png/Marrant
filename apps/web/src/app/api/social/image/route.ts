import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generateTechniqueDuJour,
  generateLaVanne,
  generateDecryptageSlide,
  generateLeDefi,
} from "@/lib/social/image-generator";

export const dynamic = "force-dynamic";

/**
 * GET /api/social/image?postId=xxx&slide=0
 *
 * Génère un PNG 1080×1080 à partir d'un SocialPost.
 * Utilisé par Meta Graph API pour récupérer les images Instagram.
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

    let png: Buffer;

    switch (post.format) {
      case "TECHNIQUE_DU_JOUR": {
        // Parse content: first line = technique name, rest = description
        const lines = post.content.split("\n").filter(Boolean);
        png = await generateTechniqueDuJour({
          technique: post.hook || lines[0] || "Technique",
          description: lines.slice(1).join(" ").slice(0, 200),
          example: lines.length > 2 ? lines[2] : undefined,
        });
        break;
      }

      case "QUOTE_ANALYSIS": {
        // Parse: hook = setup-like quote, content has the analysis
        const parts = post.content.split("\n\n").filter(Boolean);
        png = await generateLaVanne({
          setup: parts[0] || post.hook,
          punchline: parts[1] || parts[0] || post.hook,
          category: "Analyse",
        });
        break;
      }

      case "CAROUSEL": {
        // Each slide from threadParts
        const slides = post.threadParts;
        if (slideIndex < 0 || slideIndex >= slides.length) {
          return NextResponse.json(
            { error: `Slide ${slideIndex} hors limites (0-${slides.length - 1})` },
            { status: 400 },
          );
        }

        const totalSlides = slides.length;
        const isFirst = slideIndex === 0;
        const isLast = slideIndex === totalSlides - 1;

        // Parse slide: first sentence = title, rest = content
        const slideText = slides[slideIndex];
        const dotIndex = slideText.indexOf(".");
        const title =
          dotIndex > 0 && dotIndex < 60
            ? slideText.slice(0, dotIndex + 1)
            : slideText.slice(0, 50);
        const content =
          dotIndex > 0 && dotIndex < 60
            ? slideText.slice(dotIndex + 1).trim()
            : slideText;

        png = await generateDecryptageSlide({
          slideNumber: slideIndex + 1,
          totalSlides,
          title,
          content,
          isFirstSlide: isFirst,
          isLastSlide: isLast,
        });
        break;
      }

      default: {
        // POST, TWEET → "Le Défi" template
        png = await generateLeDefi({
          challenge: post.hook || post.content.slice(0, 80),
          context: post.content.slice(0, 200),
          persona: (post.targetPersona as "YANIS" | "SOPHIE" | "MARC") || "YANIS",
        });
        break;
      }
    }

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
