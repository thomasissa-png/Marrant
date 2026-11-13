import { NextResponse } from "next/server";
import { z } from "zod";
import { garderApiEspace, methodeNonPermise } from "@/lib/espace/garde";
import { enregistrerChoix, enregistrerReponse } from "@/lib/espace/cartes-serveur";
import { REPONSES_CARTE } from "@/lib/espace/revision";
import { FORMAT_CLE, jsonEspace, lireCorps, limiterEcritures } from "@/lib/espace/api";
import { journaliserSansTexte } from "@/lib/espace/repliques";

/**
 * POST /api/espace/carte/[id]/reponse (s24, lot D5). Deux gestes, la même clé d'idempotence :
 * - `{ cle, reponse: OUI|MOITIE|RIEN, compteARebours }` : « Tu avais une réponse ? » ; une seule ligne
 *   `CarteReponse` par clé (double clic = une ligne) ; carte de la rafale du jour seulement (409 sinon).
 *   Renvoie APRÈS la réponse seulement la note « ma réplique à moi » de la fiche et son retour : la note
 *   n'existe dans la page qu'après « Tu avais une réponse ? » (2.2), affichée en révision.
 * - `{ cle, choix: sure|joueuse|risquee }` : choix d'une carte « Quel registre ? », juste ou raté (fait
 *   revenir la carte à J+2, J+7, J+21).
 * Ni XP, ni cap, ni série (`recordPractice` jamais appelé). Fermé : 404 avant toute lecture.
 */
export const dynamic = "force-dynamic";

const cle = z.string().regex(FORMAT_CLE);
const corps = z.union([
  z.object({ cle, reponse: z.enum(REPONSES_CARTE), compteARebours: z.union([z.literal(10), z.literal(7), z.literal(5)]).nullable().default(null) }).strict(),
  z.object({ cle, choix: z.enum(["sure", "joueuse", "risquee"]) }).strict(),
]);
const ID_CARTE = /^[a-z0-9-]{1,90}(\.c[12])?$/;

export async function POST(request: Request, contexte: { params: { id: string } }) {
  const garde = await garderApiEspace();
  if (garde instanceof NextResponse) return garde;
  const params = contexte.params;
  if (!ID_CARTE.test(params.id)) return jsonEspace({ error: "introuvable" }, 404);
  const lu = corps.safeParse(await lireCorps(request));
  if (!lu.success) return jsonEspace({ error: "valeur" }, 400);
  const acces = { acces: "ouvert" as const, userId: garde.userId };
  try {
    const trop = await limiterEcritures("carte", garde.userId);
    if (trop) return trop;
    if ("choix" in lu.data) {
      const r = await enregistrerChoix(garde.userId, acces, params.id, lu.data);
      return r.ok ? jsonEspace({ ok: true, juste: r.juste }) : jsonEspace({ error: r.erreur }, 404);
    }
    const r = await enregistrerReponse(garde.userId, acces, params.id, lu.data);
    if (!r.ok) return jsonEspace({ error: r.erreur }, r.erreur === "introuvable" ? 404 : 409);
    return jsonEspace({ ok: true, revision: r.revision, replique: r.replique, retour: r.retour });
  } catch (error) {
    journaliserSansTexte("carte", error);
    return jsonEspace({ error: "indisponible" }, 503);
  }
}

export async function GET() {
  return methodeNonPermise();
}
