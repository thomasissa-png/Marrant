import type { Metadata } from "next";
import { RetractationForm } from "@/components/retractation/retractation-form";
import { formulaireTypeRetractation } from "@/config/textes/paiement";
import { MODELE_FORMULAIRE_TITRE, RETRACTATION_PERIMETRE } from "@/config/textes/juridique";

export const metadata: Metadata = {
  title: "Droit de rétractation",
  description: "Exerce ton droit de rétractation sous 14 jours conformément à la directive 2011/83/UE. Formulaire de demande de remboursement deviens-marrant.fr.",
  robots: { index: true, follow: true },
};

// Audit parcours s16 : tutoiement (D6), point de départ du délai aligné sur les
// CGU (« conclusion du contrat », @legal D15) et date de mise à jour (D16).
// Le formulaire (RetractationForm) relève du lot A.
// Lot G : périmètre du délai (premier paiement seulement, règle de Thomas) et
// modèle légal de formulaire (annexe R.221-1) offert AVANT la commande
// (L.221-5) : même source que l'annexe de l'e-mail de confirmation.
export default function RetractationPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold md:text-4xl">
        Exercer ton droit de rétractation
      </h1>
      <p className="mt-2 text-sm text-text-muted">Dernière mise à jour : 7 octobre 2026</p>

      <div className="mt-8 space-y-6 text-text-secondary">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">
            Ton droit de rétractation
          </h2>
          <p>
            Conformément à la directive européenne 2011/83/UE et aux articles L.221-18 et suivants
            du Code de la consommation, tu disposes d&apos;un délai de <strong>14 jours</strong> à compter
            de la conclusion du contrat (ta souscription) pour exercer ton droit de rétractation, sans avoir à justifier
            de motif ni à payer de pénalités.
          </p>
          <p className="mt-2">
            Ce droit s&apos;applique à tout abonnement souscrit sur deviens-marrant.fr.
            Le remboursement est effectué dans un délai de 14 jours suivant la réception
            de ta demande, avec le même moyen de paiement que celui utilisé lors de l&apos;achat.
          </p>
          <p className="mt-2">{RETRACTATION_PERIMETRE}</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">
            Comment exercer ce droit
          </h2>
          <p>
            Remplis le formulaire ci-dessous ou envoie un e-mail à{" "}
            <a
              href="mailto:contact@deviens-marrant.fr"
              className="text-accent-link underline"
            >
              contact@deviens-marrant.fr
            </a>{" "}
            en précisant l&apos;adresse e-mail de ton compte et la date d&apos;achat.
          </p>
        </section>

        <div className="max-w-xl">
          <RetractationForm />
        </div>

        <section aria-labelledby="modele-formulaire">
          <h2 id="modele-formulaire" className="mb-2 text-lg font-semibold text-text-primary">
            {MODELE_FORMULAIRE_TITRE}
          </h2>
          <pre className="whitespace-pre-wrap break-words rounded-lg border border-border bg-background-card p-4 font-sans text-sm text-text-secondary">
            {formulaireTypeRetractation()}
          </pre>
        </section>
      </div>
    </div>
  );
}
