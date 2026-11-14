"use client";

import { useState } from "react";
import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import type { ReponseAise } from "@/lib/espace/aise";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_AUJOURDHUI);

/**
 * « Où veux-tu être plus à l'aise ? » (décision C9) : élément SECONDAIRE, une seule fois, après le
 * premier pas fait (jamais avant : la page ne le monte pas sinon), quatre boutons de 44 px, jamais
 * l'action principale ; disparaît après la réponse. Échec : la question reste, une ligne le dit.
 * Sous la question, l'information de @legal (G9) : à quoi sert la réponse, où elle reste, quand elle
 * est effacée (`aria-describedby` du groupe, lue avec la question).
 */
const REPONSES: readonly ReponseAise[] = ["POTES", "BOULOT", "PLAIRE", "PARTOUT"];

export function QuestionAise() {
  const [etat, setEtat] = useState<"question" | "envoi" | "echec" | "faite">("question");
  if (etat === "faite") return null;

  const repondre = async (aise: ReponseAise) => {
    setEtat("envoi");
    const controleur = new AbortController();
    const delai = setTimeout(() => controleur.abort(), 5_000);
    try {
      const res = await fetch("/api/espace/aise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aise }),
        signal: controleur.signal,
      });
      setEtat(res.ok ? "faite" : "echec");
    } catch {
      setEtat("echec");
    } finally {
      clearTimeout(delai);
    }
  };

  return (
    <section aria-labelledby="aise-titre" className="rounded-lg border border-border bg-background-card p-4 md:p-6">
      <h2 id="aise-titre" className="text-base font-semibold text-text-primary">
        {T.aise.question}
      </h2>
      <p id="aise-information" className="mt-1 text-sm text-text-secondary">
        {T.aise.information}
      </p>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-labelledby="aise-titre" aria-describedby="aise-information">
        {REPONSES.map((r) => (
          <button
            key={r}
            type="button"
            disabled={etat === "envoi"}
            onClick={() => void repondre(r)}
            className="inline-flex min-h-11 items-center rounded-full border border-border-input px-4 text-sm font-medium text-text-primary transition-colors hover:border-text-muted hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary disabled:opacity-50"
          >
            {T.aise.reponses[r]}
          </button>
        ))}
      </div>
      {etat === "echec" && (
        <p role="alert" className="mt-3 text-sm text-error-text">
          {T.aise.echec}
        </p>
      )}
    </section>
  );
}
