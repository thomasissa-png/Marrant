"use client";

import Link from "next/link";
import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import type { FilListe } from "@/lib/espace/questions-types";
import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
import { dateCourte } from "@/components/espace/questions/appel";
import { hrefFil } from "@/components/espace/questions/reponse-non-lue";
import { META, META_FORT, TEXTE, TEXTE_FORT } from "@/components/espace/typo";
import { frEspaceProfond } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";

const Q = frEspaceProfond(TEXTES_QUESTIONS);

/** Statut d'un fil en une ligne, avec les phrases datées existantes (« Répondu le … », « Envoyé le … »). */
function statut(f: FilListe): string {
  const reponse = f.messages.filter((m) => m.auteur === "EQUIPE").at(-1);
  return reponse ? Q.envois.reponduLe(dateCourte(reponse.creeLe)) : Q.envois.envoyeLe(dateCourte(f.creeLe));
}

/**
 * s26 (`docs/ux/questions-repliques-lettre-profil-s26.md` §1.2, design §3) : rail du fil ouvert, 4 colonnes dès 1024,
 * collant sous l'en-tête (`lg:top-36`, hauteur bornée et défilante comme le rail du Carnet). Les fils de l'abonné
 * (type et statut, jamais le texte), le fil courant en filet blanc : passer d'un fil à l'autre sans revenir à la liste.
 * Sous 1024, sous le fil. Aucun aplat.
 */
export function RailFils({ fils, courant, className }: { fils: readonly FilListe[]; courant: string; className?: string }) {
  return (
    <nav
      aria-label={Q.envois.titre}
      className={cn(CADRE_CARTE_NEUTRE, "min-w-0 p-6 lg:sticky lg:top-36 lg:max-h-[calc(100vh-10rem)] lg:self-start lg:overflow-y-auto", className)}
      data-rail-fils
    >
      <p className={META_FORT}>{Q.envois.titre}</p>
      <ul className="mt-4 flex flex-col gap-2">
        {fils.map((f) => {
          const actif = f.id === courant;
          return (
            <li key={f.id}>
              <Link
                href={hrefFil(f.id)}
                aria-current={actif ? "page" : undefined}
                className={cn(
                  "flex min-h-11 flex-col justify-center rounded-xl border-l-2 px-4 py-2 transition-colors hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
                  actif ? "border-text-primary bg-background-elevated" : "border-transparent",
                )}
                data-rail-fil={f.id}
              >
                <span className={actif ? TEXTE_FORT : TEXTE}>{Q.types[f.type].nom}</span>
                <span className={META}>{statut(f)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
