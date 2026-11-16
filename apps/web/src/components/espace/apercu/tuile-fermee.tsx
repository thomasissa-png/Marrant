import { cn } from "@/lib/utils";
import { VerrouSeul } from "@/components/espace/apercu/badge-premium";

/**
 * Enveloppe d'un bloc de l'extrait fermé (refonte s25, spec design §3.4 et UX §2.2 règle 3) : le bloc réel garde son
 * cadre (le prospect reconnaît le futur produit ; v7 tour 7 : sans filet violet, cadre neutre comme sur la page de
 * l'abonné), son CONTENU est atténué (`opacity-75` sur les
 * enfants du cadre, jamais sous 4,5:1 pour le texte secondaire), et un verrou seul est posé en haut à droite, hors du
 * contenu atténué. Échelle s25 (arbitrage du 16/11) : plus de pastille « Premium » par bloc (une seule, celle du
 * hero) ; le verrou sans mot dit encore « fermé » dans chaque bloc, sans le bruit de 5 pastilles.
 */
export function TuileFermee({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative h-full min-w-0 [&>*:not([data-verrou-ferme])>*]:opacity-75", className)} data-tuile-fermee>
      <VerrouSeul />
      {children}
    </div>
  );
}
