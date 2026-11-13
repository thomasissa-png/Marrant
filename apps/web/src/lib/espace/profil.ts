/**
 * « Mon profil », espace ouvert (s24, lot D10) : historique en lecture seule d'un ANCIEN abonné
 * (architecture v20 2.6 « Abonnement terminé », 2.7). Serveur seulement. Fermé, visiteur, abonné actif
 * (son historique est dans l'espace) ou compte jamais abonné : rien n'est lu au-delà de l'accès, listes vides.
 */
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { lireAccesEspace } from "@/lib/espace/garde";
import { listerFils, type FilListe } from "@/lib/espace/questions";
import { listerRepliques, type RepliqueListee } from "@/lib/espace/repliques";

export async function historiqueAncienAbonne(publie: boolean = ESPACE_CLIENT_PUBLIE): Promise<{ fils: FilListe[]; repliques: RepliqueListee[] }> {
  const vide = { fils: [], repliques: [] };
  if (!publie) return vide;
  try {
    const acces = await lireAccesEspace();
    if (acces.acces !== "abonnement" || !acces.ancienAbonne) return vide;
    const [fils, repliques] = await Promise.all([listerFils(acces.userId), listerRepliques(acces.userId, acces)]);
    return { fils, repliques };
  } catch {
    // Base indisponible : la page des réglages reste utilisable, sans l'historique.
    return vide;
  }
}
