"use client";

import { useState } from "react";
import { TEXTES_AUJOURDHUI as T } from "@/config/textes/espace-aujourdhui";
import type { ReponseAise } from "@/lib/espace/aise";

/**
 * « Où veux-tu être plus à l'aise ? » (décision C9) : élément SECONDAIRE, une seule fois, après le
 * premier pas fait (jamais avant : la page ne le monte pas sinon), quatre boutons de 44 px, jamais
 * l'action principale ; disparaît après la réponse. Échec : la question reste, une ligne le dit.
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
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-labelledby="aise-titre">
        {REPONSES.map((r) => (
          <button
            key={r}
            type="button"
            disabled={etat === "envoi"}
            onClick={() => void repondre(r)}
            className="inline-flex min-h-11 items-center rounded-full border border-border-input px-4 text-sm font-medium text-text-primary transition-colors hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary disabled:opacity-50"
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
