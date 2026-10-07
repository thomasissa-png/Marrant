"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CONTACT_EMAIL, TEXTES_RETRACTATION_FORM as T } from "@/config/textes/paiement";

/**
 * Formulaire de rétractation (14 jours). s16 : la demande part vraiment
 * (POST /api/retractation : enregistrement, e-mail à l'admin, accusé de
 * réception au client). Le message de succès n'apparaît qu'après la réponse
 * du serveur, jamais avant.
 */
type Envoi =
  | { etat: "saisie" }
  | { etat: "envoi" }
  | { etat: "envoye"; ackSent: boolean }
  | { etat: "erreur"; message: string };

const INPUT_CLASS =
  "w-full rounded-lg border border-border bg-background-card px-4 py-2 text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary";

function LienContact() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-link underline">
      {CONTACT_EMAIL}
    </a>
  );
}

export function RetractationForm() {
  const [email, setEmail] = useState("");
  const [dateAchat, setDateAchat] = useState("");
  const [motif, setMotif] = useState("");
  const [envoi, setEnvoi] = useState<Envoi>({ etat: "saisie" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnvoi({ etat: "envoi" });
    try {
      const res = await fetch("/api/retractation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, dateAchat, motif }),
      });
      const data = (await res.json().catch(() => ({}))) as { ackSent?: boolean; error?: string };
      if (res.ok) {
        setEnvoi({ etat: "envoye", ackSent: data.ackSent !== false });
        return;
      }
      const message =
        res.status === 400 ? T.erreurValidation : res.status === 429 ? T.erreurTropDeDemandes : T.erreurServeur;
      setEnvoi({ etat: "erreur", message });
    } catch {
      setEnvoi({ etat: "erreur", message: T.erreurServeur });
    }
  };

  if (envoi.etat === "envoye") {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-lg font-medium text-text-primary" role="status">
            {T.succesTitre}
          </p>
          <p className="mt-2 text-text-secondary">
            {envoi.ackSent ? T.succesTexte : T.succesSansEmail} <LienContact />
          </p>
        </CardContent>
      </Card>
    );
  }

  const erreur = envoi.etat === "erreur" ? envoi.message : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-describedby={erreur ? "retractation-erreur" : undefined}>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-text-primary">
          Adresse email du compte *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={T.placeholderEmail}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="date-achat" className="mb-1 block text-sm font-medium text-text-primary">
          Date d&apos;achat *
        </label>
        <input
          type="date"
          id="date-achat"
          name="date-achat"
          required
          value={dateAchat}
          onChange={(e) => setDateAchat(e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="motif" className="mb-1 block text-sm font-medium text-text-primary">
          Motif (optionnel)
        </label>
        <textarea
          id="motif"
          name="motif"
          value={motif}
          onChange={(e) => setMotif(e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder={T.placeholderMotif}
          className={INPUT_CLASS}
        />
      </div>

      {erreur && (
        <p id="retractation-erreur" role="alert" className="text-sm text-error">
          {erreur} {erreur === T.erreurServeur && <LienContact />}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={envoi.etat === "envoi"}>
        {envoi.etat === "envoi" ? T.envoi : T.bouton}
      </Button>
    </form>
  );
}
