"use client";

import { useEffect, useRef } from "react";

/** H1 focalisé au chargement (annonce de la page aux lecteurs d'écran), comme le récap de rétractation. */
export function TitreAnnonce({ children }: { children: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <h1 ref={ref} tabIndex={-1} className="font-display text-3xl font-bold focus:outline-none md:text-4xl">
      {children}
    </h1>
  );
}
