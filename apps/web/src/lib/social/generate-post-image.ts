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
import {
  carrouselArticle, carrouselConseilCartes, carrouselDecryptage, carrouselVanne, carteVanneUnique, type Slide,
} from "./carrousel-piste-a";
import { vanneLinkedInImage } from "./carte-linkedin";

interface PostData {
  format: string;
  hook: string;
  content: string;
  targetPersona: string;
  threadParts: string[];
  sourceType?: string | null;
  /** s15 : carte LinkedIn du test alterné (`[variante:image]` dans directorNote). */
  platform?: string | null;
  directorNote?: string | null;
}

/** Conseil Instagram du mix : IMAGE_QUI_CLAQUE à 3 parties non vides. */
export function estConseil(post: PostData): boolean {
  return post.format === "IMAGE_QUI_CLAQUE" && post.threadParts.length === 3 && post.threadParts.every((p) => p?.trim());
}

/**
 * Carrousel v3 (cartes « piste A ») d'un post Instagram préparé, ou null
 * (anciens gabarits) :
 *  - vanne : threadParts = [amorce, chute] → amorce puis chute sur aplat ;
 *  - décryptage (s15, lot v5) : threadParts = [amorce, chute, mécanisme, consigne,
 *    renvoi] → 4 cartes (carrouselDecryptage) ;
 *  - relais d'article (sourceType BLOG) : 1re ligne = titre → couverture + fin.
 * LinkedIn `[variante:image]` éligible : 1 carte 4:5, la chute seule (v5 §8).
 */
export function slidesDuPost(post: PostData): Slide[] | null {
  const li = vanneLinkedInImage(post);
  // R6 : guillemets de la carte = ceux du texte du post (même décision, pas recalculée).
  if (li) return [carteVanneUnique("linkedin", { amorce: li.amorce, chute: [li.chute], citation: li.texte.startsWith("«") })];
  if (post.format !== "IMAGE_QUI_CLAQUE") return null;
  const [amorce, chute, mecanisme, consigne, renvoi] = post.threadParts;
  if (post.threadParts.length === 2 && amorce?.trim() && chute?.trim()) {
    return carrouselVanne({ amorce: amorce.trim(), chute: [chute.trim()] });
  }
  // Conseil (s15) : 3 parties [surtitre, situation, réplique + consigne] → 2 cartes du gabarit
  // conseil. Jamais ambigu : vanne = 2 parties, décryptage = 5 (aucun post en base à 3, 08/10).
  if (estConseil(post)) {
    const [surtitre, situation, carte2] = post.threadParts;
    return carrouselConseilCartes({ surtitre, situation, carte2 });
  }
  if (post.threadParts.length === 5 && post.threadParts.every((p) => p?.trim())) {
    return carrouselDecryptage({
      amorce: amorce.trim(), chute: [chute.trim()], mecanisme: mecanisme.trim(), consigne: consigne.trim(), renvoi: renvoi.trim(),
    });
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
  // Carte LinkedIn : alt de la carte (amorce + chute, « » R6 compris).
  if (vanneLinkedInImage(post)) {
    const carte = slidesDuPost(post)?.[0];
    if (carte) return carte.alt;
  }
  // Conseil : alt des 2 cartes, sans composer (jamais d'erreur ici ; le rendu tranche).
  if (estConseil(post)) {
    const [surtitre, situation, carte2] = post.threadParts.map((p) => p.replace(/\s*\n\s*/g, " ").trim());
    return `${surtitre} : ${situation} ${carte2}`;
  }
  const [amorce, chute] = post.threadParts;
  if ((post.threadParts.length === 2 || post.threadParts.length === 5) && amorce?.trim() && chute?.trim()) {
    return `${amorce.replace(/\s*\n\s*/g, " ").trim()} ${chute.trim()}`;
  }
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
