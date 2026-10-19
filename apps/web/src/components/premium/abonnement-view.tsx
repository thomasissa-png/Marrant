"use client";

import { frTypo } from "@/lib/fr-typo";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { AvantagesPremium } from "@/components/premium/avantages-premium";
import { buildAbonnementUrl, getPostSignupRedirect } from "@/lib/premium-return";
import { FaqSection } from "@/components/home/faq-section";
import { getPremiumFaqs } from "@/lib/faqs";
import { buildLoginUrl, buildRegisterUrl } from "@/lib/auth-links";
import { trackUmami, trackUmamiWhenReady } from "@/lib/umami";
import { cn } from "@/lib/utils";
import { COLONNE_LECTURE } from "@/components/layout/gabarit";
import { FormuleCartes } from "@/components/premium/formule-cartes";
import { BarreAchatMobile, ID_ACHAT_FINAL, ID_ACHAT_PRINCIPAL } from "@/components/premium/barre-achat-mobile";
import { BoutonAchatAbonnement, type EmplacementAchat } from "@/components/premium/bouton-achat-abonnement";
import { parcoursEtape1Href, type ParcoursSlug } from "@/lib/entrees-parcours";
import { ABONNEMENT_CTA, MUR_PARCOURS } from "@/config/textes/cta-pages";
import { ABONNEMENT_ACHAT, ABONNEMENT_HAUT, ATTENTE_PAIEMENT, PAS_ENCORE_SUR_SANS_COMPTE } from "@/config/textes/abonnement-vente";
import type { PremiumPlan } from "@/config/premium";
import { PAIEMENT_ANNULE, REASSURANCE_UNIQUE } from "@/config/textes/offre";
import { estRetourSansPaiement } from "@/lib/checkout-tracking";
import { CheckoutConflictNotice } from "@/components/premium/checkout-conflict-notice";
import { ResiliationProgrammeeNotice } from "@/components/premium/resiliation-programmee-notice";
import { useResiliationProgrammee } from "@/hooks/use-resiliation-programmee";
import { readPlanFromUrl, readReturnTo, readSrcFromUrl, useAbonnementCheckout } from "@/hooks/use-abonnement-checkout";

/** Retour de Stripe sans paiement : `?paiement=annule` ou l'ancien `?upgrade=cancel`. */
export const isCheckoutCancelReturn = estRetourSansPaiement;

const LIEN_DISCRET = "inline-flex min-h-[44px] items-center font-medium text-accent-link underline underline-offset-4 hover:text-text-primary";
const LIGNE_PETITE = "text-center text-[13px] leading-snug text-text-secondary";

/**
 * Page de vente /abonnement (trajet de conversion s21, @ux §5, textes-trajet-v1 §1). Ordre :
 * accroche d'origine, titre, sous-titre, preuve, carte d'offre (avantages, formules, bouton, suite,
 * réassurance, « Déjà un compte ? »), tableau, carnet, « Pas encore sûr ? », bouton final, FAQ,
 * barre collante mobile. Le bouton d'achat tient dans le premier écran à 375 × 812.
 * Les blocs sans état (tableau, carnet, accroche) sont rendus par le serveur (page.tsx).
 */
