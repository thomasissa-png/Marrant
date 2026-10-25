"use client";

/**
 * « Ta question à l'équipe » (V1, s22) : encadré du profil, sous la carte abonnement, rendu
 * seulement pour un compte Premium (le serveur revérifie) et interrupteur ouvert.
 * États : vide, envoi, succès (champ vidé), erreurs (vide, trop long, envoi impossible,
 * trop d'envois, plus Premium, session expirée), le texte saisi restant dans le champ en
 * cas d'erreur. Tour 2 s22 : textes v2, revue design (contraste `text-error-text`, halo
 * rouge du champ invalide, champ en 16 px sur mobile, succès en bloc visible sous le bouton).
 * Le texte n'est jamais envoyé à Umami : événements sans contenu.
 * s22 : renvoi du MÊME texte dans les 10 minutes (Resend lent, réponse perdue) = même
 * `tentative`, donc même clé d'idempotence côté serveur : un seul e-mail part.
 */
import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QUESTION_EQUIPE_API, QUESTION_EQUIPE_CONFIDENTIALITE_HREF, QUESTION_EQUIPE_MAX, QUESTION_EQUIPE_OUVERTE } from "@/config/question-equipe";
import { QUESTION_EQUIPE_TROP_COURT_MAX_S, QUESTION_EQUIPE_UI as T } from "@/config/textes/question-equipe-s22";
import { LIEN, MessageErreur, nombre, typo, type Erreur } from "@/components/profil/question-equipe-messages";
import { trackUmami } from "@/lib/umami";
import { cn } from "@/lib/utils";

type Etat = { etat: "saisie" } | { etat: "envoi" } | { etat: "succes" } | { etat: "erreur"; erreur: Erreur };

const longueur = (texte: string) => [...texte].length;

/** Tentative `<ms>-<aléa>` : gardée pour le même texte pendant la fenêtre de 10 minutes du serveur. */
const FENETRE_TENTATIVE_MS = 10 * 60_000;
function nouvelleTentative(): string {
  const alea = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().replace(/-/g, "") : Math.random().toString(36).slice(2).padEnd(12, "0");
  return `${Date.now()}-${alea.slice(0, 24)}`;
}

function erreurDeReponse(status: number, code: unknown, retryAfter: string | null): Erreur {
  if (status === 401) return "session";
  if (status === 429) {
    const s = Number(retryAfter);
    return retryAfter && Number.isFinite(s) && s > 0 && s <= QUESTION_EQUIPE_TROP_COURT_MAX_S ? "trop-court" : "trop";
  }
  if (status === 403 && code === "non-premium") return "non-premium";
  if (status === 400 && (code === "vide" || code === "trop-long")) return code;
  return "envoi";
}

