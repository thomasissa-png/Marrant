"use client";

import Link from "next/link";
import { QUESTION_EQUIPE_MAX } from "@/config/question-equipe";
import { QUESTION_EQUIPE_TROP_COURT_MAX_S, type TexteAvecLien } from "@/config/textes/question-equipe-s22";
import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import type { FilListe } from "@/lib/espace/questions-types";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const Q = frEspaceProfond(TEXTES_QUESTIONS);

/** Erreur affichée sous le champ : texte simple ou texte avec un lien (validés, `question-equipe-s22.ts`). */
export type Erreur = string | TexteAvecLien | null;

const MAX = QUESTION_EQUIPE_MAX.toLocaleString("fr-FR").replace(/\s/g, " ");

/** Contrôle côté navigateur, mêmes règles que le serveur (retrait des espaces de bord, caractères comptés). */
export function erreurLocale(texte: string): Erreur {
  const propre = texte.trim();
  if (propre.length === 0) return Q.erreurs.vide;
  if ([...propre].length > QUESTION_EQUIPE_MAX) return Q.erreurs.tropLong(MAX);
  return null;
}

/**
 * Envoi d'un message (nouveau fil ou « Continuer ») : délai de 5 s, aucun indicateur sans fin. Renvoie le
 * fil enregistré, ou l'erreur à afficher. Le texte n'est jamais journalisé ni envoyé ailleurs.
 */
export async function envoyerMessage(url: string, corps: Record<string, unknown>): Promise<{ fil: FilListe } | { erreur: Erreur }> {
  const controleur = new AbortController();
  const delai = setTimeout(() => controleur.abort(), 5_000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corps),
      cache: "no-store",
      signal: controleur.signal,
    });
    const lu = (await res.json().catch(() => null)) as { fil?: FilListe; error?: string } | null;
    if (res.ok && lu?.fil) return { fil: lu.fil };
    if (res.status === 401) return { erreur: Q.erreurs.session };
    if (res.status === 403) return { erreur: Q.erreurs.nonPremium };
    if (res.status === 429) {
      const s = Number(res.headers.get("Retry-After"));
      return { erreur: Number.isFinite(s) && s > 0 && s <= QUESTION_EQUIPE_TROP_COURT_MAX_S ? Q.erreurs.tropCourt : Q.erreurs.trop };
    }
    if (res.status === 400 && lu?.error === "vide") return { erreur: Q.erreurs.vide };
    if (res.status === 400 && lu?.error === "trop-long") return { erreur: Q.erreurs.tropLong(MAX) };
    return { erreur: Q.erreurs.envoi };
  } catch {
    return { erreur: Q.erreurs.envoi };
  } finally {
    clearTimeout(delai);
  }
}

export function MessageErreur({ id, erreur }: { id: string; erreur: Erreur }) {
  if (!erreur) return null;
  return (
    <p id={id} className="text-sm text-error-text" data-erreur>
      {typeof erreur === "string" ? (
        erreur
      ) : (
        <>
          {erreur.avant}
          <Link href={erreur.href} className="text-accent-link underline underline-offset-2">
            {erreur.lien}
          </Link>
          {erreur.apres}
        </>
      )}
    </p>
  );
}

const FORMAT_DATE = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "long" });

/** « 10 novembre » (heure de Paris), comme la maquette. */
export const dateCourte = (iso: string) => FORMAT_DATE.format(new Date(iso));
