import { NextResponse } from "next/server";
import { garderApiEspace, methodeNonPermise } from "@/lib/espace/garde";
import { lireRafale } from "@/lib/espace/cartes-serveur";
import { jsonEspace } from "@/lib/espace/api";

/**
 * GET /api/espace/cartes (s24, lot D5) : la rafale du jour de l'abonné (au plus 3 cartes, ids, titres,
 * « Nouvelle » ou « À revoir »), les cartes déjà jouées aujourd'hui, `fini`, et le repère de la semaine.
 * Interrupteur fermé : 404 avant toute lecture. 401 sans session, 403 sans abonnement actif, 503 base
 * indisponible. Lecture seule ; aucun texte de l'abonné.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const garde = await garderApiEspace();
  if (garde instanceof NextResponse) return garde;
  try {
    const etat = await lireRafale(garde.userId, { acces: "ouvert", userId: garde.userId });
    return jsonEspace({
      cartes: etat.cartes.map((c) => ({ id: c.carteId, titre: etat.catalogue.get(c.carteId)?.titre ?? "", nouvelle: c.nouvelle, autreContexte: c.autreContexte === true })),
      faites: etat.faites,
      fini: etat.fini,
      cetteSemaine: etat.cetteSemaine,
    });
  } catch (error) {
    console.error("[espace/cartes] lecture impossible :", (error as Error)?.name ?? "Erreur");
    return jsonEspace({ error: "indisponible" }, 503);
  }
}

export async function POST() {
  return methodeNonPermise();
}
