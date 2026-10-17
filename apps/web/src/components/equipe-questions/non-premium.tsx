import Link from "next/link";
import { TEXTES_EQUIPE_ETATS as E, TEXTES_EQUIPE_PAGE as T } from "@/config/textes/equipe-questions";

/** Compte sans Premium (ou abonnement terminé) : aucun historique affiché. */
export function NonPremium() {
  return (
    <div className="mx-auto max-w-2xl py-12 text-center">
      <h1 className="font-display text-3xl font-bold text-text-primary">{T.titre}</h1>
      <p className="mt-3 text-text-secondary">{E.nonPremium}</p>
      <Link href="/abonnement" className="mt-4 inline-block text-accent-link hover:underline">
        {E.lienAbonnement}
      </Link>
    </div>
  );
}
