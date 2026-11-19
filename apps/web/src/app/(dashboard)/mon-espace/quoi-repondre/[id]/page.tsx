import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ESPACE_ACCUEIL, ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { NOT_FOUND_ROBOTS } from "@/lib/seo-meta";
import { garderEspace } from "@/lib/espace/garde";
import { chargeursFiches } from "@/lib/espace/fiches";
import { fichesVisibles, lettresEnvoyees } from "@/lib/espace/lettres";
import { prisma } from "@/lib/prisma";
import { idsFaits } from "@/lib/espace/lignes-fiches";
import { TYPES_QUOI_REPONDRE } from "@/lib/espace/premier-pas";
import { queryFiltres } from "@/lib/espace/quoi-repondre-liste";
import type { FicheQuoiRepondre } from "@/lib/espace/quoi-repondre";
import { TEXTES_QUOI_REPONDRE } from "@/config/textes/espace-bibliotheque";
import { PanneauFiche, chargerListeQuoiRepondre, donneesPanneau, lettreDeFiche } from "@/components/espace/quoi-repondre/panneau";
import { RetourListe } from "@/components/espace/quoi-repondre/navigation";
import { frEspaceProfond } from "@/lib/fr-typo";

const T = frEspaceProfond(TEXTES_QUOI_REPONDRE);
const BASE = `${ESPACE_ACCUEIL}/quoi-repondre`;

/**
 * s26 liste et détail : une fiche de Quoi répondre (situation ou « à plat »), adresse propre et partageable
 * `/mon-espace/quoi-repondre/[id]` (l'ancienne `/mon-espace/fiche/{situation|a-plat}/[id]` répond 308, ouvert
 * seulement). Dès 1024 dans le panneau de droite, la liste du layout restant montée ; sous 1024 plein écran, avec
 * « Retour » (`router.back()` depuis la liste, sinon lien vers la liste filtrée). Rendu : SSR dynamique (« Fait » et
 * réplique de l'abonné, jamais en cache). Garde EN PREMIER (rendu partiel de Next : le layout ne repasse pas).
 * Fiche inconnue, d'un autre type, ou reprise d'une lettre pas encore envoyée : la vraie 404 du site. Une fiche du coin
 * « Humour noir » n'est jamais servie ici (type hors rubrique : 404), cookie d'entrée ou non.
 */
export const dynamic = "force-dynamic";

type Params = { id: string };
type Recherche = Record<string, string | string[] | undefined>;

// `cache` existe dans le React de Next (serveur) ; absent du React 18 de Jest : lecture simple, même résultat.
const parRequete: <F extends (id: string) => Promise<unknown>>(f: F) => F = React.cache ?? ((f) => f);

const ficheDeLaPage = parRequete(async (id: string) => {
  const { userId } = await garderEspace(`${BASE}/${id}`);
  const fiche = chargeursFiches.trouverFiche(decodeURIComponent(id), { acces: "ouvert", userId });
  if (!fiche || !TYPES_QUOI_REPONDRE.includes(fiche.type)) return null;
  const situation = fiche as FicheQuoiRepondre;
  if (situation.repriseDeLettre && fichesVisibles([situation], await lettresEnvoyees(prisma)).length === 0) return null;
  return { userId, fiche: situation };
});

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  if (!ESPACE_CLIENT_PUBLIE) return METADONNEES_404;
  const lu = await ficheDeLaPage(params.id);
  return lu ? { title: lu.fiche.titre } : { title: "Page introuvable", ...NOT_FOUND_ROBOTS };
}

export default async function FicheQuoiRepondrePage({ params, searchParams }: { params: Params; searchParams: Recherche }) {
  if (!ESPACE_CLIENT_PUBLIE) notFound();
  const lu = await ficheDeLaPage(params.id);
  if (!lu) notFound();
  const { userId, fiche } = lu;
  const [{ filtres, ordre, faits }, lettre, faitsFiche] = await Promise.all([chargerListeQuoiRepondre(userId, searchParams), lettreDeFiche(fiche), idsFaits(userId, [fiche.id])]);
  if (lettre === undefined) notFound();
  return (
    <div className="min-w-0">
      {/* Sous 1024 seulement (dès 1024 la liste est à gauche) : même place que le « Retour » des autres fiches. */}
      <div className="mb-4 lg:hidden">
        <RetourListe href={`${BASE}${queryFiltres(filtres)}`} label={T.titre} />
      </div>
      {/* s26 liste et détail, tour 4 : les « Fait » de toute la liste filtrée (« Situation suivante » = prochaine non
          faite), plus celui de la fiche (hors filtre, elle n'y est pas). */}
      <PanneauFiche {...await donneesPanneau({ userId, fiche, lettre, ordre, filtres, faits: new Set([...faits, ...faitsFiche]) })} />
    </div>
  );
}
