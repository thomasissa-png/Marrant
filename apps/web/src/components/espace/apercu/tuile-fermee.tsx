import { cn } from "@/lib/utils";
import { VerrouSeul } from "@/components/espace/apercu/badge-premium";

/**
 * Enveloppe d'un bloc de l'extrait fermé (refonte s25, spec design §3.4 et UX §2.2 règle 3) : le bloc réel garde son
 * cadre (le prospect reconnaît le futur produit ; v7 tour 7 : sans filet violet, cadre neutre comme sur la page de
 * l'abonné), son CONTENU est atténué (`opacity-75` sur les
 * enfants du cadre, jamais sous 4,5:1 pour le texte secondaire), et un verrou seul est posé en haut à droite, hors du
 * contenu atténué. Échelle s25 (arbitrage du 16/11) : plus de pastille « Premium » par bloc (une seule, celle du
 * hero) ; le verrou sans mot dit encore « fermé » dans chaque bloc, sans le bruit de 5 pastilles.
 * v7 tour 11 (relectures du tour 10 : extrait « entièrement grisé ») : `nette` (Z1 « Ton premier pas », la vitrine)
 * garde son contenu à pleine netteté, sans atténuation ; le verrou reste, son bouton reste un contour éteint.
 * s26 liste et détail, tour 4 : `data-survol` (posé par `SignalOffre`, aperçu de Quoi répondre) éclaircit le bord du
 * cadre, comme le survol d'une carte cliquable ; ailleurs, jamais posé.
 */
export function TuileFermee({
  children,
  className,
  nette = false,
  verrouDansLaMarge = false,
}: {
  children: React.ReactNode;
  className?: string;
  nette?: boolean;
  /**
   * s26 tour 2 (Q3, aperçus de Mes questions et Mes répliques) : verrou posé dans la marge de 24 px du cadre (centré dans
   * le coin, 4 px du bord), le contenu ne lui réserve plus de colonne : marges internes 24/24 (25/57 px au tour 1).
   * s26 contrôle d'ensemble, aperçus : 8 px sous le bord haut (2 avant), sous le bandeau violet de 4 px, plus dessus.
   */
  verrouDansLaMarge?: boolean;
}) {
  return (
    <div
      className={cn("relative h-full min-w-0 [&[data-survol]>*:not([data-verrou-ferme])]:border-border-input", !nette && "[&>*:not([data-verrou-ferme])>*]:opacity-75", className)}
      data-tuile-fermee={nette ? "nette" : ""}
    >
      <VerrouSeul className={verrouDansLaMarge ? "right-1 top-2 h-5 max-e300:right-1 max-e300:top-2" : undefined} />
      {children}
    </div>
  );
}
