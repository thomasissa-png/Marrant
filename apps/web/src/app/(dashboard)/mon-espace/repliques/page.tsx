import type { Metadata } from "next";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { garderEspace } from "@/lib/espace/garde";
import { listerRepliques } from "@/lib/espace/repliques";
import { TEXTES_REPLIQUES as R } from "@/config/textes/espace-repliques";
import { ListeRepliques } from "@/components/espace/repliques/liste-repliques";

/**
 * « Mes répliques » (s24, lot D5 ; architecture v20 2.7 ; maquette `mes-repliques.html`) : la plus
 * récente d'abord, la réplique entière et le titre de sa fiche (lien), « Modifier » et « Supprimer » avec
 * confirmation. Rendu : SSR dynamique (données de l'abonné, jamais en cache). Garde EN PREMIER. L'état
 * « abonnement terminé » (lecture seule) vit dans « Mon profil » (lot D10) : la garde envoie tout compte
 * sans abonnement actif vers `/abonnement`.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return ESPACE_CLIENT_PUBLIE ? { title: R.titre } : METADONNEES_404;
}

export default async function MesRepliquesPage() {
  const { userId } = await garderEspace("/mon-espace/repliques");
  const repliques = await listerRepliques(userId, { acces: "ouvert", userId });
  return (
    <div className="flex flex-col gap-6 pb-12 lg:max-w-lecture">
      <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl max-e300:text-2xl">{R.titre}</h1>
      <ListeRepliques initiales={repliques} lectureSeule={false} />
    </div>
  );
}
