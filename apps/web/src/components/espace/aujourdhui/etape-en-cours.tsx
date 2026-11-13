import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { TEXTES_AUJOURDHUI as T } from "@/config/textes/espace-aujourdhui";
import { TEXTES_PARCOURS_ESPACE as P } from "@/config/textes/espace-caps";
import type { EtapeAReprendre } from "@/lib/espace/quatre-semaines";

/**
 * « Étape en cours » (ou « Étape conseillée »), état 3 d'« Aujourd'hui » (architecture v20 4.4 : la rafale
 * est faite ; maquette `aujourdhui.html#etat=reprise`) : le parcours, « Étape n sur N » s'il est commencé,
 * le titre de l'étape et l'action principale « Reprendre » ou « Commencer l'étape n », sans date.
 */
export function EtapeEnCours({ etape }: { etape: EtapeAReprendre }) {
  return (
    <section aria-labelledby="etape-titre" className="space-y-2 rounded-lg border border-border bg-background-card p-4 md:p-6" data-testid="etape-en-cours">
      <p className="text-xs font-semibold text-text-muted">{etape.enCours ? T.etape.enCours : T.etape.conseillee}</p>
      <h2 id="etape-titre" className="font-display text-xl font-bold text-text-primary">
        {etape.titreParcours}
      </h2>
      {etape.enCours && <p className="text-sm text-text-secondary">{P.etapeSurTotal(etape.ordre, etape.total)}</p>}
      <p className="text-base text-text-primary [overflow-wrap:anywhere]">{etape.titreEtape}</p>
      <Link href={etape.href} className={buttonVariants({ variant: "primary", className: "h-11 max-e300:h-auto max-e300:min-h-11" })}>
        {etape.enCours ? T.etape.reprendre : T.etape.commencerEtape1.replace("1", String(etape.ordre))}
      </Link>
    </section>
  );
}
