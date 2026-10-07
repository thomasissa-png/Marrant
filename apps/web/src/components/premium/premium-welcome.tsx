"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { PREMIUM_WELCOME_PARAM, PREMIUM_WELCOME_VALUE } from "@/config/premium";
import { OFFRE_NOM } from "@/config/textes/offre";

/**
 * Message de bienvenue après paiement (décision Thomas, 03/10/2026) : affiché
 * sur la page de retour (intention d'origine ou /parcours) quand l'URL porte
 * `?premium=bienvenue` (posé par /abonnement/success). Fermable.
 */
export function PremiumWelcome() {
  const searchParams = useSearchParams();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || searchParams?.get(PREMIUM_WELCOME_PARAM) !== PREMIUM_WELCOME_VALUE) {
    return null;
  }

  return (
    <div
      role="status"
      className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-accent-primary/40 bg-accent-primary/10 p-4"
    >
      <div>
        <p className="font-semibold text-text-primary">Bienvenue dans {OFFRE_NOM}</p>
        <p className="mt-1 text-sm text-text-secondary">
          Toutes les étapes des parcours sont débloquées, et tes favoris t&apos;attendent. Reprends là où tu t&apos;étais arrêté.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-text-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        aria-label="Fermer le message de bienvenue"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
