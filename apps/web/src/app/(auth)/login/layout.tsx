import type { Metadata } from "next";
import { NOINDEX_FOLLOW_ROBOTS } from "@/lib/seo-meta";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connecte-toi à deviens-marrant.fr pour progresser en humour.",
  ...NOINDEX_FOLLOW_ROBOTS,
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
