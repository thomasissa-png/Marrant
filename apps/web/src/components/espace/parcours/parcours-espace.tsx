"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { isPremiumPlan } from "@/lib/parcours-access";
import type { EtapeAReprendre } from "@/lib/espace/quatre-semaines";
import type { NumeroCap } from "@/lib/espace/caps";
import { AnnonceCap, type AnnonceApi } from "@/components/espace/annonce-cap";
import { QuatreSemaines } from "@/components/espace/quatre-semaines";
import { TonCap } from "@/components/espace/ton-cap";
import { TesBonus } from "@/components/espace/tes-bonus";
import { TEXTES_PARCOURS_ESPACE } from "@/config/textes/espace-caps";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const P = frEspaceProfond(TEXTES_PARCOURS_ESPACE);

export interface EtatCapsApi {
  xp: number;
  serie: number;
  capAffiche: NumeroCap;
  capDeblocage: NumeroCap;
  ecart: boolean;
  bonus: Array<{ cap: NumeroCap; id: string; titre: string; href: string; dureeMinutes: number }>;
  annonce: AnnonceApi | null;
  etape: EtapeAReprendre | null;
  /** Lot D11b (@ux D-1) : au moins une fiche « Écouter, repérer » publiée (serveur, `ecouterPublie`). */
  ecouterPublie?: boolean;
}

/** Lecture de `/api/espace/caps`, 5 s au plus ; null en cas d'échec (rien d'inventé). */
export async function lireCaps(): Promise<EtatCapsApi | null> {
  const controleur = new AbortController();
  const delai = setTimeout(() => controleur.abort(), 5_000);
  try {
    const res = await fetch("/api/espace/caps", { cache: "no-store", signal: controleur.signal });
    return res.ok ? ((await res.json()) as EtatCapsApi) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(delai);
  }
}

/**
 * En-tête de « Parcours » pour l'abonné (s24, lot D4 ; architecture v20 4.4 ; maquette `parcours.html`) :
 * annonce de passage, « Tes 4 premières semaines » et l'étape à reprendre, carte « Ton cap » 24 px
 * dessous, « Tes bonus » si un bonus est ouvert ; puis la liste publique des parcours (inchangée).
 * Côté navigateur seulement (`/parcours` est public et prérendu) ; rien n'est rendu interrupteur fermé,
 * pour un visiteur ou un compte sans abonnement (le serveur relit le plan en base : 403 = rien).
 * États : chargement (calendrier seul, `aria-busy`), erreur (calendrier seul), succès.
 * Lot D11b (@ux D-1) : `ecouterPublie` (réponse de `/api/espace/caps`) choisit la ligne de la semaine 4 ; tant
 * qu'elle n'est pas lue (chargement, erreur), la ligne sans « Écouter », toujours vraie. La page `/parcours` n'est
 * pas touchée (fichier sous hachage, textes en ligne).
 */
export function ParcoursEspace() {
  const { data: session, status } = useSession();
  const premium = status === "authenticated" && isPremiumPlan((session?.user as { plan?: string } | undefined)?.plan);
  const [etat, setEtat] = useState<"attente" | "ok" | "echec">("attente");
  const [caps, setCaps] = useState<EtatCapsApi | null>(null);
  const reprendre = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!ESPACE_CLIENT_PUBLIE || !premium) return;
    let actif = true;
    void lireCaps().then((lu) => {
      if (!actif) return;
      setCaps(lu);
      setEtat(lu ? "ok" : "echec");
    });
    return () => {
      actif = false;
    };
  }, [premium]);

  if (!ESPACE_CLIENT_PUBLIE || !premium) return null;

  return (
    <div className="mb-8 flex flex-col gap-6 max-e300:mb-3 max-e300:gap-2" aria-busy={etat === "attente" || undefined} data-testid="parcours-espace">
      {/* Arbitrage @ux D4 n°1 (lot D5) : l'introduction publique est masquée pour l'abonné ; il garde un h1. */}
      <h1 className="sr-only">{P.titrePage}</h1>
      <AnnonceCap annonce={caps?.annonce ?? null} retour={() => reprendre.current} />
      <QuatreSemaines ref={reprendre} etape={caps?.etape ?? null} ecouterPublie={caps?.ecouterPublie === true} />
      {caps && (
        <>
          <TonCap cap={caps.capAffiche} serie={caps.serie} ecart={caps.ecart} />
          <TesBonus bonus={caps.bonus} />
        </>
      )}
      <h2 className="font-display text-xl font-bold text-text-primary">{P.listeParcours}</h2>
    </div>
  );
}
