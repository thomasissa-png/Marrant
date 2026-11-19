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
import { cn } from "@/lib/utils";
import { TITRE_CARTE, TITRE_PAGE } from "@/components/espace/typo";

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
/**
 * s26 (`docs/design/parcours-vannes-s26.md` §1.2) : dès 1024 px, les blocs de cet en-tête prennent place dans la grille
 * de 12 colonnes de la page (l'enveloppe passe en `contents`, aucun élément ajouté) : titre, annonce, étape à reprendre
 * et titre de la liste dans la colonne de 8 ; « Ton cap » en rail collant de 4 à droite, rangées 1 à 5 (titre, annonce,
 * étape à reprendre, titre de la liste, cartes) ; « Tes bonus » au pied du rail, rangée du quiz (aucun parent commun
 * avec « Ton cap » : il ne peut pas coller dessous). Collant à `lg:top-36` (en-tête collant de 121 px). Filets violets
 * retirés (décision du 18/11) : cadres neutres.
 */
const COLONNE = "lg:col-span-8";
const RAIL_CAP = "p-6 before:hidden md:p-6 [&_h2]:font-semibold lg:sticky lg:top-36 lg:col-span-4 lg:col-start-9 lg:row-span-5 lg:row-start-1 lg:self-start";
const RAIL_BONUS = "lg:col-span-4 lg:col-start-9 lg:row-start-6 lg:mt-12 lg:self-start";

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

  // Relecture des captures nav s24, tour 2 (design F4) : la page de l'abonné a un titre (l'introduction publique est
  // masquée pour lui). Nav v6 (intégration s25) : plus de place du repère au-dessus (le fil d'Ariane visible a quitté
  // les pages de premier niveau, la bande est le repère) : H1 à la hauteur des autres rubriques.
  return (
    <>
    {/* Le H1 « Parcours » était réservé aux lecteurs d'écran (lot D5) : il est maintenant visible. Sous 300 px
        (200 % de texte), plus petit et plus serré, pour garder la liste dans les deux premiers écrans (N2). v6 tour 3
        (arbitrage 1) : centré comme l'accueil et les rubriques de l'espace (rendu interrupteur ouvert seulement). */}
    {/* s26 : titre blanc à gauche, échelle `typo.ts` (plus de centrage). */}
    <h1 className={cn(TITRE_PAGE, "mb-8 max-e300:mb-3", COLONNE)}>{P.titrePage}</h1>
    <div className="mb-8 flex flex-col gap-6 max-e300:mb-3 max-e300:gap-2 lg:contents" aria-busy={etat === "attente" || undefined} data-testid="parcours-espace">
      {/* Arbitrage @ux D4 n°1 (lot D5) : l'introduction publique est masquée pour l'abonné ; il garde un h1. */}
      <AnnonceCap annonce={caps?.annonce ?? null} retour={() => reprendre.current} className={cn(COLONNE, "lg:has-[p]:mb-6")} />
      <QuatreSemaines ref={reprendre} etape={caps?.etape ?? null} ecouterPublie={caps?.ecouterPublie === true} className={COLONNE} />
      {caps && (
        <>
          <TonCap cap={caps.capAffiche} serie={caps.serie} ecart={caps.ecart} className={RAIL_CAP} />
          <TesBonus bonus={caps.bonus} className={RAIL_BONUS} />
        </>
      )}
      {/* v6 tour 5, arbitrage 1 : titre de section centré comme l'accueil (composant rendu interrupteur ouvert seulement).
          s26 : à gauche, au-dessus des cartes, dans la colonne de 8. */}
      <h2 className={cn(TITRE_CARTE, COLONNE, "lg:mb-6 lg:mt-12")}>{P.listeParcours}</h2>
    </div>
    </>
  );
}
