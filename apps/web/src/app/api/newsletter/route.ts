import { NextResponse } from "next/server";

/**
 * Inscription newsletter désactivée (décision de Thomas, 01/10/2026).
 *
 * Le formulaire promettait un envoi hebdomadaire qui n'a jamais existé (aucun
 * code d'envoi, 0 inscrit). Formulaire retiré du site ; la route renvoie 410
 * sans rien écrire. La table `NewsletterSubscriber` et les routes de
 * confirmation et de désinscription sont conservées : une newsletter mensuelle
 * préparée viendra plus tard et réactivera la collecte avec un nouveau texte
 * de consentement. L'implémentation précédente reste dans l'historique git.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Les inscriptions sont fermées pour le moment." },
    { status: 410 },
  );
}
