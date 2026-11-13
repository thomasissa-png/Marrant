/**
 * Petits outils communs aux routes `api/espace/**` du lot D5 : réponse JSON jamais mise en cache,
 * limite de débit par abonné (compteur partagé `sharedRateLimit`, 429 + `Retry-After`), lecture du corps.
 * Ces routes ne sont appelées qu'après la garde (404 interrupteur fermé, avant toute lecture).
 */
import { NextResponse } from "next/server";
import { retryAfterSeconds, sharedRateLimit } from "@/lib/rate-limit";

export const jsonEspace = (corps: Record<string, unknown>, status = 200, entetes: Record<string, string> = {}) =>
  NextResponse.json(corps, { status, headers: { "Cache-Control": "private, no-store", ...entetes } });

/** Écritures de l'espace : 60 par minute et par abonné (une rafale en fait au plus 6). */
export const LIMITE_ECRITURES = { maxRequests: 60, windowMs: 60_000 };

/** null si la requête passe, sinon la réponse 429. */
export async function limiterEcritures(scope: string, userId: string, maintenant: number = Date.now()): Promise<NextResponse | null> {
  const rl = await sharedRateLimit(`espace-${scope}`, userId, LIMITE_ECRITURES, maintenant);
  return rl.allowed ? null : jsonEspace({ error: "trop" }, 429, { "Retry-After": String(retryAfterSeconds(rl, maintenant)) });
}

/** Corps JSON de la requête, ou null s'il est illisible. */
export async function lireCorps(request: Request): Promise<unknown> {
  return request.json().catch(() => null);
}

/** Clé d'idempotence fournie par le navigateur (une par geste). */
export const FORMAT_CLE = /^[A-Za-z0-9_-]{8,64}$/;
