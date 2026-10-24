"use client";

import {
  ESPACE_INSECABLE,
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
 * clavier, lecteurs d’écran) ; sous 400 px, une carte par ligne (nom et prix sur la même ligne).
 * Annuel indisponible : prix mensuel seul, comme avant.
 */
/** Lignes secondaires d'une carte (équivalent mensuel, mois offerts, renouvellement) : même corps. */
const LIGNE_CARTE = "text-xs leading-snug";

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
    <fieldset className="mt-4 max-[399px]:mt-2.5 max-[359px]:mt-2" data-testid="plan-selector">
      <legend className="sr-only">{FORMULES.legende}</legend>
      {/* Sous 400 px : une carte par ligne, nom et prix sur la même ligne (premier écran à 320 × 640). */}
      {/* Finition du tour 3 : cartes à la hauteur de leur contenu (`items-start`) : prix alignés en haut,
          plus de vide sous le prix de la case Mensuel. */}
      <div className="grid grid-cols-2 items-start gap-2 max-[399px]:grid-cols-1 max-[399px]:gap-1.5">
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
          mention={FORMULES.renouvelAnnuel}
        />
      </div>
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
  mention,
}: {
  plan: PremiumPlan;
  actif: boolean;
  onChange: (plan: PremiumPlan) => void;
  nom: string;
  montant: string;
  suffixe: string;
  lignes?: string[];
  /** v3 M2 : « Renouvelé chaque année, sauf résiliation. », dans la carte, affichée en permanence. */
  mention?: string;
}) {
  return (
    <label
      data-testid={`formule-${plan}`}
      className={cn(
        // v3 M7 : contenu calé en haut (prix alignés d'une carte à l'autre) ; sous 400 px, une ligne par carte.
        "flex min-h-11 cursor-pointer flex-col justify-start rounded-lg border-2 px-3 py-2 text-left transition-colors",
        "max-[399px]:flex-row max-[399px]:flex-wrap max-[399px]:items-center max-[399px]:gap-x-1.5 max-[399px]:px-2 max-[399px]:py-1.5 max-[399px]:tracking-tight",
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
      <span className="mt-0.5 flex flex-wrap items-baseline gap-x-1 max-[399px]:ml-auto max-[399px]:mt-0">
        <span className="whitespace-nowrap font-display text-xl font-bold text-text-primary">{montant}</span>{" "}
        <span className="whitespace-nowrap text-xs text-text-secondary">{suffixe}</span>
      </span>
      {/* Finition du tour 3 : sous 400 px, les lignes de la carte forment un paragraphe, séparées par
          « · » (insécable avant : jamais en début de ligne) ; au-dessus, une ligne chacune. */}
      {lignes.length > 0 && (
        <span className="flex flex-col max-[399px]:block max-[399px]:basis-full">
          {lignes.map((ligne, i) => (
            // Espace avant chaque ligne : nom accessible de la carte lisible (« … TTC / an soit 2,08 € … »).
            <span key={ligne} className={cn(LIGNE_CARTE, "max-[399px]:inline", i === lignes.length - 1 ? "font-semibold text-accent-link" : "text-text-secondary")}>
              {i > 0 && (
                <span aria-hidden="true" className="hidden font-normal text-text-secondary max-[399px]:inline">
                  {`${ESPACE_INSECABLE}·`}
                </span>
              )}{" "}
              {ligne}
            </span>
          ))}
        </span>
      )}
      {/* Même taille et même couleur que « soit 2,08 € par mois » (finition du tour 3). */}
      {mention && (
        <span className={cn(LIGNE_CARTE, "text-text-secondary max-[399px]:basis-full")} data-testid="renouvellement-annuel">
          {" "}
          {mention}
        </span>
      )}
    </label>
  );
}
