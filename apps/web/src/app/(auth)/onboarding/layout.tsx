import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Découvre ton profil humour",
  description: "Réponds à 3 questions pour découvrir ton style d'humour et obtenir un parcours personnalisé.",
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
