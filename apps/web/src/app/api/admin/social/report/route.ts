import { NextRequest, NextResponse } from "next/server";
import { chargerRapport, jourParis } from "@/lib/social/publication-report";

/**
 * GET /api/admin/social/report?jours=7 : rapport « prévu contre publié » des
 * réseaux sociaux, par réseau et par jour (heure de Paris), sur les N derniers
 * jours (1 à 60, défaut 7) jusqu'à aujourd'hui inclus.
 *
 * Auth : Bearer ADMIN_PASSWORD (même pattern que /api/admin/social).
 */
export const dynamic = "force-dynamic";

function verifyAdmin(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return request.headers.get("authorization") === `Bearer ${adminPassword}`;
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const jours = Math.min(60, Math.max(1, parseInt(new URL(request.url).searchParams.get("jours") || "7", 10) || 7));
  const now = new Date();
  const au = jourParis(now);
  const du = jourParis(new Date(now.getTime() - (jours - 1) * 86_400_000));
  try {
    return NextResponse.json(await chargerRapport(du, au, now));
  } catch (err) {
    console.error("[admin/social/report] Échec :", err);
    return NextResponse.json({ error: "Base indisponible : réessaie dans une minute." }, { status: 503 });
  }
}
