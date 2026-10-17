import { NextRequest, NextResponse } from "next/server";
import { emplacementDeSource, LETTRE_OUVERTE } from "@/config/lettre";
import { emailsExclus } from "@/lib/analytics/comptes-test";
import { confirmerLettre } from "@/lib/lettre/inscription";
import { isPlausibleToken } from "@/lib/newsletter";
import { getClientIp } from "@/lib/rate-limit";
import { refuserSiAutreSite } from "@/lib/same-site";

export const dynamic = "force-dynamic";

/**
 * Confirmation de la lettre (s21, @legal L5) : SEUL le POST du bouton de
 * `/lettre/confirmer` confirme. Un GET (scanner de liens, ancien lien) ne change
 * rien et renvoie vers la page du bouton.
 *
 * Mesure (spec §4 règle 3) : `mesure=1` n'est ajouté à la redirection que si
 * l'adresse n'est pas dans `emailsExclus()` ; `emplacement` est relu de `source`
 * en base, jamais de l'e-mail. Aucune adresse ni jeton dans l'URL d'arrivée.
 */
function vers(request: NextRequest, chemin: string) {
  // NEXTAUTH_URL d'abord : derrière le proxy Replit, request.url porte le port interne.
  return NextResponse.redirect(new URL(chemin, process.env.NEXTAUTH_URL || request.url), 303);
}

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  if (!LETTRE_OUVERTE) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  const token = params.token?.trim();
  if (!isPlausibleToken(token)) return vers(request, "/lettre?statut=invalide");
  return vers(request, `/lettre/confirmer?token=${encodeURIComponent(token)}`);
}

export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  if (!LETTRE_OUVERTE) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  const autreSite = refuserSiAutreSite(request, "newsletter/confirm");
  if (autreSite) return autreSite;

  const token = params.token?.trim();
  if (!isPlausibleToken(token)) return vers(request, "/lettre?statut=invalide");

  try {
    const ip = getClientIp(request.headers);
    const res = await confirmerLettre(token, ip === "local" ? null : ip);
    if (res.statut === "invalide") return vers(request, "/lettre?statut=invalide");

    const query = new URLSearchParams({ statut: "confirmee" });
    if (!emailsExclus().includes(res.email.toLowerCase())) {
      query.set("mesure", "1");
      const emplacement = emplacementDeSource(res.source);
      if (emplacement) query.set("emplacement", emplacement);
    }
    return vers(request, `/lettre?${query.toString()}`);
  } catch (err) {
    console.error("[lettre] Confirmation en échec :", err instanceof Error ? err.message : "erreur inconnue");
    return vers(request, "/lettre?statut=erreur");
  }
}
