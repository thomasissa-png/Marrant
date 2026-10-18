"use client";

import { frTypo } from "@/lib/fr-typo";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { PremiumBenefits } from "@/components/premium/premium-benefits";
import {
  AUTO_CHECKOUT_PARAM,
  AUTO_CHECKOUT_VALUE,
  buildAbonnementUrl,
  sanitizeReturnTo,
} from "@/lib/premium-return";
import { FaqSection } from "@/components/home/faq-section";
import { getPremiumFaqs } from "@/lib/faqs";
import { buildRegisterUrl, sanitizeSignupSrc } from "@/lib/auth-links";
import { trackUmami, trackUmamiWhenReady } from "@/lib/umami";
import { cn } from "@/lib/utils";
import { PlanSelector } from "@/components/premium/plan-selector";
import { PARCOURS_SLUGS, parcoursEtape1Href, parcoursSlugFromHref, type ParcoursSlug } from "@/lib/entrees-parcours";
import { ABONNEMENT_ETAPE_1 } from "@/config/textes/entrees-parcours";
import { ABONNEMENT_CONNECTE, ABONNEMENT_CTA, ABONNEMENT_HAUT_PAR_PARCOURS } from "@/config/textes/cta-pages";
import {
  formatEuros,
  PREMIUM_MONTHLY_PRICE_CENTS,
  type PremiumPlan,
} from "@/config/premium";
import {
  ABONNEMENT_HAUT_VISITEUR,
  OFFRE_NOM,
  PAIEMENT_ANNULE,
  REASSURANCE_PAIEMENT,
} from "@/config/textes/offre";
import { readCheckoutConflict, type CheckoutConflict } from "@/lib/checkout-conflict";
import { trackCheckoutEchec, trackCheckoutOuvert, type CheckoutFormule } from "@/lib/checkout-tracking";
import { CheckoutConflictNotice } from "@/components/premium/checkout-conflict-notice";
import { ResiliationProgrammeeNotice } from "@/components/premium/resiliation-programmee-notice";
import { useResiliationProgrammee } from "@/hooks/use-resiliation-programmee";

/**
 * Intention d'origine (ex. étape 2 d'un parcours) : relayée au paiement puis au
 * retour (/abonnement/success). Lue au clic dans l'URL (pas de useSearchParams :
 * la page garde son HTML statique), chemin interne uniquement.
 */
function readReturnTo(): string | null {
  if (typeof window === "undefined") return null;
  return sanitizeReturnTo(new URLSearchParams(window.location.search).get("returnTo"));
}

/** Choix annuel conservé après inscription (`/abonnement?plan=annual`). */
function readPlanFromUrl(): PremiumPlan {
  if (typeof window === "undefined") return "monthly";
  return new URLSearchParams(window.location.search).get("plan") === "annual" ? "annual" : "monthly";
}

/**
 * Retour de Stripe sans paiement : `?paiement=annule` (cancel_url posée par le
 * lot A de l'audit s16) ou l'ancien `?upgrade=cancel` (sessions ouvertes avant
 * le déploiement, gardé pour ne rien perdre).
 */
export function isCheckoutCancelReturn(params: URLSearchParams): boolean {
  return params.get("paiement") === "annule" || params.get("upgrade") === "cancel";
}

/** Source du clic d'entrée (`?src=`, ex. `fiche-vanne`), relayée à /register. */
function readSrcFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  return sanitizeSignupSrc(new URLSearchParams(window.location.search).get("src"));
}

/**
 * `auto=1` (retour d'inscription) : lu puis retiré de l'URL AVANT l'appel au
 * paiement, pour qu'un rechargement ou un retour arrière ne relance rien.
 * Jamais après un retour de Stripe sans paiement (`paiement=annule`).
 */
function consumeAutoCheckout(): boolean {
  if (typeof window === "undefined") return false;
  const url = new URL(window.location.href);
  if (url.searchParams.get(AUTO_CHECKOUT_PARAM) !== AUTO_CHECKOUT_VALUE) return false;
  url.searchParams.delete(AUTO_CHECKOUT_PARAM);
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  return !isCheckoutCancelReturn(url.searchParams);
}

