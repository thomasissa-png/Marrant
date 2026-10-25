/**
 * Approbation d'un numéro de la lettre de la semaine par Thomas (s22, décision du 25/10).
 * Auth `Authorization: Bearer {ADMIN_PASSWORD}` (console admin, accès de Thomas seul).
 *
 * - POST { semaine, empreinte } : approuve le numéro pour le contenu exact affiché (empreinte
 *   de GET /api/admin/lettre-premium/numeros). 200 ; 400 corps invalide ; 404 inconnu ;
 *   409 brouillon, déjà envoyé, ou contenu modifié depuis l'affichage (recharger, relire).
 * - DELETE { semaine } : retire l'approbation (le numéro ne part plus). 200, 400, 404, 409.
 * Rien n'est envoyé ici : la tâche du jeudi reste seule à envoyer, interrupteur compris.
 */
import { NextRequest, NextResponse } from "next/server";
import { refusAdmin } from "@/lib/admin/auth";
import { approbationBody, retraitBody } from "@/lib/admin/lettre-hebdo-numeros";
import { approuverNumeroHebdo, retirerApprobationHebdo } from "@/lib/lettre/approbation-hebdo";

export const dynamic = "force-dynamic";

const ERREURS = {
  introuvable: { status: 404, error: "Numéro introuvable" },
  "non-valide": { status: 409, error: "Numéro encore en brouillon : il doit d'abord être VALIDE (relecture à l'aveugle)" },
  "deja-envoye": { status: 409, error: "Numéro déjà envoyé" },
  "contenu-modifie": { status: 409, error: "Le numéro a changé depuis son affichage : recharge et relis-le avant d'approuver" },
} as const;

async function lireCorps(request: NextRequest): Promise<unknown> {
  return request.json().catch(() => null);
}

export async function POST(request: NextRequest) {
  const refus = refusAdmin(request);
  if (refus) return refus;
  const corps = approbationBody.safeParse(await lireCorps(request));
  if (!corps.success) return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  try {
    const r = await approuverNumeroHebdo({ ...corps.data, now: new Date() });
    if (r === "approuve") return NextResponse.json({ approuve: true, semaine: corps.data.semaine });
    const e = ERREURS[r];
    return NextResponse.json({ error: e.error }, { status: e.status });
  } catch (err) {
    console.error(`[admin:lettre-premium/approbation] Échec : ${err instanceof Error ? err.message : "erreur inconnue"}`);
    return NextResponse.json({ error: "Approbation non enregistrée" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const refus = refusAdmin(request);
  if (refus) return refus;
  const corps = retraitBody.safeParse(await lireCorps(request));
  if (!corps.success) return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  try {
    const r = await retirerApprobationHebdo(corps.data.semaine);
    if (r === "retire") return NextResponse.json({ retire: true, semaine: corps.data.semaine });
    const e = ERREURS[r];
    return NextResponse.json({ error: e.error }, { status: e.status });
  } catch (err) {
    console.error(`[admin:lettre-premium/approbation] Échec du retrait : ${err instanceof Error ? err.message : "erreur inconnue"}`);
    return NextResponse.json({ error: "Retrait non enregistré" }, { status: 500 });
  }
}
