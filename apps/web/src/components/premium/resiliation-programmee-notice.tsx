import Link from "next/link";
import { cn } from "@/lib/utils";
import { dateLongue } from "@/config/textes/compte";
import { RESILIATION_PROGRAMMEE } from "@/config/textes/offre";
import { TEXTES_CHECKOUT } from "@/config/textes/paiement";

/**
 * /abonnement pour un abonné dont la résiliation est programmée (s16 lot F) :
 * Premium court encore, la réactivation se fait depuis le profil. Remplace le
 * bouton de paiement (aucun checkout lancé, le serveur répondrait 409).
 */
export function ResiliationProgrammeeNotice({ finIso, className }: { finIso: string | null; className?: string }) {
  return (
    <div
      role="status"
      data-testid="resiliation-programmee"
      className={cn("rounded-xl border border-border bg-background-elevated p-4 text-sm text-text-primary", className)}
    >
      <p>{RESILIATION_PROGRAMMEE.texte(finIso ? dateLongue(finIso) : null)}</p>
      <Link href="/profil" className="mt-2 inline-block font-semibold text-accent-link underline">
        {TEXTES_CHECKOUT.lienProfil}
      </Link>
    </div>
  );
}
