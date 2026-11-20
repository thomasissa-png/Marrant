import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { NOT_FOUND_ROBOTS } from "@/lib/seo-meta";
import { garderEspace } from "@/lib/espace/garde";
import { ADRESSE_LISTE_BIBLIOTHEQUE, CLES_BIBLIOTHEQUE } from "@/lib/espace/bibliotheque-liste";
import { TEXTES_BIBLIOTHEQUE } from "@/config/textes/espace-bibliotheque";
import { PanneauTechnique, chargerBibliotheque, donneesPanneauBibliotheque, lettreDeTechnique } from "@/components/espace/bibliotheque/panneau";
import { RetourListeDetail } from "@/components/espace/liste-detail/navigation";
import { frEspaceProfond } from "@/lib/fr-typo";

const T = frEspaceProfond(TEXTES_BIBLIOTHEQUE);

/**
 * s26 bibliothèque liste et détail : une technique de la Bibliothèque (« Comment c'est construit », « Vocabulaire »,
 * « Formules à détourner », « Écouter, repérer »), adresse propre et partageable `/mon-espace/bibliotheque/[id]`
 * (l'ancienne `/mon-espace/fiche/{type}/[id]` répond 308, ouvert seulement). Dès 1024 dans le panneau de droite, la
 * liste du layout restant montée ; sous 1024 plein écran, avec « Retour » (`router.back()` depuis la liste, sinon lien
 * vers la liste). Rendu : SSR dynamique (« Fait » et réplique de l'abonné, jamais en cache). Garde EN PREMIER.
 * Technique inconnue, d'un autre type, ou reprise d'une lettre pas encore envoyée : la vraie 404 du site. Le coin
 * « Humour noir » et les bonus gardent leur adresse (seuil et cookie d'entrée, cap de déblocage).
 */
export const dynamic = "force-dynamic";

type Params = { id: string };

// `cache` existe dans le React de Next (serveur) ; absent du React 18 de Jest : lecture simple, même résultat.
const parRequete: <F extends (id: string) => Promise<unknown>>(f: F) => F = React.cache ?? ((f) => f);

const ficheDeLaPage = parRequete(async (id: string) => {
  const { userId } = await garderEspace(`${ADRESSE_LISTE_BIBLIOTHEQUE}/${id}`);
  const donnees = await chargerBibliotheque(userId);
  const voulu = decodeURIComponent(id);
  const fiche = donnees.ordre.find((f) => f.id === voulu);
  return fiche ? { userId, fiche, ...donnees } : null;
});

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  if (!ESPACE_CLIENT_PUBLIE) return METADONNEES_404;
  const lu = await ficheDeLaPage(params.id);
  return lu ? { title: lu.fiche.titre } : { title: "Page introuvable", ...NOT_FOUND_ROBOTS };
}

export default async function FicheBibliothequePage({ params }: { params: Params }) {
  if (!ESPACE_CLIENT_PUBLIE) notFound();
  const lu = await ficheDeLaPage(params.id);
  if (!lu) notFound();
  const { userId, fiche, ordre, faits } = lu;
  const lettre = await lettreDeTechnique(fiche);
  if (lettre === undefined) notFound();
  return (
    <div className="min-w-0">
      {/* Sous 1024 seulement (dès 1024 la liste est à gauche) : même place que le « Retour » des autres fiches. */}
      <div className="mb-4 lg:hidden">
        <RetourListeDetail href={ADRESSE_LISTE_BIBLIOTHEQUE} label={T.titre} cles={CLES_BIBLIOTHEQUE} />
      </div>
      <PanneauTechnique {...await donneesPanneauBibliotheque({ userId, fiche, lettre, ordre, faits })} />
    </div>
  );
}
