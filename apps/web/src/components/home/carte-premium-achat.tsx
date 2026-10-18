"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BOUTON_PRIX_UNE_LIGNE } from "@/components/layout/gabarit";
import { toast } from "@/components/ui/toast";
import { trackUmami } from "@/lib/umami";
import { trackCheckoutEchec, trackCheckoutOuvert } from "@/lib/checkout-tracking";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { readCheckoutConflict, type CheckoutConflict } from "@/lib/checkout-conflict";
import { CheckoutConflictNotice } from "@/components/premium/checkout-conflict-notice";

/** Source de mesure du plein de la carte, visiteur comme compte connecté (QA v2 m-b). */
const ACCUEIL_PREMIUM_SRC = "accueil-premium";
/** s21 (B4 + B5) : plein visiteur vers /abonnement (prix, carnet, garantie avant le compte). */
const ABONNEMENT_HREF = buildAbonnementUrl(null, "monthly", ACCUEIL_PREMIUM_SRC);

/**
 * Plein de la carte Premium de l'accueil (îlot client de `PremiumCta`, s21 QA m3) : seul ce
 * bouton dépend de la session ; le reste de la carte est rendu par le serveur, sans JS.
 * Visiteur : lien vers /abonnement. Compte connecté sans abonnement : paiement direct.
 * `bouton` : libellé `OUVRIR` (`CARTE_PREMIUM.bouton`), le même pour le visiteur et le compte
 * connecté, passé par le serveur (aucun fichier de textes dans le JS client de l'accueil, budget QA m3).
 */
export function CartePremiumAchat({ bouton }: { bouton: string }) {
  const { status } = useSession();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [conflict, setConflict] = useState<CheckoutConflict | null>(null);

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    setConflict(null);
    // s21 (QA v2 m-b) : même nom de source que `checkout-ouvert` et que le bouton visiteur.
    trackUmami("abonnement-clic", { formule: "mensuel", src: ACCUEIL_PREMIUM_SRC, declencheur: "manuel", statut: "membre" });
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        trackCheckoutOuvert(ACCUEIL_PREMIUM_SRC);
        window.location.href = data.url;
        return;
      }
      // Refus 409 (déjà abonné, impayé) : message + lien /profil (audit s16, lot D).
      const conflit = readCheckoutConflict(res.status, await res.json().catch(() => null));
      trackCheckoutEchec(ACCUEIL_PREMIUM_SRC, conflit ? "conflit" : "erreur");
      if (conflit) setConflict(conflit);
      else toast("Le paiement n'a pas pu démarrer. Réessaie dans un instant.", "error");
    } catch {
      trackCheckoutEchec(ACCUEIL_PREMIUM_SRC, "reseau");
      toast("Connexion perdue, réessaie", "error");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <>
      {status === "authenticated" ? (
        <Button variant="primary" size="lg" className={cn("w-full whitespace-normal text-center", BOUTON_PRIX_UNE_LIGNE)} onClick={handleCheckout} disabled={isCheckoutLoading}>
          {isCheckoutLoading ? "On t'emmène au paiement…" : bouton}
        </Button>
      ) : (
        // s21 : plein payant vers /abonnement (prix, carnet, garantie), puis compte et paiement.
        <Link
          href={ABONNEMENT_HREF}
          data-accueil-cta="abonnement"
          className={cn(
            buttonVariants({ variant: "primary", size: "lg" }),
            "w-full whitespace-normal text-center [text-wrap:balance]",
            BOUTON_PRIX_UNE_LIGNE,
          )}
          onClick={() => trackUmami("abonnement-clic", { formule: "mensuel", src: ACCUEIL_PREMIUM_SRC, statut: "visiteur" })}
        >
          {bouton}
        </Link>
      )}
      {conflict && <CheckoutConflictNotice conflict={conflict} className="mt-4" />}
    </>
  );
}
