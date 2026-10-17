import Link from "next/link";
import { CHEMIN_QUESTIONS, questionsOuvertes } from "@/config/equipe-questions";
import { TEXTES_EQUIPE_PAGE as T } from "@/config/textes/equipe-questions";
import { readSessionPlan } from "@/lib/session-plan";
import { estPremium } from "@/lib/equipe-questions/regles";

/**
 * Entrée E1 du profil (spec §2.1), Premium seulement. Interrupteur fermé :
 * rien n'est rendu et la session n'est même pas lue (rendu du profil inchangé).
 */
export async function EntreeQuestionsProfil() {
  if (!questionsOuvertes()) return null;
  const plan = await readSessionPlan();
  if (!estPremium(plan)) return null;
  return (
    <section aria-labelledby="entree-questions" className="mb-8 rounded-lg border border-border p-5">
      <h2 id="entree-questions" className="font-display text-xl font-bold text-text-primary">{T.titre}</h2>
      <p className="mt-2 text-text-secondary">{T.intro}</p>
      <Link
        href={CHEMIN_QUESTIONS}
        className="mt-4 inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-semibold text-text-primary hover:bg-background-elevated"
      >
        {T.boutonProfil}
      </Link>
    </section>
  );
}
