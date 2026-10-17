/**
 * Utilitaires HTTP partagés par les routes abonné et admin de « Ta question à l'équipe ».
 * Interrupteur fermé : 404 sans corps explicatif (rien ne trahit la fonction).
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { questionsOuvertes } from "@/config/equipe-questions";
import { TEXTES_EQUIPE_ETATS as E } from "@/config/textes/equipe-questions";

export function introuvable(): NextResponse {
  return NextResponse.json({ error: "Introuvable" }, { status: 404 });
}

/** 404 si l'interrupteur est fermé, sinon null. À appeler AVANT toute autre lecture. */
export function siFerme(): NextResponse | null {
  return questionsOuvertes() ? null : introuvable();
}

export async function userIdSession(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

export function nonConnecte(): NextResponse {
  return NextResponse.json({ error: "Connexion requise", code: "session" }, { status: 401 });
}

/** Traduction d'un refus métier en réponse HTTP. */
export function reponseRefus(code: "premium" | "garde-fou" | "introuvable" | "etat"): NextResponse {
  switch (code) {
    case "premium":
      return NextResponse.json({ error: E.nonPremium, code }, { status: 403 });
    case "garde-fou":
      return NextResponse.json({ error: E.gardeFou, code }, { status: 409 });
    case "introuvable":
      return NextResponse.json({ error: E.introuvable, code }, { status: 404 });
    default:
      return NextResponse.json({ error: E.erreurServeur, code }, { status: 409 });
  }
}

export function erreurServeur(contexte: string, err: unknown): NextResponse {
  console.error(`[equipe-questions] ${contexte} :`, err instanceof Error ? err.message : err);
  return NextResponse.json({ error: E.erreurServeur, code: "serveur" }, { status: 500 });
}
