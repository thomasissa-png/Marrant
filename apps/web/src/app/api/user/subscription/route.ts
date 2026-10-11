import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSubscriptionSummary } from "@/lib/account";
import { TEXTES_API } from "@/config/textes/compte";

/**
 * GET /api/user/subscription : formule, prix, échéance, résiliation programmée
 * (s16, reco 11). `subscription: null` = jamais abonné.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: TEXTES_API.nonConnecte }, { status: 401 });
  }
  try {
    const subscription = await getSubscriptionSummary(userId);
    return NextResponse.json({ subscription }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("[API /user/subscription]", error);
    return NextResponse.json({ error: TEXTES_API.erreurServeur }, { status: 500 });
  }
}
