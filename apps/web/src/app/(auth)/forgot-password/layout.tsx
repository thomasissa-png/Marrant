import type { Metadata } from "next";
import { NOINDEX_FOLLOW_ROBOTS } from "@/lib/seo-meta";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  description: "Réinitialise ton mot de passe deviens-marrant.fr.",
  ...NOINDEX_FOLLOW_ROBOTS,
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
