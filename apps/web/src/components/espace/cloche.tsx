"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { buttonVariants } from "@/components/ui/button";
import { appelEspace } from "@/components/espace/carte/appel";
import { LignesCloche } from "@/components/espace/cloche-lignes";
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
 * - panneau : feuille basse sur téléphone, fenêtre dès 768 px ; Échap, clic dehors et
 *   « Fermer » ferment, focus dans le panneau puis rendu au bouton (Radix Dialog) ;
 * - ouvrir le panneau ne lit rien (la pastille reste tant que le fil n'est pas ouvert) ;
 * - le nom ne change jamais en direct : aucun `aria-live`, aucune relecture pendant la lecture d'une page ;
 *   le contenu est lu au montage et à chaque changement d'adresse (`ClocheEspace`), jamais à intervalles.
 */
interface ClocheProps {
  /** Contenu lu par `ClocheEspace` ; null tant que rien n'est chargé (aucune ligne, nom « aucune »). */
  contenu?: ContenuCloche | null;
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

export function Cloche({ contenu = null }: ClocheProps) {
  const [ouvert, setOuvert] = useState(false);
  const nonLues = contenu?.nonLues ?? 0;
  return (
    <Dialog.Root open={ouvert} onOpenChange={setOuvert}>
      <Dialog.Trigger
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
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/60" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 z-[70] max-h-[calc(100dvh-1rem)] overflow-y-auto rounded-t-2xl border border-border bg-background-card p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] focus:outline-none md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-md md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-lg md:p-6 max-e300:px-3 max-e300:pt-3"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <Dialog.Title className="font-display text-xl font-bold text-text-primary">{T.cloche.titre}</Dialog.Title>
            <Dialog.Close className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-11 shrink-0 border-border-input")}>{T.cloche.fermer}</Dialog.Close>
          </div>
          <LignesCloche contenu={contenu} onChoisir={() => setOuvert(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * Cloche branchée sur `GET /api/espace/cloche` (lot D8) : lue au montage et à chaque changement d'adresse
 * (un fil ouvert éteint la pastille à la page suivante), jamais à intervalles ni à l'ouverture du panneau.
 * Échec de lecture : le dernier contenu lu reste ; rien de lu : nom « aucune », panneau sans ligne.
 */
export function ClocheEspace({ pathname }: { pathname: string | null }) {
  const [contenu, setContenu] = useState<ContenuCloche | null>(null);
  useEffect(() => {
    let actif = true;
    void appelEspace<ContenuCloche>("/api/espace/cloche", "GET").then((lu) => {
      if (actif && lu) setContenu(lu);
    });
    return () => {
      actif = false;
    };
  }, [pathname]);
  return <Cloche contenu={contenu} />;
}
