"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/stores/user-store";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { PremiumBenefits } from "@/components/premium/premium-benefits";
import { FaqSection } from "@/components/home/faq-section";
import { trackUmami } from "@/lib/umami";
import { trackCheckoutEchec, trackCheckoutOuvert } from "@/lib/checkout-tracking";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { parcoursEtape1Href } from "@/lib/entrees-parcours";
import { frTypo } from "@/lib/fr-typo";
import { formatEuros, PREMIUM_MONTHLY_PRICE_CENTS, PREMIUM_PRICE_LABEL } from "@/config/premium";
import { OFFRE_NOM } from "@/config/textes/offre";
import { CARTE_PREMIUM } from "@/config/textes/cta-articles-accueil";
import { readCheckoutConflict, type CheckoutConflict } from "@/lib/checkout-conflict";
import { CheckoutConflictNotice } from "@/components/premium/checkout-conflict-notice";

/** s21 (B4 + B5) : plein visiteur vers /abonnement (prix, carnet, garantie avant le compte). */
const ABONNEMENT_HREF = buildAbonnementUrl(null, "monthly", "accueil-premium");
/** Contour : étape 1 de Répartie, en lecture libre (remplace « Voir les vannes gratuites »). */
const ETAPE_1_HREF = parcoursEtape1Href("repartie", "accueil");

interface PremiumCtaProps {
  /** `isAnnualPlanAvailable()` lu côté serveur (page d'accueil) : annuel dans [S12] seulement s'il existe. */
  annuelDisponible?: boolean;
}

/**
 * Carte Premium de l'accueil (s21, B4 + B5, spec cta-forme-place §3.2) : le bloc « Tu crois
 * avoir tout essayé » y est fusionné (et supprimé). Température tiède : plein Premium, puis
 * contour vers l'étape 1 de Répartie, dans le même écran. Textes : cta-articles-accueil.ts.
 */
export function PremiumCta({ annuelDisponible = false }: PremiumCtaProps) {
  const { status } = useSession();
  const user = useUserStore((s) => s.user);

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [conflict, setConflict] = useState<CheckoutConflict | null>(null);

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    setConflict(null);
    trackUmami("abonnement-clic", { formule: "mensuel", src: "accueil", declencheur: "manuel", statut: "membre" });
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        trackCheckoutOuvert("accueil-premium");
        window.location.href = data.url;
        return;
      }
      // Refus 409 (déjà abonné, impayé) : message + lien /profil (audit s16, lot D).
      const conflit = readCheckoutConflict(res.status, await res.json().catch(() => null));
      trackCheckoutEchec("accueil-premium", conflit ? "conflit" : "erreur");
      if (conflit) setConflict(conflit);
      else toast("Le paiement n'a pas pu démarrer. Réessaie dans un instant.", "error");
    } catch {
      trackCheckoutEchec("accueil-premium", "reseau");
      toast("Connexion perdue, réessaie", "error");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  // Ne pas afficher si déjà premium
  if (user?.plan === "PREMIUM") return null;

  return (
    <section className="py-12 md:py-16" id="offres">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl [text-wrap:balance]">
          {frTypo(CARTE_PREMIUM.titre)}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-text-secondary">{frTypo(CARTE_PREMIUM.intro)}</p>
      </div>


      <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-6">
        {/* Offre : Premium (nom unique de l'offre, D4 audit s16) */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-accent-primary bg-background-card p-6 shadow-lg shadow-accent-primary/10 sm:p-8">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent-primary/5 blur-3xl" />
          <div className="relative">
            {/* Badge « Populaire » retiré : offre payante unique (reco validée par Thomas) */}
            <h3 className="font-display text-lg font-bold text-text-primary">{OFFRE_NOM}</h3>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold text-text-primary">
                {formatEuros(PREMIUM_MONTHLY_PRICE_CENTS)}
              </span>
              <span className="text-text-muted">{CARTE_PREMIUM.prixUnite}</span>
            </div>
            <p className="mt-1 text-xs text-text-muted">{frTypo(CARTE_PREMIUM.ligneTarif(annuelDisponible))}</p>

            <PremiumBenefits className="mt-6 space-y-3" />

            {status === "authenticated" ? (
              <Button
                variant="primary"
                size="lg"
                className="mt-8 w-full"
                onClick={handleCheckout}
                disabled={isCheckoutLoading}
              >
                {isCheckoutLoading ? "On t'emmène au paiement…" : `Active mon accès · ${PREMIUM_PRICE_LABEL}`}
              </Button>
            ) : (
              // s21 : plein payant vers /abonnement (prix, carnet, garantie), puis compte et paiement.
              <Link
                href={ABONNEMENT_HREF}
                data-accueil-cta="abonnement"
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "mt-8 h-auto min-h-12 w-full whitespace-normal px-4 py-2 text-center [text-wrap:balance]",
                )}
                onClick={() =>
                  trackUmami("abonnement-clic", { formule: "mensuel", src: "accueil-premium", statut: "visiteur" })
                }
              >
                {frTypo(CARTE_PREMIUM.bouton)}
              </Link>
            )}
            {conflict && <CheckoutConflictNotice conflict={conflict} className="mt-4" />}
            <Link
              href={ETAPE_1_HREF}
              data-accueil-cta="etape-1"
              className={cn(
                buttonVariants({ variant: "outline-accent", size: "lg" }),
                "mt-3 h-auto min-h-12 w-full whitespace-normal px-4 py-2 text-center [text-wrap:balance]",
              )}
            >
              {frTypo(CARTE_PREMIUM.contour)}
            </Link>
            <p className="mt-3 text-center text-xs text-text-muted">{frTypo(CARTE_PREMIUM.reassurance)}</p>
            {/* Social proof : chiffre fixe validé fondateur 29/09/2026 ; remonté sous le CTA (T09) */}
            <p className="mt-3 text-center text-sm text-text-secondary">{frTypo(CARTE_PREMIUM.inscrits)}</p>
          </div>
        </div>

        {/* Offre coaching à 99 € retirée (décision Thomas, 13/10/2026, audit des pages s20). */}
      </div>


      {/* FAQ */}
      <div className="mt-16">
        <FaqSection />
      </div>
    </section>
  );
}
