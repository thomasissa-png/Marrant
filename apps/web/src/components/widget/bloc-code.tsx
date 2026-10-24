"use client";

import { useState } from "react";

/**
 * Code à copier de la page du programme (s22) : `<pre>` sélectionnable au
 * clavier et à la souris, bouton « Copier » en confort (presse-papiers).
 * Sans presse-papiers (navigateur ancien, contexte non sécurisé), le code
 * reste sélectionnable : le bouton annonce simplement l'échec.
 */
export function BlocCode({ id, label, code }: { id: string; label: string; code: string }) {
  const [etat, setEtat] = useState<"repos" | "copie" | "echec">("repos");

  async function copier() {
    try {
      await navigator.clipboard.writeText(code);
      setEtat("copie");
    } catch {
      setEtat("echec");
    }
  }

  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-border bg-background-card">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-1">
        <span id={`${id}-label`} className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </span>
        <button
          type="button"
          onClick={copier}
          aria-describedby={`${id}-label`}
          className="min-h-11 rounded-md px-3 text-sm font-semibold text-accent-link hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        >
          {/* BROUILLON s22 */}
          {etat === "copie" ? "Copié" : etat === "echec" ? "Sélectionne le code" : "Copier"}
        </button>
      </div>
      <pre
        tabIndex={0}
        aria-labelledby={`${id}-label`}
        className="overflow-x-auto whitespace-pre-wrap break-all p-4 text-sm leading-6 text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary"
      >
        <code>{code}</code>
      </pre>
      <span className="sr-only" aria-live="polite">
        {etat === "copie" ? "Code copié" : ""}
      </span>
    </div>
  );
}
