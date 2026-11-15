import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { garderEspace } from "@/lib/espace/garde";
import { lireLecteurApercu } from "@/components/espace/apercu/acces";
import { ApercuRubrique, metadonneesApercu } from "@/components/espace/apercu/apercu-rubrique";
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
  if (!ESPACE_CLIENT_PUBLIE) return METADONNEES_404;
  // Nav v6 (lot B) : visiteur et inscrit gratuit, l'aperçu (`noindex, follow`) ; sinon la tête d'avant.
  return (await lireLecteurApercu()) ? metadonneesApercu("mesQuestions") : { title: Q.titre };
}

export default async function MesQuestionsPage() {
  // Nav v6 (lot B) : 404 interrupteur fermé (avant toute lecture) ; visiteur et inscrit gratuit, l'aperçu à cette
  // adresse, sans redirection ; sinon la garde d'avant (abonné actif : la rubrique ; ancien abonné : /abonnement).
  const lecteur = await lireLecteurApercu();
  if (lecteur) return <ApercuRubrique rubrique="mesQuestions" visiteur={lecteur === "visiteur"} />;
  const { userId } = await garderEspace("/mon-espace/questions");
  const fils = await listerFils(userId);
  return (
    <div>
      {/* v5 §3, gabarit B. */}
      <PageHeader title={Q.titre} />
      <MesQuestions initiaux={fils} lectureSeule={false} />
    </div>
  );
}
