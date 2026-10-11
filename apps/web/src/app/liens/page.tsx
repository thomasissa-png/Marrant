import type { Metadata } from "next";
import { LiensPageContent } from "@/components/liens/liens-page-content";

// Stratégie de rendu : ISR 5 min. Lien de bio Instagram (`utm_source=instagram`),
// posé une seule fois : il suit seul le dernier article publié (même source que
// /blog), le passe avant le quiz pendant 48 h, et la vanne du jour (même source
// que /blague-du-jour). X et LinkedIn : `liens/[reseau]` (/liens/x, /liens/li).
// Hors du groupe (dashboard) : pas d'en-tête ni de pied de page, page légère
// pensée mobile.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Liens",
  description: "Le dernier article, la vanne du jour et les parcours de deviens-marrant.fr.",
  alternates: { canonical: "https://deviens-marrant.fr/liens" },
  robots: { index: false, follow: true },
};

export default async function LiensPage() {
  return LiensPageContent({ origine: "instagram" });
}
