import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { garderEspace } from "@/lib/espace/garde";

/**
 * Ancienne adresse de l'archive « Lettres » (s24, lot D6). Décision de Thomas du 14/11 : « La lettre » est une
 * seule section pour tous, à `/lettre` (abonné actif : l'archive, `components/lettre/lettres-abonne-cartes.tsx` ; visiteur
 * et compte gratuit : l'inscription). Cette adresse y renvoie par une redirection permanente (308) : un seul
 * contenu, aucune copie à tenir à jour. Même garde que tout `/mon-espace` (et que son layout), EN PREMIER :
 * interrupteur fermé, 404 avant toute lecture, comme avant ; ouvert, sans session : connexion puis retour ici ;
 * sans abonnement : `/abonnement`, comme toute adresse de l'espace ; abonné : `/lettre`. Les fiches
 * `/mon-espace/lettres/[numero]` gardent leur adresse et leur contenu (leur retour mène à `/lettre`).
 * v6 tour 2 (point 10) : ouvert, le middleware renvoie cette adresse à `/lettre` (308) pour tous, avant toute
 * garde ; cette page ne reste qu'en filet (même destination).
 * Rendu : dynamique (redirection à la requête).
 */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return ESPACE_CLIENT_PUBLIE ? {} : METADONNEES_404;
}

export default async function LettresPage() {
  await garderEspace("/mon-espace/lettres");
  permanentRedirect("/lettre");
}
