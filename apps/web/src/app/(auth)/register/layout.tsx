import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription",
  description: "Crée ton compte sur deviens-marrant.fr et commence à progresser en humour dès 0,99 €/mois.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
