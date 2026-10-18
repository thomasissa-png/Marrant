"use client";

import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { useSession } from "next-auth/react";
import { LETTRE_INSCRIPTIONS_OUVERTES, type LettreEmplacement } from "@/config/lettre";
import { drapeauLettreActif, useLettreVu } from "@/hooks/use-lettre-inscription";
import { isPremiumPlan } from "@/lib/parcours-access";
import { frPonctuation } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { LIGNE_REPLIEE_CLASSES } from "@/components/lettre/lettre-repliee-style";
import type { LettreInscription as LettreInscriptionType } from "@/components/lettre/lettre-inscription";

type Formulaire = ComponentType<Parameters<typeof LettreInscriptionType>[0]>;

/** Import à la demande : morceau de JS séparé, hors du First Load de la page. */
const importerFormulaire = (): Promise<Formulaire> =>
  import("@/components/lettre/lettre-inscription").then((m) => m.LettreInscription);

interface LettreReplieeProps {
  emplacement: LettreEmplacement;
  slug?: string;
  /** Texte de la ligne discrète (ex. `FIN_ETAPE_1.lettre.ligne`). */
  ligne: string;
  className?: string;
}

/**
 * Lettre repliée, chargée au dépliage (QA v4 m-7, budget JS de `/parcours/[slug]`) : seule la
 * ligne est rendue au chargement (mêmes balises et classes que `LettreInscription` repliée).
 * Au clic, le formulaire est importé à la demande puis remplace la ligne, déjà déplié, le champ
 * prend le focus. Ligne identique avant et après : aucun saut de mise en page, le plein au-dessus
 * ne bouge pas. `lettre-vu` est mesuré ici (une fois). Inscription en attente dans ce navigateur :
 * le formulaire est chargé tout de suite pour afficher le rappel, comme avant.
 */
export function LettreRepliee({ emplacement, slug, ligne, className }: LettreReplieeProps) {
  const { data: session, status } = useSession();
  const isPremium = status === "authenticated" && isPremiumPlan((session?.user as { plan?: string } | undefined)?.plan);
  const actif = LETTRE_INSCRIPTIONS_OUVERTES && !isPremium;
  const sectionRef = useRef<HTMLElement>(null);
  const mesure = useMemo(() => ({ emplacement, ...(slug ? { slug } : {}) }), [emplacement, slug]);
  const [Composant, setComposant] = useState<Formulaire | null>(null);
  const [ouvert, setOuvert] = useState(false);
  const [chargement, setChargement] = useState(false);

  useLettreVu(sectionRef, actif && !Composant, mesure);

  // Inscription en attente dans ce navigateur : formulaire chargé tout de suite (rappel « renvoyer »).
  useEffect(() => {
    if (!actif || !drapeauLettreActif()) return;
    let annule = false;
    importerFormulaire()
      .then((F) => {
        if (!annule) setComposant(() => F);
      })
      .catch(() => {});
    return () => {
      annule = true;
    };
  }, [actif]);

  const deplier = () => {
    if (chargement) return;
    setChargement(true);
    importerFormulaire()
      .then((F) => {
        setOuvert(true);
        setComposant(() => F);
      })
      .catch(() => setChargement(false));
  };

  if (!actif) return null;
  if (Composant) {
    return (
      <Composant
        emplacement={emplacement}
        slug={slug}
        repliee={ligne}
        ouverteAuDepart={ouvert}
        sansMesureVu
        className={className}
      />
    );
  }

  const id = `lettre-${emplacement}`;
  return (
    <section ref={sectionRef} aria-labelledby={`${id}-titre`} data-lettre={emplacement} className={cn("relative", className)}>
      <p className="text-sm text-text-muted">
        <button
          type="button"
          id={`${id}-titre`}
          aria-expanded={false}
          aria-controls={`${id}-formulaire`}
          aria-busy={chargement || undefined}
          onClick={deplier}
          className={LIGNE_REPLIEE_CLASSES}
        >
          {frPonctuation(ligne)}
        </button>
      </p>
    </section>
  );
}
