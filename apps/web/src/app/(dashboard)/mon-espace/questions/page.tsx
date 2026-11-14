import type { Metadata } from "next";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { garderEspace } from "@/lib/espace/garde";
import { listerFils } from "@/lib/espace/questions";
import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import { MesQuestions } from "@/components/espace/questions/mes-questions";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const Q = frEspaceProfond(TEXTES_QUESTIONS);

/**
 * « Mes questions » (s24, lot D7 ; architecture v20 2.6 ; maquette `mes-questions.html`) : écrire à l'équipe
 * et retrouver tout son historique (envoyé, en retard, répondu, « Continuer », « Retirer de mon
 * historique »). Rendu : SSR dynamique (données de l'abonné, jamais en cache). Garde EN PREMIER : 404
 * interrupteur fermé. L'état « abonnement terminé » (lecture seule) vit dans « Mon profil » (lot D10) : la
 * garde envoie tout compte sans abonnement actif vers `/abonnement` ; l'API et le composant le servent déjà.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return ESPACE_CLIENT_PUBLIE ? { title: Q.titre } : METADONNEES_404;
}

export default async function MesQuestionsPage() {
  const { userId } = await garderEspace("/mon-espace/questions");
  const fils = await listerFils(userId);
  return (
    <div className="flex flex-col gap-6 pb-12">
      <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl max-e300:text-2xl">{Q.titre}</h1>
      <MesQuestions initiaux={fils} lectureSeule={false} />
    </div>
  );
}
