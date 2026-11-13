import { NextResponse } from "next/server";
import { garderApiLectureSeule, methodeNonPermise } from "@/lib/espace/garde";
import { jsonEspace, lireCorps } from "@/lib/espace/api";
import { corpsEnvoi, creerFil, erreurDeTexte, journaliserQuestions, lireFil, listerFils } from "@/lib/espace/questions";
import { notifierEquipe } from "@/lib/espace/questions-equipe";
import { limiterQuestions, notifier } from "@/lib/espace/questions-route";
import { compterAnonyme } from "@/lib/espace/compteurs";

/**
 * /api/espace/questions (s24, lot D7, architecture v20 2.6) : « Mes questions ».
 * GET : l'historique de l'abonné (lisible aussi après la résiliation : `lectureSeule`).
 * POST `{ type, message, cle }` : nouvel envoi, abonné actif seulement (403 `lecture-seule` après la
 *   résiliation) ; vide ou plus de 1 000 caractères : 400 ; même clé (double clic) : le même fil, une
 *   seule ligne ; 3 envois par 10 minutes et 10 par jour : 429 + Retry-After. Le fil est enregistré
 *   AVANT la notification interne à l'équipe (Reply-To = adresse du compte lue en base) ; l'échec de la
 *   notification ne perd rien (le fil est dans l'outil).
 * Le texte n'est jamais journalisé, ni dans `UsageEvent`, ni vers Umami. Fermé : 404 avant toute lecture.
 * Lot D9 : `question_envoyee` SANS texte ni détail, une fois par fil créé (double clic : rien de plus).
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const garde = await garderApiLectureSeule();
  if (garde instanceof NextResponse) return garde;
  try {
    return jsonEspace({ fils: await listerFils(garde.userId), lectureSeule: !garde.actif });
  } catch (error) {
    journaliserQuestions("liste", error);
    return jsonEspace({ error: "indisponible" }, 503);
  }
}

export async function POST(request: Request) {
  const garde = await garderApiLectureSeule();
  if (garde instanceof NextResponse) return garde;
  if (!garde.actif) return jsonEspace({ error: "lecture-seule" }, 403);
  const lu = corpsEnvoi.safeParse(await lireCorps(request));
  if (!lu.success) return jsonEspace({ error: erreurDeTexte(lu.error) }, 400);
  try {
    const trop = await limiterQuestions(garde.userId);
    if (trop) return trop;
    const { id, nouveau } = await creerFil(garde.userId, lu.data.type, lu.data.message, lu.data.cle);
    if (nouveau) await compterAnonyme({ cle: "action", valeur: "question-envoyee" });
    if (nouveau) await notifier(garde.userId, (replyTo, envoyer) => notifierEquipe({ type: lu.data.type, message: lu.data.message, replyTo, cle: lu.data.cle, envoyer }));
    return jsonEspace({ fil: await lireFil(garde.userId, id) });
  } catch (error) {
    journaliserQuestions("envoi", error);
    return jsonEspace({ error: "indisponible" }, 503);
  }
}

export async function PUT() {
  return methodeNonPermise();
}

export async function DELETE() {
  return methodeNonPermise();
}
