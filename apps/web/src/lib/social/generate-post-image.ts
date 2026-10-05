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
  renderSlides,
} from "./image-generator";
import { carrouselArticle, carrouselVanne, type Slide } from "./carrousel-piste-a";

interface PostData {
  format: string;
  hook: string;
  content: string;
  targetPersona: string;
  threadParts: string[];
  sourceType?: string | null;
}

/**
 * Carrousel v3 (cartes « piste A ») d'un post Instagram préparé, ou null
 * (anciens gabarits) :
 *  - vanne : threadParts = [amorce, chute] → amorce puis chute sur aplat ;
 *  - relais d'article (sourceType BLOG) : 1re ligne = titre → couverture + fin.
 */
export function slidesDuPost(post: PostData): Slide[] | null {
  if (post.format !== "IMAGE_QUI_CLAQUE") return null;
  const [amorce, chute] = post.threadParts;
  if (post.threadParts.length === 2 && amorce?.trim() && chute?.trim()) {
    return carrouselVanne({ amorce: amorce.trim(), chute: [chute.trim()] });
  }
  if (post.sourceType === "BLOG") {
    const titre = post.content.split("\n")[0]?.trim();
    if (titre) return carrouselArticle({ titre });
  }
  return null;
}

/** Nombre d'images à envoyer pour ce post (1 = image simple). */
export function nombreDeSlides(post: PostData): number {
  return slidesDuPost(post)?.length ?? 1;
}

/** Texte alternatif d'une image du post : amorce + chute, sinon le texte de la carte. */
export function texteAlternatifDuPost(post: PostData): string {
  const [amorce, chute] = post.threadParts;
  if (post.threadParts.length === 2 && amorce?.trim() && chute?.trim()) return `${amorce.trim()} ${chute.trim()}`;
  return (post.content.split("\n")[0] || post.hook).trim();
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
  const slides = slidesDuPost(post);
  if (slides) {
    const s = slides[Math.min(Math.max(0, Math.floor(slide) || 0), slides.length - 1)];
    const [png] = await renderSlides([s]);
    return png;
  }
  switch (post.format) {
    case "IMAGE_QUI_CLAQUE": {
      // s14 (préparation mensuelle depuis le catalogue) : carte « amorce // chute ».
      // threadParts = [amorce, chute] de la vanne reprise mot pour mot.
      if (post.threadParts.length === 2 && post.threadParts[0] && post.threadParts[1]) {
        return generateLaVanne({
          setup: post.threadParts[0],
          punchline: post.threadParts[1],
          category: "",
        });
      }
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
