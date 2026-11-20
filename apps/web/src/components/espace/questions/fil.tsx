"use client";

import { useEffect, useRef, useState } from "react";
import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import type { FilListe } from "@/lib/espace/questions-types";
import { appelEspace } from "@/components/espace/carte/appel";
import { BOUTON_SECONDAIRE, CADRE_CARTE_NEUTRE, SOMMAIRE_REPLIABLE, nouvelleCle } from "@/components/espace/carte/styles";
import { META, META_FORT, TEXTE } from "@/components/espace/typo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { TEXTES_CLOCHE } from "@/config/textes/espace-cloche";
import { LIEN_CARTE_ACCUEIL } from "@/components/home/da-site";
import { Bandeau, PastillesDa } from "@/components/espace/da-espace";
import { hrefFil } from "@/components/espace/questions/reponse-non-lue";
import { ChevronRepli } from "@/components/espace/carte/chevron-repli";
import { dateCourte, envoyerMessage, erreurLocale, MessageErreur, type Erreur } from "@/components/espace/questions/appel";
import { ConfirmerRetrait } from "@/components/espace/questions/confirmer-retrait";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const Q = frEspaceProfond(TEXTES_QUESTIONS);
const C = frEspaceProfond(TEXTES_CLOCHE);

// s26 (design `questions-repliques-lettre-profil-s26.md` §2 et §3) : échelle `typo.ts`, plus de `text-xs`, de pastille
// ni de citation à bord violet (un seul aplat violet par écran). Rendu interrupteur ouvert seulement.
const CITATION = cn("whitespace-pre-line", TEXTE);
const LABEL = META_FORT;

/**
 * Un envoi de « Mes envois » (maquette `mes-questions.html`) : type et date ; en attente, le message cité et
 * « Envoyé, l'équipe répond… » ou, après 3 jours ouvrés, « L'équipe n'a pas encore répondu, ta demande est
 * bien là » ; répondu, un `details` « Répondu le {date} » qui ouvre le fil (ouvrir le fil rend ses réponses
 * lues : pastille de la cloche, 2.9) et « Continuer » sous la réponse ; « Retirer de mon historique » à
 * chaque envoi, après confirmation (`confirmer-retrait.tsx`, décision du 13/11 : effacement définitif).
 * Lecture seule (après la résiliation) : ni « Continuer », le retrait reste possible.
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

  const retirer = async (): Promise<boolean> => {
    if (occupe) return false;
    setOccupe(true);
    const ok = await appelEspace<{ ok: true }>(`/api/espace/questions/${fil.id}`, "DELETE");
    setOccupe(false);
    if (!ok) setStatut(Q.erreurs.envoi.avant + Q.erreurs.envoi.lien + Q.erreurs.envoi.apres);
    return Boolean(ok);
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
    <li
      className={cn(CADRE_CARTE_NEUTRE, "min-w-0 space-y-2 p-6 transition-colors hover:border-border-hover max-e300:p-4 [overflow-wrap:anywhere]")}
      data-fil={fil.id}
      data-statut={fil.statut}
      data-retard={fil.enRetard || undefined}
    >
      {/* s26 DA, aujourd'hui questions répliques : bandeau de l'accueil, type en pastille violette, date à côté. */}
      <Bandeau />
      <PastillesDa pastille={Q.types[fil.type].nom} suite={<span className={META}>{Q.envois.envoyeLe(dateCourte(fil.creeLe))}</span>} className="gap-x-4" />
      {/* s26 DA, aujourd'hui questions répliques (T7 de `docs/ux/audit-trajets-connectes-s26.md`) : dans la liste, un fil
          qui a une réponse garde son lien vers la page du fil, lu ou non (avant, le seul lien était la tuile « réponse
          non lue », qui disparaît à la lecture). Libellé validé de la cloche, qui mène au même fil. Pas sur la page du
          fil elle-même (`ouvertAuDepart`). */}
      {derniereReponse && !ouvertAuDepart && (
        <Link href={hrefFil(fil.id)} className={cn(LIEN_CARTE_ACCUEIL, "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary")} data-lien-fil={fil.id}>
          {C.groupes.reponses}
          <span aria-hidden="true">&nbsp;→</span>
        </Link>
      )}
      {derniereReponse ? (
        <details
          open={ouvertAuDepart || undefined}
          onToggle={(e) => {
            if ((e.currentTarget as HTMLDetailsElement).open) void ouvrir();
          }}
          className="group/repli"
        >
          {/* v6 tour 1 (point 5) : la réponse de l'équipe s'ouvre par un vrai contrôle (bouton secondaire à chevron, 44 px). */}
          <summary className={SOMMAIRE_REPLIABLE}>
            {Q.envois.reponduLe(dateCourte(derniereReponse.creeLe))}
            <ChevronRepli />
          </summary>
          <div className="mt-4 space-y-4 border-t border-border pt-4">
            {fil.messages.map((m, i) => (
              <div key={`${m.creeLe}-${i}`}>
                <p className={LABEL}>{m.auteur === "EQUIPE" ? Q.envois.reponseLe(dateCourte(m.creeLe)) : Q.envois.tonMessage}</p>
                <p className={cn("mt-2", CITATION)}>{m.corps}</p>
                {m.auteur === "EQUIPE" && <p className={cn("mt-2", META)}>{Q.envois.signature}</p>}
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
                <label htmlFor={ids.champ} className={cn("block", META_FORT)}>
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
                  className="block min-h-32 w-full min-w-0 resize-y rounded-xl border border-border-input bg-background-elevated p-4 text-base text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link"
                />
                <MessageErreur id={ids.erreur} erreur={erreur} />
                <button type="submit" className={`${BOUTON_SECONDAIRE} max-e300:w-full`} disabled={occupe}>
                  {occupe ? Q.ecrire.envoiEnCours : Q.ecrire.bouton}
                </button>
              </form>
            )}
          </div>
        </details>
      ) : (
        <p className={CITATION}>{fil.messages[0]?.corps}</p>
      )}
      {ligneStatut && <p className={META}>{ligneStatut}</p>}
      <div className="pt-2">
        <ConfirmerRetrait desactive={occupe} onConfirmer={retirer} onRetire={() => onRetire(fil.id)} />
      </div>
      <p role="status" className={META}>
        {statut}
      </p>
    </li>
  );
}
