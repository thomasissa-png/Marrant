import { NextResponse } from "next/server";
import { z } from "zod";
import { garderApiEspace, methodeNonPermise } from "@/lib/espace/garde";
import { jsonEspace, limiterEcritures, lireCorps } from "@/lib/espace/api";
import { chargeursFiches } from "@/lib/espace/fiches";
import { COOKIE_COIN, DUREE_COIN_SECONDES, VALEUR_ENTREE, attributsTemoinCoin } from "@/lib/espace/humour-noir";
import { idsFaits, ligneDeFiche } from "@/lib/espace/lignes-fiches";
import { compterAnonyme } from "@/lib/espace/compteurs";

/**
 * POST /api/espace/humour-noir (s24, lot D6 ; architecture v20 3.12) : `{ entrer: true }` = geste
 * « Entrer » : pose le témoin du navigateur (cookie HttpOnly, aucune écriture en base, aucune donnée de
 * compte) et renvoie les lignes du coin ; `{ entrer: false }` = « Sortir » : retire le témoin, aucune ligne.
 * Fermé : 404 avant toute lecture. Non abonné : 403, rien n'est servi. Coin vide (lot non validé) : liste vide.
 * Lot D10 (architecture 7.7 point 6) : chaque « Entrer » ajoute 1 au compteur ANONYME `ouverture` /
 * `coin-humour-noir` (aucun compte, aucune vanne, ni le témoin).
 */
export const dynamic = "force-dynamic";

const corpsSchema = z.object({ entrer: z.boolean() }).strict();

export async function POST(request: Request) {
  const garde = await garderApiEspace();
  if (garde instanceof NextResponse) return garde;
  const trop = await limiterEcritures("humour-noir", garde.userId);
  if (trop) return trop;
  const lu = corpsSchema.safeParse(await lireCorps(request));
  if (!lu.success) return jsonEspace({ error: "valeur" }, 400);

  const temoin = attributsTemoinCoin();
  if (!lu.data.entrer) {
    const res = jsonEspace({ lignes: [] });
    res.cookies.set(COOKIE_COIN, "", { ...temoin, maxAge: 0 });
    return res;
  }
  try {
    const acces = { acces: "ouvert" as const, userId: garde.userId };
    const fiches = chargeursFiches.listerFiches("humour-noir", acces);
    const faits = await idsFaits(garde.userId, fiches.map((f) => f.id));
    const res = jsonEspace({ lignes: fiches.map((f) => ligneDeFiche(f, faits)) });
    res.cookies.set(COOKIE_COIN, VALEUR_ENTREE, { ...temoin, maxAge: DUREE_COIN_SECONDES });
    await compterAnonyme({ cle: "ouverture", valeur: "coin-humour-noir" });
    return res;
  } catch (error) {
    console.error("[espace] coin humour noir :", error instanceof Error ? error.name : "erreur");
    return jsonEspace({ error: "indisponible" }, 503);
  }
}

export async function GET() {
  return methodeNonPermise();
}
