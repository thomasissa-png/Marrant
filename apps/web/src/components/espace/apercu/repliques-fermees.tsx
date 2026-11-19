import { TEXTES_CARTES } from "@/config/textes/espace-cartes";
import { frEspaceProfond } from "@/lib/fr-typo";
import { Verrou } from "@/components/espace/apercu/badge-premium";
import { META_FORT } from "@/components/espace/typo";

const C = frEspaceProfond(TEXTES_CARTES);

/** Registre d'une réplique de fiche situation (clés du schéma : `sure`, `joueuse`, `risquee`). */
export type RegistreReplique = keyof typeof TEXTES_CARTES.registres;

/**
 * v7 tour 13 (décision de Thomas du 16/11, « vas-y je te fais confiance ») : la vitrine des répliques de l'aperçu
 * d'« Aujourd'hui ». Sous la situation en clair, les répliques de la fiche par défaut en cartes FERMÉES : le libellé
 * réel de chaque registre (« La sûre », « La joueuse », « La risquée », `TEXTES_CARTES.registres`, dans l'ordre des
 * clés de la fiche) et un verrou ; le texte de la réplique est remplacé par deux barres neutres (`bg-border-hover`, s26 : un peu plus visibles).
 * Verrouillage RÉEL : ce composant ne reçoit que les clés des registres, jamais le texte ni le pourquoi ; rien de la
 * réplique n'entre dans le HTML ni dans les données envoyées au client (test Jest). Côte à côte dès 768 px, empilées
 * dessous. Neutre (aucun violet), 14/600 blanc (`META_FORT`) : aucune taille ni combinaison ajoutée.
 */
export function RepliquesFermees({ registres }: { registres: readonly RegistreReplique[] }) {
  return (
    <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3" data-repliques-fermees>
      {registres.map((r) => (
        // s26 liste et détail, tour 4 : `data-survol` (posé par `SignalOffre`) éclaircit le bord ; barres inchangées.
        <li key={r} className="min-w-0 rounded-xl border border-border p-4 data-[survol]:border-border-input" data-replique-fermee={r}>
          <div className="flex items-center justify-between gap-2">
            <p className={META_FORT}>{C.registres[r]}</p>
            <Verrou />
          </div>
          <div className="mt-4 flex flex-col gap-4" aria-hidden="true" data-barres-replique>
            <span className="block h-2 w-full rounded-full bg-border-hover" />
            <span className="block h-2 w-2/3 rounded-full bg-border-hover" />
          </div>
        </li>
      ))}
    </ul>
  );
}
