import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abonnement — accès complet à 0,99 €/mois",
  description:
    "Abonne-toi à deviens-marrant.fr pour accéder à toutes les vannes, conseils, vidéos stand-up et parcours. Sans engagement, annulable à tout moment.",
  alternates: { canonical: "https://deviens-marrant.fr/abonnement" },
};

export default function AbonnementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
