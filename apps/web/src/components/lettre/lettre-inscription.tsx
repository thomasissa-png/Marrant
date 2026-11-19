"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LETTRE_CONFIDENTIALITE_HREF, LETTRE_INSCRIPTIONS_OUVERTES, type LettreEmplacement } from "@/config/lettre";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { useLettreInscription, useLettreVu } from "@/hooks/use-lettre-inscription";
import { isPremiumPlan } from "@/lib/parcours-access";
import { cn } from "@/lib/utils";
import { NBSP, frPonctuation, lierComposes } from "@/lib/fr-typo";
import { LettreSucces } from "@/components/lettre/lettre-succes";
import { LIGNE_REPLIEE_CLASSES } from "@/components/lettre/lettre-repliee-style";
import { META_FORT } from "@/components/espace/typo";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";

interface LettreInscriptionProps {
  emplacement: LettreEmplacement;
  /** Article : slug (source `article:<slug>`, propriété Umami `slug`). */
  slug?: string;
  /** Quiz : type de profil (propriété Umami `profil`, jamais lié à l'adresse). */
  profil?: string;
  /** Page /lettre : le titre est le H1 de la page (id fourni), pas de titre en double. */
  titreId?: string;
  /**
   * s21 (bas d'article, concision v5) : titre et sous-titre (un paragraphe par entrée) propres
   * à l'emplacement, sans ligne de réassurance (la phrase dit déjà « Gratuite »). Absent :
   * textes communs de la lettre.
   */
  textes?: { titre: string; phrase: readonly string[] };
  /**
   * Concision v5 (fin d'étape 1) : ligne discrète, sans titre ni sous-titre, qui déplie le
   * formulaire au clic (fermé au chargement : aucun saut de mise en page). Case et mention
   * apparaissent avec le champ, qui prend le focus à l'ouverture.
   */
  repliee?: string;
  /**
   * QA v4 m-7 (`LettreRepliee`, chargement au dépliage) : ligne déjà dépliée au montage, le champ
   * prend le focus ; `lettre-vu` déjà mesuré par l'enveloppe légère (pas de double envoi).
   */
  ouverteAuDepart?: boolean;
  sansMesureVu?: boolean;
  /** `/lettre?statut=invalide|erreur` : formulaire affiché même avec une inscription en attente (QA s21 m1). */
  ignorerDrapeau?: boolean;
  /**
   * v6 tour 1, point 10 (interrupteur ouvert, page /lettre seulement) : la soumission est l'unique action de la
   * page, donc le plein (exception (c) de `docs/design/cta-forme-place-s21.md` §1.3). Absent : `outline-accent`.
   */
  plein?: boolean;
  className?: string;
}

/**
 * s26 finitions (`docs/design/relectures/lettre-profil-s26-tour3-design.md` points 2 et 3), page /lettre ouverte
 * seulement (`echelleEspace`) : contour `border-input` (#707070, 3:1 au moins sur la carte, l'ancien #2A2A2A faisait
 * 1,15:1, WCAG 1.4.11), indication en gris secondaire (deux gris de texte), marges au pas de 8. Case sans marge haute :
 * `mt-2` (demandé) la mettait 11 px sous le centre de la première ligne (5 px avec l'ancien `mt-0.5`), 0 la met à 2 px.
 * Fermé : inchangé.
 */
const CHAMP_EMAIL_OUVERT =
  "h-12 w-full rounded-lg border border-border-input bg-background-light px-4 text-base text-text-primary placeholder:text-text-secondary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary";
const CASE_OUVERTE =
  "h-6 w-6 shrink-0 accent-accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-primary";

const T = TEXTES_LETTRE.formulaire;
const E = TEXTES_LETTRE.erreurs;

/**
 * Inscription à la lettre mensuelle (s21, spec `docs/ux/lettre-inscription-s21.md` §2).
 * Interrupteur fermé ou abonné Premium connecté : rien n'est rendu.
 * Article : `data-blog-zone="lettre"`, JAMAIS `data-blog-cta*` (mesure du lot 1 isolée).
 * Bouton de niveau 2 (`outline-accent`, revue design s21 M3) : la variante pleine
 * `primary` reste réservée à Premium (spec §1.2).
 */
