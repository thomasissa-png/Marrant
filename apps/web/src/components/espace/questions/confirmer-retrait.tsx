"use client";

import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { TEXTES_QUESTIONS as Q } from "@/config/textes/espace-questions";
import { BOUTON_SECONDAIRE } from "@/components/espace/carte/styles";

/**
 * Confirmation avant « Retirer de mon historique » (décision de Thomas du 13/11 ; textes : reco A de
 * `docs/copy/confirmation-retirer-s24.md`). Dialogue d'alerte (Radix Dialog, `role="alertdialog"`) :
 * focus piégé, d'abord sur « Annuler » (le geste sans risque, comme « Supprimer cette réplique ? ») ;
 * Échap, clic dehors et « Annuler » ferment sans rien effacer et rendent le focus au bouton d'origine.
 * « Retirer » efface (`onConfirmer`) ; réussi, le fil laisse sa place au statut, qui reçoit le focus
 * (`onRetire`, après la fermeture) ; échec, le dialogue se ferme, focus rendu au bouton, l'erreur s'affiche.
 * Fenêtre centrée à toutes les largeurs, cibles de 44 px, boutons pleine largeur sous 300 px (200 %).
 */
export function ConfirmerRetrait({ desactive, onConfirmer, onRetire }: { desactive: boolean; onConfirmer: () => Promise<boolean>; onRetire: () => void }) {
  const [ouvert, setOuvert] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const retire = useRef(false);
  const annuler = useRef<HTMLButtonElement>(null);

  const confirmer = async () => {
    if (enCours) return;
    setEnCours(true);
    retire.current = await onConfirmer();
    setEnCours(false);
    setOuvert(false);
  };

  return (
    <Dialog.Root open={ouvert} onOpenChange={(o) => !enCours && setOuvert(o)}>
      <Dialog.Trigger className={`${BOUTON_SECONDAIRE} max-e300:w-full`} disabled={desactive}>
        {Q.envois.retirer}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/60" />
        <Dialog.Content
          role="alertdialog"
          aria-describedby={undefined}
          data-confirmation-retrait
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            annuler.current?.focus();
          }}
          onCloseAutoFocus={(e) => {
            if (!retire.current) return;
            e.preventDefault();
            onRetire();
          }}
          className="fixed left-1/2 top-1/2 z-[70] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-background-card p-4 focus:outline-none md:p-6 max-e300:p-3"
        >
          <Dialog.Title className="text-base font-semibold text-text-primary">{Q.confirmationRetrait.question}</Dialog.Title>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className={`${BOUTON_SECONDAIRE} max-e300:w-full`} aria-busy={enCours} onClick={() => void confirmer()}>
              {Q.confirmationRetrait.retirer}
            </button>
            <Dialog.Close ref={annuler} className={`${BOUTON_SECONDAIRE} max-e300:w-full`} disabled={enCours}>
              {Q.confirmationRetrait.annuler}
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
