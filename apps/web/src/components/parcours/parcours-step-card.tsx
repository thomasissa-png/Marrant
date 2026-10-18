"use client";

import { Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { tipProse } from "@/lib/tip-prose";
import { frTypoParcours } from "@/lib/fr-typo";
import { trackUmami } from "@/lib/umami";
import { ETAPE_LIBRE_BADGE } from "@/config/textes/offre";
import {
  CHARGEMENT_ETAPE,
  DEFI_BOULOT,
  dureeEtapeTexte,
  VIDEOS_ETAPE,
  ETAPE_APERCU_LIBELLE,
  LIENS_FICHES,
  QUIZ_TITRE,
} from "@/config/textes/parcours";
import { PARCOURS_ETAPE_XP_DEFAUT } from "@/lib/parcours-xp";
import { StepQuiz } from "@/components/parcours/step-quiz";
import {
  ExerciseFeedback,
  LockedStepPreview,
  type Resultat,
  StepJokes,
  ValidationWall,
  VideoCard,
} from "@/components/parcours/step-blocks";
import type { Step } from "@/components/parcours/parcours-types";

/**
 * s17 tour 3 (UXV-3-01) : la carte affiche-t-elle le bloc d'échec du chargement ? Règle unique,
 * lue aussi par la page : un seul « Réessayer » et une seule alerte à l'écran (celle de l'étape dépliée).
 */
export function etapeAfficheEchec(p: {
  step: Pick<Step, "locked">;
  isExpanded: boolean;
  isPremiumLocked: boolean;
  loadFailed: boolean;
}): boolean {
  return p.isExpanded && !p.isPremiumLocked && !!p.step.locked && p.loadFailed;
}

const LOCK_PATH =
  "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z";

function LockIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={LOCK_PATH} />
    </svg>
  );
}

/** s17 tour 1 (DES-1-06) : titres de bloc lisibles d'un coup d'œil, corps à longueur de ligne lisible. */
const SECTION_TITRE = "mb-2 font-display text-base font-bold text-text-primary";
const CORPS_LECTURE = "max-w-[68ch] text-base leading-7 text-text-secondary sm:text-[15px]";
/** Encadré du défi (s18), repris pour le second défi. */
const ENCADRE_DEFI = "rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-3";
/** s19 iter 4 (N-b @design) : « Version sans risque » en retrait du défi, pointillés neutres, sans fond. */
const ENCADRE_REPLI = "rounded-lg border border-dashed border-border p-3";

function Section({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    // scroll-mt-28 : 112 px sous la barre fixe (64 px), cible des liens internes (« Aller au défi »).
    <div id={id} className={id ? "scroll-mt-28" : undefined}>
      <h4 className={SECTION_TITRE}>{title}</h4>
      {children}
    </div>
  );
}

/** s19 (N3 @design rendu) : lignes non vides de l'exemple, dans l'ordre, texte intact. */
export function lignesExemple(texte: string): string[] {
  return texte.split("\n").filter((l) => l.trim() !== "");
}

// Libellé d'ouverture du défi (« DÉFI TRACE : », espace normale ou insécable avant les deux-points).
const DEFI_LIBELLE = /^(DÉFI [^:\n]{1,40}?)(\s:[\s\S]*)$/; // \s couvre aussi l'insécable posée par frTypo.

/** s19 (N2 @design rendu) : « DÉFI X » en gras, la suite telle quelle (concaténation = texte d'origine). */
export function decouperDefi(texte: string): [string, string] | null {
  const m = DEFI_LIBELLE.exec(texte);
  return m ? [m[1], m[2]] : null;
}

/** Index des « ? » hors guillemets « … » (une question citée n'est pas une phrase du défi). */
function questionsHorsCitation(texte: string): { questions: number[]; dansCitation: boolean[] } {
  const questions: number[] = [];
  const dansCitation: boolean[] = [];
  let profondeur = 0;
  for (let i = 0; i < texte.length; i++) {
    if (texte[i] === "«") profondeur++;
    dansCitation.push(profondeur > 0);
    if (texte[i] === "»") profondeur = Math.max(0, profondeur - 1);
    if (texte[i] === "?" && profondeur === 0) questions.push(i);
  }
  return { questions, dansCitation };
}

