"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { isPremiumPlan } from "@/lib/parcours-access";
import type { EtapeAReprendre } from "@/lib/espace/quatre-semaines";
import type { NumeroCap } from "@/lib/espace/caps";
import { AnnonceCap, type AnnonceApi } from "@/components/espace/annonce-cap";
import { QuatreSemaines } from "@/components/espace/quatre-semaines";
import { CarteEnCours } from "@/components/espace/parcours/carte-en-cours";
import { TesBonus } from "@/components/espace/tes-bonus";
import { TEXTES_PARCOURS_ESPACE } from "@/config/textes/espace-caps";
import { noterParcoursEnCours } from "@/lib/espace/parcours-en-cours";
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
 * s26 parcours connecté (`docs/design/parcours-connecte-s26.md` §1, §2.1 à §2.3 ; `docs/ux/parcours-connecte-s26.md` §1,
 * arbitrage du 19/11 : plus de rail court ni collant) : dès 1024 px, les blocs de cet en-tête prennent place dans la
 * grille de 12 colonnes de la page (l'enveloppe passe en `contents`) et occupent TOUTE la largeur, en rangées : titre,
 * annonce, carte « En cours » (étape à reprendre + « Ton cap » en ligne), « Tes 4 premières semaines », « Tes bonus »,
 * titre de la liste. Cadres neutres, un seul plein (« Reprendre »).
 */
const LARGEUR = "lg:col-span-12";
const BONUS = cn(LARGEUR, "rounded-xl border-border bg-background-card px-6 lg:mt-6 [&>svg]:text-text-secondary");

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
      // s26 parcours, tour 7 : la carte de ce parcours, dans la liste, n'a plus de second bouton (« Reprendre » suffit).
      noterParcoursEnCours(lu?.etape?.enCours ? lu.etape.slug : null);
    });
    return () => {
      actif = false;
      noterParcoursEnCours(null);
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
    <h1 className={cn(TITRE_PAGE, "mb-8 max-e300:mb-3", LARGEUR)}>{P.titrePage}</h1>
    <div className="mb-6 flex flex-col gap-6 max-e300:mb-3 max-e300:gap-2 lg:contents" aria-busy={etat === "attente" || undefined} data-testid="parcours-espace">
      {/* Arbitrage @ux D4 n°1 (lot D5) : l'introduction publique est masquée pour l'abonné ; il garde un h1. */}
      <AnnonceCap annonce={caps?.annonce ?? null} retour={() => reprendre.current} className={cn(LARGEUR, "lg:has-[p]:mb-6")} leger />
      <CarteEnCours
        ref={reprendre}
        etat={etat}
        etape={caps?.etape ?? null}
        caps={caps ? { cap: caps.capAffiche, serie: caps.serie, ecart: caps.ecart } : null}
        className={LARGEUR}
      />
      <QuatreSemaines ecouterPublie={caps?.ecouterPublie === true} className={cn(LARGEUR, "lg:mt-6")} />
      {caps && <TesBonus bonus={caps.bonus} className={BONUS} />}
      {/* s26 parcours connecté (§2, rangée 6) : titre de la liste sur 12 colonnes, 48 px au-dessus, 24 px dessous.
          Tour 2 (200 % de texte, 188 x 406) : sous 300 px, 12 px au-dessus (8 de l'écart + 4) au lieu de 32. */}
      <h2 className={cn(TITRE_CARTE, LARGEUR, "mt-6 max-e300:mt-1 lg:mb-6 lg:mt-12")}>{P.listeParcours}</h2>
    </div>
    </>
  );
}
