/**
 * v6 tour 1 (arbitrage 3, Thomas 15/11) : l'aperçu de Favoris montre deux contenus RÉELS en lecture seule, la
 * première vanne et le premier conseil gratuits du catalogue (page 1 de `/vannes` et de `/conseils`, mêmes données
 * publiques, mêmes règles : la plus récente est toujours ouverte sans abonnement, interrupteur ouvert ou fermé).
 * Aucun texte nouveau, aucun favori d'abonné. Base indisponible ou catalogue vide : `null`, et l'aperçu garde
 * l'état vide existant de la page (`TEXTES_APERCU.favorisVide`).
 */
import { getJokesPage, getTipsPage, type PublicJoke, type PublicTip } from "@/lib/catalogue-pages";

export type ExemplesFavoris = { vanne: PublicJoke; conseil: PublicTip };

export async function lireExemplesFavoris(): Promise<ExemplesFavoris | null> {
  const [vannes, conseils] = await Promise.all([getJokesPage(1), getTipsPage(1)]);
  const vanne = vannes?.items[0];
  const conseil = conseils?.items[0];
  return vanne && conseil ? { vanne, conseil } : null;
}
