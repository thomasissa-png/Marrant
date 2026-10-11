import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { buildJokeSlug, parseShortIdFromSlug, pickBySlug } from "@/lib/catalogue-slug";
import { getFonts } from "@/lib/social/polices";
import { OgAccueil, OgVanne } from "@/lib/social/templates/cartes-og";

export const runtime = "nodejs";
export const alt = "Vanne | deviens-marrant.fr";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type VanneOg = { content: string; punchline: string };

// Gabarit : spec @design cycle 8 §1. Plus jamais de troncature « ... » : le corps
// descend de 48 à 36 px ; si la vanne ne tient pas, OgVanne rend la carte de marque.
// Vanne introuvable ou base en erreur : carte de marque (relecture @design cycle 9, C1),
// jamais une carte « Vanne » sans vanne (X la garderait en cache sans purge possible).
export default async function OgImage({ params }: { params: { slug: string } }) {
  // Polices AVANT toute composition : elles alimentent la mise en lignes mesurée.
  const fonts = await getFonts();
  const shortId = parseShortIdFromSlug(params.slug);
  let joke: VanneOg | null = null;
  if (shortId) {
    try {
      const candidates = await prisma.joke.findMany({
        where: { id: { startsWith: shortId }, isActive: true },
        select: { id: true, content: true, punchline: true },
        take: 200,
      });
      joke = pickBySlug(candidates, params.slug, buildJokeSlug) ?? null;
    } catch {
      // repli : carte de marque
    }
  }

  if (!joke) return new ImageResponse(<OgAccueil />, { ...size, fonts });
  return new ImageResponse(<OgVanne content={joke.content} punchline={joke.punchline} />, { ...size, fonts });
}
