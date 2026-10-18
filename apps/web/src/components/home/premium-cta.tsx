import Link from "next/link";
import { LIEN_L2 } from "@/components/ui/liens";
import { cn } from "@/lib/utils";
import { AvantagesPremium } from "@/components/premium/avantages-premium";
import { FaqSection } from "@/components/home/faq-section";
import { CartePremiumAchat } from "@/components/home/carte-premium-achat";
import { MasqueSiConnecte, MasqueSiPremium } from "@/components/home/masque-si-premium";
import { parcoursEtape1Href } from "@/lib/entrees-parcours";
import { frTypo } from "@/lib/fr-typo";
import { formatEuros, PREMIUM_MONTHLY_PRICE_CENTS } from "@/config/premium";
import { OFFRE_NOM } from "@/config/textes/offre";
import { CARTE_PREMIUM } from "@/config/textes/cta-articles-accueil";

/** Lien gratuit (L2 depuis s21 concision) : étape 1 de Répartie, en lecture libre. */
const ETAPE_1_HREF = parcoursEtape1Href("repartie", "accueil");

interface PremiumCtaProps {
  /** `isAnnualPlanAvailable()` lu côté serveur (page d'accueil) : annuel dans [S12] seulement s'il existe. */
  annuelDisponible?: boolean;
}

/**
 * Carte Premium de l'accueil (s21, B4 + B5, spec cta-forme-place §3.2) : le bloc « Tu crois
 * avoir tout essayé » y est fusionné (et supprimé). Température tiède : plein Premium, puis
 * lien texte vers l'étape 1 de Répartie (s21 concision : un seul plein par bloc), dans le même écran. Textes : cta-articles-accueil.ts.
 * s21 (QA m3, budget JS) : composant serveur ; textes, liste et FAQ rendus sans JS. Îlots
 * client : le masque abonné (`MasqueSiPremium`), le plein (`CartePremiumAchat`), les avantages.
 */
export function PremiumCta({ annuelDisponible = false }: PremiumCtaProps) {
  return (
    <MasqueSiPremium>
      <section className="py-12 md:py-16" id="offres">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl [text-wrap:balance]">
            {frTypo(CARTE_PREMIUM.titre)}
          </h2>
          {/* [S11] en trois blocs : scène, intro + liste des parcours publiés (`<ul>`), ouverture. */}
          <div className="mx-auto mt-3 max-w-xl space-y-3 text-lg text-text-secondary" data-testid="carte-premium-intro">
            <p>{frTypo(CARTE_PREMIUM.intro.scene)}</p>
            <div>
              <p>{frTypo(CARTE_PREMIUM.intro.listeIntro)}</p>
              {/* s21 (revue design P2-7) : liste alignée à gauche dans une colonne centrée, nom du parcours en gras. */}
              <ul className="mx-auto mt-2 max-w-md space-y-1 text-left text-base">
                {CARTE_PREMIUM.intro.listeParties.map(({ nom, suite }) => (
                  <li key={nom}>
                    <strong className="font-semibold text-text-primary">{nom}</strong> {frTypo(suite)}
                  </li>
                ))}
              </ul>
            </div>
            <p>{frTypo(CARTE_PREMIUM.intro.fin)}</p>
          </div>
        </div>


        <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-6">
          {/* Offre : Premium (nom unique de l'offre, D4 audit s16) */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-accent-primary bg-background-card p-6 shadow-lg shadow-accent-primary/10 sm:p-8">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent-primary/5 blur-3xl" />
            <div className="relative">
              {/* Badge « Populaire » retiré : offre payante unique (reco validée par Thomas) */}
              <h3 className="font-display text-lg font-bold text-text-primary">{OFFRE_NOM}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold text-text-primary">
                  {formatEuros(PREMIUM_MONTHLY_PRICE_CENTS)}
                </span>
                <span className="text-text-muted">{CARTE_PREMIUM.prixUnite}</span>
              </div>
              <p className="mt-1 text-xs text-text-muted">{frTypo(CARTE_PREMIUM.ligneTarif(annuelDisponible))}</p>

              <AvantagesPremium className="mt-6 space-y-3" />

              <CartePremiumAchat
                boutonVisiteur={frTypo(CARTE_PREMIUM.bouton)}
                connecte={{ ligne: frTypo(CARTE_PREMIUM.connecte.ligne), bouton: frTypo(CARTE_PREMIUM.connecte.bouton) }}
              />
              {/* s21 concision (18/10) : un seul bouton plein par bloc, le gratuit devient un lien texte (L2). */}
              <div className="mt-2 text-center">
                <Link
                  href={ETAPE_1_HREF}
                  data-accueil-cta="etape-1"
                  className={cn(LIEN_L2, "justify-center px-2 text-center [text-wrap:balance]")}
                >
                  {frTypo(CARTE_PREMIUM.contour)}
                </Link>
              </div>
              <p className="mt-3 text-center text-xs text-text-muted">{frTypo(CARTE_PREMIUM.reassurance)}</p>
              {/* Social proof : chiffre fixe validé fondateur 29/09/2026 ; remonté sous le CTA (T09).
                  s21 (QA v2 m-c) : visiteur seulement, la ligne invite à s'inscrire. */}
              <MasqueSiConnecte>
                <p className="mt-3 text-center text-sm text-text-secondary" data-testid="carte-premium-inscrits">
                  {frTypo(CARTE_PREMIUM.inscrits)}
                </p>
              </MasqueSiConnecte>
            </div>
          </div>

          {/* Offre coaching à 99 € retirée (décision Thomas, 13/10/2026, audit des pages s20). */}
        </div>


        {/* FAQ */}
        <div className="mt-16">
          <FaqSection />
        </div>
      </section>
    </MasqueSiPremium>
  );
}
