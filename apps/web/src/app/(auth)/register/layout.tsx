import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription",
  description: "Crée ton compte sur deviensmarrant.fr et commence à progresser en humour gratuitement.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
