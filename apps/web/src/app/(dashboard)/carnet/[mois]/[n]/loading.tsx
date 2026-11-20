import { CADRE_CARTE } from "@/components/espace/carte/styles";

/**
 * s26 carnet liste et détail : squelette du SEUL panneau pendant l'ouverture d'une fiche (la liste du layout reste en
 * place, jamais d'écran blanc). Même carte que la fiche (bandeau de l'accueil, `p-6`) : pastilles, titre, deux colonnes
 * de lignes ; aucun texte.
 */
export default function FicheCarnetChargement() {
  return (
    <div aria-busy="true" data-etat="chargement-fiche">
      <div aria-hidden="true" className={`${CADRE_CARTE} p-6 animate-pulse motion-reduce:animate-none`}>
        <div className="h-8 w-40 rounded-full bg-background-elevated" />
        <div className="mt-4 h-5 w-32 rounded bg-background-elevated" />
        <div className="mt-2 h-9 w-2/3 rounded bg-background-elevated" />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-background-elevated" />
            <div className="h-20 w-full rounded-xl bg-background-elevated" />
            <div className="h-20 w-full rounded-xl bg-background-elevated" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-1/2 rounded bg-background-elevated" />
            <div className="h-4 w-full rounded bg-background-elevated" />
            <div className="h-4 w-11/12 rounded bg-background-elevated" />
          </div>
        </div>
      </div>
    </div>
  );
}
