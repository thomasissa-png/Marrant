"use client";

import { useEffect, useRef, useState } from "react";
import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import { TYPES_QUESTION, type FilListe, type TypeQuestion } from "@/lib/espace/questions-types";
import { BOUTON_SECONDAIRE, CADRE_CARTE_NEUTRE, nouvelleCle } from "@/components/espace/carte/styles";
import { buttonVariants } from "@/components/ui/button";
import { META, META_FORT, TEXTE_FORT, TITRE_CARTE } from "@/components/espace/typo";
import { cn } from "@/lib/utils";
import { envoyerMessage, erreurLocale, MessageErreur, type Erreur } from "@/components/espace/questions/appel";
import { prendrePrefill } from "@/components/espace/questions/prefill";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const Q = frEspaceProfond(TEXTES_QUESTIONS);

/**
 * « Écrire à l'équipe » (maquette `mes-questions.html`, carte de gauche) : le type en un geste (« Une
 * question » choisie par défaut, comme la maquette), le message, « Envoyer à l'équipe ». Envoi en cours :
 * bouton désactivé, « Envoi en cours » ; échec : le texte RESTE dans le champ, l'erreur validée s'affiche
 * sous le champ (`aria-describedby`) ; succès : « Envoyé, l'équipe répond… » annoncé (`role="status"`).
 * Une clé par envoi : un double clic ne crée qu'un fil. Préremplissage : `prefill.ts` (navigateur seul).
 * s26 (design `questions-repliques-lettre-profil-s26.md` §2) : cadre neutre, échelle `typo.ts`, type choisi en filet
 * blanc (plus de violet) ; le bouton d'envoi est le seul aplat (`principal`) quand aucune réponse non lue n'est en
 * tête, sinon un contour. Rendu interrupteur ouvert seulement (Mes questions est en 404 fermé).
 */
export function FormulaireQuestion({ onEnvoye, principal = true }: { onEnvoye: (fil: FilListe) => void; principal?: boolean }) {
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
    // v6 tour 2 (point 7) : le titre hors de la carte, comme « Mes envois » à côté : les deux colonnes partent du
    // même niveau (titre, puis carte).
    <section className="min-w-0" aria-labelledby="h-ecrire" data-formulaire-question>
      <h2 id="h-ecrire" className={cn("mb-4", TITRE_CARTE)}>
        {Q.ecrire.titre}
      </h2>
      <form
        className={cn(CADRE_CARTE_NEUTRE, "flex min-w-0 flex-col gap-4 p-6 max-e300:p-4 [&_*]:[overflow-wrap:break-word]")}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void envoyer();
        }}
      >
        <fieldset className="grid min-w-0 gap-2">
          <legend className={cn("mb-2", META_FORT)}>{Q.ecrire.legende}</legend>
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
              <span className="block min-h-11 rounded-xl border border-border-input px-4 py-3 peer-checked:border-text-primary peer-checked:bg-background-elevated peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-link max-e300:px-3">
                <span className={cn("flex items-center gap-2", TEXTE_FORT)}>
                  <span aria-hidden="true" className={cn("flex h-4 w-4 flex-none items-center justify-center rounded-full border", type === t ? "border-text-primary" : "border-border-input")}>
                    {type === t && <span className="h-2 w-2 rounded-full bg-text-primary" />}
                  </span>
                  {Q.types[t].nom}
                </span>
                <span className={cn("mt-2 block", META)}>{Q.types[t].description}</span>
              </span>
            </label>
          ))}
        </fieldset>
        <div className="min-w-0">
          <label htmlFor="q-message" className={cn("block", META_FORT)}>
            {Q.ecrire.champ}
          </label>
          <textarea
            id="q-message"
            ref={champ}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-describedby={decrit}
            aria-invalid={erreur ? true : undefined}
            className="mt-2 block min-h-32 w-full min-w-0 resize-y rounded-xl border border-border-input bg-background-elevated p-4 text-base text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link"
          />
          <p id="q-aide" className={cn("mt-2", META)}>
            {Q.ecrire.aide}
          </p>
          <div className="mt-2">
            <MessageErreur id="q-erreur" erreur={erreur} />
          </div>
        </div>
        <p id="q-delai" className={META}>
          {Q.ecrire.delai}
        </p>
        <div>
          <button
            type="submit"
            className={principal ? cn(buttonVariants({ size: "lg" }), "w-full whitespace-normal") : cn(BOUTON_SECONDAIRE, "w-full")}
            disabled={occupe}
            aria-disabled={occupe || undefined}
          >
            {occupe ? Q.ecrire.envoiEnCours : Q.ecrire.bouton}
          </button>
        </div>
        <p role="status" className={META}>
          {statut}
        </p>
      </form>
    </section>
  );
}