export function LettreInscription({
  emplacement,
  slug,
  profil,
  titreId,
  textes,
  repliee,
  ouverteAuDepart = false,
  sansMesureVu = false,
  ignorerDrapeau = false,
  plein = false,
  className,
}: LettreInscriptionProps) {
  const { data: session, status } = useSession();
  const user = session?.user as { email?: string | null; plan?: string } | undefined;
  const isPremium = status === "authenticated" && isPremiumPlan(user?.plan);
  const mesure = useMemo(
    () => ({ emplacement, ...(slug ? { slug } : {}), ...(profil ? { profil } : {}) }),
    [emplacement, slug, profil],
  );
  const sectionRef = useRef<HTMLElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const caseRef = useRef<HTMLInputElement>(null);
  const piegeRef = useRef<HTMLInputElement>(null);
  const { etat, setEtat, erreur, setErreur, lente, attente, envoyer } = useLettreInscription(emplacement, slug, mesure, ignorerDrapeau);
  const [email, setEmail] = useState("");
  const [modifie, setModifie] = useState(false);
  const [consent, setConsent] = useState(false);
  const [hauteur, setHauteur] = useState<number | undefined>(undefined);
  const [ouvert, setOuvert] = useState(!repliee || ouverteAuDepart);
  const [focusOuverture, setFocusOuverture] = useState(Boolean(repliee && ouverteAuDepart));
  // s26 tour 2 (L1) : /lettre, interrupteur ouvert (`plein` n'est passé que là) : marges et graisse du formulaire à
  // l'échelle de l'espace (plus de `mt-1`, `mt-3`, `gap-2.5` ni de 500). Ailleurs et fermé : classes d'avant.
  const echelleEspace = ESPACE_CLIENT_PUBLIE && plein;

  useLettreVu(sectionRef, LETTRE_INSCRIPTIONS_OUVERTES && !isPremium && !sansMesureVu, mesure);

  // E-mail du compte pré-rempli (modifiable) tant que la personne n'a rien tapé.
  useEffect(() => {
    if (!modifie && user?.email) setEmail(user.email);
  }, [user?.email, modifie]);

  useEffect(() => {
    if (erreur === "email") emailRef.current?.focus();
    if (erreur === "case") caseRef.current?.focus();
  }, [erreur]);

  // Ligne repliée : le champ prend le focus quand on déplie (geste de la personne, jamais au chargement).
  useEffect(() => {
    if (focusOuverture && ouvert) {
      emailRef.current?.focus();
      setFocusOuverture(false);
    }
  }, [focusOuverture, ouvert]);

  if (!LETTRE_INSCRIPTIONS_OUVERTES || isPremium) return null;

  const id = `lettre-${emplacement}`;
  const occupe = etat === "envoi";

  const soumettre = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHauteur(sectionRef.current?.offsetHeight);
    void envoyer(email, consent, piegeRef.current?.value ?? "");
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby={titreId ?? `${id}-titre`}
      data-lettre={emplacement}
      {...(emplacement === "article" ? { "data-blog-zone": "lettre" } : {})}
      className={cn("relative", className)}
      style={etat === "succes" && hauteur ? { minHeight: hauteur } : undefined}
    >
      {repliee ? (
        <p className="text-sm text-text-muted">
          <button
            type="button"
            id={`${id}-titre`}
            aria-expanded={ouvert}
            aria-controls={`${id}-formulaire`}
            onClick={() => {
              setOuvert((o) => !o);
              setFocusOuverture(true);
            }}
            className={LIGNE_REPLIEE_CLASSES}
          >
            {frPonctuation(repliee)}
          </button>
        </p>
      ) : (
        !titreId && (
          <>
            <p id={`${id}-titre`} className="text-base font-semibold text-text-primary">
              {textes ? frPonctuation(textes.titre) : TEXTES_LETTRE.titre}
            </p>
            {(textes ? textes.phrase.map(frPonctuation) : [TEXTES_LETTRE.phrase]).map(lierComposes).map((phrase) => (
              <p key={phrase} className="mt-1 text-sm text-text-secondary">
                {phrase}
              </p>
            ))}
          </>
        )
      )}

      {etat === "drapeau" ? (
        <p className="mt-3 text-sm text-text-secondary">
          {TEXTES_LETTRE.drapeau.texte}{" "}
          <button type="button" onClick={() => setEtat("formulaire")} className="min-h-11 text-accent-link underline">
            {TEXTES_LETTRE.drapeau.renvoyer}
          </button>
        </p>
      ) : etat === "succes" ? (
        <LettreSucces
          id={id}
          attente={attente}
          erreur={erreur}
          onRenvoyer={() => void envoyer(email, true, piegeRef.current?.value ?? "", true)}
          onChanger={() => {
            setErreur(null);
            setEtat("formulaire");
          }}
        />
      ) : !ouvert ? null : (
        <form
          id={`${id}-formulaire`}
          noValidate
          method="post"
          action="/api/newsletter"
          onSubmit={soumettre}
          // Revue visuelle s21 (décision 3) : formulaire déplié en colonne centrée de 448 px dans le bloc centré.
          // s26 tour 3 (point 13, /lettre ouvert) : sans titre dans la carte (`titreId`, titre de la page), le formulaire
          // ouvre la carte : plus de `mt-4`, marge haute = marge basse (42 contre 26 px au DOM au tour 2).
          className={repliee ? "mx-auto mt-1 w-full max-w-md text-left" : echelleEspace ? (titreId ? undefined : "mt-4") : "mt-3"}
        >
          <input type="hidden" name="emplacement" value={emplacement} />
          {slug && <input type="hidden" name="slug" value={slug} />}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>
              Site web
              <input ref={piegeRef} type="text" name="site-web" tabIndex={-1} autoComplete="off" defaultValue="" />
            </label>
          </div>

          <label htmlFor={`${id}-email`} className={repliee ? "sr-only" : echelleEspace ? META_FORT : "text-sm font-medium text-text-primary"}>
            {T.label}
          </label>
          {/* Une seule colonne à toutes les largeurs : ordre visuel = ordre du clavier
              (champ, case, bouton, mention ; WCAG 2.4.3, vérification visuelle s21). */}
          <div className={echelleEspace ? "mt-2 grid gap-4" : "mt-1 grid gap-2.5"}>
            <div>
              <input
                ref={emailRef}
                id={`${id}-email`}
                type="email"
                name="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="send"
                required
                readOnly={occupe}
                placeholder={T.placeholder}
                value={email}
                onChange={(e) => {
                  setModifie(true);
                  setEmail(e.target.value);
                  if (erreur === "email") setErreur(null);
                }}
                aria-invalid={erreur === "email" || undefined}
                aria-describedby={erreur === "email" ? `${id}-erreur-email` : undefined}
                className={echelleEspace ? CHAMP_EMAIL_OUVERT : "h-12 w-full rounded-lg border border-border bg-background-light px-3 text-base text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"}
              />
              {erreur === "email" && (
                <p id={`${id}-erreur-email`} role="alert" className="mt-1 text-sm text-error-text">
                  <span aria-hidden="true">! </span>
                  {E.email}
                </p>
              )}
            </div>

            <div>
              <label className={echelleEspace ? "flex min-h-11 cursor-pointer items-start gap-4 text-sm text-text-secondary" : "flex min-h-11 cursor-pointer items-start gap-3 text-sm text-text-secondary"}>
                <input
                  ref={caseRef}
                  type="checkbox"
                  name="consent"
                  value="true"
                  checked={consent}
                  onChange={(e) => {
                    if (occupe) return;
                    setConsent(e.target.checked);
                    if (erreur === "case") setErreur(null);
                  }}
                  aria-invalid={erreur === "case" || undefined}
                  aria-describedby={erreur === "case" ? `${id}-erreur-case` : undefined}
                  className={echelleEspace ? CASE_OUVERTE : "mt-0.5 h-6 w-6 shrink-0 accent-accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-primary"}
                />
                <span>{T.case}</span>
              </label>
              {erreur === "case" && (
                <p id={`${id}-erreur-case`} role="alert" className="mt-1 text-sm text-error-text">
                  <span aria-hidden="true">! </span>
                  {E.case}
                </p>
              )}
            </div>

            {(erreur === "reseau" || erreur === "limite") && (
              <p role="alert" className="text-sm text-error-text">
                {erreur === "limite" ? E.limite : E.reseau}
              </p>
            )}

            <Button
              type="submit"
              variant={plein ? "primary" : "outline-accent"}
              size="lg"
              aria-busy={occupe || undefined}
              // Revue visuelle s21 (décision 3) : même bouton que sur /lettre ; replié (fin d'étape 1),
              // pleine largeur de sa colonne centrée. Le seul plein du bloc reste « Passer à l'étape 2 ».
              className={repliee ? "min-h-12 w-full" : "w-full sm:w-auto sm:min-w-[200px] sm:justify-self-start"}
            >
              {occupe ? T.boutonEnvoi : T.bouton}
            </Button>
          </div>
          {lente && (
            <p role="status" className="mt-2 text-sm text-text-secondary">
              {T.attenteLongue}
            </p>
          )}
          {/* Revue design s21 m6 : « Gratuit, sans compte. » et la mention dans un seul
              paragraphe (textes inchangés), le bloc pèse moins lourd sur mobile.
              Insécable avant le lien : « droits : Confidentialité » ne se sépare pas.
              QA s21 m3 : zone tactile de 44 px portée par un pseudo-élément ; le lien
              reste une boîte de la hauteur du texte, son anneau de focus ne chevauche
              plus la ligne du dessus. */}
          <p className="mt-2 text-xs text-text-muted">
            {textes || repliee ? "" : `${T.reassurance} `}
            {T.mention}
            {NBSP}
            <Link
              href={LETTRE_CONFIDENTIALITE_HREF}
              className="relative rounded-sm underline after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text-primary"
            >
              {T.lienConfidentialite}
            </Link>
          </p>
        </form>
      )}
    </section>
  );
}
