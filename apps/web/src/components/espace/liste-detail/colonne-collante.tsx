"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
import { CARTE_LISTE_COLLANTE, DEGRADE_BORD, HAUT_COLLE_LISTE } from "@/components/espace/liste-detail/styles";

const BAS_LIBRE = 24;
const HAUTEUR_MIN = 240;
const LARGE = "(min-width: 1024px)";

const lire = (cle: string) => {
  try {
    return window.sessionStorage.getItem(cle);
  } catch {
    return null;
  }
};
const ecrire = (cle: string, valeur: string) => {
  try {
    window.sessionStorage.setItem(cle, valeur);
  } catch {
    // Stockage refusé : la position de la liste n'est simplement pas gardée.
  }
};

/** Garde un élément visible dans son conteneur défilant, sans toucher au défilement de la page (`nearest`). */
function rendreVisible(conteneur: HTMLElement, el: HTMLElement) {
  const haut = el.getBoundingClientRect().top - conteneur.getBoundingClientRect().top + conteneur.scrollTop;
  const bas = haut + el.offsetHeight;
  if (haut < conteneur.scrollTop) conteneur.scrollTop = haut;
  else if (bas > conteneur.scrollTop + conteneur.clientHeight) conteneur.scrollTop = bas - conteneur.clientHeight;
}

/**
 * s26 liste et détail, module neutre : carte de liste collante dès 1024 (comportement du pilote Quoi répondre,
 * `colonne-liste.tsx`, repris sans modifier ses fichiers). Défilement propre du corps, hauteur ajustée à la place réelle
 * entre le haut collé et le bas du panneau (jamais sous 240 px), dégradés de bord tant qu'il reste des lignes cachées,
 * `scrollTop` gardé en `sessionStorage` sous `cle` (retour du navigateur), ligne active (`[data-ligne][aria-current]`)
 * gardée visible sans bouger la page, flèches haut et bas d'une ligne à l'autre. Sous 1024 : carte ordinaire, la page
 * défile (rien n'est ajusté).
 */
export function ColonneCollante({
  cle,
  label,
  actif,
  entete,
  children,
  className,
  ...data
}: {
  cle: string;
  label: string;
  /** Identifiant de la ligne active (`data-ligne`), gardée visible dans la liste. */
  actif: string | null;
  /** Haut fixe de la carte (ne défile pas). */
  entete?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
} & Record<`data-${string}`, string>) {
  const carte = useRef<HTMLElement>(null);
  const corps = useRef<HTMLDivElement>(null);
  const [bords, setBords] = useState({ haut: false, bas: false });

  const mesurerBords = () => {
    const el = corps.current;
    if (!el) return;
    const haut = el.scrollTop > 0;
    const bas = Math.ceil(el.scrollTop + el.clientHeight) < el.scrollHeight;
    setBords((b) => (b.haut === haut && b.bas === bas ? b : { haut, bas }));
  };

  // Hauteur de la carte collante : place entre son haut (collé ou de départ) et le bas de sa cellule, plafonnée à
  // l'écran moins le haut collé et 24 px ; dès 1024 seulement.
  useEffect(() => {
    const el = carte.current;
    const cellule = el?.parentElement;
    if (!el || !cellule) return;
    let image = 0;
    const ajuster = () => {
      image = 0;
      if (!window.matchMedia?.(LARGE).matches) {
        el.style.maxHeight = "";
        return;
      }
      const c = cellule.getBoundingClientRect();
      if (c.height === 0) return;
      const plafond = window.innerHeight - HAUT_COLLE_LISTE - BAS_LIBRE;
      const dispo = c.bottom - Math.max(HAUT_COLLE_LISTE, c.top);
      el.style.maxHeight = `${Math.round(Math.max(HAUTEUR_MIN, Math.min(plafond, dispo)))}px`;
      mesurerBords();
    };
    const demander = () => {
      if (!image) image = window.requestAnimationFrame(ajuster);
    };
    ajuster();
    window.addEventListener("scroll", demander, { passive: true });
    window.addEventListener("resize", demander);
    const observateur = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(demander);
    observateur?.observe(cellule);
    return () => {
      window.removeEventListener("scroll", demander);
      window.removeEventListener("resize", demander);
      observateur?.disconnect();
      if (image) window.cancelAnimationFrame(image);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Position de la liste : rendue au montage (retour navigateur), remise en haut quand la clé change (autre filtre).
  const cleAvant = useRef<string | null>(null);
  useEffect(() => {
    const el = corps.current;
    if (!el) return;
    if (window.matchMedia?.(LARGE).matches) el.scrollTop = cleAvant.current === null ? Number(lire(cle) ?? 0) : 0;
    cleAvant.current = cle;
    mesurerBords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cle]);

  // Ligne active gardée visible dans la liste (jamais la page).
  useEffect(() => {
    const el = corps.current;
    const ligne = actif ? el?.querySelector<HTMLElement>(`[data-ligne="${CSS.escape(actif)}"]`) : null;
    if (el && ligne && window.matchMedia?.(LARGE).matches) rendreVisible(el, ligne);
  }, [actif, cle]);

  const surTouche = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const liens = Array.from(corps.current?.querySelectorAll<HTMLAnchorElement>("a[data-ligne]") ?? []);
    const i = liens.indexOf(document.activeElement as HTMLAnchorElement);
    if (i < 0) return;
    e.preventDefault();
    liens[Math.min(liens.length - 1, Math.max(0, i + (e.key === "ArrowDown" ? 1 : -1)))]?.focus();
  };

  return (
    <nav ref={carte} aria-label={label} className={cn(CADRE_CARTE_NEUTRE, CARTE_LISTE_COLLANTE, className)} {...data}>
      {entete}
      <div className="relative flex min-h-0 flex-1 flex-col">
        <span aria-hidden="true" className={cn(DEGRADE_BORD, "top-0 bg-gradient-to-b", bords.haut ? "opacity-100" : "opacity-0")} />
        <span aria-hidden="true" className={cn(DEGRADE_BORD, "bottom-0 bg-gradient-to-t", bords.bas ? "opacity-100" : "opacity-0")} />
        <div
          ref={corps}
          className="min-h-0 flex-1 lg:overflow-y-auto lg:overscroll-contain"
          onKeyDown={surTouche}
          onScroll={(e) => {
            ecrire(cle, String(e.currentTarget.scrollTop));
            mesurerBords();
          }}
          data-liste-corps
        >
          {children}
        </div>
      </div>
    </nav>
  );
}
