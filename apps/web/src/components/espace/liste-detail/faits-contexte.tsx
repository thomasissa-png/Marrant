"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";

/**
 * s26 bibliothèque liste et détail : état « Fait » partagé entre la fiche ouverte (geste) et la colonne de liste d'une
 * rubrique en liste et détail, sur le modèle de `quoi-repondre/faits-contexte.tsx` (inchangé), avec l'adresse de la
 * liste en paramètre (Quoi répondre garde son propre fournisseur). `GesteFiche` lit l'un ou l'autre : hors de ces deux
 * rubriques, aucun fournisseur, rendu inchangé.
 */
export interface FaitsListe {
  faitDe: (id: string) => boolean | undefined;
  marquer: (id: string, fait: boolean, confirme: boolean) => void;
  demanderFocus: () => void;
  consommerFocus: () => boolean;
  consommerRetour: () => boolean;
}

/** Heure du dernier `popstate` (un retour depuis une autre page arrive avant le montage du fournisseur). */
let dernierPopstate = 0;
if (typeof window !== "undefined") window.addEventListener("popstate", () => (dernierPopstate = Date.now()));

const Contexte = createContext<FaitsListe | null>(null);

export const useFaitsListe = () => useContext(Contexte);

export function FournisseurFaitsListe({ adresseListe, versionServeur, children }: { adresseListe: string; versionServeur: string; children: React.ReactNode }) {
  const router = useRouter();
  const segment = useSelectedLayoutSegment();
  const [optimistes, setOptimistes] = useState<Record<string, boolean>>({});
  const focus = useRef(false);

  // Les « Fait » du serveur ont changé (après `router.refresh()`) : ils font foi de nouveau.
  useEffect(() => setOptimistes({}), [versionServeur]);

  // Dès 1024, le défilement de la page n'est pas rendu par le navigateur au retour (`OuvertureFicheListe` le fait).
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
      // Fiche ouverte d'office (adresse sans id) : l'adresse se fixe sur elle (`replace`), sinon la relecture ouvrirait
      // la suivante et l'abonné quitterait la fiche qu'il vient de marquer.
      if (!segment) router.replace(`${adresseListe}/${encodeURIComponent(id)}`, { scroll: false });
      router.refresh();
    },
    [router, segment, adresseListe],
  );

  const valeur = useMemo<FaitsListe>(
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
