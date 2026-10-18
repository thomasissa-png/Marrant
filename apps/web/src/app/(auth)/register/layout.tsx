import type { Metadata } from "next";
import { NOINDEX_ROBOTS } from "@/lib/seo-meta";
import { PREMIUM_PRICE_LABEL } from "@/config/premium";
import { OFFRE_NOM } from "@/config/textes/offre";

export const metadata: Metadata = {
  title: "Inscription : apprends à devenir drôle",
  description:
    `Crée ton compte pour activer ${OFFRE_NOM} : parcours, listes et carnet, pour ${PREMIUM_PRICE_LABEL}.`,
  ...NOINDEX_ROBOTS,
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
