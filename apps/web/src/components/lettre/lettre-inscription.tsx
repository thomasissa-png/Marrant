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
import { NBSP } from "@/lib/fr-typo";
import { LettreSucces } from "@/components/lettre/lettre-succes";

interface LettreInscriptionProps {
  emplacement: LettreEmplacement;
  /** Article : slug (source `article:<slug>`, propriété Umami `slug`). */
  slug?: string;
  /** Quiz : type de profil (propriété Umami `profil`, jamais lié à l'adresse). */
  profil?: string;
  /** Page /lettre : le titre est le H1 de la page (id fourni), pas de titre en double. */
  titreId?: string;
  /** `/lettre?statut=invalide|erreur` : formulaire affiché même avec une inscription en attente (QA s21 m1). */
  ignorerDrapeau?: boolean;
  className?: string;
}

const T = TEXTES_LETTRE.formulaire;
const E = TEXTES_LETTRE.erreurs;

/**
 * Inscription à la lettre mensuelle (s21, spec `docs/ux/lettre-inscription-s21.md` §2).
 * Interrupteur fermé ou abonné Premium connecté : rien n'est rendu.
 * Article : `data-blog-zone="lettre"`, JAMAIS `data-blog-cta*` (mesure du lot 1 isolée).
 * Bouton de niveau 2 (`outline-accent`, revue design s21 M3) : la variante pleine
 * `primary` reste réservée à Premium (spec §1.2).
 */
export function LettreInscription({ emplacement, slug, profil, titreId, ignorerDrapeau = false, className }: LettreInscriptionProps) {
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

  useLettreVu(sectionRef, LETTRE_INSCRIPTIONS_OUVERTES && !isPremium, mesure);

  // E-mail du compte pré-rempli (modifiable) tant que la personne n'a rien tapé.
  useEffect(() => {
    if (!modifie && user?.email) setEmail(user.email);
  }, [user?.email, modifie]);

  useEffect(() => {
    if (erreur === "email") emailRef.current?.focus();
    if (erreur === "case") caseRef.current?.focus();
  }, [erreur]);

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
      {!titreId && (
        <>
          <p id={`${id}-titre`} className="text-base font-semibold text-text-primary">
            {TEXTES_LETTRE.titre}
          </p>
          <p className="mt-1 text-sm text-text-secondary">{TEXTES_LETTRE.phrase}</p>
        </>
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
      ) : (
        <form noValidate method="post" action="/api/newsletter" onSubmit={soumettre} className="mt-3">
          <input type="hidden" name="emplacement" value={emplacement} />
          {slug && <input type="hidden" name="slug" value={slug} />}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>
              Site web
              <input ref={piegeRef} type="text" name="site-web" tabIndex={-1} autoComplete="off" defaultValue="" />
            </label>
          </div>

          <label htmlFor={`${id}-email`} className="text-sm font-medium text-text-primary">
            {T.label}
          </label>
          {/* Une seule colonne à toutes les largeurs : ordre visuel = ordre du clavier
              (champ, case, bouton, mention ; WCAG 2.4.3, vérification visuelle s21). */}
          <div className="mt-1 grid gap-2.5">
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
                className="h-12 w-full rounded-lg border border-border bg-background-light px-3 text-base text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
              {erreur === "email" && (
                <p id={`${id}-erreur-email`} role="alert" className="mt-1 text-sm text-error-text">
                  <span aria-hidden="true">! </span>
                  {E.email}
                </p>
              )}
            </div>

            <div>
              <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm text-text-secondary">
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
                  className="mt-0.5 h-6 w-6 shrink-0 accent-accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-primary"
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
              variant="outline-accent"
              size="lg"
              aria-busy={occupe || undefined}
              className="w-full sm:w-auto sm:min-w-[200px] sm:justify-self-start"
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
            {T.reassurance} {T.mention}
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
