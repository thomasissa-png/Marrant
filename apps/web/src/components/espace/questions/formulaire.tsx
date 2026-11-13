"use client";

import { useEffect, useRef, useState } from "react";
import { TEXTES_QUESTIONS as Q } from "@/config/textes/espace-questions";
import { TYPES_QUESTION, type FilListe, type TypeQuestion } from "@/lib/espace/questions-types";
import { BOUTON_PRINCIPAL, CARTE, nouvelleCle } from "@/components/espace/carte/styles";
import { envoyerMessage, erreurLocale, MessageErreur, type Erreur } from "@/components/espace/questions/appel";
import { prendrePrefill } from "@/components/espace/questions/prefill";

/**
 * « Écrire à l'équipe » (maquette `mes-questions.html`, carte de gauche) : le type en un geste (« Une
 * question » choisie par défaut, comme la maquette), le message, « Envoyer à l'équipe ». Envoi en cours :
 * bouton désactivé, « Envoi en cours » ; échec : le texte RESTE dans le champ, l'erreur validée s'affiche
 * sous le champ (`aria-describedby`) ; succès : « Envoyé, l'équipe répond… » annoncé (`role="status"`).
 * Une clé par envoi : un double clic ne crée qu'un fil. Préremplissage : `prefill.ts` (navigateur seul).
 */
export function FormulaireQuestion({ onEnvoye }: { onEnvoye: (fil: FilListe) => void }) {
  const [type, setType] = useState<TypeQuestion>("QUESTION");
  const [message, setMessage] = useState("");
  const [occupe, setOccupe] = useState(false);
  const [erreur, setErreur] = useState<Erreur>(null);
  const [statut, setStatut] = useState("");
  const cle = useRef<string>("");
  const champ = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const p = prendrePrefill();
    if (p.type) setType(p.type);
    if (p.texte) setMessage(p.texte);
  }, []);

  const envoyer = async () => {
    if (occupe) return;
    const locale = erreurLocale(message);
    if (locale) {
      setErreur(locale);
      champ.current?.focus();
      return;
    }
    if (!cle.current) cle.current = nouvelleCle();
    setOccupe(true);
    setErreur(null);
    setStatut("");
    const r = await envoyerMessage("/api/espace/questions", { type, message, cle: cle.current });
    setOccupe(false);
    if ("erreur" in r) {
      setErreur(r.erreur);
      return;
    }
    cle.current = "";
    setMessage("");
    setStatut(Q.ecrire.envoye);
    onEnvoye(r.fil);
  };

  const decrit = ["q-aide", "q-delai", erreur ? "q-erreur" : ""].filter(Boolean).join(" ");

  return (
    <section className={`${CARTE} max-e300:p-3 [&_*]:[overflow-wrap:break-word]`} aria-labelledby="h-ecrire" data-formulaire-question>
      <h2 id="h-ecrire" className="font-display text-xl font-bold text-text-primary">
        {Q.ecrire.titre}
      </h2>
      <form
        className="flex flex-col gap-4"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void envoyer();
        }}
      >
        <fieldset className="grid min-w-0 gap-2">
          <legend className="mb-2 text-sm font-semibold text-text-primary">{Q.ecrire.legende}</legend>
          {TYPES_QUESTION.map((t) => (
            <label key={t} className="relative block">
              <input
                type="radio"
                name="type"
                value={t}
                checked={type === t}
                onChange={() => setType(t)}
                className="peer absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0"
              />
              <span className="block min-h-11 rounded-lg border border-border-input bg-background-light px-4 py-3 peer-checked:border-accent-link peer-checked:bg-background-elevated peer-checked:ring-1 peer-checked:ring-inset peer-checked:ring-accent-link peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-link max-e300:px-3 max-e300:py-2">
                <span className="flex items-center gap-2 font-semibold text-text-primary">
                  <span aria-hidden="true" className={`flex h-4 w-4 flex-none items-center justify-center rounded-full border-2 ${type === t ? "border-accent-link" : "border-border-input"}`}>
                    {type === t && <span className="h-1.5 w-1.5 rounded-full bg-accent-link" />}
                  </span>
                  {Q.types[t].nom}
                </span>
                <span className="mt-1 block text-sm text-text-secondary">{Q.types[t].description}</span>
              </span>
            </label>
          ))}
        </fieldset>
        <div className="min-w-0">
          <label htmlFor="q-message" className="block text-sm font-semibold text-text-primary">
            {Q.ecrire.champ}
          </label>
          <textarea
            id="q-message"
            ref={champ}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-describedby={decrit}
            aria-invalid={erreur ? true : undefined}
            className="mt-2 block min-h-32 w-full min-w-0 resize-y rounded-lg border border-border-input bg-background-light px-3 py-2 text-base text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link"
          />
          <p id="q-aide" className="mt-1 text-xs text-text-muted">
            {Q.ecrire.aide}
          </p>
          <div className="mt-2">
            <MessageErreur id="q-erreur" erreur={erreur} />
          </div>
        </div>
        <p id="q-delai" className="text-sm text-text-secondary">
          {Q.ecrire.delai}
        </p>
        <div>
          <button type="submit" className={`${BOUTON_PRINCIPAL} max-e300:w-full`} disabled={occupe} aria-disabled={occupe || undefined}>
            {occupe ? Q.ecrire.envoiEnCours : Q.ecrire.bouton}
          </button>
        </div>
        <p role="status" className="text-sm text-text-secondary">
          {statut}
        </p>
      </form>
    </section>
  );
}
