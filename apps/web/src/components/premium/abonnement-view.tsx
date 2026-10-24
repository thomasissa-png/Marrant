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
import { PAIEMENT_ANNULE } from "@/config/textes/offre";
import { Reassurance } from "@/components/ui/reassurance";
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
  planInitial = "monthly",
}: {
  /** Formule de l'URL (`plan=annual`), lue par le serveur : HTML juste dès le premier rendu. */
  planInitial?: PremiumPlan;
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
  const [selectedPlan, setSelectedPlan] = useState<PremiumPlan>(planInitial);
  const [returnTo, setReturnTo] = useState<string | null>(null);
  const [entrySrc, setEntrySrc] = useState<string | null>(null);
  // Source lue au montage : au retour de Google, le traceur du layout retire `src` de l'URL.
  const srcEntree = useRef<string | null>(null);
  const [paymentCanceled, setPaymentCanceled] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const src = readSrcFromUrl();
    srcEntree.current = src;
    // `planInitial` (serveur) fait déjà foi ; l'URL ne peut qu'ajouter le choix de l'annuel.
    if (readPlanFromUrl() === "annual") setSelectedPlan("annual");
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
  // v3 M1 : la garantie juste sous le bouton (au-dessus de la flottaison à 320 × 640), puis la suite.
  const suiteEtReassurance = (testId: string) => (
    <>
      <Reassurance className="mt-2 max-[359px]:mt-1.5" testId={`reassurance-paiement${testId}`} />
      {/* Finition du tour 3 : ligne compte sur UNE ligne à 320 px (12 px, approche serrée, déborde sur la marge de la carte). */}
      <p
        className={cn("mt-1", LIGNE_PETITE, "max-[359px]:-mx-2 max-[359px]:mt-0.5 max-[359px]:whitespace-nowrap max-[359px]:text-xs max-[359px]:tracking-tight")}
        data-testid={isAuthenticated ? `paiement-stripe${testId}` : `abonnement-suite${testId}`}
      >
        {frTypo(isAuthenticated ? ABONNEMENT_ACHAT.suiteConnecte : ABONNEMENT_ACHAT.suiteVisiteur)}
      </p>
    </>
  );

  if (attente) {
    // Retour de Google ou de connexion (`auto=1`) : attente brève, sous l'en-tête, sans pied de page
    // (revue visuelle s21 : la page d'attente pleine faisait croire à une fin). Inscription par
    // e-mail : l'attente se fait dans le bouton de /register (aucune page).
    return (
      <div
        className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col items-center justify-center bg-background px-6 text-center"
        role="status"
        data-testid="abonnement-attente"
      >
        <h1 className="font-display text-2xl font-bold text-text-primary">{frTypo(ATTENTE_PAIEMENT.titre)}</h1>
        <p className="mt-2 text-text-primary" data-testid="abonnement-attente-formule">
          {frTypo(ATTENTE_PAIEMENT.formule(plan))}
        </p>
        <p className="mt-2 text-text-secondary">{frTypo(ATTENTE_PAIEMENT.texte)}</p>
        <span aria-hidden="true" className="mx-auto mt-6 block h-6 w-6 animate-spin rounded-full border-2 border-accent-primary border-t-transparent motion-reduce:animate-none" />
      </div>
    );
  }

  return (
    // v3 M3 : marge basse = hauteur MESURÉE de la barre fixe (`--abonnement-barre-h`, barre-achat-mobile.tsx).
    <div className={cn(COLONNE_LECTURE, "pb-[var(--abonnement-barre-h,6rem)] md:pb-0")}>
      {paymentCanceled && <BandeauAnnule onClose={() => setPaymentCanceled(false)} />}

      {/* v3 M1 : sous 400 px, en-tête resserré pour que la garantie tienne dans le premier écran à 320 × 640. */}
      <header className="text-center max-[399px]:-mt-5 max-[359px]:-mt-6">
        {/* v2 A02b : taille du corps, couleur de texte pleine. */}
        {accroche && (
          <p className="mb-1 text-base font-semibold text-text-primary" data-testid="abonnement-accroche">
            {frTypo(accroche)}
          </p>
        )}
        <h1 className="font-display text-[1.75rem] font-bold leading-[1.15] text-text-primary [text-wrap:balance] max-[359px]:text-[1.5rem] sm:text-4xl">
          {/* v2 A01 : « Deviens Marrant » écrit comme le logo (le site, pas un ordre). Texte inchangé. */}
          {frTypo(ABONNEMENT_HAUT.titreAvantNom)} <span className="whitespace-nowrap text-gradient">{ABONNEMENT_HAUT.titreNom}</span>
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-balance text-base leading-snug text-text-secondary max-[359px]:mt-1 max-[359px]:text-sm sm:text-lg">
          {frTypo(ABONNEMENT_HAUT.sousTitre)}
        </p>
        <p className="mt-2 text-sm text-text-secondary max-[399px]:mt-1 max-[359px]:hidden" data-testid="abonnement-preuve">
          {frTypo(ABONNEMENT_HAUT.preuve)}
        </p>
      </header>

      <Card data-testid="abonnement-offre" className="mx-auto mt-3 max-w-[560px] border-2 max-[399px]:mt-2 max-[359px]:mt-1.5 border-accent-primary p-0 shadow-lg shadow-accent-primary/10 hover:border-accent-primary sm:mt-8">
        {/* Revue visuelle tour 1 : à 320 × 640, le bouton d'achat doit tenir dans le premier écran. */}
        <CardContent className="p-3 max-[359px]:px-2 min-[360px]:p-4 sm:p-8">
          <h2 className="sr-only">{ABONNEMENT_ACHAT.nomCarte}</h2>
          <AvantagesPremium ancreCarnet={carnetExtrait !== null} />
          <FormuleCartes value={plan} onChange={setSelectedPlan} annualAvailable={annualAvailable} />
          {isAuthenticated && resiliation ? (
            <ResiliationProgrammeeNotice finIso={resiliation.finIso} className="mt-4" />
          ) : (
            bouton("haut", ID_ACHAT_PRINCIPAL, "mt-4 max-[399px]:mt-3 max-[359px]:mt-2.5")
          )}
          {suiteEtReassurance("")}
          {/* Finition du tour 3 (T2 à 320 × 640) : sous 360 px, « 1 500+ inscrits… » passe sous la garantie et
              la ligne compte (texte inchangé), pour que la ligne compte tienne dans le premier écran. */}
          <p className={cn("mt-1 hidden max-[359px]:block", LIGNE_PETITE)} data-testid="abonnement-preuve-bas">
            {frTypo(ABONNEMENT_HAUT.preuve)}
          </p>
          {conflict && <CheckoutConflictNotice conflict={conflict} className="mt-4" />}
          {!isAuthenticated && (
            <p className={cn("mt-1", LIGNE_PETITE)} data-testid="abonnement-deja-compte">
              {frTypo(ABONNEMENT_ACHAT.dejaCompte)}{" "}
              <Link href={connexionHref} className={LIEN_DISCRET}>
                {ABONNEMENT_ACHAT.connecteToi}
              </Link>
            </p>
          )}
        </CardContent>
      </Card>

      {/* v2 A05 : l'échange du carnet juste sous la carte d'offre (l'envie), puis le tableau (la preuve). */}
      {carnetExtrait}
      {tableau}

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
        <div className="mx-auto mt-10 max-w-[560px]" data-testid="abonnement-final">
          {bouton("bas", ID_ACHAT_FINAL)}
          {suiteEtReassurance("-final")}
        </div>
      )}

      {/* Finition du tour 3 : FAQ à la largeur de la carte (560 px), comme le carnet et le tableau. */}
      <div className="mx-auto mt-12 max-w-[560px] md:mt-16" data-testid="abonnement-faq">
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
