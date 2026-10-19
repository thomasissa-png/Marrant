/**
 * POST /api/admin/lettre-premium/proposition { userIds } (s21, spec H6-9, avis @legal §6.5) :
 * proposition UNIQUE de la lettre de la semaine aux abonnés existants. Action manuelle de
 * Thomas, avec aperçu du texte dans l'admin (brouillon validé avant, règle commune 10).
 * 404 inscriptions fermées (textes CGU pas encore publiés) ; 409 si l'unique compte demandé
 * a déjà reçu la proposition ; 200 { envoyes, ignores } sinon. Jamais d'adresse dans les journaux.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { LETTRE_HEBDO_INSCRIPTIONS_OUVERTES } from "@/config/lettre";
import { LETTRE_CONTACT } from "@/config/textes/lettre-s21";
import { refusAdmin } from "@/lib/admin/auth";
import { proposerLettreHebdo } from "@/lib/admin/lettre-hebdo-comptes";
import { siteBaseUrl } from "@/lib/newsletter";

export const dynamic = "force-dynamic";

const bodySchema = z.object({ userIds: z.array(z.string().min(1).max(64)).min(1).max(50) }).strict();

export async function POST(request: NextRequest) {
  const refus = refusAdmin(request);
  if (refus) return refus;
  if (!LETTRE_HEBDO_INSCRIPTIONS_OUVERTES) return NextResponse.json({ error: "Inscriptions à la lettre de la semaine fermées" }, { status: 404 });
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  const { sendServiceTextEmail } = await import("@/lib/email");
  const deps = {
    baseUrl: siteBaseUrl(),
    now: new Date(),
    envoyer: (to: string, subject: string, text: string) => sendServiceTextEmail(to, subject, text, "lettre-hebdo", { replyTo: LETTRE_CONTACT }),
  };
  let envoyes = 0;
  const ignores: string[] = [];
  try {
    for (const userId of [...new Set(parsed.data.userIds)]) {
      const r = await proposerLettreHebdo(userId, deps);
      if (r.statut === "envoyee") envoyes++;
      else ignores.push(r.statut);
    }
  } catch (err) {
    console.error(`[admin:lettre-premium/proposition] Échec : ${err instanceof Error ? err.message : "erreur inconnue"}`);
    return NextResponse.json({ error: "Proposition impossible (base indisponible)" }, { status: 500 });
  }
  if (parsed.data.userIds.length === 1 && ignores[0] === "deja-proposee") {
    return NextResponse.json({ error: "Proposition déjà envoyée à ce compte" }, { status: 409 });
  }
  console.log(`[admin:lettre-premium/proposition] ${envoyes} envoyée(s), ${ignores.length} ignorée(s) (${ignores.join(", ") || "aucune"}).`);
  return NextResponse.json({ envoyes, ignores: ignores.length, motifs: ignores });
}