/** Début de phrase « C'est réussi » / « C'est gagné » (apostrophe droite ou typographique). */
const CRITERE = /C['’]est (?:réussi|gagné)(?![\p{L}])/gu;

/** Index des phrases critère (« C'est réussi… », « C'est gagné… ») hors citation, en début de phrase. */
function criteres(texte: string, dansCitation: boolean[]): number[] {
  const trouves: number[] = [];
  for (const m of texte.matchAll(CRITERE)) {
    const i = m.index ?? 0;
    if (dansCitation[i]) continue;
    let j = i - 1;
    while (j >= 0 && /\s/.test(texte[j])) j--;
    if (j < 0 || /[.!?…]/.test(texte[j]) || texte.slice(j + 1, i).includes("\n")) trouves.push(i);
  }
  return trouves;
}

/**
 * s19 (N4 @ux rendu iter 2, règle corrigée) : coupe le défi au début de sa DERNIÈRE phrase
 * interrogative, qui ouvre le repli (« Pas de réunion en vue… ? », « Aucun pot en vue ? »).
 * Zéro ou plus d'un « ? » hors citation : pas de coupe.
 * s19 iter 4 (@copywriter) : 3 morceaux [défi, repli, suite]. Si le défi principal n'a pas son
 * propre critère et qu'une phrase « C'est réussi / C'est gagné » suit la question, ce critère
 * vaut pour les deux versions : il sort de l'encadré (suite). Sinon (critère propre au repli,
 * comme à l'étape 3), suite vide. Concaténation des 3 morceaux = texte d'origine.
 */
export function decouperRepli(texte: string): [string, string, string] | null {
  const { questions, dansCitation } = questionsHorsCitation(texte);
  if (questions.length !== 1) return null;
  const q = questions[0];
  for (let i = q - 1; i > 0; i--) {
    const finDePhrase = !dansCitation[i - 1] && /[.!?…]/.test(texte[i - 1]) && /\s/.test(texte[i]);
    if (texte[i] !== "\n" && !finDePhrase) continue;
    let debut = i + 1;
    while (debut < q && /\s/.test(texte[debut])) debut++;
    const tous = criteres(texte, dansCitation);
    const critereApres = tous.find((c) => c > q);
    const critereAvant = tous.some((c) => c < debut);
    const fin = critereApres !== undefined && !critereAvant ? critereApres : texte.length;
    return [texte.slice(0, debut), texte.slice(debut, fin), texte.slice(fin)];
  }
  return null;
}

function DefiTexte({ texte }: { texte: string }) {
  const parts = decouperDefi(texte);
  if (!parts) return <>{texte}</>;
  return (
    <>
      <strong className="font-semibold text-text-primary">{parts[0]}</strong>
      {parts[1]}
    </>
  );
}

export interface ParcoursStepCardProps {
  step: Step;
  slug: string;
  timePerWeek?: string | null;
  isPremium: boolean;
  isCompleted: boolean;
  isExpanded: boolean;
  /** Non-abonné : étape 2+ ouverte en aperçu (D1). */
  isPremiumLocked: boolean;
  isQuizDone: boolean;
  isSeedFallback: boolean;
  completing: boolean;
  abonnementHref: string;
  /** s21 concision : plein de fin d'étape 1 (visiteur : /register ; compte : /abonnement). */
  finEtape1Href?: string;
  loadFailed: boolean;
  onRetryLoad: () => void;
  /** s17 tour 3 : focus rendu au « Réessayer » de l'étape après un nouvel échec. */
  reessayerRef?: React.Ref<HTMLButtonElement>;
  onToggle: () => void;
  onQuizComplete: (score: number, total: number) => void;
  onComplete: () => void;
  /** s17 tour 3 (QA) : échec de la validation de CETTE étape, affiché au-dessus de « Valider ». */
  erreurValidation?: string | null;
  /** Retour déjà enregistré sur l'exercice (abonné). */
  retour?: string | null;
  onRetour?: (resultat: Resultat) => void;
  /**
   * s17 tour 1 (UXV-1-01, DES-1-01) : gain d'XP et date conseillée, affichés dans
   * la carte qui vient d'être validée, sans minuterie.
   */
  resultat?: { xp: string | null; rythme: string | null } | null;
  /** s17 tour 1 (UXV-1-06) : repère « Parcours Répartie · 4 semaines » au-dessus du titre. */
  contexte?: string | null;
  /** s21 B14 : étape suivante (aperçu public), carte de la fin d'étape 1. */
  etapeSuivante?: Step | null;
  /** s21 B14 : offre annuelle disponible (lue côté serveur). */
  annuel?: boolean;
}

export function ParcoursStepCard(props: ParcoursStepCardProps) {
  // s21 (décision du 18/10) : toute étape se déplie ; l'abonné les ouvre toutes, le visiteur voit l'aperçu des étapes 2+.
  const { step, slug, isPremium, isCompleted, isExpanded, isPremiumLocked } = props;
  const stepXp = step.moduleXp ?? PARCOURS_ETAPE_XP_DEFAUT;
  const hasQuiz = !!step.quiz && step.quiz.length > 0;
  const title = step.moduleTitle ?? step.tip.title;
  const muted = isPremiumLocked;

  return (
    <Card
      role="listitem"
      // Ancre des liens d'entrée (lot C) : /parcours/<slug>#etape-N.
      id={`etape-${step.order}`}
      // s17 tour 3 (DES-3-05) : 112 px sous la barre fixe (64 px), « Le programme » reste entier au-dessus de l'étape 1.
      className={`scroll-mt-28 ${isCompleted ? "border-accent-primary/30 bg-accent-primary/5" : muted ? "border-dashed" : ""}`}
    >
      <CardHeader
        id={`etape-${step.order}-entete`}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        // Pas d'aria-label : le nom vocal = le texte visible (QA-05) ; focus visible (UX-09 a).
        // DES-1-04 : pas de marge basse sous un en-tête replié (16 px dessus, 0 dessous + padding de la carte).
        // s17 tour 3 (DES-3-05) : déplié, 8 px sous l'en-tête pour que l'anneau de focus (2 + 2 px) ne touche pas le bloc suivant.
        // s17 tour 4 (QA) : survol = titre souligné et chevron éclairci (en-tête dépliable seulement).
        className={`rounded-t-xl ${isExpanded ? "mb-2" : "pb-0"} focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary group cursor-pointer`}
        onClick={() => props.onToggle()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            props.onToggle();
          }
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                isCompleted ? "bg-accent-primary text-white" : "bg-background-elevated text-text-muted"
              }`}
              aria-hidden="true"
            >
              {isCompleted ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : muted ? (
                <LockIcon className="h-4 w-4" />
              ) : (
                step.order
              )}
            </div>
            <div>
              {props.contexte && (
                // Répète le H1 : masqué au lecteur d'écran (nom du bouton « Étape 1 : … » inchangé).
                <p aria-hidden="true" className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-accent-link">
                  {props.contexte}
                </p>
              )}
              {/* DES-1-11 : titre verrouillé en secondaire (tentant, pas éteint). */}
              <CardTitle
                className={`text-base decoration-text-muted underline-offset-4 group-hover:underline ${muted ? "text-text-secondary" : ""}`}
              >
                <span className="sr-only">Étape {step.order} : </span>
                {title}
                {isCompleted && <span className="sr-only"> (validée)</span>}
              </CardTitle>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {/* s17 tour 2 (DES-2-04) : pas de « +N XP » statique au-dessus du gain qui vient d'être affiché. */}
                {!(isCompleted && props.resultat?.xp) && (
                  <span className={`text-xs ${muted ? "text-text-muted" : "text-accent-link"}`}>+{stepXp} XP</span>
                )}
                {/* s19 (N3 @ux rendu) : « Lecture libre » ne parle qu'au visiteur. */}
                {!isPremium && (step.free || step.order === 1) && <Badge variant="primary">{ETAPE_LIBRE_BADGE}</Badge>}
                {isPremiumLocked && !isCompleted && <Badge variant="premium">{ETAPE_APERCU_LIBELLE}</Badge>}
              </div>
            </div>
          </div>
          {/* s19 (S2 @design, S4 @ux rendu iter 2) : un seul cadenas (le rond à gauche) ; chevron sur toute étape dépliable. */}
          <svg
            className={`h-5 w-5 shrink-0 text-text-muted transition-transform group-hover:text-text-primary ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </CardHeader>

      {/* Hors de l'en-tête : le nom vocal du bouton reste « Étape N : titre ». Annonce : zone aria-live de la page. */}
      {isCompleted && props.resultat && (props.resultat.xp || props.resultat.rythme) && (
        <div className="mt-2 pl-11 text-sm" data-testid="etape-resultat">
          {props.resultat.xp && (
            <p className="text-base font-bold text-accent-link animate-scale-in motion-reduce:animate-none">{props.resultat.xp}</p>
          )}
          {props.resultat.rythme && <p className="mt-0.5 text-text-secondary">{props.resultat.rythme}</p>}
        </div>
      )}

      {isExpanded && (
        <CardContent className="pt-0">
          {isPremiumLocked ? (
            <LockedStepPreview step={step} slug={slug} />
          ) : step.locked ? (
            // s17 tour 2 (DES-2-01, UXV-2-01) : bloc d'échec en error-text.
            // s17 tour 3 (UXV-3-01, DES-3-06) : étape dépliée en échec = c'est elle qui porte l'alerte, la phrase
            // rassurante et le seul « Réessayer » ; la carte de progression reste neutre (voir etapeAfficheEchec).
            props.loadFailed ? (
              <div
                role="alert"
                data-testid="etape-echec"
                className="rounded-lg border-l-2 border-error-text bg-error/10 p-3 text-sm text-error-text"
              >
                <p className="font-semibold">{CHARGEMENT_ETAPE.progressionIntacte}</p>
                <p className="mt-1">{CHARGEMENT_ETAPE.echec}</p>
                <Button
                  ref={props.reessayerRef}
                  variant="outline"
                  className="mt-3 min-h-[44px] w-full border-text-muted hover:border-text-primary sm:w-auto"
                  onClick={props.onRetryLoad}
                >
                  {CHARGEMENT_ETAPE.reessayer}
                </Button>
              </div>
            ) : (
              <div aria-busy="true" className="min-h-[160px] space-y-3 rounded-lg bg-background-elevated/40 p-4">
                <p role="status" className="text-sm text-text-muted">{CHARGEMENT_ETAPE.enCours}</p>
                <div aria-hidden="true" data-testid="etape-squelette" className="space-y-3 animate-pulse motion-reduce:animate-none">
                  <div className="h-4 w-full rounded bg-background-elevated" />
                  <div className="h-4 w-[90%] rounded bg-background-elevated" />
                  <div className="h-4 w-[60%] rounded bg-background-elevated" />
                </div>
              </div>
            )
          ) : (
            <StepContent {...props} hasQuiz={hasQuiz} />
          )}
        </CardContent>
      )}
    </Card>
  );
}

