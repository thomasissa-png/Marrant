/**
 * GET /api/admin/semaine (s21, 18/10) : onglet « Semaine » de la page admin.
 *
 * - Auth : `Authorization: Bearer {ADMIN_PASSWORD}` (comme les autres /api/admin/*).
 * - `?periode=rapport` (défaut) : semaine du dernier rapport du lundi ;
 *   `?periode=glissante` : 7 derniers jours complets.
 * - Mêmes fonctions que l'e-mail du lundi (voir `lib/admin/semaine.ts`) ; aucune
 *   écriture, aucun envoi. Toujours dynamique.
 */
import { NextRequest, NextResponse } from "next/server";
import { refusAdmin } from "@/lib/admin/auth";
import { chargerSemaine } from "@/lib/admin/semaine";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const refus = refusAdmin(request);
  if (refus) return refus;
  const mode = request.nextUrl.searchParams.get("periode") === "glissante" ? "glissante" : "rapport";
  try {
    return NextResponse.json(await chargerSemaine(new Date(), mode));
  } catch (err) {
    console.error(`[admin:semaine] Échec : ${err instanceof Error ? err.message : "erreur inconnue"}`);
    return NextResponse.json({ error: "Semaine illisible (base indisponible)" }, { status: 500 });
  }
}
