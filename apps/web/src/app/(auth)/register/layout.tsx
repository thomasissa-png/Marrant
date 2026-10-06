import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription : apprends à devenir drôle",
  description:
    "Crée ton compte pour activer l'accès complet : parcours, listes et carnet, dès 2,99 €/mois.",
  robots: { index: false, follow: false },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
