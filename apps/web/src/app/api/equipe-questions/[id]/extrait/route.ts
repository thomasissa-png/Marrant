import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { refuserSiAutreSite } from "@/lib/same-site";
import { deciderExtrait } from "@/lib/equipe-questions/abonne";
import { erreurServeur, nonConnecte, reponseRefus, siFerme, userIdSession } from "@/lib/equipe-questions/http";

export const dynamic = "force-dynamic";

/**
 * Accord par extrait (@legal Q4, B8) : POST { decision: "publier" | "refuser", texte }
 * où `texte` est l'extrait exact affiché. Accord valable pour ce texte seulement
 * (409 si l'équipe l'a modifié entre-temps). Sans clic, rien n'est publié.
 */
const schema = z.object({ decision: z.enum(["publier", "refuser"]), texte: z.string().min(1).max(5000) });

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const ferme = siFerme();
  if (ferme) return ferme;
  const autreSite = refuserSiAutreSite(request, "equipe-questions/[id]/extrait");
  if (autreSite) return autreSite;
  const userId = await userIdSession();
  if (!userId) return nonConnecte();
  const parse = schema.safeParse(await request.json().catch(() => null));
  if (!parse.success) return NextResponse.json({ error: "Requête invalide", code: "corps" }, { status: 400 });
  try {
    const r = await deciderExtrait(userId, params.id, parse.data.decision, parse.data.texte);
    return r.ok ? NextResponse.json({ extraitStatut: r.extraitStatut }) : reponseRefus(r.code);
  } catch (err) {
    return erreurServeur("extrait", err);
  }
}
