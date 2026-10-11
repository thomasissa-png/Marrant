import { NextResponse } from "next/server";

/**
 * Fonction membres « vanne, conseil, analyse de répartie » : COUPÉE (décision
 * Thomas du 03/10/2026, « aucune IA ne produit seule », audit
 * docs/strategy/audit-offre-premium-s14.md section 4).
 *
 * La route répond 410 (Gone) à toute méthode, sans session, sans lecture en
 * base et sans appel LLM. Aucune interface ne l'appelait. Une éventuelle
 * réouverture (analyse de répartie seule, plafond mensuel, éval) passera par
 * une nouvelle route validée par Thomas, pas par la réactivation de celle-ci.
 */
const GONE_MESSAGE =
  "Cette fonctionnalité n'est plus disponible. Retrouve les vannes, les conseils et les parcours sur le site.";

function gone() {
  return NextResponse.json(
    { error: GONE_MESSAGE },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST() {
  return gone();
}

export async function GET() {
  return gone();
}
