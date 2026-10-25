/**
 * POST /api/webhooks/resend-events (s22) : rebonds et plaintes signalés par Resend.
 *
 * Point de terminaison DISTINCT de `resend-inbound` : Resend donne à chaque point de
 * terminaison son propre secret de signature (`whsec_…`), d'où `RESEND_EVENTS_WEBHOOK_SECRET`.
 * Événements à cocher dans Resend : `email.bounced`, `email.complained` (tout autre type
 * reçu est accepté puis ignoré, 200).
 *
 * Sécurité : signature Svix vérifiée sur le corps BRUT (`lib/delivrabilite/svix.ts`),
 * horodatage à ± 5 min ; pas de session (exemptée du proxy d'authentification, qui ne
 * filtre que /profil, /favoris, /onboarding, /abonnement). Corps limité à 64 Ko.
 *
 * Codes : 200 traité, ignoré ou déjà traité ; 400 JSON invalide ; 401 signature absente,
 * invalide ou expirée ; 413 corps trop gros ; 503 secret non configuré ; 500 base
 * indisponible (Resend réessaie, le rejeu est idempotent).
 */
import { NextResponse } from "next/server";
import { verifierSignatureSvix } from "@/lib/delivrabilite/svix";
import { evenementResend, traiterEvenementResend } from "@/lib/delivrabilite/rebonds";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORPS_MAX = 64 * 1024;

const json = (corps: Record<string, unknown>, status: number) =>
  NextResponse.json(corps, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const corps = await request.text().catch(() => null);
  if (corps === null) return json({ error: "invalid_body" }, 400);
  if (corps.length > CORPS_MAX) return json({ error: "too_large" }, 413);

  const id = request.headers.get("svix-id");
  const signature = verifierSignatureSvix({
    corps,
    id,
    timestamp: request.headers.get("svix-timestamp"),
    signature: request.headers.get("svix-signature"),
    secret: process.env.RESEND_EVENTS_WEBHOOK_SECRET,
  });
  if (signature === "secret-absent") {
    console.error("[resend-events] RESEND_EVENTS_WEBHOOK_SECRET absent ou invalide : événement refusé.");
    return json({ error: "not_configured" }, 503);
  }
  if (signature !== "ok" || !id) {
    console.warn(`[resend-events] Signature refusée (${signature}).`);
    return json({ error: "unauthorized" }, 401);
  }

  let brut: unknown;
  try {
    brut = JSON.parse(corps);
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  const evt = evenementResend.safeParse(brut);
  if (!evt.success) return json({ error: "invalid_event" }, 400);

  try {
    const res = await traiterEvenementResend(evt.data, id);
    return json({ ok: true, action: res.action, adresses: res.adresses.length }, 200);
  } catch (err) {
    // Jamais `err.message` : une erreur de validation Prisma recopie la requête, donc l'adresse.
    const code = (err as { code?: string } | null)?.code ?? (err instanceof Error ? err.name : "inconnue");
    console.error(`[resend-events] Traitement impossible (erreur ${code}) : Resend va réessayer.`);
    return json({ error: "server_error" }, 500);
  }
}
