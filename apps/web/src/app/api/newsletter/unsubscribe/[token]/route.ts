import { NextRequest, NextResponse } from "next/server";
import { desinscrireLettre } from "@/lib/lettre/inscription";
import { isPlausibleToken } from "@/lib/newsletter";
import { refuserSiAutreSite } from "@/lib/same-site";

export const dynamic = "force-dynamic";

/**
 * Désinscription de la lettre (s21, @legal L5 et L6). Toujours disponible,
 * MÊME interrupteur fermé (un e-mail déjà parti doit pouvoir être arrêté).
 *
 *  - POST `List-Unsubscribe=One-Click` (RFC 8058, client mail) : immédiat, 200 texte.
 *  - POST du bouton de `/lettre/desinscrire` : 303 vers `/lettre?statut=desinscrit`.
 *  - GET (scanner de liens, ancien lien) : ne change rien, renvoie vers la page du bouton.
 * Contrôle d'origine sur le bouton seulement (même règle que la confirmation :
 * autre site → `/lettre?statut=erreur`, rien d'arrêté) ; jamais sur le POST en un
 * clic, qui vient des serveurs de messagerie.
 * Seule la lettre mensuelle est arrêtée, rien d'autre.
 */
function vers(request: NextRequest, chemin: string) {
  // NEXTAUTH_URL d'abord : derrière le proxy Replit, request.url porte le port interne.
  return NextResponse.redirect(new URL(chemin, process.env.NEXTAUTH_URL || request.url), 303);
}

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  const token = params.token?.trim();
  if (!isPlausibleToken(token)) return vers(request, "/lettre?statut=invalide");
  return vers(request, `/lettre/desinscrire?token=${encodeURIComponent(token)}`);
}

async function estUnClic(request: NextRequest): Promise<boolean> {
  try {
    const type = request.headers.get("content-type") ?? "";
    if (!type.includes("form")) return false;
    const form = await request.formData();
    return form.get("List-Unsubscribe") === "One-Click";
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  const unClic = await estUnClic(request);
  const token = params.token?.trim();
  if (!isPlausibleToken(token)) {
    return unClic ? new NextResponse("Lien invalide", { status: 400 }) : vers(request, "/lettre?statut=invalide");
  }
  if (!unClic && refuserSiAutreSite(request, "newsletter/unsubscribe")) return vers(request, "/lettre?statut=erreur");
  try {
    const res = await desinscrireLettre(token);
    if (unClic) {
      return res === "invalide"
        ? new NextResponse("Lien invalide", { status: 404 })
        : new NextResponse("Désinscription enregistrée", { status: 200 });
    }
    return vers(request, res === "invalide" ? "/lettre?statut=invalide" : "/lettre?statut=desinscrit");
  } catch (err) {
    console.error("[lettre] Désinscription en échec :", err instanceof Error ? err.message : "erreur inconnue");
    return unClic ? new NextResponse("Erreur", { status: 500 }) : vers(request, "/lettre?statut=erreur");
  }
}
