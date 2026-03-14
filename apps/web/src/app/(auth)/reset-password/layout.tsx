import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe",
  description: "Choisis un nouveau mot de passe pour ton compte deviens-marrant.fr.",
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
