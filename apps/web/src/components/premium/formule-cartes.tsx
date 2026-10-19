"use client";

import {
  formatEuros,
  PREMIUM_ANNUAL_EQUIVALENT_LABEL,
  PREMIUM_ANNUAL_PRICE_CENTS,
  PREMIUM_MONTHLY_PRICE_CENTS,
  type PremiumPlan,
} from "@/config/premium";
import { ANNUEL_MOIS_OFFERTS_LABEL } from "@/config/textes/offre";
import { FORMULES } from "@/config/textes/abonnement-vente";
import { cn } from "@/lib/utils";

/**
 * B2 de /abonnement (trajet de conversion s21, @ux §5) : deux cartes radio côte à côte, chaque fait
 * dit une seule fois. Mensuel : « 2,99 € TTC / mois ». Annuel : « 24,99 € TTC / an », « soit 2,08 €
 * par mois » (arbitrage du 19/10) et « plus de 3 mois offerts ». Groupe radio natif (flèches au
 * clavier, lecteurs d'écran) ; sous 340 px, les cartes passent en pile (mensuel au-dessus).
 * Annuel indisponible : prix mensuel seul, comme avant.
 */
export function FormuleCartes({
  value,
  onChange,
  annualAvailable,
}: {
  value: PremiumPlan;
  onChange: (plan: PremiumPlan) => void;
  annualAvailable: boolean;
}) {
  if (!annualAvailable) {
    return (
      <p className="mt-4 flex items-baseline justify-center gap-2" data-testid="formule-mensuel-seul">
        <span className="font-display text-3xl font-bold text-text-primary">{formatEuros(PREMIUM_MONTHLY_PRICE_CENTS)}</span>{" "}
        <span className="text-sm text-text-secondary">{FORMULES.suffixeMensuel}</span>
      </p>
    );
  }
  return (
    <fieldset className="mt-4" data-testid="plan-selector">
      <legend className="sr-only">{FORMULES.legende}</legend>
      <div className="grid grid-cols-2 gap-2 max-[339px]:grid-cols-1">
        <Carte
          plan="monthly"
          actif={value === "monthly"}
          onChange={onChange}
          nom={FORMULES.mensuel}
          montant={formatEuros(PREMIUM_MONTHLY_PRICE_CENTS)}
          suffixe={FORMULES.suffixeMensuel}
        />
        <Carte
          plan="annual"
          actif={value === "annual"}
          onChange={onChange}
          nom={FORMULES.annuel}
          montant={formatEuros(PREMIUM_ANNUAL_PRICE_CENTS)}
          suffixe={FORMULES.suffixeAnnuel}
          lignes={[PREMIUM_ANNUAL_EQUIVALENT_LABEL, ANNUEL_MOIS_OFFERTS_LABEL]}
        />
      </div>
      {/* v2 A04 : renouvellement de l'annuel, seulement quand « Annuel » est choisi. */}
      {value === "annual" && (
        <p className="mt-2 text-center text-sm text-text-secondary" data-testid="renouvellement-annuel">
          {FORMULES.renouvelAnnuel}
        </p>
      )}
    </fieldset>
  );
}

function Carte({
  plan,
  actif,
  onChange,
  nom,
  montant,
  suffixe,
  lignes = [],
}: {
  plan: PremiumPlan;
  actif: boolean;
  onChange: (plan: PremiumPlan) => void;
  nom: string;
  montant: string;
  suffixe: string;
  lignes?: string[];
}) {
  return (
    <label
      data-testid={`formule-${plan}`}
      className={cn(
        "flex min-h-11 cursor-pointer flex-col justify-center rounded-lg border-2 px-3 py-2 text-left transition-colors",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-primary has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background-card",
        actif ? "border-accent-primary bg-accent-primary/15" : "border-border bg-background-card hover:border-text-muted",
      )}
    >
      <input
        type="radio"
        name="premium-plan"
        value={plan}
        checked={actif}
        onChange={() => onChange(plan)}
        className="sr-only"
      />
      <span className="flex items-center gap-2 text-sm font-semibold text-text-primary">
        <span
          aria-hidden="true"
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
            actif ? "border-accent-primary" : "border-text-muted",
          )}
        >
          {actif && <span className="h-1.5 w-1.5 rounded-full bg-accent-primary" />}
        </span>
        {nom}
      </span>{" "}
      {/* Montant et suffixe sur une ligne quand ils tiennent ; sinon le suffixe passe dessous (375 px). */}
      <span className="mt-0.5 flex flex-wrap items-baseline gap-x-1">
        <span className="whitespace-nowrap font-display text-xl font-bold text-text-primary">{montant}</span>{" "}
        <span className="whitespace-nowrap text-xs text-text-secondary">{suffixe}</span>
      </span>
      {lignes.map((ligne, i) => (
        // Espace avant chaque ligne : nom accessible de la carte lisible (« … TTC / an soit 2,08 € … »).
        <span key={ligne} className={cn("text-xs leading-snug", i === lignes.length - 1 ? "font-semibold text-accent-link" : "text-text-secondary")}>
          {" "}
          {ligne}
        </span>
      ))}
    </label>
  );
}
