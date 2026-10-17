// Stratégie de rendu : SSR dynamique (données de l'abonné, jamais de cache partagé).
// Interrupteur QUESTIONS_OUVERTES fermé : 404 pour tout le monde, AVANT la session
// (rien ne trahit la fonction). Ouvert : visiteur -> /login avec retour ; compte
// sans Premium -> message + lien Premium, sans historique. noindex, hors sitemap.
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CHEMIN_QUESTIONS, questionsOuvertes } from "@/config/equipe-questions";
import { TEXTES_EQUIPE_PAGE as T } from "@/config/textes/equipe-questions";
import { listerQuestions } from "@/lib/equipe-questions/abonne";
import { userIdSession } from "@/lib/equipe-questions/http";
import { FormulaireQuestion } from "@/components/equipe-questions/formulaire-question";
import { HistoriqueQuestions } from "@/components/equipe-questions/historique-questions";
import { NonPremium } from "@/components/equipe-questions/non-premium";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: T.titre,
  robots: { index: false, follow: false },
};

export default async function TaQuestionPage() {
  if (!questionsOuvertes()) notFound();
  const userId = await userIdSession();
  if (!userId) redirect(`/login?callbackUrl=${encodeURIComponent(CHEMIN_QUESTIONS)}`);

  const r = await listerQuestions(userId);
  if (!r.ok) return <NonPremium />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-text-primary">{T.titre}</h1>
      <p className="mt-3 text-text-secondary">{T.intro}</p>
      <div className="mt-8">
        <FormulaireQuestion />
      </div>
      <HistoriqueQuestions questions={r.questions} />
    </div>
  );
}
