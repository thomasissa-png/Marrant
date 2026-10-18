"use client";

import { frTypo } from "@/lib/fr-typo";
import { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/modal";
import { Button, buttonVariants } from "@/components/ui/button";
import { buildAbonnementUrl, sanitizeReturnTo } from "@/lib/premium-return";
import { parcoursEtape1Href, type ParcoursSlug } from "@/lib/entrees-parcours";
import { buildRegisterUrl } from "@/lib/auth-links";
import { trackUmami } from "@/lib/umami";
import { cn } from "@/lib/utils";
import { usePremiumCheckout } from "@/hooks/use-premium-checkout";
import { CheckoutConflictNotice } from "@/components/premium/checkout-conflict-notice";
import {
  FENETRE_CHARGEMENT,
  FENETRE_GARANTIE,
  FENETRE_PREMIUM,
  FENETRE_PRIX,
  fenetreLienEtape1,
  MUR_PARCOURS,
  type FicheType,
  type GesteFenetre,
} from "@/config/textes/cta-pages";

/** Geste qui a ouvert la fenêtre : le titre, l'intro et le bouton en dépendent (B11). */
export type PremiumModalReason = "favoris" | "vote" | "carte";

const GESTE: Record<PremiumModalReason, GesteFenetre> = { favoris: "favori", vote: "vote", carte: "carte" };

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: PremiumModalReason;
  /** Objet du geste (vanne, conseil, vidéo) : accorde le titre et les filtres. */
  contenu?: FicheType;
  /** Page à retrouver après paiement (chemin interne) ; par défaut la page courante. */
  returnTo?: string;
  /** Parcours du lien vers l'étape 1 gratuite ([S28]). */
  parcours?: ParcoursSlug;
}

function currentPath(): string | null {
  if (typeof window === "undefined") return null;
  return `${window.location.pathname}${window.location.search}`;
}

/**
 * Fenêtre Premium (B11, chaud) : panneau qui monte du bas sur mobile, plein
 * toujours visible dans le pied collant, une seule ligne de garantie (choix
 * de Thomas du 18/10 : pas de mentions juridiques dans les blocs d'appel).
 */
export function PremiumModal({ isOpen, onClose, reason, contenu = "vanne", returnTo, parcours = MUR_PARCOURS }: PremiumModalProps) {
  const { status } = useSession();
  const t = FENETRE_PREMIUM[GESTE[reason]][contenu];
  const resolveReturnTo = () => sanitizeReturnTo(returnTo ?? currentPath());
  const { startCheckout, isLoading: isCheckoutLoading, conflict } = usePremiumCheckout(`modale-${reason}`);

  // Mur vu (audit s16 reco 17) : une fois par ouverture, avec le geste qui l'a ouvert.
  useEffect(() => {
    if (isOpen) trackUmami("mur-vu", { type: `modale-${reason}`, src: "modale" });
  }, [isOpen, reason]);

  const handleCheckout = () => startCheckout(resolveReturnTo());

  const plein = cn(buttonVariants({ variant: "primary", size: "lg" }), "h-auto min-h-12 w-full whitespace-normal px-4 py-2 text-center [text-wrap:balance]");

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="sm:max-w-lg" labelledBy="premium-modal-title" sheet>
      <div className="max-h-[90dvh] overflow-y-auto rounded-t-2xl border-2 border-b-0 border-accent-primary bg-background-card px-6 pt-6 shadow-lg shadow-accent-primary/10 sm:rounded-2xl sm:border-b-2">
        <h3 id="premium-modal-title" className="pr-10 font-display text-xl font-bold text-text-primary">
          {t.titre}
        </h3>
        {/* s21 (QA v3 m-2) : « Deux étapes… » pour le visiteur seulement ; le compte connecté va droit au paiement. */}
        <p className="mt-2 text-sm text-text-secondary">{frTypo(status === "authenticated" ? t.introCompte : t.intro)}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-4xl font-bold text-text-primary">{FENETRE_PRIX.montant}</span>
          <span className="text-text-muted">{FENETRE_PRIX.suffixe}</span>
        </div>
        <p className="mt-2 text-sm text-text-secondary">{frTypo(t.avantage)}</p>

        {conflict && <CheckoutConflictNotice conflict={conflict} className="mt-4" onNavigate={onClose} />}

        {/* Pied collant : le plein est toujours visible sans défiler (spec B11). */}
        <div className="sticky bottom-0 -mx-6 mt-5 bg-background-card px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          {status === "authenticated" ? (
            <Button variant="primary" size="lg" className={plein} onClick={handleCheckout} disabled={isCheckoutLoading}>
              {isCheckoutLoading ? FENETRE_CHARGEMENT : t.bouton}
            </Button>
          ) : (
            <Link
              href={buildRegisterUrl({
                // s21 (QA M1) : la source suit jusqu'au paiement (checkout-ouvert {src: modale-…}).
                callbackUrl: buildAbonnementUrl(resolveReturnTo(), "monthly", `modale-${reason}`),
                src: `modale-${reason}`,
              })}
              className={plein}
              onClick={() => {
                trackUmami("abonnement-clic", { formule: "mensuel", src: `modale-${reason}`, statut: "visiteur" });
                onClose();
              }}
            >
              {t.bouton}
            </Link>
          )}
          {/* s21 (revue design P3-9) : 4 px entre le plein et le lien L2. */}
          <div className="mt-1 text-center">
            <Link
              href={parcoursEtape1Href(parcours, "abonnement")}
              className="inline-flex min-h-11 items-center text-sm text-accent-link underline underline-offset-2"
              onClick={onClose}
            >
              {fenetreLienEtape1(parcours)}
            </Link>
          </div>
          <p className="text-center text-xs text-text-muted">{FENETRE_GARANTIE}</p>
        </div>
      </div>
    </Modal>
  );
}
