import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TEXTES_RESILIATION as T } from "@/config/textes/resiliation";

/** Bouton secondaire de la page : bordure visible (#707070, design O3), sans toucher la variante globale. */
export const CLASSE_BOUTON_SECONDAIRE = cn(buttonVariants({ variant: "outline", size: "lg" }), "border-border-input w-full sm:w-auto");

/**
 * Abonnement passé par Apple (C6, UX O5) : à la place du formulaire, jamais de « Confirmer la
 * résiliation » (il bouclerait). Même carte que « Rien à résilier ici. ».
 */
export function CarteAppStore() {
  return (
    <Card className="p-5 hover:border-border md:p-6" data-testid="resiliation-app-store">
      <p className="text-text-primary">{T.appStore}</p>
      <Link href="/" className={cn(CLASSE_BOUTON_SECONDAIRE, "mt-4")}>
        {T.retourAccueil}
      </Link>
    </Card>
  );
}
