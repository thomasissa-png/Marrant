import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { formatCarnetMonth, listPublishedCarnets } from "@/lib/carnet";
import { isPremiumPlan } from "@/lib/parcours-access";
import { readSessionCompte } from "@/lib/session-plan";
import type { CarnetListe } from "@/lib/espace/carnet-liste";
import { CarnetListeDetail } from "@/components/espace/carnet/carnet-liste-detail";

/**
 * Ouvert : visiteur et inscrit gratuit, aucune enveloppe (la page rend l'aperçu : fiche offerte, titres fermés,
 * offre). Abonné : les carnets publiés réduits à leur liste (numéro, titre, contexte ; l'abonné a déjà tout).
 */
async function ListeDetailAbonne({ children }: { children: React.ReactNode }) {
  const compte = await readSessionCompte();
  if (!isPremiumPlan(compte?.plan)) return <>{children}</>;
  const carnets: CarnetListe[] = listPublishedCarnets().map((c) => ({
    mois: c.mois,
    libelle: formatCarnetMonth(c.mois),
    titre: c.titre,
    intro: c.intro,
    lignes: c.fiches.map((f, i) => ({ id: f.id, numero: i + 1, titre: f.titre, contexte: f.contexte })),
  }));
  if (carnets.length === 0) return <>{children}</>;
  return <CarnetListeDetail carnets={carnets}>{children}</CarnetListeDetail>;
}

/**
 * s26 carnet liste et détail (`docs/ux/carnet-audit-s26.md` §3) : la liste du carnet de l'abonné est un LAYOUT qui reste
 * monté ; seule la fiche (`/carnet/<mois>/<n>`, ou la n° 1 du filtre sur `/carnet` et `/carnet/<mois>`) change à droite
 * dès 1024. Rendu : celui des pages (dynamique, plan lu en base, jamais de cache partagé).
 *
 * Interrupteur FERMÉ : aucune enveloppe, aucune lecture, layout synchrone (les pages rendent `CarnetPage` d'avant, au
 * caractère près ; la tête de la page aussi, un layout asynchrone en déplaçait la balise `theme-color`).
 */
export default function CarnetLayout({ children }: { children: React.ReactNode }) {
  if (!ESPACE_CLIENT_PUBLIE) return children;
  return <ListeDetailAbonne>{children}</ListeDetailAbonne>;
}
