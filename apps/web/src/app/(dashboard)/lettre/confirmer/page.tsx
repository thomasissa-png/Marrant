import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { LettreBoutonAction } from "@/components/lettre/lettre-bouton-action";
import { LETTRE_INSCRIPTIONS_OUVERTES } from "@/config/lettre";
import { TEXTES_LETTRE, TITRES_META_LETTRE } from "@/config/textes/lettre-s21";
import { confirmActionPath, isPlausibleToken } from "@/lib/newsletter";

/**
 * Lien de confirmation de l'e-mail (s21, @legal L5) : la page n'écrit rien, seul
 * le bouton (POST) confirme. Rendu : SSR (jeton lu dans l'URL), aucune lecture en
 * base. `noindex`, `same-origin` (le jeton ne part jamais vers un autre site, et le
 * POST du bouton porte la vraie origine : QA s21 B1) ; le
 * paramètre `token` est retiré des URL envoyées à Umami.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: TITRES_META_LETTRE.confirmer,
  robots: { index: false, follow: false },
  referrer: "same-origin",
};

export default function LettreConfirmerPage({ searchParams }: { searchParams: { token?: string } }) {
  if (!LETTRE_INSCRIPTIONS_OUVERTES) notFound();
  const token = typeof searchParams.token === "string" ? searchParams.token.trim() : "";
  if (!isPlausibleToken(token)) redirect("/lettre?statut=invalide");
  const t = TEXTES_LETTRE.page.confirmer;
  return <LettreBoutonAction titre={t.titre} texte={t.texte} bouton={t.bouton} action={confirmActionPath(token)} />;
}
