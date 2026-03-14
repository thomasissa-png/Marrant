import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "Conditions générales d'utilisation de deviens-marrant.fr : droits, obligations et règles d'utilisation du service.",
};

export default function CGUPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">Conditions Générales d&apos;Utilisation</h1>
      <p className="mt-2 text-sm text-text-muted">Dernière mise à jour : 8 mars 2026</p>
      <div className="mt-8 space-y-6 text-text-secondary">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">1. Objet</h2>
          <p>Les présentes CGU régissent l&apos;utilisation de la plateforme deviens-marrant.fr, accessible à l&apos;adresse https://deviens-marrant.fr, dédiée à l&apos;apprentissage de l&apos;humour et de la répartie.</p>
          <p className="mt-2">En accédant au site ou en créant un compte, vous acceptez sans réserve les présentes conditions.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">2. Inscription et compte</h2>
          <p>L&apos;inscription est gratuite et ouverte à toute personne de plus de 15 ans. L&apos;utilisateur s&apos;engage à fournir des informations exactes et à maintenir la confidentialité de ses identifiants.</p>
          <p className="mt-2">Un seul compte par personne est autorisé. L&apos;éditeur se réserve le droit de suspendre ou supprimer tout compte en cas de violation des présentes CGU.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">3. Offres et tarifs</h2>
          <p>Le plan gratuit donne accès à un nombre limité de contenus par jour (blagues, conseils, vidéos).</p>
          <p className="mt-2">Le plan Premium (0,99 €/mois, prix de lancement susceptible d&apos;évoluer) offre un accès illimité à l&apos;ensemble du catalogue et des fonctionnalités exclusives. L&apos;abonnement est sans engagement et peut être annulé à tout moment depuis l&apos;espace profil.</p>
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
          <p>Conformément à la Directive européenne 2011/83/UE et au Code de la consommation français, vous disposez d&apos;un délai de 14 jours à compter de la souscription pour exercer votre droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.</p>
          <p className="mt-2">Pour exercer ce droit, adressez votre demande à contact@deviens-marrant.fr. Le remboursement sera effectué dans un délai de 14 jours suivant la réception de la demande.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">7. Résiliation</h2>
          <p>L&apos;utilisateur peut supprimer son compte à tout moment depuis son profil. La suppression entraîne l&apos;effacement de toutes les données personnelles dans un délai de 30 jours.</p>
          <p className="mt-2">L&apos;abonnement Premium peut être annulé avant la fin de la période en cours. L&apos;accès Premium reste actif jusqu&apos;à la fin de la période payée.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">8. Limitation de responsabilité</h2>
          <p>L&apos;éditeur ne garantit pas que le service sera disponible de manière ininterrompue. L&apos;éditeur ne pourra être tenu responsable des dommages indirects liés à l&apos;utilisation du service.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">9. Droit applicable</h2>
          <p>Les présentes CGU sont soumises au droit français. Tout litige sera soumis à la compétence exclusive des tribunaux de Paris.</p>
        </section>
      </div>
    </>
  );
}
