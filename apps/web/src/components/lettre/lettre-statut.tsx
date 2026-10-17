"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { trackUmamiWhenReady } from "@/lib/umami";

interface LettreStatutProps {
  titre: string;
  children?: ReactNode;
  /**
   * Confirmation mesurée : `lettre-confirmee` avec l'emplacement relu en base. La route
   * de confirmation ne pose `mesure=1` que hors `emailsExclus()` (spec §4 règle 3).
   */
  confirmeeMesuree?: { emplacement: string | null };
}

/** Bandeau de statut de `/lettre` (spec §5) : `role="status"`, focus au chargement. */
export function LettreStatut({ titre, children, confirmeeMesuree }: LettreStatutProps) {
  const ref = useRef<HTMLDivElement>(null);
  const envoye = useRef(false);

  useEffect(() => {
    ref.current?.focus();
    if (confirmeeMesuree && !envoye.current) {
      envoye.current = true;
      trackUmamiWhenReady("lettre-confirmee", confirmeeMesuree.emplacement ? { emplacement: confirmeeMesuree.emplacement } : {});
    }
  }, [confirmeeMesuree]);

  return (
    <div
      ref={ref}
      role="status"
      tabIndex={-1}
      data-lettre-statut
      className="rounded-lg border border-border bg-background-card p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
    >
      <p className="font-semibold text-text-primary">{titre}</p>
      {children}
    </div>
  );
}
