"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CONTACT_EMAIL, TEXTES_RETRACTATION_FORM as T } from "@/config/textes/paiement";
import { RetractationRecap } from "@/components/retractation/retractation-recap";

/**
 * Fonction de rétractation (14 jours). s16 : la demande part vraiment
 * (POST /api/retractation : enregistrement, e-mail à l'admin, accusé de
 * réception au client). Le message de succès n'apparaît qu'après la réponse
 * du serveur, jamais avant.
 * s23 (audit rétractation, D.221-5) : deux étapes. Étape 1 « Renoncer au contrat
 * ici » (saisie, rien n'est envoyé) ; étape 2 récapitulatif + « Confirmer la
 * rétractation », seul clic qui appelle l'API (`confirme: true`). Nom et
 * prénom obligatoires, pré-remplis avec l'e-mail si le visiteur est connecté ;
 * date d'achat facultative.
 */
type Etape =
  | { etat: "saisie" }
  | { etat: "recap"; envoi: boolean; erreur: string | null }
  | { etat: "envoye"; ackSent: boolean };

const INPUT_CLASS =
  "w-full rounded-lg border border-border bg-background-card px-4 py-2 text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary";
const LABEL_CLASS = "mb-1 block text-sm font-medium text-text-primary";

function LienContact() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-link underline">
      {CONTACT_EMAIL}
    </a>
  );
}

export function RetractationForm() {
  const { data: session } = useSession();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [dateAchat, setDateAchat] = useState("");
  const [motif, setMotif] = useState("");
  const [etape, setEtape] = useState<Etape>({ etat: "saisie" });

  // Compte connecté : nom et e-mail pré-remplis, sans écraser une saisie déjà commencée.
  const nomCompte = session?.user?.name ?? "";
  const emailCompte = session?.user?.email ?? "";
  useEffect(() => {
    if (nomCompte) setNom((n) => n || nomCompte);
    if (emailCompte) setEmail((e) => e || emailCompte);
  }, [nomCompte, emailCompte]);

  const versRecap = (e: React.FormEvent) => {
    e.preventDefault();
    setEtape({ etat: "recap", envoi: false, erreur: null });
  };

  const confirmer = async () => {
    setEtape({ etat: "recap", envoi: true, erreur: null });
    try {
      const res = await fetch("/api/retractation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirme: true, nom, email, dateAchat, motif }),
      });
      const data = (await res.json().catch(() => ({}))) as { ackSent?: boolean; error?: string };
      if (res.ok) {
        setEtape({ etat: "envoye", ackSent: data.ackSent !== false });
        return;
      }
      const message =
        res.status === 400 ? T.erreurValidation : res.status === 429 ? T.erreurTropDeDemandes : T.erreurServeur;
      setEtape({ etat: "recap", envoi: false, erreur: message });
    } catch {
      setEtape({ etat: "recap", envoi: false, erreur: T.erreurServeur });
    }
  };

  if (etape.etat === "envoye") {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-lg font-medium text-text-primary" role="status">
            {T.succesTitre}
          </p>
          <p className="mt-2 text-text-secondary">
            {etape.ackSent ? T.succesTexte : T.succesSansEmail} <LienContact />
          </p>
        </CardContent>
      </Card>
    );
  }

  if (etape.etat === "recap") {
    return (
      <RetractationRecap
        declaration={{ nom, email, dateAchat, motif }}
        envoi={etape.envoi}
        erreur={etape.erreur}
        lienContact={<LienContact />}
        onConfirmer={confirmer}
        onModifier={() => setEtape({ etat: "saisie" })}
      />
    );
  }

  return (
    <form onSubmit={versRecap} className="space-y-4">
      <div>
        <label htmlFor="nom" className={LABEL_CLASS}>{T.labelNom}</label>
        <input type="text" id="nom" name="nom" required maxLength={120} autoComplete="name" value={nom} onChange={(e) => setNom(e.target.value)} placeholder={T.placeholderNom} className={INPUT_CLASS} />
      </div>

      <div>
        <label htmlFor="email" className={LABEL_CLASS}>{T.labelEmail}</label>
        <input type="email" id="email" name="email" required maxLength={254} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={T.placeholderEmail} className={INPUT_CLASS} />
      </div>

      <div>
        <label htmlFor="date-achat" className={LABEL_CLASS}>{T.labelDateAchat}</label>
        <input type="date" id="date-achat" name="date-achat" value={dateAchat} onChange={(e) => setDateAchat(e.target.value)} className={INPUT_CLASS} />
      </div>

      <div>
        <label htmlFor="motif" className={LABEL_CLASS}>{T.labelMotif}</label>
        <textarea id="motif" name="motif" value={motif} onChange={(e) => setMotif(e.target.value)} rows={3} maxLength={2000} placeholder={T.placeholderMotif} className={INPUT_CLASS} />
      </div>

      <Button type="submit" variant="primary" size="lg">
        {T.bouton}
      </Button>
    </form>
  );
}
