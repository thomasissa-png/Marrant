import Link from "next/link";
import { CHEMIN_QUESTIONS } from "@/config/equipe-questions";
import { LIBELLES_STATUT_ABONNE, TEXTES_EQUIPE_PAGE as T } from "@/config/textes/equipe-questions";
import type { QuestionAbonne } from "@/lib/equipe-questions/abonne";

const dateCourte = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "long" });

function apercu(texte: string): string {
  const t = texte.replace(/\s+/g, " ").trim();
  return t.length > 120 ? `${t.slice(0, 120).trimEnd()}…` : t;
}

/** Historique « Mes questions » (serveur) : date, 120 premiers caractères, statut abonné. */
export function HistoriqueQuestions({ questions }: { questions: QuestionAbonne[] }) {
  return (
    <section id="mes-questions" aria-labelledby="mes-questions-titre" className="mt-10">
      <h2 id="mes-questions-titre" className="font-display text-xl font-bold text-text-primary">{T.historiqueTitre}</h2>
      {questions.length === 0 ? (
        <p className="mt-3 text-text-secondary">{T.historiqueVide}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {questions.map((q) => (
            <li key={q.id} className="rounded-lg border border-border p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-text-secondary">
                <span>{dateCourte.format(new Date(q.receivedAt))}</span>
                <span className="font-semibold text-text-primary">{LIBELLES_STATUT_ABONNE[q.statut]}</span>
              </div>
              <p className="mt-2 text-text-primary">{apercu(q.situation)}</p>
              <Link href={`${CHEMIN_QUESTIONS}/${q.id}`} className="mt-2 inline-block text-accent-link hover:underline">
                {T.voirDetail}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
