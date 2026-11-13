import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { garderEspace } from "@/lib/espace/garde";
import { lireFil } from "@/lib/espace/questions";
import { FORMAT_CLE } from "@/lib/espace/api";
import { TEXTES_QUESTIONS as Q } from "@/config/textes/espace-questions";
import { LIEN } from "@/components/espace/carte/styles";
import { FilOuvert } from "@/components/espace/questions/fil-ouvert";

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
        <Link href="/mon-espace/questions" className={LIEN}>
          {Q.titre}
        </Link>
        <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl max-e300:text-2xl">{Q.types[fil.type].nom}</h1>
      </div>
      <FilOuvert fil={fil} />
    </div>
  );
}
