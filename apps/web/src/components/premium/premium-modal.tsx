"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { AuthModal } from "@/components/auth/auth-modal";
import { PremiumBenefits } from "@/components/premium/premium-benefits";
import { buildAbonnementUrl, sanitizeReturnTo } from "@/lib/premium-return";
import { PARCOURS_COUNT } from "@/config/premium";

/** Geste qui a ouvert la modale : le titre et l'accroche en dépendent (audit tunnel R5). */
export type PremiumModalReason = "favoris" | "defaut";

const COPY: Record<PremiumModalReason, { title: string; intro: string | null }> = {
  favoris: {
    title: "Les favoris font partie de Premium",
    intro:
      `Garder une vanne, un conseil ou une vidéo sous la main, c'est réservé à l'accès complet. Avec lui, tu as aussi les ${PARCOURS_COUNT} parcours en entier.`,
  },
  defaut: { title: "Passe à l'accès complet", intro: null },
};

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: PremiumModalReason;
  /** Page à retrouver après paiement (chemin interne) ; par défaut la page courante. */
  returnTo?: string;
}

function currentPath(): string | null {
  if (typeof window === "undefined") return null;
  return `${window.location.pathname}${window.location.search}`;
}

export function PremiumModal({ isOpen, onClose, reason = "defaut", returnTo }: PremiumModalProps) {
  const { status } = useSession();
  const copy = COPY[reason];
  const resolveReturnTo = () => sanitizeReturnTo(returnTo ?? currentPath());
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const target = resolveReturnTo();
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(target ? { returnTo: target } : {}),
      });
      if (res.ok) {
        const data = await res.json();
        window.location.href = data.url;
      } else {
        toast("Le paiement n'a pas pu démarrer. Réessaie dans un instant.", "error");
      }
    } catch {
      toast("Connexion perdue, réessaie", "error");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg" labelledBy="premium-modal-title">
      <div className="rounded-2xl border-2 border-accent-primary bg-background-card p-6 shadow-lg shadow-accent-primary/10">
        <h3 id="premium-modal-title" className="font-display text-xl font-bold text-text-primary">
          {copy.title}
        </h3>
        {copy.intro && (
          <p className="mt-2 text-sm text-text-secondary">{copy.intro}</p>
        )}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-4xl font-bold text-text-primary">2,99 €</span>
          <span className="text-text-muted">/ mois</span>
        </div>
        <p className="mt-1 text-sm text-accent-link font-medium">
          Sans engagement, annulable à tout moment
        </p>

        <PremiumBenefits className="mt-5 space-y-2.5" />

        {status === "authenticated" ? (
          <Button
            variant="primary"
            size="lg"
            className="mt-6 w-full"
            onClick={handleCheckout}
            disabled={isCheckoutLoading}
          >
            {isCheckoutLoading ? "On t'emmène au paiement…" : "Active mon accès · 2,99 €/mois"}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            className="mt-6 w-full"
            onClick={() => {
              onClose();
              setIsAuthModalOpen(true);
            }}
          >
            Cr&eacute;er un compte pour commencer
          </Button>
        )}

        <p className="mt-3 text-center text-xs text-text-muted">
          Droit de{" "}
          <Link
            href="/retractation"
            className="underline hover:text-text-secondary"
            onClick={onClose}
          >
            rétractation
          </Link>
        </p>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="register"
        callbackUrl={buildAbonnementUrl(resolveReturnTo())}
      />
    </Modal>
  );
}
