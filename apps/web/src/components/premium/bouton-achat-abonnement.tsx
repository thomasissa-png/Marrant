"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { BOUTON_PRIX_UNE_LIGNE } from "@/components/layout/gabarit";
import { ABONNEMENT_ACHAT } from "@/config/textes/abonnement-vente";
import type { PremiumPlan } from "@/config/premium";
import { frTypo } from "@/lib/fr-typo";
import { Chargement } from "@/components/ui/chargement";
import { cn } from "@/lib/utils";

/** Où le bouton est posé sur /abonnement (mesure `abonnement-clic`). */
export type EmplacementAchat = "haut" | "bas" | "barre";

/**
 * Bouton d'achat de /abonnement, le même aux trois endroits (B2, B6, barre collante) : même
 * libellé, même formule. Visiteur : vrai lien vers /register (HTML serveur, marche sans JS).
 * Compte connecté : bouton qui ouvre Stripe. « S'abonner · 1,99 €/mois » tient sur une ligne à 375 px.
 */
export function BoutonAchatAbonnement({
  id,
  plan,
  connecte,
  inscriptionHref,
  chargement,
  onCheckout,
  onClicVisiteur,
  emplacement,
  className,
}: {
  id?: string;
  plan: PremiumPlan;
  connecte: boolean;
  inscriptionHref: string;
  chargement: boolean;
  onCheckout: (emplacement: EmplacementAchat) => void;
  onClicVisiteur: (emplacement: EmplacementAchat) => void;
  emplacement: EmplacementAchat;
  className?: string;
}) {
  const classes = cn("w-full whitespace-normal text-center", BOUTON_PRIX_UNE_LIGNE, className);
  if (connecte) {
    return (
      <Button
        id={id}
        variant="primary"
        size="lg"
        className={cn(classes, chargement && "disabled:opacity-100")}
        onClick={() => onCheckout(emplacement)}
        disabled={chargement}
        data-testid={`abonnement-bouton-${emplacement}`}
      >
        {chargement ? <Chargement texte={ABONNEMENT_ACHAT.chargement} /> : frTypo(ABONNEMENT_ACHAT.bouton(plan))}
      </Button>
    );
  }
  return (
    <Link
      id={id}
      href={inscriptionHref}
      data-testid={emplacement === "haut" ? "abonnement-bouton-achat" : `abonnement-bouton-${emplacement}`}
      className={cn(buttonVariants({ variant: "primary", size: "lg" }), classes)}
      onClick={() => onClicVisiteur(emplacement)}
    >
      {frTypo(ABONNEMENT_ACHAT.bouton(plan))}
    </Link>
  );
}
