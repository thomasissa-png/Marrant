import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { chipClass } from "@/components/ui/chip";
import { cn } from "@/lib/utils";
import { PremiumBenefits } from "@/components/premium/premium-benefits";
import { CarnetFicheCard, CarnetFicheLocked } from "@/components/carnet/carnet-fiche-card";
import { formatCarnetMonth, type CarnetView } from "@/lib/carnet";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { PREMIUM_PRICE_LABEL } from "@/config/premium";

/**
 * Rendu d'un carnet (Server Component). Reçoit une vue DÉJÀ filtrée par
 * `carnetViewForPlan` : pour un non-abonné, seules la première fiche et les
 * titres/contextes des autres existent dans les props, donc dans le HTML.
 */
export function CarnetPage({
  view,
  months,
  returnTo,
}: {
  view: CarnetView;
  months: string[];
  returnTo: string;
}) {
  const autresMois = months.filter((m) => m !== view.mois);
  const firstLocked = view.fiches.length + 1;

  return (
    <div className="mx-auto max-w-2xl">
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary max-md:py-3.5">Accueil</Link>
        <span className="mx-2">/</span>
        <Link href="/carnet" className="hover:text-text-primary max-md:py-3.5">Carnet</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">{formatCarnetMonth(view.mois)}</span>
      </nav>

      <header className="mb-8 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-link">
          Carnet de {formatCarnetMonth(view.mois)} · {view.totalFiches} situations
        </p>
        <h1 className="font-display text-3xl font-bold md:text-4xl">{view.titre}</h1>
        <p className="text-text-secondary">{view.intro}</p>
      </header>

      <div className="space-y-6">
        {view.fiches.map((fiche, i) => (
          <CarnetFicheCard
            key={fiche.id}
            fiche={fiche}
            numero={i + 1}
            offerte={!view.premium}
          />
        ))}
      </div>

      {!view.premium && view.apercus.length > 0 && (
        <section aria-labelledby="carnet-reserve" className="mt-10 space-y-4">
          <h2 id="carnet-reserve" className="font-display text-xl font-bold">
            Les {view.apercus.length} autres situations du mois
          </h2>
          <ol className="space-y-3">
            {view.apercus.map((fiche, i) => (
              <CarnetFicheLocked key={fiche.id} fiche={fiche} numero={firstLocked + i} />
            ))}
          </ol>
          <CarnetPaywall returnTo={returnTo} />
        </section>
      )}

      {view.premium && autresMois.length > 0 && (
        <section aria-labelledby="carnet-archives" className="mt-10">
          <h2 id="carnet-archives" className="mb-3 font-display text-xl font-bold">
            Les carnets précédents
          </h2>
          <ul className="flex flex-wrap gap-2">
            {autresMois.map((m) => (
              <li key={m}>
                <Link
                  href={`/carnet/${m}`}
                  className={chipClass()}
                >
                  {formatCarnetMonth(m)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/** Appel à l'abonnement : même destination que les étapes verrouillées des parcours. */
function CarnetPaywall({ returnTo }: { returnTo: string }) {
  return (
    <div className="rounded-2xl border border-accent-primary/20 bg-accent-primary/5 p-6 sm:p-8">
      <h3 className="mb-2 font-display text-xl font-bold">Débloque tout le carnet</h3>
      <p className="mb-4 text-sm text-text-secondary">
        La première situation est offerte. Les autres, et un nouveau carnet chaque mois, se
        débloquent avec l&apos;abonnement à {PREMIUM_PRICE_LABEL}, sans engagement.
      </p>
      <PremiumBenefits className="mb-5 space-y-3" />
      <Link
        href={buildAbonnementUrl(returnTo)}
        className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}
      >
        S&apos;abonner · {PREMIUM_PRICE_LABEL}
      </Link>
    </div>
  );
}
