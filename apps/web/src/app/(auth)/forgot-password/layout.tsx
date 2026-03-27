import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  description: "Réinitialise ton mot de passe deviens-marrant.fr.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
