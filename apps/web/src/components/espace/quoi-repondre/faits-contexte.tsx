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
  /** Vrai une fois si la fiche montée arrive d'un retour (ou d'une avance) du navigateur, il y a moins de 2 s. */
  consommerRetour: () => boolean;
}

/**
 * s26 liste et détail, tour 3 (mesures N1 : retour navigateur dès 1024, haut du H1 à 37 px à 1024 et 115 à 1280, sous
 * l'en-tête de 121 px) : heure du dernier `popstate`, notée au niveau du module (un retour depuis une autre page arrive
 * avant le montage du fournisseur). Lue par `OuvertureFiche`.
 */
let dernierPopstate = 0;
if (typeof window !== "undefined") window.addEventListener("popstate", () => (dernierPopstate = Date.now()));

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

  // s26 liste et détail, tour 3 (N1) : dès 1024, le navigateur ne rend plus lui-même le défilement de la page au retour
  // (`scrollRestoration` manuel, posé sur l'entrée courante, reprise par les entrées suivantes) : il animait la page vers
  // la position quittée APRÈS `popstate` (mesuré : 9 -> 141 px en 200 ms à 1024), le haut de la fiche sous l'en-tête.
  // `OuvertureFiche` ramène le panneau à 144 px. La liste garde son `scrollTop` (son propre conteneur, collant). Sous
  // 1024, restauration automatique, complétée par `MemoireDefilementPage` comme avant. Au démontage, mode d'avant.
  useEffect(() => {
    const large = window.matchMedia?.("(min-width: 1024px)");
    if (!large || !("scrollRestoration" in window.history)) return;
    const avant = window.history.scrollRestoration;
    const appliquer = () => {
      window.history.scrollRestoration = large.matches ? "manual" : "auto";
    };
    appliquer();
    large.addEventListener("change", appliquer);
    window.addEventListener("popstate", appliquer);
    return () => {
      large.removeEventListener("change", appliquer);
      window.removeEventListener("popstate", appliquer);
      window.history.scrollRestoration = avant;
    };
  }, []);

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
      consommerRetour: () => {
        const recent = Date.now() - dernierPopstate < 2000;
        dernierPopstate = 0;
        return recent;
      },
    }),
    [optimistes, marquer],
  );

  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}
