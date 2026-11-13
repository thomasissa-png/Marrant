"use client";

import { useEffect, useRef, useState } from "react";
import { TEXTES_QUESTIONS as Q } from "@/config/textes/espace-questions";
import type { FilListe } from "@/lib/espace/questions-types";
import { appelEspace } from "@/components/espace/carte/appel";
import { BOUTON_PRINCIPAL, BOUTON_SECONDAIRE, CARTE, nouvelleCle } from "@/components/espace/carte/styles";
import { dateCourte, envoyerMessage, erreurLocale, MessageErreur, type Erreur } from "@/components/espace/questions/appel";

const TAG = "inline-block rounded-full border border-border-input px-2 py-0.5 text-xs font-semibold text-text-secondary";
const CITATION = "whitespace-pre-line border-l-2 border-accent-primary px-4 py-2 text-base text-text-primary max-e300:px-3";
const LABEL = "text-xs font-semibold text-text-muted";

/**
 * Un envoi de « Mes envois » (maquette `mes-questions.html`) : type et date ; en attente, le message cité et
 * « Envoyé, l'équipe répond… » ou, après 3 jours ouvrés, « L'équipe n'a pas encore répondu, ta demande est
 * bien là » ; répondu, un `details` « Répondu le {date} » qui ouvre le fil (ouvrir le fil rend ses réponses
 * lues : pastille de la cloche, 2.9) et « Continuer » sous la réponse ; « Retirer de mon historique » à
 * chaque envoi. Lecture seule (après la résiliation) : ni « Continuer », le retrait reste possible.
 */
export function FilEnvoi({
  fil,
  lectureSeule,
  ouvertAuDepart = false,
  onMaj,
  onRetire,
}: {
  fil: FilListe;
  lectureSeule: boolean;
  ouvertAuDepart?: boolean;
  onMaj: (fil: FilListe) => void;
  onRetire: (id: string) => void;
}) {
  const [suite, setSuite] = useState(false);
  const [texte, setTexte] = useState("");
  const [occupe, setOccupe] = useState(false);
  const [erreur, setErreur] = useState<Erreur>(null);
  const [statut, setStatut] = useState("");
  const cle = useRef("");
  const lu = useRef(!fil.nonLu);
  const champ = useRef<HTMLTextAreaElement>(null);
  const reponses = fil.messages.filter((m) => m.auteur === "EQUIPE");
  const derniereReponse = reponses.at(-1);
  const ids = { champ: `suite-${fil.id}`, erreur: `suite-erreur-${fil.id}` };

  const ouvrir = async () => {
    if (lu.current) return;
    lu.current = true;
    if (await appelEspace(`/api/espace/questions/${fil.id}/ouvert`, "POST")) onMaj({ ...fil, nonLu: false });
    else lu.current = false;
  };

  const retirer = async () => {
    if (occupe) return;
    setOccupe(true);
    const ok = await appelEspace<{ ok: true }>(`/api/espace/questions/${fil.id}`, "DELETE");
    setOccupe(false);
    if (ok) onRetire(fil.id);
    else setStatut(Q.erreurs.envoi.avant + Q.erreurs.envoi.lien + Q.erreurs.envoi.apres);
  };

  const continuer = async () => {
    if (occupe) return;
    const locale = erreurLocale(texte);
    if (locale) {
      setErreur(locale);
      champ.current?.focus();
      return;
    }
    if (!cle.current) cle.current = nouvelleCle();
    setOccupe(true);
    setErreur(null);
    const r = await envoyerMessage(`/api/espace/questions/${fil.id}/messages`, { message: texte, cle: cle.current });
    setOccupe(false);
    if ("erreur" in r) {
      setErreur(r.erreur);
      return;
    }
    cle.current = "";
    setTexte("");
    setSuite(false);
    setStatut(Q.ecrire.envoye);
    onMaj(r.fil);
  };

  useEffect(() => {
    if (ouvertAuDepart && derniereReponse) void ouvrir();
    // Une seule fois, à l'arrivée par l'adresse du fil (lien de la cloche, lot D8).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ligneStatut = fil.statut === "EN_ATTENTE" ? (fil.enRetard ? Q.envois.enRetard : Q.envois.enAttente) : null;

  return (
    <li className={`${CARTE} !space-y-2 max-e300:p-3`} data-fil={fil.id} data-statut={fil.statut} data-retard={fil.enRetard || undefined}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className={TAG}>{Q.types[fil.type].nom}</span>
        <span className="text-xs text-text-muted">{Q.envois.envoyeLe(dateCourte(fil.creeLe))}</span>
      </div>
      {derniereReponse ? (
        <details
          open={ouvertAuDepart || undefined}
          onToggle={(e) => {
            if ((e.currentTarget as HTMLDetailsElement).open) void ouvrir();
          }}
          className="group"
        >
          <summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold text-accent-link group-open:text-text-primary">
            <span>{Q.envois.reponduLe(dateCourte(derniereReponse.creeLe))}</span>
          </summary>
          <div className="space-y-3 border-t border-border pt-3">
            {fil.messages.map((m, i) => (
              <div key={`${m.creeLe}-${i}`}>
                <p className={LABEL}>{m.auteur === "EQUIPE" ? Q.envois.reponseLe(dateCourte(m.creeLe)) : Q.envois.tonMessage}</p>
                <p className="whitespace-pre-line text-base text-text-primary">{m.corps}</p>
                {m.auteur === "EQUIPE" && <p className="text-sm text-text-secondary">{Q.envois.signature}</p>}
              </div>
            ))}
            {!lectureSeule && fil.statut === "REPONDU" && !suite && (
              <button type="button" className={`${BOUTON_SECONDAIRE} max-e300:w-full`} onClick={() => setSuite(true)}>
                {Q.envois.continuer}
              </button>
            )}
            {!lectureSeule && suite && (
              <form
                className="space-y-2"
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  void continuer();
                }}
              >
                <label htmlFor={ids.champ} className="block text-sm font-semibold text-text-primary">
                  {Q.ecrire.champ}
                </label>
                <textarea
                  id={ids.champ}
                  ref={champ}
                  autoFocus
                  value={texte}
                  onChange={(e) => setTexte(e.target.value)}
                  aria-describedby={erreur ? ids.erreur : undefined}
                  aria-invalid={erreur ? true : undefined}
                  className="block min-h-24 w-full min-w-0 resize-y rounded-lg border border-border-input bg-background-light px-3 py-2 text-base text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link"
                />
                <MessageErreur id={ids.erreur} erreur={erreur} />
                <button type="submit" className={`${BOUTON_PRINCIPAL} max-e300:w-full`} disabled={occupe}>
                  {occupe ? Q.ecrire.envoiEnCours : Q.ecrire.bouton}
                </button>
              </form>
            )}
          </div>
        </details>
      ) : (
        <p className={CITATION}>{fil.messages[0]?.corps}</p>
      )}
      {ligneStatut && <p className="text-sm text-text-secondary">{ligneStatut}</p>}
      <div className="pt-2">
        <button type="button" className={`${BOUTON_SECONDAIRE} max-e300:w-full`} onClick={() => void retirer()} disabled={occupe}>
          {Q.envois.retirer}
        </button>
      </div>
      <p role="status" className="text-sm text-text-secondary">
        {statut}
      </p>
    </li>
  );
}
