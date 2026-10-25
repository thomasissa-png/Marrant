/**
 * GET /api/admin/lettre-premium (s21, spec US-H7) : lettre de la semaine, Abonnés › Lettre.
 *
 * - Auth : `Authorization: Bearer {ADMIN_PASSWORD}` (comme les autres /api/admin/*).
 * - Réponse : `resume` (interrupteurs, actives, arrêtées par origine, Premium sans hebdo,
 *   dernier jeudi, prochain numéro, stock, alertes ; comptes de test à part) et `liste`
 *   paginée (`?statut=actives|arretees|premium-sans`, `?q=`, `?page=`, `?limit=` ≤ 100).
 * - Jamais de jeton d'arrêt. Lisible interrupteurs fermés.
 * - Sans la migration 15 : `disponible: false`, réponse 200 (les autres sections restent lisibles).
 */
import { NextRequest, NextResponse } from "next/server";
import { refusAdmin } from "@/lib/admin/auth";
import { listerComptesHebdo, listeHebdoQuery } from "@/lib/admin/lettre-hebdo-comptes";
import { chargerLettreHebdoResume, interrupteursCourants } from "@/lib/analytics/weekly-lettre-hebdo";
import { estTableAbsente } from "@/lib/analytics/weekly-lettre";
import { emailsExclus } from "@/lib/analytics/comptes-test";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const refus = refusAdmin(request);
  if (refus) return refus;
  const params = Object.fromEntries([...request.nextUrl.searchParams.entries()].filter(([, v]) => v !== ""));
  const query = listeHebdoQuery.safeParse(params);
  if (!query.success) return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  try {
    const now = new Date();
    const [resume, liste] = await Promise.all([
      chargerLettreHebdoResume(null, now, emailsExclus(), interrupteursCourants(), true),
      listerComptesHebdo(query.data),
    ]);
    return NextResponse.json({ disponible: true, resume, liste });
  } catch (err) {
    if (estTableAbsente(err)) {
      return NextResponse.json({ disponible: false, raison: "Colonnes de la lettre de la semaine absentes : migration 15 non jouée sur cette base." });
    }
    console.error(`[admin:lettre-premium] Échec : ${err instanceof Error ? err.message : "erreur inconnue"}`);
    return NextResponse.json({ error: "Lettre de la semaine illisible (base indisponible)" }, { status: 500 });
  }
}
