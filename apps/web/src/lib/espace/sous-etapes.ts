import { etapeDecoupee, type BlocReference } from "@/lib/espace/parcours-fiches";
import { QUIZ_TITRE, VANNES_ETAPE } from "@/config/textes/parcours";

export interface EtapeVue {
  order: number;
  tip: { title: string };
  videos?: ReadonlyArray<{ youtubeId: string; title: string; artist?: string }> | null;
  /** Vannes servies à l'abonné : sans elles, la carte n'a pas de bloc « Vannes à pratiquer ». */
  jokes?: ReadonlyArray<unknown> | null;
  quiz?: ReadonlyArray<unknown> | null;
}

/**
 * s26 parcours, tour 5 (faute dure F1 de la relecture UX v2 : « 2.2 Vannes à pratiquer » menait sur un repère sans bloc) :
 * la carte d'étape de l'abonné rend-elle le bloc de cette fiche ? Mêmes conditions que `parcours-step-card.tsx` (vannes
 * reçues, vidéo présente, quiz affiché tant qu'il n'est ni fini ni l'étape validée). Une fiche sans bloc n'est pas listée :
 * chaque ligne mène à un bloc titré de son nom.
 */
export function blocRendu(ref: BlocReference, etape: EtapeVue, etat: { etapeFaite: boolean; quizFait: boolean }): boolean {
  switch (ref.bloc) {
    case "conseil":
      return etape.tip.title.trim() !== "";
    case "vannes":
      return (etape.jokes?.length ?? 0) > 0;
    case "video":
      return !!etape.videos?.some((v) => v.youtubeId === ref.youtubeId);
    case "quiz":
      return (etape.quiz?.length ?? 0) > 0 && !etat.quizFait && !etat.etapeFaite;
  }
}

/** Libellé d'une fiche : un texte déjà en ligne (titre du conseil, titres de blocs, titre de la vidéo). */
export function libelleFiche(ref: BlocReference, etape: EtapeVue): string {
  switch (ref.bloc) {
    case "conseil":
      return etape.tip.title;
    case "vannes":
      return VANNES_ETAPE.titre;
    case "video": {
      const v = etape.videos?.find((x) => x.youtubeId === ref.youtubeId);
      return v ? (v.artist ? `${v.title} · ${v.artist}` : v.title) : "";
    }
    case "quiz":
      return QUIZ_TITRE.abonne;
  }
}

/** Clé d'un bloc de la carte d'étape : `conseil`, `vannes`, `quiz` ou `video:{youtubeId}`. */
export const cleBloc = (ref: BlocReference) => (ref.bloc === "video" ? `video:${ref.youtubeId}` : ref.bloc);

/**
 * s26 parcours, tour 7 (MESURES v4 §6.1 : « 2.2 » menait à `#fiche-2-3`) : ancre d'une sous-étape = sa numérotation
 * AFFICHÉE, `#fiche-N-k` pour « N.k ». L'ancre du découpage (`data/espace/parcours-fiches.json`, rang du bloc dans le
 * seed) reste la donnée ; `ancreDecoupage` la garde pour relire une ancre d'avant (redirection côté navigateur).
 */
export interface FicheAffichee {
  ancre: string;
  ancreDecoupage: string;
  numero: string;
  titre: string;
  cle: string;
}

/** Sous-étapes affichées d'une étape, dans l'ordre de la carte ; liste vide si l'étape n'est pas découpée. */
export function fichesAffichees(slug: string, etape: EtapeVue, etat: { etapeFaite: boolean; quizFait: boolean }): FicheAffichee[] {
  const decoupe = etapeDecoupee(slug, etape.order);
  if (!decoupe) return [];
  return decoupe.fiches
    .filter((f) => blocRendu(f.ref, etape, etat))
    .map((f) => ({ f, titre: libelleFiche(f.ref, etape) }))
    .filter(({ titre }) => titre !== "")
    .map(({ f, titre }, i) => ({
      ancre: `fiche-${etape.order}-${i + 1}`,
      ancreDecoupage: f.ancre,
      numero: `${etape.order}.${i + 1}`,
      titre,
      cle: cleBloc(f.ref),
    }));
}
