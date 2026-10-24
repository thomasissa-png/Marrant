"use client";

import { useEffect, useRef } from "react";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import type { LettreErreur } from "@/hooks/use-lettre-inscription";

interface LettreSuccesProps {
  id: string;
  /** Secondes avant de pouvoir renvoyer l'e-mail (0 = possible). */
  attente: number;
  erreur: LettreErreur;
  onRenvoyer: () => void;
  onChanger: () => void;
}

const S = TEXTES_LETTRE.succes;

/**
 * État « Regarde ta boîte mail » (spec §2.4) : même écran pour une nouvelle adresse et
 * une adresse déjà inscrite (anti-fuite). Jamais « C'est confirmé » avant le clic de
 * confirmation. Focus sur le titre ; compte à rebours annoncé toutes les 15 s.
 */
export function LettreSucces({ id, attente, erreur, onRenvoyer, onChanger }: LettreSuccesProps) {
  const titreRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    titreRef.current?.focus();
  }, []);

  const annonce = attente > 0 && attente % 15 === 0 ? S.renvoyerDans.replace("{s}", String(attente)) : "";

  return (
    <div className="mt-3">
      <div role="status">
        <p ref={titreRef} tabIndex={-1} id={`${id}-succes`} className="font-semibold text-text-primary focus:outline-none">
          {S.titre}
        </p>
        <p className="mt-1 text-sm text-text-secondary">{S.texte}</p>
        <p className="mt-2 text-xs text-text-muted">{S.aide}</p>
      </div>
      {(erreur === "reseau" || erreur === "limite") && (
        <p role="alert" className="mt-2 text-sm text-error-text">
          {erreur === "limite" ? TEXTES_LETTRE.erreurs.limite : TEXTES_LETTRE.erreurs.reseau}
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-x-6">
        <button
          type="button"
          onClick={onRenvoyer}
          disabled={attente > 0}
          className="min-h-11 text-sm text-accent-link underline disabled:text-text-muted disabled:no-underline"
        >
          <span aria-hidden={attente > 0 || undefined}>
            {attente > 0 ? S.renvoyerDans.replace("{s}", String(attente)) : S.renvoyer}
          </span>
          {attente > 0 && <span className="sr-only">{S.renvoyer}</span>}
        </button>
        <button type="button" onClick={onChanger} className="min-h-11 text-sm text-accent-link underline">
          {S.changer}
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {annonce}
      </span>
    </div>
  );
}
