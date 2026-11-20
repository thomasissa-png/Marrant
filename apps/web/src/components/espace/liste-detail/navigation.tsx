"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFaitsListe } from "@/components/espace/liste-detail/faits-contexte";
import { HAUT_COLLE_LISTE as HAUT_COLLE } from "@/components/espace/liste-detail/styles";
import { LienRetour } from "@/components/espace/lien-retour";
import { BOUTON_PRINCIPAL, BOUTON_SECONDAIRE } from "@/components/espace/carte/styles";
import { cn } from "@/lib/utils";

/**
 * s26 bibliothèque liste et détail : la navigation du pilote de Quoi répondre (`quoi-repondre/navigation.tsx`, inchangé)
 * rendue générique (adresse de la rubrique et clés `sessionStorage` en paramètres) : bouton « suivante », ouverture d'une
 * fiche (focus au H1, haut du panneau), « Retour » mobile et mémoire de défilement de la page liste (< 1024).
 */

export const lire = (cle: string) => {
  try {
    return window.sessionStorage.getItem(cle);
  } catch {
    return null;
  }
};
export const ecrire = (cle: string, valeur: string | null) => {
  try {
    if (valeur === null) window.sessionStorage.removeItem(cle);
    else window.sessionStorage.setItem(cle, valeur);
  } catch {
    // Stockage refusé : la position n'est pas gardée, rien d'autre ne change.
  }
};

/** Clés `sessionStorage` d'une rubrique : fiche ouverte depuis la page liste, dernière fiche quittée. */
export interface ClesRetour {
  depuisListe: string;
  ficheQuittee: string;
}

const GABARIT_SUIVANTE = "min-h-12 w-full whitespace-normal px-6 sm:w-auto sm:self-start";

/** Dernier élément du panneau : contour tant que la fiche n'est pas « Fait », plein après (un seul plein à l'écran). */
export function FicheSuivante({ ficheId, href, faitInitial, children }: { ficheId: string; href: string; faitInitial: boolean; children: React.ReactNode }) {
  const faits = useFaitsListe();
  const fait = faits?.faitDe(ficheId) ?? faitInitial;
  const lien = useRef<HTMLAnchorElement>(null);
  const avant = useRef(fait);
  useEffect(() => {
    const el = lien.current;
    if (fait && !avant.current && el) {
      const r = el.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) {
        const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ block: "nearest", behavior: reduit ? "auto" : "smooth" });
      }
    }
    avant.current = fait;
  }, [fait]);
  return (
    <Link
      ref={lien}
      href={href}
      prefetch={false}
      onClick={() => faits?.demanderFocus()}
      className={cn(fait ? cn(BOUTON_PRINCIPAL, "border border-transparent") : BOUTON_SECONDAIRE, GABARIT_SUIVANTE, "[overflow-wrap:anywhere]")}
      data-fiche-suivante
      data-plein={fait ? "" : undefined}
    >
      {children}
    </Link>
  );
}

/** Ouverture d'une fiche depuis la liste ou « suivante » : focus au H1, haut du panneau ramené sous l'en-tête dès 1024. */
export function OuvertureFicheListe() {
  const faits = useFaitsListe();
  const repere = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!faits) return;
    const large = window.matchMedia?.("(min-width: 1024px)").matches ?? false;
    if (faits.consommerFocus()) {
      const titre = document.getElementById("fiche-titre");
      const haut = repere.current?.getBoundingClientRect().top ?? 0;
      if (haut < (large ? HAUT_COLLE : 0)) window.scrollTo({ top: Math.max(0, window.scrollY + haut - HAUT_COLLE) });
      titre?.focus({ preventScroll: true });
      return;
    }
    if (!faits.consommerRetour() || !large) return;
    requestAnimationFrame(() => {
      const haut = repere.current?.getBoundingClientRect().top;
      if (haut !== undefined && haut < HAUT_COLLE) window.scrollTo({ top: Math.max(0, window.scrollY + haut - HAUT_COLLE) });
    });
  }, [faits]);
  return <span ref={repere} aria-hidden="true" className="block h-0" />;
}

/** « Retour » de la fiche plein écran (< 1024) : `router.back()` depuis la page liste, sinon lien vers la liste. */
export function RetourListeDetail({ href, label, cles }: { href: string; label: string; cles: ClesRetour }) {
  const router = useRouter();
  const chemin = usePathname();
  const [depuisListe, setDepuisListe] = useState(false);
  useEffect(() => setDepuisListe(lire(cles.depuisListe) === chemin), [chemin, cles.depuisListe]);
  // En quittant la fiche (« Retour », navigateur, autre lien), son adresse est notée : la page liste se recale sur sa ligne.
  useEffect(() => () => ecrire(cles.ficheQuittee, JSON.stringify({ chemin, t: Date.now() })), [chemin, cles.ficheQuittee]);
  return (
    <LienRetour
      href={href}
      label={label}
      onClick={(e) => {
        if (!depuisListe) return;
        e.preventDefault();
        ecrire(cles.depuisListe, null);
        router.back();
      }}
    />
  );
}
