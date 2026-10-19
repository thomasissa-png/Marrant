/**
 * POST /api/admin/lettre-premium/apercu (s21, spec H7-5) : le prochain numéro de la lettre
 * de la semaine, envoyé à l'adresse de l'admin SEULEMENT, objet « [Aperçu] », pied réel.
 * Marche interrupteurs fermés (c'est ainsi qu'on vérifie le rendu). 200, 401, 409 (aucun numéro).
 */
import { NextRequest, NextResponse } from "next/server";
import { LETTRE_CONTACT } from "@/config/textes/lettre-s21";
import { refusAdmin } from "@/lib/admin/auth";
import { envoyerApercuHebdo } from "@/lib/admin/lettre-hebdo-comptes";
import { siteBaseUrl } from "@/lib/newsletter";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const refus = refusAdmin(request);
  if (refus) return refus;
  try {
    const { ADMIN_EMAIL, sendServiceTextEmail } = await import("@/lib/email");
    const r = await envoyerApercuHebdo({
      baseUrl: siteBaseUrl(),
      now: new Date(),
      adresseAdmin: ADMIN_EMAIL,
      envoyer: (to, subject, text) => sendServiceTextEmail(to, subject, text, "lettre-hebdo", { replyTo: LETTRE_CONTACT }),
    });
    if (r === "aucun") return NextResponse.json({ error: "Aucun numéro préparé à venir" }, { status: 409 });
    return NextResponse.json({ envoye: true });
  } catch (err) {
    console.error(`[admin:lettre-premium/apercu] Échec : ${err instanceof Error ? err.message : "erreur inconnue"}`);
    return NextResponse.json({ error: "Aperçu non envoyé" }, { status: 500 });
  }
}
