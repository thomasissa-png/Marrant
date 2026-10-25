/**
 * POST /api/question-equipe (s22, « Ta question à l'équipe », V1) : envoie la question d'un
 * abonné Premium par e-mail à contact@deviens-marrant.fr. Rien en base.
 *
 * Corps : { question: string, tentative?: string } (1 000 caractères au plus). Tout autre
 * champ est ignoré. Même texte + même `tentative` (renvoi après un délai dépassé) = même
 * clé d'idempotence Resend : un seul e-mail (`lib/question-equipe.ts`).
 * Réponses : 200 { envoye: true } ; 400 { error: "invalide" | "vide" | "trop-long" } ;
 * 401 { error: "session" } ; 403 { error: "non-premium" } (ou origine refusée) ;
 * 404 interrupteur `QUESTION_EQUIPE_OUVERTE` fermé ; 429 { error: "trop" } + Retry-After ;
 * 503 { error: "envoi" } (Resend en échec ou délai de 5 s dépassé).
 *
 * Premium vérifié côté serveur, sur le plan EN BASE (`isPremiumPlan`, même règle que le
 * reste de Premium : le webhook Stripe garde PREMIUM pour ACTIVE et PAST_DUE). `Reply-To` =
 * adresse du compte en base, jamais une valeur du corps. Le texte de la question n'apparaît
 * dans aucun journal (aucun console.* ne le reçoit), ni dans Umami, ni en base.
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { refuserSiAutreSite } from "@/lib/same-site";
import { retryAfterSeconds, sharedRateLimit } from "@/lib/rate-limit";
import { isPremiumPlan } from "@/lib/parcours-access";
import { sendServiceTextEmail } from "@/lib/email";
import { QUESTION_EQUIPE_LIMITES, QUESTION_EQUIPE_OUVERTE } from "@/config/question-equipe";
import { adresseReponse, envoyerQuestionEquipe, questionBody, validerQuestion } from "@/lib/question-equipe";

export const dynamic = "force-dynamic";

const ROUTE = "POST /api/question-equipe";
const json = (corps: Record<string, unknown>, status: number, headers?: Record<string, string>) =>
  NextResponse.json(corps, { status, headers: { "Cache-Control": "no-store", ...headers } });

export async function POST(request: Request) {
  if (!QUESTION_EQUIPE_OUVERTE) return json({ error: "Introuvable" }, 404);
  const refus = refuserSiAutreSite(request, ROUTE);
  if (refus) return refus;

  let userId: string | null = null;
  try {
    const session = await getServerSession(authOptions);
    userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  } catch {
    userId = null;
  }
  if (!userId) return json({ error: "session" }, 401);

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, plan: true } });
    if (!user) return json({ error: "session" }, 401);
    if (!isPremiumPlan(user.plan)) return json({ error: "non-premium" }, 403);

    const corps = questionBody.safeParse(await request.json().catch(() => null));
    if (!corps.success) return json({ error: "invalide" }, 400);
    const validation = validerQuestion(corps.data.question);
    if (!validation.ok) return json({ error: validation.erreur }, 400);

    // Garde-fou anti-abus (jamais affiché) : par compte, fenêtre courte puis journée.
    const now = Date.now();
    for (const [nom, limite] of Object.entries(QUESTION_EQUIPE_LIMITES)) {
      const rl = await sharedRateLimit(`question-equipe-${nom}`, userId, limite, now);
      if (!rl.allowed) return json({ error: "trop" }, 429, { "Retry-After": String(retryAfterSeconds(rl, now)) });
    }

    const replyTo = adresseReponse(user.email);
    if (!replyTo) {
      console.error(`[API question-equipe] Adresse du compte inutilisable en Reply-To : rien n'est envoyé.`);
      return json({ error: "envoi" }, 503);
    }
    try {
      await envoyerQuestionEquipe({
        question: validation.question,
        replyTo,
        compte: userId,
        tentative: corps.data.tentative,
        now,
        envoyer: (to, subject, text, options) => sendServiceTextEmail(to, subject, text, "question-equipe", options),
      });
    } catch {
      // Jamais le détail ici (il pourrait reprendre le contenu) : l'alerte `email-envoi-question-equipe`
      // est enregistrée par `lib/email.ts` (domaine et objet fixe seulement).
      console.error(`[API question-equipe] Envoi à l'équipe impossible (voir l'alerte email-envoi-question-equipe).`);
      return json({ error: "envoi" }, 503);
    }
    return json({ envoye: true }, 200);
  } catch {
    console.error(`[API question-equipe] Erreur serveur (base ou limiteur indisponible).`);
    return json({ error: "envoi" }, 503);
  }
}
