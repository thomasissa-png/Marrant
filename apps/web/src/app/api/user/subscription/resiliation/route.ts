/**
 * POST /api/user/subscription/resiliation (s23) : résiliation depuis notre écran /resiliation.
 * Corps : { reasons?: string[], comment?: string (500), cle: uuid }. Rien n'est jamais requis :
 * raisons inconnues ignorées, mot tronqué à 500 caractères, clé absente remplacée (jamais d'erreur
 * bloquante, spec §3). Logique et ordre (Stripe, puis motif, puis accusé) : `lib/resiliation.ts`.
 *
 * Réponses : 200 { etat: "resilie" | "deja_resilie", dateFin, formule } ;
 * 202 { etat: "transmis", dateFin, formule } (erreur Stripe ou Premium sans client Stripe : l'équipe
 * résilie à la main, accusé de demande envoyé) ; 409 { etat: "aucun" | "app_store" } ;
 * 401 sans session ; 403 origine refusée ; 404 interrupteur `RESILIATION_PAGE_OUVERTE` fermé ;
 * 429 + Retry-After ; 503 base indisponible.
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { refuserSiAutreSite, ORIGINES_APPLI_MOBILE } from "@/lib/same-site";
import { retryAfterSeconds, sharedRateLimit } from "@/lib/rate-limit";
import { nettoyerCommentaire, nettoyerRaisons, resilierAbonnement } from "@/lib/resiliation";
import { sendAdminHtmlEmail } from "@/lib/email";
import { emailEquipeResiliation } from "@/config/textes/resiliation-emails";
import { RESILIATION_LIMITE, RESILIATION_PAGE_OUVERTE } from "@/config/resiliation";

export const dynamic = "force-dynamic";

const ROUTE = "POST /api/user/subscription/resiliation";

const json = (corps: Record<string, unknown>, status: number, headers?: Record<string, string>) =>
  NextResponse.json(corps, { status, headers: { "Cache-Control": "no-store", ...headers } });

/** Schéma tolérant : toute valeur inattendue retombe sur « pas de réponse », jamais sur une erreur. */
const corpsSchema = z
  .object({
    reasons: z.array(z.unknown()).max(50).catch([]),
    comment: z.unknown().optional(),
    cle: z.string().uuid().optional().catch(undefined),
  })
  .catch({ reasons: [], comment: undefined, cle: undefined });

export async function POST(request: Request) {
  if (!RESILIATION_PAGE_OUVERTE) return json({ error: "Introuvable" }, 404);
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

  const corps = corpsSchema.parse(await request.json().catch(() => null));
  const now = new Date();

  try {
    const rl = await sharedRateLimit("resiliation", userId, RESILIATION_LIMITE, now.getTime());
    if (!rl.allowed) return json({ error: "trop" }, 429, { "Retry-After": String(retryAfterSeconds(rl, now.getTime())) });

    const reponse = await resilierAbonnement({
      userId,
      raisons: nettoyerRaisons(corps.reasons),
      commentaire: nettoyerCommentaire(corps.comment),
      cle: corps.cle ?? crypto.randomUUID(),
      depuisAppli: ORIGINES_APPLI_MOBILE.includes(request.headers.get("origin") ?? ""),
      now,
    });
    const status = reponse.etat === "transmis" ? 202 : reponse.etat === "aucun" || reponse.etat === "app_store" ? 409 : 200;
    return json(reponse, status);
  } catch (err) {
    console.error(`[API resiliation] Erreur serveur :`, err instanceof Error ? err.message : err);
    // Base ou limiteur indisponible avant toute action : la demande part quand même à l'équipe
    // (l'écran affiche « on résilie pour toi »), sans aucune donnée lue en base.
    const equipe = emailEquipeResiliation({ userId, demandeLe: now, cause: "stripe", code: "serveur-indisponible", stripeSubscriptionId: null });
    await sendAdminHtmlEmail(equipe.subject, equipe.html).catch(() => undefined);
    return json({ error: "serveur" }, 503);
  }
}
