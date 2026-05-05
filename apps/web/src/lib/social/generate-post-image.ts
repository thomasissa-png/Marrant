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
  void slide;
  switch (post.format) {
    case "IMAGE_QUI_CLAQUE": {
      // Refonte s7 : punchline ≤ 6 mots en gros sur fond noir + accent violet.
      // On reuse generateLaVanne pour son rendu visuel italique-grand-format
      // mais on utilise UNIQUEMENT le hook comme punchline (caption = champ content séparé).
      return generateLaVanne({
        setup: "",
        punchline: post.hook || post.content.slice(0, 60),
        category: "",
      });
    }

    case "TECHNIQUE_DU_JOUR": {
      // Legacy — conservé pour images existantes en DB
      const lines = post.content.split("\n").filter(Boolean);
      return generateTechniqueDuJour({
        technique: post.hook || lines[0] || "Technique",
        description: lines.slice(1).join(" ").slice(0, 200),
        example: lines.length > 2 ? lines[2] : undefined,
      });
    }

    case "QUOTE_ANALYSIS": {
      // Legacy — conservé pour images existantes en DB
      const parts = post.content.split("\n\n").filter(Boolean);
      return generateLaVanne({
        setup: parts[0] || post.hook,
        punchline: parts[1] || parts[0] || post.hook,
        category: "Analyse",
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
