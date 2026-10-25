"use client";

/**
 * « Ta question à l'équipe » (V1, s22) : encadré du profil, sous la carte abonnement, rendu
 * seulement pour un compte Premium (le serveur revérifie) et interrupteur ouvert.
 * États : vide, envoi, succès (champ vidé), erreurs (vide, trop long, envoi impossible,
 * trop d'envois, session expirée), le texte saisi restant dans le champ en cas d'erreur.
 * Le texte n'est jamais envoyé à Umami : événements sans contenu.
 */
import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QUESTION_EQUIPE_API, QUESTION_EQUIPE_CONFIDENTIALITE_HREF, QUESTION_EQUIPE_MAX, QUESTION_EQUIPE_OUVERTE } from "@/config/question-equipe";
import { QUESTION_EQUIPE_UI as T } from "@/config/textes/question-equipe-s22";
import { frTypoTexte, NBSP } from "@/lib/fr-typo";
import { trackUmami } from "@/lib/umami";
import { cn } from "@/lib/utils";

type Erreur = "vide" | "trop-long" | "envoi" | "trop" | "session";
type Etat = { etat: "saisie" } | { etat: "envoi" } | { etat: "succes" } | { etat: "erreur"; erreur: Erreur };

const nombre = (n: number) => n.toLocaleString("fr-FR");
/** `frTypo` + impératif lié (« Reconnecte-toi ») + « 1 à 2 » jamais coupé (texte affiché seulement). */
const typo = (t: string) => frTypoTexte(t).replace(/(\d) à(?: |\u00a0)(\d)/g, `$1${NBSP}à${NBSP}$2`);
const longueur = (texte: string) => [...texte].length;

function erreurDeReponse(status: number, code: unknown): Erreur {
  if (status === 401) return "session";
  if (status === 429) return "trop";
  if (status === 400 && (code === "vide" || code === "trop-long")) return code;
  return "envoi";
}

export function QuestionEquipeCard({ className }: { className?: string }) {
  const id = useId();
  const [question, setQuestion] = useState("");
  const [etat, setEtat] = useState<Etat>({ etat: "saisie" });
  const champ = useRef<HTMLTextAreaElement>(null);
  const succes = useRef<HTMLParagraphElement>(null);

  if (!QUESTION_EQUIPE_OUVERTE) return null;

  const n = longueur(question);
  const depasse = n > QUESTION_EQUIPE_MAX;
  const erreur = etat.etat === "erreur" ? etat.erreur : null;
  const enCours = etat.etat === "envoi";

  function echouer(e: Erreur) {
    setEtat({ etat: "erreur", erreur: e });
    trackUmami("question-equipe-echec", { raison: e });
    // Focus rendu au champ : le texte y est toujours, prêt à corriger ou à renvoyer.
    champ.current?.focus();
  }

  async function envoyer(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (enCours) return;
    const propre = question.trim();
    if (propre.length === 0) return echouer("vide");
    if (longueur(propre) > QUESTION_EQUIPE_MAX) return echouer("trop-long");
    setEtat({ etat: "envoi" });
    try {
      const res = await fetch(QUESTION_EQUIPE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: propre }),
        signal: typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(15_000) : undefined,
      });
      if (!res.ok) {
        const corps = (await res.json().catch(() => null)) as { error?: unknown } | null;
        return echouer(erreurDeReponse(res.status, corps?.error));
      }
      setQuestion("");
      setEtat({ etat: "succes" });
      trackUmami("question-equipe-envoyee");
      requestAnimationFrame(() => succes.current?.focus());
    } catch {
      echouer("envoi");
    }
  }

  const decrit = [`${id}-aide`, `${id}-compteur`, erreur ? `${id}-erreur` : null].filter(Boolean).join(" ");

  return (
    <Card role="region" aria-labelledby={`${id}-titre`} data-testid="question-equipe" className={cn("text-left", className)}>
      <CardHeader className="pb-3">
        <CardTitle id={`${id}-titre`}>{typo(T.titre)}</CardTitle>
        <p className="text-sm text-text-secondary">{typo(T.accroche)}</p>
        <p className="text-sm text-text-muted">{typo(T.delai)}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => void envoyer(e)} noValidate className="max-w-2xl">
          <label htmlFor={`${id}-champ`} className="mb-1 block text-sm font-medium text-text-primary">
            {typo(T.libelle)}
          </label>
          <textarea
            ref={champ}
            id={`${id}-champ`}
            name="question"
            rows={5}
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (etat.etat === "succes") setEtat({ etat: "saisie" });
            }}
            aria-describedby={decrit}
            aria-invalid={erreur === "vide" || erreur === "trop-long" || depasse}
            className="block w-full resize-y rounded-lg border border-border bg-background-light px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary aria-[invalid=true]:border-error"
          />
          {/* Téléphone : compteur collé au champ, aide dessous ; à partir de sm : aide à gauche, compteur à droite. */}
          <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <p id={`${id}-compteur`} className={cn("self-end text-xs tabular-nums sm:order-2 sm:shrink-0", depasse ? "font-semibold text-error" : "text-text-muted")}>
              {T.compteur(nombre(n), nombre(QUESTION_EQUIPE_MAX))}
            </p>
            <p id={`${id}-aide`} className="min-w-0 text-xs text-text-muted sm:order-1 sm:flex-1">
              {typo(T.aide)}
            </p>
          </div>
          {erreur && (
            <p id={`${id}-erreur`} role="alert" className="mt-2 text-sm text-error" data-testid="question-equipe-erreur">
              {erreur === "session" ? (
                <>
                  {typo(T.erreurs.session.avant)}
                  <Link href="/login?callbackUrl=/profil" className="underline underline-offset-2">
                    {typo(T.erreurs.session.lien)}
                  </Link>
                  {typo(T.erreurs.session.apres)}
                </>
              ) : (
                typo(T.erreurs[erreur === "trop-long" ? "tropLong" : erreur])
              )}
            </p>
          )}
          <Button type="submit" variant="primary" className="mt-3 min-h-11 w-full sm:w-auto" disabled={enCours} aria-disabled={enCours}>
            {enCours ? T.envoiEnCours : T.bouton}
          </Button>
          <p className="mt-2 text-xs text-text-muted" data-testid="question-equipe-mention">
            {typo(T.mention.avantLien)}
            <Link href={QUESTION_EQUIPE_CONFIDENTIALITE_HREF} className="underline underline-offset-2 hover:text-text-secondary">
              {T.mention.lien}
            </Link>
            {T.mention.apresLien}
          </p>
        </form>
        <p
          ref={succes}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="mt-3 max-w-2xl text-sm text-text-secondary outline-none empty:mt-0"
          data-testid="question-equipe-statut"
        >
          {enCours ? T.envoiEnCours : etat.etat === "succes" ? typo(T.succes) : null}
        </p>
      </CardContent>
    </Card>
  );
}
