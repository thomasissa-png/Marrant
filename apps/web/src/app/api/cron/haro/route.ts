import { NextResponse } from "next/server";
import {
  processHaroOpportunities,
  type HaroOpportunity,
} from "@/lib/ai/agents/haro-agent";

export const dynamic = "force-dynamic";

/**
 * Cron HARO — déclenché quotidiennement à 8h UTC.
 *
 * Ce cron accepte des opportunités HARO via POST (webhook)
 * ou peut être appelé en GET avec des opportunités stockées.
 *
 * Flux :
 * 1. Reçoit une liste d'opportunités presse
 * 2. Filtre celles pertinentes pour deviens-marrant.fr
 * 3. Génère une réponse d'expert au nom d'Alex
 * 4. Envoie le draft à alex@deviens-marrant.fr pour validation 1-clic
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const opportunities: HaroOpportunity[] = body.opportunities || [];

    if (opportunities.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Aucune opportunité à traiter",
        processed: 0,
        sent: 0,
        skipped: 0,
      });
    }

    const result = await processHaroOpportunities(opportunities);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("[CRON HARO] Erreur:", error);
    return NextResponse.json(
      {
        error: "Erreur interne",
        details: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 },
    );
  }
}

/**
 * GET endpoint — traite des opportunités manuelles ou de test.
 * Utile pour tester le pipeline sans webhook externe.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Retourne le statut du pipeline HARO
  return NextResponse.json({
    success: true,
    status: "ready",
    email: "alex@deviens-marrant.fr",
    pipeline: "HARO → Filter → Generate → Email draft to Alex",
    usage: "POST avec { opportunities: [...] } pour traiter des opportunités",
  });
}
