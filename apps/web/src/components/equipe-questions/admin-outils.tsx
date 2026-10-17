"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ActionAdmin } from "./admin-carte-question";

/**
 * Outils du lot : export SANS identité (préparation en session par les agents),
 * import des brouillons (refus listés par défaut de grille), saisie d'une
 * question reçue hors site (pilote).
 */
export function OutilsLot({ agir, exporter }: { agir: ActionAdmin; exporter: () => Promise<string> }) {
  const [lot, setLot] = useState("");
  const [brouillons, setBrouillons] = useState("");
  const [email, setEmail] = useState("");
  const [situation, setSituation] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function importer() {
    let items: unknown;
    try {
      items = JSON.parse(brouillons);
    } catch {
      setMessage("JSON illisible : attendu [{ \"id\": \"…\", \"brouillon\": \"…\" }]");
      return;
    }
    setMessage(await agir({ action: "importer", brouillons: items }));
  }

  return (
    <details className="rounded-lg border border-border p-4">
      <summary className="cursor-pointer font-semibold text-text-primary">Lot de préparation et saisie manuelle</summary>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Button size="sm" variant="outline" onClick={async () => setLot(await exporter())}>Exporter le lot (questions reçues, sans identité)</Button>
          <textarea readOnly value={lot} rows={8} aria-label="Lot exporté"
            className="w-full rounded-lg border border-border bg-background p-2 font-mono text-xs text-text-primary" />
        </div>
        <div className="space-y-2">
          <label htmlFor="import-brouillons" className="block text-sm font-semibold text-text-primary">Brouillons préparés (JSON)</label>
          <textarea id="import-brouillons" value={brouillons} onChange={(e) => setBrouillons(e.target.value)} rows={8}
            className="w-full rounded-lg border border-border bg-background p-2 font-mono text-xs text-text-primary" />
          <Button size="sm" variant="outline" onClick={importer}>Importer les brouillons</Button>
        </div>
        <div className="space-y-2 md:col-span-2">
          <p className="text-sm font-semibold text-text-primary">Question reçue hors site</p>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail du compte" aria-label="E-mail du compte"
            className="w-full rounded-lg border border-border bg-background p-2 text-text-primary" />
          <textarea value={situation} onChange={(e) => setSituation(e.target.value)} rows={3} aria-label="Situation"
            className="w-full rounded-lg border border-border bg-background p-2 text-text-primary" />
          <Button size="sm" variant="outline" onClick={async () => setMessage(await agir({ action: "creer", email, situation }))}>Créer la question</Button>
        </div>
      </div>
      {message && <p role="status" className="mt-3 text-sm text-text-primary">{message}</p>}
    </details>
  );
}
