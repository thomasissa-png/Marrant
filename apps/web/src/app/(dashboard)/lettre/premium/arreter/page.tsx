import type { Metadata } from "next";
import { ArretLettreHebdo } from "@/components/lettre/arret-lettre-hebdo";
import { LETTRE_HEBDO_ARRET } from "@/config/textes/lettre-hebdo-s21";
import { isPlausibleToken } from "@/lib/newsletter";
import { NOINDEX_ROBOTS } from "@/lib/seo-meta";

/**
 * Arrêt de la lettre de la semaine en un clic (s21, spec US-H3, avis @legal §3).
 * Rendu : SSR sans lecture en base (GET sans effet : un scanner de liens n'arrête
 * personne) ; le bouton (Client Component) envoie le POST. Disponible MÊME
 * interrupteurs fermés. `noindex`, `no-referrer` ; le jeton (`token`) est retiré des
 * URL envoyées à Umami (`lib/umami-before-send.ts`).
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: LETTRE_HEBDO_ARRET.metaTitre,
  ...NOINDEX_ROBOTS,
  referrer: "no-referrer",
};

export default function ArretLettreHebdoPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = typeof searchParams.token === "string" ? searchParams.token.trim() : "";
  return <ArretLettreHebdo token={isPlausibleToken(token) ? token : null} />;
}
