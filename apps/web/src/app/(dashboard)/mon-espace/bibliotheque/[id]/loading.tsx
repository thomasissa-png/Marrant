import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";

/**
 * s26 bibliothèque liste et détail (modèle Quoi répondre) : squelette du SEUL panneau pendant l'ouverture d'une fiche (la liste du layout reste en place,
 * jamais d'écran blanc). Mêmes cartes que la fiche (spec design §3) : carte A (titre et trois lignes), carte B (geste),
 * mêmes `p-6`, aucun texte.
 */
export default function FicheBibliothequeChargement() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" data-etat="chargement-fiche">
      <div aria-hidden="true" className={`${CADRE_CARTE_NEUTRE} p-6 animate-pulse motion-reduce:animate-none`}>
        <div className="h-8 w-2/3 rounded bg-background-elevated" />
        <div className="mt-2 h-5 w-24 rounded bg-background-elevated" />
        <div className="mt-6 space-y-3 border-t border-border pt-6">
          <div className="h-4 w-full rounded bg-background-elevated" />
          <div className="h-4 w-11/12 rounded bg-background-elevated" />
          <div className="h-4 w-3/4 rounded bg-background-elevated" />
        </div>
      </div>
      <div aria-hidden="true" className={`${CADRE_CARTE_NEUTRE} p-6 animate-pulse motion-reduce:animate-none`}>
        <div className="h-5 w-20 rounded bg-background-elevated" />
        <div className="mt-4 h-11 w-2/3 rounded bg-background-elevated" />
      </div>
    </div>
  );
}
