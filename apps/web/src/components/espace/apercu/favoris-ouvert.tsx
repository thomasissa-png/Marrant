/**
 * `/favoris`, interrupteur OUVERT seulement (nav v6, Favoris est une rubrique Premium de la bande, coordinateur
 * 15/11) : visiteur et inscrit gratuit, l'aperçu à cette adresse (le middleware ne les redirige plus) ; abonné,
 * la page d'avant (`children`). Ancien abonné : la page d'avant aussi, dont la liste montre déjà son mur Premium
 * existant (`FavorisList`, plan relu dans la session) ; le middleware ne peut pas le distinguer d'un gratuit.
 *
 * Imports À LA DEMANDE : la page `/favoris` n'importe ainsi ni la garde ni l'aperçu tant que l'interrupteur est
 * fermé (jamais rendu ; rendu synchrone d'aujourd'hui, instantanés d'inertie inchangés, aucun code en plus).
 */
export async function FavorisOuvert({ children }: { children: React.ReactNode }) {
  const { lireLecteurApercu } = await import("@/components/espace/apercu/acces");
  const lecteur = await lireLecteurApercu();
  if (!lecteur) return <>{children}</>;
  // v6 tour 1 (arbitrage 3) : deux contenus réels du catalogue (gratuits), en lecture seule ; `null` = état vide.
  const [{ ApercuRubrique }, { lireExemplesFavoris }] = await Promise.all([
    import("@/components/espace/apercu/apercu-rubrique"),
    import("@/components/espace/apercu/exemples-favoris"),
  ]);
  const favoris = await lireExemplesFavoris();
  return <ApercuRubrique rubrique="favoris" visiteur={lecteur === "visiteur"} favoris={favoris} />;
}
