/**
 * POST /api/admin/lettre-premium/proposition : ancienne proposition UNIQUE de la lettre de la
 * semaine aux abonnés existants (s21). s22 (25/10, décision de Thomas) : inscription d'office des
 * Premium, plus d'invitation ; texte et fonction supprimés. La route reste pour répondre 410 à un
 * appel tardif (admin resté ouvert), jamais d'envoi.
 */
import { NextRequest, NextResponse } from "next/server";
import { refusAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const refus = refusAdmin(request);
  if (refus) return refus;
  return NextResponse.json({ error: "Plus d'invitation : la lettre de la semaine est incluse d'office" }, { status: 410 });
}
