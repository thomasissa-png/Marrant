import { NextResponse } from "next/server";
import { z } from "zod";
import { garderApiLectureSeule, methodeNonPermise } from "@/lib/espace/garde";
import { enregistrerReplique, ficheAcceptantReplique, journaliserSansTexte, supprimerReplique, texteReplique } from "@/lib/espace/repliques";
import { idFiche } from "@/lib/espace/fiches-schema";
import { jsonEspace, lireCorps, limiterEcritures } from "@/lib/espace/api";
import { noterEvenementEspace } from "@/lib/mesure/evenements-espace";

/**
 * /api/espace/replique (s24, lot D5) : « Ma réplique à moi », une phrase par fiche à geste.
 * PUT `{ ficheId, texte }` : ajout ou modification, abonné actif seulement (403 après la résiliation :
 *   lecture seule) ; texte vide ou trop long : 400 ; fiche sans geste ou non servie : 404.
 * DELETE `{ ficheId }` : suppression, acceptée aussi après la résiliation.
 * Le texte n'est jamais journalisé (erreurs : nom seul), ni écrit ailleurs (`UsageEvent`, Umami).
 * Lot D9 : `replique_ecrite` SANS texte ni détail (une fois par fiche : le nombre de notes seulement).
 * Fermé : 404 avant toute lecture ; 401 sans session ; 403 compte jamais abonné ; 503.
 */
export const dynamic = "force-dynamic";

const ecriture = z.object({ ficheId: idFiche, texte: texteReplique }).strict();
const suppression = z.object({ ficheId: idFiche }).strict();

export async function PUT(request: Request) {
  const garde = await garderApiLectureSeule();
  if (garde instanceof NextResponse) return garde;
  if (!garde.actif) return jsonEspace({ error: "lecture-seule" }, 403);
  const lu = ecriture.safeParse(await lireCorps(request));
  if (!lu.success) return jsonEspace({ error: "valeur" }, 400);
  if (!ficheAcceptantReplique(lu.data.ficheId, { acces: "ouvert", userId: garde.userId })) return jsonEspace({ error: "introuvable" }, 404);
  try {
    const trop = await limiterEcritures("replique", garde.userId);
    if (trop) return trop;
    await enregistrerReplique(garde.userId, lu.data.ficheId, lu.data.texte);
    await noterEvenementEspace({ type: "replique_ecrite", ficheId: lu.data.ficheId }, garde.userId);
    return jsonEspace({ ok: true });
  } catch (error) {
    journaliserSansTexte("replique", error);
    return jsonEspace({ error: "indisponible" }, 503);
  }
}

export async function DELETE(request: Request) {
  const garde = await garderApiLectureSeule();
  if (garde instanceof NextResponse) return garde;
  const lu = suppression.safeParse(await lireCorps(request));
  if (!lu.success) return jsonEspace({ error: "valeur" }, 400);
  try {
    const trop = await limiterEcritures("replique", garde.userId);
    if (trop) return trop;
    await supprimerReplique(garde.userId, lu.data.ficheId);
    return jsonEspace({ ok: true });
  } catch (error) {
    journaliserSansTexte("replique", error);
    return jsonEspace({ error: "indisponible" }, 503);
  }
}

export async function GET() {
  return methodeNonPermise();
}

export async function POST() {
  return methodeNonPermise();
}
