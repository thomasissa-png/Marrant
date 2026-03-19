import type { Metadata } from "next";
import { RetractationForm } from "@/components/retractation/retractation-form";

export const metadata: Metadata = {
  title: "Droit de rétractation",
  description: "Exercez votre droit de rétractation sous 14 jours conformément à la directive 2011/83/UE. Formulaire de demande de remboursement deviens-marrant.fr.",
  robots: { index: true, follow: true },
};

export default function RetractationPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">
        Exercer votre droit de r&eacute;tractation
      </h1>

      <div className="mt-8 space-y-6 text-text-secondary">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">
            Votre droit de r&eacute;tractation
          </h2>
          <p>
            Conform&eacute;ment &agrave; la directive europ&eacute;enne 2011/83/UE et aux articles L.221-18 et suivants
            du Code de la consommation, vous disposez d&apos;un d&eacute;lai de <strong>14 jours</strong> &agrave; compter
            de la date de souscription pour exercer votre droit de r&eacute;tractation, sans avoir &agrave; justifier
            de motif ni &agrave; payer de p&eacute;nalit&eacute;s.
          </p>
          <p className="mt-2">
            Ce droit s&apos;applique &agrave; tout abonnement souscrit sur deviens-marrant.fr.
            Le remboursement sera effectu&eacute; dans un d&eacute;lai de 14 jours suivant la r&eacute;ception
            de votre demande, via le m&ecirc;me moyen de paiement que celui utilis&eacute; lors de l&apos;achat.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">
            Comment exercer ce droit
          </h2>
          <p>
            Remplissez le formulaire ci-dessous ou envoyez un email &agrave;{" "}
            <a
              href="mailto:contact@deviens-marrant.fr"
              className="text-accent-primary underline"
            >
              contact@deviens-marrant.fr
            </a>{" "}
            en pr&eacute;cisant votre adresse email de compte et la date d&apos;achat.
          </p>
        </section>

        <RetractationForm />
      </div>
    </>
  );
}
