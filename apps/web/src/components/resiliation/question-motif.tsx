"use client";

import { Badge } from "@/components/ui/badge";
import { RESILIATION_COMMENTAIRE_MAX, RESILIATION_RAISONS, type RaisonResiliation } from "@/config/resiliation";
import { TEXTES_RESILIATION as T } from "@/config/textes/resiliation";

interface QuestionMotifProps {
  raisons: ReadonlySet<RaisonResiliation>;
  commentaire: string;
  /** Envoi en cours : saisie conservée, figée (`aria-disabled`, jamais `disabled` ni opacité). */
  fige: boolean;
  onBasculer: (code: RaisonResiliation) => void;
  onCommentaire: (texte: string) => void;
}

const LIGNE =
  "flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-border-input bg-background-card px-4 py-3 text-sm text-text-primary transition-colors hover:border-accent-primary/80 has-[:checked]:border-accent-primary has-[:checked]:bg-accent-primary/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-link has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background";

/**
 * Question FACULTATIVE (B1, B2) : 7 raisons en cases natives (plusieurs possibles, jamais
 * pré-cochées, ordre fixe) + mot libre de 500 caractères, jamais requis (même avec « Autre »).
 * Rien ici ne conditionne le bouton « Confirmer la résiliation ».
 */
export function QuestionMotif({ raisons, commentaire, fige, onBasculer, onCommentaire }: QuestionMotifProps) {
  return (
    <fieldset aria-describedby="raisons-aide" aria-disabled={fige || undefined} className="mt-8 min-w-0">
      <legend className="text-lg font-semibold text-text-primary">
        {T.question}
        <Badge variant="default" className="ml-2 align-middle">
          {T.facultatif}
        </Badge>
      </legend>
      <p id="raisons-aide" className="mt-1 text-sm text-text-secondary">
        {T.questionAide}
      </p>
      <div className="mt-4 grid items-stretch gap-2 md:grid-cols-2">
        {RESILIATION_RAISONS.map(({ code, libelle }) => (
          <label key={code} className={LIGNE}>
            <input
              type="checkbox"
              name="raisons"
              value={code}
              checked={raisons.has(code)}
              aria-disabled={fige || undefined}
              onChange={() => {
                if (!fige) onBasculer(code);
              }}
              className="h-5 w-5 shrink-0 accent-accent-primary"
            />
            <span>{libelle}</span>
          </label>
        ))}
      </div>
      <div className="mt-6">
        <label htmlFor="resiliation-mot" className="mb-1 block text-sm font-medium text-text-primary">
          {T.champLibre} <span className="font-normal text-text-muted">{T.champLibreFacultatif}</span>
        </label>
        <textarea
          id="resiliation-mot"
          name="commentaire"
          rows={3}
          maxLength={RESILIATION_COMMENTAIRE_MAX}
          value={commentaire}
          readOnly={fige}
          aria-disabled={fige || undefined}
          aria-describedby="resiliation-mot-compteur"
          placeholder={T.champLibrePlaceholder}
          onChange={(e) => onCommentaire(e.target.value.slice(0, RESILIATION_COMMENTAIRE_MAX))}
          className="w-full rounded-lg border border-border-input bg-background-light px-4 py-3 text-base text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-link md:text-sm"
        />
        <p id="resiliation-mot-compteur" className="mt-1 text-right text-xs text-text-muted">
          <span aria-hidden="true">{T.compteur(commentaire.length, RESILIATION_COMMENTAIRE_MAX)}</span>
          <span className="sr-only">{`${commentaire.length} caractères sur ${RESILIATION_COMMENTAIRE_MAX}`}</span>
        </p>
      </div>
    </fieldset>
  );
}