export function AbonnementView({
  annualAvailable,
  carnetExtrait = null,
  tableau = null,
  accroche = null,
  parcoursOrigine = null,
  connecteServeur = false,
  retourInscription = false,
}: {
  annualAvailable: boolean;
  /** Session lue par le serveur au rendu : pas de bascule visiteur / connecté pendant le chargement. */
  connecteServeur?: boolean;
  /** B4 : fiche offerte du carnet du mois (serveur) ; null si le carnet du mois manque. */
  carnetExtrait?: ReactNode;
  /** B3 : tableau Gratuit / Premium (serveur). */
  tableau?: ReactNode;
  /** Accroche selon l'origine du clic (serveur, `lib/abonnement-accroche`). */
  accroche?: string | null;
  /** Parcours d'origine (`returnTo`) : lien « Pas encore sûr ? ». */
  parcoursOrigine?: ParcoursSlug | null;
  /** `auto=1` avec une session : page d'attente au lieu de la page de vente (plus de flash). */
  retourInscription?: boolean;
}) {
  const { status } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<PremiumPlan>("monthly");
  const [returnTo, setReturnTo] = useState<string | null>(null);
  const [entrySrc, setEntrySrc] = useState<string | null>(null);
  // Source lue au montage : au retour de Google, le traceur du layout retire `src` de l'URL.
  const srcEntree = useRef<string | null>(null);
  const [paymentCanceled, setPaymentCanceled] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const src = readSrcFromUrl();
    srcEntree.current = src;
    setSelectedPlan(readPlanFromUrl());
    setReturnTo(readReturnTo());
    setEntrySrc(src);
    // Vue de l'offre, une fois par chargement ; le retour d'inscription (`auto=1`) est compté à part.
    const retour = params.get("auto") === "1";
    trackUmamiWhenReady("abonnement-vu", { src: retour ? "retour-inscription" : (src ?? "direct") });
    if (estRetourSansPaiement(params)) {
      setPaymentCanceled(true);
      trackUmamiWhenReady("abonnement-annule");
    }
  }, []);
  const plan: PremiumPlan = annualAvailable ? selectedPlan : "monthly";

  const isAuthenticated = status === "authenticated" || (status === "loading" && connecteServeur);
  const resiliation = useResiliationProgrammee(status);
  const { handleCheckout, isCheckoutLoading, conflict, attente } = useAbonnementCheckout({
    status,
    annualAvailable,
    attenteInitiale: retourInscription,
    srcEntree,
  });

  // Visiteur : /register (étape 1 sur 2), puis retour ici avec `auto=1` ; formule, intention et
  // source conservées jusqu'au paiement (mesure `checkout-ouvert`).
  const retourAbonnement = buildAbonnementUrl(returnTo, plan, entrySrc);
  const inscriptionHref = buildRegisterUrl({ callbackUrl: retourAbonnement, src: entrySrc ?? "abonnement" });
  // « Déjà un compte ? » : après connexion, même page d'attente puis paiement (`auto=1`).
  const connexionHref = buildLoginUrl({
    callbackUrl: getPostSignupRedirect(retourAbonnement, plan, entrySrc),
    src: entrySrc ?? "abonnement",
  });

  const clicVisiteur = (emplacement: EmplacementAchat) =>
    trackUmami("abonnement-clic", {
      formule: plan === "annual" ? "annuel" : "mensuel",
      src: "abonnement",
      entree: entrySrc ?? "direct",
      statut: "visiteur",
      emplacement,
    });
  const bouton = (emplacement: EmplacementAchat, id?: string, className?: string) => (
    <BoutonAchatAbonnement
      id={id}
      plan={plan}
      connecte={isAuthenticated}
      inscriptionHref={inscriptionHref}
      chargement={isCheckoutLoading}
      onCheckout={(e) => void handleCheckout("manuel", plan, e)}
      onClicVisiteur={clicVisiteur}
      emplacement={emplacement}
      className={className}
    />
  );
  const suiteEtReassurance = (testId: string) => (
    <>
      <p className={cn("mt-2", LIGNE_PETITE)} data-testid={isAuthenticated ? `paiement-stripe${testId}` : `abonnement-suite${testId}`}>
        {frTypo(isAuthenticated ? ABONNEMENT_ACHAT.suiteConnecte : ABONNEMENT_ACHAT.suiteVisiteur)}
      </p>
      <p className={cn("mt-1", LIGNE_PETITE)} data-testid={`reassurance-paiement${testId}`}>
        {frTypo(REASSURANCE_UNIQUE)}
      </p>
    </>
  );

  if (attente) {
    return (
      <div className={cn(COLONNE_LECTURE, "py-16 text-center")} role="status" data-testid="abonnement-attente">
        <h1 className="font-display text-2xl font-bold text-text-primary">{frTypo(ATTENTE_PAIEMENT.titre)}</h1>
        <p className="mt-3 text-text-secondary">{frTypo(ATTENTE_PAIEMENT.texte)}</p>
        <span aria-hidden="true" className="mx-auto mt-6 block h-6 w-6 animate-spin rounded-full border-2 border-accent-primary border-t-transparent motion-reduce:animate-none" />
      </div>
    );
  }

  return (
    <div className={cn(COLONNE_LECTURE, "pb-24 md:pb-0")}>
      {paymentCanceled && <BandeauAnnule onClose={() => setPaymentCanceled(false)} />}

      <header className="text-center">
        {accroche && (
          <p className="mb-1 text-xs font-semibold text-accent-link" data-testid="abonnement-accroche">
            {frTypo(accroche)}
          </p>
        )}
        <h1 className="font-display text-[1.75rem] font-bold leading-[1.15] text-text-primary [text-wrap:balance] sm:text-4xl">
          {frTypo(ABONNEMENT_HAUT.titre)}
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-balance text-base leading-snug text-text-secondary sm:text-lg">
          {frTypo(ABONNEMENT_HAUT.sousTitre)}
        </p>
        <p className="mt-2 text-sm text-text-secondary" data-testid="abonnement-preuve">
          {frTypo(ABONNEMENT_HAUT.preuve)}
        </p>
      </header>

      <Card data-testid="abonnement-offre" className="mt-4 border-2 border-accent-primary p-0 shadow-lg shadow-accent-primary/10 hover:border-accent-primary sm:mt-8">
        <CardContent className="p-4 sm:p-8">
          <h2 className="sr-only">{ABONNEMENT_ACHAT.nomCarte}</h2>
          <AvantagesPremium />
          <FormuleCartes value={plan} onChange={setSelectedPlan} annualAvailable={annualAvailable} />
          {isAuthenticated && resiliation ? (
            <ResiliationProgrammeeNotice finIso={resiliation.finIso} className="mt-4" />
          ) : (
            bouton("haut", ID_ACHAT_PRINCIPAL, "mt-4")
          )}
          {suiteEtReassurance("")}
          {conflict && <CheckoutConflictNotice conflict={conflict} className="mt-4" />}
          {!isAuthenticated && (
            <p className={cn("mt-1", LIGNE_PETITE)} data-testid="abonnement-deja-compte">
              {ABONNEMENT_ACHAT.dejaCompte}{" "}
              <Link href={connexionHref} className={LIEN_DISCRET}>
                {ABONNEMENT_ACHAT.connecteToi}
              </Link>
            </p>
          )}
        </CardContent>
      </Card>

      {tableau}
      {carnetExtrait}

      {!isAuthenticated && (
        <section aria-labelledby="abonnement-pas-encore-sur" className="mt-12 text-center md:mt-16" data-testid="abonnement-etape-1">
          <h2 id="abonnement-pas-encore-sur" className="font-display text-2xl font-bold text-text-primary">
            {frTypo(ABONNEMENT_CTA.pasEncoreSur)}
          </h2>
          <Link href={parcoursEtape1Href(parcoursOrigine ?? MUR_PARCOURS, "abonnement")} className={cn("mt-2", LIEN_DISCRET)}>
            {frTypo(ABONNEMENT_CTA.lienEtape1(parcoursOrigine ?? MUR_PARCOURS))}
          </Link>
          <p className="text-sm text-text-secondary">{PAS_ENCORE_SUR_SANS_COMPTE}</p>
        </section>
      )}

      {!(isAuthenticated && resiliation) && (
        <div className="mt-10" data-testid="abonnement-final">
          {bouton("bas", ID_ACHAT_FINAL)}
          {suiteEtReassurance("-final")}
        </div>
      )}

      <div className="mt-12 md:mt-16">
        <FaqSection items={getPremiumFaqs(annualAvailable)} />
      </div>

      {!(isAuthenticated && resiliation) && <BarreAchatMobile>{bouton("barre")}</BarreAchatMobile>}
    </div>
  );
}

/** B0 : retour de Stripe sans paiement, une ligne, fermable (ne pousse pas le bouton hors du premier écran). */
function BandeauAnnule({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="status"
      className="mb-4 flex items-center gap-2 rounded-xl border border-border bg-background-elevated py-1 pl-4 pr-1"
      data-testid="paiement-annule"
    >
      <p className="flex-1 text-sm text-text-primary">
        {frTypo(PAIEMENT_ANNULE.titre)} {frTypo(PAIEMENT_ANNULE.texte)}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-text-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        aria-label="Fermer"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
