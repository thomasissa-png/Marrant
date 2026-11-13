import { cache } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { prisma } from "@/lib/prisma";
import { NOT_FOUND_ROBOTS } from "@/lib/seo-meta";
import { garderEspace } from "@/lib/espace/garde";
import { chargeursFiches } from "@/lib/espace/fiches";
import { lireRetour } from "@/lib/espace/fiche-fait";
import { lireReplique } from "@/lib/espace/repliques";
import { lettresEnvoyees } from "@/lib/espace/lettres";
import { COOKIE_COIN, coinEntre } from "@/lib/espace/humour-noir";
import { TEXTES_BIBLIOTHEQUE, TEXTES_LETTRES } from "@/config/textes/espace-bibliotheque";
import { FicheVue } from "@/components/espace/fiche";
import { CoinHumourNoir } from "@/components/espace/coin-humour-noir";
import { hrefLettre } from "@/components/espace/archive-lettres";

/**
 * Page d'une fiche de l'espace (s24, lot D6 ; adresse unique `hrefFiche`, une seule porte par fiche,
 * architecture v20 6.1) : abonné actif seulement (les chargeurs ne servent aucune fiche ni exercice à un
 * non Premium). La vraie 404 du site, identique à une adresse inexistante, si la fiche est inconnue, d'un
 * autre type que l'adresse, ou reprise d'une lettre pas encore envoyée (2.8). Fiche du coin « Humour noir,
 * fait bien » et navigateur non « entré » : l'écran d'entrée du coin, jamais le contenu (3.12). Rendu :
 * SSR dynamique (« Fait » et réplique de l'abonné, jamais en cache). Garde EN PREMIER.
 */
export const dynamic = "force-dynamic";

type Params = { type: string; id: string };

const ficheDeLaPage = cache(async ({ type, id }: Params) => {
  const { userId } = await garderEspace(`/mon-espace/fiche/${type}/${id}`);
  const fiche = chargeursFiches.trouverFiche(id, { acces: "ouvert", userId });
  if (!fiche || fiche.type !== type) return null;
  let lettre: { titre: string; href: string } | null = null;
  if (fiche.repriseDeLettre) {
    const titre = (await lettresEnvoyees(prisma)).get(fiche.repriseDeLettre);
    if (!titre) return null;
    lettre = { titre: TEXTES_LETTRES.vuDans(titre), href: hrefLettre(fiche.repriseDeLettre) };
  }
  return { userId, fiche, lettre };
});

const estAuSeuil = (fiche: { type: string }) => fiche.type === "humour-noir" && !coinEntre(cookies().get(COOKIE_COIN)?.value);

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  if (!ESPACE_CLIENT_PUBLIE) return METADONNEES_404;
  const lu = await ficheDeLaPage(params);
  if (!lu) return { title: "Page introuvable", ...NOT_FOUND_ROBOTS };
  // Coin non « entré » : pas même le titre de la fiche dans la page (3.12).
  return { title: estAuSeuil(lu.fiche) ? TEXTES_BIBLIOTHEQUE.titre : lu.fiche.titre };
}

export default async function FichePage({ params }: { params: Params }) {
  const lu = await ficheDeLaPage(params);
  if (!lu) notFound();
  const { userId, fiche, lettre } = lu;
  if (estAuSeuil(fiche)) {
    return (
      <div className="flex flex-col gap-6 pb-12 lg:max-w-3xl">
        <h1 className="sr-only">{TEXTES_BIBLIOTHEQUE.titre}</h1>
        <CoinHumourNoir lignesInitiales={null} />
      </div>
    );
  }
  const [retour, replique] = fiche.geste ? await Promise.all([lireRetour(userId, fiche.id), lireReplique(userId, fiche.id)]) : [null, null];
  return (
    <div className="pb-12 lg:max-w-3xl">
      <FicheVue fiche={fiche} retour={retour} replique={replique} lettre={lettre} />
    </div>
  );
}