export function QuestionEquipeCard({ className }: { className?: string }) {
  const id = useId();
  const [question, setQuestion] = useState("");
  const [etat, setEtat] = useState<Etat>({ etat: "saisie" });
  const champ = useRef<HTMLTextAreaElement>(null);
  const succes = useRef<HTMLParagraphElement>(null);
  const tentative = useRef<{ texte: string; id: string; debut: number } | null>(null);

  if (!QUESTION_EQUIPE_OUVERTE) return null;

  // Compté sur le texte nettoyé, comme la validation à l'envoi (relecture finale P3-3).
  const n = longueur(question.trim());
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
    const t = tentative.current;
    if (!t || t.texte !== propre || Date.now() - t.debut > FENETRE_TENTATIVE_MS) {
      const id = nouvelleTentative();
      tentative.current = { texte: propre, id, debut: Number(id.split("-")[0]) };
    }
    try {
      const res = await fetch(QUESTION_EQUIPE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: propre, tentative: tentative.current?.id }),
        signal: typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(15_000) : undefined,
      });
      if (!res.ok) {
        const corps = (await res.json().catch(() => null)) as { error?: unknown } | null;
        return echouer(erreurDeReponse(res.status, corps?.error, res.headers?.get?.("Retry-After") ?? null));
      }
      setQuestion("");
      tentative.current = null;
      setEtat({ etat: "succes" });
      trackUmami("question-equipe-envoyee");
      requestAnimationFrame(() => succes.current?.focus());
    } catch {
      echouer("envoi");
    }
  }

  const decrit = [`${id}-aide`, `${id}-compteur`, erreur ? `${id}-erreur` : null].filter(Boolean).join(" ");
  // Premium arrêté : réessayer ne servira pas, le bouton reste grisé tant que l'état dure.
  const bloque = enCours || erreur === "non-premium";

  return (
    <Card role="region" aria-labelledby={`${id}-titre`} data-testid="question-equipe" className={cn("text-left", className)}>
      <CardHeader className="pb-3">
        <CardTitle id={`${id}-titre`}>{typo(T.titre)}</CardTitle>
        <p className="text-sm text-text-secondary">{typo(T.accroche)}</p>
        <p className="text-sm text-text-muted">{typo(T.delai)}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => void envoyer(e)} noValidate className="max-w-3xl">
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
            // 16 px à toutes les largeurs (pas de zoom iOS au focus, paysage compris) ; bordure `border-input` à 3,3:1 (WCAG 1.4.11) ;
            // en erreur, bordure et halo rouges.
            className="block w-full resize-y rounded-lg border border-border-input bg-background-light px-3 py-2 text-base text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary aria-[invalid=true]:border-error aria-[invalid=true]:focus:border-error aria-[invalid=true]:focus:ring-error"
          />
          {/* Téléphone : compteur collé au champ, aide dessous ; à partir de sm : aide à gauche, compteur à droite.
              Graisse et largeur du compteur constantes (la ligne d'aide ne se recoupe plus quand il passe en erreur). */}
          <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <p id={`${id}-compteur`} className={cn("self-end text-xs font-medium tabular-nums sm:order-2 sm:min-w-[9rem] sm:shrink-0 sm:text-right", depasse ? "text-error-text" : "text-text-muted")}>
              {T.compteur(nombre(n), nombre(QUESTION_EQUIPE_MAX))}
            </p>
            <p id={`${id}-aide`} className="min-w-0 text-xs text-text-muted sm:order-1 sm:flex-1">
              {typo(T.aide)}
            </p>
          </div>
          {erreur && (
            <p id={`${id}-erreur`} role="alert" className="mt-2 break-words text-sm text-error-text" data-testid="question-equipe-erreur" data-erreur={erreur}>
              <MessageErreur erreur={erreur} />
            </p>
          )}
          {/* Revue design C3 : désactivé à 80 % (au lieu de 50 % dans `ui/button.tsx`), « Envoi en cours » reste lisible. */}
          <Button type="submit" variant="primary" className="mt-3 min-h-11 w-full disabled:opacity-80 sm:w-auto" disabled={bloque} aria-disabled={bloque}>
            {enCours ? T.envoiEnCours : typo(T.bouton)}
          </Button>
          {/* Statut toujours présent (annonce fiable) ; succès en bloc visible juste sous le bouton, avant la mention.
              Pendant l'envoi, le bouton affiche déjà « Envoi en cours » : le statut ne le dit qu'aux lecteurs d'écran. */}
          <div role="status" aria-live="polite">
            <p
              ref={succes}
              tabIndex={-1}
              className={cn(
                "outline-none",
                enCours && "sr-only",
                etat.etat === "succes" &&
                  "mt-3 flex items-start gap-2 rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-sm text-text-primary focus-visible:ring-2 focus-visible:ring-accent-link",
              )}
              data-testid="question-equipe-statut"
            >
              {etat.etat === "succes" && (
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-success">
                  <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
                </svg>
              )}
              {enCours ? T.envoiEnCours : etat.etat === "succes" ? <span>{typo(T.succes)}</span> : null}
            </p>
          </div>
          <p className="mt-2 break-words text-xs text-text-muted" data-testid="question-equipe-mention">
            {typo(T.mention.avantLien)}
            <Link href={QUESTION_EQUIPE_CONFIDENTIALITE_HREF} className={cn(LIEN, "hover:text-text-secondary")}>
              {T.mention.lien}
            </Link>
            {T.mention.apresLien}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
