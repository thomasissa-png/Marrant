import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LettreBoutonAction } from "@/components/lettre/lettre-bouton-action";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { isPlausibleToken } from "@/lib/newsletter";

/**
 * Lien de désinscription du corps des e-mails (s21, @legal L5 et L6) : la page
 * n'écrit rien, seul le bouton (POST) désinscrit ; l'en-tête `List-Unsubscribe-Post`
 * reste immédiat. Disponible MÊME interrupteur fermé. Rendu : SSR, aucune lecture
 * en base. `noindex`, `no-referrer`.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: TEXTES_LETTRE.page.desinscrire.titre,
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function LettreDesinscrirePage({ searchParams }: { searchParams: { token?: string } }) {
  const token = typeof searchParams.token === "string" ? searchParams.token.trim() : "";
  if (!isPlausibleToken(token)) redirect("/lettre?statut=invalide");
  const t = TEXTES_LETTRE.page.desinscrire;
  return (
    <LettreBoutonAction
      titre={t.titre}
      texte={t.texte}
      bouton={t.bouton}
      action={`/api/newsletter/unsubscribe/${encodeURIComponent(token)}`}
    />
  );
}
