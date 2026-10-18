import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * s21 (CLS de /abonnement) : compte connecté ou non, lu dans le cookie de session au rendu
 * d'une page déjà dynamique. Session JWT : aucune requête en base, sauf rafraîchissement du
 * plan (toutes les 5 min). Erreur : `false`, la page retombe sur la session client comme avant.
 */
export async function lireConnecteServeur(): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);
    return Boolean((session?.user as { id?: string } | undefined)?.id);
  } catch {
    return false;
  }
}
