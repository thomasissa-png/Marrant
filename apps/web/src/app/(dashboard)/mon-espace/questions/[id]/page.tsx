import type { Metadata } from "next";
import { LienRetour } from "@/components/espace/lien-retour";
import { notFound } from "next/navigation";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { garderEspace } from "@/lib/espace/garde";
import { lireFil, listerFils } from "@/lib/espace/questions";
import { FORMAT_CLE } from "@/lib/espace/api";
import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import { FilOuvert } from "@/components/espace/questions/fil-ouvert";
import { RailFils } from "@/components/espace/questions/rail-fils";
import { TITRE_PAGE } from "@/components/espace/typo";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const Q = frEspaceProfond(TEXTES_QUESTIONS);

/**
 * Un fil de « Mes questions », ouvert (s24, lot D7) : adresse d'arrivée du lien de la cloche (lot D8,
 * « L'équipe t'a répondu »). L'ouverture rend ses réponses lues. Fil d'un autre compte ou inexistant : la
 * 404 (jamais distingués). Rendu : SSR dynamique. Garde EN PREMIER : 404 interrupteur fermé.
 * s26 (`docs/ux/questions-repliques-lettre-profil-s26.md` §1.2, design §3) : fini la colonne seule centrée. Grille de
 * 12 colonnes : le fil en 8 (une conversation se lit en 600 à 760 px), le rail des autres fils en 4, collant ; sous
 * 1024, le retour en haut, le fil, puis le rail. Le retrait reste dans la carte du fil (confirmation existante).
 */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return ESPACE_CLIENT_PUBLIE ? { title: Q.titre } : METADONNEES_404;
}

export default async function FilQuestionPage({ params }: { params: { id: string } }) {
  const { userId } = await garderEspace(`/mon-espace/questions/${params.id}`);
  const fil = FORMAT_CLE.test(params.id) ? await lireFil(userId, params.id) : null;
  if (!fil) notFound();
  const fils = await listerFils(userId);
  return (
    <div className="pb-16">
      <header>
        <LienRetour href="/mon-espace/questions" label={Q.titre} />
        <h1 className={TITRE_PAGE}>{Q.types[fil.type].nom}</h1>
      </header>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:items-start">
        <div className="min-w-0 md:col-span-2 lg:col-span-8 lg:max-w-[47.5rem]" data-fil-colonne>
          <FilOuvert fil={fil} />
        </div>
        <RailFils fils={fils} courant={fil.id} className="md:col-span-2 lg:col-span-4" />
      </div>
    </div>
  );
}
