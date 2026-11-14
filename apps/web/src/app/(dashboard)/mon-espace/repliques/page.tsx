import type { Metadata } from "next";
import { COLONNE_LECTURE } from "@/components/layout/gabarit";
import { PageHeader } from "@/components/layout/page-header";
import { RetourDe } from "@/components/espace/lien-retour";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { garderEspace } from "@/lib/espace/garde";
import { listerRepliques } from "@/lib/espace/repliques";
import { TEXTES_REPLIQUES } from "@/config/textes/espace-repliques";
import { ListeRepliques } from "@/components/espace/repliques/liste-repliques";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const R = frEspaceProfond(TEXTES_REPLIQUES);

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
    // Relecture des captures nav s24, tour 2 (design F2, F3) : gabarit B ; sans contenu, la page passe en colonne
    // de lecture (retour, titre et état vide dans la même colonne de 768 px, jamais un titre à gauche et une carte
    // centrée).
    <div className={repliques.length === 0 ? COLONNE_LECTURE : undefined}>
      <RetourDe chemin="/mon-espace/repliques" />
      <PageHeader title={R.titre} />
      <ListeRepliques initiales={repliques} lectureSeule={false} />
    </div>
  );
}
