"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { buttonVariants } from "@/components/ui/button";
import { appelEspace } from "@/components/espace/carte/appel";
import { LignesCloche } from "@/components/espace/cloche-lignes";
import { PANNEAU_ELEVE } from "@/components/layout/panneau-eleve";
import type { ContenuCloche } from "@/lib/espace/cloche-types";
import { TEXTES_ESPACE_NAVIGATION as T, nomCloche } from "@/config/textes/espace-navigation";
import { cn } from "@/lib/utils";

/**
 * Cloche de l'en-tête abonné : coque du lot D2, contenu du panneau au lot D8 (`cloche-lignes.tsx`,
 * `GET /api/espace/cloche`).
 * Maquette `aujourdhui.html` (`#cloche=…`), architecture v20 §2.9, étalon E5 §1.5 :
 * - bouton de 44 x 44, nom accessible = nombre de réponses de l'équipe non lues
 *   (singulier, pluriel, « aucune »), jamais le nombre de lignes ;
 * - pastille = point plein de 12 px, bordure de 2 px couleur du fond, sans chiffre, sans
 *   animation, réservée aux réponses de l'équipe ; couleur : token `accent-link` (le violet de la
 *   décision E5, `tailwind.config.ts`, plan §0 écart 6 ; contraste 7:1 sur le fond de page), jamais de hex ici ;
 * - panneau (s25, relecture tour 1 design F5 à F7 et ux) : à toutes les largeurs sous l'en-tête, 8 px sous son
 *   filet, sans voile ; bord droit sur la marge de la coque comme le menu du compte ; sous 768 px, toute la
 *   largeur de la coque, dès 768 px 320 px ; finition des cartes de l'accueil (`rounded-xl`, filet dégradé `h-1`
 *   en haut, `daily-content.tsx`), « Fermer » discret (ghost, 44 px) ; Échap, clic dehors et
 *   « Fermer » ferment, focus dans le panneau puis rendu au bouton (Radix Dialog) ; s25 (relecture tour 2, design F4) :
 *   couche au-dessus des cartes (`PANNEAU_ELEVE` : fond élevé, ombre portée nette, anneau fin), survols un cran
 *   au-dessus du fond (`bg-border-hover`) ;
 * - ouvrir le panneau ne lit rien (la pastille reste tant que le fil n'est pas ouvert) ;
 * - le nom ne change jamais en direct : aucun `aria-live`, aucune relecture pendant la lecture d'une page ;
 *   le contenu est lu au montage et à chaque changement d'adresse (`ClocheEspace`), jamais à intervalles.
 */
interface ClocheProps {
  /** Contenu lu par `ClocheEspace` ; null tant que rien n'est chargé (aucune ligne, nom « aucune »). */
  contenu?: ContenuCloche | null;
  /** Lecture échouée sans rien de lu : le panneau dit que les notifications n'ont pas pu s'afficher. */
  erreur?: boolean;
  /** Lot D9 : appelé à chaque ouverture du panneau (compteur anonyme d'ouverture, lot D10 ; sans effet sur l'écran). */
  onOuvrir?: () => void;
}

const IconeCloche = () => (
  <svg className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
    />
  </svg>
);

/**
 * Position du panneau : 8 px sous le bas de l'en-tête (filet compris), bord droit sur la marge de la coque
 * (premier enfant de `<header>`, padding déduit) ; sous 768 px, bord gauche aussi.
 */
function ancrer(bouton: HTMLElement | null): CSSProperties | undefined {
  if (!bouton || typeof window === "undefined" || typeof window.matchMedia !== "function") return undefined;
  const enTete = bouton.closest("header");
  const coque = enTete?.firstElementChild;
  const r = bouton.getBoundingClientRect();
  const haut = Math.round((enTete?.getBoundingClientRect().bottom ?? r.bottom) + 8);
  const bord = coque ? coque.getBoundingClientRect() : null;
  const style = coque ? getComputedStyle(coque) : null;
  const droite = bord && style ? bord.right - parseFloat(style.paddingRight) : r.right;
  const position: CSSProperties = { top: haut, right: Math.round(window.innerWidth - droite), maxHeight: window.innerHeight - haut - 16 };
  if (!window.matchMedia("(min-width: 768px)").matches && bord && style) position.left = Math.round(bord.left + parseFloat(style.paddingLeft));
  return position;
}

