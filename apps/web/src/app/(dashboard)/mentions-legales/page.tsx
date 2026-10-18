import type { Metadata } from "next";
import { pageShareMeta } from "@/lib/seo-meta";

const PAGE_URL = "https://deviens-marrant.fr/mentions-legales";
const PAGE_TITLE = "Mentions légales";
const PAGE_DESCRIPTION =
  "Mentions légales du site deviens-marrant.fr : éditeur du site, hébergement, propriété intellectuelle, crédits et moyens de contact pour toute question.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  // SEO s21 : aperçu de partage propre à la page (og:url), au lieu de celui de l'accueil.
  ...pageShareMeta({ title: PAGE_TITLE, description: PAGE_DESCRIPTION, url: PAGE_URL }),
};

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Mentions légales</h1>
      <p className="mt-2 text-sm text-text-muted">Dernière mise à jour : 7 octobre 2026</p>
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
          {/* Audit s16 (reco 18) : production sur Cloudflare Workers depuis le 30/09/2026.
              Adresse : siège de Cloudflare, Inc. (rapport annuel 10-K, SEC). */}
          <p>Ce site est hébergé par Cloudflare, Inc.</p>
          <p>101 Townsend St, San Francisco, CA 94107, États-Unis</p>
          <p>Site web : cloudflare.com</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Propriété intellectuelle</h2>
          <p>L&apos;ensemble du contenu de ce site (textes, images, vidéos, logos, design) est protégé par le droit d&apos;auteur et le droit des marques. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable de l&apos;éditeur.</p>
          <p className="mt-2">Les vidéos intégrées restent la propriété de leurs auteurs respectifs et sont diffusées via l&apos;API YouTube conformément aux conditions d&apos;utilisation de YouTube.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Crédits</h2>
          <p>Design et développement : équipe deviens-marrant</p>
          <p>Typographies : Inter (Google Fonts), Plus Jakarta Sans (Google Fonts)</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Contact</h2>
          <p>Pour toute question ou réclamation, écris-nous : contact@deviens-marrant.fr</p>
        </section>
      </div>
    </div>
  );
}
