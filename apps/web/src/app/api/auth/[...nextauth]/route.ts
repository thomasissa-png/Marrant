import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { effacerTemoinCoin } from "@/lib/espace/humour-noir";

const handler = NextAuth(authOptions);

type Contexte = { params: { nextauth: string[] } };

/**
 * Déconnexion (`POST /api/auth/signout`) : en plus des cookies de session retirés par NextAuth, le témoin
 * du coin « Humour noir » de l'espace client est retiré (lot D5b, poste partagé ; @legal
 * `docs/legal/espace-d6-cookie-coin-s24.md`). Interrupteur fermé : réponse de NextAuth inchangée.
 */
async function POST(req: NextRequest, ctx: Contexte) {
  const res: Response = await handler(req, ctx);
  if (ctx.params.nextauth?.[0] === "signout") effacerTemoinCoin(res.headers);
  return res;
}

export { handler as GET, POST };
