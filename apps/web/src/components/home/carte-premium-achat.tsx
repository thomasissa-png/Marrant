"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import { trackUmami } from "@/lib/umami";
import { trackCheckoutEchec, trackCheckoutOuvert } from "@/lib/checkout-tracking";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { PREMIUM_PRICE_LABEL } from "@/config/premium";
import { readCheckoutConflict, type CheckoutConflict } from "@/lib/checkout-conflict";
import { CheckoutConflictNotice } from "@/components/premium/checkout-conflict-notice";

/** s21 (B4 + B5) : plein visiteur vers /abonnement (prix, carnet, garantie avant le compte). */
const ABONNEMENT_HREF = buildAbonnementUrl(null, "monthly", "accueil-premium");

/**
 * Plein de la carte Premium de l'accueil (îlot client de `PremiumCta`, s21 QA m3) : seul ce
 * bouton dépend de la session ; le reste de la carte est rendu par le serveur, sans JS.
 * Visiteur : lien vers /abonnement. Compte connecté sans abonnement : paiement direct.
 * `boutonVisiteur` : libellé validé (`CARTE_PREMIUM.bouton`), passé tel quel par le serveur.
 */
export function CartePremiumAchat({ boutonVisiteur }: { boutonVisiteur: string }) {
  const { status } = useSession();
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

  return (
    <>
      {status === "authenticated" ? (
        <Button variant="primary" size="lg" className="mt-8 w-full" onClick={handleCheckout} disabled={isCheckoutLoading}>
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
          onClick={() => trackUmami("abonnement-clic", { formule: "mensuel", src: "accueil-premium", statut: "visiteur" })}
        >
          {boutonVisiteur}
        </Link>
      )}
      {conflict && <CheckoutConflictNotice conflict={conflict} className="mt-4" />}
    </>
  );
}
