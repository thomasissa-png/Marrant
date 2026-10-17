import { NextRequest, NextResponse } from "next/server";
import { refuserSiAutreSite } from "@/lib/same-site";
import { retryAfterSeconds, sharedRateLimit } from "@/lib/rate-limit";
import { creerQuestion, listerQuestions } from "@/lib/equipe-questions/abonne";
import { schemaNouvelleQuestion } from "@/lib/equipe-questions/regles";
import { erreurServeur, nonConnecte, reponseRefus, siFerme, userIdSession } from "@/lib/equipe-questions/http";
import { TEXTES_EQUIPE_ETATS as E } from "@/config/textes/equipe-questions";

export const dynamic = "force-dynamic";

/**
 * « Ta question à l'équipe » (s21), abonné Premium.
 * GET  → { questions } (historique, sans brouillon ni champ interne)
 * POST { situation, retour?, reutilisation?, idempotencyKey } → 201 { question, email }
 *      (200 si même clé : double clic), 400 { error, champ }, 401, 403, 409 garde-fou, 429.
 * Interrupteur fermé : 404 sur tout.
 */
export async function GET() {
  const ferme = siFerme();
  if (ferme) return ferme;
  const userId = await userIdSession();
  if (!userId) return nonConnecte();
  try {
    const r = await listerQuestions(userId);
    return r.ok ? NextResponse.json({ questions: r.questions }) : reponseRefus(r.code);
  } catch (err) {
    return erreurServeur("liste", err);
  }
}

export async function POST(request: NextRequest) {
  const ferme = siFerme();
  if (ferme) return ferme;
  const autreSite = refuserSiAutreSite(request, "equipe-questions");
  if (autreSite) return autreSite;
  const userId = await userIdSession();
  if (!userId) return nonConnecte();

  const limite = await sharedRateLimit("equipe-question", userId, { maxRequests: 10, windowMs: 60_000 });
  if (!limite.allowed) {
    return NextResponse.json(
      { error: E.erreurServeur, code: "limite" },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds(limite)) } },
    );
  }

  let corps: unknown;
  try {
    corps = await request.json();
  } catch {
    return NextResponse.json({ error: E.situationCourte, code: "corps", champ: "situation" }, { status: 400 });
  }
  const parse = schemaNouvelleQuestion.safeParse(corps);
  if (!parse.success) {
    const issue = parse.error.issues[0];
    const champ = String(issue?.path[0] ?? "situation");
    const message = champ === "situation" || champ === "retour" ? issue.message : E.erreurServeur;
    return NextResponse.json({ error: message, code: "corps", champ }, { status: 400 });
  }

  try {
    const r = await creerQuestion(userId, parse.data);
    if (!r.ok) return reponseRefus(r.code);
    return NextResponse.json({ question: r.question, email: r.email }, { status: r.creee ? 201 : 200 });
  } catch (err) {
    return erreurServeur("création", err);
  }
}
