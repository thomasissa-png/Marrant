import type { Metadata } from "next";
import { NOINDEX_FOLLOW_ROBOTS } from "@/lib/seo-meta";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe",
  description: "Choisis un nouveau mot de passe pour ton compte deviens-marrant.fr.",
  ...NOINDEX_FOLLOW_ROBOTS,
  // s16 reco 15 : l'URL contient le jeton, jamais transmise en Referer.
  referrer: "no-referrer",
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
