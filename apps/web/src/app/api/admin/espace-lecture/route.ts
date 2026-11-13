/**
 * GET /api/admin/espace-lecture (s24, lot D9) : lecture de la mesure d'usage de l'espace client.
 * LECTURE SEULE (aucune écriture, aucune ligne de journal avec un identifiant).
 * Interrupteur fermé : 404 avant toute lecture (rien n'est mesuré fermé, rien à lire). Ouvert : auth
 * admin existante (`Authorization: Bearer {ADMIN_PASSWORD}`, `refusAdmin`) ; sans elle 401.
 * Réponse : une ligne par abonné anonymisé (M-A, M-B…), heures de Paris, aucun pourcentage sous 15
 * abonnés (`lib/analytics/espace-lecture.ts`). Une requête par table, agrégée (pas de N+1).
 * `?format=texte` : le tableau en texte brut.
 */
import { NextRequest, NextResponse } from "next/server";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { refusAdmin } from "@/lib/admin/auth";
import { lectureEspace } from "@/lib/analytics/espace-lecture";
import { chargerDonneesLecture } from "@/lib/analytics/espace-lecture-donnees";

export const dynamic = "force-dynamic";

const PRIVE = { "Cache-Control": "private, no-store" };

export async function GET(request: NextRequest) {
  if (!ESPACE_CLIENT_PUBLIE) return NextResponse.json({ error: "Introuvable" }, { status: 404, headers: PRIVE });
  const refus = refusAdmin(request);
  if (refus) return refus;
  try {
    const lecture = lectureEspace(await chargerDonneesLecture());
    if (request.nextUrl.searchParams.get("format") === "texte") {
      return new NextResponse(lecture.texte, { headers: { ...PRIVE, "Content-Type": "text/plain; charset=utf-8" } });
    }
    return NextResponse.json(lecture, { headers: PRIVE });
  } catch (err) {
    console.error("[API admin/espace-lecture] lecture impossible :", err instanceof Error ? err.name : "inconnue");
    return NextResponse.json({ error: "Lecture impossible" }, { status: 503, headers: PRIVE });
  }
}
