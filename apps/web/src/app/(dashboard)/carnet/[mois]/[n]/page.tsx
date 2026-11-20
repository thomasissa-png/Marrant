// Stratégie de rendu : SSR dynamique (contenu de l'abonné, plan lu en base, jamais de cache partagé). Contenu payant :
// noindex, absent du sitemap. Gardes (404, 307 du non-abonné) dans le layout de ce segment, au-dessus du chargement.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { getCarnetByMonth, listCarnetMonths } from "@/lib/carnet";
import { numeroDe } from "@/lib/espace/carnet-liste";
import { NOINDEX_ROBOTS } from "@/lib/seo-meta";
import { PanneauCarnet } from "@/components/espace/carnet/panneau-carnet";

export const dynamic = "force-dynamic";

type Params = { mois: string; n: string };

function lire(params: Params) {
  const carnet = getCarnetByMonth(params.mois);
  const numero = carnet ? numeroDe(params.n, carnet.fiches.length) : null;
  return carnet && numero !== null ? { carnet, numero } : null;
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const lu = ESPACE_CLIENT_PUBLIE ? lire(params) : null;
  if (!lu) return METADONNEES_404;
  return { title: lu.carnet.fiches[lu.numero - 1].titre, ...NOINDEX_ROBOTS };
}

/**
 * s26 carnet liste et détail (`docs/ux/carnet-audit-s26.md` §3) : une fiche du carnet de l'abonné, adresse propre
 * `/carnet/<mois>/<n>` (n = numéro de la fiche dans le carnet). Dès 1024 dans le panneau de droite, la liste du layout
 * de `/carnet` restant montée ; sous 1024 plein écran, avec « Retour : Carnet » (posé par ce layout). Le non-abonné
 * n'arrive jamais ici (307 du layout du segment).
 */
export default function FicheCarnetPage({ params, searchParams }: { params: Params; searchParams: { contexte?: string | string[] } }) {
  if (!ESPACE_CLIENT_PUBLIE) notFound();
  const lu = lire(params);
  if (!lu) notFound();
  const { carnet, numero } = lu;
  return (
    <PanneauCarnet
      mois={carnet.mois}
      courant={carnet.mois === listCarnetMonths()[0]}
      fiches={carnet.fiches}
      numero={numero}
      contexteBrut={searchParams.contexte}
    />
  );
}
