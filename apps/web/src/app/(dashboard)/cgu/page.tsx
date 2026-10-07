import type { Metadata } from "next";
import Link from "next/link";
// Libellé du bouton de résiliation lu à la source (profil, lot B) : la CGU suit le bouton réel.
import { TEXTES_ABONNEMENT } from "@/config/textes/compte";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "Conditions générales d'utilisation de deviens-marrant.fr : compte, offres et tarifs, rétractation, résiliation, propriété intellectuelle et responsabilité.",
};

export default function CGUPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Conditions <span className="whitespace-nowrap">Générales d&apos;Utilisation</span></h1>
      <p className="mt-2 text-sm text-text-muted">Dernière mise à jour : 7 octobre 2026</p>
      <div className="mt-8 space-y-6 text-text-secondary">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">1. Objet</h2>
          <p>Les présentes CGU régissent l&apos;utilisation de la plateforme deviens-marrant.fr, accessible à l&apos;adresse https://deviens-marrant.fr, dédiée à l&apos;apprentissage de l&apos;humour et de la répartie.</p>
          <p className="mt-2">En accédant au site ou en créant un compte, tu acceptes sans réserve les présentes conditions.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">2. Inscription et compte</h2>
          <p>L&apos;inscription est ouverte à toute personne de plus de 15 ans. L&apos;accès à l&apos;ensemble du contenu nécessite un abonnement actif. L&apos;utilisateur s&apos;engage à fournir des informations exactes et à maintenir la confidentialité de ses identifiants.</p>
          <p className="mt-2">Un seul compte par personne est autorisé. L&apos;éditeur se réserve le droit de suspendre ou supprimer tout compte en cas de violation des présentes CGU.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">3. Offres et tarifs</h2>
          <p>L&apos;abonnement Premium donne accès à l&apos;ensemble du catalogue : vannes, conseils, vidéos, parcours et contenu quotidien. Il est proposé en deux formules, prix toutes taxes comprises : mensuelle à 2,99 €/mois, ou annuelle à 24,99 €/an (soit 2,08 €/mois), payable en une seule fois.</p>
          <p className="mt-2">La formule mensuelle est sans engagement et reconduite tacitement chaque mois. La formule annuelle est conclue pour une durée d&apos;un an à compter du paiement, puis reconduite tacitement par périodes successives d&apos;un an, au tarif annuel en vigueur indiqué dans l&apos;email de rappel. Chaque formule peut être résiliée à tout moment depuis l&apos;espace profil (article 7).</p>
          <p className="mt-2">Avant chaque reconduction de la formule annuelle, l&apos;éditeur informe l&apos;utilisateur par email dédié, au plus tôt trois mois et au plus tard un mois avant la date limite de non-reconduction, de la possibilité de ne pas reconduire le contrat, de cette date limite, du montant et de la date du prélèvement. À défaut, l&apos;utilisateur peut résilier à tout moment à compter de la reconduction et être remboursé des sommes versées pour la période postérieure à la résiliation (article L.215-1 du Code de la consommation).</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">4. Contenu utilisateur</h2>
          <p>Les utilisateurs peuvent interagir avec le contenu (réactions, favoris). Tout contenu soumis qui serait illicite, haineux, discriminatoire ou contraire à l&apos;ordre public sera supprimé sans préavis.</p>
          <p className="mt-2">L&apos;éditeur se réserve le droit de modérer l&apos;ensemble des interactions sur la plateforme.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">5. Propriété intellectuelle</h2>
          <p>Le contenu de la plateforme (blagues originales, conseils, parcours d&apos;apprentissage, design) est protégé par le droit d&apos;auteur. Toute reproduction non autorisée est strictement interdite.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">6. Droit de rétractation</h2>
          <p>Conformément à la Directive européenne 2011/83/UE et au Code de la consommation français, tu disposes d&apos;un délai de 14 jours à compter de la conclusion du contrat pour exercer ton droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.</p>
          <p className="mt-2">Pour exercer ce droit, envoie ta demande à contact@deviens-marrant.fr ou passe par la page{" "}
            <Link href="/retractation" className="underline underline-offset-2 hover:text-text-primary">Rétractation</Link>. Le remboursement est effectué dans un délai de 14 jours suivant la réception de la demande.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">7. Résiliation</h2>
          <p>L&apos;utilisateur peut supprimer son compte à tout moment depuis son profil. La suppression entraîne l&apos;effacement de toutes les données personnelles dans un délai de 30 jours.</p>
          <p className="mt-2">Tu peux résilier l&apos;abonnement Premium (mensuel ou annuel) à tout moment, gratuitement, en ligne depuis ton profil, via le bouton « {TEXTES_ABONNEMENT.resilier} » puis « Confirmer la résiliation ». La résiliation prend effet à la fin de la période en cours (mois ou année) : l&apos;accès Premium reste actif jusqu&apos;à cette date et aucun nouveau prélèvement n&apos;est effectué. La période déjà payée n&apos;est pas remboursée, sous réserve de l&apos;article 6. Un email confirme la résiliation et sa date d&apos;effet.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">8. Limitation de responsabilité</h2>
          <p>L&apos;éditeur ne garantit pas que le service sera disponible de manière ininterrompue. L&apos;éditeur ne pourra être tenu responsable des dommages indirects liés à l&apos;utilisation du service.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">9. Droit applicable</h2>
          {/* Audit s16 (reco 18, D11 @legal) : plus de « compétence exclusive des tribunaux de Paris »,
              inopposable à un consommateur (art. R.631-3 du Code de la consommation). */}
          <p>Les présentes CGU sont soumises au droit français, sans te priver de la protection que t&apos;accordent les règles impératives du pays où tu résides.</p>
          <p className="mt-2">En cas de litige, écris-nous d&apos;abord à contact@deviens-marrant.fr : on cherche une solution amiable avec toi. Tu peux aussi recourir gratuitement à un médiateur de la consommation.</p>
          <p className="mt-2">À défaut d&apos;accord, tu peux saisir, à ton choix, l&apos;une des juridictions territorialement compétentes selon le Code de procédure civile ou la juridiction du lieu où tu demeurais au moment de la conclusion du contrat ou de la survenance du fait dommageable (article R.631-3 du Code de la consommation).</p>
        </section>
      </div>
    </div>
  );
}
