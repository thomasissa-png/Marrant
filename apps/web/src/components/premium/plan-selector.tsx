"use client";

import {
  formatEuros,
  PREMIUM_ANNUAL_CENTS,
  PREMIUM_ANNUAL_MONTHLY_EQUIVALENT_CENTS,
  PREMIUM_ANNUAL_SAVINGS_CENTS,
  PREMIUM_MONTHLY_CENTS,
  type PremiumPlan,
} from "@/lib/premium-plans";

type PlanOption = {
  value: PremiumPlan;
  label: string;
  price: string;
  period: string;
  detail: string;
  highlight?: string;
};

const OPTIONS: PlanOption[] = [
  {
    value: "monthly",
    label: "Mensuel",
    price: formatEuros(PREMIUM_MONTHLY_CENTS),
    period: "/ mois",
    detail: "Sans engagement, annulable à tout moment",
  },
  {
    value: "annual",
    label: "Annuel",
    price: formatEuros(PREMIUM_ANNUAL_CENTS),
    period: "/ an",
    detail: `Payé en une fois, soit ${formatEuros(PREMIUM_ANNUAL_MONTHLY_EQUIVALENT_CENTS)} par mois`,
    highlight: `Tu économises ${formatEuros(PREMIUM_ANNUAL_SAVINGS_CENTS)} par an`,
  },
];

/** Choix mensuel / annuel : groupe radio natif (clavier et lecteurs d'écran inclus). */
export function PlanSelector({
  value,
  onChange,
}: {
  value: PremiumPlan;
  onChange: (plan: PremiumPlan) => void;
}) {
  return (
    <fieldset className="mt-4">
      <legend className="sr-only">Choisis ta formule</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-colors focus-within:ring-2 focus-within:ring-accent-primary focus-within:ring-offset-2 ${
                checked
                  ? "border-accent-primary bg-accent-primary/10"
                  : "border-border hover:border-border-hover"
              }`}
            >
              <input
                type="radio"
                name="premium-plan"
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span className="text-sm font-semibold text-text-primary">{option.label}</span>
              <span className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-text-primary">{option.price}</span>
                <span className="text-text-muted">{option.period}</span>
              </span>
              <span className="mt-1 text-sm text-text-secondary">{option.detail}</span>
              {option.highlight && (
                <span className="mt-2 text-sm font-medium text-accent-link">{option.highlight}</span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
