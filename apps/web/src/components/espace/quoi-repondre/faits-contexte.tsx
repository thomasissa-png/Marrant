"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import { ADRESSE_LISTE_QUOI_REPONDRE } from "@/lib/espace/quoi-repondre-liste";

/**
 * s26 liste et détail (`docs/ux/liste-detail-quoi-repondre-s26.md` §3) : état « Fait » partagé entre la fiche ouverte
 * (geste) et la colonne de liste, qui reste montée dans le layout. Hors de Quoi répondre (rafale, Bibliothèque), aucun
 * fournisseur : `useFaitsQuoiRepondre()` vaut `null` et le geste fait exactement ce qu'il faisait.
 *
 * Rafraîchissement tranché : `router.refresh()` côté navigateur, pas `revalidatePath`. Le « Fait » est écrit par une
 * route d'API (`api/espace/fiche-fait`), et `revalidatePath` appelé depuis une route d'API ne met pas à jour le cache
 * de routeur du navigateur dans Next 14 (seule une Server Action le fait) ; les pages de l'espace sont de toute façon
 * `force-dynamic`, sans cache serveur à invalider. `router.refresh()` relit tout l'arbre serveur, layout compris : la
 * liste reçoit les vrais « Fait » sans être démontée (défilement et focus gardés). En attendant, l'état optimiste.
 */
interface FaitsQuoiRepondre {
  /** « Fait » optimiste d'une fiche, `undefined` : la valeur du serveur fait foi. */
  faitDe: (id: string) => boolean | undefined;
  /** Pose l'état optimiste ; `confirme` : écriture réussie, l'arbre serveur est relu. */
  marquer: (id: string, fait: boolean, confirme: boolean) => void;
  /** Demande le focus au titre de la prochaine fiche ouverte (clic dans la liste), consommé par le panneau. */
  demanderFocus: () => void;
  consommerFocus: () => boolean;
}

const Contexte = createContext<FaitsQuoiRepondre | null>(null);

export const useFaitsQuoiRepondre = () => useContext(Contexte);

export function FournisseurFaits({ versionServeur, children }: { versionServeur: string; children: React.ReactNode }) {
  const router = useRouter();
  const segment = useSelectedLayoutSegment();
  const parametres = useSearchParams();
  const [optimistes, setOptimistes] = useState<Record<string, boolean>>({});
  const focus = useRef(false);

  // Les « Fait » du serveur ont changé (après `router.refresh()`) : ils font foi de nouveau.
  useEffect(() => setOptimistes({}), [versionServeur]);

  const marquer = useCallback(
    (id: string, fait: boolean, confirme: boolean) => {
      setOptimistes((o) => ({ ...o, [id]: fait }));
      if (!confirme) return;
      // Fiche ouverte d'office (adresse sans id) : l'adresse se fixe sur elle (`replace`, aucune entrée d'historique),
      // sinon la relecture ouvrirait la suivante et l'abonné quitterait la fiche qu'il vient de marquer.
      if (!segment) {
        const q = parametres.toString();
        router.replace(`${ADRESSE_LISTE_QUOI_REPONDRE}/${encodeURIComponent(id)}${q ? `?${q}` : ""}`, { scroll: false });
      }
      router.refresh();
    },
    [router, segment, parametres],
  );

  const valeur = useMemo<FaitsQuoiRepondre>(
    () => ({
      faitDe: (id) => optimistes[id],
      marquer,
      demanderFocus: () => {
        focus.current = true;
      },
      consommerFocus: () => {
        const demande = focus.current;
        focus.current = false;
        return demande;
      },
    }),
    [optimistes, marquer],
  );

  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}
