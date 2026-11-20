import type { Metadata } from "next";
import { NOINDEX_ROBOTS } from "@/lib/seo-meta";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LettrePageInscription } from "@/components/lettre/lettre-page-inscription";
import { LettreStatut } from "@/components/lettre/lettre-statut";
import { LETTRE_EMPLACEMENTS, LETTRE_INSCRIPTIONS_OUVERTES } from "@/config/lettre";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { AvecContact } from "@/components/lettre/avec-contact";
import { lireApercuLettre } from "@/lib/lettre/apercu";
import { frPonctuation } from "@/lib/fr-typo";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { LettrePageOuverte } from "@/components/espace/lettre-page-ouverte";

/**
 * Page de la lettre mensuelle (s21, spec §1.4 et §5) : présentation, formulaire,
 * dernier numéro envoyé, et arrivée de la confirmation, de la désinscription et
 * des liens invalides (`?statut=`).
 *
 * Rendu : SSR à chaque requête (statut lu dans l'URL, dernier numéro en base).
 * La date du prochain numéro n'est jamais affichée (décision de Thomas, 17/10).
 * `noindex`, hors sitemap. Interrupteur fermé : 404, sauf les statuts de
 * désinscription (un e-mail déjà parti doit pouvoir être arrêté).
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: TEXTES_LETTRE.page.metaTitre,
  description: TEXTES_LETTRE.page.metaDescription,
  ...NOINDEX_ROBOTS,
  referrer: "same-origin",
};

const STATUTS_TOUJOURS = ["desinscrit", "invalide", "erreur"] as const;
const S = TEXTES_LETTRE.statuts;

type Params = { statut?: string; mesure?: string; emplacement?: string };

export default async function LettrePage({ searchParams }: { searchParams: Params }) {
  const statut = typeof searchParams.statut === "string" ? searchParams.statut : null;

  // Décision de Thomas du 14/11, interrupteur de l'espace ouvert : « La lettre » est une seule section pour tous.
  // L'abonné actif y lit l'archive de toutes les lettres envoyées (ex-`/mon-espace/lettres`, qui renvoie ici) ; le
  // visiteur, le compte gratuit et l'ancien abonné gardent la page d'inscription ci-dessous. Une adresse de statut
  // (confirmation, désinscription, lien invalide…) garde son écran pour tous. Fermé : aucune lecture de session,
  // page d'aujourd'hui ; garde et archive chargées à la demande, jamais fermé.
  // s26 batterie (défaut n°4), ouvert seulement : compte connecté (gratuit ou ancien abonné) dont l'adresse a CONFIRMÉ la
  // lettre = l'état « confirmé » existant (bandeau `statuts.confirmee`, sans mesure) au lieu du formulaire. Fermé : rien.
  let statutOuvert = statut;
  if (ESPACE_CLIENT_PUBLIE && !statut) {
    const { lireAccesEspace } = await import("@/lib/espace/garde");
    const acces = await lireAccesEspace();
    if (acces.acces === "ouvert") {
      // v6 tour 1, point 10 : H1 « La lettre » (libellé de la bande) et lettres envoyées en cartes à filet.
      const { LettresAbonneCartes } = await import("@/components/lettre/lettres-abonne-cartes");
      return <LettresAbonneCartes />;
    }
    if (acces.acces === "abonnement") {
      const { lettreConfirmeeDuCompte } = await import("@/lib/lettre/compte");
      if (await lettreConfirmeeDuCompte(acces.userId)) statutOuvert = "confirmee";
    }
  }

  if (!LETTRE_INSCRIPTIONS_OUVERTES && !(statut && (STATUTS_TOUJOURS as readonly string[]).includes(statut))) notFound();

  const apercu = LETTRE_INSCRIPTIONS_OUVERTES ? await lireApercuLettre() : { dernier: null };
  const emplacement = (LETTRE_EMPLACEMENTS as readonly string[]).includes(searchParams.emplacement ?? "")
    ? (searchParams.emplacement as string)
    : null;

  // s26 (`docs/ux/questions-repliques-lettre-profil-s26.md` §3.1) : interrupteur ouvert, mêmes contenus et mêmes états
  // sur la grille de 12 colonnes (inscription 7, dernier numéro 5). Fermé : le rendu ci-dessous, au caractère près.
  if (ESPACE_CLIENT_PUBLIE) {
    return (
      <LettrePageOuverte
        statut={statutOuvert}
        mesure={statutOuvert === statut ? searchParams.mesure : undefined}
        emplacement={emplacement}
        dernier={apercu.dernier}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-10">
      {statut === "confirmee" && (
        <LettreStatut titre={S.confirmee.titre} confirmee confirmeeMesuree={searchParams.mesure === "1" ? { emplacement } : undefined}>
          <p className="mt-1 text-sm text-text-secondary">{S.confirmee.texte}</p>
          <Link href={S.confirmee.lienHref} className="mt-2 inline-flex min-h-11 items-center text-sm text-accent-link underline">
            {S.confirmee.lien}
          </Link>
        </LettreStatut>
      )}
      {statut === "desinscrit" && (
        <LettreStatut titre={S.desinscrit.titre}>
          {LETTRE_INSCRIPTIONS_OUVERTES && (
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

      {/* QA s21 m2 : après la confirmation comme après la désinscription, le statut
          seul (plus de formulaire qui invite à s'inscrire une seconde fois). QA s21 m1 :
          lien invalide ou erreur, le formulaire annoncé par le bandeau est toujours là. */}
      {LETTRE_INSCRIPTIONS_OUVERTES && statut !== "desinscrit" && statut !== "confirmee" && (
        <LettrePageInscription ignorerDrapeau={statut === "invalide" || statut === "erreur"} />
      )}

      {apercu.dernier && (
        <section aria-labelledby="lettre-dernier" className="border-t border-border pt-6">
          <h2 id="lettre-dernier" className="text-sm font-medium uppercase tracking-wider text-text-muted">
            {TEXTES_LETTRE.page.dernierNumero}
          </h2>
          {/* Décision de Thomas du 16/11 (s25) : fermé aussi, le corps se coupe partout (`min-w-0
              [overflow-wrap:anywhere]`), plus de débordement à 375 px ; texte et adresses inchangés. Ouvert : s26,
              `LettrePageOuverte` (carte neutre, adresses brutes en liens courts). */}
          <p className="mt-2 font-semibold text-text-primary">{frPonctuation(apercu.dernier.subject)}</p>
          <div className="mt-2 min-w-0 whitespace-pre-line text-text-secondary [overflow-wrap:anywhere]">{frPonctuation(apercu.dernier.bodyText)}</div>
        </section>
      )}
    </div>
  );
}
