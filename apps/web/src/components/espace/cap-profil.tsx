"use client";

import { useEffect, useState } from "react";
import { TonCap } from "@/components/espace/ton-cap";
import { lireCaps, type EtatCapsApi } from "@/components/espace/parcours/parcours-espace";
import { capDepuisXp } from "@/lib/espace/caps";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";

/**
 * « Mon profil », espace ouvert, abonné (s24, lot D4) : la carte « Ton cap » remplace la carte
 * « Progression » (anciens noms, emoji, pourcentage). Le cap affiché vient du serveur ; tant qu'il
 * n'a pas répondu (ou s'il échoue), le cap est calculé sur le total d'XP déjà affiché par la page,
 * sans phrase d'écart (le cap de déblocage n'est connu que du serveur). Ligne « X XP gagnés depuis
 * ton arrivée » (critère 11). Lot D5 (arbitrage @ux D4 n°2) : seule carte de la série sur `/profil`,
 * `md:col-span-2` (la carte « Série » est retirée espace ouvert).
 */
const PLEINE_HAUTEUR = ESPACE_CLIENT_PUBLIE ? "" : "h-full ";

export function CapProfil({ xp, serie, className }: { xp: number; serie: number; className?: string }) {
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
      // v6 tour 1 (relecture favoris-profil, point 6) : à 290 et 320 px, la carte ne déborde plus de la grille du
      // profil (`min-w-0`) et la ligne de la série passe à la ligne (`ligneQuiPasse`).
      // s26 tour 2 (Pr1) : ouvert, plus de `h-full` (sous 1024, la carte s'étirait de 150 à 231 px et ses voisines
      // étaient rognées). Fermé (`ProfilDashboard`) : inchangé.
      className={className ? `${PLEINE_HAUTEUR}min-w-0 ${className}` : `${PLEINE_HAUTEUR}min-w-0`}
      ligneQuiPasse
      // v6 tour 5, arbitrage 2 : marge interne et titre des cartes voisines (« Statistiques »).
      carteDuProfil
    />
  );
}
