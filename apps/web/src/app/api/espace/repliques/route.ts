import { NextResponse } from "next/server";
import { z } from "zod";
import { garderApiLectureSeule, methodeNonPermise } from "@/lib/espace/garde";
import { journaliserSansTexte, listerRepliques, repliquesPourCategorie } from "@/lib/espace/repliques";
import { CATEGORIES_TOUCHER } from "@/lib/espace/vanne";
import { jsonEspace } from "@/lib/espace/api";

/**
 * GET /api/espace/repliques (s24, lot D5) : les répliques de l'abonné, la plus récente d'abord (lisibles
 * aussi après la résiliation, en lecture seule) ; `?categorie=soiree|boulot|famille|rencard` : celles
 * dont la fiche correspond avec certitude à la catégorie du toucher (ligne « Tes répliques à toi pour
 * {catégorie} », abonné actif). Affichage seulement : rien n'est analysé, rien n'est journalisé.
 * Fermé : 404 avant toute lecture.
 */
export const dynamic = "force-dynamic";

const categorie = z.enum(CATEGORIES_TOUCHER);

export async function GET(request: Request) {
  const garde = await garderApiLectureSeule();
  if (garde instanceof NextResponse) return garde;
  const brut = new URL(request.url).searchParams.get("categorie");
  const acces = garde.actif
    ? { acces: "ouvert" as const, userId: garde.userId }
    : { acces: "abonnement" as const, userId: garde.userId, ancienAbonne: true };
  try {
    if (brut !== null) {
      const lu = categorie.safeParse(brut);
      if (!lu.success) return jsonEspace({ error: "valeur" }, 400);
      if (!garde.actif) return jsonEspace({ error: "lecture-seule" }, 403);
      return jsonEspace({ repliques: await repliquesPourCategorie(garde.userId, lu.data, acces), lectureSeule: false });
    }
    return jsonEspace({ repliques: await listerRepliques(garde.userId, acces), lectureSeule: !garde.actif });
  } catch (error) {
    journaliserSansTexte("repliques", error);
    return jsonEspace({ error: "indisponible" }, 503);
  }
}

export async function POST() {
  return methodeNonPermise();
}
