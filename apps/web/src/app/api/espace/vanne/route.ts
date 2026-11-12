import { NextResponse } from "next/server";
import { z } from "zod";
import { garderApiEspace, methodeNonPermise } from "@/lib/espace/garde";
import { CATEGORIES_TOUCHER, tirerVanne } from "@/lib/espace/vanne";

/**
 * GET /api/espace/vanne?categorie=soiree&vues=id1,id2 (s24, lot D3) : « Une autre » et le toucher
 * « Ce soir, c'est plutôt ? ». Abonné actif seulement (404 fermé, 401, 403). Texte de la vanne
 * seulement : jamais d'exercice ni de champ interne, jamais une vanne `humourNoir`.
 * `{ vanne: null }` : le tour de la catégorie est fait pendant cette visite.
 */
export const dynamic = "force-dynamic";

const requete = z.object({
  categorie: z.enum(CATEGORIES_TOUCHER).nullable(),
  vues: z.array(z.string().regex(/^[A-Za-z0-9_-]{1,64}$/)).max(200),
});
const json = (d: Record<string, unknown>, status = 200) =>
  NextResponse.json(d, { status, headers: { "Cache-Control": "private, no-store" } });

export async function GET(request: Request) {
  const garde = await garderApiEspace();
  if (garde instanceof NextResponse) return garde;
  const params = new URL(request.url).searchParams;
  const lu = requete.safeParse({
    categorie: params.get("categorie") || null,
    vues: (params.get("vues") ?? "").split(",").filter(Boolean),
  });
  if (!lu.success) return json({ error: "parametres" }, 400);
  try {
    const vanne = await tirerVanne(lu.data.categorie, lu.data.vues);
    return json({ vanne: vanne ? { id: vanne.id, content: vanne.content, punchline: vanne.punchline } : null });
  } catch (error) {
    console.error("[espace/vanne] tirage impossible :", error);
    return json({ error: "indisponible" }, 503);
  }
}

/** Interrupteur fermé : 404 comme une adresse inexistante ; ouvert : 405. */
export async function POST() {
  return methodeNonPermise();
}
