import type { DonneesResiliation } from "@/lib/resiliation";
import type { RecapContratProps } from "@/components/resiliation/recap-contrat";
import { dateLongue } from "@/config/textes/paiement";
import { nomFormule, prixFormule } from "@/config/textes/resiliation-emails";
import { TEXTES_RESILIATION as T } from "@/config/textes/resiliation";

/** Date longue de Paris (« 1er décembre 2026 ») depuis l'ISO lu en base ou chez Stripe ; null si invalide. */
export function dateFinLisible(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : dateLongue(d);
}

/** Données lues (serveur) → textes du récapitulatif. Aucune valeur écrite en dur. */
export function propsRecap(d: DonneesResiliation, badge: RecapContratProps["badge"]): Omit<RecapContratProps, "effets" | "className"> {
  const prix = prixFormule(d.formule, d.priceCents);
  return {
    compte: d.prenom ? `${d.prenom}, ${d.email}` : d.email,
    formule: nomFormule(d.formule),
    prix,
    dateFin: dateFinLisible(d.dateFin),
    renouvellement: d.formule === "annual" && prix ? T.renouvellementAnnuel(prix) : null,
    badge,
    offert: d.sansAbonnementStripe ?? false,
    impaye: d.impaye ?? false,
  };
}
