import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
};

export default function ConfidentialitePage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">Politique de confidentialité</h1>
      <div className="mt-8 space-y-6 text-text-secondary">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Données collectées</h2>
          <p>Nous collectons les données suivantes : nom, adresse email, données de progression (XP, niveau, streak), et préférences de contenu.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Utilisation des données</h2>
          <p>Vos données sont utilisées pour personnaliser votre expérience, suivre votre progression et améliorer nos services.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Cookies</h2>
          <p>Nous utilisons des cookies essentiels pour l&apos;authentification et des cookies analytiques pour améliorer l&apos;expérience utilisateur.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Vos droits</h2>
          <p>Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données. Contactez-nous à privacy@deviensmarrant.fr.</p>
        </section>
      </div>
    </>
  );
}
