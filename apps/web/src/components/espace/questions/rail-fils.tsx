"use client";

import Link from "next/link";
import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import type { FilListe } from "@/lib/espace/questions-types";
import { dateCourte } from "@/components/espace/questions/appel";
import { hrefFil } from "@/components/espace/questions/reponse-non-lue";
import { ColonneCollante } from "@/components/espace/liste-detail/colonne-collante";
import { LIGNE_ACTIVE, LIGNE_LISTE } from "@/components/espace/liste-detail/styles";
import { Bandeau } from "@/components/espace/da-espace";
import { META, TEXTE, TEXTE_FORT, TITRE_CARTE } from "@/components/espace/typo";
import { frEspaceProfond } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";

const Q = frEspaceProfond(TEXTES_QUESTIONS);

/** Statut d'un fil en une ligne, avec les phrases datées existantes (« Répondu le … », « Envoyé le … »). */
function statut(f: FilListe): string {
  const reponse = f.messages.filter((m) => m.auteur === "EQUIPE").at(-1);
  return reponse ? Q.envois.reponduLe(dateCourte(reponse.creeLe)) : Q.envois.envoyeLe(dateCourte(f.creeLe));
}

/**
 * Liste des fils à côté du fil ouvert (s26 ; `docs/ux/questions-repliques-lettre-profil-s26.md` §1.2).
 * s26 DA, aujourd'hui questions répliques : modèle liste + détail de Quoi répondre (`components/espace/liste-detail`) :
 * dès 1024, la liste à GAUCHE (320 px, 360 dès 1280), collante sous l'en-tête, défilement propre, position gardée au
 * retour, ligne du fil ouvert au fond élevé et au filet violet (`LIGNE_ACTIVE`), flèches haut et bas ; bandeau violet de
 * l'accueil sur la carte. Sous 1024, la page du fil n'affiche pas la liste (une colonne : liste OU fil, le lien de
 * retour mène à la liste complète). Les fils de l'abonné (type et statut, jamais le texte). Aucun aplat.
 */
export function RailFils({ fils, courant, className }: { fils: readonly FilListe[]; courant: string; className?: string }) {
  return (
    <ColonneCollante
      cle="questions-fils"
      label={Q.envois.titre}
      actif={courant}
      className={cn("min-w-0", className)}
      entete={
        <div className="px-6 pb-4 pt-6">
          <Bandeau />
          <p className={TITRE_CARTE}>{Q.envois.titre}</p>
        </div>
      }
      data-rail-fils=""
    >
      <ul className="border-t border-border py-2">
        {fils.map((f) => {
          const actif = f.id === courant;
          return (
            <li key={f.id} className="min-w-0">
              <Link
                href={hrefFil(f.id)}
                aria-current={actif ? "page" : undefined}
                className={cn(LIGNE_LISTE, actif && LIGNE_ACTIVE)}
                data-ligne={f.id}
                data-rail-fil={f.id}
              >
                <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
                  <span className={cn("block", actif ? cn(TEXTE_FORT, "text-accent-link") : TEXTE)}>{Q.types[f.type].nom}</span>
                  <span className={cn("block", META)}>{statut(f)}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </ColonneCollante>
  );
}
