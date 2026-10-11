/**
 * Alertes internes à traiter par la session (s15, 06/10/2026).
 *
 * - Auth : `Authorization: Bearer {ADMIN_PASSWORD}` (comme les autres /api/admin/*).
 * - `GET /api/admin/alertes` : alertes des 7 derniers jours (`?jours=1..30`),
 *   filtrables par `?classe=A|B`, de la plus récente à la plus ancienne. Chaque
 *   lecture est datée : c'est elle qui retient le filet 48 h du digest (sans
 *   lecture depuis 48 h, les alertes B en attente partent dans l'e-mail du matin).
 *   `?apercu=1` lit sans dater la lecture (contrôle manuel).
 * Toujours dynamique (données du moment, aucune mise en cache).
 */
import { NextRequest, NextResponse } from "next/server";
import { getDerniereLecture, listAdminAlerts, setDerniereLecture } from "@/lib/admin-alerts";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: "ADMIN_PASSWORD non configuré" }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const joursParam = Number(params.get("jours") ?? "7");
  const jours = Number.isFinite(joursParam) ? Math.min(30, Math.max(1, Math.floor(joursParam))) : 7;
  const classe = params.get("classe");
  const apercu = params.get("apercu") === "1" || params.get("apercu") === "true";
  const now = new Date();
  const depuis = new Date(now.getTime() - jours * 86_400_000);

  try {
    const [toutes, derniereLecture] = await Promise.all([listAdminAlerts(), getDerniereLecture()]);
    const alertes = toutes
      .filter((a) => new Date(a.derniereFois) >= depuis)
      .filter((a) => (classe === "A" || classe === "B" ? a.classe === classe : true))
      .map((a) => ({
        date: a.derniereFois,
        premiereFois: a.premiereFois,
        jour: a.jour,
        classe: a.classe,
        type: a.type,
        reseau: a.reseau,
        cle: a.cle,
        sujet: a.sujet,
        detail: a.detail,
        occurrences: a.occurrences,
        envoyeeParEmailLe: a.envoyeeLe,
        nouvelle: !derniereLecture || new Date(a.derniereFois) > derniereLecture,
      }));
    if (!apercu) await setDerniereLecture(now);
    return NextResponse.json({
      success: true,
      lecturePrecedente: derniereLecture?.toISOString() ?? null,
      jours,
      total: alertes.length,
      nouvelles: alertes.filter((a) => a.nouvelle).length,
      alertes,
    });
  } catch (err) {
    console.error(`[admin:alertes] Échec : ${err instanceof Error ? err.message : "erreur inconnue"}`);
    return NextResponse.json({ success: false, error: "Alertes illisibles (base indisponible)" }, { status: 500 });
  }
}
