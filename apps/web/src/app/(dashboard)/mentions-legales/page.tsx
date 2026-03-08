import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">Mentions légales</h1>
      <div className="mt-8 space-y-6 text-text-secondary">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Éditeur du site</h2>
          <p>deviensmarrant.fr est édité par [Nom de la société].</p>
          <p>Siège social : [Adresse]</p>
          <p>Email : contact@deviensmarrant.fr</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Hébergement</h2>
          <p>Ce site est hébergé par [Hébergeur].</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Propriété intellectuelle</h2>
          <p>L&apos;ensemble du contenu de ce site (textes, images, vidéos) est protégé par le droit d&apos;auteur. Toute reproduction est interdite sans autorisation préalable.</p>
        </section>
      </div>
    </>
  );
}