/** Messages humains : jamais l'erreur brute de l'API (audit tunnel F14). */
function checkoutErrorMessage(status: number): string {
  if (status === 401) return "Ta session a expiré. Reconnecte-toi pour reprendre le paiement.";
  if (status === 429) return "Trop d'essais pour l'instant. Réessaie un peu plus tard.";
  if (status === 503) return "Cette formule n'est pas disponible pour le moment. Choisis le mensuel ou réessaie plus tard.";
  return "Le paiement n'a pas pu démarrer. Réessaie dans un instant.";
}

/**
 * Vue client de /abonnement (session + paiement). `annualAvailable` est lu
 * côté serveur au rendu (page dynamique) : faux tant que le prix Stripe
 * annuel n'est pas configuré, et la vue reste alors strictement mensuelle.
 */
export function AbonnementView({
  annualAvailable,
  carnetExtrait = null,
  parcoursOrigine = null,
  etapeSuivante = null,
  connecteServeur = false,
}: {
  annualAvailable: boolean;
  /**
   * s21 (CLS) : session lue par le serveur au rendu (page déjà dynamique). Tant que la session
   * client charge, la vue rend directement la version connectée ou visiteur, sans bascule.
   */
  connecteServeur?: boolean;
  /** Extrait du carnet du mois (lot 2 s21), rendu par le serveur ; null si le carnet du mois manque. */
  carnetExtrait?: ReactNode;
  /** s21 B16 : parcours d'origine (`returnTo`), lu par le serveur : surtitre et titre. */
  parcoursOrigine?: ParcoursSlug | null;
  /** s21 B16 : carte « Étape 2 » du parcours d'origine, rendue par le serveur, avant l'extrait du carnet. */
  etapeSuivante?: ReactNode;
}) {
  const { status } = useSession();
  // Mensuel par défaut ; ?plan=annual préselectionne l'annuel (si disponible).
  const [selectedPlan, setSelectedPlan] = useState<PremiumPlan>("monthly");
  // Intention d'origine lue après montage (le HTML serveur garde le lien sans returnTo).
  const [returnTo, setReturnTo] = useState<string | null>(null);
  const [entrySrc, setEntrySrc] = useState<string | null>(null);
  // s21 (QA M1) : source lue au montage. Au retour d'une inscription Google, le traceur du
  // layout retire `src` de l'URL (effet parent, après celui-ci) avant le paiement automatique.
  const srcEntree = useRef<string | null>(null);
  // Retour de Stripe sans paiement : message clair au-dessus de l'offre (reco 12).
  const [paymentCanceled, setPaymentCanceled] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const src = readSrcFromUrl();
    srcEntree.current = src;
    setSelectedPlan(readPlanFromUrl());
    setReturnTo(readReturnTo());
    setEntrySrc(src);
    // Vue de l'offre (audit s16 reco 17) : une fois par chargement, avec la porte d'entrée.
    // s21 (QA M1) : le retour d'inscription (`auto=1`) porte maintenant la source d'entrée ;
    // compté à part (`retour-inscription`) pour ne pas doubler la vue de cette source.
    const retourInscription = params.get(AUTO_CHECKOUT_PARAM) === AUTO_CHECKOUT_VALUE;
    trackUmamiWhenReady("abonnement-vu", { src: retourInscription ? "retour-inscription" : (src ?? "direct") });
    // Retour de Stripe sans paiement (cancel_url) : mesuré une fois au chargement.
    if (isCheckoutCancelReturn(params)) {
      setPaymentCanceled(true);
      trackUmamiWhenReady("abonnement-annule");
    }
  }, []);
  const plan: PremiumPlan = annualAvailable ? selectedPlan : "monthly";
  const isAnnual = plan === "annual";
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  // Refus 409 (déjà abonné, impayé) : message + lien /profil au lieu d'un toast.
  const [conflict, setConflict] = useState<CheckoutConflict | null>(null);
  // Plus de compte gratuit (s15) : un seul chemin, /register (étape 1 sur 2)
  // puis retour ici avec `auto=1` (paiement ouvert tout seul), formule et
  // intention conservées (voir getPostSignupRedirect et buildAbonnementUrl).
  const paidSignupHref = buildRegisterUrl({
    // s21 (QA M1) : la source d'entrée revient avec le callback (mesure du paiement).
    callbackUrl: buildAbonnementUrl(returnTo, plan, entrySrc),
    src: entrySrc ?? "abonnement",
  });

  // s21 (CLS 0,16 à 320 px) : pendant le chargement de la session, la version lue par le serveur.
  const isAuthenticated = status === "authenticated" || (status === "loading" && connecteServeur);
  // Résiliation programmée (lien de l'e-mail de résiliation, lot F) : pas de paiement, renvoi au profil.
  const resiliation = useResiliationProgrammee(status);
  // Compte connecté : pastille, titre et paragraphe E3 validés (`ABONNEMENT_CONNECTE`, cta-pages.ts).
  const pageBadge = ABONNEMENT_CONNECTE.pastille;
  // s21 B16 : surtitre et H1 visiteur selon le parcours d'origine (tour 4), sous-titre du lot 2.
  const hautVisiteur = ABONNEMENT_HAUT_PAR_PARCOURS[parcoursOrigine ?? "defaut"];
  const pageTitle = isAuthenticated
    ? ABONNEMENT_CONNECTE.titre
    : hautVisiteur.titre;
  const pageSubtitle = isAuthenticated
    ? frTypo(ABONNEMENT_CONNECTE.paragraphe)
    : ABONNEMENT_HAUT_VISITEUR.sousTitre;

  const handleCheckout = useCallback(async (declencheur: "auto" | "manuel", chosenPlan: PremiumPlan) => {
    const annual = chosenPlan === "annual";
    const formule: CheckoutFormule = annual ? "annuel" : "mensuel";
    // Source de mesure : le bloc d'entrée (`?src=`, ex. `header`), sinon la page elle-même.
    const srcMesure = srcEntree.current ?? readSrcFromUrl() ?? "abonnement";
    setIsCheckoutLoading(true);
    setConflict(null);
    trackUmami("abonnement-clic", { formule: annual ? "annuel" : "mensuel", src: "abonnement", declencheur, statut: "membre" });
    try {
      const origin = readReturnTo();
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Mensuel : corps historique inchangé (le serveur applique le mensuel par défaut).
        body: JSON.stringify({ ...(origin ? { returnTo: origin } : {}), ...(annual ? { plan: chosenPlan } : {}) }),
      });
      const data = await res.json();
      const conflit = readCheckoutConflict(res.status, data);
      if (res.ok && data.url) {
        trackCheckoutOuvert(srcMesure, formule);
        window.location.href = data.url;
      } else if (conflit) {
        trackCheckoutEchec(srcMesure, "conflit", formule);
        setConflict(conflit);
      } else {
        trackCheckoutEchec(srcMesure, "erreur", formule);
        console.error("[Checkout]", data.error);
        toast(checkoutErrorMessage(res.status), "error");
      }
    } catch {
      trackCheckoutEchec(srcMesure, "reseau", formule);
      toast("Connexion perdue, réessaie", "error");
    } finally {
      setIsCheckoutLoading(false);
    }
  }, []);

  // Retour d'inscription (`auto=1`) : paiement lancé une seule fois, dès que la
  // session est confirmée. Échec : bouton manuel et messages habituels.
  const autoChecked = useRef(false);
  useEffect(() => {
    if (autoChecked.current || status === "loading") return;
    autoChecked.current = true;
    // Formule relue dans l'URL (l'état `selectedPlan` peut ne pas être encore à jour).
    const autoPlan: PremiumPlan = annualAvailable && readPlanFromUrl() === "annual" ? "annual" : "monthly";
    if (consumeAutoCheckout() && status === "authenticated") void handleCheckout("auto", autoPlan);
  }, [status, handleCheckout, annualAvailable]);

  return (
    <div className="mx-auto max-w-2xl">
      {paymentCanceled && (
        <div
          role="status"
          className="mb-6 rounded-xl border border-border bg-background-elevated p-4 text-center"
          data-testid="paiement-annule"
        >
          <p className="font-semibold text-text-primary">{PAIEMENT_ANNULE.titre}</p>
          <p className="mt-1 text-sm text-text-secondary">{PAIEMENT_ANNULE.texte}</p>
        </div>
      )}

      <div className="text-center">
        {/* Badge affiché uniquement pour un utilisateur connecté */}
        {isAuthenticated && !resiliation && (
          <Badge variant="primary" className="mb-3 sm:mb-4">
            {pageBadge}
          </Badge>
        )}
        {!isAuthenticated && (
          // s21 B16 : surtitre sur deux lignes à 375 (hauteur fixe), compensée sous le titre :
          // le bouton d'achat garde sa position (mesurée à 375 x 700 avant et après).
          <p className="min-h-8 text-[0.8125rem] font-semibold leading-4 text-accent-link sm:mb-3 sm:min-h-0 sm:text-sm sm:leading-5" data-testid="abonnement-surtitre">
            {frTypo(hautVisiteur.surtitre)}
          </p>
        )}
        {/* s21 B16 : trois lignes réservées à 375 (titre le plus long), titre court centré dedans.
            s21 (QA v3 m-3) : compte connecté, écran mobile de 760 px de haut au plus (360 x 740,
            375 x 700) : titre à 24 px (trois lignes au lieu de quatre à 360) pour que le bouton
            d'achat tienne au premier écran. Règle CSS lue par le serveur : aucun saut au chargement. */}
        <h1
          className={cn(
            "font-display text-[1.75rem] font-bold leading-[1.15] text-text-primary sm:text-3xl md:text-4xl",
            isAuthenticated && "[@media(max-width:639px)_and_(max-height:760px)]:text-[1.5rem]",
            !isAuthenticated && "flex min-h-[3.45em] items-center justify-center sm:block sm:min-h-0",
          )}
        >
          {frTypo(pageTitle)}
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-balance text-[0.9375rem] leading-snug text-text-secondary sm:mt-3 sm:text-lg">
          {pageSubtitle}
        </p>
      </div>

      {/* Offre principale */}
      {/* Revue design s21 M2 : sous 640 px, marges et tailles resserrées (aucun texte touché)
          pour que le bouton d'achat tienne entier, avec de la marge, au premier écran d'un
          iPhone barres de Safari comprises (mesuré à 375 x 700). Le bouton suit des lignes de
          formule à hauteur fixe (m2) : un écart de 16 px suffit au-dessus de lui. */}
      <Card data-testid="abonnement-offre" className={`${isAuthenticated ? "mt-4" : "mt-[17px]"} border-2 border-accent-primary p-0 shadow-lg shadow-accent-primary/10 hover:border-accent-primary sm:mt-10`}>
        <CardContent className="p-4 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-lg font-bold text-text-primary">
              {OFFRE_NOM}
            </h2>
          </div>
          {annualAvailable ? (
            <PlanSelector value={plan} onChange={setSelectedPlan} />
          ) : (
            <>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-text-primary">
                  {formatEuros(PREMIUM_MONTHLY_PRICE_CENTS)}
                </span>
                <span className="text-text-muted">TTC / mois</span>
              </div>
              {/* Lot 2 s21 : plus de « Sans engagement, annulable à tout moment » ici ;
                  la seule mention est la réassurance sous le bouton. */}
            </>
          )}

          {isAuthenticated && resiliation ? (
            <ResiliationProgrammeeNotice finIso={resiliation.finIso} className="mt-8" />
          ) : isAuthenticated ? (
            <Button
              variant="primary"
              size="lg"
              className="mt-4 w-full sm:mt-8"
              onClick={() => void handleCheckout("manuel", plan)}
              disabled={isCheckoutLoading}
            >
              {isCheckoutLoading
                ? "On t'emmène au paiement…"
                : frTypo(ABONNEMENT_CONNECTE.bouton(plan))}
            </Button>
          ) : (
            <Link
              href={paidSignupHref}
              data-testid="abonnement-bouton-achat"
              className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-5 h-auto min-h-12 w-full whitespace-normal px-3 py-2 text-center [text-wrap:balance] sm:mt-8 sm:px-6")}
              onClick={() =>
                trackUmami("abonnement-clic", {
                  formule: isAnnual ? "annuel" : "mensuel",
                  src: "abonnement",
                  entree: entrySrc ?? "direct",
                  statut: "visiteur",
                })
              }
            >
              {ABONNEMENT_CTA.bouton(plan, parcoursOrigine)}
            </Link>
          )}
          {/* s21 B16 : [S32] ce qui suit le clic, juste sous le bouton (visiteur). */}
          {!isAuthenticated && (
            <p className="mt-2 text-center text-xs text-text-secondary" data-testid="abonnement-suite">
              {frTypo(ABONNEMENT_CTA.suite)}
            </p>
          )}

          {conflict && <CheckoutConflictNotice conflict={conflict} className="mt-4" />}

          <p className="mt-3 text-center text-xs text-text-muted" data-testid="reassurance-paiement">
            {REASSURANCE_PAIEMENT}
          </p>
          {/* Fusion s21 (choix de Thomas du 18/10 : pas de juridique dans les blocs d'appel) :
              une seule mention de Stripe. Visiteur : [S32] la porte déjà ; compte connecté
              (pas de [S32]) : cette ligne. /retractation reste dans le pied de page et la FAQ. */}
          {isAuthenticated && (
            <p className="mt-1 text-center text-xs text-text-muted" data-testid="paiement-stripe">
              Paiement sécurisé par Stripe
            </p>
          )}

          {/* Lot 2 s21 (§5.2, §7 point 3, choix de Thomas) : avantages SOUS le bouton
              d'achat, pour que le bouton soit visible sans défiler à 375 × 812. */}
          <PremiumBenefits className="mt-6 space-y-3" />
        </CardContent>
      </Card>

      {/* s21 B16 : aperçu public de l'étape 2 du parcours d'origine, avant l'extrait du carnet. */}
      {!isAuthenticated && etapeSuivante}

      {/* Lot 2 s21 : la fiche offerte du carnet du mois, avant « Pas encore sûr ? ». */}
      {carnetExtrait}

      {/* s17 (QA-13) : voir ce qu'on achète. Retour vers un parcours précis : son étape 1 ;
          sinon les 3. Le lien n'apparaît qu'après montage pour le retour (HTML serveur : les 3). */}
      <section
        aria-labelledby="abonnement-etape-1-titre"
        data-testid="abonnement-etape-1"
        className="mt-6 rounded-xl border border-border bg-background-card p-6 text-center"
      >
        <h2 id="abonnement-etape-1-titre" className="font-semibold text-text-primary">
          {ABONNEMENT_ETAPE_1.titre}
        </h2>
        <p className="mt-1 text-sm text-text-secondary">{ABONNEMENT_ETAPE_1.texte}</p>
        <ul className="mt-3 flex flex-col items-center gap-1 sm:flex-row sm:justify-center sm:gap-4">
          {(parcoursSlugFromHref(returnTo ?? undefined) ? [parcoursSlugFromHref(returnTo ?? undefined)!] : PARCOURS_SLUGS).map(
            (slug) => (
              <li key={slug}>
                <Link
                  href={parcoursEtape1Href(slug, "abonnement")}
                  className="inline-flex min-h-[44px] items-center text-sm font-medium text-accent-link underline underline-offset-4 hover:text-text-primary"
                >
                  {ABONNEMENT_ETAPE_1.lien(slug)}
                </Link>
              </li>
            ),
          )}
        </ul>
      </section>

      {/* Garantie */}
      <div className="mt-6 rounded-xl bg-background-elevated p-6 text-center">
        <p className="font-semibold text-text-primary">
          Tu annules quand tu veux
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          Ton acc&egrave;s reste actif jusqu&apos;à la fin de ta p&eacute;riode en cours
          {annualAvailable ? " (le mois ou l'année déjà payés)" : ""}.
          Pas de frais cach&eacute;s, pas de pi&egrave;ge.
        </p>
      </div>

      {/* FAQ */}
      <div className="mt-12">
        <FaqSection items={getPremiumFaqs(annualAvailable)} />
      </div>
    </div>
  );
}
