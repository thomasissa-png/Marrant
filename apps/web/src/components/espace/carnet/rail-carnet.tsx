"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
import { META, META_FORT } from "@/components/espace/typo";

export type LigneRail = { id: string; numero: number; titre: string };

/**
 * Rail des fiches du carnet de l'abonné, dès 1024 px (s26, design §4) : liste compacte numéro et titre, collante, la
 * fiche en cours de lecture marquée (filet BLANC de 2 px, `META_FORT` : la ligne reste en 14 px, `aria-current`), suivie au défilement. Aucune
 * donnée « lu » n'existe pour le carnet : la position courante vient seulement de l'écran, rien n'est enregistré.
 * Masqué sous 1024 px (le sommaire en tuiles est en tête). Titres déjà mis en forme côté serveur.
 * s26 tour 3 (fautes dures des relectures du tour 2 : à 1280 x 900, le rail montrait 17 lignes sur 30 et la ligne
 * courante des fiches 18 à 30 restait hors de vue) : quand la fiche courante change, le rail défile jusqu'à sa ligne,
 * au plus près (comme `scrollIntoView({ block: "nearest" })`) mais calculé à la main sur le `<nav>` : `scrollIntoView`
 * fait aussi défiler les ancêtres, et peut interrompre le défilement doux de la page vers une ancre ; ici, la page ne
 * bouge jamais. Numéros à largeur fixe (`tabular-nums` et `min-w-6`, en px : une largeur en ch suivrait la graisse 600
 * de la ligne courante) : titres alignés de 1 à 30 (9 px d'écart avant). `py-2` par ligne : les titres sur deux lignes
 * n'ont plus 0 px d'air (cible de 44 px gardée).
 */
export function RailCarnet({ lignes, titreId }: { lignes: LigneRail[]; titreId: string }) {
  const [courante, setCourante] = useState(lignes[0]?.id);
  const rail = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observateur = new IntersectionObserver(
      (entrees) => {
        const visible = entrees.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        const id = visible?.target.getAttribute("data-carnet-fiche");
        if (id) setCourante(id);
      },
      // Bande de lecture : sous l'en-tête collant, sur le tiers haut de l'écran.
      { rootMargin: "-120px 0px -60% 0px" },
    );
    for (const l of lignes) {
      const fiche = document.getElementById(`fiche-${l.id}`);
      if (fiche) observateur.observe(fiche);
    }
    return () => observateur.disconnect();
  }, [lignes]);

  useEffect(() => {
    const nav = rail.current;
    const ligne = nav?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!nav || !ligne) return;
    const n = nav.getBoundingClientRect();
    const l = ligne.getBoundingClientRect();
    // La ligne s'arrête à la marge intérieure du rail (24 px), pas contre son bord.
    const marge = parseFloat(getComputedStyle(nav).paddingTop) || 0;
    if (l.top < n.top + marge) nav.scrollTop += l.top - n.top - marge;
    else if (l.bottom > n.bottom - marge) nav.scrollTop += l.bottom - n.bottom + marge;
  }, [courante]);

  return (
    <nav ref={rail} aria-labelledby={titreId} className={cn(CADRE_CARTE_NEUTRE, "max-h-[calc(100vh-7rem)] overflow-y-auto p-6")} data-carnet-rail>
      <ol>
        {lignes.map((l) => {
          const ici = l.id === courante;
          return (
            <li key={l.id}>
              <a
                href={`#fiche-${l.id}`}
                aria-current={ici ? "location" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-2 border-l-2 px-4 py-2 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
                  ici ? cn("border-text-primary", META_FORT) : cn("border-transparent", META),
                )}
              >
                <span className="min-w-6 shrink-0 tabular-nums">{l.numero}.</span>
                <span className="min-w-0">{l.titre}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
