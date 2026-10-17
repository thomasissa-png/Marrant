import { NextRequest, NextResponse } from "next/server";
import { refuserSiAutreSite } from "@/lib/same-site";
import { lireQuestion, supprimerQuestion } from "@/lib/equipe-questions/abonne";
import { erreurServeur, nonConnecte, reponseRefus, siFerme, userIdSession } from "@/lib/equipe-questions/http";

export const dynamic = "force-dynamic";

/**
 * GET    → { question } (la sienne uniquement : 404 sinon, même si elle existe)
 * DELETE → 204 (effacement immédiat de la question et de la réponse)
 * Interrupteur fermé : 404.
 */
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const ferme = siFerme();
  if (ferme) return ferme;
  const userId = await userIdSession();
  if (!userId) return nonConnecte();
  try {
    const r = await lireQuestion(userId, params.id);
    return r.ok ? NextResponse.json({ question: r.question }) : reponseRefus(r.code);
  } catch (err) {
    return erreurServeur("lecture", err);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const ferme = siFerme();
  if (ferme) return ferme;
  const autreSite = refuserSiAutreSite(request, "equipe-questions/[id]");
  if (autreSite) return autreSite;
  const userId = await userIdSession();
  if (!userId) return nonConnecte();
  try {
    const r = await supprimerQuestion(userId, params.id);
    return r.ok ? new NextResponse(null, { status: 204 }) : reponseRefus(r.code);
  } catch (err) {
    return erreurServeur("suppression", err);
  }
}
