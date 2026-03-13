import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
};

export default function ConfidentialitePage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">Politique de confidentialité</h1>
      <p className="mt-2 text-sm text-text-muted">Dernière mise à jour : 8 mars 2026</p>
      <div className="mt-8 space-y-6 text-text-secondary">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">1. Responsable du traitement</h2>
          <p>Le responsable du traitement des données est deviens-marrant SAS, joignable à l&apos;adresse privacy@deviens-marrant.fr.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">2. Données collectées</h2>
          <p>Nous collectons les données suivantes :</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Données d&apos;identification : prénom, adresse email</li>
            <li>Données de connexion : adresse IP, type de navigateur, date et heure de connexion</li>
            <li>Données de progression : XP, niveau, streak, badges obtenus</li>
            <li>Données de préférences : favoris, réactions, résultats du quiz d&apos;onboarding</li>
            <li>Données de paiement (plan Premium) : traitées exclusivement par Stripe, jamais stockées sur nos serveurs</li>
          </ul>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">3. Finalités du traitement</h2>
          <p>Vos données sont utilisées pour :</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Gérer votre compte et votre authentification</li>
            <li>Personnaliser votre expérience (recommandations de contenu)</li>
            <li>Suivre votre progression dans l&apos;apprentissage de l&apos;humour</li>
            <li>Améliorer nos services grâce aux statistiques d&apos;utilisation anonymisées</li>
            <li>Gérer les abonnements et la facturation</li>
          </ul>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">4. Base légale</h2>
          <p>Les traitements sont fondés sur l&apos;exécution du contrat (fourniture du service), le consentement (cookies analytiques), et l&apos;intérêt légitime (amélioration du service, sécurité).</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">5. Cookies</h2>
          <p>Nous utilisons :</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li><strong>Cookies essentiels</strong> : authentification, session utilisateur (nécessaires au fonctionnement)</li>
            <li><strong>Cookies analytiques</strong> : mesure d&apos;audience anonymisée (soumis à votre consentement)</li>
          </ul>
          <p className="mt-2">Aucun cookie publicitaire n&apos;est utilisé.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">6. Durée de conservation</h2>
          <p>Les données sont conservées pendant la durée de votre compte. En cas de suppression, les données sont effacées dans un délai de 30 jours, sauf obligation légale de conservation.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">7. Vos droits (RGPD)</h2>
          <p>Conformément au Règlement Général sur la Protection des Données, vous disposez des droits suivants :</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li><strong>Droit d&apos;accès</strong> : obtenir une copie de vos données personnelles</li>
            <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
            <li><strong>Droit à l&apos;effacement</strong> : demander la suppression de vos données</li>
            <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
            <li><strong>Droit d&apos;opposition</strong> : vous opposer au traitement de vos données</li>
          </ul>
          <p className="mt-2">Pour exercer ces droits : privacy@deviens-marrant.fr. Vous pouvez également adresser une réclamation à la CNIL (cnil.fr).</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">8. Transferts de données</h2>
          <p>Certaines données peuvent être transférées vers des sous-traitants situés en dehors de l&apos;Union Européenne (Replit, Stripe, Google pour OAuth). Ces transferts sont encadrés par des clauses contractuelles types approuvées par la Commission Européenne.</p>
        </section>
      </div>
    </>
  );
}
