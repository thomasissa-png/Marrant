import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { arreterLettreHebdoParJeton } from "@/lib/lettre/hebdo";
import { isPlausibleToken } from "@/lib/newsletter";
import { getClientIp, retryAfterSeconds, sharedRateLimit } from "@/lib/rate-limit";
import { refuserSiAutreSite } from "@/lib/same-site";

export const dynamic = "force-dynamic";

/**
 * Arrêt de la lettre de la semaine par le bouton de `/lettre/premium/arreter`
 * (s21, spec US-H3, avis @legal §3). Sans session : le jeton du lien suffit.
 * Toujours disponible, MÊME interrupteurs fermés (un e-mail déjà parti doit pouvoir
 * être arrêté). N'arrête QUE l'hebdo : ni l'abonnement, ni la mensuelle, ni `emailOptOut`.
 *
 * POST { token } → 200 { arretee: true, deja: boolean } ; 400 corps invalide ;
 * 404 jeton inconnu (texte générique, aucune fuite) ; 429 (20 par minute et par IP).
 */
const bodySchema = z.object({ token: z.string() }).strict();
const LIMITE = { maxRequests: 20, windowMs: 60_000 };

export async function POST(request: NextRequest) {
  const refus = refuserSiAutreSite(request, "POST /api/lettre-premium/arret");
  if (refus) return refus;
  const now = new Date();
  const rl = await sharedRateLimit("lettre-hebdo-arret", getClientIp(request.headers), LIMITE, now.getTime());
  if (!rl.allowed) {
    return NextResponse.json({ error: "trop" }, { status: 429, headers: { "Retry-After": String(retryAfterSeconds(rl, now.getTime())) } });
  }
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  const token = parsed.success ? parsed.data.token.trim() : "";
  if (!parsed.success || !isPlausibleToken(token)) return NextResponse.json({ error: "invalide" }, { status: 400 });
  try {
    const res = await arreterLettreHebdoParJeton(token, now);
    if (res === "inconnu") return NextResponse.json({ error: "inconnu" }, { status: 404 });
    return NextResponse.json({ arretee: true, deja: res === "deja-arretee" });
  } catch (err) {
    console.error("[lettre-hebdo] Arrêt en échec :", err instanceof Error ? err.message : "erreur inconnue");
    return NextResponse.json({ error: "serveur" }, { status: 500 });
  }
}
