"use client";

import { useState } from "react";
import { TEXTES_CAPS } from "@/config/textes/espace-caps";
import { cn } from "@/lib/utils";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_CAPS);

/**
 * « Ta grille » (architecture 2.4, étalon E4, maquette `bonus.html`) : trois questions, « Oui » ou
 * « Non » par question, état pressé marqué par un contour de 2 px et une coche (jamais la couleur
 * seule). Rien n'est enregistré ni envoyé.
 */
export function GrilleOuiNon({ questions }: { questions: readonly string[] }) {
  const [reponses, setReponses] = useState<Record<number, "oui" | "non">>({});
  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <div key={q} role="group" aria-labelledby={`grille-q-${i}`}>
          <p id={`grille-q-${i}`} className="text-sm text-text-primary">
            {q}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["oui", "non"] as const).map((r) => {
              const presse = reponses[i] === r;
              return (
                <button
                  key={r}
                  type="button"
                  aria-pressed={presse}
                  onClick={() => setReponses((p) => ({ ...p, [i]: r }))}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-1 rounded-full border px-4 text-sm font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
                    presse ? "border-2 border-accent-primary-hover bg-background-elevated" : "border-border-input",
                  )}
                >
                  {presse && (
                    <svg className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {r === "oui" ? T.fiche.oui : T.fiche.non}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
