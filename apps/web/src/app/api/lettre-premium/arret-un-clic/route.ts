import { NextRequest, NextResponse } from "next/server";
import { LETTRE_HEBDO_ARRET_CHEMIN } from "@/config/lettre";
import { arreterLettreHebdoParJeton } from "@/lib/lettre/hebdo";
import { isPlausibleToken } from "@/lib/newsletter";
import { getClientIp, retryAfterSeconds, sharedRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Cible de l'en-tête `List-Unsubscribe` de la lettre de la semaine (RFC 8058,
 * `List-Unsubscribe-Post: List-Unsubscribe=One-Click`). Appelé par les serveurs de
 * messagerie : sans session, sans contrôle d'origine, immédiat, idempotent.
 * N'arrête QUE l'hebdo. Marche interrupteurs fermés.
 *  - POST `?token=…` : 200 (arrêtée ou déjà arrêtée), 404 jeton inconnu, 429.
 *  - GET (scanner de liens, ancien lien) : ne change rien, renvoie vers la page du bouton.
 */
const LIMITE = { maxRequests: 20, windowMs: 60_000 };

function jeton(request: NextRequest): string {
  return request.nextUrl.searchParams.get("token")?.trim() ?? "";
}

export async function GET(request: NextRequest) {
  const token = jeton(request);
  const chemin = isPlausibleToken(token) ? `${LETTRE_HEBDO_ARRET_CHEMIN}?token=${encodeURIComponent(token)}` : LETTRE_HEBDO_ARRET_CHEMIN;
  // NEXTAUTH_URL d'abord : derrière un proxy, request.url peut porter le port interne.
  return NextResponse.redirect(new URL(chemin, process.env.NEXTAUTH_URL || request.url), 303);
}

export async function POST(request: NextRequest) {
  const now = new Date();
  const rl = await sharedRateLimit("lettre-hebdo-arret", getClientIp(request.headers), LIMITE, now.getTime());
  if (!rl.allowed) return new NextResponse("Trop de demandes", { status: 429, headers: { "Retry-After": String(retryAfterSeconds(rl, now.getTime())) } });
  const token = jeton(request);
  if (!isPlausibleToken(token)) return new NextResponse("Lien invalide", { status: 404 });
  try {
    const res = await arreterLettreHebdoParJeton(token, now);
    if (res === "inconnu") return new NextResponse("Lien invalide", { status: 404 });
    return new NextResponse("Arrêt enregistré", { status: 200 });
  } catch (err) {
    console.error("[lettre-hebdo] Arrêt en un clic en échec :", err instanceof Error ? err.message : "erreur inconnue");
    return new NextResponse("Erreur", { status: 500 });
  }
}
