import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { LIMITES, modeValidation, questionsOuvertes } from "@/config/equipe-questions";
import {
  creerQuestionAdmin,
  ecarter,
  enregistrerReponse,
  envoyerReponse,
  exporterLot,
  importerBrouillons,
  listerFile,
  marquerRelue,
  marquerSensible,
  proposerExtrait,
  type ResultatCircuit,
} from "@/lib/equipe-questions/circuit";
import { refusAdmin } from "@/lib/equipe-questions/admin-auth";

export const dynamic = "force-dynamic";

/**
 * Back-office « Ta question à l'équipe » (s21). Auth : `Bearer {ADMIN_PASSWORD}`.
 * Utilisable interrupteur fermé (pilote des premières questions, spec §8).
 *
 * GET               → { file, mode, ouvert } (tri par échéance ; `?statut=RECUE|…`)
 * GET ?lot=1        → { lot } : id opaque + texte, sans identité, sensibles exclues
 * POST { action, … } :
 *   importer   { brouillons: [{ id, brouillon }] } → { importes, refuses }
 *   enregistrer{ id, reponse }   relue { id }   envoyer { id }   ecarter { id }
 *   sensible   { id, sensible }  extrait { id, texte }
 *   creer      { email, situation, retour? }  (question reçue hors site)
 */
const STATUTS = ["RECUE", "BROUILLON", "RELUE", "ENVOYEE", "ECARTEE"] as const;
const id = z.string().min(1).max(64);
const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("importer"), brouillons: z.array(z.object({ id, brouillon: z.string().max(LIMITES.reponseMax) })).max(200) }),
  z.object({ action: z.literal("enregistrer"), id, reponse: z.string().min(1).max(LIMITES.reponseMax) }),
  z.object({ action: z.literal("relue"), id }),
  z.object({ action: z.literal("envoyer"), id }),
  z.object({ action: z.literal("ecarter"), id }),
  z.object({ action: z.literal("sensible"), id, sensible: z.boolean() }),
  z.object({ action: z.literal("extrait"), id, texte: z.string().min(1).max(LIMITES.extraitMax) }),
  z.object({
    action: z.literal("creer"),
    email: z.string().email(),
    situation: z.string().trim().min(LIMITES.situationMin).max(LIMITES.situationMax),
    retour: z.string().max(LIMITES.retourMax).optional(),
  }),
]);

function reponseCircuit(r: ResultatCircuit): NextResponse {
  if (r.ok) return NextResponse.json(r);
  const status = r.code === "introuvable" ? 404 : r.code === "grille" ? 422 : r.code === "envoi" ? 502 : 409;
  return NextResponse.json(r, { status });
}

export async function GET(request: NextRequest) {
  const refus = refusAdmin(request);
  if (refus) return refus;
  try {
    if (request.nextUrl.searchParams.get("lot") === "1") {
      return NextResponse.json({ lot: await exporterLot() });
    }
    const statutParam = request.nextUrl.searchParams.get("statut");
    const statut = STATUTS.find((s) => s === statutParam);
    const file = await listerFile(statut);
    return NextResponse.json({ file, mode: modeValidation(), ouvert: questionsOuvertes() });
  } catch (err) {
    console.error("[admin/equipe-questions] GET :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const refus = refusAdmin(request);
  if (refus) return refus;
  const parse = schema.safeParse(await request.json().catch(() => null));
  if (!parse.success) return NextResponse.json({ error: "Requête invalide", details: parse.error.issues }, { status: 400 });
  const b = parse.data;
  try {
    switch (b.action) {
      case "importer":
        return NextResponse.json(await importerBrouillons(b.brouillons));
      case "enregistrer":
        return reponseCircuit(await enregistrerReponse(b.id, b.reponse));
      case "relue":
        return reponseCircuit(await marquerRelue(b.id));
      case "envoyer":
        return reponseCircuit(await envoyerReponse(b.id, "admin"));
      case "ecarter":
        return reponseCircuit(await ecarter(b.id));
      case "sensible":
        return reponseCircuit(await marquerSensible(b.id, b.sensible));
      case "extrait":
        return reponseCircuit(await proposerExtrait(b.id, b.texte));
      case "creer": {
        const r = await creerQuestionAdmin({ email: b.email, situation: b.situation, retour: b.retour });
        return r.ok ? NextResponse.json(r, { status: 201 }) : NextResponse.json(r, { status: 404 });
      }
    }
  } catch (err) {
    console.error("[admin/equipe-questions] POST :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
