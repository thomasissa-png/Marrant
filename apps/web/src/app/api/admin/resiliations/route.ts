/**
 * GET /api/admin/resiliations (s23) : compteur des motifs de résiliation (onglet Abonnés).
 * Auth : `Authorization: Bearer {ADMIN_PASSWORD}`. Comptes seulement, jamais d'identifiant.
 * Sans la migration 17 : `disponible: false`, réponse 200.
 */
import { NextRequest, NextResponse } from "next/server";
import { refusAdmin } from "@/lib/admin/auth";
import { chargerMotifsResiliation } from "@/lib/admin/motifs-resiliation";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const refus = refusAdmin(request);
  if (refus) return refus;
  try {
    return NextResponse.json(await chargerMotifsResiliation(), { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[API admin/resiliations]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Lecture des motifs impossible" }, { status: 500 });
  }
}
