/**
 * GET /api/admin/lettre-premium/numeros (s22) : numéros de la lettre de la semaine pas encore
 * partis, rendus tels qu'ils partiront, avec leur empreinte et leur état d'approbation.
 * Auth `Authorization: Bearer {ADMIN_PASSWORD}`. Lisible interrupteurs fermés.
 * Sans la migration 15 : `disponible: false` (réponse 200).
 */
import { NextRequest, NextResponse } from "next/server";
import { refusAdmin } from "@/lib/admin/auth";
import { listerNumerosHebdoAdmin } from "@/lib/admin/lettre-hebdo-numeros";
import { estTableAbsente } from "@/lib/analytics/weekly-lettre";
import { siteBaseUrl } from "@/lib/newsletter";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const refus = refusAdmin(request);
  if (refus) return refus;
  try {
    const numeros = await listerNumerosHebdoAdmin(new Date(), siteBaseUrl());
    return NextResponse.json({ disponible: true, numeros });
  } catch (err) {
    if (estTableAbsente(err)) {
      return NextResponse.json({ disponible: false, raison: "Colonnes d'approbation absentes : migration 15 non jouée sur cette base." });
    }
    console.error(`[admin:lettre-premium/numeros] Échec : ${err instanceof Error ? err.message : "erreur inconnue"}`);
    return NextResponse.json({ error: "Numéros illisibles (base indisponible)" }, { status: 500 });
  }
}
