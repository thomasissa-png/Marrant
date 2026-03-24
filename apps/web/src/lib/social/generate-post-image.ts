// ───────────────────────────────────────────────────────────────────
// Generate Post Image — shared logic for rendering a SocialPost to PNG
//
// Extracts the format→template mapping logic used by both:
// - /api/social/image (on-demand generation)
// - /api/cron/daily-social (pre-generation for Object Storage)
// ───────────────────────────────────────────────────────────────────

import {
  generateTechniqueDuJour,
  generateLaVanne,
  generateDecryptageSlide,
  generateLeDefi,
} from "./image-generator";

interface PostData {
  format: string;
  hook: string;
  content: string;
  targetPersona: string;
  threadParts: string[];
}

/**
 * Génère un PNG à partir des données d'un SocialPost.
 *
 * @param post - Données du post (format, hook, content, targetPersona, threadParts)
 * @param slide - Index de slide pour les carousel (défaut 0)
 * @returns Buffer PNG
 */
export async function generatePostImage(
  post: PostData,
  slide = 0,
): Promise<Buffer> {
  switch (post.format) {
    case "TECHNIQUE_DU_JOUR": {
      const lines = post.content.split("\n").filter(Boolean);
      return generateTechniqueDuJour({
        technique: post.hook || lines[0] || "Technique",
        description: lines.slice(1).join(" ").slice(0, 200),
        example: lines.length > 2 ? lines[2] : undefined,
      });
    }

    case "QUOTE_ANALYSIS": {
      const parts = post.content.split("\n\n").filter(Boolean);
      return generateLaVanne({
        setup: parts[0] || post.hook,
        punchline: parts[1] || parts[0] || post.hook,
        category: "Analyse",
      });
    }

    case "CAROUSEL": {
      const slides = post.threadParts;
      const idx = Math.max(0, Math.min(slide, slides.length - 1));
      const totalSlides = slides.length;
      const slideText = slides[idx] || "";
      const dotIndex = slideText.indexOf(".");
      const title =
        dotIndex > 0 && dotIndex < 60
          ? slideText.slice(0, dotIndex + 1)
          : slideText.slice(0, 50);
      const content =
        dotIndex > 0 && dotIndex < 60
          ? slideText.slice(dotIndex + 1).trim()
          : slideText;

      return generateDecryptageSlide({
        slideNumber: idx + 1,
        totalSlides,
        title,
        content,
        isFirstSlide: idx === 0,
        isLastSlide: idx === totalSlides - 1,
      });
    }

    default: {
      return generateLeDefi({
        challenge: post.hook || post.content.slice(0, 80),
        context: post.content.slice(0, 200),
        persona: (post.targetPersona as "YANIS" | "SOPHIE" | "MARC") || "YANIS",
      });
    }
  }
}
