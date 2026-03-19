import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription — Apprends à devenir drôle",
  description:
    "Crée ton compte sur deviens-marrant.fr et commence à progresser en humour dès 0,99 €/mois.",
  keywords: ["inscription humour", "créer compte deviens-marrant", "apprendre humour"],
  alternates: {
    canonical: "https://deviens-marrant.fr/register",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
