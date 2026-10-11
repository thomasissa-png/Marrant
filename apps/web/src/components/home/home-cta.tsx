"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useContentStats } from "@/hooks/use-content-stats";
import { buildRegisterUrl } from "@/lib/auth-links";
import { trackUmami } from "@/lib/umami";
import { formatEuros, PREMIUM_MONTHLY_PRICE_CENTS, PREMIUM_PRICE_LABEL } from "@/config/premium";

export function HomeCta() {
  const { status } = useSession();
  const stats = useContentStats();

  if (status === "authenticated") return null;

  const jokesLabel = stats.jokes > 0 ? `${stats.jokes}+` : "Des";
  const tipsLabel = stats.tips > 0 ? `${stats.tips}+` : "des dizaines de";
  const videosLabel = stats.videos > 0 ? `${stats.videos}+` : "des";

  return (
    <section className="py-12 text-center md:py-16">
      <div className="mx-auto max-w-2xl rounded-2xl border border-accent-primary/20 bg-accent-primary/5 p-6 sm:p-8">
        <h2 className="font-display text-2xl font-bold text-text-primary">
          Tu crois avoir tout essayé pour être drôle ?
        </h2>
        <p className="mt-2 text-text-secondary">
          {jokesLabel} vannes, {tipsLabel} conseils de pros et {videosLabel} vidéos analysées, le tout pour {formatEuros(PREMIUM_MONTHLY_PRICE_CENTS)} par mois, sans engagement. La seule chose que tu n&apos;as pas encore essayée pour être plus drôle.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:items-start">
          {/* Étalon 1.2 validé par Thomas (s15) : le parcours d'abord, le prix en note */}
          <div className="flex w-full flex-col items-center gap-1 sm:w-auto">
            <Link
              href={buildRegisterUrl({ src: "accueil-cta" })}
              className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full sm:w-auto")}
              onClick={() => trackUmami("abonnement-clic", { formule: "mensuel", src: "accueil-cta", statut: "visiteur" })}
            >
              Accéder aux parcours complets
            </Link>
            <p className="max-w-[16rem] text-balance text-sm text-text-muted">{PREMIUM_PRICE_LABEL}, sans engagement.</p>
          </div>
          <Link
            href="/vannes"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full whitespace-nowrap sm:w-auto")}
          >
            Voir les vannes gratuites
          </Link>
        </div>
      </div>
    </section>
  );
}
