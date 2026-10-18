/**
 * Contrôle d'accès des routes /api/admin/* ajoutées en s21 : même règle que les
 * routes existantes (`Authorization: Bearer {ADMIN_PASSWORD}`, 500 si le secret
 * manque, 401 sinon). Les routes existantes gardent leur contrôle en ligne.
 */
import { NextResponse, type NextRequest } from "next/server";

/** Réponse d'erreur à renvoyer telle quelle, ou null si l'accès est accordé. */
export function refusAdmin(request: NextRequest): NextResponse | null {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: "ADMIN_PASSWORD non configuré" }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  return null;
}
