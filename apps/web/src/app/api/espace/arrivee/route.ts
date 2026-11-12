import { NextResponse } from "next/server";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { lireAccesEspace, methodeNonPermise, reponseEspaceFerme } from "@/lib/espace/garde";
import { arriveeApresConnexion, type CompteArrivee } from "@/lib/espace/arrivee";
import { buildLoginUrl, withAuthReturnMarker } from "@/lib/auth-links";

/**
 * GET /api/espace/arrivee?origine=…&marqueur=… (s24, lot D3) : arrivée après une connexion,
 * interrupteur OUVERT (décision du 12/11, architecture 4.2). Le plan est relu EN BASE :
 * abonné actif = page d'origine sûre, sinon « Aujourd'hui » ; ancien abonné = `/abonnement` ;
 * autre compte = arrivée d'aujourd'hui (page d'origine, sinon `/vannes`). Redirection 303.
 * Fermé : 404 avant toute lecture (la page de connexion ne l'appelle jamais).
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!ESPACE_CLIENT_PUBLIE) return reponseEspaceFerme();
  const params = new URL(request.url).searchParams;
  const origine = params.get("origine");
  const marqueur = params.get("marqueur");
  let destination: string;
  try {
    const acces = await lireAccesEspace();
    if (acces.acces === "connexion") {
      destination = buildLoginUrl({ callbackUrl: origine });
    } else {
      const compte: CompteArrivee =
        acces.acces === "ouvert" ? "abonne" : acces.ancienAbonne ? "ancien-abonne" : "gratuit";
      destination = arriveeApresConnexion(origine, compte, true);
    }
  } catch (error) {
    // Base indisponible : arrivée d'aujourd'hui (jamais l'espace sans plan relu).
    console.error("[espace/arrivee] lecture du compte impossible :", error);
    destination = arriveeApresConnexion(origine, "gratuit", true);
  }
  if (marqueur && /^[a-z0-9-]{1,40}$/.test(marqueur)) destination = withAuthReturnMarker(destination, marqueur);
  return NextResponse.redirect(new URL(destination, request.url), { status: 303, headers: { "Cache-Control": "private, no-store" } });
}

/** Interrupteur fermé : 404 comme une adresse inexistante ; ouvert : 405. */
export async function POST() {
  return methodeNonPermise();
}
