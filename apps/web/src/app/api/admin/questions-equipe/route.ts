/**
 * /api/admin/questions-equipe (s24, lot D7 ; architecture v20 2.6) : outil de l'équipe pour « Mes questions ».
 * Auth : celle des autres outils d'admin (`refusAdmin`, `Authorization: Bearer {ADMIN_PASSWORD}`, 401 sinon).
 * Interrupteur de l'espace fermé : 404 avant toute lecture (adresse inexistante), comme `api/espace/**`.
 * - GET : fils en attente (le plus ancien d'abord, « en retard » après 3 jours ouvrés), puis les derniers
 *   répondus ; compteurs et alerte interne (plus de 10 en attente [HYPOTHÈSE plan D7], ou un retard).
 * - POST `{ filId, reponse }` : réponse ENREGISTRÉE dans le fil, PUIS e-mail de réponse à l'adresse du
 *   compte lue en base (brouillon tant que le texte de l'e-mail n'est pas validé : rien ne part).
 *   POST `{ recopie: { email, type, question, reponse } }` : échange fait hors de l'outil, recopié, sans e-mail.
 * - PATCH `{ filId, sceneOu, sceneBut }` : étiquette de scène, deux valeurs au plus, listes fermées de 3.3
 *   ou « autre ». Aucune analyse du texte. Jamais de texte dans les journaux.
 * N'importe ni ne lit « Ma réplique à moi » (architecture 2.7 : jamais lue par l'équipe).
 */
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { refusAdmin } from "@/lib/admin/auth";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { journaliserQuestions, REPONSE_EQUIPE_MAX, SCENES_BUT, SCENES_OU, TYPES_QUESTION } from "@/lib/espace/questions";
import { etiqueter, listerPourEquipe, recopier, repondre } from "@/lib/espace/questions-equipe";
import { envoyerParResend } from "@/lib/espace/questions-route";
import { validerQuestion } from "@/lib/question-equipe";

export const dynamic = "force-dynamic";

const json = (corps: Record<string, unknown>, status = 200) => NextResponse.json(corps, { status, headers: { "Cache-Control": "no-store" } });

const idFil = z.string().regex(/^[A-Za-z0-9_-]{8,64}$/);
const texteEquipe = z.string().trim().min(1).max(REPONSE_EQUIPE_MAX);
const reponse = z.object({ filId: idFil, reponse: texteEquipe }).strict();
const recopie = z
  .object({
    recopie: z
      .object({
        email: z.string().trim().toLowerCase().email(),
        type: z.enum(TYPES_QUESTION),
        question: z.string().refine((q) => validerQuestion(q).ok),
        reponse: texteEquipe,
      })
      .strict(),
  })
  .strict();
const etiquette = z.object({ filId: idFil, sceneOu: z.enum(SCENES_OU).nullable(), sceneBut: z.enum(SCENES_BUT).nullable() }).strict();

function garde(request: NextRequest): NextResponse | null {
  if (!ESPACE_CLIENT_PUBLIE) return json({ error: "Introuvable" }, 404);
  return refusAdmin(request);
}

export async function GET(request: NextRequest) {
  const refus = garde(request);
  if (refus) return refus;
  try {
    return json(await listerPourEquipe());
  } catch (error) {
    journaliserQuestions("admin-liste", error);
    return json({ error: "Lecture impossible" }, 503);
  }
}

export async function POST(request: NextRequest) {
  const refus = garde(request);
  if (refus) return refus;
  const corps = await request.json().catch(() => null);
  try {
    const r = reponse.safeParse(corps);
    if (r.success) {
      const fait = await repondre(r.data.filId, r.data.reponse, envoyerParResend);
      return fait ? json({ enregistre: true, email: fait.email }) : json({ error: "introuvable" }, 404);
    }
    const c = recopie.safeParse(corps);
    if (!c.success) return json({ error: "valeur" }, 400);
    const q = validerQuestion(c.data.recopie.question);
    const fil = await recopier({ ...c.data.recopie, question: q.ok ? q.question : "", cle: `recopie-${Date.now().toString(36)}` });
    return fil ? json({ enregistre: true, filId: fil.id, email: "aucun" }) : json({ error: "compte-inconnu" }, 404);
  } catch (error) {
    journaliserQuestions("admin-reponse", error);
    return json({ error: "Enregistrement impossible" }, 503);
  }
}

export async function PATCH(request: NextRequest) {
  const refus = garde(request);
  if (refus) return refus;
  const lu = etiquette.safeParse(await request.json().catch(() => null));
  if (!lu.success) return json({ error: "valeur" }, 400);
  try {
    return (await etiqueter(lu.data.filId, { sceneOu: lu.data.sceneOu, sceneBut: lu.data.sceneBut })) ? json({ ok: true }) : json({ error: "introuvable" }, 404);
  } catch (error) {
    journaliserQuestions("admin-etiquette", error);
    return json({ error: "Enregistrement impossible" }, 503);
  }
}
