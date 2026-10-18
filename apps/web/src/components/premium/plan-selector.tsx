"use client";

import { useId } from "react";
import { chipClass } from "@/components/ui/chip";
import {
  formatEuros,
  PREMIUM_ANNUAL_PRICE_CENTS,
  PREMIUM_MONTHLY_PRICE_CENTS,
  type PremiumPlan,
} from "@/config/premium";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ANNUEL_LIGNE_ANNUEL, ANNUEL_LIGNE_MENSUEL, ANNUEL_MOIS_OFFERTS_LABEL } from "@/config/textes/offre";

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
  const offertId = useId();
  return (
    <div className="mt-3" data-testid="plan-selector">
      <fieldset>
        <legend className="sr-only">Choisis ta formule</legend>
        {/* Correctif s21 (QA visuelle, 375 px) : chaque option est un groupe ; la pastille
            « plus de 3 mois offerts » vit DANS le groupe « Annuel » (sous sa pastille sous 640 px, à sa droite au-delà, revue visuelle
            s21, R17). Si la ligne casse (320 px), elle part avec « Annuel », jamais sous
            « Mensuel ». Annoncée avec l'option Annuel (aria-describedby). */}
        <div className="flex flex-wrap items-start gap-2 sm:items-center">
          {OPTIONS.map((option) => {
            const showOffert = option.value === "annual" && !isAnnual;
            const actif = value === option.value;
            return (
              // Revue visuelle s21 (R17) : dès 640 px, la pastille « mois offerts » en ligne, à droite de
              // « Annuel » ; en dessous, sous sa pastille (Mensuel et Annuel restent sur une ligne à 375).
              <div key={option.value} className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-2">
                {/* Revue design s21 m1 : anneau au clavier seulement (plus d'anneau resté
                    après un clic). m3 : formule choisie en violet léger bordé, le seul violet
                    plein du premier écran reste le bouton d'achat. */}
                <label
                  className={chipClass(
                    actif ? "active" : "idle",
                    cn(
                      "cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-primary has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background-card",
                      actif && "border-accent-primary bg-accent-primary/20 text-text-primary",
                    ),
                  )}
                >
                  <input
                    type="radio"
                    name="premium-plan"
                    value={option.value}
                    checked={value === option.value}
                    onChange={() => onChange(option.value)}
                    aria-describedby={showOffert ? offertId : undefined}
                    className="sr-only"
                  />
                  {option.label}
                </label>
                {/* Lot 2 s21 : « plus de 3 mois offerts » dit une seule fois, rattaché à
                    « Annuel », dès l'état mensuel. Annuel choisi : la ligne sous le prix le dit,
                    la pastille reste dans le flux mais invisible et muette (revue design s21
                    m2 : le prix et le bouton ne bougent plus sous le pouce). */}
                {option.value === "annual" && (
                  <Badge
                    id={offertId}
                    variant="primary"
                    data-testid="annuel-mois-offerts"
                    aria-hidden={showOffert ? undefined : true}
                    className={showOffert ? undefined : "invisible"}
                  >
                    {ANNUEL_MOIS_OFFERTS_LABEL}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-3 flex items-baseline gap-2 sm:mt-4" aria-live="polite">
        <span className="font-display text-4xl font-bold text-text-primary">
          {formatEuros(isAnnual ? PREMIUM_ANNUAL_PRICE_CENTS : PREMIUM_MONTHLY_PRICE_CENTS)}
        </span>
        <span className="text-text-muted">{isAnnual ? "TTC / an" : "TTC / mois"}</span>
      </div>
      {/* Revue design s21 m2, puis revue design v2 (point 1) : la 1re ligne de chaque formule
          occupe la même case de grille (celle de la formule non choisie est invisible et
          muette) ; seule la hauteur de cette ligne est réservée. Le HTML serveur est celui du
          mensuel : aucun saut au chargement. */}
      <div className="grid">
        <p
          className={cn("col-start-1 row-start-1 mt-1 text-sm font-medium text-accent-link", !isAnnual && "invisible")}
          aria-hidden={isAnnual ? undefined : true}
        >
          {/* Concision v5 : « Soit 2,08 € par mois, plus de 3 mois offerts. » (calculé). */}
          {ANNUEL_LIGNE_ANNUEL}
        </p>
        {/* Lot 2 s21 (validé à l'aveugle, tour 3) : l'annuel visible dès l'état par défaut ;
            « Sans engagement, annulable à tout moment » retiré (dit par la réassurance). */}
        <p
          className={cn("col-start-1 row-start-1 mt-1 text-sm font-medium text-accent-link", isAnnual && "invisible")}
          aria-hidden={isAnnual ? true : undefined}
          data-testid="annuel-ligne-mensuel"
        >
          {ANNUEL_LIGNE_MENSUEL}
        </p>
      </div>
    </div>
  );
}
