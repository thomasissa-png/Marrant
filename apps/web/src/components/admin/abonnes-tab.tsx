"use client";

/** Onglet « Abonnés » : abonnés Premium (comptes) et inscrits à la lettre (s21). */
import { ComptesSection } from "./comptes-section";
import { LettreSection } from "./lettre-section";

export type VueAbonnes = "premium" | "lettre";

const VUES: { id: VueAbonnes; label: string }[] = [
  { id: "premium", label: "Premium et comptes" },
  { id: "lettre", label: "Lettre" },
];

export function AbonnesTab({
  vue,
  onVue,
  onUnauthorized,
}: {
  vue: VueAbonnes;
  onVue: (v: VueAbonnes) => void;
  onUnauthorized: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex w-full rounded-lg border border-border bg-background-elevated p-1 sm:w-auto sm:max-w-sm" role="group" aria-label="Type d'abonnés">
        {VUES.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={vue === v.id}
            onClick={() => onVue(v.id)}
            className={`min-h-11 flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              vue === v.id ? "bg-background-card text-text-primary shadow-sm" : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
      {vue === "premium" ? <ComptesSection onUnauthorized={onUnauthorized} /> : <LettreSection onUnauthorized={onUnauthorized} />}
    </div>
  );
}
