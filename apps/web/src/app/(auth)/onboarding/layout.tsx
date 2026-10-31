import type { Metadata } from "next";
import { NOINDEX_FOLLOW_ROBOTS } from "@/lib/seo-meta";

export const metadata: Metadata = {
  title: "Découvre ton profil humour",
  description: "Réponds à 3 questions pour découvrir ton style d’humour et obtenir des contenus recommandés.",
  ...NOINDEX_FOLLOW_ROBOTS,
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
