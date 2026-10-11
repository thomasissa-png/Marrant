import { ImageResponse } from "next/og";
import { getFonts } from "@/lib/social/polices";
import { OgAccueil } from "@/lib/social/templates/cartes-og";

// Runtime Node.js (défaut) : OpenNext/Cloudflare refuse les routes `runtime = "edge"`
// dans le bundle serveur (migration Cloudflare, étape B). Même rendu `next/og`.
// Gabarit : spec @design cycle 8 §1 (fond #0D0D0D, Plus Jakarta Sans, pied à droite).
export const alt = "deviens-marrant.fr | Apprends à être drôle";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Polices AVANT toute composition : elles alimentent la mise en lignes mesurée.
  const fonts = await getFonts();
  return new ImageResponse(<OgAccueil />, { ...size, fonts });
}
