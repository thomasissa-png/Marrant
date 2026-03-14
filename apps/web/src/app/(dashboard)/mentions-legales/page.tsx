import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site deviens-marrant.fr : éditeur, hébergeur, propriété intellectuelle et responsabilité.",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">Mentions légales</h1>
      <p className="mt-2 text-sm text-text-muted">Dernière mise à jour : 8 mars 2026</p>
      <div className="mt-8 space-y-6 text-text-secondary">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Éditeur du site</h2>
          <p>deviens-marrant.fr est édité par la société deviens-marrant SAS.</p>
          <p>Capital social : 1 000 €</p>
          <p>Siège social : Paris, France</p>
          <p>RCS : en cours d&apos;immatriculation</p>
          <p>Email : contact@deviens-marrant.fr</p>
          <p>Directeur de publication : Alex Durand</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Hébergement</h2>
          <p>Ce site est hébergé par Replit Inc.</p>
          <p>50 Beale St, San Francisco, CA 94105, États-Unis</p>
          <p>Site web : replit.com</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Propriété intellectuelle</h2>
          <p>L&apos;ensemble du contenu de ce site (textes, images, vidéos, logos, design) est protégé par le droit d&apos;auteur et le droit des marques. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable de l&apos;éditeur.</p>
          <p className="mt-2">Les vidéos intégrées restent la propriété de leurs auteurs respectifs et sont diffusées via l&apos;API YouTube conformément aux conditions d&apos;utilisation de YouTube.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Crédits</h2>
          <p>Design et développement : équipe deviens-marrant</p>
          <p>Typographies : Inter (Google Fonts), Syne (Google Fonts)</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Contact</h2>
          <p>Pour toute question ou réclamation : contact@deviens-marrant.fr</p>
        </section>
      </div>
    </>
  );
}
