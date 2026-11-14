"use client";

import Link from "next/link";
import type { ContenuCloche, GenreNouveaute } from "@/lib/espace/cloche-types";
import { TEXTES_CLOCHE } from "@/config/textes/espace-cloche";
import { TEXTES_ESPACE_NAVIGATION } from "@/config/textes/espace-navigation";
import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import { dateCourte } from "@/components/espace/questions/appel";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const C = frEspaceProfond(TEXTES_CLOCHE);
const T = frEspaceProfond(TEXTES_ESPACE_NAVIGATION);
const Q = frEspaceProfond(TEXTES_QUESTIONS);

/**
 * Lignes du panneau de la cloche (lot D8 ; maquette `aujourdhui.html`, classes `.sh-g`, `.nrow`) : titre de
 * groupe en 14/20 secondaire ; chaque notification est un lien d'au moins 44 px de haut, survol `elevated`,
 * focus visible ; une réponse dit le type du fil et « Répondu le {date} » (aucun doublon du titre de
 * groupe) ; aucune pastille de ligne. Rien de chargé : rien n'est écrit ; chargé et vide : « Rien de
 * nouveau. Reviens quand tu veux. » ; lecture échouée sans rien de lu : « On n'a pas pu afficher tes
 * notifications. Repasse dans un moment. ». Toucher une ligne ferme le panneau (`onChoisir`).
 */
const LIGNE =
  "flex min-h-11 flex-col justify-center rounded-md px-3 py-2 text-sm text-text-primary hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link";
const LIBELLE: Record<GenreNouveaute, string> = { carnet: C.lignes.carnet, situations: C.lignes.situations, bibliotheque: C.lignes.bibliotheque };

function Groupe({ titre, cle, children }: { titre: string; cle: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`cloche-${cle}`} className="mt-4 first:mt-0" data-groupe-cloche={cle}>
      <h3 id={`cloche-${cle}`} className="text-sm text-text-secondary">
        {titre}
      </h3>
      <ul>{children}</ul>
    </section>
  );
}

export function LignesCloche({ contenu, erreur = false, onChoisir }: { contenu: ContenuCloche | null; erreur?: boolean; onChoisir: () => void }) {
  if (!contenu) return erreur ? <p className="py-3 text-sm text-text-secondary" data-cloche-erreur>{C.erreur}</p> : null;
  const { reponses, nouveautes, lettre } = contenu;
  if (reponses.length + nouveautes.length === 0 && !lettre) return <p className="py-3 text-sm text-text-secondary">{T.cloche.vide}</p>;
  return (
    <div data-lignes-cloche>
      {reponses.length > 0 && (
        <Groupe titre={C.groupes.reponses} cle="reponses">
          {reponses.map((r) => (
            <li key={r.id} className="mt-1">
              <Link href={r.href} className={LIGNE} onClick={onChoisir} data-ligne-cloche="reponse">
                {Q.types[r.type].nom}
                <small className="text-xs text-text-muted">{Q.envois.reponduLe(dateCourte(r.reponduLe))}</small>
              </Link>
            </li>
          ))}
        </Groupe>
      )}
      {nouveautes.length > 0 && (
        <Groupe titre={C.groupes.nouveautes} cle="nouveautes">
          {nouveautes.map((n) => (
            <li key={n.genre} className="mt-1">
              <Link href={n.href} className={LIGNE} onClick={onChoisir} data-ligne-cloche={n.genre}>
                {LIBELLE[n.genre]}
              </Link>
            </li>
          ))}
        </Groupe>
      )}
      {lettre && (
        <Groupe titre={C.groupes.lettre} cle="lettre">
          <li className="mt-1">
            <Link href={lettre.href} className={LIGNE} onClick={onChoisir} data-ligne-cloche="lettre">
              {lettre.titre}
            </Link>
          </li>
        </Groupe>
      )}
    </div>
  );
}
