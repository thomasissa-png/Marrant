"use client";

import { chipClass } from "@/components/ui/chip";
import {
  formatEuros,
  PREMIUM_ANNUAL_EQUIVALENT_LABEL,
  PREMIUM_ANNUAL_PRICE_CENTS,
  PREMIUM_MONTHLY_PRICE_CENTS,
  type PremiumPlan,
} from "@/config/premium";
import { Badge } from "@/components/ui/badge";
import {
  ANNUEL_AVANTAGE_LABEL,
  ANNUEL_LIGNE_MENSUEL,
  ANNUEL_MOIS_OFFERTS_LABEL,
} from "@/config/textes/offre";

const OPTIONS: { value: PremiumPlan; label: string }[] = [
  { value: "monthly", label: "Mensuel" },
  { value: "annual", label: "Annuel" },
];

/**
 * Choix mensuel / annuel (décision Thomas 04/10/2026) : groupe radio natif
 * (clavier et lecteurs d'écran inclus) habillé avec la pastille de la refonte
 * de forme (`chipClass`). Rendu uniquement si l'annuel est disponible côté
 * serveur ; sinon la page garde l'affichage mensuel seul.
 */
export function PlanSelector({
  value,
  onChange,
}: {
  value: PremiumPlan;
  onChange: (plan: PremiumPlan) => void;
}) {
  const isAnnual = value === "annual";
  return (
    <div className="mt-3">
      <fieldset>
        <legend className="sr-only">Choisis ta formule</legend>
        <div className="flex flex-wrap items-center gap-2">
          {OPTIONS.map((option) => (
            <label
              key={option.value}
              className={chipClass(
                value === option.value ? "active" : "idle",
                "cursor-pointer focus-within:ring-2 focus-within:ring-accent-primary focus-within:ring-offset-2",
              )}
            >
              <input
                type="radio"
                name="premium-plan"
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
          {/* Lot 2 s21 : « plus de 3 mois offerts » dit une seule fois, sur la pastille
              « Annuel », dès l'état mensuel. Annuel choisi : la ligne sous le prix le dit. */}
          {!isAnnual && (
            <Badge variant="primary" data-testid="annuel-mois-offerts">
              {ANNUEL_MOIS_OFFERTS_LABEL}
            </Badge>
          )}
        </div>
      </fieldset>

      <div className="mt-4 flex items-baseline gap-2" aria-live="polite">
        <span className="font-display text-4xl font-bold text-text-primary">
          {formatEuros(isAnnual ? PREMIUM_ANNUAL_PRICE_CENTS : PREMIUM_MONTHLY_PRICE_CENTS)}
        </span>
        <span className="text-text-muted">{isAnnual ? "TTC / an" : "TTC / mois"}</span>
      </div>
      {isAnnual ? (
        <>
          <p className="mt-1 text-sm font-medium text-accent-link">
            {/* D5 (audit s16) : « plus de 3 mois offerts » ET « 10,89 € économisés », calculés. */}
            {PREMIUM_ANNUAL_EQUIVALENT_LABEL}, {ANNUEL_AVANTAGE_LABEL}
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Payé en une fois, renouvelé chaque année, résiliable depuis ton profil
          </p>
        </>
      ) : (
        // Lot 2 s21 (validé à l'aveugle, tour 3) : l'annuel visible dès l'état par défaut ;
        // « Sans engagement, annulable à tout moment » retiré (dit par la réassurance).
        <p className="mt-1 text-sm font-medium text-accent-link" data-testid="annuel-ligne-mensuel">
          {ANNUEL_LIGNE_MENSUEL}
        </p>
      )}
    </div>
  );
}
