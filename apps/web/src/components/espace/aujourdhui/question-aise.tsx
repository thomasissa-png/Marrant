"use client";

import { useState } from "react";
import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import type { ReponseAise } from "@/lib/espace/aise";
import { frEspaceProfond } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { puce } from "@/components/espace/carte/styles";
import { TUILE } from "@/components/espace/aujourdhui/tableau";
import { META, TITRE_CARTE } from "@/components/espace/typo";

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

  // Échelle s25 : question en `TITRE_CARTE`, information en `META`, puces en 14/600 (`font-medium` hors échelle).
  // Refonte s25 (spec design §4 Z7) : tuile standard sur la rangée entière ; dès 1024 px, la question à gauche
  // (4 colonnes), les quatre puces à droite (8 colonnes) ; en dessous, empilées. v7 tour 3 (piste) : dès 768 px, les
  // quatre puces se répartissent sur toute leur colonne (4 parts égales), plus de tiers droit vide à 1280 et 1920.
  return (
    <section aria-labelledby="aise-titre" className={`${TUILE} lg:grid lg:grid-cols-12 lg:items-center lg:gap-6`} data-question-aise>
      <div className="min-w-0 lg:col-span-4">
        <h2 id="aise-titre" className={TITRE_CARTE}>
          {T.aise.question}
        </h2>
        <p id="aise-information" className={`mt-2 ${META}`}>
          {T.aise.information}
        </p>
      </div>
      <div className="mt-4 min-w-0 lg:col-span-8 lg:mt-0">
        <div className="flex flex-wrap gap-2 md:grid md:grid-cols-4" role="group" aria-labelledby="aise-titre" aria-describedby="aise-information">
          {REPONSES.map((r) => (
            <button key={r} type="button" disabled={etat === "envoi"} onClick={() => void repondre(r)} className={cn(puce(false), "font-semibold disabled:opacity-50 md:justify-center")}>
              {T.aise.reponses[r]}
            </button>
          ))}
        </div>
        {etat === "echec" && (
          <p role="alert" className="mt-4 text-sm text-error-text">
            {T.aise.echec}
          </p>
        )}
      </div>
    </section>
  );
}
