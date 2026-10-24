"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { trackUmamiWhenReady } from "@/lib/umami";
import { effacerDrapeauLettre } from "@/hooks/use-lettre-inscription";

interface LettreStatutProps {
  titre: ReactNode;
  children?: ReactNode;
  /**
   * Confirmation mesurée : `lettre-confirmee` avec l'emplacement relu en base. La route
   * de confirmation ne pose `mesure=1` que hors `emailsExclus()` (spec §4 règle 3).
   */
  confirmeeMesuree?: { emplacement: string | null };
  /** Adresse confirmée (mesurée ou non) : efface le drapeau « en attente » de ce navigateur. */
  confirmee?: boolean;
}

/**
 * Bandeau de statut de `/lettre` (spec §5) : `role="status"`, focus au chargement.
 * Élément non interactif (`tabIndex={-1}`) : aucun anneau de focus, sinon le focus
 * programmatique entoure une erreur de violet (revue design s21 tour 2, N1).
 */
export function LettreStatut({ titre, children, confirmeeMesuree, confirmee = false }: LettreStatutProps) {
  const ref = useRef<HTMLDivElement>(null);
  const envoye = useRef(false);

  useEffect(() => {
    ref.current?.focus();
    if (confirmee) effacerDrapeauLettre();
    if (confirmeeMesuree && !envoye.current) {
      envoye.current = true;
      trackUmamiWhenReady("lettre-confirmee", confirmeeMesuree.emplacement ? { emplacement: confirmeeMesuree.emplacement } : {});
    }
  }, [confirmeeMesuree, confirmee]);

  return (
    <div
      ref={ref}
      role="status"
      tabIndex={-1}
      data-lettre-statut
      className="rounded-lg border border-border bg-background-card p-4 focus:outline-none"
    >
      <p className="font-semibold text-text-primary">{titre}</p>
      {children}
    </div>
  );
}
