"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { TEXTES_PARCOURS_ESPACE } from "@/config/textes/espace-caps";
import { TEXTES_AUJOURDHUI as TEXTES_AUJOURDHUI_BRUT } from "@/config/textes/espace-aujourdhui";
import type { EtapeAReprendre } from "@/lib/espace/quatre-semaines";
import type { NumeroCap } from "@/lib/espace/caps";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";
import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
import { ETIQUETTE, META, TEXTE_FORT, TITRE_CARTE } from "@/components/espace/typo";
import { BarreSegmentee } from "@/components/espace/parcours/barre-segmentee";
import { TonCap } from "@/components/espace/ton-cap";

const P = frEspaceProfond(TEXTES_PARCOURS_ESPACE);
const E = frEspaceProfond(TEXTES_AUJOURDHUI_BRUT).etape;

export interface CapsEnLigne {
  cap: NumeroCap;
  serie: number;
  ecart: boolean;
}

/**
 * s26 parcours connecté (`docs/design/parcours-connecte-s26.md` §2.1 ; `docs/ux/parcours-connecte-s26.md` §2.1) : carte
 * « En cours » de /parcours (abonné, espace ouvert seulement), tirée de `QuatreSemaines`. Rangée 1 : l'étape à reprendre
 * (étiquette, parcours, « Étape n sur N », titre d'étape) et LE plein de l'écran, centré à droite dès 1024 px. Rangée 2
 * (caps lus) : barre du parcours en cours (4 colonnes) et « Ton cap » en ligne (8, ou 12 sans barre). Plus de rail.
 * `etat` « attente » : squelette à la hauteur finale (`aria-busy`) ; « echec » : rien (le calendrier reste dessous).
 * Le bouton porte la `ref` : l'annonce de passage y rend le focus à sa fermeture.
 */
export const CarteEnCours = forwardRef<
  HTMLAnchorElement,
  { etat: "attente" | "ok" | "echec"; etape: EtapeAReprendre | null; caps: CapsEnLigne | null; className?: string }
>(function CarteEnCours({ etat, etape, caps, className }, ref) {
  if (etat === "attente") {
    return (
      <section aria-busy="true" data-testid="carte-en-cours-squelette" className={cn(CADRE_CARTE_NEUTRE, "p-6", className)}>
        <div aria-hidden="true" className="animate-pulse motion-reduce:animate-none">
          <div className="grid gap-y-4 lg:grid-cols-12 lg:gap-x-6">
            <div className="space-y-2 lg:col-span-9">
              <div className="h-5 w-32 rounded bg-background-elevated" />
              <div className="h-7 w-56 max-w-full rounded bg-background-elevated" />
              <div className="h-5 w-24 rounded bg-background-elevated" />
              <div className="h-6 w-72 max-w-full rounded bg-background-elevated" />
            </div>
            <div className="h-12 w-full rounded-xl bg-background-elevated sm:w-44 lg:col-span-3 lg:self-center lg:justify-self-end" />
          </div>
          <div className="mt-6 border-t border-border pt-6">
            <div className="h-7 w-full rounded bg-background-elevated" />
          </div>
        </div>
      </section>
    );
  }
  if (etat === "echec" || (!etape && !caps)) return null;

  const barre = etape?.enCours === true;
  // s26 parcours v2 (`docs/design/parcours-connecte-v2-s26.md` §4) : trois rangées sur la même grille de 12 colonnes
  // (gauche 9, droite 3) : étape et bouton ; barre segmentée et « Étape n sur N » sous le bouton (plus de « Étape 3 sur 3 »
  // au-dessus d'une barre aux deux tiers) ; « Ton cap » en ligne sur 12, sous un filet.
  const ligneCap = caps && (
    // s26 parcours connecté, tour 2 (200 % de texte, 188 x 406 : premier parcours à 895 px pour 812 au plus) : sous
    // 300 px, filet à 8 px au lieu de 24 (`max-e300:*`), comme les autres resserrages de l'en-tête de l'abonné.
    <div className={cn(etape && "mt-6 border-t border-border pt-6 max-e300:mt-2 max-e300:pt-2")}>
      <TonCap enLigne cap={caps.cap} serie={caps.serie} ecart={caps.ecart} />
    </div>
  );
  const avancee = etape ? P.etapeSurTotal(etape.ordre, etape.total) : "";

  return (
    <section aria-labelledby={etape ? "en-cours-titre" : undefined} data-testid="carte-en-cours" className={cn(CADRE_CARTE_NEUTRE, "p-6 max-e300:px-3 max-e300:py-2", className)}>
      {etape && (
        <div className="grid gap-y-4 max-e300:gap-y-2 lg:grid-cols-12 lg:gap-x-6">
          <div className="min-w-0 lg:col-span-9">
            <p className={ETIQUETTE}>{etape.enCours ? E.enCours : E.conseillee}</p>
            <h2 id="en-cours-titre" className={cn(TITRE_CARTE, "mt-2 max-e300:mt-1")}>
              {etape.titreParcours}
            </h2>
            <p className={cn(TEXTE_FORT, "mt-2 [overflow-wrap:anywhere] max-e300:mt-1")}>{frEspace(etape.titreEtape)}</p>
          </div>
          <Link
            ref={ref}
            href={etape.href}
            data-testid="carte-en-cours-reprendre"
            className={cn(
              buttonVariants({ variant: "primary", size: "lg" }),
              "h-auto min-h-12 w-full whitespace-normal py-2 sm:w-auto sm:justify-self-start sm:px-8 lg:col-span-3 lg:self-center lg:justify-self-end max-e300:min-h-11",
            )}
          >
            {etape.enCours ? E.reprendre : E.commencerEtape1.replace("1", String(etape.ordre))}
          </Link>
          {barre && (
            <>
              <BarreSegmentee faites={etape.ordre - 1} total={etape.total} enCours={etape.ordre} texte={avancee} className="min-w-0 lg:col-span-9 lg:self-center" />
              <p className={cn(META, "tabular-nums max-lg:-mt-2 lg:col-span-3 lg:self-center lg:justify-self-end")} aria-hidden="true">
                {avancee}
              </p>
            </>
          )}
        </div>
      )}
      {ligneCap}
    </section>
  );
});
