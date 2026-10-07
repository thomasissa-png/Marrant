import Link from "next/link";
import { cn } from "@/lib/utils";
import { TEXTES_CHECKOUT } from "@/config/textes/paiement";
import type { CheckoutConflict } from "@/lib/checkout-conflict";

/**
 * Refus 409 du paiement (déjà abonné ou paiement en retard) : message du
 * serveur + lien vers /profil, à la place d'un toast générique (audit s16, lot D).
 */
export function CheckoutConflictNotice({
  conflict,
  className,
  onNavigate,
}: {
  conflict: CheckoutConflict;
  className?: string;
  /** Ex. fermer la modale au clic sur le lien. */
  onNavigate?: () => void;
}) {
  return (
    <div
      role="alert"
      data-testid="checkout-conflit"
      data-code={conflict.code}
      className={cn("rounded-xl border border-border bg-background-elevated p-4 text-sm text-text-primary", className)}
    >
      <p>{conflict.message}</p>
      <Link href="/profil" onClick={onNavigate} className="mt-2 inline-block font-semibold text-accent-link underline">
        {TEXTES_CHECKOUT.lienProfil}
      </Link>
    </div>
  );
}
