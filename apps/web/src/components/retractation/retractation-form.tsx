"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function RetractationForm() {
  const [email, setEmail] = useState("");
  const [dateAchat, setDateAchat] = useState("");
  const [motif, setMotif] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-lg font-medium text-text-primary" role="status">
            Votre demande de r&eacute;tractation a bien &eacute;t&eacute; enregistr&eacute;e.
          </p>
          <p className="mt-2 text-text-secondary">
            Un email de confirmation sera envoy&eacute; &agrave; votre adresse. Si vous ne recevez
            rien sous 48h, contactez-nous directement &agrave;{" "}
            <a
              href="mailto:contact@deviens-marrant.fr"
              className="text-accent-primary underline"
            >
              contact@deviens-marrant.fr
            </a>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-text-primary">
          Adresse email du compte *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className="w-full rounded-lg border border-border bg-background-card px-4 py-2 text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
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
          className="w-full rounded-lg border border-border bg-background-card px-4 py-2 text-text-primary focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
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
          placeholder="Dites-nous pourquoi vous souhaitez vous rétracter (facultatif)"
          className="w-full rounded-lg border border-border bg-background-card px-4 py-2 text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
        />
      </div>

      <Button type="submit" variant="primary" size="lg">
        Envoyer ma demande
      </Button>
    </form>
  );
}
