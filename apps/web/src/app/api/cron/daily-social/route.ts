import { NextResponse } from "next/server";

// Incident s14 : aucun fetch sortant mis en cache par Next.
export const fetchCache = "force-no-store";

/**
 * CRON — Génération quotidienne des posts sociaux : ARRÊTÉE DÉFINITIVEMENT (s14).
 *
 * Décision Thomas du 01/10/2026 (audit `docs/social/audit-s14/audit-strategie-ton.md`) :
 * la génération IA quotidienne des posts est arrêtée pour de bon. Les posts X et
 * Instagram sont repris mot pour mot du catalogue validé et préparés une fois par
 * mois par `apps/web/scripts/content/prepare-social-month.ts` (dry-run, échantillon
 * de 10 relu par Thomas, puis `--write`). LinkedIn est en pause.
 *
 * Cette route reste en place (anciennes URLs de cron, scheduler) mais ne génère
 * rien : pas d'appel LLM, pas d'écriture en base, pas d'e-mail. Le pipeline
 * historique (social-media-agent + directeur + pré-génération d'image) reste
 * consultable dans l'historique git (avant le commit s14 « arrêt génération sociale »).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  const querySecret = searchParams.get("secret");

  if (!cronSecret || (authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    disabled: true,
    generated: 0,
    message:
      "Génération IA des posts sociaux arrêtée définitivement (décision du 01/10/2026). Préparation mensuelle : scripts/content/prepare-social-month.ts",
  });
}
