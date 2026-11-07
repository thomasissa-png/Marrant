"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RESILIATION_CONFIDENTIALITE_ANCRE, RESILIATION_COMMENTAIRE_MAX, RESILIATION_RAISONS, type RaisonResiliation } from "@/config/resiliation";
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
  "flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-border-input bg-background-card px-4 py-3 text-sm text-text-primary transition-colors hover:border-accent-primary/80 has-[:checked]:border-accent-primary has-[:checked]:bg-accent-primary/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-link has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background md:last:col-span-2";

/**
 * UX C3 : clavier ouvert, le navigateur amène le curseur juste au bord bas de l'écran, sous la barre
 * collée. Au focus et à la frappe, on remonte le champ, sans animation, de sa marge `scroll-mb-40`
 * (160 px, plus haute que la barre : 121 px, 143 px avec la zone de sécurité iOS). Sans effet s'il est déjà visible.
 */
function garderAuDessusDeLaBarre(e: { currentTarget: HTMLTextAreaElement }) {
  e.currentTarget.scrollIntoView?.({ block: "nearest", behavior: "instant" });
}

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
          aria-describedby="resiliation-mot-compteur resiliation-mot-mention"
          placeholder={T.champLibrePlaceholder}
          onChange={(e) => onCommentaire(e.target.value.slice(0, RESILIATION_COMMENTAIRE_MAX))}
          onFocus={garderAuDessusDeLaBarre}
          onInput={garderAuDessusDeLaBarre}
          className="w-full scroll-mb-40 rounded-lg border border-border-input bg-background-light px-4 py-3 text-base text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-link md:text-sm"
        />
        <p id="resiliation-mot-compteur" className="mt-1 text-right text-xs text-text-muted">
          <span aria-hidden="true">{T.compteur(commentaire.length, RESILIATION_COMMENTAIRE_MAX)}</span>
          <span className="sr-only">{`${commentaire.length} caractères sur ${RESILIATION_COMMENTAIRE_MAX}`}</span>
        </p>
        {/* @legal O1 : information au point de collecte (durée provisoire RESILIATION_CONSERVATION_MOIS). */}
        <p id="resiliation-mot-mention" className="mt-2 text-xs text-text-secondary">
          {T.mention}
          <Link
            href={`/confidentialite#${RESILIATION_CONFIDENTIALITE_ANCRE}`}
            className="underline underline-offset-2 hover:text-text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link"
          >
            {T.mentionLien}
          </Link>
          .
        </p>
      </div>
    </fieldset>
  );
}
