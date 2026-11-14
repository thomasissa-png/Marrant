import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { RetourDe } from "@/components/espace/lien-retour";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { prisma } from "@/lib/prisma";
import { garderEspace } from "@/lib/espace/garde";
import { listerLettres } from "@/lib/espace/lettres";
import { TEXTES_LETTRES } from "@/config/textes/espace-bibliotheque";
import { ArchiveLettres } from "@/components/espace/archive-lettres";
import { compterAnonyme } from "@/lib/espace/compteurs";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_LETTRES);

/**
 * « Lettres » (s24, lot D6 ; architecture v20 2.8, ligne de « Plus », groupe « Le reste ») : toutes les
 * lettres envoyées, à tout abonné actif, lettres antérieures à son abonnement comprises ; une lettre n'y
 * entre qu'à son premier envoi réussi. Rendu : SSR dynamique (jamais en cache, l'horloge décide). Garde EN
 * PREMIER : 404 interrupteur fermé, archive illisible. Lot D10 (architecture 7.7 point 6) : chaque affichage
 * ajoute 1 au compteur ANONYME `ouverture` / `archive-lettres` (aucun compte), awaité avant le rendu.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return ESPACE_CLIENT_PUBLIE ? { title: T.titre } : METADONNEES_404;
}

export default async function LettresPage() {
  await garderEspace("/mon-espace/lettres");
  const lettres = await listerLettres(prisma);
  await compterAnonyme({ cle: "ouverture", valeur: "archive-lettres" });
  return (
    <div>
      {/* v5 §3, gabarit B. */}
      <RetourDe chemin="/mon-espace/lettres" />
      <PageHeader title={T.titre} />
      <ArchiveLettres lettres={lettres} />
    </div>
  );
}
