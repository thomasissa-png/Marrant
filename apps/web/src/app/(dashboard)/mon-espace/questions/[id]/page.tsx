import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { garderEspace } from "@/lib/espace/garde";
import { lireFil } from "@/lib/espace/questions";
import { FORMAT_CLE } from "@/lib/espace/api";
import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import { FilOuvertPanneau } from "@/components/espace/questions/pages-questions";
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
  // s26 contrôle d'ensemble, abonné (C6) : en-tête et liste des fils dans le layout (`QuestionsListeDetail`), qui reste
  // monté ; cette page n'est plus que le fil, à droite dès 1024 (sous 1024, plein écran avec le retour du layout).
  return (
    <div className="min-w-0" data-fil-colonne>
      <FilOuvertPanneau fil={fil} />
    </div>
  );
}
