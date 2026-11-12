"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { TEXTES_AUJOURDHUI as T } from "@/config/textes/espace-aujourdhui";
import {
  CLE_ORIGINE,
  CLE_QUIZ,
  choisirPremierPas,
  lireProfilQuiz,
  type EntreeDisponible,
  type OrigineResolue,
} from "@/lib/espace/premier-pas";
import { cn } from "@/lib/utils";

/**
 * « Ton premier pas » (architecture 4.4 état 1, maquette `aujourdhui.html#etat=pas`) : la seule
 * action principale du jour 1, un seul « Commencer ». Le lien de retour (résolu en base par la page)
 * est gardé dans ce navigateur pour les visites suivantes ; le résultat du quiz n'existe que dans
 * ce navigateur (`localStorage`, jamais sur le compte, 4.2). Premier rendu (serveur) : le signal du
 * serveur seul ; le quiz est appliqué après le montage.
 * Test N4 d'E5 : sous 640 px, la carte s'étire pour que le contenu du jour reste hors du premier
 * écran (hauteur de l'écran moins l'en-tête, la barre, le titre et les marges ; avec la ligne du
 * favori, d'autant plus).
 */
function lireStockage(cle: string): string | null {
  try {
    return localStorage.getItem(cle);
  } catch {
    return null;
  }
}

function lireOrigineGardee(): OrigineResolue | null {
  try {
    const o = JSON.parse(lireStockage(CLE_ORIGINE) ?? "null") as OrigineResolue | null;
    return o && typeof o.titre === "string" && typeof o.href === "string" && o.href.startsWith("/") ? o : null;
  } catch {
    return null;
  }
}

export function PremierPas({
  origine,
  entrees,
  avecBandeau = false,
}: {
  origine: OrigineResolue | null;
  entrees: readonly EntreeDisponible[];
  avecBandeau?: boolean;
}) {
  const [pas, setPas] = useState(() => choisirPremierPas(origine, null, entrees, T.premierPas.sceneParDefaut));

  useEffect(() => {
    if (origine) {
      try {
        localStorage.setItem(CLE_ORIGINE, JSON.stringify(origine));
      } catch {
        // Stockage refusé (navigation privée) : le signal vaut pour cette visite seulement.
      }
    }
    const signal = origine ?? lireOrigineGardee();
    setPas(choisirPremierPas(signal, lireProfilQuiz(lireStockage(CLE_QUIZ)), entrees, T.premierPas.sceneParDefaut));
  }, [origine, entrees]);

  return (
    <section
      aria-labelledby="premier-pas-titre"
      data-source={pas.source}
      className={cn(
        "flex flex-col rounded-lg border border-border bg-background-card p-6 lg:p-6",
        avecBandeau ? "max-sm:min-h-[calc(100svh-29.5rem)]" : "max-sm:min-h-[calc(100svh-22.75rem)]",
        "max-e300:min-h-0 max-e300:p-3",
      )}
    >
      <div>
        <p className="text-xs font-semibold text-text-muted">{T.premierPas.eyebrow}</p>
        <h2 id="premier-pas-titre" className="mt-3 font-display text-2xl font-bold text-text-primary [overflow-wrap:anywhere] lg:text-xl max-e300:text-base">
          {pas.titre}
        </h2>
      </div>
      <div className="mt-auto flex flex-col pt-4 max-e300:flex-row max-e300:flex-wrap max-e300:items-center max-e300:gap-2 max-e300:pt-2">
        {pas.minutes !== null && <p className="text-sm text-text-secondary">{T.premierPas.duree(pas.minutes)}</p>}
        <Link
          href={pas.href}
          className={cn(
            buttonVariants({ variant: "primary" }),
            "mt-3 h-12 w-full whitespace-normal max-md:h-12 sm:w-auto sm:self-start sm:px-8 max-e300:mt-0 max-e300:h-11 max-e300:min-w-0 max-e300:flex-1",
          )}
        >
          {T.premierPas.bouton}
        </Link>
      </div>
    </section>
  );
}
