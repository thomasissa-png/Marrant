import { NextResponse } from "next/server";
import { garderApiLectureSeule, methodeNonPermise } from "@/lib/espace/garde";
import { FORMAT_CLE, jsonEspace, lireCorps } from "@/lib/espace/api";
import { continuerFil, corpsContinuer, erreurDeTexte, journaliserQuestions, lireFil } from "@/lib/espace/questions";
import { notifierEquipe } from "@/lib/espace/questions-equipe";
import { limiterQuestions, notifier } from "@/lib/espace/questions-route";
import { noterEvenementEspace } from "@/lib/mesure/evenements-espace";

/**
 * POST /api/espace/questions/[id]/messages (s24, lot D7) : « Continuer » un fil répondu.
 * Corps `{ message, cle }`. Abonné actif seulement (403 `lecture-seule` après la résiliation) ; fil d'un
 * autre compte ou inexistant : 404 ; fil encore en attente : 409 ; mêmes limites que l'envoi ; même clé :
 * une seule ligne. Enregistré AVANT la notification interne. Texte jamais journalisé.
 * Lot D9 : `question_envoyee` SANS texte ni détail, une fois par message (clé d'idempotence de l'envoi).
 */
export const dynamic = "force-dynamic";

type Contexte = { params: { id: string } };
/** Appel sans segment (tests de fermeture) : la garde répond avant toute lecture de l'identifiant. */
const SANS_ID: Contexte = { params: { id: "" } };

export async function POST(request: Request, { params }: Contexte = SANS_ID) {
  const garde = await garderApiLectureSeule();
  if (garde instanceof NextResponse) return garde;
  if (!garde.actif) return jsonEspace({ error: "lecture-seule" }, 403);
  if (!FORMAT_CLE.test(params.id)) return jsonEspace({ error: "introuvable" }, 404);
  const lu = corpsContinuer.safeParse(await lireCorps(request));
  if (!lu.success) return jsonEspace({ error: erreurDeTexte(lu.error) }, 400);
  try {
    const trop = await limiterQuestions(garde.userId);
    if (trop) return trop;
    const r = await continuerFil(garde.userId, params.id, lu.data.message, lu.data.cle);
    if (!r.ok) return jsonEspace({ error: r.raison }, r.raison === "introuvable" ? 404 : 409);
    if (r.nouveau) await noterEvenementEspace({ type: "question_envoyee", envoi: lu.data.cle }, garde.userId);
    const fil = await lireFil(garde.userId, params.id);
    if (r.nouveau && fil) await notifier(garde.userId, (replyTo, envoyer) => notifierEquipe({ type: fil.type, message: lu.data.message, replyTo, cle: lu.data.cle, envoyer }));
    return jsonEspace({ fil });
  } catch (error) {
    journaliserQuestions("continuer", error);
    return jsonEspace({ error: "indisponible" }, 503);
  }
}

export async function GET() {
  return methodeNonPermise();
}
