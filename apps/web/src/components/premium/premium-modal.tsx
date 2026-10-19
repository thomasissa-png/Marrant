"use client";

import { frTypo } from "@/lib/fr-typo";
import { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/modal";
import { Button, buttonVariants } from "@/components/ui/button";
import { buildAbonnementUrl, sanitizeReturnTo } from "@/lib/premium-return";
import { buildRegisterUrl } from "@/lib/auth-links";
import { trackUmami } from "@/lib/umami";
import { cn } from "@/lib/utils";
import { usePremiumCheckout } from "@/hooks/use-premium-checkout";
import { CheckoutConflictNotice } from "@/components/premium/checkout-conflict-notice";
import { avecFavori, type FavoriEnAttente } from "@/lib/favori-apres-paiement";
import { LigneCompte } from "@/components/ui/ligne-compte";
import { phrasesEntieres, TEXTE_COURT_MAX } from "@/lib/texte-court";
import { ESPACE_INSECABLE } from "@/config/premium";
import {
  FENETRE_CHARGEMENT,
  FENETRE_PREMIUM,
  FENETRE_PRIX,
  type FicheType,
  type GesteFenetre,
} from "@/config/textes/cta-pages";
import { Reassurance } from "@/components/ui/reassurance";
import { Chargement } from "@/components/ui/chargement";
import { CORPS_APPEL_MOBILE } from "@/components/layout/gabarit";

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
  /** Début de la vanne, titre du conseil ou de la vidéo (v2 W02) ; absent : rien n'est rendu. */
  apercu?: string;
  /** Élément cliqué (étoile) : mémorisé dans `returnTo`, ajouté aux favoris après le paiement. */
  favori?: FavoriEnAttente;
}

/**
 * W02 : amorce de la vanne (jamais la chute), titre du conseil ou de la vidéo, coupée par la règle
 * unique (`phrasesEntieres`, v3 CT2 : phrases entières jusqu'à ≈ 110 caractères), entre guillemets
 * français à espaces insécables. Vide : rien n'est rendu.
 */
export function apercuFenetre(texte: string | undefined, max = TEXTE_COURT_MAX): string | null {
  const court = phrasesEntieres(texte, max);
  return court ? `«${ESPACE_INSECABLE}${court}${ESPACE_INSECABLE}»` : null;
}

function currentPath(): string | null {
  if (typeof window === "undefined") return null;
  return `${window.location.pathname}${window.location.search}`;
}

/**
 * Fenêtre Premium (textes-trajet-v2 §2.4) : titre, rappel de l'objet cliqué, ligne Premium
 * (favori), prix en gros, plein, ligne compte (visiteur), REASS. Panneau qui monte du bas sur mobile, plein toujours visible dans le pied
 * collant. Visiteur et compte connecté voient la même fenêtre (seul le geste du plein change).
 */
export function PremiumModal({ isOpen, onClose, reason, contenu = "vanne", returnTo, apercu, favori }: PremiumModalProps) {
  const { status } = useSession();
  const t = FENETRE_PREMIUM[GESTE[reason]][contenu];
  const rappel = apercuFenetre(apercu);
  const resolveReturnTo = () => {
    const page = sanitizeReturnTo(returnTo ?? currentPath());
    return page && favori ? avecFavori(page, favori) : page;
  };
  const { startCheckout, isLoading: isCheckoutLoading, conflict } = usePremiumCheckout(`modale-${reason}`);

  // Mur vu (audit s16 reco 17) : une fois par ouverture, avec le geste qui l'a ouvert.
  useEffect(() => {
    if (isOpen) trackUmami("mur-vu", { type: `modale-${reason}`, src: "modale" });
  }, [isOpen, reason]);

  const handleCheckout = () => startCheckout(resolveReturnTo());

  const plein = cn(buttonVariants({ variant: "primary", size: "lg" }), "h-auto min-h-12 w-full whitespace-normal px-4 py-2 text-center [text-wrap:balance]", CORPS_APPEL_MOBILE);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="sm:max-w-lg" labelledBy="premium-modal-title" sheet>
      <div className="max-h-[90dvh] overflow-y-auto rounded-t-2xl border-2 border-b-0 border-accent-primary bg-background-card px-6 pt-6 shadow-lg shadow-accent-primary/10 sm:rounded-2xl sm:border-b-2">
        <h3 id="premium-modal-title" className="pr-10 font-display text-xl font-bold text-text-primary">
          {frTypo(t.titre)}
        </h3>
        {rappel && (
          <p className="mt-2 italic text-text-secondary" data-testid="fenetre-rappel">
            {frTypo(rappel)}
          </p>
        )}
        {t.ligne && <p className="mt-2 text-text-primary">{frTypo(t.ligne)}</p>}
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-4xl font-bold text-text-primary">{FENETRE_PRIX.montant}</span>
          <span className="text-text-muted">{FENETRE_PRIX.suffixe}</span>
        </div>

        {conflict && <CheckoutConflictNotice conflict={conflict} className="mt-4" onNavigate={onClose} />}

        {/* Pied collant : le plein est toujours visible sans défiler (spec B11). */}
        <div className="sticky bottom-0 -mx-6 mt-5 bg-background-card px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3">
          {status === "authenticated" ? (
            <Button variant="primary" size="lg" className={cn(plein, "disabled:opacity-100")} onClick={handleCheckout} disabled={isCheckoutLoading}>
              {isCheckoutLoading ? <Chargement texte={FENETRE_CHARGEMENT} /> : t.bouton}
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
          {status !== "authenticated" && <LigneCompte />}
          <Reassurance />
        </div>
      </div>
    </Modal>
  );
}
