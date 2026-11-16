import { cn } from "@/lib/utils";
import { BadgePremium } from "@/components/espace/apercu/badge-premium";

/**
 * Enveloppe d'un bloc de l'extrait fermé (refonte s25, spec design §3.4 et UX §2.2 règle 3) : le bloc réel garde son
 * cadre (le prospect reconnaît le futur produit, Z1 garde son dégradé et son filet), son CONTENU est atténué
 * (`opacity-75` sur les enfants du cadre, jamais sous 3:1), et la pastille « Premium » est posée en haut à droite,
 * hors du contenu atténué, à pleine opacité. Ni flou, ni gros cadenas : la pastille et l'atténuation disent « fermé ».
 */
export function TuileFermee({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative h-full min-w-0 [&>*:not([data-badge-premium])>*]:opacity-75", className)} data-tuile-fermee>
      <BadgePremium coin />
      {children}
    </div>
  );
}
