/**
 * POST /api/admin/lettre-premium/arret { userId } (s21, spec H7-4) : arrêt de la lettre
 * de la semaine par l'admin (« stop » reçu à contact@, avis @legal §3), `stopOrigin="admin"`.
 * Jamais d'activation par l'admin. 200 { resultat }, 400, 401, 404 (aucune ligne).
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { refusAdmin } from "@/lib/admin/auth";
import { arreterLettreHebdo } from "@/lib/lettre/hebdo";

export const dynamic = "force-dynamic";

const bodySchema = z.object({ userId: z.string().min(1).max(64) }).strict();

export async function POST(request: NextRequest) {
  const refus = refusAdmin(request);
  if (refus) return refus;
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  try {
    const resultat = await arreterLettreHebdo(parsed.data.userId, "admin", new Date());
    if (resultat === "inconnu") return NextResponse.json({ error: "Aucune lettre pour ce compte" }, { status: 404 });
    return NextResponse.json({ resultat });
  } catch (err) {
    console.error(`[admin:lettre-premium/arret] Échec : ${err instanceof Error ? err.message : "erreur inconnue"}`);
    return NextResponse.json({ error: "Arrêt impossible (base indisponible)" }, { status: 500 });
  }
}
