import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { LettreBoutonAction } from "@/components/lettre/lettre-bouton-action";
import { LETTRE_OUVERTE } from "@/config/lettre";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { confirmActionPath, isPlausibleToken } from "@/lib/newsletter";

/**
 * Lien de confirmation de l'e-mail (s21, @legal L5) : la page n'écrit rien, seul
 * le bouton (POST) confirme. Rendu : SSR (jeton lu dans l'URL), aucune lecture en
 * base. `noindex`, `no-referrer` (le jeton ne fuit pas vers un autre site) ; le
 * paramètre `token` est retiré des URL envoyées à Umami.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: TEXTES_LETTRE.page.confirmer.titre,
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function LettreConfirmerPage({ searchParams }: { searchParams: { token?: string } }) {
  if (!LETTRE_OUVERTE) notFound();
  const token = typeof searchParams.token === "string" ? searchParams.token.trim() : "";
  if (!isPlausibleToken(token)) redirect("/lettre?statut=invalide");
  const t = TEXTES_LETTRE.page.confirmer;
  return <LettreBoutonAction titre={t.titre} texte={t.texte} bouton={t.bouton} action={confirmActionPath(token)} />;
}
