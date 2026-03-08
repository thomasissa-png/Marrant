import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
};

export default function CGUPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">Conditions Générales d&apos;Utilisation</h1>
      <div className="mt-8 space-y-6 text-text-secondary">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">1. Objet</h2>
          <p>Les présentes CGU régissent l&apos;utilisation de la plateforme deviensmarrant.fr, dédiée à l&apos;apprentissage de l&apos;humour et de la répartie.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">2. Inscription</h2>
          <p>L&apos;inscription est gratuite et ouverte à toute personne de plus de 15 ans. L&apos;utilisateur s&apos;engage à fournir des informations exactes.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">3. Utilisation du service</h2>
          <p>Le plan gratuit donne accès à un nombre limité de contenus par jour. Le plan Premium (9,99 €/mois) offre un accès illimité et le coaching IA personnalisé.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">4. Contenu utilisateur</h2>
          <p>Les utilisateurs peuvent soumettre du contenu (blagues, commentaires). Tout contenu illicite, haineux ou discriminatoire sera supprimé.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">5. Résiliation</h2>
          <p>L&apos;utilisateur peut supprimer son compte à tout moment. L&apos;abonnement Premium peut être annulé avant la fin de la période en cours.</p>
        </section>
      </div>
    </>
  );
}
