import type { Metadata } from "next";
import { NOINDEX_ROBOTS } from "@/lib/seo-meta";
import { redirect } from "next/navigation";
import { LettreBoutonAction } from "@/components/lettre/lettre-bouton-action";
import { TEXTES_LETTRE, TITRES_META_LETTRE } from "@/config/textes/lettre-s21";
import { isPlausibleToken } from "@/lib/newsletter";

/**
 * Lien de désinscription du corps des e-mails (s21, @legal L5 et L6) : la page
 * n'écrit rien, seul le bouton (POST) désinscrit ; l'en-tête `List-Unsubscribe-Post`
 * reste immédiat. Disponible MÊME interrupteur fermé. Rendu : SSR, aucune lecture
 * en base. `noindex`, `same-origin` (voir `/lettre/confirmer`).
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: TITRES_META_LETTRE.desinscrire,
  ...NOINDEX_ROBOTS,
  referrer: "same-origin",
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
