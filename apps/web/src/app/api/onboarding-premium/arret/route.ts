import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TEXTES_ARRET_ONBOARDING as T } from "@/config/textes/onboarding-premium";
import { arreterOnboarding, verifierJetonOnboarding, type JournalDb } from "@/lib/onboarding/journal-onboarding";

export const dynamic = "force-dynamic";

/**
 * Arrêt des e-mails d'accueil Premium (E1, E2) en un clic, sans connexion (s23, @legal C3, C4).
 * Jeton signé propre à l'onboarding : ne coupe QUE ces e-mails (jamais `emailOptOut`), immédiat,
 * idempotent, trace conservée dans le journal (C5). Actif MÊME interrupteur fermé : une fermeture
 * d'urgence après des envois ne doit jamais couper une opposition (jeton signé exigé, aucun envoi).
 *  - GET  : clic depuis l'e-mail → page de confirmation tutoyée ;
 *  - POST : désabonnement en un clic des messageries (RFC 8058).
 */
async function arreter(request: NextRequest): Promise<"ok" | "invalide" | "erreur"> {
  const userId = verifierJetonOnboarding(request.nextUrl.searchParams.get("token"));
  if (!userId) return "invalide";
  try {
    await arreterOnboarding(prisma as unknown as JournalDb, userId, new Date());
    return "ok";
  } catch (err) {
    console.error("[onboarding-premium/arret] Erreur :", err instanceof Error ? err.message : err);
    return "erreur";
  }
}

function page(status: number, titre: string, texte: string): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${titre} · Deviens Marrant</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:480px;margin:64px auto;padding:24px;color:#1a1a1a;text-align:center;">
  <h1 style="color:#7c3aed;">${titre}</h1>
  <p style="font-size:16px;line-height:1.6;">${texte}</p>
  <p style="margin-top:32px;"><a href="https://deviens-marrant.fr" style="color:#7c3aed;">${T.retour}</a></p>
  <p style="margin-top:24px;">L’Équipe Deviens Marrant</p>
</body>
</html>`;
  return new NextResponse(html, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

export async function GET(request: NextRequest) {
  const r = await arreter(request);
  if (r === "ok") return page(200, T.okTitre, T.ok);
  if (r === "invalide") return page(400, T.invalideTitre, T.invalide);
  return page(500, T.erreurTitre, T.erreur);
}

export async function POST(request: NextRequest) {
  const r = await arreter(request);
  const status = r === "ok" ? 200 : r === "invalide" ? 400 : 500;
  return NextResponse.json({ ok: r === "ok" }, { status });
}
