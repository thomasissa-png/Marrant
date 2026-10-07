import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe",
  description: "Choisis un nouveau mot de passe pour ton compte deviens-marrant.fr.",
  robots: { index: false, follow: false },
  // s16 reco 15 : l'URL contient le jeton, jamais transmise en Referer.
  referrer: "no-referrer",
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
