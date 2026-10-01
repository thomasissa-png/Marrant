import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription : apprends à devenir drôle",
  description:
    "Crée ton compte sur deviens-marrant.fr et commence à progresser en humour dès 4,99 €/mois.",
  robots: { index: false, follow: false },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
