import { ImageResponse } from "next/og";
import { getFonts } from "@/lib/social/polices";
import { OgQuiz } from "@/lib/social/templates/cartes-og";

// Runtime Node.js (défaut) : OpenNext/Cloudflare refuse les routes `runtime = "edge"`
// dans le bundle serveur (migration Cloudflare, étape B). Même rendu `next/og`.
// Gabarit : spec @design cycle 8 §1 (plus de profils en emojis ni de « gratuit »).
export const alt = "Quiz : Quel type d'humour es-tu ? | deviens-marrant.fr";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  // Polices AVANT toute composition : elles alimentent la mise en lignes mesurée.
  const fonts = await getFonts();
  return new ImageResponse(<OgQuiz />, { ...size, fonts });
}
