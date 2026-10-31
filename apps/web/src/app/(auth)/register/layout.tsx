import type { Metadata } from "next";
import { NOINDEX_FOLLOW_ROBOTS } from "@/lib/seo-meta";
import { PREMIUM_PRICE_LABEL } from "@/config/premium";
import { OFFRE_NOM } from "@/config/textes/offre";

export const metadata: Metadata = {
  title: "Inscription : apprends à devenir drôle",
  description:
    `Crée ton compte pour activer ${OFFRE_NOM} : parcours, listes et carnet, pour ${PREMIUM_PRICE_LABEL}.`,
  ...NOINDEX_FOLLOW_ROBOTS,
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
