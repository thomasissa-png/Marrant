import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LettreInscription } from "@/components/lettre/lettre-inscription";
import { LettreStatut } from "@/components/lettre/lettre-statut";
import { LETTRE_EMPLACEMENTS, LETTRE_OUVERTE } from "@/config/lettre";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { AvecContact } from "@/components/lettre/avec-contact";
import { lireApercuLettre } from "@/lib/lettre/apercu";
import { frPonctuation } from "@/lib/fr-typo";

/**
 * Page de la lettre mensuelle (s21, spec §1.4 et §5) : présentation, formulaire,
 * dernier numéro envoyé, et arrivée de la confirmation, de la désinscription et
 * des liens invalides (`?statut=`).
 *
 * Rendu : SSR à chaque requête (statut lu dans l'URL, prochain numéro en base).
 * `noindex`, hors sitemap. Interrupteur fermé : 404, sauf les statuts de
 * désinscription (un e-mail déjà parti doit pouvoir être arrêté).
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: TEXTES_LETTRE.page.metaTitre,
  description: TEXTES_LETTRE.page.metaDescription,
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const STATUTS_TOUJOURS = ["desinscrit", "invalide", "erreur"] as const;
const S = TEXTES_LETTRE.statuts;
const dateParis = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", weekday: "long", day: "numeric", month: "long" });

type Params = { statut?: string; mesure?: string; emplacement?: string };

export default async function LettrePage({ searchParams }: { searchParams: Params }) {
  const statut = typeof searchParams.statut === "string" ? searchParams.statut : null;
  if (!LETTRE_OUVERTE && !(statut && (STATUTS_TOUJOURS as readonly string[]).includes(statut))) notFound();

  const apercu = LETTRE_OUVERTE ? await lireApercuLettre(new Date()) : { dernier: null, prochain: null };
  const emplacement = (LETTRE_EMPLACEMENTS as readonly string[]).includes(searchParams.emplacement ?? "")
    ? (searchParams.emplacement as string)
    : null;

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
      {statut === "confirmee" && (
        <LettreStatut titre={S.confirmee.titre} confirmeeMesuree={searchParams.mesure === "1" ? { emplacement } : undefined}>
          <p className="mt-1 text-sm text-text-secondary">{S.confirmee.texte}</p>
          {/* Ligne gardée mais masquée tant que le jour d'envoi n'est pas fixé (envoiPrevu null) : décision de Thomas attendue. */}
          {apercu.prochain && (
            <p className="mt-1 text-sm text-text-secondary">
              {S.confirmee.prochain.replace("{date}", dateParis.format(apercu.prochain))}
            </p>
          )}
          <Link href={S.confirmee.lienHref} className="mt-2 inline-flex min-h-11 items-center text-sm text-accent-link underline">
            {S.confirmee.lien}
          </Link>
        </LettreStatut>
      )}
      {statut === "desinscrit" && (
        <LettreStatut titre={S.desinscrit.titre}>
          {LETTRE_OUVERTE && (
            <Link href="/lettre" className="mt-2 inline-flex min-h-11 items-center text-sm text-accent-link underline">
              {S.desinscrit.lien}
            </Link>
          )}
        </LettreStatut>
      )}
      {statut === "invalide" && (
        <LettreStatut titre={S.invalide.titre}>
          <p className="mt-1 text-sm text-text-secondary">
            <AvecContact texte={S.invalide.texte} />
          </p>
        </LettreStatut>
      )}
      {statut === "erreur" && <LettreStatut titre={<AvecContact texte={S.erreur.titre} />} />}
      {statut === "verifie" && (
        <LettreStatut titre={TEXTES_LETTRE.succes.titre}>
          <p className="mt-1 text-sm text-text-secondary">{TEXTES_LETTRE.succes.texte}</p>
          <p className="mt-2 text-xs text-text-muted">{TEXTES_LETTRE.succes.aide}</p>
        </LettreStatut>
      )}
      {(statut === "saisie-email" || statut === "saisie-case") && (
        <LettreStatut titre={statut === "saisie-email" ? TEXTES_LETTRE.erreurs.email : TEXTES_LETTRE.erreurs.case} />
      )}

      {LETTRE_OUVERTE && statut !== "desinscrit" && (
        <>
          <header>
            <h1 id="lettre-titre-page" className="font-display text-3xl font-bold text-text-primary">
              {TEXTES_LETTRE.titre}
            </h1>
            <p className="mt-2 text-text-secondary">{TEXTES_LETTRE.phrase}</p>
          </header>
          <LettreInscription emplacement="page" titreId="lettre-titre-page" />
        </>
      )}

      {apercu.dernier && (
        <section aria-labelledby="lettre-dernier" className="border-t border-border pt-6">
          <h2 id="lettre-dernier" className="text-sm font-medium uppercase tracking-wider text-text-muted">
            {TEXTES_LETTRE.page.dernierNumero}
          </h2>
          <p className="mt-2 font-semibold text-text-primary">{frPonctuation(apercu.dernier.subject)}</p>
          <div className="mt-2 whitespace-pre-line text-text-secondary">{frPonctuation(apercu.dernier.bodyText)}</div>
        </section>
      )}
    </div>
  );
}
