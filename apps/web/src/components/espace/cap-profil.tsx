"use client";

import { useEffect, useState } from "react";
import { TonCap } from "@/components/espace/ton-cap";
import { lireCaps, type EtatCapsApi } from "@/components/espace/parcours/parcours-espace";
import { capDepuisXp } from "@/lib/espace/caps";

/**
 * « Mon profil », espace ouvert, abonné (s24, lot D4) : la carte « Ton cap » remplace la carte
 * « Progression » (anciens noms, emoji, pourcentage). Le cap affiché vient du serveur ; tant qu'il
 * n'a pas répondu (ou s'il échoue), le cap est calculé sur le total d'XP déjà affiché par la page,
 * sans phrase d'écart (le cap de déblocage n'est connu que du serveur). Ligne « X XP gagnés depuis
 * ton arrivée » (critère 11).
 */
export function CapProfil({ xp, serie }: { xp: number; serie: number }) {
  const [caps, setCaps] = useState<EtatCapsApi | null>(null);

  useEffect(() => {
    let actif = true;
    void lireCaps().then((lu) => {
      if (actif) setCaps(lu);
    });
    return () => {
      actif = false;
    };
  }, []);

  return (
    <TonCap
      cap={caps?.capAffiche ?? capDepuisXp(xp)}
      serie={caps?.serie ?? serie}
      ecart={caps?.ecart ?? false}
      xp={caps?.xp ?? xp}
      className="h-full"
    />
  );
}
