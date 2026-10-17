import { NextResponse } from "next/server";

/** Authentification admin : `Authorization: Bearer {ADMIN_PASSWORD}` (comme /api/admin/*). */
export function refusAdmin(request: Request): NextResponse | null {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return NextResponse.json({ error: "ADMIN_PASSWORD non configuré" }, { status: 500 });
  if (request.headers.get("authorization") !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  return null;
}
