import Link from "next/link";
import { LIEN_L2 } from "@/components/ui/liens";
import { cn } from "@/lib/utils";
import { FaqSection } from "@/components/home/faq-section";
import { FAQ_VENTE } from "@/lib/faqs";
import { CartePremiumAchat } from "@/components/home/carte-premium-achat";
import { MasqueSiPremium } from "@/components/home/masque-si-premium";
import { parcoursEtape1Href } from "@/lib/entrees-parcours";
import { frTypo } from "@/lib/fr-typo";
import { REASSURANCE_UNIQUE } from "@/config/textes/offre";
import { CARTE_PREMIUM } from "@/config/textes/cta-articles-accueil";

/** Lien gratuit (L2) : étape 1 de Répartie, en lecture libre. */
const ETAPE_1_HREF = parcoursEtape1Href("repartie", "accueil");

/**
 * Carte Premium de l'accueil (s21 concision v5, textes-v5-a §4 et §5) : titre, une phrase,
 * un plein payant (`OUVRIR`), la REASS dessous, puis le lien gratuit. Plus d'en-tête de prix,
 * de liste des parcours ni d'avantages (ils vivent sur /abonnement). Visiteur et compte
 * connecté voient la même phrase ; seul le plein change de geste (`CartePremiumAchat`).
 * Composant serveur ; îlots client : le masque abonné et le plein.
 */
export function PremiumCta() {
  return (
    <MasqueSiPremium>
      <section className="py-12 md:py-16" id="offres">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl [text-wrap:balance]">
            {frTypo(CARTE_PREMIUM.titre)}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-text-secondary" data-testid="carte-premium-intro">
            {frTypo(CARTE_PREMIUM.phrase)}
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-6">
          <div className="relative overflow-hidden rounded-2xl border-2 border-accent-primary bg-background-card p-6 shadow-lg shadow-accent-primary/10 max-[399px]:p-5 sm:p-8">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent-primary/5 blur-3xl" />
            <div className="relative">
              <CartePremiumAchat bouton={frTypo(CARTE_PREMIUM.bouton)} />
              <p className="mt-2 text-center text-xs text-text-muted" data-testid="reass">{frTypo(REASSURANCE_UNIQUE)}</p>
              <div className="mt-3 text-center">
                <Link
                  href={ETAPE_1_HREF}
                  data-accueil-cta="etape-1"
                  className={cn(LIEN_L2, "justify-center px-2 text-center [text-wrap:balance]")}
                >
                  {frTypo(CARTE_PREMIUM.contour)}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <FaqSection items={FAQ_VENTE} />
        </div>
      </section>
    </MasqueSiPremium>
  );
}