function StepContent(props: ParcoursStepCardProps & { hasQuiz: boolean }) {
  const { step, slug, isPremium, isCompleted, isQuizDone, isSeedFallback, hasQuiz } = props;
  const validerRef = useRef<HTMLButtonElement>(null);
  // s17 tour 3 (QA) : échec de validation = focus rendu à « Valider » (désactivé pendant l'envoi, il l'avait perdu).
  const { erreurValidation, completing } = props;
  useEffect(() => {
    if (erreurValidation && !completing) validerRef.current?.focus();
  }, [erreurValidation, completing]);
  // s18 (D3 @ux) : typographie française (espaces insécables, gluons) sur les textes du conseil et de l'étape
  // (`why`, `moduleDetail`). s19 iter 5 (H @design, S17 @ux) : tous les parcours, comme le défi en gras.
  // Seuls des caractères invisibles ou des espaces insécables sont posés : texte stocké inchangé.
  const prose = (t: string) => frTypoParcours(tipProse(t));
  const texteEtape = frTypoParcours;
  // s18 (D5 @ux) : défi en base suivi d'un second défi après une ligne vide (callback, étape 6).
  const exercice = step.tip.exercise ?? "";
  const coupure = step.exerciceSecondTitre ? exercice.indexOf("\n\n") : -1;
  const defis = coupure > 0 ? [exercice.slice(0, coupure), exercice.slice(coupure + 2)] : [exercice];
  // s19 (N4 @ux rendu iter 2) : « Version sans risque » et « Aller au défi », parcours Boulot seulement.
  const versionSansRisque = slug === "boulot" && exercice !== "";
  const defiAncre = `etape-${step.order}-defi`;
  return (
    <div className="space-y-6">
      {versionSansRisque && (
        // s19 iter 4 (S13 @ux) : -my-2, le blanc autour du lien passe de 40 à 32 px environ, cible de 44 px intacte.
        <a
          href={`#${defiAncre}`}
          onClick={() => trackUmami("defi-lien-clic", { parcours: slug, etape: step.order })}
          className="-my-2 flex min-h-[44px] w-fit items-center text-sm text-accent-link underline underline-offset-2 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
        >
          {DEFI_BOULOT.allerAuDefi}
        </a>
      )}
      {step.why && (
        <div className="rounded-lg bg-background-elevated p-3">
          <p className="text-sm font-medium text-accent-link">Pourquoi cette étape ?</p>
          <p className="mt-1 text-sm text-text-secondary">{texteEtape(step.why)}</p>
        </div>
      )}

      {step.moduleDetail && (
        <Section title="Ce que tu vas apprendre">
          {/* s19 : sauts de paragraphe du moduleDetail (phrase du test, Boulot) rendus tels quels. */}
          <p className={`${CORPS_LECTURE} whitespace-pre-line`}>{texteEtape(step.moduleDetail)}</p>
          {step.moduleFormat && <p className="mt-2 text-xs text-text-muted">Format : {step.moduleFormat}</p>}
          {props.timePerWeek && (
            <p className="mt-1 text-xs text-text-muted">
              {step.dureeTexte ?? dureeEtapeTexte(props.timePerWeek, (step.videos?.length ?? 0) > 0)}
            </p>
          )}
        </Section>
      )}

      {/* Conseil : masqué s'il répète mot pour mot le bloc précédent (T28). */}
      {step.tip.content && step.tip.content.trim() !== step.moduleDetail?.trim() && (
        <Section title="Le conseil">
          <p className={CORPS_LECTURE}>{prose(step.tip.content)}</p>
          {step.tipHref ? (
            <Link href={step.tipHref} className="inline-flex min-h-[44px] items-center text-sm text-accent-link underline underline-offset-2">
              {LIENS_FICHES.conseil}
            </Link>
          ) : (
            // s19 (S5 @ux rendu iter 2) : HTML de repli = place du lien réservée (il arrive avec l'API), pas de saut de page.
            isSeedFallback && <span aria-hidden="true" data-testid="lien-conseil-reserve" className="block min-h-[44px]" />
          )}
        </Section>
      )}

      {step.tip.example && (
        <Section title="Exemple concret">
          {/* s19 (N3 @design rendu) : une ligne de l'exemple = un paragraphe, avec un peu d'air.
              s19 iter 4 ([CHOIX UTILISATEUR] 11/10, point 4) : tous les parcours, plus seulement Storytelling et Boulot. */}
          <div className="rounded-lg bg-background-elevated p-3 text-sm italic leading-6 text-text-secondary">
            {lignesExemple(prose(step.tip.example)).map((l, i) => (
              <p key={i} className={i > 0 ? "mt-1.5" : undefined}>{l}</p>
            ))}
          </div>
        </Section>
      )}

      {step.tip.exercise && (
        <Section title="Exercice pratique" id={versionSansRisque ? defiAncre : undefined}>
          {defis.map((defi, i) => {
            // s19 (N4 @ux rendu iter 2) : Boulot, le repli passe dans son propre encadré titré.
            const repli = versionSansRisque ? decouperRepli(prose(defi)) : null;
            return (
              <Fragment key={i}>
                {/* s18 (D5 @ux) : le second défi (après la ligne vide) a son propre encadré et son titre. */}
                <div className={`${i > 0 ? "mt-3 " : ""}${ENCADRE_DEFI}`}>
                  {i > 0 && <p className="mb-1 text-sm font-semibold text-text-primary">{step.exerciceSecondTitre}</p>}
                  {/* s19 (N2 @design rendu) : interligne aéré et libellé « DÉFI X : » repérable, texte inchangé.
                      s19 iter 4 (point 4) : tous les parcours ; sans libellé « DÉFI X : », texte tel quel. */}
                  <p className="whitespace-pre-line text-sm leading-6 text-text-secondary">
                    <DefiTexte texte={repli ? repli[0] : prose(defi)} />
                  </p>
                </div>
                {repli && (
                  // s19 iter 4 (N-b @design) : titre medium gris, sous le « DÉFI X » en 14 px semibold blanc.
                  // s19 iter 5 (S16 @ux, N-1 @design) : 12 → 13 px. 14 px égalerait la taille du « DÉFI X » et du
                  // texte du repli, le titre ne s'en distinguerait plus que par la graisse : 13 px garde l'écart.
                  <div className={`mt-3 ${ENCADRE_REPLI}`} data-testid="version-sans-risque">
                    <p className="mb-1 text-[13px] font-medium leading-5 text-text-secondary">{DEFI_BOULOT.versionSansRisque}</p>
                    <p className="whitespace-pre-line text-sm leading-6 text-text-secondary">{repli[1]}</p>
                  </div>
                )}
                {/* s19 iter 4 (@copywriter) : critère commun aux deux versions, sous l'encadré, au corps du défi.
                    s19 iter 5 (G @design) : marge haute de 20 px (12 px entre défi et repli), le critère ne se lit
                    plus comme rattaché au repli ; texte et graisse inchangés. */}
                {repli && repli[2] !== "" && (
                  <p className="mt-5 whitespace-pre-line text-sm leading-6 text-text-secondary" data-testid="defi-suite">
                    {repli[2]}
                  </p>
                )}
              </Fragment>
            );
          })}
          {step.exerciceProtection && <p className="mt-2 text-sm text-text-secondary">{step.exerciceProtection}</p>}
          {step.retourExerciceNote && <p className="mt-3 text-sm text-text-secondary">{step.retourExerciceNote}</p>}
          <div className="mt-3">
            <ExerciseFeedback
              slug={slug}
              etape={step.order}
              initial={props.retour}
              isPremium={isPremium}
              onSelect={props.onRetour}
            />
          </div>
        </Section>
      )}

      <StepJokes step={step} isPremium={isPremium} />

      {step.videos && step.videos.length > 0 && (
        // DES-1-06 : filet avant la zone facultative.
        <div className="border-t border-border pt-6">
          <h4 className={SECTION_TITRE}>{VIDEOS_ETAPE.titre}</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {step.videos.map((v) => (
              <VideoCard key={v.youtubeId} video={v} seule={step.videos!.length === 1} />
            ))}
          </div>
        </div>
      )}

      {/* Visiteur : le quiz reste affiché une fois fini (résultat, « Refaire le quiz »), UXV-1-04. */}
      {hasQuiz && (!isQuizDone || !isPremium) && !isCompleted && (
        <div className="border-t border-border pt-6">
          <h4 className={SECTION_TITRE}>{isPremium ? QUIZ_TITRE.abonne : QUIZ_TITRE.visiteur}</h4>
          <StepQuiz quiz={step.quiz!} canValidate={isPremium} onComplete={props.onQuizComplete} />
        </div>
      )}

      {hasQuiz && isQuizDone && !isCompleted && isPremium && (
        <p className="text-center text-sm font-medium text-accent-link">Quiz bouclé, tu peux valider l&apos;étape</p>
      )}

      {!isCompleted && isPremium && !isSeedFallback && hasQuiz && !isQuizDone && (
        // s17 tour 2 (DES-2-03, UXV-2-02) : gris lisible (≈ 7:1), aria-disabled pour que la consigne soit lue.
        <Button
          variant="primary"
          aria-disabled="true"
          className="w-full cursor-not-allowed border border-border bg-background-elevated text-text-secondary hover:bg-background-elevated"
          onClick={(e) => e.preventDefault()}
        >
          Termine le quiz pour valider cette étape
        </Button>
      )}

      {!isCompleted && isPremium && !isSeedFallback && (!hasQuiz || isQuizDone) && (
        <div className="space-y-3">
          {/* s17 tour 3 (QA) : message à côté du bouton cliqué, quiz et bouton conservés, pas de doublon en haut. */}
          {erreurValidation && (
            <p role="alert" className="rounded-lg border-l-2 border-error-text bg-error/10 p-3 text-sm text-error-text">
              {erreurValidation}
            </p>
          )}
          <Button
            ref={validerRef}
            variant="primary"
            className="w-full disabled:opacity-80"
            onClick={props.onComplete}
            disabled={props.completing}
          >
            {/* s17 tour 2 (DES-2-03) : « On valide… » lisible, avec un indicateur 16 px. */}
            {props.completing && (
              <span
                aria-hidden="true"
                className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent motion-reduce:animate-none"
              />
            )}
            {props.completing ? "On valide…" : "Valider cette étape"}
          </Button>
        </div>
      )}

      {/* s19 iter 4 (S10 @ux) : masqué si le chargement a échoué (l'alerte dit « Ta progression est intacte. »). */}
      {!isCompleted && isPremium && isSeedFallback && !props.loadFailed && (
        <p className="text-center text-sm text-text-muted">Le suivi de ta progression arrive bientôt sur ce parcours.</p>
      )}

      {isCompleted && (
        // s18 (M-4 @design) : même coche que l'en-tête de l'étape validée.
        <p className="flex items-center justify-center gap-1.5 text-center text-sm font-medium text-accent-link">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Étape validée
        </p>
      )}

      {!isPremium && !isCompleted && step.order === 1 && (
        <ValidationWall
          slug={slug}
          href={props.abonnementHref}
          finEtape1Href={props.finEtape1Href}
          quizPending={hasQuiz && !isQuizDone}
          etapeSuivante={props.etapeSuivante ?? null}
          annuel={props.annuel ?? false}
        />
      )}
    </div>
  );
}
