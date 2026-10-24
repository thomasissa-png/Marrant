/**
 * GET /api/admin/lettre (s21, 18/10) : inscrits à la lettre, partie « Abonnés » de l'admin.
 *
 * - Auth : `Authorization: Bearer {ADMIN_PASSWORD}` (comme les autres /api/admin/*).
 * - Réponse : `resume` (compteurs par statut et emplacement, comptes de test
 *   exclus ; prochain numéro ; envois par numéro) et `liste` paginée
 *   (`?page=`, `?limit=` ≤ 100, `?statut=PENDING|CONFIRMED|UNSUBSCRIBED`, `?q=`).
 * - Jamais l'empreinte IP, l'agent utilisateur ni les jetons.
 * - Sans la migration 14 : `resume.numeros` vaut null, la liste reste lisible.
 *   Sans la table des inscrits : `disponible: false`, réponse 200.
 */
import { NextRequest, NextResponse } from "next/server";
import { refusAdmin } from "@/lib/admin/auth";
import { listerInscritsLettre, listeLettreQuery } from "@/lib/admin/lettre-inscrits";
import { chargerLettreResume, estTableAbsente } from "@/lib/analytics/weekly-lettre";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const refus = refusAdmin(request);
  if (refus) return refus;
  const params = Object.fromEntries(
    [...request.nextUrl.searchParams.entries()].filter(([, v]) => v !== ""),
  );
  const query = listeLettreQuery.safeParse(params);
  if (!query.success) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }
  try {
    const [resume, liste] = await Promise.all([
      chargerLettreResume(null),
      listerInscritsLettre(query.data),
    ]);
    return NextResponse.json({ disponible: true, resume, liste });
  } catch (err) {
    if (estTableAbsente(err)) {
      return NextResponse.json({
        disponible: false,
        raison: "Table des inscrits absente : migrations de la lettre non jouées sur cette base.",
      });
    }
    console.error(`[admin:lettre] Échec : ${err instanceof Error ? err.message : "erreur inconnue"}`);
    return NextResponse.json({ error: "Inscrits illisibles (base indisponible)" }, { status: 500 });
  }
}
