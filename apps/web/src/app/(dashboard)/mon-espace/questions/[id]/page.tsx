import type { Metadata } from "next";
import { LienRetour } from "@/components/espace/lien-retour";
import { notFound } from "next/navigation";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { garderEspace } from "@/lib/espace/garde";
import { lireFil } from "@/lib/espace/questions";
import { FORMAT_CLE } from "@/lib/espace/api";
import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import { FilOuvert } from "@/components/espace/questions/fil-ouvert";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const Q = frEspaceProfond(TEXTES_QUESTIONS);

/**
 * Un fil de « Mes questions », ouvert (s24, lot D7) : adresse d'arrivée du lien de la cloche (lot D8,
 * « L'équipe t'a répondu »). L'ouverture rend ses réponses lues. Fil d'un autre compte ou inexistant : la
 * 404 (jamais distingués). Rendu : SSR dynamique. Garde EN PREMIER : 404 interrupteur fermé.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return ESPACE_CLIENT_PUBLIE ? { title: Q.titre } : METADONNEES_404;
}

export default async function FilQuestionPage({ params }: { params: { id: string } }) {
  const { userId } = await garderEspace(`/mon-espace/questions/${params.id}`);
  const fil = FORMAT_CLE.test(params.id) ? await lireFil(userId, params.id) : null;
  if (!fil) notFound();
  return (
    <div className="flex flex-col gap-6 pb-12 lg:max-w-lecture">
      <div>
        <LienRetour href="/mon-espace/questions">{Q.titre}</LienRetour>
        <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl max-e300:text-2xl">{Q.types[fil.type].nom}</h1>
      </div>
      <FilOuvert fil={fil} />
    </div>
  );
}
