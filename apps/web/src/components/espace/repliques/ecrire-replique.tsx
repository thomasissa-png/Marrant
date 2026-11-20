"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TEXTES_REPLIQUES } from "@/config/textes/espace-repliques";
import { TEXTES_GESTE } from "@/config/textes/espace-cartes";
import { TEXTES_ESPACE_NAVIGATION } from "@/config/textes/espace-navigation";
import type { FicheDeReplique, RepliqueListee } from "@/lib/espace/repliques";
import { REPLIQUE_MAX_CLIENT } from "@/components/espace/carte/limites";
import { appelEspace } from "@/components/espace/carte/appel";
import { BOUTON_PRINCIPAL, BOUTON_SECONDAIRE, CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
import { Bandeau, PastillesDa } from "@/components/espace/da-espace";
import { META, TITRE_CARTE } from "@/components/espace/typo";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { EMOJIS_RUBRIQUES } from "@/components/espace/emojis";

const R = frEspaceProfond(TEXTES_REPLIQUES);
const G = frEspaceProfond(TEXTES_GESTE);
const N = frEspaceProfond(TEXTES_ESPACE_NAVIGATION);

/** Identifiant du champ d'écriture (cible de `aria-controls` des boutons qui l'ouvrent). */
export const ID_ECRIRE_REPLIQUE = "ecrire-replique";

/**
 * s26 DA, aujourd'hui questions répliques (T8 de `docs/ux/audit-trajets-connectes-s26.md` : « Écrire ma prochaine
 * réplique » ouvrait la LISTE de Quoi répondre, 2 clics puis un défilement, champ à y 920 sur 900) : le champ d'écriture
 * s'ouvre SUR la page, focalisé, en 1 clic. Il porte la première fiche de Quoi répondre sans réplique de l'abonné
 * (`fichesSansReplique`), son titre en lien vers la fiche, puis le champ et les boutons du geste (textes existants :
 * « Ma réplique à moi », « Enregistrer », « Annuler », compteur). Même appel que la fiche (`PUT /api/espace/replique`).
 * `nu` : sans cadre (dans la tuile de l'état vide, qui a déjà le sien).
 */
export function EcrireReplique({
  fiche,
  onEnregistree,
  onAnnuler,
  nu = false,
  className,
}: {
  fiche: FicheDeReplique;
  onEnregistree: (r: RepliqueListee) => void;
  onAnnuler: () => void;
  nu?: boolean;
  className?: string;
}) {
  const [texte, setTexte] = useState("");
  const [occupe, setOccupe] = useState(false);
  const [echec, setEchec] = useState(false);
  const champ = useRef<HTMLTextAreaElement>(null);

  // Focus à l'ouverture (le navigateur amène le champ dans l'écran s'il n'y est pas).
  useEffect(() => {
    champ.current?.focus();
  }, [fiche.ficheId]);

  const enregistrer = async () => {
    const propre = texte.trim();
    if (occupe || propre === "") return;
    setOccupe(true);
    setEchec(false);
    const ok = await appelEspace<{ ok: true }>("/api/espace/replique", "PUT", { ficheId: fiche.ficheId, texte: propre });
    setOccupe(false);
    if (!ok) {
      setEchec(true);
      return;
    }
    setTexte("");
    onEnregistree({ ficheId: fiche.ficheId, texte: propre, titre: fiche.titre, href: fiche.href, modifieLe: new Date().toISOString() });
  };

  const ids = { champ: `${ID_ECRIRE_REPLIQUE}-champ`, compteur: `${ID_ECRIRE_REPLIQUE}-compteur`, echec: `${ID_ECRIRE_REPLIQUE}-echec` };
  return (
    <form
      id={ID_ECRIRE_REPLIQUE}
      className={cn(!nu && cn(CADRE_CARTE_NEUTRE, "p-6"), "min-w-0 space-y-2 [overflow-wrap:anywhere]", className)}
      onSubmit={(e) => {
        e.preventDefault();
        void enregistrer();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onAnnuler();
      }}
      data-ecrire-replique={fiche.ficheId}
    >
      {!nu && <Bandeau />}
      <PastillesDa emoji={EMOJIS_RUBRIQUES.quoiRepondre} pastille={N.index.quoiRepondre} />
      {fiche.href ? (
        <Link href={fiche.href} className={cn("block pt-2", TITRE_CARTE, "hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary")}>
          {frEspace(fiche.titre)}
        </Link>
      ) : (
        <p className={cn("pt-2", TITRE_CARTE)}>{frEspace(fiche.titre)}</p>
      )}
      <label htmlFor={ids.champ} className="block pt-2 text-sm font-semibold text-text-primary">
        {R.label}
      </label>
      <textarea
        id={ids.champ}
        ref={champ}
        rows={3}
        value={texte}
        maxLength={REPLIQUE_MAX_CLIENT}
        onChange={(e) => setTexte(e.target.value)}
        aria-describedby={cn(ids.compteur, echec && ids.echec)}
        className="block w-full min-w-0 rounded-xl border border-border-input bg-background-elevated p-4 text-base text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        data-champ-replique=""
      />
      <div className="flex flex-wrap items-center gap-2">
        <button type="submit" className={BOUTON_PRINCIPAL} aria-busy={occupe} disabled={texte.trim() === ""}>
          {R.enregistrer}
        </button>
        <button type="button" className={BOUTON_SECONDAIRE} onClick={onAnnuler}>
          {R.annuler}
        </button>
        <span id={ids.compteur} className={META}>
          {G.note.compteur(texte.length, REPLIQUE_MAX_CLIENT)}
        </span>
      </div>
      {echec && (
        <p id={ids.echec} role="alert" className="text-sm text-error-text">
          {R.echec}
        </p>
      )}
    </form>
  );
}
