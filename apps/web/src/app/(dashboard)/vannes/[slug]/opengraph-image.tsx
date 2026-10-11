import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { buildJokeSlug, parseShortIdFromSlug, pickBySlug } from "@/lib/catalogue-slug";
import { getFonts } from "@/lib/social/polices";
import { OgVanne } from "@/lib/social/templates/cartes-og";

export const runtime = "nodejs";
export const alt = "Vanne | deviens-marrant.fr";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Repli : vanne introuvable ou base en erreur. */
const VANNE_REPLI = "Une vanne à ressortir ce soir";

// Gabarit : spec @design cycle 8 §1. Plus jamais de troncature « ... » : le corps
// descend de 48 à 36 px ; si la vanne ne tient pas, OgVanne rend la carte de marque.
export default async function OgImage({ params }: { params: { slug: string } }) {
  // Polices AVANT toute composition : elles alimentent la mise en lignes mesurée.
  const fonts = await getFonts();
  const shortId = parseShortIdFromSlug(params.slug);
  let content = VANNE_REPLI;
  let punchline = "";
  if (shortId) {
    try {
      const candidates = await prisma.joke.findMany({
        where: { id: { startsWith: shortId }, isActive: true },
        select: { id: true, content: true, punchline: true },
        take: 200,
      });
      const joke = pickBySlug(candidates, params.slug, buildJokeSlug);
      if (joke) {
        content = joke.content;
        punchline = joke.punchline;
      }
    } catch {
      // repli plein texte
    }
  }

  return new ImageResponse(<OgVanne content={content} punchline={punchline} />, { ...size, fonts });
}