export function Cloche({ contenu = null, erreur = false, onOuvrir }: ClocheProps) {
  const [ouvert, setOuvert] = useState(false);
  const bouton = useRef<HTMLButtonElement>(null);
  const [ancre, setAncre] = useState<CSSProperties | undefined>(undefined);
  const nonLues = contenu?.nonLues ?? 0;

  useEffect(() => {
    if (!ouvert) return;
    const suivre = () => setAncre(ancrer(bouton.current));
    window.addEventListener("resize", suivre);
    return () => window.removeEventListener("resize", suivre);
  }, [ouvert]);

  return (
    <Dialog.Root
      open={ouvert}
      onOpenChange={(o) => {
        if (o) setAncre(ancrer(bouton.current));
        setOuvert(o);
        if (o) onOuvrir?.();
      }}
    >
      <Dialog.Trigger
        ref={bouton}
        aria-label={nomCloche(nonLues)}
        className="group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background-elevated hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary aria-expanded:bg-background-elevated aria-expanded:text-text-primary"
      >
        <IconeCloche />
        {nonLues > 0 && (
          <span
            data-pastille
            aria-hidden="true"
            className="absolute right-2 top-2 h-3 w-3 rounded-full border-2 border-background bg-accent-link group-hover:border-background-elevated group-aria-expanded:border-background-elevated"
          />
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          style={ancre}
          className={cn("fixed inset-x-3 top-[4.5rem] z-[70] max-h-[calc(100dvh-5.5rem)] overflow-y-auto rounded-xl border border-border p-4 focus:outline-none md:left-auto md:w-80 max-e300:px-3 max-e300:pt-3", PANNEAU_ELEVE)}
        >
          <div aria-hidden="true" className="-mx-4 -mt-4 mb-3 h-1 bg-gradient-to-r from-accent-primary to-accent-secondary max-e300:-mx-3 max-e300:-mt-3" />
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <Dialog.Title className="font-display text-xl font-bold text-text-primary">{T.cloche.titre}</Dialog.Title>
            <Dialog.Close className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-mr-3 h-11 shrink-0 hover:bg-border-hover max-e300:-mr-2 max-e300:pr-2")}>{T.cloche.fermer}</Dialog.Close>
          </div>
          <LignesCloche contenu={contenu} erreur={erreur} onChoisir={() => setOuvert(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * Lot D9 : ouverture du panneau signalée à `POST /api/espace/mesure` (`{ ouverture: "cloche" }`, liste
 * fermée), en `keepalive`, sans attente ni retour visible ; lot D10 : compteur anonyme, aucun compte.
 */
function signalerClocheOuverte() {
  try {
    void fetch("/api/espace/mesure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ouverture: "cloche" }),
      keepalive: true,
      credentials: "same-origin",
    }).catch(() => undefined);
  } catch {
    // Navigateur sans fetch : rien n'est mesuré.
  }
}

/**
 * Cloche branchée sur `GET /api/espace/cloche` (lot D8) : lue au montage et à chaque changement d'adresse
 * (un fil ouvert éteint la pastille à la page suivante), jamais à intervalles ni à l'ouverture du panneau.
 * Échec de lecture : le dernier contenu lu reste ; rien de lu : nom « aucune », panneau avec le message
 * d'erreur validé (`TEXTES_CLOCHE.erreur`), aucune ligne.
 */
export function ClocheEspace({ pathname }: { pathname: string | null }) {
  const [contenu, setContenu] = useState<ContenuCloche | null>(null);
  const [erreur, setErreur] = useState(false);
  useEffect(() => {
    let actif = true;
    void appelEspace<ContenuCloche>("/api/espace/cloche", "GET").then((lu) => {
      if (!actif) return;
      if (lu) setContenu(lu);
      setErreur(!lu);
    });
    return () => {
      actif = false;
    };
  }, [pathname]);
  return <Cloche contenu={contenu} erreur={erreur && !contenu} onOuvrir={signalerClocheOuverte} />;
}
