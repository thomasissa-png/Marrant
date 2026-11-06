import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TEXTES_RESILIATION as T } from "@/config/textes/resiliation";

/** Bouton secondaire de la page : bordure visible (#707070, design O3), sans toucher la variante globale. */
export const CLASSE_BOUTON_SECONDAIRE = cn(buttonVariants({ variant: "outline", size: "lg" }), "border-border-input w-full sm:w-auto");

/**
 * Design O5 : hauteur minimale du contenu des pages /resiliation et /resiliation/confirmee, pour que
 * le pied de page touche le bas du viewport sur les états courts (« Rien à résilier ici. », App Store).
 * Valeur = 100dvh moins en-tête (65 px), marges de `main` (2 x 32 px) et pied de page, mesurés en
 * local (s23) : pied 478 px dès 1024 px, 668 px à 768 px. Sous 768 px, le pied (> 740 px) remplit déjà
 * l'écran. Correctif local : le layout partagé `(dashboard)/layout.tsx` n'est pas modifié.
 */
export const HAUTEUR_MIN_PAGE = "md:min-h-[calc(100dvh-797px)] lg:min-h-[calc(100dvh-607px)]";

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
