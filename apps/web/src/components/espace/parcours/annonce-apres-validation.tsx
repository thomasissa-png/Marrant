"use client";

import { useEffect, useState } from "react";
import { AnnonceCap, type AnnonceApi } from "@/components/espace/annonce-cap";
import { lireCaps } from "@/components/espace/parcours/parcours-espace";

/**
 * Page d'un parcours, abonné, espace ouvert (s24, lot D4) : après chaque étape validée (`validations`
 * augmente), relit `/api/espace/caps` et passe l'annonce due (cap, bonus ou les deux) à `AnnonceCap`,
 * dont la région polie est montée dès le chargement. Fermer rend le focus à « Reprendre » du sommaire.
 * Ni XP ni cap ne sont calculés ici : le serveur décide.
 */
export function AnnonceApresValidation({ validations }: { validations: number }) {
  const [annonce, setAnnonce] = useState<AnnonceApi | null>(null);

  useEffect(() => {
    if (validations === 0) return;
    let actif = true;
    void lireCaps().then((lu) => {
      if (actif && lu?.annonce) setAnnonce(lu.annonce);
    });
    return () => {
      actif = false;
    };
  }, [validations]);

  // s26 parcours v2 : dans la colonne de l'étape (`gap-6`), hors flux tant qu'elle est vide (`sr-only` : la région polie
  // reste montée, sans creuser 24 px), carte de l'annonce sinon. L'enveloppe `mb-6 empty:hidden` ne se vidait jamais.
  return <AnnonceCap annonce={annonce} retour={() => document.getElementById("sommaire-reprendre")} className="[&:not(:has(p))]:sr-only" />;
}
