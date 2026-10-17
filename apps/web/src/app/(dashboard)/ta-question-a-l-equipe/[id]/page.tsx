// Stratégie de rendu : SSR dynamique (question privée de l'abonné connecté).
// Interrupteur fermé : 404. Question d'un autre compte : 404 (aucune fuite).
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CHEMIN_QUESTIONS, questionsOuvertes } from "@/config/equipe-questions";
import { TEXTES_EQUIPE_DETAIL as D, TEXTES_EQUIPE_PAGE as T } from "@/config/textes/equipe-questions";
import { lireQuestion } from "@/lib/equipe-questions/abonne";
import { userIdSession } from "@/lib/equipe-questions/http";
import { formaterDateLimite } from "@/lib/equipe-questions/regles";
import { DecisionExtrait, SupprimerQuestion } from "@/components/equipe-questions/actions-question";
import { NonPremium } from "@/components/equipe-questions/non-premium";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: T.titre,
  robots: { index: false, follow: false },
};

export default async function QuestionDetailPage({ params }: { params: { id: string } }) {
  if (!questionsOuvertes()) notFound();
  const userId = await userIdSession();
  if (!userId) redirect(`/login?callbackUrl=${encodeURIComponent(`${CHEMIN_QUESTIONS}/${params.id}`)}`);

  const r = await lireQuestion(userId, params.id);
  if (!r.ok) {
    if (r.code === "premium") return <NonPremium />;
    notFound();
  }
  const q = r.question;

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
      <Link href={CHEMIN_QUESTIONS} className="text-accent-link hover:underline">{D.retourListe}</Link>
      <section>
        <h1 className="font-display text-2xl font-bold text-text-primary">{D.retour}</h1>
        <p className="mt-3 whitespace-pre-line text-text-primary">{q.situation}</p>
        {q.retour && (
          <>
            <h2 className="mt-4 text-sm font-semibold text-text-secondary">{D.tonRetour}</h2>
            <p className="mt-1 whitespace-pre-line text-text-primary">{q.retour}</p>
          </>
        )}
      </section>
      <section>
        <h2 className="font-display text-xl font-bold text-text-primary">{D.reponse}</h2>
        {q.reponse ? (
          <p className="mt-3 whitespace-pre-line text-text-primary">{q.reponse}</p>
        ) : (
          <p className="mt-3 text-text-secondary">{D.enAttente(formaterDateLimite(new Date(q.dueAt)))}</p>
        )}
      </section>
      {q.extraitTexte && q.extraitStatut !== "AUCUN" && (
        <DecisionExtrait id={q.id} texte={q.extraitTexte} statut={q.extraitStatut} />
      )}
      <SupprimerQuestion id={q.id} />
    </div>
  );
}
